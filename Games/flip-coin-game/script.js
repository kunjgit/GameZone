document.getElementById('flipButton').addEventListener('click', function() {
    // Generate a random number (0 or 1)
    var result = Math.random() < 0.5 ? 'Heads' : 'Tails';

    // Display the result
    document.getElementById('result').textContent = result;
});
