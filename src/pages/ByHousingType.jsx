import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard.jsx";

export default function ByHousingType() {
  const [data, setData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2016");
  const isTrending = selectedYear === "Trending";
  const [showDatasetTable, setShowDatasetTable] = useState(false); //Dataset table

  useEffect(() => {
    fetch("data/ByHousingType.json")
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const chartData = json
          .filter((d) => d.periodlabel === selectedYear) // filter optional
          .map((d) => ({
            name: d.disaggregationcategory, // y-axis label
            value: d.actualvalue, // bar value
          }));
        setData(
          chartData.sort((a, b) => {
            if (a.name === "Owned housing") return -1;
            if (b.name === "Owned housing") return 1;
            return b.value - a.value;
          })
        );
        console.log("Chart Data:", chartData);

        const lineData = [];
        const trendYears = ["1996", "2001", "2006", "2011", "2016"];

        trendYears.forEach((yr) =>
          json
            .filter((d) => d.periodlabel === yr)
            .forEach((d) => {
              let yearData = lineData.find((td) => td.year === yr);
              if (!yearData) {
                yearData = {
                  year: yr,
                  [d.disaggregationcategory]: d.actualvalue,
                };
                lineData.push(yearData);
              } else {
                yearData[d.disaggregationcategory] = d.actualvalue;
              }
            })
        );
        setTrendData(lineData);
        console.log("Trend Data:", lineData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, [selectedYear]);

  /*   const trendData2 = [
    { year: "1996", "Owned Housing": 24, "Rented Housing": 47 },
    { year: "2001", "Owned Housing": 25, "Rented Housing": 43 },
    { year: "2006", "Owned Housing": 29, "Rented Housing": 45 },
    { year: "2011", "Owned Housing": 29, "Rented Housing": 46 },
    { year: "2016", "Owned Housing": 28, "Rented Housing": 44 },
  ]; */

  const years = ["2016", "2011", "2006", "2001", "1996"];

  return (
    <>
      <InfoCard dataFile="ByHousingTypeCards.json" />

      <div className="flex justify-between items-center gap-4 px-12">
        <span className="text-xl text-primary font-bold">
          {isTrending
            ? `Displaying Data Collected from 1996 - 2016`
            : `Displaying Data Collected in ${selectedYear}`}
        </span>

        <div className="flex justify-end items-center gap-4 px-12">
          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-outline btn-lg border-2 text-base bg-base-100"
            >
              View Data ({selectedYear}) ▼
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 border-2 rounded mt-1 w-64 text-base shadow-md"
            >
              <li>
                <button
                  className={
                    selectedYear === "Trending"
                      ? "text-base font-semibold bg-primary text-white"
                      : "text-base font-semibold hover:bg-primary hover:text-white"
                  }
                  onClick={() => {
                    setSelectedYear("Trending");
                    setShowDatasetTable(false);
                  }}
                >
                  View Data Trends
                </button>
              </li>

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

              {years.map((year) => (
                <li key={year}>
                  <button
                    onClick={() => {
                      setSelectedYear(year);
                      setShowDatasetTable(false);
                    }}
                    className={
                      selectedYear === year
                        ? "pl-6 text-base bg-primary text-white"
                        : "pl-6 text-base hover:bg-primary hover:text-white"
                    }
                  >
                    {year}
                  </button>
                </li>
              ))}
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
              {trendData.map((row) => (
                <>
                  <tr key={`${row.year}-owned`}>
                    <td>{row.year}</td>
                    <td>Owned Housing</td>
                    <td>{row["Owned housing"]}%</td>
                  </tr>
                  <tr key={`${row.year}-rented`}>
                    <td>{row.year}</td>
                    <td>Rented Housing</td>
                    <td>{row["Rented housing"]}%</td>
                  </tr>
                </>
              ))}
            </tbody>
          </table>
        </div>
      ) : isTrending ? (
        <div className="flex h-[calc(50vh)] pt-12 px-12">
          <LineChart data={trendData} style={{ width: "100%", height: "100%" }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis domain={[0, "dataMax + 5"]} padding={{ bottom: 0 }} />
            <Tooltip />
            <Legend
              wrapperStyle={{
                fontSize: "16px",
                fontWeight: 600,
                paddingTop: "10px",
              }}
            />
            <Line
              type="monotone"
              dataKey="Owned housing"
              stroke="#0279B1"
              stackId="1"
              strokeWidth={4}
              dot={{ r: 10 }}
            />
            <Line
              type="monotone"
              dataKey="Rented housing"
              stroke="#5EA61B"
              stackId="1"
              strokeWidth={4}
              dot={{ r: 10 }}
            />
          </LineChart>
        </div>
      ) : (
        <div className="flex h-[calc(50vh)] pt-12 px-12">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 16, right: 0, bottom: 16, left: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis type="number" domain={[0, "dataMax + 5"]} />
              <XAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fontSize: "clamp(16px, 0.8rem + 0.5vw, 0.85rem)" }}
                sorted={false}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#0279b1" radius={[4, 4, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={entry.name}
                    fill={
                      entry.name === "Owned housing" ? "#0279b1" : "#5EA61B"
                    }
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
