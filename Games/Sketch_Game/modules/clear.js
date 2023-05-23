const createClearBtn = (clearButton) => {
  clearButton.textContent = 'Clear';
  clearButton.classList.add('btn');
};

const getClear = () => {
  const container = document.querySelector('.container');
  const clearButton = document.getElementById('clear');
  createClearBtn(clearButton);
  const boxes = container.querySelectorAll('.grid');
  clearButton.addEventListener('click', () => {
    boxes.forEach((box) => (box.style.background = 'white'));
  });
};

export default getClear;
