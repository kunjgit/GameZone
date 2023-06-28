import {
  getLocal,
  updateLocal,
  secondsLeft,
  timer,
  classWorker,
  clearTime,
  getLevelTime,
} from "./modules/utils.js";

import {
  checkPlayable,
  fireworksPlay,
  gameAudioPlay,
  highScoreAudio,
  lowScoreAudio,
  themeAudio,
} from "./modules/music.js";

const operators = ["+", "-", "*", "/"];
const body = document.querySelector("body");
const main = document.querySelector("main");
const scoreTag = document.querySelector(".header__info--score");
const start = document.querySelector(".popup__button--start");
const resultCont = document.querySelector(".result");
const footer = document.querySelector(".footer");
const buttons = resultCont.querySelectorAll("button");
const pyro = document.querySelector(".pyro");
const resultImg = document.querySelector(".result__img");
const highImg = document.querySelector(".result__high-score");
const pbImg = document.querySelector(".result__pb");
const starsCnt = document.querySelector(".result__stars");
let qaMap = {};
let randomAnswer1;
let randomAnswer2;
let score = 0;
let answers = [];
let asteroids_container = document.querySelector(".main__asteroids");
let asteroid_containers = document.querySelectorAll(
  ".main__asteroid-containerr"
);
let asteroids = "";
let eqAnswer;
let gameOptions = document.querySelectorAll(".footer__option");
const keys = {
  a: gameOptions[0],
  s: gameOptions[1],
  d: gameOptions[2],
  1: gameOptions[0],
  2: gameOptions[1],
  3: gameOptions[2],
};
let randomAsteroid;
let goldenTemplate = `<img
src="./assets/images/goldenstar.svg"
alt="golden-star"
class="result__star"
/>`;
let silverTemplate = `<img
src="./assets/images/silverstar.svg"
alt="silver-star"
class="result__star"
/>`;
footer.style.pointerEvents = "none";

// functions
// QA generation
function getRandomOperator() {
  return operators[Math.floor(Math.random() * operators.length)];
}

function getRandomNumber(no) {
  return Math.floor(Math.random() * no + 1);
}

function getRandomAnswer(ans) {
  if (ans < 10) {
    return getRandomNumber(10);
  }
  let randomAnswers = [
    Math.floor(Math.random() * ans),
    Math.floor(Math.random() * (ans + 100 - ans) + ans),
  ];
  return randomAnswers[Math.floor(Math.random() * 2)];
}

function getRandomAnswers(ans) {
  randomAnswer1 = getRandomAnswer(ans);
  randomAnswer2 = getRandomAnswer(ans);
  if (ans < 0) {
    randomAnswer1 = -1 * randomAnswer1;
    randomAnswer2 = -1 * randomAnswer2;
  }
  if (
    randomAnswer1 === ans ||
    randomAnswer2 === ans ||
    randomAnswer1 === randomAnswer2 ||
    answers.includes(randomAnswer1) ||
    answers.includes(randomAnswer2)
  ) {
    return getRandomAnswers(ans);
  } else {
    return [randomAnswer1, randomAnswer2];
  }
}

function generateRandomChoices(qaMap) {
  for (let val in qaMap) {
    let randomAnswers = getRandomAnswers(qaMap[val]);
    qaMap[val] = [qaMap[val], randomAnswers[0], randomAnswers[1]];
  }
}

function returnAnswer(op1, op2, op) {
  switch (op) {
    case "+":
      return op1 + op2;
    case "-":
      return op1 - op2;
    case "*":
      return op1 * op2;
    case "/":
      return (op1 * op2) / op2;
  }
}

function generateProblem() {
  let no = +getLocal("currentLevel") < 9 ? 10 : 15;
  let [op1, op2, op] = [
    getRandomNumber(no),
    getRandomNumber(no),
    getRandomOperator(),
  ];
  let eq = `${op1} ${op} ${op2}`;
  if (op === "/") {
    eq = `${op1 * op2} / ${op2}`;
  }
  let ans = returnAnswer(op1, op2, op);

  while (answers.includes(ans)) {
    [op1, op2, op] = [
      getRandomNumber(no),
      getRandomNumber(no),
      getRandomOperator(),
    ];
    eq = `${op1} ${op} ${op2}`;
    if (op === "/") {
      eq = `${op1 * op2} / ${op2}`;
    }
    ans = returnAnswer(op1, op2, op);
  }
  answers.push(ans);
  qaMap[eq] = ans;
}

function generateQA() {
  let questions = getLocal("gameQuestions");
  for (let i = 0; i < questions; i++) {
    generateProblem();
  }
  generateRandomChoices(qaMap);
}

generateQA();

// asteroids
asteroid_containers.forEach((container) => {
  container.remove();
});

for (let q in qaMap) {
  eqAnswer = qaMap[q][0];
  asteroids += `<div class="main__asteroid-container" data-ans="${eqAnswer}" data-all="${qaMap[q]}">
  <h2 class="main__asteroid-problem">${q}</h2>
  <img src="./assets/images/asteroid.png" alt="asteroid" class="main__asteroid" />
</div>`;
}
asteroids_container.innerHTML = asteroids;

// don't replace
let gameAsteroids = [...document.querySelectorAll(".main__asteroid-container")];

function randIndex(index) {
  return Math.floor(Math.random() * index);
}

function assignOptions() {
  randomAsteroid = gameAsteroids.splice(randIndex(gameAsteroids.length), 1)[0];
  if (!randomAsteroid) {
    endGame();
    return;
  }
  let values = randomAsteroid.dataset.all.split(",");
  let done = [];
  values.forEach((e) => {
    let ri = randIndex(3);
    while (done.includes(ri)) {
      ri = randIndex(3);
    }
    done.push(ri);
    gameOptions[ri].textContent = e;
    gameOptions[ri].dataset.value = e;
  });
}

function validateAnswer(value) {
  let target = document.querySelector(`[data-ans="${value}"]`);
  if (target) {
    target.remove();
    if (checkPlayable()) gameAudioPlay(0);
    scoreTag.innerText = ++score;
  } else {
    randomAsteroid.querySelector("h2").style.color = "red";
    if (checkPlayable()) gameAudioPlay(1);
    activateAnimation();
  }
  assignOptions();
}

function activateAnimation() {
  main.style.animation = "shake .3s linear 1";
  body.style.backgroundColor = "#ff000070";
  body.style.overflow = "hidden";
}

main.addEventListener("animationend", function (e) {
  body.style.backgroundColor = "initial";
  body.style.overflow = "initial";
  main.style.animation = "none";
});

gameOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    validateAnswer(e.target.textContent.trim());
  });
});

// star updation
function updateStars(percent) {
  if (percent < 50) return;

  if (percent >= 50 && percent < 75) {
    starsCnt.innerHTML = goldenTemplate + silverTemplate + silverTemplate;
  } else if (percent >= 75 && percent < 100) {
    starsCnt.innerHTML = goldenTemplate + goldenTemplate + silverTemplate;
  } else {
    starsCnt.innerHTML = goldenTemplate + goldenTemplate + goldenTemplate;
  }
}

// game end
function calculatePercentage(ques, score) {
  return (score / ques) * 100;
}

function showHighScoreGif() {
  if (checkPlayable()) {
    themeAudio.pause();
    fireworksPlay();
    highScoreAudio.play();
  }
  classWorker("none", "remove", pyro, highImg);
  classWorker("none", "add", resultImg);
}

function showPersonalBestGif() {
  if (checkPlayable()) {
    themeAudio.pause();
    fireworksPlay();
    highScoreAudio.play();
  }
  classWorker("none", "remove", pyro, pbImg);
  classWorker("none", "add", resultImg);
}

function updateNewScore(localjson, currLevel, currTime, currPercentage) {
  showHighScoreGif();
  localjson[currLevel][0] = "played";
  localjson[currLevel][1] = currTime;
  localjson[currLevel][2] = currPercentage;

  let next = (+currLevel + 1) % 10;
  if (next === 0) {
    next = 10;
    updateLocal("allDone", "yes");
  }
  if (getLocal("allDone") === "yes") {
    updateLocal("currentLevel", 10);
    localjson[10][0] = "played";
  } else {
    updateLocal("currentLevel", next);
    localjson[next][0] = "current";
  }
}

function endGame() {
  clearTime();
  window.removeEventListener("keyup", listenKeys);
  let localjson = JSON.parse(getLocal("levelValue"));
  let currTime = +getLocal("gameTime") - (secondsLeft < 0 ? 0 : secondsLeft);
  if (!currTime) {
    currTime = 1;
  }
  let ques = getLocal("gameQuestions");
  let currPercentage = Math.floor(
    calculatePercentage(ques, +scoreTag.innerText)
  );
  let currBestTime = +getLocal("gameBestTime") || 0;
  let previousPercentage = +getLocal("gamePercentage") || 0;
  let currLevel = `${getLocal("gameLevel")}`;

  endResult(ques, currTime, currPercentage);
  const buttons = resultCont.querySelectorAll("button");
  buttons[1].disabled = false;

  updateStars(currPercentage);

  if (localjson[currLevel][0] === "current" && currPercentage >= 50) {
    updateNewScore(localjson, currLevel, currTime, currPercentage);
  } else if (currPercentage > previousPercentage && currPercentage >= 50) {
    showHighScoreGif();
    localjson[currLevel][1] = currTime;
    localjson[currLevel][2] = currPercentage;
  }

  if (
    currPercentage >= 50 &&
    currPercentage === previousPercentage &&
    currTime <= currBestTime
  ) {
    showPersonalBestGif();
    localjson[currLevel][1] = currTime;
  }

  if (localjson[currLevel][0] === "current") {
    document.getElementById("next-lvl").classList.add("none");
  }
  if (currPercentage < 50) {
    if (checkPlayable()) {
      lowScoreAudio.play();
    }
  }
  updateLocal("gameBestTime", localjson[currLevel][1]);
  updateLocal("gamePercentage", localjson[currLevel][2]);
  updateLocal("levelValue", JSON.stringify(localjson));
}

function naviCaller() {
  if (this.dataset.value === "next") {
    let nextLevel = (+getLocal("gameLevel") + 1) % 10;
    if (nextLevel === 0) {
      nextLevel = 10;
    }
    let localjson = JSON.parse(getLocal("levelValue"));

    updateLocal("gameLevel", nextLevel);
    updateLocal("gameTime", getLevelTime(nextLevel));
    updateLocal("gameBestTime", localjson[nextLevel][1]);
    updateLocal("gamePercentage", localjson[nextLevel][2]);
    updateLocal("gameQuestions", localjson[nextLevel][3]);

    location.reload();
  } else if (this.dataset.value === "again") {
    location.reload();
  }
}

function updateText(element, text) {
  document.querySelector(element).textContent = text;
}

function endResult(gameQues, seconds, percent) {
  classWorker(
    "none",
    "add",
    asteroids_container,
    footer,
    document.querySelector(".header")
  );
  classWorker("none", "remove", resultCont);
  updateText(".result__percent", `${percent} %`);
  updateText(".result__score span", `${scoreTag.textContent}`);
  updateText(".result__time span", `${seconds} s`);
  updateText(".result__targets span", `${gameQues}`);
  updateText(".result__missed span", `${gameQues - scoreTag.textContent}`);
}

function timerCheck() {
  if (secondsLeft < 0) {
    endGame();
    return;
  }
  setTimeout(timerCheck, 1000);
}

function listenKeys(e) {
  switch (e.key) {
    case "a":
    case "s":
    case "d":
      validateAnswer(keys[e.key].textContent.trim());
  }
}

// event listeners
buttons.forEach((data) => {
  data.addEventListener("click", naviCaller);
});

start.addEventListener("click", () => {
  window.addEventListener("keyup", listenKeys);
  footer.style.pointerEvents = "unset";
  timer(getLocal("gameTime"));
  timerCheck();
  classWorker("none", "add", start.parentElement);
  classWorker("none", "remove", document.querySelector(".main__asteroids"));
});

window.addEventListener("load", assignOptions);
