//tog is used for toggling the chance between two players
let tog = 1;
let rollingSound = new Audio("./sounds/dice-rolling.mp3");
let winSound = new Audio("./sounds/winSound.mp3");

let p1sum = 0; // p1sum refers to the red token position on the board (i.e the sum which they got on the dice and 
// the sum recieved after climbing the ladder.)
let p2sum = 0;// p1sum refers to the yellow token position on the board (i.e the sum which they got on the dice and 
// the sum recieved after climbing the ladder.)

//correction is for the correct position of the tokens on the board
function play(player, psum, correction, num) {
  let sum;
  // all these statements are the logic for climbing ladders or falling down due to snakes for red token
  if (psum == "p1sum") {
    p1sum = p1sum + num;

    if (p1sum > 100) {
      p1sum = p1sum - num;
      // sum = p1sum
    }

    if (p1sum == 1) {
      p1sum = 38;
    }
    if (p1sum == 4) {
      p1sum = 14;
    }
    if (p1sum == 8) {
      p1sum = 30;
    }
    if (p1sum == 21) {
      p1sum = 42;
    }
    if (p1sum == 28) {
      p1sum = 76;
    }
    if (p1sum == 32) {
      p1sum = 10;
    }
    if (p1sum == 36) {
      p1sum = 6;
    }
    if (p1sum == 48) {
      p1sum = 26;
    }
    if (p1sum == 50) {
      p1sum = 67;
    }
    if (p1sum == 62) {
      p1sum = 18;
    }
    if (p1sum == 71) {
      p1sum = 92;
    }
    if (p1sum == 80) {
      p1sum = 99;
    }
    if (p1sum == 88) {
      p1sum = 24;
    }
    if (p1sum == 95) {
      p1sum = 56;
    }
    if (p1sum == 97) {
      p1sum = 78;
    }

    sum = p1sum;
  }
 // all these statements are the logic for climbing ladders or falling down due to snakes for yellow token
  if (psum == "p2sum") {
    p2sum = p2sum + num;

    if (p2sum > 100) {
      p2sum = p2sum - num;
      // sum = p1sum
    }

    if (p2sum == 1) {
      p2sum = 38;
    }
    if (p2sum == 4) {
      p2sum = 14;
    }
    if (p2sum == 8) {
      p2sum = 30;
    }
    if (p2sum == 21) {
      p2sum = 42;
    }
    if (p2sum == 28) {
      p2sum = 76;
    }
    if (p2sum == 32) {
      p2sum = 10;
    }
    if (p2sum == 36) {
      p2sum = 6;
    }
    if (p2sum == 48) {
      p2sum = 26;
    }
    if (p2sum == 50) {
      p2sum = 67;
    }
    if (p2sum == 62) {
      p2sum = 18;
    }
    if (p2sum == 71) {
      p2sum = 92;
    }
    if (p2sum == 80) {
      p2sum = 99;
    }
    if (p2sum == 88) {
      p2sum = 24;
    }
    if (p2sum == 95) {
      p2sum = 56;
    }
    if (p2sum == 97) {
      p2sum = 78;
    }

    sum = p2sum;
  }
// smoothing the transition
  document.getElementById(`${player}`).style.transition = `linear all .5s`;

  // for moving the red and yellow token on to the respective place on the board
  if (sum < 10) {
    document.getElementById(`${player}`).style.left = `${(sum - 1) * 62}px`;
    document.getElementById(`${player}`).style.top = `${
      -0 * 62 - correction
    }px`;
  } 
  else if (sum == 100) {
    if (player == "p1") {
      winSound.play();//playing the sound
      alert("Red Won !!");
    } else if (player == "p2") {
      winSound.play();//playing the sound
      alert("Yellow Won !!");
    }
    location.reload();
  } else {
    numarr = Array.from(String(sum));
    n1 = eval(numarr.shift());
    n2 = eval(numarr.pop());

    if (n1 % 2 != 0) {
      if (n2 == 0) {
        document.getElementById(`${player}`).style.left = `${9 * 62}px`;
        document.getElementById(`${player}`).style.top = `${
          (-n1 + 1) * 62 - correction
        }px`;
      } else {
        document.getElementById(`${player}`).style.left = `${
          (9 - (n2 - 1)) * 62
        }px`;
        document.getElementById(`${player}`).style.top = `${
          -n1 * 62 - correction
        }px`;
      }
    } else if (n1 % 2 == 0) {
      if (n2 == 0) {
        document.getElementById(`${player}`).style.left = `${0 * 62}px`;
        document.getElementById(`${player}`).style.top = `${
          (-n1 + 1) * 62 - correction
        }px`;
      } else {
        document.getElementById(`${player}`).style.left = `${(n2 - 1) * 62}px`;
        document.getElementById(`${player}`).style.top = `${
          -n1 * 62 - correction
        }px`;
      }
    }
  }
}

document.getElementById("diceBtn").addEventListener("click", function () {
  rollingSound.play();
  num = Math.floor(Math.random() * 6  + 1);
  document.getElementById("dice").innerText = num;

  if (tog % 2 != 0) {
    document.getElementById("tog").innerText = "Yellow's Turn : ";
    play("p1", "p1sum", 0, num);
    //p1 refers to red
  } else if (tog % 2 == 0) {
    document.getElementById("tog").innerText = "Red's Turn : ";
    //p2 refers to yellow
    play("p2", "p2sum", 55, num);
  }

  tog = tog + 1;
});
