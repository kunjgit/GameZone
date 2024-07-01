document.getElementById('convert-btn').addEventListener('click', function() {
    const inputText = document.getElementById('input-text').value.trim().toLowerCase();
    const morseCode = convertToMorse(inputText);
    document.getElementById('output-morse').value = morseCode;
});

function convertToMorse(text) {
    const morseCodeMap = {
        'a': '.-', 'b': '-...', 'c': '-.-.', 'd': '-..', 'e': '.', 'f': '..-.', 'g': '--.', 'h': '....',
        'i': '..', 'j': '.---', 'k': '-.-', 'l': '.-..', 'm': '--', 'n': '-.', 'o': '---', 'p': '.--.',
        'q': '--.-', 'r': '.-.', 's': '...', 't': '-', 'u': '..-', 'v': '...-', 'w': '.--', 'x': '-..-',
        'y': '-.--', 'z': '--..',
        '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....',
        '7': '--...', '8': '---..', '9': '----.'
    };

    return text.split('').map(char => {
        if (char === ' ') {
            return '/';
        } else if (morseCodeMap[char]) {
            return morseCodeMap[char];
        } else {
            return '';
        }
    }).join(' ');
}
