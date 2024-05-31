function Move(element) {
    this.element = element;
}

Move.prototype.direction = function(keyCode) {
    var Move = this;
    var element = Move.element;

    switch(keyCode) {
        case 38: 
            Move.north(new Vector(element));
            break;
        case 39:
            Move.east(new Vector(element));
            break;
        case 40:
            Move.south(new Vector(element));
            break;
        case 37:
            Move.west(new Vector(element));
            break;
    }
}

Move.prototype.north = function(vector) {
    var north = vector.north();

    if (north) {
        north.appendChild(vector.element);
    }
};

Move.prototype.east = function(vector) {
    var east = vector.east();

    if (east) {
        east.appendChild(vector.element);
    }
};

Move.prototype.south = function(vector) {
    var south = vector.south();
    
    if (south) {
        south.appendChild(vector.element);
    }
};

Move.prototype.west = function(vector) {
    var west = vector.west();

    if(west) {
        west.appendChild(vector.element);    
    }
};