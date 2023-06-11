(function () {
    "use strict";

    game.brick = function (p) {
        this.column = p.column;
        this.type = p.type;
        this.w = game.brickWidth;
        this.h = game.brickHeight;
        this.x = this.column * this.w + game.gap * (this.column + 1);
        this.y = -this.h;
        this.hw = this.w / 2;
        this.hh = this.h / 2;
        this.rad = Math.round(this.w / 10);
        this.removed = false;
        this.col = game.elements[this.type].color;
        this.add = 0;
        this.explode = game.noop;
        this.sprite = game.sprite.get(this.type + '-BRICK-' + p.item);
        this.val = this.energy = game.elements[this.type].bricks[p.item].energy;

        if (p.item === 'special') {
            switch (p.type) {
                case 'FIRE':
                    this.explode = function () {
                        game.rumble.level = 10;
                        game.arr.loop(game.bricks[this.column], function (brick, idx) {
                            if (brick && !brick.removed) {
                                brick.hitType = brick.type;
                                brick.destroy();
                            }
                        });
                        game.audio.play('explosionBig');
                    };
                    break;
                case 'EARTH':
                    this.explode = function () {
                        game.rumble.level = 10;
                        for (var i = 0, l = game.columns; i < l; i += 1) {
                            game.arr.loop(game.bricks[i], function (brick, idx) {
                                if (brick && !brick.removed && brick.row >= this.row - 1 && brick.row <= this.row + 1 && brick.column >= this.column - 1 && brick.column <= this.column + 1) {
                                    brick.hitType = brick.type;
                                    brick.destroy();
                                }
                            }, this);
                        }
                        game.audio.play('explosionBig');
                    };
                    break;
                case 'WATER':
                    this.explode = function () {
                        game.rumble.level = 10;
                        for (var i = 0, l = game.columns; i < l; i += 1) {
                            if (i !== this.column) {
                                game.arr.loop(game.bricks[i], function (brick, idx) {
                                    if (brick && !brick.removed && brick.row === this.row) {
                                        brick.hitType = brick.type;
                                        brick.destroy();
                                    }
                                }, this);
                            }
                        }
                        game.audio.play('explosionBig');
                    };
                    break;
                case 'AIR':
                    this.explode = function () {
                        game.rumble.level = 10;
                        for (var i = 0, l = game.columns; i < l; i += 1) {
                            game.arr.loop(game.bricks[i], function (brick, idx) {
                                if (brick && !brick.removed && brick.type === this.type) {
                                    brick.hitType = brick.type;
                                    brick.destroy();
                                }
                            }, this);
                        }
                        game.audio.play('explosionBig');
                    };
                    break;
            }
        }
    };

    game.brick.prototype.destroy = function (noscore) {
        this.removed = true;
        if (this.type === this.hitType) {
            this.explode();
            game.flash = 8;
        }
        game.rumble.level = 5;
        var size = 12;
        for (var i = 0, l = 10; i < l; i+=1) {
            game.particles.push(new game.particle({
                name: 'particle' + this.col,
                x: this.x + this.w / 2,
                y: this.y + this.h,
                w: this.w / size,
                h: this.h / (size / 2),
                col: this.col,
                speed: game.rand.range(1, 5),
                dist: game.rand.range(3, 5) * 100
            }));
        }
        if (!noscore) {
            game.countScore(this.val);
        }
        game.audio.play('explosion');
    };

    game.brick.prototype.hit = function (p, t) {
        this.hitType = t;
        this.energy -= p;
        if (this.energy <= 0 && !this.removed) {
            this.destroy();
        }
        game.audio.play('hit');
    };

    game.brick.prototype.update = function () {
        this.y += game.timer.move + this.add;
        if (this.add === 0) {
            if (game.s !== 0 && this.y > game.stage.height - this.h - game.brickWidth) {
                game.over();
            }
        } else {
            this.add -= game.gravity;
        }
    };

    game.brick.prototype.draw = function () {
        game.ctx.save();
        game.ctx.translate(this.x, this.y);
        game.ctx.drawImage(this.sprite, 0, 0);
        game.ctx.restore();
    };
})();
