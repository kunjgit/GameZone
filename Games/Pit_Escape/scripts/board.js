function createCanvas(size, fn) {
    var canvas = document.createElement('canvas')
    canvas.height = canvas.width = size
    return fn(canvas.getContext('2d'))
}

function btouv(x) { return 45 * x + 4 }

function paintField(canvas) {
    var i, j
    canvas.fillStyle = '#89867e'
    canvas.fillRect(0, 0, 412, 412)

    canvas.fillStyle = '#fcf6f0'
    for (i = 0; i < 9; ++i) {
        for (j = 0; j < 9; ++j) {
            if (i == 8 && j == 4) {
                canvas.fillStyle = '#fb3'
                canvas.fillRect(btouv(i), btouv(j), 44, 44)
                canvas.fillStyle = '#fcf6f0'
            }
            else canvas.fillRect(btouv(i), btouv(j), 44, 44)
        }
    }

    canvas.beginPath()
    canvas.moveTo(btouv(3),      btouv(4))
    canvas.lineTo(btouv(4) + 22, btouv(4))
    canvas.lineTo(btouv(4) + 22, btouv(3) + 22)
    canvas.lineTo(btouv(5) + 44, btouv(4) + 22)
    canvas.lineTo(btouv(4) + 22, btouv(5) + 22)
    canvas.lineTo(btouv(4) + 22, btouv(4) + 44)
    canvas.lineTo(btouv(3),      btouv(4) + 44)
    canvas.closePath()

    canvas.fillStyle = '#e9e3dd'
    canvas.lineWidth = 4
    canvas.strokeStyle = '#89867e'

    canvas.fill()
    canvas.stroke()

    return canvas.canvas.toDataURL()
}

var _grass = (
    '74b44a166a63c15f9f35155952b1a0cf70195c465' +
    '76b64c163a339163a339176b64c176b64c176b64c').split(1)

function paintFieldG(canvas) {
    var i, j, u, v, x, y
    canvas.fillStyle = '#fcf6f0'
    canvas.fillRect(0, 0, 412, 412)

    for (i = 0; i < 9; ++i) {
        for (j = 0; j < 9; ++j) {
            x = btouv(i)
            y = btouv(j)
            for (u = 0; u < 11; ++u) {
                for (v = 0; v < 11; ++v) {
                    canvas.fillStyle = '#' + _grass[0|11 * Math.random()]
                    canvas.fillRect(4 * u + x, 4 * v + y, 4, 4)
                }
            }
        }
    }

    return canvas.canvas.toDataURL()
}

var floor = createCanvas(412, paintField)
var grass = createCanvas(412, paintFieldG)
