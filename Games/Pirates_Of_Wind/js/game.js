var game = game || {};

game.canvas = {};
game.player = new player();
game.wind = new wind();
game.island = new island();
game.points = Array();
game.level = new level();
game.obstacle = new obstacle();
game.obstacles = Array();
game.currentLevel = 0;
game.cellWidth = undefined;
game.cellHeight = undefined;
//game.velocity = 10;

game.init = function() {
    this.loadLevel(this.currentLevel);
    this.initializeCanvas();
    this.drawLevelObstacles();
    ////this.drawGrid();
    this.initPlayer();
    this.initWind();
    this.initIsland();
}

game.initializeCanvas = function () {
    this.canvas.background = document.getElementById('canvasBackground');
    this.canvas.obstacles = document.getElementById('canvasObstacles');
    this.canvas.player = document.getElementById('canvasPlayer');
    this.canvas.island = document.getElementById('canvasIsland');
    this.canvas.wind = document.getElementById('canvasWind');
    ////this.canvas.grid = document.getElementById('canvasGrid');

    this.canvas.backgroundContext = this.canvas.background.getContext('2d');
    this.canvas.obstaclesContext = this.canvas.obstacles.getContext('2d');
    this.canvas.playerContext = this.canvas.player.getContext('2d');
    this.canvas.islandContext = this.canvas.island.getContext('2d');
    this.canvas.windContext = this.canvas.wind.getContext('2d');
    ////this.canvas.gridContext = this.canvas.grid.getContext('2d');

    this.cellWidth = this.canvas.background.width / this.level.getColCount();
    this.cellHeight = this.canvas.background.height / this.level.getRowCount();

    // Calculate the margin left, due the canvas are positioned in abosolute
    game.marginLeft = (window.innerWidth - game.canvas.background.width) / 2;

    this.canvas.background.style.marginLeft = game.marginLeft + "px";
    this.canvas.obstacles.style.marginLeft = game.marginLeft + "px";
    this.canvas.player.style.marginLeft = game.marginLeft + "px";
    this.canvas.island.style.marginLeft = game.marginLeft + "px";
    this.canvas.wind.style.marginLeft = game.marginLeft + "px";

    this.canvas.background.style.display = 'block';
    this.canvas.obstacles.style.display = 'block';
    this.canvas.player.style.display = 'block';
    this.canvas.island.style.display = 'block';
    this.canvas.wind.style.display = 'block';

    ////this.canvas.grid.style.marginLeft = marginLeft + "px";

    document.getElementsByClassName('header')[0].style.display = 'block';

}

game.loadLevel = function(pLevel){
    this.level = levels[pLevel];
    document.getElementById('levelNum').innerHTML = 'Level: ' + this.level.num;
    document.getElementById('levelWindDirection').innerHTML = 'Wind: ' + this.level.direction;
}

game.drawLevelObstacles = function() {
    var levelObstacles = this.level.matrix; ////levels.matrix[game.levelNum];
	//this.obstacles = [];
    this.obstacle.init();
    var obstacleIndex = 0;
	for (i = 0; i < this.level.getColCount(); i++) {
		for (j = 0; j < this.level.getRowCount(); j++) {
			if (levelObstacles[j][i] == 's') {
                this.obstacle.CartesianCoordinates[obstacleIndex] = new Array();
                this.obstacle.CartesianCoordinates[obstacleIndex][0] = i;
                this.obstacle.CartesianCoordinates[obstacleIndex][1] = j;
                obstacleIndex++;
			}
		}
    }
    this.obstacle.draw();
    this.obstacle.animate();
}

game.initPlayer = function() {
    this.player.init();
    if (this.level.direction == 'east') { // left to right
        this.player.col = 0;
        //this.player.row = 0;
        this.player.row = this.getNumberRandom(0, this.level.getColCount() - 1);
        var posX = this.player.col * this.cellWidth;
        var posY = this.player.row * this.cellHeight;
        this.player.setLocation(posX, posY);
        this.player.draw();
    }

    //this.canvas.playerContext.rotate(30 * Math.PI / 180);
    this.player.animable = true;
    this.player.animate();
}

game.initWind = function(){

    this.wind.CartesianCoordinates = [[1,1],[5,1],[8,1],[2,3],[7,3],[1,5],[5,5],[8,5],[2,7],[7,7],[1,8],[5,8],[8,8]];
    this.wind.init();
    this.wind.setLocation(0, 0);

    var i = 0;
    for (var coordinate in this.wind.CartesianCoordinates) {
        this.wind.AbsoluteCoordinates[coordinate][0] = this.wind.CartesianCoordinates[coordinate][0] * this.cellWidth;
        this.wind.AbsoluteCoordinates[coordinate][1] = this.wind.CartesianCoordinates[coordinate][1] * this.cellHeight;
        //console.log('Coordenadas iniciales para '+(i++)+': '+this.wind.AbsoluteCoordinates[coordinate][0]+', '+this.wind.AbsoluteCoordinates[coordinate][1]);
    }

    this.wind.draw();

    this.wind.animate(/*startTime*/);
}

game.getNumberRandom = function (pMin, pMax) {
	return Math.floor((Math.random()*pMax) + pMin);
}

game.initIsland = function(){
    this.island.init();
    if (this.level.direction == 'east') { // left to right
        this.island.col = 10;
        //this.player.row = 0;
        this.island.row = this.getNumberRandom(0, this.level.getColCount() - 1);
        var posX = (this.island.col -1) * this.cellWidth;
        var posY = (this.island.row -1) * this.cellHeight;
        this.island.setLocation(posX, posY);
        this.island.draw();
    }

    //this.canvas.playerContext.rotate(30 * Math.PI / 180);
    this.player.animable = true;
    this.player.animate();
}

/*game.drawGrid = function() {
    for(var i = 0; i < this.level.getColCount(); i++) {
        this.canvas.gridContext.beginPath();
        this.canvas.gridContext.moveTo(this.cellWidth * i, 0);
        this.canvas.gridContext.lineTo(this.cellWidth * i, this.canvas.grid.height);
        this.canvas.gridContext.stroke();
    }
    for(var i = 0; i < this.level.getRowCount(); i++) {
        this.canvas.gridContext.beginPath();
        this.canvas.gridContext.moveTo(0, this.cellHeight * i);
        this.canvas.gridContext.lineTo(this.canvas.grid.width,  this.cellHeight * i);
        this.canvas.gridContext.stroke();
    }
}*/

game.getNumber = function(n) { return Number(String(n).replace(/\..*/, "")) }
game.getDecimal = function(n) { return Number(String(n).replace(/\.*./, "")) }

game.initPresentation = function(){
    game.presentation = document.getElementById('presentation');
    game.presentation.style.display = 'block';
    var marginLeft = (window.innerWidth - game.presentation.clientWidth) / 2;
    game.presentation.style.marginLeft = marginLeft + "px";
    var startButton = document.getElementById('startButton');
    startButton.onclick = function(){
        game.hidePresentation();
        game.init();
    };
}

game.hidePresentation = function(){
    game.presentation.style.display = 'none';
}

game.showInformation = function(pTitle, pContent, pButtonLabel, pButtonAction)
{
    var information = document.getElementById('information');
    information.style.display = 'block';
    information.style.marginLeft = this.marginLeft + "px";

    var title = document.getElementById('information_title');
    title.innerText = pTitle;
    title.innerHTML = pTitle;

    var content = document.getElementById('information_explanation');
    content.innerText = pContent;
    content.innerHTML = pContent;

    var button = document.getElementById('information_action');
    button.value = pButtonLabel;
    button.onclick = pButtonAction;
}

game.hideInformation = function(){
    var information = document.getElementById('information');
    information.style.display = 'none';
}

window.onload = function() {
    //game.init();
    game.initPresentation();
}

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
