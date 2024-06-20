import { buildingsData } from "../data/buildingsData.js";
import { popsData } from "../data/popsData.js";
import { game } from "../data/gameData.js";

export function jobs(){
    for(const p in popsData){
        if(p == "idle") continue;
        
        game[p+"_jobs"] = 0;
    }

    for(const b in buildingsData){
        if(buildingsData[b].hasOwnProperty("jobs")){
            for(const j in buildingsData[b].jobs){
                const jobs = buildingsData[b].jobs[j] * game[b];
                game[j+"_jobs"] += jobs;
            }
        }
    }
}