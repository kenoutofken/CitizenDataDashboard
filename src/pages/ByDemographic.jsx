import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard.jsx";

export default function ByDemographic() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2016");

  useEffect(() => {
    fetch("../data/ByDemographic.json")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const chartData = json
          .filter((d) => d.periodlabel === "2016") // filter optional
          .map((d) => ({
            name: d.disaggregationcategory, // y-axis label
            value: d.actualvalue, // bar value
          }));
        setData(chartData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <InfoCard dataFile="ByDemographicCards.json" />

      <div className="dropdown dropdown-bottom pt-20 px-12 flex justify-end">
        <div tabIndex={0} role="button" className="btn btn-outline">
          View Data ({selectedYear}) ▼
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 border border-base-content rounded-box w-64 shadow-md"
        >
          <li>
            <li className="menu-title">
              <span className="text-black font-bold">View Data by Year</span>
            </li>
          </li>
          <li>
            <button
              onClick={() => setSelectedYear("2016")}
              className="pl-6 hover:bg-primary hover:text-white"
            >
              2016 (Latest)
            </button>
          </li>
        </ul>
      </div>

      <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
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
    </>
  );
}
