// data/skillMethods.js

module.exports = {
    // Combat Skills
    attack: [
      { name: 'Rock crabs (kill)',         xp: 150,  xpPerHour: 30000,  itemId: null, itemsPerAction: 0 },
      { name: 'Sand crabs (kill)',         xp: 200,  xpPerHour: 40000,  itemId: null, itemsPerAction: 0 }
    ],
    strength: [
      { name: 'Nightmare Zone (absorb)',   xp: 500,  xpPerHour: 100000, itemId: 3016, itemsPerAction: 1 },
      { name: 'Rock crabs (kill)',         xp: 150,  xpPerHour: 30000,  itemId: null, itemsPerAction: 0 }
    ],
    defence: [
      { name: 'Sand crabs (kill)',         xp: 200,  xpPerHour: 40000,  itemId: null, itemsPerAction: 0 },
      { name: 'NMZ Power Mode',            xp: 600,  xpPerHour: 120000, itemId: 2452, itemsPerAction: 1 } // Prayer potion(4)
    ],
    ranged: [
      { name: 'Chinning (red chin)',        xp: 1400, xpPerHour: 350000, itemId: 10034, itemsPerAction: 1 }, // Red chinchompa
      { name: 'Cannon slayer',              xp: 1800, xpPerHour: 450000, itemId: 2,     itemsPerAction: 1 }  // Cannonball
    ],
    magic: [
      { name: 'High Alchemy',               xp: 65,   xpPerHour: 162000, itemId: 561,   itemsPerAction: 1 },  // Nature rune
      { name: 'Burst/Barrage (multi)',      xp: 100,  xpPerHour: 200000, itemId: 560,   itemsPerAction: 5 }   // Death rune x5
    ],
    prayer: [
      { name: 'Dragon bones on altar',      xp: 252,  xpPerHour: 600000, itemId: 536,   itemsPerAction: 1 },  // Dragon bones
      { name: 'Ensouled heads (Ecto tokens)', xp: 1000, xpPerHour: 300000, itemId: 771,  itemsPerAction: 1 } // Ecto token
    ],
  
    // Skilling / Support Skills
    cooking: [
      { name: 'Cooked Lobster',             xp: 120,  xpPerHour: 150000, itemId: 379,   itemsPerAction: 1 },
      { name: 'Cooked Shark',               xp: 210,  xpPerHour: 180000, itemId: 385,   itemsPerAction: 1 }
    ],
    woodcutting: [
      { name: 'Willow trees',               xp: 67.5, xpPerHour: 80000,  itemId: null, itemsPerAction: 0 },
      { name: 'Yew trees',                  xp: 175,  xpPerHour: 200000, itemId: null, itemsPerAction: 0 }
    ],
    fletching: [
      { name: 'Headless arrows',            xp: 1,    xpPerHour: 100000, itemId: 53,    itemsPerAction: 15 }, // 15 arrow shafts
      { name: 'Magic longbow (u)',          xp: 91,   xpPerHour: 250000, itemId: 12769,  itemsPerAction: 1 }
    ],
    fishing: [
      { name: 'Anglerfish',                 xp: 208,  xpPerHour: 180000, itemId: 13441,  itemsPerAction: 1 },
      { name: 'Dark crabs',                 xp: 150,  xpPerHour: 220000, itemId: 11934,  itemsPerAction: 1 }
    ],
    firemaking: [
      { name: 'Wintertodt crates',          xp: 280,  xpPerHour: 250000, itemId: 20710,  itemsPerAction: 1 },
      { name: 'Redwood logs',               xp: 625,  xpPerHour: 350000, itemId: null,  itemsPerAction: 0 }
    ],
    crafting: [
      { name: 'Battlestaves',               xp: 116.5,xpPerHour: 200000, itemId: 1391,   itemsPerAction: 1 },
      { name: 'Dragonstone jewellery',      xp: 100,  xpPerHour: 150000, itemId: 1718,   itemsPerAction: 1 }
    ],
    smithing: [
      { name: 'Blast Furnace Gold bars',    xp: 22,   xpPerHour: 100000, itemId: 2357,   itemsPerAction: 1 },
      { name: 'Rune items (anvil)',         xp: 72,   xpPerHour: 180000, itemId: 2364,   itemsPerAction: 1 }
    ],
    mining: [
      { name: 'Iron ore at Ardougne',       xp: 35,   xpPerHour: 100000, itemId: null,  itemsPerAction: 0 },
      { name: 'Runite ore',                 xp: 125,  xpPerHour: 80000,  itemId: null,  itemsPerAction: 0 }
    ],
    herblore: [
      { name: 'Prayer potions (4)',         xp: 252,  xpPerHour: 150000, itemId: 2436,   itemsPerAction: 1 },
      { name: 'Super combat potions (4)',   xp: 375,  xpPerHour: 180000, itemId: 12695,  itemsPerAction: 1 }
    ],
    agility: [
      { name: 'Ape Atoll course',           xp: 100,  xpPerHour: 120000, itemId: null,  itemsPerAction: 0 },
      { name: 'Seers\' course',             xp: 30,   xpPerHour: 60000,  itemId: null,  itemsPerAction: 0 }
    ],
    thieving: [
      { name: 'Pickpocketing Master Farmers', xp: 40,  xpPerHour: 150000, itemId: null, itemsPerAction: 0 },
      { name: 'Blackjack Sand Crabs',       xp: 60,   xpPerHour: 120000, itemId: null, itemsPerAction: 0 }
    ],
    slayer: [
      { name: 'Abyssal demons',             xp: 65,   xpPerHour: 120000, itemId: null, itemsPerAction: 0 },
      { name: 'Nechryaels',                 xp: 67,   xpPerHour: 130000, itemId: null, itemsPerAction: 0 }
    ],
    farming: [
      { name: 'Herb runs (grapes)',         xp: 21.5, xpPerHour: 80000,  itemId: null, itemsPerAction: 0 },
      { name: 'Tree runs (yews)',           xp: 250,  xpPerHour: 90000,  itemId: null, itemsPerAction: 0 }
    ],
    runecrafting: [
      { name: 'Blood runes',                xp: 44,   xpPerHour: 100000, itemId: null, itemsPerAction: 0 },
      { name: 'Nature runes (double)',      xp: 35,   xpPerHour: 90000,  itemId: null, itemsPerAction: 0 }
    ],
    hunter: [
      { name: 'Red chinchompas',            xp: 107,  xpPerHour: 150000, itemId: null, itemsPerAction: 0 },
      { name: 'Black salamanders',          xp: 42,   xpPerHour: 60000,  itemId: null, itemsPerAction: 0 }
    ],
    construction: [
      { name: 'Oak larders',                xp: 240,  xpPerHour: 200000, itemId: 6282,   itemsPerAction: 1 },
      { name: 'Mahogany tables',            xp: 300,  xpPerHour: 250000, itemId: 8780,   itemsPerAction: 1 }
        ]
    };
  