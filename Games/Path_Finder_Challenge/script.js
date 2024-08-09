//script.js
document.addEventListener('DOMContentLoaded', () => {
    let score = 0;
    let time = 60;
    let timer;
    let gameRunning = false;
    const gridSize = 8; // 8x8 grid
    let sourceIndex, destinationIndex;
    let selectedPath = []; // Track the selected tiles

    const gridContainer = document.querySelector('.grid-container');
    const scoreElement = document.getElementById('score');
    const timerElement = document.getElementById('timer');
    const gameOverScreen = document.querySelector('.game-over');
    const finalScoreElement = document.getElementById('final-score');
    const startGameButton = document.getElementById('start-game');
    const restartGameButton = document.getElementById('restart-game');

    if (!startGameButton || !restartGameButton) {
        console.error('One or more of the required elements were not found.');
        return;
    }

    // Apply dark theme
    document.body.classList.add('dark-theme');

    function startGame() {
        gameRunning = true;
        time = 60;
        score = 0;
        selectedPath = []; // Reset the selected path
        scoreElement.textContent = `Score: ${score}`;
        timerElement.textContent = `Time: ${time}s`;
        gameOverScreen.classList.add('hidden');
        gridContainer.innerHTML = ''; // Clear existing grid
        createGrid();
        startTimer();
    }

    function createGrid() {
        for (let i = 0; i < gridSize * gridSize; i++) {
            const tile = document.createElement('div');
            tile.className = 'grid-item';
            tile.dataset.index = i;
            tile.addEventListener('click', handleTileClick);
            gridContainer.appendChild(tile);

            // Randomly assign tiles
            const rand = Math.random();
            if (rand < 0.15) {
                tile.classList.add('obstacle');
            } else if (rand < 0.2) {
                tile.classList.add('bonus');
            } else if (rand < 0.5) {
                tile.classList.add('special');
            } else {
                tile.classList.add('normal');
            }
        }

        // Set fixed source and destination indices
        sourceIndex = 0; // Top-left corner
        destinationIndex = gridSize * gridSize - 1; // Bottom-right corner
        gridContainer.children[sourceIndex].classList.add('source');
        gridContainer.children[destinationIndex].classList.add('destination');
    }

    function handleTileClick(event) {
        if (!gameRunning) return;

        const tile = event.target;
        const tileIndex = parseInt(tile.dataset.index);

        if (selectedPath.includes(tileIndex)) return;

        tile.classList.add('selected');
        selectedPath.push(tileIndex);

        if (tileIndex === destinationIndex) {
            score += 100;
            tile.classList.add('active');
            setTimeout(() => tile.classList.remove('active'), 300);
            setTimeout(startGame, 500); // Restart the game after reaching destination
        } else if (tile.classList.contains('obstacle')) {
            score -= 10;
            tile.classList.add('obstacle'); // Ensure obstacle styling is applied
        } else {
            score += 10;
        }

        scoreElement.textContent = `Score: ${score}`;

        if (!hasValidPath()) {
            endGame();
        }
    }

    function hasValidPath() {
        // Implement BFS or DFS to check if there's still a valid path
        const queue = [sourceIndex];
        const visited = new Set();
        visited.add(sourceIndex);

        while (queue.length > 0) {
            const index = queue.shift();

            if (index === destinationIndex) return true;

            const directions = [-1, 1, -gridSize, gridSize];

            for (const direction of directions) {
                const newIndex = index + direction;

                if (
                    newIndex >= 0 &&
                    newIndex < gridSize * gridSize &&
                    !visited.has(newIndex) &&
                    !gridContainer.children[newIndex].classList.contains('obstacle')
                ) {
                    visited.add(newIndex);
                    queue.push(newIndex);
                }
            }
        }

        return false;
    }

    function startTimer() {
        timer = setInterval(() => {
            time--;
            timerElement.textContent = `Time: ${time}s`;
            if (time <= 0) {
                endGame();
            }
        }, 1000);
    }

    function endGame() {
        clearInterval(timer);
        gameRunning = false;
        finalScoreElement.textContent = score;
        gameOverScreen.classList.remove('hidden');
    }

    startGameButton.addEventListener('click', startGame);
    restartGameButton.addEventListener('click', startGame);
});