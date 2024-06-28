const seasonGenerator = () => {
    const leagueArr = ["epl","champ","efl1","efl2"];

    leagueArr.forEach(item => fixturesLeague(item))
};

const fixturesLeague = (leagueName) => {
    const league = teams.filter(item => item.league === leagueName).sort(function(a, b){return 0.5 - Math.random()});
    
    let newLeague = [...league];
    let LeagueFixtureArr = [];
    for (let round = 1; round < league.length; round++) {
        for (let i = 0; i < league.length / 2; i++) {
            LeagueFixtureArr.push({
                "round": round,
                "league": newLeague[i].league,
                "home": newLeague[i].team,
                "away": newLeague[(league.length - 1) - i].team
            });
        };
        toggleTeamPos(newLeague);
    };

    let rounds = 0;
    leagueName === 'epl' ? rounds = 19 : rounds = 23;
    const reverse = LeagueFixtureArr.map(item => {
        return {"round":item.round + rounds, "league":item.league, "home":item.away, "away":item.home};
    });

    fixtures.push(...LeagueFixtureArr);
    fixtures.push(...reverse);
}

const toggleTeamPos = (teamArray) => {
    const staticTeam = teamArray.shift();
    const lastTeam = teamArray.pop();
    teamArray.unshift(lastTeam);
    teamArray.unshift(staticTeam);
    return teamArray;
}

const showSchedule = (team) => {
    let roundCounter = round;

    let temp = fixtures.filter(item => 
        item.round === roundCounter && item.league == 'epl');
    console.log(temp);
    
    let fixturePage = document.getElementById("fixture_page");
    let roundHeading = document.createElement('h2');
    roundHeading.setAttribute('id', 'roundHeading');
    roundHeading.innerText = `Week: ${round}`;
    fixturePage.prepend(roundHeading);
    let schedulePage = document.getElementById("schedule_container");
    temp.forEach(element => {
        let fixture_container = document.createElement('div');
        fixture_container.classList.add("fixture_container");
        schedulePage.append(fixture_container);
        let homeTeam = document.createElement('h3');
        homeTeam.classList.add('homeTeam');
        homeTeam.innerText = element.home;
        let vs = document.createElement('h3');
        vs.classList.add('versus');
        vs.innerText = 'vs';
        let awayTeam = document.createElement('h3');
        awayTeam.classList.add('awayTeam');
        awayTeam.innerText = element.away;
        fixture_container.append(homeTeam, vs, awayTeam);
    });
}
