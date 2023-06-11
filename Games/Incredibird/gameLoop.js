try{
var r = (function() {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || function(callback) {
        window.setTimeout(callback, 1000 / 60,  1000 / 60);
    };
})();

function ArcadeAudio() {
  this.sounds = {};
}

ArcadeAudio.prototype.add = function( key, count, settings ) {
  this.sounds[ key ] = [];
  settings.forEach( function( elem, index ) {
    this.sounds[ key ].push( {
      tick: 0,
      count: count,
      pool: []
    } );
    for( var i = 0; i < count; i++ ) {
      var audio = new Audio();
      audio.src = jsfxr( elem );
      this.sounds[ key ][ index ].pool.push( audio );
    }
  }, this );
};

ArcadeAudio.prototype.play = function( key ) {
  if (!window.mute){
	  var sound = this.sounds[ key ];
	  var soundData = sound.length > 1 ? sound[ Math.floor( Math.random() * sound.length ) ] : sound[ 0 ];
	  soundData.pool[ soundData.tick ].play();
	  soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0;
  }
};

var aa = new ArcadeAudio();

aa.add( 'coin', 5,
  [
    [0,,0.0116,0.3061,0.432,0.4097,,,,,,0.5982,0.6732,,,,,,1,,,,,0.5]
  ]
);

aa.add( 'shoot', 4,
  [
    [3,0.4699,0.211,0.7699,0.4133,0.1018,,-0.18,,,,,,,,,,,1,,,,,0.5],
    [3,0.4285,0.171,0.7738,0.4352,0.1018,,-0.1522,-0.008,0.0491,,,0.0013,0.0333,-0.0433,,-0.0242,,1,0.0351,0.0193,0.0468,0.0409,0.5],
    [3,0.4122,0.0712,0.864,0.5086,0.1269,0.0632,-0.1067,0.0362,0.0066,0.0432,-0.0515,0.0472,,-0.0953,0.031,0.0369,-0.0206,1,0.0859,0.1004,0.0517,0.0036,0.5]
  ]
);

aa.add( 'hit', 5,
  [
    [3,,0.1302,0.5325,0.4565,0.7702,,-0.395,,,,-0.608,0.8726,,,,,,1,,,,,0.5]
    ,[3,0.0715,0.0928,0.4473,0.4449,0.8587,,-0.3921,0.0103,0.0067,0.0994,-0.6284,0.9041,0.0273,-0.0337,0.0569,0.09,-0.1048,1,0.0013,0.0967,,0.0768,0.5],
    [3,,0.2697,0.3528,0.4129,0.1622,,0.0306,,,,,,,,,0.209,-0.2744,1,,,,,0.5]
  ]
);

aa.add( 'death', 5,
  [
    [0,0.07,0.2,0.4199,0.25,0.4158,,-0.4261,,0.25,0.0599,-0.34,0.6899,0.28,-0.1,,-0.0199,-0.0199,1,-0.0277,,0.05,-0.0199,0.5]
  ]
);

aa.add( 'slowmo', 5,
  [
    [0,0.1489,0.0657,0.0741,0.8508,0.6885,,,-0.171,,0.079,-0.6692,0.8491,0.0362,-0.0111,,0.0048,0.1977,0.6197,0.3364,0.3787,,-0.0113,0.5]
  ]
);

aa.add("start", 1,
  [[0,,0.044,0.4721,0.4696,0.7453,,,,,,0.3999,0.5163,,,,,,1,,,,,0.5]]
  );

(screen.msLockOrientation && screen.msLockOrientation("landscape-primary"))||(screen.mozLockOrientation&& screen.mozLockOrientation("landscape-primary"));

/// SETUP ONCE
window.crisp = localStorage.getItem("crisp")=="true";
crispbutton.textContent = "Graphics: " + (window.crisp?"Low":"High");
window.mute = localStorage.getItem("mute") == "true";
mutebutton.textContent = "Sounds: " + (window.mute?"Off":"On");

window.smb = document.getElementById("32slowmo");
var driveVector= new Vector2d(0,0), topV = new Vector2d(30,24), mid = new Vector2d(30,73), bottom = new Vector2d(30,118), slots=[topV,mid,bottom];

var shoot = function(kind){
	if (parrot.isAlive)	{
		aa.play("shoot");
        world.addEntity(new kind(parrot.body.center,world), World.COLLIDE_ALL, World.CENTER)
        addPoints(-1);
    };
}
CMD = {
	//up
	87:function(){
		targetVector=targetVector==bottom?mid:topV;
	},
	//down
	83:function(){
		targetVector=targetVector==topV?mid:bottom
	},
	// fire
	72:function(){
		shoot(Projectiles.Fireball)
	},
	// water
	74:function(){
		shoot(Projectiles.Waterbolt)
	},
	// poison
	75:function(){
		shoot(Projectiles.Poisonball)
	},
	// lightning
	76:function(){
		shoot(Projectiles.Lightningbolt)
	},
	// slowmo
	32:function(){
		if (timefactor>0.25){
			aa.play('slowmo');
			able([window.smb],false);
			window.timeout = setTimeout(
				function(){
					CMD[7](window.smb)
				},10e3);
			timefactor=.25;
		}
	},
	100:function(){
		if (timefactor>0.25){
			aa.play('slowmo');
			able([window.smb],false);
			window.timeout = setTimeout(
				function(){
					CMD[7](window.smb)
				},10e3);
			timefactor=.25;
		}
	},
	// normalmo
	7:function(){
		timefactor=1;
		window.timeout = setTimeout(
			function(){
				able([window.smb],true)
		},10e3)}
},
command = function(id,caller){
	if (window.gamerunning){
	 if (caller && (!caller.classList || !caller.classList.contains("disabled"))) CMD[id](caller);
	}
	else startGame();
}

allButtons.forEach(function(button){
    button.onmousedown = button.ontouchstart = function(evt){
        command(parseInt(this.id),this);
        evt.preventDefault();
        evt.handled = true;
        return false;
    }
});

var ableAll = function(en){able(allButtons,en)};

window.pts = 0;
window.hiscore = parseInt(localStorage.getItem("hiscore")) || 0;
points.textContent = "High score: " + window.hiscore;
window.postfix = "";
var addPoints = function(pts){
    window.pts+=pts;
    switch(Math.floor(window.pts/50)){
        case 0: window.postfix = ""; break;
        case 1: window.postfix = "!"; break;
        case 2: window.postfix = "!!"; break;
        case 3: window.postfix = "!1"; break;
        case 4: window.postfix = ", holy sh1t!"; break;
        default: window.postfix = ", ERMAGHERD!!2"; break;
    }
    points.textContent = "Points: " + window.pts + postfix;
},
toggleVeil = function(onoff){
    veil.style.display = onoff?"block":"none";
},
switchGraphics = function(){
    window.crisp = !window.crisp;
    localStorage.setItem("crisp",window.crisp);
    crispbutton.textContent = "Graphics: " + (window.crisp?"Low":"High");
},
soundOnOff = function(){
    window.mute = !window.mute;
    localStorage.setItem("mute",window.cr);
    mutebutton.textContent = "Sounds: " + (window.mute?"Off":"On");	
},
readInputs = function(){
	for(var i  in readInputs.keys){
		if (+i && (i in CMD)){
			command(+i,readInputs.keys[i]);
			delete readInputs.keys[i];
		}
	}
},
gameOver = function(){
	window.gamerunning = false;
    window.hiscore = Math.max(window.hiscore,window.pts);
    localStorage.setItem("hiscore",window.hiscore);
    points.textContent = "High score: " + window.hiscore;
    animate = noop;
    loadGameEntities(loader);
    toggleVeil(true);
},
startGame = function(){
	window.gamerunning = true;
	aa.play("start");
    if(window.timeout) clearTimeout(window.timeout);
    addPoints(-window.pts);
    toggleVeil(false);
    ableAll(true);
    timefactor = 1;
    animate = function(time) {
	    parrot.body.speed[1] = (targetVector[1]-parrot.body.center[1])*Math.max(time,20)/2500;
	    if (Math.abs(parrot.body.speed[1])<PhysicsBody.EPSILON) parrot.body.speed[1]=0;
	    parrot.body.speed[0]= 0.05;
	    world.animate(time);
	    parrot.body.center[1] = clamp(parrot.body.center[1],topV[1],bottom[1]);
    };
};
startbutton.onclick = startGame;
crispbutton.onclick = switchGraphics;
readInputs.keys = {};
document.body.addEventListener("keydown", function (e) {
    readInputs.keys[e.keyCode] = true;
});
document.body.addEventListener("keyup", function (e) {
    readInputs.keys[e.keyCode] = false;
});

var s = new SpriteSheet("img/atlas2.png","atlas");
var parrot, world, atlas, ground,targetVector;
var tree,enemy;
/// SETUP EVERYTIME
var loadGameEntities = function(loader){
	atlas = loader.spriteSheets["atlas"];
	world = new World();
	ground = new GroundEntity(15,3000);
	world.groundElement=ground;
    parrot = new SpriteEntity(atlas,new Vector2d(0,73),16,12,[
        [16,12,6,400,[27,0]]
        ]);
	parrot.collideAction = function(other){
		if (other.kind<10){
			timefactor = Math.min(0.5,timefactor);
			aa.play("death");
			this.markForRemoval();
		}
	}
	parrot.onRemove = function(){	
		var chunks = new Explosion({
			colors: B,
			size: [1,5],
			count: [10,20],
			strength: .5,
			offset: this.body.speed.multiply(2),
			center: this.body.center,
			collisionType: World.COLLIDE_GROUND,
			zIndex: World.FOREGROUND
		}).fire(this.body.center, world);
		chunks = chunks.filter(function(EL){return EL.body.corner[0]>1.5});
		for(var i =0; i< chunks.length; i++){
			var chunk  = chunks[i];
			chunk.restitution = .9;
			chunk.tracer = new Explosion({
            gravityFactor: 0,
            collisionType: World.NO_COLLISION,
			life:[200,500],
			count:[0,2],
			strength: 0.01,
			size:1,
			shrink:0,
			colors: B.slice(2)
			});
			chunk.onAnimate = function(){
				this.tracer.fire(this.body.center,world);
			}
		}
		var checkDead = function(){
			setTimeout(function(){
				if(chunks.every(function(e){return !e.isAlive;})) gameOver();
				else checkDead();
			},100);
		}
		checkDead();
	}
	
	targetVector=mid;

    var treeCollideAction = function(other){
        var _thetree = this;
        if (other.kind == EntityKind.FIREBALL){
            if (!this.resources.length || this.resources.every(function(E){return E.kind != EntityKind.FIREEMITTER})){
                var fireEmitter = new Emitters.FireEmitter(_thetree,world);
                fireEmitter.params.size = [4,6];
                fireEmitter.params.strength*=1.5;
                _thetree.resources.push(fireEmitter);
                _thetree.life = 750;
            }
        }
    }
	
	var enemyCollideAction = function(other){
		if(other.kind-40==this.kind){
			this.markForRemoval();
		}
	};

	var addEnemyTo = function(x,y){
		enemy = new Target(atlas,[x,y[1]],randBetween(0,4,true));
        enemy.collideAction = enemyCollideAction;
		world.addEntity(enemy,World.COLLIDE_ALL, World.CENTER);
	};
	
	// populate enemigos
	for(var i =0, inc = 100, intensity=1; intensity<5;){
		switch(intensity){
			case 1:
				addEnemyTo(100+i,slots.random());
				if (i>=1000) intensity++;
			break;
			case 2:
				var p1 = randBetween(0,3,true);
				var p2 = (p1+1)%3;
				addEnemyTo(100+i,slots[p1]);
				addEnemyTo(100+i,slots[p2]);
				if (i>=2000) intensity++;
			break;
			case 3:
				addEnemyTo(100+i,slots[0]);
				addEnemyTo(100+i,slots[1]);
				addEnemyTo(100+i,slots[2]);
				inc = Math.max(10,inc-5);
				if (i>=3000) intensity++;
			break;
			default:
				var cx = new Collectible([i+300,mid[1]], 6, B[4], Bubble);
				cx.kind = -666;
			    cx.collideAction = function(other){
					aa.play("death");
					aa.play("hit");
			    	addPoints(50); other.markForRemoval();
			    };
			    world.addEntity(cx,World.NO_COLLISION, World.FOREGROUND);
			    intensity++;
		}
		
		i+=inc;
	}
	
	world.addEntity(parrot,World.COLLIDE_ALL, World.CENTER);
}

var loader = new SpriteSheetLoader(loadGameEntities);
loader.addItem(s);
loader.start(10);

// SETUP LOOP+FUNCTIONS
var animate = noop;

var ctx = miniCanvas.getContext("2d");
ctx.webkitImageSmoothingEnabled = false;
ctx.imageSmoothingEnabled = false;
translation = 0;
var render = function(time) {
	if (parrot && world){
	translation = -parrot.body.center[0]+30;
	ctx.save();
	ctx.tr(translation,0);
	if (timefactor>0.9 || window.crisp){
		ctx.fillStyle = P[0];
	} else {
		ctx.fillStyle = Ptrans;
	}
	ctx.fr(-translation,0,miniCanvas.width,miniCanvas.height-15);

	world.render(ctx,time);
	ctx.restore();
	}
};

var timefactor = 1;
var gameLoop = function(n) {
    
    n=n || (gameLoop.lastTime||0)+1000/60; 
    if (!gameLoop.lastTime) {
        gameLoop.lastTime = n;
        r(gameLoop);
        return;
    }
    var time = Math.min((n-gameLoop.lastTime),70)*timefactor;
    r(gameLoop);
    readInputs(time);
    animate(time);
    render(time);
    gameLoop.lastTime = n;
};

gameLoop();
} catch(except){
	alert(except);
}
