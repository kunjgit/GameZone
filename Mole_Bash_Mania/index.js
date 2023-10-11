// to set the time
let time = document.querySelector("#time");
// audio sound for every hit
let sound = new Audio("assets_smash.mp3");
// holes list to place mole randomly;
let holes = document.querySelectorAll("#container>div");
// score variable
let s = document.querySelector("#score");
// Total time is 20sec
let i = 20;
let score = 0;
let moveMole = null;
let start_time = () => {
// start will be disabled for duration of gameplay
  document.querySelector("button").disabled = true;
  s.innerText = score;
  run();

  // setinterval for changing timer on screen
  let time_rem = setInterval(() => {
    time.innerText = i + " Sec";
    i--;
    if (i == -1) {
      stopGame(time_rem);
    }
  }, 1000);
};
document.querySelector("button").addEventListener("click", start_time);

let stopGame = (time_rem) => {
  clearInterval(time_rem);
  // time reset to total time and start button enabled
  i = 20;
  document.querySelector("button").disabled = false;
  clearInterval(moveMole);
  score = 0;
  // for each to clear last mole element as position is not known so all holes are cleared
  holes.forEach(function (el) {
    el.innerHTML = null;
  });
};

function run() {
  let position = Math.floor(Math.random() * 9);
  let mole = holes[position];
  let i = document.createElement("img");
  i.src = "https://cdn-icons-png.flaticon.com/512/5050/5050857.png";
  i.addEventListener("click", hitMole);
  mole.append(i);
  moveMole = setTimeout(() => {
    mole.innerHTML = null;
    run();
  }, 750);
}
//score is incremented and sound is played
function hitMole() { 
  score = score + 10;
  sound.play();
  s.innerText = score;
}