import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import CharactersPage from "./pages/CharactersPage";
import CharacterDetailPage from "./pages/CharacterDetailPage";
import PlanetsPage from "./pages/PlanetsPage";
import PlanetDetailPage from "./pages/PlanetDetailPage";
import TransformationsPage from "./pages/TransformationsPage";
import BattlesPage from "./pages/BattlesPage";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <ScrollToTop />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/characters" element={<CharactersPage />} />
          <Route path="/characters/:id" element={<CharacterDetailPage />} />
          <Route path="/planets" element={<PlanetsPage />} />
          <Route path="/planets/:id" element={<PlanetDetailPage />} />
          <Route path="/transformations" element={<TransformationsPage />} />
          <Route path="/battles" element={<BattlesPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
