//make sure we only initialize the update loop once
	var gameStarted = false;

	//animation frames
	(function() {
	    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	    window.requestAnimationFrame = requestAnimationFrame;
	})();

	//globals
	var canvas,
	    ctx,
	    width,
	    status,
	    height,
	    player,
	    princess,
	    keys,
	    terrain,
	    bumpers,
	    evil,
	    bullet,
	    evilBullet,
	    friction,
	    gravity,
	    enemy1,
	    enemy2,
	    enemy3,
	    sniper,
	    hellfire;

	//reset function to set/re-set globals 
	function reset(){

	    canvas = document.getElementById("canvas");
	    ctx = canvas.getContext("2d");
	    width = 800;
	    status = 'playing';
	    height = 600;
	    player = {
	    	color: '#B9DAFB',
	        x: 0,
	        y: height/2,
	        width: 30,
	        height: 30,
	        speed: 6,
	        velX: 0,
	        velY: 0,
	        jumping: false,
	        grounded: false,
	        facing: 'right',
	        shot: false
	    };
	    princess = {
	    	color: '#F5ABC7',
	    	width: 30,
	    	height: 30,
	    	x: width - 31,
	    	y: 50
	    };
	    keys = [];
	    terrain = [];
	    bumpers = [];
	    evil = [];
	    bullet = {
	    	color: '#FDDD32',
	    	width: 10,
	    	height: 10,
	    	x: -10,
	    	y: -10,
	    	speed: 8,
	    	direction: null
	    };
	    evilBullet = {
	    	x: -10,
	    	y: -10,
	    	width: 10,
	    	height: 10,
	    	speed: 8,
	    	mortal: false	
	    };
	    friction = 0.8;
	    gravity = 0.8;
	    enemy1 = {
	    	color: '#E3504B',
	    	x: 120,
	    	y: 200,
	    	width: 40,
	    	height: 40,
	    	speed: 4,
	    	direction: 'down',
	    	alive: true,
	    	mortal: true
	    };
	    enemy2 = {
	    	x: 316,
	    	y: 360,
	    	width: 40,
	    	height: 40,
	    	speed: 2,
	    	direction: 'right',
	    	alive: true,
	    	mortal: true,
	    };
	    enemy3 = {
	    	x: 556,
	    	y: 40,
	    	width: 40,
	    	height: 40,
	    	speed: 2,
	    	direction: 'left',
	    	alive: true,
	    	mortal: true
	    };
	    sniper = {
	    	x: 316,
	    	y: 200,
	    	width: 40,
	    	height: 40,
	    	alive: true,
	    	mortal: true,
	    	shot: false,
	    };
	    hellfire = {
	    	x: 266,
	    	y: height - 40,
	    	width: width - 266,
	    	height: 40,
	    	mortal: false
	    };

		//enemies into evil for collision
		evil.push(enemy1);
		evil.push(hellfire);
		evil.push(enemy2);
		evil.push(enemy3);
		evil.push(sniper);
		evil.push(evilBullet);

		//bumpers[invisible terrain] for enemy patrols
		bumpers.push({
			x: 276,
			y: 360,
			width: 40,
			height: 40
		});

		bumpers.push({
			x: 516,
			y: 360,
			width: 40,
			height: 40
		});

		bumpers.push({
			x: 356,
			y: 40,
			width: 40,
			height: 40
		});
		bumpers.push({
			x: 596,
			y: 40,
			width: 40,
			height: 40
		});


		// Terrain

		//left-wall
		terrain.push({
		    x: 0,
		    y: 0,
		    width: 1,
		    height: height
		});
		//floor
		terrain.push({
		    x: 0,
		    y: height - 2,
		    width: width,
		    height: 50
		});
		//right-wall
		terrain.push({
		    x: width - 1,
		    y: 0,
		    width: 1,
		    height: height
		});

		//cave
		terrain.push({
		    x: 0,
		    y: 0,
		    width: 266,
		    height: 200
		});
		terrain.push({
		    x: 0,
		    y: 400,
		    width: 266,
		    height: 200
		});

		//platform-1
		terrain.push({
		    x: 316,
		    y: 400,
		    width: 200,
		    height: 40
		});

		//stairs
		terrain.push({
		    x: 606,
		    y: 400,
		    width: 200,
		    height: 40
		});
		terrain.push({
		    x: 646,
		    y: 360,
		    width: 160,
		    height: 40
		});
		terrain.push({
		    x: 686,
		    y: 320,
		    width: 120,
		    height: 40
		});

		//platform-2
		terrain.push({
		    x: 606,
		    y: 240,
		    width: 120,
		    height: 40
		});

		//platform-3
		terrain.push({
		    x: 396,
		    y: 280,
		    width: 120,
		    height: 40
		});

		//platform-4
		terrain.push({
		    x: 316,
		    y: 240,
		    width: 40,
		    height: 40
		});

		//platform-5
		terrain.push({
		    x: 356,
		    y: 160,
		    width: 40,
		    height: 40
		});

		//platform-6
		terrain.push({
		    x: 396,
		    y: 80,
		    width: 200,
		    height: 40
		});

		//platform-6
		terrain.push({
		    x: 646,
		    y: 80,
		    width: 160,
		    height: 40
		});


		canvas.width = width;
		canvas.height = height;

	}

	reset();

	//main game loop
	function update() {
	    // check player input
	    if (keys[38] || keys[87]) {
	        // up arrow
	        if (!player.jumping && player.grounded) {
	            player.jumping = true;
	            player.grounded = false;
	            player.velY = -player.speed * 2;
	        }
	    }
	    if (keys[39] || keys[68]) {
	        // right arrow
	        player.facing = "right";
	        if (player.velX < player.speed) {
	            player.velX++;
	        }
	    }
	    if (keys[37] || keys[65]) {
	        // left arrow
	        if (player.velX > -player.speed) {
	            player.velX--;
	        }
	        player.facing = "left";
	    }
	    if (keys[32]){
	    	// spacebar
	    	if(status === 'win'){
	    		reset();
	    	}else if(player.shot === false){
	    		player.shot = true;
	    		bullet.direction = player.facing;
	    		bullet.x = player.x + 30;
	    		bullet.y = player.y + 10;
	    	}

	    }

	    //Environmental Physics
	    player.velX *= friction;
	    player.velY += gravity;

	    //Clear-canvas and prepare for re-draw
	    ctx.clearRect(0, 0, width, height);
	    ctx.fillStyle = "black";
	    ctx.beginPath();

	    //terrain & terrain collision
	    player.grounded = false;
	    for (var i = 0; i < terrain.length; i++) {
	    	//draw terrain
	        ctx.rect(terrain[i].x, terrain[i].y, terrain[i].width, terrain[i].height);
	        
	        //player-terrain collision
	        var dir = colCheck(player, terrain[i]);

	        if (dir === "l" || dir === "r") {
	            player.velX = 0;
	            player.jumping = false;
	        } else if (dir === "t") {
	            player.velY *= -1;
	        } else if (dir === "b") {
	            player.grounded = true;
	            player.jumping = false;
	        }

	        //bullet-terrain collision
	        var dth = colCheck(bullet, terrain[i]);

	        if (dth != null) {
	            player.shot = false;
	        }

	        //evil-bullet-terrain collision
	        var dte = colCheck(evilBullet, terrain[i]);

	        if (dte != null){
	        	sniper.shot = false;
	        }


	        //enemy1-terrain collision
	        var dbz = colCheck(enemy1, terrain[i]);

	        if (dbz === "l" || dbz === "r") {

	        } else if (dbz === "t") {
	            enemy1.direction = 'down';
	        } else if (dbz === "b") {
	            enemy1.direction = 'up';
	        }

	    }

	    //check player/princess collision
        var love = colCheck(player, princess);

        //if the player has reached the princess set the game status to win
        if (love != null) {
        	status = 'win';
        }

	    

	    //check player/evil collision
	    for (var i = 0; i < evil.length; i++) {
	        
	        var dir = colCheck(player, evil[i]);

	        if (dir != null) {
	            resetPlayer();
	        }

	        //check bullet/evil collision
	        if(evil[i].mortal){
	        	var dth = colCheck(bullet, evil[i]);
		        if (dth === "l" || dth === "r") {
		            evil[i].alive = false;
		            player.shot = false;
		        } else if (dth === "t") {
		            evil[i].alive = false;
		            player.shot = false;
		        } else if (dth === "b") {
		            evil[i].alive = false;
		            player.shot = false;
		        }

		        //if killed teleport corpse off-screen
	        	if(!evil[i].alive){
		        	evil[i].x = -500;
		        	evil[i].y = -500;
	        	}
	        }

	    }

	    //check enemy / bumper collision
	    for (var i = 0; i < bumpers.length; i++) {
	        var dir = colCheck(enemy2, bumpers[i]);
	        if (dir === "l") {
	        	enemy2.direction = 'right';
	        }
	        if (dir === "r") {
	        	enemy2.direction = 'left';
	        }
	        var diz = colCheck(enemy3, bumpers[i]);
	        if (diz === "l") {
	        	enemy3.direction = 'right';
	        }
	        if (diz === "r") {
	        	enemy3.direction = 'left';
	        }
	    }


	    //Enemy Actions
	    if(enemy1.alive){
	    	if(enemy1.direction === 'down'){
		    	enemy1.y += enemy1.speed;
		    }else if(enemy1.direction === 'up'){
		    	enemy1.y -= enemy1.speed;
		    }
	    }

	    if(enemy2.alive){
	    	if(enemy2.direction === 'right'){
		    	enemy2.x += enemy2.speed;
		    }else if(enemy2.direction === 'left'){
		    	enemy2.x -= enemy2.speed;
		    }
	    }

	    if(enemy3.alive){
	    	if(enemy3.direction === 'right'){
		    	enemy3.x += enemy3.speed;
		    }else if(enemy3.direction === 'left'){
		    	enemy3.x -= enemy3.speed;
		    }
	    }

	    if(sniper.alive){
	    	if(sniper.shot === false){
	    		evilBullet.x = sniper.x + 40;
	    		evilBullet.y = sniper.y + 15;
	    		sniper.shot = true;

	    	}
	    }

	    if(sniper.shot){
	    	evilBullet.x += evilBullet.speed;
	    }
	    
	    //Player Actions
	    if(player.grounded){
	         player.velY = 0;
	    }
	    
	    player.x += player.velX;
	    player.y += player.velY;

	    if(player.shot){
	    	if(bullet.direction === 'right'){
	    		bullet.x += bullet.speed;
	    	}else if(bullet.direction === 'left'){
	    		bullet.x -= bullet.speed;
	    	}
	    }

	    ctx.fill();

	    //if player has shot, draw bullet
	    if(player.shot){
	    	ctx.fillStyle = bullet.color;
	    	ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
	    }

	    //draw Enemies
	    ctx.fillStyle = enemy1.color;
	    for(var i = 0; i < evil.length; i++){
	    	ctx.fillRect(evil[i].x, evil[i].y, evil[i].width, evil[i].height);
	    }

	    //draw Princess
	    ctx.fillStyle = princess.color;
	    ctx.fillRect(princess.x, princess.y, princess.width, princess.height);

	    //draw Player
	    ctx.fillStyle = player.color;
	    ctx.fillRect(player.x, player.y, player.width, player.height);

	    //draw Victory
	    if(status === 'win'){
	    	ctx.fillStyle = '#000';
	    	ctx.fillRect(0, 0, width, height);
	    	ctx.fillStyle = '#fff';
	    	ctx.font = '20pt Helvetica';
	    	ctx.textAlign = 'center';
	    	ctx.fillText("VICTORY", width/2, height/2);
	    	ctx.fillText("Press Space to Retry", width/2, height/2 + 40);
	    }

	    requestAnimationFrame(update);
	}

	//if player hit by evil, re-spawn
	function resetPlayer(){
		player.x = 0;
		player.y = height/2;
	}

	//collision detection
	function colCheck(shapeA, shapeB) {
	    // get the vectors to check against
	    var vX = (shapeA.x + (shapeA.width / 2)) - (shapeB.x + (shapeB.width / 2)),
	        vY = (shapeA.y + (shapeA.height / 2)) - (shapeB.y + (shapeB.height / 2)),
	        // add the half widths and half heights of the objects
	        hWidths = (shapeA.width / 2) + (shapeB.width / 2),
	        hHeights = (shapeA.height / 2) + (shapeB.height / 2),
	        colDir = null;

	    // if the x and y vector are less than the half width or half height, they we must be inside the object, causing a collision
	    if (Math.abs(vX) < hWidths && Math.abs(vY) < hHeights) {
	        // figures out on which side we are colliding (top, bottom, left, or right)
	        var oX = hWidths - Math.abs(vX),
	            oY = hHeights - Math.abs(vY);
	        if (oX >= oY) {
	            if (vY > 0) {
	                colDir = "t";
	                shapeA.y += oY;
	            } else {
	                colDir = "b";
	                shapeA.y -= oY;
	            }
	        } else {
	            if (vX > 0) {
	                colDir = "l";
	                shapeA.x += oX;
	            } else {
	                colDir = "r";
	                shapeA.x -= oX;
	            }
	        }
	    }
	    return colDir;
	}

	//keyboard handling
	document.body.addEventListener("keydown", function (e) {
	    keys[e.keyCode] = true;
	});

	document.body.addEventListener("keyup", function (e) {
	    keys[e.keyCode] = false;
	});

update();