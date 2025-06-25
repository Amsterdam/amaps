const BASE_URL =
  "https://map.data.amsterdam.nl/maps/parkeervakken?REQUEST=GetFeature&SERVICE=wfs&OUTPUTFORMAT=application/json;%20subtype=geojson;%20charset=utf-8&Typename=fiscaal_parkeervakken&version=1.1.0&srsname=urn:ogc:def:crs:EPSG::4326";

export function formatWfsUrl(bounds: L.LatLngBounds): string {
  const ll = bounds.getSouthWest();
  const ur = bounds.getNorthEast();
  return `${BASE_URL}&bbox=${ll.lng},${ll.lat},${ur.lng},${ur.lat}`;
}
