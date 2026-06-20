const SEASONS        = ["Spring", "Summer", "Autumn", "Winter"];
const TICKS_PER_DAY  = 2;
const DAYS_PER_SEASON = 30;
const GROWTH_TICKS   = 15;
const STARVE_TICKS   = 5;

const BASE_CAPS = { food: 100, wood: 100, stone: 100 };

// ── Biome data ────────────────────────────────────────────────────────────────

const BIOME_DATA = {
    "Verdant Forest":       { type:"Natural",  badge:"badge-natural",  desc:"Dense canopy conceals your dungeon amid ancient trees. Food and wood are plentiful, but predators stalk the undergrowth.",        start:"+30 Wood · +20 Food",              mods:[{name:"Fertile Soil",pos:true},{name:"Ancient Grove",pos:true},{name:"Abundant Wildlife",pos:true},{name:"Natural Predators",pos:false}],                                                                                                              best:["Lycanthrope","Flora","Goblinoid"],             hard:["Aquatic","Fiend"]                             },
    "Mountain Stronghold":  { type:"Natural",  badge:"badge-natural",  desc:"Rocky heights above the treeline; your dungeon is hewn from the mountain itself. Stone is everywhere; warmth is not.",            start:"+40 Stone · +15 Wood",             mods:[{name:"Rich Ore Veins",pos:true},{name:"Exposed Rockface",pos:true},{name:"Solid Foundation",pos:true},{name:"Harsh Winters",pos:false}],                                                                                                         best:["Giant","Draconic","Monstrous"],                hard:["Aquatic","Flora"]                             },
    "Coastal Bluffs":       { type:"Natural",  badge:"badge-natural",  desc:"Sea-carved cliffs hold your dungeon above crashing waves. Fish and game are plentiful, but sea raiders take notice.",              start:"+25 Food · +20 Stone",             mods:[{name:"Abundant Wildlife",pos:true},{name:"Fertile Soil",pos:true},{name:"Contested Territory",pos:false}],                                                                                                                                  best:["Aquatic","Humanoid"],                          hard:["Undead","Fiend"]                              },
    "Desert Wastes":        { type:"Natural",  badge:"badge-natural",  desc:"Blazing sun and endless sand hide mineral wealth beneath. Survival is the first and constant challenge of this biome.",            start:"+30 Stone",                        mods:[{name:"Rich Ore Veins",pos:true},{name:"Barren Soil",pos:false},{name:"Salt Flats",pos:false},{name:"Oppressive Heat",pos:false}],                                                                                                      best:["Draconic","Monstrous"],                        hard:["Aquatic","Flora","Fey"]                       },
    "Frozen Tundra":        { type:"Natural",  badge:"badge-natural",  desc:"Permafrost and silence; the cold kills slowly and the ground gives nothing. Only the strongest survive here.",                     start:"+10 Wood",                         mods:[{name:"Isolation Instinct",pos:true},{name:"Harsh Winters",pos:false},{name:"Barren Soil",pos:false},{name:"Crushing Cold",pos:false},{name:"Harsh Survival",pos:false}],                                                               best:["Giant (Frost)","Undead"],                      hard:["Draconic","Flora","Aquatic"]                  },
    "Fetid Swamp":          { type:"Natural",  badge:"badge-natural",  desc:"Dark water and tangled roots; disease festers here, but life erupts from the decay. Many things call this home.",                  start:"+20 Food",                         mods:[{name:"Abundant Wildlife",pos:true},{name:"Flooded Tunnels",pos:true},{name:"Infested Land",pos:false},{name:"Disease Vectors",pos:false}],                                                                                              best:["Aquatic","Flora","Ooze"],                      hard:["Construct","Giant"]                           },
    "Rolling Grasslands":   { type:"Natural",  badge:"badge-natural",  desc:"Open plains stretch to the horizon; your dungeon hides in a hillside. Easy expansion, obvious target.",                           start:"+30 Food · +15 Wood",              mods:[{name:"Fertile Soil",pos:true},{name:"Warm Climate",pos:true},{name:"Contested Territory",pos:false},{name:"Inviting Target",pos:false}],                                                                                                   best:["Humanoid","Lycanthrope","Giant"],              hard:["Aquatic","Aberration"]                        },
    "Volcanic Caldera":     { type:"Natural",  badge:"badge-natural",  desc:"Heat, ash, and the smell of sulfur. The earth bleeds stone and opportunity; structural stability is not guaranteed.",              start:"+50 Stone",                        mods:[{name:"Rich Ore Veins",pos:true},{name:"Volcanic Ash",pos:true},{name:"Oppressive Heat",pos:false},{name:"Unstable Ground",pos:false}],                                                                                               best:["Draconic","Fiend","Construct"],                hard:["Aquatic","Flora","Fey"]                       },
    "Deep Caverns":         { type:"Natural",  badge:"badge-natural",  desc:"A natural underground network; your dungeon expands into pre-existing tunnels. Darkness is the price of depth.",                  start:"+40 Stone · 1 Free Lair",          mods:[{name:"Cavern Network",pos:true},{name:"Mineral Deposits",pos:true},{name:"Underground Access",pos:true},{name:"Perpetual Darkness",pos:false}],                                                                                          best:["Goblinoid","Aberration","Ooze"],               hard:["Fey","Giant"]                                 },
    "Jungle Canopy":        { type:"Natural",  badge:"badge-natural",  desc:"Stifling heat and impossible density; food is everywhere, and so are things that want to eat you.",                               start:"+40 Food · +20 Wood",              mods:[{name:"Fertile Soil",pos:true},{name:"Ancient Grove",pos:true},{name:"Abundant Wildlife",pos:true},{name:"Disease Vectors",pos:false},{name:"Hostile Flora",pos:false}],                                                                   best:["Flora","Fey","Humanoid"],                      hard:["Undead","Giant","Construct"]                  },
    "Arctic Glacier":       { type:"Natural",  badge:"badge-natural",  desc:"A frozen expanse carved by time. Isolation is both your shield and your prison; the cold never relents.",                         start:"+20 Stone",                        mods:[{name:"Isolation Instinct",pos:true},{name:"Hidden Refuge",pos:true},{name:"Harsh Winters",pos:false},{name:"Barren Soil",pos:false},{name:"Crushing Cold",pos:false}],                                                                    best:["Giant (Frost)"],                               hard:["Draconic","Flora","Fey","Aquatic"]             },
    "Sunken Ruins":         { type:"Natural",  badge:"badge-natural",  desc:"A half-drowned ancient civilization; your dungeon inhabits crumbling walls ankle-deep in water and mystery.",                     start:"+30 Food · 1 Free Storage",        mods:[{name:"Ancient Foundations",pos:true},{name:"Arcane Residue",pos:true},{name:"Flooded Tunnels",pos:false},{name:"Unstable Ground",pos:false}],                                                                                         best:["Aquatic","Undead"],                            hard:["Construct","Giant"]                           },
    "Badlands":             { type:"Natural",  badge:"badge-natural",  desc:"Eroded rock formations and choking dust — defensible terrain if you can survive on what little the land provides.",                start:"+25 Stone · +10 Wood",             mods:[{name:"Exposed Rockface",pos:true},{name:"Defensive Terrain",pos:true},{name:"Barren Soil",pos:false},{name:"Inviting Target",pos:false}],                                                                                              best:["Monstrous","Goblinoid","Draconic"],            hard:["Aquatic","Flora","Fey"]                       },
    "Underdark Depths":     { type:"D&D",      badge:"badge-dnd",      desc:"Far below any sunlit surface, in the realm of dark elves and stranger things. Rich beyond measure; strange beyond reckoning.",   start:"+45 Stone · +15 Food (fungi)",     mods:[{name:"Mineral Deposits",pos:true},{name:"Fungal Bloom",pos:true},{name:"Cavern Network",pos:true},{name:"Underground Access",pos:true},{name:"Perpetual Darkness",pos:false}],                                                             best:["Aberration","Goblinoid","Ooze"],               hard:["Giant","Humanoid","Fey"]                      },
    "Ancient Battlefield":  { type:"D&D",      badge:"badge-dnd",      desc:"The ground still remembers the war. Bones outnumber stones; residual magic pools in craters and corroded armor.",                start:"+20 Food · +20 Wood · +20 Stone",  mods:[{name:"Battleground Residue",pos:true},{name:"Ancient Foundations",pos:true},{name:"Contested Territory",pos:false},{name:"Natural Predators",pos:false}],                                                                               best:["Undead","Monstrous","Humanoid"],               hard:["Fey","Flora"]                                 },
    "Haunted Moor":         { type:"D&D",      badge:"badge-dnd",      desc:"Fog rolls in with the dead. The moor is alive with restless spirits and the slow surrender of all living things.",                start:"+20 Food · +15 Stone",             mods:[{name:"Arcane Residue",pos:true},{name:"Disease Vectors",pos:false},{name:"Cursed Ground",pos:false},{name:"Natural Predators",pos:false},{name:"Plague Risk",pos:false}],                                                                   best:["Undead","Fiend"],                              hard:["Fey","Flora","Construct"]                     },
    "Abyssal Rift":         { type:"D&D",      badge:"badge-dnd",      desc:"A crack in the mortal plane bleeds Abyss energy constantly. Demons trickle through; power flows in both directions.",            start:"+30 Stone",                        mods:[{name:"Planar Tear",pos:true},{name:"Forbidden Lore",pos:true},{name:"Toxic Atmosphere",pos:false},{name:"Planar Pressure",pos:false},{name:"Unstable Plane",pos:false}],                                                                   best:["Fiend","Aberration"],                          hard:["Humanoid","Fey","Flora","Construct"]           },
    "Dragonspine Ridge":    { type:"D&D",      badge:"badge-dnd",      desc:"Scorched peaks where ancient dragons once nested. Their power lingers in the stone and sky in equal measure.",                    start:"+35 Stone · +15 Food",             mods:[{name:"Rich Ore Veins",pos:true},{name:"Fearsome Reputation",pos:true},{name:"Warlord's Domain",pos:true},{name:"Oppressive Heat",pos:false}],                                                                                          best:["Draconic","Monstrous"],                        hard:["Aquatic","Flora","Fey"]                       },
    "Giant's Graveyard":    { type:"D&D",      badge:"badge-dnd",      desc:"Colossal bones provide shelter and raw material; the lingering power of titans seeps into your dungeon's foundations.",           start:"+60 Stone",                        mods:[{name:"Mineral Deposits",pos:true},{name:"Solid Foundation",pos:true},{name:"Ancestral Home",pos:true},{name:"Pack Mentality",pos:true}],                                                                                               best:["Giant","Construct"],                           hard:["Fey","Aquatic","Flora"]                       },
    "Shadowfell Crossing":  { type:"Magical",  badge:"badge-magical",  desc:"The boundary between worlds is paper-thin. The dead walk freely, the light never fully arrives, and dark knowledge seeps through.",start:"+10 Food · +10 Wood · +10 Stone",  mods:[{name:"Arcane Residue",pos:true},{name:"Forbidden Lore",pos:true},{name:"Planar Alignment",pos:true},{name:"Perpetual Darkness",pos:false},{name:"Cursed Ground",pos:false}],                                                               best:["Undead","Fiend"],                              hard:["Fey","Humanoid","Flora"]                      },
    "Feywild Glade":        { type:"Magical",  badge:"badge-magical",  desc:"The Feywild bleeds through in flashes of impossible color. Time is unreliable; life explodes everywhere; magic is uncontrolled.", start:"+30 Food · +20 Wood",              mods:[{name:"Fertile Soil",pos:true},{name:"Warm Climate",pos:true},{name:"Rapid Breeding",pos:true},{name:"Wild Magic Zone",pos:false},{name:"Binding Contract",pos:false}],                                                                    best:["Fey","Flora"],                                 hard:["Undead","Fiend","Construct"]                  },
    "Arcane Nexus":         { type:"Magical",  badge:"badge-magical",  desc:"Ley lines converge in a web of invisible power. Magic saturates the very stone; knowledge comes easily, caution less so.",        start:"+25 Food · +10 Stone",             mods:[{name:"Ley Line Nexus",pos:true},{name:"Arcane Amplification",pos:true},{name:"Resonant Ley Lines",pos:true},{name:"Wild Magic Zone",pos:false}],                                                                                       best:["Aberration","Construct","Humanoid"],           hard:["Goblinoid","Monstrous"]                       },
    "Blighted Wastes":      { type:"Magical",  badge:"badge-magical",  desc:"A cursed land where life struggles and death triumphs. Dangerous for the living; a paradise for those beyond it.",                start:"+10 Stone",                        mods:[{name:"Forbidden Lore",pos:true},{name:"Barren Soil",pos:false},{name:"Cursed Ground",pos:false},{name:"Toxic Atmosphere",pos:false},{name:"Blighted Air",pos:false},{name:"Disease Vectors",pos:false}],                             best:["Undead","Fiend"],                              hard:["Flora","Fey","Humanoid","Aquatic"]             },
    "Elemental Confluence": { type:"Magical",  badge:"badge-magical",  desc:"All four elements war constantly. Chaotic and powerful — nothing is predictable, everything is possible here.",                   start:"+20 Food · +20 Wood · +20 Stone",  mods:[{name:"Arcane Residue",pos:true},{name:"Abundant Prey",pos:true},{name:"Unstable Ground",pos:false},{name:"Geological Instability",pos:false},{name:"Wild Magic Zone",pos:false}],                                                          best:["Ooze/Elemental","Draconic","Aberration"],      hard:["Lycanthrope","Flora","Humanoid"]               },
    "Celestial Foothold":   { type:"Magical",  badge:"badge-magical",  desc:"Where divine light once burned, creation flourishes. The easiest start — for those the land deems worthy. Darkness is repelled.", start:"+25 Food · +25 Wood",              mods:[{name:"Warm Climate",pos:true},{name:"Sacred Ground",pos:true},{name:"Blessed Ground",pos:true},{name:"Hidden Refuge",pos:true},{name:"Unyielding",pos:true}],                                                                         best:["Humanoid","Fey","Flora"],                      hard:["Undead","Fiend","Aberration"]                 },
};

// First-run curated mods — all beneficial, no surprises for new players
const STARTER_MODS = [
    { name: "Fertile Soil",      pos: true },
    { name: "Ancient Grove",     pos: true },
    { name: "Abundant Wildlife", pos: true },
    { name: "Warm Climate",      pos: true },
];

// Extra mod pool drawn on prestige runs to add 1-2 wildcard mods on top of the biome's own mods
const EXTRA_MOD_POOL = {
    positive: [
        "Fertile Soil", "Ancient Grove", "Rich Ore Veins", "Abundant Wildlife",
        "Warm Climate", "Abundant Prey", "Communal Living", "Pack Mentality",
        "Starvation Resilience", "Elder's Blessing", "Hidden Cache",
        "Rapid Breeding", "Migratory Patterns", "Slow Burn",
        "Solid Foundation", "Territorial Instincts",
    ],
    negative: [
        "Harsh Winters", "Disease Vectors", "Oppressive Heat", "Crushing Cold",
        "Barren Soil", "Infested Land", "Poor Infrastructure", "Overcrowding Risk",
        "Contested Territory", "Inviting Target", "Harsh Survival",
        "Accelerated Decay", "Structural Weakness",
    ],
};

// ── Modifier descriptions (for tooltip) ───────────────────────────────────────
const MOD_DESCRIPTIONS = {
    // Resource Production
    "Fertile Soil":           "Food production from all farms +20%.",
    "Ancient Grove":          "Wood production from all lumber camps +25%.",
    "Rich Ore Veins":         "Stone production from all quarries +30%.",
    "Underground Springs":    "Food storage cap +50.",
    "Cavern Network":         "Begin run with 1 free Lair already constructed.",
    "Abundant Wildlife":      "Manual food gather (Scavenge Food) yields +2 instead of +1.",
    "Dense Timber":           "Manual wood gather (Fell a Tree) yields +2 instead of +1.",
    "Exposed Rockface":       "Manual stone gather (Break Stones) yields +2 instead of +1.",
    "Mineral Deposits":       "All resource storage caps +50.",
    "Infested Land":          "Farm food production −25% (insects and vermin consume crops).",
    "Barren Soil":            "All food production −30%.",
    "Petrified Forest":       "Wood production −20%; stone production +15% (trees turned to stone).",
    "Resource Scarcity":      "All resource storage caps −25.",
    "Hidden Cache":           "Begin run with +50 food, +25 wood, +25 stone.",
    "Flooded Tunnels":        "Stone production −15%; food production +10% (water access).",
    "Volcanic Ash":           "Food production +15% (fertile ash soil); stone production −10%.",
    "Salt Flats":             "Food production −20%; stone production +20%.",
    "Fungal Bloom":           "Food production +10% but food cap −25 (mushroom farms, not scalable).",
    "Glacial Melt":           "Food cap +75 (abundant water access supports larger crop stores).",
    "Bountiful Harvest":      "Every season change grants +50 food bonus.",
    // Population
    "Warm Climate":           "Population growth rate +20%.",
    "Harsh Winters":          "Population growth rate −15%.",
    "Disease Vectors":        "Starvation threshold triggers 1 tick earlier than normal.",
    "Communal Living":        "Each Lair provides +1 extra housing capacity.",
    "Isolation Instinct":     "Population cap −10% but random negative events disabled.",
    "Natural Predators":      "Each season: 10% chance 1–2 creatures lost to predation.",
    "Harsh Survival":         "Growth rate −25%; maximum population cap +20%.",
    "Abundant Prey":          "Creature food consumption −15% per tick.",
    "Migratory Patterns":     "Begin run with 3 extra starting population.",
    "Cursed Ground":          "Population growth −20%; starvation death timer triggers 1 tick sooner.",
    "Ancestral Home":         "Matching creature type: growth rate +25%.",
    "Foreign Territory":      "Non-native creature types: growth rate −10%.",
    "Symbiotic Ecosystem":    "Population growth requires 1 fewer food surplus than normal.",
    "Overcrowding Risk":      "After population reaches 20, growth rate reduced by −10%.",
    "Pack Mentality":         "All workers produce +10% more per tick.",
    "Territorial Instincts":  "Each Lair provides 6 housing instead of the normal 5.",
    "Plague Risk":            "Every 30 days: 5% chance of a −10% population loss event.",
    "Elder's Blessing":       "First 5 population require no food (they forage independently).",
    "Starvation Resilience":  "Death timer before first starvation death extended by +3 ticks.",
    "Rapid Breeding":         "Population growth timer reduced by 5 ticks (faster natural growth).",
    // Buildings
    "Solid Foundation":       "All building wood costs −10%.",
    "Abundant Stone":         "All building stone costs −20%.",
    "Poor Infrastructure":    "All building costs +15%.",
    "Dungeon Resonance":      "Lair buildings cost −25% wood.",
    "Arcane Amplification":   "Unlock: Mage Tower building (research speed bonus).",
    "Sacred Ground":          "Unlock: Shrine of the Keeper building (population growth bonus).",
    "Defensive Terrain":      "Unlock: Watch Post building (raid defense bonus).",
    "Underground Access":     "Unlock: Mine Shaft building (stone/ore production bonus).",
    "Planar Tear":            "Unlock: Portal Chamber building (cross-planar resource access).",
    "Ancient Foundations":    "Begin run with 1 free Storage building already constructed.",
    "Creaking Timbers":       "Wood buildings degrade: −5% production every 10 days.",
    "Resonant Ley Lines":     "Research buildings produce +20% faster.",
    "Unstable Ground":        "5% chance each building construction costs double resources.",
    "Builder's Bounty":       "Every 5th building constructed: cost fully refunded.",
    "Structural Weakness":    "All production buildings have −1 effective job slot (minimum 1).",
    // Combat & Defense
    "Contested Territory":    "Random raid events occur every ~20 days.",
    "Defended Perimeter":     "Raid event frequency reduced by 50%.",
    "Monster Crossroads":     "Neutral monsters pass nearby; occasional opportunity to recruit one.",
    "Warlord's Domain":       "Begin run with 2 extra population pre-assigned as combat defenders.",
    "Inviting Target":        "Raid event frequency +30%.",
    "Hidden Refuge":          "Raids never occur in this biome.",
    "Battleground Residue":   "Random free resource drops after each successful raid defense.",
    "Fearsome Reputation":    "After 5 successful defenses, all raids permanently cease.",
    "Fortified Terrain":      "Incoming raid damage reduced −15%.",
    "Desecrated Altar":       "Once per run: sacrifice 10 population to reset all raid cooldowns.",
    // Magic & Research
    "Ley Line Nexus":         "Research speed +25%.",
    "Magic Deadzone":         "All magical upgrades cost +20% more research.",
    "Arcane Residue":         "Begin run with 10 bonus research points.",
    "Corrupted Knowledge":    "Each research has a 20% chance of a random side effect.",
    "Prophecy Shard":         "Once per run: one research completes instantly.",
    "Forbidden Lore":         "Unique dark research tree unlocked.",
    "Eldritch Interference":  "Research speed −15%.",
    "Blessed Ground":         "Divine research tree +25% speed.",
    "Wild Magic Zone":        "10% chance each research grants a random bonus side effect.",
    "Planewalker's Knowledge":"Cross-planar research tree unlocked.",
    // Prestige & Meta
    "First Conquest":         "Prestige currency reward +10%.",
    "Cursed Loop":            "Prestige carry-over resources reduced by −5%.",
    "Ancient Legacy":         "Begin each new post-prestige run with 1 random bonus relic.",
    "Forgotten History":      "Prestige bonuses earned this run are +15% stronger.",
    "Binding Contract":       "Cannot prestige until at least Day 200 of the run.",
    "Accelerated Decay":      "All internal game timers run 10% faster (harder pacing).",
    "Slow Burn":              "All internal game timers run 10% slower (easier pacing).",
    "One With The Land":      "Prestige bonus includes a biome familiarity bonus on the next run.",
    "Planar Alignment":       "Planar creature types receive +10% prestige bonus.",
    "Unyielding":             "Starvation deaths do not count against prestige scoring.",
    // Hazards / Hard Mode
    "Oppressive Heat":        "All workers produce −10% per tick.",
    "Crushing Cold":          "Creature food consumption +15% per tick.",
    "Perpetual Darkness":     "Growth rate −10%; undead and shadow creatures are unaffected.",
    "Mana Drain":             "All magic-based actions cost double.",
    "Unstable Plane":         "Random resource loss: 5–10 resources lost daily to planar instability.",
    "Hostile Flora":          "Farm food output −20% (plants actively resist cultivation).",
    "Toxic Atmosphere":       "Maximum population cap −15%.",
    "Geological Instability": "Every 10 days: 10% chance a random building loses full output for 1 day.",
    "Planar Pressure":        "Non-native creature types suffer −15% to all production.",
    "The Doom Clock":         "Milestone timer: fail to reach population 10 by Day 60 → lose 25% of all resources.",
    "Temporal Flux":          "Seasons are unpredictable; seasonal bonuses occur at random intervals.",
    "Blighted Air":           "All resource storage caps −20%.",
    "Cursed Tools":           "All manual gather actions yield −1 resource (minimum 1).",
    "Soul Tax":               "Every 10 days: lose 1 population to the land (unavoidable).",
    "The Undying Curse":      "Creatures that die to starvation return as hostile undead.",
};

// ── Race data (populated when Era 1 race selection is implemented) ─────────────
// Each entry: { tag: CSS class, tagLabel: display string, desc: string, mods: [{name, pos}] }
const RACE_DATA = {};

const gameState = {
    resources:  { food: 0, wood: 0, stone: 0 },
    buildings:  { lair: 0, farm: 0, lumber: 0, quarry: 0, storage: 0 },
    population: { count: 0, growthTimer: 0, starveTick: 0 },
    run:        { biome: null, race: null, mods: [] },
    meta:       { seenBiomes: [], totalPrestiges: 0, racesPlayed: {} },
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
    setText("info-prestiges",    gameState.meta.totalPrestiges || 0);
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

function devRerollBiome() {
    try {
        selectStartBiome(false);
        saveGame();
        updateIdentityPanel();
        devShowBiomeInfo();
    } catch (e) {
        console.error("[devRerollBiome] Error:", e);
        const el = document.getElementById("dev-biome-info");
        if (el) el.innerHTML = `<span style="color:#c84040">Error: ${e.message}</span>`;
    }
}

function devShowBiomeInfo() {
    const el = document.getElementById("dev-biome-info");
    if (!el) return;
    const r    = gameState.run;
    const meta = gameState.meta;
    const modList = (r.mods || []).map(m => (m.pos ? "+" : "−") + m.name).join(", ") || "(none)";
    const played = meta.racesPlayed || {};
    const playedNames = Object.keys(played);
    const playedList = playedNames.length
        ? playedNames.map(n => `${n} ×${played[n]}`).join(", ")
        : "(none)";
    el.innerHTML = `
        <b>Biome:</b> ${r.biome || "—"}<br>
        <b>Race:</b> ${r.race || "Unselected"}<br>
        <b>Run Mods (${(r.mods||[]).length}):</b> ${modList}<br>
        <b>Seen Biomes (${meta.seenBiomes.length}/25):</b> ${meta.seenBiomes.join(", ") || "(none)"}<br>
        <b>Total Prestiges:</b> ${meta.totalPrestiges || 0}<br>
        <b>Races Played (${playedNames.length}):</b> ${playedList}
    `;
}

// ── Race selection / play tracking ─────────────────────────────────────────────

// Set the run's race and record that this race has been played (+1 to its count).
// This is the single hook for "playing" a race; race-selection UI should call it.
function playRace(raceName) {
    if (!raceName) return;
    gameState.run.race = raceName;
    if (!gameState.meta.racesPlayed) gameState.meta.racesPlayed = {};
    gameState.meta.racesPlayed[raceName] = (gameState.meta.racesPlayed[raceName] || 0) + 1;
    saveGame();
    updateIdentityPanel();
}

// Creature roster, grouped by type. Used as the source for the Dev tab race
// dropdown. The full bestiary now lives in the standalone wiki (wiki.html);
// this constant keeps the Dev tools self-contained inside the game page.
const CREATURE_ROSTER = {
    "Draconic":    ["Chromatic Dragon", "Metallic Dragon", "Lizardfolk", "Kobold", "Yuan-ti", "Wyvern", "Dragonborn"],
    "Undead":      ["Skeleton", "Zombie", "Vampire", "Lich", "Wight", "Ghoul", "Revenant", "Banshee", "Wraith", "Mummy", "Demilich", "Shadow"],
    "Goblinoid":   ["Goblin", "Hobgoblin", "Bugbear", "Orc", "Gnoll"],
    "Fey":         ["Pixie", "Dryad", "Satyr", "Quickling", "Green Hag"],
    "Aberration":  ["Mind Flayer", "Beholder", "Aboleth", "Gibbering Mouther", "Nothic", "Chuul", "Grell", "Flumph"],
    "Ooze":        ["Gelatinous Cube", "Black Pudding"],
    "Elemental":   ["Fire Elemental", "Earth Elemental", "Shadow Demon"],
    "Monstrous":   ["Harpy", "Medusa", "Minotaur", "Troll", "Werewolf", "Naga", "Basilisk", "Chimera", "Manticore", "Sphinx", "Griffon", "Hydra", "Ettin"],
    "Fiend":       ["Imp", "Cambion", "Barbed Devil", "Night Hag", "Succubus/Incubus", "Pit Fiend", "Balor", "Rakshasa", "Quasit"],
    "Giant":       ["Hill Giant", "Stone Giant", "Frost Giant", "Fire Giant", "Cloud Giant", "Storm Giant"],
    "Construct":   ["Stone Golem", "Iron Golem", "Homunculus", "Animated Armor"],
    "Lycanthrope": ["Werebear", "Wererat", "Wereboar", "Owlbear", "Displacer Beast"],
    "Flora":       ["Treant", "Myconid", "Vegepygmy"],
    "Aquatic":     ["Merfolk", "Sahuagin", "Kuo-toa", "Triton"],
    "Humanoid":    ["Kenku", "Tabaxi", "Aarakocra", "Tortle", "Centaur"]
};

// Populate the Dev tab race dropdown. Prefers any .creature-entry bestiary
// cards present in the DOM, falling back to CREATURE_ROSTER (the live game page
// no longer embeds the bestiary — it lives in the wiki). Safe to call repeatedly.
function devPopulateRaceSelect() {
    const sel = document.getElementById("dev-race-select");
    if (!sel || sel.dataset.populated) return;
    const groups = {};
    document.querySelectorAll(".creature-entry").forEach(entry => {
        const nameEl = entry.querySelector(".creature-name");
        const tagEl  = entry.querySelector(".creature-tag");
        if (!nameEl) return;
        const name = nameEl.textContent.trim();
        const type = tagEl ? tagEl.textContent.trim() : "Other";
        (groups[type] = groups[type] || []).push(name);
    });
    if (Object.keys(groups).length === 0) {
        for (const [type, names] of Object.entries(CREATURE_ROSTER)) groups[type] = names.slice();
    }
    for (const [type, names] of Object.entries(groups)) {
        const og = document.createElement("optgroup");
        og.label = type;
        for (const n of names) {
            const o = document.createElement("option");
            o.value = n;
            o.textContent = n;
            og.appendChild(o);
        }
        sel.appendChild(og);
    }
    sel.dataset.populated = "1";
}

// Dev button: become the race currently chosen in the dropdown.
function devSelectRace() {
    const sel = document.getElementById("dev-race-select");
    if (!sel || !sel.value) return;
    playRace(sel.value);
    devShowBiomeInfo();
}

// ── Biome Selection ───────────────────────────────────────────────────────────

function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function selectStartBiome(isFirstRun) {
    if (isFirstRun) {
        gameState.run.biome = "Verdant Forest";
        gameState.run.mods  = [...STARTER_MODS];
        if (!gameState.meta.seenBiomes.includes("Verdant Forest")) {
            gameState.meta.seenBiomes.push("Verdant Forest");
        }
        return;
    }

    // Weighted random: unseen biomes get 3× weight
    const biomeNames = Object.keys(BIOME_DATA);
    const seen = new Set(gameState.meta.seenBiomes);
    const pool = [];
    for (const name of biomeNames) {
        const weight = seen.has(name) ? 1 : 3;
        for (let i = 0; i < weight; i++) pool.push(name);
    }
    const selected = pool[Math.floor(Math.random() * pool.length)];
    gameState.run.biome = selected;
    if (!seen.has(selected)) gameState.meta.seenBiomes.push(selected);

    // Build mod list: biome's own mods + 1-2 wildcard extras
    const biome = BIOME_DATA[selected];
    const mods  = biome.mods.map(m => ({ name: m.name, pos: m.pos }));
    const usedNames = new Set(mods.map(m => m.name));

    const posAvailable = EXTRA_MOD_POOL.positive.filter(n => !usedNames.has(n));
    const negAvailable = EXTRA_MOD_POOL.negative.filter(n => !usedNames.has(n));

    shuffle(posAvailable);
    shuffle(negAvailable);

    // Draw 1-2 extras: each draw is 65% positive, 35% negative
    const extraCount = 1 + Math.floor(Math.random() * 2);
    for (let i = 0; i < extraCount; i++) {
        const drawPos = Math.random() < 0.65;
        if (drawPos && posAvailable.length > 0) {
            mods.push({ name: posAvailable.shift(), pos: true });
        } else if (negAvailable.length > 0) {
            mods.push({ name: negAvailable.shift(), pos: false });
        } else if (posAvailable.length > 0) {
            mods.push({ name: posAvailable.shift(), pos: true });
        }
    }

    gameState.run.mods = mods;
}

// Called when player prestiges — resets run state, keeps meta progression
function doPrestige() {
    if (!confirm("Simulate a Prestige reset?\n\nAll run progress (resources, buildings, population) will be wiped and a new biome assigned. Meta-stats (prestiges, seen biomes) are preserved.")) return;

    const savedMeta = JSON.parse(JSON.stringify(gameState.meta));
    savedMeta.totalPrestiges = (savedMeta.totalPrestiges || 0) + 1;

    gameState.resources  = { food: 0, wood: 0, stone: 0 };
    gameState.buildings  = { lair: 0, farm: 0, lumber: 0, quarry: 0, storage: 0 };
    gameState.population = { count: 0, growthTimer: 0, starveTick: 0 };
    gameState.time       = { tick: 0, day: 1, year: 1, seasonIndex: 0 };
    // Zero all per-run stats without hardcoding keys
    for (const k of Object.keys(gameState.stats)) gameState.stats[k] = 0;
    gameState.run  = { biome: null, race: null, mods: [] };
    gameState.meta = savedMeta;

    selectStartBiome(false);
    saveGame();
    updateUI();
    updateIdentityPanel();
}

// ── Dungeon Identity Panel ────────────────────────────────────────────────────

function updateIdentityPanel() {
    const biomeName = gameState.run.biome;
    const raceName  = gameState.run.race;
    const biome     = BIOME_DATA[biomeName];

    // Compact row — guard against missing elements
    const nameEl  = document.getElementById("di-biome-name");
    const badgeEl = document.getElementById("di-biome-badge");
    const raceEl  = document.getElementById("di-race-name");

    if (!nameEl || !badgeEl || !raceEl) return;

    if (biome) {
        nameEl.textContent  = biomeName;
        badgeEl.textContent = biome.type;
        badgeEl.className   = `di-badge ${biome.badge}`;
    } else {
        nameEl.textContent  = "—";
        badgeEl.className   = "di-badge badge-none";
    }

    if (raceName) {
        raceEl.textContent = raceName;
        raceEl.classList.remove("di-unset");
    } else {
        raceEl.textContent = "Unselected";
        raceEl.classList.add("di-unset");
    }

    // Tooltip content
    const tip = document.getElementById("di-tooltip");
    if (!tip) return;

    let html = "";

    if (biome) {
        // Use the run's actual assigned mods, not the biome's static defaults
        const runMods = gameState.run.mods;
        let modsHtml;
        if (runMods.length > 0) {
            modsHtml = `<div class="di-tt-mod-list">` +
                runMods.map(m => {
                    const fx  = MOD_DESCRIPTIONS[m.name] || "Effect not yet documented.";
                    const cls = m.pos ? "di-tt-mod-pos" : "di-tt-mod-neg";
                    return `<div class="di-tt-mod-row"><span class="di-tt-mod-name ${cls}">${m.name}</span><span class="di-tt-mod-fx">${fx}</span></div>`;
                }).join("") +
                `</div>`;
        } else {
            modsHtml = `<span style="color:var(--text-muted);font-size:11px">None assigned</span>`;
        }

        html += `
            <div class="di-tt-name">${biomeName}<span class="di-badge ${biome.badge}">${biome.type}</span></div>
            <p class="di-tt-desc">${biome.desc}</p>
            <div class="di-tt-start">Start: ${biome.start}</div>
            <div class="di-tt-section">Active Run Modifiers</div>
            ${modsHtml}
            <div class="di-tt-section">Creature Affinity</div>
            <div class="di-tt-affinity">
                <span class="di-tt-affinity-best">▲ Best: ${biome.best.join(", ")}</span>
                <span class="di-tt-affinity-hard">▼ Hard: ${biome.hard.join(", ")}</span>
            </div>`;
    } else {
        html += `<p class="di-tt-desc">No biome selected.</p>`;
    }

    html += `<hr class="di-tt-divider"><div class="di-tt-section">Race</div>`;

    const raceData = RACE_DATA[raceName];
    if (raceName && raceData) {
        html += `<div class="di-tt-name">${raceName}${raceData.tag ? `<span class="creature-tag ${raceData.tag}">${raceData.tagLabel || ""}</span>` : ""}</div>
                 <p class="di-tt-race-desc">${raceData.desc}</p>`;
        if (raceData.mods && raceData.mods.length > 0) {
            html += `<div class="di-tt-section">Race Traits</div><div class="di-tt-mod-list">` +
                raceData.mods.map(m => {
                    const fx  = MOD_DESCRIPTIONS[m.name] || "Effect not yet documented.";
                    const cls = m.pos ? "di-tt-mod-pos" : "di-tt-mod-neg";
                    return `<div class="di-tt-mod-row"><span class="di-tt-mod-name ${cls}">${m.name}</span><span class="di-tt-mod-fx">${fx}</span></div>`;
                }).join("") +
                `</div>`;
        }
    } else if (raceName) {
        html += `<div class="di-tt-race">${raceName}</div>`;
    } else {
        html += `<div class="di-tt-race di-unset">Not yet selected — choose your race in Era 1.</div>`;
    }

    tip.innerHTML = html;
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
// Normalize meta fields that may be missing from older saves
if (!gameState.meta)                         gameState.meta = {};
if (!gameState.meta.seenBiomes)              gameState.meta.seenBiomes = [];
if (gameState.meta.totalPrestiges == null)   gameState.meta.totalPrestiges = 0;
if (!gameState.meta.racesPlayed)             gameState.meta.racesPlayed = {};
// Assign biome on first load (fresh game or old save with no mods yet)
if (!gameState.run || !gameState.run.mods || gameState.run.mods.length === 0) {
    if (!gameState.run) gameState.run = { biome: null, race: null, mods: [] };
    selectStartBiome(gameState.meta.seenBiomes.length === 0);
}
updateUI();
updateIdentityPanel();
devPopulateRaceSelect();
setInterval(tick, 1000);
