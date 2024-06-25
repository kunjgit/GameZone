// script.js

const canvas = document.getElementById('wheel');
const ctx = canvas.getContext('2d');
const spinBtn = document.getElementById('spin-btn');
const resultDiv = document.getElementById('result');

const segments = [
    'Prize 1',
    'Prize 2',
    'Prize 3',
    'Prize 4',
    'Prize 5',
    'Prize 6',
    'Prize 7',
    'Prize 8'
];

const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#FF33A1',
    '#A133FF', '#33FFF4', '#FF8333', '#8DFF33'
];

let startAngle = 0;
const arc = Math.PI / (segments.length / 2);
let spinAngleStart = 10;
let spinTime = 0;
let spinTimeTotal = 0;

function drawWheel() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < segments.length; i++) {
        const angle = startAngle + i * arc;
        ctx.fillStyle = colors[i];
        ctx.beginPath();
        ctx.arc(250, 250, 200, angle, angle + arc, false);
        ctx.arc(250, 250, 0, angle + arc, angle, true);
        ctx.fill();

        ctx.save();
        ctx.fillStyle = "white";
        ctx.translate(250 + Math.cos(angle + arc / 2) * 150, 250 + Math.sin(angle + arc / 2) * 150);
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.fillText(segments[i], -ctx.measureText(segments[i]).width / 2, 0);
        ctx.restore();
    }
}

function rotateWheel() {
    spinTime += 30;
    if (spinTime >= spinTimeTotal) {
        stopRotateWheel();
        return;
    }
    const spinAngle = spinAngleStart - easeOut(spinTime, 0, spinAngleStart, spinTimeTotal);
    startAngle += (spinAngle * Math.PI / 180);
    drawWheel();
    spinTimeout = setTimeout(rotateWheel, 30);
}

function stopRotateWheel() {
    const degrees = startAngle * 180 / Math.PI + 90;
    const arcd = arc * 180 / Math.PI;
    const index = Math.floor((360 - degrees % 360) / arcd);
    resultDiv.innerHTML = `You won: ${segments[index]}`;
}

function easeOut(t, b, c, d) {
    const ts = (t /= d) * t;
    const tc = ts * t;
    return b + c * (tc + -3 * ts + 3 * t);
}

spinBtn.addEventListener('click', () => {
    spinTime = 0;
    spinTimeTotal = Math.random() * 3000 + 4000;
    rotateWheel();
});

drawWheel();

