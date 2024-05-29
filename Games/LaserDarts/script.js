const dartboard = document.getElementById('dartboard');
const dart = document.getElementById('dart');
const scoreDisplay = document.getElementById('score');
let score = 0;
let moving = true;
var rect = dartboard.getBoundingClientRect();

let posX = (Math.random()) * rect.width+rect.x;
let posY = (Math.random()) * rect.height+rect.y;
let directionX = (Math.random() - 0.5) * 5;
let directionY = (Math.random() - 0.5) * 5;


function moveDart() {
    if (moving) {
        posX += directionX;
        posY += directionY;

        if (posX <= rect.x || posX>=rect.x+rect.width) directionX *= -1;
        if (posY <= rect.y || posY >= rect.y+rect.height) directionY *= -1;

        dart.style.left = `${posX}px`;
        dart.style.top = `${posY}px`;

        requestAnimationFrame(moveDart);
        // console.log("Ball: ",posX,",",posY);
        // console.log("Ball: ",posX,",",posY);
    }
}

dartboard.addEventListener('click', function() {
    if (moving) {
        moving = false;
        calculateScore();
        setTimeout(resetDart, 1000); // Reset dart after 1 second
  
    }
});

function calculateScore() {
    const centerX = rect.x+rect.width/2;
    const centerY = rect.y+rect.height/2;

    const distance = Math.sqrt((posX - centerX + 5) ** 2 + (posY - centerY + 5) ** 2);

    let points;
    if (distance < 25) {
        points = 50; // Bullseye
    } else if (distance < 50) {
        points = 25;
    } else if (distance < 100) {
        points = 10;
    } else if (distance < 150) {
        points = 5;
    } else {
        points = 1;
    }

    score += points;
    scoreDisplay.textContent = score;
}

function resetDart() {
    posX = (Math.random()) * rect.width+rect.x;
    posY = (Math.random()) * rect.height+rect.y;
    directionX = (Math.random() - 0.5) * score/3;
    directionY = (Math.random() - 0.5) * score/3;
    moving = true;
    moveDart();
}

moveDart();
