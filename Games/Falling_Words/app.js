// HTTP GET LEVEL FROM index.html
const params = new URLSearchParams(window.location.search);
const LEVEL = params.get('lvl');

// DOM ELEMENTS
const buttonElementID = document.getElementById('StartButton');
const gameContentID = document.getElementById('GameContent');
const gameContentClass = document.getElementsByClassName('game-content');
const inputElementID = document.getElementById('InputWord');
const scoreElementID = document.getElementById('Score');
const scoreElementClass = document.getElementsByClassName('score');
const levelElementID = document.getElementById('Level');

// VARIABLES
const currentLevel = LEVEL;
const gameWidth = gameContentID.clientWidth;
const gameHeight = gameContentID.clientHeight;
let score = 0;
let gameOver = false;
let arrWords = [];
let arrWordsDiv = [];
let topVal = 0;

// SOUNDS
const startGameSound = document.getElementById('StartGameSound');
const gameoverSound = document.getElementById('GameoverSound');
const pointSound = document.getElementById('PointSound');
const notPointSound = document.getElementById('NotPointSound');

// DEFAULT VOLUME (was too high)
startGameSound.style.zIndex = 1;
startGameSound.volume = 0.5;
gameoverSound.volume = 0.5;
pointSound.volume = 0.2;

// DICTIONARY WORDS
const DICTIONARY = [
  'school',
  'college',
  'btc',
  'elon',
  'musk',
  'courses',
  'internet',
  'patience',
  'argentina',
  'motivation',
  'tech',
  'info',
  'send',
  'mate',
  'reactjs',
  'game',
  'brusca',
  'graphic',
  'copper',
  'boca',
  'lie',
  'case',
  'expand',
  'absence',
  'football',
  'native',
  'demon',
  'thread',
  'award',
  'tycoon',
  'riquelme',
  'still',
  'empirical',
  'doll',
  'java',
  'ackerman',
  'dinner',
  'register',
  'proof',
  'script',
  'wrist',
  'sulphur',
  'selection',
  'slam',
  'grandmother',
  'assertive',
  'eaux',
  'javascript',
  'admiration',
  'recognize',
  'roll',
  'bank',
  'reactor',
  'gradient',
  'ribbon',
  'slayer',
  'pleasant',
  'path',
  'draft',
  'polish',
  'art',
  'hook',
  'messi',
  'flow',
  'operational',
  'transaction',
  'physics',
  'rally',
  'fold',
  'housewife',
  'suspicion',
  'craft',
  'objective',
  'grass',
  'reckless',
  'manual',
  'test',
  'switch',
  'diegote',
  'silver',
  'take',
  'president',
  'constituency',
  'basis',
  'cluster',
  'psychology',
  'cat',
  'minimize',
  'hide',
  'chord',
  'brilliance',
  'official',
  'condition',
  'guideline',
  'apology',
  'general',
  'sock',
  'hunting',
  'kinship',
  'change',
  'departure',
  'mile',
  'ancestor',
  'diego',
  'cheat',
  'taxi',
  'tight',
  'moment',
  'dimension',
  'family',
  'vegan',
  'projection',
  'demonstration',
  'pony',
  'standard',
  'appendix',
  'reluctance',
  'gian',
  'davinci',
  'system',
  'analyst',
  'levi',
];

// GAME START
function init() {
  showLevel();
  setInterval(() => {
    if (!gameOver) {
      drawWord();
    }
  }, currentLevel);
  updateWordPosition();
}

// CREATE WORD, STORES IT IN AN ARRAY & GET POSITION WHERE IT STARTS TO FALLLS
function drawWord() {
  const word = generateRandomWord(DICTIONARY);
  arrWords.push(word);
  let wordDiv = document.createElement('div');
  wordDiv.innerHTML = `<p>${word}</p>`;
  wordDiv.classList.add('word');
  wordDiv.style.top = '-2px';
  wordDiv.style.zIndex = '1';
  wordDiv.style.left = (Math.random() * (gameWidth - 150)).toString() + 'px';
  arrWordsDiv.push(wordDiv);
  gameContentClass[0].appendChild(wordDiv);
}

// GET RANDOM WORD FROM DICTIONARY
function generateRandomWord(words) {
  return words[Math.floor(Math.random() * words.length)];
}

// GET VALUE FROM INPUT
function getWord() {
  let inputValue = inputElementID.value.toLowerCase();
  inputElementID.value = '';
  if (arrWords.includes(inputValue)) {
    updateScore();
    let indexWord = arrWords.indexOf(inputValue);
    let wordDivIndex = arrWordsDiv[indexWord];
    arrWords.splice(indexWord, 1);
    arrWordsDiv.splice(indexWord, 1);
    wordDivIndex.parentNode.removeChild(wordDivIndex);
    playSound(pointSound, 0, notPointSound);
  } else {
    playSound(notPointSound, 0, pointSound);
  }
}

// FALLING WORD LOGIC + GAMEOVER
function updateWordPosition() {
  setInterval(() => {
    if (!gameOver) {
      let wordText = document.getElementsByClassName('word');
      for (let i = 0; i < arrWords.length; i++) {
        if (parseInt(topVal) + 15 > gameHeight) {
          gameOver = true;
          gameContentID.innerHTML = modalGameOver();
          playSound(gameoverSound, 8, startGameSound);
          gameoverSound.style.zIndex = 1;
          inputElementID.setAttribute('disabled', true);
        } else {
          topVal = wordText[i].style.top;
          topVal.replace('px', '');
          wordText[i].style.top = (parseInt(topVal) + 1).toString() + 'px';
        }
      }
    }
  }, 20);
}

// UPDATE SCORE
function updateScore() {
  score += 10;
  scoreElementID.innerHTML = `<p>Score ${score}</p>`;
}

// HELPERS
// PLAY SOUND
function playSound(sound, time, stopSound) {
  let playPromise = sound.play();

  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        stopSound.pause();
        sound.pause();
        stopSound.currentTime = 0;
      })
      .then(() => {
        sound.currentTime = time;
      })
      .then(() => {
        sound.play();
      });
  }
}

// SHOWS CURRENT PLAYING LEVEL
function showLevel() {
  if (LEVEL === '3000') {
    levelElementID.innerHTML = `<p>Level: EASY</p>`;
  } else if (LEVEL === '2000') {
    levelElementID.innerHTML = `<p>Level: MEDIUM</p>`;
  } else {
    levelElementID.innerHTML = `<p>Level: HARD</p>`;
  }
}

// GAMEOVER MODAL
function modalGameOver() {
  return `
    <div class="modal-gameover col-8">
      <h1> Game Over </h2>
      <h2> Score: ${score} </h2>
      <button id="Restart" class="my-2 btn-modal">
        <a href="game.html?lvl=${currentLevel}">
          <h6>Restart</h6>
        </a>
      </button>
      <button id="Menu" class="my-2 btn-modal">
        <a href="index.html">
          <h6>Back to menu</h6>
        </a>
      </button>
    </div>
  `;
}

init();
