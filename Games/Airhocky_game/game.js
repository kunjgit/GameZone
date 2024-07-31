const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;
const PUCK_RADIUS = 15;
const MALLET_RADIUS = 30;
const FRICTION = 0.99;
const GOAL_WIDTH = 200;
const GOAL_HEIGHT = 40;
const MAX_SPEED = 10;

let puck = { x: WIDTH / 2, y: HEIGHT / 2, vx: 0, vy: 0 };
let mallet1 = { x: WIDTH / 4, y: HEIGHT / 2 };
let mallet2 = { x: 3 * WIDTH / 4, y: HEIGHT / 2 };
let playerScore = 0;
let computerScore = 0;

canvas.addEventListener('mousemove', (event) => {
    mallet1.x = event.offsetX;
    mallet1.y = event.offsetY;
    mallet1.x = Math.min(Math.max(mallet1.x, MALLET_RADIUS), WIDTH - MALLET_RADIUS);
    mallet1.y = Math.min(Math.max(mallet1.y, MALLET_RADIUS), HEIGHT - MALLET_RADIUS);
});

function drawCircle(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawRectangle(x, y, width, height, color) {
    ctx.beginPath();
    ctx.rect(x, y, width, height);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();
}

function drawLine(x1, y1, x2, y2, color) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = color;
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.closePath();
}

function updatePuck() {
    puck.x += puck.vx;
    puck.y += puck.vy;
    puck.vx *= FRICTION;
    puck.vy *= FRICTION;

    // Ensure speed does not exceed maximum
    let speed = Math.sqrt(puck.vx * puck.vx + puck.vy * puck.vy);
    if (speed > MAX_SPEED) {
        puck.vx *= MAX_SPEED / speed;
        puck.vy *= MAX_SPEED / speed;
    }

    // Ensure puck does not move out of the borders
    if (puck.x < PUCK_RADIUS) {
        puck.x = PUCK_RADIUS;
        puck.vx = -puck.vx;
    }
    if (puck.x > WIDTH - PUCK_RADIUS) {
        puck.x = WIDTH - PUCK_RADIUS;
        puck.vx = -puck.vx;
    }
    if (puck.y < PUCK_RADIUS) {
        puck.y = PUCK_RADIUS;
        puck.vy = -puck.vy;
    }
    if (puck.y > HEIGHT - PUCK_RADIUS) {
        puck.y = HEIGHT - PUCK_RADIUS;
        puck.vy = -puck.vy;
    }

    if (puck.x <= PUCK_RADIUS && (puck.y > HEIGHT / 2 - GOAL_WIDTH / 2 && puck.y < HEIGHT / 2 + GOAL_WIDTH / 2)) {
        computerScore++;
        resetPuck();
    }

    if (puck.x >= WIDTH - PUCK_RADIUS && (puck.y > HEIGHT / 2 - GOAL_WIDTH / 2 && puck.y < HEIGHT / 2 + GOAL_WIDTH / 2)) {
        playerScore++;
        resetPuck();
    }
}

function resetPuck() {
    puck.x = WIDTH / 2;
    puck.y = HEIGHT / 2;
    puck.vx = 0;
    puck.vy = 0;
}

function checkCollisionWithMallet(mallet) {
    let dx = puck.x - mallet.x;
    let dy = puck.y - mallet.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < PUCK_RADIUS + MALLET_RADIUS) {
        let angle = Math.atan2(dy, dx);
        puck.vx = Math.cos(angle) * 5;
        puck.vy = Math.sin(angle) * 5;

        // Move puck out of collision
        let overlap = PUCK_RADIUS + MALLET_RADIUS - distance;
        puck.x += Math.cos(angle) * overlap;
        puck.y += Math.sin(angle) * overlap;
    }
}

function updateComputerMallet() {
    let dx = puck.x - mallet2.x;
    let dy = puck.y - mallet2.y;

    // Simplified AI: Move towards the puck
    mallet2.x += dx * 0.05;
    mallet2.y += dy * 0.05;

    // Restrict to the table
    mallet2.x = Math.min(Math.max(mallet2.x, MALLET_RADIUS), WIDTH - MALLET_RADIUS);
    mallet2.y = Math.min(Math.max(mallet2.y, MALLET_RADIUS), HEIGHT - MALLET_RADIUS);
}

function draw() {
    ctx.clearRect(0, 0, WIDTH, HEIGHT);

    drawRectangle(0, HEIGHT / 2 - GOAL_WIDTH / 2, GOAL_HEIGHT, GOAL_WIDTH, '#00ff00');
    drawRectangle(WIDTH - GOAL_HEIGHT, HEIGHT / 2 - GOAL_WIDTH / 2, GOAL_HEIGHT, GOAL_WIDTH, '#00ff00');
    drawLine(WIDTH / 2, 0, WIDTH / 2, HEIGHT, '#ffffff');

    drawCircle(puck.x, puck.y, PUCK_RADIUS, '#ff0000');
    drawCircle(mallet1.x, mallet1.y, MALLET_RADIUS, '#00ff00');
    drawCircle(mallet2.x, mallet2.y, MALLET_RADIUS, '#0000ff');

    updatePuck();
    checkCollisionWithMallet(mallet1);
    checkCollisionWithMallet(mallet2);
    updateComputerMallet();

    ctx.font = "20px Arial";
    ctx.fillStyle = "#ffffff";
    ctx.fillText(`Player: ${playerScore}`, 20, 30);
    ctx.fillText(`Computer: ${computerScore}`, WIDTH - 150, 30);

    requestAnimationFrame(draw);
}

draw();
