window.points = {
    points: 0,
    highScore: 0,
    scoreSide: "right", // Which side you'll have to be on to get points
    powerUps: [],
    scoreUp: function(point){
        points.points += point;
        
        for(var i = 0; i < point; i++){
            new points.powerUp();
        }
    },
    score: function(){
        var multipier = 1;
        for(var i in player.currentPowerUps){
            if(player.currentPowerUps[i].type == "minion"){
                multipier++;
            }
        }
        if(player.x <= 70 && player.x >= 0 && points.scoreSide == "left"){ // If player is on the left side of the road
            points.scoreSide = "right"; // Change which side it's possible to get points on
            points.scoreUp(multipier);
        }else if(player.x <= 550 && player.x >= 550 - 70 && points.scoreSide == "right"){ // If player is on the right side of the road
            points.scoreSide = "left"; // Change which side it's possible to get points on
            points.scoreUp(multipier);
        }
    },
    powerUp: function(type){
        if(points.powerUps.length <= window.max.powersOnScreen){
            var _this = {},
                powers = ["speed", "invincibility", "minion", "point", "bomb"];
            _this.x = ~~(Math.random() * (540 - 10) + 10); // The x position
            _this.y = ~~(Math.random() * (490 - 10) + 10); // The y position
            
            _this.power = (type ? type :powers[~~(Math.random() * powers.length)]); // Which type the power up is
            
            _this.dashOffset = 0; // The dash offset of the stroke
            
            points.powerUps.push(_this); // Push _this to the powerIps array
        }
    },
    hitPowerUp: function(){
        for(var i in window.car.cars){
            var car = window.car.cars[i];
            
            for(var j in window.points.powerUps){
                var pU = window.points.powerUps[j];
                
                if( // Check if something hits the power up (Either the player or a car)
                    (pU.y >= car.y || pU.y + 5 >= car.y || pU.y - 5 >= car.y) &&
                    (pU.y <= car.y + car.length || pU.y + 5 <= car.y + car.length || pU.y- 5 <= car.y + car.length) &&
                    (pU.x >= car.x || pU.x + 5 >= car.x || pU.x - 5 >= car.x) &&
                    (pU.x <= car.x + 20 || pU.x + 5 <= car.x + 20 || pU.x - 5 <= car.x + 20)
                ){
                    points.killPowerUp(j);
                }
            }
        }
    },
    killPowerUp: function(id){
        points.powerUps.splice(id, 1); // Remove the untaken power up
    },
    killAllPowerUps: function(){
        points.powerUps = [];
    }
}