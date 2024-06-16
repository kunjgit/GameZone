let points = 0;
const results = ['six', 'four', 'single', 'double', 'triple'];

class MagicParticle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = this.random(10, 30);
        this.baseColor = this.color(
            this.random([
                "#00fffc", "#00fff0",
                "#068ec7", "#ecaa14",
                "#f91717", "#f611ae",
                "#11f639", "#088592",
                "#46aff3"
            ])
        );
        this.opacity = 255;
        this.speedX = this.random(-1, 1);
        this.speedY = this.random(-1, 1);
    }

    random(min, max) {
        return Math.random() * (max - min) + min;
    }

    color(hex) {
        // Assuming you have a color library or function to handle hex colors.
        return hex;
    }

    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.opacity -= 10;
    }
}

function guess(userGuess) {
    const actualResult = results[Math.floor(Math.random() * results.length)];
    const resultDisplay = document.getElementById('game-result');
    const pointsDisplay = document.getElementById('points');
    
    if (userGuess === actualResult) {
        points += 1;
        resultDisplay.innerHTML = `<span class="sparkle">Luck is great! It was a ${actualResult}.</span>`;
        pointsDisplay.textContent = points;
    } else {
        resultDisplay.innerHTML = `<span class="sparkle">Sorry! Your luck is bad. It was a ${actualResult}.</span>`;
        disableButtons();
    }
}

function disableButtons() {
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}

function resetGame() {
    points = 0;
    document.getElementById('points').textContent = points;
    document.getElementById('game-result').textContent = '';
    
    const buttons = document.querySelectorAll('.buttons button');
    buttons.forEach(button => {
        button.disabled = false;
    });
}