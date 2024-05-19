var rb = rb || {};
rb.calc = {};

rb.calc.distance = {

    d: function (from, target) {
        var dx = from.pos.x - target.pos.x;
        var dy = from.pos.y - target.pos.y;
        return Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
    },
    x_point: function (from, target) {
        return from.pos.x - target.pos.x;
    },
    y_point: function (from, target) {
        return from.pos.y - target.pos.y;
    },

    angleBetween : function(from, target) {
        return Math.atan2( (from.pos.y - target.pos.y), (from.pos.x - from.pos.y));
    },
};

rb.calc.motion = {

    apply_vel : function(dt, vel, from){
        from = from || 0;

        return ( vel * dt ) + from;
    },

    apply_acc : function(dt, acc, velprime, from){
        from = from || 0;
        velprime = velprime || 0;

        return (  (.5 * acc * dt * dt) + (dt * velprime) + (from)   );
    },

    calc_jumpTime : function(g, jh) {

        return  Math.sqrt( (2 * jh) / g );
    },

    calc_jumpHeight : function(g, velJump) {

        return (velJump * velJump) / (2 * g);
    },
};

rb.calc.nbr = {

    isBetween : function(val, min, max){
        return (val < min) ? (false) : (val > max ? false : true);
    },
    clamp : function(val, min, max){
        return (val < min) ? (min) : (val > max ? max : val);
    },

    randomInt : function (min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
};