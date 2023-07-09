function obstacleHitbox(x,y,left,right,bottom,top,spd){
  if(calc==0){
    for(var i in obstacles){
      eval("obs = obstacles."+i);
      eval("on"+i+"=0");
      for(var j in obs){         // 0=x 1=top y 2=width 3=height
        if(j > 0){
          eval(i+(j-1).toString()+"="+obs[j].slice(0,obs[j].length-1));
          boxHits[i+(j-1).toString()]=obs[j].slice(0,obs[j].length-1);
        }
      }
    } 
    string2="collidedY = false; collidedX = false;bot=0;";
    string3="if(";               // i did some performance testing and found out that writing a big string on one line is about 30% faster than writing it over multiple lines, depending on how many lines it would takes                                                                                                                                                                  
    for(var i in obstacles){                                                                //BOTTOM                                                                                                           //LEFT                                                                                             // RIGHT                                                                                       // TOP
      string2+= "if(x<"+i+"2+"+i+"0+right&&x>"+i+"0-left&&y>"+i+"1-bottom&&y<"+i+"1+"+i+"3+top){if(x>"+i+"0&&x<"+i+"0+"+i+"2&&y<="+i+"1+"+i+"3+top&&y>"+i+"1+"+i+"3-5){collidedY="+i+"1+"+i+"3+top+1;bot=1;}if(x>"+i+"0-left-2&&x<"+i+"0+spd&&y>"+i+"1&&y<"+i+"1+"+i+"3+top){collidedX="+i+"0-left-1;}if(x<"+i+"2+"+i+"0+right+2&&x>"+i+"2+"+i+"0-speed&&y>"+i+"1&&y<"+i+"1+"+i+"3+top){collidedX="+i+"2+"+i+"0+right+1;}if(x>"+i+"0-8&&x<"+i+"0+"+i+"2+8&&y<"+i+"1){collidedY="+i+"1-bottom+1;on"+i+"=1;}else{on"+i+"=0;}}else{on"+i+"=0;}";
      string3+="on"+i+"==0&&"      // These create the hitboxes for all the obstacles                                                                                                                                                                                  
    }
    string3 = string3.replace(/&&$/,"")+"){onsome=0;}else{onsome=1;} return onsome, collidedX, collidedY, bot"
    string2 += string3;                                                                                     
    checkHitbox = new Function("x,y,left,right,bottom,top,spd", string2);
    calc=1;               // puts the hitboxes into a new function
  }
  return checkHitbox(x,y,left,right,bottom,top,spd);

  //console.log(arguments.callee.caller)                        FIX
 // if(x>box0 && x<box2 && bottom>box1)        */
}
/*     OPENED VERSION OF STRING2
if(x<"+i+"2+"+i+"0+25&&x>"+i+"0-25&&y>"+i+"1-30&&y<"+i+"1+"+i+"3+100){
  if(x>"+i+"0-7&&x<"+i+"0+"+i+"2+7&&y<="+i+"1+"+i+"3+100&&y>"+i+"1){
    player_y="+i+"1+"+i+"3+101;
    jumpCheck=2;
  }
  if(x>"+i+"0-23&&x<"+i+"0+speed&&y>"+i+"1&&y<"+i+"1+"+i+"3+100){
    collidedX="+i+"0-24;
  }
  if(x<"+i+"2+"+i+"0+27&&x>"+i+"2+"+i+"0-speed&&y>"+i+"1&&y<"+i+"1+"+i+"3+100){
    collidedX="+i+"2+"+i+"0+26;
  }
  if(x>"+i+"0-8&&x<"+i+"0+"+i+"2+8&&y<"+i+"1){
    player_y="+i+"1-29;
    on"+i+"=1;
  }
  else{
    on"+i+"=0;
  }
}
else{
  on"+i+"=0;
}     */