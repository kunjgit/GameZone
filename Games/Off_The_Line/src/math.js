// From book: Real Time Collision Detection - Christer Ericson
function signed2DTriArea(ax, ay, bx, by, cx, cy)
{
    return (ax - cx)*(by - cy) - (ay - cy)*(bx - cx);
}

// From book: Real Time Collision Detection - Christer Ericson
function getLineIntersectionInfo(ax, ay, bx, by, cx, cy, dx, dy)
{
    let info = {intersect:false};

    let a1 = signed2DTriArea(ax, ay, bx, by, dx, dy);
    let a2 = signed2DTriArea(ax, ay, bx, by, cx, cy);
    if (a1*a2 < 0.0)
    {
        let a3 = signed2DTriArea(cx, cy, dx, dy, ax, ay);
        let a4 = a3 + a2 - a1;
        if (a3*a4 < 0.0)
        {
            info.time = a3 / (a3 - a4);
            info.x = ax + info.time*(bx - ax);
            info.y = ay + info.time*(by - ay);
            info.intersect = true;
        }
    }

    return info;
}

// From book: Real Time Collision Detection - Christer Ericson
function sqDistanceToLine(ax, ay, bx, by, cx, cy)
{
    let ab = {x:bx - ax, y:by - ay};
    let ac = {x:cx - ax, y:cy - ay};
    let bc = {x:cx - bx, y:cy - by};

    // Handle cases where c projects outside of ab
    let e = dot(ac, ab);
    if (e <= 0.0)
    {
        return dot(ac, ac);
    }

    let f = dot(ab, ab);
    if (e >= f)
    {
        return dot(bc, bc);
    }

    // Handle cases where c projects onto ab
    return dot(ac, ac) - e * e / f;
}

function dot(v1, v2)
{
    return v1.x*v2.x + v1.y*v2.y;
}