document.addEventListener("DOMContentLoaded", function() {
    const colorDisplay = document.getElementById("colorDisplay");
    const colorInput = document.getElementById("colorInput");
    const matchButton = document.getElementById("matchButton");
    const result = document.getElementById("result");

    let targetColor = generateRandomColor();
    colorDisplay.style.backgroundColor = targetColor;

    matchButton.addEventListener("click", function() {
        const userColor = colorInput.value;
        if (userColor.toLowerCase() === targetColor.toLowerCase()) {
            result.textContent = "Congratulations! You matched the color!";
            result.style.color = "green";
        } else {
            result.textContent = "Sorry! Wrong color. Try again!";
            result.style.color = "red";
        }
    });

    function generateRandomColor() {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
});
