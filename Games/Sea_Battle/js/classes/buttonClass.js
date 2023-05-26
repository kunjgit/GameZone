// class for buttons - object oriented programming
var button = function (str, x, y, w = 170, h = 40) {
    // buttons constructor
    this.x = x;
    this.y = y;
    this.txt = str;
    this.height = h;
    this.width = w;
};
// buttons method
button.prototype.draw = function () {

   // fill(219, 9, 219, 200);  -> light pink
    fill(0, 210, 0, 200);
    rect(this.x, this.y, this.width, this.height, 10);
    fill(0, 0, 0);
    textSize(30);
    text(this.txt, this.x + 11, this.y + 30);
};
button.prototype.insideButton = function () {

    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
        this.lightUpButton();
        return 1;
    }
    return 0;

};
button.prototype.isPressed = function () {

    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height) {
        if (mouseIsPressed()) {
            return 1;
        }
        else {
            return 0;
        }
    }
    return 0;

};
button.prototype.lightUpButton = function () {

    fill(240, 218, 240, 100);
    rect(this.x, this.y, this.width, this.height, 10);
};
