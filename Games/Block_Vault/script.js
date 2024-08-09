// Elements
const block = document.querySelector("#block");
const score = document.getElementById("scoreSpan");
const character = document.querySelector("#character");

// Const variable
const lastKeys = [];

// Variable
let counter = 0;
let scores = [];
let playing = true;

// Functions
const loadScores = () => {
    scores = JSON.parse(localStorage.getItem("scores"));
    if (scores === null) scores = [];
};

const saveNewScore = () => {
    scores.push(counter);
    localStorage.setItem("scores", JSON.stringify(scores));
};

const jump = () => {
    if (character.classList === "animate") return;
    character.classList.add("animate");

    setTimeout(() => {
        character.classList.remove("animate");
    }, 300);
};

// Init, timer
const timer = setInterval(() => {
    const characterTop = parseInt( window.getComputedStyle(character).getPropertyValue("top") );
    const blockLeft = parseInt( window.getComputedStyle(block).getPropertyValue("left") );

    if (playing && blockLeft < 20 && blockLeft > -20 && characterTop >= 130) {
        const score_max = Math.max(...scores);

        saveNewScore();
        block.style.animation = "none";
        clearInterval(timer);

        if (counter > score_max) {
            alert("New RANK! Game score: " + Math.floor(counter / 100));
        } else {
            alert("Game score: " + Math.floor(counter / 100));
        }
        counter = 0;
        location.reload();
    } else {
        counter++;
        score.innerHTML = Math.floor(counter / 100);
    }
}, 10);

// Events
window.addEventListener("load", () => {
    loadScores();
});

document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowUp" || e.keyCode === 32) jump();
});

document.addEventListener("keypress", (e) => {
    lastKeys.push(e.key);
    if (lastKeys.length > 3) lastKeys.shift();
    if (lastKeys.join("") === "max") {
        if (playing === false) alert("You are already a max player!");
        else {
            alert("You are a cheater!");
            playing = false;
        }
    }
});
