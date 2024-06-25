let players = [];
let teams = [];
let teamSelected = "";
let fixtures = [];
let round = 1;
const formationsArray = [
    {"G":1,"D":4,"M":4,"F":2},
    {"G":1,"D":5,"M":3,"F":2},
    {"G":1,"D":3,"M":5,"F":2},
    {"G":1,"D":4,"M":5,"F":1},
    {"G":1,"D":5,"M":4,"F":1}
];
const playerFile = "js/playerList.json";
const teamFile = "js/teams.json";

async function getData(pFile, tFile) {

    await fetch(pFile)
    .then(response => {
        return response.json();
    })
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            players.push(new Player(
                data[i].id,
                data[i].name,
                data[i].age,
                data[i].rating,
                data[i].club,               
                data[i].value,
                data[i].wage,
                data[i].team_pos,
                data[i].pos,
                data[i].join,
                data[i].until
            ));
        }
    }).catch((error) => {
        console.log(error);
        console.log("players.json fetch went wrong")
    });  

    await fetch(tFile)
    .then(response => {
        return response.json();
    })
    .then(json => {
        for (let i = 0; i < json.length; i++) {
            const randNum = Math.floor(Math.random() * 5);
            teams.push(new Team(i, json[i].league, json[i].team, 2022));
            let temp = players.filter(element => element.club === json[i].team);
            ["G","D","M","F"].forEach(item => {
                let posArray = temp.filter(element => element.position === item).sort((a,b) => {
                    let fa = a.rating,
                        fb = b.rating;
                    if (fa < fb) return 1;
                    if (fa > fb) return -1;
                    return 0
                });
                const posNumber = formationsArray[randNum][item];
                for (let i = 0; i < posNumber; i++) {
                    const indexVal = players.indexOf(posArray[i]);
                    if (!players[indexVal].team_position) {
                    }
                    players[indexVal].team_position = item;
                }
            });
        };
    }).catch((error) => {
        console.log(error);
        console.log("teams.json fetch went wrong")
    });       
};

getData(playerFile, teamFile);



const startBtn = document.getElementById('start-game');
startBtn.addEventListener("click", () => toggle('landing-page','team-selection'));

const toggle = (current,newpage) => {
    let current_ = document.getElementById(current);
    current_.classList.add('hide'); //add a class to the element
    let newpage_ = document.getElementById(newpage);
    newpage_.classList.remove('hide');
}

document.getElementById("league-dropdown").onchange = (e) => {
    const league = e.srcElement.value;
    let teamDrop = document.getElementById("team-dropdown");
    //remove all children of team dropdown
    while (teamDrop.firstChild) {
        teamDrop.removeChild(teamDrop.lastChild);
    }
    //get team list from array of objs and sort
    const teamList = teams.filter(data => data.league == league).sort((a,b) => {
        let fa = a.team,
            fb = b.team;
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        return 0
    });
    teamList.forEach(item => {
        const team = document.createElement('option');
        team.setAttribute("value",item.team);
        team.innerText = item.team;
        teamDrop.append(team);
    })
};

const teamBtn = document.getElementById("teamBtn");
teamBtn.addEventListener("click", () => selectTeam());

selectTeam = () => {
    let teamDrop = document.getElementById("team-dropdown");
    if (teamDrop != "") {
        teamSelected = teamDrop.value;
        toggle('team-selection','main-menu');
        let teamName = document.getElementById('team-name');
        teamName.innerText = teamSelected;
        seasonGenerator();
    };
}

const teamPageBtn = document.getElementById("teamPageBtn");
teamPageBtn.addEventListener("click", () => {
    toggle('main-menu','team-page');
    teamView(teamSelected);
});
const leaguePageBtn = document.getElementById("leaguePageBtn");
leaguePageBtn.addEventListener("click", () => {
    toggle('main-menu','league-page');
    showLeague();
});


const schedulePageBtn = document.getElementById("schedulePageBtn");
schedulePageBtn.addEventListener("click", () => {
    toggle('main-menu','schedule-page');
    showSchedule(teamSelected);
});

const nextGameBtn = document.getElementById("nextGameBtn");
nextGameBtn.addEventListener("click", () => {
    toggle('main-menu','game-screen');
    home = [];
    away = [];
    let allFixtures = fixtures.filter(item => item.round === round);
    allFixtures.forEach(item => loadGameData(item.home, item.away));
});

const teamMainBtn = document.getElementById("teamMainBtn");
teamMainBtn.addEventListener("click", () => toggle('team-page','main-menu'));

const leagueMainBtn = document.getElementById("leagueMainBtn");
leagueMainBtn.addEventListener("click", () => toggle('league-page','main-menu'));


const scheduleMainBtn = document.getElementById("scheduleMainBtn");
scheduleMainBtn.addEventListener("click", () => toggle('schedule-page','main-menu'));

const historyMainBtn = document.getElementById("historyMainBtn");
historyMainBtn.addEventListener("click", () => toggle('history-page','main-menu'));

const nextResultsBtn = document.getElementById("nextResultsBtn");
nextResultsBtn.addEventListener("click", () => {
    round++;
    toggle('game-screen','results-screen');
    document.getElementById("startGame").classList.remove("hide");
    document.getElementById("nextResultsBtn").classList.add("hide");
    showResults();
});

const resultsMainBtn = document.getElementById("resultsMainBtn");
resultsMainBtn.addEventListener("click", () => toggle('results-screen','main-menu'));