import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

export default function InfoCard({ dataFile }) {
  const [data, setData] = useState([]);
  const [showCards, setShowCards] = useState(true);
  const card = useRef();

  useGSAP(() => {
    gsap.fromTo(
      card.current,
      {
        opacity: 0,
        y: 550,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: "power2.out",
      }
    );
  }, [showCards]);

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
    <>
      <section className="mx-12 mb-12">
        <h1 className="text-5xl font-bold gap-8 pt-12 px-12">
          Households spending over 30% of income on housing<br></br>
          <span className="text-primary text-xl font-bold">
            {dataFile === "ByDemographicCards.json"
              ? "Data from various surveyed demographic groups"
              : dataFile === "ByHousingTypeCards.json"
              ? "Data by different housing types (owned vs rented)"
              : "Data from regions throughout the City of Vancouver"}
          </span>
        </h1>
        <div className="flex justify-start items-center gap-3 pt-12 px-12">
          <input
            type="checkbox"
            defaultChecked
            className="toggle toggle-black toggle-xs"
            onChange={() => setShowCards(!showCards)}
          />
          <span className="text-base">Show / Hide Cards</span>
        </div>
        {showCards && (
          <div ref={card} className="grid grid-cols-3 gap-8 py-12 px-12">
            {data.map((card) => (
              <div key={card.id} className="card bg-base-100 shadow-md py-8">
                <div className="card-body flex justify-between items-center text-center">
                  <h2 className="text-7xl font-bold text-primary">
                    {card.value}
                  </h2>
                  <p className="text-base">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
