document.addEventListener('DOMContentLoaded', () => {
    const wordElement = document.getElementById('word');
    const guessInput = document.getElementById('guess');
    const submitButton = document.getElementById('submit');
    const messageElement = document.getElementById('message');
    const scoreElement = document.getElementById('score');

    // List of coding-related words
    const words = [
        'algorithm', 'debugging', 'compiler', 'syntax', 'variable',
        'function', 'iterator', 'object', 'inheritance', 'polymorphism',
        'repository', 'framework', 'exception', 'module', 'interface',
        'refactoring', 'dependency', 'frontend', 'backend'
    ];

    let correctWord;
    let missingIndex;
    let displayedWord;
    let score = 0;

    function getRandomWord() {
        const randomIndex = Math.floor(Math.random() * words.length);
        return words[randomIndex];
    }

    function startGame() {
        correctWord = getRandomWord();
        missingIndex = Math.floor(Math.random() * correctWord.length);
        displayedWord = correctWord.split('');
        displayedWord[missingIndex] = '_';
        wordElement.textContent = displayedWord.join('');
        messageElement.textContent = ''; // Clear previous messages
        messageElement.classList.remove('correct', 'incorrect'); // Remove previous classes
        document.body.classList.remove('bg-correct', 'bg-incorrect'); // Reset background color
    }

    function updateScore(points) {
        score += points;
        scoreElement.textContent = `Score: ${score}`;
    }

    function handleGuess() {
        const guessedLetter = guessInput.value.toLowerCase();
        if (guessedLetter === correctWord[missingIndex]) {
            displayedWord[missingIndex] = guessedLetter;
            wordElement.textContent = displayedWord.join('');
            messageElement.textContent = 'Correct!';
            messageElement.classList.add('correct'); // Add correct class
            document.body.classList.add('bg-correct'); // Apply light green background
            updateScore(20); // Add 20 points for a correct answer
            setTimeout(() => {
                startGame(); // Restart the game after 1 second
            }, 1000); // 1 second delay before starting a new game
        } else {
            messageElement.textContent = 'Incorrect, try again!';
            messageElement.classList.add('incorrect'); // Add incorrect class
            document.body.classList.add('bg-incorrect'); // Apply light red background
            updateScore(-10); // Subtract 10 points for a wrong answer
        }
        guessInput.value = '';
    }

    startGame();

    submitButton.addEventListener('click', handleGuess);
});
