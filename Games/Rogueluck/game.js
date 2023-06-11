// Images
var tilesetSwamp = new Image();
tilesetSwamp.src = 'img/tilesetSwamp.png';
var tilesetChaos = new Image();
tilesetChaos.src = 'img/tilesetChaos.png';
var imagePlayer = new Image();
imagePlayer.src = 'img/player.png';
var enemySmallMonster = new Image();
enemySmallMonster.src = 'img/smallMonster.png';
var enemyBigMonster = new Image();
enemyBigMonster.src = 'img/bigMonster.png';
var enemyFootman = new Image();
enemyFootman.src = 'img/enemyFootman.png';
var enemyScout = new Image();
enemyScout.src = 'img/enemyScout.png';

// Sounds
var sound_fire = new Audio;
sound_fire.src="snd/fire.wav";
sound_fire.volume = 0.15;
var sound_hit = new Audio;
sound_hit.src="snd/hit.wav";
sound_hit.volume = 0.25;

window.onload=function() {
var canvas = document.getElementById("game");
var c = canvas.getContext("2d");

// Config
var w = 640;
var h = 320;
var fps = 60;

var worldType;
var worldTypes = [tilesetChaos, tilesetSwamp];
var worldMonsters = [[0,1],[2,3]];
var luckBarColors = ["#ee1111","#e31c11","#d92711","#cd3211","#c23e11","#b74811","#ac5311","#a15f11","#956a11","#8b7511","#808011","#758b11","#699511","#5ea111","#53ac11","#49b711","#3dc211","#32cd11","#27d811","#1be411","#1be411"];

var stage;
var gameLoop;
var game;
function Game() {
	this.score = 0;
	this.stage = 1;
	this.time_max = 40;
	this.intro = 0;
	
	this.clear = function() {
		worldType = Math.floor((Math.random()*2));
		this.background = [];
		for(var i = 0; i <= w; i+=1) {
			this.background.push(Math.floor(Math.random()*4));
		}
		this.player = new Player();
		this.arrows = [];
		this.particles = [];
		this.enemies = [];
		this.texts = [];
		this.luck = 50;
		this.spawn_time = 100;
		this.time_left = this.time_max;
	}
	
	this.createParticle = function() {
		var particle = new Particle();
		this.particles.push(particle);
		return particle;		
	};
	
	this.createEnemy = function() {
		enemiesArray = worldMonsters[worldType];
		var enemy = new Enemy(enemiesArray[Math.floor((Math.random()*enemiesArray.length))]);
		this.enemies.push(enemy); 
		return enemy;		
	}; 
	
	this.createText = function(x, y, ttl, txt, font, color) {
		var text = new Text();
		text.x = x;
		text.y = y;
		text.ttl = ttl;
		text.text = txt;
		text.font = font;
		text.color = color;
		this.texts.push(text);
		return text;	
	};
	
	this.click = function() {
		if(stage.stage == 0) {
			sound_fire.play();
			this.intro += 1;
			if(this.intro > 2) {
				stage.stage = 2;
				game.time_left = 2;
			}
		} else if(stage.stage == 1) {
			sound_fire.pause();
			sound_fire.currentTime = 0;
			sound_fire.play();
			var arrow = new Arrow();
			this.arrows.push(arrow); 
			this.luck -= 10;
			if(this.luck < -100)
				this.luck = -100;
			this.player.frame = 1;
			this.player.frame_ttl = 5;
		} else if(stage.stage == 2) {
			
		} else if(stage.stage == 3) {
			gameInit();
			stage.stage = 2;
			game.time_left = 2;
		}
	}

	this.tick = function() {
		if(stage.stage == 0) {
			
		} else if(stage.stage == 1) {            
			this.time_left -= 1/60;
			if(this.time_left <= 0) {
				this.time_max += 2;
				this.clear();
				this.stage += 1;
				this.time_left = 2;
				stage.stage = 2;
			}
 
			if(this.luck < 100)
				this.luck += 0.04;
			else if(this.luck > 100)
				this.luck = 100;
			
			this.spawn_time -= 1;
			if(this.spawn_time <= 0) {
				var enemy = this.createEnemy();
				enemy.x = w;
				this.spawn_time = enemy.delay-enemy.delay*((this.stage)*4)/100;   
			}
		} else if(stage.stage == 2) {
			this.time_left -= 1/60; 
			if(this.time_left <= 0) {
				this.clear();
				stage.stage = 1;
			}
		}
	}
}
function Stage() {
	this.stage = 0;
	this.tick = function() {
		if(this.stage == 0) {
			c.fillStyle = "#000";
			c.fillRect(0, 0, w, h);
			if(game.intro == 0) {
				c.fillStyle = "#61210B";
				c.fillRect(220, 200, 200, 100);
				c.fillStyle = "#61210B";
				c.beginPath();
				c.moveTo(220, 198);
				c.lineTo(420, 198);
				c.lineTo(410, 180);
				c.lineTo(230, 180);
				c.closePath();
				c.fill();
				c.fillStyle = "#ddd";
				c.fillRect(310, 190, 20, 30);
				c.font="30px Consolas";
				c.fillStyle = "#ff0";
				c.textAlign = 'center';
				c.fillText("You found a chest!",320,150);
			} else if (game.intro == 1) {
				c.fillStyle = "#61210B";
				c.fillRect(220, 99, 200, 100);
				c.fillStyle = "#50100A";
				c.fillRect(225, 104, 190, 90);
				c.fillStyle = "#ddd";
				c.fillRect(310, 89, 20, 10);
				c.fillStyle = "#61210B";
				c.fillRect(220, 200, 200, 100);
				// Bow
				c.strokeStyle = "#fff";
				c.lineWidth = 2;
				c.beginPath();
				c.arc(300, 155, 40, 1.5 * Math.PI, 0.3 * Math.PI, false);
				c.stroke();
				c.beginPath();
				c.moveTo(300, 115); c.lineTo(324, 188);
				c.moveTo(290, 160); c.lineTo(350, 140);
				c.moveTo(350, 140); c.lineTo(345, 139);
				c.moveTo(350, 140); c.lineTo(347, 144);
				c.stroke();
			} else if (game.intro == 2) {
				c.font="24px Consolas";
				c.fillStyle = "#ff0";
				c.textAlign = 'left';
				c.fillText("Lucky Bow of Luckiness",175,100);
				c.fillStyle = "#fff";
				c.fillText("DMG: 25",175,160);
				c.font="12px Consolas";
				c.fillStyle = "#ff0";
				c.fillText("o generates positive chance percent over time",175,210);
				c.fillText("o each shot drains 10 positive chance percent",175,230);
				c.fillStyle = "#0f0";
				c.fillText("+ positive chance percent to deal a double damage",175,250);
				c.fillStyle = "#f00";
				c.fillText("- negative chance percent to miss a shot",175,270);
				// Bow
				c.strokeStyle = "#fff";
				c.lineWidth = 2;
				c.beginPath();
				c.arc(300, 155, 40, 1.5 * Math.PI, 0.3 * Math.PI, false);
				c.stroke();
				c.beginPath();
				c.moveTo(300, 115); c.lineTo(324, 188);
				c.moveTo(290, 160); c.lineTo(350, 140);
				c.moveTo(350, 140); c.lineTo(345, 139);
				c.moveTo(350, 140); c.lineTo(347, 144);
				c.stroke();
			}
		} else if(this.stage == 1) {
			// c.fillStyle = "#83c5d1";
			c.fillStyle = "#616";
			c.fillRect(0, 0, 640, 128);
			c.drawImage(worldTypes[worldType], 0, 16, 16, 16, 0, 0, 640, 128);
			for(var i = 0; i < w+32; i += 32) {
				c.drawImage(worldTypes[worldType], 0, 0, 16, 16, i, 128, 32, 32);
			}
			for(var i = 0; i < w+64; i += 64) {
				if(game.background[i] > 0)
					c.drawImage(worldTypes[worldType], 16+32*(game.background[i]-1), 0, 32, 32, i, 64, 64, 64);
			}
			// Luck bar
			c.fillStyle = luckBarColors[Math.floor(game.luck/10)+10];
			c.fillRect(0, 176, 640, 144);
			// Luck
			c.font="120px Consolas";
			c.fillStyle = "#fff";
			c.textAlign = 'center';
			c.fillText(Math.floor(game.luck)+"%",320,284);
			// Score
			c.font="24px Consolas";
			c.fillStyle = "#fff";
			c.textAlign = 'left';
			c.fillText("Score: "+game.score,5,20);
			// Time left
			c.fillStyle = "#111";
			c.fillRect(0, 160, 640, 16);
			c.fillStyle = "#fff";
			c.fillRect(1, 161, Math.ceil(638*(game.time_left/game.time_max)), 14);
			
		} else if(this.stage == 2) {
			c.fillStyle = "#000";
			c.fillRect(0, 0, 640, 320);
			c.font="30px Consolas";
			c.fillStyle = "#fff";
			c.textAlign = 'center';
			c.fillText("Wave "+game.stage,320,150);
		} else if(this.stage == 3) {
			c.fillStyle = "#000";
			c.fillRect(0, 0, 640, 320);
			c.font="30px Consolas";
			c.fillStyle = "#fff";
			c.textAlign = 'right';
			c.fillText("Score:",257,160);
			c.fillStyle = "#ff0";
			c.textAlign = 'left';
			c.fillText(game.score,267,160);
			c.fillStyle = "#fff";
			c.textAlign = 'center';
			c.fillText("Click to play again!",320,240);
		}
	}
}
function Player() {
	this.x = 10;
	this.y = 64;
	this.frame = 0;
	this.frames = [5, 5];
	this.frame_ttl = this.frames[this.frame]; 
	
	this.draw = function() { 
		c.drawImage(imagePlayer, 32*this.frame, 0, 32, 32, this.x, this.y, 64, 64);
	}
	
	this.tick = function() {
		if(this.frame_ttl <= 0) {
			this.frame = 0;
		} else {
			this.frame_ttl -= 1;
		}
		this.draw();
	}
}

function Enemy(type) {
	this.init = function(name, x, y, speed, hp, delay, sprite, frames, bar_offset) {
		this.name = name;
		this.x = x;
		this.y = y; 
		this.speed = speed;
		this.max_hp = hp;
		this.delay = delay;
		this.hp = hp;
		this.frame = 0;
		this.sprite = sprite;
		this.frames = frames;
		this.frame_ttl = this.frames[this.frame];
		this.bar_offset = bar_offset;
	}
	
	if(type == 0) 
		this.init("Zaptor", 640, 64, 1.0, 50, 300, enemySmallMonster, [5, 10, 5, 10], 17);
	else if (type == 1)
		this.init("Abominion", 640, 64, 0.3, 200, 900, enemyBigMonster, [30, 30, 30, 30], 0);
	else if (type == 2)
		this.init("Soldier", 640, 64, 0.5, 100, 450, enemyFootman, [10, 20, 10, 20], 0);
	else if (type == 3)
		this.init("Assassin", 640, 64, 1.0, 25, 150, enemyScout, [10, 10, 10, 10], 0);
				
	this.hit = function(arrow) {
		var particlesCount = 0;
		var random = Math.floor((Math.random()*101));
		if(arrow.luck >= 0) {
			if(random <= arrow.luck) {
				arrow.dmg *= 2;
				game.createText(this.x+10, this.y+this.bar_offset-14, 25, arrow.dmg+"!", "18px Consolas", "#f00");
			} else {
				game.createText(this.x+10, this.y+this.bar_offset-12, 25, arrow.dmg, "14px Consolas", "#f00");
			} 
		} else {
			if(random <= arrow.luck*-1) {
			   arrow.dmg = 0;
				game.createText(this.x+10, this.y+this.bar_offset-12, 25, "Miss!", "14px Consolas", "#fff");
			} else {
				game.createText(this.x+10, this.y+this.bar_offset-12, 25, arrow.dmg, "14px Consolas", "#f00");
			} 
		}
		this.hp -= arrow.dmg;
		if(arrow.dmg > 0) {
			sound_hit.play();
			particlesCount = Math.floor(arrow.dmg/2);			
		}
		if(this.hp <= 0) {
			game.score += Math.floor(this.max_hp + this.max_hp*((game.stage-1)*2/100))*10; 
			this.hp = 0;
			particlesCount = Math.floor(this.max_hp/2);				
		}
		for(var i = 0; i < particlesCount; i++) {
			game.createParticle().x = arrow.x;
		}
		return this.hp;
	}
				
	this.draw = function() {
		x = this.x;
		y = this.y;
		c.drawImage(this.sprite, 32*this.frame, 0, 32, 32, x, y, 64, 64);

		// Hp bar
		c.fillStyle = "#000";
		c.fillRect(x+2, y-5+this.bar_offset, 60, 5);
		c.fillStyle = "#f00";
		c.fillRect(x+3, y-4+this.bar_offset, 58*(this.hp/this.max_hp), 3);
		
		c.font="11px Consolas";
		c.textAlign = 'center';
		c.fillStyle="#fff";
		c.fillText(this.name,x+32,y-3+this.bar_offset);
	}
	
	this.tick = function() {
		this.frame_ttl -= 1;
		if(this.frame_ttl <= 0) {
			this.frame += 1;
			if(this.frame > this.frames.length-1) this.frame = 0;
			this.frame_ttl = this.frames[this.frame];
		}
		this.draw();
	}
}

function Arrow() {
	this.x = 40;
	this.y = 100;
	this.luck = game.luck;
	this.dmg = 25;
	
	this.draw = function(x, y) {
		c.beginPath();
		c.strokeStyle = "#000";
		c.lineWidth = 2;
		// Arrow
		c.moveTo(this.x+0, this.y+0); c.lineTo(this.x+15, this.y+0);
		c.moveTo(this.x+10, this.y-2); c.lineTo(this.x+15, this.y+0);
		c.moveTo(this.x+10, this.y+2); c.lineTo(this.x+15, this.y+0);
		c.stroke();
	}  

	this.tick = function(x, y) {
		this.x += 8;
		this.draw();
	}
			
}
function Particle() {
	this.x = 30;
	this.y = 100+Math.floor((Math.random()*2)-1);
	this.x_speed = 3.0+(Math.random()*2)-1;
	this.y_speed = -1.5+(Math.random()*2)-1;
	this.luck = game.luck;
	this.dmg = 25;
		
	this.draw = function(x, y) {
		c.fillStyle = "#f00";
		c.fillRect(this.x, this.y, 4, 4);
	}   
	
	this.tick = function() {
		this.x_speed -= 0.05;
		if(this.x_speed < 0) this.x_speed = 0;
		this.y_speed += 0.08;
		this.x += this.x_speed; 
		this.y += this.y_speed;		
		this.draw();
	}
}
function Text(x, y, ttl, text, font, color) {
	this.x = x;
	this.y = y;
	this.ttl = ttl;
	this.text = text;
	this.font = font;
	this.color = color;
	
	this.draw = function() {
		c.font=this.font;
		c.fillStyle=this.color;
		c.fillText(this.text,this.x,this.y);
	}
	
	this.tick = function() {
		this.y -= 0.3;
		
		this.ttl -= 1;
		if(this.ttl <= 0)
			return 1;
		
		this.draw();
	}
}

function gameInit() {
	game = new Game();
	canvas.onclick = function() {
		game.click();
	}
	function keyPressed (event){
		var keyCode = ('which' in event) ? event.which : event.keyCode;
		if(keyCode == 32)
			game.click();
	}
	document.onkeyup = keyPressed;
	stage = new Stage();
	
	game.clear();

	// Start game loop
	clearInterval(gameLoop);
	gameLoop = setInterval(drawGame, 1000/fps);
}

function drawGame() {
	canvas.width = canvas.width; // Clear canvas
	c.webkitImageSmoothingEnabled = false;
	c.mozImageSmoothingEnabled = false;
	c.imageSmoothingEnabled = false; //future
	
	game.tick();
	stage.tick();

	if(stage.stage == 1) {
		game.player.tick();

		for(var i = 0; i < game.enemies.length; i++) {
			game.enemies[i].x -= game.enemies[i].speed;
			game.enemies[i].tick();
			if(game.enemies[i].x < 40) {
				game.clear();
				stage.stage = 3;
			}
		}
		loop:
		for(var i = 0; i < game.arrows.length; i++) {
			game.arrows[i].tick();
			if(game.arrows[i].x > w) {
				game.arrows.splice(i, 1);
				i--;
				break;
			}
			for(var j = 0; j < game.enemies.length; j++) {
				if(game.arrows[i].x > game.enemies[j].x + 10) {
					if(game.enemies[j].hit(game.arrows[i]) == 0)
						game.enemies.splice(j, 1);
						j--;
					game.arrows.splice(i, 1);
					i--;
					break loop;
				}
			}
		} 
		for(var i = 0; i < game.particles.length; i++) {
			game.particles[i].tick();
			if(game.particles[i].x > w || game.particles[i].y > 128) {
				game.particles.splice(i, 1);
				i--;
			}
		}
		for(var i = 0; i < game.texts.length; i++) {
			if(game.texts[i].tick() == 1) {
				game.texts.splice(i, 1);
				i--;
			}
		}
	}
}
gameInit();
};