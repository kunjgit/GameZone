var guessInput = document.getElementById("guess");
var guessBtn = document.getElementById("my_btn");
var msg1 = document.getElementById("message1");
var msg2 = document.getElementById("message2");
var msg3 = document.getElementById("message3");

var answer = Math.floor(Math.random() * 100) + 1;
var no_of_guesses = 0;
var guesses_num = [];

guessBtn.addEventListener('click', play);
guessInput.addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
    play();
  }
});

function play() {
  var user_guess = guessInput.value;

  if (user_guess < 1 || user_guess > 100) {
    alert("Please enter a number between 1 and 100");
  } else {
    guesses_num.push(user_guess);
    no_of_guesses += 1;

    if (user_guess < answer) {
      msg1.textContent = "Oops, wrong number! Your guess is too low.";
      msg2.textContent = "No. Of Guesses: " + no_of_guesses;
      msg3.textContent = "Guessed numbers are: " + guesses_num;
    } else if (user_guess > answer) {
      msg1.textContent = "Oops, wrong number! Your guess is too high.";
      msg2.textContent = "No. Of Guesses: " + no_of_guesses;
      msg3.textContent = "Guessed numbers are: " + guesses_num;
    } else if (user_guess == answer) {
      msg1.textContent = "Yayy! You guessed it right!";
      msg2.textContent = "The number was " + answer;
      msg3.textContent = "You guessed it in " + no_of_guesses + " guesses.";
    }
  }
}
