import { Button, Icon } from "@amsterdam/design-system-react";
import {
  EnlargeIcon,
  MinimiseIcon,
} from "@amsterdam/design-system-react-icons";
import { useMapInstance as useMapMS } from "./MultiSelectContext";
import { useMapInstance as useMapPQ } from "./PointQueryContext";
import styles from "../styles/controls.module.css";
import { useLocation } from "react-router";

const Controls = () => {
  const { mapInstance } = useLocation().pathname.includes("multiselect")
    ? useMapMS()
    : useMapPQ();

  const handleZoomInClick = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() + 1);
    }
  };
  const handleZoomOutClick = () => {
    if (mapInstance) {
      mapInstance.setZoom(mapInstance.getZoom() - 1);
    }
  };

  return (
    <div className={styles.buttons}>
      <Button variant="secondary" onClick={handleZoomInClick}>
        <span className="ams-visually-hidden">Zoom in</span>
        <Icon svg={EnlargeIcon} size="level-5" />
      </Button>
      <Button variant="secondary" onClick={handleZoomOutClick}>
        <span className="ams-visually-hidden">Zoom out</span>
        <Icon svg={MinimiseIcon} size="level-5" />
      </Button>
    </div>
  );
};

export default Controls;
