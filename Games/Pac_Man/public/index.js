import { LEVEL, OBJECT_TYPE} from  './setup';
import { randomMovement } from './ghostMoves.js';

//classes
import GameBoard from './GameBoard';
import Pacman from './Pacman';
import Ghost from './Ghost';

//sounds
import soundDot from './sounds/munch.wav';
import soundPill from './sounds/pill.wav';
import soundGameStart from './sounds/game_start.wav';
import soundGameOver from './sounds/death.wav';
import soundGhost from './sounds/eat_ghost.wav';

//DOM Elements
const gameGrid = document.querySelector('#game');
const scoreTable = document.querySelector('#score');
const startButton = document.querySelector('#start-button');

//Game constants
const POWER_PILL_TIME = 10000; //ms
const GLOBAL_SPEED = 80; //ms
const gameBoard = GameBoard.createGameBoard(gameGrid, LEVEL); 

//Initial setup
let score = 0;
let timer = null;
let gameWin = false;
let powerPillActive = false;
let powerPillTimer = null;

//Audio
function playAudio(audio) {
  const soundEffect = new Audio(audio);
  soundEffect.play();
}

function GameOver(pacman, grid) {
  playAudio(soundGameOver);
  document.removeEventListener('keydown', (e) => 
    pacman.handleKeyInput(e, gameBoard.objectExist)
  )

  gameBoard.showGameStatus(gameWin);

  clearInterval(timer);

  startButton.classList.remove('hide');
}

function checkCollision(pacman, ghosts){
  const collidedGhost = ghosts.find( ghost => pacman.pos === ghost.pos);
  
  if(collidedGhost) {
    if (pacman.powerPill) {
      playAudio(soundGhost);
      gameBoard.removeObject(collidedGhost.pos, [
        OBJECT_TYPE.GHOST,
        OBJECT_TYPE.SCARED,
        collidedGhost.name
      ]);
      collidedGhost.pos = collidedGhost.startPos;
      score += 100;  //100 points for eating the ghost
    } else {
      gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PACMAN]);
      gameBoard.rotateDiv(pacman.pos, 0);
      GameOver(pacman, gameGrid);
    }
  }
}

function gameLoop(pacman, ghosts) {
  gameBoard.moveCharacter(pacman);
  checkCollision(pacman, ghosts);

  ghosts.forEach( (ghost) => gameBoard.moveCharacter(ghost));
  checkCollision(pacman, ghosts);

  //check if pacman eats a dot
 if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.DOT)) {
  playAudio(soundDot);
  gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.DOT]);
  gameBoard.dotCount--;
  score += 10;
 }

 //check if pacman eats a powerpill
 if (gameBoard.objectExist(pacman.pos, OBJECT_TYPE.PILL)) {
  playAudio(soundPill);
  gameBoard.removeObject(pacman.pos, [OBJECT_TYPE.PILL]);
  
  pacman.powerPill = true;
  score += 50;

  clearTimeout(powerPillTimer);   //after 10 secs new timer again starts for the powerpill whenever the pacan eats powerpill
  powerPillTimer = setTimeout(
    () => (pacman.powerPill = false),
    POWER_PILL_TIME
  );
 }

 //change ghost scare mode depending on powerpill
 if (pacman.powerPill !== powerPillActive) {
  powerPillActive = pacman.powerPill;
  ghosts.forEach(ghost => (ghost.isScared = pacman.powerPill));
 }

 //check if all dots have been eaten
 if (gameBoard.dotCount === 0) {
  gameWin = true;
  GameOver(pacman, ghosts);
 }

 //show the table
 scoreTable.innerHTML = score;
}

function startGame(){
  playAudio(soundGameStart);
  gameWin = false;
  powerPillActive = false;
  score = 0;

  startButton.classList.add('hide');

  gameBoard.createGrid(LEVEL);

  const pacman = new Pacman(2, 287);
  gameBoard.addObject(287, [OBJECT_TYPE.PACMAN]);
  document.addEventListener('keydown', (e) => 
    pacman.handleKeyInput(e, gameBoard.objectExist)  //or we can use this line as pacman.handleKeyInput(e, gameBoard.objectExist.bind(gameBoard))...if we are using bind then arrow function is not required..but if we are not using arrow function here then we will have to add bind function
  );

  const ghosts = [
    new Ghost(5, 188, randomMovement, OBJECT_TYPE.BLINKY),
    new Ghost(4, 209, randomMovement, OBJECT_TYPE.PINKY),
    new Ghost(3, 230, randomMovement, OBJECT_TYPE.INKY),
    new Ghost(2, 251, randomMovement, OBJECT_TYPE.CLYDE)
  ];

  timer = setInterval(() => gameLoop(pacman, ghosts), GLOBAL_SPEED);
}

//initialize game
startButton.addEventListener('click', startGame);