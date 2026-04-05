/**
 * AETHERIA.AI - React Re-Design
 * Matches reference screenshots exactly, converted to React
 */
const { useState, useEffect, useRef } = React;

const AetheriaApp = () => {
  const [apiKeys, setApiKeys] = useState({
    gemini: localStorage.getItem('gemini_api_key') || '',
    grok: localStorage.getItem('grok_api_key') || '',
    ttsai: localStorage.getItem('ttsai_api_key') || ''
  });

  const [ttsConfig, setTtsConfig] = useState({
    engine: localStorage.getItem('tts_engine') || 'kokoro',
    narrator: localStorage.getItem('narrator_gender') || 'male'
  });

  const [currentGenre, setCurrentGenre] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState('home'); // 'home', 'detail', 'player'
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const audioRef = useRef(null);
  const [progress, setProgress] = useState(0);
  const [timeDisplay, setTimeDisplay] = useState({ current: '00:00', total: '00:00' });

  // Books Data
  const books = typeof window !== 'undefined' && window.booksDatabase ? window.booksDatabase : [];
  const filteredBooks = currentGenre === 'all' 
    ? books 
    : books.filter(b => b.genre?.toLowerCase().includes(currentGenre.toLowerCase()));

  const getBookCoverUrl = (book) => {
    return `https://image.pollinations.ai/prompt/${encodeURIComponent(book.cover || book.title)}?width=400&height=600&seed=${book.id}&nologo=true`;
  };

  const getProtagonist = (book) => {
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
  };

  const episodeTitles = [
    'The Awakening', 'First Blood', 'Rising Power', 'Dark Secrets',
    'The Test', 'Allies and Enemies', 'The Confrontation', 'Revelation',
    'New Horizons', 'The Choice'
  ];

  // Audio Handlers
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '00:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    const current = audioRef.current.currentTime;
    const total = audioRef.current.duration;
    setProgress((current / total) * 100);
    setTimeDisplay({ current: formatTime(current), total: formatTime(total) });
  };

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const changeSpeed = () => {
    if (!audioRef.current) return;
    const speeds = [1, 1.25, 1.5, 2];
    const nextIndex = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    const newSpeed = speeds[nextIndex];
    audioRef.current.playbackRate = newSpeed;
    setPlaybackRate(newSpeed);
  };

  const saveAPIKeys = () => {
    localStorage.setItem('gemini_api_key', apiKeys.gemini);
    localStorage.setItem('grok_api_key', apiKeys.grok);
    localStorage.setItem('ttsai_api_key', apiKeys.ttsai);
    localStorage.setItem('tts_engine', ttsConfig.engine);
    localStorage.setItem('narrator_gender', ttsConfig.narrator);
    setApiSettingsOpen(false);
    alert('Settings saved!');
  };

  const handleEpisodeChange = (newEp) => {
    if (newEp < 1) return;
    setCurrentEpisode(newEp);
    setIsPlaying(true);
  };

  return (
    <div className="app-container">
      <button className="settings-toggle" onClick={() => setApiSettingsOpen(!apiSettingsOpen)}>⚙️ Settings</button>

      {apiSettingsOpen && (
        <div id="apiSettingsPanel" className="api-settings-panel">
          <div className="api-panel-content">
            <h3>🔑 API Configuration</h3>
            <div className="api-input-group">
              <label>Gemini API Key</label>
              <input type="password" id="geminiKey" value={apiKeys.gemini} onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})} />
            </div>
            <div className="api-input-group">
              <label>Grok API Key</label>
              <input type="password" id="grokKey" value={apiKeys.grok} onChange={e => setApiKeys({...apiKeys, grok: e.target.value})} />
            </div>
            <div className="api-input-group">
              <label>TTS.ai API Key</label>
              <input type="password" id="ttsaiApiKey" value={apiKeys.ttsai} onChange={e => setApiKeys({...apiKeys, ttsai: e.target.value})} />
            </div>
            <div className="api-input-group">
              <label>TTS Engine</label>
              <select id="ttsEngine" value={ttsConfig.engine} onChange={e => setTtsConfig({...ttsConfig, engine: e.target.value})}>
                <option value="kokoro">Kokoro</option>
                <option value="orpheus">Orpheus</option>
                <option value="ttsai">TTS.ai</option>
              </select>
            </div>
            <div className="api-input-group">
              <label>Narrator Gender</label>
              <select id="narratorGender" value={ttsConfig.narrator} onChange={e => setTtsConfig({...ttsConfig, narrator: e.target.value})}>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <button onClick={saveAPIKeys}>Save Configuration</button>
            <button onClick={() => setApiSettingsOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {viewMode === 'home' && (
        <div id="homeView">
          <div className="genre-filters">
            {['All', 'LitRPG', 'Cultivation', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Horror'].map(g => (
              <button key={g} className={`genre-pill ${currentGenre === g.toLowerCase() ? 'active' : ''}`} onClick={() => setCurrentGenre(g.toLowerCase())}>{g}</button>
            ))}
          </div>
          <div id="booksGrid" className="books-grid">
            {filteredBooks.map(book => (
              <div key={book.id} className="book-card" onClick={() => { setSelectedBook(book); setViewMode('detail'); window.scrollTo(0,0); }}>
                <div className="book-cover-wrapper">
                  <div className="corner-ornament top-left"></div>
                  <div className="corner-ornament top-right"></div>
                  <div className="corner-ornament bottom-left"></div>
                  <div className="corner-ornament bottom-right"></div>
                  <div className="endless-badge">✦ ENDLESS</div>
                  <div className="cover-image-container">
                    <img className="cover-image" src={getBookCoverUrl(book)} alt={book.title} loading="lazy" />
                  </div>
                </div>
                <div className="book-info">
                  <h3 className="book-title">{book.title}</h3>
                  <p className="book-author">{book.author || 'AI Generated'}</p>
                  <span className="book-genre">{book.genre}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'detail' && selectedBook && (
        <div id="bookDetailView">
          <button onClick={() => setViewMode('home')}>Back to Home</button>
          <div id="detailBookCover">
            <div className="corner-ornament top-left"></div>
            <div className="corner-ornament top-right"></div>
            <div className="corner-ornament bottom-left"></div>
            <div className="corner-ornament bottom-right"></div>
            <div className="endless-badge">✦ ENDLESS</div>
            <div className="cover-image-container">
              <img className="cover-image" src={getBookCoverUrl(selectedBook)} alt={selectedBook.title} />
            </div>
          </div>
          <h2 id="detailTitle">{selectedBook.title}</h2>
          <p id="detailAuthor">By {selectedBook.author || 'AI Generated'}</p>
          <span id="detailGenre">{selectedBook.genre}</span>
          <p id="detailDescription">{selectedBook.description}</p>
          <span id="detailVoice">{ttsConfig.engine === 'ttsai' ? 'TTS.ai' : ttsConfig.engine} Voice</span>
          
          <div id="chapterList">
            <h3>Episodes</h3>
            {[1,2,3,4,5,6,7,8,9,10].map(ep => (
              <div key={ep} className="chapter-item" onClick={() => { handleEpisodeChange(ep); setViewMode('player'); window.scrollTo(0,0); }}>
                <span className="chapter-number">EP {ep}</span>
                <span className="chapter-title">{episodeTitles[(ep - 1) % episodeTitles.length]}</span>
                <span className="chapter-duration">23:00</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {viewMode === 'player' && selectedBook && (
        <div id="playerView">
          <button onClick={() => setViewMode('detail')}>Back to Details</button>
          <h2 id="playerBookTitle">{selectedBook.title}</h2>
          <h3 id="playerChapterLabel">CHAPTER {currentEpisode}</h3>
          <img id="playerSceneImage" src={`https://image.pollinations.ai/prompt/${encodeURIComponent(selectedBook.title + ' scene ' + currentEpisode)}?width=800&height=600&seed=${selectedBook.id}_ep${currentEpisode}&nologo=true`} alt="Scene" />
          <h3 id="playerChapterTitle">{episodeTitles[(currentEpisode - 1) % episodeTitles.length]}</h3>
          
          <div id="playerTextContent">
            <p>{getProtagonist(selectedBook)} had worked at the same bakery for eleven years, which was a long time for a human but practically a Tuesday for whatever he had been before he forgot.</p>
            <p>He didn't know he'd forgotten. That was the nature of forgetting.</p>
            <p>He knew he liked the smell of rain. He knew he felt better when he could see other people being comfortable. He knew that when he touched something — the bread he kneaded, the coins he counted, the hands of people who were cold — he sometimes felt a brief warmth pass from him to the object, which he'd attributed to good circulation.</p>
            <p>It was not good circulation.</p>
            <p>It was the last flicker of something vast, something that had once been called divine, something that had chosen to stay when all others left. It was the remnant of a god who had decided that the world needed small comforts more than grand miracles.</p>
            <p>And today, the young woman who had been dreaming about his divine life would walk through his door.</p>
          </div>

          <div className="player-controls">
            <button id="prevBtn" onClick={() => handleEpisodeChange(currentEpisode - 1)}>Prev</button>
            <button id="playPauseBtn" onClick={togglePlayPause}>
              <span className="play-icon">{isPlaying ? '⏸' : '▶'}</span>
            </button>
            <button id="nextBtn" onClick={() => handleEpisodeChange(currentEpisode + 1)}>Next</button>
            <button id="speedBtn" onClick={changeSpeed}>{playbackRate}x</button>
            
            <div className="progress-container">
              <span id="currentTime">{timeDisplay.current}</span>
              <input type="range" id="progressSlider" min="0" max="100" value={progress} onChange={(e) => {
                if (audioRef.current) {
                  audioRef.current.currentTime = (e.target.value / 100) * audioRef.current.duration;
                }
              }} />
              <span id="totalTime">{timeDisplay.total}</span>
            </div>
          </div>
          
          <audio ref={audioRef} onTimeUpdate={handleTimeUpdate} onEnded={() => setIsPlaying(false)} src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" autoPlay={isPlaying} />
        </div>
      )}
    </div>
  );
};

// Required to make the component available to the rest of your app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<AetheriaApp />);
