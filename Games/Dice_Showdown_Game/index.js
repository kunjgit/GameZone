// First Dice Random number:

var n1=Math.floor(Math.random()*6)+1;

var n1_img="dice"+n1+".png";   

var img_src="images/" + n1_img;    

var img1=document.querySelectorAll("img")[0];  

img1.setAttribute("src",img_src);

// Second Dice Random number:

var n2=Math.floor(Math.random()*6)+1;

var img2_src="images/dice" + n2 + ".png";

document.querySelectorAll("img")[1].setAttribute("src",img2_src);


if(n1==n2){
    document.querySelector("h1").innerHTML="Tie";
}
else if(n1>n2){
    document.querySelector("h1").innerHTML="&#128681;Player 1 Wins";
}
else{
    document.querySelector("h1").innerHTML="&#128681;Player 2 Wins";
}

document.querySelector("button").addEventListener("click",function(){
    location.reload();
});
