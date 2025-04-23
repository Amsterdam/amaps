import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
  type ReactNode,
} from "react";
import type { LatLngTuple, Map } from "leaflet";

type PointQueryResult = any;

export interface PointQueryContextType {
  mapInstance: Map | null;
  setMapInstance: Dispatch<SetStateAction<Map | null>>;
  result: PointQueryResult | null;
  setResult: (result: PointQueryResult | null) => void;
}

const PointQueryContext = createContext<PointQueryContextType | null>(null);

export const PointQueryProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<PointQueryResult | null>(null);
  const [mapInstance, setMapInstance] = useState<Map | null>(null);

  return (
    <PointQueryContext.Provider
      value={{ result, setResult, mapInstance, setMapInstance }}
    >
      {children}
    </PointQueryContext.Provider>
  );
};

export function useMapInstance(): NonNullable<
  Pick<PointQueryContextType, "mapInstance" | "setMapInstance">
> {
  const context = useContext(PointQueryContext);

  if (!context) throw Error("Fout, geen mapinstance gevonden in context.");

  return {
    mapInstance: context.mapInstance,
    setMapInstance: context.setMapInstance,
  };
}

export const usePointQuery = () => useContext(PointQueryContext);
