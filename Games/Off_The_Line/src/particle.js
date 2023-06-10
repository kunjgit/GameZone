var deathParticles = [];

function particleUpdate(deltaTime)
{
    deathParticles.forEach((particle, idx) =>
    {
        let lifePct = particle.timeLeft / 0.5;
        let lifePctSmoothed = 1.0 - (lifePct*lifePct*lifePct);
        let x = particle.x + Math.cos(particle.moveAngle)*particle.maxRadius*lifePctSmoothed;
        let y = particle.y + Math.sin(particle.moveAngle)*particle.maxRadius*lifePctSmoothed;
        let angle = particle.angle + Math.PI*1.0*lifePctSmoothed;
        if (idx % 2 == 0)
        {
            angle = -angle;
        }

        aw.ctx.globalAlpha = lifePct < 0.25 ? lifePct / 0.25 : 1.0;
        aw.ctx.save();
        aw.ctx.translate(x, y);
        aw.ctx.rotate(angle);
        let lineWidthSave = aw.ctx.lineWidth;
        aw.ctx.lineWidth = 4;
        aw.ctx.strokeStyle = "#08F";
        aw.ctx.shadowColor = "#08F";
        aw.ctx.beginPath();
        aw.ctx.moveTo(-6.0, 0.0);
        aw.ctx.lineTo(6.0, 0.0);
        aw.ctx.stroke();
        aw.ctx.restore();
        aw.ctx.lineWidth = lineWidthSave;
        aw.ctx.globalAlpha = 1.0;

        particle.timeLeft -= deltaTime;
        if (particle.timeLeft <= 0.0)
        {
            particle._remove = true;
        }
    });

    deathParticles = deathParticles.filter(particle => particle._remove !== true);
}

function addDeathParticle(x, y)
{
    for (let i = 0; i < 10; i++)
    {
        deathParticles.push({x:x, y:y, timeLeft:0.5, _remove:false, angle:Math.random()*Math.PI*2, moveAngle:(Math.random()*360)*Math.PI/180, maxRadius:15 + Math.random()*40});
    }
}