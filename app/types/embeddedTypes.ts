export interface MultiSelectProps {
    emitter?: any;
    onFeatures?: (features: any[]) => void;
    layer?: string;
    marker?: boolean;
    search?: boolean;
    center?: {longitude: number; latitude: number};
    zoom?: number;
    embedded?: boolean;
}