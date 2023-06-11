function Sounds() {
    this.explosion = jsfxr([3,,0.1972,0.7238,0.4589,0.0411,,0.2774,,,,,,,,0.381,,,1,,,,,0.3]);
    this.gunfire = jsfxr([0, , 0.09, , 0.09, 0.5046, , -0.6396, , , , , , 0.0468, , 0.44, , , 1, , , , , 0.5]);

    this.gunFireAudio = new Audio();
    this.gunFireAudio.loop = true;
    this.gunFireAudio.src = this.gunfire;
}