import { COSTS, oneOf, TYPES } from './global.js';
import { game } from './Game.js';
import { common } from '../core/common.js';
import { isGameOver } from '../core/logic.js';
import { addSequence, playSound, playSoundWithDelay, sounds } from '../core/sound.js';
import { playSequence } from './sound-bnb.js';
import { gamePrefs, prefs } from '../UI/preferences.js';

const EVENTS = {
  boring: 'boring',
  helicopterCollision: 'helicopter_collision',
  switchPlayers: 'switch_players',
  autoSwitchPlayers: 'auto_switch_players',
  enemyDied: 'enemy_died',
  youDied: 'you_died',
  youKilledSomething: 'you_killed_something',
  youLost: 'you_lost',
  youWon: 'you_won',
  vanApproaching: 'van_approaching'
};

const AUTO_SWITCH_MINUTES = 1.25;
const DIE_MONOLOGUE_MINUTES = 0.6125;

function playDelayedSound(sound, options, delay) {
  // sound without target = full volume, assumed on-screen
  const target = null;
  return playSoundWithDelay(sound, target, options, delay);
}

function GameEvents() {

  let data, exports;

  const events = {};
  let eventNames = [];

  // given an event, call its given method.
  function fireEvent(name, method = 'fire', ...args) {

    // console.warn(`No ${name} event registered (yet?)`);
    if (!events[name]) return;

    if (events[name][method]) {
      // by default, provide state to each method.
      events[name][method](events[name].getState(), ...args);
    } else {
      throw new Error(`WTF no method ${method} for event ${name}?`);
    }

  }

  // short-hand for the inner 'fire' method
  function fire(name, ...args) {
    return fireEvent(name, 'fire', ...args);
  }

  function addEvent(name, options) {

    const state = {
      completed: false,
      name
    };

    events[name] = {

      getState: () => state,

      init: () => {

        if (options.onInit) options.onInit(state);

      },

      reset: () => {

        state.completed = false;
        if (options.onReset) options.onReset(state);

      },

      complete: () => {

        state.completed = true;
        if (options.onComplete) options.onComplete(state);

      },

      animate: () => {

        if (state.completed) return;

        // once this goes truthy, this item is considered "complete."
        let didComplete;

        if (options.onAnimate) didComplete = options.onAnimate(state);

        if (!state.completed && didComplete) {
          fireEvent(state.name, 'complete');
        }

      },

      fire: (state, property, value) => {

        if (property) state[property] = value;

        if (options.onFire) options.onFire(state);

      },

      ...options

    };

    eventNames = Object.keys(events);

    fireEvent(name, 'init');

  }

  function init() {

    addEvent(EVENTS.enemyDied, {

      onFire: () => {
        
        // you took out the enemy helicopter.
        playSoundWithDelay(sounds.bnb.helicopterDiedReactions, 1000);

      }

    });

    //
    // human helicopter (player) died; punish if several deaths in a short time period
    //

    addEvent(EVENTS.youDied, {

      onInit: (state) => {

        state.dieCount = 0;
        state.delay = 1000;
        state.dieTimer = Date.now();

      },

      reset: (state) => {

        fireEvent(state.name, 'onInit');

      },

      onFire: (state) => {

        state.dieCount++;

        // hackish: increase global stat, too.
        game.data.dieCount++;

        state.dieTimer = Date.now() - state.dieTimer;

        // "you died", clear + restart auto-switch timer.
        fireEvent(EVENTS.autoSwitchPlayers, 'start');

        // don't play helicopter "loss" audibly if a bunker is blowing up,
        // since bunker explosions have their own commentary.
        const hitBunker = state?.attacker?.data?.type === TYPES.bunker;

        const options = {
          muted: hitBunker,
          onfinish: () => {
            // switch players; "it's my turn."
            if (state.dieCount >= 3) {
              fireEvent(EVENTS.switchPlayers);
              state.dieCount = 0;
            } else if (state.dieCount && state.dieTimer > DIE_MONOLOGUE_MINUTES * 60000) {
              // player lived long enough, add some more commentary.
              playSound(sounds.bnb[game.data.isBeavis ? 'beavisMonologues' : 'buttheadMonologues'], null);
            }
          }
        };

        // play a quick reaction, immediately.
        const reaction = [
          ...sounds.bnb[game.data.isBeavis ? 'beavisScreamShort' : 'buttheadScreamShort']
        ];
        reaction.playImmediately = true;

        playSound(reaction, null);

        // "you died" - bring the commentary.
        playDelayedSound(sounds.bnb[game.data.isBeavis ? 'beavisLostHelicopter' : 'buttheadLostHelicopter'], options, state.delay);

      }

    });

    addEvent(EVENTS.switchPlayers, {

      onInit: (state) => {

        const isBeavis = (window.location.href.match(/beavis/i) || (Math.random() >= 0.5 && !window.location.href.match(/butthead/i)));
        const isButthead = !isBeavis;

        // roll the dice, determine who's playing.
        fireEvent(state.name, 'updatePlayers', isBeavis, isButthead);

      },

      updatePlayers(state, beavis, butthead) {

        // beavis -> butthead (and not first player case): *sometimes*, add an extra complaint.
        if (gamePrefs.bnb && state.isBeavis && butthead && Math.random() >= 0.5) {
          playDelayedSound(sounds.bnb.thoughtWeWereGonnaScore);
        }

        state.isBeavis = beavis;
        state.isButthead = butthead;

        // hackish: same for game global.
        game.data.isBeavis = state.isBeavis;
        game.data.isButthead = state.isButthead;

      },

      announcePlayer: (state) => {

        if (gamePrefs.bnb) {

          if (state.isBeavis) {

            game.objects.notifications.add(`NOW PLAYING: BEAVIS 🤘`);
            playDelayedSound(sounds.bnb.beavisTurn);

          } else {

            game.objects.notifications.add(`NOW PLAYING: BUTT-HEAD 🤘`);
            playDelayedSound(sounds.bnb.buttheadTurn);

          }

        }

        const nowPlaying = document.getElementById('bnb-now-playing');
        const nextClass = state.isBeavis ? 'beavis' : 'butthead';

        // first player fade-in, vs. fade out / in
        if (!nowPlaying.className) {
          nowPlaying.className = nextClass;
        } else {
          nowPlaying.className = '';
          common.setFrameTimeout(() => nowPlaying.className = nextClass, 500);
        }

        // reset the auto-timer, finally
        fireEvent(EVENTS.autoSwitchPlayers, 'start');

      },

      onFire: (state, withMonologue = false) => {

        // play sounds, then switch.
        if (isGameOver()) return;

        if (gamePrefs.bnb) {

          const andAnnounce = {
            onfinish: () => {
              fireEvent(state.name, 'announcePlayer');
              if (withMonologue) {
                playSound(sounds.bnb[game.data.isBeavis ? 'beavisMonologues' : 'buttheadMonologues'], null);
              }
            }
          };

          if (state.isBeavis) {

            // -> butthead
            playDelayedSound(oneOf([sounds.bnb.buttheadWatchTheMaster, sounds.bnb.takeSoLong, sounds.bnb.buttheadOKGetReadyDude]), andAnnounce);

            // preload
            common.preloadVideo('igotyoubabe');

          } else {

            // -> beavis
            const rnd = Math.random();

            if (rnd >= 0.67) {
              playDelayedSound(sounds.bnb.beavisMyTurn);
              playDelayedSound(sounds.bnb.buttheadUhWhateverDumbass);
              playDelayedSound(sounds.bnb.beavisNoWayItsMyTurn, andAnnounce);
            } else if (rnd >= 0.33) {
              playDelayedSound(sounds.bnb.buttheadGoForItBeavis);
              playDelayedSound(sounds.bnb.beavisMyTurn, andAnnounce);
            } else {
              playDelayedSound(sounds.bnb.beavisMyTurn, andAnnounce);
              playDelayedSound(sounds.bnb.buttheadDammitBeavisIWasAboutToScore);
              playDelayedSound(sounds.bnb.beavisNoWayItsMyTurn, andAnnounce);
            }

          }

        }

        // flip state
        fireEvent(state.name, 'updatePlayers', !state.isBeavis, !state.isButthead);

      }

    });

    addEvent(EVENTS.autoSwitchPlayers, {

      onInit: (state) => {

        // every N minutes, BnB take turns at the controls (if you haven't died.)
        state.switchInterval = 1000 * 60 * AUTO_SWITCH_MINUTES;

        state.timer = null;
       
      },

      fire: () => {

        // player has lived enough without dying, switch virtual players
        const withMonologue = true;
        fire(EVENTS.switchPlayers, withMonologue);
      
        // reset the "3 lives = switch" counter
        fireEvent(EVENTS.youDied, 'reset');

      },

      reset: (state) => {

        state?.timer?.reset();
        state.timer = null;

      },

      start: (state) => {

        fireEvent(state.name, 'reset');

        state.timer = common.setFrameTimeout(() => fireEvent(state.name), state.switchInterval);

      },

    });

    addEvent(EVENTS.boring, {

      onInit: (state) => {

        state.BORING_THRESHOLD = 3;
        state.BORING_INTERVAL = 30000;

        fireEvent(state.name, 'reset');
        
      },

      checkForBoredom: (state) => {

        // complain if it's been relatively quiet.
        if (game.data.started && !game.data.paused && state.bnbCommentaryCounter < state.BORING_THRESHOLD && !isGameOver()) {

          // space out these events in editor mode, over time.
          if (game.objects.editor) {
            state.BORING_INTERVAL *= 2;
          }

          playSound(sounds.bnb[state.name]);

        }
        
        fireEvent(state.name, 'reset');
        
      },

      onFire: (state) => {

        state.bnbCommentaryCounter++;

      },

      reset: (state) => {

        state.bnbCommentaryCounter = 0;

        common.setFrameTimeout(() => fireEvent(state.name, 'checkForBoredom'), state.BORING_INTERVAL);
       
      }

    });

    addEvent(EVENTS.vanApproaching, {

      // a van is nearing a base. notify, with throttling.

      animate: () => {},

      onInit: (state) => {

        state.lastNotifyYours = 0;
        state.lastNotifyTheirs = 0;
        state.notifyThrottle = 30000;

      },

      onFire: (state) => {

        const now = Date.now();

        if (state.isEnemy && (now - state.lastNotifyYours) >= state.notifyThrottle) {

          state.lastNotifyYours = now;
          game.objects.notifications.add('🚚 An enemy van is approaching your base 😨🤏💥');
          if (prefs.bnb && sounds.bnb.uhOh) {
            playSequence(addSequence(sounds.bnb.uhOh, () => sounds.bnb[game.data.isBeavis ? 'beavisBeerAndScore' : 'hurryUpButthead']));
          }

        } else if (!state.isEnemy && (now - state.lastNotifyTheirs) >= state.notifyThrottle) {

          state.lastNotifyTheirs = Date.now();
          game.objects.notifications.add('🚚 Your van is approaching the enemy base 🤏💥');
          if (prefs.bnb && sounds.bnb.almostThere) {
            playSequence(addSequence(sounds.bnb.almostThere, sounds.bnb[game.data.isBeavis ? 'beavisReallyGonnaScore' : 'gonnaScore']));
          }

        }

      }

    });

    addEvent(EVENTS.youKilledSomething, {

      // compliment the player if they effectively hit an equivalent of “GOURANGA!”
      // e.g., 25 credits' worth of inventory within a given time period.
      // https://youtu.be/FEWbI9G8r10

      animate: () => {},

      onInit: (state) => {

        // hackish: the type of the thing most recently taken out
        state.type = null;

        // kill X credits in Y interval = GOURANGA!
        state.killCreditsGouranga = 20;
        state.interval = 10000;

        fireEvent(state.name, 'reset');

      },

      reset: (state) => {

        state.killCredits = 0;
        state.ts = 0;

        if (state.timer) {
          state.timer.reset();
          state.timer = null;
        }
        
      },

      onFire: (state) => {

        const item = COSTS[state.type];

        // bunkers, etc., don't have a cost.
        if (!item?.funds) return;

        state.killCredits += ((item.funds / item.count) || 1);

        const now = Date.now();

        // start timer on first kill
        if (!state.ts) state.ts = now;

        const hasGouranga = state.killCredits >= state.killCreditsGouranga;
        const hasTime = (now - state.ts) < state.interval;

        // window has closed; reset state, and repeat.
        if (!hasTime) {
          fireEvent(state.name, 'reset');
          fireEvent(state.name, 'fire');
        }

        if (hasGouranga && hasTime) {

          // GOURANGA!
          if (state.timer) state.timer.reset();

          if (prefs.bnb) return;

          // only queue this once.
          if (!state.timer) {
            game.objects.notifications.add('💥 GOURANGA! 💥', { noRepeat: true });
          }

          state.timer = common.setFrameTimeout(() => {

            const { bnb } = sounds;
            
            const commentary = game.data.isBeavis ? bnb.beavisGouranga : bnb.buttheadGouranga;
          
            const target = null;

            const helicopterCheck = () => !game.players.local.data.dead;

            playSound(commentary, target, {
              playNextCondition: helicopterCheck,
              onplay: helicopterCheck,
              onfinish: () => fireEvent(state.name, 'reset')
            })

          }, 2000);

        }

      }

    });

    addEvent(EVENTS.helicopterCollision, {

      onFire: (state) => playSoundWithDelay(sounds.bnb[state.name])

    });

  }

  // called at an interval
  function animate() {

    eventNames.forEach((name) => events[name].animate());
    common.setFrameTimeout(animate, 500);

  }

  function start() {

    init();
    animate();

  }

  data = {
    events,
    time: {
      start: new Date()
    }
  };

  exports = {
    data,
    fire,
    fireEvent,
    start
  };

  return exports;

}

const gameEvents = GameEvents();

export { EVENTS, gameEvents };