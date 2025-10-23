import { useState, type FunctionComponent } from "react";
import styles from "../../styles/legend.module.css";
import { Button } from "@amsterdam/design-system-react";
import { ChevronDownIcon, ChevronUpIcon } from "@amsterdam/design-system-react-icons";
import { parkingColors } from "~/types/parkingColors";
import { useMapInstance } from "./MultiSelectContext";

const Legend: FunctionComponent = () => {
  const { isInteractionDisabled } = useMapInstance();
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <div className={`${styles.legendBox} ${collapsed ? styles.collapsed : styles.expanded}`}>
      <div className={styles.toggleButtonWrapper}>
        <Button
          variant="tertiary"
          icon={collapsed ? <ChevronDownIcon /> : <ChevronUpIcon />}
          onClick={toggleCollapse}
          aria-expanded={!collapsed}
          className={styles.toggleButton}
        >
          Legenda
        </Button>
      </div>

      {!collapsed && (
        <div className={styles.legendContent}>
          <div className={styles.legendRow}>
            <span className={styles.labelText}>Geselecteerd</span>
            <span
              className={styles.colorSquare}
              style={{
                backgroundColor: parkingColors.selected.fillColor,
                border: `2px solid ${parkingColors.selected.borderColor}`,
              }}
            />
          </div>
          {/* Reserveerbaar */}
          <div className={styles.legendRow}>
            <span className={styles.labelText}>Reserveerbaar</span>
            <span
              className={styles.colorSquare}
              style={{
                backgroundColor: parkingColors.reservable.fillColor,
                border: `2px solid ${parkingColors.reservable.borderColor}`,
              }}
            />
          </div>

          {/* Niet reserveerbaar */}
          {!isInteractionDisabled && (
            <div className={styles.legendRow}>
              <span className={styles.labelText}>Niet reserveerbaar</span>
              <span
                className={`${styles.colorSquare} ${styles.stripes}`}
                style={
                  {
                    '--stripe-color': parkingColors.nonReservable.borderColor,
                    '--stripe-space-color': parkingColors.nonReservable.fillColor,
                    backgroundColor: parkingColors.nonReservable.fillColor,
                    border: `2px solid ${parkingColors.nonReservable.borderColor}`,
                  } as React.CSSProperties
                }
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Legend;