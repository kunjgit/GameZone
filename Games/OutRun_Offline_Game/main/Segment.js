function Segment(prevSegment, curve, hill, index, isInitial, isTunnel) {
    this.numLanes = prevSegment.numLanes;
    this.isInitial = isInitial;
    this.curve = prevSegment.curve + curve;
    this.hill = prevSegment.hill + hill;
    this.lowCenter = prevSegment.highCenter;
    this.highCenter = new Vector3(this.lowCenter.x + curve, this.lowCenter.y + hill, this.lowCenter.z + segmentDepth);
    this.isDark = index % (2 * invisSegment) < invisSegment;
    this.offroad = new Tile(prevSegment.offroad, this.highCenter);
    this.asphalt = new Tile(prevSegment.asphalt, this.highCenter);
    this.leftSide = new Tile(prevSegment.leftSide, this.highCenter);
    this.rightSide = new Tile(prevSegment.rightSide, this.highCenter);
    this.lines = [];
    for (var i = 0; i < this.numLanes - 1; i++) {
        this.lines.push(new Tile(prevSegment.lines[i], this.highCenter));
    }
    this.objects = [];
    if (!isTunnel) {
        if (!(index % (objectDistance / 4))) {
            this.objects.push(new WorldObject(new Vector3(this.highCenter.x, this.highCenter.y, this.highCenter.z), 'terrain'));
            if (Math.random() < 0.1) {
                this.objects.push(new WorldObject(new Vector3(this.highCenter.x, this.highCenter.y, this.highCenter.z), 'left' + (Math.random() < 0.5 ? '1' : '2')));
            }
        }
        if (!(index % objectDistance)) {
            this.objects.push(new WorldObject(new Vector3(this.highCenter.x, this.highCenter.y, this.highCenter.z), 'right' + (Math.random() < 0.5 ? '1' : '2')));
        }
    } else if (!(index % tunnelDistance)) {
        this.objects.push(new WorldObject(new Vector3(this.highCenter.x, this.highCenter.y, this.highCenter.z), 'tunnel'));
    }
}

const invisSegment = 5;
const sideLineWidth = 300;
const lineWidth = 150;
const laneWidth = 1200;
const offroadWidth = 70000;
const segmentDepth = 600;
const objectDistance = 20;
const tunnelDistance = 6;

Segment.prototype.project = function () {
    if (this.isInitial & this.lowCenter.z > Driver.camera.position.z) {
        this.offroad.downLeft.project();
        this.offroad.downRight.project();
        this.asphalt.downLeft.project();
        this.asphalt.downRight.project();
        this.leftSide.downLeft.project();
        this.leftSide.downRight.project();
        this.rightSide.downLeft.project();
        this.rightSide.downRight.project();
        for (var i = 0; i < this.numLanes - 1; i++) {
            this.lines[i].downLeft.project();
            this.lines[i].downRight.project();
        }
    }
    this.highCenter.x = this.lowCenter.x + (this.curve - Driver.curve);
    this.highCenter.project();
    var measure2 = this.highCenter.z - Driver.camera.position.z;
    this.offroad.project(measure2);
    this.asphalt.project(measure2);
    this.leftSide.project(measure2);
    this.rightSide.project(measure2);
    for (var i = 0, size = this.numLanes / 2; i < size; i++) {
        var relSpace = Vector3.calculate(this.lines[i].space, Driver.camera.gap, measure2);
        var relWidth = Vector3.calculate(this.lines[i].width, Driver.camera.gap, measure2);
        this.lines[i].calculate(relSpace, relWidth);
        this.lines[this.numLanes - 2 - i].calculate(-relSpace, relWidth);
    }
    if (this.numLanes % 2 == 0) {
        this.lines[this.numLanes / 2 + 1].project(measure2);
    }
    for (var i = 0; i < this.objects.length; i++) {
        if (dimensions[Outrun.gameWorld.route][this.objects[i].fileName] != undefined) {
            this.objects[i].center.x = this.highCenter.x + dimensions[Outrun.gameWorld.route][this.objects[i].fileName].offset;
            this.objects[i].project(measure2);
        }
    }
}