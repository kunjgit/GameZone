// Game configuration variables
var maxLevels = 13;
var playTimePerLevel = 13;
var waitTimePerLevel = 3;
var toHoldKeycode = 13;

// Canvas Object (Cloud image)
var canvasWidth = 132;
var canvasHeight = 300;
var canvasInitHeight = 300;
var canvas = $('cloud');
var context = canvas.getContext('2d');

// Cloid Image
var cloudImage = new Image();
cloudImage.onload = function() {
    context.drawImage(cloudImage, 0, ($("sky").clientHeight / 2) - (cloudHeight / 2));
};
cloudImage.src = "images/cloud.png";
var cloudHeight = 78;

// Cloud height ranks and their points
var votes = [
    {
        "min":0, 
        "max":35,
        "points":0
    },
    {
        "min":36,
        "max":44,
        "points":1
    },
    {
        "min":45,
        "max":55,
        "points":5
    },
    {
        "min":56,
        "max":84,
        "points":1
    },
    {
        "min":85,
        "max":100,
        "points":0
    }
];

// Other runtime variables
var cloud;              // cloud object variable
var timerId;            // Used by intervals
var playLevel = false;  // Flag for playing and break time

// Cloud Object Constructor
function Cloud(level) {
    this.image = cloudImage;
    this.x = 0;
    this.y = ($("sky").clientHeight / 2) - (cloudHeight / 2);
    this.hold = false;  // Events flag
    this.level = level; // Current game level
}

// Start Javascript shortcut functions
function $(idElement) {
    return document.getElementById(idElement);
}

function getHTML(idElement) {
    return $(idElement).innerHTML;
}

function setHTML(idElement, content) {
    $(idElement).innerHTML = content;
}

function display(idElement, type) {
    $(idElement).style.display = type;
}

function hide(idElement) {
    display(idElement, "none");
}
// End Javascript shortcut functions
// Start Game shortcut functions
// Keypress or touch events
function keyEventHandler(event, touchMode, isHolding) {
    var code;
    if (!event) event = window.event;
    if (event.keyCode) code = event.keyCode;
    else if (event.which) code = event.which;
    // If the key is the correct or it is tapping in a tablet or smartphone
    if (code == toHoldKeycode || touchMode) 
    {
        // Let's flag to rise the cloud
        cloud.hold = isHolding;
    }
}

// Get the top limit for the cloud
function getMaxY(level) {
    return -1;
}
// Get the bottom limit for the cloud
function getMinY(level) {
    return $("sky").clientHeight - cloudHeight;
}

// Return the new calculated height for the bottom limit (decreasing)
function getSkyLevelHeight(level) {
    return canvasHeight = canvasHeight - (level / 250);
}

// Establish the calculated height above
function setSkyHeight(px) {
    $("sky").style.height = px + "px";
}

// Random generator. Used by the vibration of the cloud on rising
function randomFromInterval(from,to) {
    return Math.floor(Math.random()*(to-from+1)+from);
}

// Sum the new points and update the total
function addPoints(newPoints) {
    setHTML("points", parseInt(getHTML("points")) + newPoints);
}

// Print the points gained
function showPoints(value) {
    if (getHTML("points-report") == '')
    {
        display("points-report", "inline");
        setHTML("points-report", value);
        setTimeout("setHTML('points-report', '')", 600);
        setTimeout("hide('points-report')", 600);
    }
}
// End Game shortcut functions

// The Game starts!
function initialize() {   
    hide("levels");
    setHTML("points", 0);
    display("points", "inline");
    display("points-label", "inline");
    canvasHeight = canvasInitHeight;
    setSkyHeight(canvasInitHeight);
    startLevel(1);
}

function startLevel(level) {
    // Turn on the play flag
    playLevel = true;
    // Respawn the object
    cloud = new Cloud(level);
    // Show the new level
    setHTML("level-number", level);
    // Create the game interval
    var counter = playTimePerLevel;
    timerId = setInterval(function() {
        counter--;
        // If countdown play ends, the level ends too!
        if (counter < 1) {
            clearInterval(timerId);
            endLevel();
        } else {
            // Gameplay information
            setHTML("level-timer", "Hold on during " + counter.toString() + " seconds!");
        }
    }, 1000);
    // Render
    updateGame();
}

function endLevel() {
    // Turn off the game flag
    playLevel = false;
    // The level finish
    setHTML("level-timer", "Well done!");
    // If there is no more levels, you win
    if (cloud.level == maxLevels)
    {
        // Final
        setHTML("level-timer", "Congratulations! You win this time");
    }
    else
    {
        // Is there more levels? OK, let's go on'
        var nextLevel = cloud.level + 1;
        // Create the wait for next level interval
        var counter = waitTimePerLevel;
        timerId = setInterval(function() {
            counter--;
            // If countdown wait ends, the next level starts!
            if (counter < 1) {
                clearInterval(timerId);
                startLevel(nextLevel);
            } else {
                // If not, take a short break
                setHTML("level-timer", "Get ready! Level " + nextLevel + " starts in " + counter.toString() + " seconds.");
                // Restart cloud position for next level (center the cloud)
                cloud = new Cloud(nextLevel);
                // and refresh it
                render();
            }
        }, 1000); 
    }
}

// Game engine
function updateGame() {
    // Handle the user controls
    processUserInput();
    // Simply to refresh the objetcs
    render();
    // Each 24 ms, game runs 
    if (playLevel)
        setTimeout(updateGame, 24);
}

// User control handler
function processUserInput() {
    // If the cloud touch the top or bottom limit, game over
    if (cloud.y < getMaxY(cloud.level) || cloud.y > getMinY(cloud.level))
    {
        gameOver();
    }
    else
    {
        // Else update the cloud position
        // Did the user press the key or tap the sky?
        if (cloud.hold)
        {
            // Yes, rise the cloud
            cloud.y = cloud.y - 1 + (cloud.level / 1000);
            // and a bit vibration (horizontal movements)
            cloud.x = randomFromInterval(-3, 3);
        }
        else
        {
            // No, so let fall it
            cloud.y = cloud.y + 3;
            // and no vibration while falls
            cloud.x = 0;
        }
        // And handle the points
        addPoints(getPointsFromAccuraty((cloud.y + (cloudHeight/2))/2, canvasHeight/2));
    }
}

// Calculate the points from the cloud position
function getPointsFromAccuraty(number, target)
{
    // Calculates the percent of accuraty
    var percent = Math.round(number * 100 / target);
    // Search the percent rank in the votes variable (please, check it at start)
    for (rank in votes)
    {
        // Found it!
        if (percent >= votes[rank].min && percent <= votes[rank].max)
        {
            // Get his points
            var points = votes[rank].points;
            // Only if the cloud is in the best rank, show "PERFECT!" label
            if (points == 5)
                showPoints("PERFECT!");
            // Anyway, return the points from his position
            return points;
        }
    }
}

// Update the visualization
function render() {
    // Make shorter the sky
    setSkyHeight(getSkyLevelHeight(cloud.level));
    // Refresh the cloud position (after events)
    context.clearRect(0, 0, canvasWidth, canvasHeight);  
    context.drawImage(cloud.image, cloud.x, cloud.y);
}

// The game ends!
function gameOver() {
    // Turn off the game flag
    playLevel = false;
    // Delete the game interval
    clearInterval(timerId);
    // Display the gameover message
    setHTML("level-timer", "FAIL! Play one more time and try again ;-)");
    display("levels","block");
}