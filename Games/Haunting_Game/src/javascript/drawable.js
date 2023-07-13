
class Drawable {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.fillStyle = '#000000';
        this.strokeStyle = '#000000';
    }

    // A method used to draw the drawable as a rect.
    drawRect(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.rect(this.x, this.y, this.w, this.h);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    // A method used to draw the drawable as an image.
    drawImage(ctx, image) {
        ctx.beginPath();
        ctx.drawImage(image, this.x, this.y, this.w, this.h);
        ctx.closePath();
    }
}