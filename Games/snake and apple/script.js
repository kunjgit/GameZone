const gameContainer = document.querySelector(".game-container");
const snakeHead = document.getElementById("snakeHead");
const apple = document.getElementById("apple");

const gridSize = 50;
const cellSize = gameContainer.clientWidth / gridSize;

let snake = [{ x: 2, y: 2 }];
let direction = { x: 1, y: 0 };
let applePosition = { x: 5, y: 5 };

// Function to update the snake's position and check for collisions
function updateGame() {
  const nextX = snake[0].x + direction.x;
  const nextY = snake[0].y + direction.y;

  if (nextX < 0 || nextX >= gridSize || nextY < 0 || nextY >= gridSize) {
    // Snake collided with the screen boundaries
    gameOver();
    return;
  }

  if (snake.some(segment => segment.x === nextX && segment.y === nextY)) {
    // Snake collided with itself
    gameOver();
    return;
  }

  const newHead = { x: nextX, y: nextY };
  snake.unshift(newHead);

  // Check if the snake ate the apple
  if (nextX === applePosition.x && nextY === applePosition.y) {
    generateApple();
  } else {
    snake.pop();
  }

  drawSnake();
}

// Function to draw the snake on the game board
function drawSnake() {
  snakeHead.style.left = `${snake[0].x * cellSize}px`;
  snakeHead.style.top = `${snake[0].y * cellSize}px`;
}

// Function to generate a new apple at a random position
function generateApple() {
  applePosition = {
    x: Math.floor(Math.random() * gridSize),
    y: Math.floor(Math.random() * gridSize)
  };
  apple.style.left = `${applePosition.x * cellSize}px`;
  apple.style.top = `${applePosition.y * cellSize}px`;
}

// Function to handle keypress events for changing the snake's direction
function handleKeyPress(event) {
  switch (event.key) {
    case "ArrowUp":
      direction = { x: 0, y: -1 };
      break;
    case "ArrowDown":
      direction = { x: 0, y: 1 };
      break;
    case "ArrowLeft":
      direction = { x: -1, y: 0 };
      break;
    case "ArrowRight":
      direction = { x: 1, y: 0 };
      break;
  }
}

// Function to end the game
function gameOver() {
  alert("Game Over! Your score: " + (snake.length - 1));
  snake = [{ x: 2, y: 2 }];
  direction = { x: 1, y: 0 };
  generateApple();
}

// Initialize the game
generateApple();
drawSnake();

// Start the game loop
const gameLoop = setInterval(updateGame, 100);

// Add event listener for handling keypress events
document.addEventListener("keydown", handleKeyPress);
