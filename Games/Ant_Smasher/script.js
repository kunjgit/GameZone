const holes = document.querySelectorAll(".hole");
const scoreBoard = document.querySelectorAll(".score")[0];
const finalScore = document.querySelectorAll(".score")[1];
const moles = document.querySelectorAll(".mole");
let lastHole;
let timeUp = false;
let score = 0;
let totalScore = 0;

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function peep() {
  const time = randomTime(500, 2000);
  const hole = randomHole(holes);
  totalScore++;
  hole.classList.add("up");
  setTimeout(() => {
    hole.classList.remove("up");
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  scoreBoard.textContent = 0;
  finalScore.textContent = 0;
  timeUp = false;
  score = 0;
  totalScore = 0;

  peep();
  setTimeout(() => {
    timeUp = true;
    finalScore.textContent = score+ '/' + totalScore;
  }, 10000);
}

function bonk(e) {
  if (!e.isTrusted) return; // cheater!
  score++;
  this.parentNode.classList.remove("up");
  scoreBoard.textContent = score;
  if (timeUp) {
    finalScore.textContent = score+'/'+totalScore;
  }
}

moles.forEach((mole) => mole.addEventListener("click", bonk));
