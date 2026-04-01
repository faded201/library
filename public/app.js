// Audiobook Series Data
const audiobookSeries = {
    "Quinn Talen Vampire System": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "My Dragonic System": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Birth of a Demonic Sword": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Legendary Beast Tamer": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Gods Eye": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Dragon Inside Me": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Shadow Blade": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Dragons Revenge": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    // More series can be added here
};

// UI Variables
let currentSeries = null;
let isPlaying = false;

// Function to play/pause audiobook
function togglePlayPause(series) {
    if (currentSeries !== series) {
        currentSeries = series;
        // Initialize player with selected series
        console.log(`Playing: ${series}`);
        isPlaying = true;
    } else {
        isPlaying = !isPlaying;
    }
    console.log(isPlaying ? "Playing..." : "Paused...");
    // Implement playback animation
}

// XP Tracking Logic
function updateXP(series) {
    audiobookSeries[series].currentXP += 10; // Example XP increment
    // Check for ability unlock
    if (audiobookSeries[series].currentXP > 50) {
        unlockAbility(series);
    }
}

function unlockAbility(series) {
    audiobookSeries[series].abilitiesUnlocked.push(`New Ability for ${series}`);
    console.log(`Ability unlocked for ${series}`);
}

// Storyline integration could be added here
// Event listeners for player controls can be implemented here
