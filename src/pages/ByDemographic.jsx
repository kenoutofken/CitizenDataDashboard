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
  const [showDatasetTable, setShowDatasetTable] = useState(false);

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

      <div className="flex justify-between items-center gap-4 px-12">
        <span className="text-xl text-primary font-bold">
          Displaying Data Collected in {selectedYear}
        </span>

        <div className="flex justify-end items-center gap-4 px-12">
          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-lg border-2 bg-base-100"
            >
              Sort Data by ▼
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-50 menu bg-base-100 border-2 rounded mt-1 w-64 text-base shadow-md"
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
                    setData((data) =>
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
                    setData((data) =>
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

          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-lg border-2 bg-base-100 text-base"
            >
              View Data ({selectedYear}) ▼
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content z-50 menu bg-base-100 border-2 rounded mt-1 text-base w-64 shadow-md"
            >
              <li>
                <button
                  className={
                    showDatasetTable
                      ? "text-base font-semibold bg-primary text-white"
                      : "text-base font-semibold hover:bg-primary hover:text-white"
                  }
                  onClick={() => {
                    setShowDatasetTable(true);
                    setSelectedYear("Table View");
                  }}
                >
                  View Dataset Table
                </button>
              </li>
              <li className="menu-title">
                <span
                  onClick={() => {
                    setSelectedYear("2016");
                    setShowDatasetTable(false);
                  }}
                  className="text-black font-semibold text-base hover:cursor-pointer"
                >
                  View Data by Year
                </span>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedYear("2016");
                    setShowDatasetTable(false);
                  }}
                  className={
                    selectedYear === "2016"
                      ? "pl-6 text-base bg-primary text-white"
                      : "pl-6 text-base hover:bg-primary hover:text-white"
                  }
                >
                  2016 (Latest)
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {showDatasetTable ? (
        <div className="pt-12 px-12 overflow-x-auto">
          <table className="table table-zebra w-full border border-gray-300">
            <thead className="bg-primary text-white">
              <tr>
                <th>Year</th>
                <th>Category</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row, index) => (
                <tr key={index}>
                  <td>2016</td>
                  <td>{row.name}</td>
                  <td>{row.value}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex h-[calc(80vh)] pt-12 px-12">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 16, right: 0, bottom: 16, left: 120 }}
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
      )}
    </>
  );
}
