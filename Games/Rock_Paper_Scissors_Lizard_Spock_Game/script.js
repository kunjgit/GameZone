 // Function to generate a random choice for the computer
 function getRandomComputerResult() {
    const options = ["Rock", "Paper", "Scissors", "Lizard", "Spock"];
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
  }
  
  // Function to determine if the player has won the round
  function hasPlayerWonTheRound(player, computer) {
    return (
      (player === "Scissors" && computer === "Paper") ||
      (player === "Paper" && computer === "Rock") ||
      (player === "Rock" && computer === "Lizard") ||
      (player === "Lizard" && computer === "Spock") ||
      (player === "Spock" && computer === "Scissors") ||
      (player === "Scissors" && computer === "Lizard") ||
      (player === "Lizard" && computer === "Paper") ||
      (player === "Paper" && computer === "Spock") ||
      (player === "Spock" && computer === "Rock") ||
      (player === "Rock" && computer === "Scissors")
    );
  }
  
  // Initialize scores
  let playerScore = 0;
  let computerScore = 0;
  
  // Function to get the results of a round
  function getRoundResults(userOption) {
    const computerResult = getRandomComputerResult();
  
    if (hasPlayerWonTheRound(userOption, computerResult)) {
      playerScore++;
      return `Player wins! ${userOption} beats ${computerResult}`;
    } else if (computerResult === userOption) {
      return `It's a tie! Both chose ${userOption}`;
    } else {
      computerScore++;
      return `Computer wins! ${computerResult} beats ${userOption}`;
    }
  }
  
  // Get DOM elements
  const playerScoreSpanElement = document.getElementById("player-score");
  const computerScoreSpanElement = document.getElementById("computer-score");
  const roundResultsMsg = document.getElementById("results-msg");
  const winnerMsgElement = document.getElementById("winner-msg");
  const optionsContainer = document.querySelector(".options-container");
  const resetGameBtn = document.getElementById("reset-game-btn");
  
  // Function to display results and check for game end
  function showResults(userOption) {
    roundResultsMsg.innerText = getRoundResults(userOption);
    computerScoreSpanElement.innerText = computerScore;
    playerScoreSpanElement.innerText = playerScore;
    
    // Check if game has ended (first to 5 points)
    if (playerScore === 5 || computerScore === 5) {
      winnerMsgElement.innerText = `${
        playerScore === 5 ? "Player" : "Computer"
      } has won the game!`;
  
      resetGameBtn.style.display = "block";
      optionsContainer.style.display = "none";
    }
  
  };

  // Function to reset the game
  function resetGame() {
    playerScore = 0;
    computerScore = 0;
    playerScoreSpanElement.innerText = playerScore;
    computerScoreSpanElement.innerText = computerScore;
    resetGameBtn.style.display = "none";
    optionsContainer.style.display = "block";
    winnerMsgElement.innerText = "";
    roundResultsMsg.innerText = "";
  };
  
  // Add event listener to reset button
  resetGameBtn.addEventListener("click", resetGame);
  
  // Get button elements
  const rockBtn = document.getElementById("rock-btn");
  const paperBtn = document.getElementById("paper-btn");
  const scissorsBtn = document.getElementById("scissors-btn");
  const lizardBtn = document.getElementById("lizard-btn");
  const spockBtn = document.getElementById("spock-btn");
  
  // Add event listeners to game option buttons
  rockBtn.addEventListener("click", function () {
    showResults("Rock");
  });
  
  paperBtn.addEventListener("click", function () {
    showResults("Paper");
  });
  
  scissorsBtn.addEventListener("click", function () {
    showResults("Scissors");
  });

  lizardBtn.addEventListener("click", function () {
    showResults("Lizard");
  });

  spockBtn.addEventListener("click", function () {
    showResults("Spock");
  });