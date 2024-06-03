const MAX_STAMINA = 100;

let score1 = 0;
let score2 = 0;
let stamina1 = MAX_STAMINA;
let stamina2 = MAX_STAMINA;

var display=1;
var div1 = document.getElementById("container3D");
div1.style.display='none';
function hideShow(){
    if(display==0){
        div1.style.display='none';
        display=1;
    }
    else{
        div1.style.display='block';
        display=0;
    }
}

let popup=document.getElementById("popup");
function openPopup(){
  popup.classList.add("open-popup");
}
function closePopup(){
  popup.classList.remove("open-popup");
}


if(display==1){
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
  document.getElementById("container3D").appendChild(resultDiv);
  var div = document.getElementById("hide");
  div.style.display='none';
}

function handlePowerUp(player) {
  const powerUpChance = Math.random();
  if (powerUpChance <= 0.2) {
    if (player === 1) {
      player1Score += 5;
      player1Stamina += 10;
    } else {
      player2Score += 5;
      player2Stamina += 10;
    }
  }
  updateUI();
}

function displayPowerUpMessage(player) {
  const messageElement = document.getElementById('container3D');
  if (player == 1) {
    messageElement.textContent = 'Player 1 got a Power-Up!';
  } else {
    messageElement.textContent = 'Player 2 got a Power-Up!';
  }
  messageElement.classList.add('show');
  setTimeout(() => {
    messageElement.classList.remove('show');
  }, 2000);
}

function generatePowerUps() {
  setInterval(() => {
    const player = Math.random() < 0.5 ? 1 : 2;
    handlePowerUp(player);
    displayPowerUpMessage(player);
  }, 1000);
}

function updateTimer() {
  const timerElement = document.getElementById('game-timer');
  let seconds = 0;
  setInterval(() => {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerElement.textContent = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }, 100);
  if(seconds==60&& (stamina1==0||stamina2==0)){
    endGame();
  }
}

function startGame() {
  resetgame();
  generatePowerUps();
  updateTimer();
}

startGame();
