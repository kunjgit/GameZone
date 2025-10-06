let countries = []; // will fetch from JSON
let mode = null;
let difficulty = 'easy';
let score = 0;
let lives = 3;
let currentTarget = null;
let options = [];

const modeButtons = document.querySelectorAll('.mode');
const startBtn = document.getElementById('startBtn');
const difficultySelect = document.getElementById('difficulty');
const timerSelect = document.getElementById('timerMode');
const gameDiv = document.getElementById('game');
const menuDiv = document.getElementById('menu');
const modeLabel = document.getElementById('modeLabel');
const clueImg = document.getElementById('clueImg');
const optionsDiv = document.getElementById('options');
const scoreSpan = document.getElementById('score');
const livesSpan = document.getElementById('lives');
const nextBtn = document.getElementById('nextBtn');
const quitBtn = document.getElementById('quitBtn');

// Difficulty groups
let easyCountries = [];
let mediumCountries = [];
let hardCountries = [];

fetch('countries.json')
  .then(res => res.json())
  .then(data => {
    countries = data;

    // Example grouping (you can customize as needed)
    easyCountries = countries.slice(0, 50);    // more familiar countries
    mediumCountries = countries.slice(50, 150);
    hardCountries = countries.slice(150);
  });

// Mode selection
modeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    modeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    mode = btn.dataset.mode;
    startBtn.disabled = false;
  });
});

// Difficulty selection
difficultySelect.addEventListener('change', e => difficulty = e.target.value);

// Start game
startBtn.addEventListener('click', () => {
  menuDiv.style.display = 'none';
  gameDiv.style.display = 'block';
  score = 0;
  lives = 3;
  scoreSpan.textContent = score;
  livesSpan.textContent = lives;
  modeLabel.textContent = mode === 'flag' ? 'Guess the Country' : 'Which country has this capital?';
  nextQuestion();
});

// Quit button
quitBtn.addEventListener('click', () => location.reload());

// Next button
nextBtn.addEventListener('click', () => {
  nextBtn.classList.add('hidden');
  nextQuestion();
});

// Generate next question
function nextQuestion() {
  optionsDiv.innerHTML = '';
  clueImg.style.display = 'none';

  // Choose difficulty pool
  let pool = easyCountries;
  if (difficulty === 'medium') pool = mediumCountries;
  else if (difficulty === 'hard') pool = hardCountries;

  // Pick target country
  currentTarget = pool[Math.floor(Math.random() * pool.length)];

  // Show flag if mode is flag
  if (mode === 'flag') {
    clueImg.src = currentTarget.flag;
    clueImg.style.display = 'block';
  }

  // Generate options
  options = [currentTarget];
  while (options.length < 4) {
    let rand = pool[Math.floor(Math.random() * pool.length)];
    if (!options.includes(rand)) options.push(rand);
  }

  shuffle(options);

  // Render options
  options.forEach(opt => {
    const btn = document.createElement('button');
    btn.classList.add('optionBtn');

    // Flag mode shows country names; Capital mode also shows country names
    btn.textContent = opt.name;

    btn.addEventListener('click', () => checkAnswer(opt));
    optionsDiv.appendChild(btn);
  });

  // Show capital in capital mode as the question
  if (mode === 'capital') {
    modeLabel.textContent = `Which country has the capital: ${currentTarget.capital}?`;
  } else {
    modeLabel.textContent = `Guess the country`;
  }
}

// Check answer
function checkAnswer(selected) {
  const correct = currentTarget.name;
  const buttons = document.querySelectorAll('.optionBtn');

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent === correct) btn.classList.add('correct');
    else if (btn.textContent === selected.name) btn.classList.add('wrong');
  });

  if (selected.name === correct) {
    score++;
    scoreSpan.textContent = score;
  } else {
    lives--;
    livesSpan.textContent = lives;
    if (lives === 0) {
      alert(`Game Over! Your score: ${score}`);
      location.reload();
      return;
    }
  }

  nextBtn.classList.remove('hidden');
}

// Simple shuffle function
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
