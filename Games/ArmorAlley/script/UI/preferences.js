import { utils } from '../core/utils.js';
import { game } from '../core/Game.js';
import { defaultMissileMode, getTypes, isiPhone, isMobile, isSafari, oneOf, soundManager, tutorialMode, TYPES, worldHeight } from '../core/global.js';
import { playQueuedSounds, playSound, sounds } from '../core/sound.js';
import { playSequence, resetBNBSoundQueue } from '../core/sound-bnb.js';
import { sprites } from '../core/sprites.js';
import { effects } from '../core/effects.js';
import { net } from '../core/network.js';
import { common } from '../core/common.js';
import { gameMenu } from './game-menu.js';
import { previewLevel, setLevel } from '../levels/default.js';
import { snowStorm } from '../lib/snowstorm.js';

const prefs = {
  gameType: 'game_type'
};

// for non-boolean form values; set by form, referenced by game
const PREFS = {
  SHOW_HEALTH_NEVER: 'never',
  SHOW_HEALTH_SOMETIMES: 'sometimes',
  SHOW_HEALTH_ALWAYS: 'always',
  NOTIFICATIONS_LOCATION_LEFT: 'left',
  NOTIFICATIONS_LOCATION_RIGHT: 'right'
};

const DEFAULT_VOLUME_MULTIPLIER = 0.7;

// game defaults
const defaultPrefs = {
  game_type: '', // [easy|hard|extreme]
  net_game_level: '',
  net_game_type: 'easy', // non-network default is tutorial, need to be explicit.
  net_game_style: 'pvp', // [pvp|pvp_cpu|coop_2v1|coop_2v2]
  lock_step: false,
  net_player_name: '',
  net_remote_player_name: '',
  sound: true,
  volume: DEFAULT_VOLUME_MULTIPLIER, // 0-1
  muzak: true,
  bnb: false,
  bnb_tv: true,
  weather: '', // [none|rain|hail|snow|turd]
  domfetti: true,
  gravestones_helicopters: true,
  gravestones_infantry: false,
  gravestones_vehicles: false,
  show_inventory: true,
  show_weapons_status: true,
  show_keyboard_labels: !isiPhone, // iPhone is unlikely to have a keyboard. iPad might. Desktops should, etc.
  show_game_tips: true,
  show_health_status: PREFS.SHOW_HEALTH_SOMETIMES, // never | sometimes | always
  // special case: mobile defaults to show @ left, important especially on small screens in portrait mode.
  notifications_location: (isMobile ? PREFS.NOTIFICATIONS_LOCATION_LEFT : PREFS.NOTIFICATIONS_LOCATION_RIGHT),
  alt_smart_missiles: true,
  engineers_repair_bunkers: true,
  engineers_rob_the_bank: true,
  tank_gunfire_miss_bunkers: true,
  ground_unit_traffic_control: true
};

// allow URL-based overrides of prefs
let prefsByURL = {};

function normalizePrefValue(val) {
  // string / number to boolean, etc.
  if (val === 'true' || val == 1) return true;
  if (val === 'false' || val == 0) return false;
  return val;
}

const { hash } = window.location;
const hashParams = hash?.substr(hash.indexOf('#') === 0 ? 1 : 0)
const searchParams = new URLSearchParams(window.location.search || hashParams);

for (const p of searchParams) {
  // p = [name, value]
  if (defaultPrefs[p[0]] !== undefined) {
    prefsByURL[p[0]] = normalizePrefValue(p[1]);
  }
}

// initially, the game inherits the defaults
let gamePrefs = {
  ...defaultPrefs
};

function PrefsManager() {

  let data, dom, events;

  function initLayout() {

    if (data.originalHeight > 0) return;

    // hackish: adjust dialog body to "natural" height, prevent scrollbars.
    // display temporarily, read layout, adjust and then hide.
    dom.o.style.setProperty('opacity', 0);
    dom.o.style.setProperty('display', 'block');

    let body = dom.o.querySelector('.body');
    body.style.setProperty('height', 'auto');

    // NOTE: This forces layout and is $$$
    let height = body.offsetHeight;

    data.originalHeight = height;

    // now assign the natural content height
    body.style.setProperty('height', height + 'px');

    // Remove the menu entirely from the DOM, set it up to append only when active.
    dom.o.remove();

    // reset opacity
    dom.o.style.setProperty('opacity', null);
    
  }

  function init() {

    dom.o = document.getElementById('game-prefs-modal');
    dom.oBnB = document.getElementById('cb_bnb');
    dom.oChatScroll = document.getElementById('network-options-chat-scroll');
    dom.oChatUI = document.getElementById('network-options-chat-ui');
    dom.oForm = document.getElementById('game-prefs-form');
    dom.oFormSubmit = document.getElementById('game-prefs-submit');
    dom.oFormCancel = document.getElementById('game-prefs-cancel');
    dom.oNetStatusLabel = document.getElementById('network-options-status-label');
    dom.oVolumeSlider = document.getElementById('main_volume');
    dom.optionsLink = document.getElementById('game-options-link');
    dom.oStatsBar = document.getElementById('stats-bar');
    dom.oGameTips = document.getElementById('game-tips');
    dom.oToasts = document.getElementById('notification-toasts');

    // just in case
    if (!dom.o || !dom.oForm || !dom.optionsLink) return;

    // delightfully old-skool.
    dom.oForm.onsubmit = events.onFormSubmit;
    dom.oForm.onreset = events.onFormReset;
    dom.optionsLink.onclick = events.optionsLinkOnClick;

    readAndApplyPrefsFromStorage();

    // hackish / special-case: force-update notification toast location IF it's on the left.
    // page HTML + CSS defaults to the right.
    if (gamePrefs.notifications_location === PREFS.NOTIFICATIONS_LOCATION_LEFT) {
      events.onPrefChange['notifications_location'](gamePrefs.notifications_location);
    }

    // special case: apply gravestone prefs with current values.
    ['gravestones_helicopters', 'gravestones_infantry', 'gravestones_vehicles'].forEach((pref) => events.onPrefChange[pref](gamePrefs[pref]));

    // special case: apply BnB "VS" immediately.
    dom.oBnB.addEventListener('change', (e) => {

      events.onPrefChange['bnb'](e.target.checked);

      // update the main screen, too. this is responsible for the game menu sound sequences.
      const vs = document.getElementById('checkbox-vs');

      // ensure that element does the work it normally does when clicked manually.
      vs?.dispatchEvent(new Event('change'));

    });
    
    dom.oVolumeSlider.addEventListener('change', () => {

      // randomize, keep it fun.
      data.bnbVolumeTestSound = oneOf(sounds.bnb.volumeTestSounds);

    });

    // watch for and apply volume updates
    dom.oVolumeSlider.addEventListener('input', () => {

      // stored in model as 0-1, but form values are 0-10.

      // don't bother doing any SM2 work like mute() etc., just set the "volume scale."
      gamePrefs.volume = getVolumeFromSlider();

      renderVolumeSlider();

      // play a sound, too.
      playSound(gamePrefs.bnb ? data.bnbVolumeTestSound : sounds.inventory.begin, null);

      // ugh.
      // ensure we keep processing sounds.
      if (!gamePrefs.bnb && game.data.paused) {
        // hack: use classic timer, since the DIY setFrameTimeout() won't work when paused.
        // TODO: clean this crap up.
        if (!game.data.hackTimer) {
          game.data.hackTimer = window.setTimeout(() => {
            game.data.hackTimer = null;
            playQueuedSounds();
          }, 32);
        }
      }

    });

  }

  function selectLevel(levelName) {

    setLevel(levelName, levelName);

    // if playing cooperative vs. CPU, then include CPU vehicles to start.
    const excludeVehicles = !gamePrefs.net_game_style.match(/coop/);
    previewLevel(levelName, excludeVehicles);
    
  }

  function renderVolumeSlider() {

    document.getElementById('volume-value').innerText = `(${parseInt(gamePrefs.volume * 100, 10)}%)`;
    
  }

  function getVolumeFromSlider() {

    // volume slider goes from 0-10; we store values in JS as 0-1 as a volume "scale."
    return parseFloat((dom.oVolumeSlider.value * 0.1).toFixed(2));

  }

  function toggleDisplay() {

    if (data.active) {
      hide();
    } else {
      show();
      if (isMobile) {
        // shenanigans: always do this on mobile.
        events.updateScreenScale();
      }
    }

  }

  const copyToClipboard = (str, callback) => {
    if (!navigator?.clipboard?.writeText) return callback(false);
    return navigator.clipboard.writeText(str).then(() => callback(true), () => callback(false));
  };

  function updateNetworkStatus(status) {

    const statusHTML = 'Network Status';

    dom.oNetStatusLabel.innerHTML = `${statusHTML}: ${status}`;

  }

  function doHostSetup(id) {

    const wl = window.location;

    let params = [`id=${id}&game_style=network`];

    // add existing query params to array, too.
    if (window.location.search.length) {
      params = params.concat(window.location.search.substring(1).split('&'));
    }

    updateNetworkStatus('Ready');

    // TODO: filter URL params, drop ones that are prefs?
    const inviteURL = `${wl.origin}${wl.pathname}?${params.join('&')}`;
    const inviteURLDisplay = inviteURL.length > 120 ? inviteURL.slice(0, 120) + '...' : inviteURL;
    const inviteContainer = document.getElementById('network-options-invite-container');
    const inviteButton = document.getElementById('network-options-invite-link');

    inviteButton.disabled = '';

    const linkDetail = document.getElementById('network-options-link');

    inviteButton.onclick = () => {
      copyToClipboard(inviteURL, (ok) => {
        inviteContainer.remove();
        linkDetail.innerHTML = [
         `<p>Send this link to a friend:</p>`,
         `<a href="${inviteURL}" onclick="return false" class="no-hover">${inviteURLDisplay}</a>`,
         ok ? `<p>The link has been copied to your clipboard.</p>` : ``
        ].join('\n');
      });
    }

  }

  function startNetwork() {

    updateNetworkStatus('Initializing...');

    resetPlayerNames();    

    events.onChat('Welcome to network chat!');

    if (net.isHost) {

      events.onChat('Waiting for the guest to join...');

    } else {

      events.onChat('Connecting...');

      const appleWatch = '<span class="mac-system-waiting"></span>';

      window.setTimeout(() => {

        if (net.connected) return;

        updateNetworkStatus(`Connecting... ${appleWatch}`);

      }, 1000);

      window.setTimeout(() => {
      
        if (net.connected) return;

        updateNetworkStatus(`Still connecting... ${appleWatch}`);
        events.onChat('Still connecting...');

        window.setTimeout(() => {
          updateNetworkStatus('Connection trouble');
          events.onChat('<b>Unable to connect; apologies.</b> Try reloading, then getting a new invite link.');
          events.onChat('This game uses PeerJS to establish a peer-to-peer WebRTC session.');
          events.onChat('This may fail in a "double NAT" scenario, when both peers are behind certain routers or firewalls - as often found at offices and schools. :/');
        }, 5000);

      }, 5000);

    }

    net.init((id) => {

      if (net.isHost) {
        doHostSetup(id);
      }

      // handlers for radio buttons + checkboxes, keeping things in sync

      function handleInputChange(e) {

        let { name, value } = e?.target;

        if (e.target.type === 'checkbox') {
          // NOTE: assuming 0/1 values here, no "true" strings etc. for checkboxes.
          if (value != 0 && value != 1) {
            console.warn('handleInputChange(): WTF, checkbox has value other than 0|1?', e.target);
            return;
          }
          value = (e.target.checked ? value : (value == 1 ? 0 : 1));
        }

        if (!name) return;

        // note: convert form string to boolean for game prefs object
        value = normalizePrefValue(value);

        gamePrefs[name] = value;

        // hackish: if level, update local model.
        if (name === 'net_game_level') {
          selectLevel(value);
        }

        // game style now affects level preview, whether CPU vehicles are included or not.
        if (name === 'net_game_style') {
          selectLevel(gamePrefs.net_game_level);
        }

        // special case: show toast for local user.
        if (game.data.started) {
          if (name === 'lock_step') {
            game.objects.notifications.add(`You have ${value ? 'enabled' : 'disabled'} "lock step" game sync.`);
            if (!value) {
              // if disabling, ensure the spinner gets turned off.
              game.objects.gameLoop.setWaiting(false);
            }
          } else if (name === 'ground_unit_traffic_control') {
            game.objects.notifications.add(`You have ${value ? 'enabled' : 'disabled'} Ground Vehicle "Traffic Control."`);
          }
        }

        if (net.connected) {
          net.sendMessage({ type: 'UPDATE_PREFS', params: [{ name, value }] });
        }

        // if we were "ready" to start, we changed our mind - so, reset accordingly.
        events.onReadyState(false);

      }

      // change events on prefs "panels" that need syncing with remote
      ['network-options', 'gameplay-options', 'traffic-control'].forEach((id) => document.getElementById(id).addEventListener('change', handleInputChange));

      const chatInput = document.getElementById('network-chat-input');

      function changeHandler(e) {

        if (!net.connected) return;

        const text = chatInput.value;

        const params = [ text, gamePrefs.net_player_name ];

        // ignore if empty
        if (!text.length) {
          e.preventDefault();
          return;
        }

        // send to remote, before anything else.
        net.sendMessage({ type: 'CHAT', params });

        // check for slash command.
        // NOTE: explicit pass of false, so we send a chat message with this local command call.
        const fromNetwork = false;
        const slashCommand = common.parseSlashCommand(text, fromNetwork);

        if (slashCommand) {

          slashCommand();

        } else {

          // show the message locally
          events.onChat(...params);

        }

        // and clear.
        chatInput.value = '';

        e.preventDefault();
        return false;

      }

      chatInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') return changeHandler(e);
      });

      // just in case - iOS and others.
      chatInput.addEventListener('change', changeHandler);


    }, () => {

      if (net.isHost) {

        events.onChat('Your guest has connected.');

        // if we have a name set, send it over.
        net.sendMessage({ type: 'REMOTE_PLAYER_NAME', newName: gamePrefs.net_player_name });

        // grab groups of inputs, grouped by `<legend>` for shared "sync over network" sections.
        // radio buttons share the same name, so we'll have duplicates that need filtering.
        // hackish: assign all to an object, then return the keys.
        let sharedPrefNames = {};

        dom.oForm.querySelectorAll('.sync-over-network input, .sync-over-network select').forEach((input) => sharedPrefNames[input.name] = true);

        const prefsToSend = Object.keys(sharedPrefNames);

        const params = prefsToSend.map((key) => ({ name: key, value: gamePrefs[key] }));

        net.sendMessage({ type: 'UPDATE_PREFS', params });

      } else {

        events.onChat('Connection established with host.');

      }

      events.onChat('Discuss options amongst yourselves, and click "READY" to proceed.');

      events.onChat('Identify yourself: /name [your name here]');

      const chatInput = document.getElementById('network-chat-input');

      chatInput.placeholder = 'Type a message, enter/return to send';
      chatInput.disabled = false;

    });
    
  }

  function show(options = {}) {

    /**
     * options = {
     *   network: true,
     *   // expect game_type to be one of easy / hard / extreme
     *   onStart: (networkGameType) => startGame(networkGameType)
     * };
     */

    if (data.active || !dom.o) return;

    initLayout();

    data.active = true;

    data.network = !!options.network;

    game.objects.view.data.ignoreMouseEvents = true;

    events.updateScreenScale();

    document.body.appendChild(dom.o);

    // ensure the form matches the JS state.
    updateForm();

    // ensure the volume slider is up-to-date.
    dom.oVolumeSlider.value = gamePrefs.volume * 10;

    // heh.
    data.bnbVolumeTestSound = oneOf(sounds.bnb.volumeTestSounds);

    renderVolumeSlider();

    // only do the network connect flow once, of course.
    if (data.network && !data.connected) {

      // hackish: grab network level selection from home menu, and apply to prefs.
      const gameMenuLevel = document.getElementById('game_level');
      // NOTE: offset of -1 because home menu has tutorial entry.
      const netGameLevel = document.getElementById('select_net_game_level');
      netGameLevel.selectedIndex = Math.max(0, gameMenuLevel.selectedIndex - 1);
      gamePrefs.net_game_level = netGameLevel.value;

      // and, update local model.
      selectLevel(gamePrefs.net_game_level);

      // browsers may remember scroll offset through reloads; ensure it resets.
      document.getElementById('form-scroller').scrollTop = 0;

      utils.css.add(document.body, 'network');

      // network LIGHTS.EXE requires the game loop; so be it.
      game.objects.gameLoop.start();

      utils.css.addOrRemove(dom.o, data.network, 'is-network');
      utils.css.addOrRemove(dom.o, data.network && net.isGuest, 'is-guest');
      utils.css.addOrRemove(dom.o, data.network && net.isHost, 'is-host');

      dom.oFormSubmit.innerHTML = net.isGuest ? 'READY' : 'READY';

      // manually disable button, until the network is connected.
      // this is separate from the "ready to start" logic.
      dom.oFormSubmit.disabled = true;

      startNetwork();

    } else {

      dom.oFormSubmit.innerHTML = 'OK';

      // ensure this is active - may have been disabled during network flow
      dom.oFormSubmit.disabled = false;
      
    }

    const now = Date.now();

    if (now - data.lastMenuOpen > data.lastMenuOpenThrottle) {

      data.lastMenuOpen = now;

      window.setTimeout(() => {

        if (!data.active) return;

        playSequence(oneOf([sounds.bnb.menuOpenV1, sounds.bnb.menuOpenV2, sounds.bnb.menuOpenV3]), null, () => data.active);

        // hackish BnB case: ensure what we may have just queued gets heard.
        playQueuedSounds();

      }, 500);

    } else {

      playSound(sounds.bnb.beavisPoop);

    }

    // hackish BnB case: ensure what we may have just queued gets heard.
    playQueuedSounds();

    game.pause({ noMute: true });

  }

  function hide() {

    if (!data.active || !dom.o) return;

    dom.o.remove();
    data.active = false;

    game.objects.view.data.ignoreMouseEvents = false;

    game.resume();

  }

  const isActive = () => data.active;

  function getEmptyCheckboxData() {

    // checkbox inputs that aren't checked, won't be submitted.
    // iterate through those here, and provide the name with value=0 for each.
    // there is likely a cleaner way to do this.
    if (!dom.oForm) return {};

    let result = {};
    let checkboxes = dom.oForm.querySelectorAll('input[type="checkbox"]:not(:checked)');

    checkboxes.forEach((checkbox) => {
      result[checkbox.name] = 0;
    });
    
    return result;

  }

  function getPrefsFromForm() {

    if (!dom.oForm) return;

    const formData = new FormData(dom.oForm);

    if (!formData) return;

    let data = {};

    formData.forEach((value, key) => {
      // NOTE: form uses numbers, but game state tracks booleans.
      // form values will be 0, 1, or a non-numeric string.
      // try for int, e.g., "0" -> 0 - otherwise, keep original string.
      let number = parseInt(value, 10);
      data[key] = isNaN(number) ? value : number;
    });

    // special case: volume slider.
    data[dom.oVolumeSlider.name] = getVolumeFromSlider();

    // mixin of e.g., sound=0 where checkboxes are unchecked, and remainder of form data
    let prefs = {
      ...getEmptyCheckboxData(),
      ...data
    };

    return prefs;
    
  }

  function convertPrefsForGame(prefs) {

    // all form values are integer-based, but the game references booleans and string values.
    // given prefs with 0|1 or integer, translate to boolean or string values.
    if (!prefs) return {};

    let result = {};
    let value;

    for (let key in prefs) {
      // NOTE: form uses numbers, but game state tracks booleans.
      // key -> value: 0/1 to boolean; otherwise, keep as string.
      value = prefs[key];
      result[key] = isNaN(value) || key === 'volume' ? value : !!value;
    }

    return result;

  }

  function updatePrefs() {

    // fetch from the live form
    let formPrefs = getPrefsFromForm();

    // convert 0/1 to booleans
    let newGamePrefs = convertPrefsForGame(formPrefs);

    applyNewPrefs(newGamePrefs);

  }

  function addGroupAndLevel(oGroup) {

    const oLevelSelect = dom.o.querySelector('[name="net_game_level"]');
    if (!oLevelSelect) return;

    oLevelSelect.appendChild(oGroup);

    oLevelSelect.selectedIndex = oLevelSelect.options.length - 1;

  }

  function applyNewPrefs(newGamePrefs) {

    let prefChanges = [];

    // queue data for onChange() calls, as applicable
    // e.g., game needs to handle enabling or disabling snow or health bars
    for (let key in newGamePrefs) {
      if (events.onPrefChange[key] && gamePrefs[key] !== newGamePrefs[key]) {
        prefChanges.push({ key, value: newGamePrefs[key] });
      }
    }

    // update the live game prefs
    gamePrefs = {
      ...gamePrefs,
      ...newGamePrefs
    };

    // and now, fire all the pref change events.
    prefChanges.forEach((item) => {
      events.onPrefChange[item.key](item.value);
    });

  }

  function updateForm() {

    // given current `gamePrefs`, ensure the form has the right things selected / checked.
    Object.keys(gamePrefs).forEach((key) => {

      let value = boolToInt(gamePrefs[key]);

      // find the matching input(s) based on name, and update it.
      let inputs = dom.oForm.querySelectorAll(`input[name="${key}"]`);

      // just in case...
      if (!inputs?.forEach) return;

      inputs.forEach((input) => {
        if (input.type === 'range') {
          // volume: nevermind boolean - convert back from model to form input.
          input.value = gamePrefs[key] * 10;
        } else {
          // NOTE: intentional non-strict comparison here, string vs. int.
          // ALSO important: `checked` needs very much to be a boolean, or else all hell breaks loose.
          input.checked = !!(input.value == value);
        }
      });

    });

  }

  function boolToInt(value) {

    // gamePrefs uses true / false, but the form needs 1 / 0.
    if (typeof value === 'boolean') return value ? 1 : 0;

    return value;

  }

  function stringToBool(value) {
    // LocalStorage stores strings, but JS state uses booleans and numbers.

    // number?
    if (!isNaN(value)) return parseInt(value, 10);

    // string to boolean?
    if (value === 'true') return true;
    if (value === 'false') return false;

    // string
    return value;
  }

  function writePrefsToStorage() {

    // don't do this in the network game case, if we are the guest.
    // we'll inherit prefs from the host, and don't want ours to get clobbered.
    if (net.active && net.isGuest) {
      console.warn('writePrefsToStorage(): NOT storing because we are the guest.');
      return;
    }

    Object.keys(gamePrefs).forEach((key) => utils.storage.set(key, gamePrefs[key]));
    
  }

  function readPrefsFromStorage() {

    let prefsFromStorage = {};

    // TODO: validate the values pulled from storage. 😅
    Object.keys(defaultPrefs).forEach((key) => {
      let value = utils.storage.get(key);
      // special case
      if (key === 'volume') {
        prefsFromStorage[key] = value || DEFAULT_VOLUME_MULTIPLIER;
      } else if (value) {
        prefsFromStorage[key] = stringToBool(value);
      }
    });

    // if set, URL prefs override storage
    if (Object.keys(prefsByURL).length) {
      prefsFromStorage = {
        ...prefsFromStorage,
        ...prefsByURL
      };
      applyNewPrefs(prefsFromStorage);
    }

    return prefsFromStorage;
    
  }

  function readAndApplyPrefsFromStorage() {

    if (!utils.storage.unavailable) {

      let prefs = readPrefsFromStorage();

      applyNewPrefs(prefs);

    }

    updateForm();

  }

  function ignoreURLParams() {
    // edge case: if e.g., #bnb=0 or ?bnb=0 specified, start ignoring once the user clicks and overrides.
    prefsByURL = {};
  }

  function disableNetworkOptions() {

    const rootSelector = '.sync-over-network';

    dom.oForm.querySelectorAll(`${rootSelector} input:not([data-allow-in-game-updates])`).forEach((input) => {
      if ((input.type === 'radio' || input.type === 'checkbox')) input.disabled = true;
    });

    // network-shared / synced menu sections can be "locked down", now that a game is underway.
    // if any were left non-disabled because of the above, then only fade the child nodes.
    dom.oForm.querySelectorAll('.sync-over-network').forEach((node) => {
      // don't "fade" sections that have inputs which are still active.
      utils.css.add(node, 'faded');
      if (node.querySelectorAll('input:not([disabled])').length) {
        // exclude the legend from the fade.
        utils.css.add(node, 'faded-exclude-legend');
      }
    });

    // hide some sections outright, too.
    document.querySelectorAll('#network-options-status, #network-options-chat').forEach((node) => node.style.display = 'none');

  }

  function resetPlayerNames() {

    // assign defaults

    // the host can keep and re-send its name on re-connect.
    if (!gamePrefs.net_player_name) {
      gamePrefs.net_player_name = (net.isHost ? 'host' : 'guest');
    }

    // if/when the remote disconnects, always reset this value.
    gamePrefs.net_remote_player_name = (net.isHost ? 'guest' : 'host');
    
  }

  function resetReadyUI() {

    dom.oFormSubmit.innerHTML = 'OK';
    utils.css.remove(dom.oFormSubmit, 'attention');

  }

  function updateReadyUI() {

    if (game.data.started) {
      updateNetworkStatus(net.connected ? 'Connected' : 'Disconnected');
      return;
    }

    dom.oFormSubmit.innerHTML = data.remoteReadyToStart ? 'START' : 'READY';

    // highlight local button if remote is ready, or reset if not.
    utils.css.addOrRemove(dom.oFormSubmit, data.remoteReadyToStart, 'attention');

    let html;
    if (data.remoteReadyToStart) {
      html = 'Ready to start game';
    } else if (data.readyToStart) {
      html = `Waiting for ${net.isHost ? 'guest' : 'host'}... <span class="mac-system-waiting"></span>`;
    } else {
      // hopefully, still connected.
      html = net.connected ? 'Connected' : 'Disconnected';
    }

    updateNetworkStatus(html);
    
  }

  function startGame() {

    gameMenu.startGame();

    resetReadyUI();

  }

  function checkGameStart(options = {}) {

    if (data.readyToStart && data.remoteReadyToStart) {

      events.onChat('STARTING GAME...');

      disableNetworkOptions();

      hide();

      // depending on who is ready, delay or not.
      if (options.local) {
        console.log('local is ready; delaying, then starting game', net.halfTrip);
        window.setTimeout(startGame, net.halfTrip);
      } else {
        console.log('remote ready; starting game immediately');
        startGame();
      }

    } else {

      updateReadyUI();

    }

  }

  data = {
    active: false,
    originalHeight: 0,
    network: false,
    lastMenuOpen: 0,
    lastMenuOpenThrottle: 30000,
    readyToStart: false,
    remoteReadyToStart: false,
    bnbVolumeTestSound: null
  };

  dom = {
    o: null,
    oBnB: null,
    oChatScroll: null,
    oChatUI: null,
    oForm: null,
    oFormCancel: null,
    oFormSubmit: null,
    oNetStatusLabel: null,
    oVolumeSlider: null,
    optionsLink: null,
    oStatsBar: null,
    oGameTips: null,
    oToasts: null
  };

  events = {

    onConnect: () => {

      if (!data.active) return;

      events.onChat('Network connected. Testing ping...');

      updateNetworkStatus('Connected');

      dom.oFormSubmit.disabled = false;

    },

    onDisconnect: () => {

      if (!data.active) return;

      events.onChat('Network connection closed.');

      updateNetworkStatus('Disconnected');

      events.onRemoteReady({ ready: false });

      // reset local state. TODO: preserve and re-send on reconnect?
      events.onReadyState(false);

      resetPlayerNames();
      
    },

    onNetworkError: (text) => {

      if (!data.active) return;

      events.onChat(`Unable to start network: ${text}`);
      updateNetworkStatus('Error');

    },

    onChat: (text, playerName) => {

      const item = document.createElement('p');

      Object.assign(item.style, {
        margin: '0px',
        padding: '0px'
      });

      // host or guest player name, if specified
      if (playerName !== undefined) {
        text = `<b>${playerName}</b>: ${common.basicEscape(text)}`
      }

      item.innerHTML = text;

      dom.oChatUI?.appendChild(item);

      const scroller = dom.oChatScroll;

      const { scrollHeight } = scroller;

      if (scrollHeight) {
        scroller.scrollTop = scrollHeight;
      }

    },

    onUpdatePrefs: (prefs) => {

      if (!dom.oForm) return;

      if (!prefs?.length) return;

      const isBatch = prefs.length > 1;

      prefs.forEach((pref) => {

        // note, value is boolean.
        let { name, value } = pref;

        // update the local model with the boolean.
        gamePrefs[name] = value;

        // stringify for the form.
        const formValue = boolToInt(value);

        // find all input(s) (radio + checkbox) with the given name, then check the value.
        // qSA() doesn't return a full array, rather a note list; hence, the spread.
        [...dom.oForm.querySelectorAll(`input[name="${name}"]`)].forEach((input) => {
          input.checked = input.value == formValue;
        });

        // select / option drop-downs.
        [...dom.oForm.querySelectorAll(`select[name="${name}"]`)].forEach((select) => {
          // find the matching entry and set its `selected` property.
          const option = select.querySelector(`option[value="${value}"]`);
          if (option) {
            option.selected = true;
            // hackish: update the local model, too.
            if (name === 'net_game_level') {
              selectLevel(value);
            }
          }
        });

        if (name === 'net_game_style') {
          // re-render, as we may need to show or hide vehicles.
          selectLevel(gamePrefs.net_game_level);
        }

        if (!isBatch) {

          events.onChat(`${gamePrefs.net_remote_player_name} changed ${name} to ${formValue}`);

          // if we were "ready" to start, we changed our mind - so, reset accordingly.
          events.onReadyState(false);

          if (game.data.started) {
            if (name === 'lock_step') {
              game.objects.notifications.add(`${gamePrefs.net_remote_player_name} ${formValue ? 'enabled' : 'disabled'} "lock step" game sync.`);
              // if disabled, ensure we aren't showing the spinner.
              if (!formValue) {
                game.objects.gameLoop.setWaiting(false);
              }
            } else if (name === 'ground_unit_traffic_control') {
              game.objects.notifications.add(`${gamePrefs.net_remote_player_name} ${formValue ? 'enabled' : 'disabled'} Ground Vehicle "Traffic Control."`);
            }
          }

        }

      });

      if (isBatch) {
        let name = gamePrefs.net_remote_player_name;
        events.onChat(`Received game preferences from ${name}`);
      }

    },

    onRemoteReady: (params) => {

      data.remoteReadyToStart = params.ready;

      // if they're ready and we're ready, then rock and roll; the game can start. 🎸🤘
      checkGameStart({ local: false });
     
    },

    onReadyState: (newState) => {

      if (game.data.started) return;

      if (!net.connected) {
        dom.oFormSubmit.disabled = true;  
      } else {
        dom.oFormSubmit.disabled = newState;
      }

      if (newState === data.readyToStart) return;

      data.readyToStart = newState;

      if (net.connected) {
        net.sendMessage({ type: 'REMOTE_READY', params: { ready: data.readyToStart }});
      }
      
      checkGameStart({ local: true });

    },

    onFormReset: () => {

      if (net.isGuest) {
        // hackish: reload, sans URL parameters because state is corrupted.
        window.location = `//${window.location.host}${window.location.pathname}`;
      } else {
        // reload for host as well, because network has already initialized,
        // the host peerJS state may be unknown and there could be connection trouble.
        window.location.reload();
      }

    },

    onFormSubmit: (e) => {

      // network case
      if (net.connected) {

        // ensure we apply prefs, whether started already or not.
        updatePrefs();

        // if the game is live, just dismiss.
        if (game.data.started) {

          hide();

        } else {

          let text;

          if (!data.remoteReadyToStart) {
            text = `${gamePrefs.net_player_name} is ready to start! Waiting on ${gamePrefs.net_remote_player_name}...`;
          } else {
            text = `${gamePrefs.net_player_name} is ready to start!`;
          }

          events.onChat(text);

          const params = [ text ];

          net.sendMessage({ type: 'CHAT', params });

          events.onReadyState(true);

        }

      } else {

        updatePrefs();
        writePrefsToStorage();
        hide();

      }

      e.preventDefault();
      return false;

    },

    optionsLinkOnClick: (e) => {

      show();
      e.preventDefault();
      return false;

    },

    onPrefChange: {

      sound: (isActive) => soundManager[isActive ? 'unmute' : 'mute'](),

      bnb: (isActive) => {

        // hackish: un-hide specific DOM elements
        // this is a workaround given "hidden by default" in HTML preventing a FOUC of sorts.
        ['tv-title-screen', 'mtv-bnb-in', 'bnb-vs'].forEach((id) => {
          const o = document.getElementById(id);
          if (o) o.style.visibility = 'visible';
        });

        // numerous UI updates
        utils.css.addOrRemove(document.body, isActive, 'bnb');

        // sprite coords may need updating
        [...game.objects.infantry, ...game.objects.engineer].forEach((ie) => ie.refreshHeight());

        if (!isActive) resetBNBSoundQueue();

        // before game start, user might open options menu and flip the pref.
        // update the game menu (start screen) UI if so.
        if (!game.data.started && data.active) {
          const vsCheckbox = document.getElementById('checkbox-vs');
          if (!vsCheckbox) return;
          vsCheckbox.checked = isActive;
        }

        if (isActive) {
          common.preloadVideo('desert_explosion');
        }

      },

      alt_smart_missiles: (isActive) => {

        if (!isActive) {
          game.objects.view.setMissileMode(defaultMissileMode);
        }
        
        utils.css.addOrRemove(document.body, !isActive, 'original_missile_mode');

      },

      ground_unit_traffic_control: (isActive) => {

        if (isActive) return;

        // make sure game has started, too.
        if (!game.data.started) return;

        // when "traffic control" is disabled, try and make sure all affected vehicles resume immediately.
        const types = common.pick(game.objects, TYPES.missileLauncher, TYPES.tank, TYPES.van);

        for (const type in types) {
          types[type].forEach((obj) => {
            // skip over tanks that may be legitimately stopped.
            if (obj.data.lastNearbyTarget) return;
            // otherwise, resume.
            if (obj.data.stopped) obj.data.stopped = false;
          });
        }

      },

      gravestones_helicopters: (isActive) => utils.css.addOrRemove(document.body, isActive, 'gravestones_helicopters'),
      gravestones_infantry: (isActive) => utils.css.addOrRemove(document.body, isActive, 'gravestones_infantry'),
      gravestones_vehicles: (isActive) => utils.css.addOrRemove(document.body, isActive, 'gravestones_vehicles'),

      weather: (type) => {

        if (!snowStorm) return;

        if (type && !snowStorm.active) {
          snowStorm.start();
          // hackish: kick off gameLoop, too, which is responsible for animation.
          game.objects.gameLoop.start();
        }

        effects.updateStormStyle(type);

        // update battlefield sprites
        if (game.objects.view) {
          utils.css.addOrRemove(game.objects.view.dom.battleField, type === 'snow', 'snow');
        }
      },

      show_inventory: (show) => utils.css.addOrRemove(dom.oStatsBar, !show, 'hide-inventory'),

      show_weapons_status: (show) => utils.css.addOrRemove(dom.oStatsBar, !show, 'hide-weapons-status'),

      show_keyboard_labels: (show) => utils.css.addOrRemove(dom.oStatsBar, !show, 'hide-keyboard-labels'),

      show_game_tips: (show) => {

        // prevent removal if in tutorial mode, which requires tips
        if (!show && tutorialMode) return;

        utils.css.addOrRemove(dom.oGameTips, show, 'active');
      
      },

      show_health_status: (newValue) => {

        // hackish: iterate over most objects, and force a redraw of health bars
        let targets = getTypes('tank, van, bunker, missileLauncher, infantry, parachuteInfantry, engineer, helicopter, balloon, smartMissile, endBunker, superBunker, turret', { group: 'all' });
        let forceUpdate = true;

        targets.forEach((target) => {

          game.objects[target.type].forEach((obj) => {

            // exit if unset or zero
            if (!obj?.data?.lastEnergy) return;

            // update immediately if pref is now "always" show, OR, "sometimes/never" and we have an energy DOM node present.
            if (newValue === PREFS.SHOW_HEALTH_ALWAYS || obj?.dom?.oEnergy) {
              sprites.updateEnergy(obj, forceUpdate);
            }

          });

        });

      },

      notifications_location: (newValue) => utils.css.addOrRemove(dom.oToasts, newValue === PREFS.NOTIFICATIONS_LOCATION_LEFT, 'left-aligned')

    },

    updateScreenScale: () => {

      const screenScale = game?.objects?.view?.data?.screenScale;

      if (!screenScale || !data.active || !dom.o) return;

      // CSS shenanigans: `zoom: 2` applied, so we offset that here where supported.
      let scale = screenScale * (game.objects.view.data.usingZoom || isSafari ? 0.5 : (isMobile ? 0.925 : 1));

      let body = dom.o.querySelector('.body');

      // hackish: compromise for lack of `zoom: 2` on mobile - but only specifically iPhone?
      // TODO: review and figure out. iPad seems to render without scaling, just fine.
      // https://developer.mozilla.org/en-US/docs/Web/API/Screen/orientation
      if (isMobile && screen.orientation.type.match(/landscape/i)) {
        scale *= 1.85;
        // hackish: scale up even further so the modal is more wide than anything else, and set height to the natural viewport.
        // in landscape, the modal contents will scroll naturally.
        if (isSafari) {
          scale *= 2;
        }
        body.style.setProperty('height', (worldHeight / 2) + 'px');
      } else {
        body.style.setProperty('height', data.originalHeight + 'px');
      }

      dom.o.style.setProperty('transform', `translate3d(-50%, -50%, 0px) scale3d(${scale},${scale},1)`);

    }

  };

  return {
    addGroupAndLevel,
    applyNewPrefs,
    init,
    ignoreURLParams,
    isActive,
    onChat: events.onChat,
    onConnect: events.onConnect,
    onDisconnect: events.onDisconnect,
    onNetworkError: events.onNetworkError,
    onRemoteReady: events.onRemoteReady,
    onUpdatePrefs: events.onUpdatePrefs,
    toggleDisplay,
    readPrefsFromStorage,
    readAndApplyPrefsFromStorage,
    show,
    updateForm,
    updateScreenScale: events.updateScreenScale,
    writePrefsToStorage
  };

}

export {
  gamePrefs,
  prefs,
  PREFS,
  PrefsManager
};