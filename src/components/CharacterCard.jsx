import { useNavigate } from "react-router-dom";
import { getKiPercentage } from "../utils/ki";
import { getEnglishName } from "../utils/names";

export default function CharacterCard({ character }) {
  const navigate = useNavigate();
  const percentage = getKiPercentage(character.ki);

  let badgeClass =
    "bg-primary-container/80 text-on-primary-fixed border border-primary/20";
  if (character.affiliation === "Army of Frieza") {
    badgeClass = "bg-error-container/80 text-on-error-container border border-error/20";
  } else if (character.affiliation === "Galactic Patrol") {
    badgeClass = "bg-secondary-container/80 text-on-secondary-container border border-secondary/20";
  } else if (character.affiliation === "Freelancer") {
    badgeClass = "bg-surface-container-highest/80 text-on-surface border border-outline/20";
  }

  return (
    <div
      onClick={() => navigate(`/characters/${character.id}`)}
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-105 hover:border-primary transition-all duration-300 flex flex-col"
    >
      <div className="relative h-64 w-full overflow-hidden bg-surface-container-low flex items-center justify-center p-4">
        <img
          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(255,183,129,0.2)]"
          src={character.image}
          alt={getEnglishName(character.name)}
        />
        <div
          className={`absolute top-3 right-3 ${badgeClass} backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase`}
        >
          {character.affiliation}
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {getEnglishName(character.name)}
            </h3>
            <span className="text-on-surface-variant text-sm">{character.race}</span>
          </div>
          <span className="material-symbols-outlined text-primary group-hover:energy-pulse">
            bolt
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="font-label-md text-label-md text-on-surface-variant text-xs">
              Ki Level
            </span>
            <span className="font-label-md text-label-md text-primary text-xs">
              {character.ki}
            </span>
          </div>
          <div className="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="power-bar-fill h-full" style={{ width: `${percentage}%` }} />
          </div>
        </div>
      </div>
    </div>
  );
}
