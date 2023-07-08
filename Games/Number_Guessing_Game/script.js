const hint = document.getElementById("hint");
const noOfGuessesRef = document.getElementById("numberOfGuesses");
const guessedNumsRef = document.getElementById("guessedNumbers");
const restartButton = document.getElementById("restart");
const game = document.getElementById("GuessingGame");
const guessInput = document.getElementById("GuessNumber");
const checkButton = document.getElementById("check");


let answer, noOfGuesses, guessedNumsAre;
const play = () => {
  const userGuess = guessInput.value;
  if (userGuess < 1 || userGuess > 100 || isNaN(userGuess)) {
    alert("Please enter a valid number between 1 and 100.");
    return;
  }
  guessedNumsAre.push(userGuess);
  noOfGuesses += 1;
  if (userGuess != answer) {
    if (userGuess < answer) {
      hint.innerHTML = "Sorry!! The number is too low. Try again!";
    } else {
      hint.innerHTML = " Sorry!! The number is too high. Try again!";
    }
    noOfGuessesRef.innerHTML = `<span>Number Of Guesses:</span> ${noOfGuesses}`;
    guessedNumsRef.innerHTML = `<span>Guessed Numbers are: </span>${guessedNumsAre.join(
      ","
    )}`;
    hint.classList.remove("error");
    setTimeout(() => {
      hint.classList.add("error");
    }, 10);
  } else {
    hint.innerHTML = `Congrats!!!<br>The number was <span>${answer}</span>.<br>You have guessed the correct number in <span>${noOfGuesses} </span>attempts.`;
    hint.classList.add("success");
    game.style.display = "none";
    restartButton.style.display = "block";
  }
};
const init = () => {
  console.log("Game Started");
  answer = Math.floor(Math.random() * 100) + 1;
  console.log(answer);
  noOfGuesses = 0;
  guessedNumsAre = [];
  noOfGuessesRef.innerHTML = "Number Of Guesses - 0";
  guessedNumsRef.innerHTML = "Guessed Numbers are - None";
  guessInput.value = "";
  hint.classList.remove("success", "error");
};
guessInput.addEventListener("keydown", (event) => {
  if (event.keyCode === 13) {
    event.preventDefault();
    play();
  }
});
//  restart button 
restartButton.addEventListener("click", () => {
  game.style.display = "grid";
  restartButton.style.display = "none";
  hint.innerHTML = "";
  hint.classList.remove("success");
  init();
});
checkButton.addEventListener("click", play);
window.addEventListener("load", init);