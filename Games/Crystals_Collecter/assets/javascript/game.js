
$(document).ready(function Startgame(){
//global variables


var jewels = [1,2,3,4,5,6,7,8,9,10,11,12]
var wins = 0;
var loses = 0; 
var computerGuess = Math.floor((Math.random()*(101 +1)+19));
//the computer must create a random number between 19 and 120. 

$("#randomNum").text(computerGuess);
$("#wins").html(" " + wins);
$("#loses").html(" " + loses);

//Assign a random number for each crystal between 1 and 12 and COmputer guess from 19 to 120. 


var yellow = jewels[Math.floor(Math.random()*jewels.length)];
var purple = jewels[Math.floor(Math.random()*jewels.length)];
var red = jewels[Math.floor(Math.random()*jewels.length)];
var blue = jewels[Math.floor(Math.random()*jewels.length)];
var totalScore = 0;

console.log (yellow,purple,red, blue)

//function to restart

  
 
//functions for win or lose counters 
function winCounter (){
    alert ("You win!!");
    wins++;
    $("#wins").text(wins);
    
}

function loseCounter (){
    alert ("You lose!");
    loses++;
    $("#loses").html(loses);
   
}

 
//function click for each jewel
//Add the number corresponding to each crystal to the global sum
$("#yellow").on("click", function(){
totalScore = totalScore + yellow;
$("#score").html(totalScore); 
//Once you hit the right number, you win. If you go over it, you lose    
if (totalScore == computerGuess){
        winCounter();
        reset ();
    }
    else if (totalScore > computerGuess){
        loseCounter();
        reset ();
    }
})

$("#purple").on("click", function(){
totalScore = totalScore + purple;
$("#score").html(totalScore); 
if (totalScore == computerGuess){
    winCounter();
    reset ();
}
else if (totalScore > computerGuess){
    loseCounter();
    reset ();
}
})

$("#red").on("click", function(){
totalScore = totalScore + red;
$("#score").html(totalScore); 
if (totalScore == computerGuess){
    winCounter();
    reset ();
}
else if (totalScore > computerGuess){
    loseCounter();
    reset ();
}
})

$("#blue").on("click", function(){
totalScore = totalScore + blue;
$("#score").html(totalScore); 
if (totalScore == computerGuess){
    winCounter();
    reset ();
}
else if (totalScore > computerGuess){
    loseCounter();
    reset ();
}
})


function reset(){
   computerGuess = Math.floor((Math.random()*(101 +1)+19)); 
   $("#randomNum").text(computerGuess);
   totalScore = 0;
   $("#score").html(totalScore); 
yellow = jewels[Math.floor(Math.random()*jewels.length)];
purple = jewels[Math.floor(Math.random()*jewels.length)];
red = jewels[Math.floor(Math.random()*jewels.length)];
blue = jewels[Math.floor(Math.random()*jewels.length)];

}

})


//Once you win or lose the game  starts over again



