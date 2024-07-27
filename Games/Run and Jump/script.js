let character = document.getElementById('character');
let characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
let characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
let characterWidth = parseInt(window.getComputedStyle(character).getPropertyValue('width'));
let ground = document.getElementById('ground');
let groundBottom = parseInt(window.getComputedStyle(ground).getPropertyValue('bottom'));
let groundHeight = parseInt(window.getComputedStyle(ground).getPropertyValue('height'));
let isJumping = false;
let upTime;
let downTime;
let displayScore = document.getElementById('score');
let score = 0;
let displayHighScore = document.getElementById('highScore');
let highScore = localStorage.getItem('highScore') || 0; // Load high score from local storage
displayHighScore.innerText = highScore;
let gamePaused = false;
let obstacleInterval;
let obstacleTimeout;

function stopGame() {
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore); // Save high score to local storage
        displayHighScore.innerText = highScore;
    }
    clearInterval(obstacleInterval);
    clearTimeout(obstacleTimeout);
    gamePaused = true;
}

function resumeGame() {
    if (!gamePaused) return;
    gamePaused = false;
    generateObstacle();
}

async function endGame() {
    stopGame();
    
    const result = await Swal.fire({
        title: 'Stop?',
        html: '<p style="font-size: xx-large;">Your score is:</p><p style="font-size: xx-large;"><b>' + score + '</b></p>',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Restart',
        cancelButtonText: 'Continue'
    });

    if (result.isConfirmed) {
        location.reload(); // Restart the game
    } else {
        // Continue the game
        resumeGame();
    }
}

function jump() {
    if (isJumping || gamePaused) return;
    upTime = setInterval(() => {
        if (characterBottom >= groundHeight + 250) {
            clearInterval(upTime);
            downTime = setInterval(() => {
                if (characterBottom <= groundHeight + 10) {
                    clearInterval(downTime);
                    isJumping = false;
                }
                characterBottom -= 10;
                character.style.bottom = characterBottom + 'px';
            }, 20);
        }
        characterBottom += 10;
        character.style.bottom = characterBottom + 'px';
        isJumping = true;
    }, 20);

    // Update character position
    characterBottom = parseInt(window.getComputedStyle(character).getPropertyValue('bottom'));
    characterRight = parseInt(window.getComputedStyle(character).getPropertyValue('right'));
}

function showScore() {
    if (gamePaused) return;
    score++;
    displayScore.innerText = score;
}

setInterval(showScore, 100);

function generateObstacle() {
    if (gamePaused) return;
    let obstacles = document.querySelector('.obstacles');
    let obstacle = document.createElement('div');
    obstacle.setAttribute('class', 'obstacle');
    obstacles.appendChild(obstacle);

    let randomTimeout = Math.floor(Math.random() * 1000) + 1000;
    let obstacleRight = -30;
    let obstacleBottom = 100;
    let obstacleWidth = 30;
    let obstacleHeight = Math.floor(Math.random() * 50) + 50;
    obstacle.style.backgroundColor = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 255)})`;

    async function moveObstacle() {
        if (gamePaused) return;
        obstacleRight += 5;
        obstacle.style.right = obstacleRight + 'px';
        obstacle.style.bottom = obstacleBottom + 'px';
        obstacle.style.width = obstacleWidth + 'px';
        obstacle.style.height = obstacleHeight + 'px';
        if (characterRight >= obstacleRight - characterWidth && characterRight <= obstacleRight + obstacleWidth && characterBottom <= obstacleBottom + obstacleHeight) {
            stopGame();
            await Swal.fire({
                title: 'Game Over',
                html: '<p style="font-size: xx-large;">Congrats! Your score is:</p><p style="font-size: xx-large;"><b>' + score + '</b></p>',
                icon: 'success',
                confirmButtonText: 'Restart'
            }).then(() => {
                location.reload();
            });
        }
    }

    obstacleInterval =setInterval(moveObstacle,20);
    obstacleTimeout = setTimeout(generateObstacle,randomTimeout);
   }
   generateObstacle();
   function playSound() {
    var audio = new Audio('./ads.wav');
    audio.play();
}

function control(e){
    if(e.key == 'ArrowUp' || e.key == ' '){
        playSound();
       jump();

    }
}   
document.addEventListener('keydown',control);


