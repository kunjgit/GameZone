// script.js
const ingredients = document.querySelectorAll('.ingredient');
const orderDisplay = document.getElementById('order');
const serveButton = document.getElementById('serveButton');
const scoreDisplay = document.getElementById('score');
const timeDisplay = document.getElementById('time');

let currentOrder = [];
let selectedIngredients = [];
let score = 0;
let time = 60;

const allIngredients = ['tomato', 'lettuce', 'cheese', 'bread'];

function getRandomIngredient() {
    return allIngredients[Math.floor(Math.random() * allIngredients.length)];
}

function generateOrder() {
    currentOrder = [];
    for (let i = 0; i < 3; i++) {
        currentOrder.push(getRandomIngredient());
    }
    orderDisplay.innerHTML = 'Order: ' + currentOrder.join(', ');
}

ingredients.forEach(ingredient => {
    ingredient.addEventListener('click', () => {
        if (!selectedIngredients.includes(ingredient.id)) {
            selectedIngredients.push(ingredient.id);
            ingredient.style.backgroundColor = '#dcdcdc';
        }
    });
});

serveButton.addEventListener('click', () => {
    if (arraysEqual(selectedIngredients, currentOrder)) {
        score += 10;
        scoreDisplay.innerHTML = score;
        resetRound();
    } else {
        alert('Wrong ingredients!');
    }
});

function resetRound() {
    selectedIngredients = [];
    ingredients.forEach(ingredient => {
        ingredient.style.backgroundColor = '#fff';
    });
    generateOrder();
}

function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    a.sort();
    b.sort();
    for (let i = 0; i < a.length; i++) {
        if (a[i] !== b[i]) return false;
    }
    return true;
}

function updateTimer() {
    time--;
    timeDisplay.innerHTML = time;
    if (time <= 0) {
        clearInterval(timer);
        alert('Game over! Your score is ' + score);
    }
}

generateOrder();
const timer = setInterval(updateTimer, 1000);
