function calculateFLAMES() {
    let name1 = document.getElementById('name1').value.toLowerCase().replace(/\s+/g, '');
    let name2 = document.getElementById('name2').value.toLowerCase().replace(/\s+/g, '');

    if (!name1 || !name2) {
        document.getElementById('result').innerText = 'Please enter both names.';
        return;
    }

    let combined = name1 + name2;
    let countMap = new Map();

    for (let char of combined) {
        countMap.set(char, (countMap.get(char) || 0) + 1);
    }

    let uniqueCount = Array.from(countMap.values()).reduce((sum, count) => sum + (count % 2), 0);

    const flames = ["Friends", "Lovers", "Affection", "Marriage", "Enemies", "Siblings"];
    let resultIndex = (uniqueCount % flames.length) - 1;

    if (resultIndex < 0) {
        resultIndex = flames.length - 1;
    }

    document.getElementById('result').innerText = `Result: ${flames[resultIndex]}`;
}
