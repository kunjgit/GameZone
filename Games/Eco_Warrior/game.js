let energy = 100;
let score = 0;
let level = 1;
let litterCount = 10;
let energyRegenRate = 1;
let timer;
let timeLeft = 60;

const energyElement = document.getElementById('energy');
const scoreElement = document.getElementById('score');
const levelElement = document.getElementById('level');
const timerElement = document.getElementById('timer');
const plantTreeButton = document.getElementById('plant-tree');
const upgradeButton = document.getElementById('upgrade');
const litterContainer = document.getElementById('litter');
const treesContainer = document.getElementById('trees');

function updateStats() {
    energyElement.textContent = energy;
    scoreElement.textContent = score;
    levelElement.textContent = level;
    timerElement.textContent = timeLeft;
    plantTreeButton.disabled = energy < 10;
    upgradeButton.disabled = score < 50;
}

function createLitter() {
    for (let i = 0; i < litterCount; i++) {
        const litter = document.createElement('div');
        litter.classList.add('litter');
        litter.style.top = `${Math.random() * 350}px`;
        litter.style.left = `${Math.random() * 750}px`;

        litter.addEventListener('click', () => {
            litter.remove();
            score += 10;
            updateStats();
            checkLevelCompletion();
        });

        litterContainer.appendChild(litter);
    }
}

function checkLevelCompletion() {
    if (litterContainer.children.length === 0) {
        clearInterval(timer);
        alert('Level Completed! Starting next level.');
        level++;
        litterCount += 5;
        timeLeft = 60 + (level - 1) * 10;
        createLitter();
        startTimer();
        updateStats();
    }
}

function plantTree() {
    if (energy < 10) return;

    const tree = document.createElement('div');
    tree.classList.add('tree');
    tree.style.top = `${Math.random() * 350}px`;
    tree.style.left = `${Math.random() * 750}px`;

    treesContainer.appendChild(tree);
    energy -= 10;
    score += 20;
    updateStats();
}

function upgrade() {
    if (score < 50) return;
    score -= 50;
    energyRegenRate += 0.5;
    updateStats();
}

function startTimer() {
    timer = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            updateStats();
        } else {
            clearInterval(timer);
            alert('Game Over! You ran out of time.');
            resetGame();
        }
    }, 1000);
}

function resetGame() {
    energy = 100;
    score = 0;
    level = 1;
    litterCount = 10;
    energyRegenRate = 1;
    timeLeft = 60;
    litterContainer.innerHTML = '';
    treesContainer.innerHTML = '';
    createLitter();
    startTimer();
    updateStats();
}

plantTreeButton.addEventListener('click', plantTree);
upgradeButton.addEventListener('click', upgrade);

setInterval(() => {
    if (energy < 100) {
        energy = Math.min(100, energy + energyRegenRate);
        updateStats();
    }
}, 1000);

createLitter();
startTimer();
updateStats();
