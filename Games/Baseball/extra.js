var scoreboardElement = document.getElementById("scoreboard");
var inningElement = document.getElementById("inning");
var outsElement = document.getElementById("outs");
var scoreElement = document.getElementById("score");
var leaderboardElement = document.getElementById("leaderboard");

var leaderboard = [];

function updateLeaderboard() {
  leaderboardElement.innerHTML = "<h3>Leaderboard</h3>";
  leaderboard.sort(function(a, b) {
    return b.score - a.score;
  });

  for (var i = 0; i < leaderboard.length; i++) {
    var player = leaderboard[i];
    var playerElement = document.createElement("div");
    playerElement.className = "player";
    playerElement.innerHTML = "<span class='player-name'>" + player.name + "</span><span class='player-score'>" + player.score + "</span>";
    leaderboardElement.appendChild(playerElement);
  }
}

function addToLeaderboard() {
  var playerName = prompt("Congratulations! You made the leaderboard!\nEnter your name:");
  if (playerName) {
    var player = {
      name: playerName,
      score: score
    };
    leaderboard.push(player);
    updateLeaderboard();
  }
}

function resetGame() {
  leaderboard = [];
  updateLeaderboard();
  score = 0;
  inning = 1;
  outs = 0;
  hitCount = 0;
  updateInningDisplay();
  updateOutsDisplay();
  updateScoreDisplay();
  resultElement.textContent = "Game Reset. Good luck!";
  setTimeout(startNextInning, 2000);
}

function saveGame() {
  var gameData = {
    leaderboard: leaderboard,
    score: score,
    inning: inning,
    outs: outs,
    hitCount: hitCount
  };
  var gameDataJSON = JSON.stringify(gameData);
  localStorage.setItem("baseballGame", gameDataJSON);
  alert("Game saved successfully!");
}

function loadGame() {
  var gameDataJSON = localStorage.getItem("baseballGame");
  if (gameDataJSON) {
    var gameData = JSON.parse(gameDataJSON);
    leaderboard = gameData.leaderboard || [];
    score = gameData.score || 0;
    inning = gameData.inning || 1;
    outs = gameData.outs || 0;
    hitCount = gameData.hitCount || 0;
    updateLeaderboard();
    updateInningDisplay();
    updateOutsDisplay();
    updateScoreDisplay();
    resultElement.textContent = "Game Loaded. Continue playing!";
  } else {
    alert("No saved game data found!");
  }
}

function clearLocalStorage() {
  localStorage.removeItem("baseballGame");
  alert("Game data cleared from local storage!");
}

function updateInningDisplay() {
  inningElement.textContent = "Inning: " + inning;
}

function updateOutsDisplay() {
  outsElement.textContent = "Outs: " + outs;
}

function updateScoreDisplay() {
  scoreElement.textContent = "Score: " + score;
}

function endGame() {
  gameInProgress = false;
  resultElement.textContent = "Game Over! Final Score: " + score;
  addToLeaderboard();
}

document.getElementById("resetButton").addEventListener("click", resetGame);
document.getElementById("saveButton").addEventListener("click", saveGame);
document.getElementById("loadButton").addEventListener("click", loadGame);
document.getElementById("clearButton").addEventListener("click", clearLocalStorage);
