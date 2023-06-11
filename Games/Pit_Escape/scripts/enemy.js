function enemyHTML(id, cn, x, y) {
    return '<div class="c h ' + cn + '" id=' + id +
           ' data-x=' + x + ' data-y=' + y + '>' +
           '<div class=i></div><div class=j></div>' +
           '<div class=k></div><div class=l></div></div>'
}

var autoIncrement = 0

function insertBlock(cn, x, y) {
    var id = 'blk' + (++autoIncrement)
    $psp.insertAdjacentHTML('beforeend', enemyHTML(id, cn, x, y))
    return $id(id)
}

/** @constructor */
function Enemy(cname, options) {
    this.cn = cname
    this.x = options.head[0]
    this.y = options.head[1]

    this.$ = insertBlock(cname, this.x, this.y)
    this.$tail = []

    for (var i = 0; i < options.tail.length; ++i) {
        var tail = options.tail[i]
        var tailBlk = {
            x: tail[0], y: tail[1],
            $: insertBlock(cname + ' t' + i, tail[0], tail[1])
        }
        this.$tail.push(tailBlk)
    }

    setTimeout(this.reveal.bind(this))
}

Enemy.prototype.reveal = function () {
    var cname = 'c ' + this.cn
    this.$.className = cname
    for (var i = 0; i < this.$tail.length; ++i)
        this.$tail[i].$.className = cname + ' t' + i
}

Enemy.prototype.remove = function () {
    $psp.removeChild(this.$)
    for (var i = 0; i < this.$tail.length; ++i)
        $psp.removeChild(this.$tail[i].$)
}

Enemy.prototype.$update = function () {
    this.$.dataset.x = this.x
    this.$.dataset.y = this.y
    for (var i = 0; i < this.$tail.length; ++i) {
        var tail = this.$tail[i]
        tail.$.dataset.x = tail.x
        tail.$.dataset.y = tail.y
    }
}

Enemy.prototype.hasPlayer = function () {
    if (this.x == escapist.x && this.y == escapist.y)
        return true
    for (var i = 0; i < this.$tail.length; ++i) {
        var tail = this.$tail[i]
        if (tail.x == escapist.x && tail.y == escapist.y)
            return true
    }
    return false
}
