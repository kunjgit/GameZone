let inputDir={x:0,y:0};
let speed=5;
let lastPaintTime=0;
// let board =document.querySelectorAll("#board");
let snakeArr=[
    {x:15,y:17}
]
let food={x:5,y:6};
let score=0;
const scorebox=document.querySelector("#scorebox");
// const message=document.querySelector("#message");

function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000 <1/speed){
        return;
    }
    lastPaintTime=ctime;
      gameEngine();
   }
   function isCollide(snakeArr){
   for(let i=1;i<snakeArr.length;i++){
    if(snakeArr[i].x==snakeArr[0].x && snakeArr[i].y==snakeArr[0].y){
        return true;
    }
   }
   if(snakeArr[0].x>=18||snakeArr[0].x<=0||snakeArr[0].y>=18||snakeArr[0].y<=0){
    return true;
   }
   }
 function gameEngine(){
    if(isCollide(snakeArr)){
        inputDir ={x:0,y:0}
        alert("Game Over,Press Any Key to play again!");
    //    document.getElementById("message").innerText="Game Over,Press Any Key to play again!"
        snakeArr=[{x:12,y:15}];
        score=0;
    }


   if(snakeArr[0].y===food.y && snakeArr[0].x===food.x){
    score++;
    scorebox.innerText="Score:" +  score;
    snakeArr.unshift({x:snakeArr[0].x+inputDir.x , y:snakeArr[0].y+inputDir.y})
    let a=2;
    let b=16;
    food={x: Math.round(a+(b-a)*Math.random()),y: Math.round(a+(b-a)*Math.random())};
}

for(let i=snakeArr.length-2;i>=0;i--){

    snakeArr[i+1]= {...snakeArr[i]};
}
snakeArr[0].x = snakeArr[0].x+ inputDir.x;
snakeArr[0].y = snakeArr[0].y+inputDir.y;

 board.innerHTML="";

  snakeArr.forEach((e,index)=>{
    snakeElement=document.createElement('div');
    snakeElement.style.gridRowStart=e.y;
    snakeElement.style.gridColumnStart=e.x;

    if(index==0){
        snakeElement.classList.add('head');
    }else{
       snakeElement.classList.add('snake');
    }
    board.appendChild(snakeElement);

});

  const  foodElement=document.createElement("div");
    foodElement.style.gridRowStart=food.y;
    foodElement.style.gridColumnStart=food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);
 }
window.requestAnimationFrame(main);
window.addEventListener("keydown",e=>{
    inputDir={x:0,y:1}
    switch(e.key){
       case "ArrowUp":
            console.log("ArrowUp");
            inputDir.x=0;
            inputDir.y=-1 ;
            break;
        case "ArrowDown":
            console.log("ArrowDown");
            inputDir.x=0;
            inputDir.y= 1;
            break;
        case "ArrowLeft":
            console.log("ArrowLeft");
            inputDir.x=-1 ;
            inputDir.y= 0;
            break;
        case "ArrowRight":
            console.log("ArrowRight");
            inputDir.x=1 ;
            inputDir.y= 0;
            break;
        defalt:
        break;
    }
})
