
function Game(canvas, ctx, width, height){
    var that = this;
    var i;

    this.canvas = canvas;
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.mouse = {x: this.width/2, y: 0};
    this.e = {}; //raw data from event
    this.bulletsPool = [];
    for ( i = 0; i < 40; i++) {
        this.bulletsPool.push(new Bullet(1, 1, 5, 1, 1, 'rgba(0, 0, 0, 1)'));
    }
    this.enemiesPool = [];
    for (i = 0; i < 40; i++) {
        this.enemiesPool.push(new Enemy(1, 0, 26, 32, 'rgba(125, 50, 50, 1)'));
    }
    this.bullets = [];
    this.enemies = [];

    this.currentLevel = 0;
    this.levels = [{
        bulletsTimeout: 400,
        enemiesTimeout: 600,
        startEnemies: 30,
        enemies: 30
    }];
    this.tower = new Tower(this.width/2, this.height, 10, 20, 'rgb(0,0,0)');
    this.viewfinder = new Viewfinder(0, 0, 20, 20, 'rgb(0,0,0)');
    this.addEnemy = 1;
    this.score = 0;
    this.lifes = 3;
    this.beforeStart = true;
    this.tweetHandler = false;

    this.lastBulletTime = 0;
    this.lastEnemyTime = 0;

     this.bulletsTimeout = 400;
     this.enemiesTimeout = 600;

     this.canvas.addEventListener('click', Game.prototype.startGame.bind(this));
        this.canvas.addEventListener('touchstart', Game.prototype.startGame.bind(this));

         this.resetGameListener = this.resetGame.bind(this);
        this.canvas.addEventListener('click', this.resetGameListener, false);
        this.canvas.addEventListener('touchstart', this.resetGameListener, false);
}

Game.prototype.resetGame = function() {
    if(this.lifes > 0) return;
    this.beforeStart = true;
    this.currentLevel = 0;
    this.updateLevel();
    this.score = 0;
    this.lifes = 3;
    this.canvas.removeEventListener('click', this.resetGameListener, false);
};

Game.prototype.startFactories = function(){

};

Game.prototype.image = new Image();
Game.prototype.image.src = 'sheet_1.png';

Game.prototype.clear = function(){
    this.ctx.fillStyle = 'rgb(245,245,245)';
    this.ctx.fillRect( 0, 0, this.width, this.height );

};

Game.prototype.tile = function(){
    if(!this.tileCanvas){
        this.tileCanvas = document.createElement( 'canvas' );

        this.tileCanvas.width = this.width;
        this.tileCanvas.height = this.height;

        this.tileCanvasCtx = this.tileCanvas.getContext( '2d' );

        for (x = 0; x <= this.width; x = x + 16) {
            for (y = 0; y <= this.height; y = y + 16) {
                this.tileCanvasCtx.drawImage(this.image, x, y);
            }
        }
        //document.body.appendChild( this.tileCanvas );
    }

    this.ctx.drawImage(this.tileCanvas, 0, 0);

};

Game.prototype.startGame = function(e) {

    if(this.blockClick){
        return;
    }
    this.beforeStart = false;
};



Game.prototype.frame = function(date){
    if(this.beforeStart){
        this.clear();
        this.drawSplash(this.ctx);

        return;
    }
    if(this.lifes < 1){
        this.clear();
        this.drawResult(this.ctx);

        return;
    }

    this.update(date);
    this.draw(date);
};

Game.prototype.draw = function(date){
    var i = 0;
    //enemies
    var enemies = this.enemies;
    var l = ( enemies && enemies.length) ? enemies.length : 0;
    //Bullets
    var bullets = this.bullets;
    var bl = ( bullets && bullets.length) ? bullets.length : 0;
    this.tile();

    for (i = 0; i < l; i++) {
        enemies[i].draw(this.ctx, i, date);
    }


    //draw bullets
    for ( i = 0; i < bl; i++) {      
        bullets[i].draw(this.ctx, i);
    }

    this.drawInfo(this.ctx);

    // ** Add stuff you want drawn in the background all the time here **
    this.tower.draw(this.ctx, this.mouse);
    this.viewfinder.draw(this.ctx, this.mouse);
}


Game.prototype.update = function(date){
    //var that = this;
    var i, enemy;

    this.mouse = this.getMouse(this.e);

    var bulletDiff = date - this.lastBulletTime;


    if(this.addBullet || bulletDiff > this.bulletsTimeout){
        var mouse = this.mouse;
        var newBullet;

        this.bulletsTimeout -= 0.1;

        //todo
        var d = game.tower.getDiffs(mouse);
        var bx = game.tower.x + (20 * d.dx);
        var y = game.tower.y + (20 * d.dy);
        if(game.bulletsPool.length){

           newBullet = game.bulletsPool.pop();
           newBullet.x = bx;
           newBullet.y = y;
           newBullet.dx = d.dx;
           newBullet.dy = d.dy;
        }else{
            newBullet = new Bullet(bx, y, 5, d.dx, d.dy, 'rgba(0, 0, 0, 1)');
        }

        game.bullets.push( newBullet );
        this.addBullet = false;
        this.lastBulletTime = date;
    }

    var level = this.levels[this.currentLevel];


    var enemyDiff = date - this.lastEnemyTime;

    if(level.enemies && enemyDiff > this.enemiesTimeout){

        this.enemiesTimeout -= 0.9;

        var ex = Math.floor(Math.random() * (this.width - 26)) + 2;
        var newEnemy;

        if(game.enemiesPool.length){

           newEnemy = game.enemiesPool.pop();
           newEnemy.reset();
           newEnemy.x = ex;

        }else{
            newEnemy = new Enemy(ex, 0, 26, 32, 'rgba(125, 50, 50, 1)');
        }

        game.enemies.push( newEnemy );
        //this.addEnemy = false;
        this.lastEnemyTime = date;
        level.enemies--;
    }
    //enemies
    var enemies = this.enemies;
    var l = ( enemies && enemies.length) ? enemies.length : 0;
    //Bullets
    var bullets = this.bullets;
    var bl = ( bullets && bullets.length) ? bullets.length : 0;

    var collision = false;
    var yCollision = false;

    if(l && bl){
        for ( i = 0; i < l; i++) {
            enemy = enemies[i];
            if(enemy && enemy.live){
                for (var j = 0; j < bl; j++) {
                    var b = bullets[j];
                    if(b){
                        collision = false;
                        yCollision = false;

                        //a.y < b.y + b.height &&
                        // a.y + a.height > b.y
                        var eTopY = enemy.y;
                        var eBottomY = enemy.y + enemy.h;
                        var bTopY = b.y - b.w;
                        var bBottomY = b.y + b.w;
                        if( eTopY < bBottomY &&
                         eBottomY > bTopY){
                           //('y collision b:'+j+' e:'+i);
                           yCollision = true;

                        }

                        //look for collisions
                        var eLeftX = enemy.x;
                        var eRightX = enemy.x + enemy.w;
                        var bLeftX = b.x - b.w;
                        var bRightX = b.x + b.w;

                        if(yCollision &&
                         eLeftX < bRightX &&
                         eRightX > bLeftX ){
                           collision = true;

                        }



                        if(collision){
                            enemies[i].kill();
                            if(b){
                                this.bulletsPool.push(b);
                            }
                            bullets.splice(j, 1);
                            //j--;
                            this.score++;
                            break;
                        }

                    }
                }
            }
        }
    }

    for (i = 0; i < l; i++) {
      enemy = enemies[i];

      // We can skip the drawing of elements that have moved off the screen:
      if (!enemy || enemy.y > this.height ){

              //enemy at the bottom!!!!!
              if(enemy){
                this.lifes--;
              }
              if(enemy){
                  this.enemiesPool.push(enemy);
              }
              enemies.splice(i, 1);
              //i--;
              continue;

        }else{            
            if(enemy.toRemove){
                if(enemy){
                    this.enemiesPool.push(enemy);
                }
                enemies.splice(i, 1);
                //i--;
            }
        }

    }

    bl = ( bullets && bullets.length) ? bullets.length : 0;
    //draw bullets
    for ( i = 0; i < bl; i++) {
      var bullet = bullets[i];

      // We can skip the drawing of elements that have moved off the screen:
      if (!bullet || bullet.x > this.width || bullet.y > this.height ||
          bullet.x + bullet.w < 0 || bullet.y + bullet.h < 0 ){
              if(bullet){
                this.bulletsPool.push(bullet);
              }
              bullets.splice(i, 1);
              //i--;

        }
    }


    if(!level.enemies && !this.enemies.length){
     //todo change level
     this.changeLevel();
    }


};

Game.prototype.changeLevel = function(){

    this.currentLevel++;
    this.updateLevel();
};

Game.prototype.updateLevel = function(){
    //var that = this;
    while(this.enemies.length){
        this.enemiesPool.push(this.enemies.pop());
    }
    while(this.bullets.length){
        this.bulletsPool.push(this.bullets.pop());
    }
    this.beforeStart = true;
    if(!this.levels[this.currentLevel]){
    this.levels[this.currentLevel] = this.levels[this.currentLevel - 1];
    this.levels[this.currentLevel].enemiesTimeout -= 50;
    this.levels[this.currentLevel].bulletsTimeout -= 25;
    this.levels[this.currentLevel].enemies = this.levels[this.currentLevel].startEnemies += 10;
    }
    var level = this.levels[this.currentLevel];
    this.bulletsTimeout = level.bulletsTimeout;
    this.enemiesTimeout = level.enemiesTimeout;
    // this.blockClick = true;
    // setTimeout(Game.prototype.runClicks.bind(this), 200);
};

Game.prototype.runClicks = function() {
    this.blockClick = false;
};

Game.prototype.drawInfo = function(ctx){
    ctx.fillStyle = 'red';
    ctx.font = "bold 30pt Calibri";
    ctx.fillText(new Array(this.lifes+1).join("♥"), 20, this.height - 10);

    ctx.fillStyle = 'rgba(0,0,0, 0.9)';
    ctx.font = "bold 14pt Calibri";
    ctx.fillText("SCORE: " + this.score, this.width / 2 + 20, this.height - 10);

    ctx.fillStyle = 'rgba(0,0,0, 0.6)';
    ctx.font = "bold 12pt Calibri";
    ctx.fillText("Level: " + (this.currentLevel+1) + ' wave:'+this.levels[this.currentLevel].enemies, 10, 14);
};

Game.prototype.drawResult = function(ctx){
    ctx.fillStyle = 'red';
    ctx.font = "italic 30pt Calibri";
    ctx.fillText("GAME OVER!", 10, 90);
    ctx.font = "italic 20pt Calibri";
    ctx.fillText("Killed: " + this.score, 70, 140);
    ctx.fillStyle = 'blue';
    ctx.font = "italic 15pt Calibri";
    ctx.fillText("Click or tap to play again!", 20, 180);
};

Game.prototype.drawSplash = function(ctx){
    if(this.currentLevel === 0){

        ctx.fillStyle = 'black';
        ctx.font = "bold 20pt Calibri";
        ctx.fillText("Click or tap to start!", 10, 100);
        
    }else{
        ctx.fillStyle = 'black';
        ctx.font = "bold 18pt Calibri";
        ctx.fillText("Click or start level: " + (this.currentLevel+1) , 10, 100);
        
    }
};


Game.prototype.getMouse = function(e) {
  var element = canvas, offsetX = 0, offsetY = 0, mx, my;

  // Compute the total offset
  if (element.offsetParent !== undefined) {
    do {
      offsetX += element.offsetLeft;
      offsetY += element.offsetTop;
    } while ((element = element.offsetParent));
  }

  // Add padding and border style widths to offset
  // Also add the <html> offsets in case there's a position:fixed bar
  //offsetX += this.stylePaddingLeft + this.styleBorderLeft + this.htmlLeft;
  //offsetY += this.stylePaddingTop + this.styleBorderTop + this.htmlTop;
 if( e.targetTouches && e.targetTouches[0] ){
     mx = e.targetTouches[0].pageX - offsetX;
     my = e.targetTouches[0].pageY - offsetY;
 }else{
      mx = e.pageX - offsetX;
      my = e.pageY - offsetY;
 }

  // We return a simple javascript object (a hash) with x and y defined
  return {x: mx, y: my};
};


