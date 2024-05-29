document.getElementById('flamesForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const name1 = document.getElementById('name1').value.toLowerCase().replace(/ /g, '');
    const name2 = document.getElementById('name2').value.toLowerCase().replace(/ /g, '');

    let name1Array = name1.split('');
    let name2Array = name2.split('');

    name1Array.forEach(char => {
        const index = name2Array.indexOf(char);
        if (index !== -1) {
            name2Array.splice(index, 1);
            name1Array.splice(name1Array.indexOf(char), 1);
        }
    });

    const count = name1Array.length + name2Array.length;
    const flames = ['Friends', 'Lovers', 'Affectionate', 'Marriage', 'Enemies', 'Siblings'];
    let flamesIndex = count % flames.length;

    const resultText = flamesIndex === 0 ? flames[flames.length - 1] : flames[flamesIndex - 1];

    document.getElementById('result').innerText = `Result: ${resultText}`;
});
