import type { FunctionComponent } from "react";
import Map from "./MultiSelectMap";
import MapProvider from "./MultiSelectProvider";
import MultiSelectResult from "./MultiSelectResult";
import styles from "../styles/main.module.css";

const MultiSelect: FunctionComponent = () => (
  <MapProvider>
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <Map />
      </div>
      <div className={styles.resultWrapper}>
        <MultiSelectResult />
      </div>
    </div>
  </MapProvider>
);

export default MultiSelect;
