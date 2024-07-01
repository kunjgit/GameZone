var score = 0;
var numTiles = 25;
var tileCounter = 0;
var chestCount = 0;
var chestChance = 5;
var gemChance = 58;
var gemPoints = 500;
var chestPoints = 1500;
var gemcount = "";
var starcount = "";
var defaultTile = "grass";
var newTile = "";
var dirt = "dirt";
var stone = "stone";
var water = "water";
var gemText = "Nice!";
var chestText = "Wow!!";
var startText = "Go!";
var endText = "Yay!";

$(document).ready(function(){

  init(defaultTile,score);

  $('.'+defaultTile).on('click',function(){
    if($(this).hasClass(defaultTile)){
	
	  //get a % value of 100 for "drop rates"
	  random = Math.floor(Math.random() * 100);
      
	  if(chestCount===1){
		getGem($(this),random);
	  }
	  else{
	    if(random <= chestChance){
		  chest($(this));
		}
		else{
		  getGem($(this),random);
		}
	  }
	  
    }
	
	if($('.off').length === 25 && $('.chest-closed').length === 0){
		$('.gameover').show();
		$('.final-score').text(score);
    speechText(endText,3000);
	}
	
  });
  
  $('.reset').on('click',function(){
	$('.chest').remove();
    $('.gameBoard .gametile').removeClass('dirt water stone off').addClass(defaultTile);
    score=0;
	  chestCount=0;
    gemcount=0;
    starcount=0;
	$('.gemcount').text(0);
	$('.starcount').text(0);
    $('.score').text(score);
	$('.final-score').text(score);
	$('.gameover').hide();
	speechText(startText,600);
  });
  
});

function init(defaultTile,score){
  $('.gameBoard .gametile').addClass(defaultTile);
  $('.score').text(score);
}

function getGem(tile){
	if(random > chestChance && random <= (gemChance + chestChance)){
	  gem(tile);
	}
	else{
	  changeTile(tile,water);
	  sndEffects(0);
	}
}
 
function gem(tile) {  
  changeTile(tile,dirt);
  speechText(gemText,250);
  sndEffects(1);  
  scoreCalc(gemPoints);
  gemcount++;
  $('.gemcount').text(gemcount); 
  $(tile).append("<img class='gem' src='http://adrianpayne.me/game/assets/images/gem.png' />");
  $(tile).find('.gem').animate({top:"-30px",opacity:"0"},700);
  setTimeout(function() {
     $('img:last-child', tile).remove();
  }, 800); 
}

function chest(tile) {  
  changeTile(tile,stone);
  $(tile).append("<div class='chest chest-closed'></div>");
  chestCount = 1;
  sndEffects(0);
  
  $(".chest").click(function(){
	$(this).unbind();
	$(this).addClass('chest-open').removeClass('chest-closed');
	$(this).append("<img class='star' src='http://adrianpayne.me/game/assets/images/star.png' />");
    $(this).find('.star').animate({top:"-40px",opacity:"0"},800);
	$('.starcount').text(1); 
	speechText(chestText,300);
	sndEffects(1);
	scoreCalc(chestPoints);
	$(this).delay(200).fadeOut("slow");
  });  
}

function changeTile(tile, type){
  $(tile).removeClass(defaultTile).addClass(type).addClass("off");
}

function sndEffects(loot) {  
  $("#pop-" + Math.ceil(Math.random() * 2))[0].play();
  if(loot){
	$("#gemfind")[0].play();  
  }
}

function speechText(text,delay){
  $('.speech-bubble').stop(true, false).animate({opacity:"1"},200);
  $('.speech-bubble').text(text);
  $('.speech-bubble').delay(delay).animate({opacity:"0"},40);
}

function scoreCalc(points) {
  score += points;
  $('.score').text(score); 
}