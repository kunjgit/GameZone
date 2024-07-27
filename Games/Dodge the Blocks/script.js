const gameContainer = document.getElementById('gameContainer');
const player = document.getElementById('player');
const scoreDisplay = document.getElementById('score');

let score = 0;
let gameOver = false;

// Player movement
document.addEventListener('keydown', (e) => {
    const left = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
    if (e.key === 'ArrowLeft' && left > 0) {
        player.style.left = left - 10 + 'px';
    } else if (e.key === 'ArrowRight' && left < 270) {
        player.style.left = left + 10 + 'px';
    }
});

// Generate blocks
function createBlock() {
    const block = document.createElement('div');
    block.classList.add('block');
    block.style.left = Math.floor(Math.random() * 270) + 'px';
    gameContainer.appendChild(block);

    // Collision detection
    const blockInterval = setInterval(() => {
        const blockTop = parseInt(window.getComputedStyle(block).getPropertyValue('top'));
        const playerLeft = parseInt(window.getComputedStyle(player).getPropertyValue('left'));
        const playerRight = playerLeft + 30;
        const blockLeft = parseInt(block.style.left);
        const blockRight = blockLeft + 30;

        if (blockTop > 470 && blockTop < 500 && playerLeft < blockRight && playerRight > blockLeft) {
            gameOver = true;
            alert('Game Over! Final Score: ' + score);
            clearInterval(blockInterval);
            location.reload();
        }
    }, 10);

    // Remove block after it falls
    setTimeout(() => {
        block.remove();
    }, 3000);
}

// Update score
function updateScore() {
    if (!gameOver) {
        score++;
        scoreDisplay.textContent = 'Score: ' + score;
        setTimeout(updateScore, 1000);
    }
}

updateScore();
setInterval(createBlock, 1500);
