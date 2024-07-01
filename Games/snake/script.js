const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const gridSize = 20;
let snake = [{x: 10, y: 10}];
let food = {x: 15, y: 15};
let dx = 0;
let dy = 0;
let score = 0;
let gameInterval;

document.addEventListener("keydown", changeDirection);

function changeDirection(event) {
    const keyPressed = event.key;
    if (keyPressed === "ArrowUp" && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === "ArrowDown" && dy === 0) {
        dx = 0;
        dy = 1;
    } else if (keyPressed === "ArrowLeft" && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === "ArrowRight" && dx === 0) {
        dx = 1;
        dy = 0;
    }
}

function drawSnake() {
    ctx.fillStyle = "#000";
    snake.forEach((segment) => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function drawFood() {
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = {x: snake[0].x + dx, y: snake[0].y + dy};
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        createFood();
    } else {
        snake.pop();
    }
}

function createFood() {
    food.x = Math.floor(Math.random() * (canvas.width / gridSize));
    food.y = Math.floor(Math.random() * (canvas.height / gridSize));
}

function drawScore() {
    ctx.fillStyle = "#000";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 25);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSnake();
    drawFood();
    drawScore();
    moveSnake();

    if (checkCollision()) {
        gameOver();
        return;
    }
}

function checkCollision() {
    const head = snake[0];
    return (
        head.x < 0 ||
        head.x >= canvas.width / gridSize ||
        head.y < 0 ||
        head.y >= canvas.height / gridSize ||
        snake.slice(1).some(segment => segment.x === head.x && segment.y === head.y)
    );
}

function gameOver() {
    clearInterval(gameInterval);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#000";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
}

gameInterval = setInterval(draw, 100);
