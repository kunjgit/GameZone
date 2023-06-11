Array.prototype.shuffle = function() {
    var input = this;
    for (var i = input.length-1; i >=0; i--) {
     
        var randomIndex = Math.floor(Math.random()*(i+1)); 
        var itemAtIndex = input[randomIndex]; 
         
        input[randomIndex] = input[i]; 
        input[i] = itemAtIndex;
    }
    return input;
}
var controller = [ 49, 50, 51, 52];

document.onkeydown = (event)=> {
    if(event.keyCode == 68 || event.keyCode == 39) {
        player.pressingRight = true;
    }if(event.keyCode == 65 || event.keyCode == 37) {
        player.pressingLeft = true;        
    }if(event.keyCode == 16) {
        player.xspd = 20;        
        player.yspd = 20;        
    }if(enterStage3 || enterStage4 || enterStage5) {
        if(event.keyCode == 87 || event.keyCode == 38) {
            player.pressingTop = true;
        }if(event.keyCode == 83 || event.keyCode == 40) {
            player.pressingBottom = true;        
        }
    }
}
document.onkeyup =(event)=> {
    if(event.keyCode == 68 || event.keyCode == 39) {
        player.pressingRight = false;
    }if(event.keyCode == 65 || event.keyCode == 37) {
        player.pressingLeft = false;        
    }if(enterStage3 || enterStage4 || enterStage5) {
        if(event.keyCode == 87 || event.keyCode == 38) {
            player.pressingTop = false;
        }if(event.keyCode == 83 || event.keyCode == 40) {
            player.pressingBottom = false;        
        }
    }if(event.keyCode == 16) {
        setTimeout(() => {
            player.xspd = 5;        
            player.yspd = 5; 
        }, 200);       
    }if(event.keyCode == 13) {
        if(player.x + player.width >= 100 && player.x <= 200 && enterStage0 == true) {
            controllerResetLimit=0;
            blockReset();
            enterStageCheck('enterStage1');
        } else if(player.x + player.width >= 100*(10*1+1) && player.x < 100*(10*1+1) +100 && enterStage0 == true) {
            if(targetHit || totalBullets<=0)
                totalBullets = 5;
            if(targetHit) {
                targetHit = 4;
                targets.s2yspd = 5;
            }
            enterStageCheck('enterStage2');        
        } else if(player.x + player.width >= 100*(10*2+1) && player.x < 100*(10*2+1) +100 && enterStage0 == true 
        && !targetHit
        ) {
            enterStageCheck('enterStage3');        
        } else if(player.x + player.width >= 100*(10*3+1) && player.x < 100*(10*3+1) +100 && enterStage0 == true 
                && fillStyleTargetS3[0]=='red' && fillStyleTargetS3[1]=='red' && fillStyleTargetS3[2]=='red'
                ){
            randomBlockGenerator();
            generateButtons();
            wallBoundaries();
            buttonReset();
            enterStageCheck('enterStage4');        
        } else if(player.x + player.width >= 100*(10*4+1) && player.x < 100*(10*4+1) +100 && enterStage0 == true &&
                    holdKey
                    ) {
            fillStyleTargetS3[0]=fillStyleTargetS3[1]=fillStyleTargetS3[2]="#ff7777";
            blockReset();
            for(let i=0;i<3;i++)
                fillStyleTargetS3[0] = '#ff7777';
            targetBlinking=false;
            clearInterval(blink3);
            enterStageCheck('enterStage5');        
        } else if(player.s1x + player.width >= 100 && player.s1x < 200  && enterStage1 == true) {
            enterStageCheck('enterStage0');
            showText1 = !showText1;
        } else if(player.s2x + player.width >= 100 && player.s2x < 200  && enterStage2 == true) {
            enterStageCheck('enterStage0');
            defaultSizeCanvas();
        } else if(player.s3x + player.width >= 100 && player.s3x < 200  && enterStage3 == true) {
            enterStageCheck('enterStage0');
            defaultSizeCanvas();
        }  else if(player.s4x + player.width >= 100 && player.s4x < 200  && enterStage4 == true &&
                player.s4y + player.height >= 100 && player.s4y <= 300) {
                backToStage0();
        }   else if(player.s4x + player.width >= 2350 && player.s4x < 2450  && enterStage4 == true &&
            player.s4y + player.height >= 2363 && player.s4y <= 2563) {
            player.x=4460;
            backToStage0()
        } else if(player.s5x + player.width >= 100 && player.s5x < 200  && enterStage5 == true) {
            enterStageCheck('enterStage0');
            defaultSizeCanvas();
        }
    } 
    backToStage0 = function() {
        enterStageCheck('enterStage0');
        blocks = {};
        gates = {};
        buttons = {};
        walls = {};
        defaultSizeCanvas();
    }
    if(player.s1x + player.width/2 >= 500 && player.s1x + player.width/2 <= 550 || enterStage5) {
        if(controllerLimit>0) {
            if(event.keyCode == controller[0]) {
                controllerLimit--;
                block.b4 = !block.b4;        
                block.b2 = !block.b2;
                block.b1 = !block.b1;
            }if(event.keyCode == controller[1]) {
                controllerLimit--;
                block.b2 = !block.b2;  
                block.b4 = !block.b4;
            }if(event.keyCode == controller[2]) {
                controllerLimit--;
                block.b2 = !block.b2;        
                block.b1 = !block.b1;
                block.b3 = !block.b3;       
            }if(event.keyCode == controller[3]) {
                controllerLimit--;
                block.b1 = !block.b1;
                block.b4 = !block.b4;
            }
        }
    if(event.keyCode == 82)
        blockReset();
    }
    if(event.keyCode == 66 && enterStage4)
        buttonReset();
    if(event.keyCode == 32) {
        if(enterStage2==true && holdGun==true)
            generateBullet(player.s2x,player.s2y + player.width*2/3,"s2");
        else if(enterStage3==true && holdGun==true)   
            generateBullet(player.s3x,player.s3y + player.width*2/3,"s3");
        else if(enterStage4==true && holdGun==true)
            generateBullet(player.s4x,player.s4y + player.width*2/3,"s4");
        else if(enterStage5==true && holdGun==true) {
            if(Object.keys(bulletlist).length < 1) {
                controllerResetLimit--;
                blockReset();
                generateBullet(player.s5x,player.s5y + player.width*2/3,"s5");
            }
            return;
        }
        totalBulletsFired--;
    }
    if(event.keyCode == 73) {
        showText1=!showText1;        
    }
}
enterStageCheck = function(value) {
    enterStage0 = value=='enterStage0'?true:false;
    enterStage1 = value=='enterStage1'?true:false;
    enterStage2 = value=='enterStage2'?true:false;
    enterStage3 = value=='enterStage3'?true:false;
    enterStage4 = value=='enterStage4'?true:false;
    enterStage5 = value=='enterStage5'?true:false;
    console.log(enterStage0, enterStage1);
}
defaultSizeCanvas = function() {
    ctxS.width = 980;
    ctxS.height = 300;
}