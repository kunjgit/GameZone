var defaults = {
    "easy": {
      "gridSize": 3,
      "timeout": 1800
    },
    "medium": {
      "gridSize": 4,
      "timeout": 1500
    },
    "hard": {
      "gridSize": 5,
      "timeout": 1200
    }
  };
  
  var intensity;
  var time;
  
  var score = 0;
  var highscore = 0;
  var gameTimeout = 0;
  var timeout = 0;
  var correct = false;
  var lastRandomRow = 0;
  var lastRandomCell = 0;
  var reactionTimes = [];
  
  document.addEventListener("DOMContentLoaded", function() {
    clearCells();
  
    var tds = document.querySelectorAll("td");
    tds.forEach(function(td) {
      td.addEventListener("click", function() {
        clearTimeout(gameTimeout);
        correct = this.classList.contains("cellselect");
        if (correct) {
          reactionTimes.push(parseInt((new Date().getTime() - time).toFixed(3)));
          score += 1;
          game(false);
        } else {
          endGame();
        }
      });
    });
  
    var svg = document.querySelector("svg");
    svg.addEventListener("click", function() {
      var selector = document.getElementById("selector");
      var howToPlay = document.getElementById("howtoplay");
      if (selector.style.display === "none") {
        selector.style.display = "block";
        howToPlay.style.display = "none";
      } else {
        selector.style.display = "none";
        howToPlay.style.display = "block";
      }
    });
  });
  
  function prepare(level) {
    document.querySelector("svg").style.display = "none";
    countdown();
    intensity = level;
    switch (level) {
      case "easy":
        setTimeout(function() {
          start();
        }, 3000);
        break;
      case "medium":
        setTimeout(function() {
          start();
        }, 3000);
        break;
      case "hard":
        setTimeout(function() {
          start();
        }, 3000);
        break;
    }
  }
  
  function highlight(count) {
    unhighlight();
    var levelIcons = document.querySelectorAll(".levelicon");
    levelIcons.forEach(function(icon, index) {
      var itemCount = index + 1;
      var backgroundColour = getBackgroundColour(count);
      if (itemCount <= count) {
        icon.style.backgroundColor = backgroundColour;
      }
    });
  }
  
  function unhighlight() {
    var levelIcons = document.querySelectorAll(".levelicon");
    levelIcons.forEach(function(icon) {
      icon.style.backgroundColor = "#555555";
    });
  }
  
  function getBackgroundColour(count) {
    switch (count) {
      case 1:
        return "#59DB28";
      case 2:
        return "#F6B921";
      case 3:
        return "#CA0424";
      default:
        return "#555555";
    }
  }
  
  function countdown() {
    var timer = 3;
    document.querySelector(".level").style.display = "none";
    document.querySelector(".countdown").style.display = "block";
    document.querySelector(".countdown").textContent = timer;
  
    var interval = setInterval(function() {
      if (timer > 1) {
        timer -= 1;
        document.querySelector(".countdown").textContent = timer;
      } else {
        clearInterval(interval);
      }
    }, 1000);
  }
  
  function start() {
    document.getElementById("selector").style.display = "none";
    var level = "#" + intensity;
    document.querySelector(level).classList.remove("hidden");
    document.querySelector(level).classList.add("selected");
    game(true);
  }
  
  function game(start) {
    clearCells();
    clearTimeout(gameTimeout);
    if (!correct && !start) {
      endGame();
    } else {
      correct = false;
      gameTimeout = 0;
      var level = defaults[intensity];
      timeout = level.timeout - (score * level.gridSize);
      var randomRow = getRandom(level, lastRandomRow);
      lastRandomRow = randomRow;
      var randomCell = getRandom(level, lastRandomCell);
      lastRandomCell = randomCell;
      var row = document.querySelectorAll("#" + intensity + " tr")[randomRow - 1];
      row.cells[randomCell - 1].classList.add("cellselect");
      time = new Date().getTime();
      gameTimeout = setTimeout(function() {
        game(false);
      }, timeout);
    }
  }
  
  function getRandom(level, number) {
    var random = Math.floor((Math.random() * level.gridSize) + 1);
    if (random === number) {
      return getRandom(level, number);
    } else {
      return random;
    }
  }
  
  function clearCells() {
    var tds = document.querySelectorAll("td");
    tds.forEach(function(td) {
      td.classList.remove("cellselect");
    });
  }
  
  function endGame() {
    if (score > highscore) {
      highscore = score;
    }
    var intensityElement = document.getElementById(intensity);
    intensityElement.classList.add("hidden");
    intensityElement.classList.remove("selected");
    document.querySelector("#gameover .score").textContent = score;
    document.querySelector("#gameover .average").textContent = getAverage() + " milliseconds";
    document.querySelector("#gameover .highscore").textContent = highscore;
    document.getElementById("gameover").style.display = "block";
  }
  
  function getAverage() {
    var count = 0;
    reactionTimes.forEach(function(value) {
      count += value;
    });
  
    if (reactionTimes.length > 0) {
      return (count / reactionTimes.length).toFixed(3);
    } else {
      return 0;
    }
  }
  
  function restart() {
    intensity = null;
    correct = false;
    timeout = 0;
    score = 0;
    lastRandomCell = 0;
    lastRandomCell = 0;
    time = 0;
    reactionTimes = [];
    document.getElementById("gameover").style.display = "none";
    document.querySelector("svg").style.display = "block";
    document.querySelector(".level").style.display = "block";
    document.querySelector(".countdown").style.display = "none";
    document.getElementById("selector").style.display = "block";
  }
  