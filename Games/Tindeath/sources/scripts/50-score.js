function updateScore(hasAccepted, currentCard) {
  if (
    (hasAccepted > 0 && currentCard.error) ||
    (hasAccepted < 0 && !currentCard.error)
  ) {
    zzfxP(failSound);
    combo = 0;
    scoreMultiplier = 1;
    let message = currentCard.error
      ? random() > 0.5
        ? `🤨️ ${currentCard.error.m}, really?`
        : `☠️️ Have you ever seen ${currentCard.error.m}?`
      : `🤨️ why did you reject him?`;
    message += `<div class="card__imageWrapper"><div class="card__image">${drawCharacterFace(
      { ...currentCard, ...currentCard.error }
    )}</div></div>`;

    displayErrorMessage(message);
    $combo.classList.remove("-success");
  } else {
    zzfxP(comboSound);
    score += scoreMultiplier;
    ++combo;
    updateCombo();
    $errorMessage.classList.remove("-shown");
  }
  score = Math.max(0, score);
  updateScoreDisplay();
}

function updateScoreDisplay() {
  $score.innerHTML = score;
  $score.classList.remove("-success");
  $score.offsetWidth;
  $score.classList.add("-success");
}

function updateCombo() {
  let message = `${getRandomItem(["🤘", "🚀", "🔥"])} Combo x${combo}!<br>`;
  if (combo % 3 == 0) {
    let bonus = Math.min(combo / 3, 5);
    gameTimer += bonus * 1000;
    message += ` +${bonus}s`;
  }
  if (combo % 5 == 0) {
    ++scoreMultiplier;
    message += ` score x${scoreMultiplier}`;
  }

  if (combo > 1) {
    $combo.innerHTML = message;
    $combo.classList.remove("-success");
    $combo.offsetWidth;
    $combo.classList.add("-success");

    comboMessageTimeout = setTimeout(() => {
      $combo.classList.remove("-success");
    }, 2000);
  }
}

// TODO: factoriser avec updateCombo pour l'affichage
function displayErrorMessage(message) {
  $errorMessage.innerHTML = message;
  $errorMessage.classList.remove("-shown");
  $errorMessage.offsetWidth;
  $errorMessage.classList.add("-shown");

  errorMessageTimeout = setTimeout(() => {
    $errorMessage.classList.remove("-shown");
  }, 5000);
}
