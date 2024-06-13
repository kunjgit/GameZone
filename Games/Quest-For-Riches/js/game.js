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
      npc.interact(); // Trigger interaction
      break;
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

function handleCombat(player, enemy) {
  // Simple collision detection
  if (
    player.position.x < enemy.position.x + enemy.scaledWidth &&
    player.position.x + player.width > enemy.position.x &&
    player.position.y < enemy.position.y + enemy.scaledHeight &&
    player.height + player.position.y > enemy.position.y
  ) {
    console.log("Player and enemy colliding"); // Debug line

    // Check if the player is attacking and handle combat logic
    if (player.isAttacking && player.attackCooldown <= 0) {
      console.log("Attack registered"); // Debug line
      enemy.takeDamage();
      player.attackCooldown = 60; // Reset player attack cooldown
      player.isAttacking = false; // Reset attack flag
    } else if (player.attackCooldown > 0) {
      console.log("Attack on cooldown"); // Debug line
    }
  }
}

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
}
