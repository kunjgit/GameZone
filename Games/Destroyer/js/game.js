/*
//
// Thirteen Destroyer, an incredible (Ugly?) Html5 Retro Arcade Shoot 'Em Up!
// Author: Gabriele D'Arrigo.
// Contact: darrigo.g@gmail.com - acirdesign.com
//
*/

// Ok, here we Go, let's load all the game stuff at window on load!
window.addEventListener('load',function() {
        // Define an unique global object that contain all the game logic, assett and related stuff.
        var game = {};
                    // Here I initialize some object property: play state (1 = playng), score, and an object with the keys of the game.
                    game.playState = 0;
                    game.score = 0;
                    game.key = {
                        left:  37,
                        up:    38,
                        right: 39,
                        down:  40,
                        w:     87,
                        a:     65,
                        s:     83,
                        d:     68,
                        space: 32
                    };
                    // Declare an Array to store the pressed keys during the game.
                    game.pressedKeys = [];

                    // Array to store bullet shooted by the player and the enemies pushed by the game loop!
                    game.bullet  = [];
                    game.enemies = [];

                    // This two properties serves to calculate the game difficulty with a simple algorithm.
                    game.enemiesDestroyed = 0;
                    game.difficulty =  0;
                    
                    // Let's initialize the canvas object.
                    game.canvas = document.getElementById('gameCanvas');
                    game.canvas.width = 800;
                    game.canvas.height = 500;
                    game.ctx = game.canvas.getContext('2d');

                    // Now I'll start to declare all the game logic and method.

                    // Clamp limit the computation of an expression to a limit range of value; used to limit player and enemies movement inside the canvas.
                    game.clamp = function  (value, min, max) {
                            if(value > max) {
                                value = max;
                            };

                            if(value < min) {
                                value = min;
                            };

                            return value;
                    };

                    // Canvas initialization with game keyboard control.
                    game.init = function() {
                        game.ctx.font = '32px Arial';
                        game.ctx.fillStyle = '#FFFFFF'
                        game.ctx.fillText('PRESS SPACEBAR TO START THE GAME', 100, 100);
                        game.ctx.fillText('MOVE WITH ARROW KEYS', 180, 200);
                        game.ctx.fillText('SHOOT IN 4 DIRECTION WITH WASD', 120, 300);
                        game.ctx.fillText('GOOD LUCK!', 290, 400);
                    };

                    // This method is used to start the game.
                    game.start = function() {

                        // Let's set the play state to 1.
                        game.playState = 1;

                        // Game loop, this executs two main game's function every 30ms: game.draw() that design assets on the screen,
                        // and game.update() that update every object and game information.
                        game.loop = setInterval(function() {
                            game.draw();
                            game.update();
                        }, 30);
                        

                        // Difficulty loop; every 13 seconds difficulty is increased by one point.
                        game.difficultyLoop = setInterval(function() {
                            game.difficulty += 1;
                            var difficultyDiv = document.getElementById('difficulty').innerHTML = game.difficulty;
                        }, 13000);

                        // Every two second the enemy loop spawn enemies on a random position of the screen. The number of enemies is based on the difficulty 
                        game.enemyLoop = setInterval(function() {
                            for (var i = game.difficulty; i >= 0; i--) {
                                game.enemies.push(game.createEnemies()); 
                            };
                        }, 2000);
                    };

                    // Reset method, used when game is over.
                    game.reset = function() {
                        // Clear all game loop.
                        clearInterval(game.loop);
                        clearInterval(game.enemyLoop);
                        clearInterval(game.difficultyLoop);

                        // Set play state to 0.
                        game.playState = 0;

                        // Restore player object's value and empty enemies and bullet array.
                        game.player.x = 320;
                        game.player.y = 240;
                        game.player.shield = 50;
                        game.bullet  = [];
                        game.enemies = [];
                        game.enemiesDestroyed = 0;
                        game.difficulty =  0;
                        game.score = 0;

                        // Update HUD on screen
                        var shield = document.getElementById('shield').innerHTML = game.player.shield;
                        var difficultyDiv = document.getElementById('difficulty').innerHTML = game.difficulty;
                        var score = document.getElementById('score').innerHTML = game.score;
                    };

                    // Let's start with drawing method:
                    game.draw = function() {
                        // Refresh the canvas every tick of the game loop!
                        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);

                        // Draw Background.
                        game.background();

                        // Draw the player.
                        game.player.draw();

                        // Draw each bullet stored in bullets array.
                        for (var i = game.bullet.length - 1; i >= 0; i--) {
                            game.bullet[i].draw();
                        };

                        // Draw each enemies stored in enemy array.
                        for (var i = game.enemies.length - 1; i >= 0; i--) {
                            game.enemies[i].draw();
                        };
                    };

                    // Update method: here there are the main function of the game!
                    game.update = function() {
                        // Player can shot in four direction with WASD keys.
                        // When one of the key is pressed, game.pressedKeys[] is populated with a key value pair: the key is the keycode of the pressed keys,
                        // the value is true for key down event and false for key up event.

                        // Every time player shoots I push a bullet object into game.bullet[] array. We must pass x and y position that will be used by
                        // bullet constructor function to calculate coordinates of the initial bullet position (player ship's center position).
                        // I pass to constructor function  directionX and directionY value too, to permits bullets to be drawn and shooted on all 4 axis.
                        // The anonymous function that push bullets in bullet's array is executed within 500ms delay to prevent the player to continuosly spam
                        // all the star field with bullets, and to distantiate bullets from each others
                        if(game.pressedKeys[game.key.w]) {
                            setTimeout(function() {
                                game.bullet.push(game.createBullet(game.player.shootFromX(), game.player.shootFromY(), 0, -1));
                            },500);
                            //When player shoot, all other keys of WASD combination will be set to false, to prevent to shoot in three or four direction contemporaneally.
                            game.pressedKeys[game.key.a] = false;
                            game.pressedKeys[game.key.s] = false;
                            game.pressedKeys[game.key.d] = false;
                        };

                        if(game.pressedKeys[game.key.a]) {
                            setTimeout(function() {
                                game.bullet.push(game.createBullet(game.player.shootFromX(), game.player.shootFromY(), -1, 0));
                            },500);

                            game.pressedKeys[game.key.w] = false;
                            game.pressedKeys[game.key.s] = false;
                            game.pressedKeys[game.key.d] = false;
                        };

                        if(game.pressedKeys[game.key.s]) {
                            setTimeout(function() {
                                game.bullet.push(game.createBullet(game.player.shootFromX(), game.player.shootFromY(), 0, 1));
                            },500);

                            game.pressedKeys[game.key.a] = false;
                            game.pressedKeys[game.key.w] = false;
                            game.pressedKeys[game.key.d] = false;
                        };

                        if(game.pressedKeys[game.key.d]) {
                            setTimeout(function() {
                                game.bullet.push(game.createBullet(game.player.shootFromX(), game.player.shootFromY(), 1, 0));
                            },500);

                            game.pressedKeys[game.key.a] = false;
                            game.pressedKeys[game.key.s] = false;
                            game.pressedKeys[game.key.w] = false;
                        };

                        // Function to achieve player's movement with ARROW keys
                        if(game.pressedKeys[game.key.left]) {
                             game.player.x -= game.player.xVelocity;
                        };

                        if(game.pressedKeys[game.key.up]) {
                            game.player.y -= game.player.yVelocity;
                        };

                        if(game.pressedKeys[game.key.right]) {
                            game.player.x += game.player.xVelocity;
                        };

                        if(game.pressedKeys[game.key.down]) {
                            game.player.y += game.player.yVelocity;
                        };

                        // When player's ship hit the boundaries of canvas, ship's shield go down!
                        if(game.player.x <= 10 || game.player.x + game.player.width >= game.canvas.width - 10 || 
                           game.player.y <= 10 || game.player.y + game.player.height >= game.canvas.height - 10) {
                            game.player.shield -= 1;
                            game.player.checkShield();
                        };
                        // Limit player movement within the canvas.
                        game.player.x = game.clamp(game.player.x, 10, game.canvas.width - game.player.width -10);
                        game.player.y = game.clamp(game.player.y, 10, game.canvas.height - game.player.height -10)

                        // Update the position of every bullet stored in game.bullet[] array.
                        for (var i = game.bullet.length - 1; i >= 0; i--) {
                            game.bullet[i].update();

                            // If bullet status is false (when It is outside the canvas or when It collides with an enemy) than it is removed from the array.
                            if(game.bullet[i].active === false) {
                                game.bullet.splice(i, 1);
                            };
                        };

                        // And update enemies position too!
                        for (var i = game.enemies.length - 1; i >= 0; i--) {
                            game.enemies[i].update();

                            // If emeny status is false (when it explode) it is removed from the array.
                            if(game.enemies[i].active === false) {
                                game.enemies.splice(i, 1);
                            };
                        };
                        // Check collisions between bullets and enemies using a simple rectangular collision detection.
                        for (var i = game.bullet.length - 1; i >= 0; i--) {

                            for (var j = game.enemies.length - 1; j >= 0; j--) {
                                if (game.bullet[i].x < game.enemies[j].x + game.enemies[j].width  && 
                                    game.bullet[i].x + game.bullet[i].width > game.enemies[j].x  &&
                                    game.bullet[i].y < game.enemies[j].y + game.enemies[j].height &&
                                    game.bullet[i].y + game.bullet[i].height > game.enemies[j].y) {

                                    // If bullet collides than .explosion() method is called.
                                    game.enemies[j].explosion();
                                };
                            };
                        };
                        // Check collisions between enemies and player.
                        for (var i = game.enemies.length - 1; i >= 0; i--) {
                            if (game.enemies[i].x < game.player.x + game.player.width  && 
                                game.enemies[i].x + game.enemies[i].width > game.player.x  &&
                                game.enemies[i].y < game.player.y + game.player.height &&
                                game.enemies[i].y + game.enemies[i].height > game.player.y) {

                                // Check shield of player's ship.
                                game.player.checkShield();
                                // Enemy is destroyed.
                                game.enemies[i].explosion();
                            };
                        };
                    };

                    // This method is used to draw background on canvas.
                    game.background = function() {   
                        // I fill canvas with a black rectangular and smaller azure outlined rectangular that delimit player's boundaries zone.
                        game.ctx.fillStyle ='#000000';
                        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
                        game.ctx.rect(5, 5, game.canvas.width - 10, game.canvas.height - 10);
                        game.ctx.strokeStyle = '#7DE0FF';
                        game.ctx.stroke();

                        // Let's draw starfield with a bit of randomness.
                        // Starfield is drawn every 30ms so there's a little parallax illusion effect.
                        for (var i = Math.random() * 500; i >= 0; i--) {
                            game.ctx.beginPath();
                            game.ctx.arc(Math.random() * 800, Math.random() * 500, Math.random() * 1.1, 0, Math.PI * 2);
                            game.ctx.fillStyle = '#FEFEFE';
                            game.ctx.fill();
                            game.ctx.closePath();
                        };
                    };
                    // Player object.
                    game.player = {
                        // Ship property: initial x and y position, velocity, width, height and shield.
                        x: 320,
                        y: 240,
                        xVelocity: 8,
                        yVelocity: 8,
                        width: 30,
                        height: 30,
                        shield: 50,
                        // Image method is used to retrieve ship's image.
                        image: function() {
                            var ship = new Image();
                            ship.src = 'img/ship.gif';
                            return ship;
                        },
                        // Let's draw ship's image on canvas.
                        draw: function() {
                            game.ctx.drawImage(game.player.image(), game.player.x, game.player.y);
                        },
                        // These two methods below calculate center position of the player ship. These are used to draw initial bullet position on canvas.
                        shootFromX: function() {
                            return game.player.x + game.player.width / 2;
                        },
                        shootFromY: function() {
                            return game.player.y + game.player.height / 2;
                        },
                        // Check shield of player ship.
                        checkShield: function() {
                            // If player's shield are 0 or below than clear the canvas, draw a loosy message and clear all current loop.
                            if (game.player.shield <= 0) {                                
                                game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
                                game.ctx.font = '40px Arial';
                                game.ctx.fillStyle = '#FFFFFF';
                                game.ctx.fillText('YOU LOSE!', 300, 150);
                                game.ctx.fillText('PRESS SPACEBAR', 220, 220);
                                game.ctx.fillText('TO RESTART THE GAME', 170, 270);
                                
                                // Reset the game.
                                game.reset();
                            } else { 
                                // Else subtract one to shield, update information on the screen and draw a transparent circle
                                // in the same position of player's ship to achieve a little "shield hitted" graphic effect.
                                game.player.shield -= 1;
                                var shield = document.getElementById('shield').innerHTML = game.player.shield;
                                game.ctx.beginPath();
                                game.ctx.arc(game.player.x + game.player.width / 2, game.player.y + game.player.height / 2, 35, 0, Math.PI * 2);
                                game.ctx.fillStyle = 'rgba(54,254,253, 0.5)';
                                game.ctx.fill();
                                game.ctx.closePath();
                            };
                        }
                    };
                    // Bullet constructor. Arguments are:
                    // X and Y position to start drawing bullet on screen (these coordinates corresponds to player's ship), and two integer rappresenting
                    // X and Y direction of bullet.
                    game.createBullet = function(x, y, directionX, directionY) {
                        // Let's instantiate the object.
                        var bullet = {};
                        bullet.active = true;
                        bullet.x = x;
                        bullet.y = y;
                        bullet.directionX = directionX;
                        bullet.directionY = directionY;
                        bullet.velocity = 20;

                        // Calculate width and height of bullets; 
                        // If bullet is shooted along X axis it is wider than taller and viceversa.
                        bullet.setWidth = function(directionX) {
                            if (directionX === 0) {
                                return 4;
                            } else {
                                return 8;
                            };
                        };
                        bullet.setHeight = function(directionY) {
                            if (directionY === 0) {
                                return 4;
                            } else {
                                return 8;
                            };
                        };
                        bullet.width = bullet.setWidth(bullet.directionX);
                        bullet.height = bullet.setHeight(bullet.directionY);

                        // Bullet's draw method.
                        bullet.draw = function() {
                            game.ctx.fillStyle = '#FF3BDC';
                            game.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
                        };

                        // Bullet update function.
                        bullet.update = function() {
                            // If the bullet is inside the canvas its status is active, otherwise status is changed to false. 
                            // False bullets are removed from bullet array.
                            if(bullet.x >= 0 && bullet.x <= game.canvas.width &&
                                bullet.y >= 0 && bullet.y <= game.canvas.height) {
                                bullet.active = true;
                            } else {
                                bullet.active = false;
                            };
                            // Here I update X and Y position of bullet. Keep in mind that if X or Y direction is 0 player is shooting only alongside one direction.
                            bullet.x += bullet.velocity * bullet.directionX;
                            bullet.y += bullet.velocity * bullet.directionY;
                        };
                        // Return bullet object.
                        return bullet;
                    };
                    // Game's enemies constructor.
                    game.createEnemies = function() {
                        //Initialization of enemy object
                        var enemy = {};
                        enemy.active = true;
                        // Enemy position is random within canva's boundaries.
                        enemy.x = Math.random() * (game.canvas.width);
                        enemy.y = Math.random() * (game.canvas.height);
                        enemy.width = 30;
                        enemy.height = 30;
                        enemy.xVelocity = 8;
                        enemy.yVelocity = 8;

                        // Enemy explosion's method.
                        enemy.explosion = function() {
                            // When enemy explode it's status is changed to false, enemiesDestroyed counter is increased by one, and score is updated.
                            enemy.active = false;
                            game.enemiesDestroyed += 1;
                            game.setScore();
                            // Draw enemy's explosion.
                            game.ctx.beginPath();
                            game.ctx.arc(enemy.x, enemy.y, 50, 0, Math.PI * 2);
                            game.ctx.fillStyle = '#FEFEFE';
                            game.ctx.fill();
                            game.ctx.stroke();
                            game.ctx.closePath();
                        };

                        // Enemy image method.
                        enemy.image = function() {
                            var enemyImage = new Image();
                            enemyImage.src = 'img/enemy.gif';
                            return enemyImage;
                        };
                        // Let's draw enemy on canvas.
                        enemy.draw = function() {
                            game.ctx.drawImage(enemy.image(), enemy.x, enemy.y);
                        };

                        // Enemy update method.
                        enemy.update = function() {
                            // When an enemy ship hit canvas boundaries It change direction.
                            if (enemy.x >= game.canvas.width - enemy.width) {
                                enemy.xVelocity = enemy.xVelocity * -1;
                            };

                            if (enemy.x <= 0) {
                                enemy.xVelocity = enemy.xVelocity * -1;
                            };

                            if (enemy.y >= game.canvas.height - enemy.height) {
                                enemy.yVelocity = enemy.yVelocity * -1;
                            };

                            if (enemy.y <= 0) {
                                enemy.yVelocity = enemy.yVelocity * -1;
                            };
                            // Update enemy position on canvas.
                            enemy.x += enemy.xVelocity;
                            enemy.y += enemy.yVelocity;

                            // Limit canvas enemy position.
                            enemy.x = game.clamp(enemy.x, 0, game.canvas.width - game.player.width);
                            enemy.y = game.clamp(enemy.y, 0, game.canvas.height - game.player.height)
                        };

                        return enemy;
                    };
                    // SetScore task is to update game score when enemy is destroyed.
                    game.setScore = function() {
                        game.score += 10;
                        var score = document.getElementById('score').innerHTML = game.score;
                    };

                    // Event listener for pressed keys.
                    window.addEventListener('keydown', function(event) {
                        // Update game.pressedKeys array.
                        game.pressedKeys[event.which] = true;
                        //If pressed key is space bar let's start the game!
                        if(event.which === 32) {
                            if(game.playState === 0) {
                                game.start();
                            } else {
                                return false;
                            };
                        };
                    });
                    // When keyup event is fired the corrispondent value in game.pressedKeys array is changed to false.
                    window.addEventListener('keyup', function(event) {
                        game.pressedKeys[event.which] = false;
                    });
                    // Init game.
                    game.init();
    });   