let scoreSection = document.querySelector("#score-section");
let gameContainer = document.querySelector("#game-container");
let startButton = document.querySelector(".start-btn");
let pauseResumeButton = document.querySelector(".pause-resume-btn");
let squares = document.querySelectorAll(".square");

let highScoreH3 = document.querySelector(".highScore");
let yourScoreH3 = document.querySelector(".yourScore");
let timeLeftH3 = document.querySelector(".timeLeft");
let gameMusic = new Audio("Assets/gameMusic.mp3");
let hitMusic = new Audio("Assets/hitMusic.mp3");

let highScore = 0;
let yourScore = 0;
let timeLeft = 30;
let hitPosition = null;
let timerId = null;
let randomMoleId = null;
let gameInitializing = false; // made a variable so that system can have suffient time for setup



startButton.addEventListener("click", () => {
    if (!gameInitializing) {
      // hence game will not be disturbed even after simultaneous clicks on start button

      // Disable the start button to prevent multiple clicks
      startButton.disabled = true;
      gameInitializing = true;

      // Clear existing intervals before starting new ones
      clearInterval(timerId);
      clearInterval(randomMoleId);

      scoreSection.classList.remove("hide");
      timeLeftH3.classList.remove("hide");
      pauseResumeButton.classList.remove("hide");
      gameContainer.classList.remove("hide");

      gameMusic.currentTime = 0;
      gameMusic.play();

      timeLeft = 30;
      timerId = setInterval(countDown, 1000);
      randomMoleId = setInterval(randomMole, 1000);

      let highScoreLibrary = localStorage.getItem("highScore");
      if (highScoreLibrary == null) {
        highScoreH3.innerHTML = `High Score: ${highScore}`;
      } else {
        highScoreH3.innerHTML = `High Score: ${highScoreLibrary}`;
      }

      yourScore = 0;
      yourScoreH3.innerHTML = `Your Score: ${yourScore}`;

      // After initialization is complete, enable the start button
      startButton.disabled = false;
      gameInitializing = false;
    }
})


pauseResumeButton.addEventListener("click", () => {
    if (pauseResumeButton.innerText == "Pause") {
        pauseResumeButton.innerText = "Resume";
        gameMusic.pause();

        clearInterval(timerId);
        clearInterval(randomMoleId);

        timerId = null;
        randomMoleId = null;
    }
    else {
        pauseResumeButton.innerText = "Pause";
        gameMusic.play();

        timerId = setInterval(countDown, 1000);
        randomMoleId = setInterval(randomMole, 1000);
    }
})


function countDown() {
    timeLeftH3.innerHTML = `Time Left: ${timeLeft}`;
    timeLeft--;

    if (timeLeft == 0) {
        gameMusic.pause();
        clearInterval(timerId);
        clearInterval(randomMoleId);

        timeLeftH3.classList.add("hide");
        pauseResumeButton.classList.add("hide");
        gameContainer.classList.add("hide");
    }
}


function randomMole() {
    if (timerId != null && randomMoleId != null) {
            squares.forEach((squares) => {
              squares.classList.remove("mole");
            });

            let randomSquare =
              squares[Math.floor(Math.random() * squares.length)];
            randomSquare.classList.add("mole");
            hitPosition = randomSquare.id;
    }
}


function storeHighScore() {
    let highScoreLibrary = localStorage.getItem("highScore");

    if (highScoreLibrary == null) {
        highScore = 1;
        highScoreLibrary = localStorage.setItem("highScore", highScore);
        highScoreH3.innerHTML = `High Score: ${highScore}`;
    }
    else {
        if (yourScore > highScoreLibrary) {
            highScore = yourScore;
            highScoreLibrary = localStorage.setItem("highScore", highScore);
            highScoreH3.innerHTML = `High Score: ${highScore}`;
        }
    }
}


squares.forEach(squares => {
    squares.addEventListener("mousedown", () => {
        if (timerId != null) {
            if (squares.id == hitPosition) {
                hitMusic.play();

                setTimeout(() => {
                    hitMusic.currentTime = 0;
                    hitMusic.pause();
                }, 500);

                ++yourScore;
                yourScoreH3.innerHTML = `Your Score: ${yourScore}`;
                storeHighScore();
                hitPosition = null;
            }
        }
    })
})

