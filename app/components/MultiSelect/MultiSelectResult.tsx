import { useEffect, useMemo, useState, type FunctionComponent } from "react";
import { Button } from "@amsterdam/design-system-react";
import "../../styles/styles.module.css";
import { pointQueryChain } from "~/utils/pointQuery";
import { useMapInstance } from "./MultiSelectContext";
import { getFeatureCenter } from "~/utils/getFeatureCenter";

const MultiSelectResult: FunctionComponent = () => {
  const { selectedMarkers, setSelectedMarkers, markerData, emitter, embedded } =
    useMapInstance();
  const [results, setResults] = useState<any[]>([]);

  const selectedFeatures = useMemo(() => {
    return markerData.filter((feature) =>
      selectedMarkers.includes(feature.properties.id)
    );
  }, [selectedMarkers, markerData]);

  useEffect(() => {
    const loadDetails = async () => {
      const allDetails: any[] = [];

      for (const feature of selectedFeatures) {
        const existing = results.find(
          (r) => r.object?.properties?.id === feature.properties.id
        );

        // Don't query details we've already queried
        if (existing) {
          allDetails.push(existing);
        } else {
          const latlng = getFeatureCenter(feature);
          const featureDetails = await pointQueryChain({ latlng }, feature);
          allDetails.push(featureDetails);
        }
      }
      console.log("checking");
      console.log(emitter);
      if (emitter) {
        console.log("feature", { features: allDetails, type: "updated" });
        console.log("emitting");
        emitter.emit("feature", { features: allDetails, type: "updated" });
      }
      setResults(allDetails);
    };

    if (selectedFeatures.length) {
      loadDetails();
    } else {
      if (emitter) {
        emitter.emit("feature", { features: [], type: "empty" });
      }
      setResults([]);
    }
  }, [selectedFeatures]);

  if (embedded) {
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
          sleection.
        </p>
        <p>
          <em> The API results will appear below.</em>
        </p>
        <hr />
      </div>

      <p>
        <strong>Aantal geselecteerde features: </strong> {results.length}{" "}
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
