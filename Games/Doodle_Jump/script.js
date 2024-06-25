//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//doodler
let doodlerWidth = 46;
let doodlerHeight = 46;
let doodlerX = boardWidth/2 - doodlerWidth/2;
let doodlerY = boardHeight*7/8 - doodlerHeight;
let doodlerRightImg;
let doodlerLeftImg;

let doodler = {
    img : null,
    x : doodlerX,
    y : doodlerY,
    width : doodlerWidth,
    height : doodlerHeight
}

//physics
let velocityX = 0; 
let velocityY = 0;
let initialVelocityY = -8;
let gravity = 0.4;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");

    doodlerRightImg = new Image();
    doodlerRightImg.src = "./assets/doodler-right.png";
    doodler.img = doodlerRightImg;
    doodlerRightImg.onload = function() {
        context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);
    }

    doodlerLeftImg = new Image();
    doodlerLeftImg.src = "./assets/doodler-left.png";

    platformImg = new Image();
    platformImg.src = "./assets/platform.png";

    velocityY = initialVelocityY;
    placePlatforms();
    requestAnimationFrame(update);
    document.addEventListener("keydown", moveDoodler);
}

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //doodler
    doodler.x += velocityX;
    if (doodler.x > boardWidth) {
        doodler.x = 0;
    }
    else if (doodler.x + doodler.width < 0) {
        doodler.x = boardWidth;
    }

    velocityY += gravity;
    doodler.y += velocityY;
    if (doodler.y > board.height) {
        gameOver = true;
    }
    context.drawImage(doodler.img, doodler.x, doodler.y, doodler.width, doodler.height);

    //platforms
    for (let i = 0; i < platformArray.length; i++) {
        let platform = platformArray[i];
        if (velocityY < 0 && doodler.y < boardHeight*3/4) {
            platform.y -= initialVelocityY; //slide platform down
        }
        if (detectCollision(doodler, platform) && velocityY >= 0) {
            velocityY = initialVelocityY; //jump
        }
        context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new platform
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); //removes first element from the array
        newPlatform(); //replace with new platform on top
    }

    //score
    updateScore();
    context.fillStyle = "#537188";
    context.font = "20px 'Cedarville Cursive', cursive";
    context.fillText("Score:", 5, 35);
    context.fillText(score, 70, 35);

    if (gameOver) {
        context.fillStyle = "#537188";
        context.font = "22px 'Cedarville Cursive', cursive";
        context.fillText("Your Score is ", 80, 300);
        context.fillText(score, 240, 300);
        context.fillText("Game Over: Press 'Space' to Restart", 10, 330);
    }
}

function moveDoodler(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 4;
        doodler.img = doodlerRightImg;
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -4;
        doodler.img = doodlerLeftImg;
    }
    else if (e.code == "Space" && gameOver) {
        //reset
        doodler = {
            img : doodlerRightImg,
            x : doodlerX,
            y : doodlerY,
            width : doodlerWidth,
            height : doodlerHeight
        }

        velocityX = 0;
        velocityY = initialVelocityY;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4);
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
    
        platformArray.push(platform);
    }
}

function newPlatform() {
    let randomX = Math.floor(Math.random() * boardWidth*3/4);
    let platform = {
        img : platformImg,
        x : randomX,
        y : -platformHeight,
        width : platformWidth,
        height : platformHeight
    }

    platformArray.push(platform);
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left doesn't reach b's top right 
           a.x + a.width > b.x &&   //a's top right passes b's top left 
           a.y < b.y + b.height &&  //a's top left doesn't reach b's bottom left 
           a.y + a.height > b.y;    //a's bottom left passes b's top left 
}

function updateScore() {
    let points = Math.floor(50*Math.random()); //(0-1) *50 --> (0-50)
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    }
    else if (velocityY >= 0) {
        maxScore -= points;
    }
}