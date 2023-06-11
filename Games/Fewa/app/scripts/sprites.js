(function () {
    "use strict";

    game.sprite = {
        items: {},
        create: function (name, w, h, fn) {
            if (!this.get(name)) {
                var c = document.createElement('canvas');
                c.width = w;
                c.height = h;

                var octx = c.getContext('2d');
                octx.save();
                fn(octx);
                octx.restore();
                this.set(name, c);
            }
            return this.get(name);
        },
        set: function (name, val) {
            this.items[name] = val;
        },
        get: function (name) {
            return this.items[name];
        },
        factory: function () {

            var w10 = game.brickWidth / 10,
                w2 = game.brickWidth / 2,
                h2 = game.brickHeight / 2,
                linewidth = game.brickWidth / 10,
                radius = w10,
                glow = 'rgba(255,255,255,0.8)',
                glow2 = 'rgba(255,255,0,0.5)';

            this.create('AIR', game.brickWidth, game.brickWidth, function (c) {
                var w = (game.brickWidth - linewidth * 2) / 4;

                game.rect(c, 0, 0, game.brickWidth, game.brickWidth, radius, game.elements.AIR.color, linewidth, null, glow);
                c.lineWidth = linewidth;
                c.strokeStyle = game.elements.AIR.color;
                c.translate(linewidth, 0);
                for (var i = 0; i < 3; i++) {
                    c.beginPath();
                    c.moveTo(w, linewidth);
                    c.lineTo(w, game.brickWidth - linewidth);
                    c.stroke();
                    c.translate(w, 0);
                }
            });

            this.create('AIR-SHOT', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, w2 - w10, 0, w10 * 2, game.brickHeight, 2, game.elements.AIR.color, linewidth, game.elements.AIR.color, glow2);
            });

            this.create('AIR-BRICK-empty', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.AIR.color, linewidth, null, glow);
            });

            this.create('AIR-BRICK-filled', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.AIR.color, linewidth, game.elements.AIR.color, glow);
            });

            this.create('AIR-BRICK-special', game.brickWidth, game.brickHeight, function (c) {
                c.fillStyle = game.elements.AIR.color;
                c.fillRect(w2 - h2 / 2, linewidth, h2, game.brickHeight - linewidth * 2);
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.AIR.color, linewidth, null, glow);
            });

            this.create('EARTH', game.brickWidth, game.brickWidth, function (c) {
                var h = (game.brickWidth - linewidth * 2) / 4;

                game.rect(c, 0, 0, game.brickWidth, game.brickWidth, radius, game.elements.EARTH.color, linewidth, null, glow);
                c.lineWidth = linewidth;
                c.strokeStyle = game.elements.EARTH.color;
                c.translate(0, linewidth);
                for (var i = 0; i < 3; i++) {
                    c.beginPath();
                    c.moveTo(linewidth, h);
                    c.lineTo(game.brickWidth - linewidth, h);
                    c.stroke();
                    c.translate(0, h);
                }
            });

            this.create('EARTH-SHOT', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, w2 - w10, 0, w10 * 2, game.brickHeight, 2, game.elements.EARTH.color, linewidth, game.elements.EARTH.color, glow2);
            });

            this.create('EARTH-BRICK-empty', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.EARTH.color, linewidth, null, glow);
            });

            this.create('EARTH-BRICK-filled', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.EARTH.color, linewidth, game.elements.EARTH.color, glow);
            });

            this.create('EARTH-BRICK-special', game.brickWidth, game.brickHeight, function (c) {
                c.fillStyle = game.elements.EARTH.color;
                c.fillRect(w2 - h2 / 2, linewidth, h2, game.brickHeight - linewidth * 2);
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.EARTH.color, linewidth, null, glow);
            });

            this.create('WATER', game.brickWidth, game.brickWidth, function (c) {
                var h = (game.brickWidth - linewidth * 2) / 4;

                game.rect(c, 0, 0, game.brickWidth, game.brickWidth, radius, game.elements.WATER.color, linewidth, null, glow);
                c.lineWidth = linewidth;
                c.strokeStyle = game.elements.WATER.color;
                c.translate(0, linewidth);
                for (var i = 0; i < 3; i++) {
                    game.sine(c, linewidth, h, game.brickWidth - linewidth, h);
                    c.translate(0, h);
                }
            });

            this.create('WATER-SHOT', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, w2 - w10, 0, w10 * 2, game.brickHeight, 2, game.elements.WATER.color, linewidth, game.elements.WATER.color, glow2);
            });

            this.create('WATER-BRICK-empty', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.WATER.color, linewidth, null, glow);
            });

            this.create('WATER-BRICK-filled', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.WATER.color, linewidth, game.elements.WATER.color, glow);
            });

            this.create('WATER-BRICK-special', game.brickWidth, game.brickHeight, function (c) {
                game.line(c, linewidth * 2, h2, game.brickWidth - linewidth * 2, h2, game.elements.WATER.color, linewidth);
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.WATER.color, linewidth, null, glow);
            });

            this.create('FIRE', game.brickWidth, game.brickWidth, function (c) {
                var h = (game.brickWidth - linewidth * 2) / 4;
                game.rect(c, 0, 0, game.brickWidth, game.brickWidth, radius, game.elements.FIRE.color, linewidth, null, glow);
                c.lineWidth = linewidth;
                c.strokeStyle = game.elements.FIRE.color;
                c.translate(-linewidth, 0);
                c.translate(game.brickWidth / 2, game.brickWidth / 2);
                c.rotate(90 * game.RAD);
                c.translate(-game.brickWidth / 2, -game.brickWidth / 2);
                for (var i = 0; i < 3; i++) {
                    game.sine(c, linewidth, h, game.brickWidth - linewidth, h);
                    c.translate(0, h);
                }
            });

            this.create('FIRE-SHOT', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, w2 - w10, 0, w10 * 2, game.brickHeight, 2, game.elements.FIRE.color, linewidth, game.elements.FIRE.color, glow2);
            });

            this.create('FIRE-BRICK-empty', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.FIRE.color, linewidth, null, glow);
            });

            this.create('FIRE-BRICK-filled', game.brickWidth, game.brickHeight, function (c) {
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.FIRE.color, linewidth, game.elements.FIRE.color, glow);
            });

            this.create('FIRE-BRICK-special', game.brickWidth, game.brickHeight, function (c) {
                game.line(c, w2, linewidth * 2, w2, game.brickHeight - linewidth * 2, game.elements.FIRE.color, linewidth);
                game.rect(c, 0, 0, game.brickWidth, game.brickHeight, radius, game.elements.FIRE.color, linewidth, null, glow);
            });

            ['#ffffff', '#ed8500', '#ffff00'].forEach(function (item) {
                this.create('explosion' + item, game.brickWidth, game.brickHeight, function (c) {
                    game.rect(c, 0, 0, game.brickWidth, game.brickHeight, 0, item, 0, item);
                });
            }, this);

        }
    };
})();
