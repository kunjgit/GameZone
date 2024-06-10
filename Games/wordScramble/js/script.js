const wordText = document.querySelector(".word");
hintText = document.querySelector(".hint span");
timeText = document.querySelector(".time b");
const scoreText = document.querySelector(".score b");
const livesText = document.querySelector(".lives b");
inputField = document.querySelector("input");
refreshBtn = document.querySelector(".refresh-word");
checkBtn = document.querySelector(".check-word");
const hintBtn = document.querySelector(".hint-btn");
const levelText = document.querySelector(".level b");

const gameOverPopup = document.getElementById("gameOverPopup");
const finalScoreElem = document.getElementById("finalScore");
const finalLevelElem = document.getElementById("finalLevel");
const gameOverBtn = document.getElementById("gameOverBtn");

let correctWord, timer, score = 0, lives = 3, hintUsed = false, level = 1;
let correctAnswersInLevel = 0;
let timeLeft = 30;

const correctSound = new Audio('assets/correct.mp3');
const incorrectSound = new Audio('assets/incorrect.mp3');
const timeoutSound = new Audio('assets/timeout.mp3');
const clappingSound = new Audio('assets/game_over.mp3');


const initTimer = maxTime => {
    clearInterval(timer);
    timer = setInterval(() => {
        if(maxTime > 0) {
            maxTime--;
            return timeText.innerText = maxTime;
        }
        clearInterval(timer);
        timeoutSound.play(); // Play timeout sound
        alert(`Time's up!!! ${correctWord.toUpperCase()} was the correct word`);
        loselife();
    }, 1000);
}

const initGame = () => {
    if(lives == 0) {
        showGameOverPopup();
        return;
    }

    if (correctAnswersInLevel == 5) {
        level++;
        timeLeft -= 10;
        levelText.innerText = level;
        correctAnswersInLevel = 0;
        alert(`Congratulations! You've advanced to level ${level}`);
    }


    initTimer(timeLeft); // time decrease as the level incereases
    let randomObj = words[Math.floor(Math.random() * words.length)]; //getting random objects
    let wordArray = randomObj.word.split("") //splitting each letter 
    for (let i = wordArray.length - 1 ; i > 0; i--){
        let j = Math.floor(Math.random() * (i + 1)); //getting random number
        // swapping wordArray letters randomly
        [wordArray[i], wordArray[j]] = [wordArray[j], wordArray[i]];
    }
    wordText.innerText = wordArray.join("");
    hintText.innerText = randomObj.hint;
    correctWord = randomObj.word.toLowerCase();
    inputField.value = "";
    inputField.setAttribute("maxlength", correctWord.length);
    hintUsed = false;
}

const checkWord = () => {
    let userWord = inputField.value.toLocaleLowerCase();
    if(!userWord) return alert("Please enter a word to check"); // if no input enterd
    
    // if not matched with the correct word 
    if(userWord !== correctWord){
        incorrectSound.play();
        alert(`Oops! ${userWord} is not a correct word`);
        loselife();
    }
    // if matched with the correct word
    else{
        correctSound.play();
        alert(`Congrats! ${userWord.toUpperCase()} is a correct word`);
        score += 10;
        correctAnswersInLevel++;
        scoreText.innerText = score;
        initGame();
    }
}

const loselife = () => {
    lives--;
    livesText.innerText = lives;
    if (lives == 0) {
        showGameOverPopup();
    } else {
        initGame();
    }
}

const showGameOverPopup = () => {
    clappingSound.play();
    finalScoreElem.innerText = score;
    finalLevelElem.innerText = level;
    gameOverPopup.style.display = 'flex';
}

const resetGame = () => {
    score = 0;
    lives = 3;
    level = 1;
    correctAnswersInLevel = 0;
    timeLeft = 30;
    scoreText.innerText = score;
    livesText.innerText = lives;
    levelText.innerText = level;
    initGame();
}

const giveHint = () => {
    if (hintUsed) {
        alert("You can only use the hint once!");
        return;
    }
    let userWord = inputField.value.toLowerCase();
    for (let i = 0; i < correctWord.length; i++) {
        if (userWord[i] !== correctWord[i]) {
            inputField.value = userWord.slice(0, i) + correctWord[i] + userWord.slice(i + 1);
            hintUsed = true;
            break;
        }
    }
}

refreshBtn.addEventListener("click", initGame);
checkBtn.addEventListener("click", checkWord);
hintBtn.addEventListener("click", giveHint);

// Event listener for the game over button
gameOverBtn.addEventListener("click", () => {
    // Redirect to the welcome page (index.html)
    window.location.href = 'index.html';
});

// Event listener for Enter key press
inputField.addEventListener("keypress", event => {
    if (event.key === "Enter") {
        checkWord();
    }
});


document.addEventListener("DOMContentLoaded", initGame);