const words = ["apple", "banana", "cat", "dog", "elephant", "fish", "grape", "hat", "ice cream", "jacket", "kangaroo", "lemon", "monkey", "nest", "orange", "penguin", "queen", "rabbit", "snake", "tiger", "umbrella", "violet", "watermelon", "xylophone", "yak", "zebra"];

let prevWord = "";
let currentWord = "";

function startGame() {
    // Randomly select a word to start the game
    prevWord = words[Math.floor(Math.random() * words.length)];
    setMessage(`Start with the word: ${prevWord.toUpperCase()}`, "black");
}

function checkAssociation() {
    currentWord = document.getElementById("wordInput").value.toLowerCase();

    if (!currentWord) {
        setMessage("Please enter a word.", "red");
        return;
    }

    if (currentWord[0] !== prevWord[prevWord.length - 1]) {
        setMessage(`The word should start with the letter '${prevWord[prevWord.length - 1]}'. Try again.`, "red");
        return;
    }

    if (!words.includes(currentWord)) {
        setMessage("That word is not recognized. Try another word.", "red");
        return;
    }

    setMessage(`Good job! '${currentWord.toUpperCase()}' is associated with '${prevWord.toUpperCase()}'.`, "green");
    prevWord = currentWord;
    document.getElementById("wordInput").value = "";
}

function setMessage(msg, color) {
    document.getElementById("message").style.color = color;
    document.getElementById("message").textContent = msg;
}

// Start the game when the page loads
startGame();
