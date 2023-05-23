let score = document.querySelector("#score");
let timeLeft = document.querySelector("#timeleft");
const startGameButton = document.querySelector("#start");
const pauseGameButton = document.querySelector("#pause");
const squares = document.querySelectorAll(".square");
let scoreNum = 0;
let timeLeftNum = 60;
let randomNum;
let timerId = null;
let randomLionId = null;
let gameBgMusic = new Audio("./assets/gameMusic.mp3");
let onHitLion = new Audio("./assets/game-show.wav");
console.log(squares);

const arrangeLionRandomly = () => {
  squares.forEach((square) => {
    square.classList.remove("lion");
  });
  let randomNumSquare = squares[Math.floor(Math.random() * 9)];
  randomNumSquare.classList.add("lion");
  randomNum = randomNumSquare.id;
};

const countdownTimer = () => {
  timeLeftNum--;
  timeLeft.innerHTML = `Time Left ${timeLeftNum} s`;
  if (timeLeftNum === 0) {
    clearInterval(timerId);
    clearInterval(randomLionId);
    gameBgMusic.pause();
    // Add congratulatory message with the user's score
    score.innerHTML = `Congratulations! Your score is ${scoreNum}`;
  }
};

const startGame = () => {
  scoreNum = 0;
  timeLeftNum = 60;
  pauseGameButton.classList.remove("hidden");
  score.innerHTML = "Your score : 0";
  timeLeft.innerHTML = "Time Left : 60 s ";
  pauseGameButton.innerHTML = "Pause";
  gameBgMusic.currentTime = 0; // Reset the background music
  gameBgMusic.play();
  randomLionId = setInterval(arrangeLionRandomly, 1000);
  timerId = setInterval(countdownTimer, 1000);
};

const pauseResume = () => {
  if (pauseGameButton.textContent === "Pause") {
    gameBgMusic.pause();
    clearInterval(timerId);
    clearInterval(randomLionId);
    timerId = null;
    randomLionId = null;
    pauseGameButton.textContent = "Resume";
  } else if (pauseGameButton.textContent === "Resume") {
    gameBgMusic.play();
    randomLionId = setInterval(arrangeLionRandomly, 1000);
    timerId = setInterval(countdownTimer, 1000);
    pauseGameButton.textContent = "Pause";
  } else {
  }
};

squares.forEach((square) => {
  square.addEventListener("mousedown", () => {
    console.log(square.id, randomNum);
    if (timerId !== null) {
      if (square.id == randomNum) {
        onHitLion.play();
        setTimeout(() => {
          onHitLion.pause();
        }, 1000);
        scoreNum++;
        console.log(scoreNum);
        score.innerHTML = `
      Your Score ${scoreNum}
      `;
      }
    }
  });
});

startGameButton.addEventListener("click", startGame);
pauseGameButton.addEventListener("click", pauseResume);
