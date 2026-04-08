#!/usr/bin/env python
"""
CosyVoice Setup and Service for Xavier OS
Finds and uses existing Python installation
"""

import sys
import os
import json
from pathlib import Path
from subprocess import run, Popen, PIPE
import threading
import time

# Add CosyVoice to path
cosyvoice_path = Path("C:/Users/leanne/CosyVoice")
if cosyvoice_path.exists():
    sys.path.insert(0, str(cosyvoice_path))

try:
    from cosyvoice.cli.cosyvoice import CosyVoice
    print("✅ CosyVoice package found!")
except ImportError as e:
    print(f"❌ CosyVoice not importable: {e}")
    print("Attempting to install from local directory...")
    try:
        os.chdir(str(cosyvoice_path))
        result = run([sys.executable, "-m", "pip", "install", "-e", "."], capture_output=True, text=True)
        if result.returncode == 0:
            print("✅ CosyVoice installed")
            from cosyvoice.cli.cosyvoice import CosyVoice
        else:
            print(f"❌ Install failed: {result.stderr}")
            sys.exit(1)
    except Exception as e:
        print(f"❌ Setup failed: {e}")
        sys.exit(1)

print("=" * 60)
print("🎵 CosyVoice TTS Service for Xavier OS")
print("=" * 60)
print(f"Python: {sys.executable}")
print(f"Version: {sys.version}")

# Now start an Express-compatible TTS service
try:
    from flask import Flask, request, send_file, jsonify
    from flask_cors import CORS
except ImportError:
    print("Installing Flask...")
    run([sys.executable, "-m", "pip", "install", "-q", "flask", "flask-cors"], check=True)
    from flask import Flask, request, send_file, jsonify
    from flask_cors import CORS

import torch
import torchaudio
from io import BytesIO
from tempfile import NamedTemporaryFile

app = Flask(__name__)
CORS(app)

# Load CosyVoice model
print("🔄 Loading CosyVoice model...")
try:
    model = CosyVoice("C:/Users/leanne/CosyVoice/pretrained_models/CosyVoice2-0.5B")
    print("✅ CosyVoice2-0.5B loaded")
except Exception as e:
    print(f"⚠️  Could not load CosyVoice2: {e}")
    try:
        model = CosyVoice("C:/Users/leanne/CosyVoice/pretrained_models/CosyVoice-300M")
        print("✅ CosyVoice-300M loaded")
    except Exception as e2:
        print(f"❌ No models available: {e2}")
        model = None

EMOTION_MAP = {
    'happy': 'ChineseFemaleYoung',
    'sad': 'ChineseFemaleMiddle',
    'angry': 'ChineseMaleMiddle',
    'fearful': 'ChineseFemaleMiddle',
    'surprise': 'ChineseFemaleYoung',
    'neutral': 'ChineseFemaleYoung'
}

@app.route('/health')
def health():
    return jsonify({
        'status': 'ok',
        'service': 'CosyVoice TTS',
        'model_loaded': model is not None,
        'available_emotions': list(EMOTION_MAP.keys())
    })

@app.route('/api/tts')
def tts():
    try:
        text = request.args.get('text')
        emotion = request.args.get('emotion', 'neutral').lower()
        
        if not text:
            return {'error': 'text required'}, 400
        
        if not model:
            return {'error': 'Model not loaded'}, 503
        
        emotion = emotion if emotion in EMOTION_MAP else 'neutral'
        speaker = EMOTION_MAP.get(emotion, 'ChineseFemaleYoung')
        
        print(f"🎵 TTS: emotion={emotion} speaker={speaker} text={text[:50]}...")
        
        # Generate with CosyVoice
        with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as f:
            output_path = f.name
        
        try:
            for output in model.inference_zero_shot(text, speaker, None, stream=False):
                audio = output['tts_speech']
                torchaudio.save(output_path, audio, 22050)
                break
            
            with open(output_path, 'rb') as f:
                audio_data = f.read()
            
            os.unlink(output_path)
            
            return send_file(
                BytesIO(audio_data),
                mimetype='audio/wav',
                as_attachment=False,
                download_name='speech.wav'
            )
        except Exception as e:
            if os.path.exists(output_path):
                os.unlink(output_path)
            raise e
    
    except Exception as e:
        print(f"❌ TTS Error: {e}")
        return {'error': str(e)}, 500

if __name__ == '__main__':
    print("\n" + "=" * 60)
    print("🚀 CosyVoice TTS Service Starting on port 3003")
    print("=" * 60)
    app.run(host='127.0.0.1', port=3003, debug=False)
