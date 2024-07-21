class General {
    
}

class Army {
    constructor(infantry, archery, chivalry,){
        this.infantry = infantry; 
        this.archery = archery;
        this.chivalry = chivalry;
    }
    
    get power(){
        return this.powerCalc();
    }

    powerCalc(){
        return this.infantry + (this.archery * 2) + (this.archery * 4);
    }
}

export function combat(){
    const quadrado = new Army(10,5,3);
}