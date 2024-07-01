import { prefsManager } from '../aa.js';
import { gamePrefs } from '../UI/preferences.js';
import { common } from './common.js';
import { game } from './Game.js';
import { defaultSeed, defaultSeeds, FPS, FRAMERATE, setDefaultSeed, TYPES } from './global.js';
import { playSound, sounds } from './sound.js';

const FRAME_LENGTH = FRAMERATE;

const OLD_FRAME_CUTOFF = FPS;

const searchParams = new URLSearchParams(window.location.search);

const debugNetwork = searchParams.get('debugNetwork');

const debugPingPong = searchParams.get('debugPingPong');

const debugNetworkStats = searchParams.get('debugNetworkStats');

const getIdFromURL = () => searchParams.get('id');

// object properties that point to live objects, e.g., a helicopter.
const OBJ_REFERENCES = ['target', 'attacker', 'parent'];

const SYNC_FFWD_TYPES = {
  [TYPES.gunfire]: true,
  [TYPES.smartMissile]: true,
  [TYPES.bomb]: true
};

// were we given an ID from a friend to connect to?
const remoteID = getIdFromURL();

// Cooperative option. TODO: support 3+ players, two human and 1-2 CPUs.
const coop = searchParams.get('coop');

// PeerJS option: ordered, guaranteed delivery ("file transfer") vs. not ("gaming")
let reliable = !searchParams.get('unreliable');

let peer;
let peerConnection;

const avg = (a) => a.reduce((x,y) => x + y) / a.length;

let pingStack = [];

// averaging period for ping / lead times
const stackSize = 5;

// last received packet
let timePair = {
  t1: null,
  t2: null
};

let statsByType = {};

function updateStatsByType(type, direction) {
  
  // e.g., type = 'PING', direction = 'tx'

  if (!statsByType[type]) {
    statsByType[type] = {
      tx: 0,
      rx: 0
    }
  }

  statsByType[type][direction]++;

}

function startDebugNetworkStats() {

  if (!debugNetworkStats) return;

  window.setInterval(() => {
    if (net.connected) {
      console.log(statsByType);
      console.log(`rxQueue.length: ${rxQueue.length}`);
    }
  }, 10000);
  
}

// filter certain message types, so lights blink mostly with user actions vs. all the time
const blinkingLightsExempt = {
  RAW_COORDS: true,
  PING: true,
  PONG: true
};

// for "blinking LED" lights
let oLights;
let oLightsSubSprite;

let incomingOffset = 0;
let outgoingOffset = 0;

let lastLEDOffset;

// certain messages bypass the queue, and are processed immediately
const processImmediateTypes = {
  SYN: true,
  SYNACK: true,
  ACK: true
};

const connectionText = `Connecting, “${reliable ? 'reliable' : 'fast'}” delivery...`;

const showLocalMessage = (html) => console.log(html);

function sendDelayedMessage(obj, callback) {

  /**
   * Send in "time to get there" (half-trip = half-pingtime), plus a few frames.
   * This should help keep objects consistent on both sides, i.e., a balloon dies,
   * but has time to kill the helicopter that ran into it before dying itself.
   */

  // current difference in frame count implies lag, in FRAME_LENGTH msec per frame
  const delta = Math.max(1, game.objects.gameLoop.data.frameCount - game.objects.gameLoop.data.remoteFrameCount);

  /**
   * If playing on LAN / via wifi etc., half-trip might be a few miliseconds.
   * We want to ensure this message arrives "late", to avoid killing something early.
   */
  const MIN_FRAME_DELAY = 3 * FRAME_LENGTH;

  // Take the greater of half-trip vs. computed delta in frames between clients, vs. MIN_FRAME_DELAY.
  const delay = Math.max(MIN_FRAME_DELAY, Math.max((delta + 1) * FRAME_LENGTH, net.halfTrip));

  if (debugNetwork) console.log(`💌 sendDelayedMessage(): sending in ${delay.toFixed(2)} msec. Network Δ = ${delta}, ${(delta * FRAME_LENGTH).toFixed(2)} msec`, obj);

  common.setFrameTimeout(() => sendMessage(obj, callback), delay);

}

function serializeObjectReferences(obj = {}) {

  // replace attacker / target / parent objects with their IDs,
  // so they can be looked up and reconnected on the remote.
  // e.g., obj.target = obj.target.data.id;

  OBJ_REFERENCES.forEach((item) => {
    if (typeof obj[item] === 'object') {
      obj[item] = obj[item]?.data?.id;
    }
  });

  return obj;

}

function unSerializeObjectReferences(obj = {}) {

  // string ID-to-object logic.

  OBJ_REFERENCES.forEach((item) => {
    if (typeof obj[item] === 'string') {
      obj[item] = game.findObjectById(obj[item], `network lookup: no live ${item}?`, obj[item]); 
    }
  });

  return obj;

}

function sendMessage(obj, callback, delay) {

  if (debugNetwork) console.log('💌 sendMessage', game.objects.gameLoop.data.frameCount);

  if (!net.connected && debugNetwork) {
    console.warn('net.sendMessage(): network not connected.', obj);
    return;
  }

  const goLd = game.objects.gameLoop.data;
  if (game.players.local && goLd.remoteFrameCount - goLd.frameCount > OLD_FRAME_CUTOFF) {
    // skip "old" outgoing messages. in the fast-forward case, this saves unnecessary traffic and possible side-effects.
    if (debugNetwork) console.info(`💌 sendMessage: Dropping, too far behind remote. ${goLd.frameCount}/${goLd.remoteFrameCount}, Δ ${goLd.remoteFrameCount - goLd.frameCount} > ${OLD_FRAME_CUTOFF}`);
    return;
  }

  // replace any attacker / target / parent references with their IDs.
  if (obj.params) {
    obj.params = serializeObjectReferences(obj.params);
  }

  // decorate with timing information
  // hat tip: https://github.com/mitxela/webrtc-pong/blob/master/pong.htm
  peerConnection?.send({
    ...obj,
    frameCount: game.objects.gameLoop.data.frameCount,
    t1: timePair.t1,
    t2: timePair.t2,
    tSend: performance.now()
  });

  // net.sentPacketCount++;

  /**
   * Only certain messages cause "modem lights" to blink,
   * unless lock-step is active and we're waiting for the remote.
   * 
   * In that case, showing ping/pong is handy.
   */

  if (!blinkingLightsExempt[obj.type] || game.objects.gameLoop.data.waiting) net.outgoingLEDCount++;

  updateStatsByType(obj.type, 'tx');

  if (debugNetwork) {
    if (obj.type === 'GAME_EVENT') {
      if (!window.gameEventsTx) {
        window.gameEventsTx = [];
      }
      window.gameEventsTx.push(obj);
    } else if (obj.type === 'ADD_OBJECT') {
      if (!window.addObjectsTx) {
        window.addObjectsTx = [];
      }
      window.addObjectsTx.push(obj);
    }
  }

  if (!callback) return;

  // execute this locally after a (default) half-ping-time delay.

  setTimeout(callback, delay);

}

function pingTest() {

  sendMessage({ type: 'SYN', seed: defaultSeed, seeds: defaultSeeds });

}

const messageActions = {

  'RAW_COORDS': (data) => {

    // mouse and viewport coordinates, "by id."

    let helicopter = game.objectsById[data.id];

    if (!data?.id || !helicopter) {
      console.warn(`RAW_COORDS: No helicopter by ID ${data.id}?`);
      return;
    }

    if (!helicopter.data.isRemote) {
      console.warn('RAW_COORDS: WTF, incoming data for local helicopter? Bad logic / ID mis-match??', helicopter.data.id, data);
      return;
    }

    // if dead, just ignore these values.
    // this may be what gets us into trouble with false collisions after a die().
    if (helicopter.data.dead) return;

    if (helicopter.data.isCPU) {

      // *** CPU PLAYER ***
      // HACKS: subtract vX/vY before `animate()`, because that will be re-applied when animated locally.
      // I suspect this is the source of an annoying off-by-one-frame collision issue.
      if (data.x !== null) helicopter.data.x = data.x - data.vX;
      if (data.y !== null) helicopter.data.y = data.y - data.vY;

      helicopter.data.vX = data.vX;
      helicopter.data.vY = data.vY;

    } else {

      // *** HUMAN PLAYER ***
      helicopter.data.mouse.x = (data.x || 0);
      helicopter.data.mouse.y = (data.y || 0);

      // view
      helicopter.data.scrollLeft = data.scrollLeft;
      helicopter.data.scrollLeftVX = data.scrollLeftVX;
      
    }

    if (debugNetwork) {
      console.log('RX: RAW_MOUSE_COORDS + view -> helicopter.data', data);
    }

  },

  'CHAT': (data) => {

    /**
     * data = {
     *   params: [text, player_name], OR
     *   text: 'hello'
     * }
     */

    const slashCommand = common.parseSlashCommand(data.params?.[0] || data.text);

    // A form of notification, really.
    if (game.data.started && data.text && !slashCommand) {

      game.objects.notifications.add(`<b>${gamePrefs.net_remote_player_name}</b>: ${common.basicEscape(data.text)} 💬`);

    } else {

      // for this variant, we expect a spreadable array.
      // also of note, slash commands are sent along for others to see and learn.
      const args = data.params || [ data.text ];

      // don't show raw text, if there was a slash command.
      if (!slashCommand) {
        prefsManager.onChat(...args);
      }

    }

    // now, run if found.
    slashCommand?.();

  },

  'REMOTE_READY': (data) => {

    // signal: ready to start playing.
    prefsManager.onRemoteReady(data.params);

  },

  'REMOTE_PLAYER_NAME': (data) => {

    // ignore if already up-to-date, etc.
    if (!data.newName) return;
    if (gamePrefs.net_remote_player_name === data.newName) return;

    const msg = common.getRenameString(gamePrefs.net_remote_player_name, data.newName);

    // this can happen during a live game
    if (game.data.started) {
      game.objects.notifications.add(msg);
    } else {
      prefsManager.onChat(msg);
    }

    // update the underlying pref
    gamePrefs.net_remote_player_name = data.newName;
    
  },

  'UPDATE_PREFS': (data) => {

    // data.params = [{ name, value }, { name, value }] etc.
    prefsManager.onUpdatePrefs(data.params);

  },

  'REMOTE_ORDER': (data) => {

    // net.sendMessage({ type: 'REMOTE_ORDER', orderType: type, options, id: player.data.id });
    if (debugNetwork) console.log('RX: REMOTE_ORDER', data);

    if (debugNetwork && !game.objectsById[data.id]) {
      console.warn('REMOTE_ORDER: WTF, no objectsById for data.id (remote friendly helicopter, co-op?', data.id);
    }

    // assume remote is a friendly player, at this point...
    game.objects.inventory.order(data.orderType, data.options, game.objectsById[data.id]);

  },

  'NOTIFICATION': (data) => {

    // TODO: move this into inventory

    if (debugNetwork) console.log('RX: NOTIFICATION', data);

    let msg = `${data.html}`;

    if (data.notificationType === 'remoteOrder') {
      // PeerJS seems to mangle emoji sent over the wire.
      msg = `📦 ${msg} 🛠️`;
    }

    // indicating this is a remote thing
    msg += ' 📡';

    game.objects.notifications.add(msg);

    // and make a noise
    if (sounds.inventory.begin) {
      playSound(sounds.inventory.begin);
    }

  },

  'ADD_OBJECT': (data) => {

    // e.g.
    /*
    net.sendMessage({
      type: 'ADD_OBJECT',
      objectType: bomb.type,
      params: {
        ...bombArgs,
        // redefine `parent` as an ID for lookup on the other side
        parent: exports.data.id // local player here -> remote player there
      }
    });
    */

    if (debugNetwork) {
      console.log('RX: ADD_OBJECT', data);
      if (!window.addObjectsRx) window.addObjectsRx = [];
      window.addObjectsRx.push(data);
    }

    // These should be objects created by the "remote" player / helicopter.
    // TODO: review and see if this is necessary now that we have input delay.
    let syncAndFastForward;

    // HACK: even with dalyed input for gunfire, smart missiles and bombs, let's try this.
    // SPECIAL HANDLING: if the parent is a remote helicopter, try fast-forwarding by the delta of frames.
    if (data.params?.parent?.data?.type === TYPES.helicopter) {
      syncAndFastForward = !!(SYNC_FFWD_TYPES[data.objectType]);
    }

    // flag as "from the network", to help avoid confusion.
    const newObject = game.addObject(data.objectType, {
      ...data.params,
      fromNetworkEvent: true
    });

    if (syncAndFastForward) {
      // this thing has been re-synced to the helicopter position, after delivery.
      // console.log('fast-forwarding new object');
      // we know precisely how many frames behind (or ahead) the remote is, because we have their frame count here vs. ours.
      // notwithstanding, try to round down to nearest 1-frame delay.
      const frameLagBetweenPeers = Math.max(0, Math.min(game.objects.gameLoop.data.frameCount - data.frameCount, Math.floor(net.halfTrip / FRAMERATE)));
      console.log('fast-forward object, lag between peers - based on packet.frameCount:', game.objects.gameLoop.data.frameCount - data.frameCount, 'vs. halfTrip / FRAMERATE:', (net.halfTrip / FRAMERATE), 'result:', frameLagBetweenPeers);
      for (let i = 0; i < frameLagBetweenPeers; i++) {
        newObject.animate();
      }
    }

  },

  'MAKE_DEBUG_RECT': (data) => {
    // net.sendMessage({ type: 'MAKE_DEBUG_RECT', params: [ basicData, viaNetwork ] });
    common.makeDebugRect(...data.params);
  },

  'GAME_EVENT': (data) => {

    /**
     * data = { id, method, params = {} }
     * An RPC of sorts. Can take a params object to be passed, or an array to be spread as arguments.
     * net.sendMessage({ type: 'GAME_EVENT', id: target.data.id, method: 'die', params: { attacker: attacker.data.id }});
     * net.sendMessage({ type: 'GAME_EVENT', id: data.id, method: 'setMissileLaunching', params: [ true, 'rubber-chicken-mode' ] });
     */

    const obj = game.findObjectById(data.id, 'GAME_EVENT: data.id');

    if (!obj) return;

    if (!obj[data.method]) {
      console.warn(`GAME_EVENT: WTF no method ${data.method} on data.id ${data.id}?`, data.method);
      return;
    }

    if (data.params === undefined) {

      // no arguments
      obj[data.method]();

    } else {

      // params = {} or []
    
      // special case handling - TODO: move this somewhere outside.
      if (data.method === 'die') {

        const attacker = data.params.attacker;

        // it's possible something could have just died, and the next animation frame hasn't fired yet -
        // so the local object hasn't been unlinked and moved to the boneyard. this is fine, just ignore
        // and don't mark as being killed "via network."
        if (obj.data.dead) {
          if (debugNetwork) console.log('RX: GAME_EVENT, DIE: already dead, but not yet in boneyard');
          return;
        }

        // mutate: indicate that this thing was killed "via network", to avoid redundant remote messages.
        // this will be reset in `common.onDie()` when it fires after this method.
        obj.data.killedViaNetwork = true;

        if (attacker) {

          // HACKISH: if die(), do what common does and mutate the target.
          obj.data.attacker = attacker;

        }

      }

      if (data.params?.length) {
        // spread array
        obj[data.method](...data.params);  
      } else {
        // pass directly
        obj[data.method](data.params);
      }
     
    }

  },

  'SYN': (data) => {

    if (data.seed !== undefined) {
      if (debugNetwork) console.log('network SYN: received seed', data);
      setDefaultSeed(data.seed, data.seeds);
    }

    sendMessage({ type: 'SYNACK' });

    if (pingStack.length && pingStack.length <= stackSize) {
      showLocalMessage(`${connectionText}<br />Ping ${pingStack.length}/${stackSize}: ${avg(pingStack).toFixed(1)}ms`);
    }

  },

  'SYNACK': (/*data*/) => {

    if (pingStack.length < stackSize) {

      showLocalMessage(`Ping ${pingStack.length}/${stackSize}: ${avg(pingStack).toFixed(1)}ms`);

      // do more SYN -> ACK until we fill the stack
      sendMessage({ type: 'SYN' });

      return;

    }

    // "The first is usually unrepresentative, throw away"
    pingStack.shift();

    let halfTrip = avg(pingStack) / 2;

    console.log(`half-roundtrip, time to reach remote: ${halfTrip}ms`);

    prefsManager.onChat(`Ping: ${avg(pingStack).toFixed(1)}ms`);

    sendMessage({ type: 'ACK' });

    // wait for half the roundtrip time before starting the first frame
    setTimeout(() => { net.startGame?.() }, halfTrip);

  },

  'ACK': (/*data*/) => {

    prefsManager.onChat(`Ping: ${avg(pingStack).toFixed(1)}ms`);

    net.startGame?.();

  },

  'PING': (data) => {
    if (debugPingPong) console.log('RX: PING', data);
    net.sendMessage({ type: 'PONG' });
  },

  'PONG': (data) => {
    if (debugPingPong) console.log('RX: PONG', data);
  },


};

function processData(data) {

  // somebody loves us; we have a message. 💌

  if (debugNetwork) console.log('💌 RX: processData', data);

  net.newPacketCount++;

  /**
   * Firstly, look at the frame count - and ignore or discard if considered too old.
   * Let's consider two seconds behind, too old.
   */

  if (game.data.started && game.objects.gameLoop.data.frameCount - data.frameCount > OLD_FRAME_CUTOFF) {
    // drop "old" incoming messages, which may be received in error - or from a remote client fast-forwarding.
    // guards are in place on the transmitting side, as well.
    if (debugNetwork) console.info(`💌 RX: Dropping message, too old. ${data.frameCount}/${game.objects.gameLoop.data.frameCount}, Δ ${game.objects.gameLoop.data.frameCount - data.frameCount} > ${OLD_FRAME_CUTOFF}`);
    return;
  }

  // firstly, process roundtrip / half-trip, ping time data.
  let ping, recTime = performance.now();

  // update with the latest
  timePair.t1 = data.tSend;
  timePair.t2 = recTime;

  if (data.t1) {

    // calculate roundtrip /\/\/ -> half-trip, time to reach remote - delay / latency.
    let t1 = data.t1,
       t2 = data.t2,
       t3 = data.tSend,
       t4 = recTime;

    ping = t4 - t1 - (t3 - t2);

    pingStack.push(ping);

    if (pingStack.length > stackSize) {
      pingStack.shift();
    }

    net.halfTrip = avg(pingStack) / 2;

  }

  if (!data?.type) {
    console.warn('💌 net::processData(): WTF no message type?', data);
    return;
  }

  updateStatsByType(data.type, 'rx');

  // hack: these don't count toward "blinking lights."
  if (!blinkingLightsExempt[data.type]) {
    net.incomingLEDCount++;
  }

  // special case: run things like ping test and ping/pong immediately, no queueing.
  // likewise, for chat messages etc. prior to the game starting.
  if (!game.data.started || processImmediateTypes[data.type]) {
    processMessage(data);
    return;
  }

  // messages will be processed within the game loop.
  rxQueue.push(data);

}

function processMessage(data) {

  if (!data?.type) {
    console.warn('💌 net::processMessage(): WTF no data or type?', data);
    return;
  }

  // re-connect any target/attacker/parent references
  if (data.params) {
    data.params = unSerializeObjectReferences(data.params);
  }

  if (messageActions[data.type]) {
    messageActions[data.type](data);
  } else {
    console.warn('💌 net::processMessage(): unknown message type?', data.type);
  }

}

function processRXQueue(localFrameCount = game.objects.gameLoop.data.frameCount) {

  /**
   * Given a frame count, find and process all network messages received up to that frame count.
   * 
   * The remote frame count is the latest-received / newest message in the queue.
   * We'll use this to "fast-forward" and catch up to the remote, if our window was in the background etc.
   * TODO: break this number out into per-client-ID objects, if and when multiplayer is implemented.
   */

  if (rxQueue.length) {
    game.objects.gameLoop.data.remoteFrameCount = rxQueue[rxQueue.length - 1].frameCount;
  }

  let remaining = [];

  // Accommodate for a number of frames' difference.
  const frameLagBetweenPeers = Math.ceil(net.halfTrip / FRAME_LENGTH);

  for (var i = 0, j = rxQueue.length; i < j; i++) {
    if (localFrameCount >= rxQueue[i].frameCount - frameLagBetweenPeers) {
      processMessage(rxQueue[i]);
    } else {
      remaining.push(rxQueue[i]);
    }
  }

  rxQueue = remaining;

}

function updateUI() {

  /**
   * LED lights, shamelessly stolen from Windows 9x/XP's `lights.exe`,
   * which showed modem lights in the taskbar.
   * 
   * Tangengially-related YouTube throwbacks to HyperTerminal and dial-up:
   * https://www.youtube.com/shorts/ObpkS96EksM
   * https://www.youtube.com/shorts/W4XM5-HFzhY
   */

  // tick-style values for packets, so they stay lit for a few frames.
  if (net.outgoingLEDCount) {
    outgoingOffset += (net.outgoingLEDCount * 3);
    net.outgoingLEDCount = 0;
  }

  if (net.incomingLEDCount) {
    incomingOffset += (net.incomingLEDCount * 3);
    net.incomingLEDCount = 0;
  }

  let offset = 0;

  // which lights go green?
  if (outgoingOffset) {
    offset = (incomingOffset ? 3 : 1);
  } else if (incomingOffset) {
    offset = 2;
  }

  // reverse pattern, making lights blink after the first frame.
  if ((outgoingOffset && outgoingOffset % 3 !== 0) || (incomingOffset && incomingOffset % 3 !== 0)) {
    offset = 3 - offset;
  }

  if (incomingOffset) incomingOffset--;
  if (outgoingOffset) outgoingOffset--;

  if (offset !== lastLEDOffset) {
    lastLEDOffset = offset;
    oLightsSubSprite.style.setProperty('transform', `translate(${-16 * offset}px, 0px`);
  }

}

// received messages, queued and processed per-frame
let rxQueue = [];

const net = {

  coop,

  debugNetwork,
  connected: false,
  halfTrip: 0,

  // referenced by game loop for lock-step
  newPacketCount: 0,

  // all others - for blinking lights
  incomingLEDCount: 0,
  outgoingLEDCount: 0,

  active: false,
  isHost: !remoteID,
  isGuest: !!remoteID,

  processRXQueue,
  updateUI,
  sendDelayedMessage,
  sendMessage,

  init: (onInitCallback, startGameCallback) => {

    if (!window.Peer) {

      // go get it, then call this method again.
      if (debugNetwork) console.log('Loading PeerJS...');

      var script = document.createElement('script');

      script.onload = () => net.init(onInitCallback, startGameCallback);

      // TODO: show in the UI.
      script.onerror = (e) => {
        console.log('Error loading PeerJS', e);
        prefsManager.onNetworkError(`Error loading PeerJS script "${src}": ${e.message}`);
      }

      const src = 'script/lib/peerjs@1.4.7.js'
      script.src = src;

      document.head.appendChild(script);

      return;

    }

    oLights = document.getElementById('lights');
    oLightsSubSprite = oLights.childNodes[0];

    document.getElementById('network-status').style.display = 'inline-block';

    console.log(`Using ${reliable ? 'reliable' : 'fast'} delivery`);

    // PeerJS options
    const debugConfig = {
      // debug: 3
    };
    
    peer = new window.Peer(null, debugConfig);

    if (debugNetwork) console.log('net.init()', peer);

    // hackish: here's what will be called when the ping test is complete.
    net.startGame = () => startGameCallback?.();

    peer.on('open', (id) => {
      
      // show a link to send to a friend
      if (debugNetwork) console.log('got ID', id);

      if (!remoteID) {

        // provide the ID to the host for display; otherwise, ignore.
        onInitCallback?.(id);

      } else {

        // you are the guest, connecting to the host.
        if (debugNetwork) console.log('Connecting...');

        net.connect(remoteID, onInitCallback);

      }

    });

    peer.on('connection', (conn) => {

      // "SERVER" (host) - incoming connection

      peerConnection = conn;

      net.active = true;

      // Client has connected to us
      if (debugNetwork) console.log('HOST: Connection received from remote client', conn);

      conn.on('open', () => {

        if (debugNetwork) console.log('HOST: connection opened');

        net.connected = true;

        prefsManager.onConnect();

        conn.on('data', (data) => processData(data));

        if (debugNetwork) console.log('starting ping test');

        pingTest();

        startDebugNetworkStats();

      });

      conn.on('close', () => {

        const msg = '💥 Network connection has closed. ❌👻';

        game.objects.notifications.addNoRepeat(msg);

        net.connected = false;

        net.reset();

        prefsManager.onDisconnect();

        showLocalMessage(msg);
      
        // only kill the game if it has started; guest may have reloaded
        // during network set-up, and that is recoverable.

        if (game.data.started) {

          game.objects.notifications.add(msg);
  
          common.setFrameTimeout(game.objects.gameLoop.stop, 1000);

        }
  
      });

    });

  },

  connect: (peerID, callback) => {

    // CLIENT / GUEST: connecting to host / server
  
    if (!peerID) {
      console.warn('connect: need peerID');
      return;
    }
  
    // "reliable" or "fast" delivery options - PeerJS makes fast the default.
    const options = {
      reliable
    };
  
    showLocalMessage(connectionText);
  
    const connection = peer.connect(peerID, options);
 
    connection.on('data', (data) => processData(data));

    connection.on('open', () => {
  
      if (debugNetwork) console.log('GUEST: connection opened');
      
      net.connected = true;
  
      peerConnection = connection;

      net.active = true;

      prefsManager.onConnect();

      startDebugNetworkStats();

      callback?.();
    
    });
  
    connection.on('close', () => {
  
      if (debugNetwork) console.log('connection close!');
  
      const msg = '💥 Network connection has closed. ❌👻';
  
      net.connected = false;
 
      net.reset();

      prefsManager.onDisconnect();

      showLocalMessage(msg);
      
      game.objects.notifications.addNoRepeat(msg);

      common.setFrameTimeout(game.objects.gameLoop.stop, 1000);

    });
  
  },

  remoteID,

  reset: () => {

    timePair.t1 = null;
    timePair.t2 = null;
    pingStack = [];
    statsByType = {};
    
  }

};

export { net };