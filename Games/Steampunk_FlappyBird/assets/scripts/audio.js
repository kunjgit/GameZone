class AudioControl{
    constructor(){
        this.charge=document.getElementById('charge')
        this.flap1=document.getElementById('flap1')
        this.flap2=document.getElementById('flap2')
        this.flap3=document.getElementById('flap3')
        this.flap4=document.getElementById('flap4')
        this.flap5=document.getElementById('flap5')
        this.flap5=document.getElementById('flap5')
        this.flapSounds=[this.flap1,this.flap2,this.flap3,this.flap4,this.flap5]

        this.win=document.getElementById('win')
        this.lose=document.getElementById('lose')

    }
    // the problem with handling audio in browser is that b4 the first sound finished playing the next one wont work so we create a custom method to reinitialise the sound each time 
    play(sound){
        sound.currentTime=0;
        sound.play();
    }
}