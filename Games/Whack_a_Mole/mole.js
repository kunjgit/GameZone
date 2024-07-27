let currMoleTile;
let currPlantTile;
let score = 0;
let gameOver = false;
let moleIntervalId;
let plantIntervalId;
let speed = 2500;
window.onload = function() {
    setGame();
    document.getElementById('speed-slider').addEventListener('input',()=>{
        speed = 3000 - parseInt(document.getElementById('speed-slider').value)*500;
    });
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
    setInterval(setMole, speed); // 1000 miliseconds = 1 second, every 1 second call setMole
    setInterval(setPlant, 2000); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
}

function getRandomTile() {
    //math.random --> 0-1 --> (0-1) * 9 = (0-9) --> round down to (0-8) integers
    let num = Math.floor(Math.random() * 9);
    return num.toString();
}

function setMole() {
    if (gameOver) {
        return;
    }
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    let mole = document.createElement("img");
    mole.src = "./monty-mole.png";

    let num = getRandomTile();
    if (currPlantTile && currPlantTile.id == num) {
        return;
    }
    currMoleTile = document.getElementById(num);
    currMoleTile.appendChild(mole);
}

function setPlant() {
    if (gameOver) {
        return;
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    let plant = document.createElement("img");
    plant.src = "./piranha-plant.png";

    let num = getRandomTile();
    if (currMoleTile && currMoleTile.id == num) {
        return;
    }
    currPlantTile = document.getElementById(num);
    currPlantTile.appendChild(plant);
}

function selectTile() {
  if (gameOver) {
    return;
  }
  if (this == currMoleTile) {
    score += 10;
    document.getElementById("score").innerText = score.toString(); //update score html
  } else if (this == currPlantTile) {
     let btn = document.getElementById("btn");
     btn.textContent = "Start New Game";
    document.getElementById("score").innerText =
      "GAME OVER: " + score.toString(); //update score html
    gameOver = true;
    let backgroundMusic = document.getElementById("background-music");
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Rewind the music to the beginning
    // Play the game over sound
    let gameOverSound = document.getElementById("gameOver-music");
    gameOverSound.play();
    setTimeout(() => {
      gameOverSound.pause();
      gameOverSound.currentTime = 0; // Reset to the beginning if desired
    }, 3000); // 3000 milliseconds = 3 seconds
  }

}


window.onload = function() {
    setGame();
    document.querySelector('.start-btn').addEventListener('click', startNewGame);
    document.getElementById('speed-slider').addEventListener('input',()=>{
        speed = 3000 - parseInt(document.getElementById('speed-slider').value)*500;
    });
}

function setGame() {
    //set up the grid in html
    for (let i = 0; i < 9; i++) { //i goes from 0 to 8, stops at 9
        //<div id="0-8"></div>
        let tile = document.createElement("div");
        tile.id = i.toString();
        tile.addEventListener("click", selectTile);
        document.getElementById("board").appendChild(tile);
    }
}

function startNewGame() {
    resetGame();
    moleIntervalId = setInterval(setMole, speed); // 1000 miliseconds = 1 second, every 1 second call setMole
    plantIntervalId = setInterval(setPlant, 2000); // 2000 miliseconds = 2 seconds, every 2 second call setPlant
    
    let gameOverSound = document.getElementById("gameOver-music");
    if (!gameOverSound.paused) {
      gameOverSound.pause();
      gameOverSound.currentTime = 0;
    }

     let backgroundMusic = document.getElementById("background-music");
     backgroundMusic.play();
     let btn = document.getElementById("btn");
     btn.textContent = "The game has been started!";
      document.getElementById("speed-section").style.display = "none";
}

function resetGame() {
    // Clear existing moles and plants
    if (currMoleTile) {
        currMoleTile.innerHTML = "";
    }
    if (currPlantTile) {
        currPlantTile.innerHTML = "";
    }
    // Reset score and game over flag
    score = 0;
    gameOver = false;
    document.getElementById("score").innerText = score.toString();
}
