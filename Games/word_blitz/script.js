const alphabetSets = [
    { letters: ['a', 'm', 'n', 't', 'e'], words: ['meant', 'mate', 'team', 'man', 'mean', 'ten', 'tan', 'tea', 'at', 'an', 'am', 'net', 'met', 'ate', 'mat'] },
    { letters: ['m', 'a', 'l', 'i'], words: ['mail', 'aim', 'am', 'ail'] },
    { letters: ['f', 'a', 'm', 'l', 'y', 'i'], words: ['family', 'flamy', 'filmy', 'fail', 'mail', 'ail', 'aim', 'am', 'lay', 'my', 'fly', 'fam', 'film', 'may'] },
    { letters: ['c', 'p', 'l', 'a', 'y'], words: ['clap', 'play', 'clay', 'lay', 'pay', 'ply', 'lac', 'pac'] },
    { letters: ['s', 'm', 'p', 'i', 'l', 'e', 't'], words: ['simple', 'emits', 'melts', 'miles', 'limps', 'piles', 'piles', 'smile', 'smelt', 'slip', 'slept', 'pet', 'pit', 'lip', 'lips', 'tile', 'lie', 'tie', 'lie', 'slime', 'time', 'emit', 'slit', 'tip', 'tips', 'sit', 'set', 'pie', 'met', 'is', 'it'] }

];

let currentSet;
let score = 0;
const timerElement = document.getElementById('time');
const alphabetSetElement = document.getElementById('alphabet-set');
const wordInput = document.getElementById('word-input');
const checkButton = document.getElementById('check-button');
const scoreElement = document.getElementById('score');
const wordListElement = document.getElementById('word-list');

function displayAlphabetSet() {
    const randomIndex = Math.floor(Math.random() * alphabetSets.length);
    currentSet = alphabetSets[randomIndex];
    alphabetSetElement.textContent = `Alphabets: ${currentSet.letters.join(', ')}`;
}

function updateScore() {
    score++;
    scoreElement.textContent = `Score: ${score}`;
}

function checkWord() {
    const userWord = wordInput.value.trim().toLowerCase();
    if (currentSet.words.includes(userWord)) {
        updateScore();
        displayWordInList(userWord);
        wordInput.value = '';
    } else {
        alert("Try again!");
    }
}

function displayWordInList(word) {
    const li = document.createElement('li');
    li.textContent = word;
    wordListElement.appendChild(li);
}

function startTimer(duration) {
    let time = duration;
    const timer = setInterval(function () {
        time--;
        timerElement.textContent = time;
        if (time <= 0) {
            clearInterval(timer);
            alert("Time's up!");
        }
    }, 1000);
}

checkButton.addEventListener('click', checkWord);

function startGame() {
    displayAlphabetSet();
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
    wordListElement.innerHTML = '';
    const duration = 30;
    startTimer(duration);
}

startGame();
