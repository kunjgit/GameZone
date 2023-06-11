(function () {
    "use strict";

    game.particle = function (p) {
        game.entity.apply(this, arguments);
        this.dir = game.rand.bool() ? -1 : 1;
        this.vx = Math.random() * 5 - 2;
        this.vy = Math.random() * -10 - 1;
        this.move = p.speed + game.rand.rangef(-0.5, 0.5);
        this.distance = 0;
        this.maxDistance = (p.dist || 200) + game.rand.range(-30, 30);
        this.delta = this.w / this.maxDistance;
    };

    game.particle.prototype = Object.create(game.entity.prototype);
    game.particle.prototype.constructor = game.particle;

    game.particle.prototype.update = function () {

        this.w -= this.delta;
        this.h -= this.delta;

        this.vy += game.gravity;
        this.y += this.vy;
        this.x += this.vx;

        this.distance += Math.sqrt(Math.pow(this.vx, 2) + Math.pow(this.vy, 2));
        if (this.distance > this.maxDistance) {
            this.distance = this.maxDistance;
            this.destroy();
        }
    };

    game.particle.prototype.draw = function () {
        game.ctx.save();
        game.ctx.globalAlpha = 1 - this.distance / this.maxDistance;
        game.entity.prototype.draw.call(this);
        game.ctx.restore();
    };
})();
