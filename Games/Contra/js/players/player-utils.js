var commons = commons || {};

commons.playerUtils = {

      /*--------------------------------
       * Get lifecyle Info
       *--------------------------------*/
       isLifecycleAlive : function(player){
         return ( (player.lifecyle.state == 1) ? true : false);
       },
       getLifecycleState: function(player){
         return player.lifecyle.state;
       },

       /*--------------------------------
       * Input / Movement Info
       *--------------------------------*/
       isMoving: function(player){
         if(this.isAirborne(player)) return true;
         if(player.body.vel.x > 0.5) return true;
         if(player.body.vel.x < 0.5) return true;
         return false;
       },
       isAnyInput: function(player){
         const input = player.input;
         return input.isAnyPressed();
       },
       isAirborne: function(player){
         return ( (player.body.jumping || player.body.falling) ? true : false);
       },
       getCurrentInput: function(player){
         return player.input;
       },

       /*--------------------------------
        * Get Gun Info
        *--------------------------------*/
       isGunShooting: function(player){
         const gun = player.gun;
         if(!gun) return false;
         return gun.isShooting;
       },
       getGunReloadPercent: function(player){
         const gun = player.gun;
         if(!gun) return false;
         return gun.reloadPerc;
       },

       /*--------------------------------
        * Player Center
        *--------------------------------*/
       getCenterPosition: function(player){
           const centerX = player.pos.x + (.5 * player.width);
           const centerY = player.pos.y + (.5 * player.height);
           return [centerX, centerY];
       },

       /*--------------------------------
        * Player Barrel Position
        *--------------------------------*/
       getBarrelPosition: function(player){

           const aiming = this.getAimDirection(player);
           const direction = player.flags.getFlag('direction') || 1;
           const center = this.getCenterPosition(player);

           switch (aiming) {

               //horizontal
               case 1 :
                   var x = center[0] + (direction * .5 * player.width);
                   var y = center[1];
                   var uX = direction;
                   var uY = 0;
                   return [x, y, uX, uY];
                   break;

               //up and angle
               case 2 :
                   var x = center[0] + (direction * .5 * player.width);
                   var y = player.pos.y;
                   var uX = direction;
                   var uY = -1;
                   return [x, y, uX, uY];
                   break;

               //up
               case 3 :
                   var x = center[0] - (.5 * game.constants.Bullet_diameter);
                   var y = player.pos.y - game.constants.Bullet_diameter;
                   var uX = 0;
                   var uY = -1;
                   return [x, y, uX, uY];
                   break;

               //down and angle
               case 4 :
                   var x = center[0] + (direction * (player.width + game.constants.Bullet_diameter));
                   var y = player.pos.y + player.height;
                   var uX = direction;
                   var uY = 1;
                   return [x, y, uX, uY];
                   break;

               //down
               case 5 :
                   var x = center[0] - (.5 * game.constants.Bullet_diameter);
                   var y = player.pos.y + player.height + game.constants.Bullet_diameter;
                   var uX = 0;
                   var uY = 1;
                   return [x, y, uX, uY];
                   break;

               default :
                   return [0, 0, 0, 0];
           }
       },


       /*--------------------------------
        * Player Look Direction
        * aiming    ->  1 = Horizontal
        *               2 = Up and Angle
        *               3 = Up
        *               4 = Down and Angle
        *               5 = Down
        *--------------------------------*/
       getAimDirection: function(player){

         const input = player.input;

         if((input.left || input.right) && input.up){
           return 2;
         }
         else if(input.up){
           return 3;
         }
         else if((input.left || input.right) && input.down){
           return 4;
         }
         else if(input.down){
           return 5;
         }
         else{
           return 1;
         }
       }
}
