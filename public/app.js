// ==========================
// 🎮 PLAYER SYSTEM
// ==========================
let player = {
  level: 1,
  xp: 0,
  inventory: [],
  coins: 100
};

// ==========================
// 💾 SAVE / LOAD
// ==========================
function savePlayer(){
  localStorage.setItem("player", JSON.stringify(player));
}

function loadPlayer(){
  const data = localStorage.getItem("player");
  if(data) player = JSON.parse(data);
}

loadPlayer();

// ==========================
// 📚 AUDIOBOOK SERIES
// ==========================
const audiobookSeries = {
    "Quinn Talen Vampire System": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "My Dragonic System": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Birth of a Demonic Sword": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Legendary Beast Tamer": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Gods Eye": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Dragon Inside Me": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Shadow Blade": { duration: 60, currentXP: 0, abilitiesUnlocked: [] },
    "Dragons Revenge": { duration: 60, currentXP: 0, abilitiesUnlocked: [] }
};

// ==========================
// ▶️ PLAYER CONTROL
// ==========================
let currentSeries = null;
let isPlaying = false;

function togglePlayPause(series) {
    if (currentSeries !== series) {
        currentSeries = series;
        isPlaying = true;
        console.log(`🎧 Playing: ${series}`);
    } else {
        isPlaying = !isPlaying;
    }

    console.log(isPlaying ? "▶️ Playing..." : "⏸ Paused...");
}

// ==========================
// ⚡ XP SYSTEM
// ==========================
function getXPBoost(){
  let boost = 1;

  player.inventory.forEach(card => {
    if(card.name === "Blood Power") boost += 0.1 * card.level;
    if(card.name === "Dragon Flame") boost += 0.2 * card.level;
    if(card.name === "God Vision") boost += 0.5 * card.level;
  });

  return boost;
}

function addXP(amount){

  const boost = getXPBoost();

  player.xp += amount * boost;

  if(player.xp >= player.level * 50){
    player.xp = 0;
    player.level++;

    console.log("🔥 LEVEL UP! Now level " + player.level);

    unlockReward();
  }

  savePlayer();
}

// ==========================
// 📚 AUDIO XP (CONNECTED)
// ==========================
function updateXP(series){

    audiobookSeries[series].currentXP += 10;

    // 🎮 GLOBAL XP
    addXP(10);

    // 🎲 CARD DROP
    if(Math.random() < 0.3){
      unlockReward();
    }

    // 🧠 ABILITY
    if (audiobookSeries[series].currentXP > 50) {
        unlockAbility(series);
    }

    // 🔀 FUSION CHECK
    checkFusion();
}

// ==========================
// 🧠 ABILITIES
// ==========================
function unlockAbility(series) {
    audiobookSeries[series].abilitiesUnlocked.push(`New Ability for ${series}`);
    console.log(`🧠 Ability unlocked for ${series}`);
}

// ==========================
// 🃏 CARD SYSTEM
// ==========================
function getRandomReward(){

  const roll = Math.random();

  if (roll < 0.6) return {name:"Blood Power", rarity:"common"};
  if (roll < 0.85) return {name:"Dragon Flame", rarity:"rare"};
  if (roll < 0.95) return {name:"Shadow Step", rarity:"epic"};
  return {name:"God Vision", rarity:"legendary"};
}

function unlockReward(){

  const reward = getRandomReward();

  let existing = player.inventory.find(c => c.name === reward.name);

  if(existing){
    existing.level++;
    console.log("⚡ UPGRADED:", existing.name, "Lv." + existing.level);
  } else {
    const card = {
      name: reward.name,
      rarity: reward.rarity,
      level: 1,
      id: Date.now()
    };

    player.inventory.push(card);
    showCard(card);

    console.log("🔥 NEW CARD:", card.name);
  }

  savePlayer();
}

// ==========================
// 🧬 FUSION SYSTEM
// ==========================
function checkFusion(){

  const hasBlood = player.inventory.find(c => c.name === "Blood Power");
  const hasDragon = player.inventory.find(c => c.name === "Dragon Flame");

  if(hasBlood && hasDragon){

    const exists = player.inventory.find(c => c.name === "Dragon Blood Core");

    if(!exists){
      const fusionCard = {
        name: "Dragon Blood Core",
        rarity: "legendary",
        level: 1,
        id: Date.now()
      };

      player.inventory.push(fusionCard);
      showCard(fusionCard);

      console.log("🧬 FUSION UNLOCKED: Dragon Blood Core");
    }
  }

  savePlayer();
}

// ==========================
// 💪 PLAYER POWER
// ==========================
function getPlayerPower(){

  let power = player.level;

  player.inventory.forEach(card => {
    power += card.level * 2;
  });

  return power;
}

// ==========================
// 💰 CARD VALUE
// ==========================
function getCardValue(card){

  const rarityMult = {
    common: 1,
    rare: 2,
    epic: 5,
    legendary: 10
  };

  const playerPower = getPlayerPower();

  return Math.floor(
    10 * rarityMult[card.rarity] * card.level * (playerPower / 10)
  );
}

// ==========================
// 🛒 MARKET
// ==========================
let market = [];

function listCard(cardId){

  const card = player.inventory.find(c => c.id === cardId);
  const price = getCardValue(card);

  market.push({...card, price});

  player.inventory = player.inventory.filter(c => c.id !== cardId);

  savePlayer();
  renderMarket();
}

function buyCard(cardId){

  const item = market.find(c => c.id === cardId);

  if(player.coins >= item.price){

    player.coins -= item.price;
    player.inventory.push(item);

    market = market.filter(c => c.id !== cardId);

    console.log("🛒 Purchased", item.name);

    savePlayer();
    renderMarket();

  } else {
    console.log("❌ Not enough coins");
  }
}

// ==========================
// 🎨 CARD DISPLAY
// ==========================
function showCard(card){

  const container = document.getElementById("cardCollection");
  if(!container) return;

  const div = document.createElement("div");
  div.className = "card-item " + card.rarity;

  div.innerHTML = `
    <h4>${card.name}</h4>
    <p>${card.rarity}</p>
    <p>Lv.${card.level}</p>
    <button onclick="listCard(${card.id})">Sell</button>
  `;

  container.appendChild(div);
}

// ==========================
// 🛒 MARKET UI
// ==========================
function renderMarket(){

  const el = document.getElementById("market");
  if(!el) return;

  el.innerHTML = "";

  market.forEach(card => {

    const div = document.createElement("div");
    div.className = "card-item " + card.rarity;

    div.innerHTML = `
      <h4>${card.name}</h4>
      <p>${card.rarity}</p>
      <p>💰 ${card.price}</p>
      <button onclick="buyCard(${card.id})">Buy</button>
    `;

    el.appendChild(div);
  });
}

// ==========================
// 🔄 AUTO XP LOOP
// ==========================
setInterval(() => {
  if(isPlaying && currentSeries){
    updateXP(currentSeries);
  }
}, 5000);
