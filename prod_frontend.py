import streamlit as st
import requests

API = 'http://localhost:8000'
st.set_page_config(page_title='Xavier OS', layout='wide')
st.title('Xavier OS')
st.caption('Audiovisual AI story platform')

page = st.sidebar.radio('Mode', ['Library', 'Story Engine', 'Visual Storyboard', 'Abilities', 'Admin'])
series_list = ['My Vampire System', 'My Dragonic System', 'Shadow Blade', 'Birth of a Demonic Sword', 'Legendary Beast Tamer', 'Gods Eye', 'Star Forge Academy', 'Chronicle of Ash', 'Neon Soul', 'Void Merchant']

if page == 'Library':
    st.subheader('Library')
    st.write('\n'.join([f'• {s}' for s in series_list]))

elif page == 'Story Engine':
    series = st.selectbox('Series', series_list)
    chapter = st.number_input('Chapter', 1, 99999, 1)
    character = st.text_input('Main character', 'Xavier')
    if st.button('Generate story'):
        r = requests.post(f'{API}/generate-story', json={'series': series, 'chapter': int(chapter), 'character': character})
        st.json(r.json())

elif page == 'Visual Storyboard':
    st.write('Visual prompts generated per scene so images remain consistent with character growth and canon.')
    st.image('https://placehold.co/1200x500/png?text=Xavier+OS+Visual+Storyboard')

elif page == 'Abilities':
    user = st.text_input('User id', 'demo_user')
    abilities = st.multiselect('Abilities', ['Vampire Sight', 'Dragon Scale', 'Shadow Step', 'Demonic Edge', 'Beast Bond', 'God Vision'])
    if st.button('Fuse abilities'):
        r = requests.post(f'{API}/fuse-abilities', json={'user_id': user, 'abilities': abilities})
        st.json(r.json())

else:
    st.write('Admin controls for TTS, moderation, analytics, billing, and deployment would be connected here.')
