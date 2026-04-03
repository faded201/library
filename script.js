/* =========================
   📲 PWA
========================= */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

/* =========================
   🌐 CORE KEYS & CONFIG
========================= */
const AI_KEYS = {
  GEMINI: "AIzaSyB0I7AlW5MlEE73NvXgJ-G_d8Ie8h23okI",
  GROQ: "",
  OPENROUTER: "",
  HUGGINGFACE: ""
};

const GITHUB_TOKEN = "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";
const REPO_PATH = "faded201/Xavier-OS";

/* =========================
   🔊 SOUND & EFFECTS
========================= */
const ambient = document.getElementById("ambient");
const whisper = document.getElementById("whisper");

document.body.addEventListener("click", () => {
  ambient?.play().catch(() => {});
});

const glow = document.querySelector(".scripture-glow");
document.addEventListener("mousemove", e => {
  glow?.style.setProperty("--x", e.clientX + "px");
  glow?.style.setProperty("--y", e.clientY + "px");
});

/* =========================
   📚 CORE BOOKS & GEN
========================= */
const coreBooks = [
  "Vampire System", "Gods Eye", "My Dragonic System", 
  "Dragon Inside of Me", "Shadow Blade", "Birth of a Demonic Sword", "Legendary Beast Tamer"
];

const words = ["Forbidden","Broken","Savage","Cursed","Immortal","Awakened"];
const hooks = ["System","King","Queen","Gate","Empire"];
const ends = ["of Shadows","of Blood","of Chaos","of Night"];
const genres = ["Dark Fantasy","Romantasy","LitRPG","Progression Fantasy"];

function generateBookName() {
  return `${words[Math.random()*words.length|0]} ${hooks[Math.random()*hooks.length|0]} ${ends[Math.random()*ends.length|0]} [${genres[Math.random()*genres.length|0]}]`;
}

/* =========================
   🎮 PLAYER & SAVE
========================= */
let player = { level: 1, xp: 0 };
let currentBook = null;

function save() { localStorage.setItem("xavierOS_player", JSON.stringify(player)); }
function load() {
  const data = localStorage.getItem("xavierOS_player");
  if(data) player = JSON.parse(data);
}

/* =========================
   🧠 AI ROUTER (LAZY ACTIVATION)
========================= */
const storyCache = {};

async function generateStory(title) {
  if(storyCache[title]) return storyCache[title];

  let text = null;
  if(AI_KEYS.GEMINI) text = await tryAI(geminiAI, title);
  if(!text && AI_KEYS.GROQ) text = await tryAI(groqAI, title);

  if(!text) return fallbackStory(title);

  const pages = text.match(/.{1,400}/g)?.map((t,i) => `
    <h3>${title} — Chapter ${i+1}</h3>
    <p>${t}</p>
  `);

  storyCache[title] = pages;
  autoPostToGitHub(title, text);
  return pages;
}

async function tryAI(fn, title) { try { return await fn(title); } catch { return null; } }

async function geminiAI(title) {
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash:generateContent?key=${AI_KEYS.GEMINI}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents: [{ parts: [{ text: `You are Xavier. Write a cinematic dark fantasy story titled "${title}". Focus on deep world-building and atmosphere.` }] }] })
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text;
}

/* =========================
   🚀 GITHUB ARCHIVE
========================= */
async function autoPostToGitHub(title, text) {
  const filename = `library/${title.replace(/\s+/g, '_').toLowerCase()}.json`;
  const storyData = { title, text, timestamp: new Date().toISOString() };
  const encodedContent = btoa(unescape(encodeURIComponent(JSON.stringify(storyData, null, 2))));
  try {
    await fetch(`https://api.github.com/repos/${REPO_PATH}/contents/${filename}`, {
      method: "PUT",
      headers: { "Authorization": `Bearer ${GITHUB_TOKEN}`, "Content-Type": "application/json" },
      body: JSON.stringify({ message: `Xavier-OS Auto-Gen: ${title}`, content: encodedContent })
    });
  } catch (e) { console.error("Archive Failed"); }
}

/* =========================
   📖 READER & AUDIO
========================= */
let currentPage = 0;
let currentPages = [];

function speak(text) {
  if(!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const msg = new SpeechSynthesisUtterance(text.replace(/<[^>]*>/g, ''));
  msg.rate = 0.9;
  speechSynthesis.speak(msg);
}

async function openReader(title) {
  currentBook = title;
  currentPages = await generateStory(title);
  currentPage = +localStorage.getItem("page_"+title) || 0;
  document.getElementById("reader").style.display = "flex";
  renderPage();
}

function renderPage() {
  const content = currentPages[currentPage];
  document.getElementById("readerContent").innerHTML = content;
  speak(content);
}

function nextPage() {
  if(currentPage < currentPages.length - 1) {
    currentPage++;
    localStorage.setItem("page_"+currentBook, currentPage);
    player.xp += 5;
    renderStats();
    renderPage();
  }
}

function closeReader() {
  document.getElementById("reader").style.display = "none";
  speechSynthesis.cancel();
}

/* =========================
   🎨 RESOURCE SAVER: THE DEAD BOOK
========================= */
function createBook(name) {
  const b = document.createElement("div");
  // Starts as 'dead' - CSS should handle grayscale/darkness
  b.className = "book dead"; 
  b.dataset.name = name;

  // No <img> tag yet to save bandwidth
  b.innerHTML = `
    <div class="placeholder-icon">?</div>
    <div class="book-title">${name}</div>
  `;

  b.onclick = () => activateBook(b);
  return b;
}

function activateBook(b) {
  // If already alive, just open the reader
  if(b.classList.contains("active")) {
    openReader(b.dataset.name);
    return;
  }

  const name = b.dataset.name;
  const imgUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(name + " dark fantasy cinematic cover")}`;

  // Awakening Sequence
  b.classList.remove("dead");
  b.classList.add("active");
  whisper?.play().catch(() => {});

  // Inject the heavy image only now
  b.innerHTML = `
    <div class="book-cover">
      <img src="${imgUrl}" onload="this.parentElement.classList.add('loaded')" />
    </div>
    <div class="book-inner">
      <div class="page">${name}</div>
    </div>
    <div class="particles"></div>
  `;

  // Small delay to let the user see the "Coming to Life" animation
  setTimeout(() => openReader(name), 600);
}

/* =========================
   📚 INITIALIZE
========================= */
function initLibrary() {
  const rows = document.getElementById("rows");
  rows.innerHTML = ""; // Clear existing

  coreBooks.forEach(name => rows.appendChild(createBook(name)));
  for(let i=0; i<20; i++) rows.appendChild(createBook(generateBookName()));
}

function renderStats() {
  let el = document.getElementById("stats");
  if(!el) {
    el = document.createElement("div");
    el.id = "stats";
    document.body.prepend(el);
  }
  el.innerHTML = `🔥 LVL ${player.level} | ⚡ ${player.xp} XP | 📖 ${currentBook || "Searching Archives..."}`;
}

load();
initLibrary();
renderStats();
