import { fetchFeaturesById } from './fetchFeaturesById';
import proj4 from 'proj4';

// Mock the `proj4` library
vi.mock('proj4', () => ({
  __esModule: true,
  default: Object.assign(
    vi.fn((from, to, coords) => coords.map((coord) => coord + 0.1)), // Mock transformation
    {
      defs: vi.fn(),
    }
  ),
}));

// Mock the `fetch` API
global.fetch = vi.fn();

describe('fetchFeaturesById', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch and transform features correctly', async () => {
    // Mock API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({
        id: '1',
        straatnaam: 'Main Street',
        type: 'Parking',
        soort: 'Public',
        eType: 'Car',
        aantal: 10,
        geometry: {
          coordinates: [
            [
              [155000, 463000],
              [155001, 463001],
            ],
          ],
        },
      }),
    });

    const ids = ['1'];
    const result = await fetchFeaturesById(ids);

    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.data.amsterdam.nl/v1/parkeervakken/parkeervakken/1/'
    );

    expect(result).toEqual([
      {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [155000.1, 463000.1],
              [155001.1, 463001.1],
            ],
          ],
        },
        properties: {
          id: '1',
          street: 'Main Street',
          type: 'Parking',
          soort: 'Public',
          e_type: 'Car',
          aantal: 10,
        },
      },
    ]);
  });

  it('should filter out features without geometry', async () => {
    // Mock API response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: vi.fn().mockResolvedValueOnce({
        id: '1',
        straatnaam: 'Main Street',
        type: 'Parking',
        soort: 'Public',
        eType: 'Car',
        aantal: 10,
        geometry: null,
      }),
    });

    const ids = ['1'];
    const result = await fetchFeaturesById(ids);

    expect(result).toEqual([]);
  });

  it('should handle empty input array', async () => {
    const ids: string[] = [];
    const result = await fetchFeaturesById(ids);

    expect(global.fetch).not.toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it('should handle API errors gracefully', async () => {
    // Mock API error
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const ids = ['1'];
    await expect(fetchFeaturesById(ids)).rejects.toThrow('API Error');
  });
});