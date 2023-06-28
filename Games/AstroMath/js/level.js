import { soundToggle, playMusic, checkPlayable } from "./modules/music.js";

import {
  body,
  settingIcon,
  infoIcon,
  settings,
  settingsView,
  infoView,
  nameEditIcon,
  nameInput,
  updateCharactersLength,
  charLenCnt,
  editName,
  containsClass,
  updatePopup,
  updateLocal,
  getLocal,
} from "./modules/utils.js";

let editing = true;
let soundSrc;
let playable;

// event listeners
settingIcon.addEventListener("click", settingsView);
infoIcon.addEventListener("click", infoView);
nameEditIcon.addEventListener("click", () => {
  updateCharactersLength();
  charLenCnt.classList.toggle("none");
  editing = editName(editing);
});
nameInput.addEventListener("input", updateCharactersLength);
window.addEventListener("keyup", (e) => {
  if (settings.classList.contains("none") || !(e.code == "Enter") || editing)
    return;
  charLenCnt.classList.toggle("none");
  editing = editName(editing);
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

window.onload = function () {
  nameInput.value = getLocal("user") || "Odinite";
  updatePopup(nameInput.value.slice(0, 15));
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
};
document.onreadystatechange = function() {
  if (document.readyState !== "complete") {
      document.querySelector('.loader').classList.remove('none');
  } else {
    document.querySelector('.loader').classList.add('none');
  }
};
