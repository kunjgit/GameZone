function level1(){        // pointless function which just draws a small line to the bottom, I originally thought of doing the levels as functions but found a better way
  ctx.moveTo(0,canvas.height-18);
  ctx.lineTo(canvas.width,canvas.height-18);
  ctx.stroke();
}          
function backGround(){ // blue background 
  ctx.fillStyle = "#0000FF";
  ctx.clearRect(0,0,1530,740);
  ctx.fillRect(0,0,1530,740);
}
function sword(){   // just draws the sword
  if(swordInHand == 1){
    ctx.lineWidth = 1;
    ctx.strokeStyle = "#FF0000";
    switch(animation){
      case 0:
      case 1:
      default:                                                       // NOTE: The different cases only affect the animation and each are only varied by different x and y coordinates!!
       if(direction == 0 || direction == 3){
          ctx.save();         
          ctx.translate(player_x-28,player_y-24);
          ctx.rotate(-0.7);
          ctx.translate(-player_x+28,-player_y+24);
          ctx.moveTo(player_x-28,player_y-12);    
          ctx.lineTo(player_x-28,player_y-82);
          ctx.moveTo(player_x-33,player_y-27);
          ctx.lineTo(player_x-23,player_y-27);
          ctx.stroke();
          ctx.restore();
        }  
        if(direction == 1 || direction == 2){
          ctx.save(); 
          ctx.translate(player_x+28,player_y-24);                          
          ctx.rotate(0.7);
          ctx.translate(-player_x-28,-player_y+24);
          ctx.moveTo(player_x+28,player_y-12);                            
          ctx.lineTo(player_x+28,player_y-82);
          ctx.moveTo(player_x+33,player_y-27);
          ctx.lineTo(player_x+23,player_y-27);
          ctx.stroke();
          ctx.restore();
       }
        break;
      case 2:
      case 3:
      case 14:
      case 15:
        if(direction == 0 || direction == 3){
          ctx.save();
          ctx.translate(player_x-28,player_y-30);
          ctx.rotate(-0.5);
          ctx.translate(-player_x+28,-player_y+30);
          ctx.moveTo(player_x-28,player_y-18);                                        
          ctx.lineTo(player_x-28,player_y-88);
          ctx.moveTo(player_x-33,player_y-33);
          ctx.lineTo(player_x-23,player_y-33);
          ctx.stroke();
          ctx.restore();
        }  
        if(direction == 1 || direction == 2){
          ctx.save();
          ctx.translate(player_x+28,player_y-30);
          ctx.rotate(0.5);
          ctx.translate(-player_x-28,-player_y+30);
          ctx.moveTo(player_x+28,player_y-18);
          ctx.lineTo(player_x+28,player_y-88);
          ctx.moveTo(player_x+33,player_y-33);
          ctx.lineTo(player_x+23,player_y-33);
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 4:
      case 5:
      case 12:
      case 13:
        if(direction == 0 || direction == 3){
          ctx.save();
          ctx.translate(player_x-28,player_y-24);
          ctx.rotate(-0.3);
          ctx.translate(-player_x+28,-player_y+24);
          ctx.moveTo(player_x-28,player_y-24);
          ctx.lineTo(player_x-28,player_y-94);
          ctx.moveTo(player_x-33,player_y-39);
          ctx.lineTo(player_x-23,player_y-39);
          ctx.stroke();
          ctx.restore();
          }  
        if(direction == 1 || direction == 2){
          ctx.save();
          ctx.translate(player_x+28,player_y-24);
          ctx.rotate(0.3);
          ctx.translate(-player_x-28,-player_y+24);
          ctx.moveTo(player_x+28,player_y-24);
          ctx.lineTo(player_x+30,player_y-94);
          ctx.moveTo(player_x+33,player_y-39);
          ctx.lineTo(player_x+23,player_y-39);
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 6:
      case 7:
      case 10:
      case 11:
        if(direction == 0 || direction == 3){
          ctx.save();
          ctx.translate(player_x-28,player_y-30);
          ctx.rotate(-0.1);
          ctx.translate(-player_x+28,-player_y+30);
          ctx.moveTo(player_x-28,player_y-30);
          ctx.lineTo(player_x-28,player_y-100);
          ctx.moveTo(player_x-33,player_y-45);
          ctx.lineTo(player_x-23,player_y-45);
          ctx.stroke();
          ctx.restore();
        }  
        if(direction == 1 || direction == 2){
          ctx.save();
          ctx.translate(player_x+28,player_y-30);
          ctx.rotate(0.1);
          ctx.translate(-player_x-28,-player_y+30);
          ctx.moveTo(player_x+28,player_y-30);
          ctx.lineTo(player_x+28,player_y-100);
          ctx.moveTo(player_x+33,player_y-45);
          ctx.lineTo(player_x+23,player_y-45);
          ctx.stroke();
          ctx.restore();
        }
        break;
      case 8:
      case 9:
        if(direction == 0 || direction == 3){
          ctx.moveTo(player_x-30,player_y-30);
          ctx.lineTo(player_x-30,player_y-100);
          ctx.moveTo(player_x-35,player_y-45);
          ctx.lineTo(player_x-25,player_y-45);
          ctx.stroke();
        }  
        if(direction == 1 || direction == 2){
          ctx.moveTo(player_x+30,player_y-30);
          ctx.lineTo(player_x+30,player_y-100);
          ctx.moveTo(player_x+35,player_y-45);
          ctx.lineTo(player_x+25,player_y-45);
          ctx.stroke();
        }
        break;                    
    }               
  }  
}    
function stickMan(){       // draws the player
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#000000";
  ctx.moveTo(player_x,player_y);               //Body
  ctx.lineTo(player_x,player_y-50);
  ctx.stroke();    
  switch(animation){                     // NOTE: The different cases only affect the animation and each are only varied by different x and y coordinates!!
    case 0:
    case 1:
    default:
      if(direction == 0){                          // 0 = left
        ctx.moveTo(player_x-28,player_y-17);
        ctx.lineTo(player_x,player_y-40);
        ctx.stroke();
      }                                           // 1 = right
      if(direction == 1){
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+28,player_y-17);
        ctx.stroke();                                  // 2 = up
      }                                           // 3 = down
      if(direction == 2 || direction == 3){
        ctx.moveTo(player_x-28,player_y-17);        //Left arm
        ctx.lineTo(player_x,player_y-40);
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+28,player_y-17);
        ctx.stroke();    
      }        
      ctx.moveTo(player_x,player_y);               //Left Leg                                //X=400
      ctx.lineTo(player_x,player_y+30);                                                   //Y=250
      ctx.moveTo(player_x,player_y);               //Right leg
      ctx.lineTo(player_x,player_y+30);
      ctx.stroke();      
      break;
    case 2:
    case 3:
    case 14:
    case 15:
      if(direction == 0){                          // 0 = left
        ctx.moveTo(player_x-31,player_y-23);
        ctx.lineTo(player_x,player_y-40);
        ctx.stroke();
      }                                           // 1 = right
      if(direction == 1){
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+31,player_y-23);
        ctx.stroke();                                  // 2 = up
      }                                           // 3 = down
      if(direction == 2 || direction == 3){
        ctx.moveTo(player_x-31,player_y-23);        //Left arm
        ctx.lineTo(player_x,player_y-40);
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+31,player_y-23);
        ctx.stroke();    
      }
      ctx.moveTo(player_x,player_y);               //Left Leg                                //X=400
      ctx.lineTo(player_x-5,player_y+30);                                                   //Y=250
      ctx.moveTo(player_x,player_y);               //Right leg
      ctx.lineTo(player_x+5,player_y+30);
      ctx.stroke();      
      break;
    case 4:
    case 5:
    case 12:
    case 13:
      if(direction == 0){                          // 0 = left
        ctx.moveTo(player_x-35,player_y-29);
        ctx.lineTo(player_x,player_y-40);
        ctx.stroke();
      }                                           // 1 = right
      if(direction == 1){
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+35,player_y-29);
        ctx.stroke();                                  // 2 = up
      }                                           // 3 = down
      if(direction == 2 || direction == 3){
        ctx.moveTo(player_x-35,player_y-29);        //Left arm
        ctx.lineTo(player_x,player_y-40);
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+35,player_y-29);
        ctx.stroke();    
      }
      ctx.moveTo(player_x,player_y);               //Left Leg                                //X=400
      ctx.lineTo(player_x-10,player_y+30);                                                   //Y=250
      ctx.moveTo(player_x,player_y);               //Right leg
      ctx.lineTo(player_x+10,player_y+30);
      ctx.stroke();      
      break;
    case 6:
    case 7:
    case 10:
    case 11:
      if(direction == 0){                          // 0 = left
        ctx.moveTo(player_x-30,player_y-35);
        ctx.lineTo(player_x,player_y-40);
        ctx.stroke();
      }                                           // 1 = right
      if(direction == 1){
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+30,player_y-35);
        ctx.stroke();                                  // 2 = up
      }                                           // 3 = down
      if(direction == 2 || direction == 3){
        ctx.moveTo(player_x-30,player_y-35);        //Left arm
        ctx.lineTo(player_x,player_y-40);
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+30,player_y-35);
        ctx.stroke();    
      }
      ctx.moveTo(player_x,player_y);               //Left Leg                                //X=400
      ctx.lineTo(player_x-15,player_y+30);                                                   //Y=250
      ctx.moveTo(player_x,player_y);               //Right leg
      ctx.lineTo(player_x+15,player_y+30);
      ctx.stroke();      
      break;
    case 8:
    case 9:
      if(direction == 0){                          // 0 = left
        ctx.moveTo(player_x-35,player_y-40);
        ctx.lineTo(player_x,player_y-40);
        ctx.stroke();
      }                                           // 1 = right
      if(direction == 1){
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+35,player_y-40);
        ctx.stroke();                                  // 2 = up
      }                                           // 3 = down
      if(direction == 2 || direction == 3){
        ctx.moveTo(player_x-35,player_y-32);        //Left arm
        ctx.lineTo(player_x,player_y-40);
        ctx.moveTo(player_x,player_y-40);           //Right arm
        ctx.lineTo(player_x+35,player_y-32);
        ctx.stroke();    
      }
      ctx.moveTo(player_x,player_y);               //Left Leg                                //X=400
      ctx.lineTo(player_x-20,player_y+30);                                                   //Y=250
      ctx.moveTo(player_x,player_y);               //Right leg
      ctx.lineTo(player_x+20,player_y+30);
      ctx.stroke();      
      break;                                                 
  }
  switch(direction){
    case 0:
      ctx.beginPath();
      ctx.arc(player_x,player_y-75,25,0,2*Math.PI);   //Head
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.beginPath();
      ctx.arc(player_x-10,player_y-80,3,0,2*Math.PI);    //Left eye
      ctx.fillStyle = "#000000";
      ctx.fill();
      ctx.beginPath();
      ctx.closePath();
      ctx.moveTo(player_x-15,player_y-65);               //Mouth
      ctx.lineTo(player_x-5,player_y-65);               //Needs to be down here or else it'll go behind the head
      ctx.stroke();
      break;    
    case 1:
      ctx.beginPath();
      ctx.arc(player_x,player_y-75,25,0,2*Math.PI);   //Head
      ctx.fillStyle = "#FFFFFF";
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = "#000000";
      ctx.arc(player_x+12,player_y-80,3,0,2*Math.PI);    //Right eye
      ctx.fill();
      ctx.beginPath();
      ctx.closePath();      
      ctx.moveTo(player_x+5,player_y-65);               //Mouth
      ctx.lineTo(player_x+15,player_y-65);               //Needs to be down here or else it'll go behind the head
      ctx.stroke();
      break;                                           
  } 
}