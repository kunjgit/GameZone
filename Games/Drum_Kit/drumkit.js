var n = document.querySelectorAll(".drum").length;

for (var i = 0; i < n; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function(){
        var loca_tion=this.innerHTML;
        sound(loca_tion);
        animation(loca_tion);
    });
}
document.addEventListener("keypress", function (event) {
    sound(event.key);
    animation(event.key);
});

function sound(aud) {

    switch (aud) {
        case "w":
            var tom1 = new Audio("sounds/tom-1.mp3");
            tom1.play();
            // document.querySelector(".w").style.border = "10px solid #31416b";
           
            break;

        case "a":
            var tom2 = new Audio("sounds/tom-2.mp3");
            tom2.play();
            // document.querySelector(".a").style.border = "10px solid #31416b";
            break;

        case "s":
            var tom3 = new Audio("sounds/tom-3.mp3");
            tom3.play();
            // document.querySelector(".s").style.border = "10px solid #31416b";
            break;

        case "d":
            var tom4 = new Audio("sounds/tom-4.mp3");
            tom4.play();
            // document.querySelector(".d").style.border = "10px solid #31416b";
            break;

        case "j":
            var crash = new Audio("sounds/crash.mp3");
            crash.play();
            // document.querySelector(".j").style.border = "10px solid #31416b";
            break;

        case "k":
            var kick = new Audio("sounds/kick-bass.mp3");
            kick.play();
            // document.querySelector(".k").style.border = "10px solid #31416b";
            break;
        case "l":
            var snare = new Audio("sounds/snare.mp3");
            snare.play();
            // document.querySelector(".l").style.border = "10px solid #31416b";

        default:
            console.log(aud);
            break;
    }
};
function animation(currkey){
var activebtn=document.querySelector("."+currkey);
activebtn.style.border = "10px solid #8b59cd";
activebtn.classList.add("pressed");

setTimeout(function(){
    activebtn.classList.remove("pressed");
    activebtn.style.border = "10px solid #223569";
},100);


}