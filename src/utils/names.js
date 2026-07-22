const NAME_MAP = {
  "Freezer": "Frieza",
  "Celula": "Cell",
  "Bills": "Beerus",
  "Tenshinhan": "Tien",
  "Kaio del norte": "King Kai (North)",
  "Kaio del Sur": "King Kai (South)",
  "Kaio del este": "King Kai (East)",
  "Kaio del Oeste": "King Kai (West)",
  "Gran Kaio": "Grand King Kai",
  "Kaio-shin del Este": "Supreme Kai (East)",
  "Kaio-shin del Norte": "Supreme Kai (North)",
  "Kaio-shin del Sur": "Supreme Kai (South)",
  "Kaio-shin del Oeste": "Supreme Kai (West)",
  "Gran Kaio-shin": "Grand Supreme Kai",
  "Marcarita": "Marcarita",
  "Vermoudh": "Vermoud",
  "Android 20 (Dr. Gero)": "Dr. Gero",
};

export function getEnglishName(name) {
  return NAME_MAP[name] || name;
}
