player.s1x = 100;
stage1 = function() {
    ctx.save();
    TextS1 = [["Go to the controller and",
            "Press 1, 2, 3 or 4 to lock or unlock the bars[Obstacles]",
            "different bars gets locked or unlocked on certain key[1,2,3,4] press",
            "Figure it out with which key[1,2,3,4] press cause bar/bars to respond",
            "understand the pattern and unlock it","with a 3 digit code to get the GUN",
            "fun fact :- You can press keys[1,2,3,4] only 6 times to lock or unlock the bars",
            "You can reset the position of bars and get one more chance to press the keys 6 more times",
            "by pressing 'r'.If you press the r second time, the code to unlock the doors will be changed"]];
    TextS2 = [["Remember","you have to find the pattern","Press i to see the","info box again"]]
    if(showText1 == true)
        infoBox(TextS1);
    else {
        if(player.pressingRight == true)
            player.s1x+=player.xspd;
        if(player.pressingLeft == true)
            player.s1x-=player.xspd;
        const x = centerPlay("s1x",player.mapSizeS1); 
        mapMovement(xMovement,"s1x",player.mapSize,1,TextS2,"27px Georgia");
        if(player.s1x + player.width >= 800) {
            totalBulletsFired=6;
            holdGun = true;
        }
        if(holdGun == true)
            drawGun(x);
        else
            drawGun();
        if(holdKey == true)
            drawKey(x);
        stayInBoundary("s1x",0,player.mapSizeS1,'map');
        for(let i=0;i<4;i++)
            stayInBoundary("s1x",blockInitialPosition+40*i,blockInitialPosition+40*i,'block',block[`b${i+1}`]);
        ctx.drawImage(document.getElementById('svg'), 0, 0, 219,375,x,120,player.width,player.height);
    }
    ctx.restore();
}
