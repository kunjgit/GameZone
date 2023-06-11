function player () {

}
player.prototype = Object.create(item.prototype);
////player.prototype.type = 'player';
player.prototype.init = function () {
    this.setDimension(game.cellWidth, game.cellHeight, false);
    this.type = 'player';
    this.fillColor = 'white';
    this.lineColor = 'red';
    this.inclination = 0;
    this.context = game.canvas.playerContext;
    this.canvas = game.canvas.player;
    this.setLocation(0, 0);

    if(game.level.direction == 'east') {
        window.addEventListener("keydown", function(e) {
            var keyPressed = e.keyCode || e.which;
            if(keyPressed == 38){ // up
                game.player.inclination =  -3;
                game.player.setLocation(undefined, game.player.posY -= 0.45);
            }
            else if (keyPressed == 40){ // down
                game.player.inclination =  3;
                game.player.setLocation(undefined, game.player.posY += 0.45);
            }
        });
        window.addEventListener("keyup", function(e) {
            var keyPressed = e.keyCode || e.which;
            if(keyPressed == 38 || keyPressed == 40){ // up or down
                game.player.inclination =  0;
            }
        });
    }
}
player.prototype.animate = function(/*pStartTime*/) {
    ////var time = (new Date()).getTime() - pStartTime;
    if (this.animable) {
        var newX;
        var speed = game.level.velocity;

        if(game.level.direction == 'east') {
            newX = (this.posX + speed / 100);
            if(newX < this.canvas.width - this.width) {
                //this.posX = newX;
            }
        }
        else if(game.level.direction == 'west') {
            newX = (this.posX - speed / 100);
            if(newX > 0) {
                //this.posX = newX;
            }
        }
        this.old_position = this.col;
        this.setLocation(newX, this.posY);
        //if (this.old_position != this.col) {
            if (!game.obstacle.are_we_doomed_yet(this.col, this.row)){
                game.obstacle.are_we_saved_yet(this.col, this.row);
            }
        //}
        this.draw();
        requestAnimFrame(function() {
            game.player.animate(/*pStartTime*/);
        });
    }

}
player.prototype.setLocation = function(posX, posY) {
    item.prototype.setLocation.call(this, posX, posY);

    var inclination_tolerance = Math.abs(this.inclination);
    // calculate column
    var wholeNumberX = (game.player.posX + game.player.width) / game.cellWidth;
    //var wholeNumberX = (game.player.posX + (game.player.width/2)) / game.cellWidth;
    var number = game.getNumber(wholeNumberX);
    var decimal = game.getDecimal(wholeNumberX);
    if(decimal > 0.5) {
        number++;
    }
    this.col = number;

    // calculate row
    var wholeNumberY = (game.player.posY + game.player.height) / game.cellHeight;
    //var wholeNumberY = (game.player.posY + (game.player.height/2)) / game.cellHeight;
    var number = game.getNumber(wholeNumberY);
    var decimal = game.getDecimal(wholeNumberY);
    if(decimal > 0.5) {
        number++;
    }
    this.row = number;
}


