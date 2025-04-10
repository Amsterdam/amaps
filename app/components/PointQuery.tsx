import type { FunctionComponent } from "react";
import PointQueryMap from "./PointQueryMap";
import { PointQueryProvider } from "./PointQueryContext";
import PointQueryResult from "./PointQueryResult";
import styles from "../styles/main.module.css";

const MultiSelect: FunctionComponent = () => (
  <PointQueryProvider>
    <div className={styles.container}>
      <div className={styles.mapWrapper}>
        <PointQueryMap />
      </div>
      <div className={styles.resultWrapper}>
        <PointQueryResult />
      </div>
    </div>
  </PointQueryProvider>
);

export default MultiSelect;
