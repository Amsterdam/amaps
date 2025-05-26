import { vi } from "vitest";
import { pointQueryChain } from "./pointQuery";

// Mock the global fetch function
global.fetch = vi.fn();

describe("pointQueryChain", () => {
  it("should return a PointQueryResult object with valid data", async () => {
    const mockClick = {
      latlng: { lat: 52.370216, lng: 4.895168 },
    };
    const mockFeature = { id: "feature-1", properties: {e_type: ""} };

    // Mock responses for the API calls
    const mockBagQueryResponse = {
      response: {
        docs: [{ id: "12345" }],
      },
    };

    const mockLookupResponse = {
      response: {
        docs: [
          {
            nummeraanduiding_id: "12345",
          },
        ],
      },
    };

    const mockBagIDResponse = {
      _links: {
        ligtAanOpenbareruimte: { title: "Street A" },
        ligtInWoonplaats: { title: "City B" },
      },
      huisnummer: 10,
      huisletter: "A",
      huisnummertoevoeging: "1",
      postcode: "1234AB",
    };

    const mockOmgevingResponse = {
      features: [
        { properties: { type: "gebieden/buurten", display: "Buurt A", code: "B001" } },
        { properties: { type: "gebieden/wijken", display: "Wijk B", code: "W001" } },
        { properties: { type: "gebieden/stadsdelen", display: "Stadsdeel C", code: "S001" } },
      ],
    };

    // Mock the fetch calls
    (fetch as vi.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBagQueryResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockLookupResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockBagIDResponse,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockOmgevingResponse,
      });

    const result = await pointQueryChain(mockClick, mockFeature);

    expect(result).toEqual({
      query: mockClick.latlng,
      dichtsbijzijnd_adres: {
        openbare_ruimte: "Street A",
        huisnummer: 10,
        huisletter: "A",
        huisnummer_toevoeging: "1",
        postcode: "1234AB",
        woonplaats: "City B",
      },
      object: mockFeature,
      omgevingsinfo: {
        buurtnaam: "Buurt A",
        buurtcode: "B001",
        wijknaam: "Wijk B",
        wijkcode: "W001",
        stadsdeelnaam: "Stadsdeel C",
        stadsdeelcode: "S001",
      },
    });
  });

  it("should handle errors gracefully when an API call fails", async () => {
    const mockClick = {
      latlng: { lat: 52.370216, lng: 4.895168 },
    };
    const mockFeature = { id: "feature-1" };

    // Mock a failed fetch call
    (fetch as vi.Mock).mockResolvedValueOnce({
      ok: false,
    });

    await expect(pointQueryChain(mockClick, mockFeature)).rejects.toThrow(
      "query failed: https://api.pdok.nl/bzk/locatieserver/search/v3_1/reverse?"
    );
  });
});