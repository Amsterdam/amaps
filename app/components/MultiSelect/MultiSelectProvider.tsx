import type { FunctionComponent, PropsWithChildren } from "react";
import { useState } from "react";
import { LatLngTuple } from "leaflet";
import { MapContext } from "./MultiSelectContext";
import type { GeoJSONFeature } from "../../types/types";

const MapProvider: FunctionComponent<PropsWithChildren> = ({ children }) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [position, setPosition] = useState<LatLngTuple>([52.36036, 4.89956]);
  const [markerData, setMarkerData] = useState<GeoJSONFeature[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);

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
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
