function SwitchModel(index, data) {
    this.id = index;
    this.connectedDoors = data.connectedDoors;
    this.doorPosition = data.doorPosition;
    this.originalPosition = data.originalPosition;
    this.radius = 2;
}