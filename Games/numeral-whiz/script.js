const sequenceDisplay = document.getElementById('sequence-display');
const userInput = document.getElementById('user-input');
const checkButton = document.getElementById('check-button');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');

let sequence = [];
let userSequence = [];
let score = 0;
let round = 1;
let sequenceTimeout;
let userInputValue = '';

function generateRandomDigit() {
  return Math.floor(Math.random() * 10);
}

function showSequence() {
  sequence = [];
  for (let i = 0; i < round; i++) {
    sequence.push(generateRandomDigit());
  }

  sequenceDisplay.textContent = sequence.join(' ');
  sequenceTimeout = setTimeout(() => {
    sequenceDisplay.textContent = '';
    userInput.disabled = false;
    userInput.focus();
    enableCheckButton();
  }, 2000);
}

function enableCheckButton() {
  checkButton.disabled = false;
}

function disableCheckButton() {
  checkButton.disabled = true;
}

function checkUserInput() {
  userInputValue = userInput.value;
  enableCheckButton();
}

function checkSequence() {
  if (userInputValue === sequence.join('')) {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    round++;
    userInput.value = '';
    userInputValue = '';
    disableCheckButton();
    showSequence();
  } else {
    endGame();
  }
}

function endGame() {
  clearTimeout(sequenceTimeout);
  userInput.disabled = true;
  sequenceDisplay.textContent = 'Game Over';
  startButton.style.display = 'block';
}

startButton.addEventListener('click', () => {
  startButton.style.display = 'none';
  score = 0;
  round = 1;
  scoreDisplay.textContent = `Score: ${score}`;
  showSequence();
});

checkButton.addEventListener('click', checkSequence);
userInput.addEventListener('input', checkUserInput);
