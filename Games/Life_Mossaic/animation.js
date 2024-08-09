// used to animate side navbar
gsap.from(".game-settings .sidenav .animate", {
    duration: 1,
    x: -500,
    ease: "power1.inOut",
    stagger: 0.2
});
document.getElementById("toggleButton").addEventListener("click", function animateNav() {
    gsap.set(".game-settings .sidenav .animate", { x: -500 });

    gsap.to(".game-settings .sidenav .animate", {
        duration: 1,
        x: 0,
        ease: "power1.inOut",
        stagger: 0.3
    });
});
// used to animate the heading
gsap.from(".heading", {
    duration: 1,
            y: -500,
            ease: "power1.inOut",
            stagger: 0.2,
            onComplete: function() {
                // After the initial animation, start the yoyo bouncing effect
                gsap.to(".heading", {
                    duration: 1,
                    y: -5,
                    ease: "power1.inOut",
                    yoyo: true,
                    repeat: -1
                });}
});
// used to animate the grid
gsap.from(".grid-container", {
    duration: 1,
    x: 1000,
    ease: "power1.inOut",
    stagger: 0.2
});
