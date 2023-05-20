var count1 = 1;
var count2 = 1;

const btn = document.querySelector("button");
btn.addEventListener("click", function () {
  let randomCount1 = Math.floor(Math.random() * 6) + 1;
  let takeImage = "dice" + randomCount1 + ".png";
  let imageSource1 = "images/" + takeImage;
  let img1 = document.querySelectorAll("img")[0];
  img1.setAttribute("src", imageSource1);

let clickSound = new Audio('./sound/diceSound.mp3')
clickSound.play();
  
  let randomCount2 = Math.floor(Math.random() * 6) + 1;
  let imageSource2 = "images/dice" + randomCount2 + ".png";
  document.querySelectorAll("img")[1].setAttribute("src", imageSource2);
  if (randomCount1 > randomCount2) {
    document.querySelector("h2").innerHTML = "Player 1 Wins";
    document.querySelector("h3 span").innerHTML = `(Points: ${count1++})`;
  } else if (randomCount1 < randomCount2) {
    document.querySelector("h2").innerHTML = "Player 2 Wins";
    document.querySelector("#count2").innerHTML = `(Points: ${count2++})`;
  } else if (randomCount1 === randomCount2) {
    document.querySelector("h2").innerHTML = "Tie";
  } else {
    alert("Refresh the page there is a error");
  }

});
