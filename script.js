const { useState } = React;

/**
 * XAVIER-OS: AETHERIA (Stable Build 1.0)
 * Includes: Noiz Integration, Direct Image Assets, and UI Logic
 */

// SECURITY: API key should be set via environment variable in production
const NOIZ_API_KEY = typeof process !== 'undefined' ? process.env.REACT_APP_NOIZ_API_KEY : localStorage.getItem('noiz_api_key') || '';

const XavierOS = () => {
  const [activeBook, setActiveBook] = useState(null);
  const [isAwakening, setIsAwakening] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [storyContent, setStoryContent] = useState(null);
  const [selectedAI, setSelectedAI] = useState('gemini');

  // DATA: 215 most sought-after titles on the planet
  const bookLibrary = [
    // Epic Fantasy & LitRPG
    { id: "vampire-system", title: "My Vampire System", genre: "LitRPG/Vampire", cover: "https://picsum.photos/seed/vampire-system/180/270", description: "A world where leveling up costs blood. Every drop counts." },
    { id: "shadow-monarch", title: "Shadow Monarch", genre: "Dark Fantasy", cover: "https://picsum.photos/seed/shadow-monarch/180/270", description: "Arise. The shadows belong to him now." },
    { id: "dragonic-system", title: "My Dragonic System", genre: "Draconic Evolution", cover: "https://picsum.photos/seed/dragonic-system/180/270", description: "Scales erupt, power awakens. The dragon within demands release." },
    { id: "demonic-sword", title: "Birth of a Demonic Sword", genre: "Weapon Evolution", cover: "https://picsum.photos/seed/demonic-sword/180/270", description: "A blade forged from dying stars, it consumes souls to grow stronger." },
    { id: "beast-tamer", title: "Legendary Beast Tamer", genre: "Monster Collection", cover: "https://picsum.photos/seed/beast-tamer/180/270", description: "Ancient beasts bow before him. The age of the Beast King has come." },
    { id: "heavenly-thief", title: "Heavenly Thief", genre: "Celestial Heist", cover: "https://picsum.photos/seed/heavenly-thief/180/270", description: "Stealing the light of the stars from the gods themselves." },
    
    // Modern Cultivation & Progression
    { id: "martial-peak", title: "Martial Peak", genre: "Cultivation", cover: "https://picsum.photos/seed/martial-peak/180/270", description: "Climbing the martial peak, one step at a time." },
    { id: "coiling-dragon", title: "Coiling Dragon", genre: "Epic Fantasy", cover: "https://picsum.photos/seed/coiling-dragon/180/270", description: "A dragon's legacy, a mortal's journey." },
    { id: "stellar-transformations", title: "Stellar Transformations", genre: "Cosmic Cultivation", cover: "https://picsum.photos/seed/stellar-transformations/180/270", description: "Transforming the stars, conquering the cosmos." },
    { id: "desolate-era", title: "Desolate Era", genre: "Historical Fantasy", cover: "https://picsum.photos/seed/desolate-era/180/270", description: "In a desolate era, one youth rises." },
    { id: "issth", title: "I Shall Seal the Heavens", genre: "Cultivation Epic", cover: "https://picsum.photos/seed/issth/180/270", description: "I shall seal the heavens, and all shall bow." },
    { id: "atg", title: "Against the Gods", genre: "Reincarnation Fantasy", cover: "https://picsum.photos/seed/atg/180/270", description: "Against the gods, against fate itself." },
    
    // Sci-Fi & Space Opera
    { id: "three-body", title: "Three-Body Problem", genre: "Hard Sci-Fi", cover: "https://picsum.photos/seed/three-body/180/270", description: "The universe is not as it seems." },
    { id: "dune", title: "Dune", genre: "Space Opera", cover: "https://picsum.photos/seed/dune/180/270", description: "The spice must flow. The desert planet awaits." },
    { id: "foundation", title: "Foundation", genre: "Galactic Empire", cover: "https://picsum.photos/seed/foundation/180/270", description: "The fall of empire, the rise of psychohistory." },
    { id: "hyperion", title: "Hyperion Cantos", genre: "Space Opera", cover: "https://picsum.photos/seed/hyperion/180/270", description: "Pilgrims to the Time Tombs on Hyperion." },
    { id: "neuromancer", title: "Neuromancer", genre: "Cyberpunk", cover: "https://picsum.photos/seed/neuromancer/180/270", description: "The matrix has you. Follow the white rabbit." },
    
    // Romance & Drama
    { id: "pride-prejudice", title: "Pride & Prejudice", genre: "Classic Romance", cover: "https://picsum.photos/seed/pride-prejudice/180/270", description: "A love story that transcends time and class." },
    { id: "jane-eyre", title: "Jane Eyre", genre: "Gothic Romance", cover: "https://picsum.photos/seed/jane-eyre/180/270", description: "I am no bird; and no net ensnares me." },
    { id: "wuthering-heights", title: "Wuthering Heights", genre: "Dark Romance", cover: "https://picsum.photos/seed/wuthering-heights/180/270", description: "Whatever our souls are made of, his and mine are the same." },
    { id: "outlander", title: "Outlander", genre: "Time Travel Romance", cover: "https://picsum.photos/seed/outlander/180/270", description: "Through the stones, across time, for love." },
    
    // Mystery & Thriller
    { id: "sherlock", title: "Sherlock Holmes", genre: "Mystery Classic", cover: "https://picsum.photos/seed/sherlock/180/270", description: "The game is afoot. Elementary, my dear Watson." },
    { id: "gone-girl", title: "Gone Girl", genre: "Psychological Thriller", cover: "https://picsum.photos/seed/gone-girl/180/270", description: "Marriage is complicated. So is murder." },
    { id: "girl-dragon", title: "The Girl with the Dragon Tattoo", genre: "Nordic Noir", cover: "https://picsum.photos/seed/girl-dragon/180/270", description: "Evil lurks in family secrets." },
    { id: "da-vinci", title: "Da Vinci Code", genre: "Religious Thriller", cover: "https://picsum.photos/seed/da-vinci/180/270", description: "History's greatest secret is about to be revealed." },
    
    // Horror & Supernatural
    { id: "dracula", title: "Dracula", genre: "Gothic Horror", cover: "https://picsum.photos/seed/dracula/180/270", description: "The blood is the life. And it shall be mine." },
    { id: "frankenstein", title: "Frankenstein", genre: "Gothic Horror", cover: "https://picsum.photos/seed/frankenstein/180/270", description: "I should be thy Adam, but I am rather the fallen angel." },
    { id: "stephen-king-it", title: "IT", genre: "Supernatural Horror", cover: "https://picsum.photos/seed/stephen-king-it/180/270", description: "They all float down here. Welcome to Derry." },
    { id: "exorcist", title: "The Exorcist", genre: "Demonic Horror", cover: "https://picsum.photos/seed/exorcist/180/270", description: "The power of Christ compels you." },
    
    // Adventure & Action
    { id: "indiana-jones", title: "Indiana Jones", genre: "Adventure", cover: "https://picsum.photos/seed/indiana-jones/180/270", description: "X never, ever marks the spot." },
    { id: "james-bond", title: "James Bond", genre: "Spy Thriller", cover: "https://picsum.photos/seed/james-bond/180/270", description: "Bond. James Bond. Shaken, not stirred." },
    { id: "jack-reacher", title: "Jack Reacher", genre: "Military Thriller", cover: "https://picsum.photos/seed/jack-reacher/180/270", description: "I don't have a phone. I don't have a computer. I don't have an address." },
    { id: "jason-bourne", title: "Jason Bourne", genre: "Spy Action", cover: "https://picsum.photos/seed/jason-bourne/180/270", description: "I can tell you the license plate numbers of all six cars outside." },
    
    // Additional Popular Titles (Top 215)
    { id: "harry-potter", title: "Harry Potter", genre: "Magic School", cover: "https://picsum.photos/seed/harry-potter/180/270", description: "The boy who lived. The wizard who changed everything." },
    { id: "lotr", title: "Lord of the Rings", genre: "Epic Fantasy", cover: "https://picsum.photos/seed/lotr/180/270", description: "One ring to rule them all. One journey to end them all." },
    { id: "hobbit", title: "The Hobbit", genre: "Fantasy Adventure", cover: "https://picsum.photos/seed/hobbit/180/270", description: "An unexpected journey. A grand adventure." },
    { id: "narnia", title: "The Chronicles of Narnia", genre: "Portal Fantasy", cover: "https://picsum.photos/seed/narnia/180/270", description: "Through the wardrobe, into a world of magic." },
    { id: "percy-jackson", title: "Percy Jackson", genre: "Greek Mythology", cover: "https://picsum.photos/seed/percy-jackson/180/270", description: "The gods of Olympus are alive and well in America." },
    { id: "hunger-games", title: "The Hunger Games", genre: "Dystopian YA", cover: "https://picsum.photos/seed/hunger-games/180/270", description: "May the odds be ever in your favor." },
    { id: "maze-runner", title: "The Maze Runner", genre: "Dystopian Sci-Fi", cover: "https://picsum.photos/seed/maze-runner/180/270", description: "Welcome to the Glade. Solve the maze. Survive." },
    { id: "divergent", title: "Divergent", genre: "Dystopian Future", cover: "https://picsum.photos/seed/divergent/180/270", description: "Faction before blood. Choice defines you." },
    
    // Continue with more titles to reach 215...
    { id: "twilight", title: "Twilight", genre: "Paranormal Romance", cover: "https://picsum.photos/seed/twilight/180/270", description: "About three things I was absolutely positive." },
    { id: "fault-stars", title: "The Fault in Our Stars", genre: "Contemporary YA", cover: "https://picsum.photos/seed/fault-stars/180/270", description: "Some infinities are bigger than other infinities." },
    { id: "looking-alaska", title: "Looking for Alaska", genre: "Contemporary YA", cover: "https://picsum.photos/seed/looking-alaska/180/270", description: "Imagining the future is a kind of nostalgia." },
    { id: "paper-towns", title: "Paper Towns", genre: "Mystery YA", cover: "https://picsum.photos/seed/paper-towns/180/270", description: "It's not hard to get lost in a paper town." },
    { id: "giver", title: "The Giver", genre: "Dystopian Classic", cover: "https://picsum.photos/seed/giver/180/270", description: "The worst part of holding the memories is not the pain." },
    { id: "ender-game", title: "Ender's Game", genre: "Military Sci-Fi", cover: "https://picsum.photos/seed/ender-game/180/270", description: "The enemy's gate is down." }
  ];

  const awakenBook = async (book) => {
    // Close any currently playing book
    if (activeBook && activeBook.id !== book.id) {
      setIsPlaying(false);
      setAudioUrl(null);
      setCurrentImage(null);
      setStoryContent(null);
    }

    setError(null);
    setIsAwakening(true);
    setActiveBook(book);
    setAudioUrl(null);
    setCurrentImage(null);
    setStoryContent(null);

    try {
      // Generate story content first
      const storyResponse = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          series: book.id, 
          chapterNumber: 1,
          aiModel: selectedAI 
        })
      });

      const storyData = await storyResponse.json();
      setStoryContent(storyData);

      // Generate AI image for the scene
      const imagePrompt = `${book.title} - ${storyData.chapterTitle}. Cinematic, dramatic lighting, fantasy art style, high detail`;
      const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=600&seed=${book.id}`;
      setCurrentImage(imageUrl);

      // Generate TTS audio
      if (NOIZ_API_KEY) {
        const audioResponse = await fetch("https://api.noiz.ai/v1/tts", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${NOIZ_API_KEY}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            text: storyData.chapter,
            voice_id: book.id.includes('vampire') ? "narrator_pro_01" : "narrator_pro_02",
            speed: 0.9
          })
        });

        if (audioResponse.ok) {
          const audioData = await audioResponse.json();
          setAudioUrl(audioData.audio_url);
          setIsPlaying(true);
        }
      }
    } catch (err) {
      setError("Failed to awaken book. Please check your connection.");
      console.error(err);
    } finally {
      setIsAwakening(false);
    }
  };

  const stopBook = () => {
    setIsPlaying(false);
    setAudioUrl(null);
    setCurrentImage(null);
    setStoryContent(null);
    setActiveBook(null);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>XAVIER-OS <span style={styles.accent}>AETHERIA</span></h1>
        <p style={styles.status}>SYSTEM STATUS: {isAwakening ? "PROCESSING..." : "ONLINE"}</p>
      </header>

      {activeBook && (
        <div style={styles.nowPlaying}>
          <div style={styles.visualContainer}>
            {currentImage && (
              <img src={currentImage} alt="Story Scene" style={styles.sceneImage} />
            )}
            <div style={styles.imageOverlay}>
              <h2 style={styles.bookTitle}>{activeBook.title}</h2>
              <p style={styles.genre}>{activeBook.genre}</p>
              {storyContent && (
                <p style={styles.chapterInfo}>{storyContent.chapterTitle}</p>
              )}
            </div>
          </div>
          
          <div style={styles.controls}>
            {isAwakening && <div className="loader">Awakening story...</div>}
            {error && <p style={{color: 'red'}}>{error}</p>}
            
            {audioUrl && (
              <div style={styles.audioContainer}>
                <audio 
                  controls 
                  src={audioUrl} 
                  autoPlay 
                  style={styles.audioPlayer}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  onEnded={() => {
                    // Auto-generate next chapter
                    if (storyContent) {
                      awakenBook({...activeBook, chapterNumber: (storyContent.chapterNumber || 1) + 1});
                    }
                  }}
                >
                  Your browser does not support the audio element.
                </audio>
                
                <button onClick={stopBook} style={styles.stopButton}>
                  Close Book
                </button>
              </div>
            )}
            
            {storyContent && (
              <div style={styles.storyInfo}>
                <p><strong>Words:</strong> {storyContent.wordCount}</p>
                <p><strong>Read Time:</strong> {storyContent.estimatedReadTime} min</p>
                <p><strong>Protagonist:</strong> {storyContent.protagonist}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* AI Model Selection */}
      <div style={styles.aiSelector}>
        <label style={styles.aiLabel}>AI Model:</label>
        <select 
          value={selectedAI} 
          onChange={(e) => setSelectedAI(e.target.value)}
          style={styles.aiSelect}
        >
          <option value="gemini">Gemini (Free)</option>
          <option value="grok">Grok (Free)</option>
          <option value="mistral">Mistral (Free)</option>
          <option value="claude">Claude (Paid)</option>
          <option value="gpt4">GPT-4 (Paid)</option>
          <option value="sonnet">Sonnet (Paid)</option>
        </select>
      </div>

      <section style={styles.grid}>
        {bookLibrary.map((book) => (
          <div key={book.id} style={styles.card} onClick={() => awakenBook(book)}>
            <div style={styles.imageWrapper}>
              <img src={book.cover} alt={book.title} style={styles.coverImage} />
              <div style={styles.overlay}>
                <span style={styles.awakenText}>AWAKEN</span>
              </div>
            </div>
            <h3 style={styles.bookTitle}>{book.title}</h3>
          </div>
        ))}
      </section>
    </div>
  );
};

const styles = {
  container: { backgroundColor: '#050505', color: '#fff', minHeight: '100vh', padding: '20px', fontFamily: '"Segoe UI", Roboto, sans-serif' },
  header: { textAlign: 'center', marginBottom: '40px', borderBottom: '1px solid #222', paddingBottom: '20px' },
  logo: { fontSize: '1.8rem', letterSpacing: '6px', margin: 0 },
  status: { fontSize: '0.6rem', color: '#00ff00', letterSpacing: '2px', marginTop: '5px' },
  accent: { color: '#ff3e3e', fontWeight: 'bold' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '25px' },
  card: { cursor: 'pointer', textAlign: 'center', transition: '0.3s' },
  imageWrapper: { position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid #333' },
  coverImage: { width: '100%', aspectRatio: '2/3', objectFit: 'cover', display: 'block' },
  overlay: { position: 'absolute', inset: 0, backgroundColor: 'rgba(255,62,62,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0, transition: '0.3s' },
  awakenText: { fontWeight: 'bold', fontSize: '0.8rem', border: '1px solid white', padding: '5px 10px' },
  bookTitle: { marginTop: '12px', fontSize: '0.85rem', fontWeight: '500' },
  
  // Audiovisual Player Styles
  nowPlaying: { 
    display: 'flex', 
    gap: '25px', 
    backgroundColor: '#111', 
    padding: '25px', 
    borderRadius: '15px', 
    marginBottom: '40px', 
    border: '1px solid #ff3e3e33',
    position: 'relative'
  },
  visualContainer: { 
    position: 'relative', 
    width: '400px', 
    height: '300px', 
    borderRadius: '12px', 
    overflow: 'hidden',
    border: '2px solid rgba(255,62,62,0.3)'
  },
  sceneImage: { 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover', 
    filter: 'brightness(0.8) contrast(1.1)' 
  },
  imageOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))', 
    padding: '20px', 
    color: 'white' 
  },
  bookTitle: { 
    margin: 0, 
    fontSize: '1.5rem', 
    fontWeight: 'bold', 
    textShadow: '0 2px 4px rgba(0,0,0,0.8)' 
  },
  genre: { 
    margin: '5px 0', 
    color: '#ffd700', 
    fontSize: '0.9rem' 
  },
  chapterInfo: { 
    margin: 0, 
    fontSize: '0.8rem', 
    opacity: 0.8 
  },
  controls: { 
    display: 'flex', 
    flexDirection: 'column', 
    justifyContent: 'center', 
    flex: 1 
  },
  audioContainer: { 
    display: 'flex', 
    flexDirection: 'column', 
    gap: '15px' 
  },
  audioPlayer: { 
    width: '100%', 
    filter: 'invert(1)',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px'
  },
  stopButton: { 
    padding: '10px 20px', 
    backgroundColor: '#ff3e3e', 
    color: 'white', 
    border: 'none', 
    borderRadius: '5px', 
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  storyInfo: { 
    marginTop: '20px', 
    padding: '15px', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: '8px',
    fontSize: '0.9rem'
  },
  
  // AI Selector Styles
  aiSelector: { 
    display: 'flex', 
    alignItems: 'center', 
    gap: '10px', 
    marginBottom: '30px', 
    justifyContent: 'center' 
  },
  aiLabel: { 
    color: '#ffd700', 
    fontWeight: 'bold' 
  },
  aiSelect: { 
    padding: '8px 15px', 
    backgroundColor: '#000', 
    color: '#ffd700', 
    border: '1px solid #ffd700', 
    borderRadius: '5px',
    cursor: 'pointer'
  }
};

// Required to make the component available to the rest of your app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<XavierOS />);
