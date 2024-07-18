const cells = Array.from(document.querySelectorAll('.cell'));

// Gives first 30 cells of tha game
const enemyCells = cells.slice(0, 64);

// Three bottom cells of the game
const playerCells = cells.slice(64);

// Audio controls
const bgMusic = new Audio();
bgMusic.src = './assets/bgMusic.mp3';
bgMusic.volume = 0.3;

const move = new Audio();
move.src = './assets/move.mp3';

const gameOver = new Audio();
gameOver.src = './assets/gameOver.wav';

const scoreDisplay = document.querySelector('.score');

let dropCount, speed, score;

// Minimum speed
let speedLimit = 175;
reset();

document.addEventListener('keydown', e => {
    if (!dropCount) {
        startGame();
    }
    // Player object
    const player = document.querySelector('.player');

    // If next cell is part of playerCells - we are good to go
    if (e.key === 'ArrowRight' && playerCells.includes(player.parentElement.nextElementSibling)) {
        // Starting at player div, get containing cell, from cell give next element sibling
        // and from that cell append the child of the player itself
        move.play();
        player.parentElement.nextElementSibling.appendChild(player);
    }

    if (e.key === 'ArrowLeft' && playerCells.includes(player.parentElement.previousElementSibling)) {
        // Starting at player div, get containing cell, from cell give next element sibling
        // and from that cell append the child of the player itself
        move.play();
        player.parentElement.previousElementSibling.appendChild(player);
    }
});

function reset() {
    // Reset game to default values
    dropCount = 0;
    speed = 800;
    score = 0;
    scoreDisplay.innerHTML = '0';

    // Clear cells
    cells.forEach(cell => cell.innerHTML = '');

    playerCells[1].innerHTML = '<div class="player"></div>';
}

function startGame() {
    bgMusic.play();
    reset();
    loop();
}

function loop() {
    let stopGame = false;
    // adjust the screen size Logic
    let cellsCalculate=window.innerWidth<600?6:8
    for (let i = enemyCells.length - 1; i >= 0; i--) {
        // From 29 till it reaches 0
        const cell = enemyCells[i];
        const nextCell = cells[i + cellsCalculate];
        const enemy = cell.children[0];

        // Continue and move on
        if (!enemy) {
            continue;
        }

        nextCell.appendChild(enemy);

        // Adding collision code
        if (playerCells.includes(nextCell)) {
            if (nextCell.querySelector('.player')) {
                stopGame = true;
            } else {
                score++;
                speed = Math.max(speedLimit, speed - 25);
                scoreDisplay.innerHTML = score;
                enemy.remove();
            }
        }
    }

    // Even drop count, add new enemy
    if (dropCount % 2 === 0) {
        // Get random position (array indexes for enemy cells)
        const position = Math.floor(Math.random() * 8);

        enemyCells[position].innerHTML = '<div class="enemy"></div>'
    }
    if (stopGame) {
        bgMusic.pause();
        gameOver.play();
        alert(`Good job, your score is: ${score}`);
        gameOver.addEventListener('ended', ()=>{
            reset();
        });
    } else {
        dropCount++;
        setTimeout(loop, speed);
    }
}
