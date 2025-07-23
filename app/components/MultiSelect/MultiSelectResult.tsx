import { useEffect, useMemo, useState, type FunctionComponent } from "react";
import { Button } from "@amsterdam/design-system-react";
import "../../styles/styles.module.css";
import { pointQueryChain, type PointQueryResult } from "~/utils/pointQuery";
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

  const [loadedMarkerData, setLoadedMarkerData] = useState<PointQueryResult[]>([]);
  const [prevSelected, setPrevSelected] = useState<string[]>([]);

  const mapURL = useMemo(() => {
    const baseUrl = "https://amaps.amsterdam.nl";
    const queryParams = new URLSearchParams();
    if (selectedMarkers.length > 0) {
      queryParams.set("selectedSpots", selectedMarkers.join(","));
    }
    return `${baseUrl}/multiselect?${queryParams.toString()}`;
  }, [selectedMarkers]);

  const header = useMemo(() => ({
    MapURL: mapURL,
    aantalAangeklikt: selectedMarkers.length,
    aantalGeladen: loadedMarkerData.length,
  }), [mapURL, selectedMarkers, loadedMarkerData]);

  useEffect(() => {
    setResults([header, ...loadedMarkerData]);

    if (onFeatures) {
      onFeatures([header, ...loadedMarkerData]);
    }
  }, [header, loadedMarkerData]);

  // Load details for latest selected features, or remove details if feature is unselected
  useEffect(() => {
    const newlySelected = selectedMarkers.filter(id => !prevSelected.includes(id));
    const removed = prevSelected.filter(id => !selectedMarkers.includes(id));
    setPrevSelected(selectedMarkers);

    if (removed.length > 0) {
      setLoadedMarkerData(prev =>
        prev.filter(d => !removed.includes(d.object?.properties?.id))
      );
    }

    newlySelected.forEach(async (id) => {
      const feature = markerData.find(f => f.properties.id === id);
      if (!feature) return;

      const latlng = getFeatureCenter(feature);
      if (!latlng) return;

      try {
        const featureData = await pointQueryChain({ latlng }, feature);
        setLoadedMarkerData(prev => {
          const alreadyLoaded = prev.some(d => d.object?.properties?.id === id);
          const stillSelected = selectedMarkers.includes(id)

          if (!stillSelected || alreadyLoaded) return prev;

          return [...prev, featureData];
        })
      } catch (error) {
        console.error("Er ging iets mis bij het inladen van informatie: ", error);
      }
    });

    if (selectedMarkers.length === 0) {
      setLoadedMarkerData([]);
    }
  }, [selectedMarkers]);

  if (embedded || isInteractionDisabled) {
    return null;
  }

  if (selectedMarkers.length === 0) {
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
