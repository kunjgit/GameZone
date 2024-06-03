// script.js
const guardian = document.getElementById('guardian');
const orb = document.getElementById('orb');
const creatures = document.getElementById('creatures');
const scoreBoard = document.getElementById('score');
const levelBoard = document.getElementById('level');

let score = 0;
let level = 1;
let gameInterval;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

// Function to start the game
function startGame() {
    placeOrb();
    placeCreatures();
    gameInterval = setInterval(updateGame, 20);
}

// Function to update game elements
function updateGame() {
    moveGuardian();
    moveCreatures();
    checkCollisions();
}

// Function to move the guardian
function moveGuardian() {
    let left = parseInt(window.getComputedStyle(guardian).left);
    let top = parseInt(window.getComputedStyle(guardian).top);
    if (moveLeft && left > 0) {
        guardian.style.left = left - 5 + 'px';
    }
    if (moveRight && left < window.innerWidth - 50) {
        guardian.style.left = left + 5 + 'px';
    }
    if (moveUp && top > 0) {
        guardian.style.top = top - 5 + 'px';
    }
    if (moveDown && top < window.innerHeight - 50) {
        guardian.style.top = top + 5 + 'px';
    }
}

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = true;
    if (e.key === 'ArrowRight') moveRight = true;
    if (e.key === 'ArrowUp') moveUp = true;
    if (e.key === 'ArrowDown') moveDown = true;
});

document.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') moveLeft = false;
    if (e.key === 'ArrowRight') moveRight = false;
    if (e.key === 'ArrowUp') moveUp = false;
    if (e.key === 'ArrowDown') moveDown = false;
});

// Function to place the orb at a random position
function placeOrb() {
    orb.style.top = Math.random() * (window.innerHeight - 100) + 'px';
    orb.style.left = Math.random() * (window.innerWidth - 30) + 'px';
}

// Function to place creatures at random positions
function placeCreatures() {
    creatures.innerHTML = '';
    for (let i = 0; i < level; i++) {
        let creature = document.createElement('div');
        creature.className = 'creature';
        creature.style.top = Math.random() * (window.innerHeight - 40) + 'px';
        creature.style.left = Math.random() * (window.innerWidth - 40) + 'px';
        creatures.appendChild(creature);
    }
}

// Function to move creatures
function moveCreatures() {
    let creatureElements = document.querySelectorAll('.creature');
    creatureElements.forEach(creature => {
        let top = parseInt(window.getComputedStyle(creature).top);
        creature.style.top = top + 2 + 'px';
        if (top > window.innerHeight) {
            creature.style.top = '-40px';
            creature.style.left = Math.random() * (window.innerWidth - 40) + 'px';
        }
    });
}

// Function to check collisions
function checkCollisions() {
    // Check collision with orb
    let guardianRect = guardian.getBoundingClientRect();
    let orbRect = orb.getBoundingClientRect();
    if (
        guardianRect.x < orbRect.x + orbRect.width &&
        guardianRect.x + guardianRect.width > orbRect.x &&
        guardianRect.y < orbRect.y + orbRect.height &&
        guardianRect.y + guardianRect.height > orbRect.y
    ) {
        score += 10;
        scoreBoard.textContent = 'Score: ' + score;
        placeOrb();
        if (score % 50 === 0) {
            level++;
            levelBoard.textContent = 'Level: ' + level;
            placeCreatures();
        }
    }

    // Check collision with creatures
    let creatureElements = document.querySelectorAll('.creature');
    creatureElements.forEach(creature => {
        let creatureRect = creature.getBoundingClientRect();
        if (
            guardianRect.x < creatureRect.x + creatureRect.width &&
            guardianRect.x + guardianRect.width > creatureRect.x &&
            guardianRect.y < creatureRect.y + creatureRect.height &&
            guardianRect.y + guardianRect.height > creatureRect.y
        ) {
            clearInterval(gameInterval);
            alert('Game Over! Your score: ' + score);
            resetGame();
        }
    });
}

// Function to reset the game
function resetGame() {
    score = 0;
    level = 1;
    scoreBoard.textContent = 'Score: ' + score;
    levelBoard.textContent = 'Level: ' + level;
    startGame();
}

// Start the game initially
startGame();
