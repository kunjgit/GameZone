function instructions() {
    Swal.fire({
        title: 'Instructions',
        text: 'Use the arrow keys to move the snake and eat the square boxes.',
        icon: 'info',
        confirmButtonText: 'Got it!',
        customClass: {
            confirmButton: 'sweet-alert-button'
        }
    });
}

// Game requirements
let inputDir = { x: 0, y: 0 };
let direction = { x: 0, y: 0 };
let speed = 10;
let score = 0;
let lastPaintTime = 0;
let snakeArr = [{ x: Math.round(2 + 16 * Math.random()), y: Math.round(2 + 16 * Math.random()) }];
let food = { x: 6, y: 7 };
let foodSound = new Audio('./assets/food.mp3');
let gameOverSound = new Audio('./assets/gameover.mp3');
let moveSound = new Audio('./assets/move.mp3');
let musicSound = new Audio('./assets/music.mp3');

// Game Function
function isCollide(snakeArr) {
    // Self Bump 
    for (let index = 1; index < snakeArr.length; index++) {
        if (snakeArr[index].x === snakeArr[0].x && snakeArr[index].y === snakeArr[0].y) {
            return true;
        }
    }
    if (snakeArr[0].x >= 18 || snakeArr[0].x <= 0 || snakeArr[0].y >= 18 || snakeArr[0].y <= 0) {
        return true;
    }
}

function gameEngine() {
    // Part 1: Update Snake Array
    if (isCollide(snakeArr)) {
        gameOverSound.play();
        musicSound.pause();
        inputDir = { x: 0, y: 0 };
        Swal.fire({
            title: 'Game Over',
            text: 'Press the button to play again',
            icon: 'error',
            confirmButtonText: 'Restart',
            customClass: {
                confirmButton: 'sweet-alert-button'
            }
        }).then((result) => {
            if (result.isConfirmed) {
                window.location.reload();
            }
        });
        snakeArr = [{ x: 13, y: 15 }];
        musicSound.play();
        score = 0;
    }

    // On eating food increment food and regenerate food
    if (snakeArr[0].x === food.x && snakeArr[0].y === food.y) {
        foodSound.play();
        score += 1;
        if (score > hiscoreval) {
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            HiScore.innerHTML = "HighScore: " + hiscoreval;
        }
        scoreBox.innerHTML = ("Score: " + score);
        snakeArr.unshift({ x: snakeArr[0].x + inputDir.x, y: snakeArr[0].y + inputDir.y });
        let a = 2;
        let b = 16;
        food = { x: Math.round(a + (b - a) * Math.random()), y: Math.round(a + (b - a) * Math.random()) };
    }

    // Moving the snake
    for (let i = snakeArr.length - 2; i >= 0; i--) {
        snakeArr[i + 1] = { ...snakeArr[i] };
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;

    // Part 2: Render the snake and food
    // Snake
    board.innerHTML = "";
    snakeArr.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('head');
        } else {
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
}

function main(ctime) {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}

// Main Logic Starts Here
let hiscore = localStorage.getItem('hiscore');
if (hiscore === null) {
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
} else {
    hiscoreval = JSON.parse(hiscore);
    HiScore.innerHTML = ("HighScore: " + hiscoreval);
}
window.requestAnimationFrame(main);
window.addEventListener("keydown", function (e) {
    musicSound.play();
    inputDir = { x: 0, y: 1 };
    moveSound.play();
    switch (e.key) {
        case "ArrowUp":
            inputDir.x = 0;
            inputDir.y = -1;
            break;
        case "ArrowDown":
            inputDir.x = 0;
            inputDir.y = 1;
            break;
        case "ArrowLeft":
            inputDir.x = -1;
            inputDir.y = 0;
            break;
        case "ArrowRight":
            inputDir.x = 1;
            inputDir.y = 0;
            break;
        default:
            break;
    }
});
