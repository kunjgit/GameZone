//declaring obstacles
var myGamePiece;
var myObstacles = [];
var myScore;
var mylevel;
var birds;
var head;
var rules;
var rules2;
var arrowl=[];
var arrowr=[];
var snd1= new Audio("sounds/smb_kick.wav");
var snd2= new Audio("sounds/smb_stomp.wav");
var snd3= new Audio("sounds/bird.wav");

function startGame()
 {
    
    myGamePiece = new component(121,504,"images/shooterl.png","images/shooterr.png" ,400,-200,"image");
    myScore = new component("30px", "Consolas","darkblue","darkblue",870, 90, "text");
    GameOver = new component("140px", "Arial","green","green", 5, 260, "text");
    YouWon = new component("140px", "Arial","green","green", 50, 260, "text");
     mylevel = new component("25px", "Consolas", "black","black", 870, 130, "text");
     head = new component("32px", "Consolas", "red","red", 864, 35, "text");
     rules = new component("20px", "Consolas", "purple","purple", 880, 190, "text");
     birds = new component(856,100,"images/birds.png","images/birds2.png",0,0,"image");
     rec= new component(3,480,"darkblue","darkblue",856,0,"fig");
     rules2 = new component(232,266,"images/rulesimg.jpg","images/rulesimg.jpg" ,865,200,"image");
    myGameArea.start();
}
//define game area
var myGameArea = 
{
    canvas : document.createElement("canvas"),
    start : function() 
    {
    	this.canvas.width =1100;
        this.canvas.height=480;
       
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
         this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) { myGameArea.key = e.keyCode;})
        window.addEventListener('keyup', function (e) { myGameArea.key = false;})
    }, 
    clear : function()
    {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() 
    {
        clearInterval(this.interval);
        x.pause();
    }
}
//define every component
function component(width, height, source1,source2, x, y,type)
 {
	this.s1=source1;
	this.s2=source2;
	this.type=type;
	this.gamearea = myGameArea;
    this.image = new Image();
    this.direction="L";
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;    
    this.x = x;
    this.y = y;    
    this.update = function() 
    {
     ctx = myGameArea.context;
    if (this.type == "text") 
         {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = this.s1;
            ctx.fillText(this.text, this.x, this.y);
         }
        else if(this.type=="fig")
        {
        	    ctx.fillStyle = this.s1;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    
        }
        else
        {
        	if(this.direction=='L')
               {
    	this.image.src = this.s1;
              }
            else
              {
    	this.image.src = this.s2;
               }
        ctx.drawImage(this.image, 
                this.x, 
                this.y,
                this.width, this.height);
         }
    } //update every component's new position

    this.newPos = function() 
    {
        this.x += this.speedX;
        this.y += this.speedY; 
    }
    //crash with function
    this.crashWith = function(otherobj) 
    {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height)-30;
        var crash = true;
        if ((mybottom < othertop) ||
               (mytop > otherbottom) ||
               (myright < otherleft) ||
               (myleft > otherright)) 
        {
           crash = false;
        }
        return crash;
    }
    
}
var temp=0,score=0,time=0,num=1,level=1,t,tempt=0,tempt2=0,tempt3=0,monspeed=-1,flag=-1;
//call update game area after every 20 ms
function updateGameArea() 
{
	var x, y,ax,ay;
    myGameArea.clear();
    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.key == 37) {myGamePiece.direction = "L"; }
    if (myGameArea.key == 39) {myGamePiece.direction = "R"; }
    if (myGameArea.key == 32) {
    	if((time>=(tempt3+10)) || (num==1))
    	   {

    	ax=myGamePiece.x;
    	ay=myGamePiece.y;
    	if(myGamePiece.direction=='L')
    	{
    		arrowl.push(new component(50,17, "images/arrowl.png","images/arrowl.png", ax, ay+450,"image"));
            snd1.play();
    		myGamePiece.s1="images/shooterla.png";
    		tempt=time;
        }
        else
        {
        	arrowr.push(new component(50,17, "images/arrowr.png","images/arrowr.png", ax, ay+450,"image"));
        	 snd1.play();
        	myGamePiece.s2="images/shooterra.png";
        	tempt2=time;
        }
        num++;
    }

        tempt3=time;
    }
    if (myGameArea.key == 38) {
    	if(myGamePiece.y<=-335)
    	{
    		myGamePiece.speedY=0;
    	}
    	else{

    		myGamePiece.speedY = -3; }
     }
    if (myGameArea.key == 40) {
    	if(myGamePiece.y>=-22)
    	{
    		myGamePiece.speedY=0;
    	}
    	else{

    		myGamePiece.speedY = 3; }
    	}
    myGameArea.frameNo += 1;
    temp++;
    time++;
    if(temp==50)
    {
    	temp=0;
    }
    if(time==2250)
    {
    	monspeed+= -1;
    	level++;
    	time=0;
    }
    //draw monster
    if (myGameArea.frameNo == 1 || everyinterval(150)) {
    	t=Math.random()*1000;
        while((t>300 && t<500) || (t>781)){
        	t=Math.random()*1000;
        }
        x=t;
        y = myGameArea.canvas.height;

        myObstacles.push(new component(55,63, "images/monsterl.png","images/monsterr.png", x, y,"image"));
    }
    for (i = 0; i < arrowl.length; i += 1) {
        arrowl[i].x -= 5;
        arrowl[i].update();
    }
    for (i = 0; i < arrowr.length; i += 1) {
        if(arrowr[i].x>=800)
    	{
    		arrowr[i].x=1300;
    	}
    	else{
        arrowr[i].x += 5;
    }
        arrowr[i].update();
    }
    for (i = 0; i < myObstacles.length; i += 1) {
    	if(temp>25){
        	myObstacles[i].direction='R';
        	birds.direction='R';
        }
        else{
        	myObstacles[i].direction='L';
        	birds.direction='L';
        }
        myObstacles[i].y += monspeed;
        myObstacles[i].update();
    }
    if(time==tempt+10)
    {
     myGamePiece.s1="images/shooterl.png";	
    }
    if(time==tempt2+10)
    {
    myGamePiece.s2="images/shooterr.png";	
    }
    for(i = 0; i < myObstacles.length;i +=1){
        if (myObstacles[i].crashWith(birds)) {
        	snd3.play();
            myObstacles[i].y=-100;
        	if(myObstacles[i].s1=="images/boom.png")
        	{}
        else
        {
       	score-=5;
       	myScore.s1="red";}   
} 
    }
    for (i = 0; i < myObstacles.length; i += 1) {
    	for(j = 0; j < arrowl.length;j +=1){
        if (myObstacles[i].crashWith(arrowl[j]))
         {
             snd2.play();

        	if(myObstacles[i].s1=="images/boom.png")
        	{
        		flag=5;
        	}
        	myObstacles[i].s1="images/boom.png";
        	myObstacles[i].width=84;
        	myObstacles[i].height=80;
        	myObstacles[i].s2="images/boom.png";
        	if(flag!=5)
        	{
        	score+=1;
        	myScore.s1="green";
        	arrowl[j].x=-100;
        }
        else{
        	flag=-1;
        	arrowl[j].x=-100;
        }
        } 
    }
    } 
    for (i = 0; i < myObstacles.length; i += 1) 
    {
    	for(j = 0; j < arrowr.length;j +=1)
        {
        if (myObstacles[i].crashWith(arrowr[j])) 
        {
             snd2.play();
        	if(myObstacles[i].s1=="images/boom.png")
        	{
        		flag=5;
        	}
            myObstacles[i].s1="images/boom.png";
        	myObstacles[i].width=84;
        	myObstacles[i].height=80;
        	myObstacles[i].s2="images/boom.png";
        	if(flag!=5)
        	{
        	score+=1;
        	myScore.s1="green";
        	arrowr[j].x=1300;
            }
            else
            {
        	flag=-1;
        	arrowr[j].x=1300;
            }
        }
    }

    }
    myScore.text="SCORE: " + score;
    mylevel.text="LEVEL: " + level;
    head.text="BOW AND ARROW";
    rules.text="INSTRUCTIONS-";
    GameOver.text=" GAME OVER";
    YouWon.text="YOU WON";
    rules2.update();
    myScore.update();
    mylevel.update();
    myGamePiece.newPos();    
    myGamePiece.update();
    birds.update();
    rec.update();
    head.update();
    rules.update();
    if(score<0)
    {
    	GameOver.update();
        myGameArea.stop();

    }
    if(level==5)
    {
    	YouWon.update();
    	myGameArea.stop();

    }
    
}
//function to check if framenumber is multiple of 150
function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}