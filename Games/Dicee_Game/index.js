
//first dice
var randomNumber1 = Math.floor(Math.random() * 6) + 1;
var randomImage1 = "dice"+ randomNumber1 + ".png";
var imageSource1 = "images/"+ randomImage1;
// select the attribute and change the image
document.querySelectorAll("img")[0].setAttribute("src",imageSource1);

//second dice
var randomNumber2 = Math.floor(Math.random() * 6) + 1;
var randomImage2 = "dice"+ randomNumber2 + ".png";
var imageSource2 = "images/"+ randomImage2;
//select the image and change the image 
document.querySelectorAll("img")[1].setAttribute("src", imageSource2);

//change the h1 according to the result
//player one win
if(randomNumber1 > randomNumber2){
document.querySelector("h1").innerHTML="&#128681 player 1 wins!";
}
else if(randomNumber1 < randomNumber2){ // player 2 wins
document.querySelector("h1").innerHTML="&#128681 player 2 wins!";
}
else{
  document.querySelector("h1").innerHTML="draw!";
}
