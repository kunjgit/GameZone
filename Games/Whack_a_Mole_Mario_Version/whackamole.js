let currMoleTile;
let currPlantTile;
let score = 0;
let gameover = false;

window.onload = function () {
    setGame();
    
    const restartbtn = document.getElementById("restart");
    restartbtn.addEventListener("click", restartfun);
};

function setGame() {
  for (let i = 0; i < 9; i++) {
    let tile = document.createElement("div");
    tile.id = i.toString(); // assign each tile a id
    tile.addEventListener("click", selectTile);
    document.getElementById("board").appendChild(tile);
  }
  setInterval(setMole, 1000);
  setInterval(setPlant, 2000);
}

function getRandomTile() {
  let num = Math.floor(Math.random() * 9);
  return num.toString();
}

function setMole() {
  if (gameover) {
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
  if (gameover) {
    return;
  }

  if (currPlantTile) {
    currPlantTile.innerHTML = "";
  }

  let plant = document.createElement("img");
  plant.src = "piranha-plant.png";
  let num = getRandomTile();
  if (currMoleTile && currMoleTile.id == num) {
    return;
  }
  currPlantTile = document.getElementById(num);
  currPlantTile.appendChild(plant);
}

function selectTile() {
  if (gameover) {
    return;
  }

  if (this == currMoleTile) {
    score += 10;
    document.getElementById("score").innerText = score.toString();
  } else if (this == currPlantTile) {
    document.getElementById("score").innerText =
      "GAME OVER : " + score.toString();
    gameover = true;
  }
}



function restartfun(){
    score = 0;
    gameover =  false;
    currMoleTile = null;
    currPlantTile = null;
    document.getElementById("score").innerText = score.toString();

    for (let i = 0; i < 9; i++) {
        document.getElementById(i.toString()).innerHTML = ""; 
    }
    clearInterval();
    setInterval();
}