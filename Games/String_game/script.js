const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');
const startButton = document.getElementById('start-button');

const gridSize = 20;
const gridSizeX = canvas.width / gridSize;
const gridSizeY = canvas.height / gridSize;

let snake = [{ x: 5, y: 5 }];
let food = { x: 10, y: 10 };
let direction = 'right';
let gameInterval;
let score = 0;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw snake
    ctx.fillStyle = 'green';
    for (let i = 0; i < snake.length; i++) {
        ctx.fillRect(snake[i].x * gridSize, snake[i].y * gridSize, gridSize, gridSize);
    }
}

function update() {
    const head = { ...snake[0] };

    // Update snake position based on direction
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }

    snake.unshift(head);

    // Check for collision with food
    if (head.x === food.x && head.y === food.y) {
        score++;
        generateFood();
    } else {
        snake.pop();
    }

    // Check for game over conditions
    if (head.x < 0 || head.x >= gridSizeX || head.y < 0 || head.y >= gridSizeY || checkCollision(head)) {

        gameOver();
        return;
    }

    draw();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * gridSizeX),
        y: Math.floor(Math.random() * gridSizeY)
    };
}

function checkCollision(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true;
        }
    }
    return false;
}

function startGame() {

    snake = [{ x: 5, y: 5 }];
    direction = 'right';
    score = 0;
    generateFood();

    if (gameInterval) {
        clearInterval(gameInterval);
    }

    gameInterval = setInterval(update, 100);
}

function gameOver() {

    clearInterval(gameInterval);
    alert('Game over! Your score: ' + score);

}

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (direction !== 'down') direction = 'up';
            break;
        case 'ArrowDown':
            if (direction !== 'up') direction = 'down';
            break;
        case 'ArrowLeft':
            if (direction !== 'right') direction = 'left';
            break;
        case 'ArrowRight':
            if (direction !== 'left') direction = 'right';
            break;
    }
});

startButton.addEventListener('click', startGame);
