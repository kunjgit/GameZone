function player(x,y,rightBound,leftBound){
	this.x = x;
	this.y = y;
	this.lb = leftBound;
	this.rb = rightBound;
	this.score = 0;
}
function updateScore(){
	var score = document.getElementById(currPlayer);
	score.innerHTML = players[currPlayer].score;
}
function dist(x1,y1,x2,y2){
	var dis = Math.pow((x1-x2),2)+Math.pow((y1-y2),2);
        dis = Math.sqrt(dis);
        return dis;
}
function allCoinStop(){
	for(var i=0;i<coins.length;i++)
	{
		if( coins[i].vx != 0 && coins[i].vy !=0)
			return 0;
	}
	return 1;
}
function coinPot(coin)
{
	var potLeftUp = dist(coin.x,coin.y,35,35);
	var potRightUp =  dist(coin.x,coin.y,35,685);
	var potLeftDown =  dist(coin.x,coin.y,685,35);
	var potRightDown =  dist(coin.x,coin.y,685,685);
	var rad = 18;
	if(potLeftUp<rad || potLeftDown<rad || potRightUp<rad || potRightDown<rad)
		return true;
	else
		return false;
}
function coin(x,y,color,vx,vy)
{
	this.x = x;
	this.y = y;
	this.vx = vx;
	this.vy = vy;
	this.color = color;
	this.rebound = function() {
		//alert("rebound");
		if( (this.x + 12.5 + this.vx > 700 ) || (this.x - 12.5 + this.vx < 20) )
		{
			this.vx = -this.vx;
		}
		if((this.y + this.vy+ 12.5 > 700 ) || (this.y-12.5+this.vy < 20))
		{
			this.vy = -this.vy;
		}
	}
	this.update = function() {
		//alert("Update");
		this.x+=this.vx;
		this.y+=this.vy;
		this.vx*=0.98;
		this.vy*=0.98;
	}
	this.crash = function(i,j){
		//alert("i : "+ coins[i].x);
		var dis = dist(this.x+this.vx,this.y+this.vy,coins[i].x+coins[i].vx,coins[i].y+coins[i].vy);
		if(dis<=25)
		{
			var dx = coins[j].x+coins[j].vx-coins[i].x+coins[i].vx;
			var dy = coins[j].y+coins[j].vy-coins[i].y+coins[i].vy;
		    var collisionAngle = Math.atan2(dy, dx);

		    var speed1 = Math.sqrt(coins[i].vx*coins[i].vx + coins[i].vy*coins[i].vy );
		    var speed2 = Math.sqrt(coins[j].vx*coins[j].vx + coins[j].vy*coins[j].vy);

		    var direction1 = Math.atan2(coins[i].vy, coins[i].vx);
		    var direction2 = Math.atan2(coins[j].vy, coins[j].vx);

		    var velocityx_1 = speed1 * Math.cos(direction1 - collisionAngle);
		    var velocityy_1 = speed1 * Math.sin(direction1 - collisionAngle);
		    var velocityx_2 = speed2 * Math.cos(direction2 - collisionAngle);
		    var velocityy_2 = speed2 * Math.sin(direction2 - collisionAngle);

		    var final_velocityx_1 = velocityx_2;
		    var final_velocityx_2 = velocityx_1;
		    var final_velocityy_1 = velocityy_1;
		    var final_velocityy_2 = velocityy_2;

		    ball1_velocityx = Math.cos(collisionAngle) * final_velocityx_1 + 
		          Math.cos(collisionAngle + Math.PI/2) * final_velocityy_1;
		    ball1_velocityy = Math.sin(collisionAngle) * final_velocityx_1 + 
		          Math.sin(collisionAngle + Math.PI/2) * final_velocityy_1;
		    ball2_velocityx = Math.cos(collisionAngle) * final_velocityx_2 + 
		          Math.cos(collisionAngle + Math.PI/2) * final_velocityy_2;
		    ball2_velocityy = Math.sin(collisionAngle) * final_velocityx_2 + 
		          Math.sin(collisionAngle + Math.PI/2) * final_velocityy_2;

		    coins[i].vx = ball1_velocityx;
		    coins[i].vy = ball1_velocityy;
		    coins[j].vx = ball2_velocityx;
		    coins[j].vy = ball2_velocityy;

		   	coins[j].x+=coins[j].vx;
			coins[j].y+=coins[j].vy;
			coins[i].x+=coins[i].vx;
			coins[i].y+=coins[i].vy;
		}
	}
	

}