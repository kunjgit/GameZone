let gameArea = document.getElementById('game-area');
let scoreElement = document.getElementById('score');
let timeElement = document.getElementById('time');
let startButton = document.getElementById('start-button');
let caughtMessage;

let score = 0;
let time = 60;
let gameInterval;
let timerInterval;
let maxCreatures = 5;

startButton.addEventListener('click', startGame);

function startGame() {
    score = 0;
    time = 60;
    scoreElement.textContent = score;
    timeElement.textContent = time;
    startButton.disabled = true;

    while (gameArea.firstChild) {
        gameArea.removeChild(gameArea.firstChild);
    }

    caughtMessage = document.createElement('div');
    caughtMessage.className = 'caught-message';
    caughtMessage.textContent = 'Caught!';
    gameArea.appendChild(caughtMessage);

    gameInterval = setInterval(gameLoop, 1000 / 60);
    timerInterval = setInterval(updateTimer, 1000);
    spawnCreatures(maxCreatures);
}

function updateTimer() {
    time--;
    timeElement.textContent = time;

    if (time <= 0) {
        clearInterval(gameInterval);
        clearInterval(timerInterval);
        alert('Game Over! Your score is ' + score);
        startButton.disabled = false;
    }
}

function spawnCreatures(number) {
    for (let i = 0; i < number; i++) {
        spawnCreature();
    }
}

function spawnCreature() {
    let creature = document.createElement('div');
    creature.className = 'creature';

    let creatureIndex = Math.floor(Math.random() * 7) + 1;
    creature.style.backgroundImage = `url('assets/creature${creatureIndex}.png')`;
    creature.style.backgroundSize = 'contain';
    creature.style.backgroundRepeat = 'no-repeat';

    let sizeCategory = Math.random();
    if (sizeCategory < 0.33) {
        creature.style.width = '200px';
        creature.style.height = '200px';
        creature.dataset.points = '5';
    } else if (sizeCategory < 0.66) {
        creature.style.width = '150px';
        creature.style.height = '150px';
        creature.dataset.points = '10';
    } else {
        creature.style.width = '100px';
        creature.style.height = '100px';
        creature.dataset.points = '15';
    }

    creature.style.left = Math.random() * (gameArea.clientWidth - parseInt(creature.style.width)) + 'px';
    creature.style.top = Math.random() * (gameArea.clientHeight - parseInt(creature.style.height)) + 'px';

    creature.addEventListener('click', () => {
        score += parseInt(creature.dataset.points);
        scoreElement.textContent = score;
        caughtMessage.style.left = creature.style.left;
        caughtMessage.style.top = creature.style.top;
        caughtMessage.style.display = 'block';

        setTimeout(() => {
            caughtMessage.style.display = 'none';
        }, 5000);

        creature.remove();
        spawnCreature();
    });

    gameArea.appendChild(creature);

    setTimeout(() => {
        if (creature.parentElement === gameArea) {
            creature.remove();
            spawnCreature();
        }
    }, 5000);
}

function gameLoop() {

}