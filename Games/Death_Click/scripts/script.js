var bg = document.getElementById("body");

var bt1 = document.getElementById("bt1");
var bt2 = document.getElementById("bt2");
var bt3 = document.getElementById("bt3");

var bt1_img = document.getElementById("bt1-img");
var bt2_img = document.getElementById("bt2-img");
var bt3_img = document.getElementById("bt3-img");

var timer_id = document.getElementById("timer");

var points = 0;
var time = 10;

var list_choose = [[1,0,0], [0,1,0], [0,0,1]];
var choose = [0,0,0];



var context = new AudioContext()
var o = context.createOscillator()
o.type = "sine"
o.connect(context.destination)


window.onload = ()=>{
    if(localStorage.getItem("max_score")){
        console.log("local maxs_score exist");
    }else{
        localStorage.setItem("max_score", 0);
    }
}

function click(i){
    if(choose[i] === 1){
        points += 1;
        time += 1;
        audio(161, "sine");

    }else{
        time -= 2;
        audio(87, "triangle");
       
    }

    let pts = document.getElementById("pts");
    pts.innerText = points;
}

bt1.onclick = ()=>{
    click(0);

}

bt2.onclick = ()=>{
    click(1);

}

bt3.onclick = ()=>{
    click(2);

}


function randomList(){
    return Math.floor(Math.random() * 3);
    
}

function changeColor(){
    
    let n = randomList();
    
    if(choose != list_choose[n]){
        choose = list_choose[n];
    }else{
        choose = [0,0,0];
    }

    if(choose[0] === 0){
        bt1.style.backgroundColor = "black";
        bt1_img.src = "../assets/skull.png"
        
    }else if (choose[0] === 1){
        bt1.style.backgroundColor = "white";
        bt1_img.src = "../assets/heart.png"
    }  
    
    if(choose[1] === 0){
        bt2.style.backgroundColor = "black";
        bt2_img.src = "../assets/skull.png"
    }else if (choose[1] === 1){
        bt2.style.backgroundColor = "white";
        bt2_img.src = "../assets/heart.png"
    } 

    if(choose[2] === 0){
        bt3.style.backgroundColor = "black";
        bt3_img.src = "../assets/skull.png"
    }else if (choose[2] === 1){
        bt3.style.backgroundColor = "white";
        bt3_img.src = "../assets/heart.png"
    } 
}

function timer(){

    time -= 1;
    if(time <= 3){
        bg.style.background = "#3b3b3b";
    }
   
    timer_id.innerText = time;

    if (time <= 0){
        gameOver();
    }
}

function gameOver(){
    let max = localStorage.getItem("max_score");
    if(points > max){
        localStorage.setItem("max_score", points);
    }
    document.location.href = "gameover.html";
}

function main(){
    timer();
    changeColor();

}

setInterval(main, 800);

