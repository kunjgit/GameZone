// Set your global var here
let characterList = [];
let currentCardIndex = 0;
let currentPoints = 0;
let score = 0;
let combo = 0;
let scoreMultiplier;
let currentTutorialStep = 0;
let errorMessageTimeout;
let comboMessageTimeout;
let gameTimer;
let updateTimerInterval;
let isSwiping = false;
let gameMusic;
let isSoundMuted = false;
let isGameStarted = false;

let $gameWrapper = $("gameWrapper");
let $cardList = $("cardList");
let $score = $("score");
let $combo = $("combo");
let $errorMessage = $("errorMessage");
