var particlesModule = require('./particles');
var shake = require('./screenshake');

var playerHitBox = {
    x: 375,
    y: 270,
    width: 50,
    height: 60
};

var aabb = function(a, b) {
    if (
        Math.abs(a.x + a.width / 2 - b.x - b.width / 2) > (a.width + b.width) / 2 ||
        Math.abs(a.y + a.height / 2 - b.y - b.height / 2) > (a.height + b.height) / 2
    ) {
        return false;
    }
    return true;
};

var inArea = function(area, array, respColliding, respNotColliding) {
    var ret = [];
    var curElem;
    for (var i = 0; i < array.length; i++) {
        curElem = array[i];
        if (aabb(area, curElem)) {
            ret.push(curElem);
            if (respColliding) {
                respColliding(curElem);
            }
        }
        else if (respNotColliding) {
            respNotColliding(curElem);
        }
    }
    return ret;
};

var playerArea = {
    x: 325,
    y: 225,
    width: 150,
    height: 150
};

var camera = {
    x: -400,
    y: -300,
    width: 1600,
    height: 1200
};

var explodeObj = function(fo) {
    if (fo.image === 'power-icon.png') {
        return false;
    }
    particlesModule.createParticles(fo.x, fo.y, fo.speed, 0.01, fo.width * fo.height / 100, [fo.color], {
        range: Math.random() * 2 * Math.PI,
        noCollide: true,
        dx: fo.dx,
        dy: fo.dy
    });
};

var justExploded = false;
var ticks = 0;
var check = function(player, foModule) {
    // fo stands for flyingObjects
    var particles = particlesModule.array;
    var fos = foModule.array;
    // Manage flying object spawning
    var foInView = inArea(camera, fos, undefined, function(fo) {
        fo.alive = false;
    });
    if (foInView.length < 30 && justExploded !== true) {
        foModule.spawn(Math.random() * 100);
    }
    else if (justExploded === true) {
        ticks++;
        if (ticks >= 150) {
            ticks = 0;
            justExploded = false;
            particlesModule.array.length = 100; // Doing this improves performance after explosions
        }
    }

    // Collisions between the player and rocks
    var foToTest = inArea(playerArea, fos);
    var fo;
    for (var i = 0; i < foToTest.length; i++) {
        fo = foToTest[i];
        if (aabb(playerHitBox, fo)) {
            // console.log('HIT');
            fo.alive = false;
            if (fo.image === 'power-icon.png') {
                audio.play('collect');
                player.fuel += 10;
            }
            else {
                audio.play('collide');
                if (player.triggered !== 'invincibility') {
                    player.hit = true;
                    player.health -= (fo.width * fo.height) / 100;
                }
                else {
                    player.addMoney(fo);
                }
                explodeObj(fo);
                shake(5);
            }
        }
    }
    if (player.triggered === 'invincibility') {
        ticks++;
        if (ticks >= 600) {
            ticks = 0;
            player.triggered = null;
            player.equipped = null;
        }
    }

    // Check for collisions between particles and fo
    for (var i = 0; i < particles.length; i++) {
        if (particles[i].noCollide) {
            continue;
        }
        inArea(particles[i], fos, function(fo) {
            if (particles[i].alive && !fo.good) {
                fo.alive = false;
                audio.play('explode_meteor');
                player.addMoney(fo);
                explodeObj(fo);
                shake(2);
            }
        });
    }

    if (player.triggered === 'explode') {
        player.triggered = null;
        player.equipped = null;
        justExploded = true;

        shake(10);
        for (var i = 0; i < fos.length; i++) {
            fo = fos[i];
            if (fo.image !== 'power-icon.png') {
                setTimeout((function(fo) {
                    return function() {
                        fo.alive = false;
                        player.addMoney(fo);
                        explodeObj(fo);
                    };
                })(fo), Math.random() * 300);
            }
        }
    }
};

module.exports = {
    check: check
};