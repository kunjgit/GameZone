// Function to apply gradient theme
function applyGradientTheme(color1, color2, direction) {
  var container = document.querySelector('.game');
  container.style.background = 'linear-gradient(' + direction + ', ' + color1 + ', ' + color2 + ')';
  var title = document.querySelector('.heading');
  title.style.color = isDark(color1) ? '#ffffff' : '#000000';
}

// Event listener for the gradient theme button
document.getElementById('gradient-theme-btn').addEventListener('click', function() {
  var colorsContainer = document.getElementById('gradient-colors-container');
  colorsContainer.style.display = (colorsContainer.style.display === 'block') ? 'none' : 'block';
});

// Event listener for the Apply Gradient button
document.getElementById('apply-gradient-btn').addEventListener('click', function() {
  var color1 = document.getElementById('color1').value;
  var color2 = document.getElementById('color2').value;
  var direction = document.getElementById('gradient-direction').value; // Get the selected gradient direction
  applyGradientTheme(color1, color2, direction);
  document.getElementById('gradient-colors-container').style.display = 'none';
});

// Function to check the brightness of a color
function isDark(color) {
  const rgb = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
  const r = parseInt(rgb[1], 16);
  const g = parseInt(rgb[2], 16);
  const b = parseInt(rgb[3], 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance < 0.5;
}