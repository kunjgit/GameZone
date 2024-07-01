// Initialising variables
const scoreText = document.querySelector('.game__wrapper--score');
const gameWrapper = document.querySelector('.game__wrapper--pitch');

// Declaring variables
let gameScore = 0;
let defaultMode = 700;
let boxNumbers = 6;
let boxName = "pitch__block";
let lightClass = "light";
scoreText.textContent = `Score: ${gameScore}`

// Difficulty Levels
const easyLevel = document.querySelector('.game__mode--easy')
const mediumLevel = document.querySelector('.game__mode--medium')
const hardLevel = document.querySelector('.game__mode--hard')

// Easy level
const easyChange = () => {
    localStorage.setItem('level', 'easy')
    window.location.reload();
}

// Medium level
const mediumChange = () => {
    localStorage.setItem('level', 'medium')
    window.location.reload();
}

// Hard level
const hardChange = () => {
    localStorage.setItem('level', 'hard')
    window.location.reload();
}

// Adding event listener on easy, medium and hard levels
easyLevel.addEventListener('click', easyChange);
mediumLevel.addEventListener('click', mediumChange);
hardLevel.addEventListener('click', hardChange);

// Different setting for different levels
if (localStorage.getItem('level') == 'medium') {
    defaultMode = 550;
    boxNumbers = 12;
    lightClass = "light__medium";
    boxName = "pitch__block--medium";
} else if (localStorage.getItem('level') == 'hard') {
    defaultMode = 420;
    boxNumbers = 30;
    lightClass = "light__hard";
    boxName = "pitch__block--hard";
} else {
    defaultMode = 700;
}

// Create Boxes
for (i = 0; i < boxNumbers; i++) {
    const oneBoxEasy = document.createElement('div');
    oneBoxEasy.classList.add(boxName);
    gameWrapper.appendChild(oneBoxEasy);
}

const gameBoxes = document.querySelectorAll(`.${boxName}`);

//Random Box Generator
const randomIndex = () => {
    const randomNumber = Math.floor(Math.random() * gameBoxes.length);
    gameBoxes[randomNumber].classList.add(lightClass);
}

//Hide Box after time
const hideBox = () => {
    gameBoxes.forEach(function (clearBox) {
        clearBox.classList.remove(lightClass);
    })
};
setInterval(hideBox, defaultMode);

//Score and logic
gameBoxes.forEach(function (gameBox) {
    gameBox.addEventListener('click', function () {
        if (gameBox.classList.contains(lightClass)) {
            gameBox.classList.remove(lightClass);
            gameScore += 1;
            scoreText.textContent = `Score: ${gameScore}`
        } else {
            gameScore += 0;
        }

    })
});

setInterval(randomIndex, defaultMode);
