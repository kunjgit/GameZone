window.addEventListener('keydown', (event) => {
    switch (event.key) {
        case ' ':
            if (player.velocity.y === 0) {
                player.velocity.y = -10;
                player.setAnimation('jump');
            }
            break;
        case 'a':
            keys.a.pressed = true;
            player.setAnimation('run'); // Change to 'walk' if you prefer walk animation
            player.direction = 'left'; // Set direction to left
            break;
        case 'd':
            keys.d.pressed = true;
            player.setAnimation('run'); // Change to 'walk' if you prefer walk animation
            player.direction = 'right'; // Set direction to right
            break;
        case 'f': // Example for attack
            player.setAnimation('attack');
            break;
    }
});

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'a':
            keys.a.pressed = false;
            if (!keys.d.pressed) {
                player.setAnimation('idle');
            }
            break;
        case 'd':
            keys.d.pressed = false;
            if (!keys.a.pressed) {
                player.setAnimation('idle');
            }
            break;
        case 'f': // Example for attack
            player.setAnimation('idle');
            break;
    }
});
