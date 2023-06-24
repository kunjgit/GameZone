/** @license BSD
 *
 * SoundManager 2: JavaScript Sound for the Web
 * ----------------------------------------------
 * https://schillmania.com/projects/soundmanager2/
 *
 * Copyright (c) 2007, Scott Schiller. All rights reserved.
 * Code provided under the BSD License:
 * https://schillmania.com/projects/soundmanager2/license.txt
 *
 * EXPERIMENTAL Web Audio API build.
 * Work in progress, made specifically for "Armor Alley."
 * 
 * V2.99a.20230303
 */

"use strict";

const msecScale = 1000;

// iOS devices if they report as such, e.g., iPad when "request mobile website" is selected (vs. desktop) - OR, if "touch support" exists(?)
const isMobile = navigator.userAgent.match(/mobile|iphone|ipad/i) || navigator?.maxTouchPoints > 0;

var soundManager = null;

/**
 * The SoundManager constructor.
 *
 * @constructor
 * @this {SoundManager}
 * @return {SoundManager} The new SoundManager instance
 */

function SoundManager() {

  function str(...args) {
    return args.join(',');
  }

  // alias
  this._wD = (...args) => {
    // if (args[0].match(/clone/i)) debugger;
    console.log(...args);
  }

  _wDS = function(...args) {
    console.log('_wDS', ...args);
  }

  /**
   * soundManager configuration options list
   * defines top-level configuration properties to be applied to the soundManager instance
   * to set these properties, use the setup() method - eg., soundManager.setup({debugMode: true, idPrefix: 'sound'})
   */

  this.setupOptions = {

    debugMode: true,                  // enable debugging output (console.log() with HTML fallback)
    useConsole: true,                 // use console.log() if available (otherwise, writes to #soundmanager-debug element)
    ignoreMobileRestrictions: true,   // if true, SM2 will not apply global HTML5 audio rules to mobile UAs. iOS > 7 and WebViews may allow multiple Audio() instances.
    html5Test: /^(probably|maybe)$/i, // HTML5 Audio() format support test. Use /^probably$/i; if you want to be more conservative.
    idPrefix: 'sound',                // if an id is not provided to createSound(), this prefix is used for generated IDs - 'sound0', 'sound1' etc.
    usePlaybackRate: false            // experimental Web Audio API feature, Firefox may choke when lots of audio instances use this.

  };

  this.defaultOptions = {

    /**
     * the default configuration for sound objects made with createSound() and related methods
     * eg., volume, auto-load behaviour and so forth
     */

    autoLoad: false,        // enable automatic loading (otherwise .load() will be called on demand with .play(), the latter being nicer on bandwidth - if you want to .load yourself, you also can)
    autoPlay: false,        // enable playing of file as soon as possible
    from: null,             // position to start playback within a sound (msec), default = beginning
    loops: 1,               // how many times to repeat the sound (position will wrap around to 0, setPosition() will break out of loop when >0)
    onid3: null,            // callback function for "ID3 data is added/available"
    onload: null,           // callback function for "load finished"
    onplay: null,           // callback for "play" start
    onpause: null,          // callback for "pause"
    onresume: null,         // callback for "resume" (pause toggle)
    whileplaying: null,     // callback during play (position update)
    onposition: null,       // object containing times and function callbacks for positions of interest
    onstop: null,           // callback for "user stop"
    onfinish: null,         // callback function for "sound finished playing"
    multiShot: true,        // let sounds "restart" or layer on top of each other when played multiple times, rather than one-shot/one at a time
    multiShotEvents: false, // fire multiple sound events (currently onfinish() only) when multiShot is enabled
    position: null,         // offset (milliseconds) to seek to within loaded sound data.
    playbackRate: 1.0,      // how "fast" the sound should be played. browsers may mute sound if values are outside of 0.25 to 4.0.
    preservesPitch: false,  // by default, work like a vinyl record or tape (vs. "time-stretch") when using `playbackRate`
    pan: 0,                 // "pan" settings, left-to-right, -100 to 100
    to: null,               // position to end playback within a sound (msec), default = end
    type: null,             // MIME-like hint for file pattern / canPlay() tests, eg. audio/mp3
    volume: 100             // self-explanatory. 0-100, the latter being the max.

  };

  this.audioFormats = {

    /**
     * determines HTML5 support for the given client.
     */

    mp3: {
      type: ['audio/mpeg; codecs="mp3"', 'audio/mpeg', 'audio/mp3', 'audio/MPA', 'audio/mpa-robust']
    },

    mp4: {
      related: ['aac','m4a','m4b'], // additional formats under the MP4 container
      type: ['audio/mp4; codecs="mp4a.40.2"', 'audio/aac', 'audio/x-m4a', 'audio/MP4A-LATM', 'audio/mpeg4-generic']
    },

    ogg: {
      type: ['audio/ogg; codecs=vorbis']
    },

    opus: {
      type: ['audio/ogg; codecs=opus', 'audio/opus']
    },

    wav: {
      type: ['audio/wav; codecs="1"', 'audio/wav', 'audio/wave', 'audio/x-wav']
    }

  };

  // dynamic attributes

  this.versionNumber = 'V2.99a.20230202';
  this.version = this.versionNumber;
  this.enabled = false;
  this.sounds = {};
  this.soundIDs = [];
  this.muted = false;
  
  /**
   * format support
   * stores canPlayType() results based on audioFormats.
   * eg. { mp3: boolean, mp4: boolean }
   * treat as read-only.
   */

  this.html5 = {};

  // a few private internals

  var _wDS;

  var SMSound,
  sm2 = this,
  sm = 'soundManager',
  doNothing,
  setProperties,
  disabled = false,
  mixin,
  assign,
  extraOptions,
  disableObject,
  complain,
  idCheck,
  parseURL,
  html5OK,
  html5CanPlay,
  html5Ext,
  testHTML5,
  idCounter = 0;

  this.mimePattern = /^\s*audio\/(?:x-)?(?:mp(?:eg|3))\s*(?:$|;)/i; // default mp3 set

  /**
   * basic HTML5 Audio() support test
   * try...catch because of IE 9 "not implemented" nonsense
   * https://github.com/Modernizr/Modernizr/issues/224
   */

  this.hasHTML5 = (() => {
    try {
      return Audio && new Audio().canPlayType !== undefined;
    } catch(e) {
      return false;
    }
  })();

  function all(methodName, ...params) {
    // convenience: on all SMSound objects, call a given method, and pass-thru arguments.
    return sm2.soundIDs.forEach((soundId) => sm2.sounds[soundId]?.[methodName](...params));
  }
  
  /**
   * Public SoundManager API
   * -----------------------
   */

  /**
   * Configures top-level soundManager properties.
   *
   * @param {object} options Option parameters, eg. { debugMode: true, idPrefix: 'mySound' }
   * @return {object} soundManager The current soundManager instance.
   */

  this.setup = (options) => {

    assign(options);

    return sm2;

  };

  this.ok = () => sm2.html5;

  /**
   * Creates a SMSound sound object instance. Can also be overloaded, e.g., createSound('mySound', '/some.mp3');
   *
   * @param {object} oOptions Sound options (at minimum, url parameter is required.)
   * @return {object} SMSound The new SMSound object.
   */

  this.createSound = (oOptions, _url) => {

    var cs, options, oSound = null;

    cs = sm;

    if (!sm2.ok()) {
      complain(cs + '.createSound(): Missing or incomplete Audio() support?');
      return false;
    }

    if (_url) {
      // function overloading in JS! :) ... assume simple createSound(id, url) use case.
      oOptions = {
        'id': oOptions,
        'url': _url
      };
    }

    // inherit from defaultOptions
    options = mixin(oOptions);

    options.url = parseURL(options.url);

    // generate an id, if needed.
    if (options.id === undefined) {
      options.id = sm2.setupOptions.idPrefix + (idCounter++);
    }

    if (sm2.debugMode) sm2._wD(cs + options.id + (options.url ? ' (' + options.url + ')' : ''), 1);

    if (idCheck(options.id, true)) {
      if (sm2.debugMode) sm2._wD(cs + options.id + ' exists', 1);
      return sm2.sounds[options.id];
    }

    function make() {

      sm2.sounds[options.id] = new SMSound(options);
      sm2.soundIDs.push(options.id);
      return sm2.sounds[options.id];

    }

    if (html5OK(options)) {

      oSound = make();
      oSound._setup_html5(options);

    } else {

      if (sm2.debugMode) sm2._wD(options.id + ': No HTML5 support for this sound?');
      return make();

    }

    return oSound;

  };

  /**
   * Destroys a SMSound sound object instance.
   *
   * @param {string} sID The ID of the sound to destroy
   */

  this.destroySound = (sID, _bFromSound) => {

    // explicitly destroy a sound before normal page unload, etc.

    if (!idCheck(sID)) return;

    var oS = sm2.sounds[sID], i;

    oS.stop();
    
    // Disable all callbacks after stop(), when the sound is being destroyed
    oS._iO = {};
    
    for (i = 0; i < sm2.soundIDs.length; i++) {
      if (sm2.soundIDs[i] === sID) {
        sm2.soundIDs.splice(i, 1);
        break;
      }
    }

    if (!_bFromSound) {
      // ignore if being called from SMSound instance
      oS.destruct(true);
    }

    // whether destroyed or not, ensure we unload and reset properties.
    oS.unload();

    oS = null;
    delete sm2.sounds[sID];

    return true;

  };

  /**
   * Calls the load() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @param {object} oOptions Optional: Sound options
   */

  this.load = (sID, oOptions) => sm2.sounds[sID]?.load(oOptions);

  /**
   * Calls the unload() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   */

  this.unload = (sID) => sm2.sounds[sID]?.unload();

  /**
   * Calls the onPosition() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @param {number} nPosition The position to watch for
   * @param {function} oMethod The relevant callback to fire
   * @param {object} oScope Optional: The scope to apply the callback to
   * @return {SMSound} The SMSound object
   */

  this.onPosition = (sID, nPosition, oMethod, oScope) => sm2.sounds[sID]?.onposition(nPosition, oMethod, oScope);

  /**
   * Calls the clearOnPosition() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @param {number} nPosition The position to watch for
   * @param {function} oMethod Optional: The relevant callback to fire
   * @return {SMSound} The SMSound object
   */

  this.clearOnPosition = (sID, nPosition, oMethod) => sm2.sounds[sID]?.clearOnPosition(nPosition, oMethod);

  /**
   * Calls the play() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @param {object} oOptions Optional: Sound options
   * @return {SMSound} The SMSound object
   */

  this.play = (sID, oOptions) => {

    var result = null,
        // legacy function-overloading use case: play('mySound', '/path/to/some.mp3');
        overloaded = (oOptions && !(oOptions instanceof Object));

    if (!idCheck(sID, overloaded)) {

      if (!overloaded) {
        // no sound found for the given ID. Bail.
        return false;
      } else {
        oOptions = {
          url: oOptions
        };
      }

      if (oOptions && oOptions.url) {
        // overloading use case, create+play: .play('someID', {url:'/path/to.mp3'});
        if (sm2.debugMode) sm2._wD(sm + '.play(): Attempting to create "' + sID + '"', 1);
        oOptions.id = sID;
        result = sm2.createSound(oOptions).play();
      }

    } else if (overloaded) {

      // existing sound object case
      oOptions = {
        url: oOptions
      };

    }

    if (result === null) {
      // default case
      result = sm2.sounds[sID].play(oOptions);
    }

    return result;

  };

  /**
   * Calls the setPosition() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @param {number} nMsecOffset Position (milliseconds)
   * @return {SMSound} The SMSound object
   */

  this.setPosition = (sID, nMsecOffset) => sm2.sounds[sID]?.setPosition(nMsecOffset);

  /**
   * Calls the stop() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @return {SMSound} The SMSound object
   */

  this.stop = (sID) => sm2.sounds[sID]?.stop();

  /**
   * Stops all currently-playing sounds.
   */

  this.stopAll = () => all('stop');

  /**
   * Calls the pause() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @return {SMSound} The SMSound object
   */

  this.pause = (sID) => sm2.sounds[sID]?.pause();

  /**
   * Pauses all currently-playing sounds.
   */

  this.pauseAll = () => all('pause');

  /**
   * Calls the resume() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @return {SMSound} The SMSound object
   */

  this.resume = (sID) => sm2.sounds[sID]?.resume();

  /**
   * Resumes all currently-paused sounds.
   */

  this.resumeAll = () => all('resume');

  /**
   * Calls the togglePause() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @return {SMSound} The SMSound object
   */

  this.togglePause = (sID) => sm2.sounds[sID]?.togglePause();

  /**
   * Calls the setPan() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @param {number} nPan The pan value (-100 to 100)
   * @return {SMSound} The SMSound object
   */

  this.setPan = (sID, nPan) => sm2.sounds[sID]?.setPan(nPan);

  /**
   * Calls the setVolume() method of a SMSound object by ID
   * Overloaded case: pass only volume argument eg., setVolume(50) to apply to all sounds.
   *
   * @param {string} sID The ID of the sound
   * @param {number} nVol The volume value (0 to 100)
   * @return {SMSound} The SMSound object
   */

  this.setVolume = (sID, nVol) => {

    // if sID is actually a number, e.g., setVolume(50) function overloading case, apply to all sounds
    if (sID && !isNaN(sID) && nVol === undefined) {
      all('setVolume');
      return;
    }

    // setVolume('mySound', 50) case
    return sm2.sounds[sID]?.setVolume(nVol);

  };

  /**
   * Calls the setPlaybackRate() method of a SMSound object by ID
   *
   * @param {string} sID The ID of the sound
   * @param {number} nPlaybackRate The playback rate. Values outside of 0.25 to 4.0 may cause the browser to mute the sound.
   * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate
   * @return {SMSound} The SMSound object
   */

  this.setPlaybackRate = (sID, nPlaybackRate) => sm2.sounds[sID]?.setPlaybackRate(nPlaybackRate);

  /**
   * Calls the mute() method of either a single SMSound object by ID, or all sound objects.
   *
   * @param {string} sID Optional: The ID of the sound (if omitted, all sounds will be used.)
   */

  this.mute = (sID) => {

    if (sID) {
      if (sm2.debugMode) sm2._wD(sm + '.mute(): Muting "' + sID + '"');
      return sm2.sounds[sID]?.mute();
    }

    if (sm2.debugMode) sm2._wD(sm + '.mute(): Muting all sounds');
    all('mute');
    sm2.muted = true;

  };

  /**
   * Calls the unmute() method of either a single SMSound object by ID, or all sound objects.
   *
   * @param {string} sID Optional: The ID of the sound (if omitted, all sounds will be used.)
   */

  this.unmute = (sID) => {

    if (sID) {
      if (sm2.debugMode) sm2._wD(sm + '.unmute(): Unmuting "' + sID + '"');
      return sm2.sounds[sID]?.unmute();
    }

    if (sm2.debugMode) sm2._wD(sm + '.unmute(): Unmuting all sounds');
    all('unmute');
    sm2.muted = false;

  };

  /**
   * Calls the toggleMute() method of a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @return {SMSound} The SMSound object
   */

  this.toggleMute = (sID) => sm2.sounds[sID]?.toggleMute();

  /**
   * Undocumented: NOPs soundManager and all SMSound objects.
   */

  this.disable = () => {

    // destroy all methods, once.
    if (disabled) return false;

    disabled = true;

    sm2.soundIDs.forEach((soundID) => disableObject(sm2.sounds[soundID]));

    // ask not for whom the bell tolls. ;)
    disableObject(sm2);
    
    return true;

  };

  /**
   * Determines playability of a MIME type, eg. 'audio/mp3'.
   */

  this.canPlayMIME = (sMIME) => html5CanPlay({ type: sMIME });

  /**
   * Determines playability of a URL based on audio support.
   *
   * @param {string} sURL The URL to test
   * @return {boolean} URL playability
   */

  this.canPlayURL = (sURL) => html5CanPlay({ url: sURL });

  /**
   * Determines playability of an HTML DOM object (or similar object literal) based on audio support.
   *
   * @param {object} oLink an HTML DOM object or object literal including href and/or type attributes
   * @return {boolean} URL playability
   */

  this.canPlayLink = (oLink) => {

    if (oLink.type && sm2.canPlayMIME(oLink.type)) return true;

    return sm2.canPlayURL(oLink.href);

  };

  /**
   * Retrieves a SMSound object by ID.
   *
   * @param {string} sID The ID of the sound
   * @return {SMSound} The SMSound object
   */

  this.getSoundById = (sID, _suppressDebug) => {

    if (!sID) return null;

    var result = sm2.sounds[sID];

    if (!result && !_suppressDebug) {
      if (sm2.debugMode) sm2._wD(sm + '.getSoundById(): Sound "' + sID + '" not found.', 2);
    }

    return result;

  };

  this.destroyAllSounds = () => all('destruct');

  this.onready = (method, scope) => {
    // immediate callback, provided we are OK.
    if (!sm2.ok()) {
      console.warn('SoundManager 2: Missing or incomplete Audio() support?');
      return;
    }
    method?.apply(scope);
  }

  /**
   * Destroys the SoundManager instance and all SMSound instances.
   */

  this.destruct = () => {

    if (sm2.debugMode) sm2._wD(sm + '.destruct()');
    sm2.disable(true);

  };

  /**
   * SMSound() (sound object) constructor
   * -------------------------------------------
   *
   * @param {object} oOptions Sound options (id and url are required attributes)
   * @return {SMSound} The new SMSound object
   */

  SMSound = function(oOptions) {

    var s = this, resetProperties, attachOnPosition, onplay_called = false, onPositionItems = [], onPositionFired = 0, detachOnPosition, lastURL = null, lastHTML5State;

    lastHTML5State = {
      // tracks duration + position (time)
      duration: null,
      time: null
    };

    this.id = oOptions.id;

    // legacy
    this.sID = this.id;

    this.url = oOptions.url;
    this.options = mixin(oOptions);

    // per-play-instance-specific options
    this.instanceOptions = this.options;

    // short alias
    this._iO = this.instanceOptions;

    // assign property defaults
    this.pan = this.options.pan;
    this.volume = this.options.volume;

    // whether or not this object is using HTML5
    this.isHTML5 = true;

    // internal HTML5 Audio() object reference
    this._a = null;

    /**
     * Begins loading a sound per its *url*.
     *
     * @param {object} oOptions Optional: Sound options
     * @return {SMSound} The SMSound object
     */

    this.load = (oOptions) => {

      var oSound = null, instanceOptions;

      if (oOptions) {
        s._iO = mixin(oOptions, s.options);
      } else {
        oOptions = s.options;
        s._iO = oOptions;
        if (lastURL && lastURL !== s.url) {
          _wDS('manURL');
          s._iO.url = s.url;
          s.url = null;
        }
      }

      if (!s._iO.url) {
        s._iO.url = s.url;
      }

      s._iO.url = parseURL(s._iO.url);

      // ensure we're in sync
      s.instanceOptions = s._iO;

      // local shortcut
      instanceOptions = s._iO;

      if (sm2.debugMode) sm2._wD(s.id + ': load (' + instanceOptions.url + ')');

      if (!instanceOptions.url && !s.url) {
        if (sm2.debugMode) sm2._wD(s.id + ': load(): url is unassigned. Exiting.', 2);
        return s;
      }

      // reset a few state properties

      s.loaded = false;
      s.readyState = 1;
      s.playState = 0;

      if (html5OK(instanceOptions)) {

        oSound = s._setup_html5(instanceOptions);

        if (!oSound._called_load) {

          s._html5_canplay = false;

          // if url provided directly to load(), assign it here.

          if (s.url !== instanceOptions.url) {

            if (sm2.debugMode) sm2._wD(_wDS('manURL') + ': ' + instanceOptions.url);

            s._a.src = instanceOptions.url;

            // modern fetch and play
            loadWebAudioSound(s, instanceOptions.url, (buffer) => s?._webAudioOnLoad(buffer));

            // TODO: review / re-apply all relevant options (volume, loop, onposition etc.)

            // reset position for new URL
            s.setPosition(0);

          }

          s._called_load = true;

        } else {

          if (sm2.debugMode) sm2._wD(s.id + ': Ignoring request to load again');

        }

      }

      // after all of this, ensure sound url is up to date.
      s.url = instanceOptions.url;

      return s;

    };

    /**
     * Unloads a sound, canceling any open HTTP requests.
     *
     * @return {SMSound} The SMSound object
     */

    this.unload = () => {

      if (s.readyState !== 0) {

        if (sm2.debugMode) sm2._wD(`${s.id}: unload()`);

        if (s._a) {

          s._a.pause();

        }

        // reset load/status flags
        resetProperties();

      }

      return s;

    };

    /**
     * Unloads and destroys a sound.
     */

    this.destruct = (_bFromSM) => {

      // this shouldn't happen.
      if (!s) return;

      if (sm2.debugMode) sm2._wD(s.id + ': destruct');

      if (s._a) {

        if (s.source) {
          s.source.disconnect();
          s.source = null;
          s.biquadFilter = null;
          s.gainNode = null;
          s.panNode = null;
        }

        s._called_load = false;
        
        // break obvious circular reference
        s._a._s = null;

        s._a = null;

      }

      if (!_bFromSM) {
        // ensure deletion from controller
        sm2.destroySound(s.id, true);
      }

      // disable own methods
      disableObject(s);

      s = null;

    };

    /**
     * Begins playing a sound.
     *
     * @param {object} oOptions Optional: Sound options
     * @return {SMSound} The SMSound object
     */

    this.play = (oOptions = {}, _updatePlayState = true) => {

      var fN, allowMulti, a,
          audioClone,
          exit = null;

      fN = s.id + ': play(): ';

      // first, use local URL (if specified)
      if (s.url) {
        s._iO.url = s.url;
      }

      // mix in any options defined at createSound()
      s._iO = mixin(s._iO, s.options);

      // mix in any options specific to this method
      s._iO = mixin(oOptions, s._iO);

      s._iO.url = parseURL(s._iO.url);

      s.instanceOptions = s._iO;

      if (html5OK(s._iO)) {
        s._setup_html5(s._iO);
      }

      if (s.playState === 1 && !s.paused) {

        allowMulti = s._iO.multiShot;

        if (!allowMulti) {

          if (sm2.debugMode) sm2._wD(fN + 'Already playing (one-shot)', 1);

          if (s.isHTML5) {

            // go back to original position.
            s.setPosition(s._iO.position);

            // hackish: update playbackRate, which may have changed.
            s.setPlaybackRate(s._iO.playbackRate, true);

          }

          exit = s;

        } else {

          if (sm2.debugMode) sm2._wD(fN + 'Already playing (multi-shot)', 1);

        }

      }

      if (exit !== null) {
        return exit;
      }

      // edge case: play() with explicit URL parameter
      if (oOptions.url && oOptions.url !== s.url) {

        // load using merged options
        s.load(s._iO);

      }

      if (!s.loaded) {

        if (s.readyState === 0) {

          if (sm2.debugMode) sm2._wD(fN + 'Attempting to load');

          // iOS needs this when recycling sounds, loading a new URL on an existing object.
          s.load(s._iO);

          // HTML5 hack - re-set instanceOptions?
          s.instanceOptions = s._iO;

        } else if (s.readyState === 2) {

          if (sm2.debugMode) sm2._wD(fN + 'Could not load - exiting', 2);
          exit = s;

        } else {

          if (sm2.debugMode) sm2._wD(fN + 'Loading - attempting to play...');

        }

      } else {

        // "play()"
        if (sm2.debugMode) sm2._wD(fN.substr(0, fN.lastIndexOf(':')));

      }

      s.setPlaybackRate(s._iO.playbackRate, true);

      if (exit !== null) {
        return exit;
      }

      if (s.paused && s.position >= 0) {

        // https://gist.github.com/37b17df75cc4d7a90bf6
        if (sm2.debugMode) sm2._wD(fN + 'Resuming from paused state', 1);
        s.resume();

      } else {

        s._iO = mixin(oOptions, s._iO);

        // if (sm2.debugMode) sm2._wD(fN + 'Starting to play');

        // increment instance counter, where enabled + supported
        s.instanceCount++;

        // if first play and onposition parameters exist, apply them now
        if (s._iO.onposition && s.playState === 0) {
          attachOnPosition(s);
        }

        s.playState = 1;
        s.paused = false;

        s.position = (s._iO.position && !isNaN(s._iO.position) ? s._iO.position : 0);

        s.setVolume(s._iO.volume, true);
        s.setPan(s._iO.pan, true);
        s.setPlaybackRate(s._iO.playbackRate, true);

        if (s.instanceCount < 2) {

          // HTML5 single-instance case

          a = s._setup_html5();

          s.setPosition(s._iO.position);

          // 01/2022: prefixes for best compatibility
          if (audioContext && sm2.usePlaybackRate) {
            a.preservesPitch = a.mozPreservesPitch = a.webkitPreservesPitch = !!s._iO.preservesPitch;
          }

          // a.play();
          loadWebAudioSound(s, s._iO.url, (buffer) => s?._webAudioOnLoad(buffer));

        } else {

          // HTML5 multi-shot case

          if (s._iO.onplay && _updatePlayState && !onplay_called) {
            s._iO.onplay.apply(s, [s]);
            onplay_called = true;
          }

          // console.log(s.id + ': Cloning Audio() for instance #' + s.instanceCount + '...')

          if (sm2.debugMode) sm2._wD(s.id + ': Cloning Audio() for instance #' + s.instanceCount + '...');

          var cloneId = s.id + '_clone_' + s.instanceCount;

          const cloneOnFinish = () => {

            if (s?._iO?.onfinish && s._iO.multiShotEvents) {
              /**
               * Incredibly hackish: ensure we don't get stuck in a loop.
               * s._iO.onfinish() might lead back to this method, which
               * is ridiculous and needs to be fixed properly.
               */
              if (!s._iO.onfinishCalled) {
                s._iO.onfinishCalled = true;
                // apply "original" onfinish, scoped to clone.
                s._iO.onfinish.apply(audioClone, [audioClone]);
              }
            }

            // have the clone take itself out.
            if (audioClone) {
              audioClone.destruct();
              audioClone = null;
            }
            
          }

          // make a new sound - inheriting most properties, resetting only the basics
          var cloneParams = {
            ...s._iO,
            id: cloneId,
            instanceCount: 0,
            multiShot: false,
            onfinish: cloneOnFinish
          };

          audioClone = soundManager.createSound(cloneParams);

          audioClone.play();

          // return the clone, so it can be accessed
          if (s._iO.multiShotEvents) {
            return audioClone;
          }

        }

      }

      return s;

    };

    /**
     * Stops playing a sound (and optionally, all sounds)
     *
     * @param {boolean} bAll Optional: Whether to stop all sounds
     * @return {SMSound} The SMSound object
     */

    this.stop = () => {

      var instanceOptions = s._iO,
          originalPosition;

      // console.log('SM2: sound.stop: ' + s.id, s);

      if (s.playState !== 1) return s;

      if (sm2.debugMode) sm2._wD(s.id + ': stop()');

      s._resetOnPosition(0);
      s.paused = false;

      if (!s.isHTML5) {
        s.playState = 0;
      }

      // remove onPosition listeners, if any
      detachOnPosition();

      // and "to" position, if set
      if (instanceOptions.to) {
        s.clearOnPosition(instanceOptions.to);
      }

      if (s._a) {

        originalPosition = s.position;

        s.setPosition(0);

        s.position = originalPosition;

        // only stop if we started playback; otherwise, runtime error.
        if (s._startTime) {
          s._a.stop();
        } else {
          // console.warn('SM2: stop() called, but no _startTime?', s);
        }

        s.playState = 0;

        // and update UI
        s._onTimer();

      }

      resetSoundState(s);

      // IMPORTANT: reset so this sound can play again
      s.playCount = 0;

      s.instanceCount = 0;
      s._iO = {};

      if (instanceOptions.onstop) {
        instanceOptions.onstop.apply(s, [s]);
      }

      return s;

    };

    /**
     * Sets the position of a sound.
     *
     * @param {number} nMsecOffset Position (milliseconds)
     * @return {SMSound} The SMSound object
     */

    this.setPosition = (nMsecOffset = 0) => {

      var position1K,
          // Use the duration from the instance options, if we don't have a track duration yet.
          // position >= 0 and <= current available (loaded) duration
          offset = Math.max(nMsecOffset, 0);

      s.position = offset;
      position1K = s.position/msecScale;
      s._resetOnPosition(s.position);
      s._iO.position = offset;

      if (!s._a) return s;

      // Set the position in the canplay handler if the sound is not ready yet
      if (s._html5_canplay) {

        if (s._a.currentTime !== position1K) {

          /**
           * DOM/JS errors/exceptions to watch out for:
           * if seek is beyond (loaded?) position, "DOM exception 11"
           * "INDEX_SIZE_ERR": DOM exception 1
           */
          if (sm2.debugMode) sm2._wD(s.id + ': setPosition(' + position1K + ')');

          try {
            s._a.currentTime = position1K;
            if (s.playState === 0 || s.paused) {
              // allow seek without auto-play/resume
              s._a.pause();
            }
          } catch(e) {
            if (sm2.debugMode) sm2._wD(s.id + ': setPosition(' + position1K + ') failed: ' + e.message, 2);
          }

        }

      } else if (position1K) {

        // warn on non-zero seek attempts
        if (sm2.debugMode) sm2._wD(s.id + ': setPosition(' + position1K + '): Cannot seek yet, sound not ready', 2);
        return s;

      }

      if (s.paused) {

        // if paused, refresh UI right away by forcing update
        s._onTimer(true);

      }

      return s;

    };

    /**
     * Pauses sound playback.
     *
     * @return {SMSound} The SMSound object
     */

    this.pause = () => {

      if (s.paused || (s.playState === 0 && s.readyState !== 1)) {
        return s;
      }

      if (sm2.debugMode) sm2._wD(s.id + ': pause()');
      s.paused = true;

      s._setup_html5(); // .pause();

      // TODO: this may not be needed.
      s._pauseTime = audioContext.currentTime;

      if (s._iO.onpause) {
        s._iO.onpause.apply(s, [s]);
      }

      return s;

    };

    /**
     * Resumes sound playback.
     *
     * @return {SMSound} The SMSound object
     */

    this.resume = () => {

      var instanceOptions = s._iO;

      if (!s.paused) return s;

      if (sm2.debugMode) sm2._wD(s.id + ': resume()');
      s.paused = false;
      s.playState = 1;

      s._startTime = audioContext.currentTime;

      s._setup_html5().play();

      if (!onplay_called && instanceOptions.onplay) {

        instanceOptions.onplay.apply(s, [s]);
        onplay_called = true;

      } else if (instanceOptions.onresume) {

        instanceOptions.onresume.apply(s, [s]);

      }

      return s;

    };

    /**
     * Toggles sound playback.
     *
     * @return {SMSound} The SMSound object
     */

    this.togglePause = () => {

      if (sm2.debugMode) sm2._wD(s.id + ': togglePause()');

      if (s.playState === 0) {
        s.play({ position: (s.position / msecScale) });
      } else if (s.paused) {
        s.resume();
      } else {
        s.pause();
      }

      return s;

    };

    /**
     * Sets the panning (L-R) effect.
     *
     * @param {number} nPan The pan value (-100 to 100)
     * @return {SMSound} The SMSound object
     */

    this.setPan = (nPan = 0, bInstanceOnly = false) => {

      if (s.panNode && s._lastPan !== nPan) {

        s.panNode.pan.value = nPan;
        s._lastPan == nPan;

        // ARMOR ALLEY prototype / feature hack
        if (s.biquadFilter) {
          // sounds further away get more of a low-pass filter applied.
          var filterFreq = Math.min(22050, Math.max(888, 22050 - (22050 * Math.abs(nPan) * 2)));
          // s.biquadFilter.frequency.setValueAtTime(nPan === 0 ? 22050 : filterFreq, audioContext.currentTime);
          s.biquadFilter.frequency.value = filterFreq;
        }

      }

      s._iO.pan = nPan;

      if (!bInstanceOnly) {
        s.pan = nPan;
        s.options.pan = nPan;
      }

      return s;

    };

    /**
     * Sets the `playbackRate` of a sound.
     *
     * @param {number} nPlaybackRate The playback rate. Values outside of 0.25 to 4.0 may cause the browser to mute the sound.
     * https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/playbackRate
     * @return {SMSound} The SMSound object
     */

    this.setPlaybackRate = (nPlaybackRate, _bInstanceOnly) => {

      if (nPlaybackRate === undefined || isNaN(nPlaybackRate)) {
        return s;
      }

      s._iO.playbackRate = nPlaybackRate;

      if (!_bInstanceOnly) {
        s.playbackRate = nPlaybackRate;
        s.options.playbackRate = nPlaybackRate;
      }

      if (sm2.usePlaybackRate && s._a) {
        if (audioContext) {
          s._a.playbackRate.value = nPlaybackRate;
        } else {
          s._a.playbackRate = nPlaybackRate;
        }
      }

      return s;

    }

    /**
     * Sets the volume.
     *
     * @param {number} nVol The volume value (0 to 100)
     * @return {SMSound} The SMSound object
     */

    this.setVolume = (nVol = 100, _bInstanceOnly = false) => {

      var newVol;
      var computedVol;
      
      if (s._a) {

        if (sm2.muted && !s.muted) {
          s.muted = true;
          s._a.muted = true;
        }

        if (s.gainNode) {

          // valid range for Web Audio API gainNode: 0 - 2.
          newVol = Math.max(0, Math.min(2, nVol / 100));

          // if muted, "mark it zero." reflect real volume to user, though.
          computedVol = s.muted ? 0 : newVol;

          if (s._lastVolume !== computedVol) {
            s.gainNode.gain.value = computedVol;
            s._lastVolume = computedVol;
          }

        } else {

          // valid range for native HTML5 Audio(): 0-1
          s._a.volume = Math.max(0, Math.min(1, nVol / 100));

        }

      }

      s._iO.volume = nVol;

      if (!_bInstanceOnly) {
        s.volume = nVol;
        s.options.volume = nVol;
      }

      return s;

    };

    /**
     * Mutes the sound.
     *
     * @return {SMSound} The SMSound object
     */

    this.mute = () => {

      s.muted = true;

      if (s._a) {
        // s._a.muted = true;
        if (s.gainNode) {
          s.gainNode.gain.value = 0;
        } else {
          console.warn('mute: WTF no gainNode?', s);
        }
      }

      return s;

    };

    /**
     * Unmutes the sound.
     *
     * @return {SMSound} The SMSound object
     */

    this.unmute = () => {

      s.muted = false;

      if (s._a) {
        s._a.muted = false;
      }

      return s;

    };

    /**
     * Toggles the muted state of a sound.
     *
     * @return {SMSound} The SMSound object
     */

    this.toggleMute = () => s.muted ? s.unmute() : s.mute();

    /**
     * Registers a callback to be fired when a sound reaches a given position during playback.
     *
     * @param {number} nPosition The position to watch for
     * @param {function} oMethod The relevant callback to fire
     * @param {object} oScope Optional: The scope to apply the callback to
     * @return {SMSound} The SMSound object
     */

    this.onPosition = (nPosition, oMethod, oScope) => {

      // TODO: basic dupe checking?

      onPositionItems.push({
        position: parseInt(nPosition, 10),
        method: oMethod,
        scope: (oScope ? oScope : s),
        fired: false
      });

      return s;

    };

    /**
     * Removes registered callback(s) from a sound, by position and/or callback.
     *
     * @param {number} nPosition The position to clear callback(s) for
     * @param {function} oMethod Optional: Identify one callback to be removed when multiple listeners exist for one position
     * @return {SMSound} The SMSound object
     */

    this.clearOnPosition = (nPosition, oMethod) => {

      var i;

      nPosition = parseInt(nPosition, 10);

      if (isNaN(nPosition)) {
        // safety check
        return false;
      }

      for (i = 0; i < onPositionItems.length; i++) {

        if (nPosition === onPositionItems[i].position) {
          // remove this item if no method was specified, or, if the method matches
          
          if (!oMethod || (oMethod === onPositionItems[i].method)) {
            
            if (onPositionItems[i].fired) {
              // decrement "fired" counter, too
              onPositionFired--;
            }
            
            onPositionItems.splice(i, 1);
          
          }
        
        }

      }

    };

    this._processOnPosition = () => {

      var i, item, j = onPositionItems.length;

      if (!j || !s.playState || onPositionFired >= j) return false;

      for (i = j - 1; i >= 0; i--) {
        
        item = onPositionItems[i];
        
        if (!item.fired && s.position >= item.position) {
        
          item.fired = true;
          onPositionFired++;
          item.method.apply(item.scope, [item.position]);
        
          //  reset j -- onPositionItems.length can be changed in the item callback above... occasionally breaking the loop.
          j = onPositionItems.length;
        
        }
      
      }

      return true;

    };

    this._resetOnPosition = (nPosition) => {

      // reset "fired" for items interested in this position
      var i, item, j = onPositionItems.length;

      if (!j) return false;

      for (i = j - 1; i >= 0; i--) {
        
        item = onPositionItems[i];
        
        if (item.fired && nPosition <= item.position) {
          item.fired = false;
          onPositionFired--;
        }
      
      }

      return true;

    };

    /**
     * SMSound() private internals
     * --------------------------------
     */

    attachOnPosition = () => {

      var item,
          op = s._iO.onposition;

      // attach onposition things, if any, now.

      if (op) {

        for (item in op) {
          s.onPosition(parseInt(item, 10), op[item]);
        }

      }

    };

    detachOnPosition = () => {

      var item,
          op = s._iO.onposition;

      // detach any onposition()-style listeners.

      if (op) {

        for (item in op) {
          s.clearOnPosition(parseInt(item, 10));
        }

      }

    };

    resetProperties = (retainPosition) => {

      if (!retainPosition) {
        onPositionItems = [];
        onPositionFired = 0;
      }

      onplay_called = false;

      if (s._a) s._a._s = null; // 10/12/2021 - TODO: review, see if this breaks anything

      s._a = null;

      s._html5_canplay = false;
      s.bytesLoaded = null;
      s.bytesTotal = null;
      s.duration = (s._iO && s._iO.duration ? s._iO.duration : null);
      s.durationEstimate = null;
      s.buffered = [];

      s.failures = 0;
      s.isBuffering = false;
      s.instanceOptions = {};
      s.instanceCount = 0;
      s.loaded = false;

      // 0 = uninitialised, 1 = loading, 2 = failed/error, 3 = loaded/success
      s.readyState = 0;

      s.muted = false;
      s.paused = false;

      s.playState = 0;
      s.position = null;

    };

    resetProperties();

    /**
     * Pseudo-private SMSound internals
     * --------------------------------
     */

    this._onTimer = () => {

      /**
       * HTML5-only _whileplaying() etc.
       * called from both HTML5 native events, and polling/interval-based timers
       */

      if (!s._a || s.paused || !s.playState || !s.readyState) return;

      var duration, isNew = false, time, x = {};

      duration = s._get_html5_duration();

      if (duration !== lastHTML5State.duration) {

        lastHTML5State.duration = duration;
        s.duration = duration;
        isNew = true;

      }

      // TODO: investigate why this goes wack if not set/re-set each time.
      s.durationEstimate = s.duration;

      time = (audioContext.currentTime - s._startTime + (s._offset || 0)) * msecScale; // (s._a.currentTime * msecScale || 0);

      if (time !== lastHTML5State.time) {

        lastHTML5State.time = time;
        isNew = true;

      }

      if (isNew) {

        s._whileplaying(time, x, x, x, x);

      }

      return isNew;

    };

    // TODO: eliminate?
    this._get_html5_duration = () => s.duration;

    this._webAudioOnLoad = (buffer) => {

      if (!buffer) {
        console.log('webAudioOnLoad: fail?', buffer);
        return;
      }

      // console.log('_webAudioOnLoad: OK', s.id);
      // s._onload(true);

      // seconds -> msec
      s.duration = (buffer.duration || 0) * msecScale;

      // TODO: review
      s._html5_canplay = true;

      playSoundFromBuffer(s, buffer);

    }

    this._setup_html5 = (oOptions) => {

      var instanceOptions = mixin(s._iO, oOptions),
          a = s._a,
          dURL = decodeURI(instanceOptions.url),
          sameURL;

      /**
       * "First things first, I, Poppa..." (reset the previous state of the old sound, if playing)
       * Fixes case with devices that can only play one sound at a time
       * Otherwise, other sounds in mid-play will be terminated without warning and in a stuck state
       */

      if (dURL === decodeURI(lastURL)) {

        // options URL is the same as the "last" URL, and we used (loaded) it
        sameURL = true;

      }

      if (a) {

        if (a._s) {

          // non-global HTML5 reuse case: same url, ignore request
          if (dURL === decodeURI(lastURL)) return s;

        }

        if (!sameURL) {

          // don't retain onPosition() stuff with new URLs.

          if (lastURL) {
            resetProperties(false);
          }

          // assign new HTML5 URL

          s.url = instanceOptions.url;

          lastURL = instanceOptions.url;

          // modern fetch and play
          // loadWebAudioSound(s, instanceOptions.url, (buffer) => s._webAudioOnLoad(buffer));

          s._called_load = false;

        }

      } else {

        setupBufferSource(s);

        if (instanceOptions.autoLoad || instanceOptions.autoPlay) {

          // modern fetch and play
          loadWebAudioSound(s, instanceOptions.url, (buffer) => s._webAudioOnLoad(buffer));

          s._called_load = true;
          
        } else {
  
          s._called_load = false;

        }

      }

      s.isHTML5 = true;

      if (a) {

        // store a ref on the track
        s._a = a;
  
        // store a ref on the audio
        a._s = s;

      }
  
      if (instanceOptions.autoLoad || instanceOptions.autoPlay) {

        s.load();

      }

      return a;

    };

    /**
     * Pseudo-private event internals
     * ------------------------------
     */

    this._onload = (nSuccess) => {

      var fN,
          loadOK = !!nSuccess;

      fN = s.id + ': ';
      if (sm2.debugMode) sm2._wD(fN + (loadOK ? 'onload()' : 'Failed to load / invalid sound?' + (!s.duration ? ' Zero-length duration reported.' : ' -') + ' (' + s.url + ')'), (loadOK ? 1 : 2));

      s.loaded = loadOK;
      s.readyState = (loadOK ? 3 : 2);

      if (s._iO.onload) {
        s._iO.onload.apply(s, [loadOK]);
      }

      return true;

    };

    this._onfinish = () => {

      // store local copy before it gets trashed...
      var io_onfinish = s._iO.onfinish;

      s._resetOnPosition(0);

      // reset some state items
      if (s.instanceCount) {

        s.instanceCount--;

        if (!s.instanceCount) {

          // remove onPosition listeners, if any
          detachOnPosition();

          // reset instance options
          s.playState = 0;
          s.paused = false;
          s.instanceCount = 0;
          s.instanceOptions = {};
          s._iO = {};

          // reset position, too
          if (s.isHTML5) {
            s.position = 0;
          }

        }

        if (!s.instanceCount || s._iO.multiShotEvents) {
          // fire onfinish for last, or every instance
          if (io_onfinish) {
            if (sm2.debugMode) sm2._wD(s.id + ': onfinish()');
            io_onfinish.apply(s, [s]);
          }
        }

      }

    };

    this._whileplaying = (nPosition) => {

      var instanceOptions = s._iO;

      // Safari HTML5 play() may return small -ve values when starting from position: 0, eg. -50.120396875. Unexpected/invalid per W3, I think. Normalize to 0.
      s.position = Math.max(0, nPosition);

      s._processOnPosition();

      if (s.playState === 1) {

        if (instanceOptions.whileplaying) {
          instanceOptions.whileplaying.apply(s, [s]);
        }

      }

      return true;

    };

  }; // SMSound()

  /**
   * Private SoundManager internals
   * ------------------------------
   */

  // mixin = (oMain = {}, oAdd = sm2.defaultOptions) => ({ ...oAdd, ...oMain });

  mixin = (oMain = {}, oAdd = sm2.defaultOptions) => {
    // non-destructive merge
    let o;

    for (o in oAdd) {

      if (oMain[o] === undefined) {

        if (typeof oAdd[o] !== 'object' || oAdd[o] === null) {

          // assign directly
          oMain[o] = oAdd[o];

        } else {

          // recurse through oAdd
          oMain[o] = mixin(oMain[o], oAdd[o]);

        }

      }

    }

    return oMain;
  };

  // additional soundManager properties that soundManager.setup() will accept

  extraOptions = {
    'defaultOptions': 1
  };

  assign = (o, oParent) => {

    /**
     * recursive assignment of properties, soundManager.setup() helper
     * allows property assignment based on whitelist
     */

    var i,
        result = true,
        hasParent = (oParent),
        setupOptions = sm2.setupOptions,
        bonusOptions = extraOptions;

    // if soundManager.setup() called, show accepted parameters.

    for (i in o) {

      // if not an {object} we want to recurse through...

      if (typeof o[i] !== 'object' || o[i] === null || o[i] instanceof Array || o[i] instanceof RegExp) {

        // check "allowed" options

        if (hasParent && bonusOptions[oParent]) {

          // valid recursive / nested object option, eg., { defaultOptions: { volume: 50 } }
          sm2[oParent][i] = o[i];

        } else if (setupOptions[i] !== undefined) {

          // special case: assign to setupOptions object, which soundManager property references
          sm2.setupOptions[i] = o[i];

          // assign directly to soundManager, too
          sm2[i] = o[i];

        } else if (bonusOptions[i] === undefined) {

          // invalid or disallowed parameter. complain.
          complain(str((sm2[i] === undefined ? 'setupUndef' : 'setupError'), i), 2);

          result = false;

        } else {

          // good old-fashioned direct assignment
          sm2[i] = o[i];

        }

      } else {

        // recursion case, eg., { defaultOptions: { ... } }

        if (bonusOptions[i] === undefined) {

          // invalid or disallowed parameter. complain.
          complain(str((sm2[i] === undefined ? 'setupUndef' : 'setupError'), i), 2);

          result = false;

        } else {

          // recurse through object
          return assign(o[i], i);

        }

      }

    }

    return result;

  };

  html5OK = (iO) => {

    // playability test based on URL or MIME type

    var result;

    if (!iO || (!iO.type && !iO.url)) {

      // nothing to check
      result = false;

    } else {

      // Use type, if specified. Pass data: URIs to HTML5. If HTML5-only mode, no other options, so just give 'er
      result = ((iO.type ? html5CanPlay({type: iO.type}) : html5CanPlay({url: iO.url}) || iO.url.match(/data:/i)));

    }

    return result;

  };

  html5CanPlay = (o) => {

    /**
     * Try to find MIME, test and return truthiness
     * o = {
     *  url: '/path/to/an.mp3',
     *  type: 'audio/mp3'
     * }
     */

    var url = (o.url || null),
        mime = (o.type || null),
        aF = sm2.audioFormats,
        result,
        offset,
        fileExt,
        item;

    // account for known cases like audio/mp3

    if (mime && sm2.html5[mime]) return (sm2.html5[mime]);

    if (!html5Ext) {
      
      html5Ext = [];
      
      for (item in aF) {
      
        html5Ext.push(item);
    
        if (aF[item].related) {
          html5Ext = html5Ext.concat(aF[item].related);
        }
      
      }
      
      html5Ext = new RegExp('\\.('+html5Ext.join('|')+')(\\?.*)?$','i');
    
    }

    // TODO: Strip URL queries, etc.
    fileExt = (url ? url.toLowerCase().match(html5Ext) : null);

    if (!fileExt?.length) {
      
      if (!mime) {
      
        result = false;
      
      } else {
      
        // audio/mp3 -> mp3, result should be known
        offset = mime.indexOf(';');
      
        // strip "audio/X; codecs..."
        fileExt = (offset !== -1 ? mime.substr(0, offset) : mime).substr(6);
      
      }
    
    } else {
    
      // match the raw extension name - "mp3", for example
      fileExt = fileExt[1];
    
    }

    if (sm2.html5[fileExt]) {
    
      // result known
      result = sm2.html5[fileExt];
    
    } else {
    
      mime = 'audio/' + fileExt;
      result = sm2.html5.canPlayType({type:mime});
    
      sm2.html5[fileExt] = result;
    
      // if (sm2.debugMode) sm2._wD('canPlayType, found result: ' + result);
      result = (result && sm2.html5[mime]);

    }

    return result;

  };

  testHTML5 = () => {

    /**
     * Internal: Iterates over audioFormats, determining support eg. audio/mp3, audio/mpeg and so on
     * assigns results to html5[]
     */

    var a = new Audio(), item, lookup, support = {}, aF, i;

    function cp(m) {

      var canPlay, j,
          result,
          isOK = false;

      // if either of these are missing, something is terribly wrong.
      if (!a?.canPlayType) return false;

      if (m instanceof Array) {
    
        // iterate through all mime types, return any successes
    
        for (i = 0, j = m.length; i < j; i++) {
    
          if (sm2.html5[m[i]] || a.canPlayType(m[i]).match(sm2.html5Test)) {
    
            isOK = true;
            sm2.html5[m[i]] = true;
    
          }
    
        }
    
        result = isOK;
    
      } else {
    
        canPlay = !!(a?.canPlayType(m));
        result = !!(canPlay?.match(sm2.html5Test));
    
      }

      return result;

    }

    // test all registered formats + codecs

    aF = sm2.audioFormats;

    for (item in aF) {

      lookup = 'audio/' + item;

      support[item] = cp(aF[item].type);

      // write back generic type too, eg. audio/mp3
      support[lookup] = support[item];

      // assign result to related formats, too
      if (aF[item]?.related) {

        for (i = aF[item].related.length - 1; i >= 0; i--) {

          // eg. audio/m4a
          support['audio/' + aF[item].related[i]] = support[item];
          sm2.html5[aF[item].related[i]] = support[item];

        }

      }

    }

    support.canPlayType = (a ? cp : null);
    sm2.html5 = mixin(sm2.html5, support);

    return true;

  };

  complain = (sMsg) => console.warn(sMsg);

  doNothing = () => false;

  disableObject = (o) => {

    var oProp;

    for (oProp in o) {
      if (typeof o[oProp] === 'function') {
        o[oProp] = doNothing;
      }
    }

    // explicitly mark as disabled
    o.disabled = true;

    oProp = null;

  };

  idCheck = this.getSoundById;

  _wDS = (o, errorLevel) => (!o ? '' : sm2.debugMode && sm2._wD(str(o), errorLevel));

  parseURL = (url) => {

    /**
     * Internal: Finds and returns the first playable URL (or failing that, the first URL.)
     * @param {string or array} url A single URL string, OR, an array of URL strings or {url:'/path/to/resource', type:'audio/mp3'} objects.
     */

    var i, j, urlResult = 0, result;

    if (url instanceof Array) {

      // find the first good one
      for (i = 0, j = url.length; i < j; i++) {

        if (url[i] instanceof Object) {

          // MIME check
          if (sm2.canPlayMIME(url[i].type)) {
            urlResult = i;
            break;
          }

        } else if (sm2.canPlayURL(url[i])) {

          // URL string check
          urlResult = i;
          break;

        }

      }

      // normalize to string
      if (url[urlResult].url) {
        url[urlResult] = url[urlResult].url;
      }

      result = url[urlResult];

    } else {

      // single URL case
      result = url;

    }

    return result;

  };

  /**
   * Private initialization helpers
   * ------------------------------
   */

  /**
   * apply top-level setupOptions object as local properties
   * this maintains backward compatibility, and allows properties to be defined separately for use by soundManager.setup().
   */

  setProperties = () => {

    var i,
        o = sm2.setupOptions;

    for (i in o) {

      // assign local property if not already defined

      if (sm2[i] === undefined) {

        sm2[i] = o[i];

      } else if (sm2[i] !== o[i]) {

        // legacy support: write manually-assigned property (eg., soundManager.url) back to setupOptions to keep things in sync
        sm2.setupOptions[i] = sm2[i];

      }

    }

  };

  // startup
  
  testHTML5();

  // assign top-level soundManager properties eg. soundManager.url
  setProperties();

} // SoundManager()

function initAudioContext() {

  if (audioContext) {

    // if suspended, try to resume.
    const { state } = audioContext;
    if (state.match(/suspended|interrupted/i)) {
      console.log('trying to resume audioContext...', audioContext.state);
      try {
        audioContext.resume();
      } catch(e) {
        // oh well
      }
    }

    return;

  }

  // not yet created.

  try {
    audioContext = AudioContext ? new AudioContext() : null;
  } catch(e) {
    // oh well.
  }

  if (!audioContext) return;

  audioContext.onstatechange = () => {
    const { state } = audioContext;
    if (state.match(/suspended|interrupted/i)) {
      resetIOSAudio();
    }
  }

}

function onUserAction() {

  initIOSAudio();

  initAudioContext();

  // drop one of these events, at least.
  // retain the others for "recovering" suspended audio from backgrounded tabs, etc.
  document.removeEventListener('click', onUserAction);

}

var AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext;

if (AudioContext) {

  // wait for user interaction
  if (isMobile) {
    document.addEventListener('touchstart', onUserAction);
  }
  document.addEventListener('mousedown', onUserAction);
  document.addEventListener('click', onUserAction);

}

// Web Audio API bits
const bufferCache = {};
const bufferPendingQueue = {};
let bufferCacheKeys = [];

let didMobileInit;
let iosAudioElement = null;

function initIOSAudio() {

  // NOTE: this must be called immediately from a user action, e.g., touch or click.

  // iOS shenanigans: if the device is switched to silent / vibrate mode, web audio will go through headphones by default.
  // if Audio() plays, that goes through the speaker - and then web audio follows suit.

  if (!isMobile || didMobileInit) return;

  didMobileInit = true;

  const V = (count) => 'V'.repeat(count);

  // tiny MP3, 1 sample @ 8 KHz mono
  const silentAudio = `data:audio/mp3;base64,/+MYxAAAAANIAAAAAExBTUUzLjEwMF${V(66)}/+MYxDsAAANIAAAAAF${V(78)}`;

  iosAudioElement = new Audio();

  // no remote spekaer shenanigans
  iosAudioElement.setAttribute('x-webkit-airplay', 'deny');
  iosAudioElement.setAttribute('disableRemotePlayback', true);

  /**
   * 01/2023: IMPORTANT: as long as this starts and loops with a user action,
   * this and subsequent sounds will play through an iPhone / iPad speaker despite
   * the device being in silent mode. Headphones will work, if connected.
   * Hat tip for the loop trick: https://github.com/swevans/unmute
   */
  iosAudioElement.setAttribute('loop', true);

  iosAudioElement.src = silentAudio;

  iosAudioElement.play().then(() => { /* OK */ }, () => {
    // something failed.
    didMobileInit = false;
  });

}

function resetIOSAudio() {
  if (!iosAudioElement || !didMobileInit) return;
  // unload, so media controls don't show on iOS home screen.
  iosAudioElement.src = '';
  iosAudioElement = null;
  didMobileInit = false;
}

if (isMobile) {
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      initAudioContext();
    } else {
      resetIOSAudio();
    }
  });
}

function loadComplete(url) {
  if (!url) return;
  if (bufferPendingQueue[url]?.length) {
    bufferPendingQueue[url].forEach(callback => callback(bufferCache[url]));
    bufferPendingQueue[url] = null;
  }
}

function loadWebAudioSound(sound, url, callback) {

  if (!sound?._a) {
    console.warn('loadWebAudioSound: WTF no sound provided?', arguments);
    return;
  }

  // already cached?
  if (bufferCache[url]) {
    if (!callback) return;
    return callback((bufferCache[url]));
  }

  // requests for a URL may pile up while actively loading
  if (!bufferPendingQueue[url]) {
    bufferPendingQueue[url] = [callback];
  } else {
    // request underway, fire callback when finished
    bufferPendingQueue[url].push(callback);
    return;
  }

  let request = new XMLHttpRequest();

  function cleanup() {
    request.onload = null;
    request.onerror = null;
    request = null;
  }

  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  request.onload = (e) => {
    const statusType = e?.currentTarget.status?.toString().charAt(0) + 'xx';

    // guard against obvious HTTP errors
    if (statusType === '4xx' || statusType === '5xx') {
      // console.log('load failure for url', url);
      loadComplete(url);
      callback(null);
    } else {
      audioContext.decodeAudioData(request.response, (data) => {
        bufferCache[url] = data;
        bufferCacheKeys.push(url);
        loadComplete(url);
      }, (/*err*/) => {
        // console.log('loadSound: decode failed for ' + url + ': ' + err);
        loadComplete(url);
        callback(null);
      });
    }

    cleanup();
  }

  request.onerror = () => {
    loadComplete(url);
    callback(null);
    cleanup();
  }

  request.send();

}

function setupBufferSource(snd) {

  initAudioContext();

  if (!snd._a) {
    snd._a = audioContext.createBufferSource();
  }

  // volume [0...2 = 0% - 200%] + panning (where panNode.pan.value is from -1 to 1)
  snd.gainNode = audioContext.createGain();

  // valid range for Web Audio API gainNode: 0 - 2.
  const gainValue = snd._lastVolume || 1;

  snd.gainNode.gain.value = (snd.muted ? 0 : gainValue);

  snd.panNode = new StereoPannerNode(audioContext, { pan: 0 });

  snd.biquadFilter = audioContext.createBiquadFilter();

  snd.biquadFilter.type = 'lowpass';

  snd.biquadFilter.frequency.value = 22050;

  // internal tracking
  snd._lastPan = 0;

}

function playSoundFromBuffer(snd, buffer) {

  if (!audioContext || !buffer) return;
  
  if (!snd.playCount) snd.playCount = 0;

  snd.playCount++;

  if (snd.playCount > 1) {
    // console.warn('WTF, more than one play call before buffer has been setup and whatnot?', snd.id);
    // debugger;
    return;
  }

  if (!snd._a) {
    setupBufferSource(snd);
  }

  let source = snd._a;

  if (!snd.bufferSet) {
    snd.bufferSet = true;
    try {
      source.buffer = buffer;
    } catch(e) {
      snd.bufferSet = false;
    }
  }

  // hackish: only fire once
  if (source.onended) {
    console.warn('WTF source.start already called?', snd.id);
    return;
  }

  // routing: source (mediaElement) -> modification nodes -> destination (context.destination)

  if (!snd.gainNode) {
    snd.gainNode = audioContext.createGain();
  }

  // valid range for Web Audio API gainNode: 0 - 2.
  const gainValue = snd._lastVolume || 1;

  snd.gainNode.gain.value = (snd.muted ? 0 : gainValue);
  
  source.connect(snd.gainNode)
    .connect(snd.biquadFilter)
    .connect(snd.panNode)
    .connect(audioContext.destination);

  if (snd._iO?.loops > 1) {
    source.loop = true;
  }

  // TODO: is the sound paused, or should it start from a given offset?
  
  const when = 0;
  const offset = ((snd._iO.from / msecScale) || 0);
  const duration = snd._iO.to ? snd.duration - (snd._iO.to / msecScale) : undefined;

  if (when || offset || duration) {
    console.log('starting playback with when, offset, duration (to)', when, offset, duration);
  }

  if (snd._iO.onplay) {
    snd._iO.onplay.apply(snd, [snd]);
  }

  const whilePlaying = snd._iO.whileplaying;

  // "register" as appropriate
  if (whilePlaying) addWhilePlaying(snd);

  // https://developer.mozilla.org/en-US/docs/Web/API/AudioBufferSourceNode/start
  if (duration !== undefined && duration > 0) {
    source.start(when, offset, duration);
  } else {
    source.start(when, offset);
  }

  snd._startTime = audioContext.currentTime + when;

  snd._offset = offset;

  source.onended = () => {

    if (whilePlaying) onWhilePlayingFinished(snd);

    resetSoundState(snd);

    snd._onfinish();

  }

}

let _whilePlayingSounds = [];

function onWhilePlaying() {

  if (!_whilePlayingSounds.length) return;

  // fire internal timer method, and "force" update
  _whilePlayingSounds.forEach((sound) => sound._onTimer(true));

  window.requestAnimationFrame(onWhilePlaying);

}

function onWhilePlayingFinished(sound) {

  if (!sound) return;

  const i = _whilePlayingSounds.indexOf(sound);
  _whilePlayingSounds.splice(i, 1);

}

function addWhilePlaying(sound) {

  if (_whilePlayingSounds.includes(sound)) return;

  _whilePlayingSounds.push(sound);

  // start the timer loop, if need be
  if (_whilePlayingSounds.length === 1) onWhilePlaying();

}

function resetSoundState(snd) {

  if (!snd) return;

  // finish, stop and so forth

  snd._startTime = null;

  snd._offset = null;

  // TODO: this may not be needed.
  snd._pauseTime = null;

  snd.playCount = 0;

  // buffer source
  if (snd._a) {
    snd._a.onended = null;
    snd._a = null;
  }

  snd.bufferSet = false;

  // buffer = null;
  // source = null;
  // snd._onfinish();
  // snd._events may be null by the time this runs

}

if (!window?.document) {

  // Don't cross the [environment] streams. SM2 expects to be running in a browser, not under node.js etc.
  // Additionally, if a browser somehow manages to fail this test, as Egon said: "It would be bad."

  console.warn('SoundManager requires a browser with window and document objects.');

} else {

  // standard browser case
  // local instance
  soundManager = new SoundManager();

}

export { soundManager };