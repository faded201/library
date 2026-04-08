import React, { useState, useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';

const XavierOS = () => {
  // --- UI STATE ---
  const [viewMode, setViewMode] = useState('home'); // 'home', 'detail', 'player', 'inventory'
  const [currentGenre, setCurrentGenre] = useState('all');
  const [selectedBook, setSelectedBook] = useState(null);
  const [currentEpisode, setCurrentEpisode] = useState(1);
  const [apiSettingsOpen, setApiSettingsOpen] = useState(false);
  const [activeAI, setActiveAI] = useState(typeof window !== 'undefined' ? localStorage.getItem('active_ai') || 'gemini' : 'gemini');
  const [activeTTS, setActiveTTS] = useState(typeof window !== 'undefined' ? localStorage.getItem('active_tts') || 'streamelements' : 'streamelements');
  const [apiKeys, setApiKeys] = useState({
    gemini: typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '',
    grok: typeof window !== 'undefined' ? localStorage.getItem('grok_api_key') || '' : '',
    mistral: typeof window !== 'undefined' ? localStorage.getItem('mistral_api_key') || '' : '',
    claude: typeof window !== 'undefined' ? localStorage.getItem('claude_api_key') || '' : '',
    openai: typeof window !== 'undefined' ? localStorage.getItem('openai_api_key') || '' : '',
    sonnet: typeof window !== 'undefined' ? localStorage.getItem('sonnet_api_key') || '' : '',
    noiz: typeof window !== 'undefined' ? localStorage.getItem('noiz_api_key') || '' : '',
    google: typeof window !== 'undefined' ? localStorage.getItem('google_api_key') || '' : ''
  });

  // --- ECONOMY & TCG STATE ---
  const [inventory, setInventory] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage.getItem('xavier_inventory') : null;
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
  const [playlistIndex, setPlaylistIndex] = useState(0);
  const [apiUsage, setApiUsage] = useState(typeof window !== 'undefined' ? parseInt(localStorage.getItem('api_usage') || '0') : 0);

  const audioRef = useRef(null);
  const bgmRef = useRef(null);
  const listeningTimer = useRef(0);
  const errorCount = useRef(0);

  // Set background music volume very low so it doesn't overpower the voice
  useEffect(() => {
    if (bgmRef.current) bgmRef.current.volume = 0.08;
  });

  // Play sound effects
  const playSfx = (type) => {
    try {
      const url = type === 'unlock'
        ? 'https://cdn.pixabay.com/audio/2021/08/04/audio_bb630cc098.mp3'
        : 'https://cdn.pixavian.com/audio/2022/03/10/audio_c8c8a73467.mp3';
      const sfx = new Audio(url);
      sfx.volume = 0.4;
      sfx.play();
    } catch(e) {}
  };

  // Track API Calls
  const logApiCall = () => {
    setApiUsage(prev => {
      const newVal = prev + 1;
      localStorage.setItem('api_usage', newVal.toString());
      return newVal;
    });
  };

  // Global Books Database
  const books = typeof window !== 'undefined' ? window.booksDatabase || [] : [];
  const filteredBooks = currentGenre === 'all'
    ? books
    : books.filter(b => b.genre?.toLowerCase().includes(currentGenre.toLowerCase()));

  // Helper to fetch actual protagonist names for the portrait circles
  const getProtagonist = (book) => {
    const chars = {
      'my-vampire-system': 'Quinn Talen', 'shadow-monarch': 'Sung Jin-Woo', 'solo-leveling': 'Sung Jin-Woo',
      'my-dragonic-system': 'Aeron Draketh', 'birth-demonic-sword': 'Cain Valdris', 'legendary-beast-tamer': 'Kael Wildheart',
      'heavenly-thief': 'Zephyr Nightshade', 'nano-machine': 'Cheon Yeo-Woon', 'second-life-ranker': 'Yeon-woo Cha',
      'beginning-after-end': 'Arthur Leywin', 'omniscient-reader': 'Kim Dokja', 'overgeared': 'Grid'
    };
    return chars[book.id] || 'epic fantasy protagonist';
  };

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
        playSfx('unlock');
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

      playSfx('craft');
      setLatestUnlock(newCard);
      setTimeout(() => setLatestUnlock(null), 6000);

      const newTx = { id: Date.now(), desc: `Forged Rare Card`, amount: -100, date: new Date().toLocaleDateString() };
      return { ...prev, cards: [newCard, ...remaining], aetherium: prev.aetherium - 100, aetheriumHistory: [newTx, ...(prev.aetheriumHistory || [])].slice(0, 50) };
    });
    setCraftingSlots([]);
  };

  // Play individual audio chunks and update visual storyline
  const playChunk = async (chunksArray, index, bookData, characterMemory) => {
    if (!chunksArray || index >= chunksArray.length) return;

    const chunkText = chunksArray[index];
    setProgress(((index + 1) / chunksArray.length) * 100);

    // Generate images that actually follow the storyline based on the text chunk!
    const protagonist = getProtagonist(bookData);
    const safeText = chunkText.replace(/[^a-zA-Z0-9\s]/g, '').substring(0, 200);
    
    // Use character memory for 100% story-accurate images
    let characterDescription = '';
    if (characterMemory) {
      characterDescription = `Character appearance: ${characterMemory.traits.appearance}. Current personality: ${characterMemory.traits.personality}. Current goals: ${characterMemory.traits.goals}. Recent events: ${characterMemory.events.slice(-2).join(', ')}. World state: ${JSON.stringify(characterMemory.worldState)}.`;
    }
    
    // Create image prompt that follows the story narrative 100% with character memory
    const imagePrompt = `Cinematic scene from ${bookData.title}: ${protagonist} ${characterDescription} Scene: ${safeText}. Ultra-detailed character portrait, story-accurate appearance and personality, dramatic lighting, immersive book illustration style`;
    const newImageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=600&nologo=true&seed=${index}`;
    setCurrentImage(newImageUrl);

    // Audio TTS Fetch - StreamElements (most reliable free option)
    const ttsEngine = localStorage.getItem('active_tts') || 'streamelements';
    const googleKey = localStorage.getItem('google_api_key');
    const noizKey = localStorage.getItem('noiz_api_key');

    // Default to StreamElements Brian voice (most reliable)
    let url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(chunkText)}`;

    if (ttsEngine === 'google' && googleKey) {
      try {
        const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${googleKey}`, {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: { text: chunkText }, voice: { languageCode: 'en-US', name: 'en-US-Journey-D' }, audioConfig: { audioEncoding: 'MP3' }})
        });
        if (res.ok) { const d = await res.json(); url = "data:audio/mp3;base64," + d.audioContent; }
      } catch(e) { console.error('Google TTS error:', e); }
    } else if (ttsEngine === 'noiz' && noizKey) {
      try {
        const res = await fetch('https://api.noiz.ai/v1/audio/speech', {
          method: 'POST', headers: { 'Authorization': `Bearer ${noizKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ model: 'tts-1', input: chunkText, voice: 'alloy' })
        });
        if (res.ok) { const b = await res.blob(); url = URL.createObjectURL(b); }
      } catch(e) { console.error('Noiz TTS error:', e); }
    }

    setAudioUrl(url);
    return url;
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

      //
      let generatedStoryText = `Welcome to Episode ${episodeNum} of ${book.title}. The journey continues.`;
      let generatedTitle = `Episode ${episodeNum}`;

      try {
        logApiCall(); // Log AI Story generation request
        const aiRes = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            series: book.id,
            chapterNumber: episodeNum,
            aiModel: localStorage.getItem('active_ai') || 'gemini',
            apiKey: localStorage.getItem(`${localStorage.getItem('active_ai') || 'gemini'}_api_key`)
          })
        });
        if (aiRes.ok) {
          const aiData = await aiRes.json();
          generatedStoryText = aiData.chapter;
          generatedTitle = aiData.chapterTitle;
          characterMemory = aiData.characterMemory; // Store character memory
        }
        else {
          throw new Error("API Route not ok");
        }
      } catch(err) {
        console.error("AI Generation failed, using rich storyline fallback.");
        // Provide a rich, cinematic storyline so it reads like a real audiobook (Pocket FM style)
        generatedTitle = `Chapter ${episodeNum}: The Awakening`;
        generatedStoryText = `The air was thick and heavy in the ancient chamber. Shadows clung to the stone walls, retreating only when the glowing runes flared to life. ${getProtagonist(book)} stood in the center of the room, breathing deeply, feeling the surge of a dormant power awakening within. This was the moment foretold in the forgotten archives. "It is time," a voice echoed from the abyss, resonating with a celestial frequency. The ground trembled, and a blinding light erupted from the artifact resting on the pedestal. Everything ${getProtagonist(book)} knew was about to change. The true journey, filled with unimaginable perils and god-like adversaries, had finally begun.`;

        // Create default character memory for fallback
        characterMemory = {
          traits: {
            personality: "determined, resourceful, evolving",
            appearance: "ordinary looking, with subtle signs of power awakening",
            goals: "survive, grow stronger, protect loved ones"
          },
          relationships: {},
          events: [`Chapter ${episodeNum} begins`],
          worldState: { timeOfDay: "Unknown", location: "Mysterious place" }
        };
      }

      // Strip AI markdown formatting but preserve punctuation
      const cleanSpokenText = generatedStoryText.replace(/[*_#`~]/g, '').replace(/\n+/g, ' ').trim();

      // Safely split into sentences cross-browser without destroying quotes
      const sentences = cleanSpokenText.replace(/([.!?])\s+/g, "$1|").split("|");
      const chunks = [];
      let curr = "";
      sentences.forEach(s => {
        const sentence = s.trim();
        if (!sentence) return;

        if ((curr + " " + sentence).length > 180 && curr.length > 0) {
          chunks.push(curr.trim());
          curr = sentence;
        } else {
          curr = curr ? curr + " " + sentence : sentence;
        }
      });
      if (curr.trim()) chunks.push(curr.trim());

      setStoryContent({
        chapterTitle: generatedTitle,
        chapterNumber: episodeNum,
        wordCount: generatedStoryText.split(" ").length,
        estimatedReadTime: Math.ceil(generatedStoryText.split(" ").length / 200),
        protagonist: getProtagonist(book),
        chapter: generatedStoryText,
        chunks: chunks,
        characterMemory: characterMemory
      });

      setPlaylistIndex(0);
      setIsAwakening(false);
      playChunk(chunks, 0, book, characterMemory);
    } catch (err) {
      setError("Failed to awaken book.");
    } finally {
      setIsAwakening(false);
    }
  };

  const handleTimeUpdate = () => {
    errorCount.current = 0; // Successfully playing audio, reset error tracker
    listeningTimer.current += 1;
    if (listeningTimer.current > 120) {
      listeningTimer.current = 0;
      gainXP(10);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      if(bgmRef.current) bgmRef.current.pause();
      setIsPlaying(false);
    } else {
      errorCount.current = 0; // Reset error tracker on manual play
      audioRef.current.play();
      if(bgmRef.current) bgmRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleAudioEnded = () => {
    if (!storyContent || !storyContent.chunks) return; // Prevent async state loop crashes

    if (playlistIndex < storyContent.chunks.length - 1) {
      const nextIdx = playlistIndex + 1;
      setPlaylistIndex(nextIdx);
      playChunk(storyContent.chunks, nextIdx, selectedBook, storyContent.characterMemory);
    } else {
      setIsPlaying(false);
      gainXP(50);
      // Do NOT auto-advance to next episode - let user control navigation
      // awakenBook(selectedBook, currentEpisode + 1);
    }
  };

  const handleAudioError = (e) => {
    errorCount.current += 1;
    console.error('Audio error:', e);
    if (errorCount.current >= 3) {
      setError("Voice API connection lost or rate-limited. Playback paused.");
      setIsPlaying(false);
      if (audioRef.current) audioRef.current.pause();
      if (bgmRef.current) bgmRef.current.pause();
      return;
    }
    handleAudioEnded(); // Gracefully skip to the next sentence
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

      {/* API Usage Warning Toast */}
      {apiUsage >= 150 && (
        <div style={{...styles.unlockToast, top: latestUnlock ? '170px' : '80px', borderColor: '#ffaa00'}}>
          <h4 style={{margin: '0 0 5px 0', color: '#ffaa00', textTransform: 'uppercase'}}>⚠️ API Usage High</h4>
          <p style={{margin: 0, fontSize: '0.9rem'}}>You've made {apiUsage} API requests. You may hit rate limits soon.</p>
          <button onClick={() => {setApiUsage(0); localStorage.setItem('api_usage', '0')}} style={{marginTop: '8px', background: 'transparent', border: '1px solid #ffaa00', color: '#ffaa00', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', padding: '4px 8px'}}>Reset Counter</button>
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
                <label>Active Story AI</label>
                <select value={activeAI} onChange={e => setActiveAI(e.target.value)}>
                  <option value="gemini">Gemini (Free)</option>
                  <option value="grok">Grok (Free)</option>
                  <option value="mistral">Mistral (Free)</option>
                  <option value="claude">Claude (Paid)</option>
                  <option value="openai">OpenAI GPT-4 (Paid)</option>
                  <option value="sonnet">Claude Sonnet (Paid)</option>
                </select>
              </div>
              <div className="api-input-group">
                <label>Gemini API Key</label>
                <input type="password" value={apiKeys.gemini} onChange={e => setApiKeys({...apiKeys, gemini: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>Grok API Key</label>
                <input type="password" value={apiKeys.grok} onChange={e => setApiKeys({...apiKeys, grok: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>Mistral API Key</label>
                <input type="password" value={apiKeys.mistral} onChange={e => setApiKeys({...apiKeys, mistral: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>Claude API Key</label>
                <input type="password" value={apiKeys.claude} onChange={e => setApiKeys({...apiKeys, claude: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>OpenAI API Key</label>
                <input type="password" value={apiKeys.openai} onChange={e => setApiKeys({...apiKeys, openai: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>Sonnet API Key</label>
                <input type="password" value={apiKeys.sonnet} onChange={e => setApiKeys({...apiKeys, sonnet: e.target.value})} placeholder="Enter key" />
              </div>
            </div>
            <div className="api-section">
              <h4>Voice Models</h4>
              <div className="api-input-group">
                <label>Active Voice Engine</label>
                <select value={activeTTS} onChange={e => setActiveTTS(e.target.value)}>
                  <option value="streamelements">StreamElements (Free)</option>
                  <option value="google">Google Cloud TTS (Journey AI - Best)</option>
                  <option value="noiz">Noiz.ai (Paid)</option>
                </select>
              </div>
              <div className="api-input-group">
                <label>Google Cloud TTS API Key</label>
                <input type="password" value={apiKeys.google} onChange={e => setApiKeys({...apiKeys, google: e.target.value})} placeholder="Enter key" />
              </div>
              <div className="api-input-group">
                <label>Noiz.ai API Key</label>
                <input type="password" value={apiKeys.noiz} onChange={e => setApiKeys({...apiKeys, noiz: e.target.value})} placeholder="Enter key" />
              </div>
            </div>
            <div className="api-section">
              <h4 style={{ color: '#ff4d4d', marginTop: 0 }}>Danger Zone</h4>
              <button style={{ backgroundColor: 'transparent', color: '#ff4d4d', border: '1px solid #ff4d4d', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.85rem' }} onClick={() => {
                if (window.confirm("Are you sure you want to wipe all XP, Cards, and Aetherium to fix the glitch?")) {
                  setInventory({ xp: 0, level: 1, cards: [], aetherium: 0, aetheriumHistory: [] });
                  alert("Inventory and progress wiped clean.");
                }
              }}>
                Wipe Glitched Inventory
              </button>
            </div>
            <div className="api-actions">
              <button className="save-btn" onClick={() => {
                localStorage.setItem('active_ai', activeAI);
                localStorage.setItem('active_tts', activeTTS);
                localStorage.setItem('gemini_api_key', apiKeys.gemini);
                localStorage.setItem('grok_api_key', apiKeys.grok);
                localStorage.setItem('mistral_api_key', apiKeys.mistral);
                localStorage.setItem('claude_api_key', apiKeys.claude);
                localStorage.setItem('openai_api_key', apiKeys.openai);
                localStorage.setItem('sonnet_api_key', apiKeys.sonnet);
                localStorage.setItem('noiz_api_key', apiKeys.noiz);
                localStorage.setItem('google_api_key', apiKeys.google);
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
              <div className="books-grid-ancient">
                {filteredBooks.map(book => (
                  <div key={book.id} className="ancient-book-card" onClick={() => { setSelectedBook(book); setViewMode('detail'); }}>
                    <div className="book-3d-wrapper">
                      <div className="book-spine-visual"></div>
                      <div className="book-cover-ancient" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                        <img src={`https://image.pollinations.ai/prompt/Ancient%20ornate%20leather%20bound%20magic%20book%20cover%20featuring%20${book.cover || encodeURIComponent(book.title)}?width=300&height=450&nologo=true`} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        <div className="endless-badge" style={{ position: 'absolute', bottom: '10px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>✦ ENDLESS ✦</div>
                      </div>
                      <div className="book-pages-edge"></div>
                    </div>

                    <div className="book-info-ancient">
                      <h3 className="book-title-ancient">{book.title}</h3>
                      <p className="book-author" style={{margin: '0', fontSize: '13px', color: 'var(--text-secondary)'}}>{book.author || 'AI Generated'}</p>
                      <p className="book-genre-ancient" style={{marginTop: '8px'}}>{book.genre}</p>
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
                <div className="ancient-book-card large">
                  <div className="book-3d-wrapper">
                    <div className="book-spine-visual"></div>
                    <div className="book-cover-ancient" style={{ padding: 0, overflow: 'hidden', position: 'relative' }}>
                      <img src={`https://image.pollinations.ai/prompt/Ancient%20ornate%20leather%20bound%20magic%20book%20cover%20featuring%20${selectedBook.cover || encodeURIComponent(selectedBook.title)}?width=400&height=600&nologo=true`} alt={selectedBook.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                    </div>
                    <div className="book-pages-edge"></div>
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
                  <button className="start-listening-btn" onClick={() => { errorCount.current = 0; setViewMode('player'); awakenBook(selectedBook, 1); }}>
                    <span className="play-icon">▶</span> Start Listening
                  </button>
                </div>
                <div className="chapter-list">
                  <h3>Episodes</h3>
                  {[1,2,3,4,5].map(ep => (
                    <div key={ep} className="chapter-item" onClick={() => { errorCount.current = 0; setViewMode('player'); awakenBook(selectedBook, ep); }}>
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
                  {error ? (
                    <p style={{color: 'red'}}>{error}</p>
                  ) : (
                    <p style={{ lineHeight: '1.8' }}>
                      {storyContent?.chunks ? storyContent.chunks.map((chunk, idx) => (
                        <span key={idx} style={idx === playlistIndex ? { backgroundColor: 'rgba(0, 255, 204, 0.25)', color: '#fff', padding: '2px 4px', borderRadius: '4px', transition: 'background-color 0.3s ease' } : { padding: '2px 4px', transition: 'background-color 0.3s ease' }}>
                          {chunk}{' '}
                        </span>
                      )) : (storyContent?.chapter || '')}
                    </p>
                  )}
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
                <button className="control-btn" onClick={() => { errorCount.current = 0; awakenBook(selectedBook, Math.max(1, currentEpisode - 1)); }}>⏮</button>
                <button className="control-btn play-btn" onClick={togglePlay}>
                  <span className="play-icon">{isPlaying ? '⏸' : '▶'}</span>
                </button>
                <button className="control-btn" onClick={() => { errorCount.current = 0; awakenBook(selectedBook, currentEpisode + 1); }}>⏭</button>
              </div>

              <div className="settings-section">
                <button className="control-btn" onClick={() => setViewMode('home')}>✕</button>
              </div>
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

      {/* Hidden audio elements for playback - moved outside main for proper React rendering */}
      <audio ref={bgmRef} key="bgm-audio" src="https://cdn.pixavian.com/audio/2022/01/18/audio_d0a13f69d2.mp3" loop style={{ display: 'none' }} />
      <audio
        ref={audioRef}
        key={audioUrl ? `audio-${playlistIndex}` : 'no-audio'}
        src={audioUrl || ''}
        autoPlay={isPlaying}
        onPlay={() => {
          setIsPlaying(true);
          if(bgmRef.current) {
            bgmRef.current.volume = 0.08;
            bgmRef.current.play();
          }
        }}
        onPause={() => {
          setIsPlaying(false);
          if(bgmRef.current) bgmRef.current.pause();
        }}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleAudioEnded}
        onError={handleAudioError}
        style={{ display: 'none' }}
      />
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
if (typeof window !== 'undefined') {
  const rootElement = document.getElementById('root');
  if (rootElement) ReactDOM.createRoot(rootElement).render(<XavierOS />);
}

export default XavierOS;
