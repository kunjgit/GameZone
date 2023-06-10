//var canvas, ctx;
var mCanvas;
var eCanvas,eCtx;
var gCanvas,gCtx;
var sCanvas,sCtx;
var lCanvas,lCtx;
var fxCanvas,fxCtx;
var eaCanvas,eaCtx;
var enemyCanvas,enemyCtx;
var bloodCanvas,bloodCtx;
var game_state = 0;
var ww,wh;
var level_data;
var player = {};
var keys = [];
var mouse = {x:0, y:0}
var mobs = [];
var view_distance;
var blood = [];
var level = 1;
var story_running = true;

window.requestAnimFrame = (function(){
  	return  window.requestAnimationFrame       ||
          	window.webkitRequestAnimationFrame ||
          	window.mozRequestAnimationFrame    ||
	        function( callback ){
	            window.setTimeout(callback, 1000 / 60);
	        };
})();
Math.radians = function(degrees) {
	return degrees * Math.PI / 180;
};

function toangle(x1,y1,x2,y2){var t =  Math.atan2(y2-y1,x2-x1)*180/Math.PI;t+=t<0?360:0;return t;}

function drawText(text, x, y, options){
	if(!options) var options = {};
	var ctx = options.ctx?options.ctx:gCtx;
	ctx.font = (options.textSize?options.textSize:'20')+'px monospace';
    ctx.textAlign = options.textAlign?options.textAlign:'center';
    ctx.fillStyle = options.textColor?options.textColor:'white';
    ctx.fillText(text, x, y+(options.textSize?parseInt(options.textSize):20));
}

function showStory(y){
	var lines = 10;
	if(y < -20-(30*lines) || story_running == false){
		start_game();
		return;
	}
	gCtx.clearRect(0, 0, ww, wh);
	gCtx.fillStyle = "black";
	gCtx.fillRect(0, 0, ww, wh);

	drawText("Press space to skip", ww-5, wh-15, {textSize: 10, textAlign: 'right'});
	
	drawText("On a summer night , after five years in prison", ww/2, y, {textSize: 20});
	drawText("for an uncommitted murder, Kazuki finnaly found a", ww/2, y+30, {textSize: 20});
	drawText("way to escape and return to his family.", ww/2, y+30*2, {textSize: 20});
	drawText("However, when he reached the courtyard", ww/2, y+30*3, {textSize: 20});
	drawText("he heard the alarm going off!", ww/2, y+30*4, {textSize: 20});
	drawText("Help Kazuki fight his way through", ww/2, y+30*6, {textSize: 20});
	drawText("security and stay out of the lights!", ww/2, y+30*7, {textSize: 20});
	setTimeout(function(){
		showStory(y-1.2);
	}, 1000/30);
}

function core_init(){
	gCanvas = document.getElementById("gui");
	gCtx = gCanvas.getContext('2d');

	ww = gCanvas.width = 800;
	wh = gCanvas.height = 480;

	console.log(gCanvas.width+' x '+gCanvas.height);
	console.log(window.innerWidth+' x '+window.innerHeight);

	gCtx.fillStyle = "black";
	gCtx.fillRect(0, 0, ww, wh);

	drawText('Kazuki\'s escape', ww/2, wh/2-100, {textSize: 60});
	drawText('Press space to start', ww/2, wh/2+40, {textSize: 20});

	window.onresize = function(){
		if(game_state === 0){
			gCtx.clearRect(0,0,gCanvas.width,gCanvas.height);
			gCtx.fillStyle = "black";
			gCtx.fillRect(0, 0, ww, wh);
			ww = gCanvas.width = window.innerWidth;
			wh = gCanvas.height = window.innerHeight;
			drawText('Kazuki\'s escape', ww/2, wh/2-100, {textSize: 60});
			drawText('Press space to start', ww/2, wh/2+40, {textSize: 20});
		}
	}
	document.onkeydown = function(event) {
		if(game_state === 0 && (event.keyCode==32 || event.which==32)){game_state = 3;showStory(wh);return;}
		if(game_state === 2 && (event.keyCode==32 || event.which==32)){game_state = 1;restart_game();return;}
		if(game_state === 3 && (event.keyCode==32 || event.which==32)){story_running = false;return;}
	    event = event || window.event;
	    keys[event.keyCode || event.which] = 1;
	};
	document.onkeyup = function(event) {
	    event = event || window.event;
	    keys[event.keyCode || event.which] = 0;
	};
	document.onmousemove = function(event){
		event = event || window.event;
		mouse.x = event.x || event.clientX;
		mouse.y = event.y || event.clientY;
	}
	document.onmousedown = function(){
		if(game_state === 1)
			attack(mouse);
	}

}

function spawn_mob(){
	if(mobs.length >= Math.floor( ((ww/wh*10)/2) ) ) return;//*(2+level/10)
	var s = 10;
	do{
		var t = Math.floor(Math.random()*mobs_data.length);
		var random_mob = mobs_data[t];
		
	}while(random_mob[7] > level && (s--) > 0);
	if(s<=0) return;
	s = 10;
	
	do{
		var mx = Math.random()*ww;
		var my = Math.random()*wh;
	}while(Math.sqrt( (mx-player.x)*(mx-player.x) + (my-player.y)*(my-player.y) ) < view_distance+116 && (s--) > 0);
	if(s==0) return;
	mobs.push(new Mob({
		x: mx,
		y: my,
		angle: Math.floor(Math.random()*360),
		rotate_speed: random_mob[1]*Math.floor((10+level)/10),
		movement_speed: random_mob[2]*Math.floor((10+level)/10),
		lantern: {
			angle: random_mob[3],
			distance: random_mob[4]
		},
		health: random_mob[5],
		name: random_mob[0],
		points: random_mob[6],
		img_type: 0
	}));
}

function spawn_more_mobs(){
	spawn_mob();
	setTimeout(spawn_more_mobs, 5000/(level));
}

function summonBoss(boss_level){
	do{
		var mx = Math.random()*ww;
		var my = Math.random()*wh;
	}while(Math.sqrt( (mx-player.x)*(mx-player.x) + (my-player.y)*(my-player.y) ) < view_distance+116);
	var boss_type  = Math.floor(Math.random()*bosses.length);
	var boss_class = bosses[ boss_type ];
    var name =  boss_class[0]+' '+boss_class[1][ Math.floor(Math.random()*boss_class[1].length) ];
    var boss = {
		x: mx,
		y: my,
		angle: Math.floor(Math.random()*360),
		rotate_speed: 2*( (10+boss_level)/10 ),
		movement_speed: 1.5*( (10+boss_level)/10 ),
		lantern: {
			angle: 80,
			distance: 50*((10+boss_level)/10 )
		},
		health: 30*((8+boss_level)/10),
		name: name,
		points: Math.floor(15*boss_level/10),
		boss: 1,
		img_type: boss_type+1
	};
	console.log(boss);
	mobs.push(new Mob(boss));
}

function attack(m){
	var a = toangle(player.x + document.getElementsByTagName('canvas')[0].offsetLeft, player.y + document.getElementsByTagName('canvas')[0].offsetTop, m.x, m.y);
	for(var i=0;i<mobs.length;i++){
		var ma = toangle(player.x, player.y, mobs[i].x, mobs[i].y);
		if( Math.sqrt( (player.x-mobs[i].x)*(player.x-mobs[i].x) + (player.y-mobs[i].y)*(player.y-mobs[i].y) )  <= 48 && ma > a - 30 && ma < a + 30 ){
			/*
			*/
			mobs[i].health -= player.damage*((10+level)/10);
			mobs[i].new_angle = a+180;
			mobs[i].angle_increment = Math.abs(mobs[i].rotate_speed)*( mobs[i].angle<mobs[i].new_angle?1:-1 )*2;
			mobs[i].state = 1;
			if(mobs[i].health <= 0){
				addBlood(mobs[i].x, mobs[i].y, 0, {dir: (a+180)} );
				player.kills++;
				player.score+=mobs[i].points;
				var new_level = Math.floor(player.kills/10)+1;
				if(new_level > level){
					summonBoss(new_level);
					level = new_level;
				}
				draw_gui();
				mobs.splice(i, 1);
			}else{
				var ra = Math.radians(Math.random()*360);
				var rd = (Math.random()*4+4);
				addBlood(mobs[i].x+Math.cos(ra)*rd, mobs[i].y+Math.sin(ra)*rd, 1, {radius: 1.5*Math.random()+1} );
					ra = Math.radians(Math.random()*360);
					rd = (Math.random()*4+4);
				addBlood(mobs[i].x+Math.cos(ra)*rd, mobs[i].y+Math.sin(ra)*rd, 1, {radius: 1.5*Math.random()+1} );
					ra = Math.radians(Math.random()*360);
					rd = (Math.random()*4+4);
				addBlood(mobs[i].x+Math.cos(ra)*rd, mobs[i].y+Math.sin(ra)*rd, 1, {radius: 1.5*Math.random()+1} );
					ra = Math.radians(Math.random()*360);
					rd = (Math.random()*4+4);
				addBlood(mobs[i].x+Math.cos(ra)*rd, mobs[i].y+Math.sin(ra)*rd, 1, {radius: 1.5*Math.random()+1} );
			}
		}
	}
}

function addBlood(x, y, type, options){
	var tmp = {
		x: x,
		y: y,
		type: type,
		opacity: 1
	}
	if(type === 0){
		tmp.dir = options.dir;
	}else if(type === 1){
		tmp.radius = options.radius;
	}
	blood.push(tmp);
}

function drawBlood(ctx, x, y, dir, rad){
	ctx.beginPath();
	ctx.arc(x, y, rad*0.25, 0, Math.PI*2, false);
	ctx.arc(x-3, y+3, rad*0.25, 0, Math.PI*2, false);
	ctx.arc(x-4, y, rad*0.25, 0, Math.PI*2, false);
	var mx = x+Math.cos(Math.radians(dir))*(rad*0.25);
	var my = y+Math.sin(Math.radians(dir))*(rad*0.25);
      
	for(var i=0;i<15;i++){
		var rdir = Math.random()*80-40;
		var rlen = Math.random()*rad+rad*0.5;
		var roffset = Math.random()*(rad/3)-(rad/6);
		ctx.moveTo(mx, my + roffset);
		ctx.lineTo(mx + Math.cos( Math.radians(dir+rdir) )*rlen, my + Math.sin( Math.radians(dir+rdir) )*rlen);
	}
	ctx.closePath();  
	ctx.strokeStyle="red";
	ctx.fillStyle="red";
	ctx.stroke();
	ctx.fill();
}
function drawHealthbar(ctx, x, y, per, width, thickness){
	ctx.beginPath();
	ctx.rect(x-width/2, y, width*(per/100), thickness);
	if(per > 63){
	  ctx.fillStyle="green"
	}else if(per > 37){
	  ctx.fillStyle="gold"
	}else if(per > 13){
	ctx.fillStyle="orange";
	}else{
	ctx.fillStyle="red";
	}
	ctx.closePath();
	ctx.fill();
}
function drawChar(ctx, x, y, s, f, enemy){
	if(enemy){
		ctx.fillStyle="grey";
		ctx.strokeStyle="black";
		ctx.fillRect(x+6, y-12, 4, 14);
		ctx.rect(x+6, y-12, 4, 14)
		ctx.strokeStyle="black";
		ctx.stroke();
	}else{
		drawEllipseByCenter(ctx, x+8, y-5, 4, 20,'black','lightgrey');
 	}
 	drawEllipseByCenter(ctx, x, y, 26, 14, s, f);//'#364701','#bada55'//25,13
 	drawEllipseByCenter(ctx, x, y, 10, 10,'black','#FFDFC4');
}

function drawEllipseByCenter(ctx, cx, cy, w, h, s, f) {
  	drawEllipse(ctx, cx - w/2.0, cy - h/2.0, w, h, s, f);
}

function drawEllipse(ctx, x, y, w, h, s, f) {
  	var kappa = .5522848,
      	ox = (w / 2) * kappa, // control point offset horizontal
      	oy = (h / 2) * kappa, // control point offset vertical
	    xe = x + w,           // x-end
	    ye = y + h,           // y-end
	    xm = x + w / 2,       // x-middle
	    ym = y + h / 2;       // y-middle

  	ctx.beginPath();
  	ctx.moveTo(x, ym);
  	ctx.bezierCurveTo(x, ym - oy, xm - ox, y, xm, y);
  	ctx.bezierCurveTo(xm + ox, y, xe, ym - oy, xe, ym);
  	ctx.bezierCurveTo(xe, ym + oy, xm + ox, ye, xm, ye);
  	ctx.bezierCurveTo(xm - ox, ye, x, ym + oy, x, ym);
  	ctx.fillStyle=f;
  	ctx.fill();
  	ctx.strokeStyle=s;
  	ctx.stroke();
}

function start_game(){
	game_state = 1;
	drawText('Generating level ...', gCanvas.width/2, gCanvas.height/2+33, {textSize: 20});
	//generate level
	level_data = generate_level(ww, wh);

	console.log(level_data);

	mCanvas = document.getElementById('map');
	mCanvas.width = ww;
	mCanvas.height = wh;
	mCtx = mCanvas.getContext('2d');
	mCtx.putImageData(level_data.map,0,0);

	delete level_data.map;

	eCanvas = document.getElementById('entities');
	eCanvas.width = ww;
	eCanvas.height = wh;
	eCtx = eCanvas.getContext('2d');
	sCanvas = document.getElementById('shadow');
	sCanvas.width = ww;
	sCanvas.height = wh;
	sCtx = sCanvas.getContext('2d');
	lCanvas = document.getElementById('lights');
	lCanvas.width = ww;
	lCanvas.height = wh;
	lCtx = lCanvas.getContext('2d');
	fxCanvas = document.getElementById('fx');
	fxCanvas.width = ww;
	fxCanvas.height = wh;
	fxCtx = fxCanvas.getContext('2d');
	eaCanvas = document.getElementById('entities_addons');
	eaCanvas.width = ww;
	eaCanvas.height = wh;
	eaCtx = eaCanvas.getContext('2d');

	enemyCanvas = document.createElement('canvas');
	enemyCanvas.width = 26*(bosses.length+1);
	enemyCanvas.height = 28;
	enemyCtx = enemyCanvas.getContext('2d');
	drawChar(enemyCtx, 13, 14, 'black', 'darkred', true);
	for(var i=1;i<=bosses.length;i++){
		drawChar(enemyCtx, 13+13*i*2, 14, 'black', bosses[(i-1)][2], true);
	}

	bloodCanvas = document.createElement('canvas');
	bloodCanvas.width = 64;
	bloodCanvas.height = 32;
	bloodCtx = bloodCanvas.getContext('2d');
	drawBlood(bloodCtx, 16, 16, 0, 16);

	//shadow transition distance
	view_distance = ww/4-player.kills*5;
	view_distance = view_distance > 125?view_distance:125;

	//add player
	player.x = ww/2;
	player.y = wh/2;
	player.angle = 0;
	player.kills = 0;
	player.speed = 3;
	player.running = 1;
	player.damage = 5;
	player.score = 0;

	//add mobs
	for(var i=0;i<8;i++) spawn_mob();

	spawn_more_mobs();

	//render gui
	draw_gui();
	//start game loop
	loop();
}
function restart_game(){
	 eCtx.clearRect(0, 0, ww, wh);
	 sCtx.clearRect(0, 0, ww, wh);
	 lCtx.clearRect(0, 0, ww, wh);
	eaCtx.clearRect(0, 0, ww, wh);
	fxCtx.clearRect(0, 0, ww, wh);
	mobs = [];
	blood = [];
	level = 1;
	start_game();
}
function end_game(){
	game_state = 2;
	drawText('Game Over', ww/2, wh/2-100, {textSize: 40});
	drawText('Your score: '+player.score+' (kills: '+player.kills+')', ww/2, wh/2-50, {textSize: 20});
	drawText('Press space to restart the game', ww/2, wh/2-10, {textSize: 20});
}

function castLight(direction, radius, distance, x, y){ //http://codepen.io/mariandev/pen/CpvtE
    var grad = lCtx.createRadialGradient(x, y, 0, x, y, distance);
    grad.addColorStop(0, "rgba(240,230,140,1)");
    grad.addColorStop(1, "rgba(240,230,140,0)");
    lCtx.fillStyle = grad;
    lCtx.beginPath();
    lCtx.arc(x, y, distance, Math.radians(direction-radius/2),  Math.radians(direction+radius/2), false);
    lCtx.moveTo(x, y);
    lCtx.lineTo(x + Math.cos( Math.radians(direction-radius/2) )*distance, y + Math.sin( Math.radians(direction-radius/2) )*distance);
    lCtx.lineTo(x + Math.cos( Math.radians(direction+radius/2) )*distance, y + Math.sin( Math.radians(direction+radius/2) )*distance); 
    lCtx.lineTo(x, y);
    lCtx.closePath();
    lCtx.fill();
}

function draw_gui(){
	gCtx.clearRect(0, 0, ww, wh);
	drawText('Level: '+level,20,wh-70,{textSize: 20,textAlign: 'left'});
	drawText('Score: '+player.score,20,wh-40,{textSize: 20,textAlign: 'left'});
}
function tick(){

	//clear canvases
	 eCtx.clearRect(0, 0, ww, wh);
	 sCtx.clearRect(0, 0, ww, wh);
	 lCtx.clearRect(0, 0, ww, wh);
	eaCtx.clearRect(0, 0, ww, wh);
	fxCtx.clearRect(0, 0, ww, wh);

	if(keys[87]) player.y-=player.speed*player.running*( (10+level)/15 );
	if(keys[65]) player.x-=player.speed*player.running*( (10+level)/15 );
	if(keys[83]) player.y+=player.speed*player.running*( (10+level)/15 );
	if(keys[68]) player.x+=player.speed*player.running*( (10+level)/15 );
	//if(keys[16]) player.running = 1.5;
	//else player.running = 1;

	if(player.x-16 < 0) player.x = 16;
	if(player.y-16 < 0) player.y = 16;
	if(player.x+16 > ww) player.x = ww-16;
	if(player.y+16 > wh) player.y = wh-16;

	
	player.angle = Math.radians(toangle(player.x + document.getElementsByTagName('canvas')[0].offsetLeft, player.y + document.getElementsByTagName('canvas')[0].offsetTop, mouse.x, mouse.y));

	//render fx
	for(var i=0;i<blood.length;i++){
		if(blood[i].type === 0){
			fxCtx.save();
			fxCtx.globalAlpha = blood[i].opacity;
			fxCtx.translate(blood[i].x, blood[i].y);
			fxCtx.rotate(Math.radians(blood[i].dir));
			fxCtx.drawImage(bloodCanvas, -16, -16, 64, 32);
			fxCtx.restore();
		}else if(blood[i].type === 1){
			fxCtx.beginPath();
			fxCtx.globalAlpha = blood[i].opacity;
		    fxCtx.arc(blood[i].x, blood[i].y, blood[i].radius, 0, Math.PI*2, false);
		    fxCtx.closePath();
		    fxCtx.fillStyle="red";
		    fxCtx.fill();
		}
		blood[i].opacity -= 0.005;
		if(blood[i].opacity <= 0)
				blood.splice(i--, 1);
	}
	
	
	//render player

	eCtx.save();
	eCtx.translate(player.x, player.y);
	eCtx.rotate(player.angle+Math.PI/2);
	drawChar(eCtx, 0, 0, '#0066FF', '#6699FF');
	eCtx.restore();
	//render mobs

	view_distance = ww/4-player.kills*5;//shadow transition distance
	view_distance = view_distance > 125?view_distance:125;
	
	for(var i=0;i<mobs.length;i++){
		mobs[i].update();
		mobs[i].render();
	}

	//render shadow
	sCtx.beginPath();

	sCtx.rect(0, 0, ww, wh);

  	var shadow = sCtx.createRadialGradient(player.x, player.y, 100, player.x, player.y, view_distance);
  	shadow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  	shadow.addColorStop(1, 'rgba(0, 0, 0, 1');

  	sCtx.fillStyle = shadow;
    sCtx.fill();

}

function loop(){
	if(game_state === 1){
		requestAnimFrame(loop);
		tick();
	}
}

window.onload = function(){
	core_init();
};