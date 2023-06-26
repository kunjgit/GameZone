// phones, tablets and non-desktop-type devices
import { utils } from '../core/utils.js';
import { game } from '../core/Game.js';
import { TYPES } from '../core/global.js';

function getLandscapeLayout() {

  // notch position guesses, as well as general orientation.
  let notchPosition;

  if ('orientation' in window) {

    // Mobile
    if (window.orientation === 90) {
      notchPosition = 'left';
    } else if (window.orientation === -90) {
      notchPosition = 'right';
    }

  } else if ('orientation' in window.screen) {

    // Webkit
    if (window.screen.orientation.type === 'landscape-primary') {
      notchPosition = 'left';
    } else if (window.screen.orientation.type === 'landscape-secondary') {
      notchPosition = 'right';
    }

  }

  return notchPosition;

}

function orientationChange() {

  // primarily for handling iPhone X, and position of The Notch.
  // apply CSS to <body> per orientation, and iPhone-specific CSS will handle the padding.

  // DRY
  const body = document.body;
  const add = utils.css.add;
  const remove = utils.css.remove;

  const atLeft = 'notch-at-left';
  const atRight = 'notch-at-right';

  const notchPosition = getLandscapeLayout();

  // inefficient/lazy: remove both, apply the active one.
  remove(body, atLeft);
  remove(body, atRight);

  if (notchPosition === 'left') {
    add(body, atLeft);
  } else if (notchPosition === 'right') {
    add(body, atRight);
  }

  // helicopters need to know stuff, too.
  const helicopter = game.objects[TYPES.helicopter];

  if (helicopter?.length) {
    helicopter[0]?.refreshCoords(true);
    helicopter[1]?.refreshCoords();
  }

}

export {
  getLandscapeLayout,
  orientationChange
};