var rows = 5;
var columns = 5;

var currTile;
var otherTile;

var turns = 0;

window.onload = function() {
    //initialize the 5x5 board
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            //<img>
            let tile = document.createElement("img");
            tile.src = "./images/blank.jpg";

            //Drag Functionality
        tile.addEventListener("dragstart",dragStart); //click on image to drag
        tile.addEventListener("dragover",dragOver);  //drag an image
        tile.addEventListener("dragenter",dragEnter); //dragging an image into another one
        tile.addEventListener("dragleave",dragLeave); //dragging an image away from another one
        tile.addEventListener("drop",dragDrop);    //drop an image onto another one
        tile.addEventListener("dragend",dragEnd);   //after you completed dragDrop
           
            document.getElementById("board").append(tile);
        }
    }

    //pieces
    let pieces=[];
    for(let i=1;i <=rows*columns; i++){
        pieces.push(i.toString());
    }

    pieces.reverse();

    for(let i=0;i<pieces.length;i++){
        let j=Math.floor(Math.random() * pieces.length);

        //swap
        let tmp=pieces[i];
        pieces[i]=pieces[j];
        pieces[j]=tmp;
    }

    for(let i=0;i<pieces.length;i++){
        let tile=document.createElement("img");
        tile.src="./images/" + pieces[i]+".jpg";


        //Drag Functionality
        tile.addEventListener("dragstart",dragStart); //click on image to drag
        tile.addEventListener("dragover",dragOver);  //drag an image
        tile.addEventListener("dragenter",dragEnter); //dragging an image into another one
        tile.addEventListener("dragleave",dragLeave); //dragging an image away from another one
        tile.addEventListener("drop",dragDrop);    //drop an image onto another one
        tile.addEventListener("dragend",dragEnd);   //after you completed dragDrop

        document.getElementById("pieces").append(tile);
    }
}

//Drag TILES

function dragStart(){
    currTile=this;
}

function dragOver(e){
    e.preventDefault();
}


function dragEnter(e){
    e.preventDefault();
}

function dragLeave(){

}

function dragDrop(){
    otherTile=this;
}

function dragEnd(){
    if(currTile.src.includes("blank")){
        return;
    }
    let currImg=currTile.src;
    let otherImg=otherTile.src;
    currTile.src=otherImg;
    otherTile.src=currImg;

    turns+=1;
    document.getElementById("turns").innerText=turns;

}