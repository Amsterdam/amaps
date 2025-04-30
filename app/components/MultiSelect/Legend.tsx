import { useState, type FunctionComponent } from "react";
import { useMapInstance } from "./MultiSelectContext";
import styles from "../../styles/legend.module.css";
import {
  Button,
  Paragraph,
  Checkbox,
  Column,
} from "@amsterdam/design-system-react";
import {
  ChevronDownIcon,
  ChevronUpIcon,
} from "@amsterdam/design-system-react-icons";
import { parkingTypes } from "~/types/parkingTypes";

const Legend: FunctionComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  const { selectedParkingTypes, setSelectedParkingTypes } = useMapInstance();

  const toggleCollapse = () => setCollapsed((prev) => !prev);

  // Add or remove filter type
  const toggleType = (eType: string) => {
    if (selectedParkingTypes.includes(eType)) {
      setSelectedParkingTypes(
        selectedParkingTypes.filter((type) => type !== eType)
      );
    } else {
      setSelectedParkingTypes([...selectedParkingTypes, eType]);
    }
  };

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
          {/* <Paragraph className="ams-mb-s" id="description-f" size="small">
            Selecteer één of meerdere parkeertypen
          </Paragraph> */}
          {Object.entries(parkingTypes).map(([eType, { label, color }]) => (
            <div className={styles.legendRow} key={eType}>
              <Checkbox
                value={eType}
                checked={selectedParkingTypes.includes(eType)}
                onChange={() => toggleType(eType)}
              />
              <span className={styles.labelText}>{label}</span>
              <span
                className={styles.colorSquare}
                style={{ backgroundColor: color }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Legend;
