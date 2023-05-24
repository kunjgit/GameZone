const gameBoard = document.querySelector("#gameBoard");

const ctx = gameBoard.getContext("2d");

const scoreText = document.querySelector("#scoreText");

const resetBtn = document.querySelector("#resetBtn");

const gameWidth = gameBoard.width;

const gameHeight = gameBoard.height;

const boardBackground = "white";

const snakeColor = "lightgreen";

const snakeBorder = "black";

const foodColor = "red";

const unitSize = 25;

let running = false;

let xVelocity = unitSize;

let yVelocity = 0;

let foodX;

let foodY;

let score = 0;

let snake = [

    { x: unitSize * 4, y: 0 },

    { x: unitSize * 3, y: 0 },

    { x: unitSize * 2, y: 0 },

    { x: unitSize, y: 0 },

    { x: 0, y: 0 }

];



window.addEventListener("keydown", changeDirection);

resetBtn.addEventListener("click", resetGame);



gameStart();



function gameStart() {

    running = true;

    scoreText.textContent = score;

    createFood();

    drawFood();

    nextTick();

};

function nextTick() {

    if (running) {

        setTimeout(() => {

            clearBoard();

            drawFood();

            moveSnake();

            drawSnake();

            checkGameOver();

            nextTick();

        }, 75);

    }

    else {

        displayGameOver();

    }

};

function clearBoard() {

    ctx.fillStyle = boardBackground;

    ctx.fillRect(0, 0, gameWidth, gameHeight);

};

function createFood() {

    function randomFood(min, max) {

        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;

        return randNum;

    }

    foodX = randomFood(0, gameWidth - unitSize);

    foodY = randomFood(0, gameWidth - unitSize);

};

function drawFood() {

    ctx.fillStyle = foodColor;

    ctx.fillRect(foodX, foodY, unitSize, unitSize);

};

function moveSnake() {

    const head = {
        x: snake[0].x + xVelocity,

        y: snake[0].y + yVelocity
    };



    snake.unshift(head);

    //if food is eaten

    if (snake[0].x == foodX && snake[0].y == foodY) {

        score += 1;

        scoreText.textContent = score;

        createFood();

    }

    else {

        snake.pop();

    }

};

function drawSnake() {

    ctx.fillStyle = snakeColor;

    ctx.strokeStyle = snakeBorder;

    snake.forEach(snakePart => {

        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);

        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);

    })

};

function changeDirection(event) {

    const keyPressed = event.keyCode;

    const LEFT = 37;

    const UP = 38;

    const RIGHT = 39;

    const DOWN = 40;



    const goingUp = (yVelocity == -unitSize);

    const goingDown = (yVelocity == unitSize);

    const goingRight = (xVelocity == unitSize);

    const goingLeft = (xVelocity == -unitSize);



    switch (true) {

        case (keyPressed == LEFT && !goingRight):

            xVelocity = -unitSize;

            yVelocity = 0;

            break;

        case (keyPressed == UP && !goingDown):

            xVelocity = 0;

            yVelocity = -unitSize;

            break;

        case (keyPressed == RIGHT && !goingLeft):

            xVelocity = unitSize;

            yVelocity = 0;

            break;

        case (keyPressed == DOWN && !goingUp):

            xVelocity = 0;

            yVelocity = unitSize;

            break;

    }

};

function checkGameOver() {

    switch (true) {

        case (snake[0].x < 0):

            running = false;

            break;

        case (snake[0].x >= gameWidth):

            running = false;

            break;

        case (snake[0].y < 0):

            running = false;

            break;

        case (snake[0].y >= gameHeight):

            running = false;

            break;

    }

    for (let i = 1; i < snake.length; i += 1) {

        if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {

            running = false;

        }

    }

};

function displayGameOver() {

    ctx.font = "50px MV Boli";

    ctx.fillStyle = "black";

    ctx.textAlign = "center";

    ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 2);

    running = false;

};

function resetGame() {

    score = 0;

    xVelocity = unitSize;

    yVelocity = 0;

    snake = [

        { x: unitSize * 4, y: 0 },

        { x: unitSize * 3, y: 0 },

        { x: unitSize * 2, y: 0 },

        { x: unitSize, y: 0 },

        { x: 0, y: 0 }

    ];

    gameStart();

};