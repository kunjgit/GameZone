let score = 0;
let highScore = 0;

const bottle = document.getElementById('bottle');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');
const restartButton = document.getElementById('restart');
const flipSound = document.getElementById('flip-sound');
const successSound = document.getElementById('success-sound');
const failSound = document.getElementById('fail-sound');

bottle.addEventListener('click', flipBottle);
restartButton.addEventListener('click', restartGame);

function flipBottle() {
    const isSuccessfulFlip = Math.random() > 0.5;

    // Play flip sound
    flipSound.play();

    // Apply flip animation
    bottle.style.transform = 'rotate(720deg)';
    bottle.style.bottom = '100px';

    setTimeout(() => {
        // Reset bottle position
        bottle.style.transform = 'rotate(0deg)';
        bottle.style.bottom = '0';

        if (isSuccessfulFlip) {
            score++;
            scoreDisplay.textContent = score;
            successSound.play();
            if (score > highScore) {
                highScore = score;
                highScoreDisplay.textContent = highScore;
            }
        } else {
            failSound.play();
            alert('Flip failed! Try again.');
        }
    }, 500);
}

function restartGame() {
    score = 0;
    scoreDisplay.textContent = score;
}
