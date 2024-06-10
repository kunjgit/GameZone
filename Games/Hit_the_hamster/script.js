document.addEventListener('DOMContentLoaded', () => {
    const startButton = document.getElementById('start-button');
    const hamster = document.getElementById('hamster');
    const scoreBoard = document.getElementById('score');
    const timerDisplay = document.getElementById('time');

    let score = 0;
    let timeLeft = 30; // 30 seconds timer
    let gameInterval;
    let timerInterval;

    hamster.style.display = 'none'; // Hide hamster initially

    startButton.addEventListener('click', startGame);

    hamster.addEventListener('click', () => {
        score += 1;
        scoreBoard.textContent = `Score: ${score}`;
        moveHamster();
    });

    function moveHamster() {
        const gridContainer = document.getElementById('grid-container');
        const cellWidth = gridContainer.clientWidth / 6;
        const cellHeight = gridContainer.clientHeight / 6;

        const randomX = Math.floor(Math.random() * 6) * cellWidth;
        const randomY = Math.floor(Math.random() * 6) * cellHeight;

        hamster.style.left = `${randomX + (cellWidth - hamster.clientWidth) / 2}px`;
        hamster.style.top = `${randomY + (cellHeight - hamster.clientHeight) / 2}px`;
    }

    function startGame() {
        score = 0;
        timeLeft = 30;
        scoreBoard.textContent = `Score: ${score}`;
        timerDisplay.textContent = `Time: ${timeLeft}s`;
        hamster.style.display = 'block'; // Show hamster

        moveHamster();

        gameInterval = setInterval(moveHamster, 1000); // move the hamster every second
        timerInterval = setInterval(updateTimer, 1000); // update the timer every second

        startButton.disabled = true; // Disable start button during the game
    }

    function updateTimer() {
        timeLeft -= 1;
        timerDisplay.textContent = `Time: ${timeLeft}s`;

        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            clearInterval(timerInterval);
            hamster.style.display = 'none'; // Hide hamster when game ends
            alert(`Game over! Your score is ${score}.`);
            startButton.disabled = false; // Enable start button for a new game
        }
    }
});
