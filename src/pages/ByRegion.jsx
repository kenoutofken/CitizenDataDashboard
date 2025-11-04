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
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import InfoCard from "../components/InfoCard.jsx";

export default function ByRegion() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);
  const [selectedYear, setSelectedYear] = useState("2016");

  useEffect(() => {
    // if file is in /public/data, use a leading slash
    fetch("/data/ByRegion.json")
      .then((res) => res.json())
      .then((json) => {
        // ✅ filter: specific period + Local Area only (exclude CSD)
        const filtered = json.filter(
          (d) =>
            d.periodlabel === selectedYear &&
            d.geolevelname === "Local Area" &&
            d.geographyname !== "CSD"
        );

        // chart data
        const chartData = filtered
          .map((d) => ({
            name: d.geographyname,
            value:
              typeof d.actualvalue === "number"
                ? d.actualvalue
                : parseFloat(d.actualvalue),
          }))
          .sort((a, b) => b.value - a.value); // sort descending
        setData(chartData);

        // map data: ensure each feature has properties we’ll use
        const featureCollection = {
          type: "FeatureCollection",
          features: filtered.map((d) => {
            // d.geom in your file looks like a GeoJSON Feature
            // Make sure it has properties we need:
            const feature =
              d.geom && d.geom.type === "Feature"
                ? { ...d.geom }
                : {
                    type: "Feature",
                    geometry: d.geom?.geometry,
                    properties: {},
                  };

            feature.properties = {
              ...(feature.properties || {}),
              geographyname: d.geographyname,
              actualvalue:
                typeof d.actualvalue === "number"
                  ? d.actualvalue
                  : parseFloat(d.actualvalue),
            };
            return feature;
          }),
        };
        setGeoData(featureCollection);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [selectedYear]);

  return (
    <>
      <InfoCard dataFile="ByRegionCards.json" />

      <div className="dropdown dropdown-bottom pt-20 px-12 flex justify-end">
        <div tabIndex={0} role="button" className="btn btn-outline">
          View Data Options ▼
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 border border-base-content rounded-box w-64 shadow-md"
        >
          <li>
            <button onClick={() => setSelectedYear("Trending")}>
              View Data Trends
            </button>
          </li>

          <li className="menu-title">
            <span className="text-black">View Data by Year</span>
          </li>

          <li>
            <button onClick={() => setSelectedYear("2016")} className="pl-6">
              2016 (Latest)
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedYear("2011")} className="pl-6">
              2011
            </button>
          </li>
          <li>
            <button onClick={() => setSelectedYear("2006")} className="pl-6">
              2006
            </button>
            <button onClick={() => setSelectedYear("2001")} className="pl-6">
              2001
            </button>
            <button onClick={() => setSelectedYear("1996")} className="pl-6">
              1996
            </button>
          </li>
        </ul>
      </div>

      <div className="flex h-svh pt-12 px-12">
        <div className="w-1/2 h-full">
          <MapContainer
            className="h-full w-full"
            center={[49.2527, -123.1507]}
            zoom={12}
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {geoData && (
              <GeoJSON
                data={geoData}
                style={() => ({
                  color: "#2c6e49",
                  weight: 2,
                  fillOpacity: 0.3,
                })}
                onEachFeature={(feature, layer) => {
                  const name = feature.properties?.geographyname || "Unnamed";
                  const value = feature.properties?.actualvalue || "N/A";
                  layer.bindTooltip(
                    `<strong>${name}</strong><br/>Value: ${value}`,
                    { permanent: false }
                  );
                }}
              />
            )}
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
          {selectedYear === "Trending" ? (
            <LineChart
              style={{
                width: "100%",
                maxWidth: "700px",
                height: "100%",
                maxHeight: "70vh",
                aspectRatio: 1.618,
              }}
              responsive
              data={data}
              margin={{
                top: 5,
                right: 0,
                left: 0,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" />
              <YAxis dataKey="value" width="auto" />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="CSD"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line type="monotone" dataKey=" " stroke="#82ca9d" />
            </LineChart>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 16, right: 32, bottom: 16, left: 72 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, "dataMax + 5"]} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={140}
                  tick={{ fontSize: 18 }}
                />
                <Tooltip />
                <Bar dataKey="value" fill="#2c6e49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  );
}
