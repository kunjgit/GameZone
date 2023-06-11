let audioCtx

function initAudio() {
  audioCtx = new AudioContext()//({sampleRate: 8000})
  playTone() // Warm up speaker
}

function playTone(freq=2, start=0, iniGain=1, duration=1, freqEnd, freqEndSec, fadeDelay) {
  //log(freq, start, iniGain, duration, freqEnd, freqEndSec, fadeDelay)
  setTimeout(()=> {
    const currTime = audioCtx.currentTime
    const oscillator = audioCtx.createOscillator()
    const gainNode = audioCtx.createGain()
    oscillator.frequency.value = 0
    oscillator.frequency.setValueAtTime(freq, currTime)
    oscillator.frequency.linearRampToValueAtTime(freqEnd||freq, currTime + (freqEndSec||duration))
    gainNode.gain.setValueAtTime(iniGain, currTime)
    gainNode.gain.linearRampToValueAtTime(0, currTime + (fadeDelay||duration))
    oscillator.connect(gainNode)
    gainNode.connect(audioCtx.destination)
    oscillator.start()
    setTimeout(()=> oscillator.disconnect(), (fadeDelay||duration)*1000)
  }, start*1000)
}
window.play = window.playTone = playTone // DEBUG

function playTicTac() {
  for (i=0; i<20; i++) {
    playTone(900 + (i%2)*400, i   , (20-i)/500, .2)
    playTone(400            , i+.1, (20-i)/200, .1)
  }
}

function playAlarm() {
  for (i=0; i<15; i++) {
    playTone(2000, i/9.73, .4, 1)
  }
}
