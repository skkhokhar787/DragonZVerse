export default function TransformationCard({ transformation }) {
  return (
    <div className="glass-card rounded-xl overflow-hidden group hover:scale-[1.03] hover:border-primary transition-all duration-300 flex flex-col">
      <div className="relative h-64 w-full overflow-hidden bg-surface-container flex items-center justify-center p-4">
        <img
          className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_20px_rgba(255,186,39,0.35)]"
          src={transformation.image}
          alt={transformation.name}
        />
        <div className="absolute top-3 right-3 bg-tertiary-container/90 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-on-tertiary-container tracking-wider uppercase border border-tertiary/20">
          SSJ BOOST
        </div>
      </div>
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
            {transformation.name}
          </h3>
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-outline/20">
            <span className="text-xs text-on-surface-variant uppercase tracking-wider">
              Ki Power Boost
            </span>
            <span className="text-sm text-primary font-bold">{transformation.ki}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
