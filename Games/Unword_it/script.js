const wordDisplay = document.getElementById('word-display');
const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start-button');
const revealLetterButton = document.getElementById('reveal-letter');
const team1Score = document.getElementById('team1-score');
const team2Score = document.getElementById('team2-score');
const guessInput = document.getElementById('guess-input');
const submitGuessButton = document.getElementById('submit-guess');

let currentWord = '';
let jumbledWord = '';
let timer;
let currentTeam = 1;
let scores = [0, 0];
let revealedIndices = [];

const words = [
    'sunshine', 'butterfly', 'telephone', 'computer', 'elephant',
    'umbrella', 'chocolate', 'football', 'restaurant', 'fireworks'
];

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function jumbleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

function updateScores() {
    team1Score.textContent = scores[0];
    team2Score.textContent = scores[1];
}

function startGame() {
    currentWord = getRandomWord();
    jumbledWord = jumbleWord(currentWord);
    wordDisplay.textContent = `Jumbled: ${jumbledWord}`;
    revealedIndices = [];
    startTimer();
    startButton.disabled = true;
    revealLetterButton.disabled = false;
    guessInput.disabled = false;
    submitGuessButton.disabled = false;
}

function startTimer() {
    let timeLeft = 30;
    timerDisplay.textContent = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.textContent = timeLeft;
        if (timeLeft === 0) {
            clearInterval(timer);
            endRound(false);
        }
    }, 1000);
}

function endRound(guessedCorrectly) {
    clearInterval(timer);
    if (guessedCorrectly) {
        scores[currentTeam - 1]++;
        wordDisplay.textContent = `Correct! Team ${currentTeam} guessed the word: ${currentWord}`;
    } else {
        scores[currentTeam % 2]++;
        wordDisplay.textContent = `Time's up! The word was: ${currentWord}`;
    }
    updateScores();
    currentTeam = currentTeam % 2 + 1;
    startButton.disabled = false;
    revealLetterButton.disabled = true;
    guessInput.disabled = true;
    submitGuessButton.disabled = true;
    guessInput.value = '';
}

function revealLetter() {
    if (revealedIndices.length < currentWord.length) {
        let index;
        do {
            index = Math.floor(Math.random() * currentWord.length);
        } while (revealedIndices.includes(index));
        
        revealedIndices.push(index);
        
        const revealedWord = currentWord.split('').map((char, i) => 
            revealedIndices.includes(i) ? char : '_'
        ).join('');
        
        wordDisplay.textContent = `Jumbled: ${jumbledWord} | Revealed: ${revealedWord}`;
        scores[currentTeam - 1]--;
        updateScores();
        
        if (revealedIndices.length === currentWord.length) {
            endRound(false);
        }
    }
}

function submitGuess() {
    const guess = guessInput.value.trim().toLowerCase();
    if (guess === currentWord.toLowerCase()) {
        endRound(true);
    } else {
        guessInput.value = '';
        alert('Incorrect guess. Try again!');
    }
}

startButton.addEventListener('click', startGame);
revealLetterButton.addEventListener('click', revealLetter);
submitGuessButton.addEventListener('click', submitGuess);

// Initialize scores
updateScores();