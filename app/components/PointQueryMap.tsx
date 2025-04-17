import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styles from "../styles/map.module.css";
import getCrsRd from "../utils/getCrsRd";
import { usePointQuery, useMapInstance } from "./PointQueryContext";
import { pointQueryChain } from "../utils/pointQuery";

const PointQueryMap = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const { setResult } = usePointQuery();
  const { setMapInstance } = useMapInstance();

  useEffect(() => {
    if (containerRef.current === null || mapRef.current) {
      return;
    }

    const map = new L.Map(containerRef.current, {
      center: L.latLng(52.37, 4.8952),
      zoom: 13,
      layers: [
        L.tileLayer("https://{s}.data.amsterdam.nl/topo_rd/{z}/{x}/{y}.png", {
          attribution: "",
          subdomains: ["t1", "t2", "t3", "t4"],
          tms: true,
        }),
      ],
      zoomControl: false,
      maxZoom: 16,
      minZoom: 6,
      crs: getCrsRd(),
      maxBounds: [
        [52.25168, 4.64034],
        [52.50536, 5.10737],
      ],
    });

    mapRef.current = map;
    setMapInstance(map);

    // Remove Leaflet link from the map
    map.attributionControl.setPrefix(false);

    map.on("click", async (e) => {
      if (markerRef.current) {
        markerRef.current.setLatLng(e.latlng);
      } else {
        markerRef.current = L.marker(e.latlng).addTo(map);
      }

      const result = await pointQueryChain({ latlng: e.latlng });
      setResult(result);
    });
  }, []);

  return <div className={styles.container} ref={containerRef} />;
};

export default PointQueryMap;
