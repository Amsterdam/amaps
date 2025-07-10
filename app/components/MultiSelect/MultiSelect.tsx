import type { FunctionComponent } from "react";
import Counter from "./Counter";
import Map from "./MultiSelectMap";
import MapProvider from "./MultiSelectProvider";
import MultiSelectResult from "./MultiSelectResult";
import styles from "../../styles/main.module.css";
import Controls from "../ZoomControls";
import AddressSearch from "../AddressSearch";
import Legend from "./Legend";
import type { MultiSelectProps } from "../../types/embeddedTypes";
import { useMapInstance } from "./MultiSelectContext";

const MultiSelectInner: FunctionComponent<MultiSelectProps> = (props) => {
  const { isInteractionDisabled } = useMapInstance();

  const wrapperFlexStyle = {
    flex: props.embedded || isInteractionDisabled ? 0 : 1,
    padding: props.embedded || isInteractionDisabled ? 0 : 16,
  };

  return (
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <Map />
        {!isInteractionDisabled && <Controls multiselect={true} />}
        {!isInteractionDisabled && <AddressSearch multiselect={true} />}
        <Legend />
        <Counter />
      </div>
      <div className={styles.resultWrapper} style={wrapperFlexStyle}>
        <MultiSelectResult />
      </div>
    </div>
  );
};

const MultiSelect: FunctionComponent<MultiSelectProps> = (props) => (
  <MapProvider {...props}>
    <MultiSelectInner {...props} />
  </MapProvider>
);

export default MultiSelect;
