CREATE TABLE users(id TEXT PRIMARY KEY, email TEXT UNIQUE, display_name TEXT, created_at TEXT);
CREATE TABLE series(id TEXT PRIMARY KEY, title TEXT, genre TEXT, canon_json TEXT, created_at TEXT);
CREATE TABLE chapters(id TEXT PRIMARY KEY, series_id TEXT, chapter_no INTEGER, title TEXT, body TEXT, audio_url TEXT, created_at TEXT);
CREATE TABLE chapter_scenes(id TEXT PRIMARY KEY, chapter_id TEXT, scene_no INTEGER, prompt TEXT, image_url TEXT);
CREATE TABLE abilities(id TEXT PRIMARY KEY, user_id TEXT, name TEXT, tier INTEGER, source_series_id TEXT);
CREATE TABLE progress(user_id TEXT PRIMARY KEY, xp INTEGER, level INTEGER, unlocks TEXT);
CREATE TABLE moderation(id INTEGER PRIMARY KEY AUTOINCREMENT, item_type TEXT, item_id TEXT, verdict TEXT, reason TEXT, created_at TEXT);
