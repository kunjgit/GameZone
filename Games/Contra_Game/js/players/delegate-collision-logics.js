
var commons = commons || {};

commons.collisions = {

    withPlatformDemo : function(that, response, other){

        if (!that.body.falling){
            return false;
        }

        // Shortest overlap would move the player upward
        // The velocity is reasonably fast enough to have penetrated to the overlap depth
        // Disable collision on the x axis
        if(response.overlapV.y > 0 && (~~that.body.vel.y >= ~~response.overlapV.y)){
            response.overlapV.x = 0;
            return true;
        }
        return false;
    },

    processedColliders : {},

    withBullet : function(player, response, other){

        if(other.pid === player.mpid) {
            return false;
        }
        if(this.processedColliders[other.bid]){
            return false;
        }
        this.processedColliders[other.bid] = 1;
        return true;
    },

    withBadguy : function(player, response, other){

        if(this.processedColliders[other.mpid]){
          return false;
        }
        this.processedColliders[other.mpid] = 1;
        return true;
    }
}
