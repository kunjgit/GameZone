// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');
canvas.width = 800;
canvas.height = 600;

let score = 0;
let balls = [];
let targets = [];
const ballRadius = 5;
const targetRadius = 20;
const ballSpeed = 5;

// Function to create a new ball
function createBall(x, y) {
    balls.push({ x, y, dx: ballSpeed, dy: ballSpeed });
}

// Function to create targets at random positions
function createTarget() {
    const x = Math.random() * (canvas.width - 2 * targetRadius) + targetRadius;
    const y = Math.random() * (canvas.height - 2 * targetRadius) + targetRadius;
    targets.push({ x, y });
}

// Function to update the positions of balls
function updateBalls() {
    balls.forEach((ball, index) => {
        ball.x += ball.dx;
        ball.y += ball.dy;

        // Check for collisions with walls
        if (ball.x + ballRadius > canvas.width || ball.x - ballRadius < 0) {
            ball.dx = -ball.dx;
        }
        if (ball.y + ballRadius > canvas.height || ball.y - ballRadius < 0) {
            ball.dy = -ball.dy;
        }

        // Check for collisions with targets
        targets.forEach((target, targetIndex) => {
            const dist = Math.hypot(ball.x - target.x, ball.y - target.y);
            if (dist < ballRadius + targetRadius) {
                targets.splice(targetIndex, 1);
                balls.splice(index, 1);
                score += 10;
                scoreElement.innerText = `Score: ${score}`;
                createTarget();
            }
        });
    });
}

// Function to draw the balls
function drawBalls() {
    balls.forEach(ball => {
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#00f';
        ctx.fill();
        ctx.closePath();
    });
}

// Function to draw the targets
function drawTargets() {
    targets.forEach(target => {
        ctx.beginPath();
        ctx.arc(target.x, target.y, targetRadius, 0, Math.PI * 2);
        ctx.fillStyle = '#f00';
        ctx.fill();
        ctx.closePath();
    });
}

// Function to draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBalls();
    drawTargets();
}

// Main game loop
function gameLoop() {
    updateBalls();
    draw();
    requestAnimationFrame(gameLoop);
}

// Event listener to shoot balls
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createBall(x, y);
});

// Initialize the game
createTarget();
gameLoop();
