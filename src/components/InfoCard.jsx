import React, { useEffect, useState } from "react";

export default function InfoCard({ dataFile }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!dataFile) return;

    fetch(`/data/${dataFile}`)
      .then((response) => response.json())
      .then((jsonData) => setData(jsonData))
      .catch((error) => console.error("Failed to load JSON", error));
  }, [dataFile]);

  return (
    <div className="flex flex-wrap gap-8 pt-12 px-12">
      {data.map((card) => (
        <div key={card.id} className="card bg-base-100 flex-1 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="text-4xl font-bold text-[#0279B1]">{card.value}</h2>
            <p className="text-gray-700 text-base">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
