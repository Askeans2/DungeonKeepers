// data/era1tree.js — Era 1 Awakening Tree node definitions
// Each node: { id, name, layer, parent, flavor, cost, children, type, race }
// L5 race nodes are generated programmatically at the bottom from RACE_LEAF_DEFS.

const ERA1_TREE = {

    // ── L0: Root ──────────────────────────────────────────────────────────────
    root: {
        id: 'root', name: 'Awakening', layer: 0, parent: null,
        flavor: 'A consciousness without form. A will without a body. You are the dungeon — and you are nothing yet. Something stirs in the deep dark: a hunger, a question, a reaching.',
        cost: {}, children: ['deep', 'wild', 'beyond'],
        type: null, race: null,
    },

    // ── L1: Domain ────────────────────────────────────────────────────────────
    deep: {
        id: 'deep', name: 'The Deep', layer: 1, parent: 'root',
        flavor: 'You are drawn to silence, to stone, to the dark places far below the surface. The weight of the earth feels like safety.',
        cost: { essence: 200 }, children: ['dominance', 'wisdom'],
        type: null, race: null,
    },
    wild: {
        id: 'wild', name: 'The Wild', layer: 1, parent: 'root',
        flavor: 'You are drawn to open skies, ancient forests, the primordial surface world. Life churns here in ways that call to something within you.',
        cost: { essence: 200 }, children: ['growth', 'hunt'],
        type: null, race: null,
    },
    beyond: {
        id: 'beyond', name: 'The Beyond', layer: 1, parent: 'root',
        flavor: 'You are drawn to void, shadow, and the supernatural planes. The mortal world feels thin — like a membrane barely holding back something vast.',
        cost: { essence: 200 }, children: ['undying', 'bargain'],
        type: null, race: null,
    },

    // ── L2: Drive ─────────────────────────────────────────────────────────────
    dominance: {
        id: 'dominance', name: 'Dominance', layer: 2, parent: 'deep',
        flavor: 'Strength is the only law in the deep. What cannot be crushed is not worth having. You hunger for creatures that impose their will on all around them.',
        cost: { essence: 400, influence: 200 }, children: ['horde', 'colossus'],
        type: null, race: null,
    },
    wisdom: {
        id: 'wisdom', name: 'Ancient Wisdom', layer: 2, parent: 'deep',
        flavor: 'The deep holds secrets older than the world. You reach for knowledge others fear to touch — mysteries buried under stone since before the first age.',
        cost: { essence: 400, influence: 200 }, children: ['anomaly', 'forged'],
        type: null, race: null,
    },
    growth: {
        id: 'growth', name: 'Growth', layer: 2, parent: 'wild',
        flavor: 'Life conquers all in time. Even stone yields to root and vine given enough years. You feel the slow, patient power of living things spreading outward without end.',
        cost: { essence: 400, influence: 200 }, children: ['root-node', 'changed'],
        type: null, race: null,
    },
    hunt: {
        id: 'hunt', name: 'The Hunt', layer: 2, parent: 'wild',
        flavor: 'Every living thing is prey or predator. You feel the razor edge of predation — the clarity of pursuit, the purity of violence in service of survival.',
        cost: { essence: 400, influence: 200 }, children: ['pack', 'apex'],
        type: null, race: null,
    },
    undying: {
        id: 'undying', name: 'Undying', layer: 2, parent: 'beyond',
        flavor: 'Death is not an ending — it is a transformation. The dead remember, and memory is power. Something in the dark beyond death calls to you like a familiar voice.',
        cost: { essence: 400, influence: 200 }, children: ['kept', 'anchored'],
        type: null, race: null,
    },
    bargain: {
        id: 'bargain', name: 'The Bargain', layer: 2, parent: 'beyond',
        flavor: 'Power is always given in exchange for something. The planes are full of entities willing to deal. You understand the grammar of contracts and the weight of oaths.',
        cost: { essence: 400, influence: 200 }, children: ['pact', 'covenant'],
        type: null, race: null,
    },

    // ── L3: Form ──────────────────────────────────────────────────────────────
    horde: {
        id: 'horde', name: 'The Horde', layer: 3, parent: 'dominance',
        flavor: 'Countless and relentless. Individually weak — together, an unstoppable tide. You do not need each servant to be strong. You need them to be many.',
        cost: { essence: 600, influence: 400 }, children: ['type-goblinoid', 'type-swarm'],
        type: null, race: null,
    },
    colossus: {
        id: 'colossus', name: 'The Colossus', layer: 3, parent: 'dominance',
        flavor: 'Not many — one. One that cracks the ground with each step and forces the world to reorganize itself around its presence. You crave scale, magnitude, the power that needs no numbers.',
        cost: { essence: 600, influence: 400 }, children: ['type-giant', 'type-titan'],
        type: null, race: null,
    },
    anomaly: {
        id: 'anomaly', name: 'The Anomaly', layer: 3, parent: 'wisdom',
        flavor: 'A mind so alien it reshapes reality around it. Understanding is impossible — and that impossibility is itself a kind of power. You crave the incomprehensible.',
        cost: { essence: 600, influence: 400 }, children: ['type-aberration', 'type-draconic'],
        type: null, race: null,
    },
    forged: {
        id: 'forged', name: 'The Forged', layer: 3, parent: 'wisdom',
        flavor: 'Knowledge made manifest. The deep does not only accumulate secrets — it builds with them. You want servants shaped by craft and purpose, not born by accident.',
        cost: { essence: 600, influence: 400 }, children: ['type-construct', 'type-cursed'],
        type: null, race: null,
    },
    'root-node': {
        id: 'root-node', name: 'The Root', layer: 3, parent: 'growth',
        flavor: 'Slow, patient, inevitable growth. What seems dead is merely waiting. You resonate with things that spread, consume, and transform their environment over time.',
        cost: { essence: 600, influence: 400 }, children: ['type-flora', 'type-ooze'],
        type: null, race: null,
    },
    changed: {
        id: 'changed', name: 'The Changed', layer: 3, parent: 'growth',
        flavor: 'Life does not merely grow — it transforms. The most powerful things in the wild are not what they were born as. You are drawn to creatures that carry their change inside them, unstable and magnificent.',
        cost: { essence: 600, influence: 400 }, children: ['type-lycanthrope', 'type-fey'],
        type: null, race: null,
    },
    pack: {
        id: 'pack', name: 'The Pack', layer: 3, parent: 'hunt',
        flavor: 'Strength in numbers and coordination. The hunt is better shared — flanking, driving, pulling down prey too large for any one creature alone. You think in formations.',
        cost: { essence: 600, influence: 400 }, children: ['type-aquatic', 'type-beast'],
        type: null, race: null,
    },
    apex: {
        id: 'apex', name: 'The Apex', layer: 3, parent: 'hunt',
        flavor: 'The hunt ends with one creature standing. Not because it hunted in numbers — because it is simply beyond what was sent against it. You want the thing at the top of every food chain.',
        cost: { essence: 600, influence: 400 }, children: ['type-monstrous', 'type-legendary'],
        type: null, race: null,
    },
    kept: {
        id: 'kept', name: 'The Kept', layer: 3, parent: 'undying',
        flavor: 'Servants who cannot die, only obey. They remember every command given since their making. Death could not take them — you will use what death left behind.',
        cost: { essence: 600, influence: 400 }, children: ['type-undead', 'type-specter'],
        type: null, race: null,
    },
    anchored: {
        id: 'anchored', name: 'The Anchored', layer: 3, parent: 'undying',
        flavor: 'Not dead — never alive. Forces bound into form, compelled to serve by laws older than language. You want servants made from the world itself, elemental and eternal.',
        cost: { essence: 600, influence: 400 }, children: ['type-elemental', 'type-primordial'],
        type: null, race: null,
    },
    pact: {
        id: 'pact', name: 'The Pact', layer: 3, parent: 'bargain',
        flavor: 'Bound by infernal contract — terrible and precise. Every agreement has a price. Every price has a collector. You want beings who understand the weight of both sides.',
        cost: { essence: 600, influence: 400 }, children: ['type-fiend', 'type-humanoid'],
        type: null, race: null,
    },
    covenant: {
        id: 'covenant', name: 'The Covenant', layer: 3, parent: 'bargain',
        flavor: 'Not a contract but a vow — something sworn across the fabric of the planes themselves. These beings did not agree out of desperation. They agreed because they chose to. That makes all the difference.',
        cost: { essence: 600, influence: 400 }, children: ['type-planar', 'type-celestial'],
        type: null, race: null,
    },

    // ── L4: Type Selection ────────────────────────────────────────────────────
    // Deep → Horde
    'type-goblinoid': {
        id: 'type-goblinoid', name: 'Goblinoid', layer: 4, parent: 'horde',
        flavor: 'Small, cunning, and brutally numerous. Goblins, hobgoblins, and their kin do not fight fair — they fight in numbers, with traps, from shadows, until the enemy breaks.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Goblinoid', race: null,
    },
    'type-giant': {
        id: 'type-giant', name: 'Giant', layer: 4, parent: 'colossus',
        flavor: 'Massive, ancient, and slow to rouse — but impossible to ignore once moving. Giants carry the weight of the world in their strikes and the memory of the first ages in their bones.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Giant', race: null,
    },
    'type-titan': {
        id: 'type-titan', name: 'Titan', layer: 4, parent: 'colossus',
        flavor: 'Giants are large. Titans are something else entirely — beings of the primordial age when the world was still being decided, whose scale is measured in mountains and whose memory predates civilization by an epoch.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Titan', race: null,
    },
    'type-swarm': {
        id: 'type-swarm', name: 'Swarm', layer: 4, parent: 'horde',
        flavor: 'Not a creature but a verdict — countless small things moving as one terrible whole. A swarm does not attack; it consumes. It does not retreat; it redirects.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Swarm', race: null,
    },
    // Deep → Anomaly
    'type-aberration': {
        id: 'type-aberration', name: 'Aberration', layer: 4, parent: 'anomaly',
        flavor: 'Wrong in ways that resist description. Aberrations do not follow the rules of the natural world because those rules were written without them in mind. They operate on other logic entirely.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Aberration', race: null,
    },
    'type-construct': {
        id: 'type-construct', name: 'Construct', layer: 4, parent: 'forged',
        flavor: 'Built, not born. Purpose-forged and tireless — constructs obey without question, work without rest, and feel no fear. You would be their maker and their mission.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Construct', race: null,
    },
    'type-cursed': {
        id: 'type-cursed', name: 'Cursed', layer: 4, parent: 'forged',
        flavor: 'Not made but unmade — then remade into something the original creature would not recognize. Knowledge of forbidden things has consequences, and the Cursed are what those consequences look like with teeth.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Cursed', race: null,
    },
    'type-draconic': {
        id: 'type-draconic', name: 'Draconic', layer: 4, parent: 'anomaly',
        flavor: 'Dragon-blooded and proud of it. Even those far from true dragonhood carry the fire of ancient power in their veins — and they will remind you of it constantly.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Draconic', race: null,
    },
    // Wild → Root
    'type-flora': {
        id: 'type-flora', name: 'Flora', layer: 4, parent: 'root-node',
        flavor: 'The living dungeon defends itself. Plant-based creatures are patient beyond all reckoning — they take root, they grow, they wait. Then they act.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Flora', race: null,
    },
    'type-ooze': {
        id: 'type-ooze', name: 'Ooze', layer: 4, parent: 'root-node',
        flavor: 'Simple, persistent, nearly unkillable. Oozes dissolve what they touch and grow on what they absorb. They are closer to a natural law than a creature.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Ooze', race: null,
    },
    'type-lycanthrope': {
        id: 'type-lycanthrope', name: 'Lycanthrope', layer: 4, parent: 'changed',
        flavor: 'Caught between two natures — and lethal in both. Lycanthropes embody transformation itself: the beast that lives inside every civilized mind, finally given teeth.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Lycanthrope', race: null,
    },
    'type-fey': {
        id: 'type-fey', name: 'Fey', layer: 4, parent: 'changed',
        flavor: 'The wild\'s other face — not red in tooth and claw but ancient, enchanted, and utterly unconcerned with mortal logic. Fey do not follow rules. They follow moods, whims, and oaths sworn under moonlight that meant something once.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Fey', race: null,
    },
    // Wild → Pack
    'type-aquatic': {
        id: 'type-aquatic', name: 'Aquatic', layer: 4, parent: 'pack',
        flavor: 'The depths have their own hierarchies and their own violence. Aquatic creatures coordinate in ways surface-dwellers call instinct — but is closer to a shared, ancient intelligence.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Aquatic', race: null,
    },
    'type-monstrous': {
        id: 'type-monstrous', name: 'Monstrous', layer: 4, parent: 'apex',
        flavor: 'Not a type but a verdict — creatures defined by the violence they embody. They are apex threats wearing flesh as armor, and they know it.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Monstrous', race: null,
    },
    'type-legendary': {
        id: 'type-legendary', name: 'Sovereign', layer: 4, parent: 'apex',
        flavor: 'Apex beings that rule their domain absolutely — not through numbers or cunning, but through sheer presence. Where a Sovereign exists, everything else exists around it.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Sovereign', race: null,
    },
    'type-beast': {
        id: 'type-beast', name: 'Beast', layer: 4, parent: 'pack',
        flavor: 'Pure predator, no agenda. Beasts do not scheme or bargain — they hunt, kill, and survive with a clarity that more complicated creatures spend their lives trying to rediscover.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Beast', race: null,
    },
    // Beyond → Kept
    'type-undead': {
        id: 'type-undead', name: 'Undead', layer: 4, parent: 'kept',
        flavor: 'They died. They remember. Now they serve — or they wander, or they hunger. The ones that serve are the ones worth having. You will make sure yours serve.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Undead', race: null,
    },
    'type-elemental': {
        id: 'type-elemental', name: 'Elemental', layer: 4, parent: 'anchored',
        flavor: 'Pure force given form. Elementals are not creatures that wield fire or stone — they are fire and stone, temporarily choosing a shape. Their power is foundational.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Elemental', race: null,
    },
    'type-primordial': {
        id: 'type-primordial', name: 'Primordial', layer: 4, parent: 'anchored',
        flavor: 'Older than elements. Before fire and stone were classified, before the planes were separated, something moved through the formless dark. Primordials are what remained when the world decided to have rules — and they never agreed to them.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Primordial', race: null,
    },
    'type-specter': {
        id: 'type-specter', name: 'Specter', layer: 4, parent: 'kept',
        flavor: 'Incorporeal and endless. Specters are not the dead — they are what the dead leave behind when something refuses to let go. They pass through walls and through reason alike.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Specter', race: null,
    },
    // Beyond → Pact
    'type-fiend': {
        id: 'type-fiend', name: 'Fiend', layer: 4, parent: 'pact',
        flavor: 'Infernal power in mortal flesh — or something close enough to flesh. Fiends do not serve freely, but they respect terms clearly negotiated. You have a dungeon. They want power. Discuss.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Fiend', race: null,
    },
    'type-humanoid': {
        id: 'type-humanoid', name: 'Humanoid', layer: 4, parent: 'pact',
        flavor: 'Adaptable, ambitious, and endlessly varied. Humanoids build civilizations, wage wars, develop magic, and fill every role from laborer to legend. Their versatility is their greatest strength.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Humanoid', race: null,
    },
    'type-planar': {
        id: 'type-planar', name: 'Planar', layer: 4, parent: 'covenant',
        flavor: 'Beings from beyond the material plane — shaped by realities with different rules. Planar creatures carry the logic of their home with them, and that logic does not always translate.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Planar', race: null,
    },
    'type-celestial': {
        id: 'type-celestial', name: 'Celestial', layer: 4, parent: 'covenant',

        flavor: 'Light that chose darkness, or was pushed into it. Celestials under a dungeon lord\'s banner are fallen, bound, or simply pragmatic — their power unchanged, their allegiance redirected.',
        cost: { essence: 800, influence: 600, mana: 300 }, children: [],
        type: 'Celestial', race: null,
    },

};

// ── L5 Race leaf definitions ──────────────────────────────────────────────────
// { race, type, flavor } — node id and parent are derived automatically.
// Type must match a type-* L4 node's .type field.
// Children arrays on L4 nodes are populated by the loop below.

const RACE_LEAF_DEFS = [
    // Goblinoid
    { race: 'Goblin',     type: 'Goblinoid', flavor: 'Small, mean, and absolutely everywhere. Goblins breed fast, die fast, and somehow always have more ready to replace the ones that fell. Their greatest weapon is that no one takes them seriously.' },
    { race: 'Hobgoblin',  type: 'Goblinoid', flavor: 'Where goblins are chaos, hobgoblins are discipline. Militaristic and precise, they build hierarchies, follow orders, and fight with a professionalism that surprises everyone at least once.' },
    { race: 'Bugbear',    type: 'Goblinoid', flavor: 'Huge, stealthy, and casually brutal. Bugbears do not fight — they ambush. The victim rarely understands what happened, and the Bugbear prefers it that way.' },
    { race: 'Orc',        type: 'Goblinoid', flavor: 'Ferocious warriors who respect strength above all. Orcs do not make excuses, do not accept defeat, and hold a grudge with a patience that belies their reputation for rage.' },
    { race: 'Gnoll',      type: 'Goblinoid', flavor: 'Laughing hyena-folk who worship a demon lord of destruction. Gnolls fight in frenzied packs and leave nothing useful behind — carnage is, to them, a religious experience.' },
    { race: 'Barghest',   type: 'Goblinoid', flavor: 'A fiendish wolf that grows stronger by consuming souls. Barghests wear the skins of goblins until they do not need to anymore. Then they stop pretending.' },

    // Giant
    { race: 'Hill Giant',   type: 'Giant', flavor: 'Large, hungry, and dangerous primarily because of momentum. Hill Giants are not subtle, but you rarely need to be when you can throw a boulder through a castle wall.' },
    { race: 'Stone Giant',  type: 'Giant', flavor: 'Stone Giants are artists and recluses who happen to be enormous. They carve beauty from rock, avoid surface creatures when possible, and become devastatingly violent when pushed.' },
    { race: 'Frost Giant',  type: 'Giant', flavor: 'Cold as the tundra they call home and twice as unforgiving. Frost Giants raid, plunder, and collect trophies from everything they defeat — which is most things.' },
    { race: 'Fire Giant',   type: 'Giant', flavor: 'Master smiths and disciplined soldiers. Fire Giants build weapons as great as any civilization and wield them with professional fury in service of their militant hierarchy.' },
    { race: 'Cloud Giant',  type: 'Giant', flavor: 'Aloof, wealthy, and disdainful of lesser beings. Cloud Giants live above the world in literal and figurative terms, and they are happy to remind you of it.' },
    { race: 'Storm Giant',  type: 'Giant', flavor: 'The most powerful of their kind, Storm Giants commune with the cosmos and carry weather in their wake. They are not cruel — they simply do not notice when things break.' },

    // Swarm
    { race: 'Stirge',         type: 'Swarm', flavor: 'Blood-drinking, bat-winged horrors that strike in clouds and drain prey dry before the victim notices how many there are. Stirges are individually trivial and collectively catastrophic.' },
    { race: 'Cranium Rat',    type: 'Swarm', flavor: 'Mind Flayer-bred vermin with collective psychic intelligence. Alone, a Cranium Rat is barely a threat. A swarm of them becomes a single, distributed, telepathic mind hungry for secrets.' },
    { race: 'Rot Grub',       type: 'Swarm', flavor: 'Tiny burrowing parasites that infest corpses and the living alike. Rot Grubs do not fight — they infiltrate, and by the time their presence is known it is already too late to matter.' },
    { race: 'Shadow Swarm',   type: 'Swarm', flavor: 'Fragments of darkness given appetite. No single shadow-mote is dangerous. Ten thousand of them, moving as one hungry mass through a corridor, are something else entirely.' },
    { race: 'Spore Cloud',    type: 'Swarm', flavor: 'Not a creature but a colony — fungal spores with collective direction and terrible patience. A Spore Cloud drifts until it finds warmth, then it finds purchase, and then the host has a new purpose.' },
    { race: 'Plague Locust',  type: 'Swarm', flavor: 'Individually nothing. Collectively, a verdict. Plague Locusts consume everything in their path with no malice and no mercy — appetite elevated to a geological force.' },

    // Aberration
    { race: 'Mind Flayer',        type: 'Aberration', flavor: 'Intellect devourers in elegant form. Mind Flayers consume brains, enslave lesser beings, and build empires of psychic control in the dark places beneath the world.' },
    { race: 'Beholder',           type: 'Aberration', flavor: 'A floating sphere of paranoid magical supremacy. Every eye a different death. Beholders do not cooperate even with other Beholders — each believes itself the only true one.' },
    { race: 'Aboleth',            type: 'Aberration', flavor: 'Ancient beyond reckoning, Aboleths remember every life they have consumed. They predate the gods and have not forgiven the world for moving on without them.' },
    { race: 'Gibbering Mouther',  type: 'Aberration', flavor: 'A mass of mouths and eyes that moves, gibbering constantly. The sounds it makes are not language but they contain language — fragments of minds it has already consumed.' },
    { race: 'Nothic',             type: 'Aberration', flavor: 'What remains when a wizard pushes too far into forbidden knowledge. Nothics stare at everything and understand too much — their rotting insight strips away pretense, dignity, and occasionally sanity.' },
    { race: 'Chuul',              type: 'Aberration', flavor: 'Ancient crustacean servitors whose masters are long dead. Chuuls still follow orders they received millennia ago, interpreting them creatively for situations their creators never imagined.' },
    { race: 'Grell',              type: 'Aberration', flavor: 'A floating brain with a beak and poisoned tentacles. The Grell does not care about your world — it cares about the next meal, and you are very much in the right shape for it.' },
    { race: 'Flumph',             type: 'Aberration', flavor: 'Gentle, telepathic, and genuinely good — the Flumph is the aberration that chose a different path. They absorb psychic energy and feed on evil. In a dungeon, they have an unlimited buffet.' },

    // Construct
    { race: 'Stone Golem',        type: 'Construct', flavor: 'Massive animated stone, bound by rune and will. Stone Golems move slowly and strike with the finality of an avalanche. They do not tire. They do not stop. They do not forget their instructions.' },
    { race: 'Iron Golem',         type: 'Construct', flavor: 'The pinnacle of golem craft — nearly indestructible, poisonous in its breath, and absolutely committed to whatever task it was made for. Iron Golems do not negotiate.' },
    { race: 'Animated Armor',     type: 'Construct', flavor: 'Empty armor that walks, guards, and fights without a body inside it. Animated Armor is unsettling precisely because it is familiar — the shape of a warrior, but hollow all the way through.' },
    { race: 'Clay Golem',         type: 'Construct', flavor: 'Shaped from sacred clay and animated by divine will, Clay Golems are unpredictable — prone to berserk states that even their creators cannot fully control.' },
    { race: 'Flesh Golem',        type: 'Construct', flavor: 'Stitched from corpses and galvanized by lightning, the Flesh Golem is a monument to the refusal to accept death as final. It works. It does not enjoy working.' },
    { race: 'Clockwork Horror',   type: 'Construct', flavor: 'Precision-engineered killing machines from a plane of perfect mechanical law. Clockwork Horrors self-replicate using materials from their victims. Efficiency is their religion.' },

    // Draconic
    { race: 'Metallic Dragon', type: 'Draconic', flavor: 'Noble, ancient, and genuinely powerful in ways that go beyond breath weapons. Metallic Dragons choose their allegiances carefully and hold them forever — or until betrayed, which they also hold forever.' },
    { race: 'Lizardfolk',      type: 'Draconic', flavor: 'Ancient, cold-blooded, and deeply practical. Lizardfolk feel no sentimentality — only survival, resource, and utility. They make excellent dungeon inhabitants because a dungeon is, to them, simply optimal shelter.' },
    { race: 'Kobold',          type: 'Draconic', flavor: 'Dragon-worshipping, trap-building, tunnel-digging survivors. Kobolds are the architects of underground spite — individually weak, collectively dangerous, and absolutely convinced of their own eventual greatness.' },
    { race: 'Yuan-ti',         type: 'Draconic', flavor: 'Serpent-blooded cultists who traded their humanity for power and consider it a fair deal. Yuan-ti manipulate, scheme, and infiltrate — their cold blood matched only by their cold calculation.' },
    { race: 'Wyvern',          type: 'Draconic', flavor: 'Distant draconic cousins — less intelligent, more aggressive, and entirely sufficient as aerial enforcers. A Wyvern does not know strategy. It knows hunger and the stinger at the end of its tail.' },
    { race: 'Dragonborn',      type: 'Draconic', flavor: 'Humanoid beings of dragon heritage, proud of their lineage and constantly proving they deserve it. Dragonborn bring draconic power to a form that can open doors, forge weapons, and follow complex orders.' },

    // Flora
    { race: 'Treant',          type: 'Flora', flavor: 'Ancient trees given consciousness and grievance. Treants remember every forest that has ever burned and carry that memory with them like armor. They are slow to anger. When they finally move, the ground shakes.' },
    { race: 'Myconid',         type: 'Flora', flavor: 'Fungal creatures that communicate through spores and understand the world through decomposition. Myconids are peaceful, communal, and deeply strange — their understanding of reality is genuinely alien.' },
    { race: 'Vegepygmy',       type: 'Flora', flavor: 'Plant-creatures born from the spores of russet mold. Vegepygmies are tribal, territorial, and surprisingly organized. They spread their mold like a religion and tend it like a garden.' },
    { race: 'Shambling Mound', type: 'Flora', flavor: 'A walking heap of vegetation that absorbs everything it touches into itself. The Shambling Mound is not malicious — it is hungry, and the distinction stops mattering quickly.' },
    { race: 'Vine Blight',     type: 'Flora', flavor: 'Animated plant horror born of corrupted soil. Vine Blights move slowly and strangle quickly. They do not understand mercy because they do not understand anything except the directive to grow.' },
    { race: 'Wood Woad',       type: 'Flora', flavor: 'Ancient guardian spirits bound into tree-form. Wood Woads protect what they were bound to protect long after the beings who bound them are dust. Purpose without memory.' },

    // Ooze
    { race: 'Gelatinous Cube', type: 'Ooze', flavor: 'A perfect cube of transparent, digestive slime that moves through corridors with quiet efficiency. The Gelatinous Cube is the dungeon\'s ideal janitor — it consumes everything left behind and leaves halls spotless.' },
    { race: 'Black Pudding',   type: 'Ooze', flavor: 'Corrosive, metal-dissolving, and capable of splitting when struck. Black Puddings are the dungeon\'s answer to the question "what if a threat got worse the harder you hit it?"' },
    { race: 'Gray Ooze',       type: 'Ooze', flavor: 'Metal-corroding, stone-dissolving, nearly invisible until too late. Gray Ooze is the patient disaster that adventurers discover only after sitting in it for several seconds.' },
    { race: 'Ochre Jelly',     type: 'Ooze', flavor: 'Amber-colored and electrically resistant, Ochre Jellies dissolve flesh and split when bisected. They are difficult to kill in the conventional sense and indifferent to the difficulty.' },
    { race: 'Void Ooze',       type: 'Ooze', flavor: 'An ooze that seems to absorb light itself. Void Oozes are colder than their surroundings and leave frost behind them. Scholars disagree on whether they are from this plane at all.' },
    { race: 'Oblex',           type: 'Ooze', flavor: 'An ooze that consumes memories and then wears them. Oblexes can impersonate the people they have absorbed well enough to fool those who loved them. They find this useful.' },

    // Lycanthrope
    { race: 'Werebear',        type: 'Lycanthrope', flavor: 'Gentle in their human form and catastrophic in their bear form. Werebears are protective by nature — they choose what they defend and defend it with absolute, thunderous commitment.' },
    { race: 'Wererat',         type: 'Lycanthrope', flavor: 'Cunning, paranoid, and networked. Wererats build information empires in the underbelly of civilizations. In a dungeon, they are the eyes and ears — and the knives in the dark.' },
    { race: 'Wereboar',        type: 'Lycanthrope', flavor: 'Bad-tempered and nearly unstoppable in their fury. Wereboars do not back down. They charge, and they keep charging, and they get up if they fall, and they charge again.' },
    { race: 'Owlbear',         type: 'Lycanthrope', flavor: 'What a wizard made by asking the wrong question. Owlbears are ferocious, territorial, and completely uninterested in the philosophical implications of their existence.' },
    { race: 'Displacer Beast', type: 'Lycanthrope', flavor: 'A predator that appears to be somewhere it is not. Displacer Beasts hunt by making themselves impossible to hit, then hitting first. They find this arrangement entirely satisfactory.' },
    { race: 'Weretiger',       type: 'Lycanthrope', flavor: 'Patient, solitary, and absolute in their hunting. Weretigers do not rush. They watch, they follow, they wait for the perfect moment. The prey always provides one eventually.' },

    // Aquatic
    { race: 'Merfolk',    type: 'Aquatic', flavor: 'Half fish, all politics. Merfolk organize into elaborate courts and hierarchies beneath the waves — and bring all of that structure with them when they relocate to a dungeon that suits them.' },
    { race: 'Sahuagin',   type: 'Aquatic', flavor: 'Sea devils with an appetite for conflict. Sahuagin raid, pillage, and worship the shark. Their society is built on strength and their dungeon will be built the same way.' },
    { race: 'Kuo-toa',    type: 'Aquatic', flavor: 'Fish-folk driven partially mad by the deep dark, who worship gods they invented so fervently that the gods became real. The Kuo-toa\'s faith is a force of nature — literally.' },
    { race: 'Triton',     type: 'Aquatic', flavor: 'Ancient guardians of the deep who consider themselves the protectors of all underwater life. Tritons are noble, capable, and slightly insufferable about it.' },
    { race: 'Sea Hag',    type: 'Aquatic', flavor: 'Hideous and powerful, Sea Hags weaponize their own ugliness and the terror it produces. They form covens that amplify their magic to terrifying levels and never forgive a slight.' },
    { race: 'Locathah',   type: 'Aquatic', flavor: 'Fish-folk with a long memory for enslavement and a longer commitment to never experiencing it again. Locathah fight with a desperation born from generations of suffering. They do not lose well.' },

    // Monstrous
    { race: 'Harpy',    type: 'Monstrous', flavor: 'Winged predators who lure prey with an irresistible song and then tear it apart with clawed feet. Harpies do not understand why this surprises anyone.' },
    { race: 'Medusa',   type: 'Monstrous', flavor: 'A gaze that turns flesh to stone and a mind that has long since accepted what it is. Medusas are curators of their own statue gardens, and they are always adding to the collection.' },
    { race: 'Minotaur', type: 'Monstrous', flavor: 'Half-man, half-bull, all fury. Minotaurs are cursed beings who channel their rage into something almost purposeful. In the right labyrinth, there is nothing more terrifying.' },
    { race: 'Troll',    type: 'Monstrous', flavor: 'Trolls do not understand defeat. They regenerate from wounds that would kill anything else, shrug off pain, and come back from near-death with no lesson learned except hunger.' },
    { race: 'Naga',     type: 'Monstrous', flavor: 'Serpentine beings of ancient power who guard sacred sites and terrible secrets with equal dedication. Nagas are intelligent, magical, and deeply convinced of their own importance.' },
    { race: 'Basilisk', type: 'Monstrous', flavor: 'Eight-legged reptiles whose gaze petrifies and whose very reflection is a weapon. Basilisks are not clever. They do not need to be. Every garden has stone statues if you look carefully.' },
    { race: 'Chimera',  type: 'Monstrous', flavor: 'Three heads, three natures, one violent disposition. The Chimera is a creature of pure magical accident — lion, goat, dragon — and it is furious about all of it.' },
    { race: 'Manticore', type: 'Monstrous', flavor: 'Lion-body, human face, spike-launching tail, and a taste for human flesh that borders on culinary preference. Manticores are one of the few monsters that enjoys what it does.' },
    { race: 'Griffon',  type: 'Monstrous', flavor: 'Half eagle, half lion, all pride. Griffons are noble in the sense that a thunderstorm is noble — vast, powerful, and completely indifferent to the things it destroys.' },
    { race: 'Hydra',    type: 'Monstrous', flavor: 'Cut off one head and two grow back. The Hydra is the dungeon\'s argument that persistence is more valuable than strategy. It has never lost that argument.' },
    { race: 'Ettin',    type: 'Monstrous', flavor: 'Two heads that argue constantly and a body that ignores both of them to keep hitting things. Ettins are chaotic, loud, and durable. Two minds are not always better than one.' },
    { race: 'Worg',     type: 'Monstrous', flavor: 'Evil-aligned wolves of great cunning who speak and scheme and hold the goblinoid races in contempt while working alongside them. Worgs are always waiting for a better offer.' },

    // Beast
    { race: 'Dire Wolf',    type: 'Beast', flavor: 'The wolf taken to its logical extreme — larger, stronger, faster, and possessed of an intelligence that stops just short of language. Dire Wolves lead lesser wolves the way generals lead armies.' },
    { race: 'Cave Bear',    type: 'Beast', flavor: 'The apex of the underground wilderness. Cave Bears are territorial, enormously powerful, and utterly without interest in negotiation. They have not needed it once in their entire evolutionary history.' },
    { race: 'Giant Eagle',  type: 'Beast', flavor: 'Proud, ancient, and capable of genuine speech — though they rarely bother. Giant Eagles see everything from above and judge most of it unworthy. The few things they respect, they protect absolutely.' },
    { race: 'Sabre Cat',    type: 'Beast', flavor: 'A predator from the age before civilization, when the world was colder and meaner. Sabre Cats hunt the largest prey they can find as a matter of principle. The fangs are long for a reason.' },
    { race: 'Giant Ape',    type: 'Beast', flavor: 'Immense, intelligent, and deeply territorial. Giant Apes understand tool use, social hierarchy, and the concept of ownership. What they own, they defend. The list of what they own is growing.' },
    { race: 'Bulette',      type: 'Beast', flavor: 'The landshark — an armored predator that swims through earth the way a fish moves through water. Bulettes surface only to strike, and they always strike upward from below.' },

    // Undead
    { race: 'Skeleton',  type: 'Undead', flavor: 'Bones with purpose. Skeletons are the simplest undead — mindless, obedient, durable, and completely interchangeable. They are exactly what you need them to be: more.' },
    { race: 'Zombie',    type: 'Undead', flavor: 'Slow, relentless, and absolutely unconcerned about their own survival because that question was already settled. Zombies do not stop. They accumulate. They overwhelm.' },
    { race: 'Vampire',   type: 'Undead', flavor: 'Aristocratic predators who live forever and spend that forever accumulating power, influence, and grudges. Vampires are excellent at everything except accepting that the night will eventually end.' },
    { race: 'Wight',     type: 'Undead', flavor: 'The hatred of a warrior preserved past death. Wights remember what killed them and extend that hatred to everything living. They build armies from the creatures they destroy.' },
    { race: 'Ghoul',     type: 'Undead', flavor: 'The hungry dead given form. Ghouls feast on corpses and paralyze the living with their touch, ensuring a steady supply. They are efficient in the way that only hunger can make a creature.' },
    { race: 'Revenant',  type: 'Undead', flavor: 'A dead being returned by pure will to fulfill one purpose: vengeance. Revenants cannot be permanently destroyed until their target is dead. They are patient. They are thorough.' },
    { race: 'Banshee',   type: 'Undead', flavor: 'The echo of grief made lethal. A Banshee\'s wail can kill outright, and she does not stop wailing. She cannot stop. She has been wailing since the moment she understood what she lost.' },
    { race: 'Wraith',    type: 'Undead', flavor: 'A shadow of malice that drains life with a touch and spawns lesser wraiths from its victims. The Wraith grows its own army, one touch at a time, one stolen life after another.' },
    { race: 'Mummy',     type: 'Undead', flavor: 'Ancient priests and rulers preserved in death to guard what they valued in life. Mummies carry curses and the rotting authority of a civilization that no longer exists.' },
    { race: 'Demilich',  type: 'Undead', flavor: 'What a Lich becomes when it stops caring about the material world. A Demilich is a floating skull that can devour souls and devastate armies. It has simply chosen to wait.' },
    { race: 'Shadow',    type: 'Undead', flavor: 'A darkness that was once a living being. Shadows drain strength from those they touch and spawn more shadows from the slain. They are multiplying silence.' },

    // Elemental
    { race: 'Fire Elemental',  type: 'Elemental', flavor: 'Burning attention, burning purpose, burning everything it touches by accident and by design. Fire Elementals are not malicious — they simply express their nature completely and without apology.' },
    { race: 'Earth Elemental', type: 'Elemental', flavor: 'Patient as stone, strong as stone, durable as stone, and about as communicative as stone. Earth Elementals are not slow — they simply measure time differently.' },
    { race: 'Water Elemental', type: 'Elemental', flavor: 'Fluid, persistent, and capable of filling any space given enough time. Water Elementals do not fight around obstacles. They flow through them.' },
    { race: 'Air Elemental',   type: 'Elemental', flavor: 'Invisible until they choose otherwise and devastating when they do. Air Elementals move faster than thought and hit with the force of the storm that they literally are.' },
    { race: 'Magmin',          type: 'Elemental', flavor: 'Small elemental creatures of fire and obsidian who exist in a state of barely-contained combustion. Magmin are cheerful, destructive, and do not understand why everyone keeps asking them not to touch things.' },
    { race: 'Galeb Duhr',      type: 'Elemental', flavor: 'Boulder-like beings of earth who are nearly indistinguishable from rocks when still, which they often are. Galeb Duhr are ancient and slow to act — but when they roll, mountains feel it.' },

    // Specter
    { race: 'Ghost',       type: 'Specter', flavor: 'The unfinished dead, haunting the place of their greatest regret. Ghosts are powerful and unpredictable — their emotional state is their weapon, and it is always loaded.' },
    { race: 'Specter',     type: 'Specter', flavor: 'Pure malice stripped of everything human. The Specter does not remember what it was. It knows only cold, and the desire to share it.' },
    { race: 'Poltergeist', type: 'Specter', flavor: 'A ghost too angry to manifest fully, expressing its rage through hurled objects and shattered glass. The poltergeist cannot be reasoned with because it has stopped reasoning.' },
    { race: 'Shadow Demon', type: 'Specter', flavor: 'A demon that exists as pure shadow — incorporeal, light-sensitive, and hungry for the warmth it cannot feel. Shadow Demons are patient in the way that predators who cannot be hit tend to be.' },
    { race: 'Nighthaunt',  type: 'Specter', flavor: 'Spectral warriors bound to a cause that ended centuries ago. Nighthaunts ride the grief of their ancient allegiance like a weapon, manifesting dread and cold wherever they pass.' },
    { race: 'Allip',       type: 'Specter', flavor: 'The mad remnant of someone driven to self-destruction by forbidden knowledge. The Allip babbles constantly — incoherent fragments of the thing that broke it. The babbling is contagious.' },

    // Fiend
    { race: 'Imp',              type: 'Fiend', flavor: 'Small devils with large ambitions. Imps spy, manipulate, whisper, and scheme — they are the infernal plane\'s answer to the question "what if spite had wings and was invisible?"' },
    { race: 'Cambion',          type: 'Fiend', flavor: 'Born of devil and mortal, Cambions inherit the worst and best of both. Charismatic, cunning, infernally powered, and nursing a grudge against a world that never fully accepted them.' },
    { race: 'Barbed Devil',     type: 'Fiend', flavor: 'Warden-caste devils covered in spines that wound attackers and tools that wound prisoners. Barbed Devils are enforcers who enjoy their work in a professional capacity.' },
    { race: 'Night Hag',        type: 'Fiend', flavor: 'Ancient fiends who harvest the souls of the despairing. Night Hags traffick in nightmares and soul larvae with the businesslike efficiency of creatures who have been doing this since before civilization.' },
    { race: 'Succubus/Incubus', type: 'Fiend', flavor: 'Devils of desire who corrupt through temptation and addiction. Their power is not in strength but in the things people will do once they have decided they cannot live without something.' },
    { race: 'Pit Fiend',        type: 'Fiend', flavor: 'The generals of the Nine Hells. Pit Fiends are ancient, powerful, and politically maneuvering even while they are destroying you. Especially while they are destroying you.' },
    { race: 'Balor',            type: 'Fiend', flavor: 'A demon lord\'s general — a creature of pure destructive rage wrapped in flame and wielding a vorpal sword. The Balor does not conquer. It immolates.' },
    { race: 'Rakshasa',         type: 'Fiend', flavor: 'A fiend in silk clothing, wearing the face of civilized power. Rakshasas rule through subtlety — contract, manipulation, and the occasional very elegant murder.' },
    { race: 'Quasit',           type: 'Fiend', flavor: 'The chaotic counterpart to the Imp — a small demon of pure mischief and malice. Quasits serve warlocks poorly, serve chaos enthusiastically, and serve themselves above all.' },
    { race: 'Shadow Demon',     type: 'Fiend', flavor: 'A demon bound into incorporeal shadow-form, either by punishment or preference. It hungers for darkness and for the warmth of living things it can no longer possess.' },

    // Humanoid
    { race: 'Kenku',    type: 'Humanoid', flavor: 'Cursed bird-folk who lost their wings and their voices. Kenku communicate through mimicry — perfect reproduction of sounds they have heard — and scheme to reclaim what was taken from them.' },
    { race: 'Tabaxi',   type: 'Humanoid', flavor: 'Cat-folk driven by an insatiable curiosity that has taken them to the edges of the known world and slightly beyond. Tabaxi collect stories the way other creatures collect treasure.' },
    { race: 'Aarakocra', type: 'Humanoid', flavor: 'Bird-folk of the high peaks who prize freedom above everything else. Aarakocra in a dungeon are either very committed or very imprisoned. The distinction matters.' },
    { race: 'Tortle',   type: 'Humanoid', flavor: 'Shell-backed wanderers of peaceful disposition and immovable stubbornness. Tortles carry their home with them and find this sufficient. They are content in ways that make other creatures uncomfortable.' },
    { race: 'Centaur',  type: 'Humanoid', flavor: 'Half-horse, half-humanoid, all pride. Centaurs carry the dignity of the open plains with them and will explain at length why it belongs there. Then they will charge.' },
    { race: 'Human',    type: 'Humanoid', flavor: 'The most adaptable creature on the material plane. Humans build, bargain, fight, and reproduce with a relentlessness that has made them ubiquitous. Their weakness is their strength: they need everything, and so they become everything.' },
    { race: 'Elf',      type: 'Humanoid', flavor: 'Long-lived, elegant, and quietly convinced of their superiority — with enough history behind them to make the argument. Elves bring craftsmanship, memory, and a patience that outlasts most problems.' },
    { race: 'Dwarf',    type: 'Humanoid', flavor: 'Stubborn, skilled, and deeply committed to both craftsmanship and grudges. Dwarves build things that last and remember things that should be forgotten. Both qualities define them equally.' },
    { race: 'Half-Orc', type: 'Humanoid', flavor: 'Belonging fully to neither world, Half-Orcs forge their own. They carry orcish endurance and human adaptability — a combination that tends to end problems more efficiently than either alone.' },
    { race: 'Gnome',    type: 'Humanoid', flavor: 'Small, clever, and enthusiastic about things most beings find esoteric. Gnomes invent, tinker, and experiment with a joy that persists through every explosion. Especially through every explosion.' },

    // Planar
    { race: 'Githzerai',   type: 'Planar', flavor: 'Ascetics of Limbo who have trained themselves to impose order on chaos through sheer will. Githzerai are calm, precise, and capable of violence so controlled it looks like meditation.' },
    { race: 'Githyanki',   type: 'Planar', flavor: 'Astral conquerors with silver swords that sever the soul from the body. Githyanki do not live on the material plane — they raid it, and they are very good at raiding.' },
    { race: 'Modron',      type: 'Planar', flavor: 'Living mathematics from Mechanus, the plane of absolute law. Modrons process reality as a series of hierarchical instructions. They do not understand chaos. They find it offensive.' },
    { race: 'Slaad',       type: 'Planar', flavor: 'Living chaos from Limbo — frog-like, violent, and reproducing through horrific infestation of living hosts. Slaadi do not follow logic. They follow entropy, and entropy is patient.' },
    { race: 'Xorn',        type: 'Planar', flavor: 'Three-armed, three-legged, three-eyed beings from the elemental plane of earth who move through stone like water and hunger for precious metals. A dungeon is, to the Xorn, a buffet.' },
    { race: 'Inevitables', type: 'Planar', flavor: 'Constructs of absolute law dispatched to enforce the rules of the cosmos. Inevitables do not pursue — they simply continue moving toward their target until one of them stops existing.' },

    // Celestial
    { race: 'Planetar',   type: 'Celestial', flavor: 'A great angel of war and justice, bound now to a different cause. The Planetar does not forget what it was — it has simply decided that this dungeon is where the real work happens.' },
    { race: 'Deva',       type: 'Celestial', flavor: 'Celestial messengers who carry divine will across planes. A Deva serving a dungeon lord carries something else now — but the grace, the power, and the radiance remain.' },
    { race: 'Couatl',     type: 'Celestial', flavor: 'Feathered serpents of divine mandate who speak truth and protect the innocent. A Couatl in a dungeon has made peace with contradiction. They are very good at that.' },
    { race: 'Pegasus',    type: 'Celestial', flavor: 'A winged horse of pure celestial lineage. The Pegasus carries riders through the sky with a speed that makes everything else feel insufficient. It has opinions about who is worthy.' },
    { race: 'Unicorn',    type: 'Celestial', flavor: 'A guardian of sacred places whose horn heals and whose presence sanctifies. A Unicorn has chosen to sanctify a dungeon. That choice says something about the dungeon.' },
    { race: 'Hollyphant', type: 'Celestial', flavor: 'A tiny celestial elephant of improbable power. Hollyphants are gentle, ancient, and capable of releasing divine energy that makes much larger beings reconsider their choices.' },

    // Titan
    { race: 'Empyrean',     type: 'Titan', flavor: 'The divine offspring of gods — not worshipped, not lesser, but literally descended from divinity and carrying that inheritance in every action. Empyreans reshape battlefields by existing on them.' },
    { race: 'Behemoth',     type: 'Titan', flavor: 'The land-bound counterpart to the Leviathan — a creature of such mass and power that the earth reshapes itself around its passage. The Behemoth does not conquer territory. It simply exists on it, and the territory adjusts.' },
    { race: 'Astral Dreadnought', type: 'Titan', flavor: 'A predator native to the Astral Plane that has drifted through the void since before the gods named it. The Astral Dreadnought has consumed things the universe has since forgotten.' },
    { race: 'Leviathan',    type: 'Titan', flavor: 'The sea given agency and appetite. Leviathans are not fish — they are the ocean\'s verdict on those who forget what lives beneath it. Civilizations have been swallowed without the Leviathan noticing.' },
    { race: 'War Colossus',  type: 'Titan', flavor: 'An animated statue on a scale that makes fortresses look modest. War Colossi were built by civilizations that no longer exist to serve purposes no one fully remembers. They continue anyway.' },
    { race: 'Elder Titan',  type: 'Titan', flavor: 'A being from the age before the current cosmic order — older than the gods who replaced them, powerful enough that the new order chose imprisonment over confrontation. Something has opened the prison.' },

    // Cursed
    { race: 'Death Knight',   type: 'Cursed', flavor: 'A paladin who broke their sacred oath at the worst possible moment — and was denied the mercy of death as punishment. Death Knights serve whatever dark power claimed them with the same discipline they once gave to the light, and they hate every moment of it.' },
    { race: 'Petrified Medusa', type: 'Cursed', flavor: 'Once something else — now this. The curse that made a Medusa is older than the Medusa herself, and it is patient. It does not want to be cured. It wants to spread.' },
    { race: 'Werewolf',       type: 'Cursed', flavor: 'The oldest lycanthropic curse, and the one that spreads fastest. A Werewolf does not choose their nature — but in a dungeon, that nature becomes a resource rather than a affliction.' },
    { race: 'Serpent Abomination', type: 'Cursed', flavor: 'The furthest any serpent cult goes — more serpent than humanoid now, having sacrificed their humanity so completely that what remains is something the serpent gods actually want to talk to.' },
    { race: 'Cursed Knight',  type: 'Cursed', flavor: 'A warrior bound to an oath they broke, or a cause that destroyed them, or a weapon that wouldn\'t let them die. The Cursed Knight fights on because stopping is no longer available as an option.' },
    { race: 'Wereraven',      type: 'Cursed', flavor: 'Cursed watchers who carry the affliction lightly — or so they claim. Wereravens observe, remember, and report, flitting between human and bird with an ease that suggests the curse suits them perfectly.' },

    // Fey
    { race: 'Pixie',         type: 'Fey', flavor: 'Tiny, winged, and absolutely untrustworthy. Pixies find mortal suffering genuinely funny and mortal joy genuinely interesting — both of which make them unpredictable in a dungeon, and useful for that very reason.' },
    { race: 'Satyr',         type: 'Fey', flavor: 'Hedonists of the wild places who live in pursuit of sensation and drag others into that pursuit whether invited or not. Satyrs are charming, dangerous, and immune to the word "enough."' },
    { race: 'Dryad',         type: 'Fey', flavor: 'Bound to a tree and capable of genuine love for it. Dryads can charm mortals with a glance and vanish into bark with a thought. Bringing one to a dungeon requires bringing their tree. They insist.' },
    { race: 'Redcap',        type: 'Fey', flavor: 'A faerie that keeps its hat red through violence — specifically, through soaking it in the blood of the things it kills. Redcaps are not malicious by fey standards. They are simply maintenance-oriented.' },
    { race: 'Quickling',     type: 'Fey', flavor: 'A fey that traded its lifespan for speed and got a terrible deal in retrospect. Quicklings move faster than the eye can follow and die younger than they expected. They do not slow down for either reason.' },
    { race: 'Green Hag',     type: 'Fey', flavor: 'Ancient, cunning, and deeply invested in the misery of others as both craft and hobby. Green Hags form covens, broker terrible bargains, and take payment in pieces of the soul that the victim won\'t miss until later.' },

    // Sovereign
    { race: 'Wyrm',              type: 'Sovereign', flavor: 'Older than most kingdoms and larger than some, a Wyrm is what a dragon becomes when it has outlived every reason to be reasonable. They do not hoard gold. They hoard time.' },
    { race: 'Umbral Hunter',     type: 'Sovereign', flavor: 'A predator that has made shadow into a hunting ground. The Umbral Hunter does not stalk through darkness — it is the reason darkness feels like it is watching you.' },
    { race: 'Storm Roc',         type: 'Sovereign', flavor: 'A bird large enough that its wingspan generates its own weather. Storm Rocs do not migrate — they arrive, and the sky adjusts accordingly.' },
    { race: 'Ironback',          type: 'Sovereign', flavor: 'A creature so heavily armored by centuries of growth that it has become a landscape feature. Ironbacks move slowly and do not need to move quickly — nothing has survived making them feel rushed.' },
    { race: 'Rift Drake',        type: 'Sovereign', flavor: 'A drake that has fed on planar energy long enough that it no longer fully exists in one place. Rift Drakes phase in and out of the material world with the casual indifference of a creature that has stopped finding reality binding.' },
    { race: 'Ashborn',           type: 'Sovereign', flavor: 'Not a phoenix — something that has burned so many times it has stopped bothering to fully come back. The Ashborn exists in a permanent state of smoldering, and everything near it knows it.' },

    // Primordial
    { race: 'Elder Tempest',    type: 'Primordial', flavor: 'A storm that predates weather — a conscious atmospheric event from the era before the elemental planes were separated. The Elder Tempest does not rage. It simply is rage, expressed meteorologically.' },
    { race: 'Zaratan',          type: 'Primordial', flavor: 'An island-sized turtle of earth and stone from before the elemental planes had edges. The Zaratan has been sleeping for so long that forests have grown on its shell. It is beginning to notice.' },
    { race: 'Abyssal Tide',     type: 'Primordial', flavor: 'Not a sea creature — the water itself, given ancient hunger. The Abyssal Tide does not swim through water; it becomes it, surrounds you with it, and decides what happens next.' },
    { race: 'Elder Fire',       type: 'Primordial', flavor: 'Fire from before fire had rules — not an elemental but a primordial burning, hungry in ways that ordinary flame is not. Elder Fire consumes concepts as readily as it consumes wood.' },
    { race: 'Obyrith',          type: 'Primordial', flavor: 'Demons older than the Abyss itself — beings of pure chaos from before the planes were organized. Obyriths are so alien that merely seeing their true form damages the sanity of the observer. They do not care.' },
    { race: 'Void Shard',       type: 'Primordial', flavor: 'A fragment of the nothing that existed before existence — the cold that predates cold, the dark that predates dark. Void Shards do not act. They negate, persistently and without malice.' },
];

// ── Build L5 nodes and patch L4 children from RACE_LEAF_DEFS ─────────────────
(function buildRaceLeaves() {
    // Map type name → L4 node id
    const typeToL4 = {};
    for (const [id, node] of Object.entries(ERA1_TREE)) {
        if (node.layer === 4 && node.type) typeToL4[node.type] = id;
    }

    // Track per-type index to generate unique ids for placeholder races
    const typeCount = {};

    for (const def of RACE_LEAF_DEFS) {
        const l4Id = typeToL4[def.type];
        if (!l4Id) continue;

        typeCount[def.type] = (typeCount[def.type] || 0) + 1;
        const slug = def.race.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+$/, '');
        // Use type-scoped id for placeholders to avoid collisions
        const nodeId = def.race.startsWith('Placeholder')
            ? `race-${def.type.toLowerCase()}-ph${typeCount[def.type]}`
            : `race-${slug}`;

        ERA1_TREE[nodeId] = {
            id: nodeId,
            name: def.race,
            layer: 5,
            parent: l4Id,
            flavor: def.flavor,
            cost: { essence: 1000, influence: 500, mana: 500 },
            children: [],
            type: def.type,
            race: def.race,
        };

        ERA1_TREE[l4Id].children.push(nodeId);
    }
})();

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

// Get the L2 ancestor id for a node (used for per-drive coloring)
function era1GetDrive(nodeId) {
    let node = ERA1_TREE[nodeId];
    while (node && node.layer > 2) node = ERA1_TREE[node.parent];
    return (node && node.layer === 2) ? node.id : null;
}

// Per-drive colors (each L2 node gets its own accent)
const ERA1_DRIVE_COLORS = {
    dominance: '#7799cc',
    wisdom:    '#55aabb',
    growth:    '#4daa6a',
    hunt:      '#8daa33',
    undying:   '#6666cc',
    bargain:   '#bb55aa',
};

// Per-form colors (each L3 node gets its own accent)
const ERA1_FORM_COLORS = {
    horde:    '#5577dd',   // dominance — cool blue-violet
    colossus: '#99bbee',   // dominance — pale steel blue
    anomaly:  '#33ccbb',   // wisdom — teal
    forged:   '#77ccdd',   // wisdom — sky
    'root-node': '#33bb55',// growth — emerald
    changed:  '#88cc44',   // growth — lime
    pack:     '#bbcc22',   // hunt — yellow-green
    apex:     '#ddaa11',   // hunt — amber
    kept:     '#9955ee',   // undying — violet
    anchored: '#5544cc',   // undying — indigo
    pact:     '#ee44aa',   // bargain — pink
    covenant: '#cc2266',   // bargain — crimson
};

// Per-type colors (each L4 node gets its own accent)
const ERA1_TYPE_COLORS = {
    'type-goblinoid':  '#4466ee',
    'type-swarm':      '#6688ff',
    'type-giant':      '#88aaff',
    'type-titan':      '#aabbff',
    'type-aberration': '#22ddcc',
    'type-draconic':   '#44eebb',
    'type-construct':  '#66bbdd',
    'type-cursed':     '#99ddee',
    'type-flora':      '#22cc66',
    'type-ooze':       '#55dd44',
    'type-lycanthrope':'#99ee44',
    'type-fey':        '#bbff55',
    'type-aquatic':    '#ccdd00',
    'type-beast':      '#eebb11',
    'type-monstrous':  '#ffaa22',
    'type-legendary':  '#ff8800',
    'type-undead':     '#8833ff',
    'type-specter':    '#aa55ff',
    'type-elemental':  '#4433bb',
    'type-primordial': '#6644dd',
    'type-fiend':      '#ff3388',
    'type-humanoid':   '#ff66aa',
    'type-planar':     '#cc1155',
    'type-celestial':  '#ee4477',
};

// Get the L3 ancestor id for a node
function era1GetForm(nodeId) {
    let node = ERA1_TREE[nodeId];
    while (node && node.layer > 3) node = ERA1_TREE[node.parent];
    return (node && node.layer === 3) ? node.id : null;
}

// Get the L4 ancestor id for a node
function era1GetType(nodeId) {
    let node = ERA1_TREE[nodeId];
    while (node && node.layer > 4) node = ERA1_TREE[node.parent];
    return (node && node.layer === 4) ? node.id : null;
}

// Resolve the most-specific color for any node
function era1GetColor(nodeId, domainColors) {
    const typeId = era1GetType(nodeId);
    if (typeId && ERA1_TYPE_COLORS[typeId]) return ERA1_TYPE_COLORS[typeId];
    const formId = era1GetForm(nodeId);
    if (formId && ERA1_FORM_COLORS[formId]) return ERA1_FORM_COLORS[formId];
    const driveId = era1GetDrive(nodeId);
    if (driveId && ERA1_DRIVE_COLORS[driveId]) return ERA1_DRIVE_COLORS[driveId];
    const domainId = era1GetDomain(nodeId);
    if (domainId && domainColors && domainColors[domainId]) return domainColors[domainId];
    return '#666';
}
