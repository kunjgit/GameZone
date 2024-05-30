const rows = 5; // Number of rows in the game
let score = 0; // Initial score
let currentRow = 0; // Current row the player is on
let tileSelectedInCurrentRow = false; // Flag to track if a tile has been selected in the current row
const homeButton = document.getElementById("home-button");//home button
const scoreCon = document.querySelector(".score-con");//home button

function startGame() {
    // Get selected level
    const level = document.querySelector('input[name="level"]:checked').value;
    let levelContainer = document.querySelector('.level-container');
    levelContainer.classList.add('hide');
    homeButton.classList.add('saw');
    scoreCon.classList.add('saw')

    // Set the number of columns and items based on the level
    let columns, items;
    if (level === 'easy') {
        columns = 4;
        items = ['egg', 'egg', 'egg', 'bomb'];
    } else if (level === 'medium') {
        columns = 3;
        items = ['egg', 'egg', 'bomb'];
    } else if (level === 'hard') {
        columns = 2;
        items = ['egg', 'bomb'];
    }

    // Reset the game state
    score = 0;
    currentRow = 0;
    tileSelectedInCurrentRow = false; // Reset the flag
    document.getElementById('score').textContent = score;
    document.getElementById('message').textContent = '';
    const tower = document.getElementById('dragon-tower');
    tower.innerHTML = ''; // Clear previous game


    // Generate rows with hidden tiles
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('div');
        row.className = 'row';

        // Shuffle the items and place them in the row
        shuffleArray(items);
        for (let j = 0; j < columns; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile hidden';
            tile.dataset.type = items[j % items.length]; // Cycle through items
            tile.dataset.row = i; // Store row index in the tile dataset
            tile.addEventListener('click', () => handleTileClick(tile));
            row.appendChild(tile);
        }

        tower.appendChild(row);
    }
    // Add starting and ending points first
    addStartingEndingPoints();
}

function shuffleArray(array) {
    // Shuffle the array items
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function handleTileClick(tile) {
    // Debugging: Log the tile to verify it's correctly identified
    console.log("Tile clicked", tile);

    // Check if the tile is in the current row, is hidden, and no tile has been selected in the current row
    if (tile.classList.contains('hidden') && parseInt(tile.dataset.row) === currentRow && !tileSelectedInCurrentRow) {
        console.log('Inside if');
        tile.classList.remove('hidden'); // Reveal the tile
        tile.classList.add('revealed'); // Add revealed class

        tileSelectedInCurrentRow = true; // Set the flag to true

        if (tile.dataset.type === 'egg') {
            // If the tile is an egg
            score++; // Increase score
            document.getElementById('score').textContent = score;
            tile.classList.add('collected'); // Mark the tile as collected
            tile.removeEventListener('click', handleTileClick); // Remove click event listener
            currentRow++; // Move to the next row
            tileSelectedInCurrentRow = false; // Reset the flag for the next row
            if (currentRow >= rows) {
                setTimeout(() => {
                    document.getElementById('message').textContent = 'You Won!'; // Display winning message
                    alert("You won !!! Do you want to play one more match?");
                    startGame();
                }, 300);
            }
        } else if (tile.dataset.type === 'bomb') {
            // If the tile is a bomb
            setTimeout(() => {
                alert('Game Over!'); // Alert game over
                startGame(); // Restart the game
            }, 300); // Small delay to ensure the tile is revealed
        }
    } else if (parseInt(tile.dataset.row) !== currentRow) {
        alert('You must start from the starting point and can only select one tile per row!');
    }
}

function addStartingEndingPoints() {
    // Add the starting point
    const tower = document.getElementById('dragon-tower');
    const startingRow = document.createElement('div');
    startingRow.className = 'row';
    const startingTile = document.createElement('div');
    startingTile.className = 'tile starting';
    startingTile.textContent = 'Start';
    startingRow.appendChild(startingTile);
    tower.insertBefore(startingRow, tower.firstChild);

    // Add the ending point
    const endingRow = document.createElement('div');
    endingRow.className = 'row';
    const endingTile = document.createElement('div');
    endingTile.className = 'tile ending';
    endingTile.textContent = 'End';
    endingRow.appendChild(endingTile);
    tower.appendChild(endingRow);
}

// function for home button
homeButton.addEventListener('click', () => {
    location.reload();
})
