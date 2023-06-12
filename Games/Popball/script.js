var ballsClick = 0;
var totalClick = 0;
var precision = 0;
var flag;
var pause = true;
var speed;
var toLoseBalls = 0;
var difficultyChose = false;

function addBall() {
    var ball = document.createElement("div");
    ball.setAttribute("id", "ballStyle"); // <div id="ballStyle"></div>

    var px = Math.floor(Math.random() * 500) + 76;
    var py = Math.floor(Math.random() * 400) + 50;
    var ColorID = Math.floor(Math.random() * 7)

    colorList = ["red", "blue", "yellow", "green", "orange", "magenta", "purple"];
    color = colorList[ColorID];
    ball.setAttribute("style", "left:" + px + "px; top:" + py + "px;" + "background-color: " + color + ";");
    ball.setAttribute("onclick", "pop(this)");

    document.body.appendChild(ball);
    toLoseBalls++;
    if (toLoseBalls == 21) {
        gameOver();
    }
}
function Clicks() {
    if (!pause){
        totalClick++;
        precision = (ballsClick/totalClick) * 100;
        showNumber(ballsClick, totalClick, precision);
        addBall();
    }
}
function pop(element) {
    if (!pause) {
        document.body.removeChild(element);
        ballsClick++;
        totalClick++;
        precision = (ballsClick/totalClick) * 100;
        showNumber(ballsClick, totalClick, precision);
        toLoseBalls--;
    }
}
function showNumber(n1, n2, n3) {
    document.getElementById("hits").innerHTML = n1;
    document.getElementById("clicks").innerHTML = n2;
    document.getElementById("precision").innerHTML = n3.toFixed(2);
}
function setDifficulty(valor) {
    speed = valor;
    difficultyChose = true;
    if (valor == 700) {
        document.getElementById("easyButton").style.backgroundColor = "rgb(255, 102, 0)";
        document.getElementById("normalButton").style.backgroundColor = "transparent";
        document.getElementById("hardButton").style.backgroundColor = "transparent";
        ;
    }
    else if (valor == 500) {
        document.getElementById("easyButton").style.backgroundColor = "transparent";
        document.getElementById("normalButton").style.backgroundColor = "rgb(255, 102, 0)";
        document.getElementById("hardButton").style.backgroundColor = "transparent";
    }
    else {
        document.getElementById("easyButton").style.backgroundColor = "transparent";
        document.getElementById("normalButton").style.backgroundColor = "transparent";
        document.getElementById("hardButton").style.backgroundColor = "rgb(255, 102, 0)";
    }
}
function playGame() {
    if (pause == true && difficultyChose == true) {
        flag = setInterval(addBall, speed); // Time in ms
        pause = false;
    }
}
function stopGame() {
    clearInterval(flag);
    pause = true;
}
function baseData() {
    showNumber(ballsClick, totalClick, precision);
}
function reposition() {
    if (difficultyChose == true) {
        document.getElementById("menu1").style.display = "none";
        document.getElementById("difficulty").style.display = "none";
        document.getElementById("gameDesc").style.display = "none";
        document.getElementById("difficulty").style.display = "none";
        document.getElementById("continueButton").style.display = "block";
        document.getElementById("pauseButton").style.display = "block";
        document.getElementById("data").style.display = "block";
    }
}
function gameOver() {
    stopGame();
    document.getElementById("menu1").style.display = "none";
    document.getElementById("difficulty").style.display = "none";
    document.getElementById("gameDesc").style.display = "none";
    document.getElementById("difficulty").style.display = "none";
    document.getElementById("continueButton").style.display = "none";
    document.getElementById("pauseButton").style.display = "none";
    document.getElementById("data").style.display = "none";
    document.getElementById("menu2").style.display = "none";
    document.getElementById("menu3").style.display = "flex";
    document.getElementById("restartButton").style.display = "block";
    document.getElementById("gameOverScreen").style.display = "flex";
}
