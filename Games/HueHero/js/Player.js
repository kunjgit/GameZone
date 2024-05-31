function Player(Character) {
    this.character = Character;
    this.score = document.getElementById("player-score");
    this.movement = {
            keys: [38, 39, 40, 37], // == Arrow keys
            handlers: []
        };
}

Player.prototype.play = function() {
    var Player = this;
    Player.enableMovement();
};

Player.prototype.enableMovement = function() {
    var Player = this;
    var longPress = true;
    var movement = Player.movement;

    // == Add event listener for arrow key down.
    movement.handlers.push(
        EventHandler.addListener("keydown", function(e) {
            // == If an arrowkey was pressed.
            if (movement.keys.indexOf(e.keyCode) > -1) { 
                // == Prevent default behavior.
                e.preventDefault();

                // == Don't move player if holding down arrow key.
                if (! longPress) {
                    return e.keyCode;
                }

                // == Disable long press.
                longPress = false;

                // == Move the player.
                Player.character.move.direction(e.keyCode);
                
                // == Paint the square.
                Player.character.painter.paint();

                // == Update the score.
                Player.updateScore();
            }
        }, window)
    );

    // == Add event listener for arrow key up.
    movement.handlers.push(
        EventHandler.addListener("keyup", function(e) {
            // == If an arrowkey was released.
            if (movement.keys.indexOf(e.keyCode) > -1) { 
                // == Turn long press back on.
                longPress = true;
            }
        }, window)
    );
}

Player.prototype.disableMovement = function () {
    var Player = this;
    var numOfMovementHandlers = Player.movement.handlers.length;

    // == Remove all movement event listeners.
    for(i=0; i < numOfMovementHandlers; i++) {
        EventHandler.removeListener(Player.movement.handlers[i]);
    }
}

Player.prototype.currentScore = function() {
    return document.getElementsByClassName("painted").length;
}

Player.prototype.updateScore = function() {
    var Player = this;
    Player.score.innerHTML = Player.currentScore();
}

Player.prototype.stop = function() {
    var Player = this;
    Player.disableMovement();
}