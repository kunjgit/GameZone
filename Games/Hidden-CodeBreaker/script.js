const levels = [
    {
        words: ["HTML", "CSS", "JAVASCRIPT", "PYTHON", "JAVA"],
        clues: ["The structure of a webpage", "The style of a webpage", "The language used for web development", "A popular programming language for data science", "A versatile programming language"]
    },
    {
        words: ["RUBY", "PHP", "NODEJS", "REACT", "ANGULAR"],
        clues: ["A programming language known for its simplicity", "A server-side scripting language", "A JavaScript runtime built on Chrome's V8 JavaScript engine", "A JavaScript library for building user interfaces", "A platform and framework for building single-page client applications"]
    },
    {
        words: ["VUE", "DATABASE", "MYSQL", "MONGODB", "POSTGRESQL"],
        clues: ["A progressive JavaScript framework", "A structured set of data held in a computer", "An open-source relational database management system", "A cross-platform document-oriented database program", "A powerful, open-source object-relational database system"]
    },
    {
        words: ["ALGORITHM", "DATASTRUCTURE", "COMPLEXITY", "INHERITANCE", "ABSTRACTION"],
        clues: ["A set of rules or instructions for solving a problem", "A particular way of organizing and storing data in a computer so that it can be accessed and modified efficiently", "The state or quality of being intricate or complicated", "A mechanism of reusing code in object-oriented programming", "A fundamental principle in object-oriented programming"]
    },
    {
        words: ["ENCAPSULATION", "POLYMORPHISM", "RECURSION", "ITERATION", "STACK"],
        clues: ["The bundling of data with the methods that operate on that data", "The ability of a single function or method to operate on multiple types of data", "A programming technique in which a function calls itself", "A repetitive process that repeats a set of instructions until a specified condition, known as the termination condition, is met", "A data structure that follows the Last In, First Out (LIFO) principle"]
    }
];

let currentLevel = 0;
let hiddenWord = '';
let revealedLetters = [];
let lives = 5;

function initializeGame() {
    if (currentLevel < levels.length) {
        const currentLevelData = levels[currentLevel];
        const randomIndex = Math.floor(Math.random() * currentLevelData.words.length);
        hiddenWord = currentLevelData.words[randomIndex];
        revealedLetters = new Array(hiddenWord.length).fill(false);
        displayWord();
        displayLetters();
        displayClue(randomIndex);
        updateLivesDisplay();
    } else {
        showMessage("Congratulations! You've completed all levels.");
    }
}

function displayWord() {
    const wordContainer = document.getElementById('wordContainer');
    wordContainer.innerHTML = '';
    for (let i = 0; i < hiddenWord.length; i++) {
        if (revealedLetters[i]) {
            wordContainer.innerHTML += `<span>${hiddenWord[i]}</span>`;
        } else {
            wordContainer.innerHTML += `<span>_</span>`;
        }
    }
}

function displayLetters() {
    const lettersContainer = document.getElementById('letters');
    lettersContainer.innerHTML = '';
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let letter of alphabet) {
        lettersContainer.innerHTML += `<div class="letter" onclick="revealLetter('${letter}')">${letter}</div>`;
    }
}

function displayClue(index) {
    const clueText = document.getElementById('clueText');
    const currentLevelData = levels[currentLevel];
    clueText.textContent = currentLevelData.clues[index];
}

function revealLetter(letter) {
    let found = false;
    for (let i = 0; i < hiddenWord.length; i++) {
        if (hiddenWord[i] === letter) {
            revealedLetters[i] = true;
            found = true;
        }
    }
    displayWord();
    if (found) {
        if (revealedLetters.every((val) => val === true)) {
            showMessage("Congratulations! You've guessed the word.");
            setTimeout(() => {
                nextWord();
            }, 2000);
        }
    } else {
        lives--;
        updateLivesDisplay();
        if (lives === 0) {
            showMessage("Game Over. You've run out of lives.");
        } else {
            showMessage("Incorrect letter. Try again.");
        }
    }
}

function showMessage(message) {
    const resultMessage = document.getElementById('resultMessage');
    resultMessage.textContent = message;
}

function updateLivesDisplay() {
    const livesCount = document.getElementById('livesCount');
    livesCount.textContent = lives;
}

function nextWord() {
    lives = 5; // Reset lives for the next word
    currentLevel++;
    initializeGame();
}

function resetGame() {
    currentLevel = 0;
    lives = 5;
    initializeGame();
    showMessage('');
}

// Start the game
initializeGame();
