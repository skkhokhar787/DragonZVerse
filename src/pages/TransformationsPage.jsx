import { useState, useEffect } from "react";
import { fetchTransformations } from "../api/dragonball";
import TransformationCard from "../components/TransformationCard";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";

const TRANS_LIMIT = 8;

export default function TransformationsPage() {
  const [transformations, setTransformations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetchTransformations()
      .then((data) => {
        setTransformations(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching transformations:", err);
        setLoading(false);
      });
  }, []);

  const totalPages = Math.ceil(transformations.length / TRANS_LIMIT);
  const pageItems = transformations.slice((page - 1) * TRANS_LIMIT, page * TRANS_LIMIT);

  return (
    <div className="pt-24 px-8 mt-8 max-w-container-max mx-auto mb-20 transition-all duration-300">
      <div className="flex justify-between items-center mb-8">
        <h2 className="font-display-lg text-display-lg text-primary italic">
          Power Transformations
        </h2>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          <SkeletonCard count={TRANS_LIMIT} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {pageItems.map((trans) => (
            <TransformationCard key={trans.id} transformation={trans} />
          ))}
        </div>
      )}

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}
