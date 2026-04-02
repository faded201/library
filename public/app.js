/* =========================
   📲 APP MODE (PWA)
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
  if (ambient) ambient.play().catch(()=>{});
});

/* =========================
   💡 LIGHT FOLLOW
========================= */
const glow = document.querySelector(".scripture-glow");

document.addEventListener("mousemove", e => {
  if (!glow) return;
  glow.style.setProperty("--x", e.clientX + "px");
  glow.style.setProperty("--y", e.clientY + "px");
});

/* =========================
   📚 CORE BOOKS (YOURS)
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
   🔥 GENERATOR
========================= */
const words = ["Forbidden","Broken","Savage","Cursed","Immortal","Awakened"];
const hooks = ["System","King","Queen","Gate","Empire"];
const ends = ["of Shadows","of Blood","of Chaos","of Night"];
const genres = ["Dark Fantasy","Romantasy","LitRPG","Progression Fantasy"];

function generateBookName(){
  return `${words[Math.random()*words.length|0]} ${hooks[Math.random()*hooks.length|0]} ${ends[Math.random()*ends.length|0]} [${genres[Math.random()*genres.length|0]}]`;
}

/* =========================
   🎮 PLAYER SYSTEM
========================= */
let player = {
  level: 1,
  xp: 0
};

let currentBook = null;

/* =========================
   💾 SAVE SYSTEM
========================= */
function save(){
  localStorage.setItem("xavierOS_player", JSON.stringify(player));
}

function load(){
  const data = localStorage.getItem("xavierOS_player");
  if(data) player = JSON.parse(data);
}

/* =========================
   📖 STORY SYSTEM
========================= */
const stories = {};

function generateStory(title){

  if(stories[title]) return stories[title];

  const pages = [];

  for(let i=1;i<=10;i++){
    pages.push(`
      <h3>${title} — Chapter ${i}</h3>
      <p>
      The system awakens.
      Power surges through the chosen.
      ${title} begins its rise.
      Every decision reshapes fate.
      </p>
    `);
  }

  stories[title] = pages;
  return pages;
}

/* =========================
   📖 READER SYSTEM
========================= */
let currentPage = 0;
let currentPages = [];

function openReader(title){

  currentBook = title;
  currentPages = generateStory(title);

  currentPage = parseInt(localStorage.getItem("page_"+title)) || 0;

  document.getElementById("reader").style.display = "flex";

  renderPage();
}

function renderPage(){
  document.getElementById("readerContent").innerHTML =
    currentPages[currentPage];
}

function nextPage(){
  if(currentPage < currentPages.length - 1){
    currentPage++;

    localStorage.setItem("page_"+currentBook, currentPage);

    addXP();
    renderPage();
    save();
  }
}

function prevPage(){
  if(currentPage > 0){
    currentPage--;
    localStorage.setItem("page_"+currentBook, currentPage);
    renderPage();
  }
}

function closeReader(){
  document.getElementById("reader").style.display = "none";
}

/* =========================
   🔥 BOOK BOOSTS
========================= */
function getBoost(name){
  if(name === "Vampire System") return 1.5;
  if(name === "Gods Eye") return 2;
  if(name === "My Dragonic System") return 1.7;
  if(name === "Dragon Inside of Me") return 1.6;
  return 1;
}

/* =========================
   ✨ PARTICLES
========================= */
function spawnParticles(el){
  const c = el.querySelector(".particles");

  setInterval(()=>{
    const p = document.createElement("div");
    p.className = "particle";
    p.style.left = Math.random()*100 + "%";

    c.appendChild(p);

    setTimeout(()=>p.remove(),3000);
  },200);
}

/* =========================
   📖 CREATE BOOK
========================= */
function createBook(name){

  const b = document.createElement("div");
  b.className = "book";

  if(coreBooks.includes(name)){
    b.style.boxShadow = "0 0 30px red, 0 0 60px gold";
  }

  b.innerHTML = `
    <div class="book-inner">
      <div class="page">${name}</div>
      <div class="page back">📖</div>
    </div>
    <div class="particles"></div>
  `;

  b.onclick = () => {
    b.classList.toggle("open");

    if (whisper) whisper.play().catch(()=>{});

    openReader(name);
  };

  spawnParticles(b);
  return b;
}

/* =========================
   ⚡ XP SYSTEM
========================= */
function addXP(){

  if(!currentBook) return;

  const boost = getBoost(currentBook);

  player.xp += 10 * boost;

  if(player.xp >= player.level * 100){
    player.xp = 0;
    player.level++;

    spawnNewBook();
  }

  save();
  renderStats();
}

/* =========================
   📚 SPAWN SYSTEM
========================= */
function spawnNewBook(){

  let name;

  if(Math.random() < 0.3){
    name = coreBooks[Math.random()*coreBooks.length|0];
  } else {
    name = generateBookName();
  }

  const book = createBook(name);
  document.getElementById("rows").appendChild(book);

  if(rows.children.length > 150){
    rows.removeChild(rows.firstChild);
  }
}

/* =========================
   🚀 INIT LIBRARY
========================= */
function initLibrary(){

  const rows = document.getElementById("rows");

  coreBooks.forEach(name=>{
    rows.appendChild(createBook(name));
  });

  for(let i=coreBooks.length;i<137;i++){
    rows.appendChild(createBook(generateBookName()));
  }
}

/* =========================
   🔄 AUTO LOOP
========================= */
setInterval(()=>{
  if(currentBook){
    addXP();

    if(Math.random() < 0.3){
      spawnNewBook();
    }
  }
},3000);

/* =========================
   📊 UI
========================= */
function renderStats(){

  let el = document.getElementById("stats");

  if(!el){
    el = document.createElement("div");
    el.id = "stats";
    el.style.textAlign="center";
    document.body.insertBefore(el, document.getElementById("rows"));
  }

  el.innerHTML = `
    🔥 Level: ${player.level} |
    ⚡ XP: ${player.xp} |
    📖 Reading: ${currentBook || "None"}
  `;
}

/* =========================
   🚀 START
========================= */
load();
initLibrary();
renderStats();
