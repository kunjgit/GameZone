class Character{
    /**
     * Personnage choisi
     * @param {string} name Name 
     * @param {int} hp Hp
     * @param {int} power Power
     * @param {int} xp Xp
     * @param {int} xpMax Xp Maximum
     * @param {int} energie Energie
     */

    constructor(name, hp, power, xp, xpMax, energie){
        this.name = name;
        this.hp = hp;
        this.power = power;
        this.xp = xp;
        this.xpMax = xpMax;
        this.energie = energie;
    }
    // Setter and Getter
    get getName() {
        return this.name;
    }
    set setName(name) {
        this.name = name;
    }
    get getHp() {
        return this.hp;
    }
    set setHp(hp) {
        this.hp = hp;
    }
    get getPower() {
        return this.power;
    }
    set setPower(power) {
        this.power = power;
    }
    get getXp() {
        return this.xp;
    }
    set setXp(xp) {
        this.xp = xp;
    }
    get getXpMax() {
        return this.xpMax;
    }
    set setXpMax(xp) {
        this.xpMax = this.xp;
    }
    get getEnergie() {
        return this.energie;
    }
    set setEnergie(energie) {
        this.energie = energie;
    }
    
}
export default Character;