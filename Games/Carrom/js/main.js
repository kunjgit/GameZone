$(document).ready(function(){

    strikerPlace();
    function strikerPlace(){
        var c = document.getElementById("Striker");
        var ctx = c.getContext("2d");
        coins[0].x = players[currPlayer].x;
        coins[0].y = players[currPlayer].y;
        ctx.clearRect(0,0,720,720);
        drawCoins();
        drawCircle(coins[0].x-390,coins[0].y,12.5,'white',ctx);
        $("#Striker").on("mousemove",function(event){
            xCo = event.pageX;
            yCo = event.pageY;
            if(xCo <   players[currPlayer].rb && xCo >  players[currPlayer].lb)
                coins[0].x = xCo; 
            $("#mp").html("x-coor : " + xCo +"  y-coor : " + yCo);
            ctx.clearRect(0,0,720,720);
            drawCoins();
            drawCircle(coins[0].x-390,coins[0].y,12.5,'white',ctx);       
        }).click(function(){
            $("#Striker").off("mousemove");
            polePlace();
            return;
        });
    }

    //calculating angle of impact of pole with striker
    function polePlace(){
        $("#Striker").on("mousemove",function(event){
            var x = event.pageX;
            var y = event.pageY;
            var c = document.getElementById("Striker");
            var ctx = c.getContext("2d");
            ctx.clearRect(0,0,720,720);
            drawCoins();
            drawCircle(coins[0].x-390,coins[0].y,12.5,'white',ctx);
            drawLine(coins[0].x-390,coins[0].y,x-390,y,'black',ctx);
            poleX = x;
            poleY = y;
        }).click(function(event){
            slope = (poleX-coins[0].x)/(poleY-coins[0].y);
            $("#Striker").off("click");
            $("#Striker").off("mousemove");
            hitStriker();
            return;
        });
    }
    //hitting Striker
    function hitStriker(){
            var canvas = document.getElementById("Striker");
            var c = canvas.getContext('2d');
            var ranger = document.getElementById("Ranger").value;
            var vX = ranger*Math.sin(Math.atan(slope));
            var vY = ranger*Math.cos(Math.atan(slope));
            if(poleY > coins[0].y)
            {
                vX = -vX;
                vY = -vY;
            }
            coins[0].x = coins[0].x-390;
            coins[0].y = coins[0].y;
            coins[0].vx = vX;
            coins[0].vy = vY;
            function draw(){
                c.clearRect(0,0,720,720);
                for(var i=0;i<coins.length;i++)
                {
                    for(var j=0;j<coins.length;j++)
                    {
                        if(j!=i)
                            coins[j].crash(i,j);
                    }
                }
                for(var i=0;i<coins.length;i++)
                {
                    drawCircle(coins[i].x,coins[i].y,12.5,coins[i].color,c);
                    coins[i].rebound();
                    coins[i].update();
                    if(Math.abs(coins[i].vx)<=0.3 && Math.abs(coins[i].vy)<=0.3)
                    {
                        coins[i].vx=0;
                        coins[i].vy=0;
                        if(allCoinStop())
                        {
                            currPlayer = (currPlayer+1)%TotalplayerNo;
                            drawCoins();
                            window.cancelAnimationFrame(myreq);
                            strikerPlace();
                            return;
                        }
                    }
                    if(coinPot(coins[i]))
                    {
                        if(i==0)
                        {
                            //alert("striker Pot");
                            players[currPlayer].score--;
                            updateScore();
                            currPlayer = (currPlayer+1)%TotalplayerNo;
                            drawCoins();
                            window.cancelAnimationFrame(myreq);
                            strikerPlace();
                            return;
                        }
                        else
                        {
                            players[currPlayer].score++;
                            updateScore();
                            currPlayer = (currPlayer+1)%TotalplayerNo;
                            coins.splice(i,1);
                        }
                        
                    }
                    if(coins.length==1)
                    {
                        alert("Game Over");
                        alert(currPlayer + " Won the game");
                        return;
                    }
                }
            myreq = requestAnimationFrame(draw);
        }
        myreq = requestAnimationFrame(draw);
    }

});