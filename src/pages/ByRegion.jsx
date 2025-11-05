import {
  BarChart,
  Bar,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useMemo, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import InfoCard from "../components/InfoCard.jsx";

export default function ByRegion() {
  const [raw, setRaw] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2016");
  const [selectedAreas, setSelectedAreas] = useState([]); // for checkbox filtering

  useEffect(() => {
    fetch("/data/ByRegion.json")
      .then((r) => r.json())
      .then(setRaw)
      .catch((e) => console.error("fetch error", e));
  }, []);

  const isTrending = selectedYear === "Trending";

  // ✅ NEW: extract unique local area names per selected year
  const allAreas = useMemo(() => {
    const filtered = raw.filter(
      (d) => d.geolevelname === "Local Area" && d.periodlabel === selectedYear
    );
    return [...new Set(filtered.map((d) => d.geographyname))].sort();
  }, [raw, selectedYear]);

  // ----- trending (line) -----
  const trendData = useMemo(() => {
    if (!raw.length) return [];
    const rows = raw.filter((d) => d.geolevelname === "Local Area");
    const years = [...new Set(rows.map((d) => String(d.periodlabel)))].sort(
      (a, b) => +a - +b
    );
    const areas = [...new Set(rows.map((d) => d.geographyname))].sort();
    const byYA = new Map();
    rows.forEach((d) => {
      const key = `${String(d.periodlabel)}||${d.geographyname}`;
      const v =
        typeof d.actualvalue === "number"
          ? d.actualvalue
          : parseFloat(d.actualvalue);
      byYA.set(key, v);
    });
    return years.map((y) => {
      const row = { year: y };
      areas.forEach((a) => {
        row[a] = byYA.get(`${y}||${a}`) ?? null;
      });
      return row;
    });
  }, [raw]);

  // ----- bar (per-year) -----
  const barData = useMemo(() => {
    if (isTrending || !raw.length) return [];
    let filtered = raw.filter(
      (d) =>
        String(d.periodlabel) === String(selectedYear) &&
        d.geolevelname === "Local Area"
    );

    // ✅ NEW: apply selected area filter if any are checked
    if (selectedAreas.length > 0) {
      filtered = filtered.filter((d) => selectedAreas.includes(d.geographyname));
    }

    return filtered
      .map((d) => ({
        name: d.geographyname,
        value:
          typeof d.actualvalue === "number"
            ? d.actualvalue
            : parseFloat(d.actualvalue),
      }))
      .sort((a, b) => b.value - a.value);
  }, [raw, selectedYear, isTrending, selectedAreas]); // added selectedAreas dependency

  // ----- geojson (per-year) -----
  const geoData = useMemo(() => {
    if (isTrending || !raw.length) return null;

    let filtered = raw.filter(
      (d) =>
        String(d.periodlabel) === String(selectedYear) &&
        d.geolevelname === "Local Area"
    );

    // ✅ NEW: filter polygons by selected areas
    if (selectedAreas.length > 0) {
      filtered = filtered.filter((d) => selectedAreas.includes(d.geographyname));
    }

    const features = filtered
      .map((d) => {
        // deep-clone geometry so Leaflet doesn't reuse previous layer internals
        const srcGeom =
          d.geom?.type === "Feature"
            ? d.geom.geometry
            : d.geom?.geometry ?? d.geom;
        if (!srcGeom) return null;
        const geometry = JSON.parse(JSON.stringify(srcGeom));

        const v =
          typeof d.actualvalue === "number"
            ? d.actualvalue
            : parseFloat(d.actualvalue);

        return {
          type: "Feature",
          geometry,
          properties: {
            geographyname: d.geographyname,
            actualvalue: Number.isFinite(v) ? v : null,
            _year: String(selectedYear), // tag the year (debug-friendly)
          },
        };
      })
      .filter(Boolean);

    return { type: "FeatureCollection", features };
  }, [raw, selectedYear, isTrending, selectedAreas]); // added selectedAreas dependency

  // ---- IMPERATIVE CONTROL OF THE LAYER ----
  const geoRef = useRef(null);

  // when geoData changes, forcibly replace the layer contents
  useEffect(() => {
    if (!geoRef.current || !geoData) return;
    // blow away old layers so tooltips don't linger
    geoRef.current.clearLayers();
    // re-add with fresh properties; onEachFeature will rebind tooltips
    geoRef.current.addData(geoData);
  }, [geoData]);

  // ✅ NEW: handler for toggling checkbox selection
  const toggleArea = (area) => {
    setSelectedAreas((prev) =>
      prev.includes(area)
        ? prev.filter((a) => a !== area)
        : [...prev, area]
    );
  };

  return (
    <>
      <InfoCard dataFile="ByRegionCards.json" />

      {/* ✅ TOP DROPDOWNS ROW (side-by-side with gap) */}
      <div className="flex justify-end gap-4 pt-20 px-12 flex-wrap">
        {/* YEAR SELECT DROPDOWN */}
        <div className="dropdown dropdown-bottom">
          <div tabIndex={0} role="button" className="btn btn-outline">
            View Data ({selectedYear}) ▼
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 border border-base-content rounded-box w-64 shadow-md"
          >
            <li>
              <button
                className="text-black font-bold hover:bg-primary hover:text-white"
                onClick={() => setSelectedYear("Trending")}
              >
                View Data Trends
              </button>
            </li>

            <li className="menu-title">
              <span className="text-black font-bold">View Data by Year</span>
            </li>

            <li>
              <button
                onClick={() => setSelectedYear("2016")}
                className="pl-6 hover:bg-primary hover:text-white"
              >
                2016 (Latest)
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedYear("2011")}
                className="pl-6 hover:bg-primary hover:text-white"
              >
                2011
              </button>
            </li>
            <li>
              <button
                onClick={() => setSelectedYear("2006")}
                className="pl-6 hover:bg-primary hover:text-white"
              >
                2006
              </button>
              <button
                onClick={() => setSelectedYear("2001")}
                className="pl-6 hover:bg-primary hover:text-white"
              >
                2001
              </button>
              <button
                onClick={() => setSelectedYear("1996")}
                className="pl-6 hover:bg-primary hover:text-white"
              >
                1996
              </button>
            </li>
          </ul>
        </div>

        {/* FILTER CHECKBOXES DROPDOWN SECTION */}
        {!isTrending && (
          <div className="dropdown dropdown-bottom dropdown-end">
            <div tabIndex={0} role="button" className="btn btn-outline">
              Filter by Local Area ({selectedAreas.length} selected) ▼
            </div>

            {/* vertical scroll dropdown -- 800px height to contain 22 areas */}
            <ul
              tabIndex={0}
              className="
                dropdown-content menu menu-compact
                flex flex-col
                bg-base-100 border border-base-content rounded-box
                w-72 max-h-[800px]
                overflow-y-auto overflow-x-hidden
                shadow-md p-2
                min-w-0
              "
            >
              <li className="menu-title flex justify-between items-center mb-2 min-w-0">
                <span className="font-bold text-black">Select Areas</span>
                <div className="flex gap-1 ml-2 flex-none">
                  <button
                    className="btn btn-xs bg-[#2c6e49] text-white w-20 h-8"
                    onClick={() => setSelectedAreas(allAreas)}
                  >
                    All
                  </button>
                  <button
                    className="btn btn-xs bg-red-800 text-white w-20 h-8"
                    onClick={() => setSelectedAreas([])}
                  >
                    None
                  </button>
                </div>
              </li>

              {/* Filter by Area */}
              {allAreas.map((area) => (
                <li key={area} className="w-full min-w-0">
                  <label className="cursor-pointer flex items-center gap-2 w-full min-w-0">
                    <input
                      type="checkbox"
                      className="checkbox checkbox-sm checkbox-primary flex-none"
                      checked={selectedAreas.includes(area)}
                      onChange={() => toggleArea(area)}
                    />
                    <span className="label-text text-sm break-words whitespace-normal overflow-hidden min-w-0">
                      {area}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {isTrending ? (
        <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
          <LineChart data={trendData} style={{ width: "100%", height: "100%" }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis padding={{ bottom: 60 }} domain={[15, "dataMax + 5"]} />
            <Tooltip />
            <Legend />
            {Object.keys(trendData[0] || {})
              .filter((k) => k !== "year")
              .map((area) => (
                <Line
                  key={area}
                  dataKey={area}
                  type="monotone"
                  dot={false}
                  strokeWidth={8}
                />
              ))}
          </LineChart>
        </div>
      ) : (
        <div className="flex flex-col gap-6 h-[calc(100vh-12rem)] pt-12 px-12">
          {/* MAP + BAR CHART LAYOUT */}
          <div className="flex flex-col md:flex-row gap-6 flex-1">
            <div className="w-full md:w-1/2 h-[500px] md:h-full">
              <MapContainer
                style={{ height: "100%", width: "100%" }}
                center={[49.2527, -123.1507]}
                zoom={13}
                scrollWheelZoom={false}
              >
                <TileLayer
                  attribution="&copy; OpenStreetMap contributors"
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {/* mount the GeoJSON once; we push fresh data via ref */}
                <GeoJSON
                  ref={geoRef}
                  data={{ type: "FeatureCollection", features: [] }}
                  style={() => ({
                    color: "#5EA61B",
                    weight: 2,
                    fillOpacity: 0.3,
                  })}
                  onEachFeature={(feature, layer) => {
                    // always bind tooltip from current properties
                    const name = feature.properties?.geographyname ?? "Unnamed";
                    const rawVal = feature.properties?.actualvalue;
                    const value =
                      typeof rawVal === "number"
                        ? rawVal
                        : parseFloat(rawVal);
                    layer.bindTooltip(
                      `<strong>${name}</strong><br/>Value: ${
                        Number.isFinite(value) ? value : "N/A"
                      }`,
                      { permanent: false }
                    );
                  }}
                />
                <Marker position={[51.505, -0.09]}>
                  <Popup>
                    A pretty CSS3 popup.
                    <br />
                    Easily customizable.
                  </Popup>
                </Marker>
              </MapContainer>
            </div>

            <div className="w-full md:w-1/2 h-[500px] md:h-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 0, right: 0, bottom: 0, left: 72 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, "dataMax + 5"]} />
                  <YAxis
                    dataKey="name"
                    type="category"
                    width={140}
                    tick={{ fontSize: 16 }}
                  />
                  <Tooltip />
                  <Bar dataKey="value" fill="#2c6e49" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
