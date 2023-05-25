function Opponent(power, rotation){
    this.power = power || (Math.random() * 75 + 1);
    this.rotation = rotation || (Math.random()*6.283)-3.141;
    this.evaluation = 0;
}