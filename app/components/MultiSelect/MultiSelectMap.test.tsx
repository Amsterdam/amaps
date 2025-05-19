import { render, screen, waitFor } from "@testing-library/react";
import Map from "./MultiSelectMap";
import MapProvider from "./MultiSelectProvider";
import { vi } from "vitest";

describe("MultiMarkerSelect Map", () => {
  beforeEach(() => {
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(
      <MapProvider>
        <Map />
      </MapProvider>
    );
    expect(container.firstChild).toBeDefined();
  });

  it("fetches parking data and uses it in Leaflet geoJSON", async () => {
    const mockGeoJsonResponse = {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          properties: {
            id: "1",
            e_type: "parking",
          },
          geometry: {
            type: "Polygon",
            coordinates: [
              [
                [4.895168, 52.370216],
                [4.895168, 52.370216],
              ],
            ],
          },
        },
      ],
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockGeoJsonResponse,
    });

    const geoJsonMock = vi.fn((data, options) => {
      data?.features?.forEach((feature) =>
        options.onEachFeature(feature, {})
      );
      return {
        addTo: vi.fn(),
        remove: vi.fn(),
        removeFrom: vi.fn(),
      };
    });

    // Replace L.geoJson with our mock
    // @ts-expect-error missing the following properties from type
    L.geoJson = geoJsonMock;

    render(
      <MapProvider>
        <Map />
      </MapProvider>
    );

    // Wait for the fetch call and component update
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
    });

    // Wait for L.geoJson to be called
    await waitFor(() => {
      expect(geoJsonMock).toHaveBeenCalledWith(
        mockGeoJsonResponse.features,
        expect.objectContaining({
          style: expect.any(Function),
          onEachFeature: expect.any(Function),
        })
      );
    });
  });
});