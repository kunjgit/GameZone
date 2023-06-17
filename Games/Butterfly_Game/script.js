setInterval(moveIt,1000);
function moveIt(){butterfly.style.left= Math.random()*300+"px"
               butterfly.style.top=Math.random()*300+"px"
               }
var score=0;
function catchIt(){
  
  score++;
  document.getElementById("score").innerHTML="Score: "+ score;
                  }