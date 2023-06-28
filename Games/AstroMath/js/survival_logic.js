import {
  checkPlayable,
  highScoreAudio,
  lowScoreAudio,
  gameAudioPlay,
  themeAudio,
  fireworksPlay,
} from "./modules/music.js";
import {
  getLocal,
  updateLocal,
  secondsLeft,
  timer,
  classWorker,
  clearTime,
} from "./modules/utils.js";

const body = document.querySelector("body");
const main = document.querySelector("main");
const scoreTag = document.querySelector(".header__info--score");
const start = document.querySelector(".popup__button--start");
const resultCont = document.querySelector(".result");
const resultImg = document.querySelector(".result__img");
const buttons = resultCont.querySelectorAll("button");
const footer = document.querySelector(".footer");
const highImg = document.querySelector(".result__high-score");
const quoteTag = document.querySelector(".result__quotes");
const pyro = document.querySelector(".pyro");
const quotes = {
  positve: [
    "You Did it!",
    "You crushed your previous score!",
    "AHHHH Improved!",
  ],
  negative: [
    "OOOPS! You didn't make it.",
    "No worries! Try again.",
    "Don't lose hope, you can!",
  ],
  nothin: ["Yep! Same level"],
};
const operators = ["+", "-", "*", "/"];
const lifeCnt = document.querySelector(`.life`);
let randomAsteroid;
let qaMap = {};
let randomAnswer1,
  randomAnswer2,
  score = 0;
let answers = [];
let asteroids_container = document.querySelector(".main__asteroids");
let asteroid_containers = document.querySelectorAll(
  ".main__asteroid-containerr"
);
let asteroids = "";
let eqAnswer, gameAsteroids;
let ast_cnt = 3;
let ans_cnt = 0;
let gameOptions = document.querySelectorAll(".footer__option");
const keys = {
  a: gameOptions[0],
  s: gameOptions[1],
  d: gameOptions[2],
  1: gameOptions[0],
  2: gameOptions[1],
  3: gameOptions[2],
};
footer.style.pointerEvents = "none";

// functions
// QA generation
function getRandomOperator() {
  return operators[Math.floor(Math.random() * operators.length)];
}

function getRandomNumber() {
  return Math.floor(Math.random() * 15 + 1);
}

function getRandomAnswer(ans) {
  if (ans < 10) {
    return getRandomNumber();
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
  let [op1, op2, op] = [
    getRandomNumber(),
    getRandomNumber(),
    getRandomOperator(),
  ];
  let eq = `${op1} ${op} ${op2}`;
  if (op === "/") {
    eq = `${op1 * op2} / ${op2}`;
  }
  let ans = returnAnswer(op1, op2, op);

  while (answers.includes(ans)) {
    [op1, op2, op] = [
      getRandomNumber(),
      getRandomNumber(),
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

function generateQA(questions) {
  for (let i = 0; i < questions; i++) {
    generateProblem();
  }
  generateRandomChoices(qaMap);
}

generateQA(5);

// asteroids
function updateAsteroids() {
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
  gameAsteroids = [...document.querySelectorAll(".main__asteroid-container")];
}
updateAsteroids();

// options
function randIndex(index) {
  return Math.floor(Math.random() * index);
}

function assignOptions() {
  randomAsteroid = gameAsteroids.splice(randIndex(gameAsteroids.length), 1)[0];
  if (!randomAsteroid) {
    asteroids = "";
    answers.splice(0, answers.length);
    qaMap = {};
    generateQA(5);
    updateAsteroids();
    assignOptions();
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

function updateBonus() {
  if (ans_cnt == 5 && ast_cnt < 6) {
    ans_cnt = 0;
    let img = `<img
        data-value="${++ast_cnt}"
        src="./assets/images/meteorlife.svg"
        alt="Life"
        class="life__img"
        />`;
    lifeCnt.innerHTML += img;
  } else if (ans_cnt == 5) {
    ans_cnt = 0;
  }
}

function answerValidate(value) {
  let target = document.querySelector(`[data-ans="${value}"]`);
  if (target) {
    target.remove();
    if (checkPlayable()) gameAudioPlay(0);
    scoreTag.innerText = ++score;
    ans_cnt++;
    updateBonus();
  } else {
    ans_cnt = 1;
    document.querySelector(`.life__img[data-value='${ast_cnt--}']`).remove();
    randomAsteroid.querySelector("h2").style.color = "red";
    if (checkPlayable()) gameAudioPlay(1);
    activateAnimation();
    if (ast_cnt == 0) {
      endGame();
    }
  }
  assignOptions();
}

function activateAnimation() {
  main.style.animation = "shake .3s linear 1";
  body.style.backgroundColor = "#ff000070";
  body.style.overflow = "hidden";
}

// end Game
function endGame() {
  let qono = Math.floor(Math.random() * 3);

  clearTime();
  window.removeEventListener("keyup", listenKeys);
  lifeCnt.style.display = "none";

  let bestScore = +getLocal("survivalScore");
  let score = +scoreTag.innerText;

  if (score > bestScore) {
    classWorker("none", "remove", highImg, pyro);
    classWorker("none", "add", resultImg);
    quoteTag.innerText = quotes.positve[qono];
    updateLocal("survivalScore", score);
    if (checkPlayable()) {
      themeAudio.pause();
      fireworksPlay();
      highScoreAudio.play();
    }
  } else if (score < bestScore) {
    quoteTag.innerText = quotes.negative[qono];
    if (checkPlayable()) {
      lowScoreAudio.play();
    }
  } else {
    if (checkPlayable()) {
      lowScoreAudio.play();
    }
    quoteTag.innerText = quotes.nothin[0];
  }
  endResult(bestScore);
}

function naviCaller() {
  location.reload();
}

function updateText(element, text) {
  document.querySelector(element).textContent = text;
}

function endResult(bs) {
  classWorker(
    "none",
    "add",
    asteroids_container,
    footer,
    document.querySelector(".header")
  );
  classWorker("none", "remove", resultCont);
  updateText(".result__score span", `${scoreTag.textContent}`);
  updateText(".result__prescore span", `${bs}`);
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
      answerValidate(keys[e.key].textContent.trim());
  }
}

// event listeners
main.addEventListener("animationend", function (e) {
  body.style.backgroundColor = "initial";
  body.style.overflow = "initial";
  main.style.animation = "none";
});

gameOptions.forEach((option) => {
  option.addEventListener("click", (e) => {
    answerValidate(e.target.textContent.trim());
  });
});

start.addEventListener("click", () => {
  window.addEventListener("keyup", listenKeys);
  footer.style.pointerEvents = "unset";
  timer(120);
  timerCheck();
  classWorker("none", "add", start.parentElement);
  classWorker("none", "remove", document.querySelector(".main__asteroids"));
});

buttons.forEach((data) => {
  data.addEventListener("click", naviCaller);
});

window.addEventListener("load", () => {
  if (+getLocal("currentLevel") < 5) {
    body.innerHTML = "";
    body.innerHTML = `<div class="popup__blocker">
    <h1>You Need to unlock <span class="secondary-color">level 5</span> to access this Game</h1>
  </div>`;
    setTimeout(() => {
      location.href = "./index.html";
    }, 5000);
    return;
  }
  assignOptions();
});
document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.querySelector('.loader').classList.remove('none');
  } else {
    document.querySelector('.loader').classList.add('none');
  }
};