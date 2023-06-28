import { playMusic, checkPlayable, soundToggle } from "./modules/music.js";
import { body, containsClass, updateLocal, getLocal } from "./modules/utils.js";

const options = [...document.querySelectorAll(".footer__option")];
const colorMap = {
  invertedColor: "var(--primary-color)",
  invertedBackground: "var(--secondary-color)",
  normalColor: "var(--secondary-color)",
  normalBackground: "var(--primary-color)",
};
const keys = {
  a: options[0],
  s: options[1],
  d: options[2],
  1: options[0],
  2: options[1],
  3: options[2],
};
const level = document.querySelector(".header__info--level");
const exit = document.getElementById("exit");
const themeAud = document.querySelector(".audio__theme");
let soundSrc;
let playable;

// functions
function triggerOption(key) {
  invertColor(keys[key]);
  setTimeout(() => {
    normaliseColor(keys[key]);
  }, 200);
}

function invertColor(key) {
  key.style.color = colorMap.invertedColor;
  key.style.background = colorMap.invertedBackground;
  key.style.boxShadow = "2px 3px black";
}

function normaliseColor(key) {
  key.style.color = colorMap.normalColor;
  key.style.background = colorMap.normalBackground;
  key.style.boxShadow = "5px 5px black";
}

// event listeners
options.forEach((option) => {
  option.addEventListener("click", (e) => {
    triggerOption(option.dataset.option);
  });
});

window.addEventListener("keyup", (e) => {
  switch (e.key) {
    case "a":
    case "s":
    case "d":
      triggerOption(e.key);
  }
});

soundToggle.addEventListener("click", (e) => {
  soundSrc = soundToggle.src;
  if (soundSrc.includes("soundon")) {
    soundToggle.src = "./assets/images/soundoff.svg";
    updateLocal("currentSoundSrc", "./assets/images/soundoff.svg");
    playable = false;
  } else {
    soundToggle.src = "./assets/images/soundon.svg";
    updateLocal("currentSoundSrc", "./assets/images/soundon.svg");
    playable = true;
  }
  playMusic(playable);
});

exit.addEventListener("click", (e) => {
  e.preventDefault();
  updateLocal("soundTime", themeAud.currentTime);
  location.href = exit.href;
});

window.onload = function () {
  if (containsClass(body, "not-home")) {
    soundToggle.src = getLocal("currentSoundSrc") || soundToggle.src;

    if (checkPlayable()) {
      playable = true;
    }
    playMusic(playable);
  } else {
    getLocal("currentSoundSrc")
      ? ((soundToggle.src = getLocal("currentSoundSrc")),
        (playable = checkPlayable()))
      : (updateLocal("currentSoundSrc", soundToggle.src), (playable = true));
  }
  localStorage.removeItem("soundTime");
  if (location.href.includes("survival.html")) {
    document.querySelector(".header__info--time").textContent = "120 s";
    return;
  }
  document.querySelector(".header__info--time").textContent =
    getLocal("gameTime") + " s";
  level.textContent = getLocal("gameLevel");
};
document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.querySelector('.loader').classList.remove('none');
  } else {
    document.querySelector('.loader').classList.add('none');
  }
};