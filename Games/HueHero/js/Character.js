function Character(id) {
    this.element = document.getElementById(id);
    this.move = new Move(this.element);
    this.painter = new Painter(this.element);
}