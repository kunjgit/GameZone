let selectedFlag = {};
let attemptCount = 0;
const maxAttempts = 8; // You can change this value to set a different maximum number of attempts

const flagDisplay = document.getElementById("flag");
const countryDisplay = document.getElementById("country");
const guessInput = document.getElementById("input");
const submitBtn = document.getElementById("submit");
const nextBtn = document.getElementById("next");
const resultDiv = document.getElementById("result");

const flags = [
    { capital: "Canberra", country: "Australia", flag: "assets/Australia.jpeg" },
    { capital: "Brasilia", country: "Brazil", flag: "assets/Brazil.jpeg" },
    { capital: "Ottawa", country: "Canada", flag: "assets/Canada.jpeg" },
    { capital: "Paris", country: "France", flag: "assets/France.jpeg" },
    { capital: "Berlin", country: "Germany", flag: "assets/Germany.jpeg" },
    { capital: "Tokyo", country: "Japan", flag: "assets/Japan.jpeg" },
    { capital: "Thimphu", country: "Bhutan", flag: "assets/Bhutan.jpeg" },
    { capital: "New Delhi", country: "India", flag: "assets/India.jpeg" }, 
    { capital: "Kathmandu", country: "Nepal", flag: "assets/Nepal.jpeg" }
];

let availableFlags = [...flags];

function initializeGame() {
    // Reset attempt count and available flags at the beginning of the game
    attemptCount = 0;
    availableFlags = [...flags];
    startNewRound();
}

function startNewRound() {
    if (attemptCount >= maxAttempts || availableFlags.length === 0) {
        endGame();
        return;
    }
    // Select a random flag from the available list
    const randomIndex = Math.floor(Math.random() * availableFlags.length);
    selectedFlag = availableFlags.splice(randomIndex, 1)[0];

    // Display the flag image
    flagDisplay.src = selectedFlag.flag;
    // Display country name
    countryDisplay.innerText = selectedFlag.country;

    // Clear input field and result
    guessInput.value = "";
    resultDiv.textContent = "";
    
    toggleButtons(false);
}

function checkGuess() {
    const guess = guessInput.value.trim();

    // Validate the guess
    if (!guess) {
        alert("Please enter an answer.");
        return;
    }

    // Convert both guess and selected capital to lowercase for comparison
    const guessLowerCase = guess.toLowerCase();
    const capitalLowerCase = selectedFlag.capital.toLowerCase();

    // Check if the guess is correct
    if (guessLowerCase === capitalLowerCase) {
        alert("Congratulations! You guessed correctly.");
    } else {
        alert(`Incorrect. The capital city is ${selectedFlag.capital}.`);
    }


    guessInput.value = "";
    attemptCount++;
    toggleButtons(true);
    startNewRound();
}

function handleNext() {
    startNewRound();
}

function endGame() {
    // Disable input and buttons
    guessInput.disabled = true;
    submitBtn.disabled = true;
    nextBtn.disabled = true;

    // Show final message
    alert("Game Over! Thanks for playing.");
}

function toggleButtons(enableNext) {
    submitBtn.disabled = enableNext;
    nextBtn.disabled = !enableNext;
}

// Initialize the game
initializeGame();

// Event listeners
submitBtn.addEventListener("click", checkGuess);
nextBtn.addEventListener("click", handleNext);
