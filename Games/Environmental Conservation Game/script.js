const game = document.getElementById('game');
const player = document.getElementById('player');
const scoreSpan = document.getElementById('score');
let score = 0;

document.addEventListener('keydown', movePlayer);

function movePlayer(e) {
    const playerPos = player.getBoundingClientRect();
    if (e.key === 'ArrowLeft' && playerPos.left > 0) {
        player.style.left = playerPos.left - 10 + 'px';
    }
    if (e.key === 'ArrowRight' && playerPos.right < window.innerWidth) {
        player.style.left = playerPos.left + 10 + 'px';
    }
}

function createItem() {
    const item = document.createElement('div');
    item.classList.add('item');
    item.classList.add(Math.random() > 0.5 ? 'recyclable' : 'trash');
    item.style.left = Math.random() * (window.innerWidth - 30) + 'px';
    game.appendChild(item);

    let itemInterval = setInterval(() => {
        const itemPos = item.getBoundingClientRect();
        const playerPos = player.getBoundingClientRect();

        if (itemPos.top > window.innerHeight) {
            clearInterval(itemInterval);
            game.removeChild(item);
        } else if (
            itemPos.bottom > playerPos.top &&
            itemPos.left < playerPos.right &&
            itemPos.right > playerPos.left
        ) {
            clearInterval(itemInterval);
            game.removeChild(item);

            if (item.classList.contains('recyclable')) {
                score += 10;
            } else {
                score -= 5;
            }
            scoreSpan.textContent = score;
        } else {
            item.style.top = itemPos.top + 5 + 'px';
        }
    }, 20);
}

setInterval(createItem, 1000);
