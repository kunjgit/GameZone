var numberOfDrumButtons = document.querySelectorAll(".drum").length;

for (var i = 0; i < numberOfDrumButtons; i++) {
  document.querySelectorAll(".drum")[i].addEventListener("click", function () {
    var buttonInnerHTML = this.innerHTML;

    makeSound(buttonInnerHTML);

    buttonAnimation(buttonInnerHTML);
  });
}

document.addEventListener("keypress", function (event) {
  makeSound(event.key);
  buttonAnimation(event.key);
});

function makeSound(key) {
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
      var kick = new Audio("sounds/kick-bass.mp3");
      kick.play();
      break;

    default:
      console.log(key);
  }
}

function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");
  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}

const showKey = document.getElementById("showKey");
const wDrum = document.querySelector(".w.drum");
const aDrum = document.querySelector(".a.drum");
const sDrum = document.querySelector(".s.drum");
const dDrum = document.querySelector(".d.drum");
const jDrum = document.querySelector(".j.drum");
const kDrum = document.querySelector(".k.drum");
const lDrum = document.querySelector(".l.drum");

let DrumActive = false;

showKey.addEventListener("click", () => {
  if (DrumActive) {
    wDrum.textContent = "";
    aDrum.textContent = "";
    sDrum.textContent = "";
    dDrum.textContent = "";
    jDrum.textContent = "";
    kDrum.textContent = "";
    lDrum.textContent = "";
    DrumActive = false;
  } else {
    wDrum.textContent = "w";
    aDrum.textContent = "a";
    sDrum.textContent = "s";
    dDrum.textContent = "d";
    jDrum.textContent = "j";
    kDrum.textContent = "k";
    lDrum.textContent = "l";
    DrumActive = true;
  }
});
