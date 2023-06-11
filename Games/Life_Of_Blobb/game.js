(function() {
    var w = window;
    var requestAnimationFrame =
        w.requestAnimationFrame ||
        w.oRequestAnimationFrame ||
        w.mozRequestAnimationFrame ||
        w.webkitRequestAnimationFrame ||
        w.msRequestAnimationFrame;

    if (!requestAnimationFrame) {
        var lastTime = 0;
        requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = w.setTimeout(function() { callback(currTime + timeToCall); }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }

    var width = 600;
    var height = 800;

    function constrain(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    function random() {
        return Math.random();
    }

    function blobInRect(blob, x, y, w, h) {
        var closestX = constrain(blob.x, x, x + w);
        var closestY = constrain(blob.y, y, y + h);

        // Calculate the distance between the circle's center and this closest point
        var distanceX = blob.x - closestX;
        var distanceY = blob.y - closestY;

        // If the distance is less than the circle's radius, an intersection occurs
        var distanceSquared = (distanceX * distanceX) + (distanceY * distanceY);
        return distanceSquared < (blob.radius * blob.radius);
    }

    function setObject(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
    }

    function getObject(key) {
        var value = localStorage.getItem(key);
        return value && JSON.parse(value);
    }

    // ==== GAME PRIMITIVES
    //
    var Tunnel = klass(function() {
        this.width = 90;
        this.height = 20;
        this.gateRadius = new Blob();
        this.init();
    })
    .methods({
        // minimum offset from edges
        offset: 50,

        init: function() {
            this.y = random() * height - height;
            this.start = constrain(random() * width, this.offset, width - this.offset - this.width);
            this.end = this.start + this.width;
            this.passed = false;
            this.minDistance = (width - 2 * this.offset) / 4 + this.height;
        },

        draw: function(ctx) {
            var height = this.height;
            var bottom = this.y;
            var top = bottom - height;
            ctx.beginPath();

            ctx.moveTo(0, top);
            ctx.lineTo(this.start, top);
            ctx.lineTo(this.start, bottom);
            ctx.lineTo(0, bottom);

            ctx.moveTo(width, top);
            ctx.lineTo(this.end, top);
            ctx.lineTo(this.end, bottom);
            ctx.lineTo(width, bottom);

            ctx.closePath();

            ctx.fillStyle = "#ea4a18";
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = "#ffac2c";
            ctx.stroke();
        },

        top: function() {
            return this.y - this.height;
        },

        intersectsWith: function(blob) {
            return blobInRect(blob, 0, this.y - this.height, this.start, this.height) ||
                   blobInRect(blob, this.end, this.y - this.height, width - this.end, this.height);
        },

        interact: function(player) {
            if (this.intersectsWith(player)) {
                player.radius = 0;
            } else if (!player.dead() && !this.passed && this.top() > player.y + player.radius) {
                this.passed = true;
            }
        },

        afterInit: function(game) {
            // ensure distance from other tunnel
            var tunnels = game.tunnels;

            for (var i = 0; i < tunnels.length; i++) {
                if (tunnels[i] != this && Math.abs(this.y - tunnels[i].y) < this.minDistance) {
                    this.y = tunnels[i].y - this.minDistance;
                }
            }

            // remove blobs around tunnel
            var enemies = game.enemies;
            var gateRadius = this.gateRadius;
            var enemy;

            gateRadius.x = (this.start + this.end) / 2;
            gateRadius.y = this.y - this.height / 2;
            gateRadius.radius = 2*this.height;

            for (var i = 0; i < enemies.length; i++) {
                enemy = enemies[i];

                if (blobInRect(enemy, 0, this.y-this.height, width, this.height) || gateRadius.overlap(enemy)) {
                    enemy.radius = 0;
                }
            }
        }
    });

    var Blob = klass(function(options) {

        this.minSize = options && options.minSize || 5;
        this.maxSize = options && options.maxSize || 60;

        this.init();
    })
    .methods({
        init: function() {
            this.radius = Math.max(this.minSize, random() * this.maxSize);
            this.x = random() * width;
            this.y = random() * height - height;
        },

        draw: function(ctx) {
            var radius = this.radius;

            if (radius == 0 || this.y + radius < 0) {
                return;
            }
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI, false);
            ctx.closePath();
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.lineWidth = 3;
            ctx.strokeStyle = this.strokeColor;
            ctx.stroke();
        },

        centerDistance: function(other) {
            return Math.sqrt(Math.pow(this.x - other.x, 2) + Math.pow(this.y - other.y, 2));
        },

        top: function() {
            return this.y - this.radius;
        },

        overlap: function(other) {
            var r = this.radius;
            var R = other.radius;

            var d = this.centerDistance(other);
            var overlapDistance = (r + R - d) / 2;
            return (R && overlapDistance > 0);
        },

        interact: function(player) {
            var r = this.radius;
            var R = player.radius;

            var d = this.centerDistance(player);
            var overlapDistance = (r + R - d) / 2;
            var overlap =  (R && overlapDistance > 0);

            if (r > R) {
                this.color = "#ea4a18";
                this.strokeColor = "#ffac2c";
            } else {
                this.color = "#317393";
                this.strokeColor = "#82c0cf";
            }

            if (overlap) {
                var pi = Math.PI;
                var mod = r < R ? -1 : 1;
                while (R && r && (r + R - d) > 0) {
                    this.radius = r = Math.max(0, r + mod/r);
                    player.radius = R = Math.max(0, R - mod/R);
                    player.score += (R > 50) ? .2 : 1;
                    d = this.centerDistance(player);
                }

            }
        }
    });

    var Player = Blob.extend(function() {
        this.radius = 10;

        this.x = width / 2;
        this.y = height * 7/8;

        this.color = '#cccccc';
        this.strokeColor = '#f1f1f1';

        this.speed = 0;

        this.progress = 0;
        this.score = 0;
    })
    .methods({
        dead: function() {
            return this.radius < 1;
        },

        die: function() {
            this.radius = 0;
        },

        compare: function(size) {
            var radius = this.radius;
            size = size || {};

            if (size.min && radius < size.min) {
                return -1;
            }

            if (size.max && radius > size.max) {
                return 1;
            }

            return 0;
        }
    });

    var Splitter = Blob.extend(function() {
        this.init();
        this.rotation = 0;
        this.radius = 10;
    }).methods({
        draw: function(ctx) {
            var pi = Math.PI;
            var rotation = this.rotation + pi / 180;
            this.rotation = rotation;
            ctx.lineWidth = 1;
            ctx.strokeStyle = '#003300';
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2*pi, true);
            ctx.closePath();
            ctx.fillStyle = "#009900";
            ctx.fill();
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, rotation, rotation + pi, true);
            ctx.closePath();
            ctx.fillStyle = "#00ee00";
            ctx.fill();
            ctx.stroke();
        },

        init: function() {
            this.x = random() * width;
            this.y = random() * height - height;
        },

        interact: function(player) {
            if (this.overlap(player)) {
                player.radius /= 2;
                this.init();
            }
        }
    });

    // ==== DIALOGS
    //
    var Dialog = klass({
        wrapper: function() {
            var wrapper = this._wrapper;

            if (!this._wrapper) {
                wrapper = document.createElement("div");
                wrapper.className = "dialog";
                document.body.appendChild(wrapper);
                this._wrapper = wrapper;
            }

            return wrapper;
        },

        toggle: function(visible) {
            this.wrapper().style.display = visible ? "block" : "none";
        }
    });

    var InfoDialog = Dialog.extend(function() {
        this._wrapper = document.getElementById("info");
    });

    var ScoresDialog = Dialog.extend({
        render: function(levels) {
            var wrapper = this.wrapper();
            wrapper.id = "scores";

            var info = this.processLevels(levels);
            wrapper.innerHTML =
                "<h1>Highscore <span id='score'>" + Math.floor(info.totalScore) + "</span></h1>" +
                "<ul class='levels'>" +
                    info.html +
                "</ul>" +
                "<p>Your high score is the total of level scores</p>" +
                "<p>Replay levels to improve your score!</p>" +
                "<button id='unpause'>Un<u>p</u>ause</button>&nbsp;" +
                "<button id='restart'><u>R</u>estart level</button>";
        },

        processLevels: function(levels) {
            var total = 0;
            var html = "";
            var scores = getObject("scores") || {};

            for (var i = levels.length-1; i >= 0; i--) {
                var level = levels[i];
                var score = level.score || scores[i] || 0;
                var reached = level.reached || (i > 0 && scores[i - 1]);

                total += score;

                html += "<li class='" + (reached ? "reached" : "unavailable") + "' data-id='" + i + "'>" +
                            "<a class='description'>" + (reached ? level.title : "???") +
                             (score ? "<span class='score'>" + Math.floor(score) + "</span>" : "") +
                            "</a>" +
                        "</li>";
            }

            return { html: html, totalScore: total };
        }
    });

    var infoDialog = new InfoDialog();
    var highScores = new ScoresDialog();

    // ==== LEVELS DECLARATIONS AND SCRIPTING
    //
    // guide the player to change the blob size on each tick
    function sizeTick(game) {
        var player = game.player;
        var compare = player.compare(this.endSize);
        var messages = game.messages;
        var color = compare < 0 ? "#99f" :
                    compare > 0 ? "#f99" :
                    "#ccc";

        if (this.compare === compare && player.color == color) {
            return;
        }

        this.compare = compare;

        player.color = color;

        if (this.sizingMessages === false) {
            return;
        }

        var endsIn = +new Date;

        if (messages.length) {
            if (messages[messages.length - 1].aboutSizing) {
                // remove last message about sizing
                messages.pop();
            } else {
                // queue after last message
                endsIn = messages[messages.length - 1].endsIn;
            }
        }

        var message = { endsIn: endsIn + 3000, opacity: 1, aboutSizing: true };

        if (compare < 0) {
            message.title = "Get bigger!";
            message.message = "Consume blue blobs";
        } else if (compare > 0) {
            message.title = "Get smaller!";
            message.message = "Split yourself or brush off red blobs";
        } else {
            message.title = "You're in good shape";
            message.message = "Finish the level in that size";
        }

        messages.push(message);
    }

    // split enemies into two ranges
    function splitEnemiesTick(min,max,mid) {
        return function (game) {
            var enemies = game.enemies;
            var min = min;
            var max = max;
            var mid = mid || (min + (max - min) / 2) + 5;

            for (var i = 0; i < enemies.length; i++) {
                var r = enemies[i].radius;
                if (min < r && r < max) {
                    if (r > mid) {
                        r = max;
                    } else {
                        r = min;
                    }

                    enemies[i].radius = r;
                }
            }
        };
    }

    function timerTick(game) {
        var now = +new Date;
        var timeRemaining = (this.endTime - now) / 1000;
        var messages = game.messages;
        var message = messages[messages.length - 1];

        if (!message || timeRemaining < 0) {
            game.lose();
        } else {
            message.title = timeRemaining.toFixed(1) + "s";
        }
    }

    function timerSetup(seconds) {
        return function(game) {
            this.endTime = +new Date + 1000 * seconds;

            game.messages[0].endsIn = this.endTime;

            this.tick(game);
        }
    }

    var splitEnemies1020 = splitEnemiesTick(18, 25, 17);

    // level array. all levels are scriptable through the setup/tick callbacks
    var levels = [
        {
            title: "In the beginning, there were blobs",
            reached: true,
            enemies: 30,
            powerups: 1,
            endSize: {
                min: 40,
                max: 60
            }
        },
        {
            title: "Eat your way to the top",
            enemies: 40,
            powerups: 6,
            endSize: {
                min: 15,
                max: 25
            },
            tick: splitEnemiesTick(5, 30)
        },
        {
            title: "The big slalom",
            enemies: { count: 40, minSize: 1, maxSize: 70 },
            powerups: 6,
            endSize: {
                min: 15,
                max: 25
            },
            tick: splitEnemiesTick(5, 60, 35)
        },
        {
            title: "Keep your form fit ",
            enemies: { count: 20, maxSize: 30 },
            endSize: {
                min: 10,
                max: 20
            },
            tunnels: 3,
            powerups: 3
        },
        {
            title: "Missing the gap is lethal",
            enemies: 30,
            endSize: {
                min: 20,
                max: 40
            },
            tunnels: 1,
            powerups: 1
        },
        {
            title: "Don't get lost in the crowd",
            enemies: { count: 75, maxSize: 50 },
            powerups: 3,
            endSize: {
                min: 1,
                max: 50
            },
            tick: splitEnemiesTick(5, 50, 10)
        },
        {
            title: "Eat to succeed",
            enemies: { count: 13, maxSize: 8 },
            powerups: 30,
            endSize: {
                min: 40,
                max: 70
            }
        },
        {
            title: "Pills can kill you",
            enemies: { count: 7, minSize: 10, maxSize: 20 },
            powerups: 10,
            endSize: {
                min: 50,
                max: 100
            },
            setup: function(game) {
                game.player.radius = 80;
            }
        },
        {
            title: "Punctuality is a virtue",
            enemies: { count: 40, maxSize: 50 },
            powerups: 1,
            endSize: {
                min: 40,
                max: 70
            },
            sizingMessages: false,
            setup: timerSetup(30),
            tick: function(game) {
                splitEnemies1020.call(this, game);
                timerTick.call(this, game);
            }
        },
        {
            title: "Don't catch your breath",
            enemies: { count: 30, maxSize: 45 },
            tunnels: 1,
            powerups: 1,
            setup: timerSetup(30),
            tick: timerTick
        },
        {
            title: "Epilogue",
            enemies: { count: 60, minSize: 4, maxSize: 8 },
            length: 5*height,
            setup: function(game) {
                var lastEnemy = game.enemies[0];
                lastEnemy.x = width / 2;
                lastEnemy.y = -this.length - height / 1.7;
                lastEnemy.radius = width;
            }
        }
    ];

    // ==== MAIN GAME OBJECT / LOOP
    //
    var game = (function() {
        var gameObjects = {
            enemies: { type: Blob },
            tunnels: { type: Tunnel },
            powerups: { type: Splitter }
        };

        var defaultLevelLength = 14 * height;

        var bonusTimeLimit = 60 * 1000;
        var fullBonus = 5000;

        return {
            messages: [],

            preload: function(images, whenDone) {
                var loadCount = images.length;
                var that = this;
                var image, i;

                function imageLoad() {
                    loadCount--;
                    if (!loadCount) {
                        whenDone.call(that, images);
                    }
                }

                for (i = 0; i < images.length; i++) {
                    image = new Image();
                    image.onload = imageLoad;
                    image.src = images[i];
                    images[i] = image;
                }
            },

            init: function(canvas) {
                this.hudWidth = 10;

                // setup canvas element
                canvas.width = width + this.hudWidth;
                canvas.height = height;
                canvas.style.margin = "-" + height/2 + "px 0 0 -" + width/2 + "px";

                this.currentLevel = 0;

                this.ctx = canvas.getContext("2d");

                this.preload([ "bg.png" ], function(images) {
                    this.backgroundPattern = this.ctx.createPattern(images[0], "repeat");

                    this.start();

                    this.pause();

                    this.background(this.ctx);

                    infoDialog.toggle(true);

                    requestAnimationFrame(function step(timestamp) {
                        game.tick();
                        requestAnimationFrame(step);
                    });

                    this.worldProgress = 0;
                });
            },

            start: function() {
                var currentLevel = this.currentLevel % levels.length;
                var level = levels[currentLevel];
                var now = +new Date();

                this.messages.length = 0;

                this.minSpeed = 2;

                this.player = new Player();

                this.paused = false;
                highScores.toggle(false);

                this.startWorldProgress = this.worldProgress || 0;

                this.startTime = now;
                this.bonusPoints = fullBonus;
                this.timeOffset = 0;

                for (var field in gameObjects) {
                    var array = [];
                    var objectInfo = gameObjects[field];
                    var options = level[field]
                    var count = options && options.count || options || 0;
                    for (var i = 0; i < count; i++) {
                        array.push(new objectInfo.type(options));
                    }
                    this[field] = array;
                }

                for (var i = 0; i < levels[currentLevel].tunnels || 0; i++) {
                    this.tunnels[i].afterInit(this);
                }

                this.messages.push({
                    title: "Level " + (currentLevel + 1),
                    message: levels[currentLevel].title,
                    endsIn: now + 4000,
                    opacity: 1
                });

                this.speed = 30;

                if (!level.length) {
                    // default level length
                    level.length = defaultLevelLength;
                }

                if (level.setup) {
                    level.setup(this);
                }

                this.levelLength = level.length;
            },

            tick: function() {
                var ctx = this.ctx;
                var now = +(new Date());
                var player = this.player;
                var level = levels[this.currentLevel];
                var progress = level ? player.progress / level.length : 1;

                if (!player.dead() && this.paused) {
                    return;
                }

                this.speed += constrain(this.minSpeed - this.speed, -1, 1);

                this.worldProgress += this.speed;

                this.background(ctx);

                if (!player.dead()) {
                    this.queuedMessage(ctx, now);
                }

                player.x = constrain(player.x + player.speed || 0, player.radius, width - player.radius);

                this.updateObjects(ctx, progress);

                if (level) {
                    if (level.endSize) {
                        sizeTick.call(level, this);
                    }

                    if (level.tick) {
                        level.tick(this);
                    }
                }

                if (!player.dead() && !this.won()) {
                    this.bonusPoints = Math.max(0, Math.floor(fullBonus * Math.round((1 - (now - this.startTime - this.timeOffset) / bonusTimeLimit) * 100) / 100));
                }

                this.score(ctx);

                if (!player.dead() || this.won()) {
                    player.draw(ctx);

                    player.progress += this.speed;

                    if (this.won()) {
                        this.showMessage("You kinda won...", "Better luck next time!");
                    }
                } else  {
                    this.showMessage("Level failed", "Press <Space> to retry");
                }

                this.progress(ctx, progress);

                this.goal(ctx);

                if (!this.won() && player.progress > level.length) {
                    // end of level reached, check if end size criteria is met
                    var compare = player.compare(level.endSize);
                    if (compare === 0) {
                        this.nextLevel();
                    } else {
                        this.lose();
                    }
                }
            },

            background: function(ctx) {
                ctx.fillStyle = this.backgroundPattern;
                ctx.translate(0, this.worldProgress % 38);
                ctx.fillRect(0, -38, width, height + 38);
                ctx.translate(0, -this.worldProgress % 38);
            },

            queuedMessage: function(ctx, now) {
                var message = this.messages[0];
                if (!message) {
                    return;
                }

                if (message.endsIn > now || message.opacity > 0) {
                    this.showMessage(message.title, message.message, message.opacity);
                    if (message.endsIn < now) {
                        message.opacity -= 0.05;
                    }
                } else {
                    this.messages.shift();
                }
            },

            updateObjects: function(ctx, progress) {
                var player = this.player;
                var speed = this.speed;
                var level = levels[this.currentLevel];
                var recycle = (progress * height < this.levelLength) && (this.goalPosition() > 2*height);

                for (var field in gameObjects) {
                    var array = this[field];
                    for (var i = 0, len = array.length; i < len; i++) {
                        var obj = array[i];

                        obj.y += speed;

                        obj.interact(player);

                        if (recycle && obj.top() > height) {
                            obj.init();
                        }

                        obj.draw(ctx);
                    }

                    if (player.dead()) {
                        this.lose();
                    }
                }

                var tunnels = this.tunnels;
                for (var i = 0; i < tunnels.length; i++) {
                    tunnels[i].afterInit(this);
                }
            },

            score: function(ctx) {
                ctx.save();
                ctx.shadowColor = "rgba(0,0,0,1)";
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.font = "16pt Arial";
                ctx.fillStyle = "#f1f1f1";

                ctx.textAlign = "right";
                ctx.fillText("Level score: " + Math.floor(this.player.score), width - 10, 30);

                ctx.textAlign = "left";
                ctx.fillText("Time bonus: " + this.bonusPoints, 10, 30);

                ctx.restore();
            },

            progress: function(ctx, amountDone) {
                var hudWidth = this.hudWidth;

                ctx.fillStyle = "#111";
                ctx.fillRect(width, 0, hudWidth, height);

                var indicatorHeight = height * amountDone;

                ctx.fillStyle = "#2c7fff";
                ctx.fillRect(width, height - indicatorHeight, hudWidth, indicatorHeight);

            },

            goalPosition: function() {
                return this.levelLength - this.worldProgress + this.startWorldProgress;
            },

            goal: function(ctx) {
                var player = this.player;
                var goalPosition = this.goalPosition();

                if (goalPosition < height) {
                    ctx.beginPath();
                    ctx.moveTo(0, player.y - goalPosition);
                    ctx.lineTo(width, player.y - goalPosition);
                    ctx.lineTo(width, player.y - goalPosition + 10);
                    ctx.lineTo(0, player.y - goalPosition + 10);
                    ctx.closePath();
                    ctx.fillStyle = "#fff";
                    ctx.fill();
                }
            },

            accelerate: function() {
                this.minSpeed = 10;
            },

            decelerate: function() {
                this.minSpeed = 1;
            },

            normalize: function() {
                this.minSpeed = 2;
            },

            pause: function() {
                this.paused = !this.paused;

                if (this.paused) {
                    this._pauseStart = +new Date;
                } else {
                    this.timeOffset += (+new Date - this._pauseStart);
                }
            },

            showMessage: function (title, message, opacity) {
                var ctx = this.ctx;

                opacity = opacity || 1;

                ctx.save();
                ctx.shadowColor = "rgba(0,0,0,1)";
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;
                ctx.shadowBlur = 5;
                ctx.textAlign = "center";

                var textColor = "rgba(257,257,257," + opacity + ")";

                ctx.font = "24pt Arial";
                ctx.fillStyle = textColor;
                ctx.fillText(title, width/2, height/2);

                ctx.font = "16pt Arial";
                ctx.fillStyle = textColor;
                ctx.fillText(message, width/2, height/2 + 30);

                ctx.restore();
            },

            renderStatus: function(message) {
                var ctx = this.ctx;

                ctx.font = "16pt Arial";
                ctx.fillStyle = "#fff";
                ctx.textAlign = "center";
                ctx.fillText(message, width/2, height/2);
            },

            recordScore: function() {
                var score = this.player.score;

                levels[this.currentLevel].score = score;

                var scores = getObject("scores") || {};
                scores[this.currentLevel] = score;
                setObject("scores", scores);
            },

            nextLevel: function() {
                this.player.score += this.bonusPoints;

                this.recordScore();

                this.currentLevel++;

                if (this.currentLevel < levels.length) {
                    this.start();
                } else {
                    this.win();
                }
            },

            won: function() {
                return !levels[this.currentLevel];
            },

            win: function() {
                this.normalize();
            },

            lose: function() {
                this.player.die();

                this.normalize();
            }
        };
    })();

    function on(type, handler) {
        document.body.addEventListener(type, handler, false);
    }

    var UP = 38, DOWN = 40, LEFT = 37, RIGHT = 39, SPACE = 32, ESC = 27;
    var A = 65, S = 83, D = 68, W = 87, P = 80, R = 82, I = 73;

    on("keydown", function(e) {
        var key = e.keyCode;
        var player = game.player;

        if (key == ESC) {
            if (game.paused) {
                game.pause();
            }

            infoDialog.toggle(false);
            highScores.toggle(false);
        } else if (key == P) {
            game.pause();

            infoDialog.toggle(false);
            highScores.render(levels);
            highScores.toggle(game.paused);
        } else if (key == I) {
            game.pause();
            highScores.toggle(false);
            infoDialog.toggle(game.paused);
        } else if (key == R && game.paused) {
            game.start();
        } else if (!player.dead() && !game.won()) {
            if (key == RIGHT || key == D) {
                player.speed = 4;
            } else if (key == LEFT || key == A) {
                player.speed = -4;
            } else if (key == UP || key == W) {
                game.accelerate();
            } else if (key == DOWN || key == S) {
                game.decelerate();
            }
        } else {
            if (key == SPACE) {
                if (game.won()) {
                    game.currentLevel = 0;
                }

                game.start();
            }
        }
    });

    on("keyup", function(e) {
        var key = e.keyCode;
        if (key == UP || key == DOWN || key == W || key == S) {
            game.normalize();
        } else if (key == LEFT || key == RIGHT || key == A || key == D) {
            game.player.speed = 0;
        }
    });

    function nodeName(node) {
        return node.nodeName.toLowerCase();
    }

    function closest(node, tagName) {
        var body = document.body;

        while (node != body && nodeName(node) != tagName) {
            node = node.parentNode;
        }

        if (node == body) {
            return false;
        } else {
            return node;
        }
    }

    on("click", function(e) {
        var target = e.target;
        var button = closest(target, "button");
        var li = closest(target, "li");

        if (button) {
            highScores.toggle(false);
            infoDialog.toggle(false);

            if (button.id == "unpause") {
                game.pause();
            } else {
                game.start();
            }
        } else if (li && li.className == "reached") {
            // level selection
            var level = li.getAttribute("data-id");
            game.currentLevel = level;
            game.start();
        }
    });

    w.game = game;
})();

