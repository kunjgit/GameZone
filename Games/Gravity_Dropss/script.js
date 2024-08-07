const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let drops = [];
let gravity = { x: 0, y: 0.1 };
let timer = 0;
let timerInterval;
let currentColor = 'blue';

class PaintDrop {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.radius = 5;
        this.color = color;
    }

    update() {
        this.vx += gravity.x;
        this.vy += gravity.y;
        this.x += this.vx;
        this.y += this.vy;
        
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.vx *= -1;
        }

        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.vy *= -1;
        }
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}

function addDrop(x, y) {
    drops.push(new PaintDrop(x, y, currentColor));
}

canvas.addEventListener('click', (e) => {
    addDrop(e.clientX, e.clientY);
});

function resetCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops = [];
    resetTimer();
}

function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

document.getElementById('reset').addEventListener('click', resetCanvas);
document.getElementById('clear').addEventListener('click', clearCanvas);

document.getElementById('increase-gravity').addEventListener('click', () => {
    gravity.y += 0.1;
});

document.getElementById('decrease-gravity').addEventListener('click', () => {
    gravity.y = Math.max(0, gravity.y - 0.1);
});

document.getElementById('color-picker').addEventListener('change', (e) => {
    currentColor = e.target.value;
});

function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drops.forEach(drop => {
        drop.update();
        drop.draw();
    });
    requestAnimationFrame(update);
}

function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        document.getElementById('timer').innerText = `Time: ${timer}s`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timer = 0;
    document.getElementById('timer').innerText = `Time: ${timer}s`;
    startTimer();
}

update();
startTimer();