const SEASONS        = ["Spring", "Summer", "Autumn", "Winter"];
const TICKS_PER_DAY  = 2;
const DAYS_PER_SEASON = 30;
const GROWTH_TICKS   = 15;
const STARVE_TICKS   = 5;

const BASE_CAPS = {
    // Tier 1 — Raw
    food: 100, wood: 100, stone: 100,
    ore: 150, herbs: 100, crystals: 75, coal: 150, clay: 120, bones: 100, sulphur: 80,
    // Tier 2 — Crafted
    iron: 150, potions: 75, arcaneDust: 75, steel: 100, bricks: 120, cloth: 100, runes: 60,
    // Tier 3 — Magical
    arcaneEssence: 50, silk: 40, manaGold: 40, ichor: 30, mithril: 20,
    // Era 1 resources (cap overridden dynamically while era === 1)
    essence: 100, influence: 100, mana: 100,
};
const COIN_CAP = 100000; // 1000 gp in copper pieces; coins do not use Storage bonuses

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

// ── Race data ──────────────────────────────────────────────────────────────────
// Each entry: { tag, tagLabel, desc, mods: [{name, pos, desc?}], effects: {} }
// effects keys mirror the research system (productionBonus, converterBonus, capBonus,
// gatherBonus, allGatherBonus, allProductionBonus, taxBonus, housingBonus, foodConsumption,
// storageBonus) PLUS race-exclusive keys:
//   growthBonus  — multiplier on GROWTH_TICKS (< 1 faster, > 1 slower)
//   lairHousing  — override base lair housing per building (replaces ROOMS.lair.housingBonus)
const RACE_DATA = {};

const gameState = {
    resources: {
        food: 0, wood: 0, stone: 0,
        ore: 0, herbs: 0, crystals: 0, coal: 0, clay: 0, bones: 0, sulphur: 0,
        iron: 0, potions: 0, arcaneDust: 0, steel: 0, bricks: 0, cloth: 0, runes: 0,
        arcaneEssence: 0, silk: 0, manaGold: 0, ichor: 0, mithril: 0,
        essence: 0, influence: 0, mana: 0,
        coins: 0,
    },
    buildings: {
        lair: 0, farm: 0, lumber: 0, quarry: 0, storage: 0,
        mine: 0, coalSeam: 0, herbalistDen: 0, huntingLodge: 0, clayPit: 0, crystalSeam: 0,
        smelter: 0, alchemyLab: 0, kiln: 0, loom: 0,
        arcaneGrinder: 0, forge: 0, arcaneBench: 0, mageTower: 0, armory: 0, sulphurVent: 0,
        ritualCircle: 0, spiderNest: 0, arcaneCrucible: 0, darkAltar: 0, mithrilForge: 0,
    },
    research:          {},
    workerAssignments: {},
    population: { count: 0, growthTimer: 0, starveTick: 0 },
    run:        { biome: null, race: null, mods: [], era: 1 },
    meta:       { seenBiomes: [], totalPrestiges: 0, racesPlayed: {} },
    time:       { tick: 0, day: 1, year: 1, seasonIndex: 0 },
    pauseBank:  0,   // seconds of Accelerated Time banked from pausing
    era1: {
        unlocked: [],   // node ids the player has purchased
        chosen:   null, // L5 race node id picked (null until Era 2 gate)
    },
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
    // Restore Backup button — reflects whether a checkpoint exists, with a tooltip.
    const bkBtn = document.getElementById("set-restore");
    if (bkBtn) {
        const info = (typeof getBackupInfo === "function") ? getBackupInfo() : null;
        bkBtn.disabled = !info;
        bkBtn.title = info
            ? "Restore checkpoint: " + info.label
            : "No checkpoint yet — created at each era transition or prestige.";
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
    window._pendingReset = true;
    _pendingReset = true;
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem('dk_splash_seen');
    location.reload();
}

// Dev-tab version: no confirm dialog (bypasses browser dialog suppression)
function devResetSave() {
    window._pendingReset = true;
    _pendingReset = true;
    localStorage.removeItem(SAVE_KEY);
    localStorage.removeItem('dk_splash_seen');
    location.reload();
}

// ── Export / Import UI handlers ─────────────────────────────────────────────

function _saveIoMsg(text, kind) {
    const el = document.getElementById("save-io-msg");
    if (!el) return;
    el.textContent = text || "";
    el.className = "save-io-msg" + (kind ? " " + kind : "");
}

function doExportSave() {
    const str = exportSave();
    const box = document.getElementById("save-io-box");
    if (box) {
        box.value = str;
        box.focus();
        box.select();
    }
    // Best-effort copy to clipboard.
    try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(str);
            _saveIoMsg("Save exported and copied to clipboard.", "ok");
        } else {
            document.execCommand("copy");
            _saveIoMsg("Save exported and copied to clipboard.", "ok");
        }
    } catch (e) {
        _saveIoMsg("Save exported — copy the text above.", "ok");
    }
}

function doImportSave() {
    const box = document.getElementById("save-io-box");
    const str = box ? box.value : "";
    if (!str || !str.trim()) {
        _saveIoMsg("Paste a save string into the box first.", "error");
        return;
    }
    if (!confirm("Import this save? Your current progress will be overwritten.")) return;
    const ok = importSave(str); // reloads on success
    if (!ok) _saveIoMsg("Import failed — that doesn't look like a valid save string.", "error");
}

// Restores the last era-transition / prestige checkpoint, after confirming.
function doRestoreBackup() {
    const info = getBackupInfo();
    if (!info) {
        _saveIoMsg("No restore point yet — one is created at each era transition or prestige.", "error");
        return;
    }
    let when = "";
    if (info.at) {
        const d = new Date(info.at);
        when = " (saved " + d.toLocaleDateString() + " " + d.toLocaleTimeString() + ")";
    }
    if (!confirm("Restore your last checkpoint: " + info.label + when + "?\n\nThis replaces your current save and cannot be undone.")) return;
    const ok = restoreBackup(); // reloads on success
    if (!ok) _saveIoMsg("Restore failed — the backup couldn't be read.", "error");
}

// Reads the clipboard into the textarea (does not import — the player reviews,
// then clicks "Import Game"). Clipboard read requires a user gesture and
// permission; falls back to a manual-paste prompt if it's unavailable.
function doPasteSave() {
    const box = document.getElementById("save-io-box");
    if (!box) return;
    if (navigator.clipboard && navigator.clipboard.readText) {
        navigator.clipboard.readText().then(function (text) {
            if (text && text.trim()) {
                box.value = text.trim();
                box.focus();
                _saveIoMsg("Pasted from clipboard. Review, then click “Import from Textbox”.", "ok");
            } else {
                _saveIoMsg("Clipboard is empty.", "error");
            }
        }).catch(function () {
            box.focus();
            _saveIoMsg("Couldn't read the clipboard — paste into the box manually (Ctrl+V).", "error");
        });
    } else {
        box.focus();
        _saveIoMsg("Clipboard access unavailable — paste into the box manually (Ctrl+V).", "error");
    }
}

function doDownloadSave() {
    const str = exportSave();
    const stamp = new Date().toISOString().slice(0, 10);
    const blob = new Blob([str], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dungeon-keepers-save-" + stamp + ".txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    _saveIoMsg("Save downloaded.", "ok");
}

function doUploadSave(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
        const str = String(e.target.result || "").trim();
        const box = document.getElementById("save-io-box");
        if (box) box.value = str;
        if (!str) { _saveIoMsg("That file was empty.", "error"); return; }
        if (!confirm("Import the save from this file? Your current progress will be overwritten.")) return;
        const ok = importSave(str); // reloads on success
        if (!ok) _saveIoMsg("Import failed — that file doesn't contain a valid save.", "error");
    };
    reader.readAsText(file);
    event.target.value = ""; // allow re-selecting the same file
}

// ── Derived values ────────────────────────────────────────────────────────────

// Accumulates research + race bonus for a given effect type.
// Multiplicative types (productionBonus, converterBonus, foodConsumption) start at 1 and multiply.
// All other types start at 0 and add. Pass `key` for dict-type effects (building id or resource name).
function getResearchBonus(type, key) {
    const multiplicative = type === 'productionBonus' || type === 'converterBonus' || type === 'foodConsumption';
    let total = multiplicative ? 1 : 0;

    // Research contributions
    for (const [rKey, rDef] of Object.entries(RESEARCH)) {
        if (!gameState.research || !gameState.research[rKey]) continue;
        if (!rDef.effects) continue;
        const effect = rDef.effects[type];
        if (effect === undefined) continue;
        if (key !== undefined) {
            if (effect[key] !== undefined) {
                if (multiplicative) total *= effect[key];
                else total += effect[key];
            }
        } else {
            if (multiplicative) total *= effect;
            else total += effect;
        }
    }

    // Race contributions (same key structure as research effects)
    const raceData = RACE_DATA[gameState.run && gameState.run.race];
    if (raceData && raceData.effects) {
        const effect = raceData.effects[type];
        if (effect !== undefined) {
            if (key !== undefined) {
                if (effect && typeof effect === 'object' && effect[key] !== undefined) {
                    if (multiplicative) total *= effect[key];
                    else total += effect[key];
                }
            } else if (typeof effect === 'number') {
                if (multiplicative) total *= effect;
                else total += effect;
            }
        }
    }

    return total;
}

// Returns the actual amount gained by a manual gather action, after all research bonuses.
const GATHER_MOD_BONUSES = {
    food:  "Abundant Wildlife",
    wood:  "Dense Timber",
    stone: "Exposed Rockface",
};

function hasActiveMod(name) {
    return (gameState.run && gameState.run.mods || []).some(m => m.name === name);
}

function getGatherAmount(resourceKey) {
    const action = GATHER_ACTIONS[resourceKey];
    if (!action) return 0;
    let amount = action.amount;
    amount += getResearchBonus('allGatherBonus');
    amount += getResearchBonus('gatherBonus', resourceKey);
    const modName = GATHER_MOD_BONUSES[resourceKey];
    if (modName && hasActiveMod(modName)) amount += 1;
    return Math.max(1, Math.floor(amount));
}

function getHousing() {
    const raceData    = RACE_DATA[gameState.run && gameState.run.race];
    const lairOverride = raceData && raceData.effects && raceData.effects.lairHousing;
    let total = 0;
    for (const [id, def] of Object.entries(ROOMS)) {
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        if (def.housingBonus) {
            const base = (id === 'lair' && lairOverride != null) ? lairOverride : def.housingBonus;
            total += count * base;
        }
        const researchExtra = getResearchBonus('housingBonus', id);
        if (researchExtra > 0) total += count * researchExtra;
    }
    return total;
}

function getJobs() {
    let total = 0;
    for (const [id, def] of Object.entries(ROOMS)) {
        if (def.jobs) total += (gameState.buildings[id] || 0) * def.jobs;
    }
    return total;
}

function getEmployed() {
    return Object.values(getWorkersPerBuilding()).reduce((s, v) => s + v, 0);
}

function getWorkersPerBuilding() {
    const assignments = gameState.workerAssignments || {};
    const pop  = gameState.population.count;
    const out  = {};
    let budget = pop;
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.jobs) { out[id] = 0; continue; }
        const slots   = (gameState.buildings[id] || 0) * def.jobs;
        const desired = Math.min(assignments[id] || 0, slots);
        const actual  = Math.min(desired, budget);
        out[id] = Math.max(0, actual);
        budget -= out[id];
    }
    return out;
}

function setWorkers(id, rawCount) {
    if (!gameState.workerAssignments) gameState.workerAssignments = {};
    const def = ROOMS[id];
    if (!def || !def.jobs) return;
    const slots    = (gameState.buildings[id] || 0) * def.jobs;
    const others   = Object.entries(gameState.workerAssignments)
        .filter(([k]) => k !== id)
        .reduce((sum, [, v]) => sum + v, 0);
    const maxHere  = Math.max(0, Math.min(slots, gameState.population.count - others));
    gameState.workerAssignments[id] = Math.max(0, Math.min(Math.floor(+rawCount || 0), maxHere));
    updateUI();
    saveGame();
}

function adjustWorkers(id, delta) {
    const current = (gameState.workerAssignments || {})[id] || 0;
    setWorkers(id, current + delta * _clickMult);
}

function setWorkersMin(btn) {
    const id = btn.closest('[id^="wrow-"]').id.replace('wrow-', '');
    setWorkers(id, 0);
}
function setWorkersMax(btn) {
    const id = btn.closest('[id^="wrow-"]').id.replace('wrow-', '');
    setWorkers(id, 99999);
}

function getProduction() {
    const prod      = {};
    for (const res of Object.keys(BASE_CAPS)) prod[res] = 0;
    const workers   = getWorkersPerBuilding();
    const allBonus  = 1 + getResearchBonus('allProductionBonus');
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.production || def.converts) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        // Worker buildings scale by assigned workers; all others scale by building count
        const n = def.jobs ? (workers[id] || 0) : count;
        if (n === 0) continue;
        const bldgMult = getResearchBonus('productionBonus', id);
        for (const [res, rate] of Object.entries(def.production)) {
            prod[res] = (prod[res] || 0) + rate * n * bldgMult * allBonus;
        }
    }
    return prod;
}

// ── Resource production breakdown (for hover tooltip) ─────────────────────────

function getResourceBreakdown(res) {
    const lines = [];
    const workers = getWorkersPerBuilding();
    const allBonus = 1 + getResearchBonus('allProductionBonus');

    // Passive production buildings
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.production || def.converts) continue;
        if (def.production[res] === undefined) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const n = def.jobs ? (workers[id] || 0) : count;
        if (n === 0) continue;
        const bldgMult = getResearchBonus('productionBonus', id);
        const rate = def.production[res] * n * bldgMult * allBonus;
        const sub = def.jobs ? `${n}w` : `×${count}`;
        lines.push({ label: def.name, sub, value: rate, drain: false });
    }

    // Converter outputs (this resource is produced by a converter)
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.converts || def.converts.output !== res) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const n = def.jobs ? (workers[id] || 0) : count;
        if (n === 0) continue;
        const convMult = getResearchBonus('converterBonus', id);
        const rate = def.converts.outputRate * convMult * n;
        const sub = (def.jobs ? `${n}w` : `×${count}`) + ' · max';
        lines.push({ label: def.name, sub, value: rate, drain: false });
    }

    // Converter inputs (this resource is consumed by a converter)
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.converts || def.converts.inputs[res] === undefined) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const n = def.jobs ? (workers[id] || 0) : count;
        if (n === 0) continue;
        const rate = def.converts.inputs[res] * n;
        const sub = (def.jobs ? `${n}w` : `×${count}`) + ' · max';
        lines.push({ label: def.name, sub, value: -rate, drain: true });
    }

    // Food: population consumption
    if (res === 'food' && gameState.population.count > 0) {
        const mult = getResearchBonus('foodConsumption');
        const drain = Math.ceil(gameState.population.count * mult);
        lines.push({ label: 'Population', sub: `${gameState.population.count} creatures`, value: -drain, drain: true });
    }

    // Coins: daily income sources
    if (res === 'coins') {
        const taxRate = getResearchBonus('taxBonus');
        if (taxRate > 0) {
            const perDay = gameState.population.count * taxRate;
            lines.push({ label: 'Taxation', sub: `${taxRate} cp/creature`, value: perDay, drain: false, perDay: true });
        }
        if (gameState.research && gameState.research.tradeGoods) {
            const cloth = gameState.resources.cloth || 0;
            const potions = gameState.resources.potions || 0;
            const perDay = Math.floor((cloth + potions) * 2);
            lines.push({ label: 'Trade Caravans', sub: `${cloth} cloth + ${potions} pot`, value: perDay, drain: false, perDay: true });
        }
    }

    return lines;
}

let _resTooltipEl = null;
let _resTooltipRes = null;

function _buildResTooltipHTML(res) {
    const lines = getResourceBreakdown(res);
    if (lines.length === 0) return '';
    const sources = lines.filter(l => !l.drain);
    const drains  = lines.filter(l => l.drain);
    let html = '';
    if (sources.length > 0) {
        html += `<div class="res-tt-header">Production</div>`;
        for (const l of sources) {
            const val = l.perDay ? `+${l.value.toFixed(0)}` : `+${(l.value * TICKS_PER_DAY).toFixed(2)}`;
            html += `<div class="res-tt-row"><span class="res-tt-label">${l.label}<span class="res-tt-sub"> ${l.sub}</span></span><span class="res-tt-val pos">${val}</span></div>`;
        }
    }
    if (drains.length > 0) {
        html += `<div class="res-tt-section">Consumption</div>`;
        for (const l of drains) {
            const val = l.perDay ? `${l.value.toFixed(0)}` : `${(l.value * TICKS_PER_DAY).toFixed(2)}`;
            html += `<div class="res-tt-row"><span class="res-tt-label">${l.label}<span class="res-tt-sub"> ${l.sub}</span></span><span class="res-tt-val neg">${val}</span></div>`;
        }
    }
    return html;
}

function _showResTooltip(rowEl, res) {
    if (!_resTooltipEl) return;
    _resTooltipRes = res;
    const html = _buildResTooltipHTML(res);
    if (!html) { _hideResTooltip(); return; }
    _resTooltipEl.innerHTML = html;
    const rect = rowEl.getBoundingClientRect();
    _resTooltipEl.style.top  = rect.top + 'px';
    _resTooltipEl.style.left = (rect.right + 8) + 'px';
    _resTooltipEl.style.display = 'block';
}

function _hideResTooltip() {
    if (_resTooltipEl) _resTooltipEl.style.display = 'none';
    _resTooltipRes = null;
}

function initResTooltips() {
    _resTooltipEl = document.getElementById('res-tooltip');
    document.querySelectorAll('[id^="res-row-"]').forEach(el => {
        const res = el.id.replace('res-row-', '');
        el.addEventListener('mouseenter', () => _showResTooltip(el, res));
        el.addEventListener('mouseleave', _hideResTooltip);
    });
}

// ── Building tooltips ─────────────────────────────────────────────────────────

function _bldEffectRates(id, def) {
    const convMult = getResearchBonus('converterBonus', id);
    const allBonus = 1 + getResearchBonus('allProductionBonus');
    if (def.production) {
        const [res, rate] = Object.entries(def.production)[0];
        const bldgMult = getResearchBonus('productionBonus', id);
        return { out: fmt(rate * TICKS_PER_DAY * bldgMult * allBonus) };
    }
    if (def.converts) {
        const inputRate = Object.values(def.converts.inputs)[0];
        return {
            in:  fmt(inputRate * TICKS_PER_DAY),
            out: fmt(def.converts.outputRate * convMult * TICKS_PER_DAY),
        };
    }
    // Storage buildings — cap bonus is currently fixed at 100
    return { cap: 100 };
}


let _bldTooltipEl = null;

function initBldTooltips() {
    _bldTooltipEl = document.getElementById('bld-tooltip');
    document.querySelectorAll('[id^="btn-"]').forEach(el => {
        const id = el.id.replace('btn-', '');
        const def = ROOMS[id];
        if (!def || (!def.desc && !def.flavor)) return;
        el.addEventListener('mouseenter', () => {
            if (!_bldTooltipEl) return;
            let html = `<div class="bld-tt-name">${def.name}</div>`;
            if (def.desc)   html += `<div class="bld-tt-desc">${def.desc}</div>`;
            if (def.effect) html += `<div class="bld-tt-effect">${def.effect(_bldEffectRates(id, def), id)}</div>`;
            if (def.flavor) html += `<div class="bld-tt-flavor">${def.flavor}</div>`;
            _bldTooltipEl.innerHTML = html;
            _bldTooltipEl.style.display = 'block';
        });
        el.addEventListener('mousemove', e => {
            if (!_bldTooltipEl) return;
            const tipW = 220;
            const tipH = _bldTooltipEl.offsetHeight;
            const left = e.clientX + 14 + tipW > window.innerWidth ? e.clientX - tipW - 14 : e.clientX + 14;
            const top  = e.clientY + 14 + tipH > window.innerHeight ? e.clientY - tipH - 8 : e.clientY + 14;
            _bldTooltipEl.style.left = left + 'px';
            _bldTooltipEl.style.top  = top  + 'px';
        });
        el.addEventListener('mouseleave', () => { if (_bldTooltipEl) _bldTooltipEl.style.display = 'none'; });
    });

    // Expanded Awareness — not in ROOMS, wired up manually
    const eaBtn = document.getElementById('btn-expandedAwareness');
    if (eaBtn) {
        eaBtn.addEventListener('mouseenter', () => {
            if (!_bldTooltipEl) return;
            const bonus = getReservoirBonus();
            _bldTooltipEl.innerHTML =
                `<div class="bld-tt-name">Expanded Awareness</div>` +
                `<div class="bld-tt-desc">Deepen your mental capacity, increasing the storage cap of all Essence, Influence, and Mana reservoirs by +10 each.</div>` +
                `<div class="bld-tt-effect">Each reservoir building currently grants +${bonus} capacity. Next purchase raises this to +${bonus + 10}.</div>` +
                `<div class="bld-tt-flavor">The mind is not a vessel with fixed walls. It is a space you learn to widen.</div>`;
            _bldTooltipEl.style.display = 'block';
        });
        eaBtn.addEventListener('mousemove', e => {
            if (!_bldTooltipEl) return;
            const tipW = 220;
            const tipH = _bldTooltipEl.offsetHeight;
            const left = e.clientX + 14 + tipW > window.innerWidth ? e.clientX - tipW - 14 : e.clientX + 14;
            const top  = e.clientY + 14 + tipH > window.innerHeight ? e.clientY - tipH - 8 : e.clientY + 14;
            _bldTooltipEl.style.left = left + 'px';
            _bldTooltipEl.style.top  = top  + 'px';
        });
        eaBtn.addEventListener('mouseleave', () => { if (_bldTooltipEl) _bldTooltipEl.style.display = 'none'; });
    }
}

function _refreshResTooltip() {
    if (!_resTooltipRes || !_resTooltipEl || _resTooltipEl.style.display === 'none') return;
    const html = _buildResTooltipHTML(_resTooltipRes);
    if (html) _resTooltipEl.innerHTML = html;
    else _hideResTooltip();
}

function getCaps() {
    const caps = Object.assign({}, BASE_CAPS);
    // Flat cap bonuses from research + race (capBonus dict keyed by resource)
    for (const res of Object.keys(BASE_CAPS)) {
        const bonus = getResearchBonus('capBonus', res);
        if (bonus > 0) caps[res] += bonus;
    }
    // Storage buildings; reinforcedShelving upgrades per-storage bonus from 50→75;
    // race storageBonus further adds to the per-building amount
    const raceData2    = RACE_DATA[gameState.run && gameState.run.race];
    const raceStorage  = (raceData2 && raceData2.effects && raceData2.effects.storageBonus) || 0;
    const storageBonus = ((gameState.research && gameState.research.reinforcedShelving) ? 75 : 50) + raceStorage;
    const n = gameState.buildings.storage || 0;
    if (n > 0) {
        for (const res of Object.keys(BASE_CAPS)) caps[res] += storageBonus * n;
    }
    // Coin cap; ironLockbox adds 50,000 cp; race capBonus.coins also applies
    caps.coins = COIN_CAP
        + ((gameState.research && gameState.research.ironLockbox) ? 50000 : 0)
        + getResearchBonus('capBonus', 'coins');
    // Era 1: base caps of 100 for Era 1 resources, raised by storage buildings
    if ((gameState.run.era || 1) === 1) {
        const reservoirBonus = getReservoirBonus();
        caps.essence   = 100 + (gameState.buildings.essenceReservoir || 0) * reservoirBonus;
        caps.influence = 100 + (gameState.buildings.influenceShrine   || 0) * reservoirBonus;
        caps.mana      = 100 + (gameState.buildings.manaFont          || 0) * reservoirBonus;
    }
    return caps;
}

const GUILD_DISCOUNT_BUILDINGS = new Set(["smelter", "forge", "loom", "kiln"]);

function getBuildCost(id) {
    const def = ROOMS[id];
    const n   = gameState.buildings[id] || 0;
    const out = {};
    const guildDiscount = gameState.research && gameState.research.guildCharter && GUILD_DISCOUNT_BUILDINGS.has(id);
    for (const [res, base] of Object.entries(def.cost)) {
        let cost = Math.floor(base * Math.pow(def.costScale || 1.2, n));
        if (guildDiscount) cost = Math.floor(cost * 0.80);
        out[res] = cost;
    }
    return out;
}

function canAfford(id) {
    for (const [res, amount] of Object.entries(getBuildCost(id))) {
        if ((gameState.resources[res] || 0) < amount) return false;
    }
    const def = ROOMS[id];
    if (def.coinCost && (gameState.resources.coins || 0) < def.coinCost) return false;
    return true;
}

// ── Actions ───────────────────────────────────────────────────────────────────

// ── Click-modifier (Shift=×5, Ctrl=×25, Shift+Ctrl=×100) ────────────────────
let _clickMult = 1;
document.addEventListener('mousedown', e => {
    if (e.shiftKey && e.ctrlKey) _clickMult = 100;
    else if (e.ctrlKey)          _clickMult = 25;
    else if (e.shiftKey)         _clickMult = 5;
    else                         _clickMult = 1;
});

function build(id) {
    const times = _clickMult;
    let bought = 0;
    for (let i = 0; i < times; i++) {
        if (!canAfford(id)) break;
        const cost = getBuildCost(id);
        for (const [res, amount] of Object.entries(cost)) {
            gameState.resources[res] -= amount;
        }
        const def = ROOMS[id];
        if (def.coinCost) {
            gameState.resources.coins = Math.max(0, (gameState.resources.coins || 0) - def.coinCost);
        }
        gameState.buildings[id] = (gameState.buildings[id] || 0) + 1;
        bought++;
    }
    if (bought === 0) return;
    gameState.stats.buildingsConstructed = (gameState.stats.buildingsConstructed || 0) + bought;
    updateUI();
    saveGame();
}

function gather(key) {
    const action = GATHER_ACTIONS[key];
    const caps   = getCaps();
    const cur    = gameState.resources[action.resource] || 0;
    const cap    = caps[action.resource] !== undefined ? caps[action.resource] : 0;
    if (cur >= cap) return;
    const amount = getGatherAmount(key);
    gameState.resources[action.resource] = Math.min(cur + amount, cap);
    gameState.stats.manualGathers = (gameState.stats.manualGathers || 0) + 1;
    updateUI();
}

// ── Pause / Accelerated Time ──────────────────────────────────────────────────

var _gamePaused = false;  // manual pause

function isSplashVisible() {
    var el = document.getElementById('splash-overlay');
    return el && el.classList.contains('splash-visible');
}

function isGamePaused() {
    return _gamePaused || isSplashVisible();
}

function togglePause() {
    _gamePaused = !_gamePaused;
    updatePauseBtn();
    updateUI();
}

function updatePauseBtn() {
    var btn = document.getElementById('pause-btn');
    if (!btn) return;
    var paused = isGamePaused();
    btn.textContent = paused ? '▶' : '⏸';
    btn.title       = paused ? 'Resume time' : 'Pause time';
    btn.classList.toggle('pause-btn-active', paused);
}

// Called each real-second interval — banks time if paused, drains bank if playing.
function handlePauseBanking() {
    if (isGamePaused()) {
        // Accrue 1 real second into the bank while paused
        gameState.pauseBank = Math.min((gameState.pauseBank || 0) + 1, 28800);
        updateBankDisplay();
        updatePauseBtn();
        return false;   // signal: skip normal tick
    }
    return true;        // signal: run normal tick
}

function updateBankDisplay() {
    var el = document.getElementById('accel-bank');
    if (!el) return;
    var s = Math.floor(gameState.pauseBank || 0);
    if (s <= 0) { el.style.display = 'none'; return; }
    el.style.display = '';
    // Format as Xh Xm Xs
    var h = Math.floor(s / 3600);
    var m = Math.floor((s % 3600) / 60);
    var sec = s % 60;
    var parts = [];
    if (h)   parts.push(h + 'h');
    if (m)   parts.push(m + 'm');
    if (sec || !parts.length) parts.push(sec + 's');
    el.textContent = '⏳ ' + parts.join(' ');
}

// ── Tick ──────────────────────────────────────────────────────────────────────

function runOneTick() {
    const prod = getProduction();
    const caps = getCaps();
    const pop  = gameState.population;
    const st   = gameState.stats;

    // Snapshot resources before this tick so we can record true per-tick deltas
    const _preSnap = {};
    for (const k of Object.keys(gameState.resources)) _preSnap[k] = gameState.resources[k] || 0;

    // 0. Era 1 passive resource income
    if ((gameState.run.era || 1) === 1) {
        const r = gameState.resources;
        const era1 = gameState.era1 || {};
        const l1Nodes = ['deep', 'wild', 'beyond'];
        const hasL1 = (era1.unlocked || []).some(id => l1Nodes.includes(id));
        if (hasL1) {
            const essenceAbove10 = Math.max(0, (r.essence || 0) - 10);
            r.influence = (r.influence || 0) + 0.1 * essenceAbove10;
        }
        // Mana only after at least one L3 Form node is unlocked
        const formNodes = ['horde','champion','bloodline','anomaly','root-node','cycle','pack','apex','kept','consumed','pact','vessel'];
        const hasForm = (era1.unlocked || []).some(id => formNodes.includes(id));
        if (hasForm) r.mana = (r.mana || 0) + 0.2;
        // Clamp to dynamic caps
        r.essence   = Math.min(r.essence,   caps.essence);
        r.influence = Math.min(r.influence, caps.influence);
        r.mana      = Math.min(r.mana,      caps.mana);
    }

    // 1. Building production (passive buildings only)
    // No cap here — final clamp at end of tick so consumption doesn't prevent filling to cap
    for (const [res, rate] of Object.entries(prod)) {
        gameState.resources[res] = (gameState.resources[res] || 0) + rate;
    }
    st.foodProduced  = (st.foodProduced  || 0) + (prod.food  || 0);
    st.woodProduced  = (st.woodProduced  || 0) + (prod.wood  || 0);
    st.stoneProduced = (st.stoneProduced || 0) + (prod.stone || 0);

    // 1b. Converter buildings
    const workers2 = getWorkersPerBuilding();
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.converts) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        // Worker buildings need assigned workers; others run automatically per building
        const w = def.jobs ? (workers2[id] || 0) : count;
        if (w === 0) continue;
        const conv = def.converts;
        let ratio = 1;
        for (const [res, rate] of Object.entries(conv.inputs)) {
            const needed = rate * w;
            if (needed > 0) ratio = Math.min(ratio, (gameState.resources[res] || 0) / needed);
        }
        // Also clamp by output headroom — don't consume inputs if output cap is full
        const convMult = getResearchBonus('converterBonus', id);
        const maxOut = conv.outputRate * convMult * w;
        const outRes = conv.output;
        const outCurrent = gameState.resources[outRes] || 0;
        const outCap = caps[outRes];
        if (outCap !== undefined && outCurrent >= outCap) continue;
        if (outCap !== undefined && maxOut > 0) {
            ratio = Math.min(ratio, (outCap - outCurrent) / maxOut);
        }
        ratio = Math.max(0, Math.min(1, ratio));
        if (ratio === 0) continue;
        for (const [res, rate] of Object.entries(conv.inputs)) {
            gameState.resources[res] = Math.max(0, (gameState.resources[res] || 0) - rate * w * ratio);
        }
        const outAmt = maxOut * ratio;
        gameState.resources[outRes] = (gameState.resources[outRes] || 0) + outAmt;
    }

    // 2. Food consumption (rationing research reduces consumption by 20%)
    const foodConsumptionMult = getResearchBonus('foodConsumption'); // 1.0 normally, 0.80 with rationing
    const foodNeeded = Math.ceil(pop.count * foodConsumptionMult);
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
    const raceDataG  = RACE_DATA[gameState.run && gameState.run.race];
    const growthMult = (raceDataG && raceDataG.effects && raceDataG.effects.growthBonus) || 1;
    const growthThreshold = Math.max(3, Math.round(GROWTH_TICKS * growthMult));
    if (pop.count < housing && gameState.resources.food >= foodBuffer) {
        pop.growthTimer = (pop.growthTimer || 0) + 1;
        if (pop.growthTimer >= growthThreshold) {
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
        // Taxation: base 1 cp/creature/day + taxBonus from research (taxCollector adds 1 more)
        const taxRate = getResearchBonus('taxBonus');
        if (taxRate > 0) {
            gameState.resources.coins = (gameState.resources.coins || 0) + gameState.population.count * taxRate;
        }
        // Trade Caravans: cloth and potions in stock each generate 2 cp per unit per day
        if (gameState.research && gameState.research.tradeGoods) {
            const tradeIncome = Math.floor(((gameState.resources.cloth || 0) + (gameState.resources.potions || 0)) * 2);
            gameState.resources.coins = (gameState.resources.coins || 0) + tradeIncome;
        }
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

    // Final clamp — applied once after all production and consumption so resources
    // can fill to cap even when consumption is non-zero within the same tick
    for (const res of Object.keys(caps)) {
        if (gameState.resources[res] !== undefined) {
            gameState.resources[res] = Math.max(0, Math.min(gameState.resources[res], caps[res]));
        }
    }

    // Record true per-tick deltas for the rate display
    const deltas = {};
    for (const k of Object.keys(gameState.resources)) {
        const d = (gameState.resources[k] || 0) - (_preSnap[k] || 0);
        if (d !== 0) deltas[k] = d;
    }
    gameState.lastTickDeltas = deltas;

    updateUI();

    // Autosave
    const interval = gameSettings.autosaveInterval;
    if (interval > 0 && gameState.time.tick % interval === 0) saveGame();
}

// Public tick — called by setInterval every 1 real second.
// Skips when paused (banked instead). When playing, drains 1 banked second
// as a bonus tick so the player gets back exactly what they paused away.
function tick() {
    if (!handlePauseBanking()) {
        // Paused — bank was already incremented; keep UI fresh
        updateBankDisplay();
        return;
    }
    // Normal tick
    runOneTick();
    // Bank drawdown: burn 1 banked second as an extra tick (2× speed until drained)
    if ((gameState.pauseBank || 0) >= 1) {
        gameState.pauseBank -= 1;
        runOneTick();
        updateBankDisplay();
    }
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
    const perDay = r * TICKS_PER_DAY;
    return (perDay > 0 ? "+" : "") + perDay.toFixed(1);
}

function getNetRates(prod, caps) {
    // Start from passive production (already computed by caller)
    const rates = Object.assign({}, prod);

    // Add converter output and subtract input consumption.
    // If the output resource is already at cap, the converter is idle — skip it entirely.
    const w2 = getWorkersPerBuilding();
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.converts) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const w = def.jobs ? (w2[id] || 0) : count;
        if (w === 0) continue;
        const outRes = def.converts.output;
        const outCurrent = gameState.resources[outRes] || 0;
        const outCap = caps[outRes];
        if (outCap !== undefined && outCurrent >= outCap) continue;
        for (const [res, rate] of Object.entries(def.converts.inputs)) {
            rates[res] = (rates[res] || 0) - rate * w;
        }
        const convMult = getResearchBonus('converterBonus', id);
        rates[outRes] = (rates[outRes] || 0) + def.converts.outputRate * convMult * w;
    }

    // Subtract food consumed by population each tick
    if (gameState.population.count > 0) {
        const mult = getResearchBonus('foodConsumption');
        rates.food = (rates.food || 0) - Math.ceil(gameState.population.count * mult);
    }

    return rates;
}

function updateUI() {
    updatePauseBtn();
    updateBankDisplay();
    updateEraTabVisibility();
    renderEra1Tree();
    renderEra1Actions();
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
    const popRow = document.getElementById("pop-row");
    if (popRow) popRow.classList.toggle("starving", isStarving);

    // Coins (now in Population section)
    setText("coinsDisplay", formatCoins(gameState.resources.coins || 0));
    setText("coinsCap",     formatCoins(caps.coins));

    // Resources
    // Use actual deltas from the last tick when available; fall back to static estimate
    // on first load (before any tick has run) so the display isn't blank.
    const lastDeltas = gameState.lastTickDeltas;
    const netRates   = lastDeltas || getNetRates(prod, caps);
    for (const res of Object.keys(RESOURCES)) {
        const rowEl = document.getElementById("res-row-" + res);
        if (rowEl) {
            rowEl.style.display = shouldShowResource(res) ? "" : "none";
            const atCap = caps[res] !== undefined && (gameState.resources[res] || 0) >= caps[res];
            rowEl.classList.toggle("res-at-cap", atCap);
        }

        setText(res,         fmt(gameState.resources[res] || 0));
        setText(res + "Cap", fmt(caps[res] !== undefined ? caps[res] : 0));

        const netRate = netRates[res] || 0;
        const rateEl  = document.getElementById(res + "Rate");
        if (rateEl) {
            const alwaysShow = (res === 'essence' || res === 'influence' || res === 'mana')
                             && shouldShowResource(res);
            if (netRate === 0 && !alwaysShow) {
                rateEl.style.display = "none";
            } else {
                rateEl.textContent   = netRate === 0 ? '+0' : fmtRate(netRate);
                rateEl.style.display = "";
                rateEl.style.color   = netRate < 0 ? "var(--disabled)" : "var(--enabled)";
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
        const btn     = document.getElementById("btn-" + id);
        if (btn) {
            btn.style.display = checkUnlock(id) ? "" : "none";
            btn.classList.toggle("disabled", !canAfford(id));
        }
        const countEl = document.getElementById(id + "Count");
        if (countEl) {
            countEl.textContent = (def.jobs && count > 0) ? `${count} (${w}★)` : count;
        }
        const costEl = document.getElementById(id + "Cost");
        if (costEl) {
            const cost = getBuildCost(id);
            let costStr = Object.entries(cost)
                .map(([res, n]) => `${fmt(n)} ${RESOURCES[res]?.name || res}`)
                .join(", ");
            if (def.coinCost) costStr += (costStr ? ", " : "") + formatCoins(def.coinCost);
            costEl.textContent = costStr;
        }
    }

    // Expanded Awareness upgrade button
    {
        const hasReservoir = (gameState.buildings.essenceReservoir || 0)
                           + (gameState.buildings.influenceShrine  || 0)
                           + (gameState.buildings.manaFont         || 0) > 0;
        const btn = document.getElementById('btn-expandedAwareness');
        if (btn) {
            btn.style.display = hasReservoir ? '' : 'none';
            const upgCost = getReservoirUpgradeCost();
            btn.classList.toggle('disabled', (gameState.resources.essence || 0) < upgCost);
        }
        const countEl = document.getElementById('expandedAwarenessCount');
        if (countEl) countEl.textContent = (gameState.era1Upgrades && gameState.era1Upgrades.reservoirExpansion) || 0;
        const costEl = document.getElementById('expandedAwarenessCost');
        if (costEl) costEl.textContent = `${getReservoirUpgradeCost()} Essence`;
    }

    // Research tab
    for (const [key, def] of Object.entries(RESEARCH)) {
        const card = document.getElementById("research-" + key);
        if (!card) continue;
        const done       = !!(gameState.research && gameState.research[key]);
        const prereqsMet = !def.requiresResearch || def.requiresResearch.every(k => gameState.research && gameState.research[k]);
        const eraOk      = (RESEARCH_ERA[key] || 1) <= (gameState.run.era || 1);
        card.style.display = (!done && prereqsMet && eraOk) ? "" : "none";
        if (done) continue;
        const btn = document.getElementById("btn-research-" + key);
        if (!btn) continue;
        btn.textContent = "Research";
        btn.disabled    = !canAffordResearch(key);
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
    setText("info-food-rate",  fmtRate(netRates.food  || 0) || "0");
    setText("info-wood-rate",  fmtRate(netRates.wood  || 0) || "0");
    setText("info-stone-rate", fmtRate(netRates.stone || 0) || "0");

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
        const yieldEl = document.getElementById("action-yield-" + key);
        if (yieldEl) {
            const resName = RESOURCES[action.resource]?.name || action.resource;
            yieldEl.textContent = `+${getGatherAmount(key)} ${resName}`;
        }
    }

    // Workers tab
    const assignments = gameState.workerAssignments || {};
    const workersPop  = pop.count;
    let   totalAssigned = 0;
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.jobs) continue;
        const rowEl = document.getElementById("wrow-" + id);
        const built = (gameState.buildings[id] || 0) > 0;
        if (rowEl) rowEl.style.display = built ? "" : "none";
        if (!built) continue;
        const slots   = (gameState.buildings[id] || 0) * def.jobs;
        const actual  = workers[id] || 0;
        totalAssigned += actual;
        const slotsEl = document.getElementById("wslots-" + id);
        if (slotsEl) slotsEl.textContent = `${actual} / ${slots}`;
        const inputEl = document.getElementById("winput-" + id);
        if (inputEl && document.activeElement !== inputEl) {
            inputEl.value = assignments[id] || 0;
            inputEl.max   = slots;
        }
    }
    setText("wpeasants", workersPop - totalAssigned);
    setText("wtotal",    `${totalAssigned} / ${workersPop}`);

    _refreshResTooltip();
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

function formatCoins(n) {
    n = Math.floor(n);
    if (n <= 0) return "0 cp";
    const gp = Math.floor(n / 1000);
    const sp = Math.floor((n % 1000) / 100);
    const cp = n % 100;
    const parts = [];
    if (gp) parts.push(gp + " gp");
    if (sp) parts.push(sp + " sp");
    if (cp) parts.push(cp + " cp");
    return parts.length ? parts.join(" ") : "0 cp";
}

// ── Era system ────────────────────────────────────────────────────────────────
// Era-gated buildings: Era 1 = everything NOT listed here (default).
const BUILDING_ERA = {
    // Era 2 — Advanced industry / arcane
    crystalSeam:   2, smelter:       2, alchemyLab:  2,
    kiln:          2, loom:          2, mageTower:   2,
    armory:        2, sulphurVent:   2, arcaneGrinder: 2,
    forge:         2, arcaneBench:   2,
    // Era 3 — Endgame / dark
    ritualCircle:  3, spiderNest:    3, arcaneCrucible: 3,
    darkAltar:     3, mithrilForge:  3,
};

// Era-gated research: defaults to Era 1 if not listed.
const RESEARCH_ERA = {
    // Era 2
    deepMining: 2, coalBunker: 2, sulphurStudy: 2, crystalLore: 2,
    bellowsDesign: 2, concentratedExtracts: 2, highFireKiln: 2, loomMastery: 2,
    forgeMastery: 2, mortaredMasonry: 2, arcaneInscription: 2, crystalFocus: 2,
    arcaneTapping: 2, guildCharter: 2, ironLockbox: 2, tradeGoods: 2, runicScript: 2,
    // Era 3
    essenceHarvest: 3, ichorRefinement: 3, silkCulture: 3, manaConductorCoils: 3,
    mithrilTemper: 3, ritualPrep: 3, darkTexts: 3, silkenWarren: 3,
    manaConduit: 3, dungeonBlueprint: 3,
};

// Research keys grouped by era — used to bulk-complete them in dev loadouts.
const ERA_1_RESEARCH = [
    "taxes", "toolcraft", "foragerLore", "cropRotation", "composting",
    "herbGarden", "animalHusbandry", "timberfelling", "carpentry", "stonemason",
    "quarrying", "oreProspecting", "packHunting", "trapLines", "bonecraft",
    "reinforcedShelving", "dryCellar", "communalLiving", "bookkeeping",
    "taxCollector", "roadNetwork", "rationing", "militiaDrill",
];
const ERA_2_RESEARCH = [
    "deepMining", "coalBunker", "sulphurStudy", "crystalLore",
    "bellowsDesign", "concentratedExtracts", "highFireKiln", "loomMastery",
    "forgeMastery", "mortaredMasonry", "arcaneInscription", "crystalFocus",
    "arcaneTapping", "guildCharter", "ironLockbox", "tradeGoods", "runicScript",
];
const ERA_3_RESEARCH = [
    "essenceHarvest", "ichorRefinement", "silkCulture", "manaConductorCoils",
    "mithrilTemper", "ritualPrep", "darkTexts", "silkenWarren",
    "manaConduit", "dungeonBlueprint",
];

// Default dev loadouts: representative fully-researched state for each era.
const ERA_LOADOUTS = {
    1: {
        population: 5,
        buildings: {
            essenceWell: 30,
            essenceConduit: 5, manaCrucible: 5,
            essenceReservoir: 5, influenceShrine: 5, manaFont: 5,
        },
        research: [],
        resources: {
            essence: 500, influence: 300, mana: 200,
        },
        workerAssignments: {},
    },
    2: {
        population: 20,
        buildings: {
            lair: 6, farm: 5, lumber: 4, quarry: 4, storage: 4,
            mine: 4, coalSeam: 3, huntingLodge: 3, herbalistDen: 2, clayPit: 2, crystalSeam: 2,
            smelter: 2, alchemyLab: 1, kiln: 1, loom: 1,
            mageTower: 1, armory: 2, sulphurVent: 1, arcaneGrinder: 1, forge: 1, arcaneBench: 1,
        },
        research: [...ERA_1_RESEARCH, ...ERA_2_RESEARCH],
        resources: {
            food: 200, wood: 200, stone: 200, ore: 200,
            herbs: 100, coal: 150, clay: 100, bones: 100, crystals: 75, sulphur: 80,
            iron: 150, potions: 60, arcaneDust: 60,
            steel: 50, bricks: 80, cloth: 50, runes: 30,
            coins: 15000,
        },
        workerAssignments: { farm: 5, lumber: 4, quarry: 4, mine: 4 },
    },
    3: {
        population: 40,
        buildings: {
            lair: 8, farm: 8, lumber: 6, quarry: 6, storage: 6,
            mine: 6, coalSeam: 4, huntingLodge: 4, herbalistDen: 3, clayPit: 3, crystalSeam: 3,
            smelter: 3, alchemyLab: 2, kiln: 2, loom: 2,
            mageTower: 2, armory: 3, sulphurVent: 2, arcaneGrinder: 2, forge: 2, arcaneBench: 2,
            ritualCircle: 1, spiderNest: 1, arcaneCrucible: 1, darkAltar: 1, mithrilForge: 1,
        },
        research: [...ERA_1_RESEARCH, ...ERA_2_RESEARCH, ...ERA_3_RESEARCH],
        resources: {
            food: 200, wood: 200, stone: 200, ore: 200,
            herbs: 150, coal: 150, clay: 150, bones: 150, crystals: 75, sulphur: 80,
            iron: 150, potions: 75, arcaneDust: 75, steel: 100, bricks: 120, cloth: 100, runes: 60,
            arcaneEssence: 50, silk: 40, manaGold: 40, ichor: 30, mithril: 20,
            coins: 50000,
        },
        workerAssignments: { farm: 8, lumber: 6, quarry: 6, mine: 6 },
    },
};

function checkUnlock(id) {
    const def = ROOMS[id];
    if (!def) return false;
    // Era gate: building not visible until the run reaches the required era
    if ((BUILDING_ERA[id] || 1) > (gameState.run.era || 1)) return false;
    if (def.unlock) {
        for (const [reqId, reqCount] of Object.entries(def.unlock)) {
            if ((gameState.buildings[reqId] || 0) < reqCount) return false;
        }
    }
    if (def.requiresResearch) {
        for (const key of def.requiresResearch) {
            if (!gameState.research || !gameState.research[key]) return false;
        }
    }
    return true;
}

function shouldShowResource(res) {
    const era = gameState.run.era || 1;
    // Era 1: only show Era 1 resources; hide all Era 2 resources
    if (era === 1) {
        return res === 'essence' || res === 'influence' || res === 'mana';
    }
    // Era 2+: hide all Era 1 resources entirely
    if (res === 'essence' || res === 'influence' || res === 'mana') return false;
    if (res === "food" || res === "wood" || res === "stone") return true;
    if ((gameState.resources[res] || 0) > 0) return true;
    for (const [id, def] of Object.entries(ROOMS)) {
        if ((gameState.buildings[id] || 0) === 0) continue;
        if (def.production && def.production[res]) return true;
        if (def.converts && def.converts.output === res) return true;
    }
    return false;
}

function canAffordResearch(key) {
    const def = RESEARCH[key];
    if (!def) return false;
    if (def.requiresResearch) {
        for (const reqKey of def.requiresResearch) {
            if (!gameState.research || !gameState.research[reqKey]) return false;
        }
    }
    for (const [res, amount] of Object.entries(def.cost)) {
        if ((gameState.resources[res] || 0) < amount) return false;
    }
    return true;
}

function doResearch(key) {
    const def = RESEARCH[key];
    if (!def) return;
    if (gameState.research && gameState.research[key]) return;
    if (!canAffordResearch(key)) return;
    for (const [res, amount] of Object.entries(def.cost)) {
        gameState.resources[res] = Math.max(0, (gameState.resources[res] || 0) - amount);
    }
    if (!gameState.research) gameState.research = {};
    gameState.research[key] = true;
    updateUI();
    saveGame();
}

// ── Dev tools ────────────────────────────────────────────────────────────────

// Apply a full era loadout — resets game-relevant state to a canonical
// starting point for that era with all lower-era research completed.
function applyEraLoadout(era) {
    const L = ERA_LOADOUTS[era];
    if (!L) return;
    // Reset buildings to zero then apply loadout counts
    for (const k of Object.keys(gameState.buildings)) gameState.buildings[k] = 0;
    Object.assign(gameState.buildings, L.buildings);
    // Complete specified research keys
    gameState.research = Object.fromEntries(L.research.map(k => [k, true]));
    // Set resources (zero everything first)
    for (const k of Object.keys(gameState.resources)) gameState.resources[k] = 0;
    Object.assign(gameState.resources, L.resources);
    // Population and workers
    gameState.population = { count: L.population, growthTimer: 0, starveTick: 0 };
    gameState.workerAssignments = Object.assign({}, L.workerAssignments || {});
}

function devSetEra(n) {
    gameState.run.era = n;
    if (n === 1) {
        gameState.era1 = { unlocked: [], chosen: null, raceOptions: null };
        gameState.run.race = null;
        _era1TreeState = '';
    }
    applyEraLoadout(n);
    updateUI();
    updateIdentityPanel();
    saveGame();
}

function devAddResource(res, amount) {
    const caps = getCaps();
    gameState.resources[res] = Math.min((gameState.resources[res] || 0) + amount, caps[res]);
    updateUI();
    saveGame();
}

function devFillPercent(pct) {
    const caps = getCaps();
    const allRes = [...Object.keys(BASE_CAPS), 'coins'];
    for (const res of allRes) {
        if (!shouldShowResource(res) && res !== 'coins') continue;
        const cap = caps[res] ?? 0;
        gameState.resources[res] = Math.min((gameState.resources[res] || 0) + Math.floor(cap * pct), cap);
    }
    updateUI();
    saveGame();
}

function devFillAllCaps() {
    const caps = getCaps();
    for (const res of Object.keys(BASE_CAPS)) gameState.resources[res] = caps[res];
    gameState.resources.coins = caps.coins;
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
    for (let i = 0; i < n; i++) runOneTick();
    gameSettings.autosaveInterval = savedInterval;
    saveGame();
}

function devAddBank(seconds) {
    gameState.pauseBank = Math.min((gameState.pauseBank || 0) + seconds, 28800);
    updateBankDisplay();
    saveGame();
}

function devMaxBank() {
    gameState.pauseBank = 28800;
    updateBankDisplay();
    saveGame();
}

function devClearBank() {
    gameState.pauseBank = 0;
    updateBankDisplay();
    saveGame();
}

function devAddOneEach() {
    for (const id of Object.keys(ROOMS)) {
        if (!checkUnlock(id)) continue;
        gameState.buildings[id] = (gameState.buildings[id] || 0) + 1;
    }
    updateUI();
    saveGame();
}

function devMaxAll() {
    for (const id of Object.keys(ROOMS)) {
        if (!checkUnlock(id)) continue;
        gameState.buildings[id] = (gameState.buildings[id] || 0) + 10;
    }
    updateUI();
    saveGame();
}

function devWipeResources() {
    for (const res of Object.keys(BASE_CAPS)) gameState.resources[res] = 0;
    gameState.resources.coins = 0;
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

// ── Era 1 Awakening Tree ──────────────────────────────────────────────────────

function canAffordEra1(nodeId) {
    const node = ERA1_TREE[nodeId];
    if (!node) return false;
    const r = gameState.resources;
    for (const [res, amt] of Object.entries(node.cost)) {
        if ((r[res] || 0) < amt) return false;
    }
    return true;
}

// Branch particle colors keyed by domain
const ERA1_BRANCH_COLORS = {
    deep:   'rgba(136,153,170,VAL)',
    wild:   'rgba(90,158,96,VAL)',
    beyond: 'rgba(136,102,187,VAL)',
};
const ERA1_BRANCH_FLASH = {
    deep:   'rgba(136,153,170,0.12)',
    wild:   'rgba(90,158,96,0.14)',
    beyond: 'rgba(136,102,187,0.12)',
};
const ERA1_PARTICLE_GLYPHS = ['ᚠ','ᚢ','ᚦ','ᚱ','ᚲ','ᛁ','ᛏ','ᛇ','✦','◈','△','◇'];

function era1BurstParticles(el, domainId, count) {
    if (document.body.classList.contains('reduce-motion')) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top  + rect.height / 2;
    const colorTemplate = ERA1_BRANCH_COLORS[domainId] || ERA1_BRANCH_COLORS.deep;
    for (let i = 0; i < count; i++) {
        const p = document.createElement('span');
        p.className = 'era1-particle';
        p.textContent = ERA1_PARTICLE_GLYPHS[Math.floor(Math.random() * ERA1_PARTICLE_GLYPHS.length)];
        const angle = (Math.PI * 2 * i / count) + (Math.random() - 0.5) * 0.6;
        const dist  = 40 + Math.random() * 50;
        const dx = Math.cos(angle) * dist;
        const dy = Math.sin(angle) * dist - 20; // bias upward
        const dr = (Math.random() - 0.5) * 120;
        const opacity = 0.55 + Math.random() * 0.3;
        p.style.cssText = [
            `left:${cx}px`, `top:${cy}px`,
            `color:${colorTemplate.replace('VAL', opacity.toFixed(2))}`,
            `font-size:${11 + Math.floor(Math.random() * 8)}px`,
            `--dx:${dx.toFixed(1)}px`, `--dy:${dy.toFixed(1)}px`,
            `--dr:${dr.toFixed(0)}deg`,
            `animation-duration:${0.7 + Math.random() * 0.4}s`,
            `animation-delay:${(Math.random() * 0.08).toFixed(2)}s`,
        ].join(';');
        document.body.appendChild(p);
        p.addEventListener('animationend', () => p.remove(), { once: true });
    }
}

function era1FlashTree(domainId) {
    if (document.body.classList.contains('reduce-motion')) return;
    const tree = document.getElementById('era1-tree');
    if (!tree) return;
    const flash = document.createElement('div');
    flash.className = 'era1-race-flash';
    flash.style.background = ERA1_BRANCH_FLASH[domainId] || ERA1_BRANCH_FLASH.deep;
    tree.appendChild(flash);
    flash.addEventListener('animationend', () => flash.remove(), { once: true });
}

// Injects dynamic race nodes into ERA1_TREE from gameState.era1.raceOptions.
// Called on L4 unlock and on load so the tree always has the saved options.
function era1EnsureDynRaceNodes() {
    const opts = gameState.era1 && gameState.era1.raceOptions;
    if (!opts || !opts.names || opts.names.length < 2) return;
    const ids = ['dyn-race-0', 'dyn-race-1'];
    ids.forEach((id, i) => {
        const raceName = opts.names[i];
        // Reuse flavor from existing L5 node if one exists for this race, else generic
        const existing = Object.values(ERA1_TREE).find(n => n.layer === 5 && n.race === raceName);
        const flavor = existing ? existing.flavor : `${raceName} — a creature of the ${opts.type} type. Their strengths will shape your dungeon's future.`;
        ERA1_TREE[id] = {
            id, name: raceName, layer: 5, parent: opts.parentId,
            flavor, cost: { influence: 200, mana: 150 }, children: [],
            type: opts.type, race: raceName,
        };
    });
    // Patch the L4 parent's children to point to the dynamic nodes
    if (ERA1_TREE[opts.parentId]) {
        ERA1_TREE[opts.parentId].children = ids;
    }
}

function unlockEra1Node(nodeId) {
    const node = ERA1_TREE[nodeId];
    if (!node) return;
    if (!canAffordEra1(nodeId)) {
        const el = document.getElementById('era1-node-' + nodeId);
        if (el) { el.classList.add('era1-flash-deny'); setTimeout(() => el.classList.remove('era1-flash-deny'), 600); }
        return;
    }

    // Pulse the clicked node before deducting
    const clickedEl = document.getElementById('era1-node-' + nodeId);
    const domainId  = era1GetDomain(nodeId);
    if (clickedEl) {
        clickedEl.classList.add('era1-node-chosen-pulse');
        clickedEl.addEventListener('animationend', () => clickedEl.classList.remove('era1-node-chosen-pulse'), { once: true });
        era1BurstParticles(clickedEl, domainId, node.layer === 5 ? 16 : 10);
    }

    // Deduct costs
    for (const [res, amt] of Object.entries(node.cost)) {
        gameState.resources[res] = Math.max(0, (gameState.resources[res] || 0) - amt);
    }
    if (!gameState.era1) gameState.era1 = { unlocked: [], chosen: null };
    gameState.era1.unlocked.push(nodeId);

    // L4 chosen — pick 2 random races from the full roster for this type
    if (node.layer === 4 && node.type) {
        const legendaryNames = new Set(
            Object.values(LEGENDARY_ROSTER).flat()
        );
        const pool = (CREATURE_ROSTER[node.type] || []).filter(n => !legendaryNames.has(n));
        // Fisher-Yates shuffle, then take first 2
        for (let i = pool.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [pool[i], pool[j]] = [pool[j], pool[i]];
        }
        gameState.era1.raceOptions = { type: node.type, parentId: nodeId, names: pool.slice(0, 2) };
        era1EnsureDynRaceNodes();
    }

    // Era transition: L5 race node chosen
    if (node.layer === 5 && node.race) {
        gameState.era1.chosen = nodeId;
        era1HidePanel();
        era1FlashTree(domainId);
        setTimeout(() => {
            showEraTransition(node.race, () => {
                playRace(node.race);
                gameState.run.era = 2;
                saveGame();
                snapshotBackup("Era 2 (" + (node.race || "transition") + ")");
                updateUI();
                saveGame();
            });
        }, 900);
        return;
    }
    updateUI();
    saveGame();
}

// ── Era 1 → Era 2 Comic Transition ───────────────────────────────────────────

let _eraTransitionCallback = null;
let _eraTimerRAF = null;
let _eraTimerTimeout = null;
let _eraMouseMoveHandler = null;
let _eraCanvasRAF = null;

function showEraTransition(raceName, onComplete) {
    _eraTransitionCallback = onComplete;

    // Inject pluralised race name into panel III lore
    const racePlural = raceName.endsWith('s') ? raceName : raceName + 's';
    const loreRace = document.querySelector('.era-panel-lore-race');
    if (loreRace) loreRace.innerHTML = '<em>' + racePlural + '</em> stepped forward from the dark, eyes open, hunger awake.';

    const overlay = document.getElementById('era-transition-overlay');
    const panels  = document.querySelectorAll('.era-panel');
    const btn     = document.getElementById('era-transition-continue');
    const arc     = document.getElementById('era-timer-arc');

    // Clear any previous timer
    if (_eraTimerRAF)     { cancelAnimationFrame(_eraTimerRAF); _eraTimerRAF = null; }
    if (_eraTimerTimeout) { clearTimeout(_eraTimerTimeout); _eraTimerTimeout = null; }

    // Reset state
    panels.forEach(p => p.classList.remove('era-panel-in'));
    btn.classList.remove('era-btn-in', 'era-btn-pulse');
    if (arc) { arc.style.strokeDashoffset = '0'; arc.style.stroke = '#1abc9c'; }
    overlay.classList.remove('era-hiding');
    overlay.classList.add('era-active');

    // Stagger panels in
    const delays = [120, 360, 600, 860, 1180];
    panels.forEach((p, i) => {
        setTimeout(() => p.classList.add('era-panel-in'), delays[i]);
    });

    // ── Per-panel canvas particle animations, staggered 3s apart ──────────────
    // Each canvas is sized to its panel and activated after its stagger delay.
    // One shared RAF loop drives all active canvases.
    const TEAL = 'rgba(26,188,156,';
    const canvasStaggerMs = 3000;

    function initEraCanvases() {
        if (_eraCanvasRAF) { cancelAnimationFrame(_eraCanvasRAF); _eraCanvasRAF = null; }
        const panelEls = [
            document.getElementById('era-panel-1'),
            document.getElementById('era-panel-2'),
            document.getElementById('era-panel-3'),
            document.getElementById('era-panel-4'),
            document.getElementById('era-panel-5'),
        ];
        const canvases = panelEls.map((p, i) => {
            const c = document.getElementById('era-canvas-' + (i + 1));
            if (!c || !p) return null;
            c.width  = p.offsetWidth  || 300;
            c.height = p.offsetHeight || 220;
            return { el: c, ctx: c.getContext('2d'), w: c.width, h: c.height, active: false, t: 0 };
        });

        // Particle pools per panel
        // Panel 1 — rising embers from rune core at ~(cx=110/220*w, cy=128/160*h)
        const p1 = [];
        function spawnEmber(cv) {
            const ox = cv.w * (110/220), oy = cv.h * (128/160);
            p1.push({ x: ox + (Math.random()-0.5)*14, y: oy, vx: (Math.random()-0.5)*0.4,
                      vy: -(0.5 + Math.random()*1.2), life: 1, size: 0.8 + Math.random()*1.4 });
        }

        // Panel 2 — crack burst motes from gate seam (cx=110/220*w, along y)
        const p2 = [];
        function spawnCrackMote(cv) {
            const ox = cv.w * (110/220), oy = cv.h * (0.3 + Math.random()*0.55);
            const angle = (Math.random()-0.5) * Math.PI * 0.5;
            const spd = 0.3 + Math.random() * 0.8;
            p2.push({ x: ox, y: oy, vx: Math.cos(angle)*spd * (Math.random()<0.5?-1:1),
                      vy: Math.sin(angle)*spd - 0.2, life: 1, size: 0.7 + Math.random() });
        }

        // Panel 3 — orbiting sparks around creature + drifting motes
        const p3 = [];
        let p3angle = 0;
        function spawnOrbitMote(cv) {
            p3.push({ x: cv.w/2, y: cv.h*0.55, orbitR: 28 + Math.random()*22,
                      orbitSpeed: 0.012 + Math.random()*0.01,
                      orbitAngle: Math.random()*Math.PI*2, life: 1,
                      size: 1 + Math.random()*1.2, drift: (Math.random()-0.5)*0.3 });
        }

        // Panel 4 — corridor travellers from center outward
        const DIRS4 = [[0,-1],[0,1],[-1,0],[1,0],[-0.7,-0.7],[0.7,-0.7],[-0.7,0.7],[0.7,0.7]];
        const p4 = [];
        function spawnTraveller(cv) {
            const dir = DIRS4[Math.floor(Math.random()*DIRS4.length)];
            const spd = 0.6 + Math.random()*0.5;
            p4.push({ x: cv.w/2, y: cv.h*0.54, vx: dir[0]*spd, vy: dir[1]*spd,
                      life: 1, size: 1.5 + Math.random(), trail: [] });
        }

        // Panel 5 — radial pulse waves + scattered motes
        const p5waves = [];
        const p5motes = [];
        function spawnWave(cv) {
            p5waves.push({ r: 5, maxR: Math.min(cv.w, cv.h)*0.48, life: 1 });
        }
        function spawnFinalMote(cv) {
            const angle = Math.random()*Math.PI*2, dist = 20 + Math.random()*cv.w*0.36;
            p5motes.push({ x: cv.w/2 + Math.cos(angle)*dist, y: cv.h/2 + Math.sin(angle)*dist,
                           vx: (Math.random()-0.5)*0.25, vy: (Math.random()-0.5)*0.25,
                           life: 1, size: 0.8 + Math.random() });
        }

        let lastT = performance.now();
        let spawnTick = 0;

        // Activate canvases with 3s stagger
        canvases.forEach((cv, i) => {
            if (!cv) return;
            setTimeout(() => {
                cv.active = true;
                cv.el.classList.add('era-canvas-active');
                // Pre-seed some particles so panel isn't empty on appear
                if (i === 0) for (let k=0; k<8;  k++) spawnEmber(cv);
                if (i === 1) for (let k=0; k<6;  k++) spawnCrackMote(cv);
                if (i === 2) for (let k=0; k<5;  k++) spawnOrbitMote(cv);
                if (i === 3) for (let k=0; k<4;  k++) spawnTraveller(cv);
                if (i === 4) { spawnWave(cv); for (let k=0; k<8; k++) spawnFinalMote(cv); }
            }, i * canvasStaggerMs);
        });

        function loopEraCanvas(now) {
            _eraCanvasRAF = requestAnimationFrame(loopEraCanvas);
            const dt = Math.min(now - lastT, 50); // cap at 50ms to avoid jumps
            lastT = now;
            spawnTick += dt;

            canvases.forEach((cv, idx) => {
                if (!cv || !cv.active) return;
                cv.t += dt;
                const ctx = cv.ctx;
                ctx.clearRect(0, 0, cv.w, cv.h);

                // ── Panel 1: rising embers ──────────────────────────────────
                if (idx === 0) {
                    if (spawnTick > 80 && p1.length < 28) { spawnEmber(cv); }
                    for (let i = p1.length-1; i >= 0; i--) {
                        const e = p1[i];
                        e.x  += e.vx; e.y += e.vy; e.vx += (Math.random()-0.5)*0.06;
                        e.life -= 0.008;
                        if (e.life <= 0 || e.y < -4) { p1.splice(i,1); continue; }
                        const a = e.life * 0.75;
                        ctx.beginPath();
                        ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL + a + ')';
                        ctx.shadowBlur = 6; ctx.shadowColor = '#1abc9c';
                        ctx.fill();
                        ctx.shadowBlur = 0;
                    }
                    // Pulse glow on the rune core
                    const pulse = 0.12 + 0.08 * Math.sin(cv.t * 0.003);
                    const gx = cv.w*(110/220), gy = cv.h*(128/160);
                    const grad = ctx.createRadialGradient(gx, gy, 0, gx, gy, 30);
                    grad.addColorStop(0, TEAL + pulse + ')');
                    grad.addColorStop(1, TEAL + '0)');
                    ctx.beginPath(); ctx.arc(gx, gy, 30, 0, Math.PI*2);
                    ctx.fillStyle = grad; ctx.fill();
                }

                // ── Panel 2: crack light motes ──────────────────────────────
                if (idx === 1) {
                    if (spawnTick > 120 && p2.length < 20) spawnCrackMote(cv);
                    // Animated light bloom on the seam
                    const seam = 0.05 + 0.04 * Math.sin(cv.t * 0.0025);
                    const sx = cv.w*(110/220);
                    const lg = ctx.createLinearGradient(sx-18, 0, sx+18, 0);
                    lg.addColorStop(0, TEAL+'0)');
                    lg.addColorStop(0.5, TEAL+seam+')');
                    lg.addColorStop(1, TEAL+'0)');
                    ctx.fillStyle = lg;
                    ctx.fillRect(sx-18, cv.h*0.27, 36, cv.h*0.6);
                    for (let i = p2.length-1; i >= 0; i--) {
                        const m = p2[i];
                        m.x += m.vx; m.y += m.vy; m.vy -= 0.01;
                        m.life -= 0.014;
                        if (m.life <= 0) { p2.splice(i,1); continue; }
                        ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL + (m.life*0.8) + ')';
                        ctx.shadowBlur = 4; ctx.shadowColor = '#1abc9c';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Pulse the seal rings
                    [32, 22].forEach((r, ri) => {
                        const rScale = cv.w / 220;
                        const a = 0.12 + 0.10 * Math.sin(cv.t*0.002 + ri*1.2);
                        ctx.beginPath();
                        ctx.arc(cv.w/2, cv.h*(80/160), r*rScale, 0, Math.PI*2);
                        ctx.strokeStyle = TEAL+a+')'; ctx.lineWidth = 1;
                        ctx.setLineDash([3,6]); ctx.stroke(); ctx.setLineDash([]);
                    });
                }

                // ── Panel 3: orbiting eye sparks ────────────────────────────
                if (idx === 2) {
                    if (spawnTick > 200 && p3.length < 10) spawnOrbitMote(cv);
                    p3angle += 0.008;
                    for (let i = p3.length-1; i >= 0; i--) {
                        const o = p3[i];
                        o.orbitAngle += o.orbitSpeed;
                        o.x = cv.w/2 + Math.cos(o.orbitAngle) * o.orbitR + o.drift;
                        o.y = cv.h*0.62 + Math.sin(o.orbitAngle) * o.orbitR * 0.35;
                        o.life -= 0.003;
                        if (o.life <= 0) { p3.splice(i,1); continue; }
                        ctx.beginPath(); ctx.arc(o.x, o.y, o.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL + (o.life*0.6) + ')';
                        ctx.shadowBlur = 8; ctx.shadowColor = '#1abc9c';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Eye glow pulse
                    const eyePulse = 0.18 + 0.14 * Math.sin(cv.t * 0.004);
                    const rScale = cv.w/220;
                    [[104,56],[116,56]].forEach(([ex,ey]) => {
                        const px = ex*rScale, py = ey*(cv.h/160);
                        const eg = ctx.createRadialGradient(px,py,0,px,py,12*rScale);
                        eg.addColorStop(0, TEAL+eyePulse+')');
                        eg.addColorStop(1, TEAL+'0)');
                        ctx.beginPath(); ctx.arc(px, py, 12*rScale, 0, Math.PI*2);
                        ctx.fillStyle = eg; ctx.fill();
                    });
                }

                // ── Panel 4: corridor travellers ────────────────────────────
                if (idx === 3) {
                    if (spawnTick > 300 && p4.length < 16) spawnTraveller(cv);
                    for (let i = p4.length-1; i >= 0; i--) {
                        const t4 = p4[i];
                        t4.trail.push({x: t4.x, y: t4.y});
                        if (t4.trail.length > 8) t4.trail.shift();
                        t4.x += t4.vx; t4.y += t4.vy;
                        t4.life -= 0.008;
                        const oob = t4.x < -4 || t4.x > cv.w+4 || t4.y < -4 || t4.y > cv.h+4;
                        if (t4.life <= 0 || oob) { p4.splice(i,1); continue; }
                        // Draw trail
                        t4.trail.forEach((pt, ti) => {
                            const ta = (ti/t4.trail.length) * t4.life * 0.5;
                            ctx.beginPath(); ctx.arc(pt.x, pt.y, t4.size*0.6, 0, Math.PI*2);
                            ctx.fillStyle = TEAL+ta+')'; ctx.fill();
                        });
                        ctx.beginPath(); ctx.arc(t4.x, t4.y, t4.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL+(t4.life*0.9)+')';
                        ctx.shadowBlur = 6; ctx.shadowColor = '#1abc9c';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Chamber center glow pulse
                    const cp = 0.08 + 0.06 * Math.sin(cv.t*0.003);
                    const cg = ctx.createRadialGradient(cv.w/2, cv.h*0.54, 0, cv.w/2, cv.h*0.54, 28);
                    cg.addColorStop(0, TEAL+cp+')'); cg.addColorStop(1, TEAL+'0)');
                    ctx.beginPath(); ctx.arc(cv.w/2, cv.h*0.54, 28, 0, Math.PI*2);
                    ctx.fillStyle = cg; ctx.fill();
                }

                // ── Panel 5: pulse waves + scattered motes ──────────────────
                if (idx === 4) {
                    if (spawnTick > 1800 && p5waves.length < 3) spawnWave(cv);
                    if (spawnTick > 400  && p5motes.length < 20) spawnFinalMote(cv);
                    // Waves
                    for (let i = p5waves.length-1; i >= 0; i--) {
                        const w = p5waves[i];
                        w.r += (w.maxR - w.r) * 0.012 + 0.4;
                        w.life -= 0.004;
                        if (w.life <= 0) { p5waves.splice(i,1); continue; }
                        ctx.beginPath(); ctx.arc(cv.w/2, cv.h/2, w.r, 0, Math.PI*2);
                        ctx.strokeStyle = TEAL+(w.life*0.22)+')';
                        ctx.lineWidth = 1.5; ctx.stroke();
                    }
                    // Motes
                    for (let i = p5motes.length-1; i >= 0; i--) {
                        const m = p5motes[i];
                        m.x += m.vx; m.y += m.vy; m.life -= 0.004;
                        if (m.life <= 0) { p5motes.splice(i,1); continue; }
                        ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL+(m.life*0.55)+')';
                        ctx.shadowBlur = 5; ctx.shadowColor = '#1abc9c';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Jewel core pulse
                    const jp = 0.2 + 0.15 * Math.sin(cv.t * 0.003);
                    const jg = ctx.createRadialGradient(cv.w/2, cv.h/2, 0, cv.w/2, cv.h/2, 22);
                    jg.addColorStop(0, TEAL+jp+')'); jg.addColorStop(1, TEAL+'0)');
                    ctx.beginPath(); ctx.arc(cv.w/2, cv.h/2, 22, 0, Math.PI*2);
                    ctx.fillStyle = jg; ctx.fill();
                    // Slow rotating outer ring highlight
                    const rot = cv.t * 0.0004;
                    const rx = cv.w/2, ry = cv.h/2, rr = cv.w * 0.26;
                    ctx.beginPath();
                    ctx.arc(rx + Math.cos(rot)*2, ry + Math.sin(rot)*2, rr, rot, rot + Math.PI*0.3);
                    ctx.strokeStyle = TEAL+'0.18)'; ctx.lineWidth = 2; ctx.stroke();
                }
            });

            // Reset spawn tick every 1s so spawn rates are consistent
            if (spawnTick > 1000) spawnTick = spawnTick % 1000;
        }
        _eraCanvasRAF = requestAnimationFrame(loopEraCanvas);
    }

    // Kick off canvases after overlay is visible
    setTimeout(initEraCanvases, 200);

    // Show button then start 15s idle countdown
    const BTN_DELAY     = 1760;
    const COUNTDOWN_MS  = 15000;
    const IDLE_GRACE_MS = 1500;  // ms of no movement before timer resumes
    const CIRCUMFERENCE = 94.2;  // 2π × r=15

    setTimeout(() => {
        btn.classList.add('era-btn-in');

        let accumulated = 0;   // ms of idle time counted so far
        let lastNow     = performance.now();
        let lastMove    = performance.now(); // treat start as a mouse-move so ring fades in first
        let ringVisible = false;

        _eraMouseMoveHandler = function() { lastMove = performance.now(); };
        overlay.addEventListener('mousemove', _eraMouseMoveHandler);

        function tick(now) {
            const delta    = now - lastNow;
            lastNow        = now;
            const idle     = (now - lastMove) > IDLE_GRACE_MS;

            // Fade ring in/out based on idle state
            if (idle && !ringVisible) {
                ringVisible = true;
                if (arc) arc.parentElement.style.opacity = '1';
            } else if (!idle && ringVisible) {
                ringVisible = false;
                if (arc) arc.parentElement.style.opacity = '0';
            }

            // Only count down while idle
            if (idle) accumulated += delta;

            const progress = Math.min(accumulated / COUNTDOWN_MS, 1);
            if (arc) arc.style.strokeDashoffset = String(CIRCUMFERENCE * progress);

            if (progress < 1) {
                _eraTimerRAF = requestAnimationFrame(tick);
            } else {
                overlay.removeEventListener('mousemove', _eraMouseMoveHandler);
                btn.classList.add('era-btn-pulse');
                _eraTimerTimeout = setTimeout(() => eraTransitionContinue(), 400);
            }
        }
        _eraTimerRAF = requestAnimationFrame(tick);
    }, BTN_DELAY);
}

function eraTransitionContinue() {
    // Cancel any running timer, canvas loop, and listener
    if (_eraTimerRAF)     { cancelAnimationFrame(_eraTimerRAF); _eraTimerRAF = null; }
    if (_eraTimerTimeout) { clearTimeout(_eraTimerTimeout); _eraTimerTimeout = null; }
    if (_eraCanvasRAF) { cancelAnimationFrame(_eraCanvasRAF); _eraCanvasRAF = null; }
    if (_eraMouseMoveHandler) {
        const overlay = document.getElementById('era-transition-overlay');
        if (overlay) overlay.removeEventListener('mousemove', _eraMouseMoveHandler);
        _eraMouseMoveHandler = null;
    }

    const overlay = document.getElementById('era-transition-overlay');
    overlay.classList.add('era-hiding');
    overlay.classList.remove('era-active');
    setTimeout(() => {
        overlay.classList.remove('era-hiding');
        if (_eraTransitionCallback) {
            _eraTransitionCallback();
            _eraTransitionCallback = null;
        }
    }, 520);
}

function era1NodeUnlocked(nodeId) {
    return gameState.era1 && (gameState.era1.unlocked || []).includes(nodeId);
}

function era1GetChosenChild(parentId) {
    const parent = ERA1_TREE[parentId];
    if (!parent) return null;
    for (const childId of (parent.children || [])) {
        if (era1NodeUnlocked(childId)) return childId;
    }
    return null;
}

let _era1TooltipEl = null;

function _era1TooltipHTML(nodeId) {
    const node = ERA1_TREE[nodeId];
    if (!node) return '';
    const costEntries = Object.entries(node.cost);
    let costHtml = '';
    if (costEntries.length === 0) {
        costHtml = '<span class="era1-cost-free">Free</span>';
    } else {
        costHtml = costEntries.map(([res, amt]) => {
            const have = Math.floor(gameState.resources[res] || 0);
            const ok = have >= amt;
            return `<span class="${ok ? 'era1-cost-ok' : 'era1-cost-bad'}">${amt} ${res.charAt(0).toUpperCase() + res.slice(1)}</span>`;
        }).join(' · ');
    }
    const warning = (node.layer === 5) ? '<div class="era1-warning">This choice cannot be undone.</div>' : '';
    return `
        <div class="bld-tt-name">${node.name}</div>
        <div class="bld-tt-desc">${node.flavor}</div>
        <div class="era1-panel-cost">Cost: ${costHtml}</div>
        ${warning}
    `;
}

function era1ShowPanel(nodeId, e) {
    if (!_era1TooltipEl) _era1TooltipEl = document.getElementById('era1-node-tooltip');
    if (!_era1TooltipEl) return;
    _era1TooltipEl.innerHTML = _era1TooltipHTML(nodeId);
    _era1TooltipEl.style.display = 'block';
    if (e) _era1MoveTooltip(e);
}

function _era1MoveTooltip(e) {
    if (!_era1TooltipEl) return;
    const tipW = 220;
    const tipH = _era1TooltipEl.offsetHeight;
    const left = e.clientX + 14 + tipW > window.innerWidth  ? e.clientX - tipW - 14 : e.clientX + 14;
    const top  = e.clientY + 14 + tipH > window.innerHeight ? e.clientY - tipH - 8  : e.clientY + 14;
    _era1TooltipEl.style.left = left + 'px';
    _era1TooltipEl.style.top  = top  + 'px';
}

function era1HidePanel() {
    if (!_era1TooltipEl) _era1TooltipEl = document.getElementById('era1-node-tooltip');
    if (_era1TooltipEl) _era1TooltipEl.style.display = 'none';
}

const ERA1_RESERVOIR_UPGRADE_BASE_COST = 60;
const ERA1_RESERVOIR_UPGRADE_SCALE     = 1.05;

function getReservoirBonus() {
    const purchases = (gameState.era1Upgrades && gameState.era1Upgrades.reservoirExpansion) || 0;
    return 20 + purchases * 10;
}

function getReservoirUpgradeCost() {
    const purchases = (gameState.era1Upgrades && gameState.era1Upgrades.reservoirExpansion) || 0;
    return Math.floor(ERA1_RESERVOIR_UPGRADE_BASE_COST * Math.pow(ERA1_RESERVOIR_UPGRADE_SCALE, purchases));
}

function buyReservoirUpgrade() {
    const cost = getReservoirUpgradeCost();
    if ((gameState.resources.essence || 0) < cost) return;
    gameState.resources.essence -= cost;
    if (!gameState.era1Upgrades) gameState.era1Upgrades = {};
    gameState.era1Upgrades.reservoirExpansion = ((gameState.era1Upgrades.reservoirExpansion) || 0) + 1;
    updateUI();
    saveGame();
}

function gatherEra1(action) {
    const r = gameState.resources;
    const essence = Math.floor(r.essence || 0);

    if (action === 'essence') {
        r.essence = Math.min((r.essence || 0) + 1, 500);
    } else if (action === 'toInfluence') {
        if (essence < 2) return;
        r.essence   = (r.essence || 0) - 2;
        r.influence = Math.min((r.influence || 0) + 1, 500);
    } else if (action === 'toMana') {
        if (essence < 5) return;
        r.essence = (r.essence || 0) - 5;
        r.mana    = Math.min((r.mana || 0) + 1, 500);
    }

    updateUI();
    saveGame();
}

let _era1ActionsState = '';

function renderEra1Actions() {
    const container = document.getElementById('era1-actions');
    if (!container) return;
    if ((gameState.run.era || 1) !== 1) { container.innerHTML = ''; _era1ActionsState = ''; return; }

    const r = gameState.resources;
    const essence = Math.floor(r.essence || 0);
    const canInfluence = essence >= 2;
    const canMana = essence >= 5;

    const stateKey = `${canInfluence}|${canMana}`;
    if (stateKey === _era1ActionsState) return;
    _era1ActionsState = stateKey;

    let html = '<h2>Actions</h2><div class="actions-row">';

    html += `<button class="action-btn" onclick="gatherEra1('essence')">
        <span class="action-title">Concentrate</span>
        <span class="action-yield">+1 Essence</span>
    </button>`;

    {
        const cls = canInfluence ? '' : ' disabled';
        html += `<button class="action-btn${cls}" onclick="gatherEra1('toInfluence')">
            <span class="action-title">Exert Will</span>
            <span class="action-yield">-2 Essence → +1 Influence</span>
        </button>`;
    }

    {
        const cls = canMana ? '' : ' disabled';
        html += `<button class="action-btn${cls}" onclick="gatherEra1('toMana')">
            <span class="action-title">Tap the Weave</span>
            <span class="action-yield">-5 Essence → +1 Mana</span>
        </button>`;
    }

    html += '</div>';

    container.innerHTML = html;
}

const ERA1_LORE = [
    {
        heading: 'The First Question',
        body: 'Before you can know what you want, you must know where you belong. The deep dark, the wild surface, the spaces beyond the mortal world — each pulls at something in you that predates memory. This is not a choice of strategy. It is a recognition.',
    },
    {
        heading: 'What Moves You',
        body: 'A dungeon without purpose is just a hole in the ground. What you hunger for shapes everything that follows — your servants, your patience or your fury, the texture of the dark you cultivate. Choose what drives you, and it will drive everything else.',
    },
    {
        heading: 'The Shape of Your Will',
        body: 'Will is not enough on its own. Power must take a form before it can act in the world. The horde, the champion, the patient root — these are not tactics. They are philosophies. What you choose here becomes the language your dungeon speaks.',
    },
    {
        heading: 'Blood and Bone',
        body: 'The idea narrows into flesh. From all the creatures that might serve, one kind calls to the particular nature of what you are becoming. Their strengths will be your strengths. Their limitations, yours as well. You are not choosing servants. You are choosing kin.',
    },
    {
        heading: 'The First Face',
        body: 'This is the choice that ends the question. When your first creature opens its eyes in your halls, it will look like this. Everything you have decided — domain, drive, form, type — culminates here. Choose the face of your dungeon.',
    },
];

function renderEra1Lore(frontierLayer) {
    const el = document.getElementById('era1-lore');
    if (!el) return;
    if (frontierLayer < 1 || frontierLayer > 5) { el.innerHTML = ''; return; }
    const lore = ERA1_LORE[frontierLayer - 1];
    el.innerHTML =
        `<div class="era1-lore">` +
        `<div class="era1-lore-heading">◈ ${lore.heading}?</div>` +
        `<hr class="era1-lore-rule">` +
        `<div class="era1-lore-body">${lore.body}</div>` +
        `</div>`;
}

let _era1TreeState = '';

function renderEra1Tree() {
    const container = document.getElementById('era1-tree');
    if (!container) return;
    if ((gameState.run.era || 1) !== 1) { container.innerHTML = ''; renderEra1Lore(0); return; }

    const era1 = gameState.era1 || { unlocked: [], chosen: null };
    const unlocked = era1.unlocked || [];
    const stateKey = unlocked.join(',') + '|' + getCaps().essence;
    if (stateKey === _era1TreeState) return;
    _era1TreeState = stateKey;
    era1HidePanel();

    // Build the visible node sequence: root, then each chosen child down the path,
    // plus the current frontier (children of the deepest chosen node).
    // At each layer, show all siblings — chosen one highlighted, unchosen ones ghosted.

    let html = '';

    // Helper: render one layer row
    // animate=true adds entrance animation classes (only for the frontier layer)
    function renderLayer(nodeIds, chosenId, animate) {
        if (!nodeIds || nodeIds.length === 0) return '';
        // Get domain of the first node for branch coloring
        const domainId = era1GetDomain(nodeIds[0]);
        const branchClass = (ERA1_BRANCH_CLASS && ERA1_BRANCH_CLASS[domainId]) || '';
        let rowHtml = '<div class="era1-layer">';
        for (let i = 0; i < nodeIds.length; i++) {
            const nid  = nodeIds[i];
            const node = ERA1_TREE[nid];
            if (!node) continue;
            const isChosen = nid === chosenId;
            const isGhosted = chosenId && !isChosen; // a sibling was chosen instead
            const isActive  = !chosenId && !isGhosted; // no sibling chosen yet — this is the frontier
            const affordable = isActive && canAffordEra1(nid);
            const stateClass = isChosen  ? 'era1-node-done'
                             : isGhosted ? 'era1-node-locked'
                             : affordable ? 'era1-node-active'
                             : 'era1-node-waiting';
            const enterClass = animate ? 'era1-node-enter' : '';
            const enterDelay = animate ? `animation-delay:${i * 60}ms;` : '';
            rowHtml += `<div class="era1-node ${stateClass} ${branchClass} ${enterClass}" id="era1-node-${nid}"
                            style="${enterDelay}"
                            onclick="unlockEra1Node('${nid}')"
                            onmouseenter="era1ShowPanel('${nid}', event)"
                            onmousemove="_era1MoveTooltip(event)"
                            onmouseleave="era1HidePanel()">
                <div class="era1-node-name">${node.name}</div>
                ${node.type ? `<div class="era1-node-type">${node.type}</div>` : ''}
            </div>`;
        }
        rowHtml += '</div>';
        return rowHtml;
    }

    // Helper: connector — animated only when it's newly appearing
    function renderConnector(animate) {
        return `<div class="era1-connector${animate ? ' era1-connector-new' : ''}"></div>`;
    }

    // Determine how deep the chosen path goes so we know which layer is the frontier
    const chosenL1 = era1GetChosenChild('root');
    const chosenL2 = chosenL1 ? era1GetChosenChild(chosenL1) : null;
    const chosenL3 = chosenL2 ? era1GetChosenChild(chosenL2) : null;
    const chosenL4 = chosenL3 ? era1GetChosenChild(chosenL3) : null;
    const frontierLayer = !chosenL1 ? 1 : !chosenL2 ? 2 : !chosenL3 ? 3 : !chosenL4 ? 4 : 5;

    // L0: root (always shown as done)
    const rootNode = ERA1_TREE['root'];
    html += `<div class="era1-layer era1-layer-root">
        <div class="era1-node era1-node-done era1-root-node" onmouseenter="era1ShowPanel('root', event)" onmousemove="_era1MoveTooltip(event)" onmouseleave="era1HidePanel()">
            <div class="era1-node-name">${rootNode.name}</div>
        </div>
    </div>`;
    html += renderConnector(false);

    // L1: Domain
    html += renderLayer(ERA1_TREE['root'].children, chosenL1, frontierLayer === 1);

    if (chosenL1) {
        html += renderConnector(frontierLayer === 2);
        // L2: Drive
        html += renderLayer(ERA1_TREE[chosenL1].children, chosenL2, frontierLayer === 2);

        if (chosenL2) {
            html += renderConnector(frontierLayer === 3);
            // L3: Form
            html += renderLayer(ERA1_TREE[chosenL2].children, chosenL3, frontierLayer === 3);

            if (chosenL3) {
                html += renderConnector(frontierLayer === 4);
                // L4: Type
                html += renderLayer(ERA1_TREE[chosenL3].children, chosenL4, frontierLayer === 4);

                if (chosenL4) {
                    html += renderConnector(frontierLayer === 5);
                    // L5: Race — ensure dynamic nodes are injected before rendering
                    era1EnsureDynRaceNodes();
                    const chosenL5 = era1GetChosenChild(chosenL4);
                    html += renderLayer(ERA1_TREE[chosenL4].children, chosenL5, frontierLayer === 5);
                }
            }
        }
    }

    renderEra1Lore(frontierLayer);
    container.innerHTML = html;
}

// ── Tab visibility gating (Era 1 vs Era 2) ───────────────────────────────────

function updateEraTabVisibility() {
    const era = gameState.run.era || 1;
    const era1Tabs = ['awakening'];
    const era2Tabs = ['build', 'research', 'workers'];

    // Show/hide tab buttons
    for (const id of era1Tabs) {
        const btn = document.querySelector(`.tab-btn[data-tab="${id}"]`);
        if (btn) btn.style.display = era === 1 ? '' : 'none';
    }
    for (const id of era2Tabs) {
        const btn = document.querySelector(`.tab-btn[data-tab="${id}"]`);
        if (btn) btn.style.display = era === 1 ? 'none' : '';
    }

    // Show/hide left-column elements that only belong in Era 2
    const displayEra2 = era === 1 ? 'none' : '';
    document.querySelectorAll('.era2-only').forEach(el => {
        el.style.display = displayEra2;
    });

    // Active tab switching
    if (era !== 1) {
        // Entering Era 2 — switch away from awakening tab
        const awakTab = document.getElementById('tab-awakening');
        if (awakTab && awakTab.style.display !== 'none') {
            switchTab('build');
        }
    } else {
        // In Era 1 — switch away from any Era 2 tab
        const activeTab = document.querySelector('.tab-btn.active');
        if (!activeTab || era2Tabs.includes(activeTab.dataset.tab)) {
            switchTab('awakening');
        }
    }
}

// Creature roster, grouped by type. Used as the source for the Dev tab race
// dropdown. The full bestiary now lives in the standalone wiki (wiki.html);
// this constant keeps the Dev tools self-contained inside the game page.
const CREATURE_ROSTER = {
    "Draconic":    ["Metallic Dragon", "Lizardfolk", "Kobold", "Yuan-ti", "Wyvern", "Dragonborn"],
    "Undead":      ["Skeleton", "Zombie", "Vampire", "Wight", "Ghoul", "Revenant", "Banshee", "Wraith", "Mummy", "Demilich", "Shadow"],
    "Goblinoid":   ["Goblin", "Hobgoblin", "Bugbear", "Orc", "Gnoll"],
    "Fey":         ["Pixie", "Dryad", "Satyr", "Quickling", "Green Hag", "Homunculus"],
    "Aberration":  ["Mind Flayer", "Beholder", "Aboleth", "Gibbering Mouther", "Nothic", "Chuul", "Grell", "Flumph"],
    "Ooze":        ["Gelatinous Cube", "Black Pudding", "Gray Ooze", "Ochre Jelly", "Void Ooze"],
    "Elemental":   ["Fire Elemental", "Earth Elemental", "Water Elemental", "Air Elemental"],
    "Monstrous":   ["Harpy", "Medusa", "Minotaur", "Troll", "Werewolf", "Naga", "Basilisk", "Chimera", "Manticore", "Griffon", "Hydra", "Ettin"],
    "Fiend":       ["Imp", "Cambion", "Barbed Devil", "Night Hag", "Succubus/Incubus", "Pit Fiend", "Balor", "Rakshasa", "Quasit", "Shadow Demon"],
    "Giant":       ["Hill Giant", "Stone Giant", "Frost Giant", "Fire Giant", "Cloud Giant", "Storm Giant"],
    "Construct":   ["Stone Golem", "Iron Golem", "Animated Armor"],
    "Lycanthrope": ["Werebear", "Wererat", "Wereboar", "Owlbear", "Displacer Beast"],
    "Flora":       ["Treant", "Myconid", "Vegepygmy", "Shambling Mound", "Vine Blight", "Wood Woad"],
    "Aquatic":     ["Merfolk", "Sahuagin", "Kuo-toa", "Triton"],
    "Humanoid":    ["Kenku", "Tabaxi", "Aarakocra", "Tortle", "Centaur", "Human", "Elf", "Dwarf", "Half-Orc", "Gnome"],
};

// Races hidden from the player — earned through special conditions.
// Populated into RACE_DATA the same way as CREATURE_ROSTER entries.
const LEGENDARY_ROSTER = {
    "Draconic":  ["Chromatic Dragon", "Dracolich"],
    "Undead":    ["Lich"],
    "Monstrous": ["Sphinx", "Tarrasque"],
    "Aquatic":   ["Kraken"],
};

// ── Populate RACE_DATA from type and creature definitions ─────────────────────
(function populateRaceData() {
    // Keys where creature value REPLACES the type value instead of stacking
    const REPLACE_KEYS = new Set(['lairHousing']);
    // Keys that stack multiplicatively; all others stack additively
    const MULT_KEYS    = new Set(['foodConsumption', 'growthBonus']);

    function mergeEffects(base, extra) {
        if (!extra || !Object.keys(extra).length) return Object.assign({}, base);
        const r = {};
        for (const [k, v] of Object.entries(base)) {
            r[k] = (v && typeof v === 'object') ? Object.assign({}, v) : v;
        }
        for (const [k, v] of Object.entries(extra)) {
            if (REPLACE_KEYS.has(k)) {
                r[k] = v;
            } else if (v && typeof v === 'object') {
                // Dict-type effect: merge per-key additively
                const merged = Object.assign({}, r[k] || {});
                for (const [ik, iv] of Object.entries(v)) merged[ik] = (merged[ik] || 0) + iv;
                r[k] = merged;
            } else if (MULT_KEYS.has(k)) {
                r[k] = (r[k] !== undefined ? r[k] : 1) * v;
            } else {
                r[k] = (r[k] || 0) + v;
            }
        }
        return r;
    }

    // ── Type-level base data ──────────────────────────────────────────────────
    const TYPES = {
        "Goblinoid": {
            tag: "tag-goblinoid",
            effects: { foodConsumption: 1.20, growthBonus: 0.65, allGatherBonus: 1, lairHousing: 8 },
            mods: [
                { name: "Fast Breeders",    pos: true,  desc: "Growth timer 35% shorter — the horde expands quickly." },
                { name: "Mob Scavenging",   pos: true,  desc: "+1 to all manual gather yields." },
                { name: "Ravenous Horde",   pos: false, desc: "Population eats 20% more food per tick." },
                { name: "Cramped Quarters", pos: true,  desc: "Lairs house 8 creatures instead of 5." },
            ],
        },
        "Undead": {
            tag: "tag-undead",
            effects: { foodConsumption: 0.15, growthBonus: 3.0, productionBonus: { huntingLodge: 1.15 }, capBonus: { bones: 150, arcaneEssence: 50 } },
            mods: [
                { name: "Deathless Hunger", pos: true,  desc: "Population eats only 15% of normal food — undead barely need sustenance." },
                { name: "Bone Collectors",  pos: true,  desc: "Hunting Lodges produce 15% more. Bone (+150) and Essence (+50) caps increased." },
                { name: "Undying Slow",     pos: false, desc: "Growth timer ×3 — undead must be raised, not born." },
            ],
        },
        "Draconic": {
            tag: "tag-draconic",
            effects: { foodConsumption: 2.0, growthBonus: 2.5, allProductionBonus: 0.15, capBonus: { coins: 15000 } },
            mods: [
                { name: "Dragon's Hoard",    pos: true,  desc: "Coin cap +15,000 cp — hoarding is instinct." },
                { name: "Draconic Might",    pos: true,  desc: "All passive production +15%." },
                { name: "Ravenous Appetite", pos: false, desc: "Population eats ×2 food per tick." },
                { name: "Apex Rarity",       pos: false, desc: "Growth timer 2.5× longer — draconic creatures are few but formidable." },
            ],
        },
        "Fey": {
            tag: "tag-fey",
            effects: { foodConsumption: 0.80, growthBonus: 0.85, productionBonus: { lumber: 1.15, herbalistDen: 1.15 }, gatherBonus: { wood: 1, food: 1 }, allGatherBonus: 1 },
            mods: [
                { name: "Children of the Forest", pos: true, desc: "Lumber Camps and Herbalist Dens produce 15% more." },
                { name: "Fey Sustenance",          pos: true, desc: "Population eats 20% less food." },
                { name: "Nimble Foragers",         pos: true, desc: "+1 wood, +1 food, and +1 to all manual gather yields." },
                { name: "Mercurial Growth",        pos: true, desc: "Growth timer slightly reduced." },
            ],
        },
        "Aberration": {
            tag: "tag-aberration",
            effects: { foodConsumption: 1.30, growthBonus: 1.5, productionBonus: { crystalSeam: 1.15, mageTower: 1.15 }, converterBonus: { arcaneGrinder: 1.15, arcaneBench: 1.15 } },
            mods: [
                { name: "Psychic Resonance",     pos: true,  desc: "Crystal Seams and Mage Towers produce 15% more." },
                { name: "Alien Refinement",      pos: true,  desc: "Arcane Grinders and Arcane Benches process 15% more efficiently." },
                { name: "Alien Metabolism",      pos: false, desc: "Population eats 30% more food — unusual appetites." },
                { name: "Non-Euclidean Biology", pos: false, desc: "Growth timer 1.5× longer; aberrations emerge from... elsewhere." },
            ],
        },
        "Ooze": {
            tag: "tag-ooze",
            effects: { foodConsumption: 0.45, growthBonus: 1.80, allProductionBonus: 0.08, storageBonus: 20 },
            mods: [
                { name: "Absorptive Physiology", pos: true,  desc: "Population eats only 45% of normal food — oozes absorb ambient nutrients." },
                { name: "Vast Capacity",         pos: true,  desc: "Storage buildings hold 20 more of each resource per building." },
                { name: "Pervasive Presence",    pos: true,  desc: "All passive production +8%; oozes seep into every process." },
                { name: "Slow Division",         pos: false, desc: "Growth timer 1.8× longer." },
            ],
        },
        "Elemental": {
            tag: "tag-elemental",
            effects: { foodConsumption: 0.30, growthBonus: 2.0, productionBonus: { coalSeam: 1.15, sulphurVent: 1.15, quarry: 1.10 }, capBonus: { coal: 150, stone: 100 } },
            mods: [
                { name: "Elemental Affinity", pos: true,  desc: "Coal Seams and Sulphur Vents produce 15% more; Quarries +10%." },
                { name: "Infused Form",        pos: true,  desc: "70% reduced food consumption — elementals sustain from ambient energy." },
                { name: "Raw Reserves",        pos: true,  desc: "Coal cap +150, Stone cap +100." },
                { name: "Volatile Cycle",      pos: false, desc: "Growth timer ×2 — elementals coalesce slowly." },
            ],
        },
        "Monstrous": {
            tag: "tag-monstrous",
            effects: { foodConsumption: 1.35, growthBonus: 0.9, allProductionBonus: 0.15, productionBonus: { quarry: 1.15, mine: 1.15 } },
            mods: [
                { name: "Brute Labor",        pos: true,  desc: "Quarries and Mines produce 15% more. All passive production +15%." },
                { name: "Pack Instinct",      pos: true,  desc: "Growth timer slightly reduced — monsters rally quickly." },
                { name: "Monster's Appetite", pos: false, desc: "Population eats 35% more food." },
            ],
        },
        "Fiend": {
            tag: "tag-fiend",
            effects: { taxBonus: 2, foodConsumption: 0.90, productionBonus: { darkAltar: 1.15, ritualCircle: 1.15 }, growthBonus: 1.40 },
            mods: [
                { name: "Infernal Tithe",     pos: true,  desc: "+2 extra cp per creature per day — fiends extract their due." },
                { name: "Dark Mastery",       pos: true,  desc: "Dark Altars and Ritual Circles produce 15% more." },
                { name: "Creature Comforts",  pos: true,  desc: "Population eats 10% less food." },
                { name: "Hellish Provenance", pos: false, desc: "Growth timer 40% longer — fiends must be summoned or bargained, not born." },
            ],
        },
        "Giant": {
            tag: "tag-giant",
            effects: { foodConsumption: 2.0, growthBonus: 3.0, allProductionBonus: 0.15, lairHousing: 2, capBonus: { food: 200, wood: 100, stone: 200 } },
            mods: [
                { name: "Titan's Strength", pos: true,  desc: "All passive production +15%." },
                { name: "Vast Stores",      pos: true,  desc: "Food cap +200, Stone cap +200, Wood cap +100." },
                { name: "Titan's Hunger",   pos: false, desc: "Population eats ×2 food per tick." },
                { name: "Giant Footprint",  pos: false, desc: "Each Lair houses only 2 Giants — they need far more space." },
                { name: "Slow Giants",      pos: false, desc: "Growth timer ×3 — giants are extraordinarily rare." },
            ],
        },
        "Construct": {
            tag: "tag-construct",
            effects: { foodConsumption: 0.05, growthBonus: 4.0, productionBonus: { quarry: 1.15, mine: 1.15, smelter: 1.15 } },
            mods: [
                { name: "Mechanical Efficiency", pos: true,  desc: "Quarries, Mines, and Smelters produce 15% more." },
                { name: "Tireless Frame",         pos: true,  desc: "Population requires almost no food — 95% reduction." },
                { name: "Forged, Not Born",       pos: false, desc: "Growth timer ×4 — each unit must be painstakingly constructed." },
            ],
        },
        "Lycanthrope": {
            tag: "tag-lycanthrope",
            effects: { foodConsumption: 1.30, growthBonus: 0.75, productionBonus: { huntingLodge: 1.15 }, allGatherBonus: 1, capBonus: { bones: 100, food: 75 } },
            mods: [
                { name: "Pack Hunters",      pos: true,  desc: "Hunting Lodges produce 15% more. Bone (+100) and Food (+75) caps increased." },
                { name: "Feral Instincts",   pos: true,  desc: "+1 to all manual gather yields — keen predator senses find more." },
                { name: "Fast Pack",         pos: true,  desc: "Growth timer 25% shorter — the pack grows quickly." },
                { name: "Predator's Hunger", pos: false, desc: "Population eats 30% more food." },
            ],
        },
        "Flora": {
            tag: "tag-flora",
            effects: { foodConsumption: 0.25, growthBonus: 2.0, productionBonus: { lumber: 1.15, herbalistDen: 1.15 }, gatherBonus: { wood: 1, food: 1 }, capBonus: { herbs: 150, wood: 100 } },
            mods: [
                { name: "Living Wood",      pos: true,  desc: "Lumber Camps and Herbalist Dens produce 15% more." },
                { name: "Photosynthesis",   pos: true,  desc: "75% reduced food consumption — flora draw energy from sunlight." },
                { name: "Verdant Foraging", pos: true,  desc: "+1 wood and +1 food per manual gather." },
                { name: "Overgrown Stores", pos: true,  desc: "Herb cap +150, Wood cap +100." },
                { name: "Ancient Growth",   pos: false, desc: "Growth timer ×2 — flora grow slowly but inexorably." },
            ],
        },
        "Aquatic": {
            tag: "tag-aquatic",
            effects: { foodConsumption: 0.70, growthBonus: 0.80, productionBonus: { clayPit: 1.15, huntingLodge: 1.10 }, gatherBonus: { food: 2 }, capBonus: { clay: 150 } },
            mods: [
                { name: "Coastal Mastery",    pos: true, desc: "Clay Pits produce 15% more; Hunting Lodges +10%." },
                { name: "Seafood Diet",       pos: true, desc: "30% reduced food consumption — efficient aquatic metabolism." },
                { name: "Tidal Foraging",     pos: true, desc: "+2 food per manual gather — rivers and coasts yield plenty." },
                { name: "Swift Currents",     pos: true, desc: "Growth timer 20% shorter." },
                { name: "Deep Clay Reserves", pos: true, desc: "Clay cap +150." },
            ],
        },
        "Humanoid": {
            tag: "tag-humanoid",
            effects: { allProductionBonus: 0.08, taxBonus: 1, growthBonus: 0.90, gatherBonus: { food: 1, wood: 1, stone: 1 } },
            mods: [
                { name: "Adaptable",           pos: true, desc: "All passive production +8%." },
                { name: "Civic Organization",  pos: true, desc: "+1 extra cp per creature per day from taxes (active even without Taxation research)." },
                { name: "Versatile Gatherers", pos: true, desc: "+1 food, +1 wood, +1 stone per manual gather." },
                { name: "Quick to Multiply",   pos: true, desc: "Growth timer 10% shorter." },
            ],
        },
    };

    // ── Creature-specific descriptions and optional extra effects / mods ──────
    const CREATURES = {
        // ── Draconic ─────────────────────────────────────────────────────────
        "Chromatic Dragon": { // legendary — earned, not chosen
            desc: "Ancient and terrifying, chromatic dragons are primal forces of destruction. Their very presence supercharges all magical production.",
            extraEffects: { allProductionBonus: 0.05 },
            extraMods: [{ name: "Primal Aura", pos: true, desc: "Extra +5% to all production beyond base Draconic bonus." }],
        },
        "Metallic Dragon": {
            desc: "Noble and wise, metallic dragons accumulate vast treasures and forge alliances that yield enormous wealth.",
            extraEffects: { capBonus: { coins: 5000 } },
            extraMods: [{ name: "Noble Hoard", pos: true, desc: "Coin cap +5,000 beyond base Draconic bonus (total +20,000)." }],
        },
        "Lizardfolk": {
            desc: "Cold-blooded and pragmatic, lizardfolk are cunning hunters who need surprisingly little food to stay sharp.",
            extraEffects: { foodConsumption: 0.9 },
            extraMods: [{ name: "Cold-Blooded", pos: true, desc: "Further 10% food reduction (multiplicative with base Draconic appetite)." }],
        },
        "Kobold": {
            desc: "Scrappy and numerous for draconic creatures, kobolds breed faster than their kin and excel at mining their masters' lairs.",
            extraEffects: { growthBonus: 0.85, productionBonus: { mine: 1.10 } },
            extraMods: [{ name: "Draconic Servitude", pos: true, desc: "Mines produce 10% more. Breeds 15% faster than typical Draconic." }],
        },
        "Yuan-ti": {
            desc: "Serpentine sorcerers who blend alchemy and arcane arts with cold, calculating precision.",
            extraEffects: { converterBonus: { alchemyLab: 1.10 } },
            extraMods: [{ name: "Serpent's Wisdom", pos: true, desc: "Alchemy Labs process 10% more efficiently." }],
        },
        "Wyvern": {
            desc: "Swift aerial hunters whose keen eyes spot resources others miss. Less cunning than true dragons, but fast and fierce.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Aerial Hunter", pos: true, desc: "+1 to all manual gather yields — wyverns spot prey from above." }],
        },
        "Dragonborn": {
            desc: "Proud inheritors of draconic blood, dragonborn organize societies with military precision, extracting loyalty and coin from all.",
            extraEffects: { taxBonus: 1 },
            extraMods: [{ name: "Draconic Honor-Code", pos: true, desc: "+1 extra cp/creature/day — pride demands tribute." }],
        },

        // ── Undead ───────────────────────────────────────────────────────────
        "Skeleton": {
            desc: "Simple animated bones — cheap to maintain and perpetually obedient. The backbone of any undead workforce.",
        },
        "Zombie": {
            desc: "Slow but relentless, zombies toil without complaint. Their surplus flesh occasionally requires supplemental feeding.",
            extraEffects: { foodConsumption: 1.20 },
            extraMods: [{ name: "Putrid Hunger", pos: false, desc: "Zombies require 20% more food — fresh meat keeps them docile." }],
        },
        "Vampire": {
            desc: "Seductive lords of the night who command loyalty through fear and coin. Their undead nature is masked behind aristocratic glamour.",
            extraEffects: { taxBonus: 1 },
            extraMods: [{ name: "Lord of the Night", pos: true, desc: "+1 extra cp/creature/day — vampires demand tribute." }],
        },
        "Lich": { // legendary — earned, not chosen
            desc: "Undead archmages of terrifying power. A lich's phylactery acts as a nexus, amplifying all arcane production.",
            extraEffects: { productionBonus: { crystalSeam: 1.15, mageTower: 1.15 }, converterBonus: { arcaneGrinder: 1.15 } },
            extraMods: [{ name: "Phylactery Nexus", pos: true, desc: "Crystal Seams and Mage Towers +15%; Arcane Grinders +15% efficiency." }],
        },
        "Wight": {
            desc: "Fallen warriors animated by hate. They dominate lesser undead and push work quotas higher through sheer menace.",
            extraEffects: { allProductionBonus: 0.05 },
            extraMods: [{ name: "Wight's Command", pos: true, desc: "Extra +5% all production — wights drive the undead workforce harder." }],
        },
        "Ghoul": {
            desc: "Feral undead that haunt graveyards and charnel houses, stripping bones with terrifying efficiency.",
            extraEffects: { productionBonus: { huntingLodge: 1.10 }, capBonus: { bones: 50 } },
            extraMods: [{ name: "Charnel Efficiency", pos: true, desc: "Hunting Lodges extra +10%; Bone cap +50." }],
        },
        "Revenant": {
            desc: "Driven by unyielding purpose, revenants pursue their singular goal with relentless determination — and grow slightly faster than most undead.",
            extraEffects: { growthBonus: 0.85 },
            extraMods: [{ name: "Singular Purpose", pos: true, desc: "Slightly faster growth than typical Undead (×2.55 instead of ×3)." }],
        },
        "Banshee": {
            desc: "Wailing spirits whose screams curdle blood. Their terror keeps workers productive through sheer dread.",
            extraEffects: { taxBonus: 1 },
            extraMods: [{ name: "Shriek of Dread", pos: true, desc: "+1 extra cp/creature/day — workers pay extra to escape the wailing." }],
        },
        "Wraith": {
            desc: "Incorporeal undead who phase through walls and haunt the darkest corridors. Their shadow-touch can extract arcane essence from bare stone.",
            extraEffects: { gatherBonus: { stone: 1 }, capBonus: { arcaneEssence: 25 } },
            extraMods: [{ name: "Phase Walker", pos: true, desc: "+1 stone per manual gather; Arcane Essence cap +25." }],
        },
        "Mummy": {
            desc: "Ancient undead wrapped in cursed linen. Mummies carry immense reserves of preserved arcane essence from ages past.",
            extraEffects: { capBonus: { arcaneEssence: 50 } },
            extraMods: [{ name: "Preserved Essence", pos: true, desc: "Arcane Essence cap +50 beyond base Undead bonus." }],
        },
        "Demilich": {
            desc: "A lich reduced to its phylactery core — a floating skull of incomprehensible arcane density. The ultimate arcane amplifier.",
            extraEffects: { converterBonus: { arcaneBench: 1.15, ritualCircle: 1.15 } },
            extraMods: [{ name: "Soul Condenser", pos: true, desc: "Arcane Benches and Ritual Circles +15% efficiency." }],
        },
        "Shadow": {
            desc: "Creatures of pure darkness, shadows need almost no sustenance and multiply faster than their undead kin.",
            extraEffects: { foodConsumption: 0.5, growthBonus: 0.70 },
            extraMods: [{ name: "Shade Multiplication", pos: true, desc: "Further halved food consumption; growth timer only ×2.1 (much faster than base Undead ×3)." }],
        },

        // ── Goblinoid ────────────────────────────────────────────────────────
        "Goblin": {
            desc: "The quintessential dungeon fodder — cowardly alone, dangerous in overwhelming numbers. Speed and chaos are their weapons.",
        },
        "Hobgoblin": {
            desc: "Disciplined goblinoid soldiers who bring military order to the dungeon. Their regimented labor is more efficient than frenzied mob work.",
            extraEffects: { allProductionBonus: 0.05 },
            extraMods: [{ name: "Military Discipline", pos: true, desc: "Extra +5% all production — hobgoblins work in organized shifts." }],
        },
        "Bugbear": {
            desc: "Massive goblinoids who excel at brute labor. Their size makes them less efficient in standard lairs.",
            extraEffects: { productionBonus: { quarry: 1.10, mine: 1.10 }, lairHousing: 6 },
            extraMods: [{ name: "Bugbear Brawn", pos: true, desc: "Quarries and Mines extra +10%. Lairs house 6 Bugbears." }],
        },
        "Orc": {
            desc: "Fierce and relentless, orcs raid and conquer to fuel their dungeon's growth. Raw aggression yields more from the land.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Warchief's Drive", pos: true, desc: "Extra +1 to all manual gather yields." }],
        },
        "Gnoll": {
            desc: "Hyena-folk with an obsessive hunger. Gnolls consume more but their pack hunting brings exceptional bone and food yields.",
            extraEffects: { foodConsumption: 1.2, productionBonus: { huntingLodge: 1.15 }, capBonus: { bones: 50 } },
            extraMods: [{ name: "Gnoll Pack Hunt", pos: true, desc: "Hunting Lodges extra +15%; Bone cap +50. Eats 20% more (stacks with Goblinoid base)." }],
        },

        // ── Fey ──────────────────────────────────────────────────────────────
        "Pixie": {
            desc: "Tiny and mischievous, pixies flit through your dungeon making everything slightly more chaotic — and somehow more productive.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Pixie Dust", pos: true, desc: "Extra +1 to all manual gather yields — pixies enchant the process." }],
        },
        "Dryad": {
            desc: "Tree spirits bonded to ancient wood. Dryads coax lumber from the forest at supernatural rates.",
            extraEffects: { productionBonus: { lumber: 1.10 }, gatherBonus: { wood: 1 } },
            extraMods: [{ name: "Grove Bond", pos: true, desc: "Lumber Camps extra +10%; +1 wood per manual gather." }],
        },
        "Satyr": {
            desc: "Hedonistic fey who turn labor into revelry. Their joie de vivre boosts morale and subtly increases all output.",
            extraEffects: { allProductionBonus: 0.05 },
            extraMods: [{ name: "Reveler's Touch", pos: true, desc: "Extra +5% all production — work feels like play." }],
        },
        "Quickling": {
            desc: "Blurringly fast fey who zip through your dungeon harvesting resources with supernatural speed.",
            extraEffects: { gatherBonus: { food: 1, wood: 1, stone: 1 }, growthBonus: 0.80 },
            extraMods: [{ name: "Fey Speed", pos: true, desc: "+1 food/wood/stone per gather; growth timer even faster than base Fey." }],
        },
        "Green Hag": {
            desc: "Ancient fey crones who use dark herbalism to stretch resources and reduce food needs with bitter curses.",
            extraEffects: { foodConsumption: 0.75, converterBonus: { alchemyLab: 1.15 }, capBonus: { herbs: 50 } },
            extraMods: [{ name: "Wicked Herbalism", pos: true, desc: "Further 25% food reduction; Alchemy Labs +15%; Herb cap +50." }],
        },
        "Homunculus": {
            desc: "A tiny alchemical familiar born from arcane rituals. Though crafted rather than born, homunculi resonate with fey magic and amplify alchemical processes.",
            extraEffects: { converterBonus: { alchemyLab: 1.15, arcaneGrinder: 1.10 }, growthBonus: 0.80 },
            extraMods: [{ name: "Alchemical Familiar", pos: true, desc: "Alchemy Labs extra +15%; Arcane Grinders extra +10%; breeds faster than typical Fey." }],
        },

        // ── Aberration ────────────────────────────────────────────────────────
        "Mind Flayer": {
            desc: "Psychic overlords who enslave lesser beings with ease. Their intellect drains create a disturbing productivity boost.",
            extraEffects: { allProductionBonus: 0.08 },
            extraMods: [{ name: "Cerebral Domination", pos: true, desc: "Extra +8% all production — enslaved minds work without question." }],
        },
        "Beholder": {
            desc: "The paranoid many-eyed tyrant. A beholder's disintegration ray mines stone and ore at alarming rates.",
            extraEffects: { productionBonus: { quarry: 1.15, mine: 1.15 } },
            extraMods: [{ name: "Disintegration Mining", pos: true, desc: "Quarries and Mines extra +15%." }],
        },
        "Aboleth": {
            desc: "Ancient aquatic tyrants with memories older than civilization. Their thralls work with preternatural focus.",
            extraEffects: { allProductionBonus: 0.10 },
            extraMods: [{ name: "Memory of Ages", pos: true, desc: "Extra +10% all production — eons of knowledge optimized into labor." }],
        },
        "Gibbering Mouther": {
            desc: "A mass of eyes and mouths that dissolves everything it contacts. Exceptional at conversion but terrible at containment.",
            extraEffects: { storageBonus: -10, converterBonus: { alchemyLab: 1.10, smelter: 1.10 } },
            extraMods: [{ name: "Endless Consumption", pos: false, desc: "Storage buildings hold 10 less per building; converters run 10% more efficiently." }],
        },
        "Nothic": {
            desc: "Warped scholars driven mad by forbidden knowledge. Their cursed insight accelerates arcane extraction.",
            extraEffects: { productionBonus: { crystalSeam: 1.10 }, converterBonus: { arcaneGrinder: 1.10 } },
            extraMods: [{ name: "Rotting Insight", pos: true, desc: "Crystal Seams +10%; Arcane Grinders +10%." }],
        },
        "Chuul": {
            desc: "Hulking crustacean aberrations who excel at heavy extraction work. Their alien constitution requires unusual feeding.",
            extraEffects: { productionBonus: { quarry: 1.10, mine: 1.10 }, foodConsumption: 1.1 },
            extraMods: [{ name: "Exoskeletal Labor", pos: true, desc: "Quarries and Mines extra +10%; slight extra food consumption." }],
        },
        "Grell": {
            desc: "Floating tentacled predators who stalk dungeon tunnels. Their efficient digestion extends food resources.",
            extraEffects: { foodConsumption: 0.9, capBonus: { food: 50 } },
            extraMods: [{ name: "Efficient Digestion", pos: true, desc: "Further 10% food reduction; Food cap +50." }],
        },
        "Flumph": {
            desc: "Gentle psychic creatures, outsiders in this dark world. Flumphs boost morale dramatically with their benevolent auras.",
            extraEffects: { allProductionBonus: 0.12, taxBonus: 1 },
            extraMods: [{ name: "Benevolent Aura", pos: true, desc: "Extra +12% all production and +1 cp/creature/day — the good vibes are real." }],
        },

        // ── Ooze ─────────────────────────────────────────────────────────────
        "Gelatinous Cube": {
            desc: "A perfectly geometric ooze that dissolves and digests everything it touches, leaving dungeons spotlessly clean and resource-dense.",
            extraEffects: { storageBonus: 15, capBonus: { food: 50 } },
            extraMods: [{ name: "Perfect Dissolution", pos: true, desc: "Extra +15 storage per building; Food cap +50." }],
        },
        "Black Pudding": {
            desc: "A ravenous acidic ooze that corrodes metal — then absorbs it. Exceptional at refining ore, terrible at containment.",
            extraEffects: { converterBonus: { smelter: 1.15 } },
            extraMods: [{ name: "Acid Refinement", pos: true, desc: "Smelters extra +15% output — the pudding pre-processes ore." }],
        },
        "Gray Ooze": {
            desc: "A corroding slime that seeps through ore deposits and pre-processes metal with its acidic secretions.",
            extraEffects: { productionBonus: { mine: 1.10 }, converterBonus: { smelter: 1.10 } },
            extraMods: [{ name: "Acid Seep", pos: true, desc: "Mines extra +10%; Smelters extra +10% — the ooze loosens ore before extraction." }],
        },
        "Ochre Jelly": {
            desc: "A splitting ooze that divides when struck. This reproductive efficiency makes Ochre Jellies replenish their numbers far faster than other oozes.",
            extraEffects: { growthBonus: 0.70 },
            extraMods: [{ name: "Divide and Conquer", pos: true, desc: "Growth timer 30% shorter than base Ooze — Ochre Jellies split to reproduce." }],
        },
        "Void Ooze": {
            desc: "A rare ooze infused with planar void energy. Its null-matter body consumes almost nothing and stores resources with supernatural efficiency.",
            extraEffects: { foodConsumption: 0.5, storageBonus: 20 },
            extraMods: [{ name: "Null Containment", pos: true, desc: "Further 50% food reduction; Storage buildings hold 20 more per building." }],
        },

        // ── Elemental ─────────────────────────────────────────────────────────
        "Fire Elemental": {
            desc: "Living flames that burn with purpose. Fire elementals supercharge smelting and forge operations beyond normal limits.",
            extraEffects: { productionBonus: { coalSeam: 1.10 }, converterBonus: { smelter: 1.15, forge: 1.15 } },
            extraMods: [{ name: "Living Flame", pos: true, desc: "Coal Seams extra +10%; Smelters and Forges extra +15%." }],
        },
        "Earth Elemental": {
            desc: "Living stone that mines with intimate knowledge of rock and ore. Earth elementals tear through solid rock effortlessly.",
            extraEffects: { productionBonus: { quarry: 1.15, mine: 1.15 }, capBonus: { stone: 50 } },
            extraMods: [{ name: "Earth Sense", pos: true, desc: "Quarries and Mines extra +15%; Stone cap +50." }],
        },
        "Water Elemental": {
            desc: "Fluid and pervasive, water elementals flow into clay pits and herbalist operations, softening earth and accelerating growth.",
            extraEffects: { productionBonus: { clayPit: 1.15, herbalistDen: 1.10 }, capBonus: { herbs: 50 } },
            extraMods: [{ name: "Flowing Touch", pos: true, desc: "Clay Pits extra +15%; Herbalist Dens extra +10%; Herb cap +50." }],
        },
        "Air Elemental": {
            desc: "Swift and invisible, air elementals carry resources through the dungeon with supernatural speed, boosting all gathering efforts.",
            extraEffects: { allGatherBonus: 1, growthBonus: 0.85 },
            extraMods: [{ name: "Wind Courier", pos: true, desc: "Extra +1 to all manual gather yields; slightly faster emergence than base Elemental." }],
        },

        // ── Monstrous ─────────────────────────────────────────────────────────
        "Harpy": {
            desc: "Winged hunters whose shrieking dives scatter prey. Harpies excel at aerial gathering and consume less than most monsters.",
            extraEffects: { allGatherBonus: 1, foodConsumption: 0.9 },
            extraMods: [{ name: "Aerial Scavenger", pos: true, desc: "Extra +1 all gather; slight food reduction." }],
        },
        "Medusa": {
            desc: "Stone-gazing terrors who accidentally (and deliberately) produce an endless supply of petrified stone resources.",
            extraEffects: { productionBonus: { quarry: 1.15 }, capBonus: { stone: 75 } },
            extraMods: [{ name: "Petrifying Gaze", pos: true, desc: "Quarries extra +15%; Stone cap +75." }],
        },
        "Minotaur": {
            desc: "Legendary maze-guardians of immense strength. Minotaurs are brutally efficient in mines and quarries.",
            extraEffects: { productionBonus: { quarry: 1.2, mine: 1.2 } },
            extraMods: [{ name: "Labyrinth Strength", pos: true, desc: "Quarries and Mines extra +20%." }],
        },
        "Troll": {
            desc: "Regenerating brutes with an insatiable appetite and indestructible bodies. Trolls eat more but work without fatigue.",
            extraEffects: { foodConsumption: 1.2, allProductionBonus: 0.08 },
            extraMods: [{ name: "Regenerating Workforce", pos: true, desc: "Extra +8% all production; eats 20% more (stacks with Monstrous base)." }],
        },
        "Werewolf": {
            desc: "Lycanthropic monstrosities who hunt and howl. Werewolves bridge the gap between Monstrous and Lycanthrope instincts.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, allGatherBonus: 1 },
            extraMods: [{ name: "Full Moon Hunt", pos: true, desc: "Hunting Lodges extra +15%; +1 to all gather yields." }],
        },
        "Naga": {
            desc: "Serpentine sages who blend monstrous cunning with arcane insight. Nagas amplify magical conversion processes.",
            extraEffects: { converterBonus: { alchemyLab: 1.2, arcaneGrinder: 1.2 } },
            extraMods: [{ name: "Serpent's Lore", pos: true, desc: "Alchemy Labs and Arcane Grinders extra +20%." }],
        },
        "Basilisk": {
            desc: "Eight-legged stone-gazers whose very presence slowly petrifies the dungeon walls, extracting stone from thin air.",
            extraEffects: { productionBonus: { quarry: 1.15 }, gatherBonus: { stone: 1 } },
            extraMods: [{ name: "Stone Gaze", pos: true, desc: "Quarries extra +15%; +1 stone per manual gather." }],
        },
        "Chimera": {
            desc: "A chaotic amalgam of lion, goat, and dragon. Chimeras are unpredictable but their triple nature touches everything they do.",
            extraEffects: { allProductionBonus: 0.08, allGatherBonus: 1 },
            extraMods: [{ name: "Triple Nature", pos: true, desc: "Extra +8% all production; +1 to all gather yields." }],
        },
        "Manticore": {
            desc: "Winged predators with venom-spiked tails. Manticores patrol vast territories, gathering more with each sweep.",
            extraEffects: { allGatherBonus: 1, capBonus: { food: 50, bones: 50 } },
            extraMods: [{ name: "Venomous Patrol", pos: true, desc: "Extra +1 all gather; Food and Bone caps +50." }],
        },
        "Griffon": {
            desc: "Noble winged hunters whose aerial perspective reveals hidden veins of ore and pockets of resources.",
            extraEffects: { productionBonus: { mine: 1.2 }, allGatherBonus: 1 },
            extraMods: [{ name: "Eagle Eye", pos: true, desc: "Mines extra +20%; extra +1 to all gather yields." }],
        },
        "Hydra": {
            desc: "Nine-headed terrors that regenerate endlessly. A hydra processes resources in parallel through all its heads simultaneously.",
            extraEffects: { allProductionBonus: 0.12, foodConsumption: 1.2 },
            extraMods: [{ name: "Multi-Headed Efficiency", pos: true, desc: "Extra +12% all production; each head needs feeding (+20% food)." }],
        },
        "Ettin": {
            desc: "Two-headed giants with a constant internal debate. Despite themselves, dual perspectives improve oversight and tax collection.",
            extraEffects: { allProductionBonus: 0.08, taxBonus: 1 },
            extraMods: [{ name: "Divided Mind", pos: true, desc: "Extra +8% all production; +1 cp/creature/day." }],
        },

        // ── Fiend ─────────────────────────────────────────────────────────────
        "Imp": {
            desc: "Minor devils who delight in sabotage — of enemies. Imps sneak into rival operations and bring back extra resources.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Diabolical Theft", pos: true, desc: "Extra +1 all gather — imps steal it so you don't have to." }],
        },
        "Cambion": {
            desc: "Half-fiend nobles with a foot in both worlds. Their dual nature extracts tribute from living and dead alike.",
            extraEffects: { taxBonus: 1, allProductionBonus: 0.05 },
            extraMods: [{ name: "Dual Heritage", pos: true, desc: "+1 cp/creature/day; extra +5% all production." }],
        },
        "Barbed Devil": {
            desc: "Spined enforcers who inspire productivity through pain. Workers under barbed devil supervision consistently exceed output quotas.",
            extraEffects: { allProductionBonus: 0.10 },
            extraMods: [{ name: "Spiked Motivation", pos: true, desc: "Extra +10% all production — no one slacks with a barbed whip nearby." }],
        },
        "Night Hag": {
            desc: "Dream-devouring witches who harvest arcane essence from sleeping creatures. Their nightmare brews are invaluable to dark alchemy.",
            extraEffects: { converterBonus: { alchemyLab: 1.15, ritualCircle: 1.15 }, capBonus: { arcaneEssence: 50 } },
            extraMods: [{ name: "Nightmare Harvest", pos: true, desc: "Alchemy Labs and Ritual Circles extra +15%; Arcane Essence cap +50." }],
        },
        "Succubus/Incubus": {
            desc: "Shape-shifting seducers who manipulate through charm. Their influence makes taxation feel voluntary — and highly profitable.",
            extraEffects: { taxBonus: 1, foodConsumption: 0.85 },
            extraMods: [{ name: "Irresistible Charm", pos: true, desc: "+1 extra cp/creature/day; further 15% food reduction." }],
        },
        "Pit Fiend": {
            desc: "High-ranking lords of Hell who command absolute obedience. A Pit Fiend's presence dramatically increases all output.",
            extraEffects: { allProductionBonus: 0.15, taxBonus: 1 },
            extraMods: [{ name: "Infernal Authority", pos: true, desc: "Extra +15% all production; +1 cp/creature/day." }],
        },
        "Balor": {
            desc: "A demon of pure destruction and fire. Balors incinerate waste and inefficiency, leaving only productive essence behind.",
            extraEffects: { allProductionBonus: 0.15, converterBonus: { darkAltar: 1.15 } },
            extraMods: [{ name: "Immolation Refinery", pos: true, desc: "Extra +15% all production; Dark Altars extra +15%." }],
        },
        "Rakshasa": {
            desc: "Tiger-headed sorcerer-lords who scheme and trade across planes. Their mercantile genius multiplies coin income dramatically.",
            extraEffects: { taxBonus: 1, capBonus: { coins: 5000 } },
            extraMods: [{ name: "Planar Merchant", pos: true, desc: "+1 cp/creature/day; Coin cap +5,000." }],
        },
        "Quasit": {
            desc: "A lesser demon and spy. Quasits sneak into rival operations and bring back knowledge, subtly improving gather efficiency.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Spy's Report", pos: true, desc: "Extra +1 to all gather yields." }],
        },
        "Shadow Demon": {
            desc: "Pure shadow given malevolent will. Shadow Demons feed on no food, slip through solid stone, and warp dark ritual rites to terrifying effect.",
            extraEffects: { foodConsumption: 0.5, converterBonus: { ritualCircle: 1.15 }, capBonus: { arcaneEssence: 50 } },
            extraMods: [{ name: "Shadow Rite", pos: true, desc: "Further 50% food reduction; Ritual Circles +15%; Arcane Essence cap +50." }],
        },

        // ── Giant ─────────────────────────────────────────────────────────────
        "Hill Giant": {
            desc: "The most common and dullest of giants. Hill giants smash things productively, eat everything in sight, and need no praise for it.",
        },
        "Stone Giant": {
            desc: "Gifted sculptors and master quarrymen, stone giants work stone with an artistry bordering on the divine.",
            extraEffects: { productionBonus: { quarry: 1.10 }, capBonus: { stone: 50 } },
            extraMods: [{ name: "Stone Artistry", pos: true, desc: "Quarries extra +10%; Stone cap +50." }],
        },
        "Frost Giant": {
            desc: "Cold raiders from icy peaks who preserve resources through natural refrigeration. Food spoilage is simply not a concern.",
            extraEffects: { capBonus: { food: 100 }, foodConsumption: 0.9 },
            extraMods: [{ name: "Frost Preservation", pos: true, desc: "Food cap extra +100; slightly less ravenous than typical Giants (×1.8 food instead of ×2)." }],
        },
        "Fire Giant": {
            desc: "Master smiths in fire-hardened armor. Fire giants supercharge all metal production processes with infernal expertise.",
            extraEffects: { productionBonus: { mine: 1.10 }, converterBonus: { smelter: 1.15, forge: 1.15 } },
            extraMods: [{ name: "Master Smithing", pos: true, desc: "Mines extra +10%; Smelters and Forges extra +15%." }],
        },
        "Cloud Giant": {
            desc: "Aristocratic giants who rule from sky castles and levy aerial tolls. Their elevated perspective brings unusual strategic insight.",
            extraEffects: { taxBonus: 1, allProductionBonus: 0.10 },
            extraMods: [{ name: "Cloud Castle Tribute", pos: true, desc: "+1 cp/creature/day; extra +10% all production." }],
        },
        "Storm Giant": {
            desc: "The mightiest of giants, Storm Giants command weather itself. Their power radiates into all production.",
            extraEffects: { allProductionBonus: 0.15, capBonus: { coins: 5000 } },
            extraMods: [{ name: "Storm's Command", pos: true, desc: "Extra +15% all production; Coin cap +5,000." }],
        },

        // ── Construct ─────────────────────────────────────────────────────────
        "Stone Golem": {
            desc: "The most durable construct, chiseled from solid granite. A stone golem's immense weight makes it ideal for quarry work.",
            extraEffects: { productionBonus: { quarry: 1.2 }, capBonus: { stone: 50 } },
            extraMods: [{ name: "Granite Frame", pos: true, desc: "Quarries extra +20%; Stone cap +50." }],
        },
        "Iron Golem": {
            desc: "The gold standard of construct laborers. An iron golem's immense strength and immunity to fatigue maximizes ore production.",
            extraEffects: { productionBonus: { mine: 1.2 }, converterBonus: { smelter: 1.2 } },
            extraMods: [{ name: "Iron Constitution", pos: true, desc: "Mines extra +20%; Smelters extra +20%." }],
        },
        "Animated Armor": {
            desc: "Hollow suits of enchanted armor that guard and work in equal measure. Their intimidating presence improves tax compliance.",
            extraEffects: { taxBonus: 1, allProductionBonus: 0.05 },
            extraMods: [{ name: "Armored Presence", pos: true, desc: "+1 cp/creature/day; extra +5% all production." }],
        },

        // ── Lycanthrope ───────────────────────────────────────────────────────
        "Werebear": {
            desc: "Powerful shapeshifters who combine human intelligence with bear strength. Werebears excel at both resource extraction and woodcutting.",
            extraEffects: { productionBonus: { quarry: 1.10, lumber: 1.10 } },
            extraMods: [{ name: "Bear Strength", pos: true, desc: "Quarries and Lumber Camps extra +10%." }],
        },
        "Wererat": {
            desc: "Sly rat-shifters who excel at finding resources in the most unlikely places. Their scavenging network is unmatched.",
            extraEffects: { allGatherBonus: 1, capBonus: { food: 50 } },
            extraMods: [{ name: "Scavenger Network", pos: true, desc: "Extra +1 all gather; Food cap +50." }],
        },
        "Wereboar": {
            desc: "Stubborn and savage, wereboars plow through work with unyielding momentum. Their brute extraction is excellent but appetite steep.",
            extraEffects: { productionBonus: { quarry: 1.10, mine: 1.10 }, foodConsumption: 1.15 },
            extraMods: [{ name: "Boar's Rush", pos: true, desc: "Quarries and Mines extra +10%; slight extra food consumption." }],
        },
        "Owlbear": {
            desc: "Ferocious hybrid predators who combine owl precision with bear power. Exceptional hunters whose bone piles grow quickly.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, capBonus: { bones: 50 } },
            extraMods: [{ name: "Feathered Fury", pos: true, desc: "Hunting Lodges extra +15%; Bone cap +50." }],
        },
        "Displacer Beast": {
            desc: "Six-legged predators who shift phase to avoid predators — and the tax collector. Fearsome hunters, elusive taxpayers.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, taxBonus: -1 },
            extraMods: [{ name: "Phase Predator", pos: false, desc: "Hunting Lodges extra +15%; but -1 cp/creature/day — they dodge the tax collector." }],
        },

        // ── Flora ─────────────────────────────────────────────────────────────
        "Treant": {
            desc: "Ancient tree-folk who are living lumber yet fiercely protect their forests. Treants boost wood production through deep symbiosis.",
            extraEffects: { productionBonus: { lumber: 1.15 }, capBonus: { wood: 50 } },
            extraMods: [{ name: "Forest Guardian", pos: true, desc: "Lumber Camps extra +15%; Wood cap +50." }],
        },
        "Myconid": {
            desc: "Fungal beings who spread their spores through the dungeon, dramatically increasing herb and alchemy yields.",
            extraEffects: { productionBonus: { herbalistDen: 1.15 }, converterBonus: { alchemyLab: 1.10 }, capBonus: { herbs: 50 } },
            extraMods: [{ name: "Spore Network", pos: true, desc: "Herbalist Dens extra +15%; Alchemy Labs extra +10%; Herb cap +50." }],
        },
        "Vegepygmy": {
            desc: "Small plant-folk who grow rapidly and tend to the dungeon's green corners. Their fast growth partially offsets the Flora growth penalty.",
            extraEffects: { growthBonus: 0.75, gatherBonus: { food: 1 } },
            extraMods: [{ name: "Rapid Growth Cycle", pos: true, desc: "Growth timer ×1.5 (much faster than other Flora at ×2); extra +1 food per gather." }],
        },
        "Shambling Mound": {
            desc: "A massive heap of animate vegetation that absorbs nutrients from everything around it. Shambling Mounds dramatically boost farming and herb gathering.",
            extraEffects: { productionBonus: { farm: 1.10, herbalistDen: 1.10 }, capBonus: { food: 75 } },
            extraMods: [{ name: "Nutrient Absorption", pos: true, desc: "Farms and Herbalist Dens extra +10%; Food cap +75." }],
        },
        "Vine Blight": {
            desc: "Creeping plant horrors that spread through dungeon corridors and pull in wood resources from every corner.",
            extraEffects: { productionBonus: { lumber: 1.10 }, gatherBonus: { wood: 1 } },
            extraMods: [{ name: "Creeping Spread", pos: true, desc: "Lumber Camps extra +10%; extra +1 wood per manual gather." }],
        },
        "Wood Woad": {
            desc: "Ancient bark-skinned guardians who emerge from the deep forest. Their stoic resilience lets them work longer before needing rest.",
            extraEffects: { growthBonus: 0.80, productionBonus: { quarry: 1.10 } },
            extraMods: [{ name: "Bark Endurance", pos: true, desc: "Growth timer 20% faster than base Flora; Quarries extra +10%." }],
        },

        // ── Aquatic ───────────────────────────────────────────────────────────
        "Merfolk": {
            desc: "Civilized aquatic beings who build sophisticated underwater settlements. Their social organization improves tax collection.",
            extraEffects: { taxBonus: 1 },
            extraMods: [{ name: "Mer-Society", pos: true, desc: "+1 cp/creature/day — merfolk have well-organized social structures." }],
        },
        "Sahuagin": {
            desc: "Aggressive sea devils who raid coastal settlements. Their brutality at sea translates to extraordinary hunting and gathering yields.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, allGatherBonus: 1 },
            extraMods: [{ name: "Sea Raid", pos: true, desc: "Hunting Lodges extra +15%; extra +1 to all gather yields." }],
        },
        "Kuo-toa": {
            desc: "Mad fish-folk who worship inscrutable gods. Their collective religious fervor, though bizarre, produces ritual outputs others cannot match.",
            extraEffects: { converterBonus: { ritualCircle: 1.15 }, capBonus: { arcaneEssence: 25 } },
            extraMods: [{ name: "Frenzied Worship", pos: true, desc: "Ritual Circles extra +15%; Arcane Essence cap +25." }],
        },
        "Triton": {
            desc: "Noble sea-folk guardians of the deep. Tritons bring military discipline and aquatic mastery to clay and stone extraction.",
            extraEffects: { productionBonus: { clayPit: 1.15 }, allProductionBonus: 0.05 },
            extraMods: [{ name: "Deep Warden", pos: true, desc: "Clay Pits extra +15%; extra +5% all production." }],
        },

        // ── Humanoid ──────────────────────────────────────────────────────────
        "Kenku": {
            desc: "Flightless crow-folk with an uncanny ability to copy and replicate any process they observe. All production benefits slightly.",
            extraEffects: { allProductionBonus: 0.05 },
            extraMods: [{ name: "Mimicry", pos: true, desc: "Extra +5% all production — kenku copy the best methods." }],
        },
        "Tabaxi": {
            desc: "Cat-folk of relentless curiosity and speed. Tabaxi gather with exceptional efficiency and their swift reflexes improve overall output.",
            extraEffects: { allGatherBonus: 1, growthBonus: 0.85 },
            extraMods: [{ name: "Curious Cat", pos: true, desc: "Extra +1 all gather; slightly faster growth." }],
        },
        "Aarakocra": {
            desc: "Bird-folk who soar above the dungeon, spotting resource deposits with sharp avian eyes. Their aerial view enhances all gathering.",
            extraEffects: { allGatherBonus: 1, gatherBonus: { stone: 1 } },
            extraMods: [{ name: "Bird's Eye View", pos: true, desc: "Extra +1 to all gather yields and +1 stone per gather." }],
        },
        "Tortle": {
            desc: "Patient shell-folk with an innate gift for construction and storage. Tortles carry more, build more efficiently, and store more.",
            extraEffects: { storageBonus: 15, capBonus: { stone: 50 } },
            extraMods: [{ name: "Shell Storage", pos: true, desc: "Storage buildings hold 15 more per building; Stone cap +50." }],
        },
        "Centaur": {
            desc: "Half-horse warriors who range across the dungeon collecting resources with unmatched speed. Mobility multiplies yield.",
            extraEffects: { allGatherBonus: 1, gatherBonus: { food: 1 } },
            extraMods: [{ name: "Swift Hooves", pos: true, desc: "Extra +1 to all gather yields and +1 food per gather." }],
        },
        "Human": {
            desc: "Adaptable generalists who excel at nothing in particular but fall behind in nothing either. Humans bring a modest boost to everything they touch.",
            extraEffects: { allProductionBonus: 0.05 },
            extraMods: [{ name: "Generalist Drive", pos: true, desc: "Extra +5% all production — humans work hard at whatever is needed." }],
        },
        "Elf": {
            desc: "Long-lived forest folk with an affinity for wood and arcane crystal. Elves produce more from natural resources and help gather wood by hand.",
            extraEffects: { productionBonus: { lumber: 1.10, crystalSeam: 1.10 }, gatherBonus: { wood: 1 } },
            extraMods: [{ name: "Forest Attunement", pos: true, desc: "Lumber Camps and Crystal Seams extra +10%; extra +1 wood per gather." }],
        },
        "Dwarf": {
            desc: "Stout miners and master smelters whose ancestral bond with stone and metal is unmatched among the surface races.",
            extraEffects: { productionBonus: { mine: 1.10, quarry: 1.10 }, converterBonus: { smelter: 1.10 } },
            extraMods: [{ name: "Stonecunning", pos: true, desc: "Mines and Quarries extra +10%; Smelters extra +10%." }],
        },
        "Half-Orc": {
            desc: "Born of two worlds, half-orcs carry orcish physical power into a form that can direct it with humanoid focus.",
            extraEffects: { allGatherBonus: 1, growthBonus: 0.90 },
            extraMods: [{ name: "Orcish Vigor", pos: true, desc: "Extra +1 to all gather yields; slightly faster emergence than pure Humanoids." }],
        },
        "Gnome": {
            desc: "Tinkering inventors with an insatiable curiosity for alchemy and arcane machinery. Gnomes improve all conversion processes.",
            extraEffects: { converterBonus: { alchemyLab: 1.10, arcaneGrinder: 1.10 }, allGatherBonus: 1 },
            extraMods: [{ name: "Tinker's Touch", pos: true, desc: "Alchemy Labs and Arcane Grinders extra +10%; extra +1 to all gather yields." }],
        },

        // ── Legendary ─────────────────────────────────────────────────────────
        "Chromatic Dragon": { // legendary — earned, not chosen
            desc: "An ancient chromatic dragon whose very presence warps the dungeon around it. Their dominance over lesser races increases all production dramatically.",
            extraEffects: { allProductionBonus: 0.15, foodConsumption: 3.0, lairHousing: 1 },
            extraMods: [
                { name: "Chromatic Dominance", pos: true,  desc: "Extra +15% all production — lesser creatures work harder under a dragon's gaze." },
                { name: "Dragon's Appetite",   pos: false, desc: "Consumes 3× the food of a normal Draconic creature; only 1 fits per lair." },
            ],
        },
        "Lich": { // legendary — earned, not chosen
            desc: "A powerful undead archmage who transcended death to pursue magical mastery. Liches push arcane infrastructure to impossible heights.",
            extraEffects: { converterBonus: { crystalSeam: 1.15, mageTower: 1.15, arcaneGrinder: 1.15 }, foodConsumption: 0, lairHousing: 1 },
            extraMods: [
                { name: "Phylactery Focus",  pos: true,  desc: "Crystal Seams, Mage Towers, and Arcane Grinders extra +15%." },
                { name: "Undying Hunger",    pos: true,  desc: "Liches do not eat — they subsist on soul energy alone; only 1 fits per lair." },
            ],
        },
        "Sphinx": { // legendary — earned, not chosen
            desc: "Ancient and enigmatic, a sphinx's riddling wisdom unlocks insights that improve all arcane processes.",
            extraEffects: { converterBonus: { arcaneGrinder: 1.15, arcaneBench: 1.15 }, productionBonus: { crystalSeam: 1.10 } },
            extraMods: [{ name: "Riddling Wisdom", pos: true, desc: "Arcane Grinders and Benches extra +15%; Crystal Seams extra +10%." }],
        },
        "Dracolich": { // legendary — earned, not chosen
            desc: "A dragon who refused death and bound its soul to a phylactery. The dracolich fuses draconic production might with undead arcane mastery in one terrible form.",
            extraEffects: { allProductionBonus: 0.10, converterBonus: { arcaneGrinder: 1.15, ritualCircle: 1.15 }, foodConsumption: 0, lairHousing: 1 },
            extraMods: [
                { name: "Undying Dominance", pos: true,  desc: "Extra +10% all production; Arcane Grinders and Ritual Circles +15%." },
                { name: "Phylactery Bound",  pos: true,  desc: "Requires no food — the dracolich's phylactery sustains it; only 1 fits per lair." },
            ],
        },
        "Tarrasque": { // legendary — earned, not chosen
            desc: "The most feared creature in existence — an engine of annihilation that cannot be permanently slain. Its very presence drives all lesser creatures to work harder out of pure survival instinct.",
            extraEffects: { allProductionBonus: 0.15, allGatherBonus: 2, foodConsumption: 5.0, lairHousing: 1 },
            extraMods: [
                { name: "Primal Terror",    pos: true,  desc: "Extra +15% all production and +2 to all gather yields — pure survival instinct." },
                { name: "World-Eater",      pos: false, desc: "Consumes 5× the food of a normal Monstrous creature; only 1 fits per lair." },
            ],
        },
        "Kraken": { // legendary — earned, not chosen
            desc: "The ancient terror of the deep ocean. A kraken's immense intelligence and dominion over water amplifies all aquatic and storage operations to impossible scales.",
            extraEffects: { allProductionBonus: 0.08, storageBonus: 30, capBonus: { food: 200, coins: 10000 }, foodConsumption: 2.5, lairHousing: 1 },
            extraMods: [
                { name: "Deep Dominion",    pos: true,  desc: "Extra +8% all production; Storage buildings hold 30 more; Food cap +200; Coin cap +10,000." },
                { name: "Titanic Appetite", pos: false, desc: "Consumes 2.5× the food of a normal Aquatic creature; only 1 fits per lair." },
            ],
        },
    };

    // ── Populate RACE_DATA by merging type base + creature overrides ──────────
    for (const [type, names] of Object.entries(CREATURE_ROSTER)) {
        const td = TYPES[type] || {};
        for (const name of names) {
            const cd = CREATURES[name] || {};
            RACE_DATA[name] = {
                tag:      td.tag      || '',
                tagLabel: type,
                desc:     cd.desc    || td.desc || '',
                mods:     [...(td.mods || []), ...(cd.extraMods || [])],
                effects:  mergeEffects(td.effects || {}, cd.extraEffects || {}),
            };
        }
    }
    for (const [type, names] of Object.entries(LEGENDARY_ROSTER)) {
        const td = TYPES[type] || {};
        for (const name of names) {
            const cd = CREATURES[name] || {};
            RACE_DATA[name] = {
                tag:      td.tag      || '',
                tagLabel: type,
                desc:     cd.desc    || td.desc || '',
                mods:     [...(td.mods || []), ...(cd.extraMods || [])],
                effects:  mergeEffects(td.effects || {}, cd.extraEffects || {}),
            };
        }
    }
})();

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

    gameState.resources  = {};
    for (const res of Object.keys(BASE_CAPS)) gameState.resources[res] = 0;
    gameState.resources.coins = 0;
    gameState.buildings  = {};
    for (const id of Object.keys(ROOMS)) gameState.buildings[id] = 0;
    gameState.research   = {};
    gameState.population = { count: 0, growthTimer: 0, starveTick: 0 };
    gameState.time       = { tick: 0, day: 1, year: 1, seasonIndex: 0 };
    for (const k of Object.keys(gameState.stats)) gameState.stats[k] = 0;
    gameState.run  = { biome: null, race: null, mods: [], era: 1 };
    gameState.meta = savedMeta;

    selectStartBiome(false);
    saveGame();
    snapshotBackup("Prestige " + savedMeta.totalPrestiges); // restore point at run start
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

    // ── Biome tooltip ────────────────────────────────────────────────────────
    const biomeTip = document.getElementById("di-biome-tooltip");
    if (biomeTip) {
        let biomeHtml = "";
        if (biome) {
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
            biomeHtml = `
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
            biomeHtml = `<p class="di-tt-desc">No biome selected.</p>`;
        }
        biomeTip.innerHTML = biomeHtml;
    }

    // ── Race tooltip ─────────────────────────────────────────────────────────
    const raceTip = document.getElementById("di-race-tooltip");
    if (raceTip) {
        let raceHtml = "";
        const raceData = RACE_DATA[raceName];
        if (raceName && raceData) {
            raceHtml = `<div class="di-tt-name">${raceName}${raceData.tag ? `<span class="creature-tag ${raceData.tag}">${raceData.tagLabel || ""}</span>` : ""}</div>
                        <p class="di-tt-race-desc">${raceData.desc}</p>`;
            if (raceData.mods && raceData.mods.length > 0) {
                raceHtml += `<div class="di-tt-section">Race Traits</div><div class="di-tt-mod-list">` +
                    raceData.mods.map(m => {
                        const fx  = m.desc || MOD_DESCRIPTIONS[m.name] || "Effect not yet documented.";
                        const cls = m.pos ? "di-tt-mod-pos" : "di-tt-mod-neg";
                        return `<div class="di-tt-mod-row"><span class="di-tt-mod-name ${cls}">${m.name}</span><span class="di-tt-mod-fx">${fx}</span></div>`;
                    }).join("") +
                    `</div>`;
            }
        } else if (raceName) {
            raceHtml = `<div class="di-tt-race">${raceName}</div>`;
        } else {
            raceHtml = `<div class="di-tt-race di-unset">Not yet selected — choose your race in Era 1.</div>`;
        }
        raceTip.innerHTML = raceHtml;
    }
}

function initIdentityTooltips() {
    function attachTooltip(rowSel, tipId) {
        const row = document.querySelector(rowSel);
        const tip = document.getElementById(tipId);
        if (!row || !tip) return;
        row.addEventListener('mouseenter', function () {
            tip.style.display = 'block';
            const rect = row.getBoundingClientRect();
            const tw = tip.offsetWidth;
            const th = tip.offsetHeight;
            // Prefer right of row; fall back to left if it would overflow viewport
            let left = rect.right + 4;
            if (left + tw > window.innerWidth - 8) left = rect.left - tw - 4;
            // Align top with row; shift up if it clips bottom
            let top = rect.top;
            if (top + th > window.innerHeight - 8) top = window.innerHeight - th - 8;
            tip.style.left = left + 'px';
            tip.style.top  = top  + 'px';
        });
        row.addEventListener('mouseleave', function () {
            tip.style.display = 'none';
        });
    }
    attachTooltip('.di-biome-row', 'di-biome-tooltip');
    attachTooltip('.di-race-row',  'di-race-tooltip');
}

// ── Tabs ──────────────────────────────────────────────────────────────────────

function switchTab(tabId) {
    document.querySelectorAll(".tab-content").forEach(el => { el.style.display = "none"; });
    document.querySelectorAll(".tab-btn").forEach(btn => { btn.classList.remove("active"); });
    const content = document.getElementById("tab-" + tabId);
    if (content) content.style.display = "block";
    const btn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (btn) btn.classList.add("active");
    if (tabId === "settings") updateSettingsUI(); // refresh Restore Backup state
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

loadSettings();
loadGame();
// Normalize fields that may be missing from older saves
if (!gameState.meta)                         gameState.meta = {};
if (!gameState.meta.seenBiomes)              gameState.meta.seenBiomes = [];
if (gameState.meta.totalPrestiges == null)   gameState.meta.totalPrestiges = 0;
if (!gameState.meta.racesPlayed)             gameState.meta.racesPlayed = {};
if (!gameState.workerAssignments)            gameState.workerAssignments = {};
if (!gameState.research)                     gameState.research = {};
if (!gameState.run.era)                      gameState.run.era = 1;
if (gameState.pauseBank == null || isNaN(gameState.pauseBank)) gameState.pauseBank = 0;
if (!gameState.era1) gameState.era1 = { unlocked: [], chosen: null };
if (!Array.isArray(gameState.era1.unlocked)) gameState.era1.unlocked = [];
era1EnsureDynRaceNodes(); // restore dynamic race nodes from saved raceOptions
if (gameState.resources.influence == null) gameState.resources.influence = 0;
if (gameState.resources.mana == null) gameState.resources.mana = 0;
if (gameState.resources.arcaneEssence == null) gameState.resources.arcaneEssence = 0;
// Assign biome on first load (fresh game or old save with no mods yet)
if (!gameState.run || !gameState.run.mods || gameState.run.mods.length === 0) {
    if (!gameState.run) gameState.run = { biome: null, race: null, mods: [] };
    selectStartBiome(gameState.meta.seenBiomes.length === 0);
}
updateUI();
updateIdentityPanel();
devPopulateRaceSelect();
initResTooltips();
initBldTooltips();
initIdentityTooltips();
setInterval(tick, 1000);

// Stamp lastSeen when the player closes or navigates away.
// Skipped when a save reset is in progress so the wipe isn't undone.
var _pendingReset = false;
window.addEventListener('beforeunload', function () {
    if (_pendingReset) return;
    gameState.lastSeen = Date.now();
    saveGame();
});
