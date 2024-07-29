function GameWorld() {
    this.road = new Road(new Vector3(0, 0, 0), 0, 0, trackNumLanes);
    this.route = 'coconut-beach';
    this.currentColor = colors['coconut-beach'];
    this.backParallax = 0;
    this.frontParallax = 0;
}

const backSpeed = 0.000001;
const frontSpeed = 0.000002;
const backWidth = 1536;
const frontWidth = 2048;
const backgroundHeight = 256;
const backgroundOffset = -135;

GameWorld.prototype.play = function () {
    if (this.road.endSegment != null && this.road.findIndex(this.road.endSegment.highCenter.z) < this.road.findIndex(Driver.camera.position.z))
        Outrun.playable = false;
    if (Outrun.playable)
        Driver.play();
    for (var i = 0; i < this.road.vehicles.length; i++) {
        this.road.vehicles[i].play();
    }
}

GameWorld.prototype.update = function () {
    var currentIndex = this.road.findIndex(Driver.camera.position.z);
    for (var i = currentIndex, size = Math.min(this.road.segments.length, currentIndex + Outrun.renderSize); i < size; i++) {
        this.road.segments[i].project();
    }
    Driver.project();
    for (var i = 0; i < this.road.vehicles.length; i++) {
        this.road.vehicles[i].project();
    }
    this.route = this.road.findRoute();
    for (var i = 0; i < 9; i++) {
        var key = Object.keys(this.currentColor)[i];
        this.currentColor[key] = Canvas.mix(this.currentColor[key], colors[this.route][key], 1);
    }
    var parallaxAmount = Driver.speed * Math.sign(Driver.curveDirection);
    this.backParallax -= backSpeed * parallaxAmount;
    this.frontParallax -= frontSpeed * parallaxAmount;
    if (Math.abs(this.backParallax) > 1) {
        this.backParallax = 0;
    }
    if (Math.abs(this.frontParallax) > 1) {
        this.frontParallax = 0;
    }
}

GameWorld.prototype.draw = function () {
    Canvas.fillGradient(this.currentColor.skyColor);
    Canvas.drawStaticImage(sprites[this.route].back, backWidth * (this.backParallax - 1), backgroundOffset, backWidth, backgroundHeight);
    Canvas.drawStaticImage(sprites[this.route].back, backWidth * (this.backParallax), backgroundOffset, backWidth, backgroundHeight);
    Canvas.drawStaticImage(sprites[this.route].back, backWidth * (this.backParallax + 1), backgroundOffset, backWidth, backgroundHeight);
    Canvas.drawStaticImage(sprites[this.route].front, frontWidth * (this.frontParallax - 1), backgroundOffset, frontWidth, backgroundHeight);
    Canvas.drawStaticImage(sprites[this.route].front, frontWidth * (this.frontParallax), backgroundOffset, frontWidth, backgroundHeight);
    Canvas.drawStaticImage(sprites[this.route].front, frontWidth * (this.frontParallax + 1), backgroundOffset, frontWidth, backgroundHeight);
    var currentIndex = this.road.findIndex(Driver.camera.position.z);
    var maxRendered = Math.min(this.road.segments.length, currentIndex + Outrun.renderSize) - 1;
    for (var i = maxRendered; i >= currentIndex; i--) {
        var segment = this.road.segments[i];
        var color = segment.isDark ? this.currentColor.darkOffroadColor : this.currentColor.lightOffroadColor;
        if (segment instanceof Segment) {
            Canvas.drawShape(segment.offroad.upLeft, segment.offroad.upRight, segment.offroad.downRight, segment.offroad.downLeft, color);
        } else {
            var subSegment = segment.leftJunction;
            Canvas.drawShape(subSegment.offroad.upLeft, subSegment.offroad.upRight, subSegment.offroad.downRight, subSegment.offroad.downLeft, color);
            subSegment = segment.rightJunction;
            Canvas.drawShape(subSegment.offroad.upLeft, subSegment.offroad.upRight, subSegment.offroad.downRight, subSegment.offroad.downLeft, color);
        }
    }
    for (var i = maxRendered; i >= currentIndex; i--) {
        var segment = this.road.segments[i];
        var asphaltColor = segment.isDark ? this.currentColor.darkAsphaltColor : this.currentColor.lightAsphaltColor;
        var sideColor = segment.isDark ? this.currentColor.darkSideColor : this.currentColor.lightSideColor;
        var lineColor = segment.isDark ? this.currentColor.darkLineColor : this.currentColor.lightLineColor;
        if (segment instanceof Segment) {
            Canvas.drawShape(segment.asphalt.upLeft, segment.asphalt.upRight, segment.asphalt.downRight, segment.asphalt.downLeft, asphaltColor);
            Canvas.drawShape(segment.leftSide.upLeft, segment.leftSide.upRight, segment.leftSide.downRight, segment.leftSide.downLeft, sideColor);
            Canvas.drawShape(segment.rightSide.upLeft, segment.rightSide.upRight, segment.rightSide.downRight, segment.rightSide.downLeft, sideColor);
            for (var j = 0; j < segment.numLanes - 1; j++) {
                Canvas.drawShape(segment.lines[j].upLeft, segment.lines[j].upRight, segment.lines[j].downRight, segment.lines[j].downLeft, lineColor);
            }
            for (var j = 0; j < segment.objects.length; j++) {
                var object = segment.objects[j];
                if (sprites[this.route][object.fileName] != undefined)
                    Canvas.drawImage(sprites[this.route][object.fileName], object.center, object.relWidth, object.relHeight);
            }
        } else {
            var subSegment = segment.leftJunction;
            Canvas.drawShape(subSegment.asphalt.upLeft, subSegment.asphalt.upRight, subSegment.asphalt.downRight, subSegment.asphalt.downLeft, asphaltColor);
            Canvas.drawShape(subSegment.leftSide.upLeft, subSegment.leftSide.upRight, subSegment.leftSide.downRight, subSegment.leftSide.downLeft, sideColor);
            Canvas.drawShape(subSegment.rightSide.upLeft, subSegment.rightSide.upRight, subSegment.rightSide.downRight, subSegment.rightSide.downLeft, sideColor);
            for (var j = 0; j < subSegment.numLanes - 1; j++) {
                Canvas.drawShape(subSegment.lines[j].upLeft, subSegment.lines[j].upRight, subSegment.lines[j].downRight, subSegment.lines[j].downLeft, lineColor);
            }
            for (var j = 0; j < subSegment.objects.length; j++) {
                var object = subSegment.objects[j];
                if (sprites[this.route][object.fileName] != undefined)
                    Canvas.drawImage(sprites[this.route][object.fileName], object.center, object.relWidth, object.relHeight);
            }
            subSegment = segment.rightJunction;
            Canvas.drawShape(subSegment.asphalt.upLeft, subSegment.asphalt.upRight, subSegment.asphalt.downRight, subSegment.asphalt.downLeft, asphaltColor);
            Canvas.drawShape(subSegment.leftSide.upLeft, subSegment.leftSide.upRight, subSegment.leftSide.downRight, subSegment.leftSide.downLeft, sideColor);
            Canvas.drawShape(subSegment.rightSide.upLeft, subSegment.rightSide.upRight, subSegment.rightSide.downRight, subSegment.rightSide.downLeft, sideColor);
            for (var j = 0; j < subSegment.numLanes - 1; j++) {
                Canvas.drawShape(subSegment.lines[j].upLeft, subSegment.lines[j].upRight, subSegment.lines[j].downRight, subSegment.lines[j].downLeft, lineColor);
            }
            for (var j = 0; j < subSegment.objects.length; j++) {
                var object = subSegment.objects[j];
                if (sprites[this.route][object.fileName] != undefined)
                    Canvas.drawImage(sprites[this.route][object.fileName], object.center, object.relWidth, object.relHeight);
            }
        }
    }
    for (var i = this.road.vehicles.length - 1; i >= 0; i--) {
        var vehicle = this.road.vehicles[i];
        var position = this.road.findIndex(vehicle.car.center.z);
        if (position > currentIndex & position < maxRendered)
            Canvas.drawImage(sprites[vehicle.vehicleType][vehicle.car.fileName], vehicle.car.center, vehicle.car.relWidth, vehicle.car.relHeight);
    }
    Canvas.drawImage(sprites[Driver.car.fileName], Driver.car.center, Driver.car.relWidth, Driver.car.relHeight);

    Canvas.drawStaticImage(sprites['hud-' + this.route], 301, 210, 16, 11);
    Canvas.drawStaticImage(sprites['hud-kmh'], 27, 210, 18, 13);
    Canvas.drawText(Math.floor(Driver.speed / 3).toString());

    if (this.road.segments.length - currentIndex < Outrun.renderSize) {
        this.road.addSegments(true);
    }
}

let Driver = new Player();