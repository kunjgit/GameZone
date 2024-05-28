function calculateFlames() {
    const name1 = document.getElementById('name1').value.toLowerCase().replace(/\s+/g, '');
    const name2 = document.getElementById('name2').value.toLowerCase().replace(/\s+/g, '');

    if (!name1 || !name2) {
        alert('Please enter both names');
        return;
    }

    let combinedName = name1 + name2;

    // Count occurrences of each character
    const charCount = {};
    for (let char of combinedName) {
        charCount[char] = (charCount[char] || 0) + 1;
    }

    // Calculate the flames number
    let flamesCount = 0;
    for (let char in charCount) {
        flamesCount += charCount[char] % 2;
    }

    const flames = ['Friends', 'Lovers', 'Affectionate', 'Marriage', 'Enemies', 'Siblings'];

    let resultIndex = (flamesCount - 1) % flames.length;

    document.getElementById('result').textContent = flames[resultIndex];
}
