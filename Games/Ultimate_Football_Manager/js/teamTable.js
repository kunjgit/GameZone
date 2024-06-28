
const teamView = (team) => {
    
    let teamPlayers = sortPlayerArray(players, team);

    if (document.getElementById('teamBody')) {
        let teamBody = document.getElementById('teamBody');
        teamBody.remove();
        teamBody.removeEventListener('click',(event) => tableRowSelect(event, team));
    };
    const table = document.getElementById('teamTable')
    let teamBody = document.createElement('tbody');
    teamBody.setAttribute("id", "teamBody");
    table.append(teamBody);

    teamPlayers.forEach(item => {
        let tr = document.createElement('tr');
        tr.setAttribute('id', item.name.replace(/\s/g, ""));
        teamBody.append(tr);
        const playerName = document.createElement('td');
        playerName.innerText = item.name;
        tr.append(playerName);
        const playerPos = document.createElement('td');
        playerPos.innerText = item.team_position;
        tr.append(playerPos);
        const bestPos = document.createElement('td');
        bestPos.innerText = item.position;
        tr.append(bestPos);
        const playerRating = document.createElement('td');
        playerRating.innerText = item.rating;
        tr.append(playerRating);
        if (item.value.toString().length >= 7) {
            value = `£${item.value/1000000}m`;
        } else if (item.value.toString().length >= 4) {
            value = `£${item.value/1000}k`;
        } else {
            value = item.value
        };
        const playerValue = document.createElement('td');
        playerValue.innerText = value;
        tr.append(playerValue);
        if (item.wage.toString().length >= 7) {
            wage = `£${item.wage/1000000}m`;
        } else if (item.wage.toString().length >= 4) {
            wage = `£${item.wage/1000}k`;
        } else {
            wage = item.wage
        };
        const playerWage = document.createElement('td');
        playerWage.innerText = wage;
        tr.append(playerWage);
    });

    teamBody.addEventListener('click', (event) => tableRowSelect(event, team));
    
    let form442 = document.getElementById("442");
    let form352 = document.getElementById("352");
    let form532 = document.getElementById("532");
    let form451 = document.getElementById("451");
    let form541 = document.getElementById("541");

    const formArray = [form442, form352, form532, form451, form541];
    for (let i = 0; i < formArray.length; i++) {
        formArray[i].addEventListener('click', () => {
            formationChange(formArray[i].id);
        });
    };
}

const tableRowSelect = (event, team) => {
    let oldSelected = document.querySelector('.selected');
    let selected = document.getElementById(event.target.parentElement.id);
    let selectedTag = event.target.parentElement.localName;
    let selectedID = event.target.parentElement.id;

    if (oldSelected && selected !== oldSelected && selectedTag === "tr" && selectedID !== "tableHeader") {
        let teamPlayers = sortPlayerArray(players, team);
        const nonTeamPlayers = players.filter(data => data.club !== team).sort((a,b) => {
            let fa = a.team_position,
                fb = b.team_position;
            if (fa < fb) return -1;
            if (fa > fb) return 1;
            return 0
        });
        let newPos = teamPlayers.find(item => item.name.replace(/\s/g, "") === selected.id).team_position;
        let oldPos = teamPlayers.find(item => item.name.replace(/\s/g, "") === oldSelected.id).team_position;
        let newIndex = teamPlayers.map(item => item.name.replace(/\s/g, "")).indexOf(selected.id);
        let oldIndex = teamPlayers.map(item => item.name.replace(/\s/g, "")).indexOf(oldSelected.id);
        teamPlayers[newIndex].team_position = oldPos;
        teamPlayers[oldIndex].team_position = newPos;
        let tempObj = teamPlayers[newIndex];
        teamPlayers[newIndex] = teamPlayers[oldIndex];
        teamPlayers[oldIndex] = tempObj;
        players = teamPlayers.concat(nonTeamPlayers);
        oldSelected.classList.remove('selected');
        teamView(team);
    } else if (selectedTag === "tr" && selectedID !== "tableHeader") {
        selected.classList.add('selected');
    }
}

const sortPlayerArray = (array, team) => {
    return array.filter(data => data.club === team).sort((a,b) => {
        const teamOrder = ['G','D','M','F','S','R'];
        let fa = teamOrder.indexOf(a.team_position),
            fb = teamOrder.indexOf(b.team_position),
            fc = teamOrder.indexOf(a.position),
            fd = teamOrder.indexOf(b.position);
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        if (fc < fd) return -1;
        if (fd > fd) return 1;
        return 0
    })
}

const formationChange = (formation) => {
    const formationsArray = {
        "442": {"G":1,"D":4,"M":4,"F":2},
        "532": {"G":1,"D":5,"M":3,"F":2},
        "352": {"G":1,"D":3,"M":5,"F":2},
        "451": {"G":1,"D":4,"M":5,"F":1},
        "541": {"G":1,"D":5,"M":4,"F":1}
    };
    let temp = players.filter(element => element.club === teamSelected);
    temp.sort((a,b) => {
        const teamOrder = ['G','D','M','F','S','R'];
        let fa = teamOrder.indexOf(a.team_position),
            fb = teamOrder.indexOf(b.team_position),
            fc = teamOrder.indexOf(a.position),
            fd = teamOrder.indexOf(b.position);
        if (fa < fb) return -1;
        if (fa > fb) return 1;
        if (fc < fd) return -1;
        if (fd > fd) return 1;
        return 0
    });

    let counter = 0;
    ["G","D","M","F"].forEach(item => {
        for (let i = counter; i < counter + formationsArray[formation][item]; i++) {
            temp[i].team_position = item;
        }
        counter += formationsArray[formation][item];
    });

    for (let i = 0; i < temp.length; i++) {
        const indexVal = players.indexOf(temp[i]);
        if (!players[indexVal].team_position) {
        }
        players[indexVal].team_position = temp[i].team_position;
        let playerHtml = document.getElementById(temp[i].name.replace(/\s/g, ""));
        playerHtml.childNodes[1].innerText = temp[i].team_position;
    }
}  

        
