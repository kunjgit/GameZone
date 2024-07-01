function Vector(element) {
    this.element = element;
}

Vector.prototype.north = function() {
    var Vector = this;
    var vectorCell = Vector.element.parentElement;
    var vectorRow = vectorCell.parentElement;
    var vectorRowChildren = vectorRow.children;
    var vectorIndex = Util.childIndex(vectorCell, vectorRowChildren);
    var previousRow = vectorRow.previousElementSibling;

    if (previousRow) {
        return previousRow.children[vectorIndex];    
    }
}

Vector.prototype.east = function() {
    var Vector = this;
    return Vector.element.parentElement.nextElementSibling;
}

Vector.prototype.south = function() {
    var Vector = this;
    var vectorCell = Vector.element.parentElement;
    var vectorRow = vectorCell.parentElement;
    var vectorRowChildren = vectorRow.children;
    var vectorIndex = Util.childIndex(vectorCell, vectorRowChildren);
    var nextRow = vectorRow.nextElementSibling;

    if (nextRow) {
        return nextRow.children[vectorIndex];    
    }
}

Vector.prototype.west = function() {
    var Vector = this;
    return Vector.element.parentElement.previousElementSibling;
}