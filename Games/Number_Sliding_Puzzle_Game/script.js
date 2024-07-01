// declaring global variables
const loadingPage = document.getElementById('loading-page');
const gamePage = document.getElementById('game-page');
const inputBox = document.getElementById('input-box');
const startBtn = document.getElementById('start-btn');
const msg = document.getElementById('msg');
const updateMoves = document.getElementById('moves-done');

// Music Controls
const bgMusic = new Audio();
bgMusic.src = 'https://drive.google.com/uc?export=download&id=1a-MMLTv2Uy1KL5-AE76AAOVJPvwfUtf0';
bgMusic.volume = 0.25; // Volume set to 25%
bgMusic.loop = true;

const welcomeSound = new Audio();
welcomeSound.src = 'https://drive.google.com/uc?export=download&id=1mROFDnoIAhUf8M55lK89qVFABt38x5Ql';

const winSound = new Audio();
winSound.src = 'https://drive.google.com/uc?export=download&id=1qxb5HdgZ4GeAvEM9x3VO0isFhPgMdVsY';

const looseSound = new Audio();
looseSound.src = 'https://drive.google.com/uc?export=download&id=1ZocLzAaiafCejzF3etQFQ_NBOlxorQmX';

const rightMove = new Audio();
rightMove.src = 'https://drive.google.com/uc?export=download&id=12RP85yJRXoihQbztaYTKMZ8g46dtZ5MI';

// Moves number
const movesNum = [80, 300, 1000, 3500, 10000, 25000, 65000];

// count number of moves done
var movesDone = 0;
var isPlaying = true;

// Game Started
function startGame(size) {
    // Welcome sound
    welcomeSound.play();
    welcomeSound.addEventListener('ended', () => {
        // Adding background music
        bgMusic.play();
    });

    // Initialising variables
    let fieldCells = createField();
    let values;
    let emptyX, emptyY;
    let LEFT = { dx: 1, dy: 0 };
    let RIGHT = { dx: -1, dy: 0 };
    let UP = { dx: 0, dy: 1 };
    let DOWN = { dx: 0, dy: -1 };
    updateMoves.innerHTML = movesNum[size - 3] - movesDone; // Show the user how many moves they got.

    // Creating the different cells of the game
    function createField() {
        let cells = [];
        let table = document.getElementById('field');
        const fontSize = 16 / (size - 2);
        for (let y = 0; y < size; y++) {
            let tr = document.createElement('tr');
            table.appendChild(tr);
            let rowCells = [];
            cells.push(rowCells);
            for (let x = 0; x < size; x++) {
                let td = document.createElement('td');
                td.setAttribute('class', 'cell');
                td.style.width = `${100 / size}%`; // Setting width dynamically
                td.style.height = `${100 / size}%`; // Setting height dynamically
                td.style.fontSize = `${fontSize}vh`; // Setting font size dynamically
                tr.appendChild(td);
                rowCells.push(td);
            }
        }
        return cells;
    }

    // Initialising different variables before the start of the game
    function createInitialValues() {
        emptyX = emptyY = size - 1;
        let v = [];
        let i = 1;
        for (let y = 0; y < size; y++) {
            let rowValues = [];
            v.push(rowValues);
            for (let x = 0; x < size; x++) {
                rowValues.push(i);
                i++
            }
        }
        v[emptyY][emptyX] = 0;
        return v;
    }

    // Assigning the values to the cells of the game
    function draw() {
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                let v = values[y][x];
                let td = fieldCells[y][x];
                td.innerHTML = v == 0 ? '' : String(v);
            }
        }
    }

    // Condition to check move is possible or not
    function makeMove(move) {
        // Checking game is still playing of stops
        if (!isPlaying) return false;
        let newX = emptyX + move.dx, newY = emptyY + move.dy;
        // Checking the move is valid or invalid
        if ((newX >= size) || (newX < 0) ||
            (newY >= size) || (newY < 0)
        ) {
            return false;
        }
        rightMove.play();
        let c = values[newY][newX];
        values[newY][newX] = 0;
        values[emptyY][emptyX] = c;
        emptyX = newX;
        emptyY = newY;
        return true;
    }

    // Shuffle the elements of the board before starting the game
    function shuffle() {
        let options = [LEFT, RIGHT, UP, DOWN];
        let iterations = 200 * size;
        for (let i = 0; i < iterations; i++) {
            let move = options[Math.floor(Math.random() * options.length)];
            makeMove(move);
        }
    }

    // Starting the time of the user
    function startTimer() {
        var startTime = new Date().getTime(); // Get the current timestamp

        // Update the timer every second
        var timerInterval = setInterval(function () {
            var currentTime = new Date().getTime(); // Get the current timestamp
            var elapsedTime = currentTime - startTime; // Calculate elapsed time in milliseconds

            // Convert elapsed time to hours, minutes, seconds
            var hours = Math.floor(elapsedTime / (1000 * 60 * 60));
            var minutes = Math.floor((elapsedTime % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((elapsedTime % (1000 * 60)) / 1000);

            // Display the time in the timer element
            var timerElement = document.getElementById('timer');
            timerElement.textContent = hours + 'h ' + minutes + 'm ' + seconds + 's';

            // Check if the timer should stop
            if (!isPlaying) {
                clearInterval(timerInterval);
            }
        }, 1000); // Update every second (1000 milliseconds)

    }

    // Checking game is completed or not
    function gameOver() {
        let expectedValue = 1;
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (values[y][x] == expectedValue) {
                    expectedValue++;
                } else {
                    if (x == size - 1 && y == size - 1 && values[y][x] == 0) {
                        return true;
                    }
                    return false;
                }
            }
        }
        return true;
    }

    // Adding functioning of the arrow buttons
    document.addEventListener('keydown', function (e) {
        switch (e.keyCode) {
            case 38:
                if (makeMove(UP))
                    ++movesDone;
                break;
            case 40:
                if (makeMove(DOWN))
                    ++movesDone;
                break;
            case 37:
                if (makeMove(LEFT))
                    ++movesDone;
                break;
            case 39:
                if (makeMove(RIGHT))
                    ++movesDone;
                break;
        }
        // Updating the left moves
        updateMoves.innerHTML = movesNum[size - 3] - movesDone;
        draw();
        if (movesNum[size - 3] - movesDone <= 0) {
            bgMusic.pause();
            isPlaying = false;
            looseSound.play();
            looseSound.addEventListener('ended', () => {
                location.reload();
            });
        }
        if (gameOver()) {
            bgMusic.pause();
            isPlaying = false;
            winSound.play();
            winSound.addEventListener('ended', () => {
                location.reload();
            });
        }
    });

    // Initialising the game
    function init() {
        values = createInitialValues();
        shuffle();
        draw();
        startTimer();
    }

    init();
}

// At the start of the game
window.addEventListener('load', () => {
    // Displaying the loading page and takes the input of the board size of the game
    gamePage.style.display = 'none';
    loadingPage.style.display = '';

    // Functioning of the start game button
    startBtn.addEventListener('click', () => {
        let size = inputBox.value;
        if (size === '' || size === 'None' || size < 3 || size > 9) {
            msg.style.display = '';
            setTimeout(function () {
                msg.style.display = 'none';
            }, 3000);
            return;
        }
        gamePage.style.display = '';
        loadingPage.style.display = 'none';
        startGame(size); // Starting the game
    });

    // Functioning of the enter button
    inputBox.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            let size = inputBox.value;
            if (size === '' || size === 'None' || size < 3 || size > 9) {
                msg.style.display = '';
                setTimeout(function () {
                    msg.style.display = 'none';
                }, 3000);
                return;
            }
            gamePage.style.display = '';
            loadingPage.style.display = 'none';
            startGame(size); // Starting the game
        }
    });
});