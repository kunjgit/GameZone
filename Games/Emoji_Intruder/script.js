const gridContainer = document.getElementById('gridContainer');
const instruction = document.getElementById('instruction');
const timer = document.getElementById('timer');
const timeLeftDisplay = document.getElementById('timeLeft');
const result = document.getElementById('result');

const emojisList = [
  "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "😭", "😢"
];

let gridItems = [];
let oddOneOutIndex = -1;
let timeLeft = 20;
let timerId = null;

function generateRandomGrid() {
  const randomIndex = Math.floor(Math.random() * emojisList.length);
  oddOneOutIndex = Math.floor(Math.random() * 63); // 7 columns * 9 rows = 63 cells

  gridItems = Array.from({ length: 63 }, (_, index) => {
    return index === oddOneOutIndex ? emojisList[randomIndex] : emojisList[randomIndex];
  });

  // Ensure there is at least one different emoji
  if (gridItems.every((emoji, index) => emoji === gridItems[oddOneOutIndex] || index === oddOneOutIndex)) {
    const newRandomIndex = (randomIndex + 1) % emojisList.length;
    const randomCell = Math.floor(Math.random() * 63);
    gridItems[randomCell] = emojisList[newRandomIndex];
    oddOneOutIndex = randomCell;
  }
}

function displayGrid() {
  gridContainer.innerHTML = gridItems.map((emoji, index) => {
    return `<button class="emoji-button ${index === oddOneOutIndex ? 'odd' : ''}" data-index="${index}">${emoji}</button>`;
  }).join('');
}

function startGame() {
  clearInterval(timerId);
  timeLeft = 20;
  timerId = setInterval(updateTime, 1000);

  gridContainer.addEventListener('click', checkEmoji);
  gridContainer.classList.remove('disabled');
  result.textContent = '';
  instruction.textContent = 'Find the odd one out among the emojis.';

  // Remove 'highlight' class from all emoji buttons before generating the grid
  const emojiButtons = document.querySelectorAll('.emoji-button');
  emojiButtons.forEach(button => {
    button.classList.remove('highlight');
  });

  generateRandomGrid();
  displayGrid();
}

function updateTime() {
  timeLeft--;
  timeLeftDisplay.textContent = timeLeft;
  if (timeLeft <= 0) {
    clearInterval(timerId);
    gridContainer.removeEventListener('click', checkEmoji);
    gridContainer.classList.add('disabled');

    // Highlight the odd emoji after time runs out
    const oddEmojiButton = gridContainer.querySelector(`[data-index="${oddOneOutIndex}"]`);
    oddEmojiButton.classList.add('highlight');

    instruction.textContent = 'Time\'s up! Click "Start" to play again.';
  }
}

function checkEmoji(event) {
  if (event.target.classList.contains('emoji-button')) {
    const clickedIndex = parseInt(event.target.dataset.index);
    if (clickedIndex === oddOneOutIndex) {
      result.textContent = 'Correct! You found the odd one out!';
    } else {
      result.textContent = 'Wrong! Keep looking!';
    }

    clearInterval(timerId);
    gridContainer.removeEventListener('click', checkEmoji);
    gridContainer.classList.add('disabled');

    // Highlight the odd emoji after player's selection
    const oddEmojiButton = gridContainer.querySelector(`[data-index="${oddOneOutIndex}"]`);
    oddEmojiButton.classList.add('highlight');

    instruction.textContent = 'Click "Start" to play again.';
  }
}

document.getElementById('startButton').addEventListener('click', startGame);
displayGrid();
