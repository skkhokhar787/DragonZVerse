export function parseKi(kiStr) {
  if (!kiStr) return 0;
  let clean = kiStr.replace(/\./g, "").replace(/,/g, "").trim().toLowerCase();
  if (clean.includes("billion")) return parseFloat(clean) * 1000000000;
  if (clean.includes("trillion")) return parseFloat(clean) * 1000000000000;
  if (clean.includes("quadrillion")) return parseFloat(clean) * 1000000000000000;
  if (clean.includes("quintillion")) return parseFloat(clean) * 1000000000000000000;
  if (clean.includes("sextillion")) return parseFloat(clean) * 1000000000000000000000;
  if (clean.includes("septillion")) return parseFloat(clean) * 1000000000000000000000000;
  if (clean.includes("octillion")) return parseFloat(clean) * 1000000000000000000000000000;
  return parseFloat(clean) || 0;
}

export function getKiPercentage(kiStr) {
  const val = parseKi(kiStr);
  if (val <= 0) return 15;
  const logVal = Math.log10(val);
  const minLog = 3;
  const maxLog = 27;
  const pct = ((logVal - minLog) / (maxLog - minLog)) * 100;
  return Math.min(Math.max(Math.round(pct), 15), 100);
}
