var highScore=0;
var level = 0;

var sequence_array = [];
var which_button_pressed = [];

var gameStart = false;
colours_list = ["green", "red", "yellow", "blue"];

$(document).keypress(function(){
    if (!gameStart){
    $("#level-title").text("Level "+ level);
    gameRound();
    gameStart = true
    
}});

$(".btn").click(function(event){

    var user_chosen_color = $(this).attr("id");
    which_button_pressed.push(user_chosen_color);

    play_audio(user_chosen_color);    
    button_animation(user_chosen_color);    

    checkAnswer(which_button_pressed.length-1);    
})

function checkAnswer(currentLevel){
    
    if (sequence_array[currentLevel]===which_button_pressed[currentLevel]){
        if (which_button_pressed.length ===sequence_array.length){
            setTimeout(function(){
                updateHighScore();
                gameRound();
            },1000);
        }
    }else{
        play_audio("wrong");
        $("body").addClass("game-over");
      $("#level-title").text("Game Over, Press Any Key to Restart");

      setTimeout(function () {
        $("body").removeClass("game-over");
      }, 200);
      startOver();
    }
}


function gameRound(){
    which_button_pressed = [];
    level++;
    $("#level-title").text("Level " + level);
    var random_number = Math.floor(Math.random()*4);
    var random_color= colours_list[random_number];
    sequence_array.push(random_color);
    
    $("#" + random_color).fadeIn(100).fadeOut(100).fadeIn(100);
  playSound(random_color);

}


function button_animation(colour){
    $("#"+colour).addClass("pressed");
    setTimeout(function(){
        $("#"+colour ).removeClass("pressed");
    },100);}

function play_audio(name){
    let beat = new Audio('./sounds/'+name+'.mp3');
    beat.play();}
    

function startOver() {
    level = 0;
    gamePattern = [];
    started = false;
    }


function updateHighScore() {
    if (level > highScore) {
        highScore = level;
        $("#high-score").text(highScore);
    }
}

