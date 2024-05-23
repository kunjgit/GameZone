const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let score = 0;
let health = 3;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas(); // Initial resize

window.addEventListener('resize', resizeCanvas);

const doraemonImg = new Image();
const cakeImg = new Image();
const backgroundImg = new Image();
const obstacleImg = new Image();
const trapImg = new Image();

doraemonImg.src = 'doraemon.png';
cakeImg.src = 'cake.png';
backgroundImg.src = 'background.png';
obstacleImg.src = 'obstacle.png';
trapImg.src = 'trap.png';

let doraemon = {
    x: 50,
    y: 50,
    width: 80,
    height: 80,
    speed: 5,
    dx: 0,
    dy: 0
};

let cakes = [
    { x: 100, y: 100 },
    { x: 300, y: 150 },
    { x: 500, y: 200 }
];

let obstacles = [
    { x: 200, y: 200 },
    { x: 400, y: 250 },
    { x: 600, y: 300 }
];

let traps = [
    { x: 250, y: 250 },
    { x: 450, y: 300 },
    { x: 650, y: 350 }
];

function drawBackground() {
    ctx.drawImage(backgroundImg, 0, 0, canvas.width, canvas.height);
}

function drawDoraemon() {
    ctx.drawImage(doraemonImg, doraemon.x, doraemon.y, doraemon.width, doraemon.height);
}

function drawCakes() {
    cakes.forEach(cake => {
        ctx.drawImage(cakeImg, cake.x, cake.y, 40, 40);
    });
}

function drawObstacles() {
    obstacles.forEach(obstacle => {
        ctx.drawImage(obstacleImg, obstacle.x, obstacle.y, 40, 40);
    });
}

function drawTraps() {
    traps.forEach(trap => {
        ctx.drawImage(trapImg, trap.x, trap.y, 40, 40);
    });
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function update() {
    clear();
    drawBackground();
    drawDoraemon();
    drawCakes();
    drawObstacles();
    drawTraps();
    updatePosition();
    detectCollisions();
    requestAnimationFrame(update);
}

function updatePosition() {
    doraemon.x += doraemon.dx;
    doraemon.y += doraemon.dy;

    if (doraemon.x < 0 || doraemon.x + doraemon.width > canvas.width || doraemon.y < 0 || doraemon.y + doraemon.height > canvas.height) {
        health -= 1;
        document.getElementById('health').textContent = health;
        resetPosition();
        if (health === 0) {
            alert('Game Over!');
            resetGame();
        }
    }
}

function resetPosition() {
    doraemon.x = 50;
    doraemon.y = 50;
    doraemon.dx = 0;
    doraemon.dy = 0;
}

function resetGame() {
    score = 0;
    health = 3;
    document.getElementById('score').textContent = score;
    document.getElementById('health').textContent = health;
    resetPosition();
    cakes = [
        { x: 100, y: 100 },
        { x: 300, y: 150 },
        { x: 500, y: 200 }
    ];
    obstacles = [
        { x: 200, y: 200 },
        { x: 400, y: 250 },
        { x: 600, y: 300 }
    ];
    traps = [
        { x: 250, y: 250 },
        { x: 450, y: 300 },
        { x: 650, y: 350 }
    ];
}

function detectCollisions() {
    cakes.forEach((cake, index) => {
        if (doraemon.x < cake.x + 40 && doraemon.x + doraemon.width > cake.x &&
            doraemon.y < cake.y + 40 && doraemon.y + doraemon.height > cake.y) {
            cakes.splice(index, 1);
            score += 10;
            document.getElementById('score').textContent = score;
        }
    });

    obstacles.forEach(obstacle => {
        if (doraemon.x < obstacle.x + 40 && doraemon.x + doraemon.width > obstacle.x &&
            doraemon.y < obstacle.y + 40 && doraemon.y + doraemon.height > obstacle.y) {
            health -= 1;
            document.getElementById('health').textContent = health;
            resetPosition();
            if (health === 0) {
                alert('Game Over!');
                resetGame();
            }
        }
    });

    traps.forEach(trap => {
        if (doraemon.x < trap.x + 40 && doraemon.x + doraemon.width > trap.x &&
            doraemon.y < trap.y + 40 && doraemon.y + doraemon.height > trap.y) {
            health -= 1;
            document.getElementById('health').textContent = health;
            resetPosition();
            if (health === 0) {
                alert('Game Over!');
                resetGame();
            }
        }
    });
}

function moveRight() {
    doraemon.dx = doraemon.speed;
    doraemon.dy = 0;
}

function moveLeft() {
    doraemon.dx = -doraemon.speed;
    doraemon.dy = 0;
}

function moveUp() {
    doraemon.dx = 0;
    doraemon.dy = -doraemon.speed;
}

function moveDown() {
    doraemon.dx = 0;
    doraemon.dy = doraemon.speed;
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'Right') {
        moveRight();
    } else if (e.key === 'ArrowLeft' || e.key === 'Left') {
        moveLeft();
    } else if (e.key === 'ArrowUp' || e.key === 'Up') {
        moveUp();
    } else if (e.key === 'ArrowDown' || e.key === 'Down') {
        moveDown();
    }
}

function keyUp(e) {
    if (
        e.key === 'ArrowRight' || e.key === 'Right' ||
        e.key === 'ArrowLeft' || e.key === 'Left' ||
        e.key === 'ArrowUp' || e.key === 'Up' ||
        e.key === 'ArrowDown' || e.key === 'Down'
    ) {
        doraemon.dx = 0;
        doraemon.dy = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

backgroundImg.onload = update; // Ensure the game starts only after the background image is loaded.
