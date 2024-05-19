
function Gun(player, options){

    /*--------------------------------
    * Input to Track
    *--------------------------------*/
    options = options || {};
    this.player = player;
    this.isShooting = false;
    this.dtLastFire = 0;
    this.reloadTime = options.reloadTime || game.constants.Player_reloadtime;
    this.reloadPerc = 1;

    /*--------------------------------
    * Construct / Reset
    *--------------------------------*/
    this.resetGunValues = function() {
        this.isShooting = false;
        this.dtLastFire = 0;
        this.reloadPerc = 1;
    };


    /*--------------------------------
    * Idle ... not shooting
    *--------------------------------*/
    this.idle = function (dt) {
      //iterate
      this.dtLastFire += dt;
      this.reloadPerc = Math.min((this.dtLastFire / this.reloadTime), 1);

      //is still shooting/reloading?
      //if so ... just return
      if(this.isShooting && (this.dtLastFire > this.reloadTime)){
        this.isShooting = false;
      }
    };


    /*--------------------------------
    * Fire ... shoot bullet if can
    *--------------------------------*/
    this.fire = function (dt) {

        //escape if...not active player
        if(!commons.playerUtils.isLifecycleAlive(this.player)){
          this.resetGunValues();
          return;
        }

        //iterate
        this.dtLastFire += dt;
        this.reloadPerc = Math.min((this.dtLastFire / this.reloadTime), 1);

        //is still shooting/reloading?
        //if so ... just return
        if(this.isShooting && (this.dtLastFire > this.reloadTime)){
          this.isShooting = false;
        }
        else if(this.isShooting){
          return;
        }

        //step 2..
        //fire the gun
        const fireValues = commons.playerUtils.getBarrelPosition(this.player);
        const fireX = fireValues[0] - game.constants.Bullet_radius;
        const fireY = fireValues[1] - 2 * game.constants.Bullet_radius;
        const dirX = fireValues[2];
        const dirY = fireValues[3];

        game.manager.postBullet(this.player, fireX, fireY, dirX, dirY);
        this.dtLastFire = 0;
        this.reloadPerc = 0;
        this.isShooting = true;
    }
}
