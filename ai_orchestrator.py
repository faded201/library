import openai, os
from typing import List
from pydantic import BaseModel

openai.api_key = os.getenv('OPENAI_API_KEY')

class ChapterRequest(BaseModel):
    series: str
    chapter: int
    previous_summary: str = ''
    character: str = 'Xavier'

class VisualRequest(BaseModel):
    prompt: str
    style: str = 'cinematic fantasy'

def generate_chapter(req: ChapterRequest) -> dict:
    system_prompt = "You are a canon-accurate story extension engine. Preserve character identity, lore, and tone. Output chapters of ~23 minutes when read at normal speed."
    user_prompt = f'Series: {req.series}\nPrevious summary: {req.previous_summary}\nCharacter: {req.character}\nGenerate chapter {req.chapter}.'
    resp = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
        max_tokens=3000
    )
    return {'title': f'Chapter {req.chapter}', 'body': resp.choices[0].message.content, 'summary': 'auto-summary-here'}

def generate_visual(req: VisualRequest) -> str:
    resp = openai.images.generate(model="dall-e-3", prompt=f'{req.prompt}, consistent character, canon locked, {req.style}', n=1, size="1024x1024")
    return resp.data[0].url
