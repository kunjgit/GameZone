const pianoKeys = document.querySelectorAll(".piano-keys .key");

let audio = new Audio("tunes/a.wav");

const playTune = (key) => {
audio.src = `tunes/${key}.wav`;
audio.play();

   const clickedKey = document.querySelector(`[data-key="${key}"]`);
   clickedKey.classList.add("active");
   setTimeout ( () => {
    clickedKey.classList.remove("active");

   } ,150);   
}

pianoKeys.forEach(key => {
 key.addEventListener("click" , () => playTune(key.dataset.key) ) ;  
//    console.log();
});  
const pressedKey = (e) => {
  playTune(e.key);
}  

   document.addEventListener("keydown" , pressedKey);