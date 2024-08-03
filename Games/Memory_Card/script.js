const cardGrid = document.getElementById('cardGrid');
const startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');

const cardValues = ['🌟', '🌙', '🌈', '🌞', '🌎', '🌺'];
const cards = [...cardValues, ...cardValues];
let flippedCards = [];
let matchedPairs = 0;
let score = 0;
let timer;
let seconds = 0;
let gameStarted = false;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createCard(value) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.innerHTML = `
        <div class="card-face card-front">${value}</div>
        <div class="card-face card-back">?</div>
    `;
    card.addEventListener('click', flipCard);
    return card;
}

function flipCard() {
    if (!gameStarted) return;
    if (flippedCards.length < 2 && !this.classList.contains('flipped')) {
        this.classList.add('flipped');
        flippedCards.push(this);
        createParticles(this);

        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 1000);
        }
    }
}

function checkMatch() {
    const [card1, card2] = flippedCards;
    const value1 = card1.querySelector('.card-front').textContent;
    const value2 = card2.querySelector('.card-front').textContent;

    if (value1 === value2) {
        card1.removeEventListener('click', flipCard);
        card2.removeEventListener('click', flipCard);
        card1.classList.add('glow');
        card2.classList.add('glow');
        matchedPairs++;
        score += 10;
        updateScore();

        if (matchedPairs === cardValues.length) {
            endGame();
        }
    } else {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        score = Math.max(0, score - 1);
        updateScore();
    }

    flippedCards = [];
}

function updateTimer() {
    seconds++;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `Time: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function updateScore() {
    scoreDisplay.textContent = `Score: ${score}`;
}

function startGame() {
    if (gameStarted) return;
    gameStarted = true;
    startBtn.disabled = true;
    shuffleArray(cards);
    cardGrid.innerHTML = '';
    cards.forEach(value => {
        const card = createCard(value);
        cardGrid.appendChild(card);
    });
    timer = setInterval(updateTimer, 1000);
}

function resetGame() {
    clearInterval(timer);
    seconds = 0;
    score = 0;
    matchedPairs = 0;
    gameStarted = false;
    startBtn.disabled = false;
    updateTimer();
    updateScore();
    cardGrid.innerHTML = '';
}

function endGame() {
    clearInterval(timer);
    gameStarted = false;
    alert(`Congratulations! You won!\nTime: ${timerDisplay.textContent}\nScore: ${score}`);
}

function createParticles(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        document.body.appendChild(particle);

        const size = Math.random() * 5 + 2;
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 2 + 1;
        let x = centerX;
        let y = centerY;

        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        const animation = particle.animate([
            { transform: `translate(0, 0)`, opacity: 1 },
            { transform: `translate(${Math.cos(angle) * 100}px, ${Math.sin(angle) * 100}px)`, opacity: 0 }
        ], {
            duration: 1000 / velocity,
            easing: 'cubic-bezier(0, .9, .57, 1)',
        });

        animation.onfinish = () => particle.remove();
    }
}

startBtn.addEventListener('click', startGame);
resetBtn.addEventListener('click', resetGame);