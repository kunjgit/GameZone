/* eslint-disable no-underscore-dangle */
class Component {
  constructor(context, posX, posY, width, height, color) {
    this.c = context;
    this.width = width;
    this.height = height;
    this.posX = posX;
    this.posY = posY;
    this.color = color;
  }

  draw() {
    this.c.fillStyle = this.color;
    this.c.fillRect(this.posX, this.posY, this.width, this.height);
  }

  _leftCompHb() {
    return this.posX;
  }

  _rightCompHb() {
    return this.posX + this.width;
  }

  // talvez nao precise e eu nao tenho certeza se esta certo
  _topCompHb() {
    return this.posY;
  }

  // talvez nao precise e eu nao tenho certeza se esta certo
  _botCompHb() {
    return this.posY + this.height;
  }
}
