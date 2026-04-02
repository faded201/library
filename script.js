/* =========================
   📲 PWA
========================= */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

/* =========================
   🔊 SOUND
========================= */
const ambient = document.getElementById("ambient");
const whisper = document.getElementById("whisper");

document.body.addEventListener("click", () => {
  ambient?.play().catch(()=>{});
});

/* =========================
   💡 LIGHT FOLLOW
========================= */
const glow = document.querySelector(".scripture-glow");

document.addEventListener("mousemove", e => {
  glow?.style.setProperty("--x", e.clientX + "px");
  glow?.style.setProperty("--y", e.clientY + "px");
});

/* =========================
   📚 CORE BOOKS
========================= */
const coreBooks = [
  "Vampire System",
  "Gods Eye",
  "My Dragonic System",
  "Dragon Inside of Me",
  "Shadow Blade",
  "Birth of a Demonic Sword",
  "Legendary Beast Tamer"
];

/* =========================
   🔥 NAME GENERATOR
========================= */
const words = ["Forbidden","Broken","Savage","Cursed","Immortal","Awakened"];
const hooks = ["System","King","Queen","Gate","Empire"];
const ends = ["of Shadows","of Blood","of Chaos","of Night"];
const genres = ["Dark Fantasy","Romantasy","LitRPG","Progression Fantasy"];

function generateBookName(){
  return `${words[Math.random()*words.length|0]} ${hooks[Math.random()*hooks.length|0]} ${ends[Math.random()*ends.length|0]} [${genres[Math.random()*genres.length|0]}]`;
}

/* =========================
   🎮 PLAYER
========================= */
let player = { level: 1, xp: 0 };
let currentBook = null;

/* =========================
   💾 SAVE
========================= */
function save(){
  localStorage.setItem("xavierOS_player", JSON.stringify(player));
}

function load(){
  const data = localStorage.getItem("xavierOS_player");
  if(data) player = JSON.parse(data);
}

/* =========================
   🌐 AI KEYS
========================= */
const AI_KEYS = {
  GEMINI: "",
  GROQ: "",
  OPENROUTER: "",
  HUGGINGFACE: ""
};

/* =========================
   🧠 AI ROUTER
========================= */
const storyCache = {};

async function generateStory(title){

  if(storyCache[title]) return storyCache[title];

  let text = null;

  if(AI_KEYS.GEMINI) text = await tryAI(geminiAI, title);
  if(!text && AI_KEYS.GROQ) text = await tryAI(groqAI, title);
  if(!text && AI_KEYS.OPENROUTER) text = await tryAI(openRouterAI, title);
  if(!text && AI_KEYS.HUGGINGFACE) text = await tryAI(huggingFaceAI, title);

  if(!text) return fallbackStory(title);

  const pages = text.match(/.{1,400}/g)?.map((t,i)=>`
    <h3>${title} — Chapter ${i+1}</h3>
    <p>${t}</p>
  `);

  storyCache[title] = pages;
  return pages;
}

async function tryAI(fn, title){
  try{
    return await fn(title);
  }catch{
    return null;
  }
}

/* =========================
   🟢 GEMINI
========================= */
async function geminiAI(title){
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${AI_KEYS.GEMINI}`,
    {
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({
        contents:[{
          parts:[{
            text:`Write a cinematic dark fantasy story titled "${title}".`
          }]
        }]
      })
    }
  );

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

/* =========================
   🟣 GROQ
========================= */
async function groqAI(title){
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${AI_KEYS.GROQ}`
    },
    body:JSON.stringify({
      model:"llama3-8b-8192",
      messages:[{
        role:"user",
        content:`Dark cinematic fantasy story: "${title}".`
      }]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

/* =========================
   🔵 OPENROUTER
========================= */
async function openRouterAI(title){
  const res = await fetch("https://openrouter.ai/api/v1/chat/completions",{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      "Authorization":`Bearer ${AI_KEYS.OPENROUTER}`
    },
    body:JSON.stringify({
      model:"mistralai/mistral-7b-instruct",
      messages:[{
        role:"user",
        content:`Epic fantasy story titled "${title}".`
      }]
    })
  });

  const data = await res.json();
  return data.choices?.[0]?.message?.content;
}

/* =========================
   🟡 HUGGING FACE
========================= */
async function huggingFaceAI(title){
  const res = await fetch(
    "https://api-inference.huggingface.co/models/gpt2",
    {
      method:"POST",
      headers:{
        "Authorization":`Bearer ${AI_KEYS.HUGGINGFACE}`,
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
        inputs:`Dark fantasy story: ${title}`,
        parameters:{ max_new_tokens:200 }
      })
    }
  );

  const data = await res.json();
  return data[0]?.generated_text;
}

/* =========================
   🧩 FALLBACK
========================= */
function fallbackStory(title){
  return Array.from({length:10},(_,i)=>`
    <h3>${title} — Chapter ${i+1}</h3>
    <p>Power awakens within ${title}. Destiny begins in darkness...</p>
  `);
}

/* =========================
   🔊 AUDIO
========================= */
function speak(text){
  if(!('speechSynthesis' in window)) return;

  speechSynthesis.cancel();

  const msg = new SpeechSynthesisUtterance(
    text.replace(/<[^>]*>/g, '')
  );

  msg.rate = 0.9;
  speechSynthesis.speak(msg);
}

/* =========================
   📖 READER
========================= */
let currentPage = 0;
let currentPages = [];

async function openReader(title){
  currentBook = title;
  currentPages = await generateStory(title);

  currentPage = +localStorage.getItem("page_"+title) || 0;

  document.getElementById("reader").style.display = "flex";
  renderPage();
}

function renderPage(){
  const content = currentPages[currentPage];
  document.getElementById("readerContent").innerHTML = content;
  speak(content);
}

function nextPage(){
  if(currentPage < currentPages.length - 1){
    currentPage++;
    localStorage.setItem("page_"+currentBook, currentPage);
    player.xp += 5;
    renderStats();
    renderPage();
  }
}

function prevPage(){
  if(currentPage > 0){
    currentPage--;
    renderPage();
  }
}

function closeReader(){
  document.getElementById("reader").style.display = "none";
}

/* =========================
   🎨 IMAGE GEN (LAZY LOAD)
========================= */
function getBookImage(title){
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(title + " dark fantasy cinematic character")}`;
}

/* =========================
   💎 RARITY
========================= */
function getRarity(){
  const r = Math.random();
  if(r<0.6) return "common";
  if(r<0.85) return "rare";
  if(r<0.95) return "epic";
  if(r<0.99) return "legendary";
  return "mythic";
}

/* =========================
   📚 CREATE BOOK (DEAD)
========================= */
function createBook(name){

  const b = document.createElement("div");
  b.className = "book dead";

  b.dataset.name = name;
  b.dataset.rarity = getRarity();

  b.innerHTML = `
    <div class="placeholder"></div>
    <div class="book-title">${name}</div>
  `;

  b.onclick = () => activateBook(b);

  return b;
}

/* =========================
   ⚡ ACTIVATE BOOK
========================= */
function activateBook(b){

  if(b.classList.contains("active")) return;

  const name = b.dataset.name;
  const img = getBookImage(name);

  b.classList.remove("dead");
  b.classList.add("active");

  b.innerHTML = `
    <div class="book-cover">
      <img src="${img}" loading="lazy"/>
    </div>
    <div class="book-inner">
      <div class="page">${name}</div>
      <div class="page back">📖</div>
    </div>
    <div class="particles"></div>
  `;

  spawnParticles(b);
  whisper?.play().catch(()=>{});

  setTimeout(()=>{
    b.classList.toggle("open");
    openReader(name);
  },150);
}

/* =========================
   ✨ PARTICLES
========================= */
function spawnParticles(el){
  const c = el.querySelector(".particles");

  const interval = setInterval(()=>{
    if(!el.classList.contains("active")){
      clearInterval(interval);
      return;
    }

    const p = document.createElement("div");
    p.className="particle";
    p.style.left=Math.random()*100+"%";
    c.appendChild(p);

    setTimeout(()=>p.remove(),3000);
  },150);
}

/* =========================
   📚 LIBRARY
========================= */
function initLibrary(){
  const rows = document.getElementById("rows");

  coreBooks.forEach(name=>{
    rows.appendChild(createBook(name));
  });

  for(let i=coreBooks.length;i<100;i++){
    rows.appendChild(createBook(generateBookName()));
  }
}

/* =========================
   📊 UI
========================= */
function renderStats(){
  let el = document.getElementById("stats");

  if(!el){
    el = document.createElement("div");
    el.id="stats";
    document.body.prepend(el);
  }

  el.innerHTML = `
    🔥 Level ${player.level} | ⚡ ${player.xp} XP | 📖 ${currentBook || "Idle"}
  `;
}

/* =========================
   🚀 START
========================= */
load();
initLibrary();
renderStats();
