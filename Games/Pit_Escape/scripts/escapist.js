var removeHelp = function () {
    $id('hlp').className = 'off'
    removeHelp = function () {}
}

var escapist = {
    x: 0, y: 4,
    levelComplete: false,
    $: document.getElementsByClassName('pl')[0],
    $update: function () {
        this.$.dataset.x = this.x
        this.$.dataset.y = this.y
        this.levelComplete = this.x == 8 && this.y == 4
    }
}

function controls(event) {
    if (event.defaultPrevented)
        return

    // console.log('event.key = ' + event.key)
    // console.log('event.keyCode = 0x' + event.keyCode.toString(16))

    if (escapist.levelComplete) {
        event.preventDefault()
        return
    }

    switch (event.key || event.keyCode) {
        case 'Up':
        case 'ArrowUp':
        case 'w': case 'W':
        case 'k': case 'K':
        case 0x26:
        case 0x57:
        case 0x4b:
        escapist.y = max(0, escapist.y - 1)
        break

        case 'Left':
        case 'ArrowLeft':
        case 'a': case 'A':
        case 'h': case 'H':
        case 0x25:
        case 0x41:
        case 0x48:
        escapist.x = max(0, escapist.x - 1)
        break

        case 'Down':
        case 'ArrowDown':
        case 's': case 'S':
        case 'j': case 'J':
        case 0x28:
        case 0x53:
        case 0x4a:
        escapist.y = min(8, escapist.y + 1)
        break

        case 'Right':
        case 'ArrowRight':
        case 'd': case 'D':
        case 'l': case 'L':
        case 0x27:
        case 0x44:
        case 0x4c:
        escapist.x = min(8, escapist.x + 1)
        break

        case '9':
        case 0x39:
        restartGame()
        break

        // cheat: goto exit
        case ']':
        case 0xdd:
        escapist.x = 8
        escapist.y = 4
        break

        default:
        return
    }

    escapist.$update()
    escapist.levelComplete || testCaught() || enemyTurn()
    event.preventDefault()

    aa.play('go')
    removeHelp()
}

function moved(event) {
    if (escapist.levelComplete)
        nextLevel()
}

window.addEventListener('keydown', controls, true)
escapist.$.addEventListener('transitionend', moved, false)
