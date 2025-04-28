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
}

const AddressSearch = ({ multiselect }: { multiselect: boolean }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const { mapInstance } = multiselect ? useMapMS() : useMapPQ();
  const pqContext = usePointQuery();

  useEffect(() => {
    if (pqContext && pqContext.result) {
      const addressData = pqContext.result.dichtsbijzijnd_adres;
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
      const res = await fetch(
        `https://api.pdok.nl/bzk/locatieserver/search/v3_1/suggest?fq=gemeentenaam:amsterdam&fq=type:adres&q=${searchTerm}`
      );
      const json = await res.json();
      const data = json.response.docs;

      const adresses = data.map((doc: any) => ({
        id: doc.id,
        label: doc.weergavenaam,
      }));
      setSuggestions(adresses);
    };

    const debounce = setTimeout(fetchSuggestions, 500);
    return () => clearTimeout(debounce);
  }, [searchTerm]);

  const handleSelect = async (id: string, label: string) => {
    setSearchTerm(label);

    const res = await fetch(
      `https://api.pdok.nl/bzk/locatieserver/search/v3_1/lookup?fq=gemeentenaam:amsterdam&fq=type:adres&id=${id}`
    );
    const data = await res.json();
    console.log(data);
    const coordinates = data.response.docs[0]?.centroide_ll;
    console.log(coordinates);
    if (coordinates && mapInstance) {
      mapInstance.setZoom(14);
      const [lng, lat] = coordinates.match(/\d+\.\d*/g).map(Number);
      mapInstance.panTo([lat, lng], 14);
    }
  };

  // If user presses enter or search, choose the first suggestion in the list.
  const handleSubmit = (e?: React.FormEvent) => {
    if (suggestions.length > 0) {
      handleSelect(suggestions[0].id, suggestions[0].label);
    }
  };

  return (
    <div className={styles.searchWrapper}>
      <SearchField onSubmit={handleSubmit}>
        <SearchField.Input
          placeholder="Kies adres..."
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
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
          {suggestions.map((s) => (
            <li key={s.id} onClick={() => handleSelect(s.id, s.label)}>
              {s.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressSearch;
