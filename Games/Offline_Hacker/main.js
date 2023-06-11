const wordList = {
  main: [
    "offline",
    "disconnected",
    "down",
    "logged off",
    "address",
    "algorithm",
    "binary",
    "byte",
    "cpu",
    "cloud",
    "client",
    "css",
    "content delivery network",
    "data",
    "database",
    "decompress",
    "desktop",
    "digital",
    "document",
    "disk operating system",
    "download",
    "electricity",
    "email",
    "explorer",
    "file allocation table",
    "fat32",
    "file",
    "filesharing",
    "filesystem",
    "firewall",
    "folder",
    "freeware",
    "ftp",
    "gigabyte",
    "gpu",
    "hacker",
    "hard disk",
    "hardware",
    "hdmi",
    "home page",
    "html",
    "http",
    "install",
    "java",
    "javascript",
    "kernel",
    "keyboard",
    "key",
    "laptop",
    "malware",
    "megabyte",
    "monitor",
    "motherboard",
    "mouse",
    "modem",
    "mp4",
    "network",
    "open source",
    "operating system",
    "page",
    "personal computer",
    "php",
    "piracy",
    "plug-in",
    "printer",
    "privacy",
    "program",
    "random_access_memory",
    "read-only_memory",
    "root",
    "recycle bin",
    "scan",
    "search engine",
    "security",
    "server",
    "shareware",
    "software",
    "spam",
    "spyware",
    "super computer",
    "sdk",
    "terabyte",
    "upload",
    "user",
    "version",
    "virus",
    "xml",
    "optical drive",
    "webcam",
    "graphics card",
    "microphone",
    "variable",
    "constant",
    "loop",
    "framework",
    "keydown",
    "encryption",
    "bug",
    "ethernet",
    "processor",
    "machine language",
    "access violation",
    "arithmetic operator",
    "automated unit testing",
    "backend",
    "background thread",
    "binary search",
    "boolean",
    "block-level operator",
    "bracket",
    "branch",
    "bug tracking",
    "bytecode",
    "camelcase",
    "closure",
    "comment",
    "concatenation",
    "constant",
    "dead code",
    "declarative programming",
    "decompiler",
    "endless loop",
    "escape character",
    "event-driven programming",
    "inheritance",
    "loosely typed language",
    "library",
    "middleware",
    "null",
    "overflow error",
    "parenthesis",
    "procedural language",
    "pseudocode",
    "random seed",
    "recursion",
    "reserved word",
    "routing algorithm",
    "schema",
    "source code",
    "spaghetti code",
    "stack pointer",
    "subroutine",
    "superclass",
    "undefined",
    "error",
    "buffering",
    "dropped packets",
    "back door",
    "bot",
    "phishing",
    "compiler",
    "cookie",
    "doxing",
    "firewall",
    "keystroke logging",
    "malware",
    "remote access",
    "rootkit",
    "spyware",
    "trojan horse",
    "crypto",
    "deep web",
    "exploit",
    "jailbreak",
    "metadata",
    "script kiddies",
    "verification",
    "warez",
    "bluetooth",
    "firmware",
    "patch",
    "processor",
    "optical drive",
    "overclocking",
    "solid-state drive",
    "floppy disk",
    "usb-c",
    "antivirus",
    "codec",
    "debugger",
    "drag and drop",
    "file compression",
    "open source",
    "public domain",
    "screenshot",
    "zero day exploit",
  ],
  listTwo: [],
  playerList: [],
  listCopy: function () {
    listTwo = [];
    this.main.map((item) => this.listTwo.push(item));
  },
  playerListCreate: function () {
    playerList = [];
    while (this.listTwo.length > 0) {
      let newRand = Math.floor(Math.random() * this.listTwo.length);
      this.playerList.push(this.listTwo[newRand]);
      this.listTwo.splice(newRand, 1);
    }
  },
  playerListRemove: function () {
    this.playerList.shift();
  },
};

const gameFuncs = {
  currentWords: [],
  gameOverAnimDetails: { amt: 8, arr: [] },
  gameInProgress: false,
  soundEffect: new Audio("sounds/sfx.ogg"),
  currTime: new Date().getTime(),
  gameTimer: 1,
  lives: { maxLives: 3, currentLives: 3, livesLost: 0 },
  score: 0,
  gameEngineSpeed: 25,
  gameSpeedAddCheck: 0,
  scoreList: [],
  destroyedLetters: [],
  spawnInterval: 50,
  removableWords: [],

  addScore: function (word) {
    this.score += word.length * 10;
    this.scoreList.push({ yPos: 0, score: word.length * 10 });
    this.gameSpeedAddCheck += word.length * 10;
    if (this.gameSpeedAddCheck > 1000 && this.gameEngineSpeed <= 45) {
      this.gameEngineSpeed += 2;
      this.gameSpeedAddCheck = 0;
    }
  },
  sListPos: function () {
    for (let i = 0; i < this.scoreList.length; i++) {
      this.scoreList[i].yPos -= 3;
      if (this.scoreList[i].yPos < -30) {
        this.scoreList.splice(i, 1);
        i--;
      }
    }
  },
  addDestroyedLetter: function (letter, obj) {
    const nObj = {};
    nObj.letter = letter;
    nObj.xPos = obj.xPos + obj.inputPos * 14;
    nObj.yPos = obj.yPos;
    nObj.ySpeedArrPos = 0;
    nObj.ySpeed = [-8, -2, 0, 1, 2, 4, 6, 8, 10, 14, 20, 28];
    this.destroyedLetters.push(nObj);
  },
  moveDestroyedLetters: function () {
    for (let i = 0; i < this.destroyedLetters.length; i++) {
      const lt = this.destroyedLetters[i];
      lt.xPos -= 2;
      lt.yPos += lt.ySpeed[lt.ySpeedArrPos];
      if (lt.ySpeedArrPos < lt.ySpeed.length - 1) {
        lt.ySpeedArrPos += 1;
      }
      if (lt.yPos > canvasData.cHeight) {
        this.destroyedLetters.splice(i, 1);
        i--;
      }
    }
  },
  getUniqueYpos: function () {
    let newYpos = Math.floor(Math.random() * (canvasData.cHeight - 50)) + 15;
    let similarYpos = false;
    for (let i = 0; i < gameFuncs.currentWords.length; i++) {
      if (gameFuncs.currentWords[i].xPos < 100) {
        if (
          newYpos > gameFuncs.currentWords[i].yPos - 20 &&
          newYpos < gameFuncs.currentWords[i].yPos + 20
        ) {
          similarYpos = true;
        }
      }
    }
    if (similarYpos) {
      console.log("going again");
      return gameFuncs.getUniqueYpos();
    } else {
      console.log(newYpos);
      return newYpos;
    }
  },
  getCurrentWord: function (word) {
    const nObj = {};
    nObj.word = word.split("");
    nObj.yPos = gameFuncs.getUniqueYpos();
    nObj.xPos = 0;
    nObj.speed = Math.floor(Math.random() * 1.4) + 0.5;
    nObj.inputPos = 0;
    nObj.reachedEnd = false;
    this.currentWords.push(nObj);
  },
  setGameInProgress: function (bool) {
    this.gameInProgress = bool;
  },
  drawGame: function (wds) {
    const ctx = canvasData.ctx;
    ctx.clearRect(0, 0, canvasData.cWidth, canvasData.cHeight);
    ctx.fillStyle = "#232323";
    ctx.fillRect(0, 0, canvasData.cWidth, canvasData.cHeight);

    //draw destroyed letters
    for (let i = 0; i < this.destroyedLetters.length; i++) {
      ctx.fillStyle = "green";
      ctx.font = "22px monospace";
      ctx.fillText(
        this.destroyedLetters[i].letter,
        this.destroyedLetters[i].xPos,
        this.destroyedLetters[i].yPos
      );
    }

    for (let i = 0; i < wds.length; i++) {
      for (let j = 0; j < wds[i].word.length; j++) {
        if (j < wds[i].inputPos) {
          ctx.fillStyle = "rgba(206, 206, 206, 0.1)";
        } else if (j == wds[i].inputPos) {
          ctx.fillStyle = "#2ca823";
        } else {
          ctx.fillStyle = "green";
        }
        ctx.font = "22px monospace";
        ctx.fillText(wds[i].word[j], wds[i].xPos + j * 14, wds[i].yPos);
        if (j == wds[i].word.length - 1) {
          this.checkLostLife(wds[i].xPos + j * 14 + 8, i);
        }
      }
    }
    //draw info area
    ctx.fillStyle = "green";
    ctx.fillRect(
      0,
      canvasData.cHeight - 22,
      canvasData.cWidth,
      canvasData.cHeight
    );
    //show score
    ctx.fillStyle = "black";
    ctx.font = "bold 23px monospace";
    ctx.fillText(this.score, 10, canvasData.cHeight - 4);
    //lives text
    ctx.font = "bold 18px monospace";
    ctx.fillText("Lives: ", canvasData.cWidth - 130, canvasData.cHeight - 6);
    //lives
    for (let i = this.lives.maxLives; i >= 1; i--) {
      if (i <= this.lives.currentLives) {
        ctx.fillStyle = "black";
      } else {
        ctx.fillStyle = "grey";
      }
      ctx.fillRect(
        canvasData.cWidth - 75 + i * 12,
        canvasData.cHeight - 19,
        8,
        16
      );
    }
    for (let i = 0; i < this.scoreList.length; i++) {
      ctx.fillStyle = "green";
      ctx.font = "bold 18px monospace";
      ctx.fillText(
        "+" + this.scoreList[i].score,
        20,
        canvasData.cHeight - 20 + this.scoreList[i].yPos
      );
    }
  },
  checkLostLife: function (hitBox, arrPos) {
    if (hitBox >= canvasData.cWidth) {
      this.removableWords.push(arrPos);
      this.currentWords[arrPos].reachedEnd = true;
      this.lives.livesLost++;
    }
  },
  removeLives() {
    this.lives.currentLives -= this.lives.livesLost;
    this.lives.livesLost = 0;
  },
  checkWord: function (pos, word, itemNum) {
    if (pos == word.length) {
      this.removableWords.push(itemNum);
    }
  },
  changeInputPos: function (num, pos) {
    gameFuncs.currentWords[pos].inputPos += num;
    if (
      gameFuncs.currentWords[pos].word[gameFuncs.currentWords[pos].inputPos] ==
      " "
    ) {
      gameFuncs.currentWords[pos].inputPos += num;
    }
  },
  userInput: function (wordArr, key) {
    for (let i = 0; i < wordArr.length; i++) {
      if (wordArr[i].word[wordArr[i].inputPos] == key) {
        this.addDestroyedLetter(
          wordArr[i].word[wordArr[i].inputPos],
          wordArr[i]
        );
        this.changeInputPos(1, i);
        this.checkWord(wordArr[i].inputPos, wordArr[i].word, i);
      }
    }
  },
  removeWords: function (removeAll) {
    this.removableWords.sort((a, b) => a - b);

    for (let i = this.removableWords.length - 1; i >= 0; i--) {
      if (!this.currentWords[this.removableWords[i]].reachedEnd && !removeAll) {
        this.addScore(this.currentWords[i].word);
        this.soundEffect.play();
      }
      this.currentWords.splice(this.removableWords[i], 1);
      for (let j = i + 1; j < this.removableWords.length; j++) {
        this.removableWords[j] -= 1;
      }
    }
    this.removableWords = [];
  },
  removeAllWords: function () {
    for (let i = 0; i < this.currentWords.length; i++) {
      this.removableWords.push(i);
    }
    gameFuncs.removeWords(true);
  },
  setNewWord: function () {
    this.getCurrentWord(wordList.playerList[0]);
    wordList.playerListRemove();
    if (wordList.playerList.length < 2) {
      wordList.listCopy();
      wordList.playerListCreate();
    }
  },
  moveWords: function (wds) {
    for (let i = 0; i < wds.length; i++) {
      wds[i].xPos += wds[i].speed;
    }
  },
  createWord: function (startTime) {
    if (this.gameTimer % this.spawnInterval == 0) {
      this.setNewWord();
      this.spawnTime += this.spawnInterval;
    }
  },
  setFlashScreen: function () {
    this.damageCurrent = true;
    setTimeout(function () {
      gameFuncs.damageCurrent = false;
    }, 100);
  },
  greenScreen: function () {
    canvasData.ctx.fillStyle = "green";
    canvasData.ctx.fillRect(0, 0, canvasData.cWidth, canvasData.cHeight);
  },
  gameOverAnimDetCreate: function () {
    this.gameOverAnimDetails.arr = [];
    const amt = 8;
    for (let i = 0; i < this.gameOverAnimDetails.amt; i++) {
      const nEl = {};
      if (i % 2 !== 0) {
        nEl.dir = -1;
        nEl.xPos = canvasData.cWidth;
      } else {
        nEl.dir = 1;
        nEl.xPos = -canvasData.cWidth;
      }
      nEl.yPos = i * (canvasData.cHeight / this.gameOverAnimDetails.amt);
      this.gameOverAnimDetails.arr.push(nEl);
    }
  },
  gameOverAnimDetUpdate: function () {
    for (let i = 0; i < this.gameOverAnimDetails.arr.length; i++) {
      if (this.gameOverAnimDetails.arr[i].dir == 1) {
        this.gameOverAnimDetails.arr[i].xPos += 40;
      } else {
        this.gameOverAnimDetails.arr[i].xPos -= 40;
      }
    }
    if (this.gameOverAnimDetails.arr[0].xPos < 20) {
      setTimeout(function () {
        gameFuncs.gameOverAnimation();
      }, 60);
    } else {
      setTimeout(function () {
        gameFuncs.gameOverInfo();
      }, 60);
    }
  },
  gameOverInfo: function () {
    canvasData.ctx.fillStyle = "black";
    canvasData.ctx.fillRect(
      canvasData.cWidth / 10,
      canvasData.cHeight / 10,
      canvasData.cWidth / 1.25,
      canvasData.cHeight / 1.25
    );
    //hand assigned text values
    canvasData.ctx.fillStyle = "green";
    canvasData.ctx.font = "bold 42px monospace";
    canvasData.ctx.fillText("Game Over", canvasData.cWidth / 2 - 100, 150);
    canvasData.ctx.font = "bold 32px monospace";
    canvasData.ctx.fillText(
      "Press 'R' to retry",
      canvasData.cWidth / 2 - 160,
      210
    );
    canvasData.ctx.fillText(
      "You managed to score: " + gameFuncs.score,
      canvasData.cWidth / 2 - 220,
      300
    );
  },
  gameOverAnimation: function () {
    const gd = this.gameOverAnimDetails;
    canvasData.ctx.fillStyle = "green";
    for (let i = 0; i < gd.arr.length; i++) {
      canvasData.ctx.fillRect(
        gd.arr[i].xPos,
        gd.arr[i].yPos,
        canvasData.cWidth,
        canvasData.cHeight / gd.amt
      );
    }
    this.gameOverAnimDetUpdate();
  },
  gameIntro: function () {
    canvasData.ctx.fillStyle = "black";
    canvasData.ctx.fillRect(0, 0, canvasData.cWidth, canvasData.cHeight);
    canvasData.ctx.fillStyle = "green";
    canvasData.ctx.font = "bold 20px monospace";
    canvasData.ctx.fillText(
      "Oh no! You've been hacked and brought offline.",
      30,
      60
    );
    canvasData.ctx.fillText(
      "What foul and devilishly handsome hacker did this?",
      30,
      90
    );
    canvasData.ctx.fillText(
      "Well you'll never find out as this is the only story screen.",
      30,
      120
    );
    canvasData.ctx.fillText(
      "The only way to try and get back online is to stop the hack.",
      30,
      170
    );
    canvasData.ctx.fillText(
      "To do this you'll have to input the words that appear before",
      30,
      200
    );
    canvasData.ctx.fillText(
      "they reach the right hand side of the screen.",
      30,
      230
    );
    canvasData.ctx.fillText(
      "This will for some reason slow the hack down. Don't question",
      30,
      280
    );
    canvasData.ctx.fillText(
      "it mighty hero, your typing skills are needed. Good luck!",
      30,
      310
    );

    canvasData.ctx.fillRect(0, 370, canvasData.cWidth, 48);

    canvasData.ctx.font = "bold 32px monospace";
    canvasData.ctx.fillStyle = "black";
    canvasData.ctx.fillText("To begin the game press 'Enter' or 'R'", 18, 405);
  },
  gameEngine: function () {
    //this.createWord(this.gameTimer);
    this.moveWords(this.currentWords);
    this.moveDestroyedLetters();
    this.drawGame(this.currentWords);
    if (this.removableWords.length > 0) {
      this.removeWords();
    }
    if (this.lives.livesLost > 0) {
      this.removeLives();
      if (this.lives.currentLives > 0) {
        this.removeAllWords();
        this.setFlashScreen();
      }
    } else {
      this.createWord(this.gameTimer);
    }
    if (this.scoreList.length > 0) {
      this.sListPos();
    }
    if (this.damageCurrent) {
      this.greenScreen();
    }
    if (this.lives.currentLives > 0) {
      setTimeout(() => {
        this.gameEngine();
      }, 1000 / this.gameEngineSpeed);
    } else {
      gameFuncs.setGameInProgress(false);
      this.drawGame(this.currentWords);
      this.gameOverAnimDetCreate();
      this.gameOverAnimation();
    }
    this.gameTimer++;
  },
};

const canvasData = {
  cWidth: 720,
  cHeight: 480,
  c: document.querySelector(".gameCanvas"),
  ctx: document.querySelector(".gameCanvas").getContext("2d"),
};

document.body.addEventListener("keyup", (e) => {
  if (gameFuncs.gameInProgress) {
    gameFuncs.userInput(gameFuncs.currentWords, e.key);
  } else {
    if (e.key == "r" || e.key == "Enter") {
      startGame();
    }
  }
});

function startGame() {
  gameFuncs.lives.currentLives = 3;
  gameFuncs.score = 0;
  gameFuncs.gameEngineSpeed = 25;
  gameFuncs.scoreList = [];
  gameFuncs.currentWords = [];
  wordList.listCopy();
  wordList.playerListCreate();
  gameFuncs.setNewWord();
  gameFuncs.setGameInProgress(true);
  gameFuncs.gameEngine();
}

(function initApp() {
  gameFuncs.soundEffect.volume = 0.012;
  gameFuncs.gameIntro();
})();
