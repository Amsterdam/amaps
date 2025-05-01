import {FunctionComponent} from 'react';
import {useMapInstance} from './MultiSelectContext';
import styles from '../../styles/counter.module.css'

const SelectedCount: FunctionComponent = () => {
    const {selectedMarkers} = useMapInstance();

    return (
        <div className={styles.counter}>
            Aantal geselecteerde parkeervakken: {selectedMarkers.length}
        </div>
    )
}

export default SelectedCount;