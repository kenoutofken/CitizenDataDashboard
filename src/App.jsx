import "./App.css";
import { Navbar } from "./components/Navbar";
import { Routes, Route } from "react-router";
import ByRegion from "./pages/ByRegion.jsx";
import ByDemographic from "./pages/ByDemographic.jsx";
import ByHousingType from "./pages/ByHousingType.jsx";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<ByRegion />} />
        <Route path="/demographic" element={<ByDemographic />} />
        <Route path="/housing-type" element={<ByHousingType />} />
      </Routes>
    </>
  );
}

export default App;
