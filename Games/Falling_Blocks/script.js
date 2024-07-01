const canvas = document.getElementById("game");
const context = canvas.getContext("2d");

// Set the canvas width and height
canvas.width = 400;
canvas.height = 600;

// Create the player platform
const playerWidth = 80;
const playerHeight = 10;
const player = {
  x: canvas.width / 2 - playerWidth / 2,
  y: canvas.height - 20,
  width: playerWidth,
  height: playerHeight,
  color: "#fff",
  speed: 8,
};

// Create the falling blocks
const blockWidth = 50;
const blockHeight = 20;
let blocks = [];
let score = 0;
let highScore = getStoredHighScore(); // Retrieve the high score from storage

// Game state
let isPaused = false;

// Generate a random block
function generateBlock() {
  const x = Math.random() * (canvas.width - blockWidth);
  const color = getRandomColor();
  const block = {
    x: x,
    y: 0,
    width: blockWidth,
    height: blockHeight,
    color: color,
    speed: 2,
  };
  blocks.push(block);
}

// Get a random color
function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// Draw the player platform
function drawPlayer() {
  context.fillStyle = player.color;
  context.fillRect(player.x, player.y, player.width, player.height);
}

// Draw the falling blocks
function drawBlocks() {
  blocks.forEach((block) => {
    context.fillStyle = block.color;
    context.fillRect(block.x, block.y, block.width, block.height);
  });
}

// Move the player platform
function movePlayer(direction) {
  if (direction === "left") {
    player.x -= player.speed;
    if (player.x < 0) {
      player.x = 0;
    }
  } else if (direction === "right") {
    player.x += player.speed;
    if (player.x + player.width > canvas.width) {
      player.x = canvas.width - player.width;
    }
  }
}

// Update the game state
function update() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (!isPaused) {
    // Draw the player platform
    drawPlayer();

    // Draw the falling blocks
    drawBlocks();

    // Move the falling blocks
    blocks.forEach((block) => {
      block.y += block.speed;

      // Check collision with the player platform
      if (
        block.y + block.height >= player.y &&
        block.x >= player.x &&
        block.x + block.width <= player.x + player.width
      ) {
        score++;
        blocks = blocks.filter((b) => b !== block);
      }

      // Remove blocks that reach the bottom
      if (block.y + block.height >= canvas.height) {
        blocks = blocks.filter((b) => b !== block);
      }

      // Check if the score has been updated
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
    });

    // Generate a new block randomly
    if (Math.random() < 0.02) {
      generateBlock();
    }
  }

  // Display the score and high score
  context.fillStyle = "#fff";
  context.font = "20px Arial";
  context.fillText("Score: " + score, 10, 30);
  context.fillText("High Score: " + highScore, 10, 60);

  if (isPaused) {
    drawPauseScreen();
  }
}

// Draw the pause screen
function drawPauseScreen() {
  // Draw a transparent overlay
  context.fillStyle = "rgba(0, 0, 0, 0.5)";
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw the pause text
  context.fillStyle = "#fff";
  context.font = "30px Arial";
  context.fillText("Paused", canvas.width / 2 - 50, canvas.height / 2 - 15);

  // Draw the resume and restart options
  context.font = "20px Arial";
  context.fillText("Press R to Resume", canvas.width / 2 - 75, canvas.height / 2 + 20);
  context.fillText("Press Enter to Restart", canvas.width / 2 - 100, canvas.height / 2 + 50);
}

// Toggle the pause state
function togglePause() {
  isPaused = !isPaused;
}

// Keyboard event listeners
document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") {
    movePlayer("left");
  } else if (event.key === "ArrowRight") {
    movePlayer("right");
  } else if (event.key === " ") {
    togglePause();
  } else if (event.key === "r" || event.key === "R") {
    if (isPaused) {
      togglePause();
    }
  } else if (event.key === "Enter") {
    if (isPaused) {
      // Restart the game by resetting the score, player position, and clearing the blocks
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
      }
      score = 0;
      player.x = canvas.width / 2 - playerWidth / 2;
      blocks = [];
      togglePause();
    }
  }
});

// Update the game every frame
function gameLoop() {
  update();
  requestAnimationFrame(gameLoop);
}

// Retrieve the high score from local storage
function getStoredHighScore() {
  const storedHighScore = localStorage.getItem("highScore");
  return storedHighScore ? parseInt(storedHighScore) : 0;
}

// Start the game loop
gameLoop();
