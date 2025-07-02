export interface MultiSelectProps {
  onFeatures?: (features: any[]) => void;
  layer?: string;
  marker?: boolean;
  search?: boolean;
  center?: { longitude: number; latitude: number };
  zoom?: number;
  embedded?: boolean;
  selectedSpots?: number[];
  reservedSpots?: number[];
  allowAllSpots?: boolean;
}
