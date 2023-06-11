function item () {
	this.posX = -1;
	this.posY = -1;
	this.width = 0;
	this.height = 0;
    this.col = -1;
    this.row = -1;
	this.fillColor = '';
    this.lineColor = '';
    this.type = ''; // player, spiral, windy, island... and skull
    this.context = undefined;
    this.canvas = undefined;
    this.inclination = 0;
    this.animable = false;
}
item.prototype.toString = function() {
    return "item";
}
item.prototype.setLocation = function(pX, pY) {
    if (typeof pX == 'number'
        && ((pX + this.width) <= this.canvas.width)
        && pX >=0) {
        this.posX = pX;
    }
    if (typeof pY == 'number'
        && ((pY + this.height) <= this.canvas.height)
        && pY >= 0) {
        this.posY = pY;
    }

}
item.prototype.setDimension = function(pWidth, pHeight, pSquare) {
    this.width = pWidth;
    this.height = pHeight;
    /*if(pSquare) {
        if(this.width < this.height) {
            this.height = pWidth;
        }
        else if (this.height < this.width) {
            this.width = pHeight
        }
    }*/
}
item.prototype.draw = function() {
    this.context.lineWidth = 1;
    if(this.type == 'player') {
        this.drawPlayer();
    }
    else if (this.type == 'spiral') {
        this.drawSpiral();

    } else if (this.type == 'wind') {
        this.drawWind();
    }
    else if (this.type == 'island') {
        this.drawIsland();
    }
    else if (this.type == 'skull') {
        this.drawSkull();
    }
    else if (this.type == 'winner') {
        this.drawWinner();
    }

    if (this.fillColor) {
        this.context.fillStyle = this.fillColor;
        this.context.fill();
    }
    this.context.lineColor = this.lineColor;
    this.context.stroke();
}
item.prototype.drawPlayer = function() {
    // clear the canvas
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // save the canvas context state for possible rotation
    this.context.save();
    this.context.beginPath();
    var tempX = this.posX;
    var tempY = this.posY;

    if(this.inclination != 0) {
        // rotate !
        this.context.translate(this.posX, this.posY);
        // console.log('x ' + this.posX);    
        // console.log('y ' + this.posY);
        this.context.rotate(this.inclination * Math.PI / 180);
        this.posX = 0;
        this.posY = 0;
    }

    var x = this.posX + (this.width * 0.125);
    var y = this.posY + (this.height / 2);
    this.context.moveTo(x, y);

    x = this.posX + this.width - (this.width * 0.125);
    y = this.posY + (this.height / 2);
    this.context.lineTo(x, y);

    x = this.posX + (this.width * 0.75);
    y = this.posY + this.height - (this.height * 0.25);
    this.context.lineTo(x, y);

    x = this.posX + (this.width * 0.25);
    y = this.posY + this.height - (this.height * 0.25);
    this.context.lineTo(x, y);

    this.context.closePath();

    x = this.posX + (this.width / 2);
    y = this.posY + (this.height * 0.125);
    this.context.moveTo(x, y);

    x = this.posX + (this.width * 0.375);
    y = this.posY + (this.height / 2);
    this.context.lineTo(x, y);

    x = this.posX + (this.width * 0.625);
    y = this.posY + (this.height / 2);
    this.context.lineTo(x, y);

    this.context.closePath();
    this.context.restore();

    this.posX = tempX;
    this.posY = tempY;
}
item.prototype.drawSpiral = function() {

    this.cleanSlate();
    this.context.strokeStyle = 'lightblue';
    this.context.lineWidth = 3;

    for (var coordinates in this.CartesianCoordinates) {

        var cartesianCoordinates = this.CartesianCoordinates[coordinates];
        var cartesianX = cartesianCoordinates[0];
        var cartesianY = cartesianCoordinates[1];
        var absoluteX = cartesianX * game.cellWidth + (game.cellWidth/2);
        var absoluteY = cartesianY * game.cellHeight + (game.cellHeight/2);

        this.context.moveTo(absoluteX, absoluteY);
        var a = this.width*this.height; //3360
        var r = t = 1.6;

        //console.log('Cell area: '+a+'('+this.width+'X'+this.height+')');

        for (var i=0; i<100; i++) {
            var angle = this.spin + i * 2 * Math.PI / 30;
            this.context.lineTo(absoluteX+r*Math.cos(angle),absoluteY+r*Math.sin(angle));
            r += 0.24;
        }
    }
}
item.prototype.drawWind = function(){

    this.cleanSlate();
    this.context.lineWidth = 3;
    for (coordinates in this.AbsoluteCoordinates) {
        var xoff = this.AbsoluteCoordinates[coordinates][0];
        var yoff = this.AbsoluteCoordinates[coordinates][1];
        //console.log('Wind direction: '+this.windDirection);
        this.context.globalAlpha = this.alpha;
        this.context.strokeStyle = 'blue';
        //this.context.lineWidth = 2;
        switch(game.level.direction) {
            case 'east':
                this.context.moveTo(5 + xoff, 28 + yoff);
                this.context.bezierCurveTo(-10 + xoff, 28 + yoff, 55 + xoff, 32 + yoff, 66 + xoff, 22 + yoff);
                this.context.bezierCurveTo(83 + xoff, 6 + yoff, 50 + xoff, 12 + yoff, 48 + xoff, 21 + yoff);
            break;
            case 'west':
                this.context.moveTo(88 + xoff, 51 + yoff);
                this.context.bezierCurveTo(73 + xoff, 51 + yoff, 22 + xoff, 63 + yoff, 27 + xoff, 49 + yoff);
                this.context.bezierCurveTo(30 + xoff, 40 + yoff, 56 + xoff, 39 + yoff, 43 + xoff, 46 + yoff);
            break;
            case 'north':
                this.context.moveTo(30 + xoff, 58 + yoff);
                this.context.bezierCurveTo(30 + xoff, 43 + yoff, 20 + xoff, 16 + yoff, 35 + xoff, 17 + yoff);
                this.context.bezierCurveTo(45 + xoff, 18 + yoff, 48 + xoff, 37 + yoff, 35 + xoff, 30 + yoff);
            break;
            case 'south':
                this.context.moveTo(23 + xoff, 15 + yoff);
                this.context.bezierCurveTo(22 + xoff, 0 + yoff, 20 + xoff, 43 + yoff, 26 + xoff, 57 + yoff);
                this.context.bezierCurveTo(30 + xoff, 67 + yoff, 50 + xoff, 53 + yoff, 34 + xoff, 42 + yoff);
            break;
        }
    }
}
item.prototype.drawIsland = function(){
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    var centerX = this.posX + (this.width / 2);
    var centerY = this.posY + (this.height / 2);
    var radius = this.height / 2;
    this.context.beginPath();
    this.context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    this.context.lineWidth = 2;
    this.context.moveTo(this.posX + (this.height / 2), this.posY);
    this.context.lineTo(this.posX + this.width - (this.height / 2), this.posY + this.height);

    this.context.moveTo(this.posX + this.width - (this.height / 2), this.posY);
    this.context.lineTo(this.posX + (this.height / 2), this.posY + this.height);
    this.context.lineJoin = 'round';
    this.context.stroke();
}
item.prototype.drawSkull = function (){
    ////this.cleanSlate();
    this.context.clearRect(0, 0, this.canvas.width - this.width, this.canvas.height);
    with(this.context) {
        beginPath();
        translate(this.posX+game.cellWidth/2,this.posY);
        moveTo(0,0);

        moveTo(12.120982,37.155834);
        bezierCurveTo(12.120982,37.155834,4.9519448,34.264607,1.8984661999999997,29.510146);
        bezierCurveTo(-2.7609612,18.736245,4.9899066,6.0332994,13.846862,4.1958508);
        bezierCurveTo(33.024521,0.5105534,41.406722,11.869055,39.137627,28.674902);
        bezierCurveTo(38.407448,29.510146,31.039271,37.155834,31.039271,37.155834);
        lineTo(31.43755,47.307251);
        lineTo(26.392673,47.5);
        lineTo(12.320119,47.435747);
        fill();
        moveTo(8.3842858,14.590029);
        bezierCurveTo(8.3842858,14.590029,8.952063200000001,30.171878,19.346746000000003,15.999544);

        moveTo(24.489543,15.397967);
        bezierCurveTo(24.489543,15.397967,29.955957,27.104699,34.539493,15.558114);

        moveTo(17.0331,37.54133);
        lineTo(17.165860000000002,47.371501);

        moveTo(23.339197,37.926827);
        lineTo(23.272817,47.307251);

        moveTo(20.338983,24.338983);
        bezierCurveTo(20.338983,24.338983,25.016949999999998,28.610169,18.237285,31.59322);

        stroke();
        fill();

    }
}
item.prototype.drawWinner = function (){
    //this.cleanSlate();
    //with(this.context) {
    //    // draw winner flag
    //}
    //alert('We have a winner');
}
item.prototype.cleanSlate = function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.context.beginPath();
}