// Create the canvas grid
const canvas = document.getElementById('canvas');
const palette = document.getElementById('colorPalette');
const colors = ['red', 'blue', 'green', 'yellow']; // Example palette colors

for (let i = 0; i < 20 * 20; i++) {
  const pixel = document.createElement('div');
  pixel.classList.add('pixel');
  canvas.appendChild(pixel);
}

// Add colors to the palette
colors.forEach(color => {
  const colorDiv = document.createElement('div');
  colorDiv.classList.add('color');
  colorDiv.style.backgroundColor = color;
  
  // Add click event listener to select the color
  colorDiv.addEventListener('click', function() {
    currentColor = color;
  });
  
  palette.appendChild(colorDiv);
});

// Set default color
let currentColor = 'black';

// Add event listener to each pixel on the canvas
const pixels = document.querySelectorAll('.pixel');
pixels.forEach(pixel => {
  pixel.addEventListener('click', function() {
    this.style.backgroundColor = currentColor;
  });
});
