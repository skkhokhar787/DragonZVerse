import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchCharacterById } from "../api/dragonball";
import { translateToEnglish } from "../utils/translate";
import { getKiPercentage } from "../utils/ki";
import { getEnglishName } from "../utils/names";
import PowerBar from "../components/PowerBar";

export default function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [charDesc, setCharDesc] = useState("");
  const [planetDesc, setPlanetDesc] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    fetchCharacterById(id)
      .then(async (char) => {
        setCharacter(char);
        const desc = await translateToEnglish(char.description);
        setCharDesc(desc);
        if (char.originPlanet?.description) {
          const pd = await translateToEnglish(char.originPlanet.description);
          setPlanetDesc(pd);
        }
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
            DECRYPTING GALACTIC FILES...
          </p>
        </div>
      </div>
    );
  }

  if (error || !character) {
    return (
      <div className="pt-24 px-8 max-w-container-max mx-auto mb-20">
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-error text-5xl mb-4">gpp_maybe</span>
          <p className="text-lg text-on-surface">
            Data extraction from character record failed. Please try again.
          </p>
        </div>
      </div>
    );
  }

  const kiPercent = getKiPercentage(character.ki);
  const maxKiPercent = getKiPercentage(character.maxKi);

  const planetBadge = character.originPlanet?.isDestroyed
    ? "bg-red-950/80 text-red-300 border border-red-500/30"
    : "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
  const planetStatus = character.originPlanet?.isDestroyed ? "Planet Destroyed" : "Safe Planet";

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
            <div className="w-64 h-[350px] bg-surface-container rounded-xl flex items-center justify-center p-4 relative overflow-hidden border border-outline/20 shadow-[0_0_20px_rgba(255,183,129,0.1)]">
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent" />
              <img
                className="max-h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,183,129,0.4)] relative z-10"
                src={character.image}
                alt={getEnglishName(character.name)}
              />
            </div>
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              <span className="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-semibold border border-primary/20">
                {character.race}
              </span>
              <span className="bg-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-semibold border border-secondary/20">
                {character.gender}
              </span>
              <span className="bg-surface-container-highest text-on-surface-variant text-xs px-3 py-1 rounded-full font-semibold border border-outline/10">
                {character.affiliation}
              </span>
            </div>
          </div>

          <div className="flex-grow w-full md:w-2/3">
            <h2 className="font-display-lg text-4xl text-primary leading-none mb-2 uppercase tracking-wide">
              {getEnglishName(character.name)}
            </h2>

            <div className="my-6 glass-card p-4 rounded-xl border border-outline/10 flex flex-col gap-4">
              <PowerBar label="Base Ki" value={character.ki} percentage={kiPercent} />
              <PowerBar label="Max Ki Cap" value={character.maxKi} percentage={maxKiPercent} color="tertiary" />
            </div>

            <div className="mt-4">
              <h4 className="font-headline-md text-headline-md text-tertiary mb-2 tracking-wide">
                CHRONICLES & BIO
              </h4>
              <p className="text-on-surface text-base leading-relaxed text-justify">{charDesc}</p>
            </div>
          </div>
        </div>

        {character.originPlanet && (
          <div className="mt-8 border-t border-outline/30 pt-6">
            <h4 className="font-headline-md text-headline-md text-tertiary mb-4">
              ORIGIN PLANET
            </h4>
            <div className="glass-card rounded-xl overflow-hidden flex flex-col sm:flex-row items-center gap-6 p-4">
              <div className="relative w-28 h-28 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden p-2 flex items-center justify-center">
                <img
                  className="max-h-full object-contain filter drop-shadow-[0_0_10px_rgba(65,90,119,0.3)]"
                  src={character.originPlanet.image}
                  alt={character.originPlanet.name}
                />
              </div>
              <div className="flex-grow w-full">
                <div className="flex items-center gap-3 mb-2">
                  <span className="font-bold text-lg text-primary">
                    {character.originPlanet.name}
                  </span>
                  <span
                    className={`${planetBadge} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider`}
                  >
                    {planetStatus}
                  </span>
                </div>
                <p className="text-on-surface-variant text-sm leading-relaxed">
                  {planetDesc || character.originPlanet.description}
                </p>
              </div>
            </div>
          </div>
        )}

        {character.transformations && character.transformations.length > 0 ? (
          <div className="mt-8 border-t border-outline/30 pt-6">
            <h4 className="font-headline-md text-headline-md text-tertiary mb-4 tracking-wide">
              MULTIVERSE EVOLUTIONS
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {character.transformations.map((t) => (
                <div
                  key={t.id}
                  className="glass-card rounded-lg overflow-hidden p-3 flex flex-col gap-2 group hover:border-primary transition-all duration-300"
                >
                  <div className="h-32 bg-surface-container-low flex items-center justify-center p-2 rounded overflow-hidden">
                    <img
                      className="max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      src={t.image}
                      alt={t.name}
                    />
                  </div>
                  <span className="font-semibold text-sm truncate text-on-surface text-center">
                    {t.name}
                  </span>
                  <div className="flex justify-between items-center text-[10px] text-on-surface-variant border-t border-outline/10 pt-1 mt-1">
                    <span>KI</span>
                    <span className="text-primary font-bold">{t.ki}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="mt-8 border-t border-outline/30 pt-6">
            <h4 className="font-headline-md text-headline-md text-tertiary mb-2">
              MULTIVERSE EVOLUTIONS
            </h4>
            <p className="text-on-surface-variant text-sm italic">
              This character has no recorded planetary or genetic transformations in the database.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
