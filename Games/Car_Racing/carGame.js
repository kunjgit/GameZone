const score = document.querySelector(".score");
const startScreen = document.querySelector(".popUp");
const gameArea = document.querySelector(".gameArea");

document.addEventListener('keydown',keyDown);
document.addEventListener('keyup',keyUp);
startScreen.addEventListener('click',play);

let keys = {    ArrowUp:false,
                ArrowDown:false,
                ArrowLeft:false,
                ArrowRight:false,
                w:false,
                a:false,
                s:false,
                d:false
             }
let player = { speed:5, score:0};

function keyDown(e)
{
    e.preventDefault();
    keys[e.key] = true;
}

function keyUp(e)
{
    e.preventDefault();
    keys[e.key] = false;
}

function isCollide(a,b)
{
    aRect = a.getBoundingClientRect();
    bRect = b.getBoundingClientRect();

    return !((aRect.bottom<bRect.top) || (aRect.top > bRect.bottom) || (aRect.right<bRect.left) || (aRect.left>bRect.right));
}

function moveLine()
{
    const line = document.querySelectorAll(".lines");
    line.forEach((items)=>{
       

        if(items.y >750)
        {
            items.y -= 750;
        }

        items.y += player.speed;
        items.style.top = items.y + "px";
    })
}
function endGame()
{
    player.start = false;
    startScreen.classList.remove('hide');
    startScreen.innerHTML = `Game Over <br> Your final score is ${player.score+1} <br> Press here to restart the Game`;
}
function moveEnemy(car)
{
    const enemy= document.querySelectorAll(".enemy");
    enemy.forEach((items)=>{
        if(isCollide(car,items))
        {
            console.log("boom hit");
            endGame();
        }
        if(items.y >750)
        {
            items.y = -250;
            items.style.left = Math.floor(Math.random()*350)+"px";
        }

        items.y += player.speed;
        items.style.top = items.y + "px";
    })
}

function gamePlay()
{   
    let car = document.querySelector(".car");
    let road = gameArea.getBoundingClientRect();

    if(player.start){

           moveLine();
           moveEnemy(car);

      
     
    
 
    if((keys.ArrowUp || keys.w) && player.y > (road.top + 100)) {player.y -= player.speed;}
    if((keys.ArrowDown || keys.s) && player.y < (road.bottom - 70)) {player.y += player.speed;}
    if((keys.ArrowLeft || keys.a) && player.x > 0) {player.x -= player.speed;}
    if((keys.ArrowRight || keys.d) && player.x < (road.width - 50)) {player.x += player.speed;}
 
    car.style.top = player.y + "px";
 
    car.style.left = player.x + "px";
    window.requestAnimationFrame(gamePlay);
    player.score++;
    score.innerText = "Score: " + player.score;
    }
}
function play()
{
    // gameArea.classList.remove('hide');
    startScreen.classList.add('hide');
    score.classList.remove('hide');
    gameArea.innerHTML = "";

    player.start = true;
    player.score = 0;
    window.requestAnimationFrame(gamePlay);

    for(i=0;i<5;i++)
    {
    let roadLine = document.createElement('div');
    roadLine.setAttribute('class','lines');
    roadLine.y = (i*150);
    roadLine.style.top = roadLine.y + "px";
    gameArea.appendChild(roadLine);

    }

    let car = document.createElement('div');
    car.setAttribute('class','car');
    gameArea.append(car);
    player.x = car.offsetLeft;
    player.y = car.offsetTop;

    for(i=0;i<3;i++)
    {
    let enemyCar = document.createElement('div');
    enemyCar.setAttribute('class','enemy');
    enemyCar.y = ((i+1)*350)*-1;
    enemyCar.style.top = enemyCar.y + "px";
    enemyCar.style.left = Math.floor(Math.random()*350)+"px";
    gameArea.appendChild(enemyCar);

    }
  
}