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