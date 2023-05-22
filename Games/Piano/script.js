const pianoKeys = document.querySelectorAll('.key')

function playsound(newUrl) {
    new Audio(newUrl).play()
}

pianoKeys.forEach((pianoKey, i) => {
    const number = i < 9 ? '0' + (i + 1) : (i + 1)
    const newUrl = '24-piano-keys(1)/key' + number + '.mp3'

    pianoKey.addEventListener('click', () => playsound(newUrl))
})