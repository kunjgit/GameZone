import { utils } from '../core/utils.js';
import { game } from '../core/Game.js';
import { debug } from '../core/global.js';
import { snowStorm } from '../lib/snowstorm.js';

function Joystick(options) {

  let css, data, dom, exports;

  css = {
    enabled: 'enabled',
    joystick: 'joystick',
    joystickPoint: 'joystick-point',
    active: 'joystick-active'
  };

  data = {
    active: false,
    oJoystickWidth: null,
    oJoystickHeight: null,
    oPointWidth: null,
    oPointHeight: null,
    oPointer: null,
    start: {
      x: null,
      y: null
    },
    lastMove: {
      clientX: 0,
      clientY: 0
    },
    inertia: {
      vX: 0,
      vY: 0,
    },
    pointer: {
      // percentages
      x: 50,
      y: 50,
    },
    // linear acceleration / deceleration
    easing: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1],
    tweenFrame: 0,
    tweenFrames: [],
  };

  dom = {
    o: null,
    oJoystick: null,
    oPoint: null,
  };

  const getEvent = e => {
    // TODO: improve normalization of touch events.
    const evt = (e.changedTouches && e.changedTouches[e.changedTouches.length - 1]) || e;
    return evt;
  };

  function moveContainerTo(x, y) {
    const targetX = x - (data.oJoystickWidth / 2);
    const targetY = y - (data.oJoystickHeight / 2);
    dom.oJoystick.style.setProperty('left', `${targetX}px`);
    dom.oJoystick.style.setProperty('top', `${targetY}px`);
  }

  function resetPoint() {
    dom.oPoint.style.setProperty('left', '50%');
    dom.oPoint.style.setProperty('top', '50%');
  }

  function start(e) {

    if (data.active) return;

    data.active = true;

    const evt = getEvent(e);

    data.start.x = evt.clientX;
    data.start.y = evt.clientY;

    // reposition joystick underneath mouse coords
    moveContainerTo(data.start.x, data.start.y);

    // re-center the "nub".
    resetPoint();

    // show joystick UI
    utils.css.add(dom.oJoystick, css.active);

    // stop touch from causing scroll, too?
    if (e.preventDefault) e.preventDefault();
    if (evt.preventDefault) evt.preventDefault();

  }

  function makeTweenFrames(from, to) {

    const frames = [];

    // distance to move in total
    const deltaX = to.x - from.x;
    const deltaY = to.y - from.y;

    // local copy of start coords, track position
    let x = parseFloat(from.x);
    let y = parseFloat(from.y);

    // create array of x/y coordinates
    for (let i = 0, j = data.easing.length; i < j; i++) {
      // move % of total distance
      x += (deltaX * data.easing[i] * 0.01);
      y += (deltaY * data.easing[i] * 0.01);
      frames[i] = {
        x,
        y
      };
    }

    return frames;

  }

  function distance(p1, p2) {
    let x1, y1, x2, y2;
    x1 = p1[0];
    y1 = p1[1];
    x2 = p2[0];
    y2 = p2[1];
    // eslint recommends exponentation ** vs. Math.pow(), but ** is Chrome 52+ and not even in IE AFAIK. 😂
    // eslint-disable-next-line no-restricted-properties
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  }

  // circle math hat-tip: duopixel
  // https://stackoverflow.com/a/8528999

  function limit(x, y) {
    const halfWidth = data.oJoystickWidth / 2;
    const halfHeight = data.oJoystickHeight / 2;
    const radius = halfWidth;
    const center = [halfWidth, halfHeight];
    const dist = distance([x, y], center);

    if (dist <= radius) {
      return {
        x,
        y
      };
    }

    x -= center[0];
    y -= center[1];

    const radians = Math.atan2(y, x);

    return {
      x: (Math.cos(radians) * radius) + center[0],
      y: (Math.sin(radians) * radius) + center[1]
    };

  }

  function movePoint(x, y) {
    dom.oPoint.style.setProperty('left', `${x}%`);
    dom.oPoint.style.setProperty('top', `${y}%`);
  }

  function setDirection(x, y) {

    const from = {
      x: (data.pointer.x / 100) * game.objects.view.data.browser.width,
      y: (data.pointer.y / 100) * game.objects.view.data.browser.height
    };

    // x/y are relative to screen
    const to = {
      x: (x / 100) * game.objects.view.data.browser.width,
      y: (y / 100) * game.objects.view.data.browser.height
    };

    data.tweenFrames = makeTweenFrames(from, to);

    // tween can change while animating, i.e. mouse constantly moving.
    // update tween in-place, when this happens.
    if (data.tweenFrame >= data.tweenFrames.length) {
      data.tweenFrame = 0;
    } else if (data.tweenFrame > 5) {
      // allow tween to "rewind" slightly, but stay on upward motion curve.
      // this keeps motion relatively fast during repeated touchmove() events.
      data.tweenFrame--;
    }

  }

  function move(e) {

    // ignore if joystick isn't being dragged.
    if (!data.active) return;

    // ignore while respawning.
    if (data.respawning) return;

    const evt = getEvent(e);

    data.lastMove.clientX = evt.clientX;
    data.lastMove.clientY = evt.clientY;

    const halfWidth = data.oJoystickWidth / 2;
    const halfHeight = data.oJoystickHeight / 2;

    // calculate, limit between 0 and width/height.
    const relativeX = Math.max(0, Math.min(halfWidth - (data.start.x - evt.clientX), data.oJoystickWidth));
    const relativeY = Math.max(0, Math.min(halfHeight - (data.start.y - evt.clientY), data.oJoystickHeight));

    const coords = limit(relativeX, relativeY);

    // limit point to circle coordinates.
    movePoint(coords.x, coords.y);

    // set relative velocities based on square.
    setDirection(relativeX, relativeY);

    // snowstorm? send over "mouse move" equivalent
    if (snowStorm.active) {
      snowStorm.mouseMove(evt);
    }

  }

  function end() {
    if (data.active) {
      utils.css.remove(dom.oJoystick, css.active);
      data.tweenFrame = 0;
      data.active = false;
    }
  }

  function refresh() {
    data.oJoystickWidth = dom.oJoystick.offsetWidth;
    data.oJoystickHeight = dom.oJoystick.offsetHeight;
    data.oPointWidth = dom.oPoint.offsetWidth;
    data.oPointHeight = dom.oPoint.offsetHeight;
  }

  function addEvents() {

    // for testing from desktop
    if (debug) {
      utils.events.add(document, 'mousedown', start);
      utils.events.add(document, 'mousemove', move);
      utils.events.add(document, 'mouseup', end);
    }

    utils.events.add(window, 'resize', refresh);

  }

  function initDOM() {
    // create joystick and inner point.
    dom.o = (options && options.o) || document.body;

    dom.oPointer = document.getElementById('pointer');
    utils.css.add(dom.oPointer, css.enabled);

    const oJoystick = document.createElement('div');
    oJoystick.className = css.joystick;

    const oPoint = document.createElement('div');
    oPoint.className = css.joystickPoint;

    oJoystick.appendChild(oPoint);

    dom.o.appendChild(oJoystick);

    dom.oJoystick = oJoystick;
    dom.oPoint = oPoint;

  }

  function setInitialPosition() {

    // update inner state
    data.pointer.x = game.objects.view.data.browser.width * 0.5;
    data.pointer.y = game.objects.view.data.browser.height * 0.5;

    dom.oPointer.style.transform = `translate3d(${data.pointer.x}px, ${data.pointer.y}px, 0px)`;
    
  }

  function animate() {

    // only move if joystick is active.
    // i.e., stop any animation on release.
    if (!data.active) return;

    const frame = data.tweenFrames && data.tweenFrames[data.tweenFrame];

    if (!frame) return;

    dom.oPointer.style.transform = `translate3d(${frame.x}px, ${frame.y}px, 0px)`;

    // update inner state
    data.pointer.x = (frame.x / game.objects.view.data.browser.width) * 100;
    data.pointer.y = (frame.y / game.objects.view.data.browser.height) * 100;

    // next!
    data.tweenFrame++;

    if (exports.onSetDirection) {
      exports.onSetDirection(data.pointer.x, data.pointer.y);
    }

  }

  function init() {
    initDOM();
    addEvents();
    // get initial coords
    refresh();
    setInitialPosition();
  }

  init();

  exports = {
    animate,
    data,
    start,
    move,
    end
  };

  return exports;

}

export { Joystick }