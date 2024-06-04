document.addEventListener("DOMContentLoaded", () => {
    const target = document.getElementById("target");
    const shootButton = document.getElementById("shootButton");
    const message = document.getElementById("message");
    const shotsLeft = document.getElementById("shotsLeft");
    const waterGun = document.getElementById("waterGun");
    const shotSound = document.getElementById("shotSound");

    let shots = 0;
    let Death = 0;
    shootButton.addEventListener("click", () => {
        shots++;
        const isShotSuccessful = Math.random() < 0.33;
        if (isShotSuccessful) {
            message.textContent = "Shot! You hit the target!";
            target.style.color = "blue";
            waterGun.src = "Gun_Shoot.png";
            Death++;
            shotSound.play();
        } else {
            message.textContent = "Safe! You missed.";
            target.style.color = "black";
        }
        shotsLeft.textContent = `Shots taken: ${shots}`;
        Deaths.textContent = `Deaths: ${Death}`;
        setTimeout(() => {
            waterGun.src = "Gun_Default.png";
        }, 3500);
    });
});