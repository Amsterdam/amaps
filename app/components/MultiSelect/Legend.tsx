import { useState, type FunctionComponent } from "react";
import styles from "../../styles/legend.module.css";
import { Button } from "@amsterdam/design-system-react";
import { ChevronDownIcon, ChevronUpIcon } from "@amsterdam/design-system-react-icons";
import { parkingColors } from "~/types/parkingColors";

interface LegendProps {
  reservedSpots?: number[] | null;
}

const Legend: FunctionComponent<LegendProps> = ({ reservedSpots }) => {
  const [collapsed, setCollapsed] = useState(true);
  const toggleCollapse = () => setCollapsed((prev) => !prev);

  return (
    <div className={`${styles.legendBox} ${collapsed ? styles.collapsed : ""}`}>
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
          <div className={styles.legendRow}>
            <span className={styles.labelText}>Niet reserveerbaar</span>
            <span
              className={styles.colorSquare}
              style={{
                backgroundColor: parkingColors.nonReservable.fillColor,
                border: `2px solid ${parkingColors.nonReservable.borderColor}`,
              }}
            />
          </div>

          {/* Reeds gereserveerd */}
          {reservedSpots && (
            <div className={styles.legendRow}>
              <span className={styles.labelText}>Reeds gereserveerd</span>
              <span
                className={styles.colorSquare}
                style={{
                  backgroundColor: parkingColors.reedsGereserveerd.fillColor,
                  border: `2px solid ${parkingColors.reedsGereserveerd.borderColor}`,
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Legend;