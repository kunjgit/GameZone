debug = ''
action = ''
warning = null
swarn = 0
fps = 0
fST = 0
fC = 0

TM0 = '#808080'
TM1 = '#3020FF'
TM2 = '#FF2040'
TM3 = '#00FF00'
TM4 = '#FFCC00'

L = 2  // level of details
B = 60 // beaming speed
F = 20 // friction factor
S = 10 // scale factor
A = 1500 // atmosphere
h = 500
w = 1000

air = 0
fire = 0
water = 0
earth = 0
visit = 0
terr = 0
time = 0
jump = 0
arrived = false
gseed = 1

// planets
PA = {
    seed: 11,
    G: 27,           // gravity constant
    AR: 00,
    AG: 127,
    AB: 255,
    GR: 255,
    GG: 160,
    GB: 160,
    radius: 200,
    elevation: 300,
    errosion: 40,
    sharp: 0.2,
    epoch: 100,
    nlake: 2,
    nlava: 2,
    slake: 100,
    wlake: 100,
    slava: 80,
    wlava: 60,
    pI: function() {
        e.push(new E(1, 1, 800, 200, 22, 27, BX[0]))
        e.push(new E(1, 11, 100, 1500, 50, 30, BX[2]))
        e.push(new E(1, 11, 1500, 2000, 50, 30, BX[2]))
    },
    pU: function(d) {
            if (e.length < 16) {
            if (Math.random()/d < 0.05) {
                e.push(new E(1, 20, Math.random()*W, A*2, 11, 17, BX[1]))
            }
        }
    }
}

// masks
BM = [
    "$%%'U5010",
    '"#6E', 
    '&&! ! e$55:I55'
]
BX = []

// sourcer
sf = 100 // fuel
SFC = 2  // consumption
SFR = 1  // recuperation
SFB = 20 // beaming
sF = 100 // max fuel
sa = 100 // coolant
SAC = 5  // consumption
SAR = 1  // recuperation
SAB = 20 // beaming
sA = 100 // max coolant
sx = w/2
sy = h/2
sl = h/2
cx = 0
cy = -h / 4
sw = 0   // horizontal speed
sn = 0   // vertical speed
sc = 0   // collision speed
sb = 0   // tractor beam
sB = 150 // beaming distance
so = 4   // vertical oscilation peak
su = 20  // vertical oscilation acceleration
si = 10  // max oscilation speed
sp = 1   // vertical oscilation status
sh = 100 // horizontal acceleration
sv = 70  // vertical acceleration
mw = 150 // max horizontal speed
mn = 75  // max vertical speed
sW = 33  // saucer width
sH = 11  // saucer height
sC = 8   // max capsules
sE = 0   // captured capsules
se = -1  // last selected

// camera
cw = 0  // horizontal speed
cn = 0  // vertical speed
ch = 100 // camera acceleration
cm = 170 // max camera speed

lf = Date.now()

function tmc(t) {
    switch(t) {
    case 1: return TM1
    case 2: return TM2 
    case 3: return TM3 
    case 4: return TM4 
    default: return TM0 
    }
}

// entity
E = function(e, t, x, y, r, h, b) {
    this.e = e // team
    this.t = t // type
    this.s = 1 // status
    this.x = x
    this.y = y
    this.R = r // half width
    this.H = h // half height
    this.X = 10// pixel size
    this.w = 0 // horizontal speed
    this.n = 0 // vertical speed
    this.W = 20 // horizontal deceleration
    this.N = 30 // vertical deceleration
    this.l = 50 + Math.random() * 300
    this.b = b
    this.q = TM0
    if (t < 20) {
        this.q = tmc(e)
    }
    this.a = '#00FF00'
    this.z = '#FF0000'
    if (t === 1) {
        this.dr = Math.random() - 0.5
        if (this.dr < 0) this.dr = -1
        else this.dr = 1
        this.up = function(d) {
            var h = ht(this.x, this.y)
            if (h < this.l) this.n += this.N*d*2
            if (h > this.l + 40) this.n -= this.N*d*2
            this.w += this.W*d*2*this.dr
        }
    } else {
        this.up = function(d) {
        }
    }
}

function random() {
    var x = Math.sin(seed++) * 11111
    return x - Math.floor(x)
}

function grandom() {
    var x = Math.sin(gseed++) * 11111
    return x - Math.floor(x)
}

function cTH(c) {
        var hex = c.toString(16);
            return hex.length == 1 ? "0" + hex : hex;
}

function rgb(r, g, b) {
        return "#" + cTH(r) + cTH(g) + cTH(b);
}

function dm() {
    // decode
    for (var i = 0; i < BM.length; i++) {
        var s = BM[i]
        var k = s.charCodeAt(0) - 32
        var l = s.charCodeAt(1) - 32
        BX[i] = []
        BX[i].push(k)
        var j = 0
        while (j < k * l / 3) {
            var m = s.charCodeAt(j + 2) - 32
            BX[i].push((m & 48) >> 4)
            BX[i].push((m & 12) >> 2)
            BX[i].push(m & 3)
            j++
        }
        j = j*3 - k*l
        if (j >= 1) BX[i].pop()
        if (j > 1) BX[i].pop()
    }
}

function genesis(p) {
    visit++
    terrain = []
    origin = []
    lake = []
    lava = []
    e = []

    if (p == undefined) {
        p = {}
        for (var j in PA) p[j] = PA[j]
        p.seed = grandom()*99999
        seed = p.seed
        p.G = 27 + (random()-0.5) + 10
        p.AR = 127 + random() * 127
        p.AG = 127 + random() * 127
        p.AB = 255
        p.GR = 125 + random() * 127
        p.GG = 125 + random() * 127
        p.GB = 125 + random() * 127
        p.radius = 200 + Math.round(random() * 8) * 100
        p.elevation = 300
        p.errosion = Math.floor(random() * 50)
        p.sharp = 0.1 + random() * 0.8
        p.epoch = Math.floor(random() * 100)
        p.nlake = Math.floor(random() * 15)
        p.nlava = Math.floor(random() * 15)
    }
    for (var i in p) this[i] = p[i]
    W = radius * S
    for (i = 0; i < radius; i++) { terrain[i] = 0; lake[i] = 0; lava[i] = 0 }
    gm(0, radius - 1, elevation)
    for (i = 0; i < terrain.length; i++) origin[i] = terrain[i]
    for (i = 0; i < epoch; i++) tm(errosion, 1, 0, terrain.length)

    for (i = 0; i < nlake; i++) lm(1, random() * W - slake-wlake-40, slake + random() * wlake)
    for (i = 0; i < nlava; i++) lm(-1, random() * W - slava-wlava-40, slava + random() * wlava)

    // generate sprite
    pI()
}

function gm(w, e, l) {
    var m = Math.round((w + e) * 0.5)
    if ((e-w) <= 1 || w === m || e === m) {
        return;
    }
    var a = (terrain[w] + terrain[e]) * 0.5 + l * (1 - 2 * random())
    terrain[m] = a
    gm(w, m, a * sharp)
    gm(m, e, a * sharp)
}

function lp(x, l) {
    x -= 5
    if (x < 0) x -= radius

    for (i = x; i < x+l+10; i++) {
        if (i < lake.length) if (lake[i] !== 0 || lava[i] !== 0) return true
    }
    return false 
}

function lm(t, x, l) {
    x = Math.floor(x/S)
    l = Math.round(l/S)
    if (lp(x, l)) return
    var n = terrain[x]
    var m = lake
    if (t < 0) m = lava
    for (i = x; i < x+l; i++) {
        if (i < m.length){
            var g = terrain[i]
            if (g >= n) terrain[i] -= 2*(g - n)
            m[i] = n
            if (i === x+l-1) {
                m[i] = 0
                terrain[i] = n
            }
        }
    }
}

function tm(l, p, a, b) {
    for (var i = a + 1; i < b; i++) {
        if (terrain[i] < l) {
            var d = terrain[i] - terrain[i-1]
            if (d > p) {
                terrain[i-1] += d/10
                terrain[i] -= d/10
            }
        }
    }
    for (i = b; i > a+1; i--) {
        if (terrain[i-1] < l) {
            d = terrain[i-2] - terrain[i-1]
            if (d > p) {
                terrain[i-2] -= d/10
                terrain[i-1] += d/10
            }
        }
    }
}

function loop() {
    warning = null
    var d = (Date.now() - lf) / 1000
    if (d > 0.25) d = 0.25
    lf = Date.now()
    
    fST += d
    fC++
    if (fST >= 1) {
        fST -= 1
        fps = fC
        fC = 0
    }          

    handle(d)
    update(d)
    render(d)
}

function sfc(d) {
    sf -= SFC * d
    if (sf < 0) sf = 0
}

function sac(d) {
    sa -= SAC * d
    if (sa < 0) sa = 0
}

function shd(d) {
    if (sf >= SFC*d) {
        if (kd[37] || kd[65]) { sw -= sh * 2 * d; sp = 0; sfc(d) }
        if (kd[39] || kd[68]) { sw += sh * 2 * d; sp = 0; sfc(d) }
        if (kd[38] || kd[87]) { sn += sv * 2 * d; sp = 0; sfc(d) }
        if (kd[40] || kd[83]) { sn -= sv * 2 * d; sp = 0; sfc(d) }
    }
    if (sf < 1) warning = 'no lava fire for engines!'
    if (kd[32]) {
        if (((sb == 0 && sa > sF/20) || (sb > 0 && sa > SAC*d))) { sb += d; sac(d) }
        else { sb = 0; warning = 'no water coolant for beam!'}
    } else sb = 0
}

function handle(d) {
    shd(d)
    if (kd[82]) { update(0.25); shd(0.25) } // fast-forward
    if (kd[90]) cx -= S
    if (kd[67]) cx += S
}

function sN() {
    var r = -1
    if (se >= 0) e[se].v = false
    se++
    for (var i = se; i < e.length; i++) {
        if (e[i].s == 0) {
            r = i
            se = i
            e[i].v = true
            return
        }
    }
    se = -1
}

function sD() {
    for (var i = 0; i < e.length; i++) {
        if (e[i].s == 0 && e[i].v) {
            e[i].x = sx
            e[i].y = sy - sH - e[i].H
            e[i].n = -10
            e[i].w = sw
            e[i].s = 2
            e[i].v = false
            sE--
            se = -1
        }
    }
}

function ht(x, y) {
    if (x >= W) x -= W
    y = y - terrain[Math.floor(x/S)]
    return y
}

function hc(x, y) {
    if (ht(x, y) < 0) return true
    return false
}

function hb(x, y) {
    if (x >= W) x -= W
    x = Math.round(x/S)
    if (x > lake.length) x = 0
    if (lake[x] && lake[x-1] !== 0) {
        y = y - lake[x]
        if (y > 0 && y < sB) return lake[x]
    }
    return 0
}

function hv(x, y) {
    if (x >= W) x -= W
    x = Math.round(x/S)
    if (x > lava.length) x = 0
    if (lava[x] && lava[x-1] !== 0) {
        y = y - lava[x]
        if (y > 0 && y < sB) return lava[x]
    }
    return 0
}

function ua(e) {
    if (e.t !== 1) return
    if (e.e === 1) {
        GR+=4
        if (GR > 255) GR = 255
        GG+=4
        if (GG > 255) GG = 255
        GB+=4
        if (GB > 255) GB = 255
        air++
    } else {
        GB--
        if (GB < 0) GB = 0
    }
}

function update(d) {
    action = ''
    time += d

    // spawn
    pU(d)
    
    // saucer
    if (cy > A+450) {
        jump += d
        if (!arrived && jump > 10) {
            arrived = true
            if (at() > 99) terr++
            genesis()
            sf = sF
            sa = sA
        }
    } else jump = 0
    if (cy < A/4) arrived = false 
    // normalize speed
    if (sw < 0) {
        if (sw < -mw) sw = -mw
        sw += sh * d
        if (sw > 0) sw = 0
    } 
    if (sw > 0) {
        if (sw > mw) sw = mw
        sw -= sh * d
        if (sw < 0) sw = 0
    }
    if (sp == 0) {
        if (sn == 0) {
            sl = sy
            sp = 1
        }
        if (sn < 0) {
            if (sn < -mn) sn = -mn
            sn += sv * d
            if (sn > 0) { sn = 0; sl = sy; sp = 1 }
        } 
        if (sn > 0) {
            if (sn > mn) sn = mn
            sn -= sv * d
            if (sn < 0) { sn = 0; sl = sy; sp = 2 }
        }
    }
    if (sc > 0) { sc -= sh * d * 0.5; if (sc < 0) sc = 0 }
    if (sp == 1) { sn += su * d; if (sn > si) sn = si; if (sy > sl + so) sp = 2 }
    else if (sp == 2) { sn -= su * d; if (sn < -si) sn = -si; if (sy < sl - so) sp = 1 }
    
    if (sw < -mw) sw = -mw
    if (sw > mw) sw = mw
    sx += sw * d
    sy += (sn + sc) * d
    if (sx < 0) sx= radius * S 
    if (sx > radius * S) sx = 0

    // terrain collision
    HH = ht(sx, sy-10) // debug 
    if (hc(sx, sy-10) || hc(sx-S, sy-10) || hc(sx-2*S, sy-10) || hc(sx-3*S, sy)
            || hc(sx+S, sy-10) || hc(sx+2*S, sy-10) || hc(sx+3*S, sy)) {
        sp = 0
        if (sn < 0) sc = sn * -2
        sn = 30
        stone(N.C4, 0.1, fwn, 0.125)
        // horizontal collision
        if (ht(sx-sW, sy) < 0) {
            if (sw < 0) sw *= -2
        }
        if (ht(sx+sW, sy) < 0) {
            if (sw > 0) sw *= -2
        }
    }
    // liquid beam
    if (sb > 0) {
        var k = hv(sx, sy)
        if (k !== 0) {
            sf += SFB*d
            fire += SFB*d
            sa += SAC*d*0.8
            action = 'beaming lava'
        } 
        k = hb(sx, sy)
        if (k !== 0) {
            sa += SAB*d
            water += SAB*d
            action = 'beaming water'
        }
    }
    sf += SFR*d
    if (sf > sF) sf = sF
    if (sa < sA/10) sa += SAR*d
    if (sa > sA) sa = sA
    
    var del = -1
    for (var n = 0; n < e.length; n++) {
        k = e[n]
        if (k.s < 0) {
            del = n
            continue
        }
        k.up(d)
        if (k.s === 0) continue
        // gravity
        if (k.t > 10) {
            k.n -= G*d
            if (k.n > 100) k.n = 100
        }
        // beam
        if (sb > 0 && sx > k.x - k.R && sx < k.x + k.R
                && sy - k.y < sB && sy - k.y - k.H > 0){
            k.n = B
            k.w = sw / 2
            if (k.t > 20) {
                action = 'beaming capsule'
            } else if (k.t === 20) {
                action = 'beaming raw materials'
            } else if (k.t > 10) {
                action = 'beaming eco-factory'
            }
            if (k.t === 1) {
                action = 'beaming drone'
                k.l = ht(k.x, k.y)
            }
            if (k.t === 2) action = 'beaming flak'
        }
        // movement
        if (k.w > k.W) k.w = k.W
        if (k.w < -k.W) k.w = -k.W
        if (k.n > k.N) k.n = k.N
        if (k.n < -k.N) k.n = -k.N
        k.x += k.w*d
        k.y += k.n*d
        // equator
        if (k.x < 0) {
            k.x += W
            ua(k)
        }
        if (k.x >= W) {
            k.x -= W
            ua(k)
        }
        if (k.w < 0) { k.w += k.W*d; if (k.w > 0) k.w = 0 }
        if (k.w > 0) { k.w -= k.W*d; if (k.w < 0) k.w = 0 }
        if (k.t < 2 && k.n < 0) { k.n += k.N*d; if (k.n > 0) k.n = 0 }
        if (k.n > 0) { k.n -= k.N*d; if (k.n < 0) k.n = 0 }
        // terrain collision
        var j = ht(k.x, k.y - k.H - 4)
        if (j < 0) {
            k.y -= j
            if (k.n < 0) k.n = k.n*-0.5
            else k.n = 0
            if (k.w < 0) { k.w += F*d; if (k.w > 0) k.w = 0 }
            if (k.w > 0) { k.w -= F*d; if (k.w < 0) k.w = 0 }
        }
        
        // collision
        if (sx+sW > k.x-k.R && sx-sW < k.x+k.R
                && sy+sH > k.y-k.H && sy-sH < k.y+k.H) {
            if (sb > 0 && k.t > 19 && sE < sC) {
                // beamed
                // TODO beamed SFX
                sE++
                k.s = 0
                if (k.t === 20) earth++
            } else {
                // TODO hit SFX
                sw = 0 
                sn = 0 
                k.w = k.W*4
                k.n = k.N*4
            }
        }
        for (var q = 0; q < e.length; q++) {
            var g = e[q]
            if ((q != n) && (g.s > 0)) {
                if (k.x+k.R > g.x-g.R && k.x-k.R < g.x+g.R
                    && k.y+k.H > g.y-g.H && k.y-k.H < g.y-g.H) {
                    if (k.t < 10 && g.t < 10 && k.e !== g.e) {
                        // TODO blow SFX
                        k.s = -1
                        g.s = -1
                    }
                    if (k.t === 11 && g.t === 20) {
                        // build
                        e.push(new E(k.e, 1, k.x, k.y - 40, 22, 27, BX[0]))
                        g.s = -1
                    }
                }
            }
        }
    }

    // camera targeting
    var zx = cx
    if (zx > W - w && sx < cx) zx -= W
    if (sx - zx < 200) cw -= ch * d
    else if (sx - zx > w - 200) cw += ch * d
    else {
        if (cw < 0) { cw += ch * d; if (cw > 0) cw = 0 }
        if (cw > 0) { cw -= ch * d; if (cw < 0) cw = 0 }
    }
    if (sy - cy < 100) cn -= ch * d
    else if (sy - cy > h - 100) cn += ch * d
    else {
        if (cn < 0) { cn += ch * d; if (cn > 0) cn = 0 }
        if (cn > 0) { cn -= ch * d; if (cn < 0) cn = 0 }
    }
    if (cw > cm) cw = cm
    if (cw < -cm) cw = -cm
    if (cn > cm) cn = cm
    if (cn < -cm) cn = -cm
    cx += cw * d
    cy += cn * d
    if (cx < 0) cx = radius * S - 0.001
    if (cx > radius * S) cx = 0

    // clean up
    if (del > -1) e.splice(del, 1)
}

function rc(c, x, y, r, f) {
    c.fillStyle = f
    c.fillRect(x, y, r, r)
}

function mc(c, x, y, e) {
    var k = e.b[0]
    x -= k*(e.X+1)/2
    y -= k*(e.X+1)/2
    var t = 0
    for(var i = 0; i < e.b.length - 1; i++) {
        var f = e.b[i+1]
        if (f > 0) {
            var z
            switch (f) {
                case 1: z = e.q; break
                case 2: z = e.a; break
                default: z = e.z
            }
            rc(c, x + (i%k)*(e.X+1), y + Math.floor(i/k)*(e.X+1), e.X, z)
        }
    }
}

function render(d) {
    cv = document.getElementById("canvas")
    c=cv.getContext("2d")
    // sky
    var g=c.createLinearGradient(0,200,20,0)
    var al = 1
    if (cy > 0) al = 1 - cy/A
    if (al > 1) al = 1
    if (al < 0) al = 0
    g.addColorStop(0,rgb(Math.floor(AR*al), Math.floor(AG*al), Math.floor(AB*al)))
    g.addColorStop(1,rgb(Math.floor(GR*al), Math.floor(GG*al), Math.floor(GB*al)))

    c.fillStyle=g
    c.fillRect(0,0,cv.width,cv.height)

    // terrain
    var k = w / S + 2
    if (L > 1) {
        d.lineWidth=2
        c.strokeStyle='#00BB00'
        c.fillStyle='#00BB00'
        var px = Math.round(cx / S) - 1
        if (px >= terrain.length) px = 0 
        var tx = px * S - cx
        for (var i = 0; i < k; i++) {
            c.beginPath()
            c.moveTo(tx, h - terrain[px] + cy)
            c.lineTo(tx, h + 1)
            tx += S 
            c.lineTo(tx, h + 1)
            if (px >= terrain.length - 1) px = -1 
            c.lineTo(tx, h - terrain[++px] + cy)
            c.closePath()
            c.fill()
            c.stroke()
        }
    }

    // terrain line
    c.lineWidth=4
    c.strokeStyle="#006000"
    px = Math.floor(cx / S)
    tx = px * S - cx
    c.beginPath()
    c.moveTo(tx, h - terrain[px] + cy)
    var ph = terrain[px]
    for (i = 1; i < k; i++) {
        tx += S 
        c.lineTo(tx, h - terrain[++px] + cy)
        if (px >= terrain.length) px = 0
    }
    c.stroke()
        
    // entities
    ph = w - 40
    for (i = e.length; i > 0; i--) {
        k = e[i-1]
        if (k.s > 0) {
            var tx = cx
            if (tx >= W - w && k.x < cx) tx -= W
            // TODO clipping/cooling
            if (k.x+k.R-tx > 0 && k.x-k.R-tx < w
                    && k.y+k.H-cy > 0 && k.y-k.H-cy < h) mc(c, k.x-tx, h-k.y+cy, k)
        } else if (k.s == 0) {
            if (k.v) mc(c, ph, 40, k)
            else mc(c, ph, 20, k)
            ph -= 30
        }
    }


    // saucer
    c.fillStyle = TM1;
    c.save()
    var zx = cx
    if (zx > W - w && sx < cx) zx -= W
    c.translate(sx - zx, h - sy + cy)
    c.save()
    c.rotate(sw/mw * 0.07 * Math.PI)

    c.beginPath();
    c.moveTo(-sW, 0)
    c.lineTo(-13, -11)
    c.lineTo(-13, 11)
    c.closePath()
    c.fill()

    c.beginPath();
    c.moveTo(sW, 0)
    c.lineTo(13, -11)
    c.lineTo(13, 11)
    c.closePath()
    c.fill()

    c.fillRect(-11,-11,10,10)
    c.fillRect(-11,1,10,10)
    c.fillRect(1,-11,10,10)
    c.fillRect(1,1,10,10)

    c.restore()

    // tractor beam
    if (sb > 0) {
        zx = hb(sx, sy)
        if (zx !== 0) {
            c.strokeStyle='#0000FF'
            c.fillStyle='#0000FF'
            c.fillRect(-5,sH,10, sy-zx-sH)
        } else {
            zx = hv(sx, sy)
            if (zx !== 0) {
                c.strokeStyle='#FF0000'
                c.fillStyle='#FF0000'
                c.fillRect(-5,sH,10, sy-zx-sH)
            }
        }

        k = ht(sx, sy)
        if (k > sB) k = sB
        k -= 30
        zx = k
        k -= 20 * (sb % 1)
        c.lineWidth = 4
        c.strokeStyle = '#F7D358'
        while (k > 0) {
            c.beginPath()
            c.arc(0, k, 20 + (k / zx) * 15, Math.PI/4, Math.PI * 0.75)
            c.stroke()
            k -= 20
        }
    }
    c.restore()

    // lakes
    c.lineWidth=2
    k = w / S + 2
    px = Math.round(cx / S) - 1
    if (px >= lake.length) px = 0 
    tx = px * S - cx
    if (px < 0) px = terrain.length - 1 
    for (i = 0; i < k; i++) {
        var l = lake[px]
        if (l !== 0) {
            c.strokeStyle='#0000FF'
            c.fillStyle='#0000FF'
        } else {
            l = lava[px]
            if (l !== 0) {
                c.strokeStyle='#FF0000'
                c.fillStyle='#FF0000'
            }
        }
        if (l !== 0) {
            c.beginPath()
            c.moveTo(tx, h - l + cy)
            c.lineTo(tx, h - terrain[px] + cy)
            px++
            if (px >= terrain.length - 1) px = -1 
            c.lineTo(tx+S, h - terrain[px] + cy)
            c.lineTo(tx+S, h - l + cy)
            c.closePath()
            c.fill()
            c.stroke()
        } else px++
        tx+=S
        if (px >= lake.length) px = 0
    }

    // console
    g=c.createLinearGradient(0,0,0,200)
    g.addColorStop(0,"#0000FF")
    g.addColorStop(1,"#AAAACC")
    c.fillStyle=g
    k = sa/sA
    c.fillRect(20,230-200*k,20, 200*k)
    g=c.createLinearGradient(0,0,0,200)
    g.addColorStop(0,"#FF0000")
    g.addColorStop(1,"#CCAAAA")
    c.fillStyle=g
    k = sf/sF
    c.fillRect(45,230-200*k,20, 200*k)

    // status
    c.fillStyle = "#204080";
    c.font = '18px monospace';
    c.textBaseline = 'bottom';
    c.fillText(action, 20, h-20);
    if (at() > 99) {
        warning = 'PLANET IS AIRFORMED!'
    }
    if (warning != null) {
        swarn += d
        if (swarn < 0.5) {
            c.fillText(warning, w - 300, h - 20)
        } else if (swarn > 1) {
            swarn = 0
        }

    }

    // score
    if (cy > A) {
        k = Math.floor((cy - A)/2)
        if (k > 255) k = 255
        c.fillStyle = rgb(k, k, k)
        c.font = '24px monospace';
        
        zx = w/2 - 50
        ph = h/2 - 60
        c.fillText('= SCORE =', zx, ph)
        ph += 20
        c.fillText('AIR: ' + Math.floor(air), zx, ph)
        ph += 20
        c.fillText('FIRE: ' + Math.floor(fire), zx, ph)
        ph += 20
        c.fillText('WATER: ' + Math.floor(water), zx, ph)
        ph += 20
        c.fillText('EARTH: ' + Math.floor(earth), zx, ph)
        ph += 20
        c.fillText('PLANETS', zx, ph)
        ph += 20
        c.fillText('  VISITED: ' + Math.floor(visit), zx, ph)
        ph += 20
        c.fillText('  AIRFORMED: ' + Math.floor(terr), zx, ph)
        if (arrived) {
            ph += 60
            c.fillStyle = '#FFFF00'
            if (time % 2 < 1) c.fillText('ARRIVED TO A NEW PLANET', zx-105, ph)
        }
    }

    c.fillStyle = "#204060";
    c.font = '18px monospace';
    var hh = Math.round(ht(sx, sy-sH))
    if (hh < 0) hh = 0
    var status = 'FPS:' + fps + ' ALT:' + Math.round(ht(sx, sy-sH)) + 'm AIR:' + at() + '%'
    c.fillText(status, 10, 25);
    c.fillText(debug, 10, 85);
}

function at() {
    return Math.round((GR + GG + GB) / 765 * 100)
}

var kd = {};

addEventListener("keydown", function (e) {
    kd[e.keyCode] = true
    return false
}, false);
addEventListener("keyup", function(e) {
    kd[e.keyCode] = false
    switch (e.keyCode) {
    case 27: genesis(); break
    case 16: case 69:
             sN()
             break
    case 13:case 81:
             sD()
             break
    case 76: L++; if (L > 2) L = 1; break
    }
    return false
}, false);

dm()
genesis(PA)
setInterval(loop, 33);
