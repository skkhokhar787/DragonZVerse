export default function FilterBar({
  search,
  setSearch,
  race,
  setRace,
  gender,
  setGender,
  affiliation,
  setAffiliation,
  layout,
  setLayout,
}) {
  return (
    <section className="px-8 -mt-8 relative z-30 transition-all duration-300">
      <div className="glass-card max-w-container-max mx-auto p-6 rounded-2xl flex flex-wrap gap-6 items-center justify-between">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-primary px-1">RACE</label>
            <select
              value={race}
              onChange={(e) => setRace(e.target.value)}
              className="bg-surface-container-low border-none text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              <option value="All">All Races</option>
              <option value="Saiyan">Saiyan</option>
              <option value="Human">Human</option>
              <option value="Namekian">Namekian</option>
              <option value="Majin">Majin</option>
              <option value="Frieza Race">Frieza Race</option>
              <option value="Android">Android</option>
              <option value="God">God</option>
              <option value="Angel">Angel</option>
              <option value="Jiren race">Jiren race</option>
              <option value="Nucleico">Nucleico</option>
              <option value="Nucleico benigno">Nucleico benigno</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-primary px-1">GENDER</label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value)}
              className="bg-surface-container-low border-none text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              <option value="All">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Unknown">Unknown</option>
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-md text-label-md text-primary px-1">AFFILIATION</label>
            <select
              value={affiliation}
              onChange={(e) => setAffiliation(e.target.value)}
              className="bg-surface-container-low border-none text-on-surface rounded-lg px-4 py-2 focus:ring-1 focus:ring-primary min-w-[140px]"
            >
              <option value="All">All Factions</option>
              <option value="Z Fighter">Z-Fighters</option>
              <option value="Galactic Patrol">Galactic Patrol</option>
              <option value="Army of Frieza">Frieza Force</option>
              <option value="Pride Troopers">Pride Troopers</option>
              <option value="Freelancer">Freelancer</option>
              <option value="Other">Other / Unaligned</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setLayout("grid")}
            className={`p-2 rounded-lg transition-colors ${
              layout === "grid"
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button
            onClick={() => setLayout("list")}
            className={`p-2 rounded-lg transition-colors ${
              layout === "list"
                ? "bg-secondary-container text-on-secondary-container"
                : "text-on-surface-variant hover:bg-primary/20"
            }`}
          >
            <span className="material-symbols-outlined">view_list</span>
          </button>
        </div>
      </div>
    </section>
  );
}
