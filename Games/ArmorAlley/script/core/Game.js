import { keyboardMonitor, prefsManager } from '../aa.js';
import { debug, isFirefox, isSafari, isMobile, isiPhone, oneOf, rndInt, setTutorialMode, soundManager, tutorialMode, TYPES, winloc, worldHeight } from './global.js';
import { utils } from './utils.js';
import { zones } from './zones.js';
import { gamePrefs, prefs } from '../UI/preferences.js';
import { orientationChange } from '../UI/mobile.js';
import { playSound, sounds } from './sound.js';
import { Stats } from '../UI/Stats.js';
import { Joystick} from '../UI/Joystick.js';
import { View } from '../UI/View.js';
import { Inventory } from '../UI/Inventory.js';
import { Radar } from '../UI/Radar.js';
import { Tutorial } from '../UI/Tutorial.js';
import { Notifications } from '../UI/Notifications.js';
import { Queue } from './Queue.js';
import { GameLoop } from './GameLoop.js';
import { Funds } from '../UI/Funds.js';
import { Tank } from '../units/Tank.js';
import { Balloon } from '../elements/Balloon.js';
import { Bunker } from '../buildings/Bunker.js';
import { Chain } from '../elements/Chain.js';
import { MissileLauncher } from '../units/MissileLauncher.js';
import { EndBunker } from '../buildings/EndBunker.js';
import { SuperBunker } from '../buildings/SuperBunker.js';
import { Turret } from '../buildings/Turret.js';
import { Base } from '../buildings/Base.js';
import { Cloud } from '../elements/Cloud.js';
import { Helicopter } from '../units/Helicopter.js';
import { Infantry } from '../units/Infantry.js';
import { Engineer } from '../units/Engineer.js';
import { Van } from '../units/Van.js';
import { LandingPad } from '../buildings/LandingPad.js';
import { Cornholio } from '../units/Cornholio.js';
import { Bomb } from '../munitions/Bomb.js';
import { Flame } from '../munitions/Flame.js';
import { GunFire } from '../munitions/GunFire.js';
import { ParachuteInfantry } from '../units/ParachuteInfantry.js';
import { SmartMissile } from '../munitions/SmartMissile.js';
import { Shrapnel } from '../elements/Shrapnel.js';
import { sprites } from './sprites.js';
import { addWorldObjects } from '../levels/default.js';
import { gameMenu } from '../UI/game-menu.js';
import { net } from './network.js';
import { Editor } from '../UI/Editor.js';
import { common } from './common.js';
import { StarController } from '../elements/StarController.js';
import { Star } from '../elements/Star.js';

const DEFAULT_GAME_TYPE = 'tutorial';

// very commonly-accessed attributes to be exported
let gameType;
let screenScale = 1;
let started;
let didInit;

const game = (() => {

  let data, dom, layoutCache = {}, boneyard, objects, objectsById, objectConstructors, players, exports;

  function addItem(className, x, extraTransforms) {

    let data, _dom, id, width, height, inCache, exports;

    id = `terrain_item_${game.objects[TYPES.terrainItem].length}`;

    function initDOM() {

      _dom.o = sprites.create({
        className: `${className} terrain-item`,
        id
      });

    }
    
    function initItem() {

      initDOM();

      if (layoutCache[className]) {

        inCache = true;
        width = layoutCache[className].width;
        height = layoutCache[className].height;
  
      } else {
  
        // append to get layout (based on CSS)
        dom.battlefield.appendChild(_dom.o);
  
      }

    }

    // prefixed to avoid name conflict with parent game namespace
    // TODO: break this out into an Item class.
    _dom = {
      o: null
    };

    initItem();
    
    width = width || _dom?.o?.offsetWidth;
    height = height || _dom?.o?.offsetHeight;

    data = {
      type: className,
      id,
      isTerrainItem: true,
      bottomAligned: true,
      x,
      y: worldHeight - height + 4,
      // dirty: force layout, read from CSS, and cache below
      width,
      height,
      isOnScreen: null,
      extraTransforms
    };

    if (!inCache) {

      // store
      layoutCache[className] = {
        width: data.width,
        height: data.height
      };

      // remove the node, now that we have its layout.
      // this will be re-appended when on-screen.
      _dom.o.remove();

    }

    // basic structure for a terrain item
    exports = {
      data,
      dom: _dom,
    };

    // these will be tracked only for on-screen / off-screen purposes.
    game.objects[TYPES.terrainItem].push(exports);
    game.objectsById[data.id] = exports;

    // only track zones while editing.
    if (game.objects.editor) {
      zones.refreshZone(exports);
    }

    return exports;

  }

  function addObject(type, options = {}) {

    // given type of TYPES.van, create object and append to respective array.

    let object, objectArray;
    
    // TYPES.van -> game.objects['van'], etc.
    objectArray = objects[type];

    // create and push an instance object onto its relevant array by type (e.g., TYPES.van -> game.objects['vans'])
    if (objectConstructors[type]) {
      object = objectConstructors[type](options);
    } else {
      console.warn(`No constructor of type ${type}`);
    }

    // add the object to game arrays, before firing init method (DOM I/O etc.)
    // hackish: `noInit` applies for inventory ordering purposes, should be refactored.

    if (!options.noInit) {

      if (!objectsById[object.data.id]) {
        objectsById[object.data.id] = object;
      } else {
        // this shouldn't happen.
        console.warn('objectsById: already assigned. Ignoring duplicate, returning original.', object.data.id);
        return objectsById[object.data.id];
      }

      objectArray.push(object);

      if (!options.skipInit) {
        object?.init?.();
      }

      // and caculate the zone, which will further map things.
      zones.refreshZone(object);

    }

    return object;

  }

  function findObjectById(id, ...consoleInfoArgs) {

    /**
     * Helper method for remote object network calls.
     * If an ID is not found in `objectsById`, it may be in the "boneyard."
     * This can happen when an object dies locally, then a network request comes in for it.
     */
  
    if (!id) return;
  
    const obj = objectsById[id];

    if (obj) return obj;
  
    const by = game.boneyard[id];
  
    let byDetails = '';
  
    if (by) {
      byDetails = ` found in boneyard ☠️ (died ${parseInt(performance.now() - by.ts, 10)} msec ago${by.attacker ? ', attacker: ' + by.attacker : ''})`;
    }
  
    if (net.debugNetwork) console.info(`${consoleInfoArgs?.[0]} | ${id}${byDetails}`);
  
  }

  function createObjects() {

    objects.stats = Stats();

    objects.gameLoop = GameLoop();

    objects.notifications = Notifications();

    objects.funds = Funds();

    objects.queue = Queue();

    objects.view = View();

    // hackish: now, assign the thing being exported from this module to everywhere else via `aa.js`
    screenScale = objects.view.data.screenScale;

    objects.radar = Radar();

    objects.inventory = Inventory();

    objects.starController = StarController();

  }

  function getObjects() {

    // build up a "save state"
    const qualifiers = {
      // only include detached / free-floating + hostile
      balloon: (o) => !!o?.data?.hostile,
      bunker: (o) => !o.data.dead && !o.data.burninating
    }

    const items = {};

    function addGameItem(type, item) {
      if (!items[type]) {
        items[type] = [];
      }
      items[type].push(item);
    }

    // string -> array
    const saveItems = 'balloon base bunker cloud end-bunker engineer infantry landing-pad missile-launcher smart-missile super-bunker tank terrain-item turret van'.split(' ');

    const objects = common.pick(game.objects, ...saveItems);

    for (const item in objects) {
      game.objects[item]?.forEach((obj) => {
        let { type } = obj?.data;
        // I forgot about this special case.
        if (type === TYPES.infantry && obj.data.role) {
          type = TYPES.engineer;
        }
        if (qualifiers[type]) {
          if (qualifiers[type](obj)) {
            addGameItem(type, obj);
          }
        } else {
          addGameItem(type, obj);
        }
      });
    }
    
    // finally, distill to addObject() / addItem() calls.
    // [ 'type', 'l|r|n', int ]

    const gameData = [];

    for (const type in items) {

      items[type].forEach((item) => {

        // engineers, again - special case
        let { type } = item.data;
        if (type === TYPES.infantry && item.data.role) type = TYPES.engineer;

        // 2 or 3 args, depending
        const args = [ type, item.data.isHostile || (type === TYPES.turret && item.data.dead) ? 'n' : (item.data.isEnemy ? 'r' : (item.data.isNeutral ? 'n' : 'l')), Math.floor(item.data.x) ];

        // drop l/r on terrain items, and clouds
        if (item.data.isTerrainItem || type === TYPES.cloud) args.splice(1, 1);

        gameData.push(args);

      });

    }

    // sort the array based on the x value.
    gameData.sort(utils.array.compareByLastItem());

    return gameData;

  }

  function populateTerrain() {

    // tutorial?

    if (tutorialMode) {

      if (!game.objects.editor) {
        objects.tutorial = Tutorial();
      }

      utils.css.add(document.getElementById('help'), 'active');

    } else {

      utils.css.add(document.getElementById('help'), 'inactive');

      document.getElementById('tutorial')?.remove();

    }

    zones.initDebug();

    // player + enemy helicopters

    let playAsEnemy = !!(window.location.href.match(/playAsEnemy/i));

    let enemyCPU = !!(window.location.href.match(/enemyCPU|remoteCPU/i));

    if (!tutorialMode && playAsEnemy) {

      addObject(TYPES.helicopter, {
        skipInit: true,
        isEnemy: true,
        attachEvents: true,
        isLocal: true
      });

      addObject(TYPES.helicopter, {
        skipInit: true,
        isEnemy: false,
        isCPU: true
      });

    } else {

      if (net.active) {

        console.log('NETWORK GAME');

        // which one you are, depends on who's hosting.

        // pvp|pvp_cpu|coop_2v1|coop_2v2
        if (gamePrefs.net_game_style.match(/coop/i)) {

          if (net.isHost) {

            console.log('you are hosting: you are helicopters[0], you and your friend are playing cooperatively against an enemy or two.');

            // human player 1 (local)
            addObject(TYPES.helicopter, {
              skipInit: true,
              attachEvents: true,
              isLocal: true
            });

            // human player 2 (remote)
            addObject(TYPES.helicopter, {
              skipInit: true,
              isRemote: true
            });

            // CPU player 1 (AI running locally)
            addObject(TYPES.helicopter, {
              skipInit: true,
              isEnemy: true,
              isCPU: true
            });

            if (gamePrefs.net_game_style === 'coop_2v2') {

              console.log('2v2: adding second enemy');

              // CPU player 2 (AI running remotely)
              addObject(TYPES.helicopter, {
                skipInit: true,
                isEnemy: true,
                isCPU: true,
                isRemote: true
              });

            }

          } else {

            console.log('you are a guest: you are helicopters[1], you and your friend are playing cooperatively against an enemy or two.');

            // human player 1 (remote)
            addObject(TYPES.helicopter, {
              skipInit: true,
              isRemote: true
            });

            // human player 2 (local)
            addObject(TYPES.helicopter, {
              skipInit: true,
              attachEvents: true,
              isLocal: true
            });

            // CPU player 1 (AI running remotely)
            addObject(TYPES.helicopter, {
              skipInit: true,
              isEnemy: true,
              isCPU: true,
              isRemote: true
            });

            if (gamePrefs.net_game_style === 'coop_2v2') {

              console.log('2v2: adding second enemy');

              // CPU player 2 (AI running locally)
              addObject(TYPES.helicopter, {
                skipInit: true,
                isEnemy: true,
                isCPU: true
                // isRemote: true
              });

            }

          }

        } else {

          // Player vs. player
          // pvp|pvp_cpu|coop_2v1|coop_2v2

          console.log('player vs player');

          // pvp|pvp_cpu|coop_2v1|coop_2v2

          if (net.isHost) {

            console.log('you are hosting: you are helicopters[0], and take the friendly base');

            addObject(TYPES.helicopter, {
              skipInit: true,
              attachEvents: true,
              isLocal: true
            });

            addObject(TYPES.helicopter, {
              skipInit: true,
              isEnemy: true,
              isRemote: true,
              isCPU: enemyCPU
            });

            if (gamePrefs.net_game_style === 'pvp_cpu') {

              // helper CPUs, one for each player

              console.log('pvp_cpu: adding helper helicopters');

              addObject(TYPES.helicopter, {
                skipInit: true,
                isRemote: false,
                isCPU: true
              });
              
              addObject(TYPES.helicopter, {
                skipInit: true,
                isEnemy: true,
                isRemote: true,
                isCPU: true
              });

            }

          } else {

            console.log('you are a guest: you are helicopters[1], and take the enemy base');

            addObject(TYPES.helicopter, {
              skipInit: true,
              isRemote: true
            });

            // hackish: allow CPU override for testing
            addObject(TYPES.helicopter, {
              skipInit: true,
              isLocal: true,
              isEnemy: true,
              attachEvents: !enemyCPU,
              isCPU: enemyCPU
            });

            if (gamePrefs.net_game_style === 'pvp_cpu') {

              // helper CPUs, one for each player

              console.log('pvp_cpu: adding helper helicopters');

              addObject(TYPES.helicopter, {
                skipInit: true,
                isRemote: true,
                isCPU: true
              });

              addObject(TYPES.helicopter, {
                skipInit: true,
                isEnemy: true,
                isRemote: false,
                isCPU: true
              });
              
            }

          }

        }
    
      } else {

        // regular game

        addObject(TYPES.helicopter, {
          skipInit: true,
          attachEvents: true,
          isLocal: true
        });
    
        if (!tutorialMode) {
      
          addObject(TYPES.helicopter, {
            skipInit: true,
            isEnemy: true,
            isCPU: true
          });
          
        }

      }

    }

    addWorldObjects();

    // finally, start the helicopter engines. ;)
    game.objects.helicopter.forEach((helicopter) => helicopter.init());

  }

  function togglePause() {

    if (!data.started) return;

    if (data.paused) {
      resume();
    } else {
      pause();
    }

  }

  function pause(options) {

    // ignore if we're in a network game.
    if (net.active) return;

    // ignore if the game hasn't started yet., e.g. main menu or network screen up.
    if (!data.started) return;

    const silent = options?.noMute !== true;
    const keepColor = options?.keepColor || false;

    if (data.paused) return;

    // good time to process the queue - prune the DOM, etc.
    if (objects.queue) {
      objects.queue.process();
    }

    objects.gameLoop.stop();

    objects.joystick?.end();

    if (silent && gamePrefs.sound && soundManager) {
      soundManager.mute();
    }

    // shuffle "resume prompts" messages by hiding all except one; hopefully, they're considered humorous. ;)
    let prompts = document.querySelectorAll('#game-paused .resume-prompt');
    let rnd = rndInt(prompts.length);

    for (let i = 0; i < prompts.length; i++) {
      prompts[i].style.display = (i === rnd ? 'inline-block' : 'none');
    }

    // "keep color" applies when the game starts and the menu is showing.
    let css = keepColor ? [] : ['game-paused'];
    
    // don't show paused status / tips in certain cases

    if (prefsManager.isActive()) {
      css.push('prefs-modal-open');
    }

    if (!data.started) {
      css.push('game-menu-open');
    }

    utils.css.add(document.body, ...css);

    data.paused = true;

  }

  window.pause = pause;

  function resume() {

    // exit if preferences menu is open; it will handle resume on close.
    if (prefsManager.isActive()) return;

    if (!data.paused) return;

    objects.gameLoop.start();

    if (gamePrefs.sound && soundManager) {
      soundManager.unmute();
    }

    utils.css.remove(document.body, 'game-paused', 'prefs-modal-open', 'game-menu-open');

    if (isMobile) {
      // hackish: screen coordinates, etc., should have settled by this point following an orientation change.
      game.objects.starController?.reset();
    }

    data.paused = false;

  }

  function startEditor() {

    // stop scrolling
    utils.css.remove(document.getElementById('game-tips'), 'active');

    game.objects.editor = Editor();

    // get some stuff on the battlefield

    zones.init();

    populateTerrain();

    game.objects.editor.init();

  }

  // when the player has chosen a game type from the menu - tutorial, or easy/hard/extreme.
  function init() {

    document.getElementById('help').style.display = 'block';

    data.started = true;

    // game editor?
    if (window.location.href.match(/editor/i)) {
      return startEditor();
    }
    
    utils.css.add(document.body, 'game-started');

    keyboardMonitor.init();

    // allow joystick if in debug mode (i.e., testing on desktop)
    if (isMobile || debug) {

      objects.joystick = Joystick();

      objects.joystick.onSetDirection = (directionX, directionY) => {
        // TODO: have this call game.objects.view.mousemove(); ?
        // OR, just call network methods directly.
        // percentage to pixels (circle coordinates)
        const x = ((directionX / 100) * objects.view.data.browser.width);
        const y = ((directionY / 100) * objects.view.data.browser.height);
        if (net.active) {
          objects.view.data.mouse.delayedInputX = x;
          objects.view.data.mouse.delayedInputY = y;
          if (game.players.local) {
            game.players.local.data.mouse.delayedInputX = x;
            game.players.local.data.mouse.delayedInputY = y;
          }
        } else {
          objects.view.data.mouse.x = x;
          objects.view.data.mouse.y = y;
        }
      };

    } else {

      document.getElementById('pointer')?.remove();

    }

    zones.init();

    populateTerrain();

    // if a network game, let the host handle enemy ordering; objects will be replicated remotely.
    if (game.players.cpu.length && !tutorialMode && (!net.active || (net.active && net.isHost))) {
      game.objects.inventory.startEnemyOrdering();
    }

    function startEngine() {

      // wait until available
      if (!sounds.helicopter.engine) return;

      playSound(sounds.helicopter.engine);

      if (gamePrefs.bnb) {
        playSound(oneOf([sounds.bnb.letsKickALittleAss, sounds.bnb.heresACoolGame]));
      }

      utils.events.remove(document, 'click', startEngine);

    }

    if (gamePrefs.sound) {
      // wait for click or keypress, "user interaction"
      utils.events.add(document, 'click', startEngine);
    }

  }

  // the home screen: choose a game type.

  function initArmorAlley() {

    if (didInit) {
      console.warn('initArmorAlley(): WTF, already did init?');
      return;
    }

    didInit = true;

    // A few specific CSS tweaks - regrettably - are required.
    if (isFirefox) utils.css.add(document.body, 'is_firefox');

    if (isSafari) { 
      utils.css.add(document.body, 'is_safari');
      // progressive web-type app, "installed on home screen" (iOS Safari)
      if (navigator.standalone) utils.css.add(document.body, 'is_standalone');
    }
  
    // Very limited CSS stuff, here, to hide keyboard controls.
    if (isiPhone) {
      utils.css.add(document.body, 'is_iphone');
    }

    if (isMobile) {
  
      utils.css.add(document.body, 'is-mobile');
  
      // prevent context menu on links.
      // this is dirty, but it works (supposedly) for Android.
      window.oncontextmenu = e => {
        e.preventDefault();
        e.stopPropagation();
        return false;
      };
  
      // if iPads etc. get The Notch, this will need updating. as of 01/2018, this is fine.
      if (isiPhone) {
        /**
         * iPhone X notch detection shenanigans. AA should avoid the notch,
         * but doesn't need to pad the right end of the screen - thus, we detect
         * this case and apply CSS for orientation so we know which side the notch is on.
         *
         * Tips o' the hat:
         * PPK - hasNotch() detection. Doesn't seem to work on iOS 11.0.2 as of 01/2018.
         * https://www.quirksmode.org/blog/archives/2017/10/safeareainset_v.html
         * Mark Nolton on SO - orientation change.
         * https://stackoverflow.com/a/47226825
         */
        window.addEventListener('orientationchange', orientationChange);
        // and get the current layout.
        orientationChange();
      }
  
    }

    // TODO: DOM init method or similar, ideally
    
    dom.world = document.getElementById('world');
    dom.battlefield = document.getElementById('battlefield');

    createObjects();

    // game loop can be kicked off right away, for sound playback purposes.
    objects.gameLoop.init();

    // start menu?
    gameMenu.init();

  }

  function setGameType(type = null) {

    gameType = type || DEFAULT_GAME_TYPE;
    gamePrefs.net_game_type = gameType;
    setTutorialMode(gameType === 'tutorial');

  }

  function start() {

    // NOTE: default game type is set here

    if (net.active && net.connected) {

      // do nothing, already set.

    } else {

      gameType = utils.storage.get(prefs.gameType) || winloc.match(/easy|hard|extreme|tutorial/i) || DEFAULT_GAME_TYPE;
    
      if (gameType instanceof Array) {
        gameType = gameType[0];
      }
    
      // safety check
      if (gameType && !gameType.match(/easy|hard|extreme|tutorial/i)) {
        gameType = null;
      }

    }
    
  }

  data = {
    battleOver: false,
    convoyDelay: 60,
    paused: false,
    productionHalted: false,
    dieCount: 0,
    // uh-huh huh huh huh huh. uh-huh huh. heh heh. m-heh.
    isBeavis: false,
    isButthead: false,
    engineerSwitch: false
  };

  dom = {
    battlefield: null,
    world: null
  };

  players = {
    local: null,
    remote: [],
    remoteHuman: null,
    cpu: []
  };

  objects = {
    editor: null,
    gameLoop: null,
    view: null,
    chain: [],
    balloon: [],
    bomb: [],
    bunker: [],
    cornholio: [],
    domFetti: [],
    ephemeralExplosion: [],
    'end-bunker': [],
    engineer: [],
    flame: [],
    gunfire: [],
    infantry: [],
    'parachute-infantry': [],
    'missile-launcher': [],
    'super-bunker': [],
    tank: [],
    van: [],
    helicopter: [],
    'smart-missile': [],
    base: [],
    cloud: [],
    'landing-pad': [],
    turret: [],
    shrapnel: [],
    smoke: [],
    'terrain-item': [],
    radar: null,
    star: [],
    starController: null,
    inventory: null,
    tutorial: null,
    queue: null,
    funds: null,
    notifications: null,
    stats: null
  };

  objectsById = {};

  // a place for all the deceased. 😇☠️😂
  boneyard = {};

  objectConstructors = {
    balloon: Balloon,
    base: Base,
    bomb: Bomb,
    bunker: Bunker,
    chain: Chain,
    cloud: Cloud,
    cornholio: Cornholio,
    'end-bunker': EndBunker,
    engineer: Engineer,
    // flyingAce: FlyingAce,
    flame: Flame,
    gunfire: GunFire,
    helicopter: Helicopter,
    infantry: Infantry,
    'landing-pad': LandingPad,
    'missile-launcher': MissileLauncher,
    'parachute-infantry': ParachuteInfantry,
    shrapnel: Shrapnel,
    'smart-missile': SmartMissile,
    'super-bunker': SuperBunker,
    star: Star,
    turret: Turret,
    tank: Tank,
    van: Van
  };

  exports = {
    addItem,
    addObject,
    boneyard,
    data,
    dom,
    findObjectById,
    getObjects,
    init,
    initArmorAlley,
    objects,
    objectsById,
    players,
    pause,
    resume,
    setGameType,
    start,
    started,
    startEditor,
    togglePause
  };

  return exports;

})();

export { game, gameType, screenScale };