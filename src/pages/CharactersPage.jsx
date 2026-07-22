import { useState, useEffect, useMemo } from "react";
import { fetchCharacters } from "../api/dragonball";
import FilterBar from "../components/FilterBar";
import CharacterCard from "../components/CharacterCard";
import CharacterListItem from "../components/CharacterListItem";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";

const CHAR_LIMIT = 8;

export default function CharactersPage() {
  const [allCharacters, setAllCharacters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [race, setRace] = useState("All");
  const [gender, setGender] = useState("All");
  const [affiliation, setAffiliation] = useState("All");
  const [layout, setLayout] = useState("grid");
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchCharacters(100)
      .then((chars) => {
        setAllCharacters(chars);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load characters", err);
        setLoading(false);
      });
  }, []);

  const filtered = useMemo(() => {
    return allCharacters.filter((char) => {
      const q = search.toLowerCase().trim();
      const matchesQuery =
        !q ||
        char.name.toLowerCase().includes(q) ||
        char.race.toLowerCase().includes(q) ||
        char.affiliation.toLowerCase().includes(q);
      const matchesRace = race === "All" || char.race.toLowerCase() === race.toLowerCase();
      const matchesGender = gender === "All" || char.gender.toLowerCase() === gender.toLowerCase();
      let matchesAffiliation = true;
      if (affiliation !== "All") {
        if (affiliation === "Other") {
          const standard = ["Z Fighter", "Galactic Patrol", "Army of Frieza", "Pride Troopers", "Freelancer"];
          matchesAffiliation = !standard.includes(char.affiliation);
        } else {
          matchesAffiliation = char.affiliation.toLowerCase() === affiliation.toLowerCase();
        }
      }
      return matchesQuery && matchesRace && matchesGender && matchesAffiliation;
    });
  }, [allCharacters, search, race, gender, affiliation]);

  const totalPages = Math.ceil(filtered.length / CHAR_LIMIT);
  const pageItems = filtered.slice((page - 1) * CHAR_LIMIT, page * CHAR_LIMIT);

  useEffect(() => {
    setPage(1);
  }, [search, race, gender, affiliation]);

  return (
    <div className="pt-24">
      <FilterBar
        search={search} setSearch={setSearch}
        race={race} setRace={setRace}
        gender={gender} setGender={setGender}
        affiliation={affiliation} setAffiliation={setAffiliation}
        layout={layout} setLayout={setLayout}
      />

      <section className="px-8 mt-12 max-w-container-max mx-auto mb-20 transition-all duration-300">
        {loading ? (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter"
                : "flex flex-col gap-6 w-full"
            }
          >
            <SkeletonCard count={CHAR_LIMIT} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="col-span-full flex flex-col items-center py-16">
            <span className="material-symbols-outlined text-primary/40 text-7xl mb-4">
              gpp_maybe
            </span>
            <p className="text-xl text-on-surface-variant text-center">
              No warriors matching current criteria found in this multiverse.
            </p>
          </div>
        ) : (
          <div
            className={
              layout === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter transition-all duration-300"
                : "flex flex-col gap-6 transition-all duration-300 w-full"
            }
          >
            {pageItems.map((char) =>
              layout === "grid" ? (
                <CharacterCard key={char.id} character={char} />
              ) : (
                <CharacterListItem key={char.id} character={char} />
              ),
            )}
          </div>
        )}
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </section>
    </div>
  );
}
