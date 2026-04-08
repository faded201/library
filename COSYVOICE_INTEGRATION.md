# 🎵 CosyVoice TTS Integration Guide

## Overview

CosyVoice has been integrated into Xavier OS audiobook app to provide **emotional text-to-speech synthesis**. The system automatically detects emotions in story text and generates appropriately expressive audio narration.

### What This Means

- **Before**: Static Google Translate TTS (monotone, no emotion)
- **After**: CosyVoice with emotion detection (happy, sad, angry, fearful, surprised, neutral)
- **Fallback**: Google Translate TTS if CosyVoice is unavailable

---

## Architecture

```
Xavier OS App (React)
    ↓ http://localhost:3001
    ↓
Express Backend (Node.js)
    ↓ http://localhost:3002 (checks for CosyVoice)
    ↓
CosyVoice Service (Python Flask)
    ↓ http://localhost:3003
    ↓
CosyVoice Model (pretrained_models/CosyVoice2-0.5B)

Fallback: Google Translate TTS (if CosyVoice unavailable)
```

---

## Files Added/Modified

### New Python Files

#### `cosyvoice_service.py`
- **Purpose**: Runs CosyVoice as an HTTP microservice
- **Port**: 3003
- **Features**:
  - `/health` - Check if service is running
  - `/api/tts` - Generate speech with emotion parameter
  - `/api/voices` - List available emotions
- **Requires**: Conda environment `marco` with CosyVoice installed

#### `requirements_cosyvoice.txt`
- **Purpose**: Python package dependencies for CosyVoice
- **Includes**: torch, torchaudio, flask, flask-cors

### Setup Scripts

#### `setup_cosyvoice.ps1` (Windows)
- **Purpose**: Automated setup script for Windows PowerShell
- **Steps**:
  1. Create conda environment `marco`
  2. Install PyTorch
  3. Install CosyVoice dependencies
  4. Install CosyVoice package from `c:\Users\leanne\CosyVoice`

#### `setup_cosyvoice.sh` (Linux/Mac)
- **Purpose**: Automated setup script for Bash shells
- **Steps**: Same as Windows version

### Modified Node.js Files

#### `server.js`
- **Changes**:
  - Added CosyVoice health check on startup
  - `/api/tts` endpoint now tries CosyVoice first, falls back to Google TTS
  - Passes `emotion` parameter to CosyVoice service
  - Returns `X-TTS-Source` header indicating which engine was used
  - Re-checks CosyVoice availability every 30 seconds

### Modified React Files

#### `aetheria-script.jsx`
- **New Function**: `detectEmotion(text)`
  - Analyzes story text for emotional keywords
  - Returns emotion: happy, sad, angry, fearful, surprise, or neutral
  - Keywords defined for each emotion type
  
- **Updated Function**: `playChunk()`
  - Calls `detectEmotion()` for each story chunk
  - Passes detected emotion to `/api/tts?emotion=<emotion>`
  - Logs emotion detection for debugging
  - Now uses CosyVoice by default (fallback to Google/Noiz)

---

## Setup Instructions

### Quick Start (Windows)

```powershell
# 1. Open PowerShell in c:\Users\leanne\library
cd c:\Users\leanne\library

# 2. Run setup script
.\setup_cosyvoice.ps1

# 3. Once setup completes, in a NEW PowerShell window:
conda activate marco
python cosyvoice_service.py --model-path "c:\Users\leanne\CosyVoice\pretrained_models\CosyVoice2-0.5B"
```

### Manual Setup

```powershell
# Terminal 1: Create conda environment
conda create -n marco python=3.8 -y
conda activate marco

# Install dependencies
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
pip install -r requirements_cosyvoice.txt

# Install CosyVoice
cd c:\Users\leanne\CosyVoice
pip install -e .

# Terminal 2: Start CosyVoice service
cd c:\Users\leanne\library
conda activate marco
python cosyvoice_service.py --model-path "c:\Users\leanne\CosyVoice\pretrained_models\CosyVoice2-0.5B"

# Terminal 3: Start Express backend
node server.js

# Terminal 4: Start React frontend
npx vite --port 3001
```

---

## How It Works

### 1. User Clicks "Awaken Book"

```javascript
// React component calls:
awakenBook(book, episodeNumber)
```

### 2. Story Generation

```javascript
// Gets story text from server
const response = await fetch('/api/generate', { ... })
const { chapter, chunks } = await response.json()
```

### 3. Emotion Detection Per Chunk

```javascript
// For each story chunk, detects emotion:
const emotion = detectEmotion(chunkText)
// Returns: 'happy', 'sad', 'angry', 'fearful', 'surprise', or 'neutral'
```

### 4. TTS Request with Emotion

```javascript
// Requests audio with emotion parameter:
const url = `http://localhost:3002/api/tts?text=...&emotion=happy`
```

### 5. Express Backend Routes Request

```javascript
// Backend tries CosyVoice first:
fetch('http://localhost:3003/api/tts?text=...&emotion=happy')

// If unavailable, falls back to Google TTS:
fetch('https://translate.google.com/translate_tts?...')
```

### 6. CosyVoice Generates Expressive Audio

```python
# Python service synthesizes with emotion:
model.inference_zero_shot(
    tts_text=text,
    style="Happy",  # Maps from emotion parameter
    ...
)
```

### 7. Audio Plays in Browser

```javascript
// React sets src and plays:
audioRef.current.src = audioData
audioRef.current.play()
```

---

## Emotion Mapping

### Emotion Keywords Detected

```javascript
{
  'happy': ['happy', 'joy', 'laugh', 'smile', 'delighted', 'thrilled', ...],
  'sad': ['sad', 'grief', 'mourn', 'tears', 'crying', 'heartbreak', ...],
  'angry': ['angry', 'furious', 'rage', 'enraged', 'infuriated', ...],
  'fearful': ['afraid', 'fear', 'terrified', 'scared', 'horror', 'dread', ...],
  'surprise': ['surprised', 'shock', 'amazed', 'astonished', 'stunned', ...],
  'neutral': ['said', 'told', 'asked', 'explained', 'continued', ...]
}
```

### CosyVoice Voice Styles

```python
VOICES = {
    "neutral": "ZhiYan",
    "sad": "Sad",
    "happy": "Happy",
    "angry": "Angry",
    "surprise": "Surprise",
    "fearful": "Fearful"
}
```

---

## Testing

### Check CosyVoice Service Status

```bash
# Terminal:
curl http://localhost:3003/health

# Response:
{
  "status": "ok",
  "service": "CosyVoice TTS",
  "model_loaded": true,
  "device": "cpu",
  "available_voices": ["neutral", "sad", "happy", ...]
}
```

### Test TTS Generation

```bash
# Generate happy voice
curl "http://localhost:3003/api/tts?text=This%20is%20wonderful&emotion=happy" --output test.wav

# Generate sad voice
curl "http://localhost:3003/api/tts?text=This%20is%20heartbreaking&emotion=sad" --output test.wav
```

### Check Express Backend Routing

```bash
# Test through Express (will use CosyVoice or fallback):
curl "http://localhost:3002/api/tts?text=Hello%20world&emotion=happy" --output test.wav
```

---

## Troubleshooting

### CosyVoice Service Won't Start

**Error**: `ModuleNotFoundError: No module named 'cosyvoice'`

**Solution**:
```powershell
conda activate marco
cd c:\Users\leanne\CosyVoice
pip install -e .
```

### CosyVoice Not Being Used (Using Google TTS instead)

**Cause**: CosyVoice service not running or not accessible

**Solution**:
1. Check if service is running on port 3003
2. Check Express backend logs for `❌ CosyVoice Service: ❌ Not available`
3. Restart CosyVoice service:
   ```powershell
   conda activate marco
   python cosyvoice_service.py --model-path "c:\Users\leanne\CosyVoice\pretrained_models\CosyVoice2-0.5B"
   ```

### Slow Audio Generation

**Cause**: Using CPU instead of GPU

**Solution** (if you have NVIDIA GPU):
1. Install CUDA PyTorch:
   ```bash
   conda install pytorch::pytorch pytorch::pytorch-cuda=11.8 -c pytorch -c nvidia
   ```
2. Restart CosyVoice service

### No Emotion Detected in Audio

**Cause**: Emotion detection keywords not matching text

**Solution**:
1. Check browser console for detected emotion: `🎬 Chunk X: Detected emotion = ...`
2. Add more keywords to `detectEmotion()` function
3. Or modify CosyVoice service to use different voice styles

---

## Performance Tips

### 1. **Cache Audio**
Express backend already caches with: `Cache-Control: public, max-age=3600`

### 2. **Batch Processing**
Future enhancement: Generate multiple chunks' audio in parallel

### 3. **Use GPU**
Install CUDA-enabled PyTorch for 3-5x faster generation

### 4. **Monitor Logs**
Watch terminal for generation times:
```
🎵 TTS Request: text='...' emotion=happy  [generated in 0.5s]
```

---

## API Endpoints

### Express Backend `/api/tts`

```
GET http://localhost:3002/api/tts?text=Hello&emotion=happy

Query Parameters:
- text (required): Text to synthesize
- emotion (optional): Voice emotion (default: neutral)

Response Headers:
- Content-Type: audio/mpeg or audio/wav
- X-TTS-Source: "CosyVoice" or "GoogleTTS"
- Cache-Control: public, max-age=3600
```

### CosyVoice Service `/api/tts`

```
GET http://localhost:3003/api/tts?text=Hello&emotion=happy

Query Parameters:
- text (required): Text to synthesize
- emotion (optional): happy, sad, angry, fearful, surprise, neutral
- speed (optional): Speed multiplier (default: 1.0)

Response:
- 200: audio/wav file
- 503: Model not loaded
- 400: Missing text parameter
```

### CosyVoice Service `/health`

```
GET http://localhost:3003/health

Response:
{
  "status": "ok",
  "service": "CosyVoice TTS",
  "model_loaded": true,
  "device": "cpu|cuda",
  "available_voices": [...]
}
```

---

## Next Steps

1. **Run setup**: `.\setup_cosyvoice.ps1`
2. **Start CosyVoice service**: `python cosyvoice_service.py`
3. **Start all services**: Run Node backend and React frontend
4. **Test**: Click "Awaken Book" and listen to emotional narration!

---

## Support

For issues:
1. Check console logs (F12 in browser)
2. Check terminal outputs for `🎵` logged messages
3. Verify CosyVoice service: `curl http://localhost:3003/health`
4. Test Express routing: Check `X-TTS-Source` header in response
