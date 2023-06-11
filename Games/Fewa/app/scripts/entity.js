(function () {
    "use strict";

    game.entity = function (p) {
        this.x = p.x || 0;
        this.y = p.y || 0;
        this.w = p.w || 0;
        this.h = p.h || 0;
        this.col = p.col || 0;
        this.name = p.name || '';
        this.removed = false;
        this.sprite = game.sprite.create(this.name, this.w, this.h, function (ctx) {
            ctx.fillStyle = this.col;
            ctx.fillRect(0, 0, this.w, this.h);
        }.bind(this));

    };

    game.entity.prototype.destroy = function () {
        this.removed = true;
    };

    game.entity.prototype.draw = function () {
        game.ctx.translate(this.x, this.y);
        if (this.rotate) {
            game.ctx.rotate(this.rotate * game.RAD);
        }
        game.ctx.drawImage(this.sprite, -this.w / 2, -this.h / 2, this.w, this.h);
    };
})();
