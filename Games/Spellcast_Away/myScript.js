window.onload = function () {
    init();
}

function clearExtraIntervals(intervalsArray) {
    for (var i = 0; i < intervalsArray.length; i++) {
        clearIntervalGbl(intervalsArray[i]);
    }
}

function gameInit() {
    killAllShapes(shapeList);
    clearExtraIntervals(intervals);
    shapeList = [];
    currentLevel = [];

    startMainLoop();
    startTime = new Date(Date.now());
    frameCount = 0;
    color = "#FF0000";
    c = document.getElementById('canvas');
    hud = null;
    //fishToEat = 0;
    InitShapes();
}

function killAllShapes(list) {
    if (list != undefined && list != null) {
        for (var i = 0; i < list.length; i++) {
            if (list[i].kill) {
                list[i].kill();
            }
        }
    }
}

function init() {
    var showHelp = getParameterByName("showHelp");
    if (showHelp != undefined && showHelp != null && showHelp != "false") {
        alert('Mr Elementualle has been in a deserter island for a couple of years, \nunexpectedly he ran into a magic coconut which gave him magical powers that will help him escape from the island. \nPress:'
            + '\n    "1"  - to fix the raft, with your earth power, and gain some health;'
            + '\n    "2"  - to catch a fish, with your air power, and gain some health;'
            + '\n    "3"  - to attack the sharks, with your fire power;'
            + '\n    <=-  - to move left;'
            + '\n    -=>  - to move right.');
    }

    //Set up key listener
    function onkey(d, e) {
        if (!e) e = window.e;
        var c = e.keyCode;
        if (e.charCode && c == 0)
            c = e.charCode;



        if (c == 37) { //left
            if (this.magePlayer.direction != "L") {
                this.magePlayer.direction = "L";
                this.magePlayer.shape.vx = 0;
            }
            else
                this.magePlayer.shape.vx = -d * 2;
        } else if (c == 39) { //right
            if (this.magePlayer.direction != "R") {
                this.magePlayer.direction = "R";
            }
            else
                this.magePlayer.shape.vx = d * 2;
        }

        //key 1
        if (c == 49) {
            earthSpellLogic();
        }

        //key 2
        if (c == 50) {
            airSpellLogic();
        }

        //key 3
        if (c == 51) {
            fireSpellLogic();
        }
    };
    document.onkeyup = function (e) {
        onkey(0, e);
    };
    document.onkeydown = function (e) {
        onkey(1, e);
    };

    document.getElementById("fire1").addEventListener('click', function () {
        fireSpellLogic();
    }, false);

    document.getElementById("air1").addEventListener('click', function () {
        airSpellLogic();
    }, false);

    document.getElementById("earth1").addEventListener('click', function () {
        earthSpellLogic();
    }, false);

    function fireSpellLogic() {
        if (magePlayer != null && magePlayer != undefined) {
            var btn = document.getElementById("fire1");
            if (!btn.disabled) {
                magePlayer.castSpell(3);
                lockoutSubmit(btn, 1000);
            }
        }
    }

    function airSpellLogic() {
        if (magePlayer != null && magePlayer != undefined) {
            var btn = document.getElementById("air1");
            if (!btn.disabled) {
                magePlayer.castSpell(2);
                lockoutSubmit(btn, 1000);
            }

        }
    }

    function earthSpellLogic() {
        if (magePlayer != null && magePlayer != undefined) {
            var btn = document.getElementById("earth1");
            if (!btn.disabled) {
                magePlayer.castSpell(1);
                lockoutSubmit(btn, 5000);
            }
        }
    }

    gameInit();
}


function startMainLoop() {
    var ONE_FRAME_TIME = 1000.0 / 60.0;
    setIntervalGbl(mainloop, ONE_FRAME_TIME);
}
function lockoutSubmit(button, cdValue) {
    var oldText = button.innerText;

    button.setAttribute('disabled', true);

    setTimeout(function () {
        button.innerText = oldText;
        button.removeAttribute('disabled');
    }, cdValue);

    var started = new Date(Date.now());
    var intervalMethod = function () {
        showCooldown(button, started, cdValue / 1000, oldText);
    };

    var interval = setIntervalGbl(intervalMethod, 1000); //update cooldown every sec
    setTimeout(function () {
        clearIntervalGbl(interval);
        button.value = oldText;
    }, cdValue - 1);

}

function showCooldown(obj, startTime, totalSeconds, oldText) {
    var now = new Date(Date.now());
    var secondsPast = new Date((now - startTime)).getSeconds();
    var totalLeft = totalSeconds - secondsPast;
    obj.innerText = oldText + " (" + totalLeft + ")";
}

/* ---- NAMESPACES (+) ---- */
var lvl = {
    init: function () {
        hud = new Hud();
    },

    lvl01: function () {

        var ys1 = [new waveCfg(-75, 0, 1)];
        var ys2 = ys = [new waveCfg(-35, -200, .8), new waveCfg(0, -30, 1)];
        waves = { ys1: ys1, ys2: ys2 };

        var lessThan = Math.random() < .5;
        var side1 = lessThan ? "R" : "L";
        var side2 = lessThan ? "L" : "R";


        currentLevel.push(new lvlEvent(0, new Raft()));
        currentLevel.push(new lvlEvent(3, new Shark(null, side1)));
        currentLevel.push(new lvlEvent(6, new Shark(null, side1)));
        currentLevel.push(new lvlEvent(10, new Fish()));
        currentLevel.push(new lvlEvent(13, new Shark(null, null, true)));
        currentLevel.push(new lvlEvent(16, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(16, new Fish()));
        currentLevel.push(new lvlEvent(18, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(20, new Shark(null, side1, true))); //9
        currentLevel.push(new lvlEvent(22, new Shark(null, side1, true)));
        currentLevel.push(new lvlEvent(23, new Fish()));

        lessThan = Math.random() < .5; side1 = lessThan ? "R" : "L"; side2 = side1 == "R" ? "L" : "R";

        currentLevel.push(new lvlEvent(27, new Shark(null, side1, true)));
        currentLevel.push(new lvlEvent(29, new Shark(null, side1)));
        currentLevel.push(new lvlEvent(30, new Fish()));
        currentLevel.push(new lvlEvent(30, new Shark(null, side1, true)));
        currentLevel.push(new lvlEvent(32, new Fish()));

        currentLevel.push(new lvlEvent(33, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(34, new Fish()));
        currentLevel.push(new lvlEvent(36, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(37, new Shark(null, side2)));
        currentLevel.push(new lvlEvent(37, new Fish()));
		
		
		currentLevel.push(new lvlEvent(40, new Shark(null, null, true)));
		currentLevel.push(new lvlEvent(43, new Shark(null, null, true)));
		
		
		
		
		
		
		// currentLevel.push(new lvlEvent(44, new Shark(null, null, true)));
		// currentLevel.push(new lvlEvent(45, new Shark(null, null, true)));
		// currentLevel.push(new lvlEvent(46, new Shark(null, null, true)));
		// currentLevel.push(new lvlEvent(47, new Shark(null, null, true)));

    }

}


var Constants = {
    PLAYER_MAX_HP: 6,
    SHARK_MAX_HP: 3,
    SPEED_NORMAL: 1,
    SPEED_ENRAGED: 2
}

var Mage = function (parent) {
    this.shape = gen(parent);
    this.direction = "R";

    this.spawn = function () {
        shapeList.push(that);
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(this);
    }

    this.healDps = function (dps) {
        var newHp = hud.health + dps;
        if (newHp > Constants.PLAYER_MAX_HP)
            newHp = Constants.PLAYER_MAX_HP;

        hud.health = newHp;
    }

    this.isSameDirection = function (otherShape) {
        var isRaft = that.shape.name;
        var res = otherShape.x >= this.shape.x && this.direction == "R"
                || otherShape.x <= this.shape.x && this.direction == "L"
                || (isRaft && (otherShape.x + otherShape.w) >= this.shape.x && otherShape.x <= (this.shape.x + this.shape.w))
        return res;
    }

    this.castSpell = function (attackId) {
        switch (attackId) {
            case 1: //earth, fix boat
                var dps = 1;
                cast(function () {
                    that.healDps(dps);
                }, 0, null, this);
                break;
            case 2: //air, get fish
                cast(function () { getFish() }, 0, null, this);
                break;
            case 3: //fire, attack shark
                var dps = 1;
                cast(function () { attackShark(dps); }, 0, null, this);
                break;
            default:
                ;
        }
    }

    this.isCasting = false;
    var that = this;

    function gen(parentShape) {
        var mageW = 85;
        var mageH = 130;
        var parentCenter = Math.floor(parentShape.w / 2);
        var mageCenter = Math.floor(mageW / 2);
        var mageX = parentShape.x + parentCenter - mageCenter;

        return new Shape(mageX, parentShape.y - mageH, mageW, mageH, "#038EEF", parentShape.vx, parentShape.vy, "mage")
    }

    function getFish() {
        for (var i = 0; i < shapeList.length; i++) {
            var item = shapeList[i];

            if (item.shape.name.lastIndexOf("fish", 0) === 0) {
                if (magePlayer.isSameDirection(item.shape)) {
                    item.catch();
                    break;
                }
            }

        }
    }

    function attackShark(dps) {
        //get shark to attack
        for (var i = 0; i < shapeList.length; i++) {
            var item = shapeList[i];

            if (item.shape.name.lastIndexOf("shark", 0) === 0) {
                if (magePlayer.isSameDirection(item.shape)) {
                    var newHp = item.takeDps(dps);
                    if (newHp == 0) {
                        item.kill();
                    }
                    break;
                }

            }
        }
    }


}

var Raft = function () {
    this.shape = new Shape(100, 370, 184, 18, "#0000FF", 0, 0, "raft");
    var that = this;
    this.mage = new Mage(this.shape);
    this.spawn = function () {
        shapeList.push(that);
        shapeList.push(that.mage);
        magePlayer = that.mage;
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(this);
    }

    this.takeDps = function (dps) {
        hud.health -= dps;
        return hud.health;
    }
}

var Shark = function (hp, spawnSide, goesEnrage) {
    if (goesEnrage == undefined || goesEnrage == null) goesEnrage = false;
    if (hp == undefined || hp == null) hp = 3;
    this.health = hp;

    this.attackIntervals = [];
    this.drawBlast = false;
    this.spawnSide = spawnSide;
    this.goesEnrage = goesEnrage;
    this.hasAttacked = false;

    var attack1Dps = 1;
    var _enemy = null;
    var that = this;

    this.shape = gen();

    this.spawn = function () {
        shapeList.push(that);
    }

    this.gotHit = function (hitFrom) {
        //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(this);
        if (target.shape.name == "raft") {
            attack(target, attack1Dps);
        }
    }

    this.takeDps = function (dps) {
        this.drawBlast = true;

        setTimeout(function () {
            that.drawBlast = false;
        }, .5 * 1000);

        //console.log("this.health: " + this.health + "; this.shape.vx: " + this.shape.vx);
        if (this.health == Constants.SHARK_MAX_HP && Math.abs(this.shape.vx) == Constants.SPEED_NORMAL) {
            var signal = 1;
            if (magePlayer.shape.x < that.shape.x)
                signal = -1;

            if (that.goesEnrage)
                this.shape.vx = signal * Constants.SPEED_ENRAGED;
        }

        var newHp = this.health - dps;
        this.health = newHp > 0 ? newHp : 0;
        return this.health;
    }

    this.kill = function () {
        that.shape.vx = 0;
        killListIntervals(that.attackIntervals);

        setTimeout(function () {
            var pos = shapeList.indexOf(that);
            if (pos > 1)
                shapeList.splice(pos, 1);
        }, 1 * 1000);
    }

    function gen() {
        var spawnX, spawnVx, spawnY = null;
        var spanInLeftSide = Math.random() < .5;

        if (that != undefined) {
            if (that.spawnSide != undefined && that.spawnSide != null) {
                spanInLeftSide = (spawnSide == "L");
            }
        }

        if (spanInLeftSide) {
            spawnX = -65;
            spawnVx = Constants.SPEED_NORMAL;
        }
        else {
            spawnX = 700;
            spawnVx = -Constants.SPEED_NORMAL;
        }

        spawnY = 340 + (Math.random() * 5) * 5;
        return new Shape(spawnX, spawnY, 150, 65, "#0000FF", spawnVx, 0, "shark" + currentLevel.length);
    }

    function attack(enemy, dps) {
        if (_enemy == null) {
            _enemy = enemy;
            that.shape.vx = 0;

            var attackCastTime = 2 * 1000; //2secs
            var castMethod = function () {
                if (that.health <= 0) {
                    that.kill(); return false;
                }

                var isStillCollided = doCollide(that.shape, enemy.shape);
                if (isStillCollided) {
                    enemy.takeDps(dps);
                }
                else {
                    killListIntervals(that.attackIntervals);
                    that.shape.isCollision = false;
                    var signal = 1;
                    if (enemy.shape.x < that.shape.x)
                        signal = -1;

                    that.shape.vx = signal * Constants.SPEED_ENRAGED;
                    _enemy = null;
                    return false;
                }
            };

            if (that.health > 0) {
                enemy.takeDps(dps); //call first time
                that.hasAttacked = true;
            }

            cast(castMethod, 1000, attackCastTime, that); //call in loop from second time forward
        }
    }
}
var Fish = function () {
    this.shape = gen();
    this.isCaught = false;
    var that = this;

    var attack1Dps = 1;
    var _enemy = null;

    this.spawn = function () {
        shapeList.push(that);
    }

    this.gotHit = function (hitFrom) {
    //    //console.log('I("' + this.shape.name + '") was hit by "' + hitFrom.shape.name + '"');
    };

    this.hitWith = function (target) {
        //console.log('I("' + this.name + '") just hit "' + target.name + '"');
        target.gotHit(that);
        //if (target.shape.name == "raft") {
        //    //attack(target, attack1Dps);
        //} else
        if (target.shape.name == "mage") {
            if (that.isCaught)
                that.kill();
        }
    }

    this.kill = function () {
        if (this.isCaught) {
            magePlayer.healDps(2);
            //fishToEat++;
        }

        var pos = shapeList.indexOf(that);
        if (pos > 1)
            shapeList.splice(pos, 1); 3
    }

    this.catch = function () {
        this.isCaught = true;
    }

    function gen() {
        var spawnX, spawnVy = null;
        var spawnDistance = 10; //distance in px between fish spawns
        spawnVy = -2;
        var spanInLeftSide = Math.random() < .5;

        var randomX = Math.floor(Math.random() * spawnDistance);
        var spawnX = Math.floor(c.width / spawnDistance) * randomX;
        return new Shape(spawnX, 305, 50, 65, "#FFFF00", 0, spawnVy, "fish" + currentLevel.length);
    }
}

function cast(method, castDelay, attackCastTime, iShape) {
    if (castDelay == undefined || castDelay == null)
        castDelay = 0.5 * 1000; //0.5sec

    if (iShape != undefined && iShape != null) {
        if (iShape.isCasting != undefined && iShape.isCasting != null) {
            iShape.isCasting = true;
        }
    }

    var timeoutMethod = function () {
        if (attackCastTime == undefined || attackCastTime == null) {
            method(); //call method
        } else {
            var intervalId = setIntervalGbl(method, attackCastTime);
            if (iShape != undefined && iShape != null) {
                iShape.attackIntervals.push(intervalId);
            }
        }
    };

    setTimeout(function () {
        if (iShape != undefined && iShape != null) {
            if (iShape.isCasting != undefined && iShape.isCasting != null)
                iShape.isCasting = false;
        };
    }, 1000);
    setTimeout(timeoutMethod, castDelay);
}
/* ---- NAMESPACES (-) ---- */

function ChangeColor(val) {
    if (color == "#FF0000") {
        return "#00FF00";
    } else {
        return "#FF0000";
    }
}

function killListIntervals(list) {
    if (list != null && list != undefined) {
        for (var i = 0; i < list.length; i++) {
            clearIntervalGbl(list[i]);
        }
    }
}

function setIntervalGbl(handler, timeout) {
    var intervalId = window.setInterval(handler, timeout);
    intervals.push(intervalId);
    return intervalId;
}

function clearIntervalGbl(id) {
    if (intervals != undefined && intervals != null) { }
    var pos = intervals.indexOf(id);
    if (pos > 0) {
        intervals.splice(pos, 1);
    }
    window.clearInterval(id);
}

function InitShapes() {
    lvl.init();
    lvl.lvl01(); //INIT level 01;
}

function updateGame() {
    frameCount++;
    var ctx = c.getContext("2d");
    ctx.globalAlpha = opacity;
    ctx.clearRect(0, 0, c.width, c.height);
    Draw.sky(ctx);
    Draw.hpBar(ctx);

    if (hud.health <= 0) {
        funcStopLoop(intervals[0]);
        clearExtraIntervals(intervals);
        currentLevel = null;

        var method = function () {
            var playAgain = confirm("Game Over! You survived " + currentSeconds() + " seconds! Play again?")
            if (playAgain)
                restartGame();
            else {
                clearExtraIntervals(intervals);
                funcStopLoop(intervals[0]);
            }
        }

        setTimeout(method, 500);
    }

    //START LOGIC:
    if (currentLevel != null) {
        while (currentLevel.length > 0
                && currentLevel[0].spawnTime <= currentSeconds()) {
            var event = currentLevel.shift().event;
            event.spawn(null);
        }
    }

    //draw waves before NCPs
    Draw.wavesPattern(ctx, waves.ys1);

    for (var i in shapeList) {
        shapeList[i].shape.isCollision = false; //reset collision;
        var iShape = moveShape(shapeList[i], c);
        if (iShape != null) {
            currShape = iShape.shape;
            if (showBoundingBoxs) {
                ctx.fillStyle = getFill(currShape);
                ctx.fillRect(currShape.x, currShape.y, currShape.w, currShape.h);
            }
            write(iShape);
        }
    }

    //draw waves after NPSc
    Draw.wavesPattern(ctx, waves.ys2);
}

function isScrollLeft() {
    return this.scrollLeft = !this.scrollLeft;
}

var waveCfg = function (y, offset, alpha) {
    this.y = y;
    this.offset = offset;
    this.alpha = alpha;
    this.scrollLeft = isScrollLeft();
    this.originalOffset = offset;
}

function drawBlast(x, y) {
    var radius = 40;
    var context = c.getContext("2d");
    context.globalAlpha = .7;
    context.beginPath();

    var signal = 1;
    if (magePlayer.direction == "R") {
        signal = -1;
    }

    var newX = x + (signal * 25);
    context.arc(newX, y, radius, Math.PI, 2 * Math.PI, false);
    context.fillStyle = '#FFA500';
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#FF8C00';
    context.stroke();
}

function moveShape(iShape, canvas) {
    var speed = 1;
    var shape = iShape.shape;
    var isRaft = (shape.name == "raft");

    if (shape.name.lastIndexOf("fish", 0) === 0) {
        var playerMiddleX = this.magePlayer.shape.x + (this.magePlayer.shape.w / 2);
        var playerMiddleY = this.magePlayer.shape.y + (this.magePlayer.shape.h / 2);

        var diff = shape.x - playerMiddleX;
        if (iShape.isCaught) {
            var speedCaught = 14;
            if (Math.abs(shape.x - playerMiddleX) <= speedCaught + 5 && shape.y <= playerMiddleY) {
                //iShape.kill();
            }
            else {

                var signalY = this.magePlayer.shape.y < shape.y ? -1 : 1;
                shape.vy = signalY * speedCaught;

                var signalX = playerMiddleX < shape.x ? -1 : 1;
                shape.vx = signalX * speedCaught;
            }
        } else if ((shape.y) <= 220)
            shape.vy *= -1;
        else if ((shape.y) >= 320 && shape.vy > 0) {
            iShape.kill();
            return null;
        }
    } else if (isRaft) {
        shape.vx = this.magePlayer.shape.vx;
    }

    var isRaftOrMage = isRaft || shape.name == "mage";
    var movedShape = clippedMoveTo(iShape, isRaftOrMage);

    shape.x = movedShape.x;
    shape.y = movedShape.y;


    var currShapeIndex = shapeList.indexOf(iShape);
    //for each shape that has already been moved (before currIndex), check if this move colides!
    for (var i = 0; i < currShapeIndex; i++) {
        var colided = doCollide(shape, shapeList[i].shape);
        shape.isCollision |= colided;

        if (colided) {
            iShape.hitWith(shapeList[i]);
            //console.log("'" + shape.name + "' colidede with '" + shapeList[i].shape.name+ "'");
        }
    }
    iShape.shape = shape;
    return iShape;
}

function clippedMoveTo(iShape, forceClipping) {
    var speed = 1;
    var calculateNextPos = function (s) {
        return new Shape(s.x + speed * (s.vx),
            s.y + speed * (s.vy),
            s.w, s.h, s.fill, s.vx, s.vy, s.name);
    };

    if (forceClipping) {
        var clipShape = function (notClipped, toClip) {
            if (toClip == undefined)
                toClip = notClipped;

            var xDiff = 0;
            if (notClipped.x < 0) {
                xDiff = notClipped.x - 0;
                var newX = toClip.x + xDiff;
                var raftMin = -(notClipped.x - toClip.x);
                if (newX < raftMin && toClip.name == "raft") {
                    newX = raftMin;
                } else if (newX < 0 && toClip.name == "mage") {
                    newX = 0;
                }

                toClip.x = newX;
            } else if (notClipped.x + notClipped.w > canvas.width) {
                xDiff = canvas.width - (notClipped.w + notClipped.x);
                toClip.x = toClip.x + xDiff;
            }
            return toClip;
        };

        var clipped = null;
        if (iShape.shape.name == "raft") {
            var playerNextPos = calculateNextPos(this.magePlayer.shape);
            var raftNextPos = calculateNextPos(iShape.shape);
            clipped = clipShape(playerNextPos, raftNextPos);
        } else {
            var shapeNextPos = calculateNextPos(iShape.shape);
            clipped = clipShape(shapeNextPos);
        }
        return clipped;
    } else {
        return calculateNextPos(iShape.shape);
    }
}

function doCollide(s1, s2) {
    if (s1.x < s2.x + s2.w &&
        s1.x + s1.w > s2.x &&
        s1.y < s2.y + s2.h &&
        s1.h + s1.y > s2.y) {
        return true;
    }
    return false;
}

function drawGame() {
    hud.draw();
}

function getFill(shape) {
    if (shape.isCollision && false) {
        return "#FF0000";
    }
    else {
        return shape.fill;
    }
}

function lvlEvent(spawnTime, event) {
    this.spawnTime = spawnTime;
    this.event = event;
}

function Shape(x, y, w, h, fill, vx, vy, name) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.fill = fill;
    this.vx = vx;
    this.vy = vy;
    this.name = name;
    this.isCollision = false;
    this.ignoreRightBottomCanvas = true;
}

function write(iShape) {
    var shape = iShape.shape;
    var ctx = c.getContext("2d");
    ctx.fillStyle = "Red";
    //ctx.fillText(shape.name, shape.x, shape.y); //write npc label

    if (shape.name.lastIndexOf("shark", 0) === 0) {
        ctx.fillStyle = "White";
        //ctx.fillText(iShape.health, shape.x + 40, shape.y + 20); //write npc HP

        Draw.shark(ctx, iShape);
        if (iShape.drawBlast) {
            drawBlast(shape.x + shape.w / 2, shape.y + 20);
        }

    } else if (iShape.shape.name == "mage") {
        Draw.mage(ctx, iShape);
    }
    else if (shape.name.lastIndexOf("fish", 0) === 0) {
        Draw.fishJumping(ctx, iShape.shape);
    }
    else if (shape.name == "raft") {
        Draw.raft(ctx, iShape.shape);
    }
}

function Hud(hp, str) {
    if (hp == undefined) {
        hp = Constants.PLAYER_MAX_HP;
    }
    if (str == undefined)
        str = 10;

    this.strength = str;
    this.health = hp;
    this.draw = function () {
        var ctx = c.getContext("2d");
        ctx.font = '15pt Verdana';
        ctx.fillStyle = "Black";
        var hpTxt = "Health:     ";

        var y = 30;
        ctx.fillText(hpTxt, 10, y);
        ctx.fillText("Time: " + currentSeconds(), c.width - 130, y);

        if (magePlayer != null && magePlayer != undefined) {
            var direction = "->";
            if (magePlayer.direction == "L")
                direction = "<-";
        }
    }
}

function isWithinXCanvas(shape, canvas) {
    return shape.ignoreRightBottomCanvas || (shape.x >= 0 && shape.x + shape.w <= canvas.width);
}

function isWithinYCanvas(shape, canvas) {
    return shape.ignoreRightBottomCanvas || (shape.y >= 0 && shape.y + shape.h <= canvas.height);
}

function isWithinCanvas(shape, canvas) {
    return isWithinXCanvas(shape, canvas) && isWithinYCanvas(shape, canvas);
}

var mainloop = function () {
    updateGame();
    drawGame();
};

var animFrame = window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        null;

function funcStopLoop(loop2) {
    if (animFrame !== null) {
        //console.log('TODO'); //improve
    } else {
        clearIntervalGbl(loop2);
    }
}

function logEveryFrameX(val, frameX) {
    if (frameCount % frameX == 0 || frameCount == 1 || frameX == undefined) {
        console.log(val);
    }
}

function currentSeconds(now) {
    if (now == undefined)
        now = new Date(Date.now());

    return new Date((now - startTime)).getSeconds();
}


function vectorize(shape, originalX) {

    var isRightSide;
    if (shape.name == "mage") {
        isRightSide = (this.magePlayer.direction == "R");
    } else {
        isRightSide = (shape.x < magePlayer.shape.x);
    }

    if (isRightSide) {
        return { scaleHoriz: -1, moveHoriz: shape.w + Math.abs(originalX) };
    } else {//if (shape.x < magePlayer.shape.x) {
        return { scaleHoriz: 1, moveHoriz: originalX };
    }
}


function ctxtransform(var1, var2, var3, var4, var5, var6, ctx, shape, index) {
    ctxTransform(var1, var2, var3, var4, var5, var6, ctx, shape, index);
}

function ctxTransform(var1, var2, var3, var4, var5, var6, ctx, shape, index) {
    var fix = { x: 0, y: 0 };
    var aux = vectorize(shape, var5);

    if (shape.name != undefined) {
        if (shape.name.lastIndexOf("shark", 0) === 0) {
            var indexIncrement = 0;
            if (index != undefined)
                indexIncrement = 25;
            fix.y = -(shape.h / 2) + indexIncrement;
        }
        else if (shape.name.lastIndexOf("fish", 0) === 0) {
            fix.y = 0;
        }
    }

    var auxX = shape.x + aux.moveHoriz + fix.x;
    var auxY = var6 + shape.y + fix.y;

    ctx.transform(var1 * aux.scaleHoriz, var2, var3, var4, auxX, auxY);
}

var Draw = {
    shark: function (ctx, iShape) {
        if (Math.abs(iShape.shape.vx) > 1 || iShape.goesEnrage || iShape.hasAttacked) {
            this.sharkAttacking(ctx, iShape.shape);
            iShape.hasAttacked = true;
        } else {
            this.sharkSwimming(ctx, iShape.shape);
        }
    },

    mage: function (ctx, iShape) {
        if (iShape.isCasting)
            this.mageCasting(ctx, iShape.shape);
        else
            this.mageStanding(ctx, iShape.shape);
    },

    sharkSwimming: function (ctx, shape) {
        // #layer1
        ctx.save();
        ctxtransform(1.000000, 0.000000, 0.000000, 1.000000, -415.080350, -494.795910, ctx, shape, 0); //special call

        // #g3420
        ctx.save();
        ctx.transform(1.005376, 0.000000, 0.000000, -1.005376, -143.320030, 929.853790);

        // #g3422
        ctx.save();
        ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 7.878437, 2.701178);

        // #g3688
        ctx.save();
        ctx.transform(1.243316, 0.000000, 0.000000, 1.243316, 77.718021, 37.647598);

        // #g3690

        // #g3692
        ctx.save();
        ctx.beginPath();

        // #path3696
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3698
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 282;
        ctx.lineWidth = 0.253000;
        ctx.beginPath();
        ctx.moveTo(378.087000, 287.709000);
        ctx.bezierCurveTo(387.377000, 301.852000, 404.104000, 311.336000, 421.478000, 315.405000);
        ctx.bezierCurveTo(416.875000, 306.566000, 411.935000, 297.166000, 411.822000, 286.587000);
        ctx.bezierCurveTo(400.989000, 284.089000, 388.443000, 285.380000, 378.087000, 287.709000);
        ctx.closePath();
        ctx.stroke();

        // #path3700
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 282;
        ctx.lineWidth = 0.253000;
        ctx.beginPath();
        ctx.moveTo(379.827000, 287.344000);
        ctx.bezierCurveTo(388.471000, 302.946000, 405.648000, 308.250000, 421.141000, 314.760000);
        ctx.stroke();

        // #path3702
        ctx.fillStyle = 'rgb(0, 84, 128)';
        ctx.beginPath();
        ctx.moveTo(395.712000, 285.436000);
        ctx.bezierCurveTo(391.587000, 285.633000, 387.265000, 286.109000, 382.942000, 286.896000);
        ctx.bezierCurveTo(381.820000, 287.092000, 380.107000, 287.429000, 380.080000, 287.429000);
        ctx.bezierCurveTo(380.080000, 287.456000, 380.248000, 287.737000, 380.444000, 288.102000);
        ctx.bezierCurveTo(383.560000, 293.405000, 387.994000, 297.951000, 393.860000, 301.795000);
        ctx.bezierCurveTo(396.386000, 303.479000, 398.519000, 304.686000, 401.662000, 306.257000);
        ctx.bezierCurveTo(405.227000, 307.997000, 408.090000, 309.260000, 415.611000, 312.318000);
        ctx.bezierCurveTo(417.352000, 313.048000, 419.232000, 313.806000, 419.766000, 314.030000);
        ctx.bezierCurveTo(420.327000, 314.255000, 420.775000, 314.451000, 420.775000, 314.451000);
        ctx.bezierCurveTo(420.775000, 314.451000, 420.551000, 313.974000, 420.242000, 313.385000);
        ctx.bezierCurveTo(417.941000, 308.951000, 416.257000, 305.331000, 415.106000, 302.441000);
        ctx.bezierCurveTo(412.974000, 296.997000, 411.879000, 292.171000, 411.710000, 287.597000);
        ctx.bezierCurveTo(411.683000, 286.839000, 411.683000, 286.699000, 411.598000, 286.699000);
        ctx.bezierCurveTo(411.346000, 286.614000, 409.773000, 286.306000, 408.848000, 286.166000);
        ctx.bezierCurveTo(406.742000, 285.801000, 404.638000, 285.604000, 402.224000, 285.464000);
        ctx.bezierCurveTo(400.849000, 285.380000, 397.228000, 285.380000, 395.712000, 285.436000);
        ctx.fill();

        // #path3704
        ctx.fillStyle = 'rgb(103, 128, 144)';
        ctx.beginPath();
        ctx.moveTo(378.985000, 287.652000);
        ctx.bezierCurveTo(378.648000, 287.737000, 378.368000, 287.821000, 378.368000, 287.821000);
        ctx.bezierCurveTo(378.339000, 287.821000, 378.508000, 288.102000, 378.732000, 288.410000);
        ctx.bezierCurveTo(383.279000, 295.033000, 389.706000, 300.926000, 397.537000, 305.640000);
        ctx.bezierCurveTo(403.038000, 308.951000, 409.381000, 311.757000, 415.752000, 313.693000);
        ctx.bezierCurveTo(417.660000, 314.283000, 421.084000, 315.209000, 421.141000, 315.153000);
        ctx.bezierCurveTo(421.141000, 315.125000, 421.141000, 315.068000, 421.084000, 315.012000);
        ctx.bezierCurveTo(421.028000, 314.872000, 421.057000, 314.872000, 415.556000, 312.627000);
        ctx.bezierCurveTo(409.605000, 310.214000, 407.697000, 309.400000, 404.778000, 308.081000);
        ctx.bezierCurveTo(403.038000, 307.268000, 400.259000, 305.920000, 398.968000, 305.219000);
        ctx.bezierCurveTo(393.720000, 302.357000, 389.734000, 299.495000, 386.338000, 296.155000);
        ctx.bezierCurveTo(383.869000, 293.686000, 381.876000, 291.133000, 380.192000, 288.242000);
        ctx.bezierCurveTo(379.883000, 287.737000, 379.743000, 287.541000, 379.687000, 287.541000);
        ctx.bezierCurveTo(379.630000, 287.541000, 379.322000, 287.597000, 378.985000, 287.652000);
        ctx.fill();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    sharkAttacking: function (ctx, shape) {
        // #layer1
        ctx.save();
        ctxtransform(1.000000, 0.000000, 0.000000, 1.000000, -274.318500, -447.940380, ctx, shape);//special call

        // #g3296
        ctx.save();
        ctx.transform(1.250000, 0.000000, 0.000000, -1.250000, -361.658060, 908.562590);

        // #g3298

        // #g3300
        ctx.save();
        ctx.beginPath();

        // #path3304
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3306
        ctx.fillStyle = 'rgb(97, 146, 163)';
        ctx.beginPath();
        ctx.moveTo(569.120000, 310.913000);
        ctx.bezierCurveTo(569.120000, 310.913000, 580.744000, 284.342000, 586.689000, 289.260000);
        ctx.bezierCurveTo(592.634000, 294.178000, 584.089000, 311.727000, 581.721000, 315.466000);
        ctx.fill();

        // #path3308
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(569.120000, 310.913000);
        ctx.bezierCurveTo(569.120000, 310.913000, 580.744000, 284.342000, 586.689000, 289.260000);
        ctx.bezierCurveTo(592.634000, 294.178000, 584.089000, 311.727000, 581.721000, 315.466000);
        ctx.stroke();

        // #path3310
        ctx.fillStyle = 'rgb(97, 146, 163)';
        ctx.beginPath();
        ctx.moveTo(561.076000, 343.993000);
        ctx.bezierCurveTo(561.076000, 343.993000, 582.554000, 366.687000, 593.293000, 367.092000);
        ctx.bezierCurveTo(604.032000, 367.498000, 602.208000, 373.982000, 590.456000, 344.804000);
        ctx.fill();

        // #path3312
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(561.076000, 343.993000);
        ctx.bezierCurveTo(561.076000, 343.993000, 582.554000, 366.687000, 593.293000, 367.092000);
        ctx.bezierCurveTo(604.032000, 367.498000, 602.208000, 373.982000, 590.456000, 344.804000);
        ctx.stroke();

        // #path3314
        ctx.fillStyle = 'rgb(97, 146, 163)';
        ctx.beginPath();
        ctx.moveTo(509.407000, 329.591000);
        ctx.bezierCurveTo(509.407000, 329.591000, 593.865000, 367.221000, 641.313000, 326.552000);
        ctx.bezierCurveTo(645.568000, 322.904000, 641.922000, 316.421000, 641.922000, 316.421000);
        ctx.bezierCurveTo(641.922000, 316.421000, 606.092000, 289.825000, 543.244000, 301.427000);
        ctx.bezierCurveTo(516.903000, 306.290000, 509.407000, 329.591000, 509.407000, 329.591000);
        ctx.fill();

        // #path3316
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(509.407000, 329.591000);
        ctx.bezierCurveTo(509.407000, 329.591000, 593.865000, 367.221000, 641.313000, 326.552000);
        ctx.bezierCurveTo(645.568000, 322.904000, 641.922000, 316.421000, 641.922000, 316.421000);
        ctx.bezierCurveTo(641.922000, 316.421000, 606.092000, 289.825000, 543.244000, 301.427000);
        ctx.bezierCurveTo(516.903000, 306.290000, 509.407000, 329.591000, 509.407000, 329.591000);
        ctx.closePath();
        ctx.stroke();

        // #path3318
        ctx.fillStyle = 'rgb(97, 146, 163)';
        ctx.beginPath();
        ctx.moveTo(554.592000, 304.876000);
        ctx.bezierCurveTo(554.592000, 304.876000, 558.239000, 276.104000, 565.331000, 279.143000);
        ctx.bezierCurveTo(572.423000, 282.182000, 569.181000, 301.430000, 567.965000, 305.686000);
        ctx.fill();

        // #path3320
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(554.592000, 304.876000);
        ctx.bezierCurveTo(554.592000, 304.876000, 558.239000, 276.104000, 565.331000, 279.143000);
        ctx.bezierCurveTo(572.423000, 282.182000, 569.181000, 301.430000, 567.965000, 305.686000);
        ctx.stroke();

        // #path3322
        ctx.fillStyle = 'rgb(97, 146, 163)';
        ctx.beginPath();
        ctx.moveTo(636.249000, 329.798000);
        ctx.bezierCurveTo(636.249000, 329.798000, 652.661000, 350.870000, 671.910000, 347.628000);
        ctx.bezierCurveTo(691.159000, 344.387000, 670.491000, 332.837000, 669.884000, 332.432000);
        ctx.bezierCurveTo(669.276000, 332.026000, 653.472000, 320.883000, 673.531000, 310.954000);
        ctx.bezierCurveTo(693.591000, 301.025000, 635.034000, 298.999000, 631.184000, 310.751000);
        ctx.fill();

        // #path3324
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(636.249000, 329.798000);
        ctx.bezierCurveTo(636.249000, 329.798000, 652.661000, 350.870000, 671.910000, 347.628000);
        ctx.bezierCurveTo(691.159000, 344.387000, 670.491000, 332.837000, 669.884000, 332.432000);
        ctx.bezierCurveTo(669.276000, 332.026000, 653.472000, 320.883000, 673.531000, 310.954000);
        ctx.bezierCurveTo(693.591000, 301.025000, 635.034000, 298.999000, 631.184000, 310.751000);
        ctx.stroke();

        // #path3326
        ctx.fillStyle = 'rgb(255, 255, 255)';
        ctx.beginPath();
        ctx.moveTo(522.375000, 311.562000);
        ctx.bezierCurveTo(522.375000, 311.562000, 530.517000, 316.518000, 535.748000, 319.262000);
        ctx.bezierCurveTo(548.108000, 325.745000, 542.029000, 309.130000, 539.801000, 302.443000);
        ctx.fill();

        // #path3328
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(522.375000, 311.562000);
        ctx.bezierCurveTo(522.375000, 311.562000, 530.517000, 316.518000, 535.748000, 319.262000);
        ctx.bezierCurveTo(548.108000, 325.745000, 542.029000, 309.130000, 539.801000, 302.443000);
        ctx.stroke();

        // #path3330
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(527.238000, 313.993000);
        ctx.lineTo(541.422000, 306.294000);
        ctx.stroke();

        // #path3332
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(534.735000, 319.059000);
        ctx.lineTo(543.650000, 313.385000);
        ctx.stroke();

        // #path3334
        ctx.fillStyle = 'rgb(55, 53, 53)';
        ctx.beginPath();
        ctx.moveTo(539.598000, 334.309000);
        ctx.bezierCurveTo(539.598000, 332.713000, 537.512000, 331.419000, 534.938000, 331.419000);
        ctx.bezierCurveTo(532.363000, 331.419000, 530.277000, 332.713000, 530.277000, 334.309000);
        ctx.bezierCurveTo(530.277000, 335.904000, 532.363000, 337.197000, 534.938000, 337.197000);
        ctx.bezierCurveTo(537.512000, 337.197000, 539.598000, 335.904000, 539.598000, 334.309000);
        ctx.fill();

        // #path3336
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(55, 53, 53)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(539.598000, 334.309000);
        ctx.bezierCurveTo(539.598000, 332.713000, 537.512000, 331.419000, 534.938000, 331.419000);
        ctx.bezierCurveTo(532.363000, 331.419000, 530.277000, 332.713000, 530.277000, 334.309000);
        ctx.bezierCurveTo(530.277000, 335.904000, 532.363000, 337.197000, 534.938000, 337.197000);
        ctx.bezierCurveTo(537.512000, 337.197000, 539.598000, 335.904000, 539.598000, 334.309000);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    mageStanding: function (ctx, shape) {
        // #layer1
        ctx.save();
        ctxtransform(1.000000, 0.000000, 0.000000, 1.000000, -298.218720, -456.785650, ctx, shape);//special call

        // #g3420
        ctx.save();
        ctx.transform(1.005376, 0.000000, 0.000000, -1.005376, -143.320030, 929.853790);

        // #g3422
        ctx.save();
        ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 7.878437, 2.701178);

        // #g3855
        ctx.save();
        ctx.transform(0.978265, 0.000000, 0.000000, 0.978265, -39.427372, -44.719947);

        // #g3857

        // #g3859
        ctx.save();
        ctx.beginPath();

        // #path3863-5
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3865
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(500.937000, 377.417000);
        ctx.bezierCurveTo(502.934000, 379.324000, 504.891000, 380.961000, 507.689000, 381.242000);
        ctx.bezierCurveTo(509.766000, 381.450000, 512.039000, 381.696000, 513.750000, 382.995000);
        ctx.bezierCurveTo(517.490000, 385.832000, 516.746000, 390.385000, 516.211000, 394.519000);
        ctx.bezierCurveTo(515.514000, 399.909000, 515.780000, 403.887000, 518.738000, 408.668000);
        ctx.bezierCurveTo(522.045000, 414.013000, 527.763000, 417.920000, 532.829000, 421.430000);
        ctx.bezierCurveTo(530.321000, 422.869000, 527.813000, 424.308000, 525.306000, 425.747000);
        ctx.bezierCurveTo(525.480000, 416.789000, 522.689000, 406.255000, 527.734000, 398.138000);
        ctx.bezierCurveTo(529.966000, 394.548000, 533.979000, 392.708000, 537.093000, 390.051000);
        ctx.bezierCurveTo(537.753000, 389.504000, 538.291000, 388.856000, 538.708000, 388.107000);
        ctx.bezierCurveTo(541.176000, 384.263000, 538.240000, 388.418000, 540.027000, 390.176000);
        ctx.bezierCurveTo(538.350000, 388.526000, 535.686000, 387.891000, 533.589000, 386.929000);
        ctx.bezierCurveTo(527.733000, 384.241000, 532.819000, 375.624000, 538.636000, 378.294000);
        ctx.bezierCurveTo(542.586000, 380.107000, 546.399000, 381.476000, 548.894000, 385.292000);
        ctx.bezierCurveTo(551.481000, 389.251000, 546.755000, 394.541000, 544.164000, 397.122000);
        ctx.bezierCurveTo(540.187000, 401.086000, 535.518000, 401.959000, 534.895000, 408.239000);
        ctx.bezierCurveTo(534.318000, 414.049000, 535.419000, 419.927000, 535.306000, 425.747000);
        ctx.bezierCurveTo(535.236000, 429.290000, 531.019000, 432.306000, 527.782000, 430.064000);
        ctx.bezierCurveTo(517.970000, 423.269000, 507.224000, 414.798000, 505.833000, 402.043000);
        ctx.bezierCurveTo(505.596000, 399.869000, 505.775000, 397.875000, 506.053000, 395.708000);
        ctx.bezierCurveTo(506.204000, 394.525000, 506.363000, 393.344000, 506.503000, 392.159000);
        ctx.bezierCurveTo(506.584000, 391.446000, 506.641000, 390.732000, 506.674000, 390.016000);
        ctx.bezierCurveTo(506.496000, 388.177000, 507.110000, 388.646000, 508.516000, 391.424000);
        ctx.bezierCurveTo(506.425000, 390.680000, 504.193000, 391.021000, 502.082000, 390.152000);
        ctx.bezierCurveTo(498.923000, 388.852000, 496.321000, 386.833000, 493.866000, 384.488000);
        ctx.bezierCurveTo(489.194000, 380.027000, 496.276000, 372.966000, 500.937000, 377.417000);
        ctx.fill();

        // #path3867
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(533.892000, 435.461000);
        ctx.bezierCurveTo(529.836000, 443.019000, 526.811000, 450.986000, 521.220000, 457.613000);
        ctx.bezierCurveTo(519.523000, 459.625000, 515.865000, 459.512000, 514.149000, 457.613000);
        ctx.bezierCurveTo(509.826000, 452.830000, 501.425000, 455.969000, 495.723000, 455.789000);
        ctx.bezierCurveTo(489.290000, 455.586000, 489.271000, 445.585000, 495.723000, 445.789000);
        ctx.bezierCurveTo(504.831000, 446.077000, 514.205000, 442.780000, 521.220000, 450.542000);
        ctx.lineTo(514.149000, 450.542000);
        ctx.bezierCurveTo(519.095000, 444.679000, 521.666000, 437.106000, 525.257000, 430.414000);
        ctx.bezierCurveTo(528.307000, 424.730000, 536.939000, 429.780000, 533.892000, 435.461000);
        ctx.fill();

        // #path3869
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(526.682000, 441.791000);
        ctx.bezierCurveTo(520.846000, 441.716000, 515.024000, 441.980000, 509.230000, 442.692000);
        ctx.bezierCurveTo(506.519000, 443.025000, 504.230000, 440.166000, 504.230000, 437.692000);
        ctx.bezierCurveTo(504.230000, 434.715000, 506.526000, 433.024000, 509.230000, 432.692000);
        ctx.bezierCurveTo(515.024000, 431.980000, 520.846000, 431.716000, 526.682000, 431.791000);
        ctx.bezierCurveTo(533.125000, 431.874000, 533.133000, 441.874000, 526.682000, 441.791000);
        ctx.fill();

        // #path3871
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(515.862000, 462.124000);
        ctx.bezierCurveTo(510.207000, 462.648000, 508.729000, 465.171000, 508.651000, 470.530000);
        ctx.bezierCurveTo(508.594000, 474.496000, 511.307000, 477.360000, 515.328000, 476.203000);
        ctx.bezierCurveTo(520.856000, 474.612000, 519.632000, 466.062000, 515.358000, 464.088000);
        ctx.bezierCurveTo(509.509000, 461.388000, 514.593000, 452.770000, 520.405000, 455.454000);
        ctx.bezierCurveTo(534.275000, 461.856000, 530.173000, 484.909000, 515.069000, 486.403000);
        ctx.bezierCurveTo(505.271000, 487.373000, 499.039000, 479.647000, 498.651000, 470.530000);
        ctx.bezierCurveTo(498.174000, 459.276000, 505.143000, 453.118000, 515.862000, 452.124000);
        ctx.bezierCurveTo(522.285000, 451.528000, 522.228000, 461.534000, 515.862000, 462.124000);
        ctx.fill();

        // #path3873
        ctx.fillStyle = 'rgb(79, 86, 163)';
        ctx.beginPath();
        ctx.moveTo(504.199000, 476.588000);
        ctx.lineTo(481.685000, 479.483000);
        ctx.lineTo(501.487000, 489.928000);
        ctx.lineTo(535.423000, 523.445000);
        ctx.lineTo(527.438000, 491.542000);
        ctx.lineTo(544.008000, 480.701000);
        ctx.lineTo(504.199000, 476.588000);
        ctx.closePath();
        ctx.fill();

        // #path3875
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(120, 81, 159)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(504.199000, 476.588000);
        ctx.lineTo(481.685000, 479.483000);
        ctx.lineTo(501.487000, 489.928000);
        ctx.lineTo(535.423000, 523.445000);
        ctx.lineTo(527.438000, 491.542000);
        ctx.lineTo(544.008000, 480.701000);
        ctx.lineTo(504.199000, 476.588000);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    mageCasting: function (ctx, shape) {
        // #layer1
        ctx.save();
        ctxtransform(1.000000, 0.000000, 0.000000, 1.000000, -329.988120, -403.600360, ctx, shape);//special call

        // #g3420
        ctx.save();
        ctx.transform(1.005376, 0.000000, 0.000000, -1.005376, -143.320030, 929.853790);

        // #g3422
        ctx.save();
        ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 7.878437, 2.701178);

        // #g3600
        ctx.save();
        ctx.transform(0.974010, 0.000000, 0.000000, 0.974010, 14.793252, 9.322020);

        // #g3602

        // #g3604
        ctx.save();
        ctx.beginPath();

        // #path3608
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3610
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(500.937000, 377.417000);
        ctx.bezierCurveTo(502.934000, 379.324000, 504.891000, 380.961000, 507.689000, 381.242000);
        ctx.bezierCurveTo(509.766000, 381.450000, 512.039000, 381.696000, 513.750000, 382.995000);
        ctx.bezierCurveTo(517.490000, 385.832000, 516.746000, 390.385000, 516.211000, 394.519000);
        ctx.bezierCurveTo(515.514000, 399.909000, 515.780000, 403.887000, 518.738000, 408.668000);
        ctx.bezierCurveTo(522.045000, 414.013000, 527.763000, 417.920000, 532.829000, 421.430000);
        ctx.bezierCurveTo(530.321000, 422.869000, 527.813000, 424.308000, 525.306000, 425.747000);
        ctx.bezierCurveTo(525.480000, 416.789000, 522.689000, 406.255000, 527.734000, 398.138000);
        ctx.bezierCurveTo(529.966000, 394.548000, 533.979000, 392.708000, 537.093000, 390.051000);
        ctx.bezierCurveTo(537.753000, 389.504000, 538.291000, 388.856000, 538.708000, 388.107000);
        ctx.bezierCurveTo(541.176000, 384.263000, 538.240000, 388.418000, 540.027000, 390.176000);
        ctx.bezierCurveTo(538.350000, 388.526000, 535.686000, 387.891000, 533.589000, 386.929000);
        ctx.bezierCurveTo(527.733000, 384.241000, 532.819000, 375.624000, 538.636000, 378.294000);
        ctx.bezierCurveTo(542.586000, 380.107000, 546.399000, 381.476000, 548.894000, 385.292000);
        ctx.bezierCurveTo(551.481000, 389.251000, 546.755000, 394.541000, 544.164000, 397.122000);
        ctx.bezierCurveTo(540.187000, 401.086000, 535.518000, 401.959000, 534.895000, 408.239000);
        ctx.bezierCurveTo(534.318000, 414.049000, 535.419000, 419.927000, 535.306000, 425.747000);
        ctx.bezierCurveTo(535.236000, 429.290000, 531.019000, 432.306000, 527.782000, 430.064000);
        ctx.bezierCurveTo(517.970000, 423.269000, 507.224000, 414.798000, 505.833000, 402.043000);
        ctx.bezierCurveTo(505.596000, 399.869000, 505.775000, 397.875000, 506.053000, 395.708000);
        ctx.bezierCurveTo(506.204000, 394.525000, 506.363000, 393.344000, 506.503000, 392.159000);
        ctx.bezierCurveTo(506.584000, 391.446000, 506.641000, 390.732000, 506.674000, 390.016000);
        ctx.bezierCurveTo(506.496000, 388.177000, 507.110000, 388.646000, 508.516000, 391.424000);
        ctx.bezierCurveTo(506.425000, 390.680000, 504.193000, 391.021000, 502.082000, 390.152000);
        ctx.bezierCurveTo(498.923000, 388.852000, 496.321000, 386.833000, 493.866000, 384.488000);
        ctx.bezierCurveTo(489.194000, 380.027000, 496.276000, 372.966000, 500.937000, 377.417000);
        ctx.fill();

        // #path3612
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(533.808000, 435.415000);
        ctx.bezierCurveTo(529.343000, 443.733000, 526.094000, 452.585000, 519.854000, 459.823000);
        ctx.bezierCurveTo(518.133000, 461.822000, 514.522000, 461.730000, 512.784000, 459.823000);
        ctx.bezierCurveTo(507.533000, 454.063000, 497.943000, 457.496000, 491.056000, 457.123000);
        ctx.bezierCurveTo(484.643000, 456.775000, 484.609000, 446.773000, 491.056000, 447.123000);
        ctx.bezierCurveTo(501.278000, 447.677000, 511.973000, 444.106000, 519.854000, 452.752000);
        ctx.lineTo(512.784000, 452.752000);
        ctx.bezierCurveTo(518.365000, 446.276000, 521.174000, 437.818000, 525.173000, 430.368000);
        ctx.bezierCurveTo(528.223000, 424.684000, 536.856000, 429.734000, 533.808000, 435.415000);
        ctx.fill();

        // #path3614
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(525.715000, 443.556000);
        ctx.bezierCurveTo(517.425000, 442.747000, 509.115000, 442.284000, 500.785000, 442.266000);
        ctx.bezierCurveTo(494.337000, 442.251000, 494.336000, 432.251000, 500.785000, 432.266000);
        ctx.bezierCurveTo(509.115000, 432.284000, 517.425000, 432.747000, 525.715000, 433.556000);
        ctx.bezierCurveTo(532.072000, 434.176000, 532.133000, 444.182000, 525.715000, 443.556000);
        ctx.fill();

        // #path3616
        ctx.fillStyle = 'rgb(44, 44, 44)';
        ctx.beginPath();
        ctx.moveTo(515.862000, 462.124000);
        ctx.bezierCurveTo(510.207000, 462.648000, 508.729000, 465.171000, 508.651000, 470.530000);
        ctx.bezierCurveTo(508.594000, 474.496000, 511.307000, 477.360000, 515.328000, 476.203000);
        ctx.bezierCurveTo(520.856000, 474.612000, 519.632000, 466.062000, 515.358000, 464.088000);
        ctx.bezierCurveTo(509.509000, 461.388000, 514.593000, 452.770000, 520.405000, 455.454000);
        ctx.bezierCurveTo(534.275000, 461.856000, 530.173000, 484.909000, 515.069000, 486.403000);
        ctx.bezierCurveTo(505.271000, 487.373000, 499.039000, 479.647000, 498.651000, 470.530000);
        ctx.bezierCurveTo(498.174000, 459.276000, 505.143000, 453.118000, 515.862000, 452.124000);
        ctx.bezierCurveTo(522.285000, 451.528000, 522.228000, 461.534000, 515.862000, 462.124000);
        ctx.fill();

        // #path3618
        ctx.fillStyle = 'rgb(79, 86, 163)';
        ctx.beginPath();
        ctx.moveTo(504.199000, 476.588000);
        ctx.lineTo(481.685000, 479.483000);
        ctx.lineTo(501.487000, 489.928000);
        ctx.lineTo(535.423000, 523.445000);
        ctx.lineTo(527.438000, 491.542000);
        ctx.lineTo(544.008000, 480.701000);
        ctx.lineTo(504.199000, 476.588000);
        ctx.closePath();
        ctx.fill();

        // #path3620
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(120, 81, 159)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(504.199000, 476.588000);
        ctx.lineTo(481.685000, 479.483000);
        ctx.lineTo(501.487000, 489.928000);
        ctx.lineTo(535.423000, 523.445000);
        ctx.lineTo(527.438000, 491.542000);
        ctx.lineTo(544.008000, 480.701000);
        ctx.lineTo(504.199000, 476.588000);
        ctx.closePath();
        ctx.stroke();

        // #path3622
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(44, 44, 44)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(479.667000, 459.167000);
        ctx.bezierCurveTo(479.667000, 459.167000, 466.167000, 461.000000, 460.500000, 471.500000);
        ctx.stroke();

        // #path3624
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(44, 44, 44)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(485.000000, 440.833000);
        ctx.bezierCurveTo(485.000000, 440.833000, 466.833000, 435.000000, 463.333000, 424.167000);
        ctx.stroke();

        // #path3626
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(44, 44, 44)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(483.500000, 447.167000);
        ctx.bezierCurveTo(483.500000, 447.167000, 473.666000, 447.500000, 470.833000, 451.000000);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    fishJumping: function (ctx, shape) {
        // #layer1
        ctx.save();
        ctxtransform(1.000000, 0.000000, 0.000000, 1.000000, -346.124430, -470.472060, ctx, shape);//special call

        // #g3367
        ctx.save();
        ctx.transform(1.250000, 0.000000, 0.000000, -1.250000, -241.334960, 1192.725200);

        // #g3369

        // #g3371
        ctx.save();
        ctx.beginPath();

        // #path3375
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path3377
        ctx.fillStyle = 'rgb(160, 162, 164)';
        ctx.beginPath();
        ctx.moveTo(483.475000, 532.915000);
        ctx.bezierCurveTo(479.780000, 532.915000, 469.252000, 530.514000, 472.022000, 524.973000);
        ctx.bezierCurveTo(472.946000, 522.756000, 476.641000, 521.648000, 478.487000, 520.540000);
        ctx.bezierCurveTo(480.334000, 519.432000, 482.366000, 517.031000, 484.397000, 516.661000);
        ctx.bezierCurveTo(486.983000, 516.107000, 488.830000, 518.139000, 489.754000, 520.540000);
        ctx.bezierCurveTo(490.862000, 523.311000, 489.385000, 524.604000, 487.723000, 526.820000);
        ctx.bezierCurveTo(484.213000, 531.807000, 483.475000, 535.500000, 483.844000, 541.596000);
        ctx.bezierCurveTo(484.582000, 551.939000, 483.659000, 560.989000, 491.971000, 568.747000);
        ctx.bezierCurveTo(497.142000, 573.364000, 503.791000, 573.733000, 510.256000, 574.657000);
        ctx.bezierCurveTo(513.026000, 575.026000, 521.892000, 578.351000, 522.631000, 575.026000);
        ctx.bezierCurveTo(523.000000, 572.995000, 520.783000, 569.116000, 520.414000, 567.084000);
        ctx.bezierCurveTo(518.937000, 561.913000, 518.752000, 556.926000, 516.351000, 551.939000);
        ctx.bezierCurveTo(514.135000, 547.506000, 511.918000, 545.290000, 508.224000, 542.334000);
        ctx.bezierCurveTo(506.784000, 541.183000, 506.256000, 540.766000, 506.911000, 538.907000);
        ctx.bezierCurveTo(507.333000, 537.712000, 508.072000, 536.738000, 509.200000, 536.136000);
        ctx.bezierCurveTo(511.467000, 534.928000, 514.422000, 535.651000, 516.535000, 536.840000);
        ctx.bezierCurveTo(520.397000, 539.014000, 519.979000, 544.626000, 518.987000, 548.420000);
        ctx.bezierCurveTo(518.506000, 550.264000, 518.252000, 551.311000, 516.166000, 550.881000);
        ctx.bezierCurveTo(514.727000, 550.584000, 513.160000, 549.396000, 511.949000, 548.568000);
        ctx.bezierCurveTo(510.345000, 547.471000, 508.869000, 545.805000, 507.850000, 544.176000);
        ctx.bezierCurveTo(506.739000, 542.402000, 506.448000, 540.968000, 504.803000, 539.603000);
        ctx.bezierCurveTo(502.983000, 538.094000, 501.046000, 536.682000, 499.072000, 535.383000);
        ctx.bezierCurveTo(495.232000, 532.856000, 490.917000, 530.721000, 486.245000, 530.514000);
        ctx.fill();

        // #path3379
        ctx.fillStyle = 'rgb(55, 53, 53)';
        ctx.beginPath();
        ctx.moveTo(483.615000, 534.401000);
        ctx.bezierCurveTo(479.398000, 534.261000, 467.771000, 531.926000, 470.332000, 525.227000);
        ctx.bezierCurveTo(471.923000, 521.067000, 476.722000, 520.177000, 479.925000, 517.580000);
        ctx.bezierCurveTo(482.797000, 515.251000, 487.199000, 513.636000, 489.752000, 517.488000);
        ctx.bezierCurveTo(492.433000, 521.535000, 491.669000, 524.147000, 488.860000, 527.785000);
        ctx.bezierCurveTo(484.070000, 533.991000, 485.336000, 541.695000, 485.742000, 548.970000);
        ctx.bezierCurveTo(486.141000, 556.115000, 487.724000, 562.420000, 492.937000, 567.608000);
        ctx.bezierCurveTo(497.930000, 572.578000, 505.569000, 572.048000, 511.914000, 573.470000);
        ctx.bezierCurveTo(513.945000, 573.925000, 515.938000, 574.487000, 517.991000, 574.843000);
        ctx.bezierCurveTo(522.433000, 575.614000, 520.766000, 572.505000, 519.680000, 569.710000);
        ctx.bezierCurveTo(516.979000, 562.754000, 517.208000, 555.395000, 512.857000, 548.991000);
        ctx.bezierCurveTo(511.330000, 546.743000, 504.389000, 543.099000, 505.168000, 539.806000);
        ctx.bezierCurveTo(506.233000, 535.299000, 509.496000, 533.650000, 513.952000, 534.261000);
        ctx.bezierCurveTo(517.527000, 534.751000, 520.557000, 537.724000, 520.982000, 541.301000);
        ctx.bezierCurveTo(521.323000, 544.164000, 521.513000, 550.039000, 518.777000, 551.954000);
        ctx.bezierCurveTo(515.616000, 554.167000, 510.726000, 549.687000, 508.715000, 547.709000);
        ctx.bezierCurveTo(506.646000, 545.676000, 505.846000, 542.803000, 503.837000, 540.741000);
        ctx.bezierCurveTo(500.758000, 537.581000, 496.316000, 535.205000, 492.330000, 533.427000);
        ctx.bezierCurveTo(490.266000, 532.506000, 488.193000, 532.193000, 485.986000, 531.983000);
        ctx.bezierCurveTo(484.068000, 531.801000, 484.602000, 528.863000, 486.504000, 529.044000);
        ctx.bezierCurveTo(495.339000, 529.885000, 504.738000, 535.597000, 509.072000, 543.320000);
        ctx.bezierCurveTo(510.498000, 545.862000, 512.911000, 547.528000, 515.343000, 548.985000);
        ctx.bezierCurveTo(518.258000, 550.732000, 518.169000, 543.550000, 518.150000, 542.754000);
        ctx.bezierCurveTo(518.128000, 541.195000, 517.584000, 539.828000, 516.520000, 538.652000);
        ctx.bezierCurveTo(513.672000, 535.554000, 506.896000, 539.326000, 510.368000, 542.158000);
        ctx.bezierCurveTo(511.876000, 543.389000, 513.210000, 544.765000, 514.488000, 546.227000);
        ctx.bezierCurveTo(517.401000, 549.557000, 518.927000, 553.865000, 519.946000, 558.086000);
        ctx.bezierCurveTo(521.124000, 562.958000, 522.315000, 567.631000, 523.817000, 572.401000);
        ctx.bezierCurveTo(525.920000, 579.080000, 518.257000, 578.055000, 514.272000, 577.125000);
        ctx.bezierCurveTo(506.724000, 575.364000, 498.846000, 575.345000, 492.224000, 570.877000);
        ctx.bezierCurveTo(484.683000, 565.789000, 483.153000, 556.111000, 482.688000, 547.787000);
        ctx.bezierCurveTo(482.196000, 538.967000, 481.907000, 531.914000, 487.540000, 524.616000);
        ctx.bezierCurveTo(489.665000, 520.746000, 488.094000, 518.903000, 482.827000, 519.089000);
        ctx.bezierCurveTo(481.606000, 519.864000, 480.531000, 520.927000, 479.343000, 521.762000);
        ctx.bezierCurveTo(477.387000, 523.138000, 474.753000, 523.396000, 473.371000, 525.613000);
        ctx.bezierCurveTo(470.888000, 529.594000, 481.295000, 531.362000, 483.334000, 531.429000);
        ctx.bezierCurveTo(485.233000, 531.492000, 485.532000, 534.464000, 483.615000, 534.401000);
        ctx.fill();

        // #path3381
        ctx.fillStyle = 'rgb(160, 162, 164)';
        ctx.beginPath();
        ctx.moveTo(485.327000, 559.454000);
        ctx.bezierCurveTo(482.624000, 558.136000, 479.864000, 561.208000, 479.712000, 563.848000);
        ctx.bezierCurveTo(479.382000, 566.438000, 481.594000, 569.538000, 483.486000, 571.016000);
        ctx.bezierCurveTo(486.042000, 572.869000, 490.303000, 572.700000, 489.551000, 568.470000);
        ctx.bezierCurveTo(488.910000, 565.229000, 483.813000, 562.869000, 484.891000, 558.951000);
        ctx.fill();

        // #path3383
        ctx.fillStyle = 'rgb(55, 53, 53)';
        ctx.beginPath();
        ctx.moveTo(484.687000, 560.802000);
        ctx.bezierCurveTo(482.897000, 560.147000, 481.648000, 562.051000, 481.262000, 563.492000);
        ctx.bezierCurveTo(480.802000, 565.208000, 481.860000, 566.898000, 482.815000, 568.221000);
        ctx.bezierCurveTo(483.437000, 569.081000, 487.333000, 572.368000, 488.089000, 569.919000);
        ctx.bezierCurveTo(488.715000, 567.893000, 486.099000, 565.752000, 484.996000, 564.372000);
        ctx.bezierCurveTo(483.672000, 562.714000, 482.994000, 560.798000, 483.421000, 558.692000);
        ctx.bezierCurveTo(483.803000, 556.809000, 486.742000, 557.322000, 486.360000, 559.210000);
        ctx.bezierCurveTo(485.925000, 561.358000, 487.638000, 562.924000, 488.918000, 564.430000);
        ctx.bezierCurveTo(490.072000, 565.788000, 490.896000, 567.179000, 491.115000, 568.964000);
        ctx.bezierCurveTo(491.562000, 572.598000, 488.036000, 574.160000, 485.005000, 573.368000);
        ctx.bezierCurveTo(481.406000, 572.427000, 478.034000, 567.979000, 478.211000, 564.246000);
        ctx.bezierCurveTo(478.403000, 560.208000, 481.807000, 556.582000, 485.968000, 558.106000);
        ctx.bezierCurveTo(487.772000, 558.767000, 486.481000, 561.459000, 484.687000, 560.802000);
        ctx.fill();

        // #path3385
        ctx.fillStyle = 'rgb(160, 162, 164)';
        ctx.beginPath();
        ctx.moveTo(498.805000, 570.224000);
        ctx.bezierCurveTo(498.250000, 562.097000, 510.256000, 555.264000, 517.274000, 556.372000);
        ctx.fill();

        // #path3387
        ctx.fillStyle = 'rgb(55, 53, 53)';
        ctx.beginPath();
        ctx.moveTo(497.318000, 570.365000);
        ctx.bezierCurveTo(497.149000, 560.768000, 508.796000, 553.873000, 517.533000, 554.902000);
        ctx.bezierCurveTo(519.447000, 555.127000, 518.918000, 558.065000, 517.016000, 557.841000);
        ctx.bezierCurveTo(510.342000, 557.055000, 500.158000, 562.559000, 500.291000, 570.083000);
        ctx.bezierCurveTo(500.324000, 571.998000, 497.353000, 572.288000, 497.318000, 570.365000);
        ctx.fill();

        // #path3389
        ctx.fillStyle = 'rgb(160, 162, 164)';
        ctx.beginPath();
        ctx.moveTo(503.237000, 572.256000);
        ctx.bezierCurveTo(504.899000, 566.345000, 510.256000, 568.377000, 510.625000, 573.549000);
        ctx.fill();

        // #path3391
        ctx.fillStyle = 'rgb(55, 53, 53)';
        ctx.beginPath();
        ctx.moveTo(501.768000, 571.997000);
        ctx.bezierCurveTo(502.584000, 569.330000, 504.410000, 566.702000, 507.559000, 567.249000);
        ctx.bezierCurveTo(510.402000, 567.743000, 511.863000, 570.830000, 512.111000, 573.408000);
        ctx.bezierCurveTo(512.295000, 575.327000, 509.322000, 575.603000, 509.139000, 573.689000);
        ctx.bezierCurveTo(509.004000, 572.285000, 508.502000, 570.813000, 507.122000, 570.208000);
        ctx.bezierCurveTo(505.835000, 569.644000, 504.971000, 571.654000, 504.707000, 572.515000);
        ctx.bezierCurveTo(504.151000, 574.331000, 501.205000, 573.834000, 501.768000, 571.997000);
        ctx.fill();

        // #path3393
        ctx.fillStyle = 'rgb(160, 162, 164)';
        ctx.beginPath();
        ctx.moveTo(491.786000, 550.276000);
        ctx.bezierCurveTo(492.524000, 548.430000, 496.219000, 541.965000, 498.805000, 543.997000);
        ctx.bezierCurveTo(501.944000, 546.398000, 496.219000, 552.678000, 495.664000, 554.894000);
        ctx.fill();

        // #path3395
        ctx.fillStyle = 'rgb(55, 53, 53)';
        ctx.beginPath();
        ctx.moveTo(490.438000, 549.636000);
        ctx.bezierCurveTo(491.808000, 546.385000, 495.561000, 540.116000, 499.771000, 542.858000);
        ctx.bezierCurveTo(501.807000, 544.185000, 501.271000, 547.002000, 500.563000, 548.872000);
        ctx.bezierCurveTo(499.727000, 551.083000, 497.821000, 552.915000, 497.134000, 555.153000);
        ctx.bezierCurveTo(496.576000, 556.968000, 493.630000, 556.472000, 494.194000, 554.635000);
        ctx.bezierCurveTo(495.104000, 551.678000, 497.632000, 549.424000, 498.222000, 546.335000);
        ctx.bezierCurveTo(498.674000, 543.969000, 496.313000, 545.992000, 495.740000, 546.647000);
        ctx.bezierCurveTo(494.653000, 547.892000, 493.775000, 549.396000, 493.135000, 550.917000);
        ctx.bezierCurveTo(492.388000, 552.690000, 489.692000, 551.407000, 490.438000, 549.636000);
        ctx.fill();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    raft: function (ctx, shape) {
        // #layer1
        ctx.save();
        ctxtransform(1.000000, 0.000000, 0.000000, 1.000000, -271.853800, -583.231080, ctx, shape);//special call

        // #g3420
        ctx.save();
        ctx.transform(1.005376, 0.000000, 0.000000, -1.005376, -143.320030, 929.853790);

        // #g3422
        ctx.save();
        ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 7.878437, 2.701178);

        // #g3997
        ctx.save();
        ctx.transform(1.243316, 0.000000, 0.000000, 1.243316, -61.090407, 45.925738);

        // #g3999

        // #g4001
        ctx.save();
        ctx.beginPath();

        // #path4005
        ctx.moveTo(0.000000, 600.000000);
        ctx.lineTo(800.000000, 600.000000);
        ctx.lineTo(800.000000, 0.000000);
        ctx.lineTo(0.000000, 0.000000);
        ctx.lineTo(0.000000, 600.000000);
        ctx.clip();

        // #path4007
        ctx.fillStyle = 'rgb(183, 117, 0)';
        ctx.beginPath();
        ctx.moveTo(468.526000, 215.455000);
        ctx.lineTo(375.446000, 218.848000);
        ctx.lineTo(375.583000, 222.596000);
        ctx.lineTo(468.663000, 219.203000);
        ctx.lineTo(468.526000, 215.455000);
        ctx.closePath();
        ctx.fill();

        // #path4009
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(468.526000, 215.455000);
        ctx.lineTo(375.446000, 218.848000);
        ctx.lineTo(375.583000, 222.596000);
        ctx.lineTo(468.663000, 219.203000);
        ctx.lineTo(468.526000, 215.455000);
        ctx.closePath();
        ctx.stroke();

        // #path4011
        ctx.fillStyle = 'rgb(183, 117, 0)';
        ctx.beginPath();
        ctx.moveTo(470.149000, 219.284000);
        ctx.lineTo(377.212000, 222.672000);
        ctx.lineTo(377.349000, 226.420000);
        ctx.lineTo(470.286000, 223.032000);
        ctx.lineTo(470.149000, 219.284000);
        ctx.closePath();
        ctx.fill();

        // #path4013
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(470.149000, 219.284000);
        ctx.lineTo(377.212000, 222.672000);
        ctx.lineTo(377.349000, 226.420000);
        ctx.lineTo(470.286000, 223.032000);
        ctx.lineTo(470.149000, 219.284000);
        ctx.closePath();
        ctx.stroke();

        // #path4015
        ctx.fillStyle = 'rgb(183, 117, 0)';
        ctx.beginPath();
        ctx.moveTo(471.651000, 223.080000);
        ctx.lineTo(379.962000, 226.422000);
        ctx.lineTo(380.099000, 230.170000);
        ctx.lineTo(471.788000, 226.828000);
        ctx.lineTo(471.651000, 223.080000);
        ctx.closePath();
        ctx.fill();

        // #path4017
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(471.651000, 223.080000);
        ctx.lineTo(379.962000, 226.422000);
        ctx.lineTo(380.099000, 230.170000);
        ctx.lineTo(471.788000, 226.828000);
        ctx.lineTo(471.651000, 223.080000);
        ctx.closePath();
        ctx.stroke();

        // #path4019
        ctx.fillStyle = 'rgb(183, 117, 0)';
        ctx.beginPath();
        ctx.moveTo(474.401000, 226.830000);
        ctx.lineTo(381.715000, 230.208000);
        ctx.lineTo(381.852000, 233.956000);
        ctx.lineTo(474.538000, 230.578000);
        ctx.lineTo(474.401000, 226.830000);
        ctx.closePath();
        ctx.fill();

        // #path4021
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(474.401000, 226.830000);
        ctx.lineTo(381.715000, 230.208000);
        ctx.lineTo(381.852000, 233.956000);
        ctx.lineTo(474.538000, 230.578000);
        ctx.lineTo(474.401000, 226.830000);
        ctx.closePath();
        ctx.stroke();

        // #path4023
        ctx.fillStyle = 'rgb(183, 117, 0)';
        ctx.beginPath();
        ctx.moveTo(476.901000, 230.580000);
        ctx.lineTo(385.212000, 233.922000);
        ctx.lineTo(385.349000, 237.670000);
        ctx.lineTo(477.038000, 234.328000);
        ctx.lineTo(476.901000, 230.580000);
        ctx.closePath();
        ctx.fill();

        // #path4025
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 1.000000;
        ctx.beginPath();
        ctx.moveTo(476.901000, 230.580000);
        ctx.lineTo(385.212000, 233.922000);
        ctx.lineTo(385.349000, 237.670000);
        ctx.lineTo(477.038000, 234.328000);
        ctx.lineTo(476.901000, 230.580000);
        ctx.closePath();
        ctx.stroke();

        // #path4027
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 2.000000;
        ctx.beginPath();
        ctx.moveTo(465.125000, 234.750000);
        ctx.lineTo(457.625000, 215.875000);
        ctx.stroke();

        // #path4029
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.lineCap = 'butt';
        ctx.miterLimit = 4;
        ctx.lineWidth = 2.000000;
        ctx.beginPath();
        ctx.moveTo(394.875000, 237.125000);
        ctx.lineTo(386.375000, 218.500000);
        ctx.stroke();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    wavesPattern: function (ctx, ys) {
        for (var i = 0; i < ys.length; i++) {
            for (var j = 0; j < 14; j++) {
                if (frameCount % 10 == 0) {
                    var signal;
                    if (ys[i].scrollLeft)
                        signal = 1;
                    else
                        signal = -1;

                    if (Math.abs(ys[i].offset - ys[i].originalOffset) > 80)
                        ys[i].offset = ys[i].originalOffset;

                    var parlaxSpeed;
                    if (ys[i].y <= -75)
                        parlaxSpeed = .1;
                    else if (ys[i].y <= -35)
                        parlaxSpeed = .3;
                    else
                        parlaxSpeed = .6;

                    ys[i].offset += .1 * signal;
                }
                Draw.waves(ctx, j, ys[i].y, ys[i].offset, 1, ys[i].alpha);
            }
        }
    },

    waves: function (ctx, x, y, offsetX, scale, alpha) {
        ctx.globalAlpha = alpha;
        var grd = ctx.createLinearGradient(80, 0, 80, 140);
        grd.addColorStop(0, "#0099ff");
        grd.addColorStop(1, "white");
        ctx.fillStyle = grd;

        // #layer1
        var shape = { x: x, y: y, name: 'wave' };
        ctx.save();

        ctx.transform(1.00000, 0.000000, 0.000000, 1.000000, -407.952300 + 80 * x + offsetX - currentSeconds(), -545.130710 + 408 + y);

        // #g3420
        ctx.save();
        ctx.transform(1.005376, 0.000000, 0.000000, -1.005376, -143.320030, 929.853790);

        // #g3422
        ctx.save();
        ctx.transform(1.000000, 0.000000, 0.000000, 1.000000, 7.878437, 2.701178);

        // #g4056
        ctx.save();
        ctx.transform(1.243316, 0.000000, 0.000000, 1.243316, 516.711150, 218.561120);




        // #path4084
        ctx.fillStyle = grd;//'rgb(0, 0, 255)';
        ctx.beginPath();
        ctx.moveTo(64.179000, 113.205000);
        ctx.bezierCurveTo(61.159000, 110.508000, 44.980000, 98.867000, 19.090000, 129.278000);
        ctx.lineTo(19.090000, 72.540000);
        ctx.lineTo(83.487000, 72.540000);
        ctx.lineTo(83.487000, 129.817000);
        ctx.lineTo(64.179000, 113.205000);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
        ctx.restore();
        ctx.restore();
        ctx.restore();
    },

    sky: function (ctx) {
        ctx.globalAlpha = .9;
        var grd = ctx.createLinearGradient(80, 0, 80, 140);
        grd.addColorStop(0, "#0099ff");
        grd.addColorStop(1, "white");

        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, c.width, c.height);
    },

    hpBar: function (ctx) {
        for (var i = 0; i < Constants.PLAYER_MAX_HP; i++) {
			if(hud.health > i)
				ctx.fillStyle = "#1c5cff"; //blue
			else
				ctx.fillStyle = "#a90000"; //red
            ctx.fillRect(100 + i * 25, 16, 15, 15);
        }

    }
}

function restartGame() {
    //gameInit(); //there was a bug with game restart
    window.location = "?showHelp=false"; //bad solution, but no more time
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}