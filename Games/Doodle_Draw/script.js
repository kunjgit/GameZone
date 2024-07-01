/* General */
const grid = document.querySelector(".grid");
const page = document.querySelector(".main");

/* Default background color, pen color, number of squares inside grid */
grid.style.backgroundColor = "#FFFFFF";
let squareColor = "#000000";
function createSquare() {
  const square = document.createElement("div");
  square.classList.add("square", "square-border");
  grid.appendChild(square);
}
let squaresNumber = 30;
grid.style.cssText += `grid-template-columns: repeat(${squaresNumber}, 1fr)`;
for (sq = 1; sq <= squaresNumber * squaresNumber; sq++) {
  createSquare();
}
let squares = document.querySelectorAll(".square");

/* Remove, Add gridlines */
const gridLines = document.querySelector(".grid-line");
function removeGridLines() {
  squares.forEach((square) => square.classList.remove("square-border"));
}
function addGridLines() {
  squares.forEach((square) => square.classList.add("square-border"));
}

/* Clear all (Clear the grid only) */
const clearBtn = document.querySelector(".clear");
function resetAllSquare() {
  squares.forEach((square) => {
    if (square.style.cssText) square.removeAttribute("style");
  });
}
clearBtn.addEventListener("click", resetAllSquare);

/* Change grid size & badge */
const gridSizeBar = document.querySelector(".size-adjust #slider");
function changeGridBadge(squaresNumber) {
  let gridSizeBadge = document.querySelector(".size-adjust p");
  gridSizeBadge.innerText = `Grid Size: ${squaresNumber} x ${squaresNumber}`;
}
function changeGridSize() {
  // Erase current content
  resetAllSquare();
  // Input changed
  squaresNumber = parseInt(this.value);
  if (isNaN(squaresNumber)) {
    squaresNumber = 30;
    gridSizeBar.value = "30";
  }
  // Change badge text
  changeGridBadge(squaresNumber);
  // Reset grid
  grid.style.cssText += `grid-template-columns: repeat(${squaresNumber}, 1fr)`;
  // Append or remove squares
  while (squares.length < squaresNumber * squaresNumber - 1) {
    squares = document.querySelectorAll(".square");
    createSquare();
  }
  while (squares.length > squaresNumber * squaresNumber + 1) {
    squares = document.querySelectorAll(".square");
    squares[0].parentNode.removeChild(squares[0]);
  }
  squares = document.querySelectorAll(".square");
  // If gridlines turn off then remove the rest
  if (!gridLines.classList.contains("btn-on")) removeGridLines();
}
// Change the gridline when input done, for performance
gridSizeBar.addEventListener("input", (event) => {
  squaresNumber = event["target"].value;
  changeGridBadge(squaresNumber);
});
gridSizeBar.addEventListener("mouseup", changeGridSize);

/* Turn on or off button Function (Use for rainbow, random, lighten, shading pen, eraser) */
const buttons = page.querySelectorAll("button");
function resetAllBtn(event) {
  if (event.classList.value.includes("grid-line")) return;
  buttons.forEach((button) => {
    if (!button.classList.value.includes("grid-line"))
      button.classList.remove("btn-on");
  });
}
function buttonOnOff(event) {
  if (event.target.tagName !== "BUTTON") return;
  const toggleBtn = event.target;
  // Work with clear feature
  // If current select pen is lighten, darken & eraser then remove
  if (toggleBtn.innerText === "Clear") {
    buttons.forEach((button) => {
      const targetBtn = button.classList.value;
      if (
        targetBtn === "eraser btn-on" ||
        targetBtn === "darken btn-on" ||
        targetBtn === "lighten btn-on"
      )
        return button.classList.remove("btn-on");
    });
    return;
  } else if (toggleBtn.innerText === "Reset") {
    resetAll(event);
    return;
    // If remove glid lines clicked
  } else if (toggleBtn.innerText.includes("Remove")) {
    gridLines.innerText = "Show Grid Lines";
    removeGridLines();
    toggleBtn.classList.remove("btn-on");
    return;
    // If show glid lines clicked
  } else if (toggleBtn.innerText.includes("Show")) {
    gridLines.innerText = "Remove Grid Lines";
    addGridLines();
  }
  // Remove current clicked pen if double click
  if (toggleBtn.classList.contains("btn-on")) {
    toggleBtn.classList.remove("btn-on");
    return;
  }
  // Delete all pen with button on (Reset)
  resetAllBtn(event.target);
  // Then turn button on for current clicked pen
  toggleBtn.classList.add("btn-on");
}
page.addEventListener("click", buttonOnOff);

/* Color fill specific area */
const areaFill = document.querySelector(".area");
function toFill(event) {
  function extendSqrs(_) {
    // Create surround squares
    const squareIdx = Array.from(_.parentElement.children).indexOf(_);
    let topSqr = squares[squareIdx - squaresNumber];
    let botSqr = squares[squareIdx + squaresNumber];
    let leftSqr = "";
    let rightSqr = "";
    let leftTopSqr = squares[squareIdx - squaresNumber - 1];
    let rightTopSqr = squares[squareIdx - squaresNumber + 1];
    let leftBotSqr = squares[squareIdx + squaresNumber - 1];
    let rightBotSqr = squares[squareIdx + squaresNumber + 1];
    // If cursor on ther right corner
    if (squareIdx % squaresNumber == 0) {
      leftSqr = undefined;
      leftTopSqr = undefined;
      leftBotSqr = undefined;
    } else {
      leftSqr = squares[squareIdx - 1];
    }
    // If cursor on the left corner
    if ((squareIdx + 1) % squaresNumber == 0) {
      rightSqr = undefined;
      rightTopSqr = undefined;
      rightBotSqr = undefined;
    } else {
      rightSqr = squares[squareIdx + 1];
    }
    function caseTopLeft() {
      if (topSqr.style.backgroundColor && leftSqr.style.backgroundColor)
        leftTopSqr = undefined;
    }
    function caseTopRight() {
      if (topSqr.style.backgroundColor && rightSqr.style.backgroundColor)
        rightTopSqr = undefined;
    }
    function caseBotLeft() {
      if (leftSqr.style.backgroundColor && botSqr.style.backgroundColor)
        leftBotSqr = undefined;
    }
    function caseBotRight() {
      if (botSqr.style.backgroundColor && rightSqr.style.backgroundColor)
        rightBotSqr = undefined;
    }
    if (leftSqr === undefined) {
      if (topSqr === undefined) {
        caseBotRight();
      } else if (botSqr === undefined) {
        caseTopRight();
      } else {
        caseTopRight();
        caseBotRight();
      }
    } else if (rightSqr === undefined) {
      if (topSqr === undefined) {
        caseBotLeft();
      } else if (botSqr === undefined) {
        caseTopLeft();
      } else {
        caseTopLeft();
        caseBotLeft();
      }
    } else if (topSqr === undefined) {
      caseBotRight();
      caseBotLeft();
    } else if (botSqr === undefined) {
      caseTopRight();
      caseTopLeft();
    } else {
      caseBotLeft();
      caseBotRight();
      caseTopLeft();
      caseTopRight();
    }
    let arrs = [
      _,
      leftTopSqr,
      topSqr,
      rightTopSqr,
      rightSqr,
      rightBotSqr,
      botSqr,
      leftBotSqr,
      leftSqr,
    ];
    let cleanArrs = [];
    arrs.forEach((arr) => {
      if (arr !== undefined && !arr.style.backgroundColor) cleanArrs.push(arr);
    });
    return cleanArrs;
  }
  // Fill color for new squares created
  let arrs = extendSqrs(event);
  while (arrs.length > 0) {
    arrs.forEach((arr) => {
      arrs = arrs.filter((e) => e !== arr);
      arr.style.cssText = `background:${squareColor}`;
      extendSqrs(arr).forEach((_) => {
        if (!arrs.includes(_)) {
          arrs.push(_);
          _.style.cssText = `background:${squareColor}`;
        }
      });
    });
  }
}

/* Toggle pen */
// Toggle random
const randomBtn = document.querySelector(".random");
// Toggle rainbow
const rainbowBtn = document.querySelector(".rainbow");
// Toggle Lighten & darken
const lightenBtn = document.querySelector(".lighten");
const darkenBtn = document.querySelector(".darken");
// Toggle eraser
const eraserBtn = document.querySelector(".eraser");
/* Color fill full area */
const fullFillBtn = document.querySelector("#fill .full");
function toFullFill(_) {
  if (!_.style.cssText) {
    squares.forEach((square) => {
      if (!square.style.backgroundColor)
        square.style.backgroundColor = penColor.value;
    });
  }
}
/* Reset to original (Clear grid, pen, background to default) */
const resetBtn = document.querySelector(".reset");
function resetAll(event) {
  bgColor.value = "#ffffff";
  penColor.value = "#202020";
  grid.style.backgroundColor = "#FFFFFF";
  squareColor = "#000000";
  resetAllSquare();
  resetAllBtn(event.target);
  changeGridSize();
  if (!squares[0].classList.value.includes("square-border")) {
    addGridLines();
  }
  gridLines.classList.add("btn-on");
  gridLines.innerText = "Remove Grid Lines";
}

/* Hold to draw */
function toDraw(event) {
  if (event.buttons !== 1) return;
  if (!event["target"].className.includes("square")) return; // Return nothing if not inside of the box
  event.preventDefault(); // New to learn
  // Areafill
  if (areaFill.classList.contains("btn-on")) {
    toFill(event["target"]);
    // Fullfill
  } else if (fullFillBtn.classList.contains("btn-on")) {
    toFullFill(event["target"]);
    // Toggle rainbow color
  } else if (rainbowBtn.classList.contains("btn-on")) {
    event["target"].style.cssText = `background:${rainbowColor()}`;
    // Toggle random color
  } else if (randomBtn.classList.contains("btn-on")) {
    event["target"].style.cssText = `background:${randColor()}`;
    // Toggle lighten
  } else if (lightenBtn.classList.contains("btn-on")) {
    if (event["target"].style.cssText) {
      // Optimize performance
      rgb = event["target"].style.backgroundColor.match(/\d+/g);
      event["target"].style.cssText = `background:${rgbChange(rgb, 15)}`;
    }
    // Toggle darken
  } else if (darkenBtn.classList.contains("btn-on")) {
    if (event["target"].style.cssText) {
      // Optimize performance
      rgb = event["target"].style.backgroundColor.match(/\d+/g);
      event["target"].style.cssText = `background:${rgbChange(rgb, -15)}`;
    }
    // Toggle Eraser
  } else if (eraserBtn.classList.contains("btn-on")) {
    if (event["target"].style.cssText) event.target.removeAttribute("style");
    // Draw the square
  } else if (event["target"].style.backgroundColor !== hexToRgb(squareColor)) {
    event["target"].style.cssText = `background:${squareColor}`;
  }
}
grid.addEventListener("mousemove", toDraw);
grid.addEventListener("mousedown", toDraw);

/* Change background & pen color */
let bgColor = document.querySelector("#color-picker-bg");
let penColor = document.querySelector("#color-picker-pen");
bgColor.addEventListener("input", () => {
  grid.style.backgroundColor = bgColor.value;
});
penColor.addEventListener("input", () => {
  squareColor = penColor.value;
  buttons.forEach((button) => {
    if (
      button.classList[0] !== "area" &&
      button.classList[0] !== "full" &&
      button.classList[0] !== "grid-line"
    ) {
      return button.classList.remove("btn-on");
    }
  });
});

/* Others function */
// Hex to rgb
function hexToRgb(hex) {
  hex = hex.replace("#", "");
  var r = parseInt(hex.substring(0, 2), 16);
  var g = parseInt(hex.substring(2, 4), 16);
  var b = parseInt(hex.substring(4, 6), 16);
  return "rgb(" + r + ", " + g + ", " + b + ")";
}
// Generate random color
function randColor() {
  const rdC1 = Math.floor(Math.random() * 256);
  const rdC2 = Math.floor(Math.random() * 256);
  const rdC3 = Math.floor(Math.random() * 256);
  return `rgb(${rdC1}, ${rdC2}, ${rdC3})`;
}
// Change rgb to lighten or darken
function rgbChange(rgb, level) {
  r = parseInt(rgb[0]);
  g = parseInt(rgb[1]);
  b = parseInt(rgb[2]);
  if (r <= 255) r += level;
  if (g <= 255) g += level;
  if (b <= 255) b += level;
  return `rgb(${r}, ${g}, ${b})`;
}
// Generate rainbow color
function rainbowColor() {
  const rainbowCorArr = [
    "#9400D3",
    "#4B0082",
    "#0000FF",
    "#00FF00",
    "#FFFF00",
    "#FF7F00",
    "#FF0000",
  ];
  return rainbowCorArr[Math.floor(Math.random() * rainbowCorArr.length)];
}
