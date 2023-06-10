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