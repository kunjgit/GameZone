const targetNumberElement = document.getElementById('target-color');
const fallingNumbersContainer = document.getElementById('falling-colors');
const scoreDisplay = document.getElementById('score');
let score = 0;

// List of colors
const colors = [
    'Red', 'Green', 'Blue', 'Yellow', 'Cyan', 'Magenta', 'Orange', 'Purple', 'Pink', 'Brown'
];

// Generate a random number
function getRandomNumber() {
    return Math.floor(Math.random() * 10); // Numbers from 0 to 9
}

// Generate a random color from the colors array
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// Update the target number
function updateTargetNumber() {
    const number = getRandomNumber();
    targetNumberElement.textContent = `Number: ${number}`;
   // targetNumberElement.style.color = getRandomColor(); // Set target color
    return number;
}

let targetNumber = updateTargetNumber();

// Create a falling number
function createFallingNumber() {
    const number = getRandomNumber();
    const color = getRandomColor(); // Get a random color for each falling number
    const div = document.createElement('div');
    div.className = 'falling-color';
    div.textContent = number;
    div.style.backgroundColor = color; // Set the background color
    div.style.color = '#fff'; // Text color for visibility
    div.style.fontSize = '24px';
    div.style.textAlign = 'center';
    div.style.lineHeight = '50px'; // Center text vertically
    div.style.left = Math.random() * (fallingNumbersContainer.offsetWidth - 50) + 'px';
    fallingNumbersContainer.appendChild(div);

    let fallSpeed = Math.random() * 2 + 1;

    function fall() {
        const top = parseFloat(div.style.top || 0);
        if (top < fallingNumbersContainer.offsetHeight - 50) {
            div.style.top = top + fallSpeed + 'px';
            requestAnimationFrame(fall);
        } else {
            fallingNumbersContainer.removeChild(div);
        }
    }

    fall();

    div.addEventListener('click', () => {
        if (parseInt(div.textContent) === targetNumber) {
            score += 10;
            scoreDisplay.textContent = `Score: ${score}`;
            targetNumber = updateTargetNumber();
        }
        fallingNumbersContainer.removeChild(div);
    });
}

setInterval(createFallingNumber, 1000);
