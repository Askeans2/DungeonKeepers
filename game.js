const SEASONS        = ["Spring", "Summer", "Autumn", "Winter"];
const TICKS_PER_DAY  = 2;
const DAYS_PER_SEASON = 30;
const GROWTH_TICKS   = 20;
const STARVE_TICKS   = 5;

const BASE_CAPS = {
    // Tier 1 — Raw
    food: 100, wood: 100, stone: 100,
    ore: 150, herbs: 100, crystals: 75, coal: 150, clay: 120, bones: 100, sulphur: 80,
    // Tier 2 — Crafted
    iron: 150, potions: 75, arcaneDust: 75, steel: 100, bricks: 120, cloth: 100, runes: 60,
    // Tier 3 — Magical
    arcaneEssence: 50, silk: 40, manaGold: 40, ichor: 30, mithril: 20,
    // Era 2+ knowledge resource — cap raised by Scriptoriums and research
    lore: 0,
    // Era 1 resources (cap overridden dynamically while era === 1)
    essence: 100, influence: 100, mana: 100,
};
// Trade system: base sell price in cp per unit; buy price is 2× sell price
const TRADE_RATES = {
    food: 2, wood: 3, stone: 2, ore: 5, herbs: 4,
    coal: 4, clay: 3, bones: 2, sulphur: 8,
    crystals: 12, iron: 8, potions: 15,
    arcaneDust: 20, steel: 25, bricks: 6,
    cloth: 12, runes: 40,
    arcaneEssence: 80, silk: 50, manaGold: 70,
    ichor: 35, mithril: 150,
};
const TRADE_AMOUNT = 10; // units traded per active route per game day

// Base coin cap scales with currency tier: 1000 cp → 1000 sp (100,000 cp) → 1000 gp (1,000,000 cp)
const COIN_CAP_CP = 1000;
const COIN_CAP_SP = 100000;   // 1000 sp in cp
const COIN_CAP_GP = 1000000;  // 1000 gp in cp

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
    "Deep Caverns":         { type:"Natural",  badge:"badge-natural",  desc:"A natural underground network; your dungeon expands into pre-existing tunnels. Darkness is the price of depth.",                  start:"+40 Stone · 1 Free Hovel",          mods:[{name:"Cavern Network",pos:true},{name:"Mineral Deposits",pos:true},{name:"Underground Access",pos:true},{name:"Perpetual Darkness",pos:false}],                                                                                          best:["Goblinoid","Aberration","Ooze"],               hard:["Fey","Giant"]                                 },
    "Jungle Canopy":        { type:"Natural",  badge:"badge-natural",  desc:"Stifling heat and impossible density; food is everywhere, and so are things that want to eat you.",                               start:"+40 Food · +20 Wood",              mods:[{name:"Fertile Soil",pos:true},{name:"Ancient Grove",pos:true},{name:"Abundant Wildlife",pos:true},{name:"Disease Vectors",pos:false},{name:"Hostile Flora",pos:false}],                                                                   best:["Flora","Fey","Humanoid"],                      hard:["Undead","Giant","Construct"]                  },
    "Arctic Glacier":       { type:"Natural",  badge:"badge-natural",  desc:"A frozen expanse carved by time. Isolation is both your shield and your prison; the cold never relents.",                         start:"+20 Stone",                        mods:[{name:"Isolation Instinct",pos:true},{name:"Hidden Refuge",pos:true},{name:"Harsh Winters",pos:false},{name:"Barren Soil",pos:false},{name:"Crushing Cold",pos:false}],                                                                    best:["Giant (Frost)"],                               hard:["Draconic","Flora","Fey","Aquatic"]             },
    "Sunken Ruins":         { type:"Natural",  badge:"badge-natural",  desc:"A half-drowned ancient civilization; your dungeon inhabits crumbling walls ankle-deep in water and mystery.",                     start:"+30 Food · 1 Free Storage",        mods:[{name:"Ancient Foundations",pos:true},{name:"Arcane Residue",pos:true},{name:"Flooded Tunnels",pos:false},{name:"Unstable Ground",pos:false}],                                                                                         best:["Aquatic","Undead"],                            hard:["Construct","Giant"]                           },
    "Badlands":             { type:"Natural",  badge:"badge-natural",  desc:"Eroded rock formations and choking dust — defensible terrain if you can survive on what little the land provides.",                start:"+25 Stone · +10 Wood",             mods:[{name:"Exposed Rockface",pos:true},{name:"Defensive Terrain",pos:true},{name:"Barren Soil",pos:false},{name:"Inviting Target",pos:false}],                                                                                              best:["Monstrous","Goblinoid","Draconic"],            hard:["Aquatic","Flora","Fey"]                       },
    "Underdark Depths":     { type:"D&D",      badge:"badge-dnd",      desc:"Far below any sunlit surface, in the realm of dark elves and stranger things. Rich beyond measure; strange beyond reckoning.",   start:"+45 Stone · +15 Food (fungi)",     mods:[{name:"Mineral Deposits",pos:true},{name:"Fungal Bloom",pos:true},{name:"Cavern Network",pos:true},{name:"Underground Access",pos:true},{name:"Perpetual Darkness",pos:false}],                                                             best:["Aberration","Goblinoid","Ooze"],               hard:["Giant","Humanoid","Fey"]                      },
    "Ancient Battlefield":  { type:"D&D",      badge:"badge-dnd",      desc:"The ground still remembers the war. Bones outnumber stones; residual magic pools in craters and corroded armor.",                start:"+20 Food · +20 Wood · +20 Stone",  mods:[{name:"Battleground Residue",pos:true},{name:"Ancient Foundations",pos:true},{name:"Contested Territory",pos:false},{name:"Natural Predators",pos:false}],                                                                               best:["Undead","Monstrous","Humanoid"],               hard:["Fey","Flora"]                                 },
    "Haunted Moor":         { type:"D&D",      badge:"badge-dnd",      desc:"Fog rolls in with the dead. The moor is alive with restless spirits and the slow surrender of all living things.",                start:"+20 Food · +15 Stone",             mods:[{name:"Arcane Residue",pos:true},{name:"Disease Vectors",pos:false},{name:"Cursed Ground",pos:false},{name:"Natural Predators",pos:false},{name:"Plague Risk",pos:false}],                                                                   best:["Undead","Fiend"],                              hard:["Fey","Flora","Construct"]                     },
    "Abyssal Rift":         { type:"D&D",      badge:"badge-dnd",      desc:"A crack in the mortal plane bleeds Abyss energy constantly. Demons trickle through; power flows in both directions.",            start:"+30 Stone",                        mods:[{name:"Planar Tear",pos:true},{name:"Toxic Atmosphere",pos:false},{name:"Planar Pressure",pos:false},{name:"Unstable Plane",pos:false}],                                                                   best:["Fiend","Aberration"],                          hard:["Humanoid","Fey","Flora","Construct"]           },
    "Dragonspine Ridge":    { type:"D&D",      badge:"badge-dnd",      desc:"Scorched peaks where ancient dragons once nested. Their power lingers in the stone and sky in equal measure.",                    start:"+35 Stone · +15 Food",             mods:[{name:"Rich Ore Veins",pos:true},{name:"Fearsome Reputation",pos:true},{name:"Warlord's Domain",pos:true},{name:"Oppressive Heat",pos:false}],                                                                                          best:["Draconic","Monstrous"],                        hard:["Aquatic","Flora","Fey"]                       },
    "Giant's Graveyard":    { type:"D&D",      badge:"badge-dnd",      desc:"Colossal bones provide shelter and raw material; the lingering power of titans seeps into your dungeon's foundations.",           start:"+60 Stone",                        mods:[{name:"Mineral Deposits",pos:true},{name:"Solid Foundation",pos:true},{name:"Ancestral Home",pos:true},{name:"Pack Mentality",pos:true}],                                                                                               best:["Giant","Construct"],                           hard:["Fey","Aquatic","Flora"]                       },
    "Shadowfell Crossing":  { type:"Magical",  badge:"badge-magical",  desc:"The boundary between worlds is paper-thin. The dead walk freely, the light never fully arrives, and dark knowledge seeps through.",start:"+10 Food · +10 Wood · +10 Stone",  mods:[{name:"Arcane Residue",pos:true},{name:"Planar Alignment",pos:true},{name:"Perpetual Darkness",pos:false},{name:"Cursed Ground",pos:false}],                                                               best:["Undead","Fiend"],                              hard:["Fey","Humanoid","Flora"]                      },
    "Feywild Glade":        { type:"Magical",  badge:"badge-magical",  desc:"The Feywild bleeds through in flashes of impossible color. Time is unreliable; life explodes everywhere; magic is uncontrolled.", start:"+30 Food · +20 Wood",              mods:[{name:"Fertile Soil",pos:true},{name:"Warm Climate",pos:true},{name:"Rapid Breeding",pos:true},{name:"Wild Magic Zone",pos:false},{name:"Binding Contract",pos:false}],                                                                    best:["Fey","Flora"],                                 hard:["Undead","Fiend","Construct"]                  },
    "Arcane Nexus":         { type:"Magical",  badge:"badge-magical",  desc:"Ley lines converge in a web of invisible power. Magic saturates the very stone; knowledge comes easily, caution less so.",        start:"+25 Food · +10 Stone",             mods:[{name:"Ley Line Nexus",pos:true},{name:"Arcane Amplification",pos:true},{name:"Resonant Ley Lines",pos:true},{name:"Wild Magic Zone",pos:false}],                                                                                       best:["Aberration","Construct","Humanoid"],           hard:["Goblinoid","Monstrous"]                       },
    "Blighted Wastes":      { type:"Magical",  badge:"badge-magical",  desc:"A cursed land where life struggles and death triumphs. Dangerous for the living; a paradise for those beyond it.",                start:"+10 Stone",                        mods:[{name:"Barren Soil",pos:false},{name:"Cursed Ground",pos:false},{name:"Toxic Atmosphere",pos:false},{name:"Blighted Air",pos:false},{name:"Disease Vectors",pos:false}],                             best:["Undead","Fiend"],                              hard:["Flora","Fey","Humanoid","Aquatic"]             },
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
        "Solid Foundation",
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
    "Cavern Network":         "Begin run with 1 free Hovel already constructed.",
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
    "Communal Living":        "Each Hovel provides +1 extra housing capacity.",
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
    "Plague Risk":            "Every 30 days: 5% chance of a −10% population loss event.",
    "Elder's Blessing":       "First 5 population require no food (they forage independently).",
    "Starvation Resilience":  "Death timer before first starvation death extended by +3 ticks.",
    "Rapid Breeding":         "Population growth timer reduced by 5 ticks (faster natural growth).",
    // Buildings
    "Solid Foundation":       "All building wood costs −10%.",
    "Abundant Stone":         "All building stone costs −20%.",
    "Poor Infrastructure":    "All building costs +15%.",
    "Dungeon Resonance":      "Hovel buildings cost −25% wood.",
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
const RACE_DATA_FALLBACK = 'Wyrm';
function getRaceData(name) {
    return RACE_DATA[name] || RACE_DATA[RACE_DATA_FALLBACK] || null;
}

const gameState = {
    resources: {
        food: 0, wood: 0, stone: 0,
        ore: 0, herbs: 0, crystals: 0, coal: 0, clay: 0, bones: 0, sulphur: 0,
        iron: 0, potions: 0, arcaneDust: 0, steel: 0, bricks: 0, cloth: 0, runes: 0,
        arcaneEssence: 0, silk: 0, manaGold: 0, ichor: 0, mithril: 0,
        lore: 0,
        essence: 0, influence: 0, mana: 0,
        coins: 0,
    },
    buildings: {
        lair: 0, farm: 0, lumber: 0, quarry: 0, storage: 0,
        mine: 0, coalSeam: 0, herbalistDen: 0, huntingLodge: 0, clayPit: 0, crystalSeam: 0,
        marketStall: 0, tradeCart: 0, house: 0, apartment: 0,
        smelter: 0, alchemyLab: 0, kiln: 0, loom: 0,
        arcaneGrinder: 0, forge: 0, arcaneBench: 0, mageTower: 0, armory: 0, sulphurVent: 0,
        scriptorium: 0,
        ritualCircle: 0, spiderNest: 0, arcaneCrucible: 0, darkAltar: 0, mithrilForge: 0,
    },
    tradeRoutes: {},
    buildingDisabled: {}, // building id → count of that building's units currently paused (0..count)
    research:          {},
    workerAssignments: {},
    population: { count: 0, growthTimer: 0, starveTick: 0 },
    run:        { biome: null, race: null, mods: [], era: 1 },
    meta:       { seenBiomes: [], totalPrestiges: 0, racesPlayed: {} },
    time:       { tick: 0, day: 1, year: 1, seasonIndex: 0 },
    pauseBank:  0,   // seconds of Accelerated Time banked from pausing
    randomEventCooldowns: {}, // eventId → absolute day the cooldown expires
    randomEventLog: [],       // { text, effectSummary, day, year, seasonIndex } newest-first
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
    tabTitle:           "",       // custom browser tab title; "" = default
    colorTheme:         "default", // "default" | "crimson" | "arcane"
};

const TAB_TITLE_PRESETS = [
    "Q3 Budget Review",
    "Staff Meeting Notes",
    "Project Timeline - Draft",
    "HR Policy Documentation",
    "Weekly Status Report",
    "Compliance Checklist 2026",
    "Vendor Contract Overview",
];

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
    applyTabTitle();
    applyColorTheme();
    updateSettingsUI();
}

function applyTabTitle() {
    document.title = gameSettings.tabTitle || "Dungeon Keepers";
}

function applyColorTheme() {
    const theme = gameSettings.colorTheme || "default";
    if (theme === "default") {
        document.body.removeAttribute("data-theme");
    } else {
        document.body.setAttribute("data-theme", theme);
    }
}

function setColorTheme() {
    const sel = document.getElementById("set-theme");
    if (!sel) return;
    gameSettings.colorTheme = sel.value;
    saveSettings();
    applyColorTheme();
}

function setTabTitleFromPreset() {
    const sel = document.getElementById("set-title-preset");
    if (!sel || !sel.value) return;
    gameSettings.tabTitle = sel.value;
    saveSettings();
    applyTabTitle();
    const input = document.getElementById("set-title-input");
    if (input) input.value = "";
}

function setTabTitleFromInput() {
    const input = document.getElementById("set-title-input");
    if (!input) return;
    const val = input.value.trim();
    if (!val) return;
    gameSettings.tabTitle = val;
    saveSettings();
    applyTabTitle();
    input.value = "";
    const sel = document.getElementById("set-title-preset");
    if (sel) sel.value = "";
}

function resetTabTitle() {
    gameSettings.tabTitle = "";
    saveSettings();
    applyTabTitle();
    const input = document.getElementById("set-title-input");
    if (input) input.value = "";
    const sel = document.getElementById("set-title-preset");
    if (sel) sel.value = "";
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
    // Tab title preset dropdown — reflect saved value
    const tSel = document.getElementById("set-title-preset");
    if (tSel) {
        tSel.value = TAB_TITLE_PRESETS.includes(gameSettings.tabTitle) ? gameSettings.tabTitle : "";
    }
    // Color theme dropdown — reflect saved value
    const thSel = document.getElementById("set-theme");
    if (thSel) {
        thSel.value = gameSettings.colorTheme || "default";
    }
    // Restore Backup button — reflects whether a checkpoint exists.
    const bkBtn  = document.getElementById("set-restore");
    const bkSnap = document.getElementById("backup-snapshot");
    if (bkBtn) {
        const info = (typeof getBackupInfo === "function") ? getBackupInfo() : null;
        bkBtn.disabled = !info;
        bkBtn.removeAttribute("title");
        if (bkSnap) {
            if (info) {
                const racePart = info.race  ? info.race : "Unknown race";
                const timePart = (info.day != null && info.year != null)
                    ? `Day ${info.day}, Year ${info.year}` : "";
                const datePart = info.at
                    ? new Date(info.at).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
                    : "";
                const parts = [racePart, timePart, datePart].filter(Boolean);
                bkSnap.textContent = parts.join(" · ");
                bkSnap.style.display = "block";
            } else {
                bkSnap.style.display = "none";
            }
        }
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

function getQuintessenceProductionMult() {
    return 1 + ((gameState.meta && gameState.meta.quintessence) || 0) * 0.005;
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
    return Math.floor(total);
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

// Returns the stacked multiplicative bonus from buildings that carry a
// productionBonus field (e.g. runeObelisk gives +5% per count to essenceWell).
function getBuildingProductionBonus(targetId) {
    let mult = 1;
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.productionBonus || !def.productionBonus[targetId]) continue;
        const n = gameState.buildings[id] || 0;
        if (n === 0) continue;
        mult *= Math.pow(def.productionBonus[targetId], n);
    }
    return mult;
}

// Fraction (0..1) of a building's units that are still active (not paused by the player).
function getActiveBuildingFraction(id) {
    const count = gameState.buildings[id] || 0;
    if (count === 0) return 1;
    const paused = Math.min(count, (gameState.buildingDisabled && gameState.buildingDisabled[id]) || 0);
    return (count - paused) / count;
}

function getProduction() {
    const prod      = {};
    for (const res of Object.keys(BASE_CAPS)) prod[res] = 0;
    const workers   = getWorkersPerBuilding();
    const allBonus  = (1 + getResearchBonus('allProductionBonus')) * getQuintessenceProductionMult();
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.production || def.converts) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const activeFrac = getActiveBuildingFraction(id);
        if (activeFrac === 0) continue;
        // Worker buildings scale by assigned workers; all others scale by building count
        const n = (def.jobs ? (workers[id] || 0) : count) * activeFrac;
        if (n === 0) continue;
        const bldgMult = getResearchBonus('productionBonus', id)
                       * getBuildingProductionBonus(id);
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
    const allBonus = (1 + getResearchBonus('allProductionBonus')) * getQuintessenceProductionMult();

    // Passive production buildings
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.production || def.converts) continue;
        if (def.production[res] === undefined) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const activeFrac = getActiveBuildingFraction(id);
        const n = (def.jobs ? (workers[id] || 0) : count) * activeFrac;
        if (n === 0) continue;
        const bldgMult = getResearchBonus('productionBonus', id) * getBuildingProductionBonus(id);
        const rate = def.production[res] * n * bldgMult * allBonus;
        const sub = def.jobs ? `${Math.round(n)}w` : `×${count}`;
        lines.push({ label: def.name, sub, value: rate, drain: false });

        // Surface stacking productionBonus buildings (e.g. Focused Meditation) as a sub-line
        // showing how much of the line above is attributable to the buff (not additive income).
        for (const [bonusId, bonusDef] of Object.entries(ROOMS)) {
            if (!bonusDef.productionBonus || !bonusDef.productionBonus[id]) continue;
            const bonusCount = gameState.buildings[bonusId] || 0;
            if (bonusCount === 0) continue;
            const perUnit = bonusDef.productionBonus[id];
            const totalMult = Math.pow(perUnit, bonusCount);
            const bonusRate = rate - rate / totalMult;
            if (bonusRate === 0) continue;
            lines.push({ label: `↳ ${bonusDef.name} (included above)`, sub: `×${bonusCount}`, value: bonusRate, drain: false, isBonus: true });
        }
    }

    // Converter outputs (this resource is produced by a converter)
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.converts || def.converts.output !== res) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const activeFrac = getActiveBuildingFraction(id);
        const n = (def.jobs ? (workers[id] || 0) : count) * activeFrac;
        if (n === 0) continue;
        const convMult = getResearchBonus('converterBonus', id);
        const rate = def.converts.outputRate * convMult * n;
        const sub = def.jobs ? `${Math.round(n)}w` : `×${count}`;
        lines.push({ label: def.name, sub, value: rate, drain: false });
    }

    // Converter inputs (this resource is consumed by a converter)
    for (const [id, def] of Object.entries(ROOMS)) {
        if (!def.converts || def.converts.inputs[res] === undefined) continue;
        const count = gameState.buildings[id] || 0;
        if (count === 0) continue;
        const activeFrac = getActiveBuildingFraction(id);
        const n = (def.jobs ? (workers[id] || 0) : count) * activeFrac;
        if (n === 0) continue;
        const rate = def.converts.inputs[res] * n;
        const sub = def.jobs ? `${Math.round(n)}w` : `×${count}`;
        lines.push({ label: def.name, sub, value: -rate, drain: true });
    }

    // Food: population consumption
    if (res === 'food' && gameState.population.count > 0) {
        const mult = getResearchBonus('foodConsumption');
        const drain = Math.ceil(gameState.population.count * mult);
        lines.push({ label: 'Population', sub: '', value: -drain, drain: true });
    }

    // Coins: daily income sources
    if (res === 'coins') {
        const taxRate = getResearchBonus('taxBonus');
        if (taxRate > 0) {
            const perDay = gameState.population.count * taxRate;
            lines.push({ label: 'Taxation', sub: '', value: perDay, drain: false, perDay: true });
        }
        if (gameState.research && gameState.research.tradeGoods) {
            const caps = getCaps();
            const clothOk = (gameState.resources.cloth || 0) >= (caps.cloth || 0) * 0.75;
            const potionsOk = (gameState.resources.potions || 0) >= (caps.potions || 0) * 0.75;
            const perDay = (clothOk && potionsOk) ? 10 : 0;
            lines.push({ label: 'Trade Caravans', sub: '', value: perDay, drain: false, perDay: true });
        }
    }

    return lines;
}

let _resTooltipEl = null;
let _resTooltipRes = null;

function _formatTTTime(seconds) {
    if (seconds <= 0) return 'Full';
    if (seconds < 60) return Math.ceil(seconds) + 's';
    if (seconds < 3600) {
        const m = Math.floor(seconds / 60);
        const s = Math.ceil(seconds % 60);
        return s > 0 ? m + 'm ' + s + 's' : m + 'm';
    }
    if (seconds < 86400) {
        const h = Math.floor(seconds / 3600);
        const m = Math.ceil((seconds % 3600) / 60);
        return m > 0 ? h + 'h ' + m + 'm' : h + 'h';
    }
    const d = (seconds / 86400).toFixed(1);
    return d + 'd';
}

function _buildResTooltipHTML(res) {
    const lines = getResourceBreakdown(res);
    if (lines.length === 0) return '';
    const sources = lines.filter(l => !l.drain);
    const drains  = lines.filter(l => l.drain);

    // Net per-tick rate (drains already have negative l.value)
    let netPerTick = 0;
    for (const l of lines) {
        netPerTick += l.perDay ? l.value / TICKS_PER_DAY : l.value;
    }

    // Cap and current for "To Full"
    const caps = getCaps();
    const cap  = caps[res] || 0;
    const cur  = gameState.resources[res] || 0;
    let toFullHTML = '';
    if (cap > 0) {
        const remaining = Math.max(0, cap - cur);
        if (remaining <= 0) {
            toFullHTML = `<div class="res-tt-footer"><span>To Full</span><span class="pos">Full</span></div>`;
        } else if (netPerTick > 0) {
            const secs = remaining / netPerTick;
            toFullHTML = `<div class="res-tt-footer"><span>To Full</span><span class="pos">${_formatTTTime(secs)}</span></div>`;
        } else if (netPerTick < 0) {
            const depleteSecs = cur > 0 ? cur / (-netPerTick) : 0;
            const label = depleteSecs > 0 ? _formatTTTime(depleteSecs) : '0s';
            toFullHTML = `<div class="res-tt-footer"><span>Depletes in</span><span class="neg">${label}</span></div>`;
        } else {
            toFullHTML = `<div class="res-tt-footer"><span>To Full</span><span>—</span></div>`;
        }
    }

    const resLabel = res.charAt(0).toUpperCase() + res.slice(1);
    let html = `<div class="res-tt-title">${resLabel}</div><div class="res-tt-cols">`;

    // Left column — income (green)
    html += `<div class="res-tt-col">`;
    html += `<div class="res-tt-col-head">Income</div>`;
    if (sources.length > 0) {
        for (const l of sources) {
            const perDay = l.perDay ? l.value : l.value * TICKS_PER_DAY;
            const valStr = perDay >= 1000 ? '+' + (perDay / 1000).toFixed(1) + 'k'
                         : perDay >= 10   ? '+' + perDay.toFixed(1)
                                          : '+' + perDay.toFixed(2);
            const rowCls = l.isBonus ? ' res-tt-bonus-row' : '';
            const subHtml = l.sub ? `<span class="res-tt-sub"> ${l.sub}</span>` : '';
            html += `<div class="res-tt-row${rowCls}"><span class="res-tt-label">${l.label}${subHtml}</span><span class="res-tt-val pos">${valStr}</span></div>`;
        }
    } else {
        html += `<div class="res-tt-none">—</div>`;
    }
    html += `</div>`;

    // Right column — consumption (red)
    html += `<div class="res-tt-col">`;
    html += `<div class="res-tt-col-head">Consumption</div>`;
    if (drains.length > 0) {
        for (const l of drains) {
            const perDay = l.perDay ? -l.value : -l.value * TICKS_PER_DAY;
            const valStr = perDay >= 1000 ? '-' + (perDay / 1000).toFixed(1) + 'k'
                         : perDay >= 10   ? '-' + perDay.toFixed(1)
                                          : '-' + perDay.toFixed(2);
            const subHtml = l.sub ? `<span class="res-tt-sub"> ${l.sub}</span>` : '';
            html += `<div class="res-tt-row"><span class="res-tt-label">${l.label}${subHtml}</span><span class="res-tt-val neg">${valStr}</span></div>`;
        }
    } else {
        html += `<div class="res-tt-none">—</div>`;
    }
    html += `</div>`;

    html += `</div>`; // .res-tt-cols
    html += toFullHTML;
    return html;
}

function _showResTooltip(rowEl, res) {
    if (!_resTooltipEl) return;
    _resTooltipRes = res;
    const html = _buildResTooltipHTML(res);
    if (!html) { _hideResTooltip(); return; }
    _resTooltipEl.innerHTML = html;
    _resTooltipEl.style.display = 'block';
    const rect  = rowEl.getBoundingClientRect();
    const ttW   = _resTooltipEl.offsetWidth || 360;
    const ttH   = _resTooltipEl.offsetHeight || 200;
    let left = rect.right + 8;
    let top  = rect.top;
    if (left + ttW > window.innerWidth - 8)  left = rect.left - ttW - 8;
    if (top  + ttH > window.innerHeight - 8) top  = window.innerHeight - ttH - 8;
    _resTooltipEl.style.top  = Math.max(4, top)  + 'px';
    _resTooltipEl.style.left = Math.max(4, left) + 'px';
}

function _hideResTooltip() {
    if (_resTooltipEl) _resTooltipEl.style.display = 'none';
    _resTooltipRes = null;
}

function _buildQuintessenceTooltipHTML() {
    const quintessence = gameState.meta.quintessence || 0;
    const bonusPct = (quintessence * 0.5).toFixed(1);
    return `<div class="res-tt-title">Quintessence</div>
<div class="res-tt-lore">The solidified will of a dungeon-mind that has lived and died before — carried forward through every binding and every deal. The devil did not give you this. It only ensured you kept it.</div>
<div class="res-tt-divider"></div>
<div class="res-tt-row"><span class="res-tt-label">Each Quintessence<span class="res-tt-sub"> resonance</span></span><span class="res-tt-val pos">+0.5% all production</span></div>
<div class="res-tt-row res-tt-total-row"><span class="res-tt-label">Total bonus<span class="res-tt-sub"> ${quintessence} × 0.5%</span></span><span class="res-tt-val pos">+${bonusPct}%</span></div>`;
}

function initResTooltips() {
    _resTooltipEl = document.getElementById('res-tooltip');
    document.querySelectorAll('[id^="res-row-"]').forEach(el => {
        const res = el.id.replace('res-row-', '');
        if (res === 'echoes') return; // handled separately below
        el.addEventListener('mouseenter', () => _showResTooltip(el, res));
        el.addEventListener('mouseleave', _hideResTooltip);
    });
    const echoRow = document.getElementById('res-row-quintessence');
    if (echoRow) {
        echoRow.addEventListener('mouseenter', () => {
            if (!_resTooltipEl) return;
            _resTooltipEl.innerHTML = _buildQuintessenceTooltipHTML();
            const rect = echoRow.getBoundingClientRect();
            _resTooltipEl.style.top  = rect.top + 'px';
            _resTooltipEl.style.left = (rect.right + 8) + 'px';
            _resTooltipEl.style.display = 'block';
        });
        echoRow.addEventListener('mouseleave', _hideResTooltip);
    }
}

// ── Gather action tooltips ────────────────────────────────────────────────────

let _gatherTooltipEl  = null;
let _gatherTooltipTmr = null;
let _gatherTooltipKey = null;
let _gatherMouseX     = 0;
let _gatherMouseY     = 0;

function _buildGatherTooltipHTML(key) {
    const action = GATHER_ACTIONS[key];
    if (!action) return '';
    const res = action.resource;
    const resLabel = res.charAt(0).toUpperCase() + res.slice(1);
    const raceData = RACE_DATA[gameState.run && gameState.run.race];
    const raceName = gameState.run && gameState.run.race;

    const rows = [];

    // Base yield
    rows.push({ label: 'Base yield', val: '+' + action.amount, cls: '' });

    // allGatherBonus from research
    for (const [rKey, rDef] of Object.entries(RESEARCH)) {
        if (!gameState.research || !gameState.research[rKey]) continue;
        const v = rDef.effects && rDef.effects.allGatherBonus;
        if (v) rows.push({ label: rDef.name, val: '+' + v, cls: 'pos', muted: true });
    }
    // gatherBonus (resource-specific) from research
    for (const [rKey, rDef] of Object.entries(RESEARCH)) {
        if (!gameState.research || !gameState.research[rKey]) continue;
        const gb = rDef.effects && rDef.effects.gatherBonus;
        if (gb && gb[res]) rows.push({ label: rDef.name, val: '+' + gb[res], cls: 'pos', muted: true });
    }

    // Race: allGatherBonus
    if (raceData && raceData.effects) {
        const raceAll = raceData.effects.allGatherBonus;
        if (raceAll) rows.push({ label: raceName + ' (race)', val: '+' + raceAll, cls: 'pos', muted: true });
        const raceSpec = raceData.effects.gatherBonus && raceData.effects.gatherBonus[res];
        if (raceSpec) rows.push({ label: raceName + ' (race)', val: '+' + raceSpec, cls: 'pos', muted: true });
    }

    // Biome mod bonus
    const modName = GATHER_MOD_BONUSES[res];
    if (modName && hasActiveMod(modName)) {
        rows.push({ label: modName + ' (biome)', val: '+1', cls: 'pos', muted: true });
    }

    const total = getGatherAmount(key);

    let html = `<div class="gather-tt-header">${action.label}</div>`;
    for (const r of rows) {
        html += `<div class="gather-tt-row">
            <span class="gather-tt-label${r.muted ? ' muted' : ''}">${r.label}</span>
            <span class="gather-tt-val${r.cls ? ' ' + r.cls : ''}">${r.val}</span>
        </div>`;
    }
    html += `<div class="gather-tt-total"><span>${resLabel} per click</span><span>+${total}</span></div>`;
    return html;
}

function _showGatherTooltip(key) {
    if (!_gatherTooltipEl) return;
    _gatherTooltipEl.innerHTML = _buildGatherTooltipHTML(key);
    _gatherTooltipEl.style.display = 'block';
    _positionGatherTooltip();
}

function _positionGatherTooltip() {
    if (!_gatherTooltipEl || _gatherTooltipEl.style.display === 'none') return;
    const tw = _gatherTooltipEl.offsetWidth;
    const th = _gatherTooltipEl.offsetHeight;
    let x = _gatherMouseX + 14;
    let y = _gatherMouseY - 8;
    if (x + tw > window.innerWidth - 8)  x = _gatherMouseX - tw - 10;
    if (y + th > window.innerHeight - 8) y = window.innerHeight - th - 8;
    _gatherTooltipEl.style.left = x + 'px';
    _gatherTooltipEl.style.top  = y + 'px';
}

function _hideGatherTooltip() {
    clearTimeout(_gatherTooltipTmr);
    _gatherTooltipTmr = null;
    _gatherTooltipKey = null;
    if (_gatherTooltipEl) _gatherTooltipEl.style.display = 'none';
}

function initGatherTooltips() {
    _gatherTooltipEl = document.getElementById('gather-tooltip');
    for (const key of Object.keys(GATHER_ACTIONS)) {
        const btn = document.getElementById('action-' + key);
        if (!btn) continue;
        btn.addEventListener('mousemove', e => {
            _gatherMouseX = e.clientX;
            _gatherMouseY = e.clientY;
            _gatherTooltipKey = key;
            clearTimeout(_gatherTooltipTmr);
            if (_gatherTooltipEl) _gatherTooltipEl.style.display = 'none';
            _gatherTooltipTmr = setTimeout(() => _showGatherTooltip(key), 1200);
        });
        btn.addEventListener('mouseleave', _hideGatherTooltip);
    }
}

// ── Building tooltips ─────────────────────────────────────────────────────────

function _fmtRate(n) {
    if (n >= 10)  return fmt(n);
    if (n >= 1)   return n.toFixed(1);
    return n.toFixed(2);
}

function _bldEffectRates(id, def) {
    const convMult = getResearchBonus('converterBonus', id);
    const allBonus = (1 + getResearchBonus('allProductionBonus')) * getQuintessenceProductionMult();
    if (def.production) {
        const bldgMult = getResearchBonus('productionBonus', id);
        const entries = Object.entries(def.production);
        const [, firstRate] = entries[0];
        const outputs = entries.map(([res, rate]) => ({ res, rate: _fmtRate(rate * TICKS_PER_DAY * bldgMult * allBonus) }));
        return { out: _fmtRate(firstRate * TICKS_PER_DAY * bldgMult * allBonus), outputs };
    }
    if (def.converts) {
        const inputRate = Object.values(def.converts.inputs)[0];
        return {
            in:  _fmtRate(inputRate * TICKS_PER_DAY),
            out: _fmtRate(def.converts.outputRate * convMult * TICKS_PER_DAY),
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
        if (id.startsWith('research-')) return;
        const def = ROOMS[id];
        if (!def) return;
        el.addEventListener('mouseenter', () => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildBldTooltipHTML(id, def);
            _bldTooltipEl.style.display = 'block';
        });
        el.addEventListener('mousemove', e => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildBldTooltipHTML(id, def);
            _positionBldTooltip(e);
        });
        el.addEventListener('mouseleave', () => { if (_bldTooltipEl) _bldTooltipEl.style.display = 'none'; });
    });

    // Expanded Awareness — not in ROOMS, wired up manually
    const eaBtn = document.getElementById('btn-expandedAwareness');
    if (eaBtn) {
        eaBtn.addEventListener('mouseenter', () => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildExpandedAwarenessTooltipHTML();
            _bldTooltipEl.style.display = 'block';
        });
        eaBtn.addEventListener('mousemove', e => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildExpandedAwarenessTooltipHTML();
            _positionBldTooltip(e);
        });
        eaBtn.addEventListener('mouseleave', () => { if (_bldTooltipEl) _bldTooltipEl.style.display = 'none'; });
    }
}

function _buildExpandedAwarenessTooltipHTML() {
    const bonus = getReservoirBonus();
    const cost  = getReservoirUpgradeCost();
    const canAfford = (gameState.resources.essence || 0) >= cost;
    return `<div class="bld-tt-name">Expanded Awareness</div>` +
        `<div class="bld-tt-effect">Deepen your mental capacity, increasing the storage cap of all Anima, Influence, and Mana reservoirs by +10 each.</div>` +
        `<div class="bld-tt-effect">Each reservoir building currently grants +${bonus} capacity.</div>` +
        `<div class="bld-tt-divider"></div>` +
        `<div class="bld-tt-line${canAfford ? '' : ' bld-tt-cant-afford'}">Anima: ${fmt(cost)}</div>` +
        `<div class="bld-tt-flavor">The mind is not a vessel with fixed walls. It is a space you learn to widen.</div>`;
}

function _positionBldTooltip(e) {
    const tipW = _bldTooltipEl.offsetWidth || 280;
    const tipH = _bldTooltipEl.offsetHeight;
    const left = e.clientX + 14 + tipW > window.innerWidth  ? e.clientX - tipW - 14 : e.clientX + 14;
    const top  = e.clientY + 14 + tipH > window.innerHeight ? e.clientY - tipH - 8  : e.clientY + 14;
    _bldTooltipEl.style.left = left + 'px';
    _bldTooltipEl.style.top  = top  + 'px';
}

function _buildBldTooltipHTML(id, def) {
    let html = `<div class="bld-tt-name">${def.name}</div>`;

    // Description / effect lines (tinted color)
    if (def.desc) html += `<div class="bld-tt-effect">${def.desc}</div>`;

    if (def.effect) {
        html += `<div class="bld-tt-effect">${def.effect(_bldEffectRates(id, def), id)}</div>`;
    } else {
        const r = _bldEffectRates(id, def);
        if (def.production) {
            for (const { res, rate } of r.outputs) {
                const rname = (RESOURCES[res] && RESOURCES[res].name) || (res.charAt(0).toUpperCase() + res.slice(1));
                html += `<div class="bld-tt-effect">Produces ${rate} ${rname}</div>`;
            }
        }
        if (def.converts) {
            const outRes  = def.converts.output;
            const outName = (RESOURCES[outRes] && RESOURCES[outRes].name) || outRes;
            html += `<div class="bld-tt-effect">Produces ${r.out} ${outName}</div>`;
            for (const [inRes, inRate] of Object.entries(def.converts.inputs)) {
                const inName = (RESOURCES[inRes] && RESOURCES[inRes].name) || (inRes.charAt(0).toUpperCase() + inRes.slice(1));
                html += `<div class="bld-tt-consume">Consumes ${_fmtRate(inRate * TICKS_PER_DAY)} ${inName}</div>`;
            }
        }
        if (def.housingBonus) html += `<div class="bld-tt-effect">+${def.housingBonus} Max Citizens</div>`;
        if (def.jobs) {
            const wn = def.workerName || 'Worker';
            html += `<div class="bld-tt-effect">+${def.jobs} max ${wn}</div>`;
        }
        if (!def.production && !def.converts && !def.housingBonus && !def.jobs && r.cap) {
            html += `<div class="bld-tt-effect">+${r.cap} to all material storage</div>`;
        }
    }

    // Cost section with visual separator
    const costs = getBuildCost(id);
    const hasCost = def.coinCost || Object.keys(costs).length > 0;
    if (hasCost) html += `<div class="bld-tt-divider"></div>`;
    if (def.coinCost) {
        const bldCount = gameState.buildings[id] || 0;
        const coinFree = def.coinFreeBelow != null && bldCount < def.coinFreeBelow;
        if (coinFree) {
            html += `<div class="bld-tt-line" style="text-decoration:line-through;opacity:0.5">${formatCoins(getEffectiveBuildingCoinCost(def.coinCost, id))}</div>`;
            html += `<div class="bld-tt-line" style="color:var(--accent);font-size:10px">Free (${bldCount + 1}/${def.coinFreeBelow})</div>`;
        } else {
            const coinCost = getEffectiveBuildingCoinCost(def.coinCost, id);
            const canAffordCoins = (gameState.resources.coins || 0) >= coinCost;
            html += `<div class="bld-tt-line${canAffordCoins ? '' : ' bld-tt-cant-afford'}">${formatCoins(coinCost)}</div>`;
        }
    }
    for (const [res, amt] of Object.entries(costs)) {
        const rname = (RESOURCES[res] && RESOURCES[res].name) || (res.charAt(0).toUpperCase() + res.slice(1));
        const canAffordRes = (gameState.resources[res] || 0) >= amt;
        html += `<div class="bld-tt-line${canAffordRes ? '' : ' bld-tt-cant-afford'}">${rname}: ${fmt(amt)}</div>`;
    }

    if (def.flavor) html += `<div class="bld-tt-flavor">${def.flavor}</div>`;

    // Idle-worker warning: only for job buildings with production and a declining output
    if (def.jobs && def.production) {
        const bldCount = gameState.buildings[id] || 0;
        if (bldCount > 0) {
            const slots       = bldCount * def.jobs;
            const assigned    = (gameState.workerAssignments || {})[id] || 0;
            const idleWorkers = gameState.population.count - getEmployed();
            if (slots - assigned > 0 && idleWorkers > 0) {
                const deltas    = gameState.lastTickDeltas || {};
                const outputNeg = Object.keys(def.production).some(res => (deltas[res] || 0) < 0);
                if (outputNeg) {
                    html += `<div class="bld-tt-warning">⚠ Output declining — idle workers can be assigned here</div>`;
                }
            }
        }
    }

    return html;
}

function initResearchTooltips() {
    document.querySelectorAll('[id^="btn-research-"]').forEach(el => {
        const key = el.id.replace('btn-research-', '');
        const def = RESEARCH[key];
        if (!def) return;
        el.addEventListener('mouseenter', () => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildResearchTooltipHTML(key, def);
            _bldTooltipEl.style.display = 'block';
        });
        el.addEventListener('mousemove', e => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildResearchTooltipHTML(key, def);
            _positionBldTooltip(e);
        });
        el.addEventListener('mouseleave', () => { if (_bldTooltipEl) _bldTooltipEl.style.display = 'none'; });
    });
}

function switchResearchTab(tab) {
    document.querySelectorAll('.research-sub-tab-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.tab === tab);
    });
    const available = document.getElementById('research-panel-available');
    const completed = document.getElementById('research-panel-completed');
    if (available) available.style.display = tab === 'available' ? '' : 'none';
    if (completed) completed.style.display = tab === 'completed' ? '' : 'none';
    if (tab === 'completed') renderCompletedResearch();
}

function renderCompletedResearch() {
    const grid = document.getElementById('completed-research-grid');
    if (!grid) return;
    const done = gameState.research || {};
    const keys = Object.keys(done).filter(k => done[k]);
    if (!keys.length) {
        grid.innerHTML = '<div class="completed-empty">No research completed yet.</div>';
        return;
    }
    grid.innerHTML = keys.map(key => {
        const def = RESEARCH[key];
        if (!def) return '';
        return `<span class="completed-pill" data-rkey="${key}">${def.name}</span>`;
    }).join('');

    grid.querySelectorAll('.completed-pill').forEach(el => {
        const key = el.dataset.rkey;
        const def = RESEARCH[key];
        if (!def) return;
        el.addEventListener('mouseenter', () => {
            if (!_bldTooltipEl) return;
            _bldTooltipEl.innerHTML = _buildResearchTooltipHTML(key, def);
            _bldTooltipEl.style.display = 'block';
        });
        el.addEventListener('mousemove', e => {
            if (!_bldTooltipEl) return;
            _positionBldTooltip(e);
        });
        el.addEventListener('mouseleave', () => { if (_bldTooltipEl) _bldTooltipEl.style.display = 'none'; });
    });
}

function _researchCostLine(key, def) {
    const parts = [];
    if (def.cost) {
        for (const [res, amt] of Object.entries(def.cost)) {
            const rname = (RESOURCES[res] && RESOURCES[res].name) || (res.charAt(0).toUpperCase() + res.slice(1));
            const canAfford = (gameState.resources[res] || 0) >= amt;
            parts.push(`<span${canAfford ? '' : ' class="research-cost-lacking"'}>${fmt(amt)} ${rname}</span>`);
        }
    }
    let html = "Cost: " + parts.join(", ");
    if (def.requiresBuildings) {
        const reqs = Object.entries(def.requiresBuildings).map(([b, n]) => {
            const bname = (ROOMS[b] && ROOMS[b].name) || b;
            const met = (gameState.buildings[b] || 0) >= n;
            return `<span${met ? '' : ' class="research-cost-lacking"'}>${n} ${bname}</span>`;
        });
        html += ` &nbsp;·&nbsp; Requires: ${reqs.join(', ')}`;
    }
    return html;
}

function _buildResearchTooltipHTML(key, def) {
    const done = !!(gameState.research && gameState.research[key]);
    let html = `<div class="bld-tt-name">${def.name}${done ? ' ✓' : ''}</div>`;

    if (def.desc) html += `<div class="bld-tt-line">${def.desc}</div>`;

    if (def.cost) {
        for (const [res, amt] of Object.entries(def.cost)) {
            const rname = (RESOURCES[res] && RESOURCES[res].name) || (res.charAt(0).toUpperCase() + res.slice(1));
            const canAfford = (gameState.resources[res] || 0) >= amt;
            html += `<div class="bld-tt-line${canAfford ? '' : ' bld-tt-cant-afford'}">${rname}: ${fmt(amt)}</div>`;
        }
    }
    if (def.requiresBuildings) {
        for (const [b, n] of Object.entries(def.requiresBuildings)) {
            const bname = (ROOMS[b] && ROOMS[b].name) || b;
            const met = (gameState.buildings[b] || 0) >= n;
            html += `<div class="bld-tt-line${met ? '' : ' bld-tt-cant-afford'}">Requires: ${n} ${bname}</div>`;
        }
    }

    const effectLines = _researchEffectLines(def.effects);
    if (effectLines.length) {
        html += `<div class="bld-tt-flavor">${effectLines.join(' · ')}</div>`;
    }

    return html;
}

function _researchEffectLines(effects) {
    const lines = [];
    if (!effects) return lines;
    if (effects.taxBonus)           lines.push(`+${effects.taxBonus} cp/creature/day`);
    if (effects.allGatherBonus)     lines.push(`+${effects.allGatherBonus} to all gathering`);
    if (effects.allProductionBonus) lines.push(`+${Math.round(effects.allProductionBonus * 100)}% all production`);
    if (effects.foodConsumption)    lines.push(`${Math.round((1 - effects.foodConsumption) * 100)}% less food consumption`);
    if (effects.gatherBonus) {
        for (const [res, amt] of Object.entries(effects.gatherBonus)) {
            const n = (RESOURCES[res] && RESOURCES[res].name) || (res.charAt(0).toUpperCase() + res.slice(1));
            lines.push(`+${amt} ${n} gather`);
        }
    }
    if (effects.productionBonus) {
        for (const [bld, mult] of Object.entries(effects.productionBonus)) {
            const n = ROOMS[bld] ? ROOMS[bld].name : bld;
            lines.push(`+${Math.round((mult - 1) * 100)}% ${n}`);
        }
    }
    if (effects.converterBonus) {
        for (const [bld, mult] of Object.entries(effects.converterBonus)) {
            const n = ROOMS[bld] ? ROOMS[bld].name : bld;
            lines.push(`+${Math.round((mult - 1) * 100)}% ${n} output`);
        }
    }
    if (effects.capBonus) {
        for (const [res, amt] of Object.entries(effects.capBonus)) {
            const n = (RESOURCES[res] && RESOURCES[res].name) || (res.charAt(0).toUpperCase() + res.slice(1));
            lines.push(`+${amt} ${n} cap`);
        }
    }
    if (effects.housingBonus) {
        for (const [bld, amt] of Object.entries(effects.housingBonus)) {
            const n = ROOMS[bld] ? ROOMS[bld].name : bld;
            lines.push(`+${amt} housing (${n})`);
        }
    }
    if (effects.unlockBuildings && effects.unlockBuildings.length) {
        const names = effects.unlockBuildings.map(k => ROOMS[k] ? ROOMS[k].name : k);
        lines.push(`Unlocks: ${names.join(', ')}`);
    }
    return lines;
}

let _settingsTipEl = null;
let _settingsTipTimer = null;

function initSettingsTooltips() {
    _settingsTipEl = document.getElementById('settings-tooltip');

    // Delegated listeners so dynamically-generated [data-stip] elements work too
    document.addEventListener('mouseenter', e => {
        const el = e.target.closest('[data-stip]');
        if (!el) return;
        clearTimeout(_settingsTipTimer);
        _settingsTipTimer = setTimeout(() => {
            if (!_settingsTipEl) return;
            _settingsTipEl.textContent = el.dataset.stip;
            _settingsTipEl.style.display = 'block';
            _positionSettingsTip(e);
        }, 1500);
    }, true);

    document.addEventListener('mousemove', e => {
        if (_settingsTipEl && _settingsTipEl.style.display === 'block') {
            _positionSettingsTip(e);
        }
    }, true);

    document.addEventListener('mouseleave', e => {
        if (!e.target.closest('[data-stip]')) return;
        clearTimeout(_settingsTipTimer);
        if (_settingsTipEl) _settingsTipEl.style.display = 'none';
    }, true);
}

function _positionSettingsTip(e) {
    const tipW = _settingsTipEl.offsetWidth || 240;
    const tipH = _settingsTipEl.offsetHeight || 60;
    const left = e.clientX + 14 + tipW > window.innerWidth ? e.clientX - tipW - 14 : e.clientX + 14;
    const top  = e.clientY + 14 + tipH > window.innerHeight ? e.clientY - tipH - 8 : e.clientY + 14;
    _settingsTipEl.style.left = Math.max(4, left) + 'px';
    _settingsTipEl.style.top  = Math.max(4, top)  + 'px';
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
    // ironFittings adds +15 on top; race storageBonus further adds to the per-building amount
    const r2 = gameState.research || {};
    const raceData2    = RACE_DATA[gameState.run && gameState.run.race];
    const raceStorage  = (raceData2 && raceData2.effects && raceData2.effects.storageBonus) || 0;
    const storageBonus = (r2.reinforcedShelving ? 75 : 50) + (r2.ironFittings ? 15 : 0) + raceStorage;
    const n = gameState.buildings.storage || 0;
    if (n > 0) {
        for (const res of Object.keys(BASE_CAPS)) {
            if (res === 'lore') continue; // lore cap is set separately below
            caps[res] += storageBonus * n;
        }
    }
    // Lore cap: base 500 + 50 per Scriptorium, plus any capBonus from research
    caps.lore = 500 + (gameState.buildings.scriptorium || 0) * 50
              + getResearchBonus('capBonus', 'lore');
    // Coin cap scales with currency tier; ironLockbox adds 50,000 cp; thievesGuild adds 25,000 cp; racial coinCapBonus applies
    const baseCoinCap = r2.goldStandard ? COIN_CAP_GP : r2.silverCurrency ? COIN_CAP_SP : COIN_CAP_CP;
    const raceEffects = (RACE_DATA[gameState.run && gameState.run.race] || {}).effects || {};
    const raceCCB = raceEffects.coinCapBonus || {};
    const raceCoinBonus = (raceCCB.flat || 0) + Math.floor(baseCoinCap * (raceCCB.pct || 0));
    caps.coins = baseCoinCap
        + (r2.ironLockbox   ? 50000 : 0)
        + (r2.thievesGuild  ? 25000 : 0)
        + raceCoinBonus;
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
    const r   = gameState.research || {};
    const out = {};
    let scale = def.costScale || 1.2;
    if (r.communalArchitecture && id === 'lair') scale = Math.max(1.01, scale - 0.02);
    const guildDiscount = r.guildCharter && GUILD_DISCOUNT_BUILDINGS.has(id);
    let matReduction = 0;
    if (r.prototypeTools)   matReduction += 0.05;
    if (r.blueprintLibrary) matReduction += 0.07;
    if (r.masterCraft)      matReduction += 0.08;
    for (const [res, base] of Object.entries(def.cost)) {
        let cost = Math.floor(base * Math.pow(scale, n));
        if (guildDiscount) cost = Math.floor(cost * 0.85);
        let resReduction = matReduction;
        if (res === 'wood'  && r.prefabTimber)    resReduction += 0.10;
        if (res === 'stone' && r.stockpiledStone) resReduction += 0.10;
        if (resReduction > 0) cost = Math.floor(cost * Math.max(0.05, 1 - resReduction));
        out[res] = cost;
    }
    return out;
}

function getEffectiveBuildingCoinCost(coinBase, id) {
    if (!coinBase) return 0;
    const r = gameState.research || {};
    const def = id ? ROOMS[id] : null;
    const scale = def?.costScale || 1.2;
    const n = id ? (gameState.buildings[id] || 0) : 0;
    const scaled = Math.floor(coinBase * Math.pow(scale, n));
    let reduction = 0;
    if (r.masterCraft) reduction += 0.10;
    if (r.silkRope)    reduction += 0.05;
    const reduced = reduction > 0 ? Math.floor(scaled * Math.max(0.05, 1 - reduction)) : scaled;
    return effectiveCoinCost(reduced);
}

function canAfford(id) {
    for (const [res, amount] of Object.entries(getBuildCost(id))) {
        if ((gameState.resources[res] || 0) < amount) return false;
    }
    const def = ROOMS[id];
    if (def.coinCost) {
        const bldCount = gameState.buildings[id] || 0;
        const coinFree = def.coinFreeBelow != null && bldCount < def.coinFreeBelow;
        if (!coinFree && (gameState.resources.coins || 0) < getEffectiveBuildingCoinCost(def.coinCost, id)) return false;
    }
    return true;
}

// ── Actions ───────────────────────────────────────────────────────────────────

// ── Click-modifier (Ctrl=×10, Shift=×25, Alt=×100) ───────────────────────────
let _clickMult = 1;
document.addEventListener('mousedown', e => {
    if (e.altKey)        _clickMult = 100;
    else if (e.shiftKey) _clickMult = 25;
    else if (e.ctrlKey)  _clickMult = 10;
    else                 _clickMult = 1;
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
            const bldCount = (gameState.buildings[id] || 0);
            const coinFree = def.coinFreeBelow != null && bldCount < def.coinFreeBelow;
            if (!coinFree) {
                gameState.resources.coins = Math.max(0, (gameState.resources.coins || 0) - getEffectiveBuildingCoinCost(def.coinCost, id));
            }
        }
        gameState.buildings[id] = (gameState.buildings[id] || 0) + 1;
        bought++;
    }
    if (bought === 0) return;
    gameState.stats.buildingsConstructed = (gameState.stats.buildingsConstructed || 0) + bought;
    updateUI();
    saveGame();
}

// Adjusts how many units of a building are paused (production+consumption skipped),
// one at a time. Lets players dial down an overbuilt converter without losing units.
function adjustBuildingPaused(id, delta, event) {
    if (event) event.stopPropagation();
    if (!gameState.buildingDisabled) gameState.buildingDisabled = {};
    const count   = gameState.buildings[id] || 0;
    const current = gameState.buildingDisabled[id] || 0;
    const next    = Math.max(0, Math.min(count, current + delta));
    if (next === 0) delete gameState.buildingDisabled[id];
    else gameState.buildingDisabled[id] = next;
    updateUI();
    saveGame();
}

// ── Trade system ──────────────────────────────────────────────────────────────

function getTradeCapacity() {
    if (!(gameState.buildings.marketStall > 0)) return 0;
    return 5 + (gameState.buildings.tradeCart || 0) * 2;
}

// Total route-units committed across all resources (abs value of each signed count).
function getUsedTradeCapacity() {
    const routes = gameState.tradeRoutes || {};
    let used = 0;
    for (const res of Object.keys(routes)) used += Math.abs(routes[res] || 0);
    return used;
}

// Sets a resource's signed route count directly (positive = sell N/day, negative = buy N/day),
// clamped so total committed routes never exceed capacity.
function setTradeRouteCount(resource, count) {
    if (!TRADE_RATES[resource]) return;
    if (!gameState.tradeRoutes) gameState.tradeRoutes = {};
    const capacity   = getTradeCapacity();
    const current    = gameState.tradeRoutes[resource] || 0;
    const usedByRest = getUsedTradeCapacity() - Math.abs(current);
    const maxAbs     = Math.max(0, capacity - usedByRest);
    const clamped    = Math.max(-maxAbs, Math.min(maxAbs, count));
    if (clamped === 0) delete gameState.tradeRoutes[resource];
    else gameState.tradeRoutes[resource] = clamped;
    renderTradeTab();
    saveGame();
}

function adjustTradeRoute(resource, dir) {
    const current = (gameState.tradeRoutes && gameState.tradeRoutes[resource]) || 0;
    setTradeRouteCount(resource, current + dir);
}

function setTradeRouteInput(resource, rawValue) {
    const n = parseInt(rawValue, 10);
    setTradeRouteCount(resource, isNaN(n) ? 0 : n);
}

// Sells the maximum number of routes this resource's remaining capacity allows.
function setTradeRouteSellMax(resource) {
    const routes     = gameState.tradeRoutes || {};
    const current    = routes[resource] || 0;
    const usedByRest = getUsedTradeCapacity() - Math.abs(current);
    const maxAbs     = Math.max(0, getTradeCapacity() - usedByRest);
    setTradeRouteCount(resource, -maxAbs);
}

// Buys the maximum number of routes this resource's remaining capacity allows.
function setTradeRouteBuyMax(resource) {
    const routes     = gameState.tradeRoutes || {};
    const current    = routes[resource] || 0;
    const usedByRest = getUsedTradeCapacity() - Math.abs(current);
    const maxAbs     = Math.max(0, getTradeCapacity() - usedByRest);
    setTradeRouteCount(resource, maxAbs);
}

function renderTradeTab() {
    const container = document.getElementById('trade-routes');
    if (!container) return;
    const capacity = getTradeCapacity();
    if (!gameState.tradeRoutes) gameState.tradeRoutes = {};
    const routes = gameState.tradeRoutes;
    const fencedBonus = (gameState.research && gameState.research.fencedGoods) ? 1.5 : 1;
    const activeCount = getUsedTradeCapacity();

    const hdr = document.getElementById('trade-capacity-display');
    if (hdr) hdr.textContent = `${activeCount} / ${capacity} routes active`;

    const cartCount = gameState.buildings.tradeCart || 0;
    const cartHdr = document.getElementById('trade-cart-display');
    if (cartHdr) cartHdr.textContent = cartCount > 0
        ? `${gameState.buildings.marketStall} Market Stall${gameState.buildings.marketStall !== 1 ? 's' : ''} · ${cartCount} Trade Cart${cartCount !== 1 ? 's' : ''} (+${cartCount * 2} slots)`
        : `${gameState.buildings.marketStall} Market Stall${gameState.buildings.marketStall !== 1 ? 's' : ''} · 5 base slots`;

    if (capacity === 0) {
        container.innerHTML = '<div class="trade-empty">Build a Market Stall (requires Taxation research + 2 Farms) to unlock trade routes.</div>';
        return;
    }

    const tradeableResources = Object.keys(TRADE_RATES).filter(shouldShowResource);

    if (!tradeableResources.length) {
        container.innerHTML = '<div class="trade-empty">No tradeable resources unlocked yet.</div>';
        return;
    }

    // Rebuild the row list only if the set of resources shown has changed (e.g. a new
    // resource unlocked); otherwise update existing rows in place so a focused input
    // (mid-typing) isn't clobbered by an innerHTML rebuild.
    const existingIds = Array.from(container.children).map(el => el.id);
    const wantedIds   = tradeableResources.map(res => 'trow-' + res);
    const structureChanged = existingIds.length !== wantedIds.length
        || existingIds.some((id, i) => id !== wantedIds[i]);

    if (structureChanged) {
        let html = '';
        for (const res of tradeableResources) {
            html += `<div class="worker-row" id="trow-${res}">
                <div class="worker-left">
                    <span class="worker-name">${(RESOURCES[res] && RESOURCES[res].name) || res}</span>
                    <span class="worker-sub" id="tsub-${res}"></span>
                </div>
                <div class="worker-controls">
                    <span class="trade-dir-col" id="tdir-${res}"></span>
                    <button class="wbtn wbtn-mm" onclick="setTradeRouteSellMax('${res}')" title="Sell max">&#9664;&#9664;</button>
                    <button class="wbtn" onclick="adjustTradeRoute('${res}', -1)" title="Decrease (sell more)">&#9664;</button>
                    <input  class="winput" type="number" id="tinput-${res}" oninput="setTradeRouteInput('${res}', this.value)">
                    <button class="wbtn" onclick="adjustTradeRoute('${res}', 1)" title="Increase (buy more)">&#9654;</button>
                    <button class="wbtn wbtn-mm" onclick="setTradeRouteBuyMax('${res}')" title="Buy max">&#9654;&#9654;</button>
                </div>
            </div>`;
        }
        container.innerHTML = html;
    }

    for (const res of tradeableResources) {
        const rate  = TRADE_RATES[res] || 0;
        const count = routes[res] || 0;
        const usedByRest = activeCount - Math.abs(count);
        const maxAbs = Math.max(0, capacity - usedByRest);

        let sub, dir;
        if (count < 0) {
            const amount = -count * TRADE_AMOUNT;
            const income = Math.floor(amount * rate * fencedBonus);
            sub = `${amount}/day &rarr; +${formatCoins(income)}/day`;
            dir = `<span class="trade-dir trade-sell">SELL</span>`;
        } else if (count > 0) {
            const amount = count * TRADE_AMOUNT;
            const spend  = amount * rate * 2;
            sub = `${formatCoins(spend)}/day &larr; +${amount}/day`;
            dir = `<span class="trade-dir trade-buy">BUY</span>`;
        } else {
            sub = `Inactive (${rate} cp/unit)`;
            dir = '';
        }

        const subEl = document.getElementById('tsub-' + res);
        if (subEl) subEl.innerHTML = sub;

        const dirEl = document.getElementById('tdir-' + res);
        if (dirEl) dirEl.innerHTML = dir;

        const inputEl = document.getElementById('tinput-' + res);
        if (inputEl) {
            inputEl.min = -maxAbs;
            inputEl.max = maxAbs;
            if (document.activeElement !== inputEl) inputEl.value = count;
        }
    }
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
        const activeFrac = getActiveBuildingFraction(id);
        if (activeFrac === 0) continue;
        // Worker buildings need assigned workers; others run automatically per building
        const w = (def.jobs ? (workers2[id] || 0) : count) * activeFrac;
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
        // Trade Caravans: 10 cp/day if both cloth and potions are at or above 75% of their cap
        if (gameState.research && gameState.research.tradeGoods) {
            const caps = getCaps();
            const clothOk = (gameState.resources.cloth || 0) >= (caps.cloth || 0) * 0.75;
            const potionsOk = (gameState.resources.potions || 0) >= (caps.potions || 0) * 0.75;
            if (clothOk && potionsOk) {
                gameState.resources.coins = (gameState.resources.coins || 0) + 10;
            }
        }
        // Market Stall: 5 cp per assigned Merchant per day
        const stallWorkers = (gameState.workerAssignments && gameState.workerAssignments.marketStall) || 0;
        if (stallWorkers > 0) {
            gameState.resources.coins = (gameState.resources.coins || 0) + stallWorkers * 5;
        }
        // Trade routes: each resource's signed route count executes once per day
        if (gameState.tradeRoutes) {
            const fencedBonus = (gameState.research && gameState.research.fencedGoods) ? 1.5 : 1;
            for (const res of Object.keys(gameState.tradeRoutes)) {
                const count = gameState.tradeRoutes[res] || 0;
                if (count === 0 || !TRADE_RATES[res]) continue;
                const rate = TRADE_RATES[res];
                if (count < 0) {
                    const toSell = Math.min(TRADE_AMOUNT * -count, gameState.resources[res] || 0);
                    if (toSell > 0) {
                        gameState.resources[res] -= toSell;
                        gameState.resources.coins = (gameState.resources.coins || 0) + Math.floor(toSell * rate * fencedBonus);
                    }
                } else {
                    const amount   = TRADE_AMOUNT * count;
                    const coinCost = amount * rate * 2;
                    if ((gameState.resources.coins || 0) >= coinCost) {
                        gameState.resources.coins -= coinCost;
                        gameState.resources[res] = (gameState.resources[res] || 0) + amount;
                    }
                }
            }
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
        maybeFireRandomEvent();
        if (gameState.time.day % DAYS_PER_SEASON === 1 && gameState.time.day !== 1) {
            flashEl('season');
        }
    }

    // Snapshot unclamped values before clamping so the rate display shows the true
    // net rate even when a resource is pinned at 0 or at cap.
    const _preClamp = {};
    for (const k of Object.keys(gameState.resources)) _preClamp[k] = gameState.resources[k] || 0;

    // Final clamp — applied once after all production and consumption so resources
    // can fill to cap even when consumption is non-zero within the same tick
    for (const res of Object.keys(caps)) {
        if (gameState.resources[res] !== undefined) {
            gameState.resources[res] = Math.max(0, Math.min(gameState.resources[res], caps[res]));
        }
    }

    // Record true per-tick deltas for the rate display (use pre-clamp values so
    // negative rates remain visible when the resource is pinned at 0). Positive
    // deltas are zeroed once the resource is actually capped post-clamp, since
    // nothing is being stored anymore even though gross production is non-zero.
    const deltas = {};
    for (const k of Object.keys(gameState.resources)) {
        let d = (_preClamp[k] || 0) - (_preSnap[k] || 0);
        const cap = caps[k];
        if (d > 0 && cap !== undefined && gameState.resources[k] >= cap) d = 0;
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

function getCoinsDailyRate() {
    let net = 0;
    const taxRate = getResearchBonus('taxBonus');
    if (taxRate > 0) net += gameState.population.count * taxRate;
    if (gameState.research && gameState.research.tradeGoods) {
        const caps = getCaps();
        const clothOk   = (gameState.resources.cloth   || 0) >= (caps.cloth   || 0) * 0.75;
        const potionsOk = (gameState.resources.potions || 0) >= (caps.potions || 0) * 0.75;
        if (clothOk && potionsOk) net += 10;
    }
    const stallWorkers = (gameState.workerAssignments && gameState.workerAssignments.marketStall) || 0;
    if (stallWorkers > 0) net += stallWorkers * 5;
    if (gameState.tradeRoutes) {
        const fencedBonus = (gameState.research && gameState.research.fencedGoods) ? 1.5 : 1;
        for (const res of Object.keys(gameState.tradeRoutes)) {
            const count = gameState.tradeRoutes[res] || 0;
            if (count === 0 || !TRADE_RATES[res]) continue;
            const rate = TRADE_RATES[res];
            if (count < 0) {
                net += Math.floor(TRADE_AMOUNT * -count * rate * fencedBonus);
            } else {
                net -= TRADE_AMOUNT * count * rate * 2;
            }
        }
    }
    return net;
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
    // Re-render the trade tab when it's active so rates and capacities stay current
    const _activeTabBtn = document.querySelector('.tab-btn.active');
    if (_activeTabBtn && _activeTabBtn.dataset.tab === 'trade') renderTradeTab();
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
    setText("popCount",  Math.floor(pop.count));
    setText("popMax",    housing);
    const popRow = document.getElementById("pop-row");
    if (popRow) popRow.classList.toggle("starving", isStarving);

    // Coins (now in Population section)
    const coinsNow = gameState.resources.coins || 0;
    setText("coinsDisplay", formatCoinsCompact(coinsNow));
    setText("coinsCap",     formatCoinsCompact(caps.coins));
    const coinsDisplayEl = document.getElementById("coinsDisplay");
    if (coinsDisplayEl) coinsDisplayEl.title = formatCoins(coinsNow);
    const coinsCapEl = document.getElementById("coinsCap");
    if (coinsCapEl) coinsCapEl.title = formatCoins(caps.coins);
    const coinsRateEl = document.getElementById("coinsRate");
    if (coinsRateEl) {
        const dailyNet = getCoinsDailyRate();
        if (dailyNet === 0) {
            coinsRateEl.style.display = "none";
        } else {
            const sign = dailyNet > 0 ? "+" : "-";
            coinsRateEl.title = sign + formatCoins(Math.abs(dailyNet)) + "/day";
            coinsRateEl.textContent = sign + formatCoinsCompact(Math.abs(dailyNet)) + "/day";
            coinsRateEl.style.display = "";
            coinsRateEl.style.color = dailyNet < 0 ? "var(--disabled)" : "var(--enabled)";
        }
    }

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
            rateEl.textContent   = netRate === 0 ? '+0' : fmtRate(netRate);
            rateEl.style.display = "";
            rateEl.style.color   = netRate < 0 ? "var(--disabled)" : "var(--enabled)";
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
        // Pause stepper for production/converter buildings — lets players idle some
        // units of an overbuilt building without demolishing them. Hidden until hover.
        if (btn && (def.production || def.converts) && count > 0) {
            let stepperEl = btn.querySelector(".btn-pause-stepper");
            if (!stepperEl) {
                stepperEl = document.createElement("div");
                stepperEl.className = "btn-pause-stepper";
                stepperEl.innerHTML =
                    '<span class="pause-step pause-step-minus">−</span>' +
                    '<span class="pause-count"></span>' +
                    '<span class="pause-step pause-step-plus">+</span>';
                stepperEl.querySelector(".pause-step-minus").onclick = (e) => adjustBuildingPaused(id, -1, e);
                stepperEl.querySelector(".pause-step-plus").onclick  = (e) => adjustBuildingPaused(id, 1, e);
                btn.appendChild(stepperEl);
            }
            const paused = (gameState.buildingDisabled && gameState.buildingDisabled[id]) || 0;
            stepperEl.querySelector(".pause-count").textContent = paused + " / " + count + " idle";
            stepperEl.title = "Idle units skip production and consumption";
            stepperEl.querySelector(".pause-step-minus").classList.toggle("at-limit", paused <= 0);
            stepperEl.querySelector(".pause-step-plus").classList.toggle("at-limit", paused >= count);
            btn.classList.toggle("building-paused", paused > 0);
        } else if (btn) {
            const stepperEl = btn.querySelector(".btn-pause-stepper");
            if (stepperEl) stepperEl.remove();
            btn.classList.remove("building-paused");
        }
        const countEl = document.getElementById(id + "Count");
        if (countEl) {
            countEl.textContent = count;
        }
        const costEl = document.getElementById(id + "Cost");
        if (costEl) {
            const cost = getBuildCost(id);
            let costStr = Object.entries(cost)
                .map(([res, n]) => `${fmt(n)} ${RESOURCES[res]?.name || res}`)
                .join(", ");
            if (def.coinCost) {
                const bldCount = gameState.buildings[id] || 0;
                const coinFree = def.coinFreeBelow != null && bldCount < def.coinFreeBelow;
                if (!coinFree) costStr += (costStr ? ", " : "") + formatCoins(getEffectiveBuildingCoinCost(def.coinCost, id));
            }
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
        if (costEl) costEl.textContent = `${getReservoirUpgradeCost()} Anima`;
    }

    // Era 1 section labels
    {
        const storageVisible = ['essenceReservoir', 'influenceShrine', 'manaFont']
            .some(id => { const b = document.getElementById('btn-' + id); return b && b.style.display !== 'none'; });
        const storageLabel = document.getElementById('era1-label-storage');
        if (storageLabel) storageLabel.style.display = storageVisible ? '' : 'none';

        const runeBtn = document.getElementById('btn-runeObelisk');
        const eaBtn   = document.getElementById('btn-expandedAwareness');
        const upgradesVisible = (runeBtn && runeBtn.style.display !== 'none')
                             || (eaBtn   && eaBtn.style.display   !== 'none');
        const upgradesLabel = document.getElementById('era1-label-upgrades');
        if (upgradesLabel) upgradesLabel.style.display = upgradesVisible ? '' : 'none';
    }

    // Era 2 building section labels — hide header if no buttons in that category are visible
    {
        const era2Sections = {
            'era2-label-countryside': ['farm', 'lumber', 'quarry'],
            'era2-label-warren':      ['lair', 'house', 'apartment'],
            'era2-label-craftsmen':   ['smelter', 'kiln', 'loom', 'alchemyLab', 'forge', 'arcaneGrinder', 'arcaneBench'],
            'era2-label-merchant':    ['storage', 'marketStall', 'tradeCart'],
            'era2-label-arcane':      ['mageTower', 'scriptorium'],
            'era2-label-war':         ['armory'],
            'era2-label-extraction':  ['mine', 'coalSeam', 'crystalSeam', 'sulphurVent', 'herbalistDen', 'huntingLodge', 'clayPit', 'ritualCircle', 'spiderNest', 'arcaneCrucible', 'darkAltar', 'mithrilForge'],
        };
        for (const [labelId, ids] of Object.entries(era2Sections)) {
            const label = document.getElementById(labelId);
            if (!label) continue;
            const anyVisible = ids.some(id => { const b = document.getElementById('btn-' + id); return b && b.style.display !== 'none'; });
            label.style.display = anyVisible ? '' : 'none';
        }
    }

    // Research tab
    for (const [key, def] of Object.entries(RESEARCH)) {
        const card = document.getElementById("research-" + key);
        if (!card) continue;
        const done       = !!(gameState.research && gameState.research[key]);
        const researchMet  = !def.requiresResearch  || def.requiresResearch.every(k => gameState.research && gameState.research[k]);
        const buildingsMet = !def.requiresBuildings || Object.entries(def.requiresBuildings).every(([b, n]) => (gameState.buildings[b] || 0) >= n);
        const prereqsMet = researchMet && buildingsMet;
        const eraOk      = (RESEARCH_ERA[key] || 2) <= (gameState.run.era || 1);
        card.style.display = (!done && prereqsMet && eraOk) ? "" : "none";
        if (done) continue;
        const btn = document.getElementById("btn-research-" + key);
        if (!btn) continue;
        btn.textContent = "Research";
        btn.disabled    = !canAffordResearch(key);
        const costEl = card.querySelector(".research-cost");
        if (costEl) costEl.innerHTML = _researchCostLine(key, def);
    }
    // Sort visible research cards: resource-only costs first (sort value 0), then by lore amount ascending
    const resList = document.querySelector('.research-list');
    if (resList) {
        const researchSortValue = (key) => {
            const cost = (RESEARCH[key] || {}).cost || {};
            return cost.lore ? cost.lore : 0;
        };
        const cards = Array.from(resList.querySelectorAll('.research-card'));
        cards.sort((a, b) => {
            const aKey = a.id.replace('research-', '');
            const bKey = b.id.replace('research-', '');
            const aHidden = a.style.display === 'none';
            const bHidden = b.style.display === 'none';
            if (aHidden !== bHidden) return aHidden ? 1 : -1;
            const aAfford = canAffordResearch(aKey);
            const bAfford = canAffordResearch(bKey);
            if (aAfford !== bAfford) return aAfford ? -1 : 1;
            return researchSortValue(aKey) - researchSortValue(bKey);
        });
        cards.forEach(c => resList.appendChild(c));
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
    renderQuintessencePanel();

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

// Returns the effective cp cost after rounding up sub-denomination remainders.
// Used for both display and actual deduction so the two always agree.
function effectiveCoinCost(n) {
    n = Math.floor(n);
    const r = gameState.research || {};
    if (r.goldOnly) {
        // Round up to nearest 1000 cp (1 gp)
        return n <= 0 ? 0 : Math.ceil(n / 1000) * 1000;
    }
    if (r.mintStandard) {
        // Round up to nearest 100 cp (1 sp)
        return n <= 0 ? 0 : Math.ceil(n / 100) * 100;
    }
    return n;
}

function formatCoins(n) {
    n = Math.floor(n);
    if (n <= 0) return "0 cp";
    const r = gameState.research || {};
    if (r.goldOnly) {
        // Gold pieces only — balance floors to gp (you don't display sub-gp for your wallet)
        const gp = Math.floor(n / 1000);
        return (gp || 0) + " gp";
    }
    if (r.mintStandard) {
        // Silver + gold, no copper
        const gp = Math.floor(n / 1000);
        const sp = Math.floor((n % 1000) / 100);
        const parts = [];
        if (gp) parts.push(gp + " gp");
        if (sp) parts.push(sp + " sp");
        return parts.length ? parts.join(" ") : "0 sp";
    }
    if (!r.silverCurrency) {
        // Pre-currency-research: show raw copper only
        return n + " cp";
    }
    if (!r.goldStandard) {
        // Silver unlocked but not gold: show sp + leftover cp
        const sp = Math.floor(n / 100);
        const cp = n % 100;
        const parts = [];
        if (sp) parts.push(sp + " sp");
        if (cp) parts.push(cp + " cp");
        return parts.length ? parts.join(" ") : "0 cp";
    }
    // Gold standard: full gp / sp / cp breakdown
    const gp = Math.floor(n / 1000);
    const sp = Math.floor((n % 1000) / 100);
    const cp = n % 100;
    const parts = [];
    if (gp) parts.push(gp + " gp");
    if (sp) parts.push(sp + " sp");
    if (cp) parts.push(cp + " cp");
    return parts.length ? parts.join(" ") : "0 cp";
}

// Format a coin *cost* — rounds up sub-denomination remainders when higher
// denominations have been researched, so display matches what is charged.
function formatCoinCost(n) {
    return formatCoins(effectiveCoinCost(n));
}

// Compact single-denomination display for the main resource bar: shows only
// the highest unlocked unit, with a decimal remainder instead of stacking
// gp/sp/cp chunks. Full breakdown is still available via formatCoins() in tooltips.
function formatCoinsCompact(n) {
    n = Math.floor(n);
    if (n <= 0) return gameState.research && gameState.research.goldOnly ? "0 gp"
        : (gameState.research && gameState.research.silverCurrency ? "0 sp" : "0 cp");
    const r = gameState.research || {};
    const oneDecimal = (whole, sub) => {
        const d = Math.floor(sub / 10);
        return d ? `${whole}.${d}` : `${whole}`;
    };
    if (r.goldOnly || r.goldStandard) {
        const gp = Math.floor(n / 1000);
        if (gp > 0) return oneDecimal(gp, n % 1000) + " gp";
        const sp = Math.floor(n / 100);
        if (sp > 0) return oneDecimal(sp, n % 100) + " sp";
        return n + " cp";
    }
    if (r.mintStandard) {
        const gp = Math.floor(n / 1000);
        if (gp > 0) return oneDecimal(gp, n % 1000) + " gp";
        return Math.floor(n / 100) + " sp";
    }
    if (r.silverCurrency) {
        const sp = Math.floor(n / 100);
        if (sp > 0) return oneDecimal(sp, n % 100) + " sp";
        return n + " cp";
    }
    return n + " cp";
}

// ── Era system ────────────────────────────────────────────────────────────────
// Era-gated buildings: Era 1 = everything NOT listed here (default).
const BUILDING_ERA = {
    // Era 2 — Advanced industry / arcane
    crystalSeam:   2, smelter:       2, alchemyLab:  2,
    kiln:          2, loom:          2, mageTower:   2,
    armory:        2, sulphurVent:   2, arcaneGrinder: 2,
    forge:         2, arcaneBench:   2,
    marketStall:   2, tradeCart:     2, house:        2, apartment:    2,
    // Era 2 late — Endgame / dark
    ritualCircle:  2, arcaneCrucible: 2,
    darkAltar:     2, mithrilForge:  2,
};

// Era-gated research: defaults to Era 1 if not listed.
// All research belongs to Era 2. Keys not listed here default to 2 via the || 2
// fallback in eraOk. Add explicit era values only if future eras introduce research.
const RESEARCH_ERA = {};

// Research keys grouped by era — used to bulk-complete them in dev loadouts.
// Era 1 has no research (the research tab is introduced in Era 2).
const ERA_2_RESEARCH = [
    // 2.1
    "toolcraft", "timberfelling", "stonemason", "cropRotation", "foragerLore",
    "wildHarvest", "simplerTinctures",
    // 2.2
    "herbGarden", "animalHusbandry", "carpentry", "quarrying", "oreProspecting",
    "coalBunker", "silverCurrency", "composting", "communalLiving", "taxCollector", "favoredTerrain",
    // 2.3
    "shadowMarket", "prototypeTools", "stoneSplitting", "logDrying",
    "deepMining", "crystalLore", "sulphurStudy", "bellowsDesign", "concentratedExtracts",
    "highFireKiln", "loomMastery", "packHunting", "trapLines",
    "reinforcedShelving", "dryCellar", "militiaDrill", "bookkeeping", "goldStandard", "taxes",
    // 2.4
    "warFormations", "refinedAlchemy", "quenchingTechniques", "dwarvenShoring", "communalArchitecture",
    "ironFittings", "oilRendering", "prefabTimber", "stockpiledStone",
    "crystalFocus", "forgeMastery", "mortaredMasonry", "roadNetwork",
    "guildCharter", "mintStandard", "arcaneTapping", "arcaneInscription", "loreKeeping", "ironLockbox",
    "greenwardenLore", "trackerSign", "annotatedTexts",
    // 2.5
    "bonecraft", "boneTools", "hearthStones", "rationing", "phosphorLamps",
    "alchemicalFertilizer", "dedicatedTanners", "crystalPolishing", "tradeGoods",
    "runicScript", "essenceHarvest", "ichorRefinement", "manaConductorCoils",
    "mithrilTemper", "ritualPrep", "darkTexts", "silkenWarren", "manaConduit", "goldOnly", "infernalLore",
    "blueprintLibrary", "steelGrade",
    // 2.6
    "silkCulture", "silkRope", "houseDesign", "coalGasification", "pressurizedBellows", "ventilatedShafts",
    // 2.7
    "fencedGoods", "oreConcentrate", "crystalChandeliers", "shieldGuard",
    // 2.8
    "runesOfTheDeep", "coalReduction", "masterworkPotions", "circleOfTheWilds",
    // 2.9
    "dwarvenAnvil", "rangersConclave", "thievesGuild", "crossReferenced", "runicCalibration",
    // 2.10
    "apartmentDesign", "masterCraft", "grandLibrary",
    // 2.10 (gates)
    "planarRites", "amnizuSummons", "dungeonBlueprint",
];
const ERA_3_RESEARCH = [
    // No Era 3 research designed yet — stub reserved for future content.
];

// Default dev loadouts: representative fully-researched state for each era.
const ERA_LOADOUTS = {
    1: {
        population: 5,
        buildings: {
            essenceWell: 30, runeObelisk: 5,
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
            scriptorium: 2,
        },
        research: [...ERA_2_RESEARCH],
        resources: {
            food: 200, wood: 200, stone: 200, ore: 200,
            herbs: 100, coal: 150, clay: 100, bones: 100, crystals: 75, sulphur: 80,
            iron: 150, potions: 60, arcaneDust: 60,
            steel: 50, bricks: 80, cloth: 50, runes: 30,
            coins: 15000, lore: 50,
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
            scriptorium: 4,
            ritualCircle: 1, spiderNest: 1, arcaneCrucible: 1, darkAltar: 1, mithrilForge: 1,
        },
        research: [...ERA_2_RESEARCH, ...ERA_3_RESEARCH],
        resources: {
            food: 200, wood: 200, stone: 200, ore: 200,
            herbs: 150, coal: 150, clay: 150, bones: 150, crystals: 75, sulphur: 80,
            iron: 150, potions: 75, arcaneDust: 75, steel: 100, bricks: 120, cloth: 100, runes: 60,
            arcaneEssence: 50, silk: 40, manaGold: 40, ichor: 30, mithril: 20,
            coins: 50000, lore: 100,
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
    if (def.requiresBuildings) {
        for (const [b, n] of Object.entries(def.requiresBuildings)) {
            if ((gameState.buildings[b] || 0) < n) return false;
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
    for (const res of Object.keys(BASE_CAPS)) {
        if (!shouldShowResource(res)) continue;
        gameState.resources[res] = caps[res];
    }
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

function devFireRandomEvent() {
    const era = (gameState.run && gameState.run.era) || 1;
    let pool = [];
    if (era === 1) {
        pool = RANDOM_EVENTS.era1 || [];
    } else {
        const general = RANDOM_EVENTS.era2General || [];
        const raceName = gameState.run && gameState.run.race;
        const raceType = raceName && RACE_DATA[raceName] && RACE_DATA[raceName].tagLabel;
        const byType   = raceType && RANDOM_EVENTS.era2ByType && RANDOM_EVENTS.era2ByType[raceType] || [];
        pool = [...general, ...byType];
    }
    if (!pool.length) return;
    const event = _weightedPick(pool);
    const effectSummary = _applyEventEffects(event.effects || []);
    addLogEntry(event.text, effectSummary);
    updateUI();
}

function devAddQuintessence(n) {
    gameState.meta.quintessence = (gameState.meta.quintessence || 0) + n;
    saveGame();
    updateUI();
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

// Returns the set of race names that are revealed to the player:
// - All races they have ever prestiged with (meta.racesPlayed)
// - The 2 randomly offered races for this run (era1.raceOptions.names)
function era1GetRevealedRaces() {
    const revealed = new Set(Object.keys(gameState.meta.racesPlayed || {}));
    const opts = gameState.era1 && gameState.era1.raceOptions;
    if (opts && opts.names) opts.names.forEach(n => revealed.add(n));
    return revealed;
}

// When an L4 type node is chosen, pick 2 random race offers from its static L5
// children, excluding races already prestiged with. Stores names in era1.raceOptions.
function era1PickRaceOffers(l4Node) {
    const prestiged = new Set(Object.keys(gameState.meta.racesPlayed || {}));
    const legendaryNames = new Set(Object.values(LEGENDARY_ROSTER).flat());
    const children = l4Node.children || [];
    const unplayed = children
        .map(id => ERA1_TREE[id])
        .filter(n => n && !prestiged.has(n.race) && !legendaryNames.has(n.race));
    // Fisher-Yates shuffle unplayed pool, pick up to 2
    for (let i = unplayed.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [unplayed[i], unplayed[j]] = [unplayed[j], unplayed[i]];
    }
    const offered = unplayed.slice(0, 2).map(n => n.race);
    gameState.era1.raceOptions = { type: l4Node.type, parentId: l4Node.id, names: offered };
}

function unlockEra1Node(nodeId) {
    const node = ERA1_TREE[nodeId];
    if (!node) return;
    if (node.legendary) {
        const prestiged = new Set(Object.keys(gameState.meta.racesPlayed || {}));
        if (!prestiged.has(node.race)) return; // earned, not chosen — locked until unlock condition is met
    }
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

    // L4 chosen — pick 2 random race offers from this type's static L5 children
    if (node.layer === 4 && node.type) {
        era1PickRaceOffers(node);
    }

    // Era transition: L5 race node chosen
    if (node.layer === 5 && node.race) {
        gameState.era1.chosen = nodeId;
        era1HidePanel();
        era1FlashTree(domainId);
        setTimeout(() => {
            showEraTransition(node.race, () => {
                playRace(node.race);
                gameState.resources.essence   = 0;
                gameState.resources.influence = 0;
                gameState.resources.mana      = 0;
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
    era1PanToMostRecent();
    saveGame();
}

// ── New Game Intro Comic Transition ──────────────────────────────────────────

let _introTransitionCallback = null;
let _introTimerTimeout = null;

function showIntroTransition(onComplete) {
    _introTransitionCallback = onComplete;

    const overlay = document.getElementById('intro-transition-overlay');
    const panels  = document.querySelectorAll('.intro-panel');
    const btn     = document.getElementById('intro-transition-continue');

    if (_introTimerTimeout) { clearTimeout(_introTimerTimeout); _introTimerTimeout = null; }

    panels.forEach(p => {
        p.classList.remove('intro-panel-in');
        p.querySelectorAll('.intro-panel-lore').forEach(l => l.classList.remove('intro-lore-in'));
    });
    btn.classList.remove('intro-btn-in', 'intro-btn-pulse');
    overlay.classList.remove('intro-hiding');
    overlay.classList.add('intro-active');

    // Stagger 4 panels in, then lore text 400ms after each panel
    const delays = [150, 750, 1350, 1950];
    panels.forEach((p, i) => {
        setTimeout(() => {
            p.classList.add('intro-panel-in');
            setTimeout(() => {
                const lore = p.querySelector('.intro-panel-lore');
                if (lore) lore.classList.add('intro-lore-in');
            }, 400);
        }, delays[i]);
    });

    // Show continue button after all panels are in
    const BTN_DELAY = 2800;
    _introTimerTimeout = setTimeout(() => {
        const btn2 = document.getElementById('intro-transition-continue');
        if (!btn2) return;
        btn2.classList.add('intro-btn-in');
        _introTimerTimeout = null;
    }, BTN_DELAY);
}

function introTransitionContinue() {
    if (_introTimerTimeout) { clearTimeout(_introTimerTimeout); _introTimerTimeout = null; }

    const overlay = document.getElementById('intro-transition-overlay');
    overlay.classList.add('intro-hiding');
    overlay.classList.remove('intro-active');
    setTimeout(() => {
        overlay.classList.remove('intro-hiding');
        if (_introTransitionCallback) {
            _introTransitionCallback();
            _introTransitionCallback = null;
        }
    }, 520);
}

// ── Era 1 → Era 2 Comic Transition ───────────────────────────────────────────

let _eraTransitionCallback = null;
let _eraTimerRAF = null;
let _eraTimerTimeout = null;
let _eraMouseMoveHandler = null;
let _eraCanvasRAF = null;

// ── Era panel 3 — race silhouette SVG inner content ───────────────────────────
// Each entry is the SVG markup (no outer <svg> tag) injected into #era-p3-art.
// Creatures with their own entry take priority; types serve as fallback.
// Common constants reused across entries:
//   gold stroke = rgba(200,160,40,0.7)   dim gold = rgba(200,160,40,0.25)
//   crimson eye = #c0392b                aura ring = rgba(200,160,40,0.18)
const ERA_RACE_SVG = (() => {
    const G  = 'rgba(200,160,40,0.7)';   // gold outline
    const Gd = 'rgba(200,160,40,0.25)';  // dim gold
    const Gf = 'rgba(200,160,40,0.08)';  // faint gold
    const E  = '#c0392b';                // crimson eye fill
    const Ei = '#ff6b5b';               // eye inner glow
    const BG = '#0e0a06';               // silhouette fill
    const BGd= '#0a0704';              // dim silhouette fill
    const aura = (cx,cy,r1,r2) =>
        `<ellipse cx="${cx}" cy="${cy}" rx="${r1}" ry="${r2*0.32}" fill="none" stroke="rgba(200,160,40,0.18)" stroke-width="1"/>
         <ellipse cx="${cx}" cy="${cy}" rx="${r1*1.7}" ry="${r2*0.55}" fill="none" stroke="${Gf}" stroke-width="1"/>`;
    const eye = (cx,cy,r=3.2) =>
        `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${E}" opacity="0.95"/>
         <circle cx="${cx}" cy="${cy}" r="${r*0.44}" fill="${Ei}" opacity="0.7"/>`;
    const shadow = (cx,cy,rx=30) =>
        `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="6" fill="rgba(180,100,20,0.1)"/>`;

    const art = {};

    // ── Goblinoid / Goblin — hunched swarming horde, wide low silhouettes ──────
    const goblinoidSVG =
        // three goblins abreast, low and hunched
        `<path d="M110,140 L100,118 L92,114 L94,98 L102,93 L103,82 L110,74 L117,82 L118,93 L126,98 L128,114 L120,118 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         ${eye(106,85,2.8)}${eye(114,85,2.8)}
         <path d="M64,140 L56,122 L50,118 L52,104 L59,100 L60,90 L66,83 L72,90 L73,100 L80,104 L82,118 L74,122 Z" fill="${BGd}" stroke="${Gd}" stroke-width="1"/>
         ${eye(62,92,1.8)}${eye(70,92,1.8)}
         <path d="M156,140 L148,122 L142,118 L144,104 L151,100 L152,90 L158,83 L164,90 L165,100 L172,104 L174,118 L166,122 Z" fill="${BGd}" stroke="${Gd}" stroke-width="1"/>
         ${eye(154,92,1.8)}${eye(162,92,1.8)}
         ${aura(110,120,38,12)}${shadow(110,143,36)}`;
    art['Goblinoid'] = goblinoidSVG;
    art['Goblin']    = goblinoidSVG;
    art['Orc'] =
        // broad muscular orc — wider shoulders, tusks
        `<path d="M110,140 L92,108 L76,100 L80,76 L96,66 L98,46 L110,34 L122,46 L124,66 L140,76 L144,108 L128,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         ${eye(103,52,3.2)}${eye(117,52,3.2)}
         <path d="M102,72 L100,82" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         <path d="M118,72 L120,82" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         ${aura(110,112,40,13)}${shadow(110,143,40)}`;
    art['Bugbear'] =
        // massive bear-goblin: low rounded skull, heavy sloping shoulders, clawed arms dragging low
        `<path d="M110,140 L88,108 L68,102 L64,76 L80,58 L86,48 L100,42 L110,36 L120,42 L134,48 L140,58 L156,76 L152,102 L132,108 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <ellipse cx="110" cy="38" rx="22" ry="18" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M94,28 Q90,18 86,14 Q100,20 100,42" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         <path d="M126,28 Q130,18 134,14 Q120,20 120,42" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         <path d="M64,76 L52,86 L48,100 M156,76 L168,86 L172,100" fill="none" stroke="${G}" stroke-width="1.4" opacity="0.55"/>
         <path d="M64,100 L56,114 L52,122 M156,100 L164,114 L168,122" fill="none" stroke="${G}" stroke-width="1" opacity="0.35"/>
         ${eye(103,34,3.2)}${eye(117,34,3.2)}
         ${aura(110,118,48,15)}${shadow(110,143,46)}`;
    art['Hobgoblin'] =
        `<path d="M110,140 L94,106 L80,98 L84,74 L98,64 L100,44 L110,32 L120,44 L122,64 L136,74 L140,106 L126,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M88,78 L80,74 M132,78 L140,74" stroke="${G}" stroke-width="1.5" opacity="0.5"/>
         ${eye(104,50,3)}${eye(116,50,3)}
         ${aura(110,112,38,12)}${shadow(110,143,38)}`;
    art['Gnoll'] =
        `<path d="M110,140 L96,108 L82,102 L86,78 L100,70 L102,52 L110,40 L118,52 L120,70 L134,78 L138,108 L124,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M98,44 Q96,32 110,24 Q124,32 122,44" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         ${eye(104,56,3)}${eye(116,56,3)}
         ${aura(110,112,36,12)}${shadow(110,143)}`;

    // ── Undead — skeleton, decayed, wraithlike ────────────────────────────────
    const undeadSVG =
        // skeleton — ribcage, bony silhouette
        `<path d="M110,140 L100,115 L88,108 L92,88 L104,82 L106,64 L110,52 L114,64 L116,82 L128,88 L132,108 L120,115 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <line x1="100" y1="88" x2="120" y2="88" stroke="${G}" stroke-width="0.9" opacity="0.5"/>
         <line x1="98"  y1="96" x2="122" y2="96" stroke="${G}" stroke-width="0.9" opacity="0.5"/>
         <line x1="100" y1="104" x2="120" y2="104" stroke="${G}" stroke-width="0.9" opacity="0.5"/>
         ${eye(105,60,2.8)}${eye(115,60,2.8)}
         ${aura(110,118,32,10)}${shadow(110,143,28)}`;
    art['Undead']   = undeadSVG;
    art['Skeleton'] = undeadSVG;
    art['Zombie'] =
        `<path d="M110,140 L96,110 L80,102 L84,80 L98,72 L100,52 L110,40 L120,52 L122,72 L136,80 L140,110 L124,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M100,104 L88,110 M120,104 L132,110" stroke="${G}" stroke-width="1.4" opacity="0.4"/>
         ${eye(104,55,3)}${eye(116,55,3)}
         ${aura(110,114,36,12)}${shadow(110,143)}`;
    art['Vampire'] =
        `<path d="M110,140 L96,108 L82,100 L86,76 L100,66 L102,46 L110,34 L118,46 L120,66 L134,76 L138,108 L124,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M100,42 Q97,32 92,28 Q104,34 102,46" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         <path d="M120,42 Q123,32 128,28 Q116,34 118,46" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         ${eye(104,50,3)}${eye(116,50,3)}
         ${aura(110,112,36,12)}${shadow(110,143)}`;
    art['Wraith'] =
        `<path d="M110,20 Q128,40 130,70 Q140,90 136,120 Q120,135 110,140 Q100,135 84,120 Q80,90 90,70 Q92,40 110,20 Z" fill="${BG}" stroke="${G}" stroke-width="1.6" opacity="0.85"/>
         <path d="M88,110 Q80,130 76,145 M132,110 Q140,130 144,145" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.3"/>
         ${eye(104,52,2.8)}${eye(116,52,2.8)}
         ${aura(110,118,34,11)}${shadow(110,143,28)}`;
    art['Wight']   = undeadSVG;
    art['Ghoul'] =
        // low crawling predator: arched spine, elongated arms braced forward, jaw thrust out
        `<path d="M50,90 Q60,72 80,64 Q96,58 110,56 Q124,58 140,64 Q160,72 170,90" fill="none" stroke="${G}" stroke-width="1.6" opacity="0.5"/>
         <path d="M80,64 Q66,52 60,36 Q74,50 88,60" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <ellipse cx="110" cy="56" rx="24" ry="22" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M94,68 Q72,82 50,90 Q46,106 52,120 Q72,108 90,100 Q96,130 100,145 L120,145 Q124,130 130,100 Q148,108 168,120 Q174,106 170,90 Q148,82 126,68" fill="${BG}" stroke="${G}" stroke-width="1.5"/>
         <path d="M92,64 Q80,50 70,34 Q84,46 94,60 M128,64 Q140,50 150,34 Q136,46 126,60" fill="${BG}" stroke="${Gd}" stroke-width="1" opacity="0.5"/>
         <path d="M90,62 Q84,70 86,78 Q90,82 96,80" fill="none" stroke="${G}" stroke-width="1" opacity="0.5"/>
         ${eye(102,50,3)}${eye(118,50,3)}
         ${aura(110,110,44,14)}${shadow(110,148,40)}`;
    art['Mummy'] =
        `<path d="M110,140 L94,108 L78,100 L82,76 L96,66 L98,46 L110,34 L122,46 L124,66 L138,76 L142,108 L126,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <line x1="94" y1="80" x2="126" y2="80" stroke="${G}" stroke-width="0.8" opacity="0.4"/>
         <line x1="90" y1="92" x2="130" y2="92" stroke="${G}" stroke-width="0.8" opacity="0.4"/>
         <line x1="92" y1="104" x2="128" y2="104" stroke="${G}" stroke-width="0.8" opacity="0.4"/>
         ${eye(104,50,3)}${eye(116,50,3)}
         ${aura(110,112,38,12)}${shadow(110,143)}`;
    art['Shadow'] =
        `<path d="M110,30 Q130,50 128,85 Q140,100 130,130 Q120,142 110,145 Q100,142 90,130 Q80,100 92,85 Q90,50 110,30 Z" fill="${BG}" stroke="${G}" stroke-width="1.4" opacity="0.7"/>
         <path d="M92,85 Q76,95 70,115 M128,85 Q144,95 150,115" fill="none" stroke="${Gd}" stroke-width="1.2"/>
         ${eye(105,55,2.4)}${eye(115,55,2.4)}
         ${aura(110,120,30,10)}${shadow(110,143,26)}`;
    art['Banshee'] = art['Wraith'];
    art['Revenant'] = undeadSVG;
    art['Demilich'] =
        // floating skull
        `<ellipse cx="110" cy="72" rx="28" ry="26" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <ellipse cx="110" cy="90" rx="18" ry="10" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         ${eye(101,68,3.5)}${eye(119,68,3.5)}
         <path d="M100,95 L105,88 L110,95 L115,88 L120,95" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         <ellipse cx="110" cy="72" rx="6" ry="6" fill="none" stroke="${E}" stroke-width="1.2" opacity="0.5"/>
         ${aura(110,115,32,10)}${shadow(110,143,26)}
         <path d="M110,98 L104,118 M110,98 L116,118" stroke="${Gd}" stroke-width="1.2"/>`;

    // ── Draconic — serpentine body, wings, tail ───────────────────────────────
    // ── Draconic type — rearing dragon, wings spread wide, forelimbs braced ─────
    art['Draconic'] =
        `<path d="M110,140 L96,114 L84,106 L82,84 L92,68 L102,56 L110,48 L118,56 L128,68 L138,84 L136,106 L124,114 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M92,68 Q60,52 36,28 Q52,44 66,56 Q74,64 84,70" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M128,68 Q160,52 184,28 Q168,44 154,56 Q146,64 136,70" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M36,28 Q42,48 52,60 Q60,68 66,56" fill="none" stroke="${Gd}" stroke-width="1" opacity="0.4"/>
         <path d="M184,28 Q178,48 168,60 Q160,68 154,56" fill="none" stroke="${Gd}" stroke-width="1" opacity="0.4"/>
         <path d="M96,112 L86,126 L82,140 M124,112 L134,126 L138,140" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <path d="M102,58 Q96,70 94,80 M118,58 Q124,70 126,80" fill="none" stroke="${G}" stroke-width="1" opacity="0.3"/>
         <path d="M100,92 L105,86 L110,94 L115,86 L120,92" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         ${eye(103,60,3.8)}${eye(117,60,3.8)}
         ${aura(110,120,46,15)}${shadow(110,143,44)}`;
    art['Chromatic Dragon'] = art['Draconic'];
    art['Metallic Dragon'] =
        // metallic sheen variant — upright with swept neck and crest
        `<path d="M110,140 L98,112 L86,104 L84,80 L94,64 L104,52 L110,44 L116,52 L126,64 L136,80 L134,104 L122,112 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M94,64 Q64,50 42,30 Q58,46 72,58 Q80,66 86,72" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M126,64 Q156,50 178,30 Q162,46 148,58 Q140,66 134,72" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M104,50 Q100,38 110,24 Q120,38 116,50" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <line x1="98" y1="82" x2="86" y2="90" stroke="${G}" stroke-width="1.2" opacity="0.4"/>
         <line x1="122" y1="82" x2="134" y2="90" stroke="${G}" stroke-width="1.2" opacity="0.4"/>
         ${eye(103,58,3.8)}${eye(117,58,3.8)}
         ${aura(110,120,44,14)}${shadow(110,143,44)}`;
    art['Kobold'] =
        `<path d="M110,140 L100,116 L90,110 L93,94 L103,88 L104,74 L110,64 L116,74 L117,88 L127,94 L130,116 L120,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M103,66 Q100,56 110,50 Q120,56 117,66" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         ${eye(105,72,2.5)}${eye(115,72,2.5)}
         ${aura(110,120,30,10)}${shadow(110,143,28)}`;
    art['Lizardfolk'] =
        `<path d="M110,140 L95,108 L80,100 L84,76 L98,68 L100,50 L110,38 L120,50 L122,68 L136,76 L140,108 L125,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M110,140 L106,155 L110,158 L114,155 Z" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         ${eye(104,54,3)}${eye(116,54,3)}
         ${aura(110,112,36,12)}${shadow(110,143)}`;
    art['Yuan-ti'] =
        `<path d="M110,30 Q126,46 124,72 Q130,90 124,116 Q118,136 110,144 Q102,136 96,116 Q90,90 96,72 Q94,46 110,30 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M96,72 Q80,80 72,100 Q88,96 96,116" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         <path d="M124,72 Q140,80 148,100 Q132,96 124,116" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         ${eye(104,48,3)}${eye(116,48,3)}
         ${aura(110,118,36,12)}${shadow(110,145,34)}`;
    art['Dragonborn'] =
        `<path d="M110,140 L92,106 L76,98 L80,74 L96,64 L98,44 L110,32 L122,44 L124,64 L140,74 L144,106 L128,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M80,74 Q66,62 60,50 Q76,64 96,64" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         <path d="M140,74 Q154,62 160,50 Q144,64 124,64" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         ${eye(103,50,3.2)}${eye(117,50,3.2)}
         ${aura(110,114,40,13)}${shadow(110,143,40)}`;
    art['Wyvern'] =
        `<path d="M110,145 Q88,130 78,108 Q70,86 80,66 Q90,46 110,38 Q130,46 140,66 Q150,86 142,108 Q132,130 110,145 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M80,66 Q56,52 46,36 Q70,52 90,70" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M140,66 Q164,52 174,36 Q150,52 130,70" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         ${eye(102,58,3.2)}${eye(118,58,3.2)}
         ${aura(110,118,40,13)}${shadow(110,146,40)}`;

    // ── Fey — lithe, wispy, pointed ears ─────────────────────────────────────
    const feySVG =
        `<path d="M110,140 L98,112 L86,106 L90,84 L102,76 L104,58 L110,46 L116,58 L118,76 L130,84 L134,106 L122,112 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M104,56 Q98,40 88,32" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         <path d="M116,56 Q122,40 132,32" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         ${eye(105,62,2.5)}${eye(115,62,2.5)}
         ${aura(110,114,34,11)}${shadow(110,143,30)}`;
    art['Fey']       = feySVG;
    art['Pixie'] =
        `<path d="M110,140 L104,120 L96,116 L98,104 L105,100 L106,90 L110,82 L114,90 L115,100 L122,104 L124,116 L116,120 Z" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M106,88 Q96,72 82,64 M114,88 Q124,72 138,64" fill="none" stroke="${G}" stroke-width="1.4" opacity="0.55"/>
         ${eye(106,88,2)}${eye(114,88,2)}
         ${aura(110,122,24,8)}${shadow(110,143,22)}`;
    art['Dryad'] =
        // tree-woman: lower body merging into roots, arms as branches, antler-crown overhead
        `<path d="M102,140 L98,118 L90,108 L92,92 L100,82 L104,68 L110,60 L116,68 L120,82 L128,92 L130,108 L122,118 L118,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.5"/>
         <path d="M98,118 Q84,126 76,140 M102,140 Q96,148 90,155 M118,140 Q124,148 130,155 M122,118 Q136,126 144,140" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <path d="M76,140 Q68,144 64,152 M144,140 Q152,144 156,152" fill="${BGd}" stroke="${Gd}" stroke-width="1" opacity="0.4"/>
         <path d="M100,82 Q82,70 68,52 Q86,68 94,82 M120,82 Q138,70 152,52 Q134,68 126,82" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <path d="M68,52 Q56,40 50,26 Q64,38 72,52 M152,52 Q164,40 170,26 Q156,38 148,52" fill="${BGd}" stroke="${Gd}" stroke-width="1" opacity="0.4"/>
         <path d="M104,68 Q96,50 88,34 Q100,50 106,64 M116,68 Q124,50 132,34 Q120,50 114,64" fill="${BGd}" stroke="${Gd}" stroke-width="1" opacity="0.45"/>
         <path d="M110,60 Q106,46 110,32 Q114,46 110,60" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         ${eye(105,76,2.5)}${eye(115,76,2.5)}
         ${aura(110,115,30,10)}${shadow(110,143,28)}`;
    art['Satyr'] =
        `<path d="M110,140 L98,112 L86,106 L90,84 L102,76 L104,56 L110,44 L116,56 L118,76 L130,84 L134,106 L122,112 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M104,52 Q100,38 96,28 M116,52 Q120,38 124,28" fill="none" stroke="${G}" stroke-width="1.4" opacity="0.6"/>
         <path d="M96,118 Q90,130 88,140 M124,118 Q130,130 132,140" fill="${BG}" stroke="${G}" stroke-width="1.3" opacity="0.5"/>
         ${eye(104,62,2.5)}${eye(116,62,2.5)}
         ${aura(110,114,34,11)}${shadow(110,143)}`;
    art['Quickling'] = feySVG;
    art['Green Hag'] =
        `<path d="M110,140 L96,110 L80,102 L84,78 L98,68 L100,48 L110,36 L120,48 L122,68 L136,78 L140,110 L124,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M96,44 Q90,28 84,24 Q92,32 100,48" fill="${BG}" stroke="${G}" stroke-width="1"/>
         <path d="M110,36 Q110,24 110,18" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         ${eye(104,54,3)}${eye(116,54,3)}
         ${aura(110,113,36,12)}${shadow(110,143)}`;
    art['Homunculus'] = feySVG;

    // ── Aberration — asymmetric, alien, tentacles or eyes ────────────────────
    const aberrationSVG =
        // mind flayer — elongated head, tentacles
        `<ellipse cx="110" cy="56" rx="24" ry="26" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M110,80 L100,110 L88,140 M110,80 L106,112 L100,140 M110,80 L114,112 L120,140 M110,80 L120,110 L132,140" fill="none" stroke="${G}" stroke-width="1.6" opacity="0.7"/>
         <path d="M94,72 Q88,82 84,92 M126,72 Q132,82 136,92 M102,76 Q100,88 98,98 M118,76 Q120,88 122,98" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         ${eye(103,50,3.5)}${eye(117,50,3.5)}
         ${aura(110,110,36,12)}${shadow(110,143)}`;
    art['Aberration'] = aberrationSVG;
    art['Mind Flayer'] = aberrationSVG;
    art['Beholder'] =
        // central sphere with radiating eyestalks
        `<circle cx="110" cy="80" r="38" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         ${eye(110,80,7)}
         <line x1="110" y1="42" x2="110" y2="30"/><circle cx="110" cy="28" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         <line x1="136" y1="54" x2="148" y2="46"/><circle cx="150" cy="44" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         <line x1="148" y1="80" x2="162" y2="80"/><circle cx="164" cy="80" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         <line x1="136" y1="106" x2="148" y2="114"/><circle cx="150" cy="116" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         <line x1="84" y1="54" x2="72" y2="46"/><circle cx="70" cy="44" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         <line x1="72" y1="80" x2="58" y2="80"/><circle cx="56" cy="80" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         <line x1="84" y1="106" x2="72" y2="114"/><circle cx="70" cy="116" r="3.5" fill="${E}" opacity="0.8" stroke="${G}" stroke-width="0.8"/>
         `.replace(/<line /g, `<line stroke="${G}" stroke-width="1.2" `) +
         `${aura(110,124,40,13)}${shadow(110,145,40)}`;
    art['Aboleth'] =
        `<path d="M40,80 Q60,60 90,56 Q110,52 130,56 Q160,60 180,80 Q160,100 130,104 Q110,108 90,104 Q60,100 40,80 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M90,56 Q80,36 72,24 M110,52 Q110,30 110,18 M130,56 Q140,36 148,24" fill="none" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         <path d="M90,104 Q78,120 72,136 M130,104 Q142,120 148,136" fill="none" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         ${eye(88,78,3.5)}${eye(110,76,3.5)}${eye(132,78,3.5)}
         ${aura(110,112,44,14)}${shadow(110,143,44)}`;
    art['Nothic'] = aberrationSVG;
    art['Gibbering Mouther'] =
        `<circle cx="110" cy="88" r="42" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         ${eye(94,76,3)}${eye(110,70,3.5)}${eye(126,76,3)}${eye(86,92,2.5)}${eye(134,92,2.5)}${eye(100,102,2.5)}${eye(120,102,2.5)}
         <path d="M90,96 Q96,108 104,112 Q110,116 116,112 Q124,108 130,96" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         ${aura(110,132,38,12)}${shadow(110,143)}`;

    // ── Ooze — amorphous blob ─────────────────────────────────────────────────
    art['Ooze'] =
        `<path d="M60,100 Q54,78 62,60 Q74,38 94,32 Q110,26 126,32 Q146,38 158,60 Q166,78 160,100 Q154,120 138,130 Q124,140 110,142 Q96,140 82,130 Q66,120 60,100 Z" fill="${BG}" stroke="${G}" stroke-width="1.6" opacity="0.85"/>
         <path d="M66,106 Q58,120 62,136 M154,106 Q162,120 158,136" fill="${BGd}" stroke="${Gd}" stroke-width="1.2"/>
         ${eye(96,75,3)}${eye(124,75,3)}
         <path d="M98,98 Q104,106 110,108 Q116,106 122,98" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         ${aura(110,122,40,13)}${shadow(110,144,42)}`;

    // ── Elemental — crystalline/rocky/angular ─────────────────────────────────
    art['Elemental'] =
        `<path d="M110,140 L86,114 L70,90 L78,64 L96,48 L110,22 L124,48 L142,64 L150,90 L134,114 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M96,48 L78,64 M124,48 L142,64 M86,114 L70,90 M134,114 L150,90" fill="none" stroke="${G}" stroke-width="0.9" opacity="0.3"/>
         ${eye(103,66,3)}${eye(117,66,3)}
         <path d="M100,86 L106,80 L110,86 L114,80 L120,86" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.55"/>
         ${aura(110,118,38,12)}${shadow(110,143,38)}`;

    // ── Monstrous — large, brutish, varied ───────────────────────────────────
    art['Monstrous'] =
        `<path d="M110,140 L88,104 L70,94 L76,66 L94,54 L96,32 L110,18 L124,32 L126,54 L144,66 L150,94 L132,104 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M94,30 Q90,18 82,12 Q96,20 96,32 M126,30 Q130,18 138,12 Q124,20 124,32" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         ${eye(102,46,3.5)}${eye(118,46,3.5)}
         ${aura(110,115,44,14)}${shadow(110,143,44)}`;
    art['Tarrasque'] =
        `<path d="M110,145 L82,108 L60,96 L66,64 L86,50 L88,26 L110,10 L132,26 L134,50 L154,64 L160,96 L138,108 Z" fill="${BG}" stroke="${G}" stroke-width="2"/>
         <path d="M88,24 Q82,10 74,4 Q90,14 88,26 M132,24 Q138,10 146,4 Q130,14 132,26" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M60,96 Q44,100 36,112 M160,96 Q176,100 184,112" fill="${BGd}" stroke="${Gd}" stroke-width="1.3"/>
         ${eye(100,42,4)}${eye(120,42,4)}
         ${aura(110,118,48,15)}${shadow(110,146,50)}`;
    art['Sphinx'] =
        `<path d="M40,100 Q60,80 88,76 L96,52 Q104,34 110,28 Q116,34 124,52 L132,76 Q160,80 180,100 Q160,114 140,116 L140,140 L80,140 L80,116 Q60,114 40,100 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         ${eye(104,50,3)}${eye(116,50,3)}
         <path d="M96,52 Q90,60 88,76 M124,52 Q130,60 132,76" fill="none" stroke="${G}" stroke-width="1" opacity="0.4"/>
         ${aura(110,120,44,14)}${shadow(110,143,44)}`;

    // ── Fiend — horned, winged, imposing ────────────────────────────────────
    art['Fiend'] =
        `<path d="M110,140 L92,106 L76,98 L80,74 L96,64 L98,44 L110,30 L122,44 L124,64 L140,74 L144,106 L128,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M98,42 Q90,28 76,20 Q92,32 96,44 M122,42 Q130,28 144,20 Q128,32 124,44" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M80,74 Q60,72 48,60 Q68,78 80,82 M140,74 Q160,72 172,60 Q152,78 140,82" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         ${eye(103,50,3.2)}${eye(117,50,3.2)}
         ${aura(110,112,40,13)}${shadow(110,143,40)}`;

    // ── Giant — massive, simple, towering ────────────────────────────────────
    art['Giant'] =
        `<path d="M110,145 L86,100 L66,90 L72,58 L94,44 L96,18 L110,4 L124,18 L126,44 L148,58 L154,90 L134,100 Z" fill="${BG}" stroke="${G}" stroke-width="2"/>
         ${eye(101,34,4)}${eye(119,34,4)}
         <path d="M72,58 L54,52 M148,58 L166,52" stroke="${G}" stroke-width="1.8" opacity="0.4"/>
         ${aura(110,116,48,15)}${shadow(110,146,50)}`;

    // ── Construct — angular, mechanical, symmetric ────────────────────────────
    art['Construct'] =
        `<path d="M96,140 L96,108 L80,100 L80,72 L96,64 L96,44 L110,36 L124,44 L124,64 L140,72 L140,100 L124,108 L124,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <rect x="98" y="44" width="24" height="20" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         <line x1="80" y1="80" x2="96" y2="80" stroke="${G}" stroke-width="1.2" opacity="0.4"/>
         <line x1="124" y1="80" x2="140" y2="80" stroke="${G}" stroke-width="1.2" opacity="0.4"/>
         <line x1="96" y1="116" x2="80" y2="130" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         <line x1="124" y1="116" x2="140" y2="130" stroke="${G}" stroke-width="1.4" opacity="0.5"/>
         ${eye(104,52,3)}${eye(116,52,3)}
         ${aura(110,114,36,12)}${shadow(110,143,36)}`;

    // ── Lycanthrope — wolf-human hybrid, hunched, claws ──────────────────────
    art['Lycanthrope'] =
        `<path d="M110,140 L94,106 L78,96 L82,72 L98,60 L100,42 L110,28 L120,42 L122,60 L138,72 L142,106 L126,140 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M100,40 Q94,26 84,16 Q98,28 100,42 M120,40 Q126,26 136,16 Q122,28 120,42" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M94,106 L86,118 L80,130 M126,106 L134,118 L140,130" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         ${eye(103,48,3)}${eye(117,48,3)}
         ${aura(110,114,38,12)}${shadow(110,143,38)}`;

    // ── Flora — plant-creature, organic curves, tendrils ─────────────────────
    art['Flora'] =
        `<path d="M110,145 Q88,132 78,110 Q68,86 78,64 Q90,40 110,32 Q130,40 142,64 Q152,86 142,110 Q132,132 110,145 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M78,64 Q60,48 56,32 Q72,48 80,64 M142,64 Q160,48 164,32 Q148,48 140,64" fill="${BGd}" stroke="${Gd}" stroke-width="1.3"/>
         <path d="M78,110 Q64,124 60,140 M142,110 Q156,124 160,140" fill="${BGd}" stroke="${Gd}" stroke-width="1.3"/>
         <path d="M96,36 Q90,18 94,6 M124,36 Q130,18 126,6" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.5"/>
         ${eye(103,60,3)}${eye(117,60,3)}
         ${aura(110,120,36,12)}${shadow(110,146,36)}`;

    // ── Aquatic — merfolk silhouette: human torso, fish tail, dorsal fin, wide eyes ─
    art['Aquatic'] =
        // narrow torso tapering to forked tail; dorsal fin ridge; swept pectoral fins
        `<path d="M110,10 Q122,22 124,46 Q128,64 120,78 Q132,100 128,122 Q118,138 110,148 Q102,138 92,122 Q88,100 100,78 Q92,64 96,46 Q98,22 110,10 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M128,122 Q140,134 148,148 Q134,138 120,126 M92,122 Q80,134 72,148 Q86,138 100,126" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <path d="M120,78 Q138,68 156,62 Q148,74 136,82 Q128,86 124,90 M100,78 Q82,68 64,62 Q72,74 84,82 Q92,86 96,90" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <path d="M110,10 Q102,0 96,4 Q106,12 110,10 Q114,12 124,4 Q118,0 110,10" fill="${BG}" stroke="${G}" stroke-width="1.2" opacity="0.6"/>
         <path d="M106,52 Q102,64 104,76 M114,52 Q118,64 116,76" fill="none" stroke="${Gd}" stroke-width="0.9" opacity="0.4"/>
         <path d="M106,94 Q102,106 104,118 M114,94 Q118,106 116,118" fill="none" stroke="${Gd}" stroke-width="0.9" opacity="0.3"/>
         ${eye(103,38,3.8)}${eye(117,38,3.8)}
         ${aura(110,126,34,11)}${shadow(110,150,30)}`;
    art['Kraken'] =
        `<circle cx="110" cy="82" r="36" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         ${eye(98,76,4)}${eye(122,76,4)}
         <path d="M80,94 Q68,110 58,130 M86,104 Q78,122 74,140 M140,94 Q152,110 162,130 M134,104 Q142,122 146,140" fill="none" stroke="${G}" stroke-width="1.5" opacity="0.6"/>
         <path d="M80,70 Q68,50 60,34 M140,70 Q152,50 160,34" fill="none" stroke="${G}" stroke-width="1.3" opacity="0.45"/>
         ${aura(110,124,42,14)}${shadow(110,143,42)}`;

    // ── Swarm — cluster of many small bodies, scattered eye glints ────────────
    art['Swarm'] =
        `<circle cx="80" cy="100" r="16" fill="${BGd}" stroke="${Gd}" stroke-width="1.2"/>
         <circle cx="106" cy="84" r="20" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <circle cx="138" cy="102" r="15" fill="${BGd}" stroke="${Gd}" stroke-width="1.2"/>
         <circle cx="118" cy="118" r="17" fill="${BG}" stroke="${G}" stroke-width="1.4"/>
         <circle cx="88" cy="124" r="13" fill="${BGd}" stroke="${Gd}" stroke-width="1"/>
         <circle cx="64" cy="118" r="11" fill="${BGd}" stroke="${Gd}" stroke-width="1" opacity="0.7"/>
         <circle cx="150" cy="122" r="11" fill="${BGd}" stroke="${Gd}" stroke-width="1" opacity="0.7"/>
         ${eye(80,98,1.8)}${eye(101,80,2.4)}${eye(111,80,2.4)}${eye(138,100,1.8)}${eye(112,116,2)}${eye(124,118,2)}${eye(88,122,1.4)}
         ${aura(110,128,40,13)}${shadow(110,143,42)}`;

    // ── Beast — quadruped, low body and tail, alert ears ──────────────────────
    art['Beast'] =
        `<path d="M48,108 Q44,96 54,90 Q60,80 72,80 L82,68 Q90,60 98,64 L94,76 Q108,70 124,76 L150,80 Q166,84 172,98 Q176,108 168,114 L168,128 L156,128 L154,116 L100,116 L96,128 L84,128 L84,114 Q64,112 52,116 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M150,80 Q160,68 158,54 Q170,66 166,82" fill="${BG}" stroke="${G}" stroke-width="1.2"/>
         ${eye(86,72,2.6)}
         <path d="M44,100 Q34,96 26,100 Q36,104 46,106" fill="${BGd}" stroke="${Gd}" stroke-width="1.2" opacity="0.6"/>
         ${aura(110,124,52,14)}${shadow(110,143,52)}`;

    // ── Specter — wispy trailing form, faint and incorporeal ──────────────────
    art['Specter'] =
        `<path d="M110,24 Q132,38 134,66 Q138,86 130,100 Q140,110 132,122 Q140,128 128,136 Q138,140 122,144 Q110,148 98,144 Q82,140 92,136 Q80,128 88,122 Q80,110 90,100 Q82,86 86,66 Q88,38 110,24 Z" fill="${BG}" stroke="${G}" stroke-width="1.3" opacity="0.65"/>
         ${eye(103,56,2.4)}${eye(117,56,2.4)}
         <path d="M86,66 Q70,72 60,84 M134,66 Q150,72 160,84" fill="none" stroke="${Gd}" stroke-width="1" opacity="0.4"/>
         ${aura(110,120,32,11)}${shadow(110,144,24)}`;

    // ── Planar — angular geometric form, otherworldly symmetry ────────────────
    art['Planar'] =
        `<path d="M110,16 L142,52 L132,98 L150,140 L110,124 L70,140 L88,98 L78,52 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         <path d="M110,16 L110,124 M78,52 L142,52 M88,98 L132,98" fill="none" stroke="${G}" stroke-width="0.9" opacity="0.35"/>
         ${eye(103,58,3)}${eye(117,58,3)}
         ${aura(110,116,40,13)}${shadow(110,143,40)}`;

    // ── Celestial — winged, radiant, halo aura ─────────────────────────────────
    art['Celestial'] =
        `<path d="M110,138 L98,104 L86,96 L90,72 L102,64 L104,40 L110,24 L116,40 L118,64 L130,72 L134,96 L122,104 Z" fill="${BG}" stroke="${G}" stroke-width="1.6"/>
         <path d="M90,72 Q60,64 36,68 Q56,80 86,86 M130,72 Q160,64 184,68 Q164,80 134,86" fill="${BG}" stroke="${G}" stroke-width="1.3" opacity="0.7"/>
         <ellipse cx="110" cy="32" rx="14" ry="5" fill="none" stroke="${G}" stroke-width="1.3" opacity="0.6"/>
         ${eye(105,52,2.8)}${eye(115,52,2.8)}
         ${aura(110,110,42,13)}${shadow(110,143,38)}`;

    // ── Titan — colossal, layered shoulders, towering ──────────────────────────
    art['Titan'] =
        `<path d="M110,148 L82,102 L58,90 L66,56 L92,40 L94,14 L110,2 L126,14 L128,40 L154,56 L162,90 L138,102 Z" fill="${BG}" stroke="${G}" stroke-width="2.1"/>
         <path d="M58,90 Q40,92 28,102 M162,90 Q180,92 192,102" fill="${BGd}" stroke="${Gd}" stroke-width="1.4"/>
         ${eye(99,32,4.2)}${eye(121,32,4.2)}
         ${aura(110,124,52,16)}${shadow(110,148,54)}`;

    // ── Cursed — humanoid marred by cracks and binding chains ─────────────────
    art['Cursed'] =
        `<path d="M110,140 L94,106 L80,98 L84,74 L98,64 L100,44 L110,32 L120,44 L122,64 L136,74 L140,98 L126,106 Z" fill="${BG}" stroke="${G}" stroke-width="1.7"/>
         <path d="M100,50 L108,62 L98,72 L112,86 M120,52 L112,66 L122,76" fill="none" stroke="${G}" stroke-width="1" opacity="0.45"/>
         <path d="M88,100 Q84,116 90,130 M132,100 Q136,116 130,130" fill="none" stroke="${Gd}" stroke-width="1.3" opacity="0.55"/>
         ${eye(104,50,3)}${eye(116,50,3)}
         ${aura(110,112,38,12)}${shadow(110,143,38)}`;

    // ── Sovereign — crowned apex dragon, wings and horns ───────────────────────
    art['Sovereign'] =
        `<path d="M110,142 L90,108 L72,98 L78,70 L96,58 L98,34 L110,18 L122,34 L124,58 L142,70 L148,98 L130,108 Z" fill="${BG}" stroke="${G}" stroke-width="1.9"/>
         <path d="M78,70 Q46,58 22,60 Q48,78 80,86 M142,70 Q174,58 198,60 Q172,78 140,86" fill="${BG}" stroke="${G}" stroke-width="1.4" opacity="0.75"/>
         <path d="M98,32 Q92,16 82,6 Q98,16 100,34 M122,32 Q128,16 138,6 Q122,16 120,34" fill="${BG}" stroke="${G}" stroke-width="1.3"/>
         <ellipse cx="110" cy="24" rx="16" ry="5" fill="none" stroke="${G}" stroke-width="1.2" opacity="0.55"/>
         ${eye(103,54,3.4)}${eye(117,54,3.4)}
         ${aura(110,114,44,14)}${shadow(110,144,44)}`;

    // ── Primordial — ancient elemental mass, swirling runes ───────────────────
    art['Primordial'] =
        `<path d="M110,144 L84,116 L64,100 L72,68 L94,50 L98,20 L110,4 L122,20 L126,50 L148,68 L156,100 L136,116 Z" fill="${BG}" stroke="${G}" stroke-width="2"/>
         <ellipse cx="110" cy="78" rx="34" ry="34" fill="none" stroke="${Gd}" stroke-width="1.1" opacity="0.5"/>
         <path d="M86,60 Q110,50 134,60 M84,98 Q110,108 136,98" fill="none" stroke="${G}" stroke-width="1" opacity="0.4"/>
         ${eye(101,46,3.8)}${eye(119,46,3.8)}
         ${aura(110,120,48,15)}${shadow(110,146,48)}`;

    // ── Humanoid — general upright form ──────────────────────────────────────
    art['Humanoid'] =
        `<path d="M110,140 L94,106 L80,100 L84,78 L98,70 L100,50 L110,38 L120,50 L122,70 L136,78 L140,100 L126,106 Z" fill="${BG}" stroke="${G}" stroke-width="1.8"/>
         ${eye(104,54,3)}${eye(116,54,3)}
         ${aura(110,108,36,12)}${shadow(110,143)}`;

    return art;
})();

// Eye positions per race/type in SVG viewBox coordinates [x, y, radius].
// Used by the canvas particle system to place crimson eye-glow effects.
const ERA_RACE_EYES = {
    'Goblinoid':        [[106,85,2.8],[114,85,2.8]], 'Goblin': [[106,85,2.8],[114,85,2.8]],
    'Orc':              [[103,52,3.2],[117,52,3.2]],
    'Bugbear':          [[103,34,3.2],[117,34,3.2]],
    'Hobgoblin':        [[104,50,3],[116,50,3]],
    'Gnoll':            [[104,56,3],[116,56,3]],
    'Undead':           [[105,60,2.8],[115,60,2.8]], 'Skeleton': [[105,60,2.8],[115,60,2.8]],
    'Zombie':           [[104,55,3],[116,55,3]],   'Ghoul': [[102,50,3],[118,50,3]],
    'Vampire':          [[104,50,3],[116,50,3]],
    'Wraith':           [[104,52,2.8],[116,52,2.8]], 'Banshee': [[104,52,2.8],[116,52,2.8]],
    'Wight':            [[105,60,2.8],[115,60,2.8]], 'Revenant': [[105,60,2.8],[115,60,2.8]],
    'Mummy':            [[104,50,3],[116,50,3]],
    'Shadow':           [[105,55,2.4],[115,55,2.4]],
    'Demilich':         [[101,68,3.5],[119,68,3.5]],
    'Draconic':         [[103,60,3.8],[117,60,3.8]], 'Chromatic Dragon': [[103,60,3.8],[117,60,3.8]],
    'Metallic Dragon':  [[100,52,4],[120,52,4]],
    'Kobold':           [[105,72,2.5],[115,72,2.5]],
    'Lizardfolk':       [[104,54,3],[116,54,3]],
    'Yuan-ti':          [[104,48,3],[116,48,3]],
    'Dragonborn':       [[103,50,3.2],[117,50,3.2]],
    'Wyvern':           [[102,58,3.2],[118,58,3.2]],
    'Fey':              [[105,62,2.5],[115,62,2.5]],
    'Pixie':            [[106,88,2],[114,88,2]],
    'Dryad':            [[105,76,2.5],[115,76,2.5]],
    'Satyr':            [[104,62,2.5],[116,62,2.5]],
    'Quickling':        [[105,62,2.5],[115,62,2.5]],
    'Green Hag':        [[104,54,3],[116,54,3]],
    'Homunculus':       [[105,62,2.5],[115,62,2.5]],
    'Aberration':       [[103,50,3.5],[117,50,3.5]], 'Mind Flayer': [[103,50,3.5],[117,50,3.5]],
    'Beholder':         [[110,80,7]],
    'Aboleth':          [[88,78,3.5],[110,76,3.5],[132,78,3.5]],
    'Nothic':           [[103,50,3.5],[117,50,3.5]],
    'Gibbering Mouther':[[94,76,3],[110,70,3.5],[126,76,3],[86,92,2.5],[134,92,2.5]],
    'Ooze':             [[96,75,3],[124,75,3]],
    'Elemental':        [[103,66,3],[117,66,3]],
    'Monstrous':        [[102,46,3.5],[118,46,3.5]],
    'Tarrasque':        [[100,42,4],[120,42,4]],
    'Sphinx':           [[104,50,3],[116,50,3]],
    'Fiend':            [[103,50,3.2],[117,50,3.2]],
    'Giant':            [[101,34,4],[119,34,4]],
    'Construct':        [[104,52,3],[116,52,3]],
    'Lycanthrope':      [[103,48,3],[117,48,3]],
    'Flora':            [[103,60,3],[117,60,3]],
    'Aquatic':          [[103,38,3.8],[117,38,3.8]],
    'Kraken':           [[98,76,4],[122,76,4]],
    'Swarm':            [[80,98,1.8],[101,80,2.4],[111,80,2.4],[138,100,1.8],[112,116,2],[124,118,2],[88,122,1.4]],
    'Beast':            [[86,72,2.6]],
    'Specter':          [[103,56,2.4],[117,56,2.4]],
    'Planar':           [[103,58,3],[117,58,3]],
    'Celestial':        [[105,52,2.8],[115,52,2.8]],
    'Titan':            [[99,32,4.2],[121,32,4.2]],
    'Cursed':           [[104,50,3],[116,50,3]],
    'Sovereign':        [[103,54,3.4],[117,54,3.4]],
    'Primordial':       [[101,46,3.8],[119,46,3.8]],
    'Humanoid':         [[104,54,3],[116,54,3]],
};

function _setEraP3Art(raceName) {
    const art = document.getElementById('era-p3-art');
    const svg = document.getElementById('era-p3-svg');
    if (!art) return;
    const typeMap = {
        'tag-goblinoid': 'Goblinoid', 'tag-undead': 'Undead', 'tag-draconic': 'Draconic',
        'tag-fey': 'Fey', 'tag-aberration': 'Aberration', 'tag-ooze': 'Ooze',
        'tag-elemental': 'Elemental', 'tag-monstrous': 'Monstrous', 'tag-fiend': 'Fiend',
        'tag-giant': 'Giant', 'tag-construct': 'Construct', 'tag-lycanthrope': 'Lycanthrope',
        'tag-flora': 'Flora', 'tag-aquatic': 'Aquatic', 'tag-humanoid': 'Humanoid',
        'tag-swarm': 'Swarm', 'tag-beast': 'Beast', 'tag-specter': 'Specter',
        'tag-planar': 'Planar', 'tag-celestial': 'Celestial', 'tag-titan': 'Titan',
        'tag-cursed': 'Cursed', 'tag-sovereign': 'Sovereign', 'tag-primordial': 'Primordial',
    };
    let key = raceName;
    let artSvg = ERA_RACE_SVG[key];
    if (!artSvg && RACE_DATA[raceName]) {
        const typeName = typeMap[RACE_DATA[raceName].tag || ''];
        if (typeName) { key = typeName; artSvg = ERA_RACE_SVG[typeName]; }
    }
    art.innerHTML = artSvg || ERA_RACE_SVG['Humanoid'];
    // Store resolved eye positions for canvas particle system
    const eyes = ERA_RACE_EYES[raceName] || ERA_RACE_EYES[key] || ERA_RACE_EYES['Humanoid'];
    if (svg) svg.dataset.eyes = JSON.stringify(eyes);
}

function showEraTransition(raceName, onComplete) {
    _eraTransitionCallback = onComplete;

    // Inject race-specific artwork into panel III
    _setEraP3Art(raceName);

    // Inject pluralised race name into panel III lore
    const racePlural = raceName.endsWith('s') ? raceName : raceName + 's';
    const loreRace = document.querySelector('.era-panel-lore-race');
    if (loreRace) loreRace.innerHTML = '<em>' + racePlural + '</em> — arose from the dark, drawn by an instinct they couldn\'t name. They don\'t know what you are. They only know they follow something. Guide them well, and perhaps they\'ll give you the body you need.';

    const overlay = document.getElementById('era-transition-overlay');
    const panels  = document.querySelectorAll('.era-panel');
    const btn     = document.getElementById('era-transition-continue');
    const arc     = document.getElementById('era-timer-arc');

    // Clear any previous timer
    if (_eraTimerRAF)     { cancelAnimationFrame(_eraTimerRAF); _eraTimerRAF = null; }
    if (_eraTimerTimeout) { clearTimeout(_eraTimerTimeout); _eraTimerTimeout = null; }

    // Reset state
    panels.forEach(p => {
        p.classList.remove('era-panel-in');
        p.querySelectorAll('.era-panel-lore').forEach(l => l.classList.remove('era-lore-in'));
    });
    btn.classList.remove('era-btn-in', 'era-btn-pulse');
    if (arc) { arc.style.strokeDashoffset = '0'; arc.style.stroke = '#c8a028'; }
    overlay.classList.remove('era-hiding');
    overlay.classList.add('era-active');

    // Stagger panels in, then fade lore text in 400ms after each panel
    const delays = [150, 750, 1350, 1950, 2700];
    panels.forEach((p, i) => {
        setTimeout(() => {
            p.classList.add('era-panel-in');
            // Panel V lore is part of the panel itself — no separate trigger needed
            if (i < 4) {
                setTimeout(() => {
                    const lore = p.querySelector('.era-panel-lore');
                    if (lore) lore.classList.add('era-lore-in');
                }, 400);
            }
        }, delays[i]);
    });

    // ── Per-panel canvas particle animations, staggered 3s apart ──────────────
    // Each canvas is sized to its panel and activated after its stagger delay.
    // One shared RAF loop drives all active canvases.
    const TEAL = 'rgba(200,160,40,';   // D&D gold
    const FIRE = 'rgba(220,110,20,';   // torch orange
    const CRIM = 'rgba(192,57,43,';    // crimson eye glow
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

        // For each panel, measure where the SVG sits within the panel so particle
        // positions can be expressed relative to the SVG artwork, not the full canvas.
        const canvases = panelEls.map((p, i) => {
            const c = document.getElementById('era-canvas-' + (i + 1));
            if (!c || !p) return null;
            c.width  = p.offsetWidth  || 400;
            c.height = p.offsetHeight || 160;
            const svg = p.querySelector('.era-panel-svg');
            let svgX = 0, svgY = 0, svgW = c.width, svgH = c.height;
            if (svg) {
                const pr = p.getBoundingClientRect();
                const sr = svg.getBoundingClientRect();
                svgX = sr.left - pr.left;
                svgY = sr.top  - pr.top;
                svgW = sr.width  || 180;
                svgH = sr.height || 130;
            }
            return { el: c, ctx: c.getContext('2d'),
                     w: c.width, h: c.height,
                     sx: svgX, sy: svgY, sw: svgW, sh: svgH,
                     active: false, t: 0 };
        });

        // Particle pools per panel
        // Panel 1 — torch sparks rising from flame; torch is at SVG (110/220, 14%)
        const p1 = [];
        function spawnEmber(cv) {
            const ox = cv.sx + cv.sw * (110/220);
            const oy = cv.sy + cv.sh * 0.14;
            p1.push({ x: ox + (Math.random()-0.5)*8, y: oy,
                      vx: (Math.random()-0.5)*0.6, vy: -(0.6 + Math.random()*1.4),
                      life: 1, size: 0.7 + Math.random()*1.2, fire: Math.random() > 0.4 });
        }

        // Panel 2 — dust motes drifting through portcullis; gate spans 28–78% of SVG width
        const p2 = [];
        function spawnCrackMote(cv) {
            const ox = cv.sx + cv.sw * (0.28 + Math.random()*0.44);
            const oy = cv.sy + cv.sh * (0.20 + Math.random()*0.65);
            p2.push({ x: ox, y: oy, vx: (Math.random()-0.5)*0.15, vy: -0.05 - Math.random()*0.12,
                      life: 1, size: 0.5 + Math.random()*0.8 });
        }

        // Panel 3 — shadow motes rising from creature silhouette
        const p3 = [];
        function spawnOrbitMote(cv) {
            // Use creature center (average of eye positions) as mote origin
            const p3svg = document.getElementById('era-p3-svg');
            const eyeData = p3svg && p3svg.dataset.eyes ? JSON.parse(p3svg.dataset.eyes) : [[104,54,3],[116,54,3]];
            const avgEyeX = eyeData.reduce((s,e)=>s+e[0],0)/eyeData.length;
            const avgEyeY = eyeData.reduce((s,e)=>s+e[1],0)/eyeData.length;
            const ox = cv.sx + cv.sw * ((avgEyeX/220) + (Math.random()-0.5)*0.22);
            const oy = cv.sy + cv.sh * ((avgEyeY/160) + 0.12 + Math.random()*0.30);
            p3.push({ x: ox, y: oy, vx: (Math.random()-0.5)*0.2, vy: -(0.2 + Math.random()*0.5),
                      life: 1, size: 0.8 + Math.random()*1.0, crimson: Math.random() > 0.7 });
        }

        // Panel 4 — sparks from left sconce (86/220) and right (134/220) at y 58/160
        const p4 = [];
        function spawnTraveller(cv) {
            const left = Math.random() > 0.5;
            const ox = cv.sx + cv.sw * (left ? 86/220 : 134/220);
            const oy = cv.sy + cv.sh * (58/160);
            p4.push({ x: ox + (Math.random()-0.5)*4, y: oy,
                      vx: (Math.random()-0.5)*0.35, vy: -(0.4 + Math.random()*0.9),
                      life: 1, size: 0.6 + Math.random()*1.0, trail: [] });
        }

        // Panel 5 — heraldic shield is centered in the full-width SVG (440×120)
        const p5waves = [];
        const p5motes = [];
        function spawnWave(cv) {
            p5waves.push({ r: 8, maxR: Math.min(cv.w, cv.h)*0.46, life: 1 });
        }
        function spawnFinalMote(cv) {
            const cx = cv.w / 2, cy = cv.h * 0.48;
            const angle = Math.random()*Math.PI*2;
            const dist  = 14 + Math.random()*cv.w*0.18;
            p5motes.push({ x: cx + Math.cos(angle)*dist, y: cy + Math.sin(angle)*dist*0.55,
                           vx: (Math.random()-0.5)*0.2, vy: (Math.random()-0.5)*0.2,
                           life: 1, size: 0.6 + Math.random()*1.2,
                           twinklePhase: Math.random()*Math.PI*2 });
        }

        let lastT = performance.now();
        let spawnTick = 0;

        // Activate canvases timed to match panel stagger delays
        const canvasDelays = [150, 750, 1350, 1950, 2700];
        canvases.forEach((cv, i) => {
            if (!cv) return;
            setTimeout(() => {
                cv.active = true;
                cv.el.classList.add('era-canvas-active');
                if (i === 0) for (let k=0; k<8;  k++) spawnEmber(cv);
                if (i === 1) for (let k=0; k<6;  k++) spawnCrackMote(cv);
                if (i === 2) for (let k=0; k<5;  k++) spawnOrbitMote(cv);
                if (i === 3) for (let k=0; k<4;  k++) spawnTraveller(cv);
                if (i === 4) { spawnWave(cv); for (let k=0; k<8; k++) spawnFinalMote(cv); }
            }, canvasDelays[i]);
        });

        function loopEraCanvas(now) {
            _eraCanvasRAF = requestAnimationFrame(loopEraCanvas);
            const dt = Math.min(now - lastT, 50);
            lastT = now;
            spawnTick += dt;

            canvases.forEach((cv, idx) => {
                if (!cv || !cv.active) return;
                cv.t += dt;
                const ctx = cv.ctx;
                ctx.clearRect(0, 0, cv.w, cv.h);

                // ── Panel 1: torch sparks + floor bloom + flame flicker ──────
                if (idx === 0) {
                    if (spawnTick > 60 && p1.length < 32) spawnEmber(cv);
                    for (let i = p1.length-1; i >= 0; i--) {
                        const e = p1[i];
                        e.x += e.vx; e.y += e.vy; e.vx += (Math.random()-0.5)*0.08;
                        e.vy *= 0.992;
                        e.life -= 0.010;
                        if (e.life <= 0 || e.y < cv.sy - 4) { p1.splice(i,1); continue; }
                        const a = e.life * 0.85;
                        ctx.beginPath(); ctx.arc(e.x, e.y, e.size, 0, Math.PI*2);
                        ctx.fillStyle = e.fire ? FIRE + a + ')' : TEAL + (a*0.5) + ')';
                        ctx.shadowBlur = e.fire ? 8 : 4;
                        ctx.shadowColor = e.fire ? '#dc6e14' : '#c8a028';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Floor bloom below torch
                    const torchX = cv.sx + cv.sw * (110/220);
                    const floorY = cv.sy + cv.sh * 0.88;
                    const pulse = 0.09 + 0.06 * Math.sin(cv.t * 0.004);
                    const grad = ctx.createRadialGradient(torchX, floorY, 0, torchX, floorY, cv.sw*0.45);
                    grad.addColorStop(0, FIRE + pulse + ')');
                    grad.addColorStop(1, FIRE + '0)');
                    ctx.beginPath(); ctx.ellipse(torchX, floorY, cv.sw*0.45, cv.sh*0.12, 0, 0, Math.PI*2);
                    ctx.fillStyle = grad; ctx.fill();
                    // Flame head glow
                    const flameY = cv.sy + cv.sh * 0.12;
                    const fFlicker = 0.14 + 0.10 * Math.sin(cv.t * 0.009);
                    const fg = ctx.createRadialGradient(torchX, flameY, 0, torchX, flameY, 18);
                    fg.addColorStop(0, 'rgba(255,200,80,' + (fFlicker*2) + ')');
                    fg.addColorStop(1, FIRE + '0)');
                    ctx.beginPath(); ctx.arc(torchX, flameY, 18, 0, Math.PI*2);
                    ctx.fillStyle = fg; ctx.fill();
                }

                // ── Panel 2: dust motes + golden gate glow ───────────────────
                if (idx === 1) {
                    if (spawnTick > 100 && p2.length < 26) spawnCrackMote(cv);
                    const gateX = cv.sx + cv.sw * 0.5;
                    const gateY = cv.sy + cv.sh * 0.54;
                    const glow = 0.06 + 0.03 * Math.sin(cv.t * 0.002);
                    const lg = ctx.createRadialGradient(gateX, gateY, 0, gateX, gateY, cv.sw*0.38);
                    lg.addColorStop(0, TEAL + glow + ')');
                    lg.addColorStop(1, TEAL + '0)');
                    ctx.fillStyle = lg; ctx.fillRect(0, 0, cv.w, cv.h);
                    for (let i = p2.length-1; i >= 0; i--) {
                        const m = p2[i];
                        m.x += m.vx + Math.sin(cv.t*0.001 + i)*0.04;
                        m.y += m.vy;
                        m.life -= 0.006;
                        if (m.life <= 0 || m.y < cv.sy) { p2.splice(i,1); continue; }
                        const twinkle = 0.4 + 0.35 * Math.sin(cv.t*0.006 + i*1.3);
                        ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL + (m.life * twinkle) + ')';
                        ctx.shadowBlur = 5; ctx.shadowColor = '#c8a028';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                }

                // ── Panel 3: eye glows + shadow motes ────────────────────────
                if (idx === 2) {
                    if (spawnTick > 180 && p3.length < 14) spawnOrbitMote(cv);
                    for (let i = p3.length-1; i >= 0; i--) {
                        const o = p3[i];
                        o.x += o.vx; o.y += o.vy;
                        o.life -= 0.005;
                        if (o.life <= 0 || o.y < cv.sy) { p3.splice(i,1); continue; }
                        ctx.beginPath(); ctx.arc(o.x, o.y, o.size, 0, Math.PI*2);
                        ctx.fillStyle = o.crimson ? CRIM+(o.life*0.5)+')' : TEAL+(o.life*0.35)+')';
                        ctx.shadowBlur = o.crimson ? 10 : 5;
                        ctx.shadowColor = o.crimson ? '#c0392b' : '#c8a028';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Map SVG eye coordinates into canvas space via SVG offset
                    const xS = cv.sw / 220, yS = cv.sh / 160;
                    const eyePulse = 0.22 + 0.18 * Math.sin(cv.t * 0.003);
                    const p3svg = document.getElementById('era-p3-svg');
                    const eyeData = p3svg && p3svg.dataset.eyes ? JSON.parse(p3svg.dataset.eyes) : [[104,54,3],[116,54,3]];
                    eyeData.forEach(([ex,ey,er=3]) => {
                        const px = cv.sx + ex*xS, py = cv.sy + ey*yS;
                        const glowR = (er * 4) * xS;
                        const eg = ctx.createRadialGradient(px,py,0,px,py,glowR);
                        eg.addColorStop(0, CRIM + eyePulse + ')');
                        eg.addColorStop(1, CRIM + '0)');
                        ctx.beginPath(); ctx.arc(px, py, glowR, 0, Math.PI*2);
                        ctx.fillStyle = eg; ctx.fill();
                    });
                }

                // ── Panel 4: sconce sparks + corridor glow ───────────────────
                if (idx === 3) {
                    if (spawnTick > 80 && p4.length < 24) spawnTraveller(cv);
                    for (let i = p4.length-1; i >= 0; i--) {
                        const t4 = p4[i];
                        t4.trail.push({x: t4.x, y: t4.y});
                        if (t4.trail.length > 6) t4.trail.shift();
                        t4.x += t4.vx; t4.y += t4.vy; t4.vx += (Math.random()-0.5)*0.07;
                        t4.life -= 0.012;
                        if (t4.life <= 0 || t4.y < cv.sy - 4) { p4.splice(i,1); continue; }
                        t4.trail.forEach((pt, ti) => {
                            const ta = (ti/t4.trail.length) * t4.life * 0.45;
                            ctx.beginPath(); ctx.arc(pt.x, pt.y, t4.size*0.5, 0, Math.PI*2);
                            ctx.fillStyle = FIRE + ta + ')'; ctx.fill();
                        });
                        ctx.beginPath(); ctx.arc(t4.x, t4.y, t4.size, 0, Math.PI*2);
                        ctx.fillStyle = FIRE + (t4.life * 0.9) + ')';
                        ctx.shadowBlur = 7; ctx.shadowColor = '#dc6e14';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Sconce warmth glows at mapped SVG positions
                    const xS = cv.sw / 220, yS = cv.sh / 160;
                    [[86/220, 58/160], [134/220, 58/160]].forEach(([xF, yF], si) => {
                        const flicker = 0.1 + 0.08 * Math.sin(cv.t*0.007 + si*2.1);
                        const sx = cv.sx + cv.sw * xF, sy = cv.sy + cv.sh * yF;
                        const sg = ctx.createRadialGradient(sx,sy,0,sx,sy,28*xS);
                        sg.addColorStop(0, FIRE + flicker + ')');
                        sg.addColorStop(1, FIRE + '0)');
                        ctx.beginPath(); ctx.arc(sx, sy, 28*xS, 0, Math.PI*2);
                        ctx.fillStyle = sg; ctx.fill();
                    });
                    // Distant doorway glow at vanishing point (110/220, 80/160 in SVG)
                    const dpX = cv.sx + cv.sw * (110/220), dpY = cv.sy + cv.sh * (80/160);
                    const dp = 0.07 + 0.04 * Math.sin(cv.t*0.002);
                    const dg = ctx.createRadialGradient(dpX, dpY, 0, dpX, dpY, 22*xS);
                    dg.addColorStop(0, TEAL + dp + ')'); dg.addColorStop(1, TEAL + '0)');
                    ctx.beginPath(); ctx.arc(dpX, dpY, 22*xS, 0, Math.PI*2);
                    ctx.fillStyle = dg; ctx.fill();
                }

                // ── Panel 5: heraldic pulse waves + coin glints ──────────────
                if (idx === 4) {
                    if (spawnTick > 1600 && p5waves.length < 3) spawnWave(cv);
                    if (spawnTick > 300  && p5motes.length < 24) spawnFinalMote(cv);
                    const cx = cv.w/2, cy = cv.h*0.48;
                    for (let i = p5waves.length-1; i >= 0; i--) {
                        const w = p5waves[i];
                        w.r += (w.maxR - w.r)*0.01 + 0.35;
                        w.life -= 0.004;
                        if (w.life <= 0) { p5waves.splice(i,1); continue; }
                        ctx.beginPath(); ctx.arc(cx, cy, w.r, 0, Math.PI*2);
                        ctx.strokeStyle = TEAL + (w.life*0.20) + ')';
                        ctx.lineWidth = 1.5; ctx.stroke();
                    }
                    for (let i = p5motes.length-1; i >= 0; i--) {
                        const m = p5motes[i];
                        m.x += m.vx; m.y += m.vy; m.life -= 0.003;
                        m.twinklePhase += 0.07;
                        if (m.life <= 0) { p5motes.splice(i,1); continue; }
                        const twinkle = 0.5 + 0.5*Math.sin(m.twinklePhase);
                        ctx.beginPath(); ctx.arc(m.x, m.y, m.size, 0, Math.PI*2);
                        ctx.fillStyle = TEAL + (m.life * twinkle * 0.75) + ')';
                        ctx.shadowBlur = 7; ctx.shadowColor = '#c8a028';
                        ctx.fill(); ctx.shadowBlur = 0;
                    }
                    // Jewel crimson pulse (shield center jewel at 220/440 x, 44/120 y)
                    const jx = cv.w/2, jy = cv.h*(44/120);
                    const jp = 0.25 + 0.18*Math.sin(cv.t*0.003);
                    const jg = ctx.createRadialGradient(jx,jy,0,jx,jy,16);
                    jg.addColorStop(0, CRIM+jp+')'); jg.addColorStop(1, CRIM+'0)');
                    ctx.beginPath(); ctx.arc(jx, jy, 16, 0, Math.PI*2);
                    ctx.fillStyle = jg; ctx.fill();
                    // Slow rotating arc on outer crest ring
                    const rot = cv.t * 0.0003;
                    const rr  = cv.w * 0.122;  // ~54px ring radius scaled to canvas
                    ctx.beginPath(); ctx.arc(cx, cy, rr, rot, rot + Math.PI*0.28);
                    ctx.strokeStyle = TEAL + '0.22)'; ctx.lineWidth = 2; ctx.stroke();
                }
            });

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

    if (node.legendary) {
        const prestiged = new Set(Object.keys(gameState.meta.racesPlayed || {}));
        const isUnlocked = prestiged.has(node.race);
        if (!isUnlocked) {
            return `
                <div class="bld-tt-name">&#128274; ${node.name}</div>
                <div class="era1-legendary-unlock-label">Unlock condition</div>
                <div class="bld-tt-desc">${node.legendaryUnlock || 'Unknown — keep exploring this lineage.'}</div>
            `;
        }
    }

    const costEntries = Object.entries(node.cost);
    let costHtml = '';
    if (costEntries.length === 0) {
        costHtml = '<span class="era1-cost-free">Free</span>';
    } else {
        const ERA1_RES_LABELS = { essence: 'Anima', influence: 'Influence', mana: 'Mana' };
        costHtml = costEntries.map(([res, amt]) => {
            const have = Math.floor(gameState.resources[res] || 0);
            const ok = have >= amt;
            const label = ERA1_RES_LABELS[res] || (res.charAt(0).toUpperCase() + res.slice(1));
            return `<span class="${ok ? 'era1-cost-ok' : 'era1-cost-bad'}">${amt} ${label}</span>`;
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
    const times = _clickMult;
    let bought = 0;
    for (let i = 0; i < times; i++) {
        const cost = getReservoirUpgradeCost();
        if ((gameState.resources.essence || 0) < cost) break;
        gameState.resources.essence -= cost;
        if (!gameState.era1Upgrades) gameState.era1Upgrades = {};
        gameState.era1Upgrades.reservoirExpansion = ((gameState.era1Upgrades.reservoirExpansion) || 0) + 1;
        bought++;
    }
    if (bought === 0) return;
    updateUI();
    saveGame();
}

function gatherEra1(action) {
    const r = gameState.resources;
    const essence = Math.floor(r.essence || 0);
    const caps = getCaps();

    if (action === 'essence') {
        r.essence = Math.min((r.essence || 0) + 1, caps.essence);
    } else if (action === 'toInfluence') {
        if (essence < 2) return;
        r.essence   = (r.essence || 0) - 2;
        r.influence = Math.min((r.influence || 0) + 1, caps.influence);
    } else if (action === 'toMana') {
        if (essence < 5) return;
        r.essence = (r.essence || 0) - 5;
        r.mana    = Math.min((r.mana || 0) + 1, caps.mana);
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

    html += `<button class="action-btn" onclick="gatherEra1('essence')" data-stip="Anima is the raw spiritual energy that underlies all dungeon power — the ambient force of will, hunger, and dark intent given form. You draw it inward through focused stillness, coalescing the latent essence of this place into something you can wield.">
        <span class="action-title">Manifest</span>
        <span class="action-yield">+1 Anima</span>
    </button>`;

    {
        const cls = canInfluence ? '' : ' disabled';
        html += `<button class="action-btn${cls}" onclick="gatherEra1('toInfluence')" data-stip="Influence is the measure of your presence in the world beyond these walls — how feared, revered, or acknowledged you are by those above. Exerting Will burns portions of your stored Anima to push that presence outward, bending perception and reputation through sheer force of dark intent.">
            <span class="action-title">Exert Will</span>
            <span class="action-yield">-2 Anima → +1 Influence</span>
        </button>`;
    }

    {
        const cls = canMana ? '' : ' disabled';
        html += `<button class="action-btn${cls}" onclick="gatherEra1('toMana')" data-stip="The Weave is the invisible lattice of magical energy that suffuses all of existence in the Forgotten Realms — the medium through which spells are cast, artifacts empowered, and arcane will made manifest. You reach into its threads and draw out a measure of raw Mana, spending deep reserves of Anima to bridge the gap between your will and the fabric of magic itself.">
            <span class="action-title">Tap the Weave</span>
            <span class="action-yield">-5 Anima → +1 Mana</span>
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

let _era1LoreLayer = -1;
function renderEra1Lore(frontierLayer) {
    const el = document.getElementById('era1-lore');
    if (!el) return;
    if (frontierLayer < 1 || frontierLayer > 5) {
        if (_era1LoreLayer !== 0) { el.innerHTML = ''; _era1LoreLayer = 0; }
        return;
    }
    if (frontierLayer === _era1LoreLayer) return;
    _era1LoreLayer = frontierLayer;
    const lore = ERA1_LORE[frontierLayer - 1];
    el.innerHTML =
        `<div class="era1-lore">` +
        `<div class="era1-lore-heading">◈ ${lore.heading}?</div>` +
        `<hr class="era1-lore-rule">` +
        `<div class="era1-lore-body">${lore.body}</div>` +
        `</div>`;
}

// ── Era 1 Full Tree Canvas ────────────────────────────────────────────────────
// Zoomable/pannable canvas showing the entire awakening tree.
// Deep → left, Wild → down, Beyond → right from the root.

let _era1TreeState = '';
let _era1Canvas = null; // Legacy global canvas state; local discovery view does not pan/zoom.
let _era1FocusedNodeId = null;
let _era1DiscoveryResizeBound = false;

// Node dimensions and spacing
const ERA1_NODE_W  = 130;
const ERA1_NODE_H  = 54;
const ERA1_LEAF_W  = 110;  // L5 leaf node width
const ERA1_LEAF_H  = 44;   // L5 leaf node height

// Radial layout parameters (L0–L4 only; L5 clusters around L4 parent)
const ERA1_RADII = [0, 260, 500, 740, 1000]; // radius per layer (L0–L4)
// Angular step between adjacent leaves in a cluster, in radians.
// At R=1000, step=0.14 rad → ~140px chord, comfortably larger than LEAF_W.
const ERA1_LEAF_STEP = 0.245;

// Compute layout positions for all nodes in the full tree.
// Returns Map<nodeId, {x, y}> in canvas coordinates.
// Root is at (0,0). Three domain branches at 120° increments (270°, 30°, 150°).
// L0–L4 nodes sit on concentric rings; L5 leaves cluster in a tight arc around
// their L4 parent at a short fixed offset beyond R4.
function era1ComputeLayout() {
    const pos = new Map();

    // Domain base angles: Deep=270° (up), Wild=30° (lower-right), Beyond=150° (lower-left)
    const DOMAIN_BASE_DEG = { deep: 270, wild: 30, beyond: 150 };
    const SECTOR   = (2 * Math.PI) / 3;  // 120° per domain
    const EDGE_GAP = 0.08;               // radians kept from each sector edge

    // ── Leaf count: how many L5 descendants does a node have? ──────────────────
    function leafCount(nodeId) {
        const node = ERA1_TREE[nodeId];
        if (!node) return 0;
        if (node.children.length === 0) return 1;
        return node.children.reduce((s, cid) => s + leafCount(cid), 0);
    }

    // ── Recursive weighted placement (L0–L4) ───────────────────────────────────
    // arcStart/arcEnd: the angular slice this node owns.
    // The node is placed at the center of its slice; children divide the slice
    // proportionally by their leaf counts.
    function placeNode(nodeId, arcStart, arcEnd) {
        const node   = ERA1_TREE[nodeId];
        if (!node) return;
        const midAng = (arcStart + arcEnd) / 2;
        const r      = ERA1_RADII[node.layer] || 0;
        pos.set(nodeId, { x: Math.cos(midAng) * r, y: Math.sin(midAng) * r });

        if (node.layer === 4 || node.children.length === 0) return;

        const total  = node.children.reduce((s, cid) => s + leafCount(cid), 0);
        const usable = arcEnd - arcStart;
        let cursor   = arcStart;
        for (const cid of node.children) {
            const share = (leafCount(cid) / total) * usable;
            placeNode(cid, cursor, cursor + share);
            cursor += share;
        }
    }

    // Root at center
    pos.set('root', { x: 0, y: 0 });

    // Each domain gets exactly 120°; within that, weighted by leaf count
    for (const domainId of ERA1_DOMAINS) {
        const baseRad  = DOMAIN_BASE_DEG[domainId] * Math.PI / 180;
        const arcStart = baseRad - SECTOR / 2 + EDGE_GAP;
        const arcEnd   = baseRad + SECTOR / 2 - EDGE_GAP;
        placeNode(domainId, arcStart, arcEnd);
    }

    // ── L5 leaves: orbit their L4 parent in a local circle ─────────────────────
    // Distributed evenly around the L4 node, orbit starts outward (away from root).
    const LEAF_ORBIT_R = 185;

    for (const [nodeId, node] of Object.entries(ERA1_TREE)) {
        if (node.layer !== 4 || node.children.length === 0) continue;
        const leaves  = node.children;
        const n       = leaves.length;
        const l4pos   = pos.get(nodeId);
        const l4ang   = Math.atan2(l4pos.y, l4pos.x); // outward radial direction
        const startAng = l4ang - Math.PI * (n - 1) / n;
        for (let i = 0; i < n; i++) {
            const a = startAng + i * (2 * Math.PI / n);
            pos.set(leaves[i], {
                x: l4pos.x + Math.cos(a) * LEAF_ORBIT_R,
                y: l4pos.y + Math.sin(a) * LEAF_ORBIT_R,
            });
        }
    }

    return pos;
}

function renderEra1TreeLegacy() {
    const container = document.getElementById('era1-tree');
    if (!container) return;
    if ((gameState.run.era || 1) !== 1) { container.innerHTML = ''; renderEra1Lore(0); return; }

    const era1    = gameState.era1 || { unlocked: [], chosen: null };
    const unlocked = new Set(era1.unlocked || []);
    const revealed = era1GetRevealedRaces();
    const offeredNames = new Set((era1.raceOptions && era1.raceOptions.names) || []);
    const prestiged    = new Set(Object.keys(gameState.meta.racesPlayed || {}));

    // Determine frontier layer for lore
    const chosenL1 = era1GetChosenChild('root');
    const chosenL2 = chosenL1 ? era1GetChosenChild(chosenL1) : null;
    const chosenL3 = chosenL2 ? era1GetChosenChild(chosenL2) : null;
    const chosenL4 = chosenL3 ? era1GetChosenChild(chosenL3) : null;
    const frontierLayer = !chosenL1 ? 1 : !chosenL2 ? 2 : !chosenL3 ? 3 : !chosenL4 ? 4 : 5;
    renderEra1Lore(frontierLayer);

    // State key — rebuild only when something meaningful changes
    const stateKey = [...unlocked].join(',') + '|' + [...revealed].join(',') + '|' + getCaps().essence;
    if (stateKey === _era1TreeState && _era1Canvas) {
        era1UpdateNodeStyles(unlocked, revealed, offeredNames, prestiged);
        return;
    }
    _era1TreeState = stateKey;
    era1HidePanel();

    // ── Build canvas wrapper ──────────────────────────────────────────────────
    container.innerHTML = `
        <div class="era1-canvas-wrap" id="era1-canvas-wrap">
            <svg class="era1-canvas-svg" id="era1-canvas-svg" style="position:absolute;top:0;left:0;width:100%;height:100%;overflow:visible;pointer-events:none;"></svg>
            <div class="era1-canvas-nodes" id="era1-canvas-nodes"></div>
            <div class="era1-legend" id="era1-legend">
                <span class="era1-leg era1-leg-chosen">Chosen path</span>
                <span class="era1-leg era1-leg-prestiged">Unlocked</span>
                <span class="era1-leg era1-leg-offered">Offered this run</span>
                <span class="era1-leg era1-leg-fogged">Undiscovered</span>
            </div>
        </div>`;

    const wrap      = document.getElementById('era1-canvas-wrap');
    const svgEl     = document.getElementById('era1-canvas-svg');
    const nodeLayer = document.getElementById('era1-canvas-nodes');

    // ── Compute layout ────────────────────────────────────────────────────────
    const positions = era1ComputeLayout();

    // Find bounding box to size the canvas
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    for (const [nodeId, p] of positions) {
        const node = ERA1_TREE[nodeId];
        const hw = (node && node.layer === 5 ? ERA1_LEAF_W : ERA1_NODE_W) / 2;
        const hh = (node && node.layer === 5 ? ERA1_LEAF_H : ERA1_NODE_H) / 2;
        minX = Math.min(minX, p.x - hw);
        maxX = Math.max(maxX, p.x + hw);
        minY = Math.min(minY, p.y - hh);
        maxY = Math.max(maxY, p.y + hh);
    }
    const PADDING = 60;
    const canvasW = maxX - minX + PADDING * 2;
    const canvasH = maxY - minY + PADDING * 2;
    const ox = -minX + PADDING; // origin offset so (0,0) maps correctly

    nodeLayer.style.width  = canvasW + 'px';
    nodeLayer.style.height = canvasH + 'px';

    // ── Draw SVG connector lines ──────────────────────────────────────────────
    const DOMAIN_COLORS = { deep: '#8899aa', wild: '#5a9e60', beyond: '#8866bb' };
    let svgContent = '';
    for (const [nodeId, node] of Object.entries(ERA1_TREE)) {
        if (!node.parent) continue;
        const ppos = positions.get(node.parent);
        const cpos = positions.get(nodeId);
        if (!ppos || !cpos) continue;
        const color  = era1GetColor(nodeId, DOMAIN_COLORS);
        const px = ppos.x + ox;
        const py = ppos.y + ox; // note: using separate axes below
        const cx = cpos.x + ox;
        const cy = cpos.y + ox;
        // Correct y: uses oy not ox
        const pY = ppos.y + (PADDING - minY);
        const cY = cpos.y + (PADDING - minY);
        const pX = ppos.x + (PADDING - minX);
        const cX = cpos.x + (PADDING - minX);

        // Determine if this node is on the chosen path
        const onPath = unlocked.has(nodeId) || unlocked.has(node.parent) || nodeId === 'root' || node.parent === 'root';
        const opacity = onPath ? 0.7 : 0.2;
        // Bezier curve for smooth look
        const midX = (pX + cX) / 2;
        const midY = (pY + cY) / 2;
        svgContent += `<path d="M${pX},${pY} C${midX},${pY} ${midX},${cY} ${cX},${cY}"
            stroke="${color}" stroke-width="${onPath ? 2 : 1}" fill="none" opacity="${opacity}"/>`;
    }
    svgEl.innerHTML = svgContent;
    svgEl.style.width  = canvasW + 'px';
    svgEl.style.height = canvasH + 'px';

    // ── Place node elements ───────────────────────────────────────────────────
    for (const [nodeId, node] of Object.entries(ERA1_TREE)) {
        const p = positions.get(nodeId);
        if (!p) continue;
        const nw = node.layer === 5 ? ERA1_LEAF_W : ERA1_NODE_W;
        const nh = node.layer === 5 ? ERA1_LEAF_H : ERA1_NODE_H;
        const x = p.x + (PADDING - minX) - nw / 2;
        const y = p.y + (PADDING - minY) - nh / 2;

        const el = document.createElement('div');
        el.className = 'era1-cn'; // canvas node
        el.id = 'era1-node-' + nodeId;
        el.style.left   = x + 'px';
        el.style.top    = y + 'px';
        el.style.width  = nw + 'px';
        el.style.height = nh + 'px';
        el.setAttribute('data-nid', nodeId);

        if (node.layer === 5 && node.legendary) {
            // Legendary leaf — earned, not chosen. Always fogged with a lock
            // glyph until prestiged; never appears in random offers.
            el.classList.add('era1-cn-legendary');
            const isPrestiged = prestiged.has(node.race);
            const isChosen    = unlocked.has(nodeId) || (era1.chosen === nodeId);
            if (isChosen || isPrestiged) {
                el.innerHTML = `<div class="era1-lc-crown">&#10022;</div><div class="era1-cn-name">${node.name}</div><div class="era1-cn-sub">${node.type}</div>`;
            } else {
                el.innerHTML = `<div class="era1-lc-lock">&#128274;</div>`;
            }
        } else if (node.layer === 5) {
            // Race leaf — may be fogged
            const isRevealed = revealed.has(node.race);
            const isOffered  = offeredNames.has(node.race);
            const isPrestiged = prestiged.has(node.race);
            const isChosen   = unlocked.has(nodeId) || (era1.chosen === nodeId);
            if (isChosen) {
                el.innerHTML = `<div class="era1-cn-name">${node.name}</div><div class="era1-cn-sub">${node.type}</div>`;
            } else if (isPrestiged) {
                el.innerHTML = `<div class="era1-cn-name">${node.name}</div><div class="era1-cn-sub">${node.type}</div>`;
            } else if (isOffered) {
                el.innerHTML = `<div class="era1-cn-name">${node.name}</div><div class="era1-cn-sub">offered</div>`;
            } else {
                el.innerHTML = `<div class="era1-cn-fog">?</div>`;
            }
        } else {
            el.innerHTML = `<div class="era1-cn-name">${node.name}</div>`;
        }

        el.addEventListener('mouseenter', e => era1ShowPanel(nodeId, e));
        el.addEventListener('mousemove',  e => _era1MoveTooltip(e));
        el.addEventListener('mouseleave', () => era1HidePanel());
        el.addEventListener('click',      () => unlockEra1Node(nodeId));
        nodeLayer.appendChild(el);
    }

    // Apply visual state classes
    era1UpdateNodeStyles(unlocked, revealed, offeredNames, prestiged);

    // ── Pan & zoom ────────────────────────────────────────────────────────────
    let zoom = 0.52, panX = 0, panY = 0;
    let dragging = false, lastMX = 0, lastMY = 0;

    function applyTransform() {
        nodeLayer.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
        nodeLayer.style.transformOrigin = '0 0';
        svgEl.style.transform = `translate(${panX}px,${panY}px) scale(${zoom})`;
        svgEl.style.transformOrigin = '0 0';
    }

    // Initial center: root node
    function centerOnNode(nodeId) {
        const p = positions.get(nodeId);
        if (!p) return;
        const wRect = wrap.getBoundingClientRect();
        const nx = p.x + (PADDING - minX);
        const ny = p.y + (PADDING - minY);
        panX = wRect.width  / 2 - nx * zoom;
        panY = wRect.height / 2 - ny * zoom;
        applyTransform();
    }

    _era1Canvas = { wrap, svgEl, nodeLayer, positions, minX, minY, PADDING,
                    get zoom() { return zoom; }, set zoom(v) { zoom = v; },
                    get panX() { return panX; }, set panX(v) { panX = v; },
                    get panY() { return panY; }, set panY(v) { panY = v; },
                    applyTransform, centerOnNode };

    centerOnNode('root');

    wrap.addEventListener('wheel', e => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? 0.9 : 1.1;
        const rect  = wrap.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        panX = mx - (mx - panX) * delta;
        panY = my - (my - panY) * delta;
        zoom = Math.max(0.25, Math.min(2.5, zoom * delta));
        applyTransform();
    }, { passive: false });

    wrap.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        dragging = true;
        lastMX = e.clientX;
        lastMY = e.clientY;
        wrap.style.cursor = 'grabbing';
    });

    // ── Auto-recenter after 3s of no mouse movement over the wrap ────────────
    let _idleTimer = null;
    function resetIdleTimer() {
        clearTimeout(_idleTimer);
        _idleTimer = setTimeout(() => era1PanToMostRecent(), 3000);
    }
    wrap.addEventListener('mousemove', resetIdleTimer);
    wrap.addEventListener('mouseleave', () => clearTimeout(_idleTimer));

    window.addEventListener('mousemove', e => {
        if (!dragging) return;
        panX += e.clientX - lastMX;
        panY += e.clientY - lastMY;
        lastMX = e.clientX;
        lastMY = e.clientY;
        applyTransform();
        resetIdleTimer();
    });
    window.addEventListener('mouseup', () => {
        dragging = false;
        if (wrap) wrap.style.cursor = 'grab';
    });
    wrap.style.cursor = 'grab';
}

// Apply the most-specific color for a node as an inline --dn-clr CSS variable.
const _ERA1_DOMAIN_COLORS_STATIC = { deep: '#8899aa', wild: '#5a9e60', beyond: '#8866bb' };
function era1ApplyColorClass(el, nodeId) {
    const color = era1GetColor(nodeId, _ERA1_DOMAIN_COLORS_STATIC);
    if (color) el.style.setProperty('--dn-clr', color);
}

// Classify and apply CSS state classes to all nodes without full rebuild.
function era1UpdateNodeStyles(unlocked, revealed, offeredNames, prestiged) {
    const era1    = gameState.era1 || {};
    const chosenL5 = era1.chosen;

    for (const [nodeId, node] of Object.entries(ERA1_TREE)) {
        const el = document.getElementById('era1-node-' + nodeId);
        if (!el) continue;

        // Remove all state classes
        el.classList.remove(
            'era1-cn-root', 'era1-cn-chosen', 'era1-cn-unlocked-path',
            'era1-cn-sibling', 'era1-cn-active', 'era1-cn-waiting',
            'era1-cn-prestiged', 'era1-cn-offered', 'era1-cn-fogged',
            'era1-cn-deep', 'era1-cn-wild', 'era1-cn-beyond',
            'era1-cn-dominance', 'era1-cn-wisdom', 'era1-cn-growth',
            'era1-cn-hunt', 'era1-cn-undying', 'era1-cn-bargain'
        );

        era1ApplyColorClass(el, nodeId);

        if (node.layer === 0) {
            el.classList.add('era1-cn-root');
            continue;
        }

        const isUnlocked = unlocked.has(nodeId);
        const parentUnlocked = node.parent && unlocked.has(node.parent);
        const isChosen = nodeId === chosenL5;

        if (node.layer === 5 && node.legendary) {
            const race = node.race || '';
            const isRaceChosen = isChosen || isUnlocked;
            const isPrestiged  = prestiged.has(race);

            if (isRaceChosen) {
                el.classList.add('era1-cn-chosen');
            } else if (isPrestiged) {
                el.classList.add('era1-cn-prestiged');
                el.style.pointerEvents = '';
            } else {
                el.classList.add('era1-cn-fogged');
                el.style.pointerEvents = 'none';
            }
        } else if (node.layer === 5) {
            const race = node.race || '';
            const isRaceChosen  = isChosen || (isUnlocked);
            const isPrestiged   = prestiged.has(race);
            const isOffered     = offeredNames.has(race);

            if (isRaceChosen) {
                el.classList.add('era1-cn-chosen');
            } else if (isPrestiged) {
                el.classList.add('era1-cn-prestiged');
                el.style.pointerEvents = '';
            } else if (isOffered && parentUnlocked) {
                el.classList.add('era1-cn-offered');
                const affordable = canAffordEra1(nodeId);
                if (!affordable) el.classList.add('era1-cn-waiting');
                el.style.pointerEvents = '';
            } else {
                el.classList.add('era1-cn-fogged');
                el.style.pointerEvents = 'none';
            }
        } else {
            if (isUnlocked) {
                el.classList.add('era1-cn-chosen');
            } else if (parentUnlocked) {
                const affordable = canAffordEra1(nodeId);
                el.classList.add(affordable ? 'era1-cn-active' : 'era1-cn-waiting');
            } else {
                el.classList.add('era1-cn-sibling');
            }
        }
    }
}

// After a node is unlocked, smoothly pan to the most recently unlocked node.
function era1PanToMostRecent() {
    if (!_era1Canvas) return;
    const era1 = gameState.era1 || {};
    const unlocked = era1.unlocked || [];
    const lastId = unlocked[unlocked.length - 1];
    if (!lastId) return;
    const c = _era1Canvas;
    const p = c.positions.get(lastId);
    if (!p) return;
    const wRect = c.wrap.getBoundingClientRect();
    const nx = p.x + (c.PADDING - c.minX || 0);
    const ny = p.y + (c.PADDING - c.minY || 0);
    const targetPanX = wRect.width  / 2 - nx * c.zoom;
    const targetPanY = wRect.height / 2 - ny * c.zoom;
    const startX = c.panX, startY = c.panY;
    const dx = targetPanX - startX, dy = targetPanY - startY;
    let start = null;
    function step(ts) {
        if (!start) start = ts;
        const t = Math.min((ts - start) / 400, 1);
        const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        c.panX = startX + dx * ease;
        c.panY = startY + dy * ease;
        c.applyTransform();
        if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

// ── Tab visibility gating (Era 1 vs Era 2) ───────────────────────────────────

function renderEra1Tree() {
    const container = document.getElementById('era1-tree');
    if (!container) return;
    if ((gameState.run.era || 1) !== 1) {
        container.innerHTML = '';
        renderEra1Lore(0);
        return;
    }

    const era1 = gameState.era1 || { unlocked: [], chosen: null };
    const unlocked = new Set(era1.unlocked || []);
    const revealed = era1GetRevealedRaces();
    const offeredNames = new Set((era1.raceOptions && era1.raceOptions.names) || []);
    const prestiged = new Set(Object.keys(gameState.meta.racesPlayed || {}));

    const chosenL1 = era1GetChosenChild('root');
    const chosenL2 = chosenL1 ? era1GetChosenChild(chosenL1) : null;
    const chosenL3 = chosenL2 ? era1GetChosenChild(chosenL2) : null;
    const chosenL4 = chosenL3 ? era1GetChosenChild(chosenL3) : null;
    const frontierLayer = !chosenL1 ? 1 : !chosenL2 ? 2 : !chosenL3 ? 3 : !chosenL4 ? 4 : 5;
    renderEra1Lore(frontierLayer);

    const centerId = era1GetDiscoveryFocusId();
    _era1FocusedNodeId = centerId;
    // Only re-render when affordability changes, not on every resource tick.
    const affordableKey = Object.keys(ERA1_TREE)
        .filter(id => era1NodeCanUnlock(ERA1_TREE[id], unlocked, offeredNames))
        .sort().join(',');
    const stateKey = [
        centerId,
        [...unlocked].join(','),
        [...revealed].join(','),
        [...offeredNames].join(','),
        [...prestiged].join(','),
        affordableKey,
    ].join('|');
    if (stateKey === _era1TreeState && document.getElementById('era1-discovery-wrap')) return;

    _era1TreeState = stateKey;
    _era1Canvas = null;
    era1HidePanel();
    container.innerHTML = `
        <div class="era1-breadcrumbs" id="era1-breadcrumbs"></div>
        <div class="era1-discovery-wrap" id="era1-discovery-wrap">
            <svg class="era1-discovery-svg" id="era1-discovery-svg" viewBox="0 0 900 480" preserveAspectRatio="xMidYMid meet" aria-hidden="true"></svg>
            <div class="era1-discovery-nodes" id="era1-discovery-nodes"></div>
            <div class="era1-legend" id="era1-legend">
                <span class="era1-leg era1-leg-chosen">Center</span>
                <span class="era1-leg era1-leg-offered">New</span>
                <span class="era1-leg era1-leg-prestiged">Previously played</span>
                <span class="era1-leg era1-leg-fogged">Unknown</span>
            </div>
        </div>`;

    era1RenderBreadcrumbs(centerId);
    era1RenderDiscoveryScene(centerId, unlocked, revealed, offeredNames, prestiged);
    era1FitDiscoveryScene();
    if (!_era1DiscoveryResizeBound) {
        window.addEventListener('resize', era1FitDiscoveryScene);
        _era1DiscoveryResizeBound = true;
    }
}

function era1GetDiscoveryFocusId() {
    const era1 = gameState.era1 || {};
    if (_era1FocusedNodeId && ERA1_TREE[_era1FocusedNodeId]) return _era1FocusedNodeId;
    if (era1.chosen && ERA1_TREE[era1.chosen]) return era1.chosen;
    const unlocked = era1.unlocked || [];
    for (let i = unlocked.length - 1; i >= 0; i--) {
        if (ERA1_TREE[unlocked[i]]) return unlocked[i];
    }
    return 'root';
}

function era1FocusNode(nodeId) {
    if (!ERA1_TREE[nodeId]) return;
    // Once a L1 domain is chosen, root is no longer navigable
    if (nodeId === 'root') {
        const era1 = gameState.era1 || {};
        const unlocked = new Set(era1.unlocked || []);
        const hasChosenDomain = ['deep', 'wild', 'beyond'].some(id => unlocked.has(id));
        if (hasChosenDomain) return;
    }
    _era1FocusedNodeId = nodeId;
    _era1TreeState = '';
    renderEra1Tree();
}

function era1PathToRoot(nodeId) {
    const path = [];
    let node = ERA1_TREE[nodeId];
    while (node) {
        path.unshift(node.id);
        node = node.parent ? ERA1_TREE[node.parent] : null;
    }
    return path;
}

function era1RenderBreadcrumbs(centerId) {
    const el = document.getElementById('era1-breadcrumbs');
    if (!el) return;
    el.innerHTML = '';
    const era1 = gameState.era1 || {};
    const unlocked = new Set(era1.unlocked || []);
    const hasChosenDomain = ['deep', 'wild', 'beyond'].some(id => unlocked.has(id));
    // Hide when root is centered (nothing to navigate to) or after domain is committed
    const centerIsRoot = centerId === 'root';
    el.style.display = (hasChosenDomain || centerIsRoot) ? 'none' : '';
    if (hasChosenDomain || centerIsRoot) return;
    era1PathToRoot(centerId).forEach((nodeId, idx, path) => {
        const node = ERA1_TREE[nodeId];
        if (!node) return;
        const btn = document.createElement('button');
        btn.className = 'era1-crumb' + (nodeId === centerId ? ' era1-crumb-current' : '');
        btn.textContent = node.name;
        btn.addEventListener('click', () => era1FocusNode(nodeId));
        el.appendChild(btn);
        if (idx < path.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'era1-crumb-sep';
            sep.textContent = '>';
            el.appendChild(sep);
        }
    });
}

function era1LayerLabel(layer) {
    return ['', 'domain', 'drive', 'form', 'type', 'race'][layer] || '';
}

function era1NodeKnowledge(node, unlocked, revealed, offeredNames, prestiged) {
    if (!node) return 'unknown';
    if (node.layer < 5) {
        if (node.id === 'root' || unlocked.has(node.id)) return 'discovered';
        if (node.parent && unlocked.has(node.parent)) return 'seen';
        return 'seen';
    }
    if (unlocked.has(node.id) || prestiged.has(node.race)) return 'discovered';
    if (offeredNames.has(node.race) || revealed.has(node.race)) return 'seen';
    return 'unknown';
}

function era1NodeCanUnlock(node, unlocked, offeredNames) {
    if (!node || node.id === 'root' || unlocked.has(node.id)) return false;
    if (!node.parent || (node.parent !== 'root' && !unlocked.has(node.parent))) return false;
    if (node.layer === 5 && !offeredNames.has(node.race)) return false;
    return canAffordEra1(node.id);
}

function era1RenderDiscoveryScene(centerId, unlocked, revealed, offeredNames, prestiged) {
    const nodeLayer = document.getElementById('era1-discovery-nodes');
    const svgEl = document.getElementById('era1-discovery-svg');
    if (!nodeLayer || !svgEl) return;

    const center = ERA1_TREE[centerId] || ERA1_TREE.root;
    const parentIds = center.parent ? [center.parent] : [];
    const childIds = (center.children || []).slice().sort((a, b) => {
        const an = ERA1_TREE[a], bn = ERA1_TREE[b];
        const ak = era1NodeKnowledge(an, unlocked, revealed, offeredNames, prestiged);
        const bk = era1NodeKnowledge(bn, unlocked, revealed, offeredNames, prestiged);
        // Legendary leaves always stay visible (as a lock) ahead of unseen
        // standard races, so they never get pushed behind a "+more" stub.
        const rank = { discovered: 0, seen: 1, legendary: 2, unknown: 3 };
        const aKey = (ak === 'unknown' && an && an.legendary) ? 'legendary' : ak;
        const bKey = (bk === 'unknown' && bn && bn.legendary) ? 'legendary' : bk;
        return (rank[aKey] || 9) - (rank[bKey] || 9);
    });
    const siblingIds = center.parent
        ? (ERA1_TREE[center.parent].children || []).filter(id => id !== center.id)
        : [];
    const slots = [{ id: center.id, role: 'center', x: 370, y: 196, w: 160, h: 88 }];

    function spread(ids, role, x, w, h, limit) {
        // Always keep legendary leaves visible even past the normal cap —
        // they're a fixed, small set and shouldn't hide behind "+more".
        const legendaryIds = ids.filter(id => ERA1_TREE[id] && ERA1_TREE[id].legendary);
        const normalIds = ids.filter(id => !ERA1_TREE[id] || !ERA1_TREE[id].legendary);
        const visible = normalIds.slice(0, limit).concat(legendaryIds);
        if (!visible.length) return;
        const gap = visible.length === 1 ? 0 : Math.min(82, 284 / (visible.length - 1));
        const start = 240 - ((visible.length - 1) * gap) / 2 - h / 2;
        visible.forEach((id, i) => slots.push({ id, role, x, y: start + i * gap, w, h }));
        if (normalIds.length > limit) {
            slots.push({ id: visible[normalIds.slice(0, limit).length - 1], role: role + '-more', forceUnknown: true, x, y: start + visible.length * gap, w, h });
        }
    }

    spread(parentIds, 'parent', 84, 132, 58, 3);
    spread(childIds, 'child', 684, 132, center.layer === 4 ? 48 : 58, 8);

    // Only show siblings when the center node itself has not been committed yet —
    // once unlocked, the player has chosen past them so they shouldn't appear connected.
    const centerIsUnlocked = unlocked.has(center.id) || center.id === 'root';
    if (!centerIsUnlocked) {
        const sibs = siblingIds.slice(0, 6);
        sibs.filter((_, i) => i % 2 === 0).forEach((id, i) => {
            slots.push({ id, role: 'sibling', x: 278 + i * 118, y: 58, w: 112, h: 46 });
        });
        sibs.filter((_, i) => i % 2 === 1).forEach((id, i) => {
            slots.push({ id, role: 'sibling', x: 278 + i * 118, y: 376, w: 112, h: 46 });
        });
        if (siblingIds.length > 6 && sibs.length) {
            slots.push({ id: sibs[sibs.length - 1], role: 'sibling-more', forceUnknown: true, x: 632, y: 376, w: 112, h: 46 });
        }
    }

    const colors = { deep: '#8899aa', wild: '#5a9e60', beyond: '#8866bb' };
    const centerSlot = slots[0];
    const centerMid = { x: centerSlot.x + centerSlot.w / 2, y: centerSlot.y + centerSlot.h / 2 };
    svgEl.innerHTML = slots.slice(1).map(slot => {
        const node = ERA1_TREE[slot.id];
        if (!node) return '';
        const mid = { x: slot.x + slot.w / 2, y: slot.y + slot.h / 2 };
        const color = era1GetColor(node.id, colors) || era1GetColor(center.id, colors) || '#6b706f';
        const opacity = slot.forceUnknown ? 0.28 : 0.58;
        if (slot.role.indexOf('sibling') === 0) {
            return `<path d="M${centerMid.x},${centerMid.y} C${centerMid.x},${mid.y} ${mid.x},${centerMid.y} ${mid.x},${mid.y}" stroke="${color}" stroke-width="1.5" fill="none" opacity="${opacity}"/>`;
        }
        const bendX = (centerMid.x + mid.x) / 2;
        return `<path d="M${centerMid.x},${centerMid.y} C${bendX},${centerMid.y} ${bendX},${mid.y} ${mid.x},${mid.y}" stroke="${color}" stroke-width="2" fill="none" opacity="${opacity}"/>`;
    }).join('');

    nodeLayer.innerHTML = '';
    const isRootCentered = center.id === 'root';
    slots.forEach((slot, i) => {
        const el = era1CreateDiscoveryNode(slot, unlocked, revealed, offeredNames, prestiged);
        if (!el) return;
        el.style.animationDelay = Math.min(i * 35, 260) + 'ms';
        el.classList.add('era1-node-enter');
        if (isRootCentered && slot.role === 'child') el.classList.add('era1-root-children');
        nodeLayer.appendChild(el);
    });
}

function era1FitDiscoveryScene() {
    const wrap = document.getElementById('era1-discovery-wrap');
    if (!wrap) return;
    const scale = Math.min(1, wrap.clientWidth / 900, wrap.clientHeight / 480);
    wrap.style.setProperty('--era1-disc-scale', String(Math.max(0.58, scale)));
}

function era1CreateDiscoveryNode(slot, unlocked, revealed, offeredNames, prestiged) {
    const node = ERA1_TREE[slot.id];
    if (!node) return null;
    const knowledge = slot.forceUnknown ? 'unknown' : era1NodeKnowledge(node, unlocked, revealed, offeredNames, prestiged);
    const el = document.createElement('div');
    const isCenter = slot.role === 'center';
    const isUnlocked = unlocked.has(node.id) || node.id === 'root';
    const isOffered = node.layer === 5 && offeredNames.has(node.race);
    const isPrestiged = node.layer === 5 && prestiged.has(node.race);
    const canUnlock = era1NodeCanUnlock(node, unlocked, offeredNames);
    const isLegendary = !!node.legendary;
    const legendaryLocked = isLegendary && !isPrestiged && !isUnlocked;

    el.className = 'era1-cn era1-dnode era1-dnode-' + slot.role;
    era1ApplyColorClass(el, node.id);
    if (isLegendary) el.classList.add('era1-cn-legendary');
    if (node.id === 'root') el.classList.add('era1-cn-root');
    if (isCenter) el.classList.add('era1-cn-chosen', 'era1-dnode-center');
    else if (legendaryLocked) el.classList.add('era1-cn-fogged');
    else if (knowledge === 'unknown') el.classList.add('era1-cn-fogged', 'era1-dnode-unknown');
    else if (isPrestiged) el.classList.add('era1-cn-prestiged');
    else if (isOffered) el.classList.add('era1-cn-offered');
    else if (isUnlocked) el.classList.add('era1-cn-chosen');
    else el.classList.add(canUnlock ? 'era1-cn-active' : 'era1-cn-waiting');

    el.id = slot.forceUnknown ? 'era1-node-more-' + slot.role : 'era1-node-' + node.id;
    el.style.left = slot.x + 'px';
    el.style.top = slot.y + 'px';
    el.style.width = slot.w + 'px';
    el.style.height = slot.h + 'px';
    el.setAttribute('data-nid', node.id);

    // Legendary leaves are earned, not chosen — always show a lock (or crown
    // once earned) instead of the generic "???" fog, with their own tooltip.
    if (legendaryLocked) {
        el.innerHTML = `<div class="era1-lc-lock">&#128274;</div>`;
        el.addEventListener('mouseenter', e => era1ShowPanel(node.id, e));
        el.addEventListener('mousemove', e => _era1MoveTooltip(e));
        el.addEventListener('mouseleave', () => era1HidePanel());
        el.style.pointerEvents = '';
        el.style.cursor = 'default';
        return el;
    }

    if (knowledge === 'unknown') {
        el.innerHTML = `<div class="era1-cn-fog">???</div>`;
        el.style.pointerEvents = 'none';
        return el;
    }

    const sub = node.layer === 5
        ? (isOffered ? 'new' : isPrestiged ? 'previously played' : node.type)
        : era1LayerLabel(node.layer);
    const rootPrompt = (node.id === 'root' && isCenter)
        ? `<div class="era1-cn-prompt">Choose your domain →</div>` : '';
    const crown = isLegendary ? `<div class="era1-lc-crown">&#10022;</div>` : '';
    el.innerHTML = `${crown}<div class="era1-cn-name">${node.name}</div>${sub ? `<div class="era1-cn-sub">${sub}</div>` : ''}${rootPrompt}`;
    el.addEventListener('mouseenter', e => era1ShowPanel(node.id, e));
    el.addEventListener('mousemove', e => _era1MoveTooltip(e));
    el.addEventListener('mouseleave', () => era1HidePanel());
    el.addEventListener('click', () => {
        if (isUnlocked && slot.role !== 'parent') {
            era1FocusNode(node.id);
            return;
        }
        if (isUnlocked) return;
        if (!canUnlock) {
            el.classList.add('era1-flash-deny');
            setTimeout(() => el.classList.remove('era1-flash-deny'), 600);
            return;
        }
        _era1FocusedNodeId = node.id;
        unlockEra1Node(node.id);
    });
    return el;
}

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

    // Trade tab: visible in Era 2 once at least one Market Stall is built
    const tradeBtn = document.querySelector('.tab-btn[data-tab="trade"]');
    if (tradeBtn) {
        const showTrade = era >= 2 && (gameState.buildings.marketStall > 0);
        tradeBtn.style.display = showTrade ? '' : 'none';
    }

    // Show/hide left-column elements that only belong in Era 2
    const displayEra2 = era === 1 ? 'none' : '';
    document.querySelectorAll('.era2-only').forEach(el => {
        el.style.display = displayEra2;
    });

    // Show/hide elements that only belong in Era 1
    const displayEra1 = era === 1 ? '' : 'none';
    document.querySelectorAll('.era1-only').forEach(el => {
        el.style.display = displayEra1;
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
        if (!activeTab || [...era2Tabs, 'trade'].includes(activeTab.dataset.tab)) {
            switchTab('awakening');
        }
    }
}

// Creature roster, grouped by type. Kept in sync with RACE_LEAF_DEFS in era1tree.js.
// Used for the Dev tab race dropdown and race-data population.
const CREATURE_ROSTER = {
    "Goblinoid":   ["Goblin", "Hobgoblin", "Bugbear", "Orc", "Gnoll", "Barghest"],
    "Giant":       ["Hill Giant", "Stone Giant", "Frost Giant", "Fire Giant", "Cloud Giant", "Storm Giant"],
    "Swarm":       ["Stirge", "Cranium Rat", "Rot Grub", "Shadow Swarm", "Spore Cloud", "Plague Locust"],
    "Aberration":  ["Mind Flayer", "Beholder", "Aboleth", "Gibbering Mouther", "Nothic", "Chuul", "Grell", "Flumph"],
    "Construct":   ["Stone Golem", "Iron Golem", "Animated Armor", "Clay Golem", "Flesh Golem", "Clockwork Horror"],
    "Draconic":    ["Metallic Dragon", "Lizardfolk", "Kobold", "Yuan-ti", "Wyvern", "Dragonborn"],
    "Flora":       ["Treant", "Myconid", "Vegepygmy", "Shambling Mound", "Vine Blight", "Wood Woad"],
    "Ooze":        ["Gelatinous Cube", "Black Pudding", "Gray Ooze", "Ochre Jelly", "Void Ooze", "Oblex"],
    "Lycanthrope": ["Werebear", "Wererat", "Wereboar", "Owlbear", "Displacer Beast", "Weretiger"],
    "Aquatic":     ["Merfolk", "Sahuagin", "Kuo-toa", "Triton", "Sea Hag", "Locathah"],
    "Monstrous":   ["Harpy", "Medusa", "Minotaur", "Troll", "Naga", "Basilisk", "Chimera", "Manticore", "Griffon", "Hydra", "Ettin", "Worg"],
    "Beast":       ["Dire Wolf", "Cave Bear", "Giant Eagle", "Sabre Cat", "Giant Ape", "Bulette"],
    "Undead":      ["Skeleton", "Zombie", "Vampire", "Wight", "Ghoul", "Revenant", "Banshee", "Wraith", "Mummy", "Demilich", "Shadow"],
    "Elemental":   ["Fire Elemental", "Earth Elemental", "Water Elemental", "Air Elemental", "Magmin", "Galeb Duhr"],
    "Specter":     ["Ghost", "Specter", "Poltergeist", "Will-o'-Wisp", "Nighthaunt", "Allip"],
    "Fiend":       ["Imp", "Cambion", "Barbed Devil", "Night Hag", "Succubus/Incubus", "Pit Fiend", "Balor", "Rakshasa", "Quasit", "Shadow Demon"],
    "Humanoid":    ["Kenku", "Tabaxi", "Aarakocra", "Tortle", "Centaur", "Human", "Elf", "Dwarf", "Half-Orc", "Gnome"],
    "Planar":      ["Githzerai", "Githyanki", "Modron", "Slaad", "Xorn", "Inevitables"],
    "Celestial":   ["Planetar", "Deva", "Couatl", "Pegasus", "Unicorn", "Hollyphant"],
    "Titan":       ["Empyrean", "Behemoth", "Astral Dreadnought", "Leviathan", "War Colossus", "Elder Titan"],
    "Cursed":      ["Death Knight", "Petrified Medusa", "Werewolf", "Serpent Abomination", "Cursed Knight", "Wereraven"],
    "Fey":         ["Pixie", "Satyr", "Dryad", "Redcap", "Quickling", "Green Hag"],
    "Sovereign":   ["Wyrm", "Umbral Hunter", "Storm Roc", "Ironback", "Rift Drake", "Ashborn"],
    "Primordial":  ["Elder Tempest", "Zaratan", "Abyssal Tide", "Elder Fire", "Obyrith", "Void Shard"],
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
                { name: "Cramped Quarters", pos: true,  desc: "Hovels house 8 creatures instead of 1." },
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
            effects: { foodConsumption: 2.0, growthBonus: 2.5, allProductionBonus: 0.02, coinCapBonus: { flat: 1000, pct: 0.10 } },
            mods: [
                { name: "Dragon's Hoard",    pos: true,  desc: "Coin cap +1,000 coins + 10% of tier base — hoarding is instinct." },
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
            effects: { foodConsumption: 0.45, growthBonus: 1.80, allProductionBonus: 0.02, storageBonus: 20 },
            mods: [
                { name: "Absorptive Physiology", pos: true,  desc: "Population eats only 45% of normal food — oozes absorb ambient nutrients." },
                { name: "Vast Capacity",         pos: true,  desc: "Storage buildings hold 20 more of each resource per building." },
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
            effects: { foodConsumption: 1.35, growthBonus: 0.9, allProductionBonus: 0.02, productionBonus: { quarry: 1.15, mine: 1.15 } },
            mods: [
                { name: "Brute Labor",        pos: true,  desc: "Quarries and Mines produce 15% more. All passive production +2%." },
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
            effects: { foodConsumption: 2.0, growthBonus: 3.0, allProductionBonus: 0.02, lairHousing: 2, capBonus: { food: 200, wood: 100, stone: 200 } },
            mods: [
                { name: "Vast Stores",      pos: true,  desc: "Food cap +200, Stone cap +200, Wood cap +100." },
                { name: "Titan's Hunger",   pos: false, desc: "Population eats ×2 food per tick." },
                { name: "Giant Footprint",  pos: false, desc: "Each Hovel houses only 2 Giants — they need far more space." },
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
            effects: { allProductionBonus: 0.02, taxBonus: 1, growthBonus: 0.90, gatherBonus: { food: 1, wood: 1, stone: 1 } },
            mods: [
                { name: "Civic Organization",  pos: true, desc: "+1 extra cp per creature per day from taxes (active even without Taxation research)." },
                { name: "Versatile Gatherers", pos: true, desc: "+1 food, +1 wood, +1 stone per manual gather." },
                { name: "Quick to Multiply",   pos: true, desc: "Growth timer 10% shorter." },
            ],
        },
        "Swarm": {
            tag: "tag-swarm",
            effects: { foodConsumption: 0.20, growthBonus: 0.50, allGatherBonus: 1 },
            mods: [
                { name: "Countless",       pos: true,  desc: "+1 to all manual gather yields — there are simply too many of them." },
                { name: "Minimal Upkeep", pos: true,  desc: "80% reduced food consumption — individually, each needs almost nothing." },
                { name: "Rapid Swarm",    pos: true,  desc: "Growth timer halved — swarms replenish themselves faster than anything else." },
            ],
        },
        "Beast": {
            tag: "tag-beast",
            effects: { foodConsumption: 1.20, growthBonus: 0.80, productionBonus: { huntingLodge: 1.15 }, allGatherBonus: 1 },
            mods: [
                { name: "Predator Instincts", pos: true,  desc: "Hunting Lodges produce 15% more; +1 to all manual gather yields." },
                { name: "Swift Pack",          pos: true,  desc: "Growth timer 20% shorter — beasts multiply quickly." },
                { name: "Voracious",           pos: false, desc: "Population eats 20% more food — apex predators require substantial feeding." },
            ],
        },
        "Specter": {
            tag: "tag-specter",
            effects: { foodConsumption: 0.05, growthBonus: 2.0, capBonus: { arcaneEssence: 50 } },
            mods: [
                { name: "Incorporeal",     pos: true,  desc: "95% reduced food consumption — specters sustain on ambient life energy." },
                { name: "Essence Bleed",   pos: true,  desc: "Arcane Essence cap +50 — their presence draws essence from the living." },
                { name: "Slow to Manifest",pos: false, desc: "Growth timer ×2 — specters must coalesce from grief and residual will." },
            ],
        },
        "Planar": {
            tag: "tag-planar",
            effects: { foodConsumption: 0.60, growthBonus: 1.50, allProductionBonus: 0.02, converterBonus: { arcaneGrinder: 1.10 } },
            mods: [
                { name: "Planar Logic",    pos: true,  desc: "+2% all production — planar beings optimize processes through alien efficiency." },
                { name: "Arcane Resonance",pos: true,  desc: "Arcane Grinders 10% more efficient — their inter-planar nature enhances arcane conversion." },
                { name: "Planar Appetite", pos: true,  desc: "40% reduced food consumption — sustained by planar energy." },
                { name: "Slow Crossing",   pos: false, desc: "Growth timer 1.5× longer — planar beings are difficult to summon or bind." },
            ],
        },
        "Celestial": {
            tag: "tag-celestial",
            effects: { foodConsumption: 0.40, growthBonus: 1.80, allProductionBonus: 0.02, taxBonus: 1 },
            mods: [
                { name: "Divine Presence", pos: true,  desc: "+2% all production and +1 cp/creature/day — their grace inspires workers." },
                { name: "Celestial Diet",  pos: true,  desc: "60% reduced food consumption — celestials sustain from divine energy." },
                { name: "Rare Grace",      pos: false, desc: "Growth timer 1.8× longer — celestials are difficult to call to dark service." },
            ],
        },
        "Titan": {
            tag: "tag-titan",
            effects: { foodConsumption: 3.0, growthBonus: 4.0, allProductionBonus: 0.03, lairHousing: 1 },
            mods: [
                { name: "Mythic Scale",     pos: true,  desc: "+3% all production — titans amplify everything around them by sheer presence." },
                { name: "Immense Hunger",   pos: false, desc: "Population eats ×3 food per tick — titans require colossal sustenance." },
                { name: "Singular Form",    pos: false, desc: "Only 1 fits per Hovel — titans cannot share space." },
                { name: "Age of Formation", pos: false, desc: "Growth timer ×4 — titans do not arise, they coalesce over ages." },
            ],
        },
        "Cursed": {
            tag: "tag-cursed",
            effects: { foodConsumption: 0.80, growthBonus: 1.20, allProductionBonus: 0.02, capBonus: { bones: 75 } },
            mods: [
                { name: "Cursed Drive",    pos: true,  desc: "+2% all production — the curse that unmade them now fuels their labor." },
                { name: "Bone Hunger",     pos: true,  desc: "Bone cap +75 — cursed beings leave a trail of the dead." },
                { name: "Dark Resilience", pos: true,  desc: "20% reduced food consumption — curses sustain what hunger cannot." },
                { name: "Slow Corruption", pos: false, desc: "Growth timer 1.2× longer — curses spread at their own pace." },
            ],
        },
        "Sovereign": {
            tag: "tag-sovereign",
            effects: { foodConsumption: 2.0, growthBonus: 3.0, allProductionBonus: 0.03, coinCapBonus: { flat: 2000, pct: 0.15 }, lairHousing: 1 },
            mods: [
                { name: "Singular Power",  pos: true,  desc: "+3% all production and Coin cap +2,000 + 15% of tier base — legends reshape the dungeon." },
                { name: "Ravenous Legend", pos: false, desc: "Population eats ×2 food per tick." },
                { name: "Singular Form",   pos: false, desc: "Only 1 fits per Hovel — legends occupy a category of one." },
                { name: "Epoch Growth",    pos: false, desc: "Growth timer ×3 — legendary creatures are measured in eras, not seasons." },
            ],
        },
        "Primordial": {
            tag: "tag-primordial",
            effects: { foodConsumption: 0.10, growthBonus: 3.50, allProductionBonus: 0.03, storageBonus: 20 },
            mods: [
                { name: "Pre-Cosmic",      pos: true,  desc: "+3% all production; Storage buildings hold 20 more — primordials predate the rules." },
                { name: "Ancient Hunger",  pos: true,  desc: "90% reduced food consumption — primordials sustain from ambient void energy." },
                { name: "Epoch Scale",     pos: false, desc: "Growth timer 3.5× longer — primordials do not arrive; they drift into being." },
            ],
        },
    };

    // ── Creature-specific descriptions and optional extra effects / mods ──────
    const CREATURES = {
        // ── Draconic ─────────────────────────────────────────────────────────
        "Metallic Dragon": {
            desc: "Noble and wise, metallic dragons accumulate vast treasures and forge alliances that yield enormous wealth.",
            extraEffects: { coinCapBonus: { flat: 1000, pct: 0.10 } },
            extraMods: [{ name: "Noble Hoard", pos: true, desc: "Coin cap +1,000 coins + 10% of tier base, stacking with Draconic bonus." }],
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
        "Wight": {
            desc: "Fallen warriors animated by hate. They dominate lesser undead and push work quotas higher through sheer menace.",
            extraEffects: { allProductionBonus: 0.02 },
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
            extraEffects: { allProductionBonus: 0.02 },
        },
        "Bugbear": {
            desc: "Massive goblinoids who excel at brute labor. Their size makes them less efficient in standard lairs.",
            extraEffects: { productionBonus: { quarry: 1.10, mine: 1.10 }, lairHousing: 6 },
            extraMods: [{ name: "Bugbear Brawn", pos: true, desc: "Quarries and Mines extra +10%. Hovels house 6 Bugbears." }],
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
        "Barghest": {
            desc: "A fiend-touched goblinoid wolf-beast who stalks and feeds on souls. Barghests grow more powerful with every creature they consume, boosting dungeon output as their hunger is sated.",
            extraEffects: { productionBonus: { huntingLodge: 1.10 }, allProductionBonus: 0.02 },
            extraMods: [{ name: "Soul-Fed Growth", pos: true, desc: "Hunting Lodges extra +10%; extra +2% all production — the barghest's power grows with each kill." }],
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
            extraEffects: { allProductionBonus: 0.02 },
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
            extraEffects: { allProductionBonus: 0.02 },
        },
        "Beholder": {
            desc: "The paranoid many-eyed tyrant. A beholder's disintegration ray mines stone and ore at alarming rates.",
            extraEffects: { productionBonus: { quarry: 1.15, mine: 1.15 } },
            extraMods: [{ name: "Disintegration Mining", pos: true, desc: "Quarries and Mines extra +15%." }],
        },
        "Aboleth": {
            desc: "Ancient aquatic tyrants with memories older than civilization. Their thralls work with preternatural focus.",
            extraEffects: { allProductionBonus: 0.02 },
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
            extraEffects: { allProductionBonus: 0.02, taxBonus: 1 },
            extraMods: [{ name: "Benevolent Aura", pos: true, desc: "Extra +2% all production and +1 cp/creature/day — the good vibes are real." }],
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
        "Oblex": {
            desc: "A cunning ooze that absorbs the memories of those it consumes, then disguises itself as its victims. Oblexes use stolen knowledge to streamline arcane and alchemical processes.",
            extraEffects: { converterBonus: { alchemyLab: 1.10, arcaneGrinder: 1.10 }, taxBonus: 1 },
            extraMods: [{ name: "Stolen Memories", pos: true, desc: "Alchemy Labs and Arcane Grinders extra +10%; +1 cp/creature/day — the oblex impersonates your best workers." }],
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
        "Magmin": {
            desc: "Squat, manic creatures of living magma who can't help but set things on fire — including, helpfully, the fuel for your smelters and forges. Their chaotic enthusiasm somehow accelerates coal and metal production.",
            extraEffects: { productionBonus: { coalSeam: 1.15 }, converterBonus: { smelter: 1.10 }, foodConsumption: 1.15 },
            extraMods: [{ name: "Pyromaniac Glee", pos: true, desc: "Coal Seams extra +15%; Smelters extra +10%. Eats 15% more — burning things works up an appetite." }],
        },
        "Galeb Duhr": {
            desc: "Ancient boulder-beings who roll through the dungeon with deceptive patience. Galeb Duhr have a deep attunement to stone and can animate nearby rocks to assist in quarrying.",
            extraEffects: { productionBonus: { quarry: 1.15 }, gatherBonus: { stone: 2 }, capBonus: { stone: 75 } },
            extraMods: [{ name: "Rolling Warden", pos: true, desc: "Quarries extra +15%; +2 stone per manual gather; Stone cap +75." }],
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
            extraEffects: { foodConsumption: 1.2, allProductionBonus: 0.02 },
            extraMods: [{ name: "Regenerating Workforce", pos: true, desc: "Extra +2% all production; eats 20% more (stacks with Monstrous base)." }],
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
            extraEffects: { allProductionBonus: 0.02, allGatherBonus: 1 },
            extraMods: [{ name: "Triple Nature", pos: true, desc: "Extra +2% all production; +1 to all gather yields." }],
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
            extraEffects: { allProductionBonus: 0.02, foodConsumption: 1.2 },
            extraMods: [{ name: "Multi-Headed Efficiency", pos: true, desc: "Extra +2% all production; each head needs feeding (+20% food)." }],
        },
        "Ettin": {
            desc: "Two-headed giants with a constant internal debate. Despite themselves, dual perspectives improve oversight and tax collection.",
            extraEffects: { allProductionBonus: 0.02, taxBonus: 1 },
            extraMods: [{ name: "Divided Mind", pos: true, desc: "Extra +2% all production; +1 cp/creature/day." }],
        },

        // ── Fiend ─────────────────────────────────────────────────────────────
        "Imp": {
            desc: "Minor devils who delight in sabotage — of enemies. Imps sneak into rival operations and bring back extra resources.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Diabolical Theft", pos: true, desc: "Extra +1 all gather — imps steal it so you don't have to." }],
        },
        "Cambion": {
            desc: "Half-fiend nobles with a foot in both worlds. Their dual nature extracts tribute from living and dead alike.",
            extraEffects: { taxBonus: 1, allProductionBonus: 0.02 },
            extraMods: [{ name: "Dual Heritage", pos: true, desc: "+1 cp/creature/day; extra +2% all production." }],
        },
        "Barbed Devil": {
            desc: "Spined enforcers who inspire productivity through pain. Workers under barbed devil supervision consistently exceed output quotas.",
            extraEffects: { allProductionBonus: 0.02 },
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
            extraEffects: { allProductionBonus: 0.02, taxBonus: 1 },
            extraMods: [{ name: "Infernal Authority", pos: true, desc: "Extra +2% all production; +1 cp/creature/day." }],
        },
        "Balor": {
            desc: "A demon of pure destruction and fire. Balors incinerate waste and inefficiency, leaving only productive essence behind.",
            extraEffects: { allProductionBonus: 0.02, converterBonus: { darkAltar: 1.15 } },
            extraMods: [{ name: "Immolation Refinery", pos: true, desc: "Extra +2% all production; Dark Altars extra +15%." }],
        },
        "Rakshasa": {
            desc: "Tiger-headed sorcerer-lords who scheme and trade across planes. Their mercantile genius multiplies coin income dramatically.",
            extraEffects: { taxBonus: 1, coinCapBonus: { flat: 1000, pct: 0.10 } },
            extraMods: [{ name: "Planar Merchant", pos: true, desc: "+1 cp/creature/day; Coin cap +1,000 coins + 10% of tier base." }],
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
            extraEffects: { taxBonus: 1, allProductionBonus: 0.02 },
            extraMods: [{ name: "Cloud Castle Tribute", pos: true, desc: "+1 cp/creature/day; extra +2% all production." }],
        },
        "Storm Giant": {
            desc: "The mightiest of giants, Storm Giants command weather itself. Their power radiates into all production.",
            extraEffects: { allProductionBonus: 0.02, coinCapBonus: { flat: 1000, pct: 0.10 } },
            extraMods: [{ name: "Storm's Command", pos: true, desc: "Extra +2% all production; Coin cap +1,000 coins + 10% of tier base." }],
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
            extraEffects: { taxBonus: 1, allProductionBonus: 0.02 },
            extraMods: [{ name: "Armored Presence", pos: true, desc: "+1 cp/creature/day; extra +2% all production." }],
        },
        "Clay Golem": {
            desc: "Shaped from cursed clay and animated by divine script. Clay Golems are prone to berserk rages that paradoxically accelerate their labor — and their hunger for raw materials is immense.",
            extraEffects: { allProductionBonus: 0.02, capBonus: { stone: 50 } },
            extraMods: [{ name: "Berserk Labor", pos: true, desc: "Extra +2% all production — the clay golem's rage is productively channeled; Stone cap +50." }],
        },
        "Flesh Golem": {
            desc: "Stitched together from the corpses of the fallen, the flesh golem is a tragic and terrible creation. It labors without complaint and its composite anatomy is oddly efficient at bone-work.",
            extraEffects: { productionBonus: { huntingLodge: 1.10 }, capBonus: { bones: 75 }, foodConsumption: 1.15 },
            extraMods: [{ name: "Charnel Assembly", pos: true, desc: "Hunting Lodges extra +10%; Bone cap +75. Requires additional flesh to maintain — eats 15% more." }],
        },
        "Clockwork Horror": {
            desc: "A self-replicating mechanical spider-construct of unknown origin. Clockwork Horrors harvest metal with ruthless efficiency and slowly build more of themselves from salvaged parts.",
            extraEffects: { productionBonus: { mine: 1.15 }, converterBonus: { smelter: 1.10 }, growthBonus: 0.85 },
            extraMods: [{ name: "Self-Replication", pos: true, desc: "Mines extra +15%; Smelters extra +10%; emerges slightly faster — it builds its own replacements." }],
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
        "Weretiger": {
            desc: "Solitary and supremely self-reliant, weretigers are apex hunters who work alone and expect no help — and need none. Their efficiency in isolation yields exceptional results.",
            extraEffects: { allGatherBonus: 1, productionBonus: { huntingLodge: 1.10 }, growthBonus: 1.15 },
            extraMods: [{ name: "Solitary Hunter", pos: true, desc: "Extra +1 to all gather yields; Hunting Lodges extra +10%. Breeds slower than most lycanthropes — they work alone." }],
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
            extraEffects: { productionBonus: { clayPit: 1.15 }, allProductionBonus: 0.02 },
            extraMods: [{ name: "Deep Warden", pos: true, desc: "Clay Pits extra +15%; extra +2% all production." }],
        },
        "Sea Hag": {
            desc: "A sunken crone of horrifying visage whose mere glance can break minds. Sea Hags brew foul concoctions from deep-sea ingredients and their presence drives workers to produce out of sheer dread.",
            extraEffects: { allProductionBonus: 0.02, converterBonus: { alchemyLab: 1.15 }, foodConsumption: 0.85 },
            extraMods: [{ name: "Death Glare", pos: true, desc: "Extra +2% all production; Alchemy Labs extra +15%; eats 15% less." }],
        },
        "Locathah": {
            desc: "Fierce tribal fish-folk who have survived eons of deep-sea oppression through tenacity and sheer grit. Locathah are exceptional gatherers and their communal bonds accelerate growth.",
            extraEffects: { allGatherBonus: 1, growthBonus: 0.85, capBonus: { food: 50 } },
            extraMods: [{ name: "Survivor's Tenacity", pos: true, desc: "Extra +1 to all gather yields; Food cap +50; breeds faster than most Aquatic." }],
        },

        // ── Humanoid ──────────────────────────────────────────────────────────
        "Kenku": {
            desc: "Flightless crow-folk with an uncanny ability to copy and replicate any process they observe. All production benefits slightly.",
            extraEffects: { allProductionBonus: 0.02 },
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
            extraEffects: { allProductionBonus: 0.02 },
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

        // ── Swarm ─────────────────────────────────────────────────────────────
        "Stirge": {
            desc: "Blood-drinking, bat-winged horrors that strike in clouds and drain prey dry. Individually trivial, collectively catastrophic — and they breed faster than any swarm.",
            extraEffects: { growthBonus: 0.75, productionBonus: { huntingLodge: 1.10 } },
            extraMods: [{ name: "Bloodcloud", pos: true, desc: "Hunting Lodges extra +10%; fastest growth of any Swarm." }],
        },
        "Cranium Rat": {
            desc: "Mind Flayer-bred vermin with collective psychic intelligence. A swarm becomes a single, distributed telepathic mind hungry for secrets and arcane knowledge.",
            extraEffects: { productionBonus: { crystalSeam: 1.10 }, capBonus: { arcaneEssence: 25 } },
            extraMods: [{ name: "Hive-Mind", pos: true, desc: "Crystal Seams extra +10%; Arcane Essence cap +25." }],
        },
        "Rot Grub": {
            desc: "Tiny burrowing parasites that infest corpses and the living alike. Exceptional bone processors whose infestation leaves a trail of remains.",
            extraEffects: { productionBonus: { huntingLodge: 1.10 }, capBonus: { bones: 75 } },
            extraMods: [{ name: "Infestation", pos: true, desc: "Hunting Lodges extra +10%; Bone cap +75." }],
        },
        "Shadow Swarm": {
            desc: "Fragments of darkness given appetite. Ten thousand shadow-motes moving as one hungry mass — need almost no food and gather with eerie efficiency.",
            extraEffects: { foodConsumption: 0.70, allGatherBonus: 1 },
            extraMods: [{ name: "Living Dark", pos: true, desc: "Further 30% food reduction; extra +1 to all manual gather yields." }],
        },
        "Spore Cloud": {
            desc: "A fungal colony with collective direction and terrible patience. Drifts until it finds warmth, then spreads — Herbalist Dens thrive in their presence.",
            extraEffects: { productionBonus: { herbalistDen: 1.15 }, capBonus: { herbs: 50 } },
            extraMods: [{ name: "Spore Infestation", pos: true, desc: "Herbalist Dens extra +15%; Herb cap +50." }],
        },
        "Plague Locust": {
            desc: "Individually nothing. Collectively, a verdict. Appetite elevated to a geological force — fills storage but reduces farming efficiency.",
            extraEffects: { storageBonus: 15, capBonus: { food: 100 }, productionBonus: { farm: 0.90 } },
            extraMods: [
                { name: "Devouring Wave", pos: true,  desc: "Storage buildings hold 15 more; Food cap +100." },
                { name: "Locust Logic",   pos: false, desc: "Farms produce 10% less — the locusts consume a portion of what they generate." },
            ],
        },

        // ── Beast ─────────────────────────────────────────────────────────────
        "Dire Wolf": {
            desc: "The wolf taken to its logical extreme — larger, stronger, faster, and possessed of an intelligence that stops just short of language.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, allGatherBonus: 1 },
            extraMods: [{ name: "Pack General", pos: true, desc: "Hunting Lodges extra +15%; extra +1 to all manual gather yields." }],
        },
        "Cave Bear": {
            desc: "The apex of the underground wilderness. Cave Bears are territorial, enormously powerful, and utterly without interest in negotiation.",
            extraEffects: { productionBonus: { quarry: 1.10, mine: 1.10 }, capBonus: { bones: 50 } },
            extraMods: [{ name: "Apex Predator", pos: true, desc: "Quarries and Mines extra +10%; Bone cap +50." }],
        },
        "Giant Eagle": {
            desc: "Proud, ancient, and capable of genuine speech — though they rarely bother. Giant Eagles see everything from above.",
            extraEffects: { allGatherBonus: 1, growthBonus: 0.85 },
            extraMods: [{ name: "Aerial Sight", pos: true, desc: "Extra +1 to all manual gather yields; slightly faster growth." }],
        },
        "Sabre Cat": {
            desc: "A predator from the age before civilization. Sabre Cats hunt the largest prey they can find as a matter of principle.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, foodConsumption: 0.90 },
            extraMods: [{ name: "Ancient Fang", pos: true, desc: "Hunting Lodges extra +15%; slight food reduction." }],
        },
        "Giant Ape": {
            desc: "Immense, intelligent, and deeply territorial. Giant Apes understand tool use, social hierarchy, and the concept of ownership.",
            extraEffects: { productionBonus: { quarry: 1.15 }, gatherBonus: { stone: 1 } },
            extraMods: [{ name: "Tool-User", pos: true, desc: "Quarries extra +15%; +1 stone per manual gather." }],
        },
        "Bulette": {
            desc: "The landshark — an armored predator that swims through earth the way a fish moves through water. Loosens ore as it passes.",
            extraEffects: { productionBonus: { mine: 1.20 }, gatherBonus: { stone: 1 } },
            extraMods: [{ name: "Earthshark", pos: true, desc: "Mines extra +20%; +1 stone per manual gather." }],
        },

        // ── Specter ───────────────────────────────────────────────────────────
        "Ghost": {
            desc: "The unfinished dead, haunting the place of their greatest regret. Ghosts are powerful and unpredictable.",
            extraEffects: { taxBonus: 1, capBonus: { arcaneEssence: 25 } },
            extraMods: [{ name: "Lingering Presence", pos: true, desc: "+1 cp/creature/day; Arcane Essence cap +25." }],
        },
        "Poltergeist": {
            desc: "A ghost too angry to manifest fully, expressing its rage through hurled objects. Its chaos paradoxically accelerates production.",
            extraEffects: { allProductionBonus: 0.02, storageBonus: 10 },
            extraMods: [{ name: "Kinetic Fury", pos: true, desc: "Extra +2% all production; Storage buildings hold 10 more per building." }],
        },
        "Will-o'-Wisp": {
            desc: "A malevolent light that leads travelers to their doom. Will-o'-Wisps sustain themselves on the life force of the lost, eating almost nothing and amplifying arcane output with eerie efficiency.",
            extraEffects: { foodConsumption: 0.25, capBonus: { arcaneEssence: 50 }, converterBonus: { ritualCircle: 1.10 } },
            extraMods: [{ name: "Luring Light", pos: true, desc: "75% food reduction; Arcane Essence cap +50; Ritual Circles extra +10%." }],
        },
        "Nighthaunt": {
            desc: "Spectral warriors bound to a cause that ended centuries ago. Their dread manifests as tax compliance.",
            extraEffects: { taxBonus: 1, allProductionBonus: 0.02 },
            extraMods: [{ name: "Grievous Dread", pos: true, desc: "+1 cp/creature/day; extra +2% all production." }],
        },
        "Allip": {
            desc: "The mad remnant of someone driven to self-destruction by forbidden knowledge. Its babbling accelerates arcane processes nearby.",
            extraEffects: { converterBonus: { arcaneGrinder: 1.15, arcaneBench: 1.15 } },
            extraMods: [{ name: "Mad Babbling", pos: true, desc: "Arcane Grinders and Arcane Benches extra +15%." }],
        },

        // ── Planar ────────────────────────────────────────────────────────────
        "Githzerai": {
            desc: "Ascetics of Limbo who impose order on chaos through sheer will. Their mental discipline amplifies all production.",
            extraEffects: { allProductionBonus: 0.02, growthBonus: 0.85 },
            extraMods: [{ name: "Zerth Discipline", pos: true, desc: "Extra +2% all production; slightly faster growth." }],
        },
        "Githyanki": {
            desc: "Astral conquerors with silver swords. Their aggressive efficiency translates to exceptional gathering.",
            extraEffects: { allGatherBonus: 1, taxBonus: 1 },
            extraMods: [{ name: "Astral Raid", pos: true, desc: "Extra +1 to all manual gather yields; +1 cp/creature/day." }],
        },
        "Modron": {
            desc: "Living mathematics from Mechanus. Their mechanical efficiency makes every production process optimal.",
            extraEffects: { allProductionBonus: 0.03, converterBonus: { smelter: 1.10, alchemyLab: 1.10 } },
            extraMods: [{ name: "Hierarchical Processing", pos: true, desc: "Extra +3% all production; Smelters and Alchemy Labs extra +10%." }],
        },
        "Slaad": {
            desc: "Living chaos from Limbo. Entropy breeds fast — Slaadi have the fastest growth of any Planar creature.",
            extraEffects: { growthBonus: 0.70, capBonus: { food: 75 } },
            extraMods: [{ name: "Entropic Reproduction", pos: true, desc: "Growth timer 30% shorter than base Planar; Food cap +75." }],
        },
        "Xorn": {
            desc: "Three-armed beings from the elemental plane of earth who move through stone like water and hunger for precious metals.",
            extraEffects: { productionBonus: { mine: 1.15, quarry: 1.15 }, capBonus: { stone: 50 } },
            extraMods: [{ name: "Stone Swimmer", pos: true, desc: "Mines and Quarries extra +15%; Stone cap +50." }],
        },
        "Inevitables": {
            desc: "Constructs of absolute law. They continue moving toward their target until one of them stops existing — relentless and foodless.",
            extraEffects: { foodConsumption: 0.05, allProductionBonus: 0.02, taxBonus: 1 },
            extraMods: [{ name: "Inevitable Purpose", pos: true, desc: "Extra +2% all production; +1 cp/creature/day; nearly foodless as construct-like entities." }],
        },

        // ── Celestial ─────────────────────────────────────────────────────────
        "Planetar": {
            desc: "A great angel of war and justice, bound now to a different cause. Their divine power drives extraordinary output.",
            extraEffects: { allProductionBonus: 0.03, taxBonus: 1 },
            extraMods: [{ name: "War Angel", pos: true, desc: "Extra +3% all production; +1 cp/creature/day." }],
        },
        "Deva": {
            desc: "Celestial messengers who carry divine will. The grace, the power, and the efficiency of divine purpose remain.",
            extraEffects: { allProductionBonus: 0.02, capBonus: { arcaneEssence: 50 } },
            extraMods: [{ name: "Divine Messenger", pos: true, desc: "Extra +2% all production; Arcane Essence cap +50." }],
        },
        "Couatl": {
            desc: "Feathered serpents of divine mandate. Their arcane attunement amplifies magic production.",
            extraEffects: { productionBonus: { crystalSeam: 1.10, ritualCircle: 1.15 }, capBonus: { herbs: 50 } },
            extraMods: [{ name: "Feathered Wisdom", pos: true, desc: "Crystal Seams extra +10%; Ritual Circles extra +15%; Herb cap +50." }],
        },
        "Pegasus": {
            desc: "A winged horse of pure celestial lineage whose aerial agility enhances all gathering.",
            extraEffects: { allGatherBonus: 1, growthBonus: 0.85 },
            extraMods: [{ name: "Celestial Wings", pos: true, desc: "Extra +1 to all manual gather yields; growth timer slightly faster." }],
        },
        "Unicorn": {
            desc: "A guardian of sacred places. Their presence reduces food needs dramatically and amplifies herb production.",
            extraEffects: { foodConsumption: 0.70, productionBonus: { herbalistDen: 1.10 }, capBonus: { herbs: 75 } },
            extraMods: [{ name: "Sacred Presence", pos: true, desc: "Further 30% food reduction; Herbalist Dens extra +10%; Herb cap +75." }],
        },
        "Hollyphant": {
            desc: "A tiny celestial elephant of improbable power. Their divine energy boosts morale enormously.",
            extraEffects: { allProductionBonus: 0.02, taxBonus: 1, growthBonus: 0.75 },
            extraMods: [{ name: "Divine Trumpet", pos: true, desc: "Extra +2% all production; +1 cp/creature/day; fastest growth of any Celestial." }],
        },

        // ── Titan ─────────────────────────────────────────────────────────────
        "Empyrean": {
            desc: "The divine offspring of gods, carrying that inheritance in every action. Empyreans reshape everything around them.",
            extraEffects: { allProductionBonus: 0.03, coinCapBonus: { flat: 1000, pct: 0.10 } },
            extraMods: [{ name: "Divine Radiance", pos: true, desc: "Extra +3% all production; Coin cap +1,000 + 10% of tier base." }],
        },
        "Behemoth": {
            desc: "The land-bound counterpart to the Leviathan — a creature of such mass that the earth reshapes itself around its passage. Its presence supercharges quarrying and mining.",
            extraEffects: { productionBonus: { quarry: 1.20, mine: 1.20 }, capBonus: { stone: 100 } },
            extraMods: [{ name: "Earth Shaker", pos: true, desc: "Quarries and Mines extra +20%; Stone cap +100." }],
        },
        "Astral Dreadnought": {
            desc: "A predator native to the Astral Plane that has drifted through the void since before the gods named it. Amplifies all arcane processes.",
            extraEffects: { productionBonus: { crystalSeam: 1.15 }, converterBonus: { arcaneGrinder: 1.15 } },
            extraMods: [{ name: "Void Resonance", pos: true, desc: "Crystal Seams extra +15%; Arcane Grinders extra +15%." }],
        },
        "Leviathan": {
            desc: "The sea given agency and appetite. Their presence dramatically amplifies aquatic and storage operations.",
            extraEffects: { productionBonus: { clayPit: 1.15 }, storageBonus: 25, capBonus: { food: 150 } },
            extraMods: [{ name: "Tidal Authority", pos: true, desc: "Clay Pits extra +15%; Storage buildings hold 25 more; Food cap +150." }],
        },
        "War Colossus": {
            desc: "An animated statue built by civilizations that no longer exist to serve purposes no one fully remembers. They continue anyway — and mine magnificently.",
            extraEffects: { productionBonus: { quarry: 1.20, mine: 1.20 }, capBonus: { stone: 100 } },
            extraMods: [{ name: "Inexorable Labor", pos: true, desc: "Quarries and Mines extra +20%; Stone cap +100." }],
        },
        "Elder Titan": {
            desc: "A being from the age before the current cosmic order — older than the gods who replaced them. Its presence amplifies everything.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Primordial Authority", pos: true, desc: "+1 to all manual gather yields — the elder titan's reach extends everywhere." }],
        },

        // ── Cursed ────────────────────────────────────────────────────────────
        "Death Knight": {
            desc: "A paladin who broke their sacred oath and was denied the mercy of death as punishment. They serve with the same discipline they once gave to the light.",
            extraEffects: { allProductionBonus: 0.02, taxBonus: 1, growthBonus: 0.90 },
            extraMods: [{ name: "Unyielding Oath", pos: true, desc: "Extra +2% all production; +1 cp/creature/day; slightly faster growth than typical Cursed." }],
        },
        "Petrified Medusa": {
            desc: "The curse is older than the Medusa herself. The endless petrification creates a perpetual surplus of worked stone.",
            extraEffects: { productionBonus: { quarry: 1.20 }, gatherBonus: { stone: 1 }, capBonus: { stone: 100 } },
            extraMods: [{ name: "Stone Gaze", pos: true, desc: "Quarries extra +20%; Stone cap +100; +1 stone per manual gather." }],
        },
        "Werewolf": {
            desc: "The oldest lycanthropic curse, spreading fastest of all. In a dungeon, that nature becomes a resource — the pack grows quickly and hunts ferociously.",
            extraEffects: { productionBonus: { huntingLodge: 1.15 }, allGatherBonus: 1, growthBonus: 0.85 },
            extraMods: [{ name: "The Curse Spreads", pos: true, desc: "Hunting Lodges extra +15%; extra +1 to all gather yields; growth timer faster than other Cursed." }],
        },
        "Serpent Abomination": {
            desc: "More serpent than humanoid, having sacrificed humanity so completely that what remains is something the serpent gods want to talk to. Alchemy flows from that relationship.",
            extraEffects: { converterBonus: { alchemyLab: 1.20, arcaneGrinder: 1.10 } },
            extraMods: [{ name: "Serpent Ascension", pos: true, desc: "Alchemy Labs extra +20%; Arcane Grinders extra +10%." }],
        },
        "Cursed Knight": {
            desc: "A warrior bound to an oath they broke. The Cursed Knight fights on because stopping is no longer available as an option — and that drives output.",
            extraEffects: { allProductionBonus: 0.02, taxBonus: 1, growthBonus: 0.90 },
            extraMods: [{ name: "Unbreakable Will", pos: true, desc: "Extra +2% all production; +1 cp/creature/day; slightly faster growth." }],
        },
        "Wereraven": {
            desc: "Cursed watchers who carry the affliction lightly — or so they claim. Wereravens observe, remember, and report.",
            extraEffects: { allGatherBonus: 1, productionBonus: { huntingLodge: 1.10 } },
            extraMods: [{ name: "Dark Wing Network", pos: true, desc: "Extra +1 to all manual gather yields; Hunting Lodges extra +10%." }],
        },

        // ── Fey ───────────────────────────────────────────────────────────────
        "Redcap": {
            desc: "A murderous faerie that keeps its cap red by soaking it in the blood of its kills. Their violent labor drives exceptional bone yields.",
            extraEffects: { productionBonus: { huntingLodge: 1.10 }, allGatherBonus: 1, capBonus: { bones: 50 } },
            extraMods: [{ name: "Blood-Soaked Cap", pos: true, desc: "Hunting Lodges extra +10%; Bone cap +50; +1 to all manual gather yields." }],
        },

        // ── Sovereign (selectable) ────────────────────────────────────────────
        "Wyrm": {
            desc: "Older than most kingdoms and larger than some. A Wyrm is what a dragon becomes when it has outlived every reason to be reasonable.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Ancient Dominance", pos: true, desc: "+1 to all manual gather yields — a Wyrm has learned where everything worth taking is buried." }],
        },
        "Umbral Hunter": {
            desc: "A predator that has made shadow into a hunting ground. Arcane and ritual processes warp around its presence.",
            extraEffects: { converterBonus: { ritualCircle: 1.20, arcaneGrinder: 1.15 }, capBonus: { arcaneEssence: 75 } },
            extraMods: [{ name: "Living Dark", pos: true, desc: "Ritual Circles extra +20%; Arcane Grinders extra +15%; Arcane Essence cap +75." }],
        },
        "Storm Roc": {
            desc: "A bird large enough that its wingspan generates its own weather. Their aerial dominance gathers resources at mythic scale.",
            extraEffects: { allGatherBonus: 1, productionBonus: { huntingLodge: 1.20 } },
            extraMods: [{ name: "Sky Sovereign", pos: true, desc: "Extra +1 to all manual gather yields; Hunting Lodges extra +20%." }],
        },
        "Ironback": {
            desc: "So heavily armored by centuries of growth it has become a landscape feature. Vast storage and aquatic amplification.",
            extraEffects: { storageBonus: 30, productionBonus: { clayPit: 1.20 }, capBonus: { food: 200 } },
            extraMods: [{ name: "Ancient Shell", pos: true, desc: "Storage buildings hold 30 more; Clay Pits extra +20%; Food cap +200." }],
        },
        "Rift Drake": {
            desc: "A drake that has fed on planar energy long enough that it no longer fully exists in one place. Its arcane output reflects something that has stopped finding reality binding.",
            extraEffects: { allGatherBonus: 1, converterBonus: { arcaneGrinder: 1.20 }, foodConsumption: 0.50 },
            extraMods: [{ name: "Void-Touched", pos: true, desc: "+1 to all manual gather yields; Arcane Grinders extra +20%; further 50% food reduction." }],
        },
        "Ashborn": {
            desc: "Not a phoenix — something that has burned so many times it has stopped bothering to fully come back. Supercharges all fire and metal operations.",
            extraEffects: { converterBonus: { smelter: 1.25, forge: 1.25 }, productionBonus: { coalSeam: 1.15 }, foodConsumption: 0.05 },
            extraMods: [{ name: "Eternal Flame", pos: true, desc: "Smelters and Forges extra +25%; Coal Seams extra +15%; nearly foodless — the flame sustains it." }],
        },

        // ── Primordial ────────────────────────────────────────────────────────
        "Elder Tempest": {
            desc: "A storm that predates weather. The Elder Tempest does not rage. It simply is rage, expressed meteorologically.",
            extraEffects: { allGatherBonus: 1 },
            extraMods: [{ name: "Primordial Storm", pos: true, desc: "+1 to all manual gather yields — the storm finds what it wants." }],
        },
        "Zaratan": {
            desc: "An island-sized turtle from before the elemental planes had edges. Its waking amplifies stone and storage.",
            extraEffects: { productionBonus: { quarry: 1.20 }, storageBonus: 30, capBonus: { stone: 150 } },
            extraMods: [{ name: "Living Island", pos: true, desc: "Quarries extra +20%; Storage buildings hold 30 more; Stone cap +150." }],
        },
        "Abyssal Tide": {
            desc: "The water itself, given ancient hunger. Food consumption is almost nil — the tide sustains itself from ambient moisture.",
            extraEffects: { productionBonus: { clayPit: 1.20 }, capBonus: { food: 150 } },
            extraMods: [{ name: "Primordial Water", pos: true, desc: "Clay Pits extra +20%; Food cap +150 stacking with Primordial base." }],
        },
        "Elder Fire": {
            desc: "Fire from before fire had rules. Not an elemental but a primordial burning. Supercharges all smelting and forging.",
            extraEffects: { converterBonus: { smelter: 1.20, forge: 1.20 }, productionBonus: { coalSeam: 1.15 } },
            extraMods: [{ name: "Primordial Flame", pos: true, desc: "Smelters and Forges extra +20%; Coal Seams extra +15%." }],
        },
        "Obyrith": {
            desc: "Demons older than the Abyss itself. Their chaos generates extraordinary arcane output.",
            extraEffects: { productionBonus: { darkAltar: 1.20, ritualCircle: 1.20 }, capBonus: { arcaneEssence: 100 } },
            extraMods: [{ name: "Maddening Form", pos: true, desc: "Dark Altars and Ritual Circles extra +20%; Arcane Essence cap +100." }],
        },
        "Void Shard": {
            desc: "A fragment of the nothing that existed before existence. Preserves resources through null-containment with extraordinary efficiency.",
            extraEffects: { storageBonus: 40 },
            extraMods: [{ name: "Null Containment", pos: true, desc: "Storage buildings hold 40 more per building, stacking with Primordial base." }],
        },

        // ── Legendary (earned, not chosen) ────────────────────────────────────
        "Chromatic Dragon": { // legendary — earned, not chosen
            desc: "An ancient chromatic dragon whose very presence warps the dungeon around it. Their dominance over lesser races increases all production dramatically.",
            extraEffects: { allProductionBonus: 0.02, foodConsumption: 3.0, lairHousing: 1 },
            extraMods: [
                { name: "Dragon's Appetite",   pos: false, desc: "Consumes 3× the food of a normal Draconic creature; only 1 fits per Hovel." },
            ],
        },
        "Lich": { // legendary — earned, not chosen
            desc: "A powerful undead archmage who transcended death to pursue magical mastery. Liches push arcane infrastructure to impossible heights.",
            extraEffects: { converterBonus: { crystalSeam: 1.15, mageTower: 1.15, arcaneGrinder: 1.15 }, foodConsumption: 0, lairHousing: 1 },
            extraMods: [
                { name: "Phylactery Focus",  pos: true,  desc: "Crystal Seams, Mage Towers, and Arcane Grinders extra +15%." },
                { name: "Undying Hunger",    pos: true,  desc: "Liches do not eat — they subsist on soul energy alone; only 1 fits per Hovel." },
            ],
        },
        "Sphinx": { // legendary — earned, not chosen
            desc: "Ancient and enigmatic, a sphinx's riddling wisdom unlocks insights that improve all arcane processes.",
            extraEffects: { converterBonus: { arcaneGrinder: 1.15, arcaneBench: 1.15 }, productionBonus: { crystalSeam: 1.10 } },
            extraMods: [{ name: "Riddling Wisdom", pos: true, desc: "Arcane Grinders and Benches extra +15%; Crystal Seams extra +10%." }],
        },
        "Dracolich": { // legendary — earned, not chosen
            desc: "A dragon who refused death and bound its soul to a phylactery. The dracolich fuses draconic production might with undead arcane mastery in one terrible form.",
            extraEffects: { allProductionBonus: 0.02, converterBonus: { arcaneGrinder: 1.15, ritualCircle: 1.15 }, foodConsumption: 0, lairHousing: 1 },
            extraMods: [
                { name: "Undying Dominance", pos: true,  desc: "Extra +2% all production; Arcane Grinders and Ritual Circles +15%." },
                { name: "Phylactery Bound",  pos: true,  desc: "Requires no food — the dracolich's phylactery sustains it; only 1 fits per Hovel." },
            ],
        },
        "Tarrasque": { // legendary — earned, not chosen
            desc: "The most feared creature in existence — an engine of annihilation that cannot be permanently slain. Its very presence drives all lesser creatures to work harder out of pure survival instinct.",
            extraEffects: { allProductionBonus: 0.02, allGatherBonus: 2, foodConsumption: 5.0, lairHousing: 1 },
            extraMods: [
                { name: "Primal Terror",    pos: true,  desc: "Extra +2% all production and +2 to all gather yields — pure survival instinct." },
                { name: "World-Eater",      pos: false, desc: "Consumes 5× the food of a normal Monstrous creature; only 1 fits per Hovel." },
            ],
        },
        "Kraken": { // legendary — earned, not chosen
            desc: "The ancient terror of the deep ocean. A kraken's immense intelligence and dominion over water amplifies all aquatic and storage operations to impossible scales.",
            extraEffects: { allProductionBonus: 0.02, storageBonus: 30, capBonus: { food: 200 }, coinCapBonus: { flat: 1000, pct: 0.10 }, foodConsumption: 2.5, lairHousing: 1 },
            extraMods: [
                { name: "Deep Dominion",    pos: true,  desc: "Extra +2% all production; Storage buildings hold 30 more; Food cap +200; Coin cap +1,000 coins + 10% of tier base." },
                { name: "Titanic Appetite", pos: false, desc: "Consumes 2.5× the food of a normal Aquatic creature; only 1 fits per Hovel." },
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

function devPreviewTransition() {
    const sel = document.getElementById('dev-transition-race');
    if (!sel || !sel.value) return;
    showEraTransition(sel.value, () => {});
}

function _initDevTransitionSelect() {
    const sel = document.getElementById('dev-transition-race');
    if (!sel) return;
    // Types first, then specific creatures — sorted within each group
    const types = ['Goblinoid','Undead','Draconic','Fey','Aberration','Ooze',
                   'Elemental','Monstrous','Fiend','Giant','Construct','Lycanthrope','Flora','Aquatic','Humanoid',
                   'Swarm','Beast','Specter','Planar','Celestial','Titan','Cursed','Sovereign','Primordial'];
    const creatures = Object.keys(ERA_RACE_SVG).filter(k => !types.includes(k)).sort();
    sel.innerHTML = '';
    const tGroup = document.createElement('optgroup');
    tGroup.label = 'Types';
    types.forEach(t => {
        const o = document.createElement('option');
        o.value = o.textContent = t;
        tGroup.appendChild(o);
    });
    const cGroup = document.createElement('optgroup');
    cGroup.label = 'Specific Creatures';
    creatures.forEach(c => {
        const o = document.createElement('option');
        o.value = o.textContent = c;
        cGroup.appendChild(o);
    });
    sel.appendChild(tGroup);
    sel.appendChild(cGroup);
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

function calcQuintessenceEarned() {
    let earned = 3;
    earned += Math.max(0, (gameState.run.era || 1) - 1);
    earned += Math.floor((gameState.stats.peakPopulation || 0) / 50);
    earned += Math.floor(Object.keys(gameState.research || {}).length / 10);
    const race = gameState.run.race;
    if (race && (gameState.meta.racesPlayed[race] || 0) <= 1) earned += 1;
    return earned;
}

// Called when player prestiges — resets run state, keeps meta progression
function doPrestige() {
    const quintessencePreview = calcQuintessenceEarned();
    if (!confirm(`Simulate a Prestige reset?\n\nAll run progress (resources, buildings, population) will be wiped and a new biome assigned. Meta-stats (prestiges, seen biomes, Quintessence) are preserved.\n\nYou will earn ${quintessencePreview} Quintessence from this run.`)) return;

    const savedMeta = JSON.parse(JSON.stringify(gameState.meta));
    savedMeta.totalPrestiges = (savedMeta.totalPrestiges || 0) + 1;
    savedMeta.quintessence = (savedMeta.quintessence || 0) + calcQuintessenceEarned();

    gameState.resources  = {};
    for (const res of Object.keys(BASE_CAPS)) gameState.resources[res] = 0;
    gameState.resources.coins = 0;
    gameState.buildings  = {};
    for (const id of Object.keys(ROOMS)) gameState.buildings[id] = 0;
    gameState.research   = {};
    gameState.population = { count: 0, growthTimer: 0, starveTick: 0 };
    gameState.time       = { tick: 0, day: 1, year: 1, seasonIndex: 0 };
    for (const k of Object.keys(gameState.stats)) gameState.stats[k] = 0;
    gameState.run         = { biome: null, race: null, mods: [], era: 1 };
    gameState.era1        = { unlocked: [], chosen: null, raceOptions: null };
    gameState.tradeRoutes = {};
    _era1TreeState = '';
    gameState.meta = savedMeta;

    selectStartBiome(false);
    saveGame();
    snapshotBackup("Prestige " + savedMeta.totalPrestiges); // restore point at run start
    updateUI();
    updateIdentityPanel();
}

function renderQuintessencePanel() {
    const quintessence = gameState.meta.quintessence || 0;
    const bonusPct = (quintessence * 0.5).toFixed(1);
    const preview  = calcQuintessenceEarned();
    setText('quintessence-balance',         quintessence);
    setText('quintessence-resonance-bonus', `+${bonusPct}% all production`);
    setText('quintessence-preview',         `+${preview} on next prestige`);
    // Left-column meta section
    setText('quintessence-res-count', quintessence);
    const metaSection = document.getElementById('meta-currency-section');
    if (metaSection) metaSection.style.display = quintessence > 0 ? '' : 'none';
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
    if (tabId === "settings") updateSettingsUI();
    if (tabId === "trade") renderTradeTab();
}

// ── Bootstrap ─────────────────────────────────────────────────────────────────

loadSettings();
loadGame();
// Normalize fields that may be missing from older saves
if (!gameState.meta)                         gameState.meta = {};
if (!gameState.meta.seenBiomes)              gameState.meta.seenBiomes = [];
if (gameState.meta.totalPrestiges == null)   gameState.meta.totalPrestiges = 0;
if (!gameState.meta.racesPlayed)             gameState.meta.racesPlayed = {};
if (gameState.meta.quintessence == null) gameState.meta.quintessence = 0;
if (!gameState.stats)                        gameState.stats = {};
if (gameState.stats.peakPopulation       == null) gameState.stats.peakPopulation       = 0;
if (gameState.stats.buildingsConstructed == null) gameState.stats.buildingsConstructed = 0;
if (gameState.stats.manualGathers        == null) gameState.stats.manualGathers        = 0;
if (gameState.stats.starvationDeaths     == null) gameState.stats.starvationDeaths     = 0;
if (gameState.stats.foodProduced         == null) gameState.stats.foodProduced         = 0;
if (gameState.stats.woodProduced         == null) gameState.stats.woodProduced         = 0;
if (gameState.stats.stoneProduced        == null) gameState.stats.stoneProduced        = 0;
if (!gameState.workerAssignments)            gameState.workerAssignments = {};
if (!gameState.research)                     gameState.research = {};
if (Array.isArray(gameState.tradeRoutes)) {
    // Migrate old slot-array format ([{resource, mode}, ...]) to signed-count-per-resource object
    const migrated = {};
    for (const route of gameState.tradeRoutes) {
        if (!route || !route.resource) continue;
        const delta = route.mode === 'buy' ? 1 : -1;
        migrated[route.resource] = (migrated[route.resource] || 0) + delta;
    }
    gameState.tradeRoutes = migrated;
} else if (!gameState.tradeRoutes || typeof gameState.tradeRoutes !== 'object') {
    gameState.tradeRoutes = {};
}
if (!gameState.run.era)                      gameState.run.era = 1;
if (gameState.pauseBank == null || isNaN(gameState.pauseBank)) gameState.pauseBank = 0;
gameState.pauseBank = Math.min(gameState.pauseBank, 28800);
if (gameState.run.race && !RACE_DATA[gameState.run.race]) gameState.run.race = RACE_DATA_FALLBACK;
if (!gameState.era1) gameState.era1 = { unlocked: [], chosen: null };
if (!Array.isArray(gameState.era1.unlocked)) gameState.era1.unlocked = [];
// Race nodes are now static L5 leaves in ERA1_TREE — no dynamic injection needed.
if (gameState.resources.influence == null) gameState.resources.influence = 0;
if (gameState.resources.mana == null) gameState.resources.mana = 0;
if (gameState.resources.arcaneEssence == null) gameState.resources.arcaneEssence = 0;
// ── Random Event System ───────────────────────────────────────────────────────

let _logActiveTab = 'all';

function _renderLogEntry(el, record) {
    const season = ['Spring', 'Summer', 'Autumn', 'Winter'][record.seasonIndex];
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.dataset.category = record.category || 'events';
    if (_logActiveTab !== 'all' && entry.dataset.category !== _logActiveTab) {
        entry.style.display = 'none';
    }
    entry.innerHTML =
        `<div class="log-meta">Day ${record.day}, ${season} — Year ${record.year}</div>` +
        `<div class="log-text">${record.text}</div>` +
        (record.effectSummary ? `<div class="log-effect">${record.effectSummary}</div>` : '');
    el.insertBefore(entry, el.firstChild);
}

function addLogEntry(text, effectSummary, category) {
    const el = document.getElementById('event-log');
    if (!el) return;
    const empty = el.querySelector('.log-empty');
    if (empty) empty.remove();

    const record = {
        text,
        effectSummary: effectSummary || '',
        category:    category || 'events',
        day:         gameState.time.day,
        year:        gameState.time.year,
        seasonIndex: gameState.time.seasonIndex,
    };

    if (!gameState.randomEventLog) gameState.randomEventLog = [];
    gameState.randomEventLog.unshift(record);
    if (gameState.randomEventLog.length > 40) gameState.randomEventLog.length = 40;

    _renderLogEntry(el, record);
    while (el.children.length > 40) el.removeChild(el.lastChild);
    _checkLogEmpty(el);
}

function _checkLogEmpty(el) {
    const hasVisible = [...el.querySelectorAll('.log-entry')].some(e => e.style.display !== 'none');
    let empty = el.querySelector('.log-empty');
    if (!hasVisible) {
        if (!empty) {
            empty = document.createElement('p');
            empty.className = 'log-empty';
            empty.textContent = 'Nothing yet.';
            el.appendChild(empty);
        }
    } else if (empty) {
        empty.remove();
    }
}

function restoreEventLog() {
    const el = document.getElementById('event-log');
    if (!el) return;
    const records = gameState.randomEventLog;
    if (!records || !records.length) return;
    const empty = el.querySelector('.log-empty');
    if (empty) empty.remove();
    for (const record of records) {
        _renderLogEntry(el, record);
    }
    _checkLogEmpty(el);
}

function setLogTab(tab) {
    _logActiveTab = tab;
    document.querySelectorAll('.log-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tab);
    });
    const el = document.getElementById('event-log');
    if (!el) return;
    el.querySelectorAll('.log-entry').forEach(entry => {
        entry.style.display = (tab === 'all' || entry.dataset.category === tab) ? '' : 'none';
    });
    _checkLogEmpty(el);
}

function clearEventLog() {
    gameState.randomEventLog = [];
    const el = document.getElementById('event-log');
    if (!el) return;
    el.innerHTML = '<p class="log-empty">Nothing yet.</p>';
}

function _weightedPick(pool) {
    const totalWeight = pool.reduce((s, e) => s + (e.weight || 1), 0);
    let roll = Math.random() * totalWeight;
    for (const e of pool) {
        roll -= (e.weight || 1);
        if (roll <= 0) return e;
    }
    return pool[pool.length - 1];
}

function _applyEventEffects(effects) {
    const parts = [];
    for (const fx of effects) {
        if (fx.type === 'resource') {
            gameState.resources[fx.resource] = Math.max(0, (gameState.resources[fx.resource] || 0) + fx.amount);
            if (fx.amount === 0) continue;
            const rdef = RESOURCES && RESOURCES[fx.resource];
            const rname = (rdef && rdef.name) || (fx.resource.charAt(0).toUpperCase() + fx.resource.slice(1));
            parts.push(fx.amount > 0 ? `+${fx.amount} ${rname}` : `${fx.amount} ${rname}`);
        }
    }
    return parts.join(', ');
}

function maybeFireRandomEvent() {
    if (typeof RANDOM_EVENTS === 'undefined') return;
    const era = (gameState.run && gameState.run.era) || 1;
    const currentDay = gameState.time.day + (gameState.time.year - 1) * DAYS_PER_SEASON * 4;
    const cooldowns = gameState.randomEventCooldowns || (gameState.randomEventCooldowns = {});

    // Roll once per day with a ~1.5% chance to fire any event
    if (Math.random() > 0.015) return;

    let pool = [];
    if (era === 1) {
        pool = (RANDOM_EVENTS.era1 || []).filter(e => (cooldowns[e.id] || 0) <= currentDay);
    } else {
        const general = (RANDOM_EVENTS.era2General || []).filter(e => (cooldowns[e.id] || 0) <= currentDay);
        const raceName = gameState.run && gameState.run.race;
        const raceType = raceName && RACE_DATA[raceName] && RACE_DATA[raceName].tagLabel;
        const byType   = raceType && RANDOM_EVENTS.era2ByType && RANDOM_EVENTS.era2ByType[raceType]
            ? RANDOM_EVENTS.era2ByType[raceType].filter(e => (cooldowns[e.id] || 0) <= currentDay)
            : [];
        pool = [...general, ...byType];
    }

    if (!pool.length) return;

    const event = _weightedPick(pool);
    const effectSummary = _applyEventEffects(event.effects || []);
    addLogEntry(event.text, effectSummary);
    cooldowns[event.id] = currentDay + (event.cooldownDays || 20);
}

// Assign biome on first load (fresh game or old save with no mods yet)
if (!gameState.run || !gameState.run.mods || gameState.run.mods.length === 0) {
    if (!gameState.run) gameState.run = { biome: null, race: null, mods: [] };
    selectStartBiome(gameState.meta.seenBiomes.length === 0);
}
updateUI();
updateIdentityPanel();
devPopulateRaceSelect();
_initDevTransitionSelect();
initResTooltips();
initGatherTooltips();
initBldTooltips();
initResearchTooltips();
initIdentityTooltips();
initSettingsTooltips();
restoreEventLog();
setInterval(tick, 1000);

// Stamp lastSeen when the player closes or navigates away.
// Skipped when a save reset is in progress so the wipe isn't undone.
var _pendingReset = false;
window.addEventListener('beforeunload', function () {
    if (_pendingReset) return;
    gameState.lastSeen = Date.now();
    saveGame();
});
