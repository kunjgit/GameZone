/**
 * This module contains the game logic for the T-Rex Runner game. It exports functions
 * for updating the game state, handling game over and retrying the game. It also sets up
 * event listeners for starting the game and retrying the game.
 * 
 * The game consists of a world with a ground, a dino and cacti. The dino can jump over the
 * cacti to avoid them. The game ends when the dino collides with a cactus.
 * 
 * The game keeps track of the player's score, which increases over time. The highest score
 * achieved is also tracked and displayed on the screen.
 * 
 * The game is responsive and adjusts to the size
 */
import { updateGround, setupGround } from "./ground.js"
import { updateDino, setupDino, getDinoRect, setDinoLose } from "./dino.js"
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js"

const WORLD_WIDTH = 100
const WORLD_HEIGHT = 30
const SPEED_SCALE_INCREASE = 0.00001

const worldElem = document.querySelector("[data-world]")
const scoreElem = document.querySelector("#current-score");
const highestScoreElem = document.querySelector("#highest-score");
const startScreenElem = document.querySelector("[data-start-screen]")

setPixelToWorldScale()
window.addEventListener("resize", setPixelToWorldScale)
document.addEventListener("keydown", handleStart, { once: true })


let lastTime
let speedScale
let score
function update(time) {
  if (lastTime == null) {
    lastTime = time
    window.requestAnimationFrame(update)
    return
  }
  const delta = time - lastTime

  updateGround(delta, speedScale)
  updateDino(delta, speedScale)
  updateCactus(delta, speedScale)
  updateSpeedScale(delta)
  updateScore(delta)
  if (checkLose()) return handleLose()

  lastTime = time
  window.requestAnimationFrame(update)
}

function checkLose() {
  const dinoRect = getDinoRect()
  return getCactusRects().some(rect => isCollision(rect, dinoRect))
}


function isCollision(rect1, rect2) {
  return (
    rect1.left < rect2.right &&
    rect1.top < rect2.bottom &&
    rect1.right > rect2.left &&
    rect1.bottom > rect2.top
  )
}

function updateSpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE
}

let highestScore = 0;
let isGameOver = false;
let isFirstRun = true;
let isScoreBeatSoundPlayed = false;
function updateScore(delta) {
  score += delta * 0.01;
  scoreElem.textContent = score.toFixed(0).padStart(5, "0");

  if (score > highestScore) {
    highestScore = Math.floor(score);
    updateHighestScore();

    if (!isScoreBeatSoundPlayed && !isGameOver) {
      // Play score beat sound effect
      const scoreBeatSound = document.getElementById("score-beat-sound");
      scoreBeatSound.play();
      isScoreBeatSoundPlayed = true;
    }
  } else {
    isScoreBeatSoundPlayed = false;
  }
}

function updateHighestScore() {
  if (isGameOver && isFirstRun) return;
  highestScoreElem.textContent = highestScore.toFixed(0).padStart(5, "0");
}

function handleStart() {
  lastTime = null
  speedScale = 1
  score = 0
  setupGround()
  setupDino()
  setupCactus()
  startScreenElem.classList.add("hide")
  window.requestAnimationFrame(update)
}
const gameOverElem = document.querySelector("[data-game-over]");
const retryButtonElem = document.querySelector("[data-retry-button]");

retryButtonElem.addEventListener("click", handleRetry);

function handleLose() {
  setDinoLose();
  isFirstRun = false;
  isScoreBeatSoundPlayed = false;
  isGameOver = false;
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startScreenElem.innerHTML = `<div class="game-over">Game Over</div><button class="retry-button"><img src="retry.png" alt="Retry"></button>`;
    startScreenElem.classList.remove("hide");
    const retryButtonElem = startScreenElem.querySelector(".retry-button");
    retryButtonElem.addEventListener("click", handleRetry);
    handleGameOver();
  }, 100);
}

function handleRetry() {
  startScreenElem.classList.add("hide");
  handleStart();
}

// Game over event
function handleGameOver() {
  // Play game over sound effect
  const gameOverSound = document.getElementById('gameover-sound');
  gameOverSound.play();
}

function setPixelToWorldScale() {
  let worldToPixelScale
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`
}