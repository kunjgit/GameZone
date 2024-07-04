// DOM ELEMENTS
const menuSound = document.getElementById('MenuSound');
const buttons = document.querySelectorAll('button');

let playMenuSound = menuSound.play();

buttons.forEach((button) => {
  if (playMenuSound !== undefined) {
    playMenuSound
      .then(() => {
        button.addEventListener('mouseover', () => {
          menuSound.pause();
        });
        button.addEventListener('mouseout', () => {
          menuSound.currentTime = 0;
        });
      })
      .then(() => {
        button.addEventListener('mouseover', () => {
          menuSound.play();
        });
      });
  }
});
