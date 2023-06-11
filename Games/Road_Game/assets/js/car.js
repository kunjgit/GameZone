window.car = {
    cars: [],
    speed: {
        slow: 80,
        fast: 130,
        difference: 20
    },
    lane: {
        up: {
            fast: 100,
            slow: 210
        },
        down: {
            fast: 550 - 120,
            slow: 550 - 230
        }
    },
    car: function(){
        if(car.cars.length <= window.max.cars){
            var _this = {};
            
            _this.lane = (~~(Math.random() * 2) ? "fast" : "slow"), // Which lane the car should be in
            _this.direction = (~~(Math.random() * 2) ? "up" : "down"); // What direction it's driving
            
            _this.length = ~~(Math.random() * (50 - 25) + 25); // How long it is
            
            _this.y = (_this.direction == "up" ? 500 : 0 - _this.length); // The start position of the car
            
            if(_this.direction == "up"){
                _this.x = (_this.lane == "fast" ? ~~(Math.random() * ((car.lane.up.fast + 10) - (car.lane.up.fast - 10)) + (car.lane.up.fast - 10)) : ~~(Math.random() * ((car.lane.up.slow + 10) - (car.lane.up.slow - 10)) + (car.lane.up.slow - 10))); // If the car should be in the fast or slow lane on the left side of the road
            }else{
                _this.x = (_this.lane == "fast" ? ~~(Math.random() * ((car.lane.down.fast + 10) - (car.lane.down.fast - 10)) + (car.lane.down.fast - 10)) : ~~(Math.random() * ((car.lane.down.slow + 10) - (car.lane.down.slow - 10)) + (car.lane.down.slow - 10))); // If the car should be in the fast or slow lane on the right side of the road
            }
            
            _this.colour = "rgb(" + ~~(Math.random() * 256) + ", " + ~~(Math.random() * 256) + ", " + ~~(Math.random() * 256) + ")"; // The colour of the car
            
            if(_this.lane == "fast"){
                _this.speed = ~~(Math.random() * (car.speed.fast - (car.speed.fast - car.speed.difference)) + (car.speed.fast - car.speed.difference)); // Speed for the car in the fast lane
            }else{
                _this.speed = ~~(Math.random() * (car.speed.slow - (car.speed.slow - car.speed.difference)) + (car.speed.slow - car.speed.difference)); // Speed for the car in the slow lane
            }
                
            car.cars.push(_this) // Push _this to the cars array
        }
    },
    // Kill a single car
    kill: function(id) {
        car.cars.splice(id, 1); // DIE MOFO! D:<
        
        if(~~(Math.random() * 6)){ // Chance 5:1 to spawn a new car
	        new window.car.car();
	    }
    },
    
    // Kill all cars at once
    killAll : function() {
        // Reset the array with an empty array
        car.cars = [];
    },
    
    // Returns true if we have some cars, false otherwise
    hasCars : function() {
        return car.cars.length > 0;
    }
}