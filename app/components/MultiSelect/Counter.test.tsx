import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom"; // Import jest-dom matchers
import SelectedCount from "./Counter";

// Mock the useMapInstance function from MultiSelectContext
vi.mock("./MultiSelectContext.ts", () => ({
  useMapInstance: vi.fn(() => ({
    selectedMarkers: ["1234", "5678", "9012"], // Mock selected markers
    results: [{ id: "1234" }, { id: "5678" }, { id: "9012" }], // Mock results
  })),
}));

describe("SelectedCount Component", () => {
  it("renders the component", () => {
    const { container } = render(<SelectedCount />);
    expect(container.firstChild).toBeDefined();
  });

  it("displays the correct count of selected markers", () => {
    render(<SelectedCount />);
    expect(
      screen.getByText(/Aantal geselecteerde parkeervakken: 3/i)
    ).toBeInTheDocument();
  });
});