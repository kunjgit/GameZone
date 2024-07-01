import { game } from "../data/gameData.js"

export function resourceChange(type, id, name, value){
    if(type == "consumption"){
        if(game[id+"_consumption"].hasOwnProperty(name))
            game[id+"_consumption"][name] += value;
        else
            game[id+"_consumption"][name] = value;
    }
    else if(type == "production"){
        if(game[id+"_production"].hasOwnProperty(name))
            game[id+"_production"][name] += value;
        else
            game[id+"_production"][name] = value;
    }
}