player.s2x = 100;
player.s2y = 120;
stage2 = function() {
    ctx.save();
    TextS2 = [["Press Space to fire bullets",`No of times you can can hit the wall : ${totalBullets}`,
                    `NO. of times you have to hit the moving black box : ${targetHit}`,
                    "To enter the third round"]];
    let mapArea = newSizeCanvas();
    const x = centerPlay("s2x",player.mapSizeWidthS2);
    mapMovement(xMovement,"s2x",player.mapSize,1,TextS2,"27px Georgia");
    if(targetHit)
        drawEnemyWall(mapArea);
    // stayInBoundary("s2x",0,player.mapSizeWidthS2,'map',true,"s2y",mapArea[1]);
    if(holdGun == true)
        drawGun(x,player.s2y-180 + player.height/3);
    if(holdKey == true)
        drawKey(x);
    for(let id in bulletlist) {
        bulletlist[id].update(bulletlist[id],"s2");
    }
    ctx.drawImage(document.getElementById('svg'), 0, 0, 219,375,x,player.s2y,player.width,player.height); 
    ctx.restore();
}
newSizeCanvas = function() {
    var body = document.getElementById('body');
    return [player.mapSizeWidthS2 = ctxS.width = 1280,
                    player.mapSizeHeightS2 = ctxS.height = 600];
}