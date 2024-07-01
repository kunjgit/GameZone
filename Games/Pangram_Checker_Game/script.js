function checkPangram() {
    const inputText = document.getElementById('inputText').value.toLowerCase();
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    let isPangram = true;

    for (let char of alphabet) {
        if (!inputText.includes(char)) {
            isPangram = false;
            break;
        }
    }

    const resultElement = document.getElementById('result');
    if (isPangram) {
        resultElement.textContent = 'Congratulations! The sentence is a Pangram.';
        resultElement.style.color = 'green';
    } else {
        resultElement.textContent = 'The sentence is not a Pangram. Try again.';
        resultElement.style.color = 'red';
    }
}