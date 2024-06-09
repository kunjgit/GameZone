function canvasCalls(){
	var c = document.getElementById("Carrom");
	var ctx = c.getContext("2d");
	//inner rectangle
	drawRect(20,20,680,680,'#f3e5ab',ctx);
	//Corner Circles
	drawCircle(35,35,22,'black',ctx);
	drawCircle(685,35,22,'black',ctx);
	drawCircle(685,685,22,'black',ctx);
	drawCircle(35,685,22,'black',ctx);
	//Central Circles
	drawCircle(360,360,10,'black',ctx);
	drawCircleS(360,360,70,ctx);
	drawCircleS(360,360,75,ctx);
	//demo rect
	//drawRectS(100,100,520,520,ctx);
	//drawRectS(125,125,470,470,ctx);
	//top Left Design
	//Circles
	drawCircleS(125,125,5,ctx);
	drawCircle(125+12.5,125-12.5,12.5,'red',ctx);
	drawCircle(125-12.5,125+12.5,12.5,'red',ctx);
	//Lines Connecting Circles
	drawLine(125+12.5,125,595-12.5,125,'black',ctx);
	drawLine(125+12.5,100,595-12.5,100,'black',ctx);
	//Line and Arc
	drawLine(75,75,235+5,235+5,'black',ctx);
	drawArc(220,220,30,1.5*Math.PI,1*Math.PI,ctx);
	//top Right Design
	//Circles
	drawCircleS(595,125,5,ctx);
	drawCircle(595-12.5,125-12.5,12.5,'red',ctx);
	drawCircle(595+12.5,125+12.5,12.5,'red',ctx);
	//Lines Connecting Circles
	drawLine(595,125+12.5,595,595-12.5,'black',ctx);
	drawLine(595+25,125+12.5,595+25,595-12.5,'black',ctx);
	//Line and Arc
	drawLine(645,75,485-5,235+5,'black',ctx);
	drawArc(500,220,30,0*Math.PI,1.5*Math.PI,ctx);

	//bottom Right Design
	//Circles
	drawCircleS(595,595,5,ctx);
	drawCircle(595-12.5,595+12.5,12.5,'red',ctx);
	drawCircle(595+12.5,595-12.5,12.5,'red',ctx);
	//Lines Connecting Circles
	drawLine(595-12.5,595,125+12.5,595,'black',ctx);
	drawLine(595-12.5,595+25,125+12.5,595+25,'black',ctx);
	//Line and Arc
	drawLine(645,645,485-5,485-5,'black',ctx);
	drawArc(500,500,30,0.5*Math.PI,0*Math.PI,ctx);

	//bottom Left Design
	//Circles
	drawCircleS(125,595,5,ctx);
	drawCircle(125+12.5,595+12.5,12.5,'red',ctx);
	drawCircle(125-12.5,595-12.5,12.5,'red',ctx);
	//Lines Connecting Circles
	drawLine(125,595-12.5,125,125+12.5,'black',ctx);
	drawLine(125-25,595-12.5,125-25,125+12.5,'black',ctx);
	//Line and Arc
	drawLine(75,645,235+5,485-5,'black',ctx);
	drawArc(220,500,30,1*Math.PI,0.5*Math.PI,ctx);

	//coins
	coins = [];
	coins.push(new coin(0,0,'white',0,0));
	coins.push(new coin(360-25,360,'#515050',0,0));
	coins.push(new coin(360,360,'brown',0,0));
	coins.push(new coin(360+25,360,'#515050',0,0));
	coins.push(new coin(360,360+25,'#515050',0,0));
	coins.push(new coin(360-25,360+25,'brown',0,0));
	coins.push(new coin(360+25,360+25,'brown',0,0));
	coins.push(new coin(360,360-25,'#515050',0,0));
	coins.push(new coin(360-25,360-25,'brown',0,0));
	coins.push(new coin(360+25,360-25,'brown',0,0));

	drawCoins();
}

function drawCoins()
{
	var ct = document.getElementById("Striker");
	var ctxt = ct.getContext("2d");
	for(var i=1;i<coins.length;i++)
	{
		drawCircle(coins[i].x,coins[i].y,12.5,coins[i].color,ctxt);
	}

}

function initializePlayers(no)
{
	TotalplayerNo = no;
	currPlayer = 0;
	players = [];
	players.push(new player(595-12.5-230+390,595+12.5,595-12.5+390,125+12.5+390));
	players.push(new player(595-12.5-230+390,125-12.5,595-12.5+390,125+12.5+390));
	//alert(players[currPlayer].x);
}