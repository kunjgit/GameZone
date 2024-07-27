const game = document.getElementById('game');
const basket = document.getElementById('basket');
const starsContainer = document.getElementById('stars-container');
const scoreDisplay = document.getElementById('score');
const gameOverDisplay = document.getElementById('game-over');

let score = 0;
let gameInterval;
let starFallInterval;
let starSpeed = 0.1;


document.addEventListener('keydown', moveBasket);

function moveBasket(event) {
    const basketRect = basket.getBoundingClientRect();
    const gameRect = game.getBoundingClientRect();
    const step = 200; // Number of pixels to move per key press

    if (event.key === 'ArrowLeft')
        {
            if (basketRect.left - step > gameRect.left) {
                basket.style.left = basket.offsetLeft - step + 'px';
            } else{
                basket.style.left = (gameRect.left + 10) + 'px';
            }
        }
    if (event.key === 'ArrowRight')
         if (basketRect.right + step < gameRect.right){
                basket.style.left = basket.offsetLeft + step + 'px';
         }
        else{
            basket.style.left = (gameRect.right - basket.getBoundingClientRect().width - 10) + 'px';
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
            star.style.top = starRect.top - 30 + 'px';
        }
    });
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
    gameInterval = setInterval(fallStars, 10);
    creation = setInterval(createStar, 1000 - (score * 10)); //More stars as score goes up
    starFallInterval = setInterval(() => { starSpeed ; }, 10);
}

function endGame() {
    clearInterval(creation);
    clearInterval(gameInterval);
    clearInterval(starFallInterval);
    gameOverDisplay.style.display = 'block';
}

startGame();
