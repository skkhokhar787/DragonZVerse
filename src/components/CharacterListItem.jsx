import { useNavigate } from "react-router-dom";
import { getKiPercentage } from "../utils/ki";
import { getEnglishName } from "../utils/names";

export default function CharacterListItem({ character }) {
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
      className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.01] hover:border-primary transition-all duration-300 flex flex-col md:flex-row items-center gap-6 p-5 w-full"
    >
      <div className="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-surface-container rounded-lg p-2 flex items-center justify-center">
        <img
          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500"
          src={character.image}
            alt={getEnglishName(character.name)}
        />
      </div>
      <div className="flex-grow w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div>
            <h3 className="font-headline-md text-headline-md text-on-surface">
              {getEnglishName(character.name)}
            </h3>
            <div className="flex gap-2 mt-1">
              <span className="bg-surface-container-high text-on-surface-variant text-xs px-2 py-0.5 rounded-full">
                {character.race}
              </span>
              <span className="bg-surface-container-high text-on-surface-variant text-xs px-2 py-0.5 rounded-full">
                {character.gender}
              </span>
            </div>
          </div>
          <span
            className={`${badgeClass} text-xs px-3 py-1 rounded font-bold tracking-wider mt-2 md:mt-0 uppercase`}
          >
            {character.affiliation}
          </span>
        </div>
        <div className="mt-4">
          <div className="flex justify-between mb-1">
            <span className="font-label-md text-label-md text-on-surface-variant text-xs">
              Ki Level
            </span>
            <span className="font-label-md text-label-md text-primary font-bold text-xs">
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
