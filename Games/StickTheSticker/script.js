// Puzzle data
var puzzles = [
    {
        folderPath: 'puzzle1',
        pieces: ['p12.png', 'p11.png', 'p13.png', 'p14.png']
    },
    {
        folderPath: 'puzzle2',
        pieces: ['p21.png', 'p22.png', 'p23.png', 'p24.png']
    },
    {
        folderPath: 'puzzle3',
        pieces: ['p31.png', 'p32.png', 'p33.png', 'p34.png']
    },
    {
        folderPath: 'puzzle4',
        pieces: ['p41.png', 'p42.png', 'p43.png', 'p44.png']
    },
    {
        folderPath: 'puzzle5',
        pieces: ['p51.png', 'p52.png', 'p53.png', 'p54.png']
    },
    {
        folderPath: 'puzzle6',
        pieces: ['p61.png', 'p62.png', 'p63.png', 'p64.png']
    },
    
    // Add more puzzles as needed...
];

// Set the number of turns before resetting positions
var turnsBeforeReset = 4;
var currentTurn = 0;

// Get puzzle container element
var puzzleContainer = document.getElementById('puzzle-container');

// Current puzzle index
var currentPuzzleIndex = 0;

// Initialize the puzzle game
createPuzzleGame(puzzles[currentPuzzleIndex]);

// Handle shuffle button click
var shuffleBtn = document.getElementById('shuffle-btn');
shuffleBtn.addEventListener('click', function () {
    createPuzzleGame(puzzles[currentPuzzleIndex]);
});

// Handle button1 click
var button1 = document.getElementById('btn1');
button1.addEventListener('click', function () {
    currentPuzzleIndex--;
    if (currentPuzzleIndex < 0) {
        currentPuzzleIndex = puzzles.length - 1;
    }
    createPuzzleGame(puzzles[currentPuzzleIndex]);
});

// Handle button2 click
var button2 = document.getElementById('btn2');
button2.addEventListener('click', function () {
    currentPuzzleIndex++;
    if (currentPuzzleIndex >= puzzles.length) {
        currentPuzzleIndex = 0;
    }
    createPuzzleGame(puzzles[currentPuzzleIndex]);
});

// Create the puzzle game
function createPuzzleGame(puzzle) {
    puzzleContainer.innerHTML = '';

    // Shuffle the puzzle pieces
    var shuffledPieces = shuffleArray(puzzle.pieces);

    // Create puzzle piece stickers
    for (var i = 0; i < shuffledPieces.length; i++) {
        var piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.style.backgroundImage = `url('${puzzle.folderPath}/${shuffledPieces[i]}')`;
        puzzleContainer.appendChild(piece);
    }
}

// Shuffle the puzzle pieces randomly or reset positions
function shuffleArray(array) {
    if (currentTurn >= turnsBeforeReset) {
        currentTurn = 0;
        return array; // Return the original array order
    } else {
        currentTurn++;
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }
}
