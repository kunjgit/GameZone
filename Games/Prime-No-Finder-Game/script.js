function checkPrime() {
    const number = document.getElementById('numberInput').value;
    const resultDiv = document.getElementById('result');
    const resultImage = document.getElementById('resultImage');

    if (number === '') {
        resultDiv.innerHTML = 'Please enter a number!';
        resultImage.classList.add('hidden');
        return;
    }

    const num = parseInt(number);
    if (isPrime(num)) {
        resultDiv.innerHTML = `${num} is a prime number!`;
        resultImage.src = 'star.jpg';
        resultImage.classList.remove('hidden');
    } else {
        resultDiv.innerHTML = `${num} is not a prime number.`;
        resultImage.src = 'skull.jpg';
        resultImage.classList.remove('hidden');
    }
}

function isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;

    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
        if (num % i === 0 || num % (i + 2) === 0) return false;
    }
    return true;
}
