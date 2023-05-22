const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width=900;
canvas.height=600;

//global variables
const cellSize = 100;
const cellGap = 3;
const gameGrid = [];

//mouse
const mouse={
    x: undefined,
    y: undefined,
    width: 0.1,
    height: 0.1,
}
let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener('mousemove', function(e){
    mouse.x = e.x - canvasPosition.left;
    mouse.y = e.y - canvasPosition.top;

});
canvas.addEventListener('mouseleave',function(){
    mouse.x = undefined;
    mouse.y = undefined;
})


//game board
const controlBar={
    width: canvas.width,
    height: cellSize,
}
class Cell{
    constructor(x,y){
        this.x = x;
        this.y = y;
        this.width = cellSize;
        this.height = cellSize;
    }
    draw(){
        if (mouse.x && mouse.y && collision(this, mouse)){
        ctx.strokeStyle = 'black';
        ctx.strokeRect(this.x,this.y,this.width,this.height);
        }
        
    }
}
function createGrid(){
    for(let y = cellSize; y<canvas.height; y+=cellSize){
        for(let x=0; x<canvas.width; x+=cellSize){
            gameGrid.push(new Cell(x,y));

        }
    }
}
createGrid();
function handleGameGrid(){
    for(let i=0;i<gameGrid.length;i++){
        gameGrid[i].draw();
    }
}

//projectiles
//defenders
//enemies
//resources
//utilities
function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    ctx.fillStyle = "blue";
    ctx.fillRect(0,0,controlBar.width, controlBar.height);
    handleGameGrid()
    requestAnimationFrame(animate);
}
animate();

function collision(first, second){
    if (  !(first.x > second.x + second.width || 
            first.x + first.width < second.x ||
            first.y > second.y + second.height ||
            first.y + first.height < second.y)
    ){
        return true;
    };

};