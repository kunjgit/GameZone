import { winloc, DEFAULT_VOLUME, soundManager } from './core/global.js';
import { utils } from './core/utils.js';
import { game } from './core/Game.js';
import { KeyboardMonitor } from './UI/KeyboardMonitor.js';
import { prefs, PrefsManager } from './UI/preferences.js';
/*

                                         ████▙   ▀████▌████▙  ▀█████   █████▀ ▄██████▄ ▀████▌████▙         ████▙   ▀█████▀    ▀█████▀     ▀████▐███▋▀█████▀ ▀█████▀ TM
                        ▄██▀            ▕█████▏   ████▌ ████▌  ▐████▌  ████▌ ████▎▐███▊ ████▌ ████▌        █████▏   █████      █████       ████ ▝██▋ ▝████   ▐███▘
                      ▄█▀               ▐▐████▎   ████▌ ████▌   █████ ▌████▌▐███▊  ████▏████▌ ████▌       ▐▐████▎   █████      █████       ████   ▝▋  ▝███▙ ▗███▘
      ▄████▄▄▄▄▄▄▄▄▄ █▀▄▄▄▄▄▄▄▄▄▄▄      █▌████▋   ████▌▗████▘   ▌█████▌████▌████▊  ████▌████▌▗████▘       █▌████▋   █████      █████       ████ ▗█▌    ▝███▙▝█▘
                  ▄█████▄▄▄▄  ▀▀▀      ▐█▌▐████   ████▌████▘    ▌█████▌████▌████▊  ████▌████▌████▘       ▐█▌▐████   █████      █████       ████▐██▌     ▐████▌
  ▄          ▄████████████████▄        ██ ▄████▎  ████▌▝███▙    █▐████ ████▌████▊  ████▌████▌▝███▙       ██ ▄████▎  █████      █████       ████ ▝█▌     ▐████▌
  ██        ▀████████████████████▄    ▐█▌██████▌  ████▌ ████▌  ▕█ ███▌ ████▌▐███▊  ████ ████▌ ████▌     ▐█▌██████▌  █████    ▗▋█████    ▗▋ ████   ▗▋    ▐████▌
  ▀███     ▄██████████████████████    ███  ▐████  ████▌ ████▌▗▋▐█ ▐██  ████▌ ████▎▐███▊ ████▌ ████▌▗▋   ███  ▐████  █████  ▗██▌█████  ▗██▌ ████ ▗██▌    ▐████▌
   ████▄▄███████████████████████▀    ▄███▄ ▄████▌▄█████▄▀████▀▄██▄ █▌ ▄█████▄ ▀██████▀ ▄█████▄▀████▀   ▄███▄ ▄████▌▄█████▐████▌█████▌████▌▄████▐███▌   ▄██████▄
  ████████▀▀▀▀▀▀▀▀████▀█▀▀▀▀█▀
   ██▀              ██▘▘ ██▘▘

  ---------------------------------------------
  A R M O R  A L L E Y  ::  R E M A S T E R E D
  --------- 10th Anniversary Edition ----------

  A browser-based interpretation of the Macintosh + MS-DOS releases of Armor Alley.

  Game, overview, tutorials etc.
  https://armor-alley.net/

  Quick video overview (3m 45s)
  https://youtu.be/oYUCUvg02rY

  Source code
  https://github.com/scottschiller/ArmorAlley/

  Original development and history (2013)
  https://www.schillmania.com/content/entries/2013/armor-alley-web-prototype/

  Original game Copyright (C) 1989 - 1991, Information Access Technologies.
  https://en.wikipedia.org/wiki/Armor_alley

  Images, text and other portions of the original game used with permission under an ISC license.
  Original sound effects could not be re-licensed; modern replacements used from freesound.org.

  New game provided under the Attribution-NonCommercial 3.0 Unported (CC BY-NC 3.0) License:
  https://creativecommons.org/licenses/by-nc/3.0/

  General disclaimer: This is a fun personal side project. The code could be tightened up a bit.

  This release:     V2.01.20230520
  Previous release: V2.0.20230501
  Original release: V1.0.20131031

  For revision history, see README.md and CHANGELOG.txt.

*/

const prefsManager = PrefsManager();

const keyboardMonitor = KeyboardMonitor();

let stats;

// used by the "exit [game type]" link
window.aa = {

  exit() {

    // delete stored preference
    utils.storage.remove(prefs.gameType);

  }

};

if (soundManager) {

  // OGG is available, so MP3 is not required.
  soundManager.audioFormats.mp3.required = false;

  soundManager.setup({
    debugMode: false,
    // Audio in Firefox starts breaking up at some number of active sounds, if this is enabled. :/
    usePlaybackRate: true,
    defaultOptions: {
      volume: DEFAULT_VOLUME,
      multiShotEvents: true
    },
  });

  if (winloc.match(/mute/i)) {
    soundManager.disable();
  }

}

window.addEventListener('DOMContentLoaded', game.initArmorAlley);

// we may be late to this event party.
if (document.readyState?.match(/interactive|complete|loaded/i)) {
  game.initArmorAlley();
}

// a few hot globals
export { gameType, screenScale } from './core/Game.js';
export { keyboardMonitor, prefsManager, stats };

// --- THE END ---