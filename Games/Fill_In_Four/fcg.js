var HEIGHT = 550;
var WIDTH = 600;
var DEFAULT_COLOR = ["#FFFFFF", "#FF0000", "#00FF00", "#0000FF", "#FFFF00"];

function getElmt(id){ return document.getElementById(id); }

function FCG(){
	this.cdom = getElmt('myfcg');
	this.ctx = this.cdom.getContext('2d');
	this.currentLevel = 0;
}

FCG.prototype.line = function(x1,y1, x2,y2){
	this.ctx.moveTo(x1,y1);
	this.ctx.lineTo(x2,y2);
	this.ctx.lineWidth = 1;
	this.ctx.strokeStyle = '#bbb';
	this.ctx.stroke();
}

FCG.prototype.drawLines = function(lines){
	var line;
	for (var i=0; i<lines.length; i++){
		line = lines[i];
		this.line(line[0],line[1], line[2],line[3]);
		console.log('line', i + ', ' + line);
	}
}

FCG.prototype.setColor = function (index){ this.currentColor = index; }

FCG.prototype.fillPart = function (index){
	var parts = LEVEL[this.currentLevel].parts;
	this.ctx.fillStyle = DEFAULT_COLOR[this.currentColor];
	console.log('parts ' + index, parts[index]);
	this.ctx.fillRect(parts[index][0]+1, parts[index][1]+1, parts[index][2]-1,parts[index][3]-1);
	this.partsColor[index] = this.currentColor;
}

FCG.prototype.fillBackground = function(){
	this.ctx.fillStyle = DEFAULT_COLOR[0];
	this.ctx.fillRect(0, 0, WIDTH, HEIGHT);
},
FCG.prototype.setLevelText = function (){ var lvl = getElmt('level'); lvl.innerHTML = this.currentLevel+1; }
FCG.prototype.initPartsColor = function(){
	var parts = LEVEL[this.currentLevel].parts
	this.partsColor = new Array();
	
	for (var i=0; i<parts.length; i++){
		this.partsColor[i] = 0;
	}
}
FCG.prototype.start = function (){
	var level = LEVEL[this.currentLevel];
	
	this.currentColor = 0;
	this.fillBackground();
	this.setLevelText();
	this.initPartsColor();
	this.drawLines(level.lines);
	for (var i=0; i<this.partsColor.length; i++){
		this.fillPart(i);
	}
}

FCG.prototype.next = function(){
	var max = LEVEL.length - 1;
	
	if (max == this.currentLevel){
		this.currentLevel = 0;
		this.win();
	} else if (max > this.currentLevel){
		this.currentLevel++;
		this.start();
	}
}

FCG.prototype.win = function(){
	alert('You are the winner');
	this.start();
}

FCG.prototype.validate = function(){
	var valid = true;
	var neighbours = LEVEL[this.currentLevel].neighbours
	
	for (var i=0; i<this.partsColor.length; i++){
		if (this.partsColor[i] == 0){
			valid = false;
			break;
		}
	}
	if (valid){
		for (var i=0; i<neighbours.length; i++){
			for (var j=0; j<neighbours[i].length; j++){
				if ((neighbours[i][j] == 1) && (this.partsColor[i] == this.partsColor[j])){
					valid = false;
					console.log('break: i,j', i + ',' + j);
					console.log('partsColor: i,j', this.partsColor[i] + ',' + this.partsColor[i]);
					break;
				}
			}
			if (!valid) break;
		}
	}
	return valid;
}

// Calculate x and y position of click event
// This has also handled scrolled window
FCG.prototype.calculatePosition = function(event){
	console.log('event', event);
	var x = event.clientX;
	var y = event.clientY;
	console.log('original click', x + ',' + y);
	console.log('offsetLeft', this.cdom.offsetLeft);
	console.log('offsetTop', this.cdom.offsetTop);
	x = x - this.cdom.offsetLeft + window.scrollX;
	y = y - this.cdom.offsetTop + window.scrollY;
	return [x,y];
}

// Check is given position located in side canvas and if so,
// calculate in which part
FCG.prototype.getPartByPoint = function(position){
	var result = -1;
	var parts = LEVEL[this.currentLevel].parts;
	var part;
	
	for (var i=0; i<parts.length; i++){
		part = new Rect(parts[i][0], parts[i][1], parts[i][0] + parts[i][2], parts[i][1] + parts[i][3]);
		if (part.isInside(position[0],position[1])){
			result = i;
			break;
		}
	}
	return result;
}


function Rect(x1,y1, x2,y2){
	this.x1 = x1;
	this.y1 = y1;
	this.x2 = x2;
	this.y2 = y2;
}

// Check is given point (x, y) is inside rectangular
Rect.prototype.isInside = function(x, y){
	return x >= this.x1 && x <= this.x2 && y >= this.y1 && y <= this.y2;
}

// Game
function startGame(){
	var btn = getElmt('validate');
	var reset = getElmt('reset');
	var red = getElmt('red');
	var green = getElmt('green');
	var blue = getElmt('blue');
	var yellow = getElmt('yellow');
	var help = getElmt('help');
	
	fcg = new FCG();
	fcg.start();
	
	// Change color choice.
	// Color is determined from array DEFAULT_COLOR
	red.addEventListener('click', function(){
		fcg.currentColor = 1;
	});
	green.addEventListener('click', function(){
		fcg.currentColor = 2;
	});
	blue.addEventListener('click', function(){
		fcg.currentColor = 3;
	});
	yellow.addEventListener('click', function(){
		fcg.currentColor = 4;
	});
	
	// Validate button handler
	btn.addEventListener("click", function(){
		valid = fcg.validate();
		console.log('valid', valid);
		if (valid){
			fcg.next();
		} else {
			alert("Bad Luck.\nAll parts must be filled with no default color.\nDirectly connected parts must be filled with different color.");
		}
	});
	
	// Reset button handler
	reset.addEventListener('click', function(){
		var input = confirm("Are you sure out of luck?");
		if (input == true){
			fcg.start();
		}
	});
	
	// Help button handler
	help.addEventListener('click', function(){
		var helpText = "Rule of play\
		\n\nFill all square (at the left side) with any color from the list (at the right side)\
		\nYou must fill all square and make sure no directly connected parts have same color\
		\n\nTo fill a square with specific color, choose the color by clicking color list (at the right side)\
		\nand then click specific part do you want to color.\
		\n\nGood Luck";
		alert(helpText);
	});
	
	// Canvas handler
	fcg.cdom.addEventListener("mousedown", function (event){
		var clickPos = fcg.calculatePosition(event);
		console.log('Calibrated position', clickPos[0] + ',' + clickPos[1]);
		var partNumber = fcg.getPartByPoint(clickPos);
		console.log('click in area', partNumber);
		fcg.fillPart(partNumber);
	}, false);
	
}