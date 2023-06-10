class L09 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        let radius = 150;
        let numPoints = 90;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = Math.PI*2 - (i * angleStep);
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y});
        }

        this.linePoints.push([]);
        radius = 100;
        numPoints = 45;
        angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = i * angleStep;
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[1].push({x:x, y:y});
        }

        this.name = "DONUT";
    }

    addItems()
    {
        aw.addEntity(new Coin(0, 115));
        aw.addEntity(new Coin(0, 135));

        aw.addEntity(new Coin(0, -115));
        aw.addEntity(new Coin(0, -135));

        aw.addEntity(new Coin(115, 0));
        aw.addEntity(new Coin(135, 0));

        aw.addEntity(new Coin(-115, 0));
        aw.addEntity(new Coin(-135, 0));

        aw.addEntity(new Wall(81, 81, 140, -45));
        aw.addEntity(new Wall(-81, 81, 140, 45));
        aw.addEntity(new Wall(81, -81, 140, 45));
        aw.addEntity(new Wall(-81, -81, 140, -45));
    }
}