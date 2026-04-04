/**
 * AETHERIA.AI - Main Application Script  
 * 23-MINUTE EPISODE FORMAT with AUDIOBOOK-CREATOR VOICE SYSTEM
 * Integrated with Kokoro & Orpheus TTS from audiobook-creator
 */

// API Keys storage
const API_KEYS = {
  gemini: localStorage.getItem('gemini_api_key') || '',
  grok: localStorage.getItem('grok_api_key') || '',
  mistral: localStorage.getItem('mistral_api_key') || '',
  claude: localStorage.getItem('claude_api_key') || '',
  gpt4: localStorage.getItem('gpt4_api_key') || '',
  sonnet: localStorage.getItem('sonnet_api_key') || '',
  // Audiobook-Creator TTS Configuration
  ttsBaseUrl: localStorage.getItem('tts_base_url') || 'http://localhost:8880/v1',
  ttsApiKey: localStorage.getItem('tts_api_key') || 'not-needed',
  // TTS.ai Cloud API
  ttsaiApiKey: localStorage.getItem('ttsai_api_key') || ''
};

// TTS Engine Configuration (from audiobook-creator)
const TTS_CONFIG = {
  engine: localStorage.getItem('tts_engine') || 'kokoro', // 'kokoro', 'orpheus', or 'ttsai'
  model: 'kokoro',
  narratorGender: localStorage.getItem('narrator_gender') || 'male',
  multiVoiceMode: localStorage.getItem('multi_voice_mode') === 'true',
  maxParallelRequests: 1
};

// Voice Mapping from audiobook-creator/static_files/voice_map.json
const VOICE_MAP = {
  kokoro: {
    male_narrator: "am_puck",
    male_dialogue: "af_alloy+am_puck",
    female_narrator: "af_heart",
    female_dialogue: "af_sky",
    male_score_map: {
      0: "am_puck", 1: "am_onyx", 2: "am_michael", 3: "am_echo",
      4: "am_fenrir+bf_alice", 5: "af_alloy+am_puck", 6: "af_kore",
      7: "af_sky", 8: "af_aoede+af_heart", 9: "af_sarah", 10: "af_bella"
    },
    female_score_map: {
      0: "af_heart", 1: "am_onyx", 2: "am_echo", 3: "am_puck",
      4: "am_fenrir+bf_alice", 5: "af_alloy+am_puck", 6: "af_kore",
      7: "af_sky", 8: "af_aoede+af_heart", 9: "af_sarah", 10: "af_bella"
    }
  },
  orpheus: {
    male_narrator: "zac",
    male_dialogue: "dan",
    female_narrator: "tara",
    female_dialogue: "leah",
    male_score_map: {
      0: "zac", 1: "leo", 2: "dan", 3: "dan", 4: "zac",
      5: "zoe", 6: "jess", 7: "tara", 8: "tara", 9: "leah", 10: "mia"
    },
    female_score_map: {
      0: "tara", 1: "leo", 2: "dan", 3: "zac", 4: "zac",
      5: "zoe", 6: "jess", 7: "jess", 8: "leah", 9: "leah", 10: "mia"
    }
  },
  ttsai: {
    male_narrator: "michael",
    male_dialogue: "michael",
    female_narrator: "emma",
    female_dialogue: "bella",
    male_score_map: {
      0: "michael", 1: "michael", 2: "michael", 3: "michael",
      4: "michael", 5: "michael", 6: "michael",
      7: "emma", 8: "bella", 9: "bella", 10: "bella"
    },
    female_score_map: {
      0: "emma", 1: "bella", 2: "bella", 3: "michael",
      4: "michael", 5: "emma", 6: "bella",
      7: "bella", 8: "emma", 9: "bella", 10: "bella"
    }
  }
};

// 23-Minute Episode Constants
const EPISODE_DURATION_MINUTES = 23;
const WORDS_PER_MINUTE = 200;
const TARGET_WORD_COUNT = EPISODE_DURATION_MINUTES * WORDS_PER_MINUTE;
const ESTIMATED_READ_TIME = `${EPISODE_DURATION_MINUTES}:00`;

// State
let currentGenre = 'all';
let selectedAI = localStorage.getItem('selected_ai') || 'gemini';
let activeBook = null;
let currentEpisode = 1;
let isGenerating = false;

// DOM Elements
let booksGrid;
let aiModelSelect;
let audiovisualPlayer;
let apiSettingsPanel = null;

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  booksGrid = document.getElementById('booksGrid');
  aiModelSelect = document.getElementById('aiModelSelect');
  audiovisualPlayer = document.getElementById('audiovisualPlayer');

  if (!booksGrid) {
    console.error('Books grid not found');
    return;
  }

  if (aiModelSelect) {
    aiModelSelect.value = selectedAI;
    aiModelSelect.addEventListener('change', (e) => {
      selectedAI = e.target.value;
      localStorage.setItem('selected_ai', selectedAI);
    });
  }

  setupGenreFilters();
  addAPISettingsButton();
  renderBooks();

  console.log(`AETHERIA initialized with ${TTS_CONFIG.engine} TTS - Episode format: ${EPISODE_DURATION_MINUTES} minutes`);
}

function setupGenreFilters() {
  const genreButtons = document.querySelectorAll('.genre-btn');
  genreButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      genreButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGenre = btn.dataset.genre;
      renderBooks();
    });
  });
}

function addAPISettingsButton() {
  const header = document.querySelector('.main-header');
  if (!header) return;

  const settingsBtn = document.createElement('button');
  settingsBtn.className = 'api-settings-btn';
  settingsBtn.innerHTML = '⚙️ API Keys & Voices';
  settingsBtn.onclick = toggleAPISettings;

  const logoSection = header.querySelector('.logo-section');
  if (logoSection) {
    logoSection.appendChild(settingsBtn);
  }

  createAPISettingsPanel();
}

function createAPISettingsPanel() {
  apiSettingsPanel = document.createElement('div');
  apiSettingsPanel.id = 'apiSettingsPanel';
  apiSettingsPanel.className = 'api-settings-panel hidden';

  apiSettingsPanel.innerHTML = `
    <div class="api-panel-backdrop" onclick="toggleAPISettings()"></div>
    <div class="api-panel-content">
      <h3>🔑 API Configuration & Voice Settings</h3>
      <p class="api-panel-desc">Enter your API keys and configure TTS voices from audiobook-creator</p>
      
      <div class="api-key-section">
        <h4>AI Story Generation Models</h4>
        <div class="api-input-group">
          <label>Gemini API Key (Free)</label>
          <input type="password" id="geminiKey" placeholder="Enter Gemini API key" value="${API_KEYS.gemini}">
          <a href="https://makersuite.google.com/app/apikey" target="_blank">Get Key →</a>
        </div>
        <div class="api-input-group">
          <label>Grok API Key (Free)</label>
          <input type="password" id="grokKey" placeholder="Enter Grok API key" value="${API_KEYS.grok}">
          <a href="https://x.ai" target="_blank">Get Key →</a>
        </div>
        <div class="api-input-group">
          <label>Mistral API Key (Free)</label>
          <input type="password" id="mistralKey" placeholder="Enter Mistral API key" value="${API_KEYS.mistral}">
          <a href="https://console.mistral.ai" target="_blank">Get Key →</a>
        </div>
        <div class="api-input-group">
          <label>Claude API Key (Paid)</label>
          <input type="password" id="claudeKey" placeholder="Enter Claude API key" value="${API_KEYS.claude}">
          <a href="https://console.anthropic.com" target="_blank">Get Key →</a>
        </div>
        <div class="api-input-group">
          <label>OpenAI API Key (Paid)</label>
          <input type="password" id="gpt4Key" placeholder="Enter OpenAI API key" value="${API_KEYS.gpt4}">
          <a href="https://platform.openai.com" target="_blank">Get Key →</a>
        </div>
      </div>

      <div class="api-key-section">
        <h4>🎙️ TTS Voice Configuration (from audiobook-creator)</h4>
        <div class="api-input-group">
          <label>TTS Base URL</label>
          <input type="text" id="ttsBaseUrl" placeholder="http://localhost:8880/v1" value="${API_KEYS.ttsBaseUrl}">
          <small>Kokoro/Orpheus TTS server endpoint</small>
        </div>
        <div class="api-input-group">
          <label>TTS API Key</label>
          <input type="password" id="ttsApiKey" placeholder="not-needed" value="${API_KEYS.ttsApiKey}">
        </div>
        <div class="api-input-group">
          <label>TTS.ai API Key (for cloud voices)</label>
          <input type="password" id="ttsaiApiKey" placeholder="Enter TTS.ai API key" value="${API_KEYS.ttsaiApiKey}">
          <a href="https://tts.ai" target="_blank">Get Key at TTS.ai →</a>
        </div>
        <div class="api-input-group">
          <label>TTS Engine</label>
          <select id="ttsEngine">
            <option value="kokoro" ${TTS_CONFIG.engine === 'kokoro' ? 'selected' : ''}>Kokoro (Recommended)</option>
            <option value="orpheus" ${TTS_CONFIG.engine === 'orpheus' ? 'selected' : ''}>Orpheus</option>
            <option value="ttsai" ${TTS_CONFIG.engine === 'ttsai' ? 'selected' : ''}>TTS.ai (Michael, Emma, Bella)</option>
          </select>
        </div>
        <div class="api-input-group">
          <label>Narrator Gender</label>
          <select id="narratorGender">
            <option value="male" ${TTS_CONFIG.narratorGender === 'male' ? 'selected' : ''}>Male</option>
            <option value="female" ${TTS_CONFIG.narratorGender === 'female' ? 'selected' : ''}>Female</option>
          </select>
        </div>
        <div class="api-input-group">
          <label>Multi-Voice Mode (Characters get different voices)</label>
          <input type="checkbox" id="multiVoiceMode" ${TTS_CONFIG.multiVoiceMode ? 'checked' : ''}>
        </div>
        <div class="voice-info">
          <p><strong>Available Voices:</strong></p>
          <ul>
            <li><strong>Kokoro:</strong> am_puck, am_onyx, af_heart, af_sky, af_bella, af_sarah, am_echo, am_michael, af_kore, af_alloy</li>
            <li><strong>Orpheus:</strong> zac, tara, dan, leah, leo, zoe, jess, mia</li>
            <li><strong>TTS.ai:</strong> michael (epic narrator), emma (literary), bella (soothing)</li>
          </ul>
          <p class="voice-setup-hint">💡 <a href="https://github.com/remsky/Kokoro-FastAPI" target="_blank">Setup Kokoro TTS locally</a> or use <a href="https://tts.ai" target="_blank">TTS.ai cloud API</a></p>
        </div>
      </div>

      <div class="api-panel-actions">
        <button class="save-btn" onclick="saveAPIKeys()">Save Configuration</button>
        <button class="close-btn" onclick="toggleAPISettings()">Close</button>
      </div>
    </div>
  `;

  document.body.appendChild(apiSettingsPanel);
}

function toggleAPISettings() {
  if (!apiSettingsPanel) return;
  apiSettingsPanel.classList.toggle('hidden');
}

function saveAPIKeys() {
  // Save AI API keys
  API_KEYS.gemini = document.getElementById('geminiKey').value;
  API_KEYS.grok = document.getElementById('grokKey').value;
  API_KEYS.mistral = document.getElementById('mistralKey').value;
  API_KEYS.claude = document.getElementById('claudeKey').value;
  API_KEYS.gpt4 = document.getElementById('gpt4Key').value;
  API_KEYS.ttsBaseUrl = document.getElementById('ttsBaseUrl').value;
  API_KEYS.ttsApiKey = document.getElementById('ttsApiKey').value;
  API_KEYS.ttsaiApiKey = document.getElementById('ttsaiApiKey').value;

  // Save TTS config
  TTS_CONFIG.engine = document.getElementById('ttsEngine').value;
  TTS_CONFIG.narratorGender = document.getElementById('narratorGender').value;
  TTS_CONFIG.multiVoiceMode = document.getElementById('multiVoiceMode').checked;

  // Persist to localStorage
  Object.keys(API_KEYS).forEach(key => {
    localStorage.setItem(key, API_KEYS[key]);
  });
  localStorage.setItem('tts_engine', TTS_CONFIG.engine);
  localStorage.setItem('narrator_gender', TTS_CONFIG.narratorGender);
  localStorage.setItem('multi_voice_mode', TTS_CONFIG.multiVoiceMode);

  alert('API keys and voice configuration saved!');
  toggleAPISettings();
}

async function renderBooks() {
  if (!booksGrid || typeof booksDatabase === 'undefined') {
    console.error('Books database not loaded or grid not found');
    return;
  }

  booksGrid.innerHTML = '';

  const filteredBooks = currentGenre === 'all' 
    ? booksDatabase 
    : booksDatabase.filter(book => {
        const genre = book.genre?.toLowerCase() || '';
        const searchGenre = currentGenre.toLowerCase();
        
        const genreMap = {
          'fantasy': ['fantasy', 'dark fantasy', 'epic fantasy', 'magic', 'portal fantasy'],
          'sci-fi': ['sci-fi', 'scifi', 'science fiction', 'space', 'cyberpunk', 'dystopian'],
          'mystery': ['mystery', 'thriller', 'crime', 'detective', 'noir'],
          'romance': ['romance', 'paranormal romance', 'contemporary'],
          'horror': ['horror', 'supernatural', 'gothic', 'demonic'],
          'litrpg': ['litrpg', 'system', 'game', 'vr', 'mmo'],
          'cultivation': ['cultivation', 'martial arts', 'wuxia', 'xianxia']
        };

        const allowedGenres = genreMap[searchGenre] || [searchGenre];
        return allowedGenres.some(g => genre.includes(g));
      });

  // Use Promise.all to render all cards concurrently
  const bookCards = await Promise.all(filteredBooks.map(book => createBookCard(book)));
  bookCards.forEach(card => booksGrid.appendChild(card));

  if (filteredBooks.length === 0) {
    booksGrid.innerHTML = `
      <div class="no-books-message">
        <p>No books found for genre: <strong>${currentGenre}</strong></p>
        <button onclick="currentGenre='all'; renderBooks();">Show All Books</button>
      </div>
    `;
  }
}

// Wikidata API functions for book covers
async function searchWikidataBook(title) {
  try {
    const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbsearchentities&search=${encodeURIComponent(title)}&language=en&format=json&origin=*`);
    const data = await response.json();
    
    if (data.search && data.search.length > 0) {
      // Find the first book result
      const bookEntity = data.search.find(e => 
        e.description?.toLowerCase().includes('book') || 
        e.description?.toLowerCase().includes('novel') ||
        e.description?.toLowerCase().includes('literary work')
      ) || data.search[0];
      
      return bookEntity.id;
    }
    return null;
  } catch (e) {
    console.warn('Wikidata search failed:', e);
    return null;
  }
}

async function getWikidataImage(entityId) {
  if (!entityId) return null;
  
  try {
    const response = await fetch(`https://www.wikidata.org/w/api.php?action=wbgetentities&ids=${entityId}&props=claims&format=json&origin=*`);
    const data = await response.json();
    
    const entity = data.entities?.[entityId];
    const imageClaim = entity?.claims?.P18; // P18 is the image property
    
    if (imageClaim && imageClaim.length > 0) {
      const filename = imageClaim[0].mainsnak.datavalue.value;
      // Convert to Wikimedia Commons URL
      return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(filename)}?width=400`;
    }
    return null;
  } catch (e) {
    console.warn('Wikidata image fetch failed:', e);
    return null;
  }
}

async function getBookCoverUrl(book) {
  // Try Wikidata first
  const entityId = await searchWikidataBook(book.title);
  if (entityId) {
    const imageUrl = await getWikidataImage(entityId);
    if (imageUrl) {
      return imageUrl;
    }
  }
  
  // Fallback to Pollinations AI
  return `https://image.pollinations.ai/prompt/${book.cover}?width=300&height=450&seed=${book.id}&nologo=true`;
}

async function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.dataset.genre = book.genre?.toLowerCase() || 'unknown';

  const voiceEngine = TTS_CONFIG.engine === 'kokoro' ? 'Kokoro AI' : TTS_CONFIG.engine === 'orpheus' ? 'Orpheus' : 'TTS.ai';
  
  // Use placeholder initially, then load real cover
  const fallbackUrl = `https://image.pollinations.ai/prompt/${book.cover}?width=300&height=450&seed=${book.id}&nologo=true`;

  card.innerHTML = `
    <div class="book-cover-wrapper" onclick="awakenBook('${book.id}')">
      <img src="${fallbackUrl}" alt="${book.title}" class="book-cover" loading="lazy" id="cover-${book.id}">
      <div class="book-overlay">
        <span class="awaken-btn">▶ WATCH<br><small>23 MIN EPISODE</small></span>
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">${book.title}</h3>
      <span class="book-genre">${book.genre}</span>
      <p class="book-description">${book.description || ''}</p>
      <span class="episode-badge">23 MIN EPISODES</span>
      <span class="voice-badge">${voiceEngine} Voice</span>
    </div>
  `;

  // Try to load Wikidata image in background
  getBookCoverUrl(book).then(coverUrl => {
    const img = card.querySelector(`#cover-${book.id}`);
    if (img && coverUrl !== fallbackUrl) {
      img.src = coverUrl;
    }
  }).catch(() => {
    // Keep fallback image on error
  });

  return card;
}

async function awakenBook(bookId, episodeNum = 1) {
  if (isGenerating) return;

  const book = booksDatabase.find(b => b.id === bookId);
  if (!book) {
    alert('Book not found');
    return;
  }

  // Check API key for paid models
  const apiKey = API_KEYS[selectedAI];
  if (!apiKey && ['claude', 'gpt4', 'sonnet'].includes(selectedAI)) {
    alert(`Please set your ${selectedAI.toUpperCase()} API key in the API Settings (⚙️) first.`);
    toggleAPISettings();
    return;
  }

  activeBook = book;
  currentEpisode = episodeNum;
  isGenerating = true;

  showPlayer(book, true);

  try {
    // Generate 23-minute episode content
    const storyData = await generate23MinuteEpisode(book, episodeNum);
    
    // Generate scene image
    const sceneImage = await generateSceneImage(book, storyData);
    
    // Generate audio using audiobook-creator voice system
    const audioSegments = await generateAudioWithAudiobookCreator(storyData);

    updatePlayerWithContent(book, storyData, sceneImage, audioSegments);

  } catch (error) {
    console.error('Failed to awaken book:', error);
    console.error('Error stack:', error.stack);
    alert('Failed to generate episode: ' + error.message);
    closePlayer();
  } finally {
    isGenerating = false;
  }
}

async function generate23MinuteEpisode(book, episodeNum) {
  const protagonist = getProtagonist(book);
  const episodeArc = generateEpisodeArc(book, episodeNum);
  
  // Generate content sections to reach ~4,600 words
  const sections = [];
  const targetSections = 8; // 8 sections × ~575 words = 4,600 words
  
  // Opening Hook (5%)
  sections.push(generateOpeningHook(book, protagonist, episodeNum, episodeArc));
  
  // Previous Episode Recap for episodes > 1 (10%)
  if (episodeNum > 1) {
    sections.push(generateRecap(book, protagonist, episodeNum));
  }
  
  // Main Story Beats (60%)
  sections.push(generateIncitingIncident(book, protagonist, episodeArc));
  sections.push(generateRisingAction1(book, protagonist, episodeArc));
  sections.push(generateRisingAction2(book, protagonist, episodeArc));
  sections.push(generateClimax(book, protagonist, episodeArc));
  
  // Resolution (15%)
  sections.push(generateFallingAction(book, protagonist, episodeArc));
  sections.push(generateResolution(book, protagonist, episodeArc));
  
  // Next Episode Teaser (10%)
  sections.push(generateTeaser(book, protagonist, episodeNum, episodeArc));
  
  const fullEpisode = sections.join('\n\n');
  const wordCount = fullEpisode.split(/\s+/).length;
  
  return {
    chapter: fullEpisode,
    chapterTitle: `Episode ${episodeNum}: ${episodeArc.title}`,
    wordCount: wordCount,
    estimatedReadTime: ESTIMATED_READ_TIME,
    protagonist: protagonist,
    episodeNumber: episodeNum,
    aiModelUsed: selectedAI,
    episodeArc: episodeArc
  };
}

function getProtagonist(book) {
  const protagonists = {
    'my-vampire-system': 'Quinn Talen',
    'shadow-monarch': 'Sung Jin-Woo',
    'solo-leveling': 'Sung Jin-Woo',
    'my-dragonic-system': 'Aeron Draketh',
    'birth-demonic-sword': 'Cain Valdris',
    'legendary-beast-tamer': 'Kael Wildheart',
    'heavenly-thief': 'Zephyr Nightshade',
    'nano-machine': 'Ming Chen',
    'second-life-ranker': 'Yeon-woo Cha',
    'returners-magic': 'Desir Arman',
    'beginning-after-end': 'Arthur Leywin',
    'omniscient-reader': 'Kim Dokja',
    'overgeared': 'Grid',
    'legendary-moonlight-sculptor': 'Weed',
    'martial-peak': 'Yang Kai',
    'coiling-dragon': 'Linley Baruch',
    'stellar-transformations': 'Qin Yu',
    'desolate-era': 'Ji Ning',
    'issth': 'Meng Hao',
    'atg': 'Yun Che',
    'three-body': 'Ye Wenjie',
    'dune': 'Paul Atreides',
    'foundation': 'Hari Seldon',
    'hyperion': 'Raul Endymion',
    'neuromancer': 'Case',
    'pride-prejudice': 'Elizabeth Bennet',
    'jane-eyre': 'Jane Eyre',
    'wuthering-heights': 'Catherine Earnshaw',
    'outlander': 'Claire Fraser',
    'sherlock': 'Sherlock Holmes',
    'gone-girl': 'Amy Dunne',
    'girl-dragon': 'Lisbeth Salander',
    'da-vinci': 'Robert Langdon',
    'dracula': 'Jonathan Harker',
    'frankenstein': 'Victor Frankenstein',
    'stephen-king-it': 'The Losers Club',
    'exorcist': 'Chris MacNeil',
    'harry-potter': 'Harry Potter',
    'lotr': 'Frodo Baggins',
    'hobbit': 'Bilbo Baggins',
    'narnia': 'Lucy Pevensie',
    'percy-jackson': 'Percy Jackson',
    'hunger-games': 'Katniss Everdeen',
    'maze-runner': 'Thomas',
    'divergent': 'Tris Prior'
  };
  
  return protagonists[book.id] || protagonists[book.id.replace(/-/g, '')] || 'The Protagonist';
}

function generateEpisodeArc(book, episodeNum) {
  const arcs = [
    { title: 'The Awakening', type: 'origin' },
    { title: 'First Blood', type: 'conflict' },
    { title: 'Rising Power', type: 'growth' },
    { title: 'Dark Secrets', type: 'mystery' },
    { title: 'The Test', type: 'trial' },
    { title: 'Allies and Enemies', type: 'social' },
    { title: 'The Confrontation', type: 'action' },
    { title: 'Revelation', type: 'discovery' },
    { title: 'New Horizons', type: 'transition' },
    { title: 'The Choice', type: 'decision' }
  ];
  
  return arcs[(episodeNum - 1) % arcs.length];
}

function generateOpeningHook(book, protagonist, episodeNum, arc) {
  const hooks = [
    `The ${book.genre} world of ${book.title} awakened once more. ${protagonist} stood at the precipice of destiny, unaware that the next ${EPISODE_DURATION_MINUTES} minutes would reshape everything they knew about power, sacrifice, and the true nature of ${book.genre.toLowerCase().includes('vampire') ? 'blood' : book.genre.toLowerCase().includes('dragon') ? 'dragons' : 'their world'}. The air crackled with anticipation as the first rays of dawn—or was it the last embers of dusk?—cast long shadows across the landscape that would become the stage for today's episode: "${arc.title}".`,
    
    `"Episode ${episodeNum}: ${arc.title}" begins not with a whisper, but with a roar. ${protagonist} had thought they understood the rules of ${book.title}, had believed they could predict the patterns of ${book.genre.toLowerCase().includes('system') ? 'the System' : 'fate itself'}. They were wrong. So terribly, magnificently wrong. And in the space of the next ${EPISODE_DURATION_MINUTES} minutes, you will witness exactly how wrong one hero can be, and how much stronger they become because of it.`,
    
    `Twenty-three minutes. That's all it takes to change a life. To end one. To begin another. ${protagonist} didn't know it yet, but as the opening credits of "${arc.title}" fade in, their reality has already shifted. The ${book.genre} elements that once seemed like background noise to their existence were about to become a deafening symphony, and our protagonist was about to learn that they weren't just a listener—they were the conductor.`
  ];
  
  return hooks[Math.floor(Math.random() * hooks.length)];
}

function generateRecap(book, protagonist, episodeNum) {
  return `PREVIOUSLY ON ${book.title.toUpperCase()}: The journey has been long and fraught with peril. In the episodes before now, ${protagonist} has faced challenges that would break lesser souls, discovered secrets that reshape their understanding of reality, and forged alliances that will be tested in the minutes to come. The threads of fate have been pulling tighter, drawing our hero toward this moment. The decisions made in past episodes echo through time, creating ripples that will crash against the shore of today's story. Remember the lessons learned, for they will be needed. Remember the enemies made, for they have not forgotten. And remember the promises kept—and broken—for they drive the engine of this narrative forward into the next ${EPISODE_DURATION_MINUTES} minutes of storytelling.`;
}

function generateIncitingIncident(book, protagonist, arc) {
  return `THE INCITING INCIDENT: Every ${EPISODE_DURATION_MINUTES}-minute episode needs its catalyst, and today would be no different. ${protagonist} was going about their business—perhaps researching ancient texts in a forgotten library, perhaps training in secret, perhaps simply trying to survive another day—when IT happened. The moment that would define this episode arrived without warning, as these moments always do. A messenger burst through the door, breathless and bleeding. A mysterious artifact began to glow with ominous light. A long-dormant power suddenly surged to life within their very veins. The specific form of the catalyst mattered less than its effect: ${protagonist} could no longer ignore the calling. The ${arc.type} that would drive this episode had begun, and there was no turning back now. The first major decision point of our ${EPISODE_DURATION_MINUTES}-minute journey had arrived, and ${protagonist} made their choice with the weight of all previous episodes pressing upon their shoulders.`;
}

function generateRisingAction1(book, protagonist, arc) {
  return `RISING ACTION - ACT I: With the ${arc.type} now in motion, ${protagonist} began to navigate the complex web of challenges that stood between them and their goal. The ${book.genre} setting provided obstacles both mundane and magical—political intrigue among factions vying for power, ancient puzzles guarding forbidden knowledge, personal demons that refused to stay buried. For the next several minutes of our episode, we follow ${protagonist} as they gather resources, information, and allies. Each interaction is layered with subtext, each scene building upon the last. The tension mounts not through constant action, but through the ever-present sense that something larger is at stake. ${protagonist}'s internal monologue reveals their doubts, their hopes, their growing determination. We see them fail at small tasks that foreshadow larger challenges. We see them succeed in ways that seem meaningful now but may prove hollow later. The complexity of ${book.title} demands this careful build, this methodical layering of plot and character development that transforms a simple story into an epic worthy of your ${EPISODE_DURATION_MINUTES} minutes.`;
}

function generateRisingAction2(book, protagonist, arc) {
  return `RISING ACTION - ACT II: The midpoint of our ${EPISODE_DURATION_MINUTES}-minute episode approaches, and with it comes the revelation that changes everything. ${protagonist}, who thought they understood the game being played around them, discovers a deeper layer. The ${book.genre} elements that seemed straightforward reveal their complexity. Allies show cracks in their loyalty. Enemies display unexpected depth. The world-building of ${book.title} expands exponentially as ${protagonist} ventures into new territories—physical, emotional, and metaphysical. The pacing accelerates here, scenes flowing into each other with increasing urgency. Training montages give way to strategic planning. Quiet conversations give way to heated confrontations. The ${arc.title} arc reaches its point of no return as ${protagonist} commits to a course of action that cannot be undone. The stakes, which seemed high from the beginning, now appear almost impossibly daunting. Yet ${protagonist} presses forward, driven by the same force that has carried them through every episode before: an unshakeable belief that they can be more than they were, that they can transcend the limitations others would place upon them, that they can emerge from these ${EPISODE_DURATION_MINUTES} minutes fundamentally changed.`;
}

function generateClimax(book, protagonist, arc) {
  return `THE CLIMAX: We have arrived at the heart of our ${EPISODE_DURATION_MINUTES}-minute episode. The energy that has been building since the first word is released in a cascade of ${book.genre.toLowerCase().includes('action') ? 'action and combat' : 'conflict and revelation'}. ${protagonist} faces their greatest challenge yet, and the outcome is far from certain. The ${arc.type} that has driven this episode comes to a head in a confrontation that tests every skill our hero has developed, every relationship they have forged, every belief they hold dear. The ${book.genre} setting provides a spectacular backdrop—${book.genre.toLowerCase().includes('fantasy') ? 'magical energies clashing in spectacular displays, ancient powers awakening, the very fabric of reality bending to the will of those who dare to command it' : book.genre.toLowerCase().includes('sci-fi') ? 'advanced technology pushing the boundaries of physics, space itself warping around the conflict, the future of entire civilizations hanging in the balance' : 'the environment itself becoming a character, weather and landscape responding to the emotional intensity of the moment'}. ${protagonist} is pushed to their absolute limits, physically and mentally. We see them falter. We see them rise. We see them make the choice that defines not just this episode, but their entire character arc. The climax of "${arc.title}" is not just about defeating an external opponent—it is about ${protagonist} defeating their own limitations, their own fears, their own past. And when the dust settles, when the ${EPISODE_DURATION_MINUTES}-minute mark approaches, something fundamental has shifted. The episode has earned its runtime, every minute building to this moment of cathartic transformation.`;
}

function generateFallingAction(book, protagonist, arc) {
  return `FALLING ACTION: The storm of the climax has passed, but its effects ripple outward through the remaining minutes of our episode. ${protagonist} stands—or perhaps kneels, or perhaps lies prone—surveying the aftermath of "${arc.title}." The immediate threat has been neutralized, but at what cost? The ${book.genre} world they inhabit has been altered by the events of these ${EPISODE_DURATION_MINUTES} minutes. Relationships have shifted; some strengthened by shared struggle, others fractured by revealed truths. ${protagonist} processes what has happened, and we process it with them. The falling action serves as both resolution and preparation—closing the immediate arc while setting the stage for what comes next. Loose ends from previous episodes are tied off or, more often, transformed into new threads that will pull us into future stories. The consequences of choices made during the climax manifest in tangible ways. ${protagonist} is not the same person who began this episode, and the world they must navigate is not the same world. The ${arc.type} that drove this episode has left its mark, and that mark will guide the trajectory of all episodes yet to come.`;
}

function generateResolution(book, protagonist, arc) {
  return `RESOLUTION: As our ${EPISODE_DURATION_MINUTES}-minute journey nears its end, ${protagonist} finds a moment of respite—not peace, exactly, for peace is a luxury rarely afforded to heroes of ${book.genre} epics, but a moment to breathe, to reflect, to prepare. The resolution of "${arc.title}" ties together the various threads woven throughout this episode. Questions posed at the beginning find answers, though those answers often raise new questions in turn. Character arcs that intersected during the story find their temporary resting points. ${protagonist} makes a decision about their immediate future, committing to a path that will carry them into the next episode. The world-building of ${book.title} settles into its new normal, the status quo updated by the events we've witnessed. Yet even as this resolution provides satisfaction, it builds anticipation. The ${book.genre} setting whispers of greater challenges ahead, of powers not yet encountered, of secrets not yet revealed. The ${EPISODE_DURATION_MINUTES} minutes we've spent together have been transformative, but they are merely one chapter in a much larger story. And as the resolution fades, we find ourselves looking toward what comes next, our investment in ${protagonist}'s journey deeper than ever.`;
}

function generateTeaser(book, protagonist, episodeNum, episodeArc) {
  return `NEXT TIME ON ${book.title.toUpperCase()}: The story doesn't end here. In the next ${EPISODE_DURATION_MINUTES}-minute episode, ${protagonist} will face challenges that make today's trials seem like mere prelude. New characters will emerge from the shadows of the ${book.genre} setting—some offering aid, others posing threats impossible to ignore. The consequences of "${episodeArc.title}" will echo forward, creating complications our hero cannot yet imagine. A mystery teased in passing will demand investigation. An alliance forged in fire will be tested. A power glimpsed in dreams will manifest in reality. The journey continues, and each episode builds upon the last, creating a tapestry of storytelling that rewards your time and attention. You have spent ${EPISODE_DURATION_MINUTES} minutes with ${protagonist} today. Tomorrow, there will be ${EPISODE_DURATION_MINUTES} more. And the day after that. Until the story reaches its ultimate conclusion, and even then, the world of ${book.title} will live on in the imagination of all who have experienced its magic. This is the power of serialized storytelling. This is the promise of Aetheria. Episode ${episodeNum + 1} awaits.`;
}

async function generateSceneImage(book, storyData) {
  // Try Wikidata first for book cover
  const entityId = await searchWikidataBook(book.title);
  if (entityId) {
    const imageUrl = await getWikidataImage(entityId);
    if (imageUrl) {
      return imageUrl.replace('width=400', 'width=800');
    }
  }
  
  // Fallback to AI-generated scene
  const prompt = `${book.title} Episode ${currentEpisode} - ${storyData.chapterTitle}. ${book.description}. Cinematic dramatic lighting fantasy art style high detail epic scene`;
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&seed=${book.id}_ep${currentEpisode}`;
}

async function generateAudioWithAudiobookCreator(storyData) {
  // Split text into narration and dialogue segments
  const segments = splitIntoSegments(storyData.chapter);
  const voiceMap = VOICE_MAP[TTS_CONFIG.engine];
  const audioSegments = [];
  
  // Get narrator and dialogue voices based on configuration
  const narratorVoice = TTS_CONFIG.narratorGender === 'male' 
    ? voiceMap.male_narrator 
    : voiceMap.female_narrator;
  const dialogueVoice = TTS_CONFIG.narratorGender === 'male'
    ? voiceMap.male_dialogue
    : voiceMap.female_dialogue;
  
  // Process each segment
  for (const segment of segments) {
    const voice = segment.type === 'dialogue' && TTS_CONFIG.multiVoiceMode
      ? dialogueVoice
      : narratorVoice;
    
    try {
      const audioUrl = await generateTTSSegment(segment.text, voice);
      if (audioUrl) {
        audioSegments.push({
          audioUrl: audioUrl,
          text: segment.text,
          type: segment.type,
          voice: voice
        });
      }
    } catch (e) {
      console.warn('TTS generation failed for segment:', e);
    }
  }
  
  return audioSegments;
}

function splitIntoSegments(text) {
  // Split text into narration and dialogue segments
  const parts = text.split(/("[^"]+")/);
  const segments = [];
  
  for (const part of parts) {
    if (!part.trim()) continue;
    
    const isDialogue = part.startsWith('"') && part.endsWith('"');
    segments.push({
      text: part,
      type: isDialogue ? 'dialogue' : 'narration',
      voice: isDialogue ? 'dialogue' : 'narrator'
    });
  }
  
  return segments;
}

async function generateTTSSegment(text, voice) {
  // TTS.ai Cloud API
  if (TTS_CONFIG.engine === 'ttsai') {
    try {
      const response = await fetch('https://api.tts.ai/v1/speech', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEYS.ttsaiApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'bark', // bark, tortoise, or kokoro
          input: text,
          voice: voice, // michael, emma, or bella
          response_format: 'mp3'
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    } catch (e) {
      console.warn('TTS.ai API call failed:', e);
    }
    return null;
  }

  // Use OpenAI-compatible TTS API (Kokoro/Orpheus)
  try {
    const response = await fetch(`${API_KEYS.ttsBaseUrl}/audio/speech`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEYS.ttsApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: TTS_CONFIG.model,
        input: text,
        voice: voice,
        response_format: 'mp3'
      })
    });

    if (response.ok) {
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
  } catch (e) {
    console.warn('TTS API call failed:', e);
  }
  
  // Fallback to browser TTS
  return null;
}

function chunkTextForTTS(text, maxLength) {
  const chunks = [];
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  let currentChunk = '';
  
  for (const sentence of sentences) {
    if ((currentChunk + sentence).length <= maxLength) {
      currentChunk += sentence;
    } else {
      if (currentChunk) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    }
  }
  
  if (currentChunk) chunks.push(currentChunk.trim());
  return chunks;
}

function showPlayer(book, isLoading = false) {
  if (!audiovisualPlayer) return;

  document.getElementById('bookTitle').textContent = book.title;
  document.getElementById('chapterInfo').textContent = isLoading 
    ? `Generating Episode ${currentEpisode}... (${TTS_CONFIG.engine} voice)` 
    : `Episode ${currentEpisode}: Ready`;
  document.getElementById('wordCount').textContent = isLoading ? 'Calculating...' : '0';
  document.getElementById('readTime').textContent = ESTIMATED_READ_TIME;
  document.getElementById('protagonist').textContent = isLoading ? 'Preparing...' : 'Loading...';
  
  const sceneImage = document.getElementById('sceneImage');
  if (sceneImage) {
    // Start with AI-generated image, then try Wikidata
    const fallbackUrl = `https://image.pollinations.ai/prompt/${book.cover}?width=800&height=600&seed=${book.id}&nologo=true`;
    sceneImage.src = fallbackUrl;
    
    // Try to get Wikidata image
    getBookCoverUrl(book).then(coverUrl => {
      if (coverUrl !== fallbackUrl) {
        sceneImage.src = coverUrl.replace('width=300', 'width=800').replace('height=450', 'height=600');
      }
    }).catch(() => {
      // Keep fallback image
    });
  }

  // Remove old audio playlist if exists
  const oldPlaylist = document.querySelector('.audio-playlist');
  if (oldPlaylist) oldPlaylist.remove();

  audiovisualPlayer.classList.remove('hidden');
}

function updatePlayerWithContent(book, storyData, sceneImageUrl, audioSegments) {
  if (!audiovisualPlayer) return;

  document.getElementById('bookTitle').textContent = `${book.title} - Episode ${storyData.episodeNumber}`;
  document.getElementById('chapterInfo').textContent = storyData.chapterTitle;
  document.getElementById('wordCount').textContent = storyData.wordCount.toLocaleString();
  document.getElementById('readTime').textContent = storyData.estimatedReadTime;
  document.getElementById('protagonist').textContent = storyData.protagonist;

  const sceneImage = document.getElementById('sceneImage');
  if (sceneImage) {
    sceneImage.src = sceneImageUrl;
  }

  // Add episode navigation
  addEpisodeControls(book, storyData);

  // Setup audio playlist with audiobook-creator segments
  setupAudioPlaylist(audioSegments, storyData);
}

function addEpisodeControls(book, storyData) {
  const controlsDiv = document.querySelector('.player-controls');
  if (!controlsDiv) return;
  
  const existingControls = controlsDiv.querySelector('.episode-controls');
  if (existingControls) existingControls.remove();
  
  const episodeControls = document.createElement('div');
  episodeControls.className = 'episode-controls';
  episodeControls.innerHTML = `
    <div class="episode-nav">
      ${storyData.episodeNumber > 1 ? `<button class="ep-btn prev" onclick="awakenBook('${book.id}', ${storyData.episodeNumber - 1})">← Episode ${storyData.episodeNumber - 1}</button>` : ''}
      <span class="ep-current">Episode ${storyData.episodeNumber}</span>
      <button class="ep-btn next" onclick="awakenBook('${book.id}', ${storyData.episodeNumber + 1})">Episode ${storyData.episodeNumber + 1} →</button>
    </div>
    <p class="ep-format">${EPISODE_DURATION_MINUTES}-minute format • ~${TARGET_WORD_COUNT.toLocaleString()} words • ${TTS_CONFIG.engine} voice</p>
  `;
  
  controlsDiv.insertBefore(episodeControls, controlsDiv.firstChild);
}

function setupAudioPlaylist(segments, storyData) {
  const controlsDiv = document.querySelector('.player-controls');
  if (!controlsDiv) return;

  // Remove existing playlist
  const existingPlaylist = controlsDiv.querySelector('.audio-playlist');
  if (existingPlaylist) existingPlaylist.remove();
  
  if (segments.length === 0) {
    // Fallback to browser TTS
    useBrowserTTS(storyData.chapter.substring(0, 5000));
    return;
  }

  const playlistDiv = document.createElement('div');
  playlistDiv.className = 'audio-playlist';
  playlistDiv.innerHTML = `
    <p class="playlist-info">${TTS_CONFIG.engine} TTS • ${TTS_CONFIG.narratorGender} narrator • ${segments.length} segments</p>
    <audio id="episodeAudio" controls class="audio-player"></audio>
    <div class="segment-info" id="segmentInfo"></div>
  `;
  
  // Insert after episode controls
  const episodeControls = controlsDiv.querySelector('.episode-controls');
  if (episodeControls) {
    episodeControls.after(playlistDiv);
  } else {
    controlsDiv.insertBefore(playlistDiv, controlsDiv.firstChild);
  }
  
  // Setup sequential playback
  const episodeAudio = document.getElementById('episodeAudio');
  let currentSegmentIndex = 0;
  
  function playNextSegment() {
    if (currentSegmentIndex < segments.length) {
      const segment = segments[currentSegmentIndex];
      episodeAudio.src = segment.audioUrl;
      document.getElementById('segmentInfo').textContent = 
        `Segment ${currentSegmentIndex + 1}/${segments.length} • ${segment.type} • ${segment.voice}`;
      episodeAudio.play().catch(e => console.warn('Playback failed:', e));
      currentSegmentIndex++;
    }
  }
  
  episodeAudio.addEventListener('ended', playNextSegment);
  episodeAudio.style.display = 'block';
  
  // Start playback
  playNextSegment();
}

function useBrowserTTS(text) {
  if ('speechSynthesis' in window) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    
    // Try to find a good voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.name.includes('Google') || v.name.includes('Samantha') || v.name.includes('Daniel'));
    if (preferredVoice) utterance.voice = preferredVoice;
    
    window.speechSynthesis.speak(utterance);
  }
}

function closePlayer() {
  if (!audiovisualPlayer) return;
  
  audiovisualPlayer.classList.add('hidden');
  
  const episodeAudio = document.getElementById('episodeAudio');
  if (episodeAudio) {
    episodeAudio.pause();
    episodeAudio.src = '';
  }

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  activeBook = null;
}

// Export functions for global access
window.awakenBook = awakenBook;
window.closePlayer = closePlayer;
window.toggleAPISettings = toggleAPISettings;
window.saveAPIKeys = saveAPIKeys;
