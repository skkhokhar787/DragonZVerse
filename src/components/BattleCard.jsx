import { useState, useEffect } from "react";
import { fetchCharacterById } from "../api/dragonball";

function FighterPortrait({ fighter, name, borderColor }) {
  if (fighter === undefined) {
    return (
      <div className={`w-28 h-28 bg-surface-container rounded-full flex items-center justify-center p-2 border-2 ${borderColor}`}>
        <span className="material-symbols-outlined text-on-surface-variant text-3xl">person_off</span>
      </div>
    );
  }
  if (!fighter) {
    return (
      <div className={`w-28 h-28 bg-surface-container rounded-full flex items-center justify-center p-2 border-2 ${borderColor} shadow-[0_0_15px_rgba(238,155,0,0.2)]`}>
        <div className="w-16 h-16 rounded-full bg-surface-container-high animate-pulse" />
      </div>
    );
  }
  return (
    <div className={`w-28 h-28 bg-surface-container rounded-full flex items-center justify-center p-2 border-2 ${borderColor} shadow-[0_0_15px_rgba(238,155,0,0.2)]`}>
      <img className="max-h-full object-contain" src={fighter.image} alt={name} />
    </div>
  );
}

export default function BattleCard({ battle }) {
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [f1Error, setF1Error] = useState(false);
  const [f2Error, setF2Error] = useState(false);

  useEffect(() => {
    fetchCharacterById(battle.fighter1Id)
      .then(setFighter1)
      .catch(() => { setF1Error(true); console.error(`Failed to load fighter: ${battle.fighter1Name}`); });
    fetchCharacterById(battle.fighter2Id)
      .then(setFighter2)
      .catch(() => { setF2Error(true); console.error(`Failed to load fighter: ${battle.fighter2Name}`); });
  }, [battle.fighter1Id, battle.fighter2Id, battle.fighter1Name, battle.fighter2Name]);

  const winnerBadge =
    battle.winner === "Draw"
      ? "bg-secondary-container/80 text-on-secondary-container"
      : "bg-primary-container/80 text-on-primary-fixed";

  return (
    <div className="glass-card rounded-2xl overflow-hidden hover:border-primary transition-all duration-300">
      <div className="bg-gradient-to-r from-primary/10 via-transparent to-tertiary/10 px-6 py-4 flex flex-wrap justify-between items-center gap-2">
        <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-bold border border-primary/30">
          {battle.saga}
        </span>
        <span className="text-on-surface-variant text-xs uppercase tracking-widest font-bold">
          {battle.series}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 p-6">
        <div className="flex-1 flex flex-col items-center gap-3 text-center">
          <FighterPortrait
            fighter={f1Error ? undefined : fighter1}
            name={battle.fighter1Name}
            borderColor="border-primary/30"
          />
          <span className="font-headline-md text-headline-md text-on-surface">
            {battle.fighter1Name}
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 px-4">
          <span className="font-display-lg text-display-lg text-primary italic">VS</span>
          <div className={`${winnerBadge} text-[10px] px-3 py-1 rounded-full font-bold uppercase tracking-wider`}>
            {battle.winner === "Draw" ? "DRAW" : `${battle.winner} Wins`}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center gap-3 text-center">
          <FighterPortrait
            fighter={f2Error ? undefined : fighter2}
            name={battle.fighter2Name}
            borderColor="border-tertiary/30"
          />
          <span className="font-headline-md text-headline-md text-on-surface">
            {battle.fighter2Name}
          </span>
        </div>
      </div>

      <div className="px-6 pb-6 space-y-4">
        <p className="text-on-surface-variant text-sm leading-relaxed">{battle.synopsis}</p>

        <div className="bg-surface-container-low/50 rounded-xl p-4 border border-outline/10">
          <h5 className="text-xs text-primary uppercase tracking-widest font-bold mb-2">
            Outcome
          </h5>
          <p className="text-on-surface text-sm leading-relaxed">{battle.outcome}</p>
        </div>

        <div className="flex flex-wrap gap-2">
          {battle.episodes && (
            <span className="bg-surface-container-high/50 text-on-surface-variant text-xs px-3 py-1 rounded-full">
              {battle.episodes}
            </span>
          )}
          {battle.chapters && battle.chapters !== "N/A" && (
            <span className="bg-surface-container-high/50 text-on-surface-variant text-xs px-3 py-1 rounded-full">
              {battle.chapters}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
