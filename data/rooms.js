// data/rooms.js

const ROOMS = {

    // ── Stage 1 — Foundation ────────────────────────────────────────────────────

    lair: {
        name: "Lair",
        cost: { wood: 15 },
        costScale: 1.05,
        housingBonus: 5,
    },
    farm: {
        name: "Farm",
        cost: { wood: 10 },
        costScale: 1.05,
        jobs: 1,
        production: { food: 2 },
    },
    lumber: {
        name: "Lumber Camp",
        cost: { wood: 10 },
        costScale: 1.1,
        jobs: 1,
        production: { wood: 0.8 },
    },
    quarry: {
        name: "Quarry",
        cost: { wood: 15 },
        costScale: 1.1,
        jobs: 1,
        production: { stone: 0.8 },
    },
    storage: {
        name: "Storage",
        cost: { wood: 20, stone: 10 },
        costScale: 1.1,
        // cap bonus (+50 to all material resources per storage) is applied in getCaps()
    },

    // ── Stage 2 — Early Unlocks ─────────────────────────────────────────────────

    mine: {
        name: "Mine",
        cost: { stone: 25, wood: 10 },
        costScale: 1.12,
        jobs: 1,
        production: { ore: 0.6 },
        unlock: { quarry: 3 },
    },
    coalSeam: {
        name: "Coal Seam",
        cost: { stone: 20, wood: 10 },
        costScale: 1.10,
        jobs: 1,
        production: { coal: 0.6 },
        unlock: { mine: 2 },
    },
    herbalistDen: {
        name: "Herbalist's Den",
        cost: { wood: 20, food: 15 },
        costScale: 1.10,
        jobs: 1,
        production: { herbs: 0.5 },
        unlock: { farm: 3 },
    },
    huntingLodge: {
        name: "Hunting Lodge",
        cost: { wood: 25, stone: 10 },
        costScale: 1.10,
        jobs: 1,
        production: { bones: 0.4 },
        unlock: { lair: 3 },
    },
    clayPit: {
        name: "Clay Pit",
        cost: { wood: 15, stone: 15 },
        costScale: 1.08,
        jobs: 1,
        production: { clay: 0.6 },
        unlock: { quarry: 2 },
    },
    crystalSeam: {
        name: "Crystal Seam",
        cost: { stone: 30, wood: 15 },
        costScale: 1.12,
        jobs: 1,
        production: { crystals: 0.4 },
        unlock: { mine: 3 },
    },

    // ── Stage 3 — Industry (small coin costs 100–500 cp) ────────────────────────

    smelter: {
        name: "Smelter",
        cost: { stone: 50, wood: 30, ore: 20 },
        coinCost: 200,
        costScale: 1.15,
        jobs: 2,
        converts: { inputs: { ore: 1.0 }, output: "iron", outputRate: 0.5 },
        unlock: { mine: 1 },
    },
    alchemyLab: {
        name: "Alchemy Lab",
        cost: { wood: 40, stone: 25, herbs: 15 },
        coinCost: 150,
        costScale: 1.15,
        jobs: 1,
        converts: { inputs: { herbs: 0.8 }, output: "potions", outputRate: 0.3 },
        unlock: { herbalistDen: 1 },
    },
    kiln: {
        name: "Kiln",
        cost: { stone: 40, wood: 20, clay: 10 },
        coinCost: 150,
        costScale: 1.12,
        jobs: 1,
        converts: { inputs: { clay: 1.0, stone: 0.5 }, output: "bricks", outputRate: 0.6 },
        unlock: { clayPit: 1 },
    },
    loom: {
        name: "Loom",
        cost: { wood: 35, stone: 15 },
        coinCost: 100,
        costScale: 1.12,
        jobs: 1,
        converts: { inputs: { herbs: 0.6 }, output: "cloth", outputRate: 0.4 },
        unlock: { herbalistDen: 1, clayPit: 2 },
    },

    // ── Stage 4 — Advanced (medium coin costs 500–2000 cp) ──────────────────────

    arcaneGrinder: {
        name: "Arcane Grinder",
        cost: { stone: 60, crystals: 20 },
        coinCost: 500,
        costScale: 1.18,
        jobs: 1,
        converts: { inputs: { crystals: 0.5 }, output: "arcaneDust", outputRate: 0.3 },
        unlock: { crystalSeam: 1 },
    },
    forge: {
        name: "Forge",
        cost: { stone: 70, iron: 30, coal: 20 },
        coinCost: 800,
        costScale: 1.18,
        jobs: 2,
        converts: { inputs: { iron: 1.0, coal: 0.5 }, output: "steel", outputRate: 0.4 },
        unlock: { smelter: 1, coalSeam: 1 },
    },
    arcaneBench: {
        name: "Arcane Bench",
        cost: { stone: 60, crystals: 25, arcaneDust: 15 },
        coinCost: 1000,
        costScale: 1.20,
        jobs: 1,
        converts: { inputs: { crystals: 0.5, arcaneDust: 0.3 }, output: "runes", outputRate: 0.2 },
        unlock: { arcaneGrinder: 1 },
    },
    mageTower: {
        name: "Mage Tower",
        cost: { stone: 80, iron: 40 },
        coinCost: 1500,
        costScale: 1.20,
        jobs: 1,
        production: { crystals: 0.3 },
        unlock: { smelter: 1 },
    },
    armory: {
        name: "Armory",
        cost: { iron: 80, wood: 50 },
        coinCost: 1000,
        costScale: 1.20,
        jobs: 1,
        housingBonus: 5,
        unlock: { smelter: 1 },
    },
    sulphurVent: {
        name: "Sulphur Vent",
        cost: { stone: 60, iron: 30 },
        coinCost: 600,
        costScale: 1.15,
        jobs: 1,
        production: { sulphur: 0.4 },
        unlock: { mine: 3, smelter: 1 },
    },

    // ── Stage 5 — Endgame (large coin costs 2000–10000 cp) ──────────────────────

    ritualCircle: {
        name: "Ritual Circle",
        cost: { stone: 100, iron: 60, arcaneDust: 30 },
        coinCost: 3000,
        costScale: 1.25,
        jobs: 1,
        converts: { inputs: { arcaneDust: 0.3 }, output: "essence", outputRate: 0.05 },
        unlock: { arcaneGrinder: 1 },
    },
    spiderNest: {
        name: "Spider Nest",
        cost: { iron: 60, wood: 40, bones: 30 },
        coinCost: 2000,
        costScale: 1.22,
        jobs: 1,
        converts: { inputs: { bones: 0.5, food: 0.5 }, output: "silk", outputRate: 0.1 },
        unlock: { armory: 1, huntingLodge: 1 },
    },
    arcaneCrucible: {
        name: "Arcane Crucible",
        cost: { stone: 120, iron: 80, arcaneDust: 40 },
        coinCost: 5000,
        costScale: 1.25,
        jobs: 1,
        converts: { inputs: { iron: 1.0, arcaneDust: 0.5 }, output: "manaGold", outputRate: 0.1 },
        unlock: { mageTower: 1, forge: 1 },
    },
    darkAltar: {
        name: "Dark Altar",
        cost: { stone: 100, bones: 40, essence: 20 },
        coinCost: 4000,
        costScale: 1.28,
        jobs: 1,
        converts: { inputs: { bones: 1.0, essence: 0.1 }, output: "ichor", outputRate: 0.05 },
        unlock: { ritualCircle: 1, huntingLodge: 1 },
    },
    mithrilForge: {
        name: "Mithril Forge",
        cost: { steel: 80, iron: 100, crystals: 40 },
        coinCost: 10000,
        costScale: 1.30,
        jobs: 1,
        converts: { inputs: { steel: 1.0, crystals: 0.5 }, output: "mithril", outputRate: 0.02 },
        unlock: { forge: 2, arcaneGrinder: 1 },
    },
};

const GATHER_ACTIONS = {
    food:     { label: "Scavenge Food",     resource: "food",     amount: 1  },
    wood:     { label: "Fell a Tree",       resource: "wood",     amount: 1  },
    stone:    { label: "Break Stones",      resource: "stone",    amount: 1  },
    ore:      { label: "Chip Ore",          resource: "ore",      amount: 1  },
    herbs:    { label: "Forage Herbs",      resource: "herbs",    amount: 1  },
    crystals: { label: "Pry Crystals",      resource: "crystals", amount: 1  },
    coins:    { label: "Scrounge for Coin", resource: "coins",    amount: 15 },
};
