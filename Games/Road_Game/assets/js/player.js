var colours = ["#ebceae", "#f3ccb3", "#bf9084", "#3f2d28"];
window.player = {
    colour: colours[~~(Math.random() * colours.length)],
    x: 10, y: ~~(Math.random() * (490 - 10) + 10),
    left: false, right: false,
    up: false, down: false,
    speed: 50, // Speed of the player
    currentPowerUps: [], // The current power ups
    invincible: false, // If invincible
    timers: [], // An array of setTimeouts
    deaths: 0,
    movement: function(dt){
        if(player.left){
			player.x -= player.speed * dt; // Move left
			if(player.x <= 0){ // Don't go behind this point
				player.x += player.speed * dt; // Move right
			}
		}
		if(player.right){
			player.x += player.speed * dt; // Move right
			if(player.x >= 540){ // Don't go beyond this point
				player.x -= player.speed * dt; // Move left
			}
		}
		if(player.up){
			player.y -= player.speed * dt; // Move up
			if(player.y <= 0){ // Don't go behind this point
				player.y += player.speed * dt; // Move down
			}
		}
		if(player.down){
			player.y += player.speed * dt; // Move down
			if(player.y >= 490){ // Don't go beyond this point
				player.y -= player.speed * dt; // Move up
			}
		}
    },
    hit: function(){
        // We have some cars on the screen
        if (window.car.hasCars()) {
            
            // Iterate over all cars
            for (var i in window.car.cars){
                var car = window.car.cars[i];
                
                // The car exists
                if (typeof car !== 'undefined') {
                
                    // The player was hit by a car
                    if (
                        (player.y >= car.y || player.y + 5 >= car.y || player.y - 5 >= car.y) &&
                        (player.y <= car.y + car.length || player.y + 5 <= car.y + car.length || player.y- 5 <= car.y + car.length) &&
                        (player.x >= car.x || player.x + 5 >= car.x || player.x - 5 >= car.x) &&
                        (player.x <= car.x + 20 || player.x + 5 <= car.x + 20 || player.x - 5 <= car.x + 20)
                    ) {
                        player.die();
                    }
                }
            }
        }
    },
    collectPowerUp: function(){
        if(player.currentPowerUps.length <= window.max.powers){
        	for (var i in window.points.powerUps) {
                var pU = window.points.powerUps[i];
                
                if (
                    (player.y >= pU.y || player.y + 10 >= pU.y) &&
                    (player.y <= pU.y + 5 || player.y + 10 <= pU.y + 5) &&
                    (player.x >= pU.x || player.x + 10 >= pU.x) &&
                    (player.x <= pU.x + 20 || player.x + 10 <= pU.x + 5)
                ) {
                    if (pU.power == "minion"){
                        player.currentPowerUps.push({
                            type: "minion",
                            position: ~~(Math.random() * 360)
                        });
                        
                        audio.collectPowerUp();
                        
                    } else if(pU.power == "bomb") {
                        player.currentPowerUps.push({
                            type: "bomb",
                            x: player.x,
                            y: player.y,
                            alpha: .5
                        });
                        
                        audio.collectBomb();
                        
                    } else {
                        player.currentPowerUps.push(pU.power);
                        
                        // Play a sound if a power up was collected
                        audio.collectPowerUp();
                    }
                    
                    var powerId = player.currentPowerUps.length - 1; // Get the current id of the power up
                    points.killPowerUp(i); 
                    
                    if(pU.power == "speed"){
                        player.speed *= 2;
                        
                        // What are you doing? :D
                        // Fixing the bug on line 81
                        // awesome :D I was just looking for it  too :D but please do it
                        // :D
                        
                        for(var i in player.timers){
                            if(player.timers[i][0] == "speed"){
                                clearTimeout(player.timers[i][1]);
                            }
                        }
                        
                        player.timers.push(["speed", setTimeout(function(){
                            player.speed /= 2;
                            player.currentPowerUps.splice(powerId, 1);
                            draw.trails = [];
                        }, 10000)]);
                    }else if(pU.power == "invincibility"){
                        player.invincible = true;
                        
                        for(var i in player.timers){
                            if(player.timers[i][0] == "invincibility"){
                                clearTimeout(player.timers[i][1]);
                            }
                        }
                        
                        player.timers.push(["invincibility", setTimeout(function(){
                            player.invincible = false;
                            player.currentPowerUps.splice(powerId, 1);
                        }, 10000)]);
                    }else if(pU.power == "point"){
                        points.scoreUp(1);
                    }else if(pU.power == "bomb"){
                        draw.explosion(pU.x, pU.y);
                    }
                }
            }
        }
    },
    die: function(){ // Reset the player
        if(!player.invincible){ // If the player is invincible
            if(points.points > points.highScore){
                points.highScore = points.points;
                localStorage["highscore"] = points.highScore;
            }
            
            audio.die();
            
            player.colour = colours[~~(Math.random() * colours.length)];
            
            points.points = 0;
            points.scoreSide = "right";
            player.x = 10;
            player.y = ~~(Math.random() * (490 - 10) + 10); // Get a random y position
            player.deaths++;
            localStorage["deaths"] = player.deaths;
            
            // Clear all timers
            for(var i in player.timers){
                clearTimeout(player.timers[i][1]);
            }
            
            // Kill all cars
            car.killAll();

            // Kill all power ups
            points.killAllPowerUps();
            
            player.speed = 50; // Reset speed
            
            // Reset the speed of the cars
            car.speed.fast = 130;
            car.speed.slow = 80;
            
            player.currentPowerUps = []; // Clear all powers
        }
    },
    keyManagement: function(){
        document.addEventListener("keydown", function(e){
			kc = e.keyCode;
			if(kc == 65 || kc == 37){ player.left 	= true } // a || left arrow
			if(kc == 68 || kc == 39){ player.right 	= true } // d || right arrow
			if(kc == 87 || kc == 38){ player.up 	= true } // w || up arrow
			if(kc == 83 || kc == 40){ player.down 	= true } // s || down arrow
			if(kc == 65 || kc == 37 || kc == 68 || kc == 39 || kc == 87 || kc == 38 || kc == 83 || kc == 40){
			    e.preventDefault();
			}
		})
		document.addEventListener("keyup", function(e){
			var kc = e.keyCode;
			if(kc == 65 || kc == 37){ player.left 	= false } // a || left arrow
			if(kc == 68 || kc == 39){ player.right 	= false } // d || right arrow
			if(kc == 87 || kc == 38){ player.up 	= false } // w || up arrow
			if(kc == 83 || kc == 40){ player.down 	= false } // s || down arrow
			if(kc == 65 || kc == 37 || kc == 68 || kc == 39 || kc == 87 || kc == 38 || kc == 83 || kc == 40){
			    e.preventDefault();
			}
		})
    }
}