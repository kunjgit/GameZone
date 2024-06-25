var guessInput = document.getElementById("guess");
var guessBtn = document.getElementById("my_btn");
const resetBtn = document.querySelector('.reset-btn');
console.log(guessInput);

var msg1 = document.getElementById("message1");
var msg2 = document.getElementById("message2");
var msg3 = document.getElementById("message3");

var wrong=new Audio("./assets/audio/error.mp3")
var correct=new Audio("./assets/audio/correct.mp3")
var end=new Audio("./assets/audio/end.mp3")

var answer = Math.floor(Math.random() * 100) + 1;
var no_of_guesses = 0;
var guesses_num = [];

var lives=10;

resetBtn.addEventListener('click', reset);
// guessBtn.addEventListener('click', play); this line cause repetition of play() function on click guess button
guessInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    play();
  }
});

function play() {
  var user_guess = guessInput.value;
  if (user_guess < 1 || user_guess > 100) {
    wrong.play()
    alert("Please enter a number between 1 and 100");

  } else {
    guesses_num.push(user_guess);
    no_of_guesses += 1;

    if (lives===1){
      end.play();
      msg1.textContent = "Game Over !!!";
      msg2.textContent = "The number was: " + answer;
      msg3.textContent = "Guessed numbers are: " + guesses_num;
      document.querySelector("#lives").innerText= "Lives left: 0";
    }

    if (lives!==1){

    if (user_guess < answer) {
      wrong.play();
      lives-=1;
      msg1.textContent = "Oops, wrong number! Your guess is too low.";
      msg2.textContent = "No. Of Guesses: " + no_of_guesses;
      msg3.textContent = "Guessed numbers are: " + guesses_num;
      document.querySelector("#lives").innerText= "Lives left: "+lives;

    } else if (user_guess > answer) {
      wrong.play();
      lives-=1;
      msg1.textContent = "Oops, wrong number! Your guess is too high.";
      msg2.textContent = "No. Of Guesses: " + no_of_guesses;
      msg3.textContent = "Guessed numbers are: " + guesses_num;
      document.querySelector("#lives").innerText= "Lives left: "+lives;

    } else if (user_guess == answer) {
      correct.play();
      msg1.textContent = "Yayy 🤩🤗! You guessed it right!";
      msg2.textContent = "The number was " + answer;
      msg3.textContent = "You guessed it in " + no_of_guesses + " guesses.";
    }
  }
}
}

function reset () {
  msg1.textContent = 'No. of Guesss : 0';
  msg2.textContent = 'Guessed number are : none';
  msg3.textContent = '';
  
  answer = Math.floor(Math.random() * 100) + 1;
  no_of_guesses = 0;
  guesses_num = [];

  guessInput.value = '';

  lives=10;
}