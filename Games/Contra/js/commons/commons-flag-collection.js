function Flags(){

    /*--------------------------------
    * Vars
    *--------------------------------*/
    this.flags = {};


    /*--------------------------------
    * Get / Set
    *--------------------------------*/
    this.setFlag = function(name, val){
      this.flags[name] = val;
    };
    this.getFlag = function(name){
      return this.flags[name]; ;
    };
}
