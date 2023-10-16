const itemsContainer = document.getElementById('itemsContainer');
const menuContainer = document.getElementById('menuContainer');
const startButton = document.getElementById('startButton');
const checkButton = document.getElementById('checkButton');
const instruction = document.getElementById('instruction');
const result = document.getElementById('result');

const itemsList = [
   "😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "😭", "😢",
  "🍎", "🍌", "🍒", "🍇", "🍋",
  "🍊", "🍐", "🍍", "🍓", "🍉"
];

let itemsShown = [];
let missingItem = '';
let isGameRunning = false;

function generateRandomItems() {
  const randomItems = [];
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * itemsList.length);
    randomItems.push(itemsList[randomIndex]);
  }
  return randomItems;
}

function generateMenuButtons() {
  menuContainer.innerHTML = itemsList.map(item => `<button class="emoji-button">${item}</button>`).join('');
}

function displayItems() {
  itemsShown = generateRandomItems();
  itemsContainer.innerHTML = itemsShown.join(' ');
}

function startGame() {
  if (!isGameRunning) {
    isGameRunning = true;
    generateMenuButtons();
    displayItems();
    setTimeout(() => {
      missingItem = itemsShown[Math.floor(Math.random() * itemsShown.length)];
      const remainingItems = itemsShown.filter(item => item !== missingItem);
      itemsContainer.innerHTML = remainingItems.join(' ');
      menuContainer.style.display = 'flex';
      checkButton.disabled = true;
      instruction.textContent = `Select the missing item from the menu below:`;
    }, 2000); // Show items for 2 seconds
  }
}

function checkItem() {
  if (!isGameRunning) return;

  const selectedButton = document.querySelector('.emoji-button.selected');
  if (selectedButton && selectedButton.textContent === missingItem) {
    result.textContent = `Correct! The missing item is ${missingItem}.`;
  } else {
    result.textContent = `Wrong! The missing item is ${missingItem}.`;
  }

  checkButton.disabled = true;
  isGameRunning = false;
  menuContainer.style.display = 'none';
}

function selectItem(event) {
  if (isGameRunning) {
    const selectedButton = document.querySelector('.emoji-button.selected');
    if (selectedButton) {
      selectedButton.classList.remove('selected');
    }
    event.target.classList.add('selected');
    checkButton.disabled = false;
  }
}

startButton.addEventListener('click', startGame);
checkButton.addEventListener('click', checkItem);
menuContainer.addEventListener('click', selectItem);
