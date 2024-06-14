let friends = [];

function startGame() {
    friends = [
        document.getElementById('friend1').value,
        document.getElementById('friend2').value,
        document.getElementById('friend3').value,
        document.getElementById('friend4').value
    ];

    if (friends.some(name => name === '')) {
        alert('Please enter all four friend names.');
        return;
    }

    document.querySelector('.input-section').style.display = 'none';
    document.querySelector('.game-section').style.display = 'block';
}

function makeGuess() {
    const guess = document.getElementById('guess').value;
    const randomFriend = friends[Math.floor(Math.random() * friends.length)];

    if (guess === randomFriend) {
        document.getElementById('result').textContent = `You guessed right! The name was ${randomFriend}.`;
    } else {
        document.getElementById('result').textContent = 'Try again!';
    }
}

function exitGame() {
    document.querySelector('.game-section').style.display = 'none';
    document.querySelector('.input-section').style.display = 'block';
    document.getElementById('result').textContent = '';
    document.getElementById('guess').value = '';
    friends = [];
}
