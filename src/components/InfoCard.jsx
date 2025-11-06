import React, { useEffect, useState } from "react";

export default function InfoCard({ dataFile }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!dataFile) return;
    const url = `data/${dataFile}`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status} for ${url}`);
        return r.json();
      })
      .then(setData)
      .catch((err) => console.error("Failed to load JSON", err));
  }, [dataFile]);

  return (
    <div className="grid grid-cols-3 gap-8 pt-12 px-12 pt-32">
      {data.map((card) => (
        <div key={card.id} className="card bg-base-100 shadow-md py-8">
          <div className="card-body flex justify-between items-center text-center">
            <h2 className="text-7xl font-bold text-primary">{card.value}</h2>
            <p className="text-gray-700 text-xl">{card.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
