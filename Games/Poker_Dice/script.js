/**
 * Poker Dice 13
 * HTML5 game for the js13kGames competition
 * @author Csaba Csecskedi
 */

/**
 * Animation Frame workaround THX to Paul Irish
 */
window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function( callback ){
				window.setTimeout(callback, 1000 / 60);
			};
})();
	
/**
 * Game module
 */
(function() {

/**
 * DOM utility function
 */
function $(item, name, index) {
	if (typeof(item) == 'string') {
		item = document.getElementById(item);
	}
	if (name != undefined) {
		item = item.getElementsByTagName(name);
	}
	if (index != undefined) {
		item = item[index];
	}
	return item;
}

/**
 * ForEach utility function
 */
$.each = function(items, callback) {
	for (var i=0; i<items.length; i++) {
		callback.call(items[i], i, items[i]);
	}
};

/**
 * Dice model class
 */
function Dice() {
	this.x = 0;
	this.y = 0;
	this.angle = 0;
	this.value = 0;
};

/**
 * Randomize dice value
 */
Dice.prototype.roll = function() {
	this.value = Math.floor(Math.random() * 6) + 1;
};

/**
 * Player model class
 */
function Player(name, log) {
	this.name = name;
	this.score = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
	if (log) {
		this.log = log;
		this.ai = true;
	} else {
		this.log = [];
		this.ai = false;
	}
	this.stat = JSON.parse(sessionStorage.getItem('stat')) || {
		played: 0,
		wins: 0,
		best: 0,
		poker: 0
	};
};

/**
 * Calculate total score
 * @returns {Number}
 */
Player.prototype.total = function() {
	var total = 0;
	for (var i in this.score) {
		if (this.score[i] > 0) {
			total += this.score[i];
		}
	}
	return total;
};

/**
 * Player log playback
 * @param callback
 */
Player.prototype.play = function(callback) {
	if (this.log.length > 0) {
		var roll = this.log[0].shift();
		var hold = this.log[0].shift();
		if (this.log[0].length == 0) {
			this.log.shift();
		}
		callback.call(this, roll, hold);
	}
};

/**
 * Save player log to local storage 
 * @param winner
 */
Player.prototype.save = function(winner) {
	this.stat.played++;
	if (winner) {
		this.stat.wins++;
	}
	var total = this.total();
	if (total > this.stat.best) {
		this.stat.best = total;
	}
	if (this.score[11] > 0) {
		this.stat.poker++;
	}
	sessionStorage.setItem('stat', JSON.stringify(this.stat));
};

/**
 * Game logic
 */
function Logic() {
	var ai = localStorage.getItem('AI');
	if (ai) Logic.ai = JSON.parse(ai);
	this.index = Math.floor(Math.random() * Logic.ai.length);
	this.round = 0;
	this.rolls = 0;
	this.active = 0;
	this.holder = [];
	this.players = [
		new Player('Player'),
		new Player('Computer', Logic.ai[this.index])
	];
	this.dices = [
  		new Dice(),
  		new Dice(),
  		new Dice(),
  		new Dice(),
  		new Dice()
  	];
	this.log = [];
};

/**
 * Recorder games
 */
Logic.ai = [
[[[6,5,3,2,2],[0],[6,4,4,2,3],[3,4,1],[5,4,1,2,3],10],[[1,5,2,5,4],[3,1],[3,5,6,5,3],[3,1],[6,5,1,5,3],12],[[6,6,1,2,1],[1,0],[6,6,1,6,4],[1,0,3],[6,6,3,6,4],6],[[4,2,1,6,5],[3],[3,4,3,6,2],[4,2,1],[5,4,3,5,2],9],[[4,3,1,6,6],[3,4],[1,3,1,6,6],[3,4],[3,4,2,6,6],1],[[3,4,5,6,5],[2,4],[3,5,5,2,5],[2,4,1],[3,5,5,1,5],4],[[1,1,4,6,5],[3],[2,2,2,6,1],[3],[3,3,3,6,1],2],[[6,3,6,5,3],[0,2],[6,4,6,3,4],[0,2,4,1],[6,4,6,6,4],8],[[2,3,3,3,2],[3,2,1],[6,3,3,3,1],[3,2,1],[5,3,3,3,4],0],[[3,3,6,5,2],[2],[1,4,6,5,3],[2],[6,1,6,5,5],5],[[3,4,1,1,6],[1],[6,4,1,2,6],[1],[3,4,3,6,3],11],[[5,1,5,3,2],[0,2],[5,2,5,3,1],[0,2],[5,1,5,3,6],7],[[2,5,3,6,6],[],[3,5,5,1,6],[],[5,6,2,5,6],3]],
[[[2,1,1,1,3],[1,3,2],[2,1,1,1,5],[1,3,2],[3,1,1,1,6],0],[[6,4,1,6,5],[0,3],[6,2,5,6,6],[0,3,4],[6,5,2,6,6],6],[[1,4,6,6,4],[3,2,1,4],[3,4,6,6,4],[3,2,1,4],[1,4,6,6,4],12],[[5,5,1,6,3],[1,0],[5,5,4,2,4],[1,0,2,4],[5,5,4,5,4],8],[[6,6,5,3,1],[1,0],[6,6,2,6,4],[1,0,3],[6,6,2,6,2],5],[[5,4,1,2,3],10],[[2,4,4,3,2],[0,3,2],[2,6,4,3,1],9],[[4,1,4,3,6],[0,2],[4,2,4,1,5],[0,2],[4,3,4,3,5],2],[[2,1,3,5,1],[3],[3,5,2,5,5],[3,1,4],[6,5,6,5,5],4],[[5,3,3,6,4],[4],[1,4,6,2,4],[4,1],[1,4,6,2,4],3],[[2,3,6,4,6],[2,4],[1,2,6,1,6],[2,4],[1,4,6,3,6],1],[[1,6,2,3,3],[3,4],[2,4,5,3,3],[3,4],[1,4,5,3,3],11],[[2,5,3,3,4],[2,3],[2,2,3,3,1],[2,3],[1,6,3,3,2],7]],
[[[4,6,2,6,6],[1,4,3],[2,6,6,6,6],[1,4,3,2],[3,6,6,6,6],7],[[3,5,6,2,1],[2,1],[5,5,6,5,4],[2,1,0,3],[5,5,6,5,4],6],[[4,2,6,2,6],[4,2],[4,5,6,2,6],[4,2],[4,5,6,3,6],9],[[3,1,4,2,5],10],[[1,3,3,5,6],[2,1],[5,3,3,2,1],[2,1],[2,3,3,5,4],3],[[4,1,3,5,3],[2,4],[5,1,3,6,3],[2,4],[1,2,3,1,3],0],[[5,1,4,6,2],[3],[6,3,3,6,5],[3,0],[6,5,2,6,5],4],[[3,4,1,5,3],[4,0],[3,6,6,4,3],[1,2],[2,6,6,1,1],1],[[5,5,1,4,6],[1,0,4],[5,5,4,5,6],[1,0,4,3],[5,5,4,5,6],12],[[2,6,6,4,1],[2,1],[5,6,6,3,2],[2,1],[3,6,6,1,6],5],[[1,6,4,3,2],[3],[5,6,3,3,1],[3,2],[1,2,3,3,3],2],[[1,4,3,5,3],[4,2],[3,1,3,2,3],[4,2,0],[3,1,3,5,3],11],[[6,1,3,2,3],[0],[6,1,5,4,3],[0,2],[6,1,5,3,6],8]],
[[[3,3,1,6,5],[1,0],[3,3,3,6,2],[1,0,2],[3,3,3,2,4],2],[[1,2,4,6,4],[2,4],[4,1,4,1,4],[2,4,0],[4,1,4,5,4],3],[[1,4,3,5,6],[2,1,3,4],[2,4,3,5,6],10],[[2,6,4,1,1],[4,3],[6,6,6,1,1],[2,0,1],[6,6,6,3,5],6],[[5,4,2,1,6],[4,0],[5,5,1,5,6],[4,0,1,3],[5,5,3,5,6],4],[[5,6,6,3,5],[2,1,0,4],[5,6,6,5,5],8],[[3,4,6,1,2],9],[[5,6,4,3,1],[1],[1,6,1,2,5],[1],[5,6,3,4,1],0],[[1,2,4,5,4],[4,2],[2,1,4,1,4],[4,2],[2,3,4,4,4],1],[[5,3,5,3,2],[2,0],[5,4,5,1,6],[2,0],[5,3,5,2,3],12],[[1,4,6,6,1],[3,2],[3,1,6,6,6],[3,2,4],[1,2,6,6,6],5],[[6,5,1,4,3],[0],[6,2,4,2,6],[0,4],[6,3,1,1,6],11],[[6,4,1,4,5],[1,3],[1,4,3,4,1],[1,3],[6,4,2,4,5],7]],
[[[6,1,1,2,4],[0],[6,3,2,3,1],[1,3],[1,3,5,3,5],0],[[3,4,5,1,1],[0,1,2],[3,4,5,4,2],[0,1,2,4],[3,4,5,3,2],9],[[5,1,3,4,2],10],[[1,4,4,3,2],[1,2],[6,4,4,2,5],[1,2],[5,4,4,5,5],8],[[2,5,1,4,1],[1],[1,5,2,1,2],[2,4],[6,4,2,3,2],1],[[4,1,6,4,1],[0,3],[4,1,1,4,3],[0,3],[4,1,4,4,3],3],[[1,6,4,4,4],[1,2,3,4],[6,6,4,4,4],[1,4,2,0],[6,6,4,6,4],6],[[2,1,2,4,6],[4],[3,2,3,5,6],[2,0],[3,1,3,4,1],2],[[5,3,6,4,6],[2,4],[5,1,6,3,6],[2,4],[1,3,6,5,6],5],[[2,6,1,2,4],[1],[4,6,2,3,3],[1],[2,6,4,4,2],12],[[1,5,4,3,1],[1],[4,5,2,6,6],[3,4],[6,2,4,6,6],7],[[2,6,4,5,6],[3],[4,6,3,5,4],[3],[5,4,6,5,3],4],[[4,5,1,3,4],[0,4],[4,3,4,6,4],[0,4,2],[4,2,4,2,4],11]],
[[[1,3,4,3,5],[1,2,4],[5,3,4,4,5],[1,2,4],[3,3,4,5,5],2],[[2,3,2,1,4],[0,1,4,3],[2,3,1,1,4],[0,1,4,3],[2,3,1,1,4],9],[[5,2,5,2,5],[0,2,4],[5,4,5,2,5],[0,2,4],[5,6,5,1,5],6],[[3,2,5,5,3],[2,3],[1,4,5,5,1],[2,3],[4,3,5,5,1],0],[[4,2,1,5,6],[4],[1,2,2,4,6],[4],[5,5,4,2,6],12],[[3,6,3,5,5],[4,3,1],[6,6,2,5,5],[4,3,1,0],[6,6,5,5,5],8],[[6,6,6,1,2],[0,2,1],[6,6,6,1,6],[0,2,1,4],[6,6,6,3,6],7],[[3,1,6,6,5],[2,3],[4,1,6,6,1],[2,3],[6,3,6,6,6],5],[[4,2,5,6,6],[2],[1,2,5,2,1],[1,3],[5,2,1,2,2],1],[[1,4,2,5,6],[1,3,4],[1,4,6,5,6],[1,3],[6,4,5,5,4],3],[[2,1,1,3,4],[2,3,0,4],[2,1,1,3,4],[2,3,0,4],[2,3,1,3,4],10],[[2,5,5,1,4],[2,1],[4,5,5,3,6],[2,1],[5,5,5,5,1],4],[[4,4,6,3,2],[1,0],[4,4,4,4,3],[1,0,3,2],[4,4,4,4,3],11]],
[[[3,4,4,3,3],8],[[4,6,1,6,4],[3,1],[1,6,4,6,4],[3,1],[1,6,6,6,4],6],[[1,2,3,3,3],[2,4,3],[5,3,3,3,3],[2,4,3,1],[2,3,3,3,3],2],[[6,4,3,4,6],[4,0],[6,3,6,2,6],[4,0,2],[6,3,6,2,6],5],[[1,5,3,2,5],[1,4],[1,5,6,5,5],[1,4,3],[1,5,2,5,5],4],[[6,2,4,6,6],[4,0,3],[6,4,5,6,6],[4,0,3],[6,1,3,6,6],12],[[3,2,5,3,6],[4],[2,3,4,1,6],[3,0,1,2],[2,3,4,1,6],9],[[2,5,4,5,1],[1,3],[6,5,4,5,6],[1,3],[1,5,3,5,3],0],[[5,6,2,3,6],[1,4],[4,6,2,5,6],[1,4],[1,6,1,4,6],3],[[6,2,6,1,1],[2,0],[6,3,6,1,4],[2,0],[6,5,6,5,2],1],[[6,4,3,5,2],10],[[4,5,5,2,6],[2,1],[4,5,5,3,3],[2,1],[3,5,5,3,2],11],[[6,2,4,5,3],[0],[6,3,3,5,4],[1,2],[6,3,3,6,2],7]],
[[[6,1,2,3,1],[4,1],[5,1,1,2,1],[4,1,2],[1,1,1,2,1],0],[[3,4,1,5,4],[1,4],[5,4,2,2,4],[1,4],[5,4,3,4,4],3],[[5,3,1,5,2],[3,0],[5,1,3,5,6],[3,0],[5,6,1,5,3],4],[[1,1,1,2,5],[4],[5,5,2,6,5],[4,1,0,3],[5,5,5,6,5],7],[[1,6,1,2,4],[1],[1,6,3,3,4],[3,2],[1,4,3,3,3],2],[[4,3,4,2,5],[3,1,0,4],[4,3,2,2,5],[3,1,0,4],[4,3,3,2,5],9],[[4,1,3,6,3],[3],[4,6,5,6,5],[3,1],[1,6,4,6,4],5],[[6,6,4,1,6],[4,1,0],[6,6,1,6,6],[4,1,0,3],[6,6,4,6,6],6],[[6,3,4,3,4],[4,3,1,2],[6,3,4,3,4],[4,3,1,2],[6,3,4,3,4],12],[[1,5,4,2,1],[4,3,2,1],[1,5,4,2,1],[4,3,2,1],[1,5,4,2,1],1],[[3,4,2,6,6],[2,0,1,4],[3,4,2,5,6],10],[[2,1,6,4,1],[1,4],[6,1,5,4,1],[1,4],[3,1,4,2,1],11],[[5,3,1,4,2],[],[3,6,6,4,5],[2,1],[6,6,6,4,3],8]],
[[[4,2,2,3,1],[4,2,3,0],[4,4,2,3,1],[4,2,3,0],[4,4,2,3,1],9],[[5,1,5,6,6],[4,3,0,2],[5,1,5,6,6],[4,3,0,2],[5,2,5,6,6],5],[[5,3,1,3,2],[3,1],[5,3,1,3,2],[3,1],[1,3,6,3,4],2],[[5,6,6,3,3],[1,2,3,4],[6,6,6,3,3],8],[[2,3,4,4,1],[2,3],[3,4,4,4,3],[2,3,1],[3,4,4,4,5],3],[[3,5,5,2,6],[2,1],[1,5,5,2,2],[2,1],[5,5,5,6,4],6],[[1,4,4,3,5],[4],[5,5,6,6,5],12],[[5,5,3,1,6],[1,0],[5,5,2,2,6],[1,0],[5,5,3,6,6],4],[[6,1,2,5,2],[4,2],[2,5,2,1,2],[4,2,0],[2,2,2,3,2],1],[[4,4,4,3,5],[0,2,1],[4,4,4,1,2],[0,2,1],[4,4,4,6,2],0],[[5,5,6,4,4],[0,1],[5,5,2,4,6],[0,1],[5,5,1,5,6],11],[[4,5,3,2,6],10],[[1,1,3,2,1],[],[1,3,1,1,5],[],[3,5,6,6,4],7]],
[[[6,3,2,1,4],[3,2,1,4],[4,3,2,1,4],[3,2,1,4],[5,3,2,1,4],10],[[2,2,1,5,1],[0,1],[2,2,3,5,6],[0,1],[2,2,3,6,4],1],[[3,3,3,4,4],8],[[4,5,1,5,1],[3,1],[3,5,2,5,5],[3,1,4],[1,5,1,5,5],4],[[4,2,5,6,2],[3],[1,6,5,6,4],[3,1],[1,6,3,6,1],0],[[1,6,3,3,6],[1,4],[2,6,1,2,6],[1,4],[1,6,6,1,6],5],[[2,4,3,2,5],9],[[5,3,3,1,1],[2,1],[4,3,3,2,6],[2,1],[3,3,3,5,4],2],[[4,2,3,1,5],[4],[4,5,5,3,5],[4,1,2],[5,5,5,6,5],7],[[2,1,5,4,1],[3],[2,2,6,4,5],[3],[6,4,1,4,1],3],[[3,1,4,6,1],[3],[2,1,3,6,1],[3],[1,6,4,6,1],11],[[2,5,1,3,2],[1],[4,5,6,6,4],[2,3],[1,1,6,6,5],12],[[4,1,6,5,3],[2],[5,1,6,4,1],[2],[6,4,6,4,3],6]],
[[[2,2,6,6,4],[2,3],[3,1,6,6,5],[2,3],[4,5,6,6,5],12],[[6,4,5,2,2],[0],[6,2,3,2,2],[0],[6,1,1,1,2],0],[[1,2,1,2,2],8],[[1,3,3,3,5],[2,3,1],[1,3,3,3,4],[2,3,1],[6,3,3,3,4],2],[[1,6,3,6,3],[1,3],[1,6,4,6,3],[1,3],[5,6,5,6,5],6],[[1,3,6,2,2],[4,3],[6,6,1,2,2],[1,0],[6,6,5,5,1],4],[[4,3,5,3,1],[3,0,2],[4,2,5,3,6],10],[[3,5,1,3,2],[2,4,3],[3,4,1,3,2],9],[[6,4,3,3,6],[4,0],[6,2,5,6,6],[4,0,3],[6,4,3,6,6],5],[[4,5,3,3,5],[1,4],[2,5,1,3,5],[1,4],[3,5,6,6,5],1],[[4,5,4,2,5],[2,0],[4,4,4,1,5],[2,0,1],[4,4,4,6,1],3],[[1,1,6,3,3],[4,3],[2,5,2,3,3],[4,3],[6,4,4,3,3],11],[[3,3,3,1,1],[1,0,2],[3,3,3,6,1],[1,0,2],[3,3,3,1,1],7]],
[[[3,6,4,4,2],[4,0,3],[3,3,2,4,2],[4,0,3],[3,2,2,4,2],1],[[5,3,3,2,1],[2,1],[1,3,3,6,2],[2,1],[1,3,3,1,1],0],[[6,3,1,5,5],[3,4],[3,2,4,5,5],[4,2,1,0],[3,2,4,3,5],9],[[6,2,6,4,5],[0,2],[6,6,6,4,2],[0,2,1],[6,6,6,6,1],7],[[4,3,6,2,6],[4,2],[5,1,6,1,6],[4,2],[6,3,6,1,6],6],[[4,4,1,4,6],[0,1,3,4],[4,4,2,4,6],[0,1,3,4],[4,4,6,4,6],8],[[6,5,4,4,5],[4,1],[5,5,1,2,5],[4,1,0],[5,5,2,5,5],4],[[1,1,6,4,2],[2],[1,4,6,2,3],[0,3,4,1],[1,4,2,2,3],2],[[2,1,5,6,6],[3,4],[6,2,1,6,6],[3,4,0],[6,5,6,6,6],5],[[4,5,4,6,3],[4,0,1,3],[4,5,3,6,3],[4,0,1,3],[4,5,4,6,3],3],[[4,1,3,1,1],[4,3,1],[2,1,2,1,1],[4,3,1],[6,1,1,1,1],11],[[3,4,5,3,3],[4,1,2],[2,4,5,3,3],[4,1,2,0],[2,4,5,4,3],12],[[3,1,4,1,3],[4,2],[1,6,4,1,3],[4,2],[1,2,4,5,3],10]],
[[[5,2,5,6,2],[0,2],[5,1,5,3,5],[0,2,4],[5,5,5,1,5],7],[[5,5,4,6,3],[0,1],[5,5,1,4,1],[0,1],[5,5,4,2,4],3],[[2,1,1,3,1],[2,4,1],[2,1,1,6,1],[2,4,1],[5,1,1,1,1],0],[[1,3,1,1,4],[0,2,3],[1,4,1,1,1],[0,2,3,4],[1,1,1,1,1],11],[[6,4,5,2,2],[2,0],[6,6,5,4,2],[2,0,1],[6,6,5,2,5],12],[[4,2,1,1,2],[0],[4,6,5,6,2],[3,1],[5,6,6,6,3],6],[[2,4,5,4,4],[4,3,1],[3,4,3,4,4],[4,3,1],[3,4,4,4,4],2],[[1,4,4,1,6],[4],[6,3,6,3,6],8],[[2,4,5,3,2],[0,3,1,2],[2,4,5,3,5],[0,3,1,2],[2,4,5,3,5],9],[[2,4,3,3,2],[2,1,0],[2,4,3,1,3],[2,1,0,3],[2,4,3,1,3],1],[[2,6,5,1,2],[2],[4,5,5,3,2],[2,4,3,0],[4,5,5,3,2],4],[[2,1,2,3,5],[2,3],[2,5,2,3,3],[2,3,1],[4,5,2,3,2],10],[[4,1,1,2,3],[],[6,1,4,2,5],[0],[6,1,4,6,5],5]],
[[[6,6,2,3,3],[1,0],[6,6,6,6,1],[1,0,3,2],[6,6,6,6,2],7],[[6,4,4,6,6],[0,4,3],[6,2,4,6,6],[0,4,3],[6,1,6,6,6],6],[[6,2,2,2,3],[1,3,2],[1,2,2,2,2],[1,3,2,4],[4,2,2,2,2],1],[[1,2,3,2,6],[4],[3,5,4,3,6],[4],[4,1,4,1,6],0],[[5,6,1,3,6],[4,1],[2,6,1,5,6],[4,1],[6,6,1,5,6],5],[[3,1,4,3,5],[0,2,4],[3,5,4,1,5],[0,2,4],[3,5,4,2,5],9],[[2,1,3,2,1],[4,1,3,0],[2,1,4,2,1],[4,1,3,0],[2,1,4,2,1],3],[[2,1,6,4,3],[4],[5,6,3,4,3],[4,2],[1,6,3,6,3],2],[[6,3,4,2,6],[0,2,1,3],[6,3,4,2,1],[0,2,1,3],[6,3,4,2,3],12],[[4,3,3,3,6],[1,2,3],[1,3,3,3,1],8],[[5,4,1,3,3],[0],[5,5,6,4,2],[0,1],[5,5,4,4,3],4],[[1,1,1,6,3],[1,2,0],[1,1,1,5,2],[1,2,0],[1,1,1,6,4],11],[[5,6,4,4,4],[0,3,1],[5,6,2,4,3],10]],
[[[1,1,1,4,3],[2,0,1],[1,1,1,2,3],[2,0,1],[1,1,1,4,3],0],[[4,4,3,5,4],[1,0,4],[4,4,5,5,4],8],[[1,1,1,6,3],[3],[3,2,6,6,6],[3,4,2],[3,1,6,6,6],6],[[3,1,4,1,2],[3,4,0,2],[3,3,4,1,2],[3,4,0,2],[3,4,4,1,2],9],[[2,6,5,4,4],[3,4],[2,6,5,4,4],[3,4],[6,1,6,4,4],3],[[5,4,5,1,3],[2,0],[5,3,5,4,1],[2,0],[5,3,5,5,5],7],[[3,5,3,6,5],[4,1],[6,5,3,4,5],[4,1],[1,5,3,1,5],4],[[6,6,3,5,6],[0,4,1],[6,6,5,1,6],[0,4,1],[6,6,2,5,6],5],[[3,4,5,2,5],[3,0,1,4],[3,4,4,2,5],[3,0,1,4],[3,4,1,2,5],10],[[6,5,3,5,1],[3,1,0],[6,5,4,5,3],[3,1,0],[6,5,1,5,2],1],[[5,3,4,5,3],[1,4],[4,3,3,2,3],[1,4,2],[1,3,3,3,3],2],[[5,3,4,2,1],[0],[5,4,5,6,1],[0,3,2],[5,2,5,6,5],12],[[6,4,2,5,6],[4,0],[6,5,3,3,6],[4,0],[6,3,5,4,6],11]],
[[[1,2,2,6,2],[4,1,2],[4,2,2,3,2],[4,1,2],[5,2,2,2,2],1],[[1,6,6,6,3],[2,3,1],[2,6,6,6,6],[2,3,1,4],[2,6,6,6,6],7],[[2,2,2,6,5],[1,2,0],[2,2,2,2,5],[1,2,0,3],[2,2,2,2,3],0],[[5,6,5,4,3],[0,2,1],[5,6,5,4,2],[0,2,1],[5,6,5,1,2],4],[[3,6,1,1,4],[1],[5,6,4,4,3],[1,4,0,3],[5,6,4,4,3],9],[[2,5,2,5,3],[3,1],[4,5,5,5,5],[3,1,4,2],[4,5,5,5,5],6],[[1,3,3,5,3],[2,4,1],[2,3,3,2,3],8],[[4,5,3,5,1],[2,1,0],[4,5,3,6,5],[2,0,4,3],[4,6,3,6,5],12],[[2,2,2,3,1],[4,1,3],[5,2,4,3,1],10],[[1,4,5,5,5],[2,4,3],[6,4,5,5,5],[2,4,3],[2,5,5,5,5],2],[[6,2,2,5,6],[0,4],[6,1,2,3,6],[0,4],[6,6,3,4,6],5],[[3,1,6,3,5],[3,0],[3,3,2,3,6],[3,0,1],[3,3,2,3,3],11],[[5,6,4,6,3],[2],[2,4,4,4,4],[2,3,4,1],[3,4,4,4,4],3]],
[[[4,2,2,1,6],[1,2],[3,2,2,5,6],[1,2],[2,2,2,6,5],1],[[1,1,4,6,5],[3],[1,6,6,6,1],[3,1,2],[3,6,6,6,3],6],[[1,2,4,4,6],[4],[4,5,3,5,6],[4,2,3,0],[4,2,3,5,6],10],[[1,6,6,1,2],[2,1],[6,6,6,6,4],[2,1,3,0],[6,6,6,6,2],7],[[6,4,5,3,3],9],[[6,6,3,4,5],[0,1],[6,6,2,3,4],[0,1],[6,6,3,4,6],5],[[5,1,3,4,1],[1,4],[1,1,3,5,1],[1,4,0],[1,1,3,2,1],0],[[4,3,2,4,3],[1,4,0,3],[4,3,2,4,3],[1,4,0,3],[4,3,1,4,3],2],[[1,5,4,1,5],[1,4],[1,5,5,1,5],8],[[1,5,5,4,4],[1,2],[3,5,5,2,2],[1,2],[3,5,5,4,4],4],[[5,4,2,2,4],[4,1],[3,4,2,6,4],[4,1],[6,4,3,1,4],3],[[1,1,5,5,5],[2,4,3],[1,5,5,5,5],[2,4,3,1],[6,5,5,5,5],12],[[5,3,3,2,6],[2,1],[2,3,3,1,4],[2,1],[4,3,3,6,3],11]],
[[[1,4,4,6,1],[1,2],[5,4,4,5,4],8],[[6,6,6,6,1],[1,2,0,3],[6,6,6,6,4],[1,2,0,3],[6,6,6,6,3],7],[[6,4,2,1,5],[0],[6,3,4,1,4],[4,2],[6,3,4,4,4],3],[[1,2,2,2,5],[1,3,2],[4,2,2,2,2],[1,3,2,4],[3,2,2,2,2],1],[[4,3,3,6,3],[4,2,1],[1,3,3,5,3],[4,2,1],[6,3,3,1,3],2],[[1,6,5,3,3],[1],[2,6,1,6,3],[1,3],[6,6,2,6,4],6],[[1,3,2,2,6],[4],[6,2,3,2,6],[4,0],[6,2,4,3,6],5],[[5,4,5,5,5],[0,3,2,4],[5,1,5,5,5],[0,3,2,4],[5,2,5,5,5],4],[[3,4,5,6,6],[0,1,2,4],[3,4,5,1,6],[0,1,2,4],[3,4,5,4,6],9],[[4,6,2,2,4],[2,4,1],[5,6,2,2,4],[2,4,1,0],[5,6,2,2,4],12],[[3,3,4,2,5],[3,0,2,4],[3,1,4,2,5],10],[[2,4,6,4,4],[3,1,4],[3,4,1,4,4],[3,1,4],[1,4,3,4,4],0],[[3,5,1,6,6],[4,3],[1,6,3,6,6],[4,3,1],[5,6,4,6,6],11]],
[[[6,1,2,6,6],[4,0,3],[6,6,2,6,6],[4,0,3,1],[6,6,1,6,6],7],[[2,4,4,3,4],[1,2,4],[1,4,4,2,4],[1,2,4],[3,4,4,6,4],3],[[3,6,2,2,2],[2,4,3],[6,1,2,2,2],[2,4,3],[3,5,2,2,2],1],[[5,6,3,2,3],[2,4],[1,3,3,3,3],[2,4,3,1],[4,3,3,3,3],2],[[5,4,6,4,3],[4,3,0,2],[5,1,6,4,3],[4,3,0,2],[5,4,6,4,3],9],[[6,5,6,2,3],[2,0],[6,2,6,4,1],[2,0],[6,2,6,6,6],6],[[5,6,2,6,4],[1,3],[2,6,5,6,4],[1,3],[6,6,4,6,2],5],[[4,6,5,5,2],[4,0,3,1],[4,6,3,5,2],10],[[3,2,5,3,4],[2,3,0],[3,6,5,3,1],[2],[6,5,5,5,5],4],[[3,6,6,1,1],[2,1,4,3],[3,6,6,1,1],[2,1],[1,6,6,1,1],8],[[3,5,5,6,4],[1,2,3],[5,5,5,6,2],[1,2,3,0],[5,5,5,6,1],0],[[4,5,1,1,5],[1,4],[3,5,3,3,5],[0,2,3],[3,6,3,3,2],11],[[4,3,6,3,5],[4,2],[4,1,6,1,5],[4,2],[2,1,6,2,5],12]],
[[[2,6,5,2,2],[3,4,0],[2,4,6,2,2],[3,4,0],[2,3,4,2,2],1],[[2,3,4,1,5],10],[[3,4,3,4,2],[0,2,3,1],[3,4,3,4,6],[0,2,3,1],[3,4,3,4,5],2],[[6,6,5,6,3],[0,3,1],[6,6,3,6,5],[0,3,1],[6,6,1,6,2],5],[[5,4,5,5,5],[3,0,4,2],[5,2,5,5,5],[3,0,4,2],[5,2,5,5,5],4],[[3,6,3,1,5],[1],[6,6,6,3,4],[1,0,2],[6,6,6,1,6],7],[[6,5,3,1,3],[0],[6,2,1,1,1],[3,4,2],[5,4,1,1,1],0],[[3,6,4,2,6],[4,1],[2,6,6,5,6],[4,1,2,3],[5,6,6,5,6],6],[[1,4,5,5,1],[3,2,0,4],[1,5,5,5,1],8],[[6,1,3,2,3],[2,3],[3,4,3,2,4],[1,4],[6,4,1,2,4],3],[[6,3,5,2,6],[4,0,2],[6,1,5,3,6],[4,0,2],[6,2,5,4,6],12],[[5,4,3,4,6],9],[[4,5,4,1,6],[2,0],[4,3,4,5,3],[2,0],[4,1,4,4,6],11]],
[[[2,5,6,6,5],[3,2],[6,1,6,6,3],[3,2,0],[6,5,6,6,2],6],[[4,2,5,6,2],[1,4],[2,2,2,2,2],11],[[5,2,6,6,1],[3,2],[1,6,6,6,1],[3,2,1],[4,6,6,6,5],5],[[2,1,3,1,2],[0,4],[2,6,3,5,2],[0,4],[2,2,5,1,2],1],[[4,1,1,2,3],[2,3,4,0],[4,4,1,2,3],[2,3,4,0],[4,4,1,2,3],9],[[1,6,3,1,4],[1],[1,6,4,6,2],[1,3],[1,6,2,6,3],0],[[6,6,4,4,4],8],[[4,6,5,3,2],10],[[4,3,5,2,5],[4,2],[6,2,5,2,5],[4,2],[3,6,5,1,5],4],[[6,4,4,5,1],[0],[6,4,2,4,2],[1,3],[4,4,1,4,5],3],[[1,3,3,1,1],[1,2],[4,3,3,2,5],[1,2],[6,3,3,5,6],2],[[6,2,6,4,4],[2,0],[6,5,6,2,6],[2,0,4],[6,1,6,1,6],12],[[2,3,1,1,4],[],[4,5,1,6,6],[4,3],[2,5,4,6,6],7]],
[[[3,2,1,3,3],[0,4,3],[3,1,5,3,3],[0,4,3],[3,6,1,3,3],2],[[1,4,4,2,4],[1,4,2],[4,4,4,5,4],[1,4,2,0],[4,4,4,5,4],3],[[5,6,3,1,5],[0,4],[5,6,2,5,5],[0,4,3],[5,1,3,5,5],4],[[2,5,6,2,5],[1,4,0,3],[2,5,2,2,5],8],[[6,5,6,2,2],[2,0],[6,6,6,4,6],[2,0,4,1],[6,6,6,5,6],7],[[4,4,2,6,5],[3],[2,6,6,6,5],[3,1,2,4],[3,6,6,6,5],6],[[5,6,4,4,2],[1],[4,6,6,2,2],[1,2],[4,6,6,2,1],0],[[2,6,5,4,6],[1,4],[4,6,2,6,6],[1,4,3],[3,6,3,6,6],5],[[5,6,3,3,1],[1,0],[5,6,2,3,5],[1,0,4],[5,6,6,2,5],12],[[6,6,5,4,2],[3,4,2],[5,5,5,4,2],[3,4,2],[3,4,5,4,2],9],[[5,1,5,3,6],[2,0],[5,1,5,5,5],[2,0,3,4],[5,5,5,5,5],11],[[6,2,5,4,2],[4,2,3,0],[6,5,5,4,2],[4,2,3,0],[6,2,5,4,2],1],[[2,2,3,3,2],[4,2],[2,3,3,4,2],[4,2,3],[1,6,3,4,2],10]],
[[[3,1,5,4,2],10],[[3,1,6,6,1],[2,3],[1,2,6,6,2],[2,3],[2,6,6,6,2],8],[[5,4,1,1,3],[3,2],[1,6,1,1,2],[3,2,0],[1,6,1,1,4],0],[[2,2,6,5,2],[1,0,4],[2,2,4,3,2],[1,0,4],[2,2,4,4,2],1],[[3,4,3,3,5],[2,0,3],[3,4,3,3,6],[2,0,3],[3,2,3,3,4],2],[[6,4,3,3,3],[0],[6,2,2,3,5],[0],[6,1,3,6,6],6],[[1,4,2,6,2],[3],[4,3,5,6,1],9],[[2,2,6,4,6],[2,4],[2,6,6,1,6],[2,4,1],[4,6,6,6,6],7],[[2,6,3,2,1],[1],[6,6,5,5,6],12],[[4,3,6,5,6],[4,2],[1,3,6,2,6],[4,2],[5,4,6,4,6],5],[[5,4,2,5,6],[0,3],[5,3,6,5,3],[0,3],[5,5,5,5,5],11],[[1,5,1,2,4],[1],[6,5,4,6,3],[1],[3,5,4,2,3],3],[[2,3,3,4,4],[],[6,4,6,3,4],[],[2,3,3,5,4],4]],
[[[2,1,1,1,3],[2,1,3],[1,1,1,1,4],[2,1,3,0],[1,1,1,1,4],0],[[6,6,6,5,2],[0,1,2],[6,6,6,6,6],11],[[1,5,4,2,2],[3,4],[3,3,6,2,2],[3,4,1,0],[3,3,1,2,2],1],[[1,2,2,6,6],[3,4],[3,6,3,6,6],[3,4,1],[6,6,6,6,6],7],[[1,3,2,5,6],[4],[5,6,3,6,6],[4,1,3,0],[5,6,4,6,6],6],[[4,6,1,1,1],[1],[6,6,5,4,1],[1,0],[6,6,2,5,4],5],[[1,2,3,4,1],[0,1,2,3],[1,2,3,4,3],[0,1,2,3],[1,2,3,4,5],10],[[1,6,1,3,4],[1],[3,6,3,3,6],8],[[6,1,5,3,6],[0,4,2],[6,4,5,3,6],9],[[5,6,4,1,4],[2,4],[3,1,4,3,4],[3,0],[3,5,3,3,5],2],[[5,6,3,3,5],[4,0],[5,3,6,3,5],[4,0],[5,5,4,2,5],4],[[3,6,3,1,5],[1,4],[1,6,6,1,5],[1,4,2],[1,6,6,4,5],12],[[3,4,2,6,5],[1],[6,4,5,5,3],[1],[5,4,2,3,1],3]],
[[[1,4,1,3,3],[4,3],[3,1,5,3,3],[4,3,0],[3,1,1,3,3],8],[[5,2,1,5,6],[3,0],[5,1,1,5,2],[3,0],[5,5,3,5,2],4],[[1,3,4,2,2],[0,4,1,2],[1,3,4,2,2],[0,4,1,2],[1,3,4,5,2],10],[[2,2,2,1,3],[0,1,2],[2,2,2,4,4],[0,1,2],[2,2,2,2,5],1],[[3,1,4,6,5],9],[[1,3,1,2,5],[0,2],[1,3,1,1,2],[0,2,3],[1,3,1,1,5],0],[[6,5,4,5,6],[4,0],[6,3,1,3,6],[4,0],[6,5,4,2,6],12],[[3,6,2,6,5],[3,1],[1,6,5,6,5],[3,1],[6,6,5,6,5],6],[[3,5,6,6,5],[3,2],[1,6,6,6,2],[3,2,1],[6,6,6,6,6],11],[[2,4,4,1,1],[1,2],[6,4,4,2,2],[1,2],[4,4,4,3,2],3],[[6,5,4,6,4],[0,3],[6,6,6,6,2],[0,3,2,1],[6,6,6,6,6],7],[[3,1,6,1,5],[2],[2,3,6,6,6],[2,3,4],[4,4,6,6,6],5],[[4,2,4,2,2],[],[3,5,5,2,5],[0],[3,4,1,3,4],2]]
];

/**
 * Game finished test
 * @returns {Boolean}
 */
Logic.prototype.finished = function() {
	return this.round >= 13;
};

/**
 * Get winner index
 * @returns {Number}
 */
Logic.prototype.winner = function() {
	var max = -1;
	var result = -1;
	for(var i=0; i<this.players.length; i++) {
		var total = this.players[i].total();
		if (total > max) {
			max = total;
			result = i;
		} else if (total == max) {
			result = -1;
		}
	}
	return result;
};

/**
 * Get acting player
 * @returns {Object}
 */
Logic.prototype.player = function() {
	return this.players[this.active];
};

/**
 * Roll dices and randomize positions
 * @param values
 * @returns {Boolean}
 */
Logic.prototype.roll = function(values) {
	var result = false;
	if (this.rolls < 3) {
		if (this.rolls == 0) {
			this.holder = [];
		}
		result = [];
		var holder = this.holder;
		var matrix = [[],[],[],[],[]];
		$.each(this.dices, function(i, dice) {
			if (values) {
				dice.value = values[i];
			} else if (holder.indexOf(i) < 0) {
				dice.roll();
			}
			dice.angle = Math.floor(Math.random() * 6);
			do {
				dice.x = Math.floor(Math.random() * 4) + 1;
				dice.y = Math.floor(Math.random() * 5);
			} while (matrix[dice.x][dice.y]);
			matrix[dice.x][dice.y] = true;
			result.push(dice.value);
		});
		delete matrix;
		if (this.rolls++ > 0) {
			this.log.push([].concat(holder));
		}
		this.log.push([].concat(result));
	}
	return result;
};

/**
 * Hold and release a dice
 * @param index
 * @returns {Array}
 */
Logic.prototype.hold = function(index) {
	var pos = this.holder.indexOf(index);
	if (pos < 0) {
		this.holder.push(index);
	} else {
		this.holder.splice(pos, 1);
	}
	return this.holder;
};

/**
 * Calculate actual game score
 */
Logic.prototype.score = function() {
	var total = 0;
	var count = [0, 0, 0, 0, 0, 0, 0];
	var score = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
	$.each(this.dices, function(i) {
		var index = this.value - 1;
		total += this.value;
		count[index]++;
		score[index] += this.value;
	});
	var pair = false;
	var straight = 0;
	for (i in count) {
		var num = count[i];
		if (num != 0) straight++; else straight = 0;
		if (num == 2) pair = true;
		if (num >= 3) score[6] = total;
		if (num >= 4) score[7] = total;
		if (score[6] && pair) score[8] = 25;
		if (straight >= 4) score[9] = 30;
		if (straight >= 5) score[10] = 40;
		if (num >= 5) score[11] = 50;
	}
	score[12] = total;
	return score;
};

/**
 * Select and store score
 * @param index
 * @returns {Boolean}
 */
Logic.prototype.set = function(index) {
	var player = this.player();
	if (player.score[index] == -1) {
		var score = this.score();
		this.log.push(index);
		player.log.push([].concat(this.log));
		player.score[index] = score[index];
		this.next();
		return true;
	}
	return false;
};

/**
 * Change acting player
 */
Logic.prototype.next = function() {
	if (++this.active >= this.players.length) {
		this.active = 0;
		this.round++;
		var player = this.player();
		if (this.finished() && player.total() > 150) {
			Logic.ai.splice(this.index, 1, player.log);
			localStorage.setItem('AI', JSON.stringify(Logic.ai));
		}
	}
	this.rolls = 0;
	this.log = [];
};

/**
 * Playback acting player log
 * @param callback
 */
Logic.prototype.play = function(callback) {
	var self = this;
	this.player().play(function(values, holder) {
		self.roll(values);
		callback.call(this, holder);
	});
};

/**
 * Dice sprite
 */
function Sprite(canvas) {
	var ratio = window.devicePixelRatio || 1;
	this.ctx = canvas.getContext('2d');
	this.width = canvas.clientWidth * ratio;
	this.height = canvas.clientHeight * ratio;
	this.scale = this.width / 60;
	this.canvas = canvas;
	canvas.width = this.width;
	canvas.height = this.height;
	this.ctx.scale(this.scale, this.scale);
};

/**
 * Render cache
 */
Sprite.cache = {};

/**
 * Draw a dot
 * @param x
 * @param y
 */
Sprite.prototype.dot = function(x, y) {
	var c = this.ctx;
	c.beginPath();
	c.arc(x, y, 4, 0, 2 * Math.PI, false);
	c.fill();
};

/**
 * Draw dice part
 * @param x
 * @param y
 * @param a
 * @param v
 */
Sprite.prototype.dice = function(x, y, a, v) {
	var c = this.ctx;
	var o = navigator.appName == 'Opera';
    var g = c.createRadialGradient(-10, -10, 0, -10, -10, 60);
    g.addColorStop(0, "#cc0000");
    g.addColorStop(1, "#990000");
	c.save();
	c.translate(x, y);
	c.rotate(Math.PI / 12 * a);
	c.beginPath();
	c.moveTo(-15, 20);
	c.arcTo(o ? 15 : 20, 20, 20, 15, 5);
	c.lineTo(20, -15);
	c.arcTo(20, o ? -15 : -20, 15, -20, 5);
	c.lineTo(-15, -20);
	c.arcTo(o ? -15 : -20, -20, -20, -15, 5);
	c.lineTo(-20, 15);
	c.arcTo(-20, o ? 15 : 20, -15, 20, 5);
	if (v) {
		c.fillStyle = g;
		c.fill();
		c.fillStyle = "#ffffff";
		if (v==2 || v==4 || v==5 || v==6) 
			this.dot(-11, -11);
		if (v==3 || v==4 || v==5 || v==6) 
			this.dot(11, -11);
		if (v==6)
			this.dot(-11, 0);
		if (v==1 || v==3 || v==5) 
			this.dot(0, 0);
		if (v==6) 
			this.dot(11, 0);
		if (v==3 || v==4 || v==5 || v==6) 
			this.dot(-11, 11);
		if (v==2 || v==4 || v==5 || v==6) 
			this.dot(11, 11);
	} else {
		c.fillStyle = '#990000';
		c.shadowBlur = 5 * this.scale;
		c.shadowColor = '#000000';
		c.shadowOffsetX = 0;
		c.shadowOffsetY = 0;
		c.fill();
	}
	c.restore();
	
};

/**
 * Render dice
 * @param value
 * @param angle
 */
Sprite.prototype.paint = function(value, angle) {
	var id = 'a' + angle + 'v' + value;
	if (Sprite.cache[id]) {
		this.ctx.putImageData(Sprite.cache[id], 0, 0);
	} else {
		this.ctx.clearRect(0, 0, 60, 60);
		this.dice(30, 31, angle);
		this.dice(30, 28, angle, value);	
		Sprite.cache[id] = this.ctx.getImageData(0, 0, this.width, this.height);
	}
};

/**
 * Winner animation
 */
function Flakes(canvas) {
	var ratio = window.devicePixelRatio || 1;
	this.canvas = canvas;
	canvas.width = document.body.clientWidth * ratio;
	canvas.height = document.body.clientHeight * ratio;
	this.ctx = canvas.getContext('2d');
	this.colors = ['#ff0000','#00ffff','#ffff00','#ff00ff','#ffffff'];
	this.data = [];
	for (var i=0; i<canvas.width/20/ratio; i++) {
		this.data.push([
			Math.random() * canvas.width,
			Math.random() * canvas.height,
			Math.random() * 5 + 5,
			Math.floor(Math.random() * this.colors.length)
		]);
	}
	this.data.sort(function(a, b) {
		return a[2] < b[2] ? -1 : (a[2] > b[2] ? 1 : 0);
	});
}

/**
 * Draw flake
 * @param x
 * @param y
 * @param size
 * @param color
 */
Flakes.prototype.flake = function(x, y, size, color) {
	var c = this.ctx;
	c.save();
	c.translate(x, y);
	c.beginPath();
	c.moveTo(0, -size);
	c.lineTo(size, 0);
	c.lineTo(0, size);
	c.lineTo(-size, 0);
	c.moveTo(0, -size);
	c.fillStyle = color;
	c.fill();
	c.restore();
};

/**
 * Clear canvas
 */
Flakes.prototype.clear = function() {
	var c = this.ctx;
	c.clearRect(0, 0, c.canvas.width, c.canvas.height);
};

/**
 * Render flakes
 */
Flakes.prototype.paint = function() {
	this.clear();
	for (var i=0; i<this.data.length; i++) {
		var item = this.data[i];
		this.flake(item[0], item[1], item[2], this.colors[item[3]]);
		var y = this.data[i][1] + item[2] / 2;
		if (y > this.ctx.canvas.height) {
			y = -item[2];
		}
		this.data[i][1] = y;
	}
};

/**
 * Start animation
 */
Flakes.prototype.start = function() {
	for (var i=0; i<this.data.length; i++) {
		if (this.data[i][1] > 0) {
			this.data[i][1] = -this.data[i][1];
		}
	}
	this.run = true;
	this.anim();
};

/**
 * Stop animation
 */
Flakes.prototype.stop = function() {
	this.run = false;
	this.clear();
};

/**
 * Show the canvas
 */
Flakes.prototype.show = function() {
	this.canvas.style.display = 'block';
};

/**
 * Hide the canvas
 */
Flakes.prototype.hide = function() {
	this.canvas.style.display = 'none';
};

/**
 * Run animation
 */
Flakes.prototype.anim = function() {
	if (this.run) {
		var self = this;
		requestAnimFrame(function() {
			self.anim();
		});
		this.paint();
	}
};

/**
 * Sound player
 */
function Sound() {
	this.mute = false;
	this.elements = [];
	if (!navigator.platform.match(/^(iPad|iPod|iPhone)$/)) {
		var volume = 0.7;
		try {
			for (var i=0; i<5; i++) {
				var a = new Audio();
				a.src = Sound.src;
				a.volume = volume;
				a.load();
				this.elements.push(a);
				volume -= 0.15;
			}
		} catch(e) {
		}
	}
}

/**
 * Base64 encoded WAV data
 */
Sound.src = "data:audio/wav;base64,UklGRjgDAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRQDAACCAg75kTF9Rt3YuOBg6nWtgAxRKNjzEx1h9QHO5fME/KMUKCAx/xb0JPMU9f0ELAT0AZwMAwwaB5MIqAUt+fj0lglhIbwe0AvJ9nrmYfDnB1YQxAxxAPjxJfT9+XT4Mfo7+Lz1AvwSAGAAGwAb+qn2UPuE/6kCPARY/4/6yfmz+mMAAwnBCoIDh/zX+Gj7MAU0CroJewh4AMT3EPq8/zQCTwI0AcQCTwJ4/yD/GP/c/a/7+f0YAkz/k/s1/DP+zgBLAYoAdgB6APwBcwJNABcAKwC4ARUEvgJTAgsCGgPHBH4BmP6g/cf6y/oz/ioBXgMHAkj9Hvzl/2wB7v/p/nr78/kK/uj/Hf9+/l/9N/0s/af9BgDtAuECVgAb/m79lwAyAx4Bn/9yATECWQB2/2f/yv/fAOcBIQSMA60ArQFsANP9zQDaA/MCQQEaAIP/7P9e/8n9pf6WAKEBjwNRA4T8WPnx/8YCsgHZAin/uPvk/Rn/If9N/+gAjwEDAC7/2f6//yQAWwCeAW8AoP6e/uv+8v70/ssAxwHuAND/9/1//VL+MQGmA+kBvv5n/R7/1gH5AvUCGQJbAZH/J/3O//4CMAHc/s7/UwE1AnsCrQCk/zgAuABiAjECUQDFAA0AvABrAv0B9AHGAPX9hf0MAMcBMQDv/ff92P21/ZkAGwLG/wb/zQDHAXYAff4Z/mj/PAHLAUsBcgCK/8EAhwKkAdL/wv91AYcBcgCR/33+9P8TAoYCeQEi/nf8jP0z/8YBZQL3/xj/1P4w/ln/nAFxAYL/AgDGAHX/zf9RAncCqwAUAeEByAGCAoMBUQBIAID/+wD+AlsBJwCTAIUAmwDEAA8BVgC5//QBvQLH/4v+x/7v/i0A5P/h/6QBVgCe/kn/MQAoAicClf7B/eX+n/6n/+MAKQHbANn/iv/P/hb+Sf8tAU8CPgEJ/6r+cP9t/wH/TwDaAWYBsACRAEsB+QCT/58AJwFyAHYBugEdAvsByv+E/1gA7wDKAZUCMwJVAPP/wACkAKoArgBcADYBDAHI/2oAigDQ/w==";

/**
 * Sound support test
 */
Sound.prototype.enabled = function() {
	return this.elements.length > 0;
};

/**
 * Play click sound
 */
Sound.prototype.click = function() {
	if (!this.mute && this.enabled()) {
		this.elements[3].play();
	}
};

/**
 * Roll sound
 * @param timeout
 * @param num
 */
Sound.prototype.roll = function(timeout, num) {
	if (!this.mute && this.enabled()) {
		$.each(this.elements, function(i, sound) {
			if (i < num) {
				var t = i > 0 ? Math.floor(Math.random() * 70) * i + timeout : timeout;
				setTimeout(function() { sound.play(); }, t);		
			}
		});
	}
};

/**
 * Step by step tutorial
 */
function Help() {
	this.step = -1;
	this.steps = [$('help1'), $('help2'), $('help3')];
	this.set(0);
}

/**
 * Select tutorial 
 * @param step
 */
Help.prototype.set = function(step) {
	var result = this.step < step;
	if (result) {
		this.step = step;
		$.each(this.steps, function(i) {
			this.className = step != i ? 'hide' : '';
		});
	}
	return result;
};

/**
 * Game controller
 */
function Main() {
	this.help = new Help();
	this.logic = new Logic();
	this.sound = new Sound();
	if (this.sound.enabled()) {
		$('logo').onclick = function() {
			if (this.className == '') {
		 		self.sound.mute = false;
				this.className = 'sound';
			} else {
		 		self.sound.mute = true;
				this.className = '';
			}
		};
		$('logo').className = 'sound';
	}
	this.flakes = new Flakes($('flakes'), 50);
	this.flakes.hide();
	this.players = [$('player'), $('computer')];
	this.dices = [];
	var self = this;
	$.each($('dices', 'canvas'), function(i) {
		self.dices.push(new Sprite(this));
		this.onclick = function() {
			self.logic.hold(i);
			self.paint(true);
			this.className += ' top';
			this.blur();
			self.sound.click();
			return false;
		};
	});
	$.each($('player', 'dd'), function(i) {
		this.onclick = function() {
			if (this.className == 'set' && self.logic.set(i)) {
				self.play();
			}
			this.blur();
			self.help.set(4);
		};
	});
	$('flakes').onclick = function() {
		$('popup').className = 'hide';
		self.flakes.hide();
		self.flakes.stop();
		self.logic = new Logic();
		self.roll(function() {
			self.logic.roll();
			self.paint(true);
		});
	};
	$('roll').onclick = function() {
		if (this.className == 'button' && self.logic.roll()) {
			self.roll(function() {
				self.paint(true);
			});
			self.help.set(self.logic.rolls < 3 ? 1 : 2);
		}
		this.blur();
		return false;
	};
	var ctx = $('back').getContext('2d');
	var img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
	for (var i=img.data.length-1; i>=0; i=i-4) {
		img.data[i] = Math.floor(Math.random() * 15);
	}
	ctx.putImageData(img, 0, 0);
	for (var a=0; a<6; a++) {
		for (var v=1; v<=6; v++) {
			this.dices[a % 5].paint(v, a);
		}
	}
}

/**
 * Roll animation
 * @param callback
 */
Main.prototype.roll = function(callback) {
	var num = 0;
	var self = this;
	$.each(this.dices, function(i) {
		var className = this.canvas.className.replace(' top', '');
		if (self.logic.holder.indexOf(i) < 0) {
			className += ' hold';
			num++;
		}
		this.canvas.className = className;
	});
	setTimeout(function() {
		callback.call(self);
	}, 500);
	this.sound.roll(500, num);
};

/**
 * Render game screen
 * @param set
 */
Main.prototype.paint = function(set) {
	var logic = this.logic;
	$.each(this.dices, function(i) {
		var d = logic.dices[i];
		var h = logic.holder.indexOf(i);
		this.paint(d.value, h < 0 ? d.angle : 0);
		this.canvas.className = 'dice ' +  
			(h >= 0 ? 'h' + h : '') + 
			' x' + d.x + ' y' + d.y;
	});
	$.each(this.players, function(i) {
		var player = logic.players[i];
		var score = false;
		if (set && logic.active == i) {
			score = logic.score();
		}
		$.each($(this, 'dd'), function(i) {
			this.className = score && player.score[i] < 0 ? 'set' : '';
			this.innerHTML = player.score[i] < 0 
				? (score ? score[i] : '')
				: player.score[i];
		});
		$(this, 'dt', 1).innerHTML = player.total();
	});
	$('roll').className = logic.rolls < 3 && !logic.player().ai
		? 'button'
		: 'button disabled';
};

/**
 * Playback animation
 */
Main.prototype.play = function() {
	var logic = this.logic;
	if (logic.player().ai) {
		var self = this;
		logic.play(function(holder) {
			self.roll(function() {
				self.paint();
				if (typeof(holder) == 'object') {
					self.run(holder, self.play);
				} else {
					logic.set(holder);
					setTimeout(function() {
						self.play();
					}, 1000);
				}
			});
		});
	} else {
		this.paint();
		$.each(this.dices, function(i) {
			this.canvas.className += ' hold';
		});
		if (logic.finished()) {
			this.finish();
		}
	}
};

/**
 * Finish actions
 */
Main.prototype.finish = function() {
	var logic = this.logic;
	var winner = logic.winner();
	var player = logic.players[0];
	player.save(winner == 0);
	$('popup', 'h2', 0).innerHTML = winner >= 0 ? logic.players[winner].name + ' wins!' : 'Draw!';
	$('popup', 'span', 0).innerHTML = player.stat.wins;
	$('popup', 'span', 1).innerHTML = player.stat.played;
	$('popup', 'span', 2).innerHTML = player.stat.poker;
	$('popup', 'span', 3).innerHTML = player.stat.best;
	$('popup').className = '';
	$('roll').className += ' disabled';
	if (winner == 0) {
		this.flakes.start();
	}
	this.flakes.show();
};

/**
 * Playback dice select 
 * @param holder
 * @param callback
 */
Main.prototype.run = function(holder, callback) {
	var self = this;
	setTimeout(function() {
		var done = true;
		var i = 0;
		do {
			if ((self.logic.holder.indexOf(i) < 0) != (holder.indexOf(i) < 0)) {
				self.logic.hold(i);
				self.paint();
				self.dices[i].canvas.className += ' top';
				self.sound.click();
				done = false;
			}
		} while (done && ++i < 5)
		if (done) {
			callback.call(self);
		} else {
			self.run(holder, callback);
		}
	}, 500);
};

/**
 * Init game
 */
window.onload = function() {
	App = new Main();
	setTimeout(function() {
		window.scrollTo(1, 0);
	}, 1000);
};

})();
