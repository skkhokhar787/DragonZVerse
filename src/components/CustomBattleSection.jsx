import { useState, useEffect, useMemo } from "react";
import { fetchCharacters } from "../api/dragonball";
import { getKiPercentage, parseKi } from "../utils/ki";
import { getEnglishName } from "../utils/names";
import PowerBar from "./PowerBar";

export default function CustomBattleSection() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [showDropdown1, setShowDropdown1] = useState(false);
  const [showDropdown2, setShowDropdown2] = useState(false);
  const [fighter1, setFighter1] = useState(null);
  const [fighter2, setFighter2] = useState(null);
  const [fighting, setFighting] = useState(false);
  const [winner, setWinner] = useState(null);
  const [reason, setReason] = useState("");

  useEffect(() => {
    fetchCharacters(100)
      .then((chars) => { setAllCharacters(chars); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const results1 = useMemo(() => {
    if (!search1) return allCharacters.slice(0, 8);
    const q = search1.toLowerCase();
    return allCharacters.filter((c) => {
      const name = getEnglishName(c.name).toLowerCase();
      return name.includes(q) || c.name.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [allCharacters, search1]);

  const results2 = useMemo(() => {
    if (!search2) return allCharacters.slice(0, 8);
    const q = search2.toLowerCase();
    return allCharacters.filter((c) => {
      const name = getEnglishName(c.name).toLowerCase();
      return name.includes(q) || c.name.toLowerCase().includes(q);
    }).slice(0, 8);
  }, [allCharacters, search2]);

  function generateReason(f1, f2, win, lose) {
    const ki1 = parseKi(f1.ki);
    const ki2 = parseKi(f2.ki);
    const ratio = ki1 > ki2 ? ki1 / ki2 : ki2 / ki1;
    const loser = win === f1 ? f2 : f1;
    const winName = getEnglishName(win.name);
    const loseName = getEnglishName(loser.name);

    const dominantReasons = [
      `${winName}'s Ki level of ${win.ki} utterly dwarfed ${loseName}'s ${loser.ki}, making this a one-sided beatdown.`,
      `With a Ki of ${win.ki} compared to ${loseName}'s ${loser.ki}, ${winName} was operating on an entirely different level of power.`,
      `The gap in power was insurmountable — ${winName} (${win.ki}) outclassed ${loseName} (${loser.ki}) in raw strength alone.`,
    ];

    const closeReasons = [
      `Both warriors were nearly equal in power, but ${winName}'s Ki edge of ${win.ki} vs ${loseName}'s ${loser.ki} proved decisive in the final exchange.`,
      `An incredibly close matchup. ${winName} clinched victory with a slightly higher Ki of ${win.ki} over ${loseName}'s ${loser.ki}, landing the critical final blow.`,
      `Down to the wire — ${winName} and ${loseName} were neck and neck, but ${winName}'s experience and Ki advantage (${win.ki} vs ${loser.ki}) tipped the balance.`,
    ];

    const sameRaceReasons = [
      `As ${win.race}s, both fighters shared similar abilities, but ${winName}'s superior Ki of ${win.ki} overwhelmed ${loseName}'s ${loser.ki}.`,
      `A mirror matchup between two ${win.race}s. ${winName}'s higher power level (${win.ki}) gave the edge over ${loseName} (${loser.ki}).`,
    ];

    let reasons;

    if (win.race === lose.race) {
      reasons = sameRaceReasons;
    } else if (ratio > 2) {
      reasons = dominantReasons;
    } else {
      reasons = closeReasons;
    }

    return reasons[Math.floor(Math.random() * reasons.length)];
  }

  function handleFight() {
    if (!fighter1 || !fighter2) return;
    setFighting(true);
    setWinner(null);
    setReason("");
    setTimeout(() => {
      const ki1 = getKiPercentage(fighter1.ki);
      const ki2 = getKiPercentage(fighter2.ki);
      const win = ki1 >= ki2 ? fighter1 : fighter2;
      const lose = win === fighter1 ? fighter2 : fighter1;
      setWinner(win);
      setReason(generateReason(fighter1, fighter2, win, lose));
      setFighting(false);
    }, 2000);
  }

  function handleSwap() {
    setFighter1(fighter2);
    setFighter2(fighter1);
    setSearch1(fighter2 ? getEnglishName(fighter2.name) : "");
    setSearch2(fighter1 ? getEnglishName(fighter1.name) : "");
    setWinner(null);
    setReason("");
  }

  function handleReset() {
    setFighter1(null);
    setFighter2(null);
    setSearch1("");
    setSearch2("");
    setWinner(null);
    setReason("");
  }

  function renderSelector(results, search, setSearch, showDropdown, setShowDropdown, onSelect, label) {
    return (
      <div className="flex-1 flex flex-col items-center gap-3 w-full">
        <span className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
          {label}
        </span>
        <div className="relative w-full max-w-[240px]">
          <div className="bg-surface-container-low border border-outline/30 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-primary transition-colors">
            <span className="material-symbols-outlined text-on-surface-variant">search</span>
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
              onFocus={() => setShowDropdown(true)}
              placeholder={loading ? "Loading fighters..." : "Search warrior..."}
              disabled={loading}
              className="bg-transparent text-on-surface placeholder:text-on-surface-variant/50 outline-none w-full font-body-md text-sm"
            />
          </div>
          {showDropdown && results.length > 0 && (
            <div className="absolute z-50 top-full mt-2 w-full bg-surface-container border border-outline/30 rounded-xl overflow-hidden shadow-2xl max-h-72 overflow-y-auto">
              {results.map((char) => (
                <button
                  key={char.id}
                  onClick={() => { onSelect(char); setSearch(getEnglishName(char.name)); setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-primary/10 transition-colors text-left"
                >
                  <img className="w-10 h-10 rounded-full object-contain bg-surface-container-high" src={char.image} alt={getEnglishName(char.name)} />
                  <div>
                    <p className="text-on-surface text-sm font-semibold">{getEnglishName(char.name)}</p>
                    <p className="text-on-surface-variant text-xs">{char.race} &middot; Ki: {char.ki}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-primary/20 mb-12">
      <div className="bg-gradient-to-r from-primary/20 via-surface-container to-tertiary/20 px-6 py-5">
        <div className="flex items-center gap-3">
          <span className="material-symbols-outlined text-primary text-3xl">sports_mma</span>
          <div>
            <h3 className="font-headline-lg text-headline-lg text-primary">Custom Battle</h3>
            <p className="text-on-surface-variant text-sm">Choose two warriors and see who emerges victorious</p>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start gap-6">
          {renderSelector(results1, search1, setSearch1, showDropdown1, setShowDropdown1, (c) => { setFighter1(c); setWinner(null); }, "Fighter 1")}

          <div className="flex flex-col items-center gap-2 pt-6">
            <button
              onClick={handleSwap}
              className="w-10 h-10 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all active:scale-90"
              title="Swap fighters"
            >
              <span className="material-symbols-outlined">swap_horiz</span>
            </button>
            <span className="font-display-lg text-display-lg text-primary italic">VS</span>
          </div>

          {renderSelector(results2, search2, setSearch2, showDropdown2, setShowDropdown2, (c) => { setFighter2(c); setWinner(null); }, "Fighter 2")}
        </div>

        {(fighter1 || fighter2) && (
          <div className="mt-6 pt-6 border-t border-outline/20 flex flex-col md:flex-row items-center gap-6">
            <FighterPanel fighter={fighter1} label="FIGHTER 1" borderColor="border-primary/40" glowColor="rgba(238,155,0,0.15)" />

            <div className="flex flex-col items-center gap-2">
              {fighting ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                  <span className="text-primary font-bold tracking-widest text-sm animate-pulse">FIGHTING...</span>
                </div>
              ) : winner ? (
                <div className="flex flex-col items-center gap-3">
                  <span className="material-symbols-outlined text-primary text-5xl energy-pulse">emoji_events</span>
                  <div className="text-center">
                    <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-1">Winner</p>
                    <p className="font-headline-md text-headline-md text-primary">{winner.name}</p>
                  </div>
                  {reason && (
                    <div className="mt-2 max-w-[260px] glass-card rounded-xl px-4 py-3 border border-primary/20">
                      <div className="flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-sm mt-0.5">info</span>
                        <p className="text-on-surface-variant text-xs leading-relaxed text-justify">{reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <button
                    onClick={handleFight}
                    disabled={!fighter1 || !fighter2}
                    className="bg-primary hover:bg-primary-container text-on-primary font-headline-md text-headline-md px-10 py-3 rounded-xl shadow-[0_0_20px_rgba(238,155,0,0.4)] transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>bolt</span>
                    FIGHT!
                  </button>
                  <button
                    onClick={handleReset}
                    className="text-on-surface-variant text-xs hover:text-primary transition-colors"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            <FighterPanel fighter={fighter2} label="FIGHTER 2" borderColor="border-tertiary/40" glowColor="rgba(174,32,18,0.15)" />
          </div>
        )}
      </div>

      <div onClick={() => { setShowDropdown1(false); setShowDropdown2(false); }} className={showDropdown1 || showDropdown2 ? "fixed inset-0 z-40" : "hidden"} />
    </div>
  );
}

function FighterPanel({ fighter, label, borderColor, glowColor }) {
  if (!fighter) {
    return (
      <div className="flex-1 flex flex-col items-center gap-4 w-full">
        <div className={`w-40 h-40 rounded-xl bg-surface-container border-2 border-dashed ${borderColor} flex items-center justify-center`}>
          <span className="material-symbols-outlined text-on-surface-variant/30 text-5xl">person</span>
        </div>
        <span className="text-xs text-on-surface-variant/50 uppercase tracking-widest">{label}</span>
      </div>
    );
  }

  const kiPercent = getKiPercentage(fighter.ki);
  const maxKiPercent = getKiPercentage(fighter.maxKi);

  return (
    <div className="flex-1 flex flex-col items-center gap-4 w-full">
      <div
        className={`w-40 h-40 rounded-xl bg-surface-container border-2 ${borderColor} flex items-center justify-center p-3 relative overflow-hidden`}
        style={{ boxShadow: `0 0 25px ${glowColor}` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent" />
        <img className="max-h-full object-contain relative z-10 filter drop-shadow-[0_0_15px_rgba(255,183,129,0.3)]" src={fighter.image} alt={getEnglishName(fighter.name)} />
      </div>
      <div className="text-center">
        <p className="font-headline-md text-headline-md text-on-surface mb-1">{getEnglishName(fighter.name)}</p>
        <div className="flex gap-2 justify-center mb-3">
          <span className="bg-primary/15 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold">{fighter.race}</span>
          <span className="bg-surface-container-high text-on-surface-variant text-[10px] px-2 py-0.5 rounded-full">{fighter.gender}</span>
        </div>
      </div>
      <div className="w-full max-w-[220px] space-y-3">
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Ki</span>
            <span className="text-[10px] text-primary font-bold">{fighter.ki}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="power-bar-fill h-full" style={{ width: `${kiPercent}%` }} />
          </div>
        </div>
        <div>
          <div className="flex justify-between mb-1">
            <span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Max Ki</span>
            <span className="text-[10px] text-tertiary font-bold">{fighter.maxKi}</span>
          </div>
          <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${maxKiPercent}%`, background: "linear-gradient(90deg, #d69900, #ffba27)", boxShadow: "0 0 8px rgba(255,186,39,0.6)" }} />
          </div>
        </div>
      </div>
    </div>
  );
}
