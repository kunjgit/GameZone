const words = ["javascript", "python", "programming", "developer", "computer"];
let currentWord = '';
let scrambledWord = '';
let score = 0;

function scrambleWord(word) {
    let scrambled = word.split('').sort(() => 0.5 - Math.random()).join('');
    return scrambled;
}

function pickRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    scrambledWord = scrambleWord(currentWord);
    document.getElementById('scrambled-word').innerText = scrambledWord;
}

function checkGuess() {
    const guess = document.getElementById('guess').value.toLowerCase();
    if (guess === currentWord) {
        document.getElementById('result-message').innerText = `Correct! The word was "${currentWord}".`;
        score += 10;
        document.getElementById('score').innerText = score;
        document.getElementById('next-word').style.display = 'inline-block';
        document.getElementById('submit-guess').disabled = true;
        document.getElementById('give-up').disabled = true;
    } else {
        document.getElementById('result-message').innerText = "Incorrect, try again.";
        score -= 2;
        document.getElementById('score').innerText = score;
    }
}

function giveUp() {
    document.getElementById('result-message').innerText = `The correct word was "${currentWord}".`;
    document.getElementById('next-word').style.display = 'inline-block';
    document.getElementById('submit-guess').disabled = true;
    document.getElementById('give-up').disabled = true;
}

document.getElementById('submit-guess').addEventListener('click', checkGuess);
document.getElementById('give-up').addEventListener('click', giveUp);
document.getElementById('next-word').addEventListener('click', () => {
    document.getElementById('guess').value = '';
    document.getElementById('result-message').innerText = '';
    document.getElementById('next-word').style.display = 'none';
    document.getElementById('submit-guess').disabled = false;
    document.getElementById('give-up').disabled = false;
    pickRandomWord();
});

pickRandomWord();
