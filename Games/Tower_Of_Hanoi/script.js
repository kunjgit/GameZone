$(document).ready(function () {
  var towers = [
      [[], $(".tower1")],
      [[], $(".tower2")],
      [[], $(".tower3")],
    ],
    moves = 0,
    disks = null,
    hold = null;
  function clear() {
    towers[0][1].empty();
    towers[1][1].empty();
    towers[2][1].empty();
  }

  function setdisks() {
    clear();
    for (var i = 0; i < 3; i++) {
      if (!jQuery.isEmptyObject(towers[i][0])) {
        for (var j = 0; j < towers[i][0].length; j++) {
          towers[i][1].append(
            $(
              "<li id='disk" +
                towers[i][0][j] +
                "' value='" +
                towers[i][0][j] +
                "'></li>"
            )
          );
        }
      }
    }
  }

  function initGame() {
    clear();
    towers = [
      [[], $(".tower1")],
      [[], $(".tower2")],
      [[], $(".tower3")],
    ];
    disks = document.getElementById("number").value;
    document.getElementById("minmoves").innerHTML = parseInt(
      Math.pow(2, disks) - 1
    );
    moves = 0;
    hold = null;
    for (var i = disks; i > 0; i--) towers[0][0].push(i);
    setdisks();
    $(".moves").text(moves + " moves");
  }

  function handle(tower) {
    if (hold === null) {
      if (!jQuery.isEmptyObject(towers[tower][0])) {
        hold = tower;
        towers[hold][1].children().last().css("margin-top", "-170px");
      }
    } else {
      var move = movedisk(hold, tower);
      // moves += 1;
      $(".moves").text(moves + " moves");
      if (move == 1) {
        setdisks();
      } else {
        alert("Placing a bigger disk on a smaller one is not allowed");
        towers[hold][1].children().last().css("margin-top", "-40px");
      }
      hold = null;
    }
    if (solved()) $(".moves").text("Solved with " + moves + " moves!");
  }

  function movedisk(a, b) {
    var from = towers[a][0];
    var to = towers[b][0];
    if (from.length === 0) return 0;
    else if (to.length === 0) {
      to.push(from.pop());
      moves += 1;
      return 1;
    } else if (from[from.length - 1] > to[to.length - 1]) {
      return 0;
    } else {
      to.push(from.pop());
      moves += 1;
      return 1;
    }
  }

  function solved() {
    if (
      jQuery.isEmptyObject(towers[0][0]) &&
      jQuery.isEmptyObject(towers[1][0]) &&
      towers[2][0].length == disks
    )
      return 1;
    else return 0;
  }

  $(".tower").click(function () {
    handle($(this).attr("value"));
  });

  $("#again").click(function () {
    if (confirm("You will lose your progress") == true) {
      var disks = document.getElementById("number").value;
      initGame();
    } else {
      void 0;
    }
  });
  initGame();
});

// Function to handle increasing the number of disks
function increaseDisks() {
  var input = document.getElementById("number");
  var currentValue = parseInt(input.value);
  if (currentValue < parseInt(input.max)) {
    input.value = currentValue + 1;
  }
}

// Function to handle decreasing the number of disks
function decreaseDisks() {
  var input = document.getElementById("number");
  var currentValue = parseInt(input.value);
  if (currentValue > parseInt(input.min)) {
    input.value = currentValue - 1;
  }
}

document.querySelector(".increase").addEventListener("click", increaseDisks);

document.querySelector(".decrease").addEventListener("click", decreaseDisks);
