function random() {
    return Math.random();
}

function maxRandom(max) {
    return Math.round(random() * max);
}

function variateRandom(baseValue, allowedVariation) {
    return baseValue + maxRandom(allowedVariation);
}

function variateColor(r, g, b, allowedVariation) {
    var v = maxRandom(allowedVariation);
    return 'rgb(' + (r - v) + ',' + (g - v) + ',' + (b - v) + ')';
}

function drawRect(context, x, y, width, height, color) {
    context.fillStyle = color;
    context.fillRect(x, y, width, height);
}

function drawStroke(context, x, y, width, height, color, lineWidth) {
    context.lineWidth = lineWidth;
    context.strokeStyle = color;
    context.strokeRect(x, y, width, height);
}

function calculateAngle(x, y) {
    return Math.atan2(x, y);
}

function calculateDistance(x, y) {
    return Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
}