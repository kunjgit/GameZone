// Define your word puzzle and other game data
const puzzle = {
    word: "WHEEL OF FORTUNE",
    category: "TV Show",
};

let currentRound = 1;
let playerScore = 0;
let wheelSpinning = false;
let wheelRotation=0;
let wheelSpeed=5000;
let spinButtonClicked=false;

// Function to spin the wheel
function spinWheel() {
    if (!wheelSpinning) {
        // If the Spin button has not been clicked before, show the hint paragraph
        if (!spinButtonClicked) {
            document.getElementById('hint-para').textContent = `Hint: ${getHint(puzzle.word)}`;
            document.getElementById('hint-para').style.display = 'block';
            spinButtonClicked = true;
        }

        //Display a message to enter the guessed word
        document.getElementById('result-text').textContent="Test your Fortune!!"

        // Clear the guess input field each time the "Spin" button is clicked
        document.getElementById('guess-input').value = '';

        // Reset the player's score to 0
        playerScore = 0;
        document.getElementById('score-display').textContent = playerScore;

        // Add the "spinning" class to start the animation
        wheel.classList.add('spinning');

        // Disable spin button during spinning
        document.getElementById('spin-button').disabled = true;

        // Show the "Enter a letter" input
        document.getElementById('guess-input').style.display = 'block'; // Show the button

        // Simulate a delay to stop the animation after 1.25 second
        setTimeout(() => {
            // Remove the "spinning" class to stop the animation
            wheel.classList.remove('spinning');

            // Enable the spin button again
            document.getElementById('spin-button').disabled = false;

            // Calculate the winning segment based on the final rotation angle
            const winningSegmentIndex = Math.floor(wheelRotation % 360 / (360 / segments.length));
            const winningSegment = segments[winningSegmentIndex];

            // Extract the data-value attribute to determine the outcome
            const segmentValue = parseInt(winningSegment.getAttribute('data-value'));

            // Implement logic to update the game state based on the winning segment and its value
            if (!isNaN(segmentValue)) {
                // Update player's score
                playerScore += segmentValue;
                // Update the display of the player's score (you need an HTML element for this)
                document.getElementById('score-display').textContent = playerScore;
            } else if (winningSegment.classList.contains('bankrupt')) {
                // Handle bankrupt outcome (e.g., reset the player's score)
                playerScore = 0;
                // Update the display of the player's score
                document.getElementById('score-display').textContent = playerScore;
            } else if (winningSegment.classList.contains('lose-turn')) {
                // Handle lose-turn outcome (e.g., skip the player's turn)
                // Implement logic to pass the turn and update the game state
                passTurn();
            }
        }, 1250); // 1.25 seconds delay
    }
}

// Function to get a hint about the puzzle word
function getHint(word) {
    const lettersCount = word.replace(/ /g, '').length;
    const spacesCount = word.split(' ').length - 1;
    return `Number of Letters: ${lettersCount}, Number of Spaces: ${spacesCount}`;
}

// Function to handle guessing a letter
function guessLetter() {
    const letter = document.getElementById('guess-input').value.toUpperCase();

    // Check if the guessed letter is in the puzzle word
    let found = false;
    for (let i = 0; i < puzzle.word.length; i++) {
        if (puzzle.word[i] === letter) {
            // Mark the letter as found
            found = true;
            break;
        }
    }

    // Update the player's score and display based on your game rules
    if (found) {
        // Implement your scoring logic (e.g., assign points per correct letter)
        const pointsPerLetter = 100; // Adjust this value as needed
        playerScore += pointsPerLetter;
        document.getElementById('score-display').textContent = playerScore;
        
        // Set the result text to "Correct guess" here, outside of the loop
        document.getElementById('result-text').textContent = 'Correct guess';
    } else {
        // Implement your logic for incorrect guesses
        // For example, you can deduct points or take other actions
        const pointsDeducted = 50; // Adjust this value as needed
        playerScore -= pointsDeducted;
        document.getElementById('score-display').textContent = playerScore;

        // Set the result text to "Incorrect guess" for incorrect guesses
        document.getElementById('result-text').textContent = 'Incorrect guess';
    }

    // Clear the guess input field
    document.getElementById('guess-input').value = '';
}




// Function to solve the puzzle
function solvePuzzle() {
    const solution = document.getElementById('guess-input').value.toUpperCase();

    // Check if the solution matches the puzzle word
    if (solution === puzzle.word) {
        // Correct solution
        // You can implement your logic for winning the round or game here

        // For example, you can update the result text and congratulate the player
        document.getElementById('result-text').textContent = 'Congratulations! You solved the puzzle!';
        
        // Update the player's score based on your rules (e.g., add bonus points)
        const bonusPoints = 500; // Adjust this value as needed
        playerScore += bonusPoints;
        document.getElementById('score-display').textContent = playerScore;

        // You can also implement logic to start the bonus round or end the game
        // For example, startBonusRound() or endGame()
    } else {
        // Incorrect solution
        // Implement your logic for handling an incorrect solution here

        // For example, you can deduct points or take other actions
        const pointsDeducted = 100; // Adjust this value as needed
        playerScore -= pointsDeducted;
        document.getElementById('score-display').textContent = playerScore;

        // Clear the guess input field
        document.getElementById('guess-input').value = '';

        // You can also display a message to inform the player that the solution was incorrect
        document.getElementById('result-text').textContent = 'Incorrect solution. Keep guessing!';
    }
}

// Function to pass the turn
function passTurn() {
    // Implement logic to pass the turn and update the game state
    // For example, you can simply clear the guess input field and proceed to the next player's turn or round.
    
    // Clear the guess input field
    document.getElementById('guess-input').value = '';

    // Reset the player's score to 0
    playerScore = 0;
    document.getElementById('score-display').textContent = playerScore;

    // You can also update any necessary game state variables, such as current player or round.
    // For example, if you have multiple players, you can switch to the next player here.

    // Additionally, you can update any UI elements or messages to indicate the turn has been passed.
    const resultText = document.getElementById('result-text');
    resultText.textContent = 'Turn passed to the next player'; // Display a message

    // Finally, if there are specific game rules or conditions related to passing the turn, implement them here.
}


// Event listeners for buttons
document.getElementById('spin-button').addEventListener('click', spinWheel);
document.getElementById('guess-button').addEventListener('click', guessLetter);
document.getElementById('solve-button').addEventListener('click', solvePuzzle);
document.getElementById('pass-button').addEventListener('click', passTurn);

// Other game logic, such as initializing the game, displaying the puzzle board, etc.
