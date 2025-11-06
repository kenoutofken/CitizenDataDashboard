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
    fetch("data/ByDemographic.json")
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

      <div className="flex justify-end relative">
        <div className="left-16 dropdown dropdown-bottom pt-20 px-8 flex justify-end">
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

        <div className="dropdown dropdown-bottom pt-20 px-12 flex justify-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-outline bg-base-100"
          >
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
      </div>

      <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 16, right: 0, bottom: 16, left: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={["dataMin -5", "dataMax + 5"]} />
            <YAxis
              dataKey="name"
              type="category"
              width={240}
              tick={{ fontSize: "clamp(16px, 0.8rem + 0.5vw, 0.85rem)" }}
            />
            <Tooltip />
            <Bar dataKey="value" fill="#0279b1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
}
