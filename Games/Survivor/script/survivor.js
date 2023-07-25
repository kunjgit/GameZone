/** @license
 *
 * SURVIVOR: A HTML + CSS + JavaScript prototype
 * based on the Commodore 64 version of Survivor from 1983
 * -------------------------------------------------------
 * http://schillmania.com/survivor/
 * http://www.schillmania.com/content/entries/2012/survivor-c64-html-remake/
 * http://www.flickr.com/photos/schill/sets/72157628885315581/
 * https://github.com/scottschiller/SURVIVOR
 *
 * Scott Schiller wrote this beginning in December 2011, while on a plane to Hawaii.
 * Code provided under the Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0) License:
 * http://creativecommons.org/licenses/by-nc/3.0/
 *
 */

// 7.02.2018: Move to appeasing the eslint gods. Prevent HTML5 Audio() on Safari because performance dies. CSS clean-up, -webkit- prefix cruft clean-up etc.
// 8.16.2014: The jslint gods have been re-appeased. Added strict mode.
// 5.25.2013: The jslint gods have been appeased.

/*global window, console, document, navigator, setTimeout, setInterval, clearInterval, soundManager */

/**
 *
 * The TODO: list (written on an old laptop while on a plane to Hawaii, 12/21/2011)
 * --------------------------------------------------------------------------------
 *
 * Map (grid) of space
 * -------------------
 *
 * Main UI
 * -------
 *  - ship always in center
 *  - inertia? some inertia.
 *  - slight parallax on background stars? maybe a blur/streak effect? why not.
 *  - fixed screen size, center or no?
 *  - fixed grid item size? 20x20px?
 *  - world should be able to wrap around. Draw in tiles?
 *  - debug mode should show outlines, overlays, collision detection etc. in CSS.
 *
 * Collision detection
 * -------------------
 *  - player vs. bricks, bad guys, gunfire (= death)
 *  - x/y + vector -> row/col? player can occupy potentially 4 grid spaces at once with overlap?
 *  - when in a row/column, determine exactly what is in contact. isOverlappingGrid({x, y, row, col}) or somesuch.
 *  - spaceballs should reverse course and randomly flip the other axis when they hit a boundary (wall, or another spaceball.)
 *  - bad guys only collide with spaceship. absolutely-positioned for everything else.
 *
 * Graphic elements
 * ----------------
 *  - blocks
 *  - "bases" (structures which hold turrets)
 *  - turrets themselves
 *  - turret gunfire
 *  - bad guys
 *  - spaceballs
 *
 * Things that move, object collision etc.
 * ---------------------------------------
 *  - blocks (can be shot, disappear)
 *  - bad guys
 *  - spaceballs (immune to shots, move randomly)
 *  - turret gunfire
 *
 * Sound effects
 * -------------
 *  - welcome screen "flight of the valkyries" music?
 *  - initial game start / "warp" sound
 *  - spaceship thrust
 *  - bad guy cartoon noises (one per bad guy? simultaneous allowed?)
 *  - bad guy single-frozen-note death sound
 *  - box shot/popping sounds (incremental sounds?)
 *  - ship explosion noise
 *  - base explosion (60 Hz, louder, BOOM) sound
 *  - background pulse noise set to "frame rate" of level
 *
 * UI considerations
 * -----------------
 *  - mobile, iOS: No sound, or single-channel sound hack?
 *  - touch controls - finger on screen = direction? circle-based joystick UI?
 *  - touch controls - fire button, smartbomb button?
 *
 * Game logic
 * ----------
 *  - intro screen, retro font etc.?
 *  - ability to choose start level?
 *  - begin game: startGame({ level: x, lives: y, smartbombs: z }); ?
 *  - points/scoring? who cares?
 *  - level finished animation sequence - large explosions, show next "level X" screen etc.
 *
 * BEHAVIOURS
 * ----------
 *  - gunfire
 *    + from turret, fixed target distance and speed
 *    + once target is reached, fires again (any delay?)
 *    + collides only with spaceship
 *  - base
 *    + explodes once all turrets are shot out
 *    + noise, animation, increases points, increases game speed(?)
 *  - spaceballs
 *    + wander aimlessly around the world
 *    + bounce off walls and each other
 *    + collision logic: see above, or spaceship (death)
 *    + absorb spaceship fire? turret gunfire?
 *  - bad guys
 *    + show up at random intervals, depending on level/difficulty?
 *    + start randomly off-screen, seek out player
 *    + jittery motion (animation) and movement
 *    + bird, face, "X", ?
 *  - squares/boxes ("building blocks")
 *    + form walls around bases
 *    + worth some points(?)
 *    + take two hits
 *    + increase global "box pop" sound when hit, eventually resets
 *    + collide with spaceship, kill on contact
 *    + a few different box designs
 *    + up to 4 frames of animation
 */

var survivor;

(function(window) {

'use strict';

if (window.console === undefined) {
  // hax
  window.console = {
    log: function() {
      return false;
    }
  };
}

var IS_MUTED = window.location.href.toString().match(/mute/i);
var winloc = window.location.toString();

/**
 * Safari performance dies when playing multiple HTML5 <audio> / Audio() objects on desktop.
 * So, audio is disabled by default. This has been a problem since 2013.
 * https://bugs.webkit.org/show_bug.cgi?id=116145
 */
var isSafari = (
  navigator.userAgent.match(/safari/i)
  && !navigator.userAgent.match(/chrome/i)
  && !window.location.toString().match(/forceaudio/i)
);

var utils = {

  array: (function() {

    function compare(property) {

      var result;

      return function(a, b) {

        if (a[property] < b[property]) {
          result = -1;
        } else if (a[property] > b[property]) {
          result = 1;
        } else {
          result = 0;
        }
        return result;
      };

    }

    function shuffle(array) {

      // Fisher-Yates shuffle algo

      var i, j, temp;

      for (i = array.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }

      return array;

    }

    return {
      compare: compare,
      shuffle: shuffle
    };

  }()),

  css: (function() {

    function hasClass(o, cStr) {

      // modern
      if (o && o.classList) {
        return o.classList.contains(cStr);
      }
      // legacy
      return (o.className !== undefined ? new RegExp('(^|\\s)' + cStr + '(\\s|$)').test(o.className) : false);

    }

    function addClass(o, cStr) {

      if (o && o.classList) {
        o.classList.add(cStr);
        return;
      }

      if (!o || !cStr || hasClass(o, cStr)) return;
      o.className = (o.className ? o.className + ' ' : '') + cStr;

    }

    function removeClass(o, cStr) {

      if (o && o.classList) {
        o.classList.remove(cStr);
        return;
      }

      if (!o || !cStr || !hasClass(o, cStr)) return;
      o.className = o.className.replace(new RegExp('( ' + cStr + ')|(' + cStr + ')', 'g'), '');

    }

    function swapClass(o, cStr1, cStr2) {

      if (o && o.classList) {
        if (cStr1 !== undefined && cStr1 !== null && cStr1.length) o.classList.remove(cStr1);
        if (cStr2 !== undefined && cStr2 !== null && cStr2.length) o.classList.add(cStr2);
        return;
      }

      var tmpClass = {
        className: o.className
      };

      removeClass(tmpClass, cStr1);
      addClass(tmpClass, cStr2);

      o.className = tmpClass.className;

    }

    function toggleClass(o, cStr) {

      (hasClass(o, cStr) ? removeClass : addClass)(o, cStr);

    }

    return {
      has: hasClass,
      add: function(o, className) {
        // accept space-delimited classNames, but each item
        // needs to be added via o.classNames.add() one at a time.
        if (!className) return;
        var classNames = className.split(' ');
        for (var i = 0, j = classNames.length; i < j; i++) {
          addClass(o, classNames[i]);
        }
      },
      remove: removeClass,
      swap: swapClass,
      toggle: toggleClass
    };

  }()),

  events: (function() {

    var add, remove, preventDefault;

    add = (window.addEventListener !== undefined ? function(o, evtName, evtHandler) {
      return o.addEventListener(evtName, evtHandler, false);
    } : function(o, evtName, evtHandler) {
      o.attachEvent('on' + evtName, evtHandler);
    });

    remove = (window.removeEventListener !== undefined ? function(o, evtName, evtHandler) {
      return o.removeEventListener(evtName, evtHandler, false);
    } : function(o, evtName, evtHandler) {
      return o.detachEvent('on' + evtName, evtHandler);
    });

    preventDefault = function(e) {
      if (e.preventDefault) {
        e.preventDefault();
      } else {
        e.returnValue = false;
        e.cancelBubble = true;
      }
    };

    return {
      add: add,
      preventDefault: preventDefault,
      remove: remove
    };

  }())

};

function Survivor() {

  // internal reference
  var game,
      gameData,
      gameDom,
      gameObjects,
      mapTypes,
      mapData,
      isIE = navigator.userAgent.match(/msie/i),
      oldIE = navigator.userAgent.match(/msie 6/i),

      // adds debug elements to the grid, UI etc.
      DEBUG_MODE = (winloc.match(/debug/i)),

      // ?profile=1, ?profiling=1, whatever.
      PERFORMANCE_MODE = (winloc.match(/profil/i)),

      /**
       * Chrome-specific GPU-accelerated positioning (vs .style.left + .style.top) and compositing / layer promotion
       * Safari didn't like this so much back in 2012, now enabled by default.
       * Explicit override: #notransform to disable.
       */
      USE_TRANSFORM = (!winloc.match(/notransform/i)),

      /**
       * Additional: translate3d() for block / world pulse effect, attempt at GPU compositing / reducing paints. Step-based keyframe animations for pulse effect, as well.
       * Performs worse as of 06/2013, presumably due to doubled number of DOM elements (~1100) and thus expensive "recalculate style" work.
       * Related screenshot: http://flic.kr/p/eHbgpf
       */
      USE_EXPERIMENTAL_TRANSFORM = (winloc.match(/experimentaltransform/i)),

      DEFAULT_LIVES = 3,
      DEFAULT_SMARTBOMBS = 3,
      DEFAULT_HOME_ROW = 20,
      DEFAULT_HOME_COL = 8,
      DEFAULT_SPACEBALLS = 8,

      spaceBallTemplate,
      spaceBallCounter = 0,
      audioPitchCounter = 0,
      audioPitchCounterMax = 15,
      audioBoomScale = [0,0,1,2,2,3,4,4,5,6,6,7,8,8,9,10],
      lastAudioIncrement = new Date(),
      audioIncrementThrottle = 333,

      /**
      * NOTE: UTF-8 character encoding required for map parsing to work.
      * reference: http://en.wikipedia.org/wiki/Box-drawing_characters
      * empty space inside walls is marked by a period character - "."
      * space inside bases, not safe to be occupied is marked by a middle dot - Georgian comma (&middot;) - "·"
      */

      MAP_FREE_SPACE_CHAR = ' ',
      MAP_ALT_FREE_SPACE_CHAR = '_',
      MAP_INSIDE_BASE_CHAR = '·';

  // var MAP_INSIDE_WALLS_CHAR = '.';

  mapData = [
    '                                                                         ',
    '                                                                         ',
    '    000000000000000000000000000                                          ',
    '    000000000000000000000000000                                          ',
    '    00.......................00                                          ',
    '    00.......................00                                          ',
    '    00..............┏┻━┓.....00            333333333333333333            ',
    '    00.........┏┻━━┻┛┏━┛.....00           33333333333333333333           ',
    '    00...┏┻┓...┃·····┣.......00          33..................33          ',
    '    00...┗┓┗┻━┻┛·····┗━┓.....00         33....................33         ',
    '    00....┫┏━━━━┓····┏━┛.....00        33.......╔╩╗............33        ',
    '    00....┃┃....┫····┣.......00       33........╚╗╚═╩═╩╗........33       ',
    '    00....┫┗┓┏━━┛····┗━┓.....0033333333..........╣╔╦╗··╠.........33      ',
    '    00....┗━┛┃·┏━┳━┳┓┏┳┛.....0033333333.........╔╝│.│╔╦╝.........33      ',
    '    00.......┗┳┛....┗┛.......00       33........╚╦╝.╚╝..........33       ',
    '    00.......................00        33......................33        ',
    '    00.......................00         33....................33         ',
    '    000000000000000000000000000          33..................33          ',
    '    000000000000000000000000000           33333333333333333333           ',
    '          00                               333333333333333333            ',
    '          00                                            33               ',
    '          00                                            33               ',
    '          11                                            33               ',
    '          11                                            33               ',
    '          11                               2            222              ',
    '          11                              222           2222             ',
    '          11                             22.22         22..22            ',
    '         111                            22...22       22....22           ',
    '        11.11                          22.....22     22......22          ',
    '       11...11                        22.......22   22........22         ',
    '      11.....11                      22.........22222..........22        ',
    '     11.┌┐.┌┐.11                    22..╓╨─╨╖╓╨╖.222..╓╖........22       ',
    '    11.┌┘└┴┘└┐.11                  22...╢·╓─╜╙╖╙╖...╓╨╜╟.........22      ',
    '   11..└┐···┌┘..11                22....╙╖╟···╙╖╙╨─╨╜╓─╜..........22     ',
    '  11....┤···├....11111           22......╢║····╢·····╟.............22    ',
    '  11...┌┘···└┐.....111111111111222.......║╟····║·····╙──╖...........22   ',
    '   11..┤┌┬-┬┐├..111111111111111222.......╢╙────╜········╟............22  ',
    '    11.└┘...└┘.11                22....╓─╜·╓╥╖·······╓──╜...........22   ',
    '     11.......11                  22...╙╖··║.║·······╟.............22    ',
    '      11.....11                    22...╢╓─╜.║·╓╥─╥╖·╙─╖..........22     ',
    '       11...11                      22..╙╜...╙╥╜...╙─╥╖╟.........22      ',
    '        11.11                        22...........222.╙╜........22       ',
    '         111                          22.........22222.........22        ',
    '          1                            22...2...22   22...2...22         ',
    '                                        22.222.22     22.222.22          ',
    '                                         222 222       222 222           ',
    '                                          2   2         2   2            ',
    '                                                                         ',
    '                                                                         '
  ];

      // for transform-based window scrolling vs. traditional scrolling, transform() may be faster under Firefox
      // (but causes some visual glitches in Webkit)
      // is_firefox = !!(navigator.userAgent.match(/firefox/i));

  gameObjects = {

    // instances of controllers, major objects and so forth
    baseController: null,
    badGuyController: null,
    blockController: null,
    gameLoop: null,
    focusMonitor: null,
    keyboardMonitor: null,
    levelEndSequence: null,
    mapData: null,
    gameController: null,
    ship: null,
    shipGunfireMap: null,
    smartbombController: null,
    statsController: null,
    turretGunfireMap: null,
    badGuyMap: null,
    badGuys: [],
    screen: null,
    spaceBalls: [],
    spaceBallMap: null

  };

  gameData = {

    map: [],
    NODE_WIDTH: 32,
    NODE_HEIGHT: 32,
    world_width: 0,
    world_height: 0,
    world_cols: 0,
    world_rows: 0

  };

  // special case: inner <div> for transform: translate3d() GPU-accelerated sprite animation.
  var itemTemplate = document.createElement('div');
  var innerNode;

  gameDom = {

    gridItemTemplate: itemTemplate,
    world: document.getElementById('world'),
    worldContainer: document.getElementById('world-container'),
    worldFragment: document.createDocumentFragment()

  };

  if (USE_EXPERIMENTAL_TRANSFORM) {
    innerNode = document.createElement('div');
    innerNode.className = 'transform-sprite';
    itemTemplate.appendChild(innerNode);
    gameDom.world.className = 'use-experimental-transforms';
  }

  // for internal reference
  game = {

    data: gameData,
    dom: gameDom,
    objects: gameObjects

  };

  function getAudioPitch() {
    return Math.floor(audioPitchCounter);
  }

  function incrementAudioPitch() {
    // throttle audible pitch increase calls
    var now = new Date();
    if (now - lastAudioIncrement > audioIncrementThrottle) {

      lastAudioIncrement = now;
      audioPitchCounter += 0.5;
      if (audioPitchCounter >= audioPitchCounterMax) {
        audioPitchCounter = 0;
      }
    }
    return getAudioPitch();
  }

  var soundSprites;

  soundSprites = {

    popSpriteCounter: 0,
    popSpriteCounterMax: 4,
    boomSpriteCounter: 0,
    boomSpriteCounterMax: 4,

    playBoom: function(scale) {

      var sID = 'boom-sprite-' + soundSprites.boomSpriteCounter;

      soundManager.play(sID, {
        from: (scale * 1000),
        to: (scale * 1000) + 750
      });

      soundSprites.boomSpriteCounter++;

      if (soundSprites.boomSpriteCounter >= soundSprites.boomSpriteCounterMax) {
        soundSprites.boomSpriteCounter = 0;
      }

    },

    playPop: function(audioPitch) {

      soundManager.play('pop-sprite-' + soundSprites.popSpriteCounter, {
        from: (audioPitch * 400) - 10,
         to: (audioPitch * 400) + 350
      });

      soundSprites.popSpriteCounter++;

      if (soundSprites.popSpriteCounter >= soundSprites.popSpriteCounterMax) {
        soundSprites.popSpriteCounter = 0;
      }

    }

  };

  var features;

  var testDiv = document.createElement('div');

  features = (function() {

    var getAnimationFrame;

    /**
     * hat tip: paul irish
     * http://paulirish.com/2011/requestanimationframe-for-smart-animating/
     * https://gist.github.com/838785
     */

    var _animationFrame = (window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        null);

    // apply to window, avoid "illegal invocation" errors in Chrome
    getAnimationFrame = _animationFrame ? function() {
      return _animationFrame.apply(window, arguments);
    } : null;

    if (!getAnimationFrame) {
      console.warn('No window.requestAnimationFrame() or equivalent?');
    }

    var transform, styles, prop;

    function has(propString) {

      // test for feature support
      var result = testDiv.style[propString];
      return (result !== undefined ? propString : null);

    }

    // note local scope.
    var localFeatures = {

      audio: false, // set later via SM2

      opacity: (function() {
        try {
          testDiv.style.opacity = '0.5';
        } catch(e) {
          return false;
        }
        return true;
      }()),

      transform: {
        ie: has('-ms-transform'),
        moz: has('MozTransform'),
        opera: has('OTransform'),
        webkit: has('webkitTransform'),
        w3: has('transform'),
        prop: null // the normalized property value
      },

      rotate: {
        has3D: false,
        prop: null
      },

      getAnimationFrame: getAnimationFrame

    };

    localFeatures.transform.prop = (
      localFeatures.transform.w3 ||
      localFeatures.transform.moz ||
      localFeatures.transform.webkit ||
      localFeatures.transform.ie ||
      localFeatures.transform.opera
    );

    function attempt(style) {

      try {
        testDiv.style[transform] = style;
      } catch(e) {
        // that *definitely* didn't work.
        return false;
      }
      // if we can read back the style, it should be cool.
      return !!testDiv.style[transform];

    }

    if (localFeatures.transform.prop) {

      // try to derive the rotate/3D support.
      transform = localFeatures.transform.prop;
      styles = {
        css_2d: 'rotate(0deg)',
        css_3d: 'rotate3d(0,0,0,0deg)'
      };

      if (attempt(styles.css_3d)) {
        localFeatures.rotate.has3D = true;
        prop = 'rotate3d';
      } else if (attempt(styles.css_2d)) {
        prop = 'rotate';
      }

      // soundManager._wD('Has 3D rotate: '+localFeatures.rotate.has3D);

      localFeatures.rotate.prop = prop;

    }

    console.log('user agent feature test:', localFeatures);

    return localFeatures;

  }());

  var _slice = Array.prototype.slice;

  function mixin(oMain, oAdd) {

    // non-destructive merge
    var o1 = {}, i, o2, o;

    // clone c1
    for (i in oMain) {
      if (oMain.hasOwnProperty(i)) {
        o1[i] = oMain[i];
      }
    }

    o2 = (oAdd === undefined ? {} : oAdd);
    for (o in o2) {
      if (o2.hasOwnProperty(o) && o1[o] === undefined) {
        o1[o] = o2[o];
      }
    }
    return o1;

  }

  function makeGridItem(oOptions) {

    var o,
        x, y,
        type, subType/*,
        oNode = oOptions.node*/;

    x = oOptions.x;
    y = oOptions.y;
    type = oOptions.type;
    subType = oOptions.subType;

    o = game.dom.gridItemTemplate.cloneNode(true);

    o.style.left = (game.data.NODE_WIDTH * x) + 'px';
    o.style.top = (game.data.NODE_HEIGHT * y) + 'px';

    o.className = type + ' ' + subType;

    return o;

  }

  function animateSpaceBalls() {

    var i, j, k, l;

    for (i = 0, j = game.objects.spaceBalls.length; i < j; i++) {
      game.objects.spaceBalls[i].animate();
    }

    // also do "own" collision check
    for (i = 0, j = game.objects.spaceBalls.length; i < j; i++) {

      for (k = 0, l = game.objects.spaceBalls.length; k < l; k++) {

        // don't compare against self...
        if (k !== i && game.objects.spaceBalls[i].data.row === game.objects.spaceBalls[k].data.row && game.objects.spaceBalls[i].data.col === game.objects.spaceBalls[k].data.col) {

          // console.log('spaceball vs. spaceball!');
          game.objects.spaceBalls[i].bounce();
          break;

        }

      }

    }

  }

  function GameLoop() {

    // the timer and main loop which drives everything

    var counter = 0;
    var oStats;
    var fpsCounter = 0;
    var heartbeatCounter = 0;
    var lastExec = new Date();

    var css, data, events, getNextFrame;

    css = {

      phase0: '', // default state
      phase1: 'phase-1',
      phase2: 'phase-2',
      phase3: 'phase-3',
      phase4: 'phase-4'

    };

    data = {

      GAME_SPEED: 1, // the game speed multiplier
      loopTimer: null,
      loopInterval: 1000 / 33, // aim for 33 fps
      lastPhase: null,
      pulseCount: 0,
      pulseStage: 0,
      pulsePhases: 4,
      pulseTimer: null, // will inherit default
      pulseIntervals: {
        stage0: 500,
        stage1: 366.67,
        stage2: 233.33,
        stage3: 100
      },
      speedMultiplier: 1,
      speedMultipliers: {
        stage0: 1,
        stage1: 1.1,
        stage2: 1.2,
        stage3: 1.3
      },
      statsTimer: null,
      statsInterval: 1000

    };

    events = {

      loop: function() {

        /*
        var now = new Date();

        if (now - lastExec < data.loopThrottle) {
          // exit if this loop is running too fast
          return false;
        }

        lastExec = now;
        */

        // based on game state, animate or wait for input or ?
        counter++;
        fpsCounter++;

        if (game.objects.levelEndSequence.data.active) {

          game.objects.levelEndSequence.animate();
          return;

        }

        game.objects.ship.animate();

        if (counter % 5 === 0) {
          game.objects.ship.maybeFire();
        }

        game.objects.baseController.events.animate();

        game.objects.badGuyController.animate();

        game.objects.blockController.animate();

        game.objects.smartbombController.animate();

        // don't animate certain objects if ship is exploding (dying/dead)
        // if (game.objects.ship.isAlive()) {

          animateSpaceBalls();

        // }

      },

      pulse: function() {

        var currentPhase;

        // don't animate the world if the ship is dying/dead.
        if (!game.objects.ship.isAlive()) {
          return;
        }

        // the world heartbeat, per se.
        data.pulseCount++;

        if (data.pulseCount >= data.pulsePhases) {
          data.pulseCount = 0;
        }

        currentPhase = css['phase' + data.pulseCount];

        // only include experimental check if using className changes vs. CSS animation.
        if (!oldIE /*&& !USE_EXPERIMENTAL_TRANSFORM*/) {
          utils.css.swap(game.dom.world, data.lastPhase, currentPhase);
        }

        data.lastPhase = currentPhase;

        if (heartbeatCounter % 2 === 0) {

          if (features.audio) {

            soundManager.play('heartbeat');

          }

          game.objects.baseController.events.pulse();

        }

        heartbeatCounter++;

      },

      statsUpdate: function() {

        var fpsCount = parseInt(fpsCounter, 10);

        if (oStats) {
          oStats.innerHTML = (!isNaN(fpsCount) ? fpsCount : 'N/A');
        }

        // data.GAME_SPEED = (fpsCount >= 15 ? 1 : 15 / fpsCount);

        fpsCounter = 0;

      }

    };

    function refreshAnimationCallback() {

      var now = new Date(),
          delta = now - lastExec;

      if (data.loopTimer) {
        // repeat the process
        getNextFrame();
      }

      if (delta >= data.loopInterval) {

        lastExec = now;

        // do work, son
        events.loop();

      }

    }

    getNextFrame = function() {

      (window.requestAnimationFrame || features.getAnimationFrame)(refreshAnimationCallback);

    };

    function stopPulse() {

      if (data.pulseTimer) {
        window.clearInterval(data.pulseTimer);
        data.pulseTimer = null;
      }

    }

    function getPulseStage() {

      return data.pulseStage;

    }

    function setPulseStage(nStage) {

      var pulseCSS = {
        className: game.dom.world.className
      };

      stopPulse();

      if (!nStage) {
        nStage = 0;
      }

      // determine new pulse interval CSS
      utils.css.remove(pulseCSS, 'pulse-interval-' + data.pulseStage);
      utils.css.add(pulseCSS, 'pulse-interval-' + nStage);

      data.pulseStage = nStage;

      // apply to the world (CSS animations)
      game.dom.world.className = pulseCSS.className;

      // TODO: clean up

      data.pulseInterval = data.pulseIntervals['stage' + nStage];
      data.speedMultiplier = data.speedMultipliers['stage' + nStage];

      console.log('set pulse stage ' + nStage + ', interval ' + data.pulseInterval);

    }

    function nextPulseStage() {

      setPulseStage(getPulseStage() + 1);

    }

    function startPulse() {

      // check and set default, if needed

      if (!data.pulseTimer && !data.pulseInterval) {
        setPulseStage();
      }

      // re-start.
      stopPulse();

      if (!data.pulseTimer) {
        data.pulseTimer = window.setInterval(events.pulse, data.pulseInterval);
      }

    }

    function startTimer() {

      startPulse();

      if (!data.loopTimer) {

        if (!features.getAnimationFrame) {

          data.loopTimer = window.setInterval(events.loop, data.loopInterval);

        } else {

          data.loopTimer = true;

          getNextFrame();

        }

        if (oStats) {
          data.statsTimer = window.setInterval(events.statsUpdate, data.statsInterval);
        }

      }

    }

    function stopTimer() {

      stopPulse();

      if (data.loopTimer) {

        window.clearInterval(data.loopTimer);
        data.loopTimer = null;

        window.clearInterval(data.statsTimer);
        data.statsTimer = null;

        fpsCounter = 0;

      }

    }

    function pause() {

      // TODO: this.paused check?
      if (features.audio) {
        soundManager.mute();
      }
      stopTimer();

    }

    function resume() {

      if (features.audio) {
        soundManager.unmute();
      }
      startTimer();

    }

    function isActive() {

      // is the game running?
      return !!data.loopTimer;

    }

    function eventsInit() {

      // set default state? welcome screen, etc.?
     oStats = document.getElementById('fps');

     startTimer();

    }

    return {
      data: data,
      init: eventsInit,
      isActive: isActive,
      pause: pause,
      resume: resume,
      nextPulseStage: nextPulseStage,
      setPulseStage: setPulseStage,
      startTimer: startTimer,
      stopTimer: stopTimer
    };

  }

  function BlockController() {

    /**
     * maintains an array of blocks actively being hit
     * and animates them, removing from the array once finished
     */

    var objects = {
      blocks_hash: {},
      blocks: []
    };

    function animate() {

      var i;

      if (!objects.blocks.length) {
        return;
      }

      for (i = 0; i < objects.blocks.length; i++) {

        if (objects.blocks[i].animate()) {

          // if true is returned, animation is complete - remove from the array
          delete objects.blocks_hash[objects.blocks[i].data.id];

          objects.blocks.splice(i, 1);

          if (PERFORMANCE_MODE || DEBUG_MODE) {
            console.log('removed animating block; new count: ' + objects.blocks.length);

          }

        }

      }

    }

    function startAnimation(oBlock) {

      // we have something that should now be animating.
      if (objects.blocks_hash[oBlock.data.id] === undefined) {

        objects.blocks_hash[oBlock.data.id] = true;
        objects.blocks.push(oBlock);

      }

    }

    return {
      animate: animate,
      startAnimation: startAnimation
    };

  }

  gameObjects.blockController = new BlockController();

  var blockCounter = 0;

  function Block(oOptions) {

    var o;

    var objectInterface;

    var defaults = {
      power: 2
    };

    var data = {

      id: 'block_' + (blockCounter++),
      power: defaults.power, // when 0: dead
      points: 10,
      dead: false,
      x: oOptions.x * game.data.NODE_WIDTH,
      y: oOptions.y * game.data.NODE_HEIGHT,
      w: game.data.NODE_WIDTH,
      h: game.data.NODE_HEIGHT,
      type: oOptions.type,
      subType: oOptions.subType,
      hitFrame: 0,
      hitFrames: 6

    };

    function hittable() {
      // this thing can be hit (or collide with the ship), provied it is active.
      return !data.dead;
    }

    function pixelCollisionCheck(localOptions) {

      var hitObject;
      var collision = game.objects.collision;

      hitObject = collision.checkSprites({
         object1: localOptions,
         object2: {
           type: 'block-type-generic',
           x: data.x,
           y: data.y,
           w: data.w,
           h: data.h
         }
      });

      return hitObject;

    }

    function applyFrame() {

      if (o) {
        o.style.backgroundPosition = '0px ' + (data.hitFrame * -32) + 'px';
      }

    }

    function animationComplete() {

        // go back to letting CSS do its thing
        o.style.backgroundPosition = '';

        utils.css.remove(o, 'exploding');

    }

    function animationStart() {

        // register animation sequence with controller...
        game.objects.blockController.startAnimation(objectInterface);
        utils.css.add(o, 'exploding');
        applyFrame();

    }

    function hit() {

      // explode?
      if (!data.dead && data.power) {

        data.power--;
        game.objects.gameController.addPoints(data.points);
        animationStart();

      }

    }

    function destruct() {

      // clean-up: remove from the DOM.
      o.parentNode.removeChild(o);
      o = null;

    }

    function dead() {

        // after explosion sequence has finished
        if (data.power === 0) {

          data.dead = true;
          o.style.display = 'none';
          game.objects.statsController.record('block');
          destruct();

        }

    }

    function blockInit() {

      if (!o) {

        o = makeGridItem({
          x: oOptions.x,
          y: oOptions.y,
          type: data.type,
          subType: data.subType
        });

      }

      game.dom.worldFragment.appendChild(o);

    }

    function restore() {

      // reset state and re-init

      if (o) {
        o.style.backgroundPosition = '';
        utils.css.remove(o, 'dead');
      }

      data.dead = false;
      data.power = defaults.power;

      blockInit();

    }

    function animate() {

        // hit / death sequence

        if (data.dead) {
          // edge case (and tell controller this should not be animated any more.)
          return true;
        }

        var complete = false;

        if (data.hitFrame >= data.hitFrames) {

          // animation sequence is complete

          data.hitFrame = 0;

          animationComplete();

          if (data.power === 0) {
            // it's all over.
            dead();
          }

          complete = true;

        } else {

          applyFrame();

        }

        data.hitFrame++;

        return complete;

    }

    blockInit();

    objectInterface = {
      animate: animate,
      data: data,
      hit: hit,
      hittable: hittable,
      pixelCollisionCheck: pixelCollisionCheck,
      restore: restore
    };

    return objectInterface;

  }

  var badGuyTemplate = document.createElement('div');
  badGuyTemplate.innerHTML = '<div class="icon"></div>';
  badGuyTemplate.className = 'bad-guy';

  var badGuyCounter = 0;

  function BadGuy() {

    var o,
        oIcon,
        css,
        data,
        objectInterface,
        // for centering around ship
        centerOffset = 12,
        counter = 0,
        sound,
        nodeParent = game.dom.world;

    css = {
      bird: 'bird',
      smiley: 'smiley',
      x: 'x',
      exploding: 'exploding'
    };

    data = {
      active: false,
      dead: false,
      visible: false,
      id: 'badGuy' + badGuyCounter++,
      exploding: false,
      x: null,
      y: null,
      w: 24, // HACK: container is actually 32 (for explosion), character is 24x24.
      h: 24,
      containerW: 32,
      containerH: 32,
      vX: ((game.data.NODE_WIDTH / 16) + (Math.random() * 0.5)) * game.objects.gameLoop.data.GAME_SPEED,
      vY: ((game.data.NODE_HEIGHT / 16) + (Math.random() * 0.5)) * game.objects.gameLoop.data.GAME_SPEED,
      points: 200,
      explosionFrame: 0,
      explosionFrames: 10,
      jitterX: 0,
      jitterY: 0,
      lastX: null,
      lastY: null,
      row: null,
      col: null,
      type: null,
      types: ['bird', 'smiley', 'x'],
      frame: 0,
      frameCount: 0,
      frameCounts: {
        bird: 3,
        smiley: 3,
        x: 4
      }
    };

    // die when fire hits end of screen?

    function hide() {

      if (data.visible) {
        data.visible = false;
        o.style.visibility = 'hidden';
      }

    }

    function show() {

      if (!data.visible) {
        data.visible = true;
        o.style.visibility = 'visible';
      }

    }

    function getRandomJitter() {

      return parseInt(Math.random() * centerOffset, 10) * Math.random() > 0.5 ? 1 : -1;

    }

    function randomizeJitter() {

      data.jitterX = centerOffset + getRandomJitter();
      data.jitterY = centerOffset + getRandomJitter();

    }

    function moveTo(x,y) {

      var location;

      if (o) {

        if (game.objects.screen.isInView(data.col, data.row)) {

          o.style.left = Math.floor(x) + 'px';
          o.style.top = Math.floor(y) + 'px';

          if (counter % 3 === 0) {

            // only apply jitter every so often

            o.style.marginLeft = data.jitterX + 'px';
            o.style.marginTop = data.jitterY + 'px';

            randomizeJitter();

          } else {

            o.style.marginLeft = centerOffset + 'px';
            o.style.marginTop = centerOffset + 'px';

          }

          show();

        } else {

          hide();

        }

        data.lastX = x;
        data.lastY = y;

        // TODO: Review vs. coordinate checks

        location = game.objects.collision.xyToRowCol(x + data.jitterX, y + data.jitterY);

        if (location.col !== data.col || location.row !== data.row) {

          data.col = location.col;
          data.row = location.row;

          game.objects.badGuyMap.registerLocation({
            object: objectInterface,
            id: data.id,
            col: data.col,
            row: data.row
          });

        }

      }

    }

    function moveBy(x,y) { // TODO: labels for relative grid item values?

      // move and do collision check?
      data.x += (x * game.objects.gameLoop.data.speedMultiplier);
      data.y += (y * game.objects.gameLoop.data.speedMultiplier);

      moveTo(data.x, data.y);

    }

    function applyFrame(frame) {

      if (oIcon) {
        oIcon.style.backgroundPosition = '0px ' + (frame * -data.h) + 'px';
      }

    }

    function applyFrameX(frame) {

      // for horizontal sprites

      if (o) {
        o.style.backgroundPosition = (frame * -data.containerW) + 'px 0px';
      }

    }

    function targetPlayer() {

      // home in on player coordinates.
      var ship = game.objects.ship;

      return {
        deltaX: (data.x < ship.data.x - (ship.data.w / 2) ? 1 : -1),
        deltaY: (data.y < ship.data.y - (ship.data.h / 2) ? 1 : -1)
      };

    }

    function randomizePosition() {

      // warp to a random row/col. give 'er.
      var row, col, x, y;

      row = parseInt(Math.random() * game.data.world_rows, 10);
      col = parseInt(Math.random() * game.data.world_cols, 10);

      x = (col * game.data.NODE_WIDTH);
      y = (row * game.data.NODE_HEIGHT);

      data.x = x;
      data.y = y;

      moveTo(x, y);

    }

    function setRandomType() {

      data.type = data.types[parseInt(Math.random() * data.types.length, 10)];

      data.frameCount = data.frameCounts[data.type];

      // append relevant CSS
      utils.css.add(o, css[data.type]);

    }

    function resetBadGuy() {

      hide();

      utils.css.remove(css.exploding);

      data.active = false;
      data.exploding = false;
      data.explosionFrame = 0;

      moveTo(0,0);

    }

    function startAttack() {

      randomizePosition();

      // play sound on loop, annoy user?
      if (features.audio) {
        sound = soundManager.getSoundById('badguy-loop-' + (Math.random() > 0.5 ? 1 : 0));
        if (sound && !sound.playState) {
          sound.play();
        }
      }

      if (!data.active) {
        data.active = true;
      }

    }

    function die() {

      // explosion effect/noise
      if (!data.dead && !data.exploding) {

        game.objects.gameController.addPoints(data.points);

        if (features.audio) {
          incrementAudioPitch();
          if (sound) {
            sound.stop();
          }
          soundSprites.playBoom(audioBoomScale[getAudioPitch()]);
        }

        data.exploding = true;
        utils.css.add(o, css.exploding);

        // and remove from the collision map.
        game.objects.badGuyMap.clearLocation(data.id);

        game.objects.statsController.record('badGuy');

      }

    }

    function collisionCheck() {

      // did the bad guy hit its target, or turret fire, or ?

      var i, j,
          ship = game.objects.ship,
          hit = false,
          turretGunfire = null,
          thisPoint,
          fire,
          // gunfireObject,
          location;

      if (!data.active || data.exploding || data.dead) {
        return false;
      }

      // check ship
      // check ship gunfire
      // check turrent gunfire
      // check other bad guys
      // check spaceballs?

      thisPoint = {
        x: data.x + data.jitterX,
        y: data.y + data.jitterY,
        w: data.w,
        h: data.h
      };

      // did the bad guy hit the ship?
      hit = game.objects.ship.collisionCheck(thisPoint);

      if (hit) {
        console.log('bad guy hit the ship');
        die();
        ship.die();
        return true;
      }

      // did we hit a bullet?
      fire = game.objects.ship.objects.shipGunfire;

      if (fire.length) {

        for (i = 0, j = fire.length; i < j; i++) {

          hit = game.objects.collision.check(thisPoint, {
            x: fire[i].data.x,
            y: fire[i].data.y,
            w: fire[i].data.w,
            h: fire[i].data.h
          });

          if (hit) {
            // we have a winner.
            // let gunfire pass through, per original game rules.
            // fire[i].die();
            break;
          }

        }

      }

      // TODO: Make new map-based method work better.
/*
      gunfireObject = game.objects.shipGunfireMap.check(data.row, data.col);

      if (gunfireObject && !gunfireObject.data.dead) {
        // we have a (potential) winner.
        // do more precise coordinate check within grid.
        hit = game.objects.collision.check(thisPoint, {
          x: gunfireObject.data.x,
          y: gunfireObject.data.y,
          w: gunfireObject.data.w,
          h: gunfireObject.data.h
        });
      }
*/

      if (hit) {

        console.log('bad guy hit ship gunfire');
        die();

      } else {

        // did the bad guy hit turret gunfire?

        // if heading down or right, base coordinates on far edges.
        location = game.objects.collision.xyToRowCol(data.x + (data.w / 2), data.y + (data.h / 2));
        // var location = game.objects.collision.xyToRowCol(data.x, data.y);

        turretGunfire = game.objects.turretGunfireMap.check(location.row, location.col);

        if (turretGunfire) {

          // we have an object. do a collision check.
          hit = turretGunfire.collisionCheck();

          if (hit) {
            die();
          }

        }

      }

      return hit;

    }

    function destruct() {

      // remove from the dom, etc.
      if (o) {
        if (o.parentNode) {
          o.parentNode.removeChild(o);
        }
        o = null;
        oIcon = null;
      }

    }

    function dead() {

        data.exploding = false;
        data.dead = true;
        resetBadGuy();
        destruct();

    }

    function animate() {

      var deltas;

      // may be inactive, or died and awaiting cleanup
      if (!data.active || data.dead) {
        return;
      }

      counter++;

      if (!data.exploding) {

        if (counter % 2 === 0) {

          data.frame++;

          if (data.frame >= data.frameCount) {
            data.frame = 0;
          }

          // apply background position
          applyFrame(data.frame);

        }

        // figure out direction.
        deltas = targetPlayer();

        // increase frame count, move vX + vY
        moveBy(data.vX * deltas.deltaX * game.objects.gameLoop.data.GAME_SPEED, data.vY * deltas.deltaY * game.objects.gameLoop.data.GAME_SPEED);

        // and do collision check?
        collisionCheck();

      } else {

        // explosion/death sequence

        // if (counter % 2 === 0) {

        data.explosionFrame++;

        applyFrameX(data.explosionFrame);

        if (data.explosionFrame >= data.explosionFrames) {
          // it's all over.
          dead();
        }

        // }

      }

    }

    function initBadGuy() {

      if (!o) {

         o = badGuyTemplate.cloneNode(true);
         oIcon = o.childNodes[0];

        setRandomType();

        nodeParent.appendChild(o);

      }

    }

    // hack/convenience: start right away?
    initBadGuy();

    // hack/testing
    startAttack();

    objectInterface = {
      animate: animate,
      collisionCheck: collisionCheck,
      data: data,
      die: die,
      init: initBadGuy,
      startAttack: startAttack
    };

    return objectInterface;

  }

  function BadGuyController() {

    var objects = {

      badGuys: game.objects.badGuys

    };

    function animate() {

      var items = objects.badGuys,
          i, j;

      for (i = 0, j = items.length; i < j; i++) {
        items[i].animate();
      }

    }

    function collision() {

      if (features.audio) {
        // make noise.
        incrementAudioPitch();
        soundSprites.playBoom(audioBoomScale[getAudioPitch()]);
      }

    }

    function selfCollisionCheck() {

      // did one bad guy crash into another?

      var items = objects.badGuys,
          i, j, hit, thisPoint;

      if (items.length) {

        for (j = items.length - 1; j >= 0; j--) {

          thisPoint = {
            x: items[j].data.x,
            y: items[j].data.y,
            w: items[j].data.w,
            h: items[j].data.h
          };

          for (i = items.length - 1; i >= 0; i--) {

            // don't compare to self, or dead things...
            if (i !== j && items[i].data.active && !items[i].data.exploding && items[j].data.active && !items[j].data.exploding) {

              hit = game.objects.collision.check(thisPoint, {
                x: items[i].data.x,
                y: items[i].data.y,
                w: items[i].data.w,
                h: items[i].data.h
              });

              if (hit) {
                // double-boom, all the way!
                items[i].die();
                items[j].die();
              }

            }

          }

        }

        if (hit) {
          collision();
        }

      }

    }

    function collisionCheck() {

      // check bad guy objects for collision
      var items = objects.badGuys,
          i, j;

      var hit;

      if (items.length) {

        for (i = 0, j = items.length; i < j; i++) {
          hit = items[i].collisionCheck();
          if (hit) {
            hit = true;
            break;
          }
        }

      }

      // TODO: needless optimization?
      if (!hit) {
        selfCollisionCheck();
      }

      if (hit) {
        collision();
      }

      return hit;

    }

    function createBadGuy() {

      var i;

      // hack: check and clean up any dead ones, first.
      for (i = 0; i < objects.badGuys.length; i++) {
        if (objects.badGuys[i].data.dead) {
          objects.badGuys.splice(i, 1);
        }
      }

      objects.badGuys.push(new BadGuy());

    }

    function killAll() {

      var i, j;
      // the effect of a smartbomb.
      for (i = 0, j = objects.badGuys.length; i < j; i++) {
        // TODO: active check?
        objects.badGuys[i].die();
      }

    }

    return {
      animate: animate,
      collisionCheck: collisionCheck,
      createBadGuy: createBadGuy,
      killAll: killAll,
      objects: objects
    };

  }

  game.objects.badGuyController = new BadGuyController();

  spaceBallTemplate = document.createElement('div');
  spaceBallTemplate.className = 'spaceball';

  function SpaceBall(oOptions) {

    /**
     * "it's like a meatball, but in space!"
     * a mysterious asteroid blob that idly floats around the world.
     * it doesn't judge, it doesn't blame, it just *is*.
     * oblivious to ship and turret gunfire.
     * destroys everything in its path.
     * bounces off of blocks, walls and other spaceballs.
     */

    var o,
        data,
        objectInterface,
        nodeParent = game.dom.world;

    data = {
      active: false,
      visible: false,
      id: 'spaceBall' + spaceBallCounter++,
      x: null,
      y: null,
      w: 32,
      h: 32,
      vX: 0,
      vY: 0,
      lastX: null,
      lastY: null,
      row: oOptions.row,
      col: oOptions.col
    };

    function setDirection(noAxisFlip) {

      // randomly choose a direction.

      var xAxis = Math.random() > 0.5,

          // randomly choose +/-
          velocity = (game.data.NODE_WIDTH / 16) * (Math.random() > 0.5 ? 1 : -1) * game.objects.gameLoop.data.GAME_SPEED;

      // HACK: for now, just be stupid and reverse course.
      // current bug exists where reversing direction causes minute up/down/left/right movements, resulting in imperfect grid alignment
      noAxisFlip = true;

      if (!noAxisFlip) {

        data.vX = (xAxis ? velocity : 0);
        data.vY = (xAxis ? 0 : velocity);

      } else {

        // reverse direction on the current axis.
        data.vX *= xAxis ? 1 : -1;
        data.vY *= xAxis ? 1 : -1;

      }

    }

    function hide() {

      if (data.visible) {
        data.visible = false;
        if (nodeParent && o) {
          o.style.visibility = 'hidden';
        }
      }

    }

    function show() {

      if (!data.visible) {
        data.visible = true;
        o.style.visibility = 'visible';
      }

    }

    function moveTo(x,y) {

      var location;

      if (o) {

        x = Math.max(0, x);
        y = Math.max(0, y);

        data.lastX = x;
        data.lastY = y;

        // location = game.objects.collision.xyToRowCol(x + (data.vX >= 0 ? data.w : 0), y + (data.vY >= 0 ? data.h : 0));

        location = game.objects.collision.xyToRowCol(x, y);

        if (game.objects.screen.isInView(location.col, location.row)) {


          if (USE_TRANSFORM) {

            o.style[features.transform.prop] = 'translate3d(' + Math.floor(x) + 'px, ' + Math.floor(y) + 'px, 0px)';

          } else {

            o.style.left = Math.max(0, Math.floor(x)) + 'px';
            o.style.top = Math.max(0, Math.floor(y)) + 'px';

          }

          show();

        } else {

          hide();

        }

        if (location.col !== data.col || location.row !== data.row) {

          data.col = location.col;
          data.row = location.row;

          game.objects.spaceBallMap.registerLocation({
            object: objectInterface,
            id: data.id,
            col: data.col,
            row: data.row
          });

        }

      }

    }

    function moveBy(x,y) { // TODO: labels for relative grid item values?

      // move and do collision check?
      data.x += (x * game.objects.gameLoop.data.speedMultiplier);
      data.y += (y * game.objects.gameLoop.data.speedMultiplier);

      moveTo(data.x, data.y);

    }

    function bounce() {

      // immediately move to exact grid coordinates, so we don't get double-collision issues...
      moveTo(data.col * game.data.NODE_WIDTH, data.row * game.data.NODE_HEIGHT);

      // reverse direction on a random axis.
      setDirection();

      moveBy(data.vX, data.vY);

    }

    function collisionCheck() {

      // bounce if we hit a world boundary, a grid item, or another spaceball.

      // TODO: allow wrap-around, if objects don't exist at the other end?

      var item,
          location;

      // non-standard formatting, in favour of lengthy if...else
      if ((data.vX < 0 && data.x + data.vX <= 0)
        || (data.vX >= 0 && data.col >= game.data.world_cols)
        || (data.vY >= 0 && data.row >= game.data.world_rows)
        || (data.vY < 0 && data.y + data.vY <= 0)) {
        bounce();
        return;
      }

      // check next block?
      if (data.vX > 0) {

        // check right side
        location = game.objects.collision.xyToRowCol(data.x + data.w, data.y);

      } else if (data.vY > 0) {

        // check bottom side
        location = game.objects.collision.xyToRowCol(data.x, data.y + data.h);

      }

      if (!location) {

        // check grid for blocks
        item = game.data.map[data.row][data.col] || null;

      } else if (!item) {

        item = game.data.map[location.row][location.col] || null;

      }

      // this should be only a Block() instance.
      if (item && !item.data.dead) {
        // console.log('spaceball hit block');
        bounce();
      }

    }

    function setInitialPosition() {

      // warp to a random, unoccupied space.

      var row = data.row,
          col = data.col,
          x, y;

      x = (col * game.data.NODE_WIDTH);
      y = (row * game.data.NODE_HEIGHT);

      data.x = x;
      data.y = y;

      moveTo(x, y);

    }

    function animate() {

      if (data.active) {

        // increase frame count, move vX + vY
        moveBy(data.vX, data.vY);

        // and do collision check?
        collisionCheck();

      }

    }

    function startAttack() {

      setInitialPosition();

      setDirection();

      if (!data.active) {
        data.active = true;
      }

    }

    function hittable() {

      return data.active;

    }

    function pixelCollisionCheck(localOptions) {

      var hit,
          collision = game.objects.collision;

      hit = collision.checkSprites({
         object1: localOptions,
         object2: {
           // HACK: note re-use of ship pixel data here. It's close enough. :D
           type: 'ship',
           x: data.x,
           y: data.y,
           w: data.w,
           h: data.h
         }
      });

      return hit;

    }

    function initSpaceBall() {

      var velocity = (game.data.NODE_WIDTH / 16) * (Math.random() > 0.5 ? 1 : -1) * game.objects.gameLoop.data.GAME_SPEED;

      if (!o) {

         o = spaceBallTemplate.cloneNode(true);

         if (Math.random() > 0.5) {
           data.vX = velocity;
         } else {
           data.vY = velocity;
         }

      }

      startAttack();

      // append to DOM
      game.dom.worldFragment.appendChild(o);

    }

    function restore() {

      // you can't kill a roach, man.

      initSpaceBall();

      // show right away if it should be visible, too

      if (data.visible) {

        nodeParent.appendChild(o);
        o.style.display = 'block';

      }

    }

    // hack/convenience: start right away?
    initSpaceBall();

    // hack/testing
    startAttack();

    objectInterface = {
      animate: animate,
      bounce: bounce,
      data: data,
      hittable: hittable,
      init: initSpaceBall,
      pixelCollisionCheck: pixelCollisionCheck,
      restore: restore,
      startAttack: startAttack
    };

    return objectInterface;

  }

  function Screen() {

    var data, events, refreshVisibleGrid;

    var lastVisibleCheck = {
      // previous screen coordinates
      x: null,
      y: null,
      screen_width: null,
      screen_height: null
    };

    data = {

      coords: {
        x: 0,
        y: 0,
        lastX: null,
        lastY: null,
        width: 0,
        height: 0
      },

      visibleGridInfo: {
        from: {
          row: null,
          col: null
        },
        to: {
          row: null,
          col: null
        },
        range: null
      }

    };

    events = {

      resize: function() {

        // note additional ORed legacy browser (IE 8, etc.) checks
        data.coords.width = window.innerWidth || (document.documentElement.clientWidth || document.body.clientWidth || document.body.scrollWidth);
        data.coords.height = window.innerHeight || (document.documentElement.clientHeight || document.body.clientHeight || document.body.scrollHeight);

        refreshVisibleGrid();

      }

    };

    refreshVisibleGrid = function() {

      var coords = data.coords,
          last = lastVisibleCheck,
          visible;

      // TODO: make sure this check works.
      if (last.x === coords.x && last.y === coords.y && coords.screen_width === coords.width && coords.screen_height === coords.height) {

        // no change since last check
        return data.visibleGridInfo;

      }

      // update previous screen coordinates
      last.x = coords.x;
      last.y = coords.y;

      coords.screen_width = coords.width;
      coords.screen_height = coords.height;

      last.screen_width = coords.width;
      last.screen_height = coords.height;

      // var visible_range = [];

      visible = {
        from: game.objects.collision.xyToRowCol(coords.x, coords.y),
        to: game.objects.collision.xyToRowCol(coords.x + coords.width, coords.y + coords.height)
      };

      data.visibleGridInfo = {
        from: visible.from,
        to: visible.to
        // range: visible_range
      };

      // console.log('refreshVisibleGrid: ' + data.visibleGridInfo.from.col + ' -> ' + data.visibleGridInfo.to.col + ', ' + data.visibleGridInfo.from.row + ' -> ' + data.visibleGridInfo.to.row + ')');

      return data.visibleGridInfo;

    };

    function moveTo(x, y) {

      x = Math.floor(x);
      y = Math.floor(y);

      if (data.coords.lastX !== x || data.coords.lastY !== y) {

        data.coords.lastX = x;
        data.coords.lastY = y;

        data.coords.x = x;
        data.coords.y = y;

        // scroll the world.

        window.scrollTo(x, y);

        refreshVisibleGrid();

      }

    }

    function centerAtPoint(x, y) {

      // given x/y, set the mid-point of the screen there.

      var targetX,
          targetY;

      if (x < data.coords.width / 2) {
        targetX = 0;
      } else {
        targetX = parseInt(x - (data.coords.width / 2), 10);
      }

      if (y < data.coords.height / 2) {
        targetY = 0;
      } else {
        targetY = parseInt(y - (data.coords.height / 2), 10);
      }

      /*
      window.scrollTo(targetX, targetY);

      data.coords.lastX = targetX;
      data.coords.lastY = targetY;

      data.coords.x = targetX;
      data.coords.y = targetY;
      */

      moveTo(targetX, targetY);

    }

    function moveBy(xMultiplier, yMultiplier) {

      var oldX, oldY, newX, newY;

      oldX = data.coords.x;
      oldY = data.coords.y;

      newX = oldX + (game.data.NODE_WIDTH * xMultiplier);
      newY = oldY + (game.data.NODE_HEIGHT * yMultiplier);

      newX = Math.min(game.data.world_width, Math.max(0, newX));
      newY = Math.min(game.data.world_height, Math.max(0, newY));

      if (newX === data.coords.lastX && data.newY === data.coords.lastY) {
        return;
      }

      moveTo(newX, newY);

    }

    function isInView(col, row) {

      // is this location on-screen?
      var info = data.visibleGridInfo;

      // console.log('isInView(' + col +', ' + row + ' / ' + info.from.col + ' -> ' + info.to.col + ', ' + info.from.row + ' -> ' + info.to.row + ')');

      return (col >= info.from.col && row >= info.from.row && col <= info.to.col && row <= info.to.row);

    }

    function attachEvents() {

      utils.events.add(window, 'resize', events.resize);

    }

    function initScreen() {

      attachEvents();

      events.resize();

    }

    return {

      centerAtPoint: centerAtPoint,
      data: data,
      init: initScreen,
      isInView: isInView,
      moveBy: moveBy,
      moveTo: moveTo,
      refreshVisibleGrid: refreshVisibleGrid

    };

  }

  function stopEvent(e) {

    var evt = e || window.event;

    if (evt.preventDefault !== undefined) {

      evt.preventDefault();

    } else {

      evt.cancelBubble = true;

    }

    return false;

  }

  function KeyboardMonitor() {

    var keys,
        events,

       // hash for keys being pressed
       downKeys = {},

       // meaningful labels for key values
       keyMap = {
         shift: 16,
         ctrl: 17,
         space: 32,
         left: 37,
         up: 38,
         right: 39,
         down: 40
       };

    events = {

      keydown: function(e) {

        if (keys[e.keyCode] && keys[e.keyCode].down) {
          if (downKeys[e.keyCode] === undefined) {
            downKeys[e.keyCode] = true;
            keys[e.keyCode].down(e);
          }
          if (keys[e.keyCode].allowEvent === undefined) {
            stopEvent(e);
          }
        }

      },

      keyup: function(e) {

        if (downKeys[e.keyCode] !== undefined && keys[e.keyCode]) {
          delete downKeys[e.keyCode];
          if (keys[e.keyCode].up) {
            keys[e.keyCode].up(e);
          }
          if (keys[e.keyCode].allowEvent === undefined) {
            stopEvent(e);
          }
        }

      }

    };

    keys = {

      // NOTE: Each function gets an (e) event argument.

      // shift
      16: {

        allowEvent: true, // don't use stopEvent()

        down: function() {

          game.objects.ship.startFire();

        },

        up: function() {

          game.objects.ship.endFire();

        }

      },

      // ctrl (alternate for shift key)
      17: {

        allowEvent: true, // don't use stopEvent()

        down: function() {

          game.objects.ship.startFire();

        },

        up: function() {

          game.objects.ship.endFire();

        }

      },

      // left
      37: {

        down: function() {

          game.objects.ship.thrust(-1, 0);

        },


        up: function() {

          game.objects.ship.endThrust();

        }

      },

      // up
      38: {

        down: function() {

          game.objects.ship.thrust(0, -1);

        },


        up: function() {

          game.objects.ship.endThrust();

        }

      },

      // right
      39: {

        down: function() {

          game.objects.ship.thrust(1, 0);

        },


        up: function() {

          game.objects.ship.endThrust();

        }

      },

      // down
      40: {

        down: function() {

          game.objects.ship.thrust(0, 1);

        },


        up: function() {

          game.objects.ship.endThrust();

        }

      },

      // space bar!
      32: {

        down: function() {

          game.objects.smartbombController.fire();

        }

      }

    };

    function isDown(labelOrCode) {

      // check for a pressed key based on '37' or 'left', etc.
      return (keyMap[labelOrCode] !== undefined ? downKeys[keyMap[labelOrCode]] : downKeys[labelOrCode]);

    }

    function releaseAll() {

      // reset all pressed key states.
      var item;
      for (item in downKeys) {
        if (downKeys.hasOwnProperty(item)) {
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

    // init?

    function initKeyboardMonitor() {

      attachEvents();

    }

    return {

      init: initKeyboardMonitor,
      isDown: isDown,
      releaseAll: releaseAll

    };

  }

  var bigExplosionTemplate = document.createElement('div');
  bigExplosionTemplate.className = 'big-explosion';

  function BigExplosion(oOptions) {

    // a large boom.

    var o;

    var counter = 0;

    var data = {

      active: true,
      animationModulus: oOptions.animationModulus,
      frame: 0,
      frameCount: 5,
      node: oOptions.node,
      x: oOptions.x,
      y: oOptions.y,
      w: 96,
      h: 80,
      vX: (game.data.NODE_WIDTH / 2) * oOptions.vX,
      vY: (game.data.NODE_HEIGHT / 2) * oOptions.vY

    };

    function moveTo(x,y) {

      if (o) {

        o.style.left = Math.floor(x) + 'px';
        o.style.top = Math.floor(y) + 'px';

      }

    }

    function moveBy(x,y) {

      data.x += x;
      data.y += y;

      moveTo(data.x, data.y);

    }

    function applyFrame(frame) {

      if (o) {
        o.style.backgroundPosition = '0px ' + (frame * -data.h) + 'px';
      }

    }

    function animate() {

      if (data.active) {

        counter++;

        if (data.vX !== 0 || data.vY !== 0) {

          moveBy(data.vX, data.vY);

          //flick(e)r
          o.style.visibility = (Math.random() > 0.25 ? 'visible' : 'hidden');

        }

        if (counter % data.animationModulus === 0) {

          if (data.frame >= data.frameCount) {
            data.frame = 0;
            data.active = false;
          }

          // apply background position
          applyFrame(data.frame);

          data.frame++;

        }

      }

      return data.active ? 0 : 1;

    }

    function destruct() {

      if (o) {
        o.parentNode.removeChild(o);
        o = null;
      }

    }

    function initBigExplosion() {

      o = bigExplosionTemplate.cloneNode(true);

      // set initial position
      moveTo(data.x, data.y);

      data.node.appendChild(o);

    }

    initBigExplosion();

    return {
      data: data,
      animate: animate,
      destruct: destruct,
      moveBy: moveBy,
      moveTo: moveTo
    };

  }

  function LevelEndSequence(oOptions) {

    var objects = {
        explosions: []
      },

      data = {
        active: false,
        waiting: false,
        node: oOptions.node,
        explosionCount: 16,
        maxRuntime: 5000,
        screenOffset: 96
      },

      runTime;

    function makeNoise() {

      if (features.audio) {

        if (Math.random() > 0.85) {
          soundSprites.playBoom(parseInt(Math.random() * 10, 10));
          // TODO: pan
        }

      }

    }

    function getRandomPosition() {

      return {
        x: data.screenOffset + parseInt(Math.random() * (game.objects.screen.data.coords.width - data.screenOffset), 10),
        y: data.screenOffset + parseInt(Math.random() * (game.objects.screen.data.coords.width - data.screenOffset), 10)
      };

    }

    function createExplosion() {

      var position = getRandomPosition();

      objects.explosions.push(new BigExplosion({
        node: data.node,
        animationModulus: 3,
        x: position.x,
        y: position.y,
        vX: 0,
        vY: 0
      }));

    }

    function boom() {

      var i,
          maxObjects = 16;

      if (!data.active) {

        data.active = true;

        runTime = new Date();

        // create several explosions over time
        createExplosion();

        for (i = 0; i < maxObjects; i++) {
          window.setTimeout(createExplosion, (i + 1) * 50);
          window.setTimeout(createExplosion, (i + 1) * 50);
        }

      }

    }

    function show() {

      data.node.style.display = 'block';

    }

    function hide() {

      data.node.style.display = 'none';

    }

    function destruct() {

      // clean-up?

      var i, j;

      for (i = 0, j = objects.explosions.length; i < j; i++) {
        objects.explosions[i].destruct();
      }

      objects.explosions = [];

    }

    function endLevelEndSequence() {

      var oEnd,
          oBody,
          oStats,
          statsData;

      // complete.
      if (data.waiting) {
        return;
      }

      data.waiting = true;

      destruct();

      oEnd = document.getElementById('level-passed-screen');
      oBody = oEnd.getElementsByTagName('div')[0];
      oStats = document.getElementById('level-passed-stats');
      statsData = game.objects.statsController.getStats();

      oStats.innerHTML = [
        '<br>',
        '<p>Your score: ' + game.objects.gameController.getScore() + ' points</p>',
        '<br>',
        '<div class="fixed"><div class="icon type-2 block"></div> Blocks: ' + statsData.block + '</div>',
        '<div class="fixed"><div class="icon type-1 turret right"></div> Turrets: ' + statsData.turret + '</div>',
        '<div class="fixed bad-guy smiley"><div class="icon"></div> Bad guys: ' + statsData.badGuy + '</div>'
      ].join('');

      oEnd.style.display = 'block';

      oBody.style.marginTop = -parseInt(oBody.offsetHeight / 2, 10) + 'px';

      game.objects.gameLoop.pause();

      document.onclick = function() {

        document.onclick = null;

        // increase game speed multiplier? this will probably break all kinds of stuff.
        // TODO: Look at this.
        game.objects.gameLoop.data.GAME_SPEED += 0.25;

        // reset score, stats and so forth

        oEnd.style.display = 'none';

        data.waiting = false;
        data.active = false;
        hide();

        // reset the whole (entire) game
        survivor.reset();

        game.objects.gameLoop.resume();

      };

    }

    function animate() {

      if (data.waiting || !data.active) {
        return;
      }

      var i, j,
          isComplete,
          position;

      for (i = 0, j = objects.explosions.length; i < j; i++) {

        isComplete = objects.explosions[i] && objects.explosions[i].animate();

        if (isComplete) {
          // randomly delay via frame offset, reposition and recycle
          objects.explosions[i].data.frame = -parseInt(Math.random() * 5, 10);
          position = getRandomPosition();
          objects.explosions[i].moveTo(position.x, position.y);
          objects.explosions[i].data.active = true;
          makeNoise();
        }

      }

      if (new Date() - runTime > data.maxRuntime) {
        endLevelEndSequence();
      }

    }

    function start() {

      show();

      // "Jamie wants big boom." (-- Adam Savage, Mythbusters.)
      boom();

    }

    return {
      animate: animate,
      data: data,
      start: start
    };

  }

  function isFreeSpace(col, row) {

    /**
     * determine if anything is occupying a map (grid) location.
     * TODO: also consider "in turret gunfire path."
     */

    var result;

    // first, round down.
    col = Math.floor(col);
    row = Math.floor(row);

    // and check...
    result = (

      // is not a hittable, static map object
      (!game.data.map[row][col] || (game.data.map[row][col] && !game.data.map[row][col].hittable()))

      // and is not a space inside a base
      && mapData[row].charAt(col) !== MAP_INSIDE_BASE_CHAR

      // and is not a turret gunfire object
      && !game.objects.turretGunfireMap.check(col, row)

      // and is not a bad guy
      && !game.objects.badGuyMap.check(col, row)

      // and is not a spaceball
      && !game.objects.spaceBallMap.check(col, row)

    );

    return result;

  }

  function findFreeSpace(col, row) {

    // given a point, find nearest unoccupied neighbouring space.

    var i, j,
        targetCol,
        targetRow,
        direction,
        directions;

    directions = [
      [-1, -1],
      [0, -1],
      [1, -1],
      [1, 0],
      [1, 1],
      [0, 1],
      [-1, 1],
      [-1, 0]
    ];

    col = Math.floor(col);
    row = Math.floor(row);

    // restrict to valid range, also
    col = Math.max(0, Math.min(col, game.data.world_cols));
    row = Math.max(0, Math.min(row, game.data.world_rows));

    // is the current space OK?
    if (isFreeSpace(col, row)) {

      return [col, row];

    }

    for (i = 0, j = directions.length; i < j; i++) {

      targetCol = col + directions[i][0];
      targetRow = row + directions[i][1];

      // stay within valid grid ranges, of course.
      if (targetCol >= 0 && targetRow >= 0 && targetCol <= game.data.world_cols && targetRow <= game.data.world_rows) {

        if (isFreeSpace(targetCol, targetRow)) {

          // use this one.
          return [targetCol, targetRow];

        }

      }

    }

   // edge case: all spaces occupied? try recursing with a random direction.
   direction = directions[parseInt(Math.random() * directions.length, 10)];

   console.log('recursing with ', col + direction[0], row + direction[1]);

   return findFreeSpace(col + direction[0], row + direction[1]);

  }

  // hash of sprites
  var spriteData = {};

  function SpriteData(oData) {

    /**
     * the simplest, dumbest, least-efficient way of describing pixel data
     * for hit/collision detection purposes. at least it's fun to look at. :D
     */

    var data = {

      id: oData.id,
      pixelMap: oData.pixelMap,
      width: oData.width,
      height: oData.height

    };

    function check(row, col) {

      return (data.pixelMap[row] !== undefined && data.pixelMap[row] && data.pixelMap[row][col] !== undefined && data.pixelMap[row][col]);

    }

// console.log(data);

    return {
      check: check,
      data: data
    };

  }

  function createSprites() {

    /**
     * defines the sprite objects for pixel-level collision detection purposes.
     * it was either this, or using canvas to load + parse images.
     * this method is less-flexible, but should be faster (and more fun.)
     */

    var i, j,
        data;

      data = [{

        id: 'ship',
        width: 32,
        height: 32,
        pixelMap: [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
          [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,0,1,1,0,0,0,0,1,1,0,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
          [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
          [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
          [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,0,1,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]

      }, {

        id: 'block-type-generic',
        width: 32,
        height: 32,
        pixelMap: [
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
        ]

      }, {

        id: 'wall-type-1-upRight',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]

        ]

      }, {

        id: 'wall-type-1-rightDown',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]

        ]

      }, {

        id: 'wall-type-1-downLeft',
        width: 32,
        height: 32,
        pixelMap: [

          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'wall-type-1-downRight',
        width: 32,
        height: 32,
        pixelMap: [

          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'wall-type-1-horizontal',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'wall-type-1-vertical',
        width: 32,
        height: 32,
        pixelMap: [

          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]

        ]

      }, {

        id: 'wall-type-generic-upRight',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]

        ]

      }, {

        id: 'wall-type-generic-rightDown',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]

        ]

      }, {

        id: 'wall-type-generic-downLeft',
        width: 32,
        height: 32,
        pixelMap: [

          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'wall-type-generic-downRight',
        width: 32,
        height: 32,
        pixelMap: [

          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]


        ]

      }, {

        id: 'wall-type-generic-horizontal',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'wall-type-generic-vertical',
        width: 32,
        height: 32,
        pixelMap: [

          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0]

        ]

      }, {

        id: 'turret-gunfire-horizontal',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          [0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'turret-gunfire-vertical',
        width: 32,
        height: 32,
        pixelMap: [

          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          [0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,0,0,0,0,0],
          null,
          null,
          null,
          null,
          null,
          null,
          null,
          null

        ]

      }, {

        id: 'ship-gunfire',
        width: 7,
        height: 7,
        pixelMap: [

          [0,0,0,0,0,0,0],
          [0,1,1,1,1,0,0],
          [0,1,1,1,1,1,0],
          [0,1,1,1,1,1,0],
          [0,1,1,1,1,1,0],
          [0,0,1,1,1,0,0],
          [0,0,0,0,0,0,0]

        ]

      }

    ];

    for (i = 0, j = data.length; i < j; i++) {
      spriteData[data[i].id] = new SpriteData(data[i]);
    }

  }

  createSprites();


  function Collision() {

    // intersect/overlap detection

/*
    var objects = {
      spriteData: spriteData
    };
*/

    function xyToRowCol(x, y) {

      var result;

      result = {

        col: Math.max(0, Math.min(game.data.world_cols, Math.floor(x / game.data.NODE_WIDTH))),
        row: Math.max(0, Math.min(game.data.world_rows, Math.floor(y / game.data.NODE_HEIGHT)))

      };

      return result;

    }

    function getIntersect(x,y) {

      var location;

      if (x === undefined || y === undefined) {
        console.log('getIntersect(): WARN: x/y undefined');
        return {
          location: null,
          mapItem: null
        };
      }

      location = xyToRowCol(x, y);

      return {
        row: location.row,
        col: location.col
      };

    }

    function check(point1, point2) {

      // given two boxes, check for intersects.
      var result;

      if (point2.x >= point1.x) {

        // point 2 is to the right.

        if (point1.x + point1.w >= point2.x) {
          // point 1 overlaps point 2 on x.
          if (point1.y < point2.y) {
            // point 1 is above point 2.
            if (point1.y + point1.h >= point2.y) {
              // point 1 overlaps point 2 on y.
              result = true;
            }
          } else {
            result = (point1.y < point2.y + point2.h);
          }
        }

      // point 1 is to the right.
      } else if (point2.x + point2.w >= point1.x) {
        // point 2 overlaps point 1 on x.
        if (point2.y < point1.y) {
          // point 2 is above point 1.
          result = (point2.y + point2.h >= point1.y);
        } else {
          // point 2 is below point 1.
          result = (point1.y + point1.h >= point2.y);
        }
      } else {
        // no overlap?
        result = false;
      }

      return result;

    }

    function checkSprites(oOptions) {

      /*
        object1: {
          type: 'base-generic-wall-down-right',
          x: data.x,
          y: data.y,
          w: data.w,
          h: data.h
        },
        object2: oOptions.object // {spriteType, x, y, w, h}
      */

      var sprite1 = oOptions.object1,
          sprite2 = oOptions.object2,
          sprite1Data,
          sprite2Data,
          overlap;

      overlap = {

        sprite1: {

          xOffset: null,
          yOffset: null,

          from: {
            x: null,
            y: null
          },

          to: {
            x: null,
            y: null
          }

        },

        sprite2: {

          xOffset: null,
          yOffset: null,

          from: {
            x: null,
            y: null
          },

          to: {
            x: null,
            y: null
          }

        }

      };

      // firstly, determine overlapping area.

      var deltaX, deltaY, deltaW, deltaH;

      // to be safe, round up.
      sprite1.x = parseInt(sprite1.x, 10);
      sprite1.y = parseInt(sprite1.y, 10);

      sprite2.x = parseInt(sprite2.x, 10);
      sprite2.y = parseInt(sprite2.y, 10);

      deltaX = Math.abs(sprite1.x - sprite2.x);
      deltaY = Math.abs(sprite1.y - sprite2.y);
      deltaW = Math.abs(sprite1.w - sprite2.w);
      deltaH = Math.abs(sprite1.h - sprite2.h);

      if (sprite2.x >= sprite1.x) {

        // sprite 2 is to the right.

        if (sprite1.x + sprite1.w >= sprite2.x) {

          overlap.sprite1.xOffset = 0;
          overlap.sprite2.xOffset = deltaX;

          // partial coverage of sprite 1.

          if (sprite1.y < sprite2.y) {

            overlap.sprite1.yOffset = 0;
            overlap.sprite2.yOffset = deltaY;

            // TODO: remove this check since it should always be true?
            if (sprite1.y + sprite1.h >= sprite2.y) {

              overlap.sprite1.yOffset = -deltaY;
              overlap.sprite2.yOffset = 0;

            } else {

              // edge case?
              overlap.sprite1.yOffset = 0;
              overlap.sprite2.yOffset = -deltaY;

            }

          } else {

            overlap.sprite1.yOffset = deltaY;
            overlap.sprite2.yOffset = 0;

          }

        }

      } else if (sprite2.x + sprite2.w >= sprite1.x) {

        overlap.sprite2.xOffset = 0;
        overlap.sprite1.xOffset = deltaX;

        // partial coverage of sprite 2.

        if (sprite2.y < sprite1.y) {

          overlap.sprite2.yOffset = 0;
          overlap.sprite1.yOffset = deltaY;

          // TODO: remove this check since it should always be true?
          if (sprite2.y + sprite2.h >= sprite1.y) {

            overlap.sprite2.yOffset = -deltaY;
            overlap.sprite1.yOffset = 0;

          } else {

            // edge case?
            overlap.sprite2.yOffset = 0;
            overlap.sprite1.yOffset = -deltaY;

          }

        } else {

          overlap.sprite2.yOffset = deltaY;
          overlap.sprite1.yOffset = 0;

        }

      }

      if (overlap.sprite1.xOffset === null || overlap.sprite2.xOffset === null) {
        // exception: null overlap case?
        if (PERFORMANCE_MODE || DEBUG_MODE) {
          console.log('pixelCollisionCheck: null overlap/xOffset case');
        }
        return false;
      }

      // now we know how the distances between boxes.

      // console.log('checking', sprite1.type, sprite2.type);

      sprite1Data = spriteData[sprite1.type];
      sprite2Data = spriteData[sprite2.type];

      if (!sprite1Data) {
        console.log('WARN: No data for sprite type ' + sprite1.type);
      }

      if (!sprite2Data) {
        console.log('WARN: No data for sprite type ' + sprite2.type);
      }

      var max_width = Math.max(sprite1Data.data.width, sprite2Data.data.width);
      var max_height = Math.max(sprite1Data.data.height, sprite2Data.data.height);

      var i, j, k, l;

      var pixel_overlap = false;

      var pixel_test;
      // compare the sprites.

      var s1X, s1Y, s2X, s2Y;

      for (i = 0, j = max_height; i < j && !pixel_overlap; i++) {
        for (k = 0, l = max_width; k < l && !pixel_overlap; k++) {
          s1X = k - overlap.sprite1.xOffset;
          s1Y = i - overlap.sprite1.yOffset;
          s2X = k - overlap.sprite2.xOffset;
          s2Y = i - overlap.sprite2.yOffset;
          if (s1X >= 0 && s1X < sprite1Data.data.width && s1Y >= 0 && s1Y < sprite1Data.data.height && s2X >= 0 && s2X < sprite2Data.data.width && s2Y >= 0 && s2Y < sprite2Data.data.height) {
            // console.log('[ loop row/col ' + i + ', ' + k +']: comparing ' + s1X + ', ' + s1Y + ' to ' + s2X + ', ' + s2Y);
            pixel_test = (sprite1Data.check(s1Y, s1X) && sprite2Data.check(s2Y, s2X));
            if (pixel_test) {
              if (PERFORMANCE_MODE || DEBUG_MODE) {
                console.log('FOUND HIT at loop row/col ' + i + ', ' + k + ', comparing ' + s1X + ', ' + s1Y + ' to ' + s2X + ', ' + s2Y);
                console.log('sprite1, sprite2', sprite1, sprite2);
                console.log('delta X, Y, W, H: ' + deltaX + ', ' + deltaY + ', ' + deltaW + ', ' + deltaH);
                console.log('overlap data', overlap.sprite1, overlap.sprite2);
                console.log(sprite1Data.data, sprite2Data.data);
              }
              pixel_overlap = true;
            }
          }
        }
      }

      return pixel_overlap;

    }

    function checkGrid(point) { // { x, y, w, h, includeNeighbours }

      // given a box, check either the midpoint or the four corners for intersects.

      var i,
          intersects = [];

      if (point.includeNeighbours) {

        // build the hash of unique intersecting objects
        intersects.push(getIntersect(point.x, point.y));
        intersects.push(getIntersect(point.x + point.w, point.y));
        intersects.push(getIntersect(point.x, point.y + point.h));
        intersects.push(getIntersect(point.x + point.w, point.y + point.h));

        for (i = 0; i < intersects.length; i++) {
          // mark neighbouring offsets
          intersects[i].isNeighbour = true;
        }

      }

      // default case: go with the midpoint of the thing.
      intersects.push(getIntersect(point.x + (point.w / 2), point.y + (point.h / 2)));

      return intersects;

    }

    return {

      check: check,
      checkGrid: checkGrid,
      checkSprites: checkSprites,
      xyToRowCol: xyToRowCol

    };

  }

  var fireTemplate = document.createElement('div');
  fireTemplate.innerHTML = '&bull;';
  fireTemplate.className = 'ship-gunfire';

  var shipGunfireCounter = 0;

  function ShipGunfire(oOptions) {

    /**
     * "pew pew pew" from the ship.
     * fires bi-directionally based on ship heading (up/down, left/right or diagonals.)
     * can kill bad guys and turrets.
     */

    var objectInterface;

    var o = fireTemplate.cloneNode(true);

    var data = {
      active: false,
      dead: false,
      visible: false,
      id: 'shipGunfire' + (shipGunfireCounter++),
      x: oOptions.x,
      y: oOptions.y,
      w: oOptions.w,
      h: oOptions.h,
      vX: (game.data.NODE_WIDTH / 2) * oOptions.vX,
      vY: (game.data.NODE_HEIGHT / 2) * oOptions.vY,
      row: null,
      col: null,
      lastX: null,
      lastY: null,
      lastCollisionX: null,
      lastCollisionY: null,
      lastCollisionResult: null
    };

    var nodeParent = game.dom.world;

    // die when fire hits end of screen?

    function hide() {

      if (!data.visible) {
        return;
      }
      data.visible = false;
      nodeParent.removeChild(o);
      o.style.visibility = 'hidden';

    }

    function moveTo(x,y) {

      var location;

      x = Math.floor(x);
      y = Math.floor(y);

      if (o) {

        location = game.objects.collision.xyToRowCol(x, y);

        if (USE_TRANSFORM) {

          o.style[features.transform.prop] = 'translate3d(' + Math.floor(x) + 'px, ' + Math.floor(y) + 'px, 0px)';

        } else {

          if (data.lastX !== x) {
            o.style.left = x + 'px';
          }

          if (data.lastY !== y) {
            o.style.top = y + 'px';
          }

        }

        data.lastX = x;
        data.lastY = y;

        if (location.col !== data.col || location.row !== data.row) {

          data.col = location.col;
          data.row = location.row;

          game.objects.shipGunfireMap.registerLocation({
            object: objectInterface,
            id: data.id,
            col: data.col,
            row: data.row
          });

        }

      }

    }

    function show() {

      if (!data.visible) {
        data.visible = true;
        if (o) {
          nodeParent.appendChild(o);
          o.style.display = 'block';
        }
      }

    }

    function resetShipGunFire() {

      hide();

      data.active = false;

      moveTo(0,0);

    }


    function destruct() {

      // remove from the dom, etc.
      if (o) {
        hide();
        o = null;
      }

    }

    function die() {

      // called when end of screen hit, or object hit
      data.dead = true;
      resetShipGunFire();
      destruct();

    }

    function moveBy(x,y) { // TODO: labels for relative grid item values?

      var screen = game.objects.screen;

      // move and do collision check?
      data.x += x;
      data.y += y;

      if (data.x < 0 || data.x < screen.data.coords.x || data.x > screen.data.coords.x + screen.data.coords.width || data.x + data.w > game.data.world_width) {

        // X-axis boundary check
        die();

      } else if (data.y < 0 || data.y < screen.data.coords.y || data.y > screen.data.coords.y + screen.data.coords.height || data.y + data.h > game.data.world_height) {

        // Y-axis boundary check
        die();

      } else {

        // all good
        moveTo(data.x, data.y);

        show();

      }

    }

    function fire() {

      if (!data.active) {
        data.active = true;
      }

    }

    function hittable() {

      return data.active;

    }

    function collisionCheck() {

      // did ship fire hit anything?

      var i, j;
      var intersects, item;
      var hit = false;
      var incrementPitch = false;
      var mapObjectItem;
      var passThrough;

      if (!data.dead && (data.lastCollisionX !== data.x || data.lastCollisionY !== data.y)) {

        data.lastCollisionX = data.x;
        data.lastCollisionY = data.y;

        // check grid
        intersects = game.objects.collision.checkGrid({
          x: data.x,
          y: data.y,
          w: data.w,
          h: data.h
          // TODO: includeNeighbours: true ?
        });

        for (i = 0, j = intersects.length; i < j; i++) {

          item = game.data.map[intersects[i].row][intersects[i].col];

          if (item && item.hittable && item.hittable()) {

            // additional pixel-level collision check
            if (item.pixelCollisionCheck) {

              // HACK (sorta): check current position, and (potentially) last two in-between coordinates
              // given bullet may "skip" walls or turret gunfire etc. otherwise
              // i.e., cover (almost) the full range of movement

              hit = item.pixelCollisionCheck({
                type: 'ship-gunfire',
                x: data.x,
                y: data.y,
                w: data.w,
                h: data.h
              });

              if (!hit) {

                // move backwards a bit more and try again.
                hit = item.pixelCollisionCheck({
                  type: 'ship-gunfire',
                  x: data.x - (data.vX * 0.5),
                  y: data.y - (data.vY * 0.5),
                  w: data.w,
                  h: data.h
                });

              }

              if (!hit) {

                // move backwards a bit less and try again.
                hit = item.pixelCollisionCheck({
                  type: 'ship-gunfire',
                  x: data.x - (data.vX * 0.25),
                  y: data.y - (data.vY * 0.25),
                  w: data.w,
                  h: data.h
                });

              }

              if (!hit) {

                // move forwards just a bit and try again.
                hit = item.pixelCollisionCheck({
                  type: 'ship-gunfire',
                  x: data.x + (data.vX * 0.25),
                  y: data.y + (data.vY * 0.25),
                  w: data.w,
                  h: data.h
                });

              }


            } else {

              // console.log('no pixel-level check on item, assuming dead');

              console.log('no pixel check on item:', item);

              hit = true;

            }

            if (hit) {

              // did we kill the thing?
              item.hit();

              if (item.data.dead) {
                incrementPitch = true;
              }

              // kill the gunfire, too?
              die();

              // stop on the first one?
              break;

            }

          } else if (item && !item.hit) {

            // probably a wall or something else.

            console.log('WARN: Wall or other un-handled grid item hit case.');
            die();
            break;

          }

        }

        // non-"grid" items: bad guys, turret gunfire, spaceballs

        if (!hit) {

          // check bad guys
          hit = game.objects.badGuyController.collisionCheck();

          if (hit) {
            // we hit something, so mark the pitch to increase, and die
            if (item && item.data.dead) {
              // did the thing just die?
              incrementPitch = true;
            }
            // let gunfire pass through bad guys, per original game rules.
            passThrough = true;
          }

        }

        if (!hit) {

          // check turret gunfire
          mapObjectItem = game.objects.turretGunfireMap.check(data.row, data.col);

          if (mapObjectItem && mapObjectItem.collisionCheck()) {

            // turret gunfire trumps ship gunfire.

            if (mapObjectItem.pixelCollisionCheck) {

              hit = mapObjectItem.pixelCollisionCheck({
                type: 'ship-gunfire',
                x: data.x,
                y: data.y,
                w: data.w,
                h: data.h
              });

              if (!hit) {

                // move backwards a bit more and try again.
                hit = mapObjectItem.pixelCollisionCheck({
                  type: 'ship-gunfire',
                  x: data.x - (data.vX * 0.75),
                  y: data.y - (data.vY * 0.75),
                  w: data.w,
                  h: data.h
                });

              }

              if (!hit) {

                // move backwards a bit more and try again.
                hit = mapObjectItem.pixelCollisionCheck({
                  type: 'ship-gunfire',
                  x: data.x - (data.vX * 0.5),
                  y: data.y - (data.vY * 0.5),
                  w: data.w,
                  h: data.h
                });

              }

              if (!hit) {

                // move backwards a bit less and try again.
                hit = mapObjectItem.pixelCollisionCheck({
                  type: 'ship-gunfire',
                  x: data.x - (data.vX * 0.25),
                  y: data.y - (data.vY * 0.25),
                  w: data.w,
                  h: data.h
                });

              }

            } else {

              hit = true;

            }

          }

        }

        // check spaceballs

        if (!hit) {

          mapObjectItem = game.objects.spaceBallMap.check(data.row, data.col);

          if (mapObjectItem) {

            // we have an object. do a collision check.

            // console.log('spaceball found at ' + data.row, data.col);

            // HACK: compare vs. ship object shape for collision. it's close enough.

            hit = mapObjectItem.pixelCollisionCheck({
              type: 'ship',
              x: data.x - (data.vX * 0.5),
              y: data.y - (data.vY * 0.5),
              w: data.w,
              h: data.h
            });

            // console.log('result of collision check with spaceball', hit);

            // hit = mapObjectItem.hittable();

          }

        }

        if (hit && !passThrough) {
          // kill the gunfire, provided it wasn't a bad guy (which shots can kill and pass through)
          die();
        }

        data.lastCollisionResult = {
          hit: hit,
          incrementPitch: incrementPitch
        };

      }

      return data.lastCollisionResult;

    }

    function animate() {

      // may be inactive, or died and awaiting cleanup
      if (!data.active) {
        return;
      }

      // increase frame count, move vX + vY
      moveBy(data.vX, data.vY);

      // and do collision check?
      collisionCheck();

    }

    fire();

    objectInterface = {
      animate: animate,
      collisionCheck: collisionCheck,
      data: data,
      die: die,
      hittable: hittable
    };

    return objectInterface;

  }

  function Ship() {

    var o;

    var audio = {
      explode: null,
      thrustStart: null,
      thrustLoop: null
    };

    var data = {
      // angle: 0,
      accelMultiplier: 0.015,
      almostZero: 0.02,
      dead: false,
      dying: false,
      hidden: false,
      decelRate: 0.8,
      x: 0,
      y: 0,
      w: 32,
      h: 32,
      lastX: null,
      lastY: null,
      lastCollisionX: null,
      lastCollisionY: null,
      vX: 0,
      vxMax: 0.25,
      vY: 0,
      vyMax: 0.25,
      row: 0,
      col: 0,
      thrusting: false,
      thrustDirection: {
        up: true, // the initial/default.
        down: false,
        left: false,
        right: false
      },
      firing: false,
      smartbombs: DEFAULT_SMARTBOMBS // by default, armed with these many...
    };

    var objects = {
      shipGunfire: [],
      explosion: null
    };

    var css = {
      thrust: {
        up: 'thrust-up',
        right: 'thrust-right',
        down: 'thrust-down',
        left: 'thrust-left'
      },
      thrusting: 'thrusting',
      hidden: 'hidden'
    };

    /*
    function setPosition(oOptions) {

      var x, y;

      x = Math.floor(oOptions.x);
      y = Math.floor(oOptions.y);

      data.x = x;
      data.y = y;

      o.style.left = x + 'px';
      o.style.top = y + 'px';

    }
    */

    function hide() {

      if (!data.hidden) {
        data.hidden = true;
        utils.css.add(o, css.hidden);
      }

    }

    function show() {
      if (data.hidden) {
        data.hidden = false;
        window.setTimeout(function() {
          if (!data.hidden) {
            utils.css.remove(o, css.hidden);
          }
        }, 10);
      }

    }

    function resetShip() {

      data.dead = false;

      data.vX = 0;
      data.vY = 0;

      show();

    }

    function moveTo(x,y) {

      var deltaX, deltaY,
          screenW = game.objects.screen.data.coords.width,
          screenH = game.objects.screen.data.coords.height,
          screenX = game.objects.screen.data.coords.x,
          screenXAbs = Math.abs(screenX),
          screenY = game.objects.screen.data.coords.y,
          screenYAbs = Math.abs(screenY),
          screenWThird = screenW / 3,
          screenHThird = screenH / 3;

      var vX = data.vX;
      var vY = data.vY;

      x = Math.floor(x);
      y = Math.floor(y);

      deltaX = x - data.x;
      deltaY = y - data.y;

      if (data.lastX === x && data.lastY === y) {
        return;
      }

      if (data.lastX !== x) {
        o.style.left = x + 'px';
      }

      if (data.lastY !== y) {
        o.style.top = y + 'px';
      }

      data.lastX = x;
      data.lastY = y;

      data.x = x;
      data.y = y;

      // console.log(deltaX, screenXAbs, screenW, screenWThird);

      // are we near the screen boundary?

      if (deltaX > 0 && x > ((screenXAbs + screenW) - screenWThird)) {

        // moving right

        game.objects.screen.moveBy(vX, 0);

      } else if (deltaX < 0 && x < (screenXAbs + screenWThird)) {

        // moving left

        game.objects.screen.moveBy(vX, 0);
      }

      if (deltaY > 0 && y > ((screenYAbs + screenH) - screenHThird)) {

        // moving down

        game.objects.screen.moveBy(0, vY);

      } else if (deltaY < 0 && y < (screenYAbs + screenHThird)) {

        game.objects.screen.moveBy(0, vY);

      }

    }

    function addDirection(direction, opposite) {

      // adds one direction, optionally removing the other.

      if (!data.thrustDirection[direction]) {
        data.thrustDirection[direction] = true;
        utils.css.add(o, css.thrust[direction]);
      }

      if (opposite && data.thrustDirection[opposite]) {
        data.thrustDirection[opposite] = false;
        utils.css.remove(o, css.thrust[opposite]);
      }

    }

    function removeDirection(direction) {

      // removes one direction
      if (data.thrustDirection[direction]) {
        data.thrustDirection[direction] = false;
        utils.css.remove(o, css.thrust[direction]);
      }

    }

    function thrust(xDirection, yDirection) {

      if (data.dying || data.dead) {
        return;
      }

      if (!data.thrusting) {

        // initial start.
        utils.css.add(o, css.thrusting);

        if (features.audio) {
          audio.thrustStart.play();
          audio.thrustLoop.play();
        }

      }

      data.thrusting = true;

      // starts moving in a given direction.
      data.vX += xDirection * data.accelMultiplier * game.objects.gameLoop.data.GAME_SPEED;
      data.vY += yDirection * data.accelMultiplier * game.objects.gameLoop.data.GAME_SPEED;

      // change ship UI based on pending direction change

      if (xDirection > 0) {

        addDirection('right', 'left');

      } else if (xDirection < 0) {

        addDirection('left', 'right');
        data.vX = Math.max(-data.vxMax, data.vX);

      } else {

        removeDirection('left');
        removeDirection('right');

      }

      if (yDirection > 0) {

        addDirection('down', 'up');

      } else if (yDirection < 0) {

        addDirection('up', 'down');

      } else {

        removeDirection('down');
        removeDirection('up');

      }

      // enforce velocity limits

      if (data.vX > 0) {

        data.vX = Math.min(data.vxMax, data.vX);

      } else if (data.vX < 0) {

        data.vX = Math.max(-data.vxMax, data.vX);

      }

      if (data.vY > 0) {

        data.vY = Math.min(data.vyMax, data.vY);

      } else if (data.vY < 0) {

        data.vY = Math.max(-data.vyMax, data.vY);

      }

    }

    function endThrust() {

      if (!data.thrusting) {
        return;
      }

      utils.css.remove(o, css.thrusting);

      data.thrusting = false;

      if (features.audio) {
        // initial start.
        audio.thrustStart.stop();
        audio.thrustLoop.stop();
      }

    }

    function isThrusting() {

      return data.thrusting;

    }

    function stop() {

      // kill movement and thrust, etc.
      endThrust();
      data.vX = 0;
      data.vY = 0;

    }

    function killGunFire() {

      var i, j;

      for (i = 0, j = objects.shipGunfire.length; i < j; i++) {

        objects.shipGunfire[i].die();

      }

      // clean out the array, too.
      objects.shipGunfire = [];

    }

    function animateGunFire() {

      // this array should be empty / zero when no gunfire is active, since objects self-destruct.

      var i, j,
          items = objects.shipGunfire;

      if (items.length) {

        // console.log('animating ' + items.length + ' gunfire objects');

        for (i = 0, j = items.length; i < j; i++) {
          // do yo' thang.
          items[i].animate();
        }

      }

    }

    function startFire() {

      if (data.firing) {
        return;
      }

      data.firing = true;

    }

    function endFire() {

      if (!data.firing) {
        return;
      }

      data.firing = false;

      // note: continue animating active elements, regardless of firing state.

    }

    function fire() {

      if (!data.firing || data.dying || data.dead) {
        return;
      }

      // for alignment with ship sprite...
      var xOffset = 13;
      var yOffset = 13;

      // create two new fire objects, on opposite axes.

      var xDir = (data.thrustDirection.left ? -1 : (data.thrustDirection.right ? 1 : 0));
      var yDir = (data.thrustDirection.up ? -1 : (data.thrustDirection.down ? 1 : 0));

      objects.shipGunfire.push(new ShipGunfire({
        vX: xDir,
        vY: yDir,
        x: data.x + xOffset,
        y: data.y + yOffset,
        // TODO: Review w/h
        w: 7,
        h: 7
      }));

      // mirror gunfire
      objects.shipGunfire.push(new ShipGunfire({
        vX: xDir * -1,
        vY: yDir * -1,
        x: data.x + xOffset,
        y: data.y + yOffset,
        w: 7,
        h: 7
      }));

    }

    function maybeFire() {

      // is the fire key being pressed? fire if so.

      if (game.objects.keyboardMonitor.isDown('shift') || game.objects.keyboardMonitor.isDown('ctrl')) {
        fire();
      }

    }

    function decelerate() {

      // simulate the effects of friction.

      var isDown = game.objects.keyboardMonitor.isDown;

      if (!isDown('left') && !isDown('right')) {
        if (Math.abs(data.vX) > data.almostZero) {
          data.vX *= data.decelRate;
        } else {
          data.vX = 0;
        }
      } else if ((isDown('left') && data.vX > 0) || (isDown('right') && data.vX < 0)) {
        // opposite direction thrust case
        data.vX *= data.decelRate;
      }

      if (!isDown('up') && !isDown('down')) {
        if (Math.abs(data.vY) > data.almostZero) {
          data.vY *= data.decelRate;
        } else {
          data.vY = 0;
        }
      } else if ((isDown('up') && data.vY > 0) || (isDown('down') && data.vY < 0)) {
        data.vY *= data.decelRate;
      }

    }

    function isAlive() {

      return (!data.dying && !data.dead);

    }

    function die() {

      if (data.dying || data.dead) {
        // already underway or done.
        return;
      }

      var i, j,
          x = data.x,
          y = data.y,
          directions = [
           [-1,-1],
           [0,-1],
           [1,-1],
           [1,0],
           [1,1],
           [0,1],
           [-1,1],
           [-1,0]
          ];

      data.dying = true;

      if (features.audio) {
        audio.explode.play();
      }

      hide();

      // gunfire should die at this point, too
      killGunFire();

      // create explosion object (if needed), position here and go boom.
      if (!objects.explosion) {

        objects.explosion = [];

        for (i = 0, j = directions.length; i < j; i++) {
          objects.explosion.push(new BigExplosion({
            animationModulus: 6,
            node: game.dom.world,
            x: x,
            y: y,
            vX: directions[i][0],
            vY: directions[i][1]
          }));
        }

      }

      // next animation loop will pick up from here.

    }

    function findSafeRespawnLocation() {

      // based on existing row/col, find nearby dead wall space (or open space) to occupy.

      var freeSpace;

      freeSpace = findFreeSpace(data.col, data.row);

      // hack: directly assign ship row/col, so they are picked up when moveBy() is later applied.
      game.objects.ship.data.col = freeSpace[0];
      game.objects.ship.data.row = freeSpace[1];

      // prevent ship driving
      game.objects.keyboardMonitor.releaseAll();

      // also, stop any velocity that may be applied.
      game.objects.ship.stop();

      // hide();

      moveTo(game.data.NODE_WIDTH * Math.floor(game.objects.ship.data.col), game.data.NODE_HEIGHT * Math.floor(game.objects.ship.data.row));

      // show();

    }

    function dieComplete() {

      // minus one man. next screen, game over, etc.?

      var isGameOver;

      isGameOver = game.objects.gameController.shipDied();

      if (!isGameOver) {

        window.setTimeout(function() {
          findSafeRespawnLocation();
          resetShip();
        }, 500);

      }

    }

    function animateExplosion() {

      var i, j;
      var inactive = 0;

      for (i = 0, j = objects.explosion.length; i < j; i++) {
        inactive += objects.explosion[i].animate();
      }

      if (inactive >= objects.explosion.length) {

        // all objects have finished animating.
        for (i = 0, j = objects.explosion.length; i < j; i++) {
          objects.explosion[i].destruct();
        }

        objects.explosion = null;

        // ship is now dead.
        data.dying = false;
        data.dead = true;

        dieComplete();

      }

    }

    function collisionCheck(point) {

      // return true if ship intersects a given box with x/y/w/h.

      var intersects = game.objects.collision.check(point, {
        x: data.x,
        y: data.y,
        w: data.w,
        h: data.h
      });

      return intersects;

    }

    function gunfireCollisionCheck() {

      // check ship fire for collision
      var i, j,
          items = objects.shipGunfire,
          result,
          results = [],
          hit = false,
          incrementPitch = false,
          audioPitch,
          toRemove = [];

      if (items.length) {

        for (i = 0, j = items.length; i < j; i++) {

          result = objects.shipGunfire[i].collisionCheck();

          if (result) {

            // if there was a hit, allow pitch to increase.
            if (result.incrementPitch) {
              incrementPitch = true;
            }

            if (result.hit) {
              hit = true;
            }

            results.push(result);

          }

          // is this now dead (or killed elsewhere, ie., hitting a bad guy), and needing clean-up?
          if (objects.shipGunfire[i].data.dead) {
            toRemove.push(i);
          }

        }

        // TODO: sound should only be played when hitting blocks.
        if (hit && features.audio) {

          // make noise.
          audioPitch = getAudioPitch();

          if (features.audio) {

            soundSprites.playPop(audioPitch);

          }

        }

        if (incrementPitch) {
          incrementAudioPitch();
        }

      }

      // remove dead items from the array
      if (toRemove.length) {
        for (i = toRemove.length - 1; i >= 0; i--) {
          objects.shipGunfire.splice(toRemove[i], 1);
        }
      }

    }

    function gridCollisionCheck() {

      /**
       * compares ship coords to grid, looks for collisions.
       */

      var i, j,
          intersects,
          item,
          hit,
          mapObjectItem;

      if (data.x !== data.lastCollisionX || data.y !== data.lastCollisionY) {

        // refresh and update collision
        data.lastCollisionX = data.x;
        data.lastCollisionY = data.y;

        intersects = game.objects.collision.checkGrid({
          x: data.x,
          y: data.y,
          w: data.w,
          h: data.h,
          includeNeighbours: true
        });

        for (i = 0, j = intersects.length; i < j; i++) {

          item = game.data.map[intersects[i].row][intersects[i].col];

          if (item) {

            if (item.hittable && item.hittable()) {

              // is this an active item? alive, not dead etc.?

              // additional pixel-level collision check?

              if (item.pixelCollisionCheck) {

                // HACK (sorta): check current position, and (potentially) last two in-between coordinates
                // given bullet may "skip" walls otherwise
                // i.e., cover (almost) the full range of movement

                hit = item.pixelCollisionCheck({
                  type: 'ship',
                  x: data.x,
                  y: data.y,
                  w: data.w,
                  h: data.h
                });

                if (hit) {
                  console.log('ship: pixel-level collision check with item', item);
                  game.objects.ship.die();
                  return;
                }

              } else {

                // kill the ship?
                console.log('ship collision: hittable grid item', item);

                game.objects.ship.die();
                return;

              }

            }

          } else {

            // check moving grid items

            // if (!intersects[i].isNeighbour) {

              // look only at midpoint, exclude neighbours...

              mapObjectItem = game.objects.turretGunfireMap.check(intersects[i].row, intersects[i].col);

              if (mapObjectItem) {

                // console.log('found turret gunfire', mapObjectItem);

                // additional pixel-level collision check
                if (mapObjectItem.pixelCollisionCheck) {

                  hit = mapObjectItem.pixelCollisionCheck({
                    type: 'ship',
                    x: data.x,
                    y: data.y,
                    w: data.w,
                    h: data.h
                  });

                } else {

                  // we have an object. do a collision check.
                  hit = mapObjectItem.collisionCheck();

                }

                if (hit) {
                  console.log('ship hit moving item', mapObjectItem);
                  game.objects.ship.die();
                  return;
                }

              } else {

                // did we hit a spaceball?
                mapObjectItem = game.objects.spaceBallMap.check(intersects[i].row, intersects[i].col);

                if (mapObjectItem) {

                  // console.log('found spaceball');

                  // we have an object. do a collision check.
                  // hit = mapObjectItem.hittable();

                  hit = mapObjectItem.pixelCollisionCheck({
                    type: 'ship',
                    x: data.x - (data.vX * 0.5),
                    y: data.y - (data.vY * 0.5),
                    w: data.w,
                    h: data.h
                  });

                  if (hit) {
                    console.log('spaceball hit ship');
                    game.objects.ship.die();
                    return;
                  }

                }

              }

              // }

          }

        }

      } else {

        // ship not moving, but check other items for intersects (and smashy smashy)

        intersects = game.objects.collision.checkGrid({
          x: data.x,
          y: data.y,
          w: data.w,
          h: data.h,
          includeNeighbours: true
        });

        if (intersects && intersects.length) {

          for (i = 0, j = intersects.length; i < j; i++) {

            // whether moving or not - did we hit turret gunfire?

            mapObjectItem = game.objects.turretGunfireMap.check(intersects[i].row, intersects[i].col);

            if (mapObjectItem) {

              // console.log('found turret gunfire', mapObjectItem);

              // additional pixel-level collision check
              if (mapObjectItem.pixelCollisionCheck) {

                hit = mapObjectItem.pixelCollisionCheck({
                  type: 'ship',
                  x: data.x,
                  y: data.y,
                  w: data.w,
                  h: data.h
                });

              } else {

                // we have an object. do a collision check.
                hit = mapObjectItem.collisionCheck();

              }

              if (hit) {
                console.log('ship hit turret gunfire');
                game.objects.ship.die();
                return;
              }

            // don't check neighbouring locations, in this case...
            } else if (!intersects[i].isNeighbour) {

              // did we hit a spaceball?
              mapObjectItem = game.objects.spaceBallMap.check(intersects[i].row, intersects[i].col);

              if (mapObjectItem) {

                console.log('found spaceball');

                // we have an object. do a collision check.
                // hit = mapObjectItem.hittable();

                hit = mapObjectItem.pixelCollisionCheck({
                  type: 'ship',
                  x: data.x - (data.vX * 0.5),
                  y: data.y - (data.vY * 0.5),
                  w: data.w,
                  h: data.h
                });

                if (hit) {
                  game.objects.ship.die();
                  return;
                }

              }

            }

          }

        }

      }

    }

    function moveBy(x,y) { // TODO: Rename to be relative column distances or something

      var row, col,
          w = game.data.NODE_WIDTH,
          h = game.data.NODE_HEIGHT,
          targetX,
          targetY;

      col = Math.min(game.data.world_cols, Math.max(0, data.col + x));
      row = Math.min(game.data.world_rows, Math.max(0, data.row + y));

      if (col !== data.col || row !== data.row) {

        // broadcast event?
        data.col = col;
        data.row = row;

      }

      targetX = (w * data.col) + (w * (x / w));
      targetY = (h * data.row) + (h * (y / h));

      // limit ship x/y to world dimensions

      targetX = Math.max(0, Math.min(game.data.world_width, targetX));
      targetY = Math.max(0, Math.min(game.data.world_height, targetY));

      moveTo(targetX, targetY);

    }

    function animate() {

      // apply continued x/y velocities and move.

      var k = game.objects.keyboardMonitor;

      var x = 0;
      var y = 0;

      if (!data.dying && !data.dead) {

        decelerate();

        if (k.isDown('up')) {
          y = -1;
        }

        if (k.isDown('left')) {
          x = -1;
        }

        if (k.isDown('right')) {
          x = 1;
        }

        if (k.isDown('down')) {
          y = 1;
        }

        // thrust if acceleration is needed
        if (x || y) {
          thrust(x, y);
        }

        moveBy(data.vX, data.vY);

        animateGunFire();

        // collision checks

        gridCollisionCheck();

        gunfireCollisionCheck();

        game.objects.badGuyController.collisionCheck();

      } else if (data.dying) {

        // animate explosions?
        if (!data.dead) {

          animateExplosion();

        }

      }

    }

    function setDefaultPosition() {

      // center relative to screen midsection?

      var w, h, x, y, row, col;

      w = game.objects.screen.data.coords.width;
      h = game.objects.screen.data.coords.height;

      x = (parseInt(w / 2, 10) - game.data.NODE_WIDTH);
      y = (parseInt(h / 2, 10) - game.data.NODE_HEIGHT);

      // HACK
      x = 32 * DEFAULT_HOME_COL;
      y = 32 * DEFAULT_HOME_ROW;

      col = Math.floor(x / game.data.NODE_WIDTH);
      row = Math.floor(y / game.data.NODE_HEIGHT);

      data.col = col;
      data.row = row;

      // round x/y now to nearest row/col
      x = data.col * game.data.NODE_WIDTH;
      y = data.row * game.data.NODE_HEIGHT;

      moveTo(x,y);

      game.objects.screen.centerAtPoint(x, y);

    }

    function getNode() {

      return o;

    }

    function initSound() {

      if (features.audio) {

        audio.thrustStart = soundManager.createSound({
          id: 'ship-thrust-start',
          url: 'audio/ship-thrust-start.mp3',
          autoLoad: true
        });

        audio.thrustLoop = soundManager.createSound({
          id: 'ship-thrust-loop',
          url: 'audio/ship-thrust-loop.mp3',
          loops: 999,
          autoLoad: true
        });

        audio.explode = soundManager.createSound({
          id: 'ship-explode',
          url: 'audio/ship-explode.mp3',
          autoLoad: true
        });

      }

    }

    function initShip() {

      o = document.createElement('div');
      o.className = 'ship';

      hide();

      game.dom.worldFragment.appendChild(o);

      show();

      initSound();

    }

    return {

      animate: animate,
      collisionCheck: collisionCheck,
      data: data,
      decelerate: decelerate,
      die: die,
      isAlive: isAlive,
      fire: fire,
      endFire: endFire,
      maybeFire: maybeFire,
      objects: objects,
      startFire: startFire,
      init: initShip,
      isThrusting: isThrusting,
      endThrust: endThrust,
      moveBy: moveBy,
      moveTo: moveTo,
      getNode: getNode,
      reset: resetShip,
      stop: stop,
      thrust: thrust,
      setDefaultPosition: setDefaultPosition,
      findSafeRespawnLocation: findSafeRespawnLocation

    };

  }

  function BaseWall(oOptions) {

    /**
     * a component of a "base"
     * consisting of walls and turrets
     */

    var o;

    // var frameCount = 0;

    var css = {
      exploding: 'exploding',
      exploded: 'exploded'
    };

    var data = {
      col: oOptions.col,
      row: oOptions.row,
      x: oOptions.col * game.data.NODE_WIDTH,
      y: oOptions.row * game.data.NODE_HEIGHT,
      w: 32,
      h: 32,
      type: oOptions.type,
      subType: oOptions.subType,
      exploding: false,
      exploded: false,
      explosionFrame: 0,
      explosionFrames: 6
    };

    function destruct() {

      if (o) {

        o.parentNode.removeChild(o);
        o = null;

      }

    }

    function explode() {

      if (!data.exploding) {
        data.exploding = true;
        utils.css.add(o, css.exploding);
      }

    }

    function explodeComplete() {

      if (data.exploding) {
        data.exploding = false;
        data.exploded = true;
        // utils.css.swap(o, css.exploding, css.exploded);
        utils.css.remove(o, css.exploding);
        utils.css.add(o, css.exploded);
      }

      destruct();

    }

    function animate() {

      if (!data.exploded && data.exploding) {

        // frameCount++;

        // if (frameCount % 2 === 0) {

        o.style.backgroundPosition = '0px ' + (data.explosionFrame * -32) + 'px';
        data.explosionFrame++;
        if (data.explosionFrame >= data.explosionFrames) {
          data.explosionFrame = 0;
        }

        // }

      }

    }

    function pixelCollisionCheck(localOptions) {

      var hitObject;
      var collision = game.objects.collision;

      var wallType = (data.type + '-' + data.subType).replace(' ', '-');
      wallType = wallType.replace(/wall-type-[234]/i, 'wall-type-generic');

      // console.log('comparing ' + oOptions.type + ' <-> ' + wallType);

      hitObject = collision.checkSprites({
         object1: localOptions,
         object2: {
           type: wallType,
           x: data.x,
           y: data.y,
           w: data.w,
           h: data.h
         }
      });

      return hitObject;

    }

    function hit() {
      // walls absorb gunfire, do nothing.
      console.log('wall hit, doing nothing');
    }

    function hittable() {
      // considered hittable until exploded.
      return !data.exploded;
    }

    function initBaseWall() {

      if (!o) {

        o = makeGridItem({
          x: data.col,
          y: data.row,
          type: data.type,
          subType: data.subType
        });

      }

      game.dom.worldFragment.appendChild(o);

    }

    function restore() {

      if (data.exploded) {
        data.exploded = false;
      }

      initBaseWall();

    }

    initBaseWall();

    return {
      animate: animate,
      data: data,
      // die: die,
      explode: explode,
      explodeComplete: explodeComplete,
      hit: hit,
      hittable: hittable,
      pixelCollisionCheck: pixelCollisionCheck,
      restore: restore
    };

  }

  function ObjectMap() {

    // 2D array tracking references to game objects
    // for quick lookup (for collision purposes)

    var map = [];

    // hash which tracks last row/col
    var lastLocation = {};

    function check(row, col) {

      // a dead-simple lookup.
      // TODO: consider safety check.

      // first, round down to ensure we have an integer.
      row = Math.floor(row);
      col = Math.floor(col);

      return map[row] !== undefined && map[row][col] !== undefined ? map[row][col] : null;

    }

    function clearLocation(id) {

      // given an object ID, remove its registered location in the map.

      var previous;

      if (lastLocation[id] !== undefined) {
        previous = lastLocation[id];
        if (map[previous.row] && map[previous.row][previous.col]) {
          map[previous.row][previous.col] = null;
        }
        delete lastLocation[id];
      }

    }

    function registerLocation(oOptions) {

      // register an object as being at x,y

      // { object, row, col }

      var o = oOptions.object,
          id = oOptions.id,
          col = oOptions.col,
          row = oOptions.row;

      if (id === undefined) {
        console.log('registerLocation: id required.');
        return;
      }

      // first, see if this object is already somewhere else, and remove it if so

      clearLocation(id);

      // register new location (TODO: if row/col ranges are valid?)

      // console.log('registering ' + col + ', ' + row);

      if (map[row] === undefined || map[row][col] === undefined) {
        console.log('registerLocation(): row/col ' + row + ', ' + col + ' is invalid?');
        return;
      }

      map[row][col] = o;

      // and for future removal...
      lastLocation[id] = {
        row: row,
        col: col
      };

    }

    function initObjectMap() {

      var i, j, k, l;

      for (i = 0, j = game.data.world_rows; i < j; i++) {
        map[i] = [];
        for (k = 0, l = game.data.world_cols; k < l; k++) {
          map[i][k] = null;
        }
      }

      // console.log('ObjectMap.init(): made map of ' + map.length + ' x ' + map[0].length);

    }

    function resetObjectMap() {

      // just re-init empty array
      initObjectMap();

    }

    initObjectMap();

    return {

      check: check,
      registerLocation: registerLocation,
      clearLocation: clearLocation,
      map: map,
      reset: resetObjectMap

    };

  }

  var turretGunfireTemplate = document.createElement('div');
  var turretGunfireTemplates = {
    up: null,
    down: null,
    left: null,
    right: null
  };

  var turretGunfireCounter = 0;

  function TurretGunfire(oOptions) {

    // append to turret container element, relative to it.

    var o,
        data,
        objectInterface,
        directionsMap = {
          left: 'horizontal',
          right: 'horizontal',
          up: 'vertical',
          down: 'vertical'
        },
        nodeParent = game.dom.world;

    data = {
      // note use of worldFragment vs. parent (turret) node, testing performance
      active: false,
      dead: false,
      id: 'turretGunfire' + (turretGunfireCounter++),
      type: 'turret-gunfire',
      subType: oOptions.direction,
      visible: false,
      x: oOptions.x,
      y: oOptions.y,
      w: oOptions.w,
      h: oOptions.h,
      turretX: oOptions.turretX,
      turretY: oOptions.turretY,
      xDirection: oOptions.vX,
      yDirection: oOptions.vY,
      vX: (game.data.NODE_WIDTH / 10) * oOptions.vX,
      vY: (game.data.NODE_HEIGHT / 10) * oOptions.vY,
      row: oOptions.row,
      col: oOptions.col,
      endRow: null,
      endCol: null,
      lastRow: null,
      lastCol: null,
      lastX: null,
      lastY: null,
      lastCollisionX: null,
      lastCollisionY: null,
      lastCollisionResult: null
    };

    function hide() {

      if (data.visible) {
        data.visible = false;
        if (o && nodeParent) {
          o.style.visibility = 'hidden';
        }
      }

    }

    function show() {

      if (!data.visible) {
        data.visible = true;
        if (o && nodeParent) {
          o.style.visibility = 'visible';
        }
      }

    }

    function moveTo(x,y) {

      var location, endX, endY;

      if (!data.active) {
        return;
      }

      x = Math.floor(x);
      y = Math.floor(y);

      location = game.objects.collision.xyToRowCol(data.turretX + x, data.turretY + y);

      if (o) {

        // note position is relative to body, not parent turret node.

        if (game.objects.screen.isInView(location.col, location.row)) {

          endX = data.turretX + x;
          endY = data.turretY + y;

          if (USE_TRANSFORM) {

            o.style[features.transform.prop] = 'translate3d(' + endX + 'px, ' + endY + 'px, 0px)';

          } else {

            o.style.left = endX + 'px';
            o.style.top = endY + 'px';

          }

          show();

        } else {

          hide();

        }

        data.lastX = x;
        data.lastY = y;

      }

      if (location.col !== data.lastCol || location.row !== data.lastRow) {

        data.col = location.col;
        data.row = location.row;

        game.objects.turretGunfireMap.registerLocation({
          object: objectInterface,
          id: data.id,
          col: data.col,
          row: data.row
        });

      }

    }

    function moveBy(x, y) { // TODO: labels for relative grid item values?

      // move and do collision check?
      data.x += (x * game.objects.gameLoop.data.speedMultiplier * game.objects.gameLoop.data.GAME_SPEED);
      data.y += (y * game.objects.gameLoop.data.speedMultiplier * game.objects.gameLoop.data.GAME_SPEED);

      moveTo(data.x, data.y);

    }

    function resetTurretGunfire() {

      hide();

      data.active = false;

      data.x = 0;
      data.y = 0;

      moveTo(data.x, data.y);

    }

    function expireCheck() {

      // stop if it's about to hit a grid space occupied by a block (even if the block is dead.)

      var shouldExpire;

      if (data.xDirection === 1) {
        shouldExpire = (data.col >= data.endCol);
      } else if (data.xDirection === -1) {
        shouldExpire = (data.col <= data.endCol);
      } else if (data.yDirection === 1) {
        shouldExpire = (data.row >= data.endRow);
      } else if (data.yDirection === -1) {
        shouldExpire = (data.row <= data.endRow);
      }

      if (shouldExpire) {
        resetTurretGunfire();
      }

    }

    function findDestinationBlock() {

      // based on start x/y and direction, figure out where the shot should end (before hitting a block.)
      // reference: data.endRow, data.endCol

      if (data.endCol !== null || data.endRow !== null) {
        // this has already been done.
        return;
      }

      var col = data.col,
          row = data.row;

      do {
        // find the next occupied grid item.
        col += data.xDirection;
        row += data.yDirection;
      } while (game.data.map[row][col] === null && col && row && col < game.data.world_cols && row < game.data.world_rows);

      // if heading down or right, subtract one to prevent target overlap.
      if (data.xDirection === 1) {
        col--;
      } else if (data.yDirection === 1) {
        row--;
      }

      // console.log('direction x/y, ' + data.xDirection + ', ' + data.yDirection + ', start / end: ', data.col + ', ' + data.row + ', end: ' + col + ', ' + row);

      data.endRow = row;
      data.endCol = col;

    }

    function fire() {

      if (!data.dead && !data.active) {
        findDestinationBlock();
        data.active = true;
      }

    }

    function collisionCheck() {

      // if this object is being referenced, we already know there's a potential collision.
      // so just return the active state.

      return (data.active && data.visible);

    }

    function pixelCollisionCheck(localOptions) {

      var hit;
      var collision = game.objects.collision;

      hit = collision.checkSprites({
         object1: localOptions,
         object2: {
           type: data.type + '-' + directionsMap[data.subType],
           x: data.turretX + data.x,
           y: data.turretY + data.y,
           w: data.w,
           h: data.h
         }
      });

      return (hit && data.active && data.visible);

    }

    function animate() {

      // may be inactive, or died and awaiting cleanup
      if (!data.active) {
        return;
      }

      show();

      // increase frame count, move vX + vY
      moveBy(data.vX, data.vY);

      // and do collision check?
      collisionCheck();

      // should this shot "expire"?
      expireCheck();

    }

    function die() {

      // called when end of screen hit, or object hit (or turret dies)
      resetTurretGunfire();

    }

    /*
    function destruct() {
      // remove from the dom, etc.
      if (o) {
        hide();
        o = null;
      }
    }
    */

    function initTurretGunfire() {


      if (!o) {

        if (!turretGunfireTemplates[oOptions.direction]) {

          // make one, then clone for future re-use.
          o = turretGunfireTemplate.cloneNode(true);
          o.className = 'turret-gunfire ' + oOptions.direction;
          turretGunfireTemplates[oOptions.direction] = o;

        } else {

          o = turretGunfireTemplates[oOptions.direction].cloneNode(true);

        }

      }

      // append to DOM
      // parentNode.appendChild(o);

      nodeParent.appendChild(o);

    }

    function restore() {

      data.dead = false;

      initTurretGunfire();

    }

    // hack/convenience: start right away?
    initTurretGunfire();

    // fire();

    objectInterface = {
      animate: animate,
      collisionCheck: collisionCheck,
      data: data,
      die: die,
      fire: fire,
      init: initTurretGunfire,
      pixelCollisionCheck: pixelCollisionCheck,
      reset: resetTurretGunfire,
      restore: restore
    };

    return objectInterface;

  }

  function Turret(oOptions) {

    /**
     * a component of a "base"
     * creates a TurretGunfire() instance
     */

    var o;

    // var frameCount = 0;

    var css = {
      exploding: 'exploding',
      exploded: 'exploded',
      dead: 'dead'
    };

    var objects = {
      turretGunfire: null
    };

    var directions = {
      x: {
        left: -1,
        right: 1
      },
      y: {
        up: -1,
        down: 1
      }
    };

    var directionsMap = {
      left: 'vertical',
      right: 'vertical',
      up: 'horizontal',
      down: 'horizontal'
    };

    var _direction = oOptions.subType.split(' ')[1]; // hack-ish :D

    var data = {
      col: oOptions.col,
      row: oOptions.row,
      direction: _direction,
      x: oOptions.col * game.data.NODE_WIDTH,
      y: oOptions.row * game.data.NODE_HEIGHT,
      w: game.data.NODE_WIDTH,
      h: game.data.NODE_HEIGHT,
      type: oOptions.type,
      subType: oOptions.subType,
      wallType: 'wall', // for pixel map references when dead
      wallDirection: directionsMap[_direction],
      points: 500,
      dead: false,
      // firing: false,
      exploding: false,
      baseExploding: false,
      exploded: false,
      explosionFrame: 0,
      explosionFrames: 6
    };

    /*
    function getNode() {
      return o;
    }
    */

    // events.gameLoop?

    function maybeFire() {

      // give 'er
      if (!data.dead && objects.turretGunfire) {
        objects.turretGunfire.fire();
      }

    }

    function createTurretGunfire() {

      if (objects.turretGunfire) {
        return;
      }

      objects.turretGunfire = new TurretGunfire({
        x: 0,
        y: 0,
        w: game.data.NODE_WIDTH,
        h: game.data.NODE_HEIGHT,
        turretX: data.x,
        turretY: data.y,
        col: data.col,
        row: data.row,
        vX: directions.x[data.direction] || 0,
        vY: directions.y[data.direction] || 0,
        direction: data.direction,
        node: o
      });

    }

    function pixelCollisionCheck(localOptions) {

      if (!data.dead) {
        // hack: while alive, count all pixels as hittable and always return true.
        // only do pixel check when dead, and shown as a wall.
        // console.log('Turret pixelCollisionCheck: turret alive, force-returning true');
        return true;
      }

      var hitObject;
      var collision = game.objects.collision;

      // HACK: Note use of -type-generic-, slightly inaccurate when on -type-1 turrets that have become walls.
      var wallType = (data.wallType + '-type-generic-' + data.wallDirection).replace(' ', '-');

      hitObject = collision.checkSprites({
         object1: localOptions,
         object2: {
           type: wallType,
           x: data.x,
           y: data.y,
           w: data.w,
           h: data.h
         }
      });

      return hitObject;

    }

    function explode(isBaseExplosion) {

      if (isBaseExplosion) {
        data.baseExploding = true;
      }

      if (data.dead && !data.exploded && !data.exploding) {
        data.exploding = true;
        utils.css.remove(o, css.dead); // hack to allow bgposition to work again
        utils.css.add(o, css.exploding);
      }

    }

    function die() {

      if (data.dead) {
        return;
      }

      data.dead = true;

      explode();

      game.objects.gameController.addPoints(data.points);

      if (features.audio) {
        // make noise.
        incrementAudioPitch();
        soundSprites.playBoom(audioBoomScale[getAudioPitch()]);
      }

      game.objects.statsController.record('turret');

      // don't let gunfire respawn?
      // objects.turretGunfire.data.dead = true;

    }

    function dieComplete() {

      if (o) {
        utils.css.add(o, css.dead);
      }

      data.exploding = false;

      if (!data.baseExploding) {
        // allow again, i.e., for base explosion.
        data.exploded = false;
      }

      // data.active = false;

    }

    function hit() {

      // boom.
      die();

    }

    function stopGunfire() {

      if (objects.turretGunfire) {
        objects.turretGunfire.die();
      }

    }

    function hittable() {
      // considered hittable until exploded.
      return !data.exploded;
    }

    function destruct() {

      if (o) {

        o.parentNode.removeChild(o);
        o = null;

      }

    }

    function explodeComplete() {

      if (data.exploding) {

        data.exploding = false;
        data.exploded = true;

        // utils.css.swap(o, css.exploding, css.exploded);

        utils.css.remove(o, css.exploding);

        dieComplete();

        if (data.baseExploding) {

          stopGunfire();

          // and self-destruct.
          utils.css.add(o, css.exploded);
          destruct();

        } // else, only the turret is dead.

      }

    }

    function animate() {

      // called from main game loop
      // fire and animate

      if (objects.turretGunfire) {
        objects.turretGunfire.animate();
      }

      if (data.exploding) {

        // frameCount++;

        // if (frameCount % 2 === 0) {

          // individual turret + base destruction animation

          o.style.backgroundPosition = '0px ' + (-32 * data.explosionFrame) + 'px';

          data.explosionFrame++;

          if (data.explosionFrame >= data.explosionFrames) {

            data.explosionFrame = 0;

            if (!data.baseExploding) {

              // end the animation.
              explodeComplete();

            }

          }

        // }

      }

    }

    function initTurret() {

      if (!o) {

        o = makeGridItem({
          x: data.col,
          y: data.row,
          type: data.type,
          subType: data.subType
        });

      }

      createTurretGunfire();

      game.dom.worldFragment.appendChild(o);

    }

    function restore() {

      // reset and re-init

      if (o) {
        // additional hack: reset bgpos, let CSS take over
        o.style.backgroundPosition = '';
      }

      if (data.dead) {
        data.dead = false;
        if (o) {
          utils.css.remove(o, css.dead);
        }
      }

      if (data.exploded) {
        data.exploded = false;
        if (o) {
          utils.css.remove(o, css.exploded);
        }
      }

      data.baseExploding = false;
      data.exploding = false;
      data.explosionFrame = 0;

      initTurret();

    }

    initTurret();

    return {
      animate: animate,
      data: data,
      die: die,
      destruct: destruct,
      explode: explode,
      explodeComplete: explodeComplete,
      hit: hit,
      hittable: hittable,
      maybeFire: maybeFire,
      objects: objects,
      pixelCollisionCheck: pixelCollisionCheck,
      restore: restore
    };

  }

  function Base() {

    /**
     * an object made up of walls and turrets
     * explodes once all turrets have been destroyed
     */

    var objects = {
      walls: [],
      turrets: []
    };

    var data = {
      active: false,
      dead: false,
      deadTurretCount: 0,
      frame: 0,
      dying: false,
      points: 10000
    };

    /*
    var css = {

      wall: {
        base: 'wall',
        up: 'wall-up',
        down: 'wall-down',
        left: 'wall-left',
        right: 'wall-right'
      },

      turret: {
        base: 'turret',
        up: 'turret-up',
        down: 'turret-down',
        left: 'turret-left',
        right: 'turret-right'
      }

    };
    */

    var typeToConstructor = {
      wall: BaseWall,
      turret: Turret
    };

    var typeToArray = {
      // for storing in objects array
      wall: objects.walls,
      turret: objects.turrets
    };

    function addItem(oOptions) {

      // {type, subType, col, row}

      var itemType = oOptions.type,
          itemArray = typeToArray[itemType], // eg. 'wall' -> objects.walls[]
          TargetClass = typeToConstructor[itemType],
          baseItemObject;

      baseItemObject = new TargetClass(oOptions);
      itemArray.push(baseItemObject);

      // mark as active, since an item was registered
      data.active = true;

      return baseItemObject;

    }

    function pulse() {

      var i, j;

      if (!data.active || data.dying || data.dead) {
        return;
      }

      // maybe fire
      for (i = 0, j = objects.turrets.length; i < j; i++) {
        objects.turrets[i].maybeFire();
      }

    }

    function dieComplete() {

        var i, j;

        if (data.dead) {
          return;
        }

        data.dying = false;
        data.dead = true;
        data.frame = 0;

        for (i = 0, j = objects.turrets.length; i < j; i++) {
          objects.turrets[i].explodeComplete();
        }

        for (i = 0, j = objects.walls.length; i < j; i++) {
          objects.walls[i].explodeComplete();
        }

        // ensure the world background resets
        game.dom.world.style.backgroundColor = 'transparent';

        // notify the controller, perhaps finish the level etc
        game.objects.baseController.events.baseDied();

    }

    function dieExplosion() {

      // mark all elements as dying, begin exploding animation
      var i, j;

      for (i = 0, j = objects.turrets.length; i < j; i++) {
        objects.turrets[i].explode(true);
      }

      for (i = 0, j = objects.walls.length; i < j; i++) {
        objects.walls[i].explode();
      }

    }

    function die() {

      if (!data.active || data.dying || data.dead) {
        return;
      }

      if (features.audio) {
        soundManager.play('base-explode');
      }

      data.dying = true;

      game.objects.gameController.addPoints(data.points);

      // increase ship lives, smartbombs etc. as a reward
      game.objects.gameController.data.lives += 3;
      game.objects.ship.data.smartbombs += 2;
      game.objects.gameController.refreshUI();

      game.objects.statsController.record('base');

      // * BOOM *
      setTimeout(dieExplosion, 950);

      // ... and disappear.
      setTimeout(dieComplete, 2500);

    }

    function dieCheck() {

      // if all turrets shot, then BOOM
      if (!data.active || data.dying || data.dead) {
        return;
      }

      if (objects.turrets.length && data.deadTurretCount >= objects.turrets.length) {
        // boom!
        die();
      }

    }

    function resetBase() {

      // bring the base back to life, per se

      if (data.active) {

        data.dead = false;
        data.deadTurretCount = 0;

      }

    }

    function animate() {

      var i, j;

      if (!data.active || (data.dead && !data.dying)) {
        // nothing to do.
        return;
      }

      // animate turret gunfire, OR explosion / death sequence?

      if (!data.dying) {

        // reset...
        data.deadTurretCount = 0;

        for (i = 0, j = objects.turrets.length; i < j; i++) {
          objects.turrets[i].animate();
          data.deadTurretCount += objects.turrets[i].data.dead;
        }

        dieCheck();

      } else {

        // base dying/explosion sequence

        for (i = 0, j = objects.turrets.length; i < j; i++) {
          objects.turrets[i].animate();
        }

        for (i = 0, j = objects.walls.length; i < j; i++) {
          objects.walls[i].animate();
        }

        // flash screen colors, too, once explosion is active (hack)

        if (objects.walls[0].data.exploding) {

          game.dom.world.style.backgroundColor = (data.frame % 2 === 0 ? '#660000' : 'transparent');
          data.frame++;

        }

      }

    }

    return {
      animate: animate,
      addItem: addItem,
      data: data,
      objects: objects,
      pulse: pulse,
      reset: resetBase
    };

  }

  function BaseController() {

    /**
     * all your Base() are belong to BaseController().
     * enumerates bases, updates and so forth.
     */

    /**
     * BASE TYPES
     * UTF8 box-drawing reference: http://en.wikipedia.org/wiki/Box-drawing_characters
     *
     * ┌ ─ ┬ ┐
     * │ ─ │ │
     * ├ ─ ┼ ┤
     * └ ─ ┴ ┘
     *
     * ╔ ═ ╦ ╗
     * ║   ║ ║
     * ╠ ═ ╬ ╣
     * ╚ ═ ╩ ╝
     *
     * ┏ ━ ┳ ┓
     * ┃ ━ ┃ ┃
     * ┣ ━ ╋ ┫
     * ┗ ━ ┻ ┛
     *
     * ╓ ─ ╥ ╖
     * ║ ─ ║ ║
     * ╟ ─ ╫ ╢
     * ╙ ─ ╨ ╜
     *
     */

    var baseItemMap = {

      // type 1
      '┌': ['type-1', 'wall', 'upRight'],
      '┐': ['type-1', 'wall', 'rightDown'],
      '└': ['type-1', 'wall', 'downRight'],
      '┘': ['type-1', 'wall', 'downLeft'],
      '-': ['type-1', 'wall', 'horizontal'], // regular dash - used here to avoid conflict
      '|': ['type-1', 'wall', 'vertical'], // regular pipe character
      '┴': ['type-1', 'turret', 'up'],
      '├': ['type-1', 'turret', 'right'],
      '┬': ['type-1', 'turret', 'down'],
      '┤': ['type-1', 'turret', 'left'],

      // type 2
      '╔': ['type-2', 'wall', 'upRight'],
      '╗': ['type-2', 'wall', 'rightDown'],
      '╚': ['type-2', 'wall', 'downRight'],
      '╝': ['type-2', 'wall', 'downLeft'],
      '═': ['type-2', 'wall', 'horizontal'],
      '│': ['type-2', 'wall', 'vertical'], // not sure why ║ conflicted with type 4, but eh.
      '╩': ['type-2', 'turret', 'up'],
      '╠': ['type-2', 'turret', 'right'],
      '╦': ['type-2', 'turret', 'down'],
      '╣': ['type-2', 'turret', 'left'],

      // type 3
      '┏': ['type-3', 'wall', 'upRight'],
      '┓': ['type-3', 'wall', 'rightDown'],
      '┗': ['type-3', 'wall', 'downRight'],
      '┛': ['type-3', 'wall', 'downLeft'],
      '━': ['type-3', 'wall', 'horizontal'],
      '┃': ['type-3', 'wall', 'vertical'],
      '┻': ['type-3', 'turret', 'up'],
      '┣': ['type-3', 'turret', 'right'],
      '┳': ['type-3', 'turret', 'down'],
      '┫': ['type-3', 'turret', 'left'],

      // type 4
      '╓': ['type-4', 'wall', 'upRight'],
      '╖': ['type-4', 'wall', 'rightDown'],
      '╙': ['type-4', 'wall', 'downRight'],
      '╜': ['type-4', 'wall', 'downLeft'],
      '─': ['type-4', 'wall', 'horizontal'],
      '║': ['type-4', 'wall', 'vertical'],
      '╨': ['type-4', 'turret', 'up'],
      '╟': ['type-4', 'turret', 'right'],
      '╥': ['type-4', 'turret', 'down'],
      '╢': ['type-4', 'turret', 'left']

    };

    var objects = {
      bases: [],
      basesHash: {}
    };

    var data = {
      activeBaseCount: 0,
      deadBaseCount: 0
    };

    // events.loop? animate()?
    var events = {

      animate: function() {

        var i, j;

        for (i = 0, j = objects.bases.length; i < j; i++) {
          objects.bases[i].animate();
        }

      },

      baseDied: function() {

        /**
         * callback for a base explosion.
         * if all basese are dead, end the level.
         * otherwise, advance the pulse stage.
         */

        data.deadBaseCount++;

        if (data.deadBaseCount >= data.activeBaseCount) {

          // end the level.
          game.objects.levelEndSequence.start();

        } else {

          // make the world faster, etc.?
          game.objects.gameLoop.nextPulseStage();

          // and resume (seems redundant)
          // TODO: Remove this.
          game.objects.gameLoop.startTimer();

        }

      },

      pulse: function() {

        var i, j;

        for (i = 0, j = objects.bases.length; i < j; i++) {
          objects.bases[i].pulse();
        }

      }

    };

    function createBase(type) {

      // NOTE: Only one instance of each base type allowed.
      var newBase = new Base(type);
      objects.bases.push(newBase);
      objects.basesHash[type] = newBase;

    }

    function createBases() {

      createBase('type-1');
      createBase('type-2');
      createBase('type-3');
      createBase('type-4');

    }

    function addBaseItem(char, col, row) {

      // given a map character, create and add a wall or turret on the proper base object.
      var itemData,
          baseType,
          baseItemObject;

      // sanity check
      if (baseItemMap[char] === undefined) {
        console.log('addBaseItem(' + char + '): Illegal map character.');
        return false;
      }

      itemData = baseItemMap[char];

      // we now know what base style, type and "direction" of object we're dealing with.
      baseType = itemData[0];

      // console.log('adding base item for character "' + char + '" at row ' + row + ', col ' + col + ': ' + itemData.join(', '));

      // add one wall or turret to a base object.
      baseItemObject = objects.basesHash[baseType].addItem({
        type: itemData[1],
        subType: baseType + ' ' + itemData[2], // eg. type-0 wall downRight
        col: col,
        row: row
      });

      return baseItemObject;

    }

    function isBaseItem(char) {

      // is this a base map character?
      return (char && baseItemMap[char] !== undefined);

    }

    function findActiveBases() {

      // after parsing map, find out which bases are actually "in use."
      var i, j;

      data.activeBaseCount = 0;

      for (i = 0, j = objects.bases.length; i < j; i++) {
        if (objects.bases[i].data.active) {
          data.activeBaseCount++;
        }
      }

    }

    function resetBaseController() {

      var i, j;

      // revert all bases, etc.
      data.deadBaseCount = 0;

      for (i = 0, j = objects.bases.length; i < j; i++) {
        objects.bases[i].reset();
      }

    }

    function initBaseController() {

      createBases();

    }

    return {
      events: events,
      findActiveBases: findActiveBases,
      isBaseItem: isBaseItem,
      addBaseItem: addBaseItem,
      init: initBaseController,
      objects: objects,
      reset: resetBaseController
    };

  }

  function FocusMonitor() {

    /**
     * watches window blur/focus, pauses/resumes the game etc.
     */

    var events = {

      focus: function() {

        game.objects.gameLoop.resume();

      },

      blur: function() {

        game.objects.keyboardMonitor.releaseAll();
        game.objects.gameLoop.pause();

      }

    };

    function addEvents() {

      // release keys, mute audio and pause game on window blur
      if (isIE) {

        utils.events.add(document, 'focusin', events.focus);
        utils.events.add(document, 'focusout', events.blur);

      } else {

        utils.events.add(window, 'focus', events.focus);
        utils.events.add(window, 'blur', events.blur);

      }

    }

    function initFocusMonitor() {

      addEvents();

    }

    return {

      init: initFocusMonitor

    };

  }

  function GameController() {

    var data = {
      score: 0,
      lives: DEFAULT_LIVES
    };

    var dom = {
      lives: null,
      points: null,
      smartbombs: null
    };

    function getScore() {

      return data.score;

    }

    function updatePoints() {

      if (dom.points) {
        dom.points.innerHTML = data.score;
      }

    }

    function addPoints(points) {

      data.score += points;
      updatePoints();

    }

    function updateLives() {

      if (dom.lives) {
        dom.lives.innerHTML = data.lives;
      }

    }

    function updateSmartbombs() {

      if (dom.smartbombs) {
        dom.smartbombs.innerHTML = game.objects.ship.data.smartbombs;
      }

    }

    function shipDied() {

      var o,
          oStats,
          oStatsBody,
          statsData;

      var isGameOver = false;

      data.lives--;

      updateLives();

      if (data.lives <= 0) {

        // game over man, game over!

        o = document.getElementById('game-over-screen');
        oStats = document.getElementById('game-over-stats');
        oStatsBody = o.getElementsByTagName('div')[0];
        statsData = game.objects.statsController.getStats();

        isGameOver = true;

        oStats.innerHTML = [
          '<br>',
          '<p>Your score: ' + game.objects.gameController.getScore() + ' points</p>',
          '<br>',
          '<p>Destruction report:</p>',
          '<div class="fixed"><div class="icon type-2 block"></div> Blocks: ' + statsData.block + '</div>',
          '<div class="fixed"><div class="icon type-1 turret right"></div> Turrets: ' + statsData.turret + '</div>',
          '<div class="fixed"><div class="icon type-1 wall rightDown"></div> Bases: ' + statsData.base + '</div>',
          '<div class="fixed bad-guy smiley"><div class="icon"></div> Bad guys: ' + statsData.badGuy + '</div>'
        ].join('');

        o.style.display = 'block';

        // position
        oStatsBody.style.marginTop = -parseInt(oStats.offsetHeight / 2, 10) + 'px';

        // objects.gameLoop.pause();

        document.onclick = function() {

          // game reset? title screen?

          document.onclick = null;

          o.style.display = 'none';

          // reset the whole (entire) game

          survivor.reset();

          game.objects.gameLoop.resume();

        };

      }

      return isGameOver;

    }

    function refreshUI() {

      updateLives();
      updatePoints();
      updateSmartbombs();

    }

    function resetGameController() {

      // assign defaults to data like lives, smartbombs etc.

      game.objects.ship.data.smartbombs = DEFAULT_SMARTBOMBS;
      data.score = 0;
      data.lives = DEFAULT_LIVES;

      refreshUI();

    }

    function initGameController() {

      dom.lives = document.getElementById('lives');
      dom.points = document.getElementById('points');
      dom.smartbombs = document.getElementById('smartbombs');

      refreshUI();

    }

    return {

      addPoints: addPoints,
      data: data,
      init: initGameController,
      getScore: getScore,
      refreshUI: refreshUI,
      reset: resetGameController,
      shipDied: shipDied,
      updateSmartbombs: updateSmartbombs

    };

  }

  function SmartbombController() {

    var data = {
      active: false,
      flashColor: '#fff',
      frame: 0,
      frameCount: 4
    };

    function animate() {

      if (data.active) {

        data.frame++;

        if (data.frame <= data.frameCount) {

          game.dom.world.style.backgroundColor = (data.frame % 2 === 0 ? data.flashColor : 'transparent');

        } else {

          game.dom.world.style.backgroundColor = 'transparent';

          data.frame = 0;

          data.active = false;

        }

      }

    }

    function fire() {

      // play noise, decrement and so forth

      if (!data.active && game.objects.ship.data.smartbombs > 0) {

        data.active = true;

        game.objects.ship.data.smartbombs--;

        // take out any active bad guys
        game.objects.badGuyController.killAll();

        // update the status bar UI
        game.objects.gameController.updateSmartbombs();

      } else {

        console.log('no more smartbombs');

      }

    }

    return {
      animate: animate,
      fire: fire
    };

  }

  function StatsController() {

    var data = {
      block: 0,
      badGuy: 0,
      turret: 0,
      base: 0
    };

    function record(type, amount) {

      if (data[type] !== undefined) {
        data[type] += (amount || 1);
      }

    }

    function getStats() {
      return data;
    }

    function resetStatsController() {

      data.blocks = 0;
      data.badGuys = 0;
      data.turrets = 0;
      data.bases = 0;

    }

    return {
      getStats: getStats,
      record: record,
      reset: resetStatsController
    };

  }

  (function debugPanel() {

    var data = {

      timer: null,
      timerInterval: 1000

    };

    var dom = {

      divCount: null,
      divBlockCount: null,
      divWallCount: null,
      divTurretCount: null,
      turretFireCount: null,
      spaceballCount: null,
      badGuyCount: null

    };

    function handleChange(e) {

      e = e || window.event;

      if (e.target && e.target.type === 'checkbox') {

        // depending on checked state, add or remove the target ID as a className on the world.

        utils.css[e.target.checked ? 'add' : 'remove'](game.dom.world, e.target.id);

      }

    }

    function refreshStats() {

      var i, j, k, l,
          onScreen = 0,
          bases;

      bases = game.objects.baseController.objects.bases;

      for (i = 0, j = bases.length; i < j; i++) {
        for (k = 0, l = bases[i].objects.turrets.length; k < l; k++) {
          if (!bases[i].objects.turrets[k].objects.turretGunfire.data.dead && game.objects.screen.isInView(bases[i].objects.turrets[k].objects.turretGunfire.data.col, bases[i].objects.turrets[k].objects.turretGunfire.data.row)) {
            onScreen++;
          }
        }
      }

      dom.divCount.innerHTML = document.querySelectorAll('#world div').length;

      dom.divBlockCount.innerHTML = document.querySelectorAll('#world div.block').length;

      dom.divWallCount.innerHTML = document.querySelectorAll('#world div.wall').length - document.querySelectorAll('#world div.wall.exploded').length;

      dom.divTurretCount.innerHTML = document.querySelectorAll('#world div.turret').length;

      dom.turretFireCount.innerHTML = onScreen;

      onScreen = 0;

      for (i = 0, j = game.objects.spaceBalls.length; i < j; i++) {
        if (game.objects.screen.isInView(game.objects.spaceBalls[i].data.col, game.objects.spaceBalls[i].data.row)) {
          onScreen++;
        }
      }

      dom.spaceballCount.innerHTML = onScreen;

      onScreen = 0;

      for (i = 0, j = game.objects.badGuyController.objects.badGuys.length; i < j; i++) {
        if (game.objects.badGuyController.objects.badGuys[i].data.active && game.objects.screen.isInView(game.objects.badGuyController.objects.badGuys[i].data.col, game.objects.badGuyController.objects.badGuys[i].data.row)) {
          onScreen++;
        }
      }

      dom.badGuyCount.innerHTML = onScreen;

    }

    function startTimer() {

      data.timer = window.setInterval(refreshStats, data.timerInterval);

    }

    function initDebugPanel() {

      var o, i, j,
          items;

      o = document.getElementById('debug-panel');

      if (!o) {
        return;
      }

      if (!PERFORMANCE_MODE) {

        // not needed - remove from the DOM altogether.
        o.parentNode.removeChild(o);

      } else {

        // reset checkboxes, etc.
        o.getElementsByTagName('form')[0].reset();

        items = o.getElementsByTagName('input');

        for (i = 0, j = items.length; i < j; i++) {

          utils.events.add(items[i], 'click', handleChange);

        }

        // show the UI.
        o.style.display = 'block';

        dom.divCount = document.getElementById('debug-div-count');
        dom.divBlockCount = document.getElementById('debug-div-block-count');
        dom.divWallCount = document.getElementById('debug-div-wall-count');
        dom.divTurretCount = document.getElementById('debug-div-turret-count');
        dom.turretFireCount = document.getElementById('debug-turret-fire-count');
        dom.spaceballCount = document.getElementById('debug-spaceball-count');
        dom.badGuyCount = document.getElementById('debug-badguy-count');

        startTimer();

      }

    }

    initDebugPanel();


  }());

  function createSpaceBalls() {

    var i, j, k, l,
        x, tmp,
        spaceBallCount = DEFAULT_SPACEBALLS,
        freeSpaces = [],
        location,
        rows = game.data.map.length,
        cols = game.data.map[0].length;

    // check for space characters in the map character data.
    // these are safe spaces to occupy.
    for (i = 0, j = cols; i < j; i++) {
      for (k = 0, l = rows; k < l; k++) {
        if (game.objects.mapData[k][i] === MAP_FREE_SPACE_CHAR || game.objects.mapData[k][i] === MAP_ALT_FREE_SPACE_CHAR) {
          freeSpaces.push({
            row: k,
            col: i
          });
        }
      }
    }

    if (DEBUG_MODE) {

      // highlight empty spaces

      x = document.createElement('div');
      x.style.position = 'absolute';
      x.style.width = '31px';
      x.style.height = '31px';
      x.style.border = '1px solid #66ff66';
      // x.style.background = '#006600';
      for (i = 0, j = freeSpaces.length; i < j; i++) {
        tmp = x.cloneNode(false);
        tmp.style.left = (freeSpaces[i].col * game.data.NODE_WIDTH) + 'px';
        tmp.style.top = (freeSpaces[i].row * game.data.NODE_HEIGHT) + 'px';
        game.dom.worldFragment.appendChild(tmp);
      }

    }

    for (i = 0, j = spaceBallCount; i < j; i++) {

      // choose a random location...
      location = parseInt(Math.random() * freeSpaces.length, 10);

      game.objects.spaceBalls.push(new SpaceBall(freeSpaces[location]));

      // and remove this item from the array (since it's now occupied)
      freeSpaces.splice(location, 1);

    }

  }

  function getArgs(x) {

    return _slice.call(x);

  }

  mapTypes = {
    0: function() { return new Block(mixin(getArgs(arguments)[0], { type: 'block', subType: 'type-0' })); },
    1: function() { return new Block(mixin(getArgs(arguments)[0], { type: 'block', subType: 'type-1' })); },
    2: function() { return new Block(mixin(getArgs(arguments)[0], { type: 'block', subType: 'type-2' })); },
    3: function() { return new Block(mixin(getArgs(arguments)[0], { type: 'block', subType: 'type-3' })); }
  };

  // user-provided map
  if (winloc.match(/mapData/)) {

    var str = decodeURI(winloc);

    mapData = str.substr(str.indexOf('mapData') + 8).split('/');

    // for now...
    DEFAULT_HOME_ROW = 1;
    DEFAULT_HOME_COL = 1;

    // and also, no spaceballs for custom levels.
    // this is because I'm lazy and don't have an algorithm to identify completely-enclosed base areas
    // (see dotted characters in above map), which are used to indicate "occupied" space when placing spaceballs.
    DEFAULT_SPACEBALLS = 0;

  }

  game.objects.mapData = mapData;

  function createGrid() {

    var gridItems = [];

    var i, j, k, l, char;

    j = mapData.length;

    console.log('looping through ' + j + ' rows of ' + mapData[0].length + ' characters');

    for (i = 0; i < j; i++) {

      // data for one row
      l = mapData[i].length;

      gridItems[i] = [];

      for (k = 0; k < l; k++) {

        // find the character and create the relevant object
        char = mapData[i].charAt(k);

        if (char !== ' ' && mapTypes[char] !== undefined) {

          gridItems[i].push(mapTypes[char]({
            x: k,
            y: i
          }));

        } else if (game.objects.baseController.isBaseItem(char)) {

          gridItems[i].push(game.objects.baseController.addBaseItem(char, k, i));

        } else {

          gridItems[i].push(null);

        }

      }

    }

    game.objects.baseController.findActiveBases();

    // set world dimensions
    game.data.world_width = (game.data.NODE_WIDTH * mapData[0].length) + 1;
    game.data.world_height = (game.data.NODE_HEIGHT * mapData.length) + 1;

    // record # of columns + rows
    game.data.world_cols = mapData[0].length - 1;
    game.data.world_rows = mapData.length - 1;

    // apply to DOM
    game.dom.world.style.width = game.data.world_width + 'px';
    game.dom.world.style.height = game.data.world_height + 'px';

    console.log('world set to ' + game.data.world_width + ' x ' + game.data.world_height);

    // reset the window scroll, if any (may be remembered from last time)
    game.objects.screen.moveTo(0,0);

    return gridItems;

  }

  function createShip() {
    game.objects.ship = new Ship();
    game.objects.ship.init();
  }

  function makeRandomBadGuy(force) {
    var isActive = game.objects.gameLoop.isActive();
    if ((Math.random() < 0.75 || force) && isActive) {
      console.log('makeRandomBadGuy()');
      game.objects.badGuyController.createBadGuy();
    } else if (isActive) {
      console.log('no bad guy this time around');
    }
    setTimeout(makeRandomBadGuy, 10000 + parseInt(Math.random() * 15000, 10));
  }

  function reset() {

    // reset the maps
    game.objects.turretGunfireMap.reset();
    game.objects.shipGunfireMap.reset();
    game.objects.badGuyMap.reset();
    game.objects.spaceBallMap.reset();

    // reset and re-append objects to the grid as needed

    var i, j, k, l;

    for (i = 0, j = game.data.map.length; i < j; i++) {
      for (k = 0, l = game.data.map[i].length; k < l; k++) {
        if (game.data.map[i][k] && game.data.map[i][k].restore) {
          game.data.map[i][k].restore();
        }
      }
    }

    // reset the spaceballs, too
    for (i = 0, j = game.objects.spaceBalls.length; i < j; i++) {
      game.objects.spaceBalls[i].restore();
    }

    // reset the base controller, bringing all bases back to life
    game.objects.baseController.reset();

    // re-append ship, which will have been nuked as well
    game.dom.worldFragment.appendChild(game.objects.ship.getNode());

    game.dom.world.appendChild(game.dom.worldFragment);

    // set default heartbeat rate
    game.objects.gameLoop.setPulseStage();

    game.objects.statsController.reset();

    game.objects.gameController.reset();

    game.objects.ship.setDefaultPosition();

    game.objects.ship.findSafeRespawnLocation();

    soundManager.play('gamewarp-start');

    game.objects.ship.reset();

    game.objects.gameLoop.resume();

    console.log('game reset complete');

  }

  function assignRemixLink() {

    var o = document.getElementById('remix');

    if (o) {

      if (winloc.match(/mapData/i)) {

        // assign the link including the mapData, replacing MAP_FREE_SPACE_CHAR with MAP_ALT_FREE_SPACE_CHAR
        o.href = 'editor.html#mapData=' + survivor.mapData.join('/').replace(/\s/g, MAP_ALT_FREE_SPACE_CHAR);

        o.innerHTML = 'Remix this level';

        // show the "play original game" link, too
        document.getElementById('original').style.display = 'inline';

      }

    }

  }

  function assignHelpLink() {

    var oHelp = document.getElementById('help');

    function mouseDownHandler(e) {

      var o,
          oBody;

      var className = 'show-help';

      var is_showing = utils.css.has(document.body, className);

      if (!is_showing) {

        utils.css.add(document.body, className);

        o = document.getElementById('help-screen');
        oBody = o.getElementsByTagName('div')[0];

        oBody.style.marginTop = -parseInt(oBody.offsetHeight / 2, 10) + 'px';

        game.objects.gameLoop.pause();

      } else {

        utils.css.remove(document.body, className);

        game.objects.gameLoop.resume();

      }

      stopEvent(e);

      return false;

    }

    if (oHelp) {

      oHelp.onmousedown = mouseDownHandler;

      // and get the help screen, too
      document.getElementById('help-screen').onclick = mouseDownHandler;

    }

  }

  function initAudio() {

    var i;

    features.audio = true;

    soundManager.createSound({
      id: 'gamewarp-start',
      url: 'audio/gamewarp-start.mp3'
    }).play();

    soundManager.createSound({
      id: 'heartbeat',
      url: 'audio/heartbeat.mp3',
      multiShot: true,
      autoLoad: true
    });

    soundManager.createSound({
      id: 'badguy-loop-0',
      url: 'audio/badguy-loop-1.mp3',
      loops: 999,
      autoLoad: true
    });

    soundManager.createSound({
      id: 'badguy-loop-1',
      url: 'audio/badguy-loop-2.mp3',
      loops: 999,
      autoLoad: true
    });

    soundManager.createSound({
      id: 'base-explode',
      url: 'audio/base-explode.mp3',
      autoLoad: true
    });

    for (i = 0; i < soundSprites.boomSpriteCounterMax; i++) {
      soundManager.createSound({
        id: 'boom-sprite-' + i,
        url: 'audio/boom-sprite.mp3',
        autoLoad: true
      });
    }

    for (i = 0; i < soundSprites.popSpriteCounterMax; i++) {
      soundManager.createSound({
        id: 'pop-sprite-' + i,
        url: 'audio/pop-sprite.mp3',
        autoLoad: true
      });
    }

  }

  function init() {

    game.objects.gameLoop = new GameLoop();

    if (soundManager.ok() && !IS_MUTED && !isSafari) {
      initAudio();
    }

    game.objects.collision = new Collision();

    game.objects.screen = new Screen();

    console.log('creating BaseController()...');

    game.objects.baseController = new BaseController();
    game.objects.baseController.init();

    console.log('calling createGrid()');

    game.data.map = createGrid();

    game.objects.screen.init();

    game.objects.statsController = new StatsController();

    // 2D array tracking references to moving objects
    game.objects.turretGunfireMap = new ObjectMap();
    game.objects.shipGunfireMap = new ObjectMap();
    game.objects.badGuyMap = new ObjectMap();
    game.objects.spaceBallMap = new ObjectMap();

    console.log('creating ship');

    createShip();

    console.log('creating bad guys');

    setTimeout(makeRandomBadGuy, 10000 + parseInt(Math.random() * 15000, 10));

    console.log('making spaceballs');

    createSpaceBalls();

    // shall we use GPU acceleration tricks based on Chrome's DevTools?
    if (USE_TRANSFORM) {
      console.log('using CSS3 transforms for GPU acceleration');
      utils.css.add(game.dom.world, 'use-transform');
    }

    // append fragment containing everything to DOM

    game.dom.world.appendChild(game.dom.worldFragment);

    console.log('world created');

    // position ship
    // hack - otherwise, window scroll doesn't quite exist yet or something and doesn't get picked up.
    window.setTimeout(function() {
      game.objects.ship.setDefaultPosition();
      game.objects.ship.findSafeRespawnLocation();
    }, 20);

    console.log('keyboard init');

    game.objects.keyboardMonitor = new KeyboardMonitor();
    game.objects.keyboardMonitor.init();

    game.objects.focusMonitor = new FocusMonitor();
    game.objects.focusMonitor.init();

    game.objects.levelEndSequence = new LevelEndSequence({
      node: document.getElementById('level-end-sequence')
    });

    game.objects.smartbombController = new SmartbombController();

    game.objects.gameController = new GameController();
    game.objects.gameController.init();

    assignRemixLink();

    assignHelpLink();

    // start game loop
    game.objects.gameLoop.init();

  }

  return {
    init: init,
    mapData: mapData,
    reset: reset
  };

}

function go_go_go() {

  // function name: inside Flickr-circa-2004 joke.

  // hackish: bypass loading / intro screens if noIntro, or if mapData and offline (file://) etc.

  var tweeter = document.getElementById('tweeter');

  var bypassIntro = (
        document.location.href.match(/nointro/i)
        || (document.referrer && document.referrer.match(/editor/i))
        || ((!document.location.protocol.match(/http/i) && document.location.href.match(/mapdata/i)))
      ),
      l0 = document.getElementById('loading0'),
      l1 = document.getElementById('loading1'),
      l2 = document.getElementById('loading2');

  function startGame() {

    if (soundManager.ok()) {
      soundManager.stop('valkyries');
    }

    survivor = new Survivor();
    survivor.init();
    document.getElementById('world-container').style.display = 'block';

  }

  function hideGameTitleScreen() {

    var boot = document.getElementById('boot-screen');
    var title = document.getElementById('title-screen');

    boot.parentNode.removeChild(boot);
    title.parentNode.removeChild(title);

  }

  function showGameTitleScreen() {

    var title = document.getElementById('title-screen');
    var c64 = document.getElementById('c64');

    title.style.display = 'block';

    c64.parentNode.removeChild(c64);

    if (soundManager.ok() && !IS_MUTED) {
      soundManager.createSound({
        id: 'valkyries',
        url: 'audio/valkyries.mp3',
        autoPlay: true
      });
    }

    title.onclick = function() {
      hideGameTitleScreen();
      startGame();
    };

  }

  if (bypassIntro) {

    // go directly to the game.
    hideGameTitleScreen();
    startGame();

    // and show the "tweeter" link, encouraging creators to share (maybe)
    if (tweeter && !winloc.match(/temp/i)) {

      tweeter.style.display = 'inline';

      // old-skool.
      tweeter.onclick = function(e) {

        var webCirca1999,
            msg,
            serviceURL,
            str,
            mapData,
            xhr;

        str = decodeURI(winloc);

        mapData = str.substr(str.indexOf('mapData') + 8);

        serviceURL = 'https://twitter.com/share/?text=';

        msg = 'I designed an 80\'s-era arcade game level. Think you can beat it? Play and remix it here.';

        xhr = new window.XMLHttpRequest();

        xhr.onreadystatechange = function() {

          var json;

          if (xhr.readyState !== 4) {
            return;
          }

          if (xhr.status !== 200 && xhr.status !== 304) {
            console('HTTP error ' + xhr.status);
            return;
          }

          json = JSON.parse(xhr.responseText);

          if (json && json.data && json.data.url) {

            // go to the proper sharing URL
            webCirca1999.go(serviceURL + encodeURIComponent(msg) + '&url=' + json.data.url);

          }

        };

        // open ze window
        webCirca1999 = window.open('shorturl/blank.html', 'survivorTweetWindow', 'width=640,height=250');

        // get the short URL
        xhr.open('GET', 'shorturl/?url=' + mapData, true);

        // true = post? I forget.
        xhr.send();

        // hack?
        if (e.preventDefault) {
          e.preventDefault();
        } else {
          e.returnValue = false;
          e.cancelBubble = true;
        }

        return false;

      };

    }

  }

  // first, make the noise.

  var _1541;

  function play1541() {
    var cursor = document.getElementById('cursor');
    if (!cursor) return;
    l0.style.display = 'block';
    cursor.style.display = 'none';
    _1541.play();
    utils.events.remove(document, 'keydown', play1541);
    utils.events.remove(document, 'mousedown', play1541);
  }

  if (soundManager.ok() && !navigator.userAgent.match(/mobile/i) && !IS_MUTED) {

    /**
     * Audio sample credit / thank-you: YouTube user "daddlertl2", last active 2 years ago (as of February 2012)
     * http://youtu.be/_K7MUkxjeaM
     * video "C64-Diskette wird formatiert (mit Basic Befehl) " uploaded May 1, 2009
     * (gappy audio track from video fixed for use in this project)
     */

    _1541 = soundManager.createSound({
      id: 'c64-1541-format',
      url: 'audio/1541-formatting-sound-short.mp3'
    });

    _1541.onPosition(800, function() {
      /**
       * SEARCHING FOR SURVIVOR-2012
       * at this point, the Commodore 1541-II floppy drive's head knocking sound is playing.
       * and yes, technically this alignment process is usually heard only when formatting disks.
       * if you heard that and were frowning in disappointment at the mis-use, yes, you are technically correct.
       * if you are both technically correct and reading this comment, then you win approximately one internets.
       */
      l1.style.display = 'block';
    });

    _1541.onPosition(2000, function() {
      /**
       * LOADING
       */
      l2.style.display = 'block';
    });

    _1541.onPosition(5000, function() {
      /**
       * READY.
       * RUN
       */
      document.getElementById('go_go_go').style.display = 'block';
    });

    _1541.onPosition(6000, showGameTitleScreen);

    // wait for key or click, because of <audio> playback restrictions.

    utils.events.add(document, 'keydown', play1541);
    utils.events.add(document, 'mousedown', play1541);

  } else {

    l0.style.display = 'block';
    l1.style.display = 'block';
    l2.style.display = 'block';

    document.getElementById('go_go_go').style.display = 'block';

    window.setTimeout(showGameTitleScreen, 2500);

  }

}

if (isSafari) {
  console.warn('Disabling standard HTML5 Audio() because Safari 11 has performance issues. Old bug here. ?forceaudio to bypass this warning. https://bugs.webkit.org/show_bug.cgi?id=116145');
  soundManager.onready(function() {
    // edge case: disable() doesn't seem to work within onready(), heh.
    window.setTimeout(soundManager.disable, 500);
  });
}

soundManager.onready(function() {
  if (document.referrer && document.referrer.match(/editor/i)) {
    // if coming from the editor, skip straight to the goods.
    go_go_go();
  } else {
    // let "READY." show for a second.
    setTimeout(go_go_go, 1000);
  }
});

soundManager.ontimeout(function() {
  // no sound effects for external use.
  // let "READY." show for a second.
  console.log('Note: sound effects are disabled.');
  setTimeout(go_go_go, 1000);
});

// invocation closure
}(window));
