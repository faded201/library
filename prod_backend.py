from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3, json, os, uuid

DB = os.getenv('XAVIER_DB', 'xavier_os.db')
app = FastAPI(title='Xavier OS')

class StoryRequest(BaseModel):
    series: str
    chapter: int
    character: str = 'Xavier'
    tone: str = 'cinematic'
    target_minutes: int = 23

class TTSRequest(BaseModel):
    text: str
    voice: str = 'usa-natural'
    speed: float = 1.0

class ProgressRequest(BaseModel):
    user_id: str
    xp: int

class AbilityFuseRequest(BaseModel):
    user_id: str
    abilities: List[str]


def conn():
    c = sqlite3.connect(DB, check_same_thread=False)
    c.execute("CREATE TABLE IF NOT EXISTS chapters(series TEXT, chapter INTEGER, title TEXT, body TEXT, visuals TEXT, audio_url TEXT, PRIMARY KEY(series, chapter))")
    c.execute("CREATE TABLE IF NOT EXISTS progress(user_id TEXT PRIMARY KEY, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1, unlocks TEXT DEFAULT '')")
    c.execute("CREATE TABLE IF NOT EXISTS moderation(id INTEGER PRIMARY KEY AUTOINCREMENT, item_type TEXT, item_id TEXT, verdict TEXT, reason TEXT, created_at TEXT)")
    c.commit()
    return c

@app.get('/health')
def health():
    return {'ok': True}

@app.post('/generate-story')
def generate_story(req: StoryRequest):
    title = f'Chapter {req.chapter}: The Next Trial'
    body = f'{req.series} chapter {req.chapter}. {req.character} enters a new conflict, learns a deeper truth, and unlocks a stronger form.'
    visuals = [
        {'scene_no': 1, 'prompt': f'{req.series}, opening scene, same {req.character}, consistent face, cinematic fantasy'},
        {'scene_no': 2, 'prompt': f'{req.series}, growth scene, same {req.character}, stronger aura, progression visible'},
        {'scene_no': 3, 'prompt': f'{req.series}, climax scene, same {req.character}, dramatic lighting, canon-accurate'}
    ]
    audio_url = f'https://cdn.example.com/audio/{uuid.uuid4().hex}.mp3'
    c = conn()
    c.execute('INSERT OR REPLACE INTO chapters(series, chapter, title, body, visuals, audio_url) VALUES (?,?,?,?,?,?)', (req.series, req.chapter, title, body, json.dumps(visuals), audio_url))
    c.commit()
    return {'title': title, 'body': body, 'visuals': visuals, 'audio_url': audio_url}

@app.post('/tts')
def tts(req: TTSRequest):
    if not req.text.strip():
        raise HTTPException(400, 'text required')
    return {'status': 'queued', 'voice': req.voice, 'speed': req.speed, 'audio_url': f'https://cdn.example.com/audio/{uuid.uuid4().hex}.mp3'}

@app.post('/progress')
def progress(req: ProgressRequest):
    c = conn()
    row = c.execute('SELECT xp, level, unlocks FROM progress WHERE user_id=?', (req.user_id,)).fetchone()
    if not row:
        c.execute('INSERT INTO progress(user_id, xp, level, unlocks) VALUES (?,?,?,?)', (req.user_id, req.xp, 1, ''))
    else:
        xp = row[0] + req.xp
        level = max(1, xp // 100 + 1)
        c.execute('UPDATE progress SET xp=?, level=? WHERE user_id=?', (xp, level, req.user_id))
    c.commit()
    row = c.execute('SELECT xp, level, unlocks FROM progress WHERE user_id=?', (req.user_id,)).fetchone()
    return {'user_id': req.user_id, 'xp': row[0], 'level': row[1], 'unlocks': row[2].split(',') if row[2] else []}

@app.post('/fuse-abilities')
def fuse(req: AbilityFuseRequest):
    fused = '+'.join(sorted(set(req.abilities)))
    return {'user_id': req.user_id, 'fused_ability': fused}

@app.post('/moderate')
def moderate(payload: dict):
    verdict = 'approved' if payload.get('text') else 'rejected'
    c = conn()
    c.execute('INSERT INTO moderation(item_type, item_id, verdict, reason, created_at) VALUES (?,?,?,?,?)', ('content', payload.get('id', ''), verdict, payload.get('reason', ''), datetime.utcnow().isoformat()))
    c.commit()
    return {'verdict': verdict}
