import "./App.css";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router";
import { Header } from "./components/Header.jsx";
import ByRegion from "./pages/ByRegion.jsx";
import ByDemographic from "./pages/ByDemographic.jsx";
import ByHousingType from "./pages/ByHousingType.jsx";
import Rationale from "./components/Rationale.jsx";
import IndicatorDetails from "./components/IndicatorDetails.jsx";

function App() {
  return (
    <>
      <Header />
      <Navbar />
      <Routes>
        <Route path="/" element={<ByRegion />} />
        <Route path="/demographic" element={<ByDemographic />} />
        <Route path="/housing-type" element={<ByHousingType />} />
      </Routes>
      <Rationale />
      <IndicatorDetails />
    </>
  );
}

export default App;
