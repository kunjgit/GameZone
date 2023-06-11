function island () {
}
island.prototype = Object.create(item.prototype);
island.prototype.type = 'island';
island.prototype.init = function () {
    this.setDimension(game.cellWidth, game.cellHeight, false);
    this.fillColor = 'brown';
    this.lineColor = 'green';
    this.context = game.canvas.islandContext;
    this.canvas = game.canvas.island;
    this.setLocation(0, 0);
}
island.prototype.setLocation = function(posX, posY) {
    item.prototype.setLocation.call(this, posX, posY);

    var inclination_tolerance = Math.abs(this.inclination);
    // calculate column
    var wholeNumberX = (game.island.posX + game.island.width) / game.cellWidth;
    //var wholeNumberX = (game.player.posX + (game.player.width/2)) / game.cellWidth;
    var number = game.getNumber(wholeNumberX);
    var decimal = game.getDecimal(wholeNumberX);
    if(decimal > 0.5) {
        number++;
    }
    this.col = number;

    // calculate row
    var wholeNumberY = (game.island.posY + game.island.height) / game.cellHeight;
    //var wholeNumberY = (game.player.posY + (game.player.height/2)) / game.cellHeight;
    var number = game.getNumber(wholeNumberY);
    var decimal = game.getDecimal(wholeNumberY);
    if(decimal > 0.5) {
        number++;
    }
    this.row = number;
}