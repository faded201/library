#!/usr/bin/env node
/**
 * High-Quality TTS Service for Xavier OS
 * Uses Google Cloud Text-to-Speech API with emotion-aware voice selection
 * Runs on port 3003 as a drop-in replacement for CosyVoice
 */

const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

// Voice selection based on emotion
const EMOTION_VOICES = {
  'neutral': { name: 'en-US-Neural2-C', gender: 'FEMALE' },
  'happy': { name: 'en-US-Neural2-A', gender: 'MALE' },    // Upbeat
  'sad': { name: 'en-US-Neural2-E', gender: 'FEMALE' },     // Somber
  'angry': { name: 'en-US-Neural2-B', gender: 'MALE' },     // Deep, intense
  'fearful': { name: 'en-US-Neural2-F', gender: 'FEMALE' }, // Tense
  'surprise': { name: 'en-US-Neural2-D', gender: 'MALE' }   // Energetic
};

// Emotion-specific pitch and rate adjustments
const EMOTION_ADJUSTMENTS = {
  'neutral': { pitch: 0, rate: 1.0 },
  'happy': { pitch: 2, rate: 1.1 },
  'sad': { pitch: -3, rate: 0.9 },
  'angry': { pitch: 1, rate: 0.95 },
  'fearful': { pitch: 1.5, rate: 0.85 },
  'surprise': { pitch: 3, rate: 1.15 }
};

/**
 * Use Google Translate TTS as primary (free, no API key required)
 */
async function generateWithGoogleTranslate(text) {
  try {
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&q=${encodeURIComponent(text)}&tl=en`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      },
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Google Translate TTS returned ${response.status}`);
    }

    return await response.buffer();
  } catch (error) {
    console.error('Google Translate TTS error:', error.message);
    throw error;
  }
}

/**
 * Fallback: Use Google Cloud TTS if API key available
 * Get free API key at: https://cloud.google.com/text-to-speech
 */
async function generateWithGoogleCloud(text, voice, emotion) {
  const apiKey = process.env.GOOGLE_CLOUD_TTS_KEY;
  if (!apiKey) return null;

  try {
    const adjustments = EMOTION_ADJUSTMENTS[emotion] || { pitch: 0, rate: 1.0 };
    
    const response = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize?key=' + apiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text },
        voice: {
          languageCode: 'en-US',
          name: voice.name,
          ssmlGender: voice.gender
        },
        audioConfig: {
          audioEncoding: 'MP3',
          pitch: adjustments.pitch,
          speakingRate: adjustments.rate
        }
      }),
      timeout: 10000
    });

    if (!response.ok) {
      throw new Error(`Google Cloud TTS returned ${response.status}`);
    }

    const data = await response.json();
    return Buffer.from(data.audioContent, 'base64');
  } catch (error) {
    console.error('Google Cloud TTS error:', error.message);
    return null;
  }
}

async function health(req, res) {
  return res.json({
    status: 'ok',
    service: 'Xavier OS TTS Service',
    version: '2.0 (Google Translate + Cloud fallback)',
    model_loaded: true,
    device: 'cloud',
    available_voices: Object.keys(EMOTION_VOICES)
  });
}

async function tts(req, res) {
  try {
    const text = req.method === 'GET' ? req.query.text : req.body?.text;
    const emotion = (req.method === 'GET' ? req.query.emotion : req.body?.emotion || 'neutral').toLowerCase();
    const speed = parseFloat(req.method === 'GET' ? req.query.speed : req.body?.speed || 1.0);

    if (!text) {
      return res.status(400).json({ error: 'text parameter required' });
    }

    if (!EMOTION_VOICES[emotion]) {
      console.warn(`Unknown emotion '${emotion}', using neutral`);
    }

    const voice = EMOTION_VOICES[emotion] || EMOTION_VOICES['neutral'];
    
    console.log(`🎵 TTS Request: emotion="${emotion}" text="${text.substring(0, 50)}..."`);

    let audioBuffer;
    let source = 'unknown';

    // Try Google Cloud TTS first (higher quality if API key available)
    if (process.env.GOOGLE_CLOUD_TTS_KEY) {
      audioBuffer = await generateWithGoogleCloud(text, voice, emotion);
      if (audioBuffer) {
        source = 'GoogleCloud';
        console.log(`✅ GoogleCloud TTS: ${audioBuffer.length} bytes`);
      }
    }

    // Fallback to Google Translate (free, always available)
    if (!audioBuffer) {
      audioBuffer = await generateWithGoogleTranslate(text);
      source = 'GoogleTranslate';
      console.log(`✅ GoogleTranslate TTS: ${audioBuffer.length} bytes`);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('X-TTS-Source', source);
    res.setHeader('X-TTS-Emotion', emotion);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.send(audioBuffer);

  } catch (error) {
    console.error('❌ TTS Error:', error.message);
    res.status(500).json({ 
      error: 'TTS generation failed', 
      details: error.message,
      hint: 'Make sure text is provided and is valid'
    });
  }
}

function getVoices(req, res) {
  return res.json({
    emotions: Object.keys(EMOTION_VOICES),
    voices: EMOTION_VOICES,
    descriptions: {
      'neutral': 'Professional, clear speaking voice',
      'happy': 'Upbeat, cheerful tone',
      'sad': 'Somber, emotional tone',
      'angry': 'Intense, passionate tone',
      'fearful': 'Tense, anxious tone',
      'surprise': 'Excited, energetic tone'
    }
  });
}

app.get('/health', health);
app.get('/api/tts', tts);
app.post('/api/tts', tts);
app.get('/api/voices', getVoices);

app.listen(PORT, '127.0.0.1', () => {
  console.log('========================================');
  console.log('🎵 Xavier OS TTS Service');
  console.log('========================================');
  console.log(`✅ Service running on http://127.0.0.1:${PORT}`);
  console.log('');
  console.log('Speech Synthesis Sources:');
  console.log('  • Primary: Google Translate TTS (free, no API key needed)');
  if (process.env.GOOGLE_CLOUD_TTS_KEY) {
    console.log('  • Optional: Google Cloud TTS (higher quality, API key set)');
  } else {
    console.log('  • Optional: Google Cloud (free tier available, set GOOGLE_CLOUD_TTS_KEY)');
  }
  console.log('');
  console.log('Available Emotions:');
  Object.keys(EMOTION_VOICES).forEach(emotion => {
    console.log(`  • ${emotion}`);
  });
  console.log('========================================');
  console.log('🚀 Ready for Express backend to connect!');
  console.log('========================================');
});
