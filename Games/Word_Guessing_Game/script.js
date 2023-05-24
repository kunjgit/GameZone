var words = ["ENJOY","RIGHT","HELLO","JAYANTH","EBELLA","GREEDY","DATA",];
var currentWordIndex = 0;
var attempts = 0;
var guessedLetters = [];
var wins = 0;
var losses = 0;

function onStart() {
    updateDisplay();
    document.addEventListener("keyup", onGuess);
}

function onGuess(event) {
    var keyPressed = event.key.toUpperCase();
    if (isLetterOnly(keyPressed)) {
        if (guessedLetters.indexOf(keyPressed) === -1) {
            guessedLetters.push(keyPressed);
            attempts++;
            updateDisplay();
            if (isRoundLost()) {
                losses++;
                goToNextWord();
                return;
            } else if (isRoundWon()) {
                wins++;
                goToNextWord();
                return;
            }

        }
    }
}
function getGameboardWord() {
    return (currentWordLetters().map(function (letter) {
        if (guessedLetters.indexOf(letter) === -1) {
            return "&nbsp";
        } else {
            return letter;
        }
    }
    ));
}

function goToNextWord() {
    currentWordIndex++;
    attempts = 0;
    guessedLetters = [];
    updateDisplay();
}

function isRoundLost() {
    return (getGuessesAllowed() - attempts === 0);
}

function isRoundWon() {
    return (getGameboardWord().indexOf("&nbsp") === -1);
}

function isLetterOnly(character) {
    if (character.length !== 1) {
        return false;
    }
    var checker = /^[A-Z]+$/i.test(character);
    return checker;
}


function updateDisplay() {
    document.getElementById("guessed").innerHTML = guessedLetters.reduce(function (list, letter) {
        return (list + letter + " ");
    }, "");
    showGameBoard();
    document.getElementById("wins").innerHTML = wins;
    document.getElementById("losses").innerHTML = losses;
    document.getElementById("guesses_remaining").innerHTML = getGuessesAllowed() - attempts;
}

function showGameBoard() {
    var container = document.getElementById('game_board_container');
    while (container.firstChild) {
        container.removeChild(container.firstChild);
    }
    console.log(getGameboardWord());
    getGameboardWord().forEach(function (letter) {
        var newDiv = document.createElement("div");
        newDiv.setAttribute("class", "game_board_letter");
        newDiv.innerHTML = letter;
        if (letter !== "&nbsp") {
            newDiv.setAttribute("class", "no_border");
        }
        container.appendChild(newDiv);
    });
}

function currentWordLetters() {
    return (words[currentWordIndex].split(""));
}

function getGuessesAllowed() {
    return (10);
}

onStart();
