const spaceship = document.getElementById('spaceship');
const asteroid = document.getElementById('asteroid');
const scoreElement = document.getElementById('score');
const livesElement = document.getElementById('lives');

let score = 0;
let lives = 3;

document.addEventListener('keydown', (e) => {
    const spaceshipRect = spaceship.getBoundingClientRect();
    const containerRect = document.querySelector('.game-container').getBoundingClientRect();

    if (e.key === 'ArrowLeft') {
        spaceship.style.left = `${Math.max(spaceshipRect.left - 20, containerRect.left)}px`;
    } else if (e.key === 'ArrowRight') {
        spaceship.style.left = `${Math.min(spaceshipRect.left + 20, containerRect.right - spaceshipRect.width)}px`;
    }
});

function updateAsteroid() {
    let asteroidLeft = Math.floor(Math.random() * (window.innerWidth - 30));
    asteroid.style.left = `${asteroidLeft}px`;
    asteroid.style.top = `-30px`;

    let interval = setInterval(() => {
        let asteroidRect = asteroid.getBoundingClientRect();
        let spaceshipRect = spaceship.getBoundingClientRect();
        
        if (asteroidRect.top > window.innerHeight) {
            score += 10;
            scoreElement.textContent = `Score: ${score}`;
            asteroid.style.top = `-30px`;
            asteroid.style.left = `${Math.floor(Math.random() * (window.innerWidth - 30))}px`;
        } else {
            asteroid.style.top = `${asteroidRect.top + 5}px`;
        }

        if (asteroidRect.bottom > spaceshipRect.top && 
            asteroidRect.right > spaceshipRect.left && 
            asteroidRect.left < spaceshipRect.right) {
            lives -= 1;
            livesElement.textContent = `Lives: ${lives}`;
            asteroid.style.top = `-30px`;
            asteroid.style.left = `${Math.floor(Math.random() * (window.innerWidth - 30))}px`;
        }

        if (lives <= 0) {
            clearInterval(interval);
            alert('Game Over!');
        }
    }, 20);
}

setInterval(updateAsteroid, 100);
