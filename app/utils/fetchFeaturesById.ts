import proj4 from "proj4";

proj4.defs(
  "EPSG:28992",
  "+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +towgs84=565.417,50.3319,465.552,-0.398957,0.343988,-1.8774,4.0725 +units=m +no_defs"
);

const rdToWgs = ([x, y]: [number, number]) =>
  proj4("EPSG:28992", "WGS84", [x, y]);

export async function fetchFeaturesById(ids: string[]) {
  const res = await Promise.all(
    ids.map((id) =>
      fetch(
        `https://api.data.amsterdam.nl/v1/parkeervakken/parkeervakken/${id}/`
      ).then((res) => res.json())
    )
  );

  const response = res
    .filter((vak) => vak.geometry)
    .map((vak) => ({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: vak.geometry.coordinates.map((coord) =>
          coord.map(rdToWgs)
        ),
      },
      properties: {
        id: vak.id,
        buurtcode: vak.buurtcode,
        straatnaam: vak.straatnaam,
        type: vak.type,
        soort: vak.soort,
        e_type: vak.eType,
        versiedatum: vak.versiedatum,
        aantal: vak.aantal,
      },
    }));

    
  return response;
}
