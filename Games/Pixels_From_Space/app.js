/**
	Pixels from outerspace
	JS13k games
	By Fabio Gianini
*/
var base=5;
function Game()
{
	this.canvas=document.getElementById("screen");
	this.ctx=this.canvas.getContext("2d");

	this.stageIndex=0;

	this.spawnBallTimeout=50;
	this.spawnBallTimeoutStep=0;

	this.stageCompleteTimeout=75;
	this.stageCompleteTimeoutStep=0;

	this.finishTimeout=100;
	this.finishTimeoutStep=0;

	this.playerReady=false;
	this.stageComplete=false;
	this.gameComplete=false;
	this.gameOver=false;
	this.finish=false;
	this.enemyiesReady=false;
	this.locked=true;

	this.dialogs=new Array();
	this.currentDialog="";
	this.dialogIndex=0;

	this.player;
	this.enemys=new Array();
	this.particles=new Array();
	this.renderer;
	this.camera;
	this.ball;

	this.glow=
	{
		max:20,
		min:5,
		value:5,
		fac:1,
	}

	this.state;

	this.score=0;

	this.perks=new Array();

	this.screen=
	{
		x:this.canvas.width,
		y:this.canvas.height
	};

	this.stages=new Array();

	this.stars=new Array();
	this.lines=new Image();
	this.lines.src="./assets/crt.png";
	this.controller;
	this.loadStages();
}
Game.prototype.loadStages=function()
{
	//this.stages.push({scouts:0, drones:0, destructors:0, mothers:1, dialogs:[]});
	this.stages.push({scouts:3, drones:0, destructors:0, mothers:0, dialogs:["A/W/S/D move         Enter to skip message", "Enemies incomming!", "Warning! Don't let   the ball behind you","One more thing       capt'n teerex rainbow", "Good luck"]});
	this.stages.push({scouts:0, drones:3, destructors:0, mothers:0, dialogs:["Drones incomming...", "GO!"]});
	this.stages.push({scouts:0, drones:0, destructors:2, mothers:0, dialogs:["Destructorships ahead", "Fireeeeeee!"]});
	this.stages.push({scouts:3, drones:4, destructors:1, mothers:0, dialogs:["Great. Now you are   ready for the        invasion"]});
	this.stages.push({scouts:3, drones:2, destructors:2, mothers:0, dialogs:["Enemies incomming"]});
	this.stages.push({scouts:3, drones:2, destructors:0, mothers:0, dialogs:[]});
	this.stages.push({scouts:0, drones:0, destructors:0, mothers:1, dialogs:["Mothership ahead"]});
	this.stages.push({scouts:2, drones:2, destructors:1, mothers:0, dialogs:[]});
	this.stages.push({scouts:2, drones:2, destructors:2, mothers:0, dialogs:[]});
	this.stages.push({scouts:2, drones:8, destructors:0, mothers:0, dialogs:[]});
	this.stages.push({scouts:2, drones:4, destructors:0, mothers:1, dialogs:[]});
	this.stages.push({scouts:4, drones:2, destructors:1, mothers:1, dialogs:[]});
	this.stages.push({scouts:2, drones:6, destructors:1, mothers:1, dialogs:["Beware!"]});
	//this.stages.push({scouts:0, drones:0, destructors:0, dialogs:[]});//to test the final screen ;-)

	this.load();
	loadListeners();
	this.controller=new Controller();
}
Game.prototype.load=function()
{

	var stage=this.stages[this.stageIndex];

	this.enemys=new Array();
	this.stars=new Array();
	this.particles=new Array();
	this.dialogs=new Array();
	this.perks=new Array();
	
	this.dialogIndex=0;
	this.locked=true;
	this.playerReady=false;
	this.gameOver=false;
	this.enemyiesReady=false;
	this.finish=false;
	this.gameComplete=false;
	this.stageComplete=false;
	this.finishTimeoutStep=0;
	this.stageCompleteTimeoutStep=0;
	this.spawnBallTimeoutStep=0;

	for(var i=0;i<stage.dialogs.length;i++)
	{
		this.dialogs.push(stage.dialogs[i]);
	}

	this.currentDialog=this.dialogs[this.dialogIndex];

	for(var i=0;i<stage.drones;i++)
	{
		this.enemys.push(new Drone((Math.random()*150)+i*20, -30, Math.random()*100+50));
	}
	for(var i=0;i<stage.scouts;i++)
	{
		this.enemys.push(new Scout((Math.random()*150)+i*20, -30, Math.random()*100+50));
	}
	for(var i=0;i<stage.destructors;i++)
	{
		this.enemys.push(new Destructor((Math.random()*150)+i*20, -30, Math.random()*100+50));
	}
	for(var i=0;i<stage.mothers;i++)
	{
		this.enemys.push(new Mothership((Math.random()*150)+i*20, -30, Math.random()*100+50));
	}
	
	for(var i=0;i<20; i++)
	{
		this.stars.push({x:Math.random()*this.screen.x, y:Math.random()*this.screen.y, v:Math.random()*5});
	}

	this.ball=new Ball(this.screen.x/2, this.screen.y/2);
	this.ball.v.x=Math.random()*-5;
	this.ball.v.y=Math.random()*-5-5;
	this.player=new Player(this.screen.x/2, this.screen.y-50, this.screen.y+50);	
	this.state="dialog";
	this.renderer=setInterval('game.render()', 1000/23);

}
Game.prototype.render=function()
{
	var _self=this;

	if(_self.state=="complete")
	{
		_self.finishTimeoutStep++;
		if(_self.finishTimeoutStep>=_self.finishTimeout)
			nextLevel();
		
	}
	//stage complete if there were no more enemies alive
	if(!_self.areEnemysAlive())
	{
		_self.stageCompleteTimeoutStep++;
		if(_self.stageCompleteTimeoutStep>_self.stageCompleteTimeout)
			_self.state="complete";
	}

	if(!(_self.player.life>0))
		_self.state="gameover"

	if(_self.state=="dialog")
	{
		if(_self.controller.keys["13"])
			{
				if(_self.dialogIndex<_self.dialogs.length-1)
				{
					_self.dialogIndex++;
					_self.currentDialog=_self.dialogs[_self.dialogIndex];
					_self.controller.keys["13"]=false;
				}
				else
					_self.state="intro";
			}
	}

	if(_self.state=="running")
	{
		for(var e in _self.enemys)
		{
			var enemy=_self.enemys[e];
			enemy.update();
			//kills enemy if it collides with the ball
			if(_self.collides(enemy.x, enemy.y, enemy.w, enemy.h, _self.ball.x-_self.ball.bounds.x/2, _self.ball.y-_self.ball.bounds.y/2, _self.ball.bounds.x, _self.ball.bounds.y))
			{
				enemy.life=-1;
			}
			//removes enemy if live < 0= is dead
			if(enemy.life<0)
			{
				_self.enemys.splice(e,1);
				_self.createExplosion(enemy.x, enemy.y);
				_self.createParticles(enemy.x, enemy.y, getColor(255,200,100,1), 10, 10);
			}
		}	

		_self.ball.onUpdate();
		_self.player.update();
	}

	if(_self.state=="intro")
	{
		//player intro animation
		if(_self.player.y>_self.player.startY)
		{
			_self.player.y-=5;
		}
		else
		{
			_self.state="running";
		}	
	}
	if(_self.state=="intro"||_self.state=="running")
	{
		//enemies intro animation
		for(var e in _self.enemys)
		{
			var enemy=_self.enemys[e];
			if(enemy.y<enemy.startY)
			{				
				enemy.y+=1;
			}
		}
	}

	//update particles
	for(var p in _self.particles)
	{
		var part=_self.particles[p];
		part.x+=part.vx;
		part.y+=part.vy;
		part.life--;
		part.color.a-=0.01;
		//remove particle
		if(!_self.isInScreen(part.x, part.y)||(part.color.a<0))
		{
			_self.particles.splice(p,1);
		}

		if(part.life<0)
		{
			_self.particles.splice(p,1);				
		}
	}
	//update stars
	for(var s in _self.stars)
	{
		var star=_self.stars[s];
		if(!_self.isInScreen(star.x+5, star.y+5))
		{
			star.x=Math.random()*_self.screen.x;
			star.y=Math.random()*_self.screen.y;
		}
		star.y+=star.v;
	}

	if(_self.glow.value<_self.glow.min||_self.glow.value>_self.glow.max)
	{
		_self.glow.fac*=-1;
	}
	_self.glow.value+=_self.glow.fac;


	_self.draw();
}

Game.prototype.draw=function()
{
	var _self=this;
	_self.ctx.clearRect(0,0,_self.screen.x, _self.screen.y);

	game.ctx.font ="bold 18pt Courier";
	

	for(var s in _self.stars)
	{
		var star=_self.stars[s];
		game.ctx.translate(star.x, star.y);
		game.ctx.shadowBlur = 10;
		game.ctx.fillStyle="rgba(255,255,255,1)";
		game.ctx.shadowColor = "rgba(255,255,255,1)";

		game.ctx.fillRect(0,0,4,2);
		game.ctx.fillRect(1,-1,2,4);
		
		game.ctx.translate(-(star.x), -(star.y));
		game.ctx.restore();
	}


	for(var p in _self.particles)
	{
		var part=_self.particles[p];
		game.ctx.save();
		game.ctx.translate(part.x+part.w/2, part.y+part.h/2);
		game.ctx.shadowBlur = 10;
		if(!part.color)
		{
			game.ctx.fillStyle="rgba(200,200,200,1)";
			game.ctx.shadowColor = "#00f";
		}
		else
		{
			game.ctx.fillStyle="rgba("+part.color.r+","+part.color.g+","+part.color.b+","+part.color.a+")";
			game.ctx.shadowColor = "rgba("+part.color.r+","+part.color.g+","+part.color.b+","+part.color.a+")";
		}
		game.ctx.fillRect(-part.w/2, -part.h/2, part.w, part.h);
		game.ctx.translate(-(part.x+part.w/2), -(part.y+part.h/2));
		game.ctx.restore();
	}
	//prints gameover string to screen
	if(_self.state=="gameover")
	{
		game.ctx.fillStyle = "#ff0000";
		game.ctx.fillText("Game Over", _self.screen.x/2-80, _self.screen.y/2);
		game.ctx.fillText("Your score "+_self.score, _self.screen.x/2-80, _self.screen.y/2+40);
	}
	//render enemies while running
	if(_self.state=="running"||_self.state=="intro")
	{
		for(var e in _self.enemys)
		{
			var enemy=_self.enemys[e];
			enemy.draw();
		}	

		_self.ball.onDraw();
		_self.player.draw();


		game.ctx.fillStyle="rgba(200,200,200,1)";
		game.ctx.shadowColor = "#ccc";
		game.ctx.fillRect(10,10, game.ball.bounds.x, game.ball.bounds.y);

		game.ctx.font ="bold 14pt Courier";
		game.ctx.fillStyle = "#333";
		game.ctx.fillText("x "+game.score, 15+game.ball.bounds.x, 10+game.ball.bounds.y);

		game.ctx.font ="bold 14pt Courier";
		game.ctx.fillStyle = "#333";
		game.ctx.fillText((game.stageIndex+1)+"/"+game.stages.length+" Stages", game.screen.x-130, 30);
	}
	//print string to screen when all stages were cleared
	if(_self.state=="gamecomplete")
	{
		
		//_self.createParticles(Math.random()*_self.screen.x, Math.random()*_self.screen.y, {r:Math.round(Math.random()*255), g:Math.round(Math.random()*255), b:Math.round(Math.random()*255), a:1}, 10, 10);
	
		game.ctx.fillStyle = "#ffff00";
		game.ctx.fillText("Game complete", _self.screen.x/2-120, _self.screen.y/2);

		game.ctx.shadowBlur=_self.glow.value;
		game.ctx.font ="bold 14pt Courier";
		game.ctx.fillText("Pixels from outerspace", _self.screen.x/2-120, _self.screen.y/2+20);
		game.ctx.fillText("Your score "+_self.score, _self.screen.x/2-120, _self.screen.y/2+40);
	}
	//print stage complete string
	if(_self.state=="complete")
	{
		
		_self.createParticles(Math.random()*_self.screen.x, Math.random()*_self.screen.y, {r:Math.round(Math.random()*255), g:Math.round(Math.random()*255), b:Math.round(Math.random()*255), a:1}, 10, 10);
		game.ctx.fillStyle = "#ffff00";
		game.ctx.shadowBlur=_self.glow.value;
		game.ctx.fillText("Stage complete", _self.screen.x/2-120, _self.screen.y/2);
	}


	if(_self.state=="dialog")
	{
		game.ctx.fillStyle="rgba(200,200,200,0.7)";
		game.ctx.shadowColor = "#ccc";
		game.ctx.shadowBlur=_self.glow.value;
		game.ctx.fillRect(10, _self.screen.y-100, _self.screen.x-20, _self.screen.y-(_self.screen.y-90));

		game.ctx.font ="bold 10pt Courier";
		game.ctx.fillStyle = "#333";
		game.ctx.shadowBlur=0;
		var parts=StringSplitter(_self.currentDialog, 21);
		for(var p in parts)
		{
			game.ctx.fillText(">> "+parts[p], 15, _self.screen.y-85+(p*12));
		}
	}


	game.ctx.shadowColor = "#000";
	game.ctx.shadowBlur = 5;
	game.ctx.drawImage(game.lines, 0,0, game.lines.width, game.lines.height, 0,0,game.screen.x, game.screen.y );
}
Game.prototype.areEnemysAlive=function()
{
	return(this.enemys.length>0);
}
Game.prototype.isInScreen=function(x,y)
{
	if(x>0&&x<this.screen.x&&
		y>0&&y<this.screen.y)
	{
		return true;
	}
	return false;
}
Game.prototype.collides=function(x,y,w,h, x1,y1,w1,h1)
{
	if(x+w>x1&&x<x1+w1&&y+h>y1&&y<y1+h1)
	{
		return true;
	}
	return false;
};
Game.prototype.createParticles=function(x, y, color, life, count, speed)
{
	var _speed=speed|10;
	for(i=0;i<360/(360/count);i++)
	{
		this.particles.push({x:x, y:y, vx:Math.cos(i)*(Math.random()*(_speed*2)-_speed), vy:Math.sin(i)*(Math.random()*(_speed*2)-_speed), w:5, h:5, color:color, life:life});

	}
}
Game.prototype.createExplosion=function(x,y)
{
	var speed=10;
	for(i=0;i<(360/12);i++)
	{
		this.particles.push({x:x, y:y, vx:Math.cos(i)*speed, vy:Math.sin(i)*speed, w:5, h:5, color:{r:200, g:200, b:200, a:1}, life:100});

	}
}
function getColor(r,g,b,a)
{
	return {r:r, g:g, b:b, a:a};
}
//*************************************************************************
function Mob()
{
	this.x;
	this.y;
}
Mob.prototype.update=function()
{

}
Mob.prototype.draw=function()
{

}
//*************************************************************************
function Player(x,y, y2)
{
	this.startY=y;
	this.x=x;
	this.y=y2;
	this.w=25;
	this.h=10;
	this.spread=4;
	this.lifes=3;
	this.alive=true;
	this.base=5;
	this.r=(Math.PI*2)/1;
	this.life=100;
	this.perks=new Array();
	
	var gunConf= new DoubleShoot();
	this.guns=gunConf.guns;

	this.tiles=
	[
		{x:this.base*0, y:this.base*0, w:this.base*5, h:this.base*1, color:getColor(255,255,255,1)},
		{x:this.base*0, y:this.base*-1, w:this.base*1, h:this.base*1, color:getColor(255,255,255,1)},
		{x:this.base*4, y:this.base*-1, w:this.base*1, h:this.base*1, color:getColor(255,255,255,1)},
		{x:this.base*2, y:this.base*-3, w:this.base*1, h:this.base*2, color:getColor(255,255,255,1)},
		{x:this.base*2, y:this.base*1, w:this.base*1, h:this.base*1, color:getColor(255,255,255,1)},
		{x:this.base*2, y:this.base*-1, w:this.base*1, h:this.base*1, color:getColor(200,200,255,1)},	
		{x:this.base*2, y:this.base*2, w:this.base*1, h:this.base*0.5, color:getColor(255,0,0,1)},
	];

	this.v={x:0,y:0};
}
//Player.prototype = Mob.prototype;
Player.prototype.draw=function()
{
	//player ship
	game.ctx.save();
	game.ctx.translate(this.x, this.y);	
	game.ctx.shadowBlur = 10;
	for(var i in this.tiles)
	{
		var t =this.tiles[i];
		game.ctx.fillStyle="rgba("+t.color.r+","+t.color.g+","+t.color.b+","+t.color.a+")";
		game.ctx.shadowColor = "rgba("+t.color.r+","+t.color.g+","+t.color.b+","+t.color.a+")";
		game.ctx.fillRect(t.x, t.y, t.w, t.h);
	}
	
	game.ctx.translate(-(this.x), -(this.y));
	game.ctx.restore();

	for(var g in this.guns)
	{
		var gun=this.guns[g];
		gun.draw();
	}

	game.ctx.shadowColor = "rgba(255,180,0,1)";
	game.ctx.shadowBlur = 10;
	

	game.ctx.fillStyle="rgba(255,255,0,1)";
	game.ctx.fillRect(game.screen.x-70, game.screen.y-25, (100/100)*50, 5)

	game.ctx.fillStyle="rgba(255,0,0,1)";
	game.ctx.fillRect(game.screen.x-70, game.screen.y-25, (this.life/100)*50, 5);
	;

	game.ctx.font ="8pt Courier";
	game.ctx.fillText("life "+this.life+"%", game.screen.x-150, game.screen.y-20)
}
Player.prototype.update=function()
{
	if(this.life<=0&&!this.alive)
	{
		//clearInterval(game.renderer);
		game.createExplosion(this.x+this.w/2, this.y)
		this.alive=false;
	}
	if(game.controller.keys["87"])
	{
		this.v.y=-5;
	}
	else
	{
		this.v.y=0;
	}
	if(game.controller.keys["83"])
	{
		this.v.y=5;
	}

	if(game.controller.keys["65"])
	{
		this.v.x=-5;
	}
	else if(game.controller.keys["68"])
	{
		this.v.x=5;
	}
	else
	{
		this.v.x=0;
	}

	
	game.player.shoot();
	

	if(game.controller.keys["32"])//space
	{
		for(var g in this.guns)
		{
			var gun=this.guns[g];
			if(gun.name=="Rocketlauncher")
				gun.shoot();
		}
	}

	//update guns
	for(var g in this.guns)
	{
		var gun=this.guns[g];
		this.guns[g].update();
	}

	if(game.isInScreen(this.x+this.w+this.v.x, this.y+this.h)&&game.isInScreen(this.x+this.v.x, this.y+this.h)
		&&game.isInScreen(this.x, this.y+this.h+this.v.y)&&game.isInScreen(this.x, this.y+this.v.y))
	{
		this.x+=this.v.x;	
		this.y+=this.v.y;	
	}
	else
	{
		if(game.stageComplete)
		{
			game.finish=true;
		}
	}
}

Player.prototype.shoot=function()
{
	for(var g in this.guns)
	{
		var gun=this.guns[g];
		gun.shoot(this.x+gun.x+(Math.random()*this.spread-this.spread/2), this.y+gun.y-this.h);
	}
}
//*************************************************************************
function Controller()
{
	this.keys=new Array();
	this.leftDown=false;
	this.rightDown=false;
}
Controller.prototype.keyDown=function(key)
{
	this.keys[key]=true;
}
Controller.prototype.keyUp=function(key)
{
	this.keys[key]=false;
}
Controller.prototype.getKeyCode = function(event) {
   event = event || window.event;
   return event.keyCode;
};
//*************************************************************************
function loadListeners()
{
	document.onkeydown=function(e)
	{
		game.controller.keyDown(game.controller.getKeyCode(e));
	}
	document.onkeyup=function(e)
	{
		game.controller.keyUp(game.controller.getKeyCode(e));
	}

	document.body.onmousedown = function(e) { 
		var type=0;
		if (navigator.appName=="Netscape")type=e.which;
		else type=event.button;

	 	if(type==1)
	 		game.controller.leftDown=true;
	 	if(type==2)
	 		game.controller.rightDown=true;
	}
	document.body.onmouseup = function(e) { 
		var type=0;
		if (navigator.appName=="Netscape")type=e.which;
		else type=event.button;

	 	if(type==1)
	 		game.controller.leftDown=false;
	 	if(type==2)
	 		game.controller.rightDown=false;

	}
}
//*************************************************************************
function Enemy()
{
	this.startY=500;
}
Enemy.prototype.update=function()
{
	for(var g in this.guns)
	{
		var gun=this.guns[g];
		gun.update();
	}

	
	if(!game.isInScreen(this.x+this.w, this.y)||!game.isInScreen(this.x+this.w, this.y))
	{
		this.vx=this.vx*-1;
	}

	this.shoot();
	this.x+=this.vx;
	this.y+=this.vy;
}
Enemy.prototype.draw=function()
{

	game.ctx.save();
	game.ctx.translate(this.x, this.y);

	game.ctx.shadowBlur = 10;
	for(var i in this.tiles)
	{
		var t =this.tiles[i];
		game.ctx.fillStyle="rgba("+t.color.r+","+t.color.g+","+t.color.b+","+t.color.a+")";
		game.ctx.shadowColor = "rgba("+t.color.r+","+t.color.g+","+t.color.b+","+t.color.a+")";
		
		game.ctx.fillRect(t.x, t.y, t.w, t.h);
	}


	game.ctx.translate(-(this.x), -(this.y));
	game.ctx.restore();

	for(var g in this.guns)
	{
		var gun=this.guns[g];
		gun.draw();
	}
}
Enemy.prototype.shoot=function()
{
	for(var g in this.guns)
	{
		var gun=this.guns[g];
		gun.shoot(this.x+gun.x+(Math.random()*this.spread-this.spread/2), this.y+gun.y-gun.h/2+this.h);
	}
}
//*************************************************************************************
Scout.prototype=new Enemy
Scout.prototype.constructor=Enemy;
function Scout(x,y, startY)
{
	this.startY=startY;
	this.x=x;
	this.y=y;
	this.vx=5;
	this.vy=0;
	this.w=20;
	this.h=5;	
	this.spread=4;
	this.canShoot=false;
	this.life=100;
	this.r=(Math.PI*2)/4;
	this.base=5;
	this.reload=Math.random()*100+10;
	//this.reload=1;

	
	this.guns=
	[
		new LaserGun(this.base*0,this.base*0,((Math.PI*2)/4), 2),
	];
	this.tiles=
	[
		{x:this.base*0, y:this.base*0, w:this.base*5, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*0, y:this.base*1, w:this.base*1, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*4, y:this.base*1, w:this.base*1, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*2, y:this.base*1, w:this.base*1, h:this.base*2, color:getColor(100,100,255,1)},
		{x:this.base*2, y:-this.base*1, w:this.base*1, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*2, y:this.base*1, w:this.base*1, h:this.base*1, color:getColor(255,100,100,1)},
		
	];

}
//*************************************************************************************
Destructor.prototype=new Enemy
Destructor.prototype.constructor=Enemy;
function Destructor(x,y, startY)
{
	this.startY=startY;
	this.x=x;
	this.y=y;
	this.vx=1;
	this.vy=0;
	this.w=40;
	this.h=10;	
	this.spread=4;
	this.canShoot=false;
	this.life=800;
	this.r=(Math.PI*2)/4;
	this.base=5;
	this.reload=Math.random()*20+10;
	//this.reload=1;
	this.dmg=20;

	this.guns=
	[
		new BomberGun(this.base*0,this.base*0,((Math.PI*2)/4), 2),
	];
	this.tiles=
	[
		{x:0, y:0, w:this.base*6, h:this.base*2, color:getColor(100,100,255,1)},
		{x:0, y:this.base*2, w:this.base, h:this.base*2, color:getColor(100,100,255,1)},
		{x:this.base*2, y:this.base*2, w:this.base*2, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*5, y:this.base*2, w:this.base, h:this.base*2, color:getColor(100,100,255,1)},
		{x:this.base, y:-this.base, w:this.base, h:this.base, color:getColor(100,100,255,1)},
		{x:this.base*4, y:-this.base, w:this.base, h:this.base, color:getColor(100,100,255,1)},
		{x:this.base*2+this.base/2, y:this.base*2, w:this.base, h:this.base, color:getColor(255,100,100,1)},
	];
}
//*************************************************************************************
Drone.prototype=new Enemy
Drone.prototype.constructor=Enemy;
function Drone(x,y, startY)
{
	this.startY=startY;
	this.x=x;
	this.y=y;
	this.vx=8;
	this.vy=0;
	this.w=40;
	this.h=10;	
	this.spread=4;
	this.canShoot=false;
	this.life=80;
	this.r=(Math.PI*2)/4;
	this.base=5;
	this.reload=Math.random()*100+10;
	//this.reload=1;
	this.dmg=5;

	this.guns=
	[
		new GetlingGun(this.base*0,this.base*0,((Math.PI*2)/4), 2),
	];
	this.tiles=
	[
		{x:this.base*0, y:this.base*0, w:this.base*5, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*1, y:this.base*1, w:this.base*1, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*3, y:this.base*1, w:this.base*1, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*1, y:-this.base*1, w:this.base*3, h:this.base*1, color:getColor(100,100,255,1)},

		{x:this.base*2+this.base/2, y:this.base*0, w:this.base, h:this.base, color:getColor(255,100,100,1)},
	];
}
//*************************************************************************************
Mothership.prototype=new Enemy
Mothership.prototype.constructor=Enemy;
function Mothership(x,y, startY)
{
	this.startY=startY;
	this.x=x;
	this.y=y;
	this.vx=0.6;
	this.vy=0;
	this.w=40;
	this.h=10;	
	this.spread=4;
	this.canShoot=false;
	this.life=1000;
	this.r=(Math.PI*2)/4;
	this.base=5;
	this.reload=Math.random()*20+10;
	//this.reload=1;
	this.dmg=20;

	this.guns=
	[
		new LaserGun(this.base*1,this.base*7,((Math.PI*2)/4), 2),
		new LaserGun(this.base*8,this.base*7,((Math.PI*2)/4), 2),
		new GetlingGun(this.base*2,this.base*4,((Math.PI*2)/4), 2),
		new GetlingGun(this.base*6,this.base*4,((Math.PI*2)/4), 2),
	];
	
	this.tiles=
	[

		{x:this.base*1, y:this.base*-0.5, w:this.base*3, h:this.base*0.5, color:getColor(255,50,50,1)},
		{x:this.base*5, y:this.base*-0.5, w:this.base*3, h:this.base*0.5, color:getColor(255,50,50,1)},

		{x:this.base*1, y:this.base*0, w:this.base*3, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*5, y:this.base*0, w:this.base*3, h:this.base*1, color:getColor(100,100,255,1)},

		{x:this.base*-1, y:this.base*1, w:this.base*11, h:this.base*2, color:getColor(100,100,255,1)},
		//guns
		{x:this.base*0, y:this.base*3, w:this.base*1, h:this.base*4, color:getColor(100,100,255,1)},
		{x:this.base*8, y:this.base*3, w:this.base*1, h:this.base*4, color:getColor(100,100,255,1)},
		
		{x:this.base*2, y:this.base*3, w:this.base*5, h:this.base*1, color:getColor(100,100,255,1)},
		//guns
		{x:this.base*2, y:this.base*4, w:this.base*1, h:this.base*2, color:getColor(100,100,255,1)},
		{x:this.base*6, y:this.base*4, w:this.base*1, h:this.base*2, color:getColor(100,100,255,1)},

		{x:this.base*4, y:this.base*4, w:this.base*1, h:this.base*1, color:getColor(100,100,255,1)},
		{x:this.base*4, y:this.base*4, w:this.base*1, h:this.base*1, color:getColor(255,200,200,1)},
	];
}
//*************************************************************************************
function GunBase()
{
	this.x;
	this.y;
	this.w;
	this.h;
	this.r;
	this.reloadSpeed;
	this.reloadStep;
	this.bullets=new Array();
	this.canShoot=true;
	this.spread=2;
	this.damage;
	this.color;
	this.PLAYER_TYP=1;
	this.ENEMY_TYP=2;
	this.typ;
	this.name;
}
GunBase.prototype.draw=function()
{
	for(var b in this.bullets)
	{
		var bullet = this.bullets[b];
		game.ctx.save();
		game.ctx.translate(bullet.x, bullet.y);
		game.ctx.shadowBlur = 20;
		

		game.ctx.fillStyle="rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.color.a+")";
		game.ctx.shadowColor = "rgba("+this.color.r+","+this.color.g+","+this.color.b+","+this.color.a+")";
		
		game.ctx.fillRect(0, 0, this.w, this.h);

		game.ctx.translate(-bullet.x, -bullet.y);
		game.ctx.restore();

	}
}
GunBase.prototype.update=function()
{
	if(this.reloadStep>=this.reloadSpeed&&!this.canShoot)
	{
		this.canShoot=true;
		this.reloadStep=0;
	}
	else
	{
		if(!this.canShoot)
			this.reloadStep++;
	}

	for(var b in this.bullets)
	{
		var bullet = this.bullets[b];
		if(bullet.active)
		{
			var rmv=true;
			bullet.x+=Math.cos(bullet.r)*bullet.v;
			bullet.y+=Math.sin(bullet.r)*bullet.v;

			for(var e in game.enemys)
			{
				var enemy = game.enemys[e];
				if(game.collides(bullet.x, bullet.y, this.w, this.h, enemy.x, enemy.y, enemy.w, enemy.h))
				{
					rmv=false;
					game.createParticles(bullet.x, bullet.y, getColor(255,50,0,1), 20, 10);
					game.createParticles(bullet.x, bullet.y, getColor(255,250,0,1), 5, 5);
					enemy.life-=this.damage;
					bullet.active=false;
				}
				if(game.collides(bullet.x, bullet.y, this.w, this.h, game.player.x, game.player.y, game.player.w, game.player.h))
				{
					game.createParticles(bullet.x, bullet.y, getColor(255,50,0,1), 20, 10);
					game.createParticles(bullet.x, bullet.y, getColor(255,250,0,1), 5, 5);
					rmv=false;
					game.player.life-=this.damage;
					bullet.active=false;
				}
			}

			if(!game.isInScreen(bullet.x, bullet.y))
			{
				bullet.active=false;
			}
		}
		else
		{
			this.bullets.splice(b,1);
		}
	}
}
GunBase.prototype.shoot=function(x,y)
{
	if(this.canShoot)
	{
		this.bullets.push({x:x, y:y, v:10, r:this.r, vx:0, vy:-5, active:true});
		//game.createParticles(x, y, {r:255, g:255, b:0, a:0.5}, 20, 5);
		this.canShoot=false;
	}
	
}
//*************************************************************************************
function LaserGun(x,y,r, gunTyp)
{
	this.x=x;
	this.y=y;
	this.w=2;
	this.h=8;
	this.r=r;
	this.reloadSpeed=Math.random()*15+15;
	this.reloadStep=0;
	this.bullets=new Array();
	this.canShoot=true;
	this.spread=2;
	this.damage=3;
	this.color=getColor(255,100,100,1);
	this.PLAYER_TYP=1;
	this.ENEMY_TYP=2;
	this.typ=gunTyp||this.ENEMY_TYP;
	this.name="LaserGun";

}
LaserGun.prototype=new GunBase();
/////////////////////////////////////////////////////
function BomberGun(x,y,r, gunTyp)
{
	this.x=x;
	this.y=y;
	this.w=8;
	this.h=8;
	this.r=r;
	this.reloadSpeed=Math.random()*15+20;
	this.reloadStep=0;
	this.bullets=new Array();
	this.canShoot=true;
	this.spread=2;
	this.damage=25;
	this.color=getColor(255,100,100,1);
	this.PLAYER_TYP=1;
	this.ENEMY_TYP=2;
	this.typ=gunTyp||this.ENEMY_TYP;
	this.name="BomberGun";

}
BomberGun.prototype=new GunBase();
/////////////////////////////////////////////////////
function GetlingGun(x,y,r, gunTyp)
{
	this.x=x;
	this.y=y;
	this.w=4;
	this.h=6;
	this.r=r;
	this.reloadSpeed=Math.random()*5+15;
	this.reloadStep=0;
	this.bullets=new Array();
	this.canShoot=true;
	this.spread=2;
	this.damage=1;
	this.color=getColor(255,100,100,1);
	this.PLAYER_TYP=1;
	this.ENEMY_TYP=2;
	this.typ=gunTyp||this.ENEMY_TYP;
	this.name="GetlingGun";

}
GetlingGun.prototype=new GunBase();
/////////////////////////////////////////////////////
function PlayerGun(x,y,r)
{
	this.x=x;
	this.y=y;
	this.w=4;
	this.h=6;
	this.r=r;
	this.reloadSpeed=8;
	this.reloadStep=0;
	this.bullets=new Array();
	this.canShoot=true;
	this.spread=2;
	this.damage=8;
	this.color=getColor(100,100,255,1);
	this.PLAYER_TYP=1;
	this.ENEMY_TYP=2;
	this.typ=this.PLAYER_TYP;
	this.name="PlayerGun";

}
PlayerGun.prototype=new GunBase();
/////////////////////////////////////////////////////
function TrippleShoot()
{
	this.guns=
	[

		new PlayerGun(base*0, base*0, ((Math.PI*2)/4)*2.8),
		new PlayerGun(base*2, base*0,((Math.PI*2)/4)*3),
		new PlayerGun(base*4, base*0,((Math.PI*2)/4)*3.2),
	]
}
function DoubleShoot()
{
	this.guns=
	[

		new PlayerGun(base*0, base*0, ((Math.PI*2)/4)*3),
		new PlayerGun(base*4, base*0,((Math.PI*2)/4)*3),
	]
}

/////////////////////////////////////////////////////
function Ball(x,y)
{
	this.spawn=
	{
		x:x,
		y:y
	}
	this.v=
	{
		x:0,
		y:0,
		max:1,
		dir:0,
	}
	this.bounds=
	{
		x:10,
		y:10,
	}
	this.direction=1;
	this.x=x;
	this.y=y;
	this.glow=
	{
		max:20,
		min:5,
		value:5,
		fac:1,
	}
}
Ball.prototype.onUpdate=function()
{
	this.x+=this.v.x;
	this.y+=this.v.y;

	

	if(this.y+this.v.y<=0)
	{
		this.v.y*=-1;
		this.v.dir=1;
		game.score++;

	}

	if(this.x-this.bounds.x/2<=0||this.x+this.bounds.x/2>=game.screen.x)
	{
		this.v.x*=-1;
	}

	if(this.glow.value<this.glow.min||this.glow.value>this.glow.max)
	{
		this.glow.fac*=-1;
	}
	this.glow.value+=this.glow.fac;

	if(!game.isInScreen(this.x, this.y+this.v.y, this.bounds.x, this.bounds.y))
	{
		game.score=0;
		this.create();
	}
	if(game.collides(this.x-this.bounds.x/2, this.y+this.v.y-this.bounds.y/2, this.bounds.x, this.bounds.y, game.player.x, game.player.y, game.player.w, game.player.h))
	{
		this.v.y*=-1;
		this.v.dir=-1;
	}

}
Ball.prototype.onDraw=function()
{
	game.ctx.translate((this.x-this.bounds.x/2), (this.y-this.bounds.y/2));

	game.ctx.fillStyle="rgba(200,200,200,1)";
	game.ctx.shadowColor = "rgba(200,200,200,1)";
	game.ctx.shadowBlur = this.glow.value;
		
	game.ctx.fillRect(0,0, this.bounds.x, this.bounds.y);

	game.ctx.translate(-(this.x-this.bounds.x/2), -(this.y-this.bounds.y/2))

}
Ball.prototype.create=function()
{
	this.x=this.spawn.x;
	this.y=this.spawn.y;
	
}


//*************************************************************************************
function StringSplitter(string, length)
{
	var parts=new Array();
	var str=string;

	while(str)
	{
		if (str.length < length) {
	        parts.push(str);
	        break;
    	}
    	else
    	{
    		parts.push(str.substr(0, length));
        	str = str.substr(length);
    	}
	}
	return parts;
}
//*************************************************************************************
var game;
function start()
{
	game=new Game();
}
function finish()
{
	clearInterval(game.renderer);
	start();
}
function nextLevel()
{
	if(game.stageIndex<game.stages.length-1)
	{
		clearInterval(game.renderer);
		game.stageIndex++;
		game.load();
	}
	else
	{
		//clearInterval(game.renderer);
		game.state="gamecomplete";
	}
}