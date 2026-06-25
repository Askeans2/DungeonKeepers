// data/randomEvents.js
//
// Large random event catalog for Log entries.
// Keep events declarative: game.js owns picking, filtering, and applying effects.

const RANDOM_EVENTS = {
    era1: [
        {
            id: "era1_first_echo",
            text: "The first echo returns from a corridor that was not there a moment ago.",
            weight: 10,
            cooldownDays: 12,
            effects: [
                { type: "resource", resource: "essence", amount: 1 }
            ]
        },
        {
            id: "era1_settling_stone",
            text: "Loose stone settles into something almost like intention.",
            weight: 8,
            cooldownDays: 12,
            effects: [
                { type: "resource", resource: "stone", amount: 2 }
            ]
        },
        {
            id: "era1_distant_attention",
            text: "Something far below notices your shape pressing into the world.",
            weight: 6,
            cooldownDays: 20,
            effects: [
                { type: "resource", resource: "influence", amount: 1 }
            ]
        },
        {
            id: "era1_crystallized_thought",
            text: "A thought hardens overnight into something almost solid. You are not sure if that is a good sign.",
            weight: 8,
            cooldownDays: 15,
            effects: [
                { type: "resource", resource: "essence", amount: 2 }
            ]
        },
        {
            id: "era1_hollow_resonance",
            text: "The dark hums at a frequency you have no word for. For a moment, the walls feel thin.",
            weight: 7,
            cooldownDays: 18,
            effects: [
                { type: "resource", resource: "essence", amount: 1 },
                { type: "resource", resource: "influence", amount: 1 }
            ]
        },
        {
            id: "era1_deep_current",
            text: "A current of something old moves through the stone beneath you. You let it pass without interference.",
            weight: 6,
            cooldownDays: 22,
            effects: [
                { type: "resource", resource: "mana", amount: 1 }
            ]
        }
    ],

    era2General: [
        {
            id: "general_lost_peddler",
            text: "A lost peddler mistakes the dungeon entrance for a toll road and pays before realizing the error.",
            weight: 8,
            cooldownDays: 25,
            effects: [
                { type: "resource", resource: "coins", amount: 12 }
            ]
        },
        {
            id: "general_misplaced_crate",
            text: "A misplaced crate is discovered behind the storage racks. No one admits owning it.",
            weight: 10,
            cooldownDays: 20,
            effects: [
                { type: "resource", resource: "wood", amount: 4 },
                { type: "resource", resource: "stone", amount: 2 }
            ]
        },
        {
            id: "general_bad_map",
            text: "An adventurer's map labels your dungeon as 'probably abandoned.' Morale improves for the wrong reasons.",
            weight: 7,
            cooldownDays: 25,
            effects: [
                { type: "resource", resource: "influence", amount: 1 }
            ]
        },
        {
            id: "general_structural_gift",
            text: "A section of tunnel collapses in a way that is, by any measure, an improvement. No one is credited.",
            weight: 9,
            cooldownDays: 20,
            effects: [
                { type: "resource", resource: "stone", amount: 5 }
            ]
        },
        {
            id: "general_traveling_herbalist",
            text: "A wandering herbalist trades a bundle of dried leaves for directions out. The directions are wrong. The leaves are excellent.",
            weight: 8,
            cooldownDays: 22,
            effects: [
                { type: "resource", resource: "herbs", amount: 4 }
            ]
        },
        {
            id: "general_forgotten_stash",
            text: "Behind a false wall, a pouch of coins — old minting, unfamiliar face on the front. Spendable regardless.",
            weight: 7,
            cooldownDays: 28,
            effects: [
                { type: "resource", resource: "coins", amount: 18 }
            ]
        }
    ],

    era2ByType: {
        Goblinoid: [
            {
                id: "goblinoid_spear_accounting",
                text: "A quartermaster discovers that spear inventory has been tracked through intimidation rather than arithmetic.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "wood", amount: -3 },
                    { type: "resource", resource: "influence", amount: 1 }
                ]
            },
            {
                id: "goblinoid_tunnel_shortcut",
                text: "Someone dug a shortcut that nobody approved and everybody immediately started using.",
                weight: 9,
                cooldownDays: 18,
                effects: [
                    { type: "resource", resource: "stone", amount: 3 }
                ]
            },
            {
                id: "goblinoid_borrowed_tools",
                text: "A set of tools goes missing and reappears sharpened, oiled, and slightly shorter than before.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "ore", amount: 2 }
                ]
            },
            {
                id: "goblinoid_negotiated_tribute",
                text: "A minor dispute over corridor rights is resolved through an exchange of small shiny objects. Everyone walks away satisfied.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "coins", amount: 8 }
                ]
            }
        ],
        Giant: [
            {
                id: "giant_doorframe_revision",
                text: "A doorframe is widened after a giant describes it as 'optimistic.'",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "stone", amount: -4 }
                ]
            },
            {
                id: "giant_accidental_excavation",
                text: "A giant sits down to rest and inadvertently opens a new chamber. The miners are quietly grateful.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "stone", amount: 6 },
                    { type: "resource", resource: "ore", amount: 2 }
                ]
            },
            {
                id: "giant_thrown_log",
                text: "A disagreement is settled by throwing a log. The log lands in the lumber yard, which is considered a fair outcome.",
                weight: 8,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "wood", amount: 5 }
                ]
            },
            {
                id: "giant_footprint_reservoir",
                text: "A footprint fills with rainwater and becomes, without ceremony, a functional reservoir.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "food", amount: 3 }
                ]
            }
        ],
        Swarm: [
            {
                id: "swarm_extra_movement",
                text: "The floor moves for several minutes. This is considered normal, but only by the floor.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "food", amount: -2 }
                ]
            },
            {
                id: "swarm_found_cache",
                text: "The swarm returns from an unexplored passage carrying fragments of ore. No one asked them to. They do not explain.",
                weight: 9,
                cooldownDays: 18,
                effects: [
                    { type: "resource", resource: "ore", amount: 3 }
                ]
            },
            {
                id: "swarm_cleared_tunnel",
                text: "A blocked tunnel is cleared overnight by a process best described as enthusiasm. The rubble is gone. So is one boot.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "stone", amount: 4 }
                ]
            },
            {
                id: "swarm_consumed_obstacle",
                text: "A structural problem is solved by the swarm consuming it. Whether this counts as engineering is debated.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "food", amount: -3 },
                    { type: "resource", resource: "influence", amount: 2 }
                ]
            }
        ],
        Aberration: [
            {
                id: "aberration_shared_dream",
                text: "Everyone dreams the same dream. Nobody agrees on how many corners the moon had.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "mana", amount: 1 }
                ]
            },
            {
                id: "aberration_geometry_event",
                text: "One room has more walls than it did yesterday. The contents are undisturbed. The walls are not acknowledged.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "arcaneDust", amount: 2 }
                ]
            },
            {
                id: "aberration_borrowed_memory",
                text: "Someone recalls building a room they have no memory of planning. It is structurally sound.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "lore", amount: 1 }
                ]
            },
            {
                id: "aberration_void_seepage",
                text: "Something seeps through a gap in the dark that has no physical location. It pools briefly, then is useful.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "mana", amount: 2 },
                    { type: "resource", resource: "influence", amount: -1 }
                ]
            }
        ],
        Construct: [
            {
                id: "construct_spare_pin",
                text: "A spare brass pin is found exactly where a spare brass pin would be useful.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "ore", amount: 2 }
                ]
            },
            {
                id: "construct_self_repair",
                text: "A construct repairs itself overnight using materials no one remembers leaving out. The materials are returned, bent.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "ore", amount: -2 },
                    { type: "resource", resource: "influence", amount: 2 }
                ]
            },
            {
                id: "construct_assembly_surplus",
                text: "After a complex assembly task, a small pile of leftover components remains. All parts were accounted for. The pile disagrees.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "iron", amount: 2 }
                ]
            },
            {
                id: "construct_calibration_run",
                text: "A construct runs a calibration sequence unprompted and pronounces the dungeon seventeen percent more optimal. No one is sure what changed.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "coins", amount: 10 }
                ]
            }
        ],
        Draconic: [
            {
                id: "draconic_hoard_sorting",
                text: "The hoard is sorted by shine, then value, then how loudly anyone objected.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "coins", amount: 8 }
                ]
            },
            {
                id: "draconic_tribute_demand",
                text: "A formal demand for tribute is issued to a nearby settlement. They pay, mostly out of confusion.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "coins", amount: 15 },
                    { type: "resource", resource: "influence", amount: -1 }
                ]
            },
            {
                id: "draconic_flame_incident",
                text: "An area is accidentally scorched clean. The ash is rich and the space is now, undeniably, ventilated.",
                weight: 8,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "coal", amount: 4 }
                ]
            },
            {
                id: "draconic_scales_shed",
                text: "Shed scales are collected from the corridor floors. They have uses that require no explanation.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "leather", amount: 3 }
                ]
            }
        ],
        Flora: [
            {
                id: "flora_root_advice",
                text: "The roots rearrange a tunnel support overnight. The engineers pretend it was their idea.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "wood", amount: 3 }
                ]
            },
            {
                id: "flora_spore_bloom",
                text: "An unexpected bloom releases spores that smell like moss and old agreements. Several workers feel briefly wise.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "herbs", amount: 5 }
                ]
            },
            {
                id: "flora_seed_cache",
                text: "A buried seed cache is unearthed during construction. Someone plants them immediately. No one argues.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "food", amount: 4 }
                ]
            },
            {
                id: "flora_overgrowth_yield",
                text: "A corridor reclaimed by overgrowth is cleared. The wood harvested from it is dense and still growing, faintly.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "wood", amount: 5 },
                    { type: "resource", resource: "herbs", amount: 2 }
                ]
            }
        ],
        Ooze: [
            {
                id: "ooze_clean_corridor",
                text: "A corridor is found spotless, polished, and missing one unattended boot.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "coins", amount: 4 }
                ]
            },
            {
                id: "ooze_dissolved_blockage",
                text: "A stone blockage is dissolved overnight. The tunnel it reveals is older than the dungeon. No one goes in first.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "stone", amount: 5 }
                ]
            },
            {
                id: "ooze_mineral_residue",
                text: "A path of residue is traced back to a mineral seam the ooze passed through. Useful, if nauseating.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "ore", amount: 3 },
                    { type: "resource", resource: "crystals", amount: 1 }
                ]
            },
            {
                id: "ooze_absorbed_waste",
                text: "Several rooms are cleaned simultaneously with no coordination and no explanation. Efficiency improves. Morale is complicated.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "influence", amount: 1 }
                ]
            }
        ],
        Lycanthrope: [
            {
                id: "lycanthrope_moon_argument",
                text: "A serious argument breaks out over whether the moon is technically trespassing.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "influence", amount: 1 }
                ]
            },
            {
                id: "lycanthrope_hunt_surplus",
                text: "The hunters return before dawn with significantly more than requested. No one asks how. The food stores are full.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "food", amount: 6 }
                ]
            },
            {
                id: "lycanthrope_territorial_marking",
                text: "Several corridors are marked in ways that neighboring factions find deeply persuasive. Influence flows inward.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "influence", amount: 2 }
                ]
            },
            {
                id: "lycanthrope_shed_pelt",
                text: "A pile of shed pelts is collected after the last full moon. The leather is warm, dense, and slightly alarming.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "leather", amount: 4 }
                ]
            }
        ],
        Aquatic: [
            {
                id: "aquatic_damp_ledger",
                text: "The ledgers are damp again, but the tax totals are somehow more accurate underwater.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "coins", amount: 6 }
                ]
            },
            {
                id: "aquatic_tidal_deposit",
                text: "An underground tidal surge deposits a layer of silt that turns out to be rich in minerals. The flood damage is minor.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "clay", amount: 5 }
                ]
            },
            {
                id: "aquatic_deep_haul",
                text: "A deep-current fishing run returns with more than fish. Several items recovered are of debatable origin and clear value.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "food", amount: 4 },
                    { type: "resource", resource: "coins", amount: 6 }
                ]
            },
            {
                id: "aquatic_pressure_crack",
                text: "Water pressure cracks a wall open. The crack is immediately damned, then carefully mined. The ore is excellent.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "ore", amount: 4 }
                ]
            }
        ],
        Monstrous: [
            {
                id: "monstrous_trophy_wall",
                text: "A trophy wall gains three new trophies and one very nervous blank space.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "bones", amount: 3 }
                ]
            },
            {
                id: "monstrous_intimidation_dividend",
                text: "Word of an incident in the lower corridors reaches a local merchant. He sends a goodwill payment before anyone asks.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "coins", amount: 12 },
                    { type: "resource", resource: "influence", amount: 1 }
                ]
            },
            {
                id: "monstrous_carcass_yield",
                text: "A large carcass is processed with unusual efficiency. Everything is used. Nothing is wasted. No one asks what it was.",
                weight: 8,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "food", amount: 5 },
                    { type: "resource", resource: "bones", amount: 4 }
                ]
            },
            {
                id: "monstrous_territorial_expansion",
                text: "The dungeon's effective reach grows after something large makes its displeasure known in the surrounding region.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "influence", amount: 3 }
                ]
            }
        ],
        Beast: [
            {
                id: "beast_den_instinct",
                text: "Several dens are improved through methods best described as claw-based architecture.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "wood", amount: -2 },
                    { type: "resource", resource: "food", amount: 2 }
                ]
            },
            {
                id: "beast_pack_hunt",
                text: "A coordinated hunt returns more than expected. The pack is pleased. The stores are full. Something large was involved.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "food", amount: 7 }
                ]
            },
            {
                id: "beast_marked_territory",
                text: "The beasts have marked a wider perimeter than assigned. The area beyond is, by informal agreement, now yours.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "influence", amount: 2 }
                ]
            },
            {
                id: "beast_shed_materials",
                text: "Antlers, hide scraps, and other shed materials are gathered from the dens. No one had to ask twice.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "leather", amount: 3 },
                    { type: "resource", resource: "bones", amount: 2 }
                ]
            }
        ],
        Undead: [
            {
                id: "undead_bone_count",
                text: "The bone piles are recounted. The result is higher than yesterday, despite no one adding bones.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "bones", amount: 4 }
                ]
            },
            {
                id: "undead_risen_labor",
                text: "Several workers who were not working yesterday are working today. The task completed itself. No further details are recorded.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "stone", amount: 4 },
                    { type: "resource", resource: "wood", amount: 3 }
                ]
            },
            {
                id: "undead_tomb_tithe",
                text: "An old tomb annexed into the lower corridors yields a tithe of grave goods. They are exchanged quietly.",
                weight: 8,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "coins", amount: 14 }
                ]
            },
            {
                id: "undead_echoed_knowledge",
                text: "A spirit recounts a process from memory that no living worker knows. The transcript is filed and immediately applied.",
                weight: 7,
                cooldownDays: 28,
                effects: [
                    { type: "resource", resource: "lore", amount: 2 }
                ]
            }
        ],
        Elemental: [
            {
                id: "elemental_pressure_shift",
                text: "The air pressure changes color for a moment. The miners call it productive weather.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "stone", amount: 3 }
                ]
            },
            {
                id: "elemental_sparked_vein",
                text: "A lightning elemental passes through an ore vein and leaves it partially smelted. The miners are annoyed and grateful.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "iron", amount: 3 }
                ]
            },
            {
                id: "elemental_wind_sorting",
                text: "A wind elemental moves through the storage area. Everything is rearranged. Somehow, it is more organized.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "influence", amount: 1 },
                    { type: "resource", resource: "coins", amount: 5 }
                ]
            },
            {
                id: "elemental_crystallized_flame",
                text: "A fragment of crystallized flame is found cooling in the forge room. It is worth more than it should be.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "crystals", amount: 2 },
                    { type: "resource", resource: "coal", amount: 3 }
                ]
            }
        ],
        Specter: [
            {
                id: "specter_unfinished_sentence",
                text: "A ghost finishes a sentence that nobody remembers starting.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "mana", amount: 1 }
                ]
            },
            {
                id: "specter_haunted_productivity",
                text: "A room believed to be haunted is avoided by everyone except the most productive workers, who report no interruptions.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "influence", amount: 2 }
                ]
            },
            {
                id: "specter_recovered_memory",
                text: "A location is found that no living worker placed, containing materials no one ordered. The records show it was always there.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "lore", amount: 1 },
                    { type: "resource", resource: "arcaneDust", amount: 2 }
                ]
            },
            {
                id: "specter_cold_draft",
                text: "A cold draft passes through a sealed corridor and extinguishes four torches. The room beyond the draft is inexplicably warm.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "mana", amount: 2 }
                ]
            }
        ],
        Fiend: [
            {
                id: "fiend_contract_margin",
                text: "A contract's margin note is found to be legally binding in three jurisdictions and one nightmare.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "coins", amount: 10 }
                ]
            },
            {
                id: "fiend_soul_leverage",
                text: "A past favor is called in through channels that do not technically exist. The payment arrives before the request does.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "coins", amount: 18 },
                    { type: "resource", resource: "influence", amount: -1 }
                ]
            },
            {
                id: "fiend_temptation_tribute",
                text: "A local official is tempted into a small indiscretion and quietly persuaded to make a donation by way of apology.",
                weight: 8,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "coins", amount: 12 },
                    { type: "resource", resource: "influence", amount: 1 }
                ]
            },
            {
                id: "fiend_infernal_paperwork",
                text: "A bureaucratic error in the infernal registry results in a small surplus being routed here by mistake. It is kept.",
                weight: 7,
                cooldownDays: 28,
                effects: [
                    { type: "resource", resource: "sulphur", amount: 3 },
                    { type: "resource", resource: "coins", amount: 8 }
                ]
            }
        ],
        Humanoid: [
            {
                id: "humanoid_committee",
                text: "A committee forms, argues, dissolves, and accidentally leaves behind a useful checklist.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "lore", amount: 1 }
                ]
            },
            {
                id: "humanoid_traveling_merchant",
                text: "A merchant arrives unbidden, sells exactly what was needed, and leaves before anyone thought to ask where they came from.",
                weight: 9,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "coins", amount: -8 },
                    { type: "resource", resource: "herbs", amount: 4 },
                    { type: "resource", resource: "cloth", amount: 2 }
                ]
            },
            {
                id: "humanoid_scribe_discovery",
                text: "A scribe finds an error in an old document that, when corrected, reveals a process twice as efficient as the current one.",
                weight: 8,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "lore", amount: 2 }
                ]
            },
            {
                id: "humanoid_tax_oversight",
                text: "An overlooked tax exemption is discovered and applied retroactively. The treasury is quietly pleased.",
                weight: 7,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "coins", amount: 16 }
                ]
            }
        ],
        Planar: [
            {
                id: "planar_wrong_gravity",
                text: "Gravity points sideways in one room for exactly long enough to organize the shelves.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "arcaneDust", amount: 1 }
                ]
            },
            {
                id: "planar_rift_residue",
                text: "A small rift opens and closes between one heartbeat and the next. It leaves behind a scattering of material from somewhere else.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "arcaneDust", amount: 2 },
                    { type: "resource", resource: "crystals", amount: 1 }
                ]
            },
            {
                id: "planar_phase_worker",
                text: "A worker phases partially out of reality during their shift. They complete twice the work before phasing back, confused but unharmed.",
                weight: 8,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "stone", amount: 4 },
                    { type: "resource", resource: "ore", amount: 2 }
                ]
            },
            {
                id: "planar_echo_delivery",
                text: "Supplies ordered several days ago arrive simultaneously from three different directions. All quantities are correct. None were sent twice.",
                weight: 7,
                cooldownDays: 28,
                effects: [
                    { type: "resource", resource: "wood", amount: 4 },
                    { type: "resource", resource: "cloth", amount: 2 }
                ]
            }
        ],
        Celestial: [
            {
                id: "celestial_radiant_audit",
                text: "A radiant audit finds the dungeon ethically troubling but surprisingly well labeled.",
                weight: 10,
                cooldownDays: 20,
                effects: [
                    { type: "resource", resource: "influence", amount: 1 }
                ]
            },
            {
                id: "celestial_fallen_light",
                text: "A shaft of light descends into a corridor where there is no opening for one. Workers move through it cautiously. It feels like approval.",
                weight: 9,
                cooldownDays: 22,
                effects: [
                    { type: "resource", resource: "influence", amount: 2 },
                    { type: "resource", resource: "mana", amount: 1 }
                ]
            },
            {
                id: "celestial_blessed_vein",
                text: "A mineral vein is found glowing faintly. The ore extracted from it is pure in a way that does not make geological sense.",
                weight: 8,
                cooldownDays: 25,
                effects: [
                    { type: "resource", resource: "ore", amount: 5 }
                ]
            },
            {
                id: "celestial_divine_oversight",
                text: "Something of vast patience observes the dungeon for three days and finds it, against all expectation, acceptable.",
                weight: 7,
                cooldownDays: 30,
                effects: [
                    { type: "resource", resource: "influence", amount: 3 }
                ]
            }
        ]
    }
};
