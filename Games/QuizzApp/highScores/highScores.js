const highScoresList = document.getElementById("highScoresList");
const highScores = JSON.parse(localStorage.getItem("highScores")) || [];
highScoresList.innerHTML = highScores
  .map((score) => {
    //list of the top scores and names
    //writing html inside JS
    return `<li class = "high-score"> ${score.name} - ${score.score}</li>`;
  })
  .join("");
