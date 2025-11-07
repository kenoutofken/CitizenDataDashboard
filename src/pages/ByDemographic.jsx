import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
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
    fetch("data/ByDemographic.json")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const chartData = json
          .filter((d) => d.periodlabel === "2016") // filter optional
          .map((d) => ({
            name:
              d.disaggregationcategory === "All"
                ? "City Average"
                : d.disaggregationcategory, // y-axis label
            value: d.actualvalue, // bar value
          }))
          .sort((a, b) => b.value - a.value);
        setData(chartData);
        console.log("Chart Data:", chartData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <InfoCard dataFile="ByDemographicCards.json" />

      <div className="flex w-full">
        <div className="dropdown dropdown-bottom left-[50px] px-12 ml-auto flex justify-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline bg-base-100"
          >
            Sort Data by ▼
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content relative z-50 menu bg-base-100 border border-base-content rounded-box mt-1 w-64 shadow-md"
          >
            <li>
              <button
                onClick={() =>
                  setData((data) =>
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
                  setData((data) => [...data].sort((a, b) => b.value - a.value))
                }
                className="pl-6 hover:bg-primary hover:text-white"
              >
                Highest to Lowest
              </button>
            </li>
            <li>
              <button
                onClick={() =>
                  setData((data) => [...data].sort((a, b) => a.value - b.value))
                }
                className="pl-6 hover:bg-primary hover:text-white"
              >
                Lowest to Highest
              </button>
            </li>
          </ul>
          <div className="toast toast-end" id="toast-container"></div>
        </div>

        <div className="dropdown dropdown-bottom px-12 flex justify-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline bg-base-100"
          >
            View Data ({selectedYear}) ▼
          </div>
          <ul
            tabIndex={0}
            className="dropdown-content relative z-50 menu bg-base-100 border border-base-content rounded-box mt-1 w-64 shadow-md"
          >
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
          </ul>
        </div>
      </div>

      <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 16, right: 0, bottom: 16, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, "dataMax + 5"]} />
            <YAxis
              dataKey="name"
              type="category"
              width={240}
              tick={{ fontSize: "clamp(16px, 0.8rem + 0.5vw, 0.85rem)" }}
            />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((entry) => (
                <Cell
                  key={entry.name}
                  fill={entry.name === "City Average" ? "#FFB100" : "#0279b1"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
