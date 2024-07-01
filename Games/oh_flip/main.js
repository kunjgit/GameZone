// System
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d", { alpha: false });
let canvasWidthScaled = canvas.width;
let canvasHeightScaled = canvas.height;
let lastFrameTime;
let actualWidth = -1;
let actualHeight = -1;

// Player
let playerX = 0;
let playerY = 0;
let playerVel = 0;
let playerAngle = 0;
let gravity = -1400;
let bounceVelMin = 1000;
let bounceVel = bounceVelMin;
let bounceVelHitIncrease = 120;
let bounceVelMissDecrease = 120;
let flipAngleVel = 0;
let uprightFix = false;
let totalAngleDeltaThisBounce = 0;
let blinkDelay = 3.0;
let blinkTime = 0.5;
let fallOut = false;
let fallOutTime = 0.0;
let fallOutLeft = false;
let totalFlips = 0;
let flipsThisBounce = 0;
let flipsLandedThisBounce = 0;
let flipsBeforePeak = 0;
let flipsAfterPeak = 0;
let perfectJump = false;
let didAFlipStreak = 0;
let perfectStreak = 0;
let didLandOnHead = false;
let maxHeightThisBounce = 0;

// Trampoline
let trampShakeAmount = 0;
let trampShakeDecayPct = 0.9;
let trampShakeAngle = 0;
let trampShakeAngleSpeed = 4000.0;

// Camera
let camScale = 0.7;
let camDecayDelay = 0;
let camScaleBounce = 0.0;
let camScaleBounceDecayPct = 0.8;

// Input
let touch = false
let touchX = 0;
let touchY = 0;

// Menu
let mainMenu = true;
let mainMenuTouch = false;

// UI
let popups = [];

// Goals
let goals = [];
let goalIdx = parseInt(localStorage.getItem("ohflip.goalIdx")) || 0;
goals.push({text: "Do a flip", func: DidAFlipThisBounce, param: 1});
goals.push({text: "Land 2 flips in a row", func: FlipStreakCheck, param: 2});
goals.push({text: "Land perfectly", func: LandedPerfectly, param: 1});
goals.push({text: "Reach a height of 20 ft", func: ReachedHeight, param: 20});
goals.push({text: "Do a double flip", func: DidAFlipThisBounce, param: 2});
goals.push({text: "Land 3 flips in a row", func: FlipStreakCheck, param: 3});
goals.push({text: "Land on your head", func: LandedOnHead, param: 1});
goals.push({text: "Do a triple flip", func: DidAFlipThisBounce, param: 3});
goals.push({text: "Land perfectly 2 times in a row", func: PerfectStreakCheck, param: 2});
goals.push({text: "Reach a height of 50 ft", func: ReachedHeight, param: 5});
goals.push({text: "Land 4 flips in a row", func: FlipStreakCheck, param: 4});
goals.push({text: "Do a quad flip", func: DidAFlipThisBounce, param: 4});
goals.push({text: "Land 5 flips in a row", func: FlipStreakCheck, param: 5});
goals.push({text: "Land perfectly 3 times in a row", func: PerfectStreakCheck, param: 3});
goals.push({text: "Reach a height of 100 ft", func: ReachedHeight, param: 10});
goals.push({text: "Do a x5 flip", func: DidAFlipThisBounce, param: 5});
goals.push({text: "Land 10 flips in a row", func: FlipStreakCheck, param: 10});
goals.push({text: "Reach a height of 250 ft", func: ReachedHeight, param: 250});
goals.push({text: "Land perfectly 5 times in a row", func: PerfectStreakCheck, param: 5});
goals.push({text: "Do a x10 flip", func: DidAFlipThisBounce, param: 7});
goals.push({text: "Reach a height of 500 ft", func: ReachedHeight, param: 500});
let goalCompleteTime = 0.0;

document.addEventListener("mousedown", e => { touch = true; SetTouchPos(e); }, false);
document.addEventListener("mouseup", e => { touch = false; SetTouchPos(e); }, false);
document.addEventListener("touchstart", e => { touch = true; SetTouchPos(e); e.preventDefault(); }, false );
document.addEventListener("touchend", e => { touch = false; SetTouchPos(e); e.preventDefault(); }, false );
document.addEventListener("touchcancel", e => { touch = false; SetTouchPos(e); e.preventDefault(); }, false );
document.addEventListener("keydown", e =>
{
    if (e.altKey && e.code === "KeyR")
    {
        localStorage.setItem("ohflip.maxHeightFt", 0);
        localStorage.setItem("ohflip.maxTotalFlips", 0);
        localStorage.setItem("ohflip.goalIdx", 0);
        goalIdx = 0;
    }
});

function SetTouchPos(event)
{
    touchX = event.pageX - canvas.offsetLeft;
    touchY = event.pageY - canvas.offsetTop;
}

function Reset()
{
    playerX = 0;
    playerY = 0;
    bounceVel = bounceVelMin;
    playerVel = bounceVel;
    playerAngle = 0;
    flipAngleVel = 0;
    uprightFix = false;
    totalAngleDeltaThisBounce = 0;
    trampShakeAmount = 0;
    trampShakeAngle = 0;
    camScale = 0.7;
    camDecayDelay = 0;
    fallOut = false;
    totalFlips = 0;
    flipsThisBounce = 0;
    flipsLandedThisBounce = 0;
    goalCompleteTime = 0.0;
    flipsBeforePeak = 0;
    flipsAfterPeak = 0;
    perfectJump = false;
    didAFlipStreak = 0;
    perfectStreak = 0;
    didLandOnHead = false;
    maxHeightThisBounce = 0;
}

function GameLoop(curTime)
{
    let dt = Math.min((curTime - (lastFrameTime || curTime)) / 1000.0, 0.2);  // Cap to 200ms (5fps)
    lastFrameTime = curTime;

    //FitToScreen();

    UpdateUI(dt);
    UpdatePlayer(dt);
    UpdateCamera(dt);
    UpdateTrampoline(dt);

    // Clear background
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#AADDFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // Set camera scale
    ctx.save();
    ctx.scale(camScale + camScaleBounce, camScale + camScaleBounce);
    canvasWidthScaled = canvas.width/(camScale + camScaleBounce);
    canvasHeightScaled = canvas.height/(camScale + camScaleBounce);
    ctx.translate((canvasWidthScaled - canvas.width)*0.5, (canvasHeightScaled - canvas.height));

    // Draw everything
    DrawTrampoline();
    DrawPlayer();
    DrawUI();

    ctx.restore();
    window.requestAnimationFrame(GameLoop);
}

function UpdatePlayer(dt)
{
    let playerTouch = touch && !mainMenuTouch;

    // Falling out?
    if (fallOut)
    {
        let fallOutPct = fallOutTime / 1.0;
        playerX = Math.cos(fallOutPct * Math.PI * 0.5) * 400.0 * (fallOutLeft ? -1.0 : 1.0) * bounceVel*0.001;
        playerY = Math.sin(fallOutPct * Math.PI) * 200.0 * bounceVel*0.001;
        playerAngle += 800.0 * dt * (fallOutLeft ? -1.0 : 1.0);

        fallOutTime -= dt;
        if (fallOutTime <= 0.0)
        {
            Reset();
        }
        return;
    }

    // Flipping?
    if (playerTouch && playerY > 100)
    {
        uprightFix = false;
        flipAngleVel += (720.0 - flipAngleVel)*0.1;
    }
    // Not flipping
    else
    {
        if (uprightFix)
        {
            playerAngle *= 0.8;
            if (Math.abs(playerAngle) < 0.01)
            {
                uprightFix = false;
            }
        }

        flipAngleVel *= 0.7;
    }

    // Calculate flips
    let prevPlayerAngle = playerAngle;
    playerAngle += flipAngleVel * dt;
    totalAngleDeltaThisBounce += playerAngle - prevPlayerAngle;
    let prevFlipsThisBounce = flipsThisBounce;
    flipsThisBounce = Math.floor((totalAngleDeltaThisBounce + 90.0) / 360.0);
    if (flipsThisBounce > prevFlipsThisBounce)
    {
        AddPopup(canvas.width*0.5 + 100, canvas.height - 200, `x${flipsThisBounce}`, "#D37CFF");

        if (playerVel > 0.0)
        {
            flipsBeforePeak++;
        }
    }

    // Clamp angle to -180 -> 180
    if (playerAngle >= 180.0)
    {
        playerAngle -= 360.0;
    }
    else if (playerAngle < -180.0)
    {
        playerAngle += 360;
    }

    // Move player
    playerVel += gravity * dt;
    playerY += playerVel * dt;
    maxHeightThisBounce = Math.max(playerY, maxHeightThisBounce);

    // Hit trampoline?
    if (playerY <= 0.0)
    {
        // Start trampoline shake
        trampShakeAmount = 16.0;
        trampShakeAngle = 0;

        // Fall out?
        if (Math.abs(playerAngle) > 30.0)
        {
            fallOut = true;
            fallOutTime = 1.0;
            fallOutLeft = Math.random() < 0.5;

            AddPopup(canvas.width*0.5 + 100, canvas.height - 100, "miss", "#F42");

            if (Math.abs(playerAngle) > 145.0)
            {
                didLandOnHead = true;
            }
        }
        else
        {
            // Set bounce velocity
            let didAFlip = totalAngleDeltaThisBounce >= 270;
            perfectJump = Math.abs(playerAngle) < 6.5;
            if (didAFlip)
            {
                let flipMult = 1.0 + (flipsThisBounce / 5)*0.5;
                let bounceVelIncrease = perfectJump ? (bounceVelHitIncrease * 1.5) : bounceVelHitIncrease;
                bounceVel += bounceVelIncrease * flipMult;
            }
            else
            {
                bounceVel = Math.max(bounceVel - bounceVelMissDecrease, bounceVelMin);
            }

            if (didAFlip && perfectJump && !mainMenu)
            {
                camScaleBounce = 0.025;
            }

            if (didAFlip)
            {
                flipsLandedThisBounce = flipsThisBounce;
                totalFlips += flipsThisBounce;
                didAFlipStreak++;
                if (perfectJump)
                {
                    perfectStreak++;
                }

                if (perfectJump)
                {
                    AddPopup(canvas.width*0.5 + 100, canvas.height - 100, "perfect!", "#FF0");
                }
                else
                {
                    AddPopup(canvas.width*0.5 + 100, canvas.height - 100, "good", "#0F4");
                }
            }
            else
            {
                didAFlipStreak = 0;
                perfectStreak = 0;
            }
        }

        CheckGoals();

        // Reset for new bounce
        playerY = 0.0;
        playerVel = bounceVel;
        uprightFix = true;
        totalAngleDeltaThisBounce = 0;
        flipsLandedThisBounce = 0;
        flipsThisBounce = 0;
        flipsBeforePeak = 0;
        flipsAfterPeak = 0;
        didLandOnHead = false;
        maxHeightThisBounce = 0;
    }

    // Update blink
    blinkDelay -= dt;
    blinkTime -= dt;
    if (blinkDelay <= 0.0)
    {
        blinkDelay = 1.0 + (Math.random()*3.0);
        blinkTime = 0.1 + (Math.random()*0.1);
    }
}

function UpdateCamera(dt)
{
    // Calculate desired scale
    let desiredCamScale = (280.0 / Math.max(playerY, 280.0)) * 1.5;
    if (desiredCamScale < camScale)
    {
        camDecayDelay = 3.0;
    }
    else
    {
        camDecayDelay -= dt;
    }
    desiredCamScale = Math.min(camScale, desiredCamScale);
    if (desiredCamScale < 0.5)
    {
        desiredCamScale = Math.pow(desiredCamScale, 0.97);
    }

    // Lerp to it
    camScale += (desiredCamScale - camScale) * 0.2;

    // Lerp out after hold delay is over
    if (camDecayDelay <= 0.0)
    {
        camScale += (0.7 - camScale) * 0.001;
    }

    camScaleBounce *= camScaleBounceDecayPct;
}

function UpdateTrampoline(dt)
{
    // Update shake
    trampShakeAmount *= trampShakeDecayPct;
    trampShakeAngle += trampShakeAngleSpeed * dt;
}

function UpdateUI(dt)
{
    // Main menu touch logic
    if (touch)
    {
        if (!mainMenuTouch)
        {
            if (mainMenu)
            {
                mainMenuTouch = true;
            }
            mainMenu = false;
        }

        // Reset game?
        if (goalIdx === goals.length &&
            touchX > canvas.width * 0.5 &&
            touchY < 75.0)
        {
            localStorage.setItem("ohflip.goalIdx", 0);
            goalIdx = 0;
            Reset();
            mainMenu = true;
            mainMenuTouch = true;
        }
    }
    else
    {
        mainMenuTouch = false;
    }

    // Update popups
    popups.forEach((popup, index, object) =>
    {
        popup.time += dt;
        if (popup.time >= 0.5)
        {
            object.splice(index, 1);
        }
    });

    // Update goal transition logic
    if (goalCompleteTime > 0.0)
    {
        goalCompleteTime -= dt;
        if (goalCompleteTime <= 0.0)
        {
            goalIdx++;
            localStorage.setItem("ohflip.goalIdx", goalIdx);
        }
    }
}

function DrawLine(x1, y1, x2, y2, color, width)
{
    ctx.save();
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.restore();
}

function DrawRectangle(width, height, color)
{
    let halfWidth = width * 0.5;
    let halfHeight = height * 0.5;

    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(-halfWidth, -halfHeight);
    ctx.lineTo(halfWidth, -halfHeight);
    ctx.lineTo(halfWidth, halfHeight);
    ctx.lineTo(-halfWidth, halfHeight);
    ctx.lineTo(-halfWidth, -halfHeight);
    ctx.fill();
    ctx.restore();
}

function DrawText(text, x, y, angle, size, align, color)
{
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.font = `bold ${size}px Arial`;
    ctx.fillStyle = color;
    ctx.textAlign = align.toLowerCase();
    ctx.fillText(text, 0, 0);
    ctx.restore();
}

function DrawTrampoline()
{
    ctx.save();
    ctx.translate(canvas.width * 0.5, canvas.height - 120);

    DrawRectangle(canvasWidthScaled, 240, "#00D846");   // Grass
    DrawLine(-196, -20, -196, 80, "#000", 12);          // Left pole
    DrawLine(196, -20, 196, 80, "#000", 12);            // Right pole
    ctx.translate(0, Math.sin(trampShakeAngle * Math.PI/180.0) * trampShakeAmount);
    DrawLine(-200, 0, 200, 0, "#000", 12);              // Mesh

    ctx.restore();
}

function DrawPlayer()
{
    ctx.save();
    ctx.translate(canvas.width * 0.5 + playerX, (canvas.height - 170) - playerY);
    ctx.rotate(playerAngle * Math.PI/180.0);

    ctx.translate(0, -40);
    DrawRectangle(80, 96, "#FF9600");       // Head
    ctx.save();
    if (blinkTime > 0.0 || fallOut)
    {
        ctx.translate(-4, 4);
        DrawRectangle(40, 40, "#000");      // Eye
        ctx.translate(4, 4);
        DrawRectangle(34, 34, "#FF9600");   // Eye
        ctx.translate(-12, 0);
    }
    else
    {
        ctx.translate(-4, 4);
        DrawRectangle(40, 40, "#FFF");      // Eye
        let pupilOffset = Math.max(Math.min((playerVel / 1000), 1.0), 0.0) * 7.0;
        ctx.translate(-8, 4 - pupilOffset);
        DrawRectangle(16, 24, "#000");      // Pupil
    }
    ctx.restore();

    ctx.translate(-4, 4);
    if (!touch || mainMenuTouch)
    {
        ctx.translate(8, 40);
        DrawLine(0, 0, 0, 60, "#000", 8);   // Leg
    }
    else
    {
        ctx.translate(8, 40);
        DrawLine(0, 0, -30, 20, "#000", 8); // Leg (upper)
        DrawLine(-30, 20, 0, 40, "#000", 8);// Leg (lower)
    }

    ctx.restore();
}

function DrawUI()
{
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (mainMenu)
    {
        let titleTxt = "oh, flip!";
        DrawText(titleTxt, canvas.width*0.5, 160, -5*Math.PI/180.0, 170, "center", "#000");
        DrawText(titleTxt, (canvas.width*0.5) - 10, 155, -5*Math.PI/180.0, 170, "center", "#FF9600");

        let subtitleTxt = "a game about backflips";
        DrawText(subtitleTxt, (canvas.width*0.5), 240, -5*Math.PI/180.0, 50, "center", "#000");
        DrawText(subtitleTxt, (canvas.width*0.5) - 4, 235, -5*Math.PI/180.0, 50, "center", "#FFF");

        let instructionsTxt = "land flips to gain height - complete goals to feel good";
        DrawText(instructionsTxt, (canvas.width*0.5), canvas.height - 20, 0.0, 25, "center", "#000");
        DrawText(instructionsTxt, (canvas.width*0.5) - 3, canvas.height - 23, 0.0, 25, "center", "#FFF");
    }
    else
    {
        let heightFt = Math.floor(playerY / 40.0);
        let maxHeightFt = localStorage.getItem("ohflip.maxHeightFt");
        if (maxHeightFt === null || heightFt > maxHeightFt)
        {
            localStorage.setItem("ohflip.maxHeightFt", heightFt);
            maxHeightFt = heightFt;
        }

        let heightTxt = `Height: ${heightFt} ft (Best: ${maxHeightFt} ft)`;
        DrawText(heightTxt, 12, 27, 0.0, 20, "left", "#000");
        //DrawText(heightTxt, 18, 28, 0.0, 25, "left", "#AAF");

        let maxTotalFlips = localStorage.getItem("ohflip.maxTotalFlips");
        if (maxTotalFlips === null || totalFlips > maxTotalFlips)
        {
            localStorage.setItem("ohflip.maxTotalFlips", totalFlips);
            maxTotalFlips = totalFlips;
        }

        let flipsTxt = `Flips: ${totalFlips} (Best: ${maxTotalFlips})`;
        DrawText(flipsTxt, 12, 50, 0.0, 20, "left", "#000");
        //DrawText(flipsTxt, 18, 60, 0.0, 25, "left", "#FFF");

        let goalTextColor = "#000";
        if (goalCompleteTime > 0.0)
        {
            goalTextColor = (goalCompleteTime % 0.15 < 0.075) ? "#000" : "#00FF00";
        }

        if (goalIdx < goals.length)
        {
            DrawText(`Goal #${goalIdx + 1}:`, canvas.width - 12, 27, 0.0, 20, "right", goalTextColor);
            DrawText(goals[goalIdx].text, canvas.width - 12, 50, 0.0, 20, "right", goalTextColor);
        }
        else
        {
            goalTextColor = (Date.now() % 800 < 400) ? "#000" : "#FF9600";

            DrawText(`Congratulations! You've completed all goals!`, canvas.width - 12, 27, 0.0, 20, "right", goalTextColor);
            DrawText("Press here to reset and play again!", canvas.width - 12, 50, 0.0, 20, "right", goalTextColor);
        }
    }

    // Draw popups
    popups.forEach(popup =>
    {
        let popupPct = Math.min(popup.time / 0.1, 1.0);
        let offsetAnglePct = Math.min(popup.time / 0.4, 1.0);
        let xOffset = Math.sin(offsetAnglePct * Math.PI * 0.5) * 25.0;
        let yOffset = Math.sin(offsetAnglePct * Math.PI * 0.5) * 50.0;
        let startSize = popup.smallSize ? 20 : 30;
        let sizeMult = popup.smallSize ? 10 : 25;
        DrawText(popup.text, popup.x + xOffset, popup.y - yOffset, -5*Math.PI/180.0, startSize + Math.sin(popupPct * Math.PI * 0.75) * sizeMult, "center", "#000");
        DrawText(popup.text, (popup.x + xOffset) - 3, (popup.y - yOffset) - 3, -5*Math.PI/180.0, startSize + Math.sin(popupPct * Math.PI * 0.75) * sizeMult, "center", popup.color);
    });

    ctx.restore();
}

function AddPopup(x, y, text, color, smallSize)
{
    popups.push({x: x, y: y, text: text, color: color, time: 0.0, smallSize: smallSize || false });
}

function FitToScreen()
{
    let aspectRatio = canvas.width / canvas.height;
    let newWidth = window.innerWidth;
    let newHeight = window.innerWidth / aspectRatio;

    if (newHeight > window.innerHeight)
    {
        newHeight = window.innerHeight;
        newWidth = newHeight * aspectRatio;
    }

    if (newWidth !== actualWidth || newHeight !== actualHeight)
    {
        canvas.style.width = newWidth+"px";
        canvas.style.height = newHeight+"px";

        actualWidth = newWidth;
        actualHeight = newHeight;
    }

    window.scrollTo(0, 0);
}

function CheckGoals()
{
    if (goalIdx < goals.length && goals[goalIdx].func(goals[goalIdx]))
    {
        AddPopup(canvas.width - 100, 120, "complete!", "#FF0", true);
        goalCompleteTime = 1.0;
        didAFlipStreak = 0;
        perfectStreak = 0;
    }
}

function DidAFlipThisBounce(goal)
{
    if (flipsLandedThisBounce >= goal.param)
    {
        return true;
    }

    return false;
}

function LandedPerfectly(goal)
{
    return perfectJump && flipsLandedThisBounce > 0;
}

function FlipStreakCheck(goal)
{
    return didAFlipStreak >= goal.param;
}

function PerfectStreakCheck(goal)
{
    return perfectStreak >= goal.param;
}

function LandedOnHead(goal)
{
    return didLandOnHead;
}

function ReachedHeight(goal)
{
    return Math.floor(maxHeightThisBounce / 40.0) >= goal.param;
}

Reset();
window.requestAnimationFrame(GameLoop);
