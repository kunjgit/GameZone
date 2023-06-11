function obstacle() {
	
} 
obstacle.prototype = Object.create(item.prototype);
obstacle.prototype.type = 'spiral';
obstacle.prototype.fillColor = 'white';
obstacle.prototype.init = function() {
    this.context = game.canvas.obstaclesContext;
    this.canvas = game.canvas.obstacles;
    this.spin = 0;
    this.CartesianCoordinates = new Array();
    this.setDimension(game.cellWidth, game.cellHeight, true);
}
obstacle.prototype.animate = function(/*pStartTime*/) {
    //var time = (new Date()).getTime() - pStartTime;
    var speed = game.level.velocity;

    var newSpin = (this.spin - ( speed / 400 ) );

    if (newSpin < 0) {
    	newSpin = 360;
    }

    this.spin = newSpin;
    this.draw();
    requestAnimFrame(function() {
        game.obstacle.animate(/*pStartTime*/);
    });
}
obstacle.prototype.are_we_doomed_yet = function (posX, posY){
	for (coordinate in this.CartesianCoordinates){
		if ((posX-1) == this.CartesianCoordinates[coordinate][0] && (posY-1) == this.CartesianCoordinates[coordinate][1] ){
            //console.log('We are doomed on: '+posX+', '+posY);
			//console.log('We are doomed on: '+this.CartesianCoordinates[coordinate][0]+', '+this.CartesianCoordinates[coordinate][1]);
            game.player.type = 'skull';
            game.player.animable = false;

            game.showInformation('Doh!', 'The ship fall down in a swirl.', 'RETRY',
                function(){
                    location.reload();
                    //game.hideInformation();
                    //game.init();
                }
            );


            return true;
		}
	}
    return false;
}
obstacle.prototype.are_we_saved_yet = function (posX, posY){
    if ((posX) == game.island.col && (posY) == game.island.row ){
        //console.log('We are doomed on: '+posX+', '+posY);
        //console.log('We are saved on: '+this.CartesianCoordinates[coordinate][0]+', '+this.CartesianCoordinates[coordinate][1]);
        //game.player.type = 'winner';
        game.player.animable = false;

        game.showInformation('Hell Yeah!', 'The ship is in a safe place.', 'RETRY',
            function(){
                location.reload();
                //game.hideInformation();
                //game.init();
            }
        );

        return true;
    }
    return false;
}