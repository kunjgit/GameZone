function PlayerInput(){

    /*--------------------------------
    * Input to Track
    *--------------------------------*/
    this.jump = 0;
    this.up = 0;
    this.down = 0;
    this.left = 0;
    this.right = 0;
    this.shooting = 0;

    /*--------------------------------
    * Assemble / Clear
    *--------------------------------*/
    this.clone = function(){
      const i = new PlayerInput();
      i.jump = this.jump;
      i.up = this.up;
      i.down = this.down;
      i.left = this.left;
      i.right = this.right;
      i.shooting = this.shooting;
      return i;
    };
    this.clear = function(){
      this.copyFrom({});
    };
    this.copyFrom = function(other){

        this.jump = other.jump || 0;
        this.up = other.up || 0;
        this.down = other.down || 0;
        this.left = other.left || 0;
        this.right = other.right || 0;
        this.shooting = other.shooting || 0;
    };

    /*--------------------------------
    * Inspect
    *--------------------------------*/
    this.isAnyDirectionPressed = function(){
      if(this.jump > 0) return true;
      if(this.up > 0) return true;
      if(this.down > 0) return true;
      if(this.left > 0) return true;
      if(this.right > 0) return true;
      return false;
    };
    this.isAnyPressed = function(){
      if(this.isAnyDirectionPressed) return true;
      if(this.shooting > 0) return true;
      return false;
    }
}
