const targetColor = document.getElementById('target-color');
const userColor = document.getElementById('user-color');
const redSlider = document.getElementById('red-slider');
const greenSlider = document.getElementById('green-slider');
const blueSlider = document.getElementById('blue-slider');
const submitColor = document.getElementById('submit-color');
const gameOver = document.getElementById('game-over');
const newHighScore = document.getElementById('new-high-score');
const restartButton = document.getElementById('restart-button');
const timerSpan = document.getElementById('timer');
const accuracySpan = document.getElementById('accuracy');
const scoreSpan = document.getElementById('score');
const highScoreSpan = document.getElementById('high-score');
const stageElement = document.getElementById('stage');

let targetColorValue;
let stage = 1;
let timer;
let remainingTime;
let score = 0;
let highScore = 0;

function generateRandomColor() {
    return {
        r: Math.floor(Math.random() * 256),
        g: Math.floor(Math.random() * 256),
        b: Math.floor(Math.random() * 256),
    };
}

function setColor(element, color) {
    element.style.backgroundColor = `rgb(${color.r}, ${color.g}, ${color.b})`;
}

function resetGame() {
    stage = 1;
    stageElement.textContent = `Stage ${stage}`;
    clearTimeout(timer);
    remainingTime = 30;
    timerSpan.textContent = remainingTime;
    score = 0;
    scoreSpan.textContent = score;
    newHighScore.style.display = 'none';
    gameOver.style.display = 'none';
    submitColor.disabled = false;
    redSlider.value = 0;
    greenSlider.value = 0;
    blueSlider.value = 0;
    setColor(userColor, { r: 0, g: 0, b: 0 });
    startGame();
}

function startGame() {
    targetColorValue = generateRandomColor();
    setColor(targetColor, targetColorValue);
    remainingTime = Math.max(30 - (stage - 1) * 5, 5);
    timerSpan.textContent = remainingTime;
    timer = setInterval(() => {
        remainingTime--;
        timerSpan.textContent = remainingTime;
        if (remainingTime === 0) {
            clearInterval(timer);
            submitColor.disabled = true;
            gameOver.style.display = 'block';
            if (score > highScore) {
                highScore = score;
                highScoreSpan.textContent = highScore;
                newHighScore.style.display = 'block';
            }
        }
    }, 1000);
}

function calculateAccuracy(target, user) {
    const diffR = Math.abs(target.r - user.r);
    const diffG = Math.abs(target.g - user.g);
    const diffB = Math.abs(target.b - user.b);
    const totalDiff = diffR + diffG + diffB;
    const maxDiff = 255 * 3;
    return 100 - Math.floor((totalDiff / maxDiff) * 100);
}

redSlider.addEventListener('input', () => {
    setColor(userColor, { r: redSlider.value, g: greenSlider.value, b: blueSlider.value });
});

greenSlider.addEventListener('input', () => {
    setColor(userColor, { r: redSlider.value, g: greenSlider.value, b: blueSlider.value });
});

blueSlider.addEventListener('input', () => {
    setColor(userColor, { r: redSlider.value, g: greenSlider.value, b: blueSlider.value });
});

submitColor.addEventListener('click', () => {
    const userColorValue = {
        r: parseInt(redSlider.value),
        g: parseInt(greenSlider.value),
        b: parseInt(blueSlider.value),
    };
    const accuracy = calculateAccuracy(targetColorValue, userColorValue);
    accuracySpan.textContent = `${accuracy}%`;
    if (remainingTime === 30) {
        score = accuracy;
    } else {
        score += Math.floor((remainingTime / 30) * accuracy);
    }
    scoreSpan.textContent = score;
    if (remainingTime > 0) {
        stage++;
        stageElement.textContent = `Stage ${stage}`;
        clearInterval(timer);
        remainingTime = Math.max(30 - (stage - 1) * 5, 5);
        timerSpan.textContent = remainingTime;
        startGame();
    }
});

restartButton.addEventListener('click', () => {
    resetGame();
});

startGame();

