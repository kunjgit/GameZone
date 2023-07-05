var html = document.getElementById("html");
var reshoot = document.getElementById("reshoot");
var ball = document.getElementById("ball");
var root = document.documentElement;
var cupsOut = [];

function shootY(){
    let top = window.getComputedStyle(ball).getPropertyValue("top");
    ball.classList.remove("shootY");
    ball.classList.add("shootX");
    ball.style.top = top;
    let onclick = "shootX('".concat(top.toString(), "')");
    html.setAttribute("onclick", onclick);    
}

function shootX(valueY){
    html.setAttribute("onclick","");
    let top = valueY;
    let topInt = parseInt(valueY);
    let left = window.getComputedStyle(ball).getPropertyValue("left");
    let leftInt = parseInt(left);
    let newtop = topInt-325;
    root.style.setProperty('--top', (topInt)+ "px");
    root.style.setProperty('--top325', (newtop)+ "px");
    ball.classList.remove("shootX");
    ball.classList.add("Shoot");
    ball.style.top = newtop.toString().concat("px");
    ball.style.left = left;
    if(-20<topInt && topInt<20 && -125<leftInt && leftInt<-60){
        removeCup("1");
    }
    if(-20<topInt && topInt<20 && -40<leftInt && leftInt<40){
        removeCup("2");
    }
    if(-20<topInt && topInt<20 && 60<leftInt && leftInt<125){
        removeCup("3");
    }
    if(60<topInt && topInt<100 && -90<leftInt && leftInt<-25){
        removeCup("4");
    }
    if(60<topInt && topInt<100 && 15<leftInt && leftInt<80){
        removeCup("5");
    }
    if(140<topInt && topInt<180 && -45<leftInt && leftInt<45){
        removeCup("6");
    }
    setTimeout(function(){
        if(cupsOut.length == 6){
            let time = timer();
            alert("Winner!");
            let p = document.createElement("p");
            p.innerHTML = time + " seconds";
            p.setAttribute("id","time");
            document.body.appendChild(p);
            let restartBtn = document.createElement("BUTTON");
            restartBtn.innerHTML = "Restart";
            restartBtn.setAttribute("onclick","location.reload()");
            restartBtn.setAttribute("id","restart");
            document.body.appendChild(restartBtn);
        }else{
            let reshootBtn = document.createElement("BUTTON");
            reshootBtn.innerHTML = "Reshoot";
            reshootBtn.setAttribute("onclick","reshot()");
            reshootBtn.setAttribute("id","reshoot");
            document.body.appendChild(reshootBtn);
        }
    },1000);
}

function removeCup(cup){
    let element = "cup".concat(cup);
    let alreadyExists = cupsOut.includes(cup);
    if(alreadyExists==false){  
        cupsOut.push(cup);
    }
    setTimeout(function(){
 document.getElementById(element).classList.add("fadeAway");
    },1000);
}

function reshot(){
    document.getElementById("reshoot").remove();
    ball.classList.remove("Shoot");
    ball.classList.add("shootY");
    ball.style.top = "0px";
    ball.style.left = "0px";
    setTimeout(function(){
        html.setAttribute("onclick", "shootY()"); 
    },1000);
}

var startDate = new Date();
var startTime = startDate.getTime();
function timer(){
    var dateNow = new Date ();
    var timeNow = dateNow.getTime();
    var timeDiff = timeNow - startTime;
    var secondsElapsed = Math.floor(timeDiff/1000);
    return (secondsElapsed); 
}