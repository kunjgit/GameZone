var Canvas = document.getElementById("canvas");
Canvas.width=document.body.clientWidth;
Canvas.height=document.body.clientHeight;
var ctx = Canvas.getContext("2d");
canvas.width=500;
canvas.height=700;
var knife= new Image();
knife.src="knife.png";
var startAngle = (2*Math.PI);
var endAngle = (Math.PI*2);      
var currentAngle = 0;             
var rectheight=Canvas.height-90;  
var knife_moving=0;              
var knifes_remaining=10;          
var hit=0;                        
var level=1;
var flag=0;
var hit_knifes=[];

var raf = window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    window.oRequestAnimationFrame;

function check_rect_collision(curarc)
    {
      console.log(curarc.current_angle);
      for(i in hit_knifes)
      {
        if(Math.abs(curarc.current_angle-hit_knifes[i].cangle)<0.15)
        {
        ctx.clearRect(0,0,Canvas.width/2,Canvas.height/2);
        alert("GAME OVER!")
        window.location.reload();
        }
      }
    }


function check_collision(curarc,currec)
{
if(currec.y-curarc.centerY<=curarc.radius)
{

  hit=1;
  
  check_rect_collision(curarc);
  hit_knifes.push({
			x:currec.x,
			y:currec.y,
			width:currec.width,
      height:currec.height,
      r:curarc.radius,
      angle:0,
      cangle:curarc.current_angle
			});
      knifes_remaining--;
  return true;
}
return false;
}



function change_status()
{
  if(knife_moving===0)
  knife_moving=1;

}


function Update(){

  if(level==2 && flag==0)
  {
    hit_knifes=[];
    currentAngle = 0;
    hit_knifes.push({
        x:Canvas.width/2,
        y:295,
        width:40,
        height:80,
        r:100,
        angle:0,
        cangle:0
        });
      hit_knifes.push({
            x:Canvas.width/2,
            y:295,
            width:40,
            height:80,
            r:100,
            angle:2.35,
            cangle:2.35
            });
        hit_knifes.push({
                x:Canvas.width/2,
                y:295,
                width:40,
                height:80,
                r:100,
                angle:4.27,
                cangle:4.27
                });
    knifes_remaining=8;
    flag++;
  }

  if(level==3 && flag==1)
  {
    hit_knifes=[];
    currentAngle = 0;
    knifes_remaining=10;
    flag++;
  }

  if(level==4 && flag==2)
  {
    hit_knifes=[];
    currentAngle = 0;
    knifes_remaining=12;
    flag++;
  }

  if(knifes_remaining>0)
  {
  if(rectheight<0 || hit==1)
  {
    rectheight=Canvas.height-90;
    knife_moving=0;
    hit=0;
  }
  document.getElementById("Knifes_rem").innerHTML="Knifes Remaining:"+(knifes_remaining-1);
    var current_arc=
    {
      "centerX":Canvas.width/2,
      "centerY":200,
      "radius":100,
      "current_angle":currentAngle,
      "direction":false,
      "lineWidth":33
    }


    ctx.clearRect(0,0,Canvas.width,Canvas.height);
    ctx.beginPath();
    ctx.drawImage(knife,Canvas.width/2,rectheight,40,80);
    ctx.fillStyle="red";
    var current_rec=
    {
      "x":Canvas.width/2,
      "y":rectheight,
      "width":40,
      "height":80,
    }
    if(Object.keys(hit_knifes).length >0 )
    {
    for(i in hit_knifes)
    {
      ctx.save();
      ctx.translate(Canvas.width/2,200);
      ctx.beginPath();
      if(level==3)
      ctx.rotate(6.28-hit_knifes[i].angle);
      else if(level==4 && knifes_remaining%2==0)
      ctx.rotate(hit_knifes[i].angle);
      else if(level==4 && knifes_remaining%2!=0)
      ctx.rotate(6.28-hit_knifes[i].angle);
      else
      ctx.rotate(hit_knifes[i].angle);
      ctx.fillStyle="red";
      ctx.drawImage(knife,hit_knifes[i].x-Canvas.width/2,hit_knifes[i].y-200,40,80);
      ctx.closePath();
      ctx.translate(-Canvas.width/2,-200);
      ctx.restore();
        hit_knifes[i].angle+=Math.PI/180;
        hit_knifes[i].angle%=2*Math.PI;
    }
    }
	
    ctx.beginPath();
    ctx.arc(canvas.width/2, 200,100, startAngle + currentAngle, startAngle+currentAngle+Math.PI*2, false);

    ctx.strokeStyle ="blue";
    ctx.lineWidth = 33.0;
    ctx.stroke();

    currentAngle +=Math.PI/180;

    currentAngle %= 2 * Math.PI;
    ctx.closePath();

    if(knife_moving===1)
    rectheight-=15;
  
    document.getElementById("Level").innerHTML=level;
    var result=check_collision(current_arc,current_rec);

    raf(Update);
  }
  else
  {
    alert("YOU COMPLETED A LEVEL !");
    if(level==4)
    {
      alert("Thank you for your visit");
      window.location.reload();
    }
    level++;
    raf(Update);
  }

}
raf(Update);
