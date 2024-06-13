var playing = false;
var score;
var trialsleft;
var step;//for random steps
var action;//for settime interval
var fruits = ['1','2','3','4','5','6','7','8','9','10'];//for fruits

$(function(){
    //click on start or reset button
    $('#front').show();
    $("#startReset").click(function () {
        if(playing == true){
            //if we are playing
            location.reload();//reload page
        }else{
            //if we are not playing from before
            $('#front').hide();
            $('#score').show();
            playing = true;
            //set score to 0
            score = 0;
            $("#scoreValue").html(score);

            //show trials left box

            $('#trialsleft').show();
            trialsleft=3;
            addhearts();

            //hide game over box
            $('#gameOver').hide();

            //change button to reset game
            $('#startReset').html('Reset Game')


            //start action
            startAction();
        }
    });
        //slice a fruit
        $("#fruit1").mouseover(function () {
            score++;// increase score
            $("#scoreValue").html(score);

            //play sound
            $("#slicesound")[0].play();

            //stop fruit
            clearInterval(action);

            //hide fruit
            $('#fruit1').hide("explode",500);//slice fruit

            //send new fruit
            setTimeout(startAction,500);
        });


  //functions

   //addhearts
   function addhearts() {
    $('#trialsleft').empty();
    for(i = 0 ; i < trialsleft ; i++){
        $('#trialsleft').append('<img src="./assets/wrong.png" , class="life">');
    }
}

  //start action
  function startAction(){
      //generate random fruit
      $('#fruit1').show();

      //choose random fruit
      chooseRandom();
      //random position
      $('#fruit1').css({
          'left': Math.round(550 * Math.random()),
          'top': -50
      });
      //generate random step
      step=1 + Math.round(5 * Math.random());//change steps
      //descend fruits down by 10ms
      action = setInterval(function(){
          //move fruit by one step
          $('#fruit1').css('top', $('#fruit1').position().top + step);

          //check if the fruit is too low
          if($('#fruit1').position().top > $('#fruitcontainer').height()-50){
              //yes it is low
              // check trails left
              if(trialsleft > 1){
                  //generate a fruit
                  $("#fruit1").show();
                  //choose random fruit
                  chooseRandom();
                  //random position
                  $('#fruit1').css({
                      'left': Math.round(550 * Math.random()),
                      'top': -50
                  });
                  //generate random step
                  step= 1 + Math.round(5 * Math.random());//change steps

                  //reduce trials by one
                  trialsleft--;
                  //populate trails left box by one
                  addhearts();

              }else{
                  //game over
                  playing=false;//we are ot playing any more
                  $("#score").hide();
                  $('#startreset').html('Start Game');
                  $('#gameOver').show();
                  $('#gameOver').html('<p>Game Over!</p><p>Your score is '+ score + '</p>');
                  $('#trialsleft').hide();
                  stopAction();//stops Action
              }
          }
      },10);
  }

  //choose random fruits
  function chooseRandom(){
      $('#fruit1').attr('src','https://raw.githubusercontent.com/Saumya-07/Fruit-Slicer/master/images/' + fruits[Math.round(9*Math.random())]+'.png');
  }
   // Stop Action
   function stopAction(){
    clearInterval(action);
    $('#fruit1').hide();
}
});