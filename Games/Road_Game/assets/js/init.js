window.max = {
    powers: 7,
    powersOnScreen: 21,
    cars: 14
};
var c = document.getElementById("board"),
    ctx = c.getContext("2d"),
    
    then = Date.now() / 1000,
    tick = function(){
        var now = Date.now() / 1000,
            dt = now - then; // Delta Time
        
        then = now;
        
        player.movement(dt); // Manage player movement
        player.hit(); // Check if hit by a car
        player.collectPowerUp(); // Collect power ups
        
        points.score(); // Earn points by reaching each side
        points.hitPowerUp();
        
        draw.map(); // Draw map
        draw.player(dt); // Draw player
        draw.cars(dt); // Draw cars
        draw.powerUps(dt); // Draw power up
        draw.info(); // Draw some information
        
        //requestAnimationFrame(tick); // Make the game tick
    };
    
setInterval(tick, 0); // Make the game tick
//requestAnimationFrame(tick); // Make the game tick
setInterval(function(){
    new car.car(); // Spawn a new car
}, 2500);
setInterval(function(){
    car.speed.slow++;
    car.speed.fast++;
}, 2500);
setInterval(function(){
    new points.powerUp();
}, 60000);

player.keyManagement() // Manage key presses

// Fetch data from localstorage
points.highScore = localStorage["highscore"] || 0;
player.deaths = localStorage["deaths"] || 0;