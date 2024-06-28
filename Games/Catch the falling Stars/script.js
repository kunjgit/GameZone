const gameContainer = document.getElementById('game-container');
const basket = document.getElementById('basket');
let score = 0;

document.addEventListener('mousemove', (event) => {
    const basketX = event.clientX - (basket.offsetWidth / 2);
    basket.style.left = `${basketX}px`;
});

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    star.style.left = `${Math.random() * window.innerWidth}px`;
    gameContainer.appendChild(star);
    moveStar(star);
}

function moveStar(star) {
    let starY = 0;
    const fallInterval = setInterval(() => {
        if (starY > window.innerHeight) {
            clearInterval(fallInterval);
            star.remove();
        } else {
            starY += 5;
            star.style.top = `${starY}px`;
            checkCollision(star);
        }
    }, 30);
}

function checkCollision(star) {
    const basketRect = basket.getBoundingClientRect();
    const starRect = star.getBoundingClientRect();
    if (
        starRect.bottom > basketRect.top &&
        starRect.top < basketRect.bottom &&
        starRect.right > basketRect.left &&
        starRect.left < basketRect.right
    ) {
        star.remove();
        score += 10;
        console.log(`Score: ${score}`);
    }
}

setInterval(createStar, 1000);
