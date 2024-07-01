// height and width of the board
let board;
let boardHeight = 500;
let boardWidth = 500;
let context;

//player
let playerWidth = 80;
let playerHeight = 10;
let playerVelocityX = 20;

let player = {
    x : (boardWidth - playerWidth)/2,
    y : (boardHeight - playerHeight) - 5,
    width : playerWidth,
    height : playerHeight,
    velocityX : playerVelocityX
}

//ball
let ballWidth = 10;
let ballHeight = 10;
let ballVelocityX = 3;
let ballVelocityY = 2;

let ball = {
    x : boardWidth/2,
    y : boardHeight/2,
    width : ballWidth,
    height : ballHeight,
    velocityX : ballVelocityX,
    velocityY : ballVelocityY
}

//blocks
let blockArray = [];
let blockWidth = 50;
let blockHeight = 10;
let blockColumns = 8;
let blockRows = 5;
let blockCount = 0;

let blockX = 15;
let blockY = 45;

let score = 0;
let gameOver = false;

//lives
let livesImg = new Image();
livesImg.src = "./assets/lives.png";
let lives = 3;

window.onload = function() {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d");       //used for drawing on the board

    // draw the initial player
    context.fillStyle = "#FFED00";
    context.fillRect(player.x, player.y, player.width, player.height);

    requestAnimationFrame(update);
    document.addEventListener("keydown", movePlayer);

    createBlocks();
}

function update(){
    requestAnimationFrame(update);
    if(gameOver)    return;
    context.clearRect(0, 0, board.width, board.height);

    //player
    context.fillStyle = "#FFED00";
    context.fillRect(player.x, player.y, player.width, player.height);

    //ball
    context.fillStyle = "#FF5F9E";
    ball.x += ball.velocityX;
    ball.y += ball.velocityY;
    context.fillRect(ball.x, ball.y, ball.width, ball.height);


    //bouncing ball
        // over wall
        if(ball.y <= 0 ){
            // if ball touches top
            ball.velocityY *= -1;
        }
        else if(ball.x <= 0 || ((ball.x + ball.width) >= boardWidth)){
            //if ball touches the sides
            ball.velocityX *= -1;
        }
        else if((ball.y + ball.height) >= boardHeight){
            context.font = "20px 'Play' ";
            lives--;
            if(lives == 0){
                context.fillStyle = "#39B5E0";
                context.fillText("Game Over: Press 'Space' to Restart", 85, 280);
                gameOver = true;
            }
            else{
                ball = {
                    x : boardWidth/2,
                    y : boardHeight/2,
                    width : ballWidth,
                    height : ballHeight,
                    velocityX : ballVelocityX,
                    velocityY : ballVelocityY
                }
            }
        }

        // over paddle
        if(topCollision(ball, player) || bottomCollision(ball, player)){
            ball.velocityY *= -1;
        }
        else if(leftCollision(ball, player) || rightCollision(ball, player)){
            ballVelocityX *= -1;
        }

    //blocks
    context.fillStyle = "#B3005E";
    for(let i=0; i< blockArray.length; i++){
        let block = blockArray[i];
        if(!block.break){
            if(topCollision(ball, block) || bottomCollision(ball, block)){
                block.break = true;
                ball.velocityY *= -1;
                blockCount -= 1;
                score += 100;
            }
            else if(leftCollision(ball, block) || rightCollision(ball, block)){
                block.break = true;
                ball.velocityX *= -1;
                blockCount -= 1;
                score += 100;
            }
            context.fillRect(block.x, block.y, block.width, block.height);
        }
    }

    //winning condition
    if(blockCount == 0){
        context.font = "20px 'Play' ";
        context.fillStyle = "#39B5E0";
        context.fillText("You Win!", 200, 200);
        context.fillText("Your final score is: ", 140, 230);
        context.fillText(score, 310, 230);
        context.fillText("Press 'Space' to Restart", 140, 260);
        gameOver = true;
    }

    //score
    context.font = "20px 'Play' ";
    context.fillStyle = "#39B5E0";
    context.fillText("Score: ", 10, 25);
    context.fillText(score, 75, 25);

    context.drawImage(livesImg, 430, 7, 35, 25);
    context.fillText(": ", 458, 24);
    context.fillText(lives, 468, 25);
}

function outOfBounds(xPosition){
    return ((xPosition < 0) || (xPosition + playerWidth > boardWidth));
}

function movePlayer(e){
    if(gameOver){
        if(e.code == "Space"){
            resetGame();
        }
        return;
    }
    if(e.code == "ArrowLeft"){
        // player.x -= player.velocityX;
        let nextPlayerX = player.x - player.velocityX;
        if(!outOfBounds(nextPlayerX))   player.x = nextPlayerX;

    }   
    else if(e.code == "ArrowRight"){
        let nextPlayerX = player.x + player.velocityX;
        if(!outOfBounds(nextPlayerX))    player.x = nextPlayerX;
    }

}

function detectCollision(a, b){
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function topCollision(ball, block){ // a = ball and b = block
    return detectCollision(ball, block) && ((ball.y + ball.height) >= block.y);
}

function bottomCollision(ball, block){
    return detectCollision(ball, block) &&((block.y + block.height) >= ball.y);
}

function leftCollision(ball, block){
    return detectCollision(ball, block) && ((ball.x + ball.width) >= block.x);
}

function rightCollision(ball, block){
    return detectCollision(ball, block) && ((block.x + block.width) >= ball.x);
}

function createBlocks(){
    blockArray = [];
    for(let c = 0; c < blockColumns; c++){
        for(let r = 0; r < blockRows; r++){
            let block = {
                x : blockX + c*blockWidth + c*10,
                y : blockY + r*blockHeight + r*10,
                width : blockWidth,
                height : blockHeight,
                break : false
            }
            blockArray.push(block);
        }
    }
    blockCount = blockArray.length;

}

function resetGame(){
    gameOver = false;
    player = {
        x : (boardWidth - playerWidth)/2,
        y : (boardHeight - playerHeight) - 5,
        width : playerWidth,
        height : playerHeight,
        velocityX : playerVelocityX
    }

    ball = {
        x : boardWidth/2,
        y : boardHeight/2,
        width : ballWidth,
        height : ballHeight,
        velocityX : ballVelocityX,
        velocityY : ballVelocityY
    }

    blockArray = [];
    blockRows = 5;
    score = 0;
    lives = 3;
    createBlocks();
}