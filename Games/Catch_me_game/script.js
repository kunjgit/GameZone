var box = document.getElementById('box');
box.style.top = Math.floor(Math.random() * 50).toString() + "px";
box.style.left = Math.floor(Math.random() * 50).toString() + "px";

box.addEventListener('mousemove', function ()
{
    let viewport_width=window.innerWidth;
    let viewport_height=window.innerHeight;

    let box_height=box.clientHeight;
    let box_width=box.clientWidth;

    box.style.top = Math.floor(Math.random() * (viewport_height-box_height)).toString() + "px";
    box.style.left = Math.floor(Math.random() * (viewport_width-box_width)).toString() + "px";
})
