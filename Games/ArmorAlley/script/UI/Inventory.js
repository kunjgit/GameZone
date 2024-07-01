import { game, gameType } from '../core/Game.js';
import { utils } from '../core/utils.js';
import { parseTypes, PRETTY_TYPES, TYPES, worldWidth } from '../core/global.js';
import { playSound, playSoundWithDelay, sounds } from '../core/sound.js';
import { common } from '../core/common.js';
import { collisionCheck, isGameOver } from '../core/logic.js';
import { sprites } from '../core/sprites.js';
import { net } from '../core/network.js';

const Inventory = () => {

  let css, data, dom, objects, orderNotificationOptions, exports;

  const STD_LOOK_AHEAD = 8;

  function setWaiting(isWaiting) {

    data.waiting = isWaiting;
    data.waitingFrames = 0;
    
  }

  function processNextOrder() {

    // called each time an item is queued for building,
    // and each time an item finishes building (to see if there's more in the queue.)

    if (!data.building && data.queue.length) {

      // start building!
      data.building = true;

    }

    if (data.queue.length || data.waiting) {

      // first or subsequent queue items being built.

      // reset frame / build counter
      data.frameCount = 0;

      // take the first item out of the queue for building.
      if (!objects.order) {
        // don't wait for the the first
        objects.order = data.queue.shift();
      } else if (!data.waiting) {
        objects.order = data.queue.shift();
        // wait if there are more in the queue
        setWaiting(true);
      }

      if (data.waiting && objects.lastObject) {

        // is there physical room for the next one?
        const nextOrder = objects.order;

        /**
         * Nearby check: if the new order would overlap, don't add it just yet -
         * and make sure the last object is still alive. :X
         * 
         * Prior to the dead check, this was one cause of ordering getting stuck.
         * `waitingFramesMax` is a release valve, in case something goes south.
         */
        if (!objects.lastObject.data.dead && collisionCheck(nextOrder.data, objects.lastObject.data, STD_LOOK_AHEAD) && data.waitingFrames++ < data.waitingFramesMax) {
          return;
        } else {
          setWaiting(false);
        }
  
      }

    } else if (data.building && !data.queue.length) {

      utils.css.remove(dom.gameStatusBar, css.building);

      data.building = false;

      // CPU vs non-CPU
      if (!objects.order.options.isCPU) {

        if (sounds.inventory.end) {
          playSound(sounds.inventory.end);
        }

        // clear the queue that just finished.
        game.players.local.updateInventoryQueue();

        // clear the copy of the queue used for notifications.
        data.queueCopy = [];

        game.objects.notifications.add('Order complete 🛠️');
        
      }

    }

  }

  function isOrderingTV(queue = data.queueCopy) {

    if (queue?.length !== 2) return;

    return (queue[0].data.type === TYPES.tank && queue[1].data.type === TYPES.van);

  }

  function order(type, options = {}, player) {

    // this should be called only by the human player, not the CPU

    let orderObject, orderSize, cost, pendingNotification;

    if (isGameOver()) return;

    orderSize = 1;

    // default off-screen setting
    options.x = -72;

    if (player.data.isCPU) {
      options.isCPU = true;
    }

    // TODO: review CPU check - may not be needed.
    if (player.data.isEnemy && !player.data.isCPU) {
      options.isEnemy = true;
      options.x = worldWidth + 64;
    }

    // let's build something - provided you're good for the $$$, that is.

    // infantry or engineer? handle those specially.

    if (type === TYPES.infantry) {

      orderSize = 5;

    } else if (type === TYPES.engineer) {

      orderSize = 2;

    }

    // Hack: make a temporary object, so we can get the relevant data for the actual order.
    orderObject = game.addObject(type, {
      ...options,
      noInit: true
    });

    // do we have enough funds for this?
    cost = orderObject.data.inventory.cost;

    let remote;

    // network co-op case: if the remote player is on the same team and ordering, add to the local queue.
    if (net.active && !player.data.isLocal && player.data.isEnemy === game.players.local.data.isEnemy) {
      remote = true;
      // This has been "paid for" by the remote player.
      // Thusly, make the local cost here zero until we have a joint banking feature. :D
      cost = 0;
    }

    const bunkerOffset = player.data.isEnemy ? 1 : 0;

    if (game.objects[TYPES.endBunker][bunkerOffset].data.funds >= cost) {

      game.objects[TYPES.endBunker][bunkerOffset].data.funds -= cost;

      game.objects.view.updateFundsUI();

      // hackish: this will be executed below.
      pendingNotification = () => {
        game.objects.notifications.add(`📦 %s ${isOrderingTV() ? '📺' : '🛠️'}${remote ? ' 📡' : ''}`, orderNotificationOptions);
      }

      // player may now be able to order things.
      game.players.local.updateStatusUI({ funds: true });

    } else {

      // Insufficient funds. "We require more vespene gas."
      if (sounds.inventory.denied) {
        playSound(sounds.inventory.denied);
      }

      game.objects.notifications.add('%s1%s2: %c1/%c2 💰 🤏 🤷', {
        type: 'NSF',
        onRender(input) {
          // hack: special-case missile launcher
          const text = type.replace('missileLauncher', 'missile launcher');
          // long vs. short-hand copy, flag set once NSF is hit and the order completes
          const result = input.replace('%s1', data.canShowNSF ? '' : 'Insufficient funds: ')
            .replace('%s2', (data.canShowNSF ? '🚫 ' : '') + text.charAt(0).toUpperCase() + (data.canShowNSF ? '' : text.slice(1)))
            .replace('%c1', game.objects[TYPES.endBunker][0].data.funds)
            .replace('%c2', cost);
          return result;
        },
        onComplete() {
          // start showing "NSF" short-hand, now that user has seen the long form
          data.canShowNSF = true;
        }
      });

      return;

    }

    // Network co-op: We have a remote friendly player...
    if (net.active && player.data.isLocal && player.data.isEnemy === game.players.remote[0].data.isEnemy) {

      if (net.isHost) {

        // ... and we are the host: Notify the remote of what we're ordering.
        net.sendMessage({ type: 'NOTIFICATION', html: `${PRETTY_TYPES[type]}`, notificationType: 'remoteOrder' });

      } else {

        /**
         * Network co-op case: Remote friendly player, NOT the host: just send order details.
         * The host will receive and process the order as though it had been made locally.
         * This will result in adding objects (e.g., tanks) to the battlefield, which will
         * be sent back to the guest via ADD_OBJECT.
         * 
         * TODO: for multi-player, identify host as e.g., `game.players.host` vs remote[0].
         */
        net.sendMessage({ type: 'REMOTE_ORDER', orderType: type, options, id: player.data.id });

        game.objects.notifications.add(`📦 ${PRETTY_TYPES[type]} 🛠️`);

        return;

      }

    }

    // and now, remove `noInit` for the real build.
    options.noInit = false;

    // create and push onto the queue.
    const newOrder = {
      data: orderObject.data,
      // how long to wait after last item before "complete" (for buffering space)
      completeDelay: orderObject.data.inventory.orderCompleteDelay || 0,
      type,
      options,
      size: orderSize,
      originalSize: orderSize,
      onOrderStart: null,
      onOrderComplete: null,
      waiting: false
    };

    let queueEvents;

    data.queue.push(newOrder);

    // preserve original list for display of notifications.
    // live `data.queue` is modified via `shift()` as it's processed.
    data.queueCopy.push(newOrder);

    if (sounds.bnb.tv && isOrderingTV()) {
      playSoundWithDelay(sounds.bnb.tv);
    }

    // update the UI
    utils.css.add(dom.gameStatusBar, css.building);

    // and make a noise
    if (sounds.inventory.begin) {
      playSound(sounds.inventory.begin);
    }

    // callback to update queue UI when the build actually begins
    queueEvents = game.players.local.updateInventoryQueue(newOrder);

    newOrder.onOrderStart = queueEvents.onOrderStart;
    newOrder.onOrderComplete = queueEvents.onOrderComplete;

    // display, if provided (relies on queue array to update order counts)
    if (pendingNotification) {
      pendingNotification();
    }

    // only start processing if queue length is 1 - i.e., first item just added.
    if (!data.building) {
      processNextOrder();
    }

  }

  function animate() {

    let newObject;

    if (!data.building || data.frameCount++ % objects.order.data.inventory.frameCount !== 0) return;

    if (data.waiting) return processNextOrder();

    if (objects.order.size) {

      const sendToRemote = !!net.active;

      // hackish: modify options, if we're ordering the real thing.
      if (!objects.order.options.noInit) {
        objects.order.options.prefixID = !!sendToRemote;
      }

      // start building.
      newObject = game.addObject(objects.order.type, objects.order.options);

      // ignore if this is the stub object case
      if (!objects.order.options.noInit) {

        // mirror this on the other side, if a network game.
        if (sendToRemote) {
          net.sendMessage({
            type: 'ADD_OBJECT',
            objectType: newObject.data.type,
            params: {
              ...objects.order.options,
              id: newObject.data.id
            }
          });
        }
  
        // force-append this thing, if it's on-screen right now
        sprites.updateIsOnScreen(newObject);

        utils.css.add(newObject.dom.o, css.building);

        // and start the "rise" animation
        window.requestAnimationFrame(() => {

          utils.css.add(newObject.dom.o, css.ordering);

          common.setFrameTimeout(() => {
            if (!newObject.dom?.o) return;
            utils.css.remove(newObject.dom.o, css.ordering);
            utils.css.remove(newObject.dom.o, css.building);
          }, 2200);

        });

      }


      // only fire "order start" once, whether a single tank or the first of five infantry.
      if (objects.order.size === objects.order.originalSize && objects.order.onOrderStart) {
        objects.order.onOrderStart();
      }

      if (!objects.order.options.isCPU) {
        objects.lastObject = newObject;
      }

      objects.order.size--;

    } else if (objects.order.completeDelay) {

      // wait some amount of time after build completion? (fix spacing when infantry / engineers ordered, followed by a tank.)
      objects.order.completeDelay--;

    } else {

      // "Construction complete."

      if (!objects.order.options.isCPU) {

        data.waiting = false;
        data.waitingFrames = 0;

        // drop the item that just finished building.
        objects.order?.onOrderComplete();

      }
      
      processNextOrder();

    }

  }

  function initStatusBar() {
    dom.gameStatusBar = document.getElementById('game-status-bar');
  }

  orderNotificationOptions = {
    type: 'order',
    onRender(input) {
      let i, j, actualType, types, counts, output;

      types = [];
      counts = [];
      output = [];

      // build arrays of unique items, and counts
      for (i=0, j=data.queueCopy.length; i<j; i++) {

        // same item as before? handle difference between infantry and engineers
        actualType = (data.queueCopy[i].data.role ? data.queueCopy[i].data.roles[data.queueCopy[i].data.role] : data.queueCopy[i].data.type);

        if (i > 0 && actualType === types[types.length-1]) {
          counts[counts.length-1] = (counts[counts.length-1] || 0) + 1;
        } else {
          // new type, first of its kind
          types.push(actualType);
          counts.push(1);
        }

      }

      if (types.length === 1) {
        // full type, removing dash from "missile-launcher"
        output.push(types[0].charAt(0).toUpperCase() + types[0].slice(1).replace('-', ' ') + (counts[0] > 1 ? `<sup>${counts[0]}</sup>` : ''));
      } else {
        for (i=0, j=types.length; i<j; i++) {
          output.push(types[i].charAt(0).toUpperCase() + (counts[i] > 1 ? `<sup>${counts[i]}</sup>` : ''));
        }
      }

      return input.replace('%s', output.join(' '));
    }, onComplete() {
      // clear the copy of the queue used for notifications.
      // any new notifications will start with a fresh queue.
      data.queueCopy = [];
    }
  }

  function startEnemyOrdering() {

    // basic enemy ordering pattern
    const enemyOrders = parseTypes('missileLauncher, tank, van, infantry, infantry, infantry, infantry, infantry, engineer, engineer');
    const enemyDelays = [4, 4, 3, 0.4, 0.4, 0.4, 0.4, 1, 0.45];
    let orderOffset = 0;

    if (gameType === 'extreme') {

      // one more tank to round out the bunch, and (possibly) further complicate things :D
      enemyOrders.push(TYPES.tank);

      // matching delay, too
      enemyDelays.push(4);

    }

    // the more CPUs, the faster the convoys! :D
    const convoyDelay = (gameType === 'extreme' ? 20 : (gameType === 'hard' ? 30 : 60)) / game.players.cpu.length;

    // after ordering, wait a certain amount before the next convoy
    enemyDelays.push(convoyDelay);

    function orderNextItem() {

      let options;

      if (!game.data.battleOver && !game.data.paused && !game.objects.editor) {

        options = {
          isEnemy: true,
          x: worldWidth + 64
        };

        if (!game.data.productionHalted) {

          let obj = game.addObject(enemyOrders[orderOffset], options);

          // ensure this order shows up on the remote
          if (net.active) {
            net.sendMessage({
              type: 'ADD_OBJECT',
              objectType: obj.data.type,
              params: {
                ...options,
                id: obj.data.id
              }
            });
          }

        }

        common.setFrameTimeout(orderNextItem, enemyDelays[orderOffset] * 1000);

        orderOffset++;

        if (orderOffset >= enemyOrders.length) {
          orderOffset = 0;
        }

      }

    }

    common.setFrameTimeout(orderNextItem, data.enemyOrderDelay);

  }

  css = {
    building: 'building',
    ordering: 'ordering'
  };

  data = {
    frameCount: 0,
    enemyOrderDelay: 5000,
    building: false,
    queue: [],
    queueCopy: [],
    canShowNSF: false,
    waiting: false,
    waitingFrames: 0,
    waitingFramesMax: 120
  };

  objects = {
    order: null,
    lastObject: null
  };

  dom = {
    gameStatusBar: null
  };

  exports = {
    animate,
    data,
    dom,
    order,
    startEnemyOrdering
  };

  initStatusBar();

  return exports;

};

export { Inventory };