(function () {
    "use strict";

    game.tower = function (p) {
        this.type = p.type;
        this.w = game.brickWidth;
        this.h = game.brickWidth;
        this.setColumn(p.column);
        this.y = game.stage.height - this.h;
        this.col = game.elements[this.type].color;
        this.hw = this.w / 2;
        this.hh = this.h / 2;
        this.rad = Math.round(this.w / 10);
        this.removed = false;
        this.sprite = game.sprite.get(this.type);
        this.shootDelay = this.latency = game.elements[this.type].latency;
    };

    game.tower.prototype.setColumn = function (c) {
        this.column = c;
        this.x = this.column * this.w + game.gap * (this.column + 1);
    };

    game.tower.prototype.destroy = function () {
        this.removed = true;
        var px = this.w / 6,
            py = this.h / 6,
            j, k;

        game.rumble.level = 10;
        for (j = 1; j < 6; j++) {
            for (k = 1; k < 6; k++) {
                game.particles.push(new game.particle({
                    name: 'particle' + this.col,
                    x: this.x + j * px,
                    y: this.y + k * py,
                    w: px,
                    h: py,
                    col: this.col,
                    speed: game.rand.range(1, 5),
                    dist: game.rand.range(3, 5) * 100
                }));
            }
        }
        game.audio.play('explosion');
    };

    game.tower.prototype.shoot = function () {
        if (game.s !== 0) {
            game.bullets.push(new game.bullet({
                column: this.column,
                type: this.type
            }));
        }
    };

    game.tower.prototype.update = function () {
        this.shootDelay -= game.timer.delta;
        if (this.shootDelay < 0) {
            this.shoot();
            this.shootDelay = this.latency;
        }
    };

    game.tower.prototype.draw = function () {
        game.ctx.save();
        game.ctx.translate(this.x, this.y);
        game.ctx.drawImage(this.sprite, 0, 0);
        game.ctx.restore();
    };
})();
