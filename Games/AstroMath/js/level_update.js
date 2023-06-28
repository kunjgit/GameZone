import { getLocal, updateLocal, getLevelTime } from "./modules/utils.js";

const levelContainer = document.querySelector(".levels");
const goldenStar = `<img src="./assets/images/goldenstar.svg" alt="golden-star" class="levels__star"/>`;
const silverStar = `<img src="./assets/images/silverstar.svg" alt="silver-star" class="levels__star" />`;
let newLevel = JSON.stringify({
  1: ["current", null, null, 5],
  2: ["locked", null, null, 6],
  3: ["locked", null, null, 7],
  4: ["locked", null, null, 8],
  5: ["locked", null, null, 9],
  6: ["locked", null, null, 10],
  7: ["locked", null, null, 11],
  8: ["locked", null, null, 12],
  9: ["locked", null, null, 12],
  10: ["locked", null, null, 12],
});
let levelValue;
let clickedLevel;
let clickedGameTime;
let clickedGameBestTime;
let clickedLevelPercentage;
let clickedLevelQuestions;

// functions
function returnLevelStatus(status, level) {
  if (status === "played") {
    return `<img src="./assets/images/finished_level.svg" alt="asteroid" />
                <div class="levels__level">${level}</div>`;
  } else if (status === "locked") {
    return `<img src="./assets/images/nextLevel.svg" alt="asteroid" />
            <div class="levels__level"><img src="./assets/images/locked.svg" alt="locked" /></div>`;
  } else {
    return `<img src="./assets/images/nextLevel.svg" alt="asteroid" />
            <div class="levels__level">${level}</div>`;
  }
}

function returnStars(percentage) {
  if (percentage == 100) {
    return goldenStar + goldenStar + goldenStar;
  }
  if (percentage >= 75) {
    return goldenStar + goldenStar + silverStar;
  }
  if (percentage >= 50) {
    return goldenStar + silverStar + silverStar;
  }
  return silverStar + silverStar + silverStar;
}

function fillLevel() {
  let levelHTML = "";
  levelContainer.innerHTML = "";
  for (let level in levelValue) {
    levelHTML += `<div class="levels__level-cnt" data-level="${level}" data-per="${
      levelValue[level][2]
    }" data-status="${levelValue[level][0]}" data-questions="${
      levelValue[level][3]
    }" data-besttime="${levelValue[level][1]}">
                        <div class="levels__img-cnt">
                            ${returnLevelStatus(levelValue[level][0], level)}
                        </div>
                        <div class="levels__star-cnt">
                            ${returnStars(levelValue[level][2])}
                        </div>
                    </div>`;
  }
  return levelHTML;
}

function updateNewGame() {
  updateLocal("levelValue", newLevel);
  updateLocal("currentLevel", "1");
  return newLevel;
}

async function parseLevel() {
  levelValue = JSON.parse(getLocal("levelValue") || updateNewGame());
}

async function updateData() {
  await parseLevel();
  levelContainer.innerHTML = fillLevel();
  clickLevel();
}

function clickLevel() {
  const levels = document.querySelectorAll(".levels__level-cnt");
  levels.forEach((level) => {
    level.addEventListener("click", () => {
      if (level.dataset.status !== "locked") {
        //sound continue
        const themeAud = document.querySelector(".audio__theme");
        updateLocal("soundTime", themeAud.currentTime);

        clickedLevel = level.dataset.level;
        clickedGameTime = getLevelTime(clickedLevel);
        clickedGameBestTime = level.dataset.besttime;
        clickedLevelPercentage = level.dataset.per;
        clickedLevelQuestions = level.dataset.questions;

        updateLocal("gameTime", clickedGameTime);
        updateLocal("gameBestTime", clickedGameBestTime);
        updateLocal("gameLevel", clickedLevel);
        updateLocal("gamePercentage", clickedLevelPercentage);
        updateLocal("gameQuestions", clickedLevelQuestions);

        location.href = "./astro-math.html";
      }
    });
  });
}

updateData();
