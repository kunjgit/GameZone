// script.js
const gameBoard = document.getElementById('gameBoard');
const moneyElement = document.getElementById('money');
const happinessElement = document.getElementById('happiness');

const buildings = {
    house: { cost: 100, happiness: 10, color: 'green' },
    factory: { cost: 200, happiness: -20, color: 'gray' },
    park: { cost: 150, happiness: 20, color: 'lightgreen' }
};

let currentBuilding = null;
let money = 1000;
let happiness = 100;

// Create the game board
for (let i = 0; i < 100; i++) {
    const cell = document.createElement('div');
    cell.addEventListener('click', () => placeBuilding(cell));
    gameBoard.appendChild(cell);
}

// Update money and happiness display
function updateInfo() {
    moneyElement.textContent = money;
    happinessElement.textContent = happiness;
}

// Place a building on the selected cell
function placeBuilding(cell) {
    if (currentBuilding && cell.style.backgroundColor === '') {
        const building = buildings[currentBuilding];
        if (money >= building.cost) {
            cell.style.backgroundColor = building.color;
            money -= building.cost;
            happiness += building.happiness;
            updateInfo();
        } else {
            alert('Not enough money to place this building!');
        }
    }
}

// Button event listeners
document.getElementById('placeHouse').addEventListener('click', () => {
    currentBuilding = 'house';
});
document.getElementById('placeFactory').addEventListener('click', () => {
    currentBuilding = 'factory';
});
document.getElementById('placePark').addEventListener('click', () => {
    currentBuilding = 'park';
});

updateInfo();
