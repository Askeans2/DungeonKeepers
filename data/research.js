// data/research.js

const RESEARCH = {};

// ── Tier Reference ─────────────────────────────────────────────────────────────
// Internal schema only — not shown to players.
// Notation: era.tier  (e.g. "2.3" = Era 2, Tier 3)
// Era 1 has no research. All research begins at 2.1.
//
// | Tier | Stage         | Typical cost profile                                  |
// |------|---------------|-------------------------------------------------------|
// | 2.1  | Very early    | 30–60 of 1–2 basic resources (wood, stone, food)     |
// | 2.2  | Early         | 50–100 of 2–3 resources; iron / bones / herbs begin  |
// | 2.3  | Mid           | 60–100 of 2–4 resources; coal / crystals / bricks    |
// | 2.4  | Mid-late      | 40–80 resources + 5–20 lore; arcane materials begin  |
// | 2.5  | Late arcane   | 15–60 arcane resources; 20–60 lore; mana-gold / silk |
// | 2.6  | Pre-endgame   | 30–60 arcane + 40–80 lore; rare material combos      |
// | 2.7  | Deep          | 40–80 arcane + 60–100 lore; mithril begins           |
// | 2.8  | Near-endgame  | 50–90 arcane + 80–120 lore; mithril required         |
// | 2.9  | Final stretch | 60–100 arcane + ichor + mithril; 100–150 lore        |
// | 2.10 | Gates only    | Reserved — prestige & era-transition unlocks          |

// ── 2.1 — Very Early ──────────────────────────────────────────────────────────

RESEARCH.taxes = {
    tier: "2.3",
    name: "Taxation",
    desc: "Levy a tax on your population. Each creature contributes 1 cp per in-game day.",
    cost: { ore: 60, iron: 30 },
    requiresResearch: ["goldStandard"],
    effects: { taxBonus: 1, flag: "taxesEnabled" },
};

RESEARCH.toolcraft = {
    tier: "2.1",
    name: "Iron Tool Crafting",
    desc: "Forge crude iron implements for the whole settlement. All manual gathering yields +1 per action.",
    cost: { wood: 30, stone: 20, iron: 10 },
    effects: { allGatherBonus: 1 },
};

RESEARCH.timberfelling = {
    tier: "2.1",
    name: "Timber Felling",
    desc: "Proper axe technique and felling patterns. Lumber Camps produce 25% more wood.",
    cost: { wood: 40 },
    effects: { productionBonus: { lumber: 1.25 } },
};

RESEARCH.stonemason = {
    tier: "2.1",
    name: "Rough Stonemasonry",
    desc: "Chisels, wedges, and knowhow. Quarries produce 25% more stone.",
    cost: { stone: 40, wood: 20 },
    effects: { productionBonus: { quarry: 1.25 } },
};

RESEARCH.cropRotation = {
    tier: "2.1",
    name: "Crop Rotation",
    desc: "Rotate crops each season to replenish the soil. Farms produce 25% more food.",
    cost: { food: 50, wood: 20 },
    effects: { productionBonus: { farm: 1.25 } },
};

RESEARCH.foragerLore = {
    tier: "2.1",
    name: "Forager's Lore",
    desc: "Map the surrounding terrain for productive herb patches and cultivation sites. Herbalist's Dens produce 20% more herbs.",
    cost: { food: 30, wood: 20 },
    requiresResearch: ["toolcraft"],
    effects: { productionBonus: { herbalistDen: 1.20 } },
};

// Chain A — The Druid's Grove (step 1)
RESEARCH.wildHarvest = {
    tier: "2.1",
    name: "Wildcraft Harvest",
    desc: "Map the seasonal patterns of your terrain and plan farm and herb cycles around them. Farms and Herbalist's Dens produce 10% more.",
    cost: { food: 40, wood: 25 },
    requiresResearch: ["cropRotation"],
    effects: { productionBonus: { farm: 1.10, herbalistDen: 1.10 } },
};

// Chain E — The Alchemist's Circle (step 1)
RESEARCH.simplerTinctures = {
    tier: "2.1",
    name: "Simple Tinctures",
    desc: "Distill herbs directly — no exotic reagents, no ritual. Your Alchemy Lab produces 15% more potions.",
    cost: { herbs: 30, food: 20 },
    requiresResearch: ["foragerLore"],
    effects: { converterBonus: { alchemyLab: 1.15 } },
};

// ── 2.2 — Early ───────────────────────────────────────────────────────────────

RESEARCH.herbGarden = {
    tier: "2.2",
    name: "Herb Garden Plots",
    desc: "Lay out organized herb beds behind the Herbalist's Den. Herb production +25%.",
    cost: { wood: 30, food: 20 },
    requiresResearch: ["foragerLore"],
    effects: { productionBonus: { herbalistDen: 1.25 } },
};

RESEARCH.animalHusbandry = {
    tier: "2.2",
    name: "Animal Husbandry",
    desc: "Domesticate local animals for a steady supply. Hunting Lodge output +15% and food cap +50.",
    cost: { food: 60, wood: 25 },
    requiresResearch: ["cropRotation"],
    effects: { productionBonus: { huntingLodge: 1.15 }, capBonus: { food: 50 } },
};

RESEARCH.carpentry = {
    tier: "2.2",
    name: "Crude Carpentry",
    desc: "Better tools mean more splinters and more wood. Manual wood gathering yields +1 per action.",
    cost: { wood: 60, stone: 20 },
    requiresResearch: ["timberfelling"],
    effects: { gatherBonus: { wood: 1 } },
};

RESEARCH.quarrying = {
    tier: "2.2",
    name: "Better Quarrying",
    desc: "Systematic stone extraction techniques. Manual stone gathering yields +2 per action.",
    cost: { stone: 60, iron: 10 },
    requiresResearch: ["stonemason"],
    effects: { gatherBonus: { stone: 2 } },
};

RESEARCH.oreProspecting = {
    tier: "2.2",
    name: "Ore Prospecting",
    desc: "Learn to read rock formations for ore deposits. Mines produce 25% more ore.",
    cost: { stone: 50, wood: 20 },
    requiresResearch: ["stonemason"],
    effects: { productionBonus: { mine: 1.25 } },
};

RESEARCH.coalBunker = {
    tier: "2.2",
    name: "Coal Stockpiling",
    desc: "Covered bunkers keep coal dry and ready. Coal Seams produce 20% more and coal cap +100.",
    cost: { wood: 40, stone: 30 },
    requiresResearch: ["stonemason"],
    effects: { productionBonus: { coalSeam: 1.20 }, capBonus: { coal: 100 } },
};

RESEARCH.silverCurrency = {
    tier: "2.2",
    name: "Silver Currency",
    desc: "Smelt copper into standardized silver pieces. Every 100 cp is automatically rolled into 1 sp, simplifying your treasury display.",
    cost: { ore: 30, iron: 20 },
    requiresResearch: ["taxes"],
    effects: { flag: "silverCurrency" },
};

RESEARCH.composting = {
    tier: "2.2",
    name: "Composting",
    desc: "Pile waste and scraps into the fields. Farms produce an additional 25% more food.",
    cost: { food: 80, wood: 30, herbs: 20 },
    requiresResearch: ["cropRotation"],
    effects: { productionBonus: { farm: 1.25 } },
};

RESEARCH.communalLiving = {
    tier: "2.2",
    name: "Communal Living",
    desc: "Pack the burrows tighter and share the straw. Each Hovel provides +0.1 additional housing capacity.",
    cost: { wood: 60, stone: 40 },
    requiresResearch: ["cropRotation"],
    effects: { housingBonus: { lair: 0.1 } },
};

RESEARCH.taxCollector = {
    tier: "2.2",
    name: "Tax Collector",
    desc: "A dedicated ledger-keeper to squeeze out every copper. Taxation yields +1 cp per creature per day.",
    cost: { stone: 80, wood: 50 },
    requiresResearch: ["taxes"],
    effects: { taxBonus: 1 },
};

// Chain B — The Thieves' Quarter (step 1)
RESEARCH.shadowMarket = {
    tier: "2.3",
    name: "Shadow Market",
    desc: "Formalize the unofficial trade happening in back alleys and after dark. Taxation yields +1 cp per creature per day.",
    cost: { stone: 40, coins: 200 },
    requiresResearch: ["communalLiving"],
    effects: { taxBonus: 1 },
};

// Chain C — The Artificer's Craft (step 1)
RESEARCH.prototypeTools = {
    tier: "2.3",
    name: "Prototype Tools",
    desc: "Your settlement's tinkerers design purpose-built jigs and clamps for each construction task. All building wood and stone costs −10%.",
    cost: { wood: 60, iron: 30 },
    requiresResearch: ["toolcraft", "carpentry"],
    effects: { flag: "prototypeTools" },
};

// Chain F — The Ranger's Path (step 1)
RESEARCH.favoredTerrain = {
    tier: "2.2",
    name: "Favored Terrain",
    desc: "Learn every shortcut, game trail, and shelter the surrounding land offers. All manual gathering yields +1.",
    cost: { food: 40, wood: 30 },
    requiresResearch: ["foragerLore"],
    effects: { allGatherBonus: 1 },
};

// Standalone: Split-Face Quarrying
RESEARCH.stoneSplitting = {
    tier: "2.3",
    name: "Split-Face Quarrying",
    desc: "Strike the natural fault lines and the stone breaks true. Quarries produce 10% more and manual stone gathering yields +1.",
    cost: { stone: 50, iron: 15 },
    requiresResearch: ["stonemason"],
    effects: { productionBonus: { quarry: 1.10 }, gatherBonus: { stone: 1 } },
};

// Standalone: Seasoned Timber
RESEARCH.logDrying = {
    tier: "2.3",
    name: "Seasoned Timber",
    desc: "Let cut logs cure in the yard before use — the wood is stronger and cuts to size with far less waste. Lumber Camps produce 15% more.",
    cost: { wood: 60, stone: 20 },
    requiresResearch: ["timberfelling", "carpentry"],
    effects: { productionBonus: { lumber: 1.15 } },
};

// ── 2.3 — Mid ─────────────────────────────────────────────────────────────────

RESEARCH.deepMining = {
    tier: "2.3",
    name: "Deep Mining Techniques",
    desc: "Shafts, bracing, and lung-burning bravery. Mines produce 25% more ore and Crystal Seams become available.",
    cost: { stone: 80, ore: 40 },
    requiresResearch: ["oreProspecting"],
    effects: { productionBonus: { mine: 1.25 }, unlockBuildings: ["crystalSeam"] },
};

RESEARCH.crystalLore = {
    tier: "2.3",
    name: "Crystal Lore",
    desc: "Study the resonance of raw crystals. Crystal Seams produce 25% more crystals.",
    cost: { stone: 40, ore: 20 },
    requiresResearch: ["deepMining"],
    effects: { productionBonus: { crystalSeam: 1.25 } },
};

RESEARCH.sulphurStudy = {
    tier: "2.3",
    name: "Alchemical Sulphur",
    desc: "Figure out what the yellow powder actually does. Sulphur Vents produce 30% more sulphur.",
    cost: { stone: 60, coal: 30 },
    requiresResearch: ["coalBunker"],
    effects: { productionBonus: { sulphurVent: 1.30 } },
};

RESEARCH.bellowsDesign = {
    tier: "2.3",
    name: "Crude Bellows",
    desc: "A leather lung to stoke the forge fire. Smelter iron output +25%.",
    cost: { stone: 60, iron: 20 },
    requiresResearch: ["oreProspecting"],
    effects: { converterBonus: { smelter: 1.25 } },
};

RESEARCH.concentratedExtracts = {
    tier: "2.3",
    name: "Concentrated Tinctures",
    desc: "Reduce and concentrate herb extracts. Alchemy Lab potion output +25%.",
    cost: { herbs: 50, potions: 10 },
    requiresResearch: ["herbGarden"],
    effects: { converterBonus: { alchemyLab: 1.25 } },
};

RESEARCH.highFireKiln = {
    tier: "2.3",
    name: "High-Fire Kiln",
    desc: "Pack the kiln tighter and fire hotter. Kiln brick output +25%.",
    cost: { stone: 50, coal: 20 },
    requiresResearch: ["coalBunker"],
    effects: { converterBonus: { kiln: 1.25 } },
};

RESEARCH.loomMastery = {
    tier: "2.3",
    name: "Loom Mastery",
    desc: "Refined threading patterns and treadle timing. Loom cloth output +25%.",
    cost: { cloth: 20, wood: 30 },
    requiresResearch: ["herbGarden"],
    effects: { converterBonus: { loom: 1.25 } },
};

RESEARCH.packHunting = {
    tier: "2.3",
    name: "Pack Hunting",
    desc: "Coordinated drives and ambushes bring down more prey. Hunting Lodge output +25%.",
    cost: { food: 50, wood: 30 },
    requiresResearch: ["animalHusbandry"],
    effects: { productionBonus: { huntingLodge: 1.25 } },
};

RESEARCH.trapLines = {
    tier: "2.3",
    name: "Trap Lines",
    desc: "String snares through the forest overnight. Hunting Lodges produce 25% more overall.",
    cost: { wood: 50, bones: 30 },
    requiresResearch: ["packHunting"],
    effects: { productionBonus: { huntingLodge: 1.25 } },
};

RESEARCH.bonecraft = {
    tier: "2.5",
    name: "Bonework",
    desc: "Render, cure, and stack bones properly. Bone storage cap +150.",
    cost: { bones: 60, stone: 20 },
    requiresResearch: ["packHunting"],
    effects: { capBonus: { bones: 150 } },
};

RESEARCH.reinforcedShelving = {
    tier: "2.3",
    name: "Reinforced Shelving",
    desc: "Iron-braced racks and raised floors. Each Storage building now grants +75 cap instead of +50.",
    cost: { wood: 80, stone: 40, iron: 30 },
    requiresResearch: ["carpentry"],
    effects: { flag: "reinforcedShelving" },
};

RESEARCH.dryCellar = {
    tier: "2.3",
    name: "Dry Cellar",
    desc: "Stone-lined underground stores keep food and herbs fresh longer. Food cap +100, herbs cap +100.",
    cost: { stone: 60, wood: 40, bricks: 30 },
    requiresResearch: ["reinforcedShelving"],
    effects: { capBonus: { food: 100, herbs: 100 } },
};

RESEARCH.militiaDrill = {
    tier: "2.3",
    name: "Militia Drill",
    desc: "Weekly drills and bunk assignments. Each Armory houses +3 additional creatures.",
    cost: { iron: 40, wood: 30 },
    requiresResearch: ["communalLiving"],
    effects: { housingBonus: { armory: 3 } },
};

RESEARCH.bookkeeping = {
    tier: "2.3",
    name: "Village Ledger",
    desc: "Track debts, dues, and trade agreements. Taxation yields +1 additional cp per creature per day.",
    cost: { wood: 60, stone: 40 },
    requiresResearch: ["taxCollector"],
    effects: { taxBonus: 1 },
};

RESEARCH.rationing = {
    tier: "2.5",
    name: "Strict Rationing",
    desc: "Half-portions and no complaints. Your population consumes 20% less food per tick.",
    cost: { food: 100, wood: 30 },
    requiresResearch: ["composting"],
    effects: { foodConsumption: 0.80 },
};

RESEARCH.goldStandard = {
    tier: "2.3",
    name: "Gold Standard",
    desc: "Establish gold as the realm's reserve currency. Every 10 sp rolls into 1 gp, revealing the full gp / sp / cp denomination.",
    cost: { ore: 60, iron: 30 },
    requiresResearch: ["silverCurrency"],
    effects: { flag: "goldStandard" },
};

// Chain D — The War Caster (step 1)
RESEARCH.warFormations = {
    tier: "2.4",
    name: "Combat Formations",
    desc: "Tactical formations and bunk rotation increase how many fighters an Armory supports. Each Armory houses +5 additional creatures.",
    cost: { iron: 50, wood: 40 },
    requiresResearch: ["militiaDrill"],
    effects: { housingBonus: { armory: 5 } },
};

// Chain E — The Alchemist's Circle (step 2)
RESEARCH.refinedAlchemy = {
    tier: "2.4",
    name: "Refined Alchemy",
    desc: "Precise temperature control and staged distillation push your lab's output further. Alchemy Lab potion output +15% more.",
    cost: { herbs: 60, potions: 20 },
    requiresResearch: ["simplerTinctures", "concentratedExtracts"],
    effects: { converterBonus: { alchemyLab: 1.15 } },
};

// Chain G — The Dwarven Smith (step 1)
RESEARCH.quenchingTechniques = {
    tier: "2.4",
    name: "Tempering & Quench",
    desc: "Oil-quench and draw the iron at the right temperature. Your Smelters produce 15% more iron.",
    cost: { iron: 50, coal: 40 },
    requiresResearch: ["bellowsDesign"],
    effects: { converterBonus: { smelter: 1.15 } },
};

// Chain I — Runes of the Deep (step 1)
RESEARCH.dwarvenShoring = {
    tier: "2.4",
    name: "Dwarven Shoring",
    desc: "Dwarven-style timber frames and stone wedges brace the mine shafts, letting workers dig deeper and faster. Mines produce 15% more ore.",
    cost: { wood: 80, stone: 60, iron: 20 },
    requiresResearch: ["deepMining", "carpentry"],
    effects: { productionBonus: { mine: 1.15 } },
};

// Chain K — Settlement Housing (step 1)
RESEARCH.communalArchitecture = {
    tier: "2.4",
    name: "Communal Architecture",
    desc: "Standardized floor plans and shared load-bearing walls make every Hovel cheaper to build the more you construct. Hovel construction cost growth reduced.",
    cost: { wood: 80, stone: 60 },
    requiresResearch: ["communalLiving", "carpentry"],
    effects: { flag: "communalArchitecture" },
};

// Standalone: Iron Fittings
RESEARCH.ironFittings = {
    tier: "2.4",
    name: "Iron Fittings",
    desc: "Iron brackets, corner plates, and raised floor channels reinforce every Storage building's shelving. Each Storage building grants +15 additional cap to all resources.",
    cost: { iron: 40, wood: 50 },
    requiresResearch: ["reinforcedShelving"],
    effects: { flag: "ironFittings" },
};

// Standalone: Rendered Oil
RESEARCH.oilRendering = {
    tier: "2.4",
    name: "Rendered Oil",
    desc: "Render animal fat into lamp oil and distribute it throughout the settlement. Brighter worksites mean longer shifts — all buildings produce 5% more.",
    cost: { bones: 50, food: 40 },
    requiresResearch: ["animalHusbandry", "packHunting"],
    effects: { allProductionBonus: 0.05 },
};

// Standalone: Pre-Cut Timber
RESEARCH.prefabTimber = {
    tier: "2.4",
    name: "Pre-Cut Timber",
    desc: "Dimension lumber in the yard before the job site needs it. All building wood costs reduced by 15%.",
    cost: { wood: 70, iron: 25 },
    requiresResearch: ["carpentry"],
    effects: { flag: "prefabTimber" },
};

// Standalone: Stockpiled Dressed Stone
RESEARCH.stockpiledStone = {
    tier: "2.4",
    name: "Stockpiled Dressed Stone",
    desc: "Cut and stack stone at the quarry face so it's ready when construction starts. All building stone costs reduced by 15%.",
    cost: { stone: 70, iron: 20 },
    requiresResearch: ["quarrying"],
    effects: { flag: "stockpiledStone" },
};

// Standalone: Hearthstones
RESEARCH.hearthStones = {
    tier: "2.5",
    name: "Hearthstones",
    desc: "Dense kiln-fired hearthstones hold heat through the night, keeping the soil warm for longer growing seasons. Farms produce 10% more food.",
    cost: { stone: 50, coal: 30 },
    requiresResearch: ["highFireKiln"],
    effects: { productionBonus: { farm: 1.10 } },
};

// Standalone: Bone-Handled Tools
RESEARCH.boneTools = {
    tier: "2.5",
    name: "Bone-Handled Tools",
    desc: "Light, grippy bone handles improve control on every hand tool in the settlement. All manual gathering yields +1.",
    cost: { bones: 60, iron: 20 },
    requiresResearch: ["bonecraft"],
    effects: { allGatherBonus: 1 },
};

// ── 2.4 — Mid-Late ────────────────────────────────────────────────────────────

RESEARCH.crystalFocus = {
    tier: "2.4",
    name: "Crystal Focus Arrays",
    desc: "Arrange crystals to funnel resonance into the grinder. Arcane Grinder dust output +25%.",
    cost: { crystals: 50, arcaneDust: 20, lore: 8 },
    requiresResearch: ["crystalLore"],
    effects: { converterBonus: { arcaneGrinder: 1.25 } },
};

RESEARCH.forgeMastery = {
    tier: "2.4",
    name: "Forge Mastery",
    desc: "Quench, draw, and temper — the three secrets of the smith. Forge steel output +25%.",
    cost: { steel: 30, coal: 40, lore: 5 },
    requiresResearch: ["bellowsDesign"],
    effects: { converterBonus: { forge: 1.25 } },
};

RESEARCH.mortaredMasonry = {
    tier: "2.4",
    name: "Mortared Masonry",
    desc: "Lime mortar between courses of brick. Kiln output +25% and brick cap +50.",
    cost: { bricks: 40, stone: 60, lore: 5 },
    requiresResearch: ["highFireKiln", "quarrying"],
    effects: { converterBonus: { kiln: 1.25 }, capBonus: { bricks: 50 } },
};

RESEARCH.roadNetwork = {
    tier: "2.4",
    name: "Rutted Road Network",
    desc: "Packed earth and stone fill the worst ruts. All building passive production +5%.",
    cost: { stone: 100, wood: 60 },
    requiresResearch: ["carpentry", "quarrying"],
    effects: { allProductionBonus: 0.05 },
};

RESEARCH.tradeGoods = {
    tier: "2.5",
    name: "Trade Caravans",
    desc: "Send wagons of cloth and potions to nearby settlements. Cloth and potions in stock each generate 2 cp per unit per day.",
    cost: { cloth: 30, potions: 15 },
    requiresResearch: ["loomMastery"],
    effects: { flag: "tradeGoods" },
};

RESEARCH.guildCharter = {
    tier: "2.4",
    name: "Artisan's Guild Charter",
    desc: "Formalize the craft guilds with rights and duties. Smelter, Forge, Loom, and Kiln material costs -20%.",
    cost: { iron: 60, wood: 60, lore: 12 },
    requiresResearch: ["bellowsDesign", "loomMastery", "highFireKiln"],
    effects: { flag: "guildDiscount" },
};

RESEARCH.mintStandard = {
    tier: "2.4",
    name: "Mint Standard",
    desc: "Phase out copper entirely. All costs below 1 sp round up. Treasury displays in gold and silver only.",
    cost: { iron: 40, stone: 30, coins: 500 },
    requiresResearch: ["goldStandard"],
    effects: { flag: "mintStandard" },
};

RESEARCH.arcaneTapping = {
    tier: "2.4",
    name: "Arcane Tapping",
    desc: "Draw raw ley energy through the tower's crystal spire. Mage Tower crystal output +50%.",
    cost: { arcaneDust: 40, crystals: 30, lore: 15 },
    requiresResearch: ["crystalFocus"],
    effects: { productionBonus: { mageTower: 1.50 } },
};

RESEARCH.arcaneInscription = {
    tier: "2.4",
    name: "Arcane Inscription",
    desc: "Carve runes with intent, not guesswork. Arcane Bench rune output +25%.",
    cost: { runes: 20, crystals: 30, lore: 10 },
    requiresResearch: ["crystalFocus"],
    effects: { converterBonus: { arcaneBench: 1.25 } },
};

RESEARCH.loreKeeping = {
    tier: "2.4",
    name: "Lore Keeping",
    desc: "Establish a formal record of recovered knowledge. Scribes can now be set to work — unlocks the Scriptorium.",
    cost: { stone: 80, wood: 60 },
    requiresResearch: ["arcaneTapping", "taxes"],
    effects: { unlockBuildings: ["scriptorium"] },
};

RESEARCH.ironLockbox = {
    tier: "2.4",
    name: "Iron Lockbox",
    desc: "A bolted iron chest for the village treasury. Coin cap increased by 50,000 cp on top of the current currency tier's base.",
    cost: { iron: 60, stone: 40 },
    requiresResearch: ["taxCollector"],
    effects: { flag: "ironLockbox" },
};

// Chain A — The Druid's Grove (step 2)
RESEARCH.greenwardenLore = {
    tier: "2.4",
    name: "Greenwarden's Almanac",
    desc: "Compile the Greenwardens' field almanac of seasonal yields, soil health, and herb cycles. Farms and Herbalist's Dens produce 15% more.",
    cost: { lore: 100 },
    requiresResearch: ["wildHarvest", "loreKeeping"],
    effects: { productionBonus: { farm: 1.15, herbalistDen: 1.15 } },
};

// Chain F — The Ranger's Path (step 2)
RESEARCH.trackerSign = {
    tier: "2.4",
    name: "Tracker's Signs",
    desc: "Read tracks, territorial markings, and migration patterns to predict where the herds will be. Hunting Lodges produce 15% more.",
    cost: { lore: 100 },
    requiresResearch: ["favoredTerrain", "trapLines"],
    effects: { productionBonus: { huntingLodge: 1.15 } },
};

// Chain J — The Loremaster's Archive (step 1)
RESEARCH.annotatedTexts = {
    tier: "2.4",
    name: "Annotated Compendium",
    desc: "Scribes annotate recovered texts with cross-references and corrections, speeding future extraction. Scriptoriums produce 15% more lore.",
    cost: { lore: 120 },
    requiresResearch: ["loreKeeping"],
    effects: { productionBonus: { scriptorium: 1.15 } },
};

// Standalone: Crystal Polishing
RESEARCH.crystalPolishing = {
    tier: "2.5",
    name: "Crystal Polishing",
    desc: "Polish raw crystal faces to optical clarity, improving resonance transmission. Crystal Seams produce 15% more and Arcane Dust cap +50.",
    cost: { crystals: 40, arcaneDust: 20 },
    requiresResearch: ["crystalLore"],
    effects: { productionBonus: { crystalSeam: 1.15 }, capBonus: { arcaneDust: 50 } },
};

// Standalone: Sulphur-Lamp Shifts
RESEARCH.phosphorLamps = {
    tier: "2.5",
    name: "Sulphur-Lamp Shifts",
    desc: "Sulphur-burning lanterns extend the effective work shift into the evening. All buildings produce 3% more.",
    cost: { sulphur: 30, iron: 40, lore: 8 },
    requiresResearch: ["sulphurStudy"],
    effects: { allProductionBonus: 0.03 },
};

// Standalone: Alchemical Fertilizer
RESEARCH.alchemicalFertilizer = {
    tier: "2.5",
    name: "Alchemical Fertilizer",
    desc: "Alchemical byproducts mixed into compost accelerate crop growth. Farms produce 15% more food.",
    cost: { herbs: 60, potions: 20, lore: 10 },
    requiresResearch: ["concentratedExtracts", "composting"],
    effects: { productionBonus: { farm: 1.15 } },
};

// Standalone: Dedicated Tanners
RESEARCH.dedicatedTanners = {
    tier: "2.5",
    name: "Dedicated Tanners",
    desc: "Full-time tanners process every kill for bones, hide, and sinew instead of leaving it to the hunters. Hunting Lodges produce 15% more.",
    cost: { bones: 60, cloth: 20, lore: 8 },
    requiresResearch: ["bonecraft", "packHunting"],
    effects: { productionBonus: { huntingLodge: 1.15 } },
};

// ── 2.5 — Late Arcane ─────────────────────────────────────────────────────────

RESEARCH.runicScript = {
    tier: "2.5",
    name: "Runic Script",
    desc: "A standardized glyph system makes inscribing faster. Arcane Bench rune output +25% more.",
    cost: { lore: 220 },
    requiresResearch: ["arcaneInscription"],
    effects: { converterBonus: { arcaneBench: 1.25 } },
};

RESEARCH.essenceHarvest = {
    tier: "2.5",
    name: "Essence Harvesting",
    desc: "Capture ambient magical resonance in the circle's stone. Ritual Circle Arcane Essence output +50%.",
    cost: { lore: 270 },
    requiresResearch: ["arcaneTapping"],
    effects: { converterBonus: { ritualCircle: 1.50 } },
};

RESEARCH.ichorRefinement = {
    tier: "2.5",
    name: "Ichor Refinement",
    desc: "Render and purify dark altar drippings. Dark Altar ichor output +30%.",
    cost: { lore: 240 },
    requiresResearch: ["bonecraft"],
    effects: { converterBonus: { darkAltar: 1.30 } },
};

RESEARCH.silkCulture = {
    tier: "2.6",
    name: "Spider Keeper's Art",
    desc: "Keep the spiders well-fed and they weave faster. Spider Nest silk output +25%.",
    cost: { lore: 380 },
    requiresResearch: ["packHunting"],
    effects: { converterBonus: { spiderNest: 1.25 } },
};

RESEARCH.manaConductorCoils = {
    tier: "2.5",
    name: "Mana Conductor Coils",
    desc: "Wind copper coils into the crucible walls to focus mana flow. Arcane Crucible output +30%.",
    cost: { lore: 320 },
    requiresResearch: ["forgeMastery"],
    effects: { converterBonus: { arcaneCrucible: 1.30 } },
};

RESEARCH.mithrilTemper = {
    tier: "2.5",
    name: "Mithril Tempering",
    desc: "The precise heat range that turns grey metal silver-bright. Mithril Forge output +30%.",
    cost: { lore: 340 },
    requiresResearch: ["forgeMastery"],
    effects: { converterBonus: { mithrilForge: 1.30 } },
};

RESEARCH.ritualPrep = {
    tier: "2.5",
    name: "Rites of the Ancients",
    desc: "Recover the old ways from crumbling texts and stubborn elders. Unlocks the Ritual Circle. Arcane Essence cap +25.",
    cost: { lore: 260 },
    requiresResearch: ["arcaneTapping"],
    effects: { unlockBuildings: ["ritualCircle"], capBonus: { arcaneEssence: 25 } },
};

RESEARCH.darkTexts = {
    tier: "2.5",
    name: "Forbidden Texts",
    desc: "What you read cannot be unread. Unlocks the Dark Altar.",
    cost: { lore: 290 },
    requiresResearch: ["ritualPrep"],
    effects: { unlockBuildings: ["darkAltar"] },
};

RESEARCH.silkenWarren = {
    tier: "2.5",
    name: "Silken Warren",
    desc: "Prepare a sealed chamber and convince the spiders to cooperate. Unlocks the Spider Nest.",
    cost: { lore: 210 },
    requiresResearch: ["bonecraft", "militiaDrill"],
    effects: { unlockBuildings: ["spiderNest"] },
};

RESEARCH.manaConduit = {
    tier: "2.5",
    name: "Mana Conduit Forging",
    desc: "Forge a network of iron conduits to carry raw mana safely. Unlocks the Arcane Crucible.",
    cost: { lore: 310 },
    requiresResearch: ["arcaneTapping", "forgeMastery"],
    effects: { unlockBuildings: ["arcaneCrucible"] },
};

RESEARCH.goldOnly = {
    tier: "2.5",
    name: "Gold Coin Realm",
    desc: "Silver is for peasants. All costs below 1 gp round up to 1 gp. Treasury and all prices display in gold pieces only.",
    cost: { iron: 60, coins: 2000 },
    requiresResearch: ["mintStandard"],
    effects: { flag: "goldOnly" },
};


RESEARCH.infernalLore = {
    tier: "2.5",
    name: "Infernal Codex",
    desc: "Compile what your scholars know of the Nine Hells — their hierarchy, their rulers, and the one principle governing every transaction there: everything has a price. Bind the first pages.",
    cost: { lore: 350 },
    requiresResearch: ["darkTexts", "essenceHarvest"],
    effects: { flag: "infernalLore" },
};

// Chain B — The Thieves' Quarter (step 2)
RESEARCH.fencedGoods = {
    tier: "2.7",
    name: "The Fence's Cut",
    desc: "Establish a fence operation that resells goods at a premium to distant merchants. Trade-good income +50%. (Requires trade route system.)",
    cost: { lore: 550 },
    requiresResearch: ["shadowMarket", "tradeGoods"],
    effects: { flag: "fencedGoods" },
};

// Chain C — The Artificer's Craft (step 2)
RESEARCH.blueprintLibrary = {
    tier: "2.5",
    name: "Blueprint Archive",
    desc: "A systematized archive of construction blueprints reduces planning time and material waste on every new build. All building costs −10% further.",
    cost: { lore: 230 },
    requiresResearch: ["prototypeTools", "arcaneInscription"],
    effects: { flag: "blueprintLibrary" },
};

// Chain G — The Dwarven Smith (step 2)
RESEARCH.steelGrade = {
    tier: "2.5",
    name: "Graded Steelwork",
    desc: "Classify steel batches by carbon content and route each grade to the right application. Forges produce 15% more steel.",
    cost: { lore: 220 },
    requiresResearch: ["quenchingTechniques", "forgeMastery"],
    effects: { converterBonus: { forge: 1.15 } },
};

// Chain K — Settlement Housing (step 2)
RESEARCH.houseDesign = {
    tier: "2.6",
    name: "House Design",
    desc: "A proper multi-room house with a shared hearth and sleeping loft. Unlocks the House building, which houses 10 creatures.",
    cost: { lore: 410 },
    requiresResearch: ["communalArchitecture", "reinforcedShelving"],
    effects: { unlockBuildings: ["house"] },
};

// Standalone: Coal Gasification
RESEARCH.coalGasification = {
    tier: "2.6",
    name: "Coal Gasification",
    desc: "Combust coal into a combustible gas piped directly into the kiln chamber, achieving more consistent temperatures. Kilns produce 15% more bricks.",
    cost: { lore: 430 },
    requiresResearch: ["highFireKiln", "sulphurStudy"],
    effects: { converterBonus: { kiln: 1.15 } },
};

// Standalone: Pressurized Bellows
RESEARCH.pressurizedBellows = {
    tier: "2.6",
    name: "Pressurized Bellows",
    desc: "A water-wheel drives the bellows continuously, keeping a constant high-pressure blast on the smelter. Smelters produce 15% more iron and iron cap +100.",
    cost: { lore: 440 },
    requiresResearch: ["bellowsDesign", "forgeMastery"],
    effects: { converterBonus: { smelter: 1.15 }, capBonus: { iron: 100 } },
};

// Standalone: Ventilated Shafts
RESEARCH.ventilatedShafts = {
    tier: "2.6",
    name: "Ventilated Shafts",
    desc: "Air shafts and draft doors keep coal seam air clean, letting workers dig deeper veins. Coal Seams produce 15% more and coal cap +50.",
    cost: { lore: 460 },
    requiresResearch: ["coalBunker", "deepMining"],
    effects: { productionBonus: { coalSeam: 1.15 }, capBonus: { coal: 50 } },
};

// Standalone: Braided Silk Rope
RESEARCH.silkRope = {
    tier: "2.6",
    name: "Braided Silk Rope",
    desc: "Braid surplus silk into high-tensile rope for rigging and scaffolding, reducing the coin spent on construction hardware. Silk cap +50 and all building coin costs −10%.",
    cost: { lore: 390 },
    requiresResearch: ["silkCulture"],
    effects: { capBonus: { silk: 50 }, flag: "silkRope" },
};

// ── 2.6 — Pre-Endgame ─────────────────────────────────────────────────────────

// Chain D — The War Caster (step 2)
RESEARCH.shieldGuard = {
    tier: "2.7",
    name: "Shield Guard Doctrine",
    desc: "Trained guards rotate through worksites, keeping workers safe and morale high. All buildings produce 5% more.",
    cost: { lore: 580 },
    requiresResearch: ["warFormations", "forgeMastery"],
    effects: { allProductionBonus: 0.05 },
};

// Chain E — The Alchemist's Circle (step 3)
RESEARCH.masterworkPotions = {
    tier: "2.8",
    name: "Masterwork Formulae",
    desc: "Grand Magister-level formulae push your lab to its theoretical maximum. Alchemy Lab potion output +25% more and potion cap +50.",
    cost: { lore: 770 },
    requiresResearch: ["refinedAlchemy", "essenceHarvest"],
    effects: { converterBonus: { alchemyLab: 1.25 }, capBonus: { potions: 50 } },
};

// Chain I — Runes of the Deep (step 2)
RESEARCH.runesOfTheDeep = {
    tier: "2.8",
    name: "Runes of the Deep",
    desc: "Ancient dwarven runes carved into shaft walls and crystal chambers attune the stone to yield more readily. Mines +15% and Crystal Seams +15%.",
    cost: { lore: 750 },
    requiresResearch: ["dwarvenShoring", "runicScript"],
    effects: { productionBonus: { mine: 1.15, crystalSeam: 1.15 } },
};

// Standalone: Ore Beneficiation
RESEARCH.oreConcentrate = {
    tier: "2.7",
    name: "Ore Beneficiation",
    desc: "Crush and separate ore before feeding the Smelter — the building consumes ore more efficiently and produces 15% more iron.",
    cost: { lore: 560 },
    requiresResearch: ["bellowsDesign", "deepMining"],
    effects: { converterBonus: { smelter: 1.15 } },
};

// Standalone: Crystal Chandeliers
RESEARCH.crystalChandeliers = {
    tier: "2.7",
    name: "Crystal Chandeliers",
    desc: "Suspended crystal arrays in the Mage Tower focus ambient light into pure arcane energy. Mage Towers produce 15% more crystals.",
    cost: { lore: 570 },
    requiresResearch: ["arcaneTapping", "crystalFocus"],
    effects: { productionBonus: { mageTower: 1.15 } },
};

// ── 2.7 — Deep ────────────────────────────────────────────────────────────────

// Chain A — The Druid's Grove (step 3)
RESEARCH.circleOfTheWilds = {
    tier: "2.8",
    name: "Circle of the Wild",
    desc: "Formally induct nature wardens into the settlement's leadership — their deep knowledge transforms your harvests. Farms and Herbalist's Dens produce 20% more and food cap +200.",
    cost: { lore: 780 },
    requiresResearch: ["greenwardenLore", "ritualPrep"],
    effects: { productionBonus: { farm: 1.20, herbalistDen: 1.20 }, capBonus: { food: 200 } },
};

// Chain F — The Ranger's Path (step 3)
RESEARCH.rangersConclave = {
    tier: "2.9",
    name: "Ranger's Conclave",
    desc: "A formal conclave of scouts and guides shares knowledge across the region, transforming your hunters into experts. Hunting Lodges produce 25% more and bones cap +200.",
    cost: { lore: 950 },
    requiresResearch: ["trackerSign", "loreKeeping"],
    effects: { productionBonus: { huntingLodge: 1.25 }, capBonus: { bones: 200 } },
};

// Chain J — The Loremaster's Archive (step 2)
RESEARCH.crossReferenced = {
    tier: "2.9",
    name: "Cross-Referenced Index",
    desc: "A master index cards links every recovered text to every other — scribes spend less time searching and more time transcribing. Scriptoriums produce 25% more lore and lore cap +100.",
    cost: { lore: 970 },
    requiresResearch: ["annotatedTexts", "runicScript"],
    effects: { productionBonus: { scriptorium: 1.25 }, capBonus: { lore: 100 } },
};

// Standalone: Efficient Burn
RESEARCH.coalReduction = {
    tier: "2.8",
    name: "Efficient Burn",
    desc: "Improved combustion chambers and preheated air reduce the coal demanded by each smelting cycle. Forges produce 10% more steel.",
    cost: { lore: 760 },
    requiresResearch: ["forgeMastery", "manaConductorCoils"],
    effects: { converterBonus: { forge: 1.10 } },
};

// ── 2.8 — Near-Endgame ────────────────────────────────────────────────────────

// Chain B — The Thieves' Quarter (step 3)
RESEARCH.thievesGuild = {
    tier: "2.9",
    name: "Thieves' Guild Charter",
    desc: "Grant the guild a formal charter — they pay their dues in information, coin, and silence. Taxation yields +2 cp per creature per day and coin cap +25,000.",
    cost: { lore: 960 },
    requiresResearch: ["fencedGoods", "guildCharter"],
    effects: { taxBonus: 2, flag: "thievesGuild" },
};

// Chain C — The Artificer's Craft (step 3)
RESEARCH.masterCraft = {
    tier: "2.10",
    name: "Mastercrafted Works",
    desc: "Artificer-grade precision in every component eliminates all material waste. All building costs −15% further and coin costs −20%.",
    cost: { lore: 1050 },
    requiresResearch: ["blueprintLibrary", "forgeMastery"],
    effects: { flag: "masterCraft" },
};

// Chain G — The Dwarven Smith (step 3)
RESEARCH.dwarvenAnvil = {
    tier: "2.9",
    name: "Dwarven Anvil",
    desc: "A true dwarven-grade anvil of the right mass and temper makes every hammer blow count. Smelters +20%, Forges +20%, and mithril cap +10.",
    cost: { lore: 940 },
    requiresResearch: ["steelGrade", "mithrilTemper"],
    effects: { converterBonus: { smelter: 1.20, forge: 1.20 }, capBonus: { mithril: 10 } },
};

// Chain K — Settlement Housing (step 3)
RESEARCH.apartmentDesign = {
    tier: "2.10",
    name: "Apartment Design",
    desc: "Stack multiple family quarters vertically with shared stairwells and common areas. Unlocks the Apartment building, which houses 15 creatures.",
    cost: { lore: 1020 },
    requiresResearch: ["houseDesign", "mortaredMasonry"],
    effects: { unlockBuildings: ["apartment"] },
};

// Standalone: Runic Calibration
RESEARCH.runicCalibration = {
    tier: "2.9",
    name: "Runic Calibration",
    desc: "Calibrate each rune engraving to the precise arcane resonance band that maximizes stability. Arcane Benches produce 25% more runes and rune cap +100.",
    cost: { lore: 980 },
    requiresResearch: ["runicScript", "arcaneInscription"],
    effects: { converterBonus: { arcaneBench: 1.25 }, capBonus: { runes: 100 } },
};

// ── 2.9 — Final Stretch ───────────────────────────────────────────────────────

// Chain D — The War Caster (step 3)
RESEARCH.eliteCompany = {
    tier: "2.9",
    name: "Elite Company",
    desc: "A veteran elite company in mithril-reinforced gear. Each Armory houses +8 more creatures and the settlement's overall production rises 5%.",
    cost: { lore: 1200 },
    requiresResearch: ["shieldGuard", "mithrilTemper"],
    effects: { housingBonus: { armory: 8 }, allProductionBonus: 0.05 },
};

// Chain I — Runes of the Deep (step 3)
RESEARCH.stonecuttersGuild = {
    tier: "2.9",
    name: "Stonecutters' Guild",
    desc: "A formal guild of dwarven-trained stone workers optimizes every dig and cut. Quarries +25%, Mines +25%, and stone cap +500.",
    cost: { lore: 1100 },
    requiresResearch: ["runesOfTheDeep", "mortaredMasonry"],
    effects: { productionBonus: { quarry: 1.25, mine: 1.25 }, capBonus: { stone: 500 } },
};

// Chain J — The Loremaster's Archive (step 3)
RESEARCH.grandLibrary = {
    tier: "2.10",
    name: "Grand Library",
    desc: "A grand repository of all knowledge accumulated by the settlement. Scriptoriums produce 25% more lore and the lore cap expands by 300.",
    cost: { lore: 1100 },
    requiresResearch: ["crossReferenced", "runesOfTheDeep"],
    effects: { productionBonus: { scriptorium: 1.25 }, capBonus: { lore: 300 } },
};

// ── 2.10 — Final Gates ────────────────────────────────────────────────────────
// Reserved for prestige unlocks and era-transition gates only.

RESEARCH.planarRites = {
    tier: "2.10",
    name: "Rites of Planar Contact",
    desc: "Inscribe infernal geometries into the Ritual Circle floor — angles that should not fit in three dimensions. The circle can now reach further than it was designed to. Something on the other side has noticed.",
    cost: { lore: 1350 },
    requiresResearch: ["infernalLore", "ichorRefinement"],
    effects: { flag: "planarContact" },
};

RESEARCH.amnizuSummons = {
    tier: "2.10",
    name: "The Amnizu Summons",
    desc: "The geometries are drawn. You speak the invitation — not a summoning, not a command. Just an offer to negotiate. An Amnizu steps through. It already knows what you have built. It is only waiting to see how much of it you are willing to give.",
    cost: { lore: 1500 },
    requiresResearch: ["planarRites", "mithrilTemper"],
    effects: { flag: "amnizuAvailable" },
};

RESEARCH.dungeonBlueprint = {
    tier: "2.10",
    name: "Dungeon Blueprint",
    desc: "Maps, schematics, and the first load-bearing column of something far grander than a village. Era 3 awaits.",
    cost: { lore: 1400 },
    requiresResearch: ["ritualPrep", "darkTexts", "manaConduit", "mithrilTemper", "forgeMastery", "roadNetwork"],
    effects: { flag: "eraThreeUnlocked" },
};
