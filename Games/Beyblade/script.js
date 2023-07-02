const MAX_STAMINA = 100;

let score1 = 0;
let score2 = 0;
let stamina1 = MAX_STAMINA;
let stamina2 = MAX_STAMINA;

function launchBlade(player) {

  const score = Math.floor(Math.random() * 100) + 1;
  const decreaseStamina = Math.floor(Math.random() * 20) + 1;

  if (player === 1) {
    score1 += score;
    stamina1 -= decreaseStamina;
    if (stamina1 < 0) stamina1 = 0;
    document.getElementById("score1").textContent = score1;
    document.getElementById("stamina1").textContent = stamina1;
    const blade1 = document.getElementById("blade1");
    blade1.classList.add("spin-animation");
    blade1.addEventListener("animationend", () => {
      blade1.classList.remove("spin-animation");
    }, { once: true });
  } else {
    score2 += score;
    stamina2 -= decreaseStamina;
    if (stamina2 < 0) stamina2 = 0;
    document.getElementById("score2").textContent = score2;
    document.getElementById("stamina2").textContent = stamina2;
    const blade2 = document.getElementById("blade2");
    blade2.classList.add("spin-animation");
    blade2.addEventListener("animationend", () => {
      blade2.classList.remove("spin-animation");
    }, { once: true });
  }

  if (stamina1 === 0 || stamina2 === 0) {
    endGame();
  }
}

function endGame() {
  document.getElementById("player1").getElementsByTagName("button")[0].disabled = true;
  document.getElementById("player2").getElementsByTagName("button")[0].disabled = true;

  let winner;
  if (score1 > score2) {
    winner = "Player 1";
  } else if (score2 > score1) {
    winner = "Player 2";
  } else {
    winner = "It's a tie!";
  }

  const resultDiv = document.createElement("div");
  resultDiv.innerHTML = "<h2>Game Over!</h2><p>Winner: " + winner + "</p>";
  document.getElementById("game-container").appendChild(resultDiv);
}
