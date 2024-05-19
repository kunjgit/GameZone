var rb = rb || {};

rb.interpolation = {

    simple_vel : function(dt, entity){

        return {x : (entity.vel.x * dt), y : (entity.vel.y * dt) };
    }
}
