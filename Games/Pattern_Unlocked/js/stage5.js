player.s5x = 100;
player.s5y = 120;
var allowMovement = false;
var direction=true;
var buttonResetLimit=2;
stage5 = function() {
    ctx.save();
    TextS1 = [["Welcome to stage 5"]];
    TextS2 = [["you know this stage has everything",
                ["that you saw 'back' in every previous stage"]]];
    if(allowMovement){
        if(player.pressingRight == true)
            player.s5x+=player.xspd;
        if(player.pressingLeft == true)
            player.s5x-=player.xspd;
        if(player.pressingTop == true)
            player.s5y-=player.yspd;
        if(player.pressingBottom == true)
            player.s5y+=player.yspd;
    }
    let mapArea = newSizeCanvas();    
    const x = centerPlay("s5x",mapArea[0]*2-170);
    mapMovement(xMovement,"s5x",mapArea[0]*2-170,1,TextS2,"27px Georgia");
    drawTarget(mapArea);
    drawTarget(mapArea,2,170);
    if(player.s5x >= 1500)
        drawText(20-xMovement,1140,["WINNER"],"300px Georgia",270,10)
    if(!allowMovement)
        upDown();
    checkForMovement();
    if(holdGun == true)
        drawGun(x,player.s5y-180 + player.height/3);
    for(let id in bulletlist)
        bulletlist[id].update(bulletlist[id],"s5",-xMovement);
    stayInBoundary("s5x",0,mapArea[0]*2-170,'map',true,"s5y",mapArea[1]);
    for(let i=0;i<4;i++)
            stayInBoundary("s5x",200+blockInitialPosition+40*i
                ,200+blockInitialPosition+40*i,'block',block[`b${i+1}`]);
    bulletBlockCollisionCheck(mapArea[0]);
    ctx.drawImage(document.getElementById('svg'), 0, 0, 219,375,x,player.s5y,player.width,player.height);
    ctx.restore();
}
bulletBlockCollisionCheck = function(mapArea) {
    for(let id in bulletlist) {
        for(let i=0;i<4;i++){
            if(block[`b${i+1}`]) {
                if(bulletlist[id].x >= 200+blockInitialPosition+40*i && bulletlist[id].from=="s5") {
                    delete bulletlist[id];
                    spdConst=1;
                    break;
                }
                else if(spdConst==1 && bulletlist[id].x >= 400)
                    spdConst=0.1;
            } else if(bulletlist[id].x>=mapArea) {
                delete bulletlist[id];
                spdConst=1;
                break;
            } else if(bulletlist[id].x < 1100 && bulletlist[id].x > 800 ||
                (!block['b1'] && !block['b2'] && !block['b3'] && !block['b4']))
                spdConst=1;
        }
    }
}
checkForMovement = function() {
    if(fillStyleTargetS3[0]=='red' && fillStyleTargetS3[1]=='red' && fillStyleTargetS3[2]=='red')
        allowMovement=true;
}
upDown = function() {
    checkForMovement();
    if(player.s5y<=0)
        direction=true;
    if(player.s5y + player.height >= 600)
        direction=false;
    if(direction)
        player.s5y+=5*spdConst;
    else
        player.s5y-=5*spdConst;
}
