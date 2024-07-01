//canvas
let canvas;
let boardWidth = 780;
let boardHeight = 720;
let context;

//bird
let birdHeight =  24;
let birdWidth = 34;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImage;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;
let topPipeImg;
let bottomPipeImg;

//score
let score = 0;
let HighScore = 0;

//game Over
let gameOver = false;

//physics
let velocityX = -2;//pipes moving left Speed
let velocityY = 0;//bird Jump seed
let gravity = 0.4;
window.onload = function(){
    canvas = document.getElementById("canvas");
    canvas.width = boardWidth;
    canvas.height = boardHeight;
    context = canvas.getContext('2d');

    //load image bird
    
    birdImage = new Image();
    birdImage.src = "./assets/flappybird.png";
    birdImage.onload = function(){
        context.drawImage(birdImage,bird.x, bird.y, bird.width, bird.height);
    }

    //load the pipes
    topPipeImg = new Image();
    topPipeImg.src = "./assets/toppipe.png"

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./assets/bottompipe.png";

    requestAnimationFrame(Update);
    setInterval(placePipes,2000);
    document.addEventListener("keydown",moveBird);
    
}
function Update(){
    requestAnimationFrame(Update);
    if(gameOver){
        return;
    }
    context.clearRect(0,0,canvas.width,canvas.height);
    
    //bird 
    velocityY += gravity;
    bird.y = Math.max(bird.y+velocityY,0);
    context.drawImage(birdImage,bird.x, bird.y, bird.width, bird.height);

    if(bird.y > canvas.height){
        gameOver = true
    }

    //pipe
    for(let i=0;i<pipeArray.length;i++){
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img,pipe.x,pipe.y,pipe.width,pipe.height);

        if(!pipe.passed && bird.x > pipe.width+pipe.x){
            score += 0.5;
            pipe.passed = true;
        }

        if(detectCollision(bird,pipe)){
            gameOver = true;
            
        }
        
    }
    //clear
    while(pipeArray.length >0 && pipeArray[0].x < -pipeWidth){
        pipeArray.shift()
    }
    //Score
    context.fillStyle = "white";
    context.font = "45px sans-serif";
    context.fillText(score,5,45);
    context.font = "25px sans-serif";
    context.fillText("HighScore: ",5,85);
    if(score > HighScore){
        context.fillText(score,130,85);
    }else{
        context.fillText(HighScore,130,85);
    }
    

    if(gameOver){
        context.font = "45px sans-serif";
        context.fillText("GAME OVER",20,320);
        context.fillText("Score:",20,360);
        context.fillText(score,155,360);
        context.fillText("High Score:",20,400);
        if(score> HighScore){
            context.fillText(score,255,400);
        }else{
            context.fillText(HighScore,255,400);
        }
        

    }
}
function placePipes(){

    if(gameOver){
        return;
    }
    let randomPipeY = pipeY - pipeHeight/4 - Math.random() *pipeHeight/2;
    let openingSpace = canvas.height/4;
    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false,
    }
    pipeArray.push(topPipe);
    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false,
    }
    
    pipeArray.push(bottomPipe);

}
function moveBird(e){
    if(e.code === "Space" || e.code === "ArrowUp"){
        //jump
        velocityY = -6;

        if(gameOver){
            if(score > HighScore){
                HighScore = score;
            }
            bird.y = birdY;
            pipeArray=[];
            score = 0;
            gameOver = false;
        }
    }
}

function detectCollision(a,b){
    return a.x <b.x + b.width &&
        a.x + a.width > b.x &&
        a.y <b.y + b.height &&
        a.y + a.height > b.y
}