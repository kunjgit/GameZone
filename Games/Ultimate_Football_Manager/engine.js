const playerVolume = [
    {players: 1, lower: 0,
         upper: 0.15},
    {players: 2, lower: 0.150000000000000001,
         upper: 0.3},
    {players: 3, lower: 0.30000000000000001,
        upper: 0.45},
    {players: 4, lower: 0.450000000000000001,
        upper: 0.645},
    {players: 5, lower: 0.6450000000000000001,
        upper: 0.804},
    {players: 6, lower: 0.8040000000000000001,
        upper: 0.904},
    {players: 7, lower: 0.9040000000000000001,
        upper: 0.954},
    {players: 8, lower: 0.9540000000000000001,
        upper: 0.974},
    {players: 9, lower: 0.9740000000000000001,
        upper: 0.99},
    {players: 10, lower: 0.9900000000000000001,
        upper: 1}
]

randomNum = (skew) => {
    let u = Math.random();
    let v = Math.random();
    num = Math.pow(u, 1-skew) + (v/3);
    return num;
}

// get volume of players for each attack play (att or def)
playerVol = () => {
    let rand = Math.random();
    let players = 0;
    playerVolume.forEach(number => {
        if (number.lower <= rand && number.upper >= rand) {
            players = number.players;
        }
    })
    return players;
}

// pick players involved in the attack play
pickPlayers = (num,arr,team) => {
    let tempHome = [...arr];
    let maxArray = num - 1;
    let chosen = [];
    for (let i = 1; i < num; i++) {
        let tempRand = Math.floor(Math.random() * maxArray) + 1;
        if (tempRand === maxArray) {
            tempRand -= 1;
        }
        chosen.push(tempHome[tempRand]);
        tempHome.splice(tempRand,1);
        maxArray--;
    }
    if(team === "def") {
        chosen.push(tempHome[0]);
    }
    return chosen;
}

// get total rating score for array of players
getTotal = (arr) => {
    let total = 0;
    arr.forEach(number => {
        total += number.rating;
    })
    return total;
}

// decide if goal - if att score is 60% more than def score
score = (att, def, team) => {
    let lastScored = "";
    if (att > def * 1.60) {
        lastScored = team;
        return "GOAL";
        
    } else {
        return "NO GOAL";
    };
}

// const fs = require("fs");
//chances based on midfield score
chancesGenerator = (team) => {
    const teamMid = team.filter(item => item.team_position === "M");
    const teamScore = getTotal(teamMid) / teamMid.length / 1000;
    // let tempArr = [];
    // for (let i = 0; i<=1000; i++) {
    //     tempArr.push(Math.floor(randomNum(teamScore) * 10));
    // }
    // fs.writeFile("_"+num+".csv", JSON.stringify(tempArr), (err) =>
    // err ? console.error(err) : console.log('Success!'));
    return Math.floor(randomNum(teamScore) * 10)
}

// chances times and object
chances = (chances) => {
    let chancesArr = [];
    for(let i=1; i <= chances; i++) {
        let temp = {time: Math.floor(Math.random() * (90 - 0) + 1),
                    goal: "",
                    scorer: ""};
        chancesArr.push(temp);
    }
    // sort array by time and return
    return chancesArr.sort((a,b) => a.time - b.time);
}

attackPlay = (attTeam, defTeam, chancesObj) => {
    chancesObj.forEach(item => {
        // get how many players attack and defend for each play
        const attPlayers = playerVol();
        const defPlayers = playerVol();
        // pick players involved in the attack play
        const attChosen = pickPlayers(attPlayers, attTeam, "att");
        const defChosen = pickPlayers(defPlayers, defTeam, "def");
        // get total score for attack play
        const attTotal = getTotal(attChosen);
        const defTotal = getTotal(defChosen);
        // decide if goal
        const goalQ = score(attTotal, defTotal, attTeam);
        // set goal value in game chance object
        item.goal = goalQ;
        // assign scorer for game chance from players picked for attacked
        if(goalQ === "GOAL") {
            item.scorer = attChosen[Math.floor(Math.random()*(attChosen.length - 1))];
        }
    })
    return chancesObj;
}

// GAME
// get home and away teams objects
game = (homeName, homeT, awayName, awayT) => {
    // calculate game chances
    const homeChances = chancesGenerator(homeT,1);
    const awayChances = chancesGenerator(awayT,2);
    // calculate times for shots for each team (create object)
    let homeGameChance = chances(homeChances);
    let awayGameChance = chances(awayChances);
    // set attack bonus for home team
    const attBns = 100;
    // set defense bonuse for home team
    const defBns = 50;
    // set attack bonus on last 5 games
    // console.log(homeT[0].club);
    // console.log(awayT[0].club);
    // For each attack play, check for goal
    const homeChanceObj = attackPlay(homeT, awayT, homeGameChance);
    const awayChanceObj = attackPlay(awayT, homeT, awayGameChance);

    return {homeName, homeChanceObj, awayName, awayChanceObj};
}

// Randomly generate yellow and red cards for each team