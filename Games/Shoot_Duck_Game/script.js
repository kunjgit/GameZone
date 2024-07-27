const duck = document.querySelector('.box-duck');
const scoreValue = document.getElementById('scoreValue');
const score = document.getElementById('score');

let currentScore = 0;

duck.addEventListener('click', () => {
    currentScore++;
    scoreValue.textContent = currentScore;
    moveDuckRandomly();
});

function moveDuckRandomly() {
    const maxWidth = window.innerWidth - duck.clientWidth;
    const maxHeight = window.innerHeight - duck.clientHeight;

    const randomX = Math.random() * maxWidth;
    const randomY = Math.random() * maxHeight;

    duck.style.left = randomX + 'px';
    duck.style.top = randomY + 'px';
}

moveDuckRandomly();