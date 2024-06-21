document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');
    const newGameButton = document.getElementById('new-game');
    const scoreDisplay = document.getElementById('score');
    let score = 0;

    function startNewGame() {
        const tiles = [...Array(15).keys()].map(i => i + 1);
        tiles.push(null); // Add empty space
        shuffle(tiles);

        // Clear the grid
        grid.innerHTML = '';

        // Create grid
        tiles.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.classList.add('tile');
            if (tile === null) {
                tileElement.classList.add('empty');
            } else {
                tileElement.textContent = tile;
            }
            grid.appendChild(tileElement);
        });

        // Reset score
        score = 0;
        updateScore();
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function isAdjacent(index1, index2) {
        const x1 = index1 % 4, y1 = Math.floor(index1 / 4);
        const x2 = index2 % 4, y2 = Math.floor(index2 / 4);
        return (Math.abs(x1 - x2) + Math.abs(y1 - y2)) === 1;
    }

    function swapTiles(grid, index1, index2) {
        const tiles = [...grid.children];
        grid.insertBefore(tiles[index1], tiles[index2]);
        grid.insertBefore(tiles[index2], tiles[index1]);
        score++;
        updateScore();
    }

    function updateScore() {
        scoreDisplay.textContent = `Score: ${score}`;
    }

    function isSolved(tiles) {
        for (let i = 0; i < 15; i++) {
            if (parseInt(tiles[i].textContent) !== i + 1) {
                return false;
            }
        }
        return true;
    }

    grid.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tile')) return;
        const emptyTile = document.querySelector('.tile.empty');
        const emptyIndex = [...grid.children].indexOf(emptyTile);
        const tileIndex = [...grid.children].indexOf(e.target);

        if (isAdjacent(tileIndex, emptyIndex)) {
            // Swap tiles
            swapTiles(grid, tileIndex, emptyIndex);
            // Check for win
            if (isSolved([...grid.children])) {
                alert('Congratulations, you solved the puzzle!');
            }
        }
    });

    newGameButton.addEventListener('click', startNewGame);

    // Start a new game on initial load
    startNewGame();
});
