var context = new AudioContext()
var o = null
var g = null

function audio(frequency, type){
  o = context.createOscillator()
  g = context.createGain()
  o.type = type
  o.connect(g)
  o.frequency.value = frequency
  g.connect(context.destination)
  o.start(0)

  g.gain.exponentialRampToValueAtTime(
    0.00001, context.currentTime + 1
  )
}

