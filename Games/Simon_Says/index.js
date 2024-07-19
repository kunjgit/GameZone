const saveKeyScore = "highscore"; //save key for local storage of highscore
var patternCreated = [];
var patternClicked = [];
var level = 1;
var highScore;
var gameOn = false;
var correctTill = 0;
var aise = 1;

// selecting 4 buttons
let greenBtn = document.getElementById("green");
let redBtn = document.getElementById("red");
let yellowBtn = document.getElementById("yellow");
let blueBtn = document.getElementById("blue");

// function to disable all color Btns
const disableBtns = () => {
    greenBtn.style.pointerEvents = "none";
    redBtn.style.pointerEvents = "none";
    yellowBtn.style.pointerEvents = "none";
    blueBtn.style.pointerEvents = "none";
};
// function to enable all color Btns
const enableBtns = () => {
    greenBtn.style.pointerEvents = "all";
    redBtn.style.pointerEvents = "all";
    yellowBtn.style.pointerEvents = "all";
    blueBtn.style.pointerEvents = "all";
};

if (!gameOn) {
    enableBtns(); //enable buttons after keypress
    gameOn = true;
    $(document).on("keypress", gameStarts);
}

window.onload = function highsc() {
    disableBtns(); // disable buttons until keypress
    var scoreStr = localStorage.getItem(saveKeyScore);
    if (scoreStr == null) {
        highScore = 0;
    } else {
        highScore = parseInt(scoreStr);
    }
    $(".highScore").text(highScore);
};

// When game starts
function gameStarts() {
    enableBtns(); // enable buttons after game starts
    patternCreated = [];
    patternClicked = [];
    $("h1").text("Press any Key to Start");
    level = 1;
    gameOn = true;
    //get the high score form  loacal storage
    var scoreStr = localStorage.getItem(saveKeyScore);
    if (scoreStr == null) {
        highScore = 0;
    } else {
        highScore = parseInt(scoreStr);
    }
    $(".highScore").text(highScore);
    correctTill = 0;
    levelUpdate(level);
    generatePattern();
}

//When Game Ends
function gameEnds() {
    $("h1").text("Game Over, Press Any Key to Restart");
    $(".highScore").text(highScore);
    $("body").addClass("game-over");
    var endSound = new Audio("sounds/wrong.mp3");
    endSound.play();
    setTimeout(function () {
        $("body").removeClass("game-over");
    }, 1000);
    gameOn = false;
    disableBtns(); // disable buttons after game over
}
/*******EventListener to button**************/
$(".btn").on("click", function () {
    btnClicked(this.id);
    checkPattern(this.id);
});
/*******Updating level string**************/
function levelUpdate(value) {
    $("h1").text(`Level ${value}`);
}
/*******Creating next pattern**************/
function generatePattern() {
    var randomNumber = Math.floor(Math.random() * 4) + 1;
    patternCreated.push(randomNumber);
    switch (randomNumber) {
        case 1:
            btnInPattern("green");
            break;
        case 2:
            btnInPattern("red");
            break;
        case 3:
            btnInPattern("blue");
            break;
        case 4:
            btnInPattern("yellow");
            break;
    }
    correctTill = 0;
}

/*******Checking button clicked is correct in pattern**************/
function checkPattern(value) {
    var num = 0;
    switch (value) {
        case "green":
            num = 1;
            break;
        case "red":
            num = 2;
            break;
        case "blue":
            num = 3;
            break;
        case "yellow":
            num = 4;
            break;
    }

    //Highscore button code
    if (patternCreated[correctTill] != num) {
        if (level > highScore) {
            highScore = level - 1;
            localStorage.setItem(saveKeyScore, highScore);
        }

        gameEnds();
    }
    correctTill++;
    if (correctTill == level) {
        level++;
        setTimeout(function () {
            levelUpdate(level);
            enableBtns(); //enable buttons after every level
            generatePattern();
        }, 500);
    }
}
/*******Pattern button effect**************/
function btnInPattern(value) {
    var audio = new Audio(`sounds/${value}.mp3`);
    audio.play();
    $(`.${value}`).fadeTo(100, 0.1).delay(10).fadeTo(100, 1);
}
/*******Creating a click effect on clicked button**************/
function btnClicked(value) {
    switch (value) {
        case "green":
            patternClicked.push(1);
            btnClickedView("green");
            break;
        case "red":
            patternClicked.push(2);
            btnClickedView("red");
            break;
        case "blue":
            patternClicked.push(3);
            btnClickedView("blue");
            break;
        case "yellow":
            patternClicked.push(4);
            btnClickedView("yellow");
            break;
    }
}
/*******Clicked button effect**************/
function btnClickedView(value) {
    var audio = new Audio(`sounds/${value}.mp3`);
    audio.play();
    $(`.${value}`).addClass("pressed");
    setTimeout(function () {
        $(`.${value}`).removeClass("pressed");
    }, 100);
}

$(".btn-rules").on("click", function () {
    $(".container-rules-overlay").toggleClass("box-show");
});
$(".btn-close").on("click", function () {
    $(".container-rules-overlay").toggleClass("box-show");
});

const openModalBtn = document.querySelector(".btn-rules");
const closeModalBtn = document.querySelector(".btn-close");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

console.log(modal);
console.log(overlay);
// close modal function
const closeModal = function () {
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
};

// close the modal when the close button and overlay is clicked
closeModalBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

// close modal when the Esc key is pressed
document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !modal.classList.contains("hidden")) {
        closeModal();
    }
});

// open modal function
const openModal = function () {
    modal.classList.remove("hidden");
    overlay.classList.remove("hidden");
};
// open modal event
openModalBtn.addEventListener("click", openModal);

/*Theme change*/

const body = document.querySelector("body");
const toggle = document.querySelector(".toggle");
const h1 = document.querySelector("h1");
const h2 = document.querySelector("h2");
const level_title = document.querySelector("#level-title");

toggle.addEventListener("click", () => {
    body.classList.toggle("dark")
        ? (toggle.firstElementChild.className = "far fa-moon")
        : (toggle.firstElementChild.className = "far fa-sun");
});

toggle.addEventListener("click", () => {
    level_title.classList.toggle("dark")
        ? (toggle.firstElementChild.className = "far fa-moon")
        : (toggle.firstElementChild.className = "far fa-sun");
});

toggle.addEventListener("click", () => {
    h2.classList.toggle("dark")
        ? (toggle.firstElementChild.className = "far fa-moon")
        : (toggle.firstElementChild.className = "far fa-sun");
});
