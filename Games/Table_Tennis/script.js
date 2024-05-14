document.addEventListener("DOMContentLoaded", function() {
    const table = document.getElementById("table");
    const ball = document.getElementById("ball");
    const paddleLeft = document.getElementById("paddle-left");
    const paddleRight = document.getElementById("paddle-right");
    const net = document.getElementById("net");
    const scoreDisplay = document.getElementById("score");
    const menu = document.getElementById("menu");
    const menuOptions = document.getElementById("menu-options");
    const pauseButton = document.getElementById("pause");
    const restartButton = document.getElementById("restart");
    const exitButton = document.getElementById("exit");

    let ballX = table.offsetWidth / 2;
    let ballY = table.offsetHeight / 2;
    let ballSpeedX = 3;
    let ballSpeedY = 3;
    let playerLeftY = table.offsetHeight / 2 - paddleLeft.offsetHeight / 2;
    let playerRightY = table.offsetHeight / 2 - paddleRight.offsetHeight / 2;
    let scoreLeft = 0;
    let scoreRight = 0;
    let gamePaused = false;

    function update() {
        if (!gamePaused) {
            // Update ball position
            ballX += ballSpeedX;
            ballY += ballSpeedY;

            // Check collision with top and bottom walls
            if (ballY <= 0 || ballY >= table.offsetHeight - ball.offsetHeight) {
                ballSpeedY *= -1;
            }

            // Check collision with paddles
            if (
                (ballX <= paddleLeft.offsetWidth && ballY >= playerLeftY && ballY <= playerLeftY + paddleLeft.offsetHeight) ||
                (ballX >= table.offsetWidth - paddleRight.offsetWidth - ball.offsetWidth && ballY >= playerRightY && ballY <= playerRightY + paddleRight.offsetHeight)
            ) {
                ballSpeedX *= -1;
            }

            // Check if the ball went past the paddles
            if (ballX < 0) {
                scoreRight++;
                resetBall();
            } else if (ballX > table.offsetWidth - ball.offsetWidth) {
                scoreLeft++;
                resetBall();
            }

            // Update paddle positions
            paddleLeft.style.top = playerLeftY + "px";
            paddleRight.style.top = playerRightY + "px";

            // Update score display
            scoreDisplay.textContent = scoreLeft + " - " + scoreRight;

            // Check for the winning condition
            if (scoreLeft >= 11) {
                gameOver("Player 1");
            } else if (scoreRight >= 11) {
                gameOver("Player 2");
            }

            // Increase ball speed based on score
            ballSpeedX = ballSpeedX > 0 ? 3 + Math.floor(scoreRight / 5) : -3 - Math.floor(scoreLeft / 5);
            ballSpeedY = ballSpeedY > 0 ? 3 + Math.floor(scoreRight / 5) : -3 - Math.floor(scoreLeft / 5);

            // Move ball
            ball.style.left = ballX + "px";
            ball.style.top = ballY + "px";
        }

        requestAnimationFrame(update);
    }

    function resetBall() {
        ballX = table.offsetWidth / 2;
        ballY = table.offsetHeight / 2;
        ballSpeedX = Math.random() > 0.5 ? 3 : -3;
        ballSpeedY = Math.random() > 0.5 ? 3 : -3;
    }

    function gameOver(winner) {
        gamePaused = true;
        alert("Game Over! " + winner + " wins!");
        scoreLeft = 0;
        scoreRight = 0;
        resetBall();
        gamePaused = false;
    }

    // Event listener for the menu button
    menu.addEventListener("click", function() {
        menuOptions.style.display = menuOptions.style.display === "none" ? "block" : "none";
    });

    // Pause the game
    pauseButton.addEventListener("click", function() {
        gamePaused = !gamePaused;
    });

    // Restart the game
    restartButton.addEventListener("click", function() {
        scoreLeft = 0;
        scoreRight = 0;
        resetBall();
        gamePaused = false;
    });

    // Exit the game
    exitButton.addEventListener("click", function() {
        // Implement your exit game logic here
        console.log("Exiting the game...");
    });

    // Event listener for keypress to control paddles
    document.addEventListener("keydown", function(e) {
        if (!gamePaused) {
            if (e.key === "w" && playerLeftY > 0) {
                playerLeftY -= 10;
            } else if (e.key === "s" && playerLeftY < table.offsetHeight - paddleLeft.offsetHeight) {
                playerLeftY += 10;
            }

            if (e.key === "ArrowUp" && playerRightY > 0) {
                playerRightY -= 10;
            } else if (e.key === "ArrowDown" && playerRightY < table.offsetHeight - paddleRight.offsetHeight) {
                playerRightY += 10;
            }
        }
    });

    // Start the game loop
    requestAnimationFrame(update);
});
