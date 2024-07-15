function Camera(width, height, altitude, fov) {
    this.width = width;
    this.height = height;
    this.altitude = altitude;
    this.fov = fov;
    this.gap = this.width / (2 * Math.tan(this.fov * Math.PI / 360));
    this.rotation = 0;
    this.position = new Vector3(-1.5 * (laneWidth + lineWidth), this.altitude + this.height / 2, 0);
}