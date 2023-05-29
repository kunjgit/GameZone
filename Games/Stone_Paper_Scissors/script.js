let cscore = 0, uscore = 0;

//starting the game
const StartGame = () => {
  const startbtn = document.querySelector(".begin button");
  const beginPage = document.querySelector(".begin");
  const gamePage = document.querySelector(".playground");

  // Add a click event listener
  startbtn.addEventListener("click", function () {
    beginPage.classList.add("disappear");
    gamePage.classList.remove("disappear");
    gamePage.classList.add("appear");

    uscore = 0, cscore = 0;
    updatescore(uscore, cscore);

  });

};


//playing the game
const PlayGame = () => {
  let cscore = 0, uscore = 0;
  const options = document.querySelectorAll(".options button");
  const userGesture = document.querySelector(".userGesture img");
  const CompGesture = document.querySelector(".CompGesture img");

  const game_options = ["Stone", "Paper", "Scissors"];
  options.forEach(option => {
    option.addEventListener("click", function () {
      const userchoice = this.textContent;

      userGesture.src = `${this.textContent}.png`;

      const compchoice = game_options[(Math.floor(Math.random() * 3))];
      CompGesture.src = `${compchoice}.png`;

      if (userchoice === "Scissors" || userchoice === "Paper") {
        userGesture.classList.add("rotation");

      }
      else {
        userGesture.classList.remove("rotation");
      }

      if (compchoice === "Stone") {
        CompGesture.classList.add("rotation");

      }
      else {
        CompGesture.classList.remove("rotation");
      }

      Result(userchoice, compchoice);

    });
  });
};

//updating the scores
const updatescore = (uscore, cscore) => {
  const userscore = document.querySelector(".userscore p");
  const compscore = document.querySelector(".compscore p");
  userscore.textContent = uscore;
  compscore.textContent = cscore;
};

//Result of game
const Result = (userchoice, compchoice) => {

  const status = document.querySelector(".status");
  const userscore = document.querySelector(".userscore p");
  const compscore = document.querySelector(".compscore p");
  if (userchoice == compchoice) {
    status.textContent = "It's a tie!";
    return;
  }

  if (userchoice == "Scissors") {
    if (compchoice == "Paper") {

      status.textContent = "You win!";
      uscore++;
      updatescore(uscore, cscore);
      return;
    }
    else {
      status.textContent = "You lost!";
      cscore++;
      updatescore(uscore, cscore);
      return;
    }
  }

  if (userchoice == "Stone") {
    if (compchoice == "Scissors") {

      status.textContent = "You win!";
      uscore++;
      updatescore(uscore, cscore);
      return;
    }
    else {
      status.textContent = "You lost!";
      cscore++;
      updatescore(uscore, cscore);
      return;
    }
  }
  if (userchoice == "Paper") {
    if (compchoice == "Stone") {

      status.textContent = "You win!";
      uscore++;
      updatescore(uscore, cscore);
      return;
    }
    else {
      status.textContent = "You lost!";
      cscore++;
      updatescore(uscore, cscore);
      return;
    }
  }
};


//Quitting the game
const QuitGame = (uscore, pscore) => {
  const quitbtn = document.querySelector(".quit");
  const beginPage = document.querySelector(".begin");
  const gamePage = document.querySelector(".playground");
  const result = document.querySelector(".begin h1");
  const playagain = document.querySelector(".begin button");
  const userscore = document.querySelector(".userscore p");
  const compscore = document.querySelector(".compscore p");

  quitbtn.addEventListener("click", function () {
    beginPage.classList.remove("disappear");
    beginPage.classList.add("appear");
    gamePage.classList.remove("appear");
    gamePage.classList.add("disappear");
    // console.log(uscore);
    // console.log(cscore);

    if (userscore.textContent > compscore.textContent) {
      result.textContent = "Congratulations! You're the winner."
      playagain.textContent = "Play Again";
      cscore = 0;
      uscore = 0;
      updatescore(uscore, cscore);
      return;
    }
    if (userscore.textContent < compscore.textContent) {
      result.textContent = "You lost! Better Luck next time!"
      playagain.textContent = "Play Again";
      cscore = 0;
      uscore = 0;
      updatescore(uscore, cscore);
      return;
    }
    if (userscore.textContent === compscore.textContent) {
      result.textContent = "It's a tie."
      playagain.textContent = "Play Again";
      cscore = 0;
      uscore = 0;
      updatescore(uscore, cscore);
      return;
    }

  });
};
StartGame();
PlayGame();
QuitGame(uscore, cscore);