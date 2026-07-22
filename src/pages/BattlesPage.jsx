import battles from "../data/battles";
import BattleCard from "../components/BattleCard";
import CustomBattleSection from "../components/CustomBattleSection";

export default function BattlesPage() {
  return (
    <div className="pt-24 px-8 mt-8 max-w-container-max mx-auto mb-20 transition-all duration-300">
      <div className="text-center mb-12">
        <h2 className="font-display-lg text-display-lg text-primary italic mb-4">
          Verse Battles
        </h2>
        <p className="text-on-surface-variant text-body-lg max-w-2xl mx-auto">
          Relive the most iconic matchups in Dragon Ball history. From the Saiyan Saga to the
          Tournament of Power, witness the clashes that defined the multiverse.
        </p>
      </div>

      <CustomBattleSection />

      <div className="flex items-center gap-3 mb-8">
        <span className="material-symbols-outlined text-tertiary text-2xl">local_fire_department</span>
        <h3 className="font-headline-lg text-headline-lg text-tertiary">Iconic Battles</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {battles.map((battle) => (
          <BattleCard key={battle.id} battle={battle} />
        ))}
      </div>
    </div>
  );
}
