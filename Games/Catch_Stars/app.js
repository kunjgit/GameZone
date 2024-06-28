const screens = document.querySelectorAll('.screen');
const start_btn = document.getElementById('start-btn');
const reset_btn = document.getElementById('reset-btn');
const game_container = document.getElementById('game-container');
const timeEl = document.getElementById('time');
const scoreEl = document.getElementById('score');
const message = document.getElementById('message');
let seconds = 0;
let score = 0;
let selected_star = { src: 'https://upload.wikimedia.org/wikipedia/commons/4/45/Star_icon-72a7cf.svg', alt: 'yellow star' };
let interval;

start_btn.addEventListener('click', () => {
    screens[0].classList.add('up');
    setTimeout(createStar, 1000);
    startGame();
});

reset_btn.addEventListener('click', resetGame);

function startGame() {
    interval = setInterval(increaseTime, 1000);
}

function increaseTime() {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    m = m < 10 ? `0${m}` : m;
    s = s < 10 ? `0${s}` : s;
    timeEl.innerHTML = `Time: ${m}:${s}`;
    seconds++;
}

function createStar() {
    const star = document.createElement('div');
    star.classList.add('star');
    const { x, y } = getRandomLocation();
    star.style.top = `${y}px`;
    star.style.left = `${x}px`;
    star.innerHTML = `<img src="${selected_star.src}" alt="${selected_star.alt}" style="transform: rotate(${Math.random() * 360}deg)" />`;

    star.addEventListener('click', catchStar);

    game_container.appendChild(star);
}

function getRandomLocation() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const x = Math.random() * (width - 200) + 100;
    const y = Math.random() * (height - 200) + 100;
    return { x, y };
}

function catchStar() {
    increaseScore();
    this.classList.add('caught');
    setTimeout(() => this.remove(), 2000);
    addStars();
}

function addStars() {
    setTimeout(createStar, 1000);
    setTimeout(createStar, 1500);
}

function increaseScore() {
    score++;
    if(score > 19) {
        message.classList.add('visible');
    }
    scoreEl.innerHTML = `Score: ${score}`;
}

function resetGame() {
    clearInterval(interval);
    seconds = 0;
    score = 0;
    timeEl.innerHTML = 'Time: 00:00';
    scoreEl.innerHTML = 'Score: 0';
    message.classList.remove('visible');
    screens[0].classList.remove('up');
    const stars = document.querySelectorAll('.star');
    stars.forEach(star => star.remove());
}
