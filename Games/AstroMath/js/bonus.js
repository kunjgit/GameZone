import {
  soundToggle,
  playMusic,
  checkPlayable,
  highScoreAudio,
  lowScoreAudio,
  gameAudioPlay,
  themeAudio,
  fireworksPlay,
} from "./modules/music.js";
import {
  body,
  getLocal,
  updateLocal,
  containsClass,
  secondsLeft,
  timer,
  classWorker,
  clearTime,
} from "./modules/utils.js";

const options = document.querySelectorAll("button");
const questions = document.querySelectorAll(".main__question");
const item = document.querySelectorAll(".main__item");
const header = document.querySelector("header");
const result = document.querySelector(".result");
const itemRight = document.querySelector(".main__item--right");
const itemLeft = document.querySelector(".main__item--left");
const start = document.querySelector(".popup__button--start");
const score = document.querySelector(".header__info--score");
const quote = document.querySelector(".result__quotes");
const highImg = document.querySelector(".result__high-score");
const resultImg = document.querySelector(".result__img");
const pyro = document.querySelector(".pyro");
const lifeContainer = document.querySelector(".life");
const operators = ["+", "-", "*"];
const quotes = {
  positve: ["You Did it!", "You crushed your high score!", "AHHHH Improved!"],
  negative: [
    "OOOPS! You didn't make it.",
    "No worries! Try again.",
    "Don't lose hope, you can!",
  ],
  nothin: ["Yep! Same level"],
};
let highScore = document.querySelector(".result__highscore");
let currentScore = document.querySelector(".result__score");
let correctAnswer = undefined;
let soundSrc;
let playable;
itemRight.style.pointerEvents = "none";
itemLeft.style.pointerEvents = "none";

// functions
function getRandomOperator() {
  return operators[Math.floor(Math.random() * operators.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 10 + 1);
}

function returnAnswer(op1, op2, op) {
  switch (op) {
    case "+":
      return op1 + op2;
    case "-":
      return op1 - op2;
    case "*":
      return op1 * op2;
  }
}

function getItems() {
  return [getRandomNumber(), getRandomNumber(), getRandomOperator()];
}

function generateRandomProblem() {
  let [op1, op2, op] = getItems();
  let eq1 = `${op1} ${op} ${op2}`;
  let ans1 = returnAnswer(op1, op2, op);

  [op1, op2, op] = getItems();
  let eq2 = `${op1} ${op} ${op2}`;
  let ans2 = returnAnswer(op1, op2, op);

  while (ans1 === ans2 || eq1 === eq2) {
    [op1, op2, op] = getItems();
    eq2 = `${op1} ${op} ${op2}`;
    ans2 = returnAnswer(op1, op2, op);
  }
  return [eq1, eq2, false];
}

let allPossible;
function getAllDivisor(ans) {
  allPossible = [];
  if (ans < 0) {
    ans *= -1;
  }
  allPossible.push(1);
  for (let i = 2; i <= ans / 2; i++) {
    if (!(ans % i)) {
      allPossible.push(i);
    }
  }
}

function generateCorrectProblem() {
  let eq1op1 = getRandomNumber();
  let x = getRandomNumber();
  let eq1op = getRandomOperator();
  let eq1op2 = getRandomNumber();
  let ans1 = returnAnswer(eq1op1 * x, eq1op2, eq1op);

  let eq2op1 = getRandomNumber();
  let eq2op = getRandomOperator();
  let eq2op2 = "z";
  let temp = eq2op1 * x * -1;
  eq2op2 = ans1 + temp;

  if (eq2op === "*") {
    let rand1, rand2, val, a, b, eq1, eq2;
    getAllDivisor(ans1);
    let randgen =
      allPossible.length === 1
        ? 0
        : Math.floor(Math.random() * (allPossible.length - 1) + 1);
    a = allPossible[randgen];
    b = ans1 / a;
    if (ans1 === 0) {
      rand1 = `0 * ${getRandomNumber()}`;
      rand2 = `${getRandomNumber()} * 0`;
      val = [rand1, rand2];
      eq2 = val[Math.floor(Math.random() * val.length)];
    } else if (ans1 < 0) {
      rand1 = `${a} * ${b}`;
      rand2 = `${b} * ${a}`;
      val = [rand1, rand2];
      eq2 = val[Math.floor(Math.random() * val.length)];
    } else {
      eq2 = `${a} * ${b}`;
    }
    eq1 = `${eq1op1 * x} ${eq1op} ${eq1op2}`;
    return [eq1, eq2, true];
  }

  if (eq2op === "-") {
    eq2op2 *= -1;
  }
  if (eq2op2 < 0 && eq2op === "-") {
    eq2op = "+";
    eq2op2 *= -1;
  }
  if (eq2op2 < 0 && eq2op === "+") {
    eq2op = "-";
    eq2op2 *= -1;
  }
  let eq1 = `${eq1op1 * x} ${eq1op} ${eq1op2}`;
  let eq2 = `${eq2op1 * x} ${eq2op} ${eq2op2}`;

  return [eq1, eq2, true];
}

function randomRandomProblem() {
  let random = getRandomNumber();
  if (random % 2) {
    return generateRandomProblem();
  } else {
    return generateCorrectProblem();
  }
}

function populate() {
  let items = randomRandomProblem();
  correctAnswer = items[2];
  questions[0].textContent = items[0];
  questions[1].textContent = items[1];
}

function addListeners() {
  window.addEventListener("keyup", init);
  itemRight.addEventListener("click", init);
  itemLeft.addEventListener("click", init);
}

function removeListeners() {
  window.removeEventListener("keyup", init);
  itemRight.removeEventListener("click", init);
  itemLeft.removeEventListener("click", init);
}

let bonusStreak = 0;
function streakHelper(wrong = false) {
  if (wrong) {
    bonusStreak = 0;
    return;
  }
  if (bonusStreak === 4 && lifeContainer.childElementCount < 6) {
    lifeContainer.innerHTML += `<img
    src="./assets/images/meteorlife.svg"
    alt="Life"
    class="life__img"
  />`;
    bonusStreak = 0;
  } else {
    bonusStreak = (bonusStreak + 1) % 5;
  }
}

function left() {
  removeListeners();
  if (checkPlayable()) {
    gameAudioPlay(1);
  }
  streakHelper(true);
  lifeContainer.lastElementChild ? lifeContainer.lastElementChild.remove() : "";
  classWorker("bg-wrong", "add", item[0], item[1]);
  if (lifeContainer.childElementCount === 0) {
    endGame();
    return;
  }
  setTimeout(() => {
    classWorker("bg-wrong", "remove", item[0], item[1]);
    if (lifeContainer.childElementCount === 0) {
      endGame();
      return;
    }
    populate();
    addListeners();
  }, 300);
}

function right() {
  removeListeners();
  if (checkPlayable()) {
    gameAudioPlay(0);
  }
  streakHelper();
  score.textContent = +score.textContent + 1;
  classWorker("bg-correct", "add", item[0], item[1]);
  setTimeout(() => {
    classWorker("bg-correct", "remove", item[0], item[1]);
    populate();
    addListeners();
  }, 300);
}

function init(e) {
  if (e.key === "d" || e.target.dataset.side === "left") {
    if (correctAnswer) {
      right();
    } else {
      left();
    }
  } else if (e.key === "a" || e.target.dataset.side === "right") {
    if (!correctAnswer) {
      right();
    } else {
      left();
    }
  }
}

function timerCheck() {
  if (secondsLeft < 0) {
    endGame();
    return;
  }
  setTimeout(timerCheck, 1000);
}

function endGame() {
  clearTime();
  removeListeners();
  updateScore();
  +score.textContent > +getLocal("bonusHighScore")
    ? updateLocal("bonusHighScore", score.textContent)
    : "";
  classWorker("none", "add", header, itemRight, itemLeft, lifeContainer);
  classWorker("none", "remove", result);
}

function updateScore() {
  let qono = Math.floor(Math.random() * 3);
  let high = +getLocal("bonusHighScore") || 0;
  let current = +score.textContent;
  highScore.innerHTML = `Previous High Score: <span class="secondary-color">${high}</span>`;
  currentScore.innerHTML = `Current Score: <span class="secondary-color">${current}</span>`;
  if (current > high) {
    quote.textContent = quotes.positve[qono];
    classWorker("none", "add", resultImg);
    classWorker("none", "remove", highImg, pyro);
    if (checkPlayable()) {
      themeAudio.pause();
      fireworksPlay();
      highScoreAudio.play();
    }
  } else if (current < high) {
    if (checkPlayable()) {
      lowScoreAudio.play();
    }
    quote.textContent = quotes.negative[qono];
  } else {
    if (checkPlayable()) {
      lowScoreAudio.play();
    }
    quote.textContent = quotes.nothin[0];
  }
}
function navigate(e) {
  if (e.target.dataset.value === "again") {
    location.reload();
  } else if (e.target.dataset.value === "exit") {
    location.href = "./astro-math-levels.html";
  }
}

// event listeners
options.forEach((option) => {
  option.addEventListener("click", navigate);
});

soundToggle.addEventListener("click", (e) => {
  soundSrc = soundToggle.src;
  if (soundSrc.includes("soundon")) {
    soundToggle.src = "./assets/images/soundoff.svg";
    updateLocal("currentSoundSrc", "./assets/images/soundoff.svg");
    playable = false;
  } else {
    soundToggle.src = "./assets/images/soundon.svg";
    updateLocal("currentSoundSrc", "./assets/images/soundon.svg");
    playable = true;
  }
  playMusic(playable);
});

window.onload = function () {
  if (getLocal("allDone") === "no") {
    body.innerHTML = "";
    body.innerHTML = `<div class="popup__blocker">
    <h1>You Need to unlock <span class="secondary-color">level 10</span> to access this Game</h1>
  </div>`;
    setTimeout(() => {
      location.href = "./index.html";
    }, 5000);
    return;
  }
  if (containsClass(body, "not-home")) {
    soundToggle.src = getLocal("currentSoundSrc") || soundToggle.src;

    if (checkPlayable()) {
      playable = true;
    }
    playMusic(playable);
  } else {
    getLocal("currentSoundSrc")
      ? ((soundToggle.src = getLocal("currentSoundSrc")),
        (playable = checkPlayable()))
      : (updateLocal("currentSoundSrc", soundToggle.src), (playable = true));
  }
  localStorage.removeItem("soundTime");
};

start.addEventListener("click", () => {
  window.addEventListener("keyup", init);
  itemRight.addEventListener("click", init);
  itemLeft.addEventListener("click", init);
  itemRight.style.pointerEvents = "unset";
  itemLeft.style.pointerEvents = "unset";
  timer(120);
  timerCheck();
  classWorker("none", "add", start.parentElement);
  populate();
});
document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.querySelector('.loader').classList.remove('none');
  } else {
    document.querySelector('.loader').classList.add('none');
  }
};