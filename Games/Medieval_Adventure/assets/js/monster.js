class Monster{
    /**
     * Monstre ennemi
     * @param {int} hp Point de vie de l'ennemi
     * @param {int} power Pouvoir de l'ennemi
     * @param {int} energie Energie de l'ennemi
     */
    constructor(hp, power, energie){
        this.hp = hp;
        this.power = power;
        this.energie = energie;
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
    get getEnergie() {
        return this.energie;
    }
    set setEnergie(energie) {
        this.energie = energie;
    }
}
export default Monster;