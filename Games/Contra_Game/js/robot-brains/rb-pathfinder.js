var rb = rb || {};

rb.paths = {};

/*-----------------------------------
 * Path Graph
 *
 * Input Options -
 *    standables -> list of items we can stand on (platforms)
 *    g          -> gravity applied to users of the path
 *    jumpVel    -> jump velocity available to users of the path
 *    xVel       -> max left-right velocity available to users of the path
 *
 * Surfaces - nodes in path graph which represent what users of the path can stand on
 *    id
 *    left, right, top
 *    connections -> Connection[]
 *
 * Connection - represents a possible surface to surface traversal
 *    toId,
 *    fromX, fromy, toX, toY,
 *    command (jump-left | jump-right | jump-up)
 *
 * ----------------------------------*/
rb.paths.PathGraph = function(options) {

    this.options = options || {};

    this.surfaces = {};
    this.jumpHeight   = rb.calc.motion.calc_jumpHeight(options.g, options.jumpVel);
    this.jumpDt       = rb.calc.motion.calc_jumpTime(options.g, this.jumpHeight);
    this.jumpW        = rb.calc.motion.apply_vel(this.jumpDt * 2, options.xVel);

    this.buildGraph = function (options) {

        this.options = options || this.options;

        this.options.standables.forEach(standable => {
            this.pushSurface(standable.GUID, standable.left, standable.right, standable.top);
        });
    };

    this.pushSurface = function (guid, left, right, top) {

        var newSurface = {guid: guid, left: left, right: right, top: top, connections: []};

        for(var surfaceKey in this.surfaces){
            var s = this.surfaces[surfaceKey];
            this.addConnections(newSurface, s);
        }
        this.surfaces[guid] = newSurface;
    };
    this.addConnections = function (sA, sB) {

        //from sA -> sB
        var dY = sA.top - sB.top;
        var dX = this.surfaceDistX(sA, sB);

        if (dY > this.jumpHeight) return;
        if (dY < 0) return;


        if(rb.calc.nbr.isBetween(sA.left, sB.left, sB.right)){
            sA.connections.push(
                {toSurface : sB.guid, fromX : sA.left, fromY : sA.top, toX : sA.left, toY : sB.top, command : "jump"}
            );
        }
        else if(rb.calc.nbr.isBetween(sA.right, sB.left, sB.right)){
            sA.connections.push(
                {toSurface : sB.guid, fromX : sA.right, fromY : sA.top, toX : sA.right, toY : sB.top, command : "jump"}
            );
        }
        else if (rb.calc.nbr.isBetween(dX, -this.jumpW, -1)){

            sA.connections.push(
                {toSurface : sB.guid, fromX : sA.left, fromY : sA.top, toX : sB.right, toY : sB.top, command : "jump"}
            );
        }
        else if(rb.calc.nbr.isBetween(dX, 1, this.jumpW)){

            sA.connections.push(
                {toId : sB.guid, fromX : sA.right, fromY : sA.top, toX : sB.left, toY : sB.top, command : "jump-right"}
            );
        }
    };
    this.surfaceDistX = function (sFrom, sTo) {

        if (sFrom.left > sTo.right){
            return -1 * (sFrom.left - sTo.right);
        }

        if (sFrom.right < sTo.right){
            return sTo.left - sFrom.right;
        }
        return 0;
    };
}

rb.Pathfinder = function(entity, graph){


    this.entity = entity;
    this.graph = graph;
    this.target = {};

    this.dX = 0;
    this.dY = 0;

    this.bestPath = [];

    this.setTarget = function(target){
        this.target = target;
    }

    this.updateIt = function(){

        this.dX = rb.calc.distance.x_point(this.entity, this.target);
        this.dY = rb.calc.distance.x_point(this.entity, this.target);

    }
};
