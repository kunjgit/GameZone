const showResults = () => {
    if (document.getElementById('resultsBody')) {
        let temp = document.getElementById('resultsBody')
        temp.remove();
    }

    const table = document.getElementById('resultsTable');
    let resultsBody = document.createElement('tbody');
    resultsBody.setAttribute("id", "resultsBody");
    table.append(resultsBody);

    results.forEach(item => {
        let tr = document.createElement('tr');
        resultsBody.append(tr);
        const hometeam = document.createElement('td');
        hometeam.innerText = item.home;
        tr.append(hometeam);
        const homescore = document.createElement('td');
        homescore.innerText = item.homeScore;
        homescore.classList.add("scoreNum");
        tr.append(homescore);
        const awayscore = document.createElement('td');
        awayscore.innerText = item.awayScore;
        awayscore.classList.add("scoreNum");
        tr.append(awayscore);
        const awayteam = document.createElement('td');
        awayteam.innerText = item.away;
        awayteam.classList.add("awayTd");
        tr.append(awayteam);
    })
}