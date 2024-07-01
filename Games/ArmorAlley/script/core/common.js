import { game } from '../core/Game.js';
import { gamePrefs } from '../UI/preferences.js';
import { debugCollision, FRAMERATE, oneOf, rngPlusMinus, rngInt, TYPES, rng, isMobile, isSafari } from '../core/global.js';
import { frameTimeoutManager } from '../core/GameLoop.js';
import { zones } from './zones.js';
import { sprites } from './sprites.js';
import { net } from './network.js';
import { utils } from './utils.js';

// unique IDs for quick object equality checks
let guid = 0;

// per-type counters, more deterministic
let guidByType = {};

// TYPES include camelCase entries e.g., missileLauncher, those will be ignored here.
for (let type in TYPES) {
  if (!type.match(/[A-Z]/)) {
    guidByType[type] = 0;
  }
}

// for network: certain items need to be not prefixed.
// basically, all "static" / shared terrain items generated at game start - and helicopters.
const staticIDTypes = {
  [TYPES.helicopter]: true,
  [TYPES.bunker]: true,
  [TYPES.cornholio]: true,
  [TYPES.chain]: true,
  [TYPES.balloon]: true,
  [TYPES.base]: true,
  [TYPES.endBunker]: true,
  [TYPES.superBunker]: true,
  [TYPES.turret]: true,
  [TYPES.terrainItem]: true
};

// noisy, and hopefully, deterministic events that can be ignored.
const excludeFromNetworkTypes = {
  // [TYPES.gunfire]: true,
  [TYPES.shrapnel]: true,
  [TYPES.superBunker]: true
}

const PREFIX_HOST = 'host_';
const PREFIX_GUEST = 'guest_';

const defaultCSS = {
  animating: 'animating',
  dead: 'dead',
  enemy: 'enemy',
  exploding: 'exploding'
};

const defaultCSSKeys = Object.keys(defaultCSS);

const debugRects = [];

function makeDebugRect(obj, viaNetwork) {

  if (!obj?.data) return;

  const { data } = obj;

  let { x, y } = data;

  function update() {
    if (!o?.style) return;
    o.style.transform = `translate3d(${x - game.objects.view.data.battleField.scrollLeft}px, ${y}px, 0px)`;
  }

  const o = document.createElement('div');
  o.className = 'debug-rect';

  Object.assign(o.style, {
    position: 'absolute',
    top: '0px',
    left: '0px',
    width: `${data.width}px`,
    height: `${data.height}px`,
    border: `1px ${viaNetwork ? 'dotted' : 'solid'} ${data.isEnemy ? '#990000' : '#009900'}`,
    color: '#fff',
    'font-size': '4px'
  });

  update();

  // text inside element
  const span = document.createElement('span');
  const style = {};

  if (viaNetwork) {
    style.right = '1px';
    style.bottom = '1px';
  } else {
    style.left = '1px';
    style.top = '1px';
  }

  Object.assign(span.style, style);

  span.innerHTML = data.id + (data.parent ? data.parent?.data.id : '') + (viaNetwork ? ' 📡' : '');
  o.appendChild(span);

  game.dom.battlefield.appendChild(o);

  debugRects.push(update);

  if (!viaNetwork) {
    // push the same remotely
    const basicData = {
      id: data.id,
      x: data.x,
      y: data.y,
      width: data.width,
      height: data.height,
      isEnemy: data.isEnemy
    };

    if (data.parent?.data.id) {
      basicData.parent = {
        data: {
          id: data.parent.data.id
        }
      }
    }

    const viaNetwork = true;
    net.sendMessage({ type: 'MAKE_DEBUG_RECT', params: [ basicData, viaNetwork ] });
  }

  return {
    update,
    o
  }

}

function getRenameString(oldName, newName, fromNetworkEvent) {

  const strings = [
    '%1 is now %2.',
    '%1 has handed the reins over to %2.',
    '%1 has given control to %2.',
    'The artist formerly known as %1 is now known as %2.',
    'Forget everything you knew about %1, they are now %2.'
  ];

  let str = strings[parseInt(Math.random() * strings.length, 10)];

  // hackish: ignore default "guest" and "host" if game has started, use nicer context-appropriate wording.

  const isGuest = (oldName === 'guest');
  const isHost = (oldName === 'host');

  if (isGuest || isHost) {

    // naming depends on the player's friendliness.
    if (fromNetworkEvent && game.data.started) {
      oldName = (game.players.remoteHuman.data.isEnemy === game.players.local.data.isEnemy ? 'your friend' : 'your opponent');
    } else {
      if (isGuest) oldName = 'the guest';
      if (isHost) oldName = 'the host';
    }

  }

  str = str.replace('%1', oldName).replace('%2', newName);

  return str.charAt(0).toUpperCase() + str.slice(1);

}

const slashCommands = {

  '/name': (newName, fromNetworkEvent) => {

    // hackish: "from network event" means the remote changed names.
    const playerName = fromNetworkEvent ? gamePrefs.net_remote_player_name : gamePrefs.net_player_name;

    // name must change, and must be unique.
    if (newName === gamePrefs.net_remote_player_name || newName === gamePrefs.net_player_name) return;

    const msg = getRenameString(playerName, newName, fromNetworkEvent);

    if (game.data.started) {
      game.objects.notifications.add(msg);
    }

    if (!fromNetworkEvent) {
      // update locally, and send
      gamePrefs.net_player_name = newName;
      net.sendMessage({ type: 'REMOTE_PLAYER_NAME', newName });
    }

  }

};

let loadedVideos = {};
let wzTimer;
let videoActive;

let gravestoneQueue = [];
let gravestoneTimer;

const smallDecor = [ 'barb-wire', 'checkmark-grass', 'flower', 'flower-bush', 'palm-tree', 'cactus' ];
const largeDecor = [ 'flowers', 'grass', 'sand-dune', 'sand-dunes' ];
const gravestoneTypes = [ 'gravestone', 'gravestone2', 'grave-cross' ];
const maxGravestoneRange = 64;
const maxQueueSize = 5;

function queueGravestoneWork() {

  // fire immediately, if queue is large enough.
  if (gravestoneQueue.length >= maxQueueSize) {
    processGravestoneQueue();
  }

  gravestoneTimer?.reset();

  gravestoneTimer = common.setFrameTimeout(processGravestoneQueue, 750);

}

// hackish: rng() version of oneOf()
function pickFrom(array) {
  if (!net.active) return oneOf(array);
  return array[rngInt(array.length, TYPES.terrainItem)];
}

function processGravestoneQueue() {

  gravestoneTimer = null;

  let clusters = [];
  let clusterOffset = 0;

  const extraCSS = 'dynamically-added submerged';

  // split X coordinates into "clusters", where applicable.

  if (gravestoneQueue.length >= 3) {

    // array of x coords, and "type" (based on thing that died)
    const items = gravestoneQueue.map((item) => ({ x: item[0].data.x, typeCSS: item[2] })).sort(utils.array.compare('x'));

    // pre-populate the first cluster
    clusters[0] = [items[0].x];

    // NOTE: loop starting at 1 intentionally.
    for (let i = 1, j = items.length; i < j; i++) {
      if (items[i].x - clusters[clusterOffset][0].x < maxGravestoneRange) {
        // within range; push onto current cluster.
        clusters[clusterOffset].push(items[i]);
      } else {
        // make a new cluster.
        clusters.push([items[i]]);
        clusterOffset++;
      }
    }

    // decorate clusters
    clusters.forEach((cluster) => {
      cluster.forEach((item, i) => {
        const { x, typeCSS } = item;
        if ((i + 1) % 2 === 0) {
          riseItemAfterDelay(game.addItem(`${pickFrom(smallDecor)} ${typeCSS} ${extraCSS}`, x + rngPlusMinus(rngInt(12, TYPES.terrainItem), TYPES.terrainItem)), 33 + (33 * (i + 1)));
        }
      });
      if (cluster.length > 2) {
        const i = 1 + rngInt(cluster.length - 1, TYPES.terrainItem);
        riseItemAfterDelay(game.addItem(`${pickFrom(largeDecor)} ${cluster[i].typeCSS} ${extraCSS}`, (cluster[i + 1] + cluster[i]) / 2), 33 + (33 * (i + 1)));
      }
    });

  }

  gravestoneQueue.forEach((item, i) => {

    const exports = item[0];
    const typeCSS = item[1];
    const type = pickFrom(gravestoneTypes);

    // gravestones face the side from which they died, per se.
    const flipX = exports.data?.isEnemy ? 'scaleX(-1)' : '';

    const stone = game.addItem(`${type} ${typeCSS} ${extraCSS}`, exports.data.x + exports.data.halfWidth, flipX);

    // rise from the ... grave? ;) 
    riseItemAfterDelay(stone, 33 + (66 * (i + 1)));

  });

  // reset
  gravestoneQueue = [];

}

const riseItemAfterDelay = (exports, delay = 33) => common.setFrameTimeout(() => utils.css.remove(exports?.dom?.o, 'submerged'), delay);

const common = {

  // given a list of keys, collect and return a new object of key/value pairs.
  pick: (o, ...props) => Object.assign({}, ...props.map(prop => ({[prop]: o[prop]}))),

  getRenameString,

  parseSlashCommand: (msg, fromNetwork = true) => {

    /**
     * given a text message, parse and return a function that will execute it.
     * e.g., "/name scott"
     */

    if (!msg?.length) return;

    if (msg.charAt(0) !== '/') return;

    const bits = msg.trim().split(' ');
    const cmd = bits[0].toLowerCase();

    // TODO: complain if slash command unknown?
    if (!slashCommands[cmd]) return;

    // TODO: multiple param support?
    const param = bits.splice(1).filter((item) => item.length).join(' ');

    if (!param.length) return;

    // note: returning a function.
    return () => slashCommands[cmd](param, fromNetwork);

  },

  animateDebugRects: () => {
    if (!debugRects.length) return;
    for (let i = 0, j = debugRects.length; i < j; i++) {
      debugRects[i]();
    }
  },

  makeDebugRect,

  unlinkObject: (obj) => {

    // drop "links" from zones, and objects by ID.
    if (!obj?.data?.id) return;
  
    if (obj.data.frontZone !== null || obj.data.rearZone !== null) {
      zones.leaveAllZones(obj);
    }
  
    game.objectsById[obj.data.id] = null;
    delete game.objectsById[obj.data.id];

    // off to the boneyard, ye scalleywag. ☠️
    if (net.active) {
      game.boneyard[obj.data.id] = {
        ts: performance.now(),
        attacker: obj?.data?.attacker?.id || 'unknown'
      };
    }
  
  },

  setFrameTimeout: (callback, delayMsec) => {

    /**
     * a frame-counting-based setTimeout() implementation.
     * millisecond value (parameter) is converted to a frame count.
     */
  
    let data, exports;
  
    data = {
      frameCount: 0,
      frameInterval: parseInt(delayMsec / FRAMERATE, 10), // e.g., msec = 1000 -> frameInterval = 60
      callbackFired: false,
      didReset: false,
    };
  
    function animate() {
  
      // if reset() was called, exit early
      if (data.didReset) return true; 
  
      data.frameCount++;
  
      if (!data.callbackFired && data.frameCount >= data.frameInterval) {
        callback();
        data.callbackFired = true;
        return true;
      }
  
      return false;
  
    }
  
    function reset() {
      // similar to clearTimeout()
      data.didReset = true;
    }
  
    exports = {
      animate,
      data,
      reset
    };
  
    frameTimeoutManager.addInstance(exports);
  
    return exports;
  
  },

  inheritData(data, options = {}) {

    // mix in defaults and common options
  
    let id = options.id || `obj_${guidByType[data.type]++}_${data.type}`;

    /**
     * Note: if prefixID, then prepend `host_` or `guest_`, if not already prefixed.
     * Things that are already prefixed are going to be remote objects.
     * This avoids collisions with other objects that might take the same number otherwise... hopefully. :P
     * Ground items e.g., base, bunker etc., use "static" IDs that do not need prefixing by design,
     * since they are created on both sides and their IDs need to match.
     */
    
    // TODO: maybe use `fromNetworkEvent` instead of matching host|guest
    // NOTE: no prefix if `options.id` was specified.
    if (net.active && !options.id && !options.staticID && !staticIDTypes[data.type] && !options.fromNetworkEvent) {
      id = `${net.isHost ? PREFIX_HOST : PREFIX_GUEST}${id}`;
    }

    // sanity check
    if (id.indexOf(PREFIX_HOST) !== -1 && id.indexOf(PREFIX_GUEST) !== -1) {
      // missile launcher missiles may include this because the ID is prefixed.
      // fix by dropping the first one.
      console.warn('bad ID, has both HOST and GUEST?', id);
      // id = id.split('_').slice(2).join('_');
      // debugger;
    }

    const defaults = {
      id,
      guid: (options.id || `obj_${guid++}_${data.type}`),
      fromNetworkEvent: options.fromNetworkEvent,
      isOnScreen: null,
      isEnemy: !!options.isEnemy,
      bottomY: options.bottomY || 0,
      dead: false,
      x: options.x || 0,
      y: options.y || 0,
      vX: options.vX || 0,
      vY: options.vY || 0,
      fireModulus: options.fireModulus,
      frontZone: null,
      rearZone: null
    };

    let key;

    // add, if undefined
    for (key in defaults) {
      if (data[key] === undefined) data[key] = defaults[key];
    }
  
    return data;
  
  },

  inheritCSS(options = {}) {

    defaultCSSKeys.forEach((key) => {
      if (options[key] === undefined) {
        options[key] = defaultCSS[key];
      }
    });
  
    return options;
  
  },

  mixin(oMain, oAdd) {

    // edge case: if nothing to add, return "as-is"
    // if otherwise unspecified, `oAdd` is the default options object
    if (oAdd === undefined) return oMain;

    // the modern way
    return Object.assign(oMain, oAdd);

  },

  friendlyNearbyHit(target, source, hitOptions) {

    // logic for missile launcher and tank overlap / spacing.

    const { stop, resume } = hitOptions;

    /**
     * TODO: data.halfWidth instead of 0, but be able to resume and separate vehicles when there are no enemies nearby.
     * For now: stop when we pull up immediately behind the next tank / vehicle, vs. being "nearby."
     * Safeguard: wait only a certain amount of time before ignoring a nearby / overlapping unit, and continuing.
     */

    /**
     * Special case: two tanks roll up to the same enemy, and start firing.
     * Without handling, the rear friendly tank would hang back to avoid overlap.
     * In the original game, they would perfectly overlap when stopping to fire at the same position.
     * Therefore: if both of us are tanks, and the target is firing and we are not, keep on truckin'.
     */
    if (source.data.type === TYPES.tank && target.data.type === TYPES.tank) {

      // ignore if we're firing at a target, because we should also be stopped.
      if (source.data.lastNearbyTarget) return;

      // otherwise - if the target is firing and we aren't yet, keep on truckin' so we can join in.
      if (target.data.lastNearbyTarget) {
        resume();
        return;
      }

    }

    // if we are not a tank, but the target is, always wait for tanks to pass in front.
    if (source.data.type !== TYPES.tank && target.data.type === TYPES.tank) {
      stop();
      return;
    }

    // If we are "ahead" of the overlapping unit, we may be at the front of a possible traffic pile-up - so, keep on truckin'.
    if ((!source.data.isEnemy && source.data.x > target.data.x) || (source.data.isEnemy && source.data.x < target.data.x)) {
      resume();
      return;
    }

    // if we have an absolute match with another vehicle (and the same type), take the lower ID.
    // this is intended to help prevent vehicles from getting "wedged" waiting for one another.
    if (source.data.x === target.data.x && target.data.type === source.data.type) {
      const sourceID = source.data.guid.split('_')[1];
      const targetID = target.data.guid.split('_')[1];
      if (sourceID < targetID) {
        resume();
        return;
      }
    }

    // at this point, just stop.
    stop();

  },

  hit(target, hitPoints = 1, attacker) {

    let newEnergy, energyChanged;

    /**
     * special case: super-bunkers can only be damaged by tank gunfire.
     * other things can hit super-bunkers, but we don't want damage done in this case.
     */

    // non-tank gunfire will ricochet off of super bunkers.
    if (target.data.type === TYPES.superBunker && !(attacker?.data?.parentType === TYPES.tank)) return;

    if (target.data.type === TYPES.tank) {
      // tanks shouldn't be damaged by shrapnel - but, let the shrapnel die.
      if (attacker?.data?.parentType === TYPES.shrapnel) {
        hitPoints = 0;
      }
    }

    newEnergy = Math.max(0, target.data.energy - hitPoints);

    energyChanged = target.data.energy !== newEnergy;

    target.data.energy = newEnergy;

    // special cases for updating state
    if (energyChanged && target.updateHealth) {
      target.updateHealth(attacker);
    }

    sprites.updateEnergy(target);

    if (!target.data.energy && target.die) {

      // mutate the object: assign its attacker.
      target.data.attacker = attacker;

      target.die({ attacker });

    }

  },

  onDie(target, dieOptions = {}) {

    /**
     * A generic catch-all for battlefield item `die()` events.
     * This was added specifically for the network game case,
     * but may be refactored in future as needed.
    */

    if (!net.active) return;

    // NOTE: attacker may not always be defined.

    const attacker = dieOptions.attacker || target?.data?.attacker;

    if (debugCollision) {
      if (attacker && attacker.data.type === TYPES.helicopter) makeDebugRect(attacker);
      if (target && target.data.type === TYPES.helicopter) makeDebugRect(target);
    }

    // ignore certain things - they're noisy or safer to leave locally, should be deterministic, and will generate additional traffic.
    if (excludeFromNetworkTypes[target.data.type]) return;

    // special case: ignore bombs that have died, *if* they have hit the ground.
    // this avoids having a bomb that's slightly behind on the remote, exploding in mid-air.
    // otherwise, it's good to have a bomb that hit (e.g.) a balloon also explode in the air and not appear to fall through.
    if (target.data.type === TYPES.bomb && target.data.hasHitGround) return;

    // if killed via network, don't send a die() back to the remote.
    if (target.data.killedViaNetwork) {
      target.data.killedViaNetwork = undefined;
      return;
    }

    const params = {
      attacker,
      x: target.data.x,
      y: target.data.y
    };

    // notify the remote: take something out.
    // by the time this lands, the remote object may have already died, been removed and be in the "boneyard" - that's fine.
    net.sendDelayedMessage({ type: 'GAME_EVENT', id: target.data.id, method: 'die', params });

  },

  // height offsets for certain common ground units
  // TODO: reference constants or similar
  ricochetBoundaries: {
    'tank': 18,
    'bunker': 25,
    'super-bunker': 28
  },

  lastInfantryRicochet: 0,

  getLandingPadOffsetX(helicopter) {
    const pads = game.objects[TYPES.landingPad];
    const landingPad = pads[helicopter.data.isEnemy ? pads.length - 1 : 0];
    return landingPad.data.x + (landingPad.data.width / 2) - helicopter.data.halfWidth;
  },

  bottomAlignedY(y) {

    // correct bottom-aligned Y value
    return 370 - 2 - (y || 0);
  
  },

  getDoorCoords(obj) {

    // for special collision check case with bunkers
  
    const door = {
      width: 5,
      height: obj.data.height, // HACK: should be ~9px, figure out why true height does not work.
      halfWidth: 2.5
    };
  
    return ({
      width: door.width,
      height: door.height,
      // slight offset on X, don't subtract door half-width
      x: parseInt(obj.data.x + obj.data.halfWidth + door.halfWidth + 2, 10),
      y: parseInt((obj.data.y + obj.data.height) - door.height, 10)
    });
  
  },

  initNearby(nearby, exports) {

    // map options.source -> exports
    nearby.options.source = exports;
  
  },

  tweakEmojiSpacing(text) {

    // https://www.freecodecamp.org/news/how-to-use-regex-to-match-emoji-including-discord-emotes/
    // replace emoji + space character with emoji + half-width space, splitting the emoji from the match and including a partial space character: ` `
    return text?.replace(/<a?:.+?:\d{18}>|\p{Extended_Pictographic}\s/gu, (match/*, offset, string*/) => `${match.substr(0, match.length - 1)} `);

  },

  preloadVideo(fileName) {

    if (loadedVideos[fileName]) return;

    let video = document.createElement('video');
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const canplay = 'canplaythrough';

    function preloadOK() {
      if (!video) return;
      loadedVideos[fileName] = true;
      video.removeEventListener(canplay, preloadOK);
      video.remove();
      video = null;
    }

    video.innerHTML = [
      `<source src="image/bnb/${fileName}.webm" type="video/webm" />`,
      `<source src="image/bnb/${fileName}.mp4" type="video/mp4" />`
    ].join('');

    video.addEventListener(canplay, preloadOK);

    video.play();

    window.setTimeout(preloadOK, 5000);

  },

  setVideo(fileName = '', playbackRate, offsetMsec = 0, muted = true) {

    const o = document.getElementById('tv');

    const disabled = (!gamePrefs.bnb || !gamePrefs.bnb_tv);

    videoActive = !!fileName;

    if (disabled) {
      if (!o) return;
      // ensure node is cleared / removed, if active
      fileName = '';
    }

    const container = document.getElementById('tv-display');

    const timeOffset = parseFloat(offsetMsec / 1000, 2);

    const startTime = timeOffset ? `#t=${timeOffset}` : '';

    wzTimer?.reset();

    if (!fileName || o) {
      // empty / reset
      if (o) o.innerHTML = '';
      utils.css.remove(container, 'active');
      let fs = document.getElementById('fs');
      if (fs) {
        fs.style.transitionDuration = '0.5s';
        fs.style.opacity = 0;
        wzTimer = common.setFrameTimeout(() => {
          wzTimer = null;
          fs.remove();
        }, 550);
      }
      if (!fileName) return;
    }

    // certain content is widescreen
    utils.css.addOrRemove(container, fileName.match(/camper|desert|wz/i), 'widescreen');

    const hasAudio = (fileName.match(/wz/i));
    const isWZ = fileName.match(/wz/i);

    const sources = [
      `<source src="image/bnb/${fileName}.webm${startTime}" type="video/webm" />`,
      `<source src="image/bnb/${fileName}.mp4${startTime}" type="video/mp4" />`,
    ];

    // MP4 first, due to historical bias...
    if (isSafari) sources.reverse();

    o.innerHTML = [
     `<video id="tv-video"${muted ? ' muted' : ''}${!hasAudio ? ' autoplay' : ''} playsinline>`,
      ...sources,
     '</video>',
    ].join('');

    // special-case: 'WZ' "music video."
    let fs;
    let videos;

    function onReadyStart() {
      if (!videoActive) return;
      videos.forEach((video) => video.play());
      if (isWZ) {
        common.setFrameTimeout(() => {
          if (!fs || !videoActive) return;
          fs.style.opacity = 0.5;
          common.setFrameTimeout(() => {
            if (!fs || !videoActive) return;
            fs.style.transitionDuration = '1s';
            fs.style.opacity = 1;
          }, 12000);
        }, 17000);
      } else {
        fs.style.transitionDuration = '0.25s';
        fs.style.opacity = 1;
      }
    }

    function touchStartVideo() {
      document.removeEventListener('touchstart', touchStartVideo);
      onReadyStart();
    }

    function ready() {
      if (isMobile && !videos[0].muted) {
        // video with sound needs user action to work.
        document.addEventListener('touchstart', touchStartVideo);
      } else {
        onReadyStart();
      }
    }

    const useFS = fileName.match(/wz|desert/i);

    if (useFS) {
      fs = document.createElement('div');
      fs.id = 'fs';
      Object.assign(fs.style, {
        position: 'absolute',
        top: '34px',
        left: '0px',
        height: `100%`,
        width: '100%',
        overflow: 'hidden',
        'z-index': -1,
        opacity: 0,
        transition: 'opacity 5s'
      });

      fs.innerHTML = [
       `<video id="tv-video-larger" muted playsinline style="position:absolute;bottom:0px;left:50%;width:auto;height:100%;transform:translate(-50%,0px)">`,
       ...sources,
       '</video>'
      ].join('');

      const bf = document.getElementById('battlefield');
      bf.insertBefore(fs, bf.childNodes[0]);

      videos = [ document.getElementById('tv-video'), document.getElementById('tv-video-larger') ];

      if (!loadedVideos[fileName]) {

        // videos.forEach((video) => video.addEventListener('canplaythrough', ready));
        videos[0].addEventListener('canplaythrough', () => {
          loadedVideos[fileName] = true;
          ready();
        });

      } else {

        ready();
        
      }

    }

    utils.css.add(container, 'active');

    const video = o.childNodes[0];

    if (playbackRate) {
      video.playbackRate = playbackRate;
    }

    video.onended = () => common.setVideo('');

  },

  basicEscape(str) {
    return str?.replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // convenience
    .replace('\n', '<br>');
  },

  addGravestone(exports) {

    const dType = exports.data.type;

    const isInfantry = gamePrefs.gravestones_infantry && (dType === TYPES.infantry || dType === TYPES.parachuteInfantry);
    const isHelicopter = gamePrefs.gravestones_helicopters && dType === TYPES.helicopter;
    const isVehicle = gamePrefs.gravestones_vehicles && dType.match(/tank|van|launcher/i);

    if (!isInfantry && !isHelicopter && !isVehicle) return;

    const typeCSS = isInfantry ? 'gs_infantry' : (isHelicopter ? 'gs_helicopter' : 'gs_vehicle');

    function r() {
      return [ { data: { x: exports.data.x + rngPlusMinus(12, TYPES.terrainItem), halfWidth: exports.data.halfWidth } }, pickFrom(smallDecor), typeCSS ];
    }

    // for non-infantry types, add a few extra before the gravestone pops up.
    if (exports.data.type !== TYPES.infantry && rng(1, TYPES.terrainItem) >= 0.5) {
      gravestoneQueue.push(r());
    }

    // now add the thing we came here for.
    gravestoneQueue.push([exports, typeCSS]);

    queueGravestoneWork();

  }

};

export { common };