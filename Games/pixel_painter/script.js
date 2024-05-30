// script.js
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('pixelCanvas');
    const ctx = canvas.getContext('2d');
    const colorPicker = document.getElementById('colorPicker');
    const clearButton = document.getElementById('clearButton');
    const undoButton = document.getElementById('undoButton');
    let drawing = false;
    let color = colorPicker.value;
    let undoStack = [];

    // Initialize canvas
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.addEventListener('mousedown', () => drawing = true);
    canvas.addEventListener('mouseup', () => drawing = false);
    canvas.addEventListener('mousemove', draw);
    colorPicker.addEventListener('input', (e) => {
        color = e.target.value;
        colorPicker.style.borderColor = color;
    });
    clearButton.addEventListener('click', clearCanvas);
    undoButton.addEventListener('click', undo);

    canvas.addEventListener('mousedown', saveState);

    function draw(event) {
        if (!drawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        ctx.fillStyle = color;
        ctx.fillRect(Math.floor(x / 10) * 10, Math.floor(y / 10) * 10, 10, 10);
    }

    function clearCanvas() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    function saveState() {
        undoStack.push(ctx.getImageData(0, 0, canvas.width, canvas.height));
        if (undoStack.length > 10) undoStack.shift(); // Limit stack size
    }

    function undo() {
        if (undoStack.length > 0) {
            const imgData = undoStack.pop();
            ctx.putImageData(imgData, 0, 0);
        }
    }
});
