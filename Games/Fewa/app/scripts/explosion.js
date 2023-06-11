(function () {
    "use strict";

    game.explosion = function (p) {
        game.entity.apply(this, arguments);
        this.distance = 0;
        this.rotate = game.rand.range(0, 360);
        this.rot = p.rot || game.rand.range(-5, 5);
        this.delta = p.delta || 0.1;
        this.maxDistance = game.rand.range(this.delta * 8, this.delta * 15);
    };

    game.explosion.prototype = Object.create(game.entity.prototype);
    game.explosion.prototype.constructor = game.explosion;

    game.explosion.prototype.update = function () {
        this.distance += this.delta;
        this.w += this.delta;
        this.h += this.delta;
        this.rotate += this.rot;
        if (this.distance > this.maxDistance) {
            this.distance = this.maxDistance;
            this.destroy();
        }
    };

    game.explosion.prototype.draw = function () {
        game.ctx.save();
        game.ctx.globalAlpha = 1 - this.distance / this.maxDistance;
        game.entity.prototype.draw.call(this);
        game.ctx.restore();
    };
})();
