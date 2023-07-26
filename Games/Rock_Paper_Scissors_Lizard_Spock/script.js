const choices = ["rock", "paper", "scissors", "lizard", "spock"];
let userChoice = "";
let computerChoice = "";
let result = "";

const buttons = document.querySelectorAll(".btn");
const outcomeText = document.getElementById("outcome");
const resetButton = document.getElementById("reset");

// Function to generate a random computer choice
function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * choices.length);
    return choices[randomIndex];
}

// Function to check the result
function checkResult(user, computer) {
    if (user === computer) {
        return "It's a tie!";
    } else if (
        (user === "rock" && (computer === "scissors" || computer === "lizard")) ||
        (user === "paper" && (computer === "rock" || computer === "spock")) ||
        (user === "scissors" && (computer === "paper" || computer === "lizard")) ||
        (user === "lizard" && (computer === "paper" || computer === "spock")) ||
        (user === "spock" && (computer === "rock" || computer === "scissors"))
    ) {
        return "You win!";
    } else {
        return "You lose!";
    }
}

// Function to handle user choice
function handleClick(event) {
    const button = event.target.closest(".btn");
    if (button) {
      userChoice = button.id;
      computerChoice = getComputerChoice();
      result = checkResult(userChoice, computerChoice);
  
      outcomeText.textContent = `You chose ${userChoice}. Computer chose ${computerChoice}. ${result}`;
      resetButton.style.display = "block";
}
}

// Function to reset the game
function resetGame() {
    outcomeText.textContent = "Choose your move...";
    resetButton.style.display = "none";
    userChoice = "";
    computerChoice = "";
    result = "";
}

// Add event listeners to the buttons
buttons.forEach((button) => {
    button.addEventListener("click", handleClick);
});

// Add event listener to the reset button
resetButton.addEventListener("click", resetGame);
