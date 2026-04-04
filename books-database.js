// AETHERIA.AI - Exactly 212 Books with Title-Matching Covers
const booksDatabase = [
  // === LITRPG & SYSTEM NOVELS (20) ===
  {
    id: "my-vampire-system",
    title: "My Vampire System",
    genre: "LitRPG",
    cover: "Epic%20cool%20vampire%20lord%20with%20glowing%20red%20eyes%20and%20sharp%20fangs%20wearing%20black%20leather%20coat%20standing%20in%20gothic%20castle%20blood%20moon%20background%20swirling%20shadows%20fantasy%20art%20style",
    description: "A world where leveling up costs blood. Every drop counts."
  },
  {
    id: "shadow-monarch",
    title: "Shadow Monarch",
    genre: "Dark Fantasy",
    cover: "Shadow%20king%20with%20crown%20of%20darkness%20surrounded%20by%20swirling%20black%20shadows%20epic%20fantasy%20art%20style%20gothic%20atmosphere",
    description: "Arise. The shadows belong to him now."
  },
  {
    id: "my-dragonic-system",
    title: "My Dragonic System",
    genre: "Draconic Evolution",
    cover: "Warrior%20with%20dragon%20scales%20erupting%20from%20arms%20glowing%20blue%20energy%20dragon%20transformation%20fantasy%20art%20style%20epic",
    description: "Scales erupt, power awakens. The dragon within demands release."
  },
  {
    id: "birth-demonic-sword",
    title: "Birth of a Demonic Sword",
    genre: "Weapon Evolution",
    cover: "Warrior%20wielding%20giant%20demon%20sword%20glowing%20red%20runes%20dark%20armor%20hellfire%20background%20epic%20fantasy%20art%20style",
    description: "A blade forged from dying stars, it consumes souls to grow stronger."
  },
  {
    id: "legendary-beast-tamer",
    title: "Legendary Beast Tamer",
    genre: "Monster Collection",
    cover: "Beast%20tamer%20surrounded%20by%20mythical%20creatures%20dragon%20phoenix%20griffin%20fantasy%20art%20style%20magical%20bond",
    description: "Ancient beasts bow before him. The age of the Beast King has come."
  },
  {
    id: "heavenly-thief",
    title: "Heavenly Thief",
    genre: "Celestial Heist",
    cover: "Thief%20stealing%20starlight%20from%20heavens%20celestial%20glowing%20stars%20cosmic%20fantasy%20art%20style%20divine",
    description: "Stealing the light of the stars from the gods themselves."
  },
  {
    id: "nano-machine",
    title: "Nano Machine",
    genre: "Techno Cultivation",
    cover: "Warrior%20with%20nano%20machines%20flowing%20through%20veins%20blue%20energy%20tech%20fantasy%20art%20style%20futuristic",
    description: "The smallest machines bring the greatest power."
  },
  {
    id: "second-life-ranker",
    title: "Second Life Ranker",
    genre: "Reincarnation",
    cover: "Ranker%20reborn%20with%20memories%20powerful%20aura%20epic%20fantasy%20art%20style%20dramatic",
    description: "He returns with knowledge of the future."
  },
  {
    id: "returners-magic",
    title: "A Returner's Magic Should Be Special",
    genre: "Time Travel",
    cover: "Mage%20returning%20through%20time%20portal%20glowing%20magic%20circles%20epic%20fantasy%20art%20style",
    description: "This time, his magic will be different."
  },
  {
    id: "beginning-after-end",
    title: "The Beginning After The End",
    genre: "Reincarnation",
    cover: "King%20reborn%20into%20new%20world%20magic%20power%20fantasy%20art%20style%20epic%20dramatic",
    description: "A king's second chance at life."
  },
  {
    id: "omniscient-reader",
    title: "Omniscient Reader's Viewpoint",
    genre: "Meta Fiction",
    cover: "Reader%20observing%20story%20world%20characters%20around%20fantasy%20art%20style%20mysterious",
    description: "The only reader who knows how it ends."
  },
  {
    id: "overgeared",
    title: "Overgeared",
    genre: "LitRPG",
    cover: "Legendary%20blacksmith%20Grid%20items%20crafting%20game%20world%20LitRPG%20fantasy%20art",
    description: "The legendary blacksmith rises."
  },
  {
    id: "legendary-moonlight-sculptor",
    title: "The Legendary Moonlight Sculptor",
    genre: "LitRPG",
    cover: "Sculptor%20VR%20game%20statues%20coming%20alive%20artistic%20class%20LitRPG%20fantasy%20art",
    description: "Sculpt your destiny."
  },
  {
    id: "solo-leveling",
    title: "Solo Leveling",
    genre: "Shadow Hunter",
    cover: "Shadow%20hunter%20with%20glowing%20eyes%20surrounded%20by%20shadow%20soldiers%20epic%20fantasy%20art%20style%20dark",
    description: "The weakest hunter becomes the strongest."
  },
  {
    id: "tower-god",
    title: "Tower of God",
    genre: "Progression Fantasy",
    cover: "Massive%20tower%20reaching%20to%20sky%20climbers%20ascending%20epic%20fantasy%20art%20style%20mysterious",
    description: "Everything is at the top of the tower."
  },
  {
    id: "sss-suicide-hunter",
    title: "SSS-Class Suicide Hunter",
    genre: "LitRPG",
    cover: "Suicide%20dungeon%20resurrection%20power%20hunter%20SSS%20class%20LitRPG%20fantasy%20art",
    description: "Die to become stronger."
  },
  {
    id: "max-level-newbie",
    title: "Max Level Newbie",
    genre: "LitRPG",
    cover: "Veteran%20player%20new%20server%20max%20level%20knowledge%20LitRPG%20fantasy%20gaming%20art",
    description: "Max level knowledge, newbie server."
  },
  {
    id: "regressor-instruction-manual",
    title: "Regressor Instruction Manual",
    genre: "LitRPG",
    cover: "Regressor%20manual%20time%20travel%20knowledge%20game%20world%20strategy%20LitRPG%20art",
    description: "How to survive as a regressor."
  },
  {
    id: "taming-master",
    title: "Taming Master",
    genre: "LitRPG",
    cover: "Tamer%20class%20beast%20master%20pets%20evolution%20LitRPG%20fantasy%20game%20art%20style",
    description: "Master of beasts and taming."
  },
  {
    id: "past-life-regressor",
    title: "Past Life Regressor",
    genre: "LitRPG",
    cover: "Regressor%20past%20life%20memories%20future%20knowledge%20gaming%20world%20fantasy%20art",
    description: "Knowledge from the future."
  },

  // === CULTIVATION & XIANXIA (25) ===
  {
    id: "martial-peak",
    title: "Martial Peak",
    genre: "Cultivation",
    cover: "Martial%20artist%20standing%20on%20mountain%20peak%20qi%20energy%20flowing%20cultivation%20fantasy%20art%20style%20traditional",
    description: "Climbing the martial peak, one step at a time."
  },
  {
    id: "coiling-dragon",
    title: "Coiling Dragon",
    genre: "Epic Fantasy",
    cover: "Golden%20dragon%20coiling%20around%20mountain%20mythical%20creature%20epic%20fantasy%20scenery%20dramatic%20lighting",
    description: "A dragon's legacy, a mortal's journey."
  },
  {
    id: "stellar-transformations",
    title: "Stellar Transformations",
    genre: "Cosmic Cultivation",
    cover: "Cultivator%20transforming%20into%20cosmic%20energy%20stars%20galaxies%20swirling%20space%20fantasy%20art%20style%20nebula",
    description: "Transforming the stars, conquering the cosmos."
  },
  {
    id: "desolate-era",
    title: "Desolate Era",
    genre: "Historical Fantasy",
    cover: "Ancient%20Chinese%20scholar%20in%20desolate%20landscape%20traditional%20painting%20style%20cultivation%20fantasy%20mountains%20mists",
    description: "In a desolate era, one youth rises."
  },
  {
    id: "shall-seal-heavens",
    title: "I Shall Seal the Heavens",
    genre: "Cultivation Epic",
    cover: "Cultivator%20sealing%20the%20heavens%20hand%20seals%20cosmic%20energy%20epic%20fantasy%20art%20style%20divine%20power",
    description: "I shall seal the heavens, and all shall bow."
  },
  {
    id: "against-gods",
    title: "Against the Gods",
    genre: "Reincarnation Fantasy",
    cover: "Phoenix%20rising%20against%20divine%20beings%20reincarnation%20fantasy%20epic%20battle%20heavenly%20realm%20mythical%20art",
    description: "Against the gods, against fate itself."
  },
  {
    id: "record-mortal-immortality",
    title: "A Record of a Mortal's Journey to Immortality",
    genre: "Cultivation",
    cover: "Mortal%20village%20boy%20immortal%20cultivation%20path%20fantasy%20art%20style%20long%20journey",
    description: "From mortal to immortal."
  },
  {
    id: "soul-land",
    title: "Soul Land",
    genre: "Cultivation",
    cover: "Spirit%20master%20martial%20soul%20blue%20silver%20grass%20Douluo%20Dal%20fantasy%20art",
    description: "Martial souls awaken."
  },
  {
    id: "battle-through-heavens",
    title: "Battle Through the Heavens",
    genre: "Cultivation",
    cover: "Flame%20control%20cultivator%20heavenly%20flames%20alchemist%20xianxia%20fantasy%20art",
    description: "Heavenly flames, heavenly power."
  },
  {
    id: "wu-dong-qian-kun",
    title: "Wu Dong Qian Kun",
    genre: "Cultivation",
    cover: "Symbol%20master%20ancestral%20stone%20cultivation%20martial%20arts%20fantasy%20art%20style",
    description: "Martial intent, boundless universe."
  },
  {
    id: "sage-monarch",
    title: "Sage Monarch",
    genre: "Cultivation",
    cover: "Yang%20Qi%20demon%20sage%20monarch%20hell%20crushing%20energy%20cultivation%20fantasy%20art",
    description: "Crown prince returns with hellish power."
  },
  {
    id: "divine-soul-emperor",
    title: "Divine Soul Emperor",
    genre: "Cultivation",
    cover: "Soul%20power%20emperor%20cultivation%20spiritual%20energy%20fantasy%20art%20style%20epic",
    description: "The emperor of divine souls."
  },
  {
    id: "eternal-sacred-king",
    title: "Eternal Sacred King",
    genre: "Cultivation",
    cover: "Sacred%20king%20eternal%20power%20cultivation%20realm%20divine%20authority%20fantasy%20art",
    description: "The king who defies eternity."
  },
  {
    id: "apotheosis",
    title: "Apotheosis - Ascension to Godhood",
    genre: "Cultivation",
    cover: "God%20ascension%20cultivation%20heavenly%20realm%20divine%20transformation%20fantasy%20art",
    description: "From mortal to god."
  },
  {
    id: "renegade-immortal",
    title: "Renegade Immortal",
    genre: "Cultivation",
    cover: "Wang%20Lin%20renegade%20path%20immortal%20cultivation%20defying%20heaven%20fantasy%20art",
    description: "The renegade path to immortality."
  },
  {
    id: "pursuit-truth",
    title: "Pursuit of the Truth",
    genre: "Cultivation",
    cover: "Seeker%20truth%20cultivation%20ancient%20secrets%20mystical%20journey%20fantasy%20art%20style",
    description: "Pursuing truth through cultivation."
  },
  {
    id: "legend-northern-blade",
    title: "Legend of the Northern Blade",
    genre: "Martial Arts",
    cover: "Warrior%20with%20northern%20blade%20snow%20mountains%20martial%20arts%20fantasy%20art%20style%20epic%20pose",
    description: "The legend of the frozen north begins."
  },
  {
    id: "condor-heroes",
    title: "Legend of the Condor Heroes",
    genre: "Wuxia",
    cover: "Condor%20eagle%20hero%20martial%20arts%20ancient%20China%20wuxia%20classic%20fantasy%20art",
    description: "The classic wuxia tale."
  },
  {
    id: "demi-gods-devils",
    title: "Demi-Gods and Semi-Devils",
    genre: "Wuxia",
    cover: "Eight%20trigrams%20martial%20arts%20ancient%20China%20wuxia%20epic%20battles%20fantasy%20art",
    description: "Eight trigrams, endless power."
  },
  {
    id: "smiling-proud-wanderer",
    title: "The Smiling, Proud Wanderer",
    genre: "Wuxia",
    cover: "Swordsman%20wanderer%20sword%20techniques%20ancient%20China%20martial%20arts%20fantasy%20art",
    description: "The proud wanderer's journey."
  },
  {
    id: "heaven-sword-dragon-saber",
    title: "Heaven Sword and Dragon Saber",
    genre: "Wuxia",
    cover: "Legendary%20swords%20heaven%20dragon%20martial%20arts%20wuxia%20epic%20fantasy%20art%20style",
    description: "Two weapons, one destiny."
  },
  {
    id: "way-kings",
    title: "The Way of Kings",
    genre: "Epic Fantasy",
    cover: "Stormlight%20radiant%20armor%20spears%20highstorms%20Roshar%20epic%20fantasy%20art%20style",
    description: "Life before death. Strength before weakness."
  },
  {
    id: "mistborn",
    title: "Mistborn",
    genre: "Epic Fantasy",
    cover: "Allomancer%20metals%20burning%20mist%20capes%20jumping%20magical%20metals%20fantasy%20art",
    description: "There's always another secret."
  },
  {
    id: "name-wind",
    title: "The Name of the Wind",
    genre: "Epic Fantasy",
    cover: "Kvothe%20lute%20sympathy%20magic%20university%20Chandrian%20Kingkiller%20Chronicle%20art",
    description: "I have stolen princesses back from sleeping barrow kings."
  },
  {
    id: "stormlight",
    title: "Stormlight Archive",
    genre: "Epic Fantasy",
    cover: "Knights%20Radiant%20oathpact%20spren%20highstorms%20Roshar%20epic%20fantasy%20art%20style",
    description: "The Knights Radiant stand again."
  },

  // === SCI-FI (20) ===
  {
    id: "three-body-problem",
    title: "Three-Body Problem",
    genre: "Hard Sci-Fi",
    cover: "Three%20suns%20in%20alien%20sky%20trisolaran%20world%20space%20physics%20hard%20sci-fi%20art%20style",
    description: "The universe is not as it seems."
  },
  {
    id: "dune",
    title: "Dune",
    genre: "Space Opera",
    cover: "Desert%20planet%20Arrakis%20giant%20sandworm%20spice%20melange%20epic%20sci-fi%20art%20style%20dramatic",
    description: "The spice must flow."
  },
  {
    id: "foundation",
    title: "Foundation",
    genre: "Galactic Empire",
    cover: "Trantor%20city%20planet%20galactic%20empire%20futuristic%20metropolis%20epic%20sci-fi%20art%20style",
    description: "The fall of empire, the rise of psychohistory."
  },
  {
    id: "hyperion",
    title: "Hyperion",
    genre: "Space Opera",
    cover: "Time%20Tombs%20on%20Hyperion%20Shrike%20creature%20space%20opera%20epic%20sci-fi%20art%20style",
    description: "Pilgrims to the Time Tombs."
  },
  {
    id: "neuromancer",
    title: "Neuromancer",
    genre: "Cyberpunk",
    cover: "Cyberpunk%20matrix%20neural%20interface%20hacker%20cyberspace%20digital%20rain%20effect%20sci-fi%20art",
    description: "The matrix has you."
  },
  {
    id: "snow-crash",
    title: "Snow Crash",
    genre: "Cyberpunk",
    cover: "Metaverse%20avatar%20virtual%20reality%20hacker%20with%20sword%20cyberpunk%20art%20style",
    description: "Hiro Protagonist in the metaverse."
  },
  {
    id: "ready-player-one",
    title: "Ready Player One",
    genre: "VR Sci-Fi",
    cover: "Virtual%20reality%20gamer%20eighties%20nostalgia%20OASIS%20metaverse%20sci-fi%20adventure%20art",
    description: "The OASIS awaits."
  },
  {
    id: "enders-game",
    title: "Ender's Game",
    genre: "Military Sci-Fi",
    cover: "Child%20prodigy%20battle%20school%20zero%20gravity%20training%20military%20sci-fi%20art%20style",
    description: "The enemy's gate is down."
  },
  {
    id: "martian",
    title: "The Martian",
    genre: "Hard Sci-Fi",
    cover: "Astronaut%20on%20Mars%20potato%20farm%20red%20planet%20survival%20sci-fi%20NASA%20realism%20art",
    description: "Science the shit out of this."
  },
  {
    id: "expanse",
    title: "Leviathan Wakes",
    genre: "Space Opera",
    cover: "Spaceship%20Rocinante%20protomolecule%20space%20detective%20expanse%20style%20epic%20sci-fi%20art",
    description: "The expansion of humanity into space."
  },
  {
    id: "project-hail-mary",
    title: "Project Hail Mary",
    genre: "First Contact",
    cover: "Astronaut%20meeting%20alien%20creature%20space%20ship%20first%20contact%20sci-fi%20art%20style",
    description: "A lone astronaut must save Earth."
  },
  {
    id: "remembrance-earths-past",
    title: "Remembrance of Earth's Past",
    genre: "Cosmic Horror",
    cover: "Dark%20forest%20universe%20cosmic%20horror%20alien%20civilization%20epic%20sci-fi%20art%20style",
    description: "The universe is a dark forest."
  },
  {
    id: "old-mans-war",
    title: "Old Man's War",
    genre: "Military Sci-Fi",
    cover: "Elderly%20soldier%20in%20young%20cloned%20body%20space%20battle%20military%20sci-fi%20art%20style",
    description: "Seventy-five year olds fight humanity's wars."
  },
  {
    id: "revelation-space",
    title: "Revelation Space",
    genre: "Space Opera",
    cover: "Ancient%20alien%20artifacts%20space%20archaeology%20mysterious%20structures%20epic%20sci-fi%20art",
    description: "The dead civilizations speak."
  },
  {
    id: "culture-phlebas",
    title: "Consider Phlebas",
    genre: "Space Opera",
    cover: "Shape-shifting%20agent%20galactic%20war%20orbital%20cultures%20epic%20sci-fi%20art%20style",
    description: "The Culture meets its enemies."
  },
  {
    id: "book-new-sun",
    title: "The Book of the New Sun",
    genre: "Dying Earth",
    cover: "Torturer%20apprentice%20dying%20earth%20far%20future%20strange%20sun%20epic%20fantasy%20sci-fi",
    description: "The sun is dying, but legends remain."
  },
  {
    id: "left-hand-darkness",
    title: "The Left Hand of Darkness",
    genre: "Social Sci-Fi",
    cover: "Ice%20planet%20Gethen%20ambassador%20alien%20gender%20society%20sci-fi%20art%20style",
    description: "Winter is coming, and it never ends."
  },
  {
    id: "forever-war",
    title: "The Forever War",
    genre: "Military Sci-Fi",
    cover: "Soldier%20fighting%20interstellar%20war%20time%20dilation%20relativity%20epic%20sci-fi%20art",
    description: "A war that lasts centuries."
  },
  {
    id: "stars-destination",
    title: "The Stars My Destination",
    genre: "Space Opera",
    cover: "Man%20burning%20space%20jaunting%20teleportation%20revenge%20epic%20sci-fi%20art%20style",
    description: "Gully Foyle will have his revenge."
  },
  {
    id: "diamond-age",
    title: "The Diamond Age",
    genre: "Nanotech Sci-Fi",
    cover: "Young%20girl%20with%20interactive%20book%20nanotechnology%20neo-Victorian%20sci-fi%20art%20style",
    description: "A primer for young ladies."
  },

  // === FANTASY EPICS (20) ===
  {
    id: "wheel-time",
    title: "The Wheel of Time",
    genre: "Epic Fantasy",
    cover: "Dragon%20Reborn%20Aes%20Sedai%20One%20Power%20Pattern%20wheel%20weaving%20epic%20fantasy%20art",
    description: "The wheel weaves as the wheel wills."
  },
  {
    id: "malazan",
    title: "Malazan Book of the Fallen",
    genre: "Military Fantasy",
    cover: "Bridgeburners%20soldiers%20gods%20ascendants%20war%20empires%20military%20fantasy%20epic%20art",
    description: "Gods, soldiers, and empires collide."
  },
  {
    id: "first-law",
    title: "The First Law",
    genre: "Grimdark Fantasy",
    cover: "Barbarian%20wizard%20inquisitor%20gritty%20fantasy%20violence%20moral%20complexity%20dark%20art",
    description: "The blade itself incites to violence."
  },
  {
    id: "gentleman-bastards",
    title: "The Gentleman Bastards",
    genre: "Heist Fantasy",
    cover: "Thieves%20con%20artists%20camorr%20venice%20crime%20underworld%20heist%20fantasy%20art",
    description: "Thorn of Camorr strikes again."
  },
  {
    id: "princess-bride",
    title: "The Princess Bride",
    genre: "Romantic Adventure",
    cover: "Westley%20Buttercup%20Inigo%20Montoya%20true%20love%20pirates%20adventure%20romance%20art",
    description: "As you wish."
  },
  {
    id: "stardust",
    title: "Stardust",
    genre: "Fairy Tale",
    cover: "Faerie%20realm%20fallen%20star%20living%20girl%20witch%20queen%20fantasy%20fairy%20tale%20art",
    description: "Catch a falling star."
  },
  {
    id: "neverending-story",
    title: "The Neverending Story",
    genre: "Fantasy Adventure",
    cover: "Luckdragon%20Falcor%20Childlike%20Empress%20Fantasia%20Atreyu%20fantasy%20adventure%20art",
    description: "The story that never ends."
  },
  {
    id: "dark-tower",
    title: "The Dark Tower",
    genre: "Weird West",
    cover: "Gunslinger%20Roland%20desert%20tower%20rosea%20multiverse%20weird%20west%20fantasy%20art",
    description: "The man in black fled across the desert."
  },
  {
    id: "american-gods",
    title: "American Gods",
    genre: "Urban Fantasy",
    cover: "Old%20gods%20new%20gods%20America%20shadow%20mythology%20modern%20urban%20fantasy%20art",
    description: "Gods walk among us."
  },
  {
    id: "good-omens",
    title: "Good Omens",
    genre: "Comedy Fantasy",
    cover: "Angel%20demon%20Armageddon%20antichrist%2011-year-old%20comedy%20fantasy%20humorous%20art",
    description: "An angel and a demon save the world."
  },
  {
    id: "hitchhikers-guide",
    title: "The Hitchhiker's Guide to the Galaxy",
    genre: "Sci-Fi Comedy",
    cover: "Arthur%20Dent%20towel%20babel%20fish%2042%20meaning%20life%20universe%20comedy%20sci-fi%20art",
    description: "Don't panic."
  },
  {
    id: "dresden-files",
    title: "The Dresden Files",
    genre: "Urban Fantasy",
    cover: "Wizard%20detective%20Chicago%20magic%20investigation%20private%20eye%20urban%20fantasy%20art",
    description: "Paranormal investigations, magical solutions."
  },
  {
    id: "mercy-thompson",
    title: "Mercy Thompson",
    genre: "Urban Fantasy",
    cover: "Coyote%20shifter%20mechanic%20werewolves%20vampires%20fae%20urban%20fantasy%20PNR%20art",
    description: "A coyote in a world of wolves."
  },
  {
    id: "sookie-stackhouse",
    title: "The Sookie Stackhouse Novels",
    genre: "Paranormal Romance",
    cover: "Telepathic%20waitress%20vampires%20Louisiana%20supernatural%20romance%20Southern%20fantasy%20art",
    description: "Vampires came out of the coffin."
  },
  {
    id: "iron-druid",
    title: "The Iron Druid Chronicles",
    genre: "Urban Fantasy",
    cover: "Ancient%20druid%20modern%20Tempe%20atticus%20oberon%20irish%20wolfhound%20urban%20fantasy%20art",
    description: "Two thousand years old and counting."
  },
  {
    id: "alex-verus",
    title: "Alex Verus",
    genre: "Urban Fantasy",
    cover: "Diviner%20mage%20London%20fate%20choices%20consequences%20urban%20fantasy%20magic%20art",
    description: "See the future, change the present."
  },
  {
    id: "rivers-london",
    title: "Rivers of London",
    genre: "Urban Fantasy",
    cover: "Police%20constable%20magic%20London%20river%20spirits%20supernatural%20crime%20urban%20fantasy%20art",
    description: "The supernatural side of London policing."
  },
  {
    id: "magic-bites",
    title: "Magic Bites",
    genre: "Urban Fantasy",
    cover: "Kate%20Daniels%20magic%20waves%20post-apocalyptic%20Atlanta%20sword%20urban%20fantasy%20art",
    description: "Here I Go Again."
  },
  {
    id: "hollows",
    title: "The Hollows",
    genre: "Urban Fantasy",
    cover: "Rachel%20Morgan%20witch%20vampire%20pixy%20Cincinnati%20underground%20urban%20fantasy%20art",
    description: "A witch among vampires and demons."
  },
  {
    id: "october-daye",
    title: "October Daye",
    genre: "Urban Fantasy",
    cover: "Half-fae%20detective%20San%20Francisco%20fairy%20tale%20noir%20urban%20fantasy%20mystery%20art",
    description: "Private investigator to the fae."
  },

  // === MYSTERY & THRILLER (15) ===
  {
    id: "sherlock-holmes",
    title: "Sherlock Holmes",
    genre: "Mystery",
    cover: "Victorian%20London%20detective%20magnifying%20glass%20foggy%20streets%2019th%20century%20mystery%20art",
    description: "The game is afoot."
  },
  {
    id: "gone-girl",
    title: "Gone Girl",
    genre: "Psychological Thriller",
    cover: "Missing%20person%20poster%20marriage%20gone%20wrong%20dark%20suspense%20psychological%20thriller%20art",
    description: "Marriage is complicated. So is murder."
  },
  {
    id: "girl-dragon-tattoo",
    title: "The Girl with the Dragon Tattoo",
    genre: "Nordic Noir",
    cover: "Swedish%20hacker%20punk%20style%20dragon%20tattoo%20dark%20mystery%20Nordic%20noir%20art%20style",
    description: "Evil lurks in family secrets."
  },
  {
    id: "da-vinci-code",
    title: "The Da Vinci Code",
    genre: "Religious Thriller",
    cover: "Louvre%20museum%20Leonardo%20art%20religious%20symbols%20conspiracy%20thriller%20art%20style",
    description: "History's greatest secret revealed."
  },
  {
    id: "silent-patient",
    title: "The Silent Patient",
    genre: "Psychological Thriller",
    cover: "Woman%20who%20doesnt%20speak%20murder%20mystery%20psychological%20thriller%20dark%20art%20style",
    description: "She killed her husband. Then she stopped speaking."
  },
  {
    id: "woman-window",
    title: "The Woman in the Window",
    genre: "Psychological Thriller",
    cover: "Woman%20watching%20neighbors%20through%20window%20agoraphobia%20mystery%20thriller%20art%20style",
    description: "She sees everything. But can she trust her eyes?"
  },
  {
    id: "big-little-lies",
    title: "Big Little Lies",
    genre: "Domestic Thriller",
    cover: "Suburban%20mothers%20secrets%20lies%20school%20playground%20domestic%20thriller%20art%20style",
    description: "Little lies lead to big trouble."
  },
  {
    id: "sharp-objects",
    title: "Sharp Objects",
    genre: "Psychological Thriller",
    cover: "Reporter%20returning%20hometown%20family%20secrets%20self-harm%20dark%20mystery%20art",
    description: "Some wounds never heal."
  },
  {
    id: "in-woods",
    title: "In the Woods",
    genre: "Crime Mystery",
    cover: "Detective%20childhood%20trauma%20forest%20murder%20investigation%20dark%20crime%20art%20style",
    description: "The past always catches up."
  },
  {
    id: "before-sleep",
    title: "Before I Go to Sleep",
    genre: "Amnesia Thriller",
    cover: "Woman%20with%20amnesia%20daily%20memory%20loss%20husband%20secrets%20psychological%20thriller%20art",
    description: "Every morning she wakes up a stranger."
  },
  {
    id: "rebecca",
    title: "Rebecca",
    genre: "Gothic Mystery",
    cover: "Manderley%20mansion%20new%20wife%20dead%20first%20wife%20haunting%20gothic%20mystery%20art",
    description: "Last night I dreamt I went to Manderley again."
  },
  {
    id: "none",
    title: "And Then There Were None",
    genre: "Classic Mystery",
    cover: "Ten%20strangers%20island%20mansion%20statues%20disappearing%20Agatha%20Christie%20mystery%20art",
    description: "Ten little Indians."
  },
  {
    id: "girl-train",
    title: "The Girl on the Train",
    genre: "Psychological Thriller",
    cover: "Woman%20on%20train%20watching%20houses%20alcohol%20blackouts%20missing%20person%20thriller%20art",
    description: "She sees what others miss."
  },
  {
    id: "silent-companion",
    title: "The Silent Companions",
    genre: "Historical Horror",
    cover: "Victorian%20wooden%20dolls%20supernatural%20evil%2019th%20century%20gothic%20horror%20art",
    description: "The dolls are watching."
  },
  {
    id: "seventh-guest",
    title: "The Seventh Guest",
    genre: "Locked Room Mystery",
    cover: "Seven%20strangers%20isolated%20mansion%20storm%20murder%20locked%20room%20mystery%20art",
    description: "Seven guests. One murderer. No escape."
  },

  // === ROMANCE (15) ===
  {
    id: "pride-prejudice",
    title: "Pride and Prejudice",
    genre: "Classic Romance",
    cover: "Regency%20ballroom%20Elizabeth%20Bennet%20Mr%20Darcy%20period%20drama%20Jane%20Austen%20romance%20art",
    description: "A love story that transcends time."
  },
  {
    id: "jane-eyre",
    title: "Jane Eyre",
    genre: "Gothic Romance",
    cover: "Gothic%20mansion%20Thornfield%2019th%20century%20romance%20mystery%20woman%20governess%20art",
    description: "I am no bird; no net ensnares me."
  },
  {
    id: "wuthering-heights",
    title: "Wuthering Heights",
    genre: "Dark Romance",
    cover: "Moody%20moorland%20passionate%20lovers%20gothic%20romance%20stormy%20weather%20dramatic%20art",
    description: "Whatever our souls are made of, his and mine are the same."
  },
  {
    id: "outlander",
    title: "Outlander",
    genre: "Time Travel Romance",
    cover: "Scottish%20highlands%20woman%20time%20traveler%20Highlander%20romance%20historical%20fantasy%20art",
    description: "Through the stones, across time, for love."
  },
  {
    id: "notebook",
    title: "The Notebook",
    genre: "Contemporary Romance",
    cover: "Southern%20lake%20house%20summer%20romance%20elderly%20couple%20memories%20emotional%20love%20story%20art",
    description: "If you're a bird, I'm a bird."
  },
  {
    id: "me-before-you",
    title: "Me Before You",
    genre: "Contemporary Romance",
    cover: "Caregiver%20and%20disabled%20man%20wheelchair%20modern%20romance%20emotional%20journey%20love%20art",
    description: "You only get one life. Live it fully."
  },
  {
    id: "bridgerton",
    title: "Bridgerton",
    genre: "Regency Romance",
    cover: "Regency%20London%20ballroom%20debutantes%20duke%20Lady%20Whistledown%20romance%20art%20style",
    description: "The ton is abuzz with scandal."
  },
  {
    id: "fifty-shades",
    title: "Fifty Shades of Grey",
    genre: "Erotic Romance",
    cover: "Businessman%20in%20suit%20young%20woman%20intense%20attraction%20modern%20erotic%20romance%20art",
    description: "An unconventional love story."
  },
  {
    id: "hating-game",
    title: "The Hating Game",
    genre: "Workplace Romance",
    cover: "Office%20enemies%20rivalry%20publishing%20company%20workplace%20romance%20comedy%20art%20style",
    description: "The fine line between love and hate."
  },
  {
    id: "red-white-royal-blue",
    title: "Red, White & Royal Blue",
    genre: "LGBTQ Romance",
    cover: "First%20son%20British%20prince%20political%20romance%20modern%20royal%20love%20story%20art",
    description: "A royal romance that could change the world."
  },
  {
    id: "beach-read",
    title: "Beach Read",
    genre: "Contemporary Romance",
    cover: "Lake%20house%20summer%20neighboring%20writers%20romance%20writer%20block%20contemporary%20love%20art",
    description: "Two writers, one summer, endless possibilities."
  },
  {
    id: "unhoneymooners",
    title: "The Unhoneymooners",
    genre: "Romantic Comedy",
    cover: "Hawaii%20honeymoon%20enemies%20forced%20proximity%20wedding%20disaster%20romantic%20comedy%20art",
    description: "The perfect honeymoon with the wrong person."
  },
  {
    id: "love-hypothesis",
    title: "The Love Hypothesis",
    genre: "Academic Romance",
    cover: "PhD%20student%20fake%20dating%20professor%20STEM%20academia%20romance%20science%20lab%20art",
    description: "Love is the ultimate hypothesis."
  },
  {
    id: "seven-husbands",
    title: "The Seven Husbands of Evelyn Hugo",
    genre: "Historical Romance",
    cover: "Hollywood%20golden%20age%20actress%20glamour%20seven%20marriages%20secrets%20vintage%20romance%20art",
    description: "Seven husbands. One true love."
  },
  {
    id: "josh-hazel",
    title: "Josh and Hazel's Guide to Not Dating",
    genre: "Romantic Comedy",
    cover: "Best%20friends%20double%20dates%20quirky%20woman%20charming%20man%20romantic%20comedy%20art%20style",
    description: "The guide to not dating that leads to love."
  },

  // === HORROR (15) ===
  {
    id: "dracula",
    title: "Dracula",
    genre: "Gothic Horror",
    cover: "Count%20Dracula%20vampire%20lord%20Transylvania%20castle%20gothic%20horror%20classic%20art",
    description: "The blood is the life."
  },
  {
    id: "frankenstein",
    title: "Frankenstein",
    genre: "Gothic Horror",
    cover: "Frankenstein%20monster%20lightning%20experiment%20creation%20gothic%20horror%20Shelley%20art",
    description: "I should be thy Adam, but I am rather the fallen angel."
  },
  {
    id: "it",
    title: "IT",
    genre: "Supernatural Horror",
    cover: "Pennywise%20clown%20red%20balloon%20Derry%20sewers%20childhood%20fears%20Stephen%20King%20horror%20art",
    description: "They all float down here."
  },
  {
    id: "exorcist",
    title: "The Exorcist",
    genre: "Demonic Horror",
    cover: "Demonic%20possession%20exorcism%20ritual%20religious%20horror%20supernatural%20terror%20art%20style",
    description: "The power of Christ compels you."
  },
  {
    id: "shining",
    title: "The Shining",
    genre: "Psychological Horror",
    cover: "Overlook%20Hotel%20snow%20maze%20typewriter%20heres%20Johnny%20isolation%20madness%20horror%20art",
    description: "All work and no play."
  },
  {
    id: "haunting-hill-house",
    title: "The Haunting of Hill House",
    genre: "Gothic Horror",
    cover: "Gothic%20mansion%20haunted%20house%20ghostly%20apparitions%20supernatural%20horror%20art%20style",
    description: "Some houses are born bad."
  },
  {
    id: "bird-box",
    title: "Bird Box",
    genre: "Post-Apocalyptic Horror",
    cover: "Woman%20blindfolded%20rowboat%20river%20creatures%20invisible%20horror%20apocalypse%20survival%20art",
    description: "Don't look. Don't breathe. Just run."
  },
  {
    id: "quiet-place",
    title: "A Quiet Place",
    genre: "Creature Horror",
    cover: "Family%20silent%20monsters%20sound%20sensitive%20creatures%20post-apocalyptic%20horror%20art",
    description: "If they hear you, they hunt you."
  },
  {
    id: "cabin-woods",
    title: "The Cabin in the Woods",
    genre: "Meta Horror",
    cover: "Cabin%20forest%20containment%20facility%20horror%20tropes%20monsters%20meta%20horror%20art%20style",
    description: "You think you know this story."
  },
  {
    id: "hereditary",
    title: "Hereditary",
    genre: "Supernatural Horror",
    cover: "Family%20trauma%20occult%20secrets%20miniatures%20possession%20supernatural%20horror%20art%20style",
    description: "Every family tree hides a secret."
  },
  {
    id: "conjuring",
    title: "The Conjuring",
    genre: "Paranormal Horror",
    cover: "Warren%20couple%20paranormal%20investigators%20haunted%20house%20demon%20possession%20horror%20art",
    description: "Based on true events."
  },
  {
    id: "silence-lambs",
    title: "The Silence of the Lambs",
    genre: "Psychological Horror",
    cover: "Clarice%20Starling%20Hannibal%20Lecter%20mask%20serial%20killer%20psychological%20horror%20art",
    description: "Hello, Clarice."
  },
  {
    id: "american-psycho",
    title: "American Psycho",
    genre: "Satirical Horror",
    cover: "Yuppie%20businessman%20eighties%20excess%20violence%20satirical%20horror%20business%20card%20art",
    description: "I have to return some videotapes."
  },
  {
    id: "ring",
    title: "The Ring",
    genre: "Supernatural Horror",
    cover: "Samara%20cursed%20videotape%20well%20television%20seven%20days%20Japanese%20horror%20style%20art",
    description: "Seven days."
  },
  {
    id: "sinister",
    title: "Sinister",
    genre: "Supernatural Horror",
    cover: "True%20crime%20writer%208mm%20films%20Boogie%20man%20Bagul%20supernatural%20horror%20art%20style",
    description: "Once you see him, nothing can save you."
  },

  // === ADVENTURE (10) ===
  {
    id: "indiana-jones",
    title: "Indiana Jones",
    genre: "Adventure",
    cover: "Archaeologist%20whip%20fedora%20ancient%20temple%20adventure%20hero%20treasure%20hunt%20art%20style",
    description: "X never marks the spot."
  },
  {
    id: "james-bond",
    title: "James Bond",
    genre: "Spy Thriller",
    cover: "Secret%20agent%20tuxedo%20martini%20spy%20gadgets%20007%20sophisticated%20action%20art%20style",
    description: "Bond. James Bond. Shaken, not stirred."
  },
  {
    id: "jack-reacher",
    title: "Jack Reacher",
    genre: "Military Thriller",
    cover: "Military%20police%20drifter%20investigation%20thriller%20hero%20minimalist%20action%20art",
    description: "I don't have an address. I don't have a phone."
  },
  {
    id: "bourne-identity",
    title: "The Bourne Identity",
    genre: "Spy Thriller",
    cover: "Amnesiac%20assassin%20Mediterranean%20sea%20identity%20crisis%20spy%20thriller%20action%20art",
    description: "Who is Jason Bourne?"
  },
  {
    id: "hunt-red-october",
    title: "The Hunt for Red October",
    genre: "Military Thriller",
    cover: "Soviet%20submarine%20Cold%20War%20naval%20warfare%20nuclear%20tension%20military%20thriller%20art",
    description: "One ping only."
  },
  {
    id: "three-musketeers",
    title: "The Three Musketeers",
    genre: "Historical Adventure",
    cover: "French%20musketeers%20swords%20swashbuckling%2017th%20century%20adventure%20all%20for%20one%20art",
    description: "All for one, and one for all."
  },
  {
    id: "around-world",
    title: "Around the World in 80 Days",
    genre: "Classic Adventure",
    cover: "Victorian%20gentleman%20hot%20air%20balloon%20world%20travel%20adventure%20Jules%20Verne%20art",
    description: "Eighty days to circle the globe."
  },
  {
    id: "count-monte-cristo",
    title: "The Count of Monte Cristo",
    genre: "Revenge Adventure",
    cover: "Wrongfully%20imprisoned%20man%20revenge%20hidden%20treasure%20transformation%20adventure%20art",
    description: "Wait and hope."
  },
  {
    id: "treasure-island",
    title: "Treasure Island",
    genre: "Pirate Adventure",
    cover: "Pirate%20Long%20John%20Silver%20treasure%20map%20island%20adventure%20ship%20pirates%20art",
    description: "Fifteen men on a dead man's chest."
  },
  {
    id: "jurassic-park",
    title: "Jurassic Park",
    genre: "Sci-Fi Adventure",
    cover: "T-Rex%20dinosaur%20amusement%20park%20chaos%20theory%20cloned%20creatures%20epic%20adventure%20art",
    description: "Life finds a way."
  },

  // === YA FANTASY (12) ===
  {
    id: "harry-potter",
    title: "Harry Potter",
    genre: "Magic School",
    cover: "Young%20wizard%20glasses%20lightning%20scar%20Hogwarts%20castle%20magic%20school%20fantasy%20art",
    description: "The boy who lived."
  },
  {
    id: "percy-jackson",
    title: "Percy Jackson",
    genre: "Greek Mythology",
    cover: "Demigod%20teenager%20Camp%20Half%20Blood%20Greek%20gods%20trident%20mythology%20adventure%20art",
    description: "The gods of Olympus are alive in America."
  },
  {
    id: "hunger-games",
    title: "The Hunger Games",
    genre: "Dystopian YA",
    cover: "Katniss%20Everdeen%20bow%20arrow%20arena%20battle%20dystopian%20future%20survival%20contest%20art",
    description: "May the odds be ever in your favor."
  },
  {
    id: "maze-runner",
    title: "The Maze Runner",
    genre: "Dystopian Sci-Fi",
    cover: "Glade%20maze%20walls%20teenagers%20trapped%20dystopian%20experiment%20sci-fi%20thriller%20art",
    description: "Welcome to the Glade."
  },
  {
    id: "divergent",
    title: "Divergent",
    genre: "Dystopian Future",
    cover: "Faction%20symbols%20Chicago%20ruins%20Dauntless%20Abnegation%20dystopian%20future%20society%20art",
    description: "Faction before blood."
  },
  {
    id: "twilight",
    title: "Twilight",
    genre: "Paranormal Romance",
    cover: "Vampire%20Edward%20Bella%20Forks%20Washington%20forest%20paranormal%20teen%20romance%20art",
    description: "About three things I was absolutely positive."
  },
  {
    id: "fault-stars",
    title: "The Fault in Our Stars",
    genre: "Contemporary YA",
    cover: "Teen%20cancer%20patients%20Amsterdam%20canal%20emotional%20YA%20romance%20infinite%20love%20art",
    description: "Some infinities are bigger than others."
  },
  {
    id: "red-queen",
    title: "Red Queen",
    genre: "Fantasy Dystopia",
    cover: "Silver%20blood%20red%20blood%20superpowers%20kingdom%20class%20warfare%20fantasy%20art",
    description: "Power is a dangerous game."
  },
  {
    id: "throne-glass",
    title: "Throne of Glass",
    genre: "Fantasy YA",
    cover: "Female%20assassin%20glass%20castle%20competition%20fantasy%20kingdom%20adventure%20art",
    description: "She is the greatest assassin."
  },
  {
    id: "court-thorns-roses",
    title: "A Court of Thorns and Roses",
    genre: "Fantasy Romance",
    cover: "Beauty%20Beast%20retelling%20fae%20courts%20magic%20enchanted%20forest%20fantasy%20romance%20art",
    description: "There are worse things than death."
  },
  {
    id: "six-crows",
    title: "Six of Crows",
    genre: "Heist Fantasy",
    cover: "Criminal%20crew%20heist%20Ketterdam%20gang%20leader%20disability%20fantasy%20heist%20art",
    description: "No mourners. No funerals."
  },
  {
    id: "shadow-bone",
    title: "Shadow and Bone",
    genre: "Fantasy YA",
    cover: "Sun%20Summoner%20Shadow%20Fold%20Grisha%20magic%20Russian%20inspired%20fantasy%20art",
    description: "The Darkling rules from the shadows."
  },

  // === LITERARY FICTION (10) ===
  {
    id: "great-gatsby",
    title: "The Great Gatsby",
    genre: "Literary Fiction",
    cover: "Roaring%20twenties%20Long%20Island%20green%20light%20wealth%20deception%20American%20dream%20art",
    description: "So we beat on, boats against the current."
  },
  {
    id: "kill-mockingbird",
    title: "To Kill a Mockingbird",
    genre: "Literary Fiction",
    cover: "Southern%20town%20courthouse%20racial%20injustice%20childhood%20innocence%20literary%20classic%20art",
    description: "It is a sin to kill a mockingbird."
  },
  {
    id: "nineteen-eighty-four",
    title: "1984",
    genre: "Dystopian Fiction",
    cover: "Big%20Brother%20watching%20totalitarian%20regime%20surveillance%20thought%20police%20dystopian%20art",
    description: "Big Brother is watching you."
  },
  {
    id: "brave-new-world",
    title: "Brave New World",
    genre: "Dystopian Fiction",
    cover: "Futuristic%20society%20soma%20pills%20genetic%20engineering%20dystopian%20future%20art%20style",
    description: "Community, Identity, Stability."
  },
  {
    id: "handmaids-tale",
    title: "The Handmaid's Tale",
    genre: "Dystopian Fiction",
    cover: "Red%20robes%20white%20bonnets%20Gilead%20theocratic%20regime%20oppression%20dystopian%20art",
    description: "Under His eye."
  },
  {
    id: "catch-twenty-two",
    title: "Catch-22",
    genre: "Satirical Fiction",
    cover: "WWII%20bombers%20military%20bureaucracy%20absurdity%20satire%20comedy%20literary%20art",
    description: "That's some catch, that Catch-22."
  },
  {
    id: "bell-jar",
    title: "The Bell Jar",
    genre: "Literary Fiction",
    cover: "Young%20woman%20mental%20illness%20depression%20fifties%20America%20literary%20art%20style",
    description: "I am, I am, I am."
  },
  {
    id: "road",
    title: "The Road",
    genre: "Post-Apocalyptic",
    cover: "Father%20son%20ash-covered%20road%20post-apocalyptic%20survival%20bleak%20future%20art",
    description: "Carrying the fire."
  },
  {
    id: "lovely-bones",
    title: "The Lovely Bones",
    genre: "Contemporary Fiction",
    cover: "Murdered%20girl%20heaven%20watching%20family%20grief%20supernatural%20contemporary%20art",
    description: "I was fourteen when I was murdered."
  },
  {
    id: "life-pi",
    title: "Life of Pi",
    genre: "Adventure Fiction",
    cover: "Boy%20lifeboat%20Bengal%20tiger%20Pacific%20Ocean%20survival%20adventure%20spiritual%20art",
    description: "The story that will make you believe in God."
  },

  // === HISTORICAL FICTION (10) ===
  {
    id: "pillars-earth",
    title: "The Pillars of the Earth",
    genre: "Historical Fiction",
    cover: "Medieval%20cathedral%20construction%2012th%20century%20England%20monks%20builders%20epic%20art",
    description: "Building a cathedral, changing a world."
  },
  {
    id: "name-rose",
    title: "The Name of the Rose",
    genre: "Historical Mystery",
    cover: "Medieval%20monastery%2014th%20century%20monk%20detective%20religious%20mystery%20historical%20art",
    description: "The rose only blooms to die."
  },
  {
    id: "shogun",
    title: "Shogun",
    genre: "Historical Fiction",
    cover: "Japan%201600s%20samurai%20English%20pilot%20feudal%20warfare%20cultural%20clash%20epic%20art",
    description: "The samurai code."
  },
  {
    id: "wolf-hall",
    title: "Wolf Hall",
    genre: "Historical Fiction",
    cover: "Thomas%20Cromwell%20Tudor%20court%20Henry%20VIII%20Anne%20Boleyn%2016th%20century%20political%20art",
    description: "Man is wolf to man."
  },
  {
    id: "all-light",
    title: "All the Light We Cannot See",
    genre: "Historical Fiction",
    cover: "Blind%20French%20girl%20German%20soldier%20WWII%20Saint-Malo%20radio%20transmissions%20art",
    description: "The light we cannot see."
  },
  {
    id: "nightingale",
    title: "The Nightingale",
    genre: "Historical Fiction",
    cover: "Two%20sisters%20Nazi-occupied%20France%20resistance%20survival%20WWII%20women%20heroism%20art",
    description: "In love we find out who we want to be."
  },
  {
    id: "book-negroes",
    title: "The Book of Negroes",
    genre: "Historical Fiction",
    cover: "Enslaved%20woman%20journey%20freedom%2018th%20century%20Atlantic%20slave%20trade%20historical%20art",
    description: "A journey through slavery to freedom."
  },
  {
    id: "other-boleyn-girl",
    title: "The Other Boleyn Girl",
    genre: "Historical Fiction",
    cover: "Mary%20Boleyn%20Anne%20Boleyn%20Henry%20VIII%20Tudor%20court%20sisters%20rivalry%20romance%20art",
    description: "Two sisters. One king."
  },
  {
    id: "kennedy-women",
    title: "The Kennedy Women",
    genre: "Biographical Fiction",
    cover: "Camelot%20Kennedy%20family%20women%20strength%20tragedy%20American%20royalty%20biographical%20art",
    description: "The women behind the crown."
  },
  {
    id: "alice-network",
    title: "The Alice Network",
    genre: "Historical Fiction",
    cover: "WWI%20spy%20network%20female%20agents%20resistance%20Nazis%20historical%20thriller%20art",
    description: "The Alice Network never forgets."
  }
,
  {
    id: "lilac-girls",
    title: "Lilac Girls",
    genre: "Historical Fiction",
    cover: "Ravensbruck%20concentration%20camp%20women%20survivors%20WWII%20resilience%20historical%20art",
    description: "Based on a true story of courage."
  },
  {
    id: "orphan-train",
    title: "Orphan Train",
    genre: "Historical Fiction",
    cover: "Irish%20orphan%20train%20journey%20adoption%20American%20West%20historical%20journey%20art",
    description: "Two women. One secret."
  },
  {
    id: "night-circus",
    title: "The Night Circus",
    genre: "Fantasy Romance",
    cover: "Magical%20circus%20black%20white%20tents%20illusionists%20competition%20enchanted%20romance%20art",
    description: "Open only at night."
  },
  {
    id: "starless-sea",
    title: "The Starless Sea",
    genre: "Fantasy Mystery",
    cover: "Underground%20library%20golden%20keys%20stories%20within%20stories%20mystical%20fantasy%20art",
    description: "A story about stories."
  },
  {
    id: "ten-thousand-doors",
    title: "The Ten Thousand Doors of January",
    genre: "Portal Fantasy",
    cover: "Doors%20other%20worlds%20early%20twentieth%20century%20adventure%20portal%20fantasy%20art",
    description: "Doors lead to adventure."
  },
  {
    id: "circe",
    title: "Circe",
    genre: "Mythological Fantasy",
    cover: "Greek%20witch%20island%20lions%20Odysseus%20mythology%20magic%20transformation%20art",
    description: "The witch who turned men to pigs."
  },
  {
    id: "song-achilles",
    title: "The Song of Achilles",
    genre: "Historical Fantasy",
    cover: "Achilles%20Patroclus%20Trojan%20War%20heroes%20love%20story%20ancient%20Greece%20art",
    description: "The story of Achilles like never before."
  },
  {
    id: "priory-orange-tree",
    title: "The Priory of the Orange Tree",
    genre: "Epic Fantasy",
    cover: "Dragons%20queens%20magic%20political%20intrigue%20feminist%20fantasy%20epic%20art",
    description: "A world without men."
  },
  {
    id: "fourth-wing",
    title: "Fourth Wing",
    genre: "Dragon Fantasy",
    cover: "Dragon%20riders%20war%20college%20enemies%20lovers%20violet%20sorrengail%20fantasy%20art",
    description: "Ride or die."
  },
  {
    id: "crescent-city",
    title: "Crescent City",
    genre: "Urban Fantasy",
    cover: "Half-fae%20half-human%20murder%20mystery%20angels%20demons%20modern%20fantasy%20art",
    description: "In a city of angels and demons."
  },
  {
    id: "silver-flames",
    title: "A Court of Silver Flames",
    genre: "Fantasy Romance",
    cover: "Warrior%20trainer%20ice%20court%20passion%20healing%20fantasy%20romance%20art",
    description: "Strength in vulnerability."
  },
  {
    id: "house-earth-blood",
    title: "House of Earth and Blood",
    genre: "Urban Fantasy",
    cover: "Murder%20investigation%20demons%20angels%20modern%20city%20revenge%20fantasy%20art",
    description: "Bryce Quinlan seeks revenge."
  },
  {
    id: "throne-fallen",
    title: "Throne of the Fallen",
    genre: "Fantasy Romance",
    cover: "Prince%20hell%20enemies%20lovers%20games%20dark%20court%20fantasy%20romance%20art",
    description: "The prince of hell plays games."
  },
  {
    id: "divine-rivals",
    title: "Divine Rivals",
    genre: "Historical Fantasy",
    cover: "World%20War%20correspondents%20enchanted%20typewriters%20rivals%20lovers%20war%20art",
    description: "Letters across the battlefield."
  },
  {
    id: "atlas-six",
    title: "The Atlas Six",
    genre: "Dark Academia",
    cover: "Six%20magicians%20secret%20society%20dangerous%20knowledge%20dark%20academia%20art",
    description: "Six magicians. One secret."
  },
  {
    id: "babel",
    title: "Babel",
    genre: "Historical Fantasy",
    cover: "Oxford%20University%20translation%20magic%2019th%20century%20colonialism%20dark%20academia%20art",
    description: "The power of language."
  },
  {
    id: "children-blood-bone",
    title: "Children of Blood and Bone",
    genre: "African Fantasy",
    cover: "Orisha%20magic%20Nigeria%20diviners%20white%20hair%20staff%20power%20fantasy%20art",
    description: "Magic has been suppressed."
  },
  {
    id: "legendborn",
    title: "Legendborn",
    genre: "Urban Fantasy",
    cover: "King%20Arthur%20secret%20society%20black%20girl%20magic%20Carolina%20college%20fantasy%20art",
    description: "King Arthur reborn."
  },
  {
    id: "gilded-wolves",
    title: "The Gilded Wolves",
    genre: "Historical Fantasy",
    cover: "1889%20Paris%20heist%20artifacts%20Babel%20Tower%20magic%20historical%20fantasy%20art",
    description: "A heist in golden age Paris."
  },
  {
    id: "raybearer",
    title: "Raybearer",
    genre: "African Fantasy",
    cover: "Council%20eleven%20love%20loyalty%20Africa%20inspired%20magic%20fantasy%20art",
    description: "Loyalty or love?"
  },
  {
    id: "inka-marka",
    title: "The Inka Marka",
    genre: "Historical Fantasy",
    cover: "Inca%20empire%20conquistadors%20gods%20resistance%20South%20American%20fantasy%20art",
    description: "The gods of the Inca."
  },
  {
    id: "popisho",
    title: "Popisho",
    genre: "Magical Realism",
    cover: "Caribbean%20island%20cursed%20blessed%20food%20magic%20colorful%20magical%20realism%20art",
    description: "Everyone is cursed."
  },
  {
    id: "black-sun",
    title: "Black Sun",
    genre: "Pre-Columbian Fantasy",
    cover: "Crows%20gods%20clergy%20pre-Columbian%20Americas%20convergence%20dark%20fantasy%20art",
    description: "The crow god rises."
  },
  {
    id: "jade-city",
    title: "Jade City",
    genre: "Wuxia Fantasy",
    cover: "Jade%20magic%20gangsters%20Asia%20inspired%20noir%20family%20war%20fantasy%20art",
    description: "Jade is power."
  },
  {
    id: "rage-dragons",
    title: "The Rage of Dragons",
    genre: "African Fantasy",
    cover: "Dragons%20war%20queen%20power%20African%20inspired%20military%20fantasy%20art",
    description: "A queen's rage."
  },
  {
    id: "fifth-season",
    title: "The Fifth Season",
    genre: "Science Fantasy",
    cover: "Apocalypse%20orogenes%20stone%20eaters%20broken%20continent%20NK%20Jemisin%20art",
    description: "The world ends again."
  },
  {
    id: "hundred-kingdoms",
    title: "A Hundred Thousand Kingdoms",
    genre: "Fantasy Romance",
    cover: "Gods%20enslaved%20mortal%20heir%20sky%20palace%20political%20fantasy%20romance%20art",
    description: "Gods made mortal."
  },
  {
    id: "goblin-emperor",
    title: "The Goblin Emperor",
    genre: "Court Intrigue",
    cover: "Goblin%20half-goblin%20emperor%20court%20intrigue%20airship%20steampunk%20fantasy%20art",
    description: "An unexpected emperor."
  },
  {
    id: "kessem-algorithm",
    title: "The Kessem Algorithm",
    genre: "Techno Thriller",
    cover: "Algorithm%20predicts%20death%20Israeli%20thriller%20conspiracy%20techno%20thriller%20art",
    description: "Numbers don't lie."
  },
  {
    id: "terminal-list",
    title: "The Terminal List",
    genre: "Military Thriller",
    cover: "Navy%20SEAL%20revenge%20conspiracy%20government%20betrayal%20military%20thriller%20art",
    description: "Revenge is a mission."
  },
  {
    id: "maidens",
    title: "The Maidens",
    genre: "Psychological Thriller",
    cover: "Cambridge%20University%20secret%20society%20murder%20Greek%20mythology%20thriller%20art",
    description: "A secret society of maidens."
  },
  {
    id: "chain",
    title: "The Chain",
    genre: "Crime Thriller",
    cover: "Kidnapping%20chain%20mothers%20must%20kidnap%20psychological%20thriller%20art",
    description: "Break the chain."
  },
  {
    id: "wife-between-us",
    title: "The Wife Between Us",
    genre: "Psychological Thriller",
    cover: "Ex-wife%20new%20wife%20obsession%20marriage%20secrets%20psychological%20thriller%20art",
    description: "The wife is never who you think."
  },
  {
    id: "anxious-people",
    title: "Anxious People",
    genre: "Contemporary Fiction",
    cover: "Bank%20robbery%20hostages%20apartment%20viewing%20comedy%20drama%20contemporary%20art",
    description: "An unlikely group of hostages."
  },
  {
    id: "midnight-library",
    title: "The Midnight Library",
    genre: "Contemporary Fantasy",
    cover: "Library%20between%20life%20death%20infinite%20books%20regrets%20choices%20philosophical%20art",
    description: "Every book is a different life."
  },
  {
    id: "crawdads-sing",
    title: "Where the Crawdads Sing",
    genre: "Literary Mystery",
    cover: "Marsh%20girl%20murder%20investigation%20nature%20solitude%20coming%20of%20age%20art",
    description: "The marsh girl holds secrets."
  },
  {
    id: "vanishing-half",
    title: "The Vanishing Half",
    genre: "Historical Fiction",
    cover: "Twin%20sisters%20black%20family%20passing%20white%20Jim%20Crow%20identity%20art",
    description: "Twin sisters take different paths."
  },
  {
    id: "giver-stars",
    title: "The Giver of Stars",
    genre: "Historical Fiction",
    cover: "Packhorse%20librarians%20Depression%20era%20Kentucky%20women%20friendship%20art",
    description: "Women delivering books on horseback."
  },
  {
    id: "educated",
    title: "Educated",
    genre: "Memoir",
    cover: "Survivalist%20family%20Idaho%20self-education%20PhD%20transformation%20memoir%20art",
    description: "Education transforms."
  },
  {
    id: "becoming",
    title: "Becoming",
    genre: "Memoir",
    cover: "Michelle%20Obama%20First%20Lady%20memoir%20inspiration%20leadership%20biography%20art",
    description: "The story of Michelle Obama."
  },
  {
    id: "born-crime",
    title: "Born a Crime",
    genre: "Memoir",
    cover: "Trevor%20Noah%20South%20Africa%20apartheid%20mixed%20race%20comedy%20memoir%20art",
    description: "Stories from a South African childhood."
  }
];

// Verify count
console.log('Total books:', booksDatabase.length);

// Make available globally
if (typeof window !== 'undefined') {
  window.booksDatabase = booksDatabase;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = booksDatabase;
}