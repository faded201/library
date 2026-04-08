import express from 'express';
import cors from 'cors';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());

// Import the API handler (we'll need to compile the TS first)
const generateHandler = async (req, res) => {
  try {
    // For now, return a response with chunks for proper playback
    const chapterText = "The story begins with a mysterious awakening. Quinn Talen stood in the ancient chamber, feeling the surge of dormant power within. Shadows clung to the stone walls as glowing runes flared to life. This was the moment foretold in the forgotten archives. 'It is time,' a voice echoed from the abyss. The ground trembled, and a blinding light erupted from the artifact on the pedestal. Everything Quinn knew was about to change. The true journey, filled with unimaginable perils and god-like adversaries, had finally begun.";

    // Split into chunks for sequential playback
    const sentences = chapterText.replace(/([.!?])\s+/g, "$1|").split("|");
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

    res.json({
      chapter: chapterText,
      chapterTitle: "Chapter 1: The Awakening",
      wordCount: chapterText.split(" ").length,
      estimatedReadTime: Math.ceil(chapterText.split(" ").length / 200),
      protagonist: "Quinn Talen",
      series: "My Vampire System",
      chunks: chunks, // Add chunks for proper playback
      characterMemory: {
        traits: {
          personality: "determined, resourceful, evolving",
          appearance: "pale skin, sharp features, red eyes",
          goals: "power, survival, dominance"
        },
        relationships: {},
        events: ["Awakened with vampire powers"],
        worldState: { timeOfDay: "Night", location: "Modern Earth" }
      },
      aiModelUsed: "fallback"
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// API Routes
app.post('/api/generate', generateHandler);

// Check TTS service health (Node.js TTS on port 3003)
let ttsServiceAvailable = false;
checkTTSServiceHealth();

async function checkTTSServiceHealth() {
  try {
    const res = await fetch('http://localhost:3003/health', { signal: AbortSignal.timeout(2000) });
    ttsServiceAvailable = res.ok;
    console.log('🎵 TTS Service:', ttsServiceAvailable ? '✅ Available (Node.js)' : '❌ Not available (will use inline Google TTS)');
  } catch (e) {
    ttsServiceAvailable = false;
    console.log('🎵 TTS Service: ❌ Not available (will use inline Google TTS)');
  }
  // Re-check every 30 seconds
  setTimeout(checkTTSServiceHealth, 30000);
}

// TTS Proxy Route - Try TTS service first, fallback to inline Google TTS
app.get('/api/tts', async (req, res) => {
  try {
    console.log('🎵 TTS request:', req.query);
    const text = req.query.text;
    const emotion = req.query.emotion || 'neutral';
    
    if (!text) {
      return res.status(400).json({ error: 'Text parameter required' });
    }

    let audioBuffer;
    let source = 'unknown';

    // Try TTS service (Node.js wrapper around Google APIs)
    if (ttsServiceAvailable) {
      try {
        console.log(`🎵 Trying TTS service (emotion: ${emotion})...`);
        const ttsRes = await fetch(
          `http://localhost:3003/api/tts?text=${encodeURIComponent(text)}&emotion=${emotion}`,
          { signal: AbortSignal.timeout(15000) }
        );
        
        if (ttsRes.ok) {
          audioBuffer = await ttsRes.arrayBuffer();
          source = ttsRes.headers.get('X-TTS-Source') || 'TTS-Service';
          console.log(`✅ TTS service: Generated ${audioBuffer.byteLength} bytes`);
        } else {
          throw new Error(`TTS service returned ${ttsRes.status}`);
        }
      } catch (e) {
        console.warn(`⚠️  TTS service failed: ${e.message}, using inline Google TTS`);
        ttsServiceAvailable = false;
        audioBuffer = null;
      }
    }

    // Fallback to inline Google Translate TTS
    if (!audioBuffer) {
      try {
        console.log('🎵 Using inline Google Translate TTS...');
        const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=en`;
        
        const response = await fetch(ttsUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          },
          signal: AbortSignal.timeout(10000)
        });

        if (!response.ok) {
          throw new Error(`Google TTS failed: ${response.status}`);
        }

        audioBuffer = await response.arrayBuffer();
        source = 'GoogleTranslate-Inline';
        console.log(`✅ Google Translate TTS: Generated ${audioBuffer.byteLength} bytes`);
      } catch (e) {
        console.error(`❌ All TTS methods failed: ${e.message}`);
        throw e;
      }
    }

    // Return audio
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-TTS-Source', source);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(audioBuffer));

  } catch (error) {
    console.error('❌ TTS Error:', error.message);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'TTS generation failed', details: error.message });
  }
});

// Image Proxy Route to avoid CORS issues
app.get('/api/image', async (req, res) => {
  try {
    console.log('Image request received:', req.query);
    const prompt = req.query.prompt;
    if (!prompt) {
      return res.status(400).json({ error: 'Prompt parameter required' });
    }

    // Use pollinations.ai for image generation
    const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=800&height=600&nologo=true&seed=${req.query.seed || 0}`;
    console.log('Fetching image from:', imageUrl.substring(0, 100) + '...');

    const response = await fetch(imageUrl);

    console.log('Image response status:', response.status);
    if (!response.ok) {
      throw new Error(`Image request failed: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    console.log('Image buffer size:', imageBuffer.byteLength);
    
    res.setHeader('Content-Type', 'image/jpeg');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(Buffer.from(imageBuffer));
  } catch (error) {
    console.error('Image Proxy Error:', error);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(500).json({ error: 'Image generation failed', details: error.message });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});