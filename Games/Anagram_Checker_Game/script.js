document.getElementById('check-anagram').addEventListener('click', function() {
  var word1 = document.getElementById('word1').value.toLowerCase();
  var word2 = document.getElementById('word2').value.toLowerCase();
  var result = document.getElementById('result');

  if (word1.length === word2.length) {
    var sortedWord1 = word1.split('').sort().join('');
    var sortedWord2 = word2.split('').sort().join('');

    if (sortedWord1 === sortedWord2) {
      result.textContent = 'The words are anagrams.';
      result.classList.add('alert-success');
    } else {
      result.textContent = 'The words are not anagrams.';
      result.classList.add('alert-danger');
    }
  } else {
    result.textContent = 'The words are not the same length.';
    result.classList.add('alert-danger');
  }

  result.style.display = 'block';
});