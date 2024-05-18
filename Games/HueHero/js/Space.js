function Space() {
    var Space = this;

    Space.canvas = document.getElementById("space");
    Space.canvas.width = window.innerWidth;
    Space.canvas.height = window.innerHeight;
    Space.ctx = Space.canvas.getContext("2d");
    
    Space.starsPerGalaxy = 200;
    Space.numberOfGalaxies = 20;
    Space.galaxySizes = [100, 150, 200, 250, 300];
    Space.maxStarSize = 2;
    Space.numberOfStars = 2000;

    Space.setListeners();
}

Space.prototype.make = function() {
    var Space = this;
    var numberOfStars = Space.numberOfStars;
    var numberOfGalaxies = Space.numberOfGalaxies;

    for(var i=0; i < numberOfStars; i++) {
        Space.star();
    }    

    for(var i=0; i < numberOfGalaxies; i++) {
        Space.galaxy();
    }
};

Space.prototype.star = function(x, y) {
    var Space = this;
    var ctx = Space.ctx;
    var canvas = Space.canvas;
    var r = Util.randomNumber(Space.maxStarSize);
    var x = x;  
    var y = y;

    if (x === undefined) {
        x = Util.randomNumber(canvas.width);    
    } 

    if (y === undefined) {
        y = Util.randomNumber(canvas.height);
    }

    ctx.fillStyle = "rgba(255, 255, 255," + 1 / Util.randomNumber(10) + ")";
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI, true);
    ctx.closePath();
    ctx.fill();
};

Space.prototype.galaxy = function() {
    var Space = this;
    var x = Util.randomNumber(Space.canvas.width);
    var y = Util.randomNumber(Space.canvas.height);

    Space.galaxyStars(x, y);
};

Space.prototype.galaxyStars = function(x, y) {
    var Space = this;
    var ctx = Space.ctx;
    var xGalaxyCenter = x;
    var yGalaxyCenter = y;
    var galaxySize = Util.randomItem(Space.galaxySizes);
    var xPos, yPos;
    
    for(var i=0; i < Space.starsPerGalaxy; i++) {
        xAmount = Util.randomNumber(galaxySize);
        if (Util.randomNumber(2) === 0) { xAmount = -Math.abs(xAmount); }
        xPos = xGalaxyCenter + xAmount * Math.LN10;

        yAmount = Util.randomNumber(galaxySize);
        if (Util.randomNumber(2) === 0) { yAmount = -Math.abs(yAmount); }
        yPos = yGalaxyCenter + yAmount + Math.LN10;
        
        ctx.moveTo(xPos, yPos);
        Space.star(xPos, yPos);
    }
};

Space.prototype.setListeners = function() {
    var Space = this;
    
    // == Regenerate space on resize.
    EventHandler.addListener("resize", function(e) {
        Space.canvas.width = window.innerWidth;
        Space.canvas.height = window.innerHeight;

        Space.ctx.clearRect(0, 0, Space.canvas.width, Space.canvas.height);
        Space.make();
    }, window);
};