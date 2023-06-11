(function () {
    "use strict";

    game.bullet = function (p) {
        this.column = p.column;
        this.type = p.type;
        this.speed = 5;
        this.width = game.brickWidth;
        this.height = game.brickHeight;
        this.x = this.column * this.width + game.gap * (this.column + 1);
        this.y = game.stage.height - game.brickWidth;
        this.hw = this.width / 2;
        this.hh = this.height / 2;
        this.rad = 1;
        this.removed = false;
        this.power = 100;
        this.sprite = game.sprite.get(this.type + '-SHOT');
    };

    game.bullet.prototype.destroy = function () {
        Array.prototype.push.apply(game.explosions,
            [
                new game.explosion({
                    name: 'explosion#ffffff',
                    x: this.x + this.hw,
                    y: this.y,
                    w: this.power / 4,
                    h: this.power / 4,
                    col: '#ffffff',
                    delta: 2,
                    rot: 0
                }),
                new game.explosion({
                    name: 'explosion#ed8500',
                    x: this.x + this.hw,
                    y: this.y,
                    w: this.power / 7,
                    h: this.power / 7,
                    col: '#ed8500',
                    delta: 1.5,
                    rot: -5
                }),
                new game.explosion({
                    name: 'explosion#ffff00',
                    x: this.x + this.hw,
                    y: this.y,
                    w: this.power / 8,
                    h: this.power / 8,
                    col: '#ffff00',
                    delta: 1,
                    rot: 4
                })
            ]
        );
        this.removed = true;
    };

    game.bullet.prototype.update = function () {
        this.y -= this.speed * game.timer.delta;
        game.arr.loop(game.bricks[this.column], function (brick, idx) {
            if (brick !== null && brick.y > this.y - game.brickHeight) {
                this.power = game.elements[this.type].against[brick.type];
                if (this.type === brick.type) {
                    game.rumble.level = 1;
                }
                brick.hit(this.power, this.type);
                this.destroy();
            }
        }, this);
    };

    game.bullet.prototype.draw = function () {
        game.ctx.save();
        game.ctx.translate(this.x, this.y);
        game.ctx.drawImage(this.sprite, 0, 0);
        game.ctx.restore();
    };
})();
