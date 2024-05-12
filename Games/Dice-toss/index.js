var randomnum1=Math.floor(Math.random()*6+1);

var randomnum2=Math.floor(Math.random()*6+1);

// For first dice(left)
if(randomnum1==1){
    document.getElementById("img1").setAttribute('src','images/dice1.png');
}
else if(randomnum1==2){
    document.getElementById("img1").setAttribute('src','images/dice2.png');
}
else if(randomnum1==3){
    document.getElementById("img1").setAttribute('src','images/dice3.png');
}
else if(randomnum1==4){
    document.getElementById("img1").setAttribute('src','images/dice4.png');
}
else if(randomnum1==5){
    document.getElementById("img1").setAttribute('src','images/dice5.png');
}
else if(randomnum1==6){
    document.getElementById("img1").setAttribute('src','images/dice6.png');
}



// For second dice (right)
if(randomnum2==1){
    document.getElementById("img2").setAttribute('src','images/dice1.png');
}
else if(randomnum2==2){
    document.getElementById("img2").setAttribute('src','images/dice2.png');
}
else if(randomnum2==3){
    document.getElementById("img2").setAttribute('src','images/dice3.png');
}
else if(randomnum2==4){
    document.getElementById("img2").setAttribute('src','images/dice4.png');
}
else if(randomnum2==5){
    document.getElementById("img2").setAttribute('src','images/dice5.png');
}
else if(randomnum2==6){
    document.getElementById("img2").setAttribute('src','images/dice6.png');
}

if(randomnum1>randomnum2){
document.querySelector("h1").innerHTML="Player1 wins!!";
}
else if(randomnum2>randomnum1){
    document.querySelector("h1").innerHTML="Player2 wins!!";
}
else{
    document.querySelector("h1").innerHTML="It's a Draw!.....try again";

}