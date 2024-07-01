const paintCanvas = document.querySelector("canvas"),
toolButtons = document.querySelectorAll(".tool"),
fillCheckbox = document.querySelector("#fill-color"),
brushSizeSlider = document.querySelector("#size-slider"),
colorOptions = document.querySelectorAll(".colors .option"),
colorInput = document.querySelector("#color-picker"),
clearButton = document.querySelector(".clear-canvas"),
saveButton = document.querySelector(".save-img"),
context = paintCanvas.getContext("2d");

let lastMouseX, lastMouseY, canvasSnapshot,
isPainting = false,
activeTool = "brush",
brushSize = 5,
activeColor = "#000";

const initializeCanvasBackground = () => {
    context.fillStyle = "#fff";
    context.fillRect(0, 0, paintCanvas.width, paintCanvas.height);
    context.fillStyle = activeColor;
}

window.addEventListener("load", () => {
    paintCanvas.width = paintCanvas.offsetWidth;
    paintCanvas.height = paintCanvas.offsetHeight;
    initializeCanvasBackground();
});

const drawRectangle = (event) => {
    if(!fillCheckbox.checked) {
        return context.strokeRect(event.offsetX, event.offsetY, lastMouseX - event.offsetX, lastMouseY - event.offsetY);
    }
    context.fillRect(event.offsetX, event.offsetY, lastMouseX - event.offsetX, lastMouseY - event.offsetY);
}

const drawCircleShape = (event) => {
    context.beginPath();
    let radius = Math.sqrt(Math.pow((lastMouseX - event.offsetX), 2) + Math.pow((lastMouseY - event.offsetY), 2));
    context.arc(lastMouseX, lastMouseY, radius, 0, 2 * Math.PI);
    fillCheckbox.checked ? context.fill() : context.stroke();
}

const drawTriangleShape = (event) => {
    context.beginPath();
    context.moveTo(lastMouseX, lastMouseY);
    context.lineTo(event.offsetX, event.offsetY);
    context.lineTo(lastMouseX * 2 - event.offsetX, event.offsetY);
    context.closePath();
    fillCheckbox.checked ? context.fill() : context.stroke();
}

const beginDrawing = (event) => {
    isPainting = true;
    lastMouseX = event.offsetX;
    lastMouseY = event.offsetY;
    context.beginPath();
    context.lineWidth = brushSize;
    context.strokeStyle = activeColor;
    context.fillStyle = activeColor;
    canvasSnapshot = context.getImageData(0, 0, paintCanvas.width, paintCanvas.height);
}

const executeDrawing = (event) => {
    if(!isPainting) return;
    context.putImageData(canvasSnapshot, 0, 0);

    if(activeTool === "brush" || activeTool === "eraser") {
        context.strokeStyle = activeTool === "eraser" ? "#fff" : activeColor;
        context.lineTo(event.offsetX, event.offsetY);
        context.stroke();
    } else if(activeTool === "rectangle"){
        drawRectangle(event);
    } else if(activeTool === "circle"){
        drawCircleShape(event);
    } else {
        drawTriangleShape(event);
    }
}

toolButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".options .active").classList.remove("active");
        button.classList.add("active");
        activeTool = button.id;
    });
});

brushSizeSlider.addEventListener("change", () => brushSize = brushSizeSlider.value);

colorOptions.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".options .selected").classList.remove("selected");
        button.classList.add("selected");
        activeColor = window.getComputedStyle(button).getPropertyValue("background-color");
    });
});

colorInput.addEventListener("change", () => {
    colorInput.parentElement.style.background = colorInput.value;
    colorInput.parentElement.click();
});

clearButton.addEventListener("click", () => {
    context.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
    initializeCanvasBackground();
});

saveButton.addEventListener("click", () => {
    const link = document.createElement("a");
    link.download = `${Date.now()}.jpg`;
    link.href = paintCanvas.toDataURL();
    link.click();
});

paintCanvas.addEventListener("mousedown", beginDrawing);
paintCanvas.addEventListener("mousemove", executeDrawing);
paintCanvas.addEventListener("mouseup", () => isPainting = false);
