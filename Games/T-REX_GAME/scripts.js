const dino = document.getElementById("dino");
const cactus = document.getElementById("cactus");

let score = -1;
let highScore = 0;
function addScore(){
    score += 1;
}

function jump() {
  if (dino.classList != "jump") {
    dino.classList.add("jump");

    setTimeout(function () {
      dino.classList.remove("jump");
    }, 300);
  }
}

let isAlive = setInterval(function () {
  // get current dino Y position
  let dinoTop = parseInt(window.getComputedStyle(dino).getPropertyValue("top"));

  // get current cactus X position
  let cactusLeft = parseInt(
    window.getComputedStyle(cactus).getPropertyValue("left")
  );

  // detect collision
  if (cactusLeft < 50 && cactusLeft > 0 && dinoTop >= 140) {
    // collision
    highScore = Math.max(highScore, score);
    alert("Game Over! \nScore = " + score + "\nHigh score= " + highScore);
    score = 0;
  }
}, 10);


document.addEventListener("keydown", function (event) {
  jump();
  addScore();
});