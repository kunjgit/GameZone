const c = canvas.getContext("2d");

// Set the canvas size to a reasonable size
canvas.width = 960;
canvas.height = 540;

const GAME_WORLD_WIDTH = canvas.width * 3; // Example game world size, 3 times the canvas width
const player = new Player();
const npc = new NPC(300, 300); // Add NPC near the start of the game world
const enemies = [
  new Enemy(1000, 300),
  new Enemy(1400, 300),
  new Enemy(1800, 300),
];

// Add coins to the game world
const coins = [
  new Coin(950, 300, player),
  new Coin(1300, 400, player),
  new Coin(1500, 300, player),
  new Coin(1600, 300, player),
  new Coin(1900, 400, player),
  new Coin(2200, 400, player),
  new Coin(2600, 400, player),
];

// Add a key to the game world
const key = new Key(1800, 100); // Position the key somewhere on the map

// Add a chest to the end of the game world
const chest = new Chest(GAME_WORLD_WIDTH - 200, canvas.height - 80);

const missionTracker = document.getElementById("missionTracker");

const missions = [
  "Talk to The Archer",
  "Defeat all Wizards",
  "Collect the Key",
  "Open the Chest",
  "Return to The Archer",
];

let currentMissionIndex = 0;

function updateMissionTracker() {
  if (currentMissionIndex < missions.length) {
    missionTracker.innerHTML = `Mission: ${missions[currentMissionIndex]}`;
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
  " ": {
    pressed: false,
  },
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  e: {
    pressed: false,
  },
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
      if (enemies.length === 0) {
        currentMissionIndex++;
      }
      break;
    case 2:
      if (player.hasKey) {
        currentMissionIndex++;
      }
      break;
    case 3:
      if (chest.isOpen) {
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
        const index = enemies.indexOf(enemy);
        if (index > -1) {
          enemies.splice(index, 1); // Remove defeated enemy
          console.log("Enemy defeated. Remaining enemies: ", enemies.length);
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
  console.log("Next level");
});

document
  .getElementById("closeTransitionScreen")
  .addEventListener("click", () => {
    const transitionScreen = document.getElementById("transitionScreen");
    transitionScreen.classList.add("hidden");
    transitionScreen.style.display = "none";
  });

startLevel();

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

  enemies.forEach((enemy) => {
    enemy.update(cameraOffsetX, player);
    handleCombat(player, enemy);
  });

  // Update and draw coins
  coins.forEach((coin) => {
    coin.update(cameraOffsetX, player);
  });

  // Update and draw the key
  key.update(cameraOffsetX, player);

  // Update and draw the chest
  chest.update(cameraOffsetX, player, enemies);

  // Update the mission tracker position to stay at the top right of the canvas
  const canvasRect = canvas.getBoundingClientRect();
  missionTracker.style.left = `${
    canvasRect.right - missionTracker.offsetWidth - 20
  }px`;
  missionTracker.style.top = `${canvasRect.top + 20}px`;

  checkMissionProgress();
}
