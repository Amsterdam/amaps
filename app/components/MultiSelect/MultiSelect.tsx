import type { FunctionComponent } from "react";
import Map from "./MultiSelectMap";
import MapProvider from "./MultiSelectProvider";
import MultiSelectResult from "./MultiSelectResult";
import styles from "../../styles/main.module.css";
import Controls from "../ZoomControls";
import AddressSearch from "../AddressSearch";
import Legend from "./Legend";

const MultiSelect: FunctionComponent = () => (
  <MapProvider>
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <Map />
        <Controls multiselect={true} />
        <AddressSearch multiselect={true} />
        <Legend />
      </div>
      <div className={styles.resultWrapper}>
        <MultiSelectResult />
      </div>
    </div>
  </MapProvider>
);

export default MultiSelect;
