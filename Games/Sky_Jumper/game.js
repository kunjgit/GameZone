const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const playerWidth = 50;
const playerHeight = 50;
const platformWidth = 150;
const platformHeight = 20;
let playerX = canvas.width / 2 - playerWidth / 2;
let playerY = canvas.height - playerHeight - 100;
let playerSpeedX = 0;
let playerSpeedY = 0;
const gravity = 0.5;
const jumpPower = -10;
const moveSpeed = 5;

// Platforms
const platforms = [
    { x: 100, y: canvas.height - 50, width: platformWidth, height: platformHeight },
    { x: 300, y: canvas.height - 150, width: platformWidth, height: platformHeight },
    { x: 500, y: canvas.height - 250, width: platformWidth, height: platformHeight }
];

// Input
const keys = {};

// Event listeners
window.addEventListener('keydown', (e) => keys[e.code] = true);
window.addEventListener('keyup', (e) => keys[e.code] = false);

function update() {
    // Player movement
    if (keys['ArrowLeft']) playerSpeedX = -moveSpeed;
    else if (keys['ArrowRight']) playerSpeedX = moveSpeed;
    else playerSpeedX = 0;

    if (keys['Space'] && onGround()) {
        playerSpeedY = jumpPower;
    }

    playerSpeedY += gravity;
    playerX += playerSpeedX;
    playerY += playerSpeedY;

    // Collision detection
    if (playerY + playerHeight > canvas.height) {
        playerY = canvas.height - playerHeight;
        playerSpeedY = 0;
    }

    platforms.forEach(platform => {
        if (playerX < platform.x + platform.width &&
            playerX + playerWidth > platform.x &&
            playerY + playerHeight > platform.y &&
            playerY + playerHeight < platform.y + platform.height &&
            playerSpeedY > 0) {
            playerY = platform.y - playerHeight;
            playerSpeedY = 0;
        }
    });

    // Draw everything
    draw();
    requestAnimationFrame(update);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'red';
    ctx.fillRect(playerX, playerY, playerWidth, playerHeight);

    // Draw platforms
    ctx.fillStyle = 'green';
    platforms.forEach(platform => {
        ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    });
}

function onGround() {
    return playerY + playerHeight >= canvas.height;
}

update();
