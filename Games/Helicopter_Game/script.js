var myHero;
var fish;
var fishes = [];
var fishCount = 8;
var collisions = 0;
var crashes = 3;
var missiles = [];
var missilesCount = 4;
var myGameArea = {
    canvas: document.getElementById("myFishingGame"),
    start: function() {
        this.context = this.canvas.getContext("2d");
        this.interval = setInterval(updateGameArea, 50)
    },
    clear: function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function() {
        clearInterval(this.interval);
    }

}

function startGame() {
    crashes=3;
    document.getElementById("crashes").innerHTML = crashes;
    collisions=0;
    document.getElementById("collisions").innerHTML = collisions;
    myGameArea.start();

    myHero = new Component(80, 60, "Emotion_Helicopter_5x.gif", 600, 120, 10, "image");
    for (var i = 0; i < fishCount; i++) {
        var myRandomNo = Math.floor(Math.random() * 450)
        var RandomSpeed = Math.floor(Math.random() * 4 + 1)
        fishes.push(new Component(20, 30, "oil.png", 0, myRandomNo, RandomSpeed, "image"));
    }
    missiles=[];
    document.getElementById("user_action").style.display="none";
    for (var i = 0; i < missilesCount; i++){
        missiles.push(new Component(60, 40, "heli2.gif", 0, Math.floor(Math.random() * 450), Math.floor(Math.random() * 4 + 1), "image"));
    }
}

function updateGameArea() {
    myGameArea.clear();
    if(crashes<1){
       end();
       return;
    }
    //try writing for loops in this way
    for(let el of missiles){
        el.x += el.speed
        if (el.x >= 800) {
            el.x = 0
            el.y = Math.floor(Math.random() * 300)
        }
       
       if (el.x >= myHero.x && el.x <= myHero.x + myHero.width && el.y >= myHero.y && el.y <= myHero.y + myHero.height) {
            el.x = 0
            el.y = Math.floor(Math.random() * 300)
            crashes--
            console.log('crashes')
            document.getElementById("crashes").innerHTML = crashes;
        }
        el.update()
    }
    for (var i = 0; i < fishCount; i++) {
        fishes[i].x += fishes[i].speed;
        if (fishes[i].x >= 800) {
            fishes[i].x = 0;
            fishes[i].y = Math.floor(Math.random() * 200)
        };
        if (fishes[i].x >= myHero.x && fishes[i].x <= myHero.x + myHero.width && fishes[i].y >= myHero.y && fishes[i].y <= myHero.y + myHero.height) {
            fishes[i].x = 0;
            collisions++;
            fishes[i].y = Math.floor(Math.random() * 200)
            document.getElementById("collisions").innerHTML = collisions;
        }
        fishes[i].update();
    }
    myHero.update();
}

function Component(width, height, src, x, y, speed, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.image = new Image();
    this.image.src = src;
    this.speed = speed;
    this.update = function() {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image,
            this.x,
            this.y,
            this.width, this.height);
    };

}

window.onkeydown = function(e) {
    var keyCode = e.which;
    if (keyCode == 38)
        myHero.y = myHero.y - 10;
    else if (keyCode == 40)
        myHero.y = myHero.y + 10;
    else if (keyCode == 37)
        myHero.x = myHero.x - 10;
    else if (keyCode == 39)
        myHero.x = myHero.x + 10;
}
function end() {
    myGameArea.stop();
    myGameArea.clear();
    
    document.getElementById("user_action").style.display = "block";
    document.getElementById("message").innerHTML = "Game Over!";
    
    // Display final score in the modal
    var finalScore = "Final Score: " + collisions + " Crashes left = " + crashes;
    document.getElementById("finalScore").innerHTML = finalScore;
    
    // Show the modal
    var modal = document.getElementById("gameOverModal");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    
    // Close the modal when the user clicks on <span> (x)
    span.onclick = function() {
        modal.style.display = "none";
    }
    
    // Close the modal when the user clicks anywhere outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

