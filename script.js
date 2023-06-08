var numColors = 3; // Number of color options to display
var colors = []; // Array to store RGB colors
var pickedColor; // Randomly picked color
var gameWon = false; // Tracks if the game has been won

var colorDisplay = document.getElementById("color-display");
var colorButtons = document.getElementsByClassName("color-btn");
var messageDisplay = document.getElementById("message");
var resetButton = document.getElementById("reset-btn");

init();

function init() {
  resetColors();
  setupColorButtons();
  reset();
}

function reset() {
  // Generate random RGB colors
  pickedColor = pickColor();
  colorDisplay.style.backgroundColor = pickedColor;
  messageDisplay.textContent = "";
  resetButton.textContent = "New Colors";
  resetButton.disabled = false; // Enable the button

  // Assign colors to color options
  for (var i = 0; i < colorButtons.length; i++) {
    if (colors[i]) {
      colorButtons[i].style.backgroundColor = colors[i];
      colorButtons[i].style.display = "block";
    } else {
      colorButtons[i].style.display = "none";
    }
  }
  gameWon = false; // Reset the game won flag
}

function resetColors() {
  colors = generateRandomColors(numColors);
}

function generateRandomColors(num) {
  var arr = [];
  for (var i = 0; i < num; i++) {
    arr.push(randomColor());
  }
  return arr;
}

function randomColor() {
  var red = Math.floor(Math.random() * 256);
  var green = Math.floor(Math.random() * 256);
  var blue = Math.floor(Math.random() * 256);
  return "rgb(" + red + ", " + green + ", " + blue + ")";
}

function setupColorButtons() {
  for (var i = 0; i < colorButtons.length; i++) {
    colorButtons[i].addEventListener("click", function () {
      if (!gameWon) { // Check if the game is not already won
        var clickedColor = this.style.backgroundColor;
        if (clickedColor === pickedColor) {
          messageDisplay.textContent = "Correct!";
          changeColors(clickedColor);
          resetButton.textContent = "Play Again";
          gameWon = true; // Set the game won flag
        } else {
          this.style.backgroundColor = "#f2f2f2";
          messageDisplay.textContent = "Try Again";
        }
      }
    });
  }
}

function changeColors(color) {
  for (var i = 0; i < colorButtons.length; i++) {
    colorButtons[i].style.backgroundColor = color;
  }
}

function pickColor() {
  var randomIndex = Math.floor(Math.random() * colors.length);
  return colors[randomIndex];
}

resetButton.addEventListener("click", function () {
  reset();
});
