function wind () {

}
wind.prototype = Object.create(item.prototype);
//wind.prototype.fillColor = 'lightblue';
wind.prototype.type = 'wind';
wind.prototype.init = function () {
    this.setDimension(game.canvas.wind.width * 0.07, game.canvas.wind.height * 0.07, true);
    this.canvas = game.canvas.wind;
    this.setLocation(0, 0);
    this.context = game.canvas.windContext;
    this.alpha = 0;
    this.AbsoluteCoordinates = new Array();
    this.windDirection = (game.level.direction == 'east' || game.level.direction == 'west')? 'x':'y';
    this.windWay = (game.level.direction == 'east' || game.level.direction == 'south')? 1:-1;

    for (x in this.CartesianCoordinates) {
        this.AbsoluteCoordinates[x] = new Array();
    }

}
wind.prototype.animate = function(/*pStartTime*/) {
    //var time = (new Date()).getTime() - pStartTime;
    var speed = game.level.velocity;

    var i = 0;
    for (var coordinate in this.AbsoluteCoordinates) {
        var cartesianX = this.CartesianCoordinates[coordinate][0];
        var cartesianY = this.CartesianCoordinates[coordinate][1];
        var absoluteX = this.AbsoluteCoordinates[coordinate][0];
        var absoluteY = this.AbsoluteCoordinates[coordinate][1];

        var windLimit = 0;
        if (this.windDirection == 'x') {
            cartesianPoint = cartesianX;
            cellDimension = game.cellWidth;
            absolute = absoluteX;
        } else {
            cartesianPoint = cartesianY;
            cellDimension = game.cellHeight;
            absolute = absoluteY;
        }

        windLimit = (cartesianPoint * cellDimension) + (cellDimension * this.windWay/* * 2*/) ;

        var newPos = (absolute + ( (speed*this.windWay) / 25 ) );

        // transparency
        if (coordinate == 0) {
            if ((newPos*this.windWay) < (windLimit-(cellDimension/2)) ) {
                //increment alpha
                if (this.alpha < 0.20) {
                    this.alpha += 0.03;
                }
            } else {
                // decrement alpha
                if (this.alpha > 0) {
                    this.alpha -= 0.005;
                }
            }
        }

        //console.log ('Windy: '+i+'. Start: '+(cartesianPoint * cellDimension)+'. Wind limit:'+windLimit+'. Current alpha: '+this.alpha+'. Current position: '+newPos);

        // displacement
        if ( (newPos*this.windWay) > (windLimit*this.windWay) ) {
            newPos = cartesianPoint * cellDimension;
            this.alpha = 0.09;
        }

        if (this.windDirection == 'x') {
            this.AbsoluteCoordinates[coordinate][0] = newPos;
        } else {
            this.AbsoluteCoordinates[coordinate][1] = newPos;
        }

        i++;
    }

    this.draw();
    requestAnimFrame(function() {
        game.wind.animate(/*pStartTime*/);
    });
}