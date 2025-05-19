import { useCallback, useEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";
import { formatWfsUrl } from "../../utils/formatWfs";
import L, { LayerGroup, LeafletMouseEvent, Polygon } from "leaflet";
import "leaflet/dist/leaflet.css";
import getCrsRd from "../../utils/getCrsRd";
import styles from "../../styles/map.module.css";
import { useMapInstance } from "./MultiSelectContext";
import { parkingTypes } from "~/types/parkingTypes";
import type { MultiSelectProps } from "~/types/embeddedTypes";
import { fetchFeaturesById } from "~/utils/fetchFeaturesById";

const Map: FunctionComponent<MultiSelectProps> = ({ zoom = 13, center }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const createdMapInstance = useRef(false);
  const [featureLayer, setFeatureLayer] = useState<LayerGroup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

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
    selectedSpots,
    reservedSpots,
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
      } else if(layerId && selectedMarkers.includes(layerId)){
        (e.target as Polygon).setStyle({
          fillColor: "#008000",
          fillOpacity: 1,
          opacity: 1,
          weight: 2,
        });
      }
    },
    [selectedMarkers]
  );

  useEffect(() => {
    if (containerRef.current === null || createdMapInstance.current !== false) {
      return;
    }
    console.log(selectedSpots);
    const map = new L.Map(containerRef.current, {
      center: center
        ? L.latlng(center.latitude, center, longitude)
        : L.latLng(position),
      zoom: zoom ?? 13,
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

    if (selectedSpots && selectedSpots.length > 0) {
      fetchFeaturesById(selectedSpots).then((features) => {
        if (features.length === 0) return;
        setMarkerData(features);
        setSelectedMarkers(features.map((f) => f.properties.id));

        map.fitBounds(L.geoJSON(features).getBounds(), { padding: [10, 10] });
        setMapLoaded(true);
      });
    } else {
      setMapLoaded(true);
    }

    // On component unmount, destroy the map and all related events
    return () => {
      if (mapInstance) mapInstance.remove();
    };
  }, []);

  // Add the markers
  useEffect(() => {
    if (mapInstance === null || !mapLoaded) {
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

        // Check if the feature is in reservedSpots
        if (reservedSpots.includes(Number(feature.properties.id))) { 
          return {
            fillColor: color,
            color: "red",
            fillOpacity: 0.3,
            weight: 2,
          };
        }

        return {
          fillColor: color,
          color: color,
          fillOpacity: 0.1,
        };
      },
      onEachFeature: function (feature, layer) {

        if (reservedSpots.includes(Number(feature.properties.id))) {
          return;
        }

        // Add interactivity for non-reserved spots
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
            weight: 2,
          });
        });
      }
    }
  }, [selectedMarkers, featureLayer]);

  return <div className={styles.container} ref={containerRef}></div>;
};

export default Map;
