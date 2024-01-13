import Character from "./Character.js";

class Blob extends Character {
    maxEnergie;
    maxHp;
    degat;
    constructor(){
        super(window.localStorage.getItem('Name'),100,1,0,10,1);
        this.maxEnergie = this.energie;
        this.maxHp = this.hp;
    }

    /**
    * Repos
    */
    capacite1(){
        if(this.energie >= 1){
            this.energie -= 1;
            this.hp += 1;
            if(this.hp == this.maxHp){
                return " is resting, he's already at maximum hp.";
            }
            return " rests, recovers 1 pv.";
        }
        return " can't do anything."
    }

    /**
     * Attack
     */
    capacite2(ennemi){
        if(this.energie >= 1){
            this.energie -= 1;
            ennemi.hp -= 1;
            return " inflicts 1 damage on the enemy.";
        }
        return " is tired, he can't do anything."; 
    }
}
export default Blob;