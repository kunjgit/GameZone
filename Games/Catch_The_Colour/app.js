let h3 = document.querySelector("h3");
let x = 0;
let arr = {
  1: "green",
  2: "red",
  3: "blue",
  4: "orange",
};
let subs = 26;
let inc = 0;
function loss() {
  document.querySelector("body").style.backgroundColor = "red";
}
function levelup() {
  let audi = document.querySelector("audio");
  audi.play();
}
function gameover1() {
  let over1 = document.querySelectorAll("audio")[1];
  let over2 = document.querySelectorAll("audio")[2];
  over1.play();
  over2.play();
}

let c = 0;
function nextstart() {
  let rand = Math.floor(Math.random() * 4 + 1);
  let ranpo = Math.floor(Math.random() * 559 + 1);
  h3.style.marginLeft = ranpo + "px";

  h3.style.color = arr[rand];
  h3.innerText = arr[rand];
}
let rand = Math.floor(Math.random() * 4 + 1);
let ranpo = Math.floor(Math.random() * 559 + 1);
h3.style.marginLeft = ranpo + "px";
let gameover = document.createElement("h4");
gameover.innerHTML = "Game Over";
gameover.style.color = "white";
gameover.style.fontSize = "50px";
gameover.style.marginTop = "200px";
gameover.style.marginLeft = "190px";
let sec = document.querySelector("section");
h3.style.color = arr[rand];
h3.innerText = arr[rand];
document.addEventListener("keydown", function (e) {
  if (e.keyCode == 37) {
    let style = window.getComputedStyle(h3);
    x = parseInt(style.getPropertyValue("margin-Left"));
    if (x - 37 >= 0) {
      x = x - 37;
    }
    h3.style.marginLeft = x + "px";
  }
});

document.addEventListener("keydown", function (e) {
  if (e.keyCode == 39) {
    let style = window.getComputedStyle(h3);
    x = parseInt(style.getPropertyValue("margin-Left"));
    if (x + 37 <= 558) {
      x = x + 37;
    }
    h3.style.marginLeft = x + "px";
  }
});
document.querySelector("#but2").addEventListener("click", () => {
  let style = window.getComputedStyle(h3);
  x = parseInt(style.getPropertyValue("margin-Left"));
  if (x + 37 <= 558) {
    x = x + 37;
  }
  h3.style.marginLeft = x + "px";
});
document.querySelector("#but1").addEventListener("click", () => {
  let style = window.getComputedStyle(h3);
  x = parseInt(style.getPropertyValue("margin-Left"));
  if (x - 37 >= 0) {
    x = x - 37;
  }
  h3.style.marginLeft = x + "px";
});
let btn = document.createElement("button");
btn.innerText = "play again";
btn.style.cursor = "pointer";
btn.style.marginLeft = "10px";
btn.addEventListener("click", function () {
  location.reload();
});
function changename(name) {
  h3.style.color = name;
  h3.innerText = name;
}
var down = setInterval(() => {
  let style = window.getComputedStyle(h3);
  let y = parseInt(style.getPropertyValue("margin-Top"));
  if (inc == 10) {
    levelup();
    subs = subs + 5;
    inc = 0;
  }
  y = y + subs;
  h3.style.marginTop = y + "px";
  let style1 = window.getComputedStyle(h3);
  let x1 = parseInt(style1.getPropertyValue("margin-Left"));
  if (y > 495 && x1 < 140) {
    if (h3.style.color == "red") {
      c++;
      inc++;
      document.querySelector("h1").innerText = `Score: ${c}`;
      h3.remove();
      h3 = document.createElement("h3");
      h3.id = "h3";
      document.querySelector("section").appendChild(h3);
      nextstart();
    } else {
      document.querySelector("h1").innerText = ` Final Score: ${c}`;
      document.querySelector("h1").appendChild(btn);
      clearInterval(down);
      h3.remove();
      h3 = document.createElement("h3");
      loss();
      gameover1();

      sec.appendChild(gameover);
    }
  } else if (y > 500 && x1 < 280) {
    if (h3.style.color == "green") {
      c++;
      inc++;
      document.querySelector("h1").innerText = `Score: ${c}`;
      h3.remove();
      h3 = document.createElement("h3");
      h3.id = "h3";
      document.querySelector("section").appendChild(h3);
      nextstart();
    } else {
      document.querySelector("h1").innerText = ` Final Score: ${c}`;
      document.querySelector("h1").appendChild(btn);
      clearInterval(down);
      h3.remove();
      h3 = document.createElement("h3");
      loss();
      gameover1();
      sec.appendChild(gameover);
    }
  } else if (y > 500 && x1 < 420) {
    if (h3.style.color == "blue") {
      c++;
      inc++;
      document.querySelector("h1").innerText = `Score: ${c}`;
      h3.remove();
      h3 = document.createElement("h3");
      h3.id = "h3";
      document.querySelector("section").appendChild(h3);
      nextstart();
    } else {
      document.querySelector("h1").innerText = ` Final Score: ${c}`;
      document.querySelector("h1").appendChild(btn);
      clearInterval(down);
      h3.remove();
      h3 = document.createElement("h3");
      loss();
      gameover1();
      sec.appendChild(gameover);
    }
  } else if (y > 500 && x1 <= 580) {
    if (h3.style.color == "orange") {
      c++;
      inc++;
      document.querySelector("h1").innerText = `Score: ${c}`;
      h3.remove();
      h3 = document.createElement("h3");
      h3.id = "h3";
      document.querySelector("section").appendChild(h3);
      nextstart();
    } else {
      document.querySelector("h1").innerText = ` Final Score: ${c}`;
      document.querySelector("h1").appendChild(btn);
      clearInterval(down);
      h3.remove();
      h3 = document.createElement("h3");
      loss();
      gameover1();
      sec.appendChild(gameover);
    }
  }
}, 100);
