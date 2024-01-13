import Monster from "./Monster.js";

class Vers extends Monster {
    constructor(){
        super(15,5,0);
    }

    /**
    * Attack
    */
    attack(ennemi){
        var degat = Math.floor(Math.random() * this.power) + 1;
        ennemi.hp -= degat;
        return degat;
    }
}
export default Vers;