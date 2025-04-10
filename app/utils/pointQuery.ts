import proj4 from "proj4";

proj4.defs(
  "EPSG:28992",
  "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
);

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
  dichtsbijzijnd_adres: BagAdres | null;
  omgevingsinfo: OmgevingsInfo | null;
  object: any;
}

function requestFormatter(baseUrl: string, xy: LatLng): string {
  const rd = transformCoords.forward([xy.lng, xy.lat]);
  return `${baseUrl}${rd[0]},${rd[1]},50`;
}

async function query<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`query failed: ${url}`);
  return res.json();
}

function responseFormatter(res: any, searchId: string | false): any {
  if (!res.results) {
    throw new Error("no results property found on query response.");
  }
  const filtered = searchId
    ? res.results.filter((x: any) => x.landelijk_id === searchId)
    : res.results.filter((x: any) => x.type_adres === "Hoofdadres");

  return filtered.length > 0 ? filtered[0] : null;
}

function findOmgevingFeature(features: any[], type: string): any | null {
  const feature = features.find((f) => f.properties.type === type);
  return feature ? feature.properties : null;
}

export async function pointQueryChain(
  click: ClickContext,
  feature: any
): Promise<PointQueryResult> {
  const xy = click.latlng;
  const nummeraanduidingId = click.resultObject?.nummeraanduiding_id ?? false;

  const bagUrl = requestFormatter(
    "https://api.data.amsterdam.nl/bag/v1.1/nummeraanduiding/?format=json&locatie=",
    xy
  );

  const bagQuery = await query<any>(bagUrl);
  const queryResult = responseFormatter(bagQuery, nummeraanduidingId);

  let dichtsbijzijnd_adres: BagAdres | null = null;

  if (queryResult) {
    const res = await query<any>(queryResult._links.self.href);
    dichtsbijzijnd_adres = {
      openbare_ruimte: res.openbare_ruimte._display,
      huisnummer: res.huisnummer,
      huisletter: res.huisletter,
      huisnummer_toevoeging: res.huisnummer_toevoeging,
      postcode: res.postcode,
      woonplaats: res.woonplaats._display,
    };
  }

  const omgevingRes = await query<any>(
    `https://api.data.amsterdam.nl/geosearch/?datasets=gebieden%2Fstadsdelen%2Cgebieden%2Fbuurten%2Cgebieden%2Fwijken&_fields=code&lat=${xy.lat}&lon=${xy.lng}&radius=50`
  );

  console.log(omgevingRes);

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

  return {
    query: xy,
    dichtsbijzijnd_adres,
    object: feature,
    omgevingsinfo,
  };
}
