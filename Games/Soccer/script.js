var canvas = document.getElementById("canvas");
var c = canvas.getContext("2d");
var out = document.getElementById("out");
var timerDisplay = document.getElementById("timer");
var instructions = document.getElementById("instructions");
var startButton = document.getElementById("startButton");

window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var player1 = new Player(100,250);
var player2 = new Player(600,250);
var ball = new Ball(350,250);
var wDown = false;
var sDown = false;
var aDown = false;
var dDown = false;
var upDown = false;
var downDown = false;
var leftDown = false;
var rightDown = false;
var timeLeft = 180; // 3 minutes in seconds
var gameInterval;

function startGame(){
    instructions.style.display = 'none';
    canvas.style.display = 'block';
    out.style.display = 'block';
    timerDisplay.style.display = 'block';

    gameInterval = setInterval(function(){
        timeLeft--;
        updateTimer();
        if (timeLeft <= 0) {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
    requestAnimationFrame(start);
}

startButton.addEventListener("click", startGame);

function start(){
    clear();
    renderBackground();
    renderGates();
    checkKeyboardStatus();
    checkPlayersBounds();
    checkBallBounds();
    checkPlayers_BallCollision();
    movePlayers();
    moveBall();
    renderPlayers();
    renderBall();

    out.innerHTML = "Player 1 Score: " + player1.score + "<br>Player 2 Score: " + player2.score;
    requestAnimationFrame(start);
}

function updateTimer() {
    var minutes = Math.floor(timeLeft / 60);
    var seconds = timeLeft % 60;
    timerDisplay.innerHTML = "Time Left: " + minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

function endGame() {
    var winner;
    if (player1.score > player2.score) {
        winner = "Player 1 Wins!";
    } else if (player2.score > player1.score) {
        winner = "Player 2 Wins!";
    } else {
        winner = "It's a Draw!";
    }
    alert(winner);
    resetGame();
}

function resetGame() {
    player1 = new Player(100,250);
    player2 = new Player(600,250);
    ball = new Ball(350,250);
    timeLeft = 180;
    updateTimer();
    clearInterval(gameInterval);
    instructions.style.display = 'block';
    canvas.style.display = 'none';
    out.style.display = 'none';
    timerDisplay.style.display = 'none';
}

function Ball(x,y){
    this.x = x;
    this.y = y;
    this.xVel = 0;
    this.yVel = 0;
    this.decel = 0.1;
    this.size = 5;
}

function Player(x,y){
    this.x = x;
    this.y = y;
    this.size = 20;
    this.xVel = 0;
    this.yVel = 0;
    this.score = 0;
    this.accel = 0.55;
    this.decel = 0.55;
    this.maxSpeed = 3;
}

function reset(){
    var score1 = player1.score;
    var score2 = player2.score;
    player1 = new Player(100,250);
    player1.score = score1;
    player2 = new Player(600,250);
    player2.score = score2;
    ball = new Ball(350,250);
    wDown = false;
    sDown = false;
    aDown = false;
    dDown = false;
    upDown = false;
    downDown = false;
    leftDown = false;
    rightDown = false;
}

function movePlayers(){
    player1.x += player1.xVel;
    player1.y += player1.yVel;
    player2.x += player2.xVel;
    player2.y += player2.yVel;
}

function checkPlayers_BallCollision(){
    var p1_ball_distance = getDistance(player1.x,player1.y,ball.x,ball.y) - player1.size - ball.size;
    if(p1_ball_distance < 0){
        collide(ball,player1);
    }
    var p2_ball_distance = getDistance(player2.x,player2.y,ball.x,ball.y) - player2.size - ball.size;
    if(p2_ball_distance < 0){
        collide(ball,player2);
    }
}

function collide(cir1,cir2){
    var dx = (cir1.x - cir2.x) / (cir1.size);
    var dy = (cir1.y - cir2.y) / (cir1.size);
    cir2.xVel = -dx;
    cir2.yVel = -dy;
    cir1.xVel = dx;
    cir1.yVel = dy;
}

function getDistance(x1,y1,x2,y2){
    return Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2));
}

function moveBall(){
    if(ball.xVel !== 0){
        if(ball.xVel > 0){
            ball.xVel -= ball.decel;
            if(ball.xVel < 0) ball.xVel = 0;
        } else {
            ball.xVel += ball.decel;
            if(ball.xVel > 0) ball.xVel = 0;
        }
    }
    if(ball.yVel !== 0){
        if(ball.yVel > 0){
            ball.yVel -= ball.decel;
            if(ball.yVel < 0) ball.yVel = 0;
        } else {
            ball.yVel += ball.decel;
            if(ball.yVel > 0) ball.yVel = 0;
        }
    }
    ball.x += ball.xVel;
    ball.y += ball.yVel;
}

function checkBallBounds(){
    if(ball.x + ball.size > canvas.width){
        if(ball.y > 150 && ball.y < 350){
            player1.score++;
            reset();
            return;
        }
        ball.x = canvas.width - ball.size;
        ball.xVel *= -1.5;
    }
    if(ball.x - ball.size < 0){
        if(ball.y > 150 && ball.y < 350){
            player2.score++;
            reset();
            return;
        }
        ball.x = 0 + ball.size;
        ball.xVel *= -1.5;
    }
    if(ball.y + ball.size > canvas.height){
        ball.y = canvas.height - ball.size;
        ball.yVel *= -1.5;
    }
    if(ball.y - ball.size < 0){
        ball.y = 0 + ball.size;
        ball.yVel *= -1.5;
    }
}

function checkPlayersBounds(){
    if(player1.x + player1.size > canvas.width){
        player1.x = canvas.width - player1.size;
        player1.xVel *= -0.5;
    }
    if(player1.x - player1.size < 0){
        player1.x = 0 + player1.size;
        player1.xVel *= -0.5;
    }
    if(player1.y + player1.size > canvas.height){
        player1.y = canvas.height - player1.size;
        player1.yVel *= -0.5;
    }
    if(player1.y - player1.size < 0){
        player1.y = 0 + player1.size;
        player1.yVel *= -0.5;
    }
    if(player2.x + player2.size > canvas.width){
        player2.x = canvas.width - player2.size;
        player2.xVel *= -0.5;
    }
    if(player2.x - player2.size < 0){
        player2.x = 0 + player2.size;
        player2.xVel *= -0.5;
    }
    if(player2.y + player2.size > canvas.height){
        player2.y = canvas.height - player2.size;
        player2.yVel *= -0.5;
    }
    if(player2.y - player2.size < 0){
        player2.y = 0 + player2.size;
        player2.yVel *= -0.5;
    }
}

function checkKeyboardStatus(){
    if(wDown){
        if(player1.yVel > -player1.maxSpeed){
            player1.yVel -= player1.accel;    
        } else {
            player1.yVel = -player1.maxSpeed;
        }
    } else {
        if(player1.yVel < 0){
            player1.yVel += player1.decel;
            if(player1.yVel > 0) player1.yVel = 0;    
        }
    }
    if(sDown){
        if(player1.yVel < player1.maxSpeed){
            player1.yVel += player1.accel;    
        } else {
            player1.yVel = player1.maxSpeed;
        }
    } else {
        if(player1.yVel > 0){
            player1.yVel -= player1.decel;
            if(player1.yVel < 0) player1.yVel = 0;
        }
    }
    if(aDown){
        if(player1.xVel > -player1.maxSpeed){
            player1.xVel -= player1.accel;    
        } else {
            player1.xVel = -player1.maxSpeed;
        }
    } else {
        if(player1.xVel < 0){
            player1.xVel += player1.decel;
            if(player1.xVel > 0) player1.xVel = 0;    
        }
    }
    if(dDown){
        if(player1.xVel < player1.maxSpeed){
            player1.xVel += player1.accel;    
        } else {
            player1.xVel = player1.maxSpeed;
        }
    } else {
        if(player1.xVel > 0){
            player1.xVel -= player1.decel;
            if(player1.xVel < 0) player1.xVel = 0;
        }
    }

    //PLAYER 2

    if(upDown){
        if(player2.yVel > -player2.maxSpeed){
            player2.yVel -= player2.accel;    
        } else {
            player2.yVel = -player2.maxSpeed;
        }
    } else {
        if(player2.yVel < 0){
            player2.yVel += player2.decel;
            if(player2.yVel > 0) player2.yVel = 0;    
        }
    }
    if(downDown){
        if(player2.yVel < player2.maxSpeed){
            player2.yVel += player2.accel;    
        } else {
            player2.yVel = player2.maxSpeed;
        }
    } else {
        if(player2.yVel > 0){
            player2.yVel -= player2.decel;
            if(player2.yVel < 0) player2.yVel = 0;
        }
    }
    if(leftDown){
        if(player2.xVel > -player2.maxSpeed){
            player2.xVel -= player2.accel;    
        } else {
            player2.xVel = -player2.maxSpeed;
        }
    } else {
        if(player2.xVel < 0){
            player2.xVel += player2.decel;
            if(player2.xVel > 0) player2.xVel = 0;    
        }
    }
    if(rightDown){
        if(player2.xVel < player2.maxSpeed){
            player2.xVel += player2.accel;    
        } else {
            player2.xVel = player2.maxSpeed;
        }
    } else {
        if(player2.xVel > 0){
            player2.xVel -= player2.decel;
            if(player2.xVel < 0) player2.xVel = 0;
        }
    }
}

document.onkeyup = function(e){
    if(e.keyCode === 87){
        wDown = false;
    }
    if(e.keyCode === 65){
        aDown = false;
    }
    if(e.keyCode === 68){
        dDown = false;
    }
    if(e.keyCode === 83){
        sDown = false;
    }
    if(e.keyCode === 38){
        upDown = false;
    }
    if(e.keyCode === 37){
        leftDown = false;
    }
    if(e.keyCode === 40){
        downDown = false;
    }
    if(e.keyCode === 39){
        rightDown = false;
    }
}

document.onkeydown = function(e){
    if(e.keyCode === 87){
        wDown = true;
    }
    if(e.keyCode === 65){
        aDown = true;
    }
    if(e.keyCode === 68){
        dDown = true;
    }
    if(e.keyCode === 83){
        sDown = true;
    }
    if(e.keyCode === 38){
        upDown = true;
    }
    if(e.keyCode === 37){
        leftDown = true;
    }
    if(e.keyCode === 40){
        downDown = true;
    }
    if(e.keyCode === 39){
        rightDown = true;
    }
}

function renderBall(){
    c.save();
    c.beginPath();
    c.fillStyle = "black";
    c.arc(ball.x,ball.y,ball.size,0,Math.PI*2);
    c.fill();
    c.closePath();
    c.restore();
}

function renderPlayers(){
    c.save();
    c.fillStyle = "red";
    c.beginPath();
    c.arc(player1.x,player1.y,player1.size,0,Math.PI*2);
    c.fill();
    c.closePath();
    c.beginPath();
    c.fillStyle = "blue";
    c.arc(player2.x,player2.y,player2.size,0,Math.PI*2);
    c.fill();
    c.closePath();
    c.restore();
}

function renderGates(){
    c.save();
    c.beginPath();
    c.moveTo(0,150);
    c.lineTo(0,350);
    c.strokeStyle = "red";
    c.lineWidth = 10;
    c.stroke();
    c.closePath();
    c.beginPath();
    c.moveTo(canvas.width,150);
    c.lineTo(canvas.width,350);
    c.strokeStyle = "blue";
    c.lineWidth = 10;
    c.stroke();
    c.closePath();
    c.restore();
}

function renderBackground(){
    c.save();
    c.fillStyle = "#66aa66";
    c.fillRect(0,0,canvas.width,canvas.height);
    c.strokeStyle = "rgba(255,255,255,0.6)";
    c.beginPath();
    c.arc(canvas.width/2,canvas.height/2,150,0,Math.PI*2);
    c.closePath();
    c.lineWidth = 10;
    c.stroke();
    c.restore();
}

function clear(){
    c.clearRect(0,0,canvas.width,canvas.height);
}
