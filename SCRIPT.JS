
    document.addEventListener('DOMContentLoaded', function() {
  var holes = document.getElementsByClassName('hole');
  var score = 0;
  var timeLeft = 10;

  function randomHole() {
    var index = Math.floor(Math.random() * holes.length);
    return holes[index];
  }

  function showMole() {
    var hole = randomHole();
    hole.innerHTML = '<div class="mole active"></div>';
    setTimeout(function() {
      hole.innerHTML = '';
      if (timeLeft > 0) {
        showMole();
      }
    }, 1000);
  }

  function startGame() {
    score = 0;
    timeLeft = 10;
    updateScore();
    updateTimer();
    showMole();
    setTimeout(function() {
      timeLeft--;
      if (timeLeft > 0) {
        startGame();
      } else {
        alert('Game Over! Your score: ' + score);
      }
    }, 1000);
  }

  function updateScore() {
    var scoreElement = document.getElementById('score');
    scoreElement.textContent = score;
  }

  function updateTimer() {
    var timerElement = document.getElementById('timer');
    timerElement.textContent = timeLeft;
  }

  for (var i = 0; i < holes.length; i++) {
    holes[i].addEventListener('click', function() {
      if (this.innerHTML !== '') {
        score++;
        updateScore();
        this.innerHTML = '';
      }
    });
  }

  startGame();
});

