var display_name;
var choice;


document.getElementById("result-box").style.display="none";
document.getElementById("game-container").style.display="none";
document.getElementById("choose").style.display="none";
document.getElementById("toss-win-container").style.display="none";


// Function for Toss

function toss_fun(){
    
    display_name = document.getElementById("name-input").value.split(" ").join("");

    if(document.getElementById("name-input").value.split(" ").join("")==="") {
        alert("Please Enter your Name.")
    }
    else{
        if(Math.round(Math.random()) ==1) 
        {
            document.getElementById("outcome").innerHTML="You won the Toss.";      
            document.getElementById("choose").style.display="block";
            document.getElementById("toss-win-container").style.display="block";
        }
        else
         {
            if(Math.round(Math.random()) ==1){
                document.getElementById("outcome").innerHTML="You lost the Toss. Computer chose to Bat first.<br/> Wait a moment.";
                choice=false;   // Player will ball first
                setTimeout(first_ball,5000);
                    }
            else{
                document.getElementById("outcome").innerHTML="You lost the Toss. Computer chose to Ball first.<br/> Wait a moment."
                choice=true;   // Player will bat first
                setTimeout(first_bat,5000);
                    }
        }
        document.getElementById("toss").style.display="none";
        document.getElementById("toss-container").style.display="none";
        document.getElementById("display-name").innerHTML=display_name;
        }
    }




//Game Starts


const run_1 = document.getElementById("run_1");
const run_2 = document.getElementById("run_2");
const run_3 = document.getElementById("run_3");
const run_4 = document.getElementById("run_4");
const run_5 = document.getElementById("run_5");
const run_6 = document.getElementById("run_6");
var player_run, computer_run,target, player_score=0, computer_score=0,outcome, flag=true;




// If player bats first.  

function first_bat(){
    
    document.getElementById("game-name").style.width="62vw";
    document.getElementById("game-name").style.fontSize="4vw";
    document.getElementById("choose-point").style.display="none";
    point = document.getElementById("head").innerHTML;
    document.getElementById("game-container").style.display="grid";
   
    document.getElementById("first-inning-score").innerHTML=display_name+"-"+ player_score;
    document.getElementById("second-inning-score").innerHTML="COMPUTER -"+ computer_score;


    run_1.addEventListener('click', function(){
        if(flag) first_bat_game(1);
        else second_ball_game(1);
    })
    run_2.addEventListener('click', function(){
        if(flag) first_bat_game(2);
        else second_ball_game(2);
    })
    run_3.addEventListener('click', function(){
        if(flag) first_bat_game(3);
        else second_ball_game(3);
    })
    run_4.addEventListener('click', function(){
        if(flag) first_bat_game(4);
        else second_ball_game(4);
    })
    run_5.addEventListener('click', function(){
        if(flag) first_bat_game(5);
        else second_ball_game(5);
    })
    run_6.addEventListener('click', function(){
        if(flag) first_bat_game(6);
        else second_ball_game(6);
    })
}  


// If player bats first and player is batting

function first_bat_game(player_run) {

    computer_run=Math.round(Math.random()*5+1);
    if(computer_run==1) document.getElementById("computer-run").innerHTML='<img src="images/one.png" alt="ONE" class="run" />';
    if(computer_run==2) document.getElementById("computer-run").innerHTML='<img src="images/two.png" alt="TWO" class="run" />';
    if(computer_run==3) document.getElementById("computer-run").innerHTML='<img src="images/three.png" alt="THREE" class="run"  />';
    if(computer_run==4) document.getElementById("computer-run").innerHTML='<img src="images/four.png" alt="FOUR"  class="run" />';
    if(computer_run==5) document.getElementById("computer-run").innerHTML='<img src="images/five.png" alt="FIVE" class="run" />';
    if(computer_run==6) document.getElementById("computer-run").innerHTML='<img src="images/six.png" alt="SIX"  class="run" />';
    if(computer_run!=player_run)    {
         player_score+=player_run;
         document.getElementById("first-inning-score").innerHTML=display_name+"-"+ player_score;
         document.getElementById("second-inning-score").innerHTML="COMPUTER -"+ computer_score;

             }

    else{
        document.getElementById("first-inning-score").innerHTML=display_name+"-"+ player_score + "  [OUT]";
        flag=false;
        }
}


// If player bats first and player is bowling


function second_ball_game(player_run){


    computer_run=Math.round(Math.random()*5+1);
    if(computer_run==1) document.getElementById("computer-run").innerHTML='<img src="images/one.png" alt="ONE" class="run" />';
    if(computer_run==2) document.getElementById("computer-run").innerHTML='<img src="images/two.png" alt="TWO" class="run" />';
    if(computer_run==3) document.getElementById("computer-run").innerHTML='<img src="images/three.png" alt="THREE" class="run"  />';
    if(computer_run==4) document.getElementById("computer-run").innerHTML='<img src="images/four.png" alt="FOUR"  class="run" />';
    if(computer_run==5) document.getElementById("computer-run").innerHTML='<img src="images/five.png" alt="FIVE" class="run" />';
    if(computer_run==6) document.getElementById("computer-run").innerHTML='<img src="images/six.png" alt="SIX"  class="run" />';

    if(computer_run!=player_run)    {
        computer_score+=computer_run;
        document.getElementById("first-inning-score").innerHTML=display_name+"-"+ player_score + "  [OUT]";
        document.getElementById("second-inning-score").innerHTML="COMPUTER -"+ computer_score;

        if(computer_score>player_score){  outcome=-1; result(); }
            }

   else{
       document.getElementById("second-inning-score").innerHTML="COMPUTER -"+ computer_score + "  [OUT]";
       if(computer_score==player_score) {
                outcome=0;
                result(); 
    }
        else {outcome=1; result(); }
       }

}








// If player bowls first.  

function first_ball(){
    
    document.getElementById("game-name").style.width="62vw";
    document.getElementById("game-name").style.fontSize="4vw";
    document.getElementById("choose-point").style.display="none";
    point = document.getElementById("head").innerHTML;
    document.getElementById("game-container").style.display="grid";
   
    document.getElementById("first-inning-score").innerHTML=display_name+"-"+ player_score;
    document.getElementById("second-inning-score").innerHTML="COMPUTER -"+ computer_score;


    run_1.addEventListener('click', function(){
        if(flag) first_ball_game(1);
        else second_bat_game(1);
    })
    run_2.addEventListener('click', function(){
        if(flag) first_ball_game(2);
        else second_bat_game(2);
    })
    run_3.addEventListener('click', function(){
        if(flag) first_ball_game(3);
        else second_bat_game(3);
    })
    run_4.addEventListener('click', function(){
        if(flag) first_ball_game(4);
        else second_bat_game(4);
    })
    run_5.addEventListener('click', function(){
        if(flag) first_ball_game(5);
        else second_bat_game(5);
    })
    run_6.addEventListener('click', function(){
        if(flag) first_ball_game(6);
        else second_bat_game(6);
    })
}  





// If player bowls first and player is batting


function first_ball_game(player_run){


    computer_run=Math.round(Math.random()*5+1);
    if(computer_run==1) document.getElementById("computer-run").innerHTML='<img src="images/one.png" alt="ONE" class="run" />';
    if(computer_run==2) document.getElementById("computer-run").innerHTML='<img src="images/two.png" alt="TWO" class="run" />';
    if(computer_run==3) document.getElementById("computer-run").innerHTML='<img src="images/three.png" alt="THREE" class="run"  />';
    if(computer_run==4) document.getElementById("computer-run").innerHTML='<img src="images/four.png" alt="FOUR"  class="run" />';
    if(computer_run==5) document.getElementById("computer-run").innerHTML='<img src="images/five.png" alt="FIVE" class="run" />';
    if(computer_run==6) document.getElementById("computer-run").innerHTML='<img src="images/six.png" alt="SIX"  class="run" />';
     
    if(computer_run!=player_run)    {
        computer_score+=computer_run;
        document.getElementById("first-inning-score").innerHTML="COMPUTER -"+ computer_score;
        document.getElementById("second-inning-score").innerHTML=display_name+"-"+ player_score;

            }

   else{
       flag=false;
       document.getElementById("first-inning-score").innerHTML="COMPUTER -"+ computer_score + "  [OUT]";
       
       }

}






// If player bowls first and player is bowling

function second_bat_game(player_run) {


    document.getElementById("first-inning-score").innerHTML="COMPUTER -"+ computer_score+ "  [OUT]";
    computer_run=Math.round(Math.random()*5+1);
    if(computer_run==1) document.getElementById("computer-run").innerHTML='<img src="images/one.png" alt="ONE" class="run" />';
    if(computer_run==2) document.getElementById("computer-run").innerHTML='<img src="images/two.png" alt="TWO" class="run" />';
    if(computer_run==3) document.getElementById("computer-run").innerHTML='<img src="images/three.png" alt="THREE" class="run"  />';
    if(computer_run==4) document.getElementById("computer-run").innerHTML='<img src="images/four.png" alt="FOUR"  class="run" />';
    if(computer_run==5) document.getElementById("computer-run").innerHTML='<img src="images/five.png" alt="FIVE" class="run" />';
    if(computer_run==6) document.getElementById("computer-run").innerHTML='<img src="images/six.png" alt="SIX"  class="run" />';
    
    if(computer_run!=player_run)    {
         player_score+=player_run;
         document.getElementById("first-inning-score").innerHTML="COMPUTER -"+ computer_score+ "  [OUT]";
         document.getElementById("second-inning-score").innerHTML=display_name+"-"+ player_score;

         if(player_score>computer_score){  outcome=1; result(); }

             }

    else{
        document.getElementById("second-inning-score").innerHTML=display_name+"-"+ player_score + "  [OUT]";
        if(computer_score==player_score) {
            outcome=0;
            result(); 
            }
        else {outcome=-1; result(); }
        }
}



// Function if both innings get end, i.e. result of the game



function result(){
    document.getElementById("result-box").style.display="block";
    document.getElementById("run_1").disabled="true";
    document.getElementById("run_2").disabled="true";
    document.getElementById("run_3").disabled="true";
    document.getElementById("run_4").disabled="true";
    document.getElementById("run_5").disabled="true";
    document.getElementById("run_6").disabled="true";
    if(outcome==1)  {
        document.getElementById("display_result").innerHTML=display_name + " WON !!";
    }
    else if(outcome==0)  document.getElementById("display_result").innerHTML=" DRAW !!";
    else  document.getElementById("display_result").innerHTML=display_name + " LOST !!";
}

function restart_the_game(){
    window.location.reload();
}