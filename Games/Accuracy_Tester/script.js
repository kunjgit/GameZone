let currentScore = 0,
    userHighScore = 0,
    currentTime = 0,
    timerId,
    misses = 0,
    circleInterval = 1000,
    playing = false;                                                          //Track if the user is currently playing

//Function gives base parameters for circle creation
function createCircle() {
  const circle = document.createElement("div");
  circle.className = "circle";

  const X = Math.random() * 500 + 50;                                         //Position generation
  const Y = Math.random() * 300 + 50;
  circle.style.top = `${Y}px`;
  circle.style.left = `${X}px`;

  const size = Math.floor(Math.random() * 30) + 50;                           //Size and color generation
  const colors = ["#03b6fc", "#fcd703", "#fc0345", "#fc6203", "#9d03fc"];
  circle.style.width = `${size}px`;
  circle.style.height = `${size}px`;
  let color = Math.floor(Math.random() * 5);
  circle.style.backgroundColor = `${colors[color]}`;

  circle.style.animationDuration = "2s";                                      //Set animation time

  circle.addEventListener("click", function () {                              //Event for when user clicks on circle
    if (circle.parentNode) {
      currentScore++
      document.getElementById("scoreValue").textContent = currentScore;
      circle.parentNode.removeChild(circle);
      generateCircle(container);
    }
  });

  return circle;
}

function startGame() {
  if (playing) {
    return;
  }

  const circlesContainer = document.getElementById("circles");
  const timerElement = document.getElementById("timerValue");
  const startButton = document.getElementById("startButton");

  while (circlesContainer.firstChild) {                                       //Clear any remaining circles
    circlesContainer.firstChild.remove();
  }

  currentScore = 0;                                                           //Reset game stats
  currentTime = 0;
  misses = 0;
  circleInterval = 1000;
  document.getElementById("scoreValue").textContent = currentScore;
  document.getElementById("timerValue").textContent = currentTime;
  document.getElementById("livesValue").textContent = 3;
  playing = true;

  timerId = setInterval(function () {                                         //Start timer
    currentTime++;
    timerElement.textContent = currentTime;
  }, 1000);

  generateCircle(circlesContainer);                                           //Start circle generation
  createCircle();

  startButton.disabled = true;                                               //Disable start game button gameplay
}

function generateCircle(container) {
  if (!playing) {
    return;
  }

  const circle = createCircle();
  container.appendChild(circle);                                             //Create new circle 

  circle.addEventListener("animationend", () => {                            //Event for user missing a circle
    circle.remove();
    generateCircle(container);
    addMisses();
  });

  circle.addEventListener("animationcancel", () => {                         //Event for user clicking a circle
    circle.remove();
    generateCircle(container);
  });
}

function addMisses() {
  misses++;
  document.getElementById("livesValue").textContent = 3 - misses;            //Subtract a life from users total
  if ( misses == 3)
  {
    endGame();
  }
}

function endGame() {
  playing = false;                            

  clearInterval(timerId);                                                       //Stop the timer

  const startButton = document.getElementById("startButton");                   //Enable start button
  startButton.disabled = false;

  if (currentScore > userHighScore) {                                           //Update users high score
    userHighScore = currentScore;
    document.getElementById("highScoreValue").textContent = userHighScore;
  }

  setTimeout(function () {                                                      //Display game over message
    alert("Game Over! Your score: " + currentScore);
  }, 100);
}

// Event for start button
document.getElementById("startButton").addEventListener("click", startGame);
