document.getElementById('generateBtn').addEventListener('click', generateColors);

function generateColors() {
    const colorContainer = document.getElementById('colorContainer');
    colorContainer.innerHTML = ''; // Clear existing colors

    for (let i = 0; i < 6; i++) {
        const color = getRandomColor();
        const colorBox = document.createElement('div');
        colorBox.className = 'colorBox';
        colorBox.style.backgroundColor = color;
        colorBox.innerText = color.toUpperCase();
        colorContainer.appendChild(colorBox);
    }
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

// Generate initial colors on page load
generateColors();
