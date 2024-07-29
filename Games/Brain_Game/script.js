var timeBar = document.getElementById('timeBar');
var colors = document.getElementById('colors');
var scr = document.getElementById('scr');
var score = 0;
var i, j;
var tick = document.getElementById('right');
var cross = document.getElementById('wrong');
var startBt = document.getElementById('startBt');
var disp = document.getElementById('disp');
var scoreDiv = document.querySelector('.score');
var controlDiv = document.querySelector('.control');

function start() {
    timeBar.classList.add("timeBar");
    col();
    startBt.style.display = "none";
    disp.style.display = "grid";
    scoreDiv.style.display = "grid";
    controlDiv.style.display = "flex";
    tick.style.cursor = "pointer";
    cross.style.cursor = "pointer";
}

function out() {
    alert(`Out! Your score is ${score}`);
    score = 0;
    timeBar.classList.remove("timeBar");
    startBt.style.display = "block";
    disp.style.display = "none";
    scoreDiv.style.display = "none";
    controlDiv.style.display = "none";
    tick.style.cursor = "not-allowed";
    cross.style.cursor = "not-allowed";
}

function col() {
    var col = ['red', 'green', 'blue', 'yellow', 'purple'];
    i = Math.floor(Math.random() * 5);
    j = Math.floor(Math.random() * 5);
    colors.innerText = col[i];
    colors.style.color = col[j];
}

function wrong() {
    if (i !== j) {
        col();
        score++;
        timeBar.classList.remove("timeBar");
        cross.classList.add("clicked");
        setTimeout(() => {
            timeBar.classList.add("timeBar");
            cross.classList.remove("clicked");
        }, 200);
    } else {
        out();
    }
}

function right() {
    if (i === j) {
        col();
        score++;
        timeBar.classList.remove("timeBar");
        tick.classList.add("clicked");
        setTimeout(() => {
            timeBar.classList.add("timeBar");
            tick.classList.remove("clicked");
        }, 200);
    } else {
        out();
    }
}

document.onkeydown = function(e) {
    if (e.keyCode === 37) {
        right();
    }
    if (e.keyCode === 39) {
        wrong();
    }
}

var myInt = setInterval(() => {
    var timeWidth = timeBar.offsetWidth;
    var maxWidth = document.getElementById('prg').offsetWidth;
    if (timeWidth > maxWidth) {
        alert(`Timeout! Your score is ${score}`);
        timeBar.classList.remove("timeBar");
        setTimeout(() => {
            score = 0;
            scr.innerText = score;
            startBt.style.display = "block";
            disp.style.display = "none";
            scoreDiv.style.display = "none";
            controlDiv.style.display = "none";
            tick.style.cursor = "not-allowed";
            cross.style.cursor = "not-allowed";
        }, 100);
    } else {
        scr.innerText = score;
    }
}, 1);
