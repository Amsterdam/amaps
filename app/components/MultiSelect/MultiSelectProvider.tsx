import type { FunctionComponent, PropsWithChildren } from "react";
import { useState } from "react";
import { LatLngTuple } from "leaflet";
import { MapContext } from "./MultiSelectContext";
import type { GeoJSONFeature } from "../../types/types";
import type { MultiSelectProps } from "../../types/embeddedTypes";

const MapProvider: FunctionComponent<PropsWithChildren<MultiSelectProps>> = ({
  children,
  onFeatures,
  center = { latitude: 52.36036, longitude: 4.89956 },
  zoom = 13,
  layer = "standaard",
  marker = false,
  search = true,
  embedded = false,
  selectedSpots = [],
  reservedSpots = [],
  allowAllSpots = false,
}) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [position, setPosition] = useState<LatLngTuple>([
    center.latitude,
    center.longitude,
  ]);
  const [markerData, setMarkerData] = useState<GeoJSONFeature[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [selectedParkingTypes, setSelectedParkingTypes] = useState<string[]>(
    []
  );
  const [results, setResults] = useState<any[]>([]);

  // Helper function to parse query parameters from the URL
  const getQueryParams = (): URLSearchParams => {
    if (typeof window !== "undefined") {
    // Fix for handling cases where the "&" in the MapURL is incorrectly encoded as "enamp;".
    // This issue originates from the third-party system which receives the MapURL.
    // The third-party system applies additional encoding to the MapURL returned by Amaps, which turns "&" into "enamp;".
    // While the root cause lies in the external system, fixing it there is not currently feasible due to their use of low-code software.
      const queryString = window.location.search.replace(/enamp;/g, "&");

      return new URLSearchParams(queryString);
    }
    return new URLSearchParams(); // Fallback for non-browser environments like when embedded
  };

  const [initializedSelectedSpots] = useState(() => {
    if (!embedded) {
      const queryParams = getQueryParams();
      const selectedSpotsFromUrl = queryParams.get("selectedSpots");
      if (selectedSpotsFromUrl) {
        const spotIds = selectedSpotsFromUrl.split(",").map(Number);
        return Array.from(new Set([...selectedSpots, ...spotIds])); // Merge with existing selectedSpots
      }
    }
    return selectedSpots;
  });

  const [initializedAllowAllSpots] = useState(() => {
    if (!embedded) {
      const queryParams = getQueryParams();
      return queryParams.get("allowAllSpots") === "true" || allowAllSpots;
    }
    return allowAllSpots;
  });

  // Ensure that reservedSpots is a list of numbers
  const initializedReservedSpots = reservedSpots.map(Number);

  const isInteractionDisabled = !!getQueryParams().get("selectedSpots");

  return (
    <MapContext.Provider
      value={{
        mapInstance,
        setMapInstance,
        position,
        setPosition,
        markerData,
        setMarkerData,
        selectedMarkers,
        setSelectedMarkers,
        selectedParkingTypes,
        setSelectedParkingTypes,
        results,
        setResults,
        onFeatures,
        zoom,
        layer,
        marker,
        search,
        selectedSpots: initializedSelectedSpots,
        reservedSpots: initializedReservedSpots,
        allowAllSpots: initializedAllowAllSpots,
        embedded,
        isInteractionDisabled,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
