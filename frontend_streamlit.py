import streamlit as st
import requests

API = 'http://localhost:8000'

st.set_page_config(page_title='Xavier OS', layout='wide')
st.title('Xavier OS')
st.caption('Audiovisual AI story platform')

page = st.sidebar.radio('Mode', ['Library', 'Story', 'Visuals', 'Progress', 'Admin'])
series_list = ['My Vampire System', 'My Dragonic System', 'Shadow Blade', 'Birth of a Demonic Sword', 'Legendary Beast Tamer', 'Gods Eye', 'Star Forge Academy', 'Chronicle of Ash', 'Neon Soul', 'Void Merchant']

if page == 'Library':
    for s in series_list:
        st.write('•', s)

elif page == 'Story':
    series = st.selectbox('Series', series_list)
    chapter = st.number_input('Chapter', 1, 9999, 1)
    if st.button('Generate chapter'):
        r = requests.post(f'{API}/generate-chapter', json={'series': series, 'chapter': int(chapter), 'character': 'Xavier'})
        st.json(r.json())

elif page == 'Visuals':
    st.write('Scene prompts are returned from the chapter generator so images stay canon-consistent.')

elif page == 'Progress':
    user = st.text_input('User', 'demo_user')
    xp = st.number_input('XP gain', 1, 1000, 23)
    if st.button('Add XP'):
        r = requests.post(f'{API}/progress', json={'user': user, 'xp': int(xp)})
        st.json(r.json())

else:
    st.write('Moderation, billing, analytics, TTS, and deployment controls belong here.')
