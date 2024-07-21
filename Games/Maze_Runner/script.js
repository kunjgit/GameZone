const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const canvasWidth = 800;
const canvasHeight = 600;
canvas.width = canvasWidth;
canvas.height = canvasHeight;

const cellSize = 40;
let level = 1;
let mazeWidth = Math.floor(canvasWidth / cellSize);
let mazeHeight = Math.floor(canvasHeight / cellSize);

const player = {
    x: 0,
    y: 0,
    size: cellSize / 2,
    color: 'red',
    speed: 5
};

const goal = {
    x: mazeWidth - 1,
    y: mazeHeight - 1,
    size: cellSize / 2,
    color: 'green'
};

let maze = generateMaze(mazeWidth, mazeHeight);
let timeLeft = 60;
let timerInterval;

function generateMaze(width, height) {
    const maze = new Array(height).fill(null).map(() => new Array(width).fill(1));

    function carvePassagesFrom(cx, cy, maze) {
        const directions = shuffle([
            [0, -1], // Up
            [1, 0], // Right
            [0, 1], // Down
            [-1, 0] // Left
        ]);

        directions.forEach(([dx, dy]) => {
            const nx = cx + dx * 2;
            const ny = cy + dy * 2;

            if (nx >= 0 && ny >= 0 && nx < width && ny < height && maze[ny][nx] === 1) {
                maze[cy + dy][cx + dx] = 0;
                maze[ny][nx] = 0;
                carvePassagesFrom(nx, ny, maze);
            }
        });
    }

    maze[0][0] = 0;
    carvePassagesFrom(0, 0, maze);
    maze[height - 1][width - 1] = 0;

    return maze;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function drawMaze(maze) {
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    for (let y = 0; y < mazeHeight; y++) {
        for (let x = 0; x < mazeWidth; x++) {
            if (maze[y][x] === 1) {
                ctx.fillStyle = 'black';
                ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
            }
        }
    }
}

function drawPlayer(player) {
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.arc(
        player.x * cellSize + player.size,
        player.y * cellSize + player.size,
        player.size,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function drawGoal(goal) {
    ctx.fillStyle = goal.color;
    ctx.beginPath();
    ctx.arc(
        goal.x * cellSize + goal.size,
        goal.y * cellSize + goal.size,
        goal.size,
        0,
        Math.PI * 2
    );
    ctx.fill();
}

function isCollision(x, y) {
    return maze[y][x] === 1;
}

function movePlayer(dx, dy) {
    const newX = player.x + dx;
    const newY = player.y + dy;
    if (newX >= 0 && newX < mazeWidth && newY >= 0 && newY < mazeHeight && !isCollision(newX, newY)) {
        player.x = newX;
        player.y = newY;
        checkWin();
    }
}

function checkWin() {
    if (player.x === goal.x && player.y === goal.y) {
        clearInterval(timerInterval);
        // Display win message
        ctx.fillStyle = 'black';
        ctx.font = '30px Arial';
        ctx.fillText('You Won!', canvasWidth / 2 - 50, canvasHeight / 2);
        
        setTimeout(() => {
            nextLevel();
        }, 3000); // 3 seconds delay before moving to the next level
    }
}

function nextLevel() {
    level++;
    mazeWidth = Math.floor(canvasWidth / cellSize) + level;
    mazeHeight = Math.floor(canvasHeight / cellSize) + level;
    player.x = 0;
    player.y = 0;
    goal.x = mazeWidth - 1;
    goal.y = mazeHeight - 1;
    maze = generateMaze(mazeWidth, mazeHeight);
    timeLeft = 30; // Reset timer for the new level
    startTimer();
    draw();
}



document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            movePlayer(0, -1);
            break;
        case 'ArrowDown':
            movePlayer(0, 1);
            break;
        case 'ArrowLeft':
            movePlayer(-1, 0);
            break;
        case 'ArrowRight':
            movePlayer(1, 0);
            break;
    }
    draw();
});

function draw() {
    drawMaze(maze);
    drawPlayer(player);
    drawGoal(goal);
}


function startTimer() {
    const timerDisplay = document.getElementById('time');
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
        } else {
            clearInterval(timerInterval);
            alert('Game Over! Time ran out.');
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    level = 1;
    mazeWidth = Math.floor(canvasWidth / cellSize);
    mazeHeight = Math.floor(canvasHeight / cellSize);
    player.x = 0;
    player.y = 0;
    goal.x = mazeWidth - 1;
    goal.y = mazeHeight - 1;
    maze = generateMaze(mazeWidth, mazeHeight);
    timeLeft = 60;
    startTimer();
    draw();
}

startTimer();
draw();