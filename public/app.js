// ==========================/* 📲 ENABLE APP MODE */
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js');
}

/* 🔊 SOUND */
const ambient = document.getElementById("ambient");
const whisper = document.getElementById("whisper");

document.body.addEventListener("click",()=>{
  ambient.play();
});

/* 💡 LIGHT */
const glow=document.querySelector(".scripture-glow");

document.addEventListener("mousemove",e=>{
  glow.style.setProperty("--x",e.clientX+"px");
  glow.style.setProperty("--y",e.clientY+"px");
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
   🔥 TRENDING GENERATOR
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

/* 🔥 BOOK BOOSTS */
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
  const c=el.querySelector(".particles");
  setInterval(()=>{
    const p=document.createElement("div");
    p.className="particle";
    p.style.left=Math.random()*100+"%";
    c.appendChild(p);
    setTimeout(()=>p.remove(),3000);
  },200);
}

/* =========================
   📖 CREATE BOOK
========================= */
function createBook(name){

  const b=document.createElement("div");
  b.className="book";

  /* 👑 highlight your books */
  if(coreBooks.includes(name)){
    b.style.boxShadow="0 0 30px red, 0 0 60px gold";
  }

  b.innerHTML=`
    <div class="book-inner">
      <div class="page">${name}</div>
      <div class="page back">📖</div>
    </div>
    <div class="particles"></div>
  `;

  b.onclick=()=>{
    b.classList.toggle("open");
    whisper.play();

    currentBook = name;
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

    // reward = spawn new book
    spawnNewBook();
  }

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

  // cleanup
  if(rows.children.length > 150){
    rows.removeChild(rows.firstChild);
  }
}

/* =========================
   🚀 INIT 137 BOOKS
========================= */
function initLibrary(){

  // your core first
  coreBooks.forEach(name=>{
    rows.appendChild(createBook(name));
  });

  // fill to 137
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
   START
========================= */
initLibrary();
renderStats();
