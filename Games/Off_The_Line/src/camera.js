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