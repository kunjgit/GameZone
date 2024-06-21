import { game } from "../data/gameData.js";
import { updateDataInfo } from "./ui/ui.js";
import { buildingHTML, destroyBuildingHTML,updateMapItemsScale } from "./ui/buildingsUI.js";
import { average } from "./funcs.js";
import { jobs } from "./jobs.js";
import { buildingsData } from "../data/buildingsData.js";
import { resourceChange } from "./resources.js";

import { cropField } from "./buildings/cropField.js";
import { orchard } from "./buildings/orchard.js";
import { homes } from "./buildings/homes.js";

export function buildingsUpdate(){
    jobs();

    //Specific Updates
    cropField();
    orchard();

    generalUpdate();

    homes();

    updateMapItemsScale();

/*
    //school();
    cropField();
    farm();
    tailorsmith();
    foundry();
    lumbermill();
    sawmill();
    //warehouse();
    //quarry();
    mine();
    tavern();*/
}

function generalUpdate(){
    for(const b in buildingsData){
        const building = buildingsData[b];

        let allInputSupply = [];
        let allJobSupply = [];

        //Jobs
        for(const j in building.jobs){
            let jobSupply = game[j]/game[j+"_jobs"];

            if(jobSupply > 1) jobSupply = 1;
            if(!jobSupply) jobSupply = 0;

            allJobSupply.push(jobSupply);
        }

        //Calculate Input/Needs Supply
        for(const c in building.maintenance){
            const inputConsumption = building.maintenance[c] * game[b];
            let inputSupply =  game[c]/inputConsumption;
            
            if(inputSupply > 1) inputSupply = 1;
            if(inputSupply < 1) game[c+"_lack"] = true;
            if(!inputSupply) inputSupply = 0;

            allInputSupply.push(inputSupply);
        }

        if(allJobSupply.length == 0) allJobSupply.push(1);
        if(allInputSupply.length == 0) allInputSupply.push(1);

        const jobSupply = average(allJobSupply);
        const inputSupply = average(allInputSupply);
        const productivityImpacts = game.impacts.hasOwnProperty(b+"_productivity") ? game.impacts[b+"_productivity"] : 1;
        const productivity = (jobSupply * inputSupply * game.productivity) * productivityImpacts;

        //Discount Input/Needs Supply (based in productivity)
        for(const c in building.maintenance){
            const inputConsumption = building.maintenance[c] * game[b] * productivity;

            resourceChange("consumption", c, building.name, inputConsumption);
        }

        //Winter Needs
        if(game.season == "winter" && building.hasOwnProperty("winter_needs")){
            for(const c in building.winter_needs){
                const wNeedConsumption = building.winter_needs[c] * game[b];

                resourceChange("consumption", c, building.name, wNeedConsumption);
            }
        }

        //Production
        for(const p in building.production){
            const prod = building.production[p] * game[b] * productivity;
            
            resourceChange("production", p, building.name, prod);
        }
    }
}

export function buildBuilding(id){
    if(!game.gameStarted) return;
    if(game.gamePaused){
        pauseError();
        return;
    }

    const building = buildingsData[id];

    for(const n in building.build){
        if(game[n] < building.build[n])
            return;
    }

    game[id]++;

    for(const n in building.build){
        game[n] -= building.build[n];
    }

    buildingHTML(id);
    updateMapItemsScale();
    updateDataInfo();
    jobs();
}

let constructInPause = false;
function pauseError(){
    if(!constructInPause){
        Swal.fire({
            text: "O jogo está pausado, você não pode construir.",
            confirmButtonText: "Ok",
        })

        constructInPause = true;
        setTimeout(()=>{constructInPause = false}, 60000);
    }
}

export function destroyBuilding(id, qty){
    destroyBuildingHTML(id, qty);

    game[id] -= qty;
    
    const building = buildingsData[id];
    for(const n in building.build){
        game[n] += building.build[n]*0.5;
    }

    updateDataInfo();
    jobs();
}
