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