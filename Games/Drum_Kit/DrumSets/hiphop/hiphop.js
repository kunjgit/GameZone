const showKey = document.getElementById("showKey");
const wDrum = document.querySelector(".w.drum");
const aDrum = document.querySelector(".a.drum");
const sDrum = document.querySelector(".s.drum");
const dDrum = document.querySelector(".d.drum");
const jDrum = document.querySelector(".j.drum");
const kDrum = document.querySelector(".k.drum");
const lDrum = document.querySelector(".l.drum");
const mDrum = document.querySelector(".m.drum");
const nDrum = document.querySelector(".n.drum");
const oDrum = document.querySelector(".o.drum");
const iDrum = document.querySelector(".i.drum");
const qDrum = document.querySelector(".q.drum");
const eDrum = document.querySelector(".e.drum");

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
    mDrum.textContent = "";
    nDrum.textContent = "";
    oDrum.textContent = "";
    iDrum.textContent = "";
    qDrum.textContent = "";
    eDrum.textContent = "";
    DrumActive = false;
  } else {
    wDrum.textContent = "w";
    aDrum.textContent = "a";
    sDrum.textContent = "s";
    dDrum.textContent = "d";
    jDrum.textContent = "j";
    kDrum.textContent = "k";
    lDrum.textContent = "l";
    mDrum.textContent = "m";
    nDrum.textContent = "n";
    oDrum.textContent = "o";
    iDrum.textContent = "i";
    qDrum.textContent = "q";
    eDrum.textContent = "e";
    DrumActive = true;
  }
});

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

function buttonAnimation(currentKey) {
  var activeButton = document.querySelector("." + currentKey);
  activeButton.classList.add("pressed");
  setTimeout(function () {
    activeButton.classList.remove("pressed");
  }, 100);
}

function makeSound(key) {
  switch (key) {
    case "w":
      var d1 = new Audio("../../sounds/tom-1.mp3");
      d1.play();
      break;

    case "a":
      var d2 = new Audio("../../sounds/hat_pedal_splash.mp3");
      d2.play();
      break;

    case "s":
      var d3 = new Audio("../../sounds/tom-3.mp3");
      d3.play();
      break;

    case "d":
      var d4 = new Audio("../../sounds/snare.mp3");
      d4.play();
      break;

    case "j":
      var d5 = new Audio("../../sounds/tom-2.mp3");
      d5.play();
      break;

    case "k":
      var d6 = new Audio("../../sounds/tom-4.mp3");
      d6.play();
      break;

    case "l":
      var d7 = new Audio("../../sounds/kick-bass.mp3");
      d7.play();
      break;

    case "m":
      var d8 = new Audio("../../sounds/crash_2.mp3");
      d8.play();
      break;

    case "n":
      var d9 = new Audio("../../sounds/crash_2.mp3");
      d9.play();
      break;

    case "o":
      var d10 = new Audio("../../sounds/crash.mp3");
      d10.play();
      break;

    case "i":
      var d11 = new Audio("../../sounds/crash_1.mp3");
      d11.play();
      break;

    case "q":
      var d12 = new Audio("../../sounds/crash_1.mp3");
      d12.play();
      break;

    case "e":
      var d13 = new Audio("../../sounds/crash.mp3");
      d13.play();
      break;

    default:
      console.log(key);
  }
}
