import { getFeatureCenter } from './getFeatureCenter';
import type { GeoJSONFeature } from '~/types/types';

describe('getFeatureCenter', () => {
  it('should calculate the center of a valid GeoJSON feature', () => {
    const feature: GeoJSONFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.895168, 52.370216],
            [4.896168, 52.371216],
            [4.897168, 52.372216],
            [4.895168, 52.370216],
          ],
        ],
      },
    };

    const result = getFeatureCenter(feature);

    expect(result).toEqual({
      lat: 52.370966,
      lng: 4.895918,
    });
  });

  it('should return null for a feature with empty coordinates', () => {
    const feature: GeoJSONFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [[]],
      },
    };

    const result = getFeatureCenter(feature);

    expect(result).toBeNull();
  });

  it('should handle a feature with a single coordinate', () => {
    const feature: GeoJSONFeature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [4.895168, 52.370216], // Single coordinate
          ],
        ],
      },
    };

    const result = getFeatureCenter(feature);

    expect(result).toEqual({
      lat: 52.370216,
      lng: 4.895168,
    });
  });

  it('should throw an error for invalid input (missing geometry)', () => {
    const feature = {
      type: 'Feature',
      properties: {},
    } as unknown as GeoJSONFeature;

    expect(() => getFeatureCenter(feature)).toThrow();
  });

  it('should throw an error for invalid input (missing coordinates)', () => {
    const feature = {
      type: 'Feature',
      geometry: {
        type: 'Polygon',
      },
    } as unknown as GeoJSONFeature;

    expect(() => getFeatureCenter(feature)).toThrow();
  });
});