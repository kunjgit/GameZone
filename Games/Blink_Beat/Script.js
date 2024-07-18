var colorOptions = ["red", "blue", "yellow", "green"];
var gamePattern = [];
var userChosenColor = [];
var levelCount = 0;
var started = false;

// Generate the game sequence
function gameSequence() {
    userChosenColor = [];
    levelCount++;
    document.querySelector("#level-title").innerHTML = "Level " + levelCount;

    var randomDigit = Math.floor(Math.random() * 4);
    var newColor = colorOptions[randomDigit];
    gamePattern.push(newColor);

    $("." + newColor).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);
    playSound(newColor);
}

// Handle user click/touch events
function handleUserClick(event) {
    if (event.type === "touchstart") {
        event.preventDefault();
    }

    var colorName = event.target.id;
    userChosenColor.push(colorName);

    playSound(colorName);
    animatePress(colorName);

    checkAnswer(userChosenColor.length - 1);
}

// Play sound for a given color
function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

// Animate the button press
function animatePress(name) {
    $("#" + name).addClass("pressed");
    setTimeout(function() {
        $("#" + name).removeClass("pressed");
    }, 100);
}

// Start the game
function startGame(event) {
    if (event.type === "touchstart") {
        event.preventDefault();
    }

    if (!started) {
        document.querySelector("#level-title").innerHTML = "Level " + (levelCount + 1);
        gameSequence();
        started = true;
    }
}

// Check the user's answer
function checkAnswer(currentLevel) {
    if (gamePattern[currentLevel] === userChosenColor[currentLevel]) {
        if (userChosenColor.length === gamePattern.length) {
            setTimeout(function() {
                gameSequence();
            }, 1000);
        }
    } else {
        document.querySelector("#level-title").innerHTML = "Game Over, Press Any Key or Touch the Screen to Restart";
        document.querySelector("body").classList.add("game-over");
        setTimeout(function() {
            document.querySelector("body").classList.remove("game-over");
        }, 200);
        playSound("wrong");

        // Set up the event listeners to restart the game
        document.addEventListener("keydown", restartGameOnEvent, { once: true });
        document.addEventListener("touchstart", restartGameOnEvent, { once: true });
    }
}

// Restart the game
function restartGameOnEvent(event) {
    if (event.type === "touchstart") {
        event.preventDefault();
    }
    restartTheGame();
}

function restartTheGame() {
    levelCount = 0;
    gamePattern = [];
    started = false;

    // Remove existing event listeners to avoid multiple bindings
    document.removeEventListener("keydown", restartGameOnEvent);
    document.removeEventListener("touchstart", restartGameOnEvent);

    // Add event listeners to restart the game on key press or touch
    document.addEventListener("keydown", startGame, { once: true });
    document.addEventListener("touchstart", startGame, { once: true });
}

// Initial event listeners to start the game
document.addEventListener("keydown", startGame, { once: true });
document.addEventListener("touchstart", handleTouchStart, { once: true });

// Handle touch start event to start the game
function handleTouchStart(event) {
    event.preventDefault();
    startGame(event);
}

// Add event listeners to buttons
document.querySelectorAll(".btn").forEach(button => {
    button.addEventListener("click", handleUserClick);
    button.addEventListener("touchstart", handleUserClick);
});
