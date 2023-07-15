var count = 3;

function Rabbit1(){
    count = count - 1;
    counter(count);
    document.getElementById("btn1").disabled = true;

}
function Rabbit2(){
    count = count - 1;
    counter(count);
    document.getElementById("btn2").disabled = true;

}
function Rabbit3(){
    count = count - 1;
    counter(count);
    document.getElementById("btn3").disabled = true;

}

function counter(count){
    if(count == 0){
        alert("Awesome! You found all the rabbits!!")
        alert("Click on OK to play again.")
        location.reload();
    }
    else{
        alert("Wow! More "+count+" Rabbit left!");
    }

}


function update(e){
    var x = e.clientX || e.touches[0].clientX
    var y = e.clientY || e.touches[0].clientY

    document.documentElement.style.setProperty('--cursorX', x + 'px')
    document.documentElement.style.setProperty('--cursorY', y + 'px')
  }

  document.addEventListener('mousemove',update)
  document.addEventListener('touchmove',update)
