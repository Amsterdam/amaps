import { createContext, useContext, useState, type ReactNode } from "react";

type PointQueryResult = any;

export interface PointQueryContextType {
  result: PointQueryResult | null;
  setResult: (result: PointQueryResult | null) => void;
}

const PointQueryContextType = createContext<PointQueryContextType | null>(null);

export const PointQueryProvider = ({ children }: { children: ReactNode }) => {
  const [result, setResult] = useState<PointQueryResult | null>(null);

  return (
    <PointQueryContextType.Provider value={{ result, setResult }}>
      {children}
    </PointQueryContextType.Provider>
  );
};

export const usePointQuery = () => useContext(PointQueryContextType);
