import { useState, type FunctionComponent } from "react";
import styles from "../../styles/legend.module.css";
import { Button } from "@amsterdam/design-system-react";
import { ChevronDownIcon, ChevronUpIcon } from "@amsterdam/design-system-react-icons";

interface LegendProps {
  reservedSpots?: number[] | null;
}

const Legend: FunctionComponent<LegendProps> = ({ reservedSpots }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <div className={`${styles.legendBox} ${collapsed ? styles.collapsed : ''}`}>
      <div className={styles.toggleButtonWrapper}>
        <Button
          variant="tertiary"
          icon={collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={toggleCollapse}
          aria-expanded={!collapsed}
          className={styles.toggleButton}
        >
          {collapsed ? "Legenda" : "Verberg legenda"}
        </Button>
      </div>

      {!collapsed && (
        <div className={styles.legendContent}>
          <div className={styles.legendRow}>
            <span className={styles.labelText}>Reserveerbaar</span>
            <span
              className={styles.colorSquare}
              style={{ backgroundColor: "#3388ff" }}
            />
          </div>

          <div className={styles.legendRow}>
            <span className={styles.labelText}>Niet reserveerbaar</span>
            <span
              className={styles.colorSquare}
              style={{ backgroundColor: "#f47b7b" }}
            />
          </div>

          {reservedSpots && (
            <div className={styles.legendRow}>
              <span className={styles.labelText}>Reeds gereserveerd</span>
              <span
                className={styles.colorSquare}
                style={{ backgroundColor: "#c20202" }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Legend;
