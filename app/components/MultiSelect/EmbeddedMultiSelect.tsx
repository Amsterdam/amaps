import React from "react";
import ReactDOM from "react-dom/client";
import MultiMarkerSelect from "./MultiSelect";
import "@amsterdam/design-system-css/dist/index.css";
import "@amsterdam/design-system-tokens/dist/index.css";
import "@amsterdam/design-system-tokens/dist/compact.theme.css";
import "@amsterdam/design-system-assets/font/index.css";
import "../../app.css";
import emitonoff from "emitonoff";

declare global {
  interface Window {
    multiselect: {
      createMap: (options: {
        target: string;
        onFeatures?: (features: any[]) => void;
        layer?: string;
        marker?: boolean;
        search?: boolean;
        center?: { longitude: number; latitude: number };
        zoom?: number;
        selectedSpots?: number[];
        reservedSpots?: number[];
        allowAllSpots?: boolean;
      }) => void;
    };
  }
}

window.multiselect = {
  createMap: function (options) {
    const {
      target,
      onFeatures,
      layer = "standaard",
      marker = false,
      search = true,
      center = { latitude: 52.36036, longitude: 4.89956 },
      zoom = 16,
      selectedSpots = [],
      reservedSpots = [],
      allowAllSpots = false,
    } = options;

    const container = document.getElementById(target);
    if (!container) {
      console.error(`Container "${target}" not found`);
      return;
    }

    const root = ReactDOM.createRoot(container);
    root.render(
      <MultiMarkerSelect
        onFeatures={onFeatures}
        layer={layer}
        marker={marker}
        search={search}
        center={center}
        zoom={zoom}
        selectedSpots={selectedSpots}
        reservedSpots={reservedSpots}
        allowAllSpots={allowAllSpots}
        embedded={true}
      />
    );
  },
};