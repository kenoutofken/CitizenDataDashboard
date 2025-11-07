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
      <section className="flex flex-col bg-base-200 rounded-lg shadow-lg mx-12 mb-12">
        <Routes>
          <Route path="/" element={<ByRegion />} />
          <Route path="/demographic" element={<ByDemographic />} />
          <Route path="/housing-type" element={<ByHousingType />} />
        </Routes>
        <Rationale />
        <IndicatorDetails />
      </section>
    </>
  );
}

export default App;
