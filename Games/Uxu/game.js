
var width = window.innerWidth, 
height = window.innerHeight, 
gLoop, 
bgCellWidth = 150, 
bgCellHeight = 200, 
gTime = 0, 
c = document.getElementById('gameCanvas'), 
ctx = c.getContext('2d');
width = c.width;
height = c.height;
width = 600;
height = 720;
margin = 1.0;
c.width = width * margin;
c.height = height * margin;
camX = 0;
camY = 0;
mountainImage = new Image();
mountainImage.src = "mount.png";
cloudImage = new Image();
cloudImage.src = "cloud.png";
mouseX = 0;
mouseY = 0;
keysDown = new Array();
arrow = {left: 37, up: 38, right: 39, down: 40, space: 32 };
phaseState = {startScreen: 0, setup: 1, run: 2, succeed:4, fail:5 };
currentPhaseState = phaseState.startScreen;
startingLevel = 1;
currentLevel = 1;
levelDuration = 13000;
currentTimeLeft = levelDuration;
lifeLeft = 13;
heightMax = 0;
helpTime = 0;
bonusJumpCount = 1;


var filterStrength = 20;
var frameTime = 0, lastLoop = new Date, thisLoop;

// Create Linear Gradients
var lingrad = ctx.createLinearGradient(0, 0, 0, height);
lingrad.addColorStop(0, '#C0C2F5');
lingrad.addColorStop(0.5, '#FA90BE');
lingrad.addColorStop(1, '#FEDCD3');

var mouseOut = document.getElementById('mouse');

// Misc
function NormVec2D(arg) {
    var vec = {x:arg.x, y:arg.y};
    var l = Math.sqrt(vec.x * vec.x + vec.y * vec.y);
    return l;
}

function NormalizeVec2D(arg) {
    var vec = {x:arg.x, y:arg.y};
    var l = NormVec2D(vec);
    if(l>0.0001)
    {
        vec.x = vec.x / l;
        vec.y = vec.y / l;
    }
    else
    {
        vec.x = 1;
        vec.y = 0;
    }
    return vec;
}

function MulVec2D(arg, coef) {
    var vec = {x:arg.x, y:arg.y};
    vec.x *= coef;
    vec.y *= coef;
    return vec;
}

var CustomRandom = function(nseed) {
    
    var high = nseed = (8253729 * nseed + 2396403), 
    low = high ^ 0x49616E42;
    
    return {
        next: function(min, max) {
            
            high = (high << 16) + (high >> 16);
            high += low;
            low += high;
            var res = high;
            res = res % 65535;
            res = res / 65535.1;
            return Math.abs(res);
        }
    }
}

var gRNG = CustomRandom(12375);


// Background
var renderDisc = function(x, y, radius) {
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
}

var renderBackGround = function(x, y) {
    
    {
        var rx = Math.round(x / bgCellWidth) * bgCellWidth;
        var ry = Math.round(y / bgCellHeight) * bgCellHeight;
        var cw = width / bgCellWidth;
        var ch = height / bgCellHeight;
        var i, j, k;
        for (i = -Math.round(cw / 2); i <= Math.round(cw / 2); i++) 
        {
            for (j = -Math.round(ch / 2); j <= Math.round(ch / 2); j++) 
            {
                var px = rx + i * bgCellWidth;
                var py = ry + j * bgCellHeight;
                var rng = CustomRandom(px + py * width);
                for (k = 0; k < 3; k++) 
                {
                    var radius = 2 * rng.next();
                    var dx = 100 * rng.next();
                    var dy = 100 * rng.next();
                    renderDisc(px + dx - x + width / 2, py + dy - y + height / 2, radius);
                }
                if(rng.next()>0.85)
                {
                    var sx = 52;
                    var sy = 22;
                    var scale = 1 + 1 * rng.next();
                    var sizeX = sx * scale;
                    var sizeY = sy * scale;

                    ctx.drawImage(cloudImage,px + dx - x + width / 2 - sizeX / 2, py + dy - y + height / 2, sizeX, sizeY);
                }
            }
        }
    }
    {
        var mountainCellWidth = 200;
        var rx = Math.round(x / mountainCellWidth) * mountainCellWidth;
        var cw = width / mountainCellWidth;
        var i, j, k;
        var sx = 414;
        var sy = 814;

        for (i = -Math.round(cw / 2); i <= Math.round(cw / 2); i++) 
        {
                var px = rx + i * mountainCellWidth;
                var rng = CustomRandom(px);

            var scale = 0.5 + 1 * rng.next();
            var sizeX = sx * scale;
            var sizeY = sy * scale;
            ctx.drawImage(mountainImage, px - x + width / 2 - sizeX / 2, 400-y + 100 * rng.next(), sizeX , sizeY);
        }


    }

    ctx.fillStyle = "#A4E2B2";
    ctx.beginPath();
    ctx.rect(0, height - y, width,  800);
    ctx.closePath();
    ctx.fill();
}


var clear = function(x, y) {
    camX = x - width / 2;
    camY = y - height / 2;


    ctx.fillStyle = "#FFFFFF";
    ctx.clearRect(0, 0, width+400, height+200);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = lingrad;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();
    ctx.rect(0, 0, width, height);
    ctx.closePath();
    ctx.fill();
    renderBackGround(x, y);
}


// Player
function Player() {
    var that = this;
    that.image = new Image();
    that.image.src = "charac2.png"
    that.width = 45;
    that.height = 45;
    that.X = 0;
    that.Y = 0;
    that.interval = 0;
    that.time = 0;
    that.speed = {x:0, y:0};
    that.gravity = 7;
    that.controlSpeedX = 2;
    that.alive = false;
    that.bonusJumpUsed = false;
    
    that.setPosition = function(x, y) {
        that.X = x;
        that.Y = y;
        that.speed.x = 0;
        that.speed.y = -5;
    }
    
    that.spawn = function(x, y) {
        that.X = x;
        that.Y = y;
        that.speed.x = 0;
        that.speed.y = -7 ;
        that.alive = true;
        that.time = 0;
        that.bonusJumpUsed = false;
    }

    that.update = function(dt) {
        if(currentPhaseState != phaseState.run)
            return;
        if(!that.alive)
            return ;

        that.time += dt;
        var fDt = dt / 1000.0;
        var fTime = that.time / 1000.0;

        {
            if(keysDown[arrow.left])
                that.speed.x = -that.controlSpeedX;
            if(keysDown[arrow.right])
                that.speed.x = that.controlSpeedX ;
            if(bonusJumpCount>0)
            {
                if(keysDown[arrow.space] && that.bonusJumpUsed==false)
                {
                    that.bonusJumpUsed = true;
                    that.speed.y = -10 ;
                    bonusJumpCount--;
                    gSpawnExplosion(that.X,that.Y);           
                }
                if(keysDown[arrow.space]==false)
                {
                    that.bonusJumpUsed = false;
                }
            }
        }

        that.speed.y += that.gravity * fDt;

       if(that.Y>height/2) //touch the ground
       {
            that.speed.y = -7;
            playerTouchGround();
        }
        
       if(that.Y<-height/2)
       {
           // 
            //that.speed.y = 1;
        }
        
       if(that.X>width/2)
            that.speed.x = -that.speed.x;
       if(that.X<-width/2)
            that.speed.x = -that.speed.x;

        that.X += that.speed.x;
        that.Y += that.speed.y;

    }
    
    that.draw = function() {
        if(currentPhaseState != phaseState.run)
            return;
        if(!that.alive)
            return ;

        try {
            var x = Math.round(that.X - camX - that.width / 2 );
            var y = Math.round(that.Y - camY - that.height / 2);
            ctx.drawImage(that.image, x, y, that.width, that.height);
        } 
        catch (e) {
        }
        ;
   
    }
}

var players =  new Array();
for (var i = 0; i<30; i++) {
    players[i] = new Player();
}

// Rocket
function Rocket() {
    var that = this;
    that.image = new Image();
    
    that.image.src = "bomb.png"
    that.width = 64;
    that.height = 64;
    that.X = 0;
    that.Y = 0;
    that.interval = 0;
    that.time = 0;
    that.speed = {x:0, y:0};
    that.gravity = 9;
    that.angle = 1;
    that.alive = false;
    that.duration = 3000;
    
    that.spawn = function(x, y) {
        that.X = x;
        that.Y = y;
        that.alive = true;
        that.time = 0;
    }
    
    that.findNearestPlayer = function() {
        var res = 0;
        var minDist = Number.MAX_VALUE;

        for (var i = 0; i < players.length; i++) {
            if(players[i].alive==true)
            {
                var player = players[i];
                var dirPlayer = {x:player.X - that.X, y:player.Y - that.Y};
                var dist = NormVec2D(dirPlayer);
                if (dist<minDist)
                {
                    res = player;
                    minDist = dist;
                }
            }
        }
        return res;
    }

    that.update = function(dt) {
        if(!that.alive)
            return ;
        if(currentPhaseState != phaseState.run)
            return;

        that.time += dt;

        var player = that.findNearestPlayer();

        if(that.Y+height/2<player.Y)
        {
            that.alive = false;
            gSpawnExplosion(that.X,that.Y);     
            rocketTouchTop();
        }


        var fDt = dt / 1000.0;
        var fTime = that.time / 1000.0;

        that.angle += fDt;


        var speedCoef = 1.0;
        var dirPlayer = {x:player.X - that.X, y:player.Y - that.Y};
        var dirNormed = NormalizeVec2D(dirPlayer);
        var dir = MulVec2D(dirNormed, speedCoef);

        var controlCoef = 0.3;
        that.speed.x = that.speed.x * (1.0 - controlCoef) + dir.x * controlCoef;
        that.speed.y = that.speed.y * (1.0 - controlCoef) + dir.y * controlCoef;
        that.speed = MulVec2D(NormalizeVec2D(that.speed),speedCoef);
        that.speed.y = - (2 + currentLevel / 6);

        that.X += that.speed.x;
        that.Y += that.speed.y;

        for (var i = 0; i < players.length; i++) 
        {
            if(players[i].alive==true)
            {
                var player = players[i];
                var dirPlayer = {x:player.X - that.X, y:player.Y - that.Y};
                var distPlayer = NormVec2D(dirPlayer);

                if(distPlayer<50)
                {
                    var explosionCoef = 10.0;
                    if(dirPlayer.x<0)
                        player.speed.x = -2;
                    else
                        player.speed.x = 2;

                    player.speed.y = -(5 + currentLevel / 6);;
                    that.alive = false;
                    gSpawnExplosion(that.X,that.Y);
                }
            }
        }

    }
    
    that.draw = function() {
        if(!that.alive)
            return;
        if(currentPhaseState != phaseState.run)
            return;

        try {
            var x = Math.round(that.X - camX - that.width / 2);
            var y = Math.round(that.Y - camY - that.height / 2);
            ctx.drawImage(that.image,  x , y, that.width, that.height);
        } 
        catch (e) {
        }
        ;
   
    }
}


var rockets =  new Array();
for (var i = 0; i<30; i++) {
    rockets[i] = new Rocket();
}
 
// Turret
function Turret(offset) {
    var that = this;
    that.image = new Image();
    
    that.image.src = "tower.png"
    that.width = 64;
    that.height = 64;
    that.X = 0;
    that.Y = 0;
    that.interval = 0;
    that.time = 0;
    that.spawnTimeLeft = 0;
    that.speed = {x:0, y:0};
    that.gravity = 9;
    that.angle = 1;
    that.alive = false;
    that.period = 1000;
    that.offsetMax = 2000;
    that.offset = (gRNG.next() * that.offsetMax) % that.offsetMax;
    that.rocket = 0;

    that.restart = function() {
        that.time = 0;
        that.spawnTimeLeft = that.offset;
        that.rocket = 0;
    }
    
    that.restart = function() {
        that.time = 0;
        that.spawnTimeLeft = that.offset;
        that.rocket = 0;
    }

    that.spawn = function(x, y) {
        that.X = x;
        that.Y = y;
        that.alive = true;
    }
    that.spawnRocket  = function() {
        if(!that.alive)
            return false;
        if(that.rocket==0 || that.rocket.alive==false)
        {
            that.rocket = gSpawnRocket(that.X, that.Y);
            return true;
        }
        return false;
    }
    
    that.update = function(dt) {
        if(!that.alive)
            return ;
        if(currentPhaseState != phaseState.run)
            return;

        that.time += dt;
        that.spawnTimeLeft -= dt;
        if(that.spawnTimeLeft<0)
        {
            if(that.spawnRocket())
                that.spawnTimeLeft +=  that.period;
            else
                that.spawnTimeLeft +=  100; //retry soon
            
        }

        var fDt = dt / 1000.0;
        var fTime = that.time / 1000.0;
    }
    
    that.draw = function() {
        if(!that.alive)
            return;
        try {
            var x = Math.round(that.X - camX - that.width / 2);
            var y = Math.round(that.Y - camY - that.height / 2);
            ctx.drawImage(that.image,  x , y, that.width, that.height);
        } 
        catch (e) {
        }
        ;
   
    }

}

var turrets =  new Array();
for (var i = 0; i<30; i++) {
    turrets[i] = new Turret(i);
}
 
// Explosion
function Explosion() {
    var that = this;
    
    that.images =  new Array();
    for (var i = 0; i < 5; i++) {
        that.images[i] = new Image();
        that.images[i].src = "explo" + i +".png"
    };

    that.width = 64;
    that.height = 64;
    that.X = 0;
    that.Y = 0;
    that.time = 0;
    that.alive = false;
    that.frame = 0;
    that.fps = 15;

    that.reset = function() {
        that.time = 0;
        that.alive = false;
    }
    
    that.spawn = function(x, y) {
        that.X = x;
        that.Y = y;
        that.alive = true;
    }
    
    that.update = function(dt) {
        
        if(!that.alive)
            return ;
        if(currentPhaseState != phaseState.run)
            return;

        that.time += dt;
        var fDt = dt / 1000.0;
        var fTime = that.time / 1000.0;
        that.frame = Math.round(fTime * that.fps);
        if(that.frame >= that.images.length )
        {
            that.reset();
        }
    }
    
    that.draw = function() {
        if(!that.alive)
            return;
        if(currentPhaseState != phaseState.run)
            return;

        try {
            var image = that.images[that.frame];
            var x = Math.round(that.X - camX - that.width / 2);
            var y = Math.round(that.Y - camY - that.height / 2);
            ctx.drawImage(image,  x , y, that.width, that.height);
        } 
        catch (e) {
        }
        ;
   
    }

}

var explosions =  new Array();
for (var i = 0; i<30; i++) {
    explosions[i] = new Explosion();
}

// GamePlay
function playerTouchGround() {
    currentTimeLeft = levelDuration; //reset timer
}

function rocketTouchTop() {
    lifeLeft --;
    if(lifeLeft<=0)
    {
        lifeLeft = 0;
        currentPhaseState = phaseState.fail;
    }
}

function clearTurrets() {
    for (var i = 0; i < turrets.length; i++) {
        turrets[i].alive = false;
    };
}

function clearRockets() {
    for (var i = 0; i < rockets.length; i++) {
        rockets[i].alive = false;
    };
}

function newPhase() {
    for (var i = 0; i < players.length; i++) {
        players[i].alive = false;
    };
    clearRockets();
    for (var i = 0; i < turrets.length; i++) {
        turrets[i].restart();
    };  


    var spawnOffset = 0.8 * width / (currentLevel + 1);
    for (var i = 0; i < currentLevel; i++) {
        var x = (i + 0.5 - currentLevel / 2) * spawnOffset ;
        gSpawnTurret(x ,height / 2);
    }
    gSpawnPlayer(0,100);

     currentTimeLeft = levelDuration;
}

function nextButton() {
    clearTurrets();
    clearRockets();
}

function newGame() {
    currentPhaseState = phaseState.startScreen;
    currentLevel = startingLevel;
    bonusJumpCount = 1;
}

function nextLevel() {
    bonusJumpCount++;
    currentLevel++;
    newPhase();
    clearTurrets();

}


function GetTurretCount() {
    var res = 0;
    for (var i = 0; i < turrets.length; i++) {
        if(turrets[i].alive==true)
        {
            res++
        }
    };
    return res;
}

function gSpawnPlayer(x,y) {
    for (var i = 0; i < players.length; i++) {
        if(players[i].alive==false)
        {
            players[i].spawn(x , y );
            return players[i];
        }
    };
    return 0; 
}

function gSpawnRocket(x,y) {
    for (var i = 0; i < rockets.length; i++) {
        if(rockets[i].alive==false)
        {
            rockets[i].spawn(x , y );
            return rockets[i];
        }
    };
    return 0; 
}

function gSpawnTurret(x,y) {
    for (var i = 0; i < turrets.length; i++) {
        if(turrets[i].alive==false)
        {
            turrets[i].spawn(x , y );
            return;
        }
    };
}

function gSpawnExplosion(x,y) {
    for (var i = 0; i < explosions.length; i++) {
        if(explosions[i].alive==false)
        {
            explosions[i].spawn(x , y );
            return;
        }
    };
}

// Event
function onClickUpEvent() {
    if(currentPhaseState==phaseState.run)
        return;

    switch(currentPhaseState)
    {
    case phaseState.startScreen:
        bonusJumpCount = 1;
        currentLevel = startingLevel;
        lifeLeft = 13;
        clearTurrets();
        newPhase();
        currentPhaseState = phaseState.run;
        helpTime = 2000;
      break;
    case phaseState.setup:
      break;
    case phaseState.run:
      break;
    case phaseState.fail:
        currentPhaseState = phaseState.startScreen;
      break;
    case phaseState.succeed:
        nextLevel();
        newPhase();
        currentPhaseState = phaseState.run;
      break;
    default:
    }


}


addEventListener('keydown', function (e) {
    var keyCode = e.keyCode;
    keysDown[keyCode] = true;
    if(keyCode==arrow.left || keyCode==arrow.right)
        helpTime = 0;
}, false);

addEventListener('keyup', function (e) {
    var keyCode = e.keyCode;
    keysDown[keyCode] = false;

    if(keyCode==32)
        onClickUpEvent();


}, false);


function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}


function ev_mousemove(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    mouseX = x;
    mouseY = y;
}

c.addEventListener('mousemove', ev_mousemove, false);



function mouseClickDown(event) {
}

c.addEventListener("mousedown", mouseClickDown, false);

function mouseClickUp(event) {
    onClickUpEvent();
}

c.addEventListener("mouseup", mouseClickUp, false);

// UI
var helpType = {title: 0, attack: 2, succeed: 4, fail: 5};

var keyImage = new Image();
keyImage.src = "key.png";
var keySizeX = 32;
var keySizeY = 32;

function renderTextShadowed(textVal, textPosX, textPosY, textColor) {
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillText( textVal, textPosX + 3, textPosY + 3);
    ctx.fillStyle = textColor;
    ctx.fillText( textVal, textPosX, textPosY);
}

function renderTime(time) {
   // var player = players[0];

    var space = 10;
    var textY = space;
    ctx.font = "bold 80px Helvetica";
    ctx.textAlign = 'left';
    ctx.textBaseline = "top";
    var val = (time/1000).toFixed(2)

    renderTextShadowed(val + "'", space, textY,  "#FFFFFF");
    textY += 80;


    textY = space;
    ctx.font = "bold 30px Helvetica";
    ctx.textAlign = 'right';
    ctx.textBaseline = "top";
    var textVal = lifeLeft + " life";
    if(lifeLeft>1)
        textVal = lifeLeft + " lifes";
    renderTextShadowed(textVal, width - space, textY,  "#FFFFFF");
    textY += 30;
    var textVal = bonusJumpCount + " jump";
    if(bonusJumpCount>1)
        textVal = bonusJumpCount + " jumps";
    renderTextShadowed(textVal, width - space,  textY,  "#FFFFFF");
    textY += 30;
    renderTextShadowed(heightMax.toFixed(0) + " m", width - space,  textY,  "#FFFFFF");

}

function renderHelp(HelpType) {
    
    ctx.textBaseline = "top";

    switch(HelpType)
    {
        case helpType.title:
            var h = 400;
            var space = 10;
            var margin = 10;
            var y = height /2 + space - h / 2;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect( space, y , width - space * 2, h);
            y += margin;

            //y+= 50;
            ctx.textAlign = "center";
            ctx.font = "bold 60px Helvetica";
            ctx.fillStyle =  "#FFFFFF";
            renderTextShadowed("UXU", width/2, y, "#FFFFFF");
            y += 60;
            ctx.font = "italic 30px Helvetica";
            ctx.fillText("protect cuteness !", width/2, y);
            ctx.font = "bold 30px Helvetica";
            y += 80;
            x = margin + space;
            ctx.textAlign = "left";
            ctx.fillText(". Jump on rockets", x, y);
            y += 40;
            ctx.fillText(". Do not let any rocket reach the sky", x, y);
            y += 80;
            ctx.textAlign = "center";
            ctx.fillText("Press Space to continue...", width/2, y);
        break;
        case helpType.attack:
            if(helpTime<=0)
                return;
            var h = 120;
            var space = 10;
            var margin = 10;
            var y = height - h - space;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect( space, y , width - space * 2, h);
            y += margin;

            var x = space + margin;//width / 2 - 20; 
            ctx.textAlign = "left";
            ctx.font = "bold 30px Helvetica";
            ctx.fillStyle =  "#FFFFFF";
            ctx.fillText(" to move", x + 150, y);
            y+= 5;
            ctx.textAlign = "center";
            ctx.drawImage(keyImage, x, y, keySizeX , keySizeY);
            ctx.font = "bold 30px Helvetica";
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillText("<", x + 15, y - 1);
            x += 40; 
            ctx.drawImage(keyImage, x, y, keySizeX , keySizeY);
            ctx.font = "bold 30px Helvetica";
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillText(">", x + 19, y - 1);

            ctx.textAlign = "left";
            y+= 50;
            ctx.fillStyle =  "#FFFFFF";
             x = space + margin;//width / 2 - 20; 
            ctx.fillText("[Space]", x, y);
            ctx.fillText(" to use bonus jump", x + 150, y);
        break;
        case helpType.succeed:
            var h = 300;
            var space = 10;
            var margin = 10;
            var y = height /2 + space - h / 2;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect( space, y , width - space * 2, h);
            y += margin;

            y+= 10;
            ctx.textAlign = "center";
            ctx.font = "bold 60px Helvetica";
            ctx.fillStyle =  "#FFFFFF";
            ctx.fillText("Great !", width/2, y);
            y += 80;
            ctx.font = "bold 30px Helvetica";
            ctx.fillText("Next level : " + (currentLevel + 1), width/2, y);
            y += 120;
            ctx.fillText("press space to continue...", width/2, y);
        break;
        case helpType.fail:
            var h = 350;
            var space = 10;
            var margin = 10;
            var y = height /2 + space - h / 2;
            ctx.fillStyle = "rgba(0,0,0,0.5)";
            ctx.fillRect( space, y , width - space * 2, h);
            y += margin;

            y+= 10;
            ctx.textAlign = "center";
            ctx.font = "bold 60px Helvetica";
            ctx.fillStyle =  "#FFFFFF";
            ctx.fillText("Oooops !", width/2, y);
            y += 100;
            ctx.font = "bold 30px Helvetica";
            ctx.fillText("Level : " + (currentLevel + 1), width/2, y);
            y += 30;
            ctx.fillText("Highest Jump : " + heightMax.toFixed(0), width/2, y);
            y += 120;
            ctx.fillText("press space to continue...", width/2, y);
        break;

    }


};



//////////////////////////////////////////////////////////////////////////////////////////////////
//
// Loop
//
//////////////////////////////////////////////////////////////////////////////////////////////////

var oldCamX = 0;
var oldCamY = 0;



var GameLoop = function() {
    
    var thisFrameTime = (thisLoop = new Date) - lastLoop;
    frameTime += (thisFrameTime - frameTime) / filterStrength;
    lastLoop = thisLoop;
    
    var dt = 1000 / 100;
    gTime += dt;
    //helpTime -= dt;



    for (var i = 0; i < players.length; i++) {
        players[i].update(dt);
    };
    for (var i = 0; i < rockets.length; i++) {
        rockets[i].update(dt);
    };
    for (var i = 0; i < turrets.length; i++) {
        turrets[i].update(dt);
    };
    for (var i = 0; i < turrets.length; i++) {
        explosions[i].update(dt);
    };


    //clear(0, 100);
    var player = players[0];
    clear(0, player.Y+150);
    var playerHeight = height /2 - player.Y ;
    if(playerHeight > heightMax)
        heightMax = playerHeight;


    for (var i = 0; i < players.length; i++) {
        players[i].draw();
    };
    for (var i = 0; i < rockets.length; i++) {
        rockets[i].draw();
    };
    for (var i = 0; i < turrets.length; i++) {
        turrets[i].draw();
    };
    for (var i = 0; i < turrets.length; i++) {
        explosions[i].draw();
    };

    if(currentPhaseState==phaseState.run)
    {
        currentTimeLeft -= dt;
        if(currentTimeLeft<0)
        {
            currentPhaseState = phaseState.succeed;
            currentTimeLeft = levelDuration; 
        }
        renderTime(currentTimeLeft);
    }

    if(currentPhaseState==phaseState.startScreen)
        renderHelp(helpType.title);
    if(currentPhaseState==phaseState.succeed)
        renderHelp(helpType.succeed);
    if(currentPhaseState==phaseState.fail)
        renderHelp(helpType.fail);
    if(currentPhaseState==phaseState.run)
        renderHelp(helpType.attack);

    gLoop = setTimeout(GameLoop, dt/4);
}

GameLoop();


