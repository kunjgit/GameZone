for(var i=1;i<=100;i++){
    document.getElementById(i).innerHTML=i;
}

//image slider

var arr=['<img src="i8.png" id="poster">','<img src="i4.jfif" id="poster">','<img src="i10.png" id="poster">','<img src="i2.jpg" id="poster">'];

var dice=['<img src="1.png">','<img src="2.png">','<img src="3.png">','<img src="4.png">','<img src="5.png">','<img src="6.png">'];

var turn=0;
setInterval(() => {
    turn++;
    if(turn==4){
        turn=0;
    }
    document.getElementById('image_slide').innerHTML=arr[turn];
}, 3000);


var p1,p2,p3,p4;

//functionality of ludo
var game_type;
function choose_player(){
      game_type=prompt('choose Game TYPE');
      if(game_type==2){
          document.getElementById('image_slide').style.visibility='hidden';
          document.getElementById("player1").style.visibility='visible';
          document.getElementById("player2").style.visibility='visible';
          document.getElementById("dice").style.visibility='visible';
          document.getElementById('choose_player').removeAttribute('onclick');
      }
      else if(game_type==3){
          document.getElementById('image_slide').style.visibility='hidden';
          document.getElementById("player1").style.visibility='visible';
          document.getElementById("player2").style.visibility='visible';
          document.getElementById("player3").style.visibility='visible';
          document.getElementById("play").style.top='85%';
          document.getElementById("dice").style.top='62%';
          document.getElementById("dice").style.visibility='visible';
          document.getElementById('choose_player').removeAttribute('onclick');
      }
      else if(game_type==4){
          document.getElementById('image_slide').style.visibility='hidden';
          document.getElementById("player1").style.visibility='visible';
          document.getElementById("player2").style.visibility='visible';
          document.getElementById("player3").style.visibility='visible';
          document.getElementById("player4").style.visibility='visible';
          document.getElementById("dice").style.visibility='visible';
          document.getElementById("play").style.left='0%';
          document.getElementById("dice").style.top='76%';
          document.getElementById("dice").style.left='17%';
          document.getElementById('choose_player').removeAttribute('onclick');
      }

      else{
          alert('please choose valid no. of player. choose the no. 2,3 or 4 !!');
          game_type=undefined;
      }

}

//start function

function start(){
    if(game_type==undefined){
        alert('FIRST CHOOSE THE TYPE OF GAME !!');
    }
    else{
        if(game_type==2){
            if(document.getElementById('select1').value==document.getElementById('select2').value){
                alert("please select two different color !!");
            }
            else{
           document.getElementById("play").innerHTML='PLAY';
           if(document.getElementById("red").id!=document.getElementById("select1").value && document.getElementById("red").id!=document.getElementById('select2').value){
                  document.getElementById("red").style.visibility="hidden";
           }
           if(document.getElementById("green").id!=document.getElementById("select1").value && document.getElementById("green").id!=document.getElementById('select2').value){
                  document.getElementById("green").style.visibility="hidden";
           }
           if(document.getElementById("blue").id!=document.getElementById("select1").value && document.getElementById("blue").id!=document.getElementById('select2').value){
                  document.getElementById("blue").style.visibility="hidden";
           }
           if(document.getElementById("yellow").id!=document.getElementById("select1").value && document.getElementById("yellow").id!=document.getElementById('select2').value){
                  document.getElementById("yellow").style.visibility="hidden";
           }
           document.getElementById("select1").setAttribute("disabled","disabled");
           document.getElementById("select2").setAttribute("disabled","disabled");
        }
           
        }

        else if(game_type==3){
            if(document.getElementById('select1').value==document.getElementById('select2').value || document.getElementById('select1').value==document.getElementById('select3').value || document.getElementById('select2').value==document.getElementById("select3").value){
                alert("please select  different color !!");
            }
            else{
           document.getElementById("play").innerHTML='PLAY';
           if(document.getElementById("red").id!=document.getElementById("select1").value && document.getElementById("red").id!=document.getElementById('select2').value && document.getElementById("red").id!=document.getElementById('select3').value){
                  document.getElementById("red").style.visibility="hidden";
           }
           else if(document.getElementById("green").id!=document.getElementById("select1").value && document.getElementById("green").id!=document.getElementById('select2').value && document.getElementById("green").id!=document.getElementById('select3').value){
                  document.getElementById("green").style.visibility="hidden";
           }
           else if(document.getElementById("blue").id!=document.getElementById("select1").value && document.getElementById("blue").id!=document.getElementById('select2').value && document.getElementById("blue").id!=document.getElementById('select3').value){
                  document.getElementById("blue").style.visibility="hidden";
           }
           else if(document.getElementById("yellow").id!=document.getElementById("select1").value && document.getElementById("yellow").id!=document.getElementById('select2').value && document.getElementById("yellow").id!=document.getElementById('select3').value){
                  document.getElementById("yellow").style.visibility="hidden";
           }
           document.getElementById("select1").setAttribute("disabled","disabled");
           document.getElementById("select2").setAttribute("disabled","disabled");
           document.getElementById("select3").setAttribute("disabled","disabled");
        }
           
        }
        else{
            document.getElementById("play").innerHTML='PLAY';
            document.getElementById("select1").setAttribute("disabled","disabled");
            document.getElementById("select2").setAttribute("disabled","disabled");
            document.getElementById("select3").setAttribute("disabled","disabled");
            document.getElementById("select4").setAttribute("disabled","disabled");
        }
        document.getElementById("play").setAttribute("onclick","play()");
    p1=document.getElementById("select1").value;
    p2=document.getElementById("select2").value;
    p3=document.getElementById("select3").value;
    p4=document.getElementById("select4").value;
    }
}


var my_turn=0;
var previousFirst=0;
var previousSec=0;
var previousThird=0;
var previousFourth=0;
function play(){
    var random_no=Math.floor(Math.random()*6);
    document.getElementById("dice").innerHTML=dice[random_no];
    //2 player game
    if(game_type==2){
        if(my_turn==0){
            if(previousFirst>0){
                if(100-previousFirst<random_no+1){
                   my_turn++;
                   return;
                }
                else{
                document.getElementById((previousFirst).toString()).innerHTML=previousFirst;
                document.getElementById((previousFirst).toString()).style.color='black';
                }
                }
          document.getElementById((previousFirst+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=;font-size:xx-large;></i>";
          document.getElementById((previousFirst+random_no+1).toString()).style.color=p1;
          if((previousFirst+random_no+1)==100){
              setTimeout(() => {
                  alert("player1 is winner !!");
                  window.location.reload();
              }, 800);
              
          }
          previousFirst=previousFirst+random_no+1;
          
          previousFirst=snake(previousFirst,p1,previousFirst);
          previousFirst=ladder(previousFirst,p1,previousFirst);
          my_turn++;
        }
        else{
            if(previousSec>0){
                if(100-previousSec<random_no+1){
                    my_turn--;
                   return;
                }
                else{
                document.getElementById((previousSec).toString()).innerHTML=previousSec;
                document.getElementById((previousSec).toString()).style.color='black';
                }
                }
            document.getElementById((previousSec+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
            document.getElementById((previousSec+random_no+1).toString()).style.color=p2;
            if((previousSec+random_no+1)==100){
                setTimeout(() => {
                    alert("player2 is winner !!");
                    window.location.reload();
                }, 800);
                
            }
            previousSec=previousSec+random_no+1;
            previousSec= snake(previousSec,p2,previousSec);
            previousSec= ladder(previousSec,p2,previousSec);
            my_turn--;
          } 
    }

    //3 player game

    else if(game_type==3){
        if(my_turn==0){
            if(previousFirst>0){
                if(100-previousFirst<random_no+1){

                }
                else{
                document.getElementById((previousFirst).toString()).innerHTML=previousFirst;
                document.getElementById((previousFirst).toString()).style.color='black';
                }
                }
          document.getElementById((previousFirst+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=;font-size:xx-large;></i>";
          document.getElementById((previousFirst+random_no+1).toString()).style.color=p1;
          if((previousFirst+random_no+1)==100){
              setTimeout(() => {
                  alert("player1 is winner !!");
                  window.location.reload();
              }, 800);
              
          }
          previousFirst=previousFirst+random_no+1;
          
          previousFirst=snake(previousFirst,p1,previousFirst);
          previousFirst=ladder(previousFirst,p1,previousFirst);
          my_turn++;
        }
        else if(my_turn==1){
            if(previousSec>0){
                if(100-previousSec<random_no+1){

                }
                else{
                document.getElementById((previousSec).toString()).innerHTML=previousSec;
                document.getElementById((previousSec).toString()).style.color='black';
                }
                }
            document.getElementById((previousSec+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
            document.getElementById((previousSec+random_no+1).toString()).style.color=p2;
            if((previousSec+random_no+1)==100){
                setTimeout(() => {
                    alert("player2 is winner !!");
                    window.location.reload();
                }, 800);
                
            }
            previousSec=previousSec+random_no+1;
            previousSec= snake(previousSec,p2,previousSec);
            previousSec= ladder(previousSec,p2,previousSec);
            my_turn++;
          } 
          else{
            if(previousThird>0){
                if(100-previousThird<random_no+1){

                }
                else{
                document.getElementById((previousThird).toString()).innerHTML=previousThird;
                document.getElementById((previousThird).toString()).style.color='black';
                }
                }
            document.getElementById((previousThird+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
            document.getElementById((previousThird+random_no+1).toString()).style.color=p3;
            if((previousThird+random_no+1)==100){
                setTimeout(() => {
                    alert("player3 is winner !!");
                    window.location.reload();
                }, 800);
                
            }
            previousThird=previousThird+random_no+1;
            previousThird= snake(previousThird,p3,previousThird);
            previousThird= ladder(previousThird,p3,previousThird);
            my_turn=0;
          }
    }

    // 4 player game

    else if(game_type==4){

        if(my_turn==0){
            if(previousFirst>0){
                if(100-previousFirst<random_no+1){

                }
                else{
                document.getElementById((previousFirst).toString()).innerHTML=previousFirst;
                document.getElementById((previousFirst).toString()).style.color='black';
                }
                }
          document.getElementById((previousFirst+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=;font-size:xx-large;></i>";
          document.getElementById((previousFirst+random_no+1).toString()).style.color=p1;
          if((previousFirst+random_no+1)==100){
              setTimeout(() => {
                  alert("player1 is winner !!");
                  window.location.reload();
              }, 800);
              
          }
          previousFirst=previousFirst+random_no+1;
          
          previousFirst=snake(previousFirst,p1,previousFirst);
          previousFirst=ladder(previousFirst,p1,previousFirst);
          my_turn++;
        }
        else if(my_turn==1){
            if(previousSec>0){
                if(100-previousSec<random_no+1){

                }
                else{
                document.getElementById((previousSec).toString()).innerHTML=previousSec;
                document.getElementById((previousSec).toString()).style.color='black';
                }
                }
            document.getElementById((previousSec+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
            document.getElementById((previousSec+random_no+1).toString()).style.color=p2;
            if((previousSec+random_no+1)==100){
                setTimeout(() => {
                    alert("player2 is winner !!");
                    window.location.reload();
                }, 800);
                
            }
            previousSec=previousSec+random_no+1;
            previousSec= snake(previousSec,p2,previousSec);
            previousSec= ladder(previousSec,p2,previousSec);
            my_turn++;
          } 
          else if(my_turn==2){
            if(previousThird>0){
                if(100-previousThird<random_no+1){

                }
                else{
                document.getElementById((previousThird).toString()).innerHTML=previousThird;
                document.getElementById((previousThird).toString()).style.color='black';
                }
                }
            document.getElementById((previousThird+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
            document.getElementById((previousThird+random_no+1).toString()).style.color=p3;
            if((previousThird+random_no+1)==100){
                setTimeout(() => {
                    alert("player3 is winner !!");
                    window.location.reload();
                }, 800);
                
            }
            previousThird=previousThird+random_no+1;
            previousThird= snake(previousThird,p3,previousThird);
            previousThird= ladder(previousThird,p3,previousThird);
            my_turn++;
          }

          else{
            if(previousFourth>0){
                if(100-previousFourth<random_no+1){

                }
                else{
                document.getElementById((previousFourth).toString()).innerHTML=previousFourth;
                document.getElementById((previousFourth).toString()).style.color='black';
                }
                }
            document.getElementById((previousFourth+random_no+1).toString()).innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
            document.getElementById((previousFourth+random_no+1).toString()).style.color=p4;
            if((previousFourth+random_no+1)==100){
                setTimeout(() => {
                    alert("player4 is winner !!");
                    window.location.reload();
                }, 800);
                
            }
            previousFourth=previousFourth+random_no+1;
            previousFourth= snake(previousFourth,p4,previousFourth);
            previousFourth= ladder(previousFourth,p4,previousFourth);
            my_turn=0;
          }

    }

    

    
}

//snake function

function snake(place_no,color_given,previous_player){
    if(place_no==26){
            document.getElementById("26").innerHTML=26;
        document.getElementById("26").style.color='black';
        document.getElementById("4").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("4").style.color=color_given;
      return 4;

    }
    else if(place_no==94){
        document.getElementById("94").innerHTML=94;
        document.getElementById("94").style.color='black';
        document.getElementById("18").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("18").style.color=color_given;
        return 18;
    }
    else if(place_no==63){
        document.getElementById("63").innerHTML=63;
        document.getElementById("63").style.color='black';
        document.getElementById("21").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("21").style.color=color_given;
        return 21;
    }
    else if(place_no==80){
        document.getElementById("80").innerHTML=80;
        document.getElementById("80").style.color='black';
        document.getElementById("58").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("58").style.color=color_given;
        return 58;
    }
    else if(place_no==73){
        document.getElementById("73").innerHTML=73;
        document.getElementById("73").style.color='black';
        document.getElementById("50").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("50").style.color=color_given;
        return 50;
    }
    else if(place_no==98){
        document.getElementById("98").innerHTML=98;
        document.getElementById("98").style.color='black';
        document.getElementById("29").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("29").style.color=color_given;
        return 29;
    }
    else{
        return previous_player;
    }
   
}

//ladder function

function ladder(place_no,color_given,previous_player){
    if(place_no==3){
        document.getElementById("3").innerHTML=3;
        document.getElementById("3").style.color='black';
        document.getElementById("24").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("24").style.color=color_given;
        return 24;
    }
    else if(place_no==13){
        document.getElementById("13").innerHTML=13;
        document.getElementById("13").style.color='black';
        document.getElementById("95").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
        document.getElementById("95").style.color=color_given;
        return 95;
    }
   else if(place_no==12){
    document.getElementById("12").innerHTML=12;
    document.getElementById("12").style.color='black';
    document.getElementById("52").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
    document.getElementById("52").style.color=color_given;
    return 52;
   }
   else if(place_no==61){
    document.getElementById("61").innerHTML=61;
    document.getElementById("61").style.color='black';
    document.getElementById("99").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
    document.getElementById("99").style.color=color_given;
    return 99;
   }
   else if(place_no==72){
    document.getElementById("72").innerHTML=72;
    document.getElementById("72").style.color='black';
    document.getElementById("91").innerHTML="<i class='fas fa-chess-pawn' style=font-size:xx-large;></i>";
    document.getElementById("91").style.color=color_given;
    return 91;
   }
   else{
       return previous_player;
   }
}