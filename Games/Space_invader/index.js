import EnemyController from "./EnemyController.js";
import Player from "./player.js";
import bulletControl from "./bullet.js";


const bg = document.getElementById("bg");
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const play1 = document.getElementById("play1");
const play2 = document.getElementById("play2");
const shipInc = document.getElementById("ShipInc");
const shipDec = document.getElementById("ShipDec");
const enemyInc = document.getElementById("EnemyInc");
const enemyDec = document.getElementById("EnemyDec");
const yourTime = document.getElementById("yourtime");
const restart = document.getElementById("restart");
const travel = document.getElementById("travel");
const bgsound = new Audio("sounds/Hopes and Dreams (8 Bit Remix Cover Version) [Tribute to Undertale] - 8 Bit Universe.wav");
const easter = new Audio("sounds/eastermusic.wav");

canvas.width = 600;
canvas.height = 600;

const background = new Image();
background.src = "images/space.webp";

const playerBullet = new bulletControl(canvas, 10,"red",true);
const enemyBullet = new bulletControl(canvas,4,"white",false);
const enemyController = new EnemyController(canvas,enemyBullet,playerBullet);
const player = new Player(canvas, 3,playerBullet);

let isGameOver = false;
let didWin = false;

function game() {
  checkGameOver();
  ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
  displayGameOver();
  if(!isGameOver) {
  enemyController.draw(ctx);
  player.draw(ctx);
  playerBullet.draw(ctx);
  enemyBullet.draw(ctx);
  }
}

play1.onclick = function toggle1(){
    
   
    player.image = new Image();
    player.image.src = "images/player2.webp";
    play1.style.backgroundColor =" rgb(78, 4, 251)"
    play1.style.color = "white"
    play2.style.backgroundColor ="#111"
    play2.style.color = "#818181"
}

play2.onclick = function toggle2(){
  player.image = new Image();
    player.image.src = "images/player1.webp";
    play2.style.backgroundColor =" rgb(78, 4, 251)"
    play2.style.color = "white"
    play1.style.backgroundColor ="#111"
    play1.style.color = "#818181"
}

shipInc.onclick =  function Sinc(){
   if(player.velocity<=5)
   {
   
    player.velocity+=1;
    
   }
}

shipDec.onclick =  function Sdec(){
  if(player.velocity>=3)
  {
   player.velocity-=1;
  }
}

enemyInc.onclick =  function Einc(){
  if(enemyController.defaultXVelocity<=3)
  {
  
    enemyController.defaultXVelocity+=1;
   
  }
}
enemyDec.onclick =  function Edec(){
 if(enemyController.defaultXVelocity>=1)
 {
  enemyController.defaultXVelocity-=1;
 }
}

var toggle = true;
travel.onclick = function Travel(){
  if(toggle)
  {
    bg.style.backgroundImage ="url('images/bg-min.gif')";
  bg.style.backgroundRepeat = "no-repeat";
  bg.style.backgroundSize =" 100% 100vh";
  travel.innerText ="Wanna Return ?";
  toggle = false;
}
else{
  bg.style.backgroundImage ="";
  bg.style.backgroundRepeat = "";
  bg.style.backgroundSize ="";
  bg.style.background ="linear-gradient(0deg,rgb(48, 149, 200) ,rgb(78, 4, 251) ,rgb(90, 7, 123))";
  travel.innerText ="Wanna Travel ?";
  toggle = true;
}
}


function displayGameOver() {
  if (isGameOver) {
    if (seconds == 20 && didWin) {
      let text = "PEW PERSON !" ;
      let textOffset = 7 ;

      ctx.fillStyle = "white";
      ctx.font = "100px 'VT323', monospace";
      ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
    else {
      let text = didWin ? "You Win" : "Game Over";
      let textOffset = didWin ? 3.5 : 5;

      ctx.fillStyle = "white";
      ctx.font = "100px 'VT323', monospace";
      ctx.fillText(text, canvas.width / textOffset, canvas.height / 2);
    }
  }
}

function checkGameOver()
{
  if(isGameOver){
    return 
  }

  if(enemyBullet.collideWith(player)){
    isGameOver =true;
  }

  if(enemyController.collideWith(player))
  {
    isGameOver =true;
  }

  if(enemyController.enemyRows.length === 0){
    didWin = true;
    isGameOver = true;
  }
}

var dropdown = document.getElementsByClassName("dropdown-btn");
var i;

for (i = 0; i < dropdown.length; i++) {
  dropdown[i].addEventListener("click", function() {
  this.classList.toggle("active");
  var dropdownContent = this.nextElementSibling;
  if (dropdownContent.style.display === "block") {
  dropdownContent.style.display = "none";
  } else {
  dropdownContent.style.display = "block";
  }
  });
}

var seconds = 0;

function incrementSeconds() {
    
    checkGameOver();
    if(!isGameOver)
    {
      seconds += 1;
      yourTime.innerText = `Your Time :${seconds} s`;
      
    }
    if(isGameOver) {
      clearInterval(incrementSeconds);
      bgsound.pause()
    restart.onclick = function Restart(){
      isGameOver= false;
      didWin = false;
      seconds += 4;
      bgsound.play()
      }
      if (isGameOver && seconds == 20 && didWin)
      {
        bgsound.pause();
        easter.play();
      }
  }
}


document.addEventListener('keypress',function(e){
  if(e.key === 'Enter')
  {
    setInterval(incrementSeconds, 1000);
    setInterval(game, 1000 / 60);
    bgsound.play();
  }
})


 

