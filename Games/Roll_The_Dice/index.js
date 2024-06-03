var randomNumber1 =  Math.floor(Math.random() * 6 + 1);
var randomImage = "Dice" + randomNumber1 + ".png";
var randomImageSource1 = "images/" + randomImage;
var image1 = document.querySelectorAll("img")[0];
image1.setAttribute("src", randomImageSource1);

var randomNumber2 =  Math.floor(Math.random() * 6 + 1);
var randomImageSource2 = "images/Dice" + randomNumber2 + ".png";
// var randomImageSource2 = "images/" + randomImage;

document.querySelectorAll("img")[1].setAttribute("src",randomImageSource2);

if(randomNumber1 > randomNumber2){
    document.querySelector("h1").innerHTML = "Player 1 Won!!!";
    // alert("player 1 won");
}
else if(randomNumber2>randomNumber1){
    document.querySelector("h1").innerHTML= "player 2 Won!!!"
}