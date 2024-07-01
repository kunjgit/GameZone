const colors = ["red", "Sky-blue", "green", "light-yellow"];
let currentColor;
let score = 0;

const colorSwitcher = document.getElementById("color-switcher");
const scoreElement = document.getElementById("score");

colorSwitcher.addEventListener("click", changeColor);

function changeColor() {
    console.log("hii")
  const randomIndex = Math.floor(Math.random() * colors.length);
  const newColor = colors[randomIndex];

  if (newColor === currentColor) {
    score++;
    scoreElement.textContent = `Computer selected ${newColor} Score: ${score}`;
  } else {
    score = 0;
    scoreElement.textContent = `Game Over!`;
  }

  currentColor = newColor;
  colorSwitcher.className = newColor;
}

// Initial color setup
changeColor();
