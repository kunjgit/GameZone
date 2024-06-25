// Function to generate a random number for a dice
function rollDice() {
  return Math.floor(Math.random() * 6) + 1;
}

// Function to update the image source for a dice
function updateDiceImage(diceNumber, diceValue) {
  var diceImage = "images/dice" + diceValue + ".png";
  document.querySelectorAll("img")[diceNumber - 1].setAttribute("src", diceImage);
}

// Initial roll for both dice
var n1 = rollDice();
var n2 = rollDice();
updateDiceImage(1, n1);
updateDiceImage(2, n2);

// Flag to check if both dice should be refreshed together
var refreshBoth = false;

// Function to update the result based on the values of the two dice
function updateResult(n1, n2) {
  
    if (n1 === n2) {
      document.querySelector("h1").innerHTML = "Tie";
    } else if (n1 > n2) {
      document.querySelector("h1").innerHTML = "&#128681; Player 1 Wins";
    } else {
      document.querySelector("h1").innerHTML = "&#128681; Player 2 Wins";
    }
    refreshBoth = false; // Reset the flag after updating the result
    
  
  // document.querySelector("h1").innerHTML = "&#128681; Play"
}

// Event listener for the first dice refresh button
document.getElementById("refreshDice1").addEventListener("click", function() {
  if (!refreshBoth) {
  n1 = rollDice();
  updateDiceImage(1, n1);
  updateResult(n1, n2);
  }
  
});

// Event listener for the second dice refresh button
document.getElementById("refreshDice2").addEventListener("click", function() {
  if (!refreshBoth) {
  n2 = rollDice();
  updateDiceImage(2, n2);
  updateResult(n1, n2);}
  
});

// Event listener for the refresh both dice button
document.getElementById("refreshBoth").addEventListener("click", function() {
  document.querySelector("h1").innerHTML = "Play";
  n1 = rollDice();
  n2 = rollDice();
  updateDiceImage(1, n1);
  updateDiceImage(2, n2);
  // refreshBoth = true;
  // updateResult(n1, n2);
});
