const wordContainer = document.getElementById('word-container');
const userInput = document.getElementById('user-input');
const submitBtn = document.getElementById('submit-btn');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

let score = 0;
let time = 60;

// Array of words to be scrambled
const words = ['apple', 'banana', 'cherry', 'grape', 'orange', 'mango', 'pear', 'watermelon'];

// Generate a random word from the array
function generateWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
}

// Scramble the letters of the word
function scrambleWord(word) {
    let scrambledWord = '';
    const wordArray = word.split('');

    while (wordArray.length > 0) {
        const randomIndex = Math.floor(Math.random() * wordArray.length);
        scrambledWord += wordArray[randomIndex];
        wordArray.splice(randomIndex, 1);
    }

    return scrambledWord;
}

// Display a new word and scramble it
function displayWord() {
    const word = generateWord();
    const scrambledWord = scrambleWord(word);

    wordContainer.textContent = scrambledWord;
    userInput.value = '';
    userInput.focus();
}

// Check if the input word is valid
function checkWord() {
    const userWord = userInput.value.toLowerCase();
    const displayedWord = wordContainer.textContent.toLowerCase();

    if (userWord === displayedWord) {
        score++;
        scoreElement.textContent = score;
        displayWord();
    }
}

// Update the timer
function updateTimer() {
    time--;
    timerElement.textContent = time;

    if (time === 0) {
        endGame();
    }
}

// End the game and display the final score
function endGame() {
    clearInterval(timerInterval);
    userInput.disabled = true;
    submitBtn.disabled = true;
    wordContainer.textContent = 'Game Over';
}

// Event listeners
submitBtn.addEventListener('click', checkWord);
userInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        checkWord();
    }
});

// Start the game
displayWord();
const timerInterval = setInterval(updateTimer, 1000);
