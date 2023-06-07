var score = 0;

function flipCoin() {
    var userGuess = document.getElementById("user-guess").value.toLowerCase();
    var coinSides = ["heads", "tails"];
    var randomSide = coinSides[Math.floor(Math.random() * coinSides.length)];

    var resultElement = document.getElementById("result");

    var coinElement = document.createElement("span");
    coinElement.classList.add("coin");

    var flipAnimation = document.createElement("span");
    flipAnimation.classList.add("flip-animation");
    flipAnimation.innerText = "H";

    coinElement.appendChild(flipAnimation);

    resultElement.innerHTML = "";
    resultElement.appendChild(coinElement);

    if (userGuess === "" || (userGuess !== "heads" && userGuess !== "tails")) {
        resultElement.innerHTML = "<p class='text-danger'>Please enter 'heads' or 'tails'.</p>";
        return;
    }

    var interval = setInterval(function() {
        flipAnimation.innerText = flipAnimation.innerText === "H" ? "T" : "H";
    }, 200);

    setTimeout(function() {
        clearInterval(interval);
        flipAnimation.style.animation = "none";
        coinElement.innerText = randomSide === "heads" ? "H" : "T";

        setTimeout(function() {
            if (userGuess === randomSide) {
                resultElement.innerHTML += "<p class='text-success'>Congratulations! You guessed correctly.</p>";
                score++; // Increase the score if the guess is correct
            } else {
                resultElement.innerHTML += "<p class='text-danger'>Sorry! You guessed incorrectly.</p>";
            }

            // Update the score on the page
            document.getElementById("score").innerText = score;
        }, 1000);
    }, 2000);
}

function resetGame() {
    document.getElementById("user-guess").value = "";
    document.getElementById("result").innerHTML = "";
    score = 0; // Reset the score to 0
    document.getElementById("score").innerText = score; // Update the score on the page
}
