document.addEventListener("DOMContentLoaded", function() {
    const earth = document.getElementById("earth");
    const healthBar = document.getElementById("health-bar");
    const healthText = document.getElementById("health-text");
    const scoreDisplay = document.getElementById("score");
    const interfaceDiv = document.getElementById("interface");
    const gameContainer = document.getElementById("game-container");
    const startBtn = document.getElementById("start-btn");
    const quitBtn = document.getElementById("quit-btn");

    const endScreen = document.getElementById("end-screen");
    const finalScore = document.getElementById("final-score");

    var explosionSound = new Audio();
    explosionSound.src = "assets/explode.mp3";
    explosionSound.preload = "auto";

    let health = 100;
    let score = 0;
    let asteroids = [];
    let gameInterval;

    startBtn.addEventListener("click", startGame);
    quitBtn.addEventListener("click", quitGame);

    function startGame() {
        interfaceDiv.style.display = "none";
        gameContainer.style.display = "block";
        health = 100;
        updateHealthBar();
        gameInterval = setInterval(createAsteroid, 1000); // Decreased interval for more frequent asteroid appearance
    }

    function endGame() {
        clearInterval(gameInterval);
        gameContainer.style.display = "none";
        finalScore.textContent = score;
        endScreen.classList.remove("hidden");
        endScreen.style.display = "flex";
        
        const playBtn = document.getElementById("play-again-btn");
        // const homeBtn = document.getElementById("home-btn");
        playBtn.addEventListener("click", function(){
            endScreen.classList.add("hidden");
            endScreen.style.display = "none";
            startGame();
        });
        // homeBtn.addEventListener("click", function(){
        //     endScreen.classList.add("hidden");
        //     endScreen.style.display = "none";
        //     gameContainer.style.display = "none";
        //     interfaceDiv.style.display = "flex";
        // });

        resetGame();
    }

    function resetGame() {
        health = 100;
        score = 0;
        asteroids.forEach(asteroid => asteroid.remove());
        asteroids = [];
        updateHealthBar();
        scoreDisplay.textContent = "Score: " + score;
    }

    function quitGame() {
        clearInterval(gameInterval);
        gameContainer.style.display = "none";
        endGame();
    }


    function createAsteroid() {
        const asteroid = document.createElement("div");
        asteroid.className = "asteroid";
        const size = Math.floor(Math.random() * 3) + 1; // Random size between 1 and 3
        asteroid.style.backgroundImage = `url('assets/asteroid-${size}.png')`; // Use different asteroid images
        asteroid.setAttribute("size", size); // Store size as an attribute
        
        // Set initial position and angle
        const initialX = Math.random() * window.innerWidth;
        const initialY = -100;
        // const initialY = Math.random() * window.innerHeight;
        const angle = Math.atan2(earth.offsetTop - initialY, earth.offsetLeft - initialX);
        const speed = Math.random() * 2 + 2; // Increased speed
        
        // Set initial position
        asteroid.style.left = initialX + "px";
        asteroid.style.top = initialY + "px";
        
        document.body.appendChild(asteroid);
        asteroids.push(asteroid);

        moveAsteroid(asteroid, angle, speed);
    }

    function moveAsteroid(asteroid, angle, speed) {
        const moveInterval = setInterval(function() {
            const asteroidTop = parseInt(getComputedStyle(asteroid).top);
            const asteroidLeft = parseInt(getComputedStyle(asteroid).left);
            const deltaY = Math.sin(angle) * speed;
            const deltaX = Math.cos(angle) * speed;

            asteroid.style.top = asteroidTop + deltaY + "px";
            asteroid.style.left = asteroidLeft + deltaX + "px";

            if (isColliding(asteroid, earth)) {
                asteroidCollision(asteroid);
                clearInterval(moveInterval);
            }

            if (asteroidTop >= window.innerHeight || asteroidLeft >= window.innerWidth) {
                clearInterval(moveInterval);
                document.body.removeChild(asteroid);
                const index = asteroids.indexOf(asteroid);
                asteroids.splice(index, 1);
            }
        }, 1000 / 60);
    }

    document.addEventListener("click", function(event) {
        const clickedAsteroid = event.target.closest(".asteroid");
        if (clickedAsteroid) {
            explosionSound.play();
            asteroidClicked(clickedAsteroid);
        }
    });

    document.addEventListener('dblclick', function(event) {
        event.preventDefault();
    }, false);


    function asteroidClicked(asteroid) {
        score += 10; // Increase score based on size
        scoreDisplay.textContent = "Score: " + score;
        document.body.removeChild(asteroid);
        const index = asteroids.indexOf(asteroid);
        asteroids.splice(index, 1);
    }

    function asteroidCollision(asteroid) {
        health -= 5;
        updateHealthBar();
        if (asteroid.parentNode === document.body) { // Check if asteroid is a child of document body
            document.body.removeChild(asteroid);
            const index = asteroids.indexOf(asteroid);
            asteroids.splice(index, 1);
        } 
    }

    function isColliding(element1, element2) {
        const rect1 = element1.getBoundingClientRect();
        const rect2 = element2.getBoundingClientRect();
        return !(
            rect1.top > rect2.bottom ||
            rect1.right < rect2.left ||
            rect1.bottom < rect2.top ||
            rect1.left > rect2.right
        );
    }

    function updateHealthBar() {
        scoreDisplay.textContent = "Score: " + score;
        healthBar.style.width = health + "%";
        healthText.textContent = "Health: " + health + "%"; // Update health text
        earth.style.opacity = health / 70;
        if (health <= 0) {
            endGame();
        }
        earth.style.backgroundImage = "url('assets/earth.png')";
    }
});