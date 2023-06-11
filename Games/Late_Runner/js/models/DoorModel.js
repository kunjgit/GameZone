function DoorModel(data) {
    this.id = -1;
    this.originalState = this.state = data.state;
    this.originalPosition = data.originalPosition;
}