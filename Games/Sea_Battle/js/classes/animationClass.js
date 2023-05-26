////////////////////////////// ANIMATION //////////////////////////////////////////////////////////////
class animation {

    constructor() {

        this.submarineX1 = 1300;
        this.submarineY1 = 230;
        this.submarineX2 = -230;
        this.submarineY2 = 140;
        this.fishX1 = 0;
        this.fishX2 = -500;
        this.fishY = 0;
    }
    drawPebbles(x, y) {

        for (var i = 0; i < 450; i++) {
            var randomX = x + random(0, 1300);
            var randomY = y + random(670, 750);
            fill(random(0, 300), random(0, 200), random(0, 100));
            ellipse(randomX, randomY, 15, 10);
        }

    }
    drawFish(centerX, centerY, r, g, b) {

        var bodyLength = 72;
        var bodyHeight = 43;

        //  noStroke();
        fill(r, g, b);
        // body
        ellipse(centerX, centerY, bodyLength, bodyHeight);
        // tail
        fill(r, g, b);
        var tailWidth = bodyLength / 4;
        var tailHeight = bodyHeight / 2;
        triangle(centerX - bodyLength / 2, centerY,
            centerX - bodyLength / 2 - tailWidth, centerY - tailHeight,
            centerX - bodyLength / 2 - tailWidth, centerY + tailHeight);
        // eye
        fill(33, 33, 33);
        ellipse(centerX + bodyLength / 4, centerY, bodyHeight / 5, bodyHeight / 5);



    }
    submarineGlass(submarine_X, submarine_Y) {

        fill(1, 36, 43);
        ellipse(submarine_X + 190, submarine_Y + 37, 45, 45);
        fill(183, 226, 235);
        ellipse(submarine_X + 190, submarine_Y + 37, 35, 35);
    }
    drawFishGroup(x, y) {

        this.drawFish(x + 100, y + 100, 100, 167, 100);
        this.drawFish(x + 303, y + 100, 322, 144, 253);
        this.drawFish(x + 164, y + 229, 292, 243, 112);
        this.drawFish(x + 264, y + 303, 155, 118, 253);
        this.drawFish(x + 331, y + 197, 155, 243, 146);
        this.drawFish(x + 65, y + 294, 310, 20, 290);

    }
    drawSubmarine(submarine_X, submarine_Y) {

        fill(209, 4, 4);
        ellipse(submarine_X + 196, submarine_Y + 36, 105, 70);
        ellipse(submarine_X + 2, submarine_Y + 36, 105, 70);
        fill(224, 3, 3);
        rect(submarine_X + 1, submarine_Y + 1, 200, 70);

        fill(163, 0, 38);
        rect(submarine_X + 93, submarine_Y + -42, 40, 45);
        fill(163, 0, 38);
        rect(submarine_X + 93, submarine_Y + 71, 40, 14);

        this.submarineGlass(submarine_X, submarine_Y);
        this.submarineGlass(submarine_X + -82, submarine_Y + 1);
        this.submarineGlass(submarine_X + -164, submarine_Y + 1);
    }

    showMessage(msg){

        background(255, 255, 255, 60);
        fill(237, 34, 93);
        strokeWeight(10);
        rect(400, 150, 400, 150, 300);
        fill(255, 255, 255);
        textFont('Helvetica');
        textSize(40);
        text(msg, 440, 210, 400, 150);
        strokeWeight(1);
    }

    animationPlay() {


        background(0, 2, 105);
        this.submarineX1 = this.submarineX1 - 1.5;
        this.submarineX2 = this.submarineX2 + 1.5;
        this.fishX1 = this.fishX1 + 2.5;
        this.fishX2 = this.fishX2 + 2.5;

        this.drawFishGroup(this.fishX1, this.fishY);
        this.drawFishGroup(this.fishX2, this.fishY);


        if (this.submarineX1 < -100) {

            this.submarineX1 = 1300;
        }
        if (this.submarineX2 > 1300) {

            this.submarineX2 = -200;
        }

        if (this.fishX1 > 1300) {
            this.fishX1 = -300;
        }
        if (this.fishX2 > 1300) {
            this.fishX2 = -300;
        }

        this.drawSubmarine(this.submarineX1, this.submarineY1);
        this.drawSubmarine(this.submarineX2 , this.submarineY2);

      //  this.drawPebbles(4, -200);
    }
}

