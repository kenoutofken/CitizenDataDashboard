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
import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import InfoCard from "../components/InfoCard";

export default function ByRegion() {
  const [barData, setBarData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2016");
  const isTrending = selectedYear === "Trending";
  const geoRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [regions, setRegions] = useState([]);

  useEffect(() => {
    if (!geoRef.current || !geoData?.features?.length) return;

    const layer = geoRef.current;

    // Remove all existing features to avoid stale tooltips
    layer.clearLayers();

    // Add the new data
    layer.addData(geoData);

    // Rebind tooltips with fresh values
    layer.eachLayer((l) => {
      const f = l.feature;
      const name = String(f?.properties?.geographyname ?? "Unnamed");
      const val = f?.properties?.actualvalue;
      const value = Number.isFinite(val) ? val : "N/A";

      l.unbindTooltip?.();
      l.bindTooltip(`<strong>${name}</strong><br/>${value}%`, {
        sticky: true,
      });
    });
  }, [geoData, selectedYear]);

  const lineColors = ["#8884d8", "#82ca9d", "#ff7300", "#0279B1", "#5EA61B"];

  useEffect(() => {
    fetch("data/ByRegion.json")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const chartData = json
          .filter((d) => d.periodlabel === selectedYear)
          .map((d) => ({
            name: d.geographyname,
            value: d.actualvalue,
          }));
        setBarData(chartData.sort((a, b) => b.value - a.value));
        console.log("Chart Data:", chartData);

        const lineData = [];
        const trendYears = ["1996", "2001", "2006", "2011", "2016"];

        trendYears.forEach((rg) =>
          json
            .filter((d) => d.periodlabel === rg)
            .forEach((d) => {
              let yearData = lineData.find((td) => td.year === rg);
              if (!yearData) {
                yearData = {
                  year: rg,
                  [d.geographyname]: d.actualvalue,
                };
                lineData.push(yearData);
              } else {
                yearData[d.geographyname] = d.actualvalue;
              }
            })
        );
        setTrendData(lineData);
        console.log("Trend Data:", lineData);

        const geoData = {
          type: "FeatureCollection",
          features: json
            .filter(
              (d) =>
                d.periodlabel === selectedYear &&
                d.geolevelname === "Local Area"
            )
            .map((d) => {
              const val =
                typeof d.actualvalue === "number"
                  ? d.actualvalue
                  : parseFloat(d.actualvalue);

              return {
                type: "Feature",
                geometry: d.geom?.geometry ?? d.geom,
                properties: {
                  geographyname: d.geographyname,
                  actualvalue: Number.isFinite(val) ? val : null,
                },
              };
            }),
        };
        setGeoData(geoData);
        console.log("Geo Data:", geoData);
        setRefreshKey((k) => k + 1);
      });
  }, [selectedYear]);

  const toggleRegion = (region) => {
    setRegions((prev) => {
      if (prev.includes(region)) {
        // ✅ Remove it
        return prev.filter((r) => r !== region);
      } else if (prev.length < 5) {
        // ✅ Add only if under limit
        return [...prev, region];
      } else {
        // ✅ Optional: warn or ignore when limit reached
        showToast("You can select up to 5 regions only.");
        return prev;
      }
    });
  };

  const showToast = (message) => {
    const container = document.getElementById("toast-container");
    if (!container) return;

    // Clear any existing toasts (optional)
    container.innerHTML = "";

    // Create a new toast element
    const toast = document.createElement("div");
    toast.className = "alert alert-warning shadow-lg text-sm";
    toast.innerHTML = `
    <span>⚠️ ${message}</span>
  `;

    container.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const years = ["2016", "2011", "2006", "2001", "1996"];
  const regionOptions = [
    "Arbutus-Ridge",
    "CSD",
    "Downtown",
    "Dunbar-Southlands",
    "Fairview",
    "Grandview-Woodland",
    "Hastings-Sunrise",
    "Kensington-Cedar Cottage",
    "Kerrisdale",
    "Killarney",
    "Kitsilano",
    "Marpole",
    "Mount Pleasant",
    "Oakridge",
    "Renfrew-Collingwood",
    "Riley Park",
    "Shaughnessy",
    "South Cambie",
    "Strathcona",
    "Sunset",
    "Victoria-Fraserview",
    "West End",
    "West Point Grey",
  ];

  return (
    <>
      <InfoCard dataFile="ByRegionCards.json" />

      <div className="flex justify-end relative">
        {isTrending && (
          <div className="left-16 dropdown dropdown-bottom pt-20 px-12 flex justify-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline bg-base-100"
            >
              Select Regions (Up to 5) ▼
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 border border-base-content rounded-box mt-1 w-200 shadow-md"
            >
              <div className="grid grid-cols-2 gap-x-4">
                {regionOptions.map((r) => (
                  <label key={r} className="flex items-center gap-2 px-3 py-2">
                    <input
                      type="checkbox"
                      checked={regions.includes(r)}
                      onChange={() => toggleRegion(r)}
                      className="checkbox checkbox-primary"
                    />
                    <span>{r === "CSD" ? "City Average (CSD)" : r}</span>
                  </label>
                ))}
                <button
                  onClick={() => setRegions([])}
                  className="btn btn-warning btn-block mt-2"
                >
                  Clear All
                </button>
              </div>
            </ul>
            <div className="toast toast-end" id="toast-container"></div>
          </div>
        )}

        {!isTrending && (
          <div className="left-16 dropdown dropdown-bottom pt-20 px-12 flex justify-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline bg-base-100"
            >
              Sort Data by ▼
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 border border-base-content rounded-box mt-1 w-70 shadow-md"
            >
              <li>
                <button
                  onClick={() =>
                    setBarData((data) =>
                      [...data].sort((a, b) => a.name.localeCompare(b.name))
                    )
                  }
                  className="pl-6 hover:bg-primary hover:text-white"
                >
                  A to Z
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    setBarData((data) =>
                      [...data].sort((a, b) => b.value - a.value)
                    )
                  }
                  className="pl-6 hover:bg-primary hover:text-white"
                >
                  Highest to Lowest
                </button>
              </li>
              <li>
                <button
                  onClick={() =>
                    setBarData((data) =>
                      [...data].sort((a, b) => a.value - b.value)
                    )
                  }
                  className="pl-6 hover:bg-primary hover:text-white"
                >
                  Lowest to Highest
                </button>
              </li>
            </ul>
            <div className="toast toast-end" id="toast-container"></div>
          </div>
        )}

        <div className="dropdown dropdown-bottom pt-20 px-8 flex justify-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline bg-base-100"
          >
            View Data ({selectedYear}) ▼
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 border border-base-content rounded-box mt-1 w-64 shadow-md"
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

            {years.map((year) => (
              <li key={year}>
                <button
                  onClick={() => setSelectedYear(year)}
                  className="pl-6 hover:bg-primary hover:text-white"
                >
                  {year}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isTrending ? (
        <div className="flex h-[calc(100vh-12rem)] pt-8 px-12">
          <div className="relative isolate w-full overflow-hidden">
            {regions.length === 0 && (
              <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
                <div className="alert alert-info shadow-md pointer-events-auto">
                  <span>
                    Populate this chart by selecting regions in the dropdown.
                  </span>
                </div>
              </div>
            )}

            <LineChart
              style={{
                width: "100%",
                height: "100%",
              }}
              responsive
              data={trendData}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  fontSize: "16px",
                  fontWeight: 600,
                  paddingTop: "10px",
                }}
              />
              {regions.map((region, i) => (
                <Line
                  connectNulls
                  key={region}
                  type="monotone"
                  dataKey={region}
                  stroke={lineColors[i % lineColors.length]}
                  strokeWidth={4}
                  dot={true}
                  isAnimationActive={true}
                />
              ))}
            </LineChart>
          </div>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
          <div className="w-1/2 h-full min-h-[400px]">
            <MapContainer
              style={{ height: "100%", width: "100%" }}
              center={[49.2527, -123.1507]}
              zoom={12}
              scrollWheelZoom={false}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <GeoJSON
                key={`${refreshKey}`}
                data={geoData}
                fillColor="#0279b1"
                weight={1}
                opacity={1}
                color="white"
                fillOpacity={0.7}
                ref={geoRef}
                onEachFeature={(feature, layer) => {
                  layer.bindTooltip(
                    `<strong>${feature.properties.geographyname}</strong><br/>${feature.properties.actualvalue}%`,
                    { sticky: true }
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

          <div className="w-1/2 h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                layout="vertical"
                margin={{ top: 0, right: 0, bottom: 0, left: 72 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={["dataMin - 5", "dataMax + 5"]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 16 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#0279b1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
