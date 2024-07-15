// script.js

document.addEventListener('DOMContentLoaded', (event) => {
    const targetShape = document.getElementById('target-shape');
    const scoreBoard = document.getElementById('score-board');
    const startButton = document.getElementById('start-button');
    let score = 0;
    let gameInterval;

    function getRandomPosition() {
        const containerRect = document.body.getBoundingClientRect();
        const x = Math.floor(Math.random() * (containerRect.width - 50));
        const y = Math.floor(Math.random() * (containerRect.height - 50));
        return { x, y };
    }

    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    function getRandomSize() {
        return Math.floor(Math.random() * 50) + 30;
    }

    function moveShape() {
        const { x, y } = getRandomPosition();
        const color = getRandomColor();
        const size = getRandomSize();
        targetShape.style.left = `${x}px`;
        targetShape.style.top = `${y}px`;
        targetShape.style.backgroundColor = color;
        targetShape.style.width = `${size}px`;
        targetShape.style.height = `${size}px`;
    }

    function startGame() {
        score = 0;
        scoreBoard.innerText = `Score: ${score}`;
        targetShape.style.display = 'block';
        gameInterval = setInterval(moveShape, 1000);
    }

    function stopGame() {
        clearInterval(gameInterval);
        targetShape.style.display = 'none';
    }

    targetShape.addEventListener('click', () => {
        score++;
        scoreBoard.innerText = `Score: ${score}`;
        moveShape();
    });

    startButton.addEventListener('click', startGame);
});
