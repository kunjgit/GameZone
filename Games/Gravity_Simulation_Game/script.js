// Learn to code this at:
// https://www.youtube.com/watch?v=3b7FyIxWW94

// Initial Setup
document.getElementById('bt').addEventListener('click', function(){
    location.reload();
})
document.getElementById('btn').addEventListener('click', function(){
    location.reload();
})
document.getElementById('b').addEventListener('click', function(){
var canvas = document.querySelector('canvas');
var c = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight/2;


// Variables
var mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

var colors = [
	'rgb(235, 1, 40)',
	'white',
	'black',
	'pink'
];

var gravity = 0.2;
var x = document.getElementsByName('opt');
var friction = 0.98;
if(x[0].checked)
    gravity=27.4;
if(x[1].checked)
    gravity=0.37;
if(x[2].checked)
    gravity=0.89;
if(x[3].checked)
    gravity=0.98;
if(x[4].checked)
    gravity=0.162;
if(x[5].checked)
    gravity=0.37;
if(x[6].checked)
    gravity=2.31;
if(x[7].checked)
    gravity=0.9;
if(x[8].checked)
    gravity=0.87;
if(x[9].checked)
    gravity=1.1;
if(x[10].checked)
    gravity=0.07;

document.getElementById('dd').style.display='none';
addEventListener("mousemove", function(event) {
	mouse.x = event.clientX;
	mouse.y = event.clientY;
});

addEventListener("resize", function() {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;
  init();
});

addEventListener("click", function(event) {
	init();
});


// Utility Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}


// Objects
function Ball(x, y, dx, dy, radius, color) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = color;

	this.update = function() {
		if (this.y + this.radius + this.dy> canvas.height) {
			this.dy = -this.dy;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
		} else {
			this.dy += gravity;
		}

		if (this.x + this.radius >= canvas.width || this.x - this.radius <= 0) {
			this.dx = -this.dx * friction;
		}

		this.x += this.dx;
		this.y += this.dy;
		this.draw();
	};

	this.draw = function() {
		c.beginPath();
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
		c.fillStyle = this.color;
		c.fill();
		c.stroke();
		c.closePath();
	};
}


// Implementation
var ballArray = [];

function init() {
	ballArray = [];

	for (let i = 0; i < 600; i++) {
		var radius = randomIntFromRange(8, 20);
		var x = randomIntFromRange(radius, canvas.width - radius);
		var y = randomIntFromRange(0, canvas.height - radius);
		var dx = randomIntFromRange(-3, 3)
		var dy = randomIntFromRange(-2, 2)
	    ballArray.push(new Ball(x, y, dx, dy, radius, randomColor(colors)));
	}
}

// Animation Loop
function animate() {
	requestAnimationFrame(animate);

	c.clearRect(0, 0, canvas.width, canvas.height);

	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
	}
}

init();
animate();
}
)