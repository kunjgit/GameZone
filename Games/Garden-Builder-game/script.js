const canvas = document.getElementById('garden');
const ctx = canvas.getContext('2d');
let selectedItem = null;
let items = []; // Array to hold placed items
let draggedItem = null;
let offsetX, offsetY;
let currItem = null;

// Load images
const images = {
    flower: new Image(),
    mix: new Image(),
    vegetable: new Image(),
    fence: new Image(),
    whitefence: new Image(),
    decor: new Image(),
    fountain: new Image(),
    foun: new Image(),
    road: new Image(),
    pavement: new Image(),
    fourroad: new Image()
};

// Set the source for each image
images.flower.src = 'images/photo3_.png';
images.mix.src = 'images/photo4_.png';
images.vegetable.src = 'images/photo10.png';
images.fence.src = 'images/photo6.png';
images.decor.src = 'images/photo2_.png';
images.whitefence.src = 'images/photo1_.png';
images.fountain.src = 'images/photo11.png';
images.foun.src = 'images/photo14.png';
images.pavement.src = 'images/photo15.png';
images.road.src = 'images/photo16.png';
images.fourroad.src = 'images/photo17.png';

// Define the desired width and height for each item
const itemSize = {
    flower: { width: 180, height: 150 },
    mix: { width: 180, height: 150 },
    vegetable: { width: 210, height: 200 },
    fence: { width: 200, height: 50 },
    whitefence: { width: 200, height: 50 },
    decor: { width: 200, height: 150 },
    fountain: { width: 150, height: 180 },
    foun: { width: 200, height: 150 },
    fourroad: { width: 180, height: 130 },
    pavement: { width: 180, height: 130 },
    road: { width: 150, height: 130 },
};

// Function to set the selected item
function selectItem(itemType) {
    selectedItem = itemType;
}

// Function to draw all items on the canvas
function drawItems() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    items.forEach(item => {
        const size = itemSize[item.type];
        ctx.save(); // Save the current state
        ctx.translate(item.x + size.width / 2, item.y + size.height / 2); // Move to the center of the item
        ctx.rotate(item.rotation); // Rotate the canvas
        ctx.drawImage(images[item.type], -size.width / 2, -size.height / 2, size.width, size.height); // Draw the item
        ctx.restore(); // Restore the previous state
    });
}

// Function to place the selected item on the canvas
function placeItem(x, y) {
    if (selectedItem && images[selectedItem]) {
        const size = itemSize[selectedItem];
        let height = size.height;
        if ((selectedItem === 'fence' || selectedItem === 'whitefence') && (currItem !== 'fence' || currItem === 'whitefence')) {
            height = 200;
        }

        // Check if there is already an item at the position
        const existingItem = items.find(item => {
            return x >= item.x + 10 && x <= item.x + size.width &&
                y >= item.y + 10 && y <= item.y + height;
        });

        if (!existingItem) {
            items.push({ type: selectedItem, x: x - size.width / 2, y: y - size.height / 2, rotation: 0 });
            drawItems();
        }
    }
}

// Function to rotate the selected item by a specified angle
function rotateItem(item, angle) {
    item.rotation += angle;
    drawItems(); // Redraw the items with the updated rotation
}

// Event listener for canvas clicks to place items
canvas.addEventListener('click', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (!draggedItem) {
        placeItem(x, y);
    }
});

// Event listener for mouse down to start dragging
canvas.addEventListener('mousedown', function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    draggedItem = items.find(item => {
        const size = itemSize[item.type];
        return x >= item.x && x <= item.x + size.width &&
            y >= item.y && y <= item.y + size.height;
    });

    if (draggedItem) {
        currItem = draggedItem;
        offsetX = x - draggedItem.x;
        offsetY = y - draggedItem.y;
    }
});

// Event listener for mouse move to drag item
canvas.addEventListener('mousemove', function(event) {
    if (draggedItem) {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        draggedItem.x = x - offsetX;
        draggedItem.y = y - offsetY;
        drawItems(); // Redraw all items including the moved one
    }
});

// Event listener for mouse up to stop dragging
canvas.addEventListener('mouseup', function() {
    draggedItem = null;
});

// Event listener for rotating the current item with keyboard keys
document.addEventListener('keydown', function(event) {
    if (currItem) {
        if (event.key === 'ArrowRight') { // Rotate right
            rotateItem(currItem, Math.PI / 16); // Rotate by a smaller angle (22.5 degrees)
        } else if (event.key === 'ArrowLeft') { // Rotate left
            rotateItem(currItem, -Math.PI / 16); // Rotate by a smaller angle (-22.5 degrees)
        }
    }
});