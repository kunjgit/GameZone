const wordList = ['apple', 'banana', 'orange', 'mango', 'kiwi', 'grape', 'peach'];
let word1, word2;

function generateWordPair() {
    do {
        word1 = wordList[Math.floor(Math.random() * wordList.length)];
        word2 = wordList[Math.floor(Math.random() * wordList.length)];
    } while (word1 === word2);

    document.getElementById('wordPair').innerText = `Merge these two words: ${word1} and ${word2}`;
}

function checkMergedWord() {
    const mergedWordInput = document.getElementById('mergedWordInput').value.toLowerCase();
    const correctMergedWord = mergeWords(word1, word2);

    if (mergedWordInput === correctMergedWord) {
        document.getElementById('result').innerText = `Correct! The merged word is: ${correctMergedWord}`;
    } else {
        document.getElementById('result').innerText = `Incorrect! The correct merged word is: ${correctMergedWord}`;
    }
}

function mergeWords(word1, word2) {
    let mergedWord = '';
    const minLength = Math.min(word1.length, word2.length);
    for (let i = 0; i < minLength; i++) {
        mergedWord += word1[i] + word2[i];
    }
    mergedWord += word1.slice(minLength) + word2.slice(minLength);
    return mergedWord;
}

window.onload = generateWordPair;
