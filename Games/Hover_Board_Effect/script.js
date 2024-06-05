const container = document.getElementById('container')
const colors = ['#fe0303', '#1500ff', '#ff00c3', '#03bae7', '#259c15', '#0e4706', '#d4db1e', '#455a0b', '#58df3a', '#12d0ae', '#b044f8', '#e907e9', '#7b6738', '#e907a5']
const SQUARES = 500

for(let i = 0; i < SQUARES; i++) {
    const square = document.createElement('div')
    square.classList.add('square')

    square.addEventListener('mouseover', () => setColor(square))

    square.addEventListener('mouseout', () => removeColor(square))

    container.appendChild(square)
}

function setColor(element) {
   const color = getRandomColor()
   element.style.background = color
   element.style.boxShadow = `0 0 2px ${color}, 0 0 10px ${color}`
}

function removeColor(element) {
   element.style.background = '#1d1d1d'
   element.style.boxShadow = '0 0 2px #000'
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)]
}