import {
  AreaChart,
  Area,
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
import { useEffect, useState } from "react";
import InfoCard from "../components/InfoCard.jsx";

export default function ByHousingType() {
  const [data, setData] = useState([]);
  const [trendData, setTrendData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2016");
  const isTrending = selectedYear === "Trending";

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

      <div className="dropdown dropdown-bottom pt-20 px-12 flex justify-end">
        <div tabIndex={0} role="button" className="btn btn-outline bg-base-100">
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

      {isTrending ? (
        <div className="flex h-[calc(100vh-12rem)] pt-12 px-12">
          <AreaChart data={trendData} style={{ width: "100%", height: "100%" }}>
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
            <Area
              type="monotone"
              dataKey="Owned housing"
              stroke="#0279B1"
              fill="#0279B1"
              stackId="1"
              strokeWidth={4}
              dot={true}
            />
            <Area
              type="monotone"
              dataKey="Rented housing"
              stroke="#5EA61B"
              fill="#5EA61B"
              stackId="1"
              strokeWidth={4}
              dot={true}
            />
          </AreaChart>
        </div>
      ) : (
        <div className="flex h-[calc(50vh)] pt-12 px-12">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="horizontal"
              margin={{ top: 16, right: 16, bottom: 16, left: 16 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <YAxis type="number" domain={["dataMin - 5", "dataMax + 5"]} />
              <XAxis
                dataKey="name"
                type="category"
                width={140}
                tick={{ fontSize: 18 }}
                sorted={false}
              />
              <Tooltip />
              <Bar dataKey="value" fill="#0279b1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </>
  );
}
