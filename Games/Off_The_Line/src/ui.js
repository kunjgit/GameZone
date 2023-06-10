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