window.draw = {
    trails: [],
    map: function(){
        c.width = 550;
        c.height = 500;
        
        // Draw Road
        ctx.fillStyle = "#161616";
        ctx.fillRect(0, 0, c.width, c.height);
        
        // Draw Middle line
        ctx.fillStyle = "#c0c0c0";
        ctx.fillRect(c.width / 2 - 10, 0, 20, c.height);

        // Draw Left Dashed Line
        ctx.rect(70, 0, 0, c.height);
		ctx.lineWidth = 20;
		ctx.lineDashOffset = 2;
		ctx.setLineDash([10, 20]);
		ctx.strokeStyle = "#c0c0c0";
		ctx.stroke();
		
		// Draw Right Dashed Line
		ctx.rect(c.width - 70, 0, 0, c.height);
		ctx.lineWidth = 20;
		ctx.lineDashOffset = 2;
		ctx.setLineDash([10, 20]);
		ctx.strokeStyle = "#c0c0c0";
		ctx.stroke();
    },
    player: function(dt){
        if(player.invincible){ // If invincible
            ctx.fillStyle = "#4ae9b8";
        }else{
            ctx.fillStyle = player.colour;   
        }
		ctx.fillRect(player.x - 5, player.y -5, 10, 10); // Draw player
		
		for(var i in player.currentPowerUps){
		    var cpu = player.currentPowerUps[i];
		    
		    if(cpu.type == "minion"){ // If power ups is minion
		        draw.minions(cpu, dt);
		    }else if(cpu.type == "bomb"){
		        draw.explosion(cpu, dt, i);
		    }else if(cpu == "speed"){
		        draw.trail();
		    }
		}
    },
    cars: function(dt){
        for(var i in window.car.cars){
            var car = window.car.cars[i];
            
            ctx.fillStyle = car.colour;
            ctx.fillRect(car.x, car.y, 20, car.length);
            
            if(car.direction == "up"){
				car.y -= car.speed * dt; // Make the car go upwards
			}else{
				car.y += car.speed * dt; // Make the car go downwards
			}
			
		    if(car.direction == "up"){
		        if(car.lane == "fast"){
		            if(car.x > window.car.lane.up.fast - 10 && car.x < window.car.lane.up.fast + 10){
		                if(~~(Math.random() * 2)){
		                    car.x += 10 * dt;
		                }else{
		                    car.x -= 10 * dt;
		                }
		            }
		        }else{
		            if(car.x > window.car.lane.up.slow - 10 && car.x < window.car.lane.up.slow + 10){
		                if(~~(Math.random() * 2)){
		                    car.x += 10 * dt;
		                }else{
		                    car.x -= 10 * dt;
		                }
		            }
		        }
		    }else{
		        if(car.lane == "fast"){
		            if(car.x > window.car.lane.down.fast - 10 && car.x < window.car.lane.down.fast + 10){
		                if(~~(Math.random() * 2)){
		                    car.x += 10 * dt;
		                }else{
		                    car.x -= 10 * dt;
		                }
		            }
		        }else{
		            if(car.x > window.car.lane.down.slow - 10 && car.x < window.car.lane.down.slow + 10){
		                if(~~(Math.random() * 2)){
		                    car.x += 10 * dt;
		                }else{
		                    car.x -= 10 * dt;
		                }
		            }
		        }
		    }
			
			if(car.y <= 0 - car.length || car.y >= c.height){ // In with the new, out with the old
			    window.car.kill(i); // DIE MOFO! D:<
			}
        }
    },
    powerUps: function(dt){
        for(var i in window.points.powerUps){
            var pU = window.points.powerUps[i]; // Power Up
            
            // Inner circle
            ctx.fillStyle = "rgba(74, 233, 184, .5)"; // #4ae9b8 in rgb
            ctx.beginPath();
            ctx.arc(pU.x, pU.y, 5, 0, Math.PI*2, true); 
            ctx.closePath();
            ctx.fill()
            
            // Stroke (Outer circle)
            ctx.lineWidth = 2;
    		ctx.lineDashOffset = pU.dashOffset;
    		ctx.setLineDash([2, 4]);
    		ctx.strokeStyle = "#4ae9b8";
    		ctx.stroke();
    		
    		// Text
    		ctx.fillStyle = "#fff";
    		ctx.textAlign = "center";
    		ctx.fillText(pU.power, pU.x, pU.y - 15);
    		
    		pU.dashOffset += 10 * dt; // Make 'em go 'round 'round, 'round 'round. (I think it's from some song)
        }
    },
    info: function(){
/*		ctx.fillText("Car speed: {", 5, 65 - 15);
		ctx.fillText("Fast: " + car.speed.fast, 15, 80 - 15);
		ctx.fillText("Slow: " + car.speed.slow, 15, 95 - 15);
		ctx.fillText("}", 5, 110 - 15);*/
		
        // Update the score inside the UI
        UserInterface.updateScore(points.points);
        
        // Update the best inside the UI
        UserInterface.updateBest(points.highScore);
        
        // Update the deaths inside the UI
        UserInterface.updateDeaths(player.deaths);
    },
    minions: function(power, dt){
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate((power.position % 360) * Math.PI / 180);
        ctx.beginPath();
        ctx.arc(10, 10, 5, 0, Math.PI*2, true); 
        ctx.closePath();
        ctx.fill()
        ctx.restore();
        if(~~(Math.random() * 2)){
			power.position += 100 * dt;
		}else{
			power.position -= 100 * dt;
		}
    },
    explosion: function(power, dt, id){
        ctx.fillStyle = "rgba(255, 0, 0, " + power.alpha + ")";
        ctx.beginPath();
        ctx.arc(power.x, power.y, 80, 0, Math.PI*2, true);
        ctx.closePath();
        ctx.fill();
        
        if(power.alpha >= 0){
            power.alpha -= dt;   
        }else{
            //points.killPowerUp(id);
        }
        
        for(var i in window.car.cars){
            var car = window.car.cars[i];
            
            if(
                Math.sqrt( // Check if car is in radius
                    Math.pow(Math.abs(Math.abs(car.x) - power.x), 2) + 
                    Math.pow(Math.abs(Math.abs(car.y) - power.y), 2)
                ) <= 80 &&
                power.alpha > 0 // And alpha is above zero
            ){
                window.car.kill(i);
                points.scoreUp(1);
                achievements.unlock("useBomb");
            }
        }
    },
    trail: function(){
        draw.trails.reverse()
		for(var i in draw.trails){ // Draw trails
			ctx.fillRect(draw.trails[i][0] - 5, draw.trails[i][1] - 5, 10, 10); 
		}
		draw.trails.reverse()

		draw.trails.push([ // Push latest position of player to trails array
			player.x, 
			player.y
		])

		if(draw.trails.length > 26){ // The trail can be 25 pixels long
			draw.trails.reverse().pop()
			draw.trails.reverse()
		}
    },
    achievement: function(achievement){
    	ctx.fillStyle = "#fff";
		ctx.textAlign = "right";
		ctx.textBaseline = "top";
    	switch(achievement){
    		case "die":
    			ctx.fillText("I'm dead...", c.width, c.height - 15);
    			break;
    		case "runOver":
    			ctx.fillText("Ouch, that hurt.", c.width, c.height - 15);
    			break;
    		case "useBomb":
    			ctx.fillText("Bamb! Yo' dead!", c.width, c.height - 15);
    			break;
    	}
    	console.log("Unlocked:", achievement);
    }
}