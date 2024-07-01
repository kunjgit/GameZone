
const flags = [
    // Add flag objects here
    { country: "Australia", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Flag_of_Australia_%28converted%29.svg/2560px-Flag_of_Australia_%28converted%29.svg.png" },
    { country: "Brazil", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Flag_of_Brazil.svg/2560px-Flag_of_Brazil.svg.png" },
    { country: "Canada", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cf/Flag_of_Canada.svg/2560px-Flag_of_Canada.svg.png" },
    { country: "France", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Flag_of_France.svg/2560px-Flag_of_France.svg.png" },
    { country: "Germany", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/ba/Flag_of_Germany.svg/2560px-Flag_of_Germany.svg.png" },
    { country: "Italy", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/03/Flag_of_Italy.svg/2560px-Flag_of_Italy.svg.png" },
    { country: "Japan", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Flag_of_Japan.svg/2560px-Flag_of_Japan.svg.png" },
    { country: "United Kingdom", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Flag_of_the_United_Kingdom.svg/2560px-Flag_of_the_United_Kingdom.svg.png" },
    { country: "United States", flag: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Flag_of_the_United_States.svg/2560px-Flag_of_the_United_States.svg.png" },
];


let selectedFlag = {};

// DOM elements
const flagDisplay = document.getElementById("flag");
const guessInput = document.getElementById("guess-input");
const submitBtn = document.getElementById("submit-btn");
const nextBtn = document.getElementById("next-btn");
const resultDiv = document.getElementById("result");

// Game logic
function initializeGame() {
    // Select a random flag from the list
    selectedFlag = flags[Math.floor(Math.random() * flags.length)];

    // Display the flag image
    flagDisplay.src = selectedFlag.flag;

    // Clear input field and result
    guessInput.value = "";
    resultDiv.textContent = "";
}

function checkGuess() {
    const guess = guessInput.value.trim();

    // Validate the guess
    if (!guess) {
        resultDiv.textContent = "Please enter a country name.";
        return;
    }

    // Convert both guess and selected country to lowercase for comparison
    const guessLowerCase = guess.toLowerCase();
    const countryLowerCase = selectedFlag.country.toLowerCase();

    // Check if the guess is correct
    if (guessLowerCase === countryLowerCase) {
        resultDiv.textContent = "Congratulations! You guessed correctly.";
    } else {
        resultDiv.textContent = `Incorrect. The flag belongs to ${selectedFlag.country}.`;
    }

    guessInput.value = "";
    toggleButtons(true);
}

function handleNext() {
    initializeGame();
    toggleButtons(false);
}

function toggleButtons(enableNext) {
    submitBtn.disabled = enableNext;
    nextBtn.disabled = !enableNext;
}

// Initialize the game
initializeGame();

// Event listeners
submitBtn.addEventListener("click", checkGuess);
nextBtn.addEventListener("click", handleNext);