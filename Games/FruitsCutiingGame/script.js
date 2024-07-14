
const fruits = [
    'apple.png',
    'orange.png',
    'banana.png',
    'graphes.png',
    'papaya.png',
    'watermelon.png',
    'mango.png'

];

let score = 0;
let gameTime = 0;
let gameRunning = false;
let gameInterval;

function startGame() {
    gameRunning = true;
    document.querySelector('.start-button').style.display = 'none'; // Hide start button
    const gameContainer = document.querySelector('.game-container');
    gameContainer.addEventListener('mousemove', moveKnife);

    function moveKnife(event) {
        const knife = document.querySelector('.knife');
        knife.style.left = event.clientX - knife.offsetWidth / 2 + 'px';
        knife.style.top = event.clientY - knife.offsetHeight / 2 + 'px';
    }

    function createFruit() {
        if (!gameRunning) return;

        const fruit = document.createElement('div');
        fruit.classList.add('fruit');
        const randomFruit = fruits[Math.floor(Math.random() * fruits.length)];
        fruit.style.backgroundImage = `url('${randomFruit}')`;
        fruit.style.left = Math.random() * (window.innerWidth - 100) + 'px';
        fruit.style.top = '0px';
        gameContainer.appendChild(fruit);

        moveFruit(fruit);
    }

    gameInterval = setInterval(createFruit, 1000);
    setTimeout(endGame, 30000);
    setInterval(updateGameTime, 1000);

    document.getElementById('backgroundMusic').play(); // Start background music
}

function moveFruit(fruitElement) {
    let position = 0;
    const interval = setInterval(() => {
        if (!gameRunning) {
            clearInterval(interval);
            return;
        }

        position += 20;
        fruitElement.style.top = position + 'px';

        const knife = document.querySelector('.knife');
        if (knife && checkCollision(fruitElement, knife)) {
            fruitElement.style.backgroundImage = 'none';
            fruitElement.style.backgroundColor = 'red';
            fruitElement.style.borderRadius = '50%'; // Make it a small circle

            score++;
            document.getElementById('score').textContent = score;
            playCutSound(); // Play sound effect

            setTimeout(() => {
                fruitElement.remove();
            }, 100);
        }

        if (position >= window.innerHeight) {
            fruitElement.remove();
        }
    }, 20);
}

function playCutSound() {
    const cutSound = document.getElementById('cutSound');
    cutSound.currentTime = 0; // Reset sound to start
    cutSound.play();
}

function checkCollision(fruit, knife) {
    const fruitRect = fruit.getBoundingClientRect();
    const knifeRect = knife.getBoundingClientRect();

    return !(
        fruitRect.right < knifeRect.left ||
        fruitRect.left > knifeRect.right ||
        fruitRect.bottom < knifeRect.top ||
        fruitRect.top > knifeRect.bottom
    );
}

function updateGameTime() {
    gameTime++;
}

function endGame() {
    gameRunning = false;
    clearInterval(gameInterval);
    document.getElementById('backgroundMusic').pause();
    document.querySelector('.play-again').style.display = 'block';
    alert(`Game Over! Your score: ${score} in ${gameTime} seconds.`);
}

function startNewGame() {
    score = 0;
    gameTime = 0;
    gameRunning = true;
    document.getElementById('score').textContent = score;
    document.querySelector('.play-again').style.display = 'none';
    startGame();
}
