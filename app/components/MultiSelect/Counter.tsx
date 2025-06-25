import {FunctionComponent} from 'react';
import {useMapInstance} from './MultiSelectContext';
import styles from '../../styles/counter.module.css'

const SelectedCount: FunctionComponent = () => {
  const { results } = useMapInstance();

  // Exclude the MapURL from the count
  const parkingSpotCount = results.filter((result) => !result.MapURL).length;

  return (
    <div className={styles.counter}>
      Aantal geselecteerde parkeervakken: {parkingSpotCount}
    </div>
  );
};

export default SelectedCount;