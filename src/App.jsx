import "./App.css";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router";
import ByRegion from "./pages/ByRegion.jsx";
import ByDemographic from "./pages/ByDemographic.jsx";
import ByHousingType from "./pages/ByHousingType.jsx";
import Rationale from "./components/Rationale.jsx";
import IndicatorDetails from "./components/IndicatorDetails.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="citizendatadashboard/" element={<ByRegion />} />
        <Route
          path="citizendatadashboard/demographic"
          element={<ByDemographic />}
        />
        <Route
          path="citizendatadashboard/housing-type"
          element={<ByHousingType />}
        />
      </Routes>
      <Rationale />
      <IndicatorDetails />
    </>
  );
}

export default App;
