document.addEventListener('DOMContentLoaded', () => {
    // Get the game board element
    const gameBoard = document.getElementById('gameBoard');

    // Initialize variables
    const grid = []; // Array to hold the grid cells
    const rows = 20; // Number of rows in the grid
    const cols = 20; // Number of columns in the grid
    let score = 0; // Player's score
    let lives = 3; // Player's lives
    let totalPacDots = 0; // Total number of pac-dots in the game
    let gameOver = false; // Flag to track game over state
    let gameLoop; // Variable to hold game loop interval

    // Level layout (0 = empty, 1 = wall, 2 = pac-dot)
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,1,2,1,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,
        1,2,2,2,1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,1,1,2,1,1,1,1,1,2,1,1,1,1,1,2,1,1,1,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,1,1,2,1,1,1,1,1,1,1,1,2,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1,
        1,2,1,2,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1,
        1,2,1,2,2,2,2,2,2,2,2,2,2,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,2,2,2,1,
        1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,2,1,1,1,1,
        1,2,2,2,2,2,2,2,1,2,2,2,1,2,2,2,2,2,2,1,
        1,2,1,1,1,1,1,2,1,2,1,2,1,2,1,1,1,1,2,1,
        1,2,2,2,2,2,2,2,2,2,1,2,2,2,2,2,2,2,2,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ];

    // Create the gameboard
    layout.forEach((cell, index) => {
        const div = document.createElement('div'); // Create a new div element for each cell
        div.classList.add('cell'); // Add the 'cell' class to the div

        // Add wall class if the cell is a wall, pac-dot class if the cell contains a pac-dot
        if (cell === 1) {
            div.classList.add('wall'); // Add the 'wall' class to the div if the cell represents a wall
        } else if (cell === 2) {
            div.classList.add('pac-dot'); // Add the 'pac-dot' class to the div if the cell contains a pac-dot
            totalPacDots++; // Increment totalPacDots for each pac-dot found
        }

        gameBoard.appendChild(div); // Add the div to the game board element in the HTML
        grid.push(div); // Add the div element to the grid array for tracking
    });

    // Place Pac-Man
    let pacmanCurrentIndex = 21; // Set Pac-Man's initial position to index 21
    grid[pacmanCurrentIndex].classList.add('pacman'); // Add 'pacman' class to the cell at Pac-Man's initial position

    // Remove pac-dot at initial position if present
    if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
        grid[pacmanCurrentIndex].classList.remove('pac-dot'); // Remove 'pac-dot' class if present at Pac-Man's initial position
        score += 10; // Increase the score by 10 points
        document.getElementById('scoreValue').textContent = score; // Update the score display
    }

    // Function to move Pac-Man
    const movePacman = () => {
        if (!gameOver && direction !== null) {
            let newIndex = pacmanCurrentIndex; // Initialize newIndex with the current Pac-Man index

            // Move Pac-Man based on the current direction
            switch (direction) {
                case 'ArrowUp': // Move Pac-Man up if the direction is 'ArrowUp'
                    // Check if moving up is possible and there is no wall in the way
                    if (pacmanCurrentIndex - cols >= 0 && !grid[pacmanCurrentIndex - cols].classList.contains('wall')) {
                        newIndex -= cols; // Move Pac-Man up by one row
                    }
                    break;
                case 'ArrowDown': // Move Pac-Man down if the direction is 'ArrowDown'
                    // Check if moving down is possible and there is no wall in the way
                    if (pacmanCurrentIndex + cols < cols * rows && !grid[pacmanCurrentIndex + cols].classList.contains('wall')) {
                        newIndex += cols; // Move Pac-Man down by one row
                    }
                    break;
                case 'ArrowLeft': // Move Pac-Man left if the direction is 'ArrowLeft'
                    // Check if moving left is possible and there is no wall in the way
                    if (pacmanCurrentIndex % cols !== 0 && !grid[pacmanCurrentIndex - 1].classList.contains('wall')) {
                        newIndex -= 1; // Move Pac-Man left by one column
                    }
                    break;
                case 'ArrowRight': // Move Pac-Man right if the direction is 'ArrowRight'
                    // Check if moving right is possible and there is no wall in the way
                    if (pacmanCurrentIndex % cols < cols - 1 && !grid[pacmanCurrentIndex + 1].classList.contains('wall')) {
                        newIndex += 1; // Move Pac-Man right by one column
                    }
                    break;
            }

            // Check if Pac-Man's position has changed
            if (newIndex !== pacmanCurrentIndex) {
                // Remove Pac-Man from the current position
                grid[pacmanCurrentIndex].classList.remove('pacman');
                pacmanCurrentIndex = newIndex; // Update Pac-Man's current index
                grid[pacmanCurrentIndex].classList.add('pacman'); // Add Pac-Man to the new position

                // Check if Pac-Man has eaten a pac-dot
                if (grid[pacmanCurrentIndex].classList.contains('pac-dot')) {
                    grid[pacmanCurrentIndex].classList.remove('pac-dot'); // Remove the pac-dot
                    score += 10; // Increase the score
                    document.getElementById('scoreValue').textContent = score; // Update the score display
                    console.log('Score:', score);

                    // Call checkForWin function after updating score
                    checkForWin();
                }
    
                // Check for collision with ghosts after Pac-Man moves
                checkCollision(); // Check collision after each move
            }
    
            // Check if Pac-Man's position after movement ends the game
            if (lives === 0) {
                gameOver = true;
                endGame(); // Game over
            }
        }
    };

    // Function to check for win condition
    const checkForWin = () => {
        if (score === 2030) { // Total score won
            gameOver = true; // Set game over flag
            clearInterval(gameLoop); // Stop the game loop
    
            // Stop ghost movements
            ghost1.stop();
            ghost2.stop();
    
            // Display win message after a short delay
            setTimeout(() => {
                alert("Congratulations! You won!");
            }, 500);

        }
    };
    
        // Check for keydown events to set Pac-Man's direction
        let direction = null; // Initialize direction as null
        document.addEventListener('keydown', (event) => {
            const key = event.key;
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
                direction = key; // Set Pac-Man's direction based on the pressed key
            }
        });

        // Initialize lives using a for loop
        for (let lives = 3; lives > 0; lives--) {
            }
    
        // Function to end the game
        const endGame = () => {
            clearInterval(gameLoop); // Stop the game loop
        
            // Stop ghost movements
            ghost1.stop();
            ghost2.stop();
        
            // Display game over message after a short delay
            setTimeout(() => {
                alert("Game over! You lost!");
            }, 500);
        };

        // Game loop
        gameLoop = setInterval(movePacman, 200); // Move Pac-Man every 200ms
    
        // Ghost
        class Ghost {
            constructor(startIndex, color) {
                // Initialize Ghost
                this.currentIndex = startIndex; // Set the current index of the ghost
                this.color = color; // Set the color of the ghost
                this.timerId = null; // Timer ID for ghost movement interval
            }
    
            moveGhost() {
                const directions = [-1, +1, -cols, +cols]; // Possible directions for the ghost
    
                // Function to calculate distance between two indices on the grid
                const distanceToPacman = (ghostIndex, pacmanIndex) => {
                    const ghostRow = Math.floor(ghostIndex / cols);
                    const ghostCol = ghostIndex % cols;
                    const pacmanRow = Math.floor(pacmanIndex / cols);
                    const pacmanCol = pacmanIndex % cols;
                    return Math.abs(ghostRow - pacmanRow) + Math.abs(ghostCol - pacmanCol);
                };
    
                // Function to choose the best direction towards Pac-Man
                const chooseDirection = () => {
                    // Get Pac-Man's current index
                    const pacmanIndex = grid.findIndex(cell => cell.classList.contains('pacman'));
    
                    // Calculate distances for each direction and filter out invalid moves
                    const validDirections = directions.filter(direction => {
                        const nextMove = this.currentIndex + direction;
                        return !grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost');
                    });
    
                    // Sort directions by distance to Pac-Man
                    validDirections.sort((dir1, dir2) => {
                        const nextMove1 = this.currentIndex + dir1;
                        const nextMove2 = this.currentIndex + dir2;
                        return distanceToPacman(nextMove1, pacmanIndex) - distanceToPacman(nextMove2, pacmanIndex);
                    });
    
                    // Return the closest direction if available
                    return validDirections.length > 0 ? validDirections[0] : null;
                };
    
                let direction = chooseDirection(); // Initial direction
    
                // Move the ghost at regular intervals
                this.timerId = setInterval(() => {
                    // Logic for ghost movement
                    if (!gameOver && direction !== null) {
                        const nextMove = this.currentIndex + direction; // Calculate the next potential position for the ghost
    
                        // Check if next move isn't a wall or another ghost
                        if (!grid[nextMove].classList.contains('wall') && !grid[nextMove].classList.contains('ghost')) {
                            // Remove ghost from the current position
                            grid[this.currentIndex].classList.remove('ghost', this.color);
                            // Move the ghost to the next position
                            this.currentIndex = nextMove;
                            // Place the ghost on the new position
                            grid[this.currentIndex].classList.add('ghost', this.color);
                        } else {
                            // Choose a new direction if the ghost can't move
                            direction = chooseDirection();
                        }
    
                        // Check if the ghost touched Pac-Man
                        if (this.currentIndex === pacmanCurrentIndex) {
                            lives--; // Decrease lives
                            document.getElementById('livesValue').textContent = lives; // Update lives display
    
                            if (lives === 0) {
                                gameOver = true;
                                endGame(); // Game over
                            } else {
                                // Reset Pac-Man's position
                                grid[pacmanCurrentIndex].classList.remove('pacman');
                                pacmanCurrentIndex = 21;
                                grid[pacmanCurrentIndex].classList.add('pacman');
                            }
                        }
                    }
                }, 200); // Move Ghost every 200ms
            }
    
            stop() {
                clearInterval(this.timerId); // Stop the ghost movement
            }
        }
    
        // Create ghosts
        const ghost1 = new Ghost(209, 'red'); // Place the first ghost
        const ghost2 = new Ghost(229, 'blue'); // Place the second ghost
    
        // Start ghost movement
        ghost1.moveGhost();
        ghost2.moveGhost();
    
        // Define the lifeIcons array globally
        const lifeIcons = [
            document.getElementById('life1'),
            document.getElementById('life2'),
        ];
        
        const updateLivesDisplay = () => {
            console.log('Updating lives display. Current lives:', lives);
            for (let i = 0; i < lifeIcons.length; i++) {
                if (i < lives) {
                    lifeIcons[i].style.display = 'inline-block'; // Display the life icon
                } else {
                    lifeIcons[i].style.display = 'none'; // Hide the life icon
                }
                console.log(`Life icon ${i + 1}: display is ${lifeIcons[i].style.display}`);
            }
        };        

        const checkCollision = () => {
            if (grid[pacmanCurrentIndex].classList.contains('ghost')) {
                lives--; // Decrease lives
                updateLivesDisplay(); // Update visual display of lives
        
                // Reset Pac-Man's position
                grid[pacmanCurrentIndex].classList.remove('pacman');
                pacmanCurrentIndex = 21;
                grid[pacmanCurrentIndex].classList.add('pacman');
        
                // Update lives count in the HTML element
                document.getElementById('livesValue').textContent = lives;
        
                // Check if there are no lives left
                if (lives === 0) {
                    gameOver = true;
                    endGame(); // Game over
                }
            }
        };
        
        // Check for collision on Pac-Man movement
        setInterval(checkCollision, 100); // Check collision every 100ms
    });

