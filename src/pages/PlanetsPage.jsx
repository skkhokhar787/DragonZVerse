import { useState, useEffect } from "react";
import { fetchPlanets } from "../api/dragonball";
import PlanetCard from "../components/PlanetCard";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";

const PLANET_LIMIT = 6;

export default function PlanetsPage() {
  const [planets, setPlanets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchPlanets(50)
      .then((data) => {
        setPlanets(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching planets:", err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(planets.length / PLANET_LIMIT);
  const pageItems = planets.slice((page - 1) * PLANET_LIMIT, page * PLANET_LIMIT);

  return (
    <div className="pt-24 px-8 mt-8 max-w-container-max mx-auto mb-20 transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display-lg text-display-lg text-primary italic">Galactic Planets</h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          <SkeletonCard count={PLANET_LIMIT} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-gutter">
          {pageItems.map((planet) => (
            <PlanetCard key={planet.id} planet={planet} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
