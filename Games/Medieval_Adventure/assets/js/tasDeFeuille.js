import Monster from "./Monster.js";

class TasDeFeuille extends Monster {
    constructor(){
        super(20,6,0);
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
export default TasDeFeuille;