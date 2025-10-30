import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

export default function ByRegion() {
  const [data, setData] = useState([]);
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // if file is in /public/data, use a leading slash
    fetch("/data/ByRegion.json")
      .then((res) => res.json())
      .then((json) => {
        // ✅ filter: specific period + Local Area only (exclude CSD)
        const filtered = json.filter(
          (d) =>
            d.periodlabel === "2016" &&
            d.geolevelname === "Local Area" &&
            d.geographyname !== "CSD"
        );

        // chart data
        const chartData = filtered.map((d) => ({
          name: d.geographyname,
          value:
            typeof d.actualvalue === "number"
              ? d.actualvalue
              : parseFloat(d.actualvalue),
        }));
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
  }, []);

  return (
    <>
      <div className="flex h-[calc(100vh-4rem)] pt-12 px-12">
        <div className="w-1/2 h-full min-h-[800px]">
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
        <div className="w-1/2 h-full min-h-[800px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 16, right: 32, bottom: 16, left: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" domain={[0, "dataMax + 5"]} />
              <YAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fontSize: 12 }}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#2c6e49" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
}
