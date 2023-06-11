var volume = 0.75
var channels = 4
var channel = []
var notes = 0

function Note(f, v, p, l) {
    this.n = ++notes
    this.t = 0
    this.f = f
    this.v = v
    this.p = p
    if (typeof l === 'number') this.l = l
    else this.l = 60
}

var ac = new (window.AudioContext || window.webkitAudioContext)()
var DT = 1 / ac.sampleRate
var P2 = Math.PI * 2

function sn () {
    this.spn = ac.createScriptProcessor(256, 1, 1)
    this.spn.onaudioprocess = sp
}

function piano(fq) {
    var w = fq
    var y  = 0.6 * Math.sin(1.0*w*t)*Math.exp(-0.0008*w*t)
    y += 0.3*Math.sin(2.0*w*t)*Math.exp(-0.0010*w*t)
    y += 0.1*Math.sin(4.0*w*t)*Math.exp(-0.0015*w*t)
    y += 0.2*y*y*y
    y *= 0.9 + 0.1*Math.cos(70.0*t)
    return 2.0*y*Math.exp(-22.0*t) + y
}

function sin(n) {
    return Math.sin(P2 * n.f * n.t)
}

function fwn() {
    return Math.random()
}

function fm1(n) {
    return Math.sin(P2 * n.f * n.t + 64 
            * Math.sin(P2 * (n.f) * n.t))
}

function fm2(n) {
    return Math.sin(P2 * n.f * n.t + 4
            * Math.sin(P2 * (n.f / 4) * n.t))
}

var rt = 0 // rendering time
function sp(e) {
    var d = e.outputBuffer.getChannelData(0)
    for (var i = 0; i < d.length; ++i) {
        var n = 0
        var a = 0
        for (var c = 0; c < channels; c++) {
            if (channel[c] != null) {
                a += channel[c].p(channel[c]) * channel[c].v
                channel[c].t += DT
                if (channel[c].t > channel[c].l) channel[c] = null
                n++;
            }
        }
        if (n > 0) a /= n;
        //if (n > 0) debug = 'playing'
        //else debug = 'nope'
        d[i] = volume * a; 
    }

    rt += DT * d.length
    if (rt > 0.125) {
        // next sequencing step 
        ST();
        rt -= 0.125
    }
}

function play() {
    this.spn.connect(ac.destination);
}

function pause() {
    this.spn.disconnect();
}

sn();
play();

var preset = fm2
var transpose = -9

function ftone(n, v, f, l) {
    // find a free channel
    for (var c = 0; c < channels; c++) {
        if (channel[c] == null) {
            channel[c] = new Note(n, v, f, l)
            return channel[c].n
        }
    }
    return _;
}

function stone(q, v, f, l) {
    var n = 440 * Math.pow(Math.pow(2, 1/12), q + transpose);
    ftone(n, v, f, l)
}

function kill(n) {
    for (var c = 0; c < channels; c++) {
        if (channel[c] != null && channel[c].n == n) {
            channel[c] = null;
            return true;
        }
    }
    return false;
}

// Step Sequencer
var step = 0;
var substep = 0;

var _ = -999 
var X = -888
var N = {
    C3:-12,CH3:-11,D3:-10,DH3:-9,E3:-8,F3:-7,FH3:-6,G3:-5,GH3:-4,A3:-3,AH3:-2,B3:-1,
    C4:0,CH4:1,D4:2,DH4:3,E4:4,F4:5,FH4:6,G4:7,GH4:8,A4:9,AH4:10,B4:11,
    C5:12,CH5:13,D5:14,DH5:15,E5:16,F5:17,FH5:18,G5:19,GH5:20,A5:21,AH5:22,B5:23,
    C6:24,CH6:25,D6:26,DH6:27,E6:28,F6:29,FH6:30,G6:31,GH6:32,A6:33,AH6:34,B6:35,
}

function Pattern(p, f) {
    this.t = 0;
    this.p = p;
    this.f = f;
    this.c = -1;
    this.on = function(s) {
        if (s >= 32) {
            kill(this.c);
        } else if (p[s] != null && p[s] != _) {
            kill(this.c);
            this.c = stone(p[s] + this.t, f)
        }
    }
}

var PN = []

with(N) {
}

var SQ = []

function ST() {
    if (SQ.length == 0) return
    if (substep >= 32) {
        // finish current patterns 
        for (var t = 0; t < SQ[step].length; t++) {
            PN[SQ[step][t]].on(substep)
        }

        substep = 0
        step++
        if (step >= SQ.length) {
            step = 0
        }
    }

    // play current step
    for (var t = 0; t < SQ[step].length; t++) {
        PN[SQ[step][t]].on(substep)
    }
    substep++
}
