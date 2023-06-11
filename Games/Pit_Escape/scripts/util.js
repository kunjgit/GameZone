function $id(id) { return document.getElementById(id) }
function rand0(a) { return a * (Math.random() - 0.5) }
function max(a, b) { return b > a? b: a }
function min(a, b) { return b < a? b: a }

var style = document.createElement('style'),
    css = '#fl{background:url("' + floor + '")}', i

for (i = 0; i < 9; ++i) {
    css += '[data-x="%"]{left:#px}[data-y="%"]{top:#px}'
    .replace(/%/g, i).replace(/#/g, btouv(i))
}

css += '.win #fl{background:url("' + grass + '")}'

style.appendChild(document.createTextNode(css))
document.head.appendChild(style)

var $scr = $id('scr')
var $psp = $id('psp')

function pspOff() { $scr.className = 'nopsp' }

var rand9_gt0 = 1
function rand9(a) {
    return ((rand9_gt0 = !rand9_gt0)? 1: -1) * a * max(Math.random(), 0.1)
}

function pspAny() {
    $scr.className = ''
    $psp.style.transform = 'rotateX(' + (0|40 + rand0(10)) +
                           'deg) rotateZ(' + (0|rand9(25)) + 'deg)'
}

var opt = {'snd': 1}

function bind_opt(name) {
    $id(name).addEventListener('change',
        function (event) { opt[name] = event.target.checked },
        false)
}
bind_opt('snd')
