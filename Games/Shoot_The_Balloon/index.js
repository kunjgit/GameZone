const cursor = document.querySelector(".cursor");
window.addEventListener("mousemove", (e) => {
    cursor.style.top = e.pageY + "px";
    cursor.style.left = e.pageX + "px";
});

const burst = document.querySelector(".burst");
window.addEventListener("click", (e) => {
    burst.style.top = e.pageY + "px";
    burst.style.left = e.pageX + "px";

    if(e.target === balloon) score++;
    
    startBtn.innerText = "SCORE: " + score;
});

const balloon = document.createElement("img");
balloon.setAttribute("class","balloon");
balloon.setAttribute("src","balloon1.png");

const container = document.querySelector(".container");

const contHeight = container.offsetHeight;
const contWidth = container.offsetWidth;

setInterval(() => {
    const randTop = Math.random() * (contHeight -60);
    const randLeft = Math.random() * (contWidth -60);

    balloon.style.position = "absolute";
    balloon.style.top = randTop + "px";
    balloon.style.left = randLeft + "px";
},1000);

let score = 0;
const startBtn = document.querySelector(".startBtn");

startBtn.addEventListener("click", () => {
    container.appendChild(balloon);

    startBtn.innerText = "SCORE: " + score;
});
var timer;
startBtn.addEventListener("click", () => {
    var sec = 0;
    timer = setInterval(()=>{
        ele.innerHTML = '00:'+sec;
        sec++;
    }, 1000)
    
});
if(sec = 60){
    alert("Game Over! \n Score " + score);
}


var ele = document.getElementById('timer');