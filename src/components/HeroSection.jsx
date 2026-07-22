import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchCharacterById } from "../api/dragonball";
import { translateToEnglish } from "../utils/translate";
import { getEnglishName } from "../utils/names";

const FEATURED_IDS = [1, 2, 4, 11, 24];

export default function HeroSection() {
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [description, setDescription] = useState("");
  const [imgVisible, setImgVisible] = useState(false);

  useEffect(() => {
    const id = FEATURED_IDS[Math.floor(Math.random() * FEATURED_IDS.length)];
    fetchCharacterById(id)
      .then(async (data) => {
        setCharacter(data);
        const eng = await translateToEnglish(data.description);
        setDescription(eng);
        setTimeout(() => setImgVisible(true), 300);
      })
      .catch(console.error);
  }, []);

  if (!character) return null;

  const bgStyle = character.originPlanet?.image
    ? { backgroundImage: `url('${character.originPlanet.image}')` }
    : { backgroundImage: "url('/hero-bg.png')" };

  return (
    <section className="relative h-[870px] w-full flex items-end pt-20 transition-all duration-500">
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 hero-gradient z-10" />
        <div
          className="w-full h-full bg-cover bg-center transition-all duration-700"
          style={bgStyle}
        />
      </div>
      <div className="relative z-20 px-8 pb-16 max-w-container-max mx-auto w-full">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 w-full">
          <div className="max-w-2xl flex-grow">
            <span className="bg-primary-container text-on-primary-fixed font-label-md text-label-md px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
              Featured {character.race}
            </span>
            <h1 className="font-display-lg text-display-lg text-on-background mb-4 leading-none uppercase">
              {getEnglishName(character.name)}
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 min-h-[80px]">
              {description}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/characters/${character.id}`)}
                className="bg-primary-container hover:bg-primary text-on-primary-fixed font-headline-md text-headline-md px-8 py-4 rounded-xl shadow-[0_0_20px_rgba(251,133,0,0.5)] transition-all active:scale-95 flex items-center gap-2"
              >
                <span
                  className="material-symbols-outlined"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  bolt
                </span>
                VIEW STATS
              </button>
            </div>
          </div>
          <div className="hidden md:block w-80 h-[480px] flex-shrink-0 relative">
            <img
              onClick={() => navigate(`/characters/${character.id}`)}
              className={`w-full h-full object-contain filter drop-shadow-[0_0_30px_rgba(251,133,0,0.6)] hover:scale-105 transition-all duration-500 cursor-pointer animate-float ${
                imgVisible ? "opacity-100" : "opacity-0"
              }`}
              src={character.image}
              alt={getEnglishName(character.name)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
