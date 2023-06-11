(function () {
    "use strict";

    game.star = function (l) {
        this.x = game.rand.flot() * game.bgCtx.canvas.width;
        this.y = game.rand.flot() * game.bgCtx.canvas.height;
        this.brightness = l * 15 + game.rand.range(l * 14, l * 18) / 100;
        this.radius = game.rand.flot() / l * 4;
        this.color = game.starColors[game.rand.range(0, game.starColors.length)];
        this.draw();
    };

    game.star.prototype.draw = function () {
        game.bgCtx.save();
        game.bgCtx.beginPath();
        game.bgCtx.globalAlpha = this.brightness;
        game.bgCtx.fillStyle = this.color;
        game.bgCtx.arc(this.x, this.y, this.radius, 0, game.PI2);
        game.bgCtx.fill();
        game.bgCtx.closePath();
        game.bgCtx.restore();
    };
})();
