document.addEventListener("DOMContentLoaded", function() {
    const gameArea = document.getElementById('game-area');
    const scoreDisplay = document.getElementById('score-value');
    const restartButton = document.getElementById('restart-btn');
    let score = 0;
    let gameEnded = false;
    
    // Function to generate a random bubble
    function createBubble() {
        if (gameEnded) return; // Exit if game has ended
        
        const colors = ['red', 'green', 'blue', 'orange', 'yellow', 'purple'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const bubble = document.createElement('div');
        bubble.className = `bubble ${randomColor}`;
        
        // Set initial position at the bottom randomly
        bubble.style.left = `${Math.random() * (gameArea.clientWidth - 30)}px`;
        bubble.style.top = `${gameArea.clientHeight}px`;
        
        gameArea.appendChild(bubble);
        
        // Move the bubble upwards
        let bubbleInterval = setInterval(function() {
            bubble.style.top = `${parseInt(bubble.style.top) - 1}px`;
            
            // Check if bubble reaches the top of the game area
            if (parseInt(bubble.style.top) <= 0) {
                clearInterval(bubbleInterval);
                gameArea.removeChild(bubble);
                endGame();
            }
        }, 10);
        
        // Handle click on bubble
        bubble.addEventListener('click', function() {
            if (!bubble.clicked) {
                bubble.clicked = true;
                clearInterval(bubbleInterval);
                gameArea.removeChild(bubble);
                score += 10;
                scoreDisplay.textContent = score;
            }
        });
    }
    
    // Function to end the game
    function endGame() {
        gameEnded = true;
        alert(`Game Over! Your score is ${score}`);
        removeAllBubbles(); // Remove all remaining bubbles when game ends
    }
    
    // Function to remove all bubbles from game area
    function removeAllBubbles() {
        const bubbles = document.querySelectorAll('.bubble');
        bubbles.forEach(bubble => gameArea.removeChild(bubble));
    }
    
    // Generate bubbles every 2 seconds
    setInterval(createBubble, 2000);
    
    // Event listener for restart button
    restartButton.addEventListener('click', function() {
        removeAllBubbles(); // Remove all bubbles before restarting
        score = 0;
        scoreDisplay.textContent = score;
        gameEnded = false;
    });
});
