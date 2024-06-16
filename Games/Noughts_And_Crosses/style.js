let box=document.querySelectorAll('.box');
let turn =true;
let winMsg=document.querySelector('.message');
let reset=document.querySelector('.reset');
const win=[
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]
box.forEach((b) => {
    b.addEventListener("click",()=>{
        if(turn==true){
            b.innerHTML='O';
            turn=false;
        }else{
            b.innerHTML='X';
            turn=true;
        }
        b.disabled=true;

        checkWin();
    });

});
const checkWin = () => {
    for (let i of win){
        let val1=box[i[0]].innerHTML;
        let val2=box[i[1]].innerHTML;
        let val3=box[i[2]].innerHTML;
        if(val1!="" && val2!="" && val3!=""){
            if(val1==val2 && val2==val3){
                console.log("Player with ",val1,"move wins");
                display(val1);
            }
        }
    }
}
const display = (val1) =>{
    if(val1=='X'){
        winMsg.innerHTML="Player 2 wins!!";
    }else{
        winMsg.innerHTML="Player 1 wins!!";
    }
    disableBoxes();
}
const disableBoxes = () =>{
    for (let b of box){
        b.disabled=true;
    }
}
const enableBoxes = () =>{
    for(let b of box){
        b.disabled=false;
    }
}
reset.addEventListener("click",()=>{
    turn=true;
    for(let b of box){
        b.innerHTML="";
    }
    enableBoxes();
    winMsg.innerHTML="";
})