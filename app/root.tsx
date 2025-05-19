import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import MultiSelect from "./components/MultiSelect/MultiSelect";
import PointQuery from "./components/PointQuery/PointQuery";

export default function Root() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/multiselect.html" element={<Navigate to="/multiselect" replace />} />
        <Route path="/pointquery.html" element={<Navigate to="/pointquery" replace />} />

        <Route path="/multiselect" element={<MultiSelect />} />
        <Route path="/pointquery" element={<PointQuery />} />
      </Routes>
    </BrowserRouter>
  );
}
