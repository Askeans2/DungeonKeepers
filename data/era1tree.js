// data/era1tree.js — Era 1 Awakening Tree node definitions
// Each node: { id, name, layer, parent, flavor, cost, children, type, race }
// type: set on L4 nodes (the creature type name)
// race: set on L5 nodes (exact race name passed to playRace())

const ERA1_TREE = {

    // ── L0: Root ──────────────────────────────────────────────────────────────
    root: {
        id: 'root', name: 'The Mind Stirs', layer: 0, parent: null,
        flavor: 'A consciousness without form. A will without a body. You are the dungeon — and you are nothing yet. Something stirs in the deep dark: a hunger, a question, a reaching.',
        cost: {}, children: ['deep', 'wild', 'beyond'],
        type: null, race: null,
    },

    // ── L1: Domain ────────────────────────────────────────────────────────────
    deep: {
        id: 'deep', name: 'The Deep', layer: 1, parent: 'root',
        flavor: 'You are drawn to silence, to stone, to the dark places far below the surface. The weight of the earth feels like safety.',
        cost: { essence: 30 }, children: ['dominance', 'wisdom'],
        type: null, race: null,
    },
    wild: {
        id: 'wild', name: 'The Wild', layer: 1, parent: 'root',
        flavor: 'You are drawn to open skies, ancient forests, the primordial surface world. Life churns here in ways that call to something within you.',
        cost: { essence: 30 }, children: ['growth', 'hunt'],
        type: null, race: null,
    },
    beyond: {
        id: 'beyond', name: 'The Beyond', layer: 1, parent: 'root',
        flavor: 'You are drawn to void, shadow, and the supernatural planes. The mortal world feels thin — like a membrane barely holding back something vast.',
        cost: { essence: 30 }, children: ['undying', 'bargain'],
        type: null, race: null,
    },

    // ── L2: Drive ─────────────────────────────────────────────────────────────
    dominance: {
        id: 'dominance', name: 'Dominance', layer: 2, parent: 'deep',
        flavor: 'Strength is the only law in the deep. What cannot be crushed is not worth having. You hunger for creatures that impose their will on all around them.',
        cost: { essence: 50, influence: 20 }, children: ['horde', 'champion'],
        type: null, race: null,
    },
    wisdom: {
        id: 'wisdom', name: 'Ancient Wisdom', layer: 2, parent: 'deep',
        flavor: 'The deep holds secrets older than the world. You reach for knowledge others fear to touch — mysteries buried under stone since before the first age.',
        cost: { essence: 50, influence: 20 }, children: ['bloodline', 'anomaly'],
        type: null, race: null,
    },
    growth: {
        id: 'growth', name: 'Growth', layer: 2, parent: 'wild',
        flavor: 'Life conquers all in time. Even stone yields to root and vine given enough years. You feel the slow, patient power of living things spreading outward without end.',
        cost: { essence: 50, influence: 20 }, children: ['root-node', 'cycle'],
        type: null, race: null,
    },
    hunt: {
        id: 'hunt', name: 'The Hunt', layer: 2, parent: 'wild',
        flavor: 'Every living thing is prey or predator. You feel the razor edge of predation — the clarity of pursuit, the purity of violence in service of survival.',
        cost: { essence: 50, influence: 20 }, children: ['pack', 'apex'],
        type: null, race: null,
    },
    undying: {
        id: 'undying', name: 'Undying', layer: 2, parent: 'beyond',
        flavor: 'Death is not an ending — it is a transformation. The dead remember, and memory is power. Something in the dark beyond death calls to you like a familiar voice.',
        cost: { essence: 50, influence: 20 }, children: ['kept', 'consumed'],
        type: null, race: null,
    },
    bargain: {
        id: 'bargain', name: 'The Bargain', layer: 2, parent: 'beyond',
        flavor: 'Power is always given in exchange for something. The planes are full of entities willing to deal. You understand the grammar of contracts and the weight of oaths.',
        cost: { essence: 50, influence: 20 }, children: ['pact', 'vessel'],
        type: null, race: null,
    },

    // ── L3: Form ──────────────────────────────────────────────────────────────
    horde: {
        id: 'horde', name: 'The Horde', layer: 3, parent: 'dominance',
        flavor: 'Countless and relentless. Individually weak — together, an unstoppable tide. You do not need each servant to be strong. You need them to be many.',
        cost: { essence: 80, influence: 50 }, children: ['type-goblinoid', 'type-giant'],
        type: null, race: null,
    },
    champion: {
        id: 'champion', name: 'The Champion', layer: 3, parent: 'dominance',
        flavor: 'One that no enemy can match. You seek a being of singular power — a creature whose mere presence breaks the will of those who face it.',
        cost: { essence: 80, influence: 50 }, children: ['type-monstrous', 'type-construct'],
        type: null, race: null,
    },
    bloodline: {
        id: 'bloodline', name: 'The Bloodline', layer: 3, parent: 'wisdom',
        flavor: 'Power passed through ancient lineage. Heritage is destiny — the blood remembers what the mind forgets. You want beings whose ancestry is their greatest weapon.',
        cost: { essence: 80, influence: 50 }, children: ['type-draconic', 'type-humanoid-a'],
        type: null, race: null,
    },
    anomaly: {
        id: 'anomaly', name: 'The Anomaly', layer: 3, parent: 'wisdom',
        flavor: 'A mind so alien it reshapes reality around it. Understanding is impossible — and that impossibility is itself a kind of power. You crave the incomprehensible.',
        cost: { essence: 80, influence: 50 }, children: ['type-aberration-a', 'type-elemental-a'],
        type: null, race: null,
    },
    'root-node': {
        id: 'root-node', name: 'The Root', layer: 3, parent: 'growth',
        flavor: 'Slow, patient, inevitable growth. What seems dead is merely waiting. You resonate with things that spread, consume, and transform their environment over time.',
        cost: { essence: 80, influence: 50 }, children: ['type-flora', 'type-ooze-a'],
        type: null, race: null,
    },
    cycle: {
        id: 'cycle', name: 'The Cycle', layer: 3, parent: 'growth',
        flavor: 'Birth and death as a single eternal rhythm. You feel the world breathing — the great wheel of seasons, lives, and endings that feeds what comes after.',
        cost: { essence: 80, influence: 50 }, children: ['type-fey-a', 'type-lycanthrope-a'],
        type: null, race: null,
    },
    pack: {
        id: 'pack', name: 'The Pack', layer: 3, parent: 'hunt',
        flavor: 'Strength in numbers and coordination. The hunt is better shared — flanking, driving, pulling down prey too large for any one creature alone. You think in formations.',
        cost: { essence: 80, influence: 50 }, children: ['type-aquatic', 'type-lycanthrope-b'],
        type: null, race: null,
    },
    apex: {
        id: 'apex', name: 'The Apex', layer: 3, parent: 'hunt',
        flavor: 'One creature that rules all others. At the top of every food chain something waits with patient confidence. You want that thing — the unchallenged apex.',
        cost: { essence: 80, influence: 50 }, children: ['type-monstrous-b', 'type-giant-b'],
        type: null, race: null,
    },
    kept: {
        id: 'kept', name: 'The Kept', layer: 3, parent: 'undying',
        flavor: 'Servants who cannot die, only obey. They remember every command given since their making. Death could not take them — you will use what death left behind.',
        cost: { essence: 80, influence: 50 }, children: ['type-undead', 'type-construct-b'],
        type: null, race: null,
    },
    consumed: {
        id: 'consumed', name: 'The Consumed', layer: 3, parent: 'undying',
        flavor: 'A living hunger that dissolves all things. It does not fight — it absorbs. It does not remember — it incorporates. The consumed becomes the consumer.',
        cost: { essence: 80, influence: 50 }, children: ['type-ooze-b', 'type-aberration-b'],
        type: null, race: null,
    },
    pact: {
        id: 'pact', name: 'The Pact', layer: 3, parent: 'bargain',
        flavor: 'Bound by infernal contract — terrible and precise. Every agreement has a price. Every price has a collector. You want beings who understand the weight of both sides.',
        cost: { essence: 80, influence: 50 }, children: ['type-fiend', 'type-humanoid-b'],
        type: null, race: null,
    },
    vessel: {
        id: 'vessel', name: 'The Vessel', layer: 3, parent: 'bargain',
        flavor: 'Bodies shaped by elemental or arcane force — living conduits for power that transcends the flesh. The form is merely a container for something much larger.',
        cost: { essence: 80, influence: 50 }, children: ['type-elemental-b', 'type-fey-b'],
        type: null, race: null,
    },

    // ── L4: Type Selection ────────────────────────────────────────────────────
    // Two type choices per L3 node. Children lead to L5 race nodes.

    'type-goblinoid': {
        id: 'type-goblinoid', name: 'Goblinoid', layer: 4, parent: 'horde',
        flavor: 'Small, cunning, and brutally numerous. Goblins, hobgoblins, and their kin do not fight fair — they fight in numbers, with traps, from shadows, until the enemy breaks.',
        cost: { influence: 120, mana: 60 }, children: ['race-goblin', 'race-hobgoblin'],
        type: 'Goblinoid', race: null,
    },
    'type-giant': {
        id: 'type-giant', name: 'Giant', layer: 4, parent: 'horde',
        flavor: 'Massive, ancient, and slow to rouse — but impossible to ignore once moving. Giants carry the weight of the world in their strikes and the memory of the first ages in their bones.',
        cost: { influence: 120, mana: 60 }, children: ['race-hill-giant', 'race-stone-giant'],
        type: 'Giant', race: null,
    },
    'type-monstrous': {
        id: 'type-monstrous', name: 'Monstrous', layer: 4, parent: 'champion',
        flavor: 'Not a type but a verdict — creatures defined by the violence they embody. They are apex threats wearing flesh as armor, and they know it.',
        cost: { influence: 120, mana: 60 }, children: ['race-troll', 'race-minotaur'],
        type: 'Monstrous', race: null,
    },
    'type-construct': {
        id: 'type-construct', name: 'Construct', layer: 4, parent: 'champion',
        flavor: 'Built, not born. Purpose-forged and tireless — constructs obey without question, work without rest, and feel no fear. You would be their maker and their mission.',
        cost: { influence: 120, mana: 60 }, children: ['race-stone-golem', 'race-animated-armor'],
        type: 'Construct', race: null,
    },
    'type-draconic': {
        id: 'type-draconic', name: 'Draconic', layer: 4, parent: 'bloodline',
        flavor: 'Dragon-blooded and proud of it. Even those far from true dragonhood carry the fire of ancient power in their veins — and they will remind you of it constantly.',
        cost: { influence: 120, mana: 60 }, children: ['race-kobold', 'race-lizardfolk'],
        type: 'Draconic', race: null,
    },
    'type-humanoid-a': {
        id: 'type-humanoid-a', name: 'Humanoid', layer: 4, parent: 'bloodline',
        flavor: 'Adaptable, ambitious, and endlessly varied. Humanoids build civilizations, wage wars, develop magic, and fill every role from laborer to legend. Their versatility is their greatest strength.',
        cost: { influence: 120, mana: 60 }, children: ['race-human', 'race-elf'],
        type: 'Humanoid', race: null,
    },
    'type-aberration-a': {
        id: 'type-aberration-a', name: 'Aberration', layer: 4, parent: 'anomaly',
        flavor: 'Wrong in ways that resist description. Aberrations do not follow the rules of the natural world because those rules were written without them in mind. They operate on other logic entirely.',
        cost: { influence: 120, mana: 60 }, children: ['race-nothic', 'race-gibbering-mouther'],
        type: 'Aberration', race: null,
    },
    'type-elemental-a': {
        id: 'type-elemental-a', name: 'Elemental', layer: 4, parent: 'anomaly',
        flavor: 'Pure force given form. Elementals are not creatures that wield fire or stone — they are fire and stone, temporarily choosing a shape. Their power is foundational.',
        cost: { influence: 120, mana: 60 }, children: ['race-fire-elemental', 'race-earth-elemental'],
        type: 'Elemental', race: null,
    },
    'type-flora': {
        id: 'type-flora', name: 'Flora', layer: 4, parent: 'root-node',
        flavor: 'The living dungeon defends itself. Plant-based creatures are patient beyond all reckoning — they take root, they grow, they wait. Then they act.',
        cost: { influence: 120, mana: 60 }, children: ['race-treant', 'race-myconid'],
        type: 'Flora', race: null,
    },
    'type-ooze-a': {
        id: 'type-ooze-a', name: 'Ooze', layer: 4, parent: 'root-node',
        flavor: 'Simple, persistent, nearly unkillable. Oozes dissolve what they touch and grow on what they absorb. They are closer to a natural law than a creature.',
        cost: { influence: 120, mana: 60 }, children: ['race-gelatinous-cube', 'race-gray-ooze'],
        type: 'Ooze', race: null,
    },
    'type-fey-a': {
        id: 'type-fey-a', name: 'Fey', layer: 4, parent: 'cycle',
        flavor: 'Magic older than spellbooks. Fey are not magic-users — they are magic, structured into personalities that range from whimsical to terrifying with no warning.',
        cost: { influence: 120, mana: 60 }, children: ['race-pixie', 'race-dryad'],
        type: 'Fey', race: null,
    },
    'type-lycanthrope-a': {
        id: 'type-lycanthrope-a', name: 'Lycanthrope', layer: 4, parent: 'cycle',
        flavor: 'Caught between two natures — and lethal in both. Lycanthropes embody transformation itself: the beast that lives inside every civilized mind, finally given teeth.',
        cost: { influence: 120, mana: 60 }, children: ['race-werebear', 'race-werewolf'],
        type: 'Lycanthrope', race: null,
    },
    'type-aquatic': {
        id: 'type-aquatic', name: 'Aquatic', layer: 4, parent: 'pack',
        flavor: 'The depths have their own hierarchies and their own violence. Aquatic creatures coordinate in ways surface-dwellers call instinct — but is closer to a shared, ancient intelligence.',
        cost: { influence: 120, mana: 60 }, children: ['race-merfolk', 'race-sahuagin'],
        type: 'Aquatic', race: null,
    },
    'type-lycanthrope-b': {
        id: 'type-lycanthrope-b', name: 'Lycanthrope', layer: 4, parent: 'pack',
        flavor: 'The pack is everything. Lycanthropes in their beast form are nearly unstoppable — but it is the coordination between them, the pack instinct, that makes them truly dangerous.',
        cost: { influence: 120, mana: 60 }, children: ['race-werebear', 'race-werewolf'],
        type: 'Lycanthrope', race: null,
    },
    'type-monstrous-b': {
        id: 'type-monstrous-b', name: 'Monstrous', layer: 4, parent: 'apex',
        flavor: 'At the end of every food chain, something ancient and terrible waits with complete confidence. It does not hunt because it must. It hunts because nothing can stop it.',
        cost: { influence: 120, mana: 60 }, children: ['race-troll', 'race-minotaur'],
        type: 'Monstrous', race: null,
    },
    'type-giant-b': {
        id: 'type-giant-b', name: 'Giant', layer: 4, parent: 'apex',
        flavor: 'The giants remember when the world was new and smaller things had not yet inherited it. They have not forgiven the forgetting.',
        cost: { influence: 120, mana: 60 }, children: ['race-hill-giant', 'race-stone-giant'],
        type: 'Giant', race: null,
    },
    'type-undead': {
        id: 'type-undead', name: 'Undead', layer: 4, parent: 'kept',
        flavor: 'They died. They remember. Now they serve — or they wander, or they hunger. The ones that serve are the ones worth having. You will make sure yours serve.',
        cost: { influence: 120, mana: 60 }, children: ['race-skeleton', 'race-zombie'],
        type: 'Undead', race: null,
    },
    'type-construct-b': {
        id: 'type-construct-b', name: 'Construct', layer: 4, parent: 'kept',
        flavor: 'Immortal by design. A construct does not tire, does not rebel, does not question. Give it a purpose and watch it fulfill that purpose until the end of the world.',
        cost: { influence: 120, mana: 60 }, children: ['race-stone-golem', 'race-animated-armor'],
        type: 'Construct', race: null,
    },
    'type-ooze-b': {
        id: 'type-ooze-b', name: 'Ooze', layer: 4, parent: 'consumed',
        flavor: 'It does not think about consuming — consuming is what it is. Oozes are hunger given form, and they are very, very patient about getting what they want.',
        cost: { influence: 120, mana: 60 }, children: ['race-gelatinous-cube', 'race-gray-ooze'],
        type: 'Ooze', race: null,
    },
    'type-aberration-b': {
        id: 'type-aberration-b', name: 'Aberration', layer: 4, parent: 'consumed',
        flavor: 'What the consumed aberration absorbs, it understands. What it understands, it can replicate. What it can replicate, it no longer needs the original of.',
        cost: { influence: 120, mana: 60 }, children: ['race-nothic', 'race-gibbering-mouther'],
        type: 'Aberration', race: null,
    },
    'type-fiend': {
        id: 'type-fiend', name: 'Fiend', layer: 4, parent: 'pact',
        flavor: 'Infernal power in mortal flesh — or something close enough to flesh. Fiends do not serve freely, but they respect terms clearly negotiated. You have a dungeon. They want power. Discuss.',
        cost: { influence: 120, mana: 60 }, children: ['race-imp', 'race-cambion'],
        type: 'Fiend', race: null,
    },
    'type-humanoid-b': {
        id: 'type-humanoid-b', name: 'Humanoid', layer: 4, parent: 'pact',
        flavor: 'Some humanoids deal with dark powers knowingly, eyes open, price accepted. They are not corrupted — they are specialized. They understand what they signed.',
        cost: { influence: 120, mana: 60 }, children: ['race-human', 'race-elf'],
        type: 'Humanoid', race: null,
    },
    'type-elemental-b': {
        id: 'type-elemental-b', name: 'Elemental', layer: 4, parent: 'vessel',
        flavor: 'The bargain with an elemental is simple: a place to exist, a purpose to fill. They do not want treasure or glory — they want to be what they are, fully, without restraint.',
        cost: { influence: 120, mana: 60 }, children: ['race-fire-elemental', 'race-earth-elemental'],
        type: 'Elemental', race: null,
    },
    'type-fey-b': {
        id: 'type-fey-b', name: 'Fey', layer: 4, parent: 'vessel',
        flavor: 'Fey are vessels for something older than intention. They carry magic that flows through them like water through stone — shaping both the carrier and the carried.',
        cost: { influence: 120, mana: 60 }, children: ['race-pixie', 'race-dryad'],
        type: 'Fey', race: null,
    },

    // ── L5: Race Selection ────────────────────────────────────────────────────
    // Picking one of these triggers the Era 1 → Era 2 transition.

    'race-goblin': {
        id: 'race-goblin', name: 'Goblin', layer: 5, parent: 'type-goblinoid',
        flavor: 'Small, mean, and absolutely everywhere. Goblins breed fast, die fast, and somehow always have more ready to replace the ones that fell. Their greatest weapon is that no one takes them seriously.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Goblinoid', race: 'Goblin',
    },
    'race-hobgoblin': {
        id: 'race-hobgoblin', name: 'Hobgoblin', layer: 5, parent: 'type-goblinoid',
        flavor: 'Where goblins are chaos, hobgoblins are discipline. Militaristic and precise, they build hierarchies, follow orders, and fight with a professionalism that surprises everyone at least once.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Goblinoid', race: 'Hobgoblin',
    },
    'race-hill-giant': {
        id: 'race-hill-giant', name: 'Hill Giant', layer: 5, parent: 'type-giant',
        flavor: 'Large, hungry, and dangerous primarily because of momentum. Hill Giants are not subtle, but you rarely need to be when you can throw a boulder through a castle wall.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Giant', race: 'Hill Giant',
    },
    'race-stone-giant': {
        id: 'race-stone-giant', name: 'Stone Giant', layer: 5, parent: 'type-giant',
        flavor: 'Stone Giants are artists and recluses who happen to be enormous. They carve beauty from rock, avoid surface creatures when possible, and become devastatingly violent when pushed.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Giant', race: 'Stone Giant',
    },
    'race-troll': {
        id: 'race-troll', name: 'Troll', layer: 5, parent: 'type-monstrous',
        flavor: 'Trolls do not understand defeat. They regenerate from wounds that would kill anything else, shrug off pain, and come back from near-death with no lesson learned except hunger.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Monstrous', race: 'Troll',
    },
    'race-minotaur': {
        id: 'race-minotaur', name: 'Minotaur', layer: 5, parent: 'type-monstrous',
        flavor: 'Half-man, half-bull, all fury. Minotaurs are cursed beings who channel their rage into something almost purposeful. In the right labyrinth, there is nothing more terrifying.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Monstrous', race: 'Minotaur',
    },
    'race-stone-golem': {
        id: 'race-stone-golem', name: 'Stone Golem', layer: 5, parent: 'type-construct',
        flavor: 'Massive animated stone, bound by rune and will. Stone Golems move slowly and strike with the finality of an avalanche. They do not tire. They do not stop. They do not forget their instructions.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Construct', race: 'Stone Golem',
    },
    'race-animated-armor': {
        id: 'race-animated-armor', name: 'Animated Armor', layer: 5, parent: 'type-construct',
        flavor: 'Empty armor that walks, guards, and fights without a body inside it. Animated Armor is unsettling precisely because it is familiar — the shape of a warrior, but hollow all the way through.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Construct', race: 'Animated Armor',
    },
    'race-kobold': {
        id: 'race-kobold', name: 'Kobold', layer: 5, parent: 'type-draconic',
        flavor: 'Dragon-worshipping, trap-building, tunnel-digging survivors. Kobolds are the architects of underground spite — individually weak, collectively dangerous, and absolutely convinced of their own eventual greatness.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Draconic', race: 'Kobold',
    },
    'race-lizardfolk': {
        id: 'race-lizardfolk', name: 'Lizardfolk', layer: 5, parent: 'type-draconic',
        flavor: 'Ancient, cold-blooded, and deeply practical. Lizardfolk feel no sentimentality — only survival, resource, and utility. They make excellent dungeon inhabitants because a dungeon is, to them, simply optimal shelter.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Draconic', race: 'Lizardfolk',
    },
    'race-human': {
        id: 'race-human', name: 'Human', layer: 5, parent: 'type-humanoid-a',
        flavor: 'The most adaptable creature on the material plane. Humans build, bargain, fight, and reproduce with a relentlessness that has made them ubiquitous. Their weakness is their strength: they need everything, and so they become everything.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Humanoid', race: 'Human',
    },
    'race-elf': {
        id: 'race-elf', name: 'Elf', layer: 5, parent: 'type-humanoid-a',
        flavor: 'Long-lived, elegant, and quietly convinced of their superiority — with enough history behind them to make the argument. Elves bring craftsmanship, memory, and a patience that outlasts most problems.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Humanoid', race: 'Elf',
    },
    'race-nothic': {
        id: 'race-nothic', name: 'Nothic', layer: 5, parent: 'type-aberration-a',
        flavor: 'What remains when a wizard pushes too far into forbidden knowledge. Nothics stare at everything and understand too much — their rotting insight strips away pretense, dignity, and occasionally sanity.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Aberration', race: 'Nothic',
    },
    'race-gibbering-mouther': {
        id: 'race-gibbering-mouther', name: 'Gibbering Mouther', layer: 5, parent: 'type-aberration-a',
        flavor: 'A mass of mouths and eyes that moves, gibbering constantly. The sounds it makes are not language but they contain language — fragments of minds it has already consumed.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Aberration', race: 'Gibbering Mouther',
    },
    'race-fire-elemental': {
        id: 'race-fire-elemental', name: 'Fire Elemental', layer: 5, parent: 'type-elemental-a',
        flavor: 'Burning attention, burning purpose, burning everything it touches by accident and by design. Fire Elementals are not malicious — they simply express their nature completely and without apology.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Elemental', race: 'Fire Elemental',
    },
    'race-earth-elemental': {
        id: 'race-earth-elemental', name: 'Earth Elemental', layer: 5, parent: 'type-elemental-a',
        flavor: 'Patient as stone, strong as stone, durable as stone, and about as communicative as stone. Earth Elementals are not slow — they simply measure time differently.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Elemental', race: 'Earth Elemental',
    },
    'race-treant': {
        id: 'race-treant', name: 'Treant', layer: 5, parent: 'type-flora',
        flavor: 'Ancient trees given consciousness and grievance. Treants remember every forest that has ever burned and carry that memory with them like armor. They are slow to anger. They are slow in general. When they finally move, the ground shakes.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Flora', race: 'Treant',
    },
    'race-myconid': {
        id: 'race-myconid', name: 'Myconid', layer: 5, parent: 'type-flora',
        flavor: 'Fungal creatures that communicate through spores and understand the world through decomposition. Myconids are peaceful, communal, and deeply strange — their understanding of reality is genuinely alien.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Flora', race: 'Myconid',
    },
    'race-gelatinous-cube': {
        id: 'race-gelatinous-cube', name: 'Gelatinous Cube', layer: 5, parent: 'type-ooze-a',
        flavor: 'A perfect cube of transparent, digestive slime that moves through corridors with quiet efficiency. The Gelatinous Cube is the dungeon\'s ideal janitor — it consumes everything left behind and leaves halls spotless.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Ooze', race: 'Gelatinous Cube',
    },
    'race-gray-ooze': {
        id: 'race-gray-ooze', name: 'Gray Ooze', layer: 5, parent: 'type-ooze-a',
        flavor: 'Metal-corroding, stone-dissolving, nearly invisible until too late. Gray Ooze is the patient disaster that adventurers discover only after sitting in it for several seconds.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Ooze', race: 'Gray Ooze',
    },
    'race-pixie': {
        id: 'race-pixie', name: 'Pixie', layer: 5, parent: 'type-fey-a',
        flavor: 'Tiny, fast, invisible when they choose, and genuinely dangerous. Pixies are not weapons — they are pranks that escalate. Their magic is subtle until it very suddenly is not.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Fey', race: 'Pixie',
    },
    'race-dryad': {
        id: 'race-dryad', name: 'Dryad', layer: 5, parent: 'type-fey-a',
        flavor: 'Bound to their tree and willing to do anything to protect it. Dryads are quiet, beautiful, and quietly willing to enchant, charm, or destroy anything that threatens what they love.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Fey', race: 'Dryad',
    },
    'race-werebear': {
        id: 'race-werebear', name: 'Werebear', layer: 5, parent: 'type-lycanthrope-a',
        flavor: 'Gentle in their human form and catastrophic in their bear form. Werebears are protective by nature — they choose what they defend and defend it with absolute, thunderous commitment.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Lycanthrope', race: 'Werebear',
    },
    'race-werewolf': {
        id: 'race-werewolf', name: 'Werewolf', layer: 5, parent: 'type-lycanthrope-a',
        flavor: 'The wolf remembers what the human tries to forget. Werewolves are hunters first, pack animals second, and complicated individuals a distant third. In the dungeon, they are simply very effective.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Lycanthrope', race: 'Werewolf',
    },
    'race-merfolk': {
        id: 'race-merfolk', name: 'Merfolk', layer: 5, parent: 'type-aquatic',
        flavor: 'Half fish, all politics. Merfolk organize into elaborate courts and hierarchies beneath the waves — and bring all of that structure with them when they relocate to a dungeon that suits them.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Aquatic', race: 'Merfolk',
    },
    'race-sahuagin': {
        id: 'race-sahuagin', name: 'Sahuagin', layer: 5, parent: 'type-aquatic',
        flavor: 'Sea devils with an appetite for conflict. Sahuagin raid, pillage, and worship the shark. Their society is built on strength and their dungeon will be built the same way.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Aquatic', race: 'Sahuagin',
    },
    'race-skeleton': {
        id: 'race-skeleton', name: 'Skeleton', layer: 5, parent: 'type-undead',
        flavor: 'Bones with purpose. Skeletons are the simplest undead — mindless, obedient, durable, and completely interchangeable. They are exactly what you need them to be: more.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Undead', race: 'Skeleton',
    },
    'race-zombie': {
        id: 'race-zombie', name: 'Zombie', layer: 5, parent: 'type-undead',
        flavor: 'Slow, relentless, and absolutely unconcerned about their own survival because that question was already settled. Zombies do not stop. They accumulate. They overwhelm.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Undead', race: 'Zombie',
    },
    'race-imp': {
        id: 'race-imp', name: 'Imp', layer: 5, parent: 'type-fiend',
        flavor: 'Small devils with large ambitions. Imps spy, manipulate, whisper, and scheme — they are the infernal plane\'s answer to the question "what if spite had wings and was invisible?"',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Fiend', race: 'Imp',
    },
    'race-cambion': {
        id: 'race-cambion', name: 'Cambion', layer: 5, parent: 'type-fiend',
        flavor: 'Born of devil and mortal, Cambions inherit the worst and best of both. Charismatic, cunning, infernally powered, and nursing a grudge against a world that never fully accepted them.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Fiend', race: 'Cambion',
    },
    // L5 nodes reachable via alternate L4 paths (same races, alternate parents for routing)
    'race-human-b': {
        id: 'race-human-b', name: 'Human', layer: 5, parent: 'type-humanoid-b',
        flavor: 'Adaptable and endlessly motivated. These humans chose the pact path knowingly — they are not victims of dark power but partners in it, drawing strength from what others fear.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Humanoid', race: 'Human',
    },
    'race-elf-b': {
        id: 'race-elf-b', name: 'Elf', layer: 5, parent: 'type-humanoid-b',
        flavor: 'Long memory and a willingness to bargain with things that most beings wisely avoid. These elves made their choice centuries ago and have had time to grow comfortable with the consequences.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Humanoid', race: 'Elf',
    },
    'race-fire-elemental-b': {
        id: 'race-fire-elemental-b', name: 'Fire Elemental', layer: 5, parent: 'type-elemental-b',
        flavor: 'A vessel for raw elemental fire, negotiated into service. It burns what it is told to burn and stands where it is told to stand. The flame within it is ancient and does not forget warmth.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Elemental', race: 'Fire Elemental',
    },
    'race-earth-elemental-b': {
        id: 'race-earth-elemental-b', name: 'Earth Elemental', layer: 5, parent: 'type-elemental-b',
        flavor: 'Stone, directed. Earth Elementals summoned through pact are no different from any other — they simply have a more formal arrangement. Terms agreed. Service rendered. Simple.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Elemental', race: 'Earth Elemental',
    },
    'race-pixie-b': {
        id: 'race-pixie-b', name: 'Pixie', layer: 5, parent: 'type-fey-b',
        flavor: 'The Pixie as vessel: fey magic flows through them like electricity through copper. They do not generate the magic — they conduct it, focus it, and occasionally lose control of it spectacularly.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Fey', race: 'Pixie',
    },
    'race-dryad-b': {
        id: 'race-dryad-b', name: 'Dryad', layer: 5, parent: 'type-fey-b',
        flavor: 'A Dryad bound to your dungeon is a Dryad whose tree is the dungeon itself. Watch what that loyalty becomes when the whole stone structure is her home.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Fey', race: 'Dryad',
    },
    'race-troll-b': {
        id: 'race-troll-b', name: 'Troll', layer: 5, parent: 'type-monstrous-b',
        flavor: 'The apex predator that simply refuses to die. Trolls regenerate, adapt, and keep coming — the perfect top of a food chain that extends all the way down to anything that moves.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Monstrous', race: 'Troll',
    },
    'race-minotaur-b': {
        id: 'race-minotaur-b', name: 'Minotaur', layer: 5, parent: 'type-monstrous-b',
        flavor: 'The Minotaur as apex: given a labyrinth and a purpose, it becomes something close to a natural law. Adventurers have been warned. They go in anyway. That is why you will always have Minotaurs.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Monstrous', race: 'Minotaur',
    },
    'race-hill-giant-b': {
        id: 'race-hill-giant-b', name: 'Hill Giant', layer: 5, parent: 'type-giant-b',
        flavor: 'The apex of the food chain for anything foolish enough to cross the hills. Hill Giants eat adventurers for the same reason they eat everything else: because they can and they were hungry.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Giant', race: 'Hill Giant',
    },
    'race-stone-giant-b': {
        id: 'race-stone-giant-b', name: 'Stone Giant', layer: 5, parent: 'type-giant-b',
        flavor: 'The Stone Giant as apex does not chase. It does not need to. It stands, it watches, and anything worth its attention comes close enough eventually. Then the stone moves.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Giant', race: 'Stone Giant',
    },
    'race-nothic-b': {
        id: 'race-nothic-b', name: 'Nothic', layer: 5, parent: 'type-aberration-b',
        flavor: 'The consumed Nothic has seen too many minds and now wears the knowledge like ill-fitting clothes. It remembers being consumed. It remembers becoming the consumer. It stares.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Aberration', race: 'Nothic',
    },
    'race-gibbering-mouther-b': {
        id: 'race-gibbering-mouther-b', name: 'Gibbering Mouther', layer: 5, parent: 'type-aberration-b',
        flavor: 'The mouths do not stop. Each one once belonged to something else. The Gibbering Mouther is not hungry — it is full, and still consuming, because that is the only thing it remembers how to do.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Aberration', race: 'Gibbering Mouther',
    },
    'race-stone-golem-b': {
        id: 'race-stone-golem-b', name: 'Stone Golem', layer: 5, parent: 'type-construct-b',
        flavor: 'Built to last, built to obey, built to stand long after its maker has become dust. The kept Stone Golem serves because it was made to serve, and will continue serving until the stone itself wears away.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Construct', race: 'Stone Golem',
    },
    'race-animated-armor-b': {
        id: 'race-animated-armor-b', name: 'Animated Armor', layer: 5, parent: 'type-construct-b',
        flavor: 'Empty armor that was given one instruction and has been following it ever since. The warrior inside it is gone. The duty remains. The Animated Armor does not know the difference.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Construct', race: 'Animated Armor',
    },
    'race-gelatinous-cube-b': {
        id: 'race-gelatinous-cube-b', name: 'Gelatinous Cube', layer: 5, parent: 'type-ooze-b',
        flavor: 'The consumed Gelatinous Cube was not eaten — it is the eating. It does not fear the labyrinth. It is the labyrinth\'s immune system, slow and thorough and inevitable.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Ooze', race: 'Gelatinous Cube',
    },
    'race-gray-ooze-b': {
        id: 'race-gray-ooze-b', name: 'Gray Ooze', layer: 5, parent: 'type-ooze-b',
        flavor: 'The Gray Ooze does not think about consuming. It simply moves toward density. Metal, stone, flesh — it processes them all with equal indifference and equal efficiency.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Ooze', race: 'Gray Ooze',
    },
    'race-werebear-b': {
        id: 'race-werebear-b', name: 'Werebear', layer: 5, parent: 'type-lycanthrope-b',
        flavor: 'In a pack, the Werebear is the anchor — the massive immovable point around which the hunt organizes itself. Everything else flows around it. The prey does not understand that until too late.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Lycanthrope', race: 'Werebear',
    },
    'race-werewolf-b': {
        id: 'race-werewolf-b', name: 'Werewolf', layer: 5, parent: 'type-lycanthrope-b',
        flavor: 'The pack knows the Werewolf\'s howl before they hear it. They are already moving. This is the hunt as a collective truth — not a decision but a fact, and the prey is the only one who doesn\'t know it yet.',
        cost: { influence: 200, mana: 100 }, children: [],
        type: 'Lycanthrope', race: 'Werewolf',
    },
};

// Convenience: ordered L1 domain ids
const ERA1_DOMAINS = ['deep', 'wild', 'beyond'];

// Branch color class lookup (by domain id)
const ERA1_BRANCH_CLASS = {
    deep:   'era1-deep',
    wild:   'era1-wild',
    beyond: 'era1-beyond',
};

// Get the domain ancestor id for a node (used for branch coloring)
function era1GetDomain(nodeId) {
    let node = ERA1_TREE[nodeId];
    while (node && node.layer > 1) node = ERA1_TREE[node.parent];
    return node ? node.id : null;
}
