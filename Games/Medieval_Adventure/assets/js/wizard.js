import Character from "./Character.js";

class Wizard extends Character{
    maxEnergie;
    maxHp;
    degat;
    constructor(){
        super(window.localStorage.getItem('Name'),15,2,0,10,10);
        this.maxEnergie = this.energie;
        this.maxHp = this.hp;
        this.degat = 0;
    }

    /**
    * Soin
    */
    capacite1(){
        if (this.energie >= 5 ){
            this.energie -= 5;
            this.hp += 5 ;
            if(this.hp >= this.maxHp){
                this.hp = this.maxHp;
                document.getElementById("character-hp").style.width = '100%';
                return " is 100% cured."
            }
            let hpJoueurRestant = this.hp * 100 / this.maxHp;
            document.getElementById("character-hp").style.width = hpJoueurRestant+'%';
            return " is cured of 5 hp."
        } 
        return " can't take care of himself."
    }

    /**
     * Attaque basique du hero 
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
export default Wizard;