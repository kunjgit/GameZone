const gameArea = document.getElementById('gameArea');
const tower = document.getElementById('tower');
const hangingBlock = document.getElementById('hangingBlock');
const dropButton = document.getElementById('dropButton');
const scoreElement = document.getElementById('score');

let blockPosition = 0;
let score = 0;

function dropBlock() {
    const rect = hangingBlock.getBoundingClientRect();
    const block = document.createElement('div');
    block.classList.add('block', 'falling');
    block.style.top = `${rect.top - gameArea.getBoundingClientRect().top}px`;
    block.style.left = `${rect.left - gameArea.getBoundingClientRect().left}px`;
    gameArea.appendChild(block);

    // Trigger the falling animation
    setTimeout(() => {
        block.style.top = `${gameArea.clientHeight - blockPosition - block.clientHeight}px`;
    }, 10);

    // Wait for the falling animation to complete
    setTimeout(() => {
        block.classList.remove('falling');
        tower.appendChild(block);
        block.style.bottom = `${blockPosition}px`;
        block.style.top = 'auto';
        blockPosition += 22;  // Adjust position for the next block

        // Update score
        score++;
        scoreElement.textContent = `Score: ${score}`;

        // Reset hanging block position
        hangingBlock.style.left = '50%';
        hangingBlock.style.transform = 'translateX(-50%)';

        // Check for balance and game over condition
        if (!isBalanced()) {
            alert(`Game Over! Your score: ${score}`);
            resetGame();
        }
    }, 510);  // Animation duration + small buffer
}

function isBalanced() {
    const blocks = tower.getElementsByClassName('block');
    for (let i = 0; i < blocks.length; i++) {
        const block = blocks[i];
        const left = parseFloat(block.style.left);
        if (left < 0 || left > (gameArea.clientWidth - block.clientWidth)) {
            return false;
        }
    }
    return true;
}

function resetGame() {
    tower.innerHTML = '';
    blockPosition = 0;
    score = 0;
    scoreElement.textContent = `Score: ${score}`;
}

dropButton.addEventListener('click', dropBlock);
