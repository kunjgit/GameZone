document.addEventListener('DOMContentLoaded', function() {
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateButton = document.getElementById('translateButton');
    const switchButton = document.getElementById('switchButton');
    const speakButton = document.getElementById('speakButton');
    
    let isAlienLanguage = false;

    const englishToAlien = {
        'a': '∆Ω', 'b': 'ßΛ', 'c': '¢Ψ', 'd': 'ↁΞ', 'e': '∑ζ', 'f': '∫Σ', 
        'g': 'ǤΠ', 'h': 'Ħχ', 'i': '¡λ', 'j': 'ʖκ', 'k': 'ЖΦ', 'l': '∫Φ', 
        'm': '₥α', 'n': '∩β', 'o': '⊕γ', 'p': '¶δ', 'q': '℺ε', 'r': '®μ', 
        's': '§θ', 't': '†ω', 'u': 'µτ', 'v': '√η', 'w': 'ψι', 'x': 'жς', 
        'y': '¥φ', 'z': '≀ν', ' ': ' '
    };

    const alienToEnglish = {
        '∆Ω': 'a', 'ßΛ': 'b', '¢Ψ': 'c', 'ↁΞ': 'd', '∑ζ': 'e', '∫Σ': 'f', 
        'ǤΠ': 'g', 'Ħχ': 'h', '¡λ': 'i', 'ʖκ': 'j', 'ЖΦ': 'k', '∫Φ': 'l', 
        '₥α': 'm', '∩β': 'n', '⊕γ': 'o', '¶δ': 'p', '℺ε': 'q', '®μ': 'r', 
        '§θ': 's', '†ω': 't', 'µτ': 'u', '√η': 'v', 'ψι': 'w', 'жς': 'x', 
        '¥φ': 'y', '≀ν': 'z', ' ': ' '
    };

    function translateToAlien(text) {
        return text.split('').map(char => {
            if (englishToAlien[char.toLowerCase()]) {
                return englishToAlien[char.toLowerCase()];
            } else {
                return char;
            }
        }).join('').split('').reverse().join('') + '∈Ω';
    }

    function translateToEnglish(text) {
        text = text.replace('∈Ω', '');
        text = text.split('').reverse().join('');
        return text.match(/.{1,2}/g).map(pair => {
            if (alienToEnglish[pair]) {
                return alienToEnglish[pair];
            } else {
                return pair;
            }
        }).join('');
    }

    function alienifySpeech(text) {
        // Adding more alien-like effects
        // Randomly adding symbols and repetition to simulate alien speech
        let alienText = text.split('').map(char => {
            if (char === ' ') return '  '; // Extra space for effect
            // Repeating characters and adding symbols
            return char + '✪' + char + '✾';
        }).join(' ') + ' ΨΩ';

        // Add additional random characters and distortions
        return alienText.split('').map((char, index) => {
            // Insert random symbols at odd positions
            if (index % 4 === 0 && Math.random() > 0.5) {
                return char + '✵';
            }
            return char;
        }).join('');
    }

    function speakText(text) {
        const utterance = new SpeechSynthesisUtterance(alienifySpeech(text));
        utterance.pitch = 3.0; // Very high pitch for an unusual effect
        utterance.rate = 9.0;  // Slow rate to exaggerate alien effect
        utterance.volume = 0.7; // Slightly higher volume
        speechSynthesis.speak(utterance);
    }

    translateButton.addEventListener('click', function() {
        const text = inputText.value;
        if (isAlienLanguage) {
            outputText.textContent = translateToEnglish(text);
        } else {
            outputText.textContent = translateToAlien(text);
        }
    });

    switchButton.addEventListener('click', function() {
        isAlienLanguage = !isAlienLanguage;
        switchButton.textContent = isAlienLanguage ? 'Switch to English' : 'Switch to Alien Language';
    });

    speakButton.addEventListener('click', function() {
        const text = outputText.textContent;
        speakText(text);
    });
});
