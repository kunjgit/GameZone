import { game } from '../core/Game.js';
import { TYPES, isFirefox } from '../core/global.js';
import { sprites } from '../core/sprites.js';

// "DOMFetti" experiment - 09/2018

// if false, target 30fps by updating style properties every other frame.
const RENDER_AT_60FPS = false;

const COLORS = {
  default: ['#a864fd', '#29cdff', '#78ff44', '#ff718d', '#fdff6a'],
  green: ['#003300', '#006600', '#339933', '#66cc66', '#99ff99', '#99cc99', '#666666', '#cccccc', '#ccffcc'],
  yellow: ['#684f32', '#896842', '#b38754', '#c79862', '#f1b673', '#ffc076'],
  grey: ['#222222', '#444444', '#666666', '#888888', '#aaaaaa', '#cccccc', '#ffffff'],
  bomb: ['#330000', '#660000', '#663333', '#996666', '#666666', '#999999', '#cccccc']
}

// opacity is GPU-accelerated, faster than changing background-color
const BACK_SIDE_OPACITY = 2/3;

const useOpacity = true;

// tl;dr, Firefox may complain about the will-change pixel budget.
// this reduces paint in Chrome when opacity changes, however.
const willChange = !isFirefox ? { 'will-change': 'opacity' } : undefined;

let activeBooms = 0;

const int = (number, base = 10) => parseInt(number, base);

function calcFractionalColors(colors = COLORS.default) {
  return colors.map((color) => {
    const rgb = hexToRgb(color);
    const fraction = 2/3;
    return rgbToHex(
      int(rgb.r * fraction),
      int(rgb.g * fraction),
      int(rgb.b * fraction),
    );
  });
}

const fractionalColors = calcFractionalColors();

function configureColors(colors = COLORS.default) {
  // called by gunfire, etc., to set e.g., helicopter colors for "explosions" 
  return {
    colors,
    backColors: !useOpacity && calcFractionalColors(colors)
  };
}

// lazy-assigned target for appending nodes
let targetNode;

const elementTemplate = document.createElement('div');

// direct style assignment, instead of CSS className.
Object.assign(elementTemplate.style, {
  position: 'absolute',
  top: '0px',
  left: '0px',
  width: '12px',
  height: '4px',
  overflow: 'hidden',
  transform: 'translate3d(-12px, 0px, 0px)',
  /* maybe this helps performance, maybe not. */
  contain: 'strict',
  /**
   * Firefox may complain about `will-change` if there are enough elements, here:
   * > Will-change memory consumption is too high. Budget limit is the document surface area multiplied by 3 (1210308 px).
   * > Occurrences of will-change over the budget will be ignored.
   */
  ...willChange
});

const useUnlimited = window.location.href.match(/unlimited/i);

let maxActiveCount = useUnlimited ? Math.Infinity : 1000;
let activeCount = 0;

const totalTicks = 250;

const boundary1 = 90;
const boundary2 = 270;

// larger elements for first fraction of animation
const scaleMagnifier = 0.15;

// https://stackoverflow.com/questions/14482226/how-can-i-get-the-color-halfway-between-two-colors
function rgbToHex(r, g, b) {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return null;
  return {
    r: int(result[1], 16),
    g: int(result[2], 16),
    b: int(result[3], 16)
  }
}

function rnd(range = 1) {
  return Math.random() * range;
}

function createElements(root, elementCount, frontColors, backColors) {

  return Array
    .from({ length: elementCount })
    .map(() => {
      const element = sprites.withStyle(elementTemplate.cloneNode(true));
      const rndColor = int(rnd() * frontColors.length);
      const frontColor = frontColors[rndColor];
      const backColor = backColors[rndColor];
      element._style.setProperty('background-color', frontColor);
      // initially, hide
      element._style.setProperty('transform', 'scale3d(0, 0, 1)');
      root.appendChild(element);
      return {
        colors: {
          frontColor,
          backColor,
        },
        element
      };
    });

}

function randomPhysics(angle, spread, startVelocity, scrollLeft, originX, originY, vY) {

  const radAngle = angle * (Math.PI / 180);
  const radSpread = spread * (Math.PI / 180);

  const xIncrement = rnd(2) + rnd(10);
  const yIncrement = rnd(2) + rnd(12.5);
  const zIncrement = rnd(2) + rnd(10);

  const { screenScale } = game.objects.view.data;

  return {
    x: 0,
    y: 0,
    vY,
    originX,
    originY,
    scrollLeft,
    wobble: rnd(10),
    velocity: ((startVelocity * 0.5) + rnd(startVelocity)) * (screenScale * 0.5),
    angle2D: -radAngle + (0.5 * radSpread) - rnd(radSpread),
    angle3D: -(Math.PI / 4) + (rnd() * (Math.PI / 2)),
    tiltAngleX: rnd(360),
    tiltAngleY: rnd(360),
    rotateAngle: rnd(360),
    isFlippedOnX: false,
    isFlippedOnY: false,
    xIncrement,
    yIncrement,
    zIncrement,
    transformOrigin1: `${int(rnd(100))}% ${int(rnd(100))}%`,
    transformOrigin2: `${int(rnd(100))}%, ${int(rnd(100))}%`,
    coinToss: rnd() >= 0.5,
    wobbleMultiplier1: 10 + rnd(10),
    wobbleMultiplier2: 10 + rnd(10),
    baseScale: 0.75 + rnd(0.25)
  };

}

function updateFetti(fetti, progress, decay, frameCount) {

  if (!fetti?.physics) return;

  const styleThisFrame = RENDER_AT_60FPS || (frameCount % 2 === 0);

  // DRY
  const fp = fetti.physics;

  fp.x += Math.cos(fp.angle2D) * fp.velocity;
  fp.y += Math.sin(fp.angle2D) * fp.velocity;
  fp.z += Math.sin(fp.angle3D) * fp.velocity;

  fp.wobble += rnd(0.1) * (fp.coinToss ? 1 : -1);

  fp.velocity *= decay;

  fp.y += 1;

  fp.tiltAngleX += (fp.xIncrement * (1 - progress));
  fp.tiltAngleY += (fp.yIncrement * (1 - progress));
  fp.rotateAngle += fp.zIncrement;

  const { x, scrollLeft, y, originX, originY, tiltAngleX, tiltAngleY, rotateAngle, wobble } = fp;

  const wobbleX = (originX + x) + ((scrollLeft - (game.objects.view.data.battleField.scrollLeft || 0)) * game.objects.view.data.screenScale) + (fp.wobbleMultiplier1 * Math.cos(wobble));
  const wobbleY = (originY + y) + (fp.wobbleMultiplier2 * Math.sin(wobble));

  // scale relative to viewport (game) scale
  const baseScale = (fp.baseScale * game.objects.view.data.screenScale * 0.5);

  let scale = baseScale - (progress * baseScale);

  // extra big at first
  if (progress < scaleMagnifier) {
    scale += (baseScale * 2.75 * (scaleMagnifier - progress));
  }

  if (fp.tiltAngleX >= 360) {
    fp.tiltAngleX -= 360;
  } else if (fp.tiltAngleX <= -360) {
    fp.tiltAngleX += 360;
  }

  if (fp.tiltAngleY >= 360) {
    fp.tiltAngleY -= 360;
  } else if (fp.tiltAngleY <= -360) {
    fp.tiltAngleY += 360;
  }

  if (fp.rotateAngle >= 360) fp.rotateAngle -= 360;

  if (styleThisFrame) {
    fetti.element._style.setProperty('transform', `translate3d(${wobbleX}px, ${wobbleY}px, 0) rotateX(${tiltAngleX}deg) rotateY(${tiltAngleY}deg) rotateZ(${rotateAngle}deg) scale3d(${scale}, ${scale}, ${scale})`);
  }

  // first frame?
  if (frameCount === 0) {
    fetti.element._style.setProperty('transform-origin', `${fp.transformOrigin1}, ${fp.transformOrigin2}`);
  }

  // which side is showing?
  let flippedOnX, flippedOnY;

  const angleX = fp.tiltAngleX;
  const angleY = fp.tiltAngleY;

  if ((angleX >= boundary1 && angleX <= boundary2) || (angleX < -boundary1 && angleX > -boundary2)) {
    flippedOnX = true;
  }

  if ((angleY >= boundary1 && angleY <= boundary2) || (angleY < -boundary1 && angleY > -boundary2)) {
    flippedOnY = true;
  }

  // if flipped on both, flipped on neither.
  if (flippedOnX && flippedOnY) {
    flippedOnX = false;
    flippedOnY = false;
  }

  if (fp.isFlippedOnX !== flippedOnX || fp.isFlippedOnY !== flippedOnY) {

    // something changed.
    if (flippedOnX || flippedOnY) {
      if (useOpacity) {
        fetti.element._style.setProperty('opacity', BACK_SIDE_OPACITY);
      } else {
        fetti.element._style.setProperty('background-color', fetti.colors.backColor);
      }
    } else {
      if (useOpacity) {
        fetti.element._style.setProperty('opacity', 1);
      } else {
        fetti.element._style.setProperty('background-color', fetti.colors.frontColor);
      }
    }

    // update state.
    fp.isFlippedOnX = flippedOnX;
    fp.isFlippedOnY = flippedOnY;

  }

}

function animateFetti(root, fettis, decay, callback) {

  // basic lifecycle / active count management

  let tick = 0;

  function animate() {

    let result = update();
    if (RENDER_AT_60FPS) return result;

    /**
     * if running at 30FPS, big hack: do this again,
     * running the math twice but updating CSS only once.
     */
    return update();

  }

  function update() {

    fettis.forEach((fetti) => updateFetti(fetti, tick / totalTicks, decay, tick));

    tick += 1;

    if (tick < totalTicks) return;

    fettis.forEach((fetti) => {
      fetti.element._style = null;
      if (fetti.element.parentNode === root) {
        return root.removeChild(fetti.element);
      }
    });

    activeCount -= fettis.length;
    fettis = [];

    // ensure we only do this once. update() may be called twice on finish.
    if (tick === totalTicks && callback) {
      callback();
    }

    return true;

  }

  return { animate };

}

function confetti(root, {
  originX = 0,
  originY = 0,
  angle = 90,
  decay = 0.92,
  spread = 35,
  startVelocity = 45,
  elementCount = 50,
  scrollLeft = 0,
  colors = COLORS.default,
  backColors = fractionalColors,
  vY = 1 + rnd()
} = {}, callback) {

  if (activeCount + elementCount > maxActiveCount) {
    // "throttling": you only get a few.
    elementCount = Math.max(0, Math.min(5, maxActiveCount - elementCount));
  } else {
    activeCount += elementCount;
  }

  const fettis = createElements(root, elementCount, colors, backColors).map((o) => ({
    element: o.element,
    colors: o.colors,
    physics: randomPhysics(angle, spread, startVelocity, scrollLeft, originX, originY, vY)
  }));

  // { animate }
  return animateFetti(root, fettis, decay, callback);

}

const munitionTypes = {
  [TYPES.bomb]: true,
  [TYPES.gunfire]: true,
  [TYPES.smartMissile]: true
};

function domFettiBoom(source, target, x, y) {

  if (!source?.data) return;

  if (!targetNode) targetNode = document.getElementById('domfetti-overlay');

  const bottomAligned = !!source?.data?.bottomAligned;

  let elementCount = 25 + rnd(25);

  let colorConfig;

  let colorType;

  let sourceType = source?.data?.domFetti?.colorType;
  let targetType = target?.data?.domFetti?.colorType

  /**
   * Hackish: if source is a munition - gunfire, bomb or smart missile - have it inherit the target's colour.
   * i.e., gunfire fragments become yellow on bunkers, green on human helicopter, grey on CPU.
   * This covers the source / target (attacker) case where gunfire calls this method, but it hit e.g., the helicopter.
   */
  if (munitionTypes[source?.data?.type]) {
    colorType = targetType || sourceType;
  } else {
    colorType = sourceType || targetType;
  }

  // special case: certain smart missiles cause more colourful target explosions.
  if (source?.data?.type) {
    if (source.data.type === TYPES.smartMissile && (source.data.isRubberChicken || source.data.isBanana)) {
      colorType = source.data.domFetti?.colorType;
    } else if ((source.data.type === TYPES.helicopter && source.data.dead)) {
      // a helicopter just died.
      colorType = 'default';
    }
  }

  if (COLORS[colorType]) {
    colorConfig = configureColors(COLORS[colorType]);
  }

  const { screenScale } = game.objects.view.data;

  const extraParams = {
    angle: undefined,
    decay: bottomAligned ? 0.935 : (0.8 + rnd(0.15)),
    // sprite X is 0 - 8192px, based on battlefield and scroll.
    // confetti is shown as a full-screen overlay, not scaled; so, account for scroll and scale so things line up.
    originX: (x - game.objects.view.data.battleField.scrollLeft) * screenScale,
    originY: y * screenScale,
    scrollLeft: game.objects.view.data.battleField.scrollLeft || 0,
    startVelocity: 15 + rnd(15),
    spread: 25 + elementCount + rnd(100),
    elementCount: int(elementCount),
    // include any per-object overrides
    ...source.data.domFetti,
    // and calculated colors
    ...colorConfig
  };

  const boom = confetti(targetNode, extraParams, () => boomComplete(targetNode));

  // ensure the target (container node) is visible.
  if (!activeBooms && targetNode) {
    targetNode.style.display = 'block';
  }

  activeBooms++;

  return boom;

}

function boomComplete(rootNode) {

  activeBooms = Math.max(0, activeBooms - 1);

  if (!activeBooms && rootNode) {
    rootNode.style.display = 'none';
  }

}

function screenBoom() {

  const { scrollLeft } = game.objects.view.data.battleField;
  const { browser } = game.objects.view.data;
  const height = 180;
  const { fractionWidth } = browser;

  // middle, left, right
  const sequence = [{
    x: scrollLeft + (fractionWidth * 2 * 3/4),
    y: height
  }, {
    x: scrollLeft + (fractionWidth * 3/4),
    y: height
  }, {
    x: scrollLeft + (fractionWidth * 3 * 3/4),
    y: height
  }];

  // exports-style object structure
  const options = {
    data: {
      domFetti: {
        elementCount: 150,
        spread: 360,
        decay: 0.95,
        startVelocity: 30
      }
    }
  };

  sequence.forEach((item) => {
    game.objects.domFetti.push(domFettiBoom(options, null, item.x, item.y));
  });

}

export {
  configureColors,
  domFettiBoom,
  screenBoom
};