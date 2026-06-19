const SEASONS        = ["Spring", "Summer", "Autumn", "Winter"];
const TICKS_PER_DAY  = 2;
const DAYS_PER_SEASON = 30;
const GROWTH_TICKS   = 15;
const STARVE_TICKS   = 5;

const BASE_CAPS = { food: 100, wood: 100, stone: 100 };

const gameState = {
    resources:  { food: 0, wood: 0, stone: 0 },
    buildings:  { lair: 0, farm: 0, lumber: 0, quarry: 0, storage: 0 },
    population: { count: 0, growthTimer: 0, starveTick: 0 },
    time:       { tick: 0, day: 1, year: 1, seasonIndex: 0 },
    stats: {
        peakPopulation:       0,
        buildingsConstructed: 0,
        manualGathers:        0,
        starvationDeaths:     0,
        foodProduced:         0,
        woodProduced:         0,
        stoneProduced:        0,
    },
};

// ── Settings ──────────────────────────────────────────────────────────────────

const SETTINGS_KEY = "dungeonKeeperSettings";

const gameSettings = {
    autosaveInterval:   1,        // ticks between saves; 0 = disabled
    numberFormat:       "abbrev", // "abbrev" | "full"
    reducedAnimations:  false,
};

const AUTOSAVE_CYCLE = [
    { value: 1,  label: "Every Tick" },
    { value: 10, label: "Every 10s"  },
    { value: 60, label: "Every Min"  },
    { value: 0,  label: "Disabled"   },
];

function loadSettings() {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (saved) {
        try { Object.assign(gameSettings, JSON.parse(saved)); } catch (e) {}
    }
    applySettings();
}

function saveSettings() {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(gameSettings));
}

function applySettings() {
    document.body.classList.toggle("reduce-motion", gameSettings.reducedAnimations);
    updateSettingsUI();
}

function updateSettingsUI() {
    // Autosave button label
    const aBtn = document.getElementById("set-autosave");
    if (aBtn) {
        const opt = AUTOSAVE_CYCLE.find(o => o.value === gameSettings.autosaveInterval);
        aBtn.textContent = opt ? opt.label : "?";
        aBtn.className   = "setting-toggle" + (gameSettings.autosaveInterval > 0 ? " is-on" : "");
    }
    // Number format button
    const nBtn = document.getElementById("set-numfmt");
    if (nBtn) {
        nBtn.textContent = gameSettings.numberFormat === "abbrev" ? "Abbreviated" : "Full Numbers";
        nBtn.className   = "setting-toggle is-on";
    }
    // Reduced animations button
    const rBtn = document.getElementById("set-anim");
    if (rBtn) {
        rBtn.textContent = gameSettings.reducedAnimations ? "ON" : "OFF";
        rBtn.className   = "setting-toggle" + (gameSettings.reducedAnimations ? " is-on" : "");
    }
}

// Called from HTML onclick
function cycleAutosave() {
    const idx = AUTOSAVE_CYCLE.findIndex(o => o.value === gameSettings.autosaveInterval);
    gameSettings.autosaveInterval = AUTOSAVE_CYCLE[(idx + 1) % AUTOSAVE_CYCLE.length].value;
    saveSettings();
    updateSettingsUI();
}

function cycleNumberFormat() {
    gameSettings.numberFormat = gameSettings.numberFormat === "abbrev" ? "full" : "abbrev";
    saveSettings();
    updateSettingsUI();
    updateUI(); // reformat all displayed numbers
}

function toggleAnimations() {
    gameSettings.reducedAnimations = !gameSettings.reducedAnimations;
    saveSettings();
    applySettings();
}

function doSaveNow() {
    saveGame();
    const btn = document.getElementById("set-savenow");
    if (btn) {
        btn.textContent = "Saved!";
        setTimeout(() => { btn.textContent = "Save Now"; }, 1200);
    }
}

function doResetSave() {
    if (!confirm("Reset all progress? This cannot be undone.")) return;
    localStorage.removeItem("dungeonKeeperSave");
    location.reload();
}

// ── Derived values ────────────────────────────────────────────────────────────

function getHousing() {
    return (gameState.buildings.lair || 0) * ROOMS.lair.housingBonus;
}

function getJobs() {
    let total = 0;
    for (const [id, def] of Object.entries(ROOMS)) {
        if (def.jobs) total += (gameState.buildings[id] || 0) * def.jobs;
    }
    return total;
}

function getEmployed() {
    return Math.min(gameState.population.count, getJobs());
}

function getWorkersPerBuilding() {
    let remaining = getEmployed();
    const out = {};
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.jobs) { out[id] = 0; continue; }
        const slots = (gameState.buildings[id] || 0) * def.jobs;
        const here  = Math.min(slots, remaining);
        out[id]     = here;
        remaining  -= here;
    }
    return out;
}

function getProduction() {
    const prod    = {};
    for (const res of Object.keys(BASE_CAPS)) prod[res] = 0;
    const workers = getWorkersPerBuilding();
    for (const [id, def] of Object.entries(ROOMS)) {
        const n = workers[id] || 0;
        if (n > 0 && def.production) {
            for (const [res, rate] of Object.entries(def.production)) {
                prod[res] += rate * n;
            }
        }
    }
    return prod;
}

function getCaps() {
    const caps = Object.assign({}, BASE_CAPS);
    const n = gameState.buildings.storage || 0;
    if (n > 0 && ROOMS.storage.capBonus) {
        for (const [res, bonus] of Object.entries(ROOMS.storage.capBonus)) {
            caps[res] += bonus * n;
        }
    }
    return caps;
}

function getBuildCost(id) {
    const def = ROOMS[id];
    const n   = gameState.buildings[id] || 0;
    const out = {};
    for (const [res, base] of Object.entries(def.cost)) {
        out[res] = Math.floor(base * Math.pow(def.costScale || 1.2, n));
    }
    return out;
}

function canAfford(id) {
    for (const [res, amount] of Object.entries(getBuildCost(id))) {
        if ((gameState.resources[res] || 0) < amount) return false;
    }
    return true;
}

// ── Actions ───────────────────────────────────────────────────────────────────

function build(id) {
    if (!canAfford(id)) return;
    const cost = getBuildCost(id);
    for (const [res, amount] of Object.entries(cost)) {
        gameState.resources[res] -= amount;
    }
    gameState.buildings[id] = (gameState.buildings[id] || 0) + 1;
    gameState.stats.buildingsConstructed = (gameState.stats.buildingsConstructed || 0) + 1;
    updateUI();
    saveGame();
}

function gather(key) {
    const action = GATHER_ACTIONS[key];
    const caps   = getCaps();
    const cur    = gameState.resources[action.resource] || 0;
    if (cur >= caps[action.resource]) return;
    gameState.resources[action.resource] = Math.min(cur + action.amount, caps[action.resource]);
    gameState.stats.manualGathers = (gameState.stats.manualGathers || 0) + 1;
    updateUI();
}

// ── Tick ──────────────────────────────────────────────────────────────────────

function tick() {
    const prod = getProduction();
    const caps = getCaps();
    const pop  = gameState.population;
    const st   = gameState.stats;

    // 1. Building production
    for (const [res, rate] of Object.entries(prod)) {
        gameState.resources[res] = Math.min((gameState.resources[res] || 0) + rate, caps[res]);
    }
    st.foodProduced  = (st.foodProduced  || 0) + (prod.food  || 0);
    st.woodProduced  = (st.woodProduced  || 0) + (prod.wood  || 0);
    st.stoneProduced = (st.stoneProduced || 0) + (prod.stone || 0);

    // 2. Food consumption
    const foodNeeded = pop.count;
    if (gameState.resources.food >= foodNeeded) {
        gameState.resources.food -= foodNeeded;
        pop.starveTick = 0;
    } else {
        gameState.resources.food = 0;
        if (pop.count > 0) {
            pop.starveTick = (pop.starveTick || 0) + 1;
            if (pop.starveTick >= STARVE_TICKS) {
                pop.count--;
                pop.starveTick = 0;
                st.starvationDeaths = (st.starvationDeaths || 0) + 1;
            }
        }
    }

    // 3. Population growth
    const housing    = getHousing();
    const foodBuffer = pop.count * 3 + 5;
    if (pop.count < housing && gameState.resources.food >= foodBuffer) {
        pop.growthTimer = (pop.growthTimer || 0) + 1;
        if (pop.growthTimer >= GROWTH_TICKS) {
            pop.count++;
            pop.growthTimer = 0;
        }
    } else {
        pop.growthTimer = 0;
    }
    if (pop.count > (st.peakPopulation || 0)) st.peakPopulation = pop.count;

    // 4. Advance time
    gameState.time.tick++;
    if (gameState.time.tick % TICKS_PER_DAY === 0) {
        gameState.time.day++;
        const totalDays = DAYS_PER_SEASON * 4;
        if (gameState.time.day > totalDays) {
            gameState.time.day = 1;
            gameState.time.year++;
            flashEl('year');
        }
        gameState.time.seasonIndex = Math.floor((gameState.time.day - 1) / DAYS_PER_SEASON) % 4;
        flashEl('day');
        if (gameState.time.day % DAYS_PER_SEASON === 1 && gameState.time.day !== 1) {
            flashEl('season');
        }
    }

    updateUI();

    // Autosave
    const interval = gameSettings.autosaveInterval;
    if (interval > 0 && gameState.time.tick % interval === 0) saveGame();
}

// ── UI ────────────────────────────────────────────────────────────────────────

function fmt(n) {
    n = Math.floor(n);
    if (gameSettings.numberFormat === "abbrev") {
        if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
        if (n >= 10000)   return (n / 1000).toFixed(1) + "k";
    }
    return n.toLocaleString();
}

function fmtRate(r) {
    if (r === 0) return "";
    return (r > 0 ? "+" : "") + r.toFixed(1) + "/s";
}

function updateUI() {
    const caps     = getCaps();
    const prod     = getProduction();
    const pop      = gameState.population;
    const housing  = getHousing();
    const jobs     = getJobs();
    const workers  = getWorkersPerBuilding();
    const employed = getEmployed();
    const st       = gameState.stats;
    const isStarving = pop.count > 0 && pop.starveTick > 0;

    // Population
    setText("popCount",  pop.count);
    setText("popMax",    housing);
    setText("employed",  employed);
    setText("totalJobs", jobs);
    const popRow = document.getElementById("pop-row");
    if (popRow) popRow.classList.toggle("starving", isStarving);

    // Resources
    for (const res of Object.keys(RESOURCES)) {
        setText(res,          fmt(gameState.resources[res] || 0));
        setText(res + "Cap",  fmt(caps[res]));
        const rawRate = prod[res] || 0;
        const netRate = (res === "food") ? rawRate - pop.count : rawRate;
        const rateEl  = document.getElementById(res + "Rate");
        if (rateEl) {
            if (rawRate === 0 && pop.count === 0) {
                rateEl.style.display = "none";
            } else if (res === "food" && pop.count > 0) {
                rateEl.textContent   = fmtRate(netRate);
                rateEl.style.display = "";
                rateEl.style.color   = netRate < 0 ? "var(--disabled)"
                                     : netRate > 0 ? "var(--enabled)"
                                     : "var(--text-muted)";
            } else {
                rateEl.textContent   = fmtRate(rawRate);
                rateEl.style.display = rawRate > 0 ? "" : "none";
                rateEl.style.color   = "";
            }
        }
    }

    // Time
    setText("day",    gameState.time.day);
    setText("year",   gameState.time.year);
    setText("season", SEASONS[gameState.time.seasonIndex]);

    // Building buttons
    for (const id of Object.keys(ROOMS)) {
        const count   = gameState.buildings[id] || 0;
        const def     = ROOMS[id];
        const w       = workers[id] || 0;
        const countEl = document.getElementById(id + "Count");
        if (countEl) {
            countEl.textContent = (def.jobs && count > 0) ? `${count} (${w}★)` : count;
        }
        const costEl = document.getElementById(id + "Cost");
        if (costEl) {
            const cost = getBuildCost(id);
            costEl.textContent = Object.entries(cost)
                .map(([res, n]) => `${fmt(n)} ${RESOURCES[res]?.name || res}`)
                .join(", ");
        }
        const btn = document.getElementById("btn-" + id);
        if (btn) btn.classList.toggle("disabled", !canAfford(id));
    }

    // ── Info tab ──────────────────────────────────────────────────────────────

    // Current state
    const dayOfSeason = ((gameState.time.day - 1) % DAYS_PER_SEASON) + 1;
    const totalDays   = (gameState.time.year - 1) * DAYS_PER_SEASON * 4 + gameState.time.day;
    setText("info-season",      SEASONS[gameState.time.seasonIndex]);
    setText("info-day",         `${dayOfSeason} / ${DAYS_PER_SEASON}`);
    setText("info-year",        gameState.time.year);
    setText("info-pop",         `${pop.count} / ${housing}`);
    setText("info-employed",    `${employed} / ${jobs}`);
    const totalBuilt = Object.values(gameState.buildings).reduce((a, b) => a + b, 0);
    setText("info-buildings",   totalBuilt);

    // Production rates
    const netFood = (prod.food || 0) - pop.count;
    setText("info-food-rate",  fmtRate(netFood)  || "0/s");
    setText("info-wood-rate",  fmtRate(prod.wood  || 0) || "0/s");
    setText("info-stone-rate", fmtRate(prod.stone || 0) || "0/s");

    // Lifetime stats
    setText("info-total-days",   fmt(totalDays));
    setText("info-peak-pop",     st.peakPopulation   || 0);
    setText("info-built-total",  st.buildingsConstructed || 0);
    setText("info-gathers",      st.manualGathers    || 0);
    setText("info-starve-deaths",st.starvationDeaths || 0);
    setText("info-food-total",   fmt(st.foodProduced  || 0));
    setText("info-wood-total",   fmt(st.woodProduced  || 0));
    setText("info-stone-total",  fmt(st.stoneProduced || 0));

    // Gather action buttons
    for (const [key, action] of Object.entries(GATHER_ACTIONS)) {
        const btn = document.getElementById("action-" + key);
        if (btn) {
            const atCap = (gameState.resources[action.resource] || 0) >= caps[action.resource];
            btn.classList.toggle("disabled", atCap);
        }
    }
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

function flashEl(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.classList.remove("flash");
    void el.offsetWidth;
    el.classList.add("flash");
}

// ── Dev tools ────────────────────────────────────────────────────────────────

function devAddResource(res, amount) {
    const caps = getCaps();
    gameState.resources[res] = Math.min((gameState.resources[res] || 0) + amount, caps[res]);
    updateUI();
    saveGame();
}

function devFillAllCaps() {
    const caps = getCaps();
    for (const res of Object.keys(BASE_CAPS)) gameState.resources[res] = caps[res];
    updateUI();
    saveGame();
}

function devAddCreature(n = 1) {
    gameState.population.count = Math.max(0, gameState.population.count + n);
    updateUI();
    saveGame();
}

function devFillPopulation() {
    const housing = getHousing();
    if (housing > 0) gameState.population.count = housing;
    updateUI();
    saveGame();
}

function devKillAll() {
    gameState.population.count    = 0;
    gameState.population.starveTick  = 0;
    gameState.population.growthTimer = 0;
    updateUI();
    saveGame();
}

// Run ticks in bulk without triggering an autosave on every one.
function devAdvanceTicks(n) {
    const savedInterval = gameSettings.autosaveInterval;
    gameSettings.autosaveInterval = 0;
    for (let i = 0; i < n; i++) tick();
    gameSettings.autosaveInterval = savedInterval;
    saveGame();
}

function devAddOneEach() {
    for (const id of Object.keys(ROOMS)) {
        gameState.buildings[id] = (gameState.buildings[id] || 0) + 1;
    }
    updateUI();
    saveGame();
}

function devMaxAll() {
    for (const id of Object.keys(ROOMS)) {
        gameState.buildings[id] = (gameState.buildings[id] || 0) + 10;
    }
    updateUI();
    saveGame();
}

function devWipeResources() {
    for (const res of Object.keys(BASE_CAPS)) gameState.resources[res] = 0;
    updateUI();
    saveGame();
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function switchTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => { el.style.display = "none"; });
    document.querySelectorAll(".tab-btn").forEach(btn => { btn.classList.remove("active"); });
    const content = document.getElementById("tab-" + tabId);
    if (content) content.style.display = "block";
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add("active");
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

loadSettings();
loadGame();
updateUI();
setInterval(tick, 1000);
