import proj4 from "proj4";
import { parkingTypes } from "~/types/parkingTypes";

proj4.defs(
  "EPSG:28992",
  "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
);

console.log("asd")
console.log(window.env?.AMSTERDAM_API_KEY);

const transformCoords = proj4(
  proj4.defs("EPSG:4326"),
  proj4.defs("EPSG:28992")
);

export interface LatLng {
  lat: number;
  lng: number;
}

export interface ClickContext {
  latlng: LatLng;
  resultObject?: { nummeraanduiding_id?: string };
}

export interface BagAdres {
  openbare_ruimte: string;
  huisnummer: number;
  huisletter?: string;
  huisnummer_toevoeging?: string;
  postcode: string;
  woonplaats: string;
}

export interface OmgevingsInfo {
  buurtnaam: string | null;
  buurtcode: string | null;
  wijknaam: string | null;
  wijkcode: string | null;
  stadsdeelnaam: string | null;
  stadsdeelcode: string | null;
}

export interface PointQueryResult {
  query: LatLng;
  dichtstbijzijnd_adres: BagAdres | null;
  omgevingsinfo: OmgevingsInfo | null;
  object: any;
}

function requestFormatter(baseUrl: string, xy: LatLng): string {
  const rd = transformCoords.forward([xy.lng, xy.lat]);
  return `${baseUrl}X=${rd[0]}&Y=${rd[1]}&type=adres&distance=100&`;
}

async function query<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`query failed: ${url}`);
  return res.json();
}

async function getBagID(id: any): Promise<string> {
  if (!id) {
    throw new Error("No adress ID was given");
  }
  const lookupURL =
    "https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?id=";
  const res = await query<any>(lookupURL + id);

  return res.response.docs[0].nummeraanduiding_id;
}

function responseFormatter(res: any): any {
  if (!res.response.docs) {
    throw new Error("no results property found on query response.");
  }

  return res.response.docs.length > 0 ? res.response.docs[0].id : null;
}

function findOmgevingFeature(features: any[], type: string): any | null {
  const feature = features.find((f) => f.properties.type === type);
  return feature ? feature.properties : null;
}

async function getClosestBagID(xy: LatLng): Promise<string | null>{
  const baseUrl = "https://api.data.amsterdam.nl/geosearch/?datasets=benkagg/bagzoek"

  const lookupURL = `${baseUrl}&lat=${xy.lat}&lon=${xy.lng}&radius=100`
  const res = await query<any>(lookupURL);

  return res.features.length > 0 ? res.features[0].properties.id : null;
}

export async function pointQueryChain(
  click: ClickContext,
  feature?: any
): Promise<PointQueryResult> {
  const xy = click.latlng;

  // const bagUrl = requestFormatter(
  //   "https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?",
  //   xy
  // );

  // const bagQuery = await query<any>(bagUrl);
  // const queryResult = responseFormatter(bagQuery);

  // const bagID = await getBagID(queryResult);
  const bagID = await getClosestBagID(xy);
  let dichtstbijzijnd_adres: BagAdres | null = null;

  if (bagID) {
    const nummeraanduidingUrl =
      "https://api.data.amsterdam.nl/v1/bag/nummeraanduidingen/";
    const res = await query<any>(nummeraanduidingUrl + bagID + "/?format=json");
    dichtstbijzijnd_adres = {
      openbare_ruimte: res._links.ligtAanOpenbareruimte.title,
      huisnummer: res.huisnummer,
      huisletter: res.huisletter || "",
      huisnummer_toevoeging: res.huisnummertoevoeging || "",
      postcode: res.postcode,
      woonplaats: res._links.ligtInWoonplaats.title,
    };
  }

  const omgevingRes = await query<any>(
    `https://api.data.amsterdam.nl/geosearch/?datasets=gebieden%2Fstadsdelen%2Cgebieden%2Fbuurten%2Cgebieden%2Fwijken&_fields=code&lat=${xy.lat}&lon=${xy.lng}&radius=50`
  );

  const omgevingsinfo: OmgevingsInfo | null = omgevingRes
    ? {
        buurtnaam:
          findOmgevingFeature(omgevingRes.features, "gebieden/buurten")
            ?.display ?? null,
        buurtcode:
          findOmgevingFeature(omgevingRes.features, "gebieden/buurten")?.code ??
          null,
        wijknaam:
          findOmgevingFeature(omgevingRes.features, "gebieden/wijken")
            ?.display ?? null,
        wijkcode:
          findOmgevingFeature(omgevingRes.features, "gebieden/wijken")?.code ??
          null,
        stadsdeelnaam:
          findOmgevingFeature(omgevingRes.features, "gebieden/stadsdelen")
            ?.display ?? null,
        stadsdeelcode:
          findOmgevingFeature(omgevingRes.features, "gebieden/stadsdelen")
            ?.code ?? null,
      }
    : null;

  if (feature) {
    const eTypeText = parkingTypes[feature.properties.e_type]?.label;
    feature.properties.e_type_tekst = eTypeText;
  }

  return {
    query: xy,
    object: feature,
    dichtstbijzijnd_adres,
    omgevingsinfo,
  };
}
