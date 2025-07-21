import type { LatLngTuple, Map } from "leaflet";
import { Dispatch, SetStateAction, createContext, useContext } from "react";
import type { GeoJSONFeature } from "../../types/types";

export interface MapState {
  mapInstance: Map | null;
  position: LatLngTuple;
  markerData: GeoJSONFeature[];
  selectedMarkers: string[];
  selectedParkingTypes: string[];
  selectedSpots: number[];
  reservedSpots: number[];
  allowAllSpots: boolean;
  zoom: number;
  embedded: boolean;
}

type Action<T extends keyof MapState> = Dispatch<SetStateAction<MapState[T]>>;

export interface MapContextProps extends MapState {
  setMapInstance: Action<"mapInstance">;
  setPosition: Action<"position">;
  setMarkerData: Action<"markerData">;
  setSelectedMarkers: Action<"selectedMarkers">;
  setSelectedParkingTypes: Action<"selectedParkingTypes">;
  results: any[];
  setResults: Dispatch<SetStateAction<any[]>>;
  isInteractionDisabled: boolean;
  onFeatures?: (features: any[]) => void;
}

export const MapContext = createContext<MapContextProps | null>(null);

export function useMapInstance(): NonNullable<MapContextProps> {
  const resolved = useContext(MapContext);

  if (resolved !== undefined && resolved !== null) {
    return resolved as NonNullable<MapContextProps>;
  }

  throw Error("Fout, geen mapinstance gevonden in context.");
}
