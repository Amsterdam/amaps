import { BrowserRouter, Routes, Route } from "react-router-dom";
import MultiSelect from "./components/MultiSelect";
import PointQuery from "./components/PointQuery";

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/multiselect.html" element={<MultiSelect />} />
        <Route path="/pointquery.html" element={<PointQuery />} />
      </Routes>
    </BrowserRouter>
  );
}
