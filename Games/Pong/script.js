const canvas = document.getElementById('pongCanvas');
const context = canvas.getContext('2d');

const paddleWidth = 10, paddleHeight = 100;
const ballRadius = 10;
let upArrowPressed = false, downArrowPressed = false;
let gamePaused = true;

const player = {
    x: 0,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    score: 0
};

const computer = {
    x: canvas.width - paddleWidth,
    y: canvas.height / 2 - paddleHeight / 2,
    width: paddleWidth,
    height: paddleHeight,
    color: '#fff',
    score: 0
};

const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: ballRadius,
    speed: 5,
    velocityX: 5,
    velocityY: 5,
    color: '#05EDFF'
};

let difficultyLevel = 'easy'; // Default difficulty level

function drawRect(x, y, w, h, color) {
    context.fillStyle = color;
    context.fillRect(x, y, w, h);
}

function drawCircle(x, y, r, color) {
    context.fillStyle = color;
    context.beginPath();
    context.arc(x, y, r, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
}

function drawText(text, x, y, color, font = '35px Arial') {
    context.fillStyle = color;
    context.font = font;
    context.fillText(text, x, y);
}

function render() {
    drawRect(0, 0, canvas.width, canvas.height, '#000');

    drawText(player.score, canvas.width / 4, canvas.height / 5, '#fff');
    drawText(computer.score, 3 * canvas.width / 4, canvas.height / 5, '#fff');

    drawRect(player.x, player.y, player.width, player.height, player.color);
    drawRect(computer.x, computer.y, computer.width, computer.height, computer.color);

    drawCircle(ball.x, ball.y, ball.radius, ball.color);
}

function movePaddles() {
    if (upArrowPressed && player.y > 0) {
        player.y -= 8;
    } else if (downArrowPressed && (player.y < canvas.height - player.height)) {
        player.y += 8;
    }

   
    let computerSpeed = 6; 
    switch (difficultyLevel) {
        case 'easy':
            computerSpeed = 6;
            break;
        case 'medium':
            computerSpeed = 8;
            break;
        case 'hard':
            computerSpeed = 10;
            break;
        default:
            computerSpeed = 6;
    }

    let computerY = computer.y + computer.height / 2;
    if (ball.y < computerY - 10) {
        computer.y -= computerSpeed;
    } else if (ball.y > computerY + 10) {
        computer.y += computerSpeed;
    }
    if (computer.y < 0) {
        computer.y = 0;
    } else if (computer.y + computer.height > canvas.height) {
        computer.y = canvas.height - computer.height;
    }
}

function update() {
    if (!gamePaused) {
        movePaddles();

        ball.x += ball.velocityX;
        ball.y += ball.velocityY;

        // Adjust ball speed based on difficulty level
        switch (difficultyLevel) {
            case 'easy':
                ball.speed = 7;
                break;
            case 'medium':
                ball.speed = 10;
                break;
            case 'hard':
                ball.speed = 15;
                break;
            default:
                ball.speed = 7;
        }

        if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
            ball.velocityY = -ball.velocityY;
        }

        let playerPaddle = (ball.x < canvas.width / 2) ? player : computer;

        if (collision(ball, playerPaddle)) {
            let collidePoint = (ball.y - (playerPaddle.y + playerPaddle.height / 2));
            collidePoint = collidePoint / (playerPaddle.height / 2);

            let angleRad = collidePoint * (Math.PI / 4);

            let direction = (ball.x < canvas.width / 2) ? 1 : -1;
            ball.velocityX = direction * ball.speed * Math.cos(angleRad);
            ball.velocityY = ball.speed * Math.sin(angleRad);

            ball.speed += 0.5;
        }

        if (ball.x - ball.radius < 0) {
            computer.score++;
            if (computer.score >= 5) {
                endGame(computer);
            } else {
                resetBall();
            }
        } else if (ball.x + ball.radius > canvas.width) {
            player.score++;
            if (player.score >= 5) {
                endGame(player);
            } else {
                resetBall();
            }
        }
    }
}

function collision(b, p) {
    b.top = b.y - b.radius;
    b.bottom = b.y + b.radius;
    b.left = b.x - b.radius;
    b.right = b.x + b.radius;

    p.top = p.y;
    p.bottom = p.y + p.height;
    p.left = p.x;
    p.right = p.x + p.width;

    return b.right > p.left && b.bottom > p.top && b.left < p.right && b.top < p.bottom;
}

function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.speed = 5;
    ball.velocityX = -ball.velocityX;
}

function startGame() {
    gamePaused = false;
    document.getElementById('startButton').disabled = true;
    document.getElementById('restartButton').disabled = false;
}

function restartGame() {
    gamePaused = true;
    player.score = 0;
    computer.score = 0;
    resetBall();
    document.getElementById('startButton').disabled = false;
    document.getElementById('restartButton').disabled = true;

    const resultDiv = document.querySelector('.result');
    resultDiv.innerHTML = '';
}

function endGame(winner) {
    gamePaused = true;

    document.getElementById('startButton').disabled = true;
    document.getElementById('restartButton').disabled = false;

    // Display winner
    const resultDiv = document.querySelector('.result');
    resultDiv.innerHTML = `
        <div class="game-over">
            <h2>Game Over</h2>
           <span><p>${winner === player ? 'Player' : 'Computer'} Wins!</p></span>
            <p>Press Restart to Play Again</p>
        </div>
    `;
}

function handleDifficultyChange() {
    difficultyLevel = document.getElementById('difficulty').value;
}

function gameLoop() {
    update();
    render();
}

setInterval(gameLoop, 1000 / 60);

window.addEventListener('keydown', (event) => {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = true;
            break;
        case 40:
            downArrowPressed = true;
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.keyCode) {
        case 38:
            upArrowPressed = false;
            break;
        case 40:
            downArrowPressed = false;
            break;
    }
});

document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('restartButton').addEventListener('click', restartGame);
document.getElementById('difficulty').addEventListener('change', handleDifficultyChange);

