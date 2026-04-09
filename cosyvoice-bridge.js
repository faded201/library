/**
 * MOBILE COSYVOICE BRIDGE
 * Accessible from phone/computer
 * Generates emotion-aware TTS + image sequences
 * Runs on port 3004
 */

import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 3004;

app.use(cors());
app.use(express.json());

// --- EMOTION-BASED VOICE SETTINGS ---
const EMOTIONS = {
  'neutral': { speed: 1.0, pitch: 0, description: 'Normal speaking voice' },
  'happy': { speed: 1.1, pitch: 0.5, description: 'Cheerful, upbeat' },
  'sad': { speed: 0.9, pitch: -0.5, description: 'Slow, emotional' },
  'angry': { speed: 0.95, pitch: 0.3, description: 'Intense, forceful' },
  'fearful': { speed: 0.85, pitch: 0.2, description: 'Tense, worried' },
  'surprise': { speed: 1.15, pitch: 0.4, description: 'Excited, shocked' }
};

// --- GET TTSAUDIO WITH EMOTION ---
app.get('/api/audio', async (req, res) => {
  try {
    const text = req.query.text;
    const emotion = (req.query.emotion || 'neutral').toLowerCase();

    if (!text) {
      return res.status(400).json({ error: 'text parameter required' });
    }

    if (!EMOTIONS[emotion]) {
      return res.status(400).json({ error: `Invalid emotion: ${emotion}. Valid: ${Object.keys(EMOTIONS).join(', ')}` });
    }

    console.log(`🎵 [CosyVoice Bridge] Audio request: emotion="${emotion}", text="${text.substring(0, 50)}..."`);

    // Forward to TTS service on port 3003 (running on same PC)
    const ttsUrl = `http://localhost:3003/api/tts?text=${encodeURIComponent(text)}&emotion=${emotion}`;
    
    const ttsResponse = await fetch(ttsUrl, {
      timeout: 20000
    });

    if (!ttsResponse.ok) {
      throw new Error(`TTS service error: ${ttsResponse.status}`);
    }

    const audioBuffer = await ttsResponse.buffer();
    
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Length', audioBuffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('X-Emotion', emotion);
    res.send(audioBuffer);

    console.log(`✅ [CosyVoice Bridge] Sent ${audioBuffer.length} bytes`);

  } catch (error) {
    console.error('❌ [CosyVoice Bridge] Error:', error.message);
    res.status(500).json({ 
      error: 'Audio generation failed', 
      details: error.message 
    });
  }
});

// --- GET IMAGE SEQUENCE FOR ANIMATION ---
app.get('/api/images', async (req, res) => {
  try {
    const prompt = req.query.prompt;
    const count = Math.min(parseInt(req.query.count || 3), 5); // Max 5 images
    const chunkIndex = parseInt(req.query.index || 0);

    if (!prompt) {
      return res.status(400).json({ error: 'prompt parameter required' });
    }

    console.log(`🎬 [CosyVoice Bridge] Image sequence request: ${count} images for prompt="${prompt.substring(0, 40)}..."`);

    const images = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const imagePrompt = `${prompt} (scene variation ${i + 1}/${count})`;
        const seed = (chunkIndex * 100) + i;  // Deterministic seed for consistency
        
        const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(imagePrompt)}?width=800&height=600&nologo=true&seed=${seed}`;
        
        console.log(`🎬 [CosyVoice Bridge] Fetching image ${i + 1}/${count}...`);
        
        const imgResponse = await fetch(pollUrl, { timeout: 15000 });
        
        if (imgResponse.ok) {
          const imgBuffer = await imgResponse.buffer();
          const imgBase64 = imgBuffer.toString('base64');
          images.push({
            index: i,
            dataUri: `data:image/jpeg;base64,${imgBase64}`,
            prompt: imagePrompt,
            delayMs: 500  // Show each image for 500ms before transition
          });
          console.log(`✅ [CosyVoice Bridge] Image ${i + 1} ok (${imgBuffer.length} bytes)`);
        } else {
          console.warn(`⚠️  [CosyVoice Bridge] Image ${i + 1} failed: ${imgResponse.status}`);
        }
      } catch (imgErr) {
        console.error(`❌ [CosyVoice Bridge] Image ${i + 1} error:`, imgErr.message);
        // Continue trying other images even if one fails
      }
    }

    if (images.length === 0) {
      return res.status(500).json({ error: 'Failed to generate any images' });
    }

    console.log(`✅ [CosyVoice Bridge] Returning ${images.length} images`);
    
    res.json({
      images: images,
      count: images.length,
      animationType: 'crossfade',  // Crossfade between images
      imageDisplayTime: 1500  // 1.5 seconds per image
    });

  } catch (error) {
    console.error('❌ [CosyVoice Bridge] Sequence error:', error.message);
    res.status(500).json({ 
      error: 'Image sequence generation failed', 
      details: error.message 
    });
  }
});

// --- COMBINED ENDPOINT: Audio + Images ---
app.get('/api/scene', async (req, res) => {
  try {
    const text = req.query.text;
    const emotion = (req.query.emotion || 'neutral').toLowerCase();
    const imageCount = Math.min(parseInt(req.query.images || 3), 5);
    const chunkIndex = parseInt(req.query.index || 0);

    if (!text) {
      return res.status(400).json({ error: 'text parameter required' });
    }

    console.log(`🎬 [CosyVoice Bridge] Complete scene request: "${emotion}" emotion, ${imageCount} images`);

    // Parallel fetch: audio + images
    const [audioReq, imagesReq] = await Promise.all([
      (async () => {
        try {
          const url = `http://localhost:3003/api/tts?text=${encodeURIComponent(text)}&emotion=${emotion}`;
          const res = await fetch(url, { timeout: 20000 });
          if (res.ok) {
            return { buffer: await res.buffer(), ok: true };
          } else {
            return { ok: false, error: `TTS error: ${res.status}` };
          }
        } catch (err) {
          return { ok: false, error: err.message };
        }
      })(),
      (async () => {
        try {
          const images = [];
          for (let i = 0; i < imageCount; i++) {
            const imageSeed = (chunkIndex * 100) + i;
            const pollUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(text)}?width=800&height=600&nologo=true&seed=${imageSeed}`;
            
            const imgRes = await fetch(pollUrl, { timeout: 15000 });
            if (imgRes.ok) {
              const imgBuffer = await imgRes.buffer();
              images.push({
                index: i,
                dataUri: `data:image/jpeg;base64,${imgBuffer.toString('base64')}`
              });
            }
          }
          return { images, ok: images.length > 0 };
        } catch (err) {
          return { ok: false, error: err.message };
        }
      })()
    ]);

    if (!audioReq.ok) {
      return res.status(500).json({ error: 'Audio generation failed', details: audioReq.error });
    }

    if (!imagesReq.ok || imagesReq.images.length === 0) {
      console.warn('⚠️  Image generation failed, but audio ok - returning audio only');
    }

    res.json({
      audio: {
        mimeType: 'audio/mpeg',
        sizeBytes: audioReq.buffer.length,
        duration: 'estimated'
      },
      images: imagesReq.images || [],
      imagesCount: imagesReq.images?.length || 0,
      emotion: emotion,
      textLength: text.length
    });

    console.log(`✅ [CosyVoice Bridge] Scene complete: ${audioReq.buffer.length} bytes audio + ${imagesReq.images?.length || 0} images`);

  } catch (error) {
    console.error('❌ [CosyVoice Bridge] Scene error:', error.message);
    res.status(500).json({ 
      error: 'Scene generation failed', 
      details: error.message 
    });
  }
});

// --- HEALTH CHECK ---
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'CosyVoice Bridge',
    port: PORT,
    endpoints: {
      audio: '/api/audio?text=...&emotion=...',
      images: '/api/images?prompt=...&count=...',
      scene: '/api/scene?text=...&emotion=...&images=...',
      voices: '/api/voices'
    },
    emotions: Object.keys(EMOTIONS)
  });
});

// --- VOICE DESCRIPTIONS ---
app.get('/api/voices', (req, res) => {
  res.json({
    emotions: EMOTIONS,
    description: 'Emotion-aware TTS bridge for Xavier OS'
  });
});

// --- START SERVER ---
app.listen(PORT, '0.0.0.0', () => {
  console.log('========================================');
  console.log('🎙️  CosyVoice Mobile Bridge');
  console.log('========================================');
  console.log(`✅ Bridge running on http://0.0.0.0:${PORT}`);
  console.log('');
  console.log('Endpoints:');
  console.log(`  📱 Audio:  http://localhost:${PORT}/api/audio`);
  console.log(`  🎬 Images: http://localhost:${PORT}/api/images`);
  console.log(`  🎭 Scene:  http://localhost:${PORT}/api/scene`);
  console.log('');
  console.log('Usage from phone:');
  console.log(`  http://<YOUR_PC_IP>:${PORT}/api/audio?text=Hello&emotion=happy`);
  console.log('');
  console.log('Emotions:', Object.keys(EMOTIONS).join(', '));
  console.log('========================================');
});
