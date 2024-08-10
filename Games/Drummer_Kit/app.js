let allKeys = document.querySelectorAll('li')

//FUNCTIONS
const play =(audio)=>{
    if(!audio) return;
    audio.currentTime=0
    audio.play()
}
const playKey = (event)=>{
    let audio=document.querySelector(`audio[data-key="${event.keyCode}"]`)
    play(audio)
    let pressed=document.querySelector(`li[data-key="${event.keyCode}"]`)
    pressed.classList.add('playing')
}

const playClick=(event)=>{
    let clickedKey=event.target.getAttribute("data-key")
    let audio=document.querySelector(`audio[data-key="${clickedKey}"]`)
    play(audio)
    let pressed=document.querySelector(`li[data-key="${clickedKey}"]`)
    pressed.classList.add('playing')
}
//ACTIONS
allKeys.forEach(key=>key.addEventListener('transitionend',()=>{
    key.classList.remove('playing')
}))
window.addEventListener('keydown',playKey)

window.addEventListener('click',playClick)





