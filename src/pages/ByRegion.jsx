import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import axios from "axios";
import { useEffect, useState } from "react";

export default function ByRegion() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios
      .get("data/dummy.json") // ✅ must live in /public
      .then((response) => {
        // Filter and transform your data for the chart
        const chartData = response.data
          .filter((d) => d.periodlabel === "2016") // optional filter
          .map((d) => ({
            name: d.geographyname, // label on Y axis
            value: d.actualvalue, // value for the bar
          }));
        setData(chartData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <ResponsiveContainer width="80%" height="80%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 16, right: 16, bottom: 16, left: 120 }}
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
  );
}
