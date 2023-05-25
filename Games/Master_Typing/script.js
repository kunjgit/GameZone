const keys = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZ"];

const timestamps = [];

//Declear the variables for counting total entry and correct entry
let totalEntry=0;   
let correctEntry=0;   

timestamps.unshift(getTimestamp());

function getRandomNumber(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomKey() {
  return keys[getRandomNumber(0, keys.length-1)]
}

function targetRandomKey() {
  const key = document.getElementById(getRandomKey());
  key.classList.add("selected");
  let start = Date.now()
}

function getTimestamp() {
  return Math.floor(Date.now() / 1000)
}

document.addEventListener("keyup", event => {
  const keyPressed = String.fromCharCode(event.keyCode);
  const keyElement = document.getElementById(keyPressed);
  const highlightedKey = document.querySelector(".selected");

  //counting the total entry
  totalEntry++; 
  keyElement.classList.add("hit")
  keyElement.addEventListener('animationend', () => {
  keyElement.classList.remove("hit")
  })
  
  if (keyPressed === highlightedKey.innerHTML) {

    //counting the correct entry
    correctEntry++;   
    timestamps.unshift(getTimestamp());
    const elapsedTime = timestamps[0] - timestamps[1];
    console.log(`Character per minute ${60/elapsedTime}`)
    console.log(`Press count: ${totalEntry}`);    //for debugging
    console.log(`Press count: ${correctEntry}`);   //for debugging
    highlightedKey.classList.remove("selected");
    targetRandomKey();
  } 
})

targetRandomKey();

// ---------------------For the Timer--------------------------------

var timerElement = document.getElementById("timer");
var intervalId;
var secondsLeft = 60;

function startTimer() {

  
  // Disable the start button
  document.querySelector('button:nth-of-type(1)').disabled = true;

   // Reset the counts entries
   totalEntry = 0;
   correctEntry = 0;
  

  // Update the timer every second
  intervalId = setInterval(function() {
    secondsLeft--;
    if (secondsLeft < 0) {

      //call assessment function for review result
      assessment();  
      clearInterval(intervalId);
      return;
    }
    var minutes = Math.floor(secondsLeft / 60);
    var seconds = secondsLeft % 60;
    timerElement.textContent = padNumber(minutes) + ':' + padNumber(seconds);
  }, 1000);
}

function restartTimer() {
  clearInterval(intervalId);
  secondsLeft = 60;
  timerElement.textContent = '00:00';
  
  // Enable the start button
  document.querySelector('button:nth-of-type(1)').disabled = false;
}

function padNumber(number) {
  return number.toString().padStart(2, '0');
}


// New function for assessment
function assessment() {
  const accuracy = (correctEntry / totalEntry) * 100;
  const acc = accuracy.toFixed(2);

  if (isNaN(acc)) {
    timerElement.innerHTML = "No entries made. Accuracy cannot be calculated.";
  } else if (acc == 100) {
    timerElement.innerHTML = "Great! You achieved 100% Accuracy.";
  } else if (acc >= 90 && acc <= 99) {
    timerElement.innerHTML = `Outstanding! You achieved ${acc}% Accuracy.`;
  } else if (acc >= 80 && acc <= 89) {
    timerElement.innerHTML = `Excellent! You achieved ${acc}% Accuracy.`;
  } else if (acc >= 70 && acc <= 79) {
    timerElement.innerHTML = `Good! You achieved ${acc}% Accuracy.`;
  } else {
    timerElement.innerHTML = "You Need More Practice!";
  }
}