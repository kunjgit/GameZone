document.addEventListener('DOMContentLoaded', () => {
    const balloon = document.getElementById('balloon');
    const cannon = document.getElementById('cannon');
    const message = document.getElementById('message');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const fireBtn = document.getElementById('fireBtn');
    const resetBtn = document.getElementById('resetBtn');

    let cannonPosition = 125;
    const moveAmount = 25;

    leftBtn.addEventListener('click', () => {
        moveCannon(-moveAmount);
    });

    rightBtn.addEventListener('click', () => {
        moveCannon(moveAmount);
    });

    fireBtn.addEventListener('click', fireCannon);
    resetBtn.addEventListener('click', resetGame);

    function moveCannon(direction) {
        cannonPosition += direction;
        if (cannonPosition < 0) cannonPosition = 0;
        if (cannonPosition > 250) cannonPosition = 250;
        cannon.style.left = cannonPosition + 'px';
    }

    function fireCannon() {
        const cannonRect = cannon.getBoundingClientRect();
        const balloonRect = balloon.getBoundingClientRect();

        if (cannonRect.left < balloonRect.right && cannonRect.right > balloonRect.left) {
            balloon.style.backgroundColor = 'green';
            message.textContent = 'Hit! You popped the balloon!';
        } else {
            message.textContent = 'Missed! Try again.';
        }
    }

    function resetGame() {
        // Reset the balloon color and message
        balloon.style.backgroundColor = 'red';
        message.textContent = '';

        // Randomly reposition the balloon within the game area
        const randomLeft = Math.floor(Math.random() * (300 - 40)); // 300 is the game-area width, 40 is the balloon width
        balloon.style.left = randomLeft + 'px';
    }
});
