/** @constructor */
function ArcadeAudio() {
    this.sounds = {}
}

ArcadeAudio.prototype.add = function(key, count, settings) {
    var i
    this.sounds[key] = []
    settings.forEach(function(elem, index) {
        this.sounds[key].push({
            tick: 0,
            count: count,
            pool: []
        })
        for (i = 0; i < count; ++i) {
            var audio = new Audio
            audio.src = jsfxr(elem)
            this.sounds[key][index].pool.push(audio)
        }
    }, this)
}

ArcadeAudio.prototype.play = function(key) {
    if (!opt['snd']) return
    var sound = this.sounds[key]
    var soundData = sound.length > 1 ? sound[0|Math.random() * sound.length] : sound[0]
    soundData.pool[soundData.tick].play()
    soundData.tick < soundData.count - 1 ? soundData.tick++ : soundData.tick = 0
}

var aa = new ArcadeAudio()

aa.add('lvl', 2, [
    [2,0.0703,0.4438,0.1843,0.3133,0.7169,,-0.3947,0.2224,,,-0.8926,,,0.0018,0.5304,0.0024,-0.0733,0.9999,0.0008,,,0.001,0.5]
])

aa.add('bad', 2, [
    [1,0.4882,0.1015,0.0111,0.185,0.5532,,0.2042,-0.2355,-0.0008,0.167,0.1466,0.2996,0.4515,0.0003,0.6633,-0.0922,0.0004,0.4611,0.0765,,0.0034,-0.4309,0.5]
])

aa.add('go', 10, [
    [0,,0.1095,,0.0704,0.5058,,,,,,,,0.0765,,,,,1,,,0.1,,0.5]
])

aa.add('win', 1, [
    [1,0.1802,0.6588,0.0408,0.5046,0.5889,,-0.4668,0.9709,,0.6701,-0.4295,,-0.4146,0.0436,0.7555,-0.0819,-0.9671,0.1275,0.6194,,0.0893,0.3871,0.5]
])
