import openai, os
from pydantic import BaseModel

openai.api_key = os.getenv('OPENAI_API_KEY')

class TTSRequest(BaseModel):
    text: str
    voice: str = 'alloy'  # alloy, echo, fable, onyx, nova, shimmer
    speed: float = 1.0

def generate_tts(req: TTSRequest) -> str:
    resp = openai.audio.speech.create(
        model="tts-1-hd",
        voice=req.voice,
        input=req.text[:4000],
        speed=req.speed
    )
    audio_path = f'/tmp/{hash(req.text)}.mp3'
    resp.stream_to_file(audio_path)
    return audio_path
