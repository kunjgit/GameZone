var depth = 9
var $depth = $id('dp').firstChild

var msgs = [
    'This was a triumph',
    'Paint it red',
    'Unlikely',
    'Narrow escape',
    'We swarm',
    'Switchback',
    'Stay with me',
    'Easy mode',
    'You are (not) alone',
    'Escape the pit'
]
var $msg = $id('msg').firstChild

var $caught = $id('fu')

var enemy1setup = [
    {},
    {head: [3, 4], tail: [[4, 4], [5, 4]]},
    {head: [7, 3], tail: [[6, 3], [5, 3], [5, 4], [5, 5]]},
    {head: [3, 6], tail: [[3, 6], [3, 5], [3, 4], [3, 3]]},
    {head: [1, 3], tail: [[1, 2], [2, 2]]},
    {head: [4, 7], tail: [[5, 7], [6, 7], [6, 6]]},
    {head: [2, 1], tail: [[2, 0], [1, 0], [0, 0]]},
    {head: [2, 7], tail: [[2, 8], [3, 8], [4, 8], [5, 8]]},
    {head: [2, 1], tail: [[3, 1], [4, 1], [5, 1]]},
    {}
]
var enemy2setup = [
    {},
    {head: [2, 6], tail: [[2, 7], [1, 7], [1, 8]]},
    {head: [6, 4], tail: [[7, 4], [7, 5]]},
    {head: [5, 2], tail: [[5, 3], [5, 4], [5, 5], [5, 6]]},
    {head: [2, 5], tail: [[2, 6], [3, 6]]},
    {head: [6, 4], tail: [[5, 4], [4, 4], [3, 4], [2, 4]]},
    {head: [7, 3], tail: [[7, 4], [7, 5], [8, 5], [8, 6]]},
    {head: [6, 1], tail: [[7, 1], [8, 1], [8, 2]]},
    {},
    {}
]
var enemy1 = null
var enemy2 = null

function nextLevel(lvl) {
    if (enemy1) {
        enemy1.remove()
        enemy1 = null
    }
    if (enemy2) {
        enemy2.remove()
        enemy2 = null
    }

    if (!depth) {
        escapist.levelComplete = false
        return
    }

    pspAny()
    escapist.x = 0
    escapist.y = 4
    escapist.$update()

    if (typeof lvl == 'undefined')
        --depth
    else depth = lvl

    $depth.nodeValue = depth
    $msg.nodeValue = msgs[depth]

    if (!depth) {
        $scr.className = 'win'
        aa.play('win')
        lvl = 'x' // disable sound fx (see below)
    }

    if (enemy1setup[depth].head)
        enemy1 = new Enemy('enr', enemy1setup[depth])
    if (enemy2setup[depth].head)
        enemy2 = new Enemy('enb', enemy2setup[depth])

    lvl || aa.play('lvl')
}

function enemyTurn() {
    enemy1 && _enemyTurn(enemy1)
    enemy2 && _enemyTurn(enemy2)
}

function _enemyTurn(enemy) {
    var i, j, m = [], g, start, end, path

    for (i = 0; i < 9; ++i) {
        m[i] = []
        for (j = 0; j < 9; ++j) {
            m[i][j] = (i == 8 && j == 4)? 0: 1
        }
    }

    if (enemy1) {
        for (i = 0; i < enemy1.$tail.length; ++i)
            m[enemy1.$tail[i].x][enemy1.$tail[i].y] = 0
    }

    if (enemy2) {
        for (i = 0; i < enemy2.$tail.length; ++i)
            m[enemy2.$tail[i].x][enemy2.$tail[i].y] = 0
    }

    if (enemy===enemy1)
        enemy2 && (m[enemy2.x][enemy2.y] = 0)
    else
        enemy1 && (m[enemy1.x][enemy1.y] = 0)

    g = new Graph(m)
    start = g.grid[enemy.x][enemy.y]
    end = g.grid[escapist.x][escapist.y]
    path = astar.search(g, start, end)

    if (!path.length) return

    for (i = enemy.$tail.length - 1; i > -1; --i) {
        var tail = enemy.$tail[i]
        var before = i? enemy.$tail[i - 1]: enemy
        tail.x = before.x
        tail.y = before.y
    }
    enemy.x = path[0].x
    enemy.y = path[0].y
    enemy.$update()

    testCaught()
}

function testCaught() {
    if ((enemy1 && enemy1.hasPlayer()) ||
        (enemy2 && enemy2.hasPlayer())) {

        nextLevel(++depth)
        if (depth == 9) pspOff()
        $caught.className = 's'
        aa.play('bad')
        return true
    }
    return false
}

function throwBack() { $caught.className = '' }
$caught.addEventListener('transitionend', throwBack, false)

function restartGame() {
    nextLevel(depth = 9)
    pspOff()
}
