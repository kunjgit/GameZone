import { game } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { common } from '../core/common.js';
import { screenScale } from '../aa.js';
import { gamePrefs } from './preferences.js';
import { isFirefox, isMobile, isSafari, oneOf, TYPES, winloc, worldWidth } from '../core/global.js';
import { playSound, skipSound, stopSound, sounds, playSoundWithDelay } from '../core/sound.js';
import { soundsToPlayBNB } from '../core/sound-bnb.js';
import { RadarItem } from './RadarItem.js';
import { sprites } from '../core/sprites.js';

const Radar = () => {

  let data;
  let css;
  let dom;
  let exports;
  let layoutCache;
  let objects;

  const spliceArgs = [null, 1];
  const leftBoundary = -0.0055;
  const rightBoundary = 1 - 0.005;

  const noJamming = winloc.match(/noJam/i);

  const staticTypes = {
    [TYPES.turret]: true,
    [TYPES.base]: true,
    [TYPES.bunker]: true,
    [TYPES.endBunker]: true,
    [TYPES.superBunker]: true
  };

  function setStale(isStale) {
    data.isStale = isStale;
  }

  function setIncomingMissile(incoming, newestMissile) {

    if (data.incomingMissile === incoming) return;

    utils.css[incoming ? 'add' : 'remove'](game.objects.view.dom.worldWrapper, css.incomingSmartMissile);

    data.incomingMissile = incoming;

    if (incoming) {

      /*
      // don't warn player in extreme mode, when radar is jammed.
      if (data.isJammed && gameType === 'extreme') {
        return;
      }
      */

      playSound(sounds.missileWarning);

      if (data.missileWarningCount < 3) {
        game.objects.notifications.add('🚀 Incoming smart missile! 😬');
        data.missileWarningCount++;
      }

      common.setFrameTimeout(() => {
        if (!data.incomingMissile) return;
        playSound(sounds.bnb[newestMissile.data.isRubberChicken ? 'incomingSmartMissilePlusCock' : 'incomingSmartMissile']);
      }, 1000);

    } else if (sounds.missileWarning?.sound) {

      stopSound(sounds.missileWarning);

    }

  }

  function getLayout(itemObject) {

    let type = itemObject.data.parentType;

    // cache hit, based on "type"
    if (layoutCache[type]) return layoutCache[type];

    // data to merge with itemObject
    let result = {
      layout: {
        width: 0,
        height: 0,
      },
      bottomAlignedY: 0
    };

    // if we hit this, something is wrong.
    if (!itemObject?.dom?.o) {
      console.warn('getLayout: something is wrong, returning empty result.', itemObject);
      return result;
    }

    // if radar is jammed, items will be display: none and layout can't be read. bail.
    if (data.isJammed) return itemObject;

    // read from DOM ($$$) and cache
    // note: offsetWidth + offsetHeight return integers, and without padding.

    // performance note: this is $$$ - do away with it.
    let rect = itemObject.dom.o.getBoundingClientRect();

    // NOTE screenScale, important for positioning
    result.layout.width = rect.width;
    result.layout.height = rect.height;

    // if using transforms, screenScale needs to be taken into account (and offset)
    // because these items get scaled with the whole view being transformed.
    // TODO: don't rely on isFirefox
    if (isFirefox || isSafari) {
      result.layout.width /= screenScale;
      result.layout.height /= screenScale;
    }

    // hackish: adjust as needed, accounting for borders etc.
    if (type === 'bunker') {
      result.layout.height -= 2;
    } else if (type === 'helicopter') {
      // technically, helicopter height is 0 due to borders making triangle shape.
      result.layout.height = 3;
    } else if (type === 'balloon') {
      result.layout.height -= 2;
    } else if (type === 'smart-missile') {
      result.layout.height -= 2;
    }

    if (itemObject.oParent.data.bottomAligned) {
      // radar height, minus own height
      result.bottomAlignedY = data.height - result.layout.height;
    }

    // cache
    layoutCache[type] = result;

    return result;

  }

  function addItem(item, className, canRespawn) {

    let itemObject;

    // for GPU acceleration: note if this is an "animated" type.
    if (data.animatedTypes.includes(item.data.type)) {
      className += ` ${css.radarItemAnimated}`;
    }

    itemObject = RadarItem({
      o: sprites.withStyle(document.createElement('div')),
      parentType: item.data.type,
      className,
      oParent: item,
      canRespawn: (canRespawn || false),
      isStatic: false,
      // width + height, determined after append
      layout: null,
      // assigned if bottom-aligned (static)
      bottomAlignedY: 0
    });

    game.objects.queue.addNextFrame(() => {
      dom.radar.appendChild(itemObject.dom.o);

      // attempt to read from layout cache, or live DOM if needed for item height / positioning
      itemObject = common.mixin(itemObject, getLayout(itemObject));

      objects.items.push(itemObject);

    });

    // Slightly hackish: tack radarItem on to exports.
    // setTargetTracking() looks at this reference.
    item.radarItem = itemObject;

    game.objects.stats.create(item);

    return itemObject;

  }

  function enemyVansOnScreen() {
    return game.objects[TYPES.van].filter((van) => van.data.isEnemy && van.data.isOnScreen).length;
  }

  function startJamming() {

    // [ obligatory Bob Marley reference goes here ]

    if (game.objects.editor) return;

    if (noJamming) return;

    data.isJammed = true;

    updateOverlay();

    utils.css.add(game.objects.view.dom.worldWrapper, css.jammed);

    if (!gamePrefs.sound) return;

    if (sounds.radarStatic) {
      playSound(sounds.radarStatic);
    }

    if (sounds.radarJamming) {
      playSound(sounds.radarJamming);
    }

    // we may be dead; ignore if so.
    if (game.players.local.data.dead) return;

    const dieCount = parseInt(game.data.dieCount, 10);

    function onPlayCheck(sound) {
      // make sure this happens only if still jammed, AND, there aren't several sounds queued up.
      if (!data.isJammed || game.data.dieCount > dieCount || soundsToPlayBNB.length > 2 || !enemyVansOnScreen()) {
        skipSound(sound);
      }
    }

    function onFinishCheck() {
      // note: scoped to SMSound instance
      if (this.skipped || game.data.isBeavis || Math.random() <= 0.5) return;
      playSoundWithDelay(oneOf([sounds.bnb.tryAndPayAttention, sounds.bnb.beavisOhYeah]), null, { onplay: onPlayCheck });
    }

    // half the time, commentary.
    if (Math.random() >= 0.5) {
      playSoundWithDelay(sounds.bnb[game.data.isBeavis ? 'radarJammedBeavis' : 'radarJammedButthead'], null, { onplay: onPlayCheck, onfinish: onFinishCheck }, 2000);
    }


    if (data.jamCount < 3) {
      game.objects.notifications.add('🚚 An enemy van is jamming your radar 📡 🚫');
    }

    // extreme mode: don't warn player about incoming missiles when radar is jammed, either.
    // i.e., you lose visibility.
    // if (gameType === 'extreme') setIncomingMissile(false);


  }

  function updateOverlay() {

    const id = 'radar-jammed-overlay';
    let o = document.getElementById(id);

    if (!data.isJammed) {
      if (o) {
        utils.css.remove(o, 'active');
        common.setFrameTimeout(() => {
          o.remove();
          o = null;
        }, 1024);
      }
      return;
    }

    if (!o) {

      o = document.createElement('div');
      o.id = id;
      o.innerHTML = '<div class="noise"></div>';

      document.body.appendChild(o);

      common.setFrameTimeout(() => {
        if (!o) return;
        let css = ['active'];
        // useful for when screencasting / recording / streaming - this effect can kill framerate.
        if (window.location.href.match(/staticRadar/i)) css.push('static');
        utils.css.add(o, ...css);
        o = null;
      }, 128);

    }

  }

  function stopJamming() {

    data.isJammed = false;

    updateOverlay(data.isJammed);

    utils.css.remove(game.objects.view.dom.worldWrapper, css.jammed);

    if (sounds.radarJamming) {
      stopSound(sounds.radarJamming);
    }

    if (data.jamCount < 3) {
      game.objects.notifications.add('Radar has been restored 📡');
      data.jamCount++;
    }

  }

  function clearTarget() {

    data.radarTarget = null;
    dom.targetMarker.style.visibility = 'hidden';

  }

  // pixel pushing for a few types, so the underlying "bar" lines up with the radar sprite.
  const markerOffsets = {
    [TYPES.bunker]: 2.75,
    [TYPES.turret]: 6.5,
    [TYPES.helicopter]: 24,
    [TYPES.balloon]: 6
  };

  function updateTargetMarker(targetItem) {

    // sanity check: ensure this object still exists.
    if (!targetItem?.oParent?.dom?.o) return;

    if (!targetItem.layout?.width) return;

    const { width } = targetItem.layout;

    if (width && data.radarTargetWidth !== width) {
      // TODO: improve Safari layout.
      dom.targetMarker.style.width = `${width + (!isMobile && isSafari ? screenScale / 2 : 0)}px`;
      data.radarTargetWidth = width;
    }

    const offset = ((markerOffsets[targetItem?.oParent?.data.type] || 1) / screenScale * 0.5);

    dom.targetMarker.style.transform = `translate3d(${targetItem.data.left + offset}px, 0px, 0px)`;

  }

  function markTarget(targetItem) {

    if (!data.radarTarget && targetItem) {
      dom.targetMarker.style.visibility = 'visible';
      updateTargetMarker(targetItem);
      if (targetItem.isStatic || targetItem.data.left) {
        updateTargetMarker(targetItem);
      }
    } else if (data.radarTarget && !targetItem) {
      dom.targetMarker.style.visibility = 'hidden';
    }

    data.radarTarget = targetItem;

  }

  function _removeRadarItem(offset) {

    sprites.removeNodes(objects.items[offset].dom);
    // faster splice - doesn't create new array object (IIRC.)
    spliceArgs[0] = offset;
    Array.prototype.splice.apply(objects.items, spliceArgs);

  }

  function removeRadarItem(item) {

    // find and remove from DOM + array
    const offset = objects?.items?.indexOf(item);

    if (offset !== undefined) {
      if (offset === -1) return;
      _removeRadarItem(offset);
      return;
    }

  }

  function reset() {

    // remove all
    const dieOptions = { silent: true };

    objects?.items?.forEach((item) => {
      item.die(dieOptions);
    })
    
  }

  function animate() {

    let i, j, left, top, hasEnemyMissile, newestMissile, isInterval;

    hasEnemyMissile = false;

    // update some items every frame, most items can be throttled.
    isInterval = (data.frameCount++ >= data.animateInterval);

    if (isInterval) {
      data.frameCount = 0;
    }

    /**
     * Even if jammed, missile count needs checking.
     * Otherwise, "incoming missile" UI / state could get stuck
     * when a missile is destroyed while the radar is jammed.
     */
    if (game.objects[TYPES.smartMissile].length !== data.lastMissileCount) {

      // change state?

      for (i = 0, j = game.objects[TYPES.smartMissile].length; i < j; i++) {

        // is this missile not dead, not expired/hostile, and an enemy?

        if (
          !game.objects[TYPES.smartMissile][i].data.dead
          && !game.objects[TYPES.smartMissile][i].data.hostile
          && game.objects[TYPES.smartMissile][i].data.isEnemy !== game.players.local.data.isEnemy
        ) {

          hasEnemyMissile = true;

          newestMissile = game.objects[TYPES.smartMissile][i];

          break;

        }

      }

      data.lastMissileCount = game.objects[TYPES.smartMissile].length;

      setIncomingMissile(hasEnemyMissile, newestMissile);

    }

    // don't animate when radar is jammed.
    // avoid lots of redundant style recalculations.
    if (data.isJammed && !data.isStale) return;

    // move all radar items

    for (i = 0, j = objects.items.length; i < j; i++) {

      // just in case: ensure the object still has a DOM node.
      if (!objects.items[i]?.dom?.o) continue;

      // is this a "static" item which is positioned only once and never moves?
      // additionally: "this is a throttled update", OR, this is a type that gets updated every frame.
      // exception: bases and bunkers may be "dirty" due to resize, `isStale` will be set. force a refresh in that case.

      if (data.isStale || (!objects.items[i].isStatic && (isInterval || data.animateEveryFrameTypes.includes(objects.items[i].oParent.data.type)))) {
        
        if (!game.objects.editor && !objects.items[i].isStatic && staticTypes[objects.items[i].oParent.data.type]) {
          objects.items[i].isStatic = true;
        }

        // constrain helicopters only, so they don't fly out-of-bounds
        if (objects.items[i].oParent.data.type === TYPES.helicopter) {
          left = (Math.max(leftBoundary, Math.min(rightBoundary, (objects.items[i].oParent.data.x / worldWidth))) * (game.objects.view.data.browser.width - 5)) + 4;
        } else {
          // X coordinate: full world layout -> radar scale, with a slight offset (so bunker at 0 isn't absolute left-aligned)
          left = ((objects.items[i].oParent.data.x / worldWidth) * (game.objects.view.data.browser.width - 5)) + 4;
        }

        // get layout, if needed (i.e., new object created while radar is jammed, i.e., engineer, and its layout hasn't been read + cached from the DOM)
        if (!objects.items[i].layout) {
          objects.items[i] = common.mixin(objects.items[i], getLayout(objects.items[i]));
        }

        // bottom-aligned, OR, somewhere between top and bottom of radar display, accounting for own height
        top = objects.items[i].bottomAlignedY || (objects.items[i].oParent.data.y / game.objects.view.data.battleField.height) * data.height - (objects.items[i]?.layout?.height || 0);

        // depending on parent type, may receive an additional transform property (e.g., balloons get rotated as well.)
        sprites.setTransformXY(objects.items[i], objects.items[i].dom.o, `${left}px`, `${top}px`, data.extraTransforms[objects.items[i].oParent.data.type]);

        objects.items[i].data.left = left;

        if (objects.items[i] === data.radarTarget) {
          updateTargetMarker(objects.items[i]);
        }

      }

    }

    if (data.isStale) {

      // force-refresh
      updateTargetMarker(data.radarTarget);

      // only do this once.
      data.isStale = false;

    }

  }

  function initRadar() {

    dom.radar = document.getElementById('radar');
    data.height = dom.radar.offsetHeight;

    dom.targetMarker = document.createElement('div');
    dom.targetMarker.style.visibility = 'hidden';
    dom.targetMarker.className = `target-marker target-ui`;
    document.getElementById('world-wrapper').appendChild(dom.targetMarker);

  }

  // width / height of rendered elements, based on class name
  layoutCache = {};

  css = {
    incomingSmartMissile: 'incoming-smart-missile',
    jammed: 'jammed',
    radarItemAnimated: 'radar-item--animated'
  };

  objects = {
    items: []
  };

  data = {
    frameCount: 0,
    radarTarget: null,
    radarTargetWidth: 0,
    animatedTypes: [
      TYPES.bomb,
      TYPES.balloon,
      TYPES.helicopter,
      TYPES.tank,
      TYPES.gunfire,
      TYPES.infantry,
      TYPES.parachuteInfantry,
      TYPES.engineer,
      TYPES.missileLauncher,
      TYPES.shrapnel,
      TYPES.van
    ],
    // try animating every frame, for now; it's all on the GPU, anyway.
    animateInterval: 1,
    animateEveryFrameTypes: [
      TYPES.helicopter,
      TYPES.shrapnel,
      TYPES.bomb,
      TYPES.gunfire,
      TYPES.smartMissile
    ],
    height: 0,
    isJammed: false,
    isStale: false,
    jamCount: 0,
    missileWarningCount: 0,
    lastMissileCount: 0,
    incomingMissile: false,
    // additional transform properties applied during radar item animation
    extraTransforms: {
      balloon: 'rotate3d(0, 0, 1, -45deg)'
    }
  };

  dom = {
    radar: null,
    radarItem: null,
    targetMarker: null
  };

  initRadar();

  exports = {
    addItem,
    animate,
    clearTarget,
    data,
    dom,
    markTarget,
    removeItem: removeRadarItem,
    reset: reset,
    setStale,
    startJamming,
    stopJamming
  };

  return exports;

};

export { Radar };