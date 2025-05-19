import { render } from "@testing-library/react";
import PointQueryMap from "./PointQueryMap";
import { vi } from "vitest";
import L from "leaflet";

// Mock the PointQueryContext
const mockSetResult = vi.fn();
const mockSetMapInstance = vi.fn();

vi.mock("./PointQueryContext", () => ({
  usePointQuery: () => ({
    setResult: mockSetResult,
  }),
  useMapInstance: () => ({
    setMapInstance: mockSetMapInstance,
  }),
}));

describe("PointQueryMap Component", () => {
  beforeEach(() => {
    // Mock Leaflet's Map
    vi.spyOn(L, "Map").mockImplementation(() => ({
      on: vi.fn(),
      attributionControl: { setPrefix: vi.fn() },
    } as unknown as L.Map));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders without crashing", () => {
    const { container } = render(<PointQueryMap />);
    expect(container.firstChild).toBeDefined();
  });
});