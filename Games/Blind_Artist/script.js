// Game State
let gameState = {
    isDrawing: false,
    isGameActive: false,
    currentPrompt: '',
    timeLeft: 60,
    timerInterval: null,
    currentColor: '#000000',
    penSize: 3,
    isErasing: false
};

// Drawing prompts - objects to draw
const prompts = [
    '🏠 House', '🐱 Cat', '🐶 Dog', '🌳 Tree', '☀️ Sun',
    '🌙 Moon', '⭐ Star', '🚗 Car', '✈️ Airplane', '🚲 Bicycle',
    '🍎 Apple', '🍕 Pizza', '🎂 Cake', '🌸 Flower', '🦋 Butterfly',
    '🐟 Fish', '🐘 Elephant', '🦒 Giraffe', '🎈 Balloon', '⚽ Ball',
    '👑 Crown', '🎸 Guitar', '🎨 Palette', '📱 Phone', '💻 Laptop',
    '🏔️ Mountain', '🌊 Wave', '⛵ Boat', '🏰 Castle', '🎪 Circus Tent'
];

// Canvas setup
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const canvasOverlay = document.getElementById('canvasOverlay');

// UI Elements
const promptDisplay = document.getElementById('prompt');
const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const revealBtn = document.getElementById('revealBtn');
const clearBtn = document.getElementById('clearBtn');
const eraserBtn = document.getElementById('eraserBtn');
const colorPicker = document.getElementById('colorPicker');
const penSizeSlider = document.getElementById('penSize');
const sizeDisplay = document.getElementById('sizeDisplay');
const resultsSection = document.getElementById('resultsSection');
const retryBtn = document.getElementById('retryBtn');
const newPromptBtn = document.getElementById('newPromptBtn');
const downloadBtn = document.getElementById('downloadBtn');
const starRating = document.getElementById('starRating');

// Initialize canvas
function initCanvas() {
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Get random prompt
function getRandomPrompt() {
    return prompts[Math.floor(Math.random() * prompts.length)];
}

// Start game
function startGame() {
    // Reset canvas
    initCanvas();
    
    // Get random prompt
    gameState.currentPrompt = getRandomPrompt();
    promptDisplay.textContent = gameState.currentPrompt;
    
    // Reset timer
    gameState.timeLeft = 60;
    updateTimerDisplay();
    
    // Reset game state
    gameState.isGameActive = true;
    gameState.isErasing = false;
    
    // Show/hide buttons
    startBtn.style.display = 'none';
    revealBtn.style.display = 'inline-block';
    resultsSection.style.display = 'none';
    
    // Show overlay (hide canvas)
    canvasOverlay.classList.remove('hidden');
    
    // Start timer
    startTimer();
}

// Timer functions
function startTimer() {
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.timerInterval = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplay.textContent = `${gameState.timeLeft}s`;
    
    // Change color based on time left
    if (gameState.timeLeft <= 10) {
        timerDisplay.style.color = '#ff4444';
    } else if (gameState.timeLeft <= 30) {
        timerDisplay.style.color = '#ffaa00';
    } else {
        timerDisplay.style.color = 'white';
    }
}

// End game and reveal
function endGame() {
    clearInterval(gameState.timerInterval);
    gameState.isGameActive = false;
    revealDrawing();
}

// Reveal the drawing
function revealDrawing() {
    // Hide overlay to show canvas
    canvasOverlay.classList.add('hidden');
    
    // Hide reveal button
    revealBtn.style.display = 'none';
    
    // Show results section
    resultsSection.style.display = 'block';
    
    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Drawing functions
let lastX = 0;
let lastY = 0;

function getMousePos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
    };
}

function getTouchPos(e) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const touch = e.touches[0];
    
    return {
        x: (touch.clientX - rect.left) * scaleX,
        y: (touch.clientY - rect.top) * scaleY
    };
}

function startDrawing(e) {
    if (!gameState.isGameActive) return;
    
    gameState.isDrawing = true;
    const pos = e.type.includes('touch') ? getTouchPos(e) : getMousePos(e);
    lastX = pos.x;
    lastY = pos.y;
    
    e.preventDefault();
}

function draw(e) {
    if (!gameState.isDrawing || !gameState.isGameActive) return;
    
    const pos = e.type.includes('touch') ? getTouchPos(e) : getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(pos.x, pos.y);
    
    if (gameState.isErasing) {
        ctx.strokeStyle = 'white';
        ctx.lineWidth = gameState.penSize * 3;
    } else {
        ctx.strokeStyle = gameState.currentColor;
        ctx.lineWidth = gameState.penSize;
    }
    
    ctx.stroke();
    
    lastX = pos.x;
    lastY = pos.y;
    
    e.preventDefault();
}

function stopDrawing() {
    gameState.isDrawing = false;
}

// Clear canvas
function clearCanvas() {
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Toggle eraser
function toggleEraser() {
    gameState.isErasing = !gameState.isErasing;
    
    if (gameState.isErasing) {
        eraserBtn.style.background = '#ff6b6b';
        eraserBtn.textContent = '✏️ Pen';
    } else {
        eraserBtn.style.background = '#667eea';
        eraserBtn.textContent = '🧹 Eraser';
    }
}

// Update pen color
function updatePenColor(e) {
    gameState.currentColor = e.target.value;
    gameState.isErasing = false;
    eraserBtn.style.background = '#667eea';
    eraserBtn.textContent = '🧹 Eraser';
}

// Update pen size
function updatePenSize(e) {
    gameState.penSize = e.target.value;
    sizeDisplay.textContent = `${gameState.penSize}px`;
}

// Retry same prompt
function retrySamePrompt() {
    initCanvas();
    gameState.timeLeft = 60;
    updateTimerDisplay();
    gameState.isGameActive = true;
    gameState.isErasing = false;
    
    resultsSection.style.display = 'none';
    revealBtn.style.display = 'inline-block';
    canvasOverlay.classList.remove('hidden');
    
    // Reset star rating
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
    });
    
    startTimer();
}

// New prompt
function newPrompt() {
    startGame();
    
    // Reset star rating
    document.querySelectorAll('.star').forEach(star => {
        star.classList.remove('active');
    });
}

// Download drawing
function downloadDrawing() {
    const link = document.createElement('a');
    link.download = `blind-artist-${Date.now()}.png`;
    link.href = canvas.toDataURL();
    link.click();
}

// Star rating
function handleStarClick(e) {
    const rating = parseInt(e.target.dataset.rating);
    const stars = document.querySelectorAll('.star');
    
    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Event Listeners
// Mouse events
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

// Touch events
canvas.addEventListener('touchstart', startDrawing);
canvas.addEventListener('touchmove', draw);
canvas.addEventListener('touchend', stopDrawing);

// Button events
startBtn.addEventListener('click', startGame);
revealBtn.addEventListener('click', endGame);
clearBtn.addEventListener('click', clearCanvas);
eraserBtn.addEventListener('click', toggleEraser);
colorPicker.addEventListener('input', updatePenColor);
penSizeSlider.addEventListener('input', updatePenSize);
retryBtn.addEventListener('click', retrySamePrompt);
newPromptBtn.addEventListener('click', newPrompt);
downloadBtn.addEventListener('click', downloadDrawing);

// Star rating events
document.querySelectorAll('.star').forEach(star => {
    star.addEventListener('click', handleStarClick);
});

// Initialize on load
window.addEventListener('load', () => {
    initCanvas();
});