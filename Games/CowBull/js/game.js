// Generate random 3-digit number for the computer's guess
let computerNumber = generateRandomNumber();

// Store game data
let attempts = 0;
const gameData = [];

// Get HTML elements
const guessInput = document.getElementById('guessInput');
const submitBtn = document.getElementById('submitBtn');
const newGameBtn = document.getElementById('newGameBtn');
const resultsBody = document.getElementById('resultsBody');

guessInput.addEventListener('keydown', handleKeyDown);


// Function to generate a random 3-digit number
function generateRandomNumber() {
    const digits = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let number = '';
    
    for (let i = 0; i < 3; i++) {
      const randomIndex = Math.floor(Math.random() * digits.length);
      const digit = digits.splice(randomIndex, 1)[0];
      number += digit;
    }
    
    return parseInt(number);
  }
// Function to check the user's guess
function checkGuess(guess) {
  const guessString = guess.toString();
  const computerString = computerNumber.toString();
  let cows = 0;
  let bulls = 0;

  for (let i = 0; i < guessString.length; i++) {
    if (guessString[i] === computerString[i]) {
      bulls++;
    } else if (computerString.includes(guessString[i])) {
      cows++;
    }
  }

  return [cows, bulls];
}

// Function to update the game status and results table
function updateGameStatus(cows, bulls) {
  attempts++;
  
  const guess = guessInput.value;
  gameData.push([attempts, guess, cows, bulls]);

  // Create a new row for the results table
  const newRow = document.createElement('tr');
  const cell1 = document.createElement('td');
  const cell2 = document.createElement('td');
  const cell3 = document.createElement('td');
  const cell4 = document.createElement('td');

  cell1.textContent = attempts;
  cell2.textContent = guess;
  cell3.textContent = cows;
  cell4.textContent = bulls;

  newRow.appendChild(cell1);
  newRow.appendChild(cell2);
  newRow.appendChild(cell3);
  newRow.appendChild(cell4);
  resultsBody.appendChild(newRow);

  // Clear the input field and focus on it
  guessInput.value = '';
  guessInput.focus();
}

// Function to handle guess submission
function submitGuess() {
  const guess = parseInt(guessInput.value);
  
  if (isNaN(guess) || guess < 100 || guess > 999) {
    alert('Please enter a valid 3-digit number.');
    return;
  }

  const guessString = guess.toString();
  
  if (hasRepeatingDigits(guessString)) {
    alert('Digits in the guess should not repeat. Please enter a valid 3-digit number.');
    return;
  }

  if (!isValidInput(guessString)) {
    alert('Digits in the guess should not countain 0. Please enter a valid 3-digit number.');
    return;
  }

  const [cows, bulls] = checkGuess(guess);

  if (bulls === 3) {
    updateGameStatus(cows, bulls);
    // User guessed the correct number
    alert(`Congratulations! You guessed the correct number in ${attempts} attempts.`);
    submitBtn.disabled = true;
    
    // Start a new game and clear the input field
    setTimeout(() => {
      guessInput.value = '';
      newGame();
    }, 2000); // Delay for 2 seconds before starting a new game
  } else {
    // Update game status
    updateGameStatus(cows, bulls);

    if (attempts >= 10) {
      // User exceeded the maximum number of attempts
      alert(`Game over! The correct number was ${computerNumber}.`);
      submitBtn.disabled = true;
      
      // Start a new game and clear the input field
      setTimeout(() => {
        guessInput.value = '';
        newGame();
      }, 1000); // Delay for 2 seconds before starting a new game
    }
  }
}

// Function to start a new game
function newGame() {
  attempts = 0;
  gameData.length = 0;
  resultsBody.innerHTML = '';
  computerNumber = generateRandomNumber();
  submitBtn.disabled = false;
  guessInput.value = '';
  guessInput.focus();
}


function handleKeyDown(event) {
  if (event.key === 'Enter') {
    event.preventDefault();
    submitBtn.click();
  }
}

function hasRepeatingDigits(str) {
  return (/([0-9]).*?\1/).test(str);
}

// Validate the input guess
function isValidInput(guess) {
  return (/^[^0]{3}$/).test(guess);
}

document.addEventListener('DOMContentLoaded', function() {
    // Function to show instructions box
    function showInstructions() {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'flex';
    }

    // Function to close instructions box
    function closeInstructions() {
        const overlay = document.querySelector('.overlay');
        overlay.style.display = 'none';
    }

    // Event listener for "How to play?" link
    const howToPlayLink = document.querySelector('.how-to-play');
    howToPlayLink.addEventListener('click', function(event) {
        event.preventDefault();
        showInstructions();
    });

    // Event listener for close button
    const closeBtn = document.querySelector('.close-btn');
    closeBtn.addEventListener('click', closeInstructions);

    // Event listener for pressing the "Esc" key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeInstructions();
        }
    });
});
