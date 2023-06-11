(function(){
	'use strict';

	// Browser support for requestAnimationFrame
	window.requestAnimFrame = (function() {
		return	window.requestAnimationFrame       ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(callback, element){
					window.setTimeout(callback, 1000 / 60);
				};
	})();

	// Adding IE support / stopping IE balking on AudioContext()
	function getAudioContext(){
		if (typeof AudioContext !== "undefined") {
			return new AudioContext();
		} else if (typeof webkitAudioContext !== "undefined") {
			return new webkitAudioContext();
		} else if (typeof mozAudioContext !== "undefined") {
			return new mozAudioContext();
		} else {
			noAudio = true;
			console.log('Web Audio API is not supported');
		}
	}

	// IE Math.sign polyfill
	function mathSign(x){
		return x > 0 ? 1 : -1;
	}

	/* Math utility - map number v from one range i to second range o */
	function map(v, i1, i2, o1, o2) {
		return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
	}

	/* Easing equasion to smooth heart animation */
	function easeLinear(counter, start, end, duration) {
		return end * counter / duration + start;
	}

/* VARIABLES */
	var iterator, loop, Tau=Math.PI*2,
	canvasWidth=800, canvasHeight=600, 
	context, beginPath, moveTo, lineTo,
	audioContext, attack=50, decay=400, frequency, noAudio=false,
	rightDown=false, leftDown=false, upDown=false, downDown=false,
	dx, dy, dist,
	levelTime=9, levelTick=0,
	wall, walls = [],
	pt2={x:0, y:0}, pt3={x:0, y:0},
	speed = 3,
	lives = 3, replayLevel=false,
	resetLives = false,
	player = {	r:15,
			 	q:5,
				h:'#eee' },
	heart = {	r:10,
				h:'#f11',
				v:0 },
	running = false,
	timeDisplay, messageDisplay, titleDisplay, livesDisplay,
	messageCounter, messageString, msg=[], 	messageTimer,
	messages=[	'LOST LOVE     <br><br>Your passion is bright but will you be able to beat the 7 trials and find Love in the shadows . . . <br>. . . in time?    <br><br>Use AWSD or arrow keys (&lArr;&uArr;&dArr;&rArr;) to move     <br><br><em>Click here to PLAY</em>',
				'You walked away in order to find Love, and overcame Love&rsquo;s seven trials!    <br><br>You found the Lost and Lasting Love!    <br><br><em>Throw it all away and search again?</em>',
				'You&rsquo;ve had all your chances    <br><br>Maybe you should ...    <br><em>try again!</em>',
				'Too slow!    <br><br>Love doesn&rsquo;t wait around    <br><em>Try faster</em>',

				'Love was in the air!   <br><br>But blew away in the wind.    <br><br><em>Next Level ...</em>',
				'Love led you a merry dance.   <br><br>And skipped away.    <br><br><em>Next Level ...</em>',
				'Did Love leave you in a spin?!   <br><br>Don&rsquo;t be dizzy.    <br><br><em>Next Level ...</em>',
				'There is no lasting Love before the mast.    <br><br>Time to cast off.    <br><br><em>Next Level ...</em>',
				'You walked the pathway LOST    <br><br>One more trial for Love be found.   <br><br><em>Next Level ...</em>',
				'Did I say ONE more?    <br><br>Sorry, but there&rsquo;s another. Love can be cruel like that.   <br><br><em>Final level.    Honest.</em>'],
	gameLevel = 0, maxGameLevel,
	wallString = '',
	levelData = [];
	levelData.push({px:400, py:350, hx:400, hy:150, t:20, m:0, id:'First Kiss', w:'0000050000003c503c10000003c15000503c000140a14014143c140461450140001e231e02d1e501e00028232802d285028000320a32014323c32046325032'});
	levelData.push({px:750, py:550, hx:50, hy:500, t:30, m:4, id:'Square Dance', w:'0000050000003c503c10000003c15000503c00a0a460a01e143c1401e1e3c1e02828462801432503210a0a0a3c11414143211e1e1e3213c143c1e1460a4628'});
	levelData.push({px:450, py:150, hx:750, hy:250, t:30, m:5, id:'Snail', w:'0000050000003c503c10000003c15000503c0000a280a0320a460a014143c1404614501401e1e321e02828322800a32143202832463210a140a3211414143211e1e1e3c1321e322813c143c321460a4632'});
	levelData.push({px:550, py:150, hx:650, hy:550, t:25, m:6, id:'Pirate&rsquo;s Skull', w:'0000050000003c503c10000003c15000503c00a0a1e0a0320a460a000140a14014141e1403214461401e1e3c1e014282828032283c2800a32463211414142811e0a1e1412800281e1282828321320a321413c1e3c2814632463c'});
	levelData.push({px:50, py:150, hx:650, hy:550, t:25, m:7, id:'L O S T', w:'0000050000003c503c10000003c15000503c0000a0a0a0140a460a0281446140461e501e0281e3c1e00a28322800032143202832323210a000a281140a141e11e141e2811e321e3c12814281e13214321e13228323213c0a3c1413c1e3c3c1461e463c'});
	levelData.push({px:350, py:350, hx:450, hy:350, t:30, m:8, id:'Think Outside the Box', w:'0-a-a5a-a0000050000003c503c0-a465a461-a-a-a4610000001e10028003c12800283c15000501e15028503c15a-a5a46'});
	levelData.push({px:350, py:450, hx:550, hy:450, t:45, m:9, id:'Love can be Cruel', w:'014-f3c-f0-a-a14-a03c-a5a-a01e-532-50-f00-a00000000a00032003c000460050000-50a000a00a0a1e0a0-f14-a14028143c14050145a140321e461e0003c283c0323c503c0-a460a4601e463c46046465a460145046501-f00-f141-a-a-a001-a14-a4610000001e10028003c10a000a0a10a3c0a46114-f14001143c145011e-51e0a12814283c132-532001321e323c13c-f3c-a13c003c1413c3c3c4614600461e14646465015000502815032503c15a-a5a46'});

	
	maxGameLevel = levelData.length;

/************	BUILD TOOL :: DEV CODE - tool to build wall data per screen *************/
/* ENCODE WALLS */

	/*var wallData = [];
	// PASTE WALL BUILD DATA FROM 'walls unencoded.js' HERE

	var wallString='', wData, t;
	for(loop=wallData.length, iterator=0; iterator<loop; iterator++){
		wData = wallData[iterator];
		wallString += wData.v;
		wallString += addToWallString(wData.x1.toString(16));
		wallString += addToWallString(wData.y1.toString(16));
		wallString += addToWallString(wData.x2.toString(16));
		wallString += addToWallString(wData.y2.toString(16));
	}
	function addToWallString(t){
		return (t.length === 1) ? '0'+t : t;
	}
	levelData[0] = {px:350, py:450, hx:550, hy:450, t:300, m:9, id:'DEV', w:wallString};

	console.log(wallString); // Copy this output string and use to create new levelData object*/

/************ END BUILD TOOL *************/

/* DECODE WALLS
	Runs each level, inflating compressed wall data */
	function createLevel(lvl){
		if(lvl >= maxGameLevel){
			setMessage(1);
			setTitle('LOST LOVE');
			running = false;
			return;
		}
		else{
			setMessage(levelData[lvl].m);
			setTitle(levelData[lvl].id);
			running = false;
		}
		walls.length=0;
		/*	have a string for each map
			1st char is 0/1 for vertical
			then pairs in HEX - gives 0 - 255
				convert to decimal & multiply each by a CONST
				for bigger range of co-ordinates */
		wallString = levelData[lvl].w;
		for(loop = wallString.length / 9, iterator=0; iterator<loop; iterator++){
			wall = {};
			wall.x1 = (parseInt(wallString.substr(1+(iterator*9), 2), 16)*10);
			wall.y1 = (parseInt(wallString.substr(3+(iterator*9), 2), 16)*10);
			wall.x2 = (parseInt(wallString.substr(5+(iterator*9), 2), 16)*10);
			wall.y2 = (parseInt(wallString.substr(7+(iterator*9), 2), 16)*10);
			wall.v = parseInt(wallString.substr(0+(iterator*9), 1), 16);
			walls.push(wall);
		}
		setupCharacters(lvl);
	}

	/* Position Player and Heart */
	function setupCharacters(lvl){
		levelTick = 0;
		heart.x = levelData[lvl].hx;
		heart.y = levelData[lvl].hy;
		player.x = levelData[lvl].px;
		player.y = levelData[lvl].py;
		levelTime = levelData[lvl].t;
	}

/* UPDATE */
	function update(){
		heart.t++;
		heart.s = easeLinear(heart.t, 1.2, .6, 150);

		if(rightDown){ player.x += speed; }
		if(leftDown){ player.x -= speed; }
		if(upDown){ player.y -= speed; }
		if(downDown){ player.y += speed; }

		checkTimer();
		checkCollisions();
	}

	/* 60 ticks is approx equal to 1 second
		Manages out-of-time and lives */
	function checkTimer(){
		levelTick++;
		if(levelTime - levelTick/60 <= 0){
			// OUT OF TIME
			running = false;
			replayLevel = true;
			lives--;
			setLives();

			if(lives === 0){
				setMessage(2);
				resetLives = true;
			}
			else{
				setMessage(3);
			}
		}
		updateTimeDisplay(levelTime - levelTick/60);
	}

	/* Collisions between player and walls / heart
		Heart collision distance also controls heartbeat valume >> it gets louder as player get closer */
	function checkCollisions(){
		for(loop=walls.length, iterator=0; iterator<loop; iterator++){
			wall = walls[iterator];
			if(!wall.v){
				// between wall edges 
				if(player.x >= wall.x1 - player.q && player.x < wall.x2 + player.q){
					// measure how vertically close
					dy = player.y - wall.y1;
					// if close enough, bounce
					if(Math.abs(dy) < player.r){
						player.y += 15 * mathSign(dy);
						createOscillator(true);
					}
				}
			}
			else{
				// between wall edges 
				if(player.y >= wall.y1 - player.q && player.y < wall.y2 + player.q){
					// measure how vertically close
					dx = player.x - wall.x1;
					// if close enough, bounce
					if(Math.abs(dx) < player.r){
						player.x += 15 * mathSign(dx);
						createOscillator(true);
					}
				}
			}
		}

		/* Found love? */
		dx = heart.x - player.x;
		dy = heart.y - player.y;
		dist = Math.sqrt(dx*dx + dy*dy);

		heart.v = Math.max(0, map(dist, 500, 30, 0, 1));

		if(dist < player.r+heart.r){
			createOscillator('h');
			heart.v = 0;
			createLevel(++gameLevel);
		}
	}

/* DRAWING METHODS */
	function draw(){
		// Clear canvas
		context.clearRect(0,0,canvasWidth,canvasHeight);
		// Draw player dot
		context.fillStyle=player.h;
		beginPath();
        context.arc(player.x, player.y, player.r, 0, Tau);
        context.fill();
        // Call heart drawing method
        drawHeart();
        // Call to draw all walls / shadows
        drawWallShadows();
	}

	/* Draw the heart */
	function drawHeart(){
		context.fillStyle=heart.h;
		beginPath();
		quadraticCurveTo(11, -3, 11, -3);
		quadraticCurveTo(11, -9, 8, -11);
		quadraticCurveTo(4, -13, 0, -9);
		quadraticCurveTo(-3, -13, -7, -11);
		quadraticCurveTo(-10, -9, -10, -3);
		quadraticCurveTo(-10, 3, 0, 11);
		quadraticCurveTo(11, 3, 11, -3);
		context.fill();
	}
	// controlX, controlY, destinationX, destinationY
	function quadraticCurveTo(cx, cy, dx, dy){
        context.quadraticCurveTo(heart.x+(cx*heart.s), heart.y+(cy*heart.s), heart.x+(dx*heart.s), heart.y+(dy*heart.s));
    }

    /* Calculate and draw all the shadows and walls */
	function drawWallShadows(){
		for(loop=walls.length, iterator=0; iterator<loop; iterator++){
			wall = walls[iterator];
			/* Cheaty - calculate triangular points between player and walls ends
				Multiply hugely to ensure resultant continued points extend pass edge of canvas */
			pt2.x = (wall.x1 - player.x) * 65;
			pt2.y = (wall.y1 - player.y) * 65;
			pt3.x = (wall.x2 - player.x) * 65;
			pt3.y = (wall.y2 - player.y) * 65;

			context.fillStyle='rgba(0,0,0,.7)';
			beginPath();
			moveTo(wall.x1, wall.y1);
			lineTo(pt2.x, pt2.y);
			lineTo(pt3.x, pt3.y);
			lineTo(wall.x2, wall.y2);
			context.fill();

			// Show the wall
			beginPath();
			context.strokeStyle='#000';
			context.lineWidth='7';
			moveTo(wall.x1, wall.y1);
			lineTo(wall.x2, wall.y2);
			context.stroke();
		}
	}

/* AUDIO METHODS */
	function createOscillator(isCollision) {
		if(noAudio) return;
		// Create an envelope to make sound more pleasant
		var gainNode = audioContext.createGain(),
			osc=audioContext.createOscillator();

		// Connect up the envelope
		gainNode.connect(audioContext.destination);
		gainNode.gain.setValueAtTime(0, audioContext.currentTime);
		gainNode.gain.linearRampToValueAtTime(isCollision ? 1 : heart.v, audioContext.currentTime + (attack * .001));
		gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + (decay * .001));

		// make the sound
		switch(isCollision){
			case true:
				frequency = 82; // hit wall
				break;
			case 'h':
				frequency = 233; // hit heart
				break;
			default:
				frequency = 92; // heartbeat
		}
		osc.frequency.value = frequency;
		osc.connect(gainNode);
		osc.start(0);

		// Clean up - for GC
		setTimeout(function() {
			osc.stop(0);
			osc.disconnect(gainNode);
			gainNode.disconnect(audioContext.destination);
		}, decay);
	}

	/* Double beat - recursive */
	function heartBeat(){
		heart.t = 0;
		createOscillator();
		setTimeout(function() {
			heart.t=0;
			createOscillator();
		}, 350);
		setTimeout(function() {
			heartBeat();
		}, 1500);
	}

/* ANIMATE */
	function animate(){
		if(running){
			update();
			draw();
			requestAnimFrame(animate);
		}
	}

/* INIT */
	function init(){
		// Set up UI
		timeDisplay=document.getElementById('t');
		livesDisplay=document.getElementById('l');
		messageDisplay=document.getElementById('m');
		titleDisplay=document.getElementById('n');

		// Set up canvas 
		var canvas = document.createElement('canvas', canvasWidth, canvasHeight);
		canvas.width = canvasWidth;
		canvas.height = canvasHeight;
		document.getElementById('w').appendChild(canvas);
		context = canvas.getContext('2d');
		context.lineCap="round";

    	audioContext = getAudioContext();

		beginPath=function(){ return context.beginPath(); }
		moveTo=function(x,y){ return context.moveTo(x,y); }
		lineTo=function(x,y){ return context.lineTo(x,y); }

		document.onkeydown=handleKeyDown;
		document.onkeyup=handleKeyUp;

		createLevel(gameLevel);
		draw();
		clearTimeout(messageTimer);
		setMessage(0);
	}

/* UI */
	/* Split game message to display as a build */
	function setMessage(value){
		messageDisplay.style.display = 'block';
		msg.length = 0;
		messageCounter = 0;
		messageString = '';
		msg = messages[value].split(' ');
		messageDisplay.innerHTML = '';
		displayMessageFragment();
	}
	/* Display game messages in DOM - recursive whilst message remains incomplete */
	function displayMessageFragment(){
		var fragment = msg[messageCounter++];
		if(fragment === undefined){
			fragment = '';
		}
		messageString += fragment + ' ';
		messageDisplay.innerHTML = messageString;
		if(messageCounter < msg.length){
			messageTimer = setTimeout(displayMessageFragment, 100);
		}else{
			setClickHandler();
		}
	}
	/* Clear game messages in DOM */
	function clearMessage(){
		messageDisplay.innerHTML = '';
	}

	/* Write level title to DOM */
	function setTitle(value){
		titleDisplay.innerHTML = "LEVEL " + (gameLevel+1) + ": &ldquo;" + value + "&rdquo;";
	}

	/* Write lives class to DOM */
	function setLives(){
		livesDisplay.className = 'l'+lives;
	}

	/* Write time remaining to DOM */
	function updateTimeDisplay(t){
		timeDisplay.innerHTML = 'TIME:' + (Math.ceil(t) < 10 ? '0' : '') + Math.ceil(t);
	}

/* INTERACTION */
	function setClickHandler(){
		messageDisplay.addEventListener("click", handleClick, false);
	}
	function clearClickHandler(){
		messageDisplay.removeEventListener("click", handleClick, false);
	}
	function handleClick(e){
		messageDisplay.style.display = 'none';
		clearClickHandler();
		clearMessage();

		if(resetLives){
			resetLives = false;
			lives = 3;
			setLives();
		}

		if(replayLevel){
			replayLevel = false;
			setupCharacters(gameLevel);
		}
		running = true;

		if(gameLevel === maxGameLevel){
			gameLevel = 0;
			lives = 3;
			setLives();
			createLevel(gameLevel);
			draw();
			clearTimeout(messageTimer);
			setMessage(0);
		}

		animate();
	}

	function handleKeyDown(e) {
		switch(e.keyCode){
			case 37:
			case 65:
				leftDown=true;
				break;
			case 38:
			case 87:
				upDown=true;
				break;
			case 39:
			case 68:
				rightDown=true;
				break;
			case 40:
			case 83:
				downDown=true;
				break;
		}
	}

	function handleKeyUp(e){
		switch(e.keyCode){
			case 37:
			case 65:
				leftDown=false;
				break;
			case 38:
			case 87:
				upDown=false;
				break;
			case 39:
			case 68:
				rightDown=false;
				break;
			case 40:
			case 83:
				downDown=false;
				break;
		}
	}

/* RUN */
	init();
	heartBeat();
	animate();


}());