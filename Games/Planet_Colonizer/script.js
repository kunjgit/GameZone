document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const startScreen = document.getElementById('start-screen');
    const gameContainer = document.getElementById('game-container');
    const planetsContainer = document.getElementById('planets-container');
    const scoreDisplay = document.getElementById('score');
    const timeLeftDisplay = document.getElementById('time-left');
    const resetButton = document.getElementById('reset-button');

    let score = 0;
    let timeLeft = 30;
    let timer;

    const createPlanets = (num) => {
        for (let i = 0; i < num; i++) {
            const planet = document.createElement('div');
            planet.classList.add('planet');
            planetsContainer.appendChild(planet);
            planet.addEventListener('click', () => {
                if (!planet.classList.contains('colonized')) {
                    planet.classList.add('colonized');
                    score++;
                    scoreDisplay.textContent = score;
                    playSound();
                }
            });
        }
    };

    const startGame = () => {
        score = 0;
        timeLeft = 30;
        scoreDisplay.textContent = score;
        timeLeftDisplay.textContent = timeLeft;
        planetsContainer.innerHTML = '';
        createPlanets(15);
        startScreen.classList.add('hidden');
        gameContainer.classList.remove('hidden');
        startTimer();
    };

    const resetGame = () => {
        clearInterval(timer);
        startGame();
    };

    const startTimer = () => {
        timer = setInterval(() => {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(timer);
                alert('Game Over! Your score is: ' + score);
            }
        }, 1000);
    };

    const playSound = () => {
        const audio = new Audio('click-sound.mp3');
        audio.play();
    };

    startButton.addEventListener('click', startGame);
    resetButton.addEventListener('click', resetGame);
});
