var msg1 = document.getElementById("message1")
var msg2 = document.getElementById("message2")
var msg3 = document.getElementById("message3")

// Generate Random Number
var answer = Math.floor(Math.random() * 100) + 1;

// Counting the number of guesses made for correct Guess
var no_of_guesses = 0;
var guesses_num = [];

function play() {
    var user_guess = document.getElementById("guess").value;

    if (user_guess < 1 || user_guess > 100) {
        alert("Please Enter  a number Between 1 to 100");
    }

    else {
        guesses_num.push(user_guess);
        no_of_guesses += 1;

        // Check if the user guessed the correct number
        if (user_guess < answer) {
            msg1.textContent = "Oops wrong number :( Your guess is too low"
            msg2.textContent = "No. Of Guesses : " +
                no_of_guesses;
            msg3.textContent = "Guessed numbers are: " +
                guesses_num;
        }
        else if (user_guess > answer) {
            msg1.textContent = "Oops wrong number :( Your guess is too high"
            msg2.textContent = "No. Of Guesses : " +
                no_of_guesses;
            msg3.textContent = "Guessed numbers are: " +
                guesses_num;
        }
        else if (user_guess == answer) {
            msg1.textContent = "Yayy! You guessed it right"
            msg2.textContent = "The number was " + answer
            msg3.textContent = " You guessd it in  " + no_of_guesses + " guesses";
        }
    }
}