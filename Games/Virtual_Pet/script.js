// Initialize pet stats
let happiness = 100;
let hunger = 100;

// Function to update pet stats and display
function updateStats() {
    // Update displayed stats
    document.getElementById('happiness').innerText = happiness;
    document.getElementById('hunger').innerText = hunger;
    
    // Determine pet image based on happiness level
    let petImage = document.getElementById('pet-image');
    if (happiness >= 70) {
        petImage.src = 'assets/pet-happy.png';
    } else if (happiness >= 30) {
        petImage.src = 'assets/pet-neutral.png';
    } else {
        petImage.src = 'assets/pet-sad.png';
    }
}

// Function to feed the pet
function feedPet() {
    // Increase hunger and happiness, but ensure they don't exceed 100
    hunger = Math.min(hunger + 10, 100);
    happiness = Math.min(happiness + 5, 100);
    updateStats();
}

// Function to play with the pet
function playWithPet() {
    // Decrease hunger and increase happiness, but ensure they don't go below 0 or exceed 100
    hunger = Math.max(hunger - 5, 0);
    happiness = Math.min(happiness + 10, 100);
    updateStats();
}

// Function to decrease pet stats over time
function decreaseStats() {
    // Decrease hunger and happiness every 4 seconds, but ensure they don't go below 0
    hunger = Math.max(hunger - 5, 0);
    happiness = Math.max(happiness - 5, 0);
    updateStats();
    
    // Show alert if hunger or happiness falls below 10
    if (hunger < 10 || happiness < 10) {
        alert("Your pet needs attention!");
    }
}

// Call decreaseStats function every 4 seconds
setInterval(decreaseStats, 4000);

// Initial update of pet stats
updateStats();
