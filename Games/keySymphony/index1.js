document.addEventListener("DOMContentLoaded", () => {
    const pianoKeys = document.querySelectorAll(".Piano .key"),
        volumeSlider = document.querySelector(".sound input"),
        keyCheckbox = document.querySelector(".keys-checkbox input");

    let allKeys = [],
        audio = new Audio();

    const playTune = (key) => {
        audio.src = `tunes/${key}.wav`;
        audio.play();

        const clickedKey = document.querySelector(`[data-key="${key}"]`);
        if (clickedKey) {
            clickedKey.classList.add("active");
            setTimeout(() => {
                clickedKey.classList.remove("active");
            }, 160);
        }
    };

    const handleVolume = (e) => {
        audio.volume = e.target.value / 100;
    };

    const showHideKeys = () => {
        pianoKeys.forEach(key => key.classList.toggle("hide"));
    };

    pianoKeys.forEach(key => {
        allKeys.push(key.dataset.key);
        // Calling playTune function with passing data-key value as an argument
        key.addEventListener("click", () => playTune(key.dataset.key));
    });

    const pressedKey = (e) => {
        if (allKeys.includes(e.key)) playTune(e.key);
    };

    keyCheckbox.addEventListener("click", showHideKeys);
    volumeSlider.addEventListener("input", handleVolume);
    document.addEventListener("keydown", pressedKey);
});
