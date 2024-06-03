const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;


const gridSize = 20;
const mazeSize = canvas.width / gridSize;
const player = {
    x: 0,
    y: 0,
    color: 'yellow'
};


const quantumWalls = [];
const entangledPaths = [];


for (let i = 0; i < mazeSize; i++) {
    quantumWalls[i] = [];
    for (let j = 0; j < mazeSize; j++) {
        quantumWalls[i][j] = Math.random() > 0.7 ? 'wall' : 'empty';
    }
}


function drawMaze() {
    for (let i = 0; i < mazeSize; i++) {
        for (let j = 0; j < mazeSize; j++) {
            if (quantumWalls[i][j] === 'wall') {
                ctx.fillStyle = 'grey';
                ctx.fillRect(i * gridSize, j * gridSize, gridSize, gridSize);
            }
        }
    }
}


function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x * gridSize, player.y * gridSize, gridSize, gridSize);
}


function movePlayer(x, y) {
    if (x >= 0 && x < mazeSize && y >= 0 && y < mazeSize) {
        if (quantumWalls[x][y] !== 'wall') {
            player.x = x;
            player.y = y;
            collapseWalls(x, y);
        }
    }
}


function collapseWalls(x, y) {
    if (Math.random() > 0.5) {
        quantumWalls[x][y] = 'empty';
    } else {
        quantumWalls[x][y] = 'wall';
    }
}


document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowUp') movePlayer(player.x, player.y - 1);
    if (event.key === 'ArrowDown') movePlayer(player.x, player.y + 1);
    if (event.key === 'ArrowLeft') movePlayer(player.x - 1, player.y);
    if (event.key === 'ArrowRight') movePlayer(player.x + 1, player.y);
    updateGame();
});


function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawMaze();
    drawPlayer();
}


updateGame();



