// Select the HTML elements
const mainScreen = document.getElementById("mainScreen");
const controlsScreen = document.getElementById("controlsScreen");
const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");
const missionTracker = document.getElementById("missionTracker");
const startButton = document.getElementById("startButton");
const controlsButton = document.getElementById("controlsButton");
const backButton = document.getElementById("backButton");

// Set the canvas size to a reasonable size
canvas.width = 960;
canvas.height = 540;

const GAME_WORLD_WIDTH = canvas.width * 3; // Example game world size, 3 times the canvas width
const player = new Player();
const npc = new NPC(300, 300); // Add NPC near the start of the game world

let levelIndex = 0; // Current level index
let level = null;

function initializeLevel(index) {
  if (index >= 0 && index < levelData.length) {
    level = new Level(levelData[index]);
    level.initializeGameWorld(player);
    console.log("Level initialized:", level);
  } else {
    console.error("Invalid level index:", index);
  }
}

initializeLevel(levelIndex);

let currentMissionIndex = 0;

function updateMissionTracker() {
  if (currentMissionIndex < level.missions.length) {
    missionTracker.innerHTML = `Mission: ${level.missions[currentMissionIndex]}`;
  } else {
    missionTracker.innerHTML = "Mission Complete!";
  }
}

updateMissionTracker();

// Adjust the background layers to span the entire game world
const backgroundLayers = [
  { src: "assets/images/background/background_layer_1.png", zIndex: 1, x: 0 },
  { src: "assets/images/background/background_layer_2.png", zIndex: 2, x: 0 },
  { src: "assets/images/background/background_layer_3.png", zIndex: 3, x: 0 },
];

const loadedBackgrounds = [];

backgroundLayers.forEach((layer) => {
  const img = new Image();
  img.src = layer.src;
  img.onload = () => {
    loadedBackgrounds.push({ img, zIndex: layer.zIndex, x: layer.x });
    if (loadedBackgrounds.length === backgroundLayers.length) {
      animate();
    }
  };
  img.onerror = () => {
    console.error("Failed to load image:", layer.src);
  };
});

const keys = {
  " ": { pressed: false },
  a: { pressed: false },
  d: { pressed: false },
  e: { pressed: false },
};

let cameraOffsetX = 0;

window.addEventListener("keydown", (event) => {
  if (
    document.getElementById("transitionScreen").classList.contains("hidden")
  ) {
    switch (event.key) {
      case " ":
        if (player.velocity.y === 0) {
          player.velocity.y = -10;
          player.setAnimation("jump");
        }
        break;
      case "a":
        keys.a.pressed = true;
        player.setAnimation("run");
        player.direction = "left";
        break;
      case "d":
        keys.d.pressed = true;
        player.setAnimation("run");
        player.direction = "right";
        break;
      case "e":
        keys.e.pressed = true;
        player.isInteracting = true;
        npc.interact(player); // Trigger interaction with player state
        break;
    }
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "a":
      keys.a.pressed = false;
      if (!keys.d.pressed) {
        player.setAnimation("idle");
      }
      break;
    case "d":
      keys.d.pressed = false;
      if (!keys.a.pressed) {
        player.setAnimation("idle");
      }
      break;
    case "e":
      keys.e.pressed = false;
      player.isInteracting = false;
      break;
  }
});

canvas.addEventListener("mousedown", (event) => {
  if (player.attackCooldown <= 0) {
    player.isAttacking = true; // Set a flag to indicate an attack is initiated
    player.attack();
  }
});

function drawBackgrounds() {
  loadedBackgrounds.sort((a, b) => a.zIndex - b.zIndex);
  loadedBackgrounds.forEach((layer) => {
    // Tile the background image to cover the entire game world width
    for (let i = -1; i <= GAME_WORLD_WIDTH / canvas.width; i++) {
      c.drawImage(
        layer.img,
        layer.x + i * canvas.width - cameraOffsetX,
        0,
        canvas.width,
        canvas.height
      );
    }
  });
}

function checkMissionProgress() {
  switch (currentMissionIndex) {
    case 0:
      if (npc.isChatting && npc.dialogueState > 2) {
        currentMissionIndex++;
      }
      break;
    case 1:
      if (level.enemies.length === 0) {
        currentMissionIndex++;
      }
      break;
    case 2:
      if (player.hasKey) {
        currentMissionIndex++;
      }
      break;
    case 3:
      if (level.chest.isOpen) {
        currentMissionIndex++;
      }
      break;
    case 4:
      if (
        npc.isChatting &&
        npc.dialogueState === 0 &&
        player.hasCollectedTreasure
      ) {
        currentMissionIndex++;
      }
      break;
  }
  updateMissionTracker();
}

function handleCombat(player, enemy) {
  if (
    player.position.x < enemy.position.x + enemy.scaledWidth &&
    player.position.x + player.width > enemy.position.x &&
    player.position.y < enemy.position.y + enemy.scaledHeight &&
    player.height + player.position.y > enemy.position.y
  ) {
    console.log("Player and enemy colliding"); // Debug line

    if (player.isAttacking && player.attackCooldown <= 0) {
      console.log("Attack registered"); // Debug line
      enemy.takeDamage();
      player.attackCooldown = 60; // Reset player attack cooldown
      player.isAttacking = false; // Reset attack flag

      if (enemy.health <= 0) {
        const index = level.enemies.indexOf(enemy);
        if (index > -1) {
          level.enemies.splice(index, 1); // Remove defeated enemy
          console.log(
            "Enemy defeated. Remaining enemies: ",
            level.enemies.length
          );
        }
      }
    } else if (player.attackCooldown > 0) {
      console.log("Attack on cooldown"); // Debug line
    }
  }
}

let startTime;

function startLevel() {
  startTime = new Date();
}

function endLevel() {
  const endTime = new Date();
  const timeTaken = Math.floor((endTime - startTime) / 1000);
  const coinsCollected = player.coins;
  const score = calculateScore(coinsCollected, timeTaken);

  document.getElementById("coinsCollected").innerText = coinsCollected;
  document.getElementById("timeTaken").innerText = `${timeTaken}s`;
  document.getElementById("finalScore").innerText = score;

  const transitionScreen = document.getElementById("transitionScreen");
  transitionScreen.classList.remove("hidden");
  transitionScreen.style.display = "flex";
}

function calculateScore(coins, time) {
  return coins * 10 - time * 5;
}

document.getElementById("replayButton").addEventListener("click", () => {
  location.reload(); // Reload the game for now, you can customize this
});

document.getElementById("nextLevelButton").addEventListener("click", () => {
  // Logic for moving to the next level
  levelIndex++;
  if (levelIndex < levelData.length) {
    initializeLevel(levelIndex);
    resetGameState();
    startLevel();
    updateMissionTracker();
    const transitionScreen = document.getElementById("transitionScreen");
    transitionScreen.classList.add("hidden");
    transitionScreen.style.display = "none";
  } else {
    console.log("No more levels available");
    const endGameScreen = document.getElementById("endGameScreen");
    endGameScreen.classList.remove("hidden");
    endGameScreen.style.display = "flex";
  }
});

document.getElementById("closeEndGameScreen").addEventListener("click", () => {
  const endGameScreen = document.getElementById("endGameScreen");
  endGameScreen.classList.add("hidden");
  endGameScreen.style.display = "none";
});

document.getElementById("replayGameButton").addEventListener("click", () => {
  levelIndex = 0;
  initializeLevel(levelIndex);
  resetGameState();
  startLevel();
  updateMissionTracker();
  const endGameScreen = document.getElementById("endGameScreen");
  endGameScreen.classList.add("hidden");
  endGameScreen.style.display = "none";
});

document
  .getElementById("closeTransitionScreen")
  .addEventListener("click", () => {
    const transitionScreen = document.getElementById("transitionScreen");
    transitionScreen.classList.add("hidden");
    transitionScreen.style.display = "none";
  });

function resetGameState() {
  player.position = { x: 50, y: 50 };
  player.velocity = { x: 0, y: 0 };
  player.health = 20;
  player.coins = 0;
  player.hasKey = false;
  player.hasCollectedTreasure = false;
  player.setAnimation("idle");

  npc.isChatting = false;
  npc.dialogueState = 0;
  npc.finalDialogueDone = false;

  currentMissionIndex = 0;
  cameraOffsetX = 0;

  // Clear puzzle input and modal state
  document.getElementById("puzzleInput").value = "";
  document.getElementById("puzzleModal").style.display = "none";

  if (level && level.chest) {
    // Ensure the chest is reset properly
    level.chest.isOpen = false;
    level.chest.frameY = 4; // Reset to initial frame
    level.chest.frameX = 0;
    level.chest.frameTick = 0;
    level.chest.animationComplete = false;
    level.chest.puzzleSolution = "";
  }

  // Re-initialize coins
  if (level && level.coinsData) {
    level.coins = level.coinsData.map(
      (coin) => new Coin(coin.x, coin.y, player)
    );
  }

  // Re-initialize enemies
  if (level && level.enemiesData) {
    level.enemies = level.enemiesData.map(
      (enemy) => new Enemy(enemy.x, enemy.y, enemy.spriteData)
    );
  }

  console.log("Game state reset. Current level:", levelIndex);
  console.log("Enemies:", level.enemies);
  console.log("Coins:", level.coins);
  console.log("Chest:", level.chest);
  console.log("Key:", level.key);
}

mainScreen.classList.remove("hidden");
mainScreen.style.display = "flex";

startButton.addEventListener("click", () => {
  mainScreen.classList.add("hidden");
  mainScreen.style.display = "none";
  canvas.classList.remove("hidden");
  missionTracker.classList.remove("hidden");
  startLevel();
});

controlsButton.addEventListener("click", () => {
  mainScreen.classList.add("hidden");
  mainScreen.style.display = "none";
  controlsScreen.classList.remove("hidden");
  controlsScreen.style.display = "flex";
});

backButton.addEventListener("click", () => {
  controlsScreen.classList.add("hidden");
  controlsScreen.style.display = "none";
  mainScreen.classList.remove("hidden");
  mainScreen.style.display = "flex";
});

function animate() {
  window.requestAnimationFrame(animate);

  c.clearRect(0, 0, canvas.width, canvas.height);

  drawBackgrounds();

  player.velocity.x = 0;
  const playerSpeed = 2;
  if (keys.d.pressed && player.position.x + player.width < GAME_WORLD_WIDTH) {
    player.velocity.x = playerSpeed;
  } else if (keys.a.pressed && player.position.x > 0) {
    player.velocity.x = -playerSpeed;
  }

  player.update(cameraOffsetX);
  npc.update(cameraOffsetX, player); // Update the NPC

  cameraOffsetX = Math.max(
    0,
    Math.min(
      player.position.x - canvas.width / 2 + player.width / 2,
      GAME_WORLD_WIDTH - canvas.width
    )
  );

  level.enemies.forEach((enemy) => {
    if (typeof enemy.update === "function") {
      enemy.update(cameraOffsetX, player);
      handleCombat(player, enemy);
    } else {
      console.error("Enemy is not properly instantiated:", enemy);
    }
  });

  // Update and draw coins
  level.coins.forEach((coin) => {
    coin.update(cameraOffsetX, player);
  });

  // Update and draw the key
  if (level && level.key && typeof level.key.update === "function") {
    level.key.update(cameraOffsetX, player);
  } else {
    console.error("Key is not properly instantiated:", level.key);
  }

  // Update and draw the chest
  if (level && level.chest && typeof level.chest.update === "function") {
    level.chest.update(cameraOffsetX, player, level.enemies);
  } else {
    console.error("Chest is not properly instantiated:", level.chest);
  }

  // Update the mission tracker position to stay at the top right of the canvas
  const canvasRect = canvas.getBoundingClientRect();
  missionTracker.style.left = `${
    canvasRect.right - missionTracker.offsetWidth - 20
  }px`;
  missionTracker.style.top = `${canvasRect.top + 20}px`;

  checkMissionProgress();
}
