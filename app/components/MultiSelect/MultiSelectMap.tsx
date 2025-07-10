import { useCallback, useEffect, useRef, useState } from "react";
import type { FunctionComponent } from "react";
import { formatWfsUrl } from "../../utils/formatWfs";
import L, { LayerGroup, LeafletMouseEvent, marker, Polygon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.pattern";
import getCrsRd from "../../utils/getCrsRd";
import styles from "../../styles/map.module.css";
import { useMapInstance } from "./MultiSelectContext";
import { parkingTypes } from "~/types/parkingTypes";
import type { MultiSelectProps } from "~/types/embeddedTypes";
import { fetchFeaturesById } from "~/utils/fetchFeaturesById";
import { parkingColors } from "~/types/parkingColors";
import type { Feature } from "geojson";

const Map = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const createdMapInstance = useRef(false);
  const mapRef = useRef<L.Map | null>(null);
  const [featureLayer, setFeatureLayer] = useState<LayerGroup | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const [pattern, setPattern] = useState<any>(null);
  const [idLayer, setIdLayer] = useState<LayerGroup | null>(null);

  const {
    mapInstance,
    setMapInstance,
    position,
    setPosition,
    markerData,
    setMarkerData,
    zoom,
    center,
    selectedMarkers,
    setSelectedMarkers,
    selectedSpots,
    reservedSpots,
    allowAllSpots,
    isInteractionDisabled,
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
      fillColor: "#b8b8b8",
      fillOpacity: 0.8,
    });
  }, []);

  const onMouseOut = useCallback(
    (e: LeafletMouseEvent) => {
      const polygon = e.target as Polygon;
      const properties = polygon.feature?.properties;
      const layerId = properties?.id;
      const parkingType = properties?.e_type;
      const isReservable = parkingTypes[parkingType]?.reservable || allowAllSpots;

      if (layerId && !selectedMarkers.includes(layerId)) {
          polygon.setStyle({
            fillColor: parkingColors[isReservable ? "reservable" : "nonReservable"].fillColor,
            fillOpacity: 0.1,
            color: parkingColors[isReservable ? "reservable" : "nonReservable"].borderColor,
            weight: parkingColors[isReservable ? "reservable" : "nonReservable"].weight,
          });
      } else if (layerId && selectedMarkers.includes(layerId)) {
        polygon.setStyle({
          fillColor: parkingColors.selected.fillColor,
          color: parkingColors.selected.borderColor,
          fillOpacity: 1,
          opacity: 1,
          weight: parkingColors.selected.weight,
        });
      }
    },
    [selectedMarkers]
  );

  useEffect(() => {
    if (containerRef.current === null || mapRef.current !== null) {
      return;
    }

    const map = new L.Map(containerRef.current, {
      center: center
        ? L.latlng(center.latitude, center.longitude)
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
      dragging: !isInteractionDisabled,
      touchZoom: !isInteractionDisabled,
      scrollWheelZoom: !isInteractionDisabled,
      doubleClickZoom: !isInteractionDisabled,
      boxZoom: !isInteractionDisabled,
      keyboard: !isInteractionDisabled,
    });

    // Remove Leaflet link from the map
    map.attributionControl.setPrefix(false);

    createdMapInstance.current = true;
    mapRef.current = map;
    setMapInstance(map);

    const stripesPattern = new (L as any).StripePattern({
      weight: 2,
      spaceWeight: 9,
      color: parkingColors.nonReservable.borderColor,
      spaceColor: parkingColors.nonReservable.fillColor,
      spaceOpacity: 1.0,
      angle: 0,
      opacity: 1.0,
    })
    stripesPattern.addTo(mapRef.current!)
    setPattern(stripesPattern);

    map.on("moveend", () => {
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
     if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
     }
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

            // Filter based on reservable status
            const filteredFetched = fetched.filter((f) => {
              const parkingType = f.properties.e_type;
              return parkingTypes[parkingType]?.reservable !== undefined;
            });

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
  }, [mapInstance, selectedMarkers]);

  // Add the markers
  useEffect(() => {
    if (mapInstance === null) {
      return;
    }

    const layerGroup = L.geoJson(markerData, {
      style: (feature) => {
        if (!feature) {
          return {};
        }
        const parkingType = feature.properties.e_type;
        const isReservable = parkingTypes[parkingType]?.reservable || allowAllSpots;
        if (reservedSpots.includes(Number(feature.properties.id))) {
          return {
            fillColor: parkingColors.reedsGereserveerd.fillColor,
            color: parkingColors.reedsGereserveerd.borderColor,
            fillOpacity: 0.8,
            weight: parkingColors.reedsGereserveerd.weight,
          };
        } else if (isReservable) {
          return {
            fillColor: parkingColors.reservable.fillColor,
            color: parkingColors.reservable.borderColor,
            fillOpacity: 0.1,
            weight: parkingColors.reservable.weight,
          };
        } else {
          return {
            fillPattern: pattern,
            fillColor: parkingColors.nonReservable.fillColor,
            color: parkingColors.nonReservable.borderColor,
            fillOpacity: 0.7,
            weight: parkingColors.nonReservable.weight,
          };
        }
      },
      onEachFeature: function (feature: Feature, layer: L.Polygon) {
        const parkingType = feature.properties.e_type;
        const isReservable = parkingTypes[parkingType]?.reservable || allowAllSpots;
        if (reservedSpots.includes(Number(feature.properties.id)) || !isReservable || isInteractionDisabled) {
          layer.options.interactive = false;
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

    if (idLayer) {
      idLayer.remove();
    }

    if (mapInstance.getZoom() >= 16) {
      const labelGroup = L.layerGroup();
      markerData.forEach((feature: Feature) => { 
        const latlngs = feature.geometry.coordinates[0].map(coord => 
          L.latLng(coord[1], coord[0])
        );
        const center = L.polygon(latlngs).getBounds().getCenter();

        const id = feature.properties?.id;
        const label = L.marker(center, {
          icon: L.divIcon({
            html: `<div class="label-text">${id}</div>`,
            iconSize: [0,0],
            iconAnchor: [0,0],
          }),
          interactive: false,
        });

        labelGroup.addLayer(label);
      });

      labelGroup.addTo(mapInstance);
      setIdLayer(labelGroup);
    }

    return () => {
      if (layerGroup) layerGroup.removeFrom(mapInstance);
      if (idLayer) {
        idLayer.removeFrom(mapInstance);
        setIdLayer(null);
      }
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
            fillColor: parkingColors.selected.fillColor,
            color: parkingColors.selected.borderColor,
            fillOpacity: 1,
            opacity: 1,
            weight: parkingColors.selected.weight,
          });
          selectedPolygon.bringToFront();
        });
      }
    }
  }, [selectedMarkers, featureLayer]);

  return <div className={styles.container} ref={containerRef}></div>;
};

export default Map;
