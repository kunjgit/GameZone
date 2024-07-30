document.addEventListener("DOMContentLoaded", () => {
    const basket = document.getElementById("basket");
    const object = document.getElementById("object");
    const scoreDisplay = document.getElementById("score");

    let score = 0;
    let basketX = window.innerWidth / 2 - basket.offsetWidth / 2;
    let objectX = Math.random() * (window.innerWidth - object.offsetWidth);
    let objectY = -object.offsetHeight;

    const moveBasket = (e) => {
        if (e.key === "ArrowLeft") {
            basketX -= 20;
        } else if (e.key === "ArrowRight") {
            basketX += 20;
        }
        basketX = Math.max(0, Math.min(window.innerWidth - basket.offsetWidth, basketX));
        basket.style.left = `${basketX}px`;
    };

    const updateObject = () => {
        objectY += 5;
        if (objectY > window.innerHeight) {
            objectY = -object.offsetHeight;
            objectX = Math.random() * (window.innerWidth - object.offsetWidth);
        }
        object.style.top = `${objectY}px`;
        object.style.left = `${objectX}px`;
    };

    const checkCollision = () => {
        const basketRect = basket.getBoundingClientRect();
        const objectRect = object.getBoundingClientRect();
        
        if (
            objectRect.left < basketRect.right &&
            objectRect.right > basketRect.left &&
            objectRect.top < basketRect.bottom &&
            objectRect.bottom > basketRect.top
        ) {
            score++;
            scoreDisplay.textContent = `Score: ${score}`;
            objectY = -object.offsetHeight;
            objectX = Math.random() * (window.innerWidth - object.offsetWidth);
        }
    };

    document.addEventListener("keydown", moveBasket);

    const gameLoop = () => {
        updateObject();
        checkCollision();
        requestAnimationFrame(gameLoop);
    };

    gameLoop();
});
