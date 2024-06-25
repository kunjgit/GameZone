const setofWords = [
  "Hello my name is Ishan",
  "hvbhherhfhfhefhbrfhrjhrjhrejkekj",
  "the king of miami is back-305 for life..dhfbfbbfn",
  "a lannister always pays he's debts and also winter is coming",
];

const msg = document.getElementById("msg");
const typedWords = document.getElementById("mywords");
const btn = document.getElementById("btn");
let startTime, endTime;

const playGame = () => {
  let randomNum = Math.floor(Math.random() * setofWords.length);
  msg.innerText = setofWords[randomNum];
  let date = new Date();
  startTime = date.getTime();
  btn.innerText = "Done";
};

const endPlay = () => {
  let date = new Date();
  endTime = date.getTime();
  let totalTime = (endTime - startTime) / 1000;

  let totalStr = typedWords.value;

  let wordCount = wordCounter(totalStr);

  let speed = Math.round((wordCount / totalTime) * 60);
  let finalmsg = "You typed total at " + speed + " words per minute";
  msg.innerText = finalmsg;
};

const wordCounter = (str) => {
  let response = str.split(" ").length;
  console.log(response);
  return response;
};

btn.addEventListener("click", function () {
  if (this.innerText == "Start") {
    typedWords.disabled = false;
    playGame();
  } else if (this.innerText == "Done") {
    typedWords.disabled = true;
    btn.innerText = "Start";
    endPlay();
  }
});
