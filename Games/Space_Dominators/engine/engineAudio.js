/*
    LittleJS Audio System
    - Speech Synthesis
    - ZzFX Sound Effects
    - ZzFXM Music
    - Can attenuate zzfx sounds by camera range
*/

'use strict';

const soundEnable = 1;       // all audio can be disabled
const defaultSoundRange = 15;// distance where taper starts
const soundTaperPecent = .5; // extra range added for sound taper
const audioVolume = .5;        // volume for sound, music and speech
let audioContext;            // main audio context

///////////////////////////////////////////////////////////////////////////////

// play a zzfx sound in world space with attenuation and culling
function playSound(zzfxSound, pos, range=defaultSoundRange, volumeScale=1)
{
    if (!soundEnable) return;

    const lengthSquared = cameraPos.distanceSquared(pos);
    const maxRange = range * (soundTaperPecent + 1);
    if (lengthSquared > maxRange**2)
        return;

    // copy sound (so volume scale isnt permanant)
    zzfxSound = [...zzfxSound];

    // scale volume
    const scale = volumeScale * percent(lengthSquared**.5, range, maxRange);
    zzfxSound[0] = (zzfxSound[0]||1) * scale;
    zzfx(...zzfxSound);
}

// render and play zzfxm music with an option to loop
function playMusic(zzfxmMusic, loop=1) 
{
    if (!soundEnable) return;

    const source = zzfxP(...zzfxM(...zzfxmMusic));
    source && (source.loop = loop);
    return source;
}

///////////////////////////////////////////////////////////////////////////////
// speak text with passed in settings
function speak(text, language='', volume=1, rate=1, pitch=1)
{
    if (!soundEnable || !speechSynthesis) return;

    // common languages (not supported by all browsers)
    // en - english,  it - italian, fr - french,  de - german, es - spanish
    // ja - japanese, ru - russian, zh - chinese, hi - hindi,  ko - korean

    // build utterance and speak
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.volume = volume*audioVolume*3;
    utterance.rate = rate;
    utterance.pitch = pitch;
    speechSynthesis.speak(utterance);
}

const stopSpeech = ()=> speechSynthesis && speechSynthesis.cancel();

///////////////////////////////////////////////////////////////////////////////
// ZzFXMicro - Zuper Zmall Zound Zynth - v1.1.8 by Nishant kaushal

const zzfxR = 44100; // sample rate
function zzfx(
    // parameters
    volume = 1, randomness = .05, frequency = 220, attack = 0, sustain = 0,
    release = .1, shape = 0, shapeCurve = 1, slide = 0, deltaSlide = 0,
    pitchJump = 0, pitchJumpTime = 0, repeatTime = 0, noise = 0, modulation = 0,
    bitCrush = 0, delay = 0, sustainVolume = 1, decay = 0, tremolo = 0
)
{
    // wait for user input to create audio context
    if (!soundEnable || !hadInput) return;

    // init parameters
    let PI2 = PI*2, sign = v => v>0?1:-1,
        startSlide = slide *= 500 * PI2 / zzfxR / zzfxR, b=[],
        startFrequency = frequency *= (1 + randomness*2*Math.random() - randomness) * PI2 / zzfxR,
        t=0, tm=0, i=0, j=1, r=0, c=0, s=0, f, length;
        
    // scale by sample rate
    attack = attack * zzfxR + 9; // minimum attack to prevent pop
    decay *= zzfxR;
    sustain *= zzfxR;
    release *= zzfxR;
    delay *= zzfxR;
    deltaSlide *= 500 * PI2 / zzfxR**3;
    modulation *= PI2 / zzfxR;
    pitchJump *= PI2 / zzfxR;
    pitchJumpTime *= zzfxR;
    repeatTime = repeatTime * zzfxR | 0;

    // generate waveform
    for(length = attack + decay + sustain + release + delay | 0;
        i < length; b[i++] = s)
    {
        if (!(++c%(bitCrush*100|0)))                      // bit crush
        {
            s = shape? shape>1? shape>2? shape>3?         // wave shape
                Math.sin((t%PI2)**3) :                    // 4 noise
                Math.max(Math.min(Math.tan(t),1),-1):     // 3 tan
                1-(2*t/PI2%2+2)%2:                        // 2 saw
                1-4*abs(Math.round(t/PI2)-t/PI2):    // 1 triangle
                Math.sin(t);                              // 0 sin
                
            s = (repeatTime ?
                    1 - tremolo + tremolo*Math.sin(PI2*i/repeatTime) // tremolo
                    : 1) *
                sign(s)*(abs(s)**shapeCurve) *       // curve 0=square, 2=pointy
                volume * audioVolume * (                  // envelope
                i < attack ? i/attack :                   // attack
                i < attack + decay ?                      // decay
                1-((i-attack)/decay)*(1-sustainVolume) :  // decay falloff
                i < attack  + decay + sustain ?           // sustain
                sustainVolume :                           // sustain volume
                i < length - delay ?                      // release
                (length - i - delay)/release *            // release falloff
                sustainVolume :                           // release volume
                0);                                       // post release
 
            s = delay ? s/2 + (delay > i ? 0 :            // delay
                (i<length-delay? 1 : (length-i)/delay) *  // release delay 
                b[i-delay|0]/2) : s;                      // sample delay
        }

        f = (frequency += slide += deltaSlide) *          // frequency
            Math.cos(modulation*tm++);                    // modulation
        t += f - f*noise*(1 - (Math.sin(i)+1)*1e9%2);     // noise

        if (j && ++j > pitchJumpTime)       // pitch jump
        {
            frequency += pitchJump;         // apply pitch jump
            startFrequency += pitchJump;    // also apply to start
            j = 0;                          // reset pitch jump time
        }

        if (repeatTime && !(++r % repeatTime)) // repeat
        {
            frequency = startFrequency;     // reset frequency
            slide = startSlide;             // reset slide
            j = j || 1;                     // reset pitch jump time
        }
    }
    
    // create audio context
    if (!audioContext)
        audioContext = new (window.AudioContext||webkitAudioContext);

    // create buffer and source
    const buffer = audioContext.createBuffer(1, b.length, zzfxR), 
        source = audioContext.createBufferSource();

    // copy samples to buffer and play
    buffer.getChannelData(0).set(b);
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
    return source;
}

///////////////////////////////////////////////////////////////////////////////
// ZzFX Music Renderer v2.0.3 by Keith Clark and Nishant kaushal

///////////////////////////////////////////////////////////////////////////////
// ZzFX Music Renderer v2.0.3 by Keith Clark and Nishant kaushal

function zzfxM(instruments, patterns, sequence, BPM = 125) 
{
    if (!soundEnable) return;
    let instrumentParameters;
    let i;
    let j;
    let k;
    let note;
    let sample;
    let patternChannel;
    let notFirstBeat;
    let stop;
    let instrument;
    let pitch;
    let attenuation;
    let outSampleOffset;
    let isSequenceEnd;
    let sampleOffset = 0;
    let nextSampleOffset;
    let sampleBuffer = [];
    let leftChannelBuffer = [];
    let rightChannelBuffer = [];
    let channelIndex = 0;
    let panning = 0;
    let hasMore = 1;
    let sampleCache = {};
    let beatLength = zzfxR / BPM * 60 >> 2;

    // for each channel in order until there are no more
    for(; hasMore; channelIndex++) {

        // reset current values
        sampleBuffer = [hasMore = notFirstBeat = pitch = outSampleOffset = 0];

        // for each pattern in sequence
        sequence.map((patternIndex, sequenceIndex) => {
            // get pattern for current channel, use empty 1 note pattern if none found
            patternChannel = patterns[patternIndex][channelIndex] || [0, 0, 0];

            // check if there are more channels
            hasMore |= !!patterns[patternIndex][channelIndex];

            // get next offset, use the length of first channel
            nextSampleOffset = outSampleOffset + (patterns[patternIndex][0].length - 2 - !notFirstBeat) * beatLength;
            // for each beat in pattern, plus one extra if end of sequence
            isSequenceEnd = sequenceIndex == sequence.length - 1;
            for (i = 2, k = outSampleOffset; i < patternChannel.length + isSequenceEnd; notFirstBeat = ++i) {

                // <channel-note>
                note = patternChannel[i];

                // stop if end, different instrument or new note
                stop = i == patternChannel.length + isSequenceEnd - 1 && isSequenceEnd ||
                        instrument != (patternChannel[0] || 0) | note | 0;

                // fill buffer with samples for previous beat, most cpu intensive part
                for (j = 0; j < beatLength && notFirstBeat;

                        // fade off attenuation at end of beat if stopping note, prevents clicking
                        j++ > beatLength - 99 && stop ? attenuation += (attenuation < 1) / 99 : 0
                ) {
                    // copy sample to stereo buffers with panning
                    sample = (1 - attenuation) * sampleBuffer[sampleOffset++] / 2 || 0;
                    leftChannelBuffer[k] = (leftChannelBuffer[k] || 0) - sample * panning + sample;
                    rightChannelBuffer[k] = (rightChannelBuffer[k++] || 0) + sample * panning + sample;
                }

                // set up for next note
                if (note) {
                    // set attenuation
                    attenuation = note % 1;
                    panning = patternChannel[1] || 0;
                    if (note |= 0) {
                        // get cached sample
                        sampleBuffer = sampleCache[
                            [
                                instrument = patternChannel[sampleOffset = 0] || 0,
                                note
                            ]
                        ] = sampleCache[[instrument, note]] || (
                                // add sample to cache
                                instrumentParameters = [...instruments[instrument]],
                                instrumentParameters[2] *= 2 ** ((note - 12) / 12),

                                // allow negative values to stop notes
                                note > 0 ? zzfxG(...instrumentParameters) : []
                        );
                    }
                }
            }

            // update the sample offset
            outSampleOffset = nextSampleOffset;
        });
    }

    return [leftChannelBuffer, rightChannelBuffer];
}