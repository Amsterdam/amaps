import { PropsWithChildren, useState } from "react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import type { Map } from "leaflet";
import {
  PointQueryProvider,
  useMapInstance,
  usePointQuery,
} from "./PointQueryContext";

// Helper component to test the context
const TestComponent = () => {
  const { mapInstance, setMapInstance } = useMapInstance();
  const { result, setResult } = usePointQuery()!;

  return (
    <div>
      <button onClick={() => setMapInstance({} as Map)}>
        Set Map Instance
      </button>
      <button onClick={() => setResult({ id: "1", name: "Test Result" })}>
        Set Query Result
      </button>
      <div data-testid="mapInstance">
        {mapInstance !== null ? "Map Set" : "No Map"}
      </div>
      <div data-testid="queryResult">
        {result ? JSON.stringify(result) : "No Result"}
      </div>
    </div>
  );
};

describe("PointQueryContext", () => {
  it("provides and updates context values", async () => {
    const Wrapper = ({ children }: PropsWithChildren) => {
      return <PointQueryProvider>{children}</PointQueryProvider>;
    };

    render(
      <Wrapper>
        <TestComponent />
      </Wrapper>
    );

    // Initial state
    expect(screen.getByTestId("mapInstance").textContent).toBe("No Map");
    expect(screen.getByTestId("queryResult").textContent).toBe("No Result");

    // Validate state changes
    await act(async () => {
      await userEvent.click(screen.getByText("Set Map Instance"));
    });
    expect(screen.getByTestId("mapInstance").textContent).toBe("Map Set");

    await act(async () => {
      await userEvent.click(screen.getByText("Set Query Result"));
    });
    expect(screen.getByTestId("queryResult").textContent).toBe(
      JSON.stringify({ id: "1", name: "Test Result" })
    );
  });

  it("throws error when not used within PointQueryContext provider", () => {
    // Catch the error thrown by the hook when used outside the provider
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<TestComponent />)).toThrow(
      "Fout, geen mapinstance gevonden in context."
    );
    spy.mockRestore();
  });
});