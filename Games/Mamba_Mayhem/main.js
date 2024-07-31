// Defining HTML element
const board = document.getElementById("mainBoard");
const text = document.getElementById("text");
const score = document.getElementById("currentScore");
const highScore = document.getElementById("highScore");

const generateRandomPosition = () => {
  const x = Math.floor(Math.random() * 40) + 1;
  const y = Math.floor(Math.random() * 40) + 1;
  return { x, y };
};

//Define game variables
let snake = [{ x: 20, y: 20 }];
let food = generateRandomPosition();
let direction = "right";
let gameInterval;
let gameSpeedDelay = 250;
let gameStarted = false;

// Draw game map, snake, food
const draw = () => {
  board.innerHTML = "";
  drawSnake();
  drawFood();
};

//draw snake
const drawSnake = () => {
  snake.forEach((segment) => {
    const snakeElement = createGameElement("div", "snake");
    setPosition(snakeElement, segment);
    board.appendChild(snakeElement);
  });
};

//create snake or food cube or div
const createGameElement = (tag, className) => {
  const element = document.createElement(tag);
  element.className = className;
  return element;
};

//set position of snake or food
const setPosition = (element, position) => {
  element.style.gridColumn = position.x;
  element.style.gridRow = position.y;
};

// draw food function
const drawFood = () => {
  const foodElement = createGameElement("div", "food");
  setPosition(foodElement, food);
  board.appendChild(foodElement);
};

const move = () => {
  const head = { ...snake[0] };
  switch (direction) {
    case "right":
      head.x++;

      break;
    case "up":
      head.y--;

      break;
    case "left":
      head.x--;

      break;
    case "down":
      head.y++;

      break;

    default:
      break;
  }
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    food = generateRandomPosition();
    updateScore();
    clearInterval(gameInterval); //clear interval
    gameInterval = setInterval(() => {
      move();
      checkCollision();
      draw();
    }, gameSpeedDelay);
  } else {
    snake.pop();
  }
};

//start game
const startGame = () => {
  gameStarted = true;
  text.style.display = "none";
  gameInterval = setInterval(() => {
    move();
    checkCollision();
    draw();
  }, gameSpeedDelay);
};

//keypress listener
const handleKeyPress = (event) => {
  if (
    (!gameStarted && event.code === "Space") ||
    (!gameStarted && event.key === " ")
  ) {
    startGame();
  } else {
    switch (event.key) {
      case "ArrowUp":
        direction = "up";
        break;

      case "ArrowDown":
        direction = "down";
        break;

      case "ArrowLeft":
        direction = "left";
        break;

      case "ArrowRight":
        direction = "right";
        break;

      default:
        break;
    }
  }
};

document.addEventListener("keydown", handleKeyPress);

const checkCollision = () => {
  const head = snake[0];

  if (head.x < 1 || head.x > 40 || head.y < 1 || head.y > 40) {
    console.log(`Event: Border collision`);
    resetGame();
  }

  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      console.log(`Event: Snake collision`);
      resetGame();
      updateScore();
    }
  }
};

const resetGame = () => {
  let foodElement = document.getElementById("food");
  let snakeElement = document.getElementById("snake");
  const currentScore = snake.length - 1;
  if (currentScore > parseInt(highScore.textContent)) {
    updateHighScore();
  }
  snake = [{ x: 20, y: 20 }];
  food = generateRandomPosition();
  direction = "right";
  gameSpeedDelay = 250;
  gameStarted = false;
  text.style.display = "block";
  board.innerHTML = "";
  clearTimeout(gameInterval);
  if (foodElement) {
    board.removeChild(foodElement);
  }
  if (snakeElement) {
    board.removeChild(snakeElement);
  }
  score.textContent = currentScore.toString().padStart(3, "0");
  updateScore();
};

const updateScore = () => {
  const currentScore = snake.length - 1;
  score.textContent = currentScore.toString().padStart(3, "0");
};

const updateHighScore = () => {
  const currentScore = snake.length - 1;
  highScore.textContent = currentScore.toString().padStart(3, "0");
};
