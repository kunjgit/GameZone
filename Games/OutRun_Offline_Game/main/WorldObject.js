function WorldObject(center, fileName) {
    this.center = center;
    this.fileName = fileName;
    this.relHeight = 0;
    this.relWidth = 0;
}

WorldObject.prototype.project = function (measure2) {
    this.center.project();
    this.relWidth = Vector3.calculate(dimensions[Outrun.gameWorld.route][this.fileName].width, Driver.camera.gap, measure2);
    this.relHeight = Vector3.calculate(dimensions[Outrun.gameWorld.route][this.fileName].height, Driver.camera.gap, measure2);
}