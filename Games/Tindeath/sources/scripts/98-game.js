[...$$$(".startButton")].forEach(($button) => {
  $button.addEventListener("click", initGame);
});

$("tutorial-repeat").addEventListener("click", showTutorial);
$("helpClose").addEventListener("click", () => {
  $("help").classList.remove("-active");
});
$("helpButton").addEventListener("click", () => {
  $("helpButton").classList.remove("-blink");
  $("help").classList.add("-active");
});
$("soundButton").addEventListener("click", () => {
  isSoundMuted = !isSoundMuted;
  $("soundButton").innerHTML = isSoundMuted ? "🔇" : "🔊";
  if (isSoundMuted) {
    if (gameMusic) {
      gameMusic.stop();
    }
  } else {
    startMusic();
  }
});

function startMusic() {
  if (!isSoundMuted && isGameStarted) {
    gameMusic = zzfxP(...ambientMusicData);
    gameMusic.loop = true;
  }
}

function initGame() {
  isGameStarted = true;
  startMusic();
  getFromLS("tutoWatched") ? startNewGame() : showTutorial();
}

function startNewGame() {
  $gameWrapper.dataset.screen = 2;
  characterList = [];
  $cardList.innerHTML = "";
  currentCardIndex = 0;
  score = 0;
  combo = 0;
  scoreMultiplier = 1;
  gameTimer = 60 * 1000;

  updateScoreDisplay();

  // Adds characters at start to see "deck"
  addCharacter();
  addCharacter();
  addCharacter();
  addCharacter();

  startTimer();
}

function endGame() {
  let bestScore = getFromLS("bestScore") || 0;
  if (score > bestScore) {
    setToLS("bestScore", score);
  }
  $("endscore").innerHTML = score;
  gameMusic.stop();

  let character = setDemonFace();
  // Change face depending on score
  if (score < 10) {
    character.eye = customizationList.eye[3];
  }
  if (score < 15) {
    character.eyebrow = customizationList.eyebrow[3];
  }
  if (score < 42) {
    character.mouth = customizationList.mouth[1];
  }
  if (score < 25) {
    character.mouth = customizationList.mouth[2];
  }
  $$("#end .card__image").innerHTML = drawCharacterFace(character);

  $gameWrapper.dataset.screen = 3;
}

createBackground();

// Display all score in list items
let bestScore = getFromLS("bestScore");
if (bestScore) {
  $("bestScore").innerHTML = `Best score: <b id="bestSscore">${bestScore}</b>`;
}

if (!getFromLS("tutoWatched")) {
  $("tutorial-repeat").style.display = "none";
} else {
  $("helpButton").classList.add("-active");
}
