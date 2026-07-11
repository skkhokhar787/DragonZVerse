// Subtle scroll effect for navbar
window.addEventListener("scroll", () => {
  const nav = document.querySelector("nav");
  if (window.scrollY > 50) {
    nav.classList.add("h-16", "bg-secondary/90");
    nav.classList.remove("h-20", "bg-secondary/60");
  } else {
    nav.classList.add("h-20", "bg-secondary/60");
    nav.classList.remove("h-16", "bg-secondary/90");
  }
});

// -------------------------------------------------------------
// DragonVerse JavaScript Application Controller
// -------------------------------------------------------------

// Application State
let activeTab = "home";
let allCharacters = [];
let filteredCharacters = [];
let allPlanets = [];
let allTransformations = [];

let charPage = 1;
const charLimit = 8;
let planetPage = 1;
const planetLimit = 6;
let transPage = 1;
const transLimit = 8;

let currentLayout = "grid";
let featuredCharacter = null;
let previousTab = "home";

// Translation Cache
const translationCache = {};

// Free Google Translate API Integration
async function translateToEnglish(text) {
  if (!text) return "";
  if (translationCache[text]) return translationCache[text];
  try {
    const response = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q=${encodeURIComponent(text)}`,
    );
    const data = await response.json();
    if (data && data[0]) {
      const translated = data[0].map((item) => item[0]).join("");
      translationCache[text] = translated;
      return translated;
    }
    return text;
  } catch (e) {
    console.error("Translation error:", e);
    return text; // Fallback to original
  }
}

// Helper to parse Ki strings for relative power bar calculations (uses logarithmic scaling)
function parseKi(kiStr) {
  if (!kiStr) return 0;
  let clean = kiStr.replace(/\./g, "").replace(/,/g, "").trim().toLowerCase();
  if (clean.includes("billion")) {
    return parseFloat(clean) * 1000000000;
  } else if (clean.includes("trillion")) {
    return parseFloat(clean) * 1000000000000;
  } else if (clean.includes("quadrillion")) {
    return parseFloat(clean) * 1000000000000000;
  } else if (clean.includes("quintillion")) {
    return parseFloat(clean) * 1000000000000000000;
  } else if (clean.includes("sextillion")) {
    return parseFloat(clean) * 1000000000000000000000;
  } else if (clean.includes("septillion")) {
    return parseFloat(clean) * 1000000000000000000000000;
  } else if (clean.includes("octillion")) {
    return parseFloat(clean) * 1000000000000000000000000000;
  }
  return parseFloat(clean) || 0;
}

function getKiPercentage(kiStr) {
  let val = parseKi(kiStr);
  if (val <= 0) return 15;
  let logVal = Math.log10(val);
  let minLog = 3; // log(1000)
  let maxLog = 27; // log(septillion)
  let pct = ((logVal - minLog) / (maxLog - minLog)) * 100;
  return Math.min(Math.max(Math.round(pct), 15), 100);
}

// Reusable pulsing energy-ring SVG loader, themed to the app's primary orange palette
function pulseLoaderSVG(size = 120) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" style="width:${size}px;height:${size}px;">
        <circle fill="none" stroke-opacity="1" stroke="#ee9b00" stroke-width=".5" cx="100" cy="100" r="0">
            <animate attributeName="r" calcMode="spline" dur="2" values="1;80" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
            <animate attributeName="stroke-width" calcMode="spline" dur="2" values="0;25" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
            <animate attributeName="stroke-opacity" calcMode="spline" dur="2" values="1;0" keyTimes="0;1" keySplines="0 .2 .5 1" repeatCount="indefinite"></animate>
        </circle>
    </svg>
  `;
}

// Reusable centered loading state for any grid section (characters, planets, transformations)
function showSectionLoader(gridId, message) {
  const grid = document.getElementById(gridId);
  grid.innerHTML = `
    <div class="col-span-full flex flex-col items-center justify-center py-20 gap-4">
      ${pulseLoaderSVG()}
      <p class="text-lg text-primary font-bold tracking-widest text-center">${message}</p>
    </div>
  `;
}

// Switch between Home, Characters, Planets, Transformations Tabs
function switchTab(tabId, updateHash = true) {
  activeTab = tabId;

  // Update Active Navigation Styles
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.className =
      "nav-link font-headline-md text-headline-md text-on-surface-variant hover:text-primary transition-colors hover:scale-105 duration-200 cursor-pointer";
  });
  const activeLink = document.getElementById(`tab-${tabId}`);
  if (activeLink) {
    activeLink.className =
      "nav-link font-headline-md text-headline-md text-primary border-b-2 border-primary pb-1 transition-all duration-150 cursor-pointer";
  }

  // Toggle Section Visibilities
  const heroSec = document.getElementById("hero-section");
  const filterBar = document.getElementById("filter-bar");
  const mainChars = document.getElementById("main-characters");
  const mainPlanets = document.getElementById("main-planets");
  const mainTrans = document.getElementById("main-transformations");
  const mainCharDetail = document.getElementById("main-character-detail");
  const mainPlanetDetail = document.getElementById("main-planet-detail");

  // Leaving a detail page, so hide it and clear its URL hash
  mainCharDetail.classList.add("hidden");
  mainPlanetDetail.classList.add("hidden");
  if (
    updateHash &&
    (window.location.hash.startsWith("#character/") ||
      window.location.hash.startsWith("#planet/"))
  ) {
    history.pushState({ tab: tabId }, "", window.location.pathname);
  }

  if (tabId === "home") {
    heroSec.classList.remove("hidden");
    filterBar.classList.remove("hidden");
    mainChars.classList.remove("hidden");
    mainPlanets.classList.add("hidden");
    mainTrans.classList.add("hidden");
    renderCharacters();
  } else if (tabId === "characters") {
    heroSec.classList.add("hidden");
    filterBar.classList.remove("hidden");
    mainChars.classList.remove("hidden");
    mainPlanets.classList.add("hidden");
    mainTrans.classList.add("hidden");
    renderCharacters();
  } else if (tabId === "planets") {
    heroSec.classList.add("hidden");
    filterBar.classList.add("hidden");
    mainChars.classList.add("hidden");
    mainPlanets.classList.remove("hidden");
    mainTrans.classList.add("hidden");
    renderPlanets();
  } else if (tabId === "transformations") {
    heroSec.classList.add("hidden");
    filterBar.classList.add("hidden");
    mainChars.classList.add("hidden");
    mainPlanets.classList.add("hidden");
    mainTrans.classList.remove("hidden");
    renderTransformations();
  }
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// Fetch All Initial Characters & Load Sub-APIs
async function initializeApp() {
  try {
    // Show skeletons on characters grid
    showCharactersSkeleton();

    // Fetch Characters
    const response = await fetch(
      "https://dragonball-api.com/api/characters?limit=100",
    );
    const data = await response.json();
    allCharacters = data.items || data;
    filteredCharacters = [...allCharacters];

    // Setup Featured Fighter on Hero Section (Random selection between popular IDs)
    const featuredPool = [1, 2, 4, 11, 24]; // Goku, Vegeta, Piccolo, Trunks, Gohan
    const randomIndex =
      featuredPool[Math.floor(Math.random() * featuredPool.length)];
    fetchHeroFighter(randomIndex);

    // Render list
    renderCharacters();

    // Background Load other tabs to make them fast
    fetchPlanetsData();
    fetchTransformationsData();

    // Attach Event Listeners
    setupEventListeners();

    // Deep-link support: open a character's or planet's detail page directly if the URL requests one
    const charDeepLink = window.location.hash.match(/^#character\/(\d+)/);
    const planetDeepLink = window.location.hash.match(/^#planet\/(\d+)/);
    if (charDeepLink) {
      previousTab = "characters";
      showCharacterDetailPage(charDeepLink[1], false);
    } else if (planetDeepLink) {
      previousTab = "planets";
      showPlanetDetailPage(planetDeepLink[1], false);
    }
  } catch (err) {
    console.error("Initialization failed", err);
    document.getElementById("characters-grid").innerHTML = `
                    <div class="col-span-full text-center py-12">
                        <span class="material-symbols-outlined text-error text-6xl mb-4">error</span>
                        <p class="text-xl text-on-surface">Failed to load galactic archive data. Please refresh and try again.</p>
                    </div>
                `;
  }
}

async function fetchHeroFighter(id) {
  try {
    const res = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    const data = await res.json();
    featuredCharacter = data;

    // Translate Hero Description to English
    const englishDesc = await translateToEnglish(data.description);

    // Populate Hero
    document.getElementById("hero-title").innerText = data.name;
    document.getElementById("hero-description").innerText = englishDesc;
    document.getElementById("hero-tag").innerText = `Featured ${data.race}`;

    const heroImg = document.getElementById("hero-char-img");
    heroImg.classList.add("opacity-0");
    setTimeout(() => {
      heroImg.src = data.image;
      heroImg.alt = data.name;
      heroImg.classList.remove("opacity-0");
    }, 300);

    // Update Hero Background Image to match Origin Planet (with fallback to default)
    const heroBg = document.getElementById("hero-bg");
    if (data.originPlanet && data.originPlanet.image) {
      heroBg.style.backgroundImage = `url('${data.originPlanet.image}')`;
    } else {
      heroBg.style.backgroundImage =
        "url('aae0bfb2-fbfb-4ac4-80d4-2af69dcd0ab0.png')";
    }

    // Bind VIEW STATS button to open the character detail page
    document.getElementById("hero-stats-btn").onclick = () => {
      showCharacterDetailPage(data.id);
    };

    // Bind clicking hero image to the detail page too
    heroImg.onclick = () => {
      showCharacterDetailPage(data.id);
    };
  } catch (e) {
    console.error("Error setting up hero fighter:", e);
  }
}

async function fetchPlanetsData() {
  try {
    const res = await fetch("https://dragonball-api.com/api/planets?limit=50");
    const data = await res.json();
    allPlanets = data.items || data;
  } catch (e) {
    console.error("Error fetching planets:", e);
  }
}

async function fetchTransformationsData() {
  try {
    const res = await fetch("https://dragonball-api.com/api/transformations");
    const data = await res.json();
    allTransformations = data;
  } catch (e) {
    console.error("Error fetching transformations:", e);
  }
}

// Show loading states while section data is being fetched
function showCharactersSkeleton() {
  showSectionLoader("characters-grid", "DECRYPTING GALACTIC FILES...");
}

function showPlanetsSkeleton() {
  showSectionLoader("planets-grid", "SCANNING PLANETARY SURFACES...");
}

// Render Characters Grid or List
function renderCharacters() {
  const grid = document.getElementById("characters-grid");
  grid.innerHTML = "";

  if (filteredCharacters.length === 0) {
    grid.className = "col-span-full w-full flex flex-col items-center py-16";
    grid.innerHTML = `
                    <span class="material-symbols-outlined text-primary/40 text-7xl mb-4">gpp_maybe</span>
                    <p class="text-xl text-on-surface-variant text-center">No warriors matching current criteria found in this multiverse.</p>
                `;
    document.getElementById("characters-pagination").innerHTML = "";
    return;
  }

  // Adjust layouts classes
  if (currentLayout === "grid") {
    grid.className =
      "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-gutter transition-all duration-300";
  } else {
    grid.className =
      "flex flex-col gap-6 transition-all duration-300 w-full col-span-full";
  }

  const start = (charPage - 1) * charLimit;
  const end = start + charLimit;
  const pageItems = filteredCharacters.slice(start, end);

  pageItems.forEach((char) => {
    const percentage = getKiPercentage(char.ki);

    // Get affiliation badge style
    let badgeClass =
      "bg-primary-container/80 text-on-primary-fixed border border-primary/20";
    if (char.affiliation === "Army of Frieza") {
      badgeClass =
        "bg-error-container/80 text-on-error-container border border-error/20";
    } else if (char.affiliation === "Galactic Patrol") {
      badgeClass =
        "bg-secondary-container/80 text-on-secondary-container border border-secondary/20";
    } else if (char.affiliation === "Freelancer") {
      badgeClass =
        "bg-surface-container-highest/80 text-on-surface border border-outline/20";
    }

    let cardHtml = "";

    if (currentLayout === "grid") {
      cardHtml = `
                    <div class="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-105 hover:border-primary transition-all duration-300 flex flex-col" onclick="showCharacterDetailPage(${char.id})">
                        <div class="relative h-64 w-full overflow-hidden bg-surface-container-low flex items-center justify-center p-4">
                            <img class="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(255,183,129,0.2)]" src="${char.image}" alt="${char.name}"/>
                            <div class="absolute top-3 right-3 ${badgeClass} backdrop-blur-md px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase">${char.affiliation}</div>
                        </div>
                        <div class="p-5 flex-grow flex flex-col justify-between">
                            <div class="flex justify-between items-start mb-2">
                                <div>
                                    <h3 class="font-headline-md text-headline-md text-on-surface">${char.name}</h3>
                                    <span class="text-on-surface-variant text-sm">${char.race}</span>
                                </div>
                                <span class="material-symbols-outlined text-primary group-hover:energy-pulse">bolt</span>
                            </div>
                            <div class="mt-4">
                                <div class="flex justify-between mb-1">
                                    <span class="font-label-md text-label-md text-on-surface-variant text-xs">Ki Level</span>
                                    <span class="font-label-md text-label-md text-primary text-xs">${char.ki}</span>
                                </div>
                                <div class="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                    <div class="power-bar-fill h-full" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
    } else {
      cardHtml = `
                    <div class="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.01] hover:border-primary transition-all duration-300 flex flex-col md:flex-row items-center gap-6 p-5 w-full" onclick="showCharacterDetailPage(${char.id})">
                        <div class="relative w-32 h-32 flex-shrink-0 overflow-hidden bg-surface-container rounded-lg p-2 flex items-center justify-center">
                            <img class="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" src="${char.image}" alt="${char.name}" />
                        </div>
                        <div class="flex-grow w-full">
                            <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
                                <div>
                                    <h3 class="font-headline-md text-headline-md text-on-surface">${char.name}</h3>
                                    <div class="flex gap-2 mt-1">
                                        <span class="bg-surface-container-high text-on-surface-variant text-xs px-2 py-0.5 rounded-full">${char.race}</span>
                                        <span class="bg-surface-container-high text-on-surface-variant text-xs px-2 py-0.5 rounded-full">${char.gender}</span>
                                    </div>
                                </div>
                                <span class="${badgeClass} text-xs px-3 py-1 rounded font-bold tracking-wider mt-2 md:mt-0 uppercase">${char.affiliation}</span>
                            </div>
                            <div class="mt-4">
                                <div class="flex justify-between mb-1">
                                    <span class="font-label-md text-label-md text-on-surface-variant text-xs">Ki Level</span>
                                    <span class="font-label-md text-label-md text-primary font-bold text-xs">${char.ki}</span>
                                </div>
                                <div class="h-2 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                    <div class="power-bar-fill h-full" style="width: ${percentage}%"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
    }
    grid.innerHTML += cardHtml;
  });

  renderCharactersPagination();
}

function renderCharactersPagination() {
  const container = document.getElementById("characters-pagination");
  const totalPages = Math.ceil(filteredCharacters.length / charLimit);

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
                <button onclick="changeCharPage(${charPage - 1})" class="w-12 h-12 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all group active:scale-90 ${charPage === 1 ? "opacity-40 cursor-not-allowed" : ""}" ${charPage === 1 ? "disabled" : ""}>
                    <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
                <div class="flex gap-2">
            `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === charPage) {
      html += `<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-fixed font-bold">${i}</button>`;
    } else {
      html += `<button onclick="changeCharPage(${i})" class="w-10 h-10 flex items-center justify-center rounded-lg glass-card hover:bg-primary/20 transition-all text-on-surface-variant hover:text-primary">${i}</button>`;
    }
  }

  html += `
                </div>
                <button onclick="changeCharPage(${charPage + 1})" class="w-12 h-12 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all group active:scale-90 ${charPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}" ${charPage === totalPages ? "disabled" : ""}>
                    <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            `;

  container.innerHTML = html;
}

function changeCharPage(newPage) {
  charPage = newPage;
  renderCharacters();

  // Scroll smoothly to filter bar
  document.getElementById("filter-bar").scrollIntoView({ behavior: "smooth" });
}

// Render Planets
async function renderPlanets() {
  showPlanetsSkeleton();

  if (allPlanets.length === 0) {
    await fetchPlanetsData();
  }

  const grid = document.getElementById("planets-grid");
  grid.innerHTML = "";

  const start = (planetPage - 1) * planetLimit;
  const end = start + planetLimit;
  const pageItems = allPlanets.slice(start, end);

  // Translate descriptions dynamically for current page planets
  await Promise.all(
    pageItems.map(async (planet) => {
      if (!planet.descriptionEnglish) {
        planet.descriptionEnglish = await translateToEnglish(
          planet.description,
        );
      }
    }),
  );

  grid.innerHTML = "";
  pageItems.forEach((planet) => {
    let badgeClass =
      "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
    let statusText = "Safe 🪐";
    if (planet.isDestroyed) {
      badgeClass = "bg-red-950/80 text-red-300 border border-red-500/30";
      statusText = "Destroyed ☄️";
    }

    grid.innerHTML += `
                <div class="glass-card rounded-xl overflow-hidden group cursor-pointer hover:scale-[1.03] hover:border-primary transition-all duration-300 flex flex-col" onclick="showPlanetDetailPage(${planet.id})">
                    <div class="relative h-48 w-full overflow-hidden bg-surface-container-low flex items-center justify-center p-4">
                        <img class="max-h-full object-contain group-hover:scale-105 transition-transform duration-500 filter drop-shadow-[0_0_15px_rgba(65,90,119,0.5)]" src="${planet.image}" alt="${planet.name}" />
                        <div class="absolute top-3 right-3 ${badgeClass} backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                            ${statusText}
                        </div>
                    </div>
                    <div class="p-6 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 class="font-headline-md text-headline-md text-primary mb-2">${planet.name}</h3>
                            <p class="text-on-surface-variant text-sm line-clamp-4 leading-relaxed">${planet.descriptionEnglish || planet.description}</p>
                        </div>
                    </div>
                </div>
                `;
  });

  renderPlanetsPagination();
}

function renderPlanetsPagination() {
  const container = document.getElementById("planets-pagination");
  const totalPages = Math.ceil(allPlanets.length / planetLimit);

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
                <button onclick="changePlanetPage(${planetPage - 1})" class="w-12 h-12 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all group active:scale-90 ${planetPage === 1 ? "opacity-40 cursor-not-allowed" : ""}" ${planetPage === 1 ? "disabled" : ""}>
                    <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
                <div class="flex gap-2">
            `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === planetPage) {
      html += `<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-fixed font-bold">${i}</button>`;
    } else {
      html += `<button onclick="changePlanetPage(${i})" class="w-10 h-10 flex items-center justify-center rounded-lg glass-card hover:bg-primary/20 transition-all text-on-surface-variant hover:text-primary">${i}</button>`;
    }
  }

  html += `
                </div>
                <button onclick="changePlanetPage(${planetPage + 1})" class="w-12 h-12 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all group active:scale-90 ${planetPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}" ${planetPage === totalPages ? "disabled" : ""}>
                    <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            `;

  container.innerHTML = html;
}

function changePlanetPage(newPage) {
  planetPage = newPage;
  renderPlanets();
}

// Render Transformations
async function renderTransformations() {
  showSectionLoader(
    "transformations-grid",
    "DECRYPTING SAIYAN ENERGY CONFIGURATIONS...",
  );

  if (allTransformations.length === 0) {
    await fetchTransformationsData();
  }

  const grid = document.getElementById("transformations-grid");
  grid.innerHTML = "";

  const start = (transPage - 1) * transLimit;
  const end = start + transLimit;
  const pageItems = allTransformations.slice(start, end);

  pageItems.forEach((trans) => {
    grid.innerHTML += `
                <div class="glass-card rounded-xl overflow-hidden group hover:scale-[1.03] hover:border-primary transition-all duration-300 flex flex-col">
                    <div class="relative h-64 w-full overflow-hidden bg-surface-container flex items-center justify-center p-4">
                        <img class="max-h-full object-contain group-hover:scale-110 transition-transform duration-500 filter drop-shadow-[0_0_20px_rgba(255,186,39,0.35)]" src="${trans.image}" alt="${trans.name}" />
                        <div class="absolute top-3 right-3 bg-tertiary-container/90 backdrop-blur-md px-3 py-1 rounded text-[10px] font-bold text-on-tertiary-container tracking-wider uppercase border border-tertiary/20">
                            SSJ BOOST
                        </div>
                    </div>
                    <div class="p-5 flex-grow flex flex-col justify-between">
                        <div>
                            <h3 class="font-headline-md text-headline-md text-on-surface mb-2">${trans.name}</h3>
                            <div class="flex justify-between items-center mt-3 pt-2 border-t border-outline/20">
                                <span class="text-xs text-on-surface-variant uppercase tracking-wider">Ki Power Boost</span>
                                <span class="text-sm text-primary font-bold">${trans.ki}</span>
                            </div>
                        </div>
                    </div>
                </div>
                `;
  });

  renderTransformationsPagination();
}

function renderTransformationsPagination() {
  const container = document.getElementById("transformations-pagination");
  const totalPages = Math.ceil(allTransformations.length / transLimit);

  if (totalPages <= 1) {
    container.innerHTML = "";
    return;
  }

  let html = `
                <button onclick="changeTransPage(${transPage - 1})" class="w-12 h-12 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all group active:scale-90 ${transPage === 1 ? "opacity-40 cursor-not-allowed" : ""}" ${transPage === 1 ? "disabled" : ""}>
                    <span class="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
                </button>
                <div class="flex gap-2">
            `;

  for (let i = 1; i <= totalPages; i++) {
    if (i === transPage) {
      html += `<button class="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-container text-on-primary-fixed font-bold">${i}</button>`;
    } else {
      html += `<button onclick="changeTransPage(${i})" class="w-10 h-10 flex items-center justify-center rounded-lg glass-card hover:bg-primary/20 transition-all text-on-surface-variant hover:text-primary">${i}</button>`;
    }
  }

  html += `
                </div>
                <button onclick="changeTransPage(${transPage + 1})" class="w-12 h-12 flex items-center justify-center rounded-full glass-card text-on-surface-variant hover:text-primary hover:border-primary transition-all group active:scale-90 ${transPage === totalPages ? "opacity-40 cursor-not-allowed" : ""}" ${transPage === totalPages ? "disabled" : ""}>
                    <span class="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
            `;

  container.innerHTML = html;
}

function changeTransPage(newPage) {
  transPage = newPage;
  renderTransformations();
}

// Real-time Filters & Search
function applyFilters() {
  const query = document
    .getElementById("search-input")
    .value.toLowerCase()
    .trim();
  const race = document.getElementById("filter-race").value;
  const gender = document.getElementById("filter-gender").value;
  const affiliation = document.getElementById("filter-affiliation").value;

  filteredCharacters = allCharacters.filter((char) => {
    // Search query matching
    const matchesQuery =
      !query ||
      char.name.toLowerCase().includes(query) ||
      char.race.toLowerCase().includes(query) ||
      char.affiliation.toLowerCase().includes(query);

    // Race matching
    const matchesRace =
      race === "All" || char.race.toLowerCase() === race.toLowerCase();

    // Gender matching
    const matchesGender =
      gender === "All" || char.gender.toLowerCase() === gender.toLowerCase();

    // Affiliation matching (special handling for "Other")
    let matchesAffiliation = true;
    if (affiliation !== "All") {
      if (affiliation === "Other") {
        const standardFactions = [
          "Z Fighter",
          "Galactic Patrol",
          "Army of Frieza",
          "Pride Troopers",
          "Freelancer",
        ];
        matchesAffiliation = !standardFactions.includes(char.affiliation);
      } else {
        matchesAffiliation =
          char.affiliation.toLowerCase() === affiliation.toLowerCase();
      }
    }

    return matchesQuery && matchesRace && matchesGender && matchesAffiliation;
  });

  charPage = 1;
  renderCharacters();
}

// Character Detail Page
// Builds the inner HTML for a character's detail content (image, stats, bio, planet, transformations)
function buildCharacterDetailHTML(char, charDescEnglish, planetDescEnglish) {
  const percentage = getKiPercentage(char.ki);
  const maxPercentage = getKiPercentage(char.maxKi);

  let transformationsHtml = "";
  if (char.transformations && char.transformations.length > 0) {
    transformationsHtml += `
                        <div class="mt-8 border-t border-outline/30 pt-6">
                            <h4 class="font-headline-md text-headline-md text-tertiary mb-4 tracking-wide">MULTIVERSE EVOLUTIONS</h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    `;
    char.transformations.forEach((t) => {
      transformationsHtml += `
                            <div class="glass-card rounded-lg overflow-hidden p-3 flex flex-col gap-2 group hover:border-primary transition-all duration-300">
                                <div class="h-32 bg-surface-container-low flex items-center justify-center p-2 rounded overflow-hidden">
                                    <img class="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" src="${t.image}" alt="${t.name}" />
                                </div>
                                <span class="font-semibold text-sm truncate text-on-surface text-center">${t.name}</span>
                                <div class="flex justify-between items-center text-[10px] text-on-surface-variant border-t border-outline/10 pt-1 mt-1">
                                    <span>KI</span>
                                    <span class="text-primary font-bold">${t.ki}</span>
                                </div>
                            </div>
                        `;
    });
    transformationsHtml += `</div></div>`;
  } else {
    transformationsHtml = `
                        <div class="mt-8 border-t border-outline/30 pt-6">
                            <h4 class="font-headline-md text-headline-md text-tertiary mb-2">MULTIVERSE EVOLUTIONS</h4>
                            <p class="text-on-surface-variant text-sm italic">This character has no recorded planetary or genetic transformations in the database.</p>
                        </div>
                    `;
  }

  let planetHtml = "";
  if (char.originPlanet) {
    let planetBadge =
      "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
    let planetStatus = "Safe Planet";
    if (char.originPlanet.isDestroyed) {
      planetBadge = "bg-red-950/80 text-red-300 border border-red-500/30";
      planetStatus = "Planet Destroyed";
    }

    planetHtml = `
                        <div class="mt-8 border-t border-outline/30 pt-6">
                            <h4 class="font-headline-md text-headline-md text-tertiary mb-4">ORIGIN PLANET</h4>
                            <div class="glass-card rounded-xl overflow-hidden flex flex-col sm:flex-row items-center gap-6 p-4">
                                <div class="relative w-28 h-28 flex-shrink-0 bg-surface-container rounded-lg overflow-hidden p-2 flex items-center justify-center">
                                    <img class="max-h-full object-contain filter drop-shadow-[0_0_10px_rgba(65,90,119,0.3)]" src="${char.originPlanet.image}" alt="${char.originPlanet.name}" />
                                </div>
                                <div class="flex-grow w-full">
                                    <div class="flex items-center gap-3 mb-2">
                                        <span class="font-bold text-lg text-primary">${char.originPlanet.name}</span>
                                        <span class="${planetBadge} text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">${planetStatus}</span>
                                    </div>
                                    <p class="text-on-surface-variant text-sm leading-relaxed">${planetDescEnglish || char.originPlanet.description}</p>
                                </div>
                            </div>
                        </div>
                    `;
  }

  return `
                    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <!-- Left image section -->
                        <div class="w-full md:w-1/3 flex flex-col items-center">
                            <div class="w-64 h-[350px] bg-surface-container rounded-xl flex items-center justify-center p-4 relative overflow-hidden border border-outline/20 shadow-[0_0_20px_rgba(255,183,129,0.1)]">
                                <div class="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent"></div>
                                <img class="max-h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,183,129,0.4)] relative z-10" src="${char.image}" alt="${char.name}" />
                            </div>
                            
                            <!-- Badges under image -->
                            <div class="flex flex-wrap gap-2 justify-center mt-4">
                                <span class="bg-primary/20 text-primary text-xs px-3 py-1 rounded-full font-semibold border border-primary/20">${char.race}</span>
                                <span class="bg-secondary/20 text-secondary text-xs px-3 py-1 rounded-full font-semibold border border-secondary/20">${char.gender}</span>
                                <span class="bg-surface-container-highest text-on-surface-variant text-xs px-3 py-1 rounded-full font-semibold border border-outline/10">${char.affiliation}</span>
                            </div>
                        </div>
                        
                        <!-- Right content section -->
                        <div class="flex-grow w-full md:w-2/3">
                            <h2 class="font-display-lg text-4xl text-primary leading-none mb-2 uppercase tracking-wide">${char.name}</h2>
                            
                            <!-- Ki level indicators -->
                            <div class="my-6 glass-card p-4 rounded-xl border border-outline/10 flex flex-col gap-4">
                                <div>
                                    <div class="flex justify-between items-baseline mb-1.5">
                                        <span class="text-xs text-on-surface-variant uppercase tracking-wider">Base Ki</span>
                                        <span class="text-xl text-primary font-bold">${char.ki}</span>
                                    </div>
                                    <div class="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div class="power-bar-fill h-full" style="width: ${percentage}%"></div>
                                    </div>
                                </div>
                                <div>
                                    <div class="flex justify-between items-baseline mb-1.5">
                                        <span class="text-xs text-on-surface-variant uppercase tracking-wider">Max Ki Cap</span>
                                        <span class="text-xl text-tertiary font-bold">${char.maxKi}</span>
                                    </div>
                                    <div class="h-3 w-full bg-surface-container-highest rounded-full overflow-hidden">
                                        <div class="h-full rounded-full" style="width: ${maxPercentage}%; background: linear-gradient(90deg, #d69900, #ffba27); box-shadow: 0 0 10px rgba(255,186,39,0.8);"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Biography -->
                            <div class="mt-4">
                                <h4 class="font-headline-md text-headline-md text-tertiary mb-2 tracking-wide">CHRONICLES & BIO</h4>
                                <p class="text-on-surface text-base leading-relaxed text-justify">${charDescEnglish}</p>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Planet & Transformations -->
                    ${planetHtml}
                    ${transformationsHtml}
                `;
}

// Navigates to the character detail page and loads that character's data
async function showCharacterDetailPage(id, updateHash = true) {
  // Remember which tab to return to when the user leaves this page
  if (activeTab !== "character-detail") {
    previousTab = activeTab;
  }
  activeTab = "character-detail";

  // Deactivate nav tab highlighting since this is a sub-page
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.className =
      "nav-link font-headline-md text-headline-md text-on-surface-variant hover:text-primary transition-colors hover:scale-105 duration-200 cursor-pointer";
  });

  // Toggle Section Visibilities
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("filter-bar").classList.add("hidden");
  document.getElementById("main-characters").classList.add("hidden");
  document.getElementById("main-planets").classList.add("hidden");
  document.getElementById("main-transformations").classList.add("hidden");
  document.getElementById("main-character-detail").classList.remove("hidden");

  if (updateHash) {
    history.pushState({ tab: "character-detail", id }, "", `#character/${id}`);
  }

  const content = document.getElementById("character-detail-content");
  content.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
                    ${pulseLoaderSVG()}
                    <p class="text-xl text-primary font-bold tracking-widest">DECRYPTING GALACTIC FILES...</p>
                </div>
            `;
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const res = await fetch(`https://dragonball-api.com/api/characters/${id}`);
    if (!res.ok) throw new Error("Character not found");
    const char = await res.json();

    // Translate character description
    const charDescEnglish = await translateToEnglish(char.description);

    // Translate origin planet description
    let planetDescEnglish = "";
    if (char.originPlanet && char.originPlanet.description) {
      planetDescEnglish = await translateToEnglish(
        char.originPlanet.description,
      );
    }

    content.innerHTML = buildCharacterDetailHTML(
      char,
      charDescEnglish,
      planetDescEnglish,
    );
  } catch (err) {
    console.error("Error loading character detail page:", err);
    content.innerHTML = `
                    <div class="text-center py-16">
                        <span class="material-symbols-outlined text-error text-5xl mb-4">gpp_maybe</span>
                        <p class="text-lg text-on-surface">Data extraction from character record failed. Please try again.</p>
                    </div>
                `;
  }
}

// Leaves the character detail page and returns to whichever tab preceded it
function closeCharacterDetailPage() {
  document.getElementById("main-character-detail").classList.add("hidden");
  if (window.location.hash.startsWith("#character/")) {
    history.pushState({}, "", window.location.pathname);
  }
  switchTab(previousTab || "characters", false);
}

// Planet Detail Page
// Builds the inner HTML for a planet's detail content (image, status, description, resident fighters)
function buildPlanetDetailHTML(planet, planetDescEnglish, fighters) {
  let badgeClass =
    "bg-emerald-950/80 text-emerald-300 border border-emerald-500/30";
  let statusText = "Safe Planet";
  if (planet.isDestroyed) {
    badgeClass = "bg-red-950/80 text-red-300 border border-red-500/30";
    statusText = "Planet Destroyed";
  }

  let fightersHtml = "";
  if (fighters && fighters.length > 0) {
    fightersHtml = `
                        <div class="mt-8 border-t border-outline/30 pt-6">
                            <h4 class="font-headline-md text-headline-md text-tertiary mb-4 tracking-wide">RESIDENT FIGHTERS (${fighters.length})</h4>
                            <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    `;
    fighters.forEach((f) => {
      fightersHtml += `
                            <div class="glass-card rounded-lg overflow-hidden p-3 flex flex-col gap-2 group cursor-pointer hover:border-primary hover:scale-105 transition-all duration-300" onclick="showCharacterDetailPage(${f.id})">
                                <div class="h-32 bg-surface-container-low flex items-center justify-center p-2 rounded overflow-hidden">
                                    <img class="max-h-full object-contain group-hover:scale-105 transition-transform duration-300" src="${f.image}" alt="${f.name}" />
                                </div>
                                <span class="font-semibold text-sm truncate text-on-surface text-center">${f.name}</span>
                                <div class="flex justify-between items-center text-[10px] text-on-surface-variant border-t border-outline/10 pt-1 mt-1">
                                    <span>KI</span>
                                    <span class="text-primary font-bold">${f.ki}</span>
                                </div>
                            </div>
                        `;
    });
    fightersHtml += `</div></div>`;
  } else {
    fightersHtml = `
                        <div class="mt-8 border-t border-outline/30 pt-6">
                            <h4 class="font-headline-md text-headline-md text-tertiary mb-2">RESIDENT FIGHTERS</h4>
                            <p class="text-on-surface-variant text-sm italic">No warriors from this planet are currently recorded in the galactic archive.</p>
                        </div>
                    `;
  }

  return `
                    <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
                        <!-- Left image section -->
                        <div class="w-full md:w-1/3 flex flex-col items-center">
                            <div class="w-64 h-64 bg-surface-container rounded-xl flex items-center justify-center p-4 relative overflow-hidden border border-outline/20 shadow-[0_0_20px_rgba(255,183,129,0.1)]">
                                <div class="absolute inset-0 bg-gradient-to-t from-surface-container-high via-transparent to-transparent"></div>
                                <img class="max-h-full object-contain filter drop-shadow-[0_0_25px_rgba(255,183,129,0.4)] relative z-10" src="${planet.image}" alt="${planet.name}" />
                            </div>
                            <span class="${badgeClass} text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider mt-4">${statusText}</span>
                        </div>

                        <!-- Right content section -->
                        <div class="flex-grow w-full md:w-2/3">
                            <h2 class="font-display-lg text-4xl text-primary leading-none mb-4 uppercase tracking-wide">${planet.name}</h2>
                            <div>
                                <h4 class="font-headline-md text-headline-md text-tertiary mb-2 tracking-wide">PLANETARY OVERVIEW</h4>
                                <p class="text-on-surface text-base leading-relaxed text-justify">${planetDescEnglish || planet.description}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Resident Fighters -->
                    ${fightersHtml}
                `;
}

// Navigates to the planet detail page and loads that planet's data + resident fighters
async function showPlanetDetailPage(id, updateHash = true) {
  // Remember which tab to return to when the user leaves this page
  if (activeTab !== "planet-detail") {
    previousTab = activeTab;
  }
  activeTab = "planet-detail";

  // Deactivate nav tab highlighting since this is a sub-page
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.className =
      "nav-link font-headline-md text-headline-md text-on-surface-variant hover:text-primary transition-colors hover:scale-105 duration-200 cursor-pointer";
  });

  // Toggle Section Visibilities
  document.getElementById("hero-section").classList.add("hidden");
  document.getElementById("filter-bar").classList.add("hidden");
  document.getElementById("main-characters").classList.add("hidden");
  document.getElementById("main-planets").classList.add("hidden");
  document.getElementById("main-transformations").classList.add("hidden");
  document.getElementById("main-character-detail").classList.add("hidden");
  document.getElementById("main-planet-detail").classList.remove("hidden");

  if (updateHash) {
    history.pushState({ tab: "planet-detail", id }, "", `#planet/${id}`);
  }

  const content = document.getElementById("planet-detail-content");
  content.innerHTML = `
                <div class="flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
                    ${pulseLoaderSVG()}
                    <p class="text-xl text-primary font-bold tracking-widest">SCANNING PLANETARY SURFACE...</p>
                </div>
            `;
  window.scrollTo({ top: 0, behavior: "smooth" });

  try {
    const res = await fetch(`https://dragonball-api.com/api/planets/${id}`);
    if (!res.ok) throw new Error("Planet not found");
    const planet = await res.json();

    const planetDescEnglish = await translateToEnglish(planet.description);

    // Ensure the full character roster is loaded so we can cross-reference residents
    if (allCharacters.length === 0) {
      const charRes = await fetch(
        "https://dragonball-api.com/api/characters?limit=100",
      );
      const charData = await charRes.json();
      allCharacters = charData.items || charData;
      filteredCharacters = [...allCharacters];
    }

    // Prefer the planet record's own character list if the API supplies one,
    // otherwise cross-reference the loaded roster by origin planet id
    let fighters = Array.isArray(planet.characters) ? planet.characters : [];
    if (fighters.length === 0) {
      fighters = allCharacters.filter(
        (c) => c.originPlanet && c.originPlanet.id === planet.id,
      );
    }

    content.innerHTML = buildPlanetDetailHTML(
      planet,
      planetDescEnglish,
      fighters,
    );
  } catch (err) {
    console.error("Error loading planet detail page:", err);
    content.innerHTML = `
                    <div class="text-center py-16">
                        <span class="material-symbols-outlined text-error text-5xl mb-4">gpp_maybe</span>
                        <p class="text-lg text-on-surface">Data extraction from planetary record failed. Please try again.</p>
                    </div>
                `;
  }
}

// Leaves the planet detail page and returns to whichever tab preceded it
function closePlanetDetailPage() {
  document.getElementById("main-planet-detail").classList.add("hidden");
  if (window.location.hash.startsWith("#planet/")) {
    history.pushState({}, "", window.location.pathname);
  }
  switchTab(previousTab || "planets", false);
}

// Handles browser back/forward navigation for deep-linked detail pages
function handleRouteChange() {
  const charMatch = window.location.hash.match(/^#character\/(\d+)/);
  const planetMatch = window.location.hash.match(/^#planet\/(\d+)/);
  if (charMatch) {
    showCharacterDetailPage(charMatch[1], false);
  } else if (planetMatch) {
    showPlanetDetailPage(planetMatch[1], false);
  } else if (activeTab === "character-detail") {
    document.getElementById("main-character-detail").classList.add("hidden");
    switchTab(previousTab || "home", false);
  } else if (activeTab === "planet-detail") {
    document.getElementById("main-planet-detail").classList.add("hidden");
    switchTab(previousTab || "home", false);
  }
}

// Setup Application Action Bindings
function setupEventListeners() {
  // Tab binds
  document.getElementById("tab-home").onclick = () => switchTab("home");
  document.getElementById("tab-characters").onclick = () =>
    switchTab("characters");
  document.getElementById("tab-planets").onclick = () => switchTab("planets");
  document.getElementById("tab-transformations").onclick = () =>
    switchTab("transformations");

  // Filters binds
  document.getElementById("filter-race").onchange = applyFilters;
  document.getElementById("filter-gender").onchange = applyFilters;
  document.getElementById("filter-affiliation").onchange = applyFilters;

  // Real-time Search input binding (desktop/navbar search)
  document.getElementById("search-input").oninput = applyFilters;

  // Grid / List toggles
  document.getElementById("btn-grid-view").onclick = () => {
    currentLayout = "grid";
    document.getElementById("btn-grid-view").className =
      "bg-secondary-container text-on-secondary-container p-2 rounded-lg hover:bg-primary/20 transition-colors";
    document.getElementById("btn-list-view").className =
      "text-on-surface-variant p-2 rounded-lg hover:bg-primary/20 transition-colors";
    renderCharacters();
  };

  document.getElementById("btn-list-view").onclick = () => {
    currentLayout = "list";
    document.getElementById("btn-grid-view").className =
      "text-on-surface-variant p-2 rounded-lg hover:bg-primary/20 transition-colors";
    document.getElementById("btn-list-view").className =
      "bg-secondary-container text-on-secondary-container p-2 rounded-lg hover:bg-primary/20 transition-colors";
    renderCharacters();
  };

  // Character detail page back button
  document.getElementById("detail-back-btn").onclick = closeCharacterDetailPage;

  // Planet detail page back button
  document.getElementById("planet-detail-back-btn").onclick =
    closePlanetDetailPage;

  // Escape key leaves whichever detail page is currently open
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && activeTab === "character-detail") {
      closeCharacterDetailPage();
    } else if (e.key === "Escape" && activeTab === "planet-detail") {
      closePlanetDetailPage();
    }
  });

  // Support browser back/forward buttons for deep-linked detail pages
  window.addEventListener("popstate", handleRouteChange);
}

// Start app
document.addEventListener("DOMContentLoaded", () => {
  initializeApp();
});
