#!/usr/bin/env python3
"""
CosyVoice TTS Service Integration for Xavier OS
Runs as a microservice on port 3003, provides emotional speech synthesis
"""

import os
import sys
import argparse
import json
import torch
import torchaudio
import io
from pathlib import Path
from tempfile import NamedTemporaryFile
import traceback

# Flask for HTTP API
try:
    from flask import Flask, request, send_file
    from flask_cors import CORS
except ImportError:
    print("❌ Flask not installed. Run: pip install flask flask-cors")
    sys.exit(1)

# CosyVoice imports - using the installed package
try:
    from cosyvoice.utils.file_utils import load_wav
    from cosyvoice.models.cosyvoice import CosyVoice
except ImportError as e:
    print(f"⚠️  CosyVoice package not found in Python path: {e}")
    print("Make sure you're in the correct conda environment (marco) with CosyVoice installed")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Global model instance
model = None
device = "cuda" if torch.cuda.is_available() else "cpu"

# Supported voices and styles
VOICES = {
    "neutral": "ZhiYan",
    "sad": "Sad",
    "happy": "Happy",
    "angry": "Angry",
    "surprise": "Surprise",
    "fearful": "Fearful"
}

def load_model(model_path):
    """Load CosyVoice model"""
    global model
    
    try:
        print(f"🔄 Loading CosyVoice model from {model_path}...")
        print(f"   Device: {device}")
        
        model = CosyVoice(model_path)
        print("✅ CosyVoice model loaded successfully")
        return True
    except Exception as e:
        print(f"❌ Failed to load CosyVoice model: {e}")
        print(traceback.format_exc())
        return False

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {
        'status': 'ok',
        'service': 'CosyVoice TTS',
        'model_loaded': model is not None,
        'device': device,
        'available_voices': list(VOICES.keys())
    }

@app.route('/api/tts', methods=['GET', 'POST'])
def tts():
    """
    TTS endpoint - generates speech audio from text
    
    Parameters:
    - text (required): Text to synthesize
    - emotion (optional): Voice emotion - neutral, sad, happy, angry, surprise, fearful (default: neutral)
    - speaker (optional): Speaker ID (default: default speaker)
    - speed (optional): Speech speed multiplier (default: 1.0)
    
    Returns: WAV audio file (22050 Hz)
    """
    try:
        # Get parameters
        if request.method == 'GET':
            text = request.args.get('text')
            emotion = request.args.get('emotion', 'neutral').lower()
            speaker = request.args.get('speaker', '')
            speed = float(request.args.get('speed', 1.0))
        else:
            data = request.get_json() or {}
            text = data.get('text')
            emotion = data.get('emotion', 'neutral').lower()
            speaker = data.get('speaker', '')
            speed = float(data.get('speed', 1.0))

        if not text:
            return {'error': 'text parameter required'}, 400

        if not model:
            return {'error': 'Model not loaded'}, 503

        # Validate emotion
        if emotion not in VOICES:
            print(f"⚠️  Unknown emotion '{emotion}', using neutral")
            emotion = 'neutral'

        print(f"🎵 TTS Request: text='{text[:50]}...' emotion={emotion} speed={speed}")

        # Create temporary file for output
        output_file = NamedTemporaryFile(suffix='.wav', delete=False)
        output_path = output_file.name
        output_file.close()

        try:
            # Get voice style
            voice_style = VOICES.get(emotion, "ZhiYan")
            
            # Synthesize speech
            print(f"   Synthesizing with voice={voice_style}, speed={speed}")
            tts_output = model.inference_zero_shot(
                tts_text=text,
                prompt_speech_16k=None,
                speaker_name="",
                style=voice_style,
                stream=False
            )
            
            # Get the audio tensor
            if isinstance(tts_output, dict):
                audio_tensor = tts_output.get('tts_speech')
            else:
                audio_tensor = tts_output
            
            # Apply speed if needed
            if speed != 1.0 and audio_tensor is not None:
                # Resample for speed adjustment
                sample_rate = 22050
                new_length = int(len(audio_tensor) / speed)
                audio_tensor = torch.nn.functional.interpolate(
                    audio_tensor.unsqueeze(0).unsqueeze(0),
                    size=new_length,
                    mode='linear',
                    align_corners=False
                ).squeeze()
            
            # Save audio
            if audio_tensor is not None:
                torchaudio.save(output_path, audio_tensor.unsqueeze(0), 22050)
                print(f"✅ Audio generated: {len(audio_tensor)} samples")
            else:
                raise Exception("No audio output from model")
            
            # Read and send file
            with open(output_path, 'rb') as f:
                audio_data = f.read()
            
            os.unlink(output_path)
            
            response = send_file(
                io.BytesIO(audio_data),
                mimetype='audio/wav',
                as_attachment=False,
                download_name='speech.wav'
            )
            response.headers['Content-Type'] = 'audio/wav'
            response.headers['Cache-Control'] = 'public, max-age=3600'
            return response

        except Exception as e:
            if os.path.exists(output_path):
                try:
                    os.unlink(output_path)
                except:
                    pass
            raise e

    except Exception as e:
        print(f"❌ TTS Error: {e}")
        print(traceback.format_exc())
        return {'error': 'TTS generation failed', 'details': str(e)}, 500

@app.route('/api/voices', methods=['GET'])
def get_voices():
    """List available voice emotions"""
    return {
        'emotions': list(VOICES.keys()),
        'descriptions': {
            'neutral': 'Standard neutral speaking voice',
            'sad': 'Sad emotional tone',
            'happy': 'Happy/cheerful tone',
            'angry': 'Angry/intense tone',
            'surprise': 'Surprised/excited tone',
            'fearful': 'Fearful/anxious tone'
        }
    }

def main():
    parser = argparse.ArgumentParser(description='CosyVoice TTS Service for Xavier OS')
    parser.add_argument('--port', type=int, default=3003, help='Port to run on (default: 3003)')
    parser.add_argument('--model-path', default='/Users/leanne/CosyVoice/pretrained_models/CosyVoice2-0.5B', 
                       help='Path to CosyVoice model')
    parser.add_argument('--host', default='127.0.0.1', help='Host to bind to')
    
    args = parser.parse_args()
    
    # Fix Windows path if needed
    model_path = args.model_path.replace('/Users/leanne', 'c:\\Users\\leanne')

    print("=" * 60)
    print("🎵 CosyVoice TTS Service for Xavier OS")
    print("=" * 60)
    print(f"📍 Device: {device}")
    print(f"📁 Model path: {model_path}")
    
    # Load model
    if not load_model(model_path):
        sys.exit(1)
    
    print(f"🚀 Starting server on http://{args.host}:{args.port}")
    print("=" * 60)
    
    app.run(host=args.host, port=args.port, debug=False, threaded=True)

if __name__ == '__main__':
    main()
