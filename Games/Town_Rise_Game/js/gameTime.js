import { game } from "../data/gameData.js"
import { newTurn } from "./game.js";

let lastGameSpeed;

export function setGameSpeed(speed){
    lastGameSpeed = speed;

    if(speed == "1x")       game.gameSpeed = 1000;
    else if(speed == "5x")  game.gameSpeed = 350;
    else if(speed == "10x") game.gameSpeed = 75;
    else{
        lastGameSpeed = "1x";
        speed = "1x";
        game.gameSpeed = 1000;
    }

    clearTimeout(game.gameTick);
    game.gamePaused = false;
    game.gameTick = setTimeout(newTurn, game.gameSpeed);
    speedBtnsClassReset();
    document.getElementById(speed).classList.add("btn-active");
}

export function pauseGame(){
    clearTimeout(game.gameTick);
    speedBtnsClassReset();
    game.gamePaused = true;
    document.getElementById("pause").classList.add("btn-active");
}

export function playGame(){
    clearTimeout(game.gameTick);
    setGameSpeed(lastGameSpeed);
}

function speedBtnsClassReset(){
    document.getElementById("pause").classList.remove("btn-active");
    document.getElementById("1x").classList.remove("btn-active");
    document.getElementById("5x").classList.remove("btn-active");
    document.getElementById("10x").classList.remove("btn-active");
}