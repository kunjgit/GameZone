import { prefsManager } from '../aa.js';
import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { TYPES, defaultMissileMode, rubberChickenMode, bananaMode } from '../core/global.js';
import { gamePrefs } from './preferences.js';

// recycled from survivor.js
function KeyboardMonitor() {

  let data;
  let keys;
  let events;

  // hash for keys being pressed
  const downKeys = {};

  // meaningful labels for key values
  const keyMap = {
    banana: 66,
    rubberChicken: 67,
    shift: 16,
    ctrl: 17,
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
    missileLauncher: 77,
    tank: 84,
    van: 86,
    smartMissile: 88,
    infantry: 73,
    engineer: 69,
    pause_p: 80,
    flipAutomatically: 70,
    esc: 27,
    enter: 13,
    delete_1: 8,
    delete_2: 46
  };

  const allowedInPause = {
    [keyMap.pause_p]: true,
    [keyMap.esc]: true
  };

  const allowedInChatInput = {
    [keyMap.enter]: true,
    [keyMap.esc]: true
  };

  const altMissiles = {
    [keyMap.banana]: true,
    [keyMap.rubberChicken]: true
  };

  // call out to the helicopter, e.g., ('setMissileLaunching', true)
  const processInput = (player, method, params) => player.callAction(method, params);

  events = {

    keydown(e) {

      // let editor handle keys, unless method returns truthy
      if (game.objects.editor && !game.objects.editor.events.keydown(e)) return;

      if (game.data.paused && !allowedInPause[e.keyCode]) return;

      if (game.objects.view.data.chatVisible && !allowedInChatInput[e.keyCode]) return;

      if (altMissiles[e.keyCode] && !gamePrefs.alt_smart_missiles) return;

      if (!e.metaKey && keys[e.keyCode]?.down) {
        if (!downKeys[e.keyCode]) {
          downKeys[e.keyCode] = true;
          keys[e.keyCode].down(e);
        }
        if (keys[e.keyCode].allowEvent === undefined) {
          return stopEvent(e);
        }
      }

      return true;

    },

    keyup(e) {

      // let editor handle keys, unless method returns truthy
      if (game.objects.editor && !game.objects.editor.events.keyup(e)) return;

      if (game.data.paused && !allowedInPause[e.keyCode]) return;

      if (game.objects.view.data.chatVisible && !allowedInChatInput[e.keyCode]) return;

      if (altMissiles[e.keyCode] && !gamePrefs.alt_smart_missiles) return;

      if (!e.metaKey && downKeys[e.keyCode] && keys[e.keyCode]) {
        downKeys[e.keyCode] = null;
        if (keys[e.keyCode].up) {
          keys[e.keyCode].up(e);
        }
        if (keys[e.keyCode].allowEvent === undefined) {
          return stopEvent(e);
        }
      }

      return true;

    }

  };

  keys = {

    // NOTE: Each function gets an (e) event argument.

    // delete
    [keyMap.delete_1]: {

      down() {

        processInput(game.players.local, 'eject');

      }

    },

    // same as above (TODO: DRY)
    [keyMap.delete_2]: {

      down() {

        processInput(game.players.local, 'eject');

      }

    },

    [keyMap.enter]: {

      down(e) {

        if (game.data.started) {
          game.objects.view.handleChatInput(e);
        }

      }

    },

    [keyMap.shift]: {

      allowEvent: true,

      down() {

        processInput(game.players.local, 'setFiring', true);

      },

      up() {

        processInput(game.players.local, 'setFiring', false);
        
      }

    },

    [keyMap.ctrl]: {

      allowEvent: true,

      down() {

        processInput(game.players.local, 'setBombing', true);

      },

      up() {

        processInput(game.players.local, 'setBombing', false);
        
      }

    },

    [keyMap.space]: {

      down() {

        processInput(game.players.local, 'setParachuting', true);

      },

      up() {

        processInput(game.players.local, 'setParachuting', false);

      }

    },

    [keyMap.missileLauncher]: {

      down() {

        game.objects.inventory.order(TYPES.missileLauncher, undefined, game.players.local);

      }

    },

    [keyMap.tank]: {

      down() {

        game.objects.inventory.order(TYPES.tank, undefined, game.players.local);

      }

    },

    [keyMap.van]: {

      down() {

        game.objects.inventory.order(TYPES.van, undefined, game.players.local);

      }

    },

    [keyMap.banana]: {
      down() {

        // heat-seeking banana
        game.objects.view.setMissileMode(bananaMode);

        processInput(game.players.local, 'setMissileLaunching', true);

      },

      up() {

        processInput(game.players.local, 'setMissileLaunching', false);

      }

    },

    [keyMap.rubberChicken]: {

      down() {

        // heat-seeking rubber chicken
        game.objects.view.setMissileMode(rubberChickenMode);

        processInput(game.players.local, 'setMissileLaunching', true);

      },

      up() {

        processInput(game.players.local, 'setMissileLaunching', false);

      }

    },

    [keyMap.smartMissile]: {

      down() {

        // standard heat-seeking missile
        game.objects.view.setMissileMode(defaultMissileMode);

        processInput(game.players.local, 'setMissileLaunching', true);

      },

      up() {

        processInput(game.players.local, 'setMissileLaunching', false);

      }

    },

    [keyMap.engineer]: {

      down() {

        game.objects.inventory.order(TYPES.engineer, undefined, game.players.local);

      }

    },

    [keyMap.infantry]: {

      down() {

        game.objects.inventory.order(TYPES.infantry, undefined, game.players.local);

      }

    },

    [keyMap.esc]: {

      down(e) {

        if (game.objects.view.data.chatVisible) {
          game.objects.view.handleChatInput(e);
        } else {
          prefsManager.toggleDisplay();
        }

      }

    },

    [keyMap.pause_p]: {

      down() {

        game.togglePause();

      }
  
    },

    [keyMap.flipAutomatically]: {

      down() {
        
        game?.players?.local.toggleAutoRotate();
  
      }

    }

  };

  function isDown(labelOrCode) {

    // check for a pressed key based on '37' or 'left', etc.
    return (keyMap[labelOrCode] !== undefined ? downKeys[keyMap[labelOrCode]] : downKeys[labelOrCode]);

  }

  function releaseAll() {

    // reset all pressed key states.
    for (let item in downKeys) {
      if (downKeys[item]) {
        // simulate the keyup event
        events.keyup({
          keyCode: item
        });
      }
    }

  }

  function attachEvents() {

    utils.events.add(document, 'keydown', events.keydown);
    utils.events.add(document, 'keyup', events.keyup);

  }

  function stopEvent(e) {

    const evt = e || window.event;
  
    if (evt.preventDefault !== undefined) {
      evt.preventDefault();
    } else {
      evt.cancelBubble = true;
    }
  
    return false;
  
  }  

  function initKeyboardMonitor() {

    if (data.didInit) return;

    data.didInit = true;

    attachEvents();

  }

  data = {
    didInit: false
  };

  return {

    init: initKeyboardMonitor,
    isDown,
    keydown: events.keydown,
    keyMap,
    keyup: events.keyup,
    releaseAll

  };

}

export { KeyboardMonitor };