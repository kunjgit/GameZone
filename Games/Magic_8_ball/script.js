function clearMagicBall() {
  document.querySelector("#response").innerHTML = "💤";
}

function clearText() {
  document.querySelector("textarea").value = "";
}

function ToggleAnimation() {
  var magic_ball_class = document.querySelector(".magic-ball");
  magic_ball_class.classList.contains("animate_ball")
    ? magic_ball_class.classList.remove("animate_ball")
    : magic_ball_class.classList.add("animate_ball");
}

function showAnswer() {
  var answers = [
    "It is certain",
    "It is decidedly so",
    "Without a doubt",
    "Yes definitely",
    "You may rely on it",
    "As I see it, yes",
    "Most likely",
    "Outlook good",
    "Yes",
    "Signs point to yes",
    "Ask again later",
    "Don't count on it",
    "My reply is no",
    "My sources say no",
    "Outlook not so good",
    "Very doubtful",
  ];

  var magic_n = Math.floor(Math.random() * answers.length);
  //   alert(magic_n);
  setTimeout(() => {
    ToggleAnimation();
    document.querySelector("#response").innerHTML = "" + answers[magic_n];
  }, 3000);
}

function AskMagicBall(event) {
  var user_text = document.querySelector("#user-text").value;
  //   alert(user_text);
  if (user_text == "" || user_text == " " || user_text.length <= 3) {
    alert("invalid input💭...ask question with more than 3 word!");
  } else {
    clearMagicBall();
    ToggleAnimation();
    showAnswer();
  }
}
document.querySelector("#ask").addEventListener("click", AskMagicBall);
document.querySelector("#clear").addEventListener("click", () => {
  clearMagicBall();
  clearText();
});
