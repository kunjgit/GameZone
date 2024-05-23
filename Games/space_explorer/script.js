const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 600;

const spaceship = {
    x: canvas.width / 2 - 20,
    y: canvas.height - 60,
    width: 40,
    height: 40,
    speed: 5,
    dx: 0
};

const stars = [];
const asteroids = [];
let score = 0;
let gameOver = false;

function drawSpaceship() {
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

function drawStars() {
    ctx.fillStyle = 'yellow';
    stars.forEach(star => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawAsteroids() {
    ctx.fillStyle = 'gray';
    asteroids.forEach(asteroid => {
        ctx.beginPath();
        ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        ctx.fill();
    });
}

function createStars() {
    const x = Math.random() * canvas.width;
    const y = 0;
    const radius = 5;
    stars.push({ x, y, radius });
}

function createAsteroids() {
    const x = Math.random() * canvas.width;
    const y = 0;
    const radius = 20;
    asteroids.push({ x, y, radius });
}

function moveStars() {
    stars.forEach((star, index) => {
        star.y += 3;
        if (star.y > canvas.height) {
            stars.splice(index, 1);
        }
    });
}

function moveAsteroids() {
    asteroids.forEach((asteroid, index) => {
        asteroid.y += 5;
        if (asteroid.y > canvas.height) {
            asteroids.splice(index, 1);
        }
    });
}

function moveSpaceship() {
    spaceship.x += spaceship.dx;

    // Wall detection
    if (spaceship.x < 0) {
        spaceship.x = 0;
    }
    if (spaceship.x + spaceship.width > canvas.width) {
        spaceship.x = canvas.width - spaceship.width;
    }
}

function detectCollision() {
    stars.forEach((star, index) => {
        if (
            spaceship.x < star.x + star.radius &&
            spaceship.x + spaceship.width > star.x &&
            spaceship.y < star.y + star.radius &&
            spaceship.y + spaceship.height > star.y
        ) {
            stars.splice(index, 1);
            score++;
            document.getElementById('score').textContent = 'Score: ' + score;
        }
    });

    asteroids.forEach(asteroid => {
        if (
            spaceship.x < asteroid.x + asteroid.radius &&
            spaceship.x + spaceship.width > asteroid.x &&
            spaceship.y < asteroid.y + asteroid.radius &&
            spaceship.y + spaceship.height > asteroid.y
        ) {
            gameOver = true;
        }
    });
}

function update() {
    if (!gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        drawSpaceship();
        drawStars();
        drawAsteroids();

        moveSpaceship();
        moveStars();
        moveAsteroids();
        detectCollision();

        requestAnimationFrame(update);
    } else {
        alert('Game Over! Your score: ' + score);
        resetGame();
    }
}

function resetGame() {
    score = 0;
    spaceship.x = canvas.width / 2 - 20;
    spaceship.y = canvas.height - 60;
    stars.length = 0;
    asteroids.length = 0;
    gameOver = false;
    document.getElementById('score').textContent = 'Score: 0';
    update();
}

function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        spaceship.dx = spaceship.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        spaceship.dx = -spaceship.speed;
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'ArrowLeft' || e.key === 'a') {
        spaceship.dx = 0;
    }
}

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

setInterval(createStars, 1000);
setInterval(createAsteroids, 2000);

update();
