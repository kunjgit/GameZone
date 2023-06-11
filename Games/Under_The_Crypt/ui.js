'use strict';

/**
 * Creates the UI for the game itself as well as info screens.
 *
 * @constructor
 */
function UI(cb) {
    var self = this, i, canvas,
        s = 1 / window.devicePixelRatio,
        meta = document.createElement('meta');
    // resize on mobile devices
    meta.setAttribute('name', 'viewport');
    meta.setAttribute('content', 'width=device-width, initial-scale=' + s + ', maximum-scale=' + s + ', user-scalable=no');
    document.head.appendChild(meta);
    // init canvas
    this.canvas = [];
    this.ctx = [];
    for (i = 0; i < 3; i += 1) {
        this.canvas[i] = document.createElement('canvas');
        document.body.appendChild(this.canvas[i]);
        this.ctx[i] = this.canvas[i].getContext('2d');
    }
    // add event handlers
    canvas = this.canvas[2];
    if ('ontouchstart' in document.body) {
        canvas.ontouchstart = function (e) {
            if (e.touches.length > 1) {
                self.down = null;
            }
            else {
                self.onMouseDown(e.changedTouches.item(0));
                e.preventDefault();
            }
        };
        canvas.ontouchend = function (e) { self.onMouseUp(e.changedTouches.item(0)); };
        canvas.ontouchleave = this.canvas.ontouchcancel = function () { self.down = null; };
        canvas.ontouchmove = function (e) {
            if (e.touches.length > 1) {
                self.down = null;
            }
            else {
                e.preventDefault();
            }
        };
    }
    else {
        canvas.onmousedown = function (e) { self.onMouseDown(e); };
        canvas.onmouseup = function (e) { self.onMouseUp(e); };
        canvas.onmouseout = function () { self.down = null; };
        document.onkeydown = function (e) { self.onKeyDown(e); };
    }
    // load tiles and trigger callback
    this.tiles = new Image();
    this.tiles.onload = cb;
    this.tiles.src = 'tiles.png';
}
UI.prototype = {
    /**
     * Position of click / drag start in squares.
     * @type {?{x: number, y: number}}
     */
    down: null,
    /**
     * Current width of the canvas.
     * @type {number}
     */
    width: 0,
    /**
     * Current height of the canvas.
     * @type {number}
     */
    height: 0,
    /**
     * Current horizontal offset of the game on the canvas.
     * @type {number}
     */
    offsetX: 0,
    /**
     * Current vertical offset of the game on the canvas.
     * @type {number}
     */
    offsetY: 0,
    /**
     * Tower upgrade animation.
     * @type {?{pos: {x: number, y: number}, time: number}}
     */
    upgradeAnim: null,

    /**
     * Determines the scale factor best for the current resolution and settings.
     *
     * @return {number} Scale factor.
     */
    getScale: function () {
        var scale,
            hScale = window.innerHeight / 16 / (g.rows + 2),
            wScale = window.innerWidth / 16 / g.columns;
        if (wScale > hScale && wScale / hScale > 1.002) {
            scale = hScale;
        }
        else {
            scale = wScale;
        }
        if (g.save.full) {
            return scale;
        }
        return Math.floor(scale);
    },

    /**
     * Resizes a canvas.
     *
     * @param {number} c Canvas number.
     * @param {number} scale Scale factor.
     */
    resize: function (c, scale) {
        var canvas = this.canvas[c],
            ctx = this.ctx[c];
        canvas.width = g.columns * 16 * scale;
        canvas.height = (g.rows + 2) * 16 * scale;
        canvas.style.left = this.offsetX + 'px';
        canvas.style.top = this.offsetY + 'px';
        ctx.scale(scale, scale);
        ctx.imageSmoothingEnabled = ctx.webkitImageSmoothingEnabled =
            ctx.msImageSmoothingEnabled = ctx.mozImageSmoothingEnabled = false;
    },

    /**
     * Resizes a div used for info screens.
     *
     * @param {HTMLElement} div Div element.
     * @param {number} scale Scale factor.
     */
    resizeDiv: function (div, scale) {
        div.style.width = g.columns * 16 * scale + 'px';
        div.style.height = (g.rows + 2) * 16 * scale + 'px';
        div.style.left = this.offsetX + 'px';
        div.style.top = this.offsetY + 'px';
        div.style.font = scale * 8 + 'px Arial';
    },

    /**
     * Draws the gradients in the title screen.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     * @param {number} x x coordinate to start.
     * @param {number} y y coordinate to start.
     * @param {number} width Width of the gradient in pixels.
     * @param {number} height Height of the gradient in pixels.
     */
    drawGradient: function (ctx, x, y, width, height) {
        var g = ctx.createLinearGradient(x, y - 1, x, y + height);
        g.addColorStop(0, 'rgb(17,17,17)');
        g.addColorStop(1, 'rgba(17,17,17,0)');
        ctx.fillStyle = g;
        ctx.fillRect(x, y - 1, width, height);
    },
    /**
     * Draws the title screen. Note: has to be changed manually when changing board size.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     * @param scale {number} scale Scale factor.
     */
    drawTitle: function(ctx, scale) {
        var x, y;
        this.resize(2, scale);

        // draw ground
        for(y = 0; y < 5; y += 1) {
            for (x = 0; x < 9; x += 1) {
                if (y > 1 || x !== 4) {
                    this.drawSprite(ctx, 1, 0, x * 16, 128 + y * 16);
                }
            }
        }
        // add gradient for door
        this.drawGradient(ctx, 64, 160, 16, 16);
        // add gradient for background
        this.drawGradient(ctx, 0, 128, 176, 48);

        // draw crypt
        for(y = 0; y < 4; y += 1) {
            for (x = 0; x < 7; x += 1) {
                if (y < 2 || x !== 3) {
                    this.drawSprite(ctx, 3, 0, 16 + x * 16, 112 + y * 16);
                }
            }
        }
        // add outline
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(16, 128, 112, 1);
        ctx.fillRect(16, 112, 1, 64);
        ctx.fillRect(80, 144, 1, 32);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(64, 143, 16, 1);
        ctx.fillRect(63, 144, 1, 32);
        ctx.fillRect(127, 112, 1, 64);
        // add gradient for roof
        this.drawGradient(ctx, 16, 112, 112, 16);

        // draw player
        ctx.drawImage(this.tiles, 0, 32, 16, 16, 65, 184, 16, 16);
    },

    /**
     * Draws the game board.
     *
     * @param {number} scale Scale factor.
     * @param {boolean} redraw Whether to redraw everything or do incremental updates.
     */
    drawBoard: function (scale, redraw) {
        var ctx = this.ctx[0];
        g.level.forEachSquare(function(x, y, id) {
            if (redraw || g.hasChanged(x, y)) {
                this.drawTile(ctx, x, y, id);
            }
        }, this);
    },

    /**
     * Draws the dynamic aspects of the game like spirits, active towers, or player.
     *
     * @param {number} scale Scale factor.
     */
    drawEffects: function (scale) {
        var ctx = this.ctx[1];
        this.resize(1, scale);

        // tile effects
        g.level.forEachSquare(function(x, y, id) {
            this.drawTileEffect(ctx, x, y, id);
        }, this);

        // target selection
        if (g.player.target && (g.player.pos.x !== g.player.target.x || g.player.pos.y !== g.player.target.y)) {
            this.drawSprite(ctx, 7, 6, g.player.target.x - 8, g.player.target.y - 8);
        }

        // tower selection
        if (g.selTower !== null) {
            this.drawSprite(ctx, 4, 6, g.selTower.x * 16, g.selTower.y * 16);
        }

        // spirits
        g.spirits.forEach(function (spirit) { this.drawSpirit(ctx, spirit); }, this);
        // player
        this.drawSpirit(ctx, g.player);

        // tower effects
        g.level.forEachSquare(function (x, y, id) {
            var t, nx, ny, ta, target, i,
                tau = Math.PI * 2;
            if (id > 2) {
                t = g.objectAt(x, y);
                if (t && t.active()) {
                    switch (id) {
                    case 3: // light
                        ctx.fillStyle = 'rgba(255,255,136,0.5)';
                        ctx.beginPath();
                        ctx.moveTo(x * 16 + 8, y * 16 + 8);
                        ctx.arc(x * 16 + 8, y * 16 + 8, 32, (t.a - t.range + tau) % tau, (t.a + t.range) % tau, 0);
                        ctx.fill();
                        break;
                    case 4: // lightning
                        var r = 200 + Math.floor(Math.random() * 55);
                        ctx.strokeStyle = 'rgb(' + [r, r, 255] + ')';
                        ctx.beginPath();
                        nx = Math.floor(Math.random() * 2 - 1);
                        ny = Math.floor(Math.random() * 2 - 1);
                        ctx.moveTo(t.pos.x + nx, t.pos.y - 4 + ny);
                        for (ta = 0; ta < t.targets.length; ta += 1) {
                            target = t.targets[ta];
                            nx = Math.floor(Math.random() * 2 - 1);
                            ny = Math.floor(Math.random() * 2 - 1);
                            ctx.lineTo(target.pos.x + nx, target.pos.y + ny);
                        }
                        ctx.stroke();
                        break;
                    case 6: // fire
                        for (i = 8; i < t.range; i += 1) {
                            ctx.fillStyle = 'rgba(255,' + Math.floor(Math.random() * 128) + ',0,.5)';
                            var s = 2 + Math.floor(Math.random() * 2);
                            ctx.fillRect(t.pos.x - s / 2 + t.dir.x * i, t.pos.y - 3 - s / 2 + t.dir.y * i, s, s);
                        }
                        break;
                    }
                }
            }
        }, this);
    },

    /**
     * Draws the fog over unexplored parts of the board.
     *
     * @param {number} scale Scale factor.
     */
    drawFog: function (scale) {
        var ctx = this.ctx[2];
        this.resize(2, scale);

        // draw fog
        ctx.fillStyle = '#111';
        ctx.fillRect(0, 0, g.columns * 16, g.rows * 16);

        // remove explored parts
        ctx.globalCompositeOperation = 'destination-out';
        g.level.forEachSquare(function(x, y) {
            if (g.show(x, y)) {
                ctx.fillStyle = '#000';
                ctx.fillRect(x * 16 - 4, y * 16 - 4, 24, 24);
                ctx.fillStyle = 'rgba(0,0,0,0.7)';
                ctx.fillRect(x * 16 - 6, y * 16 - 6, 28, 28);
            }
        }, this);
    },

    /**
     * Draws the in-game menu at the bottom.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     */
    drawMenu: function (ctx) {
        var price, i, o, disabled, x, y,
            width = g.columns * 16,
            height = g.rows * 16;
        // background
        for (x = 0; x < g.columns; x += 1) {
            for (y = 0; y < 2; y += 1) {
                this.drawSprite(ctx, 3, 0, x * 16, height + y * 16);
            }
        }
        // outline
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(0, height, width, 1);
        ctx.fillRect(0, height, 1, 32);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(0, height + 31, width, 1);
        ctx.fillRect(width - 1, height, 1, 32);

        // selected tower buttons
        ctx.font = '8px Arial';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        if (g.selTower) {
            price = g.towerPrices[g.idAt(g.selTower.x, g.selTower.y) - 3];
            // tower buttons
            o = g.objectAt(g.selTower.x, g.selTower.y);
            for (i = 0; i < 3; i += 1) {
                this.drawSprite(ctx, i + 1, 1, i * 32, height);
                disabled = false;
                switch (i) {
                case 0: // sell
                    ctx.fillText(o.used ? price / 2 : price, 8, height + 24);
                    break;
                case 1: // upgrade
                    ctx.fillText(price, 40, height + 24);
                    disabled = price > g.money || o.level === 4;
                    break;
                case 2: // turn
                    disabled = !o.dir;
                    break;
                }
                if (disabled) {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(this.tiles, 48, 0, 16, 15, i * 32, height + 1, 16, 15);
                    ctx.drawImage(this.tiles, 48, 0, 16, 15, i * 32, height + 16, 16, 15);
                    ctx.globalAlpha = 1;
                }
            }
        }
        // tools
        else {
            // EVP listener
            o = g.spawnersNear(Math.floor(g.player.pos.x / 16), Math.floor(g.player.pos.y / 16));
            this.drawSprite(ctx, 4, 7, 0, height);
            this.drawSprite(ctx, 5 + o, 7, 0, height);

            // tower buttons
            for (i = 0; i < g.towerPrices.length; i += 1) {
                price = g.towerPrices[i];
                if (!this.down || this.down.y < g.rows || this.down.y > g.rows + 1 ||
                    this.down.x !== i + 1 || g.money < g.towerPrices[i]) {
                    this.drawTile(ctx, i + 1, g.rows, 3 + i);
                }
                ctx.fillStyle = '#fff';
                ctx.fillText(price, i * 16 + 24, height + 24);
                if (price > g.money) {
                    ctx.globalAlpha = 0.5;
                    ctx.drawImage(this.tiles, 48, 0, 16, 15, (i + 1) * 16, height + 1, 16, 15);
                    ctx.drawImage(this.tiles, 48, 0, 16, 15, (i + 1) * 16, height + 16, 16, 15);
                    ctx.globalAlpha = 1;
                }
            }
        }

        ctx.fillStyle = '#222';
        ctx.textAlign = 'right';
        // money
        ctx.fillText(g.money, width - 43, height + 12);
        this.drawSprite(ctx, 6, 1, width - 42, height);
        // spawners
        ctx.fillText(String(g.numSpawners - g.wave - 1), width - 18, height + 12);
        this.drawSprite(ctx, 0, 0, width - 17, height);

        // level
        ctx.fillText('Floor ' + (g.levelCount + 1), width - 32, height + 27);

        // ffwd and pause button
        if (g.state === state.ACTIVE) {
            this.drawSprite(ctx, 6, 6, width - 32, height + 16);
            this.drawSprite(ctx, 5, 6, width - 16, height + 16);
        }
    },

    /**
     * Updates used screen size and draws current game state (including complete redraw if necessary).
     */
    update: function () {
        var scale = this.getScale(), i, div, full,
            redraw = g.redraw || window.innerWidth !== this.width || window.innerHeight !== this.height;
        if (redraw) {
            // set current size and offsets
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.offsetX = (this.width - g.columns * 16 * scale) / 2;
            this.offsetY = (this.height - (g.rows + 2) * 16 * scale) / 2;
            for (i = 0; i < 3; i += 1) {
                this.resize(i, scale);
            }

            // update info screen menus
            full = g.save.full ? 'Fullscreen' : 'Faithful';
            for (i = 0; i < 5; i += 1) {
                div = document.getElementById(['title', 'pause', 'end', 'potion', 'mode'][i]);
                if (g.state === [state.TITLE, state.PAUSED, state.WIN, state.POTION, state.MODE][i]) {
                    this.resizeDiv(div, scale);
                    switch (g.state) {
                    case state.TITLE:
                        document.getElementById('title-resume').style.display = g.save.lastLevel ? 'inline' : 'none';
                        document.getElementById('title-full').innerHTML = full;
                        break;
                    case state.PAUSED:
                        document.getElementById('pause-full').innerHTML = full;
                        break;
                    case state.POTION:
                        document.getElementById('potion-cost').innerHTML = g.potionCost;
                        document.getElementById('potion-money').innerHTML = g.money;
                        break;
                    }
                    div.style.display = 'block';
                }
                else {
                    div.style.display = 'none';
                }
            }
        }

        // update animations
        if (this.upgradeAnim) {
            this.upgradeAnim.time -= 1;
            if (this.upgradeAnim.time <= 0) {
                this.upgradeAnim = null;
            }
        }

        // draw actual game
        if (g.state === state.ACTIVE) {
            this.drawBoard(scale, redraw);
            this.drawEffects(scale);
            if (redraw) {
                this.drawFog(scale);
            }
            this.drawMenu(this.ctx[1]);
        }

        if (g.state !== state.ACTIVE && redraw) {
            // draw background for info screens
            this.ctx[1].fillStyle = '#111';
            this.ctx[1].fillRect(0, 0, g.columns * 16, g.rows * 16);
            // draw title screen
            if (g.state === state.TITLE) {
                this.drawTitle(this.ctx[1], scale);
            }
            // draw menu in pause screen
            else if (g.state === state.PAUSED) {
                this.drawMenu(this.ctx[1]);
            }
        }

        //this.showFPS();
    },

    lastFPS: 0,
    FPS: 0,
    second: 0,
    /**
     * Show FPS in the document title.
     */
    showFPS: function() {
        var s = (new Date()).getSeconds();
        if (s !== this.second) {
            this.second = s;
            this.lastFPS = this.FPS;
            this.FPS = 0;
        }
        this.FPS += 1;
        document.title = String(this.lastFPS);
    },

    /**
     * Draws a spirit including health bar.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     * @param {Spirit} spirit Spirit.
     */
    drawSpirit: function (ctx, spirit) {
        var health, r, g;
        // make shadows and ghosts translucent
        if (spirit.id === 0 || spirit.id === 1) {
            ctx.globalAlpha = 0.7;
        }
        // draw spirit
        this.drawSprite(ctx, spirit.dir.y ? 1 + spirit.dir.y : 2 + spirit.dir.x, spirit.id + 3,
            spirit.pos.x - 8, spirit.pos.y - 8);
        ctx.globalAlpha = 1;
        // draw health bar
        health = Math.floor(spirit.life / spirit.maxLife * 12);
        ctx.fillStyle = '#111';
        ctx.fillRect(spirit.pos.x - 7, spirit.pos.y + 6, health + 2, 2);
        r = (11 - health) * 12 + 50;
        g = health * 12 + 50;
        ctx.fillStyle = 'rgb(' + [r, g, 50] + ')';
        ctx.fillRect(spirit.pos.x - 6, spirit.pos.y + 7, health, 1);
    },

    /**
     * Draws a sprite.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     * @param {number} sx Horizontal offset in tile set.
     * @param {number} sy Vertical offset in tile set.
     * @param {number} x x coordinate in pixels.
     * @param {number} y y coordinate in pixels.
     */
    drawSprite: function(ctx, sx, sy, x, y) {
        ctx.drawImage(this.tiles, sx * 16, sy * 16, 16, 16, x, y, 16, 16);
    },

    /**
     * Draws a square usually including multiple tiles.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     * @param {number} x x coordinate in squares
     * @param {number} y y coordinate in squares
     * @param {number} id Tile ID
     */
    drawTile: function (ctx, x, y, id) {
        var o, offset;
        // put dirt under everything on the board
        if (g.valid(x, y) && id !== 0) {
            this.drawSprite(ctx, 1, 0, x * 16, y * 16);
        }
        // draw base sprite
        this.drawSprite(ctx, id + 1, 0, x * 16, y * 16);

        // draw decoration for tower
        if (id > 2) {
            o = g.objectAt(x, y);
            if (o) {
                // level
                ctx.fillStyle = '#0b0';
                ctx.fillRect(x * 16 + 6, y * 16 + 13, o.level, 1);
                // orientation
                if (o.dir) {
                    offset = o.dir.x ? 6 + o.dir.x : 5 - o.dir.y;
                    this.drawSprite(ctx, offset, 2 * (7 - id) + (o.active() ? 1 : 0), x * 16, y * 16);
                }
            }
            else if (id > 4) {
                this.drawSprite(ctx, 4, 2 * (7 - id), x * 16, y * 16);
            }
        }
        // draw outline for dirt and stone
        if(id === 1 || id === 2) {
            ctx.fillStyle = 'rgba(255,255,255,0.2)';
            if(!g.valid(x, y - 1) || g.idAt(x, y - 1) !== id) {
                ctx.fillRect(x * 16, y * 16, 16, 1);
            }
            if(!g.valid(x - 1, y) || g.idAt(x - 1, y) !== id) {
                ctx.fillRect(x * 16, y * 16, 1, 16);
            }
            ctx.fillStyle = 'rgba(0,0,0,0.2)';
            if(!g.valid(x, y + 1) || g.idAt(x, y + 1) !== id) {
                ctx.fillRect(x * 16, y * 16 + 15, 16, 1);
            }
            if(!g.valid(x + 1, y) || g.idAt(x + 1, y) !== id) {
                ctx.fillRect(x * 16 + 15, y * 16, 1, 16);
            }
        }
    },

    /**
     * Draws additional sprites for objects that often change.
     *
     * @param {CanvasRenderingContext2D} ctx Context used.
     * @param {number} x x coordinate in squares
     * @param {number} y y coordinate in squares
     * @param {number} id Tile ID
     */
    drawTileEffect: function (ctx, x, y, id) {
        var offset,
            o = g.objectAt(x, y),
            animated = this.upgradeAnim &&  x === this.upgradeAnim.pos.x && y === this.upgradeAnim.pos.y;
        if (o) {
            // automatically targeting towers and spawners
            if (!o.dir && (o.active() || animated)) {
                this.drawSprite(ctx, id + 1, 1, x * 16, y * 16);
            }

            // manually targeting towers
            if (id > 2 && o.dir) {
                offset = o.dir.x ? 6 + o.dir.x : 5 - o.dir.y;
                this.drawSprite(ctx, offset, 2 * (7 - id), x * 16, y * 16);
                if (o.active() || animated) {
                    this.drawSprite(ctx, offset, 2 * (7 - id) + 1, x * 16, y * 16);
                }
            }
        }
    },

    /**
     * @param {MouseEvent} e
     */
    onMouseDown: function (e) {
        // convert coordinates
        var ratio = this.getScale() * 16,
            x = Math.floor((e.pageX - this.offsetX) / ratio),
            y = Math.floor((e.pageY - this.offsetY) / ratio);
        // activate forwarding
        if (y === g.rows + 1 && x === g.columns - 2) {
            g.forward(true);
        }
        // remember where we clicked / tapped
        this.down = {x: x, y: y};
    },

    /**
     * @param {MouseEvent} e
     */
    onMouseUp: function (e) {
        // convert coordinates
        var ratio = this.getScale() * 16,
            x = Math.floor((e.pageX - this.offsetX) / ratio),
            y = Math.floor((e.pageY - this.offsetY) / ratio);
        // abort if we don't know if this is a tap / click or drag action
        if (!this.down) {
            return;
        }
        // handle tap / click
        if (x === this.down.x && y === this.down.y) {
            this.onClick(x, y);
        }
        // handle drag
        else {
            this.onMove(this.down.x, this.down.y, x, y);
        }
        // turn of forwarding
        g.forward(false);
        this.down = null;
    },

    /**
     * @param {MouseEvent} e
     */
    onKeyDown: function(e) {
        if (e.keyCode === 32) {
            g.togglePause();
        }
    },

    /**
     * @param {number} x x coordinate of drag start in squares
     * @param {number} y y coordinate of drag start in squares
     * @param {number} tx x coordinate of drag end in squares
     * @param {number} ty y coordinate of drag end in squares
     */
    onMove: function (x, y, tx, ty) {
        // buy and add tower
        if (g.state === state.ACTIVE && g.valid(tx, ty) &&
            y >= g.rows && y <= g.rows + 1 && x > 0 && x <= g.towerPrices.length) {
            g.movePlayer(tx, ty, true, x - 1);
        }
    },

    /**
     * @param {number} x x coordinate of tap / click
     * @param {number} y y coordinate of tap / click
     */
    onClick: function (x, y) {
        if (g.state === state.ACTIVE) {
            // deselect tower
            if (g.valid(x, y)) {
                g.selTower = null;
                g.movePlayer(x, y);
            }
            // handle pause button
            else if (x === g.columns - 1 && y === g.rows + 1) {
                g.togglePause();
            }
            // handle selected tower actions
            else if (y >= g.rows && y <= g.rows + 1 && g.selTower !== null) {
                switch (x) {
                case 0:
                    g.sellTower(g.selTower.x, g.selTower.y);
                    g.selTower = null;
                    break;
                case 2:
                    if (g.upgradeTower(g.selTower.x, g.selTower.y)) {
                        this.upgradeAnim = {pos: g.selTower, time: 10};
                    }
                    break;
                case 4:
                    g.turnTower(g.selTower.x, g.selTower.y);
                    break;
                }
            }
        }
    }
};