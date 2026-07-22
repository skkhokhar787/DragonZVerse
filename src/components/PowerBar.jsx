export default function PowerBar({ label, value, percentage, color = "primary" }) {
  const gradientClass =
    color === "tertiary"
      ? "linear-gradient(90deg, #d69900, #ffba27)"
      : undefined;

  return (
    <div>
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-xs text-on-surface-variant uppercase tracking-wider">
          {label}
        </span>
        <span
          className={`text-xl font-bold ${
            color === "tertiary" ? "text-tertiary" : "text-primary"
          }`}
        >
          {value}
        </span>
      </div>
      <div className="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
        <div
          className="h-full rounded-full"
          style={{
            width: `${percentage}%`,
            ...(gradientClass
              ? { background: gradientClass, boxShadow: "0 0 10px rgba(255,186,39,0.8)" }
              : {}),
            ...(!gradientClass ? {} : {}),
          }}
        >
          {!gradientClass && <div className="power-bar-fill h-full" style={{ width: "100%" }} />}
        </div>
      </div>
    </div>
  );
}
