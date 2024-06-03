const canvas = document.getElementById('screenPetCanvas');
const ctx = canvas.getContext('2d');

const bodyColor = 'SkyBlue1';
let happyLevel = 10;
let eyesCrossed = false;
let tongueOut = false;

function drawPet() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(200, 185, 165, 165, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ears
    drawPolygon([[75, 80], [75, 10], [165, 70]], bodyColor);
    drawPolygon([[255, 45], [325, 10], [320, 70]], bodyColor);

    // Feet
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(105, 340, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(290, 340, 40, 20, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    drawEye(eyesCrossed ? 135 : 145, 140, 'white');
    drawEye(eyesCrossed ? 255 : 245, 140, 'white');

    // Tongue
    if (tongueOut) {
        drawTongue();
    }

    // Mouth
    drawMouth();

    // Cheeks
    if (happyLevel > 0) {
        drawCheek(95, 205);
        drawCheek(305, 205);
    }
}

function drawPolygon(points, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(points[0][0], points[0][1]);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i][0], points[i][1]);
    }
    ctx.closePath();
    ctx.fill();
}

function drawEye(x, y, color) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.ellipse(x, y, 15, 30, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.ellipse(x, y + 10, 5, 5, 0, 0, Math.PI * 2);
    ctx.fill();
}

function drawMouth() {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;

    if (tongueOut) {
        ctx.beginPath();
        ctx.moveTo(170, 250);
        ctx.quadraticCurveTo(200, 282, 230, 250);
        ctx.stroke();
    } else if (happyLevel > 0) {
        ctx.beginPath();
        ctx.moveTo(170, 250);
        ctx.quadraticCurveTo(200, 282, 230, 250);
        ctx.stroke();
    } else {
        ctx.beginPath();
        ctx.moveTo(170, 250);
        ctx.quadraticCurveTo(200, 232, 230, 250);
        ctx.stroke();
    }
}

function drawTongue() {
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.rect(185, 250, 30, 40);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(200, 290, 15, 10, 0, 0, Math.PI);
    ctx.fill();
}

function drawCheek(x, y) {
    ctx.fillStyle = 'pink';
    ctx.beginPath();
    ctx.ellipse(x, y, 25, 25, 0, 0, Math.PI * 2);
    ctx.fill();
}

function toggleEyes() {
    const color = ctx.fillStyle === 'white' ? bodyColor : 'white';
    ctx.fillStyle = color;
}

function blink() {
    toggleEyes();
    setTimeout(toggleEyes, 250);
    setTimeout(blink, 3000);
}

function togglePupils() {
    eyesCrossed = !eyesCrossed;
    drawPet();
}

function toggleTongue() {
    tongueOut = !tongueOut;
    drawPet();
}

function cheeky(event) {
    toggleTongue();
    togglePupils();
    hideHappy();
    setTimeout(toggleTongue, 1000);
    setTimeout(togglePupils, 1000);
}

function showHappy(event) {
    if (event.offsetX >= 20 && event.offsetX <= 350 && event.offsetY >= 20 && event.offsetY <= 350) {
        happyLevel = 10;
    }
    drawPet();
}

function hideHappy() {
    happyLevel = 0;
    drawPet();
}

function sad() {
    if (happyLevel === 0) {
        drawPet();
    } else {
        happyLevel -= 1;
        drawPet();
    }
    setTimeout(sad, 5000);
}

canvas.addEventListener('mousemove', showHappy);
canvas.addEventListener('mouseleave', hideHappy);
canvas.addEventListener('dblclick', cheeky);

setTimeout(blink, 1000);
setTimeout(sad, 5000);

drawPet();
