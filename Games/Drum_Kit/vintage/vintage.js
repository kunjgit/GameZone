const showKey = document.getElementById("showKey");
const wDrum = document.querySelector(".w.drum");
const aDrum = document.querySelector(".a.drum");
const sDrum = document.querySelector(".s.drum");
const dDrum = document.querySelector(".d.drum");
const jDrum = document.querySelector(".j.drum");
const kDrum = document.querySelector(".k.drum");
const lDrum = document.querySelector(".l.drum");
const mDrum = document.querySelector(".m.drum");

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
    DrumActive = true;
  }
});
