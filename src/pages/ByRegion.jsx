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
  const [barData, setBarData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2016");
  const isTrending = selectedYear === "Trending";

  useEffect(() => {
    fetch("../data/ByRegion.json")
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
      });
  }, [selectedYear]);

  return (
    <>
      <InfoCard dataFile="ByRegionCards.json" />

      <div className="dropdown dropdown-bottom pt-20 px-12 flex justify-end">
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

      {isTrending ? (
        <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
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
            <YAxis width="auto" />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="Strathcona"
              stroke="#8884d8"
              activeDot={{ r: 8 }}
              strokeWidth={8}
            />
            <Line
              type="monotone"
              dataKey="Downtown"
              stroke="#82ca9d"
              strokeWidth={8}
            />
          </LineChart>
        </div>
      ) : (
        <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
          <div className="w-1/2 h-full min-h-[400px]"></div>

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
                <Bar dataKey="value" fill="#2c6e49" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </>
  );
}
