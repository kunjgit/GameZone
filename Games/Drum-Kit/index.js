//Method 1
// document.getElementsByClassName("set")[0].addEventListener("click", function () {
//     console.log(this);
//     var audio = new Audio("sounds/tom-1.mp3");
//     audio.play();
// });


//Method 2-Angela
var n = document.querySelectorAll(".drum").length;

for (var i = 0; i < n; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function () {
        //Detecting button press
        var ButtonInnerHTML = this.innerHTML;
        makesound(ButtonInnerHTML);

        buttonAnimation(ButtonInnerHTML);
    });
}

document.addEventListener("keypress", function (eventParametervariable) {
    //Detecting keypress
    makesound(eventParametervariable.key);

    buttonAnimation(eventParametervariable.key);

})

function makesound(key) {
    switch (key) {
        case "w":
            var tom1 = new Audio("sounds/tom-1.mp3");
            tom1.play();
            break;

        case "a":
            var tom2 = new Audio("sounds/tom-2.mp3");
            tom2.play();
            break;

        case "s":
            var tom3 = new Audio("sounds/tom-3.mp3");
            tom3.play();
            break;

        case "d":
            var tom4 = new Audio("sounds/tom-4.mp3");
            tom4.play();
            break;

        case "j":
            var snare = new Audio("sounds/snare.mp3");
            snare.play();
            break;

        case "k":
            var crash = new Audio("sounds/crash.mp3");
            crash.play();
            break;

        case "l":
            var kickBass = new Audio("sounds/kick-bass.mp3");
            kickBass.play();
            break;

        default:
            console.log(ButtonInnerHTML);
            break;
    }
}
function buttonAnimation(keypressed) {
    var activeButton=document.querySelector("."+keypressed);
    activeButton.classList.add("pressed");

    setTimeout(function(){
    activeButton.classList.remove("pressed");

    },100);
}