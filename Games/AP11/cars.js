function Car(width, height, topSpeed, bot) {
    var carCanvas = document.createElement('canvas'),
        carContext = carCanvas.getContext('2d');

    //find a road to position the car
    var initialTileX, initialTileY;
    if (bot) {
        while (typeof this.x === 'undefined') {
            var tile, count = 0;
            while (!tile && count++ < 4) {
                switch (ap11.carSpawnDirection) {
                    case 0:
                        for (var i = firstTileX; i < lastTileX; i++) {
                            if (world.getTile(i, firstTileY - 1).type === 1) {
                                tile = world.getTile(i, firstTileY - 1);
                            }
                        }
                        break;
                    case 1:
                        for (var i = firstTileX; i < lastTileX && !tile; i++) {
                            if (world.getTile(i, lastTileY).type === 1) {
                                tile = world.getTile(i, lastTileY);
                            }
                        }
                        break;
                    case 2:
                        for (var i = firstTileY; i < lastTileY && !tile; i++) {
                            if (world.getTile(firstTileX - 1, i).type === 1) {
                                tile = world.getTile(firstTileX - 1, i);
                            }
                        }
                        break;
                    case 3:
                        for (var i = firstTileY; i < lastTileY && !tile; i++) {
                            if (world.getTile(lastTileX, i).type === 1) {
                                tile = world.getTile(lastTileX, i);
                            }
                        }
                }
                ap11.carSpawnDirection++;
                if (ap11.carSpawnDirection > 3) {
                    ap11.carSpawnDirection = 0;
                }
            }
            if (tile) {
                this.x = tile.x + tileSize / 2;
                this.y = tile.y + tileSize / 2;
            } else {
                this.x = horizontalTiles / 2 * tileSize;
                this.y = verticalTiles / 2 * tileSize;
            }
        }
    } else {
        initialTileX = horizontalTiles / 2;
        initialTileY = verticalTiles / 2;

        var tile;

        //find a road to place the car
        for (var i = 0; i < horizontalTiles / 2 - 1; i++) {
            tile = world.getTile(initialTileY + i, initialTileX);
            if (tile.type === 1) {
                this.x = tile.x + tileSize / 2;
                this.y = tile.y + tileSize / 2;
                break;
            }
            tile = world.getTile(initialTileY - i, initialTileX);
            if (tile.type === 1) {
                this.x = tile.x + tileSize / 2;
                this.y = tile.y + tileSize / 2;
                break;
            }
            tile = world.getTile(initialTileY, initialTileX + i);
            if (tile.type === 1) {
                this.x = tile.x + tileSize / 2;
                this.y = tile.y + tileSize / 2;
                break;
            }
            tile = world.getTile(initialTileY, initialTileX - i);
            if (tile.type === 1) {
                this.x = tile.x + tileSize / 2;
                this.y = tile.y + tileSize / 2;
                break;
            }
        }
    }


    this.width = width;
    this.height = height;
    this.speed = 0.0;

    this.rotation = 0.0; //in radians
    this.inertia = 0.0;
    this.rotationAngle = 0.017;
    this.acelaration = 0.3;
    this.deceleration = 0.05;
    this.brakeStrength = 0.3;
    this.topSpeed = topSpeed;
    this.bot = bot;
    this.firing = false;
    this.targetDistance = 750;
    this.life = 100;
    this.lastLife = this.life;

    this.explosionTick = 0;

    this.firstCollisionPointX = this.x;
    this.firstCollisionPointY = this.y - height / 4;
    this.secondCollisionPointX = this.x;
    this.secondCollisionPointY = this.y + height / 4;

    carCanvas.width = this.width;
    carCanvas.height = this.height;

    var carColors = [maxRandom(100), maxRandom(100), maxRandom(100)],
        carColor = 'rgb(' + carColors[0] + ',' + carColors[1] + ',' + carColors[2] + ')',
        windowColor = variateColor(50, 50, 50, 20);

    //car shape
    drawStroke(carContext, 6, 1, this.width - 12, 5, 'rgb(35,35,35)', 2);
    drawStroke(carContext, 1, 5, this.width - 2, this.height - 10, 'rgb(35,35,35)', 2);
    drawStroke(carContext, 6, this.height - 6, this.width - 12, 5, 'rgb(35,35,35)', 2);
    drawRect(carContext, 7, 2, this.width - 14, 4, carColor);
    drawRect(carContext, 2, 6, this.width - 4, this.height - 12, carColor);
    drawRect(carContext, 7, this.height - 6, this.width - 14, 4, carColor);

    //front window
    drawRect(carContext, 5, 30, this.width - 10, 5, windowColor);
    drawRect(carContext, 7.5, 35, this.width - 15, 5, windowColor);
    drawRect(carContext, 10, 40, this.width - 20, 5, windowColor);

    //roof
    drawRect(carContext, 10, 45, this.width - 20, 30, 'rgb(' + (carColors[0] + 5) + ',' + (carColors[1] + 5) + ',' + (carColors[2] + 5) + ')');

    //side windows
    drawRect(carContext, 5, 45, 2.5, 27.5, windowColor);
    drawRect(carContext, this.width - 7.5, 45, 2.5, 27.5, windowColor);

    //rear window
    drawRect(carContext, 10, 75, this.width - 20, 5, windowColor);
    drawRect(carContext, 7.5, 80, this.width - 15, 5, windowColor);

    //machine guns
    drawRect(carContext, 17, 10, 3, 15, windowColor);
    drawRect(carContext, 30, 10, 3, 15, windowColor);

    //draw noise
    for (var i = 0; i < this.width / 5; i++) {
        for (var j = 0; j < this.height / 5; j++) {
            drawRect(carContext, i * 5, j * 5, 5, 5, 'rgba(0,0,0,' + random() * 0.06 + ')');
        }
    }

    this.image = new Image();
    this.image.src = carCanvas.toDataURL();
};

Car.prototype.accelerate = function() {
    this.speed = this.speed > this.topSpeed ? this.topSpeed : this.speed + this.acelaration;
};

Car.prototype.decelerate = function() {
    if (this.speed > this.deceleration) {
        this.speed -= this.deceleration;
    } else if (this.speed < -this.deceleration) {
        this.speed += this.deceleration;
    } else {
        this.speed = 0;
    }
};

Car.prototype.brake = function() {
    this.speed = this.speed < -this.topSpeed ? -this.topSpeed : this.speed - this.brakeStrength;
};

Car.prototype.stop = function() {
    this.speed = this.speed > 0 ? this.speed - this.brakeStrength : 0;
};

Car.prototype.updatePosition = function() {

    if (ap11.car.life <= 0 || this.life <= 0) {
        this.firing = false;
        return;
    }

    var deltaX = this.speed * Math.sin(this.inertia),
        deltaY = this.speed * Math.cos(this.inertia);

    //debug
    // drawRect(context, this.x + (60 + 10 * this.speed) * Math.sin(this.rotation), this.y - (60 + 10 * this.speed) * Math.cos(this.rotation), 5, 5, 'rgb(0,255,0)')

    this.x += deltaX,
    this.y -= deltaY;

    //debug
    // drawRect(context, this.x + (60 + 10 * this.speed) * Math.sin(this.inertia), this.y - (60 + 10 * this.speed) * Math.cos(this.inertia), 5, 5, 'rgb(0,0,255)');

    if (this.bot) {
        this.rotation = calculateAngle(ap11.car.y - this.y, ap11.car.x - this.x) + Math.PI / 2;

        // var newAngle = calculateAngle(ap11.car.y - this.y, ap11.car.x - this.x) + Math.PI / 2;
        // if (newAngle > this.rotation + 0.5) {
        //     this.rotation += this.rotationAngle * 15;
        // } else if (newAngle < this.rotation - 0.5) {
        //     this.rotation -= this.rotationAngle * 15;
        // }
        if (this.rotation > Math.PI * 2) {
            this.rotation = this.rotation - Math.PI * 2;
        }
    } else {
        if (ap11.keyUp) {
            this.accelerate();
        } else {
            this.decelerate();
        }
        if (ap11.keyDown) {
            this.brake();
        }
        var rotationIncrement = 0;
        if (this.speed > 1 || this.speed < -1) {
            rotationIncrement = this.rotationIncrement / 4;
        } else if (this.speed > 1 || this.speed < -1) {
            rotationIncrement = this.rotationIncrement / 4;
        }

        if (ap11.keyLeft) {
            this.rotation -= this.rotationAngle * this.speed / 2; //TODO make it more realistic
            if (this.rotation < 0) {
                this.rotation = Math.PI * 2 + this.rotation;
                this.inertia = Math.PI * 2 + this.inertia;
            }
        }
        if (ap11.keyRight) {
            this.rotation += this.rotationAngle * this.speed / 2;
            if (this.rotation > Math.PI * 2) {
                this.rotation = this.rotation - Math.PI * 2;
                this.inertia = this.inertia - Math.PI * 2;
            }
        }
    }

    if (this.rotation > this.inertia) {
        this.inertia += (this.rotation - this.inertia) / 10;
    } else if (this.rotation < this.inertia) {
        this.inertia -= (this.inertia - this.rotation) / 10;
    }

    //fire trajectory
    var clear = true;
    for (var i = 0; clear; i += 30) {

        var ix = this.x + i * Math.sin(this.rotation),
            iy = this.y - i * Math.cos(this.rotation);

        //debug
        //drawRect(context, ix, iy, 5, 5, 'rgb(255,0,0)')

        //see if it interescts a building
        var tile = world.getTileByCoordinates(ix, iy);
        if (tile.type === 3) {
            if (this.bot && !this.firing) {
                this.firing = true;

                if (ix < firstTileX * tileSize || ix > lastTileX * tileSize ||
                    iy < firstTileY * tileSize || iy > lastTileY * tileSize) {
                    tile.type = 6;
                    tile.collision = false;
                    tile.explosionTick = 100;
                }
            }
            if (this.firing) {
                this.targetDistance = i;
                tile.life--;
            }
            if (this.bot) {
                this.decelerate();
            }
            clear = false;
            break;
        }

        //if nothing is intersected
        if (this.bot && i > 500) {
            if (this.firing) {
                this.firing = false;
            }
            this.accelerate();
            clear = false;
            break;
        }
        if (!this.bot && i > 800) {
            this.targetDistance = 800;
            clear = false;
            break;
        }

        //see if it intersects a car
        for (var j = ap11.cars.length - 1; j >= 0; j--) {
            if (ap11.cars[j] !== this && ap11.cars[j].life > 0 &&
                (calculateDistance(ix - ap11.cars[j].firstCollisionPointX, iy - ap11.cars[j].firstCollisionPointY) < ap11.cars[j].width ||
                    calculateDistance(ix - ap11.cars[j].secondCollisionPointX, iy - ap11.cars[j].secondCollisionPointY) < ap11.cars[j].width)) {
                if (this.bot && ap11.cars[j].bot) {
                    return;
                }
                if (this.bot && !this.firing) {
                    this.firing = true;
                }
                if (this.firing) {
                    this.targetDistance = i;
                    if (this.bot) {
                        ap11.cars[j].life -= 0.1;
                    } else {
                        ap11.cars[j].life -= 2;
                    }
                }
                if (this.bot) {
                    if (calculateDistance(this.x - ap11.car.x, this.y - ap11.car.y) < 500) {
                        this.stop();
                    }
                }

                clear = false;
                break;
            }
        }


    }

    this.firstCollisionPointX = this.x + this.width / 2 * Math.sin(this.rotation);
    this.firstCollisionPointY = this.y - this.width / 2 * Math.cos(this.rotation);
    this.secondCollisionPointX = this.x - this.width / 2 * Math.sin(this.rotation);
    this.secondCollisionPointY = this.y + this.width / 2 * Math.cos(this.rotation);

    //detect collisions with buildings
    var collisionPoints = [
            world.getTileByCoordinates(this.firstCollisionPointX + this.width / 2, this.firstCollisionPointY).collision,
            world.getTileByCoordinates(this.firstCollisionPointX - this.width / 2, this.firstCollisionPointY).collision,
            world.getTileByCoordinates(this.firstCollisionPointX, this.firstCollisionPointY + this.width / 2).collision,
            world.getTileByCoordinates(this.firstCollisionPointX, this.firstCollisionPointY - this.width / 2).collision,
            world.getTileByCoordinates(this.secondCollisionPointX + this.width / 2, this.secondCollisionPointY).collision,
            world.getTileByCoordinates(this.secondCollisionPointX - this.width / 2, this.secondCollisionPointY).collision,
            world.getTileByCoordinates(this.secondCollisionPointX, this.secondCollisionPointY + this.width / 2).collision,
            world.getTileByCoordinates(this.secondCollisionPointX, this.secondCollisionPointY - this.width / 2).collision
        ],
        numberOfCollisions = 0;

    for (var i = 3; i >= 0; i--) {
        if (collisionPoints[i]) {
            numberOfCollisions++;
        }
    }
    if (numberOfCollisions > 1) { //more than one collision, probably is in a building corner
        this.x -= deltaX;
        this.y += deltaY;
        this.inertia = this.rotation;
        this.speed = -this.speed / 2;
    } else {

        if (collisionPoints[0] || collisionPoints[5]) {
            this.rotation > Math.PI / 2 && this.rotation < 3 * Math.PI / 2 ? this.rotation += 0.1 : this.rotation -= 0.1;
            this.inertia = this.rotation;
        } else if (collisionPoints[1] || collisionPoints[4]) {
            this.rotation > Math.PI / 2 && this.rotation < 3 * Math.PI / 2 ? this.rotation -= 0.1 : this.rotation += 0.1;
            this.inertia = this.rotation;
        } else if (collisionPoints[2] || collisionPoints[7]) {
            this.rotation > Math.PI ? this.rotation += 0.1 : this.rotation -= 0.1;
            this.inertia = this.rotation;
        } else if (collisionPoints[3] || collisionPoints[6]) {
            this.rotation > Math.PI ? this.rotation -= 0.1 : this.rotation += 0.1;
            this.inertia = this.rotation;
        }

        if (collisionPoints[0] || collisionPoints[4]) {
            this.x -= ((collisionPoints[0] ? this.firstCollisionPointX : this.secondCollisionPointX) + this.width / 2) % tileSize + 1;
        } else if (collisionPoints[1] || collisionPoints[5]) {
            this.x += tileSize - ((collisionPoints[1] ? this.firstCollisionPointX : this.secondCollisionPointX) - this.width / 2) % tileSize + 1;
        } else if (collisionPoints[2] || collisionPoints[6]) {
            this.y -= ((collisionPoints[2] ? this.firstCollisionPointY : this.secondCollisionPointY) + this.width / 2) % tileSize + 1;
        } else if (collisionPoints[3] || collisionPoints[7]) {
            this.y += tileSize - ((collisionPoints[3] ? this.firstCollisionPointY : this.secondCollisionPointY) - this.width / 2) % tileSize + 1;
        }
    }

    //detect collisions with other cars
    for (var i = ap11.cars.length - 1; i >= 0; i--) {
        if (ap11.cars[i] !== this) {
            var distance = this.detectCollisionWithCar(ap11.cars[i]);
            if (distance < 0) {
                if (ap11.cars[i].x > this.x) {
                    ap11.cars[i].x -= distance;
                    this.x += distance;
                } else {
                    ap11.cars[i].x += distance;
                    this.x -= distance;
                }
                if (ap11.cars[i].y > this.y) {
                    ap11.cars[i].y -= +distance;
                    this.y += distance;
                } else {
                    ap11.cars[i].y += distance;
                    this.y -= distance;
                }
            }
        }
    }
};

Car.prototype.detectCollisionWithCar = function(withCar) {
    var distance = calculateDistance(
        this.firstCollisionPointX - withCar.firstCollisionPointX,
        this.firstCollisionPointY - withCar.firstCollisionPointY
    ) - this.width;
    if (distance < 0) {
        return distance;
    }
    distance = calculateDistance(
        this.firstCollisionPointX - withCar.secondCollisionPointX,
        this.firstCollisionPointY - withCar.secondCollisionPointY
    ) - this.width;
    if (distance < 0) {
        return distance;
    }
    distance = calculateDistance(
        this.secondCollisionPointX - withCar.firstCollisionPointX,
        this.secondCollisionPointY - withCar.firstCollisionPointY
    ) - this.width;
    if (distance < 0) {
        return distance;
    }
    distance = calculateDistance(
        this.secondCollisionPointX - withCar.secondCollisionPointX,
        this.secondCollisionPointY - withCar.secondCollisionPointY
    ) - this.width;
    if (distance < 0) {
        return distance;
    }
};

Car.prototype.draw = function(tick) {

    context.save();
    context.translate(this.x, this.y);
    context.rotate(this.rotation);

    if (this.life <= 0) {
        if (this.explosionTick === 0) {
            if (this.bot) {
                ap11.points += 500;
                ap11.numbersToDraw.push([this.x, this.y - this.width, 500, 0, true]);
            }
        }

        if (this.explosionTick >= 100) {
            for (var i = ap11.cars.length - 1; i >= 0; i--) {
                if (ap11.cars[i] === this) {
                    ap11.cars.splice(i, 1);
                    break;
                }
            }
        } else {
            for (var i = 0; i < this.width; i += 10) {
                for (var j = 0; j < this.height; j += 10) {
                    var delta1 = random() > 0.4 ? this.explosionTick / 5 : -this.explosionTick / 5,
                        delta2 = random() > 0.4 ? this.explosionTick / 5 : -this.explosionTick / 5;
                    drawRect(context,
                        i - this.width / 2 + delta1,
                        j - this.height / 2 + delta2,
                        10 - this.explosionTick / 10,
                        10 - this.explosionTick / 10,
                        'rgb(255,' + (this.explosionTick * 2) + ',0)');
                }
            }
            this.explosionTick++;
        }
    } else {
        context.drawImage(this.image, -this.width / 2, -this.height / 2);

        if (this.life !== this.lastLife) {
            if (tick % 5 === 0) {
                drawRect(context, -this.width / 2, -this.height / 2, this.width, this.height, 'rgba(255,0,0, 0.3)');
            }

            if (tick % 15 === 0) {
                if (typeof this.lastLifeValueShown === 'undefined') {
                    this.lastLifeValueShown = this.lastLife;
                }
                // console.log((this.bot ? this.lastLifeValueShown - this.life : (this.lastLifeValueShown - this.life) * -1))
                if (this.lastLifeValueShown - this.life > 0.5) {
                    ap11.numbersToDraw.push([this.x, this.y - this.width,
                        this.bot ? this.lastLifeValueShown - this.life : (this.lastLifeValueShown - this.life) * -1,
                        0, this.bot
                    ]);
                    this.lastLifeValueShown = this.life;
                }
            }

            this.lastLife = this.life;
        }

        tick = (tick % 5) * 10;

        //draw bullets
        if (this.firing) {
            drawRect(context, -8, -this.height / 2 - 10 - tick, 3, 20, 'rgb(255,140,0)');
            drawRect(context, 5, -this.height / 2 - 10 - tick, 3, 20, 'rgb(255,140,0)');
            for (var j = this.height; j < this.targetDistance - ap11.car.width / 2; j += 50) {
                drawRect(context, -8, -j - tick, 3, 20, 'rgb(255,140,0)');
                drawRect(context, 5, -j - tick, 3, 20, 'rgb(255,140,0)');
            }
            // drawRect(context, -8, -this.height / 2 + 10, 3, 15, 'rgb(178,34,34)');
            // drawRect(context, 5, -this.height / 2 + 10, 3, 15, 'rgb(178,34,34)');

            // if (this.bot) {
                // if(this.x < ap11.car.x) {
                //     ap11.car.x++;
                // } else {
                //     ap11.car.x--;
                // }
                // if(this.y < ap11.car.y) {
                //     ap11.car.y++;
                // } else {
                //     ap11.car.y--;
                // }
                //ap11.car.rotation+=random() > 0.5 ? 0.01 : -0.01;

                // ap11.car.life--;
            // }

        }

        // debug
        // context.beginPath();
        // context.fillStyle = 'rgb(255,0,0)'
        // context.arc(this.firstCollisionPointX, this.firstCollisionPointY, this.width / 2, 0, Math.PI * 2)
        // context.fill()
        // context.beginPath();
        // context.fillStyle = 'rgb(0,0,255)'
        // context.arc(this.secondCollisionPointX, this.secondCollisionPointY, this.width / 2, 0, Math.PI * 2)
        // context.fill()
    }
    context.restore();
};