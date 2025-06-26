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
  zoom = 16,
  layer = "standaard",
  marker = false,
  search = true,
  embedded = false,
  selectedSpots = [],
  reservedSpots = [],
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
      return new URLSearchParams(window.location.search);
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
        reservedSpots,
        embedded,
        isInteractionDisabled,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
