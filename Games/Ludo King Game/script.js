let playerNo = 0; // (red = 1, green = 2, yellow = 3, blue = 4)
let playerName = null; // store defult playerName
let diceBoxId = null; // store id value of dice box
let preDiceBoxId = null; // store id value of previou diceBoxId
let rndmNo = null; // generate rndmNo after dice is roll
let countSix = 0;
let cut = false;
let pass = false;
let flag = false;
let noOfPlayer = 4; // by default 4 player
let winningOrder = [];
let sound = true; // by default sound is on

//      ALL Audio Variables

let rollAudio = new Audio("../music/diceRollingSound.mp3");
let openAudio = new Audio("../music/open-sound.wav");
let jumpAudio = new Audio("../music/jump-sound.mp3");
let cutAudio = new Audio("../music/cut-sound.wav");
let passAudio = new Audio("../music/pass-sound.mp3");
let winAudio = new Audio("../music/win-sound.mp3");

// function playSound(){
//   openAudio.play();
// }

/* ************      Varialbe Diclartion End *************** */

/* ************    Object Diclartion Start  *************** */

function Position(length) {
  for (let i = 1; i <= length; i++) {
    this[i] = [];
  }
}

function Player(startPoint, endPoint) {
  this.inArea = [];
  this.outArea = [];
  this.privateArea = [];
  this.winArea = [];
  this.startPoint = startPoint;
  this.endPoint = endPoint;
  this.privateAreaPos = new Position(5);
}

let players = {
  rPlayer: new Player("out1", "out51"),
  gPlayer: new Player("out14", "out12"),
  yPlayer: new Player("out27", "out25"),
  bPlayer: new Player("out40", "out38"),
};

let outAreaPos = new Position(52); //Create Array for indiviual Posititon

/* ************      Fuction Diclartion Start *************** */

/* Switch Function */

function switchDiceBoxId() {
  // switch the value of diceBoxId variable
  (playerNo == 1 && (diceBoxId = "#redDice")) ||
    (playerNo == 2 && (diceBoxId = "#greenDice")) ||
    (playerNo == 3 && (diceBoxId = "#yellowDice")) ||
    (playerNo == 4 && (diceBoxId = "#blueDice"));
}

function switchPlayerName() {
  // switch the value of playerName variable
  (playerNo == 1 && (playerName = "rPlayer")) ||
    (playerNo == 2 && (playerName = "gPlayer")) ||
    (playerNo == 3 && (playerName = "yPlayer")) ||
    (playerNo == 4 && (playerName = "bPlayer"));
}

/* Get Function */

function getNoFromValue(value) {
  return +value.match(/\d+/);
}

function getColorFromValue(value) {
  return value.charAt(0);
}

function getRotateValue(color) {
  let rotate = null;
  (color == "g" && (rotate = "-45deg")) ||
    (color == "y" && (rotate = "-135deg")) ||
    (color == "b" && (rotate = "-225deg")) ||
    (color == "r" && (rotate = "-315deg"));

  return rotate;
}

function getUpdatedWHoutAreaPos(noInId) {
  let posLength = outAreaPos[noInId].length;
  let wh = [];
  if (posLength > 0) {
    wh[0] = 100 / posLength;
    wh[1] = 100 / posLength;
    for (const cValue of outAreaPos[noInId]) {
      $("." + cValue).css({
        width: wh[0] + "%",
        height: wh[1] + "%",
        display: "inline-block",
      });
    }
  }

  return wh;
}

function getUpdatedWHprivateAreaPos(noInId) {
  let wh = [];
  let privateAreaLength = players[playerName].privateAreaPos[noInId].length;

  if (privateAreaLength > 0) {
    wh[0] = 100 / players[playerName].privateAreaPos[noInId].length;
    wh[1] = 100 / players[playerName].privateAreaPos[noInId].length;
    for (const cValue of players[playerName].privateAreaPos[noInId]) {
      $("." + cValue).css({
        width: wh[0] + "%",
        height: wh[1] + "%",
        display: "inline-block",
      });
    }
  }
  return wh;
}

function reUpdateOutAreaWH(...classArr) {
  for (const classV of classArr) {
    let theId = $("." + classV)
      .parent()
      .attr("id");
    let noInId = getNoFromValue(theId);
    getUpdatedWHoutAreaPos(noInId);
  }
}
function reUpdatePrivateAreaWH(...classArr) {
  for (const classV of classArr) {
    let theId = $("." + classV)
      .parent()
      .attr("id");
    let noInId = getNoFromValue(theId);
    getUpdatedWHprivateAreaPos(noInId);
  }
}

/* Check Function  */

function check52(id) {
  if (getNoFromValue(id) == 52) return true;

  return false;
}

function checkOutAreaEnd(id) {
  if (getNoFromValue(id) == getNoFromValue(players[playerName].endPoint)) {
    return true;
  }
  return false;
}

function checkprivateAreaEnd(id) {
  if (getNoFromValue(id) == 5) {
    return true;
  }

  return false;
}

/* Add and Remove funtion */

function removeAllGlow(...area) {
  for (const areaValue of area) {
    for (const classValue of players[playerName][areaValue]) {
      $("." + classValue).removeClass("glow");
    }
  }
}

function removeAllEvent(...area) {
  for (const areaValue of area) {
    for (const classValue of players[playerName][areaValue]) {
      $("." + classValue).off();
    }
  }
}

function addToArea(addValue, pName, areaName) {
  players[pName][areaName].push(addValue);
}

function removeFromArea(removeValue, pName, areaName) {
  let newArr = [];
  for (const classValue of players[pName][areaName]) {
    if (classValue != removeValue) {
      newArr.push(classValue);
    }
  }
  players[pName][areaName] = newArr;
}

function removeFromPrivateAreaPos(posValue, classValue, pName) {
  let newPrivateAreaPosArr = [];
  for (const cValue of players[pName].privateAreaPos[posValue]) {
    if (cValue != classValue) {
      newPrivateAreaPosArr.push(cValue);
    }
  }
  players[pName].privateAreaPos[posValue] = newPrivateAreaPosArr;
}

function addToPrivateAreaPos(posValue, classValue, pName) {
  players[pName].privateAreaPos[posValue].push(classValue);
}

function addToOutAreaPos(posValue, classValue) {
  outAreaPos[posValue].push(classValue);
}

function removeFromOutAreaPos(posValue, classValue) {
  let newPosArr = [];
  for (const cValue of outAreaPos[posValue]) {
    if (cValue != classValue) {
      newPosArr.push(cValue);
    }
  }
  outAreaPos[posValue] = newPosArr;
}

/* Main Funtion */

function nextPlayer() {
  if (winningOrder.length == noOfPlayer - 1) {
    setTimeout(function () {
      restartGame();
    }, 1000);
    return;
  }
  if (playerNo == 4) playerNo = 0;
  if ((rndmNo != 5 && cut != true && pass != true) || countSix == 3) {
    playerNo++;
    countSix = 0;
    preDiceBoxId = null;
  }
  if (cut == true || pass == true) {
    countSix = 0;
    preDiceBoxId = null;
    pass = false;
    cut = false;
  }

  if (diceBoxId != null) $(diceBoxId).removeClass("showDice");
  switchDiceBoxId();
  switchPlayerName();
  if (
    players[playerName].winArea.length == 4 ||
    (players[playerName].inArea.length == 0 &&
      players[playerName].outArea.length == 0 &&
      players[playerName].privateArea.length == 0)
  ) {
    if (rndmNo == 5) {
      rndmNo = null;
    }
    nextPlayer();
  } else if (
    players[playerName].inArea.length == 0 &&
    players[playerName].winArea.length == 0 &&
    players[playerName].outArea.length == 0 &&
    players[playerName].privateArea.length == 0
  ) {
    if (rndmNo == 5) {
      rndmNo = null;
    }
    nextPlayer();
  } else {
    $(diceBoxId).addClass("startDiceRoll");
    $(diceBoxId).one("click", function () {
      rollDice(diceBoxId);
    });
  }
}

function rollDice(idValue) {
  let pX = 0;
  let pY = 0;

  $(idValue).removeClass("startDiceRoll").addClass("rollDice");
  if (sound == true) {
    rollAudio.play();
    rollAudio.playbackRate = 3.2;
  }

  let timerId = setInterval(() => {
    (pX == 100 && ((pX = 0), (pY = pY + 25))) || (pX = pX + 20);
    $(idValue).css({
      "background-position-x": pX + "%",
      "background-position-y": pY + "%",
    });

    if (pY == 100 && pX == 100) {
      clearInterval(timerId);
      showDice(idValue);
      if (rndmNo == 5 && countSix != 3) {
        if (players[playerName].outArea.length == 0 && players[playerName].inArea.length > 0) {
          openPawn();  // autoOpen
        }else{
          openPawn(); // manuallyOpen
          movePawnOnOutArea();
          updatePlayer();
        }
        
      } else if (rndmNo < 5) {
        movePawnOnOutArea();
        movePawnOnPrivateArea();
        updatePlayer();
      } else {
        setTimeout(function () {
          nextPlayer();
        }, 500);
      }
    }
  }, 20);
}

function showDice(idValue) {
  let pX = null;
  let pY = null;
  const pXpYarr = [
    [0, 0],
    [100, 0],
    [0, 50],
    [100, 50],
    [0, 100],
    [100, 100],
  ];
  rndmNo = Math.floor(Math.random() * 6);

  if ((preDiceBoxId == null || preDiceBoxId == idValue) && rndmNo == 5) {
    countSix++;
  }

  pX = pXpYarr[rndmNo][0];
  pY = pXpYarr[rndmNo][1];
  $(idValue).removeClass("rollDice");
  $(idValue).addClass("showDice");
  $(idValue).css({
    "background-position-x": pX + "%",
    "background-position-y": pY + "%",
  });

  preDiceBoxId = idValue;
}

/*   Open Pawn */

function openPawn() {
  let inAreaLength = players[playerName].inArea.length;
  let outAreaLength = players[playerName].outArea.length;
  if (inAreaLength == 0) {
    return;
  } else {
    if (outAreaLength == 0) {
      setTimeout(()=>autoOpen(inAreaLength),500);
      
    } else {
      manuallyOpen();
    }
  }
}

function manuallyOpen() {
  for (const classValue of players[playerName].inArea) {
    $("." + classValue).addClass("glow");
    $("." + classValue).one("click", function () {
      reUpdateOutAreaWH(...players[playerName].outArea);
      reUpdatePrivateAreaWH(...players[playerName].privateArea);
      open(classValue, 0);
    });
  }
}

function autoOpen(inAreaLength) {
  let openClassValue =
    players[playerName].inArea[Math.floor(Math.random() * inAreaLength)];
  open(openClassValue);
}

function open(openClassValue) {
  let startPoint = players[playerName].startPoint;
  let audioDuration = 500;

    removeAllGlow("inArea", "outArea");
    removeAllEvent("inArea", "outArea");
    removeFromArea(openClassValue, playerName, "inArea");
    addToArea(openClassValue, playerName, "outArea");
    addToOutAreaPos(getNoFromValue(startPoint), openClassValue);
    $("." + openClassValue).remove();

    let noInId = getNoFromValue(startPoint);

    let w = getUpdatedWHoutAreaPos(noInId)[0];
    let h = getUpdatedWHoutAreaPos(noInId)[1];
    if (sound == true) {
      audioDuration = openAudio.duration * 1000;
      openAudio.play();
    }
    $("#" + startPoint).append(
      `<div class="${openClassValue}" style="width:${w}%; height:${h}%;"></div>`
    );
  setTimeout(function () {
    nextPlayer();
  }, audioDuration);
}

/* move pawn  on out area*/

function movePawnOnOutArea() {
  let outAreaLength = players[playerName].outArea.length;
  if (outAreaLength == 0) {
    return;
  } else {
    if (
      outAreaLength == 1 &&
      rndmNo != 5 &&
      players[playerName].privateArea.length == 0
    ) {
      autoMoveOnOutArea();
    } else {
      manuallyMoveOnOutArea();
    }
  }
}

function manuallyMoveOnOutArea() {
  let idArr = [];
  for (const classValue of players[playerName].outArea) {
    let idValue = $("." + classValue)
      .parent()
      .attr("id");
    if (idArr.includes(idValue)) {
      continue;
    } else {
      for (const cValue of outAreaPos[getNoFromValue(idValue)]) {
        if (cValue != classValue) {
          $("." + cValue).css("display", "none");
        }
      }
      $("." + classValue).css({
        width: 100 + "%",
        height: 100 + "%",
        display: "inline-block",
      });
      idArr.push(idValue);
      $("." + classValue).addClass("glow");
      $("." + classValue).one("click", function () {
        reUpdateOutAreaWH(...players[playerName].outArea);
        reUpdatePrivateAreaWH(...players[playerName].privateArea);
        moveOnOutArea(classValue);
      });
    }
  }
}

function autoMoveOnOutArea() {
  moveOnOutArea(players[playerName].outArea[0]);
}

function moveOnOutArea(cValue) {
  let count = -1;
  let idValue = $("." + cValue)
    .parent()
    .attr("id");
  let noInId = getNoFromValue(idValue);
  let newId = "out" + noInId;
  let oldId = newId;
  let wh = [];
  let moveingClassValue = cValue;
  let color = getColorFromValue(moveingClassValue);
  let winAudioPlay = false;
  let passAudioPlay = false;

  removeAllGlow("inArea", "outArea", "privateArea");
  removeAllEvent("inArea", "outArea", "privateArea");

  let timerId = setInterval(function () {
    if (checkOutAreaEnd(newId)) {
      count++;
      removeFromOutAreaPos(noInId, moveingClassValue);
      removeFromArea(moveingClassValue, playerName, "outArea");
      $("." + moveingClassValue).remove();
      wh = getUpdatedWHoutAreaPos(noInId);
      noInId = 1;
      newId = color + "-out-" + noInId;
      oldId = newId;

      addToArea(moveingClassValue, playerName, "privateArea");
      addToPrivateAreaPos(noInId, moveingClassValue, playerName);

      wh = getUpdatedWHprivateAreaPos(noInId);
      if (sound == true) {
        jumpAudio.play();
      }
      $("#" + newId).append(
        `<div class="${moveingClassValue}" style="width:${wh[0]}%; height:${wh[1]}%;"></div>`
      );
    } else if (players[playerName].privateArea.includes(moveingClassValue)) {
      count++;
      $("." + moveingClassValue).remove();
      removeFromPrivateAreaPos(noInId, moveingClassValue, playerName);
      wh = getUpdatedWHprivateAreaPos(noInId);
      if (checkprivateAreaEnd(oldId)) {
        pass = true;
        removeFromArea(moveingClassValue, playerName, "privateArea");
        addToArea(moveingClassValue, playerName, "winArea");
        sendToWinArea(moveingClassValue, playerName, color);
        if (players[playerName].winArea.length == 4) {
          if (sound == true) {
            winAudioPlay = true;
            winAudio.play();
          }
          updateWinningOrder(playerName);
          showWinningBadge();
        }
        if (sound == true && winAudioPlay == false) {
          passAudio.play();
          passAudioPlay = true;
        }
      } else {
        noInId++;
        newId = color + "-out-" + noInId;
        oldId = newId;
        addToPrivateAreaPos(noInId, moveingClassValue, playerName);
        wh = getUpdatedWHprivateAreaPos(noInId);
        if (sound == true) {
          jumpAudio.play();
        }
        $("#" + newId).append(
          `<div class="${moveingClassValue}" style="width:${wh[0]}%; height:${wh[1]}%;"></div>`
        );
      }
    } else {
      count++;
      $("." + moveingClassValue).remove();
      removeFromOutAreaPos(noInId, moveingClassValue);
      wh = getUpdatedWHoutAreaPos(noInId);
      if (check52(oldId)) {
        noInId = 1;
        newId = "out" + noInId;
        oldId = newId;
      } else {
        noInId++;
        newId = "out" + noInId;
        oldId = newId;
      }

      addToOutAreaPos(noInId, moveingClassValue);
      wh = getUpdatedWHoutAreaPos(noInId);
      if (sound == true) {
        jumpAudio.play();
      }

      $("#" + newId).append(
        `<div class="${moveingClassValue}" style="width:${wh[0]}%; height:${wh[1]}%;"></div>`
      );
    }

    if (count == rndmNo) {
      clearInterval(timerId);
      cutPawn(noInId, moveingClassValue);
      if (sound == true && winAudioPlay == true) {
        winAudio.onended = () => {
          nextPlayer();
        };
      } else if (sound == true && passAudioPlay == true) {
        passAudio.onended = () => {
          nextPlayer();
        };
      } else {
        setTimeout(() => nextPlayer(), 500);
      }
    }
  }, 500);
}

/*  Move on Private Area */

function movePawnOnPrivateArea() {
  let privateAreaLength = players[playerName].privateArea.length;
  let outAreaLength = players[playerName].outArea.length;
  if (privateAreaLength == 0 || rndmNo == 5) {
    return;
  } else {
    let moveingClassArr = [];
    for (const cValue of players[playerName].privateArea) {
      let idValue = $("." + cValue)
        .parent()
        .attr("id");
      let noInId = getNoFromValue(idValue);
      if (rndmNo <= 5 - noInId) {
        moveingClassArr.push(cValue);
      }
    }
    if (moveingClassArr.length == 0) {
      flag = false;
      return;
    } else if (outAreaLength == 0 && moveingClassArr.length == 1) {
      flag = true;
      autoMoveOnPrivateArea(moveingClassArr);
    } else {
      flag = true;
      manuallyMoveOnPrivateArea(moveingClassArr);
    }
  }
}

function manuallyMoveOnPrivateArea(moveingClassArr) {
  let idArr = [];
  for (const classValue of moveingClassArr) {
    let idValue = $("." + classValue)
      .parent()
      .attr("id");
    if (idArr.includes(idValue)) {
      continue;
    } else {
      for (const cValue of players[playerName].privateAreaPos[
        getNoFromValue(idValue)
      ]) {
        if (cValue != classValue) {
          $("." + cValue).css("display", "none");
        }
      }
      $("." + classValue).css({
        width: 100 + "%",
        height: 100 + "%",
        display: "inline-block",
      });
      idArr.push(idValue);
      $("." + classValue).addClass("glow");
      $("." + classValue).one("click", function () {
        reUpdateOutAreaWH(...players[playerName].outArea);
        reUpdatePrivateAreaWH(...players[playerName].privateArea);
        moveOnPrivateArea(classValue);
      });
    }
  }
}

function autoMoveOnPrivateArea(moveingClassArr) {
  moveOnPrivateArea(moveingClassArr[0]);
}

function moveOnPrivateArea(cValue) {
  let idValue = $("." + cValue)
    .parent()
    .attr("id");
  let moveingClassValue = cValue;
  let noInId = getNoFromValue(idValue);
  let color = getColorFromValue(moveingClassValue);
  let count = -1;
  let newId = color + "-out-" + noInId;
  let oldId = newId;
  let wh = [];
  let winAudioPlay = false;
  let passAudioPlay = false;

  removeAllGlow("inArea", "outArea", "privateArea");
  removeAllEvent("inArea", "outArea", "privateArea");

  let timerId = setInterval(function () {
    count++;
    $("." + moveingClassValue).remove();
    removeFromPrivateAreaPos(noInId, moveingClassValue, playerName);

    wh = getUpdatedWHprivateAreaPos(noInId);

    if (checkprivateAreaEnd(oldId)) {
      pass = true;
      removeFromArea(moveingClassValue, playerName, "privateArea");
      addToArea(moveingClassValue, playerName, "winArea");
      sendToWinArea(moveingClassValue, playerName, color);
      if (players[playerName].winArea.length == 4) {
        if (sound == true) {
          winAudioPlay = true;
          winAudio.play();
        }
        updateWinningOrder(playerName);
        showWinningBadge();
      }
      if (sound == true && winAudioPlay == false) {
        passAudio.play();
        passAudioPlay = true;
      }
    } else {
      noInId++;
      newId = color + "-out-" + noInId;
      oldId = newId;
      addToPrivateAreaPos(noInId, moveingClassValue, playerName);
      wh = getUpdatedWHprivateAreaPos(noInId);
      if (sound == true) {
        jumpAudio.play();
      }
      $("#" + newId).append(
        `<div class="${moveingClassValue}" style="width:${wh[0]}%; height:${wh[1]}%;"></div>`
      );
    }

    if (count == rndmNo) {
      clearInterval(timerId);
      if (sound == true && winAudioPlay == true) {
        winAudio.onended = () => {
          nextPlayer();
        };
      } else if (sound == true && passAudioPlay == true) {
        passAudio.onended = () => {
          nextPlayer();
        };
      } else {
        setTimeout(() => nextPlayer(), 500);
      }
    }
  }, 500);
}

/* update player */
function updatePlayer() {
  if (players[playerName].inArea.length == 4 && rndmNo < 5) {
    setTimeout(() => nextPlayer(), 500);
    return;
  }
  if (players[playerName].winArea.length < 4) {
    if (flag == true) {
      flag = false;
      return;
    } else if (
      rndmNo == 5 &&
      players[playerName].outArea.length == 0 &&
      players[playerName].inArea.length == 0
    ) {
      setTimeout(() => nextPlayer(), 500);
      return;
    } else if (players[playerName].outArea.length > 0) {
      return;
    } else if (
      players[playerName].inArea.length > 0 &&
      flag == false &&
      rndmNo < 5
    ) {
      setTimeout(() => nextPlayer(), 500);
      return;
    } else if (
      players[playerName].inArea.length > 0 &&
      flag == false &&
      rndmNo == 5
    ) {
      return;
    } else {
      setTimeout(() => nextPlayer(), 500);
      return;
    }
  } else {
    setTimeout(() => nextPlayer(), 500);
    return;
  }
}

/* Move to Win Area*/
function sendToWinArea(cValue, pName, color) {
  $("#" + color + "-win-pawn-box").append(`<div class="${cValue}"></div>`);
  updateWinAreaCss(pName, color);
}

function updateWinAreaCss(pName, color) {
  let x = null;
  let y = null;
  const winAreaPxPY = [
    [[380, 380]],
    [
      [380, 380],
      [305, 305],
    ],
    [
      [380, 380],
      [230, 380],
      [380, 230],
    ],
    [
      [380, 380],
      [230, 380],
      [305, 305],
      [380, 230],
    ],
  ];
  let i = 0;
  let rotateValue = getRotateValue(color);
  let winAreaLength = players[pName].winArea.length;
  for (const classValue of players[pName].winArea) {
    x = winAreaPxPY[winAreaLength - 1][i][0];
    y = winAreaPxPY[winAreaLength - 1][i][1];
    i++;
    $("." + classValue).css({
      transform: `translate(${x}%, ${y}%) rotate(${rotateValue})`,
    });
  }
}

/* Winning Badge */
function updateWinningOrder(pName) {
  if (players[pName].winArea.length == 4) {
    winningOrder.push(pName);
  }
}

function showWinningBadge() {
  if (winningOrder.length > 0) {
    let idValue = winningOrder[winningOrder.length - 1];
    let url = getBadgeImage(winningOrder.length - 1);
    $("#" + idValue).append(
      `<div class="badge-box" style="background-image: ${url};"></div>`
    );
  }
}

function getBadgeImage(winNo) {
  let imageName = null;

  (winNo == 0 && (imageName = "win1")) ||
    (winNo == 1 && (imageName = "win2")) ||
    (winNo == 2 && (imageName = "win3"));

  return `url(../images/${imageName}.png)`;
}

/* cut the pawn */

function cutPawn(noInId, moveingClassValue) {
  if (players[playerName].outArea.includes(moveingClassValue)) {
    if ([1, 48, 9, 22, 35, 14, 27, 40].includes(noInId)) {
      return;
    } else {
      let colorInClass = getColorFromValue(moveingClassValue);
      let targetClass = null;
      for (const cValve of outAreaPos[noInId]) {
        if (colorInClass != getColorFromValue(cValve)) {
          targetClass = cValve;
        }
      }
      if (targetClass != null) {
        $("." + targetClass).remove();
        if (sound == true) {
          cutAudio.play();
        }
        colorInClass = getColorFromValue(targetClass);
        let pName = colorInClass + "Player";
        removeFromArea(targetClass, pName, "outArea");
        addToArea(targetClass, pName, "inArea");
        removeFromOutAreaPos(noInId, targetClass);
        let noInClass = getNoFromValue(targetClass);
        $(`#in-${colorInClass}-${noInClass}`).append(
          `<div class='${colorInClass}-pawn${noInClass}'></div>`
        );
        cut = true;
        getUpdatedWHoutAreaPos(noInId);
      }
    }
  } else {
    return;
  }
}

/* start game */
function startGame() {
  if (noOfPlayer == 2) {
    setPawn("r", "y");
  } else if (noOfPlayer == 3) {
    setPawn("r", "g", "y");
  } else {
    setPawn("r", "g", "y", "b");
  }
  $("main").css("display", "block");
  nextPlayer();
}
function setPawn(...color) {
  for (const colorName of color) {
    players[colorName + "Player"].inArea = [
      colorName + "-pawn1",
      colorName + "-pawn2",
      colorName + "-pawn3",
      colorName + "-pawn4",
    ];
    for (i = 1; i <= 4; i++)
      $(`#in-${colorName}-${i}`).append(
        `<div class='${colorName}-pawn${i}'></div>`
      );
  }
}
$("#twoPlayer").click(function () {
  $(".selected").removeClass("selected");
  $("#twoPlayer").addClass("selected");
  noOfPlayer = 2;
});
$("#threePlayer").click(function () {
  $(".selected").removeClass("selected");
  $("#threePlayer").addClass("selected");
  noOfPlayer = 3;
});
$("#fourPlayer").click(function () {
  $(".selected").removeClass("selected");
  $("#fourPlayer").addClass("selected");
  noOfPlayer = 4;
});

$("#startGame").click(function () {
  $("#home-container").css("display", "none");
  startGame();
});

/* restart Game */

function resetPawn(...color) {
  for (const colorName of color) {
    for (let i = 1; i <= 4; i++) {
      $(`.${colorName}-pawn${i}`).remove();
    }
  }
}

function restartGame() {
  $("#home-container").css("display", "block");
  $("main").css("display", "none");
  $("." + "badge-box").remove();
  if (noOfPlayer == 2) {
    resetPawn("r", "y");
  } else if (noOfPlayer == 3) {
    resetPawn("r", "g", "y");
  } else {
    resetPawn("r", "g", "y", "b");
  }
  $(diceBoxId).removeClass("startDiceRoll");
  $(diceBoxId).removeClass("showDice");
  $(diceBoxId).off();
  players = {
    rPlayer: new Player("out1", "out51"),
    gPlayer: new Player("out14", "out12"),
    yPlayer: new Player("out27", "out25"),
    bPlayer: new Player("out40", "out38"),
  };
  outAreaPos = new Position(52);
  playerNo = 0; // (red = 1, green = 2, yellow = 3, blue = 4)
  playerName = null; // store defult playerName
  diceBoxId = null; // store id value of dice box
  preDiceBoxId = null; // store id value of previou diceBoxId
  rndmNo = null; // generate rndmNo after dice is roll
  countSix = 0;
  cut = false;
  pass = false;
  flag = false;
  winningOrder = [];
}

$("#restart").click(function () {
  $("#alertBox").css("display", "block");
});

$("#ok").click(function () {
  restartGame();
  $("#alertBox").css("display", "none");
});

$("#cancel").click(function () {
  $("#alertBox").css("display", "none");
});

/* Sound Settings */

function soundSettings() {
  if (sound == true) {
    sound = false;
  } else {
    sound = true;
  }
}

$("#sound").click(function () {
  soundSettings();
  if (sound == true) {
    $("#sound").css("background-image", "url(../images/sound-on.svg)");
  } else {
    $("#sound").css("background-image", "url(../images/sound-off.svg)");
  }
});

/* fullsreen */

let elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) { /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE/Edge */
    elem.msRequestFullscreen();
  }
  $("#fullscreen").css("display", "none");
  $("#exitfullscreen").css("display", "inline-block");
}

function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }
   $("#exitfullscreen").css("display", "none");
   $("#fullscreen").css("display", "inline-block");
}

document.addEventListener("fullscreenchange", (event) => {
  // document.fullscreenElement will point to the element that
  // is in fullscreen mode if there is one. If there isn't one,
  // the value of the property is null.
  if (document.fullscreenElement) {
    $("#fullscreen").css("display", "none");
    $("#exitfullscreen").css("display", "inline-block");
  } else {
    $("#exitfullscreen").css("display", "none");
    $("#fullscreen").css("display", "inline-block");
  }
});

$("#fullscreen").click(function(){
  openFullscreen();
});

$("#exitfullscreen").click(function(){
  closeFullscreen();
});
