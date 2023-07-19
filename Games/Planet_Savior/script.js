//Vanilla JS

//PLAY IN FULL PAGE VIEW!


window.addEventListener("DOMContentLoaded", game);

//General sprite load
var sprite = new Image();
var spriteExplosion = new Image();
sprite.src = 'https://marclopezavila.github.io/planet-defense-game/img/sprite.png';

window.onload = function() {
    spriteExplosion.src = 'https://marclopezavila.github.io/planet-defense-game/img/explosion.png';
};

//Game
function game() {

    //Canvas
    var canvas = document.getElementById('canvas'),
        ctx    = canvas.getContext('2d'),
        cH     = ctx.canvas.height = window.innerHeight,
        cW     = ctx.canvas.width  = window.innerWidth ;

    //Game
    var bullets    = [],
        asteroids  = [],
        explosions = [],
        destroyed  = 0,
        record     = 0,
        count      = 0,
        playing    = false,
        gameOver   = false,
        _planet    = {deg: 0};

    //Player
    var player = {
        posX   : -35,
        posY   : -(100+82),
        width  : 70,
        height : 79,
        deg    : 0
    };

    canvas.addEventListener('click', action);
    canvas.addEventListener('mousemove', action);
    window.addEventListener("resize", update);

    function update() {
        cH = ctx.canvas.height = window.innerHeight;
        cW = ctx.canvas.width  = window.innerWidth ;
    }

    function move(e) {
        player.deg = Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2)));
    }

    function action(e) {
        e.preventDefault();
        if(playing) {
            var bullet = {
                x: -8,
                y: -179,
                sizeX : 2,
                sizeY : 10,
                realX : e.offsetX,
                realY : e.offsetY,
                dirX  : e.offsetX,
                dirY  : e.offsetY,
                deg   : Math.atan2(e.offsetX - (cW/2), -(e.offsetY - (cH/2))),
                destroyed: false
            };

            bullets.push(bullet);
        } else {
            var dist;
            if(gameOver) {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - (cH/2 + 45 + 22)) * (e.offsetY - (cH/2+ 45 + 22))));
                if (dist < 27) {
                    if(e.type == 'click') {
                        gameOver   = false;
                        count      = 0;
                        bullets    = [];
                        asteroids  = [];
                        explosions = [];
                        destroyed  = 0;
                        player.deg = 0;
                        canvas.removeEventListener('contextmenu', action);
                        canvas.removeEventListener('mousemove', move);
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            } else {
                dist = Math.sqrt(((e.offsetX - cW/2) * (e.offsetX - cW/2)) + ((e.offsetY - cH/2) * (e.offsetY - cH/2)));

                if (dist < 27) {
                    if(e.type == 'click') {
                        playing = true;
                        canvas.removeEventListener("mousemove", action);
                        canvas.addEventListener('contextmenu', action);
                        canvas.addEventListener('mousemove', move);
                        canvas.setAttribute("class", "playing");
                        canvas.style.cursor = "default";
                    } else {
                        canvas.style.cursor = "pointer";
                    }
                } else {
                    canvas.style.cursor = "default";
                }
            }
        }
    }

    function fire() {
        var distance;

        for(var i = 0; i < bullets.length; i++) {
            if(!bullets[i].destroyed) {
                ctx.save();
                ctx.translate(cW/2,cH/2);
                ctx.rotate(bullets[i].deg);

                ctx.drawImage(
                    sprite,
                    211,
                    100,
                    50,
                    75,
                    bullets[i].x,
                    bullets[i].y -= 20,
                    19,
                    30
                );

                ctx.restore();

                //Real coords
                bullets[i].realX = (0) - (bullets[i].y + 10) * Math.sin(bullets[i].deg);
                bullets[i].realY = (0) + (bullets[i].y + 10) * Math.cos(bullets[i].deg);

                bullets[i].realX += cW/2;
                bullets[i].realY += cH/2;

                //Collision
                for(var j = 0; j < asteroids.length; j++) {
                    if(!asteroids[j].destroyed) {
                        distance = Math.sqrt(Math.pow(
                                asteroids[j].realX - bullets[i].realX, 2) +
                            Math.pow(asteroids[j].realY - bullets[i].realY, 2)
                        );

                        if (distance < (((asteroids[j].width/asteroids[j].size) / 2) - 4) + ((19 / 2) - 4)) {
                            destroyed += 1;
                            asteroids[j].destroyed = true;
                            bullets[i].destroyed   = true;
                            explosions.push(asteroids[j]);
                        }
                    }
                }
            }
        }
    }

    function planet() {
        ctx.save();
        ctx.fillStyle   = 'white';
        ctx.shadowBlur    = 100;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowColor   = "#999";

        ctx.arc(
            (cW/2),
            (cH/2),
            100,
            0,
            Math.PI * 2
        );
        ctx.fill();

        //Planet rotation
        ctx.translate(cW/2,cH/2);
        ctx.rotate((_planet.deg += 0.1) * (Math.PI / 180));
        ctx.drawImage(sprite, 0, 0, 200, 200, -100, -100, 200,200);
        ctx.restore();
    }

    function _player() {

        ctx.save();
        ctx.translate(cW/2,cH/2);

        ctx.rotate(player.deg);
        ctx.drawImage(
            sprite,
            200,
            0,
            player.width,
            player.height,
            player.posX,
            player.posY,
            player.width,
            player.height
        );

        ctx.restore();

        if(bullets.length - destroyed && playing) {
            fire();
        }
    }

    function newAsteroid() {

        var type = random(1,4),
            coordsX,
            coordsY;

        switch(type){
            case 1:
                coordsX = random(0, cW);
                coordsY = 0 - 150;
                break;
            case 2:
                coordsX = cW + 150;
                coordsY = random(0, cH);
                break;
            case 3:
                coordsX = random(0, cW);
                coordsY = cH + 150;
                break;
            case 4:
                coordsX = 0 - 150;
                coordsY = random(0, cH);
                break;
        }

        var asteroid = {
            x: 278,
            y: 0,
            state: 0,
            stateX: 0,
            width: 134,
            height: 123,
            realX: coordsX,
            realY: coordsY,
            moveY: 0,
            coordsX: coordsX,
            coordsY: coordsY,
            size: random(1, 3),
            deg: Math.atan2(coordsX  - (cW/2), -(coordsY - (cH/2))),
            destroyed: false
        };
        asteroids.push(asteroid);
    }

    function _asteroids() {
        var distance;

        for(var i = 0; i < asteroids.length; i++) {
            if (!asteroids[i].destroyed) {
                ctx.save();
                ctx.translate(asteroids[i].coordsX, asteroids[i].coordsY);
                ctx.rotate(asteroids[i].deg);

                ctx.drawImage(
                    sprite,
                    asteroids[i].x,
                    asteroids[i].y,
                    asteroids[i].width,
                    asteroids[i].height,
                    -(asteroids[i].width / asteroids[i].size) / 2,
                    asteroids[i].moveY += 1/(asteroids[i].size),
                    asteroids[i].width / asteroids[i].size,
                    asteroids[i].height / asteroids[i].size
                );

                ctx.restore();

                //Real Coords
                asteroids[i].realX = (0) - (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.sin(asteroids[i].deg);
                asteroids[i].realY = (0) + (asteroids[i].moveY + ((asteroids[i].height / asteroids[i].size)/2)) * Math.cos(asteroids[i].deg);

                asteroids[i].realX += asteroids[i].coordsX;
                asteroids[i].realY += asteroids[i].coordsY;

                //Game over
                distance = Math.sqrt(Math.pow(asteroids[i].realX -  cW/2, 2) + Math.pow(asteroids[i].realY - cH/2, 2));
                if (distance < (((asteroids[i].width/asteroids[i].size) / 2) - 4) + 100) {
                    gameOver = true;
                    playing  = false;
                    canvas.addEventListener('mousemove', action);
                }
            } else if(!asteroids[i].extinct) {
                explosion(asteroids[i]);
            }
        }

        if(asteroids.length - destroyed < 10 + (Math.floor(destroyed/6))) {
            newAsteroid();
        }
    }

    function explosion(asteroid) {
        ctx.save();
        ctx.translate(asteroid.realX, asteroid.realY);
        ctx.rotate(asteroid.deg);

        var spriteY,
            spriteX = 256;
        if(asteroid.state == 0) {
            spriteY = 0;
            spriteX = 0;
        } else if (asteroid.state < 8) {
            spriteY = 0;
        } else if(asteroid.state < 16) {
            spriteY = 256;
        } else if(asteroid.state < 24) {
            spriteY = 512;
        } else {
            spriteY = 768;
        }

        if(asteroid.state == 8 || asteroid.state == 16 || asteroid.state == 24) {
            asteroid.stateX = 0;
        }

        ctx.drawImage(
            spriteExplosion,
            asteroid.stateX += spriteX,
            spriteY,
            256,
            256,
            - (asteroid.width / asteroid.size)/2,
            -(asteroid.height / asteroid.size)/2,
            asteroid.width / asteroid.size,
            asteroid.height / asteroid.size
        );
        asteroid.state += 1;

        if(asteroid.state == 31) {
            asteroid.extinct = true;
        }

        ctx.restore();
    }

    function start() {
        if(!gameOver) {
            //Clear
            ctx.clearRect(0, 0, cW, cH);
            ctx.beginPath();

            //Planet
            planet();

            //Player
            _player();

            if(playing) {
                _asteroids();

                ctx.font = "20px Verdana";
                ctx.fillStyle = "white";
                ctx.textBaseline = 'middle';
                ctx.textAlign = "left";
                ctx.fillText('Record: '+record+'', 20, 30);

                ctx.font = "40px Verdana";
                ctx.fillStyle = "white";
                ctx.strokeStyle = "black";
                ctx.textAlign = "center";
                ctx.textBaseline = 'middle';
                ctx.strokeText(''+destroyed+'', cW/2,cH/2);
                ctx.fillText(''+destroyed+'', cW/2,cH/2);

            } else {
                ctx.drawImage(sprite, 428, 12, 70, 70, cW/2 - 35, cH/2 - 35, 70,70);
            }
        } else if(count < 1) {
            count = 1;
            ctx.fillStyle = 'rgba(0,0,0,0.75)';
            ctx.rect(0,0, cW,cH);
            ctx.fill();

            ctx.font = "60px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("GAME OVER",cW/2,cH/2 - 150);

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("Total destroyed: "+ destroyed, cW/2,cH/2 + 140);

            record = destroyed > record ? destroyed : record;

            ctx.font = "20px Verdana";
            ctx.fillStyle = "white";
            ctx.textAlign = "center";
            ctx.fillText("RECORD: "+ record, cW/2,cH/2 + 185);

            ctx.drawImage(sprite, 500, 18, 70, 70, cW/2 - 35, cH/2 + 40, 70,70);

            canvas.removeAttribute('class');
        }
    }

    function init() {
        window.requestAnimationFrame(init);
        start();
    }

    init();

    //Utils
    function random(from, to) {
        return Math.floor(Math.random() * (to - from + 1)) + from;
    }

    if(~window.location.href.indexOf('full')) {
        var full = document.getElementsByTagName('a');
        full[0].setAttribute('style', 'display: none');
    }
}