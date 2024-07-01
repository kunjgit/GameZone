import { keyboardMonitor, prefsManager } from '../aa.js';
import { game } from '../core/Game.js';
import { common } from '../core/common.js';
import { TYPES,  isSafari,  worldWidth } from '../core/global.js';
import { collisionCheck } from '../core/logic.js';
import { utils } from '../core/utils.js';
import { zones } from '../core/zones.js';

const HELP_X_PREF = 'editor_help_x';

const showPixelOffset = window.location.href.match(/showOffset/i);

// Desktop Safari scale hacks: needed for `getBoundingClientRect()` on draggable windows.
const safariScaleOffset = isSafari ? 2 : 1;

const Editor = () => {

  const itemTypes = {
    airborne: [
      TYPES.cloud,
      TYPES.balloon
    ],
    structures: [
      TYPES.bunker,
      TYPES.superBunker,
      TYPES.turret,
      TYPES.landingPad
    ],
    units: [
      TYPES.missileLauncher,
      TYPES.tank,
      TYPES.van,
      TYPES.infantry,
      TYPES.engineer
    ],
    terrain: {
      rock: [ 'rock', 'rock2' ],
      grave: [ 'gravestone', 'gravestone2', 'grave-cross' ],
      tumbleweed: [ 'tumbleweed '],
      grass: [ 'checkmark-grass', 'grass' ],
      barbWire: [ 'barb-wire' ],
      flower: [ 'flower', 'flowers', 'flower-bush' ],
      cactus: [ 'cactus', 'cactus2' ],
      tree: [ 'tree', 'palm-tree' ],
      dune: [ 'sand-dune', 'sand-dunes' ]
    }
  };

  const itemTypesByKey = {
    a: itemTypes.airborne,
    s: itemTypes.structures,
    // units
    m: [ TYPES.missileLauncher ],
    t: [ TYPES.tank ],
    v: [ TYPES.van ],
    i: [ TYPES.infantry ],
    e: [ TYPES.engineer ],
    // terrain items
    b: itemTypes.terrain.barbWire,
    c: itemTypes.terrain.cactus,
    d: itemTypes.terrain.dune,
    f: itemTypes.terrain.flower,
    g: [ ...itemTypes.terrain.grass, ...itemTypes.terrain.grave ],
    r: itemTypes.terrain.rock,
    w: itemTypes.terrain.tree // categorized as "wood"
  };

  let css, data, dom, downKeys, events, exports, keyMap, keysToMethods, methods;

  // ESC = exit to default mode
  // other keys (or click?) = add mode, e.g., planting trees
  const modes = {
    ADD: 'add',
    SELECT: 'select',
    DEFAULT: 'select'
  };

  function stopEvent(e) {
    e?.preventDefault();
    return false;
  }

  const isChildOfClassName = ((node, className) => {

    // go up the DOM tree, looking for the parent - and if found, return it.

    if (utils.css.has(node, className)) return true;

    while (!utils.css.has(node, className) && node.parentNode) {
      node = node.parentNode;
    }

    return utils.css.has(node, className) ? node : null;

  });

  function initDOM() {

    const oRadarScrubber = document.createElement('div');
    oRadarScrubber.id = 'radar-scrubber';

    const oCutoffLine = document.createElement('div');
    oCutoffLine.id = 'cutoff-line';

    const oMarquee = document.createElement('div');
    oMarquee.id = 'marquee';

    const battleField = document.getElementById('battlefield');

    dom.oCutoffLine = battleField.appendChild(oCutoffLine);
    dom.oMarquee = battleField.appendChild(oMarquee);
    dom.oRadarScrubber = battleField.appendChild(oRadarScrubber);

    dom.oFinder = document.getElementById('editor-window');
    dom.oFinder.style.display = 'block';

    // see if help was closed previously
    const wasClosed = utils.storage.get(HELP_X_PREF);

    dom.oHelp = document.getElementById('editor-window-help');
    dom.oHelp.style.display = wasClosed ? 'none' : 'block';

    dom.oShowHelp = document.getElementById('editor-show-help');
    dom.oShowHelp.style.display = wasClosed ? 'inline' : 'none';

  }

  function initEditor() {

    keyMap = keyboardMonitor.keyMap;

    initDOM();

    utils.css.add(document.body, css.editMode);

    setCursor('grab');

    events.resize();

    keyboardMonitor.init();

  }

  css = {
    active: 'active',
    airborne: 'airborne',
    editMode: 'edit-mode',
    enemy: 'enemy',
    newlyAddedSprite: 'newly-added-sprite',
    selected: 'selected',
    submerged: 'submerged'
  };

  data = {
    activeTool: null,
    activeToolOffset: 0,
    draggingWindow: false,
    isEnemy: false,
    marquee: {
      x: 0,
      y: 0,
      w: 0,
      h: 0
    },
    finderX: 0,
    finderY: 0,
    helpX: 0,
    helpY: 0,
    windowX: 0,
    windowY: 0,
    marqueeSelected: {},
    mode: modes.DEFAULT,
    mouseDown: false,
    mouseDownScrollLeft: 0,
    mouseDownTarget: null,
    mouseDownX: 0,
    mouseDownY: 0,
    mouseMoveCount: 0,
    mouseOffsetX: 0,
    mouseX: 0,
    mouseY: 0,
    scrubberX: 0,
    scrubberWidth: 32,
    scrubberActive: false,
    selectedItems: []
  };

  dom = {
    oFinder: null,
    oHelp: null,
    oShowHelp: null,
    oWindow: null,
    oCutoffLine: null,
    oMarquee: null,
    oRadarScrubber: null
  };

  downKeys = {};

  keysToMethods = {
    // default / selection mode
    'escape': () => setMode(),
    'delete': () => deleteSelectedItems(),
    'backspace': () => deleteSelectedItems(),
    'arrowleft': () => moveSelectedItemsX(-1),
    'arrowright': () => moveSelectedItemsX(1),
    '<': () => setEnemyState(true), // <
    ',': () => setEnemyState(true), // <
    '.': () => setEnemyState(false), // >
    '>': () => setEnemyState(false), // >
    '[': () => modifyActiveTool(-1),
    ']': () => modifyActiveTool(1)
  };

  // assign all the keys for various "tools", e.g., placing trees or rocks.
  Object.keys(itemTypesByKey).forEach((key) => {
    // hackish: self-referential.
    itemTypesByKey[key].key = key;
    keysToMethods[key] = () => setActiveTool(itemTypesByKey[key]);
  });

  methods = {

    export: () => {

      const data = game.getObjects();

      const items = {};

      data.forEach((item) => {
        // e.g., 'bunker', 'right', '2048' -> [ 'bunker-right', 2048 ]
        const key = item[0] + (item.length === 3 ? ':' + item[1] : '');
        if (!items[key]) items[key] = [];
        // push X offset onto array
        items[key].push(item[item.length-1]);
      });

      let str = JSON.stringify(data);

      // double -> single quotes, newlines
      str = str.replace(/"/g, "'").replace(/],/g, '],\n');

      // [' > [ ' and ], =>  ],
      str = str.replace(/\['/g, "[ '").replace(/\],/g, ' ],');

      // add space after closing quote + comma
      str = str.replace(/',/g, "', ");

      // drop quotes around left / neutral / right
      str = str.replace(/'([lnr])'/g, "$1");

      // start and end
      str = str.replace('[[', "'Custom Level': [\n[");
      str = str.replace(']]', ' ]\n]');

      // testing: drop newlines
      str = str.replace(/\/n/g, '');

      console.log(str);
  
    },

    showHelp: () => {
      dom.oHelp.style.display = 'block';
      dom.oShowHelp.style.display = 'none';
      utils.storage.remove(HELP_X_PREF);
    },

    play: () => {

      const data = game.getObjects();

      const items = {};

      data.forEach((item) => {
        // e.g., 'bunker', 'right', '2048' -> [ 'bunker-right', 2048 ]
        const key = item[0] + (item.length === 3 ? ':' + item[1] : '');
        if (!items[key]) items[key] = [];
        // push X offset onto array
        items[key].push(item[item.length-1]);
      });

      const urlData = JSON.stringify(items);

      window.open('./?customLevel=' + urlData, '_aa_preview');

    }
  
  };

  function setMode(mode) {

    if (data.mode === mode) return;

    data.mode = modes[mode] || modes.DEFAULT;

    if (!downKeys.shift && !downKeys.meta) {
      // clear selection unless shift or meta has been held.
      clearSelectedItems();
    }

    if (mode !== 'ADD') {
      // clear active tool?
      clearActiveTool();
    }

    utils.css.addOrRemove(dom.oCutoffLine, mode === 'ADD', css.active);

  }

  // TODO: better name? the thing we'll be "painting" with.
  function setActiveTool(item) {

    // ensure we're in ADD mode, first
    setMode('ADD');

    if (data.activeTool !== item) {
      data.activeTool = item;
      data.activeToolOffset = 0;
    } else {
      data.activeToolOffset++;
      if (data.activeToolOffset >= data.activeTool.length) {
        data.activeToolOffset = 0;
      }
    }

    updateActiveTool();

  }

  function clearActiveTool() {

    data.activeTool = null;
    data.activeToolOffset = 0;
    updateActiveTool();

  }

  function modifyActiveTool(direction) {

    // ±1
    data.activeToolOffset += direction;
    if (data.activeToolOffset >= data.activeTool.length) {
      data.activeToolOffset = 0;
    } else if (data.activeToolOffset < 0) {
      data.activeToolOffset = data.activeTool.length - 1;
    }

    updateActiveTool();

  }

  function updateActiveTool() {

    document.getElementById('editor-active').innerHTML = data.activeTool ? (data.activeTool[data.activeToolOffset] + (data.activeTool.length > 1 ? ' (' + (data.activeToolOffset + 1) + '/' + data.activeTool.length + ')' : '')) : '[none]';
    document.getElementById('active-sprite').className = `static-sprite ${data.activeTool && data.activeTool[data.activeToolOffset] || 'default'}`;

  }

  function addItemAtMouse(e) {

    if (!data.activeTool) return;

    const x = Math.floor(game.objects.view.data.battleField.scrollLeft + (e.clientX * (1 / game.objects.view.data.screenScale)));

    const chosenItem = data.activeTool[data.activeToolOffset];

    // ground unit?
    const mtvie = data.activeTool.key.match(/[mtvie]/i);

    const airborne = data.activeTool.key === 'a';
    const structure = data.activeTool.key === 's';

    // terrain, vehicle, or element?
    let obj;

    if (mtvie || airborne || structure) {
      obj = game.addObject(chosenItem, { isEnemy: data.isEnemy, x });
      utils.css.add(obj.dom.o, css.newlyAddedSprite);
    } else {
      obj = game.addItem(chosenItem, x);
    }

    utils.css.add(obj.dom.o, css.submerged);

    if (!downKeys.shift && !downKeys.meta) {
      clearSelectedItems();
    }

    common.setFrameTimeout(() => {
      utils.css.remove(obj.dom.o, css.submerged);
      selectItem(obj.dom.o);
    }, 88);
    
  }

  function getGameObject(item) {

    // given an item with an ID, return the game object.

    if (!item) return;

    const { id } = item?.dataset;

    if (!id) {
      console.warn('getGameObject: no item?.id?', item, id);
      return;
    }

    if (!game.objectsById[id]) {
      console.warn('WTF no game.objectsById[id]?', id, game.objectsById);
    }

    return game.objectsById[id];

  }

  function getXYFromTransform(item) {

    // hackish: split translate3d(x,y,z) into an array of [x,y]
    const xy = item.style.transform.toString().match((/\((.+)\)/i))?.[1]?.split(',');

    if (!xy?.length) return;

    return xy.map((item) => parseFloat(item));

  }

  function refreshItemCoords(item) {

    if (!item) return;

    // the viewport may have moved since this was selected; keep its data up-to-date.
    const currentXY = getXYFromTransform(item); 

    if (!currentXY) return;

    item.dataset.x = currentXY[0];

    let airborne;

    // hackish: no repositioning tricks on floating items.
    if (item.className.match(/cloud/i)) {

      airborne = true;

    } else if (item.className.match(/balloon/i)) {

      // allow Y movement if this isn't anchored to a bunker.
      if (!getGameObject(item)?.objects?.bunker) airborne = true;

    }

    if (airborne) {
      utils.css.add(item, css.airborne);
      item.dataset.y = currentXY[1];
    }

  }

  function checkLinkedObject(objects, objectName) {

    return objects[objectName]?.dom?.o;

  }

  function decorateItem(item) {

    // TODO: checkbox + pref
    if (!showPixelOffset) return;

    if (!item) return;

    const gameObj = getGameObject(item);

    if (!gameObj) return;

    if (!gameObj?.dom?.o || gameObj.dom.oEditorFlag) return;

    const o = document.createElement('div');
    o.className = 'zone-flag';
    o.style.top = o.style.right = '1px';
    o.style.left = 'auto';

    o.innerHTML = Math.floor(gameObj.data.x);

    // zone debugging
    gameObj.dom.oEditorFlag = o;
    gameObj.dom.o.appendChild(gameObj.dom.oEditorFlag);
    
  }

  function selectItem(item) {

    if (!item) return;

    const gameObj = getGameObject(item);

    // if no registered object by ID for this, then ignore.
    if (!gameObj) return;

    if (data.selectedItems.includes(item)) return;

    utils.css.add(item, css.selected);

    refreshItemCoords(item);

    decorateItem(item);

    data.selectedItems.push(item);

    // also, check for balloon <-> chain <-> bunker connections.
    if (gameObj?.objects) {
      ['balloon', 'bunker', 'chain'].forEach((type) => {
        const obj = checkLinkedObject(gameObj.objects, type);
        if (obj) selectItem(obj);
      });
    }

  }

  function toggleSelectItem(item) {

    if (data.selectedItems.includes(item)) {
      deSelectItem(item);
      // now, recycle the empties.
      data.selectedItems = data.selectedItems.filter((item => item !== null));
    } else {
      selectItem(item);
    }

  }

  function deSelectItem(item) {

    if (!item) return;

    const offset = data.selectedItems.indexOf(item);

    if (offset === -1) return;

    utils.css.remove(item, css.selected);

    // don't mutate the array, just null out for now.
    data.selectedItems[offset] = null;

    const gameObj = getGameObject(item);

    if (gameObj?.dom?.oEditorFlag) {
      gameObj.dom.oEditorFlag.remove();
      gameObj.dom.oEditorFlag = null;
    }

    if (gameObj?.objects) {
      ['balloon', 'bunker', 'chain'].forEach((type) => {
        const obj = checkLinkedObject(gameObj.objects, type);
        if (obj) deSelectItem(obj);
      });
    }

  }

  function clearSelectedItems() {

    data.selectedItems.forEach((item) => deSelectItem(item));
    data.selectedItems = [];

  }

  function isSelected(item) {

    return (data.selectedItems.indexOf(item) !== -1);
    
  }

  function deleteSelectedItems() {

    // delete / backspace keys
    data.selectedItems.forEach((item) => deleteItem(item));

  }

  function removeFromGameObjects(obj) {

    if (!obj?.data?.id) return;

    delete game.objectsById[obj.data.id];

    const ref = obj.data.isTerrainItem ? 'terrain-item' : obj.data.type;
    
    const offset = game.objects[ref].indexOf(obj);

    if (offset !== -1) {
      game.objects[ref].splice(offset, 1);
    }
    
  }

  function deleteItem(item) {

    // remove something from the battlefield.
    const gameObject = getGameObject(item);

    if (gameObject) {

      if (gameObject.die) {

        // special case: kill the related ones, too.
        if (gameObject.objects) {
          ['balloon', 'bunker', 'chain'].forEach((type) => {
            const obj = checkLinkedObject(gameObject.objects, type);
            if (obj) getGameObject(obj)?.die();
          });
        }

        // if dead, then destroy and forcefully remove entirely.
        if (gameObject.data.type === TYPES.turret && gameObject.data.dead) {
          gameObject.destroy();
          removeFromGameObjects(gameObject);
        } else {
          gameObject.die();
          if (gameObject.data.type !== TYPES.turret && gameObject.data.type !== TYPES.bunker) {
            removeFromGameObjects(gameObject);
          }
        }

        // special super-bunker case: forcefully remove.
        // this should be cleaned up on the next `gameLoop.animate()`.
        if (gameObject.data.type === TYPES.superBunker) {
          gameObject.destroy();
        }

        // deselect if the DOM node has been removed.
        // turrets can be "killed" first, then destroyed.
        // bunkers can be blown up, and remain selected until they're removed.
        if (!gameObject?.dom?.o) {
          deSelectItem(item);
        }
        
      } else {

        gameObject?.dom?.o?.remove();
        deSelectItem(item);
        removeFromGameObjects(gameObject);

      }

    } else {

      // take out the raw node.
      item?.remove();
      deSelectItem(item);

    }
   
  }

  function moveSelectedItemsX(vX) {

    data.selectedItems.forEach((item) => {

      const newX = parseFloat(item.dataset.x) + vX;

      // write the new value back to the DOM
      // item.dataset.newX = newX;

      // new offset, relative to viewport
      const left = newX + game.objects.view.data.battleField.scrollLeft;

      const gameObj = getGameObject(item);

      if (!gameObj) return;
  
      item.dataset.x = newX;
      gameObj.data.x = left;

      if (gameObj?.dom?.oEditorFlag) {
        gameObj.dom.oEditorFlag.innerHTML = Math.floor(left);
      }

      zones.refreshZone(gameObj);
      
    });

  }

  function setItemIsEnemy(item, isEnemy) {

    const gameObj = getGameObject(item);
    if (!gameObj) return;

    // certain types (e.g., terrain items) don't take sides.
    if (gameObj.data.isTerrainItem) return;
    if (gameObj.data.type === TYPES.cloud) return;
    
    utils.css.addOrRemove(gameObj.dom.o, isEnemy, css.enemy);

    // if capture method exists, use that.
    if (gameObj.capture) {
      gameObj.capture(isEnemy);
    } else {
      gameObj.data.isEnemy = isEnemy;
      zones.changeOwnership(gameObj, isEnemy);
    }

    // also, check for balloon <-> chain <-> bunker connections.
    if (gameObj?.objects) {
      ['balloon', 'bunker', 'chain'].forEach((type) => {
        const obj = checkLinkedObject(gameObj.objects, type);
        if (obj && getGameObject(obj)?.data?.isEnemy !== isEnemy) setItemIsEnemy(obj, isEnemy);
      });
    }

  }

  function setEnemyState(isEnemy) {

    // local editor state, e.g., units added will be enemy if this is true
    data.isEnemy = isEnemy;

    data.selectedItems.forEach((item) => setItemIsEnemy(item, isEnemy));
    
  }

  function moveItemRelativeToMouse(item, e = { clientX: data.mouseX, clientY: data.mouseY }) {

    if (!item) return;

    const scale = 1 / game.objects.view.data.screenScale;

    // move logical offset a relative amount
    const newX = parseFloat(item.dataset.x) + ((e.clientX - data.mouseDownX) * scale);

    // write the new value back to the DOM
    item.dataset.newX = newX;

    // new offset, relative to viewport
    const left = newX + game.objects.view.data.battleField.scrollLeft;

    let top;

    if (item.dataset.y) {
      top = parseFloat(item.dataset.y) + ((e.clientY - data.mouseDownY) * scale);
      item.dataset.newY = top;
    }

    // game object? "moveTo()" will do the work. otherwise, move manually.

    const gameObj = getGameObject(item);

    if (!gameObj) return;

    gameObj.data.x = left;

    if (item.dataset.y) {
      gameObj.data.y = top;
    }

    if (gameObj?.dom?.oEditorFlag) {
      gameObj.dom.oEditorFlag.innerHTML = Math.floor(left);
    }

    zones.refreshZone(gameObj);

  }

  function moveRelativeToMouse(e) {

    data.selectedItems.forEach((item) => moveItemRelativeToMouse(item, e));

  }

  function scaleScrubber() {

    // match the viewport width, relative to the world width.
    const relativeWidth = (game.objects.view.data.browser.width / worldWidth);

    data.scrubberWidth = relativeWidth * game.objects.view.data.browser.width;

    dom.oRadarScrubber.style.width = `${data.scrubberWidth}px`;
    
  }

  function getScrubberX(clientX) {

    const maxOverflow = (game.objects.view.data.browser.halfWidth / worldWidth);

    // move relative to where the slider was grabbed.
    clientX -= data.mouseOffsetX;

    let xOffset;

    xOffset = (clientX / game.objects.view.data.browser.width) * 1 / game.objects.view.data.screenScale;

    xOffset = Math.min(1 - maxOverflow, Math.max(0 - maxOverflow, xOffset));

    game.objects.view.setLeftScroll(xOffset * worldWidth);

    const scrubberX = ((game.objects.view.data.browser.width) * xOffset);

    // position, centered, 0-100%.
    return scrubberX;
    
  }

  function setLeftScroll(clientX) {

    // dragging scrubber directly
    if (data.mouseDownTarget === dom.oRadarScrubber) {

      data.scrubberX = getScrubberX(clientX);
      dom.oRadarScrubber.style.transform = `translate(${data.scrubberX}px, 0px)`;

    } else {

      // dragging the battlefield. move relatively.
      const maxOverflow = game.objects.view.data.browser.halfWidth;

      let xOffset = data.mouseDownScrollLeft + ((clientX - data.mouseDownX) * 1 / game.objects.view.data.screenScale);

      // limit range.
      xOffset = Math.min(worldWidth - maxOverflow, Math.max(-maxOverflow, xOffset));

      // pixels, up to world width.
      game.objects.view.setLeftScroll(xOffset);

      data.scrubberX = (xOffset / worldWidth) * game.objects.view.data.browser.width;

      dom.oRadarScrubber.style.transform = `translate(${data.scrubberX}px, 0px)`;

    }

  }

  function normalizeSprite(node) {

    // a nested `.transform-sprite` node may be present; return the parent, if so.
    if (utils.css.has(node, 'transform-sprite')) return node.parentNode;
    return node;

  }

  function setCursor(cursor) {

    game.objects.view.dom.battleField.style.cursor = cursor;

  }

  function updateMarqueeSelection(id, isSelected) {

    // in terms of selection, editor refers to items via the DOM.
    const item = game.objectsById[id]?.dom?.o;

    // becoming selected
    if (!data.marqueeSelected[id] && isSelected) {
      data.marqueeSelected[id] = true;
      if (downKeys.shift) {
        toggleSelectItem(item);
      } else {
        selectItem(item);
      }
      return;
    }

    if (data.marqueeSelected[id] && !isSelected) {
      data.marqueeSelected[id] = false;
      if (downKeys.shift) {
        toggleSelectItem(item);
      } else {
        deSelectItem(item);
      }
    }

  }

  events = {

    keydown(e) {

      const key = e.key?.toLowerCase();

      downKeys[key.keyCode] = true;
      downKeys[key] = true;

      if (keysToMethods[key]) {
        keysToMethods[key](e);
        return;
      }

      if (e.keyCode === keyMap.esc) {
        setMode('DEFAULT');
        clearSelectedItems();
      }

      // return true = allow game to handle key

    },

    keyup(e) {

      downKeys[e.keyCode] = false;

      const key = e.key?.toLowerCase();
      downKeys[key] = false;

      // return true = allow game to handle key

    },

    mousedown(e) {

      if (prefsManager.isActive()) return;

      // ignore right clicks, no special treatment here.
      if (e.button) return;

      // finder window close button?
      if (e.target.className === 'close-button') return;

      let { clientX, clientY } = e;

      data.mouseDown = true;
      data.mouseDownTarget = e.target;
      data.mouseDownX = clientX;
      data.mouseDownY = clientY;
      data.mouseMoveCount = 0;

      setCursor('grabbing');

      const { method } = e.target.dataset;

      // e.g., data-method="export"
      if (method && methods[method]) {
        methods[method]();
        return;
      }  

      let target = normalizeSprite(data.mouseDownTarget);

      if (isChildOfClassName(target, 'title-bar')) {

        target = isChildOfClassName(target, 'finder');

        dom.oWindow = target;

        utils.css.add(target, css.active);

        data.draggingWindow = true;

        const rect = dom.oWindow.getBoundingClientRect();
        data.windowX = rect.x * safariScaleOffset;
        data.windowY = rect.y * safariScaleOffset;
        
        return stopEvent(e);
      }

      if (isChildOfClassName(target, 'finder')) {
        // don't interfere with clicks inside modal.
        return;
      }

      const isSprite = utils.css.has(target, 'sprite');

      if (downKeys.meta) {

        // if on a sprite, then toggle selection and exit.
        if (isSprite) {
          toggleSelectItem(target);
          return stopEvent(e);
        }

        // clear unless also shift
        if (!downKeys.shift) {
          clearSelectedItems();
        }

        data.marqueeActive = true;

        Object.assign(dom.oMarquee.style, {
          width: '0px',
          height: '0px',
          left: '-2px',
          top: '-2px',
          opacity: 1
        });

        data.marquee = {
          x: 0,
          y: 0,
          w: 0,
          h: 0
        };

        data.marqueeSelected = {};

        return stopEvent(e);

      }

      if (data.mouseDownTarget === dom.oRadarScrubber || !isSprite) {

        data.scrubberActive = true;

        if (e.target !== dom.oCutoffLine) {
          utils.css.add(dom.oRadarScrubber, css.active);
        }

        // move relative to "grab point"
        data.mouseOffsetX = clientX - (data.scrubberX * game.objects.view.data.screenScale);

        data.mouseDownScrollLeft = parseFloat(game.objects.view.data.battleField.scrollLeft);

        if (!data.activeTool) {
          return stopEvent(e);
        }

      }

      if (data.activeTool && e.target === dom.oCutoffLine) {

        // assume we're adding something.
        addItemAtMouse({ clientX, clientY });

      }

      // selection mode, and clicking on an item?
      
      if (isSprite) {

        // it's a game sprite.
        // if meta key is NOT down, also clear selection.

        if (!downKeys.meta) {

          // if not selected, clear all and select this one?
          if (!isSelected(target)) {
            clearSelectedItems();
          }

          selectItem(target);

        } else {

          toggleSelectItem(target);

        }

        return stopEvent(e);
      
      } else {

        // there was a click somewhere else.
        if (!downKeys.meta) clearSelectedItems();

      }

      if (e.target.tagName === 'DIV') return stopEvent(e);

    },

    mousemove(e) {

      let { clientX, clientY } = e;

      data.mouseX = clientX;
      data.mouseY = clientY;

      data.mouseMoveCount++;

      if (!data.mouseDown) return;

      if (data.draggingWindow) {

        const deltaX = Math.abs(data.mouseDownX - data.windowX);
        const deltaY = Math.abs(data.mouseDownY - data.windowY);

        dom.oWindow.style.top = ((data.mouseY - deltaY) / safariScaleOffset) + 'px';
        dom.oWindow.style.left = (((data.mouseX - deltaX) / safariScaleOffset)) + 'px';

        return;

      }

      if (data.marqueeActive) {

        const scale = (1 / game.objects.view.data.screenScale);

        const deltaX = Math.abs(data.mouseX - data.mouseDownX);
        const deltaY = Math.abs(data.mouseY - data.mouseDownY);

        let startX, startY;

        startX = data.mouseX < data.mouseDownX ? data.mouseX : data.mouseDownX;
        startY = data.mouseY < data.mouseDownY ? data.mouseY : data.mouseDownY;

        data.marquee = {
          x: startX * scale,
          y: startY * scale,
          w: deltaX * scale,
          h: deltaY * scale
        };

        dom.oMarquee.style.left = `${data.marquee.x}px`;
        dom.oMarquee.style.top = `${data.marquee.y}px`;

        dom.oMarquee.style.width = `${data.marquee.w}px`;
        dom.oMarquee.style.height = `${data.marquee.h}px`;

        // for zones, need to align with battlefield.
        const adjustedX = data.marquee.x + game.objects.view.data.battleField.scrollLeft;

        // zones and collision stuff
        const startZone = Math.floor(adjustedX / zones.ZONE_WIDTH);
        const endZone = Math.floor((adjustedX + data.marquee.w) / zones.ZONE_WIDTH);

        const marqueeRect = {
          x: adjustedX,
          y: data.marquee.y,
          width: data.marquee.w,
          height: data.marquee.h
        };

        let objects;

        for (var i = startZone; i <= endZone; i++) {

          if (!zones.objectsByZone[i]?.all) continue;

          objects = zones.objectsByZone[i].all;

          for (let type in objects) {
            // e.g., tanks within zone #i
            for (let id in objects[type]) {
              // mark as "in" or "out", accordingly.
              updateMarqueeSelection(id, game.objectsById[id]?.data && collisionCheck(marqueeRect, game.objectsById[id].data));
            }
          }

        }

        return;

      }

      if (data.scrubberActive) {

        // if scrubber is being dragged, move battlefield same direction.
        if (data.mouseDownTarget === dom.oRadarScrubber) {
          setLeftScroll(clientX);
        } else {
          // move opposite of mouse direction.
          setLeftScroll(data.mouseDownX + (data.mouseDownX - clientX));
        }

      } else {

        moveRelativeToMouse({ clientX, clientY });

      }

    },

    mouseup(e) {

      // finder window close button?
      if (e.target.className === 'close-button') {
        const oWindow = isChildOfClassName(e.target, 'finder');
        if (oWindow) {
          oWindow.style.display = 'none';
          dom.oShowHelp.style.display = 'inline';
          utils.storage.set(HELP_X_PREF, true);
        }
        return stopEvent(e);
      }

      if (data.scrubberActive) {
        utils.css.remove(dom.oRadarScrubber, css.active);
        data.scrubberActive = false;
      }

      if (data.marqueeActive) {
        dom.oMarquee.style.opacity = 0;
        data.marqueeActive = false;
      }

      if (data.draggingWindow) {
        utils.css.remove(dom.oWindow, css.active);
        const rect = dom.oWindow.getBoundingClientRect();
        data.windowX = rect.x * safariScaleOffset;
        data.windowY = rect.y * safariScaleOffset;
        data.draggingWindow = false;
      }

      const spriteClicked = data.mouseDownTarget && utils.css.has(data.mouseDownTarget, 'sprite');
      const justAddedSomething = (data.activeTool && data.mouseDownTarget === dom.oCutoffLine);
      
      if (!spriteClicked && !justAddedSomething && !downKeys.shift && !data.mouseMoveCount) {
        clearSelectedItems();
      }

      // this ensures that everything is up to date, whether one item moved or the whole window was scrolled.
      data.selectedItems.forEach((item) => refreshItemCoords(item));

      data.mouseDown = false;

      setCursor('grab');

      data.mouseMoveCount = 0;

    },

    resize() {
      
      scaleScrubber();

      // move to where the view is now at.
      // TODO: ensure this value stays in sync with the scroll width calculations.
      data.scrubberX = (game.objects.view.data.battleField.scrollLeft / worldWidth) * game.objects.view.data.browser.width;
      dom.oRadarScrubber.style.transform = `translate(${data.scrubberX}px, 0px)`;

    }

  };
  
  exports = {
    data,
    dom,
    events,
    init: initEditor
  };

  return exports;

};

export { Editor };