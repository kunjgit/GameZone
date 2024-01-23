document.addEventListener('DOMContentLoaded', () => {
  const ladooCatcher = document.querySelector('.ladoo-catcher');
  const ladoo = document.querySelector('.ladoo');
  const nonEdible = document.querySelector('.non-edible');
  const scoreDisplay = document.getElementById('score');

  let score = 0;

  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
      moveCatcher(-15); // Increased cursor speed
    } else if (event.key === 'ArrowRight') {
      moveCatcher(15); // Increased cursor speed
    }
  });

  function moveCatcher(offset) {
    const currentLeft = parseInt(getComputedStyle(ladooCatcher).left);
    const newLeft = Math.max(0, Math.min(window.innerWidth - 50, currentLeft + offset));
    ladooCatcher.style.left = `${newLeft}px`;
  }

  function dropItem(item) {
    const initialPosition = Math.random() * (window.innerWidth - 30);
    item.style.left = `${initialPosition}px`;
    item.style.top = '0';

    const fallInterval = setInterval(() => {
      const currentTop = parseInt(getComputedStyle(item).top);
      const newTop = currentTop + 2; // Slowed down item falling speed

      if (newTop >= window.innerHeight) {
        clearInterval(fallInterval);
        item.style.display = 'none';

        // Respawn the item
        setTimeout(() => {
          item.style.display = 'block';
          dropItem(item);
        }, 2000); // Increased delay before respawning item
      } else {
        item.style.top = `${newTop}px`;

        // Check for collision with ladooCatcher
        checkCollision(item);
      }
    }, 20);
  }

  function checkCollision(item) {
    const ladooCatcherRect = ladooCatcher.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();

    if (
      itemRect.left < ladooCatcherRect.right &&
      itemRect.right > ladooCatcherRect.left &&
      itemRect.bottom > ladooCatcherRect.top &&
      itemRect.top < ladooCatcherRect.bottom
    ) {
      // Collision occurred
      if (item === ladoo) {
        // Handle ladoo caught
        score += 10;
        displayMessage(`+10! Ladoo caught! Total Score: ${score}`, '#32CD32'); // Green color
      } else if (item === nonEdible) {
        // Handle non-edible item caught
        score -= 5;
        displayMessage('-5! Non-edible item caught! Total Score: ${score}', '#FF0000'); // Red color
      }

      // Update score display
      scoreDisplay.textContent = score;

      // Respawn the item
      dropItem(item);
    }
  }

  function displayMessage(message, color) {
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.style.position = 'absolute';
    messageElement.style.top = '50%';
    messageElement.style.left = '50%';
    messageElement.style.transform = 'translate(-50%, -50%)';
    messageElement.style.color = color;
    messageElement.style.fontSize = '24px';
    messageElement.style.fontWeight = 'bold';
    document.body.appendChild(messageElement);

    // Remove the message after a short delay
    setTimeout(() => {
      document.body.removeChild(messageElement);
    }, 1000);
  }

  // Start dropping ladoo and non-edible items
  dropItem(ladoo);
  dropItem(nonEdible);
});
