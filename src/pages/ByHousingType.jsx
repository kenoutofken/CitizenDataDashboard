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

export default function ByHousingType() {
  const [data, setData] = useState([]);
  const [selectedYear, setSelectedYear] = useState("2016");

  useEffect(() => {
    fetch("../data/ByHousingType.json")
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
        setData(chartData);
      })
      .catch((err) => console.error("Error fetching data:", err));
  }, []);

  return (
    <>
      <InfoCard dataFile="ByHousingTypeCards.json" />

      <div className="flex h-svh pt-12 px-12">
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
