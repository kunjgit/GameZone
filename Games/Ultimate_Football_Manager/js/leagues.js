// class to hold entire leagues e.g. epl
// will contain team objects

const showLeague = () => {
    if(document.getElementById('leagueBody')) {
        document.getElementById('leagueBody').remove();
    }
    const table = document.getElementById('leagueTable')
    let leagueBody = document.createElement('tbody');
    leagueBody.setAttribute("id", "leagueBody");
    table.append(leagueBody);

    const yourLeague = teams.filter(item => item.team === teamSelected)[0].league;

    const leagueList = teams.filter(item => item.league === yourLeague).sort((a,b) => {
        if (a.points - b.points !== 0) {
            return b.points - a.points;
        } else if ((a.scored - a.conceded) - (b.scored - b.conceded) !== 0) {
            return (b.scored - b.conceded) - (a.scored - a.conceded);
        } else if (a.scored - b.scored !== 0) {
            return b.scored - a.scored;
        } else if (b.team > a.team) {
            return -1;
        };
    })

    let counter = 1;
    leagueList.forEach(item => {
        let tr = document.createElement('tr');
        tr.setAttribute('id', `league_${counter}`);
        leagueBody.append(tr);

        const position = document.createElement('td');
        position.innerText = counter;
        counter++;

        const team = document.createElement('td');
        team.innerText = item.team;
        const played = document.createElement('td');
        played.innerText = item.games;
        const wins = document.createElement('td');
        wins.innerText = item.wins;
        const draws = document.createElement('td');
        draws.innerText = item.draws;
        const losses = document.createElement('td');
        losses.innerText = item.losses;
        const gf = document.createElement('td');
        gf.innerText = item.scored;
        const ga = document.createElement('td');
        ga.innerText = item.conceded;
        const gd = document.createElement('td');
        gd.innerText = item.scored - item.conceded;
        const pts = document.createElement('td');
        pts.innerText = item.points;

        tr.append(position, team, played, wins, draws, losses, gf, ga, gd, pts);
    })
}