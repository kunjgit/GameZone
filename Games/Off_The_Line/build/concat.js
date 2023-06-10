// From book: Real Time Collision Detection - Christer Ericson
function signed2DTriArea(ax, ay, bx, by, cx, cy)
{
    return (ax - cx)*(by - cy) - (ay - cy)*(bx - cx);
}

// From book: Real Time Collision Detection - Christer Ericson
function getLineIntersectionInfo(ax, ay, bx, by, cx, cy, dx, dy)
{
    let info = {intersect:false};

    let a1 = signed2DTriArea(ax, ay, bx, by, dx, dy);
    let a2 = signed2DTriArea(ax, ay, bx, by, cx, cy);
    if (a1*a2 < 0.0)
    {
        let a3 = signed2DTriArea(cx, cy, dx, dy, ax, ay);
        let a4 = a3 + a2 - a1;
        if (a3*a4 < 0.0)
        {
            info.time = a3 / (a3 - a4);
            info.x = ax + info.time*(bx - ax);
            info.y = ay + info.time*(by - ay);
            info.intersect = true;
        }
    }

    return info;
}

// From book: Real Time Collision Detection - Christer Ericson
function sqDistanceToLine(ax, ay, bx, by, cx, cy)
{
    let ab = {x:bx - ax, y:by - ay};
    let ac = {x:cx - ax, y:cy - ay};
    let bc = {x:cx - bx, y:cy - by};

    // Handle cases where c projects outside of ab
    let e = dot(ac, ab);
    if (e <= 0.0)
    {
        return dot(ac, ac);
    }

    let f = dot(ab, ab);
    if (e >= f)
    {
        return dot(bc, bc);
    }

    // Handle cases where c projects onto ab
    return dot(ac, ac) - e * e / f;
}

function dot(v1, v2)
{
    return v1.x*v2.x + v1.y*v2.y;
}
function getBest()
{
    if (window === undefined || window.localStorage === undefined)
    {
        return 0;
    }

    let best = window.localStorage.getItem(`best_${difficultyMode}`);
    return best !== null ? parseInt(best, 10) : 0;
}

function setBest()
{
    if (window === undefined || window.localStorage === undefined)
    {
        return;
    }

    window.localStorage.setItem(`best_${difficultyMode}`, Math.max(levelIdx.toString(), getBest()));
}

function getDifficultyModeName()
{
    let modeName = "EASY MODE";
    if (difficultyMode === 1)
    {
        modeName = "HARD MODE"
    }
    else if (difficultyMode === 2)
    {
        modeName = "ULTRA MEGA MODE";
    }

    return modeName;
}
function resetCamera()
{
    aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
}

function setLevelCamera()
{
    aw.ctx.setTransform(1, 0, 0, 1, 0, 0);
    aw.ctx.translate(screenWidth*0.5, screenHeight*0.5);
    aw.ctx.translate(-shakeAmountCur + shakeAmountCur*Math.random()*2, -shakeAmountCur + shakeAmountCur*Math.random()*2);
    aw.ctx.scale(levelPopScaleAmountCur, -levelPopScaleAmountCur);
}

var shakeAmountCur = 0;
var shakeAmountMax = 0;
var shakeTimeCur = 0;
var shakeTimeMax = 0;
function startCameraShake(amount, time)
{
    shakeAmountMax = amount;
    shakeAmountCur = amount;
    shakeTimeMax = time;
    shakeTimeCur = time;
}

function updateCameraShake(deltaTime)
{
    if (shakeTimeCur > 0)
    {
        shakeTimeCur -= deltaTime;
        shakeAmountCur = Math.max((shakeTimeCur / shakeTimeMax) * shakeAmountMax, 0);
    }
}

var levelPopScaleAmountMax = 0.15;
var levelPopScaleAmountCur = 1.0;
var levelPopScaleTimeMax = 0.2;
var levelPopScaleTimeCur = 0;
function startLevelScalePop()
{
    levelPopScaleAmountCur = 1.0 + levelPopScaleAmountMax;
    levelPopScaleTimeCur = levelPopScaleTimeMax;
    updateLevelScalePop(0.0);
}

function updateLevelScalePop(deltaTime)
{
    if (levelPopScaleTimeCur > 0)
    {
        levelPopScaleTimeCur -= deltaTime;
        let pct = levelPopScaleTimeCur / levelPopScaleTimeMax;
        pct = pct*pct*pct;
        levelPopScaleAmountCur = Math.max(1.0 + pct * levelPopScaleAmountMax, 1.0);
    }
}
var deathParticles = [];

function particleUpdate(deltaTime)
{
    deathParticles.forEach((particle, idx) =>
    {
        let lifePct = particle.timeLeft / 0.5;
        let lifePctSmoothed = 1.0 - (lifePct*lifePct*lifePct);
        let x = particle.x + Math.cos(particle.moveAngle)*particle.maxRadius*lifePctSmoothed;
        let y = particle.y + Math.sin(particle.moveAngle)*particle.maxRadius*lifePctSmoothed;
        let angle = particle.angle + Math.PI*1.0*lifePctSmoothed;
        if (idx % 2 == 0)
        {
            angle = -angle;
        }

        aw.ctx.globalAlpha = lifePct < 0.25 ? lifePct / 0.25 : 1.0;
        aw.ctx.save();
        aw.ctx.translate(x, y);
        aw.ctx.rotate(angle);
        let lineWidthSave = aw.ctx.lineWidth;
        aw.ctx.lineWidth = 4;
        aw.ctx.strokeStyle = "#08F";
        aw.ctx.shadowColor = "#08F";
        aw.ctx.beginPath();
        aw.ctx.moveTo(-6.0, 0.0);
        aw.ctx.lineTo(6.0, 0.0);
        aw.ctx.stroke();
        aw.ctx.restore();
        aw.ctx.lineWidth = lineWidthSave;
        aw.ctx.globalAlpha = 1.0;

        particle.timeLeft -= deltaTime;
        if (particle.timeLeft <= 0.0)
        {
            particle._remove = true;
        }
    });

    deathParticles = deathParticles.filter(particle => particle._remove !== true);
}

function addDeathParticle(x, y)
{
    for (let i = 0; i < 10; i++)
    {
        deathParticles.push({x:x, y:y, timeLeft:0.5, _remove:false, angle:Math.random()*Math.PI*2, moveAngle:(Math.random()*360)*Math.PI/180, maxRadius:15 + Math.random()*40});
    }
}
class Player
{
    constructor()
    {
        this.x = 0;
        this.y = 0;
        this.xPrev = 0;
        this.yPrev = 0;
        this.xPrev2 = 0;
        this.yPrev2 = 0;
        this.boxSize = 12;
        this.speed = difficultyMode === 0 ? 250 : 400;
        this.maxButtonClickLookBackTime = 0.2;
        this.lastLeftButtonClickedDeltaTime = Number.MAX_SAFE_INTEGER;
        this.curLineDist = 0;
        this.curLevelGroup = 0;
        this.curState = this.onLineUpdate;
        this.jumpVel = {x:0, y:0};
        this.jumpSpeed = 1500;
        this.isJumping = false;
        this.isDead = false;
        this.angle = 0;
        this.rotSpeed = 180;
        this.xLineDir = 0;
        this.yLineDir = 0;

        let posInfo = level.getPosInfo(this.curLevelGroup, this.curLineDist);
        this.x = posInfo.x;
        this.y = posInfo.y;
        this.xPrev2 = this.x;
        this.yPrev2 = this.y;
        this.xPrev = this.x;
        this.yPrev = this.y;
        this.xJump = this.x;
        this.yJump = this.y;
    }

    update(deltaTime)
    {
        this.xPrev2 = this.xPrev;
        this.yPrev2 = this.yPrev;
        this.xPrev = this.x;
        this.yPrev = this.y;

        this.angle += this.rotSpeed*deltaTime;

        if (this.curState !== undefined)
        {
            this.curState(deltaTime);
        }
    }

    onLineUpdate(deltaTime)
    {
        this.curLineDist += this.speed*deltaTime;
        if (this.curLineDist < 0.0)
        {
            this.curLineDist += level.totalDistance[this.curLevelGroup];
        }
        this.curLineDist = (this.curLineDist % level.totalDistance[this.curLevelGroup]);
        let posInfo = level.getPosInfo(this.curLevelGroup, this.curLineDist);
        this.x = posInfo.x;
        this.y = posInfo.y;
        this.xLineDir = posInfo.xDir;
        this.yLineDir = posInfo.yDir;

        // Check for death
        aw.entities.forEach(entity =>
        {
            if (entity instanceof Wall)
            {
                let lineIntersectInfo = getLineIntersectionInfo(this.xPrev2, this.yPrev2, this.x, this.y, entity.x1, entity.y1, entity.x2, entity.y2);
                if (lineIntersectInfo.intersect)
                {
                    addDeathParticle(lineIntersectInfo.x, lineIntersectInfo.y);
                    this.hit();
                }
            }
        });

        if (!this.isDead)
        {
            this.lastLeftButtonClickedDeltaTime += deltaTime;
            if ((aw.mouseLeftButtonJustPressed && (aw.mousePos.x < 460.0 || aw.mousePos.y > 50.0)) || aw.keysJustPressed["space"])
            {
                this.lastLeftButtonClickedDeltaTime = 0;
            }

            if (this.lastLeftButtonClickedDeltaTime <= this.maxButtonClickLookBackTime)
            {
                this.jumpVel = {x:posInfo.nx * this.jumpSpeed, y:posInfo.ny * this.jumpSpeed};
                this.xJump = this.x;
                this.yJump = this.y;

                this.isJumping = true;
                this.curState = this.jumpingUpdate;

                aw.playNote("a", 5, 0.01);
                aw.playNote("a#", 5, 0.01, 0.01);
                aw.playNote("b", 5, 0.01, 0.02);
            }
        }
    }

    jumpingUpdate(deltaTime)
    {
        this.x += this.jumpVel.x * deltaTime;
        this.y += this.jumpVel.y * deltaTime;

        // Check for death
        aw.entities.forEach(entity =>
        {
            if (entity instanceof Wall)
            {
                let lineIntersectInfo = getLineIntersectionInfo(this.xPrev2, this.yPrev2, this.x, this.y, entity.x1, entity.y1, entity.x2, entity.y2);
                if (lineIntersectInfo.intersect)
                {
                    addDeathParticle(lineIntersectInfo.x, lineIntersectInfo.y);
                    this.hit();
                }
            }
        });
        
        // Off screen?
        if (this.x < -screenWidth*0.5 - this.boxSize || this.x > screenWidth*0.5 + this.boxSize ||
            this.y < -screenHeight*0.5 - this.boxSize || this.y > screenHeight*0.5 + this.boxSize)
        {
            this.hit();
        }

        if (!this.isDead)
        {
            // Check for hitting coins
            aw.entities.forEach(entity =>
            {
                if (entity instanceof Coin)
                {
                    let distToPlayer = sqDistanceToLine(this.xPrev, this.yPrev, this.x, this.y, entity.x, entity.y);
                    if (distToPlayer <= entity.hitSizeSq)
                    {
                        entity.hit();
                    }
                }
            });

            // Check for hitting level again
            let intersectInfo = level.getIntersectionInfo(this.xPrev2, this.yPrev2, this.x, this.y);
            if (intersectInfo.intersect)
            {
                let xDist = intersectInfo.x - this.xJump;
                let yDist = intersectInfo.y - this.yJump;
                let sqDist = xDist*xDist + yDist*yDist;
                if (sqDist > 225.0) // > 15.0 dist
                {
                    this.curLineDist = intersectInfo.distance;
                    this.curLevelGroup = intersectInfo.group;
                    let posInfo = level.getPosInfo(this.curLevelGroup, this.curLineDist);
                    this.x = posInfo.x;
                    this.y = posInfo.y;
                    this.lastLeftButtonClickedDeltaTime = Number.MAX_SAFE_INTEGER;

                    this.isJumping = false;
                    this.curState = this.onLineUpdate;

                    // Change direction if the line we jumped to is in the opposite direction
                    // compared to the line we jumped from. This makes the player keep going
                    // in the same direction that you were previously going.
                    let dot = posInfo.xDir*this.xLineDir + posInfo.yDir*this.yLineDir;
                    if (dot < 0.0)
                    {
                        this.speed = -this.speed;
                    }

                    startCameraShake(2.5, 0.15);

                    aw.playNote("a", 4, 0.01);
                    aw.playNote("a#", 4, 0.01, 0.01);
                }
            }
        }
    }

    deadUpdate()
    {

    }

    render()
    {
        if (!this.isDead)
        {
            aw.ctx.save();
            aw.ctx.translate(this.x, this.y);
            aw.ctx.rotate(this.angle);
            let lineWidthSave = aw.ctx.lineWidth;
            aw.ctx.lineWidth = 4;
            aw.ctx.strokeStyle = "#08F";
            aw.ctx.shadowColor = "#08F";
            aw.ctx.beginPath();
            aw.ctx.rect(-this.boxSize*0.5, -this.boxSize*0.5, this.boxSize, this.boxSize);
            aw.ctx.stroke();
            aw.ctx.restore();
            aw.ctx.lineWidth = lineWidthSave;
        }
    }

    hit()
    {
        lives = Math.max(lives - 1, 0);
        this.isDead = true;
        this.curState = this.deadUpdate;

        startCameraShake(5, 0.2);
        aw.playNote("a", 1, 0.2, 0.0, "square");
        aw.playNoise(0.05);
    }
}
class Coin
{
    constructor(x, y, offset, offsetAngle, offsetRotSpeed)
    {
        this.xCenter = x;
        this.yCenter = y;
        this.x = x;
        this.y = y;
        this.boxSize = 8;
        this.hitSize = 20;
        this.hitSizeSq = this.hitSize * this.hitSize;
        this.angle = 0;
        this.rotSpeed = 180;
        this.active = true;
        this.offset = offset !== undefined ? offset : 0;
        this.offsetAngle = offsetAngle !== undefined ? (offsetAngle * Math.PI/180) : 0;
        this.offsetRotSpeed = offsetRotSpeed !== undefined ? (offsetRotSpeed * Math.PI/180) : 0;
        this.deathTimeCur = 0.0;
        this.deathTimeMax = 0.5;
    }

    update(deltaTime)
    {
        this.angle -= this.rotSpeed*deltaTime;

        if (this.offset !== 0)
        {
            let xOffset = Math.cos(this.offsetAngle);
            let yOffset = Math.sin(this.offsetAngle);
            this.x = this.xCenter + xOffset*this.offset;
            this.y = this.yCenter + yOffset*this.offset;

            if (this.offsetRotSpeed !== 0)
            {
                this.offsetAngle += this.offsetRotSpeed*deltaTime;
            }
        }

        if (!this.active)
        {
            this.deathTimeCur += deltaTime;
        }
    }

    render()
    {
        if (this.active || this.deathTimeCur < this.deathTimeMax)
        {
            let alphaSave = aw.ctx.globalAlpha;

            let scale = 1.0;
            if (!this.active)
            {
                let deathPct = 1.0 - (this.deathTimeCur / this.deathTimeMax);
                deathPct = deathPct*deathPct*deathPct*deathPct*deathPct;
                scale += (1.0 - deathPct)*3.0;
                aw.ctx.globalAlpha = deathPct;
            }

            aw.ctx.save();
            aw.ctx.translate(this.x, this.y);
            aw.ctx.rotate(this.angle * Math.PI/180);
            aw.ctx.scale(scale, scale);
            aw.ctx.lineWidth = 2;
            aw.ctx.strokeStyle = "#FF0";
            aw.ctx.shadowColor = "#FF0";
            aw.ctx.beginPath();
            aw.ctx.rect(-this.boxSize*0.5, -this.boxSize*0.5, this.boxSize, this.boxSize);
            aw.ctx.stroke();
            aw.ctx.restore();

            aw.ctx.globalAlpha = alphaSave;
        }
    }

    hit()
    {
        if (this.active)
        {
            this.active = false;
            aw.playNote("g", 7, 0.025);
        }
    }
}
class Wall
{
    constructor(x, y, length, angle, rotSpeed, xMove, yMove, moveTime, idleTime)
    {
        this.xCenter = x;
        this.yCenter = y;
        this.length = length;
        this.halfLength = length * 0.5;
        this.angle = angle !== undefined ? angle * Math.PI/180 : 0;
        this.rotSpeed = rotSpeed !== undefined ? rotSpeed * Math.PI/180 : 0;
        this.xMove = xMove !== undefined ? xMove : 0;
        this.yMove = yMove !== undefined ? yMove : 0;
        this.moveTime = moveTime !== undefined ? moveTime : 0;
        this.idleTime = idleTime !== undefined ? idleTime : 0;
        this.curTimer = this.moveTime;
        this.isMoving = true;
        this.moveForward = true;
        this.curMovePct = 0.0;

        this.updateEndPoints();
    }

    update(deltaTime)
    {
        let changed = false;

        if (this.rotSpeed !== 0)
        {
            this.angle += this.rotSpeed*deltaTime;
            changed = true;
        }

        if ((this.xMove !== 0 || this.yMove !== 0) && this.moveTime !== 0)
        {
            if (this.isMoving)
            {
                this.curMovePct = this.moveForward ? 1.0 - (this.curTimer / this.moveTime) : this.curTimer / this.moveTime;
            }
            else
            {
                this.curMovePct = this.moveForward ? 0.0 : 1.0;
            }

            this.curTimer -= deltaTime;
            if (this.curTimer <= 0.0)
            {
                if (this.isMoving)
                {                    
                    this.curTimer = this.idleTime;
                    this.moveForward = !this.moveForward;
                }
                else
                {
                    this.curTimer = this.moveTime;
                }
                this.isMoving = !this.isMoving;
            }

            changed = true;
        }

        if (changed)
        {
            this.updateEndPoints();
        }
    }

    updateEndPoints()
    {
        let xDir = Math.cos(this.angle);
        let yDir = Math.sin(this.angle);

        let xCenterCur = this.xCenter + this.xMove*this.curMovePct;
        let yCenterCur = this.yCenter + this.yMove*this.curMovePct;

        this.x1 = xCenterCur - xDir*this.halfLength;
        this.y1 = yCenterCur - yDir*this.halfLength;
        this.x2 = xCenterCur + xDir*this.halfLength;
        this.y2 = yCenterCur + yDir*this.halfLength;
    }

    render()
    {
        aw.ctx.save();
        aw.ctx.lineWidth = 2;
        aw.ctx.strokeStyle = "#F00";
        aw.ctx.shadowColor = "#F00";
        aw.ctx.beginPath();
        aw.ctx.moveTo(this.x1, this.y1);
        aw.ctx.lineTo(this.x2, this.y2);
        aw.ctx.stroke();
        aw.ctx.restore();
    }
}
function drawUI(deltaTime)
{
    particleUpdate(deltaTime);

    resetCamera();

    // Timer
    if (difficultyMode == 2)
    {
        let xStart = 10;
        let yStart = screenHeight - 30;
        aw.ctx.fillStyle = "#FFF";
        aw.ctx.fillRect(xStart, yStart, (level.timer / level.levelTime)*(screenWidth - 20), 20);
    }

    // Level #
    aw.ctx.shadowColor = "#FFF";
    aw.drawText({text:`LEVEL ${(levelIdx + 1)} - ${level ? level.name : ""}`, x:10, y:30, fontSize:24, fontStyle:"bold"});
    aw.drawText({text:`BEST: ${getBest() + 1}`, x:10, y:50, fontSize:15, fontStyle:"bold", color:"#FFF"});

    // Lives
    if (difficultyMode === 2)
    {
        aw.ctx.shadowColor = "#08F";
        aw.drawText({text:"UNLIMITED LIVES", x:630, y:25, fontSize:15, fontStyle:"bold", color:"#08F", textAlign:"right"});
        aw.drawText({text:"PRESS HERE TO QUIT", x:630, y:45, fontSize:15, fontStyle:"bold", color:"#08F", textAlign:"right"});
    }
    else
    {
        let numLives = difficultyMode === 0 ? 10 : 5;
        let xStart = difficultyMode === 0 ? 440 : 536;
        for (let i = 0; i < numLives; i++)
        {
            if (i < lives)
            {
                aw.ctx.lineWidth = 3;
                aw.ctx.strokeStyle = "#08F";
                aw.ctx.shadowColor = "#08F";
                aw.ctx.save();
                aw.ctx.translate(xStart + 4 + i*20, 18);
                aw.ctx.beginPath();
                let boxSize = 10;
                aw.ctx.rect(-boxSize*0.5, -boxSize*0.5, boxSize, boxSize);
                aw.ctx.stroke();
                aw.ctx.restore();
            }
            else
            {
                aw.ctx.shadowColor = "#F00";
                aw.drawText({text:"x", x:xStart + i*19.6, y:30, fontSize:24, fontStyle:"bold", color:"#F00"});
            }
        }
    }

    // Game over
    if (aw.state === gameOver)
    {
        if (levelIdx === 19)
        {
            aw.ctx.shadowColor = "#555";
            aw.ctx.fillStyle = "#555";
            aw.ctx.fillRect(0, 100, screenWidth, 110);

            let flashColor = Date.now() % 500 < 250 ? "#08F" : "#FF0";
            aw.ctx.shadowColor = flashColor;
            aw.drawText({text:"CONGRATULATIONS!", x:screenWidth*0.5, y:150, fontSize:40, fontStyle:"bold", color:flashColor, textAlign:"center"});

            aw.ctx.shadowColor = "#FFF";
            aw.drawText({text:`${getDifficultyModeName()} COMPLETE`, x:screenWidth*0.5, y:180, fontSize:20, fontStyle:"bold", color:"#FFF", textAlign:"center"});
            aw.drawText({text:"CLICK TO QUIT TO MAIN MENU", x:screenWidth*0.5, y:200, fontSize:14, fontStyle:"bold", color:"#FFF", textAlign:"center"});
        }
        else
        {
            aw.ctx.shadowColor = "#333";
            aw.ctx.fillStyle = "#333";
            aw.ctx.fillRect(0, 52, screenWidth, 140);

            aw.ctx.shadowColor = "#F00";
            aw.drawText({text:"GAME OVER", x:screenWidth*0.5, y:100, fontSize:40, fontStyle:"bold", color:"#F00", textAlign:"center"});

            aw.ctx.shadowColor = "#FFF";
            aw.drawText({text:getDifficultyModeName(), x:screenWidth*0.5, y:100 + 30, fontSize:20, fontStyle:"bold", color:"#FFF", textAlign:"center"});
            aw.drawText({text:`SCORE: ${levelIdx + 1}`, x:screenWidth*0.5, y:100 + 55, fontSize:20, fontStyle:"bold", color:"#FFF", textAlign:"center"});
            aw.drawText({text:`BEST: ${getBest() + 1}`, x:screenWidth*0.5, y:100 + 80, fontSize:20, fontStyle:"bold", color:"#FFF", textAlign:"center"});
        }
    }
}
var menuOptions =
[
    {text:"EASY MODE", width:255, helpText:"(SLOW SPEED + 10 LIVES)"},
    {text:"HARD MODE", width:260, helpText:"(FAST SPEED + 5 LIVES)"},
    {text:"ULTRA MEGA MODE", width:388, helpText:"(FAST SPEED + TIMED LEVELS)"}
];

var prevOption = -1;
function mainMenu(deltaTime)
{
    renderBackgroundSpeedLines(deltaTime);

    aw.ctx.save();
    resetCamera();

    aw.ctx.shadowColor = "#08F";
    aw.drawText({text:"OFF THE LINE", x:15, y:10, fontSize:70, fontStyle:"bold italic", color:"#08F", textAlign:"left", textBaseline:"top"});

    aw.ctx.shadowColor = "#08F";
    aw.drawText({text:"A GAME BY BRYAN PERFETTO", x:25, y:85, fontSize:20, fontStyle:"bold italic", color:"#08F", textAlign:"left", textBaseline:"top"});

    let yMenu = 350;
    let yMenuStep = 40;
    let selectedOption = -1;
    for (let i = 0; i < menuOptions.length; i++)
    {
        let isHighlighted = aw.mousePos.y >= yMenu + yMenuStep*i && aw.mousePos.y < yMenu + yMenuStep*(i + 1) && aw.mousePos.x >= 0 && aw.mousePos.x < menuOptions[i].width;
        let optionColor = isHighlighted ? "#FF0" : "#FFF";
        
        aw.ctx.shadowColor = optionColor;
        aw.drawText({text:menuOptions[i].text, x:15, y:yMenu + yMenuStep*i, fontSize:35, fontStyle:"bold italic", color:optionColor, textAlign:"left", textBaseline:"top"}); 

        if (isHighlighted)
        {
            selectedOption = i;
            aw.ctx.shadowColor = "#888";
            aw.drawText({text:menuOptions[i].helpText, x:-15 + menuOptions[i].width, y:yMenu + yMenuStep*i + 12, fontSize:12, fontStyle:"bold italic", color:"#888", textAlign:"left", textBaseline:"top"}); 
        }
    }

    aw.ctx.restore();

    if (selectedOption !== prevOption)
    {
        if (selectedOption !== -1)
        {
            aw.playNote("a", 5, 0.025);
        }
        prevOption = selectedOption;
    }
    
    if (selectedOption !== -1 && aw.mouseLeftButtonJustUp)
    {
        difficultyMode = selectedOption;
        lives = difficultyMode === 0 ? 10 : 5;
        levelIdx = 0;
        initLevel(levelIdx);
        aw.mouseLeftButtonJustPressed = false;
        aw.mouseLeftButtonJustUp = false;
        aw.ctx.shadowBlur = 0;
        aw.state = playing;
        aw.statePost = drawUI;
    }
}
function playing(deltaTime)
{
    aw.ctx.shadowBlur = 10;
    renderBackgroundSpeedLines(deltaTime);

    var doQuit = (aw.mouseLeftButtonJustUp && aw.mousePos.x >= 460.0 && aw.mousePos.y <= 50.0) || aw.keysJustPressed["escape"];
    if (doQuit && difficultyMode === 2)
    {
        aw.clearAllEntities();
        aw.mouseLeftButtonJustPressed = false;
        aw.ctx.shadowBlur = 20;
        aw.state = mainMenu;
        aw.statePost = undefined;

        aw.playNote("a", 4, 0.05, 0.0);
        aw.playNote("b", 4, 0.05, 0.05);
    }

    if (player.isDead || level.isComplete())
    {
        endLevelTime -= deltaTime;
        if (endLevelTime <= 0.0)
        {
            if (level.isComplete() && levelIdx === 19)
            {
                aw.state = gameOver;

                for (let i = 0; i < 3; i++)
                {
                    aw.playNote("d", 5, 0.05, i*0.3 + 0.0);
                    aw.playNote("e", 5, 0.05, i*0.3 + 0.05);
                    aw.playNote("g", 5, 0.05, i*0.3 + 0.1);
                    aw.playNote("a", 5, 0.05, i*0.3 + 0.15);
                    aw.playNote("b", 5, 0.05, i*0.3 + 0.2);
                    aw.playNote("d", 5, 0.05, i*0.3 + 0.25);
                }
                aw.playNote("c", 6, 0.5, 0.9);
            }
            else if (lives === 0 && difficultyMode !== 2)
            {
                aw.state = gameOver;

                aw.playNote("a#", 4, 0.05, 0.0);
                aw.playNote("g", 4, 0.05, 0.05);
                aw.playNote("e", 4, 0.05, 0.10);
                aw.playNote("d", 4, 0.15, 0.15);
            }
            else if (player.isDead)
            {
                initLevel(levelIdx);
            }
            else
            {
                levelIdx = (levelIdx + 1) % 20;
                initLevel(levelIdx);
            }
        }
    }

    updateCameraShake(deltaTime);
    updateLevelScalePop(deltaTime);
    setLevelCamera();
}

function initLevel(idx)
{
    aw.clearAllEntities();

    startLevelScalePop();

    updateCameraShake(0);
    updateLevelScalePop(0);
    setLevelCamera();

    // TEMP TO WORK AROUND CLOSURE COMPILER ISSUES
    if (idx == 0) { level = new L01() }
    else if (idx == 1) { level = new L02() }
    else if (idx == 2) { level = new L03() }
    else if (idx == 3) { level = new L04() }
    else if (idx == 4) { level = new L05() }
    else if (idx == 5) { level = new L06() }
    else if (idx == 6) { level = new L07() }
    else if (idx == 7) { level = new L08() }
    else if (idx == 8) { level = new L09() }
    else if (idx == 9) { level = new L10() }
    else if (idx == 10) { level = new L15() }
    else if (idx == 11) { level = new L13() }
    else if (idx == 12) { level = new L17() }
    else if (idx == 13) { level = new L20() }
    else if (idx == 14) { level = new L12() }
    else if (idx == 15) { level = new L16() }
    else if (idx == 16) { level = new L18() }
    else if (idx == 17) { level = new L11() }
    else if (idx == 18) { level = new L19() }
    else if (idx == 19) { level = new L14() }
    aw.addEntity(level);

    player = new Player();
    aw.addEntity(player);

    endLevelTime = 1.0;
    setBest();

    aw.playNote("d", 4, 0.05, 0.0);
    aw.playNote("e", 4, 0.05, 0.05);
    aw.playNote("g", 4, 0.05, 0.10);
    aw.playNote("a#", 4, 0.15, 0.15);
}
function gameOver(deltaTime)
{
    renderBackgroundSpeedLines(deltaTime);

    if (aw.mouseLeftButtonJustPressed)
    {
        aw.clearAllEntities();
        aw.mouseLeftButtonJustPressed = false;
        aw.ctx.shadowBlur = 20;
        aw.state = mainMenu;
        aw.statePost = undefined;

        aw.playNote("a", 4, 0.05, 0.0);
        aw.playNote("b", 4, 0.05, 0.05);
    }

    updateCameraShake(deltaTime);
    updateLevelScalePop(deltaTime);
    setLevelCamera();
}
let backgroundSpeedLines = [];
var speedLineSize = 400;
var speedLineSpeed = 4000;
var numSpeedLinesPerFrame = 2;
function renderBackgroundSpeedLines(deltaTime)
{
    // This shouldn't be here
    if (aw.keysJustPressed["s"])
    {
        aw.soundOn = !aw.soundOn;
    }

    aw.ctx.save();
    resetCamera();

    for (let i = 0; i < numSpeedLinesPerFrame; i++)
    {
        backgroundSpeedLines.push({x:screenWidth, y:Math.random()*screenHeight, _remove:false});
    }

    aw.ctx.lineWidth = 2;
    aw.ctx.strokeStyle = aw.state === mainMenu || aw.state === init ? "#111" : "#090909";
    let shadowBlurSave = aw.ctx.shadowBlur;
    aw.ctx.shadowBlur = 0;
    
    backgroundSpeedLines.forEach(speedLine =>
    {
        speedLine.x -= speedLineSpeed*deltaTime;
        if (speedLine.x < -speedLineSize)
        {
            speedLine._remove = true;
        }

        aw.ctx.beginPath();
        aw.ctx.moveTo(speedLine.x, speedLine.y);
        aw.ctx.lineTo(speedLine.x + speedLineSize, speedLine.y);
        aw.ctx.stroke();
    });

    backgroundSpeedLines = backgroundSpeedLines.filter(speedLine => speedLine._remove !== true);

    aw.ctx.restore();
    aw.ctx.shadowBlur = shadowBlurSave;
}
class Level
{
    constructor()
    {
        this.linePoints = [];
        this.segLengths = [];
        this.totalDistance = [];
        this.normals = [];
        this.levelTime = 7.0;
        this.timer = this.levelTime;

        this.addPoints();
        this.createSegments();
        this.addItems();
    }

    addPoints()
    {
    }

    createSegments()
    {
        for (let group = 0; group < this.linePoints.length; group++)
        {
            this.totalDistance.push(0);
            this.segLengths.push([]);
            for (let i = 0; i < this.linePoints[group].length - 1; i++)
            {
                let xDist = this.linePoints[group][i + 1].x - this.linePoints[group][i].x;
                let yDist = this.linePoints[group][i + 1].y - this.linePoints[group][i].y;
                let segDist = Math.sqrt((xDist*xDist) + (yDist*yDist));

                this.totalDistance[group] += segDist;
                this.segLengths[group].push(segDist);
            }

            let xDist = this.linePoints[group][0].x - this.linePoints[group][this.linePoints[group].length - 1].x;
            let yDist = this.linePoints[group][0].y - this.linePoints[group][this.linePoints[group].length - 1].y;
            let segDist = Math.sqrt((xDist*xDist) + (yDist*yDist));

            this.totalDistance[group] += segDist;
            this.segLengths[group].push(segDist);
        }
    }

    addItems()
    {
    }

    update(deltaTime)
    {
        if (difficultyMode == 2 && !this.isComplete() && !player.isDead)
        {
            this.timer = Math.max(this.timer - deltaTime, 0.0);
            if (this.timer <= 0.0)
            {
                addDeathParticle(player.x, player.y);
                player.hit();
            }
        }
    }

    render()
    {
        aw.ctx.lineWidth = 2;
        aw.ctx.strokeStyle = "#FFF";
        aw.ctx.shadowColor = "#FFF";
        for (let group = 0; group < this.linePoints.length; group++)
        {
            aw.ctx.beginPath();
            aw.ctx.moveTo(this.linePoints[group][0].x, this.linePoints[group][0].y);
            for (let i = 1; i < this.linePoints[group].length; i++)
            {
                aw.ctx.lineTo(this.linePoints[group][i].x, this.linePoints[group][i].y);
            }
            aw.ctx.lineTo(this.linePoints[group][0].x, this.linePoints[group][0].y);
            aw.ctx.stroke();
        }
    }

    getStartPos()
    {
        return this.linePoints[0][0];
    }

    getPosInfo(group, distance)
    {
        distance = distance % this.totalDistance[group];

        let curTotalDistance = 0;
        for (let i = 0; i < this.segLengths[group].length; i++)
        {
            let nextTotalDistance = curTotalDistance + this.segLengths[group][i];
            if (distance >= curTotalDistance && distance < nextTotalDistance)
            {
                let ratio = (distance - curTotalDistance) / this.segLengths[group][i];
                let p1 = i;
                let p2 = (i + 1) % this.linePoints[group].length;
                let xDir = this.linePoints[group][p2].x - this.linePoints[group][p1].x;
                let yDir = this.linePoints[group][p2].y - this.linePoints[group][p1].y;
                let xInterp = this.linePoints[group][p1].x + xDir*ratio;
                let yInterp = this.linePoints[group][p1].y + yDir*ratio;

                if (this.normals[group] !== undefined && this.normals[group][i] !== undefined)
                {
                    return {x:xInterp, y:yInterp, nx:this.normals[group][i].x, ny:this.normals[group][i].y, xDir:xDir, yDir:yDir};
                }
                else
                {
                    let xDir = (this.linePoints[group][p2].x - this.linePoints[group][p1].x) / this.segLengths[group][i];
                    let yDir = (this.linePoints[group][p2].y - this.linePoints[group][p1].y) / this.segLengths[group][i];
                    return {x:xInterp, y:yInterp, nx:yDir, ny:-xDir, xDir:xDir, yDir:yDir};
                }
            }

            curTotalDistance = nextTotalDistance;
        }

        return {x:this.linePoints[0][0].x, y:this.linePoints[0][0].y};
    }

    getIntersectionInfo(x1, y1, x2, y2)
    {
        for (let group = 0; group < this.segLengths.length; group++)
        {
            let curTotalDistance = 0;
            for (let i = 0; i < this.segLengths[group].length; i++)
            {
                let p1 = i;
                let p2 = (i + 1) % this.linePoints[group].length;

                let lineIntersectInfo = getLineIntersectionInfo(this.linePoints[group][p1].x, this.linePoints[group][p1].y, this.linePoints[group][p2].x, this.linePoints[group][p2].y, x1, y1, x2, y2);
                if (lineIntersectInfo.intersect)
                {
                    lineIntersectInfo.distance = curTotalDistance + this.segLengths[group][i]*lineIntersectInfo.time;
                    lineIntersectInfo.group = group;
                    return lineIntersectInfo;
                }

                curTotalDistance += this.segLengths[group][i];
            }
        }

        return {intersect:false};
    }

    isComplete()
    {
        let isComplete = true;
        aw.entities.forEach(entity =>
        {
            if (entity instanceof Coin)
            {
                if (entity.active)
                {
                    isComplete = false;
                }
            }
        });

        return isComplete;
    }
}
class L01 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-100, y:100});
        this.linePoints[0].push({x:100, y: 100});
        this.linePoints[0].push({x:100, y: -100});
        this.linePoints[0].push({x:-100, y: -100});

        this.name = "THE BOX";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(-50, 0));
        aw.addEntity(new Coin(50, 0));
        aw.addEntity(new Coin(-25, 0));
        aw.addEntity(new Coin(25, 0));

        aw.addEntity(new Coin(0, 50));
        aw.addEntity(new Coin(-50, 50));
        aw.addEntity(new Coin(50, 50));
        aw.addEntity(new Coin(-25, 50));
        aw.addEntity(new Coin(25, 50));

        aw.addEntity(new Coin(0, -50));
        aw.addEntity(new Coin(-50, -50));
        aw.addEntity(new Coin(50, -50));
        aw.addEntity(new Coin(-25, -50));
        aw.addEntity(new Coin(25, -50));
    }
}
class L02 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-200, y:100});
        this.linePoints[0].push({x:200, y: 100});
        this.linePoints[0].push({x:200, y: -100});
        this.linePoints[0].push({x:-200, y: -100});

        this.name = "PEGBOARD";
    }

    addItems()
    {
        let xCols = [-150, -75, 0, 75, 150];
        let yCols = [-60, -20, 20, 60];
        for (let y = 0; y < yCols.length; y++)
        {
            for (let x = 0; x < xCols.length; x++)
            {
                aw.addEntity(new Coin(xCols[x], yCols[y]));
            }
        }
    }
}
class L03 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        let radius = 150;
        let numPoints = 90;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = Math.PI*2 - (i * angleStep);
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y});
        }

        this.name = "ORBIT";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(0, 0, 50, 90, 70));
        aw.addEntity(new Coin(0, 0, 100, 90, 70));
        aw.addEntity(new Coin(0, 0, 50, 270, 70));
        aw.addEntity(new Coin(0, 0, 100, 270, 70));
    }
}
class L04 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-60, y:150});
        this.linePoints[0].push({x:60, y: 150});
        this.linePoints[0].push({x:60, y: -150});
        this.linePoints[0].push({x:-60, y: -150});

        this.name = "NEEDLE";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(0, 50));
        aw.addEntity(new Coin(0, -50));

        aw.addEntity(new Wall(-40, 25, 40, 0));
        aw.addEntity(new Wall(40, -25, 40, 0));
        aw.addEntity(new Wall(40, 75, 40, 0));
        aw.addEntity(new Wall(-40, -75, 40, 0));
    }
}
class L05 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-200, y:0});
        this.linePoints[0].push({x:0, y:200});
        this.linePoints[0].push({x:200, y:0});
        this.linePoints[0].push({x:0, y:-200});

        this.levelTime = 12.0;
        this.timer = this.levelTime;
        this.name = "PATIENCE";
    }

    addItems()
    {
        aw.addEntity(new Wall(0, 0, 250, 0, 40));

        aw.addEntity(new Coin(0, 120));
        aw.addEntity(new Coin(30, 90));
        aw.addEntity(new Coin(60, 60));
        aw.addEntity(new Coin(90, 30));

        aw.addEntity(new Coin(-30, 90));
        aw.addEntity(new Coin(-60, 60));
        aw.addEntity(new Coin(-90, 30));
        aw.addEntity(new Coin(-120, 0));

        aw.addEntity(new Coin(-90, -30));
        aw.addEntity(new Coin(-60, -60));
        aw.addEntity(new Coin(-30, -90));
        aw.addEntity(new Coin(0, -120));

        aw.addEntity(new Coin(30, -90));
        aw.addEntity(new Coin(60, -60));
        aw.addEntity(new Coin(90, -30));
        aw.addEntity(new Coin(120,  0));
    }
}
class L06 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-200, y:200});
        this.linePoints[0].push({x:-50, y: 200});
        this.linePoints[0].push({x:-50, y: 20});
        this.linePoints[0].push({x:200, y: 20});

        this.linePoints[0].push({x:200, y:-200});
        this.linePoints[0].push({x:50, y: -200});
        this.linePoints[0].push({x:50, y: -20});
        this.linePoints[0].push({x:-200, y: -20});

        this.name = "BOOMERANG";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(-30, 0));
        aw.addEntity(new Coin(-60, 0));
        aw.addEntity(new Coin(30, 0));
        aw.addEntity(new Coin(60, 0));
        aw.addEntity(new Coin(90, 0));
        aw.addEntity(new Coin(-90, 0));
        aw.addEntity(new Coin(120, 0));
        aw.addEntity(new Coin(-120, 0));

        aw.addEntity(new Wall(-125, 160, 150));
        aw.addEntity(new Wall(125, -160, 150));
        aw.addEntity(new Coin(-125, 180));
        aw.addEntity(new Coin(125, -180));

        aw.addEntity(new Wall(-60, 40, 40, 90));
        aw.addEntity(new Wall(60, -40, 40, 90));
    }
}
class L07 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:50, y:-100});
        this.linePoints[0].push({x:-50, y:-100});
        this.normals.push([]);
        this.normals[0].push({x:0, y:1});
        this.normals[0].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-125, y:100});
        this.linePoints[1].push({x:-25, y:100});
        this.normals.push([]);
        this.normals[1].push({x:0, y:-1});
        this.normals[1].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[2].push({x:125, y:100});
        this.linePoints[2].push({x:25, y:100});
        this.normals.push([]);
        this.normals[2].push({x:0, y:-1});
        this.normals[2].push({x:0, y:-1});

        this.name = "SPLITTER";
    }

    addItems()
    {
        aw.addEntity(new Coin(-35, -50));
        aw.addEntity(new Coin(-35, -25));
        aw.addEntity(new Coin(-35, 0));
        aw.addEntity(new Coin(-35, 25));
        aw.addEntity(new Coin(-35, 50));

        aw.addEntity(new Coin(35, -50));
        aw.addEntity(new Coin(35, -25));
        aw.addEntity(new Coin(35, 0));
        aw.addEntity(new Coin(35, 25));
        aw.addEntity(new Coin(35, 50));
    }
}
class L08 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-250, y:-100});
        this.linePoints[0].push({x:250, y: -100});
        this.normals.push([]);
        this.normals[0].push({x:0, y:1});
        this.normals[0].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-140, y:100});
        this.linePoints[1].push({x:-110, y:100});
        this.normals.push([]);
        this.normals[1].push({x:0, y:-1});
        this.normals[1].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[2].push({x:140, y:100});
        this.linePoints[2].push({x:110, y:100});
        this.normals.push([]);
        this.normals[2].push({x:0, y:-1});
        this.normals[2].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[3].push({x:-15, y:100});
        this.linePoints[3].push({x:15, y:100});
        this.normals.push([]);
        this.normals[3].push({x:0, y:-1});
        this.normals[3].push({x:0, y:-1});

        this.levelTime = 12.0;
        this.timer = this.levelTime;

        this.name = "TRIPLE SHOT";
    }

    addItems()
    {
        aw.addEntity(new Coin(-125, -50));
        aw.addEntity(new Coin(-125, 0));
        aw.addEntity(new Coin(-125, 50));

        aw.addEntity(new Coin(0, -50));
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(0, 50));

        aw.addEntity(new Coin(125, -50));
        aw.addEntity(new Coin(125, 0));
        aw.addEntity(new Coin(125, 50));
    }
}
class L09 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        let radius = 150;
        let numPoints = 90;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = Math.PI*2 - (i * angleStep);
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y});
        }

        this.linePoints.push([]);
        radius = 100;
        numPoints = 45;
        angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = i * angleStep;
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[1].push({x:x, y:y});
        }

        this.name = "DONUT";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 115));
        aw.addEntity(new Coin(0, 135));

        aw.addEntity(new Coin(0, -115));
        aw.addEntity(new Coin(0, -135));

        aw.addEntity(new Coin(115, 0));
        aw.addEntity(new Coin(135, 0));

        aw.addEntity(new Coin(-115, 0));
        aw.addEntity(new Coin(-135, 0));

        aw.addEntity(new Wall(81, 81, 140, -45));
        aw.addEntity(new Wall(-81, 81, 140, 45));
        aw.addEntity(new Wall(81, -81, 140, 45));
        aw.addEntity(new Wall(-81, -81, 140, -45));
    }
}
class L10 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-300, y:100});
        this.linePoints[0].push({x:-300, y:-100});
        this.normals.push([]);
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:1, y:0});

        this.linePoints.push([]);
        this.linePoints[1].push({x:300, y:100});
        this.linePoints[1].push({x:300, y:-100});
        this.normals.push([]);
        this.normals[1].push({x:-1, y:0});
        this.normals[1].push({x:-1, y:0});

        this.name = "LONG DISTANCE";
    }

    addItems()
    {
        aw.addEntity(new Coin(-50, 0));
        aw.addEntity(new Coin(50, 0));
        aw.addEntity(new Coin(100, 0));
        aw.addEntity(new Coin(-100, 0));
        aw.addEntity(new Coin(200, 0));
        aw.addEntity(new Coin(-200, 0));
        aw.addEntity(new Coin(250, 0));
        aw.addEntity(new Coin(-250, 0));

        aw.addEntity(new Wall(0, -100, 75, 90, 0, 0, 200, 1.0, 0.5));
        aw.addEntity(new Wall(-150, -100, 75, 90, 0, 0, 200, 1.5, 0.5));
        aw.addEntity(new Wall(150, -100, 75, 90, 0, 0, 200, 0.5, 0.5));
    }
}
class L11 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-300, y:0});
        this.linePoints[0].push({x:-225, y: 0});
        this.linePoints[0].push({x:-225, y: 50});
        this.linePoints[0].push({x:225, y: 50});
        this.linePoints[0].push({x:225, y: 0});
        this.linePoints[0].push({x:300, y: 0});
        this.linePoints[0].push({x:225, y: 0});
        this.linePoints[0].push({x:225, y: -50});
        this.linePoints[0].push({x:-225, y: -50});
        this.linePoints[0].push({x:-225, y: 0});

        this.name = "CIRCUIT";
    }

    addItems()
    {
        for (let i = 0; i < 6; i++)
        {
            aw.addEntity(new Coin(-125 + 50*i, 30));
            aw.addEntity(new Coin(-125 + 50*i, 0));
            aw.addEntity(new Coin(-125 + 50*i, -30));
        }

        aw.addEntity(new Wall(0, -50, 50, 90));
        aw.addEntity(new Wall(-50, 50, 50, 90));
        aw.addEntity(new Wall(50, 50, 50, 90));
        aw.addEntity(new Wall(-100, -50, 50, 90));
        aw.addEntity(new Wall(100, -50, 50, 90));
        aw.addEntity(new Wall(-150, 50, 50, 90));
        aw.addEntity(new Wall(150, 50, 50, 90));
    }
}
class L12 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-225, y:150});
        this.linePoints[0].push({x:-225, y:50});
        this.linePoints[0].push({x:-125, y:50});
        this.linePoints[0].push({x:-125, y:150});

        this.linePoints.push([]);
        this.linePoints[1].push({x:175, y:125});
        this.linePoints[1].push({x:175, y:75});
        this.linePoints[1].push({x:225, y:75});
        this.linePoints[1].push({x:225, y:125});

        this.linePoints.push([]);
        this.linePoints[2].push({x:150, y:-75});
        this.linePoints[2].push({x:150, y:-125});
        this.linePoints[2].push({x:200, y:-125});
        this.linePoints[2].push({x:200, y:-75});

        this.linePoints.push([]);
        this.linePoints[3].push({x:-200, y:-85});
        this.linePoints[3].push({x:-200, y:-110});
        this.linePoints[3].push({x:-175, y:-110});
        this.linePoints[3].push({x:-175, y:-85});

        this.name = "QUADS";
    }

    addItems()
    {
        for (let i = 0; i < 5; i++)
        {
            aw.addEntity(new Coin(-75 + i*50, 100));
        }

        for (let i = 0; i < 6; i++)
        {
            aw.addEntity(new Coin(-135 + i*50, -97.5));
        }

        for (let i = 0; i < 2; i++)
        {
            aw.addEntity(new Coin(-187.5, 10 - i*50));
        }

        for (let i = 0; i < 3; i++)
        {
            aw.addEntity(new Coin(187.5, 50 - i*50));
        }
    }
}
class L13 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-300, y:100});

        this.linePoints[0].push({x:-145, y:100});
        this.linePoints[0].push({x:-135, y:80});
        this.linePoints[0].push({x:-115, y:80});
        this.linePoints[0].push({x:-105, y:100});

        this.linePoints[0].push({x:105, y:100});
        this.linePoints[0].push({x:115, y:80});
        this.linePoints[0].push({x:135, y:80});
        this.linePoints[0].push({x:145, y:100});

        this.linePoints[0].push({x:300, y: 100});

        this.linePoints[0].push({x:300, y:20});
        this.linePoints[0].push({x:280, y:10});
        this.linePoints[0].push({x:280, y:-10});
        this.linePoints[0].push({x:300, y:-20});

        this.linePoints[0].push({x:300, y: -100});

        this.linePoints[0].push({x:145, y:-100});
        this.linePoints[0].push({x:135, y:-80});
        this.linePoints[0].push({x:115, y:-80});
        this.linePoints[0].push({x:105, y:-100});

        this.linePoints[0].push({x:-105, y:-100});
        this.linePoints[0].push({x:-115, y:-80});
        this.linePoints[0].push({x:-135, y:-80});
        this.linePoints[0].push({x:-145, y:-100});

        this.linePoints[0].push({x:-300, y: -100});

        this.linePoints[0].push({x:-300, y:-20});
        this.linePoints[0].push({x:-280, y:-10});
        this.linePoints[0].push({x:-280, y:10});
        this.linePoints[0].push({x:-300, y:20});

        this.name = "RAZOR";
    }

    addItems()
    {
        for (let i = 0; i < 10; i++)
        {
            aw.addEntity(new Coin(-225 + i*50, 0));
        }
        
        aw.addEntity(new Coin(-125, 40));
        aw.addEntity(new Coin(-125, -40));
        aw.addEntity(new Coin(125, 40));
        aw.addEntity(new Coin(125, -40));
    }
}
class L14 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.normals.push([]);
        let radius = 70;
        let numPoints = 45;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = i * angleStep;
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y});
        }

        this.linePoints.push([]);
        this.linePoints[1].push({x:-300, y:50});
        this.linePoints[1].push({x:-300, y:-50});
        this.normals.push([]);
        this.normals[1].push({x:1, y:0});
        this.normals[1].push({x:1, y:0});

        this.linePoints.push([]);
        this.linePoints[2].push({x:215, y:-135});
        this.linePoints[2].push({x:135, y:-215});
        this.normals.push([]);
        this.normals[2].push({x:-0.707, y:0.707});
        this.normals[2].push({x:-0.707, y:0.707});

        this.linePoints.push([]);
        this.linePoints[3].push({x:175, y:125});
        this.linePoints[3].push({x:125, y:175});
        this.normals.push([]);
        this.normals[3].push({x:-0.707, y:-0.707});
        this.normals[3].push({x:-0.707, y:-0.707});

        this.name = "ALIENS";
    }

    addItems()
    {
        aw.addEntity(new Coin(-112, 0));
        aw.addEntity(new Coin(-162, 0));
        aw.addEntity(new Coin(-212, 0));
        aw.addEntity(new Coin(-262, 0));

        aw.addEntity(new Coin(80, -80));
        aw.addEntity(new Coin(110, -110));
        aw.addEntity(new Coin(140, -140));

        aw.addEntity(new Coin(85, 85));
        aw.addEntity(new Coin(120, 120));

        aw.addEntity(new Wall(-188, 150, 75, 90, 0, 0, -300, 0.5, 0.5));
        aw.addEntity(new Wall(0, 205, 75, -45, 0, 215, -215, 0.5, 0.5));
    }
}
class L15 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-280, y:150});
        this.linePoints[0].push({x:-280, y: -150});
        this.linePoints[0].push({x:-260, y: -150});
        this.linePoints[0].push({x:-260, y: 150});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-100, y:100});
        this.linePoints[1].push({x:-100, y: -100});
        this.linePoints[1].push({x:-80, y: -100});
        this.linePoints[1].push({x:-80, y: 100});

        this.linePoints.push([]);
        this.linePoints[2].push({x:80, y:50});
        this.linePoints[2].push({x:80, y: -50});
        this.linePoints[2].push({x:100, y: -50});
        this.linePoints[2].push({x:100, y: 50});

        this.linePoints.push([]);
        this.linePoints[3].push({x:260, y:25});
        this.linePoints[3].push({x:260, y: -25});
        this.linePoints[3].push({x:280, y: -25});
        this.linePoints[3].push({x:280, y: 25});

        this.name = "BAR GAPS";
    }

    addItems()
    {
        aw.addEntity(new Coin(-130, 0));
        aw.addEntity(new Coin(-180, 0));
        aw.addEntity(new Coin(-230, 0));

        aw.addEntity(new Coin(-130, 80));
        aw.addEntity(new Coin(-180, 80));
        aw.addEntity(new Coin(-230, 80));

        aw.addEntity(new Coin(-130, -80));
        aw.addEntity(new Coin(-180, -80));
        aw.addEntity(new Coin(-230, -80));

        aw.addEntity(new Coin(-50, -30));
        aw.addEntity(new Coin(0, -30));
        aw.addEntity(new Coin(50, -30));

        aw.addEntity(new Coin(-50, 30));
        aw.addEntity(new Coin(0, 30));
        aw.addEntity(new Coin(50, 30));

        aw.addEntity(new Coin(130, 0));
        aw.addEntity(new Coin(180, 0));
        aw.addEntity(new Coin(230, 0));
    }
}
class L16 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-275, y:-200});
        this.linePoints[0].push({x:-250, y:-200});
        this.normals.push([]);
        this.normals[0].push({x:0, y: 1});
        this.normals[0].push({x:0, y: 1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-275, y:0});
        this.linePoints[1].push({x:-250, y:25});
        this.normals.push([]);
        this.normals[1].push({x:0.707, y: -0.707});
        this.normals[1].push({x:0.707, y: -0.707});

        this.linePoints.push([]);
        this.linePoints[2].push({x:-150, y:-200});
        this.linePoints[2].push({x:-25, y:-200});
        this.normals.push([]);
        this.normals[2].push({x:0, y: 1});
        this.normals[2].push({x:0, y: 1});

        this.linePoints.push([]);
        this.linePoints[3].push({x:-75, y:100});
        this.linePoints[3].push({x:-50, y:125});
        this.normals.push([]);
        this.normals[3].push({x:0.707, y: -0.707});
        this.normals[3].push({x:0.707, y: -0.707});

        this.linePoints.push([]);
        this.linePoints[4].push({x:160, y:-200});
        this.linePoints[4].push({x:285, y:-200});
        this.normals.push([]);
        this.normals[4].push({x:0, y: 1});
        this.normals[4].push({x:0, y: 1});

        this.linePoints.push([]);
        this.linePoints[5].push({x:160, y:180});
        this.linePoints[5].push({x:285, y:180});
        this.normals.push([]);
        this.normals[5].push({x:0, y: -1});
        this.normals[5].push({x:0, y: -1});

        this.levelTime = 12.0;
        this.timer = this.levelTime;

        this.name = "ZIG ZAG";
    }

    addItems()
    {
        for (let i = 0; i < 3; i++)
        {
            aw.addEntity(new Coin(-262, -150 + i*50));
        }

        for (let i = 1; i < 4; i++)
        {
            aw.addEntity(new Coin(-262 + i*50, 12 - i*50));
        }

        for (let i = 0; i < 5; i++)
        {
            aw.addEntity(new Coin(-62, -150 + i*50));
        }

        for (let i = 1; i < 6; i++)
        {
            aw.addEntity(new Coin(-62 + i*50, 112 - i*50));
        }

        for (let i = 0; i < 7; i++)
        {
            aw.addEntity(new Coin(222, -150 + i*50));
        }

        aw.addEntity(new Wall(-225, -75, 100, 0, -180));
        aw.addEntity(new Wall(-12, 0, 125, 0, 180));

        aw.addEntity(new Wall(222, 50, 100, 0, 0, -100, 0, 1.0, 0.5));
        aw.addEntity(new Wall(222, -50, 100, 0, 0, 100, 0, 1.0, 0.5));
    }
}
class L17 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        let radius = 300;
        let numPoints = 90;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints / 4; i++)
        {
            let angle = Math.PI*1.745 - (i * angleStep);
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y + 150});
        }

        this.linePoints[0].push({x:-50, y:150});
        this.linePoints[0].push({x:50, y:150});

        this.name = "SHELL";
    }

    addItems()
    {
        let xStart = -60;
        let yStart = 95;
        let stepSize = 50;
        let xStep = Math.cos(235 * Math.PI/180) * stepSize;
        let yStep = Math.sin(235 * Math.PI/180) * stepSize;
        for (let i = 0; i < 4; i++)
        {
            aw.addEntity(new Coin(-xStart - xStep*i, yStart + yStep*i));
            aw.addEntity(new Coin(xStart + xStep*i, yStart + yStep*i));
        }

        xStart = -17;
        yStart = 85;
        stepSize = 50;
        xStep = Math.cos(255 * Math.PI/180) * stepSize;
        yStep = Math.sin(255 * Math.PI/180) * stepSize;
        for (let i = 0; i < 4; i++)
        {
            aw.addEntity(new Coin(-xStart - xStep*i, yStart + yStep*i));
            aw.addEntity(new Coin(xStart + xStep*i, yStart + yStep*i));
        }

        aw.addEntity(new Wall(0, 0, 150, 90));
        aw.addEntity(new Wall(75, 20, 150, -60));
        aw.addEntity(new Wall(-75, 20, 150, 60));
    }
}
class L18 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-250, y:0});
        this.linePoints[0].push({x:-250, y:50});
        this.linePoints[0].push({x:250, y:50});
        this.linePoints[0].push({x:-250, y:50});
        this.normals.push([]);
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:0, y:-1});
        this.normals[0].push({x:0, y:-1});
        this.normals[0].push({x:1, y:0});

        this.linePoints.push([]);
        this.linePoints[1].push({x:250, y:0});
        this.linePoints[1].push({x:250, y:-50});
        this.linePoints[1].push({x:-250, y:-50});
        this.linePoints[1].push({x:250, y:-50});
        this.normals.push([]);
        this.normals[1].push({x:-1, y:0});
        this.normals[1].push({x:0, y:1});
        this.normals[1].push({x:0, y:1});
        this.normals[1].push({x:-1, y:0});

        this.name = "X FACTOR";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, -25));
        aw.addEntity(new Coin(0, 25));

        aw.addEntity(new Coin(100, -25));
        aw.addEntity(new Coin(100, 25));

        aw.addEntity(new Coin(-100, -25));
        aw.addEntity(new Coin(-100, 25));

        aw.addEntity(new Coin(200, -25));
        aw.addEntity(new Coin(200, 25));

        aw.addEntity(new Coin(-200, -25));
        aw.addEntity(new Coin(-200, 25));

        aw.addEntity(new Wall(200, 0, 80, 0, 270, -400, 0, 0.75, 0));
        aw.addEntity(new Wall(200, 0, 80, 90, 270, -400, 0, 0.75, 0));
    }
}
class L19 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-150, y:150});
        this.linePoints[0].push({x:-200, y:150});
        this.linePoints[0].push({x:-200, y:100});
        this.linePoints[0].push({x:-200, y:150});
        this.normals.push([]);
        this.normals[0].push({x:0, y:-1});
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:1, y:0});
        this.normals[0].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[1].push({x:-150, y:0});
        this.linePoints[1].push({x:-200, y:0});
        this.linePoints[1].push({x:-200, y:50});
        this.linePoints[1].push({x:-200, y:0});
        this.normals.push([]);
        this.normals[1].push({x:0, y:1});
        this.normals[1].push({x:1, y:0});
        this.normals[1].push({x:1, y:0});
        this.normals[1].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[2].push({x:150, y:50});
        this.linePoints[2].push({x:200, y:50});
        this.linePoints[2].push({x:200, y:0});
        this.linePoints[2].push({x:200, y:50});
        this.normals.push([]);
        this.normals[2].push({x:0, y:-1});
        this.normals[2].push({x:-1, y:0});
        this.normals[2].push({x:-1, y:0});
        this.normals[2].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[3].push({x:150, y:-100});
        this.linePoints[3].push({x:200, y:-100});
        this.linePoints[3].push({x:200, y:-50});
        this.linePoints[3].push({x:200, y:-100});
        this.normals.push([]);
        this.normals[3].push({x:0, y:1});
        this.normals[3].push({x:-1, y:0});
        this.normals[3].push({x:-1, y:0});
        this.normals[3].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[4].push({x:-150, y:-50});
        this.linePoints[4].push({x:-200, y:-50});
        this.linePoints[4].push({x:-200, y:-100});
        this.linePoints[4].push({x:-200, y:-50});
        this.normals.push([]);
        this.normals[4].push({x:0, y:-1});
        this.normals[4].push({x:1, y:0});
        this.normals[4].push({x:1, y:0});
        this.normals[4].push({x:0, y:-1});

        this.linePoints.push([]);
        this.linePoints[5].push({x:-150, y:-200});
        this.linePoints[5].push({x:-200, y:-200});
        this.linePoints[5].push({x:-200, y:-150});
        this.linePoints[5].push({x:-200, y:-200});
        this.normals.push([]);
        this.normals[5].push({x:0, y:1});
        this.normals[5].push({x:1, y:0});
        this.normals[5].push({x:1, y:0});
        this.normals[5].push({x:0, y:1});

        this.linePoints.push([]);
        this.linePoints[6].push({x:150, y:-200});
        this.linePoints[6].push({x:200, y:-200});
        this.linePoints[6].push({x:200, y:-150});
        this.linePoints[6].push({x:200, y:-200});
        this.normals.push([]);
        this.normals[6].push({x:0, y:1});
        this.normals[6].push({x:-1, y:0});
        this.normals[6].push({x:-1, y:0});
        this.normals[6].push({x:0, y:1});

        this.levelTime = 12.0;
        this.timer = this.levelTime;
        this.name = "SNAKE";
    }

    addItems()
    {
        aw.addEntity(new Coin(-175, 125));
        aw.addEntity(new Coin(-175, 75));
        aw.addEntity(new Coin(-175, 25));

        for (let i = 0; i < 7; i++)
        {
            aw.addEntity(new Coin(-125 + 50*i, 25));
            aw.addEntity(new Coin(-125 + 50*i, -75));
            aw.addEntity(new Coin(-125 + 50*i, -175));
        }

        aw.addEntity(new Coin(175, -25));
        aw.addEntity(new Coin(-175, -75));
        aw.addEntity(new Coin(-175, -125));
        aw.addEntity(new Coin(-175, -175));

        aw.addEntity(new Wall(0, -25, 150, 0, 180));
    }
}
class L20 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.linePoints[0].push({x:-100, y:100});
        this.linePoints[0].push({x:100, y: 100});
        this.linePoints[0].push({x:100, y: -100});
        this.linePoints[0].push({x:-100, y: -100});

        this.name = "REVENGE OF THE BOX";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 0));
        aw.addEntity(new Coin(-50, 0));
        aw.addEntity(new Coin(50, 0));
        aw.addEntity(new Coin(-25, 0));
        aw.addEntity(new Coin(25, 0));

        aw.addEntity(new Coin(0, 50));
        aw.addEntity(new Coin(-50, 50));
        aw.addEntity(new Coin(50, 50));
        aw.addEntity(new Coin(-25, 50));
        aw.addEntity(new Coin(25, 50));

        aw.addEntity(new Coin(0, -50));
        aw.addEntity(new Coin(-50, -50));
        aw.addEntity(new Coin(50, -50));
        aw.addEntity(new Coin(-25, -50));
        aw.addEntity(new Coin(25, -50));

        aw.addEntity(new Wall(-32, 32, 50, 0, 180));
        aw.addEntity(new Wall(38, -50, 50, 90, 0, 0, 50, 1.0, 0.5));
    }
}
class Aw
{
    //////////////////////////
    //-------- CORE --------//
    //////////////////////////

    constructor(width, height, scale, assetList)
    {
        this.initDisplay(width, height, scale);
        this.initEntities();
        this.initInput();
        this.initAudio();

        this.loadAssets(assetList);

        this.gameLoop(performance.now());
    }

    initDisplay(width, height, scale)
    {
        this.canvas = document.createElement("canvas");
        this.canvas.setAttribute("width", width);
        this.canvas.setAttribute("height", height);
        this.canvas.style.width = `${width * scale}px`;
        this.canvas.style.height = `${height * scale}px`;
        this.canvas.style.backgroundColor = "black";
        //this.canvas.style["image-rendering"] = "pixelated";
        document.getElementById("game").appendChild(this.canvas);

        this.ctx = this.canvas.getContext('2d');
        this.width = width;
        this.height = height;
        this.scale = scale;
    }

    loadAssets(assetList)
    {
        this.assets = {};

        assetList.forEach(assetName =>
        {
            this.assets[assetName] = {};
            this.assets[assetName].loaded = false;

            if (assetName.endsWith(".png") || assetName.endsWith(".jpg"))
            {
                this.assets[assetName].data = new Image();
                this.assets[assetName].data.onload = () => this.assets[assetName].loaded = true;
                this.assets[assetName].data.src = assetName;
            }
            else if (assetName.endsWith(".wav") || assetName.endsWith(".mp3"))
            {
                this.assets[assetName].data = new Audio();
                //this.assets[assetName].data.addEventListener("load", () => this.assets[assetName].loaded = true, true);
                this.assets[assetName].data.src = assetName;
                this.assets[assetName].data.load();
                this.assets[assetName].loaded = true;
            }
            else
            {
                console.assert(false, `Unable to load ${assetName} - unknown type`);
            }
        });
    }

    isLoading()
    {
        return Object.keys(this.assets).length > 0 && Object.values(this.assets).every(asset => asset.loaded) == false;
    }

    getAsset(assetName)
    {
        console.assert(this.assets[assetName] !== undefined, `No asset loaded named '${assetName}'`);
        return this.assets[assetName].data;
    }

    gameLoop(curTime)
    {
        window.requestAnimationFrame(this.gameLoop.bind(this));
        
        if (this.isLoading()) { return; }

        let deltaTime = Math.min((curTime - (this.lastTime || curTime)) / 1000.0, 0.2);  // Cap to 200ms (5fps)
        this.lastTime = curTime;

        this.ctx.clearRect(-this.width, -this.height, this.width*2.0, this.height*2.0);

        if (this.state !== undefined)
        {
            this.state(deltaTime);
        }

        this.sortEntities();
        this.updateEntities(deltaTime);
        this.renderEntities();

        if (this.statePost !== undefined)
        {
            this.statePost(deltaTime);
        }

        this.postUpdateInput();
    }

    //////////////////////////
    //------ ENTITIES ------//
    //////////////////////////

    initEntities()
    {
        this.entities = [];
        this.entitiesNeedSorting = false;
        this.entitiesNeedRemoval = false;
    }

    addEntity(entity)
    {
        Object.defineProperty(entity, "z",
        {
            set: (value) =>
            {
                entity._z = value;
                this.entitiesNeedSorting = true;
            },
            get: () => { return entity._z; }
        });
        entity._z = this.entities.length > 0 ? this.entities[this.entities.length - 1].z + 1 : 0;

        this.entities.push(entity);
    }

    removeEntity(entity)
    {
        entity._remove = true;
        this.entitiesNeedRemoval = true;
    }

    updateEntities(deltaTime)
    {
        this.entities.forEach(entity =>
        {
            if (entity.update !== undefined) { entity.update(deltaTime); }
        });

        if (this.entitiesNeedRemoval)
        {
            this.entities = this.entities.filter(entity => entity._remove !== true);
            this.entitiesNeedRemoval = false;
        }
    }

    renderEntities()
    {
        this.entities.forEach(entity =>
        {
            if (entity.render !== undefined) { entity.render(); }
        });
    }

    sortEntities()
    {
        if (this.entitiesNeedSorting)
        {
            // Higher values update/render later than lower values
            this.entities.sort((entity1, entity2) => entity1.z - entity2.z);
            this.entitiesNeedSorting = false;
        }
    }

    clearAllEntities()
    {
        this.entities = [];
    }

    //////////////////////////
    //----- RENDERING ------//
    //////////////////////////

    drawSprite(params)
    {
        // Assumes name, x, and y are defined in params
        let image = this.getAsset(params.name);
        let angle = params.angle !== undefined ? params.angle : 0;
        let width = params.xScale !== undefined ? image.width * params.xScale : image.width;
        let height = params.yScale !== undefined ? image.height * params.yScale : image.height;

        this.ctx.save();
        this.ctx.translate(params.x, params.y);
        this.ctx.rotate(angle * Math.PI/180);
        this.ctx.drawImage(image, -width * 0.5, -height * 0.5, width, height);
        this.ctx.restore();
    }

    drawText(params)
    {
        // Assumes text, x, and y are defined in params
        let angle = params.angle !== undefined ? params.angle * Math.PI/180 : 0;
        let fontName = params.fontName !== undefined ? params.fontName : "Arial";
        let fontSize = params.fontSize !== undefined ? params.fontSize : 12;
        let fontStyle = params.fontStyle !== undefined ? params.fontStyle : "";
        let fillStyle = params.color !== undefined ? params.color : "#FFF";
        let textAlign = params.textAlign !== undefined ? params.textAlign.toLowerCase() : "left";
        let textBaseline = params.textBaseline !== undefined ? params.textBaseline.toLowerCase() : "bottom";

        this.ctx.save();
        this.ctx.translate(params.x, params.y);
        this.ctx.rotate(angle);
        this.ctx.font = `${fontStyle} ${fontSize}px ${fontName}`;
        this.ctx.fillStyle = fillStyle;
        this.ctx.textAlign = textAlign;
        this.ctx.textBaseline = textBaseline;
        this.ctx.fillText(params.text, 0, 0);
        this.ctx.restore();
    }

    ///////////////////////////
    //-------- AUDIO --------//
    ///////////////////////////

    initAudio()
    {
        this.soundOn = true;

        this.notes =
        {
            "c": 16.35,
            "c#": 17.32,
            "d": 18.35,
            "d#": 19.45,
            "e": 20.60,
            "f": 21.83,
            "f#": 23.12,
            "g": 24.50,
            "g#": 25.96,
            "a": 27.50,
            "a#": 29.14,
            "b": 30.87,
        }

        window.addEventListener('click', () =>
        {
            this.createAudioContext();
        });
    }

    createAudioContext()
    {
        if (!this.audioCtx)
        {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();

            let bufferSize = 2 * this.audioCtx.sampleRate * 6;
            this.noiseBuffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
            this.noiseOutput = this.noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++)
            {
                this.noiseOutput[i] = -1.0 + Math.random() * 2;
            }
        }
        else
        {
            this.audioCtx.resume();
        }
    }

    playAudio(name, loop)
    {
        if (!this.soundOn || !this.audioCtx)
        {
            return;
        }

        this.getAsset(name).loop = loop !== undefined ? loop : false;
        this.getAsset(name).play();
    }

    stopAudio(name)
    {
        this.getAsset(name).pause();
        this.getAsset(name).currentTime = 0;
    }

    playNote(note, octave, length, delay, type)
    {
        if (!this.soundOn || !this.audioCtx)
        {
            return;
        }

        let oscillator = this.audioCtx.createOscillator();
        let noteFrequency = this.notes[note.toLowerCase()];
        if (octave !== undefined)
        {
            noteFrequency *= Math.pow(2, octave);
        }

        oscillator.type = type !== undefined ? type : "sine";
        oscillator.frequency.setValueAtTime(noteFrequency, this.audioCtx.currentTime);

        if (length !== undefined)
        {
            length *= 2;
        }

        if (delay !== undefined)
        {
            delay *= 2;
        }
        
        oscillator.connect(this.audioCtx.destination);
        oscillator.start(this.audioCtx.currentTime + (delay !== undefined ? delay : 0));
        oscillator.stop(this.audioCtx.currentTime + (delay !== undefined ? delay : 0) + (length !== undefined ? length : 0.2));
    }

    playNoise(length, delay)
    {
        if (!this.soundOn || !this.audioCtx)
        {
            return;
        }

        let whiteNoise = this.audioCtx.createBufferSource();
        whiteNoise.buffer = this.noiseBuffer;
        whiteNoise.loop = true;
        whiteNoise.start(this.audioCtx.currentTime + (delay !== undefined ? delay : 0));
        whiteNoise.stop(this.audioCtx.currentTime + (delay !== undefined ? delay : 0) + (length !== undefined ? length : 0.2));

        whiteNoise.connect(this.audioCtx.destination);
    }

    ///////////////////////////
    //-------- INPUT --------//
    ///////////////////////////

    initInput()
    {
        this.mousePos = {x: 0, y: 0};
        this.mouseDelta = {x: 0, y: 0};
        this.mouseLeftButton = false;
        this.mouseRightButton = false;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;
        this.mouseLeftButtonJustUp = false;

        this.canvas.addEventListener("mousedown", e =>
        {
            if (e.button === 0) { this.mouseLeftButton = true; this.mouseLeftButtonJustPressed = true; }
            else if (e.button === 2) { this.mouseRightButton = true; this.mouseRightButtonJustPressed = true; }
            this.setTouchPos(e);
            e.preventDefault();
        }, true);

        this.canvas.addEventListener("mouseup", e =>
        {
            if (e.button === 0) { this.mouseLeftButton = false; this.mouseLeftButtonJustUp = true; }
            else if (e.button === 2) { this.mouseRightButton = false; }
            e.preventDefault();
        }, true);

        this.canvas.addEventListener("mousemove", e =>
        {
            this.mouseDelta.x += e.movementX;
            this.mouseDelta.y += e.movementY;
            this.setTouchPos(e);
            e.preventDefault();
        }, true );

        this.canvas.addEventListener("touchstart", e =>
        {
            this.mouseLeftButton = true;
            this.mouseLeftButtonJustPressed = true;
            this.setTouchPos(e.touches[0]);
            e.preventDefault();
        }, true );

        this.canvas.addEventListener("touchend", e =>
        {
            this.mouseLeftButton = false;
            this.mouseLeftButtonJustPressed = false;
            this.mouseLeftButtonJustUp = true;
            e.preventDefault();
        }, true );

        this.canvas.addEventListener("touchcancel", e =>
        {
            this.mouseLeftButton = false;
            this.mouseLeftButtonJustPressed = false
            this.mouseLeftButtonJustUp = true;
            e.preventDefault();
        }, true );

        this.canvas.addEventListener("touchmove", e =>
        {
            this.setTouchPos(e.touches[0]);
            e.preventDefault();
        }, true );

        this.keyToName =
        {
            "a": "a", "b": "b", "c": "c", "d": "d", "e": "e", "f": "f", "g": "g", "h": "h", "i": "i",
            "j": "j", "k": "k", "l": "l", "m": "m", "n": "n", "o": "o", "p": "p", "q": "q", "r": "r",
            "s": "s", "t": "t", "u": "u", "v": "v", "w": "w", "x": "x", "y": "y", "z": "z",
            "0": "zero", "1": "one", "2": "two", "3": "three", "4": "four", "5": "five", "6": "six", "7": "seven", "8": "eight", "9": "nine",
            "arrowup": "up", "arrowdown": "down", "arrowleft": "left", "arrowright": "right", " ": "space", "escape": "escape",
            "control": "ctrl", "shift": "shift", "alt": "alt", "tab": "tab", "enter": "enter", "backspace": "backspace"
        };

        this.keys = {};
        this.keysJustPressed = {};
        Object.keys(this.keyToName).forEach(key => this.keys[key] = false);

        window.addEventListener("keydown", e =>
        {
            this.setKeyState(e, true);
        });

        window.addEventListener("keyup", e =>
        {
            this.setKeyState(e, false);
        });
    }

    setTouchPos(e)
    {
        this.mousePos = {x: e.pageX - this.canvas.offsetLeft, y: e.pageY - this.canvas.offsetTop};
    }

    setKeyState(event, isOn)
    {
        let keyCode = event.key.toLowerCase();
        if (this.keyToName[keyCode] !== undefined)
        {
            let keyName = this.keyToName[keyCode];
            this.keysJustPressed[keyName] = this.keys[keyName] === false || this.keys[keyName] === undefined;
            this.keys[keyName] = isOn;
            
            // Hack: prevent arrow keys from scrolling the page
            if (keyName === "up" || keyName === "down" || keyName === "left" || keyName === "right")
            {
                event.preventDefault();
            }
        }
    }

    postUpdateInput()
    {
        this.mouseDelta.x = 0.0;
        this.mouseDelta.y = 0.0;
        this.mouseLeftButtonJustPressed = false;
        this.mouseRightButtonJustPressed = false;
        this.mouseLeftButtonJustUp = false;

        Object.keys(this.keysJustPressed).forEach(key =>
        {
            this.keysJustPressed[key] = false;
        });
    }
}
var screenWidth = 640;
var screenHeight = 480;
var screenScale = 1.0;

var aw = new Aw(screenWidth, screenHeight, screenScale, []);
aw.state = init;

var level;
var player;
var levelIdx = 0;
var endLevelTime = 0;
var lives = 5;
var difficultyMode = 0;

function init(deltaTime)
{
    renderBackgroundSpeedLines(deltaTime);

    if (aw.mouseLeftButtonJustUp)
    {
        aw.state = mainMenu;
        aw.mouseLeftButtonJustPressed = false;
        aw.mouseLeftButtonJustUp = false;

        aw.playNote("a", 4, 0.05, 0.0);
        aw.playNote("b", 4, 0.05, 0.05);
    }

    // Click to play
    aw.ctx.shadowBlur = 20;
    aw.ctx.shadowColor = "#08F";
    aw.drawText({text:"CLICK TO PLAY", x:screenWidth*0.5, y:screenHeight*0.5, fontSize:20, fontStyle:"bold", color:"#08F", textAlign:"center"});
}