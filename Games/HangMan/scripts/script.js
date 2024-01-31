const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const hangmanImage = document.querySelector(".hangman-box img");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = gameModal.querySelector("button");

// Initializing game variables
let currentWord, correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    // Ressetting game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = "images/hangman-0.svg";
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    gameModal.classList.remove("show");
}

const getRandomWord = () => {
    // Selecting a random word and hint from the wordList
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word.toUpperCase(); // Making currentWord as random word
    document.querySelector(".hint-text b").innerText = hint;
    resetGame();
}

const gameOver = (isVictory) => {
    // After game complete.. showing modal with relevant details
    const modalText = isVictory ? `You found the word:` : 'The correct word was:';
    gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
    gameModal.querySelector("h4").innerText = isVictory ? 'Congrats!' : 'Game Over!';
    gameModal.querySelector("p").innerHTML = `${modalText} <b>${currentWord}</b>`;
    gameModal.classList.add("show");
}


const initGame = (clickedLetter) => {
    let guessedAll = true;

    // Checking if clickedLetter exists in the currentWord
    if(currentWord.includes(clickedLetter)) {
        // Showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters[index] = letter; // Storing correct letters with their position
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        });
    } else {
        // If clicked letter doesn't exist, then update the wrongGuessCount and hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
        guessedAll = false;
    }

    // Disabling the clicked button
    document.querySelectorAll(`.keyboard button`).forEach(button => {
        if (button.innerText === clickedLetter) {
            button.disabled = true;
        }
    });

    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // Checking if all letters have been guessed correctly
    [...currentWord].forEach((letter, index) => {
        if (correctLetters[index] !== letter) {
            guessedAll = false;
        }
    });

    // Calling gameOver function if any of these conditions meet
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(guessedAll) return gameOver(true);
}


// Creating a qwerty keyboard button and adding event listeners
const qwertyRows = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

qwertyRows.forEach(row => {
    const rowDiv = document.createElement("div");
    rowDiv.className = "keyboard-row";
    row.forEach(letter => {
        const button = document.createElement("button");
        button.innerText = letter;
        rowDiv.appendChild(button);
        button.addEventListener("click", () => initGame(letter));
    });
    keyboardDiv.appendChild(rowDiv);
});

getRandomWord();
playAgainBtn.addEventListener("click", getRandomWord);