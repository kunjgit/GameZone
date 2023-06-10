class L14 extends Level
{
    addPoints()
    {
        this.linePoints.push([]);
        this.normals.push([]);
        let radius = 70;
        let numPoints = 45;
        let angleStep = (360 / numPoints) * Math.PI/180;
        for (let i = 0; i < numPoints; i++)
        {
            let angle = i * angleStep;
            let x = Math.cos(angle) * radius;
            let y = Math.sin(angle) * radius;
            this.linePoints[0].push({x:x, y:y});
        }

        this.linePoints.push([]);
        this.linePoints[1].push({x:-300, y:50});
        this.linePoints[1].push({x:-300, y:-50});
        this.normals.push([]);
        this.normals[1].push({x:1, y:0});
        this.normals[1].push({x:1, y:0});

        this.linePoints.push([]);
        this.linePoints[2].push({x:215, y:-135});
        this.linePoints[2].push({x:135, y:-215});
        this.normals.push([]);
        this.normals[2].push({x:-0.707, y:0.707});
        this.normals[2].push({x:-0.707, y:0.707});

        this.linePoints.push([]);
        this.linePoints[3].push({x:175, y:125});
        this.linePoints[3].push({x:125, y:175});
        this.normals.push([]);
        this.normals[3].push({x:-0.707, y:-0.707});
        this.normals[3].push({x:-0.707, y:-0.707});

        this.name = "ALIENS";
    }

    addItems()
    {
        aw.addEntity(new Coin(-112, 0));
        aw.addEntity(new Coin(-162, 0));
        aw.addEntity(new Coin(-212, 0));
        aw.addEntity(new Coin(-262, 0));

        aw.addEntity(new Coin(80, -80));
        aw.addEntity(new Coin(110, -110));
        aw.addEntity(new Coin(140, -140));

        aw.addEntity(new Coin(85, 85));
        aw.addEntity(new Coin(120, 120));

        aw.addEntity(new Wall(-188, 150, 75, 90, 0, 0, -300, 0.5, 0.5));
        aw.addEntity(new Wall(0, 205, 75, -45, 0, 215, -215, 0.5, 0.5));
    }
}