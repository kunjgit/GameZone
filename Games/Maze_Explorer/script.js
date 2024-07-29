document.getElementById('start-button').addEventListener('click', startGame);

let maze, playerPosition, exitPosition, timer, score;

function startGame() {
    maze = generateMaze(20, 15);
    playerPosition = { x: 0, y: 0 };
    exitPosition = { x: 19, y: 14 };
    timer = 60;
    score = 0;

    updateMaze();
    startTimer();
}

function generateMaze(width, height) {
    let maze = Array.from({ length: height }, () => Array(width).fill(0));
    const stack = [];
    const directions = [
        { x: 1, y: 0 },
        { x: -1, y: 0 },
        { x: 0, y: 1 },
        { x: 0, y: -1 }
    ];

    function isInsideMaze(x, y) {
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    function carve(x, y) {
        maze[y][x] = 1;
        stack.push({ x, y });

        while (stack.length > 0) {
            const { x, y } = stack.pop();
            const shuffledDirections = directions.sort(() => Math.random() - 0.5);

            for (const { x: dx, y: dy } of shuffledDirections) {
                const nx = x + dx * 2;
                const ny = y + dy * 2;

                if (isInsideMaze(nx, ny) && maze[ny][nx] === 0) {
                    maze[ny - dy][nx - dx] = 1;
                    maze[ny][nx] = 1;
                    stack.push({ x: nx, y: ny });
                }
            }
        }
    }

    carve(0, 0);

    // Add obstacles, collectibles, and power-ups
    addSpecialItems(maze, width, height);

    return maze;
}

function addSpecialItems(maze, width, height) {
    for (let i = 0; i < 10; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
        } while (maze[y][x] !== 1 || (x === 0 && y === 0) || (x === 19 && y === 14));

        maze[y][x] = 2; // 2 represents an obstacle
    }

    for (let i = 0; i < 5; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
        } while (maze[y][x] !== 1);

        maze[y][x] = 3; // 3 represents a collectible
    }

    for (let i = 0; i < 3; i++) {
        let x, y;
        do {
            x = Math.floor(Math.random() * width);
            y = Math.floor(Math.random() * height);
        } while (maze[y][x] !== 1);

        maze[y][x] = 4; // 4 represents a power-up
    }
}

function updateMaze() {
    const mazeContainer = document.getElementById('maze');
    mazeContainer.innerHTML = '';

    for (let y = 0; y < maze.length; y++) {
        for (let x = 0; x < maze[y].length; x++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (x === playerPosition.x && y === playerPosition.y) {
                cell.classList.add('player');
            } else if (x === exitPosition.x && y === exitPosition.y) {
                cell.classList.add('exit');
            } else {
                switch (maze[y][x]) {
                    case 0:
                        cell.classList.add('wall');
                        break;
                    case 1:
                        cell.classList.add('path');
                        break;
                    case 2:
                        cell.classList.add('obstacle');
                        break;
                    case 3:
                        cell.classList.add('collectible');
                        break;
                    case 4:
                        cell.classList.add('power-up');
                        break;
                }
            }

            mazeContainer.appendChild(cell);
        }
    }
}

function startTimer() {
    const timerElement = document.getElementById('time');
    const scoreElement = document.getElementById('score');
    timerElement.textContent = timer;
    scoreElement.textContent = score;

    const interval = setInterval(() => {
        if (timer > 0) {
            timer--;
            timerElement.textContent = timer;
        } else {
            clearInterval(interval);
            alert('Game Over! Your score: ' + score);
        }
    }, 1000);
}

document.addEventListener('keydown', (e) => {
    const { x, y } = playerPosition;
    let newX = x, newY = y;

    if (e.key === 'ArrowUp') newY--;
    else if (e.key === 'ArrowDown') newY++;
    else if (e.key === 'ArrowLeft') newX--;
    else if (e.key === 'ArrowRight') newX++;

    if (newX >= 0 && newX < maze[0].length && newY >= 0 && newY < maze.length) {
        switch (maze[newY][newX]) {
            case 1: // Path
            case 3: // Collectible
            case 4: // Power-up
                playerPosition = { x: newX, y: newY };
                break;
            case 2: // Obstacle
                score -= 20;
                document.getElementById('score').textContent = score;
                break;
        }

        updateMaze();

        if (newX === exitPosition.x && newY === exitPosition.y) {
            score += 100;
            document.getElementById('score').textContent = score;
            alert('You win! Your score: ' + score);
        } else if (maze[newY][newX] === 3) {
            score += 10;
            document.getElementById('score').textContent = score;
            maze[newY][newX] = 1; // Remove collectible
        } else if (maze[newY][newX] === 4) {
            score += 50;
            document.getElementById('score').textContent = score;
            maze[newY][newX] = 1; // Remove power-up
        }
    }
});
