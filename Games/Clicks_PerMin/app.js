document.addEventListener('DOMContentLoaded', function() {
    const clickButton = document.getElementById('clickButton');
    const scoreDisplay = document.getElementById('score');
    const timerDisplay = document.getElementById('timer');
    const gameOverDisplay = document.getElementById('gameOver');
    const finalScoreDisplay = document.getElementById('finalScore');
  
    let score = 0;
    let timeLeft = 60; // 60 seconds
  
    clickButton.addEventListener('click', function() {
      score++;
      scoreDisplay.innerText = `Score: ${score}`;
    });
  
    // Timer function
    const timer = setInterval(function() {
      timeLeft--;
      let minutes = Math.floor(timeLeft / 60);
      let seconds = timeLeft % 60;
      timerDisplay.innerText = `Time left: ${minutes}:${seconds.toString().padStart(2, '0')}`;
  
      if (timeLeft === 0) {
        clearInterval(timer);
        clickButton.disabled = true;
        finalScoreDisplay.innerText = score;
        gameOverDisplay.classList.remove('d-none');
      }
    }, 1000);
  });