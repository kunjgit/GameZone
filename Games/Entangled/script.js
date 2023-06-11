
//////////////////////////////////////////////////////////////////////////////// intitializations

let story = [
    'Entangled',
    '',
    'There was once a pair of quantumly entangled particles that can only get close to each other',
    'but can never fuse together. No matter what they do, they are cosmically destined to stay away from',
    'each other. All the Quantum Universe\'s a stage, these two particles merely are players, and can only',
    'dance forever in unison.',
    '',
    'This is a story about a particle, forever seeking a way back to its soulmate.',
    '',
    '',
    'Our particle can sense its soulmate\'s relative space-time coordinate. However, its soulmate is always moving',
    'from one point in space to another, making it more difficult for the two to reunite.',
    '! You have a max quantum beam charge of 5.',
    '!beam The Quantum Beam points to your destined pair. Click to activate Quantum Beam : ',
    '',
    'Other particles can effortlessly bond with each other, except for our particle. Our particle\'s attributes are so unique,',
    'rare, and discordant to other particle\'s vibrations that getting minimal contact with another particle could damage',
    'our particle, and crush the colliding particle to its most basic level before it fades away.',
    '! You have a max HP of 3. ',
    '!heart Avoid getting in contact with other particles. Colliding with other particles will reduce your HP : ',
    '',
    'Only one particle in existence can withstand and match our particle\'s unique vibration. Our particle\'s soulmate.',
    'Our soulmate is strong enough to withstand the contact with our particle. It even empowers our particle,',
    'recharging its energy. However, by doing so, it reduces its own energy until it can\'t handle',
    'our particle\'s vibrations any longer, forcing our soulmate to relocate. It knows that staying won\'t do any',
    'good. It must always... move away. To restore itself and regain its original vibrations.',
    'Until they meet again.',
    '! Getting in contact with your soulmate increases your score and replenish three',
    '! quantum beam charges, and sometimes an HP, then warps to another location.',
    '',
    '',
    'Frost Particle:',
    '!frost The Frost Particle is a big, yet rare particle. When activated, the Frost Particle can drop the temperature',
    'to a very low level, freezing everything except our particle and its soulmate. It slowly reduces in size',
    'until it completely disappears, reverting the temperature back to normal.',
    '! The frost particle can only be activated by our particle.',
    '',
    'Phantom Particle:',
    '!phantom The Phantom Particle is friendly, yet dangerous. It emits a very unstable vibration, causing other',
    'particles to vibrate aggressively and preventing them to bond with each other.',
    '! Careful! Getting in contact with these aggressively vibrating particles will instantly reduce your HP to 0.',
    '! However, our particle could consume the phantom particle, stopping the aggressive',
    '! phenomenon, and increasing our HP by 1.',
];

let canvas = document.getElementById('back');
let context = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = new Player();
let goal = new Goal();
let particles = [];
let particlesCount = getParticleCount();
for (let i = 0; i < particlesCount; i++) {
    particles.push(new Particle());
}
let frostParticle = new FrostParticle();
let phantomParticle = new PhantomParticle();

let playButton = new Button(280, canvas.height / 2, 50, 'play');
let instructionButton = new Button(280 - 67, canvas.height / 2 - 67, 30, 'instruction');
let leaderButton = new Button(280 + 67, canvas.height / 2 + 67, 30, 'leader');
let randButton = new Button(200, canvas.height / 2, 15, 'random');

let border = 50;
let connectionOppacity = 0;
let isPlaying = false;
let isGG = false;
let showInstruction = false;
let showLeaderBoard = false;
let godMode = false;
let score = 0;
let name = '';
let panelRadius = 0;
let panelRadiusMax = context.measureText(story[2]).width + 350;

let scoreRecords = JSON.parse(localStorage.getItem('entangled_leaderboard'));
if (!scoreRecords) {
    localStorage.setItem('entangled_leaderboard', JSON.stringify([]));
    scoreRecords = [];
}

let latestPlayer = localStorage.getItem('entangled_latestPlayer');
if (!latestPlayer) {
    latestPlayer = '';
}

//////////////////////////////////////////////////////////////////////////////// initialize background texture

context.fillStyle = 'rgba(0, 22, 52, 1)';
context.fillRect(0, 0, canvas.width, canvas.height);
context.fillStyle = 'rgba(255, 255, 255, 0.02)';
context.shadowColor = 'white';
context.shadowBlur = 15;
for (let i = 0; i < 5000; i++) {
    let radius = randomBetween(1, 15);
    let x = randomBetween(0, canvas.width);
    let y = randomBetween(0, canvas.height);
    context.beginPath();
    context.arc(x, y, radius, Math.PI * 2, false);
    context.fill();
}
context.shadowBlur = 0;
let backgroundImageData = context.getImageData(0, 0, canvas.width, canvas.height);

//////////////////////////////////////////////////////////////////////////////// support functions

function reInitialize() {
    particlesCount = getParticleCount();
    isPlaying = false;
    isGG = false;
    showInstruction = false;
    showLeaderBoard = false;
    panelRadius = 0;
    score = 0;
    particles = [];
    for (let i = 0; i < particlesCount; i++) particles.push(new Particle());
    player.life = 3;
    player.beams = 5;
    player.isInvulnerable = false;
    goal.showHeart = false;
    name = '';
    frostParticle = new FrostParticle();
    phantomParticle = new PhantomParticle();
};

function getParticleCount() {
    return (canvas.width + canvas.height) / 12;
};

function randomBetween(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
};

function getHypothenuse(x1, y1, x2, y2) {
    let x = Math.abs(x1 - x2);
    let y = Math.abs(y1 - y2);
    return Math.sqrt((x * x) + (y * y));
};

function saveGameRecord() {
    if (score > 0) {
        scoreRecords.unshift({name, score});
        scoreRecords.sort((a, b) => a.score > b.score ? -1 : 1);
        scoreRecords = scoreRecords.splice(0, 13);
        localStorage.setItem('entangled_leaderboard', JSON.stringify(scoreRecords));
        scoreRecords = JSON.parse(localStorage.getItem('entangled_leaderboard'));
        localStorage.setItem('entangled_latestPlayer', name);
        latestPlayer = localStorage.getItem('entangled_latestPlayer');
    }
};

function getHighScorer() {
    scoreRecords.sort((a, b) => a.score > b.score ? -1 : 1);
    return scoreRecords.length ? scoreRecords[0] : {name: '', score: 0};
};

//////////////////////////////////////////////////////////////////////////////// draw functions

function clearCanvas() {
    // context.fillStyle = 'rgba(0, 22, 52, 0.8)';
    // context.fillRect(0, 0, canvas.width, canvas.height);
    context.putImageData(backgroundImageData, 0, 0); // draw image data
    drawRandomParticles();
};

function drawRandomParticles() {
    context.fillStyle = 'rgba(255, 255, 255, 0.02)';
    context.shadowColor = 'white';
    context.shadowBlur = 15;
    for (let i = 0; i < 100; i++) {
        let x = randomBetween(0, canvas.width);
        let y = randomBetween(0, canvas.height);
        context.beginPath();
        context.arc(x, y, randomBetween(5, 10), Math.PI * 2, false);
        context.fill();
    }
    context.shadowBlur = 0;
};

function drawBorders() {
    let margin = border - player.radius;
    context.beginPath();
    context.moveTo(margin, margin);
    context.lineTo(canvas.width - margin, margin);
    context.lineTo(canvas.width - margin, canvas.height - margin);
    context.lineTo(margin, canvas.height-margin);
    context.lineTo(margin, margin);
    context.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    context.stroke();
};

function drawParticleConnectionLines() {
    for (let i = 0; i < particles.length - 1; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            let p1 = particles[i];
            let p2 = particles[j];
            let hyp = getHypothenuse(p1.x, p1.y, p2.x, p2.y);
            let dist = p1.radius + p2.radius + player.radius * 2 + 10;
            if (hyp < dist && hyp > 10 && !p1.isRed && !p2.isRed) {
                context.strokeStyle = `rgba(255, 255, 255, ${(dist - hyp) / 20})`;
                context.beginPath();
                context.moveTo(p1.x, p1.y);
                context.lineTo(p2.x, p2.y);
                context.stroke();
            }
        }
    }
};

function drawConnectivityLine() {
    connectionOppacity -= connectionOppacity > 0 ? 0.02 : 0; // draw particle connection
    context.beginPath();
    context.moveTo(player.x, player.y);
    context.lineTo(goal.x, goal.y);
    context.strokeStyle = `rgba(255, 255, 255, ${connectionOppacity})`;
    context.stroke();
};

function drawTitle() {
    let x = playButton.x + playButton.radius + 25;
    let y = playButton.y;
    let size = 23;
    let spacing = 10;

    context.lineWidth = 1;
    context.strokeStyle = 'white';
    context.fillStyle = 'white';
    if (playButton.isHit()) {
        context.shadowColor = 'white';
        context.shadowBlur = 15;
        context.lineWidth = 3;
    }

    context.beginPath(); // E
    context.moveTo(x, y);
    context.lineTo(x + size, y);
    context.lineTo(x + size, y - size / 2);
    context.lineTo(x, y - size / 2);
    context.lineTo(x, y + size / 2);
    context.lineTo(x + size + 1, y + size / 2);
    context.stroke();

    context.beginPath(); // N
    context.moveTo(x + size + spacing, y + size / 2 + 1);
    context.lineTo(x + size + spacing, y - size / 2);
    context.lineTo(x + size + spacing + size, y - size / 2);
    context.lineTo(x + size + spacing + size, y + size / 2 + 1);
    context.stroke();

    context.beginPath(); // T
    context.moveTo(x + size * 2 + spacing * 2, y - size / 2);
    context.lineTo(x + size * 2 + spacing * 2 + size + 1, y - size / 2);
    context.moveTo(x + size * 2 + spacing * 2 + size / 2, y - size / 2);
    context.lineTo(x + size * 2 + spacing * 2 + size / 2, y + size / 2 + 1);
    context.stroke();

    context.beginPath(); // A
    context.moveTo(x + size * 3 + spacing * 3 - 1, y - size / 2);
    context.lineTo(x + size * 3 + spacing * 3 + size, y - size / 2);
    context.lineTo(x + size * 3 + spacing * 3 + size, y + size / 2);
    context.lineTo(x + size * 3 + spacing * 3, y + size / 2);
    context.lineTo(x + size * 3 + spacing * 3, y);
    context.lineTo(x + size * 3 + spacing * 3 + size, y);
    context.stroke();

    context.beginPath(); // N
    context.moveTo(x + size * 4 + spacing * 4, y + size / 2 + 1);
    context.lineTo(x + size * 4 + spacing * 4, y - size / 2);
    context.lineTo(x + size * 4 + spacing * 4 + size, y - size / 2);
    context.lineTo(x + size * 4 + spacing * 4 + size, y + size / 2 + 1);
    context.stroke();

    context.beginPath(); // G
    context.arc(x + size * 5 + spacing * 5 + size / 2, y, size / 2 + 2, Math.PI * 2, false);
    context.stroke();
    context.beginPath();
    context.arc(x + size * 5 + spacing * 5 + size / 2 - 5, y + size - 8, 7, Math.PI * 2 + 1.8, false - 2.2);
    context.stroke();
    context.beginPath();
    context.ellipse(x + size * 5 + spacing * 5 + size / 2, y + 34, size - 10, size - 5, Math.PI / 2.3, Math.PI * 2, false);
    context.stroke();
    context.beginPath();
    context.moveTo(x + size * 5 + spacing * 5 + size + 5, y - size / 2 - 1 - 5);
    context.lineTo(x + size * 5 + spacing * 5 + size - 3, y - size / 2 + 3);
    context.stroke();

    context.beginPath(); // L
    context.moveTo(x + size * 6 + spacing * 6, y - size / 2 - 1);
    context.lineTo(x + size * 6 + spacing * 6, y + size / 2);
    context.lineTo(x + size * 6 + spacing * 6 + size + 1, y + size / 2);
    context.stroke();

    context.beginPath(); // E
    context.moveTo(x + size * 7 + spacing * 7, y);
    context.lineTo(x + size * 7 + spacing * 7 + size, y);
    context.lineTo(x + size * 7 + spacing * 7 + size, y - size / 2);
    context.lineTo(x + size * 7 + spacing * 7, y - size / 2);
    context.lineTo(x + size * 7 + spacing * 7, y + size / 2);
    context.lineTo(x + size * 7 + spacing * 7 + size + 1, y + size / 2);
    context.stroke();

    context.beginPath(); // D
    context.moveTo(x + size * 8 + spacing * 8 - 1, y - size / 2);
    context.lineTo(x + size * 8 + spacing * 8 + size / 2 + 5, y - size / 2);
    context.lineTo(x + size * 8 + spacing * 8 + size, y);
    context.lineTo(x + size * 8 + spacing * 8 + size / 2 + 5, y + size / 2);
    context.lineTo(x + size * 8 + spacing * 8, y + size / 2);
    context.lineTo(x + size * 8 + spacing * 8, y - size / 2);
    context.stroke();

    context.shadowBlur = 0;
    context.lineWidth = 1;
};

function drawPanel() {
    context.shadowColor = 'white';
    context.shadowBlur = 15;
    context.fillStyle = 'rgba(10, 32, 62, 1)';
    context.beginPath();
    context.arc(100, canvas.height / 2, panelRadius, Math.PI * 2, false);
    context.fill();
    context.shadowBlur = 0;
};

function drawInstructions() {
    let x = 50;
    let y = canvas.height / 2;
    for (let i = 0; i < story.length; i++) {
        let text = story[i].split(' ');
        let fontSize = 13;
        let spacing = 5;
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.textAlign = 'left';
        context.textBaseline = 'middle';
        context.font = `${fontSize}px Arial`;
        let tempY = y + (fontSize * (i - story.length / 2) + (spacing * (i - story.length / 2)));
        let measure = context.measureText(text.join(' ')).width;
        if (text.includes('!heart')) {
            context.fillStyle = 'rgba(255, 255, 255, 0.9)';
            context.beginPath();
            context.arc(x + measure - 23, tempY + 2, 5, Math.PI * 2, false);
            context.fill();
            context.beginPath();
            context.arc(x + measure - 31, tempY - 6, 5, Math.PI * 2, false);
            context.fill();
            context.beginPath();
            context.arc(x + measure - 15, tempY - 6, 5, Math.PI * 2, false);
            context.fill();
        } else if (text.includes('!beam')) {
            context.fillStyle = 'rgba(255, 255, 255, 0.9)';
            context.beginPath();
            context.arc(x + measure - 27, tempY, 10, Math.PI * 2, false);
            context.fill();
            context.fillStyle = 'rgba(0, 22, 52, 1)';
            context.beginPath();
            context.arc(x + measure - 27, tempY, 5, Math.PI * 2, false);
            context.fill();
        } else if (text.includes('!frost')) {
            context.strokeStyle = 'skyblue';
            context.fillStyle = 'rgba(0, 0, 255, 0.2)';
            context.shadowColor = 'rgba(70, 70, 255, 0.8)';
            context.shadowBlur = 25;
            context.lineWidth = 5;
            context.beginPath();
            context.arc(x + measure + 10, tempY, 25, Math.PI * 2, false);
            context.stroke();
            context.fill();
            context.shadowBlur = 0;
            context.lineWidth = 1;
        } else if (text.includes('!phantom')) {
            context.strokeStyle = 'pink';
            context.fillStyle = 'rgba(255, 0, 0, 0.2)';
            context.shadowColor = 'rgba(255, 70, 70, 0.8)';
            context.shadowBlur = 25;
            context.lineWidth = 4;
            context.beginPath();
            context.arc(x + measure - 28, tempY, 15, Math.PI * 2, false);
            context.stroke();
            context.fill();
            context.shadowBlur = 0;
            context.lineWidth = 1;
            context.fillStyle = 'rgba(255, 192, 203, 0.6)';
            context.beginPath();
            context.arc(x + measure - 28, tempY + 5, 4, Math.PI * 2, false);
            context.fill();
            context.beginPath();
            context.arc(x + measure - 28 - 7, tempY - 2, 4, Math.PI * 2, false);
            context.fill();
            context.beginPath();
            context.arc(x + measure - 28 + 7, tempY - 2, 4, Math.PI * 2, false);
            context.fill();
        }
        if (i == 0) {
            context.font = `bold 30px Arial`;
        } else if (text[0][0] == '!') {
            context.fillStyle = 'rgba(225, 225, 255, 0.3)';
            if (text.includes('!frost') || text.includes('!phantom')) {
                context.fillStyle = 'rgba(255, 255, 255, 0.9)';
            }
            text.shift();
        }
        context.fillText(text.join(' '), x, tempY);
    }
};

function drawLeaderboard() {
    let x = 350;
    let y = canvas.height / 2;
    if (!scoreRecords.length) {
        let logoX = x - 50; // draw trophy
        let logoY = y;
        context.shadowColor = 'white';
        context.shadowBlur = 15;
        context.lineWidth = 5;
        context.strokeStyle = `rgba(255, 255 ,255 , 1)`;
        context.fillStyle = '#001634';
        context.beginPath();
        context.arc(logoX, logoY, 30, Math.PI * 2, false);
        context.stroke();
        context.shadowBlur = 0;
        context.lineWidth = 1;
        context.strokeRect(logoX - 6 , logoY + 12, 12, 1);
        context.strokeRect(logoX - 1 , logoY + 4 , 2 , 8);
        context.strokeRect(logoX - 5 , logoY + 2 , 10, 1);
        context.strokeRect(logoX - 7 , logoY - 1 , 14, 1);
        context.strokeRect(logoX - 9 , logoY - 8 , 18, 5);
        context.strokeRect(logoX - 7 , logoY - 10, 14, 2);
        context.strokeRect(logoX - 9 , logoY - 14, 18, 3);
        context.beginPath();
        context.arc(logoX - 11, logoY - 6, 4, Math.PI * 2, false);
        context.stroke();
        context.beginPath();
        context.arc(logoX + 11, logoY - 6, 4, Math.PI * 2, false);
        context.stroke();
        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.textBaseline = 'middle';
        context.textAlign = 'left';
        context.font = `20px Arial`;
        context.fillText('No scores yet...', x, y);
        return;
    }
    for (let i = 0; i < scoreRecords.length; i++) {
        let scoreRecord = scoreRecords[i];
        let fontSize = 12;
        let spacing = 8;
        let tempFontSize = fontSize;
        if (i == 0) {
            tempFontSize = 25;
            spacing = 15;
        } else if (i == 1) {
            tempFontSize = 18;
            spacing = 12;
        } else if (i == 2) {
            tempFontSize = 18;
            spacing = 12;
        }
        context.font = `${i < 3 ? 'bold' : ''} ${tempFontSize}px Arial`;
        if (i == 0) { // draw crown
            let logoX = x + context.measureText(scoreRecord.score).width + 30;
            let logoY = y + (fontSize * (i - scoreRecords.length / 2) + (spacing * (i - scoreRecords.length / 2))) - 3;
            context.shadowColor = 'white';
            context.shadowBlur = 15;
            context.lineWidth = 2;
            context.strokeStyle = `rgba(255, 255 ,255 , 1)`;
            context.fillStyle = '#001634';
            context.beginPath();
            context.arc(logoX, logoY, 16, Math.PI * 2, false);
            context.stroke();
            context.shadowBlur = 0;
            context.lineWidth = 1;
            context.beginPath();
            context.moveTo(logoX - 7, logoY + 8);
            context.lineTo(logoX - 9, logoY - 6);
            context.lineTo(logoX - 4, logoY - 0);
            context.lineTo(logoX - 0, logoY - 6);
            context.lineTo(logoX + 4, logoY - 0);
            context.lineTo(logoX + 9, logoY - 6);
            context.lineTo(logoX + 7, logoY + 8);
            context.lineTo(logoX - 7, logoY + 8);
            context.moveTo(logoX - 7, logoY + 5);
            context.lineTo(logoX + 7, logoY + 5);
            context.stroke();
        }

        context.fillStyle = 'rgba(255, 255, 255, 1)';
        context.textBaseline = i < 3 ? 'middle' : 'top';
        context.textAlign = 'right';
        context.fillText(scoreRecord.name + ' : ', x, y + (fontSize * (i - scoreRecords.length / 2) + (spacing * (i - scoreRecords.length / 2))));
        context.textAlign = 'left';
        context.fillText(scoreRecord.score, x, y + (fontSize * (i - scoreRecords.length / 2) + (spacing * (i - scoreRecords.length / 2))));
    }
};

function drawHearts() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Health:', 65, 18);
    for (let i = 1; i <= player.life; i++) {
        let x = (border * i) / 1.5 + 70;
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        context.beginPath();
        context.arc(x, 22, 5, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(x - 7, 14, 5, Math.PI * 2, false);
        context.fill();
        context.stroke();
        context.beginPath();
        context.arc(x + 7, 14, 5, Math.PI * 2, false);
        context.fill();
        context.stroke();
    }
};

function drawBeams() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.font = '12px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('Beams:', 230, 18);
    for (let i = 1; i <= player.beams; i++) {
        let x = (border * i) / 1.5 + 240;
        context.fillStyle = 'rgba(255, 255, 255, 0.9)';
        context.beginPath();
        context.arc(x, 17, 10, Math.PI * 2, false);
        context.fill();
        context.fillStyle = 'rgba(0, 22, 52, 1)';
        context.beginPath();
        context.arc(x, 17, 5, Math.PI * 2, false);
        context.fill();
    }
};

function drawScore() {
    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.textAlign = 'left';
    context.textBaseline = 'middle';
    context.font = '12px Arial';
    context.fillText('Score:', 450, 18);
    context.textAlign = 'left';
    context.font = 'bold 20px Arial';
    context.fillText(score, 500, 18);
};

function drawGG() {
    context.shadowBlur = 15;
    context.fillStyle = 'rgba(10, 32, 62, 1)';
    context.beginPath();
    context.arc(canvas.width / 2, canvas.height / 2, 300, Math.PI * 2 , false);
    context.fill();
    context.shadowBlur = 0;

    context.fillStyle = 'rgba(255, 255, 255, 1)';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.font = 'bold 70px Arial';
    context.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 70);
    context.textAlign = 'center';
    context.font = '30px Arial';
    context.fillText('Your Score : ' + score, canvas.width / 2, canvas.height / 2 + 20);
    context.font = '20px Arial';
    context.fillText(score > getHighScorer().score ? 'New High Score!!!' : 'Highest Score : ' + getHighScorer().score, canvas.width / 2, canvas.height / 2 + 60);
    context.font = '30px Arial';
    context.fillText((!name ? 'Your Name : _' : 'Your Name : ') + name, canvas.width / 2, canvas.height / 2 + 130);
    if (name.length) {
        context.font = '12px Arial';
        context.fillText('Back', goal.x, goal.y + goal.radius + 10);
    }
};

//////////////////////////////////////////////////////////////////////////////// main loop

function render() {
    clearCanvas();

    if (isGG) {
        drawGG();
    } else if (!isPlaying) {
        drawTitle();
        playButton.update().draw();
        instructionButton.update().draw();
        leaderButton.update().draw();
        randButton.update().draw();
        if ((showInstruction || showLeaderBoard) && panelRadius < panelRadiusMax) { // panel circle logic
            panelRadius += (panelRadiusMax) / 10;
            if (panelRadius >= panelRadiusMax) {
                panelRadius = panelRadiusMax;
            }
        } else if (!showInstruction && !showLeaderBoard && panelRadius > 0) {
            panelRadius -= (panelRadiusMax) / 10;
            if (panelRadius <= 0) {
                panelRadius = 0;
            }
        }
        drawPanel();
        if (showInstruction && panelRadius == panelRadiusMax) {
            drawInstructions();
        } else if (showLeaderBoard && panelRadius == panelRadiusMax) {
            drawLeaderboard();
        }
    } else {
        for (let particle of particles) { // draw particles
            particle.update().draw();
        }
        drawBorders();
        frostParticle.update().draw();
        phantomParticle.update().draw();
        drawParticleConnectionLines();
        drawHearts();
        drawBeams();
        drawScore();
        if (player.life <= 0) { // handle when player life hits zero
            isPlaying = false;
            isGG = true;
            particles = [];
            player.beams = 1;
            phantomParticle.clearTimeout();
            frostParticle.clearTimeout();
        }
    }

    player.update().draw();
    goal.update().draw();
    drawConnectivityLine();
    if (getHypothenuse(player.x, player.y, goal.x, goal.y) < player.radius + goal.radius) { // check hit
        if (isGG && name.length) {
            saveGameRecord();
            reInitialize();
        } else {
            goal.reposition();
        }
    }

    window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);

//////////////////////////////////////////////////////////////////////////////// objects

function Player() {
    this.x = 200;
    this.y = canvas.height / 2;
    this.radius = 15;
    this.speed = 10;
    this.destinationX = this.x;
    this.destinationY = this.y;
    this.life = 3;
    this.beams = 5;
    this.auraOpacity = 0;
    this.hitOpacity = 0;
    this.goalOpacity = 0;
    this.permafrostOpacity = 0;
    this.isInvulnerable = false;
    this.update = function() {
        this.hitOpacity -= this.hitOpacity > 0 ? 0.015 : 0;
        this.goalOpacity -= this.goalOpacity > 0 ? 0.015 : 0;
        this.permafrostOpacity -= this.permafrostOpacity > 0 ? 0.01 : 0;
        this.x += (this.destinationX - this.x) / 2;
        this.y += (this.destinationY - this.y) / 2;
        for (let i = 0; i < particles.length; i++) {
            if (!godMode && !this.isInvulnerable && isPlaying && getHypothenuse(this.x, this.y, particles[i].x, particles[i].y) < this.radius + particles[i].radius * 0.85) {
                this.life--;
                if (particles[i].isRed) {
                    player.life = 0;
                }
                particles.splice(i, 1);
                this.hitOpacity = 0.5;
                this.isInvulnerable = true;
                setTimeout(() => {
                    this.isInvulnerable = false;
                }, 800);
            }
        }
        this.auraOpacity -= 0.02;
        return this;
    };
    this.draw = function() {
        context.fillStyle = `rgba(200, 20, 20, ${this.hitOpacity})`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = `rgba(200, 200, 200, ${this.goalOpacity})`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = `rgba(120, 120, 200, ${this.permafrostOpacity})`;
        context.fillRect(0, 0, canvas.width, canvas.height);
        if (!this.isInvulnerable || (this.isInvulnerable && randomBetween(0, 3) == 0)) {
            context.shadowColor = 'white';
            context.shadowBlur = this.auraOpacity > 0 ? 100 * this.auraOpacity : 0;
            context.fillStyle = `rgba(255, 255, 255, ${this.auraOpacity > 0 ? 1 : 0.5})`;
            context.strokeStyle = 'white';
            context.beginPath();
            context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
            context.fill();
            context.stroke();
            context.shadowBlur = 0;
        }
    };
};

function Goal() {
    this.x = canvas.width - 200;
    this.y = canvas.height / 2;
    this.radius = 15;
    this.acceleration = 0.9;
    this.speed = randomBetween(3, 7);
    this.angle = randomBetween(0, 360);
    this.showHeart = false;
    this.reposition = function() {
        if (this.x < canvas.width / 2) {
            this.x = randomBetween(canvas.width / 2, canvas.width - border);
        } else {
            this.x = randomBetween(border, canvas.width / 2);
        }
        this.y = randomBetween(border, canvas.height - border);
        if (isPlaying) {
            score++;
            player.beams = 5;
            player.goalOpacity = 0.5;
            if (player.life < 3 && score % 3 == 0) {
                this.showHeart = true;
            } else if (this.showHeart) {
                this.showHeart = false;
                player.life++;
            }
        }
    };
    this.update = function() {
        let dx = Math.cos(this.angle * Math.PI / 180) * this.speed;
        let dy = Math.sin(this.angle * Math.PI / 180) * this.speed;
        this.speed *= this.acceleration;
        if (this.speed < 0.1) {
            this.speed = randomBetween(3, 7);
            this.angle = randomBetween(0, 360);
        }
        this.x += dx;
        this.y += dy;
        if (this.x < border) {
            this.x = border;
        }
        if (this.x > canvas.width - border) {
            this.x = canvas.width - border;
        }
        if (this.y < border) {
            this.y = border;
        }
        if (this.y > canvas.height - border) {
            this.y = canvas.height - border;
        }
        return this;
    };
    this.draw = function() {
        context.shadowColor = 'white';
        context.shadowBlur = connectionOppacity > 0 ? 100 * connectionOppacity : 0;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
        context.fillStyle = `rgba(255, 255, 255, ${connectionOppacity > 0 ? 1 : 0.5})`;
        context.strokeStyle = 'white';
        context.fill();
        context.stroke();
        context.shadowBlur = 0;
        if (this.showHeart && isPlaying) {
            context.fillStyle = 'rgba(0, 22, 52, 0.8)';
            context.strokeStyle = 'rgba(255, 255, 255, 1)';
            context.beginPath();
            context.arc(this.x, this.y + 6, 5, Math.PI * 2, false);
            context.fill();
            context.stroke();
            context.beginPath();
            context.arc(this.x - 7, this.y - 4, 5, Math.PI * 2, false);
            context.fill();
            context.stroke();
            context.beginPath();
            context.arc(this.x + 7, this.y - 4, 5, Math.PI * 2, false);
            context.fill();
            context.stroke();
        }
    };
};

function Particle() {
    this.x = canvas.width - 200;
    this.y = canvas.height / 2;
    this.radius = randomBetween(5, 20);
    this.speed = 15;
    this.acceleration = 0.99;
    this.angle = randomBetween(0, 360);
    this.isRed = false;
    this.update = function() {
        if (!frostParticle.permafrost) {
            this.x += Math.cos(this.angle * Math.PI / 180) * this.speed;
            this.y += Math.sin(this.angle * Math.PI / 180) * this.speed;
            this.speed *= this.acceleration;
            if (this.speed < 0.1) {
                this.speed = randomBetween(2,7);
                this.angle = randomBetween(0, 360);
            }
            if (this.x - this.radius < 0) {
                this.x = this.radius;
                this.angle = 540 - this.angle;
            }
            if (this.x + this.radius > canvas.width) {
                this.x = canvas.width - this.radius;
                this.angle = 540 - this.angle;
            }
            if (this.y + this.radius < 0) {
                this.y = canvas.height + this.radius;
            }
            if (this.y - this.radius > canvas.height) {
                this.y = 0 - this.radius;
            }
        }
        return this;
    };
    this.draw = function() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius + (this.isRed ? randomBetween(0, 15) : 0), 2 * Math.PI, false);
        context.fillStyle = `rgba(${this.isRed ? '255, 70, 70' : '255, 255, 255'}, ${this.speed-0.1})`;
        context.fillStyle = frostParticle.permafrost ? 'skyblue' : context.fillStyle;
        context.strokeStyle = this.isRed ? 'rgba(255, 70, 70, 0.8)' : 'white';
        context.strokeStyle = frostParticle.permafrost ? 'rgba(70, 70, 255, 0.8)' : context.strokeStyle;
        context.fill();
        context.stroke();
        context.lineWidth = 1;
    };
};

function Button(x, y, r, type) {
    this.x = x;
    const originalX = this.x;
    this.y = y;
    this.radius = r;
    this.type = type;
    this.isHit = function() {
        if (this.type == 'play' && (showInstruction || showLeaderBoard)) {
            return false;
        }
        return getHypothenuse(this.x, this.y, player.x, player.y) < this.radius;
    };
    this.isLight = function() {
        if (this.type == 'instruction' && showInstruction) {
            return true;
        } else if (this.type == 'leader' && showLeaderBoard) {
            return true;
        }
        return false;
    };
    this.drawCutomType = function() {
        context.fillStyle = `rgba(255, 255 ,255 , ${this.isHit() ? 1 : 0.4})`;
        context.strokeStyle = `rgba(255, 255 ,255 , ${this.isHit() ? 1 : 0.7})`;
        if (this.type == 'play') {
            context.beginPath();
            context.moveTo(this.x - 15, this.y - 22);
            context.lineTo(this.x + 25, this.y);
            context.lineTo(this.x - 15, this.y + 22);
            context.lineTo(this.x - 15, this.y - 22);
            context.fill();
            context.stroke();
        } else if (this.type == 'instruction') {
            context.font = 'bold 33px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('?', this.x, this.y - 2);
            context.strokeText('?', this.x, this.y - 2);
            context.font = 'bold 20px Arial';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('?', this.x + 12, this.y + 6);
            context.strokeText('?', this.x + 12, this.y + 6);
            context.fillText('?', this.x - 12, this.y + 6);
            context.strokeText('?', this.x - 12, this.y + 6);
        } else if (this.type == 'leader') {
            context.fillRect(this.x - 6 , this.y + 12, 12, 1);
            context.fillRect(this.x - 1 , this.y + 4 , 2 , 8);
            context.fillRect(this.x - 5 , this.y + 2 , 10, 1);
            context.fillRect(this.x - 7 , this.y - 1 , 14, 1);
            context.fillRect(this.x - 9 , this.y - 8 , 18, 5);
            context.fillRect(this.x - 7 , this.y - 10, 14, 2);
            context.fillRect(this.x - 9 , this.y - 14, 18, 3);
            context.strokeRect(this.x - 6 , this.y + 12, 12, 1);
            context.strokeRect(this.x - 1 , this.y + 4 , 2 , 8);
            context.strokeRect(this.x - 5 , this.y + 2 , 10, 1);
            context.strokeRect(this.x - 7 , this.y - 1 , 14, 1);
            context.strokeRect(this.x - 9 , this.y - 8 , 18, 5);
            context.strokeRect(this.x - 7 , this.y - 10, 14, 2);
            context.strokeRect(this.x - 9 , this.y - 14, 18, 3);
            context.beginPath();
            context.arc(this.x - 11, this.y - 6, 4, Math.PI * 2, false);
            context.stroke();
            context.beginPath();
            context.arc(this.x + 11, this.y - 6, 4, Math.PI * 2, false);
            context.stroke();
        }
    };
    this.update = function() {
        this.x = originalX + panelRadius;
        return this;
    }
    this.draw = function() {
        context.shadowColor = 'white';
        context.shadowBlur = this.isHit() || this.isLight() ? 15 : 0;
        context.lineWidth = this.isHit() || this.isLight() ? 10 : 3;
        context.strokeStyle = `rgba(255, 255 ,255 , ${this.isHit() ? 1 : 0.6})`;
        context.fillStyle = '#001634';
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        context.stroke();
        context.fill();
        context.lineWidth = 1;
        this.drawCutomType();
        context.shadowBlur = 0;
    };
};

function PhantomParticle() {
    this.x = 0;
    this.y = 0;
    this.radius = 30;
    this.range = 200;
    this.timeout = null;
    this.initializeTimeout = function() {
        this.timeout = setTimeout(() => {
            this.active = true;
        }, 1000 * (20 + randomBetween(0, 70)));
    };
    this.clearTimeout = function() {
        this.reset();
        clearTimeout(this.timeout);
    };
    this.reset = function() {
        this.active = false;
        let rand = randomBetween(0, 4);
        let speedDiv = 1000;
        if (rand == 0) { // upper left
            this.x = 0 - this.range * 2 * (canvas.width / canvas.height);
            this.y = 0 - this.range * 2;
            this.speedX = canvas.width / speedDiv;
            this.speedY = canvas.height / speedDiv;
        } else if (rand == 1) { // upper right
            this.x = canvas.width + this.range * 2 * (canvas.width / canvas.height);
            this.y = 0 - this.range * 2;
            this.speedX = -canvas.width / speedDiv;
            this.speedY = canvas.height / speedDiv;
        } else if (rand == 2) { // lower left
            this.x = 0 - this.range * 2 * (canvas.width / canvas.height);
            this.y = canvas.height + this.range * 2;
            this.speedX = canvas.width / speedDiv;
            this.speedY = -canvas.height / speedDiv;
        } else if (rand == 3) { // lower right
            this.x = canvas.width + this.range * 2 * (canvas.width / canvas.height);
            this.y = canvas.height + this.range * 2;
            this.speedX = -canvas.width / speedDiv;
            this.speedY = -canvas.height / speedDiv;
        }
    };
    this.reset();
    this.update = function() {
        if (this.active) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        if (getHypothenuse(this.x, this.y, player.x, player.y) < this.radius + player.radius) {
            player.life++;
            if (player.life > 3) {
                player.life = 3;
            }
            this.reset();
            this.initializeTimeout();
        } else if ((this.speedY < 0 && this.y < 0 - this.range * 2) || (this.speedY > 0 && this.y > canvas.height + this.range * 2)) {
            this.reset();
            this.initializeTimeout();
        }
        for (let particle of particles) {
            if (getHypothenuse(this.x, this.y, particle.x, particle.y) < particle.radius + this.range) {
                particle.isRed = true;
            } else {
                particle.isRed = false;
            }
        }
        return this;
    };
    this.draw = function() {
        context.strokeStyle = 'pink';
        context.fillStyle = 'rgba(255, 0, 0, 0.2)';
        context.shadowColor = 'rgba(255, 70, 70, 0.8)';
        context.shadowBlur = 25;
        context.lineWidth = 10;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        context.stroke();
        context.fill();
        context.shadowBlur = 0;
        context.lineWidth = 1;

        context.fillStyle = 'rgba(255, 192, 203, 0.6)';
        context.beginPath();
        context.arc(this.x, this.y + 10, 8, Math.PI * 2, false);
        context.fill();
        context.beginPath();
        context.arc(this.x - 12, this.y - 3, 8, Math.PI * 2, false);
        context.fill();
        context.beginPath();
        context.arc(this.x + 12, this.y - 3, 8, Math.PI * 2, false);
        context.fill();

    };
};

function FrostParticle() {
    this.x = 0 - this.radius * 2;
    this.y = randomBetween(canvas.height / 2 - 100, canvas.height / 2 + 100);
    this.timeout = null;
    this.initializeTimeout = function() {
        this.timeout = setTimeout(() => {
            this.active = true;
        }, 1000 * (20 + randomBetween(0, 70)));
    };
    this.clearTimeout = function() {
        this.reset();
        clearTimeout(this.timeout);
    };
    this.reset = function() {
        this.active = false;
        this.permafrost = false;
        this.radius = 50;
        let rand = randomBetween(0, 2);
        this.y = randomBetween(canvas.height / 2 - 100, canvas.height / 2 + 100);
        if (rand == 0) {
            this.x = 0 - this.radius * 2;
            this.speedX = 2;
            this.speedY = randomBetween(-30, 31) * 0.01;
        } else if (rand == 1) {
            this.x = canvas.width + this.radius * 2;
            this.speedX = -2;
            this.speedY = randomBetween(-30, 31) * 0.01;
        }
    };
    this.reset();
    this.update = function() {
        if (!this.permafrost && this.active) {
            this.x += this.speedX;
            this.y += this.speedY;
        }
        if (getHypothenuse(this.x, this.y, player.x, player.y) < this.radius + player.radius && !this.permafrost) {
            this.permafrost = true;
            player.permafrostOpacity = 0.7;
        } else if (this.permafrost) {
            this.radius -= 0.05;
            if (this.radius <= 0) {
                this.reset();
                this.initializeTimeout();
            }
        } else if ((this.speedX < 0 && this.x < 0 - this.radius * 3) || (this.speedX > 0 && this.x > canvas.width + this.radius * 3)) {
            this.reset();
            this.initializeTimeout();
        }
        return this;
    };
    this.draw = function() {
        context.strokeStyle = 'skyblue';
        context.fillStyle = 'rgba(0, 0, 255, 0.2)';
        context.shadowColor = 'rgba(70, 70, 255, 0.8)';
        context.shadowBlur = 25;
        context.lineWidth = this.radius / 5;
        context.beginPath();
        context.arc(this.x, this.y, this.radius, Math.PI * 2, false);
        context.stroke();
        context.fill();
        context.shadowBlur = 0;
        context.lineWidth = 1;
    };
};

//////////////////////////////////////////////////////////////////////////////// events

canvas.addEventListener('mousemove', function (e) {
    if (e.pageX > border && e.pageX < canvas.width - border) {
        player.destinationX = e.pageX;
    }
    if (e.pageY > border && e.pageY < canvas.height - border) {
        player.destinationY = e.pageY;
    }

    if (e.pageX <= border) {
        player.destinationX = border;
    } else if (e.pageY <= border) {
        player.destinationY = border;
    } else if (e.pageX >= canvas.width - border) {
        player.destinationX = canvas.width - border;
    } else if (e.pageY >= canvas.height - border) {
        player.destinationY = canvas.height - border;
    };
});

canvas.addEventListener('mousedown', function() {
    player.auraOpacity = 1;
    if (player.beams > 0 && connectionOppacity < 0.1) {
        connectionOppacity = 1;
        if (isPlaying && !godMode) {
            player.beams--;
        }
    }
});

canvas.addEventListener('click', function(e) {
    if (!isPlaying) {
        if (instructionButton.isHit()) {
            showLeaderBoard = false;
            showInstruction = !showInstruction;
            return;
        }
        if (leaderButton.isHit()) {
            showInstruction = false;
            showLeaderBoard = !showLeaderBoard;
            return;
        }
        if (playButton.isHit()) {
            isPlaying = true;
            goal.x = canvas.width - 200;
            goal.y = canvas.height / 2;
            name = latestPlayer;
            phantomParticle.initializeTimeout();
            frostParticle.initializeTimeout();
            return;
        }
        if (getHypothenuse(100, canvas.height / 2, e.pageX, e.pageY) > panelRadius) {
            showInstruction = false;
            showLeaderBoard = false;
        }
    }
});

window.addEventListener('keydown', function(e) {
    if (e.key.length == 1 && name.length < 16) {
        name = (name + e.key).toUpperCase();
    } else if (e.key == 'Backspace') {
        name = name.split('');
        name.pop();
        name = name.join('');
    } else if (e.key == 'Escape') {
        // godMode = !godMode;
        showInstruction = false;
        showLeaderBoard = false;
    } else if (e.key == 'Enter' && isGG && name.length) {
        saveGameRecord();
        reInitialize();
    }
});

window.addEventListener('resize', function() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    player.x = 200;
    player.y = canvas.height / 2;
    goal.x = canvas.width - 200;
    goal.y = canvas.height / 2;
    playButton = new Button(280, canvas.height / 2, 50, 'play');
    instructionButton = new Button(280 - 67, canvas.height / 2 - 67, 30, 'instruction');
    leaderButton = new Button(280 + 67, canvas.height / 2 + 67, 30, 'leader');
    randButton = new Button(200, canvas.height / 2, 15, 'random');
    reInitialize();
});

////////////////////////////////////////////////////////////////////////////////
