from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
import sqlite3, os

DB = 'xavier_os.db'
app = FastAPI(title='Xavier OS')

class ChapterRequest(BaseModel):
    series: str
    chapter: int
    character: str = 'Xavier'

class AbilityRequest(BaseModel):
    user: str
    abilities: List[str]

class ProgressRequest(BaseModel):
    user: str
    xp: int


def db():
    conn = sqlite3.connect(DB, check_same_thread=False)
    conn.execute("CREATE TABLE IF NOT EXISTS chapters (series TEXT, chapter INTEGER, title TEXT, body TEXT, visuals TEXT, PRIMARY KEY(series, chapter))")
    conn.execute("CREATE TABLE IF NOT EXISTS progress (user TEXT PRIMARY KEY, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1, unlocks TEXT DEFAULT '')")
    conn.execute("CREATE TABLE IF NOT EXISTS moderation (id INTEGER PRIMARY KEY AUTOINCREMENT, item TEXT, status TEXT, created_at TEXT)")
    conn.commit()
    return conn

@app.get('/health')
def health():
    return {'ok': True}

@app.post('/generate-chapter')
def generate_chapter(req: ChapterRequest):
    title = f'Chapter {req.chapter}: The Next Trial'
    body = f'{req.series} chapter {req.chapter}. {req.character} faces a new challenge, gains power, and advances the plot while preserving canon.'
    visuals = [
        {'scene': 'opening', 'prompt': f'{req.series}, opening scene, same {req.character}, cinematic fantasy, canon locked'},
        {'scene': 'growth', 'prompt': f'{req.series}, growth scene, same {req.character}, stronger outfit, visible progression, canon locked'},
        {'scene': 'climax', 'prompt': f'{req.series}, climax scene, same {req.character}, dramatic aura, faithful to story bible'}
    ]
    conn = db()
    conn.execute('INSERT OR REPLACE INTO chapters(series, chapter, title, body, visuals) VALUES (?,?,?,?,?)', (req.series, req.chapter, title, body, str(visuals)))
    conn.commit()
    return {'title': title, 'body': body, 'visuals': visuals}

@app.post('/tts')
def tts(payload: dict):
    text = payload.get('text', '')
    voice = payload.get('voice', 'usa-natural')
    if not text:
        raise HTTPException(400, 'text required')
    return {'status': 'queued', 'voice': voice, 'audio_url': f'/audio/{abs(hash(text))}.mp3'}

@app.post('/progress')
def update_progress(req: ProgressRequest):
    conn = db()
    row = conn.execute('SELECT xp, level FROM progress WHERE user=?', (req.user,)).fetchone()
    if not row:
        conn.execute('INSERT INTO progress(user, xp, level, unlocks) VALUES (?,?,?,?)', (req.user, req.xp, 1, ''))
    else:
        xp = row[0] + req.xp
        level = row[1] + (1 if xp >= row[1] * 100 else 0)
        conn.execute('UPDATE progress SET xp=?, level=? WHERE user=?', (xp, level, req.user))
    conn.commit()
    row = conn.execute('SELECT xp, level, unlocks FROM progress WHERE user=?', (req.user,)).fetchone()
    return {'user': req.user, 'xp': row[0], 'level': row[1], 'unlocks': row[2].split(',') if row[2] else []}

@app.post('/moderate')
def moderate(payload: dict):
    item = payload.get('item', '')
    verdict = 'approved' if item else 'rejected'
    conn = db()
    conn.execute('INSERT INTO moderation(item, status, created_at) VALUES (?,?,?)', (item, verdict, datetime.utcnow().isoformat()))
    conn.commit()
    return {'status': verdict}
