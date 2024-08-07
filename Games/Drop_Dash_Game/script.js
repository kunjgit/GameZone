const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');
const gameOverElement = document.getElementById('gameOver');
const finalScoreElement = document.getElementById('finalScore');
const continueBtn = document.getElementById('continueBtn');

canvas.width = 400;
canvas.height = 600;

let cloud = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 80,
    height: 50,
    speed: 10
};

let drops = [];
let score = 0;
let lives = 6;
let gameLoop;

function drawCloud() {
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(cloud.x, cloud.y, 25, 0, Math.PI * 2);
    ctx.arc(cloud.x - 25, cloud.y, 20, 0, Math.PI * 2);
    ctx.arc(cloud.x + 25, cloud.y, 20, 0, Math.PI * 2);
    ctx.fill();
}

function drawDrop(drop) {
    ctx.fillStyle = '#00f';
    ctx.beginPath();
    ctx.arc(drop.x, drop.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function createDrop() {
    return {
        x: Math.random() * canvas.width,
        y: 0,
        speed: Math.random() * 1 + .5
    };
}

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawCloud();

    if (Math.random() < 0.01) {
        drops.push(createDrop());
    }

    drops.forEach((drop, index) => {
        drop.y += drop.speed;
        drawDrop(drop);

        if (drop.y > canvas.height) {
            drops.splice(index, 1);
            lives--;
            updateLives();
            if (lives === 0) {
                gameOver();
            }
        }

        if (
            drop.x > cloud.x - cloud.width / 2 &&
            drop.x < cloud.x + cloud.width / 2 &&
            drop.y > cloud.y - cloud.height / 2 &&
            drop.y < cloud.y + cloud.height / 2
        ) {
            drops.splice(index, 1);
            score++;
            updateScore();
        }
    });

    if (score >= 10) {
        gameOver();
    }

    gameLoop = requestAnimationFrame(update);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateLives() {
    livesElement.textContent = `Lives: ${lives}`;
}

function gameOver() {
    cancelAnimationFrame(gameLoop);
    gameOverElement.classList.remove('hidden');
    finalScoreElement.textContent = score;
}

function resetGame() {
    score = 0;
    lives = 5;
    drops = [];
    updateScore();
    updateLives();
    gameOverElement.classList.add('hidden');
    update();
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && cloud.x > cloud.width / 2) {
        cloud.x -= cloud.speed;
    } else if (e.key === 'ArrowRight' && cloud.x < canvas.width - cloud.width / 2) {
        cloud.x += cloud.speed;
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const touchX = touch.clientX - rect.left;

    if (touchX < canvas.width / 2) {
        cloud.x -= cloud.speed;
    } else {
        cloud.x += cloud.speed;
    }
});

continueBtn.addEventListener('click', resetGame);

resetGame();