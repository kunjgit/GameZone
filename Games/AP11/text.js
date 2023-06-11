//TODO cache character to images and remove repeated characters
function Text() {
    this.charactersData = [
        [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], //0
        [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //1
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1], //2
        [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1], //3
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], //4
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], //5
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 1, 1, 1, 1], //6
        [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0], //7
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1], //8
        [1, 1, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1], //9
        [0, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], //+
        [0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0], //-
        [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //t
        [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], //r
        [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 0], //y
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1], //a
        [0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 1, 1], //g
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1], //a
        [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //i
        [1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1], //n
        [1, 1, 1, 0, 0, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0], //?
        [1, 1, 1, 1, 0, 0, 1, 1, 1, 0, 0, 1, 1, 1, 1], //s
        [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //t
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1], //a
        [1, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0, 1, 1, 0, 1], //r
        [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //t
        [0, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1, 1, 1, 0, 1], //a
        [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0], //l
        [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1], //o
        [1, 1, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0] //t
    ];
};

Text.prototype.drawNumber = function(x, y, number, color, strokeColor, size, showSign, align) {
    var characters = [],
        n = Math.abs(Math.ceil(number)),
        characterSpacing = size * 4;
    if (n === 0) {
        characters.push(0);
    } else {
        while (n > 0) {
            characters.push(n % 10);
            n = Math.floor(n / 10);
        }
        if (showSign) {
            if (number > 0) {
                characters.push(10);
            } else if (number < 0) {
                characters.push(11);
            }
        }
    }
    if (align === 'right') {
        x -= characters.length * 16;
    } else if (align === 'left') {
        x += characters.length * 16;
    }
    for (var i = 0; i < characters.length; i++) {
        this.drawCharacter(x + characters.length / 2 * characterSpacing - characterSpacing - i * characterSpacing, y, characters[i], color, strokeColor, size);
    }

};

Text.prototype.drawCharacter = function(x, y, characterIndex, color, strokeColor, size) {
    var character = this.charactersData[characterIndex];
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 5; j++) {
            if (character[j * 3 + i]) {
                drawStroke(context, x + i * size, y + j * size, size + 0.5, size + 0.5, strokeColor, 5);
            }
        }
    }
    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 5; j++) {
            if (character[j * 3 + i]) {
                drawRect(context, x + i * size, y + j * size, size + 0.5, size + 0.5, color);
            }
        }
    }
};

Text.prototype.drawStart = function() {
    for (var i = 0; i < 5; i++) {
        text.drawCharacter(halfCanvasWidth - 80 + i * 35, halfCanvasHeight + 100, i + 22, 'rgb(178,34,34)', 'rgb(20,20,20)', 8);
    }
};

Text.prototype.drawFinalPoints = function() {
    var numberWidth = ap11.points.toString().length;
    if (numberWidth > 15) {
        for (var i = 0; i < 4; i++) {
            text.drawCharacter(halfCanvasWidth - 200 + i * 110, halfCanvasHeight - 200, i + 27, 'rgb(65,105,225)', 'rgb(20,20,20)', 32);
        }
    } else {
        text.drawNumber(halfCanvasWidth, halfCanvasHeight - 200, ap11.points, 'rgb(65,105,225)', 'rgb(20,20,20)',
            numberWidth > 6 ? 32 - (numberWidth - 6) * 2 : 32);
    }
};

Text.prototype.drawTryAgain = function() {
    for (var i = 0; i < 10; i++) {
        text.drawCharacter(halfCanvasWidth - 5 * 30 + i * 30, halfCanvasHeight + 50, i + 12, 'rgb(178,34,34)', 'rgb(20,20,20)', 8);
    }
};

Text.prototype.drawPointsAndLife = function() {
    //draw points
    var numberWidth = ap11.points.toString().length;
    if (numberWidth > 15) {
        for (var i = 0; i < 4; i++) {
            text.drawCharacter(canvasWidth - 140 + i * 32, canvasHeight - 50, i + 27, 'rgb(65,105,225)', 'rgb(20,20,20)', 8);
        }
    } else {
        text.drawNumber(canvasWidth - 12, canvasHeight - 58, ap11.points, 'rgb(65,105,225)', 'rgb(20,20,20)', 8, false, 'right');
    }
    //draw life
    text.drawNumber(16, canvasHeight - 58, ap11.car.life, 'rgb(178,34,34)', 'rgb(20,20,20)', 8, true, 'left');
};