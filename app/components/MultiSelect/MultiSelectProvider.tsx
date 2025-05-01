import type { FunctionComponent, PropsWithChildren } from "react";
import { useState } from "react";
import { LatLngTuple } from "leaflet";
import { MapContext } from "./MultiSelectContext";
import type { GeoJSONFeature } from "../../types/types";
import type { MultiSelectProps} from "../../types/embeddedTypes"

const MapProvider: FunctionComponent<PropsWithChildren<MultiSelectProps>> = ({ 
  children,
  emitter,
  center = {latitude: 52.36036, longitude: 4.89956},
  zoom = 16,
  layer = "standaard",
  marker = false,
  search = true,
  embedded = false,
 }) => {
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);
  const [position, setPosition] = useState<LatLngTuple>([center.latitude, center.longitude]);
  const [markerData, setMarkerData] = useState<GeoJSONFeature[]>([]);
  const [selectedMarkers, setSelectedMarkers] = useState<string[]>([]);
  const [selectedParkingTypes, setSelectedParkingTypes] = useState<string[]>(
    []
  );

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
        emitter,
        zoom,
        layer,
        marker,
        search,
        embedded,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};

export default MapProvider;
