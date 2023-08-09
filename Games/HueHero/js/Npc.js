function Npc(Character) {
    this.character = Character;
    this.vector = new Vector;
    this.arrowKeys = [38, 39, 40, 37];

    this.speed = 160; // == in milliseconds
    this.score = document.getElementById("npc-score");
    this.playing = null;
}

Npc.prototype.play = function() {
    var Npc = this;

    Npc.playing = setInterval(function() {
        Npc.move();
        Npc.character.painter.npcPaint();
        Npc.updateScore();
    }, Npc.speed);
};

Npc.prototype.move = function() {
    var Npc = this;
    var direction = Npc.look(Npc.character.element);

    if (direction === false) {
        Npc.moveRandom();
    }

    else {
        Npc.character.move.direction(direction);    
    }
};

Npc.prototype.look = function(element) {
    var Npc = this;
    var numOfDirections = Npc.arrowKeys.length;
    var arrowKeys = Util.shuffleArray(Npc.arrowKeys);
    var isPaintable;

    for(var i=0; i < numOfDirections; i++) {
        isPaintable = Npc.isPaintable(element, arrowKeys[i]);

        if (isPaintable) {
            return arrowKeys[i];
        }
    }
    
    return false;
};

Npc.prototype.isPaintable = function(currentLocationElement, direction) {
    var Npc = this;
    var currentVector = new Vector(currentLocationElement);
    var newVector = Npc.getVector(currentVector, direction);

    if (newVector) {
        return Npc.character.painter.isPaintable(newVector, Npc);
    }

    return false;
};

Npc.prototype.getVector = function(currentVector, direction) {
    switch(direction) {
        case 38: 
            return currentVector.north();
        case 39: 
            return currentVector.east();
        case 40: 
            return currentVector.south();
        case 37: 
            return currentVector.west();
    }
};

Npc.prototype.moveRandom = function() {
    var randomDirection = null;
    var Npc = this;

    randomDirection = Util.randomItem(Npc.arrowKeys);
    Npc.character.move.direction(randomDirection);
};

Npc.prototype.currentScore = function() {
    return document.getElementsByClassName("npc-painted").length;
};

Npc.prototype.updateScore = function() {
    var Npc = this;
    Npc.score.innerHTML = Npc.currentScore();
};

Npc.prototype.stop = function() {
    var Npc = this;
    clearInterval(Npc.playing);
};