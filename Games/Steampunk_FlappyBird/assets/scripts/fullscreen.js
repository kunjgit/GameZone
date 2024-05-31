let myDocument = document.documentElement;
let fsbtn = document.getElementById("fullscreen");
let rbtn = document.getElementById("restart");
let dbtn = document.getElementById("debug");
let startbtn = document.getElementById("start");

let fs=false
function fullscreen()
{
    if(!fs){
        if (myDocument.requestFullscreen) {
            myDocument.requestFullscreen();
        } 
        else if (myDocument.msRequestFullscreen) {
            myDocument.msRequestFullscreen();
        } 
        else if (myDocument.mozRequestFullScreen) {
            myDocument.mozRequestFullScreen();
        }
        else if(myDocument.webkitRequestFullscreen) {
            myDocument.webkitRequestFullscreen();
        }
        fs=true
    }
    else{
        if(document.exitFullscreen) {
            document.exitFullscreen();
        }
        else if(document.msexitFullscreen) {
            document.msexitFullscreen();
        }
        else if(document.mozexitFullscreen) {
            document.mozexitFullscreen();
        }
        else if(document.webkitexitFullscreen) {
            document.webkitexitFullscreen();
        }

        fs=false;
    }
}
fsbtn.addEventListener("click",fullscreen );


