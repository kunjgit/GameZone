const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

const gameOverScreen = document.getElementById('gameOver');
const startScreen = document.getElementById('startScreen');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('highScore');
const fuelDisplay = document.getElementById('fuel');
const finalScoreDisplay = document.getElementById('finalScore');
const restartButton = document.getElementById('restartButton');
const startButton = document.getElementById('startButton');

let rocket, obstacles, powerUps, stars;
let score, highScore, fuel;
let obstacleSpeed, powerUpSpeed, obstacleInterval;
let gameRunning = false;
let lastTime = 0;
let keys = {};
const SPEED = 300; // pixels per second

class GameObject {
    constructor(x, y, width, height, color) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

class Rocket extends GameObject {
    constructor(x, y) {
        super(x, y, 30, 60, 'red');
    }

    draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();

        // Draw flames
        ctx.fillStyle = 'orange';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.lineTo(this.x + this.width / 2, this.y + this.height + 20);
        ctx.lineTo(this.x + this.width, this.y + this.height);
        ctx.closePath();
        ctx.fill();
    }
}

class Obstacle extends GameObject {
    constructor(x, y, width, height) {
        super(x, y, width, height, 'white');
        this.type = Math.random() < 0.3 ? 'moving' : 'static';
        this.direction = Math.random() < 0.5 ? 1 : -1;
        this.speed = Math.random() * 2 + 1;
    }

    update(deltaTime) {
        this.x -= obstacleSpeed * deltaTime;
        if (this.type === 'moving') {
            this.y += this.speed * this.direction * deltaTime;
            if (this.y <= 0 || this.y + this.height >= canvas.height) {
                this.direction *= -1;
            }
        }
    }
}

class PowerUp extends GameObject {
    constructor(x, y) {
        super(x, y, 20, 20, 'yellow');
        this.type = Math.random() < 0.3 ? 'fuel' : 'score';
    }

    update(deltaTime) {
        this.x -= powerUpSpeed * deltaTime;
    }

    draw() {
        ctx.fillStyle = this.type === 'fuel' ? 'green' : 'gold';
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
    }
}

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1;
        this.speed = Math.random() * 3 + 1;
    }

    update(deltaTime) {
        this.x -= this.speed * deltaTime;
        if (this.x < 0) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }

    draw() {
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initGame() {
    rocket = new Rocket(50, canvas.height / 2);
    obstacles = [];
    powerUps = [];
    stars = Array(100).fill().map(() => new Star());
    score = 0;
    fuel = 100;
    obstacleSpeed = 200; // pixels per second
    powerUpSpeed = 150; // pixels per second
    obstacleInterval = 1500;
}

function drawBackground() {
    ctx.fillStyle = '#000020';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    stars.forEach(star => {
        star.draw();
    });
}

function updateGame(currentTime) {
    if (!gameRunning) return;

    const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
    lastTime = currentTime;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();

    // Handle rocket movement
    if (keys['ArrowUp']) {
        rocket.y = Math.max(rocket.y - SPEED * deltaTime, 0);
    }
    if (keys['ArrowDown']) {
        rocket.y = Math.min(rocket.y + SPEED * deltaTime, canvas.height - rocket.height);
    }

    rocket.draw();

    stars.forEach(star => star.update(deltaTime));

    obstacles.forEach(obstacle => {
        obstacle.update(deltaTime);
        obstacle.draw();
    });
    powerUps.forEach(powerUp => {
        powerUp.update(deltaTime);
        powerUp.draw();
    });

    // Remove off-screen obstacles and power-ups
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
    powerUps = powerUps.filter(powerUp => powerUp.x + powerUp.width > 0);

    // Check collisions
    if (checkCollisions()) {
        endGame();
        return;
    }

    // Update score and fuel
    score += Math.floor(50 * deltaTime);
    fuel = Math.max(fuel - 5 * deltaTime, 0);
    if (fuel <= 0) {
        endGame();
        return;
    }

    // Update UI
    scoreDisplay.textContent = `Score: ${score}`;
    fuelDisplay.textContent = `Fuel: ${Math.round(fuel)}%`;

    // Increase difficulty
    if (score % 500 === 0 && score > 0) {
        obstacleSpeed += 10;
        powerUpSpeed += 5;
        obstacleInterval = Math.max(obstacleInterval - 100, 500);
    }

    requestAnimationFrame(updateGame);
}

function checkCollisions() {
    // Check obstacle collisions
    for (let obstacle of obstacles) {
        if (
            rocket.x < obstacle.x + obstacle.width &&
            rocket.x + rocket.width > obstacle.x &&
            rocket.y < obstacle.y + obstacle.height &&
            rocket.y + rocket.height > obstacle.y
        ) {
            return true;
        }
    }

    // Check power-up collisions
    powerUps = powerUps.filter(powerUp => {
        if (
            rocket.x < powerUp.x + powerUp.width &&
            rocket.x + rocket.width > powerUp.x &&
            rocket.y < powerUp.y + powerUp.height &&
            rocket.y + rocket.height > powerUp.y
        ) {
            if (powerUp.type === 'fuel') {
                fuel = Math.min(fuel + 20, 100);
            } else {
                score += 100;
            }
            return false;
        }
        return true;
    });

    return false;
}

function createObstacle() {
    if (!gameRunning) return;

    const minHeight = 50;
    const maxHeight = 200;
    const height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    const y = Math.floor(Math.random() * (canvas.height - height));

    obstacles.push(new Obstacle(canvas.width, y, 30, height));
}

function createPowerUp() {
    if (!gameRunning) return;

    const y = Math.floor(Math.random() * (canvas.height - 20));
    powerUps.push(new PowerUp(canvas.width, y));
}

function startGame() {
    initGame();
    gameRunning = true;
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    lastTime = performance.now();
    requestAnimationFrame(updateGame);
    setInterval(createObstacle, obstacleInterval);
    setInterval(createPowerUp, 3000);
}

function endGame() {
    gameRunning = false;
    finalScoreDisplay.textContent = score;
    gameOverScreen.style.display = 'block';

    if (score > highScore) {
        highScore = score;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        localStorage.setItem('highScore', highScore);
    }
}

// Event listeners
document.addEventListener('keydown', (event) => {
    keys[event.key] = true;
});

document.addEventListener('keyup', (event) => {
    keys[event.key] = false;
});

restartButton.addEventListener('click', startGame);
startButton.addEventListener('click', startGame);

// Load high score from local storage
highScore = localStorage.getItem('highScore') || 0;
highScoreDisplay.textContent = `High Score: ${highScore}`;

// Show start screen
startScreen.style.display = 'block';