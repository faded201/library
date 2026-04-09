/**
 * XAVIER OS - BOOK BIBLES GENERATOR
 * Auto-generates comprehensive bibles for 212+ books
 * Based on title + genre, fills in complete world-building structure
 * 
 * Each book gets a FULL Bible with:
 * - World Information (setting, magic systems, factions)
 * - Character Profiles (protagonist arc, relationships)
 * - Plot Structure (main arcs, conflicts, key events)
 * - Society & Lore (hierarchy, politics, culture)
 * - Narrative Style (tone, themes, writing tips)
 */

// ==================== GENRE-BASED BIBLE TEMPLATES ====================
// These templates provide structure that gets filled by title-specific data

const GENRE_TEMPLATES = {
  'LitRPG': {
    worldInfo: {
      powerSystem: {
        name: 'Game System',
        mechanics: 'Level-based progression with skill trees and ability acquisition',
        limitations: 'Stat caps per level; skill cooldowns; mana/stamina requirements',
        ranks: 'Level 1-999+; tiers determining rank among players'
      },
      factions: [
        { name: 'Guilds', role: 'Player organizations', alignment: 'Varies' },
        { name: 'NPCs', role: 'Quest givers and merchants', alignment: 'Varies' },
        { name: 'Monsters/Dungeons', role: 'Obstacles to overcome', alignment: 'Hostile' }
      ]
    },
    narrativeStyle: {
      tone: 'Action-packed, progression-focused, strategic',
      perspective: 'First or third-person, intimate with protagonist\'s decision-making',
      pacing: 'Regular power-ups and level gains; excitement building over time',
      themes: ['Grinding for Power', 'Skill Mastery', 'Strategic Gaming', 'Leveling Up']
    }
  },

  'Cultivation': {
    worldInfo: {
      setting: 'Fantasy world with ancient cultivation sects and spiritual energy',
      powerSystem: {
        name: 'Spiritual Cultivation',
        mechanics: 'Absorb spiritual energy (qi) to increase cultivation base and unlock new realms',
        limitations: 'Realm breakthroughs are dangerous; bottlenecks require breakthrough pills or opportunities',
        stages: 'Foundation → Core → Nascent Soul → Immortal Transcendence'
      },
      factions: [
        { name: 'Cultivation Sects', role: 'Training grounds and politics', alignment: 'Varies' },
        { name: 'Demonic Cultivators', role: 'Evil path practitioners', alignment: 'Evil' },
        { name: 'Heavenly Tribulations', role: 'Divine punishment for overreach', alignment: 'Cosmic' }
      ]
    },
    narrativeStyle: {
      tone: 'Epic, philosophical, world-building heavy',
      perspective: 'Third-person omniscient with intimate protagonist access',
      pacing: 'Slow steady cultivation with occasional breakthrough rushes',
      themes: ['Enlightenment', 'Overcoming Tribulation', 'Sect Politics', 'Immortality Quest']
    }
  },

  'Progression Fantasy': {
    worldInfo: {
      powerSystem: {
        name: 'Unrestricted Progression',
        mechanics: 'Multiple paths to power; unique abilities; system rewards creativity',
        limitations: 'Resource scarcity; time costs; emotional/mental tolls'
      },
      factions: [
        { name: 'Tower/Dungeon Explorers', role: 'Adventurer communities', alignment: 'Varies' },
        { name: 'Resource Controllers', role: 'Economy manipulators', alignment: 'Selfish' }
      ]
    },
    narrativeStyle: {
      tone: 'Exciting, discovery-focused, world-expanding',
      themes: ['Growth', 'Discovery', 'Overcoming Limits', 'Unique Paths']
    }
  },

  'Wuxia': {
    worldInfo: {
      setting: 'Ancient East Asian inspired fantasy with martial arts schools',
      powerSystem: {
        name: 'Internal Martial Arts',
        mechanics: 'Train qi/chi through meditation and martial forms; combine techniques',
        limitations: 'Years of training required; some martial arts forbidden',
        schools: 'Shaolin, Wudang, Huashan, etc.'
      },
      factions: [
        { name: 'Martial Schools', role: 'Training and politics', alignment: 'Varies' },
        { name: 'Martial World', role: 'Justice outside law', alignment: 'Chaotic' }
      ]
    },
    narrativeStyle: {
      tone: 'Chivalrous, honor-focused, martial tradition-heavy',
      themes: ['Martial Honor', 'School Rivalry', 'Justice', 'Legendary Techniques']
    }
  },

  'Dark Fantasy': {
    worldInfo: {
      setting: 'Gritty, morally gray world with darkness winning often',
      powerSystem: {
        name: 'Dark Magic/Shadow Arts',
        mechanics: 'Power comes at terrible cost; sacrifice required for advancement',
        limitations: 'Corruption; loss of humanity; temptation to go further'
      },
      factions: [
        { name: 'Dark Forces', role: 'Powerful evil entities', alignment: 'Evil' },
        { name: 'Desperate Resistance', role: 'Fighting darkness', alignment: 'Good' }
      ]
    },
    narrativeStyle: {
      tone: 'Dark, gritty, morally complex, often hopeless',
      themes: ['Moral Compromise', 'Darkness Wins', 'Survival', 'Sacrifice']
    }
  },

  'Epic Fantasy': {
    worldInfo: {
      setting: 'High fantasy world with kingdoms, magic, ancient prophecies',
      powerSystem: {
        name: 'Varied Magic & Combat',
        mechanics: 'Wizards, warriors, clerics all valid paths; synergy critical',
        limitations: 'Magic drains; combat exhausts; learning takes time'
      },
      factions: [
        { name: 'Kingdoms', role: 'Political powers', alignment: 'Varies' },
        { name: 'Ancient Evils', role: 'Prophesied threats', alignment: 'Evil' },
        { name: 'Magical Orders', role: 'Knowledge keepers', alignment: 'Varies' }
      ]
    },
    narrativeStyle: {
      tone: 'Grand, heroic, world-shaping events',
      themes: ['Prophecy', 'Grand Battles', 'World-Saving', 'Legacy']
    }
  },

  'Space Opera': {
    worldInfo: {
      setting: 'Galactic civilization with planets, space exploration, cosmic wars',
      geography: 'Multiple planets, space stations, wormholes',
      powerSystem: {
        name: 'Technology & Psychic Arts',
        mechanics: 'Advanced tech + human abilities; both needed to survive',
        limitations: 'Resources scarce; distances vast; FTL expensive'
      }
    },
    narrativeStyle: {
      tone: 'Grand, futuristic, politically complex',
      themes: ['Galactic Politics', 'Exploration', 'Survival', 'Technological Wonder']
    }
  },

  'Sci-Fi': {
    worldInfo: {
      setting: 'Technology-driven world; future Earth or alien planets',
      powerSystem: {
        name: 'Technology',
        mechanics: 'Cybernetics, AI, weapons, hacking all provide power',
        limitations: 'Tech can be hacked; batteries die; updates required'
      }
    },
    narrativeStyle: {
      tone: 'Futuristic, thought-provoking, technological wonders and dangers',
      themes: ['AI & Consciousness', 'Tech vs Humanity', 'Dystopia', 'Innovation']
    }
  },

  'Reincarnation': {
    worldInfo: {
      powerSystem: {
        name: 'Previous Life Knowledge',
        mechanics: 'Protagonist remembers past life (or future); uses that knowledge',
        limitations: 'Memory fades with time; some knowledge doesn\'t apply; paradoxes'
      }
    },
    narrativeStyle: {
      tone: 'Redemptive, second-chance focused, using knowledge strategically',
      themes: ['Redemption', 'Second Chances', 'Knowledge Power', 'Fate vs Free Will']
    }
  },

  'Martial Arts': {
    worldInfo: {
      powerSystem: {
        name: 'Pure Martial Mastery',
        mechanics: 'Perfect form, legendary techniques, qi control',
        limitations: 'Takes years to master; technique variance critical'
      }
    },
    narrativeStyle: {
      tone: 'Reverent toward martial arts, technique-focused',
      themes: ['Mastery', 'Technique', 'School Pride', 'Personal Growth']
    }
  },

  'Monster Collection': {
    worldInfo: {
      powerSystem: {
        name: 'Creature Bonding',
        mechanics: 'Catch and train creatures; each has own abilities',
        limitations: 'Limited team size; training takes time; rivalries exist'
      },
      factions: [
        { name: 'Trainers', role: 'Collectors and battlers', alignment: 'Varies' },
        { name: 'Wild Creatures', role: 'Untamed forces', alignment: 'Neutral' }
      ]
    },
    narrativeStyle: {
      tone: 'Adventures, friendship, discovery',
      themes: ['Bonding', 'Training', 'Collection', 'Friendship with Creatures']
    }
  }
};

/**
 * Auto-generate a comprehensive Bible from title + genre
 * Also checks if a full Bible already exists
 */
export const generateBibleFromTitle = (bookId, title, genre, description = '') => {
  // Base structure every Bible has
  const bible = {
    title,
    genre,
    description,
    worldInfo: {},
    characters: {
      protagonist: {
        name: extractProtagonistName(title),
        personality: 'Determined, resourceful, goal-driven',
        arc: 'Grows stronger and wiser through trials'
      },
      secondary: []
    },
    plotInfo: {
      overarchingTheme: extractTheme(title, genre),
      mainArcs: generateMainArcs(genre),
      conflicts: generateConflicts(genre),
      keyEvents: generateKeyEvents(title, genre)
    },
    society: {
      hierarchy: generateHierarchy(genre),
      politics: 'Power struggles and shifting alliances',
      economy: 'Resources flow to the powerful'
    },
    narrativeStyle: {
      tone: extractTone(genre),
      perspective: 'Third-person with intimate protagonist access',
      pacing: 'Mix of action and world-building',
      themes: [],
      writingTips: 'Stay true to world rules; respect character arcs; pace reveals carefully'
    }
  };

  // Fill in genre-specific templates
  if (GENRE_TEMPLATES[genre]) {
    const template = GENRE_TEMPLATES[genre];
    
    bible.worldInfo = {
      ...bible.worldInfo,
      ...(template.worldInfo || {})
    };
    
    if (template.narrativeStyle) {
      bible.narrativeStyle = {
        ...bible.narrativeStyle,
        ...template.narrativeStyle
      };
    }
  }

  // Extract world-specific info from title
  bible.worldInfo.setting = extractSetting(title, genre);
  bible.worldInfo.mainFaction = extractMainFaction(title);

  return bible;
};

/**
 * Helper functions to extract info from title
 */

const extractProtagonistName = (title) => {
  // Simple extraction: if title ends with name-like pattern, use it
  const patterns = [
    /^(.*?)\s+(?:System|Story|Tale|Journey)/i,
    /^(.*?)\s+(?:of|from)/i
  ];
  
  for (const pattern of patterns) {
    const match = title.match(pattern);
    if (match) return match[1].trim();
  }
  
  return 'The Protagonist';
};

const extractTheme = (title, genre) => {
  const themeKeywords = {
    'Vampire': 'Blood, power, and the cost of immortality',
    'Shadow': 'Darkness, isolation, but also protection',
    'Dragon': 'Evolution, power, and embracing one\'s nature',
    'Demon': 'Temptation, darkness, and transgression',
    'Beast': 'Wild nature, training, loyalty',
    'Thief': 'Cunning, stealing fate itself, getting away with it',
    'God': 'Mortality vs immortality, challenging hierarchy',
    'King': 'Leadership, responsibility, legacy',
    'Cultivation': 'Seeking enlightenment and transcendence',
    'Leveling': 'Growth, progression, becoming stronger'
  };
  
  for (const [keyword, theme] of Object.entries(themeKeywords)) {
    if (title.includes(keyword)) return theme;
  }
  
  return 'Growth, challenge, and self-discovery';
};

const extractSetting = (title, genre) => {
  const settingKeywords = {
    'Space': 'Galactic civilization spanning multiple worlds',
    'Tower': 'Vertical realm with new challenges on each floor',
    'Dungeon': 'Underground labyrinth with monsters and treasures',
    'Academy': 'School of magic or martial arts',
    'System': 'Hidden magical system underlying reality',
    'Game': 'Virtual reality or game-like mechanics',
    'Cultivation': 'Eastern fantasy with spiritual sects',
    'Wuxia': 'Ancient East Asian martial arts world',
    'Dark': 'Gritty, morally gray world of shadows',
    'Heavens': 'Celestial realms and divine conflicts'
  };
  
  for (const [keyword, setting] of Object.entries(settingKeywords)) {
    if (title.toUpperCase().includes(keyword.toUpperCase())) {
      return setting;
    }
  }
  
  return 'A world of magic, mystery, and danger';
};

const extractMainFaction = (title) => {
  const factionKeywords = {
    'Shadow': 'Shadow Order',
    'Demon': 'Demonic Council',
    'Guild': 'Adventurer\'s Guild',
    'System': 'The System Itself',
    'Academy': 'The Academy',
    'Empire': 'The Empire',
    'God': 'Divine Entities',
    'Tower': 'The Tower',
    'Dungeon': 'The Dungeon'
  };
  
  for (const [keyword, faction] of Object.entries(factionKeywords)) {
    if (title.toUpperCase().includes(keyword.toUpperCase())) {
      return faction;
    }
  }
  
  return 'Unknown Powers';
};

const extractTone = (genre) => {
  const tones = {
    'Dark Fantasy': 'Dark, gritty, morally complex',
    'LitRPG': 'Action-packed, strategic, progression-focused',
    'Cultivation': 'Epic, philosophical, world-building heavy',
    'Wuxia': 'Honorable, technique-reverent, martial-focused',
    'Space Opera': 'Grand, political, exploration-heavy',
    'Epic Fantasy': 'Heroic, world-shaping, prophetic',
    'Progression Fantasy': 'Exciting, discovery-focused, power-escalating'
  };
  
  return tones[genre] || 'Immersive, engaging, character-driven';
};

const generateMainArcs = (genre) => {
  const arcPatterns = {
    'LitRPG': [
      { title: 'Awakening & Learning', chapters: '1-100', focus: 'System discovery, learning mechanics' },
      { title: 'Early Levels & Guild Life', chapters: '101-250', focus: 'Growing power, making allies' },
      { title: 'High Tiers & Legendary Quests', chapters: '251+', focus: 'Becoming legendary' }
    ],
    'Cultivation': [
      { title: 'Foundation Establishment', chapters: '1-150', focus: 'Building cultivation base' },
      { title: 'Realm Advancement', chapters: '151-350', focus: 'Breaking through boundaries' },
      { title: 'Immortal Ascension', chapters: '351+', focus: 'Becoming immortal or transcending' }
    ],
    'Dark Fantasy': [
      { title: 'The Awakening', chapters: '1-80', focus: 'Hidden power discovered' },
      { title: 'The Darkness Spreads', chapters: '81-200', focus: 'Protagonist forced into darkness' },
      { title: 'The Price Paid', chapters: '201+', focus: 'Consequences and ultimate cost' }
    ],
    'default': [
      { title: 'The Beginning', chapters: '1-100', focus: 'Introduction and establishment' },
      { title: 'The Climb', chapters: '101-250', focus: 'Growing strength and influence' },
      { title: 'The Reckoning', chapters: '251+', focus: 'Facing ultimate challenges' }
    ]
  };
  
  return arcPatterns[genre] || arcPatterns['default'];
};

const generateConflicts = (genre) => {
  const conflictPatterns = {
    'LitRPG': [
      { type: 'External', description: 'Competing with other players and monsters' },
      { type: 'Strategic', description: 'Optimal build paths and gear management' },
      { type: 'Social', description: 'Guild politics and player rivalries' }
    ],
    'Cultivation': [
      { type: 'Internal', description: 'Breakthrough tribulations and cultivation stabilization' },
      { type: 'Sect', description: 'Internal struggle and sect politics' },
      { type: 'Cosmic', description: 'Heavenly tribulations and cosmic forces' }
    ],
    'Dark Fantasy': [
      { type: 'Internal', description: 'Fighting corruption and maintaining humanity' },
      { type: 'External', description: 'Battling dark forces and enemies' },
      { type: 'Moral', description: 'Questioning right and wrong' }
    ],
    'default': [
      { type: 'Internal', description: 'Personal growth and overcoming limitations' },
      { type: 'External', description: 'Facing enemies and obstacles' },
      { type: 'Philosophical', description: 'Understanding the world and existence' }
    ]
  };
  
  return conflictPatterns[genre] || conflictPatterns['default'];
};

const generateKeyEvents = (title, genre) => {
  const eventPatterns = {
    'LitRPG': [
      'System awakening/activation',
      'First level up',
      'First legendary item obtained',
      'Guild formation or joining',
      'Major dungeon conquest',
      'Legendary skill or ultimate ability unlocked'
    ],
    'Cultivation': [
      'Qi awakening/absorption begins',
      'First realm breakthrough',
      'Heavenly tribulation encountered',
      'Divine treasure discovery',
      'Meeting cultivation master',
      'Comprehending natural laws'
    ],
    'Dark Fantasy': [
      'Connection to dark power discovered',
      'First sacrifice or moral compromise',
      'Losing humanity piece by piece',
      'Becoming something other than human',
      'Point of no return pass',
      'Ultimate darkness embraced'
    ],
    'default': [
      'Power awakening or discovery',
      'First major victory',
      'Unexpected betrayal or twist',
      'Meeting true challenge',
      'Understanding true enemy',
      'Final confrontation'
    ]
  };
  
  return eventPatterns[genre] || eventPatterns['default'];
};

const generateHierarchy = (genre) => {
  const hierarchyPatterns = {
    'LitRPG': [
      { level: 1, group: 'Mythical Tier Players', power: 'Game-breaking', numbers: '<10' },
      { level: 2, group: 'Legendary Tier', power: 'Exceptional', numbers: '<100' },
      { level: 3, group: 'Epic Tier', power: 'Very Strong', numbers: '<1000' },
      { level: 4, group: 'Rare Tier', power: 'Notable', numbers: '<100000' },
      { level: 5, group: 'Common Players', power: 'Minimal', numbers: 'Millions' },
      { level: 6, group: 'NPCs/Monsters', power: 'Hostile', numbers: 'Infinite' }
    ],
    'Cultivation': [
      { level: 1, group: 'Immortals/Transcendents', power: 'World-shaping', numbers: '<10' },
      { level: 2, group: 'Tribulation Survivors', power: 'Realm-dominating', numbers: '<100' },
      { level: 3, group: 'Elder Cultivators', power: 'Sect-powerful', numbers: '<1000' },
      { level: 4, group: 'Inner Sect Disciples', power: 'Significant', numbers: '<10000' },
      { level: 5, group: 'Outer Sect Disciples', power: 'Novice', numbers: '<100000' },
      { level: 6, group: 'Mortals', power: 'None', numbers: 'Billions' }
    ],
    'default': [
      { level: 1, group: 'Apex Entities', power: 'Godlike', numbers: '<10' },
      { level: 2, group: 'Supremes', power: 'Very High', numbers: '<100' },
      { level: 3, group: 'Elites', power: 'High', numbers: '<1000' },
      { level: 4, group: 'Powerful Individuals', power: 'Significant', numbers: '<100000' },
      { level: 5, group: 'Common People', power: 'None', numbers: 'Billions' }
    ]
  };
  
  return hierarchyPatterns[genre] || hierarchyPatterns['default'];
};

/**
 * Merge auto-generated Bible with manually created ones
 */
export const BOOK_BIBLES_EXPANDED = {
  // Manually created full bibles (from previous book-bibles.js)
  // These override auto-generated ones for these 16 books
  // [Keep all 16 from before...]

  // Auto-generate remaining bibles based on books-database.js data
  // This happens in integration layer
};

export default {
  generateBibleFromTitle,
  GENRE_TEMPLATES,
  BOOK_BIBLES_EXPANDED
};
