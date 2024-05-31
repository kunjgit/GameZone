var numberofBoxElements = document.querySelectorAll(".box").length;

for (var i=0; i<numberofBoxElements; i++){
    
    document.querySelectorAll(".box")[i].addEventListener("mouseover", function(){
        
        var buttonInnerHTML = this.innerHTML;

        makeSound(buttonInnerHTML);
        
    });
}

document.addEventListener("keydown", function(event){

    makeSound(event.key);

});


function makeSound(key){

    switch (key){
        case "1":
            var du = new Audio('assets/do-80236.mp3');
            du.play();
            break;
        
        case "2":
            var la = new Audio('assets/la-80237.mp3');
            la.play();
            break;

        case "3":
            var mi = new Audio('assets/mi-80239.mp3');
            mi.play();
            break;

        case "4":
            var fa = new Audio('assets/fa-78409.mp3');
            fa.play();
            break;

        case "5":
            var si = new Audio('assets/si-80238.mp3');
            si.play();
            break;

        case "6":
            var re = new Audio('assets/re-78500.mp3');
            re.play();
            break;

        case "7":
            var sol = new Audio('assets/sol-101774.mp3');
            sol.play();
            break;

        case "8":
            var data = new Audio('assets/data-6460.mp3');
            data.play();
            break;

        case "9":
            var cas = new Audio('assets/casio--9759.mp3');
            cas.play();
            break;

        case "0":
            var ces = new Audio('assets/casio-9757.mp3');
            ces.play();
            break;

        case "-":
            var dol = new Audio('assets/g-6200.mp3');
            dol.play();
            break;

        case "=":
            var att = new Audio('assets/piano-37898.mp3');
            att.play();
            break;

        default: console.log(key);
    }
}







