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

const MultiSelect: FunctionComponent<MultiSelectProps> = (props) => (
  <MapProvider {...props}>
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <Map />
        <Controls multiselect={true} />
        <AddressSearch multiselect={true} />
        <Legend reservedSpots={props.reservedSpots} />
        <Counter />
      </div>
      <div
        className={styles.resultWrapper}
        style={{
          flex: props.embedded ? 0 : 1,
          padding: props.embedded ? 0 : 16,
        }}
      >
        <MultiSelectResult />
      </div>
    </div>
  </MapProvider>
);

export default MultiSelect;
