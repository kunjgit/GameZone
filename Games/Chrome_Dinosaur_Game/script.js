
//board
let board;
let boardWidth = 1000;
let boardHeight = 400;
let context;

//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
    x: dinoX,
    y: dinoY,
    width: dinoWidth,
    height: dinoHeight
}

//cactus
let cactusArray = [];

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;

let cactusHeight = 70;
let cactusX =  boardWidth;
let cactusY = boardHeight - cactusHeight;

let cactus1Img;
let cactus2Img;
let cactus3Img;

//physics
let velocityX = -5; //cactus moving left speed
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;

    context = board.getContext("2d"); //used for drawing on the board

    //draw initial dinosaur
    // context.fillStyle="green";
    // context.fillRect(dino.x, dino.y, dino.width, dino.height);

    dinoImg = new Image();
    dinoImg.src = "./assets/dino.png";
    dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
    }

    cactus1Img = new Image();
    cactus1Img.src = "./assets/cactus1.png";

    cactus2Img = new Image();
    cactus2Img.src = "./assets/cactus2.png";

    cactus3Img = new Image();
    cactus3Img.src = "./assets/cactus3.png";

    requestAnimationFrame(update);
    setInterval(placeCactus, 1000); //1000 milliseconds = 1 second
    document.addEventListener("keydown", moveDino);


}


// Add this function to play the score sound
function playScoreSound() {
    const scoreAudio = document.getElementById("scoreAudio");
    scoreAudio.currentTime = 0; // Reset the audio to the beginning to allow rapid replay
    scoreAudio.play();
}

function update() {
    requestAnimationFrame(update);
    if(gameOver){
        if(e.code == "KeyR"){
            resetGame();
        }
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    context.strokeStyle = "#ccc";
    context.lineWidth = 5;
    context.strokeRect(0, 0, board.width, board.height);


    //dino
    velocityY += gravity;
    dino.y = Math.min(dino.y + velocityY, dinoY); //apply gravity to current dino.y, making sure it doesn't exceed the ground
    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

    //cactus
    for (let i = 0; i < cactusArray.length; i++) {
        let cactus = cactusArray[i];
        cactus.x += velocityX;
        context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height);

        if (detectCollision(dino, cactus)) {
            gameOver = true;
            dinoImg.src = "./assets/dino-dead.png";
            context.fillStyle = "#27374D";
            context.font = "40px 'Play'";
            context.fillText("Press 'R' to Restart", 340, 210);
            dinoImg.onload = function () {
                context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
            }
        }
    }

    //score
    context.fillStyle = "#27374D";
    context.font = "25px 'Play'";
    score++;
    context.fillText("Score:", 450, 40);
    context.fillText(score, 525, 40);

    // Play score sound if the score is a multiple of 1000
    if (score % 1000 === 0 && score !== 0) {
        playScoreSound();
    }

}

// Add this function to play the collision sound
function playCollisionSound() {
    const collisionAudio = document.getElementById("collisionAudio");
    collisionAudio.currentTime = 0; // Reset the audio to the beginning to allow rapid replay
    collisionAudio.play();
}



function moveDino(e) {
    if(gameOver){
        if(e.code == "KeyR"){
            resetGame();
        }
        return;
    }

    if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) {
        //jump
        velocityY = -12;
        playKeyPressSound(); // Play key press sound
    }
    else if (e.code == "ArrowDown" && dino.y == dinoY) {
        //duck
    }

}

function placeCactus() {
    if(gameOver){
        if(e.code == "KeyR"){
            resetGame();
        }
        return;
    }

    //place cactus
    let cactus = {
        img: null,
        x: cactusX,
        y: cactusY,
        width: null,
        height: cactusHeight
    }

    let placeCactusChance = Math.random(); //0 - 0.9999...

    if (placeCactusChance > .90) { //10% you get cactus3
        cactus.img = cactus3Img;
        cactus.width = cactus3Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .70) { //30% you get cactus2
        cactus.img = cactus2Img;
        cactus.width = cactus2Width;
        cactusArray.push(cactus);
    }
    else if (placeCactusChance > .50) { //50% you get cactus1
        cactus.img = cactus1Img;
        cactus.width = cactus1Width;
        cactusArray.push(cactus);
    }

    if (cactusArray.length > 5) {
        cactusArray.shift(); //remove the first element from the array so that the array doesn't constantly grow
    }
}


// Add this function to play the key press sound
function playKeyPressSound() {
    const keypressAudio = document.getElementById("keypressAudio");
    keypressAudio.currentTime = 0; // Reset the audio to the beginning to allow rapid replay
    keypressAudio.play();
}


function detectCollision(a, b) {
    const isCollision =
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y;

    if (isCollision) {
        gameOver = true;
        dinoImg.src = "./assets/dino-dead.png";
        context.fillStyle = "#27374D";
        context.font = "40px 'Play'";
        context.fillText("Press 'R' to Restart", 340, 210);
        dinoImg.onload = function () {
            context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
        }
        playCollisionSound(); // Play collision sound
    }

    return isCollision;
}


function resetGame() {
    gameOver = false

    dinoImg.src = "./assets/dino.png";
    dino = {
        x: dinoX,
        y: dinoY,
        width: dinoWidth,
        height: dinoHeight
    }

    cactusArray = [];
    cactus1Width = 34;
    cactus2Width = 69;
    cactus3Width = 102;
    cactusHeight = 70;
    cactusX = 700;
    cactusY = boardHeight - cactusHeight;
    cactus1Img;
    cactus2Img;
    cactus3Img;

    velocityX = -8;
    velocityY = 0;
    gravity = .4;

    score = 0;
}