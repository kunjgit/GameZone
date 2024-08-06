export function updateScore(score) {
  score += 10;
  return score;
}

export async function getScore() {
	const fetch = require('node-fetch'); //eslint-disable-line
  const url = 'https://us-central1-js-capstone-backend.cloudfunctions.net/api/games/gv40Y9XXDktliqpcA0vA/scores/';
  let result = await fetch(url, {
    mode: 'cors',
  });

  const data = await result.json();
  result = data.result;
  return result;
}
