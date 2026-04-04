interface UserProgress {
  xp: number;
  level: number;
  abilities: string[];
  unlockedSeries: string[];
  achievements: string[];
}

interface ProgressResponse {
  xp: number;
  level: number;
  abilities: string[];
  unlockedSeries: string[];
  achievements: string[];
  xpToNext: number;
  levelProgress: number;
}

// In production, this would be stored in a database
let userProgress: UserProgress = {
  xp: 0,
  level: 1,
  abilities: [],
  unlockedSeries: ["vampire-system"],
  achievements: []
};

const xpPerLevel = 100;
const abilitiesByLevel = {
  5: "Shadow Step",
  10: "Blood Manipulation", 
  15: "Void Sense",
  20: "Life Drain",
  25: "Draconic Shift",
  30: "Celestial Devour"
};

export default function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { xpGained = 50, seriesUnlocked } = req.body;
    
    // Add XP
    userProgress.xp += xpGained;
    
    // Calculate level
    const newLevel = Math.floor(userProgress.xp / xpPerLevel) + 1;
    const levelUp = newLevel > userProgress.level;
    userProgress.level = newLevel;
    
    // Unlock abilities at certain levels
    if (abilitiesByLevel[userProgress.level as keyof typeof abilitiesByLevel]) {
      const newAbility = abilitiesByLevel[userProgress.level as keyof typeof abilitiesByLevel];
      if (!userProgress.abilities.includes(newAbility)) {
        userProgress.abilities.push(newAbility);
      }
    }
    
    // Unlock new series
    if (seriesUnlocked && !userProgress.unlockedSeries.includes(seriesUnlocked)) {
      userProgress.unlockedSeries.push(seriesUnlocked);
    }
    
    // Check for achievements
    if (levelUp) {
      userProgress.achievements.push(`Level ${userProgress.level} Reached`);
    }
    
    const response: ProgressResponse = {
      ...userProgress,
      xpToNext: (userProgress.level * xpPerLevel) - userProgress.xp,
      levelProgress: ((userProgress.xp % xpPerLevel) / xpPerLevel) * 100
    };

    res.status(200).json(response);
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ error: 'Failed to update progress' });
  }
}
