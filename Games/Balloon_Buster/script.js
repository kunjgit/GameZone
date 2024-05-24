// Variables
let score = 0;
let highScore = 0;
let timeLeft = 60;
let timerId;
let level = 1;
let ballonsInterval = 1000;
let gameInProgress = false; // Track if the game is in progress
let ballonsGenerationTimeout; // Store the timeout for ballons generation


function createBallons() {
    // Create a container for the balloon
    const balloonContainer = document.createElement("div");
    balloonContainer.className = "balloon-container";
  
    // Generate random position
    const posX = Math.random() * (600 - 100) + 50; // Adjusted for the width of the game container and the width of the balloon
    const posY = Math.random() * (400 - 100) + 50; // Adjusted for the height of the game container and the height of the balloon
  
    // Generate random color
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
  
    // Create SVG balloon element
    const balloonSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    balloonSVG.setAttribute("width", "100");
    balloonSVG.setAttribute("height", "150");
  
    // Create balloon shape
    const balloon = document.createElementNS("http://www.w3.org/2000/svg", "ellipse");
    balloon.setAttribute("cx", "50");
    balloon.setAttribute("cy", "100");
    balloon.setAttribute("rx", "30");
    balloon.setAttribute("ry", "40");
    balloon.setAttribute("fill", color); // Set color
  
    // Create balloon string
    const string = document.createElementNS("http://www.w3.org/2000/svg", "line");
    string.setAttribute("x1", "50");
    string.setAttribute("y1", "0");
    string.setAttribute("x2", "50");
    string.setAttribute("y2", "100");
    string.setAttribute("stroke", "black");
    string.setAttribute("stroke-width", "2");
  
    // Append balloon and string to SVG
    balloonSVG.appendChild(balloon);
    balloonSVG.appendChild(string);
  
    // Append SVG to container
    balloonContainer.appendChild(balloonSVG);
  
    // Set position
    balloonContainer.style.position = "absolute";
    balloonContainer.style.top = `${posY}px`;
    balloonContainer.style.left = `${posX}px`;
  
    // Event listener to pop the balloon
    balloonContainer.addEventListener("click", function () {
      if (balloonContainer.parentNode) {
        score++;
        document.getElementById("scoreValue").textContent = score;
        balloonContainer.parentNode.removeChild(balloonContainer);
        playPopSound();
      }
    });
  
    return balloonContainer;
  }
  
// // Function to create a ballons
// function createBallons() {
//   const ballons = document.createElement("div");
//   ballons.className = "ballons";

//   // Generate random position
//   const posX = Math.random() * 500 + 50;
//   const posY = Math.random() * 300 + 50;

//   ballons.style.top = `${posY}px`;
//   ballons.style.left = `${posX}px`;

//   // Generate random size and color
//   const size = Math.floor(Math.random() * 30) + 20;
//   const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;

//   ballons.style.width = `${size}px`;
//   ballons.style.height = `${size}px`;
//   ballons.style.backgroundColor = color;

//   // Event listener to pop the ballons
//   ballons.addEventListener("click", function () {
//     if (ballons.parentNode) {
//       score++;
//       document.getElementById("scoreValue").textContent = score;
//       ballons.parentNode.removeChild(ballons);
//       playPopSound();
//     }
//   });

//   return ballons;
// }

// Function to start the game
function startGame() {
  if (gameInProgress) {
    return; // Return if game is already in progress
  }

  const ballonsContainer = document.getElementById("ballons");
  const timerElement = document.getElementById("timerValue");
  const startButton = document.getElementById("startButton");

  // Clear previous ballons
  while (ballonsContainer.firstChild) {
    ballonsContainer.firstChild.remove();
  }

  // Reset game state
  score = 0;
  timeLeft = 60;
  level = 1;
  ballonsInterval = 1000;
  document.getElementById("scoreValue").textContent = score;
  document.getElementById("timerValue").textContent = timeLeft;
  gameInProgress = true;

  // Start the timer
  timerId = setInterval(function () {
    timeLeft--;
    timerElement.textContent = timeLeft;

    if (timeLeft === 0) {
      clearInterval(timerId);
      endGame();
    }
  }, 1000);

  // Start generating ballons
  generateBallons(ballonsContainer);

  // Disable start button during gameplay
  startButton.disabled = true;
}

// Function to generate ballons
function generateBallons(container) {
  if (!gameInProgress) {
    return; // Return if game is not in progress
  }

  const ballons = createBallons();
  container.appendChild(ballons);

  // Schedule next ballons generation
  ballonsGenerationTimeout = setTimeout(function () {
    generateBallons(container);
  }, ballonsInterval);
}

// Function to end the game
function endGame() {
  gameInProgress = false; // Set gameInProgress to false

  // Clear bubble generation timeout
  clearTimeout(ballonsGenerationTimeout);

  const startButton = document.getElementById("startButton");
  startButton.disabled = false;
  playEndSound();

  // Update high score
  if (score > highScore) {
    highScore = score;
    document.getElementById("highScoreValue").textContent = highScore;
  }

  // Display game over message
  setTimeout(function () {
    alert("Game Over! Your score: " + score);
  }, 100);
}

// Event listener for start button
document.getElementById("startButton").addEventListener("click", startGame);