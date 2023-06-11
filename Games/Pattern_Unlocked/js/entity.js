var images = {};
var player = {};
var bulletlist = {};
var buttons = {};
var playerPositionBeforeCenter = {x:0,s4x:0,s4y:0,s5x:0};
var playerPositionAfterCenter = {x:0,s4x:0,s4y:0,s5x:0};
var ctx = document.getElementById('canvas').getContext('2d');
var ctxS = document.getElementById('canvas');
player.x = 10;
player.width = 219*0.5;
player.height  = 375*0.5;
player.xspd = 5;
player.yspd = 5;
player.mapSize = 43*130;
player.mapSizeS1 = ctxS.clientWidth;
player.aimAngle = 0;
var frameTime = 30;
var enterStage0 = true;
var enterStage1 = false;
var enterStage2 = false;
var enterStage3 = false;
var enterStage4 = false;
var enterStage5 = false;
var controllerLimit = 6;
var controllerResetLimit = 2;
var buttonLimit=6;
var buttonResetLimit=2;
var dialogues = [["Your choice doesn't matter","But Destiny","Enter the room and"
                        ,"unlock the gun that you need for stage 2"],
                ["HIT the target thrice","you can make only 5 mistakes"],
                ["Complete the other two","Before Entering this room"],
                ["Keep Moving ==>","Forward","You will go BACK-ward"],
                ["Press shift to move faster and go back to play game",
                "To enter room press shift + upper Arrow"]];
var controllerText = "controller"; 
var undef = undefined;
var targets = {
    s2y:0,s2yspd:5,s3y1:0,s3y2:250,s3y3:400,s3y1spd:5,s3y2spd:10,s3y3spd:7,
    s2x:1270,s3x1:1050,s3x2:970,s3x3:890,
    s2Width:10,s2Height:100,s3Width:40,s3Height:140,
    s3Tx:1180,s3T1y:60,s3T2y:260,s3T3y:460,s3TWidth:80,s3THeight:80,s3Txspd:0,s3Tyspd:0
};
// targets as well as obstacles i mean
var targetDirectionbool = false;
var targetColor = 'black';
var totalBullets = 5;
var targetHit = 4;
var spdConst = 1;
var wallColor = '#990000';
var blockInitialPosition = 600;
var showText1 = true;  
var totalBulletsFired = 6;
var blink3;
images.bg = new Image();
images.bg.src = './img/bg.png';
var block={};
var holdGun = false;
var holdKey = false;
blockReset = function() {
    if(controllerResetLimit > 0){
        block.b1 = true;
        block.b2 = false;
        block.b3 = true;
        block.b4 = false;
        controllerLimit=6;
        controllerResetLimit--;
    } else {
        controller.shuffle();
        controllerResetLimit=2;
        blockReset();
    }
}
var tgl=true;
drawMap = function(x=0,mapSize,y=0) {
    let startPostionx = 0;
    let startPostiony = 0;
    if(enterStage0==true) {
        startPostiony = startPostionx = tgl==true?0:0.5;
        tgl=!tgl;
        x+=startPostionx;
        y+=startPostiony;
    }
    ctx.drawImage(images.bg, startPostionx, startPostiony, 43, 43, 
        x, y, mapSize,mapSize );
}
drawDoor = function(x=0,defaultPosition=100,y=0,defaultY=100) {
    ctx.save();
    ctx.fillStyle = '#8b4513';
    ctx.fillRect(defaultPosition+x,defaultY+y,100,200);
    grd = ctx.createLinearGradient(0.000, 6.000, 900.000, 300.000);
    // Add colors
    grd.addColorStop(0, 'black');
    grd.addColorStop(0.5, 'white');
    grd.addColorStop(1, 'black');
    // Fill with gradient
    ctx.fillStyle = grd;
    ctx.fillRect(defaultPosition+10+x,defaultY+10+y,80,50);
    ctx.beginPath();
    ctx.arc(defaultPosition+15+x, defaultY+100+y, 7, 0, 2 * Math.PI, false);
    ctx.fillStyle = 'grey';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    ctx.restore();
}
drawText = function(x=0,defaultPosition=199,text,font="30px Georgia",y=0,defaultY=150,fontSize=1) {
    ctx.save();
    ctx.font = font;
    let a = font.slice(0,2);
    styleText("red",defaultPosition,x,text,a*fontSize,y,defaultY);
    styleText("blue",defaultPosition,x+2,text,a*fontSize,y,defaultY);
    styleText("white",defaultPosition,x+1,text,a*fontSize,y,defaultY);
    ctx.restore()
}
styleText = function(color,defaultPosition,x,text,a,y,defaultY) {
    ctx.fillStyle = color;
    for(let i=0;i<text.length;i++) {
        ctx.fillText(text[i], defaultPosition+x, y+defaultY+Number(a)*i);
    }
}
drawPlayer = function() {
    if(!totalBulletsFired)
        holdGun=false;
    if(enterStage1==true) {
        stage1();
    } else if(enterStage2==true) {
        stage2();
    } else if(enterStage3==true) {
        stage3();
    } else if(enterStage4==true) {
        stage4();
    } else if(enterStage5==true) {
        stage5();
    } else {
        stage0();
    }
    drawText(0,ctxS.width-250,[`Game Over in ${gmin}:${gsec}`],"30px Georgia",0,20);
}
stage0 = function() {
    ctx.save();
    if(player.pressingRight == true)
        player.x+=player.xspd;
    if(player.pressingLeft == true)
        player.x-=player.xspd;
    const x = centerPlay("x",player.mapSize); 
    mapMovement(xMovement,"x",player.mapSize,5,dialogues);
    stayInBoundary("x",0,player.mapSize,'map');
    if(holdGun == true)
        drawGun(x);
    if(holdKey == true)
        drawKey(x,y-180+player.height/3);
    boundaryStage5();
    ctx.drawImage(document.getElementById('svg'), 0, 0, 219,375,x,120,player.width,player.height);
    ctx.restore()
}
boundaryStage5 = function() {
    if(player.x + player.width > 3400 && player.x < 3400)
        player.x = 2640;
    if(player.x < 3500 && player.x + player.width > 3500)
        player.x=3500;
}
stayInBoundary = (StageX,lowerBound,mapSize,map,exist=true,y,mapSizeH) => {
    if(player[StageX] < lowerBound && map=='map')
        player[StageX] = lowerBound;
    if(player[StageX] + player.width >= mapSize && exist == true) {
        player[StageX] = mapSize - player.width;
    }if(y != undef) {
        if(player[y] < lowerBound && map=='map')
            player[y] = lowerBound;
        if(player[y] + player.height >= mapSizeH) {
            player[y] = mapSizeH - player.height;
        }
    }
}
var xMovement;
var yMovement;
centerPlay = function(StageX,mapSize) {
    if(player[StageX] + player.width/2 >= ctxS.clientWidth/2 
        && player[StageX] + player.width/2 < mapSize - ctxS.clientWidth/2 && 
        (StageX=="x" || StageX=="s4x" || StageX == "s5x")) {
        xMovement = player[StageX] - playerPositionBeforeCenter[StageX];
        playerPositionAfterCenter[StageX] = player[StageX];
        return ctxS.clientWidth/2 - player.width/2;
    } else if(player[StageX] + player.width/2 >= mapSize - ctxS.clientWidth/2 && 
        (StageX=="x" || StageX=="s4x" || StageX == "s5x")) {
        xMovement = playerPositionAfterCenter[StageX] - playerPositionBeforeCenter[StageX];
        return player[StageX]-playerPositionAfterCenter[StageX] + ctxS.clientWidth/2 - player.width/2;
    } else {
        xMovement = 0;
        return player[StageX];
    }
}
// for vertical center play
centerPlayY = function(StageY,mapSize) {
    if(player[StageY] + player.height/2 >= ctxS.clientHeight/2 
        && player[StageY] + player.height/2 < mapSize - ctxS.clientHeight/2 && StageY=="s4y") {
        yMovement = player[StageY] - playerPositionBeforeCenter[StageY];
        playerPositionAfterCenter[StageY] = player[StageY];
        return ctxS.clientHeight/2 - player.height/2;
    } else if(player[StageY] + player.height/2 >= mapSize - ctxS.clientHeight/2 && StageY=="s4y") {
        yMovement = playerPositionAfterCenter[StageY] - playerPositionBeforeCenter[StageY];
        return player[StageY]-playerPositionAfterCenter[StageY] + ctxS.clientHeight/2 - player.height/2;
    } else {
        yMovement = 0;
        return player[StageY];
    }
}
mapMovement = function(x,StageX,mapSize,n=0,text,font,y=0,StageY="") {
    if(StageX == 's2x')
        drawColoredMap("#ff4444");
    else
        drawMap(-x,mapSize,-y);
    if(StageX == "s1x") {
        drawBlock();
        drawControlBox();
    } 
    if(StageX == "s5x")
        drawBlock(200,600,xMovement);
    for(let i=0;i<n;i++) {
        drawDoor(-x,100*(10*i+1),-y);
        drawText(-x,100*(10*i+1)+100,text[i],font,-y);
        if(x==0 && (StageX == 'x' || StageX == "s4x" || StageX == "s5x")) {
            playerPositionBeforeCenter[StageX] = player[StageX];
        }
        if(y==0 && StageY == "s4y") {
            playerPositionBeforeCenter[StageY] = player[StageY];
        }
    }
    if(StageY == "s4y")
        drawDoor(-x,2350,-y,2363);
}
mapMovementY = function(y,StageY,mapSize) {
    drawMap(-y,mapSize);
    if(y==0 && StageX == "s4y") {
        playerPositionBeforeCenter[StageY] = player[StageY];
    }
}
drawBlock = function(x=0,height=358,xMovement=0) {
    ctx.save();
    var grd = ctx.createLinearGradient(0,0,980,0);
    for(let i=0;i<980;i+=100)
        grd.addColorStop(0.1*i/100, (i/100)%2?'white':'grey');
    ctx.fillStyle = grd;
    for(let i=0;i<4;i++) {
        if(block[`b${i+1}`] == true)
            ctx.fillRect(x+blockInitialPosition+40*i-xMovement,0,30,height);
    }
    ctx.fillStyle = "#555";
    for(let i=0;i<4;i++) {
        ctx.fillRect(x+blockInitialPosition+40*i-xMovement,0,30,50);
    }
    ctx.restore();
}
drawControlBox = function() {
    ctx.save();
    ctx.fillStyle = "grey";
    ctx.fillRect(500,200,50,100);
    ctx.lineWidth = "2";
    ctx.beginPath();
    ctx.rect(510,210,30,80);
    ctx.font = "10px Georgia";
    ctx.fillStyle = "black";
    for(let i=0;i<controllerText.length;i+=2) {
        ctx.fillText(controllerText.charAt(i),517,220+8*i);
        ctx.fillText(controllerText.charAt(i+1),526,220+8*i);
    }
    ctx.stroke();
    ctx.restore();
}
drawGun = function(xGun,yGun=0) {
    ctx.save();
    let x=800,y=250;
    if(holdGun == true) {
        x=xGun + player.width*2/3;
        y=180 + yGun;        
    }
    ctx.fillStyle = "black";
    ctx.fillRect(x,y,100,25);
    ctx.fillRect(x+100,y+7.5,20,10);
    ctx.fillRect(x,y+25,25,25);
    ctx.lineWidth = "5";
    ctx.beginPath();
    ctx.rect(x+25,y+25,30,15);
    ctx.stroke();
    ctx.fillRect(x+30,y+25,6,10);
    ctx.restore();
}
drawColoredMap = function(x) {
    ctx.save();
    ctx.fillStyle = x;
    ctx.fillRect(0,0,player.mapSizeWidthS2,player.mapSizeHeightS2);
    ctx.restore();
}
generateBullet = function(x,y,from,aimAngle=0) {
    self = {
        id: Math.random(),
        from:from,
        x:x + player.width/2 + 120,
        y:y,
        height:20,
        width:20,
        xspd:15,
        yspd:0,
        aimAngle:aimAngle
    }
    // self.yspd = Math.cos(self.aimAngle/180*Math.PI)*15;
    // self.xspd = Math.sin(self.aimAngle/180*Math.PI)*15;
    self.update = function(obj,from,xMovement=0,yMovement=0) {
        if(obj.from == from) {
            obj.x += obj.xspd*spdConst;
            obj.y += obj.yspd*spdConst;
            drawBullet(obj.x , obj.y,xMovement,yMovement);
        }
    }
    bulletlist[self.id] = self;
}
document.onclick = (mouse)=> {
    // if(enterStage2==true && holdGun==true) {
        mouseX = mouse.clientX - document.getElementById('canvas').getBoundingClientRect().left;
        mouseY = mouse.clientY - document.getElementById('canvas').getBoundingClientRect().top;
        // mouseX-=player.s2x;
        // mouseY-=player.s2y;
        // player.aimAngle = Math.atan2(mouseX,mouseY)/Math.PI * 180;
        // generateBullet(player.s2x,player.s2y,player.aimAngle);
        // generateBullet();
    // }
        if(mouseX>ctxS.width-55 && mouseX<ctxS.width && mouseY<55 && mouseY>0 && enterStage1)
            showText1 = false;
        for(let id in buttons) {
            // alert(mouseY+yMovement + " hell " + `${buttons[id].y*50 - 40}`);
            if(mouseX+xMovement >= buttons[id].x*50 - 40 && mouseX+xMovement <= buttons[id].x*50 + 40 &&
                mouseY+yMovement >=buttons[id].y*50 -40 && mouseY+yMovement <=buttons[id].y*50 + 40 &&
                buttonLimit>0 ) {
                    buttonLimit--;
                    if(buttonsSet1[0]==id) {
                        buttons[buttonsSet1[0]].blink = !buttons[buttonsSet1[0]].blink;
                        buttons[buttonsSet1[1]].blink = !buttons[buttonsSet1[1]].blink;
                        buttons[buttonsSet1[3]].blink = !buttons[buttonsSet1[3]].blink;
                    }else if(buttonsSet1[1]==id) {
                        buttons[buttonsSet1[1]].blink = !buttons[buttonsSet1[1]].blink;
                        buttons[buttonsSet1[3]].blink = !buttons[buttonsSet1[3]].blink;
                    }else if(buttonsSet1[2]==id) {
                        buttons[buttonsSet1[0]].blink = !buttons[buttonsSet1[0]].blink;
                        buttons[buttonsSet1[1]].blink = !buttons[buttonsSet1[1]].blink;
                        buttons[buttonsSet1[2]].blink = !buttons[buttonsSet1[2]].blink;
                    }else if(buttonsSet1[3]==id) {
                        buttons[buttonsSet1[0]].blink = !buttons[buttonsSet1[0]].blink;
                        buttons[buttonsSet1[3]].blink = !buttons[buttonsSet1[3]].blink;
                    }else if(buttonsSet2[0]==id) {
                        buttons[buttonsSet2[0]].blink = !buttons[buttonsSet2[0]].blink;
                        buttons[buttonsSet2[1]].blink = !buttons[buttonsSet2[1]].blink;
                        buttons[buttonsSet2[3]].blink = !buttons[buttonsSet2[3]].blink;
                    }else if(buttonsSet2[1]==id) {
                        buttons[buttonsSet2[1]].blink = !buttons[buttonsSet2[1]].blink;
                        buttons[buttonsSet2[3]].blink = !buttons[buttonsSet2[3]].blink;
                    }else if(buttonsSet2[2]==id) {
                        buttons[buttonsSet2[0]].blink = !buttons[buttonsSet2[0]].blink;
                        buttons[buttonsSet2[1]].blink = !buttons[buttonsSet2[1]].blink;
                        buttons[buttonsSet2[2]].blink = !buttons[buttonsSet2[2]].blink;
                    }else if(buttonsSet2[3]==id) {
                        buttons[buttonsSet2[0]].blink = !buttons[buttonsSet2[0]].blink;
                        buttons[buttonsSet2[3]].blink = !buttons[buttonsSet2[3]].blink;
                    }else if(buttonsSet3[0]==id) {
                        buttons[buttonsSet3[0]].blink = !buttons[buttonsSet3[0]].blink;
                        buttons[buttonsSet3[1]].blink = !buttons[buttonsSet3[1]].blink;
                        buttons[buttonsSet3[3]].blink = !buttons[buttonsSet3[3]].blink;
                        buttons[buttonsSet3[4]].blink = !buttons[buttonsSet3[4]].blink;
                    }else if(buttonsSet3[1]==id) {
                        buttons[buttonsSet3[1]].blink = !buttons[buttonsSet3[1]].blink;
                        buttons[buttonsSet3[3]].blink = !buttons[buttonsSet3[3]].blink;
                        buttons[buttonsSet3[4]].blink = !buttons[buttonsSet3[4]].blink;
                    }else if(buttonsSet3[2]==id) {
                        buttons[buttonsSet3[0]].blink = !buttons[buttonsSet3[0]].blink;
                        buttons[buttonsSet3[1]].blink = !buttons[buttonsSet3[1]].blink;
                        buttons[buttonsSet3[2]].blink = !buttons[buttonsSet3[2]].blink;
                        buttons[buttonsSet3[4]].blink = !buttons[buttonsSet3[4]].blink;
                    }else if(buttonsSet3[3]==id) {
                        buttons[buttonsSet3[0]].blink = !buttons[buttonsSet3[0]].blink;
                        buttons[buttonsSet3[3]].blink = !buttons[buttonsSet3[3]].blink;
                        buttons[buttonsSet3[4]].blink = !buttons[buttonsSet3[4]].blink;
                    }else if(buttonsSet3[4]==id) {
                        buttons[buttonsSet3[0]].blink = !buttons[buttonsSet3[0]].blink;
                        buttons[buttonsSet3[1]].blink = !buttons[buttonsSet3[1]].blink;
                        buttons[buttonsSet3[2]].blink = !buttons[buttonsSet3[2]].blink;
                        buttons[buttonsSet3[3]].blink = !buttons[buttonsSet3[3]].blink;
                        buttons[buttonsSet3[4]].blink = !buttons[buttonsSet3[4]].blink;
                    }
                }
        }
}
drawBullet = function(x,y,xMovement,yMovement) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(x+xMovement, y+yMovement, 20, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}
drawEnemyWall = function(mapArea) {
    ctx.save();
    ctx.fillStyle = wallColor;
    if(totalBullets <=0) {
        holdGun = false;
    }
    if(totalBullets<0)
        totalBullets=0;
    ctx.fillRect(mapArea[0] * totalBullets/5,0,mapArea[0],mapArea[1]);
    ctx.fillStyle = targetColor;
    ctx.fillRect(mapArea[0] - 20,turnBack(mapArea,"s2y","s2yspd","s2x","s2Width","s2Height"),20,100);
    bulletTargetCollisionCheck("s2y","s2yspd","s2x","s2Width","s2Height");
    ctx.restore();
}
turnBack = function(mapArea,y,spd,x,eleWidth,eleHeight) {
    if(targets[y] + targets[eleHeight] >= mapArea[1])
        targets[spd] = -targets[spd];
    if(targets[y]  < 0)
        targets[spd] = -targets[spd];
    if(targetDirectionbool)
        return targets[y] -= targets[spd]*spdConst;
    else
        return targets[y] += targets[spd]*spdConst;
}
bulletTargetCollisionCheck = function(y,spd,x,eleWidth,eleHeight) {
    for(let id in bulletlist) {
        if(bulletlist[id].x + bulletlist[id].width >= targets[x] - 50 &&
            bulletlist[id].x <= targets[x] + targets[eleWidth] + 30 &&
            bulletlist[id].y + bulletlist[id].height >= targets[y] - 30 &&
            bulletlist[id].y <= targets[y] + targets[eleHeight] + 30) {
            spdConst = 0.1;
        } 
        if(bulletlist[id].x + bulletlist[id].width >= targets[x] && bulletlist[id].x - bulletlist[id].width<= targets[x] + targets[eleWidth]
        && bulletlist[id].y + bulletlist[id].height >= targets[y] && bulletlist[id].y - bulletlist[id].height <= targets[y] + targets[eleHeight]) {
            delete bulletlist[id];
            spdConst = 1;       
            if((enterStage3 || enterStage5)&& eleWidth=="s3TWidth") {
                fillStyleTargetS3[Number(y.slice(3,4))-1] = "red";
                for(let i=0;i<=5;i++) {
                    setTimeout(() => {
                        for(let i=0;i<3;i++)
                            fillStyleTargetS3[i] = fillStyleTargetS3[i]=='red'?'#ff7777':'red';               
                    }, 200*i);
                }
                if(fillStyleTargetS3[0]=="red" && fillStyleTargetS3[1]=="red" && 
                    fillStyleTargetS3[2]=="red") {
                        blink3 = setInterval(() => {
                            for(let i=0;i<3;i++)
                                fillStyleTargetS3[i] = fillStyleTargetS3[i]=='red'?'#ff7777':'red';
                        }, 200);
                        targetBlinking=true;
                    }
            } 
            if(targetHit && enterStage2) {
                targets[spd] += targets[spd];
                targetHit--;
                for(let i=0;i<=5;i++) {
                    setTimeout(() => {
                        targetColor = targetColor == 'black'?'#990000':'black';    
                        wallColor = wallColor == '#990000'?'#ff4444':'#990000'                  
                    }, 200*i);
                }
            } 
        } else if(bulletlist[id].x >= ctxS.width) {
            delete bulletlist[id];
            spdConst = 1;        
            totalBullets--;
        } 
    }
}
infoBox = function(text) {
    ctx.save();
    ctx.fillStyle = "black";
    ctx.font = "25px Georgia";
    ctx.fillRect(0,0,ctxS.width,ctxS.height);
    ctx.fillStyle= "white";
    for(let i=0;i<text[0].length;i++){
        ctx.fillText(text[0][i],20,30*(i+1));
    }
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ctxS.width-30, 30, 25, 0, 2 * Math.PI, true);
    ctx.fill();
    ctx.fillStyle = "white";
    ctx.fillText("X",ctxS.width-40, 38);
    ctx.restore();
}
var gmin=0;
var gsec=0;
startTimer = function(duration) {
    var start = Date.now(),
        diff,
        minutes,
        seconds;
    function timer() {
        // get the number of seconds that have elapsed since 
        // startTimer() was called
        diff = duration - (((Date.now() - start) / 1000) | 0);

        // does the same job as parseInt truncates the float
        minutes = (diff / 60) | 0;
        seconds = (diff % 60) | 0;
        console.log(diff);
        if(!diff) {
            alert("Game Over");
            location.reload(true);
        }
        gmin = minutes = minutes < 10 ? "0" + minutes : minutes;
        gsec = seconds = seconds < 10 ? "0" + seconds : seconds;
        if (diff <= 0) {
            // add one second so that the count down starts at the full duration
            // example 05:00 not 04:59
            start = Date.now() + 1000;
        }
    };
    // we don't want to wait a full second before the timer starts
    timer();
    setInterval(timer, 1000);
}

window.onload = function () {
    var fiveMinutes = 60 * 8;
    startTimer(fiveMinutes);
};