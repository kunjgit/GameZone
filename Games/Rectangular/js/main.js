/*
	By Yhoyhoj : twitter.com/yhoyhoj
*/

function randomHexa() { //return a random hexa number

	var hexa = ['A', 'B', 'C', 'D' ,'E', 'F'];

	var number = Math.round(Math.random()*(16-2)+1);

	if(number > 9) {
		number = hexa[number-10];
	}

	return number;
}
function randomColor() { //return random hexa color
	var color = '#';
	for(var i =0; i < 6; i++){
		color+= randomHexa();
	}
	return color;
}
function init() { //create squares and first bonus/mines, create the player

	for(var i = 0; i < canvas.width/15; i++){

		var pp = new Square(Math.random()*canvas.width+1, Math.random()*canvas.height+1, 15+Math.random()*((100-15)+1), randomColor(), 0.5+Math.random(), false);
	}

	player = new Player(canvas.width/5, -25);

	for(var i = 0; i < canvas.width/320; i++){ //number of mines and bonus relative to the screen width
		var mine = new Mine(Math.random()*canvas.width+1, Math.random()*canvas.height+1, 100-Math.random()*30, 0.5+Math.random());
		var bonus = new Bonus(Math.random()*canvas.width+1, Math.random()*canvas.height+1);
	}
}
function drawArrow() {

	c.restore();
	c.save();
	c.fillStyle = "black";
	c.translate(canvas.width/5-30, 10);
	c.rotate(Math.PI * -10 / 180);
	c.beginPath();
	c.moveTo(0, 90);
	c.lineTo(+25, 50);
	c.lineTo(-25, 50);
	c.fill();
	c.moveTo(-8, 50);
	c.lineTo(-12, 0)
	c.lineTo(+12, 0)
	c.lineTo(+8, 50);
	c.fill();
	c.font = "20px Impact";
	c.fillText('ICI', +35 - c.measureText('ICI').width/2, 20);
	c.restore();

	c.fillStyle = "black";
	c.fillRect(canvas.width/5-50, -5, 3, 55);
	c.fillRect(canvas.width/5-50, 20, 30, 3);
	c.fillRect(canvas.width/5-50, 45, 30, 3);

	c.restore();

}
function onWin() { //draw the on win screen

	c.restore();
	c.fillStyle = "black";
	c.font = "70px Arial";
	c.fillText("You won !", canvas.width/2 - c.measureText("You won !").width/2, canvas.height/2 -70/2);
	c.font = "20px Arial";
	c.fillText("Reload the page to retry (your best time will be saved).", canvas.width/2 - c.measureText("Reload the page to retry (your best time will be saved).").width/2, canvas.height/2+8 -15/2);
	c.font = "15px Arial";
	c.fillText("Time : "+elapsedTime, canvas.width/2 - c.measureText("Time : "+elapsedTime).width/2, canvas.height/2+30 -15/2);

	if(localStorage && localStorage.getItem('rectangularBest') != null) {
		var time = localStorage.getItem('rectangularBest');
		c.fillText("Best time : "+time, canvas.width/2 - c.measureText("Best time : "+time).width/2, canvas.height/2+50 -15/2);
	}
}


var canvas = document.getElementsByTagName("canvas")[0];
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
var c = canvas.getContext("2d");
var objects = [];
var player;
var seconds;
var left, right, up, space;
var started = false;
var win = false;
var elapsedTime;

var menu = document.getElementById('menu');
menu.style.left = canvas.width/2-250+"px";
menu.style.top = canvas.height/2-250+"px";


document.onkeydown = function (evt) {

    onKeyDown(evt.keyCode);

};

document.onkeyup = function(evt) {

    onKeyUp(evt.keyCode);

};

document.getElementsByTagName('a')[0].onclick = function() { //on wlick on the play button
	menu.style.opacity = 0;
	seconds = new Date(); //save the start date (bad variable name)
	var pp = new Square(canvas.width+100, Math.random()*canvas.height+1, 125-Math.random()*100, randomColor(), 0.5+Math.random(), true); // create a timer square
	started = true;
};

init();

update();




function update() {

	if(window.webkitRequestAnimationFrame)
		webkitRequestAnimationFrame(update);

	else if(window.mozRequestAnimationFrame)
		mozRequestAnimationFrame(update);

	else if((window.msRequestAnimationFrame))
		msRequestAnimationFrame(update);
	else if(window.requestAnimationFrame)
		requestAnimationFrame(update);
	else
		setTimeout(update, 1000/40);

	c.save();

	//erase the screen

	c.fillStyle = "#FAFAED";
	c.shadowBlur=0;
	c.shadowOffsetX = -0;
	c.shadowOffsetY = 0;
	c.fillRect(0,0, canvas.width, canvas.height);
	c.fillStyle= "#FA4646"
	c.fillRect(canvas.width-15, 0, 5, canvas.height);

	drawArrow();

	c.restore();

	for(var i = 0; i < objects.length; i++) {

		var p = objects[i];		
		p.tick();
	}
	
	if(started)			//the player is updated/rendered only if the game has begun
		player.tick();

	if(win)			//will draw the on win screen only if win
		onWin();

}

/* --- Changelog ----

*09/08/12
- Better renderer system for player, to avoid a z-axis bug
- Added local high-score system

*09/06/12
- Added Parachute and parachute reload
- increased player velocity

*09/05/12
- Added Mines
- Pre-added parachute, to be finished

*09/04/12
- Better jump
- Added fantasy spawn sign
- Now easier
- Separated source code in several files for better understanding

*09/03/12 :
- First Release
- Slight fall speed inscrease

*/

