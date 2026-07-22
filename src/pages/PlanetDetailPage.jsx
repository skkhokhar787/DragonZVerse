import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchPlanetById, fetchCharacters } from "../api/dragonball";
import { translateToEnglish } from "../utils/translate";
import { getEnglishName } from "../utils/names";

export default function PlanetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [planet, setPlanet] = useState(null);
  const [desc, setDesc] = useState("");
  const [fighters, setFighters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    Promise.all([fetchPlanetById(id), fetchCharacters(100)])
      .then(async ([planetData, allChars]) => {
        setPlanet(planetData);
        const pd = await translateToEnglish(planetData.description);
        setDesc(pd);

        let res = Array.isArray(planetData.characters) ? planetData.characters : [];
        if (res.length === 0) {
          res = allChars.filter((c) => c.originPlanet && c.originPlanet.id === planetData.id);
        }
        setFighters(res);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="pt-24 px-8 max-w-container-max mx-auto mb-20">
        <div className="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
          <div className="w-20 h-20 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-xl text-primary font-bold tracking-widest">
            SCANNING PLANETARY SURFACE...
          </p>
        </div>
      </div>
    );
  }

  if (error || !planet) {
    return (
      <div className="pt-24 px-8 max-w-container-max mx-auto mb-20">
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-error text-5xl mb-4">gpp_maybe</span>
          <p className="text-lg text-on-surface">
            Data extraction from planetary record failed. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const badgeClass = planet.isDestroyed
    ? "bg-red-950/80 text-red-300 border border-red-500/30"
    : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
  const statusText = planet.isDestroyed ? "Planet Destroyed" : "Safe Planet";

  return (
    <div className="pt-24 px-8 max-w-container-max mx-auto mb-20 transition-all duration-300">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors mb-8 group"
      >
        <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">
          arrow_back
        </span>
        <span className="font-headline-md text-headline-md">Back</span>
      </button>

      <div className="glass-card rounded-2xl relative border border-primary/30 shadow-[0_0_50px_rgba(255,183,129,0.15)] p-6 md:p-10 flex flex-col gap-6 text-on-background">
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-full md:w-1/3 flex flex-col items-center">
            <div className="w-64 h-64 bg-surface-container rounded-xl flex items-center justify-center p-4 relative overflow-hidden border border-outline/20 shadow-[0_0_20px_rgba(255,183,129,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent" />
              <img
                className="max-h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,183,129,0.4)] relative z-10"
                src={planet.image}
                alt={planet.name}
              />
            </div>
            <span
              className={`${badgeClass} text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-4`}
            >
              {statusText}
            </span>
          </div>

          <div className="flex-grow w-full md:w-2/3">
            <h2 className="font-display-lg text-4xl text-primary leading-none mb-4 uppercase tracking-wide">
              {planet.name}
            </h2>
            <div>
              <h4 className="font-headline-md text-headline-md text-tertiary mb-2 tracking-wide">
                PLANETARY OVERVIEW
              </h4>
              <p className="text-on-surface text-base leading-relaxed text-justify">
                {desc || planet.description}
              </p>
            </div>
          </div>
        </div>

        {fighters.length > 0 ? (
          <div className="mt-8 border-t border-outline/30 pt-6">
            <h4 className="font-headline-md text-headline-md text-tertiary mb-4 tracking-wide">
              RESIDENT FIGHTERS ({fighters.length})
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fighters.map((f) => (
                <div
                  key={f.id}
                  onClick={() => navigate(`/characters/${f.id}`)}
                  className="glass-card rounded-lg overflow-hidden p-3 flex flex-col gap-2 group cursor-pointer hover:border-primary hover:scale-105 transition-all duration-300"
                >
                  <div className="h-32 bg-surface-container-low flex items-center justify-center p-2 rounded overflow-hidden">
                    <img
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      src={f.image}
                      alt={getEnglishName(f.name)}
                    />
                  </div>
                  <span className="font-semibold text-sm truncate text-on-surface text-center">
                    {getEnglishName(f.name)}
                  </span>
                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant border-t border-outline/10 pt-1 mt-1">
                    <span>KI</span>
                    <span className="text-primary font-bold">{f.ki}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 border-t border-outline/30 pt-6">
            <h4 className="font-headline-md text-headline-md text-tertiary mb-2">
              RESIDENT FIGHTERS
            </h4>
            <p className="text-on-surface-variant text-sm italic">
              No warriors from this planet are currently recorded in the galactic archive.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
