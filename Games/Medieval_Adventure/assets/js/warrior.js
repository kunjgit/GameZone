import Character from "./Character.js";

class Warrior extends Character {
    maxEnergie;
    maxHp;
    degat;
    constructor(){
        super(window.localStorage.getItem('Name'),20,4,0,10,6);
        this.maxEnergie = this.energie;
        this.maxHp = this.hp;
        this.degat = 0;
    }

    /**
    * Shield
    */
    capacite1(){
        if(this.energie >= 4){
            this.energie -= 4;
            window.localStorage.setItem('Protection', 'true');
            return " protects himself."
        }
        return " can't protect himself."
    }

    /**
     * Sword
     */
    capacite2(ennemi){
        if(this.energie >= 2){
            this.energie -= 2;
            var degat = Math.floor(Math.random() * this.power) + 1;
            ennemi.hp -= degat;
            return " inflicts " + degat +" damage on the enemy.";
        }
        return " cannot attack."; 
    }
}
export default Warrior;