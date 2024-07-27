function Player() {
    this.camera = new Camera(window.innerWidth, window.innerHeight, 300, 120);
    this.car = new WorldObject(new Vector3(0, 0, carDistance), 'straight');
    this.car.width = 810;
    this.car.height = 460;
    this.car.project = function (measure2) {
        this.center.project();
        this.relWidth = Vector3.calculate(this.width, Driver.camera.gap, measure2);
        this.relHeight = Vector3.calculate(this.height, Driver.camera.gap, measure2);
    }
    this.lastSegment = null;
    this.curve = 0;
    this.hill = 0;
    this.curveDirection = 0;
    this.hillDirection = 0;
    this.speed = 0;
    this.accelerate = false;
    this.decelerate = false;
    this.steerLeft = false;
    this.steerRight = false;
}

const maxSpeed = 900;

const carDistance = 5000;

const curveSense = 0.2;
const hillSense = 10;
const speedSense = 250;

Player.prototype.play = function () {
    if (this.accelerate) {
        this.speed += 4;
    } else if (this.decelerate) {
        this.speed -= 16;
    } else {
        this.speed -= 2;
    }
    this.speed = this.speed < 0 ? 0 : this.speed > maxSpeed ? maxSpeed : this.speed;

    var carIndex = Outrun.gameWorld.road.findIndex(this.car.center.z);
    var segment = Outrun.gameWorld.road.segments[carIndex];
    if (segment instanceof Segment) {
        this.lastSegment = segment;
        this.curve = segment.curve;
        this.hill = segment.hill;
        if (Outrun.gameWorld.road.segments[carIndex - 1] instanceof Segment) {
            this.curveDirection = this.curve - Outrun.gameWorld.road.segments[carIndex - 1].curve;
            this.hillDirection = this.hill - Outrun.gameWorld.road.segments[carIndex - 1].hill;
        } else {
            this.curveDirection = 0;
            this.hillDirection = 0;
        }
    } else {
        if (Outrun.gameWorld.road.trackCount > Outrun.gameWorld.road.chosenPath.length) {
            Outrun.gameWorld.road.chosenPath.push(this.car.center.x >= this.lastSegment.highCenter.x);
        }
        if (Outrun.gameWorld.road.chosenPath[Outrun.gameWorld.road.chosenPath.length - 1]) {
            this.curve = segment.rightJunction.curve;
            this.hill = segment.rightJunction.hill;
            if (Outrun.gameWorld.road.segments[carIndex - 1] instanceof Junction) {
                this.curveDirection = this.curve - Outrun.gameWorld.road.segments[carIndex - 1].rightJunction.curve;
                this.hillDirection = this.hill - Outrun.gameWorld.road.segments[carIndex - 1].rightJunction.hill;
            } else {
                this.curveDirection = 0;
                this.hillDirection = 0;
            }
        } else {
            this.curve = segment.leftJunction.curve;
            this.hill = segment.leftJunction.hill;
            if (Outrun.gameWorld.road.segments[carIndex - 1] instanceof Junction) {
                this.curveDirection = this.curve - Outrun.gameWorld.road.segments[carIndex - 1].leftJunction.curve;
                this.hillDirection = this.hill - Outrun.gameWorld.road.segments[carIndex - 1].leftJunction.hill;
            } else {
                this.curveDirection = 0;
                this.hillDirection = 0;
            }
        }
    }

    zMove = this.speed * (this.steerLeft | this.steerRight ? 0.99 : 1);
    xMove = this.speed * ((this.steerLeft ? -0.08 : this.steerRight ? 0.08 : 0) - this.curveDirection / 25);

    this.camera.position.z += zMove;
    this.camera.position.x += xMove;
    this.camera.position.y = this.hill + this.camera.altitude + this.camera.height / 2;
}

Player.prototype.project = function () {
    this.car.center.x = this.camera.position.x;
    this.car.center.z = this.camera.position.z + carDistance;
    this.car.center.y = this.hill;
    this.car.project(this.car.center.z - this.camera.position.z);

    this.car.fileName = '';
    if (this.hillDirection > hillSense) {
        this.car.fileName = 'up-';
    } else if (this.hillDirection < -hillSense) {
        this.car.fileName = 'down-';
    }
    if (this.curveDirection < -curveSense) {
        if (this.steerLeft & this.speed != 0)
            this.car.fileName += 'hardleft-';
        else if (this.steerRight & this.speed != 0)
            this.car.fileName += 'straight-';
        else
            this.car.fileName += 'left-';
    } else if (this.curveDirection > curveSense) {
        if (this.steerLeft & this.speed != 0)
            this.car.fileName += 'straight-';
        else if (this.steerRight & this.speed != 0)
            this.car.fileName += 'hardright-';
        else
            this.car.fileName += 'right-';
    } else {
        if (this.steerLeft & this.speed != 0)
            this.car.fileName += 'left-';
        else if (this.steerRight & this.speed != 0)
            this.car.fileName += 'right-';
        else
            this.car.fileName += 'straight-';
    }
    if (this.decelerate) {
        this.car.fileName += 'brake-';
    }
    if (this.speed > speedSense) {
        this.car.fileName += Math.floor(Math.random() * 2);
    } else {
        this.car.fileName += '0';
    }
}