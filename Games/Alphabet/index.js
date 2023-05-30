$(".btn").keypress(function(event) {
  playSound(event.key);
});

$(".btn").click(function() {
  var buttonInnerHTML = $(this).attr("id");
  playSound(buttonInnerHTML);
});

function playSound(name){
  var audio = new Audio("sounds/" + name + ".mp3");
  audio.play();
}
