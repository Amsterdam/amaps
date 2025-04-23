import { useCallback, useEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";
import { formatWfsUrl } from "../../utils/formatWfs";
import L, { LayerGroup, LeafletMouseEvent, Polygon } from "leaflet";
import "leaflet/dist/leaflet.css";
import getCrsRd from "../../utils/getCrsRd";
import styles from "../../styles/map.module.css";
import { useMapInstance } from "./MultiSelectContext";
import type { MultiMarkerSelectExampleLayer } from "../../types/types";
import { parkingTypes } from "~/types/parkingTypes";

const Map: FunctionComponent = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const createdMapInstance = useRef(false);
  const [featureLayer, setFeatureLayer] = useState<LayerGroup | null>(null);

  const {
    mapInstance,
    setMapInstance,
    position,
    setPosition,
    markerData,
    setMarkerData,
    selectedMarkers,
    setSelectedMarkers,
    selectedParkingTypes,
  } = useMapInstance();

  const onMarkerClick = useCallback(
    (e: LeafletMouseEvent) => {
      if (selectedMarkers.includes(e.sourceTarget.feature.properties.id)) {
        setSelectedMarkers([
          ...selectedMarkers.filter(
            (marker) => marker !== e.sourceTarget.feature.properties.id
          ),
        ]);
      } else {
        setSelectedMarkers([
          ...selectedMarkers,
          e.sourceTarget.feature.properties.id,
        ]);
      }
    },
    [featureLayer, selectedMarkers]
  );

  const onMouseOver = useCallback((e: LeafletMouseEvent) => {
    (e.target as Polygon).setStyle({
      fillColor: "#008000",
      fillOpacity: 0.8,
    });
  }, []);

  const onMouseOut = useCallback(
    (e: LeafletMouseEvent) => {
      const polygon = e.target as Polygon;
      const properties = polygon.feature?.properties;
      const layerId = properties?.id;
      const parkingType = properties?.e_type;
      const color = parkingTypes[parkingType]?.color || "#3388ff";

      if (layerId && !selectedMarkers.includes(layerId)) {
        (e.target as Polygon).setStyle({
          fillColor: color,
          fillOpacity: 0.1,
          color: color,
        });
      }
    },
    [selectedMarkers]
  );

  useEffect(() => {
    if (containerRef.current === null || createdMapInstance.current !== false) {
      return;
    }

    const map = new L.Map(containerRef.current, {
      center: L.latLng(position),
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

    // Remove Leaflet link from the map
    map.attributionControl.setPrefix(false);

    createdMapInstance.current = true;
    setMapInstance(map);

    map.on("moveend", () => {
      // setDisplayAlert(true);
      setPosition([map.getCenter().lat, map.getCenter().lng]);
    });

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, []);

  // Add the markers
  useEffect(() => {
    if (mapInstance === null) {
      return;
    }

    const loadData = async () => {
      const zoom = mapInstance.getZoom();

      // Only query for parkeervakken if map is zoomed in to avoid large query results
      if (zoom >= 12) {
        const bounds = mapInstance.getBounds();
        const url = formatWfsUrl(bounds);
        try {
          const res = await fetch(url);
          const geo = await res.json();
          setMarkerData((prev) => {
            const fetched = geo.features;
            const filteredFetched =
              selectedParkingTypes.length > 0
                ? fetched.filter((f) =>
                    selectedParkingTypes.includes(f.properties.e_type)
                  )
                : fetched;

            const fetchedIds = new Set(
              filteredFetched.map((f) => f.properties.id)
            );

            // Include markers that are selected but not in the current query result
            const preservedSelected = prev.filter(
              (f) =>
                selectedMarkers.includes(f.properties.id) &&
                !fetchedIds.has(f.properties.id)
            );
            return [...filteredFetched, ...preservedSelected];
          });
        } catch (e) {
          console.error("Failed ot fetch parking data: ", e);
        }
      } else {
        // Delete all markers except for the ones already selected
        setMarkerData((prev) =>
          prev.filter((f) => selectedMarkers.includes(f.properties.id))
        );
      }
    };

    loadData();

    const handleMoveEnd = () => {
      setPosition([mapInstance.getCenter().lat, mapInstance.getCenter().lng]);
      loadData();
    };

    mapInstance.on("moveend", handleMoveEnd);

    return () => {
      mapInstance.off("moveend", handleMoveEnd);
    };
  }, [mapInstance, selectedMarkers, selectedParkingTypes]);

  // Add the markers
  useEffect(() => {
    if (mapInstance === null) {
      return;
    }

    const layerGroup = L.geoJson(markerData, {
      style: (feature) => {
        const parkingType = feature.properties.e_type;
        const color = parkingTypes[parkingType]?.color || "#3388ff";

        return {
          fillColor: color,
          color: color,
          fillOpacity: 0.1,
        };
      },
      onEachFeature: function (_feature, layer) {
        layer.on("mouseover", onMouseOver);
        layer.on("mouseout", onMouseOut);
        layer.on("click", onMarkerClick);
      },
    });

    layerGroup.addTo(mapInstance);
    setFeatureLayer(layerGroup);

    return () => {
      if (layerGroup) layerGroup.removeFrom(mapInstance);
    };
  }, [mapInstance, selectedMarkers, markerData]);

  // Handle active markers
  useEffect(() => {
    if (featureLayer === null) {
      return;
    }

    if (selectedMarkers.length) {
      const polygons = featureLayer.getLayers() as L.Polygon[];
      const selectedPolygons = polygons.filter((polygon) => {
        const layerId = polygon?.feature?.properties?.id;

        if (layerId) {
          return selectedMarkers.includes(layerId);
        }

        return false;
      });

      if (selectedPolygons) {
        selectedPolygons.forEach((selectedPolygon) => {
          selectedPolygon.setStyle({
            fillColor: "#008000",
            fillOpacity: 1,
            opacity: 1,
          });
        });
      }
    }
  }, [selectedMarkers, featureLayer]);

  return <div className={styles.container} ref={containerRef} />;
};

export default Map;
