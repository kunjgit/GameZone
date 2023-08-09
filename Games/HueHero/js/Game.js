function Game(player, npc, timeLimit) {
    var Game = this;

    Game.player = new Player(new Character(player));
    Game.npc = new Npc(new Character(npc));
    Game.space = new Space();
    Game.audio = new Audio();
    Game.cells = document.getElementsByClassName("cell");

    Game.startButton = {
        element: document.getElementById("start-button"),
        keys: [32, 13],
        handlers: []
    };
    
    Game.clock = new Clock("clock", timeLimit, 1000, 0, function(){Game.gameOver()}, "s", 10000, function(){Game.timeAlmostUp()});
    Game.countdown = new Clock("announcer", 2000, 1000, -1000, function(){Game.clearCountdown()}, "", "", "", function(){Game.go()});
    Game.announcer = document.getElementById("announcer");

    Game.space.make();
    Game.enableStartButton();
    Game.audio.title.play();
}

Game.prototype.start = function() {    
    var Game = this;
    var announcer = Game.announcer;
    var infoPanel = Game.clock.element.parentElement.parentElement;
    var audio = Game.audio;
    
    audio.playGame();
    
    if ( Util.doesntHaveClass(infoPanel, "show") ) {
        infoPanel.className += ' ' + "show";
    }

    Game.reset();
    Game.disableButton(Game.startButton);
    
    announcer.className += ' ' + "show";
    announcer.innerHTML = '<span class="clock-time">' + (Game.countdown.timeLimit / Game.countdown.increment)  + '</span>';

    Game.countdown.start();
};

Game.prototype.go = function() {
    var Game = this;
    
    Util.removeClass(Game.clock.element, "clock-stop");
    Game.announcer.innerHTML = '<span class="clock-time">GO!</span>';
    Game.play();
};

Game.prototype.clearCountdown = function () {
    var Game = this;

    Util.removeClass(Game.announcer, "show");
    Util.removeClass(Game.announcer, "clock-stop");
    Game.announcer.innerHTML = "";
}

Game.prototype.play = function() {
    var Game = this;
    
    Game.clock.start();
    Game.player.play();
    Game.npc.play();
};

Game.prototype.timeAlmostUp = function() {
    var audio = Game.audio;

    audio.gamePlay.pause();
    audio.gamePlay.currentTime = 0;
    audio.gamePlayFast.play();
}

Game.prototype.gameOver = function() {
    var Game = this;
    var Player = Game.player;
    var Npc = Game.npc;

    Game.announcer.className += " frame show";

    Player.stop();
    Npc.stop();
    
    Player.updateScore();
    Npc.updateScore();

    var playerScore = Player.currentScore();
    var npcScore = Npc.currentScore();

    var audio = Game.audio;

    audio.gamePlayFast.pause();
    audio.gamePlayFast.currentTime = 0;

    if (playerScore > npcScore) {
        Game.announcer.innerHTML = '<div class="center announce-won">You win! =)</div>';
        Game.winner(Game.player.character);
        Game.mouth("player-mouth", "smile");
        Game.mouth("npc-mouth", "frown");
        audio.youWin.play();
    }

    if (playerScore < npcScore) {
        Game.announcer.innerHTML = '<div class="center announce-lost">You lose! =(</div>';
        Game.mouth("player-mouth", "frown");
        Game.winner(Game.npc.character);
        Game.mouth("npc-mouth", "smile");
        audio.youLose.play();
    }

    if (playerScore === npcScore) {
        Game.announcer.innerHTML = '<div class="center announce-tie">It\'s A Tie!</div>';
        audio.youLose.play();
    }

    Game.enableStartButton();
};

Game.prototype.reset = function() {
    var Game = this;

    Game.resetCharacters();
    Game.resetBoard();
    Game.resetScore();
    Util.removeClass(announcer, "frame");
    Game.clock.timeLeft = Game.clock.timeLimit;
    Game.clock.element.innerHTML = (Game.clock.timeLimit / 1000) + "s";
};

Game.prototype.resetCharacters = function() {
    var Game = this;
    var playerElement = Game.player.character.element;
    var npcElement = Game.npc.character.element;

    Game.winner(false);
    Game.mouth("player-mouth", false);
    Game.mouth("npc-mouth", false);
    Game.cells[0].appendChild(playerElement);
    Game.cells[99].appendChild(npcElement);
};

Game.prototype.resetBoard = function() {
    var Game = this; 
    var numOfCells = Game.cells.length;
    var cells = Game.cells;

    for (var i=0; i < numOfCells; i++) {
        cells[i].className = "cell";
    }

    Game.announcer.innerHTML = "";
};

Game.prototype.resetScore = function() {
    var Game = this;

    Game.player.updateScore();
    Game.npc.updateScore();
};

Game.prototype.winner = function(character) {
    if (character === false) {
        var characters = document.getElementsByClassName("character");
        var numOfCharacters = characters.length;
        for (var i=0; i < numOfCharacters; i++) {
            Util.removeClass(characters[i], "winner");
        }
    } 

    else {
        character.element.className += " winner";
    }
}

Game.prototype.mouth = function(mouth, emotion) {
    var mouths = document.getElementsByClassName(mouth);
    var numberOfMouths = mouths.length;

    if (emotion === false) {
        for (var i=0; i < numberOfMouths; i++) {
            Util.removeClass(mouths[i], "smile");
            Util.removeClass(mouths[i], "frown");
        }
    } 

    else {
        for (var i=0; i < numberOfMouths; i++) {
            mouths[i].className += " " + emotion;
        }
    }
};

Game.prototype.enableStartButton = function(button) {
    Game = this;
    startButton = Game.startButton;
    Util.removeClass(startButton.element, "disabled");

    // == Add click event listener.
    startButton.handlers.push(
        EventHandler.addListener( "click", function() {
            Game.start();
        }, startButton.element)
    );

    // Add keydown event listener.
    startButton.handlers.push(
        EventHandler.addListener("keydown", function(e) {
            if (startButton.keys.indexOf(e.keyCode) > -1) {
                e.preventDefault();
                Game.start();
            }
        }, window)
    );

};

Game.prototype.disableButton = function(button) {
    var startButton = this.startButton;
    var numOfStartButtonHandlers = startButton.handlers.length;
    
    startButton.element.className += " disabled";
    
    // == Remove all startButton event listeners.
    for(i=0; i < numOfStartButtonHandlers; i++) {
        EventHandler.removeListener(startButton.handlers[i]);
    }
};