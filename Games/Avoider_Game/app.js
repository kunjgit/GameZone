const cells = Array.from(document.querySelectorAll('.cell'));

// Gives first 30 cells of tha gamw
const enemyCells = cells.slice(0, 30);
// Three bottom cells of the game
const playerCells = cells.slice(30);

const scoreDisplay = document.querySelector('.score');

let dropCount, speed, score;

// Minimum speed
let speedLimit = 150
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
        player.parentElement.nextElementSibling.appendChild(player);
    }

    if (e.key === 'ArrowLeft' && playerCells.includes(player.parentElement.previousElementSibling)) {
        // Starting at player div, get containing cell, from cell give next element sibling
        // and from that cell append the child of the player itself
        player.parentElement.previousElementSibling.appendChild(player);
    }

})

function reset() {
    // Reset game to default values
    dropCount = 0;
    speed = 800;
    score = 0;
    scoreDisplay.innerHTML = '0';

    // Clear cells
    cells.forEach(cell => cell.innerHTML = '')

    playerCells[1].innerHTML = '<div class="player"></div>'
}

function startGame() {
    reset();
    loop();
}

function loop() {
    let stopGame = false;

    for (let i = enemyCells.length - 1; i >= 0; i--) {
        // From 29 till it reaches 0
        const cell = enemyCells[i];
        const nextCell = cells[i + 3];
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
        const position = Math.floor(Math.random() * 3);

        enemyCells[position].innerHTML = '<div class="enemy"></div>'
    }

    if (stopGame) {
        alert(`Good job, your score is: ${score}`);
        reset();
    } else {
        dropCount++;
        setTimeout(loop, speed);
    }

}