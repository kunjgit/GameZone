import { checkGameOver, gameStartItems } from "./game.js";
import { game } from "../data/gameData.js";
import { deleteGame, loadGame, saveGame } from "./load-save.js";
import { setGameSpeed, pauseGame } from "./gameTime.js";

import { popBootstrap } from "./ui/popUI.js";
import { updateDataInfo } from "./ui/ui.js";
import { selectGameDifficultyUI, gameOptionsUI } from "./ui/options.js";
import { buildingsBootstrap, updateMapItemsScale } from "./ui/buildingsUI.js";

import { jobs } from "./jobs.js";
import { buildBuilding, destroyBuilding } from "./buildings.js";

import { buildingsData } from "../data/buildingsData.js";
import { populationStart } from "./population.js";

//Cancel reload of the page
window.addEventListener("beforeunload", function (event) {
    if(!game.gameOver)
        event.returnValue = "\o/";
});

window.onresize = e => {
    document.querySelector("body").style.height = window.innerHeight-20+"px";
};

window.onclick = e => {
    //Buildings
    const b = e.target.id.replace(/^add-/, "");
    if(buildingsData.hasOwnProperty(b)){
        buildBuilding(b);
    }
    if(game.destroyBuildingCheck){
        if(e.target.parentNode.classList.contains("map-item")){
            const building = e.target.parentNode.classList[3].substring(4);
            destroyBuilding(building, 1);
        }
    }

    if(e.target.id == "load-village"){
        document.getElementById("load-game").classList.add("hidden");
        loadGame(document.getElementById("village-to-load").value);
        startSequence("load-game");
    } 
    if(e.target.id == "delete-village"){
        Swal.fire({
            title: "Deseja mesmo Deletar?",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Deletar",
            cancelButtonText: "Voltar",
        }).then((result) => {
            if(result.isConfirmed){
                deleteGame(document.getElementById("village-to-load").value);
            }
        });
    } 
    if(e.target.id == "surrender"){
        Swal.fire({
            title: "Deseja mesmo Desistir?",
            icon: "warning",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showCancelButton: true,
            confirmButtonColor: "#d33",
            confirmButtonText: "Desistir",
            cancelButtonText: "Voltar",
        }).then((result) => {
            if(result.isConfirmed){
                game.gameOver = true;
                game.gameSurrender = true;
                checkGameOver();
            }
        });
    }
    if(e.target.id == "start"){
        startSequence("new-game");
    } 
    if(e.target.id == "load"){
        document.getElementById("start-game").classList.add("hidden");
        document.getElementById("load-game").classList.remove("hidden");
    } 
    if(e.target.id == "options"){
        gameOptionsUI();
    } 
    if(e.target.id == "back-to-start"){
        document.getElementById("start-game").classList.remove("hidden");
        document.getElementById("load-game").classList.add("hidden");
    } 
    if(e.target.id == "restart"){
        document.location.reload(true);
    }
    if(e.target.id == "pause"){
        pauseGame();
    } 
    if(e.target.id == "1x"){
        setGameSpeed("1x");
    }
    if(e.target.id == "5x"){
        setGameSpeed("5x");
    }    
    if(e.target.id == "10x"){
        setGameSpeed("10x");
    }    
    if(e.target.id == "save-game"){
        saveGame();
    } 
}

for(let i = 0; i < document.querySelectorAll(".professions-slider").length; i++){
    document.querySelectorAll(".professions-slider")[i].addEventListener("input", () => {
        updateDataInfo();
        jobs();
    });
}

async function startSequence(type){
    if(type == "new-game")
        await selectGameDifficultyUI();

    gameStartItems();
    buildingsBootstrap();
    updateDataInfo();
    popBootstrap();
    populationStart();
    updateMapItemsScale();

    game.gameStarted = true;
    game.gamePaused = true;

    document.getElementById("start-game").classList.add("hidden");
    document.getElementById("game-version").remove();
    document.getElementById("pause").classList.add("btn-active");
    document.getElementById("buildings-menu").classList.remove("hidden");
    document.getElementById("pause").classList.remove("hidden");
    document.getElementById("1x").classList.remove("hidden");
    document.getElementById("5x").classList.remove("hidden");
    document.getElementById("10x").classList.remove("hidden");
    document.getElementById("left-section").style.display = "flex";
    document.getElementById("info-section").style.display = "flex";
    document.getElementById("map").style.display = "flex";
}