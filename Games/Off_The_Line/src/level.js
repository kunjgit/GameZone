class Level
{
    constructor()
    {
        this.linePoints = [];
        this.segLengths = [];
        this.totalDistance = [];
        this.normals = [];
        this.levelTime = 7.0;
        this.timer = this.levelTime;

        this.addPoints();
        this.createSegments();
        this.addItems();
    }

    addPoints()
    {
    }

    createSegments()
    {
        for (let group = 0; group < this.linePoints.length; group++)
        {
            this.totalDistance.push(0);
            this.segLengths.push([]);
            for (let i = 0; i < this.linePoints[group].length - 1; i++)
            {
                let xDist = this.linePoints[group][i + 1].x - this.linePoints[group][i].x;
                let yDist = this.linePoints[group][i + 1].y - this.linePoints[group][i].y;
                let segDist = Math.sqrt((xDist*xDist) + (yDist*yDist));

                this.totalDistance[group] += segDist;
                this.segLengths[group].push(segDist);
            }

            let xDist = this.linePoints[group][0].x - this.linePoints[group][this.linePoints[group].length - 1].x;
            let yDist = this.linePoints[group][0].y - this.linePoints[group][this.linePoints[group].length - 1].y;
            let segDist = Math.sqrt((xDist*xDist) + (yDist*yDist));

            this.totalDistance[group] += segDist;
            this.segLengths[group].push(segDist);
        }
    }

    addItems()
    {
    }

    update(deltaTime)
    {
        if (difficultyMode == 2 && !this.isComplete() && !player.isDead)
        {
            this.timer = Math.max(this.timer - deltaTime, 0.0);
            if (this.timer <= 0.0)
            {
                addDeathParticle(player.x, player.y);
                player.hit();
            }
        }
    }

    render()
    {
        aw.ctx.lineWidth = 2;
        aw.ctx.strokeStyle = "#FFF";
        aw.ctx.shadowColor = "#FFF";
        for (let group = 0; group < this.linePoints.length; group++)
        {
            aw.ctx.beginPath();
            aw.ctx.moveTo(this.linePoints[group][0].x, this.linePoints[group][0].y);
            for (let i = 1; i < this.linePoints[group].length; i++)
            {
                aw.ctx.lineTo(this.linePoints[group][i].x, this.linePoints[group][i].y);
            }
            aw.ctx.lineTo(this.linePoints[group][0].x, this.linePoints[group][0].y);
            aw.ctx.stroke();
        }
    }

    getStartPos()
    {
        return this.linePoints[0][0];
    }

    getPosInfo(group, distance)
    {
        distance = distance % this.totalDistance[group];

        let curTotalDistance = 0;
        for (let i = 0; i < this.segLengths[group].length; i++)
        {
            let nextTotalDistance = curTotalDistance + this.segLengths[group][i];
            if (distance >= curTotalDistance && distance < nextTotalDistance)
            {
                let ratio = (distance - curTotalDistance) / this.segLengths[group][i];
                let p1 = i;
                let p2 = (i + 1) % this.linePoints[group].length;
                let xDir = this.linePoints[group][p2].x - this.linePoints[group][p1].x;
                let yDir = this.linePoints[group][p2].y - this.linePoints[group][p1].y;
                let xInterp = this.linePoints[group][p1].x + xDir*ratio;
                let yInterp = this.linePoints[group][p1].y + yDir*ratio;

                if (this.normals[group] !== undefined && this.normals[group][i] !== undefined)
                {
                    return {x:xInterp, y:yInterp, nx:this.normals[group][i].x, ny:this.normals[group][i].y, xDir:xDir, yDir:yDir};
                }
                else
                {
                    let xDir = (this.linePoints[group][p2].x - this.linePoints[group][p1].x) / this.segLengths[group][i];
                    let yDir = (this.linePoints[group][p2].y - this.linePoints[group][p1].y) / this.segLengths[group][i];
                    return {x:xInterp, y:yInterp, nx:yDir, ny:-xDir, xDir:xDir, yDir:yDir};
                }
            }

            curTotalDistance = nextTotalDistance;
        }

        return {x:this.linePoints[0][0].x, y:this.linePoints[0][0].y};
    }

    getIntersectionInfo(x1, y1, x2, y2)
    {
        for (let group = 0; group < this.segLengths.length; group++)
        {
            let curTotalDistance = 0;
            for (let i = 0; i < this.segLengths[group].length; i++)
            {
                let p1 = i;
                let p2 = (i + 1) % this.linePoints[group].length;

                let lineIntersectInfo = getLineIntersectionInfo(this.linePoints[group][p1].x, this.linePoints[group][p1].y, this.linePoints[group][p2].x, this.linePoints[group][p2].y, x1, y1, x2, y2);
                if (lineIntersectInfo.intersect)
                {
                    lineIntersectInfo.distance = curTotalDistance + this.segLengths[group][i]*lineIntersectInfo.time;
                    lineIntersectInfo.group = group;
                    return lineIntersectInfo;
                }

                curTotalDistance += this.segLengths[group][i];
            }
        }

        return {intersect:false};
    }

    isComplete()
    {
        let isComplete = true;
        aw.entities.forEach(entity =>
        {
            if (entity instanceof Coin)
            {
                if (entity.active)
                {
                    isComplete = false;
                }
            }
        });

        return isComplete;
    }
}