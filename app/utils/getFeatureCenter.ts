import type { GeoJSONFeature } from "~/types/types";

export function getFeatureCenter(
  feature: GeoJSONFeature
): { lat: number; lng: number } | null {
  const coords = feature.geometry.coordinates[0];
  const average = coords.reduce(
    (acc, [lng, lat]) => ({
      lat: acc.lat + lat / coords.length,
      lng: acc.lng + lng / coords.length,
    }),
    { lat: 0, lng: 0 }
  );

  return average;
}
