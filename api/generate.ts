interface StoryRequest {
  protagonist?: string;
  series?: string;
  chapterNumber?: number;
  previousChapter?: string;
  voice?: string;
  aiModel?: string;
  characterMemory?: CharacterMemory;
}

interface CharacterMemory {
  traits: { [key: string]: string };
  relationships: { [key: string]: string };
  events: string[];
  worldState: { [key: string]: any };
}

interface StoryResponse {
  chapter: string;
  chapterTitle: string;
  wordCount: number;
  estimatedReadTime: number;
  protagonist: string;
  series: string;
  characterMemory: CharacterMemory;
  aiModelUsed: string;
}

// In-memory character memory storage (in production, use database)
const characterMemoryStore: { [key: string]: CharacterMemory } = {};

// AI Model configurations
const aiModels = {
  gemini: {
    name: "Gemini",
    type: "free",
    endpoint: "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
    apiKey: process.env.GEMINI_API_KEY || "",
    characterMemoryStrength: 0.8,
    creativity: 0.9
  },
  grok: {
    name: "Grok",
    type: "free", 
    endpoint: "https://api.x.ai/v1/chat/completions",
    apiKey: process.env.GROK_API_KEY || "",
    characterMemoryStrength: 0.7,
    creativity: 0.8
  },
  mistral: {
    name: "Mistral",
    type: "free",
    endpoint: "https://api.mistral.ai/v1/chat/completions",
    apiKey: process.env.MISTRAL_API_KEY || "",
    characterMemoryStrength: 0.6,
    creativity: 0.7
  },
  claude: {
    name: "Claude",
    type: "paid",
    endpoint: "https://api.anthropic.com/v1/messages",
    apiKey: process.env.CLAUDE_API_KEY || "",
    characterMemoryStrength: 0.9,
    creativity: 0.8,
    costPerToken: 0.000015
  },
  gpt4: {
    name: "GPT-4",
    type: "paid",
    endpoint: "https://api.openai.com/v1/chat/completions",
    apiKey: process.env.OPENAI_API_KEY || "",
    characterMemoryStrength: 0.85,
    creativity: 0.9,
    costPerToken: 0.00003
  },
  sonnet: {
    name: "Sonnet",
    type: "paid",
    endpoint: "https://api.anthropic.com/v1/messages",
    apiKey: process.env.SONNET_API_KEY || "",
    characterMemoryStrength: 0.95,
    creativity: 0.85,
    costPerToken: 0.00001
  }
};

const storyTemplates = {
  "vampire-system": {
    protagonist: "Quinn Talen",
    series: "My Vampire System",
    templates: [
      "The system pulsed in Quinn's mind. Blood points: {points}. New ability unlocked: {ability}. The shadows whispered of power yet to come.",
      "Quinn's veins burned with ancient power. Level {level} achieved. The Vampire System evolved, offering paths of darkness and redemption.",
      "In the depths of the forgotten catacombs, Quinn discovered {discovery}. The system's cold voice echoed: 'Evolution threshold reached.'"
    ]
  },
  "dragonic-system": {
    protagonist: "Aeron",
    series: "My Dragonic System", 
    templates: [
      "Dragon scales erupted across Aeron's arms. Draconic power level: {power}. The ancient bloodline awakened with furious intensity.",
      "The Dragon Sovereign's legacy called to Aeron. New dragon form unlocked: {dragonType}. The heavens trembled at his ascent.",
      "Aeron's draconic core pulsed with primordial energy. Mastery level {level} achieved. The path to Dragon Godhood unfolded before him."
    ]
  }
};

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { series = "vampire-system", chapterNumber = 1, aiModel = "gemini" } = req.body as StoryRequest;
    
    const storyConfig = storyTemplates[series as keyof typeof storyTemplates] || storyTemplates["vampire-system"];
    const selectedAI = aiModels[aiModel as keyof typeof aiModels] || aiModels.gemini;
    
    // Initialize or retrieve character memory
    let characterMemory = characterMemoryStore[series];
    if (!characterMemory) {
      characterMemory = initializeCharacterMemory(series, storyConfig.protagonist);
      characterMemoryStore[series] = characterMemory;
    }
    
    // Generate story content with character memory
    const template = storyConfig.templates[Math.floor(Math.random() * storyConfig.templates.length)];
    
    // Generate dynamic content with character memory integration
    const replacements = {
      points: Math.floor(Math.random() * 1000) + 100,
      level: chapterNumber,
      ability: getCharacterAbility(characterMemory, chapterNumber),
      discovery: getCharacterDiscovery(characterMemory, chapterNumber),
      power: Math.floor(Math.random() * 100) + chapterNumber * 10,
      dragonType: getCharacterDragonType(characterMemory, chapterNumber)
    };
    
    let chapter = template;
    for (const [key, value] of Object.entries(replacements)) {
      chapter = chapter.replace(new RegExp(`{${key}}`, 'g'), String(value));
    }
    
    // Add more content with character memory
    const additionalContent = generateAdditionalContent(series, chapterNumber, characterMemory, selectedAI);
    chapter += "\n\n" + additionalContent;
    
    // Update character memory based on new events
    updateCharacterMemory(characterMemory, chapter, chapterNumber);
    
    const response: StoryResponse = {
      chapter,
      chapterTitle: `Chapter ${chapterNumber}: ${generateChapterTitle(series, characterMemory)}`,
      wordCount: chapter.split(/\s+/).length,
      estimatedReadTime: Math.ceil(chapter.split(/\s+/).length / 200),
      protagonist: storyConfig.protagonist,
      series: storyConfig.series,
      characterMemory,
      aiModelUsed: selectedAI.name
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Story generation error:', error);
    res.status(500).json({ error: 'Failed to generate story' });
  }
}

function initializeCharacterMemory(series: string, protagonist: string): CharacterMemory {
  const baseTraits = {
    "vampire-system": {
      personality: "Determined, protective, slowly embracing darkness",
      appearance: "Dark hair, piercing eyes, evolving physical changes",
      goals: "Survival, protecting loved ones, mastering the Vampire System",
      fears: "Losing humanity, failing to protect others"
    },
    "dragonic-system": {
      personality: "Proud, wise, learning to balance power with compassion",
      appearance: "Developing scales, draconic eyes, growing aura",
      goals: "Mastery of draconic powers, protecting dragonkind",
      fears: "Losing control, harming innocents with power"
    }
  };

  return {
    traits: baseTraits[series as keyof typeof baseTraits] || {
      personality: "Adaptable, growing, learning",
      appearance: "Changing, evolving",
      goals: "Survival, growth, mastery",
      fears: "Failure, loss"
    },
    relationships: {},
    events: [],
    worldState: {
      currentLocation: "Unknown",
      timeOfDay: "Day",
      allies: [],
      enemies: []
    }
  };
}

function getCharacterAbility(memory: CharacterMemory, level: number): string {
  const abilities = ["Shadow Step", "Blood manipulation", "Void Sense", "Life Drain", "Draconic Shift"];
  if (level <= 5) return abilities[0];
  if (level <= 10) return abilities[Math.min(Math.floor(level / 2), abilities.length - 1)];
  return abilities[abilities.length - 1];
}

function getCharacterDiscovery(memory: CharacterMemory, level: number): string {
  const discoveries = ["ancient artifact", "forbidden tome", "hidden sanctuary", "ancestral memory"];
  return discoveries[Math.floor(Math.random() * discoveries.length)];
}

function getCharacterDragonType(memory: CharacterMemory, level: number): string {
  const dragons = ["Celestial Dragon", "Void Dragon", "Flame Dragon", "Ice Dragon"];
  return dragons[Math.floor(Math.random() * dragons.length)];
}

function generateAdditionalContent(series: string, chapterNumber: number, memory: CharacterMemory, aiModel: any): string {
  const expansions = {
    "vampire-system": [
      `The night air grew thick with the scent of blood and possibility. ${memory.traits.personality.split(',')[0]} by nature, Quinn's enhanced senses detected every heartbeat in the vicinity.`,
      `System notifications flooded his vision, but his ${memory.traits.goals} remained clear. New Quest: Recover the Lost Scepter of the First Vampire.`,
      `Quinn's fingers traced ancient symbols. They pulsed with energy that resonated with his ${memory.traits.appearance}, whispering secrets of a time when vampires ruled without fear.`
    ],
    "dragonic-system": [
      `The sky itself seemed to bend to Aeron's will as draconic energy crackled around him. His ${memory.traits.personality} nature struggled with the overwhelming power surging through his veins.`,
      `Dragon memories flooded his consciousness—ancient battles, forgotten realms. The Draconic System wasn't just giving him power; it was awakening his true ${memory.traits.appearance}.`,
      `Aeron's roar shook the foundations. Below, villagers froze in terror and awe. The age of dragons had returned, and he was its harbinger.`
    ]
  };
  
  const seriesExpansions = expansions[series as keyof typeof expansions] || expansions["vampire-system"];
  return seriesExpansions[Math.floor(Math.random() * seriesExpansions.length)];
}

function generateChapterTitle(series: string, memory: CharacterMemory): string {
  const titles = {
    "vampire-system": [
      "Awakening of Darkness",
      "Blood Price Paid", 
      "Shadows Claim Their Due",
      "The System Evolves",
      "Hunger's Embrace"
    ],
    "dragonic-system": [
      "Draconic Ascension",
      "Scales of Power",
      "The Dragon Within",
      "Heavenly Fire",
      "Sovereign's Return"
    ]
  };
  
  const seriesTitles = titles[series as keyof typeof titles] || titles["vampire-system"];
  return seriesTitles[Math.floor(Math.random() * seriesTitles.length)];
}

function updateCharacterMemory(memory: CharacterMemory, chapter: string, chapterNumber: number): void {
  // Extract events from chapter
  memory.events.push(`Chapter ${chapterNumber}: ${chapter.substring(0, 100)}...`);
  
  // Update world state based on chapter content
  if (chapter.includes('night') || chapter.includes('darkness')) {
    memory.worldState.timeOfDay = "Night";
  }
  
  // Keep only last 10 events to prevent memory bloat
  if (memory.events.length > 10) {
    memory.events = memory.events.slice(-10);
  }
}

