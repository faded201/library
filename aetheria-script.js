/**
 * AETHERIA.AI - New Design JavaScript
 * Matches reference screenshots exactly
 */

// API Configuration
const API_KEYS = {
  gemini: localStorage.getItem('gemini_api_key') || '',
  grok: localStorage.getItem('grok_api_key') || '',
  ttsai: localStorage.getItem('ttsai_api_key') || ''
};

const TTS_CONFIG = {
  engine: localStorage.getItem('tts_engine') || 'kokoro',
  narrator: localStorage.getItem('narrator_gender') || 'male'
};

// State
let currentGenre = 'all';
let selectedBook = null;
let currentEpisode = 1;
let isPlaying = false;
let audioPlayer = null;

// DOM Elements
const views = {
  home: document.getElementById('homeView'),
  detail: document.getElementById('bookDetailView'),
  player: document.getElementById('playerView')
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  initializeApp();
});

function initializeApp() {
  setupGenreFilters();
  renderBooks();
  setupAPIPanel();
  
  // Initialize audio player
  audioPlayer = document.getElementById('audioPlayer');
  if (audioPlayer) {
    audioPlayer.addEventListener('timeupdate', updateProgress);
    audioPlayer.addEventListener('ended', onAudioEnded);
  }
  
  // Setup player controls
  setupPlayerControls();
}

// View Management
function showView(viewName) {
  Object.values(views).forEach(view => {
    if (view) view.classList.add('hidden');
  });
  
  if (views[viewName]) {
    views[viewName].classList.remove('hidden');
  }
  
  // Scroll to top
  window.scrollTo(0, 0);
}

function showHomeView() {
  showView('home');
  selectedBook = null;
}

function showBookDetail(bookId = null) {
  if (bookId) {
    selectedBook = booksDatabase.find(b => b.id === bookId);
  }
  
  if (!selectedBook) return;
  
  populateBookDetail(selectedBook);
  showView('detail');
}

function startListening() {
  if (!selectedBook) return;
  
  populatePlayerView(selectedBook, currentEpisode);
  showView('player');
  
  // Auto-start audio generation
  generateAndPlayEpisode(selectedBook, currentEpisode);
}

// Genre Filters
function setupGenreFilters() {
  const buttons = document.querySelectorAll('.genre-pill');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentGenre = btn.dataset.genre;
      renderBooks();
    });
  });
}

// Book Rendering
async function renderBooks() {
  const grid = document.getElementById('booksGrid');
  if (!grid || typeof booksDatabase === 'undefined') return;
  
  grid.innerHTML = '';
  
  const filtered = currentGenre === 'all' 
    ? booksDatabase 
    : booksDatabase.filter(book => {
        const genre = book.genre?.toLowerCase() || '';
        return genre.includes(currentGenre.toLowerCase());
      });
  
  filtered.forEach(book => {
    const card = createBookCard(book);
    grid.appendChild(card);
  });
}

function createBookCard(book) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.onclick = () => showBookDetail(book.id);
  
  // Get cover image URL (Wikidata or AI generated)
  const coverUrl = getBookCoverUrl(book);
  
  card.innerHTML = `
    <div class="book-cover-wrapper">
      <div class="corner-ornament top-left"></div>
      <div class="corner-ornament top-right"></div>
      <div class="corner-ornament bottom-left"></div>
      <div class="corner-ornament bottom-right"></div>
      <div class="endless-badge">✦ ENDLESS</div>
      <div class="cover-image-container">
        <img class="cover-image" src="${coverUrl}" alt="${book.title}" loading="lazy">
      </div>
    </div>
    <div class="book-info">
      <h3 class="book-title">${book.title}</h3>
      <p class="book-author">${book.author || 'AI Generated'}</p>
      <span class="book-genre">${book.genre}</span>
    </div>
  `;
  
  return card;
}

function getBookCoverUrl(book) {
  // Try to get from Wikidata or use AI generated
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(book.cover || book.title)}?width=400&height=600&seed=${book.id}&nologo=true`;
}

// Book Detail View
function populateBookDetail(book) {
  // Update cover
  const coverEl = document.getElementById('detailBookCover');
  const coverUrl = getBookCoverUrl(book);
  coverEl.innerHTML = `
    <div class="corner-ornament top-left"></div>
    <div class="corner-ornament top-right"></div>
    <div class="corner-ornament bottom-left"></div>
    <div class="corner-ornament bottom-right"></div>
    <div class="endless-badge">✦ ENDLESS</div>
    <div class="cover-image-container">
      <img class="cover-image" src="${coverUrl}" alt="${book.title}">
    </div>
  `;
  
  // Update text
  document.getElementById('detailGenre').textContent = book.genre;
  document.getElementById('detailTitle').textContent = book.title;
  document.getElementById('detailAuthor').textContent = `By ${book.author || 'AI Generated'}`;
  document.getElementById('detailDescription').textContent = book.description || '';
  document.getElementById('detailVoice').textContent = `${TTS_CONFIG.engine === 'ttsai' ? 'TTS.ai' : TTS_CONFIG.engine} Voice`;
  
  // Generate chapters (episodes)
  renderChapterList(book);
}

function renderChapterList(book) {
  const list = document.getElementById('chapterList');
  list.innerHTML = '<h3>Episodes</h3>';
  
  // Generate 10 episodes
  for (let i = 1; i <= 10; i++) {
    const episode = createEpisodeElement(book, i);
    list.appendChild(episode);
  }
}

function createEpisodeElement(book, episodeNum) {
  const episode = document.createElement('div');
  episode.className = 'chapter-item';
  episode.onclick = () => {
    currentEpisode = episodeNum;
    startListening();
  };
  
  const titles = [
    'The Awakening', 'First Blood', 'Rising Power', 'Dark Secrets',
    'The Test', 'Allies and Enemies', 'The Confrontation', 'Revelation',
    'New Horizons', 'The Choice'
  ];
  
  episode.innerHTML = `
    <span class="chapter-number">EP ${episodeNum}</span>
    <span class="chapter-title">${titles[(episodeNum - 1) % titles.length]}</span>
    <span class="chapter-duration">23:00</span>
  `;
  
  return episode;
}

// Player View
function populatePlayerView(book, episodeNum) {
  // Update header
  document.getElementById('playerBookTitle').textContent = book.title;
  document.getElementById('playerChapterLabel').textContent = `CHAPTER ${episodeNum}`;
  
  // Update scene image
  const sceneUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(book.title + ' scene ' + episodeNum)}?width=800&height=600&seed=${book.id}_ep${episodeNum}&nologo=true`;
  document.getElementById('playerSceneImage').src = sceneUrl;
  
  // Update chapter title
  const titles = ['The Awakening', 'First Blood', 'Rising Power', 'Dark Secrets', 'The Test', 
                  'Allies and Enemies', 'The Confrontation', 'Revelation', 'New Horizons', 'The Choice'];
  document.getElementById('playerChapterTitle').textContent = titles[(episodeNum - 1) % titles.length];
  
  // Generate story text
  const storyText = generateStoryText(book, episodeNum);
  document.getElementById('playerTextContent').innerHTML = storyText;
}

function generateStoryText(book, episodeNum) {
  // This would normally come from AI generation
  // For now, generate placeholder content
  const protagonist = getProtagonist(book);
  
  return `
    <p>${protagonist} had worked at the same bakery for eleven years, which was a long time for a human but practically a Tuesday for whatever he had been before he forgot.</p>
    <p>He didn't know he'd forgotten. That was the nature of forgetting.</p>
    <p>He knew he liked the smell of rain. He knew he felt better when he could see other people being comfortable. He knew that when he touched something — the bread he kneaded, the coins he counted, the hands of people who were cold — he sometimes felt a brief warmth pass from him to the object, which he'd attributed to good circulation.</p>
    <p>It was not good circulation.</p>
    <p>It was the last flicker of something vast, something that had once been called divine, something that had chosen to stay when all others left. It was the remnant of a god who had decided that the world needed small comforts more than grand miracles.</p>
    <p>And today, the young woman who had been dreaming about his divine life would walk through his door.</p>
  `;
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
  
  return protagonists[book.id] || protagonists[book.id?.replace(/-/g, '')] || 'The Protagonist';
}

// Audio Player
function setupPlayerControls() {
  const playBtn = document.getElementById('playPauseBtn');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const speedBtn = document.getElementById('speedBtn');
  const progressSlider = document.getElementById('progressSlider');
  
  if (playBtn) {
    playBtn.addEventListener('click', togglePlayPause);
  }
  
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentEpisode > 1) {
        currentEpisode--;
        populatePlayerView(selectedBook, currentEpisode);
        generateAndPlayEpisode(selectedBook, currentEpisode);
      }
    });
  }
  
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      currentEpisode++;
      populatePlayerView(selectedBook, currentEpisode);
      generateAndPlayEpisode(selectedBook, currentEpisode);
    });
  }
  
  if (speedBtn) {
    const speeds = [1, 1.25, 1.5, 2];
    let speedIndex = 0;
    speedBtn.addEventListener('click', () => {
      speedIndex = (speedIndex + 1) % speeds.length;
      const newSpeed = speeds[speedIndex];
      speedBtn.textContent = newSpeed + 'x';
      if (audioPlayer) audioPlayer.playbackRate = newSpeed;
    });
  }
  
  if (progressSlider) {
    progressSlider.addEventListener('input', (e) => {
      if (audioPlayer) {
        const time = (e.target.value / 100) * audioPlayer.duration;
        audioPlayer.currentTime = time;
      }
    });
  }
}

function togglePlayPause() {
  if (!audioPlayer) return;
  
  if (isPlaying) {
    audioPlayer.pause();
    document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">▶</span>';
  } else {
    audioPlayer.play();
    document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">⏸</span>';
  }
  isPlaying = !isPlaying;
}

function updateProgress() {
  if (!audioPlayer) return;
  
  const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  document.getElementById('progressFill').style.width = progress + '%';
  document.getElementById('progressSlider').value = progress;
  
  // Update time display
  const current = formatTime(audioPlayer.currentTime);
  const total = formatTime(audioPlayer.duration);
  document.getElementById('currentTime').textContent = current;
  document.getElementById('totalTime').textContent = total;
}

function formatTime(seconds) {
  if (!seconds || isNaN(seconds)) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function onAudioEnded() {
  isPlaying = false;
  document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">▶</span>';
}

async function generateAndPlayEpisode(book, episodeNum) {
  // This would integrate with TTS
  // For now, simulate loading
  document.getElementById('playPauseBtn').innerHTML = '<span class="play-icon">⏸</span>';
  isPlaying = true;
  
  // Here you would:
  // 1. Generate or fetch the audio for this episode
  // 2. Set the audio source
  // 3. Play the audio
  
  // Example with TTS.ai:
  if (TTS_CONFIG.engine === 'ttsai' && API_KEYS.ttsai) {
    // Generate audio using TTS.ai API
    // const audioUrl = await generateTTSAudio(book, episodeNum);
    // audioPlayer.src = audioUrl;
    // audioPlayer.play();
  }
}

// API Settings
function setupAPIPanel() {
  // Pre-fill values
  document.getElementById('geminiKey').value = API_KEYS.gemini;
  document.getElementById('grokKey').value = API_KEYS.grok;
  document.getElementById('ttsaiApiKey').value = API_KEYS.ttsai;
  document.getElementById('ttsEngine').value = TTS_CONFIG.engine;
  document.getElementById('narratorGender').value = TTS_CONFIG.narrator;
}

function toggleAPISettings() {
  const panel = document.getElementById('apiSettingsPanel');
  panel.classList.toggle('hidden');
}

function saveAPIKeys() {
  API_KEYS.gemini = document.getElementById('geminiKey').value;
  API_KEYS.grok = document.getElementById('grokKey').value;
  API_KEYS.ttsai = document.getElementById('ttsaiApiKey').value;
  TTS_CONFIG.engine = document.getElementById('ttsEngine').value;
  TTS_CONFIG.narrator = document.getElementById('narratorGender').value;
  
  // Save to localStorage
  localStorage.setItem('gemini_api_key', API_KEYS.gemini);
  localStorage.setItem('grok_api_key', API_KEYS.grok);
  localStorage.setItem('ttsai_api_key', API_KEYS.ttsai);
  localStorage.setItem('tts_engine', TTS_CONFIG.engine);
  localStorage.setItem('narrator_gender', TTS_CONFIG.narrator);
  
  toggleAPISettings();
  alert('Settings saved!');
}

// Export functions for global access
window.showHomeView = showHomeView;
window.showBookDetail = showBookDetail;
window.startListening = startListening;
window.toggleAPISettings = toggleAPISettings;
window.saveAPIKeys = saveAPIKeys;
