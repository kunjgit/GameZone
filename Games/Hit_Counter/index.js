document.getElementById("readyButton").addEventListener("click", startGame);
document.getElementById("resetButton").addEventListener("click", resetGame);

let mode = "keyboard";
let timeLimit = 0;
let count = 0;
let timePassed = 0;
let timer;

function startGame() {
  timeLimit = parseInt(document.getElementById("timeInput").value);
  mode = document.getElementById("modeSelect").value;
  count = 0;
  timePassed = 0;
  document.querySelector(".clickOrHit").innerHTML =
    mode === "keyboard" ? "Hits" : "Clicks";
  document.getElementById("setup").style.display = "none";
  document.getElementById("game").classList.remove("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("countDisplay").innerText = count;
  document.getElementById("timeDisplay").innerText = `Time: ${timePassed}s`;
  document.getElementById("resetButton").classList.add("hidden");

  if (mode === "keyboard") {
    document.addEventListener("keyup", countKey);
  } else {
    document.addEventListener("click", countClick);
  }

  timer = setInterval(updateTime, 1000);
  setTimeout(endGame, timeLimit * 1000);
}

function countKey(event) {
  if (event.code === "Space") {
    count++;
    document.getElementById("countDisplay").innerText = count;
  }
}

function countClick() {
  count++;
  document.getElementById("countDisplay").innerText = count;
}

function updateTime() {
  timePassed++;
  document.getElementById("timeDisplay").innerText = `Time: ${timePassed}s`;
}

function endGame() {
  clearInterval(timer);
  document.getElementById("game").classList.add("hidden");
  document.getElementById("setup").style.display = "block";
  document.getElementById("result").classList.remove("hidden");
  document.getElementById("resetButton").classList.remove("hidden");
  document.getElementById("result").innerText = `Result: ${
    (count / timeLimit) * 60
  } ${mode === "keyboard" ? "hits" : "clicks"} per minute`;

  if (mode === "keyboard") {
    document.removeEventListener("keyup", countKey);
  } else {
    document.removeEventListener("click", countClick);
  }
}

function resetGame() {
  document.getElementById("setup").classList.remove("hidden");
  document.getElementById("game").classList.add("hidden");
  document.getElementById("result").classList.add("hidden");
  document.getElementById("timeInput").value = "";
  document.getElementById("modeSelect").value = "keyboard";
}
