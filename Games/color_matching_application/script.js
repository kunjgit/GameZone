let targetColor;
let score = 0;

function generateRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

function setTargetColor() {
    targetColor = generateRandomColor();
    document.getElementById('targetColor').style.backgroundColor = targetColor;
}

function createColorGrid() {
    const grid = document.getElementById('colorGrid');
    grid.innerHTML = '';

    const targetIndex = Math.floor(Math.random() * 16);
    for (let i = 0; i < 16; i++) {
        const colorBox = document.createElement('div');
        colorBox.classList.add('color-cell');

        if (i === targetIndex) {
            colorBox.style.backgroundColor = targetColor;
        } else {
            colorBox.style.backgroundColor = generateRandomColor();
        }

        colorBox.addEventListener('click', () => {
            if (colorBox.style.backgroundColor === targetColor) {
                score++;
                document.getElementById('score').textContent = score;
                startGame();
            } else {
                alert('Wrong color! Try again.');
            }
        });

        grid.appendChild(colorBox);
    }
}

function startGame() {
    setTargetColor();
    createColorGrid();
}

// Initialize the game for the first time
startGame();
