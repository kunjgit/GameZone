document.addEventListener('DOMContentLoaded', () => {
    const puzzleContainer = document.getElementById('puzzle-container');
    const shuffleButton = document.getElementById('shuffle-button');
    const resetButton = document.getElementById('reset-button');
    const timerElement = document.getElementById('timer');
    
    let tiles = [...Array(9).keys()];
    let emptyIndex = 8;
    let timer;
    let startTime;

    function createTiles() {
        puzzleContainer.innerHTML = '';
        tiles.forEach((tile, index) => {
            const tileElement = document.createElement('div');
            tileElement.className = 'tile';
            if (tile === 8) {
                tileElement.classList.add('empty');
            } else {
                tileElement.textContent = tile + 1;
                tileElement.addEventListener('click', () => moveTile(index));
            }
            puzzleContainer.appendChild(tileElement);
        });
    }

    function moveTile(index) {
        if (canMove(index)) {
            [tiles[emptyIndex], tiles[index]] = [tiles[index], tiles[emptyIndex]];
            emptyIndex = index;
            createTiles();
            if (isSolved()) {
                clearInterval(timer);
                alert(`Congratulations, you solved the puzzle in ${Math.floor((Date.now() - startTime) / 1000)} seconds!`);
            }
        }
    }

    function canMove(index) {
        const emptyRow = Math.floor(emptyIndex / 3);
        const emptyCol = emptyIndex % 3;
        const row = Math.floor(index / 3);
        const col = index % 3;
        return (emptyRow === row && Math.abs(emptyCol - col) === 1) || (emptyCol === col && Math.abs(emptyRow - row) === 1);
    }

    function shuffleTiles() {
        do {
            for (let i = tiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [tiles[i], tiles[j]] = [tiles[j], tiles[i]];
            }
        } while (isSolved());
        emptyIndex = tiles.indexOf(8);
        createTiles();
        startTimer();
    }

    function resetTiles() {
        tiles = [...Array(9).keys()];
        emptyIndex = 8;
        createTiles();
        resetTimer();
    }

    function isSolved() {
        return tiles.every((tile, index) => tile === index);
    }

    function startTimer() {
        resetTimer();
        startTime = Date.now();
        timer = setInterval(() => {
           
            const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
            timerElement.textContent = `Time: ${elapsedTime}s`;
        }, 1000);
    }

    function resetTimer() {
        clearInterval(timer);
        timerElement.textContent = 'Time: 0s';
    }

    shuffleButton.addEventListener('click', shuffleTiles);
    resetButton.addEventListener('click', resetTiles);

    createTiles();
});
