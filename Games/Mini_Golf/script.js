const vol = document.getElementById("sound");
const now = document.getElementById("now");
const frands = document.getElementById("frands");

now.addEventListener('click' , e =>{
    e.preventDefault();
    window.location.href = 'courses/course1.html'
})

frands.addEventListener('click', e=>{
    e.preventDefault();
    window.alert('COMING SOON!!!');
})