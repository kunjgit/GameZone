const [block, hole, character] = ["block", "hole", "character"].map(id => document.getElementById(id));
let jumping = 0, counter = 0;

hole.addEventListener('animationiteration', () => {
  hole.style.top = `${-((Math.random()*300)+150)}px`;
  counter++;
});

setInterval(() => {
  if (!jumping) character.style.top = `${parseInt(getComputedStyle(character).top) + 3}px`;
  const blockLeft = parseInt(getComputedStyle(block).left);
  const holeTop = parseInt(getComputedStyle(hole).top);
  const cTop = -(500 - parseInt(getComputedStyle(character).top));
  if ((parseInt(getComputedStyle(character).top) > 480) || (blockLeft < 20 && blockLeft > -50 && (cTop < holeTop || cTop > holeTop + 130))) {
    alert(`****THE END****
SCORE : ${counter - 1}`);
    character.style.top = "100px";
    counter = 0;
  }
}, 10);

function jump() {
  jumping = 1;
  let jumpCount = 0;
  const jumpInterval = setInterval(() => {
    const characterTop = parseInt(getComputedStyle(character).top);
    if (characterTop > 6 && jumpCount < 15) character.style.top = `${characterTop - 5}px`;
    if (jumpCount > 20) {
      clearInterval(jumpInterval);
      jumping = 0;
      jumpCount = 0;
    }
    jumpCount++;
  }, 10);
}