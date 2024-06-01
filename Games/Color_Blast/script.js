(function(window){
    // Main game object
    var Game = {
  
      // Initialize the game
      init: function(){
        // Get the canvas element and set its dimensions
        this.c = document.getElementById("game");
        this.c.width = this.c.width;
        this.c.height = this.c.height;
        this.ctx = this.c.getContext("2d");
  
        // Set game properties
        this.color = "rgba(20,20,20,.7)";
        this.bullets = [];
        this.enemyBullets = [];
        this.enemies = [];
        this.particles = [];
        this.bulletIndex = 0;
        this.enemyBulletIndex = 0;
        this.enemyIndex = 0;
        this.particleIndex = 0;
        this.maxParticles = 10;
        this.maxEnemies = 6;
        this.enemiesAlive = 0;
        this.currentFrame = 0;
        this.maxLives = 3;
        this.life = 0;
  
        // Bind event listeners
        this.binding();
  
        // Create player instance
        this.player = new Player();
        this.score = 0;
        this.paused = false;
        this.shooting = false;
        this.oneShot = false;
        this.isGameOver = false;
  
        // Compatibility with different browsers for requestAnimationFrame
        this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame;
  
        // Create initial enemies
        for(var i = 0; i<this.maxEnemies; i++){
          new Enemy();
          this.enemiesAlive++;
        }
  
        // Make player invincible for a short time
        this.invincibleMode(2000);
  
        // Start the game loop
        this.loop();
      },
  
      // Bind event listeners to window and canvas
      binding: function(){
        window.addEventListener("keydown", this.buttonDown);
        window.addEventListener("keyup", this.buttonUp);
        window.addEventListener("keypress", this.keyPressed);
        this.c.addEventListener("click", this.clicked);
      },
  
      // Handle canvas click event
      clicked: function(){
        if(!Game.paused) {
          Game.pause();
        } else {
          if(Game.isGameOver){
            Game.init();
          } else {
            Game.unPause();
            Game.loop();
            Game.invincibleMode(1000);
          }
        }
      },
  
      // Handle key press events
      keyPressed: function(e){
        if(e.keyCode === 32){  // Spacebar key
          if(!Game.player.invincible  && !Game.oneShot){
            Game.player.shoot();
            Game.oneShot = true;
          }
          if(Game.isGameOver){
            Game.init();
          }
          e.preventDefault();
        }
      },
  
      // Handle key release events
      buttonUp: function(e){
        if(e.keyCode === 32){  // Spacebar key
          Game.shooting = false;
          Game.oneShot = false;
          e.preventDefault();
        }
        if(e.keyCode === 37 || e.keyCode === 65){  // Left arrow or 'A' key
          Game.player.movingLeft = false;
        }
        if(e.keyCode === 39 || e.keyCode === 68){  // Right arrow or 'D' key
          Game.player.movingRight = false;
        }
      },
  
      // Handle key down events
      buttonDown: function(e){
        if(e.keyCode === 32){  // Spacebar key
          Game.shooting = true;
        }
        if(e.keyCode === 37 || e.keyCode === 65){  // Left arrow or 'A' key
          Game.player.movingLeft = true;
        }
        if(e.keyCode === 39 || e.keyCode === 68){  // Right arrow or 'D' key
          Game.player.movingRight = true;
        }
      },
  
      // Generate a random number between min and max
      random: function(min, max){
        return Math.floor(Math.random() * (max - min) + min);
      },
  
      // Make the player invincible for a specified time
      invincibleMode: function(s){
        this.player.invincible = true;
        setTimeout(function(){
          Game.player.invincible = false;
        }, s);
      },
  
      // Check for collision between two objects
      collision: function(a, b){
        return !(
          ((a.y + a.height) < (b.y)) ||
          (a.y > (b.y + b.height)) ||
          ((a.x + a.width) < b.x) ||
          (a.x > (b.x + b.width))
        );
      },
  
      // Clear the canvas
      clear: function(){
        this.ctx.fillStyle = Game.color;
        this.ctx.fillRect(0, 0, this.c.width, this.c.height);
      },
  
      // Pause the game
      pause: function(){
        this.paused = true;
      },
  
      // Unpause the game
      unPause: function(){
        this.paused = false;
      },
  
      // Display game over screen
      gameOver: function(){
        this.isGameOver = true;
        this.clear();
        var message = "Game Over";
        var message2 = "Score: " + Game.score;
        var message3 = "Click or press Spacebar to Play Again";
        this.pause();
        this.ctx.fillStyle = "white";
        this.ctx.font = "bold 30px Lato, sans-serif";
        this.ctx.fillText(message, this.c.width/2 - this.ctx.measureText(message).width/2, this.c.height/2 - 50);
        this.ctx.fillText(message2, this.c.width/2 - this.ctx.measureText(message2).width/2, this.c.height/2 - 5);
        this.ctx.font = "bold 16px Lato, sans-serif";
        this.ctx.fillText(message3, this.c.width/2 - this.ctx.measureText(message3).width/2, this.c.height/2 + 30);
      },
  
      // Update the score display
      updateScore: function(){
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Lato, sans-serif";
        this.ctx.fillText("Score: " + this.score, 8, 20);
        this.ctx.fillText("Lives: " + (this.maxLives - this.life), 8, 40);
      },
  
      // Main game loop
      loop: function(){
        if(!Game.paused){
          Game.clear();
          // Update and draw enemies
          for(var i in Game.enemies){
            var currentEnemy = Game.enemies[i];
            currentEnemy.draw();
            currentEnemy.update();
            if(Game.currentFrame % currentEnemy.shootingSpeed === 0){
              currentEnemy.shoot();
            }
          }
          // Update and draw enemy bullets
          for(var x in Game.enemyBullets){
            Game.enemyBullets[x].draw();
            Game.enemyBullets[x].update();
          }
          // Update and draw player bullets
          for(var z in Game.bullets){
            Game.bullets[z].draw();
            Game.bullets[z].update();
          }
          // Draw the player, flashing if invincible
          if(Game.player.invincible){
            if(Game.currentFrame % 20 === 0){
              Game.player.draw();
            }
          } else {
            Game.player.draw();
          }
          // Update and draw particles
          for(var i in Game.particles){
            Game.particles[i].draw();
          }
          // Update player and score
          Game.player.update();
          Game.updateScore();
          // Request next frame
          Game.currentFrame = Game.requestAnimationFrame.call(window, Game.loop);
        }
      }
  
    };
  
    // Player constructor function
    var Player = function(){
      this.width = 60;
      this.height = 20;
      this.x = Game.c.width/2 - this.width/2;
      this.y = Game.c.height - this.height;
      this.movingLeft = false;
      this.movingRight = false;
      this.speed = 8;
      this.invincible = false;
      this.color = "white";
    };
  
    // Handle player death
    Player.prototype.die = function(){
      if(Game.life < Game.maxLives){
        Game.invincibleMode(2000);
        Game.life++;
      } else {
        Game.pause();
        Game.gameOver();
      }
    };
  
    // Draw the player
    Player.prototype.draw = function(){
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  
    // Update player position and handle shooting
    Player.prototype.update = function(){
      if(this.movingLeft && this.x > this.width/2){
        this.x -= this.speed;
      }
      if(this.movingRight && this.x + this.width < Game.c.width - this.width/2){
        this.x += this.speed;
      }
      if(Game.shooting && Game.currentFrame % 10 === 0){
        this.shoot();
      }
      for(var i in Game.enemyBullets){
        var currentBullet = Game.enemyBullets[i];
        if(Game.collision(currentBullet, this) && !Game.player.invincible){
          this.die();
          delete Game.enemyBullets[i];
        }
      }
    };
  
    // Shoot a bullet
    Player.prototype.shoot = function(){
      Game.bullets[Game.bulletIndex] = new Bullet(this.x + this.width/2);
      Game.bulletIndex++;
    };
  
    // Bullet constructor function
    var Bullet = function(x){
      this.width = 8;
      this.height = 20;
      this.x = x;
      this.y = Game.c.height - 10;
      this.vy = 8;
      this.index = Game.bulletIndex;
      this.active = true;
      this.color = "white";
    };
  
    // Draw the bullet
    Bullet.prototype.draw = function(){
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  
    // Update bullet position and remove if out of bounds
    Bullet.prototype.update = function(){
      this.y -= this.vy;
      if(this.y < 0){
        delete Game.bullets[this.index];
      }
    };
  
    // Enemy constructor function
    var Enemy = function(){
      this.width = 60;
      this.height = 20;
      this.x = Game.random(0, (Game.c.width - this.width));
      this.y = Game.random(10, 40);
      this.vy = Game.random(1, 3) * .1;
      this.index = Game.enemyIndex;
      Game.enemies[Game.enemyIndex] = this;
      Game.enemyIndex++;
      this.speed = Game.random(2, 3);
      this.shootingSpeed = Game.random(30, 80);
      this.movingLeft = Math.random() < 0.5 ? true : false;
      this.color = "hsl("+ Game.random(0, 360) +", 60%, 50%)";
    };
  
    // Draw the enemy
    Enemy.prototype.draw = function(){
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  
    // Update enemy position and handle direction change
    Enemy.prototype.update = function(){
      if(this.movingLeft){
        if(this.x > 0){
          this.x -= this.speed;
          this.y += this.vy;
        } else {
          this.movingLeft = false;
        }
      } else {
        if(this.x + this.width < Game.c.width){
          this.x += this.speed;
          this.y += this.vy;
        } else {
          this.movingLeft = true;
        }
      }
      
      // Handle collision with player bullets
      for(var i in Game.bullets){
        var currentBullet = Game.bullets[i];
        if(Game.collision(currentBullet, this)){
          this.die();
          delete Game.bullets[i];
        }
      }
    };
  
    // Handle enemy death
    Enemy.prototype.die = function(){
      this.explode();
      delete Game.enemies[this.index];
      Game.score += 15;
      Game.enemiesAlive = Game.enemiesAlive > 1 ? Game.enemiesAlive - 1 : 0;
      if(Game.enemiesAlive < Game.maxEnemies){
        Game.enemiesAlive++;
        setTimeout(function(){
          new Enemy();
        }, 2000);
      }
    };
  
    // Create explosion effect on enemy death
    Enemy.prototype.explode = function(){
      for(var i=0; i<Game.maxParticles; i++){
        new Particle(this.x + this.width/2, this.y, this.color);
      }
    };
  
    // Shoot a bullet from the enemy
    Enemy.prototype.shoot = function(){
      new EnemyBullet(this.x + this.width/2, this.y, this.color);
    };
  
    // Enemy bullet constructor function
    var EnemyBullet = function(x, y, color){
      this.width = 8;
      this.height = 20;
      this.x = x;
      this.y = y;
      this.vy = 6;
      this.color = color;
      this.index = Game.enemyBulletIndex;
      Game.enemyBullets[Game.enemyBulletIndex] = this;
      Game.enemyBulletIndex++;
    };
  
    // Draw the enemy bullet
    EnemyBullet.prototype.draw = function(){
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(this.x, this.y, this.width, this.height);
    };
  
    // Update enemy bullet position and remove if out of bounds
    EnemyBullet.prototype.update = function(){
      this.y += this.vy;
      if(this.y > Game.c.height){
        delete Game.enemyBullets[this.index];
      }
    };
  
    // Particle constructor function
    var Particle = function(x, y, color){
      this.x = x;
      this.y = y;
      this.vx = Game.random(-5, 5);
      this.vy = Game.random(-5, 5);
      this.color = color || "orange";
      Game.particles[Game.particleIndex] = this;
      this.id = Game.particleIndex;
      Game.particleIndex++;
      this.life = 0;
      this.gravity = .05;
      this.size = 40;
      this.maxlife = 100;
    };
  
    // Draw the particle and update its position and size
    Particle.prototype.draw = function(){
      this.x += this.vx;
      this.y += this.vy;
      this.vy += this.gravity;
      this.size *= .89;
      Game.ctx.fillStyle = this.color;
      Game.ctx.fillRect(this.x, this.y, this.size, this.size);
      this.life++;
      if(this.life >= this.maxlife){
        delete Game.particles[this.id];
      }
    };
  
    // Start the game
    Game.init();
  
  }(window));
  