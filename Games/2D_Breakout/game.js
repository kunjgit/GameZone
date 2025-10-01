/////// LOAD IMAGES ////////
const BG_IMG = new Image();
BG_IMG.src = "img/bg.jpg";

const LEVEL_IMG = new Image();
LEVEL_IMG.src = "img/level.png";

const LIFE_IMG = new Image();
LIFE_IMG.src = "img/life.png";

const SCORE_IMG = new Image();
SCORE_IMG.src = "img/score.png";
/////// END LOAD IMAGES ////////

/////// LOAD SOUNDS ////////
const WALL_HIT = new Audio("sounds/wall.mp3");
const LIFE_LOST = new Audio("sounds/life_lost.mp3");
const PADDLE_HIT = new Audio("sounds/paddle_hit.mp3");
const WIN = new Audio("sounds/win.mp3");
const BRICK_HIT = new Audio("sounds/brick_hit.mp3");
/////// END LOAD SOUNDS ////////

// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
cvs.style.border = "1px solid #0ff";

// MAKE LINE THICK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// GAME VARIABLES
const PADDLE_WIDTH = 100;
const PADDLE_HEIGHT = 20;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
let LIFE = 3;
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 3;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// CREATE THE PADDLE
const paddle = {
    x: cvs.width / 2 - PADDLE_WIDTH / 2,
    y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
    width: PADDLE_WIDTH,
    height: PADDLE_HEIGHT,
    dx: 5
}

// DRAW PADDLE
function drawPaddle() {
    ctx.fillStyle = "#2e3548";
    ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);

    ctx.strokeStyle = "#ffcd05";
    ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function(event){
    if(event.keyCode == 37) leftArrow = true;
    else if(event.keyCode == 39) rightArrow = true;
});
document.addEventListener("keyup", function(event){
    if(event.keyCode == 37) leftArrow = false;
    else if(event.keyCode == 39) rightArrow = false;
});

// MOVE PADDLE
function movePaddle() {
    if(rightArrow && paddle.x + paddle.width < cvs.width) paddle.x += paddle.dx;
    else if(leftArrow && paddle.x > 0) paddle.x -= paddle.dx;
}

// CREATE THE BALL
const ball = {
    x: cvs.width / 2,
    y: paddle.y - BALL_RADIUS,
    radius: BALL_RADIUS,
    speed: 4,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3
}

// DRAW THE BALL
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ffcd05";
    ctx.fill();
    ctx.strokeStyle = "#2e3548";
    ctx.stroke();
    ctx.closePath();
}

// MOVE THE BALL
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;
}

// BALL AND WALL COLLISION
function ballWallCollision() {
    if(ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0){
        ball.dx = -ball.dx;
        WALL_HIT.play();
    }

    if(ball.y - ball.radius < 0){
        ball.dy = -ball.dy;
        WALL_HIT.play();
    }

    if(ball.y + ball.radius > cvs.height){
        LIFE--;
        LIFE_LOST.play();
        resetBall();
    }
}

// RESET BALL
function resetBall() {
    ball.x = cvs.width / 2;
    ball.y = paddle.y - BALL_RADIUS;
    ball.dx = 3 * (Math.random() * 2 - 1);
    ball.dy = -3;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision() {
    if(ball.x > paddle.x && ball.x < paddle.x + paddle.width &&
       ball.y + ball.radius > paddle.y && ball.y - ball.radius < paddle.y + paddle.height){
        PADDLE_HIT.play();
        let collidePoint = ball.x - (paddle.x + paddle.width / 2);
        collidePoint = collidePoint / (paddle.width / 2);
        let angle = collidePoint * Math.PI / 3;

        ball.dx = ball.speed * Math.sin(angle);
        ball.dy = -ball.speed * Math.cos(angle);
    }
}

// CREATE BRICKS
const brick = {
    row: 1,
    column: 5,
    width: 55,
    height: 20,
    offSetLeft: 20,
    offSetTop: 20,
    marginTop: 40,
    fillColor: "#2e3548",
    strokeColor: "#FFF"
}

let bricks = [];

function createBricks() {
    for(let r = 0; r < brick.row; r++){
        bricks[r] = [];
        for(let c = 0; c < brick.column; c++){
            bricks[r][c] = {
                x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
                y: r * (brick.offSetTop + brick.height) + brick.offSetTop + brick.marginTop,
                status: true
            }
        }
    }
}
createBricks();

// DRAW BRICKS
function drawBricks() {
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                ctx.fillStyle = brick.fillColor;
                ctx.fillRect(b.x, b.y, brick.width, brick.height);

                ctx.strokeStyle = brick.strokeColor;
                ctx.strokeRect(b.x, b.y, brick.width, brick.height);
            }
        }
    }
}

// BALL AND BRICK COLLISION
function ballBrickCollision() {
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            let b = bricks[r][c];
            if(b.status){
                if(ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + brick.width &&
                   ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + brick.height){
                    BRICK_HIT.play();
                    ball.dy = -ball.dy;
                    b.status = false;
                    SCORE += SCORE_UNIT;
                }
            }
        }
    }
}

// SHOW GAME STATS
function showGameStats(text, textX, textY, img, imgX, imgY){
    ctx.fillStyle = "#FFF";
    ctx.font = "25px Germania One";
    ctx.fillText(text, textX, textY);
    ctx.drawImage(img, imgX, imgY, 25, 25);
}

// DRAW EVERYTHING
function draw() {
    drawPaddle();
    drawBall();
    drawBricks();
    showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
    showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width-55, 5);
    showGameStats(LEVEL, cvs.width/2, 25, LEVEL_IMG, cvs.width/2 - 30, 5);
}

// GAME OVER
function gameOver() {
    if(LIFE <= 0){
        showYouLose();
        GAME_OVER = true;
    }
}

// LEVEL UP
function levelUp() {
    let isLevelDone = true;
    for(let r = 0; r < brick.row; r++){
        for(let c = 0; c < brick.column; c++){
            isLevelDone = isLevelDone && !bricks[r][c].status;
        }
    }

    if(isLevelDone){
        WIN.play();
        if(LEVEL >= MAX_LEVEL){
            showYouWin();
            GAME_OVER = true;
            return;
        }
        brick.row++;
        createBricks();
        ball.speed += 0.5;
        resetBall();
        LEVEL++;
    }
}

// UPDATE GAME
function update() {
    movePaddle();
    moveBall();
    ballWallCollision();
    ballPaddleCollision();
    ballBrickCollision();
    gameOver();
    levelUp();
}

// GAME LOOP
function loop() {
    ctx.drawImage(BG_IMG, 0, 0);
    draw();
    update();
    if(!GAME_OVER) requestAnimationFrame(loop);
}
loop();

// SOUND TOGGLE
const soundElement = document.getElementById("sound");
soundElement.addEventListener("click", audioManager);

function audioManager() {
    let imgSrc = soundElement.getAttribute("src");
    let SOUND_IMG = imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";
    soundElement.setAttribute("src", SOUND_IMG);

    const audios = [WALL_HIT, PADDLE_HIT, BRICK_HIT, WIN, LIFE_LOST];
    audios.forEach(audio => audio.muted = !audio.muted);
}

// GAME OVER ELEMENTS
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// RESTART GAME
restart.addEventListener("click", function(){
    location.reload();
});

// SHOW WIN / LOSE
function showYouWin(){
    gameover.style.display = "block";
    youwin.style.display = "block";
}
function showYouLose(){
    gameover.style.display = "block";
    youlose.style.display = "block";
}
