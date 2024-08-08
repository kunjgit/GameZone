const words = ['happy', 'smart', 'exciting', 'beautiful', 'strong'];
const synonyms = {
    happy: ['joyful', 'content', 'cheerful', 'delighted'],
    smart: ['intelligent', 'clever', 'bright', 'sharp'],
    exciting: ['thrilling', 'stimulating', 'exhilarating', 'electrifying'],
    beautiful: ['gorgeous', 'stunning', 'lovely', 'pretty'],
    strong: ['powerful', 'sturdy', 'tough', 'robust']
};

let currentWordIndex = 0;
let score = 0;
let time = 60;
let timer;

function startGame() {
    displayWord();
    timer = setInterval(updateTime, 1000);
}

function displayWord() {
    document.getElementById('word').textContent = words[currentWordIndex];
}

function submitSynonym() {
    const input = document.getElementById('synonymInput').value.trim().toLowerCase();
    const currentWord = words[currentWordIndex].toLowerCase();
    
    if (synonyms[currentWord].includes(input)) {
        score++;
        document.getElementById('score').textContent = score;
    }

    document.getElementById('synonymInput').value = '';

    // Move to the next word or end game
    currentWordIndex++;
    if (currentWordIndex < words.length) {
        displayWord();
    } else {
        endGame();
    }
}

function updateTime() {
    time--;
    document.getElementById('time').textContent = time;
    if (time === 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    alert(`Game Over! Your score is ${score}`);
    resetGame();
}

function resetGame() {
    currentWordIndex = 0;
    score = 0;
    time = 60;
    document.getElementById('score').textContent = score;
    document.getElementById('time').textContent = time;
    displayWord();
}

// Initialize the game
startGame();
