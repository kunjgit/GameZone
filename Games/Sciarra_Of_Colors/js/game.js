/*
* Sciara of colors: a mobile and frenetic arcada game.
* Author: Gabriele D'Arrigo - @acirdesign
*/

var game = {};

// Game interface menu.
game.gameMenu = document.getElementById('game-menu');
game.startButton = document.getElementById('play');
game.instructionButton = document.getElementById('instruction');
game.instructionText = document.getElementById('instruction-text');

// Basic width and height to calculate game width/height ratio.
game.width = 320;
game.height = 480;

game.ratio = game.width / game.height;

game.canvas = document.getElementById('game');
game.ctx = game.canvas.getContext('2d');

// Check if user is browsing through a mobile browser.
game.checkMobile = function () {
    if (navigator.userAgent.match(/Android/i) 
        || navigator.userAgent.match(/iPhone/i)
        || navigator.userAgent.match(/iPad/i)) {
        return true;
    } else {
        return false;
    }
};

// Resize the browser according to the window height and the calculated ratio.
// If the browser is mobile than hide the address bar.
game.resize = function () {
    var newHeight = window.innerHeight;
    var newWidth = newHeight * game.ratio;

    game.canvas.width = newWidth;
    game.canvas.height = newHeight;

    if (game.checkMobile()) {
        document.body.style.height = window.innerHeight + 100 + 'px';

        setTimeout(function () {
            window.scrollTo(0, 1);
        }, 1);
    }
};

// A game utility. Limit the value from a certain range.
game.clamp = function  (value, min, max) {
    if (value > max) {
        value = max;
    };

    if (value < min) {
        value = min;
    };

    return value;
};

// Game state variables, and array used to store 
// coloured shapes and input touches.
game.isPlayng = 0;

game.velocity = 5;

game.score = 0;

game.colorShapes = [];

game.stars = [];

game.input = [];

// Every time a player click or tap on the screen draw a little red rectangle.
game.setInput = function (event) {
    game.input.push(new game.Square(
        event.pageX - game.canvas.offsetLeft,
        event.pageY - game.canvas.offsetTop,
        15,
        '#FF0000'
    ));
};

// Colour of the shapes.
game.colors = ['#FFFF00','#00FFFF', '#FF00FF', '#000000', '#FFFFFF', '#CCCCCC'];

game.chooseRandomColor = function () {
    return game.colors[Math.round(Math.random() * 5)];
};

game.choosenColor = game.chooseRandomColor();

game.colorIndex = 0;

// Shape constructor.
game.Square = function (x, y, width, color) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.color = color;
    this.active = true;

    this.xVelocity = 0;
    this.yVelocity = game.clamp(Math.random() * game.velocity, 2, game.velocity.max);   
};

// Draw and update method.
game.Square.prototype.draw = function () {
    game.ctx.fillStyle = this.color;
    game.ctx.fillRect(this.x, this.y, this.width, this.width);
};

game.Square.prototype.update = function () {         
    this.y += this.yVelocity;

    if (this.y <= game.canvas.height) {
        this.active = true;
    } else {
        this.active = false;
        game.timer.increment(-1);
    };
};

// Particle constructor.
game.Particle = function (x, y, width, color) {
    game.Square.call(this, x, y, width, color);

    this.direction = (Math.random() * 2 > 1) ? 1 : -1;
    this.xVelocity = Math.round(Math.random() * 3) * this.direction;
    this.yVelocity = Math.round(Math.random() * 8);
};

game.Particle.prototype.draw = game.Square.prototype.draw;

game.Particle.prototype.update = function () {
    this.x += this.xVelocity;
    this.y += this.yVelocity;

    this.xVelocity *= 1.03;
    this.yVelocity *= 1.02;

    this.xVelocity -= 0.15;
};

game.Particle.prototype.explode = function () {};

// Add an explode method to Square entity.
// Create ten particles to animate.
game.Square.prototype.explode = function () {
    for (var i = 10; i >= 0; i -= 1) {
        var particle = new game.Particle(this.x, this.y, 15, this.color); 
        game.colorShapes.push(particle);
    };
};

// Game timer.
// When timer reachs 0 seconds of time than game is finished.
game.timer = {
    seconds : 30,
    start : function () {
        game.timer.internalTimer = setInterval(function () {

            if (game.timer.seconds <= 0) {
                game.reset();
            }

            game.timer.seconds -= 1;

        }, 1000);
    },
    increment : function (value) {
        this.seconds += value;
    },
    reset : function () {
        clearInterval(game.timer.internalTimer);

        game.timer.seconds = 30;

        game.draw();
    }
};

// Background object.
// Draw the starfield and the user score to the canvas.
game.background = {
    reset : function () {
        game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
        game.ctx.fillStyle = '#333333';
        game.ctx.fillRect(0, 0, game.canvas.width, game.canvas.height);
    },
    init  : function () {
        for (var i = 500; i >= 0; i -= 1) {
            game.stars.push(new game.Square(
                Math.random() * game.canvas.width,
                Math.random() * game.canvas.height,
                Math.random() * 3,
                '#FFFFFF'
            ));
        }
    }, 
    score : function () {
        game.ctx.font = '20px Monospace';
        game.ctx.fillStyle = '#FFFFFF'
        game.ctx.fillText('COLOR', 10, 20);

        game.ctx.fillText('TIMER', game.canvas.width - 70, 20);
        game.ctx.fillText(game.timer.seconds, game.canvas.width - 40, 50);

        game.ctx.fillText('SCORE', 10, game.canvas.height - 45);
        game.ctx.fillText(game.score, 10, game.canvas.height - 20);

        game.ctx.fillStyle = game.choosenColor;
        game.ctx.fillRect(10, 30, 30, 30);
    }
};

// Hide and show game menu interface.
game.showMenu = function () {
    game.gameMenu.style.display = 'block';
    game.canvas.style.display = 'none';
};

game.hideMenu = function () {
    game.gameMenu.style.display = 'none';
    game.instructionText.style.display = 'none';
    game.canvas.style.display = 'block';
};

// Start the game. Set game playng state, hide all interface menu,
// resize the canvas according to the window size, and define all game loop.
game.start = function () {
    game.isPlayng = 1;

    game.hideMenu();
    game.resize();
    game.background.init();

    game.timer.start();

    game.loop = setInterval(function () {
        game.draw();
        game.update();
    }, 1000 / 60);

    // Every three second, four square with random characteristics plus a fifth coloured square 
    // of the same colour of the choosen game's color are pushed onto the game.
    game.shapeLoop = setInterval(function () {
        [1, 2, 3, 4].forEach(function (index) {
            var width = Math.floor(Math.random() * 60) + 20;
            var x = game.clamp(Math.random() * game.canvas.width, 0, game.canvas.width - width);
            var y = 0 - Math.random() * 100;

            game.colorShapes.push(new game.Square(x, y, width, game.chooseRandomColor()));
        });

        // Randomly push a correct square into the game.
        setTimeout(function () {
            var width = Math.floor(Math.random() * 60) + 20;
            var x = game.clamp(Math.random() * game.canvas.width, 0, game.canvas.width - width);
            var y = 0 - Math.random() * 100;

            game.colorShapes.push(new game.Square(x, y, width, game.choosenColor));

        }, Math.random() * 2000);

    }, 3000);

    // Every four second the colour that the player must use to destroy correct square is changed.
    game.colorsLoop = setInterval(function () {
        game.colorIndex < game.colors.length - 1 ? game.colorIndex += 1 : game.colorIndex = 0;

        game.choosenColor = game.colors[game.colorIndex];

    }, 4000);

    // Increment square velocity every twelve seconds.
    game.velocityLoop = setInterval(function () {
        game.velocity.max += 1;
    }, 12000);
};

// Draw all game's assets.
game.draw = function () {
    game.background.reset();

    game.background.score();

    game.stars.forEach(function (star) {
        star.draw();
    });

    game.colorShapes.forEach(function (shape, index) {
        shape.draw();
    });

    game.input.forEach(function (pointer) {
        pointer.draw();
    });
};

// Update all entity on the canvas.
game.update = function () {
    game.colorShapes.forEach(function (shape, index) {
        shape.update();

        if (shape.active === false) {
            game.colorShapes.splice(index, 1);
        };
    });

    // Check for collision between user's poin of touch (or click) and the game's square.
    game.input.forEach(function (pointer, index) {
        game.colorShapes.forEach(function (shape, shapeIndex) {

            if (pointer.x < shape.x + shape.width && pointer.x + pointer.width > shape.x &&
                pointer.y < shape.y + shape.width && pointer.y + pointer.width > shape.y) {
                
                game.colorShapes.splice(shapeIndex, 1);

                if (shape.color === game.choosenColor) {
                    game.timer.increment(5);
                    game.score += 10;
                    shape.explode();
                } else {
                    game.timer.increment(-7);
                    shape.explode();
                }
            }
        });

        pointer.active = false;
        game.input.splice(index, 1);
    });
};

// Reset function. Invoked when player loose the game.
game.reset = function () {
    game.isPlayng = 0;
    game.velocity = 5;
    game.colorShapes = [];
    game.timer.reset();

    clearInterval(game.loop);
    clearInterval(game.shapeLoop);
    clearInterval(game.colorsLoop)
    clearInterval(game.velocityLoop);

    game.ctx.font = '24px Monospace';
    game.ctx.fillStyle = '#FFFFFF';
    game.ctx.textAlign = 'center';
    game.ctx.fillText('YOU LOSE!', game.canvas.width / 2, game.canvas.height / 2 - 40);
    game.ctx.fillText('YOUR SCORE IS: ' + game.score, game.canvas.width / 2, game.canvas.height / 2);

    game.score = 0;

    setTimeout(function () {
        game.showMenu();
    }, 4000);
};

// Declare all event listener.
game.startButton.addEventListener('click', function (event) {
    game.start();

    event.preventDefault();
}, false);

game.startButton.addEventListener('touchstart', function (event) {
    game.start();

    event.preventDefault();
}, false);

game.instructionButton.addEventListener('click', function () {
    game.instructionText.style.display = 'block';
});

game.instructionButton.addEventListener('touchstart', function () {
    game.instructionText.style.display = 'block';
});

window.addEventListener('click', function () {
    game.setInput(event);
}, false);

window.addEventListener('touchstart', function () {
    game.setInput(event.touches[0]);

}, false);

window.addEventListener('resize', function () {
    game.resize();
}, false);

// If game is in 'playng mode' than prevent browser to be scrolled or zoommed.
window.addEventListener('touchmove', function (event) {
    if (game.isPlayng) {
        event.preventDefault();
    }
}, false);

window.addEventListener('touchend', function (event) {
    if (game.isPlayng) {
        event.preventDefault();
    }
}, false);