function startTimer() {
  updateTimer();
}

function updateTimer() {
  updateTimerInterval = 10;
  let time = gameTimer / 1000;

  setTimeout(() => {
    if (gameTimer > 9999) {
      // Display minutes and seconds
      var minutes =
        ("0" + ~~(time / 60)).slice(-2) + ":" + ("0" + (~~time % 60)).slice(-2);
    } else {
      // Di=splay seconds with 2 digits
      var minutes = ("0" + time.toFixed(2).replace(".", ":")).slice(-5);
    }

    // minutes = minutes < 10 ? "0" + minutes : minutes;
    // seconds = seconds < 10 ? "0" + seconds : seconds;

    $("time").textContent = minutes;
    gameTimer -= updateTimerInterval;
    gameTimer < 0 ? endGame() : updateTimer();
  }, 10);
}
