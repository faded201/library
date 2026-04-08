#!/usr/bin/env python3
"""
CosyVoice TTS Service - Runs as a standalone Python microservice
Provides emotional speech synthesis through HTTP API
"""

import os
import sys
import argparse
import json
import torch
import torchaudio
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

# CosyVoice imports
try:
    from Models.marco_voice.cosyvoice_rodis.cli.cosyvoice import CosyVoice
    from Models.marco_voice.cosyvoice_emosphere.cli.cosyvoice import CosyVoice as CosyVoiceEmosphere
    from Models.marco_voice.cosyvoice_rodis.utils.file_utils import load_wav
except ImportError as e:
    print(f"❌ CosyVoice models not found: {e}")
    print("Make sure your Models directory structure is:")
    print("  Models/marco_voice/cosyvoice_rodis/")
    print("  Models/marco_voice/cosyvoice_emosphere/")
    sys.exit(1)

app = Flask(__name__)
CORS(app)

# Global model instances
model = None
model_emosphere = None
emotion_info = None
device = "cuda" if torch.cuda.is_available() else "cpu"

# Emotion mapping
EMOTION_MAP = {
    "sad": "伤心",
    "fearful": "恐惧",
    "happy": "快乐",
    "surprise": "惊喜",
    "angry": "生气",
    "jolly": "戏谑"
}

def load_models(models_path="pretrained_models", use_fp16=False):
    """Load CosyVoice models"""
    global model, model_emosphere, emotion_info
    
    try:
        print(f"🔄 Loading CosyVoice v4 (rodis) from {models_path}/v4...")
        model = CosyVoice(
            os.path.join(models_path, 'v4'),
            load_jit=False,
            load_onnx=False,
            fp16=use_fp16
        )
        print("✅ CosyVoice v4 loaded")
        
        print(f"🔄 Loading CosyVoice v5 (emosphere) from {models_path}/v5...")
        model_emosphere = CosyVoiceEmosphere(
            os.path.join(models_path, 'v5'),
            load_jit=False,
            load_onnx=False,
            fp16=use_fp16
        )
        print("✅ CosyVoice v5 (Emosphere) loaded")
        
        # Load emotion embeddings
        print("🔄 Loading emotion embeddings...")
        emotion_info = torch.load("assets/emotion_info.pt")
        print(f"✅ Emotion embeddings loaded: {len(emotion_info)} speakers available")
        
        return True
    except Exception as e:
        print(f"❌ Failed to load models: {e}")
        print(traceback.format_exc())
        return False

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return {
        'status': 'ok',
        'service': 'CosyVoice TTS',
        'models_loaded': model is not None and model_emosphere is not None,
        'device': device
    }

@app.route('/api/tts', methods=['GET', 'POST'])
def tts():
    """TTS endpoint - supports discrete and continuous emotion control"""
    try:
        # Get parameters
        if request.method == 'GET':
            text = request.args.get('text')
            emotion = request.args.get('emotion', 'neutral').lower()
            speaker = request.args.get('speaker', 'male005')
            continuous_emo = request.args.get('continuous_emo')
        else:
            data = request.get_json()
            text = data.get('text')
            emotion = data.get('emotion', 'neutral').lower()
            speaker = data.get('speaker', 'male005')
            continuous_emo = data.get('continuous_emo')

        if not text:
            return {'error': 'text parameter required'}, 400

        if not model or not model_emosphere:
            return {'error': 'Models not loaded'}, 503

        print(f"🎵 TTS Request: text='{text[:50]}...' emotion={emotion} speaker={speaker}")

        # Map emotion to Chinese
        emo_cn = EMOTION_MAP.get(emotion, "快乐")
        emo_cn_mapped = "快乐" if emotion == "neutral" else emo_cn

        # Get emotion embedding
        try:
            emo_embedding = emotion_info[speaker][EMOTION_MAP.get(emotion, "快乐")]
        except KeyError:
            print(f"⚠️  Speaker {speaker} or emotion {emotion} not found, using defaults")
            emo_embedding = emotion_info["male005"]["Happy"]

        # Generate audio
        output_file = NamedTemporaryFile(suffix='.wav', delete=False)
        output_path = output_file.name
        output_file.close()

        try:
            if continuous_emo:
                # Use Emosphere for continuous emotion control
                print(f"🎵 Using Emosphere (continuous emotion): {continuous_emo}")
                for tts_output in model_emosphere.synthesize(
                    text=text,
                    prompt_text="",
                    reference_speech=None,
                    emotion_embedding=emo_embedding,
                    low_level_emo_embedding=json.loads(continuous_emo) if isinstance(continuous_emo, str) else continuous_emo
                ):
                    torchaudio.save(output_path, tts_output['tts_speech'], 22050)
                    break
            else:
                # Use standard discrete emotion control
                print(f"🎵 Using discrete emotion: {emo_cn}")
                for tts_output in model.synthesize(
                    text=text,
                    prompt_text="",
                    reference_speech=None,
                    emo_type=emo_cn,
                    emotion_embedding=emo_embedding
                ):
                    torchaudio.save(output_path, tts_output['tts_speech'], 22050)
                    break

            print(f"✅ Audio generated: {output_path}")
            
            # Send file and clean up
            with open(output_path, 'rb') as f:
                audio_data = f.read()
            
            os.unlink(output_path)
            
            return send_file(
                io.BytesIO(audio_data),
                mimetype='audio/wav',
                as_attachment=True,
                download_name='speech.wav'
            )

        except Exception as e:
            if os.path.exists(output_path):
                os.unlink(output_path)
            raise e

    except Exception as e:
        print(f"❌ TTS Error: {e}")
        print(traceback.format_exc())
        return {'error': 'TTS generation failed', 'details': str(e)}, 500

@app.route('/api/emotions', methods=['GET'])
def get_emotions():
    """List available emotions"""
    return {
        'emotions': list(EMOTION_MAP.keys()),
        'speakers': list(emotion_info.keys()) if emotion_info else []
    }

def main():
    parser = argparse.ArgumentParser(description='CosyVoice TTS Service')
    parser.add_argument('--port', type=int, default=3003, help='Port to run on (default: 3003)')
    parser.add_argument('--models-path', default='pretrained_models', help='Path to models directory')
    parser.add_argument('--fp16', action='store_true', help='Use FP16 precision')
    parser.add_argument('--host', default='localhost', help='Host to bind to')
    
    args = parser.parse_args()

    print("🎵 CosyVoice TTS Service Starting...")
    print(f"📍 Device: {device}")
    
    # Load models
    if not load_models(args.models_path, args.fp16):
        sys.exit(1)
    
    print(f"🚀 Starting Flask server on {args.host}:{args.port}")
    app.run(host=args.host, port=args.port, debug=False)

if __name__ == '__main__':
    import io
    main()
