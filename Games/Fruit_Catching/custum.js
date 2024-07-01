var game = document.querySelector(".game");
var basket = document.querySelector(".basket");
var fruits = document.querySelector(".fruits");
var basketLeft = parseInt(window.getComputedStyle(basket).getPropertyValue("left"));
var basketBottom = parseInt(window.getComputedStyle(basket).getPropertyValue("bottom"));
var score =0;
var fruitarray = ["images/apple.png","images/orange.png","images/mango.png","images/Strawberrie.png","images/Watermelon.png"]

function moveBasketLeft(){
    if(basketLeft>0){
        basketLeft -=20;
        basket.style.left = basketLeft + "px";
    }   
}

function moveBasketRight(){
    if(basketLeft<620){
        basketLeft +=20;
        basket.style.left = basketLeft + "px";    
    }
    
}

function control(e){
    if(e.key=="ArrowLeft" || e.key=="a"){
        moveBasketLeft();
    }
    if(e.key=="ArrowRight" || e.key=="d"){
        moveBasketRight();
    }
}

function generateFruits(){
    var fruitBottom = 470;
    var fruitLeft = Math.floor(Math.random()*620);
    var fruit = document.createElement('img');
    fruit.setAttribute("class","fruit");
    fruit.setAttribute("src",fruitarray[Math.floor(Math.random()*5)]);
    fruits.appendChild(fruit);
    function fallDownFruit(){
        if(fruitBottom < basketBottom + 50 && fruitBottom > basketBottom && fruitLeft > basketLeft - 30 && fruitLeft < basketLeft+80){
            fruits.removeChild(fruit);
            clearInterval(fallInterval);
            score++;
            document.getElementById("pt").innerHTML = score;
        }
        if(fruitBottom < basketBottom){
            alert("Game Over! Your Score is: "+score);
            location.reload();
            clearInterval(fallInterval);
            clearInterval(fruitTimeout);
        }
        fruitBottom -= 4;
        fruit.style.bottom = fruitBottom + "px";
        fruit.style.left = fruitLeft + "px";
    }
    if(score>=0 && score<10){
        var fallInterval = setInterval(fallDownFruit, 20);
    }
    else if(score>=10 && score<20){
        var fallInterval = setInterval(fallDownFruit, 15);
    }
    else if(score>=20 && score<40){
        var fallInterval = setInterval(fallDownFruit, 12);
    }
    else if(score>=40 && score<60){
        var fallInterval = setInterval(fallDownFruit, 10);
    }
    else {
        var fallInterval = setInterval(fallDownFruit, 5);
    }
    var fruitTimeout = setTimeout(generateFruits, 2000);    
}
generateFruits();

document.addEventListener("keydown",control);