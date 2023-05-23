const createButtons = (newGridButton) => {
  newGridButton.textContent = 'New Grid';
  newGridButton.classList.add('btn');

  const rgbButton = document.createElement('button');
  rgbButton.textContent = 'Color RGB';
  rgbButton.classList.add('color-btn', 'rgb');
  addColors(rgbButton);

  const violetButton = document.createElement('button');
  violetButton.textContent = 'DarkViolet';
  violetButton.classList.add('color-btn', 'violet');
  addColors(violetButton);

  const limeButton = document.createElement('button');
  limeButton.textContent = 'Lime';
  limeButton.classList.add('color-btn', 'lime');
  addColors(limeButton);

  const pinkButton = document.createElement('button');
  pinkButton.textContent = 'DeepPink';
  pinkButton.classList.add('color-btn', 'pink');
  addColors(pinkButton);

  const aquaButton = document.createElement('button');
  aquaButton.textContent = 'Aquamarine';
  aquaButton.classList.add('color-btn', 'aqua');
  addColors(aquaButton);

  const grayButton = document.createElement('button');
  grayButton.textContent = '50 shades of Gray';
  grayButton.classList.add('color-btn', 'gray');
  addColors(grayButton);
};

const addColors = (button) => {
  const container = document.querySelector('.container');
  const colorContainer = document.querySelector('.colors');
  const boxes = container.querySelectorAll('.grid');
  button.addEventListener('click', () => {
    boxes.forEach((box) =>
      box.addEventListener('mouseover', () => {
        switch (button.textContent) {
          case '50 shades of Gray':
            let grayColor = Math.floor(Math.random() * 255);
            box.style.background = `rgb(${grayColor},${grayColor},${grayColor})`;
            break;
          case 'Aquamarine':
            box.style.background = 'aquamarine';
            break;
          case 'DeepPink':
            box.style.background = 'DeepPink';
            break;
          case 'Lime':
            box.style.background = 'Lime';
            break;
          case 'DarkViolet':
            box.style.background = 'DarkViolet';
            break;
          case 'Color RGB':
            let R = Math.floor(Math.random() * 255);
            let G = Math.floor(Math.random() * 255);
            let B = Math.floor(Math.random() * 255);
            box.style.background = `rgb(${R},${G},${B})`;
            break;
        }
      })
    );
  });
  colorContainer.appendChild(button);
};

export default createButtons;
