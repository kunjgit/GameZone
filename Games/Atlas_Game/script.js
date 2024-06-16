const currentPlaceElement = document.getElementById('current-place');
const userInput = document.getElementById('user-input');
const submitButton = document.getElementById('submit-button');
const resetButton = document.getElementById('reset-button');
const messageElement = document.getElementById('message');
const timerElement = document.getElementById('timer');
const timerContainer = document.getElementById('timer-container');

let places = [];
let usedPlaces = new Set();
let timer;
let timerInterval;

async function fetchPlaces() {
    const response = await fetch('places.json', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await response.json();
    return data.places;
}

function getRandomPlace() {
    const availablePlaces = places.filter(place => !usedPlaces.has(place.toLowerCase()));
    if (availablePlaces.length === 0) {
        return null;
    }
    return availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
}

function isValidPlace(place) {
    return places.some(p => p.toLowerCase() === place.toLowerCase());
}

function getNextPlaceStartingWith(letter) {
    const availablePlaces = places.filter(place => !usedPlaces.has(place.toLowerCase()) && place[0].toLowerCase() === letter.toLowerCase());
    if (availablePlaces.length === 0) {
        return null;
    }
    return availablePlaces[Math.floor(Math.random() * availablePlaces.length)];
}

function startTimer() {
    clearInterval(timerInterval);
    timer = 15;
    timerElement.textContent = timer;
    userInput.disabled = false;
    timerContainer.classList.remove('red');

    timerInterval = setInterval(() => {
        timer--;
        timerElement.textContent = timer;
        if (timer <= 5) {
            timerContainer.classList.add('red');
        }
        if (timer <= 0) {
            clearInterval(timerInterval);
            messageElement.textContent = 'Time\'s up! You didn\'t enter a valid place in time.';
            userInput.disabled = true;
        }
    }, 1000);
}

function resetGame() {
    usedPlaces.clear();
    userInput.value = '';
    messageElement.textContent = '';
    initializeGame();
}

async function initializeGame() {
    try {
        places = await fetchPlaces();
        let currentPlace = getRandomPlace();
        if (currentPlace) {
            usedPlaces.add(currentPlace.toLowerCase());
            currentPlaceElement.textContent = currentPlace;
            startTimer();
        } else {
            messageElement.textContent = 'No more places available.';
        }

        submitButton.addEventListener('click', () => {
            const userPlace = userInput.value.trim();
            if (isValidPlace(userPlace) && !usedPlaces.has(userPlace.toLowerCase())) {
                const lastLetter = userPlace.slice(-1).toLowerCase();
                const nextPlace = getNextPlaceStartingWith(lastLetter);
                if (nextPlace) {
                    usedPlaces.add(userPlace.toLowerCase());
                    currentPlace = nextPlace;
                    usedPlaces.add(currentPlace.toLowerCase());
                    currentPlaceElement.textContent = currentPlace;
                    userInput.value = '';
                    messageElement.textContent = '';
                    startTimer();
                } else {
                    messageElement.textContent = 'No place found starting with "' + lastLetter.toUpperCase() + '".';
                }
            } else if (usedPlaces.has(userPlace.toLowerCase())) {
                messageElement.textContent = '"' + userPlace + '" has already been used.';
            } else {
                messageElement.textContent = '"' + userPlace + '" is not a city in India.';
            }
        });

        resetButton.addEventListener('click', resetGame);
    } catch (error) {
        console.error('Error fetching places:', error);
        messageElement.textContent = 'Error fetching places. Please try again later.';
    }
}

// Initialize the game
initializeGame();
