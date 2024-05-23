let score = 0;
let cross = true;
let gameRunning = true;
let gameRestartTimeout;

const audio = new Audio("music.mp3");
const audiogo = new Audio("gameover.mp3");
let isAudioPlaying = false;
let mute = false;

function toggle(img) {
  if (img.src.endsWith("unmute.png")) {
    img.src = "mute.png"
    audio.pause()
  }
  else {
    img.src = "unmute.png"
    audio.play()
  }
  mute = !mute
  isAudioPlaying = !isAudioPlaying
  console.log(mute + "  " + isAudioPlaying);
}

audio.play()

document.addEventListener("keydown", function (e) {
  if (!gameRunning) {
    return;
  }

  if (e.keyCode == 38) {
    const dino = document.querySelector(".dino");
    dino.classList.add("animateDino");
    setTimeout(() => {
      dino.classList.remove("animateDino");
    }, 700);
  }
  if (e.keyCode == 39) {
    const dino = document.querySelector(".dino");
    const dinoX = parseInt(
      window.getComputedStyle(dino, null).getPropertyValue("left")
    );
    dino.style.left = dinoX + 112 + "px";
  }
  if (e.keyCode == 37) {
    const dino = document.querySelector(".dino");
    const dinoX = parseInt(
      window.getComputedStyle(dino, null).getPropertyValue("left")
    );
    dino.style.left = dinoX - 112 + "px";
  }
});

function restartGame() {
  clearTimeout(gameRestartTimeout);

  score = 0;
  cross = true;
  gameRunning = true;

  const obstacle = document.querySelector(".obstacle");
  const gameOver = document.querySelector(".gameOver");

  obstacle.classList.add("obstacleAni");
  gameOver.innerHTML = "";

  updateScore(score);
}

function endGame() {
  gameRunning = false;
  const obstacle = document.querySelector(".obstacle");
  const gameOver = document.querySelector(".gameOver");

  gameOver.innerHTML = "Game Over - Restarting in 3 seconds";

  obstacle.classList.remove("obstacleAni");
  if (!mute) {
    audiogo.play();
  }
  clearTimeout(gameRestartTimeout);
  gameRestartTimeout = setTimeout(restartGame, 3000);
}

setInterval(() => {
  if (!gameRunning) {
    return;
  }

  const dino = document.querySelector(".dino");
  const gameOver = document.querySelector(".gameOver");
  const obstacle = document.querySelector(".obstacle");

  const dx = parseInt(
    window.getComputedStyle(dino, null).getPropertyValue("left")
  );
  const dy = parseInt(
    window.getComputedStyle(dino, null).getPropertyValue("top")
  );

  const ox = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("left")
  );
  const oy = parseInt(
    window.getComputedStyle(obstacle, null).getPropertyValue("top")
  );

  const offsetX = Math.abs(dx - ox);
  const offsetY = Math.abs(dy - oy);

  if (offsetX < 73 && offsetY < 52) {
    endGame();
  } else if (offsetX < 145 && cross) {
    score += 1;
    updateScore(score);
    cross = false;
    setTimeout(() => {
      cross = true;
    }, 1000);
    setTimeout(() => {
      const aniDur = parseFloat(
        window
          .getComputedStyle(obstacle, null)
          .getPropertyValue("animation-duration")
      );
      const newDur = aniDur - 0.1;
      obstacle.style.animationDuration = newDur + "s";
    }, 500);
  }
}, 1);

function updateScore(score) {
  scoreCont.innerHTML = "Your Score: " + score;
}
