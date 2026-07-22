import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { translateToEnglish } from "../utils/translate";

export default function PlanetCard({ planet }) {
  const navigate = useNavigate();
  const [desc, setDesc] = useState(null);

  const handleMouseEnter = () => {
    if (!desc) {
      translateToEnglish(planet.description).then(setDesc);
    }
  };

  let badgeClass = "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
  let statusText = "Safe \uD83E\uDE90";
  if (planet.isDestroyed) {
    badgeClass = "bg-red-950/80 text-red-300 border border-red-500/30";
    statusText = "Destroyed \u2604\uFE0F";
  }

  return (
    <div
      onClick={() => navigate(`/planets/${planet.id}`)}
      onMouseEnter={handleMouseEnter}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.03] hover:border-primary transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48 w-full overflow-hidden bg-surface-container-low flex items-center justify-center p-4">
        <img
          className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(65,90,119,0.5)]"
          src={planet.image}
          alt={planet.name}
        />
        <div
          className={`absolute top-3 right-3 ${badgeClass} backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider`}
        >
          {statusText}
        </div>
      </div>
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-headline-md text-headline-md text-primary mb-2">{planet.name}</h3>
          <p className="text-on-surface-variant text-sm line-clamp-4 leading-relaxed">
            {desc || planet.description}
          </p>
        </div>
      </div>
    </div>
  );
}
