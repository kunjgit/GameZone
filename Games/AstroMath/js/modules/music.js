export const themeAudio = document.querySelector(".audio__theme");
export const hoverAudio = document.querySelector(".audio__hover");
export const clickAudio = document.querySelector(".audio__click");
export const options = document.querySelectorAll(".main__option");
export const popupButton = document.querySelector(".popup__button");
export const gameSound = document.querySelector(".header__info--sound");
export const soundToggle = document.querySelector(".settings__sound--icon");
export const audioGame = document.querySelectorAll(".audio__game");
export const fireworks = document.querySelector(".audio__fireworks");
export const highScoreAudio = document.querySelector(".audio__high");
export const lowScoreAudio = document.querySelector(".audio__low");
export function updateLocalSoundSrc(src) {
  localStorage.setItem("currentSoundSrc", src);
}

export function getLocalSoundSrc() {
  return localStorage.getItem("currentSoundSrc");
}

export function handleThemePromise(promise) {
  promise.catch((err) => {
    if (err) {
      soundToggle.src = "./assets/images/soundoff.svg";
      updateLocalSoundSrc("./assets/images/soundoff.svg");
    }
  });
}
export function handleAudioPromise(promise) {
  promise.catch((_) => {});
}
export function playMusic(playable) {
  if (!playable) {
    themeAudio.pause();
    return;
  }
  themeAudio.currentTime = localStorage.getItem("soundTime") || 0;
  let themePromise = themeAudio.play();
  handleThemePromise(themePromise);
  themeAudio.loop = "true";
}

export function hoverMusic() {
  hoverAudio.currentTime = 0;
  hoverAudio.play();
}

export function clickMusic() {
  clickAudio.currentTime = 0;
  clickAudio.play();
}

export function checkPlayable() {
  return (getLocalSoundSrc() || soundToggle.src).includes("soundon")
    ? true
    : false;
}

export function gameAudioPlay(val) {
  themeAudio.volume = 0.8;
  audioGame.forEach((audio) => {
    audio.currentTime = 0;
  });
  audioGame[val === 0 ? 1 : 0].pause();
  handleAudioPromise(audioGame[val].play());
}

audioGame.forEach((audio) => {
  audio.addEventListener("ended", (e) => {
    themeAudio.volume = 1;
  });
});

export function fireworksPlay() {
  fireworks.play();
}
