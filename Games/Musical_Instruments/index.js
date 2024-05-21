var i;
for(i=0;i<7;i++)
{                            // Detecting clicks
    document.querySelectorAll(".drum ")[i].addEventListener("click",function(){
        makeSound(this.innerHTML);
        buttonAnimation(this.innerHTML);
        
    });
}

                              //Detecting keys
    document.addEventListener("keypress",function(e){
        makeSound(e.key);
        buttonAnimation(e.key);
        
    });
  

                            // Generating sound

    function makeSound(key)
    {
        switch(key)
        {
            case 'w'  :  
                var audio= new Audio('sounds/tom-1.mp3');
                audio.play();
                break;
            case 'a':
                var audio= new Audio('sounds/tom-2.mp3');
                audio.play();
                break;
            case 's':
                var audio= new Audio('sounds/tom-3.mp3');
                audio.play();
                break;
            case 'd':
                var audio= new Audio('sounds/tom-4.mp3');
                audio.play();
                break;
            case 'j':
                var audio= new Audio('sounds/crash.mp3');
                audio.play();
                break;
            case 'k':
                var audio= new Audio('sounds/kick-bass.mp3');
                audio.play();
                break;
            case 'l':
                var audio= new Audio('sounds/snare.mp3');
                audio.play();
        }
    }
    
                        // Generating Animation
    function buttonAnimation(currentKey)
    {
        var press=document.querySelector("."+currentKey);
        press.classList.add("pressed");
        setTimeout(function(){
            press.classList.remove("pressed"); }, 200);

    }
  
