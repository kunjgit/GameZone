const words = {
    "happy": ["joyful", "cheerful", "content", "pleased", "blissful"],
    "angry": ["furious", "irate", "enraged", "mad", "annoyed"],
    "sad": ["unhappy", "sorrowful", "melancholy", "gloomy", "mournful"],
    "fast": ["quick", "speedy", "swift", "rapid", "brisk"],
    "smart": ["intelligent", "clever", "bright", "sharp", "wise"],
    "big": ["large", "huge", "gigantic", "massive", "enormous"],
    "small": ["tiny", "little", "miniature", "compact", "petite"],
    "strong": ["powerful", "sturdy", "robust", "tough", "solid"],
    "weak": ["fragile", "frail", "feeble", "delicate", "brittle"],
    "cold": ["chilly", "freezing", "icy", "frigid", "frosty"],
    "hot": ["warm", "boiling", "scorching", "blazing", "fiery"],
    "beautiful": ["gorgeous", "stunning", "lovely", "attractive", "radiant"],
    "ugly": ["unattractive", "hideous", "unsightly", "plain", "homely"],
    "brave": ["courageous", "fearless", "valiant", "bold", "heroic"],
    "scared": ["afraid", "frightened", "terrified", "petrified", "panicked"],
    "funny": ["humorous", "amusing", "hilarious", "comical", "entertaining"],
    "boring": ["dull", "tedious", "uninteresting", "monotonous", "dry"]
};


let currentWord = "Happy";
let score = 0;
let timeLeft = 60;
let interval;
let userCorrectAnswer = [];
document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".start-container").style.display = "block"
    document.querySelector(".play").style.display = "none"
    document.querySelector(".end-container").style.display = "none"
})

function startGame() {
    score = 0;
    timeLeft = 60;
    userCorrectAnswer = [];
    document.getElementById("user-provided").innerText = "";
    document.querySelector(".play").style.display = "block"
    document.querySelector(".start-container").style.display = "none"
    document.getElementById('score').innerText = "Score: " + score;
    document.getElementById('time').innerText = timeLeft;
    document.getElementById('feedback').innerText = "";
    document.getElementById('synonym-input').value = "";
    currentWord = getRandomWord();
    document.getElementById('word').innerText = currentWord;
    clearInterval(interval);
    interval = setInterval(updateTimer, 1000);
}

function updateTimer() {
    timeLeft--;
    document.getElementById('time').innerText = timeLeft;
    if (timeLeft <= 0) {
        clearInterval(interval);
        endGame();
    }
}

function getRandomWord() {
    const keys = Object.keys(words);
    return keys[Math.floor(Math.random() * keys.length)];
}

function checkSynonym() {
    const input = document.getElementById('synonym-input').value.trim().toLowerCase();
    if (input == "") {
        alert("Please enter a synonym!")
        return;
    }
    if (words[currentWord].includes(input)) {
        if (userCorrectAnswer.includes(input)) {
            document.getElementById('feedback').innerText = `You have already entered "${input}". Try again!`;
            return;
        }
        score += 10;
        userCorrectAnswer.push(input);
        document.getElementById("user-provided").innerText = "Your answers - " + userCorrectAnswer.toString();
        document.getElementById('feedback').innerText = `"${input}" is correct! +10 points`;
    } else {
        document.getElementById('feedback').innerText = `"${input}" is not a synonym. Try again!`;
    }
    document.getElementById('score').innerText = "Score: " + score;
    document.getElementById('synonym-input').value = "";
}

function endGame() {
    document.querySelector(".play").style.display = "none"
    document.querySelector(".end-container").style.display = "block"
    document.querySelector(".start-container").style.display = "none"
    document.getElementById('final-feedback').innerText = `Time's up! Your final score is ${score}.`;
    userCorrectAnswer
}

function playAgain() {
    document.querySelector(".play").style.display = "none"
    document.querySelector(".end-container").style.display = "none"
    document.querySelector(".start-container").style.display = "block"
    userCorrectAnswer = []
}