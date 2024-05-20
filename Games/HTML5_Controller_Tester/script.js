const fudgeFactor = 2;  // because of bug in Chrome related to svg text alignment font sizes can not be < 1
const runningElem = document.querySelector('#running');
const gamepadsElem = document.querySelector('#gamepads');
const gamepadsByIndex = {};
let testsStarted = false;
const controllerTemplate = `
<div>
  <div class="head"><div class="index"></div><div class="id"></div></div>
  <div class="info"><div class="label">connected:</div><span class="connected"></span></div>
  <div class="info"><div class="label">mapping:</div><span class="mapping"></span></div>
  <div class="inputs">
    <div class="line">---------------------------------------------------------------</div>
    <p><b> Analog Sticks </b></p>
    <div class="axes"></div>
    <br>
    <br>
    <p><b>Face Buttons (buttons,triggers,bumpers)</b></p>
    <div class="buttons"></div>
  </div>
</div>
`;
const axisTemplate = `
<svg viewBox="-2.2 -2.2 4.4 4.4" width="256" height="128">
    <circle cx="0" cy="0" r="2" fill="none" stroke="#888" stroke-width="0.08" />
    <path d="M0,-2L0,2M-2,0L2,0" stroke="#888" stroke-width="0.04" />
    <circle cx="0" cy="0" r="0.22" fill="red" class="axis" />
    <text text-anchor="middle" fill="#CCC" x="0" y="2" style="font-size: 0.4px;">0</text>
</svg>
`

const buttonTemplate = `
<svg viewBox="-2.2 -2.2 4.4 4.4" width="64" height="64">
  <circle cx="0" cy="0" r="2" fill="none" stroke="#1000" stroke-width="0.1" />
  <circle cx="0" cy="0" r="0" fill="none" fill="red" class="button" />
  <text class="value" dominant-baseline="middle" text-anchor="middle" fill="#CCC" x="0" y="0">0.00</text>
  <text class="index" alignment-baseline="hanging" dominant-baseline="hanging" text-anchor="start" fill="#CCC" x="-2" y="-2" style="font-size: 0.6px;">0</text>
</svg>
`;

function addGamepad(gamepad) {
  console.log('add:', gamepad.index);
  const elem = document.createElement('div');
  elem.innerHTML = controllerTemplate;

  const axesElem = elem.querySelector('.axes');
  const buttonsElem = elem.querySelector('.buttons');
  
  const axes = [];
  for (let ndx = 0; ndx < gamepad.axes.length; ndx += 2) {
    const div = document.createElement('div');
    div.innerHTML = axisTemplate;
    axesElem.appendChild(div);
    axes.push({
      axis: div.querySelector('.axis'),
      value: div.querySelector('text'),
    });
  }

  const buttons = [];
  for (let ndx = 0; ndx < gamepad.buttons.length; ++ndx) {
    const div = document.createElement('div');
    div.innerHTML = buttonTemplate;
    buttonsElem.appendChild(div);
    if (ndx == 0){
        var indexElement = div.querySelector('.index');
        indexElement.innerHTML = "A/Cross";
    }
    if (ndx == 1){
        div.querySelector('.index').textContent = "B/Circle";
    }
    if (ndx == 2){
        div.querySelector('.index').textContent = "X/Square";
    }
    if (ndx == 3){
        div.querySelector('.index').textContent = "Y/Triangle";
    }
    if (ndx == 4){
        div.querySelector('.index').textContent = "LB/L1";
    }
    if (ndx == 5){
        div.querySelector('.index').textContent = "RB/R1";
    }
    if (ndx == 6){
        div.querySelector('.index').textContent = "LT/L2";
    }
    if (ndx == 7){
        div.querySelector('.index').textContent = "RT/R2";
    }
    if (ndx == 8){
        div.querySelector('.index').textContent = "SELECT";
    }
    if (ndx == 9){
        div.querySelector('.index').textContent = "START";
    }
    if (ndx == 10){
        div.querySelector('.index').textContent = "LS/L3";
    }
    if (ndx == 11){
        div.querySelector('.index').textContent = "RS/R3";
    }
    if (ndx == 12){
        div.querySelector('.index').textContent = "DPAD UP";
    }
    if (ndx == 13){
        div.querySelector('.index').textContent = "DPAD DOWN";
    }
    if (ndx == 14){
        div.querySelector('.index').textContent = "DPAD LEFT";
    }
    if (ndx == 15){
        div.querySelector('.index').textContent = "DPAD RIGHT";
    }
    if (ndx == 16){
        div.querySelector('.index').textContent = "HOME";
    }
    //div.querySelector('.index').textContent = ndx;
    buttons.push({
      circle: div.querySelector('.button'),
      value: div.querySelector('.value'),
    });
  }

  gamepadsByIndex[gamepad.index] = {
    gamepad,
    elem,
    axes,
    buttons,
    index: elem.querySelector('.index'),
    id: elem.querySelector('.id'),
    mapping: elem.querySelector('.mapping'),
    connected: elem.querySelector('.connected'),
  };
  gamepadsElem.appendChild(elem);
}

function removeGamepad(gamepad) {
  const info = gamepadsByIndex[gamepad.index];
  if (info) {
    delete gamepadsByIndex[gamepad.index];
    info.elem.parentElement.removeChild(info.elem);
  }
}

function addGamepadIfNew(gamepad) {
  const info = gamepadsByIndex[gamepad.index];
  if (!info) {
    addGamepad(gamepad);
  } else {
    
    info.gamepad = gamepad;
  }
}

function handleConnect(e) {
  console.log('connect');
  addGamepadIfNew(e.gamepad);
}

function handleDisconnect(e) {
  console.log('disconnect');
  removeGamepad(e.gamepad);
}

const t = String.fromCharCode(0x26AA);
const f = String.fromCharCode(0x26AB);
function onOff(v) {
  return v ? t : f;
}

const keys = ['index', 'id', 'connected', 'mapping', /*'timestamp'*/];
function processController(info) {
  const {elem, gamepad, axes, buttons} = info;
  const lines = [`gamepad  : ${gamepad.index}`];
  for (const key of keys) {
    info[key].textContent = gamepad[key];
  }
  axes.forEach(({axis, value}, ndx) => {
    const off = ndx * 2;
    axis.setAttributeNS(null, 'cx', gamepad.axes[off    ] * fudgeFactor);
    axis.setAttributeNS(null, 'cy', gamepad.axes[off + 1] * fudgeFactor);
    value.textContent = `X: ${gamepad.axes[off].toFixed(2).padStart(5)},Y: ${gamepad.axes[off + 1].toFixed(2).padStart(5)}`;
    
  });
  buttons.forEach(({circle, value}, ndx) => {
    const button = gamepad.buttons[ndx];
    const rainbowColor = getRainbowColor(button.value);
    circle.setAttributeNS(null, 'r', button.value * fudgeFactor);
    circle.setAttributeNS(null, 'fill', button.pressed ? rainbowColor : 'white');
    value.textContent = `${button.value.toFixed(2)}`;
  });
  function getRainbowColor(value) {
    // Map button value to a hue value (0-120 for green to red)
    const hue = (1 - value) * 120;
    // Convert HSV to RGB
    const rgb = hsvToRgb(hue / 360, 1, 1);
    return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

function hsvToRgb(h, s, v) {
    let r, g, b, i, f, p, q, t;
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v; g = t; b = p; break;
        case 1: r = q; g = v; b = p; break;
        case 2: r = p; g = v; b = t; break;
        case 3: r = p; g = q; b = v; break;
        case 4: r = t; g = p; b = v; break;
        case 5: r = v; g = p; b = q; break;
    }
    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}
  
//  lines.push(`axes     : [${gamepad.axes.map((v, ndx) => `${ndx}: ${v.toFixed(2).padStart(5)}`).join(', ')} ]`);
//  lines.push(`buttons  : [${gamepad.buttons.map((v, ndx) => `${ndx}: ${onOff(v.pressed)} ${v.value.toFixed(2)}`).join(', ')} ]`);
 // elem.textContent = lines.join('\n');
}

function addNewPads() {
  const gamepads = navigator.getGamepads();
  for (let i = 0; i < gamepads.length; i++) {
    const gamepad = gamepads[i]
    if (gamepad) {
      addGamepadIfNew(gamepad);
    }
  }
}

//window.addEventListener("gamepadconnected", handleConnect);
//window.addEventListener("gamepaddisconnected", handleDisconnect);

let isTimerRunning = false;
function startTimer() {
  isTimerRunning = true;
  process();
}

function stopTimer() {
  isTimerRunning = false;
}

function process() {
  if (!isTimerRunning) {
    return;
  }
  
  runningElem.textContent = ((performance.now() * 0.01 * 60).toFixed(2)).toString().padStart(2, '0');
  addNewPads();  // some browsers add by polling, others by event

  Object.values(gamepadsByIndex).forEach(processController);
  requestAnimationFrame(process);
}
//vibration
function testVibration() {
  const gamepads = navigator.getGamepads();
  for (let gamepad of gamepads) {
    if (gamepad) {
      gamepad.vibrationActuator.playEffect("dual-rumble", {
        duration: 4000,
        strongMagnitude: vibrationIntensitySlider.value,
        weakMagnitude: vibrationIntensitySlider.value
      });
    }
  }
}

document.getElementById("vibrationButton").addEventListener("click", testVibration);

// Start the timer when gamepad input is detected
window.addEventListener('gamepadconnected', startTimer);
window.addEventListener('gamepaddisconnected', stopTimer);

// Stop the timer when there's no gamepad input
window.addEventListener('gamepadlost', stopTimer);


