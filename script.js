const { useState, useEffect, useRef } = React;

const XavierOS = () => {
  // --- UI STATE ---
  const [viewMode, setViewMode] = useState('home'); // 'home', 'detail', 'player', 'inventory'
  const [currentGenre, setCurrentGenre] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [apiKeys, setApiKeys] = useState({
    gemini: localStorage.getItem('gemini_api_key') || '',
    ttsai: localStorage.getItem('ttsai_api_key') || ''
  });

  // --- ECONOMY & TCG STATE ---
  const [inventory, setInventory] = useState(() => {
    const saved = localStorage.getItem('xavier_inventory');
    return saved ? JSON.parse(saved) : { xp: 0, level: 1, cards: [], aetherium: 0, aetheriumHistory: [] };
  });
  const [craftingSlots, setCraftingSlots] = useState([]);
  const [latestUnlock, setLatestUnlock] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false);

  // --- PLAYER STATE ---
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAwakening, setIsAwakening] = useState(false);
  const [storyContent, setStoryContent] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  
  const audioRef = useRef(null);
  const listeningTimer = useRef(0);

  // Global Books Database
  const books = window.booksDatabase || [];
  const filteredBooks = currentGenre === 'all' 
    ? books 
    : books.filter(b => b.genre?.toLowerCase().includes(currentGenre.toLowerCase()));

  // Sync Inventory
  useEffect(() => {
    localStorage.setItem('xavier_inventory', JSON.stringify(inventory));
  }, [inventory]);

  // Setup PayPal SDK
  useEffect(() => {
    if (!window.paypal) {
      const script = document.createElement("script");
      script.src = "https://www.paypal.com/sdk/js?client-id=test&currency=USD";
      script.async = true;
      script.onload = () => setPaypalLoaded(true);
      document.body.appendChild(script);
    } else {
      setPaypalLoaded(true);
    }
  }, []);

  // Render PayPal Buttons
  useEffect(() => {
    if (showPaymentModal && paypalLoaded && window.paypal) {
      const container = document.getElementById("paypal-button-container");
      if (container) container.innerHTML = "";
      window.paypal.Buttons({
        createOrder: (data, actions) => actions.order.create({ purchase_units: [{ amount: { value: "4.99" } }] }),
        onApprove: (data, actions) => actions.order.capture().then((details) => {
          setInventory(prev => {
            const newTx = { id: Date.now(), desc: `Aetherium Purchase`, amount: 500, date: new Date().toLocaleDateString() };
            return { ...prev, aetherium: (prev.aetherium || 0) + 500, aetheriumHistory: [newTx, ...(prev.aetheriumHistory || [])].slice(0, 50) };
          });
          setShowPaymentModal(false);
          alert(`Payment successful! 500 💎 added to your vault.`);
        })
      }).render("#paypal-button-container");
    }
  }, [showPaymentModal, paypalLoaded]);

  // XP & Economy Logic
  const gainXP = (amount) => {
    if (!selectedBook) return;
    setInventory(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newCards = [...prev.cards];
      
      if (newXp >= newLevel * 100) {
        newXp -= (newLevel * 100);
        newLevel += 1;
        const unlocked = rollForCard(selectedBook);
        newCards.unshift(unlocked);
        setLatestUnlock(unlocked);
        setTimeout(() => setLatestUnlock(null), 6000);
      }

      let newAetherium = (prev.aetherium || 0) + (amount / 2);
      let newHistory = prev.aetheriumHistory || [];
      if (amount >= 50) {
        const newTx = { id: Date.now(), desc: `Chapter Complete`, amount: amount / 2, date: new Date().toLocaleDateString() };
        newHistory = [newTx, ...newHistory].slice(0, 50);
      }
      return { ...prev, xp: newXp, level: newLevel, cards: newCards, aetherium: newAetherium, aetheriumHistory: newHistory };
    });
  };

  const rollForCard = (book) => {
    const roll = Math.random() * 100;
    let rarity = 'Common', color = '#a0a0a0';
    if (roll > 97) { rarity = 'Mythical'; color = '#ff4500'; }
    else if (roll > 85) { rarity = 'Legendary'; color = '#ffd700'; }
    else if (roll > 65) { rarity = 'Epic'; color = '#b026ff'; }
    else if (roll > 40) { rarity = 'Rare'; color = '#0070dd'; }
    
    const baseTrait = book ? book.genre.split(/[\s/]+/)[0] : 'Mystic';
    return { id: Date.now(), rarity, name: `${baseTrait} Core`, bookSource: book?.title || 'Unknown', color };
  };

  const toggleCraftingSelection = (cardId, rarity) => {
    if (rarity !== 'Common') return;
    setCraftingSlots(prev => {
      if (prev.includes(cardId)) return prev.filter(id => id !== cardId);
      if (prev.length < 3) return [...prev, cardId];
      return prev;
    });
  };

  const executeCrafting = () => {
    if (craftingSlots.length !== 3) return alert("Select exactly 3 Common cards to forge.");
    if ((inventory.aetherium || 0) < 100) return alert("Insufficient Aetherium 💎! Keep reading or purchase more.");

    setInventory(prev => {
      const remaining = prev.cards.filter(c => !craftingSlots.includes(c.id));
      const sac = prev.cards.filter(c => craftingSlots.includes(c.id));
      const baseName = sac[0]?.name.split(' ')[0] || 'Aether';
      const newCard = { id: Date.now(), rarity: 'Rare', name: `Refined ${baseName} Soul`, bookSource: 'The Aether Forge', color: '#0070dd' };
      
      setLatestUnlock(newCard);
      setTimeout(() => setLatestUnlock(null), 6000);

      const newTx = { id: Date.now(), desc: `Forged Rare Card`, amount: -100, date: new Date().toLocaleDateString() };
      return { ...prev, cards: [newCard, ...remaining], aetherium: prev.aetherium - 100, aetheriumHistory: [newTx, ...(prev.aetheriumHistory || [])].slice(0, 50) };
    });
    setCraftingSlots([]);
  };

  // Player & Generation Logic
  const awakenBook = async (book, episodeNum = 1) => {
    setError(null);
    setIsAwakening(true);
    setSelectedBook(book);
    setCurrentEpisode(episodeNum);
    setAudioUrl(null);
    setCurrentImage(null);
    setStoryContent(null);
    setProgress(0);

    try {
      const weights = { Mythical: 5, Legendary: 4, Epic: 3, Rare: 2, Common: 1 };
      const sortedCards = [...(inventory.cards || [])].sort((a, b) => weights[b.rarity] - weights[a.rarity]).slice(0, 3);
      const auraTraits = sortedCards.map(c => `${c.rarity} ${c.name}`).join(', ');
      const auraPrompt = auraTraits ? ` The listener possesses a supernatural aura defined by these artifacts: [${auraTraits}]. Extremely subtly weave an easter egg related to these artifacts into this chapter's narrative.` : "";

      // Placeholder API Generation Logic (You can swap this with real fetches)
      const storyData = {
         chapterNumber: episodeNum,
         chapterTitle: `Episode ${episodeNum}: New Horizons`,
         wordCount: 2500,
         estimatedReadTime: 15,
         protagonist: book.title,
         chapter: `The journey continues for our hero in ${book.title}. ${auraPrompt}`
      };
      setStoryContent(storyData);

      // Generate dynamic scene and character images
      const imagePrompt = `${book.title} scene ${episodeNum}. Cinematic, dramatic lighting, fantasy art style`;
      setCurrentImage(`https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=600&seed=${book.id}_ep${episodeNum}&nologo=true`);
      
      // Placeholder Audio
      setAudioUrl("https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3");
    } catch (err) {
      setError("Failed to awaken book.");
    } finally {
      setIsAwakening(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress((audioRef.current.currentTime / audioRef.current.duration) * 100);
    
    listeningTimer.current += 1;
    if (listeningTimer.current > 120) {
      listeningTimer.current = 0;
      gainXP(10);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  };
  
  const handleAudioEnded = () => {
     setIsPlaying(false);
     gainXP(50);
     awakenBook(selectedBook, currentEpisode + 1);
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', minHeight: '100vh', fontFamily: '"Inter", sans-serif' }}>
      
      {/* Navigation Header */}
      <nav className="nav-header">
        <div className="nav-brand" onClick={() => setViewMode('home')} style={{cursor: 'pointer'}}>
          <div className="logo-icon">📖</div>
          <span className="logo-text">Aetheria<span className="logo-dot">.ai</span></span>
        </div>
        <div className="nav-search">
          <input type="text" placeholder="Search audiobooks, authors, genres..." className="search-input" />
        </div>
        <div className="nav-actions" style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
          <div style={styles.wallet} onClick={() => setShowPaymentModal(true)} title="Get more Aetherium">
            <span>💎</span>
            <span style={{ color: '#00ffcc', fontWeight: 'bold' }}>{Math.floor(inventory.aetherium || 0)} AE</span>
          </div>
          <button className="nav-btn" onClick={() => setViewMode('inventory')} title="Aether Forge & Deck">🃏</button>
          <button className="nav-btn user-btn" title="Profile">👤</button>
          <button className="nav-btn menu-btn" onClick={() => setApiSettingsOpen(true)} title="Settings">⚙️</button>
        </div>
      </nav>

      {/* Toast Notification */}
      {latestUnlock && (
        <div style={{...styles.unlockToast, borderColor: latestUnlock.color}}>
          <h4 style={{margin: '0 0 5px 0', color: latestUnlock.color, textTransform: 'uppercase'}}>✨ {latestUnlock.rarity} Unlocked! ✨</h4>
          <p style={{margin: 0, fontSize: '0.9rem'}}>Acquired <strong>{latestUnlock.name}</strong></p>
          <p style={{margin: '5px 0 0 0', fontSize: '0.75rem', opacity: 0.8}}>Book: {latestUnlock.bookSource}</p>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div style={styles.paymentModalBackdrop}>
          <div style={styles.paymentModalContent}>
            <h2 style={{marginTop: 0, color: '#00ffcc'}}>Get Aetherium 💎</h2>
            <p style={{fontSize: '0.9rem', color: '#bbb', marginBottom: '20px'}}>Purchase <strong>500 Aetherium</strong> for $4.99 to power the Forge.</p>
            <button style={styles.stripeBtn} onClick={() => window.location.href="https://buy.stripe.com/test_YOUR_LINK"}>Pay with Stripe</button>
            <div style={styles.divider}><span style={styles.dividerText}>OR</span></div>
            <div id="paypal-button-container" style={{ minHeight: '150px' }}></div>
            <button style={styles.cancelBtn} onClick={() => setShowPaymentModal(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* API Settings Panel */}
      {apiSettingsOpen && (
        <div className="api-panel">
          <div className="api-panel-backdrop" onClick={() => setApiSettingsOpen(false)}></div>
          <div className="api-panel-content">
            <h3>🔑 API Configuration</h3>
            <div className="api-section">
              <h4>AI Models</h4>
              <div className="api-input-group">
                <label>Gemini API Key</label>
                <input type="password" value={apiKeys.gemini} onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>TTS.ai API Key</label>
                <input type="password" value={apiKeys.ttsai} onChange={e => setApiKeys({...apiKeys, ttsai: e.target.value})} placeholder="Enter key" />
              </div>
            </div>
            <div className="api-actions">
              <button className="save-btn" onClick={() => {
                localStorage.setItem('gemini_api_key', apiKeys.gemini);
                localStorage.setItem('ttsai_api_key', apiKeys.ttsai);
                setApiSettingsOpen(false);
              }}>Save</button>
              <button className="close-btn" onClick={() => setApiSettingsOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Glowing Ancient Scripture Background */}
      <div className="ancient-scripture">ᛟ ᚢ ᚱ ᛗ ᚨ ᚷ ᛁ ᚲ ᛒ ᛟ ᛟ ᚲ ᛊ <br/><br/> ᛟ ᚢ ᚱ ᛗ ᚨ ᚷ ᛁ ᚲ ᛒ ᛟ ᛟ ᚲ ᛊ</div>

      {/* Main Content Area */}
      <main className="main-content" style={{ padding: viewMode === 'player' ? '0' : '40px 24px', zIndex: 1, position: 'relative' }}>
        
        {/* 1. HOME VIEW */}
        {viewMode === 'home' && (
          <div className="view home-view">
            <section className="hero-section">
              <h1 className="hero-title">Stories Without</h1>
              <h2 className="hero-subtitle">Boundaries</h2>
              <p className="hero-description">Experience dynamic narration, AI-generated illustrations, and stories that adapt and grow as you listen.</p>
            </section>

            <section className="genre-filters">
              {['All', 'LitRPG', 'Cultivation', 'Sci-Fi', 'Fantasy', 'Mystery', 'Romance', 'Horror'].map(g => (
                <button key={g} className={`genre-pill ${currentGenre.toLowerCase() === g.toLowerCase() ? 'active' : ''}`} onClick={() => setCurrentGenre(g.toLowerCase())}>{g}</button>
              ))}
            </section>

            <section className="books-grid-section">
              <div className="books-grid">
                {filteredBooks.map(book => (
                  <div key={book.id} className="book-card" onClick={() => { setSelectedBook(book); setViewMode('detail'); }}>
                    <div className="book-cover-wrapper">
                      <div className="corner-ornament top-left"></div>
                      <div className="corner-ornament top-right"></div>
                      <div className="corner-ornament bottom-left"></div>
                      <div className="corner-ornament bottom-right"></div>
                      <div className="endless-badge">✦ ENDLESS</div>
                      
                      {/* Character Circle (AI Generated Protagonist) */}
                      <div className="character-circle" style={{
                          position: 'absolute', top: '15px', right: '15px', width: '50px', height: '50px',
                          borderRadius: '50%', border: '2px solid var(--gold-primary)', zIndex: 10,
                          backgroundImage: `url('https://image.pollinations.ai/prompt/portrait%20of%20protagonist%20from%20${encodeURIComponent(book.title)}?width=150&height=150&nologo=true')`,
                          backgroundSize: 'cover', backgroundPosition: 'center', boxShadow: '0 0 10px rgba(0,0,0,0.8)'
                      }}></div>

                      <div className="cover-image-container">
                        <img className="cover-image" src={`https://image.pollinations.ai/prompt/${encodeURIComponent(book.cover || book.title)}?width=400&height=600&seed=${book.id}&nologo=true`} alt={book.title} />
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
            </section>
          </div>
        )}

        {/* 2. DETAIL VIEW */}
        {viewMode === 'detail' && selectedBook && (
          <div className="view book-detail-view">
            <button className="back-btn" onClick={() => setViewMode('home')}><span className="back-arrow">←</span></button>
            <div className="book-detail-content">
              <div className="book-detail-left">
                <div className="book-cover-large">
                  <div className="corner-ornament top-left"></div>
                  <div className="corner-ornament top-right"></div>
                  <div className="corner-ornament bottom-left"></div>
                  <div className="corner-ornament bottom-right"></div>
                  <div className="endless-badge">✦ ENDLESS</div>
                  <div className="cover-image-container">
                    <img className="cover-image" src={`https://image.pollinations.ai/prompt/${encodeURIComponent(selectedBook.cover || selectedBook.title)}?width=400&height=600&seed=${selectedBook.id}&nologo=true`} alt={selectedBook.title} />
                  </div>
                </div>
              </div>
              <div className="book-detail-right">
                <div className="detail-badges">
                  <span className="genre-badge">{selectedBook.genre}</span>
                  <span className="ai-badge">✦ AI Never-Ending</span>
                </div>
                <h1 className="detail-title">{selectedBook.title}</h1>
                <p className="detail-author">By AI Generated</p>
                <p className="detail-description">{selectedBook.description}</p>
                <div className="detail-actions">
                  <button className="start-listening-btn" onClick={() => { setViewMode('player'); awakenBook(selectedBook, 1); }}>
                    <span className="play-icon">▶</span> Start Listening
                  </button>
                </div>
                <div className="chapter-list">
                  <h3>Episodes</h3>
                  {[1,2,3,4,5].map(ep => (
                    <div key={ep} className="chapter-item" onClick={() => { setViewMode('player'); awakenBook(selectedBook, ep); }}>
                      <span className="chapter-number">EP {ep}</span>
                      <span className="chapter-title">Episode {ep}</span>
                      <span className="chapter-duration">23:00</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PLAYER VIEW */}
        {viewMode === 'player' && selectedBook && (
          <div className="view player-view" style={{position: 'relative'}}>
            <div className="player-header">
              <button className="back-btn" style={{position: 'relative', top: 0, left: 0}} onClick={() => setViewMode('detail')}><span className="back-arrow">←</span></button>
              <div className="player-header-info">
                <h3 className="player-book-title">{selectedBook.title}</h3>
                <span className="player-chapter-label">CHAPTER {currentEpisode}</span>
              </div>
            </div>

            <div className="player-content">
              <div className="player-left">
                <div className="scene-image-container">
                  {isAwakening ? (
                    <div style={{display: 'flex', alignItems:'center', justifyContent:'center', height:'100%', color: 'var(--gold-primary)'}}>Summoning knowledge...</div>
                  ) : currentImage ? (
                    <img src={currentImage} alt="Story Scene" className="player-scene-image" />
                  ) : null}
                </div>
              </div>

              <div className="player-right">
                <h2 className="player-chapter-title">{storyContent?.chapterTitle || 'Loading...'}</h2>
                <div className="player-text-content">
                  {error ? <p style={{color: 'red'}}>{error}</p> : <p>{storyContent?.chapter || ''}</p>}
                </div>
              </div>
            </div>

            <div className="player-controls-bar">
              <div className="progress-section">
                <span className="time-current">00:00</span>
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${progress}%`}}></div>
                  <input type="range" className="progress-slider" min="0" max="100" value={progress} readOnly />
                </div>
                <span className="time-total">23:00</span>
              </div>

              <div className="controls-section">
                <button className="control-btn" onClick={() => awakenBook(selectedBook, Math.max(1, currentEpisode - 1))}>⏮</button>
                <button className="control-btn play-btn" onClick={togglePlay}>
                  <span className="play-icon">{isPlaying ? '⏸' : '▶'}</span>
                </button>
                <button className="control-btn" onClick={() => awakenBook(selectedBook, currentEpisode + 1)}>⏭</button>
              </div>

              <div className="settings-section">
                <button className="control-btn" onClick={() => setViewMode('home')}>✕</button>
              </div>

              {audioUrl && (
                <audio ref={audioRef} src={audioUrl} autoPlay onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)} onTimeUpdate={handleTimeUpdate} onEnded={handleAudioEnded} style={{ display: 'none' }}></audio>
              )}
            </div>
          </div>
        )}

        {/* 4. INVENTORY / FORGE VIEW */}
        {viewMode === 'inventory' && (
          <div className="view inventory-view" style={{ maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
            <button className="back-btn" style={{position: 'relative', top: 0, left: 0, marginBottom: '20px'}} onClick={() => setViewMode('home')}><span className="back-arrow">←</span></button>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '20px', background: 'var(--bg-secondary)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <h2 style={{ margin: 0, color: 'var(--gold-primary)', fontFamily: '"Cinzel", serif' }}>Aetheria Reader Level: {inventory.level}</h2>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', display: 'flex', gap: '20px' }}>
                <span>XP: {Math.floor(inventory.xp)} / {inventory.level * 100}</span>
                <span style={{color: '#00ffcc'}}>💎 {Math.floor(inventory.aetherium || 0)}</span>
              </div>
            </div>

            <div className="forge-container">
              <div className="forge-header">
                <h3 style={{ margin: 0, color: '#fff' }}>⚒️ The Aether Forge</h3>
                <button onClick={() => setShowPaymentModal(true)} className="buy-btn">+ Buy Aetherium</button>
              </div>
              <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Select 3 Common cards below to forge into 1 Rare. Your rarest cards build your "Aura" and actively shape the events of any audiobook you listen to.</p>
              <button onClick={executeCrafting} className={`forge-btn ${craftingSlots.length === 3 ? 'ready' : ''}`}>
                Forge Rare Card (Cost: 100 💎) [{craftingSlots.length}/3]
              </button>
            </div>

            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', fontFamily: '"Cinzel", serif' }}>Your Tradeable Skill Cards</h3>
            <div style={styles.cardGrid}>
              {inventory.cards.length === 0 && <p style={{ opacity: 0.6, fontStyle: 'italic', padding: '40px' }}>Keep listening to books to unlock powerful skill cards...</p>}
              {inventory.cards.map(card => (
                <div key={card.id} className={`trading-card ${card.rarity.toLowerCase()} ${craftingSlots.includes(card.id) ? 'selected-for-craft' : ''}`} onClick={() => toggleCraftingSelection(card.id, card.rarity)}>
                  <div className="tcg-header">
                    <span className="tcg-rarity" style={{ color: card.color }}>{card.rarity}</span>
                  </div>
                  <div className="tcg-art">
                    <div className="tcg-art-inner" style={{ backgroundColor: card.color, color: card.color }}></div>
                  </div>
                  <div className="tcg-body">
                    <div className="tcg-name">{card.name}</div>
                    <div className="tcg-origin">Origin: {card.bookSource}</div>
                  </div>
                </div>
              ))}
            </div>

            <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px', marginTop: '40px', fontFamily: '"Cinzel", serif' }}>Aetherium Ledger</h3>
            <div style={styles.ledgerContainer}>
              <table style={styles.ledgerTable}>
                <thead>
                  <tr><th style={styles.ledgerTh}>Date</th><th style={styles.ledgerTh}>Description</th><th style={{...styles.ledgerTh, textAlign: 'right'}}>Amount</th></tr>
                </thead>
                <tbody>
                  {(!inventory.aetheriumHistory || inventory.aetheriumHistory.length === 0) ? (
                    <tr><td colSpan="3" style={{...styles.ledgerTd, textAlign: 'center', opacity: 0.5}}>No transactions yet.</td></tr>
                  ) : (
                    inventory.aetheriumHistory.map(tx => (
                      <tr key={tx.id}>
                        <td style={styles.ledgerTd}>{tx.date}</td>
                        <td style={styles.ledgerTd}>{tx.desc}</td>
                        <td style={{...styles.ledgerTd, textAlign: 'right', color: tx.amount > 0 ? '#00ffcc' : '#ff4d4d', fontWeight: 'bold'}}>{tx.amount > 0 ? '+' : ''}{tx.amount} 💎</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};

const styles = {
  wallet: {
    display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 255, 204, 0.05)', 
    padding: '8px 16px', borderRadius: '20px', border: '1px solid rgba(0, 255, 204, 0.2)', 
    boxShadow: '0 0 10px rgba(0, 255, 204, 0.1)', cursor: 'pointer', transition: 'all 0.3s ease' 
  },
  unlockToast: { position: 'fixed', top: '80px', right: '20px', padding: '15px 25px', backgroundColor: 'rgba(10,10,15,0.95)', borderLeft: '4px solid', borderRadius: '4px', zIndex: 9999, boxShadow: '0 4px 15px rgba(0,0,0,0.8)', transition: 'all 0.3s ease' },
  paymentModalBackdrop: { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, backdropFilter: 'blur(5px)' },
  paymentModalContent: { backgroundColor: '#1a1a24', padding: '30px', borderRadius: '12px', width: '350px', textAlign: 'center', border: '1px solid #333', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' },
  stripeBtn: { backgroundColor: '#635bff', color: '#fff', padding: '12px', width: '100%', borderRadius: '4px', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', transition: '0.2s' },
  divider: { borderBottom: '1px solid #444', position: 'relative', margin: '20px 0' },
  dividerText: { position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#1a1a24', padding: '0 10px', color: '#888', fontSize: '0.8rem' },
  cancelBtn: { backgroundColor: 'transparent', color: '#ff4d4d', padding: '10px', width: '100%', border: '1px solid #ff4d4d', borderRadius: '4px', marginTop: '15px', cursor: 'pointer' },
  cardGrid: { display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center', padding: '20px 0' },
  ledgerContainer: { backgroundColor: '#111', borderRadius: '8px', padding: '15px', border: '1px solid #333', overflowX: 'auto' },
  ledgerTable: { width: '100%', borderCollapse: 'collapse', textAlign: 'left' },
  ledgerTh: { padding: '10px', borderBottom: '1px solid #444', color: '#888', fontWeight: 'normal', fontSize: '0.9rem' },
  ledgerTd: { padding: '10px', borderBottom: '1px solid #222', fontSize: '0.95rem' }
};

// Required to make the component available to the rest of your app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<XavierOS />);
