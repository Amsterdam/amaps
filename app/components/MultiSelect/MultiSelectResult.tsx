import { useEffect, useMemo, useState, type FunctionComponent } from "react";
import { Button } from "@amsterdam/design-system-react";
import "../../styles/styles.module.css";
import { pointQueryChain } from "~/utils/pointQuery";
import { useMapInstance } from "./MultiSelectContext";
import { getFeatureCenter } from "~/utils/getFeatureCenter";

const MultiSelectResult: FunctionComponent = () => {
  const {
    selectedMarkers,
    setSelectedMarkers,
    markerData,
    onFeatures,
    embedded,
    results,
    setResults,
    isInteractionDisabled,
  } = useMapInstance();

  const [header, setHeader] = useState({
    MapURL: "",
    aantalAangeklikt: 0,
    aantalGeladen: 0,
  });

  const [loadedMarkerData, setLoadedMarkerData] = useState<any[]>([]);

  const selectedFeatures = useMemo(() => {
    return markerData.filter((feature) =>
      selectedMarkers.includes(feature.properties.id)
    );
  }, [selectedMarkers, markerData]);

  const mapURL = useMemo(() => {
    const baseUrl = "https://amaps.amsterdam.nl";
    const queryParams = new URLSearchParams();
    if (selectedMarkers.length > 0) {
      queryParams.set("selectedSpots", selectedMarkers.join(","));
    }
    return `${baseUrl}/multiselect?${queryParams.toString()}`;
  }, [selectedMarkers]);

  useEffect(() => {
    setHeader({
      MapURL: mapURL,
      aantalAangeklikt: selectedMarkers.length,
      aantalGeladen: loadedMarkerData.length,
    });

    setResults([header, ...loadedMarkerData]);

    if (onFeatures) {
      onFeatures([header, ...loadedMarkerData]);
    }
  }, [mapURL, selectedMarkers, loadedMarkerData]);

  // Load details for selected features
  useEffect(() => {
    const loadDetails = async () => {
      try {
        // Filter out unselected markers from loadedMarkerData
        const filteredMarkerData = loadedMarkerData.filter((data) =>
          selectedMarkers.includes(data.object?.properties?.id)
        );

        const newMarkerData = [...filteredMarkerData];

        for (const feature of selectedFeatures) {
          const existing = newMarkerData.find(
            (r) => r.object?.properties?.id === feature.properties.id
          );

          // Don't query details we've already queried
          if (existing) {
            continue;
          }

          const latlng = getFeatureCenter(feature);
          if (latlng){
            const featureDetails = await pointQueryChain({ latlng }, feature);
            newMarkerData.push(featureDetails);

            setLoadedMarkerData([...newMarkerData]);
          }
        }

        setLoadedMarkerData(newMarkerData);
      } catch (error) {
        console.error("Er ging iets mis bij het inladen van informatie:", error);
      }
    };

    if (selectedFeatures.length) {
      loadDetails();
    } else {
      // If no features are selected, clear the loadedMarkerData
      setLoadedMarkerData([]);
    }
  }, [selectedFeatures]);

  if (embedded || isInteractionDisabled) {
    return null;
  }

  if (!selectedFeatures.length) {
    return (
      <section>
        <div style={{ marginBottom: "1rem" }}>
          <h2 className="ams-heading ams-heading--4">Multiselect Example</h2>
          <p>
            In this example clicking on an object (parking spot) will add/remove
            that object from the selection. An API is queried using the current
            selection.
          </p>
        </div>
        <hr />
        <p>
          <em> No Features selected yet.</em>
        </p>
      </section>
    );
  }

  return (
    <section>
      <div style={{ marginBottom: "1rem" }}>
        <h2 className="ams-heading ams-heading--4">Multiselect Example</h2>

        <p>
          In this example clicking on an object (parking spot) will add/remove
          that object from the selection. An API is queried using the current
          selection.
        </p>

        <p>
          <em> The API results will appear below.</em>
        </p>
        <hr />
      </div>

      <p>
        <strong>Aantal geselecteerde features: </strong> {results.length - 1}{" "}
      </p>

      <pre>{JSON.stringify(results, null, 2)}</pre>

      <Button
        variant="primary"
        type="button"
        onClick={() => setSelectedMarkers([])}
      >
        Wis selectie
      </Button>
    </section>
  );
};

export default MultiSelectResult;
