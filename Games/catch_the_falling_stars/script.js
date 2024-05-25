const gameContainer = document.querySelector('.game-container');
const basket = document.getElementById('basket');
const scoreElement = document.getElementById('score');
let score = 0;
let basketPosition = gameContainer.offsetWidth / 2 - basket.offsetWidth / 2;
let missedStars = 0;
const maxMissedStars = 3;
let gameInterval;

document.addEventListener('keydown', moveBasket);

function moveBasket(event) {
    const key = event.key;
    if (key === 'ArrowLeft' && basketPosition > 0) {
        basketPosition -= 20;
    } else if (key === 'ArrowRight' && basketPosition < gameContainer.offsetWidth - basket.offsetWidth) {
        basketPosition += 20;
    }
    basket.style.left = basketPosition + 'px';
}

function createStar() {
    if (missedStars >= maxMissedStars) {
        clearInterval(gameInterval);
        displayGameOver();
        return;
    }

    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = Math.random() * (gameContainer.offsetWidth - 20) + 'px';
    gameContainer.appendChild(star);
    moveStar(star);
}

function moveStar(star) {
    let starPosition = 0;
    const starFall = setInterval(() => {
        if (starPosition > gameContainer.offsetHeight - basket.offsetHeight - 20 && 
            star.offsetLeft > basketPosition && 
            star.offsetLeft < basketPosition + basket.offsetWidth) {
            star.remove();
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            clearInterval(starFall);
        } else if (starPosition > gameContainer.offsetHeight - 20) {
            star.remove();
            missedStars++;
            if (missedStars >= maxMissedStars) {
                clearInterval(starFall);
                clearInterval(gameInterval);
                displayGameOver();
            } else {
                clearInterval(starFall);
            }
        } else {
            starPosition += 5;
            star.style.top = starPosition + 'px';
        }
    }, 50);
}

function displayGameOver() {
    const gameOverMessage = document.createElement('div');
    gameOverMessage.style.position = 'absolute';
    gameOverMessage.style.top = '50%';
    gameOverMessage.style.left = '50%';
    gameOverMessage.style.transform = 'translate(-50%, -50%)';
    gameOverMessage.style.color = 'red';
    gameOverMessage.style.fontSize = '32px';
    gameOverMessage.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    gameOverMessage.style.padding = '20px';
    gameOverMessage.style.borderRadius = '10px';
    gameOverMessage.textContent = `Game Over! Final Score: ${score}`;
    gameContainer.appendChild(gameOverMessage);
}

gameInterval = setInterval(createStar, 1000);
