const numbersDiv = document.getElementById('numbers');
const shuffleBtn = document.getElementById('shuffle-btn');
const resultDiv = document.getElementById('result');

let numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3];

function displayNumbers() {
    numbersDiv.innerHTML = '';
    numbers.forEach((num, index) => {
        const numDiv = document.createElement('div');
        numDiv.className = 'number';
        numDiv.draggable = true;
        numDiv.textContent = num;
        numDiv.dataset.index = index;
        numbersDiv.appendChild(numDiv);
    });
    addDragAndDropHandlers();
}

function shuffleNumbers() {
    for (let i = numbers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
    }
    displayNumbers();
    resetResult();
}

function addDragAndDropHandlers() {
    const numberElements = document.querySelectorAll('.number');
    numberElements.forEach((number) => {
        number.addEventListener('dragstart', handleDragStart);
        number.addEventListener('dragover', handleDragOver);
        number.addEventListener('drop', handleDrop);
    });
}

let draggedElement = null;

function handleDragStart(event) {
    draggedElement = event.target;
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', draggedElement.dataset.index);
}

function handleDragOver(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
}

function handleDrop(event) {
    event.preventDefault();
    const fromIndex = draggedElement.dataset.index;
    const toIndex = event.target.dataset.index;
    if (fromIndex !== toIndex) {
        [numbers[fromIndex], numbers[toIndex]] = [numbers[toIndex], numbers[fromIndex]];
        displayNumbers();
    }
    checkSorted();
}

function checkSorted() {
    if (numbers.slice().sort((a, b) => a - b).join('') === numbers.join('')) {
        resultDiv.textContent = 'Correct! The numbers are sorted.';
        document.querySelectorAll('.number').forEach((number) => {
            number.classList.add('sorted');
        });
        resultDiv.style.opacity = 1;
        document.body.classList.add('sorted');
    } else {
        resetResult();
    }
}

function resetResult() {
    resultDiv.textContent = '';
    document.querySelectorAll('.number').forEach((number) => {
        number.classList.remove('sorted');
    });
    resultDiv.style.opacity = 0;
    document.body.classList.remove('sorted');
}

shuffleBtn.addEventListener('click', shuffleNumbers);

// Initial display
displayNumbers();
