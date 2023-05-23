import createButtons from './modules/createButtons.js';
import getClear from './modules/clear.js';

const createGrid = (number, container) => {
  for (let i = 0; i < number * number; i++) {
    const div = document.createElement('div');
    div.classList.add('grid');
    container.appendChild(div);
  }
  container.style.gridTemplateColumns = `repeat(${number}, auto)`;
  container.style.gridTemplateRows = `repeat(${number}, auto)`;
};

const startApp = () => {
  const container = document.querySelector('.container');
  const newGridButton = document.getElementById('new');
  createGrid(16, container);
  createButtons(newGridButton);
  getClear();

  newGridButton.addEventListener('click', () => {
    const boxes = container.querySelectorAll('.grid');
    boxes.forEach((box) => box.remove());
    const colorBtns = document.querySelectorAll('.color-btn');
    colorBtns.forEach((btn) => btn.remove());
    let input = prompt(
      'Number of squares per side :',
      'Enter a number between 2 and 80'
    );
    if (input === null || input < 2 || input > 80 || isNaN(input)) {
      location.reload();
    } else {
      createGrid(input, container);
      createButtons(newGridButton);
      getClear();
    }
  });
};

startApp();
