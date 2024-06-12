const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Set the canvas size to a reasonable size
canvas.width = 960;
canvas.height = 540;

const GAME_WORLD_WIDTH = canvas.width * 3; // Example game world size, 3 times the canvas width
const player = new Player();

// Adjust the background layers to span the entire game world
const backgroundLayers = [
    { src: 'assets/images/background/background_layer_1.png', zIndex: 1, x: 0 },
    { src: 'assets/images/background/background_layer_2.png', zIndex: 2, x: 0 },
    { src: 'assets/images/background/background_layer_3.png', zIndex: 3, x: 0 }
];

const loadedBackgrounds = [];

backgroundLayers.forEach(layer => {
    const img = new Image();
    img.src = layer.src;
    img.onload = () => {
        loadedBackgrounds.push({ img, zIndex: layer.zIndex, x: layer.x });
        if (loadedBackgrounds.length === backgroundLayers.length) {
            animate();
        }
    };
    img.onerror = () => {
        console.error('Failed to load image:', layer.src);
    };
});

const keys = {
    ' ': {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
};

let cameraOffsetX = 0;

function drawBackgrounds() {
    loadedBackgrounds.sort((a, b) => a.zIndex - b.zIndex);
    loadedBackgrounds.forEach(layer => {
        // Tile the background image to cover the entire game world width
        for (let i = -1; i <= GAME_WORLD_WIDTH / canvas.width; i++) {
            c.drawImage(layer.img, layer.x + i * canvas.width - cameraOffsetX, 0, canvas.width, canvas.height);
        }
    });
}

function animate() {
    window.requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    drawBackgrounds();

    player.velocity.x = 0;
    const playerSpeed = 2; // Adjust this value to make the player slower
    if (keys.d.pressed && player.position.x + player.width < GAME_WORLD_WIDTH) {
        player.velocity.x = playerSpeed;
    } else if (keys.a.pressed && player.position.x > 0) {
        player.velocity.x = -playerSpeed;
    }

    player.update();

    // Center the camera on the player, but constrain it within the bounds of the game world
    cameraOffsetX = Math.max(0, Math.min(player.position.x - canvas.width / 2 + player.width / 2, GAME_WORLD_WIDTH - canvas.width));

    player.draw(cameraOffsetX);
}
