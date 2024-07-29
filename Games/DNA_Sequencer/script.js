document.addEventListener('DOMContentLoaded', function() {
    let dnaSequence = generateRandomDnaSequence(8);
    let currentSequence = [...dnaSequence];
    let timeLimit = 120;
    let timer;

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    function generateRandomDnaSequence() {
        let sequence = ["A", "A", "T", "T", "C", "C", "G", "G"];
        for (let i = sequence.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [sequence[i], sequence[j]] = [sequence[j], sequence[i]]; 
        }
        return sequence;
    }
    
    function renderSequence() {
        const sequenceContainer = document.getElementById('dna-sequence');
        sequenceContainer.innerHTML = ''; 
        currentSequence.forEach((base, index) => {
            const baseElement = document.createElement('div');
            baseElement.textContent = base;
            baseElement.className = 'base';
            baseElement.draggable = true;
            baseElement.setAttribute('data-index', index);
            baseElement.addEventListener('dragstart', dragStart);
            sequenceContainer.appendChild(baseElement);
        });
    }

    function dragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.getAttribute('data-index'));
    }

    function dragOver(e) {
        e.preventDefault();
    }

    function drop(e) {
        e.preventDefault();
        const originIndex = e.dataTransfer.getData('text');
        const targetIndex = e.target.getAttribute('data-index');
        if (targetIndex) {
            [currentSequence[originIndex], currentSequence[targetIndex]] = [currentSequence[targetIndex], currentSequence[originIndex]];
            renderSequence();
        }
    }

    function startLevel() {
        shuffleArray(currentSequence);
        renderSequence();
        startTimer();
    }


    function startTimer() {
        const timerElement = document.getElementById('timer');
        timerElement.textContent = `Time: ${timeLimit}s`;
        timer = setInterval(() => {
            timeLimit--;
            timerElement.textContent = `Time: ${timeLimit}s`;
            if (timeLimit <= 0) {
                clearInterval(timer);
                const resultElement = document.getElementById('result');
                resultElement.textContent = dnaSequence.join('');
                resultElement.style.color = 'red'; 
                alert('Time is up! Try again.');
                resetGame();
            }
        }, 1000);
    }

    function resetGame() {
        clearInterval(timer);
        timeLimit = 120;
        dnaSequence = generateRandomDnaSequence(); 
        currentSequence = [...dnaSequence];
        startLevel();
    }

    document.getElementById('dna-sequence').addEventListener('dragover', dragOver);
    document.getElementById('dna-sequence').addEventListener('drop', drop);
    document.getElementById('shuffle').addEventListener('click', () => {
        shuffleArray(currentSequence);
        renderSequence();
    });
    document.getElementById('check').addEventListener('click', () => {
        console.log(currentSequence);
        console.log(dnaSequence);
        const resultElement = document.getElementById('result');
        if (JSON.stringify(currentSequence) === JSON.stringify(dnaSequence)) {
            resultElement.textContent = 'Correct sequence! Well done.';
            resultElement.style.color = 'green';
            clearInterval(timer);
            updateScore(true);
            currentSequence = generateSequence(dnaSequence.length + 2); 
            startLevel();
        } else {
            resultElement.textContent = 'Incorrect sequence. Try again.';
            resultElement.style.color = 'red';
            updateScore(false);
        }
    });
    const playAgainButton = document.getElementById('play-again');
    playAgainButton.addEventListener('click', () => {
        document.getElementById('result').textContent = ''; 
        resetGame(); 
    });

    startLevel();
});