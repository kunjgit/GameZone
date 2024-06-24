document.addEventListener("DOMContentLoaded", function() {
    const startButton = document.getElementById('startButton');
    const startScreen = document.getElementById('startScreen');
    const board = document.getElementById("board");
    const player1Pieces = document.getElementById("player1-pieces");
    const player2Pieces = document.getElementById("player2-pieces");
    const message = document.getElementById("message");
    const winMessage = document.getElementById("winMessage");
    const score1 = document.getElementById("score1");
    const score2 = document.getElementById("score2");
    const restartGameButton = document.getElementById("restartGame");
    const resetScoreButton = document.getElementById("resetScore");
    const playButton = document.getElementById('playButton');
    const pauseButton = document.getElementById('pauseButton');
    const backgroundMusic = document.getElementById('backgroundMusic');
    const stackSound = document.getElementById('stackSound');
    const autoDim = document.getElementById('autoDim');
    const musicVolume = document.getElementById('musicVolume');
    const effectVolume = document.getElementById('effectVolume');
    const settingsIcon = document.getElementById('settingsIcon');
    const closeButton = document.querySelector('.close');

    //Player that always begins is Red
    let currentPlayer = 1;
    //Player 1 is Red
    let colorPlayer = "Red";
    //At the beginning no pieces are selected
    let selectedPiece = null;
    let boardState = new Array(25).fill(null).map(() => []);
    let autoDimEnabled = true;
    //Variable to control the game state
    let gameOver = false;

    //Handle failed attempt to automatically play music on document load
    backgroundMusic.play().catch(error => {
        console.error("Error!, Automatic playing of the backgroundmusic!", error);
    });

    //Start button for the game
    startButton.addEventListener('click', function() {
        startScreen.style.display = 'none';
        backgroundMusic.play();
    });

    //Initialize each cell on the board
    for (let i = 0; i < 25; i++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.dataset.index = i;
        board.appendChild(cell);
        //Set up click event listeners
        cell.addEventListener('click', function() {
            //Prevent interaction if the game is over
            if (gameOver) return;

            if (selectedPiece && parseInt(selectedPiece.dataset.player) === currentPlayer && canPlacePiece(cell)) {
                placePiece(cell, parseInt(cell.dataset.index));
            } else if (!selectedPiece && cell.querySelector('.piece') && parseInt(cell.querySelector('.piece').dataset.player) === currentPlayer) {
                selectPiece(cell.querySelector('.piece'), parseInt(cell.dataset.index));
            } else if (!selectedPiece && boardState[i].length > 0 && parseInt(boardState[i][boardState[i].length - 1].dataset.player) === currentPlayer) {
                selectPiece(boardState[i][boardState[i].length - 1], i);
            }
        });
    }

    //Initialize pieces for both player
    function initializePieces() {
        [player1Pieces, player2Pieces].forEach((container, index) => {
            //Clear previous pieces
            container.innerHTML = '';
            const player = index + 1;
            [4, 3, 2, 1].forEach(size => {
                for (let i = 0; i < 3; i++) {
                    let piece = document.createElement("div");
                    piece.className = `piece piece${size}`;
                    piece.dataset.size = size;
                    piece.dataset.player = player;
                    container.appendChild(piece);
                    //Attach event listener for selecting pieces
                    piece.addEventListener('click', function() {
                        if (parseInt(piece.dataset.player) === currentPlayer && !piece.classList.contains('used')) {
                            selectPiece(piece);
                        }
                    });
                }
            });
        });
    }

    //Select or deselect a piece when clicked
    function selectPiece(piece, index) {
        if (selectedPiece === piece) {
            piece.classList.remove('selected');
            selectedPiece = null;
            message.textContent = `Player ${colorPlayer}: Select a piece to play or move.`;
            return;
        }
        if (selectedPiece) {
            selectedPiece.classList.remove('selected');
        }

        selectedPiece = piece;
        selectedPiece.classList.add('selected');
        message.textContent = `Player ${colorPlayer}: Click on the board to place or move it.`;
    }

    //Determine if a piece can be placed on a specific cell
    function canPlacePiece(cell) {
        const topPiece = cell.querySelector('.piece');
        return (!topPiece || (parseInt(selectedPiece.dataset.size) > parseInt(topPiece.dataset.size) && parseInt(selectedPiece.dataset.player) !== parseInt(topPiece.dataset.player))) && !selectedPiece.classList.contains('used');
    }

    //Remove a piece from the pool when it has been placed on the board
    function removePieceFromPool(selectedPiece) {
        selectedPiece.classList.add('used');
        selectedPiece.style.display = 'none';
    }

    //Place a piece on a cell
    function placePiece(cell, index) {
        if (selectedPiece.parentNode.classList.contains('cell')) {
            removePieceFromCell(selectedPiece.parentNode);
        }

        const newPiece = createNewPiece(index);
        addPieceToCell(newPiece, cell, index);
        removePieceFromPool(selectedPiece);

        selectedPiece = null;
        document.querySelectorAll('.selected').forEach(p => p.classList.remove('selected'));

        //check if placing the piece leads to a win
        if (checkWin(currentPlayer)) {
            gameOver = true;
            message.textContent = `Player ${colorPlayer} wins!`;
            document.getElementById('winMessage').textContent = `Player ${colorPlayer} wins!`;
            showModal();
            updateScore();
            // setTimeout(() => alert(`Player ${colorPlayer} wins!`), 100);
        } else {
            switchPlayer();
        }
    }

    function showModal() {
        const modal = document.getElementById('winModal');
        modal.style.display = 'block';
        const closeBtn = modal.querySelector('.close');
        closeBtn.onclick = function() {
            modal.style.display = 'none';
        };
    }

    //Remove a piece from a cell when another piece is placed on top of it
    function removePieceFromCell(cell) {
        const originalIndex = parseInt(selectedPiece.parentNode.dataset.index);
        const stack = boardState[originalIndex];
        const removedPiece = stack.pop();
        if (stack.length > 0) {
            const underlyingPiece = stack[stack.length - 1];
            const cellUnderlying = document.querySelector(`[data-index="${originalIndex}"]`);
            //Clear the cell
            cellUnderlying.innerHTML = '';
            //Add the bottom piece back to the cell
            cellUnderlying.appendChild(underlyingPiece.cloneNode(true));
        } else {
            //Clear the cell
            cell.innerHTML = '';
            //Update the board state to indicate the cell is empty
            boardState[originalIndex] = [];
        }

        checkWinAfterMove();
    }

    function checkWinAfterMove() {
        if (checkWin(1)) {
            gameOver = true;
            winMessage.textContent = `Player Red wins!`;
            showModal();
            updateScoreStcks();
        } else if (checkWin(2)) {
            gameOver = true;
            winMessage.textContent = `Player Blue wins!`;
            showModal();
            updateScoreStcks();
        }
    }

    function updateScoreStcks() {
        if (currentPlayer === 1) {
            score2.textContent = parseInt(score2.textContent) + 1;
        } else {
            score1.textContent = parseInt(score1.textContent) + 1;
        }
    }

    //Create a new piece based on the selected piece's properties
    function createNewPiece(index) {
        const newPiece = selectedPiece.cloneNode(true);
        newPiece.dataset.index = index;
        return newPiece;
    }

    //Add a piece to a cell + update the board state
    function addPieceToCell(piece, cell, index) {
        const topPiece = cell.querySelector('.piece');
        if (topPiece) {
            const stack = boardState[index];
            stack.push(piece);
            cell.appendChild(piece);

            //Play a sound when a piece is placed on top of another piece
            playStackSound();
        } else {
            //Clear the cell
            cell.innerHTML = '';
            cell.appendChild(piece);
            //Update the board state to include the new piece
            boardState[index] = [piece];
        }
    }

    //Check if the current player has won the game
    function checkWin(player) {
        const lines = [
            [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
            [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22],
            [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
            [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
        ];

        return lines.some(line => {
            let consecutiveCount = 0;
            for (let i = 0; i < line.length; i++) {
                const index = line[i];
                const cell = document.querySelector(`.cell[data-index="${index}"]`);
                const topPiece = cell.querySelector('.piece:last-child');
                if (topPiece && parseInt(topPiece.dataset.player) === player) {
                    consecutiveCount++;
                    if (consecutiveCount === 5) {
                        //Player wins if they have five consecutive pieces
                        return true;
                    }
                } else {
                    consecutiveCount = 0;
                }
            }
            //Return false if no winning line is found
            return false;
        });
    }

    //Update the score for the current player
    function updateScore() {
        if (currentPlayer === 1) {
            score1.textContent = parseInt(score1.textContent) + 1;
        } else {
            score2.textContent = parseInt(score2.textContent) + 1;
        }
    }

    //Switch the current player
    function switchPlayer() {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
        if (currentPlayer == 1) {
            colorPlayer = "Red";
        } else {
            colorPlayer = "Blue";
        }
        //Deselect any selected piece
        selectedPiece = null;
        document.querySelectorAll('.selected').forEach(p => p.classList.remove('selected'));
        message.textContent = `Player ${colorPlayer}: Select a piece to play or move.`;
    }

    //Reset the game to its initial state
    function resetGame() {
        boardState.fill(null).map(() => ({ size: 0, player: null }));
        document.querySelectorAll('.cell').forEach(cell => cell.innerHTML = '');
        document.querySelectorAll('.piece').forEach(piece => {
            //Restore visibility for new game
            piece.style.display = '';
            piece.classList.remove('used');
            piece.classList.remove('selected');
        });

        gameOver = false;
        //Hide the modal on game reset
        document.getElementById('winModal').style.display = 'none';
        //Reinitialize pieces
        initializePieces();
        currentPlayer = 1;
        message.textContent = `Player Red begins.`;
    }

    //Reset the score for both players to zero
    function resetScore() {
        score1.textContent = '0';
        score2.textContent = '0';
    }

    settingsIcon.addEventListener('click', function() {
        document.getElementById('settingsModal').style.display = 'block';
    });

    closeButton.addEventListener('click', function() {
        document.getElementById('settingsModal').style.display = 'none';
    });

    window.onclick = function(event) {
        const modal = document.getElementById('settingsModal');
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    };

    const backgroundMusicController = (function() {
        const musicElement = document.getElementById('backgroundMusic');

        function play() {
            musicElement.play();
        }

        function pause() {
            musicElement.pause();
        }

        function setVolume(volumeLevel) {
            musicElement.volume = volumeLevel;
        }

        return {
            play: play,
            pause: pause,
            setVolume: setVolume
        };
    })();

    function updateMusicVolume(volume) {
        backgroundMusic.volume = volume;
    }

    function updateEffectVolume(volume) {
        stackSound.volume = volume;
    }

    function toggleAutoDim(enabled) {
        autoDimEnabled = enabled;
    }

    function adjustMusicVolumeForStackSound() {
        if (!autoDimEnabled) return;

        const originalVolume = backgroundMusic.volume;
        //Dim the music to 50% of the original volume when the stack sound plays
        backgroundMusic.volume *= 0.5;
        stackSound.play();

        stackSound.onended = function() {
            //Restore the original music volume when the stack sound ends
            backgroundMusic.volume = originalVolume;
        };
    }

    function playStackSound() {
        if (autoDimEnabled) {
            adjustMusicVolumeForStackSound();
            stackSound.play();
        } else {
            //Play the stack sound when a piece is placed on top of another
            stackSound.play();
        }
    }

    //Set the initial message when the document is loaded
    message.textContent = `Player Red begins.`;
    //Attach event listener to the restart game button
    restartGameButton.addEventListener('click', resetGame);
    //Attach event listener to the reset score button
    resetScoreButton.addEventListener('click', resetScore);
    playButton.addEventListener('click', function() {
        //Play the background music when the play button is clicked
        backgroundMusicController.play();
    });
    pauseButton.addEventListener('click', function() {
        //Pause the background music when the pause button is clicked
        backgroundMusicController.pause();
    });
    autoDim.addEventListener('change', function() {
        //Toggle the auto dim feature based on the checkbox state
        toggleAutoDim(this.checked);
    });

    musicVolume.addEventListener('input', function() {
        //Update the music volume as the music volume slider changes
        updateMusicVolume(this.value);
    });

    effectVolume.addEventListener('input', function() {
        //Update the effect volume as the effect volume slider changes
        updateEffectVolume(this.value);
    });

    //Initialize the pieces for both players when the document is loaded
    initializePieces();
});
