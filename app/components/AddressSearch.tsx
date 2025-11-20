import { SearchField } from "@amsterdam/design-system-react";
import React, { useEffect, useState } from "react";
import { useMapInstance as useMapMS } from "./MultiSelect/MultiSelectContext";
import { useMapInstance as useMapPQ } from "./PointQuery/PointQueryContext";
import { usePointQuery } from "./PointQuery/PointQueryContext";
import styles from "../styles/search.module.css";
import { constructAddress } from "~/utils/constructAddress";

interface Suggestion {
  id: string;
  label: string;
  doc: any;
}

const AddressSearch = ({ multiselect }: { multiselect: boolean }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [displaySuggestions, setDisplaySuggestions] = useState(true);
  const { mapInstance } = multiselect ? useMapMS() : useMapPQ();
  const pqContext = usePointQuery();

  useEffect(() => {
    if (pqContext && pqContext.result) {
      const addressData = pqContext.result.dichtstbijzijnd_adres;
      const fullAddress = constructAddress(addressData);
      setSearchTerm(fullAddress);
    }
  }, [pqContext]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchTerm.length < 3) {
        setSuggestions([]);
        return;
      }
      if (!displaySuggestions){
        setSuggestions([]);
        setDisplaySuggestions(true);
        return;
      }
      try {
        const encodedSearchTerm = encodeURIComponent(searchTerm);
        const res = await fetch(
          `https://api.data.amsterdam.nl/dataselectie/v2/bag/search/adres?q=${encodedSearchTerm}`,
          { headers: { "x-api-key": (window as any).AMSTERDAM_API_KEY } }
        );
        const json = await res.json();
        const data = json.value ?? [];

        const addresses = data.map((doc: any) => ({
          id: doc.identificatie,
          label: `${doc.openbareruimteNaam} ${doc.huisnummer}${doc.huisletter ?? ""}${doc.huisnummertoevoeging ?? ""}, ${doc.postcode ?? ""} ${doc.woonplaatsNaam}`,
          doc,
        }));
        setSuggestions(addresses);
      } catch (err) {
        console.error("Error fetching suggestions:", err);
        setSuggestions([]);
      }
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSelect = (id: string, label: string, doc?: any) => {
    setDisplaySuggestions(false);
    setSearchTerm(label);

    if (doc && mapInstance) {
      const lat = doc.latitude;
      const lng = doc.longitude;
      if (lat && lng) {
        mapInstance.setView([lat, lng], 16);
      }
    }
  };

  // If user presses enter or search, choose the first suggestion in the list.
  const handleSubmit = (e?: React.FormEvent) => {
    if (suggestions.length > 0) {
      const suggestion = suggestions[0];
      handleSelect(suggestion.id, suggestion.label, suggestion.doc);
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <SearchField onSubmit={handleSubmit}>
        <SearchField.Input
          placeholder="Kies adres..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
          className={styles.searchInput}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSubmit();
            }
          }}
        />
        <SearchField.Button onClick={() => handleSubmit()} />
      </SearchField>
      {suggestions.length > 0 && (
        <ul className={styles.dropdown}>
          {suggestions.map(
            (s) =>
              s.label.length > searchTerm.length && (
                <li
                  key={s.id}
                  onClick={() => handleSelect(s.id, s.label, s.doc)}
                >
                  {s.label}
                </li>
              )
          )}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
