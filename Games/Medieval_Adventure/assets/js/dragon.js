import Monster from "./Monster.js";

class Dragon extends Monster {
    constructor(){
        super(35,7,0);
    }

    /**
    * Attaque du monstre
    */
    attack(ennemi){
        var degat = Math.floor(Math.random() * this.power) + 1;
        ennemi.hp -= degat;
        return degat;
    }
}
export default Dragon;