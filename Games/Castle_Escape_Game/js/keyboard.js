addEventListener('keydown', onKeydown)
addEventListener('keyup', onKeyup)
addEventListener('blur', onBlur)

function onKeydown (e) {
  if (pressed[e.which]) return
  pressed[e.which] = true
  pressedLastTick[e.which] = true
}

function onKeyup (e) {
  pressed[e.which] = false
}

function onBlur () {
  pressed = {}
}

const isDown = key => !!pressed[key]
const wasDown = key => !!pressedLastTick[key]
const down = key => isDown(key) || wasDown(key)
