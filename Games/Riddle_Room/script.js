// Global

// These variables set to true when player solves puzzle:
// Please comment here with ✅ as triggers are added to puzzles:
var puzzlerSolved = false; // ✅
var mathPuzzleSolved = false; // ✅
var flexboxPuzzleSolved = false; // ✅
var mirrorPuzzleSolved = false; // ✅
var pipePuzzleSolved = false; // ✅
var recursionPuzzleSolved = false; // ✅

// Theme color variables - please use in all color functions.
var white = "#e6e6e6";
var darkestBlueColor = "#071e26";
var greyishBlueColor = "#06394c";
var brightBlueColor = "#0c4383";
var turquoiseBlueColor = "#22a0b6";
var palestBlueColor = "#6a96b9";
var darkMagentaColor = "#7b1346";
var magentaColor = "#cb0c59";
var pinkColor = "#eb649f";
// End Global

// Room scene

// Changes fill color of elements <selectors> to <color>
function toColor(selectors, color) {
  var item = document.querySelectorAll(selectors);
  item.forEach(function(i) {
    i.style.fill = color;
  });
}

// Changes opacity of element <selector> to <opacity>
function toOpacity(selector, opacity) {
  var item = document.querySelector(selector);
  item.style.opacity = opacity;
}

function abacusToColor() {
  toColor("#abacus .st0", magentaColor);
}

function abacusToWhite() {
  toColor("#abacus .st0", white);
}

function boxToColor() {
  toColor("#box .st0", pinkColor);
}

function boxToWhite() {
  toColor("#box .st0", white);
}

function mirrorToColor() {
  toColor("#mirror .st0", palestBlueColor);
}

function mirrorToWhite() {
  toColor("#mirror .st0", white);
}

function mirrorToColor() {
  toColor("#mirror .st0", palestBlueColor);
}

function mirrorToWhite() {
  toColor("#mirror .st0", white);
}

function radiatorToColor() {
  toColor("#radiator .st0", darkMagentaColor);
}

function radiatorToWhite() {
  toColor("#radiator .st0", white);
}

function computerToColor() {
  toColor("#computer #desktop .st0", brightBlueColor);
}

function computerToWhite() {
  toColor("#computer .st0", white);
}

function posterToTransparent() {
  toOpacity("#poster", "0.2");
}

function posterToOpaque() {
  toOpacity("#poster", "1");
}

function tilesToColor() {
  toColor("#tiles .st0", turquoiseBlueColor);
}

function tilesToWhite() {
  toColor("#tiles .st0", white);
}

document
  .getElementById("mathPuzzleBtn")
  .addEventListener("mouseover", abacusToColor);
document
  .getElementById("mathPuzzleBtn")
  .addEventListener("mouseout", abacusToWhite);
document
  .getElementById("flexboxPuzzleBtn")
  .addEventListener("mouseover", boxToColor);
document
  .getElementById("flexboxPuzzleBtn")
  .addEventListener("mouseout", boxToWhite);
document
  .getElementById("mirrorPuzzleBtn")
  .addEventListener("mouseover", mirrorToColor);
document
  .getElementById("mirrorPuzzleBtn")
  .addEventListener("mouseout", mirrorToWhite);
document
  .getElementById("pipePuzzleBtn")
  .addEventListener("mouseover", radiatorToColor);
document
  .getElementById("pipePuzzleBtn")
  .addEventListener("mouseout", radiatorToWhite);
document
  .getElementById("recursionPuzzleBtn")
  .addEventListener("mouseover", computerToColor);
document
  .getElementById("recursionPuzzleBtn")
  .addEventListener("mouseout", computerToWhite);
document
  .getElementById("puzzlerBtn")
  .addEventListener("mouseover", posterToTransparent);
document
  .getElementById("puzzlerBtn")
  .addEventListener("mouseout", posterToOpaque);
document
  .getElementById("puzzlerBtn")
  .addEventListener("mouseover", tilesToColor);
document
  .getElementById("puzzlerBtn")
  .addEventListener("mouseout", tilesToWhite);

// End room scene

// Cheryl Velez - Puzzler

// MODAL

// Get the modal
var puzzlerModal = document.getElementById("puzzlerModal");

// Get the button that opens the modal
var puzzlerBtn = document.getElementById("puzzlerBtn");

// Get the <span> element that closes the modal
var closePuzzler = document.getElementsByClassName("close-puzzler")[0];

// When the user clicks the button, open the modal
puzzlerBtn.onclick = function() {
  puzzlerModal.style.display = "grid";
};

// When the user clicks on <span> (x), close the modal and check whether all puzzles solved
closePuzzler.onclick = function() {
  puzzlerModal.style.display = "none";
  verify();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == puzzlerModal) {
    puzzlerModal.style.display = "none";
  }
};

// END MODAL

// Start JS for Puzzler Puzzler
!(function(a) {
  function f(a, b) {
    if (!(a.originalEvent.touches.length > 1)) {
      a.preventDefault();
      var c = a.originalEvent.changedTouches[0],
        d = document.createEvent("MouseEvents");
      d.initMouseEvent(
        b,
        !0,
        !0,
        window,
        1,
        c.screenX,
        c.screenY,
        c.clientX,
        c.clientY,
        !1,
        !1,
        !1,
        !1,
        0,
        null
      ),
        a.target.dispatchEvent(d);
    }
  }
  if (((a.support.touch = "ontouchend" in document), a.support.touch)) {
    var e,
      b = a.ui.mouse.prototype,
      c = b._mouseInit,
      d = b._mouseDestroy;
    (b._touchStart = function(a) {
      var b = this;
      !e &&
        b._mouseCapture(a.originalEvent.changedTouches[0]) &&
        ((e = !0),
        (b._touchMoved = !1),
        f(a, "mouseover"),
        f(a, "mousemove"),
        f(a, "mousedown"));
    }),
      (b._touchMove = function(a) {
        e && ((this._touchMoved = !0), f(a, "mousemove"));
      }),
      (b._touchEnd = function(a) {
        e &&
          (f(a, "mouseup"),
          f(a, "mouseout"),
          this._touchMoved || f(a, "click"),
          (e = !1));
      }),
      (b._mouseInit = function() {
        var b = this;
        b.element.bind({
          touchstart: a.proxy(b, "_touchStart"),
          touchmove: a.proxy(b, "_touchMove"),
          touchend: a.proxy(b, "_touchEnd")
        }),
          c.call(b);
      }),
      (b._mouseDestroy = function() {
        var b = this;
        b.element.unbind({
          touchstart: a.proxy(b, "_touchStart"),
          touchmove: a.proxy(b, "_touchMove"),
          touchend: a.proxy(b, "_touchEnd")
        }),
          d.call(b);
      });
  }
})(jQuery);

/* *** end jQuery UI Touch Punch *** */

var tileArr = [];
var ansID = ["6", "8", "1", "2", "7", "4", "3", "5"];
var droppedID = [0, 0, 0, 0, 0, 0, 0, 0];
var dragThis = 0;
var dropThis = 0;
$(document).ready(function() {
  $(".tile").each(function() {
    $(this).draggable({
      drag: function(event, ui) {
        dragThis = $(this).attr("id");
        console.log(droppedID);
      }
    });
  });
  $(".blank").each(function() {
    $(this).droppable({
      drop: function(event, ui) {
        $(this).addClass("ui-state-highlight");
        dropThis =
          $(this)
            .attr("id")
            .substring(2, 1) - 1;
        droppedID[dropThis] = dragThis;
      },
      out: function(event, ui) {
        $(this).removeClass("ui-state-highlight");
        droppedID[dropThis] = 0;
      }
    });
  });

  $("button").click(function() {
    var c = 0;
    $(".blank").each(function(obj, value) {
      if ($(this).hasClass("ui-state-highlight")) {
        //do nothing
      } else {
        c++;
      }
    });
    if (c > 0) {
      $("#alert").html("Please place all tiles!");
    } else {
      var w = 0;
      $.each(ansID, function(obj, value) {
        if (value == droppedID[obj]) {
          w++;
        }

        if (w == 8) {
          puzzlerSolved = true;
          $("#alert").html("You solved it!");

          //unlock 1st padlock once puzzle is solved
          // checkPadlocks('padlock0',puzzlerSolved);
          // document.querySelector('.unlocked').setAttribute('fill', "#22a0b6");
          document.querySelector("#padlock0 .locked").style.opacity = "0";
          document.querySelector("#padlock0 .unlocked").style.opacity = "1";
          //$("#alert").html(`You win! ${puzzlerSolved}`);
          //console.log(puzzlerSolved); //done- trigger worked
        } else {
          $("#alert").html("Sorry please try again!");
          puzzlerSolved = false;
        }

        //unlock 1st padlock once puzzle is solved
        // puzzlerSolved= true;
        // checkPadlocks('padlock0',puzzlerSolved);
      });
    }
  });
});
// End JS for Puzzler Puzzle

document.querySelector(".revealtext").onclick = function() {
  document.querySelector(".revealtext").style.backgroundColor = "transparent";
};

// End Cheryl Velez - Puzzler

// Dominic Duffin - Math Puzzle

// Get the modal
var mathPuzzleModal = document.getElementById("mathPuzzleModal");

// Get the button that opens the modal
var mathPuzzleBtn = document.getElementById("mathPuzzleBtn");

// Get the <span> element that closes the modal
var closeMathPuzzle = document.getElementsByClassName("close-mathpuzzle")[0];

// When the user clicks the button, open the modal
mathPuzzleBtn.onclick = function() {
  mathPuzzleModal.style.display = "grid";
};

// When the user clicks on <span> (x), close the modal and check whether all puzzles solved
closeMathPuzzle.onclick = function() {
  mathPuzzleModal.style.display = "none";
  verify();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == mathPuzzleModal) {
    mathPuzzleModal.style.display = "none";
  }
};

// Begin Math Puzzle JavaScript (not modal)

// TODO Replace window.alerts with something else!

var positionA; //A-G store value assigned to positions in sum
var positionB;
var positionC;
var positionD;
var positionE; //F doesn't exist because = is hard wired for F.
var positionG;
var choice; //Stores value of button last pressed by user
var bPlus = true; //Switch to false if user selects minus for B
var dPlus = true; //Switch to false if user selects minus for D
var sumTotal; //Stores correct sum for comparison with final position

//Messages:
function invalidMessage() {
  document.getElementById("math-puzzle-message").innerHTML =
    "Sorry, your choice is invalid!";
}

function fullMessage() {
  document.getElementById("math-puzzle-message").innerHTML =
    "Sorry, there are no more positions to fill!";
}

function solvedMessage() {
  document.getElementById("math-puzzle-message").innerHTML =
    "Yay, you've solved this one!";
}

function wrongMessage() {
  document.getElementById("math-puzzle-message").innerHTML =
    "Oh no, you got it wrong, better try again!";
}

function resetMathPuzzle() {
  positionA = void 0;
  positionB = void 0;
  positionC = void 0;
  positionD = void 0;
  positionE = void 0;
  positionG = void 0;
  document.getElementById("math-puzzle-a").innerHTML = "Number";
  document.getElementById("math-puzzle-b").innerHTML = "Sign";
  document.getElementById("math-puzzle-c").innerHTML = "Number";
  document.getElementById("math-puzzle-d").innerHTML = "Sign";
  document.getElementById("math-puzzle-e").innerHTML = "Number";
  document.getElementById("math-puzzle-g").innerHTML = "Number";
}

function checkNumber(x) {
  //Returns true if x is a number 0 ≥ x ≤ 9
  for (var i = 0; i < 10; i++) {
    if (x == i) {
      var y = true;
      i = 10; //To stop loop
    } else {
      var y = false;
    }
  }
  return y;
}

function checkSign(x) {
  //Returns true if x is '+' or '-'
  if (x == "+" || x == "-") {
    var y = true;
  } else {
    var y = false;
  }
  return y;
}

//The assignPosition functions assign the user's choice to the position's var, after checking for validity.

function assignPositionA() {
  isChoiceValid = checkNumber(choice);
  if (isChoiceValid == true) {
    positionA = choice;
    document.getElementById("math-puzzle-a").innerHTML = choice;
  } else {
    invalidMessage();
  }
}

function assignPositionB() {
  isChoiceValid = checkSign(choice);
  if (isChoiceValid == true) {
    positionB = choice;
    document.getElementById("math-puzzle-b").innerHTML = choice;
    if (choice == "-") {
      bPlus = false;
      //console.log(bPlus);
    }
  } else {
    invalidMessage();
  }
}

function assignPositionC() {
  isChoiceValid = checkNumber(choice);
  if (isChoiceValid == true) {
    positionC = choice;
    document.getElementById("math-puzzle-c").innerHTML = choice;
  } else {
    invalidMessage();
  }
}

function assignPositionD() {
  isChoiceValid = checkSign(choice);
  if (isChoiceValid == true) {
    positionD = choice;
    document.getElementById("math-puzzle-d").innerHTML = choice;
    if (choice == "-") {
      dPlus = false;
      //console.log(dPlus);
    }
  } else {
    invalidMessage();
  }
}

function assignPositionE() {
  isChoiceValid = checkNumber(choice);
  if (isChoiceValid == true) {
    positionE = choice;
    document.getElementById("math-puzzle-e").innerHTML = choice;
  } else {
    invalidMessage();
  }
}

function assignPositionG() {
  //Also calls calculate function
  isChoiceValid = checkNumber(choice);
  if (isChoiceValid == true) {
    positionG = choice;
    document.getElementById("math-puzzle-g").innerHTML = choice;
    calculateSumTotal();
  } else {
    invalidMessage();
  }
}

function findEmptyPosition() {
  //Finds the first unfilled position
  if (positionA == undefined) {
    assignPositionA();
  } else if (positionB == undefined) {
    assignPositionB();
  } else if (positionC == undefined) {
    assignPositionC();
  } else if (positionD == undefined) {
    assignPositionD();
  } else if (positionE == undefined) {
    assignPositionE();
  } else if (positionG == undefined) {
    assignPositionG();
  } else {
    fullMessage();
  }
}

//The clicked functions record button presses by user

function oneClicked() {
  choice = 1;
  findEmptyPosition();
}

function twoClicked() {
  choice = 2;
  findEmptyPosition();
}

function threeClicked() {
  choice = 3;
  findEmptyPosition();
}

function fourClicked() {
  choice = 4;
  findEmptyPosition();
}

function fiveClicked() {
  choice = 5;
  findEmptyPosition();
}

function sixClicked() {
  choice = 6;
  findEmptyPosition();
}

function sevenClicked() {
  choice = 7;
  findEmptyPosition();
}

function eightClicked() {
  choice = 8;
  findEmptyPosition();
}

function nineClicked() {
  choice = 9;
  findEmptyPosition();
}

function zeroClicked() {
  choice = 0;
  findEmptyPosition();
}

function plusClicked() {
  choice = "+";
  findEmptyPosition();
}

function minusClicked() {
  choice = "-";
  findEmptyPosition();
}

function calculateSumTotal() {
  //Calculates correct total
  if (bPlus == true && dPlus == true) {
    sumTotal = positionA + positionC + positionE;
  } else if (bPlus == true && dPlus == false) {
    sumTotal = positionA + positionC - positionE;
  } else if (bPlus == false && dPlus == true) {
    sumTotal = positionA - positionC + positionE;
  } else if (bPlus == false && dPlus == false) {
    sumTotal = positionA - positionC - positionE;
  }
  endGame();
}

function endGame() {
  //Checks whether user is correct
  if (sumTotal == positionG) {
    solvedMessage();
    mathPuzzleSolved = true; // Global var
    //unlock 2nd lock
    // checkPadlocks('padlock1',mathPuzzleSolved);
    // document.querySelector('.unlocked').setAttribute('fill', "#cb0c59");
    document.querySelector("#padlock1 .locked").style.opacity = "0";
    document.querySelector("#padlock1 .unlocked").style.opacity = "1";
  } else {
    wrongMessage();
    resetMathPuzzle();
  }
}

//Tests for checkNumber
//var output = checkNumber(0);
//console.log(output); //true
//output = checkNumber(-1);
//console.log(output); //false
//output = checkNumber(9);
//console.log(output); //true
//output = checkNumber(10);
//console.log(output); //false
//output = checkNumber('+');
//console.log(output); //false

//Tests for checkSign:
//var output = checkSign('+');
//console.log(output); //true
//output = checkSign('-');
//console.log(output); //true
//output = checkSign(8);
//console.log(output); //false

//Tests for assignPosition functions:

//choice = 5;
//assignPositionA();
//assignPositionB(); //invalid
//assignPositionC();
//assignPositionD(); //invalid
//assignPositionE();
//assignPositionG();

//choice = '+';
//assignPositionA(); //invalid
//assignPositionB();
//assignPositionC(); //invalid
//assignPositionD();
//assignPositionE(); //invalid
//assignPositionG(); //invalid

//Tests for calculateSumTotal:
//bPlus = true;
//dPlus = true;
//positionA = 1;
//positionC = 2;
//positionE = 4;
//calculateSumTotal();
//console.log(sumTotal) //7

//bPlus = true;
//dPlus = false;
//positionA = 4;
//positionC = 2;
//positionE = 6;
//calculateSumTotal();
//console.log(sumTotal) //0

//bPlus = false;
//dPlus = true;
//positionA = 1;
//positionC = 2;
//positionE = 4;
//calculateSumTotal();
//console.log(sumTotal) //3

//bPlus = false;
//dPlus = false;
//positionA = 1;
//positionC = 1;
//positionE = 1;
//calculateSumTotal();
//console.log(sumTotal) //-1

//Tests for endGame:
//sumTotal = 9;
//positionG = 9;
//endGame(); //You win!
//sumTotal = 0;
//positionG = 9;
//endGame(); //Oh no, you're wrong!

document
  .getElementById("math-puzzle-one")
  .addEventListener("click", oneClicked, false);
document
  .getElementById("math-puzzle-two")
  .addEventListener("click", twoClicked, false);
document
  .getElementById("math-puzzle-three")
  .addEventListener("click", threeClicked, false);
document
  .getElementById("math-puzzle-four")
  .addEventListener("click", fourClicked, false);
document
  .getElementById("math-puzzle-five")
  .addEventListener("click", fiveClicked, false);
document
  .getElementById("math-puzzle-six")
  .addEventListener("click", sixClicked, false);
document
  .getElementById("math-puzzle-seven")
  .addEventListener("click", sevenClicked, false);
document
  .getElementById("math-puzzle-eight")
  .addEventListener("click", eightClicked, false);
document
  .getElementById("math-puzzle-nine")
  .addEventListener("click", nineClicked, false);
document
  .getElementById("math-puzzle-zero")
  .addEventListener("click", zeroClicked, false);
document
  .getElementById("math-puzzle-plus")
  .addEventListener("click", plusClicked, false);
document
  .getElementById("math-puzzle-minus")
  .addEventListener("click", minusClicked, false);

// End Math Puzzle JavaScript

// End Dominic Duffin - Math Puzzle

// `Paul` - Flexbox Puzzle

// Get the modal
var flexboxPuzzleModal = document.getElementById("flexboxPuzzleModal");

// Get the button that opens the modal
var flexboxPuzzleBtn = document.getElementById("flexboxPuzzleBtn");

// Get the <span> element that closes the modal
var closeFlexboxPuzzle = document.getElementsByClassName(
  "close-flexboxpuzzle"
)[0];

// When the user clicks the button, open the modal
flexboxPuzzleBtn.onclick = function() {
  flexboxPuzzleModal.style.display = "grid";
};

// When the user clicks on <span> (x), close the modal adn check whether all puzzles solved
closeFlexboxPuzzle.onclick = function() {
  flexboxPuzzleModal.style.display = "none";
  verify();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == flexboxPuzzleModal) {
    flexboxPuzzleModal.style.display = "none";
  }
};

//define all variables used
let i = 0;
let subTitle = document.getElementsByClassName("heading__subtitle");
let displayFlex = document.getElementById("flexDisplay");
let directionOfFlex = document.getElementById("flexDirectn");
let justContent = document.getElementById("flexJustCont");
let flexAlign = document.getElementById("flexAlignItems");
let notification = document.querySelector(".notification");
let cubes = document.getElementsByClassName("cubes");
const containerClass = document.getElementsByClassName("flexPuzzle-container");
const flexDirections = ["row", "row-reverse", "column", "column-reverse"];
const flexJustifyContent = [
  "flex-start",
  "flex-end",
  "center",
  "space-between",
  "space-around",
  "space-evenly"
];
const flexAlignArray = [
  "stretch",
  "center",
  "flex-start",
  "flex-end",
  "baseline"
];

//buttons event listener
displayFlex.addEventListener("click", function() {
  if (containerClass[0].style.display == "block") {
    containerClass[0].style.display = "flex";
    displayFlex.innerHTML = "flex";

    //add space on cubes when flex is on
    for (i = 0; i < 5; i++) {
      cubes[i].style.padding = "125px";
    }
  } else {
    containerClass[0].style.display = "block";
    displayFlex.innerHTML = "Display Flex";

    //bring back original padding size on each cube
    for (i = 0; i < 5; i++) {
      cubes[i].style.padding = "15px";
    }
  }
  checkPuzzle();
});

let itemLength = flexDirections.length;
directionOfFlex.addEventListener("click", function() {
  // console.log(this.textContent);
  subTitle[0].innerHTML =
    "The flex-direction CSS property specifies how flex items are placed in the flex container defining the main axis and the direction (normal or reversed).";
  if (i <= itemLength) {
    
    this.textContent = flexDirections[i];
    containerClass[0].style.flexDirection = flexDirections[i];
    i++;
    
    
    
    if (
      document.querySelector(".flexPuzzle-container").style.flexDirection ===
      "column-reverse"
    ) {
      document.querySelector(".flexPuzzle-container").style.top = "1100px";
      document.querySelector("#flexboxPuzzleModal .modal-content").style.height =
      "1300px";
    }
 
  
   if (
      document.querySelector(".flexPuzzle-container").style.flexDirection ===
      "column"
    ) {
     
      document.querySelector("#flexboxPuzzleModal .modal-content").style.height =
      "1300px";
    }
  }
  
  
  if (i > itemLength) {
    document.querySelector("#flexboxPuzzleModal .modal-content").style.height =
      "745px";
    document.querySelector(".flexPuzzle-container").style.top = "300px";
    this.textContent = "Change Flex Direction";
    containerClass[0].style.flexDirection = "row";
    i = 0;
  }
  checkPuzzle();
});

let itemJustifyContLength = flexJustifyContent.length;
justContent.addEventListener("click", function() {
  // console.log(subTitle[0].innerHTML);
  subTitle[0].innerHTML =
    "justify-content property defines how the browser distributes space between and around content items along the main-axis of their container.";
  if (i <= itemJustifyContLength) {
    this.textContent = flexJustifyContent[i];
    containerClass[0].style.justifyContent = flexJustifyContent[i];
    i++;
  }
  if (i > itemJustifyContLength) {
    this.textContent = "Change Flex Direction";
    containerClass[0].style.justifyContent = "flex-start";
    i = 0;
  }
  checkPuzzle();
});

let itemAlignmentArrayLen = flexAlignArray.length;
let midItem = document.getElementsByClassName("cubes");
flexAlign.addEventListener("click", function() {
  // console.log(midItem[2].innerHTML);
  subTitle[0].innerHTML =
    "This controls the alignment of items on the Cross Axis.";
  if (i <= itemAlignmentArrayLen) {
    this.textContent = flexAlignArray[i];
    containerClass[0].style.alignItems = flexAlignArray[i];
    i++;
  }
  if (i > itemAlignmentArrayLen) {
    this.textContent = "Change Flex Direction";
    containerClass[0].style.alignItems = "flex-start";
    midItem[2].classList.remove("itemHeight");
    i = 0;
  }
  checkPuzzle();
});

function checkPuzzle() {
  if (displayFlex.innerHTML === "flex") {
    document.querySelectorAll(".front")[0].style.backgroundColor = "#7b1346";
    // document.querySelectorAll('.side')[0]].style.backgroundColor = '#7b1346';
    document.querySelectorAll(".left")[0].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".right")[0].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".bottom")[0].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".top")[0].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".back")[0].style.backgroundColor = "#7b1346";
    notification.innerHTML = "Keep going! Try changing flex direction now.";
    notification.style.color = "#0c4383";
    checkDirection();
  } else {
    document.querySelectorAll(".front")[0].style.backgroundColor = "#0c4383";
    // document.querySelectorAll('.side')[0].style.backgroundColor = '#0c4383';
    document.querySelectorAll(".left")[0].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".right")[0].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".bottom")[0].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".top")[0].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".back")[0].style.backgroundColor = "#0c4383";

    notification.innerHTML = 'Start with turning on "Display Flex"';
    notification.style.color = "#E6E6E6";
  }
  checkAllButtons();
}

function checkDirection() {
  if (displayFlex.innerHTML == "flex" && directionOfFlex.innerHTML == "row") {
    document.querySelectorAll(".front")[4].style.backgroundColor = "#7b1346";
    // document.querySelectorAll('.side')[4].style.backgroundColor = '#7b1346';
    document.querySelectorAll(".left")[4].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".right")[4].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".bottom")[4].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".top")[4].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".back")[4].style.backgroundColor = "#7b1346";
    notification.innerHTML = "Ok now, keep going...";
    notification.style.color = "#0c4383";
    checkJustifyContent();
  } else {
    document.querySelectorAll(".front")[4].style.backgroundColor = "#0c4383";
    // document.querySelectorAll('.side')[4].style.backgroundColor = '#0c4383';
    document.querySelectorAll(".left")[4].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".right")[4].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".bottom")[4].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".top")[4].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".back")[4].style.backgroundColor = "#0c4383";
  }
}

function checkJustifyContent() {
  if (
    displayFlex.innerHTML == "flex" &&
    directionOfFlex.innerHTML == "row" &&
    justContent.innerHTML == "center"
  ) {
    document.querySelectorAll(".front")[1].style.backgroundColor = "#7b1346";
    // document.querySelectorAll('.side')[1].style.backgroundColor = '#7b1346';
    document.querySelectorAll(".left")[1].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".right")[1].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".bottom")[1].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".top")[1].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".back")[1].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".front")[3].style.backgroundColor = "#7b1346";
    // document.querySelectorAll('.side')[3].style.backgroundColor = '#7b1346';
    document.querySelectorAll(".left")[3].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".right")[3].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".bottom")[3].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".top")[3].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".back")[3].style.backgroundColor = "#7b1346";
    notification.innerHTML = "Hmm, you're getting hotter.";
    notification.style.color = "#0d4383";
    checkAllButtons();
  } else {
    document.querySelectorAll(".front")[1].style.backgroundColor = "#0c4383";
    // document.querySelectorAll('.side')[1].style.backgroundColor = '#0c4383';
    document.querySelectorAll(".left")[1].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".right")[1].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".bottom")[1].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".top")[1].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".back")[1].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".front")[3].style.backgroundColor = "#0c4383";
    // document.querySelectorAll('.side')[3].style.backgroundColor = '#0c4383';
    document.querySelectorAll(".left")[3].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".right")[3].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".bottom")[3].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".top")[3].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".back")[3].style.backgroundColor = "#0c4383";
    notification.innerHTML = "Ok now, keep going...";
  }
}

function checkAllButtons() {
  if (
    displayFlex.innerHTML == "flex" &&
    directionOfFlex.innerHTML == "row" &&
    justContent.innerHTML == "center" &&
    flexAlign.innerHTML == "center"
  ) {
    document.querySelectorAll(".front")[2].style.backgroundColor = "#7b1346";
    // document.querySelectorAll('.side')[2].style.backgroundColor = '#7b1346';
    document.querySelectorAll(".left")[2].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".right")[2].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".bottom")[2].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".top")[2].style.backgroundColor = "#7b1346";
    document.querySelectorAll(".back")[2].style.backgroundColor = "#7b1346";
    notification.innerHTML = "Well done! You've solved it!";
    notification.style.color = "#0d4383";
    flexboxPuzzleSolved = true;
    //unlock 2nd padlock once puzzle is solved
    // checkPadlocks('padlock2',flexboxPuzzleSolved);
    // document.querySelector('.unlocked').setAttribute('fill', "#eb649f");
    flexboxPuzzleSolved = true;
    document.querySelector("#padlock2 .locked").style.opacity = "0";
    document.querySelector("#padlock2 .unlocked").style.opacity = "1";
  } else {
    document.querySelectorAll(".front")[2].style.backgroundColor = "#0c4383";
    // document.querySelectorAll('.side')[2].style.backgroundColor = '#0c4383';
    document.querySelectorAll(".left")[2].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".right")[2].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".bottom")[2].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".top")[2].style.backgroundColor = "#0c4383";
    document.querySelectorAll(".back")[2].style.backgroundColor = "#0c4383";
    notification.innerHTML = "Ok now, keep going...";
    flexboxPuzzleSolved = false;
    document.querySelector("#padlock2 .locked").style.opacity = "1";
    document.querySelector("#padlock2 .unlocked").style.opacity = "0";
  }
  console.log(flexboxPuzzleSolved);
}

// End Paul - Flexbox Puzzle

// Kristopher Van Sant - Mirror Puzzle

// Get the modal
var mirrorPuzzleModal = document.getElementById("mirrorPuzzleModal");

// Get the button that opens the modal
var mirrorPuzzleBtn = document.getElementById("mirrorPuzzleBtn");

// Get the <span> element that closes the modal
var closeMirrorPuzzle = document.getElementsByClassName(
  "close-mirrorpuzzle"
)[0];

// When the user clicks the button, open the modal
mirrorPuzzleBtn.onclick = function() {
  mirrorPuzzleModal.style.display = "grid";
};

// When the user clicks on <span> (x), close the modal and check whether all puzzles solved
closeMirrorPuzzle.onclick = function() {
  mirrorPuzzleModal.style.display = "none";
  verify();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == mirrorPuzzleModal) {
    mirrorPuzzleModal.style.display = "none";
  }
};

// // Drag and drop note
// Draggable.create("#noteWrap", {
//   bounds:"svg"
// });

// Begin JS for Mirror Puzzle (not modal)

$(function() {
  $("#note").draggable();
});

$(function() {
  $("#note").draggable();
  $("#mmirror").droppable({
    drop: function(event, ui) {
      $("#note-text").removeClass("mirror-text");

      $("#mirror-clue").replaceWith("<p>Ah, there we go. Interesting.</p>");

      mirrorPuzzleSolved = true;

      //unlock 4th padlock once puzzle is solved
      // checkPadlocks('padlock4',mirrorPuzzleSolved);
      // document.querySelector('use#ulock4 >

      document.querySelector("#padlock4 .locked").style.opacity = "0";
      document.querySelector("#padlock4 .unlocked").style.opacity = "1";
    }
  });
});
// End JS for Mirror Puzzle

// End Kristopher Van Sant - Mirror Puzzle

// Ryan Saunders - Pipe Puzzle

// Pipe Break Timer
var myVar;

function myFunction() {
  myVar = setTimeout(function() {
    document.querySelector(
      "#pipePuzzleModal .modal-content "
    ).style.backgroundImage =
      "url('https://media.giphy.com/media/46LMaiLUFRkoU/giphy.gif')";
    document.querySelector(
      "#pipePuzzleModal .modal-content "
    ).style.backgroundSize =
      "cover";
    document.querySelector("#pipePuzzleModal .modal-content ").style.boxShadow =
      "0px 0px 30px 10px #727ab9";
    document.querySelector("#pipe-notbusted").style.display = "none";
    document.querySelector("#pipe-notbusted").style.display = "none";
    document.querySelector("#pipe-busted").style.display = "block";

    pipePuzzleSolved = true;
    document.querySelector("#padlock3 .locked").style.opacity = "0";
    document.querySelector("#padlock3 .unlocked").style.opacity = "1";
  }, 75000);
}

function myStopFunction() {
  clearTimeout(myVar);
}

// Get the modal
var pipePuzzleModal = document.getElementById("pipePuzzleModal");

// Get the button that opens the modal
var pipePuzzleBtn = document.getElementById("pipePuzzleBtn");

// Get the <span> element that closes the modal
var closePipePuzzle = document.getElementsByClassName("close-pipepuzzle")[0];

// When the user clicks the button, open the modal
pipePuzzleBtn.onclick = function() {
  pipePuzzleModal.style.display = "grid";
  myFunction();
};

// When the user clicks on <span> (x), close the modal and check whether all puzzles solved
closePipePuzzle.onclick = function() {
  pipePuzzleModal.style.display = "none";
  verify();
  myStopFunction();
};

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {

//   if (event.target == pipePuzzleModal) {
//     pipePuzzleModal.style.display = "none";
//     myStopFunction2();

//   }

// }

// Begin JS for Pipe Puzzle (not Modal)

// Store our Pipes directions within an array
// NOTE: We need to look into extending this on a per row basis

let pipeDef = [];

// Set rows to have letter assigned
var rowAlpha = "A".charCodeAt(0);
var curRow = String.fromCharCode(rowAlpha++);

// Array of classes for our different types of pipe
var pipeType = ["straight", "cross", "angle", "junction", "empty"];
var pipeTypeX = [
  ["Up", "Down"],
  ["Up", "Right", "Down", "Left"],
  ["Right", "Down"],
  ["Up", "Right", "Down"],
  ["None"]
];

// Text for pipe current direction
var dirText = ["Up", "Right", "Down", "Left"];

// Set initial line count & pipe count
var lineCount = 0; // current line
var pipeCount = 0; // current pipe number

// Set the initial number of total blocks and columns
var columns = 5; // Total of 4 coluns - 4 * 4 = 16 total blocks
var totalBlocks = 25;

$(document).ready(function() {
  // Add the first row with the start point
  addStart();

  // Call our newPipe function for the total number of blocks
  for (var i = 0; i < totalBlocks; i++) newPipe();

  // Add the final end block to the screen
  addEnd();

  // When a pipe is clicked on the left half, turn counter clockwise & save the direction
  $(document).on("click touchstart", ".left", function() {
    pipeID = $(this)
      .next()
      .next()
      .attr("id")
      .substring(5);
    pipeDef[pipeID].direction -= 90;
    $(this)
      .next()
      .next()
      .css("transform", "rotate(" + pipeDef[pipeID].direction + "deg)");
  });

  // When a pipe is clicked on the right half, turn clockwise & save the direction
  $(document).on("click touchstart", ".right", function() {
    pipeID = $(this)
      .next()
      .attr("id")
      .substring(5);
    pipeDef[pipeID].direction += 90;
    $(this)
      .next()
      .css("transform", "rotate(" + pipeDef[pipeID].direction + "deg)");
  });
});

// Function to add a new pipe to the screen
function newPipe() {
  // When the current lineCount reaches the column maximum, force a clear to start a new line
  if (lineCount == columns) {
    $(".container").append($("<div>", { style: "clear: both" }));
    lineCount = 0;
    curRow = String.fromCharCode(rowAlpha++);
  }

  // Add our new 'box' div within the content div
  $(".container").append($("<div>", { class: "box" }));

  // Add the left overlaid div as a child of 'box'
  $(".box")
    .last()
    .append($("<div>", { class: "left", text: curRow }));

  // Add the right overlaid div as a child of 'box'
  $(".box")
    .last()
    .append($("<div>", { class: "right", text: lineCount + 1 }));

  // Before any specific pipe code is spat out, call function which will return the details of the pipe as an object. Pass argument of "A1" etc.

  // curRow = A | lineCount = 0 + 1 (starts on line 0)
  var curPipe = valPipe(curRow + (lineCount + 1));

  // Increase the pipeDef array to have the same number of elements as there are pipes.
  if (pipeDef.length <= pipeCount) {
    pipeDef.push(curPipe);
  }

  //alert(pipeDef[pipeCount].direction);
  //alert(curPipe.id + " " + curPipe.direction + " " + curPipe.type);

  // Here we need to put our algorithm to make this work.
  // Also need random rotation for each pipe so that they don't always start in the same direction!

  // I need to calculate the route for a win from A1 to D4.
  // So, A1, A2, B2, B3, C3, D3, D4

  //     1  2  3  4
  // A [[X][X][ ][ ]]
  // B [[ ][X][X][ ]]
  // C [[ ][ ][X][ ]]
  // D [[ ][ ][X][X]]

  // A1 is Bend, Junction or cross
  // A2 is Bend, Junction or Cross
  // B2 is Bend, Junction or Cross
  // B3 is Bend, Junction or Cross
  // C3 is Straight, Junction or Cross
  // D3 is Bend, Junction or Cross
  // D4 is Straight, Junction or Cross

  // Then we need to work out orientation of pipes

  // If pipeType = 2 for first pipe, we need to make A2 have a pipe
  // if A2 = pipeType 2 then B2 must have pipe!
  // if B2 = pipeType 2 then B1 or B3 must have pipe!

  // add our actual pipe span (Random)
  $(".box")
    .last()
    .append(
      $("<span>", {
        class: "pipeblock pipe pipe-" + pipeType[curPipe.type],
        id: "pipe-" + pipeCount,
        style: "transform: rotate(" + curPipe.direction + "deg);"
      })
    );

  // Increment the pipeCount & lineCount counters
  pipeCount += 1;
  lineCount += 1;

  // Output number of rows and columns to test area
  document.getElementById("rowCount").value = Math.ceil(pipeCount / columns);
  document.getElementById("colCount").value = columns;
}

// Add a new "Start" block/label to the first line.
function addStart() {
  // Add our new 'box' div within the content div
  $(".container").append($("<div>", { class: "box fake" }));

  // Add the end pipe as a child of 'box'
  $(".box")
    .last()
    .append($("<span>", { class: "startPipe", text: "Start" }));

  for (var i = 0; i < columns - 1; i++) {
    $(".container").append($("<div>", { class: "box fake" }));
  }

  $(".container").append($("<div>", { style: "clear: both" }));
}

// Add a new "End" block/label to the last pipe added.
function addEnd() {
  // Add our new 'box' div within the content div
  $(".container").append(
    $("<div>", {
      class: "box",
      style: "width:25px; border: none; position: absolute;"
    })
  );

  // Add the end pipe as a child of 'box'
  $(".box")
    .last()
    .append($("<span>", { class: "endPipe", text: "End" }));
}

// Function to add a new pipe to the screen
function updatePipes() {
  clearAll();
  columns = document.getElementById("colCount").value;
  totalBlocks = document.getElementById("rowCount").value * columns;

  //alert("Columns: " + columns + " | Total Blocks: " + totalBlocks + " | Rows: " + (totalBlocks / columns));

  addStart();
  for (var i = 0; i < totalBlocks; i++) newPipe();
  addEnd();
}

function clearAll() {
  //$(".container").innerHTML = '';

  // Store our Pipes directions within an array
  pipeDef = [];

  // Set initial line count & pipe count
  lineCount = 0;
  pipeCount = 0;
  document.getElementById("container").innerHTML = "";

  // reset row letters
  rowAlpha = "A".charCodeAt(0);
  curRow = String.fromCharCode(rowAlpha++);
}

function valPipe(cell) {
  var x;

  var topLeft =
    pipeCount - columns - 1 >= 0 &&
    (pipeCount - columns - 1) % columns != columns - 1
      ? pipeCount - columns - 1
      : "None";
  var top = pipeCount - columns >= 0 ? pipeCount - columns : "None";
  var topRight =
    pipeCount - columns + 1 >= 0 && (pipeCount - columns + 1) % columns != 0
      ? pipeCount - columns + 1
      : "None";
  var left =
    pipeCount - 1 >= 0 && (pipeCount - 1) % columns != columns - 1
      ? pipeCount - 1
      : "None";

  // If A1 (So if Above = Empty and Left = Empty and lineCount not final pipe) then must contain pipe (not empty)
  // If Above = empty & left = straight then pick anything.
  // If above = empty & left = bent then pick any other than empty

  // Set x to a random value between 0-4 (0-3 for first element and last element)
  // First element can be 0-3 but last needs to check various bits!
  if (cell == "A1") {
    x = Math.floor(Math.random() * 4);
  } else {
    x =
      pipeCount == 0
        ? Math.floor(Math.random() * 4)
        : pipeCount == totalBlocks - 1
          ? Math.floor(Math.random() * 4)
          : Math.floor(Math.random() * 5);
  }

  $(".bottomConsole").append("<strong>" + cell + ": </strong>");
  $(".bottomConsole").append(
    "Top Left: " +
      (topLeft != "None"
        ? pipeType[pipeDef[topLeft].type]
        : "<strong>None</strong>") +
      " | Top: " +
      (top != "None" ? pipeType[pipeDef[top].type] : "<strong>None</strong>") +
      " | Top Right: " +
      (topRight != "None"
        ? pipeType[pipeDef[topRight].type]
        : "<strong>None</strong>") +
      " | Left: " +
      (left != "None"
        ? pipeType[pipeDef[left].type]
        : "<strong>None</strong>") +
      "<br />"
  );

  $(".bottomConsole").append(
    "Top Left Pipe can Join on: " +
      (topLeft != "None"
        ? pipeTypeX[pipeDef[topLeft].type]
            .toString()
            .split(",")
            .join(", ")
        : "None") +
      "<br />"
  );

  $(".bottomConsole").append(
    "Top Pipe can Join on: " +
      (top != "None"
        ? pipeTypeX[pipeDef[top].type]
            .toString()
            .split(",")
            .join(", ")
        : "None") +
      "<br />"
  );

  $(".bottomConsole").append(
    "Top Right Pipe can Join on: " +
      (topRight != "None"
        ? pipeTypeX[pipeDef[topRight].type]
            .toString()
            .split(",")
            .join(", ")
        : "None") +
      "<br />"
  );

  $(".bottomConsole").append(
    "Left Pipe can Join on: " +
      (left != "None"
        ? pipeTypeX[pipeDef[left].type]
            .toString()
            .split(",")
            .join(", ")
        : "None") +
      "<br />"
  );

  //if (left != "None") {
  //  $('.bottomConsole').append(pipeTypeX[pipeDef[left].type].includes('Right'));
  //}

  // A1 - Still tempted to just check for cell == 'A1' here...
  if (left == "None" && top == "None") {
    // Setting direction to -90 as the images I'm using are not the same as the actual algorithm being used.
    var y = -90;
    var dirCount = 0;
    var dirCheck = "";
    var z = [];

    // This for loop swaps our directions to see which orientations are valid (Does the pipe connect?)
    for (var r = 0; r < 4; r++) {
      dirCheck = "Run " + (r + 1) + ": ";

      for (var i = 0; i < pipeTypeX[x].length; i++) {
        dirCheck +=
          (dirText.indexOf(pipeTypeX[x][i]) + r > dirText.length - 1
            ? (dirText.indexOf(pipeTypeX[x][i]) + r) % (dirText.length - 1) > 0
              ? dirText[
                  (dirText.indexOf(pipeTypeX[x][i]) + r) %
                    (dirText.length - 1) -
                    1
                ]
              : dirText[
                  (dirText.indexOf(pipeTypeX[x][i]) + r) %
                    (dirText.length - 1) +
                    2
                ]
            : dirText[dirText.indexOf(pipeTypeX[x][i]) + r]) +
          "[" +
          (dirText.indexOf(pipeTypeX[x][i]) + r > dirText.length - 1
            ? (dirText.indexOf(pipeTypeX[x][i]) + r) % (dirText.length - 1) > 0 // if out of bounds, this corrects index
              ? (dirText.indexOf(pipeTypeX[x][i]) + r) % (dirText.length - 1) -
                1
              : (dirText.indexOf(pipeTypeX[x][i]) + r) % (dirText.length - 1) +
                2
            : dirText.indexOf(pipeTypeX[x][i]) + r) + // if within bounds, this simply grabs new index
          "] ";

        // puts all current directions into string, if our count >= 2 then it's a valid pipe that
        // we can use to connect to others. If so, we +1 to our master check. At the end if our total > 0
        // the pipe is valid? I need to save f though on a "good" pipe.

        //alert("Run " + (f+1) + ": " + dirText.indexOf(pipeTypeX[x][i]) + " - " + pipeTypeX[x][i] + " Becomes: " + (((dirText.indexOf(pipeTypeX[x][i])+f) > (dirText.length -1)) ? (dirText.indexOf(pipeTypeX[x][i])+f)%(dirText.length -1)-1 : (dirText.indexOf(pipeTypeX[x][i])+f)) + " - " + (((dirText.indexOf(pipeTypeX[x][i])+f) > (dirText.length -1)) ? dirText[(dirText.indexOf(pipeTypeX[x][i])+f)%(dirText.length -1)-1] : dirText[(dirText.indexOf(pipeTypeX[x][i])+f)]));

        //alert(dirText.indexOf(pipeTypeX[x][i])+f%(dirText.length -1) + " - " + (dirText.length -1));
      }

      // These need to be dynamic based upon what's around it.
      dirCount += dirCheck.includes("Up") ? 1 : -1;
      dirCount += dirCheck.includes("Right") ? 1 : 0;
      dirCount += dirCheck.includes("Down") ? 1 : 0;
      dirCount += dirCheck.includes("Left") ? 0 : 0;

      //bleh += (pipeTypeX[x].includes('Up')) ? 1 : -1;
      //bleh += (pipeTypeX[x].includes('Right')) ? 1 : 0;
      //bleh += (pipeTypeX[x].includes('Down')) ? 1 : 0;
      //bleh += (pipeTypeX[x].includes('Left')) ? -1 : 0;

      // Add successful direction to Connection State
      if (dirCount >= 2) {
        z.push(r);
      }

      dirCount = 0;
    }
  } else {
    // Direction of pipe (When finished will be based on surrounding)
    var y = 90 * Math.floor(Math.random() * 4);
    // Shoving directions in here for now. Changing to orientation (0-3) later - can have more than 1 value
    var z = pipeTypeX[x];
  }

  $(".bottomConsole").append("<hr />");

  return {
    id: cell, // A1 (A1-E5)
    type: x, // 1 (Used in pipeType Array (0,1,2,3,4))
    direction: y, // 90 (Degrees (0,90,180,270))
    state: z // 1,2 (Orientations that are valid (0-3))
  };
}

function test() {
  $(".bottomConsole").empty();

  var dirNum;

  for (var i = 0; i < pipeDef.length; i++) {
    dirNum = pipeDef[i].direction / 360;
    dirNum = (dirNum - Math.floor(dirNum)) * 4;

    $(".bottomConsole").append(
      "Pipe ID: pipe-" +
        i +
        " | Pipe Position: " +
        pipeDef[i].id +
        " | Pipe Direction: " +
        pipeDef[i].direction +
        " ( " +
        dirText[dirNum] +
        ") | Pipe Type: " +
        pipeType[pipeDef[i].type] +
        " | Connection State: " +
        pipeDef[i].state +
        "<br />"
    );
  }
}

// NOTES:
// Make button with slider to select difficulty ?
// Easy - Normal - Hard - Extreme - Expert
// 2x2 - 3x3 - 4x4 - 5x5 - 6x6
// Multi dimensional  key-pair/array? each side has an index?
// create algorithm to generate correct "path" to win
// and based on difficulty, spit out "grid" in random
// order (avoiding solved path).
// top left & bottom right always ends. Direction is
// random based on possible solved path outcomes

// End JS for Pipe Puzzle

// End Ryan Saunders - Pipe Puzzle

// Antoine Guillien - Recursion Puzzle

// Get the modal
var recursionPuzzleModal = document.getElementById("recursionPuzzleModal");

// Get the button that opens the modal
var recursionPuzzleBtn = document.getElementById("recursionPuzzleBtn");

// Get the <span> element that closes the modal
var closeRecursionPuzzle = document.getElementsByClassName(
  "close-recursionpuzzle"
)[0];

// When the user clicks the button, open the modal
recursionPuzzleBtn.onclick = function() {
  recursionPuzzleModal.style.display = "grid";
};

// When the user clicks on <span> (x), close the modal and check whether all puzzles solved
closeRecursionPuzzle.onclick = function() {
  recursionPuzzleModal.style.display = "none";
  verify();
};

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == recursionPuzzleModal) {
    recursionPuzzleModal.style.display = "none";
    verify();
  }
  if (event.target == puzzlerModal) {
    puzzlerModal.style.display = "none";
    verify();
  }

  if (event.target == mathPuzzleModal) {
    mathPuzzleModal.style.display = "none";
    verify();
  }

  if (event.target == flexboxPuzzleModal) {
    flexboxPuzzleModal.style.display = "none";
    verify();
  }

  if (event.target == mirrorPuzzleModal) {
    mirrorPuzzleModal.style.display = "none";
    verify();
  }

  if (event.target == pipePuzzleModal) {
    pipePuzzleModal.style.display = "none";
    verify();
    myStopFunction();
  }
};

// Start JS for Recursion Puzzle
const TYPE = {
  ROOM: 0,
  CORRIDOR: 1,
  DOOR_IN: 2,
  DOOR_OUT: 3,
  OBJECT: 4,
  CONTAINER: 5,
  CAT: 6,
  THOUGHTS: 7,
  EXIT: 8
};

const config = {
  [TYPE.ROOM]: {
    seeds: () => {
      const adjectives = ["Tiny", "Big", "Dirty"];
      const colors = ["Fluorescent", "Dark", "Luminous", "Resplendant"];
      return `${_.sample(adjectives)} ${_.sample(colors)} Room`;
    },
    relations: [
      { type: TYPE.DOOR_OUT, min: 1, max: 3 },
      { type: TYPE.CONTAINER, min: 1, max: 5 },
      { type: TYPE.CAT, min: 1, max: 1, p: 0.2 }
    ]
  },
  [TYPE.CONTAINER]: {
    seeds: ["Freezer", "Fridge", "Icebox"],
    relations: [
      { type: TYPE.OBJECT, min: 1, max: 2 },
      {
        type: TYPE.EXIT,
        min: 1,
        max: 1,
        p: data => {
          const nb = countParents(data);
          if (nb > 2) {
            return 0.05 * (nb / 2);
          } else {
            return 0;
          }
        }
      }
    ]
  },
  [TYPE.OBJECT]: {
    seeds: [
      "Beans",
      "Carrots",
      "French fries",
      "Cucumber",
      "Peas",
      "Strawberries",
      "Blueberries",
      "Shrimp",
      "Pizza",
      "Broccoli",
      "Spinach",
      "Soup"
    ],
    relations: []
  },
  [TYPE.CORRIDOR]: {
    seeds: ["Corridor", "Aisle", "Passage", "Couloir", "Lobby"],
    relations: [{ type: TYPE.DOOR_IN, min: 1, max: 3 }]
  },
  [TYPE.DOOR_IN]: {
    seeds: ["A Door"],
    relations: [{ type: TYPE.ROOM, min: 1, max: 1 }]
  },
  [TYPE.DOOR_OUT]: {
    seeds: ["A Door"],
    relations: [{ type: TYPE.CORRIDOR, min: 1, max: 1 }]
  },
  [TYPE.EXIT]: {
    seeds: ["wiiiii"],
    relations: []
  },
  [TYPE.CAT]: {
    seeds: () => {
      const adjectives = ["Majestic", "Big", "Lazy"];
      const coats = ["", "Bi-Coloured", "Tabby", "Tortoiseshell", "Calico"];
      const colors = [
        "Dark",
        "White",
        "Brown",
        "Ginger",
        "Grey",
        "Cinnamon",
        ""
      ];
      return `${_.sample(adjectives)} ${_.sample(coats)} ${_.sample(
        colors
      )} Cat`;
    },
    relations: [{ type: TYPE.THOUGHTS, min: 1, max: 2 }]
  },
  [TYPE.THOUGHTS]: {
    seeds: [
      "Sharp Look",
      "Paws",
      "Tail",
      "Weird Look",
      "Thoughts Of Destruction",
      "Starvation"
    ],
    relations: []
  }
};

let tid = 0;
const generateThing = (type, parent) => {
  let name = Array.isArray(config[type].seeds)
    ? _.sample(config[type].seeds)
    : config[type].seeds();
  return {
    type: type,
    name,
    id: tid++,
    links: [],
    parent
  };
};

const countParents = data => {
  let sum = 0;
  let p = data;
  while (p.parent) {
    p = p.parent;
    sum++;
  }
  return sum;
};

const generateFromParent = parent => {
  let links = [];
  config[parent.type].relations.forEach(r => {
    let p = r.p ? (r.p instanceof Function ? r.p(parent) : r.p) : 1;
    if (r.type == TYPE.EXIT) {
      console.log(p);
    }
    if (p === 1 || Math.random() < p) {
      links = links.concat(
        Array.from({ length: _.random(r.min, r.max) }, () =>
          generateThing(r.type, parent)
        )
      );
    }
  });
  return links;
};

Vue.component("thing", {
  props: ["data", "create", "cb"],
  data: () => ({
    show: false
  }),
  methods: {
    createLinks: function() {
      let self = this;
      this.data.links = generateFromParent(this.data);
      this.cb(this.data);
    },
    handle: function() {
      if (!this.data.links.length) {
        this.createLinks();
      }
      this.show = !this.show;
    }
  },
  template: `
    <div class="thing">
      <div class="flex">
        <div>
          <span v-if="data.type == TYPE.EXIT"><i class="fa fa-ice-cream"></i></span>
          <span v-else>{{data.name}}</span>
        </div>
        <div @click="handle" v-if="[TYPE.OBJECT, TYPE.EXIT, TYPE.THOUGHTS].indexOf(data.type) === -1">
          <i v-if="show" class="fas fa-arrow-left"></i>
          <i v-else class="fas fa-arrow-right"></i>
        </div>
      </div>
      <div class="children" v-if="show">
        <div v-for="c in data.links">
          <thing :data="c" :key="c.id" :cb="cb"></thing>
        </div>
      </div>
    </div>
  `
});

const app = new Vue({
  el: "#app",
  data: {
    root: null,
    won: false,
    details: {
      clicks: 0,
      level: 0,
      opened: 0
    }
  },
  beforeMount: function() {
    this.root = generateFromParent({ type: TYPE.DOOR_IN, links: [] }).pop();
  },
  methods: {
    cb: function(data) {
      if (data.type === TYPE.CONTAINER) {
        this.details.opened++;
      }
      if (data.links.some(l => l.type === TYPE.EXIT)) {
        this.details.level = countParents(data);
        this.won = true;
        recursionPuzzleSolved = true;
        //unlock 6th padlock once puzzle is solved
        // checkPadlocks('padlock5',recursionPuzzleSolved);
        // document.querySelector(' .unlocked').setAttribute('fill', "#7b1346");
        document.querySelector("#padlock5 .locked").style.opacity = "0";
        document.querySelector("#padlock5 .unlocked").style.opacity = "1";
      }
      this.details.clicks++;
    }
  }
});

// End Antoine Guillien - Recursion Puzzle

// Padlock Functionality and Verification

// let padlocks = document.querySelectorAll('[id^=padlock]'),
// pathsToAnimate = document.querySelectorAll('[id^=ulock]');

// function checkPadlocks(whichLock,bol=false) {
//   //iterate through each path id of svg padlock
//   for(let i=0; i < 6; i++) {
//     //console.log(i + '  ' + padlocks[i].getAttribute('id'));
//     //console.log(whichLock === padlocks[i].getAttribute('id'));
//     if(whichLock === padlocks[i].getAttribute('id') && bol) {

//       // pathsToAnimate[i].setAttribute('href','#unlocked');
//       // console.log(pathsToAnimate[i]);
//       // document.querySelector(`${whichLock}.locked`).style.opacity="0";
//  // document.querySelector(`${whichLock}.unlocked`).style.opacity="1";
//       var paths = document.getElementsByTagName("path");
//       whichLock.paths[0].style.opacity = "0";
//       whichLock.paths[1].style.opacity = "1";
//     }
//   }
// }

// Start JS for verification

var haveEscaped;

function escapeNow() {
  haveEscaped = setTimeout(function() {
    //  replace door with opened version
    document.getElementById("door").style.opacity = "0";
    document.getElementById("open-door").style.opacity = "1";
    // window.alert("You may now escape!");
    document.getElementById("escaped").style.visibility = "visible";
  }, 750);
}

// Checks whether player has solved all puzzles, if yes, escape!
function verify() {
  // testing
  //   var puzzlerSolved = true; // ✅
  // var mathPuzzleSolved = true; // ✅
  // var flexboxPuzzleSolved = true; // ✅
  // var mirrorPuzzleSolved = true; // ✅
  // var pipePuzzleSolved = true; // ✅
  // var recursionPuzzleSolved = true; // ✅

  if (
    puzzlerSolved == true &&
    mathPuzzleSolved == true &&
    flexboxPuzzleSolved == true &&
    mirrorPuzzleSolved == true &&
    pipePuzzleSolved == true &&
    recursionPuzzleSolved == true
  ) {
    //ESCAPE

    escapeNow();
  }
}
verify();

// End JS for verification