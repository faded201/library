/**
 * XAVIER OS - EXPAND BOOK BIBLES TO ALL 212 BOOKS
 * 
 * This script reads books-database.js and generates comprehensive bibles
 * for all 212 books, then exports a complete BOOK_BIBLES object
 * 
 * Usage in server.js:
 * import { BOOK_BIBLES } from './complete-bibles-all-212.js'
 * const bible = BOOK_BIBLES[bookId];
 */

import { generateBibleFromTitle, GENRE_TEMPLATES } from './book-bibles-generator.js';
import booksDatabase from './books-database.js';

// Simple genre-to-template mapping
const genreMap = {
  'LitRPG': 'litrpg',
  'Dark Fantasy': 'dark-fantasy',
  'Draconic Evolution': 'dragon-evolution',
  'Weapon Evolution': 'weapon-evolution',
  'Monster Collection': 'monster-collection',
  'Celestial Heist': 'heist-fantasy',
  'Techno Cultivation': 'sci-fi',
  'Tower Climbing': 'progression-fantasy',
  'Portal Fantasy': 'epic-fantasy',
  'Meta Fiction': 'fantasy-mystery',
  'VRMMO': 'progression-fantasy',
  'Dungeon': 'dark-fantasy',
  'Shadow Hunter': 'dark-fantasy',
  'Regression': 'progression-fantasy',
  'Mystery': 'fantasy-mystery',
  'Steampunk Fantasy': 'sci-fi',
  'Tower Farming': 'progression-fantasy',
  'Wuxia': 'wuxia',
  'Cultivation': 'cultivation',
  'Space Opera': 'space-opera',
  'Reincarnation': 'reincarnation',
  'Martial Arts': 'martial-arts',
  'Epic Fantasy': 'epic-fantasy',
  'Urban Fantasy': 'fantasy-mystery',
  'Action': 'dark-fantasy',
  'Adventure': 'epic-fantasy',
  'Supernatural': 'fantasy-mystery',
  'Magic': 'epic-fantasy',
  'System': 'litrpg'
};

/**
 * Converts genre string to applicable template key
 */
function normalizeGenre(genreStr) {
  if (!genreStr) return 'epic-fantasy'; // default
  
  // Check direct match first
  if (genreMap[genreStr]) return genreMap[genreStr];
  
  // Check partial match
  for (const [genre, template] of Object.entries(genreMap)) {
    if (genreStr.toLowerCase().includes(genre.toLowerCase())) {
      return template;
    }
  }
  
  // Default based on first keyword
  const firstWord = genreStr.split(' ')[0].toLowerCase();
  const keywords = {
    'demon': 'dark-fantasy',
    'god': 'epic-fantasy',
    'dragon': 'dragon-evolution',
    'shadow': 'dark-fantasy',
    'light': 'epic-fantasy',
    'king': 'epic-fantasy',
    'queen': 'epic-fantasy',
    'magic': 'epic-fantasy',
    'sword': 'weapon-evolution',
    'system': 'litrpg',
    'tower': 'progression-fantasy',
    'gate': 'progression-fantasy',
    'monster': 'monster-collection',
    'beast': 'monster-collection',
    'void': 'dark-fantasy',
    'chaos': 'dark-fantasy'
  };
  
  for (const [keyword, template] of Object.entries(keywords)) {
    if (firstWord.includes(keyword)) return template;
  }
  
  return 'epic-fantasy'; // ultimate default
}

/**
 * Main function: generate bibles for all books
 */
export function expandBiblesToAll212Books() {
  console.log(`\n📚 EXPANDING BOOK BIBLES TO ALL 212 BOOKS\n${'='.repeat(60)}`);
  
  const BOOK_BIBLES = {};
  let count = 0;
  
  for (const book of booksDatabase) {
    const { id, title, genre, description } = book;
    const templateType = normalizeGenre(genre);
    
    // Generate Bible for this book
    BOOK_BIBLES[id] = generateBibleFromTitle(
      id,
      title,
      genre,
      description || `${title}: A thrilling tale of adventure and power.`
    );
    
    count++;
    
    // Progress indicator every 20 books
    if (count % 20 === 0) {
      console.log(`✅ Generated ${count} bibles...`);
    }
  }
  
  console.log(`\n✅ SUCCESS! Generated ${count} complete book bibles`);
  console.log(`   All bibles ready for infinite story generation\n`);
  
  return BOOK_BIBLES;
}

/**
 * Generate the JavaScript code that will be written to complete-bibles-all-212.js
 */
export function generateBiblesExportCode() {
  const BOOK_BIBLES = expandBiblesToAll212Books();
  
  // Format as JavaScript object export
  let exportCode = `/**
 * XAVIER OS - COMPLETE BOOK BIBLES FOR ALL 212 BOOKS
 * 
 * This file contains comprehensive bibles for all 212 books in the Aetheria library.
 * Each bible includes:
 * - World information (setting, power systems, factions)
 * - Character profiles (protagonists, key characters)
 * - Plot structure (main arcs, key events, conflicts)
 * - Society hierarchy (power structures, politics)
 * - Narrative style (tone, themes, writing tips)
 * 
 * Generated automatically from book-bibles-generator.js
 * DO NOT EDIT MANUALLY - regenerate using expand-bibles-to-all-212-books.js
 */

export const BOOK_BIBLES = ${JSON.stringify(BOOK_BIBLES, null, 2)};

/**
 * Get a complete Bible for any book in the system
 * Returns null if book not found
 */
export function getBookBible(bookId) {
  return BOOK_BIBLES[bookId] || null;
}

/**
 * Get information about Bible completion
 */
export function getBibleStatus() {
  const totalBooks = Object.keys(BOOK_BIBLES).length;
  return {
    totalBooks,
    status: 'COMPLETE - Ready for infinite story generation',
    completionPercentage: '100%',
    capacity: {
      storiesPerDayPerBook: 10,
      totalStoriesPerDay: totalBooks * 10,
      totalStoriesPerYear: (totalBooks * 10 * 365)
    }
  };
}

export default { BOOK_BIBLES, getBookBible, getBibleStatus };
`;
  
  return exportCode;
}

/**
 * Write the complete bibles to a file
 */
export async function writeCompleteBiblesToFile(filePath) {
  const code = generateBiblesExportCode();
  
  try {
    // Using Node.js file system (adjust if running in browser)
    const fs = await import('fs').then(m => m.promises);
    await fs.writeFile(filePath, code, 'utf-8');
    console.log(`✅ Wrote complete bibles to ${filePath}`);
    return true;
  } catch (error) {
    console.error(`❌ Error writing file: ${error.message}`);
    return false;
  }
}

/**
 * Print statistics about the generated bibles
 */
export function printBibleStatistics(BOOK_BIBLES) {
  console.log(`\n📊 BIBLE STATISTICS\n${'='.repeat(60)}`);
  
  const totalBooks = Object.keys(BOOK_BIBLES).length;
  const genres = {};
  const themes = new Set();
  
  for (const [id, bible] of Object.entries(BOOK_BIBLES)) {
    const genre = bible.genre || 'Unknown';
    genres[genre] = (genres[genre] || 0) + 1;
    
    if (bible.narrativeStyle?.themes) {
      bible.narrativeStyle.themes.forEach(t => themes.add(t));
    }
  }
  
  console.log(`Total Books with Bibles: ${totalBooks}`);
  console.log(`\nGenres Distribution:`);
  Object.entries(genres)
    .sort((a, b) => b[1] - a[1])
    .forEach(([genre, count]) => {
      console.log(`  ${genre}: ${count} books`);
    });
  
  console.log(`\nCommon Themes: ${Array.from(themes).slice(0, 10).join(', ')}`);
  
  console.log(`\n📈 Generation Capacity:`);
  console.log(`  Stories per book per day: 10`);
  console.log(`  Total stories per day: ${totalBooks * 10}`);
  console.log(`  Total stories per year: ${(totalBooks * 10 * 365).toLocaleString()}`);
  
  console.log(`\n${'='.repeat(60)}\n`);
}

// ==================== EXECUTION ====================

// If running directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log(`Starting Bible Expansion Process...\n`);
  
  const BOOK_BIBLES = expandBiblesToAll212Books();
  printBibleStatistics(BOOK_BIBLES);
  
  console.log(`\n💡 Next Steps:`);
  console.log(`1. Call writeCompleteBiblesToFile() to save all bibles`);
  console.log(`2. Import BOOK_BIBLES in server.js`);
  console.log(`3. Use getBookBible(bookId) to retrieve any bible`);
  console.log(`4. Pass bible to generateStoryFromBible() for infinite stories\n`);
}

export default {
  expandBiblesToAll212Books,
  generateBiblesExportCode,
  writeCompleteBiblesToFile,
  printBibleStatistics
};
