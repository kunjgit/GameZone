document.getElementById('play-now-button').addEventListener('click', function() {
    const gameStartSound = new Audio('assets/start-game.mp3');
    gameStartSound.play();
    window.location.href = 'game.html';
});
