// data/rooms.js

const ROOMS = {
    lair: {
        name: "Lair",
        cost: { wood: 15 },
        costScale: 1.05,
        housingBonus: 5,        // population cap per lair
    },
    farm: {
        name: "Farm",
        cost: { wood: 10 },
        costScale: 1.05,
        jobs: 1,
        production: { food: 2 },  // per assigned worker per tick
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
        capBonus: { food: 50, wood: 50, stone: 50 },
    },
};

const GATHER_ACTIONS = {
    food:  { label: "Scavenge Food", resource: "food",  amount: 1 },
    wood:  { label: "Fell a Tree",   resource: "wood",  amount: 1 },
    stone: { label: "Break Stones",  resource: "stone", amount: 1 },
};
