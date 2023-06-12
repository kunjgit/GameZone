// jsfxr.js -- a heavily compressed audio engine

// Copyright (C) 2019, Nicholas Carlini <nicholas@carlini.com>.
//
// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <http://www.gnu.org/licenses/>.

// ----------------------------------------------------------------
// ----------------------------------------------------------------
// Original code licensed as follows

/**
 * SfxrParams
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */

// 10965
// 10957
// 10935

  //--------------------------------------------------------------------------
  //
  //  Settings String Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Parses a settings array into the parameters
   * @param array Array of the settings values, where elements 0 - 23 are
   *                a: waveType
   *                b: attackTime
   *                c: sustainTime
   *                d: sustainPunch
   *                e: decayTime
   *                f: startFrequency
   *                g: minFrequency
   *                h: slide
   *                i: deltaSlide
   *                j: vibratoDepth
   *                k: vibratoSpeed
   *                l: changeAmount
   *                m: changeSpeed
   *                n: squareDuty
   *                o: dutySweep
   *                p: repeatSpeed
   *                q: phaserOffset
   *                r: phaserSweep
   *                s: lpFilterCutoff
   *                t: lpFilterCutoffSweep
   *                u: lpFilterResonance
   *                v: hpFilterCutoff
   *                w: hpFilterCutoffSweep
   *                x: masterVolume
   * @return If the string successfully parsed
   */

/**
 * SfxrSynth
 *
 * Copyright 2010 Thomas Vian
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * @author Thomas Vian
 */
/** @constructor */
class SfxrSynth {

    constructor() {
    // All variables are kept alive through closures

  //--------------------------------------------------------------------------
  //
  //  Sound Parameters
  //
  //--------------------------------------------------------------------------

        this._params = {};  // Params instance

  //--------------------------------------------------------------------------
  //
  //  Synth Variables
  //
  //--------------------------------------------------------------------------

  var _envelopeLengths, // Length of the attack stage
      // Length of the sustain stage
      // Length of the decay stage

      _period,          // Period of the wave
      _maxPeriod,       // Maximum period before sound stops (from minFrequency)

      _slide,           // Note slide
      _deltaSlide,      // Change in slide

      _changeAmount,    // Amount to change the note by
      _changeTime,      // Counter for the note change
      _changeLimit,     // Once the time reaches this limit, the note changes

      _squareDuty,      // Offset of center switching point in the square wave
      _dutySweep;       // Amount to change the duty by

  //--------------------------------------------------------------------------
  //
  //  Synth Methods
  //
  //--------------------------------------------------------------------------

  /**
   * Resets the runing variables from the params
   * Used once at the start (total reset) and for the repeat effect (partial reset)
   */
  this.reset = () => {
    // Shorter reference
    var p = this._params;

    _period       = 100 / (p.f**2 + .001);
    _maxPeriod    = 100 / (p.g**2   + .001);

    _slide        = 1 - p.h**3 * .01;
      _deltaSlide   = -(p.i**3) * .000001;

    if (p.a==3) {
      _squareDuty = .5 - p.n / 2;
      _dutySweep  = -p.o * .00005;
    }

    _changeAmount =  1 + p.l**2 * (p.l > 0 ? -.9 : 10);
    _changeTime   = 0;
    _changeLimit  = p.m == 1 ? 0 : (1 - p.m)**2 * 20000 + 32;
  }

  // I split the reset() fn into two fn for better readability
  this.totalReset = () => {
    this.reset();

    // Shorter reference
    var p = this._params;

    // Calculating the length is all that remained here, everything else moved somewhere
      _envelopeLengths = [p.b**2 * 100000,
                          p.c**2 * 100000,
                          p.e**2 * 100000,
                         1]
    // Full length of the volume envelop (and therefore sound)
      // Make sure the length can be divided by 3 so we will not need the padding "==" after base64 encode
      // TODO I removed a /3 |0 *3, is this okay?
      return sum(_envelopeLengths)
  }

  /**
   * Writes the wave to the supplied buffer ByteArray
   * @param buffer A ByteArray to write the wave to
   * @return If the wave is finished
   */
  this.synthWave = (buffer, length) => {
    // Shorter reference
    var p = this._params;

    // If the filters are active
    var _filters = p.s != 1 || p.v,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _hpFilterCutoff = p.v**2 * .1,
        // Speed of the high-pass cutoff multiplier
        _hpFilterDeltaCutoff = 1 + p.w * .0003,
        // Cutoff multiplier which adjusts the amount the wave position can move
        _lpFilterCutoff = p.s**3 * .1,
        // masterVolume * masterVolume (for quick calculations)
        _masterVolume = p.x**2,
        // If the phaser is active
        _phaser = p.q || p.r,
        // Phase offset for phaser effect
        _phaserOffset = p.q**2 * (p.q < 0 ? -1020 : 1020),
        // Once the time reaches this limit, some of the    iables are reset
        _repeatLimit = p.p ? ((1 - p.p)**2 * 20000 | 0) + 32 : 0,
        // Amount to change the period of the wave by at the peak of the vibrato wave
        _vibratoAmplitude = p.j / 2,
        // The type of wave to generate
        _waveType = p.a;

    var _envelopeLength      = _envelopeLengths[0]     // Length of the current envelope stage

    // Damping muliplier which restricts how fast the wave position can move
      var _lpFilterDamping = 5 / (1 + p.u**2 * 20) * (.01 + _lpFilterCutoff);
      _lpFilterDamping = 1 - clamp(_lpFilterDamping,0,.8);

    var _finished = false,     // If the sound has finished
        _envelopeStage    = 0, // Current stage of the envelope (attack, sustain, decay, end)
        _envelopeTime     = 0, // Current time through current enelope stage
        _envelopeVolume   = 0, // Current volume of the envelope
        _hpFilterPos      = 0, // Adjusted wave position after high-pass filter
        _lpFilterDeltaPos = 0, // Change in low-pass wave position, as allowed by the cutoff and damping
        _lpFilterOldPos,       // Previous low-pass wave position
        _lpFilterPos      = 0, // Adjusted wave position after low-pass filter
        _periodTemp,           // Period modified by vibrato
        _phase            = 0, // Phase through the wave
        _phaserInt,            // Integer phaser offset, for bit maths
        _phaserPos        = 0, // Position through the phaser buffer
        _pos,                  // Phase expresed as a Number from 0-1, used for fast sin approx
        _repeatTime       = 0, // Counter for the repeats
        _sample,               // Sub-sample calculated 8 times per actual sample, averaged out to get the super sample
        lastOut = 0,
        _vibratoPhase     = 0; // Phase through the vibrato sine wave

    // Buffer of wave values used to create the out of phase second wave
    var _phaserBuffer = new Array(1024),
        // Buffer of random values used to generate noise
        _noiseBuffer  = range(32).map(x=>urandom());
      _phaserBuffer.fill(0);

    for (var i = 0; i < length; i++) {
      if (_finished) {
        return i;
      }

      // Repeats every _repeatLimit times, partially resetting the sound parameters
      if (_repeatLimit) {
        if (++_repeatTime >= _repeatLimit) {
          _repeatTime = 0;
          this.reset();
        }
      }

      // If _changeLimit is reached, shifts the pitch
      if (_changeLimit) {
        if (++_changeTime >= _changeLimit) {
          _changeLimit = 0;
          _period *= _changeAmount;
        }
      }

      // Acccelerate and apply slide
      _slide += _deltaSlide;
      _period *= _slide;

      // Checks for frequency getting too low, and stops the sound if a minFrequency was set
      if (_period > _maxPeriod) {
          _period = _maxPeriod;
          _finished = (p.g > 0);
      }

      _periodTemp = _period;

      // Applies the vibrato effect
      if (_vibratoAmplitude > 0) {
        _vibratoPhase += p.k**2 * .01;
        _periodTemp *= 1 + Math.sin(_vibratoPhase) * _vibratoAmplitude;
      }

        _periodTemp = clamp(_periodTemp,8,1e9)|0;
      // Sweeps the square duty
      if (_waveType == 3) {
          _squareDuty = clamp(_squareDuty+_dutySweep,0,.5);
      }

      // Moves through the different stages of the volume envelope
      if (++_envelopeTime > _envelopeLength) {
        _envelopeTime = 0;

          _envelopeLength = _envelopeLengths[++_envelopeStage];
      }

        // Sets the volume based on the position in the envelope
        var r = _envelopeTime / _envelopeLengths[_envelopeStage]

        _envelopeVolume = [r, 1 + (1 - r) * 2 * p.d, 1 - r, 0][_envelopeStage]
        _finished |= _envelopeStage == 3;

      // Moves the phaser offset
      if (_phaser) {
          _phaserOffset += p.r**3 * .2;

          // todo space this can be a clamp if I do the negate. Maybe use math.abs?
        _phaserInt = _phaserOffset | 0;
        if (_phaserInt < 0) {
          _phaserInt = -_phaserInt;
        } else if (_phaserInt > 1023) {
          _phaserInt = 1023;
        }
      }

      // Moves the high-pass filter cutoff
      if (_filters && _hpFilterDeltaCutoff) {
          _hpFilterCutoff = clamp(_hpFilterCutoff*_hpFilterDeltaCutoff,.00001,.1);
      }

        buffer[i] = sum(range(8).map(_=>{
        // Cycles through the period
        _phase++;
        if (_phase >= _periodTemp) {
          _phase %= _periodTemp;

          // Generates new random noise for this period
          if (_waveType <= 1) {
              range(_noiseBuffer.length).map(n=>{
                  // TODO SPACE make this be a ternary op
                if (_waveType == 1) {
                    // Brown for that GAME FEEL
                    _noiseBuffer[n] = lastOut = (lastOut + (0.02 * urandom())) / 1.02;
                    _noiseBuffer[n] *= 3.5;
                } else {
                    _noiseBuffer[n] = urandom();
                }
              })
          }
        }

          _sample = [
              _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)],
              _noiseBuffer[Math.abs(_phase * 32 / _periodTemp | 0)],
              NaN,
              ((_phase / _periodTemp) < _squareDuty) ? .5 : -.5, // 3
              _sample = 1 - _phase / _periodTemp * 2 // 4
              ][_waveType]

        // Applies the low and high pass filters
        if (_filters) {
          _lpFilterOldPos = _lpFilterPos;
            _lpFilterCutoff = clamp(_lpFilterCutoff*(1 + p.t * .0001),0,.1);

          if (p.s != 1) {
            _lpFilterDeltaPos += (_sample - _lpFilterPos) * _lpFilterCutoff;
            _lpFilterDeltaPos *= _lpFilterDamping;
          } else {
            _lpFilterPos = _sample;
            _lpFilterDeltaPos = 0;
          }

          _lpFilterPos += _lpFilterDeltaPos;

          _hpFilterPos += _lpFilterPos - _lpFilterOldPos;
          _hpFilterPos *= 1 - _hpFilterCutoff;
          _sample = _hpFilterPos;
        }

        // Applies the phaser effect
        if (_phaser) {
          _phaserBuffer[_phaserPos % 1024] = _sample;
          _sample += _phaserBuffer[(_phaserPos - _phaserInt + 1024) % 1024];
          _phaserPos++;
        }

            return _sample;
        }))* _envelopeVolume * _masterVolume * (.5 + 1.5*(_waveType == 1));
        

    }

    return length;
  }
    }
}

var cache = {};
function jsfxr(settings) {
    if (cache[settings]) return cache[settings];
    // Initialize SfxrParams
    // Adapted from http://codebase.es/riffwave/
    var synth = new SfxrSynth();

    var self = synth._params;
    range(24).map(i=>self[String.fromCharCode( 97 + i )] = settings[i] || 0);

    self.c = Math.max(self.c, 0.01)
    // I moved self here from the reset(true) 

    // Synthesize Wave
    var envelopeFullLength = synth.totalReset();
    var arr = range(envelopeFullLength|0);
    synth.synthWave(arr, envelopeFullLength) * 2;
    
    return cache[settings] = arr;
}

