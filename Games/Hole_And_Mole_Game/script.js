// Selecting all the elements from the DOM
const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelector(".score");
const moles = document.querySelectorAll(".mole");
const startBtn = document.querySelector(".start-btn");
const levels = document.querySelector(".levels");
const game = document.querySelector(".game");

let lastHole;
let timeUp = false;
let score = 0;

function difficultyLevel() {
  const ele = document.getElementsByName("level");
  for (let i = 0; i < ele.length; i++) {
    if (ele[i].checked) {
      return ele[i].id;
    }
  }
}

// random time between min and max
function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Select a random hole to pop up the mole
function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

// make the mole appear and disappear
function peep(show, hide) {
  const time = randomTime(show, hide);
  const hole = randomHole(holes);
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) {
      peep(show, hide);
    }
  }, time);
}

function startGame() {
  let show, hide;
  const difficulty = difficultyLevel();
  if (difficulty === "easy") {
    show = 500;
    hide = 1500;
  } else if (difficulty === "medium") {
    show = 200;
    hide = 1000;
  } else {
    show = 100;
    hide = 800;
  }

  // hiding start button while game running
  scoreBoard.textContent = 0;
  timeUp = false;
  startBtn.innerHTML = "running..";
  startBtn.disabled = true;
  levels.style.visibility = "hidden";
  score = 0;

  // Start the game by making moles appear
  peep(show, hide);

  // Finish the game after 15 seconds
  setTimeout(() => {
    timeUp = true;
    startBtn.innerHTML = "start!";
    startBtn.disabled = false;
    levels.style.visibility = "visible";
  }, 15000);
}

// update the score on clicking the mole
function hitTheMole(e) {
  if (!e.isTrusted) {
    return;
  }
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
}

moles.forEach((mole) => mole.addEventListener("click", hitTheMole));
