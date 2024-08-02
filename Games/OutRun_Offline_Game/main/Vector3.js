function Vector3(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.xScreen = 0;
    this.yScreen = 0;
}

Vector3.prototype.project = function () {
    zDiff = this.z - Driver.camera.position.z;
    this.xScreen = Canvas.width / 2 + Driver.camera.gap * (this.x - Driver.camera.position.x) / zDiff;
    this.yScreen = Canvas.height / 2 + Driver.camera.gap * (Driver.camera.position.y - this.y) / zDiff;
}

Vector3.calculate = function (length, measure1, measure2) {
    return length * measure1 / measure2;
}