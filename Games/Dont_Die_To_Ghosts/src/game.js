/* 

MIT License

Copyright 2022 Cliff Earl, Antix Development

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and  associated documentation  files (the "Software"), to deal in 
the  Software without restriction,  including without limitation  the rights to 
use, copy,  modify, merge, publish, distribute,  sublicense, and/or sell copies 
of the Software, and to permit persons  to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this  permission notice shall be included in all 
copies or substantial portions of the Software.

THE  SOFTWARE IS  PROVIDED "AS  IS", WITHOUT  WARRANTY OF ANY  KIND, EXPRESS OR 
IMPLIED,  INCLUDING BUT  NOT  LIMITED  TO THE  WARRANTIES  OF  MERCHANTABILITY, 
FITNESS FOR A  PARTICULAR PURPOSE  AND NONINFRINGEMENT. IN  NO EVENT  SHALL THE 
AUTHORS  OR  COPYRIGHT  HOLDERS BE  LIABLE  FOR  ANY CLAIM,  DAMAGES  OR  OTHER 
LIABILITY, WHETHER IN  AN ACTION OF  CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION  WITH THE SOFTWARE OR THE USE  OR OTHER DEALINGS IN THE 
SOFTWARE.

*/ 

// #region -- Constants

const
D                         = document,
W                         = window,

STORAGE                   = W.localStorage,
NAMESPACE                 = 'com.antix.ddtg',

M                         = Math,
floor                     = M.floor,
random                    = M.random,
min                       = M.min,
ceil                      = M.ceil,
PI2                       = M.PI * 2,
cos                       = M.cos,
sin                       = M.sin,
abs                       = M.abs,

// Game scene dimensions
WIDTH                     = 1920,
HEIGHT                    = 1080,

// Game modes
MODE_NONE                 = 0,
MODE_FADE_IN              = 1, // Fade in new level
MODE_FADE_OUT             = 2, // Fade out between levels
MODE_MAIN_MENU            = 3, // Main menu
MODE_OPTIONS_MENU         = 4, // Options menu
MODE_PREPLAY              = 5, // Simple screen showing the level number
MODE_POSTPLAY             = 6, // Simple screen showing the level number
MODE_PLAY                 = 7, // Trying to not die to ghosts!

// Sound effect indexes
FX_BUTTON                 = 0,
FX_MUNCH                  = 1,
FX_MUNCH_GHOST            = 2,
FX_BOUNCE                 = 3,
FX_DIED                   = 4,
FX_PREPLAY                = 5,
FX_POWERUP                = 6,
FX_CHERRY                 = 7,
FX_LEVEL_COMPLETE         = 8,
FX_NEW_BEST_SCORE         = 9,

PLAYER_Y                  = 915,
PLAYER_SPEED              = 750,

DOT_SPAWN_DELAY           = .01, // Time between dots spawning
MAX_DOT_VELOCITY          = 500,
DOT_GRAVITY               = 4,

MAX_PILLS                 = 2, // Number of power pills spawned each level

CHERRY_DURATION           = 3, // How long the cherry is able to be collected

GHOST_ARE_SCARED_DURATION = 4.5, // How long ghosts are scared (can be munched)

SCORE_Y                   = 32, // Position of score on display

// Font related
SPACE_BETWEEN_CHARACTERS  = 4,
SPACE_WIDTH               = 32;

// #endregion

// #region -- Variables

let

// maxMS = 0,

gameMode = MODE_NONE,
paused,
gameOver,

thisFrame, // Dates used for calculating DeltaTime between `onEnterFrame events`
lastFrame,
DT, // Time elapsed (in milliseconds) since last the last `onEnterFrame` event

activeMenu, // Menu that is currently showing
nextMenu,

fullScreen, // True if the game is in fullscreen mode

parallaxStarsEnabled, // True if the stars are visible

prePlayCounter, // Delay between showing "level n" text and gameplay start

fadeInOutCounter, // Duration of scene fading modes

callback, // General purpose callback hook

collisionEnabled, // True if things can collide

cursorVisible = true,

// Background drawing
bg_canvas,
bg_ctx,
gradient,

// Foreground drawing
fg_canvas,
fg_ctx,

gameContentContainer, // Game content container

// Texture Regions
textureRegions = [],
atlas,
atlas_ctx,

// Dots and pills
dots,
dotSpawnDelay = 0,
allDotsSpawned = false,
numberOfDotsSpawned = 0,
remainingDots = 0,

pills,

// Cherry bonus fruit
cherrySpawned,
cherryMunched,
cherrySpawnDelay,
cherryCounter,
cherry,

// Ghosts
ghosts,
ghostsAreScared,
ghostsAreScaredTimer,
ghostTurningPeriodBase,
ghostTurningPeriodVariance,
ghostSpeedX,

// The player
player,

// Scoring
score = 0,
bestScore = 1000,
bestScoreBeaten,

bonusPoints,

// Level
level,
levelLabel,
levelEnded,

// Particles
particles,

// Options
OPTIONS,
optionsChanged, // True if options need saving on exit

// Changing control keys
waitingForKeyUp,
keyToChange,
labelToUpdate,

// Player keys
keysEnabled,
goLeft,
goRight,

STARS = [], // The parallax starfield

// #endregion

// #region -- Utility functions

// get the HTML element with the given id
getByID = (id) => D.getElementById(id),

// Set the given HTML elements position to the given coordinates
setElementPosition = (el, x, y) => {
  el.style.left = `${x}px`;
  el.style.top = `${y}px`;
},

// Make the given HTML element visible or invisible, according to the given state
showElement = (el, state) => (state) ? el.classList.remove('h') : el.classList.add('h'),

// Enable or disable the given HTML element, according to the given state
enableElement = (el, state) => (state) ? el.classList.remove('d') : el.classList.add('d'),

// Create a new HTML element of the given type
createElement = (type) => D.createElement(type),

// Create a new HTML canvas with the given dimensions
newCanvas = (w, h) => {
  let canvas = D.createElement  ('canvas'); // Create a new canvas
  canvas.width = w; // Set canvas dimensions
  canvas.height = h;
  canvas.ctx = canvas.getContext('2d'); // Save graphics context
  return canvas;
},

// Set the opacity of the documents body, essentially allowing the entire display to fade in and out of the background
setOpacity = (o) => D.body.style.opacity = `${o}`,

// Constrain the given number to the given range
clamp = (v, min, max) => v < min ? min : v > max ? max : v,

// Get a random number (inclusive) in the given range
randomInt = (min, max) => {
  min = ceil(min);
  return floor(random() * (floor(max) - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
},

// Save options to local storage
saveOptions = () => {
  if (optionsChanged) { // Have the options been modified?
    OPTIONS.b = bestScore; // Get the best score
    STORAGE.setItem(NAMESPACE, JSON.stringify(OPTIONS)); // Save to device
  } // End "options modified" check
},

// Reset the options to default and save them to local storage
resetOptions = () => {
  OPTIONS = {
    a: true, // Audio enabled
    b: 0, // Best score
    c: { // Controls
      l: { // Left
        k: 90, // Keycode
        c: 'Z', // Ascii representation
      },
      r: { // Right
        k: 88,
        c: 'X',
      },
    },
  };

  optionsChanged = true;

  saveOptions(); // Save options to local storage
},

// Show or hide the cursor according to the given state
showCursor = (state) => {
  if (state) { // Is state true?
    // Yes.. show the cursor

    if (!cursorVisible) D.body.style.cursor = 'auto'; // Only show the cursor if it is not visible
      
  } else { // State not true, hide the cursor

    if (cursorVisible) D.body.style.cursor = 'none'; // Only hide the cursor if it is visible

  } // End "state" check
  cursorVisible = state; // Save the state
},

// Rescale the document body to fit inside the window with maintained aspect ratio
rescale = () => {
  let scale = min(W.innerWidth / WIDTH, W.innerHeight / HEIGHT); // Calculate scalar
  gameContentContainer.style.transform = `scale(${scale})`; // Scale the game content container
  gameContentContainer.style.left = `${floor((W.innerWidth - fg_canvas.getBoundingClientRect().width) / 2)}px`; // Center the game content container on the x-axis
  gameContentContainer.style.top = `${floor((W.innerHeight - fg_canvas.getBoundingClientRect().height) / 2)}px`; // Center the game content container on the y-axis
},

// #endregion

// #region -- Sound Effects

/*
Sound Effects v1.02

A basic sound effect player that plays sounds created using ZzFX.

By Cliff Earl, Antix Development, 2022.

Usage:
------
To add a new sound effect, call fx_add(parameters) like so...
fx_add([1.01,.05,259,0,.1,.2,2,1.58,0,0,0,0,0,0,1.1,0,0,.7,.07,0]);

To play a sound effect call fx_play(index)

If you were pondering  how parameters for new sound  effects are created, use
ZzFX  (https://github.com/KilledByAPixel/ZzFX).  NOTE:  Untick  the  "spread"
checkbox!

IMPORTANT!! THIS VERSION OF  THE CODE HAS  THE RANDOMNESS REMOVED SO YOU WILL 
HAVE TO MODIFY ANY SAMPLE DATA THAT YOU COPY FROM ZZFX BY REMOVING THE SECOND
NUMBER FROM  THE ARRAY (0.5  IN THE ABOVE  EXAMPLE STRING), WHICH  REPRESENTS 
RANDOMNESS.
 
There is also a global volume variable that you can poke... gV

History:
--------
v1.01 (18/8/2022) - Removed sound randomness.

v1.02 (6/9/2022) - Added code to resolve strange repeating sound issue.

Acknowledgements:
-----------------
This code is a modified version of zzfx.js, part of ZzFX.

ZzFX - Zuper Zmall Zound Zynth v1.1.6
By Frank Force 2019
https://github.com/KilledByAPixel/ZzFX

ZzFX MIT License

Copyright (c) 2019 - Frank Force

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
 
gV = .5, // Global volume
sR = 44100, // Sample rate
aC = null, // Audio context
fx = [], // List of all fx (stored and accessed by index)
// Create and add samples to the list of all playable effects, using the given zzfx parameters
fx_add = (parameters) => fx.push(fx_bS(...parameters)),

// Play the fx with the given index, so long as audio is enabled
fx_play = (index) => {
  if (OPTIONS.a) fx_pS(fx[index]); // Play sound
}, // Play the sound

// Create the `AudioContext`
fx_newAudioContext = () => aC = new (W.AudioContext || W.webkitAudioContext),

// Close the `AudioContext` and create a new one. This resolves a strange issue where sometimes a little droning sound plays and keeps playing, all the time gaining volume, until it is really annoying.
fx_reset = () => {
  aC.close();
  fx_newAudioContext();
},

// Play an array of samples
fx_pS = (samples) => {
  if (!aC) fx_newAudioContext(); // Create audio context if it does not exist.

  // play an array of audio samples
  const audioBuffer = aC.createBuffer(1, samples.length, sR), // NOTE: `createBuffer` is a method of `BaseAudioContext`, the parent class of `AudioContext`
  audioBufferSourceNode = aC.createBufferSource();
  audioBuffer.getChannelData(0).set(samples);
  audioBufferSourceNode.buffer = audioBuffer;
  audioBufferSourceNode.connect(aC.destination);
  audioBufferSourceNode.start(0);
  // return audioBufferSourceNode;
},

// Build an array of samples
fx_bS = (volume, frequency, attack, sustain, release, shape, shapeCurve, slide, deltaSlide, pitchJump, pitchJumpTime, repeatTime, noise, modulation, bitCrush, delay, sustainVolume, decay, tremolo) => {
  // init parameters
  let sampleRate = sR,
  sign = v => v > 0 ? 1 : -1,
  startSlide = slide *= 500 * PI2 / sampleRate / sampleRate,
  startFrequency = frequency *= PI2 / sampleRate, b = [], t = 0, tm = 0, i = 0, j = 1, r = 0, c = 0, s = 0, f, length;
  
  // scale by sample rate
  attack = attack * sampleRate + 9; // minimum attack to prevent pop
  decay *= sampleRate;
  sustain *= sampleRate;
  release *= sampleRate;
  delay *= sampleRate;
  deltaSlide *= 500 * PI2 / sampleRate**3;
  modulation *= PI2 / sampleRate;
  pitchJump *= PI2 / sampleRate;
  pitchJumpTime *= sampleRate;
  repeatTime = repeatTime * sampleRate | 0;

  // generate waveform
  for(length = attack + decay + sustain + release + delay | 0; i < length; b[i++] = s) {
      if (!(++c%(bitCrush*100|0))) { // bit crush
        
        s = shape? shape>1? shape>2? shape>3?         // Wave shape
            sin((t%PI2)**3) :                       // 4 noise
            M.max(min(M.tan(t),1),-1):              // 3 tan
            1-(2*t/PI2%2+2)%2:                        // 2 saw
            1-4*abs(M.round(t/PI2)-t/PI2):          // 1 triangle
            sin(t);                                 // 0 sin

        s = (repeatTime ?
                1 - tremolo + tremolo*sin(PI2*i/repeatTime) // Tremolo
                : 1) *
            sign(s)*(abs(s)**shapeCurve) *          // Curve 0=square, 2=pointy
            volume * gV * (                         // Envelope
            i < attack ? i/attack :                   // Attack
            i < attack + decay ?                      // Decay
            1-((i-attack)/decay)*(1-sustainVolume) :  // Decay falloff
            i < attack  + decay + sustain ?           // Sustain
            sustainVolume :                           // Sustain volume
            i < length - delay ?                      // Release
            (length - i - delay)/release *            // Release falloff
            sustainVolume :                           // Release volume
            0);                                       // Post release

        s = delay ? s / 2 + (delay > i ? 0 :            // delay
          (i < length - delay? 1 : (length - i)/delay) *    // release delay 
          b[i-delay | 0] / 2) : s;                        // sample delay
    }

    f = (frequency += slide += deltaSlide) * cos(modulation*tm++); // Frequency
    t += f - f * noise*(1 - (sin(i) + 1) * 1e9 % 2); // Noise

    if (j && ++j > pitchJumpTime) { // Pitch jump
      frequency += pitchJump; // Apply pitch jump
      startFrequency += pitchJump; // Also apply to start
      j = 0; // Stop pitch jump time
    }

    if (repeatTime && !(++r % repeatTime)) { // Repeat
    frequency = startFrequency; // Reset frequency
    slide = startSlide; // Reset slide
    j = j || 1; // Reset pitch jump time
    }
  }
  return b;
};

// #endregion

// #region -- Generate the SVG objects, base-64 encode them, then generate IMG elements using them as the IMG's source

const
SVG_HEAD_WIDTH          = '<svg width="',
SVG_HEIGHT              = '" height="',
SVG_VERSION_XMLNS       = '" version="1.1" xmlns="http://www.w3.org/2000/svg">',
SVG_PATH_START          = '<path d="',
SVG_PATH_END            = '"/>',
SVG_FILL                = '" fill="#',
SVG_FILL_NONE           = '" fill="none',
SVG_STROKE              = '" stroke="#',
SVG_STROKE_WIDTH        = '" stroke-width="',
SVG_STROKE_LINECAP      = '" stroke-linecap="round',
SVG_STROKE_LINEJOIN     = '" stroke-linejoin="round',
SVG_OPACITY             = '" opacity="',
SVG_GROUP_TRANSLATE     = '<g transform="translate',
SVG_GROUP_FILL          = '<g fill="#',
SVG_GROUP_END           = '</g>',
SVG_PAINT_ORDER_NORMAL  = '" style="paint-order:normal',
SVG_CIRCLE_START_CX     = '<circle cx="',
SVG_ELLIPSE_START_CX    = '<ellipse cx="',
SVG_ELLIPSE_CY          = '" cy="',
SVG_ELLIPSE_RX          = '" rx="',
SVG_ELLIPSE_RY          = '" ry="',
SVG_ELLIPSE_END         = SVG_PATH_END,
SVG_CIRCLE_R            = '" r="',
SVG_TAIL                = '</svg>',

imageContainer = createElement('div'); // Create a temporary DIV for the SVG images. NOTE: It doesn't need to be attached to anything

let svg, // Used for generating SVG image strings

// Append a new HTML IMG to the DIV that holds images to be drawn to the canvas, with the given id, and using whatever data is currently contained in the `svg` variable
appendSVGImage = (id) => imageContainer.innerHTML += `<img id="${id}" src="data:image/svg+xml;base64,${btoa(svg)}">`, // Generate IMG, using the base-64 encoded SVG image as it's source// Player animation frames

playerAnimationFrames = [
  'm126 65a62 62 0 0 1-63 62 62 62 0 0 1-62-62 62 62 0 0 1 62-62 62 62 0 0 1 63 62l-62 0.55z',
  'm126 75a62 62 0 0 1-67 51 62 62 0 0 1-57-62 62 62 0 0 1 57-62 62 62 0 0 1 67 51l-62 11z',
  'm123 85a62 62 0 0 1-70 40 62 62 0 0 1-52-62 62 62 0 0 1 52-62 62 62 0 0 1 70 40l-59 21z',
  'm118 95a62 62 0 0 1-70 29 62 62 0 0 1-46-60 62 62 0 0 1 46-60 62 62 0 0 1 70 29l-54 31z',
  'm112 104a62 62 0 0 1-69 19 62 62 0 0 1-41-59 62 62 0 0 1 41-59 62 62 0 0 1 69 19l-48 40z'
],

// Font descriptors
fontDescriptors = [ // Width, Height, YOffset, SVG data
  {i: '0', w: 74, h:74, y: 0, d: 'm37 1c-20 0-36 16-36 36s16 36 36 36c20 0 36-16 36-36s-16-36-36-36z'}, // 0
  {i: '1', w: 46, h: 69, y: 0, d: 'm45 1h-32l-11 32h8.6v35h35z'}, // 1
  {i: '2', w: 70, h: 69, y: 0, d: 'm52 1h-50v34h11v0.67c-8.4 1.9-13 8.6-13 17v16h66v-34h-13v-0.67c9.4-1.8 15-7.4 15-16 0-8.6-7.5-17-17-17z'}, // 2
  {i: '3', w: 62, h: 69, y: 0, d: 'm1 1v23h14v2.9h-14v16h14v2.9h-14v23h34c24 0 34-25 19-36 11-12 0.58-31-18-31h-35z'},
  {i: '4', w: 69, h: 69, y: 0, d: 'm1 19c0 18 14 33 32 34v16h35v-67h-67z'},
  {i: '5', w: 68, h: 69, y: 0, d: 'm51 68c9.2 0 17-8.2 17-17s-5.9-14-15-16v-0.58h13v-34h-64v34h12v2.9h-12v31h50z'},
  {i: '6', w: 73, h: 72, y: 0, d: 'm38 22c5.6-7.8 9.5-13 15-21h-36l-11 15c-3.8 5.4-5.8 13-5.8 19 0 20 13 36 36 36 22-0.096 35-14 35-33 0-12-6.2-23-22-28l-9.2 13z'},
  {i: '7', w: 70, h: 69, y: 0, d: 'm1.4 68h44c7.9-22 16-45 24-67h-67v32h12z'},
  {i: '8', w: 67, h: 74, y: 0, d: 'm38 73c26 0 37-26 20-39 12-13-1.2-33-21-33h-8.4c-20 0-32 20-20 33-17 12-5.4 39 20 39z'},
  {i: '9', w: 73, h: 72, y: 0, d: 'm35 50c-5.6 7.8-9.5 13-15 21h36l11-15c3.8-5.4 5.8-13 5.8-19 0-20-13-36-36-36-22 0.096-35 14-35 33 0 12 6.2 23 22 28l9.2-13z'},
  {}, // :
  {}, // ;
  {}, // <
  {i: '=', w: 58, h: 75, y: 0, d: 'm49 42h-40v-15h40z'}, // = (actually used for "-")
  {}, // >
  {}, // ?
  {i: '@', w: 88, h: 75, y: 0, d: 'm56 9.7q4.3 4.3 6.7 10 2.4 5.9 2.4 13 0 5.3-1.5 11-1.5 5.5-3.8 9.1h-19l-0.61-3q-2.2 1.4-4.2 2.3-2 0.84-5.8 0.84-6.2 0-10-5.1-3.8-5.1-3.8-14 0-4.6 1.3-8.1 1.3-3.5 3.5-6.1 2.1-2.4 5.1-3.8 3-1.4 5.9-1.4 2.5 0 4.5 0.95 1.9 0.91 3 1.9v-2.4h8.8v31h6.5q1.4-3 2-6.5 0.69-3.5 0.69-6.8 0-6.4-1.8-11-1.8-4.9-5-8.1-3.2-3.3-7.6-4.9-4.3-1.6-9.4-1.6-4.8 0-9.2 1.9-4.3 1.9-7.7 5.1-3.4 3.3-5.5 8.3-2.1 5-2.1 11 0 6.5 2 11 2 5 5.3 8.3 3.3 3.3 7.7 5 4.4 1.7 9.3 1.7 3.2 0 7.4-0.61 4.2-0.57 7.4-1.5v7.4q-3.5 0.8-7 1.2-3.5 0.42-7.7 0.42-7 0-13-2.4-5.9-2.4-10-6.8-4.3-4.4-6.7-11-2.4-6.2-2.4-14 0-7.1 2.5-13 2.5-6.1 6.9-11 4.3-4.4 10-7 6-2.6 13-2.6 6.7 0 12 2.4 5.8 2.4 10 6.6zm-17 33v-19q-1.6-0.8-2.9-1.1-1.3-0.38-3-0.38-3.7 0-5.6 3.2-2 3.2-2 8.8 0 6 1.6 8.9 1.6 2.9 5.4 2.9 2 0 3.5-0.76 1.5-0.8 3-2.3z'}, // @
  {i: 'A', w: 88, h: 75, y: 0, d: 'm1.8 74h85l-42-72z'}, // A
  {i: 'B', w: 62, h: 69, y: 0, d: 'm1 1v67h34c24 0 34-25 19-36 11-12 0.58-31-18-31h-35z'}, // B
  {i: 'C', w: 63, h: 73, y: 0, d: 'm11 11c-14 14-14 36 0 50 14 14 36 14 50 0l-25-25 25-25c-14-14-36-14-50 0z'}, // C
  {i: 'D', w: 69, h: 69, y: 0, d: 'm35 68c19 0 34-15 34-34 0-19-15-34-34-34h-34v67z'}, // D
  {i: 'E', w: 58, h: 69, y: 0, d: 'm1 1v67h56v-23h-14v-2.9h14v-16h-14v-2.9h14v-23z'}, // E
  {i: 'F', w: 58, h: 69, y: 0, d: 'm1 1v67h41v-20h15v-22h-14v-2.9h14v-23z'}, // F
  {i: 'G', w: 73, h: 73, y: 0, d: 'm37 37 18-31c-7.1-4-15-5.6-23-4.3-17 2.8-30 17-30 35 0 20 16 36 36 36 20 0 36-16 36-36z'}, // G
  {i: 'H', w: 69, h: 69, y: 0, d: 'm1 1v67h32v-25h2.9v25h32v-67h-32v25h-2.9v-25z'}, // H
  {i: 'I', w: 37, h: 69, y: 0, d: 'm1 1v67h35v-67z'}, // I
  {i: 'J', w: 69, h: 71, y: 0, d: 'm68 40v-39h-32v37h-2.9v-12h-32v14c0 40 67 40 67 0z'}, // J
  {i: 'K', w: 69, h: 69, y: 0, d: 'm1 1v67h66l-25-34 25-34z'}, // K
  {i: 'L', w: 54, h: 69, y: 0, d: 'm35 35v-34h-34v67h52v-34z'}, // L
  {i: 'M', w: 69, h: 73, y: 0, d: 'm1.2 72h67l-0.19-70-34 25-34-25z'}, // M
  {i: 'N', w: 69, h: 72, y: 0, d: 'm1 2.1v69h67v-67h-33v25z'}, // N
  {i: 'O', w: 74, h: 74, y: 0, d: 'm37 1c-20 0-36 16-36 36s16 36 36 36 36-16 36-36-16-36-36-36z'}, // O
  {i: 'P', w: 62, h: 69, y: 0, d: 'm33 1h-32v67h32v-13c15 0 27-12 27-27 0-15-12-27-27-27z'}, // P
  {i: 'Q', w: 73, h: 73, y: 0, d: 'm36 1c-20 0-35 16-35 35 0 19 16 35 35 35h35v-0.58l-20-19 2-2 9.6 9.4c5.1-6.1 8.3-14 8.3-23 0-20-16-35-35-35z'}, // Q
  {i: 'R', w: 62, h: 69, y: 0, d: 'm33 1h-32v67h59l-9.9-19c6.4-5 10-13 10-21 0-15-12-27-27-27z'}, // R
  {i: 'S', w: 70, h: 69, y: 0, d: 'm18 1c-9.2 0-17 8.1-17 17 0 8.7 5.9 15 15 16v0.67h-14v34h50c19 0 23-29 3.6-33v-0.67h12v-34z'}, // S
  {i: 'T', w: 63, h: 69, y: 0, d: 'm49 35h13v-34h-61v34h14v34h34z'}, // T
  {i: 'U', w: 69, h: 71, y: 0, d: 'm1 36c0 19 15 34 34 34s34-15 34-34v-35h-67z'}, // U
  {i: 'V', w: 88, h: 75, y: 0, d: 'm87 1h-85l43 72z'}, // V
  {i: 'W', w: 124, h: 75, y: 0, d: 'm1.8 1 42 72 16-27-6.8-12 2.1-2c8 14 16 27 24 40l42-72h-120z'}, // W
  {i: 'X', w: 75, h: 69, y: 0, d: 'm1.7 1 19 34-19 34h71l-19-34 19-34h-71z'}, // X
  {i: 'Y', w: 75, h: 69, y: 0, d: 'm54 35 19-34h-71l19 34v34h34z'}, // Y
  {i: 'Z', w: 70, h: 69, y: 0, d: 'm1.4 68h67v-32h-12l12-35h-67v32h12z'} // Z
],

// The four ghosts share the same SVG image, they just have a different fill color
ghostColors = [
  'f9c',
  'f00',
  '3ff',
  'fc3'
],

// Dot data
dotData = [
  // Width, Fill, Stroke
  {w: 32, f: 'eee', s: '999'}, // Grey version
  {w: 32, f: 'ff0', s: 'fd0'}, // Yellow version

  {w: 80, f: 'eee', s: '999'},
  {w: 80, f: 'ff0', s: 'fd0'}
];

// Star data
starData = [
  // Width, Fill, Stroke
  {w: 12, f: '555', s: '111'},
  {w: 18, f: '999', s: '555'},
  {w: 24, f: 'eee', s: '999'}
];

// Generate font char images
for (let i = 0; i < fontDescriptors.length; i++) { // Process all characters
  const char = fontDescriptors[i]; // Next char
  if (char.w) { // Skip empty chars
    svg = `${SVG_HEAD_WIDTH}${char.w}${SVG_HEIGHT}${char.h}${SVG_VERSION_XMLNS}${SVG_PATH_START}${char.d}${SVG_FILL}ff0${SVG_STROKE}aa0${SVG_STROKE_WIDTH}2${SVG_PATH_END}${SVG_TAIL}`; // Generate SVG image
    appendSVGImage(`${char.i}`);
  } // End "char is empty" check
} // End font generation loop

// Generate dot images
for (let i = 0; i < dotData.length; i++) { // Process all dots
  let d = dotData[i]; // Next dot
  svg = `${SVG_HEAD_WIDTH}${d.w}${SVG_HEIGHT}${d.w}${SVG_VERSION_XMLNS}${SVG_CIRCLE_START_CX}${d.w / 2}${SVG_ELLIPSE_CY}${d.w / 2}${SVG_CIRCLE_R}${(d.w / 2) - 1}${SVG_FILL}${d.f}${SVG_STROKE}${d.s}${SVG_STROKE_WIDTH}2${SVG_PATH_END}${SVG_TAIL}`
  appendSVGImage(`dot${d.w}${(i + 1) % 2}`);
} // End "dot processing" loop

// Generate star images for parallax starfield
for (let i = 0; i < starData.length; i++) { // Process all stars
  let d = starData[i]; // Next dot
  svg = `${SVG_HEAD_WIDTH}${d.w}${SVG_HEIGHT}${d.w}${SVG_VERSION_XMLNS}${SVG_CIRCLE_START_CX}${d.w / 2}${SVG_ELLIPSE_CY}${d.w / 2}${SVG_CIRCLE_R}${(d.w / 2) - 1}${SVG_FILL}${d.f}${SVG_STROKE}${d.s}${SVG_STROKE_WIDTH}2${SVG_PATH_END}${SVG_TAIL}`
  appendSVGImage(`star${i}`);
} // End "dot processing" loop

// Generate the star image
svg = `${SVG_HEAD_WIDTH}56${SVG_HEIGHT}54${SVG_VERSION_XMLNS}${SVG_PATH_START}m43 52-15-8.3-16 8 3.1-17-12-12 17-2.4 7.9-16 7.6 16 17 2.6-13 12z${SVG_FILL}ddd${SVG_STROKE}888${SVG_STROKE_WIDTH}2.7${SVG_PAINT_ORDER_NORMAL}${SVG_PATH_END}${SVG_TAIL}`
appendSVGImage('star');

// Generate player animation frame images
for (let i = 0; i < playerAnimationFrames.length; i++) { // Process all animation frames
  svg = `${SVG_HEAD_WIDTH}128${SVG_HEIGHT}128${SVG_VERSION_XMLNS}${SVG_PATH_START}${playerAnimationFrames[i]}${SVG_FILL}ff0${SVG_STROKE}aa0${SVG_STROKE_WIDTH}3${SVG_PATH_END}${SVG_TAIL}`; // Generate SVG image
  appendSVGImage(`player${i}`);
} // End "generate player frames" loop

// Generate ghost images
for (let i = 0; i < ghostColors.length; i++) { // Process all ghost colors
  svg = `${SVG_HEAD_WIDTH}128${SVG_HEIGHT}128${SVG_VERSION_XMLNS}viewBox="0 0 128 130"<g>${SVG_PATH_START}m0.54 64c0-62 63-62 63-62s64 0 64 62v62l-16-17-16 17-16-17-16 17-16-17-16 17-16-17-15 17z${SVG_FILL}${ghostColors[i]}${SVG_STROKE}000${SVG_STROKE_WIDTH}3${SVG_PATH_END}${SVG_ELLIPSE_START_CX}26${SVG_ELLIPSE_CY}54${SVG_ELLIPSE_RX}15${SVG_ELLIPSE_RY}27${SVG_FILL}fff${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}22${SVG_ELLIPSE_CY}52${SVG_ELLIPSE_RX}8.1${SVG_ELLIPSE_RY}15${SVG_FILL}00f${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}62${SVG_ELLIPSE_CY}54${SVG_ELLIPSE_RX}15${SVG_ELLIPSE_RY}27${SVG_FILL}fff${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}59${SVG_ELLIPSE_CY}52${SVG_ELLIPSE_RX}8.1${SVG_ELLIPSE_RY}15${SVG_FILL}00f${SVG_ELLIPSE_END}${SVG_GROUP_END}${SVG_TAIL}`; // Generate SVG image
  appendSVGImage(`ghost${i}`);
} // End "create ghost images" loop

//The "scared ghost" has it's own SVG image
svg = `${SVG_HEAD_WIDTH}128${SVG_HEIGHT}128${SVG_VERSION_XMLNS}<g>${SVG_PATH_START}m0.55 64c0-62 63-62 63-62s64 0 64 62v62l-16-17-16 17-16-17-16 17-16-17-16 17-16-17-15 17z${SVG_FILL}00f${SVG_STROKE}000${SVG_STROKE_WIDTH}3.1${SVG_PATH_END}${SVG_ELLIPSE_START_CX}22${SVG_ELLIPSE_CY}52${SVG_ELLIPSE_RX}8.1${SVG_ELLIPSE_RY}15${SVG_FILL}fff"/><ellipse cx="59" cy="52" rx="8.1" ry="15${SVG_FILL}fff"/>${SVG_GROUP_END}<path d="m10 93c5.1-5.1 5.1-5.1 10 0 5.1 5.1 5.1 5.1 10 0 5.1-5.1 5.1-5.1 10 0 5.1 5.1 5.1 5.1 10 0 5.1-5.1 5.1-5.1 10 0 5.1 5.1 5.1 5.1 10 0 5.1-5.1 5.1-5.1 10 0${SVG_FILL}fff${SVG_STROKE}fff" stroke-linecap="round${SVG_STROKE_WIDTH}3${SVG_PATH_END}${SVG_TAIL}`; // Generate SVG image
appendSVGImage('ghost4');

// Generate eyes image, used when ghosts have been munched
svg = `${SVG_HEAD_WIDTH}128${SVG_HEIGHT}128${SVG_VERSION_XMLNS}${SVG_ELLIPSE_START_CX}26${SVG_ELLIPSE_CY}54${SVG_ELLIPSE_RX}15${SVG_ELLIPSE_RY}27${SVG_FILL}fff${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}22${SVG_ELLIPSE_CY}48${SVG_ELLIPSE_RX}8.1${SVG_ELLIPSE_RY}15${SVG_FILL}00f${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}62${SVG_ELLIPSE_CY}54${SVG_ELLIPSE_RX}15${SVG_ELLIPSE_RY}27${SVG_FILL}fff${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}59${SVG_ELLIPSE_CY}48${SVG_ELLIPSE_RX}8.1${SVG_ELLIPSE_RY}15${SVG_FILL}00f${SVG_ELLIPSE_END}${SVG_TAIL}`
appendSVGImage('eyes');

// Generate the cherry image
svg = `${SVG_HEAD_WIDTH}96${SVG_HEIGHT}94${SVG_VERSION_XMLNS}${SVG_GROUP_TRANSLATE}(0 -2)${SVG_STROKE_WIDTH}2">${SVG_ELLIPSE_START_CX}70${SVG_ELLIPSE_CY}59${SVG_ELLIPSE_RX}25${SVG_ELLIPSE_RY}24${SVG_FILL}f00${SVG_STROKE}a00${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}26${SVG_ELLIPSE_CY}71${SVG_ELLIPSE_RX}25${SVG_ELLIPSE_RY}24${SVG_FILL}f00${SVG_STROKE}a00${SVG_ELLIPSE_END}${SVG_PATH_START}m30 54c0.15-0.36 9.9-23 26-38 15-14 17-13 17-13l3.4 3.2c-17 9.9-17 24-8 42l-4.9 2.5s-5.7-11-6.4-19c-0.65-7.7 0.65-10 0.65-10-5 4.8-14 14-23 35z${SVG_FILL}0f0${SVG_STROKE}0a0${SVG_STROKE_LINECAP}${SVG_STROKE_LINEJOIN}${SVG_STROKE_WIDTH}3${SVG_PATH_END}${SVG_GROUP_END}${SVG_ELLIPSE_START_CX}36${SVG_ELLIPSE_CY}67${SVG_ELLIPSE_RX}6.9${SVG_ELLIPSE_RY}8${SVG_FILL}f88${SVG_ELLIPSE_END}${SVG_ELLIPSE_START_CX}80${SVG_ELLIPSE_CY}52${SVG_ELLIPSE_RX}6.9${SVG_ELLIPSE_RY}8${SVG_FILL}f88${SVG_ELLIPSE_END}${SVG_PATH_START}m28 50c4.2 6.7 9.6 4.6 11 4.1${SVG_FILL}none${SVG_STROKE}a00$${SVG_STROKE_LINECAP}${SVG_STROKE_LINEJOIN}${SVG_STROKE_WIDTH}3${SVG_PATH_END}${SVG_PATH_START}m61 49c0.04-0.13 6.3 1.1 9-5.6${SVG_FILL}none${SVG_STROKE}a00$${SVG_STROKE_LINECAP}${SVG_STROKE_LINEJOIN}${SVG_STROKE_WIDTH}3${SVG_PATH_END}${SVG_TAIL}`;
appendSVGImage('cherry');

// Generate the truchet tile image
svg = `${SVG_HEAD_WIDTH}128${SVG_HEIGHT}128${SVG_VERSION_XMLNS}${SVG_GROUP_TRANSLATE}(0 -169)${SVG_FILL_NONE}${SVG_STROKE}ff0">${SVG_PATH_START}m128 233a64 64 0 0 1-45-19 64 64 0 0 1-19-45${SVG_STROKE_WIDTH}32${SVG_PAINT_ORDER_NORMAL}${SVG_PATH_END}${SVG_PATH_START}m3e-7 233a64 64 0 0 1 64 64${SVG_STROKE_WIDTH}32${SVG_PAINT_ORDER_NORMAL}${SVG_PATH_END}${SVG_GROUP_END}${SVG_TAIL}`;
appendSVGImage('truchet');

// Generate the logo image
svg = `${SVG_HEAD_WIDTH}1300${SVG_HEIGHT}375${SVG_VERSION_XMLNS}${SVG_GROUP_TRANSLATE}(1.3 -1.3)${SVG_FILL}ff0${SVG_STROKE}aa0${SVG_STROKE_WIDTH}4.6">${SVG_PATH_START}m111 264 54-94c-22-12-47-17-72-13-52 8.5-92 54-92 108 0 60 49 109 109 109s109-49 109-109z${SVG_PATH_END}${SVG_PATH_START}m233 161v206h99v-76h8.8v76h99v-206h-99v76h-8.8v-76z${SVG_PATH_END}${SVG_PATH_START}m561 154c-61 0-110 49-110 110s49 110 110 110 110-49 110-110-49-110-110-110z${SVG_PATH_END}${SVG_PATH_START}m728 161c-28 0-51 25-51 51 0 27 18 45 47 50v2.1h-41v103h153c59 0 70-87 11-101v-2.1h36v-104z${SVG_PATH_END}${SVG_PATH_START}m1038 264h40v-103h-186v103h43v103h103z${SVG_PATH_END}${SVG_PATH_START}m1137 161c-28 0-51 25-51 51 0 27 18 45 47 50v2.1h-41v103h153c59 0 70-87 11-101v-2.1h36v-104z${SVG_PATH_END}${SVG_PATH_START}m66 140c36 0 65-29 65-65s-29-65-65-65h-65v130z${SVG_PATH_END}${SVG_PATH_START}m206 4.7c-38 0-69 31-69 69s31 69 69 69 69-31 69-69-31-69-69-69z${SVG_PATH_END}${SVG_PATH_START}m284 6v133h130v-130h-65v48z${SVG_PATH_END}${SVG_PATH_START}m515 75h25v-65h-117v65h27v65h65z${SVG_PATH_END}${SVG_PATH_START}m690 140c36 0 65-29 65-65s-29-65-65-65h-65v130z${SVG_PATH_END}${SVG_PATH_START}m764 9.2v130h68v-130z${SVG_PATH_END}${SVG_PATH_START}m843 9v130h108v-44h-27v-5.6h27v-31h-27v-5.6h27v-44z${SVG_PATH_END}${SVG_PATH_START}m1126 75h25v-65h-117v65h27v65h65z${SVG_PATH_END}${SVG_PATH_START}m1227 4.7c-38 0-69 31-69 69s31 69 69 69 69-31 69-69-31-69-69-69z${SVG_PATH_END}${SVG_GROUP_END}${SVG_TAIL}`
appendSVGImage('logo');

// Generate the fullscreen image
svg = `${SVG_HEAD_WIDTH}64${SVG_HEIGHT}64${SVG_VERSION_XMLNS}${SVG_GROUP_FILL}ff0${SVG_STROKE}880${SVG_STROKE_WIDTH}2">${SVG_PATH_START}m1 43v20h20l-6-6 7-7-8-8-7 7z${SVG_PATH_END}${SVG_PATH_START}m62 43v20h-20l6-6-7-7 8-8 7 7z${SVG_PATH_END}${SVG_PATH_START}m1 22v-20h20l-6 6 7 7-8 8-7-7z${SVG_PATH_END}${SVG_PATH_START}m62 22v-20h-20l6 6-7 7 8 8 7-7z${SVG_PATH_END}${SVG_GROUP_END}${SVG_TAIL}`;
appendSVGImage('fullscreen');

// Generate the windowed image
svg = `${SVG_HEAD_WIDTH}64${SVG_HEIGHT}64${SVG_VERSION_XMLNS}${SVG_GROUP_FILL}ff0${SVG_STROKE}880${SVG_STROKE_WIDTH}2">${SVG_PATH_START}m41 3v20h20l-6-6 7-7-8-8-7 7z${SVG_PATH_END}${SVG_PATH_START}m22 3v20h-20l6-6-7-7 8-8 7 7z${SVG_PATH_END}${SVG_PATH_START}m41 62v-20h20l-6 6 7 7-8 8-7-7z${SVG_PATH_END}${SVG_PATH_START}m22 62v-20h-20l6 6-7 7 8 8 7-7z${SVG_PATH_END}${SVG_GROUP_END}${SVG_TAIL}`;
appendSVGImage('windowed');

// #endregion

// #region -- Texture atlas and texture region

// Create the texture atlas and associated texture regions
let createTextureAtlas = () => {

  let
  x = 1, // Initial drawing position
  y = 100, // The first n pixels are used to generate score images (200, 400, 800, 1600, 3200), and also the tagline
  w = 0, // Dimensions of the atlas
  h = y,
  d = [], // Image drawing data

  tallestImage = 0, // Height of the tallest image in any row

  images = imageContainer.getElementsByTagName('*'); // Get all of the image DIV's children in an array

  // 
  // Begin by creating the texture regions and calculating how big the canvas needs to be to encapsulate all of the images
  // 

  for (let i = 0; i < images.length; i++) { // Process all images
    const image = images[i]; // Next image
    let id = image.id, // Get image ID
    width = image.width, // Get image dimensions
    height = image.height,
    paddedWidth = width + 2, // Add padding just to be safe when drawing
    paddedHeight = height + 2;

    if ((x + paddedWidth) > WIDTH) { // Will the entire image fit not onto the canvas in the current rows x-axis?
      // NO.. start a new row below the current one
      if (x > w) w = x;
      h += tallestImage;

      x = 1; // Reset x
      y += tallestImage; // Calculate y position for next row
      tallestImage = paddedHeight; // Current image is the tallest in the new row

    } // End "image does not fit on current row" check
    
    if (paddedHeight > tallestImage) tallestImage = paddedHeight; // Maintain the height of the tallest image on this row

    d.push({image, x, y}); // Save draw position

    textureRegions[id] = {id, x, y, width, height}; // Add a new `TextureRegion`

    x += paddedWidth; // Next x drawing position

  } // End "image processing" loop

  // 
  // Now create the canvas and draw all of the images to it
  // 

  atlas = D.createElement  ('canvas'); // Create a new canvas
  atlas.width = w; // Final calculated width
  atlas.height = h + tallestImage; // Final calculated height PLUS the height of the final image
  atlas_ctx = atlas.getContext('2d'); // Get drawing context

  for (let i = 0; i < d.length; i++) { // Draw all images
    const data = d[i]; // Next image data
    atlas_ctx.drawImage(data.image, data.x, data.y); // Draw the image onto the canvas
  }

  // 
  // All of the actual limages have been processed, but we also need to generate some images for bonus point values (munching ghosts and fruit)...
  // 

  x = 0; // Reset position to top left of canvas
  y = 0;

  let width, // Texture region dimensions
  height,
  b, // String bounds
  c, // Temp canvas
  t, // String for bonus point images

  points = 200; // Bonus point value

  for (let i = 0; i < 5; i++) { // We will make 5 bonus point images
    t = `${points}`; // Convert to string

    b = getStringDimensions(t); // Get string dimensions
    c = newCanvas(b.w, b.h); // Create canvas

    width = b.w / 2; // Get scaled dimensions
    height = b.h / 2;

    textureRegions[`b${t}`] = {t, x, y, width, height}; // Add a new `TextureRegion`

    drawString(1, 1, t, c.ctx); // Draw bonus string 

    // Convert to grayscale
    let map = c.ctx.getImageData(0, 0, b.w, b.h), // Get raw pixel data
    imdata = map.data, // Get the actual array of pixel data
    pr,
    pg,
    pb,
    avg;
    
    for(var p = 0, len = imdata.length; p < len; p += 4) { // Process all pixels
      pr = imdata[p] // Get red
      pg = imdata[p + 1]; // Get green
      pb = imdata[p + 2]; // Get blue
      avg = floor(((pr + pg + pb) * 1.25) / 3); // Get the average of all pixels and also make it a little brighter

      imdata[p] = imdata[p + 1] = imdata[p + 2] = avg; // Overwrite
    } // End "process pixels" loop
    c.ctx.putImageData(map, 0, 0); //Overwrite the pixels in the canvas

    atlas_ctx.drawImage(c, 0, 0, b.w, b.h, x, 0, width, height); // Draw bonus image to atlas

    x += b.w; // add the width (whould be /2 but meh)
    points *= 2; // Double the point value
  } // End "bonus point image generation" loop

  // 
  // Finally generate an image for the tagline (credits) that appear near the bottom of the main menu
  // 

  t = 'AN ANTIX DEVELOPMENT PRODUCTION FOR JS13K 2022';

  b = getStringDimensions(t); // Get string dimensions
  c = newCanvas(b.w, b.h); // Create canvas

  width = floor(b.w / 2.5); // Get scaled dimensions
  height = floor(b.h / 2.5);

  drawString(0, 0, t, c.ctx); // Draw bonus string 
  t = 'tag';
  x = 0;
  y = 50;

  textureRegions[t] = {t, x, y, width, height}; // Add a new `TextureRegion`

  atlas_ctx.drawImage(c, 0, 0, b.w, b.h, 0, 50, width, height); // Draw bonus image to atlas

  // getByID('t').appendChild(atlas);
},

// Get the texture region associated with the given name
getTextureRegion = (name) => textureRegions[name],

// #endregion

// #region -- User interface

// Get the width of the given string
getStringWidth = (str) => {
  let w = 0; // Width of the string in pixels
  for (let i = 0; i < str.length; i++) {
    let c = str.charCodeAt(i) - 48; // Subtract first char ('0')
    if ((c < 0) || c >= fontDescriptors.length) { // Was it anything less (includes space)
      w += SPACE_WIDTH; // Add whitespace
    } else {
      w += (fontDescriptors[c].w + SPACE_BETWEEN_CHARACTERS); // Add width
    }
  }
  return w;
},

// Get the dimensions of the given string
getStringDimensions = (str) => {
  let w = 0, // Width of the string
  h = 0, // Height of string
  c, // Char code
  d; // Font descriptor
  for (let i = 0; i < str.length; i++) { // Process all chars
    c = str.charCodeAt(i) - 48; // Subtract first char ('0')
    if ((c < 0) || c >= fontDescriptors.length) { // Any illegal chars become white-space
      w += SPACE_WIDTH; // Add whitespace
    } else {
      d = fontDescriptors[c]; // Get descriptor
      w += (d.w + SPACE_BETWEEN_CHARACTERS); // Add width
      if (d.h > h )h = d.h; // Keep largest height
    }
  } // End "process chars" loop
  return {w, h}; // Return the dimensions object
},

// Render the given string into the given drawing context at the given coordinates
drawString = (x, y, str, ctx) => {
  let r, // TextureRegion
  c, // Char code
  d; // Font descriptor

  for (let i = 0; i < str.length; i++) { // Process all characters

    c = str.charCodeAt(i) - 48; // Subtract first char ('0')

    if ((c < 0) || c >= fontDescriptors.length) { // Was it anything less (includes space)
      x += SPACE_WIDTH; // Add whitespace

    } else { // A valid character was found

      d = fontDescriptors[c]; // Get descriptor

      r = getTextureRegion(d.i); // Get texture region

      ctx.drawImage(atlas, r.x, r.y, r.width, r.height, x, y, r.width, r.height); // Draw the character at the coordinates

      x += (r.width + SPACE_BETWEEN_CHARACTERS); // Adjust position for next char

    } // End "valid char" check

  } // End "process chars" loop
},

// Calculate the x position for the given string to be rendered centered on the screen
centerString = (s) => (WIDTH - getStringWidth(s)) / 2,

// Calculate the x position for the given width so an arbitrary object can be rendered centered on the screen
centerOnXAxis = (w) => (WIDTH - w) /2,

// Start the scene fading out
transitionOut = (func) => {
  callback = func; // Save callback
  fadeInOutCounter = 1; //Set full visibility
  setMode(MODE_FADE_OUT); // Set fading out mode
},

// Start the scene fading in
transitionIn = (func) => {
  callback = func; // Save callback
  fadeInOutCounter = 0; // Set invisible
  setMode(MODE_FADE_IN); // Set fading in mode
},

// Another menu was closed
activeMenuClosed = () => {
  if (activeMenu.onClose) activeMenu.onClose(activeMenu); // execute callback
  showElement(activeMenu.div, false); // Hide menu
  activeMenu = null; // Other menu is now closed
  openMenu(nextMenu); // Open the next menu
},

// Open the given menu, but if another menu is already open, close that first
openMenu = (m) => {
  if (activeMenu) { // Is another menu already open?

    nextMenu = m; // Set the nenu we want to open, once the active menu is closed
    enableElement(activeMenu.div, false); // Disable active menu
    if (activeMenu.beforeClose) activeMenu.beforeClose(activeMenu); // Execute callback

    transitionOut(activeMenuClosed); // Fade out active menu, then open the next menu
    
  } else { // There is no other menu open

    if (!m.created) { // Has the menu already been created?

      let
      r, // Texture region
      c, // Canvas
      i, // HTML img
      b, // Dimensions ({w, h})

      d = createElement('div'); // HTML div where the menu elements will be grouped
      d.classList.add('m', 'a', 'h', 'd'); // menu, full width/height, anchored and positioned at top left, hidden, and disabled
      gameContentContainer.appendChild(d); // Attach the div to the document body
      m.div = d;

      for (let j = 0; j < m.widgets.length; j++) { // Process all widgets
        const w = m.widgets[j]; // Next widget

        w.p = m; // Set manu as widgets parent

        if (w.t === 'img') { // Is it an image?

          w.images = []; // Create an empty array to hold the encoded images
          for (let k = 0; k < w.regions.length; k++) { // Process all regions

            r = getTextureRegion(w.regions[k]); // Next region
            c = newCanvas(r.width, r.height); // Create a new canvas
            c.ctx.drawImage(atlas, r.x, r.y, r.width, r.height, 0, 0, r.width, r.height); // Draw the image
            w.images.push(c.toDataURL()); // Encode and add to the array
          } // End "create encoded images" loop

          i = createElement(w.t); // Create the HTML img element
          i.classList.add('a'); // Position it absolutely

          i.src = w.images[0]; // Set the images source to be the first image in the images array
          setElementPosition(i, (w.c) ? centerOnXAxis(r.width) : w.x, w.y); // Position element
          d.appendChild(i); // Append the element to the menus container
          w.i = i; // Set widget image

          if (w.onClick) { // Does the widget have an onclick callback?
            i.onclick = () => {w.onClick(m)}; // Set onclick callback
            i.id = 'b'; // Make it an image button
          } // End "widget has onclick callback" check
          
        } else { // It must be a button

          b = getStringDimensions(w.l);
          c = newCanvas(b.w, b.h);
          drawString(0, 0, w.l, c.ctx);
          i = createElement('img');
          i.id = w.id;
          i.classList.add('a');
          i.src = c.toDataURL();
          d.appendChild(i);
          setElementPosition(i, (w.c) ? centerOnXAxis(b.w) : w.x, w.y);

          if (w.onClick) { // Does the widget have an onclick callback?
            i.onclick = () => {w.onClick(m)}; // Set onclick callback
            i.id = 'b'; // Make it a button
          } // End "widget has onclick callback" check

          w.i = i;

        } // End "widget type" test
        
      } // End "create widgets" loop

      m.created = true;
    
    } // End "menu created check"

    if (m.beforeOpen) m.beforeOpen(m); // Execute callback

    showElement(m.div, true); // Show menu
    enableElement(m.div, false); // Disable menu (possibly not required)

    // Begin fading in
    transitionIn(() => { // This callback once the menu has fully faded in
      activeMenu = m; // Set as active menu
      if (m.onOpen) m.onOpen(m); // execute callback
      enableElement(m.div, true); // Enable menu
    }); // Begin fade in

  } // End "another menu is open" check

};

// Show or hide the widgets in the given array of widgets, according to the given array of indexes
toggleWidgetVisibilityByIndex = (widgets, indexes) => {
  for (let j = 0; j < indexes.length; j++) {
    let idx = indexes[j];
    (idx < 0) ? showElement(widgets[-idx].i, true) : showElement(widgets[idx].i, false); // Hide postive indexed widgets, and show negative indexed ones
  }
},

// Set the given widgets label to the given text
setWidgetLabel = (w, t) => {
  if (w.i) { // Only update widgets with existing images
    
    w.l = t; // Set new text

    let i = w.i, // HTML img
    b = getStringDimensions(w.l),
    c = newCanvas(b.w, b.h); // Create a new canvas
    
    drawString(0, 0, w.l, c.ctx);
    i.src = c.toDataURL();
    setElementPosition(i, (w.c) ? centerOnXAxis(b.w) : w.x, w.y);

  } // End "image exists" check
  
};

//#endregion

// #region -- DOM event handlers

// Fix timing issues when browser tab not visible or browser in background
D.onvisibilitychange = () => {
  if (document.visibilityState === "hidden") {
    paused = true;
  } else {
    lastFrame = Date.now(); // Reset time since last enterFrame event
    paused = false;
  }
};

// Handle pointer down event for mobile devices
W.onpointerdown = (e) => {
  if (keysEnabled) { // Don't do anything if the keyboard is locked

    if (e.clientX < W.innerWidth / 2) { // Touched on left side of screen?
      goLeft = true;
      goRight = false;
      
    } else { // Must have been touched on right side

      goRight = true;
      goLeft = false;
    } // End "touched on left" check

  } // End "keys enabled" check
};

// Handle pointer up event for mobile devices
W.onpointerup = (e) => {
  if (keysEnabled) { // Don't do anything if the keyboard is locked

    if (e.clientX < W.innerWidth / 2) { // Released on left side of screen?
      goLeft = false;
      
    } else { // Must have been released on right side
      goRight = false;
  
    } // End "released on left" check

  } // End "keys enabled" check
};

// Handle key down events
W.onkeydown = (e) => {
  if (keysEnabled) { // Don't do anything if the keyboard is locked

    showCursor(false); // Hide the cursor

    let k = e.keyCode; // Get the key that was pressed or held down

    if ((k === 37) || (k === OPTIONS.c.l.k)) { // Left arrow or Z
      goLeft = true;
      
    } else if ((k === 39) || (k === OPTIONS.c.r.k)) { // Right arrow or X
      goRight = true;
    }
  } // End "keys enabled" check
};

// Handle key up events
W.onkeyup = (e) => {
  let k;

  if (waitingForKeyUp) { // Are we waiting for a new control key to be pressed?

    // 
    // A new control key has been pressed. Update the control key variables in `OPTIONS`, and update the options menu display accordingly
    // 

    k = e.key.toUpperCase(); // Get the ASCII representation of the key code and make it UPPER case
    keyToChange.k = e.keyCode; // Set the raw keycode in options
    keyToChange.c = k; // Set the ASCII code in options

    setWidgetLabel(labelToUpdate,  k); // Update the key readout
    waitingForKeyUp = false; // No longer waiting for a control key

    for (let j = 0; j < optionsMenu.widgets.length; j++) { // Show all of the option widgets
      showElement(optionsMenu.widgets[j].i, true);      
    }
    showElement(optionsMenu.widgets[10].i, false); // Hide the new control key prompt

    optionsChanged = true; // When closing the options menu the options will be saved

  } else if (keysEnabled) { // Don't do anything if the keyboard is locked
    
    // 
    // Normal key pressed during gameplay
    // 

    k = e.keyCode; // Get the key that was pressed or held down

    if ((k === 37) || (k === OPTIONS.c.l.k)) { // Left arrow or Z
      goLeft = false;
      
    } else if ((k === 39) || (k === OPTIONS.c.r.k)) { // Right arrow or X
      goRight = false;

    } // End "which key is released" check

  } // End "waiting for control key" check
};

W.onresize = rescale; // Set rescaling when browser window is resized

// Show the cursor when the mouse is moved
W.onmousemove = () => showCursor(true);

// Save the options (if they were changed) when the browser window/tab is closed
W.onbeforeunload = saveOptions;

// 
// NOTE: THE FOLLOWING CODE BLOCK IS WHAT ACTUALLY INITIALIZES AND STARTS THE APPLICATION RUNNING.
// 

// Add event handler for when the page has fully loaded, which is required for the texture atlas to be correctly created
W.onload = () => {
 
  gameContentContainer = getByID('g'); // Get the game content container

  // Create sound bank
  fx_add([2.07,706,.01,.01,.02,2,.87,0,0,0,0,0,0,24,0,.06,.9,.01,0]); // FX_BUTTON
  fx_add([.35,1,.01,.01,.01,2,.49,0,0,0,0,.07,0,-6.6,.4,.25,1,0,0]); // FX_MUNCH
  fx_add([1,568,.05,.3,.32,0,1.32,0,0,47,.08,.11,.2,0,0,0,.65,.21,0]); // FX_MUNCH_GHOST
  fx_add([.3,91,.02,.04,.07,2,.63,18,0,0,0,0,.9,0,0,0,.87,.01,0]); // FX_BOUNCE
  fx_add([1.1,684,.07,.19,.38,1,1.44,0,-3.4,-22,.03,.1,0,0,0,0,.63,.2,.08]); // FX_DIED
  fx_add([1.03,171,.02,.24,.44,2,1.65,1.2,.9,131,.02,.02,0,0,.1,0,.72,.15,.18]); // FX_PREPLAY
  fx_add([1,182,.1,.27,.44,2,.16,0,0,457,.08,.04,0,7.8,0,0,.68,.2,0]); // FX_POWERUP
  fx_add([1,374,.07,.28,.47,2,1.92,0,7.9,100,.02,.11,0,9.5,0,0,.98,.29,0]); // FX_CHERRY
  fx_add([1,.05,262,0,.2,.35,2,1.39,9.4,0,18,.15,.11,0,0,0,0,.53,.22,0]); // FX_LEVEL_COMPLETE
  fx_add([1.19,79,.07,.15,.49,2,1.41,0,0,244,.02,.04,0,30,0,.08,.94,.27,0]); // FX_NEW_BEST_SCORE

  createTextureAtlas(); // Create texture alas and associated texture regions

  OPTIONS = STORAGE.getItem(NAMESPACE);
  (!OPTIONS) ? resetOptions() : OPTIONS = JSON.parse(OPTIONS);
  
  bestScore = OPTIONS.b; // Set the previous best score

  // Generate a  bunch of random x and y coordinate pairs to represent stars (no z required, it is derived later)
  for (let t = 0; t < 96; t++) { // Generate this many stars (MUST be evenly divisible by the number of layers)
    STARS.push([random() * WIDTH, random() * 870]); // Push random coordinates
  }
  
  D.body.removeChild(getByID('l')); // Get rid of the loading screen

  createBackground(); // Create background with horizon line

  fg_canvas = newCanvas(WIDTH, HEIGHT); // Create the main canvas where the game scene will be drawn
  fg_canvas.id = 'c';
  
  gameContentContainer.appendChild(fg_canvas); // Append the main canvas to the HTML page
  fg_ctx = fg_canvas.ctx; // Get the main canvas graphics conotext

  // 
  // Load options from local storage. If they don't exist... create them
  // 
  
  rescale(); // Perform initial display rescaling

  openMenu(mainMenu); // Start the main menu opening

  lastFrame = Date.now(); // Set the last EnterFrame event time

  onEnterFrame(); // Request the first actual EnterFrame event
};

//#endregion

// #region -- Gameplay functions

// Set the game mode to the given mode
let setMode = (mode) => gameMode = mode,

// Clear the background canvas and draw the horizon line
clearBackground = () => fg_ctx.clearRect(0, 0, WIDTH, HEIGHT),

// Award the given number of points to the player
awardPoints = (n) => {
  score += n; // Add the points

  if (!bestScoreBeaten) { // Has the best score already been beaten in this game?

    if (score > bestScore) { // Has the player got a new best score?
  
      bestScoreBeaten = true; // Set flag so the following code is only executed once per game

      fx_play(FX_NEW_BEST_SCORE);
  
      // Spawn some particle stars in a circle that leave the game scene quickly

      let direction = 0,
      speed = 600;

      for (let i = 0; i < 30; i++) { // Spawn 30 stars
        particles.push({
          x: WIDTH / 2, // Set position
          y: SCORE_Y,
          vx: cos(direction) * speed, // Set velocity
          vy: sin(direction) * speed,
          r: 28,
          i: 'star',
        });
        direction += PI2 / 30;
      }

    } // End " new best score" check
  } // End "best score beaten" check
},

// Advance the game to the next level, reseting the entire game if `reset` is true
nextLevel = (reset = false) => {
  if (reset) { // Was a full reset requested? (new game)
 
    score = 0;
    level = 0;

    ghostTurningPeriodBase = 10; // Reset difficulty
    ghostTurningPeriodVariance = 5;
    ghostSpeedX = 200;

    gameOver = false;

    bestScoreBeaten = false;

  } // End "full reset" check

  level ++; // Increment level

  numberOfDotsSpawned = 0; // Reset dot related variables
  remainingDots = 0;
  allDotsSpawned = false;

  ghostsAreScared = false; // Ghosts are not scared

  cherrySpawnDelay = 20; // Reset cherry related variables
  cherryMunched = false;
  cherrySpawned = false;

  goLeft = false; // Reset movement variables
  goRight = false;

  // Create player
  player = {
    x: WIDTH / 2,
    y: PLAYER_Y,
    r: 64,
    f: [0, 1, 2, 3, 4, 3, 2, 1],
    c: 0,
    facingLeft: false,
    draw: true,
  };

  // Create ghosts
  ghosts = [];
  let m = 1; // Multiplier used to make each ghost behave differently (not much but a little maybe)

  for (let i = 0; i < 4; i++) { // Spawn 4 ghosts, with each one being a bit faster than the previous one

    ghosts.push({
      id: i,
      x: randomInt(24, WIDTH - 48), // Set random position
      y: -randomInt(128, HEIGHT),
      vx: (random() < 0.5) ? -ghostSpeedX : ghostSpeedX, // 50/50 chance to be moving left or right
      vy: 0,
      r: 64,
      gravity: 5,
      multiplier: m, // Difficulty multiplier so each ghost is slightly faster than the previous
      facingLeft: false, // True if the ghost is facing right
      turning: false, // True if the ghost is changing direction
      turningLeft: false, // True if the ghose is turning to the left
      turnTimer: (random() * ghostTurningPeriodBase) + ghostTurningPeriodVariance, // Random period until the ghost will change direction
      munched: false, // True if the ghost was munched by the player, and is returning to the ghost house (off top of screen)
      canCollide: true,
      scared: false,
      draw: true,
      frames: [i, 4, i, 4, i, 4] // Animation frames used when `ghostAreScaredCounter` is nearing expiry
    });
    m += .25;
  }

  ghostTurningPeriodBase = clamp(ghostTurningPeriodBase - 1.97, 5, 10); // Scale turning speed of ghosts
  ghostTurningPeriodVariance = clamp(ghostTurningPeriodVariance - .09, 3, 5);
  ghostSpeedX = clamp(ghostSpeedX - 17, 100, 200);

  // Clear dots
  dots = [];
  pills = [];

  bonusImages = [];

  particles = [];

  openMenu(prePlayMenu); // Open the play menu
};

// Create a simple random background pattern using Truchet Tiles (https://en.wikipedia.org/wiki/Truchet_tiles)
let createBackgroundPattern = () => {

  bg_ctx.clearRect(0, 0, WIDTH, 890);

  bg_ctx.save();

  bg_ctx.globalAlpha = .075; // NOTE: Could just make the SVG opaque
  
  bg_ctx.beginPath(); // Clip the canvas so nothing gets drawn on or below the horizon line
  bg_ctx.rect(0, 0, WIDTH, 890);
  bg_ctx.clip();

  let textureRegion = getTextureRegion('truchet'); // The reversable tile

  for (let r = 0; r < 896 / 128; r++) { // Draw this many rows of tiles

    for (let c = 0; c < WIDTH / 128; c++) { // Draw this many columns of tiles
      bg_ctx.save();

      if (random() < .5) { // 50/50 chance to draw normally, or mirrored on the x-axis
        // Draw normally
        bg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, (c * 128), (r * 128), textureRegion.width, textureRegion.height,);
      
      } else { // Draw mirrored on x-axis

        bg_ctx.translate((c * 128), 0);
        bg_ctx.scale(-1, 1);
        bg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, 0, (r * 128), -textureRegion.width, textureRegion.height,);
      }
      bg_ctx.restore();

    } // End "col" loop

  } // End "row" loop
  bg_ctx.restore();
},

// Create the background canvas containing the horizon line, and attach it to the document body
createBackground = () => {
  bg_canvas = newCanvas(WIDTH, HEIGHT);
  bg_canvas.id = 'c';
  bg_ctx = bg_canvas.ctx;

  gameContentContainer.appendChild(bg_canvas); // Attach to document

  gradient = bg_ctx.createLinearGradient(0, 890, 0, 900); // Create a gradient, used to simulate a ground or horizon line
  gradient.addColorStop(0, '#001');
  gradient.addColorStop(.3, '#00f');
  gradient.addColorStop(1, '#001');
  
  // Clear canvas (top part)
  bg_ctx.fillStyle = '#001';
  bg_ctx.fillRect(0, 0, WIDTH, 890);

  // Clear canvas (bottom part)
  bg_ctx.fillStyle = '#000014';
  bg_ctx.fillRect(0, 890, WIDTH, HEIGHT - 890);

  // Draw gradient
  bg_ctx.fillStyle = gradient;
  bg_ctx.fillRect(0, 890, WIDTH, 10);

};

// #endregion

// #region -- Menu definitions

let mainMenu = {
  onOpen: () => {
    setMode(MODE_MAIN_MENU)
  },
  
  beforeOpen: (m) => {
    setWidgetLabel(m.widgets[1], `BEST ${bestScore}`);
    parallaxStarsEnabled = true;
    showCursor(true);
    m.widgets[4].i.style.opacity = '.4';

    bg_canvas.ctx.clearRect(0, 0, WIDTH, 890);
  },

  widgets: [
    { // Logo image (0)
      t: 'img',
      y: 32,
      c: true,
      regions: ['logo'], // TextureRegions
      // i: 'logo', // TextureRegion
    },

    { // Best score label (1)
      t: 'a',
      y: 475,
      c: true,
      l: '',
    },

    { // Options menu button (2)
      t: 'a',
      y: 615,
      c: true,
      l: 'OPTIONS',
      onClick: () => {
        fx_play(FX_BUTTON);
        openMenu(optionsMenu);
      }
    },

    { // Start game button (3)
      t: 'a',
      y: 750,
      c: true,
      l: 'PLAY',
      onClick: () => {
        fx_play(FX_BUTTON);
        showCursor(false);

        nextLevel(true);}
    },

    { // Tagline image (4)
      t: 'img',
      y: 1024,
      c: true,
      regions: ['tag'],
      // i: 'tag', // TextureRegion
    },

    { // Toggle fullscreen image button (5)
      t: 'img',
      x: WIDTH - 80,
      y: 16,
      // i: 'fullscreen', // TextureRegion
      regions: ['fullscreen', 'windowed'], // TextureRegions

      onClick: (m) => {

        fx_play(FX_BUTTON);

        let w = m.widgets[5];

        if (fullScreen) { // Is the game already in fullscreen mode?

          if (document.exitFullscreen) { // Is the browser not safari?
            document.exitFullscreen();

          } else if (document.webkitExitFullscreen) { // Is the browser safari?

            document.webkitExitFullscreen();
          } // End "safari" check

          w.i.src = w.images[0];

        } else { // The game is NOT in fullscreen mode
          
          let el = D.documentElement;

          if (el.requestFullscreen) { // Is the browser not safari?
            el.requestFullscreen();

          } else if (el.webkitRequestFullscreen) { // Is the browser safari?

            el.webkitRequestFullscreen();
          } // End "safari" check

          w.i.src = w.images[1]; // Set "windowed" image

        } // End "in fullscreen" check

        fullScreen = !fullScreen; // Toggle fullscreen flag
      },
    },

  ],
},

optionsMenu = {
  onOpen: () => {
    setMode(MODE_OPTIONS_MENU);
  },

  beforeOpen: (m) => {
    setWidgetLabel(m.widgets[2], OPTIONS.c.l.c); // Set control key readouts
    setWidgetLabel(m.widgets[5], OPTIONS.c.r.c);

    for (let j = 4; j < 9; j++) { // Show all of the options widgets
      showElement(m.widgets[j].i, true);
    }
    showElement(m.widgets[10].i, false); // Hide the control key prompt label

    let t;
    (OPTIONS.a) ? t = 'ENABLED': t = 'DISABLED';
    setWidgetLabel(m.widgets[8],t);
  },

  widgets: [
    { // Options title (0)
      t: 'a', // Title label
      y: 64,
      c: true,
      l: 'OPTIONS',
    },
   
    { // Left key title (1)
      t: 'a',
      x: WIDTH / 2 - (128 + getStringWidth('LEFT')),
      y: 250,
      l: 'LEFT',
      // onClick: () => {openMenu(mainMenu);}
    },

    { // Left key readout (2)
      t: 'a',
      x: 850,
      y: 250,
      l: '',
      c: true,
      id: 'lk',
    },

    { // Left key change button (3)
      t: 'a',
      x: 1100,
      y: 250,
      l: 'CHANGE',
      onClick: (m) => {
        fx_play(FX_BUTTON);

        waitingForKeyUp = true;
        keyToChange = OPTIONS.c.l; // Which key to change
        labelToUpdate = m.widgets[2]; // This widget will have its text updated once the new control key is pressed

        for (let j = 4; j < 9; j++) {
          showElement(m.widgets[j].i, false);
        }
        showElement(m.widgets[10].i, true); // Show the new controll key prompt
      }
    },

    { // Right key title (4)
      t: 'a',
      x: WIDTH / 2 - (128 + getStringWidth('RIGHT')),
      y: 400,
      l: 'RIGHT',
    },

    { // Right key readout (5)
      t: 'a',
      x: 850,
      y: 400,
      l: '',
      c: true,
      id: 'rk',
    },

    { // Right key change button (6)
      t: 'a',
      x: 1100,
      y: 400,
      l: 'CHANGE',
      onClick: (m) => {
        fx_play(FX_BUTTON);
        waitingForKeyUp = true;
        keyToChange = OPTIONS.c.r; // Which key to change
        labelToUpdate = m.widgets[5]; // This widget will have its text updated once the new control key is pressed

        toggleWidgetVisibilityByIndex(m.widgets, [1, 2, 3, 7, 8, -10]);
      }
    },

    { // Sound title (7)
      t: 'a',
      x: 530,
      y: 550,
      l: 'SOUND',
    },

    { // Sound toggle button (8)
      t: 'a',
      x: 1040,
      y: 550,
      l: 'W',
      id: 'ts',
      onClick: () => {
        OPTIONS.a = !OPTIONS.a;
        let t;
        (OPTIONS.a) ? t = 'ENABLED': t = 'DISABLED';
        setWidgetLabel(optionsMenu.widgets[8], t);
        optionsChanged = true;
        fx_play(FX_BUTTON);
      }
    },

    { // Back button (9)
      t: 'a',
      y: 750,
      c: true,
      l: 'BACK',
      onClick: () => {
        fx_play(FX_BUTTON);
        saveOptions();
        openMenu(mainMenu);
      }
    },

    { // Press new key prompt (10)
      t: 'a', // Back button
      y: 550,
      c: true,
      l: 'PRESS NEW KEY A=Z 0=9',
      h: true, // Hidden
    },


  ]
},

prePlayMenu = {
  onOpen: () => {
    setMode(MODE_PREPLAY);
  },

  beforeOpen: (m) => {
    fx_reset(); // reset audio to fix issue where some random sound plays over and ver louder and louder.. it's too strange. Anyhoo, this fixes that ;)

    clearBackground();

    bg_ctx.clearRect(0, 0, WIDTH, 890);
    fx_play(FX_PREPLAY);

    prePlayCounter = 2;
    parallaxStarsEnabled = false;
    setWidgetLabel(m.widgets[0], `LEVEL ${level}`);
  },

  widgets: [
    { // Level readout label (0)
      t: 'a',
      // x: 0,
      y: 750,
      c: true,
      l: '',
      id: 'll',
    }
  ],
},

playMenu = {
  onOpen: () => {
    levelEnded = false;
    keysEnabled = true;
    setMode(MODE_PLAY);
  },

  beforeOpen: (m) => {
    showElement(m.widgets[0].i, false);
    createBackgroundPattern(); // Create a new random background pattern
  },

  beforeClose: () => {
    keysEnabled = false;
    collisionEnabled = true;
    parallaxStarsEnabled = false;
  },

  widgets: [
    { // Game over label (0)
      t: 'a',
      y: HEIGHT / 2,
      c: true,
      l: 'YOU DIED TO GHOSTS',
      h: true, // Hidden
    },

  ]
};

// #endregion

// #region -- Main game logic loop

// Main game logic
let onEnterFrame = () => {

  if (!paused) {

    // let start = performance.now();

    scoreUpdateRequired = false; // No update required

    // 
    // Calculate the time elapsed (in seconds) since the last EnterFrame event
    // 

    thisFrame = Date.now();
    DT = (thisFrame - lastFrame) / 1000;
    lastFrame = thisFrame;

    // Update and draw particles
    let updateParticles = () => {
      for (let i = particles.length - 1; i >= 0; i--) { // Iterate backwards to resolve removal issues
    
        const particle = particles[i]; // Next particle
    
        if (particle.gy) { // Is this particle effected by gravity?
          particle.vy += particle.gy;
          
        }
        particle.x += particle.vx * DT; // Update position
        particle.y += particle.vy * DT;
    
        if (particle.y >= HEIGHT + 80 || particle.y < -80 || particle.x < -80 || particle.x > WIDTH + 80) { // Particle no longer visible?

          particles.splice(i, 1); // Remove particle
          
        } else { // Particle is visible
          
          textureRegion = getTextureRegion(particle.i); // Get image
          fg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, particle.x - particle.r, particle.y - particle.r, textureRegion.width, textureRegion.height); // Draw particle
      
        } // End "particle visible" check
        
      } // End "particle update" loop
    
    };

    // 
    // Application logic proceeds now according to `gameMode`
    // 

    switch (gameMode) {

      // 
      // When `gameMode` is `MODE_PREPLAY`, the game is counting down till it transitions to `MODE_PLAY`. During this time the "level n" text is displayed
      // 

      case MODE_PREPLAY:
  
        prePlayCounter -= DT; // Count-down
        if (prePlayCounter <= 0) { // Timer expired?
          setMode(MODE_NONE);
          openMenu(playMenu); // Begin the play menu opening
        } // End "timer expired" check
        break;

      // 
      // When `gameMode` is `MODE_POSTPLAY`, the game is counting down till it transitions to `MODE_MAINMENU`
      // 

      case MODE_POSTPLAY:

        clearBackground();
        updateParticles();

        postPlayCounter -= DT; // Count-down
        if (postPlayCounter <= 0) { // Timer expired?
          setMode(MODE_NONE);
          openMenu(mainMenu); // Begin the play menu opening
        } // End "timer expired" check
        break;

      // 
      // When `gameMode` is `MODE_PLAY`, the player is trying to not die to ghosts!
      // 

      case MODE_PLAY:

        let pill,
        textureRegion,

        direction,
        speed

        playerY = player.y - player.r, // Get the top of the player

        // Return true of the other (ghost, dot, cherry) collided with the player
        collidedWithPlayer = (other) => {
          if (other.canCollide && ((other.y + other.r) > playerY)) { // Can the dot possibly be colliding with the player?
            return (M.hypot(player.x - other.x, player.y - other.y) <= player.r + other.r);
          }
          return false;
        },

        // Draw the given actor (player or ghost) to the canvas
        drawActor = (a)  => {
          if ((a.draw) && (!gameOver)) {
           
            fg_ctx.save(); // Save state

            if (a.facingLeft) {
              // Flip context, scale, and draw going left
              fg_ctx.translate(a.x - a.r, 0);
              fg_ctx.scale(-1, 1);
              fg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, 0, a.y - a.r, -textureRegion.width, textureRegion.height,);

            } else {
              // Draw going right
              fg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, a.x - a.r, a.y - a.r, textureRegion.width, textureRegion.height,);
            }
            fg_ctx.restore(); // Restore state
          }
        };

        clearBackground(); // Clear the background and draw the horizon line

        // 
        // Gradually spawn dots untill all dots are spawned, then spawn the 4 power pills, and stop then spawning any more dotty things
        // 

        if (!allDotsSpawned) { // Only proceed if there are dots remaining to be spawned

          dotSpawnDelay -= DT; // Count down to next dot spawn event
          if (dotSpawnDelay <= 0) { // Did the timer expire?
            dotSpawnDelay += DOT_SPAWN_DELAY; // Reset for next dot spawn

            if (numberOfDotsSpawned < 244) { // Should another dot be spawned?
              // Spawn a new dot
              dots.push({
                x: randomInt(24, WIDTH - 48),
                y: -randomInt(32, HEIGHT),
                vy: MAX_DOT_VELOCITY,
                r: 16,
                bounced: false,
                gravity: DOT_GRAVITY,
                canCollide: true,
                draw: true,
                f: [0],
                c: 0,
              });
              numberOfDotsSpawned ++; // Increment counters
              remainingDots ++;

            } else if (numberOfDotsSpawned === 244) { // Should a power pill be spawned?
          
              for (let i = 0; i < MAX_PILLS; i++) { // Spawn 4 power pills
                pill = {
                  x: randomInt(24, WIDTH - 48),
                  y: -randomInt(32, HEIGHT),
                  vy: MAX_DOT_VELOCITY,
                  r: 40,
                  isPill: true,
                  bounced: false,
                  gravity: DOT_GRAVITY,
                  canCollide: true,
                  draw: true,
                  f: [0,0,0,0,0,0,0,1],
                  c: random(),
                };
                dots.push(pill);
                pills.push(pill);

              }
              numberOfDotsSpawned ++; // Increment by one so this block doesn;t get executed more than once
              remainingDots += MAX_PILLS; // Add the number of power pills ot the total number of dots remaining

              allDotsSpawned = true; // All dots arte now spawned!

            } // End "should another dot or power pill be spawned" check
                  
          } // End "dot spawn delay expired" check

        } // End "all dots spawned" check

        // 
        // Process dots
        // 

        for (let i = dots.length - 1; i >= 0; i--) { // Iterate backwards to resolve removal issuess

          let dot = dots[i]; // Next dot

          dot.vy = clamp(dot.vy + dot.gravity, -500, 500); // Apply gravity to, and constrain velocity
          dot.y += dot.vy * DT; // Move the dot
          if (dot.bounced) { // Has the dot bounced?

            // The dot now falls until it leaves the screen, whereon it is reset at a random x position off the top of the screen

            if (dot.y >= HEIGHT + 96) { // Has the dot left the screen on the y-axis?

              dot.x = randomInt(24, WIDTH - 48); // Reset random x position
              dot.y = -96; // Reset y position off top of screen
              dot.gravity = DOT_GRAVITY; // Reset gravity
              dot.bounced = false; // Reset bounced flag
            } // End "left screen" check
          
          } else { // The dot has not bounced

            if (dot.y >= 950 ) {
              dot.y -= dot.vy * DT; // Reflect movement
              dot.vy = -dot.vy; // Reverse velocity so the dot will move upwards
              dot.gravity = 14 + random(); // Give the dot some special gravity
              dot.bounced = true; // Set dot has bounced flag
            }

          } // End "dot bounced" check

          // 
          // The dot has been moved to its new position, now check to see if it was munched by the player
          // 

          if (collidedWithPlayer(dot)) { // Can the dot possibly be colliding with the player?

            dots.splice(i, 1); // Remove dot

            dot.draw = false; // Don't draw this dot

            if (dot.isPill) { // Is this dot a power pill?
                
              awardPoints(50); // Award the player some points

              fx_play(FX_POWERUP);

              for (let j = 0; j < pills.length; j++) {
                pills[j].canCollide = false;
              }

              ghostsAreScaredTimer = GHOST_ARE_SCARED_DURATION; // Length of time that ghosts are scared (can be munched)
              ghostsAreScared = true; // Ghosts are now scared!

              for (let j = 0; j < ghosts.length; j++) {
                ghosts[j].scared = true;
              }
              
              bonusPoints = 200;

            } else { // No.. it's just a normal dot


              awardPoints(10); // Award the player some points

              fx_play(FX_MUNCH);

              // Spawn some random particles that shoot off in random directions.. just for the hell 
              direction = random() * PI2;
            
                  // Spawn some particle stars
                  for (let i = 0; i < 3; i++) {
                    particles.push({
                      x: player.x, // Set position
                      y: player.y,
                      vx: cos(direction) * 1500, // Set velocity
                      vy: sin(direction) * 1500,
                      r: 6,
                      i: `star${randomInt(1, 2)}`,
                    });
                    direction += PI2 / 3;
                  }
              
            } // End "pill type" check

            remainingDots -= 1;
            if (remainingDots <= 0) { // Have all dots been munched?
              levelEnded = true;
              player.draw = false;
              keysEnabled = false;
              collisionEnabled = false;

              fx_play(FX_LEVEL_COMPLETE);

              nextLevel();
            } // End "all dots munched" check

          } // End "dot colliding with player" check

          // 
          // Finally draw the dot
          // 

          if ((dot.draw) && (!gameOver)) { // Only draw dots if the level has not ended

            textureRegion = getTextureRegion(`dot${dot.r * 2}${dot.f[floor(dot.f.length * dot.c)]}`); // Get dot image

            fg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, dot.x - dot.r, dot.y - dot.r, textureRegion.width, textureRegion.height); // Draw dot
  
            dot.c += DT; // Increment animation counter
            if (dot.c >= 1) dot.c -= 1; // Reset
              
          } // End "draw dot" check

        } // End "process dots" loop

        // 
        // Process ghosts
        // 

        if (ghostsAreScared) { // Are the ghosts scared?
          ghostsAreScaredTimer -= DT; // Count-down to scared time ended
          if (ghostsAreScaredTimer <= 0) { // Has the timer expired?
            ghostsAreScared = false; // Ghosts are no longer scared

            for (let j = 0; j < pills.length; j++) { // Make all power pills munchable
              pills[j].canCollide = true; // Power pill is munchable
            }

            for (let j = 0; j < ghosts.length; j++) { // Make all ghosts able to collide with the player
              ghosts[j].scared = false; // Ghost can collide with player
            }

          } // End "scared time expired" check
        } // End "ghosts scared" check
        
        for (let i = ghosts.length - 1; i >= 0; i--) { // Process all ghosts

          let ghost = ghosts[i]; // Next ghost

          if (ghost.munched) { // Has the ghost been munched by the player?

            ghost.turning = false; // Not turning
            ghost.facingLeft = false; // Face right
            ghost.vx = 0; // Don;t move left or right
            ghost.gravity = -20; // Up!
            
          } else { // The ghost has NOT been munched by the player

            // 
            // Process ghost turns
            // 
            
            if (ghost.turning) { // Is the ghost currently turning?

              if (ghost.turningLeft) { // Is the ghost turning to the left?
                ghost.vx -= (1 * ghost.multiplier); // Steer ghost's velocity to the left
                if (ghost.vx <= -ghostSpeedX) { // Is the ghosts x velocity at it's maximum?
                  ghost.vx = -ghostSpeedX; // Constrain
                  ghost.turning = false; // Ghost has finished turnig
                }
                  
              } else { // The ghost is turning to the right
                ghost.vx += (1 * ghost.multiplier); // Steer ghost's velocity to the right
                if (ghost.vx >= ghostSpeedX) { // Is the ghosts x velocity at it's maximum?
                  ghost.vx = ghostSpeedX; // Constrain
                  ghost.turning = false; // Ghost has finished turning
                }
              } // End "ghost turn direction" check
  
            } else { // The ghost is not turning
  
              ghost.turnTimer -= DT; // Count-down till next turn event
              if (ghost.turnTimer <= 0) { // Timer expired?
                ghost.turningLeft = (ghost.vx > 0); // Set ghost turning direction
                ghost.turnTimer = (random() * ghostTurningPeriodBase) + ghostTurningPeriodVariance; // Reset time till next turn
                ghost.turning = true; // The ghost is turning
              } // End "turn timer expired" check
  
            } // End "ghost turning" check
  
            // 
            // Move ghost on x-axis
            // 

            ghost.x += (ghost.vx * ghost.multiplier) * DT; // Move ghost on the x-axis
            if (ghost.x <= -ghost.r) { // Has the ghost left the left side of the screen?

              ghost.x += WIDTH + ghost.r * 2; // The ghost reappears on the right side of the screen

            } else if (ghost.x > WIDTH + ghost.r) { // Has the ghost left the right side of the screen?

              ghost.x -= WIDTH + ghost.r * 2; // The ghost reappears on the left side of the screen
            } // End "ghost left screen on x-axis" check

          } // End "ghost munched" check

          // 
          // Move ghost on y-axis
          // 
          
          ghost.vy = clamp(ghost.vy + (ghost.gravity * ghost.multiplier), -650, 650); // Apply gravity to, and constrain velocity on y-axis

          ghost.y += (ghost.vy * ghost.multiplier) * DT; // Move the ghost on the y-axis
          if (ghost.y >= 950 ) { // Has the ghost hit the ground?
            // Yes.. bounce
            ghost.y -= ghost.vy * DT; // Reflect movement
            ghost.vy = -ghost.vy; // Reverse velocity so the dot will move upwards

            fx_play(FX_BOUNCE);

          } // End "ghost hit ground" check

          if (ghost.scared) { // Are the ghosts currently scared?

            if (collidedWithPlayer(ghost)) { // Has the player munched the ghost?

              fx_play(FX_MUNCH_GHOST);

              ghost.munched = true;
              ghost.canCollide = false;

              awardPoints(bonusPoints);

              // Spawn point amount particle
              particles.push({
                x: ghost.x, // Set position
                y: ghost.y,
                vx: 0, // Set velocity
                vy: -600,
                r: 6,
                i: `b${bonusPoints}`,
              });

              bonusPoints = bonusPoints * 2; // Next munched ghost is worth twice as many points!

            } // End "ghost was munched" check

            if (ghostsAreScaredTimer <= 2) { // Less than 2 seconds of scared time left?
              textureRegion = getTextureRegion(`ghost${ghost.frames[floor(ghost.frames.length * (ghostsAreScaredTimer % 1))]}`); // Flash to indicate that scared time will be ended soon

              } else { // More than 2 seconds of scared time left.. use ghost scared image
                textureRegion = getTextureRegion(`ghost4`);

              }// End "flash timer check"

            } else { // Ghosts are not scared.. use normal ghost image

              textureRegion = getTextureRegion(`ghost${i}`); // Get image

              if (collidedWithPlayer(ghost)) { // Did the player die to ghosts???

                // 
                // The player died to ghosts.. initiate game over
                // 

                // Spawn some particle dots
                for (let i = 0; i < 200; i++) { // Spawn a bunch of dots
                  direction = (random() * PI2);
                  speed = (random() * 500) + 1200;
                  particles.push({
                    x: player.x, // Set position
                    y: player.y,
                    vx: cos(direction + (PI2 / 2)) * speed, // Set velocity
                    vy: sin(direction + (PI2 / 2)) * speed,
                    gy: (random() * 8) + 24,
                    s: speed,
                    r: 6,
                    i: 'dot320',
                  });
                } // End "spawn dots" loop

                fx_play(FX_DIED);

                player.draw = false;
                collisionEnabled = false;

                keysEnabled = false;
                collisionEnabled = false;

                // parallaxStarsEnabled = false;
                gameOver = true;

                if (bestScoreBeaten) { // Has the best score been beaten in ths game?
                  bestScore = score; // Set new best score
                  optionsChanged = true; // Set flag so best score is saved on browser window/tab closed
                }

                showElement(playMenu.widgets[0].i, true); // Show the "you died to ghosts" message

                postPlayCounter = 2;
                setMode(MODE_POSTPLAY);
              }

          } // End "ghosts are scared" check


          if (ghost.munched) { // Has this ghost been munched?

            textureRegion = getTextureRegion('eyes'); // Set the image to the eyes only

            if (ghost.y <= -HEIGHT / 2) { // Has the ghost gone far enough off the screen at the top?

              ghost.munched = false; // No longer munched
              ghost.canCollide = true; // Can munch the player
              ghost.gravity = 5; // Is falling
              ghost.scared = false; // Is not scared

            } // End "ghost home" check

          } // End "ghost munched" check
            
          ghost.facingLeft = (ghost.vx > 0); // Determine which way the ghost should be drawn

          drawActor(ghost); // Draw ghost

        } // End "process ghosts" loop

        // 
        // Ghosts have been processed
        // 

        updateParticles(); // Update particles

        // 
        // Process the player
        // 

        if (goLeft) { // Player wanting to go left?
          player.x -= PLAYER_SPEED * DT; // Update position
          if (player.x <= -player.r) player.x += WIDTH + player.r * 2; // Warp player to right side of screen if them/they went off the screen on the left
          player.facingLeft = true; // Set facing left flag
          
        } else if (goRight) { // Player want to go right?
          player.x += PLAYER_SPEED * DT; // Update position
          if (player.x > WIDTH + player.r) player.x -= WIDTH + player.r * 2; // Warp player to left side of screen if them/they went off the screen on the right
          player.facingLeft = false; // Set facing left flag

        } // End "which direction" check

        textureRegion = getTextureRegion(`player${player.f[floor(player.f.length * player.c)]}`); // Get image frame

        player.c += DT * 8; // Increment animation counter
        if (player.c >= 1) player.c = 0; // Reset animation counter if required

        if (!levelEnded) drawActor(player); // Draw player if the level is still in progress

        // 
        // 
        // Player has been processed
        // 

        // 
        // Process cherry bonus fruit
        // 

        if (!cherrySpawned) { // Has the cherry bonus fruit been spawned?
          cherrySpawnDelay -= DT; // Count-down till cherry will spawn
          if (cherrySpawnDelay <= 0) { // Can the cherry spawn yet?
            cherryCounter = CHERRY_DURATION; // Set length of time the cherry is present in the level
            cherry = { // Create the cherry
              x: WIDTH / 2,
              y: PLAYER_Y,
              r: 48,
              canCollide: true,
            };
            cherrySpawned = true; // Cherry is spawned

          } // End "cherry soawn time elapsed" check
          
        } else if ((!cherryMunched) && (!gameOver)) { // Should the cherry be processed?

          cherryCounter -= DT;// Count-down till cherry disappears

          if (cherryCounter <= 0) cherryMunched = true; // Setting the munched flag is the same as removing it from the game scene

          textureRegion = getTextureRegion('cherry');
          fg_ctx.drawImage(atlas, textureRegion.x, textureRegion.y, textureRegion.width, textureRegion.height, cherry.x - cherry.r, cherry.y - cherry.r, textureRegion.width, textureRegion.height)

          if (collidedWithPlayer(cherry)) { // Did the player munch the cherry?

            cherry.canCollide = false;
            cherryMunched = true; // Cherry is munched!

            fx_play(FX_CHERRY); // Nom Nom Nom

            awardPoints(3200); // Award bonus points

            // Spawn the bonus point particle
            particles.push({
              x: WIDTH / 2, // Set position
              y: PLAYER_Y,
              vx: 0, // Set velocity
              vy: -600,
              r: 6,
              i: 'b3200',
            });
            
          } // End "player munched cherry" check
        } // End "process cherry" check

        // 
        // Update score readout
        // 

        let scoreText = `${score}`; // Get score as a string
        drawString(centerString(scoreText), SCORE_Y, scoreText, fg_ctx); // Center and draw the current score

      break; // End "MODE_PLAY" case
      
      // 
      // When `gameMode` is `MODE_MAIN_MENU`, the player is basically futzing about in menus
      // 

      case MODE_MAIN_MENU:
        break; // End "MODE_MAIN MENU" case

      //       
      // When `gameMode` is `MODE_FADE_OUT`, the entire html document is fading OUT to become invisible over 0.5 seconds
      // 

      case MODE_FADE_OUT:
        fadeInOutCounter -= DT * 2; // Countdown to 0

        if (fadeInOutCounter <= 0) { // Fade out completed?
          fadeInOutCounter = 0; // Set for completely invisible

          setMode(MODE_NONE);
          callback(); // Execute callback code on fade out complete

        } // End "fade completed" check
        setOpacity(fadeInOutCounter); // Set the opacity of the documents contents
        break; // End "MODE_FADE_OUT" case

      // 
      // When `gameMode` is `MODE_FADE_IN`, the entire html document is fading IN to become visible over 0.5 seconds
      // 

      case MODE_FADE_IN:
        fadeInOutCounter += DT * 2; // Increment couter

        if (fadeInOutCounter >= 1) { // Fade in complete?
          fadeInOutCounter = 1; // Fix to maximum

          setMode(MODE_NONE);
          callback(); // Execute callback code on fade in complete

          // maxMS = 0;

        } // End "fade complete" check
        setOpacity(fadeInOutCounter); // Set the opacity of the documents contents
        break; // End "MODE_FADE_IN" case

      default: // MODE_NONE
        break;

    } // End "`gameMode` switch"

    // 
    // Update parallax star field
    // 

    if (parallaxStarsEnabled) { // Is the starfield enabled?

      clearBackground();

      let i, // Image
      s, // Star

      n = 0; // Count
      while (n < STARS.length) { // NOTE: While loops are actually smaller code than a for loop. I dunno about performance impacts though
        s = STARS[n], // Next star
        x = s[0], // Get star coordinates
        z = floor((3 / 96) * n++); // The layer (0-2)

        x += 150 * (z + 1) * DT; // Update x position
        if (x >= WIDTH) x = -32; // Wrap right

        s[0] = x; // Save updated coordinates

        i = getTextureRegion(`star${z}`); // Get texture region

        fg_ctx.drawImage(atlas, i.x, i.y, i.width, i.height, x, s[1], i.width, i.height); // Draw to canvas
      }
      
      // Mirror the starfield below the horizon line to give the illusion of a reflective surface
      fg_ctx.save();
      fg_ctx.globalAlpha = .3;
      fg_ctx.translate(0, HEIGHT);
      fg_ctx.scale(1, -.75);
      fg_ctx.drawImage(fg_canvas, 0, 700, WIDTH, 180, 0, 0, WIDTH, 180);
      fg_ctx.restore();

    } // End "starfield enabled" check

    //  let elapsed = performance.now() - start;if (elapsed > maxMS) {maxMS = elapsed;getByID('o').innerHTML = `${maxMS}ms`}
    
  } // End "game paused" check

  requestAnimationFrame(onEnterFrame); // Request next animation frame event
};

// #endregion
