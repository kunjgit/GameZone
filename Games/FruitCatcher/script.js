const game = document.getElementById('game');
const basket = document.getElementById('basket');
const starsContainer = document.getElementById('stars-container');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let score = 0;
let gameInterval;
let starFallInterval;
let starSpeed = 2;

document.addEventListener('keydown', moveBasket);

function moveBasket(event) {
    const basketRect = basket.getBoundingClientRect();
    if (event.key === 'ArrowLeft' && basketRect.left > 0) {
        basket.style.left = basketRect.left - 20 + 'px';
    }
    if (event.key === 'ArrowRight' && basketRect.right < game.clientWidth) {
        basket.style.left = basketRect.left + 20 + 'px';
    }
}

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * (game.clientWidth - 20) + 'px';
    starsContainer.appendChild(star);
}

function fallStars() {
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => {
        const starRect = star.getBoundingClientRect();
        if (starRect.top + starSpeed >= game.clientHeight) {
            endGame();
        } else if (checkCollision(basket, star)) {
            star.remove();
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        } else {
            star.style.top = starRect.top + starSpeed + 'px';
        }
    });
    if (Math.random() < 0.1) createStar();
}

function checkCollision(basket, star) {
    const basketRect = basket.getBoundingClientRect();
    const starRect = star.getBoundingClientRect();
    return !(
        basketRect.top > starRect.bottom ||
        basketRect.right < starRect.left ||
        basketRect.bottom < starRect.top ||
        basketRect.left > starRect.right
    );
}

function startGame() {
    gameInterval = setInterval(fallStars, 20);
    starFallInterval = setInterval(() => { starSpeed += 0.1; }, 1000);
}

function endGame() {
    clearInterval(gameInterval);
    clearInterval(starFallInterval);
    gameOverDisplay.style.display = 'block';
}

startGame();
