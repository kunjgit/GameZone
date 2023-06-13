const foodItems = ['🍭', '🍦', '🍒', '🌶️', '🥕', '🌹', '🦋', '🐌', '🐜', '🐥', '🦢', '🦆', '👾', '🐁', '🦎', '🐇', '🐀', '🐍', '🐡', '🪰', '🪱', '🦗', '🐛', '🧟', '🍿', '🧀', '🥩', '🍎', '🍄'];
const playBoard = document.querySelector(".play-board");
const scoreElement = document.querySelector(".score");
const highScoreElement = document.querySelector(".high-score");
const controls = document.querySelectorAll(".controls i");
const gameOverPage = document.querySelector('.gameOverPage');
const wrapper = document.querySelector('.wrapper');

const foodSound = new Audio('./music/food.mp3');
const gameOverSound = new Audio('./music/gameOver.mp3');
const moveSound = new Audio('./music/move.mp3');
const backgroundMusicSound = new Audio('./music/backgroundMusic.wav');
backgroundMusicSound.volume = 0.3;

let gameOver = false;
let foodX, foodY;
let snakeX = 5, snakeY = 5;
let velocityX = 0, velocityY = 0;
let snakeBody = [];
let setIntervalId;
let score = 0;
let direction = [1, 0];
let foodId = Math.floor(Math.random() * foodItems.length);

// Getting high score from the local storage
let highScore = localStorage.getItem("high-score") || 0;
highScoreElement.innerText = `High Score: ${highScore}`;

const updateFoodPosition = () => {
    foodId = Math.floor(Math.random() * foodItems.length);
    // Passing a random 1 - 30 value as food position
    foodX = Math.floor(Math.random() * 60) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

function gamePage() {
    backgroundMusicSound.pause();
    clearInterval(setIntervalId);
    gameOverSound.play();
    wrapper.style.display = 'none';
    gameOverPage.style.display = 'block';
}

const handleGameOver = () => {
    // Clearing the timer and reloading the page on game over
    gamePage();
    setTimeout(function () {
        location.reload();
    }, 3000);
}

const changeDirection = e => {
    // Changing velocity value based on key press
    if (e.key === "ArrowUp" && velocityY != 1) {
        moveSound.play();
        velocityX = 0;
        velocityY = -1;
        direction = [0, -1];
    } else if (e.key === "ArrowDown" && velocityY != -1) {
        moveSound.play();
        velocityX = 0;
        velocityY = 1;
        direction = [0, 1];
    } else if (e.key === "ArrowLeft" && velocityX != 1) {
        moveSound.play();
        velocityX = -1;
        velocityY = 0;
        direction = [-1, 0];
    } else if (e.key === "ArrowRight" && velocityX != -1) {
        moveSound.play();
        velocityX = 1;
        velocityY = 0;
        direction = [1, 0];
    }
    backgroundMusicSound.play();
}

// Calling changeDirection on each key click and passing key dataset value as an object
controls.forEach(button => button.addEventListener("click", () => changeDirection({ key: button.dataset.key })));

const initGame = () => {
    if (gameOver) return handleGameOver();
    let html = `<div class="food" style="grid-area: ${foodY} / ${foodX}">${foodItems[foodId]}</div>`;

    // Checking if the snake hit the food
    if (snakeX === foodX && snakeY === foodY) {
        foodSound.play();
        updateFoodPosition();
        snakeBody.push([foodY, foodX]); // Pushing food position to snake body array
        score++; // increment score by 1
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore);
        scoreElement.innerText = `Score: ${score}`;
        highScoreElement.innerText = `High Score: ${highScore}`;
    }
    // Updating the snake's head position based on the current velocity
    snakeX += velocityX;
    snakeY += velocityY;

    // Shifting forward the values of the elements in the snake body by one
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY]; // Setting first element of snake body to current snake position

    // Checking if the snake's head is out of wall, if so setting gameOver to true
    if (snakeX <= 0 || snakeX > 60 || snakeY <= 0 || snakeY > 30) {
        return gameOver = true;
    }

    let val = 'headRight';
    if (direction[0] === 0 && direction[1] === -1) val = 'headUp';
    else if (direction[0] === 0 && direction[1] === 1) val = 'headDown';
    else if (direction[0] === -1 && direction[1] === 0) val = 'headLeft';
    else if (direction[0] === 1 && direction[1] === 0) val = 'headRight';

    for (let i = 0; i < snakeBody.length; i++) {
        // Adding a div for each part of the snake's body
        if (i === 0)
            html += `<div class="head ${val}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        else
            html += `<div class="tail" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
        // Checking if the snake head hit the body, if so set gameOver to true
        if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true;
        }
    }
    playBoard.innerHTML = html;
}

updateFoodPosition();
setIntervalId = setInterval(initGame, 100);
document.addEventListener("keyup", changeDirection);