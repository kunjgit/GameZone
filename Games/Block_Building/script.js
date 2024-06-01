let gameArea = document.getElementById('gameArea');
let scoreDisplay = document.getElementById('score');
let score = 0;
let blockWidth = 60;
let blockHeight = 20;
let blockSpeed = 2;
let blockInterval = null;
let gameOver = false;

function startGame() {
    gameArea.innerHTML = '';
    score = 0;
    scoreDisplay.textContent = 'Score: ' + score;
    gameOver = false;
    addBlock();
    blockInterval = setInterval(moveBlock, 10);
}

function addBlock() {
    let block = document.createElement('div');
    block.className = 'block';
    block.style.top = '0px';
    block.style.left = (gameArea.offsetWidth - blockWidth) / 2 + 'px';
    gameArea.appendChild(block);
}

function moveBlock() {
    let blocks = document.getElementsByClassName('block');
    if (blocks.length > 0) {
        let block = blocks[blocks.length - 1];
        let top = parseInt(block.style.top);
        block.style.top = top + blockSpeed + 'px';

        if (top + blockHeight >= gameArea.offsetHeight) {
            clearInterval(blockInterval);
            gameOver = true;
            alert('Game Over! Your score is: ' + score);
        }
    }
}

function dropBlock() {
    if (gameOver) return;

    let blocks = document.getElementsByClassName('block');
    if (blocks.length > 0) {
        let block = blocks[blocks.length - 1];
        let top = parseInt(block.style.top);

        if (top + blockHeight < gameArea.offsetHeight) {
            let newBlock = block.cloneNode();
            newBlock.style.top = '0px';
            gameArea.appendChild(newBlock);
            score++;
            scoreDisplay.textContent = 'Score: ' + score;
        } else {
            gameOver = true;
            alert('Game Over! Your score is: ' + score);
        }
    }
}

gameArea.addEventListener('click', dropBlock);
window.onload = startGame;
