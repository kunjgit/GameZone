// Get the grid, across and down divs, buttons div, and score div
const grid = document.getElementById('crossword-grid');
const acrossDiv = document.getElementById('crossword-hints-across');
const downDiv = document.getElementById('crossword-hints-down');
const buttonsDiv = document.getElementById('crossword-buttons');
const scoreDiv = document.getElementById('crossword-score');
const outcomeDiv = document.getElementById('crossword-outcome');

// Adding sounds
const bgMusic = new Audio('./sounds/bgMusic.mp3');
const backSpace = new Audio('./sounds/backspace.mp3');
const rightAnswer = new Audio('./sounds/correct.mp3');
const wrongAnswer = new Audio('./sounds/wrong.mp3');
const win = new Audio('./sounds/win.mp3');
const gameOver = new Audio('./sounds/game over.wav');
const keyPress = new Audio('./sounds/keyPress.mp3');

document.addEventListener('click', ()=> {
    bgMusic.play();
});

// Set size of grid, number of words to place in the grid, and the words to place
const gridSize = 12;
const wordsToPlace = 6;
const wordsDict = {
    'recycling': 'Reusing waste materials to create new products',
    'sustainable': 'Eco-friendly practices for long-term resource use',
    'renewable': 'Energy source that can be replenished naturally',
    'ecosystem': 'Community of living organisms and their environment',
    'conservation': 'Protection and preservation of natural resources',
    'organic': 'Pertaining to farming without synthetic chemicals',
    'pollution': 'Contamination of air, water, or soil by harmful substances',
    'vegan': 'Person who abstains from animal products in diet',
    'vegetarian': 'Person who excludes meat from their diet',
    'reusable': 'Able to be used multiple times, reducing waste',
    'compost': 'Organic matter decomposed for use as fertilizer',
    'solar': 'Relating to energy derived from the sun\'s rays',
    'carpooling': 'Shared vehicle rides to decrease fuel use and emissions',
    'deforestation': 'Clearing of forests for agriculture or development',
    'afforestation': 'Planting trees to create new forests or woodlands',
    'biofuel': 'Renewable energy derived from organic materials, like plants',
    'endangered': 'Species at risk of extinction due to habitat loss or other factors'
};

let usableWords = [];
let placedWords = [];
let currentOrientation;
let userWon = false;

// Create a 2d array of size gridSize x gridSize to store the value of each cell
const gridValues = new Array(gridSize);
for (let i = 0; i < gridSize; i++) {
    gridValues[i] = new Array(gridSize);
}

// Dictionary storing each orientation and how many times it has been used
let orientations = {
    across: 0,
    down: 0,
};

// Call functions to create and generate the crossword grid
createGrid();
generateGrid();

// Creates a grid by populating an HTML table with gridSize x gridSize cells.
function createGrid() {
    // Iterate through the number of rows based on gridSize
    for (let i = 0; i < gridSize; i++) {
        // Create a new table row element
        const row = document.createElement('tr');

        // Iterate through the number of columns based on gridSize
        for (let j = 0; j < gridSize; j++) {
            // Create a new table cell element
            const cell = document.createElement('td');

            // Append the cell to the current row
            row.appendChild(cell);
        }

        // Append the row to the grid (table) element
        grid.appendChild(row);
    }
}

/**
 * Filters, selects, and sorts an array of words based on the grid size 
 * and the number of words to place.
 * The function also converts the selected words to lowercase.
 *
 * @param {string[]} words - An array of words to process.
 * @return {string[]} An array of selected and sorted words.
 */
function sortWords(words) {
    // Remove any words longer than the grid size
    const sortedWords = words.filter((word) => word.length <= gridSize);

    // Initialize an array to store the words to keep
    let wordsToKeep = [];

    // Select random words from the sortedWords array
    for (let i = 0; i < wordsToPlace; i++) {
        const randomIndex = getRandomInt(sortedWords.length);
        wordsToKeep.push(sortedWords[randomIndex]);
        sortedWords.splice(randomIndex, 1);
    }

    // Sort the words by length, longest first
    wordsToKeep.sort((a, b) => b.length - a.length);

    // Convert the words to lowercase
    wordsToKeep = wordsToKeep.map((word) => word.toLowerCase());

    // Return the processed words
    return wordsToKeep;
}

/**
 * Gets a random integer between 0 (inclusive) and max (exclusive).
 * @param {number} max - The upper bound for the random number (exclusive).
 * @return {number} A random integer between 0 (inclusive) and max (exclusive).
 */
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

/**
 * Places the first word of the usableWords array horizontally in the middle of the grid.
 * Updates the gridValues, placedWords, and orientations objects accordingly.
 */
function placeFirstWord() {
    // Get the first word from the usableWords array
    const word = usableWords[0];
    const wordLength = word.length;

    // Calculate the middle of the grid and the starting X position for the word
    const middleOfGrid = Math.floor(gridSize / 2);
    const startX = middleOfGrid - Math.floor(wordLength / 2);

    // Place the word horizontally in the middle of the grid
    for (let j = 0; j < wordLength; j++) {
        gridValues[middleOfGrid][startX + j] = word[j];
    }

    // Store the word, its coordinates, and its orientation in the placedWords array
    placedWords.push({
        word: word,
        start: { y: middleOfGrid, x: startX },
        end: { y: middleOfGrid, x: startX + wordLength - 1 },
        orientation: 'across',
    });

    // Increment the number of times the 'across' orientation has been used
    orientations.across++;
}


/**
 * Attempts to place the remaining words from the usableWords array in the grid.
 * If a word cannot be placed, it's added to the unplacedWords array.
 * Optionally, the function can prioritize placing words with matching orientations.
 *
 * @param {boolean} [matchOrientation=false] - If true, prioritize placing words with matching orientations.
 */
function placeOtherWords(matchOrientation = false) {
    // Initialize an array to store unplaced words
    const unplacedWords = [];

    // Iterate through the usableWords array, starting from the second word
    for (let i = 1; i < usableWords.length; i++) {
        const word = usableWords[i];
        let wordPlaced = false;
        const intersections = findIntersections(word);

        // If there are intersections, try to place the word
        if (intersections.length > 0) {
            // Use orientation that has been used the least
            const orientationToPlace = orientations.across < orientations.down ? 'across' : 'down';

            // Iterate through the intersections
            for (let j = 0; j < intersections.length; j++) {
                const intersection = intersections[j];

                // If matchOrientation is true and the orientation doesn't match, skip this intersection
                if (matchOrientation && intersection.orientationToPlace !== orientationToPlace) {
                    continue;
                }

                // If the word can be placed at the intersection, place it and mark it as placed
                if (checkIfPlaceable(word, intersection)) {
                    wordPlaced = true;
                    placeWord(word, intersection);
                    break;
                }
            }
        }

        // If the word couldn't be placed, add it to the unplacedWords array
        if (!wordPlaced) {
            unplacedWords.push(word);
        }
    }

    // If there are still unplaced words, call the function again without prioritizing matching orientations
    if (unplacedWords.length > 0) {
        usableWords = unplacedWords;
        placeOtherWords(false);
    }
}

/**
 * Checks if a word can be placed on the grid at the given intersection point.
 *
 * @param {string} word - The word to be placed on the grid.
 * @param {object} intersection - An object containing the intersection details.
 * @param {string} intersection.letter - The intersecting letter.
 * @param {number} intersection.x - The x-coordinate of the intersecting letter.
 * @param {number} intersection.y - The y-coordinate of the intersecting letter.
 * @param {string} intersection.orientationToPlace - The orientation to place the word ('down' or 'across').
 * @return {boolean} - Returns true if the word can be placed, otherwise false.
 */
function checkIfPlaceable(word, intersection) {
    const wordLength = word.length;
    const intersectionLetter = intersection.letter;
    const intersectionX = intersection.x;
    const intersectionY = intersection.y;
    const orientationToPlace = intersection.orientationToPlace;

    let startX = intersectionX;
    let startY = intersectionY;

    if (orientationToPlace === 'down') {
        startY = intersectionY - word.indexOf(intersectionLetter);

        // Check if the word can be placed vertically
        for (let j = 0; j < wordLength; j++) {
            if (startY + j >= gridSize || startY < 0) {
                return false;
            }
            if (gridValues[startY + j][startX] !== '' && gridValues[startY + j][startX] !== word[j]) {
                return false;
            }
            if (startX - 1 >= 0 && gridValues[startY + j][startX - 1] !== '' ||
                startX + 1 < gridSize && gridValues[startY + j][startX + 1] !== '') {
                if (startY + j === intersectionY) {
                    continue;
                }
                return false;
            }
        }

        // Check for adjacent words
        if ((startY > 0 && gridValues[startY - 1][startX] !== '') ||
            (startY + wordLength < gridSize && gridValues[startY + wordLength][startX] !== '')) {
            return false;
        }
        return true;
    } else {
        startX = intersectionX - word.indexOf(intersectionLetter);

        // Check if the word can be placed horizontally
        for (let j = 0; j < wordLength; j++) {
            if (startX + j >= gridSize || startX < 0) {
                return false;
            }
            if (gridValues[startY][startX + j] !== '' && gridValues[startY][startX + j] !== word[j]) {
                return false;
            }
            if (startY - 1 >= 0 && gridValues[startY - 1][startX + j] !== '' ||
                (startY + 1 < gridSize && gridValues[startY + 1][startX + j] !== '')) {
                if (startX + j === intersectionX) {
                    continue;
                }
                return false;
            }
        }

        // Check for adjacent words
        if ((startX > 0 && grid.rows[startY].cells[startX - 1].innerText !== '') ||
            (startX + wordLength < gridSize && grid.rows[startY].cells[startX + wordLength].innerText !== '')) {
            return false;
        }
        if ((startX > 0 && gridValues[startY][startX - 1] !== '') ||
            (startX + wordLength < gridSize && gridValues[startY][startX + wordLength] !== '')) {
            return false;
        }
        return true;
    }
}

/**
 * Places a word on the grid at the given intersection point and updates the placedWords and orientations arrays.
 *
 * @param {string} word - The word to be placed on the grid.
 * @param {object} intersection - An object containing the intersection details.
 * @param {string} intersection.letter - The intersecting letter.
 * @param {number} intersection.x - The x-coordinate of the intersecting letter.
 * @param {number} intersection.y - The y-coordinate of the intersecting letter.
 * @param {string} intersection.orientationToPlace - The orientation to place the word ('down' or 'across').
 */
function placeWord(word, intersection) {
    const wordLength = word.length;
    const intersectionLetter = intersection.letter;
    const intersectionX = intersection.x;
    const intersectionY = intersection.y;
    const orientationToPlace = intersection.orientationToPlace;

    let startX = intersectionX;
    let startY = intersectionY;

    // Place the word vertically or horizontally based on the orientationToPlace
    if (orientationToPlace === 'down') {
        startY = intersectionY - word.indexOf(intersectionLetter);
        for (let j = 0; j < wordLength; j++) {
            gridValues[startY + j][startX] = word[j];
        }
    } else {
        startX = intersectionX - word.indexOf(intersectionLetter);
        for (let j = 0; j < wordLength; j++) {
            gridValues[startY][startX + j] = word[j];
        }
    }

    // Store the word and its coordinates in placedWords array
    placedWords.push({
        word: word,
        start: { y: startY, x: startX },
        end: orientationToPlace === 'down' ? { y: startY + wordLength - 1, x: startX } : { y: startY, x: startX + wordLength - 1 },
        orientation: orientationToPlace,
    });

    // Update the orientations count
    orientations[orientationToPlace]++;
}


/**
 * Finds all possible intersections between the given word and the words already placed on the grid.
 *
 * @param {string} word - The word to find intersections for.
 * @return {object[]} - An array of intersection objects with word, letter, coordinates, and orientationToPlace.
 */
function findIntersections(word) {
    const intersections = [];

    // Iterate through the placedWords array
    for (let i = 0; i < placedWords.length; i++) {
        const placedWord = placedWords[i];
        const placedWordLength = placedWord.word.length;
        const orientationToPlace = placedWord.orientation === 'across' ? 'down' : 'across';

        // Check if the word intersects with the placed word
        // If it does, store the coordinates of the intersection
        for (let j = 0; j < placedWordLength; j++) {
            if (word.includes(placedWord.word[j])) {
                intersections.push({
                    word: placedWord.word,
                    letter: placedWord.word[j],
                    y: orientationToPlace === 'across' ? placedWord.start.y + j : placedWord.start.y,
                    x: orientationToPlace === 'down' ? placedWord.start.x + j : placedWord.start.x,
                    orientationToPlace: orientationToPlace,
                });
            }
        }
    }

    return intersections;
}


/**
 * Formats the grid visually by applying styles to cells based on their content.
 */
function formatGrid() {
    // Iterate through the grid cells
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // If the cell is empty, apply transparent styles
            if (gridValues[i][j] === '') {
                grid.rows[i].cells[j].style.backgroundColor = 'transparent';
                grid.rows[i].cells[j].style.border = 'none';
                grid.rows[i].cells[j].style.borderRadius = '0px';
            } else {
                // If the cell contains a letter, set the background color to white
                grid.rows[i].cells[j].style.backgroundColor = '#fff';
            }
        }
    }
}

function removeHintNumbers() {
    // If any cell has a number, remove it
    const hintNumbers = document.querySelectorAll('.hint-number');
    for (let i = 0; i < hintNumbers.length; i++) {
        hintNumbers[i].remove();
    }
}
/**
 * Adds hint numbers to the first letter of each word on the grid.
 */
function addHintNumbers() {
    // Delete any existing hint numbers
    const hintNumbers = document.querySelectorAll('.hint-number');
    for (let i = 0; i < hintNumbers.length; i++) {
        hintNumbers[i].remove();
    }

    // The first letter of each word on the grid should have the number of its hint
    let hintNumber = 1;

    // Iterate through the placedWords array
    for (let i = 0; i < placedWords.length; i++) {
        const word = placedWords[i];
        const start = word.start;
        const cell = grid.rows[start.y].cells[start.x];

        // Check if a span element already exists in the cell
        const spanElement = cell.querySelector('span');

        if (spanElement === null) {
            // Create a hint number element and add it to the cell
            const hintElement = document.createElement('span');
            hintElement.classList.add('hint-number');
            hintElement.innerText += hintNumber;
            cell.appendChild(hintElement);
        } else {
            spanElement.innerText += ', ' + hintNumber;
        }
        // Disable clicking on the hintElement

        hintNumber++;
    }
}

/**
 * Adds event listeners to the grid cells to handle user input.
 * Each cell has two listeners: an input listener and a keydown listener.
 * The input listener validates user input and moves them to the next cell.
 * The keydown listener handles the backspace key, and moves them to the previous cell.
 */
function addCellEventLisenters() {
    // Iterate through the grid cells
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            // Skip empty cells
            if (gridValues[i][j] === '') {
                continue;
            }

            // Make the cell editable
            grid.rows[i].cells[j].contentEditable = true;

            // Add an input event listener
            grid.rows[i].cells[j].addEventListener('input', (e) => {
                // Limit input to one character
                if (e.target.innerText.length > 1) {
                    e.target.innerText = e.target.innerText.slice(0, 1);
                }

                // Remove non-letter characters
                if (!e.target.innerText.match(/[a-z]/i)) {
                    e.target.innerText = '';
                }

                // Convert input to lowercase and move focus to the next cell
                if (e.target.innerText !== '') {
                    e.target.innerText = e.target.innerText.toLowerCase();

                    // Find all the words associated with the current cell
                    const placedWordsForCell = placedWords.filter((word) => {
                        if (word.orientation === 'across') {
                            return (
                                e.target.parentNode.rowIndex === word.start.y &&
                                e.target.cellIndex >= word.start.x &&
                                e.target.cellIndex < word.start.x + word.word.length
                            );
                        } else {
                            return (
                                e.target.cellIndex === word.start.x &&
                                e.target.parentNode.rowIndex >= word.start.y &&
                                e.target.parentNode.rowIndex < word.start.y + word.word.length
                            );
                        }
                    });

                    // Move focus to the next cell in the word
                    if (placedWordsForCell.length === 1) {
                        const orientation = placedWordsForCell[0].orientation;
                        if (orientation === 'across') {
                            if (e.target.cellIndex + 1 < gridSize) {
                                grid.rows[e.target.parentNode.rowIndex].cells[e.target.cellIndex + 1].focus();
                            }
                        } else {
                            if (e.target.parentNode.rowIndex + 1 < gridSize) {
                                grid.rows[e.target.parentNode.rowIndex + 1].cells[e.target.cellIndex].focus();
                            }
                        }
                    } else {
                        if (placedWordsForCell.length === 2) {
                            removeHintNumbers();
                            let currentCellY = e.target.parentNode.rowIndex;
                            let currentCellX = e.target.cellIndex;
                            // If empty, 0
                            // If cell doesn't exist, 1
                            // If full, 2
                            let leftEmpty = 2;
                            let upEmpty = 2;
                            // Check if cell to left is empty
                            if (currentCellX - 1 >= 0 &&
                                grid.rows[currentCellY].cells[currentCellX - 1].innerText === '') {
                                if (grid.rows[currentCellY].cells[currentCellX - 1].contentEditable === 'true') {
                                    leftEmpty = 0;
                                } else {
                                    leftEmpty = 1;
                                }
                            };
                            // Check if cell above is empty
                            if (currentCellY - 1 >= 0 &&
                                grid.rows[currentCellY - 1].cells[currentCellX].innerText === '') {
                                if (grid.rows[currentCellY - 1].cells[currentCellX].contentEditable === 'true') {
                                    upEmpty = 0;
                                } else {
                                    upEmpty = 1;
                                }
                            }

                            let sum = leftEmpty + upEmpty;

                            switch (sum) {
                                case 0:
                                case 4:
                                    // If cell to right exists and it's empty, focus it
                                    if (currentCellX + 1 < gridSize &&
                                        grid.rows[currentCellY].cells[currentCellX + 1].innerText === '' &&
                                        grid.rows[currentCellY].cells[currentCellX + 1].contentEditable === 'true') {
                                        grid.rows[currentCellY].cells[currentCellX + 1].focus();
                                    }
                                    // Else if down exists, focus it
                                    else if (currentCellY + 1 < gridSize) {
                                        grid.rows[currentCellY + 1].cells[currentCellX].focus();
                                    }
                                    break;
                                case 1:
                                    if (leftEmpty === 0) {
                                        // Go down
                                        if (currentCellY + 1 < gridSize) {
                                            grid.rows[currentCellY + 1].cells[currentCellX].focus();
                                        }
                                    } else {
                                        // Go right
                                        if (currentCellX + 1 < gridSize) {
                                            grid.rows[currentCellY].cells[currentCellX + 1].focus();
                                        }
                                    }
                                    break;
                                case 2:
                                    if (leftEmpty === 1 && upEmpty === 1) {
                                        // If empty, go right
                                        if (currentCellX + 1 < gridSize &&
                                            grid.rows[currentCellY].cells[currentCellX + 1].innerText === '') {
                                            grid.rows[currentCellY].cells[currentCellX + 1].focus();
                                        } else {
                                            // If empty, go down
                                            if (currentCellY + 1 < gridSize &&
                                                grid.rows[currentCellY + 1].cells[currentCellX].innerText === '') {
                                                grid.rows[currentCellY + 1].cells[currentCellX].focus();
                                            }
                                        }
                                    } else {
                                        if (leftEmpty === 0) {
                                            // Go down
                                            if (currentCellY + 1 < gridSize) {
                                                grid.rows[currentCellY + 1].cells[currentCellX].focus();
                                            }
                                        } else {
                                            // Go right
                                            if (currentCellX + 1 < gridSize) {
                                                grid.rows[currentCellY].cells[currentCellX + 1].focus();
                                            }
                                        }
                                    }
                                    break;
                                case 3:
                                    if (leftEmpty === 1) {
                                        // If empty, do down
                                        if (currentCellY + 1 < gridSize &&
                                            grid.rows[currentCellY + 1].cells[currentCellX].innerText === '') {
                                            grid.rows[currentCellY + 1].cells[currentCellX].focus();
                                        } else {
                                            // Go right
                                            if (currentCellX + 1 < gridSize) {
                                                grid.rows[currentCellY].cells[currentCellX + 1].focus();
                                            }
                                        }
                                    } else if (upEmpty === 1) {
                                        // If empty, go right
                                        if (currentCellX + 1 < gridSize &&
                                            grid.rows[currentCellY].cells[currentCellX + 1].innerText === '') {
                                            grid.rows[currentCellY].cells[currentCellX + 1].focus();
                                        } else {
                                            // Go down
                                            if (currentCellY + 1 < gridSize) {
                                                grid.rows[currentCellY + 1].cells[currentCellX].focus();
                                            }
                                        }
                                    }
                                    break;
                            }
                        }
                    }
                }
                // Update hint numbers
                addHintNumbers();
            });
            // Add listener for backspace key
            grid.rows[i].cells[j].addEventListener('keydown', (e) => {
                let currentCell = grid.rows[i].cells[j];
                keyPress.play();

                // Check if the pressed key is 'Backspace'
                if (e.key === 'Backspace') {
                    backSpace.play();

                    // If the current cell is empty
                    if (currentCell.innerText === '') {

                        // If there is a previous cell in the same row and it is editable
                        if (currentCell.cellIndex - 1 >= 0 &&
                            grid.rows[i].cells[i - 1].contentEditable === 'true') {
                            // Focus the previous cell in the same row
                            grid.rows[i].cells[j - 1].focus();
                        } else {
                            // If there is a row above and the cell in the above row is editable
                            if (currentCell.parentNode.rowIndex - 1 >= 0 &&
                                grid.rows[i - 1].cells[j].contentEditable === 'true') {
                                // Focus the cell in the above row
                                grid.rows[i - 1].cells[j].focus();
                            }
                        }
                    } else {
                        // If the current cell is not empty, clear its content
                        currentCell.innerText = '';
                    }
                }
            });
        }
    }
}


/**
 * Displays hints for each placed word in the crossword puzzle.
 */
function displayHints() {
    // Iterate through the placedWords array
    for (let i = 0; i < placedWords.length; i++) {
        const word = placedWords[i].word;
        const orientation = placedWords[i].orientation;
        const hint = wordsDict[word];

        // Create a hint div element and set its content
        const hintDiv = document.createElement('div');
        hintDiv.innerText = i + 1 + ': ' + hint + ' (' + word.length + ')';

        // Add the hint div to the appropriate container (across or down)
        if (orientation === 'across') {
            acrossDiv.appendChild(hintDiv);
        } else {
            downDiv.appendChild(hintDiv);
        }
    }
}

/**
 * Clears the grid of user input, and reformats it.
 */
function clearGrid() {
    // Confirm user's intention to clear the grid
    const confirmClear = confirm('Are you sure you want to clear the grid?');
    if (!confirmClear) {
        return;
    }

    // Clear the grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid.rows[i].cells[j].innerText = '';
        }
    }

    // Reformat the grid and update hint numbers
    formatGrid();
    addHintNumbers();
}

/**
 * Solves the grid by filling in the correct answers.
 */
function solveGrid() {
    // Confirm user's intention to solve the grid
    const confirmSolve = confirm('Are you sure you want to solve the grid?\nYou won\'t earn any xp if you do!');
    if (!confirmSolve) {
        return;
    }

    // Fill in the grid with correct answers
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridValues[i][j] === '') {
                continue;
            }
            grid.rows[i].cells[j].innerText = gridValues[i][j];
        }
    }

    addHintNumbers();
    // Finalize the grid and calculate the score
    finaliseGrid();
    // False is passed to calculateScore() to indicate that the grid wasn't solved by the user
    calculateScore(false);
}

/**
 * Checks the grid for correctness and highlights incorrect cells.
 */
function checkGrid() {
    // Confirm user's intention to check the grid
    const confirmCheck = confirm('Are you sure you want to check the grid?\nYou won\'t be able to change your answers after you do!');
    if (!confirmCheck) {
        return;
    }
    // Finalize the grid and calculate the score
    calculateScore(true);
    // Check the grid for correctness and highlight cells
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (gridValues[i][j] === '') {
                continue;
            }

            // Slice the first character of the cell's inner text to remove the hint number
            if (gridValues[i][j] !== grid.rows[i].cells[j].innerText.slice(0, 1)) {
                // Set the background color of the cell to red
                grid.rows[i].cells[j].style.backgroundColor = 'red';
                // Set the text value of the cell to the correct answer
                grid.rows[i].cells[j].innerText = gridValues[i][j];
            } else {
                // Set the background color of the cell to light green
                grid.rows[i].cells[j].style.backgroundColor = '#90ee90';
            }
        }
    }

    // Finalize the
    finaliseGrid();
}

/**
 * Resets the grid by clearing user input, grid values, placed words, and orientations.
 */
function resetGrid() {
    // Clear the grid and grid values
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid.rows[i].cells[j].innerText = '';
            gridValues[i][j] = '';
        }
    }

    // Reset placed words and orientations
    placedWords = [];
    orientations = {
        across: 0,
        down: 0,
    };
}

/**
 * Finalizes the grid by disabling user input and hiding the buttons div.
 */
function finaliseGrid() {
    // Disable user input on the grid
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            grid.rows[i].cells[j].contentEditable = false;
        }
    }

    addHintNumbers();

    // Hide the buttons div
    buttonsDiv.style.display = 'none';
}

/**
 * Calculates the score based on the number of correct words and displays it in the score div.
 * Assumes global variables `placedWords`, `grid`, and `scoreDiv` exist.
 *
 * @param {boolean} userSolved - Indicates if the user solved the grid (true) or if it was auto-solved (false).
 */
function calculateScore(userSolved = true) {
    // Initialize the count of correct words
    let correctWords = 0;

    // If the user solved the grid, check their answers
    if (userSolved) {
        for (let i = 0; i < placedWords.length; i++) {
            const word = placedWords[i].word;
            const orientation = placedWords[i].orientation;
            const start = placedWords[i].start;
            let correctWord = true;

            // Check if the user's answer is correct for across words
            if (orientation === 'across') {
                for (let j = 0; j < word.length; j++) {
                    // Slice the first character of the cell's inner text to remove the hint number
                    if (word[j] !== grid.rows[start.y].cells[start.x + j].innerText.slice(0, 1)) {
                        correctWord = false;
                        break;
                    }
                }
            } else { // Check if the user's answer is correct for down words
                for (let j = 0; j < word.length; j++) {
                    // Slice the first character of the cell's inner text to remove the hint number
                    if (word[j] !== grid.rows[start.y + j].cells[start.x].innerText.slice(0, 1)) {
                        correctWord = false;
                        break;
                    }
                }
            }

            // Increment the count of correct words if the current word is correct
            if (correctWord) {
                correctWords++;
            }
        }
    }

    // Display the score in the score div
    scoreDiv.innerText = 'Score: ' + correctWords + '/' + placedWords.length;
    scoreDiv.style.display = 'flex';
    // Make text bigger
    scoreDiv.style.fontSize = '24px';


    if (correctWords === placedWords.length) {
        userWon = true;
        bgMusic.pause();
        win.play();
        win.addEventListener('pause', ()=> {
            location.reload();
        });
    } else {
        bgMusic.pause();
        wrongAnswer.play();
        wrongAnswer.addEventListener('pause', ()=> {
            location.reload();
        });
    }

}

// Generates the crossword grid by placing words, formatting the grid, adding hint numbers, event listeners, and displaying hints.
function generateGrid() {
    // Sort the words based on their lengths
    usableWords = sortWords(Object.keys(wordsDict));

    // Place the first word in the grid
    placeFirstWord();

    // Place the remaining words, trying to keep the grid balanced
    placeOtherWords(true);

    // If not all words are placed, retry the grid generation
    if (placedWords.length !== wordsToPlace) {
        resetGrid();
        generateGrid();
        return;
    }

    // Format the grid visually
    formatGrid();

    // Add hint numbers to the grid
    addHintNumbers();

    // Add event listeners to the grid cells
    addCellEventLisenters();

    // Display the hints for the placed words
    displayHints();
}