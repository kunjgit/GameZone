class L17 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        let radius = 300;
        let numPoints = 90;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints / 4; i++)
        {
            let angle = Math.PI*1.745 - (i * angleStep);
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y + 150});
        }

        this.linePoints[0].push({x:-50, y:150});
        this.linePoints[0].push({x:50, y:150});

        this.name = "SHELL";
    }

    addItems()
    {
        let xStart = -60;
        let yStart = 95;
        let stepSize = 50;
        let xStep = Math.cos(235 * Math.PI/180) * stepSize;
        let yStep = Math.sin(235 * Math.PI/180) * stepSize;
        for (let i = 0; i < 4; i++)
        {
            aw.addEntity(new Coin(-xStart - xStep*i, yStart + yStep*i));
            aw.addEntity(new Coin(xStart + xStep*i, yStart + yStep*i));
        }

        xStart = -17;
        yStart = 85;
        stepSize = 50;
        xStep = Math.cos(255 * Math.PI/180) * stepSize;
        yStep = Math.sin(255 * Math.PI/180) * stepSize;
        for (let i = 0; i < 4; i++)
        {
            aw.addEntity(new Coin(-xStart - xStep*i, yStart + yStep*i));
            aw.addEntity(new Coin(xStart + xStep*i, yStart + yStep*i));
        }

        aw.addEntity(new Wall(0, 0, 150, 90));
        aw.addEntity(new Wall(75, 20, 150, -60));
        aw.addEntity(new Wall(-75, 20, 150, 60));
    }
}