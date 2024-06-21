import { rand } from "./funcs.js";
import { game } from "../data/gameData.js"
import { pauseGame, playGame } from "./gameTime.js";
import { modifiersUI } from "./ui/ui.js";

import { eventsData } from "../data/eventsData.js";
import { modifiersData } from "../data/modifiersData.js";

export function events(){
    newEvents();
    runEvents();
    
    updateModifiers();
}

function newEvents(){
    if(game.totalDays <= 90) return;

    for(const e in eventsData){
        const evt = eventsData[e];

        if(rand(0,evt.rareness) == 0){
            if(evt.hasOwnProperty("modifier") && game.modifiers[e]) continue;
            if(evt.hasOwnProperty("condition") && !evt.condition()) continue;

            evt.onTrigger();

            pauseGame(); 

            Swal.fire({
                title: evt.title,
                html: evt.message,
                width: "70%",
                height: "100%",
                imageUrl: "./img/events/"+e+".webp",
                imageHeight: 250,
                allowOutsideClick: false,
            }).then(() => {
                playGame();
            });

            if(evt.hasOwnProperty("modifier")){
                game.modifiers[evt.modifier] = modifiersData[evt.modifier].duration;
            }

            break; //Only one event per day
        }
    }
}

function runEvents(){
    for(const e in game.activeEvents){
        const evt = game.activeEvents[e];

        evt.update();
    }
}

function updateModifiers(){
    for(const m in game.modifiers){
        game.modifiers[m]--;
        modifiersData[m].effect();

        if(game.modifiers[m] == 0){
            delete game.modifiers[m];
        }
    }

    modifiersUI();
}