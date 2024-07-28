var chicken=document.getElementById("chicken");
var obstacle=document.getElementById("obstacle");
var counter=0;

function jump(){
    if (chicken.classList !="animate"){
        chicken.classList.add("animate");
    }
    setTimeout(function(){
        chicken.classList.remove("animate");
    },500)
    counter++;
}
var lose =setInterval(function(){
    var chickenTop =
    parseInt(window.getComputedStyle(chicken).
        getPropertyValue("top"));
    var blockLeft=
    parseInt(window.getComputedStyle(obstacle).
    getPropertyValue("left"));
    if (blockLeft<20 && blockLeft>0 && chickenTop>=130){
        obstacle.style.animation="none";
        obstacle.style.display="none";
        alert("SCORE:" + counter);
        counter = 0;
    }

},10);
var tl=gsap.timeline()
tl.from("h1",{
    y:-50,
    opacity:0,
    delay:0.4,
    duration:0.8,
})
tl.from("p",{
    y:60,
    opacity:0,
    duration:0.5,
    stagger:0.5,
})