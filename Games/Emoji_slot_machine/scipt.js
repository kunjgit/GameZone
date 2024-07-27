document.addEventListener('DOMContentLoaded', () => {
    const emojis = ['😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇'];
    let interval1, interval2, interval3;
    const startStopButton = document.getElementById('startStopButton');
    const resultMessage = document.getElementById('resultMessage');
    let spinning = false;

    function startSpinning() {
        interval1 = setInterval(() => {
            const reel1 = document.getElementById('reel1').firstElementChild;
            reel1.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }, 100);

        interval2 = setInterval(() => {
            const reel2 = document.getElementById('reel2').firstElementChild;
            reel2.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }, 100);

        interval3 = setInterval(() => {
            const reel3 = document.getElementById('reel3').firstElementChild;
            reel3.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        }, 100);
    }

    function stopSpinning() {
        clearInterval(interval1);
        clearInterval(interval2);
        clearInterval(interval3);

        const reel1 = document.getElementById('reel1').firstElementChild.textContent;
        const reel2 = document.getElementById('reel2').firstElementChild.textContent;
        const reel3 = document.getElementById('reel3').firstElementChild.textContent;

        if (reel1 === reel2 && reel1 === reel3) {
            resultMessage.textContent = 'You Win!';
            resultMessage.style.color = 'green';
        } else {
            resultMessage.textContent = 'You Lose! Try Again!';
            resultMessage.style.color = 'red';
        }
    }

    startStopButton.addEventListener('click', () => {
        if (spinning) {
            stopSpinning();
            startStopButton.textContent = 'Start';
        } else {
            resultMessage.textContent = ''; // Clear previous result message
            startSpinning();
            startStopButton.textContent = 'Stop';
        }
        spinning = !spinning;
    });
});

