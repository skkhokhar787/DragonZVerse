const API_BASE = "https://dragonball-api.com/api";

export async function fetchCharacters(limit = 100) {
  const res = await fetch(`${API_BASE}/characters?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch characters");
  const data = await res.json();
  return data.items || data;
}

export async function fetchCharacterById(id) {
  const res = await fetch(`${API_BASE}/characters/${id}`);
  if (!res.ok) throw new Error("Character not found");
  return res.json();
}

export async function fetchPlanets(limit = 50) {
  const res = await fetch(`${API_BASE}/planets?limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch planets");
  const data = await res.json();
  return data.items || data;
}

export async function fetchPlanetById(id) {
  const res = await fetch(`${API_BASE}/planets/${id}`);
  if (!res.ok) throw new Error("Planet not found");
  return res.json();
}

export async function fetchTransformations() {
  const res = await fetch(`${API_BASE}/transformations`);
  if (!res.ok) throw new Error("Failed to fetch transformations");
  return res.json();
}
