const circle = document.querySelector('.circle');
const resultText = document.getElementById('result-text');
const flipButton = document.getElementById('flip-button');

flipButton.addEventListener('click', () => {
  const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
  circle.style.transform = 'rotateY(180deg)';
  flipButton.disabled = true;
  setTimeout(() => {
    circle.style.transform = 'rotateY(0deg)';
    resultText.textContent = result;
    flipButton.disabled = false;
  }, 1000);
});
