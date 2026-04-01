import streamlit as st
import sqlite3, json, hashlib, random

DB = 'xavier_os.db'

st.set_page_config(page_title='Xavier OS', layout='wide')

@st.cache_resource
def get_conn():
    conn = sqlite3.connect(DB, check_same_thread=False)
    conn.execute("CREATE TABLE IF NOT EXISTS progress (user TEXT PRIMARY KEY, xp INTEGER DEFAULT 0, level INTEGER DEFAULT 1, unlocks TEXT DEFAULT '')")
    conn.execute("CREATE TABLE IF NOT EXISTS chapters (series TEXT, chapter INTEGER, title TEXT, body TEXT, PRIMARY KEY(series, chapter))")
    conn.execute("CREATE TABLE IF NOT EXISTS characters (series TEXT, name TEXT, age_stage TEXT, portrait_prompt TEXT, PRIMARY KEY(series, name, age_stage))")
    conn.commit()
    return conn

conn = get_conn()
user = 'demo_user'
row = conn.execute('SELECT xp, level, unlocks FROM progress WHERE user=?', (user,)).fetchone()
if not row:
    conn.execute('INSERT OR REPLACE INTO progress(user,xp,level,unlocks) VALUES (?,?,?,?)', (user,0,1,''))
    conn.commit()
    row = (0,1,'')

xp, level, unlocks = row
unlocks_set = set([u for u in unlocks.split(',') if u])

series_list = [
    'My Vampire System', 'My Dragonic System', 'Shadow Blade',
    'Birth of a Demonic Sword', 'Legendary Beast Tamer', 'Gods Eye',
    'Star Forge Academy', 'Chronicle of Ash', 'Neon Soul', 'Void Merchant'
]

character_blueprints = {
    'My Vampire System': [('Xavier', 'child', 'young dark fantasy hero'), ('Xavier', 'teen', 'older dark fantasy hero'), ('Xavier', 'adult', 'powerful vampire sovereign')],
    'My Dragonic System': [('Aeron', 'child', 'young dragon rider'), ('Aeron', 'teen', 'dragon-bonded warrior'), ('Aeron', 'adult', 'dragon lord in crimson armor')],
    'Shadow Blade': [('Kira', 'child', 'quiet orphan assassin'), ('Kira', 'teen', 'elite shadow duelist'), ('Kira', 'adult', 'master of living shadows')],
}

st.title('Xavier OS')
st.caption('AI story audio-visual platform prototype')

col1, col2, col3 = st.columns(3)
col1.metric('Level', level)
col2.metric('XP', xp)
col3.metric('Unlocks', len(unlocks_set))

page = st.sidebar.radio('Mode', ['Library', 'Story Engine', 'Visual Storyboard', 'Abilities', 'Admin'])

if page == 'Library':
    st.subheader('Library')
    for s in series_list:
        st.write('•', s)

elif page == 'Story Engine':
    series = st.selectbox('Choose a series', series_list)
    ch = st.number_input('Chapter', min_value=1, max_value=9999, value=1, step=1)
    if st.button('Generate chapter'):
        body = f"{series} chapter {ch}. The hero enters a new trial, gains a power, and the world changes around them."
        title = f'Chapter {ch}: The Next Trial'
        conn.execute('INSERT OR REPLACE INTO chapters(series, chapter, title, body) VALUES (?,?,?,?)', (series, ch, title, body))
        conn.execute('UPDATE progress SET xp=xp+23, level=level+CASE WHEN xp+23>=100 THEN 1 ELSE 0 END WHERE user=?', (user,))
        conn.commit()
        st.success('Chapter generated')
    row = conn.execute('SELECT title, body FROM chapters WHERE series=? AND chapter=?', (series, ch)).fetchone()
    if row:
        st.markdown(f'### {row[0]}')
        st.write(row[1])
        st.info('Audio layer to be connected to TTS service.')
    else:
        st.info('No chapter yet. Generate one.')

elif page == 'Visual Storyboard':
    series = st.selectbox('Choose series for visuals', list(character_blueprints.keys()) + series_list)
    if series in character_blueprints:
        stages = [x[1] for x in character_blueprints[series]]
        stage = st.selectbox('Character growth stage', stages)
        data = [x for x in character_blueprints[series] if x[1] == stage][0]
        st.subheader(f'{data[0]} — {stage}')
        prompt = f'{data[2]}, cinematic fantasy portrait, consistent character identity, style locked to the story canon'
        st.write('Visual prompt:', prompt)
        st.write('Storyboard note: each chapter should reuse the same identity with growth changes only in clothing, scars, armor, age, and power aura.')
        st.image('https://placehold.co/900x500/png?text=Xavier+OS+Storyboard', caption='Storyboard placeholder')
    else:
        st.write('No specific character blueprint yet for this series. Add a canon sheet first.')

elif page == 'Abilities':
    abilities = ['Vampire Sight', 'Dragon Scale', 'Shadow Step', 'Demonic Edge', 'Beast Bond', 'God Vision']
    selected = st.multiselect('Unlock abilities', abilities)
    if st.button('Save abilities'):
        new_unlocks = sorted(set(list(unlocks_set) + selected))
        conn.execute('UPDATE progress SET unlocks=? WHERE user=?', (','.join(new_unlocks), user))
        conn.commit()
        st.success('Abilities saved')
    st.write('Current unlocks:', ', '.join(sorted(unlocks_set)) if unlocks_set else 'None')

else:
    st.subheader('Admin')
    st.write('Moderation, metrics, TTS settings, story bible, visual canon, and deployment hooks would live here.')
    st.code('POST /generate-chapter\nPOST /tts\nPOST /storyboard\nGET /library\nPOST /progress\nPOST /moderate')
