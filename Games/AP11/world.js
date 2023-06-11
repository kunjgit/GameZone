function World() {
    this.hiddenCanvas = document.createElement('canvas');
    this.hiddenContext = this.hiddenCanvas.getContext('2d');

    this.hiddenCanvas.width = tileSize;
    this.hiddenCanvas.height = tileSize;
    this.hiddenContext.lineWidth = pixelSize;

    this.matrix = [];
    for (var i = verticalTiles - 1; i >= 0; i--) {
        this.matrix[i] = [];
        for (j = horizontalTiles - 1; j >= 0; j--) {
            this.matrix[i][j] = {
                x: i * tileSize,
                y: j * tileSize
            };
            if (i < 6 || i >= verticalTiles - 6 || j < 6 || j >= horizontalTiles - 6) {
                this.matrix[i][j].type = 2;
            }
        }
    }

    //river
    var riverVariation = Math.floor(verticalTiles / 3);
    var riverCurves = [
        [0, variateRandom(riverVariation, riverVariation)]
    ];
    for (var i = 1; i < horizontalTiles / 20; i++) {
        riverCurves.push([variateRandom(i * 20, 4), variateRandom(riverVariation, riverVariation)]);
    }
    riverCurves.push([horizontalTiles - 1, variateRandom(riverVariation, riverVariation)]);
    for (var i = 0; i < riverCurves.length - 1; i++) {
        this.connectPoints(riverCurves[i], riverCurves[i + 1], 2, 2);
    }
    // for (var i = 2; i < this.matrix.length; i++) {
    //     for (var j = 0; j < this.matrix[i].length; j++) {
    //         if(this.matrix[i][j] === 2) {
    //             this.matrix[i - 1][j - 1] = 2;
    //             this.matrix[i - 2][j - 2] = 2;
    //         }
    //     }
    // }

    //roads
    this.intersections = [];

    for (var i = 0; i < horizontalTiles / 10 - 1; i++) {
        this.intersections[i] = [];
        for (var j = 0; j < verticalTiles / 10 - 1; j++) {
            this.intersections[i][j] = [7 + variateRandom(i * 10, 4), 7 + variateRandom(j * 10, 4)];
        }

    }

    for (var i = 0; i < this.intersections.length; i++) {
        for (var j = 0; j < this.intersections[i].length; j++) {
            if (i < this.intersections.length - 1) {
                this.connectPoints(this.intersections[i][j], this.intersections[i + 1][j], 1, 5);
            }
            if (j < this.intersections[i].length - 1) {
                this.connectPoints(this.intersections[i][j], this.intersections[i][j + 1], 1, 5);
            }
        }
    }

    // buildings
    for (var b = 10000; b >= 0; b--) {
        var x = Math.round(random() * horizontalTiles),
            y = Math.round(random() * verticalTiles),
            size = 2 + Math.round(random() * 4),
            clear = true;
        for (var i = x; i < x + size && clear; i++) {
            for (var j = y; j < y + size && clear; j++) {
                if (i >= horizontalTiles || j >= verticalTiles || this.matrix[i][j].type === 1 || this.matrix[i][j].type === 2 || this.matrix[i][j].type === 3) {
                    clear = false;
                }
            }
        }
        if (clear) {
            var height = 0.1 + random() * 0.4;

            //building face
            var baseColor = maxRandom(100);
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, 'rgb(' + (baseColor + maxRandom(15)) + ',' + (baseColor + maxRandom(15)) + ',' + (baseColor + maxRandom(15)) + ')');
            var windowSize = 20 + maxRandom(20),
                verticalWindowSpace = 10 + maxRandom(20),
                horizontalWindowSpace = 10 + maxRandom(20);
            for (var i = horizontalWindowSpace; i < tileSize - windowSize; i += windowSize + horizontalWindowSpace) {
                for (var j = verticalWindowSpace; j < tileSize - windowSize; j += windowSize + verticalWindowSpace) {
                    drawRect(this.hiddenContext, i, j, windowSize, windowSize, variateColor(76, 96, 150, 70));
                }
            }
            this.drawNoise(0.2);

            var wallImage = new Image();
            wallImage.src = this.hiddenCanvas.toDataURL();

            //building roof
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, variateColor(70, 70, 70, 5));

            //add grid
            var divSize = pixelSize * 5 + pixelSize * 10 * random();
            for (var i = 0; i < tileSize; i += divSize) {
                for (var j = 0; j < tileSize; j += divSize) {
                    drawRect(this.hiddenContext, i + pixelSize, j + pixelSize, divSize - pixelSize, divSize - pixelSize, variateColor(75, 75, 75, 5));
                    drawRect(this.hiddenContext, i + pixelSize * 2, j + pixelSize * 2, divSize - pixelSize * 3, divSize - pixelSize * 3, variateColor(80, 80, 80, 5));
                }
            }
            this.drawNoise(0.1);

            var roofImage = new Image();
            roofImage.src = this.hiddenCanvas.toDataURL();

            for (var i = x; i < x + size; i++) {
                for (var j = y; j < y + size; j++) {
                    this.matrix[i][j].type = 3;
                    this.matrix[i][j].height = height;
                    this.matrix[i][j].defaultHeight = height;
                    this.matrix[i][j].wallImage = wallImage;
                    this.matrix[i][j].roofImage = roofImage;
                    this.matrix[i][j].life = 1;
                    this.matrix[i][j].lastLife = this.matrix[i][j].life;
                }
            }
        }
    }


    //define collision tile
    for (var i = horizontalTiles - 1; i >= 0; i--) {
        for (var j = verticalTiles - 1; j >= 0; j--) {
            if (this.matrix[i][j].type === 2 || this.matrix[i][j].type === 3) {
                this.matrix[i][j].collision = true;
            }
        }
    }
}

World.prototype.createTile = function(x, y) {
    //draw tile details
    switch (this.matrix[x][y].type) {
        case 4: //debugging
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, 'rgb(150,0,0)');
            break;
        case 3: //building dirt
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, 'rgb(50,30,0)');
            break;
        case 5: //walk
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, variateColor(80, 80, 80, 8));

            var divSize = tileSize / 5;
            for (var i = 0; i < tileSize; i += divSize) {
                for (var j = 0; j < tileSize; j += divSize) {
                    drawStroke(this.hiddenContext, i + pixelSize / 2, j + pixelSize / 2, i + divSize, j + divSize, variateColor(86, 86, 86, 8));
                }
            }
            break;
        case 2: //water
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, variateColor(65, 105, 225, 4));
            if (x > 0 && this.matrix[x - 1][y].type !== 2) {
                drawRect(this.hiddenContext, 0, 0, pixelSize, tileSize, 'rgb(75,75,75)');
            }
            if (x < horizontalTiles - 1 && this.matrix[x + 1][y].type !== 2) {
                drawRect(this.hiddenContext, tileSize - pixelSize, 0, pixelSize, tileSize, 'rgb(75,75,75)');
            }
            if (y > 0 && this.matrix[x][y - 1].type !== 2) {
                drawRect(this.hiddenContext, 0, 0, tileSize, pixelSize, 'rgb(75,75,75)');
            }
            if (y < verticalTiles - 1 && this.matrix[x][y + 1].type !== 2) {
                drawRect(this.hiddenContext, 0, tileSize - pixelSize, tileSize, pixelSize, 'rgb(75,75,75)');
            }
            break;
        case 1: //road
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, variateColor(64, 64, 64, 8));
            if (this.matrix[x - 1][y].type !== 1) {
                drawRect(this.hiddenContext, 0, 0, pixelSize, tileSize, 'rgb(100,100,100)');
            }
            if (this.matrix[x + 1][y].type !== 1) {
                drawRect(this.hiddenContext, tileSize - pixelSize, 0, pixelSize, tileSize, 'rgb(100,100,100)');
            }
            if (this.matrix[x][y - 1].type !== 1) {
                drawRect(this.hiddenContext, 0, 0, tileSize, pixelSize, 'rgb(100,100,100)');
            }
            if (this.matrix[x][y + 1].type !== 1) {
                drawRect(this.hiddenContext, 0, tileSize - pixelSize, tileSize, pixelSize, 'rgb(100,100,100)');
            }

            if (this.matrix[x - 1][y].type === 1 && this.matrix[x + 1][y].type === 1) {
                drawRect(this.hiddenContext, 0 + pixelSize * 5, tileSize / 2 - pixelSize / 2, pixelSize * 5, pixelSize, 'rgb(90,90,90)');
            }
            if (this.matrix[x][y - 1].type === 1 && this.matrix[x][y + 1].type === 1) {
                drawRect(this.hiddenContext, 0 + tileSize / 2 - pixelSize / 2, pixelSize * 5, pixelSize, pixelSize * 5, 'rgb(90,90,90)');
            }
            break;
        default: //grass
            drawRect(this.hiddenContext, 0, 0, tileSize, tileSize, variateColor(0, 100, 0, 8));
    }

    this.drawNoise(0.1);

    //store image
    this.matrix[x][y].image = new Image();
    this.matrix[x][y].image.src = this.hiddenCanvas.toDataURL();
};

World.prototype.connectPoints = function(startPoint, endPoint, type, lateral) {
    var middlePointX = startPoint[0],
        middlePointY = endPoint[1];
    if (endPoint[0] > startPoint[0]) {
        for (var i = startPoint[0]; i <= endPoint[0]; i++) {
            if (!this.matrix[i][startPoint[1] - 1].type) {
                this.matrix[i][startPoint[1] - 1].type = lateral;
            }
            this.matrix[i][startPoint[1]].type = type;
            if (!this.matrix[i][startPoint[1] + 1].type) {
                this.matrix[i][startPoint[1] + 1].type = lateral;
            }
        }
    } else {
        for (var i = endPoint[0]; i <= startPoint[0]; i++) {
            if (!this.matrix[i][startPoint[1] - 1].type) {
                this.matrix[i][startPoint[1] - 1].type = lateral;
            }
            this.matrix[i][startPoint[1]].type = type;
            if (!this.matrix[i][startPoint[1] + 1].type) {
                this.matrix[i][startPoint[1] + 1].type = lateral;
            }
        }
    }
    if (endPoint[1] > startPoint[1]) {
        for (var i = startPoint[1]; i < endPoint[1]; i++) {
            if (!this.matrix[endPoint[0] - 1][i].type) {
                this.matrix[endPoint[0] - 1][i].type = lateral;
            }
            this.matrix[endPoint[0]][i].type = type;
            if (endPoint[0] < horizontalTiles - 1 && !this.matrix[endPoint[0] + 1][i].type) {
                this.matrix[endPoint[0] + 1][i].type = lateral;
            }
        }
    } else {
        for (var i = endPoint[1]; i < startPoint[1]; i++) {
            if (!this.matrix[endPoint[0] - 1][i].type) {
                this.matrix[endPoint[0] - 1][i].type = lateral;
            }
            this.matrix[endPoint[0]][i].type = type;
            if (endPoint[0] < horizontalTiles - 1 && !this.matrix[endPoint[0] + 1][i].type) {
                this.matrix[endPoint[0] + 1][i].type = lateral;
            }
        }
    }
};

World.prototype.drawNoise = function(intensity) {
    for (var i = 0; i < tileSize / pixelSize; i++) {
        for (var j = 0; j < tileSize / pixelSize; j++) {
            drawRect(this.hiddenContext, i * pixelSize, j * pixelSize, pixelSize, pixelSize, 'rgba(0,0,0,' + random() * intensity + ')');
        }
    }
};

World.prototype.getTile = function(x, y) {
    return this.matrix[x][y];
};

World.prototype.getTileByCoordinates = function(x, y) {
    return this.getTile(Math.floor(x / tileSize), Math.floor(y / tileSize));
};